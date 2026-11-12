// Actual production HTML, scene closures and Board; browser visual QA is separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {load} from './helpers/parabola-lesson-runtime.mjs';
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
  const catalog=c.window.APLab.catalog.labs.find(x=>x.id==='geom-parabola');
  const ids=Array.from(lab.list,x=>x.id);assert.equal(ids.length,catalog.sceneTotal);assert.equal(ids.length,14);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());
  assert.deepEqual(lab.missing,[]);
  for(const src of ['../kit/apl-player.js','../kit/apl-video-core.js','geom-parabola/lesson-core.js','geom-parabola/lesson-a.js','geom-parabola/lesson-b.js'])assert.ok(lab.loaded.includes(src),src);
  let count=0,concepts=0,originals=0;
  for(const id of ids){
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])),{errors:[],warnings:[]},id);
    assert.ok(lessons(id).some(x=>!firstSet(x).lgpConcept));
    for(const lesson of lessons(id)){
      count++;const init=firstSet(lesson),compiled=video.compileLesson(lesson);
      init.lgpConcept?concepts++:originals++;
      for(const key of ['lgpQuestion','lgpConcept','lgpExplore','lgpTarget','lgpShowAnswer','lgpKnownMath','lgpInitial','lens'])assert.ok(Object.hasOwn(init,key),`${id}/${lesson.label}: reset ${key}`);
      assert.equal(init.lgpShowAnswer,false);
      if(!init.lgpConcept)assert.equal(init.lgpQuestion,lab.api.question(id));
      assert.ok(compiled.length>=60&&compiled.length<=72);
      for(const key of Object.keys(compiled.tracks))assert.ok(Number.isFinite(compiled.start[key]),`${id}: numeric start ${key}`);
      for(const chapter of lesson.chapters)for(const cue of chapter.cues)for(const m of String(cue.say||'').matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
    }
  }
  assert.equal(count,38);assert.equal(concepts,12);assert.equal(originals,26);
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
      if(time<compiled.chapters.at(-1).at)assert.equal(lab.s.lgpShowAnswer,false);
      if(time===compiled.length)assert.equal(lab.s.lgpShowAnswer,true);
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
    const question=sc.problem.text(lab.s,lab),lesson=lessons(sc.id).find(x=>!firstSet(x).lgpConcept),compiled=video.compileLesson(lesson),initial=base();
    const start=apply(compiled,0,initial);apply(compiled,compiled.length,initial);
    assert.equal(signature(apply(compiled,0,initial)),signature(start),`${sc.id}: replay has the same visible geometry`);
    lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
    assert.deepEqual(plain(sc.vary.cur()),picked,`${sc.id}: original selection preserved`);
    assert.equal(sc.problem.text(lab.s,lab),question);
    for(const key of Object.keys(before))assert.equal(lab.board[key],before[key],`${sc.id}: manual ${key} restored`);
  }
});

test('targeted answers, right-angle diagrams and sibling state follow the captions',()=>{
  let {compiled,initial}=select('m2s1','다른현부분');
  assert.ok(!apply(compiled,36,initial).texts.some(x=>/^b\s*=\s*8\/3$/.test(x)));
  assert.ok(apply(compiled,60,initial).texts.some(x=>/^b\s*=\s*8\/3$/.test(x)));
  ({compiled,initial}=select('m3s2','두접선각'));
  const before=apply(compiled,36,initial),after=apply(compiled,60,initial);
  assert.ok(!before.rights.some(x=>x.options.color==='#e879f9'));
  assert.ok(after.rights.some(x=>x.options.color==='#e879f9'),'Q right angle appears with the conclusion');
  assert.ok(!after.rights.some(x=>x.options.color==='#fde047'),'sibling QF perpendicular mark stays closed');
  ({compiled,initial}=select('m3s2','초점현수직'));
  const perpendicular=apply(compiled,60,initial);
  assert.ok(perpendicular.rights.some(x=>x.options.color==='#fde047'));
  assert.ok(!perpendicular.rights.some(x=>x.options.color==='#e879f9'));
  ({compiled,initial}=select('q6','최댓최솟값'));
  const preEllipse=apply(compiled,24,initial),ellipse=apply(compiled,36,initial);
  assert.ok(ellipse.paths.filter(x=>x.points.length>30).length>preEllipse.paths.filter(x=>x.points.length>30).length,'ellipse appears with the distance-sum locus');
  assert.ok(!preEllipse.texts.some(x=>/^M\b|^m\b/.test(x)));
  ({compiled,initial}=select('m1s3','등호가능성'));apply(compiled,60,initial);assert.equal(lab.s.a0x,1.5);
  const original=lessons('m1s3').find(x=>x.label==='최소거리');apply(video.compileLesson(original),0,base());
  assert.equal(lab.s.a0x,5);assert.equal(lab.s.lgpExplore,false);assert.equal(lab.s.lgpShowAnswer,false);
});

