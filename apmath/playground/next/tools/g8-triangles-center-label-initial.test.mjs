/** Screen-coordinate regression for the observed t7-1 O/I name reversal.
 * This is a geometry/label contract; actual Chromium review remains separate.
 * Optional negative control: node tools/g8-triangles-center-label-initial.test.mjs --baseline <SHA>
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const labPath = 'apmath/playground/next/labs/g8-triangles';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const plain = x => JSON.parse(JSON.stringify(x));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const near = (a, b) => distance(a, b) < 1e-7;
function load(baseline) {
  const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
  const context = vm.createContext({ window: {}, document, console });
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7']) {
    const file = `${labPath}/${name}.js`;
    const source = baseline && name === 't7' ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  context.window.APLab = { clamp: (x, lo, hi) => Math.max(lo, Math.min(hi, x)) };
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
  const groups = context.window.APL_TR_GROUPS, scenes = groups.flatMap(g => g.scenes), defaults = Object.assign({}, ...groups.map(g => g.params));
  return { context, G: context.window.APL_TR, scene: id => scenes.find(s => s.id === id),
    state(id) { const s = Object.fromEntries(Object.entries(defaults).map(([k, p]) => [k, p.value])); this.scene(id).enter(s); return s; } };
}
const rt = load(arg('--baseline'));
// Canvas sizes observed in the Chromium candidate; bottom toolbar allowance is
// kept explicit, including the shorter problem stage in the preservation check.
const views = [[1039, 672], [820, 461], [683, 548], [390, 411], [360, 387]];
function draw(rt, id, s, W, H, tab = 'explore', thumb = false) {
  const proto = rt.context.window.APLab.Board.prototype, b = Object.create(proto);
  Object.assign(b, { W, H, pad: .02, kind: 'figure', aspect: '1:1', insets: { left: 0, right: 0, top: 0, bottom: 58 },
    zoom: 1, panX: 0, panY: 0, fs: 1, thumb, panes: null, paneId: null, focus: { x: [-6, 6], y: [-6, 6] },
    paths: [], arcs: [], texts: [], marks: [], leaders: [] });
  b.path = (points, options = {}) => { b.paths.push({ points: points.map(p => b.toS(p)), options }); return b; };
  b.seg = (p, q, options = {}) => b.path([p, q], options);
  b.circle = (p, r, options = {}) => { b.marks.push({ method: 'circle', at: b.toS(p), r: r * b.k, options }); return b; };
  b.arc = (p, r, a, z, options = {}) => { b.arcs.push({ at: b.toS(p), r: r * b.k, a, z, options }); return b; };
  b.text = (p, text, options = {}) => {
    const q = b.toS(p), size = (options.size || 16) * b.fs * b._ts();
    b.texts.push({ text: String(text), p, x: q.x + (options.dx || 0), y: q.y + (options.dy || 0), size, options }); return b;
  };
  b.leader = (a, z, options) => { const result = proto.leader.call(b, a, z, options); b.leaders.push({ a, z, options, result }); return result; };
  for (const name of ['right', 'ticks', 'point', 'handle']) b[name] = (...args) => { b.marks.push({ method: name, args }); return b; };
  const scene = rt.scene(id); scene.draw(b, s, {}, { tab, scene, s });
  return b;
}
function checkCenters(rt, s, b) {
  const M = rt.scene('t7-1').tr.model(s), { O, I } = M.g, o = b.toS(O), i = b.toS(I);
  if (M.same) {
    assert.ok(b.texts.some(t => /^O\s*=\s*I$/.test(t.text)), 'coincident centers keep one combined name');
    return;
  }
  const ol = b.texts.find(t => t.text === 'O'), il = b.texts.find(t => t.text === 'I');
  assert.ok(ol && il, 'both center names are visible');
  assert.ok((ol.y - il.y) * (o.y - i.y) > 0, 'O/I names must retain the vertical order of their actual points');
  assert.ok(Math.abs(ol.y - il.y) > (ol.size + il.size) / 2 + 2, 'center names do not overlap');
  for (const [name, point, label] of [['O', O, ol], ['I', I, il]]) {
    assert.ok(label.x > 8 && label.x < b.W - 8 && label.y > 8 && label.y < b.H - 58 - 8, `${name}: inside the unobscured stage`);
    if (Math.abs(o.y - i.y) < 44) {
      const link = b.leaders.find(l => near(l.a, b.toS(point)) && near(l.z, label));
      assert.ok(link && link.result.drawn, `${name}: a short visible connector identifies the center after layout`);
    }
  }
}
for (const [W, H] of views) test(`t7-1 initial ${W}x${H} keeps O and I attached to the correct centers`, () => {
  const s = rt.state('t7-1'); checkCenters(rt, s, draw(rt, 't7-1', s, W, H));
});
test('all supported apex angles preserve the actual centers, label identity and reset state', () => {
  const scene = rt.scene('t7-1'), s = rt.state('t7-1');
  for (let a = 40; a <= 88; a += 4) {
    s.trMa = a;
    const M = scene.tr.model(s), { A, B, C, O, I } = M.g;
    const radius = distance(O, A);
    assert.ok(Math.abs(radius - distance(O, B)) < 1e-8 && Math.abs(radius - distance(O, C)) < 1e-8, 'O remains equidistant from the three vertices');
    const lineDistance = (p, q, z) => Math.abs((q.x - p.x) * (z.y - p.y) - (q.y - p.y) * (z.x - p.x)) / distance(p, q);
    const r = lineDistance(A, B, I);
    assert.ok(Math.abs(r - lineDistance(B, C, I)) < 1e-8 && Math.abs(r - lineDistance(C, A, I)) < 1e-8, 'I remains equidistant from the three sides');
    for (const [W, H] of views) { const before = JSON.stringify(s); checkCenters(rt, s, draw(rt, 't7-1', s, W, H)); assert.equal(JSON.stringify(s), before, 'label layout does not mutate the model'); }
  }
  scene.enter(s); assert.equal(s.trMa, 52); checkCenters(rt, s, draw(rt, 't7-1', s, 360, 387));
  assert.ok(!s.playing && !s.revealed && !s.answerOpen);
});
if (arg('--compare-scope')) test('other scenes, problem/solution stages, thumbnails and separated names are unchanged', () => {
  const before = load(arg('--compare-scope')), picture = b => plain({ paths: b.paths, arcs: b.arcs, texts: b.texts, marks: b.marks, leaders: b.leaders });
  for (const id of ['t7-1', 't7-2', 't7-3', 't7-4', 't7-5']) for (const [W, H] of views) for (const tab of ['explore', 'problem', 'review']) {
    const s = rt.state(id), old = before.state(id); s.step = old.step = 1;
    const actual = draw(rt, id, s, W, H, tab), previous = draw(before, id, old, W, H, tab);
    if (id === 't7-1' && tab === 'explore' && Math.abs(rt.scene(id).tr.model(s).g.O.y - rt.scene(id).tr.model(s).g.I.y) * actual.k < 44) continue;
    assert.deepEqual(picture(actual), picture(previous), `${id}/${W}/${tab}: out-of-scope picture`);
    assert.deepEqual(plain(rt.scene(id).tr.model(s)), plain(before.scene(id).tr.model(old)));
  }
  for (let a = 40; a <= 88; a += 4) {
    const s = rt.state('t7-1'), old = before.state('t7-1'); s.trMa = old.trMa = a;
    assert.equal(rt.scene('t7-1').problem.text(s), before.scene('t7-1').problem.text(old));
    const steps = rt.scene('t7-1').steps(s); assert.deepEqual(plain(steps), plain(before.scene('t7-1').steps(old)));
    for (let step = 1; step <= steps.length; step++) {
      s.step = old.step = step;
      assert.deepEqual(picture(draw(rt, 't7-1', s, 360, 291, 'review')), picture(draw(before, 't7-1', old, 360, 291, 'review')), `apex=${a} solution step=${step}`);
    }
    assert.deepEqual(picture(draw(rt, 't7-1', s, 240, 180, 'explore', true)), picture(draw(before, 't7-1', old, 240, 180, 'explore', true)), `apex=${a} thumbnail`);
  }
});
