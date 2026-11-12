// Independent arithmetic, coordinate geometry and bracketed roots from the
// first source conditions. These checks do not certify browser visual quality.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/trig-geometry-lesson-runtime.mjs';

const lab = await load({ sourceOnly: true }), api = lab.api, pi = Math.PI, tau = 2 * pi;
const near = (a, b, msg = '') => assert.ok(Math.abs(a - b) < 2e-8, `${msg}: ${a} ≠ ${b}`);
const model = (id, t = api.first(id).defaultT) => api.model(id, t);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const cosine = (o, a, b) => ((a.x - o.x) * (b.x - o.x) + (a.y - o.y) * (b.y - o.y)) / (distance(o, a) * distance(o, b));
const triangle = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
const polygon = ps => Math.abs(ps.reduce((sum, p, i) => { const q = ps[(i + 1) % ps.length]; return sum + p.x * q.y - p.y * q.x; }, 0)) / 2;
const sortedUnique = xs => xs.sort((a, b) => a - b).filter((x, i, a) => !i || Math.abs(x - a[i - 1]) > 1e-7);
const sinCuts = value => {
  if (Math.abs(value) > 1) return [];
  const a = Math.asin(value), wrap = x => (x + tau) % tau;
  return sortedUnique([wrap(a), wrap(pi - a)]);
};
// Bisect each monotone interval of the original function. Supplied breakpoints
// include stationary/touching points so even-multiplicity roots are counted.
function bracketRoots(f, cuts, closed = false) {
  const breaks = sortedUnique([0, tau, ...cuts].filter(x => x >= 0 && x <= tau));
  const roots = breaks.filter(x => Math.abs(f(x)) < 1e-10);
  for (let i = 1; i < breaks.length; i++) {
    let lo = breaks[i - 1], hi = breaks[i], fl = f(lo), fh = f(hi);
    if (Math.abs(fl) < 1e-10 || Math.abs(fh) < 1e-10 || fl * fh >= 0) continue;
    for (let j = 0; j < 55; j++) {
      const mid = (lo + hi) / 2, fm = f(mid);
      if (fl * fm <= 0) { hi = mid; fh = fm; } else { lo = mid; fl = fm; }
    }
    roots.push((lo + hi) / 2);
  }
  return sortedUnique(roots).filter(x => closed || x < tau - 1e-7);
}
const folded = (a, c, h, closed = false) => h < 0 ? [] : bracketRoots(x => Math.abs(a * Math.sin(x) - c) - h, [pi / 2, 3 * pi / 2, ...sinCuts(c / a)], closed);
const compareRoots = (actual, expected, f) => {
  assert.equal(actual.length, expected.length);
  actual.forEach((x, i) => { near(x, expected[i]); near(f(x), 0, 'root satisfies the original equation'); });
};

test('bas-1: perimeter fixes the quadratic maximum and its four requested values', () => {
  const m = model('bas-1');
  near(2 * m.r + m.l, 20); near(m.area, m.r * m.l / 2);
  near(m.r, 5); near(m.l, 10); near(m.l / m.r, 2); near(m.area, 25);
  for (const t of [.07, .22, .5, .8, 1]) {
    const p = model('bas-1', t);
    near(25 - p.area, (p.r - 5) ** 2); assert.ok(p.area <= 25 + 1e-9);
  }
  for (const { P } of lab.variant['bas-1'].pool) { const r = P / 4, l = P - 2 * r; near(l / r, 2); near(r * l / 2, P * P / 16); }
});

test('bas-2: first-quadrant sign, counterclockwise rotation and reflection give the sum', () => {
  const m = model('bas-2'), theta = Math.asin(3 / 5);
  near(m.theta, theta); near(m.x, Math.sqrt(1 - (3 / 5) ** 2)); assert.ok(m.x > 0);
  const Q = { x: -m.y, y: m.x }, R = { x: m.y, y: m.x };
  near(Q.x, Math.cos(pi / 2 + theta)); near(R.y, Math.sin(pi / 2 - theta)); near(Q.x + R.y, 1 / 5);
  near(Q.x * m.x + Q.y * m.y, 0); near(Q.x ** 2 + Q.y ** 2, 1);
});

