var Snackbar = function(socket) {
  this.socket = socket;
  // this.fsm = fsm;
}
Snackbar.prototype.render = function() {
  this.snackbar = document.getElementById('snackbar');
}
Snackbar.prototype.pressed = function() {
  this.socket.emit("print")
  // this.fsm.print_set
  this.hideMe();
}
Snackbar.prototype.showMe = function() {
  if (self.snackbar.classClass !== "showMe") {
    this.snackbar.className = "showMe";
  }
}
Snackbar.prototype.hideMe = function() {
  var self = this;
  if (self.snackbar.className === "showMe") {
    self.snackbar.className = "hideMe";
    setTimeout(function() {
      self.snackbar.className = "";
    }, 2300);
  }
}
