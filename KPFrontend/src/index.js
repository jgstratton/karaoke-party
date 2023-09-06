import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './css/bootstrap.min.css';
import './css/bootstrap-spacing-utilities.css';
import { register } from './serviceWorkerRegistration';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import KeyPressChecker from './services/KeyPressChecker';
import { ToggleDj } from './mediators/PartyMediator';
import { logError } from './slices/errorSlice';

register({
	onUpdate: () => {
		// auto-reload when new service worker is installed (don't change service worker during a live performance or the player will restart)
		if (!window.refreshing) {
			console.warn('New service worker installed. Refreshing all tabs.');
			caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))));
			window.location.reload();
			window.refreshing = true;
		}
	},
});

const globalLogger = (errObject) => {
	store.dispatch(
		logError(JSON.stringify(errObject, ['message', 'arguments', 'type', 'name', 'filename', 'lineno', 'colno']))
	);
};

if (!window.location.pathname.toLowerCase().includes('player')) {
	window.addEventListener('error', (errorObject) => {
		console.error('Unhandled error:', errorObject);
		if ((errorObject?.lineno ?? 0 + errorObject?.colno ?? 0) > 0) {
			alert('OH NO! AN ERROR! Who wrote this trash!?');
		}
		globalLogger(errorObject);
	});
	window.addEventListener('unhandledrejection', function (errorObject) {
		console.error('Unhandled error:', errorObject);
		alert('OH NO! AN ERROR!  Who wrote this trash!?');
		globalLogger(errorObject);
	});
} else {
	window.addEventListener('error', (errorObject) => {
		console.error('Unhandled error:', errorObject);
		globalLogger(errorObject);
	});
	window.addEventListener('unhandledrejection', function (errorObject) {
		console.error('Unhandled error:', errorObject);
		globalLogger(errorObject);
	});
}

KeyPressChecker(['Shift', 'D', 'J'], () => {
	console.log('toggle dj');
	ToggleDj();
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>
);

let testError = false;
if (window.location.search.toLowerCase().includes('test-error')) {
	console.log('test error', testError);
	if (!testError) {
		testError = true;
		window.testOtherDomainError();
	}
}
