// Source HTML and production Board checks; no browser/mobile visual claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {load} from './helpers/composite-lesson-runtime.mjs';
const lab=await load(),video=lab.video;
const plain=v=>JSON.parse(JSON.stringify(v));
const lessons=id=>video.lessonList(lab.def.lessons[id]);
const firstSet=lesson=>lesson.chapters[0].cues[0].set;
const base=()=>({nums:{...lab.s},sets:{...lab.s},step:0,part:null});
const signature=f=>createHash('sha256').update(JSON.stringify({paths:f.paths,points:f.points,handles:f.handles.map(h=>({id:h.id,point:h.point})),plots:f.plots.map(p=>p.samples),canvas:f.canvas})).digest('hex');
function apply(compiled,t,initial,entry=false){
  const state=video.stateAt(compiled,t,initial);
  Object.assign(lab.s,state.nums,state.sets,{lessonOn:!entry,lessonEntry:entry,step:state.step,part:state.part});
  lab.tab='review';return lab.draw();
}
const select=(id,label)=>{lab.go(id);const lesson=lessons(id).find(x=>x.label===label);assert.ok(lesson);return {lesson,compiled:video.compileLesson(lesson),initial:base()};};

test('catalog, actual scenes and first problems bind to valid independent goals',t=>{
  const c={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),c);
  const catalog=c.window.APLab.catalog.labs.find(x=>x.id==='calc1-composite');
  const ids=Array.from(lab.list,x=>x.id);assert.equal(ids.length,catalog.sceneTotal);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());
  assert.deepEqual(lab.missing,[]);
  for(const src of ['../kit/apl-player.js','../kit/apl-video-core.js','calc1-composite/lesson-core.js','calc1-composite/lesson-a.js','calc1-composite/lesson-b.js'])assert.ok(lab.loaded.includes(src),src);
  let count=0,concepts=0,originals=0;
  for(const id of ids){
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])),{errors:[],warnings:[]},id);
    assert.ok(lessons(id).some(x=>!firstSet(x).lccConcept),`${id}: source problem is covered`);
    for(const lesson of lessons(id)){
      count++;const init=firstSet(lesson),compiled=video.compileLesson(lesson);
      init.lccConcept?concepts++:originals++;
      for(const key of ['lccQuestion','lccConcept','lccExplore','lccTarget','lccShowAnswer','lccKnownMath','lccInitial','dual','absType','mk'])assert.ok(Object.hasOwn(init,key),`${id}/${lesson.label}: reset ${key}`);
      assert.equal(init.lccShowAnswer,false);
      if(!init.lccConcept)assert.equal(init.lccQuestion,lab.api.question(id));
      assert.ok(compiled.length>=60&&compiled.length<=72);
      for(const key of Object.keys(compiled.tracks))assert.ok(Number.isFinite(compiled.start[key]),`${id}: numeric start ${key}`);
      for(const chapter of lesson.chapters)for(const cue of chapter.cues)for(const m of String(cue.say||'').matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
    }
  }
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
      assert.ok(frame.canvas.some(x=>x.name==='lineTo'||x.name==='arc'),`${sc.id}/${lesson.label}: native figure`);
      assert.deepEqual(plain(frame.value),{},'derived legacy cards remain closed');
      if(time<compiled.chapters.at(-1).at)assert.equal(lab.s.lccShowAnswer,false);
      if(time===compiled.length)assert.equal(lab.s.lccShowAnswer,true);
      assert.deepEqual(plain(sc.vary.cur()),packet,'actual first source packet during playback');
    }
    assert.notEqual(first,moving,`${sc.id}/${lesson.label}: actual first-second movement`);
    assert.deepEqual(plain(lab.api.first(sc.id)),packet,'first packet remains immutable');
    const entry=apply(compiled,compiled.length,initial,true);
    assert.equal(signature(entry),first,`${sc.id}/${lesson.label}: entry matches initial picture including pane layout`);
  }
  t.diagnostic(`${frames} production Board/canvas states; browser/mobile/independent visual review NOT_RUN`);
});

