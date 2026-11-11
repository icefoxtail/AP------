// Minimum source-math and cue checks for the three folding scenes. Independent
// reflection/angle calculations do not replace later browser or visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/parallel-lesson-runtime.mjs';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const lab = await load();
const ids = ['p4-1', 'p4-2', 'p4-3'];
const near = (a, b, why = '') => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const area = polygon => Math.abs(polygon.reduce((sum, p, i) => { const q = polygon[(i + 1) % polygon.length]; return sum + p.x * q.y - p.y * q.x; }, 0)) / 2;
function angle(vertex, p, q) {
  const u = [p.x - vertex.x, p.y - vertex.y], v = [q.x - vertex.x, q.y - vertex.y];
  const dot = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v));
  return Math.acos(Math.max(-1, Math.min(1, dot))) * 180 / Math.PI;
}
function reflect(p, pivot, axis) {
  // Independent normal-vector reflection, rather than the production spin path.
  const length = Math.hypot(axis.x, axis.y), nx = -axis.y / length, ny = axis.x / length;
  const d = (p.x - pivot.x) * nx + (p.y - pivot.y) * ny;
  return { x: p.x - 2 * d * nx, y: p.y - 2 * d * ny };
}
function insideConvex(polygon, point) {
  const crosses = polygon.map((p, i) => { const q = polygon[(i + 1) % polygon.length]; return (q.x - p.x) * (point.y - p.y) - (q.y - p.y) * (point.x - p.x); });
  return crosses.every(v => v >= -1e-8) || crosses.every(v => v <= 1e-8);
}
function state(id, index = 0, time) {
  lab.go(id);
  const lesson = core.lessonList(lab.def.lessons[id])[index], compiled = core.compileLesson(lesson);
  const initial = { ...lab.s, ...compiled.start };
  const current = core.stateAt(compiled, time ?? compiled.length, { nums: initial, sets: {}, step: 0, part: 0 });
  const s = { ...initial, ...current.nums, ...current.sets, step: current.step, part: current.part, lessonOn: true, lessonEntry: false };
  return { lesson, compiled, s, source: lab.scene.pa, model: lab.scene.pa.model({ ...s }) };
}
function draw(id, index, time, entry = false) {
  const current = state(id, index, time);
  Object.assign(lab.s, current.s, { lessonOn: !entry, lessonEntry: entry });
  lab.tab = 'review';
  return lab.draw();
}
const has = (frame, pattern) => frame.texts.some(text => pattern.test(text));
const countLabel = (frame, label) => frame.texts.filter(text => text === label).length;
const signature = frame => JSON.stringify(frame.paths.map(path => path.points));

test('three folding scenes register seven valid independently resettable lessons', () => {
  let count = 0;
  for (const id of ids) {
    const lessons = core.lessonList(lab.def.lessons[id]); count += lessons.length;
    const validation = core.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, [], id); assert.deepEqual(validation.warnings, [], id);
    for (const [index, lesson] of lessons.entries()) {
      const first = state(id, index, 0), end = state(id, index);
      assert.equal(first.s.paShowAnswer, false); assert.equal(end.s.paShowAnswer, true);
      near(first.s.pat, 0); near(end.s.pat, 1);
      const reveal = end.compiled.cues.filter(cue => cue.set?.paShowAnswer);
      assert.equal(reveal.length, 1); assert.equal(reveal[0].ch, lesson.chapters.length - 1);
      const stale = Object.fromEntries(end.compiled.setKeys.map(key => [key, 'previous lesson']));
      const rewind = core.stateAt(end.compiled, 0, { nums: first.s, sets: stale, step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], end.compiled.cues[0].set[key], `${id}: ${key}`);
    }
  }
  assert.equal(count, 7);
});

test('the tape fold produces equal base angles, AB=AC and the stated 70-degree vertex angle', () => {
  const { model: m, source } = state('p4-1', 2);
  near(m.a, 55);
  const reflectedE = reflect(m.E, m.B, m.u);
  near(angle(m.B, m.E, m.C), 55);
  near(angle(m.B, reflectedE, m.C), 55);
  near(angle(m.B, m.A, m.C), 55);
  near(angle(m.C, m.A, m.B), 55);
  near(angle(m.A, m.B, m.C), 70);
  near(distance(m.A, m.B), distance(m.A, m.C));
  near(m.x, 70); assert.equal(source.prob(m).choices.find(choice => choice.ok).v, 70);
});

test('the repaired paper really contains triangle ABC for all permitted tape-fold angles', () => {
  const fixed = state('p4-1', 2);
  const oldRightEdge = fixed.model.C.x + 0.7;
  assert.ok(oldRightEdge - fixed.model.B.x < distance(fixed.model.A, fixed.model.B), 'regression: the former default paper ended before A');
  let checked = 0;
  for (let a = 40; a <= 70; a++) for (const bx of [-2.4, -1.2, -0.2]) {
    const m = fixed.source.model({ ...fixed.s, fA: a, fX: bx });
    const original = [m.B, m.C, m.F, m.E], folded = original.map(p => reflect(p, m.B, m.u));
    near(area(folded), area(original), 'folding preserves paper area');
    for (const p of [m.A, m.B, m.C]) assert.ok(insideConvex(folded, p), `${a}°/${bx}: ABC is inside the actual folded paper`);
    const left = Math.min(-3.75, m.A.x - 0.5);
    const fixedPaper = [{ x: left, y: 1.3 }, m.B, m.C, { x: left, y: -1.3 }];
    for (const p of [m.A, m.B, m.C]) assert.ok(insideConvex(fixedPaper, p), `${a}°/${bx}: ABC also lies on the fixed paper`);
    assert.ok(area([m.A, m.B, m.C]) > 0);
    near(angle(m.A, m.B, m.C), 180 - 2 * a);
    checked++;
  }
  assert.equal(checked, 93);
});

