// Coordinate regressions for independently observed mobile construction defects.
// Production Board projection is used; conservative font boxes supplement the
// separate native Chromium visual gate. No browser result is inferred here.
// Negative control: node this-file.mjs --baseline <commit>
// Unchanged scope: node this-file.mjs --compare-scope <commit>
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g7-construction';
const changed = new Set(['t3', 't4', 't5', 't6']);
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = value => JSON.parse(JSON.stringify(value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const overlap = (a, b, gap = 0) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > -gap && Math.min(a.b, b.b) - Math.max(a.t, b.t) > -gap;

function load(baseline) {
  const context = vm.createContext({ window: {}, document: { documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {} } });
  vm.runInContext('let seed=81273; Math.random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}', context);
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6']) {
    const file = `${unit}/${name}.js`;
    const source = baseline && changed.has(name)
      ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' })
      : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const scenes = context.window.APL_CN_GROUPS.flatMap(group => group.scenes);
  return { context, scenes, G: context.window.APL_CN, scene: id => scenes.find(scene => scene.id === id),
    state(id, patch = {}) { const s = { step: 0, revealed: false }; this.scene(id).enter(s); return Object.assign(s, patch); } };
}
const rt = load(arg('--baseline'));

function draw(runtime, id, W, H, tab = 'explore', patch = {}, bottom = 58) {
  const b = Object.create(runtime.context.window.APLab.Board.prototype);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { top: 0, bottom, left: 0, right: 0 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb: false, panes: null, paneId: null,
    focus: { x: [-2, 2], y: [-2, 2] }, texts: [], points: [], arcs: [], paths: [], marks: [], handles: [] });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), world: plain(points), options }); return b; };
  b.arc = (p, radius, from, to, options = {}) => { b.arcs.push({ p: plain(p), at: b.toS(p), radius: radius * b.k, from, to, options }); return b; };
  b.point = (p, options = {}) => { b.points.push({ p: plain(p), ...b.toS(p), r: options.r || 4, options }); return b; };
  b.text = (p, value, options = {}) => {
    const q = b.toS(p), text = String(value), size = (options.size || 13) * b.fs * b._ts();
    // Slightly wider Latin bounds include the heavy font's side bearings.
    const width = [...text].reduce((sum, ch) => sum + size * (/\s/.test(ch) ? .32 : ch.charCodeAt(0) >= 0x1100 ? 1 : .70), 0);
    const x = q.x + (options.dx || 0), y = q.y + (options.dy || 0), l = options.align === 'left' ? x : options.align === 'right' ? x - width : x - width / 2;
    b.texts.push({ text, p: plain(p), x, y, l, r: l + width, t: y - size / 2, b: y + size / 2, options }); return b;
  };
  for (const name of ['right', 'ticks', 'circle', 'leader']) b[name] = (...args) => { b.marks.push({ name, args: plain(args) }); return b; };
  b.handle = (id, p, options) => { b.handles.push({ id, p: plain(p), at: b.toS(p), options }); return b; };
  const sc = runtime.scene(id), s = runtime.state(id, patch), lab = { s, tab, scene: sc };
  const v = sc.view(s, lab); sc.draw(b, s, v, lab);
  b.state = s; return b;
}
const named = (b, text) => { const t = b.texts.find(t => t.text === text); assert.ok(t, `missing ${text}`); return t; };
const allNamed = (b, text) => b.texts.filter(t => t.text === text);
function clear(label, others, why) {
  for (const other of others) if (label !== other) assert.ok(!overlap(label, other, 1), `${why}: ${label.text} overlaps ${other.text}`);
}
function inside(label, b, why) {
  assert.ok(label.l >= 2 && label.r <= b.W - 2 && label.t >= 2 && label.b <= b.H - b.insets.bottom - 2,
    `${why}: ${label.text} extends beyond the usable canvas: ${JSON.stringify({ l: label.l, r: label.r, t: label.t, b: label.b })}`);
}

