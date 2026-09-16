const {chromium}=require(process.env.AP_PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const out=path.resolve(__dirname,'../reports/archive-fast-engine-v2');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 for(const width of [1440,390]){
  const p=await browser.newPage({viewport:{width,height:1000}});
  await p.route('**/api/**',r=>r.abort());
  await p.goto('http://127.0.0.1:8766/archive/engine.html?data=exams/test-fixtures/render-authority-golden.js&mode=ans');
  await p.waitForFunction(()=>window.archiveScreenRuntime?.activeSnapshot);await p.evaluate(()=>archiveScreenRuntime.whenIdle());
  await p.evaluate(()=>{
   window.oldRoot=document.getElementById('print-area');window.frames=[];window.sampling=true;
   window.sampleFrame=()=>{if(!sampling)return;const root=document.getElementById('print-area');frames.push({blank:!root?.querySelector('.page'),mode:AppState.mode,url:new URL(location.href).searchParams.get('mode'),tab:document.querySelector('.mode-tab.active')?.id,snapshot:archiveScreenRuntime.activeSnapshot.mode});requestAnimationFrame(sampleFrame)};requestAnimationFrame(sampleFrame);
   window.executor=APExamRenderExecutor;
   window.geometry=root=>[...root.querySelectorAll('.page,.q-box')].map(n=>({w:n.offsetWidth,h:n.offsetHeight}));
   window.APExamRenderExecutor={...executor,async render(args){window.entered=true;await new Promise(r=>window.releaseBuild=r);const result=await executor.render(args);window.hiddenGeometry=geometry(args.area);return result}};
   window.pending=switchMode('exam');
  });
  await p.waitForFunction(()=>window.entered);await p.waitForTimeout(100);
  const preparing=await p.evaluate(()=>({oldConnected:oldRoot.isConnected,mode:AppState.mode,hosts:document.querySelectorAll('[data-archive-build-root]').length,connected:document.querySelector('[data-archive-build-root]').isConnected,display:getComputedStyle(document.querySelector('[data-archive-build-root]')).display}));
  assert.equal(preparing.oldConnected,true);assert.equal(preparing.mode,'ans');assert.equal(preparing.hosts,1);assert.equal(preparing.connected,true);assert.notEqual(preparing.display,'none');
  await p.evaluate(()=>releaseBuild());const result=await p.evaluate(()=>pending);assert.equal(result.ok,true);
  await p.waitForTimeout(80);
  const sampled=await p.evaluate(()=>{sampling=false;window.APExamRenderExecutor=executor;return {frames,hidden:hiddenGeometry,active:geometry(document.getElementById('print-area'))}});
  assert.deepEqual(sampled.hidden,sampled.active);assert.ok(sampled.frames.length>2);
  assert.ok(sampled.frames.every(f=>!f.blank&&f.mode===f.url&&f.tab==='btn-'+f.mode&&f.mode===f.snapshot));
  const recovery=await p.evaluate(async()=>{
   const runtime=archiveScreenRuntime,oldSession=runtime.currentSession,old=runtime.activeSnapshot,clear=MathJax.typesetClear;
   MathJax.typesetClear=elements=>{if(elements.includes(old.rootNode))throw Error('INJECTED_CLEANUP_FAILURE');return clear.call(MathJax,elements)};
   const source=await runtime.request({type:'SOURCE_CHANGE',payload:{safeDataUrl:'exams/test-fixtures/render-authority-golden.js',mode:'ans'}});
   const retained=oldSession.status==='RETIRED_PENDING_CLEANUP'&&runtime.inspect().cleanupPending>0;
   MathJax.typesetClear=clear;await runtime.request({type:'FORCED_REBUILD'});
   return {committed:source.ok,retained,recovered:oldSession.status==='EVICTED'&&runtime.inspect().cleanupPending===0};
  });
  assert.deepEqual(recovery,{committed:true,retained:true,recovered:true});
  results.push({width,preparing,frames:sampled.frames.length,noBlankOrMixedFrame:true,geometryParity:true,recovery});
  await p.close();console.log('PASS',width);
 }
 fs.writeFileSync(path.join(out,'phase2-browser.json'),JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
