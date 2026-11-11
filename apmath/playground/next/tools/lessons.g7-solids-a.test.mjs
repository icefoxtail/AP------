// Mathematical and essential-cue checks for t1; not a mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/solids-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const ids = Array.from({ length: 7 }, (_, i) => `s1-${i + 1}`);
const all = ids.flatMap(id => video.lessonList(lab.def.lessons[id]).map(lesson => ({ id, lesson })));
const find = (id, label) => video.lessonList(lab.def.lessons[id]).find(l => l.label === label);
const normalized = video.normAnswer;
function frame(id, lesson, time = 0) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const cs = video.compileLesson(lesson), at = video.stateAt(cs, time, { nums: lab.s, sets: lab.s, step: 0 });
  Object.assign(lab.s, at.nums, at.sets, { lessonOn: true, lessonEntry: false, dragging: true, playing: false });
  lab.tab = 'review';
  lab.scene.view(lab.s, lab); lab.s.step = at.step;
  return { model: lab.scene.so.model(lab.s), timeline: cs, ...lab.draw() };
}
const final = (id, lesson) => frame(id, lesson, video.compileLesson(lesson).length);
const close = (a, b, reason) => assert.ok(Math.abs(a - b) < 1e-9, `${reason}: ${a} versus ${b}`);
const row = result => result.textItems.filter(x => x.screen && x.options?.color === 'green' && Math.abs(x.y - 17 - lab.board.insets.top) < 1e-9);

test('fixed rectangle, triangle and trapezoid dimensions reproduce the lesson answers', () => {
  for (const lesson of video.lessonList(lab.def.lessons['s1-1'])) {
    const { model: M } = final('s1-1', lesson);
    assert.deepEqual([M.R, M.h, M.sol.rmax, M.sol.ymax - M.sol.ymin], [3, 5, 3, 5]);
    assert.deepEqual(Array.from(M.sol.poly, p => Array.from(p)), [[0, 0], [3, 0], [3, 5], [0, 5]]);
    assert.equal(lesson.answer, { 만들기: '원기둥', 반지름: '반지름 3 cm', 높이: '높이 5 cm' }[lesson.label]);
  }
  for (const lesson of video.lessonList(lab.def.lessons['s1-2'])) {
    const { model: M } = final('s1-2', lesson), r = M.ax === 'AB' ? M.a : M.b, h = M.ax === 'AB' ? M.b : M.a;
    assert.deepEqual([M.r, M.h], [r, h]);
    assert.equal(M.sol.bands[0].r0, r);
    assert.equal(M.sol.bands[0].r1, 0);
    assert.equal(M.sol.ymax - M.sol.ymin, h);
    assert.equal(normalized(lesson.answer), normalized(lesson.label === '밑넓이' ? `${r * r}π cm²` : `반지름 ${r} cm · 높이 ${h} cm`));
  }
  for (const lesson of video.lessonList(lab.def.lessons['s1-3'])) {
    const { model: M } = final('s1-3', lesson);
    assert.ok(M.R > M.r && M.r > 0);
    assert.deepEqual(Array.from(M.sol.poly, p => Array.from(p)), [[0, 0], [4, 0], [2, 3], [0, 3]]);
    assert.equal(normalized(lesson.answer), normalized(lesson.label === '만들기' ? '원뿔대' : `${M.R ** 2}π cm²`));
  }
});

test('semicircle and full-circle lessons have the same radius, and only the diameter is initially disclosed', () => {
  const radius = find('s1-4', '반지름'), initial = frame('s1-4', radius), finish = final('s1-4', radius);
  assert.ok(initial.texts.includes('지름 8 cm'));
  assert.ok(initial.texts.includes('반지름 r'));
  assert.ok(!initial.texts.includes('r = 4 cm'), 'derived radius is not an initial answer label');
  assert.equal(finish.model.R, 8 / 2);
  assert.equal(normalized(radius.answer), normalized(`${finish.model.R} cm`));
  const original = lab.api.S3.drawRevolve;
  const seen = [];
  lab.api.S3.drawRevolve = function (D, sol, sweep, options) { seen.push({ poly: sol.poly, sphere: sol.sphere }); return original(D, sol, sweep, options); };
  try {
    for (const label of ['반원회전', '원전체']) frame('s1-4', find('s1-4', label));
  } finally { lab.api.S3.drawRevolve = original; }
  assert.equal(seen.length, 2);
  assert.ok(seen[0].poly.every(p => p[0] >= -1e-9), 'semicircle lies on one side of the axis');
  assert.ok(seen[1].poly.some(p => p[0] < -2.9) && seen[1].poly.some(p => p[0] > 2.9), 'full circle is actually drawn on both sides');
  for (const shape of seen) {
    assert.equal(shape.sphere.R, 3);
    for (const p of shape.poly) close(Math.hypot(...p), 3, 'same distance from the center');
  }
});

