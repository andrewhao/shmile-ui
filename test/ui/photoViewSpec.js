var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		PhotoView = require('../../ui/photoView'),
		config = require('../../ui/config'),
		AppState = require('../../ui/appState')

describe('PhotoView', function() {
	describe('#render', function() {
		it("renders a frame", function() {
		  var state = new AppState();
			var viewportEl = $('<div id="viewport"></div>')
			$('body').append(viewportEl);
		  var subject = new PhotoView(config, state);
			subject.render()
			expect($('svg').children().length).toBeGreaterThan(0);
		});
	});
});
