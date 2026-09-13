const {chromium}=require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs'); const path=require('path'); const zlib=require('zlib');
const root=path.resolve(__dirname,'../..');
const crypto=require('crypto');
const implementationFiles=['engine.html','screen-runtime.js','screen-runtime-adapter.js','render-state-normalizer.js','side-effect-ledger.js','mathjax_render_loop.js','exam-render-executor.js','solution-render-executor.js','answer-render-executor.js'];
const implementationHashes=()=>Object.fromEntries(implementationFiles.filter(f=>fs.existsSync(path.join(root,'archive',f))).map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'archive',f))).digest('hex')]));
const phase=process.argv[2] || 'phase1a';
const out=path.join(root,'reports/archive-fast-engine-v2');
const traceDir=process.env.AP_TRACE_DIR || path.join(require('os').tmpdir(),'ap-fast-engine-traces');
fs.mkdirSync(traceDir,{recursive:true});
if(phase==='phase0') require('child_process').execFileSync('git',['diff','--exit-code','ea6564cdda7a496412246522fab5940086b48a65','--','archive/engine.html','archive/mathjax_render_loop.js'],{cwd:root,stdio:'pipe'});
fs.mkdirSync(out,{recursive:true});
const fixtures=[
 ['golden','test-fixtures/render-authority-golden.js',['A','C','D','E','F','I','J']],
 ['images','original/middle/m3/2final/23_순여중_2학기_기말_중3_기출.js',['B','I','J']],
 ['scale','types/high/h1/항등식과나머지정리_고1_유형.js',['A','G','H','I','J']]
];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 // Read-only baseline: suppress external business writes, retain real assets/rendering.
 await context.route('**/api/exam-blueprints',r=>r.abort());
 await context.route('**/api/class-exam-assignments',r=>r.abort());
 const page=await context.newPage(); const cdp=await context.newCDPSession(page);
 const report={phase,baselineSha:'ea6564cdda7a496412246522fab5940086b48a65',implementationHashes:implementationHashes(),browser:browser.version(),viewport:{width:1440,height:1000},repetitions:2,fixtures,results:[],errors:[]};
 page.on('pageerror',e=>report.errors.push(String(e)));
 const collect=async(label,started)=>{
  await page.evaluate(async()=>{await window.__AP_RENDER_READY__;await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
  const result=await page.evaluate(()=>({mode:AppState.mode,qpp:AppState.qpp,questions:AppState.data.length,metrics:window.__AP_RENDER_METRICS__,readiness:archiveReadinessTracker?.snapshot(),pages:document.querySelectorAll('#print-area .page').length,nodes:document.querySelectorAll('#print-area *').length,images:[...document.querySelectorAll('#print-area img')].map(i=>({src:i.getAttribute('src'),w:i.naturalWidth,h:i.naturalHeight})),continuations:document.querySelectorAll('#print-area .sol-box-long').length}));
  result.label=label;result.wallVisibleMs=Date.now()-started;report.results.push(result);console.log(label,result.metrics?.renderReadyMs,result.pages);
 };
 for(const [id,file] of fixtures) for(let repeat=0;repeat<2;repeat++){
  const traceName=`${phase}-${id}-${repeat}`;
  await cdp.send('Tracing.start',{categories:'devtools.timeline,v8,blink.user_timing',transferMode:'ReturnAsStream'});
  let started=Date.now();await page.goto('http://127.0.0.1:8766/archive/engine.html?data='+encodeURIComponent('exams/'+file)+'&mode=exam&qpp=4',{waitUntil:'load'});
  await page.waitForFunction(()=>window.__AP_RENDER_METRICS__?.finishedAt,{timeout:120000});
  await collect(`${traceName}:initial`,started);
  for(const mode of ['sol','ans','exam','sol']){started=Date.now();await page.locator('#btn-'+mode).click();await collect(`${traceName}:${mode}`,started);}
  started=Date.now();await page.evaluate(()=>setPrintHeaderOptions({title:'Phase 0 header',subtitle:'긴 헤더 줄바꿈 기하 확인'}));await collect(`${traceName}:header`,started);
  await page.evaluate(()=>switchMode('exam'));
  started=Date.now();await page.evaluate(()=>setQrOutputParam('sol',true));await collect(`${traceName}:qr`,started);
  started=Date.now();await page.evaluate(()=>{if(window.archiveScreenRuntime)return setArchiveQpp(6);AppState.qpp=6;return render();});await collect(`${traceName}:qpp`,started);
  // Move the actual canonical nodes; do not clone a snapshot or replace the renderer.
  const geometry=await page.evaluate(async()=>{
   const area=document.querySelector('#print-area'); const nodes=[...area.childNodes];
   const inspect=()=>[...area.querySelectorAll('.page,.q-box,.sol-box,mjx-container,img')].map(n=>{const r=n.getBoundingClientRect();return {tag:n.className||n.tagName,w:r.width,h:r.height,client:n.clientHeight,scroll:n.scrollHeight};});
   const before=inspect();const prior=area.style.cssText;
   area.style.cssText+=';position:absolute;left:-20000px;top:0;visibility:hidden;width:'+area.getBoundingClientRect().width+'px;';
   await new Promise(r=>requestAnimationFrame(r));const after=inspect();area.style.cssText=prior;
   return {connected:area.isConnected,display:getComputedStyle(area).display,count:before.length,maxDelta:Math.max(0,...before.map((v,i)=>Math.max(Math.abs(v.w-after[i].w),Math.abs(v.h-after[i].h)))),exact:JSON.stringify(before)===JSON.stringify(after),rootIdentity:nodes.every((n,i)=>n===area.childNodes[i])};
  });report.results[report.results.length-1].geometry=geometry;
  await page.screenshot({path:path.join(out,`${traceName}.png`),fullPage:false});
  const complete=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');const {stream}=await complete;let chunks=[];
  while(true){const r=await cdp.send('IO.read',{handle:stream});chunks.push(r.data);if(r.eof)break;}await cdp.send('IO.close',{handle:stream});
  const raw=chunks.join('');fs.writeFileSync(path.join(traceDir,`${traceName}.trace.json.gz`),zlib.gzipSync(raw));
  const events=JSON.parse(raw).traceEvents;let summary={};for(const e of events){if(e.ph==='X'&&['Layout','Paint','UpdateLayoutTree','FunctionCall','RasterTask','EvaluateScript'].includes(e.name)){const v=summary[e.name]||{count:0,totalMs:0};v.count++;v.totalMs+=(e.dur||0)/1000;summary[e.name]=v;}}
  report.results[report.results.length-1].trace={artifact:path.join(traceDir,`${traceName}.trace.json.gz`),summary};
  fs.writeFileSync(path.join(out,`${phase}-baseline.json`),JSON.stringify(report,null,2));
 }
 report.implementationUnchanged=JSON.stringify(report.implementationHashes)===JSON.stringify(implementationHashes());
 fs.writeFileSync(path.join(out,`${phase}-baseline.json`),JSON.stringify(report,null,2));
 await browser.close();
 if(!report.implementationUnchanged || report.errors.length || report.results.length!==48) throw Error('BASELINE_SEAL_FAILED');
})().catch(e=>{console.error(e);process.exit(1)});
