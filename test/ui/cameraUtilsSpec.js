describe("CameraUtils", function() {
  describe(".snap", function() {
		it('counts down with a modal message', function(done) {
			var photoView = jasmine.spy();
			var photoIndex = 0;

			expect(photoView).toReceive('zoomFrame').with(photoIndex, 'in');
			expect(photoView).toReceive('modalMessage').with('3', 1000, 200);
			expect(photoView).toReceive('modalMessage').with('2', 1000, 200);
			expect(photoView).toReceive('modalMessage').with('1', 1000, 200);
			CameraUtils.snap(photoView, photoIndex, done);
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
