// 시작은 화면 구성(DOMContentLoaded)이 끝나면 바로 한다. window.onload는 글꼴·이미지를 다 받을 때까지 미뤄져
// 느린 망에서 대시보드가 한참 뒤에 뜨므로 쓰지 않는다. 이미 지난 뒤에 실행돼도 한 번만 시작한다.
(function () {
    let started = false;
    async function startApp() {
        if (started) return;
        started = true;
        await loadData(true);
        await processSyncQueue();
    }
    if (document.readyState === 'complete') startApp();
    else {
        document.addEventListener('DOMContentLoaded', startApp, { once: true });
        window.addEventListener('load', startApp, { once: true });
    }
    window.addEventListener('online', () => { processSyncQueue(); });
})();
