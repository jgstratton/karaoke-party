// Establish a cache name
const cacheName = 'KaraokePartyCache_V5';
const searchKeys = ['/party', '/song', '/images', 'sw.js'];

// clear cache when loading new sw
caches.keys().then(function (names) {
	for (let name of names) caches.delete(name);
});

self.addEventListener('fetch', (event) => {
	// prevent cors issue when getting images from youtube
	if (event.request.url.search('youtube.com') > 0) {
		return;
	}

	// don't cache anything from the player
	if (event.request.referrer.slice(-7) == '/player') {
		return;
	}

	if (event.request.method == 'GET') {
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
						return cache.match(event.request.url);
					});
			})
		);
	}
});

self.skipWaiting();
//making change 2
