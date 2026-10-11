'use strict';
const fs=require('fs'),path=require('path'),http=require('http');
const {execFileSync}=require('child_process');
const {chromium}=require('/tmp/ap-galaxy-playwright/node_modules/playwright');
const root=path.resolve(__dirname,'../../../..');
const out=path.join(root,'docs/reviews/ap-galaxy-first-journey-20261011');
const base='3da5863ad453f84568ec55538c8b9e2a7f292df7';
const prefix='archive/prototypes/ap-galaxy/';
const baselineBundle=execFileSync('git',['show',base+':'+prefix+'assets/orbital-world.js'],{cwd:root,maxBuffer:10*1024*1024});
const baselineApp=execFileSync('git',['show',base+':'+prefix+'orbit-app.js'],{cwd:root,maxBuffer:3*1024*1024});
const types={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript;charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
const errors=[];
const server=http.createServer((req,res)=>{
  let url;try{url=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
  const file=path.resolve(root,'.'+url);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end('Forbidden');return}
  fs.stat(file,(err,st)=>{
    if(err||!st.isFile()){res.writeHead(404).end('Not found '+url);return}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  });
});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const med=arr=>[...arr].sort((a,b)=>a-b)[Math.floor(arr.length/2)];
async function launch(browser,{baseline=false,video=false,motion='no-preference'}={}){
  const context=await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1,
    reducedMotion:motion,recordVideo:video?{dir:out,size:{width:1600,height:900}}:undefined});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push({which:baseline?'before':'after',type:'pageerror',message:e.message}));
  page.on('console',m=>{if(m.type()==='error')errors.push({which:baseline?'before':'after',type:'console',message:m.text()})});
  await page.addInitScript(()=>{
    window.__apClearCalls=0;
    const old=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){
      const gl=old.call(this,type,...args);
      if(gl&&/^(webgl2?|experimental-webgl)$/.test(type)&&!gl.__wrappedClear){
        const clear=gl.clear;gl.clear=function(...a){window.__apClearCalls++;return clear.apply(gl,a)};
        gl.__wrappedClear=true;
      }
      return gl;
    };
  });
  if(baseline){
    await page.route('**/orbit-app.js',r=>r.fulfill({status:200,contentType:'application/javascript',body:baselineApp}));
    await page.route('**/assets/orbital-world.js',r=>r.fulfill({status:200,contentType:'application/javascript',body:baselineBundle}));
  }
  const url='http://127.0.0.1:'+server.address().port+'/archive/prototypes/ap-galaxy/index.html';
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('sceneCount')?.textContent.includes('별 자료 노드'),null,{timeout:35000});
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.planet-label')].some(el => Number.isFinite(parseFloat(el.style.left))),
    null,{timeout:30000});
  return {page,context};
}
async function groupFocus(page){
  await page.locator('#search').fill('삼산중');await wait(550);
  const label=page.locator('.planet-label').filter({hasText:'삼산중'}).first();
  await label.waitFor({state:'attached'});
  await page.waitForFunction(() => {
    const el=[...document.querySelectorAll('.planet-label')].find(node=>node.textContent.includes('삼산중'));
    return el && Number.isFinite(parseFloat(el.style.left));
  },null,{timeout:30000});
  // A rotating world can move the group raycast target between projection
  // and pointerdown; refresh projection and retry the real canvas pick.
  let loc=null;
  for(let attempt=0;attempt<5;attempt++){
    loc=await label.evaluate(el=>({x:parseFloat(el.style.left),y:parseFloat(el.style.top)+22}));
    if(!Number.isFinite(loc.x)||!Number.isFinite(loc.y))throw Error('School position not projected');
    await page.evaluate(({x,y})=>{
      const c=document.getElementById('space');
      c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:x,clientY:y,pointerId:1}));
      c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:x,clientY:y,pointerId:1}));
    },loc);
    await wait(650);
    if(await page.evaluate(()=>!document.getElementById('focusedChip').hidden))return loc;
  }
  throw Error('School canvas target could not be focused after 5 projected picks');
}
async function clickActionableOrbit(page, excluded = []) {
  await page.waitForFunction(() => [...document.querySelectorAll('.question-orbit-node')]
    .some(el => getComputedStyle(el).display !== 'none'), null, {timeout:25000});
  // A physical pointer can click a moving 3D projection; locator.click() would
  // refuse moving targets as "not stable". Always hit the visible screen box
  // with real mouse input and verify the exact selected source ID afterward.
  for (let attempt=0;attempt<5;attempt++) {
    await wait(200);
    const candidates=page.locator('.question-orbit-node:visible');
    const count=await candidates.count();
    for(let i=0;i<count;i++){
      const candidate=candidates.nth(i);
      const id=await candidate.getAttribute('data-question-id').catch(()=>null);
      if(!id||excluded.includes(id))continue;
      const rect=await candidate.boundingBox().catch(()=>null);
      if(!rect||rect.width<10||rect.height<10)continue;
      await page.mouse.click(rect.x+rect.width/2,rect.y+rect.height/2);
      if(await page.locator('.question-orbit-node.selected[data-question-id="'+id+'"]').count())return id;
    }
  }
  throw Error('No visible orbit question accepted a real pointer click');
}
async function fps(page){
  await page.locator('#motionToggle').evaluate(el=>{if(el.getAttribute('aria-pressed')==='true')el.click()});
  await wait(250);
  const samples=[];
  for(let i=0;i<3;i++){
    const begin=await page.evaluate(()=>({count:window.__apClearCalls,time:performance.now()}));
    await wait(2500);
    const end=await page.evaluate(()=>({count:window.__apClearCalls,time:performance.now()}));
    samples.push(+((end.count-begin.count)*1000/(end.time-begin.time)).toFixed(2));
    await wait(200);
  }
  if(samples.some(x=>!Number.isFinite(x)||x<1))throw Error('Unable to collect WebGL clear-frame proxy');
  return {samples,median:med(samples),method:'WebGL clear calls per elapsed second, each 2.5s',notGPUFPS:true};
}
async function main(){
  fs.mkdirSync(out,{recursive:true});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
  const report={baseline:base,head:process.env.GITHUB_SHA||'unknown',viewport:'1600x900 DPR1',
    browser:'Playwright Chromium SwiftShader headless (CI runner; not physical user PC)',
    scopes:{realExam:true,fullPrintRoutePreserved:true,physicalPC:false}};
  try{
    const baseline=await launch(browser,{baseline:true,motion:'no-preference'});
    await groupFocus(baseline.page);
    await wait(1400);
    report.beforeFps=await fps(baseline.page);
    await baseline.context.close();
    const {page,context}=await launch(browser,{video:true});
    await groupFocus(page);
    await wait(1400);
    report.afterFps=await fps(page);
    await page.screenshot({path:path.join(out,'journey-1-galaxy.png')});
    const button=page.locator('.satellite-hit').filter({hasText:'2026 · 1학기 중간'}).first();
    await button.waitFor({state:'attached',timeout:10000});
    await button.evaluate(el=>el.click());
    await page.waitForFunction(()=>document.getElementById('examDrawer').classList.contains('open'),null,{timeout:6000});
    await page.waitForFunction(()=>document.querySelectorAll('.question-orbit-node').length===24,null,{timeout:30000});
    report.orbitIds=await page.locator('.question-orbit-node').evaluateAll(nodes=>nodes.map(n=>n.dataset.questionId));
    if(report.orbitIds.join(',')!==Array.from({length:24},(_,i)=>''+(i+1)).join(','))throw Error('Canonical 1..24 IDs do not match source');
    await wait(1200);
    await page.screenshot({path:path.join(out,'journey-2-orbit.png')});
    await page.locator('[data-question-id="2"]').click({timeout:15000});
    await page.waitForFunction(()=>document.querySelector('#questionStatus')?.textContent==='문항 2 · 문제',null,{timeout:32000});
    report.problem=await page.evaluate(()=>{
      const frame=document.getElementById('examFrame').contentDocument;
      const focused=frame.querySelector('#print-area .ap-galaxy-selected-question');
      return {title:document.getElementById('examTitle').textContent,
        engineTitle:frame.getElementById('ctrl-title').textContent,
        focusedNumber:focused?.querySelector('.q-num')?.textContent.trim(),
        content:focused?.innerText.slice(0,160),source:frame.location?.href};
    });
    if(report.problem.focusedNumber!=='2.'||!report.problem.content?.includes('다음 중'))throw Error('Real selected question not displayed: '+JSON.stringify(report.problem));
    report.readerLayout=await page.evaluate(()=>{
      const d=document.getElementById('examFrame').contentDocument;
      const q=d.querySelector('.ap-galaxy-selected-question');
      const area=d.getElementById('print-area');
      const grid=q?.closest('.grid-container');
      const bb=q?.getBoundingClientRect();
      return {reading:d.body.classList.contains('ap-galaxy-reading'),
        font:parseFloat(d.defaultView.getComputedStyle(q).fontSize),
        grid:grid?d.defaultView.getComputedStyle(grid).display:null,
        transform:d.defaultView.getComputedStyle(area).transform,
        width:bb?.width,frameWidth:d.documentElement.clientWidth,
        overflow:q?.scrollWidth>q?.clientWidth+3,
        visualOverflow:[...(q?.querySelectorAll('svg,img')||[])].some(el=>{
          const rect=el.getBoundingClientRect();return rect.right>bb.right+3||rect.left<bb.left-3;
        })};
    });
    if(!report.readerLayout.reading||report.readerLayout.font<15||report.readerLayout.grid!=='block'||
      report.readerLayout.transform!=='none'||report.readerLayout.overflow||
      report.readerLayout.visualOverflow||report.readerLayout.width>report.readerLayout.frameWidth+3)
      throw Error('Selected reader must be readable single-column without clipping: '+JSON.stringify(report.readerLayout));
    await page.screenshot({path:path.join(out,'journey-3-question.png')});
    await page.locator('[data-reader-mode="ans"]').click();
    await page.waitForFunction(()=>document.querySelector('#questionStatus')?.textContent==='문항 2 · 정답',null,{timeout:35000});
    report.answer=await page.evaluate(()=>{
      const d=document.getElementById('examFrame').contentDocument;
      const focus=d.querySelector('#print-area .ap-galaxy-selected-question');
      return {number:focus?.querySelector('.ans-n')?.textContent.trim(),value:focus?.querySelector('.ans-v')?.textContent.trim()};
    });
    if(report.answer.number!=='2.'||!report.answer.value)throw Error('Real selected answer missing');
    await page.screenshot({path:path.join(out,'journey-4-answer.png')});
    await page.locator('[data-reader-mode="sol"]').click();
    await page.waitForFunction(()=>document.querySelector('#questionStatus')?.textContent==='문항 2 · 해설',null,{timeout:35000});
    report.solution=await page.evaluate(()=>{
      const d=document.getElementById('examFrame').contentDocument;
      const focus=d.querySelector('#print-area .ap-galaxy-selected-question');
      return {number:focus?.querySelector('.q-num')?.textContent.trim(),
        solutionText:focus?.querySelector('.sol-exp')?.innerText.slice(0,160),
        answer:focus?.querySelector('.sol-ans')?.innerText.slice(0,100)};
    });
    if(report.solution.number!=='2.'||!report.solution.answer)throw Error('Real selected solution missing');
    await page.screenshot({path:path.join(out,'journey-5-solution.png')});
    // This is an actual new-window pointer click; verify the print control in the
    // independent non-preview engine is visible, enabled and pointer-actionable.
    const [printPage]=await Promise.all([
      context.waitForEvent('page'),page.locator('#printOriginal').click()
    ]);
    await printPage.waitForLoadState('domcontentloaded');
    await printPage.locator('#btn-print').waitFor({state:'visible',timeout:35000});
    if(new URL(printPage.url()).searchParams.has('preview'))throw Error('Standalone print uses preview=1');
    const printButton=printPage.locator('#btn-print');
    if(!await printButton.isEnabled())throw Error('Standalone print button is disabled');
    // Do not count a clickable print button as proof that the original exam rendered.
    // The standalone, non-preview engine must finish rendering all 24 source questions.
    await printPage.waitForFunction(() => {
      const nums=[...document.querySelectorAll('#print-area .q-box .q-num')]
        .map(n=>n.textContent.trim());
      const grid=document.querySelector('#print-area .grid-container');
      return document.readyState==='complete' && nums.length===24 &&
        nums[0]==='1.' && nums[23]==='24.' &&
        !!grid && getComputedStyle(grid).display==='grid';
    },null,{timeout:45000});
    const standaloneExam=await printPage.evaluate(() => {
      const nums=[...document.querySelectorAll('#print-area .q-box .q-num')]
        .map(n=>n.textContent.trim());
      return {renderedQuestionCount:nums.length,firstQuestion:nums[0],
        lastQuestion:nums[nums.length-1],
        pageCount:document.querySelectorAll('#print-area .page').length,
        layout: getComputedStyle(document.querySelector('#print-area .grid-container')).display};
    });
    if(standaloneExam.pageCount<1)throw Error('Standalone original exam has no rendered pages');
    await printButton.click({trial:true,timeout:20000});
    report.printRoute={url:printPage.url(),visible:await printButton.isVisible(),
      enabled:await printButton.isEnabled(),pointerTrial:true,standaloneExam,printOutputVerified:false,physicalPrinter:false};
    await printPage.screenshot({path:path.join(out,'journey-8-print-ready.png')});
    await printPage.close();
    await page.locator('#wholeExam').click();
    await page.waitForFunction(()=>document.getElementById('questionToolbar').hidden,null,{timeout:13000});
    report.fullExam=await page.evaluate(()=>{
      const d=document.getElementById('examFrame').contentDocument;
      return {printButton:!!d.getElementById('btn-print'),source:document.getElementById('openOriginal').href,
        firstQuestion:d.getElementById('print-area')?.innerText.includes('다음 중 옳은 것은?')};
    });
    if(!report.fullExam.printButton||!report.fullExam.firstQuestion||
      new URL(report.fullExam.source).searchParams.has('preview'))throw Error('Full exam / independent print path not restored');
    report.fullExam.layoutRestored=await page.evaluate(()=>{
      const doc=document.getElementById('examFrame').contentDocument;
      return !doc.body.classList.contains('ap-galaxy-reading') &&
        doc.querySelector('#print-area .grid-container') &&
        doc.defaultView.getComputedStyle(doc.querySelector('#print-area .grid-container')).display === 'grid';
    }).catch(()=>false);
    if(!report.fullExam.layoutRestored)throw Error('Whole exam did not restore paginated layout');
    const restored=await page.evaluate(()=>{
      const d=document.getElementById('examFrame').contentDocument;
      const nums=[...d.querySelectorAll('#print-area .q-box .q-num')].map(n=>n.textContent.trim());
      return {modeExam:d.getElementById('btn-exam')?.classList.contains('active'),
        count:nums.length,first:nums[0],last:nums[nums.length-1]};
    });
    if(!restored.modeExam||restored.count!==24||restored.first!=='1.'||restored.last!=='24.')
      throw Error('Whole exam did not restore all 24 source questions: '+JSON.stringify(restored));
    report.fullExam.rendered=restored;
    await page.screenshot({path:path.join(out,'journey-6-full-exam.png')});
    await page.locator('#closeDrawer').click();
    await page.waitForFunction(()=>!document.getElementById('examDrawer').classList.contains('open'),null,{timeout:5000});
    report.returned=await page.evaluate(()=>({
      selectedQuestionCount:document.querySelectorAll('.question-orbit-node').length,
      groupMode:document.querySelector('[data-group-mode][aria-pressed="true"]')?.dataset.groupMode,
      search:document.getElementById('search').value,
      cameraActive:!document.querySelector('.travel-warp,.travel-flight')
    }));
    if(report.returned.selectedQuestionCount!==0||report.returned.search!=='삼산중')throw Error('Navigation restoration or question cleanup failed');
    await page.screenshot({path:path.join(out,'journey-7-return.png')});
    const video=page.video();
    await context.close();
    await video.saveAs(path.join(out,'journey-real-content.webm'));
    const temporaryVideo = await video.path();
    if (temporaryVideo !== path.join(out,'journey-real-content.webm') && fs.existsSync(temporaryVideo)) fs.unlinkSync(temporaryVideo);
    // Reduced motion and forced immediate travel.
    const reduced=await launch(browser,{motion:'reduce'});
    await groupFocus(reduced.page);
    report.reducedMotion=await reduced.page.evaluate(()=>({
      isWarp:document.getElementById('universe').classList.contains('travel-warp'),
      motionPressed:document.getElementById('motionToggle').getAttribute('aria-pressed')
    }));
    if(report.reducedMotion.isWarp)throw Error('Reduced motion animated a warp');
    await reduced.page.locator('#instantTravel').click();
    if(await reduced.page.locator('#instantTravel').getAttribute('aria-pressed')!=='true')throw Error('Instant travel toggle failed');
    await reduced.context.close();
    // Turn on instant travel during an actual active camera flight, without
    // reduced-motion shortcuts; it must finish at the stored destination.
    const flying=await launch(browser,{motion:'no-preference'});
    await flying.page.locator('#search').fill('삼산중');await wait(550);
    await groupFocus(flying.page);
    await flying.page.waitForFunction(()=>document.querySelector('.travel-flight,.travel-warp'),null,{timeout:2000});
    await flying.page.locator('#instantTravel').click();
    report.flightFinish=await flying.page.evaluate(()=>({
      moving:!!document.querySelector('.travel-flight,.travel-warp'),
      focused:!document.getElementById('focusedChip').hidden,
      instant:document.getElementById('instantTravel').getAttribute('aria-pressed')
    }));
    if(report.flightFinish.moving||!report.flightFinish.focused||report.flightFinish.instant!=='true')
      throw Error('Instant toggle did not complete active flight: '+JSON.stringify(report.flightFinish));
    await wait(1450);
    if(await flying.page.locator('.travel-flight,.travel-warp').count())
      throw Error('A stale transition resumed after instant arrival');
    await flying.page.keyboard.press('Escape');
    if(await flying.page.locator('.travel-flight,.travel-warp').count())
      throw Error('Back navigation restarted a cancelled transition');
    await flying.context.close();
    // Rapid consecutive exam selection: the most recent real source must own
    // the question orbit; switching back must discard the previous node set.
    const rapid=await launch(browser,{motion:'reduce'});
    await groupFocus(rapid.page);
    const final=rapid.page.locator('.satellite-hit').filter({hasText:'2026 · 1학기 기말'}).first();
    const mid=rapid.page.locator('.satellite-hit').filter({hasText:'2026 · 1학기 중간'}).first();
    await final.evaluate(el=>el.click());
    await mid.evaluate(el=>el.click());
    await rapid.page.waitForFunction(()=>document.querySelectorAll('.question-orbit-node').length===24 &&
      document.getElementById('examTitle').textContent.includes('중간고사'),null,{timeout:35000});
    await wait(900);
    const rapidFirst=await clickActionableOrbit(rapid.page);
    const rapidLast=await clickActionableOrbit(rapid.page,[rapidFirst]);
    await rapid.page.waitForFunction(id=>document.querySelector('#questionStatus')?.textContent==='문항 '+id+' · 문제',
      rapidLast,{timeout:32000});
    const lastQuick=await rapid.page.evaluate(()=>{
      const d=document.getElementById('examFrame').contentDocument;
      return {file:new URL(d.location.href).searchParams.get('data'),
        number:d.querySelector('#print-area .ap-galaxy-selected-question .q-num')?.textContent.trim()};
    });
    if(lastQuick.number!==rapidLast+'.'||!lastQuick.file?.includes('1학기_중간'))throw Error('Latest rapid question selected wrong content: '+JSON.stringify(lastQuick));
    report.latestSelectionWins={file:'26_삼산중_1학기_중간_중3_기출.js',count:24,lastQuestion:lastQuick};
    await final.evaluate(el=>el.click());
    await rapid.page.waitForFunction(()=>document.querySelectorAll('.question-orbit-node').length>0 &&
      document.getElementById('examTitle').textContent.includes('기말고사'),null,{timeout:35000});
    report.examSwitch={latest:'26_삼산중_1학기_기말_중3_기출.js',
      count:await rapid.page.locator('.question-orbit-node').count()};
    if(report.examSwitch.count>96||report.examSwitch.count<1)throw Error('Exam switching failed');
    await rapid.page.locator('#closeDrawer').click();
    await rapid.context.close();

    // Escape during movement cancels the in-flight camera path and restores
    // the previous search/group context without triggering a new destination.
    const cancelled=await launch(browser);
    await groupFocus(cancelled.page);
    await cancelled.page.keyboard.press('Escape');
    report.motionCancellation=await cancelled.page.evaluate(()=>({
      moving:document.getElementById('universe').classList.contains('travel-warp')
        ||document.getElementById('universe').classList.contains('travel-flight'),
      selectedGroup:!document.getElementById('focusedChip').hidden,
      query:document.getElementById('search').value
    }));
    if(report.motionCancellation.moving||report.motionCancellation.selectedGroup ||
      report.motionCancellation.query!=='삼산중')throw Error('Escape cancellation did not restore exploration');
    await cancelled.context.close();

    // On-demand source failure must show an explicit error and zero invented
    // orbit labels; remove the injected network failure and retry the same source.
    const fail=await launch(browser,{motion:'reduce'});
    await groupFocus(fail.page);
    const expectedErrorsStart=errors.length;
    const broken=url=>decodeURIComponent(url.pathname).endsWith('/26_삼산중_1학기_중간_중3_기출.js');
    const failRoute=route=>route.abort('failed');
    await fail.page.route(broken,failRoute);
    await fail.page.locator('.satellite-hit').filter({hasText:'2026 · 1학기 중간'}).first().evaluate(el=>el.click());
    await fail.page.waitForFunction(() =>
      document.getElementById('questionStatus')?.textContent.includes('문항 궤도를 열지 못했습니다'),
      null,{timeout:20000});
    const failedCount=await fail.page.locator('.question-orbit-node').count();
    if(failedCount!==0)throw Error('Failure injected but fabricated question nodes appeared');
    await fail.page.unroute(broken,failRoute);
    report.sourceFailure={explicitStatus:true,fabricatedNodes:failedCount,
      expectedBrowserErrors:errors.splice(expectedErrorsStart)};
    await fail.page.locator('.satellite-hit').filter({hasText:'2026 · 1학기 중간'}).first().evaluate(el=>el.click());
    await fail.page.waitForFunction(() =>
      document.querySelectorAll('.question-orbit-node').length===24,
      null,{timeout:30000});
    report.sourceFailure.recoveryCount=await fail.page.locator('.question-orbit-node').count();
    await fail.context.close();
    // Question IDs may finish before the engine document. Two early clicks,
    // followed by switching exam during an unresolved document load, are latest-wins.
    const delayed=await launch(browser,{motion:'reduce'});
    await groupFocus(delayed.page);
    await delayed.page.route('**/archive/engine.html?*',async route=>{
      await wait(4500);await route.continue();
    });
    await delayed.page.locator('.satellite-hit').filter({hasText:'2026 · 1학기 중간'}).first().evaluate(el=>el.click());
    await delayed.page.waitForFunction(()=>document.querySelectorAll('.question-orbit-node').length===24,null,{timeout:30000});
    await wait(900);
    const earlyFirst=await clickActionableOrbit(delayed.page);
    const earlyLast=await clickActionableOrbit(delayed.page,[earlyFirst]);
    await delayed.page.waitForFunction(id=>document.querySelector('#questionStatus')?.textContent==='문항 '+id+' · 문제',
      earlyLast,{timeout:35000});
    report.delayedEngine=await delayed.page.evaluate(()=>{
      const d=document.getElementById('examFrame').contentDocument;
      return {file:new URL(d.location.href).searchParams.get('data'),
        number:d.querySelector('#print-area .ap-galaxy-selected-question .q-num')?.textContent.trim()};
    });
    if(!report.delayedEngine.file?.includes('1학기_중간')||report.delayedEngine.number!==earlyLast+'.')
      throw Error('Early click during slow iframe selected stale document: '+JSON.stringify(report.delayedEngine));
    await delayed.page.locator('.satellite-hit').filter({hasText:'2026 · 1학기 기말'}).first().evaluate(el=>el.click());
    await delayed.page.waitForFunction(()=>document.getElementById('examTitle').textContent.includes('기말고사')&&
      document.querySelectorAll('.question-orbit-node').length===24,null,{timeout:35000});
    await wait(900);
    const finalFirst=await clickActionableOrbit(delayed.page);
    await delayed.page.waitForFunction(id=>document.querySelector('#questionStatus')?.textContent==='문항 '+id+' · 문제',
      finalFirst,{timeout:35000});
    report.delayedSwitch=await delayed.page.evaluate(()=>{
      const d=document.getElementById('examFrame').contentDocument;
      return {file:new URL(d.location.href).searchParams.get('data'),
        number:d.querySelector('#print-area .ap-galaxy-selected-question .q-num')?.textContent.trim()};
    });
    if(!report.delayedSwitch.file?.includes('1학기_기말')||report.delayedSwitch.number!==finalFirst+'.')
      throw Error('A/B switch returned prior exam content: '+JSON.stringify(report.delayedSwitch));
    await delayed.context.close();
    report.errors=errors;
    if(errors.length)throw Error('Unexpected browser errors outside intentional failure test: '+JSON.stringify(errors));
    report.status='PASS';
    fs.writeFileSync(path.join(out,'journey-qa.json'),JSON.stringify(report,null,2)+'\n');
    fs.writeFileSync(path.join(out,'README.md'),[
      '# AP Galaxy first journey — real canonical item workflow',
      '',
      '- Base: '+base,
      '- New head: '+report.head,
      '- Browser: Chromium headless with SwiftShader software WebGL, 1600×900 DPR1.',
      '- Single sample: 2026 삼산중 1학기 중간, canonical JS source, 24 declared IDs. No exam/solution/answer iframe stub.',
      '- Workflow: galaxy → real exam → q2 single-column problem/answer/solution → full layout → standalone print pointer-ready → close/restore.',
      '- Real content screenshot sequence: journey-1 through journey-7; journey-real-content.webm.',
      '- Before/after WebGL clear-call frame proxy (3×2.5s): before '+report.beforeFps.samples.join(', ')+
        '; after '+report.afterFps.samples.join(', ')+'. Same software renderer, not physical PC GPU throughput.',
      '- Reduced motion: '+JSON.stringify(report.reducedMotion),
      '- Rapid latest-wins/switching: '+JSON.stringify([report.latestSelectionWins,report.examSwitch]),
      '- Movement cancellation and flight finish: '+JSON.stringify([report.motionCancellation,report.flightFinish]),
       '- Reader, print and loading-race tests: '+JSON.stringify([report.readerLayout,report.printRoute,report.delayedEngine,report.delayedSwitch]),
      '- Injected source failure and recovery: '+JSON.stringify(report.sourceFailure),
      '- Browser page/console errors outside intentional failure injection: '+errors.length,
      '- Known gaps: GPU performance on the actual PC, mobile 54-star browser test, browser history outside this tab, real physical printer were not verified.',
      ''].join('\n'));
    console.log(JSON.stringify({status:'PASS',orbitIds:report.orbitIds.length,answer:report.answer,solution:report.solution,before:report.beforeFps,after:report.afterFps}));
  }catch(error){
    report.status='FAIL';report.failure=error.stack||String(error);report.errors=errors;
    fs.writeFileSync(path.join(out,'journey-qa.json'),JSON.stringify(report,null,2)+'\n');
    console.error('JOURNEY_FAIL',report.failure);
    throw error;
  }finally{await browser.close();await new Promise(r=>server.close(r))}
}
main().catch(()=>process.exitCode=1);