for (const [W, H, problemH, squareH] of [[360, 387, 291, 307], [390, 411, 309, 326]]) {
  test(`c3-5 ${W}px keeps B and D attached to their own separate vertices`, () => {
    for (const [cnCx, cnCy] of [[2.6, 3.6], [.6, 2.2], [5.4, 5.2]]) {
      const b = draw(rt, 'c3-5', W, H, 'explore', { cnCx, cnCy }), B = named(b, 'B'), D = named(b, 'D');
      clear(B, [D], 'inner vertex names');
      assert.ok(D.l - B.r >= 8, 'inner names have a readable gap instead of merging into BD');
      for (const name of ['A', 'B', 'C', 'D', 'E', 'F']) inside(named(b, name), b, 'given triangle names');
      assert.ok(b.handles.some(h => h.id === 'C'), 'the original shape drag handle stays available');
    }
  });
  test(`c5-2 ${W}px gives both initial triangles room for the given angles and equal-side marks`, t => {
    const b = draw(rt, 'c5-2', W, H), closed = b.paths.filter(p => p.options.close && p.world.length === 3);
    assert.ok(closed.length >= 4, 'both filled original triangles and their contours are drawn before playback');
    const triangles = closed.filter(p => p.options.color === 'ink').slice(0, 2);
    assert.equal(triangles.length, 2);
    for (const tr of triangles) {
      const base = distance(tr.points[0], tr.points[1]), height = Math.max(...tr.points.map(p => p.y)) - Math.min(...tr.points.map(p => p.y));
      assert.ok(base >= 110, `initial base ${base}px crowds three angle marks`);
      assert.ok(height >= 94, `initial height ${height}px crowds the angle value and drag point`);
      t.diagnostic(`initial triangle ${base.toFixed(2)}×${height.toFixed(2)}px`);
    }
    for (const text of ['55°', '65°', '60°']) assert.equal(allNamed(b, text).length, 2);
    for (const name of ['A', 'B', 'C', 'D', 'E', 'F']) inside(named(b, name), b, 'original triangle names');
    for (const label of b.texts.filter(t => /^\d+°$/.test(t.text))) clear(label, b.texts, 'given angle labels');
    assert.ok(b.handles.some(h => h.id === 'C'), 'the angle drag handle stays available');
    assert.equal(b.state.cnCt, 0); assert.equal(b.state.revealed, false);
  });
  test(`c6-2 ${W}px separates the whole BC dimension, CD condition and point names`, () => {
    const b = draw(rt, 'c6-2', W, problemH, 'problem'), whole = named(b, 'BC = 8 cm'), part = named(b, 'CD=3');
    for (const label of [whole, part]) { clear(label, b.texts, 'length condition'); inside(label, b, 'length condition'); }
    const names = ['B', 'C', 'D'].map(n => named(b, n));
    assert.ok(whole.t >= Math.max(...names.map(t => t.b)) + 8, 'whole-base dimension belongs below the point-name row');
    assert.ok(part.b < Math.min(...names.map(t => t.t)) - 3, 'CD condition remains distinct from D and C names');
    assert.equal(b.state.revealed, false);
  });
  test(`c6-3 ${W}px keeps E distinct from both 35-degree labels`, () => {
    const b = draw(rt, 'c6-3', W, squareH), E = named(b, 'E'), values = b.texts.filter(t => /^\d+°$/.test(t.text));
    assert.equal(values.length, 3); clear(E, values, 'square point E'); inside(E, b, 'square point E');
    assert.ok(b.handles.some(h => h.id === 'E'), 'the original angle drag handle stays available');
    assert.equal(b.state.cnKt, 0); assert.equal(b.state.revealed, false);
  });
  test(`c5-2 ${W}px keeps angle labels separate at every allowed angle pair`, () => {
    for (let cnEA = 30; cnEA <= 80; cnEA += 5) for (let cnEB = 30; cnEB <= 80; cnEB += 5) {
      const b = draw(rt, 'c5-2', W, H, 'explore', { cnEA, cnEB });
      const labels = b.texts.filter(t => /^\d+°$/.test(t.text));
      assert.equal(labels.length, 6, `both triangles show all three values at ${cnEA}/${cnEB}`);
      for (const label of labels) { clear(label, b.texts, `angle pair ${cnEA}/${cnEB}`); inside(label, b, 'angle condition'); }
    }
  });
  test(`c6-3 ${W}px keeps E clear across its size and angle sliders`, () => {
    for (let cnKa = 4; cnKa <= 8; cnKa++) for (let cnKe = 2; cnKe <= 5; cnKe++) for (let cnKth = 15; cnKth <= 75; cnKth += 5) {
      const b = draw(rt, 'c6-3', W, squareH, 'explore', { cnKa, cnKe, cnKth }), E = named(b, 'E');
      clear(E, b.texts.filter(t => /^\d+°$/.test(t.text)), `square sizes ${cnKa}/${cnKe}, angle ${cnKth}`);
      inside(E, b, 'square point E');
    }
  });
}

