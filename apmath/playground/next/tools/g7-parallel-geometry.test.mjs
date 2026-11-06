import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = process.env.G7_PARALLEL_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = { window: {}, document: { documentElement: { dataset: {} }, getElementById: () => null, createElement: () => ({}), head: { append() {} }, addEventListener() {} } };
vm.createContext(context);
for (const file of ['kit', 't1', 't2', 't3', 't4']) vm.runInContext(fs.readFileSync(path.join(root, 'labs/g7-parallel', file + '.js'), 'utf8'), context, { filename: file });
const groups = context.window.APL_PA_GROUPS;
const scenes = groups.flatMap(g => g.scenes);
const get = id => scenes.find(s => s.id === id);
function state(scene, values = {}) {
  const group = groups.find(g => g.scenes.includes(scene));
  const s = Object.fromEntries(Object.entries(group.params).map(([k, p]) => [k, p.value]));
  scene.enter(s); return Object.assign(s, values);
}
const near = (a, b, label = '') => assert.ok(Math.abs(a - b) < 1e-8, `${label}: ${a} vs ${b}`);
const length = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
function angle(p, o, q) {
  const u = [p.x - o.x, p.y - o.y], v = [q.x - o.x, q.y - o.y];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI;
}
const right = p => ({ x: p.x + 1, y: p.y });
function reflect(p, o, u) {
  const d = { x: p.x - o.x, y: p.y - o.y }, t = d.x * u.x + d.y * u.y;
  return { x: o.x + 2 * t * u.x - d.x, y: o.y + 2 * t * u.y - d.y };
}
function recordingBoard() {
  const calls = [];
  const b = new Proxy({ W: 900, H: 600, k: 60, calls }, { get(obj, key) { if (key in obj) return obj[key]; return (...args) => { calls.push({ method: key, args }); }; } });
  return b;
}
function finite(value) {
  if (typeof value === 'number') assert.ok(Number.isFinite(value));
  else if (value && typeof value === 'object') Object.values(value).forEach(finite);
}
const answer = (sc, s) => sc.pa.prob(sc.pa.model(s), s).choices.find(c => c.ok).v;

test('runtime registry and generated questions remain complete', () => {
  assert.equal(scenes.length, 12); assert.equal(new Set(scenes.map(s => s.id)).size, 12);
  for (const sc of scenes) {
    const group = groups.find(g => g.scenes.includes(sc)), initial = state(sc), samples = [initial];
    for (const key of sc.controls(initial)) for (const v of [group.params[key].min, group.params[key].max]) samples.push({ ...initial, [key]: v });
    for (const preset of sc.presets(initial)) { const s = { ...initial }; preset.apply(s); samples.push(s); }
    for (let i = 0; i < 25; i++) { const s = state(sc); sc.pa.reroll(s); samples.push(s); }
    for (const s of samples) {
      const M = sc.pa.model(s), Q = sc.pa.prob(M, s); finite(M);
      assert.equal(Q.choices.length, 5, sc.id); assert.equal(Q.choices.filter(c => c.ok).length, 1, sc.id);
      assert.equal(new Set(Q.choices.map(c => c.html || c.p || c.t)).size, 5, sc.id);
      assert.doesNotMatch(sc.problem.text(s), /class="pa-ch[^"\n]*\s(?:ok|bad)"/);
      for (const mode of ['explore', 'problem', 'review']) {
        const b = recordingBoard(); sc.pa.draw(b, s, M, { mode, step: mode === 'review' ? 1 : 99 });
        assert.ok(b.calls.length, sc.id); b.calls.forEach(c => finite(c.args));
      }
    }
  }
});

test('parallel judgement offers no correct-option colour or marker shortcut', () => {
  const sc = get('p1-3');
  for (let seed = 0; seed < 80; seed++) {
    const s = state(sc); sc.pa.reroll(s); const M = sc.pa.model(s), Q = sc.pa.prob(M, s);
    const palettes = Q.choices.map(c => [...c.html.matchAll(/(?:fill|stroke)="var\(([^)]+)\)"/g)].map(m => m[1]).join(','));
    assert.equal(new Set(palettes).size, 1, 'colour must not identify the correct choice');
    for (let i = 0; i < M.list.length; i++) {
      const b = recordingBoard(); sc.pa.draw(b, s, { ...M, pickIdx: i }, { mode: 'problem', step: 99 });
      assert.equal(b.calls.filter(c => c.method === 'path' && c.args[0].length === 3 && c.args[1]?.width === 2.8).length, 0, 'no parallel chevrons before judgement');
      const it = M.list[i]; assert.equal(it.ok, it.vP === it.vQ);
    }
  }
});

