// Minimum release checks: actual source closures, module loading and Board calls.
// These checks are not a full browser/mobile or independent visual review.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/quartic-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const plain = value => JSON.parse(JSON.stringify(value));
const lessons = id => video.lessonList(lab.def.lessons[id]);
const firstSet = lesson => lesson.chapters[0].cues[0].set;
const baseline = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, time, base, entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step, part: state.part });
  lab.tab = 'review';
  return lab.draw();
}
const signature = frame => JSON.stringify({ paths: frame.paths, points: frame.points, plots: frame.plots.map(p => p.samples), circles: frame.circles });

test('catalog and actual HTML have the same complete scene registration and valid lesson sets', t => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'calc1-quartic');
  const ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, catalog.sceneTotal);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  assert.deepEqual(lab.missing, []);
  for (const src of ['../kit/apl-player.js', '../kit/apl-video-core.js', 'calc1-quartic/lesson-core.js', 'calc1-quartic/lesson-a.js', 'calc1-quartic/lesson-b.js']) assert.ok(lab.loaded.includes(src), src);
  let total = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    assert.ok(lessons(id).some(item => !firstSet(item).lqtConcept), `${id}: original problem is covered`);
    for (const lesson of lessons(id)) {
      total++;
      const init = firstSet(lesson), compiled = video.compileLesson(lesson);
      for (const key of ['lqtQuestion', 'lqtConcept', 'lqtExplore', 'lqtTarget', 'lqtShowAnswer', 'lqtMode', 'lqtStage', 'lqtKnownMath']) assert.ok(Object.hasOwn(init, key), `${id}/${lesson.label}: ${key} reset`);
      assert.equal(init.lqtShowAnswer, false);
      for(const text of [init.lqtQuestion,lesson.answer,...lesson.chapters.flatMap(c=>c.cues.map(q=>q.say||''))])for(const m of String(text).matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>lab.katex.renderToString(m[1],{throwOnError:true,strict:'error'}),id);
      if (!init.lqtConcept) assert.equal(init.lqtQuestion, lab.api.question(id));
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${id}: ${key} start`);
    }
  }
  assert.equal(total,22);assert.equal(ids.length,5);
  assert.equal(ids.reduce((n,id)=>n+lessons(id).filter(x=>!firstSet(x).lqtConcept).length,0),8);
  t.diagnostic(`${ids.length} scenes / ${total} lessons, zero missing scene bindings`);
});

test('every authored cue renders finite native geometry and a real first-second emphasis', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id);
    const base = baseline(), compiled = video.compileLesson(lesson), original = plain(lab.api.first(sc.id));
    const times = new Set([0, 0.9, compiled.length]);
    compiled.chapters.forEach((chapter, i) => {
      for (const cue of lesson.chapters[i].cues) { times.add(chapter.at + cue.at); if(cue.to) { times.add(chapter.at+cue.at+cue.dur/2); times.add(chapter.at+cue.at+cue.dur); } }
    });
    // compileLesson preserves each chapter boundary; include both caption slots.
    for (const chapter of compiled.chapters) { times.add(chapter.at); times.add(chapter.at + 6); }
    let first, motion;
    for (const time of [...times].sort((a, b) => a - b)) {
      const frame = apply(compiled, time, base); frames++;
      if (time === 0) first = signature(frame);
      if (time === 0.9) motion = signature(frame);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc' || op.name === 'roundRect'), `${sc.id}/${lesson.label}: core geometry is painted`);
      assert.deepEqual(plain(frame.value), {}, 'legacy answer cards remain isolated');
      assert.equal(sc.reviewTop(lab.s, lab), '');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lqtShowAnswer, false);
      if (time === compiled.length) assert.equal(lab.s.lqtShowAnswer, true);
      if (sc.vary) assert.deepEqual(plain(sc.vary.cur()), original, 'automatic replay selects the first original');
    }
    assert.notEqual(motion, first, `${sc.id}/${lesson.label}: source geometry receives visible first-second emphasis`);
    assert.deepEqual(plain(lab.api.first(sc.id)), original, 'original source packet remains unchanged');
  }
  t.diagnostic(`${frames} production Board/canvas frames; full mobile and independent visual review NOT_RUN`);
});

test('new-problem selection and manual state survive fixed-first replay', () => {
  for (const sc of lab.list.filter(sc => sc.vary)) {
    lab.go(sc.id); lab.tab = 'problem';
    const first = plain(sc.vary.first());
    lab.newProblem();
    const chosen = plain(sc.vary.cur());
    assert.notDeepEqual(chosen, first, `${sc.id}: actual new-problem handler selects a variant`);
    const question = sc.problem.text(lab.s, lab), lesson = lessons(sc.id).find(item => !firstSet(item).lqtConcept);
    const compiled = video.compileLesson(lesson), base = baseline();
    const start = apply(compiled, 0, base);
    assert.equal(sc.question(lab.s, lab), lab.api.question(sc.id));
    apply(compiled, compiled.length, base);
    assert.equal(signature(apply(compiled, 0, base)), signature(start), `${sc.id}: replay is repeatable`);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem';
    lab.draw();
    assert.deepEqual(plain(sc.vary.cur()), chosen, 'manual choice is preserved');
    assert.equal(sc.problem.text(lab.s, lab), question);
  }
});

test('entry after a final frame and sibling transitions restore only the initial drawing', () => {
  for(const sc of lab.list) {
    lab.go(sc.id);const base=baseline();
    for(const lesson of lessons(sc.id)) {
      const compiled=video.compileLesson(lesson);
      const initial=signature(apply(compiled,0,base,true));
      apply(compiled,compiled.length,base);
      const held=plain(lab.s);
      lab.s.lessonOn=false;lab.s.lessonEntry=true;
      const entry=lab.draw();
      assert.equal(signature(entry),initial,sc.id+'/'+lesson.label);
      const after=plain(lab.s);after.lessonOn=held.lessonOn;after.lessonEntry=held.lessonEntry;
      assert.deepEqual(after,held,'entry drawing does not alter held state');
    }
  }
});

// A drawing-only replay must return the original camera as well as the variant.
test('manual pan and zoom survive first-source playback', () => {
  for(const sc of lab.list){
    lab.go(sc.id);lab.tab='problem';lab.newProblem();lab.draw();
    Object.assign(lab.board,{zoom:1.7,panX:23,panY:-17});
    const before={focus:plain(lab.board.focus),zoom:lab.board.zoom,panX:lab.board.panX,panY:lab.board.panY};
    const lesson=lessons(sc.id)[0],compiled=video.compileLesson(lesson),base=baseline();
    apply(compiled,0,base);apply(compiled,compiled.length,base);
    lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
    assert.deepEqual({focus:plain(lab.board.focus),zoom:lab.board.zoom,panX:lab.board.panX,panY:lab.board.panY},before,sc.id);
  }
});

test('native diagrams remove invalid ratio guides and show the actual fold cases',()=>{
  const select=(id,label)=>{lab.go(id);return {compiled:video.compileLesson(lessons(id).find(x=>x.label===label)),base:baseline()};};
  for(const [id,label] of [['triple','조건깨짐'],['sym','대칭조건']]){
    const {compiled,base}=select(id,label);
    const valid=apply(compiled,0,base),invalid=apply(compiled,17,base);
    assert.ok(valid.paths.some(p=>p.options.ref==='box'),id+' valid ratio guide');
    assert.ok(!invalid.paths.some(p=>p.options.ref==='box'),id+' invalid guide removed');
    assert.ok(invalid.handles.some(p=>p.id==='C'),'split critical point is drawn');
  }
  let {compiled,base}=select('sync','대칭일때');
  const equal=apply(compiled,compiled.length,base);
  assert.equal(lab.board.panes.length,2);
  const A=equal.handles.find(p=>p.id==='A'),B=equal.handles.find(p=>p.id==='B');
  assert.ok(Math.abs(A.point.y-B.point.y)<1e-8,'native minima have equal heights');
  assert.ok(equal.handles.some(p=>p.id==='Cd'&&Math.abs(p.point.x-1)<1e-8));
  ({compiled,base}=select('fold','높이별개수'));
  for(const [time,count] of [[0,0],[17,0],[29,2],[41,1],[53,2],[72,1]]){
    const frame=apply(compiled,time,base);
    assert.equal(frame.points.filter(p=>p.options.ref==='fold'&&p.options.color==='red').length,count,'native cusp count at '+time);
  }
});


