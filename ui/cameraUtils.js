/**
 * A class of utility methods.
 */
 var CameraUtils = function() {};

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

CameraUtils.scale4x1 = function(maxw, maxh) {
    var s0 = 6/4; // width / height
    var s1 = maxw/maxh;

    // Then the width is longer. Use the shorter side (height)
    if (s0 <= s1) {
        return {w: maxh * 4/6 * 0.5, h: maxh};
    } else {
        return {w: maxw, h: maxw * 6/4 * 0.5}
    }
}

/**
 * Given a max w and h bounds, return the dimensions
 * of the largest 3x8 rect that will fit within.
 */
CameraUtils.scale3x8 = function(maxw, maxh) {
    var s0 = 8/3; // width / height
    var s1 = maxw/maxh;

    // Then the width is longer. Use the shorter side (height)
    if (s0 <= s1) {
        return {w: maxh * s0, h: maxh};
    } else {
        return {w: maxw, h: maxw * s0}
    }
}
