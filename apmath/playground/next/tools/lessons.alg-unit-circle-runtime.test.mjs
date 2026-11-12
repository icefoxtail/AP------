// Minimum checks use the actual HTML, source functions, overlays and Board.
// No actual browser/mobile or independent visual review is claimed here.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/unit-circle-lesson-runtime.mjs';

const lab = await load(), video = lab.video, PI = Math.PI;
const plain = value => JSON.parse(JSON.stringify(value));
const lessons = id => video.lessonList(lab.def.lessons[id]);
const firstSet = lesson => lesson.chapters[0].cues[0].set;
const baseline = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);
function apply(compiled,time,base,entry=false) {
  const state=video.stateAt(compiled,time,base);
  Object.assign(lab.s,state.nums,state.sets,{lessonOn:!entry,lessonEntry:entry,step:state.step,part:state.part});
  lab.tab='review';
  return lab.draw();
}
const signature=frame=>JSON.stringify({paths:frame.paths,points:frame.points,plots:frame.plots.map(p=>p.samples),canvas:frame.canvas,overlays:frame.overlayLabels});
const select=(id,label)=>{lab.go(id);const lesson=lessons(id).find(item=>item.label===label);assert.ok(lesson);return {lesson,compiled:video.compileLesson(lesson),base:baseline()};};

test('catalog and source scenes bind every distinct lesson with valid captions', t=>{
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),context);
  const catalog=context.window.APLab.catalog.labs.find(item=>item.id==='alg-unit-circle');
  const ids=Array.from(lab.list,sc=>sc.id);
  assert.equal(ids.length,catalog.sceneTotal);
  assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());
  assert.deepEqual(lab.missing,[]);
  for(const src of ['../kit/apl-player.js','../kit/apl-video-core.js','alg-unit-circle/lesson-core.js','alg-unit-circle/lesson-a.js','alg-unit-circle/lesson-b.js'])assert.ok(lab.loaded.includes(src));
  let count=0,concepts=0,originals=0;
  for(const sc of lab.list){
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[sc.id])),{errors:[],warnings:[]},sc.id);
    const list=lessons(sc.id);
    if(sc.vary)assert.ok(list.some(lesson=>!firstSet(lesson).lucConcept),`${sc.id}: actual first problem covered`);
    for(const lesson of list){
      count++;
      const init=firstSet(lesson),compiled=video.compileLesson(lesson);
      init.lucConcept?concepts++:originals++;
      for(const key of ['lucQuestion','lucConcept','lucExplore','lucShowAnswer','lucKnownMath','lucInitial','fn','view','mode','domain','common','revealedRoot','drag','anim'])assert.ok(Object.hasOwn(init,key),`${sc.id}/${lesson.label}: ${key} reset`);
      assert.equal(init.lucShowAnswer,false);
      if(!init.lucConcept)assert.equal(init.lucQuestion,lab.api.question(sc.id));
      assert.ok(lesson.chapters.length>=4&&lesson.chapters.length<=6);
      assert.ok(compiled.length>=60&&compiled.length<=72);
      for(const key of Object.keys(compiled.tracks))assert.ok(Number.isFinite(compiled.start[key]),`${sc.id}: ${key} numeric start`);
      for(const chapter of lesson.chapters)for(const cue of chapter.cues)for(const m of String(cue.say||'').matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
    }
  }
  t.diagnostic(`${ids.length} scenes / ${count} lessons: ${concepts} concepts + ${originals} first-source problems; validator 0/0`);
});

test('every cue and motion boundary paints finite actual circle/graph geometry', t=>{
  let frames=0;
  for(const sc of lab.list)for(const lesson of lessons(sc.id)){
    lab.go(sc.id);
    const base=baseline(),compiled=video.compileLesson(lesson),packet=plain(lab.api.first(sc.id));
    const times=new Set([0,.9,compiled.length]);
    compiled.chapters.forEach((ch,i)=>lesson.chapters[i].cues.forEach(cue=>{
      times.add(ch.at+cue.at);
      if(cue.to){times.add(ch.at+cue.at+cue.dur/2);times.add(ch.at+cue.at+cue.dur);}
    }));
    let first,motion;
    for(const time of [...times].sort((a,b)=>a-b)){
      const frame=apply(compiled,time,base);frames++;
      if(time===0)first=signature(frame);
      if(time===.9)motion=signature(frame);
      assert.ok(frame.canvas.some(op=>op.name==='arc'||op.name==='lineTo'),`${sc.id}/${lesson.label}: geometry drawn`);
      assert.deepEqual(plain(frame.value),{},'legacy result cards remain closed');
      if(time<compiled.chapters.at(-1).at)assert.equal(lab.s.lucShowAnswer,false);
      if(time===compiled.length)assert.equal(lab.s.lucShowAnswer,true);
      if(sc.vary)assert.deepEqual(plain(sc.vary.cur()),packet,'playback uses the actual first packet');
    }
    assert.notEqual(motion,first,`${sc.id}/${lesson.label}: first-second movement changes actual geometry`);
    assert.deepEqual(plain(lab.api.first(sc.id)),packet,'source data is unchanged');
    const entry=apply(compiled,compiled.length,base,true);
    assert.equal(signature(entry),first,`${sc.id}/${lesson.label}: entry restores the initial figure and initial stage`);
  }
  t.diagnostic(`${frames} production Board/raw canvas states; browser/mobile/independent visual review NOT_RUN`);
});

