const {chromium}=require(process.env.AP_PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const out=path.resolve(__dirname,'../reports/archive-fast-engine-v2');
const mode=process.env.AP_MEASUREMENT_MODE||'sol';
const fixtures=['test-fixtures/render-authority-golden.js','original/middle/m3/2final/23_순여중_2학기_기말_중3_기출.js','types/high/h1/항등식과나머지정리_고1_유형.js'];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 for(const width of [1440,390])for(const file of fixtures){
  const records=[];
  for(const measurement of ['legacy','batch']){
   const p=await browser.newPage({viewport:{width,height:1000}});
   await p.route('**/api/**',r=>r.abort());
   await p.goto('http://127.0.0.1:8766/archive/engine.html?data='+encodeURIComponent('exams/'+file)+'&mode='+mode+'&snapshotCache=0&measurement='+measurement);
   await p.waitForFunction(()=>window.archiveScreenRuntime);const ready=await p.evaluate(()=>archiveScreenRuntime.whenIdle());assert.equal(ready.ok,true,JSON.stringify(ready));
   records.push(await p.evaluate(mode=>{const root=document.getElementById('print-area');return {
    text:root.textContent,pages:root.querySelectorAll('.page').length,
    shapes:[...root.querySelectorAll('.page,.q-box,.sol-box,.sol-exp,mjx-container,img')].map(n=>({w:n.offsetWidth,h:n.offsetHeight})),
    ledger:mode==='sol'?AppState.solutionDecisionLedger:AppState.layoutMeasurementLedger,
    placement:mode==='sol'?AppState.solutionObservedPlacementLedger:[...root.querySelectorAll('.page')].map(p=>[...p.querySelectorAll('[data-source-ref]')].map(n=>n.dataset.sourceRef)),
    images:[...root.querySelectorAll('img')].map(n=>({src:n.src,w:n.naturalWidth,h:n.naturalHeight})),metrics:__AP_RENDER_METRICS__
   }},mode));
   await p.close();
  }
  const [legacy,batch]=records;
  for(const key of ['text','pages','shapes','ledger','placement','images'])assert.deepEqual(batch[key],legacy[key],`${file}/${width}/${key}`);
  assert.ok(batch.metrics.rafCount<legacy.metrics.rafCount,'layout barriers must decrease');
  if(mode==='sol')assert.ok(batch.metrics.mathJaxCalls<legacy.metrics.mathJaxCalls,'typeset calls must decrease');
  results.push({file,width,mode,parity:true,before:legacy.metrics,after:batch.metrics});
  fs.writeFileSync(path.join(out,`measurement-${mode}-parity.json`),JSON.stringify(results,null,2));
  console.log('PASS',width,file,legacy.metrics.renderReadyMs,'->',batch.metrics.renderReadyMs,'calls',legacy.metrics.mathJaxCalls,'->',batch.metrics.mathJaxCalls);
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
