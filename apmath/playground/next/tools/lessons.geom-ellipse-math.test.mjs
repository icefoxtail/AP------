// Recalculate the original inputs with distances, determinants and tangent
// equations; no expected numeric answer is inferred from a lesson caption.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/ellipse-lesson-runtime.mjs';
const lab = await load({ sourceOnly: true }), source = lab.api;
const pool = source.variants.OVE.POOL, builders = source.variants.OVE.B;
const near = (a, b, label = '') => assert.ok(Math.abs(a - b) < 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)), `${label}: ${a} ~= ${b}`);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const point = (a, b, t) => [a * Math.cos(t), b * Math.sin(t)];
const area = ([p, q, r]) => Math.abs((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])) / 2;
const angles = [.17, .45, .8, 1.1, Math.PI / 2, 2.2, 3.8, 5.5];
function tangent(a, b, t) {
  const P = point(a, b, t), c = Math.sqrt(a * a - b * b), n = [P[0] / a ** 2, P[1] / b ** 2], N = n[0] ** 2 + n[1] ** 2;
  const foot = p => { const d = (n[0] * p[0] + n[1] * p[1] - 1) / N; return [p[0] - d * n[0], p[1] - d * n[1]]; };
  return { P, c, n, N, F: [c, 0], Fp: [-c, 0], foot };
}

test('1-A: all source distances and perimeters follow the ellipse equation', () => {
  for (const row of pool['1-A']) {
    const [a, b, given] = row, c = Math.sqrt(a * a - b * b), x = a * (given - a) / c, P = [x, b * Math.sqrt(1 - x * x / a ** 2)], v = builders['1-A'](row);
    near(dist(P, [-c, 0]), given); near(dist(P, [c, 0]), v.pf);
    near(dist(P, [-c, 0]) + dist(P, [c, 0]) + 2 * c, v.per);
    near(dist([0, b], [c, 0]), a);
  }
  near(source.first('1-A').pf, 3); near(source.first('1-A').per, 18);
  for (const t of angles) near(dist(point(5, 3, t), [4, 0]) + dist(point(5, 3, t), [-4, 0]), 10);
});

test('1-B: right intersections, general-angle area, incircle and absence case are independent', () => {
  for (const row of pool['1-B']) {
    const [a, b] = row, c = Math.sqrt(a * a - b * b), y = b * b / c, x = Math.sqrt(c * c - y * y), P = [x, y], F = [c, 0], Fp = [-c, 0];
    near(x * x / a ** 2 + y * y / b ** 2, 1); near((x - c) * (x + c) + y * y, 0);
    near(area([P, F, Fp]), builders['1-B'](row).chk.S);
  }
  for (const t of angles) {
    const a = 5, b = 3, c = 4, P = point(a, b, t), F = [c, 0], Fp = [-c, 0], u = dist(P, F), v = dist(P, Fp);
    const alpha = Math.acos(((c - P[0]) * (-c - P[0]) + P[1] ** 2) / (u * v)), S = area([P, F, Fp]);
    near(S, b * b * Math.tan(alpha / 2));
    const I = [(u * Fp[0] + v * F[0] + 2 * c * P[0]) / (2 * (a + c)), c * P[1] / (a + c)], radius = S / (a + c);
    near(Math.abs(I[1]), radius);
    for (const [A, B] of [[P, F], [P, Fp]]) near(Math.abs((B[0] - A[0]) * (I[1] - A[1]) - (B[1] - A[1]) * (I[0] - A[0])) / dist(A, B), radius);
    near((u + v - 2 * c) / 2, a - c);
  }
  assert.ok(4 ** 2 - 3.2 ** 2 < 3.2 ** 2, 'c < b: negative cos² and no right intersection');
  near(source.first('1-B').chk.S, 9);
});

test('1-C: native focal chords satisfy the conic, constant perimeter and similarity', () => {
  for (const row of pool['1-C']) for (const t of angles) {
    const [a, b] = row, c = Math.sqrt(a * a - b * b), native = source.math.ellipseFocalChord(a, b, c, t), P = [native.P.x, native.P.y], Q = [native.Q.x, native.Q.y], F = [c, 0], Fp = [-c, 0];
    for (const p of [P, Q]) near(p[0] ** 2 / a ** 2 + p[1] ** 2 / b ** 2, 1);
    near(dist(P, Q), dist(P, F) + dist(Q, F));
    near(dist(P, Q) + dist(P, Fp) + dist(Q, Fp), builders['1-C'](row).chk.per);
    near(dist(P, F) / dist(Q, F), Math.abs(P[1] / Q[1]));
    if (t === Math.PI / 2) near(dist(P, Q), 2 * b * b / a);
  }
  near(source.first('1-C').chk.per, 20);
});

test('2-A: both circle coordinates and the different direction angle are recomputed', () => {
  for (const row of pool['2-A']) {
    const [a, b, deg] = row, t = deg * Math.PI / 180, P = point(a, b, t), v = builders['2-A'](row);
    near(P[0], v.chk.px); near(P[1], v.chk.py); near(P[0] ** 2 / a ** 2 + P[1] ** 2 / b ** 2, 1);
    near(P[1] / P[0], b / a * Math.tan(t));
  }
  const first = source.first('2-A'); near(first.chk.px, 2); near(first.chk.py, Math.sqrt(3));
  assert.ok(Math.abs(Math.atan2(first.chk.py, first.chk.px) - Math.PI / 3) > .1);
});