test('module state follows external playback angles and restores the manual state reference',()=>{
  const {compiled,base}=select('coords','좌표읽기');
  const current=frame=>frame.canvas.filter(op=>op.name==='arc'&&op.args[2]===8).at(-1).args;
  const first=current(apply(compiled,0,base)),arrived=current(apply(compiled,4.2,base));
  assert.notDeepEqual(first.slice(0,2),arrived.slice(0,2));
  const region=lab.api.layout(lab.board,lab.s).circle,R=lab.api.radius(region.w,region.h);
  near(arrived[0],region.w/2+R*Math.cos(PI/6));near(arrived[1],region.h/2-R*Math.sin(PI/6));
  const before=plain(lab.s),external={...lab.s,fn:{sin:true,cos:true,tan:false},theta:2*PI/3,view:'circle',lessonOn:false,lessonEntry:false,step:2};
  const other=current(lab.draw(external));
  near(other[0],region.w/2-R/2);near(other[1],region.h/2-R*Math.sqrt(3)/2);
  assert.deepEqual(plain(lab.s),before,'drawAll restores the module state after an external-state drawing');
  const shown=current(lab.draw());
  near(shown[0],arrived[0]);near(shown[1],arrived[1]);
  const coordinate=lab.draw(external).overlayLabels.find(item=>item.key==='selected-point-coordinate');
  assert.ok(coordinate?.tex.includes('-'),'the actual external second-quadrant coordinate has a negative x component');
});

test('original new-problem choices and source-only loading remain available',async()=>{
  for(const sc of lab.list.filter(sc=>sc.vary)){
    lab.go(sc.id);lab.tab='problem';
    const first=plain(sc.vary.first());lab.newProblem();
    const chosen=plain(sc.vary.cur());assert.notDeepEqual(chosen,first,`${sc.id}: actual new-problem click`);
    const question=sc.problem.text(lab.s,lab),lesson=lessons(sc.id).find(item=>!firstSet(item).lucConcept),compiled=video.compileLesson(lesson),base=baseline();
    const start=apply(compiled,0,base);apply(compiled,compiled.length,base);
    assert.equal(signature(apply(compiled,0,base)),signature(start),'same first problem on replay');
    lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
    assert.deepEqual(plain(sc.vary.cur()),chosen,'the manual variant is preserved');
    assert.equal(sc.problem.text(lab.s,lab),question);
  }
  const sourceOnly=await load({sourceOnly:true});
  assert.deepEqual(plain(sourceOnly.def.lessons),{});
  sourceOnly.go('coords');sourceOnly.draw();sourceOnly.go('rootsum');sourceOnly.draw();
});

test('overlay answers, sibling controls and inequality emphasis follow the matching cue',()=>{
  let {compiled,base}=select('coords','좌표읽기');
  const coordinates=frame=>frame.overlayLabels.filter(item=>item.key==='selected-point-coordinate').map(item=>item.tex);
  assert.ok(!coordinates(apply(compiled,36,base)).some(tex=>tex.includes('sqrt')),'the complete coordinate answer remains closed');
  assert.ok(coordinates(apply(compiled,60,base)).some(tex=>tex.includes('sqrt')),'the final coordinate is shown');
  assert.ok(!coordinates(apply(compiled,60,base,true)).some(tex=>tex.includes('sqrt')),'stale coordinate answer is closed on reentry');
  ({compiled,base}=select('equation','공통해'));apply(compiled,60,base);
  const ordinary=lessons('equation').find(item=>item.label==='사인방정식');
  apply(video.compileLesson(ordinary),0,baseline());
  assert.deepEqual(plain(lab.s.fn),{sin:true,cos:false,tan:false});
  assert.equal(lab.s.common,false);assert.equal(lab.s.revealedRoot,null);
  ({compiled,base}=select('inequality','사인부등식'));
  const first=apply(compiled,0,base),selected=apply(compiled,24,base);
  assert.ok(selected.canvas.filter(op=>op.name==='lineTo').length>first.canvas.filter(op=>op.name==='lineTo').length,'solution shading is deferred to its explanation');
});
