// Minimum checks for the regular-polygon lesson additions: independent vector
// angles, actual source states, and critical drawing cues. No visual-QA claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/polygons-lesson-runtime.mjs';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const lab = await load();
const ids = ['p4-reg', 'p4-ratio', 'p4-diag', 'p4-join', 'p4-fan'];
const near = (a, b, message = '') => assert.ok(Math.abs(a - b) < 1e-7, `${message}: ${a} != ${b}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function angle(vertex, a, b) {
  const u = [a.x - vertex.x, a.y - vertex.y], v = [b.x - vertex.x, b.y - vertex.y];
  const cosine = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v));
  return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
}
function state(id, index = 0, time) {
  lab.go(id);
  const lesson = core.lessonList(lab.def.lessons[id])[index], compiled = core.compileLesson(lesson);
  const initial = { ...lab.s, ...compiled.start };
  const current = core.stateAt(compiled, time ?? compiled.length, { nums: initial, sets: {}, step: 0, part: 0 });
  const s = { ...initial, ...current.nums, ...current.sets, step: current.step, part: current.part, lessonOn: true, lessonEntry: false };
  return { lesson, compiled, s, source: lab.scene.pg, model: lab.scene.pg.model({ ...s }) };
}
function draw(id, index, time, entry = false) {
  const current = state(id, index, time);
  Object.assign(lab.s, current.s, { lessonOn: !entry, lessonEntry: entry });
  lab.tab = 'review';
  return lab.draw();
}
const has = (frame, pattern) => frame.texts.some(text => pattern.test(text));
const signature = frame => JSON.stringify(frame.paths.map(path => path.points));

test('five regular-polygon scenes register ten valid, independently resettable lessons', () => {
  let count = 0;
  for (const id of ids) {
    const lessons = core.lessonList(lab.def.lessons[id]);
    count += lessons.length;
    const validation = core.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, [], id);
    assert.deepEqual(validation.warnings, [], id);
    for (const [index, lesson] of lessons.entries()) {
      const first = state(id, index, 0), end = state(id, index);
      assert.equal(first.s.pgShowAnswer, false);
      assert.equal(end.s.pgShowAnswer, true);
      const reveal = end.compiled.cues.filter(cue => cue.set?.pgShowAnswer);
      assert.equal(reveal.length, 1);
      assert.equal(reveal[0].ch, lesson.chapters.length - 1);
      const stale = Object.fromEntries(end.compiled.setKeys.map(key => [key, 'previous lesson']));
      const rewind = core.stateAt(end.compiled, 0, { nums: first.s, sets: stale, step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], end.compiled.cues[0].set[key], `${id}: ${key}`);
    }
  }
  assert.equal(count, 10);
});

test('the regular-hexagon lessons agree with vector angles and the full-turn exterior sum', () => {
  for (const index of [0, 1]) {
    const { model: m } = state('p4-reg', index);
    near(m.n, 6);
    const polygon = lab.api.regUp(m.n, 1);
    const measured = polygon.map((p, i) => angle(p, polygon[(i + m.n - 1) % m.n], polygon[(i + 1) % m.n]));
    measured.forEach(value => near(value, 120));
    near(measured.reduce((total, value) => total + 180 - value, 0), 360);
    near(m.e, 60); near(m.I, 120);
  }
  assert.equal(state('p4-reg', 0).lesson.answer, '한 외각 = 60°');
  assert.equal(state('p4-reg', 1).lesson.answer, '120°');
});

test('ratio 3:2 produces a measured regular pentagon, while ratio 2:3 cannot produce an integer side count', () => {
  const valid = state('p4-ratio', 0), invalid = state('p4-ratio', 1);
  near(valid.model.a / valid.model.bb, 3 / 2); near(valid.model.eps, 72);
  assert.equal(valid.model.valid, true); assert.equal(valid.model.n, 5);
  const polygon = lab.api.regUp(5, 1), measured = angle(polygon[0], polygon[4], polygon[1]);
  near(measured / (180 - measured), 3 / 2);
  assert.equal(valid.source.prob(valid.model).choices.find(choice => choice.ok).p, '정5각형');
  near(invalid.model.I / invalid.model.eps, 2 / 3);
  near(invalid.model.eps, 108); near(invalid.model.nn, 10 / 3);
  assert.equal(invalid.model.valid, false); assert.equal(invalid.model.n, null);
  for (let n = 3; n <= 60; n++) {
    const points = lab.api.regUp(n, 1), inside = angle(points[0], points[n - 1], points[1]);
    assert.ok(Math.abs(inside / (180 - inside) - 2 / 3) > 1e-7);
  }
  assert.equal(invalid.source.prob(invalid.model).choices.find(choice => choice.ok).p, '존재하지 않는다');
});

test('two-diagonal answers and both auxiliary angles match independent vectors for all permitted starting vertices', () => {
  const fixed = state('p4-diag');
  near(fixed.model.n, 6); near(fixed.model.I, 120); near(fixed.model.h, 30); near(fixed.model.ab, 90); near(fixed.model.x, 60);
  let checked = 0;
  for (let n = 5; n <= 12; n++) for (let v = 0; v < n; v++) {
    const m = fixed.source.model({ ...fixed.s, pgDn: n, pgDv: v });
    const cross = (a, p, b) => (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x);
    near(cross(m.A, m.P, m.C), 0); near(cross(m.B, m.P, m.D), 0);
    near(angle(m.P, m.A, m.B), 360 / n);
    near(angle(m.A, m.B, m.C), m.h);
    near(angle(m.B, m.A, m.D), m.ab);
    near(angle(m.P, m.A, m.B) + angle(m.P, m.B, m.C), 180);
    checked++;
  }
  assert.equal(checked, 68);
});

test('joined polygons distinguish the outer gap, triangle apex and base, including straight and reflex cases', () => {
  const fixed = state('p4-join', 1), gap = state('p4-join', 0), straight = state('p4-join', 2);
  near(gap.model.gap, 144); near(fixed.model.base, 18);
  near(straight.model.x, 180); assert.equal(straight.model.valid, false);
  let checked = 0;
  for (let n = 3; n <= 8; n++) for (let m = 3; m <= 8; m++) {
    const q = fixed.source.model({ ...fixed.s, pgJn: n, pgJm: m }), g = q.g;
    near(distance(g.A, g.P), distance(g.A, g.Q));
    near(distance(g.A, g.P), distance(g.A, g.B));
    const insideN = angle(g.A, g.B, g.P), insideM = angle(g.A, g.Q, g.B);
    near(360 - insideN - insideM, q.gap);
    near(angle(g.A, g.P, g.Q), q.x);
    if (q.valid) {
      near(angle(g.P, g.A, g.Q), q.base);
      near(angle(g.Q, g.P, g.A), q.base);
      near(q.x + 2 * q.base, 180);
    } else near(angle(g.A, g.P, g.Q), 180);
    if (q.gap > 180) near(q.x, 360 - q.gap);
    checked++;
  }
  assert.equal(checked, 36);
});

test('fan diagonal angles are equal by independent vectors, and the target contains the stated number of pieces', () => {
  const fixed = state('p4-fan', 1);
  near(fixed.model.n, 6); near(fixed.model.h, 30); near(fixed.model.kk, 60);
  let checked = 0;
  for (let n = 5; n <= 12; n++) {
    const m = fixed.source.model({ ...fixed.s, pgFn: n });
    let total = 0;
    for (let j = 1; j <= n - 2; j++) { const part = angle(m.at(0), m.at(j), m.at(j + 1)); near(part, 180 / n); total += part; checked++; }
    near(total, angle(m.at(0), m.at(1), m.at(n - 1)));
    near(angle(m.at(0), m.at(1), m.at(m.k + 1)), m.k * 180 / n);
  }
  assert.equal(checked, 52);
});

test('every added lesson changes real geometry in its first second and keeps the entry panels clear', () => {
  for (const id of ids) for (const [index, lesson] of core.lessonList(lab.def.lessons[id]).entries()) {
    const entry = draw(id, index, 0, true), moving = draw(id, index, 0.99), end = draw(id, index, core.compileLesson(lesson).length);
    assert.ok(entry.paths.length > 0 && end.paths.length > 0, `${id}:${lesson.label}: geometry exists`);
    assert.notEqual(signature(entry), signature(moving), `${id}:${lesson.label}: actual first-second movement`);
    assert.ok(!entry.value.card && !entry.value.formula && entry.value.readouts.length === 0);
  }
});

test('exterior/interior and ratio numeric labels follow their actual explanation cues', () => {
  assert.ok(!has(draw('p4-reg', 0, 11), /^60°$|한 외각.*= 60°/));
  assert.ok(has(draw('p4-reg', 0, 32), /^60°$/));
  assert.ok(has(draw('p4-reg', 1, 11), /^60°$/));
  assert.ok(!has(draw('p4-reg', 1, 27.9), /^120°$|한 내각.*120°/));
  assert.ok(has(draw('p4-reg', 1, 28), /^120°$/));
  for (const [index, outside] of [[0, 72], [1, 108]]) {
    assert.ok(!has(draw('p4-ratio', index, 16.9), new RegExp(`외각 ${outside}°`)));
    assert.ok(has(draw('p4-ratio', index, 17), new RegExp(`외각 ${outside}°`)));
    assert.ok(!has(draw('p4-ratio', index, 27.9), /n = 5|n = 10\/3|정5각형|자연수가 아니에요|정다각형이 없어요/));
  }
  assert.ok(has(draw('p4-ratio', 0, 28), /정5각형/));
  assert.ok(has(draw('p4-ratio', 1, 28), /정다각형이 없어요/));
});

test('the diagonal lesson reveals 120, 30 and 90 before revealing the final 60-degree cross angle', () => {
  assert.ok(!has(draw('p4-diag', 0, 10.9), /^120°$/));
  assert.ok(has(draw('p4-diag', 0, 11), /^120°$/));
  assert.ok(has(draw('p4-diag', 0, 23), /^30°$/));
  assert.ok(has(draw('p4-diag', 0, 28.5), /^90°$/));
  assert.ok(!has(draw('p4-diag', 0, 38.9), /^60°$|∠APB.*= 60°/));
  assert.ok(has(draw('p4-diag', 0, 39), /^60°$/));
});

test('joined-polygon cues separate given length, computed gap, base sum and final conclusions', () => {
  assert.ok(has(draw('p4-join', 0, 0, true), /^4 cm$/), 'given side remains visible before assembly');
  assert.ok(!has(draw('p4-join', 0, 27.9), /^144°$|=144°/));
  assert.ok(has(draw('p4-join', 0, 28), /^144°$/));
  assert.ok(has(draw('p4-join', 1, 22), /^144°$/));
  assert.ok(has(draw('p4-join', 1, 33), /두 밑각의 합.*36°/));
  assert.ok(!has(draw('p4-join', 1, 37.9), /^18°$|∠APQ.*18°/));
  assert.ok(has(draw('p4-join', 1, 38), /^18°$/));
  assert.ok(!has(draw('p4-join', 2, 27.9), /일직선/));
  assert.ok(has(draw('p4-join', 2, 28), /일직선/));
});

test('fan lessons show the single-angle and combined-angle answers only at their final cues', () => {
  assert.ok(!has(draw('p4-fan', 0, 27.9), /^30°$|한 각.*30°/));
  assert.ok(has(draw('p4-fan', 0, 28), /^30°$/));
  assert.ok(has(draw('p4-fan', 1, 22), /^30°$/));
  assert.ok(!has(draw('p4-fan', 1, 37.9), /^60°$|∠BAD.*60°/));
  assert.ok(has(draw('p4-fan', 1, 38), /^60°$/));
});
