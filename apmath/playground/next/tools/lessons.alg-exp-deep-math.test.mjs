// Recompute the actual first source conditions independently of lesson captions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/exp-deep-lesson-runtime.mjs';
const lab = await load();
const source = id => lab.api.first(id);
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const sum = values => values.reduce((a, b) => a + b, 0);
const roots = (A, n) => n % 2 ? 1 : A < 0 ? 0 : A === 0 ? 1 : 2;
const frac = value => value - Math.floor(value + 1e-12);
function bisect(fn, lo, hi) {
  assert.ok(fn(lo) * fn(hi) <= 0, 'root is bracketed');
  const sign = fn(lo);
  for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (sign * fn(mid) > 0) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
const absRoots = (k, t) => t < 0 ? [] : [...new Set([k - t, k + t].filter(u => u > 0))].map(Math.log2);

test('t1a: the negative interval and the zero root give both original targets', () => {
  const v = source('t1a').fig;
  assert.deepEqual([v.r1, v.r2], [2, 6]);
  const f = k => (k - v.r1) * (k - v.r2);
  const ks = range(1, v.r2 + 2).filter(k => roots(f(k), 4) === 0);
  // Outside the two zeros both factors have the same sign, so no larger k is omitted.
  assert.deepEqual(ks, [3, 4, 5]);
  assert.equal(sum(ks), 12);
  assert.equal(sum(range(2, 5).map(n => roots(f(2), n))), 4);
  assert.deepEqual([-4, 0, 5].map(A => roots(A, 4)), [0, 1, 2]);
  assert.deepEqual([-4, 0, 5].map(A => roots(A, 3)), [1, 1, 1]);
});

test('t1b: root-count sums distinguish negative, zero and positive values', () => {
  const v = source('t1b').fig;
  assert.deepEqual([v.r1, v.r2], [1, 7]);
  const count = A => sum(range(2, 6).map(n => roots(A, n)));
  assert.deepEqual([-1, 0, 1].map(count), [2, 5, 8]);
  const ks = range(1, v.r2 + 2).filter(k => count((k - v.r1) * (k - v.r2)) === 5);
  assert.deepEqual(ks, [1, 7]); assert.equal(sum(ks), 8);
});

for (const [id, M, N, expectedRows, total] of [['t2a', 12, 6, [6,4,3,2,2], 17], ['t2b', 15, 5, [7,5,3,3], 18]]) {
  test(`${id}: raise candidate integers back to the nth power`, () => {
    const v = source(id).fig;
    assert.deepEqual([v.M, v.N], [M, N]);
    const rows = range(2, N).map(n => range(1, M).filter(m => {
      const candidate = Math.round(2 ** (m / n));
      const integerRoot = candidate ** n === 2 ** m;
      assert.equal(integerRoot, m % n === 0, `m=${m}, n=${n}`);
      return integerRoot;
    }).length);
    assert.deepEqual(rows, expectedRows); assert.equal(sum(rows), total);
  });
}

test('t3a: equal fractional parts include the left endpoint only', () => {
  const v = source('t3a').fig;
  assert.deepEqual([v.mode, v.p, v.d], [0, 3, 1]);
  const us = range(6, 11).map(n => n / 6).filter(u => Math.abs(frac(u) - frac(v.p * u)) < 1e-10);
  assert.deepEqual(us, [1, 1.5]);
  const xs = us.map(u => 10 ** u);
  assert.ok(xs.every(x => x >= 10 && x < 100));
  near(Math.log10(xs.reduce((a, b) => a * b, 1)), 2.5);
  near(frac(1.25), .25); near(frac(3 * 1.25), .75);
  near(frac(1.5), frac(3 * 1.5));
});

test('t3b: sum-one condition excludes the zero-fraction boundary', () => {
  const v = source('t3b').fig;
  assert.deepEqual([v.mode, v.p, v.d], [1, 2, 1]);
  const us = range(7, 11).map(n => n / 6).filter(u => Math.abs(frac(u) + frac(v.p * u) - 1) < 1e-10);
  assert.deepEqual(us, [4 / 3, 5 / 3]);
  near(us.map(u => 10 ** u).reduce((a, b) => a * b, 1), 1000);
  near(frac(1) + frac(2), 0);
  for (const u of us) { near(3 * u, Math.round(3 * u)); assert.ok(u !== Math.floor(u)); }
});

test('t4a: horizontal sections yield both constant width and area', () => {
  const v = source('t4a').fig;
  assert.deepEqual([v.k, v.t1, v.t2], [4, 2, 5]);
  let area = 0;
  for (let i = 0; i < 200; i++) {
    const y = v.t1 + (v.t2 - v.t1) * (i + .5) / 200;
    const left = Math.log2(y / v.k), right = Math.log2(y);
    near(2 ** left * v.k, y); near(2 ** right, y);
    near(right - left, 2);
    area += (right - left) * (v.t2 - v.t1) / 200;
  }
  near(area, 6);
});

test('t4b: arbitrary positive heights have logarithmic width', () => {
  const v = source('t4b').fig;
  assert.equal(v.k, 3);
  for (const t of [.25, 1, 3, 10]) {
    const xA = Math.log2(t / v.k), xB = Math.log2(t);
    near(v.k * 2 ** xA, 2 ** xB);
    near(xB - xA, Math.log2(3));
  }
});

test('t5a: the ratio of two logarithmic lengths is independent of height', () => {
  const packet = source('t5a');
  assert.deepEqual([packet.chk.p, packet.chk.q, packet.chk.kind], [1, 2, 'a']);
  for (const b of [1.5, 2, 3]) for (const t of [1.5, 2, 6]) {
    const a = b ** 2, HA = Math.log(t) / Math.log(a), HB = Math.log(t) / Math.log(b);
    assert.ok(HA > 0 && HA < HB); near(HB / HA, 2); near(Math.log(a) / Math.log(b), 2);
  }
});

test('t5b: HA to AB differs from HA to HB', () => {
  const packet = source('t5b');
  assert.deepEqual([packet.chk.p, packet.chk.q, packet.chk.kind], [2, 1, 'b']);
  for (const b of [1.5, 2, 3]) for (const t of [1.5, 4, 6]) {
    const a = b ** 1.5, HA = Math.log(t) / Math.log(a), HB = Math.log(t) / Math.log(b);
    near(HA / (HB - HA), 2); near(HB / HA, 1.5); near(a ** 2, b ** 3);
  }
});

test('t6a: solve the original height sum before checking the middle point', () => {
  const packet = source('t6a');
  assert.deepEqual([packet.chk.d, packet.chk.Y], [1, 14]);
  const d = packet.chk.d;
  const x = bisect(x => 2 ** (x - d) + 2 ** x + 2 ** (x + d) - 14, -2, 5);
  near(x, 2); near(2 ** x, 4);
  for (const gap of [.5, 1, 1.5, 2]) {
    const y1 = 2 ** (x - gap), y2 = 2 ** x, y3 = 2 ** (x + gap);
    near(y2 / y1, y3 / y2); near(y2 * y2, y1 * y3);
  }
});

test('t6b: the midpoint of logarithmic inputs has the positive geometric height', () => {
  const v = source('t6b').fig;
  assert.deepEqual([v.y1, v.y3], [1, 16]);
  const x1 = Math.log2(v.y1), x3 = Math.log2(v.y3), x2 = (x1 + x3) / 2, y2 = 2 ** x2;
  near(x2, 2); near(y2, 4); near(y2 * y2, v.y1 * v.y3);
  assert.ok(y2 > 0);
});

test('t7a: the quartic in positive u has three distinct real-x solutions', () => {
  const packet = source('t7a');
  assert.deepEqual([packet.chk.c, packet.chk.e], [5, 8]);
  const polynomial = u => u ** 4 - 5 * u ** 3 + 8 * u * u - 5 * u + 1;
  for (const u of [.2, 1, 2, 4]) near(polynomial(u), (u - 1) ** 2 * (u * u - 3 * u + 1));
  const us = [1, (3 - Math.sqrt(5)) / 2, (3 + Math.sqrt(5)) / 2];
  assert.ok(us.every(u => u > 0));
  const xs = us.map(Math.log2);
  assert.equal(new Set(xs).size, 3); near(sum(xs), 0);
  for (const x of xs) near(4 ** x + 4 ** -x - 5 * (2 ** x + 2 ** -x) + 8, 0);
  for (const u of [.2, 1, 2, 4]) near(u + 1 / u - 2, (u - 1) ** 2 / u);
});

test('t7b: both positive substitution roots give the sum and product of x', () => {
  const v = source('t7b').fig;
  assert.equal(v.base, 2); assert.equal(v.ts[0], 2.5);
  const t = v.ts[0], us = [(t - Math.sqrt(t * t - 4)) / 2, (t + Math.sqrt(t * t - 4)) / 2];
  assert.deepEqual(us, [.5, 2]);
  const xs = us.map(Math.log2);
  for (const x of xs) near(2 ** x + 2 ** -x, 2.5);
  near(sum(xs), 0); near(xs[0] * xs[1], -1);
});

test('t8a: positivity and duplicate removal give both original targets', () => {
  const v = source('t8a').fig;
  assert.deepEqual([v.k, v.t], [4, 2]);
  const xs = absRoots(v.k, v.t);
  assert.equal(xs.length, 2);
  for (const x of xs) near(Math.abs(2 ** x - v.k), v.t);
  near(2 ** sum(xs), 12);
  const heights = range(1, 8).filter(t => absRoots(v.k, t).length === 2);
  assert.deepEqual(heights, [1, 2, 3]); assert.equal(sum(heights), 6);
  assert.deepEqual([-.1, 0, 2, 4, 4.1].map(t => absRoots(v.k, t).length), [0, 1, 2, 1, 1]);
});

test('t8b: solve the zero sum of logarithmic intersections within the valid interval', () => {
  const v = source('t8b').fig;
  assert.equal(v.k, 3);
  const t = bisect(height => Math.log2(v.k - height) + Math.log2(v.k + height), 0, v.k - 1e-8);
  assert.ok(t > 0 && t < v.k);
  near(t * t, 8); near(t, v.t);
  const xs = absRoots(v.k, t);
  assert.equal(xs.length, 2); near(sum(xs), 0);
  for (const x of xs) near(Math.abs(2 ** x - v.k), t);
});
