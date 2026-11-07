import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const scope = { window: { APLab: { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) } } };
vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-board.js', import.meta.url), 'utf8'), scope);
const proto = scope.window.APLab.Board.prototype;
function board(scale = 1, tx = 0, ty = 0) {
  const paths = [], labels = [];
  const ctx = { font: '', save() {}, restore() {}, measureText(s) { return { width: String(s).length * parseFloat(this.font.split(' ')[1]) * 0.6 }; } };
  const b = { ctx, fs: 1, font: 'sans-serif', thumb: false, _ts: () => 1, _P: p => p,
    toS: p => ({ x: p.x * scale + tx, y: p.y * scale + ty }), toW: (x, y) => ({ x: (x - tx) / scale, y: (y - ty) / scale }),
    path(points, options) { paths.push({ points, options }); }, seg(p, q, options) { paths.push({ points: [p, q], options }); },
    text(point, str, options) { labels.push({ point, str, options }); }, paths, labels };
  for (const name of ['leader', 'annotationSize', 'curveDim', '_fracSplit']) b[name] = proto[name];
  return b;
}
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

test('curved dimension stays attached to both endpoints after zoom and pan', () => {
  for (const k of [0.5, 1, 3]) {
    const b = board(k, 35, -17), p = { x: 10, y: 20 }, q = { x: 130, y: 60 };
    const d = b.curveDim(p, q, '8', { from: { x: 60, y: -20 } });
    const points = b.paths[0].points;
    close(points[0].x, p.x); close(points[0].y, p.y);
    close(points.at(-1).x, q.x); close(points.at(-1).y, q.y);
    assert.ok(d.bow >= 8 && d.bow <= 18);
    assert.equal(b.labels[0].str, '8');
    const anchor = b.toS(b.labels[0].options.leaderAnchor);
    close(anchor.x, d.anchor.x); close(anchor.y, d.anchor.y);
  }
});

test('dimension curves away from the figure and retains a readable stacked fraction', () => {
  const b = board(), p = { x: 0, y: 0 }, q = { x: 120, y: 0 };
  const d = b.curveDim(p, q, '\\frac{3}{2}', { from: { x: 60, y: 50 } });
  assert.ok(d.anchor.y < 0 && d.label.y < d.anchor.y);
  assert.ok(d.box.y1 < d.anchor.y);
  assert.ok(b.annotationSize('\\frac{3}{2}').height > b.annotationSize('3').height);
});

test('leader begins at the real anchor and stops outside the label box', () => {
  const b = board(2, 10, 30);
  const d = b.leader({ x: 5, y: 10 }, { x: 45, y: 10 }, { width: 24, height: 18 });
  assert.equal(d.drawn, true);
  close(b.paths[0].points[0].x, 5); close(b.paths[0].points[0].y, 10);
  assert.ok(d.end.x < d.box.x0 && d.end.x > d.anchor.x);
  close(d.end.y, d.anchor.y);
  assert.equal(b.paths[0].options.color, 'muted');
  assert.ok(b.paths[0].options.width < 1.5);
  assert.equal(b.paths[0].options.dash.length, 0);
});

test('leader never draws through a nearby label or reveals a hidden annotation', () => {
  const b = board();
  assert.equal(b.leader({ x: 4, y: 0 }, { x: 0, y: 0 }, { width: 20, height: 20 }).drawn, false);
  assert.equal(b.leader({ x: 80, y: 0 }, { x: 0, y: 0 }, { width: 20, height: 20, alpha: 0 }).drawn, false);
  assert.equal(b.paths.length, 0);
  assert.equal(b.curveDim({ x: 0, y: 0 }, { x: 100, y: 0 }, '5', { alpha: 0 }), null);
  assert.equal(b.labels.length, 0);
  // toS also collects the production fit bounds, so hidden geometry must not call it.
  b.toS = () => { throw Error('hidden annotation affected fit bounds'); };
  assert.equal(b.leader({ x: 80, y: 0 }, { x: 0, y: 0 }, { alpha: 0 }).drawn, false);
  assert.equal(b.curveDim({ x: 0, y: 0 }, { x: 100, y: 0 }, '5', { alpha: 0 }), null);
});

test('short segments keep a direct label instead of a misleading tiny arc', () => {
  const b = board();
  const d = b.curveDim({ x: 20, y: 20 }, { x: 35, y: 20 }, '3');
  assert.equal(d.short, true);
  assert.equal(d.bow, 0);
  assert.equal(b.paths.length, 0);
  assert.equal(b.labels.length, 1);
  // A later label resolver owns the sole connector after it chooses the final position.
  const diagonal = board();
  diagonal.curveDim({ x: 0, y: 0 }, { x: 15, y: 12 }, '3', { gap: 12 });
  assert.equal(diagonal.paths.length, 0);
  assert.ok(diagonal.labels[0].options.leaderAnchor);
});

test('world and screen coordinate leaders identify the same target', () => {
  const a = board(3, -10, 12), b = board(3, -10, 12);
  const P = { x: 2, y: 5 }, Q = { x: 30, y: 40 };
  const first = a.leader(P, Q, { width: 24, height: 18 });
  const second = b.leader(b.toS(P), b.toS(Q), { width: 24, height: 18, px: true });
  close(first.anchor.x, second.anchor.x); close(first.anchor.y, second.anchor.y);
  close(first.end.x, second.end.x); close(first.end.y, second.end.y);
});
