/**
 * A class of utility methods.
 */
function CameraUtils() {};

/**
 * Play the snap effect.
 * @param {Integer} idx
 *   The frame index to place the updated image.
 * @param {Function} cheeseCB
 *   Code to execute after "Cheese" is displayed.
 *   Typically, this wraps the command to fire the shutter.
 */
CameraUtils.snap = function(idx, cheeseCb) {
  p.zoomFrame(idx, 'in');
  // These guys need to be promises.
  p.modalMessage('Ready?', Config.ready_delay, 200, function() {
    p.modalMessage("3", 1000, 200, function() {
      p.modalMessage("2", 1000, 200,  function() {
        p.modalMessage("1", 1000, 200, function() {
          cheeseCb();
        });
      });
    });
  });
}

/**
 * Given a max w and h bounds, return the dimensions
 * of the largest 4x6 rect that will fit within.
 */
CameraUtils.scale4x6 = function(maxw, maxh) {
    var s0 = 6/4; // width / height
    var s1 = maxw/maxh;

    // Then the width is longer. Use the shorter side (height)
    if (s0 <= s1) {
        return {w: maxh * 6/4, h: maxh};
    } else {
        return {w: maxw, h: maxw * 4/6}
    }
}

var Config = {
  photo_margin: 50, // Margin for the composite photo per side
  window_width: $(window).width(),
  window_height: $(window).height() - 10,
  overlay_delay: 2000,
  next_delay: 10000,
  cheese_delay: 400,
  flash_duration: 1000,
  ready_delay: 2000,
  nice_delay: 5000,

  // The amount of time we should pause between each frame shutter
  // I tend to bump this up when 1) photobooth participants want more
  // time to review their photos between shots, and 2) when I'm shooting
  // with external flash and the flash needs more time to recharge.
  between_snap_delay: 1000,

  // For usability enhancements on iPad, set this to "true"
  is_mobile: false
}

// Current app state.
var State = {
  photoset: [],
  set_id: null,
  current_frame_idx: 0,
  zoomed: null
};


/*
 * STATE MACHINE DEFINITION
 * Keep track of app state and logic.
 *
 * + loading
 *   - connected() -> ready
 * + ready
 *   - ui_button_pressed() (DOM button click) -> waiting_for_photo
 * + waiting_for_photo
 *   - photo_saved() -> review_photo
 * + review_photo
 *   - photo_updated() -> next_photo
 * + next_photo
 *   - continue_partial_set() -> waiting_for_photo
 *   - finish_set() -> ready
 *
 * @param [PhotoView]
 * @param [Socket] The initialized Socket
 * @param [State]
 * @param [Config]
 */
