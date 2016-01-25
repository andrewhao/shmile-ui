var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		PhotoView = require('../../ui/photoView'),
		config = require('../../ui/config'),
		AppState = require('../../ui/appState')

describe('PhotoView', function() {
	beforeEach(function() {
		this.state = new AppState();
		this.viewportEl = $('<div id="viewport"></div>')
		$('body').append(this.viewportEl);
		this.subject = new PhotoView(config, this.state);
	});

	afterEach(function() {
		this.subject.destroy();
	});

	describe('#render', function() {
		it("renders a frame", function() {
			this.subject.render()
			expect($('svg.photo-view')).toExist();
			expect($('svg').children().length).toBeGreaterThan(0);
		});

		it("renders four black frames", function() {
			this.subject.render()
			let expected1 = $('svg').find('.frame-1')
			let expected2 = $('svg').find('.frame-2')
			let expected3 = $('svg').find('.frame-3')
			let expected4 = $('svg').find('.frame-4')
			expect(expected1).toExist()
			expect(expected2).toExist()
			expect(expected3).toExist()
			expect(expected4).toExist()
		});

		it("renders four empty images", function() {
			this.subject.render()
			let expected1 = $('svg').find('.image-1')
			let expected2 = $('svg').find('.image-2')
			let expected3 = $('svg').find('.image-3')
			let expected4 = $('svg').find('.image-4')
			expect(expected1).toExist()
			expect(expected2).toExist()
			expect(expected3).toExist()
			expect(expected4).toExist()
		});

		it("renders an overlay", function() {
			this.subject.render()
			expect($('svg').find('.overlay')).toExist()
		});

		// TODO: Does not properly hide in the test.
		xit('does not show the SVG', function() {
			this.subject.render()
			expect($('svg')).not.toBeVisible();
		})
	});

	describe('#toString', function() {
		it('returns a string', function() {
			this.subject.render();
			expect(this.subject.toString()).toContain("Size of 'all' set");
		});
	});

	describe('#data', function() {
		it("returns a set of data", function() {
			this.subject.render()
		  expect($('.photo-view').length).toEqual(1);
		  expect(this.subject.data().num_elements).toEqual(10);
		});
	});
});
