const CACHE_NAME = 'forms-portal-v1';
const urlsToCache = [
  '/',
  'index.html',
  'tour-ta.html',
  'tfr.html',
  'form3.html',
  'ltcbill.html',
  'cea.html',
  'images/img1.jpeg',
  'images/img2.jpeg',
  'images/img3.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
