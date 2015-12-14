var CameraUtils = require('../../ui/cameraUtils');

describe("CameraUtils", function() {
  describe(".snap", function() {
		it('counts down with a modal message', function() {
			var photoView = {
				zoomFrame: function() {},
				modalMessage: function(_msg, _delay1, _delay2, cb) { cb() }
			};

			spyOn(photoView, 'zoomFrame');
			spyOn(photoView, 'modalMessage').and.callThrough();

			CameraUtils.snap(photoView, 0, function() {});

			expect(photoView.zoomFrame).toHaveBeenCalled();
			expect(photoView.modalMessage).toHaveBeenCalled();
			expect(photoView.modalMessage.calls.count()).toEqual(4);
		});
  });

	describe('.scale4x6', function() {
		it('scales the maximum 4x6 image that will fit the rect', function() {
			var w = 600
			var h = 600
			expect(CameraUtils.scale4x6(w, h)).toEqual({w: 600, h: 400});
		});
	});
});
