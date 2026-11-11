// Original-question math and production Board safety; not a mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/triangles-lesson-runtime.mjs';

const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const lab = await load();
const counts = { 't4-1': 4, 't4-2': 3, 't4-3': 4, 't4-4': 3, 't4-5': 4, 't4-6': 4,
  't5-1': 5, 't5-2': 4, 't5-3': 4, 't5-4': 5, 't5-5': 3, 't5-6': 2, 't5-7': 4 };
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} ≈ ${b}`);
const plain = value => JSON.parse(JSON.stringify(value));
const text = frame => frame.texts.join('\n');
const signature = frame => JSON.stringify(frame.paths.filter(p => p.options.color !== null || p.options.fill).map(p => [p.points, p.options]));
const visible = frame => frame.paths.some(p => p.options.color !== null && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0);
function init(id, index = 0) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  const lesson = lab.def.lessons[id][index];
  return { scene: lab.scene, lesson, cs: core.compileLesson(lesson), s: { ...lab.s } };
}
function state(unit, time) {
  const value = core.stateAt(unit.cs, time, { nums: { ...unit.s }, sets: { ...unit.s }, step: 0, part: null });
  return { ...unit.s, ...value.nums, ...value.sets, step: value.step, part: value.part,
    lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(s) { Object.assign(lab.s, s); return lab.draw(); }
function model(unit, s) { const D = unit.scene.tr, M = D.model(s); return D.lessonModel ? D.lessonModel(M, s) : M; }
function quiz(unit, s = state(unit, 0)) { const D = unit.scene.tr; return D.prob(D.model(s), s); }
function numberAnswer(unit, expected) {
  const Q = quiz(unit), correct = Q.choices.filter(c => c.ok);
  assert.equal(correct.length, 1);
  assert.equal(String(correct[0].p ?? correct[0].h ?? correct[0].t).replace(/[^\d.-]/g, ''), String(expected));
}
function answerTime(unit) { return unit.cs.cues.find(c => c.set?.trShowAnswer === true).at; }

test('B registers 13 original scenes and 49 valid lessons with complete sibling resets', () => {
  assert.equal(Object.values(counts).reduce((a, b) => a + b), 49);
  for (const [id, count] of Object.entries(counts)) {
    const lessons = lab.def.lessons[id]; assert.equal(lessons.length, count, id);
    const report = core.validateLessonSet(lessons); assert.deepEqual(report.errors, [], id); assert.deepEqual(report.warnings, [], id);
    for (const lesson of lessons) {
      const first = lesson.chapters[0].cues[0].set, timeline = core.compileLesson(lesson);
      assert.equal(first.trShowAnswer, false); assert.equal(first.trCalculationReady, false);
      assert.equal(typeof first.trLessonProblem, 'boolean'); assert.equal(first.trSeed, 0);
      assert.deepEqual(plain(first.trOf), [-3, -1, 0, 2, 4]);
      assert.equal(Object.hasOwn(first, 'trPick'), false); assert.equal(Object.hasOwn(first, 'trShow'), false);
      const answer = timeline.cues.find(c => c.set?.trShowAnswer === true);
      assert.ok(answer.at >= timeline.chapters.at(-1).at, id + ': final answer belongs to final chapter');
      assert.doesNotMatch(JSON.stringify(lesson), /√|\\sqrt|NaN|undefined/);
    }
  }
});

for (const id of Object.keys(counts)) test(`${id}: fixed source question and real figure tracing within the first second`, () => {
  for (let index = 0; index < counts[id]; index++) {
    const unit = init(id, index), first = state(unit, 0), moving = state(unit, .75);
    const a = draw(first), b = draw(moving);
    assert.ok(visible(a) && visible(b));
    assert.notEqual(signature(a), signature(b), id + '/' + index + ': actual source segment is traced');
    assert.equal(unit.scene.question(first), unit.scene.question(moving), 'motion does not change given data');
    for (const key of Object.keys(unit.lesson.chapters[0].start).filter(key => key !== 'trBT')) assert.equal(moving[key], first[key], key + ': fixed numeric input');
    assert.doesNotMatch(unit.scene.question(first), /undefined|NaN|Infinity/);
    if (first.trLessonProblem) {
      const Q = quiz(unit, first), question = unit.scene.question(first);
      assert.equal(Q.choices.length, 5); assert.equal(Q.choices.filter(c => c.ok).length, 1);
      for (const [i, c] of Q.choices.entries()) {
        const value = c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p;
        assert.ok(question.includes(`${lab.api.NUM[i]} ${value}`), id + '/' + index + ': visible original choice ' + i);
      }
    }
    assert.doesNotMatch(text(a) + text(b), /undefined|NaN|Infinity|√|\\sqrt/);
  }
});

test('t4-1 RHA geometry matches both distances, the 130° angle and the actual OE=8 given', () => {
  for (let index = 0; index < 4; index++) {
    const unit = init('t4-1', index), M = model(unit, state(unit, 0)), g = M.g;
    near(lab.api.dist(g.P, g.E), lab.api.dist(g.P, g.F));
    near(lab.api.angBetween(g.E, g.O, g.P), 90); near(lab.api.angBetween(g.F, g.O, g.P), 90);
    near(lab.api.angBetween(g.O, g.E, g.P), 25);
    if (index === 1) { near(lab.api.dist(g.P, g.F), 4); numberAnswer(unit, 4); }
    if (index === 2) { near(lab.api.angBetween(g.P, g.E, g.F), 130); numberAnswer(unit, 130); }
    if (index === 3) { near(lab.api.dist(g.O, g.E), 8); near(lab.api.dist(g.O, g.F), 8); numberAnswer(unit, 8); }
  }
});

test('t4-2 equal perpendicular distances imply equal halves of the 50° angle', () => {
  for (let index = 1; index < 3; index++) {
    const unit = init('t4-2', index), M = model(unit, state(unit, 0)), g = M.g;
    near(lab.api.dist(g.P, g.E), lab.api.dist(g.P, g.F));
    near(lab.api.angBetween(g.O, g.X, g.Y), 50);
    near(lab.api.angBetween(g.O, g.E, g.P), 25); near(lab.api.angBetween(g.O, g.P, g.F), 25);
    numberAnswer(unit, 25);
  }
});

test('t4-3 lesson geometry obeys the actual given 7 cm and 30° in each variant', () => {
  for (let index = 0; index < 4; index++) {
    const unit = init('t4-3', index), M = model(unit, state(unit, 0));
    near(lab.api.dist(M.A, M.Mm), lab.api.dist(M.B, M.Mm));
    near(lab.api.angBetween(M.Mm, M.A, M.Pp), 90);
    near(lab.api.dist(M.Pp, M.A), lab.api.dist(M.Pp, M.B));
    if (index < 2) near(lab.api.dist(M.Pp, M.A), 7);
    if (index === 1) numberAnswer(unit, 7);
    if (index === 2) { near(lab.api.angBetween(M.A, M.Pp, M.B), 30); near(lab.api.angBetween(M.B, M.Pp, M.A), 30); numberAnswer(unit, 30); }
    if (index === 3) { near(lab.api.angBetween(M.Pp, M.A, M.Mm), 30); near(lab.api.angBetween(M.Pp, M.A, M.B), 60); numberAnswer(unit, 60); }
  }
});

test('t4-4 actual triangle areas and perpendicular heights agree with the 5:4 question', () => {
  for (let index = 0; index < 3; index++) {
    const unit = init('t4-4', index), M = model(unit, state(unit, 0)), g = M.questionGeo;
    const a = Math.abs(lab.api.polyArea([g.A, g.B, g.D])), b = Math.abs(lab.api.polyArea([g.A, g.C, g.D]));
    near(a, 5); near(b, 4); near(a / b, lab.api.dist(g.A, g.B) / lab.api.dist(g.A, g.C));
    near(lab.api.dist(g.D, g.E), lab.api.dist(g.D, g.F));
    if (index > 0) numberAnswer(unit, index === 1 ? 4 : 5);
  }
});

test('t4-5 actual five-point shortest segment and oblique-distance trap retain the correct source answer', () => {
  const unit = init('t4-5', 1), s = state(unit, 0), M = model(unit, s);
  const lengths = M.of.map(x => Math.hypot(x, 3));
  assert.equal(lengths.indexOf(Math.min(...lengths)), 2);
  assert.match(quiz(unit).choices.find(c => c.ok).h, /PC/);
  for (const index of [2, 3]) {
    const u = init('t4-5', index), m = model(u, state(u, 0)), g = m.g;
    near(lab.api.dist(g.P, g.E), 4); near(lab.api.dist(g.P, g.F), 4);
    assert.ok(lab.api.dist(g.P, m.Q) > lab.api.dist(g.P, g.E)); numberAnswer(u, 4);
  }
});

test('t4-6 RHS conclusions match both angles and the corresponding 7 cm side', () => {
  for (const [index, answer] of [[1, 50], [2, 50], [3, 7]]) {
    const unit = init('t4-6', index), M = model(unit, state(unit, 0));
    const B = { x: 0, y: 0 }, C = { x: 2, y: 0 }, A = { x: 1, y: -Math.tan(50 * Math.PI / 180) }, mid = { x: 1, y: 0 };
    const D = lab.api.foot(mid, A, B), E = lab.api.foot(mid, A, C);
    near(lab.api.dist(mid, D), lab.api.dist(mid, E));
    near(lab.api.angBetween(A, B, C), 80); near(lab.api.angBetween(B, A, C), 50);
    assert.equal(M.b, 50); assert.equal(M.c, 50); numberAnswer(unit, answer);
  }
});

test('t5-1 all radii and original five property statements are checked against actual geometry', () => {
  for (const [index, value] of [[2, 6], [3, 35]]) { const u = init('t5-1', index); numberAnswer(u, value); }
  const unit = init('t5-1', 4), s = state(unit, 0), M = model(unit, s), g = M.g, Q = quiz(unit, s);
  near(lab.api.dist(g.O, g.A), lab.api.dist(g.O, g.B)); near(lab.api.dist(g.O, g.B), lab.api.dist(g.O, g.C));
  near(lab.api.angBetween(g.D, g.O, g.B), 90); near(lab.api.dist(g.B, g.D), lab.api.dist(g.C, g.D));
  near(lab.api.angBetween(g.A, g.O, g.B), lab.api.angBetween(g.B, g.O, g.A));
  near(lab.api.angBetween(g.O, g.A, g.B), 110); near(lab.api.angBetween(g.O, g.B, g.C), 120);
  assert.equal(Q.choices.findIndex(c => c.ok), 1); assert.match(Q.choices[1].h, /angle AOB=.*angle BOC/);
  const inspected = unit.cs.cues.filter(c => c.step >= 3 && c.step <= 7).map(c => c.step);
  for (const step of [3, 5, 6, 7, 4]) assert.ok(inspected.includes(step), 'all five source statements receive a drawing cue');
  const counterexample = unit.cs.cues.find(c => c.step === 4); assert.ok(counterexample.at >= unit.cs.chapters.at(-1).at);
});

test('t5-2 right-angle geometry proves midpoint/radius and the 40° angle', () => {
  for (const [index, value] of [[1, 4], [2, 40], [3, 8]]) {
    const unit = init('t5-2', index), M = model(unit, state(unit, 0)), g = M.g;
    near(lab.api.angBetween(g.C, g.A, g.B), 90); near(lab.api.angBetween(g.A, g.B, g.C), 50);
    near(lab.api.angBetween(g.C, g.O, g.B), 40);
    near(lab.api.dist(g.A, g.O), lab.api.dist(g.O, g.B)); near(lab.api.dist(g.O, g.C), lab.api.dist(g.A, g.B) / 2);
    numberAnswer(unit, value);
  }
});

test('t5-3 the 30° construction really makes OBC equilateral and answers 5, 10, 15', () => {
  for (const [index, value] of [[1, 5], [2, 10], [3, 15]]) {
    const unit = init('t5-3', index), M = model(unit, state(unit, 0)), g = M.g;
    near(lab.api.angBetween(g.A, g.B, g.C), 30); near(lab.api.angBetween(g.C, g.A, g.B), 90);
    near(lab.api.dist(g.B, g.C), lab.api.dist(g.O, g.B)); near(lab.api.dist(g.O, g.C), lab.api.dist(g.O, g.B));
    near(lab.api.angBetween(g.O, g.B, g.C), 60); numberAnswer(unit, value);
  }
});

test('t5-4 all three original angle questions match the drawn 35°, 30°, 25° and central angle', () => {
  for (const [index, value] of [[2, 35], [3, 120], [4, 55]]) {
    const unit = init('t5-4', index), M = model(unit, state(unit, 0)), g = M.g;
    near(lab.api.angBetween(g.A, g.O, g.B), 35); near(lab.api.angBetween(g.B, g.O, g.C), 30); near(lab.api.angBetween(g.C, g.O, g.A), 25);
    near(lab.api.angBetween(g.O, g.B, g.C), 120); near(lab.api.angBetween(g.C, g.A, g.B), 55);
    near(M.x + M.y + M.z, 90); numberAnswer(unit, value);
  }
});

test('t5-5 actual obtuse geometry puts the center outside and gives the smaller 136° angle', () => {
  for (const [index, value] of [[1, 136], [2, 112]]) {
    const unit = init('t5-5', index), M = model(unit, state(unit, 0)), g = M.g;
    near(lab.api.angBetween(g.A, g.B, g.C), 112); near(lab.api.angBetween(g.O, g.B, g.C), 136);
    const cross = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
    assert.ok(cross(g.B, g.C, g.A) * cross(g.B, g.C, g.O) < 0, 'A and O are on opposite sides of BC');
    numberAnswer(unit, value);
  }
});

test('t5-6 ratio 2:3:4 produces three valid central angles and the actual 40° inscribed angle', () => {
  const unit = init('t5-6', 1), M = model(unit, state(unit, 0)), g = M.g;
  assert.deepEqual([M.ab, M.bc, M.ca], [80, 120, 160]); assert.equal(M.adj, false);
  near(lab.api.angBetween(g.O, g.A, g.B), 80); near(lab.api.angBetween(g.C, g.A, g.B), 40);
  assert.equal(M.ab + M.bc + M.ca, 360); numberAnswer(unit, 40);
});

test('t5-7 perimeter 16 minus chord 6 gives R=5 and circle perimeter 10π', () => {
  for (const [index, value] of [[2, 5], [3, 10]]) {
    const unit = init('t5-7', index), M = model(unit, state(unit, 0));
    assert.equal(M.per, 16); assert.equal(M.a, 6); assert.equal(M.per - M.a, 2 * M.R);
    assert.equal(M.R, 5); assert.equal(M.circ, 10); assert.ok(M.a < 2 * M.R);
    numberAnswer(unit, value);
  }
});

test('target angle labels and the false-property counterexample appear only after the final answer cue', () => {
  const cases = [['t4-1', 2, /130°/], ['t4-3', 3, /60°/], ['t5-1', 3, /35°/], ['t5-1', 4, /110°|120°/],
    ['t5-4', 2, /35°/], ['t5-4', 3, /120°/], ['t5-4', 4, /55°/], ['t5-5', 1, /136°/], ['t5-5', 2, /112°/], ['t5-7', 3, /10π/]];
  for (const [id, index, pattern] of cases) {
    const unit = init(id, index), time = answerTime(unit);
    for (const cue of unit.cs.cues.filter(c => c.at < time)) assert.doesNotMatch(text(draw(state(unit, cue.at))), pattern, id + ': answer not drawn before its cue');
    assert.match(text(draw(state(unit, unit.cs.length))), pattern, id + ': final source label exists');
  }
});

test('the intermediate radius is hidden until its own cue in the circle-perimeter question', () => {
  const unit = init('t5-7', 3), radiusCue = unit.cs.cues.find(c => c.step === 5), answer = answerTime(unit);
  assert.ok(radiusCue.at < answer);
  assert.doesNotMatch(text(draw(state(unit, radiusCue.at - .01))), /R = 5 cm/);
  assert.match(text(draw(state(unit, radiusCue.at))), /R = 5 cm/);
  assert.doesNotMatch(text(draw(state(unit, radiusCue.at))), /10π/);
});

test('concept entry headings and legends do not announce the location or angle-sum answer', () => {
  for (const [id, index, pattern] of [['t4-2', 0, /이면 이등분선/], ['t4-5', 0, /거리는 수선/], ['t5-2', 0, /빗변.*중점/], ['t5-4', 0, /x\+y\+z=90/], ['t5-5', 0, /바깥|밖에/]]) {
    const unit = init(id, index), s = { ...state(unit, 0), lessonOn: false, lessonEntry: true };
    assert.doesNotMatch(unit.scene.title, pattern); assert.doesNotMatch(text(draw(s)), pattern);
  }
});

test('replaying fixed B scenes restores original variants and point arrays without clearing manual choices', () => {
  for (const [id, index] of [['t4-5', 1], ['t4-3', 3], ['t5-1', 4], ['t5-4', 4], ['t5-7', 3]]) {
    const unit = init(id, index), fixed = state(unit, 1), question = unit.scene.question(fixed), original = draw(fixed);
    const pick = { key: 'manual-answer', idx: 3 };
    unit.s = { ...unit.s, trOf: [-4, -3, -2, 0, 2], trBh: 40, trM: 9, trV: 9, trOa: 70, trOb: 50, trSr: 8, trSa: 3, trPick: pick, trShow: 'manual-open' };
    const restored = state(unit, 1);
    assert.equal(restored.trPick, pick); assert.equal(restored.trShow, 'manual-open');
    assert.equal(unit.scene.question(restored), question);
    assert.equal(signature(draw(restored)), signature(original));
  }
});
