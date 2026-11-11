// Independent calculations from the first problem's conditions.
// This is a mathematical release check, not a mobile/visual review.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/functions-lesson-runtime.mjs';

const lab = await load({ allowMissingLessons: true });
const near = (actual, expected, note = '') => assert.ok(Math.abs(actual - expected) < 1e-8, `${note}: ${actual} != ${expected}`);
const original = id => {
  const found = lab.video.lessonList(lab.def.lessons[id]).filter(l => !l.chapters[0].cues[0].set.lcfConcept);
  assert.equal(found.length, 1, `${id} has one first-source lesson`);
  assert.equal(found[0].chapters[0].cues[0].set.lcfQuestion, lab.api.question(id));
  return found[0];
};
function result(id, expected) {
  const lesson = original(id), match = lesson.answer.match(/=(-?\d+)\$$/);
  assert.ok(match, `${id}: explicit numerical conclusion`);
  near(Number(match[1]), expected, id);
  assert.ok(lesson.chapters.at(-1).cues.some(cue => cue.say?.includes(lesson.answer)), `${id}: final caption states the answer`);
  const packet = lab.api.first(id);
  if (packet?.ans) near(packet.ans.val, expected, `${id} first problem answer`);
}
function area(points) {
  let twice = 0;
  points.forEach((p, i) => { const q = points[(i + 1) % points.length]; twice += p[0] * q[1] - p[1] * q[0]; });
  return Math.abs(twice) / 2;
}
function realRoots(a, b, c) {
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  if (Math.abs(d) < 1e-12) return [-b / (2 * a)];
  return [(-b - Math.sqrt(d)) / (2 * a), (-b + Math.sqrt(d)) / (2 * a)];
}
const distinct = values => values.sort((a, b) => a - b).filter((x, i, all) => !i || Math.abs(x - all[i - 1]) > 1e-8);

test('adv-1: recover two positive distances from chord length and triangle area', () => {
  assert.match(lab.api.question('adv-1'), /4\\sqrt\{2\}/);
  assert.match(lab.api.question('adv-1'), /16/);
  const chord = 4 * Math.SQRT2, triangleArea = 16;
  const gap = chord / Math.SQRT2, sum = 2 * triangleArea / gap;
  const a = (sum - gap) / 2, b = (sum + gap) / 2, k = a * b;
  assert.ok(0 < a && a < b);
  near(area([[0, 0], [a, b], [b, a]]), triangleArea);
  near(area([[a, 0], [a, b], [b, a], [b, 0]]), triangleArea);
  near(Math.hypot(b - a, a - b), chord);
  result('adv-1', k);
});

test('adv-2: recover the radical function from the two triangle areas', () => {
  assert.match(lab.api.question('adv-2'), /\\dfrac\{3\}\{2\}/);
  const totalArea = 10, ratio = 3 / 2, base = 2 * Math.SQRT2;
  const areaO = totalArea / (1 + ratio), areaC = ratio * areaO;
  const midCoordinate = 2 * areaO / base / Math.SQRT2;
  const p = midCoordinate - 1, c = midCoordinate + 2 * areaC / base / Math.SQRT2;
  const a = (c - p - 2) ** 2 / (c - p);
  assert.ok(a > 0 && p > 0 && c >= p + 2);
  const f = x => Math.sqrt(a * (x - p)) + p + 2;
  near(f(c), c);
  near(area([[0, 0], [p, p + 2], [c, c], [p + 2, p]]), totalArea);
  result('adv-2', f(10));
});

