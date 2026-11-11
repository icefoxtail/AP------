// Independent geometry/number checks and actual HTML/Board cue smoke tests.
// These tests are not a browser or mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/pythagoras-lesson-runtime.mjs';
const require = createRequire(import.meta.url), video = require('../kit/apl-video-core.js');
const lab = await load();
const ids = ['py6-iso', 'py6-trap', 'py6-rect', 'py7-rect', 'py7-tri', 'py7-refl', 'py7-box', 'py7-cyl', 'py8-quad', 'py8-rectP', 'py8-cross'];
const near = (a, b, why = '') => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const area = points => Math.abs(points.reduce((sum, p, i) => { const q = points[(i + 1) % points.length]; return sum + p.x * q.y - p.y * q.x; }, 0)) / 2;
const perimeter = points => points.reduce((sum, p, i) => sum + distance(p, points[(i + 1) % points.length]), 0);
function foot(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  return { x: a.x + t * dx, y: a.y + t * dy };
}
function reflection(p, a, b) { const f = foot(p, a, b); return { x: 2 * f.x - p.x, y: 2 * f.y - p.y }; }
function numericChoice(quiz) {
  const choice = quiz.choices.find(c => c.ok), fraction = /^\\frac\{(-?\d+)\}\{(\d+)\}$/.exec(choice.t);
  return fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(choice.t);
}
function state(id, index = 0, time) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const source = lab.scene.py, lesson = video.lessonList(lab.def.lessons[id])[index], compiled = video.compileLesson(lesson), initial = { ...lab.s, ...compiled.start };
  const value = video.stateAt(compiled, time ?? compiled.length, { nums: initial, sets: {}, step: 0, part: 0 });
  const s = { ...initial, ...value.nums, ...value.sets, step: value.step, part: value.part, lessonOn: true, lessonEntry: false };
  const q = { ...s, ...s.pyQ }, model = source.model(s.pyLessonProblem ? q : s);
  return { s, source, lesson, compiled, model, quiz: source.prob(source.model(q), q) };
}
function draw(id, index = 0, time, entry = false, stale = false) {
  const value = state(id, index, time);
  Object.assign(lab.s, value.s, { lessonOn: !entry, lessonEntry: entry });
  if (stale) Object.assign(lab.s, { pyShowAnswer: true, pyCalculationReady: true });
  lab.tab = 'review'; return { ...value, frame: lab.draw() };
}
const polygon = (frame, n) => frame.paths.find(p => p.points.length === n && p.options.close && p.options.color === 'ink').points;
const expected = {
  'py6-iso': [12, null, 13], 'py6-trap': [12, 44, null], 'py6-rect': [48 / 5, 24 / 5, 14 / 5],
  'py7-rect': [null, 12, 5, 4], 'py7-tri': [null, 7 / 4, 25 / 4, 15 / 4], 'py7-refl': [null, 13],
  'py7-box': [5], 'py7-cyl': [13, 5], 'py8-quad': [null, 225], 'py8-rectP': [null, 125, 25], 'py8-cross': [null, 125]
};

test('eleven scenes have twenty-nine valid lessons, fixed numeric conditions and complete resets', () => {
  let count = 0;
  for (const id of ids) {
    const result = video.validateLessonSet(lab.def.lessons[id]); assert.deepEqual(result.errors, [], id); assert.deepEqual(result.warnings, [], id);
    for (const [i] of video.lessonList(lab.def.lessons[id]).entries()) {
      count++; const first = state(id, i, 0), end = state(id, i);
      assert.equal(first.s.pyShowAnswer, false); assert.equal(first.s.pyCalculationReady, false); assert.equal(typeof first.s.pyLessonProblem, 'boolean'); assert.equal(first.s.pySeed, 0);
      for (const [key, value] of Object.entries(first.s.pyQ)) {
        assert.equal(typeof value, 'number'); assert.ok(Number.isFinite(value));
        assert.equal(['pyFp', 'pyLt', 'pyRoute', 'pyQr', 'pyFi'].includes(key), false, `${id}: ${key} is not a numerical problem condition`);
      }
      const reveals = end.compiled.cues.filter(c => c.set?.pyShowAnswer === true);
      assert.equal(reveals.length, 1); assert.equal(reveals[0].ch, end.lesson.chapters.length - 1);
      const previous = Object.fromEntries(end.compiled.setKeys.map(key => [key, 'previous playback']));
      const rewind = video.stateAt(end.compiled, 0, { nums: first.s, sets: previous, step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], end.compiled.cues[0].set[key]);
      assert.equal(/[√]|\\sqrt/.test(JSON.stringify(end.lesson)), false, `${id}/${i}: no square-root notation`);
      if (first.s.pyLessonProblem) {
        assert.equal(first.quiz.choices.length, 5); assert.equal(first.quiz.choices.filter(c => c.ok).length, 1);
        near(numericChoice(first.quiz), expected[id][i], `${id}/${i} original answer`);
        const question = first.source.lessonQuestion(first.model, first.s, first.quiz);
        assert.equal(question.includes('undefined'), false); assert.ok(question.includes(first.quiz.stem));
        for (const choice of first.quiz.choices) assert.ok(question.includes(choice.h ?? choice.t ?? choice.p));
      }
    }
  }
  assert.equal(count, 29);
});

