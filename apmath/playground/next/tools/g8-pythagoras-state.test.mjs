import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const labDir = process.env.G8_PYTHAGORAS_LAB_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/g8-pythagoras');
const katex = createRequire(import.meta.url)('../kit/vendor/katex/katex.min.js');
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

// Records the real scene's drawing commands without claiming to rasterize a
// browser screenshot. Used only for numerical, stage and interaction contracts.
function commandBoard(width = 390, height = 440) {
  const labels = [], handles = [], paths = [];
  let focus = { x: [-10, 10], y: [-10, 10] };
  const point = p => { assert.ok(p && Number.isFinite(p.x) && Number.isFinite(p.y), `finite point: ${JSON.stringify(p)}`); };
  const b = {
    W: width, H: height, pad: .02, insets: { top: 0, bottom: 0, left: 0, right: 0 }, thumb: false,
    ctx: new Proxy({}, { get: () => () => {} }),
    get focus() { return focus; },
    set focus(v) { assert.ok([...v.x, ...v.y].every(Number.isFinite)); focus = v; },
    get k() { return Math.min(width / (focus.x[1] - focus.x[0]), height / (focus.y[1] - focus.y[0])); },
    toS(p) { point(p); return { x: width / 2 + (p.x - (focus.x[0] + focus.x[1]) / 2) * this.k, y: height / 2 + (p.y - (focus.y[0] + focus.y[1]) / 2) * this.k }; },
    path(points, options) { points.forEach(point); paths.push({ points, options }); },
    text(p, text, options) { point(p); assert.doesNotMatch(String(text), /NaN|undefined|Infinity|√|\\sqrt/); labels.push({ text: String(text), p, options }); },
    point(p) { point(p); },
    right(p, a, c) { [p, a, c].forEach(point); },
    ticks(p, q) { [p, q].forEach(point); },
    circle(p, r) { point(p); assert.ok(Number.isFinite(r) && r >= 0); },
    arc(p, r, a, c) { point(p); assert.ok([r, a, c].every(Number.isFinite)); },
    handle(id, p, options) { point(p); handles.push({ id, p, options }); }
  };
  return { b, labels, handles, paths };
}
function drawing(sc, s, tab, step = 1, width = 390) {
  s.step = step;
  const record = commandBoard(width);
  sc.draw(record.b, s, {}, { tab });
  return { ...record, text: record.labels.map(x => x.text).join('\n') };
}

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

test('current-question givens remain visible while unknown dimensions stay unrevealed in step 1', () => {
  const cases = [
    ['py1-sq', { pyA:6, pyB:8 }, /a=6/, /(?:c|x)=10|c²=100/],
    ['py1-leg', { pyH:13, pyL:5, pyK:0 }, /c=13/, /b=(?:x=)?12|b²=144/],
    ['py1-rot', { pyWa:5, pyWb:12, pyRot:145, pyK:1 }, /13/, /^5$/m],
    ['py1-grid', { pyU:3, pyV:5 }, /3/, /S=34/],
    ['py1-perim', { pyWa:5, pyWb:12, pyK:1 }, /13/, /^12$|넓이.*30/m],
    ['py2-euclid', { pyP:1, pyG:0 }, /10/, /b²=64|^64$/m],
    ['py2-bhas1', { pyBa:3, pyBb:4 }, /3/, /c²=25/],
    ['py2-bhas2', { pyBa:3, pyBb:4 }, /3/, /^1$/m],
    ['py3-345', { pyF:0, pyK:2, pyAsk:'a' }, /8/, /a=6|^6$/m],
    ['py5-tree', { pyTa:6, pyTb:8, pyT1:40, pyT2:55, pyShade:'ab' }, /6/, /AB²=36/],
    ['py5-sqarea', { pyS1:20, pyS2:15, pyUnk:'b' }, /35/, /^15$/m],
    ['py5-hippo', { pyIa:6, pyIb:8, pyKind:1 }, /10/, /^8$|△ABC=24/m],
    ['py6-iso', { pyIb:10, pyIl:13, pyKind:1 }, /넓이 60/, /^13$/m],
    ['py6-trap', { pyTu:6, pyTh:12, pyTd1:5, pyTd2:9, pyKind:0 }, /13/, /^12$|x=12/m],
    ['py6-rect', { pyWw:6, pyWh:8, pyKind:1 }, /8/, /PQ=/],
    ['py7-rect', { pyFi:6, pyFp:1, pyKind:0 }, /15/, /x=|y=/],
    ['py7-tri', { pyGa:8, pyGb:6, pyFp:1, pyKind:2 }, /8/, /x=|AB=10/],
    ['py8-rectP', { pyRW:8, pyRH:6, pyPx:3, pyPy:2, pyKind:1 }, /PA²=13/, /PD=|x²=/],
    ['py8-cross', { pyXp:8, pyXq:6, pyXm:3, pyXn:4, pyKind:0 }, /10/, /BE²=|CD²=|125/]
  ];
  for (const [id, q, given, hidden] of cases) {
    const { sc, s } = setup(id, q), record = drawing(sc, s, 'review', 1);
    assert.match(record.text, given, id + ': retains givens');
    assert.doesNotMatch(record.text, hidden, id + ': no premature dimension/answer');
    assert.equal(record.handles.length, 0, id + ': question geometry is fixed during review');
    const v = sc.view(s, { tab: 'review' });
    assert.equal(v.formula, undefined, id + ': complete exploration equation is not exposed');
  }
});

