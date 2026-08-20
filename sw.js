const CACHE_NAME = 'forms-portal-v2'; // जब भी अपडेट करें, v1 को v2, v3 करें

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
      .then(() => self.skipWaiting()) // नए वर्ज़न को तुरंत एक्टिवेट करने के लिए
  );
});

// Activate Event - पुराना कैश साफ़ करना
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Old cache deleted:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // सभी खुले पेजों पर तुरंत नया वर्ज़न लागू करें
  );
});

// Fetch Event - Network-First Strategy (नया अपडेट तुरंत दिखाने के लिए)
self.addEventListener('fetch', event => {
  // केवल GET रिक्वेस्ट्स को हैंडल करें
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // अगर नेटवर्क से नई फ़ाइल मिल जाए, तो कैश को भी अपडेट कर दें
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // इंटरनेट बंद होने पर कैश से फ़ाइल लोड करें
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || caches.match('./index.html');
        });
      })
  );
});
