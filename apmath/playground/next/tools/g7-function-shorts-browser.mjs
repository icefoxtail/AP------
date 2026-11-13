/** Grade 7 function shorts: production HTTP/Chromium, actual live timing,
 * native presets and user interactions. Mathematical independent checks live
 * in g7-short-*.test.mjs; a technical pass is not student comprehension proof. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const out=path.resolve(process.env.G7_EVIDENCE||'.tmp/g7-function-browser');fs.mkdirSync(out,{recursive:true});
const base=process.env.G7_BASE_URL||'http://127.0.0.1:8765/apmath/playground/next/labs/';
const report={kind:'G7_FUNCTION_SHORT_HTTP_CHROMIUM',commit:process.env.GITHUB_SHA||null,static:[],live:[],interactions:[],errors:[],pedagogicalApproval:'NOT_ASSIGNED',studentObservation:'NOT_RUN'};
const save=()=>fs.writeFileSync(path.join(out,'functions-report.json'),JSON.stringify(report,null,2)+'\n');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const targets=['g7-coordinate-graphs','g7-proportion'];
const desktopLive=new Set(['coordinate-area','water-vessels','journey-compare','inverse-area','remaining-work','bisect-rectangle']);
async function open(viewport,reducedMotion='reduce'){
 const context=await browser.newContext({viewport,reducedMotion});const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push({url:page.url(),message:e.message}));
 page.on('console',m=>{if(m.type()==='error')report.errors.push({url:page.url(),message:m.text()})});
 return{page,context};
}
async function load(page,id,hash='') {await page.goto(base+id+'.html'+hash);await page.waitForFunction(()=>window.lab?.learning);await page.evaluate(()=>document.fonts.ready);}
try{
 // Every screen, every native preset, all four requested viewport sizes.
 // Seeking is explicitly a static audit, never counted as normal playback.
 for(const viewport of [{width:1440,height:900},{width:820,height:1180},{width:1024,height:768},{width:390,height:844}]){
  const{page,context}=await open(viewport);
  for(const id of targets){
   await load(page,id);
   const entries=await page.evaluate(()=>lab.list.map((sc,i)=>({i,id:sc.id,presets:sc._mf.presets?.length||0})));
   for(const entry of entries){
    for(let preset=-1;preset<entry.presets;preset++){
     const checks=await page.evaluate(async({i,preset})=>{
      const M=window.APL_MF;lab.goScene(i);lab.learning.explore();
      const sc=lab.scene._mf,values=preset<0?M.defaults(sc):{...M.defaults(sc),...sc.presets[preset].values};
      Object.assign(lab.s,Object.fromEntries(Object.entries(values).map(([k,v])=>[M.prefix(sc,k),v])));
      const before=JSON.stringify(M.values(sc,lab.s));lab.learning.play();lab.learning.pause();
      const p=lab.learning.active,result=[];
      for(const t of [0,2.5,4.7,7.3,p.duration]){
       lab.learning.seek(t);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));lab.render();
       const c=lab.ui.canvas,d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let ink=0;for(let i=3;i<d.length;i+=4)if(d[i]>20)ink++;
       const caption=lab.learning.ui.caption.getBoundingClientRect(),formula=lab.learning.ui.formula.getBoundingClientRect(),canvas=c.getBoundingClientRect();
       result.push({t,ink,overflow:document.documentElement.scrollWidth>innerWidth+2,katexErrors:document.querySelectorAll('.katex-error').length,canvasVisible:canvas.top<innerHeight&&canvas.bottom>0,captionHeight:caption.height,formulaHeight:formula.height});
      }
      const exact=before===JSON.stringify(M.values(sc,lab.s));lab.learning.explore();
      return{result,exact,restored:before===JSON.stringify(M.values(sc,lab.s)),duration:p.duration,motion:p.motion};
     },{i:entry.i,preset});
     for(const c of checks.result){assert.ok(c.ink>200,`${id}/${entry.id}: no drawing`);assert.ok(!c.overflow,`${id}/${entry.id}: overflow`);assert.equal(c.katexErrors,0,`${id}/${entry.id}: formula render`);}
     assert.ok(checks.exact&&checks.restored,`${id}/${entry.id}: native condition changed`);
     report.static.push({viewport,id,scene:entry.id,preset,...checks});
    }
    await page.evaluate(i=>{lab.goScene(i);lab.learning.play();lab.learning.seek(lab.learning.active.duration)},entry.i);
    await page.screenshot({path:path.join(out,`${id}-${entry.id}-${viewport.width}-final.png`)});
   }
   save();
  }
  await context.close();
 }
 // All 36 on phone and six varied mathematical constructions on desktop.
 // No speed controls, artificial clock or seeks during these live runs.
 for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
  const{page,context}=await open(viewport,'no-preference');
  for(const id of targets){
   await load(page,id);
   const entries=await page.evaluate(()=>lab.list.map((sc,i)=>({i,id:sc.id})));
   for(const entry of entries){
    if(viewport.width>400&&!desktopLive.has(entry.id))continue;
    await page.evaluate(i=>{
     lab.goScene(i);lab.learning.explore();const sc=lab.scene._mf,M=window.APL_MF;
     Object.assign(lab.s,Object.fromEntries(Object.entries(M.defaults(sc)).map(([k,v])=>[M.prefix(sc,k),v])));
     lab.learning.play();window.shortStart=performance.now();window.shortEnd=null;
     const watch=()=>{if(lab.learning.mode==='ended')window.shortEnd=performance.now();else requestAnimationFrame(watch)};requestAnimationFrame(watch);
    },entry.i);
    const row={viewport,id,scene:entry.id,frames:[]};
    for(const t of [0,2.5,4.7,7.3]){
     await page.waitForFunction(t=>lab.learning.elapsed>=t,t,{timeout:12000});
     const name=`live-${id}-${entry.id}-${viewport.width}-${String(t).replace('.','_')}.png`;
     await page.screenshot({path:path.join(out,name)});row.frames.push(name);
    }
    await page.waitForFunction(()=>window.shortEnd!==null,null,{timeout:12000});
    const timing=await page.evaluate(()=>({seconds:(window.shortEnd-window.shortStart)/1000,duration:lab.learning.active.duration,mode:lab.learning.mode}));
    assert.ok(timing.seconds<=10&&timing.seconds>=timing.duration-.15,JSON.stringify({id,entry,...timing}));
    const final=`live-${id}-${entry.id}-${viewport.width}-final.png`;await page.screenshot({path:path.join(out,final)});row.frames.push(final);
    report.live.push({...row,...timing});save();
   }
  }
  await context.close();
 }
 // Real UI entry, reduced-motion keyboard controls, TOC mapping and preserved
 // state after theme/viewport changes; user action is distinct from autoplay.
 const{page,context}=await open({width:390,height:844});
 await load(page,'g7-proportion','#s=bisect-rectangle');
 assert.equal(await page.evaluate(()=>lab.learning.active),null);
 await page.getByRole('button',{name:'풀이 보기',exact:true}).click();
 assert.equal(await page.evaluate(()=>lab.learning.mode),'paused');
 await page.locator('body').click({position:{x:3,y:60}});
 await page.keyboard.press('ArrowRight');
 const first=await page.evaluate(()=>lab.learning.elapsed);assert.ok(first>0);
 await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>lab.learning.elapsed),0);
 await page.evaluate(()=>{lab.learning.seek(4.7);lab.ui.themeBtn.click()});
 await page.setViewportSize({width:820,height:1180});await page.waitForTimeout(100);
 assert.deepEqual(await page.evaluate(()=>({mode:lab.learning.mode,elapsed:lab.learning.elapsed})),{mode:'paused',elapsed:4.7});
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>lab.learning.mode),'explore');
 const toc=await page.evaluate(()=>{
  lab.toc.open();const times=[...lab.toc.ui.list.querySelectorAll('.sec')].map(e=>e.textContent);
  lab.toc.go(lab.list.findIndex(x=>x.id==='shared-point'),0);
  return{times,short:lab.learning.active?.id,mode:lab.learning.mode};
 });
 assert.ok(toc.times.every(s=>s==='9초'));assert.equal(toc.short,'proportion-shared-point');assert.equal(toc.mode,'paused');
 report.interactions.push({name:'reduced-motion-keyboard-theme-resize-toc',first,toc});
 await context.close();
 const auto=await open({width:390,height:844},'no-preference');
 await load(auto.page,'g7-coordinate-graphs','#s=coordinate-area');
 await auto.page.waitForTimeout(850);
 assert.equal(await auto.page.evaluate(()=>lab.learning.mode),'paused','a shared scene opens paused');
 await auto.page.locator('.g7-learning-controls .primary').click();
 await auto.page.waitForFunction(()=>lab.learning.mode==='playing',null,{timeout:5000});
 const autoProof=await auto.page.evaluate(()=>lab.learning.active.id);assert.equal(autoProof,'coordinate-coordinate-area');
 await auto.page.evaluate(()=>lab.learning.pause());
 const stopped=await auto.page.evaluate(()=>lab.learning.elapsed);await auto.page.waitForTimeout(500);
 assert.equal(await auto.page.evaluate(()=>lab.learning.elapsed),stopped);
 report.interactions.push({name:'paused-shared-entry-explicit-play-and-pause',short:autoProof});await auto.context.close();
 assert.equal(report.errors.length,0,JSON.stringify(report.errors));report.status='TECHNICAL_CHECKS_PASSED';
}catch(error){report.status='FAIL';report.failure=error.stack;process.exitCode=1;console.error(error);}
finally{save();await browser.close()}
console.log(JSON.stringify({status:report.status,static:report.static.length,live:report.live.length,errors:report.errors.length,out}));
