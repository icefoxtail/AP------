// Minimal lesson safety checks using source geometry and real Board commands.
// No claim of full mobile/browser visual QA is made by these VM checks.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {load} from './helpers/area-lesson-runtime.mjs';
const require=createRequire(import.meta.url),core=require('../kit/apl-video-core.js');
const box={window:{}};vm.createContext(box);
vm.runInContext(fs.readFileSync(new URL('../labs/g7-area/lesson-b.js',import.meta.url),'utf8'),box);
const lessons=box.window.APL_LESSONS['g7-area'];
const list=Object.entries(lessons).flatMap(([id,value])=>core.lessonList(value).map(l=>[id,l]));
const lab=await load();
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} differs from ${b}`),norm=x=>String(x).replace(/\s+/g,'');
const area=V=>Math.abs(V.reduce((sum,p,i)=>{const q=V[(i+1)%V.length];return sum+p.x*q.y-q.x*p.y;},0))/2;
const distance=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y);
const altitude=(a,p,q)=>Math.abs((a.x-p.x)*(q.y-p.y)-(a.y-p.y)*(q.x-p.x))/distance(p,q);
const matches={'b1-rt':['h=2.4cm'],'b2-para':['넓이는같아요','h₂=8'],'b3-rail':['넓이는일정','둘레가달라질수있어요','△A′BC=20cm²'],'b4-wing':['S₁=S₂','10cm²'],'b5-ratio':['S₁:S₂=3:2','△ABD=12cm²','△ADC=8cm²']};
function init(id,l){lab.go(id);lab.tab='review';const cs=core.compileLesson(l);const s={...lab.s,...cs.start,...cs.cues[0].set};return {scene:lab.scene,cs,s};}
function at(cs,s,t){const q=core.stateAt(cs,t,{nums:s,sets:s,step:0,part:0});return {...s,...cs.start,...q.nums,...q.sets,step:q.step,part:q.part,lessonOn:true,lessonEntry:false};}
function draw(s,width=1000){Object.assign(lab.s,s);lab.setViewportWidth(width);lab.board.resize(width,width<500?440:650);return lab.draw();}
const signature=d=>JSON.stringify(d.paths.map(p=>({points:p.points,options:p.options})));
const hasGeometry=d=>d.paths.some(p=>p.points.some(q=>Math.hypot(q.x-p.points[0].x,q.y-p.points[0].y)>1e-5));
const question=(scene,s)=>typeof scene.question==='function'?scene.question(s):scene.question;

test('5 scenes register 11 lessons with valid independent questions and resets',()=>{
 assert.equal(Object.keys(lessons).length,5);assert.equal(list.length,11);
 for(const [id,value]of Object.entries(lessons)){
  const v=core.validateLessonSet(value);assert.deepEqual(v.errors,[],`${id}: ${v.errors.join('\n')}`);assert.deepEqual(v.warnings,[],`${id}: ${v.warnings.join('\n')}`);
  assert.equal(lab.list.filter(s=>s.id===id).length,1);assert.equal(core.lessonList(lab.def.lessons[id]).length,value.length);
 }
});
for(const [id,l]of list){
 const index=core.lessonList(lessons[id]).indexOf(l),name=`${id}:${l.label}`;
 test(`${name}: source question and independent geometry agree`,()=>{
  const {scene,cs,s}=init(id,l),end=at(cs,s,cs.length),M=scene.ar.model({...end}),g=scene.ar.geo(M);
  let numeric;
  if(id==='b1-rt'){
   const [B,C,A]=g.tri;near(distance(A,B),3);near(distance(A,C),4);near(distance(B,C),5);near((B.x-A.x)*(C.x-A.x)+(B.y-A.y)*(C.y-A.y),0);near(area(g.tri),6);near(altitude(A,B,C),2.4);near(M.h,2.4);near(end.b1T,0);numeric=2.4;
  }else if(id==='b2-para'){
   const [B,C,D,A]=g.pg;near(area(g.pg),40);near(distance(B,C),10);near(distance(C,D),5);near(altitude(A,B,C),4);near(altitude(A,C,D),8);near(M.h2,8);if(index===1)numeric=8;
  }else if(id==='b3-rail'){
   near(area(g.tri),20);near(area(g.tri2),20);near(altitude(g.tri[0],g.tri[1],g.tri[2]),5);near(distance(g.tri[1],g.tri[2]),8);near(M.A,20);
   if(index===1){const initial=scene.ar.model(s),before=scene.ar.geo(initial).tri;assert.ok(distance(g.tri[0],g.tri[1])>distance(before[0],before[1]));assert.ok(distance(g.tri[0],g.tri[2])>distance(before[0],before[2]));assert.ok(M.per>initial.per);near(M.per,8+13+Math.sqrt(41));}
   if(index===2){numeric=20;near(M.x,1.6);near(M.x2,8.8);}
  }else if(id==='b4-wing'){
   const {Av:A,Bv:B,Cv:C,Dv:D,O}=g;near(area([A,B,C]),30);near(area([D,B,C]),30);near(area([O,B,C]),20);near(area([A,B,O]),10);near(area([D,C,O]),10);near(altitude(O,A,C),0);near(altitude(O,B,D),0);near(M.X,30);near(M.Y,20);near(M.w,10);if(index===1)numeric=10;
  }else{
   near(area(g.left),12);near(area(g.right),8);near(area(g.left)/area(g.right),3/2);near(altitude(g.left[0],g.left[1],g.left[2]),altitude(g.right[0],g.right[1],g.right[2]));near(M.S,20);near(area(scene.ar.geo(M,1.6).right),8);if(index>0){assert.equal(M.q,index-1);numeric=index===1?12:8;}
  }
  if(numeric!==undefined){const Q=scene.ar.prob(M);near(Q.choices.find(c=>c.ok).v,numeric);assert.equal(question(scene,end),Q.stem,'numeric lesson shows the actual source question');}
  for(const [key,tracks]of Object.entries(cs.tracks)){assert.equal(typeof cs.start[key],'number',`${key} starts`);for(const q of tracks){assert.ok(Number.isFinite(q.to));if(lab.params[key])assert.ok(q.to>=lab.params[key].min&&q.to<=lab.params[key].max,`${key} range`);}}
  const stale=Object.fromEntries(cs.setKeys.map(k=>[k,'stale'])),rewind=core.stateAt(cs,0,{nums:s,sets:stale,step:99,part:99});for(const key of cs.setKeys)assert.deepEqual(rewind.sets[key],cs.cues[0].set[key]);assert.equal(rewind.sets.arShowAnswer,false);assert.equal(end.arShowAnswer,true);
 });
 test(`${name}: first-second movement, complete geometry and final-only answer`,()=>{
  const {cs,s}=init(id,l),first=at(cs,s,0),moving=at(cs,s,.99),lastStart=l.chapters.slice(0,-1).reduce((sum,c)=>sum+c.length,0),before=at(cs,s,lastStart-.01),end=at(cs,s,cs.length),needle=matches[id][index];
  for(const width of [390,1000]){
   const entry=draw({...first,step:0,lessonOn:false,lessonEntry:true},width),motion=draw(moving,width),pre=draw(before,width),last=draw(end,width);
   assert.ok(hasGeometry(entry));assert.ok(hasGeometry(last));assert.notEqual(signature(entry),signature(motion),'first second visibly changes geometry or a geometric highlight');
   assert.ok(!entry.value.formula&&!entry.value.card&&(!entry.value.readouts||entry.value.readouts.length===0));
   for(const frame of [entry,motion,pre])assert.ok(!frame.texts.some(t=>norm(t).includes(needle)),`${width}: no early target answer (${needle})`);
   assert.ok(last.texts.some(t=>norm(t).includes(needle)),`${width}: final answer appears (${needle})`);
   if(id==='b3-rail'&&index===2){assert.ok(entry.texts.some(t=>norm(t)==='△ABC=20cm²'));assert.ok(!entry.texts.some(t=>t.includes('높이 5')),'transfer question does not invent a given height');}
   if(id==='b5-ratio'&&index>0){assert.ok(entry.texts.includes('3k')&&entry.texts.includes('2k'));assert.ok(!entry.texts.some(t=>t.includes('h = 8')),'ratio problem keeps its unknown height symbolic');assert.ok(entry.texts.some(t=>norm(t)==='전체넓이=20cm²'));}
  }
 });
}

test('computed area and equal shares follow their calculation cues',()=>{
 let {cs,s}=init('b1-rt',lessons['b1-rt'][0]);assert.ok(!draw(at(cs,s,14.99)).texts.some(t=>norm(t).includes('=6cm²')));assert.ok(draw(at(cs,s,15)).texts.some(t=>norm(t).includes('=6cm²')));
 ({cs,s}=init('b2-para',lessons['b2-para'][1]));assert.ok(!draw(at(cs,s,14.99)).texts.some(t=>norm(t).includes('=40')));assert.ok(draw(at(cs,s,15)).texts.some(t=>norm(t).includes('=40')));
 ({cs,s}=init('b5-ratio',lessons['b5-ratio'][0]));assert.ok(!draw(at(cs,s,14.99)).texts.some(t=>norm(t).includes('S₁=3×8÷2=12')));assert.ok(draw(at(cs,s,15)).texts.some(t=>norm(t).includes('S₁=3×8÷2=12')));
 ({cs,s}=init('b5-ratio',lessons['b5-ratio'][1]));assert.ok(!draw(at(cs,s,24.99)).texts.some(t=>t.startsWith('한 몫')));assert.ok(draw(at(cs,s,25)).texts.some(t=>norm(t)==='한몫=20÷(3+2)=4'));
});

test('prior practice state cannot replace lesson figures or reset progress',()=>{
 const {scene,cs,s}=init('b5-ratio',lessons['b5-ratio'][2]),current=at(cs,s,.99),expected=draw(current);Object.assign(lab.s,current,{arReviewQuestion:true,arProblemStep:99,arProblemKey:'stale'});const actual=lab.draw();assert.equal(signature(actual),signature(expected));assert.deepEqual(actual.texts,expected.texts);assert.equal(lab.s.arReviewQuestion,true);assert.equal(lab.s.arProblemStep,99);assert.equal(lab.s.arProblemKey,'stale');assert.equal(lab.s.step,current.step);assert.deepEqual(Array.from(scene.steps(lab.s)),Array.from(scene.ar.steps(scene.ar.model(lab.s))));
 const rt=init('b1-rt',lessons['b1-rt'][0]),state=at(rt.cs,rt.s,.99);Object.assign(lab.s,state,{step:1});const t=lab.s.b1T;rt.scene.tick(lab.s,.5,lab);near(lab.s.b1T,t);Object.assign(lab.s,{lessonOn:false,lessonEntry:false,arReviewQuestion:false,b1T:0,step:1});rt.scene.tick(lab.s,.5,lab);assert.ok(lab.s.b1T>0,'manual review animation remains enabled');
});
