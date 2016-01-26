let FakeServer = function() {}

FakeServer.prototype.initialize = function(channel) {
	console.log("Fake server sending 'connected' event.");
	setTimeout(() => channel.emit('connect'), 1000)
	channel.on('snap', function() {
		setTimeout(() => {
			channel.emit('camera_begin_snap')
			setTimeout(() => {
			  channel.emit('camera_snapped')
				setTimeout(() => {
			    channel.emit('photo_saved', () => {
					})
				}, 1000);
			}, 1000)
		}, 1000);
	});
}

module.exports = FakeServer
window.FakeServer = FakeServer
