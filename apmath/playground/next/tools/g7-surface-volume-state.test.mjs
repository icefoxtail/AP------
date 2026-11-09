import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const labDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/g7-surface-volume');
function loadUnit() {
  const listeners = {};
  const document = {
    documentElement: { dataset: {} }, head: { append() {} },
    getElementById() { return null; }, createElement() { return {}; },
    addEventListener(name, callback) { listeners[name] = callback; }, querySelector() { return null; }
  };
  const ctx = vm.createContext({ window: { innerWidth: 1440, matchMedia: () => ({ matches: false }) }, document });
  for (const name of ['solid3d', 'dims', 'core', 'net', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 'video']) {
    vm.runInContext(fs.readFileSync(path.join(labDir, name + '.js'), 'utf8'), ctx, { filename: name + '.js' });
  }
  const groups = ctx.window.APL_SV_GROUPS;
  const params = Object.assign({}, ...groups.map(g => g.params));
  const scenes = groups.flatMap(g => g.scenes);
  const lab = { tab: 'problem', _buildProblem() {}, _buildReview() {}, invalidate() {}, setStep(n) { this.s.step = n; } };
  const state = sc => {
    const s = Object.fromEntries(Object.entries(params).map(([key, p]) => [key, p.value]));
    sc.enter(s, lab); s.step = 0; s.revealed = false;
    sc.view(s, lab); sc.problem.text(s);
    return s;
  };
  return { G: ctx.window.APL_SV, scenes, params, lab, state, listeners, window: ctx.window };
}
const U = loadUnit();
const byId = id => U.scenes.find(sc => sc.id === id);
const chooseCorrect = (sc, s) => {
  const q = sc.sv.prob(sc.sv.model(s), s);
  s.svPick = { key: sc.id + '|' + q.key + '|' + (s.svSeed || 0), idx: q.choices.findIndex(o => o.ok) };
  s.revealed = true;
};
const noFeedback = (sc, s, message) => {
  assert.doesNotMatch(sc.problem.text(s), /class="sv-ch (?:ok|bad)"|class="sv-fb/, message);
  assert.equal(s.revealed, false, message + ': answer remains locked');
  assert.ok(s.step < sc.steps(s).length, message + ': previous completed steps do not unlock the new answer');
};

test('changing a numerical problem condition closes the previous answer and completed solution', t => {
  let checked = 0;
  for (const sc of U.scenes) {
    const initial = U.state(sc);
    const oldKey = sc.sv.prob(sc.sv.model(initial), initial).key;
    for (const key of sc.controls(initial)) {
      const p = U.params[key];
      if (!p || p.max === p.min) continue;
      const s = U.state(sc);
      chooseCorrect(sc, s); s.step = sc.steps(s).length;
      s[key] = s[key] === p.min ? p.max : p.min;
      p.onInput?.(s, U.lab);
      const newKey = sc.sv.prob(sc.sv.model(s), s).key;
      if (oldKey === newKey) continue;
      sc.view(s, U.lab);
      noFeedback(sc, s, sc.id + ':' + key);
      checked++;
    }
  }
  assert.ok(checked >= 30, 'exercise numerical condition changes across the unit');
  t.diagnostic(`${checked} numerical condition changes`);
});

test('reselecting or returning to a preset does not resurrect a previous correct choice', t => {
  let checked = 0;
  for (const sc of U.scenes) {
    for (let i = 0; i < sc.presets(U.state(sc)).length; i++) {
      const s = U.state(sc);
      const presets = sc.presets(s);
      presets[i].apply(s, U.lab); sc.view(s, U.lab); sc.problem.text(s);
      chooseCorrect(sc, s); s.step = sc.steps(s).length;
      presets[i].apply(s, U.lab); sc.view(s, U.lab);
      noFeedback(sc, s, sc.id + ':' + presets[i].label);
      const other = presets.find((_, j) => j !== i);
      if (other) {
        chooseCorrect(sc, s);
        other.apply(s, U.lab); sc.view(s, U.lab); sc.problem.text(s);
        presets[i].apply(s, U.lab); sc.view(s, U.lab);
        noFeedback(sc, s, sc.id + ': return to ' + presets[i].label);
      }
      checked++;
    }
  }
  assert.ok(checked >= 50, 'exercise all current selection controls');
  t.diagnostic(`${checked} presets, each reselected and returned to where alternatives exist`);
});

test('view rotation and animation preserve a correctly answered unchanged problem', () => {
  for (const sc of U.scenes) {
    const s = U.state(sc);
    chooseCorrect(sc, s); s.step = sc.steps(s).length;
    const key = s.svPick.key;
    s.svYaw = -44; s.svPitch = 11;
    if (sc.sv.anim) s[sc.sv.anim.key] = 0.37;
    sc.view(s, U.lab);
    assert.match(sc.problem.text(s), /class="sv-fb ok"/, sc.id);
    assert.equal(s.svPick.key, key, sc.id);
    assert.equal(s.revealed, true, sc.id);
  }
});

test('new-question action keeps its first solution step and removes previous feedback', () => {
  for (const sc of U.scenes) {
    const s = U.state(sc);
    Object.assign(U.lab, { scene: sc, s });
    chooseCorrect(sc, s); s.step = sc.steps(s).length;
    U.listeners.click({ target: { closest: () => ({ hasAttribute: name => name === 'data-sv-new' }) } });
    sc.view(s, U.lab);
    noFeedback(sc, s, sc.id);
    assert.equal(s.step, 1, sc.id + ': new question starts at the existing first step');
    assert.equal(s.svSeed, 1, sc.id);
  }
});

test('remaining sphere areas and volumes agree with independent cut counts for every allowed radius', () => {
  const sc = byId('sv3-7');
  const s = U.state(sc);
  for (let r = 1; r <= 12; r++) {
    for (const [kind, remaining, cuts, diskFraction] of [['three', 3 / 4, 2, 1 / 2], ['seven', 7 / 8, 3, 1 / 4]]) {
      Object.assign(s, { remR: r, remKind: kind });
      const m = sc.sv.model(s);
      const surface = 4 * Math.PI * r ** 2 * remaining + cuts * Math.PI * r ** 2 * diskFraction;
      const volume = 4 * Math.PI * r ** 3 / 3 * remaining;
      assert.ok(Math.abs(U.G.vnum(m.area) - surface) < 1e-9);
      assert.ok(Math.abs(U.G.vnum(m.volume) - volume) < 1e-9);
      for (const mode of ['surf', 'vol']) {
        s.remMode = mode;
        const q = sc.sv.prob(sc.sv.model(s), s);
        const answer = q.choices.filter(c => c.ok);
        assert.equal(answer.length, 1);
        assert.ok(Math.abs(U.G.vnum(answer[0].val) - (mode === 'surf' ? surface : volume)) < 1e-9);
      }
    }
  }
});

test('distractor values match the named calculation mistake', () => {
  const check = (sc, s, hint, expected) => {
    const q = sc.sv.prob(sc.sv.model(s), s);
    const choice = q.choices.find(c => c.hint.includes(hint));
    assert.ok(choice && !choice.ok, sc.id + ': ' + hint);
    assert.ok(Math.abs(U.G.vnum(choice.val) - expected) < 1e-9, sc.id + ': ' + hint);
  };
  let sc = byId('sv2-1'), s = U.state(sc), m = sc.sv.model(s);
  check(sc, s, '한 번 더', m.a ** 3 / 9);
  sc = byId('sv2-3'); s = U.state(sc); s.svMode = 'vol'; m = sc.sv.model(s);
  check(sc, s, '아니라', Math.PI * m.r ** 2 * m.h / 2);
  sc = byId('sv2-5'); s = U.state(sc); s.svMode = 'vol'; m = sc.sv.model(s);
  check(sc, s, '곱하지 않았어요', m.a2 ** 2 * m.h2 - m.a1 ** 2 * m.h1);
  sc = byId('sv3-7'); s = U.state(sc); s.remMode = 'vol';
  for (const [kind, fraction] of [['three', 1 / 4], ['seven', 1 / 8]]) {
    s.remKind = kind;
    for (let r = 1; r <= 12; r++) {
      s.remR = r;
      check(sc, s, '잘라 낸 부분', 4 * Math.PI * r ** 3 / 3 * fraction);
      check(sc, s, '반구', 2 * Math.PI * r ** 3 / 3);
    }
  }
});

test('triangular pyramid and frustum measurements equal independent vector products', () => {
  const sub = (a, b) => a.map((v, i) => v - b[i]);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const area = (a, b, c) => Math.hypot(...cross(sub(b, a), sub(c, a))) / 2;
  const A = [0, 0, 0], B = [6, 0, 0], C = [0, 0, 8], D = [0, 9, 0];
  const base = area(A, B, C), lateral = area(A, B, D) + area(B, C, D) + area(C, A, D);
  const volume = Math.abs(sub(D, A).reduce((sum, x, i) => sum + x * cross(sub(B, A), sub(C, A))[i], 0)) / 6;
  const expected = { 'sv2-6': [base + lateral, volume], 'sv2-7': [base + base / 4 + lateral * 3 / 4, volume * 7 / 8] };
  for (const id of Object.keys(expected)) {
    const sc = byId(id), s = U.state(sc);
    for (const [i, label] of ['겉넓이', '부피'].entries()) {
      sc.presets(s).find(p => p.label === label).apply(s, U.lab);
      const q = sc.sv.prob(sc.sv.model(s), s), answer = q.choices.find(c => c.ok);
      assert.ok(Math.abs(U.G.vnum(answer.val) - expected[id][i]) < 1e-10, id + ':' + label);
    }
  }
});

test('review hides calculated formulas until its final solution step in all current scenes', t => {
  const unit = loadUnit();
  let checked = 0;
  for (const sc of unit.scenes) {
    const s = unit.state(sc);
    unit.lab.tab = 'explore';
    const original = sc.view(s, unit.lab).formula;
    unit.lab.tab = 'review';
    const count = sc.steps(s).length;
    for (let step = 0; step < count; step++) {
      s.step = step;
      assert.equal(sc.view(s, unit.lab).formula, null, `${sc.id}: step ${step}`);
      checked++;
    }
    s.step = count;
    const finalFormula = sc.sv.view(sc.sv.model(s), unit.G.baseCtx(s, unit.lab, false), s).formula;
    assert.deepEqual(sc.view(s, unit.lab).formula, finalFormula, `${sc.id}: final formula remains available`);
    unit.lab.tab = 'explore';
    assert.deepEqual(sc.view(s, unit.lab).formula, original, `${sc.id}: inquiry formula remains available`);
  }
  assert.equal(unit.scenes.length, 30);
  t.diagnostic(`${checked} pre-final states across 30 scenes`);
});

test('problem and review keep the same dimensions through every available preset', t => {
  const unit = loadUnit();
  let checked = 0;
  for (const sc of unit.scenes) {
    const s = unit.state(sc);
    for (const preset of [{ label: 'initial' }, ...sc.presets(s)]) {
      unit.lab.tab = 'explore';
      preset.apply?.(s, unit.lab);
      sc.view(s, unit.lab);
      unit.lab.tab = 'problem';
      sc.view(s, unit.lab);
      const question = sc.sv.prob(sc.sv.model(s), s);
      const before = JSON.stringify(sc.steps(s));
      unit.lab.tab = 'review';
      sc.view(s, unit.lab);
      const current = sc.sv.prob(sc.sv.model(s), s);
      assert.equal(current.key, question.key, `${sc.id}: ${preset.label}`);
      assert.equal(current.stem, question.stem, `${sc.id}: same problem conditions`);
      assert.equal(JSON.stringify(sc.steps(s)), before, `${sc.id}: same numerical solution`);
      checked++;
    }
  }
  t.diagnostic(`${checked} problem-to-review transitions with current scene parameters`);
});

test('a rectangle joined to a semicircle multiplies the whole sum by prism height', () => {
  const sc = byId('sv1-5'), s = U.state(sc);
  Object.assign(s, { sW: 4, sRr: 2, sH5: 5, svMode: 'surf' });
  let M = sc.sv.model(s);
  assert.ok(Math.abs(U.G.vnum(M.S) - (16 + 2 * Math.PI)) < 1e-10);
  assert.ok(Math.abs(U.G.vnum(M.P) - (12 + 2 * Math.PI)) < 1e-10);
  assert.ok(Math.abs(U.G.vnum(M.ans) - (92 + 14 * Math.PI)) < 1e-10);
  assert.match(sc.steps(s)[1], /\(12\+2\\pi\)\\times5=60\+10\\pi/);
  s.svMode = 'vol'; M = sc.sv.model(s);
  assert.ok(Math.abs(U.G.vnum(M.ans) - (80 + 10 * Math.PI)) < 1e-10);
  assert.match(sc.steps(s)[2], /\(16\+2\\pi\)\\times5=80\+10\\pi/);
});

// Exercise the actual scene/dimension code and production Board transforms,
// without a browser or a substitute layout calculation. Text envelopes use
// the same conservative width estimate as the lab's dimension boxes; these
// coordinate checks do not claim native font rendering or screenshot PASS.
const boardScope = { window: { APLab: { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) } } };
vm.runInNewContext(fs.readFileSync(path.join(labDir, '../../kit/apl-board.js'), 'utf8'), boardScope);
function drawJoinedSolid({ width = 390, height = 410.75, progress, top = 'cyl', mode = 'surf' }) {
  const unit = loadUnit(), sc = unit.scenes.find(scene => scene.id === 'sv5-6');
  unit.window.innerWidth = width < 560 ? 390 : 1440;
  const s = unit.state(sc);
  Object.assign(s, { svTop: top, svMode: mode, s56T: progress, step: 4, playing: false });
  Object.assign(unit.lab, { tab: 'review', scene: sc, s });
  const b = Object.create(boardScope.window.APLab.Board.prototype), points = [], labels = [];
  const remember = (x, y) => { if (Number.isFinite(x) && Number.isFinite(y)) points.push({ x, y }); };
  const context = new Proxy({ moveTo: remember, lineTo: remember }, { get: (target, key) => target[key] || (() => {}) });
  Object.assign(b, { W: width, H: height, kind: 'figure', aspect: '1:1', pad: 0.02,
    insets: { top: 0, right: 0, bottom: 0, left: 0 }, zoom: 1, panX: 0, panY: 0,
    panes: null, paneId: null, fs: 1, thumb: false, ctx: context,
    focus: { x: [-5, 5], y: [-4, 4] }, _P: point => point, color: () => '#000',
    path(vertices) { for (const p of vertices) { const q = this.toS(p); remember(q.x, q.y); } },
    point(p) { const q = this.toS(p); remember(q.x, q.y); },
    _text(x, y, text, options = {}) {
      const size = (options.size || 13) * this.fs * this._ts();
      const w = unit.G.textW(text, size) + 6;
      labels.push({ text: String(text), x0: x - w / 2, x1: x + w / 2, y0: y - size * 0.6, y1: y + size * 0.6 });
    }
  });
  const modelBefore = JSON.stringify(sc.sv.model(s));
  sc.draw(b, s, {}, unit.lab);
  assert.equal(JSON.stringify(sc.sv.model(s)), modelBefore, 'drawing preserves all numerical problem conditions');
  return { points, labels, b, model: sc.sv.model(s), G: unit.G };
}

