// Recalculate authored conditions independently of the source answer helpers.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/irrational-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`);
const plain = value => JSON.parse(JSON.stringify(value));
function at(id, label, time) {
  lab.go(id);
  const lesson = lab.def.lessons[id].find(item => item.label === label), cs = video.compileLesson(lesson);
  const state = video.stateAt(cs, time ?? cs.length, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
  Object.assign(lab.s, state.nums, state.sets, { step: state.step, lessonOn: true, lessonEntry: false });
  lab.tab = 'review';
  return { lesson, frame: lab.draw(), s: lab.s };
}
const roots = (a, b, c) => {
  const D = b * b - 4 * a * c;
  if (D < -1e-10) return [];
  return Math.abs(D) < 1e-10 ? [-b / (2 * a)] : [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)];
};
function lineCrossings(c, p, q, m, n) {
  // Use t=sqrt(x-p), rather than the production helper's squared equation in x-p.
  return roots(m, -Math.sqrt(c), m * p + n - q).filter(t => t >= -1e-9).map(t => {
    const x = p + Math.max(0, t) ** 2, y = q + Math.sqrt(c) * Math.max(0, t);
    near(y, m * x + n); return [x, y];
  }).sort((a, b) => a[0] - b[0]);
}
function compareLine(c, p, q, m, n) {
  const expected = lineCrossings(c, p, q, m, n), actual = lab.api.intersections(c, p, q, m, n);
  assert.equal(actual.n, expected.length);
  const points = Array.from(actual.pts).sort((a, b) => a[0] - b[0]);
  points.forEach((point, i) => { near(point[0], expected[i][0]); near(point[1], expected[i][1]); });
  return expected;
}

test('i1 translation: both coordinates move and the radicand uses the opposite horizontal sign', () => {
  const { s, frame, lesson } = at('i1', '평행이동');
  assert.deepEqual([s.i1a, s.i1p, s.i1q], [2, 1, 1]);
  const f = frame.plots.find(plot => plot.options.color === 'sky').evaluate;
  for (const x of [0, .5, 2, 4]) near(f(x + 1), Math.sqrt(2 * x) + 1);
  near(f(1), 1); assert.ok(Number.isNaN(f(0)));
  assert.equal(lesson.answer, String.raw`$y=\sqrt{2(x-1)}+1$`);
});

test('i1 reflections: changing input and output signs produces the four genuine source curves', () => {
  for (const [time, sx, sy] of [[6, 1, 1], [18, -1, 1], [30, 1, -1], [42, -1, -1]]) {
    const { s, frame } = at('i1', '대칭이동', time);
    assert.deepEqual([s.i1d, s.i1s], [sx, sy]);
    const f = frame.plots.find(plot => plot.options.ref === 'curve').evaluate;
    near(f(sx * 2), sy * 2); near(f(0), 0);
    assert.ok(Number.isNaN(f(-sx * 2)));
  }
});

test('i1 quadrants: negative start height and a strictly negative x-intercept are both necessary', () => {
  const { s, frame, lesson } = at('i1', '사분면');
  const a = -s.i1p, b = s.i1q, f = x => Math.sqrt(x + a) + b;
  assert.deepEqual([a, b], [5, -1]);
  const intercept = b * b - a;
  near(intercept, -4); near(f(intercept), 0);
  assert.ok(f(0) > 0 && f(-4.5) < 0 && f(-2) > 0 && f(1) > 0);
  const graph = frame.plots.find(plot => plot.options.color === 'sky').evaluate;
  for (const x of [-5, -4, 0, 1]) near(graph(x), f(x));
  // Equality makes the intercept the origin; no negative x can then have positive y.
  for (const x of [-1, -.5, -.01]) assert.ok(Math.sqrt(x + 1) - 1 < 0);
  assert.ok(!(-0 < 0), 'b=0 is not a third-quadrant start');
  assert.equal(lesson.answer, String.raw`$b\lt0,\ a>b^2$`);
});

test('i1 first original: the two given points determine a, b, c without reading the source answer', () => {
  const v = lab.api.first('i1');
  assert.deepEqual(plain([v.p, v.q, v.P]), [-2, 1, [7, 4]]);
  const c = v.q, a = (v.P[1] - c) ** 2 / (v.P[0] - v.p), b = -a * v.p;
  assert.deepEqual([a, b, c], [1, 2, 1]);
  near(Math.sqrt(a * v.p + b) + c, v.q);
  near(Math.sqrt(a * v.P[0] + b) + c, v.P[1]);
  near(v.ans.val, a + b + c);
  assert.equal(at('i1', '원문').lesson.answer, `$a+b+c=${a + b + c}$`);
});

test('i2 endpoint: the nonnegative radical parameter leaves both the endpoint and interior root', () => {
  const points = compareLine(4, 2, 0, 1, -2);
  assert.deepEqual(points, [[2, 0], [6, 4]]);
  const { s, frame } = at('i2', '끝점경계');
  assert.deepEqual([s.i2m, s.i2n], [1, -2]);
  const marked = frame.points.filter(p => p.options.ref === 'line');
  assert.equal(marked.length, 2);
  marked.forEach(p => near(p.point.y, p.point.x - 2));
});

