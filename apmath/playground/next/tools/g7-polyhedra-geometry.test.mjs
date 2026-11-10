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

test('every initial and reentered camera pose is representable by its native slider', () => {
  const params = Object.assign({}, ...groups.map(group => group.params));
  for (const sc of scenes) {
    const s = state(sc), first = { yaw: s.phYaw, pitch: s.phPitch };
    for (const reentry of [false, true]) {
      if (reentry) { s.phYaw = 87; s.phPitch = 12; sc.enter(s); }
      assert.deepEqual({ yaw: s.phYaw, pitch: s.phPitch }, first, `${sc.id}: original camera pose restored`);
      const active = typeof sc.controls === 'function' ? sc.controls(s) : sc.controls || [];
      for (const key of ['phYaw', 'phPitch'].filter(key => active.includes(key))) {
        const p = params[key], v = s[key];
        assert.ok(Number.isFinite(v) && v >= p.min && v <= p.max,
          `${sc.id}: ${key}=${v} would be silently clamped by native range [${p.min}, ${p.max}]`);
        assert.ok(Math.abs((v - p.min) / p.step - Math.round((v - p.min) / p.step)) < 1e-8,
          `${sc.id}: the displayed initial camera angle must be a representable range step`);
      }
      assert.equal(s.playing, false); assert.equal(s.revealed, false);
    }
  }
});

test('current-question solution math survives HTML escaping and production KaTeX rendering', t => {
  const renderContext = vm.createContext({ window: {}, document: { ...document, documentElement: { setAttribute() {}, getAttribute() { return 'paper'; } } },
    URLSearchParams, location: { search: '' }, localStorage: { getItem() { return null; }, setItem() {} } });
  vm.runInContext(fs.readFileSync(new URL('../kit/vendor/katex/katex.min.js', import.meta.url), 'utf8'), renderContext);
  renderContext.window.katex = renderContext.katex;
  vm.runInContext(fs.readFileSync(new URL('../kit/apl-core.js', import.meta.url), 'utf8'), renderContext);
  const A = renderContext.window.APLab;
  let formulas = 0;
  for (const sc of scenes) {
    const variants = sc.id === 'p2-6' ? [{ p: 3 }, { p: 4 }, { p: 5 }] : [null];
    for (const question of variants) {
      const s = state(sc), lab = { tab: 'problem', scene: sc, s };
      sc.enter(s, lab);
      if (question) s.phQ = question;
      sc.view(s, lab); lab.tab = 'review'; sc.view(s, lab);
      for (const line of sc.steps(s)) {
        // The shell escapes step prose before passing it to the shared math renderer.
        const html = A.renderMath(A.esc(String(line)).replace(/&amp;/g, '&'));
        assert.doesNotMatch(html, /class="katex-error"/, `${sc.id}: ${line}`);
        if (String(line).includes('$')) {
          assert.match(html, /class="katex"/, `${sc.id}: math was rendered`);
          formulas++;
        }
      }
    }
  }
  t.diagnostic(`${formulas} mathematical solution lines rendered with the vendored KaTeX`);
});

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

