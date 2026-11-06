import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const labRoot = process.env.TRIANGLES_LAB_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/g8-triangles');
let seed = 93841;
const math = Object.create(Math);
math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const listeners = {};
const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener(name, callback) { listeners[name] = callback; } };
const context = vm.createContext({ window: {}, document, Math: math });
for (const file of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7']) vm.runInContext(fs.readFileSync(path.join(labRoot, file + '.js'), 'utf8'), context, { filename: file });
const G = context.window.APL_TR, groups = context.window.APL_TR_GROUPS;
const scenes = groups.flatMap(g => g.scenes), params = Object.assign({}, ...groups.map(g => g.params));
const state = sc => { const s = Object.fromEntries(Object.entries(params).map(([k, p]) => [k, p.value])); sc.enter(s); return s; };
const get = id => scenes.find(sc => sc.id === id);
const close = (actual, expected, message) => assert.ok(Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) < 1e-6 * Math.max(1, Math.abs(expected)), `${message}: ${actual} != ${expected}`);
const katex = createRequire(import.meta.url)(path.resolve(labRoot, '../../kit/vendor/katex/katex.min.js'));
function checkMath(text, label) {
  assert.doesNotMatch(text, /NaN|undefined|Infinity|√|\\sqrt/, label);
  assert.equal((text.match(/\$/g) || []).length % 2, 0, label + ': paired math delimiters');
  for (const [, tex] of text.matchAll(/\$([^$]+)\$/g)) katex.renderToString(tex, { throwOnError: true, strict: 'ignore' });
  assert.doesNotMatch(text.replace(/\$[^$]*\$/g, ''), /\\[A-Za-z]+/, label + ': no TeX commands outside math delimiters');
}
function board(W = 390, H = 440, insets = {}) {
  const items = [], b = { W, H, fs: 1, pad: .02, insets: { top: 0, bottom: 0, left: 0, right: 0, ...insets }, focus: { x: [-6, 6], y: [-6, 6] }, items, _P: p => p };
  const area = () => ({ W: W - b.insets.left - b.insets.right, H: H - b.insets.top - b.insets.bottom });
  Object.defineProperty(b, 'k', { get() { const a = area(); return Math.min((a.W - .04 * Math.min(a.W, a.H)) / (this.focus.x[1] - this.focus.x[0]), (a.H - .04 * Math.min(a.W, a.H)) / (this.focus.y[1] - this.focus.y[0])); } });
  const point = p => assert.ok(p && Number.isFinite(p.x) && Number.isFinite(p.y), `invalid point ${JSON.stringify(p)}`);
  b.toS = p => { point(p); const a = area(); return { x: b.insets.left + a.W / 2 + (p.x - (b.focus.x[0] + b.focus.x[1]) / 2) * b.k, y: b.insets.top + a.H / 2 + (p.y - (b.focus.y[0] + b.focus.y[1]) / 2) * b.k }; };
  b.toW = (x, y) => { const a = area(); return { x: (x - b.insets.left - a.W / 2) / b.k + (b.focus.x[0] + b.focus.x[1]) / 2, y: (y - b.insets.top - a.H / 2) / b.k + (b.focus.y[0] + b.focus.y[1]) / 2 }; };
  b.path = (points, options = {}) => { points.forEach(point); items.push({ type: 'path', points, options }); return b; };
  b.circle = (p, r, options) => { point(p); assert.ok(Number.isFinite(r) && r >= 0); items.push({ type: 'circle', p, r, options }); return b; };
  b.arc = (p, r, a, z, options) => { point(p); assert.ok([r, a, z].every(Number.isFinite)); items.push({ type: 'arc', p, r, a, z, options }); return b; };
  for (const method of ['right', 'ticks']) b[method] = (...args) => { args.slice(0, method === 'right' ? 3 : 2).forEach(point); items.push({ type: method, args }); return b; };
  for (const method of ['point', 'handle']) b[method] = (...args) => { point(args[method === 'point' ? 0 : 1]); items.push({ type: method, args }); return b; };
  b.text = (p, str, options = {}) => { point(p); assert.doesNotMatch(String(str), /NaN|undefined|Infinity/); items.push({ type: 'text', p, str, options }); return b; };
  return b;
}

