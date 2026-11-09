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
const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
  createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
for (const name of ['core', 't1', 't2', 't3', 't4']) {
  const file = `${unit}/${name}.js`;
  const source = before ? execFileSync('git', ['show', `${before}:${file}`], { cwd: repo, encoding: 'utf8' }) : fs.readFileSync(path.join(repo, file), 'utf8');
  vm.runInContext(source, context, { filename: file });
}
context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
vm.runInContext(fs.readFileSync(path.join(repo, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
const G = context.window.APL_PG, scenes = context.window.APL_PG_GROUPS.flatMap(g => g.scenes);
const scene = id => scenes.find(s => s.id === id);
const fresh = id => { const s = { step: 1 }; scene(id).enter(s); return s; };
const overlap = (a, b) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > 1 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 1;
function draw(id, W, tab, state = fresh(id)) {
  const H = tab === 'explore' ? (W === 360 ? 307 : 326) : (W === 360 ? 291 : 309);
  const b = Object.create(context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom: 58, left: 0, right: 0 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb: false, panes: null, paneId: null, focus: { x: [-2, 2], y: [-2, 2] }, texts: [], paths: [], arcs: [], leaders: [] });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: points, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, value, o = {}) => {
    const at = b.toS(p), size = (o.size || 16) * b._ts(), width = G.textW(value, size);
    const x = at.x + (o.dx || 0), y = at.y + (o.dy || 0);
    b.texts.push({ text: String(value), world: p, x, y, l: x - width / 2, r: x + width / 2, t: y - size / 2, b: y + size / 2, options: o }); return b;
  };
  b.annotationSize = (value, o = {}) => ({ width: G.textW(value, o.size || 16) + 6, height: (o.size || 16) + 6 });
  b.leader = (at, label, options) => { b.leaders.push({ at, label, options }); return b; };
  for (const name of ['point', 'handle', 'right', 'ticks']) b[name] = () => b;
  const sc = scene(id); sc.draw(b, state, {}, { s: state, tab, scene: sc });
  return b;
}
function visibleLabels(b, id) {
  for (const label of b.texts) assert.ok(label.l >= 0 && label.r <= b.W && label.t >= 0 && label.b <= b.H - 58,
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
