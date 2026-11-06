import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const listeners = {};
const document = { documentElement: { dataset: {} }, head: { append() {} },
  getElementById() { return null; }, createElement() { return {}; },
  addEventListener(name, callback) { listeners[name] = callback; } };
const context = vm.createContext({ window: {}, document });
vm.runInContext('let seed=260711;Math.random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}', context);
for (const name of ['core', 'geo', 'cubesec', 't1', 't2', 't3', 't4']) {
  const url = new URL('../labs/g7-polyhedra/' + name + '.js', import.meta.url);
  vm.runInContext(fs.readFileSync(url, 'utf8'), context, { filename: fileURLToPath(url) });
}
const G = context.window.APL_PH, groups = context.window.APL_PH_GROUPS, scenes = groups.flatMap(g => g.scenes);
const defaults = Object.fromEntries(Object.entries(Object.assign({}, ...groups.map(g => g.params))).map(([k, p]) => [k, p.value]));
const scene = id => scenes.find(sc => sc.id === id);
const state = sc => { const s = { ...defaults }; sc.enter(s); return s; };
const close = (a, b) => Math.hypot(...a.map((v, i) => v - b[i])) < 1e-8;

// An independent oracle solves the plane equation along each coordinate axis,
// fixing the other two coordinates to cube faces. It does not use scene edges.
function sectionPoints(a, b, fraction) {
  const n = [1, Math.tan(a * Math.PI / 180), Math.tan(b * Math.PI / 180)];
  return sectionPointsND(n, fraction * n.reduce((sum, v) => sum + Math.abs(v), 0));
}
function sectionPointsND(n, d) {
  const points = [];
  const add = p => { if (!points.some(q => close(p, q))) points.push(p); };
  for (let free = 0; free < 3; free++) {
    const fixed = [0, 1, 2].filter(i => i !== free);
    for (const first of [-1, 1]) for (const second of [-1, 1]) {
      const p = [0, 0, 0]; p[fixed[0]] = first; p[fixed[1]] = second;
      const remainder = d - n[fixed[0]] * first - n[fixed[1]] * second;
      if (Math.abs(n[free]) < 1e-10) {
        if (Math.abs(remainder) < 1e-10) for (const end of [-1, 1]) { p[free] = end; add(p.slice()); }
      } else {
        p[free] = remainder / n[free];
        if (Math.abs(p[free]) <= 1 + 1e-9) add(p.slice());
      }
    }
  }
  return points;
}

test('cube sections retain every endpoint at faces, edges and vertices', () => {
  const sc = scene('p4-1'), s = state(sc);
  Object.assign(s, { phTa: 0, phTb: 0, phTd: 1 });
  assert.equal(sc.ph.model(s).k, 4, 'a cutting plane coinciding with x = 1 retains all four face vertices');
  for (const a of [0, 15, 30, 45]) for (const b of [0, 15, 30, 45]) {
    for (const fraction of [-1, -.75, -2 / 3, -.5, -1 / 3, -.25, 0, .25, 1 / 3, .5, 2 / 3, .75, 1]) {
      Object.assign(s, { phTa: a, phTb: b, phTd: fraction });
      const expected = sectionPoints(a, b, fraction), M = sc.ph.model(s), label = [a, b, fraction].join('|');
      assert.equal(M.k, expected.length >= 3 ? expected.length : 0, label);
      if (M.k) {
        assert.ok(expected.every(p => M.sec.pts.some(q => close(p, [q.x, q.y, q.z]))), label);
        assert.equal(M.sec.faces.length + M.sec.edgeCount, M.k, label + ': section boundary counts');
      }
    }
  }
  Object.assign(s, { phTa: 0, phTb: 0, phTd: 1 });
  assert.equal(sc.ph.model(s).name, '정사각형');
});

test('the section-question fallback has the same three-sided plane as its given points', () => {
  // Repeatedly choose three edges of one cube face so all random attempts are rejected.
  vm.runInContext('var savedRandom = Math.random; var ri=0; var draws=[.999,.999,.999,.999,.999,.999,.999,.999,.6,.999,.999,.5,.5,.5]; Math.random=()=>draws[(ri++)%14]', context);
  try {
    const sc = scene('p4-1'), s = state(sc), Q = sc.ph.model(s).Q;
    assert.equal(context.ri, 300 * 14, 'exercise the bounded fallback after all attempts');
    const [a, b, c] = Q.P3.map(p => [p.x, p.y, p.z]), u = b.map((x, i) => x - a[i]), v = c.map((x, i) => x - a[i]);
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const vertices = sectionPointsND(n, n.reduce((sum, x, i) => sum + x * a[i], 0));
    assert.equal(vertices.length, Q.cnt);
    assert.equal(vertices.length, 3);
  } finally { vm.runInContext('Math.random = savedRandom', context); }
});

