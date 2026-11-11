// Focused source-math and production Board safety checks; no visual-audit claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/circle-properties-lesson-runtime.mjs';
const require = createRequire(import.meta.url), video = require('../kit/apl-video-core.js');
const katex = require('../kit/vendor/katex/katex.min.js'), lab = await load();
const counts = { 'c1-1': 4, 'c1-2': 4, 'c1-3': 5, 'c1-4': 4, 'c1-5': 6, 'c1-6': 6, 'c1-7': 4,
  'c2-1': 4, 'c2-2': 7, 'c2-3': 4, 'c2-4': 5, 'c2-5': 7, 'c2-6': 5, 'c2-7': 6 };
const kinds = { 'c1-1': 3, 'c1-2': 2, 'c1-3': 3, 'c1-4': 3, 'c1-5': 4, 'c1-6': 3, 'c1-7': 3,
  'c2-1': 3, 'c2-2': 5, 'c2-3': 3, 'c2-4': 3, 'c2-5': 3, 'c2-6': 3, 'c2-7': 4 };
const ids = Object.keys(counts), plain = x => JSON.parse(JSON.stringify(x));
const first = lesson => lesson.chapters[0].cues[0].set;
const near = (a, b, reason) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)), `${reason}: ${a} ≈ ${b}`);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Read only the small exact-number grammar used by these source choices.
function exactNumber(input) {
  const text = String(input).replace(/\\,\\mathrm\{cm\}/g, '').replace(/\^\{\\circ\}/g, '').replace(/\\pi/g, '').replace(/\s/g, '');
  let i = 0;
  function group() { assert.equal(text[i++], '{'); const value = product(); assert.equal(text[i++], '}'); return value; }
  function atom() {
    if (text.startsWith('\\sqrt', i)) { i += 5; return Math.sqrt(group()); }
    if (text.startsWith('\\frac', i)) { i += 5; return group() / group(); }
    if (text[i] === '{') return group();
    const match = text.slice(i).match(/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)/);
    assert.ok(match, `Unsupported exact choice ${input} at ${text.slice(i)}`);
    i += match[0].length; return Number(match[0]);
  }
  function product() { let value = atom(); while (i < text.length && text[i] !== '}') value *= atom(); return value; }
  const value = product(); assert.equal(i, text.length); return value;
}
function oracle(id, q) {
  switch (id) {
    case 'c1-1': return [Math.sqrt(q.R ** 2 - q.am ** 2), 2 * Math.sqrt(q.R ** 2 - q.om ** 2), Math.hypot(q.am, q.om)][q.kind];
    case 'c1-2': { const r2 = q.a1 ** 2 + q.d1 ** 2; return q.kind ? Math.sqrt(r2 - q.a2 ** 2) : 2 * Math.sqrt(r2 - q.d2 ** 2); }
    case 'c1-3': return [2 * Math.sqrt(q.R ** 2 - q.om ** 2), Math.sqrt(q.R ** 2 - q.am ** 2), Math.hypot(q.am, q.om)][q.kind];
    case 'c1-4': return [q.R ** 2 - q.om ** 2, q.am ** 2, q.R ** 2 - q.am ** 2][q.kind];
    case 'c1-5': return [2 * Math.sqrt(q.R ** 2 - (q.R / 2) ** 2), Math.sqrt(3) * q.R / Math.sqrt(3), q.R / 2, 2 * Math.acos(.5) * 180 / Math.PI][q.kind];
    case 'c1-6': return [2 * q.k / 2, 2 * Math.sqrt((2 * q.k) ** 2 - q.k ** 2), 2 * q.k][q.kind];
    case 'c1-7': return [(q.am ** 2 + q.h ** 2) / (2 * q.h), 2 * Math.sqrt(q.R ** 2 - (q.R - q.h) ** 2), q.R - Math.sqrt(q.R ** 2 - q.am ** 2)][q.kind];
    case 'c2-1': return [Math.hypot(q.R, q.L), Math.sqrt(q.OP ** 2 - q.R ** 2), Math.sqrt(q.OP ** 2 - q.L ** 2)][q.kind];
    case 'c2-2': return [360 - 90 - 90 - q.th, 360 - 90 - 90 - q.th, (180 - q.th) / 2, 180 - (180 - 2 * q.th), (180 - (180 - q.th)) / 2][q.kind];
    case 'c2-3': return q.kind === 0 ? 2 * q.a : q.kind === 1 ? (2 * q.a) / 2 : (q.c + q.d + (2 * q.a - q.c - q.d)) / 2;
    case 'c2-4': { const u = 2 * q.W * (q.W - q.H) / (2 * q.W - q.H), de = Math.hypot(q.H, u); return [u, de, u + de + q.H][q.kind]; }
    case 'c2-5': { const length = Math.sqrt((q.r1 + q.r2) ** 2 - (q.r1 - q.r2) ** 2); return [length, length ** 2 / (4 * q.r1), length / 2][q.kind]; }
    case 'c2-6': { const ratio = q.r / q.R, pa = q.pbFull * ratio; return [pa, pa / ratio, q.pbFull - pa][q.kind]; }
    case 'c2-7': { const height = q.mode === 'ext' ? Math.abs(q.r1 - q.r2) : q.r1 + q.r2; return q.kind < 2 ? Math.sqrt(q.d ** 2 - height ** 2) : Math.hypot(q.len, height); }
    default: assert.fail(id);
  }
}
function init(id, index) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  lab.s.ciPick = { key: 'manual preserved choice', idx: 2 };
  const lesson = lab.def.lessons[id][index];
  return { id, scene: lab.scene, lesson, compiled: video.compileLesson(lesson), base: { ...lab.s } };
}
function state(u, time, base = u.base) {
  const v = video.stateAt(u.compiled, time, { nums: { ...base }, sets: { ...base }, step: base.step, part: base.part });
  return { ...base, ...v.nums, ...v.sets, step: v.step, part: v.part, lessonOn: true, lessonEntry: false, dragging: true, playing: false };
}
function draw(s) { Object.assign(lab.s, s); return lab.draw(); }
const signature = frame => JSON.stringify(frame.paths.map(p => [p.points, p.options]));
const visible = frame => frame.paths.some(p => p.points.length > 1 && (p.options.width || p.options.fill));
const texts = frame => frame.texts.join('\n');
const query = /(?:^|\n)(?:[^\n]*=\s*)?x(?:°)?(?=\n|$)/;

