const {chromium}=require(process.env.AP_PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const out=path.resolve(__dirname,'../reports/archive-fast-engine-v2');
const mode=process.env.AP_SNAPSHOT_MODE||'sol';
const fixtures=['test-fixtures/render-authority-golden.js','original/middle/m3/2final/23_순여중_2학기_기말_중3_기출.js','types/high/h1/항등식과나머지정리_고1_유형.js'];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 for(const width of [1440,390])for(const file of fixtures){
  const p=await browser.newPage({viewport:{width,height:1000}});
  await p.route('**/api/**',r=>r.abort());
  await p.goto('http://127.0.0.1:8766/archive/engine.html?data='+encodeURIComponent('exams/'+file)+'&mode='+mode+'&printDryRun=1');
  await p.waitForFunction(()=>window.archiveScreenRuntime,undefined,{timeout:30000});
  const initial=await p.evaluate(()=>archiveScreenRuntime.whenIdle());assert.equal(initial.ok,true,JSON.stringify(initial));
  const result=await p.evaluate(async mode=>{
   const runtime=archiveScreenRuntime,initial=runtime.activeSnapshot;
   const record=()=>{const root=document.getElementById('print-area');return {text:root.textContent,pages:root.querySelectorAll('.page').length,images:[...root.querySelectorAll('img')].map(n=>({src:n.src,w:n.naturalWidth,h:n.naturalHeight})),ledger:JSON.stringify(mode==='sol'?AppState.solutionDecisionLedger:AppState.layoutMeasurementLedger),shapes:[...root.querySelectorAll('.q-box,.sol-box,.sol-exp')].map(n=>({w:n.offsetWidth,h:n.offsetHeight,source:n.dataset.sourceRef}))}};
   const before=record();const timings=[];
   for(let i=0;i<3;i++){
    await switchMode(mode==='exam'?'ans':'exam');
    const started=performance.now();const result=await switchMode(mode);timings.push(performance.now()-started);
    if(!result.ok)throw Error(result.code);
    const attempt=runtime.inspect().attempts.at(-1);
    if(attempt.cacheStatus!=='HIT'||attempt.metrics.mathJaxCalls!==0)throw Error('CACHE_MISS');
   }
   const after=record();await safePrint('vector');
   return {before,after,timings,identity:initial===runtime.activeSnapshot,print:JSON.parse(document.documentElement.dataset.apSnapshotPrintPreflight),mathCalls:__AP_RENDER_METRICS__.mathJaxCalls};
  },mode);
  assert.equal(result.identity,true);assert.deepEqual(result.before,result.after);assert.equal(result.print.pass,true);
  results.push({file,width,mode,pages:result.after.pages,images:result.after.images.length,ledgerAndGeometryParity:true,identity:true,timings:result.timings,mathCalls:result.mathCalls,print:result.print});
  console.log('PASS',width,file,Math.max(...result.timings).toFixed(1)+'ms');await p.close();
  fs.writeFileSync(path.join(out,`snapshot-${mode}-fixtures.json`),JSON.stringify(results,null,2));
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
