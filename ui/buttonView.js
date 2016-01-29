import config from './config';
import $ from 'jquery';

var ButtonView = function (channel) {
	  this.channel = channel;
};

ButtonView.prototype.render = function () {
  var self = this;
  // init code
  this.startButton = $('button#start-button');
  var buttonX = (config.window_width - this.startButton.outerWidth()) / 2;
  var buttonY = (config.window_height - this.startButton.outerHeight()) / 2;

  this.startButton.hide();

  // Position the start button in the center
  this.startButton.css({ 'top': buttonY, 'left': buttonX });

  var buttonTriggerEvt = config.is_mobile ? 'touchend' : 'click';

  this.startButton.bind(buttonTriggerEvt, function (e) {
    var button = $(e.currentTarget);
    button.fadeOut(1000);
    self.channel.trigger('ui_button_pressed');
  });
};

ButtonView.prototype.fadeIn = function () {
  this.startButton.fadeIn();
};

module.exports = ButtonView;
