/** Real HTTP/Chromium audit for the new G7 route. Reports technical coverage,
 * measured playback and screenshots separately from pedagogical approval.
 * Run from the repository root with a server on localhost:8765.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), { chromium } = require('playwright');
const out = path.resolve(process.env.G7_EVIDENCE || '.tmp/g7-learning-browser');
fs.mkdirSync(out, { recursive: true });
const source = fs.readFileSync('apmath/playground/next/kit/apl-catalog.js','utf8'), ctx={window:{}};
vm.runInNewContext(source,ctx);
const labs=ctx.window.APLab.catalog.labs.filter(l=>l.course==='g7');
const base=process.env.G7_BASE_URL || 'http://127.0.0.1:8765/apmath/playground/next/labs/';
const viewports=[{width:1440,height:900},{width:820,height:1180},{width:1024,height:768},{width:390,height:844}];
const report={kind:'G7_LEARNING_HTTP_CHROMIUM',commit:process.env.GITHUB_SHA || null,coverage:[],references:[],interactions:[],boundaries:[],errors:[],pedagogicalApproval:'NOT_ASSIGNED',studentObservation:'NOT_RUN'};
const reuseReferencePlayback=process.env.G7_REFERENCE_PLAYBACK==='reuse';
const referenceSceneFilter=new Set((process.env.G7_REFERENCE_SCENES||'').split(',').filter(Boolean));
if(reuseReferencePlayback||referenceSceneFilter.size){assert.ok(process.env.G7_REFERENCE_EVIDENCE,'Reused playback requires its exact evidence reference');report.reusedReferencePlayback=process.env.G7_REFERENCE_EVIDENCE;}
if(referenceSceneFilter.size)report.referenceReplayScenes=[...referenceSceneFilter];
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const save=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
async function pageFor(viewport,reducedMotion='reduce'){
 const context=await browser.newContext({viewport,reducedMotion});const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push({url:page.url(),error:e.message}));
 page.on('console',m=>{if(m.type()==='error')report.errors.push({url:page.url(),error:m.text()})});
 return {page,context};
}
async function load(page,id,hash='') {
 const url=base+id+'.html'+hash,scene=new URLSearchParams(hash.replace(/^#/,'')).get('s');
 // A same-document hash navigation can leave the previous scene active. Use
 // a fresh deep-link load and require the actual scene before measuring it.
 if(scene&&page.url().split('#')[0]===url.split('#')[0])await page.goto('about:blank');
 await page.goto(url);
 await page.waitForFunction(({id,scene})=>window.lab?.learning&&lab.id===id&&(!scene||lab.scene.id===scene),{id,scene});
 await page.evaluate(()=>document.fonts.ready);
}
try {
 for(const viewport of viewports){
  const {page,context}=await pageFor(viewport);
  for(const item of labs){
   await load(page,item.id);
   const inventory=await page.evaluate(()=>lab.list.map((s,i)=>({id:s.id,gi:s.gi,title:s.title,lessons:lab.video.lessonInfo(i).length})));
   const checks=[];
   for(let i=0;i<inventory.length;i++){
    const result=await page.evaluate(async i=>{
     lab.goScene(i);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));lab.render();
     const b=lab.board,c=lab.ui.canvas,rgba=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
     let ink=0;for(let j=3;j<rgba.length;j+=4)if(rgba[j]>20)ink++;
     const plans=lab.learning.plans(),bounds=lab.ui.canvasWrap.getBoundingClientRect();
     const available=plans.map(p=>p.legacyLabel||''),missing=[];
     const legacy=lab.video.lessonInfo(lab.index);
     for(const row of legacy){const label=row.label||'',at=available.indexOf(label);if(at<0)missing.push(label);else available.splice(at,1);}
     const fadedMath=[...lab.learning.ui.goal.querySelectorAll('.katex')].some(x=>parseFloat(getComputedStyle(x).opacity)<.99);
     // The native view wrapper changed after an actual question-key mutation.
     // Check its state boundary and initial/final drawing for every route while
     // reusing unchanged geometry's already measured normal-clock evidence.
     const state=()=>JSON.stringify(Object.fromEntries(Object.entries(lab.s).filter(([key])=>!['lessonOn','lessonEntry','playing'].includes(key))));
     const before=state(),proofInk=[];
     lab.learning.play();lab.learning.pause();
     for(const t of [0,lab.learning.active.duration]){
      lab.learning.seek(t);lab.render();const data=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
      let visible=0;for(let k=3;k<data.length;k+=4)if(data[k]>20)visible++;proofInk.push(visible);
     }
     const untouched=state()===before;lab.learning.explore();const restored=state()===before;
     return {scene:lab.scene.id,width:b.W,height:b.H,ink,controls:!lab.learning.ui.root.hidden,shorts:plans.length,legacy:legacy.length,missing,fadedMath,horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2,canvasVisible:bounds.top<innerHeight&&bounds.bottom>0,proofInk,untouched,restored};
    },i);
    checks.push(result);
    assert.ok(result.width>=150&&result.height>=150&&result.ink>200,`${item.id}/${result.scene}: initial drawing missing`);
    assert.ok(result.controls,`${item.id}/${result.scene}: learning controls missing`);
    assert.ok(result.shorts>0,`${item.id}/${result.scene}: individual visual proof missing`);
    assert.deepEqual(result.missing,[],`${item.id}/${result.scene}: legacy question has no visual proof`);
    assert.ok(!result.fadedMath,`${item.id}/${result.scene}: nested math opacity is compounded`);
    assert.ok(!result.horizontalOverflow,`${item.id}/${result.scene}: horizontal overflow`);
    assert.ok(result.proofInk.every(n=>n>200),`${item.id}/${result.scene}: active proof drawing missing`);
    assert.ok(result.untouched&&result.restored,`${item.id}/${result.scene}: proof view changed exploration state`);
   }
   report.coverage.push({viewport,id:item.id,inventory,checks});save();
  }
  await context.close();
 }
 const converted=report.coverage.filter(row=>row.viewport.width===390).flatMap(row=>row.checks);
 report.conversion={scenes:converted.length,legacy:converted.reduce((n,row)=>n+row.legacy,0),shorts:converted.reduce((n,row)=>n+row.shorts,0)};
 assert.deepEqual(report.conversion,{scenes:318,legacy:579,shorts:580});save();
 // Live, normal-speed proofs: capture actual animation frames, never report a
 // seek-only capture as measured playback. Representative PC and phone.
 const references=[['g7-circle-sector','f1-star',0,'star-area'],['g7-circle-sector','f1-star',1,'star-perimeter'],['g7-circle-sector','f3-leaf-area',0,'leaf-area'],['g7-surface-volume','sv2-4',0,'frustum-surface'],['g7-surface-volume','sv2-4',1,'frustum-volume'],['g7-surface-volume','sv3-4',0,'tank-remain'],['g7-surface-volume','sv3-4',1,'tank-over']];
 for(const viewport of reuseReferencePlayback?[]:[viewports[0],viewports[3]]){
  const {page,context}=await pageFor(viewport,'no-preference');
  for(const [id,scene,choice,expectedPlan] of references){
   if(referenceSceneFilter.size&&!referenceSceneFilter.has(scene))continue;
   await load(page,id,'#s='+scene);
   await page.evaluate(choice=>{lab.learning.explore();lab.learning.choice=choice;lab.learning.play();window.g7Start=performance.now();},choice);
   const plan=await page.evaluate(()=>({duration:lab.learning.active.duration,id:lab.learning.active.id,scene:lab.scene.id,lab:lab.id}));
   assert.equal(plan.scene,scene);assert.equal(plan.lab,id);assert.equal(plan.id,expectedPlan,`${id}/${scene}/${choice}: wrong active proof`);
   const row={viewport,id,scene,choice,plan,frames:[]};
   for(const t of [0,.9,2.1,3.4,5.5,7.5]){
    await page.waitForFunction(t=>lab.learning.elapsed>=t,t,{timeout:12000});
    const name=`${id}-${scene}-${choice}-${viewport.width}-${String(t).replace('.','_')}.png`;
    await page.screenshot({path:path.join(out,name)});row.frames.push(name);
   }
   await page.waitForFunction(()=>lab.learning.mode==='ended',null,{timeout:15000});
   row.actualSeconds=await page.evaluate(()=>(performance.now()-window.g7Start)/1000);
   row.elapsed=await page.evaluate(()=>lab.learning.elapsed);
   assert.ok(row.actualSeconds<=10,`Live proof exceeded ten seconds: ${row.actualSeconds}`);
   const final=`${id}-${scene}-${choice}-${viewport.width}-final.png`;
   await page.screenshot({path:path.join(out,final)});row.frames.push(final);
   await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>lab.learning.mode),'ended');
   report.references.push(row);save();
  }
  await context.close();
 }
 const {page,context}=await pageFor(viewports[3]);
 await load(page,'g7-circle-sector','#s=f1-star');
 const state=await page.evaluate(()=>{
  const l=lab.learning,star=lab.index,leaf=lab.list.findIndex(x=>x.id==='f3-leaf-area');
  lab.s.f1_star_a=12;lab.s.f1_star_seed=17;lab.s.f1_star_pick=3;lab.board.zoom=1.4;lab.board.panX=23;
  l.play();l.seek(4);l.explore();
  const restored={a:lab.s.f1_star_a,seed:lab.s.f1_star_seed,pick:lab.s.f1_star_pick,zoom:lab.board.zoom,panX:lab.board.panX};
  l.play();l.seek(3.3);lab.goScene(leaf);lab.s.f3a=8;l.play();l.seek(2);lab.goScene(star);
  const returned={a:lab.s.f1_star_a,elapsed:l.elapsed,mode:l.mode};
  l.explore();l.playLegacy(0);lab.video.close();
  const legacy={a:lab.s.f1_star_a,seed:lab.s.f1_star_seed,pick:lab.s.f1_star_pick};
  lab.goScene(star,{params:{f1_star_a:14,f1_star_seed:19}});
  const explicit={a:lab.s.f1_star_a,seed:lab.s.f1_star_seed};
  l.play();l.seek(3.3);l.store();return{restored,returned,legacy,explicit};
 });
 assert.deepEqual(state.restored,{a:12,seed:17,pick:3,zoom:1.4,panX:23});
 assert.deepEqual(state.returned,{a:12,elapsed:3.3,mode:'paused'});
 assert.deepEqual(state.legacy,{a:12,seed:17,pick:3});assert.deepEqual(state.explicit,{a:14,seed:19});
 report.interactions.push({name:'explore-navigation-legacy-explicit-instance',result:state});
 report.interactions.push({name:'before-reload-instance',result:await page.evaluate(()=>({hash:location.hash,record:lab.learning.records.get(lab.scene.id+'@'+lab.scene.gi)}))});save();
 await page.reload();await page.waitForFunction(()=>window.lab?.learning);
 const resumed=await page.evaluate(()=>({mode:lab.learning.mode,elapsed:lab.learning.elapsed,a:lab.s.f1_star_a}));
 report.interactions.push({name:'after-reload-instance',result:resumed});save();
 assert.equal(resumed.mode,'paused');assert.equal(resumed.elapsed,3.3);assert.equal(resumed.a,14);
 report.interactions.push({name:'session-reload',result:resumed});
 await page.evaluate(()=>{lab.learning.explore();lab.setTab('problem')});await page.waitForTimeout(900);
 assert.equal(await page.evaluate(()=>lab.learning.mode),'explore');
 assert.equal(await page.evaluate(()=>lab.learning.ui.root.hidden),true);
 report.boundaries.push({name:'problem-tab-no-autoplay',status:'PASS'});
 const explicitReview=await page.evaluate(()=>{lab.video.play(lab.index,0);return{tab:lab.tab,active:!!lab.learning.active}});
 assert.deepEqual(explicitReview,{tab:'review',active:true});
 const dirty=await page.evaluate(()=>{lab.learning.explore();lab.s.f1_star_a=16;lab.s.f1_star_seed=23;lab.learning.playLegacy(0);lab.video.close();return{a:lab.s.f1_star_a,seed:lab.s.f1_star_seed}});
 assert.deepEqual(dirty,{a:16,seed:23});
 report.interactions.push({name:'explicit-answer-and-unsaved-exploration',result:{explicitReview,dirty}});

 // A raw '<' in inline mathematics was consumed as an HTML tag. The corrected
 // text keeps the existing lattice animation and its measured timing intact.
 await load(page,'g7-proportion','#s=lattice-below');
 const strictBoundary=await page.evaluate(()=>{lab.learning.play();lab.learning.pause();lab.learning.seek(0);return{text:lab.learning.ui.formula.textContent,math:lab.learning.ui.formula.querySelectorAll('.katex').length,errors:lab.learning.ui.formula.querySelectorAll('.katex-error').length};});
 assert.ok(strictBoundary.math>0&&!strictBoundary.text.includes('$')&&strictBoundary.text.includes('x')&&strictBoundary.text.includes('k'),'strict inequality is rendered completely');
 assert.equal(strictBoundary.errors,0);report.interactions.push({name:'strict-lattice-inequality-rendering',result:strictBoundary});
 await page.screenshot({path:path.join(out,'lattice-below-strict-inequality-390.png')});

 // Three proof choices wrap onto two rows on a phone. The floating native
 // contents handle used to cover the elapsed time; header navigation remains.
 await load(page,'g7-surface-volume','#s=sv3-6');
 await page.evaluate(()=>{lab.learning.play();lab.learning.pause();lab.learning.seek(lab.learning.active.duration);});
 const contents=await page.evaluate(()=>({handleVisible:lab.toc.ui.handle.getClientRects().length>0,headerVisible:lab.toc.ui.topBtn.checkVisibility(),time:lab.learning.ui.time.textContent}));
 assert.equal(contents.handleVisible,false);assert.equal(contents.headerVisible,true);
 await page.screenshot({path:path.join(out,'three-choice-progress-and-header-390.png')});
 await page.locator('.apl-toc-btn').click();assert.equal(await page.evaluate(()=>lab.toc.isOpen),true);
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>lab.toc.isOpen),false);
 report.interactions.push({name:'wrapped-progress-with-header-contents-navigation',result:contents});
 await load(page,'g7-circle-sector','#s=petal15');
 await page.evaluate(()=>{lab.learning.play();lab.learning.pause();lab.learning.seek(4.1);});
 assert.equal(await page.evaluate(()=>lab.toc.ui.handle.getClientRects().length),0);
 await page.screenshot({path:path.join(out,'wrapped-petal-caption-and-header-390.png')});
 report.interactions.push({name:'wrapped-petal-caption-clear-of-floating-contents',scene:'petal15',elapsed:4.1});

 for(const query of ['?manual=1','?teach=1','?mode=assessment']){
  await page.goto(base+'g7-circle-sector.html'+query+'#s=f1-star');await page.waitForFunction(()=>window.lab?.video);await page.waitForTimeout(350);
  assert.equal(await page.evaluate(()=>!!lab.learning),false);report.boundaries.push({name:query,status:'PASS'});
 }
 await page.goto(base+'g8-linear-functions.html');await page.waitForFunction(()=>window.lab?.video);await page.waitForTimeout(350);
 assert.equal(await page.evaluate(()=>!!lab.learning),false);report.boundaries.push({name:'other-grade-unchanged',status:'PASS'});
 await context.close();
 assert.equal(report.errors.length,0,JSON.stringify(report.errors));report.status='TECHNICAL_CHECKS_PASSED';
} catch(error) {report.status='FAIL';report.failure=error.stack;process.exitCode=1;console.error(error);}
finally {save();await browser.close();}
console.log(JSON.stringify({status:report.status,coverage:report.coverage.length,references:report.references.length,errors:report.errors.length,out}));