test('bent-line and zigzag answers agree with coordinate angles', () => {
  for (const id of ['p2-1', 'p2-3']) {
    const sc = get(id), ka = id === 'p2-1' ? 'bA' : 'cA', kb = id === 'p2-1' ? 'bB' : 'cB';
    for (let a = 30; a <= 75; a += 5) for (let b = 30; b <= 75; b += 5) {
      const s = state(sc, { [ka]: a, [kb]: b }), m = sc.pa.model(s);
      near(angle(m.A, m.P, m.B), m.x, id); near(answer(sc, s), m.x, id);
    }
  }
  const sc = get('p2-2');
  for (let k = 1; k <= 3; k++) for (let a = 30; a <= 80; a += 5) {
    const s = state(sc, { kK: k, uA: a, uB: 80 - a / 2, uC: 55, uD: 35 }), m = sc.pa.model(s);
    const vals = m.V.map((p, i) => i === 0 ? angle(right(p), p, m.V[1]) : i === m.V.length - 1 ? angle({ x: p.x + (i % 2 ? -1 : 1), y: p.y }, p, m.V[i - 1]) : angle(m.V[i - 1], p, m.V[i + 1]));
    vals.forEach((v, i) => near(v, m.W[i].val, 'zigzag angle'));
    near(vals.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b), vals.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b), 'alternating angle sums');
    near(answer(sc, s), vals[m.tar]);
  }
});

test('regular polygon sides, angles, displayed choices and fit agree at limits', () => {
  for (const id of ['p3-1', 'p3-2', 'p3-3']) {
    const sc = get(id), list = id === 'p3-1' ? [3] : id === 'p3-2' ? [4, 5, 6] : [5, 6, 8];
    for (const n of list) for (let t = 0; t <= 100; t += 5) {
      const s = state(sc, id === 'p3-1' ? { tA: 10 + t * .4, tX: .6 } : id === 'p3-2' ? { gN: n, gT: t } : { hN: n, hT: t }), m = sc.pa.model(s);
      const P = m.V || [m.A, m.B, m.C], edge = length(P[0], P[1]);
      P.forEach((p, i) => near(length(p, P[(i + 1) % P.length]), edge));
      const endpoint = m.V ? m.V[m.end] : m.C, previous = m.V ? m.V[m.end - 1] : m.A;
      near(angle(right(endpoint), endpoint, previous), m.b); near(answer(sc, s), m.b);
      const f = sc.focus(s); P.forEach(p => assert.ok(p.x >= f.x[0] + .2 && p.x <= f.x[1] - .2 && p.y >= f.y[0] + .2 && p.y <= f.y[1] - .2, `${id}: vertex outside focus`));
    }
  }
  const sc = get('p3-3'), group = groups.find(g => g.scenes.includes(sc));
  if (sc.controls(state(sc)).includes('hN')) {
    const p = group.params.hN;
    for (let n = p.min; n <= p.max; n += p.step) assert.equal(sc.pa.model(state(sc, { hN: n })).n, n, 'slider and polygon must agree');
  }
  for (const preset of sc.presets(state(sc))) { const s = state(sc); preset.apply(s); assert.equal(sc.pa.model(s).n, s.hN); }
});

test('polygon review reveals the unknown numerical angle only in the final step', () => {
  for (const id of ['p3-1', 'p3-2', 'p3-3']) {
    const sc = get(id), s = state(sc, { tA: 24, gT: 30, hT: 30 }), m = sc.pa.model(s);
    for (const step of [1, 2]) {
      const b = recordingBoard(); sc.pa.draw(b, s, m, { mode: 'review', step });
      const labels = b.calls.filter(c => c.method === 'text').map(c => String(c.args[1]));
      assert.ok(!labels.includes('b=' + m.b + '°') && !labels.includes(m.b + '°'), id);
      assert.doesNotMatch(sc.steps(s)[step - 1], new RegExp('∠b = ' + m.b + '°'), id);
      assert.equal(sc.view({ ...s, step }, { tab: 'review' }).formula, '');
    }
    assert.match(sc.steps(s).at(-1), new RegExp(m.b + '°'));
  }
});

test('paper folds preserve lengths and reflected geometry yields the claimed angle', () => {
  const sc = get('p4-1');
  for (let a = 40; a <= 70; a++) {
    const s = state(sc, { fA: a, fX: -2.4 }), m = sc.pa.model(s);
    const f = sc.focus(s); for (const p of [m.A,m.B,m.C,m.E,m.F,reflect(m.E,m.B,m.u),reflect(m.F,m.B,m.u)]) assert.ok(p.x > f.x[0] && p.x < f.x[1] && p.y > f.y[0] && p.y < f.y[1], 'folded paper and vertices fit');
    near(length(m.A, m.B), length(m.A, m.C)); near(angle(m.B, m.A, m.C), m.x); near(answer(sc, s), m.x);
  }
  for (const id of ['p4-2', 'p4-3']) {
    const sc = get(id);
    for (let a = id === 'p4-2' ? 15 : 8; a <= (id === 'p4-2' ? 30 : 20); a++) for (let bb = 8; bb <= 20; bb += 2) {
      const s = state(sc, id === 'p4-2' ? { kA: a } : { k2A: a, k2B: bb }), m = sc.pa.model(s), b1 = reflect(m.B, m.A, m.u1);
      near(length(b1, m.B1), 0); near(length(m.A, m.B), length(m.A, m.B1));
      if (m.two) near(length(reflect(m.D, m.A, m.u2), m.D2), 0);
      near(angle(m.B1, m.A, m.two ? m.D2 : m.D), m.x); near(answer(sc, s), m.x);
    }
  }
});