test('P0: t4-4 area givens describe an attainable triangle and match the actual solution drawing', () => {
  const sc = get('t4-4'), s = state(sc);
  Object.assign(s, { trBc: 5, trBb: 4, trK: 4 });
  const M = sc.tr.model(s), g = M.questionGeo || M.geo;
  const areaABD = Math.abs(G.polyArea([g.A, g.B, g.D])), areaACD = Math.abs(G.polyArea([g.A, g.C, g.D]));
  assert.ok(M.k * (M.c + M.b) <= M.c * M.b / 2 + 1e-9, 'the total given/implied area cannot exceed AB×AC÷2');
  close(areaABD, M.k * M.c, 'the area printed on ABD is its geometric area');
  close(areaACD, M.k * M.b, 'the requested ACD area is its geometric area');
  close(G.dist(g.A, g.B), M.c, 'AB keeps its stated length');
  close(G.dist(g.A, g.C), M.b, 'AC keeps its stated length');
  close(G.angBetween(g.A, g.B, g.D), G.angBetween(g.A, g.C, g.D), 'AD really bisects A');
});

test('P0: t4-4 generates physically valid integer areas for every supported pair of side lengths', () => {
  const sc = get('t4-4'), s = state(sc);
  for (let c = 4; c <= 12; c++) for (let b = 4; b <= 12; b++) for (const inputK of [1, 4, 9]) {
    Object.assign(s, { trBc: c, trBb: b, trK: inputK });
    const M = sc.tr.model(s), g = M.questionGeo || M.geo;
    close(Math.abs(G.polyArea([g.A, g.B, g.D])), M.k * c, `AB=${c}, AC=${b}, inputK=${inputK}`);
    close(Math.abs(G.polyArea([g.A, g.C, g.D])), M.k * b, `ACD AB=${c}, AC=${b}, inputK=${inputK}`);
    assert.ok(Number.isInteger(M.k * c) && Number.isInteger(M.k * b));
  }
});

test('insufficient right-triangle conditions are not presented as proof that congruence is impossible', () => {
  const sc = get('t3-3'), s = state(sc);
  for (let i = 1; i < 24; i += 2) {
    s.trQi = i;
    const Q = sc.tr.prob(sc.tr.model(s), s);
    assert.match(Q.ansHTML, /할 수 없|보장/);
    const answer = sc.tr.solve.steps(sc.tr.model(s), s).find(st => st.k === 'ans');
    assert.match(answer.t, /할 수 없|보장/);
    assert.ok(!/① \$\$/.test(sc.problem.answer(s)), 'the public answer is the textual answer, not empty math');
  }
});

test('a hypotenuse-only counterexample must have a genuinely different side-length set', () => {
  const sc = get('t3-3'), s = state(sc);
  for (let i = 1; i < 40; i += 2) {
    s.trQi = i; const M = sc.tr.model(s), Q = sc.tr.prob(M, s);
    if (!Q.ansHTML.includes('빗변만')) continue;
    const ST = sc.tr.solve.steps(M, s), b = board();
    s.step = ST.findIndex(st => st.id === 'cong') + 1; sc.draw(b, s, {}, { tab: 'review' });
    const alt = b.items.find(x => x.type === 'path' && x.options.dash?.join(',') === '8,6' && x.points.length === 3);
    assert.ok(alt, 'counterexample triangle is drawn');
    const sides = alt.points.map((p, k) => G.dist(p, alt.points[(k + 1) % 3])).sort((a, z) => a - z);
    close(sides[2], 5, 'the given hypotenuse remains equal');
    assert.ok(Math.abs(sides[0] - 3) > .1 || Math.abs(sides[1] - 4) > .1, 'swapping 3 and 4 only rotates the same triangle');
    return;
  }
  assert.fail('no hypotenuse-only case generated');
});

