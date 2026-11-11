// Actual production HTML, scene closures and Board; browser visual QA is separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {load} from './helpers/hyperbola-lesson-runtime.mjs';
const lab=await load(),video=lab.video;
const plain=v=>JSON.parse(JSON.stringify(v));
const lessons=id=>video.lessonList(lab.def.lessons[id]);
const firstSet=lesson=>lesson.chapters[0].cues[0].set;
const base=()=>({nums:{...lab.s},sets:{...lab.s},step:0,part:null});
// autoView resets the same identity canvas transform around its first measure.
// Those resets paint nothing; retain every visible draw and the world geometry.
const signature=f=>createHash('sha256').update(JSON.stringify({paths:f.paths,points:f.points,rights:f.rights,handles:f.handles.map(h=>({id:h.id,point:h.point})),plots:f.plots.map(p=>p.samples),canvas:f.canvas.filter(op=>op.name!=='setTransform')})).digest('hex');
function apply(compiled,t,initial,entry=false){
  const state=video.stateAt(compiled,t,initial);
  Object.assign(lab.s,state.nums,state.sets,{lessonOn:!entry,lessonEntry:entry,step:state.step,part:state.part});
  lab.tab='review';return lab.draw();
}
const select=(id,label)=>{lab.go(id);const lesson=lessons(id).find(x=>x.label===label);assert.ok(lesson);return {lesson,compiled:video.compileLesson(lesson),initial:base()};};

test('catalog and all actual first-source targets bind to valid lesson sets',t=>{
  const c={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),c);
  const catalog=c.window.APLab.catalog.labs.find(x=>x.id==='geom-hyperbola');
  const ids=Array.from(lab.list,x=>x.id);assert.equal(ids.length,catalog.sceneTotal);assert.equal(ids.length,15);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());
  assert.deepEqual(lab.missing,[]);
  for(const src of ['../kit/apl-player.js','../kit/apl-video-core.js','geom-hyperbola/lesson-core.js','geom-hyperbola/lesson-a.js','geom-hyperbola/lesson-b.js'])assert.ok(lab.loaded.includes(src),src);
  let count=0,concepts=0,originals=0;
  for(const id of ids){
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])),{errors:[],warnings:[]},id);
    assert.ok(lessons(id).some(x=>!firstSet(x).lhhConcept));
    for(const lesson of lessons(id)){
      count++;const init=firstSet(lesson),compiled=video.compileLesson(lesson);
      init.lhhConcept?concepts++:originals++;
      for(const key of ['lhhQuestion','lhhConcept','lhhExplore','lhhTarget','lhhShowAnswer','lhhKnownMath','lhhInitial','lens'])assert.ok(Object.hasOwn(init,key),`${id}/${lesson.label}: reset ${key}`);
      assert.equal(init.lhhShowAnswer,false);
      if(!init.lhhConcept)assert.equal(init.lhhQuestion,lab.api.question(id));
      assert.ok(compiled.length>=60&&compiled.length<=72);
      for(const key of Object.keys(compiled.tracks))assert.ok(Number.isFinite(compiled.start[key]),`${id}: numeric start ${key}`);
      for(const chapter of lesson.chapters)for(const cue of chapter.cues)for(const m of String(cue.say||'').matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
    }
  }
  assert.equal(count,32);assert.equal(concepts,11);assert.equal(originals,21);
  t.diagnostic(`${ids.length} scenes / ${count} lessons: ${concepts} concepts + ${originals} first-source goals; validator 0/0`);
});

test('all authored cue and movement boundaries draw finite native geometry',t=>{
  let frames=0;
  for(const sc of lab.list)for(const lesson of lessons(sc.id)){
    lab.go(sc.id);const initial=base(),compiled=video.compileLesson(lesson),packet=plain(lab.api.first(sc.id));
    const times=new Set([0,.9,compiled.length]);
    compiled.chapters.forEach((ch,i)=>lesson.chapters[i].cues.forEach(cue=>{
      times.add(ch.at+cue.at);if(cue.to){times.add(ch.at+cue.at+cue.dur/2);times.add(ch.at+cue.at+cue.dur);}
    }));
    let first,moving;
    for(const time of [...times].sort((a,b)=>a-b)){
      const frame=apply(compiled,time,initial);frames++;
      if(time===0)first=signature(frame);if(time===.9)moving=signature(frame);
      assert.ok(frame.paths.some(x=>x.points.length>30),`${sc.id}/${lesson.label}: original conic is drawn`);
      assert.ok(frame.canvas.some(x=>x.name==='lineTo'||x.name==='arc'));
      assert.deepEqual(plain(frame.value),{},'derived legacy result cards remain closed');
      if(time<compiled.chapters.at(-1).at)assert.equal(lab.s.lhhShowAnswer,false);
      if(time===compiled.length)assert.equal(lab.s.lhhShowAnswer,true);
      assert.deepEqual(plain(sc.vary.cur()),packet,'actual first source packet during playback');
    }
    assert.notEqual(first,moving,`${sc.id}/${lesson.label}: first-second movement`);
    assert.deepEqual(plain(lab.api.first(sc.id)),packet,'first packet remains immutable');
    assert.equal(signature(apply(compiled,compiled.length,initial,true)),first,`${sc.id}/${lesson.label}: entry restores initial picture`);
  }
  t.diagnostic(`${frames} production Board/canvas states; browser/mobile/independent visual review NOT_RUN`);
});

