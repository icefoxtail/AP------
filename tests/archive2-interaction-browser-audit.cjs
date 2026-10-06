const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(path.resolve(root)+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const context=await browser.newContext();
  await context.addInitScript(()=>{
   localStorage.setItem('APMATH_SESSION',JSON.stringify({id:'local-read-only',role:'teacher'}));
   const open=indexedDB.open.bind(indexedDB);
   Object.defineProperty(window,'indexedDB',{value:{open(name,...args){
    if(name!=='apmath-archive2-output-v1')return open(name,...args);
    const request={error:new DOMException('Internal error.','UnknownError')};queueMicrotask(()=>request.onerror?.());return request;
   }}});
   const save=Storage.prototype.setItem;
   Storage.prototype.setItem=function(key,value){
    if(/^(APMATH_ARCHIVE2_OUTPUT_ENVELOPE|mixedQuestions_|mixedMeta_)/.test(key))throw new DOMException('Storage quota exceeded','QuotaExceededError');
    return save.call(this,key,value);
   };
  });
  const page=await context.newPage();
  page.on('pageerror',e=>console.log('PAGEERROR',e.message));
  const base=`http://127.0.0.1:${server.address().port}/archive/`;
  let sourceQuestions;
  await page.goto(base+'workspace.html?view=find');
  await page.locator('[data-action="source-output-direct"]').first().waitFor({timeout:60000});
  for(const mode of ['exam','sol','ans']){
   const promise=page.waitForEvent('popup');const start=Date.now();
   await page.locator(`.exam .actions [data-action="source-output-direct"][data-mode="${mode}"]`).first().click();
   const popup=await promise;
   await popup.waitForURL(/engine.html/,{timeout:10000});
   console.log('ORIGINAL_URL',mode,popup.url(),'openedMs',Date.now()-start);
   await popup.waitForFunction(()=>window.__AP_RENDER_READY__&&document.querySelector('#print-area .page'),{timeout:60000});
   const result=await popup.evaluate(async()=>({ready:await window.__AP_RENDER_READY__,pages:document.querySelectorAll('#print-area .page').length,error:document.documentElement.dataset.apRenderError}));
   console.log('ORIGINAL_RENDER',mode,JSON.stringify(result),'totalMs',Date.now()-start);
   if(mode==='sol')console.log('SOLUTION_METRICS',JSON.stringify(await popup.evaluate(()=>window.__AP_RENDER_METRICS__)));
   if(!result.pages||result.error||result.ready?.ok===false)throw new Error('original route failed');
   if(mode==='exam')sourceQuestions=await popup.evaluate(()=>AppState.data);
   await popup.close();
  }
  for(const mode of ['exam','ans']){
   const promise=page.waitForEvent('popup');
   await page.evaluate(async({questions,mode})=>{
    const questionUids=questions.map(q=>q.questionUid||q.source_question_uid||q._sourceQuestionUid||q.question_uid||null);
    const paper={id:'11111111-1111-4111-8111-111111111111',title:'Storage-independent saved output',snapshot:{questions,meta:{title:'Storage-independent saved output',qpp:4,questionUids,printHeaderOptions:{title:'Storage-independent saved output'},auditPadding:'x'.repeat(6*1024*1024)}}};
    await Archive2Library.openOutput(paper.id,mode,paper);
   },{questions:sourceQuestions,mode});
   const popup=await promise;
   await popup.waitForURL(/mixed_engine.html/,{timeout:10000});
   await popup.waitForFunction(()=>window.__AP_OUTPUT_RENDER_READY__||window.__AP_OUTPUT_RENDER_ERROR__,{timeout:60000});
   const evidence=await popup.evaluate(()=>({ready:window.__AP_OUTPUT_RENDER_READY__,error:window.__AP_OUTPUT_RENDER_ERROR__}));
   console.log('QUOTA_SAVED_OUTPUT',mode,JSON.stringify(evidence));
   if(!evidence.ready||evidence.error)throw new Error('memory bridge output failed');
   await popup.close();
  }
  await page.goto(base+'workspace.html?view=compose');
  await page.locator('[data-action="scope-all"]').waitFor({timeout:60000});
  for(const action of ['scope-all','scope-clear'])console.log('COMPOSE',action,await page.evaluate(action=>{const el=document.querySelector(`[data-action="${action}"]`);const start=performance.now();el.click();return performance.now()-start;},action));
  console.log('COMPOSE all selection',await page.evaluate(()=>{document.querySelector('[data-action="scope-all"]').click();const el=document.getElementById('distribution');const start=performance.now();el.value='all';el.dispatchEvent(new Event('change',{bubbles:true}));return performance.now()-start;}));
  await page.goto(base+'unit-past-exams.html?ready=1');
  await page.waitForFunction(()=>window.UnitPastExams,{timeout:60000});
  await page.locator('.unit-grade-card').first().waitFor({timeout:60000});
  console.log('UNIT_INITIAL',(await page.locator('#unit-status').innerText()).slice(0,120));
  console.log('UNIT_GRADE',await page.evaluate(()=>{const start=performance.now();UnitPastExams.selectProfile('h1');return performance.now()-start;}));
  console.log('UNIT_CARDS',(await page.locator('#unit-content').innerText()).slice(0,450));
  await page.locator('[onclick*="renderDetail"]').first().click();
  await page.locator('[onclick*="previewExistingPaper"]').first().click();
  await page.locator('#unit-preview-iframe').waitFor({timeout:60000});
  const unitFrame=await (await page.locator('#unit-preview-iframe').elementHandle()).contentFrame();
  await unitFrame.waitForURL(/mixed_engine.html/,{timeout:10000});
  await unitFrame.waitForFunction(()=>window.__AP_OUTPUT_RENDER_READY__||window.__AP_OUTPUT_RENDER_ERROR__,{timeout:60000});
  console.log('QUOTA_UNIT_PREVIEW',JSON.stringify(await unitFrame.evaluate(()=>({ready:window.__AP_OUTPUT_RENDER_READY__,error:window.__AP_OUTPUT_RENDER_ERROR__}))));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
