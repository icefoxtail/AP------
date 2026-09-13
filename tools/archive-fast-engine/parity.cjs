const {chromium}=require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');const fs=require('fs');
const out=require('path').resolve(__dirname,'../../reports/archive-fast-engine-v2');
const phase=process.argv[2]||'phase1a';
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});let records=[];
for(const width of [1440,390]){
 const p=await b.newPage({viewport:{width,height:1000}});await p.goto('http://127.0.0.1:8766/archive/engine.html?data=exams/test-fixtures/render-authority-golden.js&mode=exam&qpp=4&printDryRun=1');
 await p.waitForFunction(()=>window.__AP_RENDER_METRICS__?.finishedAt,{timeout:120000});
 for(const mode of ['exam','sol','ans']){
  if(mode!=='exam')await p.evaluate(m=>switchMode(m),mode);
  await p.evaluate(async()=>{await window.__AP_RENDER_READY__;await document.fonts.ready;await raf()});
  const capture=()=>p.evaluate(()=>{const area=document.querySelector('#print-area');return {
   mode:AppState.mode,qpp:AppState.qpp,questions:AppState.data.length,
   text:area.textContent,sourceRefs:[...area.querySelectorAll('[data-source-ref]')].map(n=>n.dataset.sourceRef),
   pages:[...area.querySelectorAll('.page')].map(n=>({text:n.textContent,refs:[...n.querySelectorAll('[data-source-ref]')].map(n=>n.dataset.sourceRef),w:n.offsetWidth,h:n.offsetHeight})),
   shapes:[...area.querySelectorAll('.q-box,.sol-box,.sol-box-long,.sol-exp,mjx-container,img')].map(n=>({tag:n.tagName,cls:typeof n.className==='string'?n.className:'',w:n.offsetWidth,h:n.offsetHeight})),
   images:[...area.querySelectorAll('img')].map(n=>({src:n.getAttribute('src'),w:n.naturalWidth,h:n.naturalHeight})),
   math:APRenderLoop.unrenderedMathCount(area),ledger:AppState.layoutMeasurementLedger,solutionLedger:AppState.solutionDecisionLedger,metrics:window.__AP_RENDER_METRICS__
  }});
  const active=await capture();await p.screenshot({path:`${out}/${phase}-${width}-${mode}.png`,fullPage:true});
  let prototype=null;
  if(phase==='phase0'&&width===1440){
   await p.evaluate(async()=>{const a=document.querySelector('#print-area');a.style.cssText='position:absolute;left:-20000px;top:0;visibility:hidden;width:1440px;';await render();});
   prototype=await capture();await p.evaluate(()=>document.querySelector('#print-area').removeAttribute('style'));
  }
  records.push({width,mode,active,prototype});console.log(phase,width,mode,active.pages.length,active.math);
 }
 await p.close();
}fs.writeFileSync(`${out}/${phase}-parity.json`,JSON.stringify(records,null,2));await b.close();})().catch(e=>{console.error(e);process.exit(1)});
