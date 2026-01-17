// Authenticator Pro Service Worker
// 1. 修改版本号：每次部署新功能时，务必修改这里的版本号（建议使用日期）
const CACHE_NAME = 'authenticator-pro-v20260117';
const STATIC_CACHE = 'authenticator-pro-static-v2';

// 需要缓存的核心资源
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// CDN 资源 - 单独缓存策略
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com', // 简化匹配
  'https://fonts.gstatic.com',
  'https://cdn.jsdelivr.net',
  'https://unpkg.com',
  'https://cdnjs.cloudflare.com',
  // 3. 新增：将你的头像图床域名加入缓存列表，提升加载体验
  'https://imphub.pepeth.qzz.io'
];

// 安装事件 - 预缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] 预缓存核心资源');
      // 使用 {cache: 'reload'} 确保安装时抓取的是服务器最新版，而不是磁盘缓存
      return cache.addAll(CORE_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => {
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
      return self.clients.claim();
    })
  );
});

// 请求拦截 - 缓存策略
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // CDN 资源使用 Cache First
  if (isCDNResource(url.href) || url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  // 本地资源 (HTML/JS) 使用 Network First
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(event.request, CACHE_NAME));
    return;
  }
});

function isCDNResource(href) {
  return CDN_ASSETS.some(asset => href.startsWith(asset));
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Network error', { status: 408 });
  }
}

// 2. 增强版 Network First：强制绕过浏览器磁盘缓存
async function networkFirst(request, cacheName) {
  try {
    // 关键修改：对于导航请求(HTML)或本地文件，设置 cache: 'reload'
    // 这告诉浏览器："不要读你的本地磁盘缓存，必须去服务器拿最新的"
    const fetchOptions = {
      cache: 'reload'
    };
    
    // 复制请求并应用新配置
    const networkRequest = new Request(request, fetchOptions);
    const response = await fetch(networkRequest);

    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] 网络不可用，使用缓存:', request.url);
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }
    return new Response('Offline', { status: 503 });
  }
}

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
  if (event.data === 'clearCache') {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }
});
