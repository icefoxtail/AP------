import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
const context = vm.createContext({ window: {}, document });
for (const name of ['core', 't6', 'solutions']) {
  const file = new URL(`../labs/g9-circle/${name}.js`, import.meta.url);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file.pathname });
}
const groups = context.window.APL_CI_GROUPS;
const scene = groups.flatMap(group => group.scenes).find(item => item.id === 'c6-8');
const params = Object.assign({}, ...groups.map(group => group.params));
const PC = { tab: 'problem', problem: true }, EX = { tab: 'explore', problem: false };
const state = () => { const s = {}; scene.enter(s); return s; };
const length = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const close = (a, b, label) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)), `${label}: ${a} != ${b}`);

function verifyTangent(g, label) {
  const { P, A, B, T, c, r } = g;
  assert.ok(length(P, c) > r && length(P, A) < length(P, B), `${label}: external point and near/far secant order`);
  for (const [name, point] of Object.entries({ A, B, T })) close(length(point, c), r, `${label}: ${name} lies on the circle`);
  const tangent = { x: T.x - P.x, y: T.y - P.y }, radius = { x: T.x - c.x, y: T.y - c.y };
  close((tangent.x * radius.x + tangent.y * radius.y) / (length(P, T) * r), 0, `${label}: tangent perpendicular to radius`);
  close(length(P, T) ** 2, length(P, A) * length(P, B), `${label}: geometric tangent-secant identity`);
  close(length(P, T), g.t, `${label}: rendered tangent agrees with the displayed length`);
  // Independent Cartesian construction: no inverse trigonometric function.
  const vx = c.x - P.x, vy = c.y - P.y, d2 = vx * vx + vy * vy;
  const power = d2 - r * r, along = power / d2, turn = r * Math.sqrt(power) / d2;
  close(T.x, P.x + along * vx + turn * vy, `${label}: upper tangent x`);
  close(T.y, P.y + along * vy - turn * vx, `${label}: upper tangent y`);
  const angle = (v, a, b) => {
    const u = { x: a.x - v.x, y: a.y - v.y }, w = { x: b.x - v.x, y: b.y - v.y };
    return Math.acos(Math.max(-1, Math.min(1, (u.x * w.x + u.y * w.y) / (length(v, a) * length(v, b)))));
  };
  close(angle(T, P, A), angle(B, P, T), `${label}: the displayed auxiliary triangles have the claimed equal angles`);
}

function board(W, H) {
  const items = [], b = { W, H, pad: .02, fs: 1, insets: { top: 0, bottom: 58, left: 0, right: 0 }, focus: { x: [-6, 6], y: [-6, 6] }, items };
  Object.defineProperty(b, 'k', { get() { const h = H - this.insets.bottom, pad = this.pad * Math.min(W, h); return Math.min((W - 2 * pad) / (this.focus.x[1] - this.focus.x[0]), (h - 2 * pad) / (this.focus.y[1] - this.focus.y[0])); } });
  b.toS = p => ({ x: W / 2 + (p.x - (b.focus.x[0] + b.focus.x[1]) / 2) * b.k, y: (H - b.insets.bottom) / 2 + (p.y - (b.focus.y[0] + b.focus.y[1]) / 2) * b.k });
  b.toW = (x, y) => ({ x: (x - W / 2) / b.k + (b.focus.x[0] + b.focus.x[1]) / 2, y: (y - (H - b.insets.bottom) / 2) / b.k + (b.focus.y[0] + b.focus.y[1]) / 2 });
  b.path = (points, options) => { items.push({ type: 'path', points, options }); return b; };
  b.circle = (p, r, options) => { items.push({ type: 'circle', p, r, options }); return b; };
  b.arc = (p, r, a, z, options) => { items.push({ type: 'arc', p, r, a, z, options }); return b; };
  for (const method of ['right', 'ticks', 'point', 'handle', 'leader']) b[method] = (...args) => { items.push({ type: method, args }); return b; };
  b.text = (p, str, options) => { items.push({ type: 'text', p, str, options }); return b; };
  return b;
}
const same = (p, q) => length(p, q) < 1e-8;
const visibleStroke = options => !!options?.color && (options.width ?? 1) > 0 && (options.alpha ?? 1) > 0;
const segment = (b, p, q) => b.items.find(item => item.type === 'path' && visibleStroke(item.options) && item.points.length === 2 && ((same(item.points[0], p) && same(item.points[1], q)) || (same(item.points[1], p) && same(item.points[0], q))));
function verifyDrawnCore(b, g, label) {
  assert.ok(b.items.some(item => item.type === 'circle' && same(item.p, g.c) && Math.abs(item.r - g.r) < 1e-8 && visibleStroke(item.options)), `${label}: original circle is visibly stroked`);
  assert.ok(segment(b, g.P, g.T), `${label}: original P-T tangent is visibly stroked`);
  assert.ok(segment(b, g.P, g.B), `${label}: original P-A-B secant is visibly stroked`);
  for (const p of [g.P, g.A, g.B, g.T]) {
    assert.ok(b.items.some(item => item.type === 'point' && same(item.args[0], p) && (item.args[1]?.alpha ?? 1) > 0), `${label}: original point remains visible`);
    const at = b.toS(p);
    assert.ok(at.x >= 0 && at.x <= b.W && at.y >= 0 && at.y <= b.H - b.insets.bottom, `${label}: original point remains in the drawable region`);
  }
}
function questions() {
  const result = [];
  for (let row = 0; row < 9; row++) for (let kind = 0; kind < 3; kind++) result.push(scene.ci.gen(() => (row + .5) / 9, kind));
  assert.equal(new Set(result.map(q => `${q.a}:${q.b}`)).size, 9, 'all nine question length triples are exercised');
  assert.equal(new Set(result.map(q => q.kind)).size, 3, 'all three unknown-segment families are exercised');
  return result;
}