ShmileStateMachine = function(photoView, socket, State, Config, buttonView) {
  this.photoView = photoView;
  this.socket = socket;
  this.State = State;
  this.Config = Config;
  this.buttonView = buttonView

  var self = this;

  return StateMachine.create({
    initial: 'loading',
    events: [
      { name: 'connected', from: 'loading', to: 'ready' },
      { name: 'ui_button_pressed', from: 'ready', to: 'waiting_for_photo' },
      { name: 'photo_saved', from: 'waiting_for_photo', to: 'review_photo' },
      { name: 'photo_updated', from: 'review_photo', to: 'next_photo' },
      { name: 'continue_partial_set', from: 'next_photo', to: 'waiting_for_photo' },
      { name: 'finish_set', from: 'next_photo', to: 'review_composited' },
      { name: 'next_set', from: 'review_composited', to: 'ready'}
    ],
    callbacks: {
      onconnected: function() {
        self.photoView.animate('in', function() {
          self.buttonView.fadeIn();
        });
      },
      onenterready: function() {
        self.photoView.resetState();
      },
      onleaveready: function() {
      },
      onenterwaiting_for_photo: function(e) {
        cheeseCb = function() {
          self.photoView.modalMessage('Cheese!', Config.cheese_delay);
          self.photoView.flashStart();
          self.socket.emit('snap', true);
        }
        CameraUtils.snap(self.State.current_frame_idx, cheeseCb);
      },
      onphoto_saved: function(e, f, t, data) {
        // update UI
        // By the time we get here, the idx has already been updated!!
        self.photoView.flashEnd();
        self.photoView.updatePhotoSet(data.web_url, self.State.current_frame_idx, function() {
          setTimeout(function() {
            fsm.photo_updated();
          }, Config.between_snap_delay)
        });
      },
      onphoto_updated: function(e, f, t) {
        self.photoView.flashEnd();
        // We're done with the full set.
        if (self.State.current_frame_idx == 3) {
          fsm.finish_set();
        }
        // Move the frame index up to the next frame to update.
        else {
          self.State.current_frame_idx = (self.State.current_frame_idx + 1) % 4
          fsm.continue_partial_set();
        }
      },
      onenterreview_composited: function(e, f, t) {
        self.socket.emit('composite');
        self.photoView.showOverlay(true);
        setTimeout(function() { fsm.next_set() }, Config.next_delay);
      },
      onleavereview_composited: function(e, f, t) {
        // Clean up
        self.photoView.animate('out');
        self.photoView.modalMessage('Nice!', Config.nice_delay, 200, function() {
          self.photoView.slideInNext();
        });
      },
      onchangestate: function(e, f, t) {
        console.log('fsm received event '+ e +', changing state from ' + f + ' to ' + t)
      }
    }
  });
}

/**
 * Proxy object that allows the late initialization of the socket, if one
 * exists at all. In instances where we never initialize the socket, we allow
 * for a fake Socket object using a Backbone Event channel.
 */
var SocketProxy = function() {
  this.socket = null;
  this.fakeSocket = {};
  _.extend(this.fakeSocket, Backbone.Events)
}

SocketProxy.prototype.lateInitialize = function(socket) {
  this.socket = socket;
}

SocketProxy.prototype.on = function(evt, cb) {
  if (this.socket === null) {
    console.log("SocketProxy 'on' delegating to fakeSocket")
    this.fakeSocket.on(evt, cb)
    return
  }
  this.socket.on(evt, cb);
}

SocketProxy.prototype.emit = function(msg, data) {
  if (this.socket === null) {
    console.log("SocketProxy 'emit' delegating to fakeSocket")
    this.fakeSocket.trigger(msg, function() {
      console.log(data)
    });
    return
  }
  this.socket.emit(msg, data);
}

/**
 * Responsible for initializing the connection to socket.io.
 * @param io [Socket]
 * @param fsm [StateMachine]
 */
var SocketLayer = function(io, proxy) {
  this.io = io;
  this.proxy = proxy;
}

/**
 * Attempt a connection to socket.io server.
 * If this fails, will no-op and silently continue.
 */
SocketLayer.prototype.init = function() {
  try {
    this.socket = this.io.connect("/");
    this.proxy.lateInitialize(this.socket);
  } catch(e) {
    console.log("Error initializing socket connection: " + e);
  }
  return this;
}

/**
 * Register bindings and callbacks.
 */
SocketLayer.prototype.register = function(fsm) {
  this.fsm = fsm;
  var self = this;

  this.proxy.on('message', function(data) {
    console.log('message evt: data is:' + data);
  });

  this.proxy.on('connect', function() {
    console.log('connected evt');
    self.fsm.connected();
  });

  this.proxy.on('camera_snapped', function() {
    console.log('camera_snapped evt');
    //fsm.camera_snapped();
  })

  this.proxy.on('photo_saved', function(data) {
    console.log('photo_saved evt: ' + data.filename);
    self.fsm.photo_saved(data);
  });
}

