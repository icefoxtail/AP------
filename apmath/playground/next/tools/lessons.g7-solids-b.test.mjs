// Minimal implementation checks: real models, independent mathematics, lesson
// validator and production Board commands. These do not replace full visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {load} from './helpers/solids-lesson-runtime.mjs';
const require=createRequire(import.meta.url),core=require('../kit/apl-video-core.js');
const box={window:{}};vm.createContext(box);
vm.runInContext(fs.readFileSync(new URL('../labs/g7-solids/lesson-b.js',import.meta.url),'utf8'),box);
const lessons=box.window.APL_LESSONS['g7-solids'];
const list=Object.entries(lessons).flatMap(([id,value])=>core.lessonList(value).map(l=>[id,l]));
const lab=await load();
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} differs from ${b}`);
const norm=x=>String(x).replace(/\s+/g,'');
const matches={
 's2-1':['단면은원','꼭짓점쪽으로작아져요','반지름r=2cm'],
 's2-2':['단면의모양:이등변삼각형','모양과크기가같아요'],
 's2-3':['단면의넓이=36cm²','단면의넓이=18cm²','단면의넓이=30cm²'],
 's2-4':['완성한회전체:원뿔대'],'s2-5':['선대칭도형'],
 's2-6':['남은입체:원뿔대','높이=8−2=6cm']
};
function init(id,l){lab.go(id);lab.tab='review';const cs=core.compileLesson(l);const s={...lab.s,...cs.start,...cs.cues[0].set};return {scene:lab.scene,cs,s};}
function at(cs,s,t){const q=core.stateAt(cs,t,{nums:s,sets:s,step:0,part:0});return {...s,...cs.start,...q.nums,...q.sets,step:q.step,part:q.part,lessonOn:true,lessonEntry:false};}
function draw(s,width=1000){Object.assign(lab.s,s);lab.setViewportWidth(width);lab.board.resize(width,width<500?440:650);return lab.draw();}
const signature=d=>JSON.stringify(d.paths.map(p=>({points:p.points,options:p.options})));
const area=poly=>Math.abs(poly.reduce((sum,p,i)=>{const q=poly[(i+1)%poly.length];return sum+p[0]*q[1]-q[0]*p[1];},0))/2;
const axial=sol=>sol.poly.concat(sol.poly.slice().reverse().map(([r,y])=>[-r,y]));

test('6 section scenes register 12 lessons with valid labels and reset contracts',()=>{
 assert.equal(Object.keys(lessons).length,6);assert.equal(list.length,12);
 for(const [id,value]of Object.entries(lessons)){
  const v=core.validateLessonSet(value);assert.deepEqual(v.errors,[],`${id}: ${v.errors.join('\n')}`);assert.deepEqual(v.warnings,[],`${id}: ${v.warnings.join('\n')}`);
  assert.equal(lab.list.filter(s=>s.id===id).length,1);assert.equal(core.lessonList(lab.def.lessons[id]).length,value.length);
 }
});
for(const [id,l]of list){
 const index=core.lessonList(lessons[id]).indexOf(l),name=`${id}:${l.label}`;
 test(`${name}: original model agrees with independent mathematics`,()=>{
  const {scene,cs,s}=init(id,l),end=at(cs,s,cs.length),M=scene.so.model({...end});
  if(id==='s2-1'){
   assert.ok(M.u>M.sol.ymin&&M.u<M.sol.ymax,'cuts stay strictly inside solid ends');
   if(index===0){assert.equal(M.kind,'cyl');near(M.ru,M.d.R);assert.equal(M.sol.hole,0);}
   else{
    assert.equal(M.kind,'cone');near(M.ru,M.d.R*(M.d.h1-M.u)/M.d.h1);
    if(index===1){const initial=scene.so.model(s);near(initial.ru,3);near(M.ru,1);assert.ok(M.u>initial.u&&M.ru<initial.ru);}
    else{near(M.u,3);near(M.d.h1,6);near(M.d.R,4);near(M.ru,2);const Q=scene.so.prob({...M,kindP:2,pr:4,ph:6});assert.equal(Q.choices.find(c=>c.ok).p,'2 cm');}
   }
  }else if(id==='s2-2'){
   assert.equal(M.kind,'cone');const R=M.d.R,H=M.d.h1;
   near(Math.hypot(-R,H),Math.hypot(R,H));assert.equal(axial(M.sol).filter(p=>p[0]!==0).length,2);
   if(index===1){near(M.psi,Math.PI/3);const p=[[-R,0],[R,0],[0,H]],project=a=>p.map(([r,y])=>[r*Math.cos(a),y,r*Math.sin(a)]),a=project(0),b=project(M.psi);for(let i=0;i<3;i++)for(let j=0;j<3;j++)near(a[i].reduce((sum,n,k)=>sum+(n-a[j][k])**2,0),b[i].reduce((sum,n,k)=>sum+(n-b[j][k])**2,0));}
  }else if(id==='s2-3'){
   assert.equal(M.kind,['cyl','cone','frus'][index]);near(area(axial(M.sol)),[36,18,30][index]);near(M.area,area(axial(M.sol)));assert.equal(end.soBStage,1);
  }else if(id==='s2-4'){
   assert.equal(M.kind,'frus');near(M.sol.poly[1][0],3);near(M.sol.poly[2][0],2);near(M.sol.poly[2][1],6);assert.ok(M.d.R>M.d.r&&M.d.r>0);near(end.soT,1);
  }else if(id==='s2-5'){
   near(end.soFold,1);M.sol.poly.forEach(([r])=>near(-r*Math.cos(Math.PI*end.soFold),r));assert.ok(M.sol.poly.some(([r])=>r>0));
  }else if(id==='s2-6'){
   near(M.R,4);near(M.H,8);near(M.c,1/4);near(M.hs,2);near(M.rs,1);near(M.hf,6);near(M.rs/M.R,M.hs/M.H);assert.ok(M.hs>0&&M.hs<M.H&&M.rs<M.R);
   if(index===1){const Q=scene.so.prob({...M,pH:8,ph:2,pc:1});assert.equal(Q.choices.find(c=>c.ok).p,'6 cm');}
  }
  for(const [key,tracks]of Object.entries(cs.tracks)){assert.equal(typeof cs.start[key],'number',`${key} starts`);for(const q of tracks){assert.ok(Number.isFinite(q.to));if(lab.params[key])assert.ok(q.to>=lab.params[key].min&&q.to<=lab.params[key].max,`${key} range`);}}
  const stale=Object.fromEntries(cs.setKeys.map(k=>[k,'stale'])),rewind=core.stateAt(cs,0,{nums:s,sets:stale,step:99,part:99});for(const key of cs.setKeys)assert.deepEqual(rewind.sets[key],cs.cues[0].set[key]);assert.equal(rewind.sets.soShowAnswer,false);assert.equal(end.soShowAnswer,true);
 });
 test(`${name}: real drawing moves and answer waits until final chapter`,()=>{
  const {cs,s}=init(id,l),first=at(cs,s,0),moving=at(cs,s,.99),lastStart=l.chapters.slice(0,-1).reduce((sum,c)=>sum+c.length,0),before=at(cs,s,lastStart-.01),end=at(cs,s,cs.length),needle=matches[id][index];
  for(const width of [390,1000]){
   const entry=draw({...first,step:0,lessonOn:false,lessonEntry:true},width),motion=draw(moving,width),pre=draw(before,width),last=draw(end,width);
   assert.ok(entry.paths.length>0);assert.ok(last.paths.length>0);assert.notEqual(signature(entry),signature(motion),'first second changes actual geometry');
   assert.ok(!entry.value.formula&&!entry.value.card&&(!entry.value.readouts||entry.value.readouts.length===0));
   for(const frame of [entry,motion,pre])assert.ok(!frame.texts.some(t=>norm(t).includes(needle)),`${width}: no early answer (${needle})`);
   assert.ok(last.texts.some(t=>norm(t).includes(needle)),`${width}: final answer appears (${needle})`);
   if(id==='s2-1')assert.ok(!motion.texts.some(t=>/반지름 r.*\d/.test(t)),'moving radius is hidden');
   if(id==='s2-3')assert.ok(!entry.texts.some(t=>/2[rR] =/.test(t)),'computed diameters wait for diameter explanation');
  }
 });
}

test('problem-tab history and review tick cannot replace fixed lesson geometry',()=>{
 const {scene,cs,s}=init('s2-1',lessons['s2-1'][2]),current=at(cs,s,.99);
 const expected=draw(current),dirty={...current,soReviewQuestion:true,soP1:2,soPR:12,soPH:20,soPK:'frus',soProblemStep:99,soProblemKey:'stale'};
 Object.assign(lab.s,dirty);const step=lab.s.step,key=lab.s.soProblemKey,soE=lab.s.soE;scene.tick(lab.s,.5,lab);near(lab.s.soE,soE);
 const actual=lab.draw();assert.equal(signature(actual),signature(expected));assert.deepEqual(actual.texts,expected.texts);assert.equal(lab.s.step,step);assert.equal(lab.s.soProblemKey,key);assert.equal(lab.s.soReviewQuestion,true);assert.equal(scene.question(lab.s),scene.so.question);
 Object.assign(lab.s,current,{lessonOn:false,lessonEntry:false,soReviewQuestion:false,step:1,soE:0});scene.tick(lab.s,.5,lab);assert.ok(lab.s.soE>0,'manual review step animation remains available');
});
