// Original questions + independent coordinate arithmetic + production HTML/Board.
// These checks do not claim real-browser, mobile layout, or independent visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/circle-properties-lesson-runtime.mjs';
const require = createRequire(import.meta.url), video = require('../kit/apl-video-core.js');
const katex = require('../kit/vendor/katex/katex.min.js');
const lab = await load(), G = lab.api;
const counts = { 'c3-1': 5, 'c3-2': 4, 'c3-3': 5, 'c3-4': 4, 'c3-5': 4, 'c3-6': 5,
  'c4-1': 6, 'c4-2': 5, 'c4-3': 5, 'c4-4': 4, 'c4-5': 7, 'c4-6': 5, 'c4-7': 4, 'c4-8': 4 };
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b, label = '') => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)), `${label}: ${a} ≈ ${b}`);
const O = { x: 0, y: 0 }, len = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const area = points => Math.abs(points.reduce((sum, p, i) => { const z = points[(i + 1) % points.length]; return sum + p.x * z.y - p.y * z.x; }, 0)) / 2;
const perimeter = points => points.reduce((sum, p, i) => sum + len(p, points[(i + 1) % points.length]), 0);
const angle = (v, a, b) => Math.acos(Math.max(-1, Math.min(1, ((a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y)) / (len(v, a) * len(v, b))))) * 180 / Math.PI;
const circle = (points, center = O, radius = 6) => points.forEach(p => near(len(p, center), radius, 'point on original circle'));
const tangent = (center, radius, a, b) => near(Math.abs(cross(a, b, center)) / len(a, b), radius, 'tangent distance');
const texts = f => f.texts.join('\n');
const visible = f => f.paths.some(p => p.options.color !== null && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0);
const signature = f => JSON.stringify(f.paths.map(p => [p.points, p.options]));

// Independent restricted parser for the exact number notation in source choices.
// Supports fractions/radicals/pi only; units and degree marks are stripped first.
function number(input) {
  const s = String(input).replace(/\\mathrm\{[^{}]*\}/g, '').replace(/√(\d+)/g, '\\sqrt{$1}')
    .replace(/\^\{\\circ\}|°|\$/g, '').replace(/\\(?:left|right|,|!|;)/g, '').replace(/\s+/g, '').replace(/−/g, '-');
  let i = 0;
  const group = () => { assert.equal(s[i++], '{'); const x = sum(); assert.equal(s[i++], '}'); return x; };
  const atom = () => {
    if (s[i] === '+') { i++; return atom(); }
    if (s[i] === '-') { i++; return -atom(); }
    if (s[i] === '{') return group();
    if (s.startsWith('\\sqrt', i)) { i += 5; return Math.sqrt(group()); }
    if (s.startsWith('\\frac', i)) { i += 5; const a = group(), b = group(); return a / b; }
    if (s.startsWith('\\pi', i)) { i += 3; return Math.PI; }
    const m = s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/); assert.ok(m, `number at ${s.slice(i)} in ${s}`); i += m[0].length; return Number(m[0]);
  };
  const product = () => {
    let x = atom();
    while (i < s.length && !['+', '-', '}'].includes(s[i])) {
      if (s.startsWith('\\times', i) || s.startsWith('\\cdot', i)) { i += s.startsWith('\\times', i) ? 6 : 5; x *= atom(); }
      else if (s[i] === '/') { i++; x /= atom(); }
      else x *= atom();
    }
    return x;
  };
  function sum() { let x = product(); while (s[i] === '+' || s[i] === '-') { const op = s[i++], y = product(); x = op === '+' ? x + y : x - y; } return x; }
  const value = sum(); assert.equal(i, s.length); return value;
}

