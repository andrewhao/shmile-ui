let FakeServer = function() {}

FakeServer.prototype.initialize = function(channel) {
	console.log("Fake server sending 'connected' event.");
	channel.emit('connect');
}

module.exports = FakeServer
window.FakeServer = FakeServer
