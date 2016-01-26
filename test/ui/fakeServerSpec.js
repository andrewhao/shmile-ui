import FakeServer from "../../ui/fakeServer"

describe("FakeServer", function() {
	describe("#initialize", function() {
		it("emits a 'connect' event", function() {
			let channel = jasmine.createSpyObj(['emit']);
			let fs = new FakeServer()
			fs.initialize(channel);

			expect(channel.emit).toHaveBeenCalledWith('connect');
		});
	});
});
