// Minimum release checks through the student HTML, actual compat layer and Board.
// Browser, mobile and independent visual review are NOT_RUN in this VM.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/quadratic-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const ids = [
  'diffFuncFlatten', 'tangentDiscriminant', 'chordLengthVieta', 'minDistMaxArea', 'symmetryRootSum',
  'movingAxisMin', 'movingAxisMaxJump', 'movingWindowInterval', 'substitution2Stage', 'inscribedRectParabola',
  'absWholeFold', 'absXSymmetry', 'absLineRotTangent', 'absPiecewiseSplit', 'maxMinEnvelope',
  'sepBothGreater', 'sepBetweenOneShot', 'sepInsideInterval', 'sepOneRootInInterval', 'rootSignZero',
  'alwaysPositiveAll', 'restrictedIneqMinMax', 'specialSol4Cases', 'integerCountBoundary', 'compIneqTransform',
  'trapLeadingZero', 'trapMaxLtMin', 'trapKIndepDoubleRoot', 'trapIrrationalCoeffs', 'trapParabolaMeetSegment',
  'cq-glue', 'cq-product', 'cq-rotate', 'cq-integers', 'cq-window', 'cq-sweep'
];
const counts = {
  diffFuncFlatten: 2, tangentDiscriminant: 2, chordLengthVieta: 2, minDistMaxArea: 3, symmetryRootSum: 3,
  movingAxisMin: 2, movingAxisMaxJump: 2, movingWindowInterval: 3, substitution2Stage: 2, inscribedRectParabola: 3,
  absWholeFold: 3, absXSymmetry: 3, absLineRotTangent: 2, absPiecewiseSplit: 2, maxMinEnvelope: 3,
  sepBothGreater: 3, sepBetweenOneShot: 2, sepInsideInterval: 3, sepOneRootInInterval: 3, rootSignZero: 4,
  alwaysPositiveAll: 5, restrictedIneqMinMax: 3, specialSol4Cases: 5, integerCountBoundary: 3, compIneqTransform: 3,
  trapLeadingZero: 3, trapMaxLtMin: 3, trapKIndepDoubleRoot: 2, trapIrrationalCoeffs: 3, trapParabolaMeetSegment: 3,
  'cq-glue': 2, 'cq-product': 2, 'cq-rotate': 3, 'cq-integers': 4, 'cq-window': 4, 'cq-sweep': 4
};
const plain = value => JSON.parse(JSON.stringify(value));
const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-8, `${message}: ${actual} ≠ ${expected}`);
const unique = xs => xs.sort((a, b) => a - b).filter((x, i, arr) => !i || Math.abs(x - arr[i - 1]) > 1e-7);
const integers = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
const sum = xs => xs.reduce((a, b) => a + b, 0);
const lessonsOf = id => video.lessonList(lab.def.lessons[id]);
const sourceLessons = id => lessonsOf(id).filter(lesson => !lesson.chapters[0].cues[0].set.lqcConcept);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, time, base = baseState(), entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step, part: state.part });
  lab.tab = 'review';
  return state;
}
const signature = frame => JSON.stringify({ paths: frame.paths, plots: frame.plots, points: frame.points, handles: frame.handles });
function roots(a, b, c) {
  if (Math.abs(a) < 1e-10) return Math.abs(b) < 1e-10 ? [] : [-c / b];
  const d = b * b - 4 * a * c;
  if (d < -1e-9) return [];
  if (Math.abs(d) < 1e-9) return [-b / (2 * a)];
  return [(-b - Math.sqrt(d)) / (2 * a), (-b + Math.sqrt(d)) / (2 * a)].sort((x, y) => x - y);
}
function extrema(a, b, c, lo, hi) {
  const x = -b / (2 * a), candidates = [lo, hi];
  if (a && x >= lo && x <= hi) candidates.push(x);
  const values = candidates.map(t => a * t * t + b * t + c);
  return { min: Math.min(...values), max: Math.max(...values) };
}
function area(ps) {
  return Math.abs(sum(ps.map((p, i) => p[0] * ps[(i + 1) % ps.length][1] - p[1] * ps[(i + 1) % ps.length][0]))) / 2;
}
function firstAnswer(id, packet) {
  return lab.old.specs[id] ? lab.old.specs[id].ans(packet) : packet.ans.tex;
}
// These source answers are numbers, one radical, or the original interval.
// Normalize notation only; the independent oracle verifies the math.
function answerValue(text) {
  const singleMath = String(text).match(/^[^$]*\$([^$]+)\$[^$]*$/);
  if (singleMath) text = singleMath[1];
  const count = String(text).match(/(?:정수\s*k는\s*|^)(-?\d+)\s*개/);
  if (count) return count[1];
  return String(text).replace(/\$|\s|\\text\{개\}/g, '').split('=').at(-1)
    .replace(/\\dfrac/g, '\\frac')
    .replace(/\\frac(\d)(\d)/g, '\\frac{$1}{$2}')
    .replace(/\\sqrt(\d)/g, '\\sqrt{$1}');
}

