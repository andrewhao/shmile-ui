import SocketProxy from '../../ui/socketProxy'
import _ from 'underscore'
import Backbone from 'backbone'

describe('SocketProxy', function() {
	beforeEach(function() {
		this.realSocket = jasmine.createSpyObj('realSocket', ['emit', 'on']);
		this.subject = new SocketProxy()
	});

	describe('#lateInitialize', function() {
		it("assigns the given socket with the provided socket", function() {
			expect(this.subject.socket).toEqual(null);
			this.subject.lateInitialize(this.realSocket);
			expect(this.subject.socket).toEqual(this.realSocket);
		});
	});

	describe('#on', function() {
		describe('with a socket', function() {
			beforeEach(function() {
				this.subject.lateInitialize(this.realSocket)
			});

			it("binds the event", function() {
				let data = {}
				this.subject.emit('foo', data)
				expect(this.realSocket.emit).toHaveBeenCalledWith('foo', data);
			});
		});

		describe('with a default null socket', function() {
			it('binds the event on the null internal socket', function(done) {
				this.subject.on('foo', function() { done() });
				this.subject.emit('foo');
			});
		});
	});

	describe("#channel", function() {
		describe("with live socket", function() {
			it("returns the socket object", function() {
			  this.subject.lateInitialize(this.realSocket);
				expect(this.subject.channel()).toEqual(this.realSocket);
			});
		});

		describe("with null socket", function() {
			it("returns null channel", function() {
				expect(this.subject.channel()).toEqual(this.subject.nullChannel);
			});
		});
	});
});
