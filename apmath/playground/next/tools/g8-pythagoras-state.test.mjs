import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const labDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/g8-pythagoras');
function loadUnit() {
  const listeners = {};
  const document = {
    documentElement: { dataset: {} }, head: { append() {} },
    getElementById() { return null; }, createElement() { return {}; },
    addEventListener(name, callback) { listeners[name] = callback; }
  };
  const ctx = vm.createContext({ window: {}, document });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']) {
    vm.runInContext(fs.readFileSync(path.join(labDir, name + '.js'), 'utf8'), ctx, { filename: name + '.js' });
  }
  const groups = ctx.window.APL_PY_GROUPS;
  const params = Object.assign({}, ...groups.map(g => g.params));
  const scenes = groups.flatMap(g => g.scenes);
  const lab = { tab: 'review', _buildProblem() {}, _buildReview() {}, invalidate() {}, setStep(n) { this.s.step = n; } };
  const state = sc => {
    const s = Object.fromEntries(Object.entries(params).map(([key, p]) => [key, p.value]));
    sc.enter(s, lab); s.step = 0; s.revealed = false;
    return s;
  };
  return { G: ctx.window.APL_PY, scenes, params, lab, state, listeners };
}
const U = loadUnit();
const byId = id => U.scenes.find(sc => sc.id === id);
const setup = (id, q) => {
  const sc = byId(id), s = U.state(sc);
  s.pyQ = q;
  return { sc, s, text: () => sc.steps(s).join('\n') };
};

test('P0: the 6–8 problem keeps those givens in every solution stage on first entry', () => {
  const { sc, s, text } = setup('py1-sq', { pyA: 6, pyB: 8 });
  assert.match(sc.problem.text(s), /a=6/);
  assert.match(text(), /a=6/);
  assert.match(text(), /b=8/);
  assert.match(text(), /36\+64=100/);
  assert.match(text(), /(?:c|x)=10/);
  assert.equal(s.pyA, 3, 'reading a solution does not overwrite the exploration');
  assert.equal(s.pyB, 4);
});

test('P0: rotated triangles subtract for an unknown leg instead of solving an already given hypotenuse', () => {
  const { sc, s, text } = setup('py1-rot', { pyWa: 5, pyWb: 12, pyRot: 145, pyK: 1 });
  assert.match(sc.problem.text(s), /\$13\$/);
  assert.match(text(), /13\^2-12\^2=169-144=25/);
  assert.match(text(), /x=5/);
  assert.doesNotMatch(sc.steps(s)[0], /x=5/);
});

test('P0: the tilted-square solution uses the current grid, not its exploration defaults', () => {
  const { text } = setup('py1-grid', { pyU: 3, pyV: 5 });
  assert.match(text(), /3\+5=8/);
  assert.match(text(), /64-30=34/);
});

test('P0: an area question derives the missing leg before multiplying base and height', () => {
  const { sc, s, text } = setup('py1-perim', { pyWa: 5, pyWb: 12, pyK: 1 });
  assert.match(sc.problem.text(s), /넓이는/);
  assert.match(text(), /13\^2-5\^2=169-25=144/);
  assert.match(text(), /30/);
  assert.doesNotMatch(text(), /둘레.*=30/);
});

test('problem and solution stay unchanged when students explore other lengths, angles or presets', t => {
  let checked = 0;
  for (const sc of U.scenes) {
    const s = U.state(sc);
    const before = { problem: sc.problem.text(s), answer: sc.problem.answer(s), steps: JSON.stringify(sc.steps(s)) };
    for (const key of sc.controls(s)) {
      const p = U.params[key];
      if (p && !key.endsWith('Fp')) s[key] = s[key] === p.max ? p.min : p.max;
    }
    for (const preset of sc.presets(s)) preset.apply(s, U.lab);
    assert.equal(sc.problem.text(s), before.problem, sc.id + ': prompt');
    assert.equal(sc.problem.answer(s), before.answer, sc.id + ': answer');
    assert.equal(JSON.stringify(sc.steps(s)), before.steps, sc.id + ': worked solution');
    checked++;
  }
  t.diagnostic(`${checked} scenes preserve their current question independently of exploration`);
});

test('problem and review drawings receive the same current numerical model', () => {
  for (const sc of U.scenes) {
    const s = U.state(sc), D = sc.py, original = D.draw, models = [];
    D.draw = (_b, _s, m) => models.push(JSON.stringify(m));
    try {
      sc.draw({ thumb: false }, s, {}, { tab: 'problem' });
      sc.draw({ thumb: false }, s, {}, { tab: 'review' });
      assert.equal(models[1], models[0], sc.id);
    } finally { D.draw = original; }
  }
});

test('changing the question clears previous answers and completed solution steps', () => {
  for (const sc of U.scenes) {
    const s = U.state(sc);
    Object.assign(U.lab, { s, scene: sc });
    s.step = sc.steps(s).length; s.revealed = true;
    s.pyPick = { key: 'previous-answer', idx: 0 };
    const previous = JSON.stringify(s.pyQ);
    U.listeners.click({ target: { closest: () => ({ hasAttribute: k => k === 'data-py-new' }) } });
    assert.notEqual(JSON.stringify(s.pyQ), previous, sc.id + ': changed conditions');
    assert.equal(s.pyPick, null, sc.id + ': old feedback removed');
    assert.equal(s.revealed, false, sc.id + ': answer locked');
    assert.ok(s.step < sc.steps(s).length, sc.id + ': previous solution no longer complete');
  }
});

test('generated questions have five distinct choices and exactly one finite answer', t => {
  let checked = 0;
  for (const sc of U.scenes) {
    const s = U.state(sc), D = sc.py;
    for (let i = 0; i < 40; i++) {
      s.pyQ = D.gen(s, s.pyQ);
      const sq = U.G.qState(s), q = D.prob(D.model(sq), sq);
      assert.equal(q.choices.length, 5, sc.id);
      assert.equal(q.choices.filter(c => c.ok).length, 1, sc.id);
      assert.equal(new Set(q.choices.map(c => c.h ?? c.t)).size, 5, sc.id);
      const rendered = [q.stem || q.html, ...q.choices.map(c => c.h ?? c.t), ...sc.steps(s)].join('\n');
      assert.doesNotMatch(rendered, /NaN|undefined|Infinity|\[object Object\]|√|\\sqrt/, sc.id);
      for (const text of [q.stem || q.html, ...sc.steps(s)]) assert.equal((text.match(/\$/g) || []).length % 2, 0, sc.id + ': paired math delimiters');
      checked++;
    }
  }
  t.diagnostic(`${checked} generated problems checked (40 per existing scene)`);
});
