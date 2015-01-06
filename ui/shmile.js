
// Everything required to set up the app.
$(window).ready(function() {
  var socketProxy = new SocketProxy();

  window.io = window.io || undefined;

  window.p = new PhotoView(window.Config);
  bv = new ButtonView();

  window.fsm = new ShmileStateMachine(window.p, socketProxy, window.State, window.Config, bv)

  bv.fsm = window.fsm

  var layer = new SocketLayer(window.io, socketProxy)
  layer.init();
  layer.register(fsm);

  window.socketProxy = socketProxy

  bv.render();
  p.render();
});