test('joined-solid radius and visible geometry stay on the mobile stage through the reported transition', () => {
  // Actual failed measurement/viewport states from run42583866500, kept as
  // separate frozen states rather than pretending their screenshots coincide.
  for (const progress of [0.4637106, 0.4787712, 0.5836806, 0.5987412]) {
    const { points, labels, b } = drawJoinedSolid({ progress });
    assert.ok(labels.some(label => label.text === '반지름 3'), `radius remains present at ${progress}`);
    for (const label of labels.filter(label => /^(높이|반지름) /.test(label.text))) {
      assert.ok(label.x0 >= 0 && label.x1 <= b.W && label.y0 >= 0 && label.y1 <= b.H,
        `${label.text} at ${progress}: ${JSON.stringify(label)}`);
    }
    assert.ok(points.length > 30, 'the actual solid is drawn');
    assert.ok(points.every(p => p.x >= 0 && p.x <= b.W && p.y >= 0 && p.y <= b.H),
      `all visible solid geometry stays in the fit at ${progress}`);
  }
});

test('joined-solid initial and settled fits retain each top shape and its numerical area and volume', () => {
  const expected = { cyl: [256 + 18 * Math.PI, 256 + 27 * Math.PI],
    hemi: [256 + 9 * Math.PI, 256 + 18 * Math.PI], cone: [256 + 6 * Math.PI, 256 + 12 * Math.PI] };
  for (const [width, height] of [[390, 410.75], [1039, 787]]) {
    for (const top of ['cyl', 'hemi', 'cone']) {
      for (const progress of [0, 1]) {
        const { points, labels, b, model, G } = drawJoinedSolid({ width, height, progress, top });
        assert.ok(Math.abs(G.vnum(model.surf) - expected[top][0]) < 1e-9, `${top} surface area`);
        assert.ok(Math.abs(G.vnum(model.vol) - expected[top][1]) < 1e-9, `${top} volume`);
        assert.ok(points.length > 10, `${top}: geometry remains present`);
        for (const label of labels.filter(label => /^(높이|반지름) /.test(label.text))) {
          assert.ok(label.x0 >= 0 && label.x1 <= b.W && label.y0 >= 0 && label.y1 <= b.H,
            `${top}/${width}/${progress}: ${JSON.stringify(label)}`);
        }
        assert.ok(points.every(p => p.x >= 0 && p.x <= b.W && p.y >= 0 && p.y <= b.H),
          `${top}/${width}/${progress}: geometry remains within stage`);
      }
    }
  }
});
