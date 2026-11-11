// Minimum independent counts, segment math and production-Board cue checks.
// This is not the deferred browser/mobile quality audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/points-lines-lesson-runtime.mjs';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const lab = await load();
const ids = ['b1-1', 'b1-2', 'b1-3', 'm-mid', 'm-dbl', 'm-tri', 'm-ratio', 'm-eq'];
const near = (a, b, why = '') => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const has = (frame, pattern) => frame.texts.some(text => pattern.test(text));
const signature = frame => JSON.stringify(frame.paths.map(path => path.points));

function state(id, index = 0, time) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const source = lab.scene._pl, lesson = core.lessonList(lab.def.lessons[id])[index];
  const compiled = core.compileLesson(lesson), initial = { ...lab.s, ...compiled.start };
  const current = core.stateAt(compiled, time ?? compiled.length, { nums: initial, sets: {}, step: 0, part: 0 });
  const s = { ...initial, ...current.nums, ...current.sets, step: current.step, part: current.part, lessonOn: true, lessonEntry: false };
  const model = source.model(s), quiz = source.quiz(model, s, lab.api.rng(lab.api.hash(id) + (s.plSeed + 1) * 7919));
  return { source, lesson, compiled, s, model, quiz };
}
function draw(id, index, time, entry = false) {
  const current = state(id, index, time);
  Object.assign(lab.s, current.s, { lessonOn: !entry, lessonEntry: entry });
  // Even stale flags from an earlier replay must not reveal entry answers.
  if (entry) for (const key of current.compiled.setKeys) if (typeof lab.s[key] === 'boolean') lab.s[key] = true;
  lab.tab = 'review';
  return lab.draw();
}
function geometryCount(kind, n) {
  const solid = lab.api.solids.build(kind, n, 1.6, 2.3);
  const vertices = new Set(solid.V.map(p => [p.x, p.y, p.z].map(x => x.toFixed(10)).join(',')));
  const edges = new Set(solid.E.map(e => [e.u, e.v].sort((a, b) => a - b).join(',')));
  assert.equal(vertices.size, solid.V.length);
  assert.equal(edges.size, solid.E.length);
  for (const edge of solid.E) {
    assert.notEqual(edge.u, edge.v);
    assert.equal(solid.F.filter(face => face.includes(edge.u) && face.includes(edge.v)).length, 2);
  }
  assert.equal(vertices.size - edges.size + solid.F.length, 2);
  return { a: vertices.size, b: edges.size };
}
function gate(id, index, key, pattern) {
  const current = state(id, index), cue = current.compiled.cues.find(c => c.set?.[key] === true);
  assert.ok(cue, `${id}/${index}: ${key} has a cue`);
  assert.equal(has(draw(id, index, 0, true), pattern), false, `${id}/${index}: entry hides ${pattern}`);
  assert.equal(has(draw(id, index, cue.at - 0.001), pattern), false, `${id}/${index}: before ${key}`);
  assert.equal(has(draw(id, index, cue.at), pattern), true, `${id}/${index}: at ${key}`);
}

test('eight scenes register twenty-one resettable lessons with fixed original quiz variants', () => {
  let count = 0;
  for (const id of ids) {
    const validation = core.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, [], id); assert.deepEqual(validation.warnings, [], id);
    const lessons = core.lessonList(lab.def.lessons[id]); count += lessons.length;
    for (let index = 0; index < lessons.length; index++) {
      const first = state(id, index, 0), end = state(id, index);
      assert.ok(Number.isInteger(first.compiled.start.plSeed));
      assert.equal(first.s.plShowAnswer, false); assert.equal(end.s.plShowAnswer, true);
      const reveal = end.compiled.cues.filter(c => c.set?.plShowAnswer);
      assert.equal(reveal.length, 1); assert.equal(reveal[0].ch, first.lesson.chapters.length - 1);
      const stale = Object.fromEntries(end.compiled.setKeys.map(key => [key, 'previous lesson']));
      const rewind = core.stateAt(end.compiled, 0, { nums: first.s, sets: stale, step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], end.compiled.cues[0].set[key], `${id}/${index}: ${key}`);
      assert.equal(first.quiz.choices.filter(c => c.ok).length, 1);
      if (id !== 'b1-2') assert.equal(first.source.lessonQuestion(first.model, first.s, first.quiz), first.quiz.stem);
    }
  }
  assert.equal(count, 21);
});

