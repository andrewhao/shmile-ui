import _ from 'underscore'
import Backbone from 'backbone'
/**
 * Proxy object that allows the late initialization of the socket, if one
 * exists at all. In instances where we never initialize the socket, we allow
 * for a fake Socket object using a Backbone Event channel.
 */
var SocketProxy = function() {
  this.socket = null;
  this.nullSocket = {};
  _.extend(this.nullSocket, Backbone.Events)
}

SocketProxy.prototype.lateInitialize = function(socket) {
  this.socket = socket;
}

SocketProxy.prototype.on = function(evt, cb) {
  if (this.socket === null) {
    console.log("SocketProxy 'on' delegating to nullSocket")
    this.nullSocket.on(evt, cb)
    return
  }
  this.socket.on(evt, cb);
}

SocketProxy.prototype.emit = function(msg, data) {
  if (this.socket === null) {
    console.log("SocketProxy 'emit' delegating to nullSocket")
    this.nullSocket.trigger(msg, function() {
      console.log(data)
    });
    return
  }
  this.socket.emit(msg, data);
}

module.exports = SocketProxy;
