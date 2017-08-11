
// Everything required to set up the app.
$(window).ready(function() {
  var socketProxy = new SocketProxy();
  var appState = new AppState();

  window.io = window.io || undefined;

  var layer = new SocketLayer(window.io, socketProxy)
  layer.init();

  window.p = new PhotoView(window.Config, appState);
  bv = new ButtonView();

  var ssm = new ShmileStateMachine(window.p, socketProxy, appState, window.Config, bv)

  bv.fsm = ssm.fsm;

  window.socketProxy = socketProxy;

  socketProxy.on('template', (template) => {
    console.log("blah " + template.overlayImage);
    layer.register(ssm.fsm);
    bv.render();
    p.render(template);

    // p.setOverlay(template.overlayImage);
    // p.setPicturesTotal(template.photosTotal);
    // p.setLayout(template.photoView);

    ssm.fsm.connected();
  });
});