test('actual prism, pyramid and frustum topology independently gives the three expression answers', () => {
  for (const [index, expected] of [[0, [10, 15, 5]], [1, [6, 10, 16]], [2, [10, 15, 20]]]) {
    const { model, s, quiz } = state('b1-1', index), count = geometryCount(s.p1k, s.p1n);
    assert.deepEqual([count.a, count.b], expected.slice(0, 2));
    const result = index === 0 ? count.b - count.a : index === 1 ? count.a + count.b : 2 * count.b - count.a;
    assert.equal(result, expected[2]); assert.equal(model.val, result);
    assert.equal(quiz.choices.find(c => c.ok).v, result);
  }
});

test('plane and line intersections obey the original three-dimensional equations', () => {
  for (const index of [0, 1]) {
    const { s, model, quiz } = state('b1-2', index), radians = s.p2t * Math.PI / 180;
    const t = -0.9 / Math.sin(radians), x = s.p2x + t * Math.cos(radians);
    near(0.9 + t * Math.sin(radians), 0); near(model.xHit, x);
    assert.ok(Math.abs(t) < 3); assert.ok(Math.abs(x) < 4.6);
    assert.equal(model.has, true); assert.equal(model.mode, index);
    assert.match(quiz.choices.find(c => c.ok).t, index === 0 ? /면과 면.*교선/ : /직선과 평면.*교점/);
  }
  const parallel = state('b1-2', 2);
  near(parallel.model.phi, 0); assert.equal(parallel.model.has, false); assert.equal(parallel.model.xHit, null);
  // Q has y=0.9 everywhere while P has y=0, so no point can be common.
  for (const t of [-3, 0, 3]) near(0.9 + t * Math.sin(0), 0.9);
  assert.match(parallel.quiz.choices.find(c => c.ok).t, /평행한 두 평면.*교선이 없다/);
});

test('comparison seeds select the drawn heptagonal and hexagonal pyramids; tetrahedron uses the real sum fallback', () => {
  for (const [index, seed, name, metric, expected] of [[0, 4, '칠각뿔', 'a', 8], [1, 3, '육각뿔', 'b', 12]]) {
    const { s, model, quiz } = state('b1-3', index);
    const left = geometryCount(s.p3ka, s.p3a), right = geometryCount(s.p3kb, s.p3b);
    assert.equal(s.plSeed, seed); assert.equal(left[metric], expected); assert.equal(right[metric], expected);
    assert.equal(model.bn, name); assert.equal(quiz.choices.find(c => c.ok).t, name);
  }
  const tetra = state('b1-3', 2), counts = geometryCount(tetra.s.p3ka, tetra.s.p3a);
  assert.deepEqual(counts, { a: 4, b: 6 }); assert.equal(counts.a + counts.b, 10);
  assert.match(tetra.quiz.stem, /교점의 개수와 교선의 개수의 합/);
  assert.equal(tetra.quiz.choices.find(c => c.ok).v, 10);
});

test('moving C preserves the given total and the distance between actual midpoints', () => {
  for (const index of [0, 1]) {
    for (const time of [0, 1, 5]) {
      const { s, model, quiz } = state('m-mid', index, time);
      const A = 0, B = s.mL, C = s.mC, M = (A + C) / 2, N = (C + B) / 2;
      near(M, model.M); near(N, model.N); near(N - M, 6); near(B - A, 12);
      assert.equal(quiz.choices.find(c => c.ok).v, index === 0 ? N - M : B - A);
    }
    assert.notEqual(state('m-mid', index, 0).s.mC, state('m-mid', index, 1).s.mC);
  }
});

