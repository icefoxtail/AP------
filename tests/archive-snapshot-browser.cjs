const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(__dirname, '../reports/archive-fast-engine-v2');
const mode=process.env.AP_SNAPSHOT_MODE || 'ans';
const phase=mode==='ans'?'phase1b':mode==='sol'?'phase1c':'phase1d';
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 const results=[];
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.route('**/api/**',r=>r.abort());
  await page.goto('http://127.0.0.1:8766/archive/engine.html?data=exams/test-fixtures/render-authority-golden.js&mode='+mode+'&printDryRun=1');
  await page.waitForFunction(()=>window.archiveScreenRuntime?.activeSnapshot,{timeout:60000});
  await page.evaluate(()=>archiveScreenRuntime.whenIdle());
  const result=await page.evaluate(async(targetMode)=>{
   const runtime=archiveScreenRuntime;const otherMode=targetMode==='exam'?'ans':'exam';
   const original=runtime.activeSnapshot, root=original.rootNode, text=root.textContent;
   const builtRequestGeneration=original.builtRequestGeneration;
   await switchMode(otherMode);
   const kept=original.status==='READY' && !root.isConnected;
   const math=MathJax.typesetPromise;
   MathJax.typesetPromise=()=>{throw Error('CACHE_HIT_TYPESET_FORBIDDEN')};
   const switched=await switchMode(targetMode);
   MathJax.typesetPromise=math;
   const attempt=runtime.inspect().attempts.at(-1);
   await safePrint('vector');
   const preflight=JSON.parse(document.documentElement.dataset.apSnapshotPrintPreflight);
   const firstTracker=archiveReadinessTracker;await safePrint('vector');
   const repeated=firstTracker!==archiveReadinessTracker;
   await switchMode(otherMode);
   const beforeRoot=document.getElementById('print-area'), beforeMode=AppState.mode;
   const push=history.pushState;history.pushState=()=>{throw Error('CACHE_COMMIT_FAIL')};
   const failed=await switchMode(targetMode);history.pushState=push;
   const rollback=!failed.ok && document.getElementById('print-area')===beforeRoot && AppState.mode===beforeMode && original.status==='READY';
   const retry=await switchMode(targetMode);
   await setPrintHeaderOptions({title:'Changed header'});
   const invalidated=runtime.activeSnapshot!==original && original.status==='EVICTED';
   const invalidations=[];
   for(const type of ['QPP_CHANGE','QR_CHANGE','PROFILE_CHANGE','FONT_INVALIDATION','ASSET_INVALIDATION','PAGE_LAYOUT_INVALIDATION','ENGINE_INVALIDATION']) {
    const previous=runtime.activeSnapshot;
    const result=await runtime.request({type,payload:{qpp:6,qrState:{sol:true},profile:{layout:'test'},fingerprint:'snapshot-test-'+type}});
    invalidations.push({type,pass:result.ok&&runtime.activeSnapshot!==previous&&previous.status==='EVICTED'});
   }
   const snapshot=runtime.activeSnapshot;
   const fingerprints=snapshot.fingerprints;
   snapshot.fingerprints={...fingerprints,font:'wrong'};
   const rejectedFont=!APArchiveSnapshotContract.preflight(snapshot,runtime.committedCandidate).gates.P12;
   snapshot.fingerprints=fingerprints;
   const items=Array.from({length:40},(_,i)=>({id:i+1,content:'question '+i,answer:'긴 정답 확인 '.repeat(14),solution:'test'}));
   const url=URL.createObjectURL(new Blob(['window.examTitle="Answer refit";window.questionBank='+JSON.stringify(items)],{type:'text/javascript'}));
   const refit=await runtime.request({type:'SOURCE_CHANGE',payload:{safeDataUrl:url,mode:'ans'}});
   URL.revokeObjectURL(url);
   const refitCount=document.querySelectorAll('#print-area .ans-cell[data-source-ref]').length;
   const pages=document.querySelectorAll('#print-area .page').length;
   return {width:innerWidth,kept,switched:switched.ok,identity:root===original.rootNode,textParity:root.textContent===text,cacheStatus:attempt.cacheStatus,mathCalls:attempt.metrics.mathJaxCalls,oldProvenance:builtRequestGeneration<attempt.requestGeneration,preflight,repeated,rollback,retry:retry.ok,invalidated,invalidations,rejectedFont,refit:refit.ok,refitCount,pages,common:original.commonHardGateEvidence};
  },mode);
  assert.equal(result.kept,true);assert.equal(result.switched,true);assert.equal(result.identity,true);assert.equal(result.textParity,true);
  assert.equal(result.cacheStatus,'HIT');assert.equal(result.mathCalls,0);assert.equal(result.oldProvenance,true);
  assert.equal(result.preflight.pass,true);assert.equal(Object.keys(result.preflight.gates).length,23);
  assert.equal(result.repeated,true);assert.equal(result.rollback,true);assert.equal(result.retry,true);assert.equal(result.invalidated,true);
  assert.ok(result.invalidations.every(r=>r.pass));assert.equal(result.rejectedFont,true);assert.equal(result.refit,true);assert.equal(result.refitCount,40);assert.ok(result.pages>1);
  assert.deepEqual(errors,[]);
  await page.evaluate(async mode=>{
   await setQrOutputParam('sol',false);
   await archiveScreenRuntime.request({type:'SOURCE_CHANGE',payload:{safeDataUrl:'exams/test-fixtures/render-authority-golden.js',mode,qpp:4}});
   await switchMode(mode==='exam'?'ans':'exam');await switchMode(mode);
  },mode);
  const visual=await page.evaluate(()=>{const area=document.getElementById('print-area');return {
   text:area.textContent,sourceRefs:[...area.querySelectorAll('[data-source-ref]')].map(n=>n.dataset.sourceRef),
   pages:[...area.querySelectorAll('.page')].map(n=>({text:n.textContent,refs:[...n.querySelectorAll('[data-source-ref]')].map(n=>n.dataset.sourceRef),w:n.offsetWidth,h:n.offsetHeight})),
   shapes:[...area.querySelectorAll('.q-box,.sol-box,.sol-box-long,.sol-exp,mjx-container,img')].map(n=>({tag:n.tagName,cls:typeof n.className==='string'?n.className:'',w:n.offsetWidth,h:n.offsetHeight}))
  }});
  const baseline=JSON.parse(fs.readFileSync(path.join(out,'phase0-parity.json'))).find(r=>r.width===width&&r.mode===mode).active;
  for(const key of Object.keys(visual))assert.deepEqual(visual[key],baseline[key],key);
  result.visualParity='PASS';results.push(result);
  await page.screenshot({path:path.join(out,`${phase}-${width}.png`),fullPage:true});
  await page.close();console.log('PASS',width);
 }
 fs.writeFileSync(path.join(out,`${phase}-browser.json`),JSON.stringify(results,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
