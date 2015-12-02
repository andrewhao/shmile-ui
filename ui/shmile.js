
// Everything required to set up the app.
$(window).ready(function() {
  var socketProxy = new SocketProxy();
  var appState = new AppState();

	// Inter-object communication layer.
	var channel = {};
	_.extend(channel, Backbone.Events);

  window.io = window.io || undefined;

  var p = new PhotoView(window.Config, appState, channel);
  var bv = new ButtonView(channel);
  var ssm = new ShmileStateMachine(p, socketProxy, appState, window.Config, bv)

	var eventHandler = new StateMachineEventHandler(ssm, channel).init();

  bv.fsm = ssm.fsm

  var layer = new SocketLayer(window.io, socketProxy)
  layer.init();
  layer.register(ssm.fsm);

  window.socketProxy = socketProxy

  bv.render();
  p.render();
});