test('bas-3: all four roots satisfy the curve and paired weighted sums are constant', () => {
  for (const t of [.1, .5, .9]) {
    const m = model('bas-3', t), [a, b, c, d] = m.xs;
    assert.ok(0 < a && a < b && b < c && c < d && d < tau);
    m.xs.forEach(x => near(Math.sin(2 * x), m.k));
    near(a + d, 3 * pi / 2); near(b + c, 3 * pi / 2); near(a + 2 * b + 2 * c + d, 9 * pi / 2);
    for (const weights of lab.variant['bas-3'].pool) near(weights.a * (a + d) + weights.b * (b + c), (weights.a + weights.b) * 3 * pi / 2);
  }
});

test('bas-4: folding, both tangencies and the excluded right endpoint retain exact counts', () => {
  for (const [h, count] of [[0, 2], [1, 4], [2, 3], [3, 2], [4, 1], [4.5, 0]]) {
    const m = model('bas-4', h / 4.5), roots = folded(3, 1, h);
    compareRoots(m.roots, roots, x => Math.abs(3 * Math.sin(x) - 1) - h); assert.equal(roots.length, count);
  }
  near(2 + 4, 6);
  assert.equal(folded(3, 1, 1, true).length, 5); assert.equal(folded(3, 1, 1).length, 4);
});

test('bas-5: the original cosine equation has three distinct roots and the stated sum', () => {
  const f = x => 2 * Math.cos(x) ** 2 - Math.sin(x) - 1;
  const roots = bracketRoots(f, [pi / 2, 3 * pi / 2, ...sinCuts(-1 / 4)]);
  compareRoots(roots, [pi / 6, 5 * pi / 6, 3 * pi / 2], f);
  near(roots.reduce((s, x) => s + x, 0), 5 * pi / 2);
  assert.equal(model('bas-5', .1).roots.length, 2); assert.equal(model('bas-5', 0).roots.length, 1);
});

test('bas-6: a diameter makes the chord and companion leg a right triangle', () => {
  const m = model('bas-6'); near(m.R, 4); near(m.A, pi / 3);
  for (const spec of lab.variant['bas-6'].pool) {
    const A = pi / Number(spec.A), R = spec.R;
    const B = { x: -R * Math.sin(A), y: -R * Math.cos(A) }, C = { x: -B.x, y: B.y }, D = { x: -B.x, y: -B.y };
    near(distance(B, D), 2 * R); near(cosine(C, B, D), 0);
    near(distance(B, C), 2 * R * Math.sin(A)); near(distance(D, C), 2 * R * Math.cos(A));
    const P = { x: R * Math.cos(.8), y: R * Math.sin(.8) }; near(Math.acos(cosine(P, B, C)), A);
  }
  near(2 * m.R * Math.sin(m.A), 4 * Math.sqrt(3)); near(2 * m.R * Math.cos(m.A), 4);
});

test('bas-7: measured cyclic quadrilateral agrees with both cosine-law equations', () => {
  const m = model('bas-7');
  for (const [a, b, length] of [[m.A, m.B, 2], [m.B, m.C, 3], [m.C, m.D, 4], [m.D, m.A, 3]]) near(distance(a, b), length);
  const cosB = cosine(m.B, m.A, m.C), cosD = cosine(m.D, m.A, m.C);
  near(cosB, -1 / 3); near(cosB, -cosD);
  near(distance(m.A, m.C) ** 2, 13 - 12 * cosB); near(distance(m.A, m.C) ** 2, 25 - 24 * cosD); near(distance(m.A, m.C) ** 2, 17);
});

test('bas-8: area splitting needs equal angles only at the actual bisector', () => {
  const m = model('bas-8'), expected = 2 * 6 * 3 * Math.cos(pi / 3) / (6 + 3);
  near(distance(m.A, m.B), 6); near(distance(m.A, m.C), 3); near(m.alpha, pi / 3); near(m.beta, pi / 3); near(m.AD, expected);
  near(m.area, 9 * Math.sqrt(3) / 2); near(m.area1, 3 * Math.sqrt(3)); near(m.area2, 3 * Math.sqrt(3) / 2);
  for (const t of [.24, .75]) { const p = model('bas-8', t); near(p.area1 + p.area2, m.area); near(p.alpha + p.beta, 2 * pi / 3); assert.ok(Math.abs(p.alpha - p.beta) > .01); }
  for (const { c, b } of lab.variant['bas-8'].pool) { const x = 2 * c * b * Math.cos(pi / 3) / (c + b); near(x * (c + b), c * b); }
});