test('actual triangle and trapezoid coordinates support height, area and perimeter calculations', () => {
  const tri = polygon(draw('py6-iso', 0, 0).frame, 3);
  near(distance(tri[0], tri[1]), 13); near(distance(tri[0], tri[2]), 13); near(distance(tri[1], tri[2]), 10); near(area(tri), 60);
  near(distance(tri[0], foot(tri[0], tri[1], tri[2])), 12);
  const trapezoid = polygon(draw('py6-trap', 0, 0).frame, 4);
  near(area(trapezoid), 156); near(distance(trapezoid[0], trapezoid[3]), 13);
  const isoTrap = polygon(draw('py6-trap', 1, 0).frame, 4);
  near(perimeter(isoTrap), 44); near(distance(isoTrap[0], isoTrap[3]), 13); near(distance(isoTrap[1], isoTrap[2]), 13);
});

test('perpendicular feet on the actual rectangle diagonal give the three exact rational answers', () => {
  const rect = polygon(draw('py6-rect', 0, 0).frame, 4), [A, B, C, D] = rect, P = foot(A, B, D), Q = foot(C, B, D);
  near(distance(B, D), 10); near(distance(A, P), 24 / 5); near(distance(C, Q), 24 / 5); near(distance(P, Q), 14 / 5);
  near(distance(A, P) + distance(C, Q), 48 / 5);
  for (let i = 0; i < 3; i++) {
    const { model } = state('py6-rect', i); near(model.AP, distance(A, P)); near(model.PQ, distance(P, Q));
  }
});

test('rectangle folding uses actual height/width conditions and a moving reflection across AF', () => {
  const first = state('py7-rect', 3, 0), M = first.model;
  assert.deepEqual(JSON.parse(JSON.stringify(first.s.pyQ)), { pyFoldH: 9, pyFoldW: 15, pyKind: 0 });
  const A = { x: 0, y: 0 }, D = { x: 15, y: 0 }, F = { x: 15, y: 5 }, E = reflection(D, A, F);
  near(E.x, 12); near(E.y, 9); near(distance(A, E), 15); near(distance(F, E), 5); near(M.fc, 4);
  for (const time of [0, 2.5, 5]) {
    const { frame, model } = draw('py7-rect', 3, time), folded = frame.paths.find(p => p.points.length === 3 && p.options.close && p.options.width === 3 && ['sky', 'amber'].includes(p.options.color));
    assert.ok(folded); near(model.p, time / 5);
    const f = foot(D, A, F), cosine = Math.cos(Math.PI * time / 5);
    near(folded.points[1].x, f.x + (D.x - f.x) * cosine); near(folded.points[1].y, f.y + (D.y - f.y) * cosine);
  }
});

test('triangle folding reflects B onto A and preserves the exact requested segments', () => {
  const A = { x: 0, y: -6 }, B = { x: 8, y: 0 }, C = { x: 0, y: 0 }, D = { x: 4, y: -3 }, E = { x: 7 / 4, y: 0 };
  const image = reflection(B, D, E); near(distance(image, A), 0); near(distance(E, A), 25 / 4); near(distance(E, B), 25 / 4); near(distance(C, E), 7 / 4); near(distance(D, E), 15 / 4);
  for (let i = 1; i <= 3; i++) {
    const { model } = state('py7-tri', i); near(model.y, distance(E, A)); near(model.ce, distance(C, E)); near(model.de, distance(D, E));
    const frame = draw('py7-tri', i, 5).frame, folded = frame.paths.find(p => p.points.length === 3 && p.options.close && p.options.width === 3 && p.options.color === 'amber');
    assert.ok(folded); near(distance(folded.points[1], A), 0);
  }
});

