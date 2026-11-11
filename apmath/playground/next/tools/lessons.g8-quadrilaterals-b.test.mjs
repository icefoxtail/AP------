// Original-question math and production Board checks; full mobile/visual QA is deferred.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/quadrilaterals-lesson-runtime.mjs';
const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const lab = await load();
const counts = { 'q3-1': 4, 'q3-2': 4, 'q3-3': 8, 'q3-4': 8, 'q3-5': 8, 'q4-1': 5, 'q4-2': 8 };
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
  const v = core.stateAt(unit.cs, time, { nums: { ...unit.s }, sets: { ...unit.s }, step: 0, part: null });
  return { ...unit.s, ...v.nums, ...v.sets, step: v.step, part: v.part,
    lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(s) { Object.assign(lab.s, s); return lab.draw(); }
function model(unit, s = state(unit, 0)) { const D = unit.scene.qd, M = D.model(s); return D.lessonModel ? D.lessonModel(M, s) : M; }
function quiz(unit, s = state(unit, 0)) { const D = unit.scene.qd; return D.prob(D.model(s), s); }
function answerTime(unit) { return unit.cs.cues.find(c => c.set?.qdShowAnswer === true).at; }
function numberAnswer(unit, expected) { const q = quiz(unit), c = q.choices.filter(x => x.ok); assert.equal(c.length, 1); assert.equal(Number(c[0].p.replace(/[^\d.-]/g, '')), expected); }
function allSides(g) { const p = g.pts || [g.A, g.B, g.C, g.D]; return p.map((q, i) => lab.api.dist(q, p[(i + 1) % 4])); }
function allAngles(g) { const p = g.pts || [g.A, g.B, g.C, g.D]; return p.map((q, i) => lab.api.angBetween(q, p[(i + 3) % 4], p[(i + 1) % 4])); }
const equal = list => list.every(x => Math.abs(x - list[0]) < 1e-7);

test('B covers seven scenes and 45 valid explanations with original state and answer resets', () => {
  assert.equal(Object.values(counts).reduce((a, b) => a + b), 45);
  for (const [id, count] of Object.entries(counts)) {
    const lessons = lab.def.lessons[id]; assert.equal(lessons.length, count, id);
    const report = core.validateLessonSet(lessons); assert.deepEqual(report.errors, [], id); assert.deepEqual(report.warnings, [], id);
    for (const lesson of lessons) {
      const first = lesson.chapters[0].cues[0].set, cs = core.compileLesson(lesson);
      assert.equal(typeof first.qdLessonProblem, 'boolean'); assert.equal(first.qdShowAnswer, false); assert.equal(first.qdCalculationReady, false); assert.equal(first.qdSeed, 0);
      assert.deepEqual(plain(first.qdOrd).sort(), [0, 1, 2, 3, 4]); assert.ok(first.qcPk && typeof first.qcPk === 'object');
      assert.equal(Object.hasOwn(first, 'qdPick'), false); assert.equal(Object.hasOwn(first, 'qdQuestionKey'), false);
      assert.ok(cs.cues.find(c => c.set?.qdShowAnswer === true).at >= cs.chapters.at(-1).at);
      assert.doesNotMatch(JSON.stringify(lesson), /√|\\sqrt|undefined|NaN/);
    }
  }
});

for (const id of Object.keys(counts)) test(`${id}: actual first-second figure movement and five original options`, () => {
  for (let index = 0; index < counts[id]; index++) {
    const u = init(id, index), s0 = state(u, 0), s1 = state(u, .75), a = draw(s0), b = draw(s1);
    assert.ok(visible(a) && visible(b)); assert.notEqual(signature(a), signature(b), id + '/' + index);
    if (s0.qdLessonProblem) {
      const question = u.scene.question(s0), Q = quiz(u, s0);
      assert.equal(Q.choices.length, 5); assert.equal(Q.choices.filter(c => c.ok).length, 1);
      assert.equal(question, u.scene.question(s1));
      for (const [i, c] of Q.choices.entries()) {
        const display = c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p;
        assert.ok(question.includes(lab.api.NUM[i] + ' ' + display), 'visible original option ' + i);
      }
      assert.deepEqual(plain(quiz(u, s1)), plain(Q), 'motion cannot change the actual question');
    }
    assert.doesNotMatch(u.scene.question(s0) + text(a) + text(b), /undefined|NaN|Infinity|√|\\sqrt/);
  }
});

test('q3-1 the rectangle transition and actual 30° diagonal problem give 60° and half of 12', () => {
  for (let i = 0; i < 2; i++) {
    const u = init('q3-1', i), a = model(u), z = model(u, state(u, u.cs.length));
    assert.equal(a.beta, 66); assert.equal(z.beta, 90); assert.equal(z.eq, true);
    allAngles(z.p).forEach(a => near(a, 90)); near(lab.api.dist(z.p.A, z.p.C), lab.api.dist(z.p.B, z.p.D));
  }
  const angle = init('q3-1', 2), M = model(angle), g = M.rr;
  near(lab.api.angBetween(g.B, g.O, g.C), 30); near(lab.api.angBetween(g.O, g.A, g.B), 60);
  near(lab.api.dist(g.O, g.B), lab.api.dist(g.O, g.C)); numberAnswer(angle, 60);
  numberAnswer(init('q3-1', 3), 6);
});

test('q3-2 equal neighboring sides produce perpendicular diagonals and original angle answers', () => {
  for (let i = 0; i < 2; i++) {
    const u = init('q3-2', i), a = model(u), z = model(u, state(u, u.cs.length));
    assert.equal(a.rh, false); assert.equal(z.rh, true); assert.ok(equal(allSides(z.p)));
    near(lab.api.angBetween(z.p.O, z.p.A, z.p.B), 90);
  }
  const u = init('q3-2', 2), M = model(u), g = M.rp;
  near(lab.api.angBetween(g.A, g.B, g.D), 66); near(lab.api.angBetween(g.B, g.A, g.D), 57); numberAnswer(u, 57);
  const v = init('q3-2', 3), N = model(v), h = N.rq;
  near(lab.api.angBetween(h.B, h.A, h.O), 30); near(lab.api.angBetween(h.A, h.B, h.O), 60); numberAnswer(v, 60);
});

test('q3-3 explicitly registers all five parallelogram and two rectangle square-condition objects', () => {
  const entries = Array.from({ length: 7 }, (_, i) => init('q3-3', i + 1));
  assert.deepEqual(entries.slice(0, 5).map(u => state(u, 0).qcPk.c), [0, 1, 2, 3, 4]);
  assert.deepEqual(entries.slice(5).map(u => state(u, 0).qcPk.rc), [0, 1]);
  for (const u of entries) {
    const s = state(u, 0), Q = quiz(u, s);
    assert.equal(Q.choices.findIndex(c => c.ok), 2); assert.match(u.lesson.answer, /^③ /);
    assert.equal(Q.key, quiz(u, state(u, u.cs.length)).key);
    const final = draw(state(u, u.cs.length)); assert.match(text(final), /정사각형/);
  }
  const u = init('q3-3', 0), M = model(u, state(u, u.cs.length));
  assert.equal(M.name, '정사각형'); assert.ok(equal(allSides(M.p))); allAngles(M.p).forEach(a => near(a, 90));
});

test('q3-3 square conditions distinguish a square from a non-square rectangle or rhombus', () => {
  const sq = lab.api.para(4, 4, 90), rect = lab.api.para(7, 4, 90), rhomb = lab.api.para(4, 4, 66);
  const features = g => ({ right: allAngles(g).every(a => Math.abs(a - 90) < 1e-7), sides: equal(allSides(g)), sameDiagonals: Math.abs(lab.api.dist(g.A, g.C) - lab.api.dist(g.B, g.D)) < 1e-7, perp: Math.abs(lab.api.angBetween(g.O, g.A, g.B) - 90) < 1e-7 });
  const conditions = [f => f.right && f.sides, f => f.sameDiagonals && f.perp, f => f.sameDiagonals && f.sides, f => f.right && f.perp, f => f.right && f.perp];
  conditions.forEach(p => { assert.equal(p(features(sq)), true); assert.equal(p(features(rect)), false); assert.equal(p(features(rhomb)), false); });
});

test('q3-4 bisection premise and exact equal-perpendicular non-bisecting counterexample are valid', () => {
  const u = init('q3-4', 0), M = model(u), g = M.g;
  near(lab.api.dist(g.O, g.A), lab.api.dist(g.O, g.C)); near(lab.api.dist(g.O, g.B), lab.api.dist(g.O, g.D));
  near(lab.api.dist(g.A, g.B), lab.api.dist(g.C, g.D)); near(lab.api.dist(g.A, g.D), lab.api.dist(g.B, g.C));
  const v = init('q3-4', 1), N = model(v), h = N.g;
  near(lab.api.dist(h.A, h.C), 8); near(lab.api.dist(h.B, h.D), 8); near(lab.api.angBetween(h.O, h.A, h.B), 90);
  near(lab.api.dist(h.O, h.A), 3); near(lab.api.dist(h.O, h.C), 5);
  assert.equal(N.bi, false); assert.equal(equal(allSides(h)), false);
});

test('q3-4 preserves all three rectangle and three rhombus source conditions', () => {
  const r = Array.from({ length: 3 }, (_, i) => init('q3-4', i + 2)), m = Array.from({ length: 3 }, (_, i) => init('q3-4', i + 5));
  assert.deepEqual(r.map(u => state(u, 0).qcPk.a), [0, 1, 2]); assert.deepEqual(m.map(u => state(u, 0).qcPk.c), [0, 1, 2]);
  for (const u of [...r, ...m]) {
    const s = state(u, 0), Q = quiz(u, s);
    assert.equal(Q.choices.findIndex(c => c.ok), 2); assert.match(u.lesson.answer, /^③ /);
    assert.match(text(draw(state(u, u.cs.length))), s.qcK === 0 ? /직사각형/ : /마름모/);
  }
});

test('q3-5 six source shapes satisfy their actual geometric definitions and inclusive trapezoid convention', () => {
  const ids = ['gen', 'trap', 'para', 'rect', 'rhomb', 'sq'];
  for (let i = 0; i < ids.length; i++) {
    const u = init('q3-5', i), M = model(u), p = M.pts;
    assert.equal(M.k, ids[i]); assert.equal(p.length, 4);
    const parallel = (a, b, c, d) => Math.abs(lab.api.cross(lab.api.sub(b, a), lab.api.sub(d, c))) < 1e-7;
    if (i > 0) assert.ok(parallel(p[0], p[3], p[1], p[2]));
    if (i > 1) { assert.ok(parallel(p[0], p[1], p[3], p[2])); assert.ok(M.mem.includes('trap')); }
    if (ids[i] === 'rect' || ids[i] === 'sq') allAngles({ pts: p }).forEach(a => near(a, 90));
    if (ids[i] === 'rhomb' || ids[i] === 'sq') assert.ok(equal(allSides({ pts: p })));
    if (ids[i] === 'sq') assert.ok(M.mem.includes('rect') && M.mem.includes('rhomb'));
  }
});

test('q3-5 true/false source options and the displayed counterexample are bound to their own question', () => {
  const bad = init('q3-5', 6), Q = quiz(bad);
  assert.equal(Q.choices.findIndex(c => c.ok), 2); assert.equal(Q.choices[2].h, '직사각형은 마름모이다.');
  const g = lab.api.para(7, 4, 90); allAngles(g).forEach(a => near(a, 90)); assert.equal(equal(allSides(g)), false);
  assert.equal(state(bad, bad.cs.length).qdBShape, 'rect');
  const good = init('q3-5', 7), R = quiz(good);
  assert.equal(R.choices.findIndex(c => c.ok), 2); assert.equal(R.choices[2].h, '정사각형은 직사각형이다.');
  assert.equal(state(good, good.cs.length).qdBShape, 'sq');
});

test('q4-1 equal base angles give equal legs and diagonals with the actual 55°/125° values', () => {
  const u = init('q4-1', 0), M = model(u), { A, B, C, D } = M;
  near(lab.api.angBetween(B, A, C), 55); near(lab.api.angBetween(A, B, D), 125);
  near(lab.api.dist(A, B), lab.api.dist(D, C)); near(lab.api.dist(A, C), lab.api.dist(B, D));
  const H = { x: A.x, y: 0 }, I = { x: D.x, y: 0 };
  near(lab.api.dist(A, H), lab.api.dist(D, I)); near(lab.api.angBetween(A, B, H), 35); near(lab.api.angBetween(D, C, I), 35);
  for (const [index, value] of [[2, 125], [3, 55], [4, 13]]) numberAnswer(init('q4-1', index), value);
});

test('q4-2 both actual constructions agree with BC=12, AD=6 and perimeter=30', () => {
  for (let i = 0; i < 8; i++) {
    const u = init('q4-2', i), s = state(u, 0), M = model(u, s);
    near(lab.api.dist(M.A, M.D), 6); near(lab.api.dist(M.A, M.B), 6); near(lab.api.dist(M.B, M.C), 12);
    near(lab.api.angBetween(M.A, M.B, M.D), 120); near(lab.api.angBetween(M.B, M.A, M.C), 60);
    if (s.qdMd === 'par') {
      near(lab.api.dist(M.B, M.E), 6); near(lab.api.dist(M.D, M.E), 6); near(lab.api.dist(M.E, M.C), 6); near(lab.api.dist(M.D, M.C), 6);
    } else {
      near(lab.api.dist(M.B, M.H), 3); near(lab.api.dist(M.C, M.I), 3); near(lab.api.dist(M.H, M.I), 6);
      near(lab.api.angBetween(M.H, M.A, M.B), 90); near(lab.api.angBetween(M.A, M.B, M.H), 30);
    }
    near(allSides(M).reduce((a, b) => a + b), 30);
    if (i >= 2) numberAnswer(u, [12, 12, 6, 6, 30, 30][i - 2]);
  }
});

test('condition questions keep the original given figure until the final-answer chapter', () => {
  for (const [id, indices, label] of [['q3-3', [1, 2, 3, 4, 5, 6, 7], /정사각형/], ['q3-4', [2, 3, 4, 5, 6, 7], /직사각형|마름모/]]) {
    for (const index of indices) {
      const u = init(id, index), time = answerTime(u);
      for (const cue of u.cs.cues.filter(c => c.at < time)) assert.doesNotMatch(text(draw(state(u, cue.at))), label);
      assert.match(text(draw(state(u, u.cs.length))), label);
    }
  }
});

test('numeric unknowns are preserved before the answer and solved in the final Board frame', () => {
  for (const [id, indices] of [['q3-1', [2, 3]], ['q3-2', [2, 3]], ['q4-1', [2, 3, 4]], ['q4-2', [2, 3, 4, 5, 6, 7]]]) {
    for (const index of indices) {
      const u = init(id, index), before = text(draw(state(u, answerTime(u) - .01))), final = text(draw(state(u, u.cs.length)));
      assert.match(before, /(^|\n)x(?:\s*=|\n|$)/, id + '/' + index + ': original unknown');
      assert.doesNotMatch(final, /(^|\n)x(?:\s*=|\n|$)/, id + '/' + index + ': final unknown is replaced');
    }
  }
});

test('the perpendicular-method half lengths and perimeter base are delayed to their calculation cues', () => {
  const u = init('q4-2', 7), half = u.cs.cues.find(c => c.set?.qdBFirstReady), base = u.cs.cues.find(c => c.set?.qdBBaseReady);
  assert.doesNotMatch(text(draw(state(u, half.at - .01))), /(^|\n)3(\n|$)/);
  assert.match(text(draw(state(u, half.at))), /(^|\n)3(\n|$)/);
  assert.doesNotMatch(text(draw(state(u, base.at - .01))), /BC = 12/);
  assert.match(text(draw(state(u, base.at))), /BC = 12/);
  assert.doesNotMatch(text(draw(state(u, base.at))), /둘레 = 30/);
});

test('replay restores the exact original condition objects and options without clearing a manual selection', () => {
  for (const [id, index] of [['q3-3', 5], ['q3-4', 7], ['q3-5', 6], ['q4-2', 7]]) {
    const u = init(id, index), s = state(u, 1), initial = draw(s), q = u.scene.question(s), pick = { key: 'manual-choice', idx: 4 };
    u.s = { ...u.s, qcPk: { unexpected: true }, qdOrd: [4, 3, 2, 1, 0], qcK: 7, qdK: 2, qdUa: 9, qdUl: 10, qcSh: 'gen', qdPick: pick, qdQuestionKey: 'prior-manual-question' };
    const restored = state(u, 1); assert.equal(restored.qdPick, pick); assert.equal(restored.qdQuestionKey, 'prior-manual-question');
    assert.equal(u.scene.question(restored), q); assert.equal(signature(draw(restored)), signature(initial));
    assert.equal(lab.s.qdPick, pick, 'view must not clear the old selection during lesson playback');
  }
});
