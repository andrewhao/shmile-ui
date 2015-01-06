// Everything required to set up the app.
$(window).ready(function() {

  var mockSocket = $('<div id="mockSocket">');
  $('body').append(mockSocket);

  window.socket = (typeof socket === "undefined") ? mockSocket : window.socket
  window.io = window.io || {
    connect: function() { return window.socket; }
  }; // maybe a mockIo?

  window.p = new PhotoView(window.Config);
  window.fsm = new ShmileStateMachine(window.p, window.socket, window.State, window.Config)
  var layer = new SocketLayer(io, window.fsm);
  layer.register();

  bv = new ButtonView();
  bv.render();
  p.render();
});