test('initial c6-8 has a true tangent, not merely the correct numeric length', () => {
  const g = scene.ci.model(state(), EX).g;
  close(length(g.P, g.T) ** 2, 36, 'old numeric-only regression already passed');
  verifyTangent(g, 'initial');
});

test('every supported PA/PB slider pair preserves the circle, contact and tangent-secant identities', () => {
  const s = state(), question = JSON.stringify(s.ciPk);
  let count = 0;
  for (let a = params.c6pa.min; a <= params.c6pa.max; a += params.c6pa.step) for (let b = params.c6pb.min; b <= params.c6pb.max; b += params.c6pb.step) {
    s.c6pa = a; s.c6pb = b;
    verifyTangent(scene.ci.model(s, EX).g, `PA=${a},PB=${b}`); count++;
    assert.equal(JSON.stringify(s.ciPk), question, 'exploration does not mutate the current question');
  }
  assert.equal(count, 77);
  scene.enter(s); verifyTangent(scene.ci.model(s, EX).g, 're-entry');
  assert.equal(s.c6pa, 4); assert.equal(s.c6pb, 9);
});

test('all nine question triples and all three targets use a true tangent and retain their answers', () => {
  const s = state();
  for (const q of questions()) {
    s.ciPk = q;
    const M = scene.ci.model(s, PC), solution = scene.solution(s), Q = solution.question;
    verifyTangent(M.g, q.key);
    const expected = [Math.sqrt(q.a * q.b), q.t ** 2 / q.b, q.t ** 2 / q.a - q.a][q.kind];
    close(solution.value, expected, `${q.key}: independent target calculation`);
    close(Q.chk[0], expected, `${q.key}: measured target`);
    assert.equal(Q.choices.filter(choice => choice.ok).length, 1);
  }
});

test('production drawing keeps the circle, tangent and secant visible in initial, problem and solution states', () => {
  const dimensions = [[1039, 672], [820, 461], [683, 548], [390, 411], [360, 387]];
  const s = state();
  for (const [W, H] of dimensions) {
    const b = board(W, H), g = scene.ci.model(s, EX).g;
    scene.draw(b, s, {}, { tab: 'explore' }); verifyDrawnCore(b, g, `${W}:explore`);
    assert.ok(segment(b, g.T, g.A) && segment(b, g.T, g.B), 'exploration auxiliary chords remain available');
  }
  for (const q of questions()) for (const [W, H] of dimensions) {
    s.ciPk = q; const g = scene.ci.model(s, PC).g;
    const initial = board(W, H); scene.draw(initial, s, {}, { tab: 'problem' }); verifyDrawnCore(initial, g, `${W}:${q.key}:problem`);
    assert.ok(initial.items.some(item => item.type === 'text' && item.str === ['PT=x', 'PA=x', 'x'][q.kind]), 'the requested unknown stays hidden');
    const initialText = initial.items.filter(item => item.type === 'text').map(item => item.str);
    for (const step of [1, 2, 5]) {
      s.step = step; const b = board(W, H); scene.draw(b, s, {}, { tab: 'review' });
      verifyDrawnCore(b, g, `${W}:${q.key}:review${step}`);
      if (step === 1) assert.deepEqual(b.items.filter(item => item.type === 'text').map(item => item.str), initialText, 'the first solution state keeps the unsolved original figure');
      else assert.ok(segment(b, g.T, g.A) && segment(b, g.T, g.B), 'solution auxiliary chords remain available');
      assert.equal(JSON.stringify(s.ciPk), JSON.stringify(q));
    }
  }
});