test('adv-3: count only admissible radical and rational roots at every boundary', () => {
  assert.match(lab.api.question('adv-3').replace(/\\lt\s*/g, '< ').replace(/\s+/g, ' '), /1 < k < 2/);
  const lower = 1, upper = 2, a = -((upper / 2) ** 2), b = 2 * Math.sqrt(lower);
  const count = k => realRoots(1, -b, k).filter(v => v >= -1e-10).length
    + realRoots(1, k, -a).filter(z => z < 0).length;
  for (const [k, n] of [[-2, 1], [-.1, 1], [0, 2], [.5, 2], [1, 1], [1.5, 0], [2, 1], [3, 2]]) assert.equal(count(k), n, `k=${k}`);
  const m = Array.from({ length: 13 }, (_, i) => i - 6).find(k => count(k) === 2);
  const v = b / 2, P = [v * v + 1, b * v + 1];
  const u = Math.sqrt(-a), Q = [1 - u, a / (-u) + 1];
  near(P[1] - P[0], lower);
  near(Q[1] - Q[0], upper);
  result('adv-3', a + b + m + (P[0] - Q[0]) ** 2 + (P[1] - Q[1]) ** 2);
});

test('adv-4: solve all segment combinations of f(f(x))=x', () => {
  const f = x => x < 0 ? -x / 5 + 3 : -2 * x + 3;
  const branches = [{ m: -1 / 5, b: 3, accepts: x => x < 0 }, { m: -2, b: 3, accepts: x => x >= 0 }];
  const candidates = [];
  for (const inside of branches) for (const outside of branches) {
    const x = -(outside.m * inside.b + outside.b) / (outside.m * inside.m - 1);
    const y = inside.m * x + inside.b;
    if (inside.accepts(x) && outside.accepts(y)) { near(f(y), x); candidates.push([x, y]); }
  }
  assert.equal(candidates.length, 3);
  candidates.sort((p, q) => p[0] - q[0]);
  result('adv-4', 2 * area(candidates));
});

test('adv-5: verify a global distance lower bound and its equality point', () => {
  const distanceSquared = u => (u + 2) ** 2 + (4 / u + 2) ** 2;
  // An alternative factorization: AP²-32=(w-4)(w+8),
  // w=u+4/u and w-4=(u-2)²/u, nonnegative for every u>0.
  for (const u of [.1, .5, 1, 2, 4, 10]) {
    const w = u + 4 / u;
    near(w - 4, (u - 2) ** 2 / u);
    near(distanceSquared(u) - 32, (w - 4) * (w + 8));
    assert.ok(distanceSquared(u) >= 32 - 1e-10);
  }
  const u = 2, P = [1 + u, 2 + 4 / u], radius = Math.SQRT2;
  const m = Math.sqrt(distanceSquared(u)) - radius;
  result('adv-5', m / Math.SQRT2 + P[0] + P[1]);
});

test('adv-6: resolve the exceptional level and the admissible chord root', () => {
  const p = lab.api.first('adv-6');
  assert.deepEqual(JSON.parse(JSON.stringify(p)), { p: 3, c: 4, q: 2, t: 1 });
  const rootsAt = t => [p.p + p.c / (p.q + t), ...(t === p.q ? [] : [p.p + p.c / (p.q - t)])];
  assert.equal(rootsAt(p.q).length, 1);
  for (const t of [.5, 1, 3]) {
    const xs = rootsAt(t);
    assert.equal(new Set(xs).size, 2);
    xs.forEach(x => near(Math.abs(p.c / (x - p.p) - p.q), t));
  }
  const chord = 8 / 3;
  const possible = realRoots(chord, 2 * p.c, -chord * p.q * p.q).filter(t => 0 < t && t < p.q);
  assert.equal(possible.length, 1);
  const t = possible[0], xs = rootsAt(t);
  near(Math.abs(xs[1] - xs[0]), chord);
  result('adv-6', p.q + t);
});

test('adv-7: translated polygon boundaries preserve the exact strip area', () => {
  const { c, w, d } = lab.api.first('adv-7'), height = c * Math.sqrt(w), points = [];
  for (let i = 0; i <= 32; i++) { const y = height * i / 32; points.push([y * y / (c * c), y]); }
  for (let i = 32; i >= 0; i--) { const y = height * i / 32; points.push([y * y / (c * c) + d, y]); }
  near(area(points), d * height);
  result('adv-7', area(points));
});

