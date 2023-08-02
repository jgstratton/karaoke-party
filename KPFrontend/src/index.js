import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './css/bootstrap.min.css';
import './css/bootstrap-spacing-utilities.css';
import { register } from './serviceWorkerRegistration';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import StandalonePlayer from './components/player/StandalonePlayer';

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

const isPlayer = window.location.pathname.toLowerCase().includes('player');

window.onerror = (e) => {
	console.error('Unhandled error:', e);
	if (!isPlayer) {
		alert('OH NO! AN ERROR! Who wrote this trash!?');
	}
};

window.addEventListener('unhandledrejection', function (promiseRejectionEvent) {
	console.error('Unhandled error:', promiseRejectionEvent);
	if (!isPlayer) {
		alert('OH NO! AN ERROR!  Who wrote this trash!?');
	}
});

if (isPlayer) {
	StandalonePlayer().init();
} else {
	const root = ReactDOM.createRoot(document.getElementById('root'));
	root.render(
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	);
}
