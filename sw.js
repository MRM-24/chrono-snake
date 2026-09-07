/* Chrono Snake — minimal offline-first service worker.
 * Cache-first for the app shell (single HTML file + icons + manifest).
 * Bump CACHE_VERSION whenever shipped files change. */
var CACHE_VERSION = 'cs-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE_VERSION ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  /* Fonts come from Google's CDN — network-first with cache fallback (opaque ok). */
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) {
    e.respondWith(
      caches.open(CACHE_VERSION).then(function (c) {
        return c.match(e.request).then(function (hit) {
          var net = fetch(e.request).then(function (res) {
            try { c.put(e.request, res.clone()); } catch (err) {}
            return res;
          }).catch(function () { return hit; });
          return hit || net;
        });
      })
    );
    return;
  }
  /* Same-origin app shell — cache-first, refresh in background. */
  e.respondWith(
    caches.open(CACHE_VERSION).then(function (c) {
      return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
        var net = fetch(e.request).then(function (res) {
          if (res && res.ok) { try { c.put(e.request, res.clone()); } catch (err) {} }
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      });
    })
  );
});
