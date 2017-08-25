var LandscapeOneByThree = function(config) {
  this.config = config;
  this.paper = new Raphael('viewport', this.config.window_width, this.config.window_height);
  this.frames = this.paper.set(); // List of SVG black rects
  this.images = this.paper.set(); // List of SVG images
  this.all = this.paper.set();
  // this.overlayImage = null;
  // this.photoBorder = 0;
  this.compositeDim = null;
  this.frameDim = null;
  this.compositeOrigin = null;
  this.compositeCenter = null;
  // this.state = state;
  this.totalPictures = 3;
  // this.photoViewLayout = null;
  this.size =  {w: 2000, h: 750};
  this.frameSize = {w: 633.33, h:422.22}
  this.frameSpacing = 50;
  this.translationTotal = {dx:0, dy:0};
}

LandscapeOneByThree.prototype.render = function() {
  var w = this.config.window_width - this.config.photo_margin;
  var h = this.config.window_height - this.config.photo_margin;
  this.compositeDim = CameraUtils.scale3x8(w, h);
  this.compositeOrigin = {
    x: (this.config.window_width - this.compositeDim.w) / 2,
    y: (this.config.window_height - this.compositeDim.h) / 2
  };
  this.compositeCenter = {
    x: this.compositeOrigin.x + (this.compositeDim.w/2),
    y: this.compositeOrigin.y + (this.compositeDim.h/2)
  }
  var r = this.paper.rect(this.compositeOrigin.x, this.compositeOrigin.y, this.compositeDim.w, this.compositeDim.h);

  r.attr({'fill': 'white'});

  this.all.push(r);

  // Scale the photo padding too
  // this.photoBorder = this.compositeDim.w / 50;

  //upper x
  // var frame_x = this.compositeOrigin.x + this.photoBorder;
  // var frame_y = this.compositeOrigin.y + this.photoBorder;
  //
  // var _frame_w = (this.compositeDim.w - (2*this.photoBorder));

  // this.frameDim = {
  //   w: (this.compositeDim.w - (2*this.photoBorder)),
  //   h: _frame_w * 4/6 // TODO: Fixed aspect ratio?
  // };
  var scaleFactor = this.compositeDim.h / this.size.h;

  var frameDim = {
    w: scaleFactor * this.frameSize.w,
    h: scaleFactor * this.frameSize.h
  }
  var spacing = this.frameSpacing * scaleFactor;
  var frame = this.paper.rect(this.compositeOrigin.x, this.compositeOrigin.y + spacing, frameDim.w, frameDim.h);
  frame.attr({'fill': 'black', 'id': 'frame0'});
  var img = this.paper.image(null, this.compositeOrigin.x, this.compositeOrigin.y + spacing, frameDim.w, frameDim.h);

  this.images.push(img);
  this.frames.push(frame);
  this.all.push(img);
  this.all.push(frame);

  for (var i = 1; i < 3; i++) {
    frame = frame.clone();
    img = img.clone();
    frame.translate(spacing + frameDim.w, 0);
    frame.attr({'id': 'frame' + i});
    img.translate(spacing + frameDim.w, 0);
    this.frames.push(frame);
    this.images.push(img);
    this.all.push(frame);
    this.all.push(img);
  }

  return [this.paper, this.all];
}

LandscapeOneByThree.prototype.toString = function() {
  ret = [];
  ret.push("Size of 'all' set: " + this.all.length);
  ret.push("Size of 'frames' set: " + this.frames.length);
  ret.push("Composite photo is: " + this.all[0].attr('width') + 'x' + this.all[0].attr('height'));
  ret.push("Frame photo is: " + this.frameDim.w + 'x' + this.frameDim.h);
  return ret.join('\n');
}

/**
* Updates the image at the set location.
* @param {String} img_src
*   The URL of the image resource the browser should fetch and display
* @param {Integer} idx
*   Index of frame to update
* @param cb
*   The callback to be executed when the UI has finished updating and zooming out.
*/
LandscapeOneByThree.prototype.updatePhotoSet = function(img_src, idx, cb) {
  var view = this;
  var imgEl = view.images[idx];
  var frameEl = view.frames[idx];
  // var imgEl = view.c

  return [imgEl, frameEl]
}



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
* Depends on the presence of the .zoomed object to store zoom info.
*/
LandscapeOneByThree.prototype.zoomFrame = function(idx, dir, state, onfinish) {
  var view = this;
  // var composite = this.all[idx];

  var frame = this.frames[idx];
  var frameX = frame.attr('x');
  var frameW = frame.attr('width');
  var frameY = frame.attr('y');
  var frameH = frame.attr('height');
  var centerX = frameX + frameW/2;
  var centerY = frameY + frameH/2;

  var animSpeed = 1000;

  // delta to translate to.
  var dx = this.compositeCenter.x - centerX;
  var dy = this.compositeCenter.y - centerY;


  if (dir === "out" && state.zoomed) {
    // scaleFactor = 1;
    view.translationTotal.dx -= state.zoomed.dx;
    view.translationTotal.dy -= state.zoomed.dy;
    view.all.animate({
      'scale': [1, 1, view.compositeCenter.x, view.compositeCenter.y].join(','),
    }, animSpeed, 'bounce', //onFinish);
    function() {
      if (idx == view.totalPictures - 1) {
        view.all.animate({
          'translation': view.translationTotal.dx+','+view.translationTotal.dy
        }, animSpeed, '<>', onfinish)
      } else {
        onfinish();
      }
    });
    return null;
  } else if (dir !== "out") {
    var scaleFactor = this.compositeDim.h / frameH;
    view.all.animate({
      'translation': dx+','+dy
    }, animSpeed, '<>', function() {
      view.all.animate({
        'scale': [scaleFactor, scaleFactor, view.compositeCenter.x, view.compositeCenter.y].join(','),
      }, animSpeed, 'bounce', onfinish)
    });
    // Store the zoom data for next zoom.
    return  {
      dx: dx,
      dy: dy
      // scaleFactor: scaleFactor
    };
  }
}

LandscapeOneByThree.prototype.calculateOutTranslation = function (idx, state, onfinish) {
  var view = this;
  var animSpeed = 1000;

  if (view.shouldRestoreOutState) {
    view.all.animate({
      'translation': [-state.dx, -state.dy].join(',')
    }, animSpeed, '<>', onfinish);
  } else {
    view.translationTotal.dx -= state.zoomed.dx;
    view.translationTotal.dy -= state.zoomed.dy;
    if (idx == view.totalPictures - 1) {
      view.all.animate({
        'translation': view.translationTotal.dx+','+view.translationTotal.dy
      }, animSpeed, '<>', onfinish);
    } else {
      onfinish();
    }
  };
};
LandscapeOneByThree.prototype.removeImages = function () {
  // this.images.clear();
  // for (var i = 0; i < this.totalPictures; i++) {
  //   this.images.pop();
  // }
  this.images.hide();
  this.frames.show();
  this.translationTotal.dx = 0;
  this.translationTotal.dy = 0;
}

LandscapeOneByThree.prototype.createOverlayImage = function(overlayImage) {
  return this.paper.image(
    overlayImage,
    this.compositeOrigin.x,
    this.compositeOrigin.y,
    this.compositeDim.w,
    this.compositeDim.h);
  }