test('production HTML registers 36 scenes and 104 valid lessons with all original modules', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'common-quadratic');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), ids);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  assert.ok(lab.api && lab.lessonApi && video && lab.compat?.master);
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-compat.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'common-quadratic/old-core.js', 'common-quadratic/old-1.js', 'common-quadratic/old-2.js', 'common-quadratic/plus.js', 'common-quadratic/lesson-core.js', 'common-quadratic/lesson-a.js', 'common-quadratic/lesson-b.js']) assert.ok(lab.loaded.includes(file), file);
  assert.ok(lab.html.includes('../kit/apl-video.css'));
  let concepts = 0, originals = 0;
  for (const scene of lab.list) {
    assert.equal(lessonsOf(scene.id).length, counts[scene.id], scene.id);
    assert.equal(sourceLessons(scene.id).length, 1, 'only the original first problem is a fixed-source lesson');
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[scene.id])), { errors: [], warnings: [] }, scene.id);
    const packet = lab.api.first(scene.id);
    assert.equal(packet, scene.vary.first());
    assert.equal(lab.api.answer(scene.id), firstAnswer(scene.id, packet));
    assert.ok(lab.api.question(scene.id) && !lab.api.question(scene.id).includes('data-cq-new'));
    for (const lesson of lessonsOf(scene.id)) {
      const first = lesson.chapters[0].cues[0];
      first.set.lqcConcept ? concepts++ : originals++;
      for (const key of ['lqcQuestion', 'lqcConcept', 'lqcExplore', 'lqcTarget', 'lqcShowAnswer', 'lqcMode', 'lqcStrict']) assert.ok(Object.hasOwn(first.set, key), `${scene.id}/${lesson.label}: resets ${key}`);
      assert.equal(first.at, 0); assert.equal(first.set.lqcShowAnswer, false);
      assert.ok(Object.hasOwn(first, 'part'), `${scene.id}/${lesson.label}: emphasis starts explicitly`);
      assert.ok(first.part === null || typeof first.part === 'string', 'an authored emphasis target or no emphasis is valid');
      if (!first.set.lqcConcept) {
        assert.equal(first.set.lqcQuestion, lab.api.question(scene.id), 'original condition text is retained exactly');
        const expected = answerValue(lab.api.answer(scene.id));
        assert.equal(answerValue(lesson.answer), expected, `${scene.id}: authored answer agrees with the verified original`);
        const finalSays = lesson.chapters.at(-1).cues.map(cue => cue.say || '');
        const finalValues = finalSays.flatMap(say => [say, ...Array.from(say.matchAll(/\$([^$]+)\$/g), match => match[1])]).map(answerValue);
        assert.ok(finalValues.includes(expected), `${scene.id}: the final chapter actually states the verified answer`);
      }
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      for (const chapter of lesson.chapters) assert.ok(chapter.length >= 8 && chapter.length <= 15);
      const compiled = video.compileLesson(lesson);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${scene.id}/${lesson.label}: numeric ${key} starts explicitly`);
      assert.equal(video.stateAt(compiled, 0, { nums: {}, sets: {}, step: 99, part: 'stale-other-lesson' }).part, first.part, 'the initial emphasis replaces the previous lesson target');
    }
  }
  assert.equal(concepts, 68); assert.equal(originals, 36); assert.equal(concepts + originals, 104);
});

test('36 first originals agree with independent roots, extrema, counts and coordinate areas', () => {
  const checked = [];
  const check = (id, expected, tex, solve) => {
    const v = lab.api.first(id), result = solve(v);
    near(result, expected, `${id}: independent answer`);
    near(v.ans?.val ?? v.val, result, `${id}: source result`);
    assert.equal(firstAnswer(id, v), tex, `${id}: exact source answer`);
    checked.push(id);
  };
  check('diffFuncFlatten', -2, '-2', v => {
    // Solve the two intersection equations for the unknown linear coefficients.
    const b = ((v.m * v.be + v.n - v.a * v.be ** 2) - (v.m * v.al + v.n - v.a * v.al ** 2)) / (v.be - v.al);
    const c = v.m * v.al + v.n - v.a * v.al ** 2 - b * v.al;
    near(v.pc, b, 'reconstructed coefficient b'); near(v.qc, c, 'reconstructed coefficient c');
    return v.a * v.t ** 2 + b * v.t + c;
  });
  check('tangentDiscriminant', -2, '-2', v => {
    const x = (v.m - v.B) / (2 * v.A), k = v.A * x * x + v.B * x + v.C - v.m * x;
    assert.equal(roots(v.A, v.B - v.m, v.C - k).length, 1, 'the original curve and line touch once');
    return k;
  });
  check('chordLengthVieta', 4 * Math.sqrt(2), '4\\sqrt{2}', v => {
    const [x1, x2] = roots(v.A, v.B - v.m, v.C - v.n);
    return Math.hypot(x2 - x1, (v.m * x2 + v.n) - (v.m * x1 + v.n));
  });
  check('minDistMaxArea', 8, '8', v => {
    const [x1, x2] = roots(v.A, v.B - v.m, v.C - v.n);
    const a = [x1, v.m * x1 + v.n], b = [x2, v.m * x2 + v.n];
    const f = x => v.A * x * x + v.B * x + v.C;
    // The triangle determinant is quadratic in its moving point's x coordinate.
    const determinant = x => (b[0] - a[0]) * (f(x) - a[1]) - (b[1] - a[1]) * (x - a[0]);
    const qa = (determinant(2) - 2 * determinant(1) + determinant(0)) / 2;
    const qb = determinant(1) - determinant(0) - qa, x = -qb / (2 * qa);
    assert.ok(x > x1 && x < x2);
    const best = area([a, b, [x, f(x)]]);
    for (const u of [x1, x1 + (x2 - x1) / 4, x2]) assert.ok(area([a, b, [u, f(u)]]) <= best);
    return best;
  });
  check('symmetryRootSum', -7, '-7', v => {
    const b = -v.a * (v.al ** 2 - v.be ** 2) / (v.al - v.be);
    const c = v.v - v.a * v.t ** 2 - b * v.t;
    return c - b * b / (4 * v.a);
  });
  check('movingAxisMin', 3, '3', v => {
    const d = Math.sqrt((v.M - v.q) / v.a), ps = [v.lo - d, v.hi + d];
    for (const p of ps) near(extrema(v.a, -2 * v.a * p, v.a * p * p + v.q, v.lo, v.hi).min, v.M, 'minimum at a permitted endpoint');
    assert.ok(v.M > v.q, 'an axis inside the interval cannot meet the requested minimum');
    return sum(ps);
  });
  check('movingAxisMaxJump', 5, '5', v => {
    const p = (v.lo + v.hi) / 2;
    const best = extrema(v.a, -2 * v.a * p, v.a * p * p + v.q, v.lo, v.hi).max;
    for (const pp of [p - 1, p + 1]) assert.ok(extrema(v.a, -2 * v.a * pp, v.a * pp * pp + v.q, v.lo, v.hi).max > best);
    return best;
  });
  check('movingWindowInterval', 2, '2', v => {
    const [left, right] = roots(v.a, -2 * v.a * v.p, v.a * v.p ** 2 + v.q - v.k);
    const ts = [left - v.L, right];
    for (const t of ts) near(extrema(v.a, -2 * v.a * v.p, v.a * v.p ** 2 + v.q, t, t + v.L).min, v.k, 'window minimum');
    return sum(ts);
  });
  check('substitution2Stage', 7, '7', v => {
    const inner = extrema(1, -2, 0, v.lo, v.hi), outer = extrema(1, -2 * v.m, v.m ** 2 + v.q, inner.min, inner.max);
    assert.deepEqual(inner, { min: -1, max: 3 }); assert.deepEqual(outer, { min: -1, max: 8 });
    return outer.min + outer.max;
  });
  check('inscribedRectParabola', 10, '10', v => extrema(-2 * v.a, 4, 2 * v.k, 0, Math.sqrt(v.k / v.a)).max);
  check('absWholeFold', 3, '3', v => {
    const count = k => k < 0 ? 0 : unique([k, -k].flatMap(y => roots(1, -2 * v.p, v.p ** 2 - v.m ** 2 - y))).length;
    const ks = integers(-10, 30).filter(k => count(k) === 4);
    assert.deepEqual(ks, [1, 2, 3]); assert.equal(count(0), 2); assert.equal(count(4), 3);
    return ks.length;
  });
  check('absXSymmetry', 3, '3', v => {
    const count = k => unique(roots(1, -2 * v.m, v.c - k).filter(u => u >= 0).flatMap(u => [u, -u])).length;
    const ks = integers(-20, 20).filter(k => count(k) === 4);
    assert.deepEqual(ks, [-4, -3, -2]); assert.equal(count(-5), 2); assert.equal(count(-1), 3);
    return ks.length;
  });
  check('absLineRotTangent', 6 - 2 * Math.sqrt(5), '6-2\\sqrt{5}', v => {
    const count = k => unique([
      ...roots(1, -k, -(v.n ** 2) - k * v.s).filter(x => Math.abs(x) >= v.n - 1e-8),
      ...roots(-1, -k, v.n ** 2 - k * v.s).filter(x => Math.abs(x) <= v.n + 1e-8)
    ]).length;
    const candidates = roots(1, -4 * v.s, 4 * v.n ** 2).filter(k => k > 0 && count(k) === 3);
    assert.equal(candidates.length, 1); near(-candidates[0] / 2, Math.sqrt(5) - 3, 'tangency lies on the middle arc');
    return candidates[0];
  });
  check('absPiecewiseSplit', 3, '3', v => {
    const count = k => unique(roots(1, -2 * v.n, -(v.h ** 2) - k).filter(u => u >= 0).flatMap(u => [v.h + u, v.h - u])).length;
    const ks = integers(-20, 20).filter(k => count(k) === 4);
    assert.deepEqual(ks, [-4, -3, -2]); assert.equal(count(-1), 3);
    return ks.length;
  });
  check('maxMinEnvelope', -1, '-1', v => {
    const candidates = [...roots(v.A, v.B - v.m, v.C - v.n), -v.B / (2 * v.A)];
    const h = x => Math.max(v.A * x * x + v.B * x + v.C, v.m * x + v.n);
    return Math.min(...candidates.map(h));
  });
  const rootCases = [
    ['sepBothGreater', [-3, -2, -1], (rs, v) => rs.length === 2 && rs.every(x => x > v.p)],
    ['sepBetweenOneShot', null, (rs, v) => rs.length === 2 && rs[0] < v.p && v.p < rs[1]],
    ['sepInsideInterval', [1, 2], (rs, v) => rs.length === 2 && rs.every(x => x > v.p && x < v.q)],
    ['sepOneRootInInterval', [-4, -3], (rs, v) => rs.filter(x => x > v.p && x < v.q).length === 1],
    ['rootSignZero', [-5, -4, -3], rs => rs.length === 2 && rs.every(x => x > 0)]
  ];
  for (const [id, expectedKs, accept] of rootCases) check(id, id === 'sepBetweenOneShot' ? -2 : expectedKs.length, id === 'sepBetweenOneShot' ? '-2' : String(expectedKs.length), v => {
    const ks = integers(-60, 60).filter(k => accept(roots(1, v.u * k + v.v, v.w * k + v.z), v));
    if (expectedKs) { assert.deepEqual(ks, expectedKs, `${id}: solve roots before checking their positions`); return ks.length; }
    assert.equal(ks.at(-1), -2); assert.ok(!accept(roots(1, v.u * -1 + v.v, v.w * -1 + v.z), v));
    return Math.max(...ks);
  });
  check('alwaysPositiveAll', 2, '2', v => {
    const ks = integers(-30, 30).filter(k => (v.w * k + v.z) - (v.u * k + v.v) ** 2 / 4 > 0);
    assert.deepEqual(ks, [0, 1]);
    return ks.length;
  });
  check('restrictedIneqMinMax', 1, '1', v => {
    const k = Math.sqrt(v.c), x = Math.sqrt(v.c);
    assert.ok(x >= 0 && x <= v.L);
    near(extrema(1, -2 * k, v.c, 0, v.L).min, 0, 'boundary case is nonnegative on the whole interval');
    assert.ok(extrema(1, -2 * (k + 0.01), v.c, 0, v.L).min < 0, 'a larger slope fails inside the interval');
    return k;
  });
  check('specialSol4Cases', 1, '1', v => {
    const ks = roots(v.u ** 2, 2 * v.u * v.v - 4 * v.w, v.v ** 2 - 4 * v.z);
    assert.deepEqual(ks, [-1, 2]);
    for (const k of ks) assert.equal(roots(1, v.u * k + v.v, v.w * k + v.z).length, 1);
    return sum(ks);
  });
  check('integerCountBoundary', 7, '7', v => {
    const count = k => integers(-10, 20).filter(x => (x - v.p) * (x - k) <= 0).length;
    assert.equal(count(3), v.n); assert.equal(count(3.5), v.n);
    assert.equal(count(3 - 0.01), v.n - 1); assert.equal(count(4), v.n + 1);
    return 3 + 4;
  });
  check('compIneqTransform', 2, '2', v => {
    const endpoints = [(v.al - v.n) / v.m, (v.be - v.n) / v.m].sort((a, b) => a - b);
    near(endpoints[0], -0.5, 'left preimage'); near(endpoints[1], 2.5, 'right preimage');
    return sum(endpoints);
  });
  check('trapLeadingZero', 3, '3', v => {
    const ks = integers(-20, 20).filter(k => k === 0 ? v.c > 0 : k > 0 && v.c - (2 * v.m * k) ** 2 / (4 * k) > 0);
    assert.deepEqual(ks, [0, 1, 2], 'the allowed constant case is included separately');
    return ks.length;
  });
  check('trapMaxLtMin', 3, '3', v => {
    const a = v.a, b = -2 * v.a * v.p, c = v.a * v.p ** 2 + v.q;
    const A = -v.b, B = 2 * v.b * v.r, C = -v.b * v.r ** 2 + v.s;
    const low = c - b * b / (4 * a), high = C - B * B / (4 * A);
    assert.ok(v.p !== v.r, 'independent x values reach their extrema at different points');
    return low - high;
  });
  check('trapKIndepDoubleRoot', 3, '3', v => {
    // D(0)=0 fixes c; D(1)=0 then fixes b. Check other k independently.
    const c = v.a ** 2, b = (1 + v.a) ** 2 - 1 - c;
    for (const k of [-3, 0, 1, 4]) assert.equal(roots(1, -2 * (k + v.a), k * k + b * k + c).length, 1);
    return b + c;
  });
  check('trapIrrationalCoeffs', -3, '-3', v => {
    const r1 = v.p + v.q * Math.sqrt(v.r), r2 = v.p - v.q * Math.sqrt(v.r), a = -(r1 + r2), b = r1 * r2;
    near(r1 ** 2 + a * r1 + b, 0, 'the given irrational number solves the recovered rational equation');
    return a + b;
  });
  check('trapParabolaMeetSegment', 3, '3', v => {
    const count = k => roots(1, v.b - v.m, k - v.n).filter(x => x >= v.x1 - 1e-8 && x <= v.x2 + 1e-8).length;
    const ks = integers(-20, 20).filter(k => count(k) === 2);
    assert.deepEqual(ks, [1, 2, 3]); assert.equal(count(1), 2, 'both segment endpoints count'); assert.equal(count(3.25), 1, 'a tangent is one distinct point');
    return ks.length;
  });
  const pairRoots = (p, k) => ({ f: roots(1, -2 * p.a, p.a ** 2 + p.b - k), g: roots(-1, 2 * p.c, p.d - p.c ** 2 - k) });
  check('cq-glue', -5, '-5', v => {
    const p = v.P, count = k => { const r = pairRoots(p, k); return unique([...r.f.filter(x => x >= p.al - 1e-8 && x <= p.be + 1e-8), ...r.g.filter(x => x < p.al - 1e-8 || x > p.be + 1e-8)]).length; };
    const heights = unique([p.b, (p.al - p.a) ** 2 + p.b, (p.be - p.a) ** 2 + p.b]);
    const ks = heights.filter(k => count(k) === 3);
    assert.deepEqual(ks, [-3, -2]); assert.equal(count(6), 1); assert.equal(count(-2.5), 4);
    return sum(ks);
  });
  check('cq-product', 8, '8', v => {
    const p = v.P, count = k => { const r = pairRoots(p, k); return unique([...r.f, ...r.g]).length; };
    const heights = unique([p.b, p.d, (p.al - p.a) ** 2 + p.b, (p.be - p.a) ** 2 + p.b]);
    const ks = heights.filter(k => count(k) === 3);
    assert.deepEqual(ks, [-3, -2, 6, 7]); assert.equal(count(0), 4);
    return sum(ks);
  });
  check('cq-rotate', 4.5, '\\dfrac{9}{2}', v => {
    const slopes = roots(1, -2 * v.pa.p, v.pa.p ** 2 - 4 * v.pa.q).filter(m => m > 0);
    assert.equal(slopes.length, 1);
    const m = slopes[0], x = (m - v.pa.p) / 2, A = [x, m * x], B = [0, v.pa.q], H = [x, 0], O = [0, 0];
    const cx = v.pa.q / (m + v.pa.q / x), C = [cx, m * cx];
    near(A[1], A[0] ** 2 + v.pa.p * A[0] + v.pa.q, 'the tangency is on the parabola');
    return area([B, O, C]) - area([A, C, H]);
  });
  {
    const id = 'cq-integers', v = lab.api.first(id);
    const xs = k => integers(-10, 20).filter(x => (x - v.p) * (x - k) <= 0 && (x - v.q) * (x - v.r) < 0);
    assert.deepEqual(xs(5), [3, 4, 5]); assert.deepEqual(xs(5.5), [3, 4, 5]);
    assert.equal(xs(4.99).length, 2); assert.equal(xs(6).length, 4);
    assert.equal(firstAnswer(id, v), '5\\le k\\lt 6'); assert.equal(v.ans.val, '5\\le k\\lt 6');
    checked.push(id);
  }
  check('cq-window', 0.25, '\\dfrac{1}{4}', v => {
    const range = t => { const e = extrema(v.a, -2 * v.a * v.p, v.a * v.p ** 2 + v.q, t, t + v.L); return e.max - e.min; };
    const centered = v.p - v.L / 2;
    for (const t of [centered - 2, centered - 0.25, centered + 0.25, centered + 2]) assert.ok(range(t) > range(centered));
    return range(centered);
  });
  check('cq-sweep', 9 / 8, '\\dfrac{9}{8}', v => {
    const F = k => {
      const O = [0, 0], A = [v.a, 0], B = [v.a, v.b], C = [0, v.c], D = [0, k], E = [v.a * k / v.b, k], F = [v.a, k];
      const s1 = area([O, D, E]), s2 = area([O, A, F, E]), s3 = area([E, F, B]), s4 = area([D, E, B, C]);
      near(s1 + s2 + s3 + s4, area([O, A, B, C]), 'the four coordinate polygons fill the quadrilateral');
      return (s1 - s3) ** 2 + (s2 - s4) ** 2;
    };
    const a = (F(1.5) - 2 * F(1) + F(0.5)) / (2 * 0.5 ** 2), b = F(1.5) - F(0.5) - 2 * a, k = -b / (2 * a);
    near(k, 1.25, 'vertex recovered from independent area samples'); assert.ok(k > 0 && k < v.c);
    return F(k);
  });
  assert.deepEqual(checked, ids, 'every catalog source original was checked once');
});

const isTrace = options => options.color === 'violet' && options.width === 4.2 && options.alpha === 0.85;
function onSegment(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, length2 = dx * dx + dy * dy;
  const u = length2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / length2)) : 0;
  return Math.hypot(p.x - a.x - u * dx, p.y - a.y - u * dy) < 1e-7;
}
function traceOnSource(frame, label, sceneId) {
  const marker = frame.points.find(p => p.options.color === 'violet' && p.options.r === 4.5 && p.options.glow === false && !p.options.label);
  assert.ok(marker, `${label}: a visible trace marker starts within one second`);
  const p = marker.point;
  const onPlot = frame.plots.some(plot => !isTrace(plot.options) && p.x >= plot.from - 1e-7 && p.x <= plot.to + 1e-7 && Math.abs(plot.evaluate(p.x) - p.y) < 1e-7);
  const onPath = frame.paths.some(path => !isTrace(path.options) &&
    (path.points.length >= 8 || (sceneId === 'cq-sweep' && path.points.length === 2 && path.options.color === 'amber' && path.options.width === 3.2)) &&
    path.points.slice(1).some((end, i) => onSegment(p, path.points[i], end)));
  assert.ok(onPlot || onPath, `${label}: the marker follows a curve/path already drawn by the source`);
  if (sceneId === 'cq-sweep') {
    const native = label => frame.points.find(point => point.options.label === label)?.point;
    const D = native('D'), E = native('E'), F = native('F');
    assert.ok(D && E && F, 'the three intersections of the actual sweeping line are present');
    near(p.y, D.y, 'the trace stays on the original y=k cut');
    near(E.y, D.y, 'E is on the horizontal cut'); near(F.y, D.y, 'F is on the horizontal cut');
    assert.ok(p.x >= D.x && p.x <= F.x, 'the trace remains between the original cut endpoints');
  }
  assert.ok(p.x >= frame.viewBox.x0 && p.x <= frame.viewBox.x1 && p.y >= frame.viewBox.y0 && p.y <= frame.viewBox.y1, 'the first trace is inside the visible Board');
}

test('every authored cue draws finite native geometry and traces an actual source curve/path', t => {
  let frames = 0, plotTraces = 0, pathTraces = 0;
  for (const scene0 of lab.list) for (const lesson of lessonsOf(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState(), packet = lab.api.first(scene.id), before = plain(packet);
    apply(compiled, 0, base); const first = lab.draw();
    apply(compiled, 0.8, base); const motion = lab.draw();
    const label = `${scene.id}/${lesson.label}`;
    assert.notEqual(signature(motion), signature(first), `${label}: visible movement starts within one second`);
    traceOnSource(motion, label, scene.id);
    if (motion.plots.some(plot => isTrace(plot.options))) plotTraces++;
    if (motion.paths.some(path => isTrace(path.options))) pathTraces++;
    const times = new Set([0, 0.8, compiled.length]);
    for (const cue of compiled.cues) { times.add(cue.at); times.add(Math.min(compiled.length, cue.at + cue.dur / 2)); }
    for (const time of times) {
      apply(compiled, time, base); const frame = lab.draw(); frames++;
      assert.ok(frame.plots.length || frame.paths.length, `${label}@${time}: source geometry exists`);
      for (const path of frame.paths) for (const p of path.points) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `${label}: every native path coordinate is finite`);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo'), 'the real Board issues canvas line commands');
      assert.deepEqual(plain(frame.value), {}, 'legacy formula, summary and result cards remain hidden');
      assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.ok(scene.steps(lab.s, lab).every(step => !step.includes('$')), 'old numeric solution steps do not accompany the lesson');
      assert.equal(scene.vary.cur(), packet, 'active playback selects the first source packet');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lqcShowAnswer, false, `${label}: conclusion remains closed until the final chapter`);
      if (time === compiled.length) assert.equal(lab.s.lqcShowAnswer, true);
    }
    assert.deepEqual(plain(packet), before, 'source problem data are not mutated by playback');
  }
  assert.ok(plotTraces > 0 && pathTraces > 0, 'both the actual Board.plot and legacy Board.path routes were exercised');
  t.diagnostic(`${frames} production Board/raw-canvas cue frames; first traces: ${plotTraces} native plots and ${pathTraces} source paths/segments; full browser/mobile visual audit NOT_RUN`);
});

test('actual new-problem clicks, fixed original replay and manual problem state coexist', () => {
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), first = scene.vary.first(), lesson = sourceLessons(scene.id)[0];
    lab.tab = 'problem'; lab.s.revealed = true; lab.s.step = 3;
    lab.newProblem();
    const manual = scene.vary.cur(), manualText = scene.problem.text(lab.s, lab), manualGeometry = signature(lab.draw());
    assert.notEqual(manual, first, `${scene.id}: the actual button selects a new manual packet`);
    assert.equal(lab.s.revealed, false); assert.equal(lab.s.step, 0);
    const compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base);
    const question = scene.question(lab.s, lab), initial = signature(lab.draw());
    assert.equal(question, lab.api.question(scene.id));
    assert.equal(scene.vary.cur(), first);
    assert.ok(!question.includes('data-cq-new'));
    if (scene.tick) {
      lab.s.playing = true; const before = plain(lab.s);
      assert.equal(scene.tick(lab.s, 1, lab), false); assert.deepEqual(plain(lab.s), before, 'native automatic exploration cannot race the lesson');
    }
    apply(compiled, compiled.length, base); lab.draw(); apply(compiled, 0, base);
    assert.equal(scene.question(lab.s, lab), question);
    assert.equal(signature(lab.draw()), initial, `${scene.id}: replay returns to the fixed initial source diagram`);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem';
    assert.equal(scene.vary.cur(), manual, `${scene.id}: the user's manual packet survives`);
    assert.equal(scene.problem.text(lab.s, lab), manualText);
    assert.equal(signature(lab.draw()), manualGeometry, `${scene.id}: returning to the manual problem restores its diagram`);
  }
});

