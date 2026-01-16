// Authenticator Pro Service Worker
const CACHE_NAME = 'authenticator-pro-v1';
const STATIC_CACHE = 'authenticator-pro-static-v1';

// 需要缓存的核心资源
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// CDN 资源 - 单独缓存策略
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&family=JetBrains+Mono:wght@400;500&display=swap',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',
  'https://cdn.jsdelivr.net/npm/protobufjs@7.2.5/dist/protobuf.min.js',
  'https://cdn.jsdelivr.net/npm/hi-base32@0.5.1/build/base32.min.js',
  'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/otpauth/9.1.4/otpauth.umd.min.js'
];

// 安装事件 - 预缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] 预缓存核心资源');
      return cache.addAll(CORE_ASSETS);
    }).then(() => {
      // 立即激活新版本
      return self.skipWaiting();
    })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map(name => {
            console.log('[SW] 删除旧缓存:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // 立即接管所有页面
      return self.clients.claim();
    })
  );
});

// 请求拦截 - 缓存策略
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  // 跳过非 http/https 请求
  if (!url.protocol.startsWith('http')) return;

  // CDN 资源使用 Cache First 策略
  if (isCDNResource(url.href)) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  // 字体资源使用 Cache First 策略
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  // 本地资源使用 Network First 策略 (优先获取最新版本)
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(event.request, CACHE_NAME));
    return;
  }
});

// 判断是否为 CDN 资源
function isCDNResource(href) {
  return CDN_ASSETS.some(asset => href.startsWith(asset));
}

// Cache First 策略 - 优先使用缓存
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] 网络请求失败:', request.url);
    return new Response('Network error', { status: 408 });
  }
}

// Network First 策略 - 优先网络请求
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] 网络不可用，使用缓存:', request.url);
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // 返回离线页面
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }

    return new Response('Offline', { status: 503 });
  }
}

// 接收来自主线程的消息
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data === 'clearCache') {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
});