test('axis offset and hypotenuse rotation follow the actual radial profiles', () => {
  let M = final('s1-5', find('s1-5', '축에붙임')).model;
  assert.equal(M.sol.hole, 0); assert.equal(M.sol.rmax, 2);
  M = final('s1-5', find('s1-5', '축에서떼기')).model;
  assert.equal(M.sol.hole, 2); assert.equal(M.sol.rmax, 2 + 2);
  M = final('s1-5', find('s1-5', '빗변축')).model;
  const [A, B, C] = M.sol.poly;
  close(Math.hypot(B[0] - A[0], B[1] - A[1]), 3, 'first leg');
  close(Math.hypot(C[0] - B[0], C[1] - B[1]), 4, 'second leg');
  close(Math.hypot(C[0] - A[0], C[1] - A[1]), 5, 'hypotenuse');
  close((A[0] - B[0]) * (C[0] - B[0]) + (A[1] - B[1]) * (C[1] - B[1]), 0, 'right angle opposite the axis');
  assert.equal(M.sol.bands.length, 2);
  close(M.sol.bands[0].r1, M.sol.bands[1].r0, 'cones share a common base radius');
});

test('inverse lessons use one-sided profiles and do not call a general double-cone triangle right-angled', () => {
  for (const lesson of video.lessonList(lab.def.lessons['s1-6'])) {
    const { model: M } = final('s1-6', lesson);
    assert.ok(M.sol.poly.every(p => p[0] >= 0), 'profile satisfies the one-side condition');
    assert.equal(M.sol.poly[0][0], 0); assert.equal(M.sol.poly.at(-1)[0], 0);
    assert.equal(M.sol.ymax, M.kind === 'frus' ? M.d.h1 : M.d.h1 + M.d.h2);
    if (M.kind === 'dbl') {
      const [A, B, C] = M.sol.poly;
      const dot = (A[0] - B[0]) * (C[0] - B[0]) + (A[1] - B[1]) * (C[1] - B[1]);
      assert.notEqual(dot, 0, 'default inverse-profile triangle is not right-angled');
      assert.ok(!lab.scene.so.steps(M).join('').includes('직각삼각형'));
      assert.equal(lesson.answer, '삼각형');
    }
  }
});

test('every lesson moves actual drawing geometry promptly and reveals its result only at the final cue', t => {
  let frames = 0;
  const geometry = result => JSON.stringify(result.paths.map(({ points, options }) => ({ points, options })));
  for (const { id, lesson } of all) {
    const report = video.validateLesson(lesson);
    assert.deepEqual(report.errors, [], id + ':' + lesson.label);
    assert.deepEqual(report.warnings, [], id + ':' + lesson.label);
    const first = frame(id, lesson), moving = frame(id, lesson, .75);
    assert.ok(first.paths.length > 0, 'first-frame figure exists');
    assert.ok(geometry(first) !== geometry(moving), `${id}:${lesson.label}: genuine motion in first second`);
    const reveal = first.timeline.cues.find(c => c.set?.soShowAnswer === true);
    const before = frame(id, lesson, reveal.at - .01), last = final(id, lesson);
    assert.equal(row(before).length, 0, `${id}:${lesson.label}: result row withheld`);
    assert.equal(row(last).length, 1, `${id}:${lesson.label}: final result row exists`);
    assert.ok(normalized(row(last)[0].text).includes(normalized(lesson.answer)), `${id}:${lesson.label}: final drawing agrees with answer`);
    const reset = video.stateAt(first.timeline, 0, { nums: lab.s, sets: lab.s, step: lab.s.step });
    assert.equal(reset.sets.soShowAnswer, false, 'replay locks previous answer');
    frames += 4;
  }
  t.diagnostic(`${frames} essential source/Board cue frames; physical mobile visual QA NOT_RUN`);
});
