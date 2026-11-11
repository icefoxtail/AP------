// Implementation checks only: validator, independent geometry, actual module
// loading and Board commands. Full browser/mobile visual QA is a separate stage.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {load} from './helpers/polygons-lesson-runtime.mjs';
const require=createRequire(import.meta.url),core=require('../kit/apl-video-core.js');
const box={window:{}};vm.createContext(box);
vm.runInContext(fs.readFileSync(new URL('../labs/g7-polygons/lesson-b.js',import.meta.url),'utf8'),box);
const lessons=box.window.APL_LESSONS['g7-polygons'];
const list=Object.entries(lessons).flatMap(([id,value])=>core.lessonList(value).map(l=>[id,l]));
const lab=await load();
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} differs from ${b}`),norm=x=>String(x).replace(/\s+/g,'');
const signedArea=V=>V.reduce((sum,p,i)=>{const q=V[(i+1)%V.length];return sum+p.x*q.y-q.x*p.y;},0)/2;
function interior(V){const sign=Math.sign(signedArea(V));return V.map((p,i)=>{const a=V[(i+V.length-1)%V.length],b=V[(i+1)%V.length],u={x:p.x-a.x,y:p.y-a.y},v={x:b.x-p.x,y:b.y-p.y};return 180-sign*Math.atan2(u.x*v.y-u.y*v.x,u.x*v.x+u.y*v.y)*180/Math.PI;});}
const matches={'p3-inO':['삼각형7개','내각의합=900°'],'p3-concave':['내각의합은그대로','x=148°'],'p3-ext360':['360°'],'p3-given':['x=110°'],'p3-mixed':['x=110°']};
function init(id,l){lab.go(id);lab.tab='review';const cs=core.compileLesson(l);const s={...lab.s,...cs.start,...cs.cues[0].set};return {scene:lab.scene,cs,s};}
function at(cs,s,t){const q=core.stateAt(cs,t,{nums:s,sets:s,step:0,part:0});return {...s,...cs.start,...q.nums,...q.sets,step:q.step,part:q.part,lessonOn:true,lessonEntry:false};}
function draw(s,width=1000){Object.assign(lab.s,s);lab.setViewportWidth(width);lab.board.resize(width,width<500?440:650);const arcs=[],original=lab.board.arc;lab.board.arc=function(p,r,a0,a1,o){arcs.push({p:{...p},r,a0,a1,o:{...o}});return original.call(this,p,r,a0,a1,o);};try{return {...lab.draw(),arcs};}finally{lab.board.arc=original;}}
const signature=d=>JSON.stringify({paths:d.paths.map(p=>({points:p.points,options:p.options})),arcs:d.arcs});
const hasGeometry=d=>d.paths.some(p=>p.points.some(q=>Math.hypot(q.x-p.points[0].x,q.y-p.points[0].y)>1e-5))||d.arcs.some(a=>a.r>0&&Math.abs(a.a1-a.a0)>1e-5);

test('5 scenes register 7 valid lessons with independent button/reset contracts',()=>{
 assert.equal(Object.keys(lessons).length,5);assert.equal(list.length,7);
 for(const [id,value]of Object.entries(lessons)){
  const v=core.validateLessonSet(value);assert.deepEqual(v.errors,[],`${id}: ${v.errors.join('\n')}`);assert.deepEqual(v.warnings,[],`${id}: ${v.warnings.join('\n')}`);
  assert.equal(lab.list.filter(s=>s.id===id).length,1);assert.equal(core.lessonList(lab.def.lessons[id]).length,value.length);
 }
});
for(const [id,l]of list){
 const index=core.lessonList(lessons[id]).indexOf(l),name=`${id}:${l.label}`;
 test(`${name}: source conditions and independent mathematical answer`,()=>{
  const {scene,cs,s}=init(id,l),end=at(cs,s,cs.length),M=scene.pg.model({...end});
  if(id==='p3-inO'){
   assert.equal(M.n,7);const triangles=M.V.map((p,i)=>Math.abs(signedArea([M.O,p,M.V[(i+1)%M.n]])));assert.equal(triangles.length,7);assert.ok(triangles.every(a=>a>0));near(triangles.reduce((a,b)=>a+b,0),Math.abs(signedArea(M.V)));near(interior(M.V).reduce((a,b)=>a+b,0),900);near(M.S,900);near(M.tri,1260);near(end.pgOt,1);
   if(index===1)assert.equal(scene.pg.prob(M).choices.find(c=>c.ok).p,'900°');
  }else if(id==='p3-concave'){
   const angles=interior(M.g.V);assert.equal(M.n,4);assert.equal(M.g.concave,true);angles.forEach((v,i)=>near(v,[212,29,90,29][i]));near(angles.reduce((a,b)=>a+b,0),360);near(M.x,360-angles[0]);near(M.x,148);
   if(index===0){const initial=scene.pg.model(s);assert.equal(initial.g.concave,false);near(interior(initial.g.V).reduce((a,b)=>a+b,0),360);}
   else assert.equal(scene.pg.prob(M).choices.find(c=>c.ok).p,'148°');
  }else if(id==='p3-ext360'){
   assert.equal(M.n,6);const angles=interior(M.V);angles.forEach((v,i)=>{assert.ok(v>0&&v<180);near(180-v,M.eps[i]);});near(angles.reduce((a,b)=>a+(180-b),0),360);assert.ok(M.minL>.15);near(end.pgXt,1);assert.equal(scene.pg.prob(M).choices.find(c=>c.ok).p,'360°');
  }else{
   const mix=id==='p3-mixed',v=mix?[110,105,70,75]:[105,110,100,115],ex=v.map((n,i)=>mix&&i>=2?n:180-n);assert.deepEqual(Array.from(M.v),v);near(ex.reduce((a,b)=>a+b,0),290);near(M.ex,70);near(M.x,180-(360-290));near(M.x,110);const angles=interior(M.V);angles.forEach((n,i)=>near(n,M.ints[i]));near(angles.reduce((a,b)=>a+b,0),540);assert.ok(M.minL>.15);assert.equal(scene.pg.prob(M).choices.find(c=>c.ok).p,'110°');
  }
  for(const [key,tracks]of Object.entries(cs.tracks)){assert.equal(typeof cs.start[key],'number',`${key} starts`);for(const q of tracks){assert.ok(Number.isFinite(q.to));if(lab.params[key])assert.ok(q.to>=lab.params[key].min&&q.to<=lab.params[key].max,`${key} range`);}}
  const stale=Object.fromEntries(cs.setKeys.map(k=>[k,'stale'])),rewind=core.stateAt(cs,0,{nums:s,sets:stale,step:99,part:99});for(const key of cs.setKeys)assert.deepEqual(rewind.sets[key],cs.cues[0].set[key]);assert.equal(rewind.sets.pgShowAnswer,false);assert.equal(end.pgShowAnswer,true);
 });
 test(`${name}: first-second geometry and delayed final answer`,()=>{
  const {cs,s}=init(id,l),first=at(cs,s,0),moving=at(cs,s,.99),lastStart=l.chapters.slice(0,-1).reduce((sum,c)=>sum+c.length,0),before=at(cs,s,lastStart-.01),end=at(cs,s,cs.length),needle=matches[id][index];
  for(const width of [390,1000]){
   const entry=draw({...first,step:0,lessonOn:false,lessonEntry:true},width),motion=draw(moving,width),pre=draw(before,width),last=draw(end,width);
   assert.ok(hasGeometry(entry));assert.ok(hasGeometry(last));assert.notEqual(signature(entry),signature(motion),'first second changes geometry or draws an auxiliary line');
   assert.ok(!entry.value.formula&&!entry.value.card&&(!entry.value.readouts||entry.value.readouts.length===0));
   for(const frame of [entry,motion,pre])assert.ok(!frame.texts.some(t=>norm(t).includes(needle)),`${width}: no early target answer (${needle})`);
   assert.ok(last.texts.some(t=>norm(t).includes(needle)),`${width}: final answer appears (${needle})`);
   if(id==='p3-given'||id==='p3-mixed')assert.ok(entry.texts.includes('110°'),'original given 110° remains visible');
  }
 });
}

test('intermediate values wait for their calculation cues; original givens remain',()=>{
 let {cs,s}=init('p3-inO',lessons['p3-inO'][1]);
 assert.ok(!draw(at(cs,s,14.99)).texts.some(t=>t.includes('1260°')));assert.ok(draw(at(cs,s,15)).texts.some(t=>t.includes('1260°')));
 ({cs,s}=init('p3-concave',lessons['p3-concave'][1]));
 const entry=draw(at(cs,s,0));for(const t of ['A 29°','B 90°','C 29°'])assert.ok(entry.texts.includes(t));
 assert.ok(!draw(at(cs,s,14.99)).texts.some(t=>t.includes('212°')));assert.ok(draw(at(cs,s,15)).texts.some(t=>t.includes('212°')));
 ({cs,s}=init('p3-given',lessons['p3-given'][0]));
 const initial=draw(at(cs,s,0));for(const t of ['105°','110°','100°','115°'])assert.ok(initial.texts.includes(t));
 assert.ok(!draw(at(cs,s,15.99)).texts.includes('75°'));assert.ok(draw(at(cs,s,16)).texts.includes('75°'));assert.ok(!draw(at(cs,s,19.99)).texts.includes('80°'));assert.ok(draw(at(cs,s,20)).texts.includes('80°'));
 assert.ok(!draw(at(cs,s,28.99)).texts.some(t=>t.startsWith('E의 외각 e =')));assert.ok(draw(at(cs,s,29)).texts.some(t=>t==='E의 외각 e = 360° − 290° = 70°'));
 ({cs,s}=init('p3-mixed',lessons['p3-mixed'][0]));
 const mixed=draw(at(cs,s,0));for(const t of ['110°','105°','70°','75°'])assert.ok(mixed.texts.includes(t));assert.ok(!mixed.texts.includes('x=110°'));
});

test('lesson geometry survives stale question keys and review step interpolation',()=>{
 const {scene,cs,s}=init('p3-ext360',lessons['p3-ext360'][0]),state=at(cs,s,1);Object.assign(lab.s,state,{pgQuestionKey:'stale',step:2});const t=lab.s.pgXt;scene.tick(lab.s,.5,lab);near(lab.s.pgXt,t);lab.draw();near(lab.s.pgXt,t);assert.equal(lab.s.step,2);assert.equal(lab.s.pgQuestionKey,'stale');
 Object.assign(lab.s,{lessonOn:false,lessonEntry:false,pgXt:0,step:2});lab.s.pgQuestionKey=`${scene.id}|${scene.pg.prob(scene.pg.model(lab.s)).key}|${lab.s.pgSeed||0}`;lab.draw();near(lab.s.pgXt,1);
});
