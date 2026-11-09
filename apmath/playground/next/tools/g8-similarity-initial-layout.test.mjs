/** Initial diagram layout regressions; real browser screenshots remain required. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const context = { window: {}, console, document: { documentElement: { dataset: {} }, getElementById: () => true, addEventListener() {} } };
vm.createContext(context);
for (const file of ['core', 't1']) vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/labs/g8-similarity', file + '.js'), 'utf8'), context);
const scenes = context.window.APL_SM_GROUPS.flatMap(group => group.scenes);
const getScene = id => scenes.find(scene => scene.id === id);

function board(width, height, bottom = 58) {
  const log = [], b = { W: width, H: height, pad: .02, fs: 1, thumb: false, insets: { left: 0, right: 0, top: 0, bottom }, log };
  Object.defineProperty(b, 'k', { get() {
    if (!this.focus) return 35;
    const w = this.W - this.insets.left - this.insets.right, h = this.H - this.insets.top - this.insets.bottom;
    const pad = this.pad * Math.min(w, h);
    return Math.min((w - 2 * pad) / (this.focus.x[1] - this.focus.x[0]), (h - 2 * pad) / (this.focus.y[1] - this.focus.y[0]));
  } });
  b.toS = function (p) {
    return { x: this.W / 2 + (p.x - (this.focus.x[0] + this.focus.x[1]) / 2) * this.k,
      y: (this.H - this.insets.bottom) / 2 + (p.y - (this.focus.y[0] + this.focus.y[1]) / 2) * this.k };
  };
  for (const name of ['text', 'path', 'circle', 'arc', 'point', 'ticks', 'right', 'handle', 'leader']) b[name] = (...args) => { log.push({ name, args }); return b; };
  return b;
}
const center = (b, label) => {
  const [p, , options] = label.args, at = b.toS(p);
  return { x: at.x + (options.dx || 0), y: at.y + (options.dy || 0) };
};
const bounds = points => ({ x0: Math.min(...points.map(p => p.x)), x1: Math.max(...points.map(p => p.x)), y0: Math.min(...points.map(p => p.y)), y1: Math.max(...points.map(p => p.y)) });
const intersects = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

test('all five numbered examples occupy separate shape and number regions at the actual short mobile height', () => {
  const scene = getScene('sm1-always');
  for (const [width, height] of [[360, 291], [390, 324], [820, 530], [683, 476], [1040, 606]]) for (const seed of [1, 2, 17, 83, 997]) {
    const state = {}; scene.enter(state); state.smPk = scene.sm.gen(seed);
    const b = board(width, height); scene.draw(b, state, {}, { tab: 'problem' });
    const figures = b.log.filter(entry => entry.name === 'circle' || (entry.name === 'path' && entry.args[1]?.fill)).map(entry => {
      if (entry.name === 'circle') {
        const [p, radius] = entry.args, at = b.toS(p), r = radius * b.k;
        return { x0: at.x - r, x1: at.x + r, y0: at.y - r, y1: at.y + r };
      }
      return bounds(entry.args[0].map(p => b.toS(p)));
    });
    const numbers = b.log.filter(entry => entry.name === 'text' && /^[①②③④⑤]$/.test(entry.args[1]));
    assert.equal(figures.length, 5); assert.equal(numbers.length, 5);
    for (const number of numbers) {
      const at = center(b, number), half = number.args[2].size * .56;
      const box = { x0: at.x - half, x1: at.x + half, y0: at.y - half, y1: at.y + half };
      assert.ok(box.x0 >= 0 && box.x1 <= width && box.y0 >= 0 && box.y1 <= height - 58, `${width}|${seed}: ${number.args[1]} must remain in the visible drawing area`);
      assert.ok(!figures.some(shape => intersects(box, shape)), `${width}|${seed}: ${number.args[1]} overlaps a diagram`);
    }
    for (const shape of figures) assert.ok(shape.x0 >= 0 && shape.x1 <= width && shape.y0 >= 0 && shape.y1 <= height - 58, `${width}|${seed}: complete example shape must remain visible`);
  }
});

test('tetrahedron point names stay with their own solid instead of crossing the inter-solid gap', () => {
  const scene = getScene('sm1-solid');
  for (const [width, height] of [[360, 291], [390, 324], [683, 476], [1040, 606]]) for (const [m, n] of [[3, 5], [1, 2], [1, 3], [2, 4], [3, 4]]) {
    const state = {}; scene.enter(state);
    state.smPk = { ...scene.sm.gen(1), type: 'tet', m, n, given: 0, ask: 1, ne: 3 };
    const b = board(width, height); scene.draw(b, state, {}, { tab: 'problem' });
    const labels = Object.fromEntries(b.log.filter(entry => entry.name === 'text' && /^[A-H]$/.test(entry.args[1])).map(entry => [entry.args[1], entry]));
    const d = b.toS(labels.D.args[0]), f = b.toS(labels.F.args[0]), dl = center(b, labels.D), fl = center(b, labels.F);
    const distance = (a, c) => Math.hypot(a.x - c.x, a.y - c.y);
    assert.ok(d.x < f.x, 'the two solids must remain ordered');
    assert.ok(dl.x < fl.x, `${width}|${m}:${n}: D and F names must not swap left/right order`);
    assert.ok(distance(dl, d) + 3 < distance(dl, f), `${width}|${m}:${n}: D must clearly identify its own vertex`);
    assert.ok(distance(fl, f) + 3 < distance(fl, d), `${width}|${m}:${n}: F must clearly identify its own vertex`);
    assert.equal(Object.keys(labels).length, 8, 'all tetrahedron vertex names remain present');
    assert.ok(b.log.some(entry => entry.name === 'text' && entry.args[1] === 'x'));
    assert.ok(b.log.some(entry => entry.name === 'text' && entry.args[1] === 'y'));
  }
});
