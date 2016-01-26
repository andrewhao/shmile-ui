var ShmileStateMachine = require('../../ui/shmileStateMachine'),
    StateMachine = require('javascript-state-machine')

describe('ShmileStateMachine', function() {
	let photoView = jasmine.createSpyObj(['resetState', 'animate'])
	let socket = jasmine.createSpyObj(['on'])
	let appState = jasmine.createSpyObj(['current_frame_idx'])
	let subject = new ShmileStateMachine(photoView, socket, appState)

	describe('lifecycle', function() {
		it('fires lifecycle events', function() {
			subject.fsm.connected();
			expect(photoView.resetState).toHaveBeenCalled();
			subject.fsm.ui_button_pressed();
		});
	});
});
