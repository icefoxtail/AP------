// 학생 포털 배포 버전.
// index.html의 STUDENT_APP_VERSION, manifest.json version,
// student-version.json version과 반드시 같은 값으로 올린다.
// 함께 확인할 값: index.html 정적 리소스 ?v= query.
const STUDENT_SW_VERSION = '2026.06.29.1';
const CACHE_NAME = `apmath-student-portal-${STUDENT_SW_VERSION}`;

const APP_SHELL = [
  `./?v=${STUDENT_SW_VERSION}`,
  `./index.html?v=${STUDENT_SW_VERSION}`,
  `./manifest.json?v=${STUDENT_SW_VERSION}`,
  `./icons/icon-192.png?v=${STUDENT_SW_VERSION}`,
  `./icons/icon-512.png?v=${STUDENT_SW_VERSION}`,
  `./icons/apple-touch-icon.png?v=${STUDENT_SW_VERSION}`
];

function cacheSuccessfulResponse(req, response) {
  if (!response || response.status !== 200 || response.type === 'opaque') return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
  return response;
}

function networkFirst(req, fallbackReq) {
  return fetch(req)
    .then(response => cacheSuccessfulResponse(req, response))
    .catch(() => caches.match(req).then(cached => cached || (fallbackReq ? caches.match(fallbackReq) : undefined)));
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.hostname.includes('workers.dev') || url.pathname.includes('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  if (req.method !== 'GET') {
    event.respondWith(fetch(req));
    return;
  }

  if (url.pathname.endsWith('/student-version.json')) {
    event.respondWith(fetch(req, { cache: 'no-store' }));
    return;
  }

  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      networkFirst(req, `./index.html?v=${STUDENT_SW_VERSION}`)
        .then(response => response || caches.match('./index.html'))
    );
    return;
  }

  const hasCacheBustQuery =
    url.searchParams.has('v') ||
    url.searchParams.has('t') ||
    url.searchParams.has('ts');

  if (hasCacheBustQuery) {
    event.respondWith(networkFirst(req));
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => cacheSuccessfulResponse(req, response));
    })
  );
});
