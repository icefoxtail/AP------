// Source HTML and production Board checks; no browser/mobile visual claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {load} from './helpers/limits-lesson-runtime.mjs';
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
  const catalog=c.window.APLab.catalog.labs.find(x=>x.id==='calc1-limits');
  const ids=Array.from(lab.list,x=>x.id);assert.equal(ids.length,catalog.sceneTotal);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());
  assert.deepEqual(lab.missing,[]);
  for(const src of ['../kit/apl-player.js','../kit/apl-video-core.js','calc1-limits/lesson-core.js','calc1-limits/lesson-a.js','calc1-limits/lesson-b.js'])assert.ok(lab.loaded.includes(src),src);
  let count=0,concepts=0,originals=0;
  for(const id of ids){
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])),{errors:[],warnings:[]},id);
    assert.ok(lessons(id).some(x=>!firstSet(x).lclConcept),`${id}: source problem is covered`);
    for(const lesson of lessons(id)){
      count++;const init=firstSet(lesson),compiled=video.compileLesson(lesson);
      init.lclConcept?concepts++:originals++;
      for(const key of ['lclQuestion','lclConcept','lclExplore','lclTarget','lclShowAnswer','lclKnownMath','lclInitial','dual','k6','k7','k8','k9','tr6','tr9'])assert.ok(Object.hasOwn(init,key),`${id}/${lesson.label}: reset ${key}`);
      assert.equal(init.lclShowAnswer,false);
      if(!init.lclConcept)assert.equal(init.lclQuestion,lab.api.question(id));
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
      if(time<compiled.chapters.at(-1).at)assert.equal(lab.s.lclShowAnswer,false);
      if(time===compiled.length)assert.equal(lab.s.lclShowAnswer,true);
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
    const question=sc.problem.text(lab.s,lab),lesson=lessons(sc.id).find(x=>!firstSet(x).lclConcept),compiled=video.compileLesson(lesson),initial=base();
    const start=apply(compiled,0,initial);apply(compiled,compiled.length,initial);
    assert.equal(signature(apply(compiled,0,initial)),signature(start),'replay uses exactly the same first source frame');
    lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
    assert.deepEqual(plain(sc.vary.cur()),picked,`${sc.id}: original selection preserved`);
    assert.equal(sc.problem.text(lab.s,lab),question);
  }
});

test('separate goals and sibling model controls reset without premature conclusions',()=>{
  let {compiled,initial}=select('continuity','함숫값조건');
  assert.ok(!apply(compiled,36,initial).texts.some(x=>/^k\s*=\s*2/.test(x)));
  assert.ok(apply(compiled,60,initial).texts.some(x=>/^k\s*=\s*2/.test(x)),'final filled-point value is visible');
  assert.ok(!apply(compiled,60,initial,true).texts.some(x=>/^k\s*=\s*2/.test(x)),'entry closes the stale answer');
  ({compiled,initial}=select('continuity','극한조건'));assert.ok(!apply(compiled,60,initial).texts.some(x=>/^k\s*=/.test(x)),'different target does not expose k');
  ({compiled,initial}=select('zero-zero','계수결정'));assert.ok(!apply(compiled,60,initial).texts.some(x=>/^b\s*=/.test(x)),'coefficient target does not expose the other answer');
  ({compiled,initial}=select('ratio-limit','무한대현비'));apply(compiled,72,initial);
  let other=lessons('ratio-limit').find(x=>x.label==='길이비');apply(video.compileLesson(other),0,base());
  assert.equal(lab.s.k8,'len0');assert.equal(lab.s.lclExplore,false);assert.equal(lab.s.lclShowAnswer,false);
  ({compiled,initial}=select('window-max','창의폭'));apply(compiled,60,initial);
  other=lessons('window-max').find(x=>x.label==='극점출입');apply(video.compileLesson(other),0,base());
  assert.equal(lab.s.a9,2);assert.equal(lab.s.k9,'max');assert.equal(lab.s.show9,'trace');
  assert.deepEqual(plain(lab.s.tr9),{});
});

test('manual dragging and source-only HTML loading remain operational',async()=>{
  lab.go('product');lab.tab='explore';const hook=lab.draw().handles.find(h=>h.id==='r');assert.ok(hook);
  hook.options.drag({x:.4,y:0});assert.equal(lab.s.r,.4);
  hook.options.drag({x:.99,y:0});assert.equal(lab.s.r,1,'original snap to the discontinuity survives');
  lab.go('ratio-limit');lab.tab='explore';const handle=lab.draw().handles.find(h=>h.id==='p8');assert.ok(handle);
  const before=lab.s.t8;handle.options.drag({x:handle.point.x,y:handle.point.y-.2});assert.ok(lab.s.t8<before,'original transformed-frame dragging survives');
  const standalone=await load({sourceOnly:true});assert.deepEqual(plain(standalone.def.lessons),{});
  standalone.go('continuity');standalone.draw();standalone.go('window-max');standalone.draw();
});
