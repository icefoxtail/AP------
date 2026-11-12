// Independent problem-side checks for the new middle-school function labs.
// These checks deliberately do not call spec.verify or the content's geometry
// helpers. The existing suite owns finite drawing and timeline structure; here
// enumeration, clipping and equation substitution check mathematical meaning.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/middle-functions');
const context = vm.createContext({ window: {}, console });
for (const file of ['core', 'g7', 'g8', 'g9']) vm.runInContext(fs.readFileSync(path.join(root, file + '.js'), 'utf8'), context);
const M = context.window.APL_MF;
const plain = x => JSON.parse(JSON.stringify(x));
function scene(lab, id, overrides = {}) {
  const spec = M.labs[lab].scenes.find(s => s.id === id);
  assert.ok(spec, `${lab}/${id} exists`);
  const values = { ...M.defaults(spec), ...overrides };
  return { spec, values, model: spec.model(values), answer: m => spec.answer(values, m) };
}
const near = (actual, expected, label = '') => assert.ok(Math.abs(actual - expected) < 1e-8, `${label}: ${actual} != ${expected}`);
const point = (x, y) => ({ x, y });
const area = vertices => Math.abs(vertices.reduce((sum, a, i) => {
  const b = vertices[(i + 1) % vertices.length];
  return sum + a.x * b.y - a.y * b.x;
}, 0)) / 2;
const keys = points => [...points].map(p => `${p.x},${p.y}`).sort();
// Clip a convex polygon to y >= a*x+b, independent of native clip helpers.
function above(poly, a, b) {
  const out = [], signed = p => p.y - a * p.x - b;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], u = signed(p), v = signed(q);
    if (u >= -1e-10) out.push(p);
    if (u * v < 0) out.push(point(p.x + u / (u - v) * (q.x - p.x), p.y + u / (u - v) * (q.y - p.y)));
  }
  return out;
}

test('coordinate triangle uses the named A, B and Q, independent of a spare diagram vertex', () => {
  const { model: m } = scene('g7-coordinate-graphs', 'coordinate-area');
  near(area([m.A, m.B, m.Q]), 10);
  near(m.area, area([m.A, m.B, m.Q]));
});

test('integer points on an inverse graph are exhaustive, including the negative-only restriction', () => {
  for (const k of [2, 10, 16, 24]) for (const negativeOnly of [false, true]) {
    const { model: m } = scene('g7-proportion', 'integer-points', { k, negativeOnly });
    const expected = [];
    for (let x = -k; x <= k; x++) for (let y = -k; y <= k; y++) {
      if (x * y === k && (!negativeOnly || x < 0 && y < 0)) expected.push(point(x, y));
    }
    assert.deepEqual(keys(m.points), keys(expected));
  }
});

test('strict lattice counts exclude the curve and identify a unique constant', () => {
  const counts = new Map();
  for (let k = 2; k <= 12; k++) {
    let count = 0;
    for (let x = 1; x <= 12; x++) for (let y = 1; y <= 12; y++) if (x * y < k) count++;
    assert.ok(![...counts.values()].includes(count), `non-unique count for k=${k}`);
    counts.set(k, count);
  }
  for (const target of [6, 8, 10]) {
    const { model: m } = scene('g7-proportion', 'lattice-below', { target });
    assert.equal(m.pts.length, counts.get(target));
    assert.ok(m.pts.every(p => p.x > 0 && p.y > 0 && p.x * p.y < target));
  }
});

test('additional machines round up and the previous integer cannot finish on time', () => {
  for (const elapsed of [2, 5, 8]) for (const remainingTime of [6, 7, 10, 12]) {
    const { values: v, model: m, answer } = scene('g7-proportion', 'remaining-work', { elapsed, remainingTime });
    let total = 0;
    while (total * v.remainingTime + 24 * v.elapsed < 24 * 20) total++;
    near(m.left, 480 - 24 * elapsed);
    assert.match(answer(m), new RegExp(`전체 최소 \\$${total}\\$대`));
    assert.match(answer(m), new RegExp(`추가 \\$${Math.max(0, total - 24)}\\$대`));
  }
});

test('rectangle bisection through the origin halves the actual clipped polygon', () => {
  for (const values of [{}, { width: 4, low: 4, height: 2 }, { width: 8, low: 1, height: 6 }]) {
    const { model: m } = scene('g7-proportion', 'bisect-rectangle', values);
    near(area(above(m.rect, m.a, 0)), area(m.rect) / 2);
  }
});

test('linear rectangle answer cuts equal areas after moving the trial line to the solved slope', () => {
  for (const b of [-4, -2, 1]) {
    const { model: solved } = scene('g8-linear-functions', 'rectangle-bisection', { b });
    const { model: atAnswer } = scene('g8-linear-functions', 'rectangle-bisection', { b, trial: solved.a });
    near(area(above(atAnswer.rect, solved.a, b)), 4);
    near(area(atAnswer.upper), 4);
    near(area(atAnswer.lower), 4);
  }
});

