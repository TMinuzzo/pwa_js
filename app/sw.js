const CACHE_NAME = 'V2';
const STATIC_CACHE_URLS = ['/', 'styles.css', 'scripts.js'];

self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(STATIC_CACHE_URLS))  
      )
});

//const CACHE_NAME2 = 'V2';

self.addEventListener('activate', event => {
    //delete any unexpected caches,
    event.waitUntil(
        caches.keys()
            .then(keys => keys.filter(key => key !== CACHE_NAME))
            .then(keys => Promise.all(keys.map(key => {
                console.log(`Deleting cache ${key}`);
                return caches.delete(key)
            })))
    );
    console.log('Service Worker activating.');
});

self.addEventListener('fetch', event => {
    if(event.request.url.includes("/api")) {
        // response to API requests, Cache Update Refresh strategy
        event.respondWith(caches.match(event.request))
        //TODO: update et refresh
        console.log(`Request of ${event.request.url}`);
    }
    else {
    // Cache-First Strategy
    event.respondWith(
        caches.match(event.request) // check if the request has already been cached
        .then(cached => cached || fetch(event.request)) // otherwise request network
      );
    }
});

function update(request) {
	return fetch(request.url)
	.then(response => {
		if (!response.ok) { throw new Error('Network error'); }

		// we can put response in cache
		return caches.open(CACHE_NAME)
		.then(cache => cache.put(request, response.clone()))
		.then(() => response) // resolve promise with the Response object
	})
}

    