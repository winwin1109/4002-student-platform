const CACHE_NAME = 'lan4002-student-cache-v1';

// 您可以把需要離線存取的檔案加進這個陣列
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // 建議您後續可以把用到的圖片也加進來，例如:
  // './P1.jpg',
  // './P2.jpg'
];

// 安裝 Service Worker 並快取基本檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截網路請求，優先回傳快取檔案
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在快取中找到對應檔案，就直接回傳
        if (response) {
          return response;
        }
        // 否則透過網路抓取
        return fetch(event.request);
      })
  );
});

// 啟用新的 Service Worker 並刪除舊的快取
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});