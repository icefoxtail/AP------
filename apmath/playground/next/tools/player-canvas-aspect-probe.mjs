// Diagnostic only: observes native lifecycle and dimension events; no product source changes.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const req=createRequire(path.join(process.cwd(),'package.json'));
const {chromium}=req('playwright');
const args=process.argv.slice(2),arg=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
const out=arg('--out','canvas-aspect-probe'),base=arg('--base','http://127.0.0.1:8765/apmath/playground/next/labs/');
fs.mkdirSync(out,{recursive:true});
const cases=[{lab:'prob-counting',scene:'combo',k:0},{lab:'prob-counting',scene:'func',k:0},{lab:'geom-vector-figure',scene:'m4',k:4},{lab:'calc1-motion',scene:'origin',k:3}];
const browser=await chromium.launch(process.env.CHROME_PATH?{headless:true,executablePath:process.env.CHROME_PATH}:{headless:true});
const results=[];
try{for(const target of cases){
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 try{
  await page.goto(base+target.lab+'.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.lab?.video?.compiled&&lab.list?.length);
  await page.evaluate(async({scene})=>{await document.fonts.ready;const i=lab.list.findIndex(s=>s.id===scene);if(i<0)throw Error('missing scene');lab.video.close();lab.video._setExplored(false);lab.goScene(i);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},target);
  await page.evaluate(()=>{
   const events=[];let phase='initial';
   const dims=e=>{if(!e)return null;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {tag:e.tagName,cls:String(e.className),width:r.width,height:r.height,x:r.x,y:r.y,clientW:e.clientWidth,clientH:e.clientHeight,offsetW:e.offsetWidth,offsetH:e.offsetHeight,hidden:!!e.hidden,cssHeight:s.height,cssMinHeight:s.minHeight,display:s.display,flex:s.flex};};
   const snap=label=>({label,phase,at:performance.now(),player:lab.video.state,tab:lab.tab,bodyClass:document.body.className,board:{W:lab.board.W,H:lab.board.H,dpr:lab.board.dpr},bitmap:{width:lab.ui.canvas.width,height:lab.ui.canvas.height},canvas:dims(lab.ui.canvas),parent:dims(lab.ui.canvas.parentElement),canvasWrap:dims(lab.ui.canvasWrap),stage:dims(lab.ui.stage),top:dims(lab.ui.top),dock:dims(lab.ui.dock),tape:dims(lab.ui.tape),pending:{resizeRaf:lab.video._resizeRaf,labRaf:lab._raf}});
   const resize=lab.board.resize;lab.board.resize=function(...a){const before=snap('resize-before'),stack=new Error().stack,result=resize.apply(this,a);events.push({kind:'board.resize',args:a,result,stack,before,after:snap('resize-after')});return result;};
   const place=lab._placeControls;lab._placeControls=function(...a){const before=snap('place-before'),result=place.apply(this,a);events.push({kind:'placeControls',before,after:snap('place-after')});return result;};
   const observer=new ResizeObserver(es=>events.push({kind:'diagnostic-RO',phase,at:performance.now(),rects:es.map(e=>({width:e.contentRect.width,height:e.contentRect.height})),snapshot:snap('RO-delivered')}));observer.observe(lab.ui.canvasWrap);
   window.__aspectProbe={events,snap,setPhase:x=>phase=x,observer};
  });
  const trace=await page.evaluate(async({k})=>{
   const p=window.__aspectProbe,trace=[p.snap('initial')],raf=()=>new Promise(r=>requestAnimationFrame(r));
   p.setPhase('playing');lab.video.rate=0;lab.video.play(lab.index,k);lab.video.seek(lab.video.cs.length/2);await raf();await raf();trace.push(p.snap('playing-settled'));
   p.setPhase('finish');lab.video.finish();for(let n=1;n<=4;n++){await raf();trace.push(p.snap('finish-raf-'+n));}
   await Promise.all([...document.querySelectorAll('.apl-vend')].flatMap(e=>e.getAnimations({subtree:true})).filter(a=>Number.isFinite(a.effect?.getComputedTiming().endTime)).map(a=>a.finished.catch(()=>{})));await raf();await raf();trace.push(p.snap('finish-animations-settled'));
   p.setPhase('close');trace.push(p.snap('before-close'));lab.video.close();trace.push(p.snap('close-sync'));
   for(let n=1;n<=8;n++){await raf();trace.push(p.snap('close-raf-'+n));}
   await new Promise(r=>setTimeout(r,250));await raf();trace.push(p.snap('close-after-250ms'));
   return trace;
  },target);
  await page.screenshot({path:path.join(out,target.lab+'_'+target.scene+'--native-restored.png')});
  const repair=await page.evaluate(async()=>{const p=window.__aspectProbe;p.setPhase('explicit-resize-diagnostic');const before=p.snap('before-explicit-resize'),changed=lab.board.resize();lab.invalidate(true);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return {changed,before,after:p.snap('after-explicit-resize')};});
  await page.screenshot({path:path.join(out,target.lab+'_'+target.scene+'--after-explicit-resize.png')});
  const events=await page.evaluate(()=>window.__aspectProbe.events);
  const result={target,sourceSha:process.env.GITHUB_SHA||null,trace,events,repair,errors,status:'DIAGNOSTIC_ONLY_NO_PRODUCT_PASS'};
  fs.writeFileSync(path.join(out,target.lab+'_'+target.scene+'.json'),JSON.stringify(result,null,2)+'\n');results.push(result);
 }catch(e){const result={target,error:String(e),errors,status:'DIAGNOSTIC_FAILED'};results.push(result);fs.writeFileSync(path.join(out,target.lab+'_'+target.scene+'.json'),JSON.stringify(result,null,2)+'\n');}
 await context.close();
}}finally{await browser.close();}
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({sourceSha:process.env.GITHUB_SHA||null,mode:'READ_SOURCE_NATIVE_OBSERVATION_WITH_SEPARATELY_LABELED_EXPLICIT_RESIZE',results:results.map(r=>({target:r.target,status:r.status,error:r.error,initial:r.trace?.[0],restored:r.trace?.at(-1),repair:r.repair,events:r.events?.length,errors:r.errors}))},null,2)+'\n');
console.log(JSON.stringify(results.map(r=>({lab:r.target.lab,error:r.error,restored:r.trace?.at(-1)?.board,css:r.trace?.at(-1)?.canvas,explicitResizeChanged:r.repair?.changed})),null,2));
