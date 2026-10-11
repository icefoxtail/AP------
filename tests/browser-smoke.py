"""Chromium UI smoke with fixture JSON. Does not imply live GitHub status is available."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import copy

root=Path(__file__).resolve().parents[1]
id='25_샘플고_1학기_중간_고1_기출'
link='https://github.com/icefoxtail/AP------/actions/runs/30'
def obj(status,reason=None,run=link):
    return {'result':status,'sha':'d'*40,'at':'2026-10-11T03:58:15Z','run':run,**({'reason':reason} if reason else {})}
base={
 'schema':1,'updatedAt':'2026-10-11T04:10:00Z','inventoryComplete':True,
 'history':{'complete':False,'scope':'recent','oldestObservedAt':'2026-10-10T01:00:00Z','runScanIsPartial':True},
 'entries':{id:{'exam':id,'check':None,'main':None,'registration':None,
  'deploymentJob':obj('완료'),
  'deployment':obj('미확인','Pages ZIP 크기 초과'),
  'lastSuccessfulRelease':None,'lastFailure':None}}
}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  page=browser.new_page(viewport={'width':1330,'height':800});page.clock.install()
  page.set_content((root/'archive/progress.html').read_text().replace('<script src="progress.js"></script>',''))
  page.evaluate("""(fixture) => {
    window.__fixture=fixture;window.__calls=0;window.__fail=false;
    window.fetch=async()=>{window.__calls++;
     return window.__fail?{ok:false,status:503}:{ok:true,json:async()=>window.__fixture};};
  }""",base)
  page.evaluate((root/'archive/progress.js').read_text())
  row=page.locator('#rows tr').first;row.wait_for()
  assert '배포 작업' in page.locator('thead').inner_text()
  assert '파일 일치' in page.locator('thead').inner_text()
  assert '완료' in row.locator('td').nth(4).inner_text()
  assert '미확인' in row.locator('td').nth(5).inner_text()
  assert 'Pages ZIP 크기 초과' in row.locator('td').nth(5).inner_text()
  assert '부분 조회' in page.locator('#updated').inner_text()
  newer=copy.deepcopy(base)
  record=newer['entries'][id]
  record['deploymentJob']=obj('완료')
  record['deployment']=obj('불일치','시험지·에셋·등록 데이터 불일치')
  record['lastSuccessfulRelease']=obj('완료','',run='https://github.com/icefoxtail/AP------/actions/runs/29')
  page.evaluate('(data)=>window.__fixture=data',newer)
  page.locator('#refresh').click()
  page.wait_for_function('()=>document.querySelector("#rows").textContent.includes("불일치")')
  assert '불일치' in row.locator('td').nth(5).inner_text()
  assert '완료' in row.locator('td').nth(6).inner_text()
  before=page.locator('#updated').inner_text()
  page.evaluate('window.__fail=true')
  page.locator('#refresh').click()
  page.wait_for_function('()=>document.querySelector("#updated").textContent.includes("조회 실패")')
  assert '불일치' in row.locator('td').nth(5).inner_text()
  assert '마지막 정상 조회' in page.locator('#updated').inner_text()
  page.evaluate('window.__fail=false')
  recovered=copy.deepcopy(newer);recovered['entries'][id]['deployment']=obj('완료')
  recovered['updatedAt']='2026-10-11T04:15:00Z'
  page.evaluate('(data)=>window.__fixture=data',recovered)
  page.locator('#refresh').click()
  page.wait_for_function('()=>document.querySelector("#rows").textContent.includes("25_샘플고") && document.querySelector("#updated").textContent.includes("04:15")')
  assert '완료' in row.locator('td').nth(5).inner_text()
  page.clock.fast_forward(60000)
  page.wait_for_function('()=>window.__calls>=5')
  print('PASS Chromium: deploy job success + file unknown; latest mismatch + old normal; failed refresh retains view; refresh recovery; periodic 60s')
  print('browser requests:',page.evaluate('window.__calls'))
 finally:browser.close()