test('adv-1: reflection, strict half-plane and nonzero area leave exactly two candidates', () => {
  const valid = [];
  for (let n = 0; n < 6; n++) {
    const theta = n * pi / 3 + pi / 12, m = model('adv-1', theta / tau);
    near(m.Q.x, m.P.y); near(m.Q.y, m.P.x); assert.equal(m.mirror, true);
    const area = triangle({ x: 0, y: 0 }, m.P, m.Q); near(m.area, area);
    if (m.P.y > m.P.x && area > 1e-9) valid.push(theta);
  }
  assert.equal(valid.length, 2); near(valid[0], 5 * pi / 12); near(valid[1], 13 * pi / 12); near(valid[0] + valid[1], 3 * pi / 2);
  const rejected = model('adv-1', 3 / 8); assert.equal(rejected.upper, true); assert.equal(rejected.collinear, true); near(rejected.area, 0);
});

test('adv-2: solving the area equation and k domain rejects the obtuse alternative', () => {
  const m = model('adv-2');
  // u(2-u)=3/4 has u=1/2 or 3/2; 1<k<sqrt(2) chooses the latter.
  for (const u of [.5, 1.5]) near(u * (2 - u) / 4, 3 / 16);
  assert.ok(m.k > 1 && m.k < Math.sqrt(2)); near(m.k ** 2, 1.5);
  near(m.x ** 2 + m.y ** 2, 1); near(m.x + m.y, m.k); assert.ok(m.x > 0 && m.y > 0);
  near(Math.abs(m.x * m.x - m.y * m.y) / 2, Math.sqrt(3) / 4);
  near(Math.acos(2 * m.x * m.y), pi / 3); near(m.h, Math.sqrt(3) / 2); near(m.x * m.y, .25);
  near(2 * m.k ** 2 + 4 * m.x * m.y, 4);
  const boundary = model('adv-2', 0); near(boundary.x, 0); near(boundary.y, 1); near(Math.acos(2 * boundary.x * boundary.y), pi / 2);
});

test('adv-3: slope ratio, four curve points and shoelace area agree', () => {
  const m = model('adv-3'), A = { x: m.x1, y: m.k }, B = { x: m.x2, y: m.k }, C = { x: m.x3, y: -m.k }, D = { x: m.x4, y: -m.k };
  near((m.k / A.x) / (m.k / B.x), 5); near(A.x + B.x, 6); near(A.x, 1); near(B.x, 5); near(m.k, 1.5);
  for (const p of [A, B, C, D]) near(3 * Math.sin(pi * p.x / 6), p.y);
  near((A.x + D.x) / 2, 6); near((B.x + C.x) / 2, 6); near((A.y + D.y) / 2, 0);
  near(polygon([A, B, D, C]), 12); near(m.area, polygon([A, B, D, C]));
  for (const t of [.2, .58]) { const p = model('adv-3', t); near(p.x1 + p.x4, 12); near(p.x2 + p.x3, 12); near(p.x2 - p.x1, p.x4 - p.x3); }
});

test('adv-4: every amplitude regime and the closed endpoints support only a=3,b=-2', () => {
  for (const [a, c, threes] of [[1, 2, [2]], [2, 2, [2]], [3, 2, [1, 2]], [4, 2, []], [5, 2, [3]]]) {
    const boundaries = sortedUnique([0, c, Math.abs(a - c), a + c]);
    const levels = sortedUnique([...boundaries, ...boundaries.slice(1).map((x, i) => (x + boundaries[i]) / 2), a + c + .5]);
    const found = [];
    for (const h of levels) {
      const roots = folded(a, c, h, true), actual = api.foldedRoots(a, -c, h, true);
      compareRoots(actual, roots, x => Math.abs(a * Math.sin(x) - c) - h);
      if (roots.length === 3) found.push(h);
    }
    assert.deepEqual(found, threes, `a=${a}, c=${c}`);
  }
  assert.equal(model('adv-4', 1 / 5.5).roots.length, 3); assert.equal(model('adv-4', 2 / 5.5).roots.length, 3);
  assert.equal(folded(3, 2, 2).length, 2); near(3 - (-2) + Math.abs(-3 - 2), 10);
});

