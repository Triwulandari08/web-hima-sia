const CACHE_NAME = 'hima-cache-v1';
const URLS_TO_CACHE = [
  'index.html',
  'detail.html',
  'img/backweb.jpeg',
  'img/logo_hima_sia.png',
  'img/ketua.jpeg',
  'img/wakil.jpeg',
  'img/administrasi.jpeg',
  'img/akademik.jpeg',
  'img/networking.jpeg',
  'img/dpo.jpeg'
];

// Proses install service worker & cache file
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(error => {
        console.error('[ServiceWorker] Failed to cache:', error);
      })
  );
});

// Proses fetch: ambil dari cache dulu, kalau tidak ada fetch dari jaringan
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Optional: tampilkan fallback page kalau offline dan file tidak ditemukan
      return caches.match('/index.html');
    })
  );
});


// Aktivasi service worker dan hapus cache lama (jika ada)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});