function oracle(id, q, model) {
  const g = model.g || model, k = q.kind;
  if (id.startsWith('c3-') && ['c3-1', 'c3-2', 'c3-3'].includes(id)) {
    for (const [a, b] of [[g.A, g.B], [g.B, g.C], [g.C, g.A]]) tangent(g.I, g.r, a, b);
    near(len(g.A, g.D), len(g.A, g.F)); near(len(g.B, g.D), len(g.B, g.E)); near(len(g.C, g.E), len(g.C, g.F));
    near(area([g.A, g.B, g.C]), g.r * perimeter([g.A, g.B, g.C]) / 2, 'incircle area');
  }
  switch (id) {
    case 'c3-1': {
      near(len(g.A, g.B), q.x + q.y); near(len(g.B, g.C), q.y + q.z); near(len(g.C, g.A), q.z + q.x);
      return k === 2 ? perimeter([g.A, g.B, g.C]) : len(g.A, g.D);
    }
    case 'c3-2': {
      near(angle(g.B, g.A, g.C), 90); near(len(g.A, g.C), Math.hypot(q.p, q.q));
      if (k === 2) {
        const r = g.r, delta = q.p - 2 * r, derivedLeg = (q.p ** 2 - delta ** 2) / (2 * delta);
        near(derivedLeg, q.q, 'derive missing BC using only AB and r');
        near(derivedLeg + delta, len(g.A, g.C));
      }
      return k === 2 ? len(g.A, g.C) : 2 * area([g.A, g.B, g.C]) / perimeter([g.A, g.B, g.C]);
    }
    case 'c3-3': {
      const s = (q.a + q.b + q.c) / 2, heron = Math.sqrt(s * (s - q.a) * (s - q.b) * (s - q.c));
      near(heron, area([g.A, g.B, g.C])); near(heron / s, q.r);
      return k === 1 ? heron : heron / s;
    }
    case 'c3-4': {
      const p = [g.A, g.B, g.C, g.D], edges = p.map((a, i) => len(a, p[(i + 1) % 4]));
      p.forEach((a, i) => tangent(g.O, g.r, a, p[(i + 1) % 4]));
      near(edges[0] + edges[2], edges[1] + edges[3]);
      near(edges[0], q.a + q.b); near(edges[1], 2 * q.b); near(edges[2], q.a + q.b); near(edges[3], 2 * q.a);
      return edges[[3, 1, 2][k]];
    }
    case 'c3-5': {
      const p = [g.A, g.B, g.C, g.D]; p.forEach((a, i) => tangent(g.O, g.r, a, p[(i + 1) % 4]));
      near(angle(g.A, g.B, g.D), 90); near(angle(g.B, g.A, g.C), 90);
      near(len(g.A, g.D), q.a); near(len(g.B, g.C), q.b);
      near(len(g.A, g.B) + len(g.C, g.D), q.a + q.b);
      near(len(g.C, g.D) ** 2, (q.b - q.a) ** 2 + len(g.A, g.B) ** 2);
      return [len(g.A, g.B), len(g.C, g.D), len(g.O, g.ta)][k];
    }
    case 'c3-6': {
      near(len(g.A, g.D), q.a); near(len(g.B, g.C), q.b); near(len(g.A, g.B), q.ab);
      circle([g.A, g.B, g.E], g.O, g.r); tangent(g.O, g.r, g.C, g.D);
      near(len(g.D, g.E), q.a); near(len(g.C, g.E), q.b);
      near(len(g.A, g.B) ** 2, 4 * q.a * q.b);
      return [len(g.A, g.B), len(g.C, g.D), len(g.A, g.D)][k];
    }
    case 'c4-1':
      circle([g.A, g.B, g.P, g.Q]); near(angle(O, g.A, g.B), q.th); near(angle(g.P, g.A, g.B), q.th / 2);
      return [angle(g.P, g.A, g.B), angle(O, g.A, g.B), angle(g.A, O, g.B)][k];
    case 'c4-2':
      circle([g.A, g.B, g.P, g.Q, g.Rr]); near(angle(g.P, g.A, g.B), q.th / 2);
      assert.ok(cross(g.A, g.B, g.P) * cross(g.A, g.B, g.Q) > 0, 'same side');
      assert.ok(cross(g.A, g.B, g.P) * cross(g.A, g.B, g.Rr) < 0, 'opposite side');
      return [angle(g.Q, g.A, g.B), angle(g.Rr, g.A, g.B), angle(g.P, g.A, g.B)][k];
    case 'c4-3':
      circle([g.A, g.B, g.C, g.D]); near(cross(g.A, g.C, g.P), 0); near(cross(g.B, g.D, g.P), 0);
      near(angle(g.D, g.A, g.B), q.th); near(angle(g.B, g.C, g.D), q.k * q.th);
      return [angle(g.P, g.A, g.D), angle(g.A, g.C, g.D), angle(g.P, g.A, g.B)][k];
    case 'c4-4':
      circle([g.A, g.B, g.P]); near(angle(g.P, g.A, g.B), 90);
      if (k === 1) {
        const scale = q.d / len(g.A, g.B); near(len(g.A, g.P) * scale, q.a);
        return len(g.P, g.B) * scale;
      }
      near(angle(g.A, g.P, g.B), q.th);
      return k === 0 ? angle(g.B, g.P, g.A) : angle(O, g.P, g.B);
    case 'c4-5':
      circle([g.A, g.B, g.C, g.D], O, q.a); near(angle(g.A, g.B, g.C), q.A0);
      near(angle(g.C, g.B, g.D), 90); near(angle(g.D, g.B, g.C), q.A0); near(len(g.B, g.D), 2 * q.a);
      return q.ask === 'R' ? len(g.B, g.C) / (2 * Math.sin(q.A0 * Math.PI / 180)) : len(g.B, g.C);
    case 'c4-6': {
      circle([g.A, g.B, g.C, g.D]); near(angle(g.D, g.A, g.C), q.th); near(g.A.y, g.B.y); near(g.C.y, g.D.y);
      const cd = angle(O, g.C, g.D), db = angle(O, g.D, g.B);
      near(db, 2 * q.th); near(cd + 2 * db, 180);
      // The source choice stores the coefficient of pi, not the full arc length.
      return k === 0 ? q.k * cd / db : k === 1 ? cd : angle(g.A, g.C, g.D);
    }
    case 'c4-7': {
      circle([g.A, g.B, g.C, g.D]);
      const [a, b, v, w] = [['B', 'C', 'A', 'D'], ['C', 'D', 'B', 'A'], ['D', 'A', 'B', 'C']][k];
      near(angle(g[v], g[a], g[b]), q.arcs[k + 1] / 2);
      assert.ok(cross(g[a], g[b], g[v]) * cross(g[a], g[b], g[w]) > 0);
      return angle(g[w], g[a], g[b]);
    }
    case 'c4-8': {
      circle([g.A, g.B, g.C]); near(angle(g.A, g.B, g.C), q.th); near(angle(g.B, g.A, g.C), q.be);
      if (k === 2) {
        const sides = [[g.A, g.B], [g.B, g.C], [g.C, g.A]].map(([a, b]) => Math.sign(cross(a, b, O)));
        assert.ok(sides.every(sign => sign === sides[0] && sign !== 0), 'O inside triangle, required for subtraction');
      }
      return [angle(g.B, O, g.C), angle(g.A, g.B, g.C), angle(g.B, O, g.A)][k];
    }
    default: assert.fail('Missing independent oracle ' + id);
  }
}