test('all 43 scenes retain their current-question solve paths, geometric conditions, variants and valid math', t => {
  assert.equal(scenes.length, 43);
  let generated = 0;
  for (const sc of scenes) {
    const s = state(sc), D = sc.tr;
    assert.ok(D.solve?.steps && D.solve?.draw, sc.id + ': actual problem drawing preserved');
    for (let i = 0; i < 120; i++) {
      if (i) D.reroll(s);
      const M = D.model(s), Q = D.prob(M, s), ST = D.solve.steps(M, s);
      assert.equal(Q.choices.filter(c => c.ok).length, 1, sc.id);
      // t3-3 already uses a written answer rather than choices; all other existing
      // numeric and statement scenes retain their five-item answer model.
      assert.equal(Q.choices.length, sc.id === 't3-3' ? 1 : 5, sc.id);
      assert.ok(ST.some(st => st.k === 'given') && ST.some(st => st.k === 'idea') && ST.some(st => st.k === 'ans'), sc.id);
      for (const text of [Q.stem || Q.html, ...sc.steps(s), ...Q.choices.map(c => c.h || `$${c.t}$`)]) checkMath(text, sc.id);
      const v = D.verify(s);
      for (const [a, b] of [[v.ans, v.model], ...(v.extra || [])]) close(a, b, sc.id + ': geometric condition');
      generated++;
    }
  }
  t.diagnostic(`${generated} generated questions; 120 for every existing scene`);
});

test('current problems render through every existing solution step, and numerical refresh clears previous results', () => {
  for (const sc of scenes) {
    const s = state(sc), D = sc.tr;
    for (let variant = 0; variant < 6; variant++) {
      if (variant) D.reroll(s);
      const before = sc.problem.text(s), ST = sc.steps(s);
      sc.draw(board(), s, {}, { tab: 'problem' });
      for (let i = 1; i <= ST.length; i++) {
        s.step = i; sc.draw(board(), s, {}, { tab: 'review' });
        assert.equal(sc.problem.text(s), before, sc.id + ': changing the step must not change the problem');
      }
    }
    const lab = { scene: sc, s, setStep(n) { s.step = n; }, invalidate() {}, _buildReview() {} };
    sc.view(s, lab); s.trShow = 'old-result'; s.trPick = { idx: 1 }; s.revealed = true;
    listeners.click({ target: { closest() { return { hasAttribute(k) { return k === 'data-tr-new'; } }; } } });
    assert.equal(s.trShow, null, sc.id); assert.equal(s.trPick, null, sc.id); assert.equal(s.revealed, false, sc.id); assert.equal(s.step, 1, sc.id);
  }
});

test('known mobile angle, length and center labels stay separated at the same fixed conditions', () => {
  const cases = [
    { id: 't2-2', tab: 'review', step: 4, params: { trEx: 32, trV: 0 }, labels: ['64°', '64°'] },
    { id: 't3-5', tab: 'problem', step: 1, params: { trLm: 7, trLn: 2, trV: 1 }, labels: ['x', 'ℓ'] },
    { id: 't5-1', tab: 'review', step: 6, params: { trOa: 50, trOb: 57, trOr: 5, trV: 2 }, labels: ['146°', 'F'] },
    { id: 't6-7', tab: 'review', step: 4, params: { trNm: 7, trNn: 8, trNo: 9, trV: 0 }, labels: ['120°', 'I'] },
    { id: 't7-5', tab: 'review', step: 4, params: { trMs: 60, trMt: 70, trM: 6, trX: [6, 7, 5], trV: 1 }, labels: ['q+r=12', 'D'] }
  ];
  for (const c of cases) {
    const sc = get(c.id), s = Object.assign(state(sc), c.params, { step: c.step }), b = board();
    sc.draw(b, s, {}, { tab: c.tab });
    const selected = c.labels.map((label, i) => {
      const seen = c.labels.slice(0, i).filter(x => x === label).length;
      const item = b.items.filter(x => x.type === 'text' && x.str === label)[seen];
      assert.ok(item, c.id + ': expected label ' + label);
      const p = b.toS(item.p), size = item.options.size || 16;
      const x = p.x + (item.options.dx || 0), y = p.y + (item.options.dy || 0);
      const width = G.textW(label, size), height = size * 1.12;
      return { l: x - width / 2, r: x + width / 2, t: y - height / 2, b: y + height / 2 };
    });
    const [a, z] = selected;
    assert.ok(a.r <= z.l || z.r <= a.l || a.b <= z.t || z.b <= a.t, `${c.id}: ${c.labels.join(' and ')} overlap`);
  }
});

