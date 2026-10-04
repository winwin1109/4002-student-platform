// 定義快取名稱與版本 (當有更新時，請修改這裡的 v2、v3... 以強制瀏覽器更新快取)
const CACHE_NAME = 'lan4002-pwa-v2';

// 需要被快取的檔案清單 (確保離線時也能正常載入這些靜態資源)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  
  // 書本封面與目錄圖片
  './P1.jpg',
  './P2.jpg',
  './P3.jpg',
  './P4.jpg',
  './P5.jpg',
  './P6.jpg',
  './P7.jpg',
  './P8.jpg',
  './P9.jpg',
  './P10.jpg',
  './P11.jpg',
  
  // 第一課 QR Code
  './lt1-sq1.jpg',
  './lt1-tq2.jpg',
  './lt1-sq3.jpg',
  
  // 第二課 QR Code
  './lt2-sq1.jpg',
  './lt2-sq2.jpg',
  './lt2-sq3.jpg',
  './lt2-sq4.jpg',
  './lt2-tq5.jpg',
  
  // 第三課 QR Code
  './lt3-sq1.jpg',
  './lt3-sq2.jpg',
  './lt3-tq3.jpg',
  
  // 第四課 QR Code
  './lt4-sq1.jpg',
  './lt4-sq2.jpg',
  './lt4-sq3.jpg',
  './lt4-sq4.jpg',
  './lt4-tq5.jpg',
  
  // 第五課 QR Code
  './lt5-sq1.jpg',
  './lt5-sq2.jpg',
  './lt5-tq3.jpg',
  
  // 第六課 QR Code (包含最新加入的特訓區圖片)
  './lt6-sq1.jpg',
  './lt6-tq2.jpg',
  './lt6-tq3.jpg',
  './lt6-tq4.jpg', // 新增：特訓區一
  './lt6-tq5.jpg'  // 新增：特訓區二
];

// 安裝 Service Worker 並進行預先快取 (Pre-cache)
self.addEventListener('install', event => {
  // 強制立即接管目前的頁面
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('快取已開啟');
        return cache.addAll(urlsToCache);
      })
  );
});

// 啟動 Service Worker 並清理舊版本快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 如果快取名稱不等於目前的 CACHE_NAME，就將其刪除
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 讓新的 Service Worker 立即控制所有的客戶端 (頁面)
  return self.clients.claim();
});

// 攔截網路請求，優先從快取讀取 (Cache-first 策略)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在快取中找到匹配的資源，就回傳快取版本
        if (response) {
          return response;
        }
        // 如果快取中沒有，就透過網路發送請求去抓取
        return fetch(event.request).catch(() => {
          // 如果連網路都斷線，可以在這裡回傳自訂的離線頁面 (選用)
          console.log('處於離線狀態，且沒有快取可用');
        });
      })
  );
});