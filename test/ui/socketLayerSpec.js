import SocketLayer from '../../ui/socketLayer'
import Backbone from 'backbone'
import _ from 'underscore'

describe("SocketLayer", function() {
	beforeEach(function() {
		this.io = jasmine.createSpyObj('io', ['connect'])
		this.proxy = jasmine.createSpyObj('proxy', ['lateInitialize'])
		_.extend(this.proxy, Backbone.Events)
		this.subject = new SocketLayer(this.io, this.proxy);
	});

	describe("#init", function() {
		it("connects to the socket", function() {
			this.subject.init()
			expect(this.io.connect).toHaveBeenCalled();
		});

		it("lateInitializes the proxy", function() {
			this.subject.init()
			expect(this.proxy.lateInitialize).toHaveBeenCalled();
		});
	});

	describe("#register", function() {
		it('binds the "connect" socket event to the "connected" fsm event trigger', function() {
			let fsm = jasmine.createSpyObj('fsm', ['connected']);
			this.subject.register(fsm);
			this.proxy.trigger('connect')
			expect(fsm.connected).toHaveBeenCalled()
		});

		it('binds the "photo_saved" socket event to trigger "photo_saved" on the fsm', function() {
			let fsm = jasmine.createSpyObj("fsm", ['photo_saved']);
			this.subject.register(fsm);
			this.proxy.trigger('photo_saved', {filename: 'foo'})
			expect(fsm.photo_saved).toHaveBeenCalled()
		});
	});
});
