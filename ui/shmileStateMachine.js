
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
var ShmileStateMachine = function(photoView, socket, appState, config, buttonView) {
  this.photoView = photoView;
  this.socket = socket;
  this.appState = appState;
  this.config = config;
  this.buttonView = buttonView

  var self = this;

  this.fsm = StateMachine.create({
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
        if (self.appState.current_frame_idx == 3) {
          self.fsm.finish_set();
        }
        // Move the frame index up to the next frame to update.
        else {
          self.appState.current_frame_idx = (self.appState.current_frame_idx + 1) % 4
          self.fsm.continue_partial_set();
        }
      },
      onenterreview_composited: function(e, f, t) {
        self.socket.emit('composite');
        self.photoView.showOverlay(true);
        setTimeout(function() {
          self.fsm.next_set()
        }, self.config.next_delay);
      },
      onleavereview_composited: function(e, f, t) {
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
