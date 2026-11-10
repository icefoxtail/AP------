// Real Board projection checks for the observed 360/390px initial regressions.
// Native Chromium screenshots remain the independent readability gate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g7-polygons';
const arg = process.argv.indexOf('--baseline'), before = arg < 0 ? null : process.argv[arg + 1];
function load(ref) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  for (const name of ['core', 't1', 't2', 't3', 't4']) {
    const file = `${unit}/${name}.js`;
    const source = ref ? execFileSync('git', ['show', `${ref}:${file}`], { cwd: repo, encoding: 'utf8' }) : fs.readFileSync(path.join(repo, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(repo, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const G = context.window.APL_PG, scenes = context.window.APL_PG_GROUPS.flatMap(g => g.scenes);
  const scene = id => scenes.find(s => s.id === id);
  const fresh = id => { const s = { step: 1, revealed: false }; scene(id).enter(s); return s; };
  return { context, G, scenes, scene, fresh };
}
const runtime = load(before), { scene, fresh } = runtime;
const overlap = (a, b) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > 1 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 1;
function draw(id, W, tab, state = fresh(id), viewport = {}, rt = runtime) {
  const { context, G } = rt;
  const H = viewport.height ?? (tab === 'explore' ? (W === 360 ? 307 : 326) : (W === 360 ? 291 : 309));
  const b = Object.create(context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom: viewport.bottom ?? 58, left: 0, right: viewport.right ?? 0 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb: !!viewport.thumb, panes: null, paneId: null, focus: { x: [-2, 2], y: [-2, 2] }, texts: [], paths: [], arcs: [], leaders: [], marks: [] });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, value, o = {}) => {
    const at = b.toS(p), size = (o.size || 16) * b._ts(), width = G.textW(value, size);
    const x = at.x + (o.dx || 0), y = at.y + (o.dy || 0);
    b.texts.push({ text: String(value), world: p, x, y, l: x - width / 2, r: x + width / 2, t: y - size / 2, b: y + size / 2, options: o }); return b;
  };
  b.annotationSize = (value, o = {}) => ({ width: G.textW(value, o.size || 16) + 6, height: (o.size || 16) + 6 });
  b.leader = (at, label, options) => { b.leaders.push({ at, label, options }); return b; };
  for (const name of ['point', 'handle', 'right', 'ticks', 'circle']) b[name] = (...args) => { b.marks.push({ name, args }); return b; };
  const sc = rt.scene(id); sc.draw(b, state, {}, { s: state, tab, scene: sc });
  return b;
}
function visibleLabels(b, id) {
  for (const label of b.texts) assert.ok(label.l >= 0 && label.r <= b.W - b.insets.right && label.t >= 0 && label.b <= b.H - b.insets.bottom,
    `${id}: clipped label ${label.text} at ${JSON.stringify(label)}`);
}
function separated(b, id) {
  for (let i = 0; i < b.texts.length; i++) for (let j = i + 1; j < b.texts.length; j++)
    assert.ok(!overlap(b.texts[i], b.texts[j]), `${id}: ${b.texts[i].text} overlaps ${b.texts[j].text}`);
}
function coreHeight(b) {
  const core = b.paths.find(p => p.options.close && p.options.color === 'ink');
  assert.ok(core, 'the original closed polygon is drawn');
  return Math.max(...core.points.map(p => p.y)) - Math.min(...core.points.map(p => p.y));
}
for (const W of [360, 390]) {
  for (const id of ['p3-given', 'p3-mixed']) for (const tab of ['explore', 'problem']) {
    test(`${id} ${W}px ${tab} has a readable pentagon and distinct given values`, t => {
      const s = fresh(id), b = draw(id, W, tab, s), height = coreHeight(b);
      assert.ok(height >= 120, `${id}: original pentagon is only ${height}px high`);
      visibleLabels(b, id); separated(b, id);
      const m = scene(id).pg.model(s);
      if (tab === 'problem') {
        assert.equal(b.texts.filter(v => v.text === 'x').length, 1, 'the unknown remains visible');
        assert.ok(!b.texts.some(v => Math.hypot(v.world.x - m.V[4].x, v.world.y - m.V[4].y) < 1e-8 && v.text.includes(String(m.x))), 'no early answer');
      }
      t.diagnostic(`pentagon height ${height.toFixed(2)}px`);
    });
  }
  test(`p2-ext ${W}px problem keeps both given angles apart`, () => {
    const b = draw('p2-ext', W, 'problem');
    assert.ok(coreHeight(b) >= 110); visibleLabels(b, 'p2-ext'); separated(b, 'p2-ext');
    assert.ok(b.texts.some(t => t.text === '50°') && b.texts.some(t => t.text === '60°') && b.texts.some(t => t.text === 'x'));
  });
  test(`p2-star ${W}px problem keeps five distinct tips and no disclosed target`, () => {
    const b = draw('p2-star', W, 'problem');
    const tips = b.paths.filter(p => p.options.color === 'ink').flatMap(p => p.points);
    const height = Math.max(...tips.map(p => p.y)) - Math.min(...tips.map(p => p.y));
    assert.ok(height >= 125, `star is only ${height}px high`); visibleLabels(b, 'p2-star'); separated(b, 'p2-star');
    assert.ok(b.texts.some(t => t.text === 'E x')); assert.ok(!b.texts.some(t => t.text === 'E 36°'));
  });
  test(`p2-bis ${W}px problem separates the original triangle, bisectors and labels`, () => {
    const b = draw('p2-bis', W, 'problem'); assert.ok(coreHeight(b) >= 150);
    visibleLabels(b, 'p2-bis'); separated(b, 'p2-bis');
    assert.equal(b.texts.filter(t => t.text === '●').length, 2); assert.equal(b.texts.filter(t => t.text === '×').length, 2);
    assert.ok(b.texts.some(t => t.text === 'x') && b.texts.some(t => t.text === '60°'));
  });
  test(`p3-ext360 ${W}px initial caption fits without losing any exterior sector`, () => {
    const b = draw('p3-ext360', W, 'explore');
    const captions = b.texts.filter(t => t.text.includes('외각'));
    assert.equal(captions.length, 1); assert.ok(captions[0].l >= 0 && captions[0].r <= W);
    assert.equal(b.arcs.filter(a => a.options.sector).length, 6);
  });
  test(`p4-diag ${W}px gives each displayed angle a separate label`, () => {
    const b = draw('p4-diag', W, 'explore'), labels = b.texts.filter(t => t.text === '72°');
    assert.equal(labels.length, 2); assert.ok(!overlap(...labels), 'helper and target values must be distinguishable');
    const moved = labels.find(t => t.options.color === 'green');
    assert.ok(b.leaders.some(l => Math.hypot(l.label.x - moved.x, l.label.y - moved.y) < 1e-6), 'helper value is connected to its actual arc');
    visibleLabels(b, 'p4-diag');
  });
}
test('mobile layout preserves the actual polygon models, question choices and final-stage reveal', () => {
  for (const id of ['p2-ext', 'p2-star', 'p2-bis', 'p3-given', 'p3-mixed', 'p4-diag']) for (const W of [360, 390]) {
    const sc = scene(id), s = fresh(id), m = sc.pg.model(s), key = JSON.stringify(m), q = sc.pg.prob(m, s);
    assert.equal(q.choices.filter(c => c.ok).length, 1);
    draw(id, W, 'problem', s); s.step = 1; const start = draw(id, W, 'review', s);
    if (!['p2-ext', 'p4-diag'].includes(id)) assert.ok(start.texts.some(t => t.text === 'x' || /\bx$/.test(t.text)), `${id}: initial solution keeps its unknown`);
    else assert.ok(!start.texts.some(t => t.options.color === 'amber' && t.text === `${id === 'p2-ext' ? m.e : m.x}°`), `${id}: the target is still absent from the first construction step`);
    s.step = sc.steps(s).length; const end = draw(id, W, 'review', s);
    assert.ok(!end.texts.some(t => t.text === 'x' || /\bx$/.test(t.text)), `${id}: final solution resolves the unknown`);
    assert.equal(JSON.stringify(sc.pg.model(s)), key, `${id}: rendering keeps the mathematical model`);
    assert.ok(!s.revealed && !s.playing);
  }
});

test('dragging the narrow bisector triangle keeps its target value clear of the base',()=>{
  // Actual native pointer state from run42623072916: A=44, B=60, canvas360x387.
  for(const [W,height] of [[360,387],[390,411]])for(let a=40;a<=90;a+=2)for(let bb=40;bb<=60;bb+=2){
    const s=fresh('p2-bis');Object.assign(s,{pgKa:a,pgKb:bb,pgK:1});
    const beforeModel=JSON.stringify(scene('p2-bis').pg.model(s));
    const b=draw('p2-bis',W,'explore',s,{height,bottom:60}),m=scene('p2-bis').pg.model(s);
    const label=b.texts.find(t=>t.text===`${m.x}°`&&t.options.color==='amber');assert.ok(label);
    const baseY=b.toS(m.g.B).y;
    assert.ok(label.b<=baseY-6||label.t>=baseY+6,`${W}/${a}/${bb}: target value covers BC: ${JSON.stringify(label)}`);
    if(label.t>baseY)assert.ok(b.leaders.some(l=>Math.hypot(l.label.x-label.x,l.label.y-label.y)<1e-6),'external value must point to its actual arc');
    const row=b.texts.find(t=>t.text.startsWith('● ='));
    if(row)assert.ok(!overlap(label,row),'target value does not cover the explanation row');
    assert.equal(JSON.stringify(scene('p2-bis').pg.model(s)),beforeModel);
  }
});

// Run 42669558624 records these native canvas sizes and toolbar insets for
// p3-given/p3-mixed. The 820px problem canvas is only 397px high, not the
// viewport's 1180px; a width-only mobile breakpoint missed its crowded angles.
const nativeViews = [
  { name: 'pc', width: 1039, explore: 663, problem: 787, bottom: 56, right: 16 },
  { name: 'tablet-portrait', width: 820, explore: 420, problem: 397, bottom: 60, right: 0 },
  { name: 'tablet-landscape', width: 683, explore: 493, problem: 613, bottom: 56, right: 16 },
  { name: 'mobile', width: 390, explore: 326, problem: 309, bottom: 60, right: 0 },
  { name: 'small-mobile', width: 360, explore: 307, problem: 291, bottom: 60, right: 0 }
];
const samePoint = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < 1e-8;
const plain = value => JSON.parse(JSON.stringify(value));
const interior = (V, i) => {
  const p = V[i], a = V[(i + 4) % 5], z = V[(i + 1) % 5];
  const u = { x: a.x - p.x, y: a.y - p.y }, v = { x: z.x - p.x, y: z.y - p.y };
  return Math.acos(Math.max(-1, Math.min(1, (u.x * v.x + u.y * v.y) / Math.hypot(u.x, u.y) / Math.hypot(v.x, v.y)))) * 180 / Math.PI;
};
function pentagonStates(id) {
  const keys = id === 'p3-given' ? ['pgGa', 'pgGb', 'pgGc', 'pgGd'] : ['pgMa', 'pgMb', 'pgMc', 'pgMd'];
  const states = [fresh(id)];
  for (let mask = 0; mask < 16; mask++) {
    const s = fresh(id);
    keys.forEach((key, i) => { s[key] = id === 'p3-mixed' && i >= 2 ? (mask & (1 << i) ? 80 : 65) : (mask & (1 << i) ? 115 : 100); });
    states.push(s);
  }
  return states;
}
for (const id of ['p3-given', 'p3-mixed']) {
  test(`${id}: native tablet problem separates adjacent given angles`, t => {
    const view = nativeViews.find(v => v.name === 'tablet-portrait');
    for (const [index, s] of pentagonStates(id).entries()) {
      const b = draw(id, view.width, 'problem', s, { ...view, height: view.problem });
      const m = scene(id).pg.model(s);
      const at = i => b.texts.find(t => samePoint(t.world, m.V[i]) && t.text === `${m.ints[i]}°`);
      const gap = at(1).l - at(0).r;
      if (index === 0) t.diagnostic(`native 820x397, bottom inset 60: given-angle gap ${gap.toFixed(2)}px, polygon height ${coreHeight(b).toFixed(2)}px`);
      assert.ok(gap >= 12, `${id}: the A/B given values need visible separation; gap=${gap}px`);
      visibleLabels(b, id); separated(b, id);
      assert.equal(b.texts.filter(t => samePoint(t.world, m.V[4]) && t.text === 'x').length, 1, 'the requested angle stays unknown');
      assert.ok(!b.texts.some(t => samePoint(t.world, m.V[4]) && t.text.includes(`${m.x}°`)), 'the problem must not disclose its answer');
      m.V.forEach((_, i) => assert.ok(Math.abs(interior(m.V, i) - m.ints[i]) < 1e-8, `${id}: rendered vertex ${i} preserves its actual angle`));
      assert.ok(Math.abs(m.V.reduce((sum, _, i) => sum + interior(m.V, i), 0) - 540) < 1e-8);
    }
  });
  test(`${id}: the tablet correction preserves problem, solution stages, controls and reentry`, () => {
    const sc = scene(id);
    for (const s of pentagonStates(id)) {
      const model = plain(sc.pg.model(s)), problem = plain(sc.pg.prob(sc.pg.model(s))), steps = plain(sc.steps(s));
      draw(id, 820, 'problem', s, { height: 397, bottom: 60 });
      for (const step of [0, 1, 2, 3]) {
        s.step = step;
        const b = draw(id, 820, 'review', s, { height: 397, bottom: 60 });
        const target = b.texts.find(t => samePoint(t.world, model.V[4]) && t.options.color === 'amber');
        assert.equal(target.text, step < 3 ? 'x' : `x=${model.x}°`, 'the original solution reveal order is unchanged');
      }
      assert.deepEqual(plain(sc.pg.model(s)), model);
      assert.deepEqual(plain(sc.pg.prob(sc.pg.model(s))), problem);
      assert.deepEqual(plain(sc.steps(s)), steps);
      assert.equal(s.revealed, false); assert.equal(s.playing, false);
      assert.equal(sc.actions, undefined, 'these slider-only scenes retain their original control set');
      sc.enter(s);
      assert.deepEqual(plain(sc.pg.model(s)), plain(sc.pg.model(fresh(id))), 'reentry restores the original givens');
    }
  });
}

const compareIndex = process.argv.indexOf('--compare-scope');
if (compareIndex >= 0) test('tablet pentagon correction leaves all other drawing states and mathematical content unchanged', () => {
  const old = load(process.argv[compareIndex + 1]);
  const picture = b => plain({ paths: b.paths, arcs: b.arcs, texts: b.texts, leaders: b.leaders, marks: b.marks });
  for (const sc of runtime.scenes) {
    const s = fresh(sc.id), z = old.fresh(sc.id), previous = old.scene(sc.id);
    assert.deepEqual(plain(sc.pg.model(s)), plain(previous.pg.model(z)), `${sc.id} model`);
    assert.deepEqual(plain(sc.pg.prob(sc.pg.model(s))), plain(previous.pg.prob(previous.pg.model(z))), `${sc.id} question and choices`);
    assert.deepEqual(plain(sc.steps(s)), plain(previous.steps(z)), `${sc.id} solution`);
    for (const view of nativeViews) for (const tab of ['explore', 'problem', 'review']) {
      const options = { ...view, height: tab === 'explore' ? view.explore : view.problem };
      const current = draw(sc.id, view.width, tab, s, options), prior = draw(sc.id, view.width, tab, z, options, old);
      const targeted = ['p3-given', 'p3-mixed'].includes(sc.id) && view.name === 'tablet-portrait' && tab === 'problem';
      if (!targeted) assert.deepEqual(picture(current), picture(prior), `${sc.id}/${view.name}/${tab}`);
      else {
        assert.deepEqual(plain(current.paths.map(p => p.world)), plain(prior.paths.map(p => p.world)), 'original polygon and exterior extension geometry is unchanged');
        assert.deepEqual(plain(current.texts.map(t => t.text)), plain(prior.texts.map(t => t.text)), 'all condition, vertex and unknown labels are retained');
        assert.deepEqual(plain(current.marks), plain(prior.marks), 'the original vertices and handles are retained');
        assert.ok(coreHeight(current) > coreHeight(prior), 'the same pentagon gets more usable space');
      }
    }
    const thumb = { height: 180, bottom: 0, right: 0, thumb: true };
    assert.deepEqual(picture(draw(sc.id, 240, 'explore', s, thumb)), picture(draw(sc.id, 240, 'explore', z, thumb, old)), `${sc.id} thumbnail`);
  }
});