test('reflection shortest path uses the height sum and really moves P to the line intersection', () => {
  const A = { x: 0, y: -3 }, B = { x: 12, y: -2 }, image = { x: 0, y: 3 }, x = 12 * 3 / 5;
  near(distance(image, B), 13);
  for (let t = 0; t <= 12; t += 0.25) assert.ok(distance(A, { x: t, y: 0 }) + distance(B, { x: t, y: 0 }) >= 13 - 1e-10);
  near(distance(A, { x, y: 0 }) + distance(B, { x, y: 0 }), 13);
  near(state('py7-refl', 1, 0).model.t, 6); near(state('py7-refl', 1, 5).model.t, 4); near(state('py7-refl', 1, 17).model.t, x);
  near(state('py7-refl', 1).model.tot, 13);
});

test('all three box nets and both cylinder nets use the correct unfolded diagonal', () => {
  for (const [time, expectedSquare] of [[12, 37], [18, 29], [24, 25]]) {
    const { frame } = draw('py7-box', 0, time), diagonal = frame.paths.find(p => p.points.length === 2 && p.options.color === 'amber' && p.options.width === 4.2);
    assert.ok(diagonal); near(distance(diagonal.points[0], diagonal.points[1]) ** 2, expectedSquare);
    assert.equal(frame.texts.includes('x=5'), false);
  }
  assert.equal(draw('py7-box', 0).frame.texts.includes('x=5'), true);
  for (const [i, w, h, length] of [[0, 12, 5, 13], [1, 4, 3, 5]]) {
    const { frame } = draw('py7-cyl', i), net = frame.paths.find(p => p.points.length === 4 && p.options.close && p.options.color === 'ink' && p.options.width === 2.8);
    assert.ok(net); near(distance(net.points[0], net.points[1]), w); near(distance(net.points[1], net.points[2]), h); near(distance(net.points[0], net.points[2]), length);
  }
});

test('all three advanced identities agree with independent distances in the drawn configurations', () => {
  for (const time of [0, 5, 17, 35]) {
    const quad = polygon(draw('py8-quad', 1, time).frame, 4), side = quad.map((p, i) => distance(p, quad[(i + 1) % 4]) ** 2);
    near(side[0], 225); near(side[1], 169); near(side[2], 169); near(side[3], 225); near(side[0] + side[2], side[1] + side[3]);
  }
  for (const i of [0, 1, 2]) for (const time of [0, 5]) {
    const { model: m } = state('py8-rectP', i, time), P = { x: m.x, y: m.y }, A = { x: 0, y: 0 }, B = { x: 0, y: m.H }, C = { x: m.W, y: m.H }, D = { x: m.W, y: 0 };
    near(distance(P, A) ** 2 + distance(P, C) ** 2, distance(P, B) ** 2 + distance(P, D) ** 2);
    if (i) { near(distance(P, B), 10); near(distance(P, D), 5); }
  }
  for (const i of [0, 1]) for (const time of [0, 5]) {
    const { model: m } = state('py8-cross', i, time), B = { x: m.p, y: 0 }, C = { x: 0, y: -m.q }, D = { x: m.m, y: 0 }, E = { x: 0, y: -m.n };
    near(distance(B, E) ** 2 + distance(C, D) ** 2, distance(B, C) ** 2 + distance(D, E) ** 2);
    if (i) { near(distance(B, C), 10); near(distance(D, E), 5); }
  }
});

for (const id of ids) test(`${id}: actual Board remains visible at every cue and final answers are gated`, () => {
  for (const [i] of video.lessonList(lab.def.lessons[id]).entries()) {
    const end = state(id, i), reveal = end.compiled.cues.find(c => c.set?.pyShowAnswer);
    for (const time of [0, ...end.compiled.cues.map(c => c.at), end.compiled.length]) {
      const frame = draw(id, i, time).frame;
      assert.ok(frame.paths.some(p => p.options.color !== null && p.points.length > 1));
      assert.equal(/[√]|\\sqrt|undefined|NaN/.test(frame.texts.join(' ')), false);
    }
    const answer = end.s.pyLessonAnswer;
    assert.equal(draw(id, i, 0, true, true).frame.texts.includes(answer), false, `${id}/${i} entry`);
    assert.equal(draw(id, i, reveal.at - 0.001).frame.texts.includes(answer), false, `${id}/${i} before answer`);
    assert.equal(draw(id, i, reveal.at).frame.texts.includes(answer), true, `${id}/${i} final answer`);
  }
});
