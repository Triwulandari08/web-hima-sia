// Nama cache yang digunakan, bisa diganti saat ada update konten
const CACHE_NAME = 'hima-cache-v1';
// Daftar file yang akan disimpan di cache saat service worker diinstal
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

// // Event 'install' akan dijalankan saat service worker pertama kali terpasang
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...'); 
  // Tunggu hingga semua file di-cache sebelum menyelesaikan proses install
  event.waitUntil(
    caches.open(CACHE_NAME) // Membuka cache dengan nama yang sudah ditentukan
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell...');
        // Tambahkan semua file ke cache file yang ada diatas tadi 
        return cache.addAll(URLS_TO_CACHE); 
      })
      .catch(error => { // Tangani error jika gagal menyimpan cache
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
      return caches.match('index.html');
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
