// Fixed original packets + independent geometry + production Board commands.
// This release check does not claim browser/mobile or independent visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/circle-properties-lesson-runtime.mjs';
const require = createRequire(import.meta.url), video = require('../kit/apl-video-core.js');
const katex = require('../kit/vendor/katex/katex.min.js');
const lab = await load();
const counts = { 'c5-1': 4, 'c5-2': 4, 'c5-3': 4, 'c5-4': 4, 'c5-5': 6, 'c5-6': 7,
  'c6-1': 4, 'c6-2': 4, 'c6-3': 4, 'c6-4': 4, 'c6-5': 4, 'c6-6': 4, 'c6-7': 4, 'c6-8': 4,
  'c7-1': 6, 'c7-2': 6, 'c7-3': 4 };
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b, why = '') => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)), `${why}: ${a} ≈ ${b}`);
const O = { x: 0, y: 0 }, sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a, b) => a.x * b.x + a.y * b.y, cross = (a, b) => a.x * b.y - a.y * b.x;
const len = a => Math.hypot(a.x, a.y), dist = (a, b) => len(sub(a, b));
const angle = (p, a, b) => Math.acos(Math.max(-1, Math.min(1, dot(sub(a, p), sub(b, p)) / (dist(a, p) * dist(b, p))))) * 180 / Math.PI;
const area = points => Math.abs(points.reduce((sum, p, i) => sum + cross(p, points[(i + 1) % points.length]), 0)) / 2;
const signature = frame => JSON.stringify(frame.paths.map(p => [p.points, p.options]));
const unknown = frame => frame.texts.some(text => /(?:^x$|=\s*x$)/.test(text));
const visible = frame => frame.paths.some(p => p.points.length >= 2 && (p.options.color && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0));

