const {chromium}=require(process.env.AP_PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const out=path.resolve(__dirname,'../reports/archive-fast-engine-v2');
const base='http://127.0.0.1:8766/archive/engine.html?data=exams/test-fixtures/render-authority-golden.js&qpp=4&prewarm=0&snapshotCache=0';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 const runModes=async (label, query, clickNavigates=false) => {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base+'&mode=exam&'+query);await page.waitForFunction(()=>window.__AP_RENDER_METRICS__?.finishedAt,undefined,{timeout:60000});
  for(const mode of ['exam','sol','ans']){
   if(mode!=='exam'){
    if(clickNavigates) {
     await Promise.all([page.waitForURL(url=>new URL(url).searchParams.get('mode')===mode),page.locator('#btn-'+mode).click()]);
     await page.waitForFunction(()=>window.__AP_RENDER_METRICS__?.finishedAt);
    } else await page.evaluate(async m=>{await switchMode(m);await (window.archiveScreenRuntime?archiveScreenRuntime.whenIdle():window.__AP_RENDER_READY__)},mode);
   }
   const state=await page.evaluate(label=>({label,mode:AppState.mode,pages:document.querySelectorAll('#print-area .page').length,math:APRenderLoop.unrenderedMathCount(document.getElementById('print-area')),runtime:Boolean(window.archiveScreenRuntime),layoutProduction:document.documentElement.dataset.apLayoutAuthorityProduction||null}),label);
   assert.equal(state.mode,mode);assert.equal(state.pages,[4,3,1][['exam','sol','ans'].indexOf(mode)]);assert.equal(state.math,0);results.push(state);
  }
  assert.deepEqual(errors,[]);await page.close();
 };
 await runModes('screen-runtime-legacy','screenRuntime=legacy');
 await runModes('renderer-legacy','renderer=legacy',true);
 await runModes('executor-legacy','examAuthority=legacy&solutionAuthority=legacy&answerAuthority=legacy');
 await runModes('observed-layout','layoutPlanner=observed');
 const screenLegacy=results.filter(r=>r.label==='screen-runtime-legacy'||r.label==='renderer-legacy');assert.ok(screenLegacy.every(r=>!r.runtime));
 const observed=results.filter(r=>r.label==='observed-layout');assert.ok(observed.every(r=>r.runtime&&r.layoutProduction===null));
 fs.writeFileSync(path.join(out,'phase7-legacy-browser.json'),JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
