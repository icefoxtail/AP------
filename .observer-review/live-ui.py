"""Actual GitHub-saved observer JSON, not fixture JSON."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'observer-live-status.json').read_text())
assert data['schema']==1 and data['entries']
actual_count=len(data['entries'])
body=json.dumps(data,ensure_ascii=False)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    try:
        page=browser.new_page(viewport={'width':1440,'height':900})
        page.clock.install()
        html=(root/'archive/progress.html').read_text().replace('<script src="progress.js"></script>','')
        page.set_content(html)
        page.evaluate('''(data) => {
          window.__live=data; window.__requests=0; window.__networkFailure=false;
          window.fetch=async () => {
            window.__requests+=1;
            return window.__networkFailure ? {ok:false,status:503} :
              {ok:true,json:async()=>window.__live};
          };
        }''',data)
        page.evaluate((root/'archive/progress.js').read_text())
        page.locator('#rows tr').first.wait_for()
        assert page.locator('#rows tr').count()==actual_count
        assert '조회 성공' in page.locator('#updated').inner_text()
        page.screenshot(path=str(root/'observer-live-screenshot.png'),full_page=True)
        first=page.evaluate('window.__requests')
        page.locator('#refresh').click()
        page.wait_for_function('(n)=>window.__requests>n',first)
        before=page.locator('#rows').inner_text()
        page.evaluate('window.__networkFailure=true')
        page.locator('#refresh').click()
        page.wait_for_function('()=>document.querySelector("#updated").textContent.includes("조회 실패")')
        assert before==page.locator('#rows').inner_text()
        assert '마지막 정상 조회' in page.locator('#updated').inner_text()
        page.evaluate('window.__networkFailure=false')
        page.locator('#refresh').click()
        page.wait_for_function('()=>document.querySelector("#updated").textContent.includes("조회 성공")')
        page.clock.fast_forward(60000)
        page.wait_for_function('(n)=>window.__requests>n',first+2)
        assert page.locator('#rows tr').count()==actual_count
        print('CHROMIUM_LIVE_STATE_PASS: '+str(actual_count)+' rows, manual, auto 60s, last-good-on-error, recovery')
    finally: browser.close()