function init(id, index) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  const lesson = lab.def.lessons[id][index];
  lab.s.ciPick = { key: 'unrelated manual choice', idx: 2 };
  return { id, scene: lab.scene, lesson, compiled: video.compileLesson(lesson), base: { ...lab.s } };
}
function state(u, at, base = u.base) {
  const value = video.stateAt(u.compiled, at, { nums: { ...base }, sets: { ...base }, step: base.step, part: base.part });
  return { ...base, ...value.nums, ...value.sets, step: value.step, part: value.part, lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(s) { Object.assign(lab.s, s); return lab.draw(); }

test('B registers all 14 scenes / 67 lessons and every original variant', () => {
  let concepts = 0, problems = 0;
  for (const [id, count] of Object.entries(counts)) {
    const list = lab.def.lessons[id]; assert.equal(list.length, count);
    assert.deepEqual(video.validateLessonSet(list), { errors: [], warnings: [] }, id);
    const seen = [];
    for (const lesson of list) {
      const first = lesson.chapters[0].cues[0].set, c = video.compileLesson(lesson);
      assert.equal(first.ciSeed, 0); assert.equal(first.ciN, first.ciPk.kind);
      assert.equal(first.ciShowAnswer, false); assert.equal(first.ciCalculationReady, false);
      assert.equal(typeof first.ciLessonProblem, 'boolean'); assert.equal(typeof first.ciLessonSource, 'boolean');
      assert.equal('ciPick' in first, false); assert.ok(Object.isFrozen(first.ciPk));
      if (first.ciPk.arcs) assert.ok(Object.isFrozen(first.ciPk.arcs));
      assert.equal(lesson.chapters[0].start.ciBTrace, 0);
      assert.equal(c.cues.find(cue => cue.set?.ciShowAnswer).at, c.chapters.at(-1).at);
      for (const chapter of lesson.chapters) for (const cue of chapter.cues) {
        if (cue.say == null) continue;
        assert.doesNotMatch(cue.say, /undefined|NaN|Infinity/);
        for (const match of cue.say.matchAll(/\$([^$]+)\$/g)) katex.renderToString(match[1], { throwOnError: true });
      }
      if (first.ciLessonProblem) { problems++; seen.push(first.ciPk.kind); }
      else { concepts++; assert.ok(first.ciBQuestion); }
    }
    assert.deepEqual(seen.sort((a, b) => a - b), Array.from({ length: id === 'c4-5' ? 6 : 3 }, (_, i) => i));
  }
  assert.equal(concepts, 22); assert.equal(problems, 45);
});

for (const id of Object.keys(counts)) {
  test(`${id}: original givens, exact choices and final caption match independent geometry`, () => {
    for (let index = 0; index < counts[id]; index++) {
      const u = init(id, index), s = state(u, 0), sol = G.currentSolution(u.scene.ci, s), q = s.ciPk, Q = sol.question;
      const value = oracle(id, q, sol.model), choices = Q.choices.filter(choice => choice.ok), pi = id === 'c4-6' && q.kind === 0;
      assert.equal(Q.choices.length, 5); assert.equal(choices.length, 1);
      near(sol.value, value, id + '/' + q.key + ' source solution');
      near(number(sol.tex), value * (pi ? Math.PI : 1), 'exact solution TeX');
      near(choices[0].value, value, 'source correct choice'); near(number(choices[0].t), value * (pi ? Math.PI : 1), 'exact choice TeX');
      Q.chk.forEach(x => near(x, value, 'source coordinate check'));
      for (const choice of Q.choices) katex.renderToString(choice.t, { throwOnError: true });
      if (s.ciLessonProblem) {
        assert.equal(u.lesson.answer, G.NUM[Q.choices.findIndex(choice => choice.ok)]);
        assert.ok(u.lesson.answerText.includes(`$${choices[0].t}$`));
        assert.ok(u.lesson.chapters.at(-1).cues[0].say.includes(`=${choices[0].t}$`));
      }
    }
  });
  test(`${id}: production Board has visible first motion, answer gate and deterministic replay`, () => {
    for (let index = 0; index < counts[id]; index++) {
      const u = init(id, index), s0 = state(u, 0), start = draw(s0), early = draw(state(u, .75));
      const pk = plain(s0.ciPk), question = u.scene.question(s0), Q = G.currentSolution(u.scene.ci, s0).question;
      assert.equal(u.base.step, 1, 'actual source.enter base used by player');
      assert.ok(visible(start) && visible(early)); assert.notEqual(signature(start), signature(early), 'real source edge moves within 1s');
      if (s0.ciLessonProblem) for (const [i, choice] of Q.choices.entries()) assert.ok(question.includes(G.NUM[i] + ' $' + choice.t + '$'));
      const finalTime = u.compiled.chapters.at(-1).at;
      for (const cue of u.compiled.cues) {
        const s = state(u, cue.at), frame = draw(s);
        assert.ok(visible(frame)); assert.doesNotMatch(texts(frame), /undefined|NaN|Infinity/);
        assert.equal(s.ciShowAnswer, cue.at >= finalTime); assert.deepEqual(plain(s.ciPk), pk); assert.equal(u.scene.question(s), question);
        assert.deepEqual(plain(s.ciPick), plain(u.base.ciPick), 'manual selection preserved');
        if (s0.ciLessonProblem) {
          if (cue.at < finalTime) assert.ok(frame.texts.some(t => /(?:^x$|=\s*x$)/.test(t)), 'target unknown until last chapter');
          else assert.ok(frame.texts.every(t => !/(?:^x$|=\s*x$)/.test(t)), 'final answer replaces target x');
        }
      }
      const end = state(u, u.compiled.length), rewind = state(u, 0, end), again = draw(rewind);
      assert.equal(rewind.ciShowAnswer, false); assert.equal(rewind.ciCalculationReady, false); assert.equal(rewind.ciBTrace, 0);
      assert.deepEqual(plain(rewind.ciPk), pk); assert.equal(signature(again), signature(start), 'replay restores source geometry');
      const entry = draw({ ...s0, lessonEntry: true, step: 0 }), stale = draw({ ...end, lessonEntry: true, step: 99 });
      assert.equal(signature(stale), signature(entry), 'entry suppresses stale final geometry');
      assert.deepEqual(stale.texts, entry.texts, 'entry suppresses stale final answer');
    }
  });
}

test('B central-angle concepts include inside, side and outside source figures', () => {
  const positions = [];
  for (let i = 0; i < 3; i++) { const u = init('c4-1', i), s = state(u, 0); positions.push(G.currentSolution(u.scene.ci, s).model.g.cs); }
  assert.deepEqual(positions, ['in', 'side', 'out']);
});

test('B semicircle concept reveals the queried right angle only in the final chapter', () => {
  const u = init('c4-4', 0), s0 = state(u, 0), p = G.currentSolution(u.scene.ci, s0).model.g.P;
  const original = lab.board.right, hits = [];
  lab.board.right = function (v, a, b, options) { if (len(v, p) < 1e-8) hits.push(v); return original.call(this, v, a, b, options); };
  try {
    const before = draw(state(u, 30)); assert.equal(hits.length, 0); assert.ok(before.texts.includes('α')); assert.ok(!before.texts.includes('90°'));
    const after = draw(state(u, 36)); assert.ok(hits.length > 0); assert.ok(after.texts.includes('90°'));
  } finally { lab.board.right = original; }
});

test('B concyclicity converse uses equal actual angles, same-side condition and horizontal motion', () => {
  const u = init('c4-7', 0), model = at => u.scene.ci.model(state(u, at), { ...G.PC, problem: false });
  const first = model(0), moving = model(.75), end = model(36);
  near(first.D.y, moving.D.y); assert.notEqual(first.D.x, moving.D.x);
  assert.ok(Math.abs(angle(first.A, first.B, first.C) - angle(first.D, first.B, first.C)) > 1);
  near(angle(end.A, end.B, end.C), angle(end.D, end.B, end.C)); circle([end.A, end.B, end.C, end.D]);
  assert.ok(cross(end.B, end.C, end.A) * cross(end.B, end.C, end.D) > 0, 'A and D on same side of BC');
});