test('i2 tangent: the radical equation has a repeated admissible root at the claimed contact point', () => {
  // With t=sqrt(x-2), t^2-2t+(k+2)=0 has discriminant -4(k+1).
  const k = -1, t = 1, x = 2 + t * t, y = 2 * t;
  near((-2) ** 2 - 4 * (k + 2), 0);
  near(t * t - 2 * t + k + 2, 0);
  assert.deepEqual(compareLine(4, 2, 0, 1, k), [[x, y]]);
  const { s, lesson } = at('i2', '접선경계');
  near(s.i2n, k); assert.equal(lesson.answer, String.raw`$k=-1,\ T(3,2)$`);
});

test('i2 decreasing line: all endpoint boundary cases and the authored radical coordinates are valid', () => {
  for (const n of [-2, 0, 1, 2, 3, 4, 7]) assert.equal(compareLine(4, 2, 0, -1, n).length, n < 2 ? 0 : 1);
  const [point] = compareLine(4, 2, 0, -1, 4);
  near(point[0], 6 - 2 * Math.sqrt(3)); near(point[1], 2 * Math.sqrt(3) - 2);
  const { s } = at('i2', '음수기울기'); assert.equal(s.i2m, -1); assert.equal(s.i2n, 4);
});

test('i2 first original: one/two/zero intersections are recounted on both sides and at each boundary', () => {
  const v = lab.api.first('i2'); assert.deepEqual([v.c, v.p, v.q, v.ask], [4, 2, 0, 'one']);
  for (const k of [-5, -3, -2, -1.75, -1.5, -1.25, -1, 0, 1]) {
    const expected = k < -2 || k === -1 ? 1 : k < -1 ? 2 : 0;
    assert.equal(compareLine(v.c, v.p, v.q, 1, k).length, expected, `k=${k}`);
  }
  assert.equal(at('i2', '원문').lesson.answer, String.raw`$k\lt-2$ 또는 $k=-1$`);
});

test('i3 inverse: the reflected curve composes to the identity only on its inherited domain', () => {
  const { frame, lesson } = at('i3', '역함수대칭');
  const f = frame.plots.find(plot => plot.options.ref === 'f').evaluate;
  const g = frame.plots.find(plot => plot.options.ref === 'g').evaluate;
  for (const x of [2, 2.25, 3, 6]) { near(g(f(x)), x); near(f(g(x)), x); }
  near(f(3), 4); near(g(4), 3);
  assert.ok(Number.isNaN(g(1)), 'the full parabola is not the inverse');
  assert.equal(lesson.answer, String.raw`$f^{-1}(x)=\frac{(x-2)^2}{4}+2,\ x\ge2$`);
});

test('i3 increasing inverse crossings: nonnegative roots give the strict/inclusive height boundaries', () => {
  for (const q of [0, 1, 1.5, 2, 3]) {
    const ts = roots(1, -2, 2 - q).filter(t => t >= -1e-9);
    const expected = ts.map(t => 2 + Math.max(0, t) ** 2).sort((a, b) => a - b);
    const actual = lab.api.inverseIntersections(4, 1, 2, q);
    assert.equal(actual.length, expected.length);
    actual.forEach((p, i) => { near(p.x, expected[i]); near(p.y, p.x); assert.equal(p.on, true); });
    assert.equal(expected.length === 2, q > 1 && q <= 2);
  }
  assert.equal(at('i3', '증가교점').lesson.answer, String.raw`$1\lt q\le2$`);
});

test('i3 decreasing exception: off-axis solutions must be a distinct nonnegative pair', () => {
  for (const q of [2, 3, 3.5, 4, 5]) {
    // Subtracting the two equations gives sqrt(a)+sqrt(b)=2 off the diagonal.
    const ts = roots(1, -2, 4 - q).filter(t => t >= -1e-9 && t <= 2 + 1e-9);
    const pairs = ts.length === 2 ? ts.map(t => [t * t, (2 - t) ** 2]) : [];
    const actual = Array.from(lab.api.inverseIntersections(4, -1, 0, q)).filter(p => !p.on);
    assert.equal(actual.length, pairs.length, `q=${q}`);
    for (const [x, y] of pairs) {
      near(4 * x, (q - y) ** 2); near(4 * y, (q - x) ** 2);
      assert.ok(q - x >= -1e-8 && q - y >= -1e-8, 'squaring did not introduce negative radical values');
      assert.ok(actual.some(p => Math.abs(p.x - x) < 1e-8 && Math.abs(p.y - y) < 1e-8));
    }
  }
  const { s } = at('i3', '감소예외'); assert.deepEqual([s.i3c, s.i3p, s.i3q, s.i3dec], [4, 0, 4, true]);
});

test('i3 first original: the retained diagonal root and the off-axis pair give exactly three crossings', () => {
  const v = lab.api.first('i3'); assert.deepEqual([v.c, v.q, v.type], [4, 4, 'D']);
  const f = x => 4 - 2 * Math.sqrt(x);
  const diagonal = roots(1, -12, 16).filter(x => x >= 0 && x <= 4);
  assert.equal(diagonal.length, 1); near(diagonal[0], 6 - 2 * Math.sqrt(5));
  const expected = [[0, 4], [diagonal[0], diagonal[0]], [4, 0]];
  for (const [x, y] of expected) { near(f(x), y); near(f(y), x); }
  const actual = Array.from(v.cr);
  assert.equal(actual.length, expected.length);
  actual.forEach((p, i) => { near(p.x, expected[i][0]); near(p.y, expected[i][1]); });
  near(v.ans.val, expected.length);
  assert.equal(at('i3', '원문').lesson.answer, `$N=${expected.length}$`);
});