test('A registers 14 scenes / 71 lessons and every source family with valid exact captions', () => {
  let examples = 0, concepts = 0;
  for (const id of ids) {
    const list = lab.def.lessons[id]; assert.equal(list.length, counts[id]);
    assert.deepEqual(video.validateLessonSet(list), { errors: [], warnings: [] }, id);
    const actualKinds = new Set();
    for (const lesson of list) {
      const s = first(lesson);
      assert.equal(s.ciSeed, 0); assert.equal(s.ciShowAnswer, false); assert.equal(s.ciCalculationReady, false); assert.equal('ciPick' in s, false);
      assert.equal(typeof s.ciLessonSource, 'boolean'); assert.ok(Object.isFrozen(s.ciPk));
      if (s.ciLessonProblem) { examples++; actualKinds.add(s.ciPk.kind); } else { concepts++; assert.ok(s.ciAQuestion); }
      for (const chapter of lesson.chapters) for (const cue of chapter.cues) {
        for (const math of String(cue.say || '').matchAll(/\$([^$]+)\$/g)) katex.renderToString(math[1], { throwOnError: true });
        for (const key of Object.keys(cue.to || {})) assert.ok(Number.isFinite(lesson.chapters[0].start[key]), `${id}: ${key} starts explicitly`);
      }
    }
    assert.deepEqual([...actualKinds].sort(), Array.from({ length: kinds[id] }, (_, i) => i), id);
  }
  assert.equal(concepts, 24); assert.equal(examples, 47);
  const radiusCases = lab.def.lessons['c2-5'].filter(l => first(l).ciLessonProblem && first(l).ciPk.kind === 0).map(l => Math.sign(first(l).ciPk.r1 - first(l).ciPk.r2));
  assert.deepEqual([...radiusCases].sort(), [-1, 0, 1], 'both radius orders and the equal-radius rectangle are covered');
});

test('A original answers agree with independent Pythagoras, tangency, angle and similarity calculations', () => {
  for (const id of ids) for (let index = 0; index < counts[id]; index++) {
    const u = init(id, index), s = state(u, 0), sol = lab.api.currentSolution(u.scene.ci, s), q = s.ciPk;
    const choices = sol.question.choices, correct = choices.filter(c => c.ok), expected = oracle(id, q);
    assert.equal(choices.length, 5); assert.equal(correct.length, 1);
    near(sol.value, expected, `${id} solver`); near(correct[0].value, expected, `${id} correct choice`);
    near(exactNumber(correct[0].t), expected, `${id} exact displayed answer`);
    for (const v of sol.question.chk) near(v, expected, `${id} model measurement`);
    if (s.ciLessonProblem) {
      assert.equal(u.lesson.answer, lab.api.NUM[choices.findIndex(c => c.ok)]);
      assert.ok(u.lesson.answerText.includes(correct[0].t));
      assert.ok(u.lesson.chapters.at(-1).cues.at(-1).say.includes(correct[0].t));
    }
    if (id === 'c2-4') {
      const g = sol.model.g; near(dist(g.O, g.T), q.H / 2, 'DE is tangent');
      near(dist(g.D, g.T), dist(g.D, g.Pt), 'equal tangents from D');
      near(dist(g.E, g.T), dist(g.E, g.V), 'equal tangents from E');
    }
    if (id === 'c2-5' || id === 'c2-7') {
      const g = sol.model.g, tangent = { x: g.B.x - g.A.x, y: g.B.y - g.A.y };
      near((g.A.x - g.O1.x) * tangent.x + (g.A.y - g.O1.y) * tangent.y, 0, `${id} tangent at A`);
      near((g.B.x - g.O2.x) * tangent.x + (g.B.y - g.O2.y) * tangent.y, 0, `${id} tangent at B`);
    }
  }
});