test('both original new-problem handlers preserve variants through fixed-first playback',()=>{
  for(const sc of lab.list){
    lab.go(sc.id);lab.tab='problem';const first=plain(sc.vary.first());lab.newProblem();
    const picked=plain(sc.vary.cur());assert.notDeepEqual(picked,first,`${sc.id}: actual new-problem click`);
    const question=sc.problem.text(lab.s,lab),lesson=lessons(sc.id).find(x=>!firstSet(x).lccConcept),compiled=video.compileLesson(lesson),initial=base();
    const start=apply(compiled,0,initial);apply(compiled,compiled.length,initial);
    assert.equal(signature(apply(compiled,0,initial)),signature(start),'replay uses exactly the same first source frame');
    lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
    assert.deepEqual(plain(sc.vary.cur()),picked,`${sc.id}: original selection preserved`);
    assert.equal(sc.problem.text(lab.s,lab),question);
  }
});

test('separate goals, sibling controls and numeric labels stay synchronized',()=>{
  let {compiled,initial}=select('abs','미분조건');
  assert.ok(!apply(compiled,48,initial).texts.some(x=>/^실선: m=1$/.test(x)));
  assert.ok(apply(compiled,72,initial).texts.some(x=>/^실선: m=1$/.test(x)));
  assert.ok(!apply(compiled,72,initial).texts.some(x=>/^g\(0\)\s*=\s*2$/.test(x)),'parameter goal does not expose its sibling value');
  ({compiled,initial}=select('abs','접합점값'));
  assert.ok(!apply(compiled,36,initial).texts.some(x=>/^g\(0\)\s*=\s*2$/.test(x)));
  assert.ok(apply(compiled,60,initial).texts.some(x=>/^g\(0\)\s*=\s*2$/.test(x)));
  assert.ok(!apply(compiled,60,initial,true).texts.some(x=>/^g\(0\)\s*=\s*2$/.test(x)));
  ({compiled,initial}=select('scan','네근조건'));assert.ok(!apply(compiled,48,initial).texts.some(x=>/^k\s*=\s*2$/.test(x)));
  assert.ok(apply(compiled,72,initial).texts.some(x=>/^k\s*=\s*2$/.test(x)));
  assert.ok(!apply(compiled,72,initial).texts.includes('6개'),'four-root goal does not reveal the six-root classification');
  ({compiled,initial}=select('kinkcancel','교점중복도'));apply(compiled,60,initial);
  let other=lessons('kinkcancel').find(x=>x.label==='원문직선');apply(video.compileLesson(other),0,base());
  assert.equal(lab.s.mk,'max');assert.equal(lab.s.lccExplore,false);assert.equal(lab.s.lccShowAnswer,false);
  ({compiled,initial}=select('extrema','치역과개수'));apply(compiled,72,initial);
  other=lessons('extrema').find(x=>x.label==='겹친후보');apply(video.compileLesson(other),0,base());
  assert.equal(lab.s.c4,-1);assert.equal(lab.s.dual,true);
  ({compiled,initial}=select('abs','두번반사'));apply(compiled,60,initial);
  other=lessons('abs').find(x=>x.label==='미분조건');apply(video.compileLesson(other),0,base());
  assert.equal(lab.s.absType,'in');assert.equal(lab.s.m,1);
});

test('original dragging, external playback state and source-only loading survive',async()=>{
  lab.go('heal');lab.tab='explore';const h=lab.draw().handles.find(x=>x.id==='r');assert.ok(h);
  h.options.drag({x:.4,y:0});assert.equal(lab.s.r,.4);h.options.drag({x:1.99,y:0});assert.equal(lab.s.r,2);
  lab.go('kinkcancel');lab.tab='explore';const p=lab.draw().handles.find(x=>x.id==='P');assert.ok(p);
  p.options.drag({x:1,y:-2});assert.equal(lab.s.cp,1);
  lab.go('glue');lab.tab='explore';const q=lab.draw().handles.find(x=>x.id==='P');assert.ok(q);
  q.options.drag({x:1.99,y:0});assert.equal(lab.s.gp,2);
  // The player passes its own state object, even when the shell stays in review.
  lab.go('solve');lab.tab='review';const picked=lessons('solve').find(x=>x.label==='꼭짓점접촉');
  const cs=video.compileLesson(picked),state=video.stateAt(cs,30,base());
  const external={...lab.s,...state.nums,...state.sets,lessonOn:true,step:state.step};
  lab.board.setPanes(lab.scene.panes(external));lab.board.begin();lab.scene.draw(lab.board,external,{},lab);lab.board.end();
  assert.equal(lab.board.panes.length,2);assert.equal(external.k5,2);assert.equal(lab.s.k5,0,'shell state remains separate');
  const standalone=await load({sourceOnly:true});assert.deepEqual(plain(standalone.def.lessons),{});
  for(const sc of standalone.list){standalone.go(sc.id);standalone.draw();}
});
