import StateMachineEventHandler from '../../ui/stateMachineEventHandler'

describe('StateMachineEventHandler', () => {
	describe('#init()', function() {
  	it('binds a listener to the state machine', function() {
  		let ssm = jasmine.createSpyObj(['fsm'])
  		let channel = jasmine.createSpyObj(['bind'])
  		let subject = new StateMachineEventHandler(ssm, channel)
  	});
	});
});
