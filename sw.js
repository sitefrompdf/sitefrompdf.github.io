const CACHE_NAME = 'forms-portal-v1'; // अपडेट करने पर v1 को v2 करें

const urlsToCache = [
  './',
  './index.html',
  './tour-ta.html',
  './tfr.html',
  './form3.html',
  './ltcbill.html',
  './cea.html',
  './images/img1.jpeg',
  './images/img2.jpeg',
  './images/img3.jpg'
];

// Install Event - फाइलों को कैश करना
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // तुरंत एक्टिव करने के लिए
  );
});

// Activate Event - पुराना कैश साफ़ करना
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - कैश से फाइलें देना
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // यदि इंटरनेट बंद है और फाइल भी कैश में नहीं है
        return caches.match('./index.html');
      })
  );
});
