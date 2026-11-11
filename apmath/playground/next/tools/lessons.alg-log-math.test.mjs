// Recompute the original equations and geometric claims independently of lesson cues.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/log-lesson-runtime.mjs';
const lab = await load(), source = lab.api;
const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-9, `${message}: ${actual} != ${expected}`);
const plain = value => JSON.parse(JSON.stringify(value));

test('log1 vertical differences and independent area sum match the original first problem', () => {
  const v = source.first('log1'), { k, x1, x2 } = v.e;
  assert.deepEqual(plain(v.e), { k: 4, x1: 2, x2: 5, ask: 'S' });
  assert.match(source.question('log1'), /log_2/);
  for (const x of [.125, .5, 1, 2, 3, 5, 7]) near(Math.log2(k * x) - Math.log2(x), 2, 'same vertical distance');
  const count = 1000, dx = (x2 - x1) / count;
  let area = 0;
  for (let i = 0; i < count; i++) {
    const x = x1 + (i + .5) * dx;
    area += (Math.log2(k * x) - Math.log2(x)) * dx;
  }
  near(area, 6, 'rectangle sum of actual source curves'); near(v.S, area, 'source answer');
  assert.match(source.answer('log1'), /S=6/);
});

test('log2 both roots satisfy the original equation and produce the stated product and midpoint', () => {
  const v = source.first('log2');
  assert.deepEqual(plain(v.e), { kind: 'absM', p: 0, t: 2, ask: 'prodM' });
  const roots = [.25, 4];
  for (const x of roots) near(Math.abs(Math.log2(x)), 2, 'original intersection');
  near(v.x1, roots[0], 'left root'); near(v.x2, roots[1], 'right root');
  near(roots[0] * roots[1], 1, 'product'); near((roots[0] + roots[1]) / 2, 17 / 8, 'midpoint x');
  assert.match(source.question('log2'), /중점/); assert.match(source.answer('log2'), /17\}\{8/);
});

test('squaring in a logarithm preserves the negative branch only with the absolute value', () => {
  for (const x of [-8, -2, -.5, .25, 1, 2, 8]) near(Math.log2(x * x), 2 * Math.log2(Math.abs(x)), 'both signs');
  assert.ok(Number.isNaN(2 * Math.log2(-2)), '2log2(x) is undefined on the negative branch');
  near(Math.log2((-2) ** 2), 2, 'the lost point is real');
  assert.ok(!Number.isFinite(Math.log2(0)), 'zero remains excluded');
  assert.match(source.exploration('log2').trap, /log_2\|x\|/);
});

test('shifted absolute logs have reciprocal distances, not reciprocal coordinates, and strict mean inequality', () => {
  const p = 2, x1 = 2.5, x2 = 4;
  near(Math.abs(Math.log2(x1 - p)), 1, 'shifted left intersection');
  near(Math.abs(Math.log2(x2 - p)), 1, 'shifted right intersection');
  near((x1 - p) * (x2 - p), 1, 'distance product'); near(x1 * x2, 10, 'coordinate product counterexample');
  for (const shift of [0, 1, 2, 3]) for (const t of [.5, 1, 2, 2.8]) {
    const a = 2 ** -t, b = 2 ** t, mid = shift + (a + b) / 2;
    near(a * b, 1, 'reciprocal positive distances');
    assert.ok(mid > shift + 1, 'strict inequality uses t > 0');
  }
  near((2 ** 0 + 2 ** 0) / 2, 1, 'at zero height the inequality becomes equality');
});

test('log3 reflection maps every sampled source point to the logarithmic curve and the axis is correct', () => {
  const v = source.first('log3'), { m, n, q } = v.e, p = v.p;
  assert.deepEqual(plain(v.e), { m: 1, n: 2, q: -1, k: 6, ask: 'CM', given: true });
  const C = -2;
  for (const x of [-2, 0, 1, 2, 3]) {
    const y = 2 ** (x - m) + n;
    const reflected = [y - C, x + C];
    near(Math.log2(reflected[0] - p) + q, reflected[1], 'reflected point lies on the actual logarithmic graph');
    near(((x + reflected[0]) / 2) + C, (y + reflected[1]) / 2, 'pair midpoint is on the axis');
  }
  near(v.C, C, 'source axis'); assert.deepEqual(plain(v.M0), [3, 1]);
  near(3 + C, 1, 'given-pair midpoint lies on axis');
});

test('log3 general shift condition is necessary and the original midpoint solves both lines', () => {
  for (const m of [-1, 0, 1, 2, 3]) {
    const n = 2, q = -1, C = q - m, p = m + n - q;
    for (const u of [-2, 0, 1, 2]) {
      const P = [m + u, 2 ** u + n], Q = [P[1] - C, P[0] + C];
      near(Math.log2(Q[0] - p) + q, Q[1], 'matched translations reflect the entire curve');
    }
    const u = 2, wrongP = p + 1, X = 2 ** u + p;
    assert.ok(Math.abs(Math.log2(X - wrongP) + q - (u + q)) > .1, 'changing p alone breaks symmetry');
  }
  const A = [2, 4], B = [6, 0], M = [4, 2];
  near(2 ** (A[0] - 1) + 2, A[1], 'A on exponential'); near(A[0] + A[1], 6, 'A on line');
  near(Math.log2(B[0] - 4) - 1, B[1], 'B on logarithm'); near(B[0] + B[1], 6, 'B on line');
  near((A[0] + B[0]) / 2, M[0], 'midpoint x'); near((A[1] + B[1]) / 2, M[1], 'midpoint y');
  near(M[1], M[0] - 2, 'M on axis'); near(M[1], -M[0] + 6, 'M on cutting line');
  near((A[0] - M[0]) * 1 + (A[1] - M[1]) * 1, 0, 'AB is perpendicular to axis direction');
});

test('log4 independent natural-pair enumeration agrees with row and column counts including endpoints', () => {
  const original = source.first('log4');
  assert.deepEqual(plain(original.e), { K: 9, ask: 'A' });
  const enumerate = K => {
    const points = [];
    for (let x = 1; x <= K; x++) for (let y = 1; y <= K; y++) if (y <= Math.log2(x)) points.push([x, y]);
    return points;
  };
  const points = enumerate(original.K);
  assert.equal(points.length, 16); assert.equal(original.total, points.length);
  assert.deepEqual([1, 2, 3].map(y => points.filter(p => p[1] === y).length), [8, 6, 2]);
  assert.deepEqual([2, 3, 4, 5, 6, 7, 8, 9].map(x => points.filter(p => p[0] === x).length), [1, 1, 2, 2, 2, 2, 3, 3]);
  for (const point of [[2, 1], [4, 2], [8, 3], [9, 3]]) assert.ok(points.some(p => p[0] === point[0] && p[1] === point[1]), 'boundary point is included');
  assert.ok(!points.some(p => p[0] === 1 || p[1] === 0));
  for (let K = 4; K <= 13; K++) {
    const actual = enumerate(K);
    for (let m = 1; m <= 4; m++) assert.equal(actual.filter(p => p[1] === m).length, 2 ** m <= K ? K - 2 ** m + 1 : 0, 'inclusive row count');
    assert.equal(actual.length, Array.from({ length: K }, (_, i) => Math.floor(Math.log2(i + 1))).reduce((a, b) => a + b, 0), 'columns partition the same points');
  }
});
