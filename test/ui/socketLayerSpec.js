import SocketLayer from '../../ui/socketLayer'

describe("SocketLayer", function() {
	beforeEach(function() {
		this.io = {}
		this.proxy = {}
		this.subject = new SocketLayer(this.io, this.proxy);
	});

	describe("#init", function() { });
});
