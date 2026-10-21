const CACHE_NAME = 'forms-portal-v3'; // जब भी बड़ा अपडेट करें, v3 को v4, v5 करें

const urlsToCache = [
  './',
  './index.html',
  './tour-ta.html',
  './tfr.html',
  './form3.html',
  './ltcbill.html',
  './cea.html',
  './privacy-policy.html',
  './terms.html',
  './manifest.json',
  './images/img1.jpeg',
  './images/img2.jpeg',
  './images/img3.jpg',
  './images/icon-192.png',
  './images/icon-512.png',
  './pdfs/blank-tour-ta.pdf',
  './pdfs/blank-transfer-ta.pdf',
  './pdfs/blank-ltc.pdf',
  './pdfs/blank-cea.pdf'
];

// Install Event - फाइलों को कैश करना
// हर फ़ाइल अलग से कैश होती है, ताकि कोई एक फ़ाइल न मिलने पर बाकी का कैश न टूटे
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(
        urlsToCache.map(url => cache.add(url).catch(err => console.log('Cache skip:', url, err)))
      ))
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

  // बाहरी साइट्स (Google Analytics, AdSense आदि) को ब्राउज़र खुद संभालेगा, कैश नहीं करेंगे
  if (new URL(event.request.url).origin !== self.location.origin) return;

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
          if (cachedResponse) return cachedResponse;
          // सिर्फ़ पेज खोलने (navigation) पर होम पेज दिखाएँ; चित्र/PDF के लिए गलत फ़ाइल न दें
          if (event.request.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        });
      })
  );
});
