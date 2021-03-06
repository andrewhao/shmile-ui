import config from './config';

/**
 * A bucket of utility methods.
 */
var CameraUtils = function () {};

/**
 * Play the snap effect.
 *
 * @param {PhotoView} photoView
 * @param {Integer} idx
 *   The frame index to place the updated image.
 * @param {Function} cheeseCb
 *   Code to execute after "Cheese" is displayed.
 *   Typically, this wraps the command to fire the shutter.
 */
CameraUtils.snap = function (photoView, idx, cheeseCb) {
  photoView.zoomFrame(idx, 'in');
  // These guys need to be promises.
  photoView.modalMessage('Ready?', config.ready_delay, 200, function () {
    photoView.modalMessage('3', 1000, 200, function () {
      photoView.modalMessage('2', 1000, 200, function () {
        photoView.modalMessage('1', 1000, 200, function () {
          cheeseCb();
        });
      });
    });
  });
};

/**
 * Given a max w and h bounds, return the dimensions
 * of the largest 4x6 rect that will fit within.
 */
CameraUtils.scale4x6 = function (maxw, maxh) {
  var s0 = 6 / 4; // width / height
  var s1 = maxw / maxh;

    // Then the width is longer. Use the shorter side (height)
  if (s0 <= s1) {
      return { w: maxh * 6 / 4, h: maxh };
    } else {
      return { w: maxw, h: maxw * 4 / 6 };
    }
};

module.exports = CameraUtils;