test('shortest-path equality is exact and a one-percent displacement is not called straight', () => {
  const sc = scene('p3-7'), s = state(sc);
  for (let percent = 10; percent <= 90; percent++) {
    s.phAnt = percent / 100;
    const M = sc.ph.model(s);
    assert.equal(M.mid, percent === 50, String(percent));
    assert.ok(Math.abs(M.minLen - M.a * Math.sqrt(5)) < 1e-10);
    if (percent !== 50) assert.ok(M.len > M.minLen);
  }
  s.phAnt = .49;
  const v = sc.view(s, { tab: 'explore' });
  assert.equal(v.readouts.find(r => r.label === 'EP').value, '3.92');
  s.step = 2;
  assert.equal(sc.view(s, { tab: 'review' }).readouts.find(r => r.label === 'EP').value, '4');
});

test('nonregular-solid explanation follows the selected square pyramid and joined state', () => {
  const sc = scene('p2-3'), s = state(sc);
  s.phEx = 'sq';
  const steps = sc.steps(s).join(' ');
  assert.match(steps, /정사각형/);
  assert.doesNotMatch(steps, /정사면체 2개|정삼각형 \$6\$/);
  s.phEx = 'bi'; s.phJoin = 0;
  assert.match(sc.view(s, { tab: 'explore' }).readouts.find(r => r.label === '면').value, /8개/);
  s.phJoin = 1;
  assert.match(sc.view(s, { tab: 'explore' }).readouts.find(r => r.label === '면').value, /6개/);
});

test('manual reveal and a correct choice close on a changed question while cached choices stay stable', t => {
  let changes = 0;
  for (const sc of scenes) for (const picked of [false, true]) {
    const s = state(sc), lab = { tab: 'problem' };
    sc.view(s, lab); sc.problem.text(s);
    const old = s.phPC.Q;
    s.revealed = true; s.step = sc.steps(s).length;
    if (picked) s.phPick = { key: sc.id + '|' + old.key + '|0', idx: old.choices.findIndex(c => c.ok) };
    for (let i = 0; i < 30; i++) {
      sc.ph.reroll(s); sc.view(s, lab); sc.problem.text(s);
      if (s.phPC.Q.key !== old.key) break;
    }
    assert.notEqual(s.phPC.Q.key, old.key, sc.id);
    assert.equal(s.revealed, false, sc.id + ': manual/picked=' + picked);
    assert.equal(s.phPick, null, sc.id);
    assert.equal(s.step, 0, sc.id);
    const html = sc.problem.text(s);
    assert.doesNotMatch(html, /class="ph-ch (?:ok|bad)"|class="ph-fb/);
    assert.equal(sc.problem.text(s), html, sc.id + ': stable cached options');
    changes++;
  }
  t.diagnostic(`${changes} condition changes`);
});

test('orbit and pure animation preserve progress; new-question button preserves step one', () => {
  for (const sc of scenes) {
    const s = state(sc), lab = { tab: 'problem', scene: sc, s, setStep(n) { s.step = n; }, _buildReview() {}, invalidate() {} };
    sc.view(s, lab); sc.problem.text(s);
    const q = s.phPC.Q, key = sc.id + '|' + q.key + '|0';
    s.phPick = { key, idx: q.choices.findIndex(c => c.ok) }; s.revealed = true; s.step = sc.steps(s).length;
    s.phYaw = -44; s.phPitch = 35;
    if (sc.ph.anim) s[sc.ph.anim.key] = .37;
    sc.view(s, lab);
    assert.match(sc.problem.text(s), /class="ph-fb ok"/, sc.id);
    assert.equal(s.revealed, true, sc.id);
    assert.equal(s.phPick.key, key, sc.id);
    listeners.click({ target: { closest: () => ({ hasAttribute: name => name === 'data-ph-new' }) } });
    sc.view(s, lab); sc.problem.text(s);
    assert.equal(s.revealed, false, sc.id);
    assert.equal(s.phPick, null, sc.id);
    assert.equal(s.step, 1, sc.id);
  }
});

test('truncated solids retain exact topology through every allowed cutting-depth endpoint', () => {
  for (const key of G.PLAT_KEYS) for (const ratio of [.05, 1 / 3, .45]) {
    const original = G.platS(key), cut = G.truncS(original, ratio);
    assert.equal(cut.F.length, original.F.length + original.V.length, key);
    assert.equal(cut.V.length, 2 * original.E.length, key);
    assert.equal(cut.E.length, 3 * original.E.length, key);
    assert.equal(cut.V.length - cut.E.length + cut.F.length, 2, key);
    assert.ok(cut.E.every(e => e.f.length === 2), key + ': every edge borders two faces');
  }
});