test('reversed perpendicular feet use a nonnegative position difference in solution, exploration and feedback', () => {
  const { sc, s, text } = setup('py6-rect', { pyWw:6, pyWh:8, pyKind:1 });
  Object.assign(s, s.pyQ);
  const M = sc.py.model(s), q = sc.py.prob(M), view = sc.view(s, { tab:'explore' });
  assert.ok(Math.abs(M.PQ - 14/5) < 1e-12);
  assert.match(text(), /\|\\frac\{32\}\{5\}-\\frac\{18\}\{5\}\|=\\frac\{14\}\{5\}/);
  assert.match(view.formula, /PQ=\|BD-2BP\|/);
  assert.match(view.rule, /\|BD − 2BP\|/);
  assert.match(q.choices.find(c => c.ok).t, /\\frac\{14\}\{5\}/);
  assert.doesNotMatch(q.choices.map(c => c.hint).join(' '), /PQ는 BD에서|DQ도 빼요/);
});

test('non-square box routes keep squared lengths even when another route has an integer minimum', () => {
  const { sc, s } = setup('py7-box', { pyXa:1, pyXb:2, pyXc:4, pyRoute:-1 });
  Object.assign(s, { pyXa:1, pyXb:2, pyXc:4, pyRoute:0 });
  const r = drawing(sc, s, 'explore');
  assert.match(r.text, /x²=37/);
  assert.doesNotMatch(r.text, /x=6/);
});

test('fold playback pauses and resets, and reflection presets use the exact optimum', () => {
  for (const id of ['py7-rect', 'py7-tri']) {
    const sc = byId(id), s = U.state(sc), before = JSON.stringify(s.pyQ);
    const [play, reset] = sc.actions(s);
    play.run(s); assert.equal(s.playing, true);
    sc.tick(s, .5, { tab:'explore' }); assert.ok(s.pyFp > 0 && s.pyFp < 1);
    play.run(s); assert.equal(s.playing, false);
    const p = s.pyFp; sc.tick(s, .5, { tab:'explore' }); assert.equal(s.pyFp, p);
    reset.run(s); assert.equal(s.pyFp, 0);
    assert.equal(JSON.stringify(s.pyQ), before, id + ': playback preserves question');
  }
  const sc = byId('py7-refl'), s = U.state(sc);
  Object.assign(s, { pyLd:15, pyLp:5, pyLq:3, pyLt:9.4 });
  assert.equal(sc.py.model(s).onBest, false, '9.4 is close to 9.375 but not exactly equal');
  sc.presets(s)[0].apply(s);
  assert.equal(s.pyLt, 9.375);
  assert.equal(sc.py.model(s).onBest, true);
});

