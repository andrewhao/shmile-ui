// Repsonsible for initializing the connection to socket.io.
// @param io [Socket]
// @param fsm [StateMachine]
var SocketLayer = function(io, fsm) {
  this.socket = io.connect("/");
  this.fsm = fsm;
}

// Register bindings and callbacks.
SocketLayer.prototype.register = function() {
  var self = this;
  this.socket.on('message', function(data) {
    console.log('data is' + data);
  });

  this.socket.on('connect', function() {
    console.log('connected evt');
    self.fsm.connected();
  });

  this.socket.on('camera_snapped', function() {
    console.log('camera_snapped evt');
    //fsm.camera_snapped();
  })

  this.socket.on('photo_saved', function(data) {
    console.log('photo_saved evt: '+data.filename);
    self.fsm.photo_saved(data);
  });
}
