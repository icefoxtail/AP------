// AP Math OS 서비스 워커
// 전략: 같은 출처(GitHub Pages) 정적 자산만 network-first로 처리한다.
// - 온라인: 항상 네트워크 응답을 사용하고 캐시를 갱신 → 배포 후 구버전이 보일 일 없음
// - 오프라인/네트워크 불안: 마지막으로 성공한 응답을 캐시에서 제공
// - API 호출(workers.dev 등 다른 출처)은 가로채지 않고 브라우저 기본 동작에 맡긴다.
const CACHE_NAME = 'apmath-os-shell-v2';

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (keys) {
                return Promise.all(keys.filter(function (key) { return key !== CACHE_NAME; }).map(function (key) { return caches.delete(key); }));
            })
            .then(function () { return self.clients.claim(); })
    );
});

function isCacheableRequest(request) {
    if (request.method !== 'GET') return false;
    var url = new URL(request.url);
    return url.origin === self.location.origin;
}

self.addEventListener('fetch', function (event) {
    var request = event.request;
    if (!isCacheableRequest(request)) return;

    event.respondWith(
        fetch(request)
            .then(function (response) {
                if (response && response.ok && response.type === 'basic') {
                    var copy = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function (cache) { return cache.put(request, copy); })
                        .catch(function () { /* 캐시 저장 실패는 응답 제공에 영향 없음 */ });
                }
                return response;
            })
            .catch(function (error) {
                return caches.match(request).then(function (cached) {
                    if (cached) return cached;
                    throw error;
                });
            })
    );
});
