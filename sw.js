const CACHE_NAME = 'lapen-cache-20261114_05';
const PRECACHE_URLS = [
  './',
  './styles.css?v=20260918_03',
  './assets/vendor/react.min.js',
  './assets/vendor/react-dom.min.js',
  './init_data.js?v=20261114_01',
  './app.js?v=20261114_05'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isCacheable =
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.png');

  if (!isCacheable) return;

  // Stale-while-revalidate for fast repeat loads & automatic background updates
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request)
          .then((res) => {
            if (res && res.status === 200) {
              cache.put(event.request, res.clone());
            }
            return res;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    )
  );
});
