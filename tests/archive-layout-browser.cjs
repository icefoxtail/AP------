const {chromium}=require(process.env.AP_PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const out=path.resolve(__dirname,'../reports/archive-fast-engine-v2');
const fixtures=['test-fixtures/render-authority-golden.js','original/middle/m3/2final/23_순여중_2학기_기말_중3_기출.js','types/high/h1/항등식과나머지정리_고1_유형.js'];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 for(const width of [1440,390])for(const file of (process.env.AP_LAYOUT_FIXTURE==='golden'?fixtures.slice(0,1):fixtures))for(const mode of ['exam','sol']){
  const records=[];
  for(const planner of ['observed','authority']){
   const p=await browser.newPage({viewport:{width,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(String(e)));
   await p.route('**/api/**',r=>r.abort());
   await p.goto('http://127.0.0.1:8766/archive/engine.html?data='+encodeURIComponent('exams/'+file)+'&mode='+mode+'&snapshotCache=0&prewarm=0'+(planner==='observed'?'&layoutPlanner=observed':''));
   await p.waitForFunction(()=>window.archiveScreenRuntime);const ready=await p.evaluate(()=>archiveScreenRuntime.whenIdle());assert.equal(ready.ok,true,JSON.stringify(ready));
   records.push(await p.evaluate(mode=>{const root=document.getElementById('print-area');return {
    text:root.textContent,pages:root.querySelectorAll('.page').length,
    shapes:[...root.querySelectorAll('.page,.q-box,.sol-box,.sol-exp,mjx-container,img')].map(n=>({w:n.offsetWidth,h:n.offsetHeight})),
    ledger:mode==='sol'?AppState.solutionDecisionLedger:AppState.layoutMeasurementLedger,
    placement:mode==='sol'?AppState.solutionObservedPlacementLedger:[...root.querySelectorAll('.page')].map(p=>[...p.querySelectorAll('[data-source-ref]')].map(n=>n.dataset.sourceRef)),
    continuations:[...root.querySelectorAll('.sol-box')].map(n=>({source:n.dataset.sourceRef,primary:!!n.querySelector('.q-num'),parts:[...n.querySelector('.sol-exp').children].map(c=>c.textContent)})),
    images:[...root.querySelectorAll('img')].map(n=>({src:n.src,w:n.naturalWidth,h:n.naturalHeight})),
    production:AppState.layoutAuthorityEvidence&&{mode:AppState.layoutAuthorityEvidence.mode,planner:AppState.layoutAuthorityEvidence.planner,before:AppState.layoutAuthorityEvidence.measuredBeforePlacement,clone:AppState.layoutAuthorityEvidence.canonicalCloneCount},
    metrics:__AP_RENDER_METRICS__
   }},mode));
   assert.deepEqual(errors,[]);
   await p.screenshot({path:path.join(out,`phase6-${planner}-${width}-${mode}-${Buffer.from(file).toString('base64url').slice(0,12)}.png`),fullPage:true});
   await p.close();
  }
  const [observed,authority]=records;
  fs.writeFileSync(path.join(out,'phase6-last-comparison.json'),JSON.stringify({file,width,mode,observed,authority},null,2));
  for(const key of ['text','pages','shapes','ledger','placement','continuations','images'])assert.deepEqual(authority[key],observed[key],`${file}/${width}/${mode}/${key}`);
  assert.equal(authority.production.before,true);assert.equal(authority.production.clone,0);
  results.push({file,width,mode,parity:true,pages:authority.pages,continuationCount:authority.continuations.filter(x=>!x.primary).length,production:authority.production,before:observed.metrics,after:authority.metrics});
  fs.writeFileSync(path.join(out,'phase6-layout-browser.json'),JSON.stringify(results,null,2));
  console.log('PASS',width,mode,file,observed.metrics.renderReadyMs,'->',authority.metrics.renderReadyMs);
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
