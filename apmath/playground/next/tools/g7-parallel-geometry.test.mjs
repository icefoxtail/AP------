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

test('manual answer reveal relocks on a new question but not on a visual-only change', () => {
  const sc = get('p3-1'), s = state(sc);
  Object.assign(s, { revealed: true, step: 3, papick: null });
  s.tA += 2; sc.view(s, { tab: 'explore' });
  assert.equal(s.revealed, false); assert.equal(s.step, 0);
  Object.assign(s, { revealed: true, step: 3 });
  s.tX += .1; sc.view(s, { tab: 'explore' });
  assert.equal(s.revealed, true); assert.equal(s.step, 3);
});

test('judgement problem review follows every current option and restores exploration', () => {
  const sc = get('p1-3');
  for (let sample = 0; sample < 40; sample++) {
    const s = state(sc, { rA: 53, rB: 127, rMode: 'alt', step: 0 }); sc.pa.reroll(s);
    const before = [s.rA, s.rB, s.rMode], list = sc.pa.model(s).list;
    const lab = { s, scene: { ...sc }, tab: 'problem', invalidate() {}, _buildReview() {} };
    sc.view(s, lab); lab.tab = 'review'; sc.view(s, lab);
    assert.equal(sc.steps(s).length, 6, 'five current choices and a final conclusion');
    for (let i = 0; i < 6; i++) {
      s.step = i + 1; sc.view(s, lab); const M = sc.pa.model(s), idx = i < 5 ? i : list.findIndex(x => x.ok), choice = list[idx];
      assert.equal(M.vP, choice.vP); assert.equal(M.vQ, choice.vQ); assert.equal(M.kind, choice.kind);
      if (i < 5) { assert.ok(sc.steps(s)[i].includes(choice.vP + '°')); assert.ok(sc.steps(s)[i].includes(choice.vQ + '°')); }
      else assert.equal(M.eq, true);
    }
    lab.tab = 'explore'; sc.view(s, lab);
    assert.deepEqual([s.rA, s.rB, s.rMode], before);
    assert.equal(sc.pa.model(s).vP, before[0]); assert.equal(sc.pa.model(s).vQ, before[1]);
    assert.equal(sc.steps(s).length, 3, 'principle exploration retains its original three steps');
  }
});

// Match the mobile board sizes and 60 px tool inset in the Chromium audit. The
// production transform matters here: a large zero-inset test board misses the
// two interior-angle labels meeting at the centre of the small polygon.
context.window.APLab = { clamp: (x, a, b) => Math.max(a, Math.min(b, x)) };
vm.runInContext(fs.readFileSync(path.join(root, 'kit/apl-board.js'), 'utf8'), context);
function polygonProblemScreen(s, W, H) {
  const b = Object.create(context.window.APLab.Board.prototype), texts = [], arcs = [], paths = [], leaders = [];
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: 0, top: 0, bottom: 60 }, zoom: 1, panX: 0, panY: 0, fs: 1, thumb: false, panes: null, paneId: null });
  b.path = (p, o = {}) => paths.push({ p: p.map(v => ({ ...v })), o });
  b.arc = (p, r, a, z, o = {}) => arcs.push({ p, r, a, z, o });
  for (const method of ['point', 'right', 'ticks', 'handle']) b[method] = () => {};
  b.leader = (anchor, target) => leaders.push({ anchor, target });
  b.annotationSize = (text, o) => ({ width: context.window.APL_PA_KIT.textW(text, o.size) + 6, height: o.size + 6 });
  b.text = (p, text, o = {}) => {
    const P = b.toS(p), size = o.size * b.fs * b._ts(), width = context.window.APL_PA_KIT.textW(text, size);
    const x = P.x + (o.dx || 0), y = P.y + (o.dy || 0);
    texts.push({ text: String(text), p, x0: x - width / 2 - 2, x1: x + width / 2 + 2, y0: y - size / 2 - 2, y1: y + size / 2 + 2 });
  };
  const sc = get('p3-3'); sc.draw(b, s, {}, { tab: 'problem', s, scene: sc });
  return { b, texts, arcs, paths, leaders };
}
const textOverlap = (a, b) => Math.min(a.x1, b.x1) > Math.max(a.x0, b.x0) && Math.min(a.y1, b.y1) > Math.max(a.y0, b.y0);
for (const [W, H] of [[390, 309], [360, 291]]) test(`p3-3 ${W}px problem keeps both given interior angles separately readable`, () => {
  const sc = get('p3-3');
  for (const n of [6, 5, 8]) for (const t of [40, 0, 15, 30, 50, 60, 75, 100]) {
    const s = state(sc, { hN: n, hT: t }), m = sc.pa.model(s);
    const { b, texts, arcs, paths, leaders } = polygonProblemScreen(s, W, H), given = texts.filter(x => x.text === m.I + '°');
    assert.equal(given.length, 2, 'B and C must each retain their stated interior angle');
    assert.ok(!textOverlap(given[0], given[1]), `${W}px n=${n}, tilt=${t}: the two ${m.I}° labels merge`);
    for (const label of given) {
      assert.ok(label.x0 >= 0 && label.x1 <= W && label.y0 >= 0 && label.y1 <= H - 60, 'given angle is clipped or enters the tool region');
      for (const other of texts.filter(x => !given.includes(x))) assert.ok(!textOverlap(label, other), `${W}px n=${n}, tilt=${t}: given angle covers ${other.text}: ${JSON.stringify({ label, other })}`);
    }
    assert.equal(leaders.length, 2, 'each separately placed value connects to its own angle mark');
    for (const i of [1, 2]) {
      near(angle(m.V[i - 1], m.V[i], m.V[i + 1]), m.I, 'geometric interior angle');
      const marks = arcs.filter(x => length(x.p, m.V[i]) < 1e-8);
      assert.equal(marks.length, 4, 'filled sector and three equal-angle arcs are retained');
      for (const mark of marks) near((mark.z - mark.a) * 180 / Math.PI, m.I, 'drawn arc matches the interior angle');
    }
    const polygon = paths.find(x => x.p.length === n && x.o.close);
    assert.deepEqual(JSON.parse(JSON.stringify(polygon.p)), JSON.parse(JSON.stringify(m.V)), 'the original regular polygon is unchanged');
    near(answer(sc, s), 2 * m.I - 180 - m.a, 'answer');
    assert.ok(texts.some(x => x.text === 'x'), 'the required angle remains unknown');
    assert.ok(!texts.some(x => x.text === m.b + '°' && length(x.p, m.V[3]) < 1e-8), 'the answer is not revealed at D');
    assert.ok(Number.isFinite(b.k));
  }
});