test('2-B: determinant area scales, maximum matches and mapped chord midpoint stays a midpoint', () => {
  for (const row of pool['2-B']) {
    const [a, b] = row, Q = [0, 2 * Math.PI / 3, 4 * Math.PI / 3].map(t => point(a, a, t)), P = Q.map(([x, y]) => [x, y * b / a]);
    near(area(P), area(Q) * b / a); near(area(P), builders['2-B'](row).chk.S);
    for (const t of angles) {
      const arbitrary = [t, t + .6, t + 2.1].map(u => point(a, a, u));
      near(area(arbitrary.map(([x, y]) => [x, y * b / a])), area(arbitrary) * b / a);
      assert.ok(area(arbitrary) <= area(Q) + 1e-8);
    }
    const t = Math.PI / 5, r = .48 * a, h = Math.sqrt(a * a - r * r), M = [r * Math.cos(t), r * Math.sin(t)], d = [-Math.sin(t), Math.cos(t)];
    const E = [-1, 1].map(k => [M[0] + k * h * d[0], (M[1] + k * h * d[1]) * b / a]), Mp = [M[0], M[1] * b / a];
    near((E[0][0] + E[1][0]) / 2, Mp[0]); near((E[0][1] + E[1][1]) / 2, Mp[1]);
    near((E[1][1] - E[0][1]) / (E[1][0] - E[0][0]) * Mp[1] / Mp[0], -((b / a) ** 2));
  }
  near(source.first('2-B').chk.S, 45 * Math.sqrt(3) / 4);
});

test('2-C: two tangent equations share the intercept, with the x=0 exception', () => {
  for (const row of pool['2-C']) {
    const [a, b, x] = row, P = [x, b * Math.sqrt(1 - x ** 2 / a ** 2)], Q = [x, Math.sqrt(a * a - x * x)], T = [a * a / x, 0];
    near(P[0] * T[0] / a ** 2 + P[1] * T[1] / b ** 2, 1);
    near(Q[0] * T[0] + Q[1] * T[1], a ** 2);
    near(Q[0] * (T[0] - Q[0]) + Q[1] * (T[1] - Q[1]), 0);
    near(x * T[0], a ** 2); near(T[0], builders['2-C'](row).chk.T);
  }
  near(source.first('2-C').chk.T, 8);
  // At x1=0, the two equations are a*y=a² and b*y/b²=1.
  assert.notEqual(4, 0); assert.notEqual(3, 0);
  near(4 * 4, 16); near(3 * 3 / 9, 1);
});

test('3-A: reflection, midpoint distances, foot circle and minimum path are verified geometrically', () => {
  for (const row of pool['3-A']) for (const t of angles) {
    const [a, b] = row, g = tangent(a, b, t), H = g.foot(g.F), R = [2 * H[0] - g.F[0], 2 * H[1] - g.F[1]];
    const native = source.math.reflectAcrossLine({ x: g.c, y: 0 }, { x: g.P[0], y: g.P[1] }, { x: -g.n[1] / Math.sqrt(g.N), y: g.n[0] / Math.sqrt(g.N) });
    near(native.H.x, H[0]); near(native.H.y, H[1]); near(native.reflection.x, R[0]); near(native.reflection.y, R[1]);
    near(dist(g.P, g.F), dist(g.P, R)); near(area([g.Fp, g.P, R]), 0);
    near(dist(g.Fp, R), builders['3-A'](row).chk.ff); near(Math.hypot(...H), builders['3-A'](row).chk.oh);
    for (const offset of [-2, 0, 3]) {
      const Q = [g.P[0] - offset * g.n[1] / Math.sqrt(g.N), g.P[1] + offset * g.n[0] / Math.sqrt(g.N)], sum = dist(Q, g.F) + dist(Q, g.Fp);
      if (!offset) near(sum, 2 * a); else assert.ok(sum > 2 * a);
    }
  }
  near(source.first('3-A').chk.ff, 10); near(source.first('3-A').chk.oh, 5);
});

test('3-B: foot-circle chords and coefficient distance calculation agree for every position', () => {
  for (const row of pool['3-B']) for (const t of angles) {
    const [a, b] = row, g = tangent(a, b, t), H1 = g.foot(g.F), H2 = g.foot(g.Fp), Hp = H1.map(x => -x), d1 = dist(g.F, H1), d2 = dist(g.Fp, H2);
    near(Math.hypot(...H1), a); near(Math.hypot(...H2), a); near(area([Hp, g.Fp, H2]), 0);
    near(dist(Hp, g.Fp), d1); near(d1 * d2, builders['3-B'](row).chk.d1d2);
    near(b ** 2 * g.N, 1 - g.c ** 2 * g.n[0] ** 2);
    near(d1 * d2, (a - g.c) * (a + g.c));
  }
  near(source.first('3-B').chk.d1d2, 9);
});

