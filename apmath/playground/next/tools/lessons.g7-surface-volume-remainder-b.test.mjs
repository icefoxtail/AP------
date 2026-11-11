// Minimal release checks: real scene models, lesson validator, reversible state,
// and production Board draw commands. This is not a browser visual QA result.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url), core=require('../kit/apl-video-core.js');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'labs/g7-surface-volume');
const read=f=>fs.readFileSync(path.join(dir,f),'utf8');
const ids=['sv3-3','sv3-5','sv3-6','sv3-7','sv5-2','sv5-4','sv5-5','sv5-6','sv6-1'];
const noop=()=>{};
const numeric={moveTo:[0,1],lineTo:[0,1],rect:[0,1,2,3],arc:[0,1,2,3,4],ellipse:[0,1,2,3,4,5,6],fillText:[1,2],strokeText:[1,2]};
function canvas(){
 const ctx=new Proxy({measureText:t=>({width:String(t).length*8}),createRadialGradient:()=>({addColorStop:noop})},{get(o,k){if(k in o)return o[k];return (...a)=>{for(const i of numeric[k]||[])assert.ok(Number.isFinite(a[i]),`${String(k)} coordinate ${i}: ${a[i]}`);};},set(o,k,v){o[k]=v;return true;}});
 return {width:390,height:440,getContext:()=>ctx};
}
const element=tag=>tag==='canvas'?canvas():{style:{setProperty:noop},dataset:{},classList:{add:noop,remove:noop,toggle:noop},setAttribute:noop,addEventListener:noop,querySelector:()=>null,querySelectorAll:()=>[],append:noop};
const sandbox={console,Math,innerWidth:390,devicePixelRatio:1,performance,setTimeout,clearTimeout,requestAnimationFrame:()=>0,cancelAnimationFrame:noop,URLSearchParams,
 document:{getElementById:()=>null,querySelector:()=>null,createElement:element,createTextNode:t=>({textContent:t}),addEventListener:noop,documentElement:element('html'),body:element('body'),head:element('head')},
 location:{hash:'',search:'',pathname:'/labs/g7-surface-volume.html'},history:{replaceState:noop},localStorage:{getItem:()=>null,setItem:noop},getComputedStyle:()=>({getPropertyValue:k=>k==='--font-ui'?'sans-serif':k==='--m-glow'?'0':'#fff'}),matchMedia:()=>({matches:false}),addEventListener:noop};