test('triangle area ratios agree with the coordinates and line through the origin', () => {
  for (const v of [{}, { r: 4, h: 3, m: 1, q: 3 }, { r: 10, h: 8, m: 4, q: 2 }]) {
    const { model: m, values } = scene('g8-linear-functions', 'triangle-area-ratio', v);
    const a = area([point(0, 0), m.A, m.P]), b = area([point(0, 0), m.P, m.B]);
    near(a / b, values.q / values.m);
    near(m.P.y, m.a * m.P.x);
    near(a + b, area([point(0, 0), m.A, m.B]));
  }
});

test('open/closed line-segment endpoints change the integer count without silently including boundaries', () => {
  for (const mode of [0, 1, 2]) for (const closed of [false, true]) {
    const { model: m, values: v } = scene('g8-linear-functions', 'slope-range', { mode, closed });
    const expected = [];
    for (let coefficient = mode === 1 ? -12 : 1; coefficient <= 20; coefficient++) {
      const a = mode === 1 ? 3 : coefficient, b = mode === 1 ? coefficient : v.b;
      const atA = m.A.y - a * m.A.x - b, atB = m.B.y - a * m.B.x - b;
      if (closed ? atA * atB <= 0 : atA * atB < 0) expected.push(coefficient);
    }
    assert.deepEqual(plain(m.ints), expected);
  }
});

test('moving linear areas equal the geometric polygons up to the first boundary hit', () => {
  for (const mode of [0, 1, 2]) for (const phase of [0, 35, 100]) for (const [s, u] of [[2, 1], [1, 3]]) {
    const { model: m, values: v } = scene('g8-linear-functions', 'moving-area', { mode, phase, s, u });
    const bottom = point(s * m.t, 0), top = point((mode === 2 ? u : 0) * m.t, v.H);
    const poly = mode === 0 ? [bottom, point(v.W, 0), point(v.W, v.H)] : [bottom, point(v.W, 0), point(v.W, v.H), top];
    near(m.S, area(poly));
    assert.ok(bottom.x <= v.W + 1e-9 && top.x <= v.W + 1e-9);
    near(m.end, mode === 2 ? Math.min(v.W / s, v.W / u) : v.W / s);
  }
});

test('three-line concurrency coefficient satisfies each original equation', () => {
  for (const K of [3, 5, 8]) {
    const { model: m } = scene('g8-linear-functions', 'three-line-concurrency', { K });
    near(m.P.x + 2 * m.P.y, 1);
    near(2 * m.P.x - m.P.y, 7);
    near(3 * m.P.x + m.answer * m.P.y, K);
  }
});

test('the right-triangle altitude is perpendicular and reproduces the same area', () => {
  for (const k of [1, 2, 3]) {
    const { model: m } = scene('g8-linear-functions', 'graph-pythagoras', { k });
    near(m.H.x * (m.B.x - m.A.x) + m.H.y * (m.B.y - m.A.y), 0);
    near(Math.hypot(m.H.x, m.H.y), m.altitude);
    near(m.altitude * Math.hypot(m.B.x - m.A.x, m.B.y - m.A.y) / 2, area([point(0, 0), m.A, m.B]));
  }
});

test('dice conditions are checked against the stated equations for all36 ordered outcomes', () => {
  for (const mode of [0, 1, 2]) for (const k of [1, 2, 3]) {
    const { model: m } = scene('g8-linear-functions', 'graph-probability', { mode, k });
    const expected = [];
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
      const good = mode === 0 ? b - a === k : mode === 1 ? a !== b && k - a !== 0 : 2 * k - a === k - b;
      if (good) expected.push(point(a, b));
    }
    assert.deepEqual(keys(m.points), keys(expected));
  }
});

test('cost comparison treats equality as not yet cheaper', () => {
  for (const v of [{}, { a: 500, b: 250, fee: 1000 }, { a: 300, b: 250, fee: 3000 }]) {
    const { model: m, values } = scene('g8-linear-functions', 'cost-comparison', v);
    let first = 0;
    while (values.b * first + values.fee >= values.a * first) first++;
    assert.equal(m.first, first);
  }
});

test('coordinate walk counts every die sequence, not just each horizontal composition', () => {
  for (let x = 1; x <= 5; x++) {
    const { model: m } = scene('g8-linear-functions', 'coordinate-walk', { x });
    const count = Array.from({ length: x + 1 }, () => Array(3).fill(0));
    count[0][0] = 1;
    for (let a = 0; a <= x; a++) for (let b = 0; b <= 2; b++) for (let die = 1; die <= 6; die++) {
      const nx = a + (die % 2 ? die : 0), ny = b + (die % 2 ? 0 : die);
      if (nx <= x && ny <= 2) count[nx][ny] += count[a][b];
    }
    assert.equal(m.paths.length, count[x][2]);
  }
});

test('travel budget includes both journeys and the rest, with a sharp upper distance', () => {
  for (const v of [{}, { out: 6, back: 8, limit: 3, rest: 1.5 }]) {
    const { model: m, values } = scene('g8-linear-functions', 'travel-budget', v);
    const duration = x => x / values.out + x / values.back + values.rest;
    near(duration(m.max), values.limit);
    assert.ok(duration(m.max + .001) > values.limit);
  }
});