test('adv-5: original polynomial root counts include overlap, zero and both boundary contacts', () => {
  const valid = [];
  for (const k of [-1.2, -1, -.5, 0, .5, .8, 1, 1.2]) {
    const f = x => 2 * Math.sin(x) ** 2 - (2 * k + 1) * Math.sin(x) + k;
    const roots = bracketRoots(f, [pi / 2, 3 * pi / 2, ...sinCuts((2 * k + 1) / 4)]);
    const m = model('adv-5', (k + 1.2) / 2.4);
    compareRoots(m.roots, roots, f);
    if (roots.length === 3) valid.push({ k, sum: roots.reduce((s, x) => s + x, 0) });
    if (k === .5) assert.equal(roots.length, 2);
    if (k === 0) { assert.equal(roots.length, 4); assert.ok(roots.includes(0)); assert.ok(!roots.includes(tau)); }
  }
  assert.deepEqual(valid.map(p => p.k), [-1, 1]);
  near(valid[0].sum, 5 * pi / 2); near(valid[1].sum, 3 * pi / 2);
  near(valid.reduce((p, item) => p * item.k, 1) * Math.max(...valid.map(p => p.sum)) / pi, -2.5);
});

test('adv-6: fixed chord, height bound and coordinates give the same maximum', () => {
  const best = model('adv-6'); near(best.R, 2 * Math.sqrt(3)); near(distance(best.B, best.C), 6);
  for (const t of [0, .22, .5, .78, 1]) {
    const m = model('adv-6', t); near(distance({ x: 0, y: 0 }, m.A), m.R);
    near(cosine(m.A, m.B, m.C), .5); near(m.area, triangle(m.A, m.B, m.C));
    near(m.h, m.A.y + Math.sqrt(3)); assert.ok(m.h <= 3 * Math.sqrt(3) + 1e-9);
    if (t !== .5) assert.ok(m.area < best.area);
  }
  near(best.AB, 6); near(best.AC, 6); near(best.area, 9 * Math.sqrt(3)); near(best.AB + best.AC + Math.sqrt(3) * best.area, 39);
});

test('adv-7: cyclic supplementary areas, diagonal and circumradius satisfy the requested expression', () => {
  const m = model('adv-7');
  near(distance(m.A, m.B), 3); near(distance(m.B, m.C), 5); near(m.CD, 2); near(m.DA, 3);
  near(cosine(m.B, m.A, m.C), .5); near(cosine(m.D, m.A, m.C), -.5); near(distance(m.A, m.C) ** 2, 19);
  near(triangle(m.A, m.B, m.C) / triangle(m.A, m.C, m.D), 2.5);
  near(m.R ** 2, 19 / 3); near(3 * m.R ** 2 + m.DA, 22);
  for (const t of [.28, .85]) { const p = model('adv-7', t); near(triangle(p.A, p.B, p.C) / triangle(p.A, p.C, p.D), 15 / (p.CD * p.DA)); }
});

test('adv-8: projection symmetry and the independent adjacent-cosine calculation agree', () => {
  const m = model('adv-8');
  near(distance(m.A, m.B), 5); near(distance(m.A, m.C), 7); near(distance(m.B, m.C), 6); near(m.BD / m.DC, .5);
  near(cosine(m.B, m.A, m.C), .2);
  const H = { x: m.A.x, y: 0 }; near(distance(m.B, H), 1); near(distance(H, m.D), 1); near(m.AD, 5);
  const cosAlpha = cosine(m.D, m.B, m.A), cosSupplement = cosine(m.D, m.A, m.C);
  near(cosAlpha, (m.AD ** 2 - 21) / (4 * m.AD)); near(cosSupplement, (m.AD ** 2 - 33) / (8 * m.AD)); near(cosAlpha + cosSupplement, 0);
  near(49 * 2 + 25 * 4, 6 * (m.AD ** 2 + 2 * 4));
  const displaced = model('adv-8', .62); assert.ok(Math.abs(displaced.AD - 5) > .1, 'the shortcut is not applied to a different partition point');
});
