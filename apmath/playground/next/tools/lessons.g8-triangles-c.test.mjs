// Minimal source/math/production-Board checks; this is not a mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/triangles-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const counts = { 't6-1': 5, 't6-2': 3, 't6-3': 4, 't6-4': 3, 't6-5': 5, 't6-6': 3, 't6-7': 4, 't6-8': 4, 't7-1': 5, 't7-2': 4, 't7-3': 7, 't7-4': 5, 't7-5': 5 };
const ids = Object.keys(counts);
const expected = {
  't6-1': [null, null, 32, 3, '④'], 't6-2': [null, 84, 4], 't6-3': [null, 4, 3, 24],
  't6-4': [null, 2, 10], 't6-5': [null, null, 122, 64, 64], 't6-6': [null, 16, 16],
  't6-7': [null, 60, 90, null], 't6-8': [null, 4, 5, 3], 't7-1': [null, 6, 38, 12, 30],
  't7-2': [null, null, '25\\pi-24\\text{ cm}^2', 7], 't7-3': [null, null, null, null, null, '③', '①'],
  't7-4': [null, null, 6, 3, 9], 't7-5': [null, null, 6, 3, '⑤']
};
const near = (a, b, why = '') => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const area = pts => Math.abs(pts.reduce((sum, p, i) => { const q = pts[(i + 1) % pts.length]; return sum + p.x * q.y - p.y * q.x; }, 0)) / 2;
const perimeter = pts => pts.reduce((sum, p, i) => sum + distance(p, pts[(i + 1) % pts.length]), 0);
const cross = (a, b, p) => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
function inside(p, g) { const signs = [cross(g.A, g.B, p), cross(g.B, g.C, p), cross(g.C, g.A, p)]; return signs.every(x => x > 1e-9) || signs.every(x => x < -1e-9); }
function foot(p, a, b) { const dx = b.x - a.x, dy = b.y - a.y, t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy); return { x: a.x + t * dx, y: a.y + t * dy }; }
function angle(v, a, b) { const ax = a.x - v.x, ay = a.y - v.y, bx = b.x - v.x, by = b.y - v.y; return Math.acos(Math.max(-1, Math.min(1, (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by))))) * 180 / Math.PI; }
function incenter(A, B, C) { const a = distance(B, C), b = distance(C, A), c = distance(A, B), p = a + b + c; return { x: (a * A.x + b * B.x + c * C.x) / p, y: (a * A.y + b * B.y + c * C.y) / p }; }
const clean = text => String(text).replace(/\s/g, '');
function state(id, index = 0, time) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const source = lab.scene.tr, lesson = video.lessonList(lab.def.lessons[id])[index], compiled = video.compileLesson(lesson), initial = { ...lab.s, ...compiled.start };
  const value = video.stateAt(compiled, time ?? compiled.length, { nums: initial, sets: {}, step: 0, part: 0 });
  const s = { ...initial, ...value.nums, ...value.sets, step: value.step, part: value.part, lessonOn: true, lessonEntry: false };
  const model = source.model(s);
  return { s, source, model, lesson, compiled, quiz: source.prob(model, s) };
}
function draw(id, index = 0, time, entry = false) {
  const value = state(id, index, time);
  Object.assign(lab.s, value.s, { lessonOn: !entry, lessonEntry: entry });
  if (entry) Object.assign(lab.s, { step: 99, trShowAnswer: true, trCalculationReady: true });
  lab.tab = 'review'; return { ...value, frame: lab.draw() };
}
function polygon(frame) {
  const p = frame.paths.find(p => p.points.length === 3 && p.options.close && p.options.color === 'ink');
  assert.ok(p, 'production Board draws the triangle outline'); return p.points;
}