test('right-triangle congruence and bisector diagrams give equal-length ticks only to equal segments', t => {
  let frames = 0, marks = 0;
  for (const sc of scenes.filter(sc => /^t[34]-/.test(sc.id))) {
    const s = state(sc);
    for (let variant = 0; variant < 30; variant++) {
      if (variant) sc.tr.reroll(s);
      for (let step = 0; step <= sc.steps(s).length; step++) {
        s.step = step; const b = board();
        sc.draw(b, s, {}, { tab: step ? 'review' : 'problem' });
        const groups = new Map();
        for (const item of b.items.filter(x => x.type === 'ticks')) {
          const [p, q, options] = item.args, key = `${options.count}:${options.color}`;
          const length = G.dist(p, q);
          if (groups.has(key)) close(length, groups.get(key), `${sc.id}, variant ${variant}, step ${step}: ${key} ticks identify equal lengths`);
          else groups.set(key, length);
          marks++;
        }
        frames++;
      }
    }
  }
  t.diagnostic(`${frames} problem/stage frames and ${marks} geometric equal-length marks`);
});

test('the circumcenter angle problem uses the available short canvas and keeps each given angle beside its vertex', () => {
  const sc = get('t5-4');
  for (const [W, H] of [[390, 310], [820, 380]]) {
    const s = Object.assign(state(sc), { trOa: 60, trOb: 65, trV: 0 });
    for (const tab of ['problem', 'review']) {
      s.step = sc.steps(s).length;
      const b = board(W, tab === 'review' ? H + 100 : H, { bottom: 58 });
      sc.draw(b, s, {}, { tab });
      const circle = b.items.find(item => item.type === 'circle' && item.r === 1);
      assert.ok(circle, 'the circumcircle remains visible');
      assert.ok(2 * circle.r * b.k >= 180, `${W} ${tab}: circumcircle diameter ${2 * circle.r * b.k} px is too small for the three given/unknown angles`);
      const M = sc.tr.model(s);
      for (const [label, vertex, other] of [['30°', 'B', 'C'], ['25°', 'C', 'A']]) {
        const item = b.items.find(item => item.type === 'text' && item.str === label);
        assert.ok(item, `${tab}: current angle ${label} is drawn`);
        const anchor = b.toS(item.p), center = { x: anchor.x + (item.options.dx || 0), y: anchor.y + (item.options.dy || 0) };
        const vertexDistance = G.dist(center, b.toS(M.g[vertex]));
        assert.ok(vertexDistance < G.dist(center, b.toS(M.g[other])), `${W} ${tab}: ${label} must belong visually to vertex ${vertex}, not ${other}`);
        assert.ok(vertexDistance <= .7 * b.k, `${W} ${tab}: ${label} cannot travel across the circumradius to another vertex`);
      }
    }
  }
});

test('kite folding guidance does not cover the lower vertex on mobile and remains available in the guide', () => {
  const sc = get('t3-6');
  for (const H of [310, 410, 440]) for (const trKa of [20, 40, 70]) for (const trKt of [0, .5, 1]) {
    const s = Object.assign(state(sc), { trKa, trKt });
    const b = board(390, H, { bottom: 58 }); sc.draw(b, s, {}, { tab: 'explore' });
    const d = b.items.find(item => item.type === 'text' && item.str === 'D');
    assert.ok(d, 'the original lower vertex name is retained during the fold');
    const vertex = b.toS(d.p), dBox = b.trLabels.find(item => item.text === 'D');
    for (const label of b.trLabels.filter(item => /접으면|이등분돼요/.test(item.text))) {
      assert.ok(label.t > vertex.y + 24 && label.t > dBox.b + 6, `${H}px, ${trKa}°, fold ${trKt}: guidance overlaps the lower vertex or its name`);
    }
    const guide = sc.view(s, { tab: 'explore' }).guide;
    assert.match(guide, /CB=CD/, 'the equal-side conclusion remains in the visible guide');
    assert.match(guide, /RHS/);
    assert.match(guide, /이등분/);
  }
});
