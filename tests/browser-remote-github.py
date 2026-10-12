"""Real Chromium network proof for the GitHub-saved observer JSON.

No mock fetch, replay fixture or local JSON response is used for successful requests.
Only the *test-served copy* of progress.js points at the isolated state branch;
the production progress.js stays untouched. Failure injection deliberately aborts
an actual browser request, after the successful remote-fetch assertions.
"""
import functools
import json
import os
from pathlib import Path
import tempfile
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = 'https://raw.githubusercontent.com/icefoxtail/AP------/archive-progress-state/archive-progress.json'
LIVE_URL = os.environ.get('ARCHIVE_PROGRESS_REMOTE_JSON_URL', '')
assert LIVE_URL.startswith('https://raw.githubusercontent.com/icefoxtail/AP------/')
assert LIVE_URL.endswith('/archive-progress.json')
assert LIVE_URL != SOURCE_URL, 'Expected isolated test-state JSON, not production status'
original_script = (ROOT / 'archive/progress.js').read_text(encoding='utf-8')
assert original_script.count(SOURCE_URL) == 1, 'Original production URL changed'

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

with tempfile.TemporaryDirectory(prefix='archive-progress-remote-') as temporary:
    directory = Path(temporary)
    (directory / 'progress.html').write_text(
        (ROOT / 'archive/progress.html').read_text(encoding='utf-8'), encoding='utf-8')
    (directory / 'progress.js').write_text(
        original_script.replace(SOURCE_URL, LIVE_URL, 1), encoding='utf-8')
    handler = functools.partial(QuietHandler, directory=str(directory))
    httpd = ThreadingHTTPServer(('127.0.0.1', 0), handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(
                headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
            try:
                page = browser.new_page(viewport={'width': 1440, 'height': 900})
                page.clock.install()
                outgoing = []
                def remote_request(request):
                    if request.url.startswith(LIVE_URL + '?v='):
                        outgoing.append(request.url)
                page.on('request', remote_request)
                remote_response = lambda r: r.url.startswith(LIVE_URL+'?v=') and r.status == 200

                with page.expect_response(remote_response, timeout=30000) as load:
                    page.goto(f'http://127.0.0.1:{httpd.server_port}/progress.html', wait_until='domcontentloaded')
                loaded = load.value
                assert loaded.request.method == 'GET'
                assert loaded.url.startswith(LIVE_URL)
                real_json = loaded.json()
                assert real_json.get('schema') == 1
                assert real_json['entries'], 'Remote JSON contains no collected entries'
                page.wait_for_function('()=>document.querySelector("#updated").textContent.includes("조회 성공")')
                rows = page.locator('#rows tr')
                assert rows.count() == len(real_json['entries'])
                b15 = real_json['entries'].get('19_복성고_1학기_중간_고1_기출')
                assert b15, 'B15 missing from real remote state'
                assert b15['deploymentJob']['result'] == '완료'
                assert b15['deployment']['result'] == '미확인'
                assert b15['deployment']['reason'] == 'Pages ZIP 크기 초과'
                assert 'Pages ZIP 크기 초과' in rows.first.inner_text()
                assert real_json['updatedAt'] in page.locator('#updated').inner_text()
                initial_calls = len(outgoing)
                assert initial_calls >= 1

                with page.expect_response(remote_response, timeout=30000):
                    page.locator('#refresh').click()
                assert len(outgoing) > initial_calls, 'Manual refresh produced no new remote request'

                # STRICT: counter is captured immediately before advancing the timer.
                before_timer = len(outgoing)
                with page.expect_response(remote_response, timeout=30000):
                    page.clock.fast_forward(60000)
                assert len(outgoing) > before_timer, '60s timer did not cause an additional remote request'
                assert '조회 성공' in page.locator('#updated').inner_text()

                last_good_rows = rows.first.inner_text()
                page.route(LIVE_URL+'?v=*', lambda route: route.abort())
                page.locator('#refresh').click()
                page.wait_for_function('()=>document.querySelector("#updated").textContent.includes("조회 실패")')
                assert rows.first.inner_text() == last_good_rows
                assert '마지막 정상 조회' in page.locator('#updated').inner_text()
                page.unroute(LIVE_URL+'?v=*')
                with page.expect_response(remote_response, timeout=30000):
                    page.locator('#refresh').click()
                page.wait_for_function('()=>document.querySelector("#updated").textContent.includes("조회 성공")')
                assert rows.first.inner_text() == last_good_rows
                assert len(outgoing) >= before_timer + 3
                screenshot_path = os.environ.get('ARCHIVE_PROGRESS_REMOTE_SCREENSHOT')
                if screenshot_path:
                    page.screenshot(path=screenshot_path, full_page=True)
                print('PASS Chromium REAL GitHub JSON: remote HTTP 200 GET, verified B15 fields, '
                      'manual refresh, strictly-new 60s request, last-good after aborted request, '
                      'live network recovery; remote requests:', len(outgoing))
            finally:
                browser.close()
    finally:
        httpd.shutdown()
        thread.join(timeout=5)
        httpd.server_close()