test('thirteen scenes register fifty-seven independent valid lessons with source questions and complete replay resets', () => {
  let total = 0;
  for (const id of ids) {
    const list = video.lessonList(lab.def.lessons[id]), validation = video.validateLessonSet(list);
    assert.equal(list.length, counts[id]); assert.deepEqual(validation.errors, [], id); assert.deepEqual(validation.warnings, [], id);
    for (const [i] of list.entries()) {
      total++; const first = state(id, i, 0), end = state(id, i), set = first.lesson.chapters[0].cues[0].set;
      assert.equal(typeof set.trLessonProblem, 'boolean'); assert.equal(set.trShowAnswer, false); assert.equal(set.trCalculationReady, false); assert.equal(set.trSeed, 0);
      const reveal = end.compiled.cues.filter(c => c.set?.trShowAnswer === true);
      assert.equal(reveal.length, 1); assert.equal(reveal[0].ch, end.lesson.chapters.length - 1);
      const stale = Object.fromEntries(end.compiled.setKeys.map(key => [key, 'previous playback']));
      const rewind = video.stateAt(end.compiled, 0, { nums: first.s, sets: stale, step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], set[key], `${id}/${i}: ${key}`);
      assert.equal(/[√]|\\sqrt/.test(JSON.stringify(first.lesson)), false);
      if (first.s.trLessonProblem) {
        assert.equal(first.quiz.choices.length, 5); assert.equal(first.quiz.choices.filter(c => c.ok).length, 1);
        assert.equal(first.quiz.key, end.quiz.key); assert.equal(first.quiz.stem, end.quiz.stem);
        const wanted = expected[id][i], correct = first.quiz.choices.find(c => c.ok);
        if (typeof wanted === 'number') near(Number.parseFloat(correct.p), wanted, `${id}/${i}`);
        else if ('①②③④⑤'.includes(wanted)) assert.equal('①②③④⑤'[first.quiz.choices.findIndex(c => c.ok)], wanted);
        else assert.equal(correct.p, wanted);
        const html = lab.scene.question(first.s);
        assert.equal(html.includes('undefined'), false); assert.ok(html.includes(first.quiz.stem));
        for (const choice of first.quiz.choices) assert.ok(html.includes(choice.h ?? choice.t ?? choice.p), `${id}/${i}: original choice preserved`);
        for (const marker of '①②③④⑤') assert.equal(html.split(marker).length - 1, 1, `${id}/${i}: no duplicated choices`);
      } else assert.ok(first.s.trCQuestion, `${id}/${i}: focused concept question`);
    }
  }
  assert.equal(total, 57);
});

test('incenter distances, half angles, areas, and contact segments agree with independent coordinate geometry', () => {
  const g = state('t6-1', 2).model.g, I = incenter(g.A, g.B, g.C);
  near(distance(I, g.I), 0); near(angle(g.A, g.B, g.I), 32); near(angle(g.A, g.I, g.C), 32);
  const r = distance(I, foot(I, g.B, g.C)); near(distance(I, foot(I, g.C, g.A)), r); near(distance(I, foot(I, g.A, g.B)), r);
  const triangle = polygon(draw('t6-2', 1, 0).frame), [A, B, C] = triangle, J = incenter(A, B, C);
  near(distance(B, C), 13); near(distance(C, A), 14); near(distance(A, B), 15); near(area(triangle), 84); near(distance(J, foot(J, B, C)), 4);
  for (const [id, expectedSegments] of [['t6-3', [4, 3, 5]], ['t6-8', [4, 5, 3]]]) {
    const { g } = state(id, 1).model;
    near(distance(g.A, g.F), expectedSegments[0]); near(distance(g.A, g.E), expectedSegments[0]);
    near(distance(g.B, g.D), expectedSegments[1]); near(distance(g.B, g.F), expectedSegments[1]);
    near(distance(g.C, g.D), expectedSegments[2]); near(distance(g.C, g.E), expectedSegments[2]);
  }
  const tangents = state('t6-3', 3).model.g; near(perimeter([tangents.A, tangents.B, tangents.C]), 24);
});

test('right-triangle inradius follows the actual square and tangent geometry', () => {
  const { g } = state('t6-4', 1).model;
  near(angle(g.C, g.A, g.B), 90); near(distance(g.B, g.C), 6); near(distance(g.C, g.A), 8); near(distance(g.A, g.B), 10);
  for (const [p, q] of [[g.C, g.D], [g.D, g.I], [g.I, g.E], [g.E, g.C]]) near(distance(p, q), 2);
  near(distance(g.I, foot(g.I, g.A, g.B)), 2); near(distance(g.A, g.F), 6); near(distance(g.B, g.F), 4);
  near(area([g.A, g.B, g.C]), 24);
});

test('incenter angle lessons use correct opposite-vertex correspondences and independent angle sums', () => {
  const g = state('t6-5', 2).model.g;
  near(angle(g.A, g.B, g.C), 64); near(angle(g.B, g.A, g.C), 48); near(angle(g.C, g.A, g.B), 68);
  near(angle(g.I, g.B, g.C), 122);
  near(angle(g.A, g.B, g.I) + angle(g.B, g.C, g.I) + angle(g.C, g.A, g.I), 90);
  const h = state('t6-7', 1).model.g;
  near(angle(h.I, h.A, h.B), 105); near(angle(h.I, h.B, h.C), 120); near(angle(h.I, h.C, h.A), 135);
  near(angle(h.A, h.B, h.C), 60); near(angle(h.B, h.A, h.C), 90); near(angle(h.C, h.A, h.B), 30);
  near(angle(h.I, h.A, h.B) + angle(h.I, h.B, h.C) + angle(h.I, h.C, h.A), 360);
});