test('corner-fold angles follow independent reflection of the actual B and D endpoints', () => {
  for (const [id, expected] of [['p4-2', 46], ['p4-3', 38]]) {
    const { model: m, source } = state(id, 1);
    const reflectedB = reflect(m.B, m.A, m.u1);
    near(reflectedB.x, m.B1.x); near(reflectedB.y, m.B1.y);
    near(angle(m.A, m.B, m.E1), m.a);
    near(angle(m.A, reflectedB, m.E1), m.a);
    near(area([m.A, reflectedB, m.E1]), area([m.A, m.B, m.E1]));
    near(angle(m.A, m.B, m.D), 90);
    if (m.two) {
      const reflectedD = reflect(m.D, m.A, m.u2);
      near(reflectedD.x, m.D2.x); near(reflectedD.y, m.D2.y);
      near(angle(m.A, m.D, m.F2), m.b);
      near(angle(m.A, reflectedD, m.F2), m.b);
      near(angle(m.A, reflectedB, reflectedD), expected);
      near(2 * m.a + expected + 2 * m.b, 90);
      assert.ok(2 * m.a < 90 - 2 * m.b, 'the two folded angles leave a positive gap');
    } else {
      near(angle(m.A, reflectedB, m.D), expected);
      near(2 * m.a + expected, 90);
    }
    near(m.x, expected); assert.equal(source.prob(m).choices.find(choice => choice.ok).v, expected);
  }
});

test('all seven lessons use actual pat folding in the first second without review snapping it closed', () => {
  for (const id of ids) for (const [index, lesson] of core.lessonList(lab.def.lessons[id]).entries()) {
    const entry = draw(id, index, 0, true), moving = draw(id, index, 0.99);
    assert.ok(entry.paths.length > 0 && moving.paths.length > 0);
    assert.notEqual(signature(entry), signature(moving), `${id}/${lesson.label}: real reflected-paper projection changes`);
    const pat = lab.s.pat;
    assert.ok(pat > 0 && pat < 1);
    lab.scene.tick(lab.s, 0.5, lab);
    near(lab.s.pat, pat, `${id}: review tick does not override the lesson`);
    assert.ok(!entry.value.card && !entry.value.formula && entry.value.readouts.length === 0);
  }
});

test('tape explanations reveal the folded angle, triangle type and numeric angle separately', () => {
  assert.equal(countLabel(draw('p4-1', 0, 26.9), '55°'), 1, 'only the given angle is numeric before the conclusion');
  const folded = draw('p4-1', 0, 27);
  assert.equal(countLabel(folded, '55°'), 2); assert.ok(has(folded, /접은 각 = 원래 각/));
  assert.ok(!has(folded, /x=70°/));
  assert.ok(!has(draw('p4-1', 1, 27.9), /이등변삼각형/));
  const triangle = draw('p4-1', 1, 28);
  assert.ok(has(triangle, /AB = AC인 이등변삼각형/)); assert.ok(!has(triangle, /x=70°/));
  assert.ok(has(draw('p4-1', 2, 23), /두 밑각의 합.*110°/));
  assert.ok(!has(draw('p4-1', 2, 27.9), /x=70°|x =.*70°/));
  assert.ok(has(draw('p4-1', 2, 28), /x=70°/));
});

test('angle-partition lessons reveal their symbolic answers last and keep numeric x unknown', () => {
  assert.equal(countLabel(draw('p4-2', 0, 10.9), '22°'), 1);
  assert.equal(countLabel(draw('p4-2', 0, 11), '22°'), 2);
  assert.ok(!has(draw('p4-2', 0, 26.9), /^90° = a \+ a \+ x$/));
  const one = draw('p4-2', 0, 27);
  assert.ok(has(one, /^90° = a \+ a \+ x$/)); assert.ok(!has(one, /x=46°/));
  assert.equal(countLabel(draw('p4-3', 0, 11.9), '14°'), 1);
  assert.equal(countLabel(draw('p4-3', 0, 12), '14°'), 2);
  assert.equal(countLabel(draw('p4-3', 0, 17.9), '12°'), 1);
  assert.equal(countLabel(draw('p4-3', 0, 18), '12°'), 2);
  assert.ok(!has(draw('p4-3', 0, 28.9), /^90° = a \+ a \+ x \+ b \+ b$/));
  const two = draw('p4-3', 0, 29);
  assert.ok(has(two, /^90° = a \+ a \+ x \+ b \+ b$/)); assert.ok(!has(two, /x=38°/));
});

test('corner angle lessons reveal their computed sums before the final 46- and 38-degree answers', () => {
  assert.ok(!has(draw('p4-2', 1, 16.9), /a\+a.*44°/));
  assert.ok(has(draw('p4-2', 1, 17), /a\+a.*44°/));
  assert.ok(!has(draw('p4-2', 1, 27.9), /x=46°|x =.*46°/));
  assert.ok(has(draw('p4-2', 1, 28), /x=46°/));
  assert.ok(!has(draw('p4-3', 1, 16.9), /a\+a.*28°/));
  assert.ok(has(draw('p4-3', 1, 17), /a\+a.*28°/));
  assert.ok(!has(draw('p4-3', 1, 22.9), /b\+b.*24°/));
  assert.ok(has(draw('p4-3', 1, 23), /b\+b.*24°/));
  assert.ok(!has(draw('p4-3', 1, 38.9), /x=38°|x =.*38°/));
  assert.ok(has(draw('p4-3', 1, 39), /x=38°/));
});