test('A production Board replays 574 cue frames with actual first-second motion and fixed original conditions', () => {
  let frames = 0;
  for (const id of ids) for (let index = 0; index < counts[id]; index++) {
    const u = init(id, index), s0 = state(u, 0), start = draw(s0), moving = draw(state(u, .8));
    const pk = plain(s0.ciPk), question = u.scene.question(s0), pick = s0.ciPick, finalTime = u.compiled.length - 6;
    assert.ok(visible(start) && visible(moving), id); assert.notEqual(signature(start), signature(moving), `${id}/${index}: motion before one second`);
    if (s0.ciLessonProblem) {
      const Q = lab.api.currentSolution(u.scene.ci, s0).question;
      for (const [i, choice] of Q.choices.entries()) assert.ok(question.includes(lab.api.NUM[i] + ' ' + (choice.h ?? `$${choice.t}$`)), `${id}: original choice ${i}`);
    }
    const times = [0, .8, 6, 12, 18, 24, 30, ...(u.compiled.length === 48 ? [36, 42, 47.9] : [35.9])];
    for (const t of times) {
      const s = state(u, t), frame = draw(s); frames++;
      assert.ok(visible(frame), id); assert.doesNotMatch(texts(frame), /NaN|undefined|Infinity|\[object Object\]/, id);
      assert.equal(s.ciShowAnswer, t >= finalTime); assert.equal(s.ciPick, pick); assert.deepEqual(plain(s.ciPk), pk); assert.equal(u.scene.question(s), question);
    }
    const end = state(u, u.compiled.length), rewind = state(u, 0, end);
    assert.equal(rewind.ciShowAnswer, false); assert.equal(rewind.ciCalculationReady, false); assert.equal(rewind.ciATrace, 0);
    assert.equal(signature(draw(rewind)), signature(start), `${id}/${index}: replay restores geometry`);
  }
  assert.equal(frames, 574);
});

test('A examples keep x unresolved until the conclusion and theorem concepts hide unrelated numerical queries', () => {
  for (const id of ids) for (let index = 0; index < counts[id]; index++) {
    const u = init(id, index), finalTime = u.compiled.length - 6, s = state(u, 0);
    if (s.ciLessonProblem) {
      assert.match(texts(draw(state(u, finalTime - .1))), query, `${id}/${index}: queried value stays unknown`);
      assert.doesNotMatch(texts(draw(state(u, finalTime))), query, `${id}/${index}: queried value resolves`);
      assert.match(texts(draw({ ...state(u, finalTime), lessonEntry: true })), query, `${id}/${index}: entry cannot reuse final answer`);
    } else if (s.ciAHideQuery) {
      assert.doesNotMatch(texts(draw(s)), query, `${id}/${index}: theorem has no unrelated x`);
      assert.doesNotMatch(texts(draw(state(u, finalTime))), query, `${id}/${index}: theorem keeps its own conclusion`);
    }
  }
  const perimeter = init('c2-4', 4);
  assert.match(texts(draw(state(perimeter, 24))), /둘레=x/);
  assert.doesNotMatch(texts(draw(state(perimeter, 30))), /둘레=x/);
});

test('A folds actual source arcs, labels rectangle tangent points and draws the proved parallel tangents', () => {
  for (const id of ['c1-5', 'c1-6']) for (let index = 0; index < counts[id]; index++) {
    const u = init(id, index);
    assert.equal(state(u, 0).c1f, 0); assert.equal(state(u, 6).c1f, 1);
    assert.notEqual(signature(draw(state(u, 0))), signature(draw(state(u, 6))), id);
  }
  const threeCases = [0, 1, 2].map(index => { const s = state(init('c1-6', index), 30); return Math.sign(2 * s.c1d - s.c1R); });
  assert.deepEqual(threeCases, [-1, 0, 1]);
  const rectangle = init('c2-4', 0), marked = draw(state(rectangle, 6));
  for (const label of ['P', 'V', 'T']) assert.ok(marked.texts.includes(label), `actual tangent point ${label}`);
  const parallel = init('c2-6', 1), s = state(parallel, 12), sol = lab.api.currentSolution(parallel.scene.ci, s), g = sol.model.g;
  const a = { x: g.A.x - g.Op.x, y: g.A.y - g.Op.y }, b = { x: g.B.x - g.O.x, y: g.B.y - g.O.y };
  near(a.x * b.y - a.y * b.x, 0, 'the two source radii are parallel');
  const tangents = draw(s).paths.filter(p => p.options.color === 'amber' && p.options.width === 3);
  assert.equal(tangents.length, 2, 'both actual source tangent segments are present');
  for (const [path, point] of [[tangents[0], g.A], [tangents[1], g.B]]) {
    near((path.points[0].x + path.points[1].x) / 2, point.x, 'tangent passes through contact x');
    near((path.points[0].y + path.points[1].y) / 2, point.y, 'tangent passes through contact y');
  }
  assert.notEqual(signature(draw(state(parallel, 24))), signature(draw(state(parallel, 30))), 'parallel arrow marks appear at conclusion');
});