// Numeric TeX grammar only; independent of G.nt/mkArea and without eval.
function numeric(input) {
  const s = String(input).replace(/√(\d+)/g, '\\sqrt{$1}').replace(/\^\{\\circ\}|\^\\circ|\$|\s+/g, '').replace(/−/g, '-').replace(/π/g, '\\pi');
  let i = 0;
  const group = () => { const open = s[i++], end = open === '{' ? '}' : ')'; assert.ok(['{', '('].includes(open), s); const n = sum(); assert.equal(s[i++], end, s); return n; };
  const atom = () => {
    if (s[i] === '+') { i++; return atom(); } if (s[i] === '-') { i++; return -atom(); }
    if (s[i] === '{' || s[i] === '(') return group();
    if (s.startsWith('\\sqrt', i)) { i += 5; return Math.sqrt(group()); }
    if (s.startsWith('\\frac', i)) { i += 5; return group() / group(); }
    if (s.startsWith('\\pi', i)) { i += 3; return Math.PI; }
    const m = s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/); assert.ok(m, `number at ${s.slice(i)} in ${s}`); i += m[0].length; return Number(m[0]);
  };
  const product = () => { let n = atom(); while (i < s.length && !['+', '-', '}', ')'].includes(s[i])) {
    if (s.startsWith('\\times', i) || s.startsWith('\\cdot', i)) { i += s.startsWith('\\times', i) ? 6 : 5; n *= atom(); }
    else if (s[i] === '/') { i++; n /= atom(); } else n *= atom();
  } return n; };
  function sum() { let n = product(); while (s[i] === '+' || s[i] === '-') { const op = s[i++], rhs = product(); n = op === '+' ? n + rhs : n - rhs; } return n; }
  const n = sum(); assert.equal(i, s.length, s); return n;
}
function unit(id, index) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  lab.s.ciPick = { key: 'manual-selection-before-lesson', idx: 2 };
  const lesson = lab.def.lessons[id][index];
  return { id, lesson, timeline: video.compileLesson(lesson), base: { ...lab.s }, scene: lab.scene };
}
function state(u, time, base = u.base) {
  const v = video.stateAt(u.timeline, time, { nums: { ...base }, sets: { ...base }, step: base.step, part: base.part });
  return { ...base, ...v.nums, ...v.sets, step: v.step, part: v.part, lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(s) {
  Object.assign(lab.s, s);
  const circles = [], original = lab.board.circle;
  lab.board.circle = function (center, radius, options = {}) {
    circles.push({ center: { x: center.x, y: center.y }, radius, options });
    return original.call(this, center, radius, options);
  };
  try { return { ...lab.draw(), circles }; }
  finally { lab.board.circle = original; }
}
function onCircle(g, center = O, radius = 6, names = ['A', 'B', 'C', 'D']) {
  for (const name of names) near(dist(g[name], center), radius, name + ' on the given circle');
}
function measured(id, M) {
  const { q, g } = M, k = q.kind;
  switch (id) {
    case 'c5-1': {
      onCircle(g); near(angle(g.A, g.B, g.D) + angle(g.C, g.B, g.D), 180, 'opposite angles');
      if (k === 2) { const x = angle(g.A, g.B, g.D) - q.a1; near(2 * x + q.c1, angle(g.C, g.B, g.D)); return x; }
      return k === 0 ? angle(g.D, g.A, g.C) : angle(g.C, g.B, g.D);
    }
    case 'c5-2': onCircle(g); near(cross(sub(g.B, g.C), sub(g.E, g.C)), 0, 'BCE line'); return [angle(g.C, g.D, g.E), angle(g.A, g.B, g.D), angle(g.C, g.B, g.D)][k];
    case 'c5-3': {
      onCircle(g); const P = angle(g.P, g.B, g.C), Q = angle(g.Q, g.D, g.C), A = angle(g.A, g.B, g.D);
      near(P, q.p); near(Q, q.q); near(P + Q + 2 * A, 180, 'two external intersections');
      return [A, Q, angle(g.B, g.A, g.C)][k];
    }
    case 'c5-4': {
      onCircle(g, O, 6, ['A', 'B', 'C', 'D', 'E']); const B = angle(g.B, g.A, g.C), D = angle(g.D, g.C, g.E), X = angle(g.C, g.A, g.E);
      near(B, q.B0); near(D, q.D0); near(X, B + D - 180, 'overlapping arcs in the pentagon'); return [X, D, B][k];
    }
    case 'c5-5': {
      onCircle(g); if (k === 2) { assert.ok(cross(sub(g.D, g.A), sub(g.B, g.A)) * cross(sub(g.D, g.A), sub(g.C, g.A)) > 0, 'B,C on same side of AD'); near(angle(g.B, g.A, g.D), angle(g.C, g.A, g.D)); }
      return [angle(g.D, g.A, g.C), angle(g.A, g.B, g.D), angle(g.C, g.A, g.D)][k];
    }
    case 'c5-6': {
      onCircle(g, g.c, g.r, ['A', 'B', 'C']); const cyclic = Math.abs(dist(g.D, g.c) - g.r) < 1e-8;
      assert.equal(cyclic, q.ty <= 2); assert.equal(Math.abs(angle(g.A, g.B, g.D) + angle(g.C, g.B, g.D) - 180) < 1e-8, cyclic);
      return cyclic ? 1 : 0;
    }
    case 'c6-1': {
      onCircle(g, O, 6, ['A', 'B', 'C']); near(dot(sub(O, g.A), sub(g.T, g.A)), 0, 'radius perpendicular to tangent');
      const circum = angle(g.C, g.A, g.B), tangent = angle(g.A, g.B, g.T); near(circum, tangent); return [circum, tangent, angle(O, g.A, g.B)][k];
    }
    case 'c6-2': onCircle(g, O, 6, ['A', 'B', 'C']); near(angle(g.A, g.Tt, g.B) + angle(g.A, g.B, g.C) + angle(g.A, g.C, g.T2), 180); return [angle(g.A, g.B, g.C), angle(g.A, g.T2, g.C), angle(g.C, g.A, g.B)][k];
    case 'c6-3': onCircle(g, O, 6, ['A', 'B', 'T']); near(dot(g.T, sub(g.P, g.T)), 0, 'PT is tangent'); near(angle(g.T, g.A, g.B), 90, 'diameter angle'); return [angle(g.A, g.T, g.B), angle(g.T, g.A, g.P), angle(g.P, g.T, g.B)][k];
    case 'c6-4': onCircle(g, O, 6, ['A', 'B', 'C']); near(cross(sub(g.C, g.B), sub(g.Tt, g.T2)), 0, 'chord parallel to tangent'); near(dist(g.A, g.B), dist(g.A, g.C)); return [angle(g.A, g.B, g.C), angle(g.A, g.B, g.Tt), angle(g.C, g.A, g.B)][k];
    case 'c6-5': onCircle(g, O, 6, ['A', 'B', 'C']); near(dist(g.A, g.B), dist(g.B, g.C), 'equal AB and BC'); return [angle(g.A, g.B, g.Tt), angle(g.C, g.A, g.B), angle(g.A, g.B, g.C)][k];
    case 'c6-6': case 'c6-7': {
      onCircle(g, g.cc.c, g.cc.r); const PA = dist(g.P, g.A), PB = dist(g.P, g.B), PC = dist(g.P, g.C), PD = dist(g.P, g.D);
      near(PA * PB, PC * PD, 'chord/secant products');
      if (id === 'c6-6') {
        assert.ok(dist(g.P, g.cc.c) < g.cc.r); near(angle(g.A, g.P, g.C), angle(g.D, g.P, g.B), 'PAC/PDB corresponding angles'); near(PA / PD, PC / PB);
        return [PD, PA, PB][k];
      }
      assert.ok(dist(g.P, g.cc.c) > g.cc.r); assert.ok(PA < PB && PC < PD);
      near(angle(g.A, g.P, g.D), angle(g.C, g.P, g.B), 'PAD/PCB corresponding angles'); near(PA / PC, PD / PB);
      return [PD, PA, dist(g.A, g.B)][k];
    }
    case 'c6-8': {
      onCircle(g, g.c, g.r, ['A', 'B', 'T']); near(dot(sub(g.T, g.c), sub(g.P, g.T)), 0, 'actual tangency');
      const PT = dist(g.P, g.T), PA = dist(g.P, g.A), PB = dist(g.P, g.B); near(PT * PT, PA * PB);
      near(angle(g.T, g.P, g.A), angle(g.B, g.P, g.T), 'PTA/PBT corresponding angles'); return [PT, PA, dist(g.A, g.B)][k];
    }
    case 'c7-1': {
      onCircle(g, O, q.R, ['A', 'B']); const sector = Math.PI * q.R ** 2 * angle(O, g.A, g.B) / 360, tri = area([O, g.A, g.B]);
      return [sector - tri, tri, sector][k];
    }
    case 'c7-2': {
      onCircle(g, O, q.R, ['C', 'D']); near(dist(g.apex, O), 0, 'folded arc passes through center'); near(dist(g.M, O), q.R / 2);
      near(angle(O, g.C, g.D), 120); const small = Math.PI * q.R ** 2 / 3 - area([O, g.C, g.D]);
      return [dist(g.C, g.D), small, Math.PI * q.R ** 2 - small][k];
    }
    case 'c7-3': {
      onCircle(g, O, q.R, ['A', 'B', 'C']); near(angle(g.C, g.A, g.B), 90); near(angle(O, g.A, g.C), 2 * angle(g.B, g.A, g.C));
      const sector = Math.PI * q.R ** 2 * angle(O, g.A, g.C) / 360, tri = area([O, g.A, g.C]); near(2 * tri, area([g.A, g.B, g.C]));
      return [sector - tri, sector, Math.PI * q.R ** 2 / 2 - area([g.A, g.B, g.C])][k];
    }
    default: assert.fail(id);
  }
}

test('C registers all 17 scenes / 77 lessons, including six classification families', t => {
  let concepts = 0, problems = 0;
  for (const [id, count] of Object.entries(counts)) {
    const list = lab.def.lessons[id]; assert.equal(list.length, count, id); assert.deepEqual(video.validateLessonSet(list), { errors: [], warnings: [] }, id);
    const seen = [];
    for (const item of list) {
      const first = item.chapters[0].cues[0].set, timeline = video.compileLesson(item);
      assert.equal(first.ciSeed, 0); assert.equal(first.ciShowAnswer, false); assert.equal(first.ciCalculationReady, false); assert.equal(first.ciLessonSource, true);
      assert.ok(Object.isFrozen(first.ciPk)); assert.equal('ciPick' in first, false); assert.equal(item.chapters[0].cues[0].step, 0);
      assert.equal(item.chapters[0].start.ciCTrace, 0);
      const reveals = timeline.cues.filter(c => c.set?.ciShowAnswer); assert.equal(reveals.length, 1); assert.equal(reveals[0].ch, item.chapters.length - 1);
      for (const chapter of item.chapters) for (const cue of chapter.cues) {
        if (cue.say != null) {
          assert.doesNotMatch(cue.say, /undefined|NaN|Infinity|[\x00-\x08\x0b-\x1f]/);
          for (const m of cue.say.matchAll(/\$([^$]+)\$/g)) katex.renderToString(m[1], { throwOnError: true, strict: 'error' });
        }
        for (const key of Object.keys(cue.to || {})) { assert.ok(Number.isFinite(item.chapters[0].start[key]), key); assert.equal(key in first, false); }
      }
      if (first.ciLessonProblem) { problems++; seen.push(id === 'c5-6' ? first.ciPk.ty : first.ciPk.kind); } else { concepts++; assert.ok(first.ciCQuestion); }
    }
    assert.deepEqual(seen.sort(), id === 'c5-6' ? [0, 1, 2, 3, 4, 5] : [0, 1, 2], id);
  }
  assert.equal(concepts, 23); assert.equal(problems, 54); t.diagnostic('17 scenes / 77 lessons: 23 concepts + 54 original examples');
});

test('C exact choices, source solvers and authored answers agree with coordinate geometry', () => {
  for (const [id, count] of Object.entries(counts)) for (let i = 0; i < count; i++) {
    const u = unit(id, i), s = state(u, 0), sol = u.scene.solution(s), Q = sol.question, expected = measured(id, sol.model), correct = Q.choices.filter(c => c.ok);
    assert.equal(Q.choices.length, 5); assert.equal(correct.length, 1); near(Q.chk[0], expected, id + ' source measurement'); near(Q.chk[1], expected, id + ' source answer'); near(sol.value, expected, id + ' solver value');
    if (id !== 'c5-6') {
      near(correct[0].value, expected, id + ' correct choice'); near(numeric(correct[0].t ?? correct[0].h), expected, id + ' exact choice TeX'); near(numeric(sol.tex), expected, id + ' exact solution TeX');
      if (s.ciLessonProblem) { assert.equal(u.lesson.answer, lab.api.NUM[Q.choices.findIndex(c => c.ok)]); assert.ok(u.lesson.answerText.includes(sol.tex)); assert.ok(u.lesson.chapters.at(-1).cues.at(-1).say.includes(sol.tex)); }
    } else if (s.ciLessonProblem) assert.equal(u.lesson.answer, expected ? '원에 내접' : '내접하지 않음');
  }
});

test('C real source Board draws every cue, keeps questions fixed and gates final targets', t => {
  let frames = 0;
  for (const [id, count] of Object.entries(counts)) for (let i = 0; i < count; i++) {
    const u = unit(id, i), s0 = state(u, 0), first = draw(s0), early = draw(state(u, .75)), Q = plain(u.scene.solution(s0).question), question = u.scene.question(s0);
    assert.ok(visible(first) && visible(early)); assert.notEqual(signature(first), signature(early), `${id}/${i} first-cue source trace`);
    if (s0.ciLessonProblem) for (const choice of Q.choices) assert.ok(question.includes(choice.h ?? choice.t), 'original choice remains visible');
    const reveal = u.timeline.cues.find(c => c.set?.ciShowAnswer).at, hasTarget = !(id === 'c5-6' || id === 'c5-1' && s0.ciPk.kind === 2);
    for (const time of [...u.timeline.cues.map(c => c.at), u.timeline.length]) {
      const s = state(u, time), f = draw(s); assert.ok(visible(f)); assert.doesNotMatch(f.texts.join(' '), /undefined|NaN|Infinity/);
      assert.equal(f.handles.length, 0); assert.equal(f.value.rule, null); assert.equal(f.value.formula, null);
      assert.equal(s.ciShowAnswer, time >= reveal); assert.deepEqual(plain(s.ciPk), plain(s0.ciPk)); assert.deepEqual(plain(u.scene.solution(s).question), Q); assert.equal(u.scene.question(s), question); assert.deepEqual(plain(s.ciPick), plain(u.base.ciPick));
      if (hasTarget) assert.equal(unknown(f), time < reveal, `${id}/${i} answer label timing at ${time}`);
      frames++;
    }
    const end = state(u, u.timeline.length), rewind = state(u, 0, end), again = draw(rewind);
    assert.equal(rewind.ciShowAnswer, false); assert.equal(rewind.ciCalculationReady, false); assert.equal(rewind.ciCTrace, 0); assert.equal(signature(again), signature(first), `${id}/${i} replay`);
    const entry = draw({ ...s0, lessonEntry: true, step: 0 }), stale = draw({ ...end, lessonEntry: true, step: 99 });
    assert.equal(signature(stale), signature(entry), `${id}/${i} stale entry geometry`); assert.deepEqual(stale.texts, entry.texts, `${id}/${i} stale answer hidden`);
  }
  t.diagnostic(`${frames} cue/end frames through production HTML, source and Board`);
});

test('C folded arcs move continuously and source proof overlays follow the construction', () => {
  for (let i = 0; i < counts['c7-2']; i++) {
    const u = unit('c7-2', i), flat = draw(state(u, 12)), moving = draw(state(u, 14)), folded = draw(state(u, 18));
    const curve = frame => frame.paths.find(p => p.options.color === 'ink' && p.options.width === 3.4 && p.points.length === 49).points;
    assert.notDeepEqual(plain(curve(flat)), plain(curve(moving))); assert.notDeepEqual(plain(curve(moving)), plain(curve(folded)));
    const center = Math.floor(curve(folded).length / 2); near(dist(curve(folded)[center], O), 0, 'arc midpoint reaches original center');
    assert.ok(!flat.texts.includes('M') && !moving.texts.includes('M'), 'fixed-model solution overlay waits until folding completes'); assert.ok(folded.texts.includes('M'));
    assert.equal(state(u, 0).c7f, 0); assert.equal(state(u, u.timeline.length).c7f, 1);
  }
  const tangent = unit('c6-1', 0), f = draw(state(tangent, 12)), M = tangent.scene.solution(state(tangent, 12)).model;
  assert.ok(f.paths.some(p => p.options.color === 'green' && p.points.length === 2 && dist(p.points[0], O) < 1e-8 && dist(p.points[1], M.g.B) < 1e-8), 'OB from the proof is actually drawn');
  for (let i = 1; i < counts['c5-6']; i++) {
    const u = unit('c5-6', i), before = draw(state(u, 12)), end = draw(state(u, u.timeline.length));
    const g = u.scene.solution(state(u, u.timeline.length)).model.g;
    assert.equal(before.circles.length, 0, 'classification withholds its circle until the conclusion');
    assert.equal(end.circles.length, 1, 'classification conclusion draws the source circumcircle');
    near(dist(end.circles[0].center, g.c), 0); near(end.circles[0].radius, g.r);
  }
});
