import Config from '../../ui/config'

describe("Config", function() {
	it("returns a config object", function() {
		expect(Config.flash_duration).toEqual(1000);
	});
});