test('quarter and sixth interval calculations match all six original distance questions', () => {
  for (const index of [0, 1, 2]) {
    const twice = state('m-dbl', index), B = twice.s.dL, M = B / 2, N = (M + B) / 2;
    near(N - M, 3); near(N, 9); near(B, 12);
    assert.equal(twice.quiz.choices.find(c => c.ok).v, index === 0 ? N : B);
    const thirds = state('m-tri', index), end = thirds.s.tL, P = end / 3, Q = 2 * end / 3, middle = end / 2;
    near(middle - P, 3); near(Q - middle, 3);
    const answer = index === 0 ? middle - P : index === 1 ? end : Q - middle;
    assert.equal(thirds.quiz.choices.find(c => c.ok).v, answer);
  }
});

test('four-to-one ratio and the midpoint independently give the forward and reverse distances', () => {
  for (const index of [0, 1]) {
    const { s, model, quiz } = state('m-ratio', index), CB = s.rU, AC = s.rK * CB;
    const A = 0, C = AC, B = C + CB, M = (A + C) / 2;
    assert.equal(s.rK, 4); near(AC, 12); near(CB, 3); near(C - M, 6); near(B - M, 9); near(B - A, 15);
    near(model.MB, B - M); near(model.AB, B - A);
    assert.equal(quiz.choices.find(c => c.ok).v, index === 0 ? B - M : B - A);
  }
});

test('the fixed equation has one valid solution and both substituted lengths agree', () => {
  for (const index of [0, 1]) {
    const { s, model, quiz } = state('m-eq', index);
    assert.notEqual(s.eA, s.eC);
    const x = (s.eD - s.eB) / (s.eA - s.eC), AM = s.eA * x + s.eB, MB = s.eC * x + s.eD;
    near(x, 4); near(AM, 17); near(MB, 17); near(AM + MB, 34);
    near(model.x0, x); near(model.AB0, AM + MB);
    assert.equal(quiz.choices.find(c => c.ok).v, index === 0 ? x : AM + MB);
  }
});

test('all twenty-one lessons move actual drawn geometry within the first second', () => {
  let count = 0;
  for (const id of ids) for (const [index] of core.lessonList(lab.def.lessons[id]).entries()) {
    const first = draw(id, index, 0), moved = draw(id, index, 1);
    assert.notEqual(signature(first), signature(moved), `${id}/${index}: actual source geometry moves`);
    assert.equal(moved.value.readouts.length, 0, `${id}/${index}: no computed readouts`);
    for (const key of ['formula', 'rule', 'notes']) assert.ok(!moved.value[key], `${id}/${index}: no computed ${key} panel`);
    count++;
  }
  assert.equal(count, 21);
});