test('all 26 independent questions retain their drawing and solution until returning to inquiry', t => {
  let stepsChecked = 0;
  for (const sc of scenes) {
    const s = state(sc), lab = { tab: 'explore', scene: sc, s };
    sc.enter(s, lab); sc.view(s, lab);
    const original = JSON.stringify(sc.steps(s));
    lab.tab = 'problem'; sc.view(s, lab);
    const Q = s.phPC.Q, choices = JSON.stringify(Q.choices), question = s.phQ;
    lab.tab = 'review'; sc.view(s, lab);
    assert.ok(sc.ph.problemSteps, sc.id + ': has a current-question solution');
    assert.equal(s.phQ, question, sc.id + ': preserves the question conditions');
    assert.equal(JSON.stringify(s.phPC.Q.choices), choices, sc.id + ': choices do not reshuffle');
    assert.ok(sc.reviewTop(s).includes(G.esc(Q.stem)), sc.id + ': repeats the current question');
    assert.doesNotMatch(sc.reviewTop(s), /class="ph-ch (?:ok|bad)"|class="ph-fb/, sc.id + ': neutral review choices');
    let seen;
    const draw = sc.ph.draw;
    sc.ph.draw = (_b, _s, M, C) => { seen = { M, C }; };
    try { sc.draw({ thumb: false }, s, {}, lab); } finally { sc.ph.draw = draw; }
    assert.equal(seen.M.Q, question, sc.id);
    assert.equal(seen.C.questionReview, true, sc.id);
    assert.equal(seen.C.problem, !sc.ph.questionReviewDraw, sc.id + ': current-question diagram branch');
    const steps = sc.steps(s);
    assert.ok(steps.length >= 3, sc.id);
    assert.doesNotMatch(steps.join(' '), /undefined|NaN|\[object Object\]/, sc.id);
    for (let step = 0; step < steps.length; step++) {
      s.step = step;
      assert.equal(sc.view(s, lab).formula, null, `${sc.id}: calculated answer hidden at step ${step}`);
      stepsChecked++;
    }
    lab.tab = 'explore'; sc.view(s, lab);
    assert.equal(JSON.stringify(sc.steps(s)), original, sc.id + ': inquiry explanation restored');
    assert.equal(sc.reviewTop(s), '', sc.id);
  }
  assert.equal(scenes.length, 26);
  t.diagnostic(`${stepsChecked} pre-final stages; 26 complete question-review-inquiry transitions`);
});

test('count, Euler, regular-solid and truncation solutions use the independent question values', t => {
  const solve = (id, question, extra = {}) => {
    const sc = scene(id), s = state(sc), lab = { tab: 'explore', scene: sc, s };
    sc.enter(s, lab); Object.assign(s, extra, { phQ: question }); sc.view(s, lab);
    lab.tab = 'problem'; sc.view(s, lab);
    lab.tab = 'review'; sc.view(s, lab);
    return { steps: Array.from(sc.steps(s)), Q: s.phPC.Q };
  };
  let count = 0;
  for (const [id, pyramid] of [['p1-1', false], ['p1-2', true], ['p1-3', false]]) {
    for (let n = 4; n <= 12; n++) {
      const values = pyramid ? { F: n + 1, V: n + 1, E: 2 * n } : { F: n + 2, V: 2 * n, E: 3 * n };
      for (const given of ['F', 'E', 'V']) for (const ask of ['F', 'E', 'V'].filter(k => k !== given)) {
        const { steps, Q } = solve(id, { n, given, ask });
        assert.ok(steps[1].includes(`=${n}$`), `${id} n=${n}: recover the question's base polygon`);
        assert.ok(steps.at(-1).includes(`=${values[ask]}$`), `${id} ${ask}`);
        assert.equal(Q.choices.find(c => c.ok).p, `${values[ask]}개`);
        count++;
      }
    }
  }
  const regular = { tetra: [4, 6, 4], cube: [8, 12, 6], octa: [6, 12, 8], dodeca: [20, 30, 12], icosa: [12, 30, 20] };
  for (const [k, [V, E, F]] of Object.entries(regular)) {
    for (const ask of ['V', 'E', 'F']) {
      const val = { V, E, F }[ask];
      assert.ok(solve('p1-7', { id: k, n: 0, ask }).steps.at(-1).includes(`=${val}$`));
      const cut = { V: 2 * E, E: 3 * E, F: F + V }[ask];
      assert.ok(solve('p4-2', { k, ask }).steps.at(-1).includes(`=${cut}$`));
      count += 2;
    }
    for (const ask of ['V', 'E']) {
      const val = { V, E }[ask];
      assert.ok(solve('p2-4', { k, ask }).steps.at(-1).includes(`=${val}$`)); count++;
    }
  }
  const impossible = solve('p2-1', { p: 4, q: 5 });
  assert.match(impossible.steps[1], /90\^\\circ\\times5=450/);
  assert.match(impossible.steps.at(-1), /만들 수 없/);
  for (const [p, max] of [[3, 5], [4, 3], [5, 3]]) assert.match(solve('p2-6', { p }).steps.at(-1), new RegExp(`최대 ${max}개`));
  for (const a of [4, 6, 8, 10, 12]) {
    const { steps } = solve('p3-7', { a }, { phEdge: a === 8 ? 14 : 8 });
    assert.match(steps[0], new RegExp(`한 모서리가 ${a}`));
    assert.ok(steps.at(-1).includes(`\\dfrac{${a}}{2}=${a / 2}`)); count++;
  }
  t.diagnostic(`${count} independent numerical cases plus angle/max-face cases`);
});

test('three-vertex section review follows the problem, then follows the selected inquiry vertices', () => {
  const sc = scene('p4-3'), s = state(sc), lab = { tab: 'explore', scene: sc, s };
  sc.enter(s, lab);
  s.phC3 = ['B', 'D', 'E']; s.phQ = { tri: ['A', 'G', 'H'] };
  sc.view(s, lab);
  assert.match(sc.steps(s).at(-1), /정삼각형/);
  lab.tab = 'problem'; sc.view(s, lab);
  lab.tab = 'review'; sc.view(s, lab);
  assert.match(sc.steps(s).at(-1), /직사각형/);
  assert.doesNotMatch(sc.steps(s).at(-1), /단면은.*정삼각형/);
  lab.tab = 'explore'; sc.view(s, lab);
  lab.tab = 'review'; sc.view(s, lab);
  assert.match(sc.steps(s).at(-1), /정삼각형/);
});

test('count-question solids render the question polygon in problem and review, then restore inquiry', t => {
  const c = vm.createContext({ window: { APLab: { clamp: (x, a, b) => Math.max(a, Math.min(b, x)) } }, document });
  vm.runInContext(fs.readFileSync(new URL('../kit/apl-board.js', import.meta.url), 'utf8'), c);
  for (const name of ['core', 'geo', 'cubesec']) {
    vm.runInContext(fs.readFileSync(new URL('../labs/g7-polyhedra/' + name + '.js', import.meta.url), 'utf8'), c);
  }
  const rendered = [], drawPoly = c.window.APL_PH.drawPoly;
  c.window.APL_PH.drawPoly = (D, S, options) => {
    rendered.push({ V: S.V.length, E: S.E.length, F: S.F.length });
    return drawPoly(D, S, options);
  };
  vm.runInContext(fs.readFileSync(new URL('../labs/g7-polyhedra/t1.js', import.meta.url), 'utf8'), c);
  const group = c.window.APL_PH_GROUPS[0];
  const board = () => {
    const b = Object.create(c.window.APLab.Board.prototype);
    Object.assign(b, { W: 1039, H: 787, pad: .02, kind: 'figure', aspect: '1:1',
      insets: { left: 0, right: 0, top: 0, bottom: 0 }, zoom: 1, panX: 0, panY: 0,
      fs: 1, thumb: false, focus: { x: [-5, 5], y: [-4, 4] }, panes: null, paneId: null });
    b.ctx = new Proxy({}, { get: () => () => {} }); b.color = x => x;
    for (const method of ['path', 'point', 'handle', 'text', 'stext']) b[method] = () => {};
    return b;
  };
  let frames = 0;
  for (const id of ['p1-1', 'p1-2', 'p1-3']) for (const n of [3, 7, 12]) {
    const sc = group.scenes.find(x => x.id === id), s = { ...defaults };
    const lab = { tab: 'explore', scene: sc, s };
    sc.enter(s, lab); Object.assign(s, { phN: 5, phN8: 4, phQ: { n, given: 'E', ask: 'F' } });
    sc.view(s, lab);
    const expected = id === 'p1-2' ? { V: n + 1, E: 2 * n, F: n + 1 } : { V: 2 * n, E: 3 * n, F: n + 2 };
    for (const [tab, step] of [['problem', 0], ['review', 0], ['review', 3]]) {
      lab.tab = tab; sc.view(s, lab); s.step = step; rendered.length = 0;
      sc.draw(board(), s, {}, lab);
      assert.ok(rendered.length, `${id}: a solid was drawn`);
      for (const solid of rendered) assert.deepEqual(solid, expected, `${id} n=${n} ${tab} step ${step}`);
      frames++;
    }
    lab.tab = 'explore'; sc.view(s, lab); rendered.length = 0; sc.draw(board(), s, {}, lab);
    const inquiry = id === 'p1-2' ? { V: 6, E: 10, F: 6 } : id === 'p1-1' ? { V: 10, E: 15, F: 7 } : { V: 8, E: 12, F: 6 };
    assert.ok(rendered.some(solid => JSON.stringify(solid) === JSON.stringify(inquiry)), `${id}: inquiry polygon restored`);
    assert.equal(s.phN, 5); assert.equal(s.phN8, 4);
  }
  t.diagnostic(`${frames} actual draw calls checked with independent vertex/edge/face counts; 9 inquiry restorations`);
});

test('maximum-face review reveals the current polygon fan only at the final step', t => {
  const c = vm.createContext({ window: { APLab: { clamp: (x, a, b) => Math.max(a, Math.min(b, x)) } }, document });
  vm.runInContext(fs.readFileSync(new URL('../kit/apl-board.js', import.meta.url), 'utf8'), c);
  for (const name of ['core', 'geo', 'cubesec', 't2']) {
    vm.runInContext(fs.readFileSync(new URL('../labs/g7-polyhedra/' + name + '.js', import.meta.url), 'utf8'), c);
  }
  const sc = c.window.APL_PH_GROUPS[0].scenes.find(x => x.id === 'p2-6');
  const polygons = [], labels = [];
  const board = () => {
    const b = Object.create(c.window.APLab.Board.prototype);
    Object.assign(b, { W: 390, H: 412, pad: .02, kind: 'figure', aspect: '1:1',
      insets: { left: 0, right: 0, top: 0, bottom: 58 }, zoom: 1, panX: 0, panY: 0,
      fs: 1, thumb: false, focus: { x: [-5, 5], y: [-4, 4] }, panes: null, paneId: null });
    b.ctx = new Proxy({}, { get: () => () => {} }); b.color = x => x;
    b.path = (pts, options = {}) => { if (options.close && options.fill) polygons.push(pts); };
    b.text = (_p, text) => labels.push(String(text));
    b.stext = (_x, _y, text) => labels.push(String(text));
    b.point = b.handle = () => {};
    return b;
  };
  let frames = 0;
  for (const p of [3, 4, 5]) {
    const s = { ...defaults }, lab = { tab: 'explore', scene: sc, s };
    sc.enter(s, lab); Object.assign(s, { phPp: 6, phQq: 6, phQ: { p } });
    const angle = 180 - 360 / p, max = Math.ceil(360 / angle) - 1;
    for (const [tab, step] of [['problem', 0], ['review', 0], ['review', 1], ['review', 2], ['review', 3]]) {
      lab.tab = tab; sc.view(s, lab); s.step = step;
      polygons.length = labels.length = 0; sc.draw(board(), s, {}, lab);
      const final = tab === 'review' && step === 3;
      assert.equal(polygons.length, final ? max : 1, `p=${p}, ${tab}, step=${step}`);
      for (const polygon of polygons) {
        assert.equal(polygon.length, p, 'the drawn face follows the current question');
        assert.ok(Math.hypot(polygon[0].x, polygon[0].y) < 1e-10, 'every face shares point O');
        for (let i = 0; i < p; i++) {
          const a = polygon[i], b = polygon[(i + 1) % p];
          assert.ok(Math.abs(Math.hypot(a.x - b.x, a.y - b.y) - 1) < 1e-10, 'each face is regular');
        }
      }
      if (!final) assert.doesNotMatch(labels.join(' '), /최대|360|개를 점 O에 모았/);
      else {
        assert.ok(max * angle < 360 && (max + 1) * angle >= 360, 'fan is the independent maximum');
        assert.match(labels.join(' '), new RegExp(`${max}개`));
      }
      frames++;
    }
    lab.tab = 'explore'; sc.view(s, lab); polygons.length = labels.length = 0;
    sc.draw(board(), s, {}, lab);
    assert.ok(labels.includes('정육각형'), 'inquiry returns to its own table and chosen polygon');
    assert.equal(s.phPp, 6); assert.equal(s.phQq, 6);
  }
  t.diagnostic(`${frames} question/step drawings, three independent maximum-angle calculations, three inquiry restorations`);
});
