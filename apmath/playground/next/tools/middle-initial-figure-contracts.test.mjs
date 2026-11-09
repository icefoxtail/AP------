import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { sampleInitialFigure } from './middle-initial-figure-contracts.mjs';

// Independent analytic raster fixture: membership and distance to the two circles
// define the lens. It never calls the production renderer or the probe generator.
function fixture({ id = 'f1-lens', missing = [], uniform = false, scale = 28, offsetX = 38, offsetY = 35, dpr = 1, progress = 0, tab = 'explore' } = {}) {
  const side = 8, W = 320, H = 320, width = W * dpr, height = H * dpr;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const wx = (x / dpr - offsetX) / scale, wy = (y / dpr - offsetY) / scale;
    const insideSquare = wx >= 0 && wx <= side && wy >= 0 && wy <= side;
    if (!insideSquare) continue;
    const d1 = Math.hypot(wx - side, wy), d2 = Math.hypot(wx, wy - side);
    const inLeaf = d1 < side && d2 < side;
    let rgba = uniform || missing.includes('fill') ? [20, 35, 45, 26] : inLeaf ? [238, 157, 35, 115] : [40, 145, 210, 110];
    const squareEdge = Math.min(wx, wy, side - wx, side - wy) * scale < 2;
    const arc1 = !missing.includes('arc1') && Math.abs(d1 - side) * scale < 1.6;
    const arc2 = !missing.includes('arc2') && Math.abs(d2 - side) * scale < 1.6;
    if (squareEdge) rgba = [30, 40, 50, 255];
    if (arc1 || arc2) rgba = [210, 127, 20, 235];
    data.set(rgba, (y * width + x) * 4);
  }
  const canvas = { width, height, getContext: () => ({ getImageData: () => ({ data }) }), getBoundingClientRect: () => ({ left: 0, top: 0, width: W, height: H }) };
  return { innerWidth: W, innerHeight: H, lab: { id: 'g7-circle-sector', scene: { id }, tab, s: { f1_lens_a: side, f1_lens_t: progress }, board: { canvas, W, H, toS: p => ({ x: offsetX + p.x * scale, y: offsetY + p.y * scale }) } } };
}

const evaluate = window => vm.runInNewContext(`(${sampleInitialFigure.toString()})()`, { window });

// These fixed teaching examples use circle membership and signed triangle areas,
// independent of the implementation's curve-probe coordinates.
function teachingFixture(id, hideEssential = false) {
  const W = 360, H = 340, side = 8, R = 6, r = 3;
  const rectangle = (x, y) => x >= 0 && y >= 0 && x <= side && y <= side;
  const sqEdge = (x, y) => Math.min(x, y, side - x, side - y);
  const circle = (x, y, cx, cy, radius) => Math.hypot(x - cx, y - cy) - radius;
  let bounds = [0, 0, side, side], contains, cut, edge, outline;
  const s = {}, f1 = id.slice(3);
  if (id === 'f1-star') {
    const ds = (x, y) => [[0, 0], [side, 0], [side, side], [0, side]].map(([cx, cy]) => circle(x, y, cx, cy, side / 2));
    contains = rectangle; cut = (x, y) => ds(x, y).some(d => d <= 0); edge = (x, y) => Math.min(...ds(x, y).map(Math.abs)); outline = sqEdge;
    s.f1_star_a = side;
  } else if (id === 'f1-ss2') {
    contains = (x, y) => rectangle(x, y) && circle(x, y, side, side, side) <= 0;
    cut = (x, y) => circle(x, y, side, side / 2, side / 2) <= 0;
    edge = (x, y) => Math.abs(circle(x, y, side, side / 2, side / 2));
    outline = (x, y) => Math.min(Math.abs(circle(x, y, side, side, side)), side - x, side - y);
    s.f1_ss2_a = side;
  } else if (id === 'f1-ex22') {
    const q = (x, y) => circle(x, y, side, 0, side), semi = (x, y) => circle(x, y, side, side / 2, side / 2);
    contains = rectangle; cut = (x, y) => q(x, y) <= 0 && semi(x, y) > 0;
    edge = (x, y) => Math.min(Math.abs(q(x, y)), Math.abs(semi(x, y))); outline = sqEdge;
    s.f1_ex22_a = side;
  } else if (id === 'f1-ring') {
    bounds = [-R, 0, R, R];
    contains = (x, y) => y >= Math.abs(x) && Math.hypot(x, y) <= R;
    cut = (x, y) => Math.hypot(x, y) <= r;
    edge = (x, y) => Math.abs(Math.hypot(x, y) - r);
    outline = (x, y) => Math.min(Math.abs(Math.hypot(x, y) - R), (y - Math.abs(x)) / Math.SQRT2);
    Object.assign(s, { f1_ring_R: R, f1_ring_r: r, f1_ring_th: 90 });
  } else if (id === 'f1-semis') {
    bounds = [-R, 0, R, R];
    const ds = (x, y) => [circle(x, y, -r, 0, r), circle(x, y, r, 0, r)];
    contains = (x, y) => y >= 0 && Math.hypot(x, y) <= R; cut = (x, y) => ds(x, y).some(d => d <= 0);
    edge = (x, y) => Math.min(...ds(x, y).map(Math.abs)); outline = (x, y) => Math.min(y, Math.abs(Math.hypot(x, y) - R));
    Object.assign(s, { f1_semis_R: R, f1_semis_r1: r });
  } else if (id === 'f1-tri') {
    // The 6-8-10 triangle has A=(-5,0), B=(5,0), C=(-1.4,4.8).
    bounds = [-5, 0, 5, 5];
    contains = (x, y) => y >= 0 && Math.hypot(x, y) <= 5;
    const left = (x, y) => (4.8 * (x + 5) - 3.6 * y) / 6;
    const right = (x, y) => (4.8 * (5 - x) - 6.4 * y) / 8;
    cut = (x, y) => y >= 0 && left(x, y) >= 0 && right(x, y) >= 0;
    edge = (x, y) => Math.min(Math.abs(left(x, y)), Math.abs(right(x, y)));
    outline = (x, y) => Math.min(y, Math.abs(Math.hypot(x, y) - 5));
    Object.assign(s, { f1_tri_AC: 6, f1_tri_BC: 8 });
  } else if (id === 'f3-leaf-len') {
    const ds = (x, y) => [circle(x, y, 0, 0, side), circle(x, y, side, side, side)];
    contains = rectangle; cut = (x, y) => ds(x, y).every(d => d <= 0);
    edge = (x, y) => Math.min(...ds(x, y).map(Math.abs)); outline = sqEdge;
    s.f3a = side;
  } else throw Error(`Unknown fixture ${id}`);
  const scale = Math.min(280 / (bounds[2] - bounds[0]), 260 / (bounds[3] - bounds[1]));
  const ox = 35 - bounds[0] * scale, oy = 35 - bounds[1] * scale;
  const data = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const wx = (x - ox) / scale, wy = (y - oy) / scale;
    if (!contains(wx, wy)) continue;
    let rgba = hideEssential ? [20, 35, 45, 26] : cut(wx, wy) ? [238, 157, 35, 115] : [40, 145, 210, 110];
    if (outline(wx, wy) * scale < 2) rgba = [30, 40, 50, 255];
    if (!hideEssential && edge(wx, wy) * scale < 1.6) rgba = [210, 127, 20, 235];
    data.set(rgba, (y * W + x) * 4);
  }
  s[`f1_${f1}_t`] = 0;
  const canvas = { width: W, height: H, getContext: () => ({ getImageData: () => ({ data }) }), getBoundingClientRect: () => ({ left: 0, top: 0, width: W, height: H }) };
  return { innerWidth: W, innerHeight: H, lab: { id: 'g7-circle-sector', scene: { id }, tab: 'explore', s, board: { canvas, W, H, toS: p => ({ x: ox + p.x * scale, y: oy + p.y * scale }) } } };
}

