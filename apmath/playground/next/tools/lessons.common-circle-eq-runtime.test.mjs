// Minimum release checks through the production HTML, compatibility layer and Board.
// Full browser/mobile and independent visual review are NOT_RUN in this VM.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/circle-equation-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const counts = {
  stdDef: 3, generalForm: 3, diamEnds: 3, threePts: 3,
  twoCircles21: 4, touchX: 3, touchY: 3, touchBothQuad: 3,
  apolloCircle: 3, apolloMaxArea: 3, apolloMaxAngle: 3, midpointLocus: 3,
  chordLength: 3, dVsR: 3, maxMinDist: 3, equilMaxMin: 4,
  pencilK: 3, commonChordLen: 3, twoPos5: 6, bisectCircum: 3, foldCircleArc: 3,
  tanExtVertical: 4, tanSlope: 3, tanPointOn: 3, tanPerp90: 3,
  extCommonTan: 3, intCommonTan: 3, polarChordCow: 3, concyclicOAPB: 3,
  pappusMinSq: 5, bisectAreaBoth: 3, laserReflectTan: 3
};
const ids = Object.keys(counts), plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const sum = values => values.reduce((a, b) => a + b, 0);
const length = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const plus = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const minus = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const scale = (a, t) => ({ x: a.x * t, y: a.y * t });
const dot = (a, b) => a.x * b.x + a.y * b.y;
const along = (a, b, t) => plus(a, scale(minus(b, a), t));
const norm2 = a => dot(a, a);
const lessonsOf = id => video.lessonList(lab.def.lessons[id]);
const firstSet = lesson => lesson.chapters[0].cues[0].set;
const sourceLessons = id => lessonsOf(id).filter(lesson => !firstSet(lesson).lceConcept);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
const stepsOf = scene => typeof scene.steps === 'function' ? scene.steps(lab.s, lab) : scene.steps;
function apply(compiled, time, base = baseState(), entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step, part: state.part });
  lab.tab = 'review';
  return state;
}
const signature = frame => JSON.stringify({ paths: frame.paths, circles: frame.circles, points: frame.points, handles: frame.handles });
function answerValue(value) {
  const math = String(value).match(/^[^$]*\$([^$]+)\$[^$]*$/);
  return String(math ? math[1] : value).replace(/\$|\s/g, '').split('=').at(-1)
    .replace(/\\dfrac/g, '\\frac')
    .replace(/\\frac(?:\{(-?\d+)\}|(\d))(?:\{(\d+)\}|(\d))/g, (_, a, b, c, d) => `\\frac{${a ?? b}}{${c ?? d}}`)
    .replace(/\\sqrt(\d)/g, '\\sqrt{$1}')
    .replace(/^k\\text\{는\}(\d+)\\text\{개\}$/, '$1');
}
function numericAnswer(tex) {
  const s = answerValue(tex), fraction = s.match(/^(-?)\\frac\{(-?\d+)\}\{(\d+)\}$/), radical = s.match(/^(-?\d*)\\sqrt\{(\d+)\}$/);
  if (fraction) return (fraction[1] ? -1 : 1) * Number(fraction[2]) / Number(fraction[3]);
  if (radical) return (radical[1] === '' ? 1 : radical[1] === '-' ? -1 : Number(radical[1])) * Math.sqrt(Number(radical[2]));
  assert.match(s, /^-?\d+(?:\.\d+)?$/, 'the first-source conclusion is an exact number, fraction or radical');
  return Number(s);
}
function solve2(a, b, c, d, e, f) {
  const determinant = a * e - b * d;
  assert.ok(Math.abs(determinant) > 1e-10, 'the two independent linear conditions determine one point');
  return { x: (c * e - b * f) / determinant, y: (a * f - c * d) / determinant };
}
function roots(a, b, c) {
  const discriminant = b * b - 4 * a * c;
  assert.ok(a !== 0 && discriminant >= 0);
  return [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
}
function apollonius(p) {
  // Expand n² PA² = m² PB² without using the source's apoGeom solver.
  const a = p.n ** 2 - p.m ** 2, b = -2 * p.n ** 2 * p.xa + 2 * p.m ** 2 * p.xb;
  const c = p.n ** 2 * p.xa ** 2 - p.m ** 2 * p.xb ** 2, center = { x: -b / (2 * a), y: 0 };
  const radius = Math.sqrt(center.x ** 2 - c / a), P = { x: center.x, y: radius };
  near(length(P, { x: p.xa, y: 0 }) / length(P, { x: p.xb, y: 0 }), p.m / p.n, 'the recovered locus satisfies the distance ratio');
  return { center, radius };
}

test('shell can count review steps before PROB.attach without inventing inquiry steps', () => {
  const initial = Object.fromEntries(Object.entries(lab.def.params || {}).map(([key, param]) => [key, param.value]));
  Object.assign(initial, lab.def.state, { step: 0, part: null, revealed: false, playing: false });
  // The VM replaces createLab's UI construction and attaches getters to its
  // copied list. The original definitions retain the pre-attach functions
  // that the real shell calls while it builds the very first review tab.
  for (const group of lab.def.groups) for (const scene of group.scenes) {
    const steps = typeof scene.steps === 'function' ? scene.steps(initial) : scene.steps;
    assert.ok(Array.isArray(steps), `${scene.id}: initial review-tab construction needs a step list before PROB.attach`);
    assert.equal(steps.length, 0, `${scene.id}: no inquiry steps are invented during initialization`);
  }
});

test('actual HTML registers 32 scenes and 104 valid lessons with exactly one first original per scene', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'common-circle-eq');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), ids);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  assert.ok(lab.api && lab.lessonApi && video);
  assert.deepEqual(lab.missing, []);
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-compat.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'common-circle-eq/lesson-core.js', 'common-circle-eq/lesson-a.js', 'common-circle-eq/lesson-b.js']) assert.ok(lab.loaded.includes(file), file);
  assert.ok(lab.html.includes('../kit/apl-video.css'));
  let concepts = 0, originals = 0;
  for (const scene of lab.list) {
    assert.equal(lessonsOf(scene.id).length, counts[scene.id], scene.id);
    assert.equal(sourceLessons(scene.id).length, 1, `${scene.id}: only the first source problem is fixed`);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[scene.id])), { errors: [], warnings: [] }, scene.id);
    assert.equal(lab.api.first(scene.id), scene.vary.first(), 'original packet and drawing closure identity remain intact');
    assert.equal(lab.api.question(scene.id), scene.vary.first().text);
    assert.equal(lab.api.answer(scene.id), scene.vary.first().ans);
    assert.ok(!lab.api.question(scene.id).includes('data-ce-new'));
    for (const lesson of lessonsOf(scene.id)) {
      const first = lesson.chapters[0].cues[0];
      first.set.lceConcept ? concepts++ : originals++;
      for (const key of ['lceQuestion', 'lceConcept', 'lceExplore', 'lceTarget', 'lceShowAnswer', 'lceMode', 'lceStage']) assert.ok(Object.hasOwn(first.set, key), `${scene.id}/${lesson.label}: explicitly resets ${key}`);
      assert.equal(first.at, 0); assert.equal(first.set.lceShowAnswer, false);
      assert.ok(Object.hasOwn(first, 'part') && (first.part === null || typeof first.part === 'string'));
      if (!first.set.lceConcept) {
        assert.equal(first.set.lceQuestion, lab.api.question(scene.id));
        const expected = answerValue(lab.api.answer(scene.id));
        assert.equal(answerValue(lesson.answer), expected, `${scene.id}: authored answer matches the source`);
        const finalValues = lesson.chapters.at(-1).cues.flatMap(cue => [
          ...Array.from((cue.say || '').matchAll(/\$([^$]+)\$/g), match => answerValue(match[1])),
          ...Array.from((cue.say || '').matchAll(/(?:^|\s)(\d+)개(?:예요|입니다)/g), match => match[1])
        ]);
        assert.ok(finalValues.includes(expected), `${scene.id}: the final chapter states the verified answer`);
      }
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      for (const chapter of lesson.chapters) assert.ok(chapter.length >= 8 && chapter.length <= 15);
      const compiled = video.compileLesson(lesson);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${scene.id}/${lesson.label}: animated ${key} has an initial value`);
      assert.equal(video.stateAt(compiled, 0, { nums: {}, sets: {}, step: 99, part: 'stale' }).part, first.part);
    }
  }
  assert.equal(concepts, 72); assert.equal(originals, 32); assert.equal(concepts + originals, 104);
});

test('32 first originals agree with independent circle, intersection, tangency, locus and reflection calculations', () => {
  const checked = [];
  const check = (id, expected, solve) => {
    const q = lab.api.first(id), result = solve(q.prm, q);
    near(result, expected, `${id}: independently calculated result`);
    near(q.val, result, `${id}: original numeric answer`);
    near(numericAnswer(q.ans), result, `${id}: exact displayed answer`);
    checked.push(id);
  };
  check('stdDef', 26, p => p.C.x + p.C.y + norm2(minus(p.Pt, p.C)));
  check('generalForm', 4, p => {
    const threshold = (p.A ** 2 + p.B ** 2) / 4, k = Math.ceil(threshold) - 1;
    assert.ok(threshold - k > 0 && threshold - (k + 1) <= 0, 'a positive radius excludes the zero-radius boundary');
    return k;
  });
  check('diamEnds', -26, p => dot(p.A, p.B) - p.A.x - p.B.x - p.A.y - p.B.y);
  check('threePts', 8, p => {
    const [A, B, C] = p.pts;
    const O = solve2(2 * (B.x - A.x), 2 * (B.y - A.y), norm2(B) - norm2(A), 2 * (C.x - A.x), 2 * (C.y - A.y), norm2(C) - norm2(A));
    const r = length(O, A);
    near(length(O, B), r, 'circumcenter is equidistant from B'); near(length(O, C), r, 'circumcenter is equidistant from C');
    return O.x + O.y + r;
  });
  check('twoCircles21', 6, p => {
    assert.equal(p.ask, 'sum');
    const rs = roots(1, -2 * (Math.abs(p.p) + Math.abs(p.q)), p.p ** 2 + p.q ** 2);
    for (const r of rs) { assert.ok(r > 0); near(length({ x: p.p, y: p.q }, { x: Math.sign(p.p) * r, y: Math.sign(p.q) * r }), r, 'each axis-tangent circle passes through the given point'); }
    return sum(rs);
  });
  check('touchX', 5, p => {
    const sign = p.up ? 1 : -1, r = ((p.Pt.x - p.h) ** 2 + p.Pt.y ** 2) / (2 * sign * p.Pt.y);
    assert.ok(r > 0); near(length(p.Pt, { x: p.h, y: sign * r }), r, 'the radius reaches P and the horizontal axis');
    return r;
  });
  check('touchY', 8 * Math.sqrt(2), p => {
    const w = p.Pt.y - p.c, xs = roots(1, -2 * (p.Pt.x + w), p.Pt.x ** 2 + w ** 2), centers = xs.map(x => ({ x, y: x + p.c }));
    for (const C of centers) near(length(C, p.Pt), Math.abs(C.x), 'both centers meet the source line and y-axis tangency condition');
    return length(...centers);
  });
  check('touchBothQuad', 8, p => {
    const centers = [1, -1].map(sign => { const x = p.c / (p.a + p.bq * sign); return { x, y: sign * x }; });
    for (const C of centers) { near(p.a * C.x + p.bq * C.y, p.c, 'the center lies on the given line'); near(Math.abs(C.x), Math.abs(C.y), 'distances to the two axes are equal'); }
    return sum(centers.map(C => Math.abs(C.x)));
  });
  check('apolloCircle', 4, p => apollonius(p).radius);
  check('apolloMaxArea', 12, p => Math.abs(p.xb - p.xa) * apollonius(p).radius / 2);
  check('apolloMaxAngle', 4 * Math.sqrt(3), p => {
    const A = { x: p.a, y: 0 }, C = { x: p.h, y: 0 }, d = length(A, C);
    const P = { x: p.a + (d * d - p.r * p.r) / d, y: p.r * Math.sqrt(d * d - p.r * p.r) / d };
    near(length(P, C), p.r, 'the extreme-angle point is on the circle'); near(dot(minus(P, A), minus(P, C)), 0, 'the boundary ray is tangent');
    return length(A, P);
  });
  check('midpointLocus', 8, p => {
    const O = midpoint(p.A, p.C), P = plus(p.C, { x: p.r * Math.cos(.7), y: p.r * Math.sin(.7) }), M = midpoint(p.A, P);
    near(length(M, O), p.r / 2, 'the midpoint transform halves the radius');
    return O.x + O.y + (p.r / 2) ** 2;
  });
  check('chordLength', 8, p => {
    assert.equal(p.ask, 'chord');
    const n2 = p.a ** 2 + p.bq ** 2, offset = (p.a * p.C.x + p.bq * p.C.y + p.c) / n2;
    const H = { x: p.C.x - p.a * offset, y: p.C.y - p.bq * offset }, half = Math.sqrt(p.r ** 2 - length(H, p.C) ** 2), u = { x: -p.bq / Math.sqrt(n2), y: p.a / Math.sqrt(n2) };
    const A = plus(H, scale(u, half)), B = plus(H, scale(u, -half));
    for (const Q of [A, B]) { near(length(Q, p.C), p.r, 'intersection lies on the circle'); near(p.a * Q.x + p.bq * Q.y + p.c, 0, 'intersection lies on the line'); }
    return length(A, B);
  });
  check('dVsR', 2, p => {
    assert.equal(p.ask, 'none');
    const discriminant = k => { const a = 1 + p.m ** 2, b = 2 * (p.m * (k - p.C.y) - p.C.x), c = p.C.x ** 2 + (k - p.C.y) ** 2 - (p.m ** 2 + 1); return b * b - 4 * a * c; };
    const candidates = Array.from({ length: 50 }, (_, i) => i + 1), answer = candidates.find(k => discriminant(k) < 0);
    assert.ok(candidates.filter(k => k < answer).every(k => discriminant(k) >= 0), 'every smaller natural intercept still meets the circle');
    return answer;
  });
  check('maxMinDist', 21, p => {
    const n = { x: p.a, y: p.bq }, nlen = Math.hypot(n.x, n.y), signed = (dot(n, p.C) + p.c) / nlen;
    const toward = scale(n, -Math.sign(signed) / nlen), nearP = plus(p.C, scale(toward, p.r)), farP = plus(p.C, scale(toward, -p.r));
    assert.ok(Math.abs(signed) > p.r, 'the entire source circle lies on one side of the line');
    const distance = Q => Math.abs(dot(n, Q) + p.c) / nlen;
    return distance(nearP) * distance(farP);
  });
  check('equilMaxMin', 16 * Math.sqrt(3), p => {
    const farthestFoot = Math.hypot(p.v.x, p.v.y), side = 2 * Math.sqrt(p.r ** 2 - farthestFoot ** 2);
    assert.ok(farthestFoot < p.r, 'the fixed point is strictly inside the circle');
    return Math.sqrt(3) * side ** 2 / 4;
  });
  check('pencilK', 3 / 5, p => {
    const h2 = p.r1s - p.x0 ** 2, r2s = h2 + (p.d - p.x0) ** 2, k = p.x0 / (p.d - p.x0);
    const radius2 = t => (p.r1s + t * r2s) / (1 + t) - t * p.d ** 2 / (1 + t) ** 2;
    near(p.d * k / (1 + k), p.x0, 'the smallest circle is centered at the common chord midpoint'); near(radius2(k), h2, 'its radius is half the common chord');
    assert.ok(radius2(k - .1) > h2 && radius2(k + .1) > h2);
    return k;
  });
  check('commonChordLen', 8, p => {
    const d = Math.hypot(p.off.x, p.off.y), r1s = p.x0 ** 2 + p.h ** 2, r2s = (d - p.x0) ** 2 + p.h ** 2;
    const x = (d ** 2 + r1s - r2s) / (2 * d);
    return 2 * Math.sqrt(r1s - x ** 2);
  });
  check('twoPos5', 5, p => {
    assert.equal(p.ask, 'cnt'); const d = Math.hypot(p.off.x, p.off.y);
    return Array.from({ length: Math.ceil(d + p.r1) + 1 }, (_, i) => i + 1).filter(k => Math.abs(p.r1 - k) < d && d < p.r1 + k).length;
  });
  check('bisectCircum', 8, p => {
    const delta = minus(p.C2c, p.C1), d = Math.hypot(delta.x, delta.y), normal = { x: -delta.y / d, y: delta.x / d };
    const A = plus(p.C1, scale(normal, p.r1)), B = plus(p.C1, scale(normal, -p.r1));
    near(length(A, p.C2c), length(B, p.C2c), 'both diameter endpoints lie on the bisecting circle');
    const constant = Q => 2 * dot(p.C2c, Q) - norm2(Q);
    near(constant(A), constant(B), 'both common points determine the same general-form constant');
    return constant(A);
  });
  check('foldCircleArc', 8, p => {
    const reflected = { x: p.t, y: p.r }, original = plus(reflected, p.v), M = midpoint(original, reflected);
    near(reflected.y, p.r, 'the reflected upper circle is tangent to the x axis'); near(length(M, original), length(M, reflected), 'the fold bisects the two centers');
    return 2 * Math.sqrt(p.r ** 2 - length(M, original) ** 2);
  });
  check('tanExtVertical', 7 / 24, p => {
    // Substitute y=m(x-p)+q into x²+y²=p²; the m² terms cancel in D=0.
    const residual = m => p.q ** 2 - 2 * m * p.p * p.q - p.p ** 2;
    const m = -residual(0) / (residual(1) - residual(0));
    near(Math.abs(p.q - m * p.p) / Math.hypot(m, 1), Math.abs(p.p), 'the nonvertical line has radius-distance from the origin');
    return m;
  });
  check('tanSlope', -25, p => {
    const shift = p.m * p.C.x - p.C.y, R = p.m ** 2 + 1;
    const intercepts = roots(1, 2 * shift, shift ** 2 - R * (p.m ** 2 + 1));
    for (const b of intercepts) near(Math.abs(shift + b) / Math.hypot(p.m, 1), Math.sqrt(R), 'each line has the specified slope and tangent distance');
    return intercepts[0] * intercepts[1];
  });
  check('tanPointOn', 7, p => {
    const radius = minus(p.T1, p.C), y = p.T1.y - radius.x * (p.u - p.T1.x) / radius.y;
    near(dot(radius, minus({ x: p.u, y }, p.T1)), 0, 'the tangent direction is perpendicular to the contact radius');
    return y;
  });
  check('tanPerp90', 7, p => {
    const a = p.C.x + Math.sqrt(2 * p.r2 - (p.b0 - p.C.y) ** 2), P = { x: a, y: p.b0 };
    assert.ok(a > p.C.x); near(length(P, p.C) ** 2, 2 * p.r2, 'the two equal right triangles have 45-degree exterior angles');
    return a;
  });
  for (const id of ['extCommonTan', 'intCommonTan']) check(id, 4, p => {
    const delta = minus(p.C2, p.C1), d = Math.hypot(delta.x, delta.y), u = scale(delta, 1 / d), transverse = { x: -u.y, y: u.x };
    const ratio = (p.internal ? p.r1 + p.r2 : p.r1 - p.r2) / d, n = plus(scale(u, ratio), scale(transverse, Math.sqrt(1 - ratio ** 2)));
    const P = plus(p.C1, scale(n, p.r1)), Q = plus(p.C2, scale(n, p.internal ? -p.r2 : p.r2));
    near(dot(minus(Q, P), minus(P, p.C1)), 0, 'the common tangent is perpendicular to the first radius'); near(dot(minus(Q, P), minus(Q, p.C2)), 0, 'the same line is tangent to the second circle');
    return length(P, Q);
  });
  check('polarChordCow', 24 / 5, p => {
    const d2 = norm2(p.Pp), H = scale(p.Pp, p.r ** 2 / d2), half = Math.sqrt(p.r ** 2 - norm2(H)), u = scale({ x: -p.Pp.y, y: p.Pp.x }, 1 / Math.sqrt(d2));
    const A = plus(H, scale(u, half)), B = plus(H, scale(u, -half));
    for (const T of [A, B]) { near(norm2(T), p.r ** 2, 'contact point lies on the circle'); near(dot(T, minus(p.Pp, T)), 0, 'the radius and tangent are perpendicular'); }
    return length(A, B);
  });
  check('concyclicOAPB', 3, p => dot(p.C, p.Pp) - p.C.x - p.C.y - p.Pp.x - p.Pp.y);
  check('pappusMinSq', 28, p => {
    assert.equal(p.ask, 'min'); const M = midpoint(p.A, p.B), delta = minus(M, p.C), d = Math.hypot(delta.x, delta.y), P = plus(p.C, scale(delta, p.r / d));
    near(length(P, p.C), p.r, 'the minimizing point is on the actual circle');
    const objective = Q => length(Q, p.A) ** 2 + length(Q, p.B) ** 2;
    near(objective(P), 2 * length(P, M) ** 2 + length(p.A, p.B) ** 2 / 2, 'the completed square is the median identity');
    assert.ok(objective(plus(p.C, scale(delta, -p.r / d))) > objective(P));
    return objective(P);
  });
  check('bisectAreaBoth', 2, p => {
    const M = { x: (p.x1 + p.x2) / 2, y: (p.y1 + p.y2) / 2 }, m = (M.y - p.C.y) / (M.x - p.C.x), n = p.C.y - m * p.C.x;
    near(m * M.x + n, M.y, 'the bisector passes through the rectangle center'); near(m * p.C.x + n, p.C.y, 'the same bisector passes through the circle center');
    return m + n;
  });
  check('laserReflectTan', Math.sqrt(21), p => {
    const reflectedC = { x: p.C.x, y: -p.C.y }, v = minus(p.A, reflectedC), d2 = norm2(v);
    const tangent = plus(reflectedC, plus(scale(v, p.r ** 2 / d2), scale({ x: -v.y, y: v.x }, p.r * Math.sqrt(d2 - p.r ** 2) / d2)));
    const t = -p.A.y / (tangent.y - p.A.y), P = along(p.A, tangent, t), Q = { x: tangent.x, y: -tangent.y };
    assert.ok(t > 0 && t < 1, 'the unfolded ray reaches the mirror before the reflected contact point');
    near(P.y, 0, 'the reflection lies on the x axis'); near(length(Q, p.C), p.r, 'the reflected contact is on the original circle'); near(dot(minus(Q, p.C), minus(P, Q)), 0, 'the outgoing ray is tangent');
    return length(p.A, P) + length(P, Q);
  });
  assert.deepEqual(checked, ids, 'all current 32 first originals are checked exactly once');
});

const isTrace = options => options.color === 'violet' && options.width === 4.2 && options.alpha === .85;
const isEmphasis = options => options.color === 'violet' && options.glow === false && (options.r === 4.5 || options.hollow && options.r >= 5 && options.r <= 9);
function onSegment(p, a, b) {
  const delta = minus(b, a), d2 = norm2(delta), t = d2 ? Math.max(0, Math.min(1, dot(minus(p, a), delta) / d2)) : 0;
  return length(p, along(a, b, t)) < 1e-7;
}
function traceOnSource(frame, label) {
  const marker = frame.points.find(item => isEmphasis(item.options));
  assert.ok(marker, `${label}: real diagram emphasis starts within one second`);
  const p = marker.point;
  assert.ok(p.x >= frame.viewBox.x0 && p.x <= frame.viewBox.x1 && p.y >= frame.viewBox.y0 && p.y <= frame.viewBox.y1, `${label}: initial emphasis is visible`);
  if (marker.options.hollow) {
    assert.ok([...frame.points, ...frame.handles].some(other => !isEmphasis(other.options) && length(other.point, p) < 1e-8), 'the pulse centers on an actual condition point or handle');
    assert.ok(marker.options.r > 5 && marker.options.r <= 9);
    return 'point';
  }
  const onPath = frame.paths.some(path => {
    if (isTrace(path.options)) return false;
    const points = path.points.concat(path.options.close ? [path.points[0]] : []);
    return points.slice(1).some((b, i) => onSegment(p, points[i], b));
  });
  const onCircle = frame.circles.some(circle => !isTrace(circle.options) && Math.abs(length(p, circle.center) - circle.radius) < 1e-7);
  assert.ok(onPath || onCircle, `${label}: emphasis lies on an actual source path or exact circle`);
  return frame.arcs.some(arc => isTrace(arc.options)) ? 'circle' : 'path';
}
function named(frame, name) {
  const item = [...frame.points, ...frame.handles].find(item => item.options.label === name || item.options.label?.startsWith(name + '(') || item.options.label?.startsWith(name + ' ('));
  assert.ok(item, `the native diagram contains point ${name}`);
  return item.point;
}
function concept(id, mode) {
  const lesson = lessonsOf(id).find(item => firstSet(item).lceConcept && firstSet(item).lceMode === mode);
  assert.ok(lesson, `${id}: the authored ${mode} diagram is registered`);
  lab.go(id);
  const compiled = video.compileLesson(lesson), base = baseState();
  return { lesson, compiled, at(time) { apply(compiled, time, base); return lab.draw(); } };
}

test('all authored cues draw finite native geometry with actual first motion and isolated legacy cards', t => {
  let frames = 0;
  const traced = { path: 0, circle: 0, point: 0 };
  for (const scene0 of lab.list) for (const lesson of lessonsOf(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState(), packet = lab.api.first(scene.id), before = plain(packet), initialBefore = lab.api.initial(scene.id);
    const times = new Set([0, .8, compiled.length, compiled.chapters.at(-1).at - .01]);
    for (const cue of compiled.cues) { times.add(cue.at); times.add(Math.min(compiled.length, cue.at + (cue.dur || 0) / 2)); }
    let first, motion;
    const label = `${scene.id}/${lesson.label}`;
    for (const time of [...times].sort((a, b) => a - b)) {
      apply(compiled, time, base); const frame = lab.draw(); frames++;
      if (time === 0) first = frame;
      if (time === .8) motion = frame;
      assert.ok(frame.paths.length || frame.circles.length || frame.points.some(p => !isEmphasis(p.options)), `${label}@${time}: source condition geometry exists`);
      for (const path of frame.paths) for (const p of path.points) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
      for (const item of [...frame.points, ...frame.handles]) assert.ok(Number.isFinite(item.point.x) && Number.isFinite(item.point.y));
      for (const circle of frame.circles) assert.ok(Number.isFinite(circle.center.x) && Number.isFinite(circle.center.y) && Number.isFinite(circle.radius) && circle.radius >= 0);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc'), 'the native Board paints into canvas');
      assert.deepEqual(plain(frame.value), {}, 'legacy answer and formula cards are isolated during playback');
      assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.ok(stepsOf(scene).every(step => !step.includes('$')), 'PROB.attach returns neutral steps while the lesson is active');
      assert.equal(scene.vary.cur(), packet, 'the active selector retains the original first packet');
      if (time < compiled.chapters.at(-1).at) {
        assert.equal(lab.s.lceShowAnswer, false, `${label}: answer stays closed until the final chapter`);
        assert.ok(frame.texts.every(text => !/\d/.test(text)), `${label}@${time}: native and raw-canvas numeric answer labels remain closed`);
      }
      if (time === compiled.length) assert.equal(lab.s.lceShowAnswer, true);
    }
    assert.notEqual(signature(motion), signature(first), `${label}: native geometry changes within one second`);
    traced[traceOnSource(motion, label)]++;
    assert.deepEqual(plain(packet), before, 'playback does not mutate source problem data');
    assert.deepEqual(plain(lab.api.initial(scene.id)), plain(initialBefore), 'playback preserves the source initial values');
  }
  assert.equal(sum(Object.values(traced)), 104);
  assert.ok(traced.circle > 0 && traced.path > 0, 'actual circles and source paths are both exercised');
  t.diagnostic(`${frames} production Board/raw-canvas cue frames; first emphasis: ${traced.path} native paths, ${traced.circle} exact circles, ${traced.point} condition-point pulses; full browser/mobile visual audit NOT_RUN`);
});

test('actual new-problem clicks, attached steps and view transforms survive fixed-first replay', () => {
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), first = scene.vary.first(), lesson = sourceLessons(scene.id)[0], originalIndex = scene.vary.idx;
    assert.equal(stepsOf(scene), undefined, 'the original inquiry tab has no review steps');
    lab.tab = 'problem'; lab.s.revealed = true; lab.s.step = 3; lab.newProblem();
    const manual = scene.vary.cur(), manualText = scene.problem.text(lab.s, lab);
    assert.notEqual(manual, first); assert.notEqual(scene.vary.idx, originalIndex);
    assert.equal(lab.s.revealed, false); assert.equal(lab.s.step, 0);
    assert.equal(stepsOf(scene), manual.steps, 'PROB.attach observes the actual shell tab and current manual packet');
    lab.draw();
    Object.assign(lab.board, { zoom: 1.25, panX: 37, panY: -19 });
    const keep = { focus: lab.board.focus, zoom: lab.board.zoom, panX: lab.board.panX, panY: lab.board.panY, key: lab.board.__ceKey, exploration: lab.board.__ceEx };
    const manualGeometry = signature(lab.draw()), compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base); const question = scene.question(lab.s, lab), initialGeometry = signature(lab.draw());
    assert.equal(question, lab.api.question(scene.id)); assert.equal(scene.vary.cur(), first);
    assert.ok(!question.includes('data-ce-new'));
    assert.ok(stepsOf(scene).every(step => !step.includes('$')));
    apply(compiled, compiled.length, base); lab.draw(); apply(compiled, 0, base);
    assert.equal(scene.question(lab.s, lab), question);
    assert.equal(signature(lab.draw()), initialGeometry, `${scene.id}: replay restores the exact first-source diagram`);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem';
    assert.equal(scene.vary.cur(), manual); assert.equal(scene.problem.text(lab.s, lab), manualText);
    assert.equal(signature(lab.draw()), manualGeometry, `${scene.id}: the chosen manual problem remains available`);
    assert.equal(stepsOf(scene), manual.steps);
    assert.equal(lab.board.focus, keep.focus, 'native focus object is restored');
    assert.equal(lab.board.zoom, keep.zoom); assert.equal(lab.board.panX, keep.panX); assert.equal(lab.board.panY, keep.panY);
    assert.equal(lab.board.__ceKey, keep.key); assert.equal(lab.board.__ceEx, keep.exploration);
    const initial = lab.api.initial(scene.id), untouched = plain(initial); initial.r = 999;
    assert.deepEqual(plain(lab.api.initial(scene.id)), untouched, 'the source initial values are returned as an independent object');
  }
});

test('visible numeric answers wait for final, auto-fit measurements stay hidden and entry closes stale flags', () => {
  let finalNumericScenes = 0;
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), lesson = sourceLessons(scene.id)[0], compiled = video.compileLesson(lesson), base = baseState();
    const finalAt = compiled.chapters.at(-1).at;
    for (const time of new Set([0, finalAt - .01, ...compiled.cues.filter(cue => cue.at < finalAt).map(cue => cue.at)])) {
      apply(compiled, time, base); Object.assign(lab.s, { step: 99, lceStage: 3 });
      // This forces the actual source stage-99 sizing pass. It is not a
      // student-visible frame, so neither its geometry nor labels are captured.
      lab.board.__ceKey = null;
      const frame = lab.draw();
      assert.equal(lab.s.lceShowAnswer, false);
      assert.ok(frame.texts.every(text => !/\d/.test(text)), `${scene.id}: numeric Board and raw-canvas labels remain closed`);
      assert.deepEqual(plain(frame.value), {});
    }
    apply(compiled, compiled.length, base); const final = lab.draw();
    assert.equal(lab.s.lceShowAnswer, true);
    if (final.texts.some(text => /\d/.test(text))) finalNumericScenes++;
    for (const authored of lessonsOf(scene.id)) {
      const cs = video.compileLesson(authored), initial = baseState();
      apply(cs, 0, initial, true); const expected = signature(lab.draw());
      Object.assign(lab.s, { lceShowAnswer: true, lceStage: 3, step: 99 });
      const stale = lab.draw();
      assert.equal(signature(stale), expected, `${scene.id}/${authored.label}: entry forces the initial stage despite stale final state`);
      assert.ok(stale.texts.every(text => !/\d/.test(text)));
    }
  }
  assert.equal(finalNumericScenes, 32, 'original numeric figure labels are restored at every source conclusion');
});

test('lesson diagrams preserve circle-position boundaries, tangency, diameter bisection and moving centroid loci', () => {
  {
    const play = concept('threePts', 'collinear'), frame = play.at(play.compiled.length);
    const A = named(frame, 'A'), B = named(frame, 'B'), C = named(frame, 'C');
    near(length(A, { x: -48, y: 0 }), 0, 'first collinear point'); near(length(B, { x: 0, y: 0 }), 0, 'middle collinear point'); near(length(C, { x: 48, y: 0 }), 0, 'third collinear point');
    const bisectors = frame.paths.filter(path => path.options.dash?.length && path.points.length === 2 && path.points[0].x === path.points[1].x);
    assert.deepEqual(bisectors.map(path => path.points[0].x).sort((a, b) => a - b), [-24, 24], 'the two perpendicular bisectors are distinct parallel lines');
    assert.equal(frame.circles.length, 0, 'the collinear counterexample does not invent a circle');
  }
  {
    const cases = new Set();
    for (const lesson of lessonsOf('twoPos5').filter(item => firstSet(item).lceConcept && firstSet(item).lceMode === 'two-position')) {
      lab.go('twoPos5'); const compiled = video.compileLesson(lesson), base = baseState();
      for (const time of [...compiled.chapters.map(chapter => chapter.at), compiled.length]) {
        apply(compiled, time, base); const frame = lab.draw(), r1 = lab.s.lceR1, r2 = lab.s.lceR2, d = lab.s.lceD;
        const one = frame.circles.find(circle => circle.options.color === 'sky'), two = frame.circles.find(circle => circle.options.color === 'rose');
        assert.ok(one && two); near(one.radius, 24 * r1, 'first custom radius'); near(two.radius, 24 * r2, 'second custom radius'); near(length(one.center, two.center), 24 * d, 'actual center distance');
        const external = r1 + r2, internal = Math.abs(r1 - r2);
        const position = d > external ? 'separate' : Math.abs(d - external) < 1e-8 ? 'external-touch' : d > internal ? 'two' : Math.abs(d - internal) < 1e-8 ? 'internal-touch' : 'inside';
        const intersections = frame.points.filter(item => ['A', 'B', 'T'].includes(item.options.label));
        assert.equal(intersections.length, position === 'two' ? 2 : position.endsWith('touch') ? 1 : 0, 'the actual intersection count matches the strict or equality boundary');
        for (const item of intersections) { near(length(item.point, one.center), one.radius, 'intersection lies on first circle'); near(length(item.point, two.center), two.radius, 'intersection lies on second circle'); }
        cases.add(position);
      }
    }
    assert.deepEqual([...cases].sort(), ['external-touch', 'inside', 'internal-touch', 'separate', 'two']);
  }
  {
    const play = concept('bisectCircum', 'bisect-diameter'), frame = play.at(play.compiled.length);
    const O = named(frame, 'O'), C = named(frame, 'C'), A = named(frame, 'A'), B = named(frame, 'B');
    near(length(midpoint(A, B), O), 0, 'the common chord is a diameter of the bisected circle');
    near(length(O, A), 72, 'first radius'); near(length(C, A), 120, 'second radius'); near(length(C, B), 120, 'both diameter endpoints belong to the second circle');
    near(dot(minus(A, O), minus(C, O)), 0, 'the displayed construction is a genuine right triangle');
  }
  {
    const play = concept('tanPointOn', 'translated-point'), frame = play.at(play.compiled.length);
    const C = named(frame, 'C'), T = named(frame, 'T'), circle = frame.circles.find(item => item.options.color === 'sky');
    const tangent = frame.paths.find(path => path.options.color === 'amber' && path.options.width === 3.4);
    assert.ok(circle && tangent);
    assert.deepEqual(C, { x: 24, y: 24 }); assert.deepEqual(T, { x: 96, y: -72 });
    near(length(T, circle.center), circle.radius, 'the translated contact point lies on the actual circle');
    assert.ok(onSegment(T, tangent.points[0], tangent.points.at(-1)), 'the drawn tangent passes through T');
    for (const p of tangent.points) near(3 * p.x / 24 - 4 * p.y / 24, 24, 'every tangent endpoint satisfies the translated equation');
    near(dot(minus(T, C), minus(tangent.points.at(-1), tangent.points[0])), 0, 'the radius and actual tangent segment are perpendicular');
  }
  {
    const lesson = lessonsOf('equilMaxMin').find(item => firstSet(item).lceConcept && video.stateAt(video.compileLesson(item), video.compileLesson(item).length, { nums: {}, sets: {}, step: 0, part: null }).nums.d === 0);
    assert.ok(lesson, 'the authored maximum-area concept reaches the diameter case');
    lab.go('equilMaxMin'); const compiled = video.compileLesson(lesson); apply(compiled, compiled.length, baseState());
    const frame = lab.draw(), apex = named(frame, '정삼각형의 꼭짓점');
    assert.ok(apex.x >= frame.viewBox.x0 && apex.x <= frame.viewBox.x1 && apex.y >= frame.viewBox.y0 && apex.y <= frame.viewBox.y1, 'the actual d=0 triangle apex remains inside the lesson-only fixed focus');
  }
  {
    let minimum = false, maximum = false, centroid = false;
    for (const lesson of lessonsOf('pappusMinSq').filter(item => firstSet(item).lceConcept && ['pappus-full', 'centroid'].includes(firstSet(item).lceMode))) {
      lab.go('pappusMinSq'); const compiled = video.compileLesson(lesson), base = baseState();
      for (const time of [...compiled.chapters.map(chapter => chapter.at), compiled.length]) {
        apply(compiled, time, base); const frame = lab.draw(), A = named(frame, 'A'), B = named(frame, 'B'), M = named(frame, 'M'), P = named(frame, 'P');
        const original = frame.circles.find(circle => !circle.options.dash?.length), C = original.center, r = original.radius;
        near(length(midpoint(A, B), M), 0, 'M remains the midpoint of the two fixed points'); near(length(P, C), r, 'the actual moving point stays on the source circle');
        near(length(P, A) ** 2 + length(P, B) ** 2, 2 * length(P, M) ** 2 + length(A, B) ** 2 / 2, 'the drawn triangle satisfies the median identity');
        if (Math.abs(Math.sin(lab.s.lceAngle / 2)) < 1e-8) { near(length(P, M), Math.abs(length(C, M) - r), 'the minimum position is reached'); minimum = true; }
        if (Math.abs(Math.cos(lab.s.lceAngle / 2)) < 1e-8) { near(length(P, M), length(C, M) + r, 'the maximum position is reached'); maximum = true; }
        if (lab.s.lceMode === 'centroid') {
          const G = named(frame, 'G'), G0 = named(frame, 'G₀'), locus = frame.circles.find(circle => circle.options.dash?.length);
          near(length(G, scale(plus(plus(A, B), P), 1 / 3)), 0, 'the moving point is the actual triangle centroid');
          near(length(G0, plus(M, scale(minus(C, M), 1 / 3))), 0, 'the centroid locus center has the same affine transform');
          near(locus.radius, r / 3, 'the locus radius is one third'); near(length(G, G0), locus.radius, 'G lies on the drawn locus'); centroid = true;
        }
      }
    }
    assert.ok(minimum && maximum && centroid, 'the authored extrema and centroid constructions all execute');
  }
});
