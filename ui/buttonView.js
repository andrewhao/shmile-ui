var ButtonView = function(fsm) {
  this.fsm = fsm;
}

ButtonView.prototype.render = function() {
  var self = this;
  // init code
  this.startButton = $('button#start-button');
  var buttonX = (Config.window_width - this.startButton.outerWidth())/2;
  var buttonY = (Config.window_height - this.startButton.outerHeight())/2;

  this.startButton.hide();

  // Position the start button in the center
  this.startButton.css({'top': buttonY, 'left': buttonX});

  var buttonTriggerEvt = Config.is_mobile ? "touchend" : "click";

  this.startButton.bind(buttonTriggerEvt, function(e) {
    var button = $(e.currentTarget);
    button.fadeOut(1000);
    $(document).trigger('ui_button_pressed');
  });

  $(document).bind('ui_button_pressed', function() {
    console.log('ui_button_pressed evt');
    self.fsm.ui_button_pressed();
  });
}
ButtonView.prototype.fadeIn = function() {
  this.startButton.fadeIn();
}