var PhotoView = Backbone.View.extend({
  id: "#viewport",

  initialize: function(config) {
    this.config = config
    this.canvas = new Raphael('viewport', this.config.window_width, this.config.window_height);
    this.frames = this.canvas.set(); // List of SVG black rects
    this.images = this.canvas.set(); // List of SVG images
    this.all = this.canvas.set();
    this.overlayImage = null;
    this.photoBorder = 0;
    this.compositeDim = null;
    this.frameDim = null;
    this.compositeOrigin = null;
    this.compositeCenter = null;
  },

  render: function() {
    var w = this.config.window_width - this.config.photo_margin;
    var h = this.config.window_height - this.config.photo_margin;
    this.compositeDim = CameraUtils.scale4x6(w, h);
    this.compositeOrigin = {
        x: (this.config.window_width - this.compositeDim.w) / 2,
        y: (this.config.window_height - this.compositeDim.h) / 2
    };
    this.compositeCenter = {
        x: this.compositeOrigin.x + (this.compositeDim.w/2),
        y: this.compositeOrigin.y + (this.compositeDim.h/2)
    }
    var r = this.canvas.rect(this.compositeOrigin.x, this.compositeOrigin.y, this.compositeDim.w, this.compositeDim.h);

    r.attr({'fill': 'white'});

    this.all.push(r);

    // Scale the photo padding too
    this.photoBorder = this.compositeDim.w / 50;

    //upper x
    var frame_x = this.compositeOrigin.x + this.photoBorder;
    var frame_y = this.compositeOrigin.y + this.photoBorder;
    this.frameDim = {
        w: (this.compositeDim.w - (3*this.photoBorder))/2,
        h: (this.compositeDim.h - (3*this.photoBorder))/2
    };
    var frame = this.canvas.rect(frame_x, frame_y, this.frameDim.w, this.frameDim.h);
    frame.attr({'fill': 'black'});
    var img = this.canvas.image(null, frame_x, frame_y, this.frameDim.w, this.frameDim.h);

    this.images.push(img);
    this.frames.push(frame);
    this.all.push(img);
    this.all.push(frame);

    frame = frame.clone();
    img = img.clone();
    frame.translate(this.frameDim.w + this.photoBorder, 0);
    img.translate(this.frameDim.w + this.photoBorder, 0);
    this.frames.push(frame);
    this.images.push(img);
    this.all.push(frame);
    this.all.push(img);

    frame = frame.clone();
    img = img.clone();
    frame.translate(-(this.frameDim.w + this.photoBorder), this.frameDim.h + this.photoBorder);
    img.translate(-(this.frameDim.w + this.photoBorder), this.frameDim.h + this.photoBorder);
    this.frames.push(frame);
    this.images.push(img);
    this.all.push(frame);
    this.all.push(img);

    frame = frame.clone();
    img = img.clone();
    frame.translate(this.frameDim.w + this.photoBorder, 0);
    img.translate(this.frameDim.w + this.photoBorder, 0);
    this.frames.push(frame);
    this.images.push(img);
    this.all.push(frame);
    this.all.push(img);

    // Draw the PNG logo overlay.
    var o = this.canvas.image(
        '/images/overlay.png',
        this.compositeOrigin.x,
        this.compositeOrigin.y,
        this.compositeDim.w,
        this.compositeDim.h);
    this.all.push(o);
    this.overlayImage = o;

    // Hide everything and move out of sight.
    this.all.hide();
    this.all.translate(-this.config.window_width, 0);
  },

  toString: function() {
    ret = [];
    ret.push("Size of 'all' set: " + this.all.length);
    ret.push("Size of 'frames' set: " + this.frames.length);
    ret.push("Composite photo is: " + this.all[0].attr('width') + 'x' + this.all[0].attr('height'));
    ret.push("Frame photo is: " + this.frameDim.w + 'x' + this.frameDim.h);
    return ret.join('\n');
  },

  /**
   * Updates the image at the set location.
   * @param {String} img_src
   *   The URL of the image resource the browser should fetch and display
   * @param {Integer} idx
   *   Index of frame to update
   * @param cb
   *   The callback to be executed when the UI has finished updating and zooming out.
   */
  updatePhotoSet: function(img_src, idx, cb) {
    var view = this;
    var imgEl = view.images[idx];
    var frameEl = view.frames[idx];

    imgEl.attr({'src': img_src, 'opacity': 0});
    imgEl.show();

    var afterShowPhoto = function () {
      // We've found and revealed the photo, now hide the old black rect and zoom out
      frameEl.hide();
      p.zoomFrame(idx, 'out', cb);
    }
    imgEl.animate({'opacity': 1}, 200, afterShowPhoto);
  },

  /**
   * For in: assume the view has been rendered and reset to initial state and moved out of sight.
   * Slide in the composite image.
   * For out: assume the composite image is centered. Move out of sight and hide.
   */
  animate: function(dir, cb) {
    if (dir === 'in') {
      this.all.show();
      this.images.hide();
      this.overlayImage.hide();
      this.all.animate({
        'translation': this.config.window_width+",0"
      }, 1000, "<>", cb);
    } else if (dir === 'out') {
      this.all.animate({
        'translation': this.config.window_width+",0"
      }, 1000, "<>", cb);
    }
  },

  /**
   * zoomFrame zooms into the indicated frame.
   * Call it once to zoom in, call it again to zoom out.
   *
   * @param idx Frame index
   *   Expect zoomFrame(1) to be matched immediately by zoomFrame(1)
   * frame: 0 (upper left), 1 (upper-right), 2 (lower-left), 3 (lower-right)
   * @param dir 'in' or 'out'
   *   Zoom in or out
   * @param onfinish
   *   Callback executed when the animation is finished.
   *
   * Depends on the presence of the State.zoomed object to store zoom info.
   */
  zoomFrame: function(idx, dir, onfinish) {
      var view = this;
      var composite = this.all[idx];

      var frame = this.frames[idx];
      var frameX = frame.attr('x');
      var frameW = frame.attr('width');
      var frameY = frame.attr('y');
      var frameH = frame.attr('height');
      var centerX = frameX + frameW/2;
      var centerY = frameY + frameH/2;

      var animSpeed = 700;

      // delta to translate to.
      var dx = this.compositeCenter.x - centerX;
      var dy = this.compositeCenter.y - centerY;
      var scaleFactor = this.compositeDim.w / this.frameDim.w;

      if (dir === "out" && State.zoomed) {
          scaleFactor = 1;
          dx = -State.zoomed.dx;
          dy = -State.zoomed.dy;
          view.all.animate({
              'scale': [1, 1, view.compositeCenter.x, view.compositeCenter.y].join(','),
          }, animSpeed, 'bounce', function() {
              view.all.animate({
                  'translation': dx+','+dy
              }, animSpeed, '<>', onfinish)
          });
          // Clear the zoom data.
          State.zoomed = null;
      } else if (dir !== "out") {
          view.all.animate({
              'translation': dx+','+dy
          }, animSpeed, '<>', function() {
              view.all.animate({
                  'scale': [scaleFactor, scaleFactor, view.compositeCenter.x, view.compositeCenter.y].join(','),
              }, animSpeed, 'bounce', onfinish)
          });
          // Store the zoom data for next zoom.
          State.zoomed = {
              dx: dx,
              dy: dy,
              scaleFactor: scaleFactor
          };
      }
  },

  /**
   * Reset visibility, location of composite image for next round.
   */
  slideInNext: function() {
      this.resetState();
      this.modalMessage('Next!');
      this.all.hide();
      this.all.translate(-this.config.window_width * 2, 0);
      this.animate('in', function() {
        $('#start-button').fadeIn();
      });
  },

  /**
   * Resets the state variables.
   */
  resetState: function () {
      State = {
          photoset: [],
          set_id: null,
          current_frame_idx: 0,
          zoomed: null
      };
  },

  /**
   * Faux camera flash
   */
  flashEffect: function(duration) {
    if (duration === undefined) { duration = 200; }
    var rect = this.canvas.rect(0, 0, this.config.window_width, this.config.window_height);
    rect.attr({'fill': 'white', 'opacity': 0});
    rect.animate({'opacity': 1}, duration, ">", function() {
      rect.animate({'opacity': 0}, duration, "<");
      rect.remove();
    })
  },

  flashStart: function(duration) {
    if (duration === undefined) { duration = 200; }
    this.rect = this.canvas.rect(0, 0, this.config.window_width, this.config.window_height);
    this.rect.attr({'fill': 'white', 'opacity': 0});
    this.rect.animate({'opacity': 1}, duration, ">")
  },

  flashEnd: function(duration) {
    if (duration === undefined) { duration = 200; }
    var self = this;
    this.rect.animate({'opacity': 0}, duration, "<", function() {
      self.remove();
    });
  },

  /**
   * Draws a modal with some text.
   */
  modalMessage: function(text, persistTime, animateSpeed, cb) {
      if (animateSpeed === undefined) { var animateSpeed = 200; }
      if (persistTime === undefined) { var persistTime = 500; }

      var sideLength = this.config.window_height * 0.3;
      var x = (this.config.window_width - sideLength)/2;
      var y = (this.config.window_height - sideLength)/2;
      var all = this.canvas.set();
      var r = this.canvas.rect(x, y,
          sideLength,
          sideLength,
          15);
      r.attr({'fill': '#222',
              'fill-opacity': 0.7,
              'stroke-color': 'white'});
      all.push(r);
      var txt = this.canvas.text(x + sideLength/2, y + sideLength/2, text);
      txt.attr({'fill': 'white',
          'font-size': '50',
          'font-weight': 'bold'
      });
      all.push(txt);
      all.attr({'opacity': 0});
      all.animate({
          'opacity': 1,
          'scale': '1.5,1.5',
          'font-size': '70'
      }, animateSpeed, '>');

      // Timer to delete self nodes.
      var t = setTimeout(function(all) {
          // Delete nodes
          txt.remove();
          r.remove();
          if (cb) cb();
      }, persistTime, all);
  },

  /**
   * Applies the final image overlay to the composite image.
   * This will usually contain the wedding logo: 24-bit transparent PNG
   */
  showOverlay: function(animate) {
      this.overlayImage.show();
      if (animate) {
          //this.overlayImage.attr({'opacity':0});
        this.overlayImage.animate({'opacity':1}, this.config.overlay_delay);
      }
  },

  /**
   * Removes the overlay
   */
  hideOverlay: function(animate) {
    var view = this;
    if (animate) {
      this.overlayImage.animate({'opacity':0}, this.config.overlay_delay, function() {
        view.overlayImage.hide();
      });
    } else {
      this.overlayImage.hide();
    }
  }
});