test('manual dragging, external player state and source-only loading survive',async()=>{
  lab.go('m1s1');lab.tab='explore';let h=lab.draw().handles.find(x=>x.id==='P');assert.ok(h);h.options.drag({x:2,y:3});assert.equal(lab.s.py,3);
  lab.go('m1s3');lab.tab='explore';h=lab.draw().handles.find(x=>x.id==='A0');assert.ok(h);h.options.drag({x:1.5,y:4});assert.equal(lab.s.a0x,1.5);
  lab.go('m2s1');lab.tab='explore';h=lab.draw().handles.find(x=>x.id==='A');assert.ok(h);h.options.drag({x:2,y:4});assert.equal(lab.s.th,90);
  lab.go('q6');lab.tab='explore';h=lab.draw().handles.find(x=>x.id==='P');assert.ok(h);h.options.drag({x:0,y:1.4});assert.equal(lab.s.q6y,1.4);
  lab.go('q5');lab.tab='review';const picked=lessons('q5').find(x=>x.label==='두정의');
  const cs=video.compileLesson(picked),state=video.stateAt(cs,6,base()),prior=lab.s.q5t;
  const external={...lab.s,...state.nums,...state.sets,lessonOn:true,step:state.step};
  const found=[],handle=lab.board.handle;lab.board.handle=function(id,p,o){found.push(p);return handle.call(this,id,p,o);};
  try{lab.board.begin();lab.scene.draw(lab.board,external,{},lab);lab.board.end();}finally{lab.board.handle=handle;}
  const P={x:5*Math.cos(80*Math.PI/180),y:4*Math.sin(80*Math.PI/180)};
  assert.ok(found.some(p=>Math.abs((p.x??p[0])-P.x)<1e-8&&Math.abs((p.y??p[1])-P.y)<1e-8),'KICE drawing uses external player controls');
  assert.equal(lab.s.q5t,prior,'shell controls are not overwritten by drawing');
  const standalone=await load({sourceOnly:true});assert.deepEqual(plain(standalone.def.lessons),{});
  for(const sc of standalone.list){standalone.go(sc.id);standalone.draw();}
});

test('source tape keeps TeX fractions and native Board stacks numeric fractions',()=>{
  lab.go('m2s1');lab.scene.vary.set(0);lab.tab='review';lab.s.step=3;
  const first=lab.draw(),title=first.value.tape.title;
  assert.ok(title.includes('\\frac{1}{a}'));
  assert.ok(title.includes('\\frac{1}{\\frac{8}{3}}'),'a fractional denominator is nested TeX, not ambiguous slash text');
  for(const m of title.matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
  assert.ok(first.canvasText.includes('8')&&first.canvasText.includes('3'),'actual canvas fraction numerator/denominator');
  lab.go('m3s1');lab.scene.vary.set(0);lab.tab='review';lab.s.step=3;
  const mid=lab.draw().value.tape.title;
  assert.ok(mid.includes("\\frac{AA'+BB'}{2}"));
  for(const m of mid.matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
});