for (const id of ['c4-1', 'c5-1']) test(`${id} complete overlap keeps all combined vertex names on a 360px canvas`, () => {
  const key = id === 'c4-1' ? 'cnPt' : 'cnCt';
  for (const [cnCx, cnCy] of [[2.4, 3.6], [.8, 2.6], [5.2, 5.4]]) for (const mode of ['rot', 'slide', 'flip']) {
    const b = draw(rt, id, 360, 387, 'explore', { [key]: 1, cnCx, cnCy, cnPmode: mode });
    const labels = ['A=D', 'B=E', 'C=F'].map(n => named(b, n));
    for (const label of labels) { inside(label, b, 'completed overlap'); clear(label, labels, 'completed point correspondence'); }
    assert.ok(b.paths.some(p => p.options.color === 'green'), 'the completed moving triangle is still drawn');
  }
});

test('mobile changes keep original shapes and animation transformations mathematical', () => {
  for (const id of ['c4-1', 'c5-1', 'c5-2']) {
    const key = id === 'c4-1' ? 'cnPt' : 'cnCt';
    for (const t of [0, .5, 1, 0]) {
      const b = draw(rt, id, 360, 387, 'explore', { [key]: t });
      assert.ok(b.paths.filter(p => p.options.close && p.world.length === 3).length >= 2);
      const tris = b.paths.filter(p => p.options.close && p.world.length === 3 && p.options.color);
      const sides = tr => [0, 1, 2].map(i => distance(tr.world[i], tr.world[(i + 1) % 3])).sort((a, b) => a - b);
      const a = sides(tris[0]);
      for (const tr of tris) if (tr.options.color === 'ink' || tr.options.color === 'green') sides(tr).forEach((d, i) => assert.ok(Math.abs(d - a[i]) < 1e-7, `${id} t=${t} congruent side ${i}`));
      assert.equal(b.state.revealed, false);
    }
  }
});

const compare = arg('--compare-scope');
if (compare) {
  const old = load(compare);
  const signature = b => plain({ paths: b.paths, points: b.points, arcs: b.arcs, texts: b.texts, marks: b.marks,
    handles: b.handles.map(h => ({ id: h.id, p: h.p, at: h.at, ariaLabel: h.options.ariaLabel })) });
  test('wide rendering, questions, answer choices and scene initialization are unchanged', () => {
    for (const sc of rt.scenes) {
      const a = rt.state(sc.id), z = old.state(sc.id);
      assert.deepEqual(plain(a), plain(z), `${sc.id} initial state`);
      assert.deepEqual(plain(sc.cn.model(a)), plain(old.scene(sc.id).cn.model(z)), `${sc.id} model`);
      assert.deepEqual(plain(sc.cn.prob(sc.cn.model(a), a)), plain(old.scene(sc.id).cn.prob(old.scene(sc.id).cn.model(z), z)), `${sc.id} question`);
      for (const [W, H] of [[1039, 676], [623, 448]]) for (const tab of ['explore', 'problem', 'review']) {
        for (const step of tab === 'review' ? [1, 2, 3, 4] : [0]) assert.deepEqual(signature(draw(rt, sc.id, W, H, tab, { step }, 56)), signature(draw(old, sc.id, W, H, tab, { step }, 56)), `${sc.id}/${W}/${tab}/${step}`);
      }
    }
  });
  test('mobile unrelated scenes and the unchanged question/review branches keep their rendering', () => {
    for (const sc of rt.scenes) for (const tab of ['explore', 'problem', 'review']) {
      const affected = tab === 'explore' ? ['c3-5', 'c5-2', 'c6-3'] : tab === 'problem' ? ['c6-2'] : [];
      if (affected.includes(sc.id)) continue;
      // The complete-overlap review names of c4-1/c5-1 are an approved fix.
      if (tab === 'review' && ['c4-1', 'c5-1'].includes(sc.id)) continue;
      assert.deepEqual(signature(draw(rt, sc.id, 360, tab === 'problem' ? 291 : 387, tab, { step: 1 })), signature(draw(old, sc.id, 360, tab === 'problem' ? 291 : 387, tab, { step: 1 })), `${sc.id}/${tab}`);
    }
  });
}