test('fold solutions place x on the requested segment in all six question variants', () => {
  const cases = [
    ['py7-rect', { pyFi:0, pyFp:1, pyKind:0 }, 'x=\\frac{4}{3}', [5,7/3], /FC=x=DC-y/],
    ['py7-rect', { pyFi:0, pyFp:1, pyKind:1 }, 'x=\\frac{5}{3}', [4.5,7/3], /FE=x/],
    ['py7-rect', { pyFi:0, pyFp:1, pyKind:2 }, 'x=4', [2,3], /BE=x/],
    ['py7-tri', { pyGa:8, pyGb:6, pyFp:1, pyKind:0 }, 'x=\\frac{7}{4}', [7/8,0], /CE=x/],
    ['py7-tri', { pyGa:8, pyGb:6, pyFp:1, pyKind:1 }, 'x=\\frac{25}{4}', [7/8,-3], /빗변은 \$AE\$/],
    ['py7-tri', { pyGa:8, pyGb:6, pyFp:1, pyKind:2 }, 'x=\\frac{15}{4}', [23/8,-1.5], /DE=x/]
  ];
  for (const [id, q, expected, point, note] of cases) {
    const { sc, s } = setup(id,q);
    for (const [tab, step, label] of [['problem',0,'x'],['review',1,'x'],['review',5,expected]]) {
      const r = drawing(sc,s,tab,step), target = r.labels.find(x => x.text === label);
      assert.ok(target, `${id}/${q.pyKind}: ${label} present in ${tab}/${step}`);
      assert.ok(Math.abs(target.p.x-point[0]) < 1e-9 && Math.abs(target.p.y-point[1]) < 1e-9, `${id}/${q.pyKind}: target remains on requested segment`);
      assert.equal(r.labels.filter(x => /^x(?:=|$)/.test(x.text)).length,1, 'only the requested segment is called x');
    }
    const v=sc.view(s,{tab:'review'});
    assert.match(v.notes,note,id + ': final notes match requested target');
    if(id === 'py7-rect' && q.pyKind === 2) assert.doesNotMatch(v.notes,/FEC|FE=FD/);
  }
});

test('all 37 scenes produce finite drawing commands and valid math across question/review/exploration controls', t => {
  let frames = 0, equations = 0;
  for (const sc of U.scenes) {
    const s = U.state(sc);
    for (const tab of ['problem','review','explore']) {
      for (const width of [390,1440]) {
        const steps = tab === 'review' ? Array.from({ length:sc.steps(s).length }, (_, i) => i+1) : [0];
        for (const step of steps) {
          const r = drawing(sc, s, tab, step, width);
          assert.ok(r.paths.length > 0, sc.id + ': has geometric paths');
          if (tab !== 'explore') assert.equal(r.handles.length, 0, sc.id + ': fixed question model');
          frames++;
        }
      }
    }
    for (const end of ['min','max']) {
      for (const key of sc.controls(s)) if (U.params[key]) s[key] = U.params[key][end];
      drawing(sc, s, 'explore'); frames++;
    }
    for (let i=0;i<40;i++) {
      s.pyQ=sc.py.gen(s,s.pyQ);
      const sq=U.G.qState(s), M=sc.py.model(sq), q=sc.py.prob(M,sq);
      const strings=[q.stem||q.html,...q.choices.flatMap(c=>[c.t||c.h,c.hint]),...sc.steps(s)];
      for(const string of strings) for(const [,tex] of String(string||'').matchAll(/\$([^$]+)\$/g)) {
        assert.doesNotThrow(()=>katex.renderToString(tex,{throwOnError:true,strict:'ignore'}),sc.id+': '+tex); equations++;
      }
      for(const c of q.choices) if(c.t) { assert.doesNotThrow(()=>katex.renderToString(c.t,{throwOnError:true,strict:'ignore'})); equations++; }
    }
  }
  t.diagnostic(`${frames} command-level frames across 37 scenes; ${equations} KaTeX expressions. Browser raster/visual review is separate.`);
});