test('parallel through the actual incenter gives two isosceles triangles and the correct small perimeter', () => {
  const M = state('t6-6', 1).model, { A, B, C, I } = M.g;
  near((M.E.x - M.D.x) * (C.y - B.y) - (M.E.y - M.D.y) * (C.x - B.x), 0);
  near(distance(M.D, B), distance(M.D, I)); near(distance(M.E, C), distance(M.E, I));
  near(perimeter([A, M.D, M.E]), 16); near(distance(A, B) + distance(A, C), 16);
  near(perimeter([A, B, C]), 24); near(distance(B, C), 8);
});

test('isosceles O and I angles and the equilateral special question match the drawn geometry', () => {
  const g = state('t7-1', 1).model.g;
  near(distance(g.A, g.B), distance(g.A, g.C)); near(angle(g.A, g.B, g.C), 52);
  near(angle(g.B, g.C, g.O), 38); near(angle(g.B, g.C, g.I), 32); near(angle(g.B, g.O, g.I), 6);
  near(angle(g.O, g.B, g.C), 104); near(angle(g.I, g.B, g.C), 116);
  near(g.O.x, g.I.x); near(g.O.x, g.A.x);
  const equilateral = state('t7-1', 4); near(distance(equilateral.model.g.O, equilateral.model.g.I), 0);
  near(angle(equilateral.model.g.B, equilateral.model.g.I, equilateral.model.g.C), 30);
  assert.match(equilateral.quiz.stem, /∠IBC/); assert.doesNotMatch(equilateral.quiz.stem, /∠OBI/);
});

test('right triangle circumradius, inradius, and shaded-area coefficient are independently correct', () => {
  const [A, B, C] = polygon(draw('t7-2', 2, 0).frame), O = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }, I = incenter(A, B, C);
  near(angle(C, A, B), 90); near(distance(A, B), 10);
  const R = distance(O, A), r = distance(I, foot(I, B, C)); near(R, 5); near(r, 2); near(R + r, 7);
  near(distance(O, B), R); near(distance(O, C), R); near(R * R, 25); near(area([A, B, C]), 24);
  assert.ok(Math.PI * R * R - area([A, B, C]) > 0);
});

test('five property concepts use real counterexamples; moving the triangle preserves an interior incenter', () => {
  for (const index of [0, 1, 3]) {
    const { g } = state('t7-3', index).model;
    near(distance(g.O, g.A), distance(g.O, g.B)); near(distance(g.O, g.B), distance(g.O, g.C));
    near(distance(g.I, foot(g.I, g.A, g.B)), distance(g.I, foot(g.I, g.B, g.C)));
    assert.ok(Math.abs(distance(g.I, g.A) - distance(g.I, g.B)) > 0.01);
  }
  for (const [time, apex, outside] of [[0, 70, false], [5, 90, true], [17, 110, true]]) {
    const { model, frame } = draw('t7-3', 2, time);
    near(angle(model.g.A, model.g.B, model.g.C), apex); assert.equal(inside(model.g.O, model.g), !outside); assert.equal(inside(model.g.I, model.g), true);
    assert.ok(frame.paths.length > 0);
  }
  for (const time of [0, 12, 17, 36]) assert.equal(inside(state('t7-3', 4, time).model.g.I, state('t7-3', 4, time).model.g), true);
  const p = state('t7-3', 5).model.pg;
  near(angle(p.O, p.B, p.C), 140); near(angle(p.I, p.B, p.C), 145); assert.equal(inside(p.O, p), false); assert.equal(inside(p.I, p), true);
});

test('equilateral radius ratio follows independent distances in the production Board triangle', () => {
  const [A, B, C] = polygon(draw('t7-4', 2, 0).frame), I = incenter(A, B, C), D = foot(I, B, C), R = distance(I, A), r = distance(I, D);
  near(distance(A, B), distance(B, C)); near(distance(B, C), distance(C, A)); near(angle(B, I, D), 30); near(angle(D, I, B), 90);
  near(R / r, 2); near(distance(A, D) / r, 3);
  near(R * 3 / r, 6); near(r * 6 / R, 3); near(distance(A, D) * 3 / r, 9);
});

