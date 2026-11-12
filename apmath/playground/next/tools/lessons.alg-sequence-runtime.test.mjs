// Minimum release checks: actual source closures, module loading and Board calls.
// These checks are not a full browser/mobile or independent visual review.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/sequence-lesson-runtime.mjs';

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
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'alg-sequence');
  const ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, catalog.sceneTotal);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  assert.deepEqual(lab.missing, []);
  for (const src of ['../kit/apl-player.js', '../kit/apl-video-core.js', 'alg-sequence/lesson-core.js', 'alg-sequence/lesson-a.js', 'alg-sequence/lesson-b.js', 'alg-sequence/lesson-c.js']) assert.ok(lab.loaded.includes(src), src);
  let total = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    assert.ok(lessons(id).some(item => !firstSet(item).lsqConcept), `${id}: original problem is covered`);
    for (const lesson of lessons(id)) {
      total++;
      const init = firstSet(lesson), compiled = video.compileLesson(lesson);
      for (const key of ['lsqQuestion', 'lsqConcept', 'lsqExplore', 'lsqTarget', 'lsqShowAnswer', 'lsqMode', 'lsqStage', 'lsqKnownMath']) assert.ok(Object.hasOwn(init, key), `${id}/${lesson.label}: ${key} reset`);
      assert.equal(init.lsqShowAnswer, false);
      for(const text of [init.lsqQuestion,lesson.answer,...lesson.chapters.flatMap(c=>c.cues.map(q=>q.say||''))])for(const m of String(text).matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>lab.katex.renderToString(m[1],{throwOnError:true,strict:'error'}),id);
      if (!init.lsqConcept) assert.equal(init.lsqQuestion, lab.api.question(id));
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${id}: ${key} start`);
    }
  }
  t.diagnostic(`${ids.length} scenes / ${total} lessons, zero missing scene bindings`);
});

test('every authored cue renders finite native geometry and a real first-second emphasis', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id);
    const base = baseline(), compiled = video.compileLesson(lesson), original = plain(lab.api.first(sc.id));
    const times = new Set([0, 0.9, compiled.length]);
    compiled.chapters.forEach((chapter, i) => {
      for (const cue of lesson.chapters[i].cues) times.add(chapter.at + cue.at);
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
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lsqShowAnswer, false);
      if (time === compiled.length) assert.equal(lab.s.lsqShowAnswer, true);
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
    const question = sc.problem.text(lab.s, lab), lesson = lessons(sc.id).find(item => !firstSet(item).lsqConcept);
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

test('manual review headings remain callable after lesson entry and release, including scenes without a heading', () => {
  const noHeading = new Set(['br-tree', 'cyc-table', 'pt-tri-diff', 'pt-tri-sum', 'fig-repeat']);
  for (const sc of lab.list) {
    lab.go(sc.id);
    const readHeading = () => typeof sc.reviewTop === 'function' ? sc.reviewTop(lab.s, lab) : sc.reviewTop;
    const before = readHeading(), source = plain(sc.vary.cur());
    if (noHeading.has(sc.id)) assert.equal(before, undefined, `${sc.id}: absent optional heading remains absent`);
    else assert.equal(typeof before, 'string', `${sc.id}: existing heading remains readable`);
    const compiled = video.compileLesson(lessons(sc.id)[0]), base = baseline();
    apply(compiled, 0, base, true);
    assert.equal(readHeading(), '', `${sc.id}: entry hides manual review heading`);
    apply(compiled, compiled.length, base);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    lab.tab = 'explore';
    assert.equal(readHeading(), before, `${sc.id}: normal panel restores the original heading`);
    assert.deepEqual(plain(sc.vary.cur()), source, `${sc.id}: heading lookup cannot change the selected problem`);
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

test('cycle table reveals its transient and the first repeated term with their captions', () => {
  for(const lesson of lessons('cyc-table')){
    lab.go('cyc-table');const compiled=video.compileLesson(lesson),base=baseline();
    for(const [time,count] of [[0,1],[12,3],[24,8],[36,8],[48,8]]){
      const frame=apply(compiled,time,base);assert.equal(lab.s.lsqCyCount,count);
      assert.equal(frame.points.filter(p=>p.options.r===4.2).length,count,'native table graph follows the caption');
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
