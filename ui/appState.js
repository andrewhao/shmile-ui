/**
 * Describes the current state of the UI.
 */
var AppState = function() {
  this.reset();
};

AppState.prototype.reset = function() {
  this.current_frame_idx = 0;
  this.zoomed = null;
}
