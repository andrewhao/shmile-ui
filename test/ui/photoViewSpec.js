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

	describe('#render', function() {
		it("renders a frame", function() {
			this.subject.render()
			expect($('svg').children().length).toBeGreaterThan(0);
		});

		it("renders four black frames", function() {

		});
	});
});
