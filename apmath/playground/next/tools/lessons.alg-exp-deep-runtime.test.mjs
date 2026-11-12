// Minimum release checks with actual source closures and production Board calls.
// A VM canvas does not replace a browser, mobile or independent visual review.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/exp-deep-lesson-runtime.mjs';

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
const select = (id, label) => { lab.go(id); const lesson = lessons(id).find(item => item.label === label); assert.ok(lesson); return { compiled: video.compileLesson(lesson), base: baseline(), lesson }; };

test('catalog, actual scenes and all original goals have valid lesson registrations', t => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'alg-exp-deep');
  const ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, catalog.sceneTotal);
  assert.equal(ids.length, 16);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  assert.deepEqual(lab.missing, []);
  for (const src of ['../kit/apl-player.js', '../kit/apl-video-core.js', 'alg-exp-deep/lesson-core.js', 'alg-exp-deep/lesson-a.js', 'alg-exp-deep/lesson-b.js']) assert.ok(lab.loaded.includes(src), src);
  let total = 0, concepts = 0, originals = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    assert.ok(lessons(id).some(item => !firstSet(item).ledConcept), `${id}: original goal covered`);
    for (const lesson of lessons(id)) {
      total++;
      const init = firstSet(lesson), compiled = video.compileLesson(lesson);
      init.ledConcept ? concepts++ : originals++;
      for (const key of ['ledQuestion', 'ledConcept', 'ledExplore', 'ledTarget', 'ledShowAnswer', 'ledProbe', 'ledKnownMath', 'ledInitial']) assert.ok(Object.hasOwn(init, key), `${id}/${lesson.label}: ${key} reset`);
      assert.equal(init.ledShowAnswer, false);
      if (!init.ledConcept) assert.equal(init.ledQuestion, lab.api.question(id));
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      assert.ok(compiled.length >= 60 && compiled.length <= 72);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${id}: ${key} start`);
      for (const chapter of lesson.chapters) for (const cue of chapter.cues) for (const match of String(cue.say || '').matchAll(/\$([^$]+)\$/g)) lab.katex.renderToString(match[1], { throwOnError: true });
    }
  }
  assert.deepEqual({ total, concepts, originals }, { total: 29, concepts: 8, originals: 21 });
  t.diagnostic(`${ids.length} scenes / ${total} lessons; zero validator errors and warnings`);
});

test('all authored cues and moving controls render finite native geometry', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id);
    const base = baseline(), compiled = video.compileLesson(lesson), original = plain(lab.api.first(sc.id));
    const times = new Set([0, 0.9, compiled.length]);
    compiled.chapters.forEach((chapter, i) => {
      for (const cue of lesson.chapters[i].cues) {
        times.add(chapter.at + cue.at);
        if (cue.to) { times.add(chapter.at + cue.at + cue.dur / 2); times.add(chapter.at + cue.at + cue.dur); }
      }
    });
    let first, motion;
    for (const time of [...times].sort((a, b) => a - b)) {
      const frame = apply(compiled, time, base); frames++;
      if (time === 0) first = signature(frame);
      if (time === 0.9) motion = signature(frame);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc'), `${sc.id}/${lesson.label}: core geometry is painted`);
      assert.deepEqual(plain(frame.value), {}, 'legacy answer cards remain isolated');
      assert.equal(sc.reviewTop(lab.s, lab), '');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.ledShowAnswer, false);
      if (time === compiled.length) assert.equal(lab.s.ledShowAnswer, true);
      assert.deepEqual(plain(sc.vary.cur()), original, 'automatic playback keeps the first original packet');
    }
    assert.notEqual(motion, first, `${sc.id}/${lesson.label}: visible first-second emphasis on source geometry`);
    assert.deepEqual(plain(lab.api.first(sc.id)), original, 'source packet is immutable');
  }
  t.diagnostic(`${frames} production Board/canvas states; browser/mobile/independent visual review NOT_RUN`);
});

test('manual new-problem packets survive fixed-first replay and source-only loading', async () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem';
    const first = plain(sc.vary.first());
    lab.newProblem();
    const chosen = plain(sc.vary.cur());
    assert.notDeepEqual(chosen, first, `${sc.id}: original new-problem handler selected another packet`);
    const question = sc.problem.text(lab.s, lab), lesson = lessons(sc.id).find(item => !firstSet(item).ledConcept);
    const compiled = video.compileLesson(lesson), base = baseline();
    const start = apply(compiled, 0, base);
    assert.equal(sc.question(lab.s, lab), lab.api.question(sc.id));
    apply(compiled, compiled.length, base);
    assert.equal(signature(apply(compiled, 0, base)), signature(start), `${sc.id}: repeated playback resets`);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem';
    lab.draw();
    assert.deepEqual(plain(sc.vary.cur()), chosen, `${sc.id}: manual choice restored`);
    assert.equal(sc.problem.text(lab.s, lab), question);
  }
  const sourceOnly = await load({ sourceOnly: true });
  assert.equal(sourceOnly.list.length, 16);
  assert.deepEqual(plain(sourceOnly.def.lessons), {});
  sourceOnly.go('t8b'); sourceOnly.tab = 'review'; sourceOnly.draw();
});

test('grid rows and fractional-log probes follow the current explanation', () => {
  let { compiled, base } = select('t2a', '원문');
  const gold = frame => frame.points.filter(p => p.options.color === 'amber');
  assert.equal(gold(apply(compiled, 0, base)).length, 0);
  assert.equal(gold(apply(compiled, 24, base)).length, 10, 'only n=2 and n=3 rows are disclosed');
  assert.equal(gold(apply(compiled, 36, base)).length, 17, 'remaining rows join only after their caption');
  ({ compiled, base } = select('t3a', '소수부분'));
  const probe = frame => frame.points.filter(p => p.options.label === 'P' || p.options.label === 'Q').map(p => p.point.y);
  assert.deepEqual(probe(apply(compiled, 0, base)), [.25, .75]);
  assert.deepEqual(probe(apply(compiled, 30, base)), [.5, .5]);
  ({ compiled, base } = select('t3b', '합의함정'));
  assert.deepEqual(probe(apply(compiled, 0, base)), [0, 1], 'integer u is excluded from the sum-one condition');
  const valid = probe(apply(compiled, 18, base));
  assert.ok(valid.length === 2 && Math.abs(valid[0] - valid[1]) < 1e-12);
});

test('unrelated results and stale final labels stay closed on entry', () => {
  let { compiled, base } = select('t4a', '넓이');
  assert.ok(!apply(compiled, 36, base).texts.some(text => /S\s*=\s*6/.test(text)));
  assert.ok(apply(compiled, 60, base).texts.some(text => /S\s*=\s*6/.test(text)));
  assert.ok(!apply(compiled, 60, base, true).texts.some(text => /S\s*=\s*6/.test(text)));
  ({ compiled, base } = select('t4a', '가로길이'));
  assert.ok(!apply(compiled, 60, base).texts.some(text => /S\s*=/.test(text)), 'width-only goal does not disclose the separate area result');
  ({ compiled, base } = select('t8a', '높이합'));
  assert.ok(!apply(compiled, 60, base).texts.some(text => /2\^.*=\s*12/.test(text)), 'height-sum lesson does not disclose the other target');
  ({ compiled, base } = select('t3a', '소수부분'));
  apply(compiled, 60, base);
  const original = lessons('t3a').find(item => item.label === '원문');
  const frame = apply(video.compileLesson(original), 0, baseline());
  assert.equal(lab.s.ledProbe, false, 'the sibling original lesson resets its concept-only overlay');
  assert.ok(!frame.points.some(p => p.options.label === 'P' || p.options.label === 'Q'));
});

test('the exponential lesson camera follows growing endpoints while the native player holds dragging', () => {
  const { compiled, base } = select('t6a', '등차와등비');
  lab.s.dragging = true;
  try {
    apply(compiled, 0, base);
    for (const time of [26.2, 28.2, compiled.length]) {
      const frame = apply(compiled, time, base);
      const x3 = lab.s.type6_xMid + lab.s.type6_stepD, y3 = 2 ** x3;
      assert.ok(frame.viewBox.y1 > y3 && frame.viewBox.x1 > x3, `visible C at ${time}`);
    }
  } finally { lab.s.dragging = false; }
});

test('the actual exploration action distinguishes rounded ratios from exact values', () => {
  lab.go('t6a');
  const action = lab.scene.actions().find(item => item.id === 'twin');
  const random = lab.math.random;
  try {
    lab.math.random = () => .5;
    action.run(lab.s);
    assert.equal(lab.s.type6_stepD, 1.5);
    assert.match(lab.s.twinText, /2\^\{1\.5\} \\approx 2\.83/);
    lab.s.step = 3;
    assert.match(lab.scene.view(lab.s, lab).formula, /r=2\^d\\approx2\.83/);
    lab.math.random = () => .1;
    action.run(lab.s);
    assert.equal(lab.s.type6_stepD, 1);
    assert.match(lab.s.twinText, /2\^\{1\} = 2/);
  } finally { lab.math.random = random; }
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