sandbox.window=sandbox;const context=vm.createContext(sandbox);
for(const file of ['apl-core.js','apl-board.js'])vm.runInContext(fs.readFileSync(path.join(root,'kit',file),'utf8'),context,{filename:file});
for(const file of ['core.js','solid3d.js','dims.js','net.js','t3.js','t5.js','t6.js','t7.js','lesson.js','lesson-more.js','lesson-remainder-b.js'])vm.runInContext(read(file),context,{filename:file});
const G=context.APL_SV,groups=context.APL_SV_GROUPS,scenes=groups.flatMap(g=>g.scenes),params=Object.assign({},...groups.map(g=>g.params));
const registered=context.APL_LESSONS['g7-surface-volume'];
const added=ids.flatMap(id=>core.lessonList(registered[id]).filter(l=>id!=='sv5-6'||l.label==='부피').map(l=>[id,l]));
const expect={
 'sv3-5':{'사분의 일':32*Math.PI,'팔분의 일':20*Math.PI},
 'sv3-6':{'겉넓이':16*Math.PI,'부피':32*Math.PI/3,'역으로':16*Math.PI},
 'sv3-7':{'겉넓이':36*Math.PI,'부피':27*Math.PI},
 'sv5-2':{'막힌 원':192+12*Math.PI,'관통 사각':224,'막힌 사각':216},
 'sv5-4':{'모서리중간':224,'끝까지':208,'가운데홈':232},
 'sv5-5':{'겉넓이':102*Math.PI,'부피':84*Math.PI},
 'sv5-6':{'부피':256+27*Math.PI},
 'sv6-1':{'겉넓이':57*Math.PI,'부피':63*Math.PI}
};
function initial(id,l){const scene=scenes.find(x=>x.id===id);assert.ok(scene,id);const s=Object.fromEntries(Object.entries(params).map(([k,p])=>[k,p.value]));scene.sv.init(s);const cs=core.compileLesson(l);Object.assign(s,cs.start,cs.cues[0].set);return {scene,s,cs};}
function at(cs,s,t){const st=core.stateAt(cs,t,{nums:{...s},sets:{...s},step:0,part:0});return {...s,...cs.start,...st.nums,...st.sets,step:st.step,part:st.part,lessonOn:true,lessonEntry:false};}
function render(scene,s,width=390){
 context.innerWidth=width;const board=new context.APLab.Board(canvas(),{kind:'figure',interactive:false});board.resize(width,width<500?440:650);board.setFocus({x:[-10,10],y:[-10,10]},true);
 const lab={tab:'review',s,board,scene,params,refs:{},invalidate:noop,_buildProblem:noop,_buildReview:noop};const texts=[],original=board._text;let paths=0;const origPath=board.path;
 board._text=function(x,y,t,...args){if(t!=null)texts.push(String(t));return original.call(this,x,y,t,...args);};
 board.path=function(...args){paths++;return origPath.apply(this,args);};
 const step=s.step;const view=scene.view(s,lab);s.step=step;
 board.begin();scene.draw(board,s,view,lab);board.end();return {texts,paths,view};
}
test('remainder B registers 8 new scenes and adds 19 distinct lessons',()=>{
 assert.equal(added.length,19);assert.equal(ids.filter(id=>id!=='sv5-6').length,8);
 for(const id of ids){assert.equal(scenes.filter(x=>x.id===id).length,1);const v=core.validateLessonSet(registered[id]);assert.deepEqual(v.errors,[],`${id}: ${v.errors.join('\n')}`);assert.deepEqual(v.warnings,[],`${id}: ${v.warnings.join('\n')}`);}
 assert.equal(core.lessonList(registered['sv5-6']).length,2);
});
for(const [id,l] of added){
 const name=`${id}:${l.label||l.title}`;
 test(`${name}: original model, independent calculation and state replay`,()=>{
  const {scene,s,cs}=initial(id,l),last=at(cs,s,cs.length),M=scene.sv.model({...last});
  if(id==='sv3-3'){
   assert.equal(s.s8R,3);assert.equal(s.s8K,0);
   for(const [body,n] of [['cone',18],['sph',36],['cyl',54]])assert.ok(Math.abs(G.vnum(M.vols[body])-n*Math.PI)<1e-8);
   assert.equal(l.answer,'$1:2:3$');
  }else{
   const expected=expect[id][l.label];assert.ok(Number.isFinite(expected));assert.ok(Math.abs(G.vnum(M.ans||M.tot)-expected)<1e-8,`${name}: model answer`);
   const chk=scene.sv.check({...last});assert.ok(Math.abs(chk.ans-expected)<1e-4*Math.max(1,expected),`${name}: independent geometric check`);
  }
  for(const [key,segs] of Object.entries(cs.tracks)){
   assert.equal(typeof cs.start[key],'number',`${key}: first start`);assert.ok(Number.isFinite(core.trackValue(segs,cs.start[key],cs.length)));
   if(params[key])for(const seg of segs)assert.ok(seg.to>=params[key].min&&seg.to<=params[key].max,`${key} out of range`);
  }
  const contaminated=Object.fromEntries(cs.setKeys.map(k=>[k,'stale']));const rewind=core.stateAt(cs,0,{nums:s,sets:contaminated,step:99,part:99});
  for(const key of cs.setKeys)assert.equal(rewind.sets[key],cs.cues[0].set[key],`${key}: reset`);
  assert.equal(rewind.sets.svShowV,false);assert.equal(last.svShowV,true);
  assert.ok(l.chapters.at(-1).cues.some(c=>c.set?.svShowV===true));
 });
 test(`${name}: production draw starts with geometry and gates the answer`,()=>{
  const {scene,s,cs}=initial(id,l),first=at(cs,s,0),end=at(cs,s,cs.length);
  for(const width of [390,1000]){
   const entry=render(scene,{...first,lessonOn:false,lessonEntry:true},width);
   const start=render(scene,{...first},width),done=render(scene,{...end},width);
   assert.ok(entry.paths>0&&start.paths>0&&done.paths>0,`${width}: essential geometry draws`);
   assert.ok(!entry.view.card&&!entry.view.formula&&(!entry.view.readouts||entry.view.readouts.length===0),'entry hides computed results');
   if(id!=='sv3-3'){
    const M=scene.sv.model({...end}),answer=G.plainVal(M.ans||M.tot);const has=t=>t.texts.some(v=>v.replace(/\s+/g,'').includes(answer.replace(/\s+/g,'')));
    assert.equal(has(entry),false,`${width}: no final value on entry`);assert.equal(has(start),false,`${width}: no final value at start`);assert.equal(has(done),true,`${width}: final answer rendered`);
   }else{
    assert.ok(!start.texts.some(v=>/1\s*:\s*2\s*:\s*3/.test(v)));assert.ok(done.texts.some(v=>/1\s*:\s*2\s*:\s*3/.test(v)));
   }
  }
 });
}
