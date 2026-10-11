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
  const loc=await label.evaluate(el=>({x:parseFloat(el.style.left),y:parseFloat(el.style.top)+22}));
  if(!Number.isFinite(loc.x))throw Error('School position not projected');
  await page.evaluate(({x,y})=>{
    const c=document.getElementById('space');
    c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:x,clientY:y,pointerId:1}));
    c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:x,clientY:y,pointerId:1}));
  },loc);
  await page.waitForFunction(()=>!document.getElementById('focusedChip').hidden,null,{timeout:15000});
  return loc;
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
    const baseline=await launch(browser,{baseline:true,motion:'reduce'});
    await groupFocus(baseline.page);
    report.beforeFps=await fps(baseline.page);
    await baseline.context.close();
    const {page,context}=await launch(browser,{video:true});
    await groupFocus(page);
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
    await page.locator('[data-question-id="2"]').evaluate(el=>el.click());
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
    await page.locator('#wholeExam').click();
    await page.waitForFunction(()=>document.getElementById('questionToolbar').hidden,null,{timeout:13000});
    report.fullExam=await page.evaluate(()=>{
      const d=document.getElementById('examFrame').contentDocument;
      return {printButton:!!d.getElementById('btn-print'),source:document.getElementById('openOriginal').href,
        firstQuestion:d.getElementById('print-area')?.innerText.includes('다음 중 옳은 것은?')};
    });
    if(!report.fullExam.printButton||!report.fullExam.firstQuestion)throw Error('Full original exam / print path not preserved');
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
    report.afterFps=await fps(page);
    const video=page.video();
    await context.close();
    await video.saveAs(path.join(out,'journey-real-content.webm'));
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
    report.errors=errors;
    if(errors.length)throw Error('Unexpected browser errors: '+JSON.stringify(errors));
    report.status='PASS';
    fs.writeFileSync(path.join(out,'journey-qa.json'),JSON.stringify(report,null,2)+'\n');
    fs.writeFileSync(path.join(out,'README.md'),[
      '# AP Galaxy first journey — real canonical item workflow',
      '',
      '- Base: '+base,
      '- New head: '+report.head,
      '- Browser: Chromium headless with SwiftShader software WebGL, 1600×900 DPR1.',
      '- Single sample: 2026 삼산중 1학기 중간, canonical JS source, 24 declared IDs. No exam/solution/answer iframe stub.',
      '- Workflow: galaxy → exam star → 24-node orbit → q2 problem → answer → solution → full exam/print control → close/restore.',
      '- Real content screenshot sequence: journey-1 through journey-7; journey-real-content.webm.',
      '- Before/after WebGL clear-call frame proxy (3×2.5s): before '+report.beforeFps.samples.join(', ')+
        '; after '+report.afterFps.samples.join(', ')+'. Same software renderer, not physical PC GPU throughput.',
      '- Reduced motion initial test: '+JSON.stringify(report.reducedMotion),
      '- Browser page/console errors: '+errors.length,
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