test('linear quadrant range includes the origin boundary and excludes a constant function', () => {
  for (const [k, expected] of [[-3.5, false], [-3, true], [1.5, true], [2, false], [2.5, false]]) {
    const { model: m } = scene('g8-linear-functions', 'quadrant-parameter-range', { k });
    assert.equal(m.allowed, expected);
    if (expected) for (const x of [.0001, .1, 1, 100]) assert.ok(m.a * x + m.b <= 0);
  }
});

test('intersection quadrant endpoints distinguish parallel lines from an axis point', () => {
  for (const [coefficient, expected] of [[-2.25, false], [-2, false], [-1.75, true], [-1.25, true], [-1, false], [0, false]]) {
    const { model: m } = scene('g8-linear-functions', 'intersection-parameter', { m: coefficient });
    assert.equal(m.allowed, expected);
    if (coefficient === -2) assert.equal(m.P, null);
    else {
      near(2 * m.P.x + m.P.y + 4, 0);
      near(coefficient * m.P.x - m.P.y - 2, 0);
      assert.equal(m.P.x < 0 && m.P.y > 0, expected);
    }
  }
});

test('integer area inequality excludes equality and a degenerate triangle', () => {
  for (const c of [-2, 1, 2]) for (const bound of [2, 6, 12]) {
    const { model: m } = scene('g8-linear-functions', 'area-integer-condition', { c, bound });
    const expected = [];
    for (let y = -20; y <= 20; y++) {
      const a = area([point(0, c), point((y - c) / 3, y), point(c - y, y)]);
      if (a > 0 && a < bound) expected.push(y);
    }
    assert.deepEqual(plain(m.ints), expected);
    assert.equal(m.sum, expected.reduce((a, b) => a + b, 0));
  }
});

test('parallel line strip is the actual quadrilateral area', () => {
  for (const v of [{}, { a: 1, b: 6, drop: 5 }, { a: 4, b: 10, drop: 1 }]) {
    const { model: m } = scene('g8-linear-functions', 'parallel-area', v);
    near(m.S, area([m.A, m.B, m.C, m.D]));
  }
});

test('quadratic coefficient signs include zero coefficients at symmetric roots', () => {
  for (const sign of [-1, 1]) for (const [left, right] of [[1, 5], [3, 1], [2, 2]]) {
    const { model: m } = scene('g9-quadratic-functions', 'coefficient-signs', { sign, left, right });
    const polynomial = x => m.a * x * x + m.b * x + m.c;
    near(polynomial(-left), 0); near(polynomial(right), 0);
    if (left === right) near(m.b, 0);
    near(m.value, m.a + 2 * m.b + 3 * m.c);
  }
});

test('avoiding the third quadrant includes the tangency boundary at the origin', () => {
  for (const [mag, expected] of [[.5, false], [1, true], [1.5, true]]) {
    const { model: m } = scene('g9-quadratic-functions', 'quadrants', { p: 2, depth: 4, mag });
    assert.equal(m.avoidsThird, expected);
    const y = x => mag * (x - 2) ** 2 - 4;
    if (expected) for (const x of [-100, -1, -.001]) assert.ok(y(x) > 0);
    else assert.ok(y(-.001) < 0);
  }
});

test('quadratic moving-area solutions lie on both physical segments and attain the target', () => {
  for (const target of [20, 21, 35]) {
    const { model: m } = scene('g9-quadratic-functions', 'moving-area', { target });
    assert.ok(m.early < m.late && m.early >= 0 && m.late <= 10);
    for (const time of [m.early, m.late]) near(area([point(0, 0), point(0, 12 - time), point(2 * time, 0)]), target);
    assert.ok(area([point(0, 0), point(0, 12 - m.early / 2), point(m.early, 0)]) < target);
  }
});

test('line-parabola intersections satisfy both original equations with two distinct roots', () => {
  for (const slope of [-2, 0, 2]) for (const intercept of [1, 2, 4]) {
    const { model: m } = scene('g9-quadratic-functions', 'intersections', { slope, intercept });
    for (const p of [m.A, m.B]) { near(p.y, p.x * p.x); near(p.y, slope * p.x + intercept); }
    assert.ok(m.A.x < 0 && m.B.x > 0);
  }
});

test('translated curved strip and its parallelogram have equal area without an integration oracle', () => {
  for (const [left, right, gap] of [[-1, 2, 3], [-2, 3, 1], [0, 1, 4]]) {
    const { model: m } = scene('g9-quadratic-functions', 'translation-area', { left, right, gap });
    const top = [], bottom = [];
    for (let i = 0; i <= 80; i++) {
      const x = left + (right - left) * i / 80, y = x * x - 2 * x;
      top.push(point(x, y)); bottom.push(point(x, y - gap));
    }
    near(m.area, area([...top, ...bottom.reverse()]));
    near(m.area, area([m.A, m.B, m.C, m.D]));
  }
});
