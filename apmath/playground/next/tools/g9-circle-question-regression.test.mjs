import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createRequire } from 'node:module';

const labRoot = process.env.CIRCLE_LAB_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/g9-circle');
const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
const context = vm.createContext({ window: {}, document });
for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 'solutions']) {
  const file = path.join(labRoot, name + '.js');
  if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}
const groups = context.window.APL_CI_GROUPS;
const scenes = groups.flatMap(g => g.scenes);
const defaults = Object.assign({}, ...groups.map(g => g.params));
const state = sc => { const s = Object.fromEntries(Object.entries(defaults).map(([k, p]) => [k, p.value])); sc.enter(s); return s; };
const PC = { tab: 'problem', problem: true, review: false, step: 99, txt: true };
const G = context.window.APL_CI;
const katex = createRequire(import.meta.url)(path.resolve(labRoot, '../../kit/vendor/katex/katex.min.js'));
const close = (a, b, label) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)), `${label}: ${a} != ${b}`);
function checkMath(html, label) {
  assert.doesNotMatch(html, /NaN|undefined|Infinity/, label);
  assert.equal((html.match(/\$/g) || []).length % 2, 0, `${label}: unbalanced math delimiters`);
  for (const [, tex] of html.matchAll(/\$([^$]+)\$/g)) katex.renderToString(tex, { throwOnError: true, strict: 'ignore' });
}
function board(W = 390, H = 440) {
  const items = [], b = { W, H, pad: .02, insets: { top: 0, bottom: 0, left: 0, right: 0 }, focus: { x: [-6, 6], y: [-6, 6] }, items };
  Object.defineProperty(b, 'k', { get() { return Math.min((W - 2 * .02 * Math.min(W, H)) / (this.focus.x[1] - this.focus.x[0]), (H - 2 * .02 * Math.min(W, H)) / (this.focus.y[1] - this.focus.y[0])); } });
  const P = p => { assert.ok(p && Number.isFinite(p.x) && Number.isFinite(p.y), `invalid point: ${JSON.stringify(p)}`); };
  b.toS = p => { P(p); return { x: W / 2 + (p.x - (b.focus.x[0] + b.focus.x[1]) / 2) * b.k, y: H / 2 + (p.y - (b.focus.y[0] + b.focus.y[1]) / 2) * b.k }; };
  b.toW = (x, y) => ({ x: (x - W / 2) / b.k + (b.focus.x[0] + b.focus.x[1]) / 2, y: (y - H / 2) / b.k + (b.focus.y[0] + b.focus.y[1]) / 2 });
  b.path = (points, options) => { points.forEach(P); items.push({ type: 'path', points, options }); return b; };
  b.circle = (p, r, options) => { P(p); assert.ok(Number.isFinite(r) && r >= 0, 'invalid circle radius'); items.push({ type: 'circle', p, r, options }); return b; };
  b.arc = (p, r, a, z, options) => { P(p); assert.ok([r, a, z].every(Number.isFinite), 'invalid arc'); items.push({ type: 'arc', p, r, a, z, options }); return b; };
  for (const method of ['right', 'ticks']) b[method] = (...args) => { args.slice(0, method === 'right' ? 3 : 2).forEach(P); items.push({ type: method, args }); return b; };
  for (const method of ['point', 'handle']) b[method] = (...args) => { P(args[method === 'point' ? 0 : 1]); items.push({ type: method, args }); return b; };
  b.text = (p, str, o) => { P(p); assert.doesNotMatch(String(str), /NaN|undefined|Infinity|^\?$/); items.push({ type: 'text', p, str, o }); return b; };
  return b;
}

test('c1-1 solves the current R=17, AB=16 question, independent of exploration R=10, OM=6', () => {
  const sc = scenes.find(sc => sc.id === 'c1-1'), s = state(sc);
  s.ciPk = { kind: 0, am: 8, om: 15, R: 17, key: 'regression.17.16' };
  s.c1R = 10; s.c1d = 6;
  const Q = sc.ci.prob(sc.ci.model(s, PC), s);
  assert.match(Q.stem, /17/);
  assert.match(Q.stem, /16/);
  const steps = sc.steps(s).join('\n');
  assert.match(steps, /17/);
  assert.match(steps, /15/);
  assert.doesNotMatch(steps, /10\^2-6\^2/);
  assert.match(sc.steps(s).at(-1), /OM[^]*15/);
});

