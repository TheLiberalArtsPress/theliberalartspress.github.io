// ⚡ 文史哲出版社官方網站 - PWA 極速離線服務工作線程 (Service Worker)
const CACHE_VERSION = 'lapen-v20261113_06';
const STATIC_CACHE = `lapen-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `lapen-images-${CACHE_VERSION}`;

// 核心必備靜態資產 (App Shell)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css?v=20260918_03',
  './init_data.js?v=20261113_06',
  './app.js?v=20261113_06',
  './assets/vendor/react.min.js',
  './assets/vendor/react-dom.min.js',
  './cursor_default.png?v=20261113_05',
  './cursor_pointer.png?v=20261113_05',
  './mobao_avatar.png?v=20261113_03',
  './assets/covers/carousel_0.webp',
  './assets/covers/carousel_1.webp',
  './assets/covers/carousel_2.webp'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache partial error:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== IMAGE_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. 書籍封面圖片 WebP 緩存策略 (Stale-While-Revalidate)
  if (url.pathname.includes('/assets/covers/') && url.pathname.endsWith('.webp')) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(req).then((cachedResp) => {
          const fetchPromise = fetch(req).then((networkResp) => {
            if (networkResp && networkResp.status === 200) {
              cache.put(req, networkResp.clone());
            }
            return networkResp;
          }).catch(() => cachedResp);
          return cachedResp || fetchPromise;
        });
      })
    );
    return;
  }

  // 2. 7.6MB 龐大資料庫 data.js 緩存策略 (Cache-First + Background Update)
  if (url.pathname.endsWith('/data.js') || url.pathname.includes('data.js')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(req).then((cachedResp) => {
          if (cachedResp) {
            // 背景非同步檢查更新
            fetch(req).then((networkResp) => {
              if (networkResp && networkResp.status === 200) {
                cache.put(req, networkResp.clone());
              }
            }).catch(() => {});
            return cachedResp;
          }
          return fetch(req).then((networkResp) => {
            if (networkResp && networkResp.status === 200) {
              cache.put(req, networkResp.clone());
            }
            return networkResp;
          });
        });
      })
    );
    return;
  }

  // 3. 一般靜態資源 (HTML / CSS / JS / Fonts) - Network First with Cache Fallback
  event.respondWith(
    fetch(req)
      .then((networkResp) => {
        if (networkResp && networkResp.status === 200 && url.origin === location.origin) {
          const respClone = networkResp.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(req, respClone);
          });
        }
        return networkResp;
      })
      .catch(() => {
        return caches.match(req).then((cachedResp) => {
          if (cachedResp) return cachedResp;
          if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html') || caches.match('./');
          }
        });
      })
  );
});
