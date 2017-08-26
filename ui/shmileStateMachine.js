
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
 * @param [Socket]            The initialized Socket
 * @param [AppState] appState Global initialized state
 * @param [Config] config     The configuration options passed to the app
 */
var ShmileStateMachine = function(photoView, socket, appState, config, buttonView, snackbar) {
  this.photoView = photoView;
  this.socket = socket;
  this.appState = appState;
  this.config = config;
  this.buttonView = buttonView;
  this.snackbar = snackbar;

  var self = this;

  this.buttonPrint = null;
  this.shouldSendNotPrinting = false;

  self.socket.on("printer_enabled", () => {
    console.log("socket printer_enabled received");
      self.shouldSendNotPrinting = true;
      self.fsm.show_print_message();
      // FIXME: consider a bigger timeout here?
      self.buttonPrint = setTimeout(function(){
        // alert("Hello");
        self.fsm.show_message();
      }, self.config.next_delay);
  });
  self.socket.on("review_composited", () => {
    setTimeout(function() {
      self.fsm.show_message()
    }, self.config.next_delay);
  });
  self.socket.on("print", () => {
    // setTimeout(function() {
    self.fsm.print_set();
    // }, self.config.next_delay);
  });

  this.fsm = StateMachine.create({
    initial: 'loading',
    events: [
      { name: 'connected', from: 'loading', to: 'ready' },
      { name: 'ui_button_pressed', from: 'ready', to: 'waiting_for_photo' },
      { name: 'photo_saved', from: 'waiting_for_photo', to: 'review_photo' },
      { name: 'photo_updated', from: 'review_photo', to: 'next_photo' },
      { name: 'continue_partial_set', from: 'next_photo', to: 'waiting_for_photo' },
      { name: 'finish_set', from: 'next_photo', to: 'review_composited' },
      { name: 'show_print_message', from: 'review_composited', to: 'print_message' },
      { name: 'print_set', from: 'print_message', to: 'printing'},
      // { name: 'print_ok', from: 'printing', to: 'ready'},
      { name: 'print_not_ok', from: 'printing', to: 'show_error_message'},
      { name: 'show_message', from: ['review_composited', 'print_message', 'printing', 'show_error_message'], to: 'show_goodbye_message'},
      { name: 'next_set', from: 'show_goodbye_message', to: 'ready'}
    ],
    callbacks: {
      onconnected: function() {
        console.log("onconnected");
        self.photoView.animate('in', function() {
          self.buttonView.fadeIn();
        });
      },
      onenterready: function() {
        self.shouldSendNotPrinting = false;
        self.photoView.resetState();
      },
      onleaveready: function() {
      },
      onenterwaiting_for_photo: function(e) {
        cheeseCb = function() {
          self.photoView.modalMessage('Cheese!', self.config.cheese_delay);
          self.photoView.flashStart();
          self.socket.emit('snap', true);
        }
        CameraUtils.snap(self.appState.current_frame_idx, cheeseCb);
      },
      onphoto_saved: function(e, f, t, data) {
        // update UI
        // By the time we get here, the idx has already been updated!!
        self.photoView.flashEnd();
        self.photoView.updatePhotoSet(data.web_url, self.appState.current_frame_idx, function() {
          setTimeout(function() {
            self.fsm.photo_updated();
          }, self.config.between_snap_delay)
        });
      },
      onphoto_updated: function(e, f, t) {
        self.photoView.flashEnd();
        // We're done with the full set.
        var pictures = self.photoView.getPicturesTotal()
        if (self.appState.current_frame_idx == pictures - 1) {
          self.fsm.finish_set();
        }
        // Move the frame index up to the next frame to update.
        else {
          self.appState.current_frame_idx = (self.appState.current_frame_idx + 1) % pictures
          self.fsm.continue_partial_set();
        }
      },
      onenterreview_composited: function(e, f, t) {
        self.socket.emit('composite');
        self.photoView.showOverlay(true);
      },
      // FIXME: onenter_printing_set
      onenterprinting: function(e, f, t) {
        clearTimeout(self.buttonPrint);
        self.shouldSendNotPrinting = false;
        // self.socket.emit('print');
        setTimeout(function() {
          self.fsm.show_message();
        }, self.config.between_snap_delay);
      },
      onentershow_goodbye_message: function(e, f, t) {
        // Clean up
        self.fsm.next_set();
        self.snackbar.hideMe();
        if (self.shouldSendNotPrinting) {
          self.socket.emit('do_not_print')
        }
      },
      onenterprint_message: function(e, f, t) {
        self.snackbar.showMe();
        // setTimeout(function() {
        //   self.fsm.print_set();
        // }, 2000)
      },
      // onenterprinting: function(e, f, t) {
      //
      // },
      onleaveshow_goodbye_message: function(e, f, t) {
        // Clean up
        self.photoView.animate('out');
        self.photoView.modalMessage('Nice!', self.config.nice_delay, 200, function() {
          self.photoView.slideInNext();
        });
      },
      onchangestate: function(e, f, t) {
        console.log('fsm received event '+ e +', changing state from ' + f + ' to ' + t)
      }
    }
  });
}
