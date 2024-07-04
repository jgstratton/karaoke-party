import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './css/bootstrap.min.css';
import './css/bootstrap-spacing-utilities.css';
import { register } from './serviceWorkerRegistration';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import BugsnagPerformance from '@bugsnag/browser-performance';

Bugsnag.start({
	apiKey: window.reactenv.BugsnagAPI,
	plugins: [new BugsnagPluginReact()],
});
BugsnagPerformance.start({ apiKey: window.reactenv.BugsnagAPI });

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

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Provider store={store}>
			<ErrorBoundary>
				<App />
			</ErrorBoundary>
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
