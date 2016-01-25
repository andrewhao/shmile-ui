import AppState from '../../ui/appState'

describe('AppState', function() {
	let subject = new AppState();

	it('returns a state object', function() {
		expect(subject instanceof AppState).toBeTruthy();
	});

	it('initializes current_frame_idx to 0', function() {
		expect(subject.current_frame_idx).toEqual(0);
	});
});