var ButtonView = function(fsm) {
  this.fsm = fsm;
}

ButtonView.prototype.render = function() {
  var self = this;
  // init code
  this.startButton = $('button#start-button');
  var buttonX = (Config.window_width - this.startButton.outerWidth())/2;
  var buttonY = (Config.window_height - this.startButton.outerHeight())/2;

  this.startButton.hide();

  // Position the start button in the center
  this.startButton.css({'top': buttonY, 'left': buttonX});

  var buttonTriggerEvt = Config.is_mobile ? "touchend" : "click";

  this.startButton.bind(buttonTriggerEvt, function(e) {
    var button = $(e.currentTarget);
    button.fadeOut(1000);
    $(document).trigger('ui_button_pressed');
  });

  $(document).bind('ui_button_pressed', function() {
    console.log('ui_button_pressed evt');
    self.fsm.ui_button_pressed();
  });
}
ButtonView.prototype.fadeIn = function() {
  this.startButton.fadeIn();
}


// Everything required to set up the app.
$(window).ready(function() {
  var socketProxy = new SocketProxy();

  window.io = window.io || undefined;

  window.p = new PhotoView(window.Config);
  bv = new ButtonView();

  window.fsm = new ShmileStateMachine(window.p, socketProxy, window.State, window.Config, bv)

  bv.fsm = window.fsm

  var layer = new SocketLayer(window.io, socketProxy)
  layer.init();
  layer.register(fsm);

  window.socketProxy = socketProxy

  bv.render();
  p.render();
});
