const CACHE_NAME = 'vtc-chinese-app-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// 1. 安裝階段：快取基本的檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('已開啟快取');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 攔截請求：採用「網路優先，失敗則讀取快取」的策略
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // 如果沒有網路，則從快取中尋找資源
      return caches.match(event.request);
    })
  );
});

// 3. 啟用階段：清除舊版本的快取
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