test('original new-problem handlers and selected viewport survive fixed-first playback',()=>{
  for(const sc of lab.list){
    lab.go(sc.id);lab.tab='problem';const first=plain(sc.vary.first());lab.newProblem();
    const picked=plain(sc.vary.cur());assert.notDeepEqual(picked,first,`${sc.id}: actual new-problem click`);
    lab.draw();const before={zoom:1.3,panX:11,panY:-7};Object.assign(lab.board,before);
    const question=sc.problem.text(lab.s,lab),lesson=lessons(sc.id).find(x=>!firstSet(x).lhhConcept),compiled=video.compileLesson(lesson),initial=base();
    const start=apply(compiled,0,initial);apply(compiled,compiled.length,initial);
    assert.equal(signature(apply(compiled,0,initial)),signature(start),`${sc.id}: replay has the same visible geometry`);
    lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
    assert.deepEqual(plain(sc.vary.cur()),picked,`${sc.id}: original selection preserved`);
    assert.equal(sc.problem.text(lab.s,lab),question);
    for(const key of Object.keys(before))assert.equal(lab.board[key],before[key],`${sc.id}: manual ${key} restored`);
  }
});

test('answer values and the perpendicular-asymptote mark follow their target cues',()=>{
  let {compiled,initial}=select('m1s1','가까운거리');
  assert.ok(!apply(compiled,36,initial).texts.some(x=>/^PF\s*=\s*5$/.test(x)));
  assert.ok(apply(compiled,60,initial).texts.some(x=>/^PF\s*=\s*5$/.test(x)));
  ({compiled,initial}=select('m2s2','점근선각'));
  assert.ok(!apply(compiled,36,initial).rights.some(x=>Math.hypot(x.corner.x,x.corner.y)<1e-9));
  assert.ok(apply(compiled,60,initial).rights.some(x=>Math.hypot(x.corner.x,x.corner.y)<1e-9));
  ({compiled,initial}=select('m2s2','이심률'));
  assert.ok(!apply(compiled,60,initial).rights.some(x=>Math.hypot(x.corner.x,x.corner.y)<1e-9),'eccentricity goal does not reveal its sibling angle');
  ({compiled,initial}=select('m2s2','수직조건'));
  assert.ok(!apply(compiled,42,initial).rights.some(x=>Math.hypot(x.corner.x,x.corner.y)<1e-9));
  assert.ok(apply(compiled,60,initial).rights.some(x=>Math.hypot(x.corner.x,x.corner.y)<1e-9));
  ({compiled,initial}=select('q7','합성곡선둘레'));
  assert.ok(!apply(compiled,36,initial).texts.some(x=>/^QA\s*=\s*4$/.test(x)));
  assert.ok(apply(compiled,48,initial).texts.some(x=>/^QA\s*=\s*4$/.test(x)));
  assert.equal(lab.s.lhhShowAnswer,false,'QA is an intermediate value; requested perimeter is still closed');
});

test('native intersection geometry and left-branch sibling resets are consistent',()=>{
  let {compiled,initial}=select('m2s3','삼각형넓이');const f=apply(compiled,30,initial);
  const named=name=>f.points.find(x=>x.options.label===name)?.point;
  const A=named('M₁'),B=named('M₂'),P=named('P');assert.ok(A&&B&&P);
  assert.ok(Math.abs((A.x+B.x)/2-P.x)<1e-9&&Math.abs((A.y+B.y)/2-P.y)<1e-9);
  ({compiled,initial}=select('m1s1','가지와부호'));const left=apply(compiled,60,initial);
  assert.equal(lab.s.branch,-1);assert.ok(left.handles.find(x=>x.id==='P').point.x<0);
  const sibling=lessons('m1s1').find(x=>x.label==='가까운거리');apply(video.compileLesson(sibling),0,base());
  assert.equal(lab.s.branch,1);assert.equal(lab.s.lhhExplore,false);assert.equal(lab.s.lhhShowAnswer,false);
});

test('manual dragging, external conic switching and source-only loading survive',async()=>{
  lab.go('m1s1');lab.tab='explore';let h=lab.draw().handles.find(x=>x.id==='P');assert.ok(h);h.options.drag({x:2,y:3.3});assert.equal(lab.s.py,3.3);
  lab.go('q5');lab.tab='explore';h=lab.draw().handles.find(x=>x.id==='P');assert.ok(h);h.options.drag({x:8,y:6});assert.equal(lab.s.q5y,6);
  lab.go('q6');lab.tab='explore';h=lab.draw().handles.find(x=>x.id==='P');assert.ok(h);h.options.drag({x:0,y:4.2});assert.equal(lab.s.q6y,4.2);
  lab.go('q7');lab.tab='explore';h=lab.draw().handles.find(x=>x.id==='P');assert.ok(h);h.options.drag({x:-1,y:-1.5});assert.equal(lab.s.q7sx,-1);assert.equal(lab.s.q7y,-1.5);
  lab.go('q7');lab.tab='review';const lesson=lessons('q7').find(x=>x.label==='부분별초점'),compiled=video.compileLesson(lesson),state=video.stateAt(compiled,30,base());
  const prior=lab.s.q7y,external={...lab.s,...state.nums,...state.sets,lessonOn:true,step:state.step};
  const found=[],handle=lab.board.handle;lab.board.handle=function(id,p,o){found.push(p);return handle.call(this,id,p,o);};
  try{lab.board.begin();lab.scene.draw(lab.board,external,{},lab);lab.board.end();}finally{lab.board.handle=handle;}
  const expected={x:Math.sqrt(5)/2*Math.sqrt(1.6**2-1),y:1.6};
  assert.ok(found.some(p=>Math.abs((p.x??p[0])-expected.x)<1e-9&&Math.abs((p.y??p[1])-expected.y)<1e-9),'external state moves from ellipse to upper hyperbola');
  assert.equal(lab.s.q7y,prior);
  const standalone=await load({sourceOnly:true});assert.deepEqual(plain(standalone.def.lessons),{});
  for(const sc of standalone.list){standalone.go(sc.id);standalone.draw();}
});