test('the circumcenter foot is a midpoint, while the incenter problem uses its actual unequal tangent segments', () => {
  const M = state('t7-5', 2).model;
  near(distance(M.B, M.DO), distance(M.DO, M.C)); near(distance(M.B, M.DO) / distance(M.B, M.C), .5);
  assert.ok(Math.abs(distance(M.B, M.DI) - distance(M.DI, M.C)) > .01);
  const [A, B, C] = polygon(draw('t7-5', 3, 0).frame), I = incenter(A, B, C), D = foot(I, B, C), scale = 8 / distance(B, C);
  near(distance(A, B) * scale, 7); near(distance(C, A) * scale, 9);
  near(distance(B, D) * scale, 3); near(distance(D, C) * scale, 5);
  assert.notEqual(distance(B, D), distance(D, C));
});

test('manual isosceles special cases correctly allow an incenter foot to be a midpoint', () => {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go('t7-5');
  Object.assign(lab.s, { trMs: 40, trMt: 70, trX: [4, 5, 5], trV: 1 });
  const D = lab.scene.tr, M = D.model(lab.s), Q = D.prob(M, lab.s), trap = D.solve.steps(M, lab.s).find(st => st.k === 'trap');
  near(distance(M.B, M.DI), distance(M.C, M.DI));
  near(Number.parseFloat(Q.choices.find(c => c.ok).p), 5);
  assert.match(trap.t, /AB=AC/); assert.match(trap.cap, /BD=CD=5/); assert.doesNotMatch(trap.t, /구하면 틀려요/);
  assert.match(D.steps(M)[1], /중점이에요/);
  assert.ok(D.view(M).readouts.some(r => JSON.stringify(r).includes('BD = CD')));
  lab.tab = 'review'; lab.s.step = D.solve.steps(M, lab.s).length;
  assert.ok(lab.draw().texts.some(text => text.includes('BD=CD=5')));
});

for (const id of ids) test(`${id}: all authored cues draw finite geometry and expose the final caption only at the answer cue`, () => {
  for (const [i] of video.lessonList(lab.def.lessons[id]).entries()) {
    const end = state(id, i), reveal = end.compiled.cues.find(c => c.set?.trShowAnswer === true), caption = clean(reveal.set.trCCap);
    for (const time of [0, ...end.compiled.cues.map(c => c.at), end.compiled.length]) {
      const frame = draw(id, i, time).frame;
      assert.ok(frame.paths.some(p => p.points.length > 1)); assert.equal(/undefined|NaN/.test(frame.texts.join(' ')), false);
      assert.equal(frame.value.readouts.length, 0); assert.equal(frame.value.formula, null);
    }
    assert.equal(clean(draw(id, i, 0, true).frame.texts.join('')).includes(caption), false, `${id}/${i}: entry ignores stale reveal flags`);
    assert.equal(clean(draw(id, i, reveal.at - .001).frame.texts.join('')).includes(caption), false, `${id}/${i}: answer not shown early`);
    assert.equal(clean(draw(id, i, reveal.at).frame.texts.join('')).includes(caption), true, `${id}/${i}: final caption present`);
  }
});

test('manual exploration, source problem rerolls, and recorded choice state remain available after a lesson', () => {
  for (const id of ids) {
    const start = state(id, 0, 0); Object.assign(lab.s, start.s, { trPick: 2, trShow: 'kept' });
    const end = video.stateAt(start.compiled, start.compiled.length, { nums: lab.s, sets: {}, step: 0, part: 0 });
    Object.assign(lab.s, end.nums, end.sets, { step: end.step, lessonOn: true, lessonEntry: false });
    assert.equal(lab.s.trPick, 2); assert.equal(lab.s.trShow, 'kept');
    lab.s.lessonOn = false; lab.tab = 'explore'; const manual = lab.draw(); assert.ok(manual.paths.length > 0); assert.ok(manual.value.guide);
    lab.newProblem(); assert.equal(lab.s.trPick, null); assert.equal(lab.s.trShow, null);
    const M = lab.scene.tr.model(lab.s), Q = lab.scene.tr.prob(M, lab.s);
    assert.equal(Q.choices.length, 5); assert.equal(Q.choices.filter(c => c.ok).length, 1);
    lab.tab = 'problem'; assert.ok(lab.draw().paths.length > 0);
  }
});