test('adv-8: independently solve both composed piecewise linear equations', () => {
  assert.equal(lab.api.first('adv-8').h, 2);
  const f = x => x < 2 ? 2 * x : 8 - 2 * x, edges = [0, 1, 2, 3, 4];
  const solve = fn => distinct(edges.slice(0, -1).flatMap((left, i) => {
    const right = edges[i + 1], y0 = fn(left), y1 = fn(right), slope = (y1 - y0) / (right - left);
    assert.ok(Math.abs(slope) > 1e-12);
    const x = left - y0 / slope;
    return x >= left - 1e-9 && x <= right + 1e-9 ? [x] : [];
  }));
  const first = solve(x => f(f(x)) - f(x)), second = solve(x => f(f(x)) - x);
  first.forEach(x => near(f(f(x)), f(x)));
  second.forEach(x => near(f(f(x)), x));
  const sum = first.reduce((a, b) => a + b, 0);
  near(sum, 8); assert.equal(second.length, 4);
  result('adv-8', sum + second.length);
});

test('b9-1: compose and invert the actual first arrow permutations', () => {
  const { f, g } = lab.api.first('b9-1'), X = [1, 2, 3, 4], Z = [5, 6, 7, 8];
  assert.equal(new Set(f).size, X.length); assert.equal(new Set(g).size, Z.length);
  const forward = Z[g[f[X.indexOf(3)]]], inverse = X[f.indexOf(3)];
  result('b9-1', forward + inverse);
  assert.equal(X[f.indexOf(g.indexOf(Z.indexOf(5)))], 4);
});

test('b9-2: count integers with two nonzero slopes of the same sign', () => {
  const { B1, A2, B2 } = lab.api.first('b9-2').P;
  const boundary1 = B1, boundary2 = -B2 / A2;
  const lo = Math.min(boundary1, boundary2), hi = Math.max(boundary1, boundary2);
  const integers = [];
  for (let a = Math.floor(lo) + 1; a < hi; a++) {
    assert.ok((B1 - a) * (A2 * a + B2) > 0);
    integers.push(a);
  }
  near((B1 - boundary1) * (A2 * boundary1 + B2), 0);
  near((B1 - boundary2) * (A2 * boundary2 + B2), 0);
  result('b9-2', integers.length);
});

test('b9-3: read the original graph nodes forward twice and backward once', () => {
  const { N } = lab.api.first('b9-3');
  const map = new Map(N.slice(0, -1).map((x, i) => [x, N[i + 1]]));
  const forward = map.get(map.get(2));
  const inverse = [...map.entries()].find(([, y]) => y === 7)?.[0];
  assert.ok(Number.isFinite(forward) && Number.isFinite(inverse));
  result('b9-3', forward + inverse);
});

test('b9-4: infer coefficients from the two given points and inverse symmetry', () => {
  const { pts } = lab.api.first('b9-4'), [p, q] = pts;
  const a = (p[0] * p[1] - q[0] * q[1]) / (p[0] + p[1] - q[0] - q[1]);
  const b = (p[0] - a) * (p[1] - a) - a * a, c = -a;
  assert.notEqual(a * c, b, 'the function must not reduce to a constant');
  const f = x => (a * x + b) / (x + c);
  pts.forEach(([x, y]) => near(f(x), y));
  for (const x of [-3, 0, 2, 5]) near(f(f(x)), x);
  result('b9-4', a * b * c);
});

test('b9-5: enumerate distinct injective value lists without the source counter', () => {
  const { P } = lab.api.first('b9-5'), maps = new Set();
  for (let mask = 0; mask < 2 ** P.X.length; mask++) {
    const values = P.X.map((x, index) => mask & (1 << index) ? -P.k * x : -x * x + P.al);
    if (new Set(values).size === P.X.length) maps.add(values.join(','));
  }
  assert.equal(2 ** P.X.length - maps.size, 4);
  result('b9-5', maps.size);
});
