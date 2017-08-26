
// Everything required to set up the app.
$(window).ready(function() {
  var socketProxy = new SocketProxy();
  var appState = new AppState();

  window.io = window.io || undefined;

  var layer = new SocketLayer(window.io, socketProxy)
  layer.init();

  window.p = new PhotoView(window.Config, appState);
  bv = new ButtonView();
  snackbar = new Snackbar(socketProxy);

  var ssm = new ShmileStateMachine(window.p, socketProxy, appState, window.Config, bv, snackbar)

  bv.fsm = ssm.fsm;
  // snackbar.fsm = ssm.fsm;

  window.socketProxy = socketProxy;

  socketProxy.on('template', (template) => {
    console.log("blah " + template.overlayImage);
    layer.register(ssm.fsm);
    bv.render();
    snackbar.render();
    p.render(template);

    // p.setOverlay(template.overlayImage);
    // p.setPicturesTotal(template.photosTotal);
    // p.setLayout(template.photoView);

    ssm.fsm.connected();
  });
  // socketProxy.on("printer_enabled", () => {
  //     ssm.fsm.show_print_message();
  // });
  // socketProxy.on("review_composited", () => {
  //   setTimeout(function() {
  //     ssm.fsm.next_set()
  //   }, self.config.next_delay);
  // });
});