test('source numeric conclusion labels stay hidden before final and entry ignores stale final state', () => {
  // These are labels that the native review actually paints; other originals
  // conclude through captions without adding a numeric canvas answer.
  const patterns = {
    diffFuncFlatten: /f\(0\)\s*=\s*[−-]2/,
    tangentDiscriminant: /(?:k\s*=\s*[−-]2|꼭짓점\s*\(1,\s*[−-]2\))/,
    symmetryRootSum: /꼭짓점\s*\(2,\s*[−-]7\)/,
    movingAxisMaxJump: /최솟값\s*5/,
    inscribedRectParabola: /둘레\s*10/,
    maxMinEnvelope: /최솟값\s*[−-]1/,
    trapMaxLtMin: /g\s*\(k\s*=\s*3\)/,
    'cq-window': /M[−-]m\s*=\s*0\.25/
  };
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), lesson = sourceLessons(scene.id)[0], compiled = video.compileLesson(lesson), base = baseState();
    const finalAt = compiled.chapters.at(-1).at, pattern = patterns[scene.id];
    for (const time of new Set([0, finalAt - 0.01, ...compiled.cues.filter(cue => cue.at < finalAt).map(cue => cue.at)])) {
      apply(compiled, time, base); lab.s.step = 99;
      const frame = lab.draw();
      assert.equal(lab.s.lqcShowAnswer, false);
      if (pattern) assert.doesNotMatch(frame.texts.join('\n'), pattern, `${scene.id}: no early numeric conclusion even after an old high step`);
      assert.deepEqual(plain(frame.value), {});
    }
    apply(compiled, compiled.length, base); const final = lab.draw();
    assert.equal(lab.s.lqcShowAnswer, true);
    if (pattern) assert.match(final.texts.join('\n'), pattern, `${scene.id}: the native conclusion is available at the end`);
    apply(compiled, 0, base, true); const entry = signature(lab.draw());
    Object.assign(lab.s, { lqcShowAnswer: true, step: 99 });
    const stale = lab.draw();
    assert.equal(signature(stale), entry, `${scene.id}: entry forces step zero and closes a stale answer flag`);
    if (pattern) assert.doesNotMatch(stale.texts.join('\n'), pattern);
    assert.equal(scene.vary.cur(), lab.api.first(scene.id));
  }
});

