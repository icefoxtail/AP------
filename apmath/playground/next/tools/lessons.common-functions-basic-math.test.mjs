// Independent calculations from the first production questions, not a visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/functions-lesson-runtime.mjs';

const lab = await load({ allowMissingLessons: true });
const first = id => lab.api.first(id);
const answer = (id, label) => lab.def.lessons[id].find(lesson => lesson.label === label).answer;
const near = (actual, expected, epsilon = 1e-9) => assert.ok(Math.abs(actual - expected) < epsilon, `${actual} != ${expected}`);
const uniq = values => values.filter((v, i) => !values.slice(0, i).some(w => Math.abs(v - w) < 1e-9));

test('bas-1: both endpoint bijections give the claimed affine coefficients', () => {
  const { x1, x2, y1, y2 } = first('bas-1');
  const result = [[y1, y2], [y2, y1]].map(([left, right]) => {
    const a = (right - left) / (x2 - x1), b = left - a * x1;
    assert.notEqual(a, 0); near(a * x1 + b, left); near(a * x2 + b, right);
    return [a, b];
  });
  assert.deepEqual(result, [[2, 0], [-2, 10]]);
  assert.equal(answer('bas-1', '일대일대응'), '$(a,b)=(2,0),(-2,10)$');
});

test('bas-2: negative and zero right slopes fail; positive slope covers the complementary range', () => {
  const { m1, c, s } = first('bas-2');
  assert.ok(m1 > 0);
  const f = (x, a) => x < 0 ? m1 * x + c : (a - s) * x + c;
  const aBad = s - 1, output = c - 2;
  near(f((output - c) / m1, aBad), f((output - c) / (aBad - s), aBad));
  near(f(1, s), f(3, s));
  const aGood = s + 2;
  for (const y of [c - 10, c - 1, c, c + 1, c + 10]) {
    const x = y < c ? (y - c) / m1 : (y - c) / (aGood - s);
    near(f(x, aGood), y);
  }
  assert.equal(s, 1); assert.equal(answer('bas-2', '역함수조건'), '$a\\gt 1$');
});

test('bas-3: solving both inverse images gives four distinct roots and their sum', () => {
  const { h, c } = first('bas-3');
  const f = x => 2 * h - 2 * Math.abs(x - h);
  const inverse = y => y < 0 || y > 2 * h ? [] : uniq([y / 2, 2 * h - y / 2]);
  const roots = uniq(inverse(c).flatMap(inverse)).sort((a, b) => a - b);
  roots.forEach(x => { assert.ok(x >= 0 && x <= 2 * h); near(f(f(x)), c); });
  assert.deepEqual(roots, [.5, 1.5, 2.5, 3.5]);
  assert.equal(roots.reduce((sum, x) => sum + x, 0), 8);
  assert.equal(answer('bas-3', '근의개수'), '서로 다른 실근은 4개');
  assert.equal(answer('bas-3', '근의합'), '모든 실근의 합은 $8$');
});

test('bas-4: all composition vertices and changes of slope follow the source tent map', () => {
  const { h } = first('bas-4'), f = x => 2 * h - 2 * Math.abs(x - h);
  const xs = [0, h / 2, h, 3 * h / 2, 2 * h], ys = xs.map(x => f(f(x)));
  assert.deepEqual(xs, [0, 1, 2, 3, 4]); assert.deepEqual(ys, [0, 4, 0, 4, 0]);
  const slopes = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]));
  assert.deepEqual(slopes, [4, -4, 4, -4]);
  xs.slice(1).forEach((x, i) => near(f(f((x + xs[i]) / 2)), (ys[i + 1] + ys[i]) / 2));
  assert.equal(answer('bas-4', '합성그래프'), '꺾이는 곳은 $x=1,2,3$');
});

test('bas-5: actual staircase example carries each vertical output into the next input', () => {
  assert.match(lab.api.question('bas-5'), /f\(f\(f\(a\)\)\)/);
  const factor = Number(lab.html.match(/const fnCob = \(x\) => ([\d.]+) \* Math\.sqrt/)[1]);
  const f = x => factor * Math.sqrt(x), a = .5;
  const b = f(a), c = f(b), d = f(c);
  for (const [input, output] of [[a, b], [b, c], [c, d]]) {
    assert.ok(input >= 0); near(output, f(input));
    const mirrorPoint = [output, output]; near(mirrorPoint[0], mirrorPoint[1]);
  }
  assert.ok(a < b && b < c && c < d);
  assert.match(answer('bas-5', '합성작도'), /수직.*수평/);
});

