import AppState from '../../ui/appState'

describe('AppState', function() {
	beforeEach(function() {
		this.subject = new AppState();
	});

	it('returns a state object', function() {
		expect(this.subject instanceof AppState).toBeTruthy();
	});

	it('initializes current_frame_idx to 0', function() {
		expect(this.subject.current_frame_idx).toEqual(0);
	});
});
