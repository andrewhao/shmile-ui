import FakeServer from "../../ui/fakeServer"

describe("FakeServer", function() {
	describe("#initialize", function() {
		beforeEach(() => jasmine.clock().install())
		afterEach(() => jasmine.clock().uninstall())
		it("emits a 'connect' event", function() {
			let channel = jasmine.createSpyObj(['emit', 'on']);
			let fs = new FakeServer()
			fs.initialize(channel);
			jasmine.clock().tick(1001)

			expect(channel.emit).toHaveBeenCalledWith('connect');
		});
	});
});