test('bas-6: increasing inverse intersections, distance, and the two reflected areas', () => {
  const { c } = first('bas-6'), f = x => (x - 1) ** 2 / c + 1, g = x => Math.sqrt(c * (x - 1)) + 1;
  const a = 1, b = 1 + c;
  for (const x of [a, b]) { near(f(x), x); near(g(x), x); }
  near(Math.hypot(b - a, b - a), 3 * Math.sqrt(2));
  let lower = 0, upper = 0; const n = 20000, dx = (b - a) / n;
  for (let i = 0; i < n; i++) { const x = a + (i + .5) * dx; lower += (x - f(x)) * dx; upper += (g(x) - x) * dx; }
  near(lower, upper, 1e-6); near(lower + upper, 2 * lower, 1e-6);
  assert.equal(answer('bas-6', '교점거리'), '$AB=3\\sqrt2$');
  assert.equal(answer('bas-6', '넓이대칭'), '$S=2T$');
});

test('bas-7: native decreasing polyline really has off-diagonal inverse intersections', () => {
  const vertices = JSON.parse(lab.html.match(/const vertices = (\[\[-4, 3\.3\][\s\S]*?\]);/)[1]);
  for (let i = 1; i < vertices.length; i++) {
    assert.ok(vertices[i][0] > vertices[i - 1][0]); assert.ok(vertices[i][1] < vertices[i - 1][1]);
  }
  assert.ok(vertices.some(([x, y]) => x === -3 && y === 3));
  assert.ok(vertices.some(([x, y]) => x === 3 && y === -3));
  const a = [-3, 3], b = [3, -3];
  assert.notEqual(a[0], a[1]); near((b[1] - a[1]) / (b[0] - a[0]), -1);
  near((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
  assert.match(answer('bas-7', '반례확인'), /거짓$/);
});

test('bas-8: point and both line reflections preserve the actual rational curve', () => {
  const { p, q, k } = first('bas-8'), f = x => k / (x - p) + q;
  for (const u of [-4, -2, 1, 3]) {
    const v = k / u;
    for (const [X, Y] of [[-u, -v], [v, u], [-v, -u]]) near(f(p + X), q + Y);
  }
  assert.deepEqual([p, q, q - p, p + q], [1, 2, 1, 3]);
  assert.equal(answer('bas-8', '점대칭'), '점대칭의 중심은 $C(1,2)$');
  assert.equal(answer('bas-8', '선대칭'), '$y=x+1,\\quad y=-x+3$');
});

test('bas-9: quotient-remainder identity and inverse composition hold on their domains', () => {
  const { a, b, c } = first('bas-9'), k = b + a * c;
  const f = x => (a * x + b) / (x - c), standard = x => a + k / (x - c), inverse = x => (c * x + b) / (x - a);
  for (const x of [-4, -1, 0, 3, 5]) { near(f(x), standard(x)); near(inverse(f(x)), x); }
  assert.deepEqual([a, k, c], [2, 3, 1]);
  assert.equal(answer('bas-9', '표준형'), '$f(x)=2+\\frac3{x-1}$');
  assert.equal(answer('bas-9', '역함수'), '$f^{-1}(x)=\\frac{x+1}{x-2}$');
});

test('bas-10: fixed product and a nonnegative-square lower bound prove the minimum', () => {
  const { p, q, k } = first('bas-10'), minimum = 4 * Math.sqrt(k);
  for (const u of [.25, .7, 1, 2, 3, 8]) {
    const v = k / u; near(u * v, k);
    near(u + v - 2 * Math.sqrt(k), (Math.sqrt(u) - Math.sqrt(v)) ** 2);
    assert.ok(2 * (u + v) >= minimum - 1e-9);
  }
  const u = Math.sqrt(k); near(2 * (u + k / u), minimum);
  assert.deepEqual([p + u, q + k / u, k, minimum], [3, 3, 4, 8]);
  assert.equal(answer('bas-10', '넓이'), '$S=4$'); assert.equal(answer('bas-10', '최소둘레'), '최소 둘레는 $8$');
});

test('bas-11: integer enumeration agrees with all signed divisors and central pairs', () => {
  const { p, q, k } = first('bas-11'), points = [];
  // If x-p is an integer divisor its magnitude is at most |k|; this is exhaustive.
  for (let x = p - Math.abs(k); x <= p + Math.abs(k); x++) {
    if (x === p) continue;
    const y = q + k / (x - p); if (Number.isInteger(y)) points.push([x, y]);
  }
  assert.deepEqual(points, [[-3, 1], [-1, 0], [0, -2], [2, 6], [3, 4], [5, 3]]);
  for (const [x, y] of points) assert.ok(points.some(([X, Y]) => X === 2 * p - x && Y === 2 * q - y));
  assert.equal(answer('bas-11', '정수점'), `정수 좌표 점은 ${points.length}개`);
});

test('bas-12: endpoint slopes bound every allowed intersection and exclude outside slopes', () => {
  const { k, x1, x2, q } = first('bas-12'), f = x => k / (x - 1) + q;
  const slope = x => (f(x) - q) / x, lo = slope(x2), hi = slope(x1);
  near(lo, 1 / 3); near(hi, 2);
  for (let i = 0; i <= 20; i++) { const x = x1 + i / 20 * (x2 - x1); assert.ok(slope(x) >= lo - 1e-9 && slope(x) <= hi + 1e-9); }
  const root = m => (1 + Math.sqrt(1 + 4 * k / m)) / 2;
  assert.ok(root(lo / 2) > x2); assert.ok(root(hi * 2) < x1);
  assert.equal(answer('bas-12', '기울기범위'), '$\\frac13\\le m\\le2$');
});

test('bas-13: the repeated-root case and the linear case both give exactly one valid point', () => {
  const { k, q } = first('bas-13'), tangent = -q * q / (4 * k);
  const roots = m => {
    if (m === 0) return [-k / q];
    const d = q * q + 4 * m * k;
    return d < 0 ? [] : uniq([(q + Math.sqrt(d)) / (2 * m), (q - Math.sqrt(d)) / (2 * m)]);
  };
  for (const [m, count] of [[tangent - 1, 0], [tangent, 1], [tangent / 2, 2], [0, 1], [1, 2]]) {
    const ts = roots(m); assert.equal(ts.length, count); for (const t of ts) { assert.notEqual(t, 0); near(k / t + q, m * t); }
  }
  near(tangent, -.5); assert.equal(answer('bas-13', '한교점'), '$m=-\\frac12$ 또는 $m=0$');
});

test('bas-14: four sign choices are reflections and the inverse keeps its half-domain', () => {
  const { p, q, a } = first('bas-14');
  const forward = x => q + Math.sqrt(a * (x - p)), inverse = x => p + (x - q) ** 2 / a;
  for (const d of [.25, 1, 4]) {
    const pairs = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const x = p + sx * d, y = q + sy * Math.sqrt(a * d); pairs.push([x, y]);
      near((y - q) ** 2, a * Math.abs(x - p));
    }
    for (const [x, y] of pairs) {
      assert.ok(pairs.some(([X, Y]) => Math.abs(X - (2 * p - x)) < 1e-9 && Math.abs(Y - y) < 1e-9));
      assert.ok(pairs.some(([X, Y]) => Math.abs(X - x) < 1e-9 && Math.abs(Y - (2 * q - y)) < 1e-9));
    }
    near(inverse(forward(p + d)), p + d);
  }
  assert.deepEqual([p, q, a], [1, 1, 2]);
  assert.equal(answer('bas-14', '반쪽역함수'), '$f^{-1}(x)=\\frac{(x-1)^2}{2}+1\\ (x\\ge1)$');
});

test('bas-15: nonnegative root filtering proves the interval and rejects the extra root', () => {
  const { p, q } = first('bas-15'); assert.deepEqual([p, q], [1, 1]);
  const roots = k => k > 1 ? [] : uniq([1 - Math.sqrt(1 - k), 1 + Math.sqrt(1 - k)]).filter(v => v >= -1e-9);
  for (const [k, count] of [[-2, 1], [-.1, 1], [0, 2], [.5, 2], [1, 1], [2, 0]]) {
    const vs = roots(k); assert.equal(vs.length, count);
    for (const v of vs) { const x = p + v * v; near(2 * Math.sqrt(x - p) + q, x + k); }
  }
  const forbidden = 1 - Math.sqrt(3), x = 1 + forbidden ** 2;
  assert.ok(Math.abs(2 * Math.sqrt(x - 1) + 1 - (x - 2)) > 1);
  assert.equal(answer('bas-15', '두교점'), '$0\\le k\\lt 1$');
});

test('bas-16: distinct left/right intersections include each boundary vertex only once', () => {
  const { p } = first('bas-16'); assert.equal(p, 1);
  const roots = k => {
    const xs = [];
    if (k > -1) { const u = Math.sqrt(k + 2) - 1; xs.push(1 - u * u); }
    if (k <= 0) for (const v of uniq([1 - Math.sqrt(-k), 1 + Math.sqrt(-k)])) if (v >= 0) xs.push(1 + v * v);
    return uniq(xs);
  };
  for (const [k, count] of [[-2, 1], [-1, 2], [-.5, 3], [0, 2], [.5, 1]]) {
    const xs = roots(k); assert.equal(xs.length, count); for (const x of xs) near(2 * Math.sqrt(Math.abs(x - 1)), x + k);
  }
  assert.equal(answer('bas-16', '세교점'), '$-1\\lt k\\lt 0$');
});
