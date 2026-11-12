/* पुरानी साइट बंद — यह service worker पुरानी offline कॉपी मिटाकर खुद को हटा देता है।
   नई साइट: https://siteformspdf.in/ */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (cs) { cs.forEach(function (c) { try { c.navigate(c.url); } catch (x) {} }); })
  );
});
