import _ from 'underscore'
import Backbone from 'backbone'
/**
 * Proxy object that allows the late initialization of the socket, if one
 * exists at all. In instances where we never initialize the socket, we allow
 * for a fake Socket object using a Backbone Event channel.
 */
var SocketProxy = function() {
  this.socket = null;
  this.nullChannel = {};
  _.extend(this.nullChannel, Backbone.Events)
}

SocketProxy.prototype.lateInitialize = function(socket) {
  this.socket = socket;
}

SocketProxy.prototype.channel = function() {
	return this.isLive() ? this.socket : this.nullChannel;
};

SocketProxy.prototype.isLive = function() {
	return this.socket !== null;
}

SocketProxy.prototype.on = function(evt, cb) {
  if (this.socket === null) {
    console.log(`SocketProxy 'on' delegating '${evt}' to nullChannel`)
    this.nullChannel.on(evt, cb)
    return
  }
  this.socket.on(evt, cb);
}

SocketProxy.prototype.emit = function(msg, data) {
  if (this.socket === null) {
    console.log(`SocketProxy 'emit' delegating '${msg}' to nullChannel`)
    this.nullChannel.trigger(msg, function() {
			console.log(`Triggering ${msg} on nullChannel`);
      console.log(data)
    });
    return
  }
  this.socket.emit(msg, data);
}

module.exports = SocketProxy;