test('lesson-only comparison diagrams show the promised signs, endpoint cases and solution sets', () => {
  function atMode(id, mode) {
    const scene = lab.go(id);
    for (const lesson of lessonsOf(id).filter(lesson => lesson.chapters[0].cues[0].set.lqcConcept)) {
      const compiled = video.compileLesson(lesson), cue = compiled.cues.find(cue => cue.set?.lqcMode === mode);
      if (!cue) continue;
      apply(compiled, cue.at, baseState());
      assert.equal(lab.s.lqcExplore, true); assert.equal(lab.s.lqcMode, mode);
      return { scene, compiled, frame: lab.draw() };
    }
    assert.fail(`${id}: authored comparison mode ${mode} is missing`);
  }
  for (const [mode, xs] of [['positive', [1.2, 3.4]], ['negative', [-3.4, -1.2]], ['opposite', [-2.2, 1.8]]]) {
    const { frame } = atMode('rootSignZero', mode), plot = frame.plots.find(plot => !isTrace(plot.options));
    assert.ok(plot);
    for (const x of xs) near(plot.evaluate(x), 0, `${mode}: a labeled root is on the actual curve`);
    assert.equal(Math.sign(xs[0] * xs[1]), mode === 'opposite' ? -1 : 1);
    if (mode !== 'opposite') assert.equal(Math.sign(sum(xs)), mode === 'positive' ? 1 : -1);
  }
  for (const mode of ['positive', 'nonnegative', 'negative', 'nonpositive']) {
    const { frame } = atMode('alwaysPositiveAll', mode), plot = frame.plots.find(plot => !isTrace(plot.options));
    const sign = mode === 'negative' || mode === 'nonpositive' ? -1 : 1, touch = mode.startsWith('non');
    near(plot.evaluate(1), touch ? 0 : sign * 1.4, `${mode}: vertex height`);
    for (const x of [-2, 0, 3]) assert.ok(sign * plot.evaluate(x) > 0, `${mode}: opening and sign agree`);
  }
  for (const mode of ['endpoint', 'double']) {
    const { frame } = atMode('sepOneRootInInterval', mode), plot = frame.plots.find(plot => !isTrace(plot.options));
    near(plot.evaluate(1), 0, 'one distinct interior root');
    if (mode === 'endpoint') {
      near(plot.evaluate(0), 0, 'the extra root is at the excluded left boundary');
      assert.ok(plot.evaluate(0.5) < 0 && plot.evaluate(1.5) > 0);
    } else {
      assert.ok(plot.evaluate(0) > 0 && plot.evaluate(2) > 0, 'positive endpoint values can surround one double root');
      near(plot.evaluate(0.5), plot.evaluate(1.5), 'double-root diagram is symmetric');
    }
  }
  for (const mode of ['gt', 'ge', 'lt', 'le']) {
    const { frame } = atMode('specialSol4Cases', mode);
    const answerPoint = p => Math.abs(p.point.x - 2) < 1e-8 && Math.abs(p.point.y + 2.8) < 1e-8;
    assert.ok(!frame.points.some(answerPoint), 'the solution-set marker waits for the final chapter');
    Object.assign(lab.s, { lqcShowAnswer: true, step: 3 });
    const final = lab.draw(), p = final.points.find(answerPoint);
    if (mode === 'lt') { assert.ok(!p); assert.ok(final.texts.includes('해 없음')); }
    else {
      assert.ok(p); assert.equal(!!p.options.hollow, mode === 'gt', 'strict positivity removes exactly the double root');
      const fullLine = final.paths.some(path => path.options.color === 'green' && path.points.length === 2 && path.points.every(p => Math.abs(p.y + 2.8) < 1e-8));
      assert.equal(fullLine, mode === 'gt' || mode === 'ge', 'the nonnegative square has the correct real solution set');
    }
  }
  for (const strict of [false, true]) {
    lab.go('integerCountBoundary');
    const lesson = lessonsOf('integerCountBoundary').find(lesson => lesson.chapters[0].cues[0].set.lqcConcept && lesson.chapters[0].cues[0].set.lqcStrict === strict);
    assert.ok(lesson);
    apply(video.compileLesson(lesson), 0, baseState()); lab.s.lqcK = 3;
    const frame = lab.draw(), labeled = n => frame.points.find(p => p.options.label === String(n) && Math.abs(p.point.x - n) < 1e-8 && p.point.y === 0);
    for (const n of [1, 3]) assert.equal(!!labeled(n)?.options.hollow, strict, 'a boundary integer follows the strict/non-strict inequality');
    assert.equal(labeled(2)?.options.color, 'green'); assert.equal(!!labeled(2)?.options.hollow, false);
    assert.equal(labeled(4)?.options.color, 'muted'); assert.equal(!!labeled(4)?.options.hollow, true);
  }
  {
    lab.go('cq-window');
    const v = lab.api.first('cq-window'), lesson = sourceLessons('cq-window')[0], compiled = video.compileLesson(lesson);
    const base = baseState(), left = v.p - v.L - 0.9;
    for (const entry of [false, true]) {
      apply(compiled, 0, base, entry); const frame = lab.draw();
      const window = frame.paths.find(path => path.options.fill === 'amber' && path.options.close && path.points.length === 4);
      assert.ok(window, 'the first original/entry frame includes its closed interval window');
      near(Math.min(...window.points.map(p => p.x)), left, 'initial interval starts at the native problem position');
      near(Math.max(...window.points.map(p => p.x)) - left, v.L, 'initial interval has the original fixed length');
    }
  }
});
