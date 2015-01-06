var ButtonView = function() {}
ButtonView.prototype.render = function() {
  // init code
  startButton = $('button#start-button');
  var buttonX = (Config.window_width - startButton.outerWidth())/2;
  var buttonY = (Config.window_height - startButton.outerHeight())/2;

  startButton.hide();

  // Position the start button in the center
  startButton.css({'top': buttonY, 'left': buttonX});

  var buttonTriggerEvt = Config.is_mobile ? "touchend" : "click";

  startButton.bind(buttonTriggerEvt, function(e) {
    var button = $(e.currentTarget);
    button.fadeOut(1000);
    $(document).trigger('ui_button_pressed');
  });

  $(document).bind('ui_button_pressed', function() {
    console.log('ui_button_pressed evt');
    fsm.ui_button_pressed();
  });
}
