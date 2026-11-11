// Minimal implementation checks: data validator, source models, independent
// geometry/counts, and production Board draw states. Full mobile visual QA is separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {load} from './helpers/polyhedra-lesson-runtime.mjs';
const require=createRequire(import.meta.url),core=require('../kit/apl-video-core.js');
const box={window:{}};vm.createContext(box);
vm.runInContext(fs.readFileSync(new URL('../labs/g7-polyhedra/lesson-b.js',import.meta.url),'utf8'),box);
const lessons=box.window.APL_LESSONS['g7-polyhedra'];
const list=Object.entries(lessons).flatMap(([id,value])=>core.lessonList(value).map(l=>[id,l]));
const lab=await load(),G=lab.api;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} differs from ${b}`);
const norm=x=>String(x).replace(/\s+/g,'');
const matches={
 'p2-1':['정팔면체','입체가안돼요'], 'p2-2':['면의모양:정삼각형','모인면4개'],
 'p2-3':['정다면체가아니에요','=6개','꼭짓점3개'], 'p2-4':['=30개','=20개'],
 'p2-5':['정팔면체'],'p2-6':['5가지'],'p4-1':['정육각형'],
 'p4-2':['=32개','=60개','=90개'],'p4-3':['직사각형','정삼각형','정사각형'],
 'p4-4':['정팔면체','새면8개','새모서리12개']
};
function init(id,l){lab.go(id);lab.tab='review';const cs=core.compileLesson(l);const s={...lab.s,...cs.start,...cs.cues[0].set};return {scene:lab.scene,cs,s};}
function at(cs,s,t){const q=core.stateAt(cs,t,{nums:s,sets:s,step:0,part:0});return {...s,...cs.start,...q.nums,...q.sets,step:q.step,part:q.part,lessonOn:true,lessonEntry:false};}
function draw(s,width){Object.assign(lab.s,s);lab.setViewportWidth(width);lab.board.resize(width,width<500?440:650);const points=[],original=lab.board.point;lab.board.point=function(p,o){points.push({p:{...p},o:{...o}});return original.call(this,p,o);};try{return {...lab.draw(),points};}finally{lab.board.point=original;}}
function signature(d){return JSON.stringify({paths:d.paths.map(p=>({points:p.points,options:p.options})),points:d.points});}
test('10 scenes register 21 lessons with valid labels and reset contracts',()=>{
 assert.equal(Object.keys(lessons).length,10);assert.equal(list.length,21);
 for(const [id,value]of Object.entries(lessons)){
  const v=core.validateLessonSet(value);assert.deepEqual(v.errors,[],`${id}: ${v.errors.join('\n')}`);assert.deepEqual(v.warnings,[],`${id}: ${v.warnings.join('\n')}`);
  assert.equal(lab.list.filter(s=>s.id===id).length,1);assert.ok(lab.def.lessons[id]);
 }
});
for(const [id,l] of list){
 const index=core.lessonList(lessons[id]).indexOf(l),name=`${id}:${l.label||l.title}`;
 test(`${name}: model and independent mathematical result`,()=>{
  const {scene,cs,s}=init(id,l),end=at(cs,s,cs.length),M=scene.ph.model({...end});
  if(id==='p2-1'){
   const sum=(180-360/M.p)*M.q;near(M.sum,sum);assert.equal(M.kind,index===0?'ok':'flat');assert.equal(M.key,index===0?'octa':null);
  }else if(id==='p2-2'){
   const P=G.platS('octa');assert.equal(P.F.length,8);assert.ok(P.F.every(f=>f.i.length===3));assert.ok(P.vf.every(f=>f.length===4));assert.equal(M.I.q,4);assert.equal(M.I.p,3);
  }else if(id==='p2-3'){
   const points=[0,1,2].map(i=>G.v3(Math.cos(i*2*Math.PI/3),Math.sin(i*2*Math.PI/3),0));points.push(G.v3(0,0,Math.SQRT2),G.v3(0,0,-Math.SQRT2));const P=G.solidOf(points);
   assert.equal(P.F.length,6);assert.equal(P.E.length,9);assert.equal(P.V.length,5);assert.equal(P.vf.filter(v=>v.length===4).length,3);assert.equal(P.vf.filter(v=>v.length===3).length,2);
  }else if(id==='p2-4'){
   assert.equal(M.S.F.length,12);assert.ok(M.S.F.every(f=>f.i.length===5));assert.equal(M.S.E.length,30);assert.equal(M.S.V.length,20);assert.ok(M.S.vf.every(v=>v.length===3));assert.equal(5*12/2,30);assert.equal(5*12/3,20);
  }else if(id==='p2-5'||id==='p4-4'){
   const P=G.platS('cube'),T=G.solidOf(P.F.map(f=>G.faceMid(P.V,f)));assert.equal(T.V.length,6);assert.equal(T.E.length,12);assert.equal(T.F.length,8);assert.ok(T.F.every(f=>f.i.length===3));
  }else if(id==='p2-6'){
   const pairs=[];for(let p=3;p<=20;p++)for(let q=3;q<=20;q++)if(q*(180-360/p)<360-1e-9)pairs.push([p,q]);assert.deepEqual(pairs,[[3,3],[3,4],[3,5],[4,3],[5,3]]);
  }else if(id==='p4-1'){
   assert.equal(M.sec.count,6);assert.equal(M.sec.faces.length,6);assert.equal(M.sec.edgeCount,0);
   const p=M.sec.pts,lens=p.map((v,i)=>G.len3(G.sub3(v,p[(i+1)%p.length])));lens.forEach(n=>near(n,lens[0]));p.forEach((v,i)=>{const a=G.sub3(p[(i+5)%6],v),b=G.sub3(p[(i+1)%6],v);near(G.dot3(a,b)/(G.len3(a)*G.len3(b)),-.5);});assert.equal(M.name,'정육각형');
  }else if(id==='p4-2'){
   assert.equal(M.S.F.length,32);assert.equal(M.S.V.length,60);assert.equal(M.S.E.length,90);assert.equal(M.S.F.filter(f=>f.cut).length,12);assert.equal(M.S.V.length-M.S.E.length+M.S.F.length,2);
  }else if(id==='p4-3'){
   const sec=M.sec,coords=sec.poly.map(k=>G.v3(...G.cubeSec.POS[k]));assert.equal(sec.name,['직사각형','정삼각형','정사각형'][index]);assert.equal(coords.length,index===1?3:4);
   const lengths=coords.map((p,i)=>G.len3(G.sub3(p,coords[(i+1)%coords.length])));
   if(index===1||index===2)lengths.forEach(n=>near(n,lengths[0]));
   if(index!==1){coords.forEach((p,i)=>near(G.dot3(G.sub3(coords[(i+3)%4],p),G.sub3(coords[(i+1)%4],p)),0));if(index===0)assert.ok(Math.abs(lengths[0]-lengths[1])>.1);}
   const pos=G.cubeSec.POS,tri=end.phC3.map(k=>G.v3(...pos[k])),n=G.cross3(G.sub3(tri[1],tri[0]),G.sub3(tri[2],tri[0]));coords.forEach(p=>near(G.dot3(n,G.sub3(p,tri[0])),0));
  }
  for(const [key,tracks]of Object.entries(cs.tracks)){assert.equal(typeof cs.start[key],'number',`${key} starts`);for(const q of tracks){assert.ok(Number.isFinite(q.to));if(lab.params[key])assert.ok(q.to>=lab.params[key].min&&q.to<=lab.params[key].max,`${key} range`);}}
  const stale=Object.fromEntries(cs.setKeys.map(k=>[k,'stale'])),rewind=core.stateAt(cs,0,{nums:s,sets:stale,step:99,part:99});for(const key of cs.setKeys)assert.deepEqual(rewind.sets[key],cs.cues[0].set[key]);assert.equal(rewind.sets.phShowAnswer,false);assert.equal(end.phShowAnswer,true);
 });
 test(`${name}: geometry moves in the first second and final text is delayed`,()=>{
  const {cs,s}=init(id,l),first=at(cs,s,0),moving=at(cs,s,.99),end=at(cs,s,cs.length),needle=matches[id][index];
  for(const width of [390,1000]){
   const entry=draw({...first,step:0,lessonOn:false,lessonEntry:true},width),motion=draw(moving,width),last=draw(end,width);
   assert.ok(entry.paths.length+entry.points.length>0);assert.ok(last.paths.length+last.points.length>0);assert.notEqual(signature(entry),signature(motion),'first second has real geometry/highlight movement');
   assert.ok(!entry.value.formula&&!entry.value.card&&(!entry.value.readouts||entry.value.readouts.length===0));
   assert.ok(!entry.texts.some(t=>norm(t).includes(needle)),`${width}: no answer on entry (${needle})`);assert.ok(last.texts.some(t=>norm(t).includes(needle)),`${width}: final answer is drawn (${needle})`);
  }
 });
}