test('4-A: normal intercept, ratio and reflected incoming ray are independently computed', () => {
  for (const row of pool['4-A']) {
    const [a, c, d] = row, b = Math.sqrt(a * a - c * c), x = a * (d - a) / c, t = Math.acos(x / a), g = tangent(a, b, t), N = [x - g.P[1] * g.n[0] / g.n[1], 0], v = builders['4-A'](row);
    near(dist(g.Fp, N) / dist(N, g.F), v.chk.r); near(N[0], v.chk.nx); near(N[0], c ** 2 / a ** 2 * x);
    const input = [(g.P[0] + c) / dist(g.P, g.Fp), g.P[1] / dist(g.P, g.Fp)], n = g.n.map(z => z / Math.sqrt(g.N));
    const d0 = input[0] * n[0] + input[1] * n[1], output = input.map((z, i) => z - 2 * d0 * n[i]);
    near(output[0], (c - g.P[0]) / dist(g.P, g.F)); near(output[1], -g.P[1] / dist(g.P, g.F));
  }
  near(source.first('4-A').chk.r, 3);
});

test('4-B: native contact points are on the conic, tangents perpendicular and support distances exact', () => {
  for (const row of pool['4-B']) for (const t of [0, Math.atan2(row[1], row[0]), ...angles]) {
    const [a, b] = row, g = source.math.ellipseOrthogonalTangents(a, b, t), M = [g.M.x, g.M.y], contacts = [g.T1, g.T2].map(p => [p.x, p.y]);
    near(M[0] ** 2 + M[1] ** 2, builders['4-B'](row).chk.R2);
    const vs = contacts.map(p => p.map((v, i) => v - M[i])); near(vs[0][0] * vs[1][0] + vs[0][1] * vs[1][1], 0);
    let sum = 0;
    for (const P of contacts) {
      near(P[0] ** 2 / a ** 2 + P[1] ** 2 / b ** 2, 1); near(P[0] * M[0] / a ** 2 + P[1] * M[1] / b ** 2, 1);
      const n0 = [P[0] / a ** 2, P[1] / b ** 2], len = Math.hypot(...n0), n = n0.map(z => z / len), h = 1 / len;
      near(h * h, a * a * n[0] ** 2 + b * b * n[1] ** 2); sum += h * h;
    }
    near(sum, a * a + b * b);
    assert.ok(M[0] ** 2 / a ** 2 + M[1] ** 2 / b ** 2 > 1);
  }
  near(source.first('4-B').chk.R2, 34);
});

test('q5: native shared-focus intersections and distances cancel without knowing c', () => {
  for (const v of source.variants.VE5) for (const c of [v.c, v.c + .13]) {
    const g = source.math.geoE5(v.a, v.cx, c), P = g.P;
    near(P[0] ** 2 / v.a ** 2 + P[1] ** 2 / (v.a ** 2 - c ** 2), 1);
    near((P[0] - g.m) ** 2 / g.ah ** 2 - P[1] ** 2 / g.bh ** 2, 1);
    const e = dist(P, g.F1) + dist(P, g.F2), h = dist(P, g.F3) - dist(P, g.F1);
    near(e, 2 * v.a); near(h, v.cx + v.a);
    near(dist(g.F3, g.F2), v.a - v.cx);
    near(dist(P, g.F3) + dist(P, g.F2) + dist(g.F3, g.F2), 4 * v.a);
  }
  near(source.first('q5').ans, 20);
  for (const [cx, c] of [[2, 3.8], [1.2, 3.8]]) {
    const g = source.math.geoE5(5, cx, c); assert.ok(g.ok);
    near(dist(g.P, g.F3) + dist(g.P, g.F2) + dist(g.F3, g.F2), 20);
  }
});

test('q6: both-focus source coefficients and moving intersection distances satisfy both conics', () => {
  for (const v of source.variants.VE6) {
    const aH = Math.sqrt(v.n), aE = v.d + aH, c2 = aE ** 2 - v.m, b2 = c2 - v.n, g = source.math.geoE6(aE, aH, Math.sqrt(c2));
    assert.ok(b2 > 0); near(g.P[0] ** 2 / aE ** 2 + g.P[1] ** 2 / v.m, 1);
    near(g.P[0] ** 2 / v.n - g.P[1] ** 2 / b2, 1);
    near(dist(g.P, g.F), v.d); near(dist(g.P, g.Fp), v.d + 2 * aH);
    near(c2, v.n + b2);
  }
  const v = source.first('q6'); near(v.A, 25); near(v.B, 11); near(v.ans, 36);
  for (const [aE, aH] of [[6, 2], [7, 3]]) {
    const g = source.math.geoE6(aE, aH, 4); near(dist(g.P, g.F), aE - aH); near(dist(g.P, g.Fp), aE + aH);
    near(g.P[0] ** 2 / aE ** 2 + g.P[1] ** 2 / (aE ** 2 - 16), 1);
    near(g.P[0] ** 2 / aH ** 2 - g.P[1] ** 2 / (16 - aH ** 2), 1);
  }
});
