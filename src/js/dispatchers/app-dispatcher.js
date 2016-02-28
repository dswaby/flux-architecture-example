import { Dispatcher } from 'flux';

const flux = new Dispatcher();

// creating a facade around the facebook dispatcher
export function register(callback) {
	return flux.register(callback)
}

export dispatch( actionType, action) {
	flux.dispatch(actionType, action);
}