// Establish a cache name
const cacheName = 'KaraokePartyCache_V5';
const searchKeys = ['/party', '/song', '/images', 'sw.js'];

// clear cache when loading new sw
caches.keys().then(function (names) {
	for (let name of names) {
		console.log('Clearing cache: ', name);
		caches.delete(name);
	}
});

self.addEventListener('fetch', (event) => {
	// only cache GET requests
	if (event.request.method != 'GET') {
		return;
	}

	// only cache assets from the /home route
	if (
		event.request.referrer.slice(-7).toLowerCase() != '/djhome' &&
		event.request.url.slice(-7).toLowerCase() != '/djhome'
	) {
		return;
	}

	event.respondWith(
		caches.open(cacheName).then((cache) => {
			// Go to the network first
			return fetch(event.request.url)
				.then((fetchedResponse) => {
					cache.put(event.request, fetchedResponse.clone());
					return fetchedResponse;
				})
				.catch(() => {
					// If the network is unavailable, get from the service worker's cache
					console.log('returning cached item', event.request.url);
					return cache.match(event.request.url);
				});
		})
	);
});

self.skipWaiting();