test('computed numbers and final answers appear only on their own caption cues', () => {
  for (const [index, a, b] of [[0, 10, 15], [1, 6, 10], [2, 10, 15]]) {
    gate('b1-1', index, 'plFirstReady', new RegExp(`^교점 a = ${a}개$`));
    gate('b1-1', index, 'plSecondReady', new RegExp(`^교선 b = ${b}개$`));
    gate('b1-1', index, 'plShowAnswer', index === 0 ? /^b − a = 15 − 10 = 5$/ : index === 1 ? /^a \+ b = 6 \+ 10 = 16$/ : /^2b − a = 2×15 − 10 = 20$/);
  }
  gate('b1-1', 2, 'plEquationReady', /^2b = 2 × 15 = 30$/);
  gate('b1-2', 0, 'plShowAnswer', /^교선$/); gate('b1-2', 1, 'plShowAnswer', /^교점$/); gate('b1-2', 2, 'plShowAnswer', /교선 없음/);
  gate('b1-3', 0, 'plShowAnswer', /^칠각뿔$/); gate('b1-3', 1, 'plShowAnswer', /^육각뿔$/); gate('b1-3', 2, 'plShowAnswer', /^교점 \+ 교선 = 10개$/);
  for (const [index, label] of [[0, 'MN = 6 cm'], [1, 'AB = 12 cm']]) gate('m-mid', index, 'plShowAnswer', new RegExp(`^${label}$`));
  for (const index of [0, 1]) gate('m-dbl', index, 'plFirstReady', /^AM = 6 cm$/);
  for (const index of [0, 2]) gate('m-dbl', index, 'plUnitReady', /^MN = 3 cm$/);
  for (const index of [0, 1, 2]) gate('m-dbl', index, 'plShowAnswer', index === 0 ? /^AN = 9 cm$/ : /^AB = 12 cm$/);
  for (const index of [0, 2]) {
    gate('m-tri', index, 'plFirstReady', index === 0 ? /^AP = 6 cm$/ : /^AQ = 12 cm$/);
    gate('m-tri', index, 'plSecondReady', /^AM = 9 cm$/);
  }
  for (const [index, label] of [[0, 'PM = 3 cm'], [1, 'AB = 18 cm'], [2, 'MQ = 3 cm']]) gate('m-tri', index, 'plShowAnswer', new RegExp(`^${label}$`));
  for (const index of [0, 1]) {
    gate('m-ratio', index, 'plFirstReady', /^AC = 12 cm$/); gate('m-ratio', index, 'plUnitReady', /^CB = 3 cm$/);
    gate('m-ratio', index, 'plShowAnswer', index === 0 ? /^MB = 9 cm$/ : /^AB = 15 cm$/);
  }
  gate('m-ratio', 0, 'plSecondReady', /^MC = 6 cm$/);
  for (const index of [0, 1]) {
    gate('m-eq', index, 'plEquationReady', /^4x \+ 1 = 2x \+ 9$/);
    gate('m-eq', index, 'plFirstReady', /^2x = 8$/);
    gate('m-eq', index, 'plXReady', /^x = 4$/);
  }
  gate('m-eq', 1, 'plLengthReady', /^AM = 17 cm$/); gate('m-eq', 1, 'plSecondReady', /^MB = 17 cm$/);
  gate('m-eq', 1, 'plShowAnswer', /^AB = 34 cm$/);
});

test('given lengths remain visible from entry and manual controls keep their existing behavior', () => {
  const givens = [
    ['m-mid', 0, /^AB = 12 cm$/], ['m-mid', 1, /^MN = 6 cm$/],
    ['m-dbl', 0, /^AB = 12 cm$/], ['m-dbl', 1, /^MN = 3 cm$/], ['m-dbl', 2, /^AN = 9 cm$/],
    ['m-tri', 0, /^AB = 18 cm$/], ['m-tri', 1, /^PM = 3 cm$/], ['m-tri', 2, /^AB = 18 cm$/],
    ['m-ratio', 0, /^AB = 15 cm$/], ['m-ratio', 1, /^MC = 6 cm$/],
    ['m-eq', 0, /^AM = \(4x \+ 1\) cm$/], ['m-eq', 1, /^MB = \(2x \+ 9\) cm$/]
  ];
  for (const [id, index, given] of givens) assert.equal(has(draw(id, index, 0, true), given), true, `${id}/${index}: given visible`);
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go('m-mid');
  const midpoint = lab.draw(); assert.ok(midpoint.handles.some(h => h.id === 'C')); assert.ok(has(midpoint, /^MN = 6 cm$/));
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go('m-eq');
  const equation = lab.draw(); assert.ok(equation.handles.some(h => h.id === 'x'));
  assert.ok(has(equation, /^AM = 4x\+1 = 5 cm$/)); assert.ok(has(equation, /^MB = 2x\+9 = 11 cm$/));
});
