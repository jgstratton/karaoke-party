// Establish a cache name
const cacheName = 'KaraokePartyCache_V5';
const searchKeys = ['/party', '/song', '/images', 'sw.js'];

self.addEventListener('fetch', (event) => {
	// prevent cors issue when getting images from youtube
	if (event.request.url.search('youtube.com') > 0) {
		return;
	}

	if (event.request.method == 'GET') {
		event.respondWith(
			caches.open(cacheName).then((cache) => {
				// Go to the network first
				return fetch(event.request.url)
					.then((fetchedResponse) => {
						// don't cache the video files (cache will get way too big)
						if (event.request.destination != 'video') {
							cache.put(event.request, fetchedResponse.clone());
						}
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