test('45 scenes × 120 deterministic questions: geometry, choices, current-target solution and TeX agree', () => {
  assert.equal(scenes.length, 45);
  let checked = 0;
  for (const sc of scenes) {
    assert.equal(typeof sc.ci.solve, 'function', `${sc.id}: missing current-question solution`);
    const s = state(sc), kinds = new Set();
    for (let seed = 0; seed < 120; seed++) {
      s.ciPk = sc.ci.gen(G.seeded(`circle-audit|${sc.id}|${seed}`), seed);
      kinds.add(s.ciPk.kind);
      const sol = sc.solution(s), Q = sol.question, label = `${sc.id}/${s.ciPk.key}`;
      assert.equal(sol.key, Q.key, label);
      assert.equal(JSON.stringify(sol.model.q), JSON.stringify(s.ciPk), label);
      assert.equal(sol.steps.length, 5, label);
      assert.equal(Q.choices.length, 5, `${label}: five choices retained`);
      assert.equal(Q.choices.filter(c => c.ok).length, 1, label);
      close(Q.chk[0], Q.chk[1], `${label}: drawn condition vs answer`);
      close(sol.value, Q.chk[1], `${label}: independent solution vs answer`);
      const correct = Q.choices.find(c => c.ok);
      if (typeof correct.value === 'number') close(correct.value, sol.value, `${label}: choice vs solution`);
      for (const text of [Q.stem || Q.html, ...sc.steps(s), ...Q.choices.map(c => c.h || `$${c.t}$`)]) checkMath(text, label);
      checked++;
    }
    const expectedKinds = { 'c1-2': 2, 'c1-5': 4, 'c2-2': 5, 'c2-7': 4, 'c4-5': 6 }[sc.id] || 3;
    assert.equal(kinds.size, expectedKinds, `${sc.id}: all generated variant families`);
  }
  assert.equal(checked, 5400);
});

test('all question variants draw through all five solution stages with finite geometry; first stage preserves the problem', () => {
  for (const sc of scenes) {
    const s = state(sc);
    for (let variant = 0; variant < 6; variant++) {
      s.ciPk = sc.ci.gen(G.seeded(`drawing|${sc.id}|${variant}`), variant);
      const key = JSON.stringify(s.ciPk), problemBoard = board();
      try {
        sc.draw(problemBoard, s, {}, { tab: 'problem' });
        const problemText = problemBoard.items.filter(x => x.type === 'text').map(x => x.str);
        for (let step = 1; step <= 5; step++) {
          s.step = step;
          const b = board();
          sc.draw(b, s, {}, { tab: 'review' });
          assert.equal(JSON.stringify(s.ciPk), key, `${sc.id}: solving mutated the question`);
          if (step === 1) assert.deepEqual(b.items.filter(x => x.type === 'text').map(x => x.str), problemText, `${sc.id}: first step diverges from problem`);
          for (const label of b.ciLabels) assert.ok(label.l >= 0 && label.r <= b.W + 1 && label.t >= 0 && label.b <= b.H + 1, `${sc.id}: clipped label ${label.text}`);
        }
      } catch (e) { e.message = `${sc.id}/${s.ciPk.key}: ${e.message}`; throw e; }
    }
  }
});

test('exploration remains independent; initial and slider endpoints render without corrupting questions', () => {
  for (const sc of scenes) {
    const s = state(sc), key = JSON.stringify(s.ciPk), cases = [Object.assign({}, s)];
    for (const id of sc.controls(s) || []) for (const end of ['min', 'max']) cases.push({ ...s, [id]: defaults[id][end] });
    for (const c of cases) {
      try { sc.draw(board(), c, {}, { tab: 'explore' }); const view = sc.view(c, { tab: 'explore' }); assert.doesNotMatch(JSON.stringify(view), /NaN|undefined/); }
      catch (e) { e.message = `${sc.id}: ${e.message}`; throw e; }
      assert.equal(JSON.stringify(c.ciPk), key, `${sc.id}: exploration mutated question`);
    }
  }
});

test('c4-1 center position and presets agree with geometric angle containment', () => {
  const sc = scenes.find(sc => sc.id === 'c4-1'), s = state(sc), EX = { tab: 'explore', problem: false };
  for (const th of [40, 60, 100, 120]) for (const preset of sc.presets(s)) {
    s.c4t = th; preset.apply(s);
    const g = sc.ci.model(s, EX).g;
    const total = G.angBetween(g.P, g.A, g.B), parts = G.angBetween(g.P, g.A, { x: 0, y: 0 }) + G.angBetween(g.P, { x: 0, y: 0 }, g.B);
    assert.equal(preset.on(s), true);
    if (g.cs === 'in' || g.cs === 'side') close(total, parts, 'O lies inside/on the inscribed angle');
    else assert.ok(parts > total + 1e-5, 'O lies outside the inscribed angle');
  }
});

test('answer leaks and unrelated unknowns stay absent in repaired question variants', () => {
  for (const [id, q, forbidden, required] of [
    ['c1-5', { kind: 3, R: 8, k: 4, key: 'angle-only' }, 'AB=x', 'x'],
    ['c2-6', { kind: 2, R: 9, r: 3, pbFull: 15, key: 'no-derived-PA' }, 'PA=5', 'x'],
    ['c3-3', { kind: 2, a: 13, b: 14, c: 15, r: 4, key: 'unknown-radius' }, '4', 'x'],
    ['c3-6', { kind: 2, a: 4, b: 9, ab: 12, key: 'unknown-AD' }, '4', 'x']
  ]) {
    const sc = scenes.find(sc => sc.id === id), s = state(sc); s.ciPk = q;
    const b = board(); sc.draw(b, s, {}, { tab: 'problem' });
    const texts = b.items.filter(x => x.type === 'text').map(x => x.str);
    assert.ok(!texts.includes(forbidden), `${id}: leaked ${forbidden}`);
    assert.ok(texts.includes(required), `${id}: missing ${required}`);
  }
});