test('serializable function recognizes a visible two-arc lens and distinct regions', () => {
  const out = evaluate(fixture());
  assert.equal(out.applicable, true); assert.equal(out.status, 'PASS'); assert.equal(out.checks.length, 3);
});

test('original regression: square outline and text-like ink do not conceal the missing leaf', () => {
  const window = fixture({ missing: ['arc1', 'arc2', 'fill'] });
  const data = window.lab.board.canvas.getContext().getImageData().data;
  // The baseline generic non-blank condition remains satisfied by the outer square.
  let ink = 0; for (let i = 3; i < data.length; i += 4) if (data[i] > 30) ink++;
  assert.ok(ink > 200);
  const out = evaluate(window);
  assert.equal(out.status, 'FAIL');
  assert.equal(out.failures.filter(f => f.code === 'essential-contour-missing-or-clipped').length, 2);
  assert.ok(out.failures.some(f => f.code === 'essential-regions-indistinguishable-or-clipped'));
});

test('one missing arc with no distinguishing fill is rejected', () => {
  const out = evaluate(fixture({ missing: ['arc2', 'fill'] }));
  assert.equal(out.status, 'FAIL');
  assert.ok(out.failures.some(f => f.detail === 'leaf-arc-two'));
});

test('uniform opaque paint cannot impersonate meaningful contours', () => {
  const window = fixture({ missing: ['arc1', 'arc2', 'fill'] });
  const data = window.lab.board.canvas.getContext().getImageData().data;
  for (let i = 0; i < data.length; i += 4) data.set([40, 145, 210, 255], i);
  assert.equal(evaluate(window).status, 'FAIL');
});

test('a lens outside the viewport fails even if it is still inside a larger canvas', () => {
  const window = fixture(); window.innerWidth = 150;
  assert.equal(evaluate(window).status, 'FAIL');
});

test('device pixel ratio does not change semantic acceptance', () => {
  assert.equal(evaluate(fixture({ dpr: 2 })).status, 'PASS');
});

test('mid-animation is explicitly outside this initial-state contract', () => {
  const out = evaluate(fixture({ progress: .5 }));
  assert.equal(out.applicable, false); assert.equal(out.status, 'NOT_APPLICABLE');
});

test('problem tab checks its original static geometry even after animation state changed', () => {
  assert.equal(evaluate(fixture({ progress: .5, tab: 'problem' })).status, 'PASS');
});

test('unknown scenes are not given a semantic PASS', () => {
  const out = evaluate(fixture({ id: 'unlisted-scene' }));
  assert.equal(out.status, 'NOT_APPLICABLE'); assert.equal(out.applicable, false);
});

test('pixel read failures are explicit failures, not empty successful observations', () => {
  const window = fixture(); window.lab.board.canvas.getContext = () => { throw Error('tainted'); };
  const out = evaluate(window);
  assert.equal(out.status, 'FAIL'); assert.equal(out.failures[0].code, 'semantic-pixels-unreadable');
});

for (const id of ['f1-star', 'f1-ss2', 'f1-ex22', 'f1-ring', 'f1-semis', 'f1-tri', 'f3-leaf-len']) {
  test(`${id}: analytic teaching figure passes; hiding essential geometry fails`, () => {
    const positive = evaluate(teachingFixture(id));
    assert.equal(positive.status, 'PASS', JSON.stringify(positive));
    const negative = evaluate(teachingFixture(id, true));
    assert.equal(negative.status, 'FAIL', JSON.stringify(negative));
    assert.ok(negative.failures.some(f => f.code === 'essential-contour-missing-or-clipped'));
  });
}
