import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { deriveSparseFigureContract, evaluateSmokeSemanticCalibration, captureSmokeCalibrationFrame, sampleSmokeSemanticCalibration } from './scene-smoke-semantic-calibration.mjs';

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rgba = (w, h) => new Uint8ClampedArray(w * h * 4);
const ink = f => {
  const step = Math.min(31, Math.max(1, Math.round(f.canvas.width * f.canvas.height / 20360)));
  let n = 0; for (let i = 3; i < f.rgba.length; i += 4 * step) if (f.rgba[i] > 30) n++;
  return { ink: n, samplingStep: step, clipped: [] };
};
const plain = () => ({ unit: 'unlisted', id: 'example', tab: 'explore', step: 0, playing: false,
  canvas: { width: 320, height: 300, cssWidth: 320, cssHeight: 300, rect: { left: 0, top: 0 } },
  area: { x: 0, y: 0, w: 320, h: 300 }, projection: { xx: 25, xy: 0, yx: 0, yy: 25, ox: 40, oy: 35 },
  state: {}, rgba: rgba(320, 300), glyphs: [], fractionBars: [], glyphCaptureComplete: true,
  fractionBarCaptureComplete: true, legacy: { ink: 999, clipped: [] } });

test('legacy 200/alpha30/2px failure is retained, without a gate override', () => {
  const f = plain(); f.legacy = { ink: 180, clipped: ['raw TeX diagnostic'], samplingStep: 26 };
  const r = evaluateSmokeSemanticCalibration(f);
  assert.deepEqual(r.legacy, { ...f.legacy, alphaThreshold: 30, minimumInk: 200, clipToleranceCssPx: 2, status: 'FAIL' });
  assert.equal(r.gateOverride, false); assert.equal(r.status, 'UNKNOWN');
});

test('actual glyph and fraction-bar clipping keep the exact 2 CSS-pixel boundary', () => {
  const f = plain(); f.legacy.clipped = ['literal TeX falsely extends outside'];
  f.glyphs = [{ text: 'AC', x0: 110, x1: 124, y0: 100, y1: 112 }];
  f.fractionBars = [{ kind: 'fraction-bar', x0: 108, x1: 126, y0: 114, y1: 115 }];
  assert.equal(evaluateSmokeSemanticCalibration(f).status, 'PASS');
  assert.equal(evaluateSmokeSemanticCalibration(f).legacy.status, 'FAIL', 'actual observation does not erase the old failure');
  for (const kind of ['glyphs', 'fractionBars']) {
    const z = { ...f, [kind]: [{ text: 'visible', x0: -2, x1: 20, y0: 5, y1: 20 }] };
    assert.equal(evaluateSmokeSemanticCalibration(z).status, 'PASS');
    z[kind][0].x0 = -2.01;
    assert.equal(evaluateSmokeSemanticCalibration(z).status, 'FAIL');
  }
});

test('unsupported model state is UNKNOWN, never a sparse-scene exemption', () => {
  const f = plain(); Object.assign(f, { unit: 'g7-surface-volume', id: 'sv6-1' });
  f.state = { svYaw: 28, svPitch: 24, jcKind: 'cone', jcStarted: false, jcK: 1, jcH: 5 };
  assert.equal(evaluateSmokeSemanticCalibration(f).status, 'UNKNOWN');
  assert.ok(deriveSparseFigureContract(f).unknown.length);
});

function visibleInitialTriangle() {
  const f = plain(); Object.assign(f, { unit: 'g8-pythagoras', id: 'py1-rot', step: 1, state: { pyWa: 6, pyWb: 8, pyRot: 0 },
    projection: { xx: 25, xy: 0, yx: 0, yy: 25, ox: 50, oy: 235 } });
  const points = [[50, 35], [200, 235], [50, 235]];
  const distance = (x, y, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); };
  for (let y = 0; y < 300; y++) for (let x = 0; x < 320; x++)
    if (points.some((p, i) => distance(x, y, p, points[(i + 1) % 3]) < 1.7)) f.rgba.set([240, 240, 240, 255], (y * 320 + x) * 4);
  f.legacy = ink(f); return f;
}

test('py1-rot uses the actual initial review cursor 1 while remaining an unplayed explore figure', () => {
  const f = visibleInitialTriangle(), before = evaluateSmokeSemanticCalibration(f);
  assert.equal(before.status, 'PASS'); assert.equal(before.checks.length, 3);
  assert.ok(before.checks.every(c => c.pass), 'all three original triangle sides are required');
  for (const patch of [{ step: 0 }, { step: 2 }, { tab: 'review' }, { tab: 'problem' }, { playing: true }, { playing: undefined }, { playing: null }]) {
    const changed = evaluateSmokeSemanticCalibration({ ...f, ...patch });
    assert.equal(changed.status, 'UNKNOWN', JSON.stringify(patch));
    assert.ok(changed.unknown.some(x => x.includes('original unplayed explore')));
    assert.deepEqual(changed.legacy, before.legacy, 'the legacy result is never overridden');
    const missingCore = evaluateSmokeSemanticCalibration({ ...f, ...patch, rgba: rgba(320, 300) });
    assert.equal(missingCore.status, 'FAIL', 'a wrong cursor must not suppress a genuinely missing original figure');
  }
});

test('branch-tree requires the separately observed initial branching level, even when shell cursor is zero', () => {
  const f = plain(); Object.assign(f, { unit: 'alg-sequence', id: 'br-tree', nodeTextWidth: 20,
    state: { br_t: 5, br_m: 0, br_level: 0 } });
  assert.deepEqual(deriveSparseFigureContract(f).unknown, []);
  for (const level of [1, 4, undefined, null]) {
    const out = deriveSparseFigureContract({ ...f, state: { ...f.state, br_level: level } });
    assert.ok(out.unknown.some(reason => reason.includes('before branching')));
  }
  for (const playing of [undefined, null]) assert.ok(deriveSparseFigureContract({ ...f, playing }).unknown.length);
});

test('CSS-scaled tiny triangle fails while all internal canvas ink and legacy values stay identical', () => {
  const f = visibleInitialTriangle(); assert.ok(f.legacy.ink >= 200); assert.equal(evaluateSmokeSemanticCalibration(f).status, 'PASS');
  const tiny = { ...f, canvas: { ...f.canvas, rect: { left: 0, top: 0, width: 9.6, height: 9 } } };
  const r = evaluateSmokeSemanticCalibration(tiny); assert.equal(r.status, 'FAIL');
  assert.deepEqual(r.legacy, evaluateSmokeSemanticCalibration(f).legacy);
  assert.ok(r.checks.every(c => c.span < c.minimumSpan));
});

// This lens raster is defined by distances to two independent circles, not by
// the probe locations or production draw commands.
function lensWindow({ coreHidden = false, alpha = 255 } = {}) {
  const f = plain(), W = 320, H = 300, side = 8, sc = 27, ox = 42, oy = 35;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const wx = (x - ox) / sc, wy = (y - oy) / sc;
    if (wx < 0 || wx > side || wy < 0 || wy > side) continue;
    const d1 = Math.hypot(wx - side, wy), d2 = Math.hypot(wx, wy - side), leaf = d1 < side && d2 < side;
    let value = coreHidden ? [20, 35, 45, 26] : leaf ? [238, 157, 35, 115] : [40, 145, 210, 110];
    if (Math.min(wx, wy, side - wx, side - wy) * sc < 2) value = [30, 40, 50, 255];
    if (!coreHidden && Math.min(Math.abs(d1 - side), Math.abs(d2 - side)) * sc < 1.6) value = [210, 127, 20, 235];
    f.rgba.set([value[0], value[1], value[2], Math.min(value[3], alpha)], (y * W + x) * 4);
  }
  if (coreHidden) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    if (x < 6 || y < 6 || x >= W - 6 || y >= H - 6) f.rgba.set([220, 220, 220, alpha], (y * W + x) * 4);
  const ctx = { globalAlpha: 1, font: '', lineWidth: 1, fillStyle: '#fff', strokeStyle: '#fff',
    measureText: text => ({ width: String(text).length * 7, actualBoundingBoxLeft: 0, actualBoundingBoxRight: 7,
      actualBoundingBoxAscent: 9, actualBoundingBoxDescent: 2 }),
    getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
    getImageData: () => ({ data: f.rgba }), fillText() {}, strokeText() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, save() {}, restore() {} };
  const canvas = { width: W, height: H, getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: W, height: H }) };
  const b = { ctx, canvas, W, H, fs: 1, font: 'sans-serif', _ts: () => 1,
    _area: () => ({ x: 0, y: 0, w: W, h: H }), _text() {},
    toS: (x, y) => { if (typeof x === 'object') ({ x, y } = x); return { x: ox + x * sc, y: oy + y * sc }; } };
  return { innerWidth: W, innerHeight: H, lab: { id: 'g7-circle-sector', scene: { id: 'f1-lens' }, tab: 'explore',
    s: { f1_lens_a: side, f1_lens_t: 0, playing: false, step: 0 }, board: b, render() {} } };
}

test('serializable browser entry always enforces the existing leaf contract even with ample outer ink', () => {
  const run = win => vm.runInNewContext(`(${sampleSmokeSemanticCalibration.toString()})()`, { window: win });
  const normal = run(lensWindow()); assert.equal(normal.existingInitialContract.status, 'PASS'); assert.equal(normal.status, 'PASS');
  const broken = run(lensWindow({ coreHidden: true }));
  assert.ok(broken.legacy.ink >= 200, 'outer square still satisfies the old sampled-ink predicate');
  assert.equal(broken.existingInitialContract.status, 'FAIL'); assert.equal(broken.status, 'FAIL');
  assert.ok(broken.failures.some(x => x.includes('essential-contour')));
  assert.ok(broken.failures.some(x => x.includes('essential-regions')));
  for (const al of [0, 30]) assert.equal(run(lensWindow({ alpha: al })).status, 'FAIL');
});

test('the existing tangent and F3 contracts cannot silently be omitted', () => {
  for (const [unit, id] of [['g9-circle', 'c6-8'], ['g7-circle-sector', 'f3-leaf-len']]) {
    const f = { ...plain(), unit, id };
    assert.equal(evaluateSmokeSemanticCalibration(f).status, 'UNKNOWN');
    assert.equal(evaluateSmokeSemanticCalibration(f, { applicable: true, status: 'FAIL', failures: [{ code: 'core-missing' }] }).status, 'FAIL');
  }
});

function realBoardWindow(dpr = 1) {
  const W = 390, H = 411, pixels = rgba(W * dpr, H * dpr);
  for (let i = 3; i < pixels.length; i += 4) pixels[i] = 255;
  const stack = [], context = { globalAlpha: 1, lineWidth: 1, font: '12px sans-serif', fillStyle: '#fff', strokeStyle: '#fff',
    textAlign: 'left', textBaseline: 'alphabetic',
    save() { stack.push(Object.fromEntries(Object.entries(this).filter(([, v]) => typeof v !== 'function'))); },
    restore() { Object.assign(this, stack.pop()); },
    measureText(text) { const size = +(this.font.match(/([\d.]+)px/)?.[1] || 12), width = String(text).length * size * .6;
      const left = this.textAlign === 'center' ? width / 2 : ['right', 'end'].includes(this.textAlign) ? width : 0;
      return { width, actualBoundingBoxLeft: left, actualBoundingBoxRight: width - left,
        actualBoundingBoxAscent: size * (this.textBaseline === 'middle' ? .5 : .8),
        actualBoundingBoxDescent: size * (this.textBaseline === 'middle' ? .5 : .2) }; },
    getTransform: () => ({ a: dpr, b: 0, c: 0, d: dpr, e: 0, f: 0 }), getImageData: () => ({ data: pixels }),
    setLineDash() {}, fillText() {}, strokeText() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, fillRect() {} };
  const canvas = { width: W * dpr, height: H * dpr, getContext: () => context,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: W, height: H }) };
  const sandbox = { console, Math, URLSearchParams, location: { search: '' }, localStorage: { getItem: () => null },
    document: { documentElement: { getAttribute: () => 'paper', setAttribute() {} } },
    getComputedStyle: () => ({ getPropertyValue: k => k === '--font-ui' ? 'sans-serif' : k === '--m-glow' ? '0' : '#ffffff' }) };
  sandbox.window = sandbox; const ctx = vm.createContext(sandbox);
  const kit = new URL('../kit/', import.meta.url);
  for (const file of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(new URL(file, kit), 'utf8'), ctx, { filename: file });
  const b = new sandbox.APLab.Board(canvas, { kind: 'figure', interactive: false }); b.W = W; b.H = H;
  sandbox.innerWidth = W; sandbox.innerHeight = H;
  sandbox.lab = { id: 'unlisted', scene: { id: 'glyph-observation' }, board: b, s: { step: 0, playing: false }, tab: 'explore', render() {} };
  sandbox.collect = () => vm.runInContext(`(${captureSmokeCalibrationFrame.toString()})()`, ctx);
  return sandbox;
}

test('real production Board fraction glyphs and foreground bars are measured at DPR1 and DPR2', () => {
  let reference;
  for (const dpr of [1, 2]) for (const halo of [false, true]) {
    const w = realBoardWindow(dpr), b = w.lab.board, originalText = b._text, originalFill = b.ctx.fillText;
    w.lab.render = () => b._text(195, 260, String.raw`sin B = \frac{AC}{BC} = \frac{AH}{AB} = \frac{4}{5}`,
      { size: 16, align: 'center', baseline: 'middle', halo });
    const f = w.collect(), r = evaluateSmokeSemanticCalibration(f);
    assert.equal(b._text, originalText); assert.equal(b.ctx.fillText, originalFill, 'temporary observer is restored');
    assert.equal(r.legacy.status, 'FAIL', 'literal raw TeX still overflows under original measurement');
    assert.equal(r.status, 'PASS', 'actual rendered annotation remains inside');
    assert.equal(f.fractionBars.filter(x => x.kind === 'fraction-bar-fill').length, 3, 'foreground fillRect bars are observed even with no halo');
    assert.ok(f.glyphs.some(g => g.text === 'AC')); assert.ok(f.glyphs.some(g => g.text === 'BC'));
    const shape = JSON.stringify(f.fractionBars.filter(x => x.kind === 'fraction-bar-fill'));
    if (!halo && dpr === 1) reference = shape;
    if (!halo && dpr === 2) assert.equal(shape, reference, 'DPR does not change CSS bounds');
  }
});

test('a real production fraction bar clipped beyond 2px fails even when its glyphs fit', () => {
  const w = realBoardWindow(2), b = w.lab.board;
  w.lab.render = () => b._text(-3.4, 60, String.raw`\frac{1}{1}`, { size: 16, align: 'left', halo: false });
  const f = w.collect(), r = evaluateSmokeSemanticCalibration(f);
  assert.ok(f.glyphs.every(g => g.x0 >= -2), 'numerator and denominator fit within the original tolerance');
  assert.ok(f.fractionBars.some(g => g.x0 < -2)); assert.equal(r.status, 'FAIL');
  assert.ok(r.actualGlyphMeasurement.clipped.some(g => g.kind === 'fraction-bar-fill'));
});

test('fully transparent production text/bar output is not mislabeled as a visible glyph', () => {
  const w = realBoardWindow(), b = w.lab.board;
  w.lab.render = () => { b.ctx.save(); b.ctx.globalAlpha = 0; b._text(-10, 60, String.raw`\frac{1}{1}`, { size: 16, halo: false }); b.ctx.restore(); };
  const f = w.collect(); assert.equal(f.glyphs.length, 0); assert.equal(f.fractionBars.length, 0);
  assert.ok(f.legacy.clipped.length, 'original raw failure remains recorded');
});

test('production Unicode and slash fractions have observed foreground bars too', () => {
  const w = realBoardWindow(), b = w.lab.board;
  w.lab.render = () => b._text(100, 60, '½ + 3/4', { size: 16, halo: false });
  const f = w.collect(); assert.equal(f.fractionBars.filter(x => x.kind === 'fraction-bar-fill').length, 2);
});

// Lossless PNG decoder for Chromium 8-bit RGB/RGBA evidence. No image library or
// network dependency is added to this experimental module.
function decodePng(bytes) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let offset = 8, width, height, channels; const chunks = [];
  while (offset < bytes.length) {
    const len = bytes.readUInt32BE(offset), type = bytes.toString('ascii', offset + 4, offset + 8), data = bytes.subarray(offset + 8, offset + 8 + len);
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); assert.equal(data[8], 8); assert.equal(data[12], 0); channels = { 2: 3, 6: 4 }[data[9]]; assert.ok(channels); }
    if (type === 'IDAT') chunks.push(data); offset += len + 12; if (type === 'IEND') break;
  }
  const packed = zlib.inflateSync(Buffer.concat(chunks)), stride = width * channels, raw = Buffer.alloc(stride * height);
  const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
  for (let y = 0; y < height; y++) {
    const filter = packed[y * (stride + 1)];
    for (let x = 0; x < stride; x++) { const i = y * stride + x, a = x >= channels ? raw[i - channels] : 0, b = y ? raw[i - stride] : 0, c = y && x >= channels ? raw[i - stride - channels] : 0;
      const predict = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter]; assert.notEqual(predict, undefined);
      raw[i] = (packed[y * (stride + 1) + x + 1] + predict) & 255;
    }
  }
  const data = rgba(width, height);
  for (let i = 0; i < width * height; i++) { data[i * 4] = raw[i * channels]; data[i * 4 + 1] = raw[i * channels + 1]; data[i * 4 + 2] = raw[i * channels + 2]; data[i * 4 + 3] = channels === 4 ? raw[i * 4 + 3] : 255; }
  return { width, height, data };
}

function fromSaved(row, unit, bytes) {
  const png = decodePng(bytes), v = row.canvas, i = v.insets, area = { x: i.left, y: i.top,
    w: v.cssWidth - i.left - i.right, h: v.cssHeight - i.top - i.bottom };
  assert.equal(png.width, v.width); assert.equal(png.height, v.height);
  const sign = unit === 'alg-sequence' ? -1 : 1, k = v.scale;
  const state = { ...row.params };
  // Explicit SOURCE-DERIVED initial metadata: the old report omitted camera and
  // string state. These are not represented as newly observed browser fields.
  if (unit === 'g7-surface-volume') Object.assign(state, row.id === 'sv2-6'
    ? { svYaw: 35, svPitch: 24, tpMode: 'surf', tpStarted: false }
    : row.id === 'sv3-6' ? { svYaw: 28, svPitch: 22, svShape6: 'full' }
    : { svYaw: 28, svPitch: 24, jcKind: 'hemi', jcStarted: false });
  return { unit, id: row.id, tab: row.tab, step: row.step, playing: row.playing, state, area,
    fontScale: v.fontScale, canvas: { ...v, rect: { left: v.rect.x, top: v.rect.y, width: v.rect.width, height: v.rect.height } },
    projection: { xx: k, xy: 0, yx: 0, yy: sign * k,
      ox: area.x + area.w / 2 - (v.focus.x[0] + v.focus.x[1]) / 2 * k,
      oy: area.y + area.h / 2 - sign * (v.focus.y[0] + v.focus.y[1]) / 2 * k },
    rgba: png.data, glyphs: row.labels.flatMap(x => x.glyphs || []), fractionBars: [],
    glyphCaptureComplete: false, fractionBarCaptureComplete: false,
    legacy: { ink: row.ink, samplingStep: row.samplingStep, clipped: [...row.clipped] },
    unobservedFields: ['Saved projection is reconstructed from initial focus/scale/insets; the old report did not expose pan or the actual Board basis.',
      ...(unit === 'g7-surface-volume' ? ['Current camera/string state was omitted; values here are source-derived initialization metadata.'] : [])],
    fixtureProvenance: 'Actual immutable PNG, source-derived initial camera/string state, incomplete old emitted-text/bar observations' };
}

function mutation(f, kind) {
  const z = { ...f, rgba: new Uint8ClampedArray(f.rgba) }, { width: w, height: h } = f.canvas;
  if (kind === 'offscreen') {
    z.viewport = { width: f.canvas.cssWidth, height: f.canvas.cssHeight };
    z.canvas = { ...f.canvas, rect: { left: f.canvas.cssWidth + 20, top: 0, width: f.canvas.cssWidth, height: f.canvas.cssHeight } };
  } else if (kind === 'alpha-zero' || kind === 'faint') for (let i = 3; i < z.rgba.length; i += 4) z.rgba[i] = kind === 'alpha-zero' ? 0 : Math.min(30, z.rgba[i]);
  else if (kind === 'tiny') {
    z.rgba.fill(0); const tw = 24, th = 24;
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) z.rgba.set(f.rgba.subarray((Math.floor(y * h / th) * w + Math.floor(x * w / tw)) * 4, (Math.floor(y * h / th) * w + Math.floor(x * w / tw)) * 4 + 4), ((Math.floor(h / 2) + y) * w + Math.floor(w / 2) + x) * 4);
    z.projection = { xx: f.projection.xx * tw / w, xy: f.projection.xy * tw / w,
      yx: f.projection.yx * th / h, yy: f.projection.yy * th / h,
      ox: f.projection.ox * tw / w + Math.floor(w / 2) * f.canvas.cssWidth / w,
      oy: f.projection.oy * th / h + Math.floor(h / 2) * f.canvas.cssHeight / h };
  } else {
    z.rgba.fill(0);
    if (kind === 'labels-only' || kind === 'core-hidden-with-auxiliary-frame') {
      const sx = w / f.canvas.cssWidth, sy = h / f.canvas.cssHeight;
      for (const g of f.glyphs) for (let y = Math.max(0, Math.floor(g.y0 * sy)); y < Math.min(h, Math.ceil(g.y1 * sy)); y++)
        for (let x = Math.max(0, Math.floor(g.x0 * sx)); x < Math.min(w, Math.ceil(g.x1 * sx)); x++) z.rgba.set(f.rgba.subarray((y * w + x) * 4, (y * w + x) * 4 + 4), (y * w + x) * 4);
    }
    if (kind === 'core-hidden-with-auxiliary-frame') for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
      if (x < 6 || y < 6 || x >= w - 6 || y >= h - 6) z.rgba.set([240, 240, 240, 255], (y * w + x) * 4);
  }
  z.legacy = ink(z); return z;
}

const fixtureRoot = process.env.APMATH_SMOKE_FIXTURE_ROOT;
test('immutable 80 browser fixtures calibrate actual contours; missing old observations remain UNKNOWN', { skip: !fixtureRoot }, async t => {
  const records = [], negative = [], representatives = new Map();
  for (const phase of ['baseline', 'candidate']) {
    const reportPath = path.join(fixtureRoot, phase, 'report.json'), reportBytes = fs.readFileSync(reportPath), report = JSON.parse(reportBytes);
    const expectedReport = { baseline: '21685719cc41e2efcac95e39a173ace6915ee672fdb7da6bb0e6d97cfc44d3c4',
      candidate: '2299588829383a8b3faf9ea6901934c90b3819372fb5f49ec293bd7144d9fa82' };
    assert.equal(sha(reportBytes), expectedReport[phase], 'fixture report is the independently verified immutable diagnostic artifact');
    assert.equal(report.source.head, phase === 'baseline' ? 'd69709250e06005f6e4d8fc4cea15667bc5d3ded' : '9bf1bb63bdc32dfa25195fb784c69d5c6290ddb6');
    for (const c of report.cases) for (const replay of c.replays) {
      const row = replay.row, file = path.join(fixtureRoot, phase, row.canvasCapture.file), bytes = fs.readFileSync(file);
      assert.equal(sha(bytes), row.canvasCapture.sha256); assert.equal(replay.comparison.sameCanvasBytes, true);
      const f = fromSaved(row, c.labId, bytes), r = evaluateSmokeSemanticCalibration(f);
      records.push({ phase, unit: c.labId, id: row.id, view: c.runId, sourceCommit: report.source.head,
        reportSha256: sha(reportBytes), canvas: file, canvasSha256: sha(bytes), legacy: r.legacy,
        status: r.status, failures: r.failures, unknown: r.unknown,
        contours: r.checks.map(x => ({ ...x, probes: undefined })) });
      if (phase === 'candidate' && c.runId === 'pc-board' && r.contract.applicable) representatives.set(`${c.labId}/${row.id}`, f);
    }
  }
  assert.equal(records.length, 80);
  for (const [key, f] of representatives) for (const kind of ['blank', 'alpha-zero', 'faint', 'offscreen', 'tiny', 'labels-only', 'core-hidden-with-auxiliary-frame']) {
    const changed = mutation(f, kind), r = evaluateSmokeSemanticCalibration(changed);
    negative.push({ key, kind, legacy: r.legacy, status: r.status, failures: r.failures });
    assert.equal(r.status, 'FAIL', `${key}: ${kind} must hard-fail its required original figure`);
    if (kind === 'core-hidden-with-auxiliary-frame') assert.ok(r.legacy.ink >= 200, `${key}: auxiliary frame deliberately satisfies old ink threshold`);
  }
  for (const id of ['type8-0', 'type8-1', 'br-tree']) {
    const f = representatives.get(`alg-sequence/${id}`), plan = deriveSparseFigureContract(f), node = plan.nodes[0];
    // This is a synthetic identity control on real pixels, not a claim that the
    // omitted old glyph record has been recovered.
    const complete = { ...f, unobservedFields: [], nodeTextWidth: 7, glyphCaptureComplete: true, fractionBarCaptureComplete: true,
      glyphs: [...f.glyphs, { text: node.text, x0: node.center.x - 3.5, x1: node.center.x + 3.5, y0: node.center.y - 6, y1: node.center.y + 6 }] };
    assert.equal(evaluateSmokeSemanticCalibration(complete).status, 'PASS');
    complete.glyphs.at(-1).text = 'wrong given';
    assert.equal(evaluateSmokeSemanticCalibration(complete).status, 'FAIL', 'a wrong given value cannot use a visible node enclosure as an exemption');
  }
  if (process.env.APMATH_SMOKE_CALIBRATION_OUT) fs.writeFileSync(process.env.APMATH_SMOKE_CALIBRATION_OUT,
    JSON.stringify({ purpose: 'EXPERIMENT_NOT_A_GATE_CHANGE', actualFixtureCount: records.length, records, negative,
      limitation: 'Old fixtures lack complete node glyphs/fraction bars and current camera. Analytic contour positives alone are not a browser or student-quality PASS.' }, null, 2) + '\n');
  for (const r of records) assert.equal(r.failures.length, 0, `${r.phase}/${r.unit}/${r.id}/${r.view}: ${r.failures.join(', ')}`);
  assert.equal(representatives.size, 7); assert.equal(negative.length, 49);
  t.diagnostic('80 SHA-bound real Chromium fixtures, 49 destructive negative images, original FAIL values retained; all final calibration statuses remain UNKNOWN until complete new browser observation.');
});

const experimentFixtureRoot = process.env.APMATH_SMOKE_EXPERIMENT_FIXTURE_ROOT;
test('complete actual Chromium observations retain 540 destructive failures and the original legacy results', { skip: !experimentFixtureRoot }, t => {
  const records = [], expected = {
    baseline: { report: 'e5c0b149707252ca30e10894014ddefda97c344182b674623cc1277f8a78c3cc',
      source: 'd69709250e06005f6e4d8fc4cea15667bc5d3ded', negative: 245, critical: 0, legacyFailedPrimary: 9 },
    candidate: { report: 'e1d368515b880641f36be54b8f684edff23d9756ddda8d745254f1345f6bfdbb',
      source: '9bf1bb63bdc32dfa25195fb784c69d5c6290ddb6', negative: 295, critical: 40, legacyFailedPrimary: 15 }
  };
  for (const [phase, binding] of Object.entries(expected)) {
    const reportBytes = fs.readFileSync(path.join(experimentFixtureRoot, `${phase}-report`, 'actual/report.json'));
    assert.equal(sha(reportBytes), binding.report, 'immutable complete-observation report');
    const report = JSON.parse(reportBytes); assert.equal(report.source.head, binding.source);
    assert.equal(report.positive.length, 40); assert.equal(report.replays.length, 40);
    assert.equal(report.negative.length, binding.negative); assert.equal(report.critical.length, binding.critical);
    assert.equal(report.infrastructureErrors.length, 0);
    assert.ok(report.sources.every(s => s.status === 200 && s.match && s.actualSha256 === s.gitBlobSha256));
    assert.equal(report.positive.filter(row => row.result.legacy.status === 'FAIL').length, binding.legacyFailedPrimary);
    for (const kind of ['positive', 'replays', 'negative', 'critical']) for (const row of report[kind]) {
      const capture = row.canvasCapture;
      const bytes = fs.readFileSync(path.join(experimentFixtureRoot, `${phase}-canvas`, capture.file));
      assert.equal(sha(bytes), capture.sha256); assert.equal(bytes.length, capture.bytes);
      const png = decodePng(bytes), f = { ...row.observation, rgba: png.data };
      assert.equal(png.width, f.canvas.width); assert.equal(png.height, f.canvas.height);
      assert.equal(f.glyphCaptureComplete, true); assert.equal(f.fractionBarCaptureComplete, true);
      // These source-bound browser results already ran the independent F01/F3/
      // tangent function. Replay that required result as a separate input; do
      // not pretend a saved tangent frame recaptures its unrecorded model API.
      const current = evaluateSmokeSemanticCalibration(f, row.result.existingInitialContract);
      assert.deepEqual(current.legacy, row.result.legacy, 'all original ink and clipping results are retained verbatim');
      assert.equal(current.gateOverride, false);
      assert.equal(current.status, kind === 'negative' ? 'FAIL' : 'PASS', `${phase}/${row.unit}/${row.id}/${row.run}/${kind}/${row.mutation || ''}`);
      if (f.id === 'py1-rot' && kind !== 'negative') {
        assert.equal(f.tab, 'explore'); assert.equal(f.step, 1); assert.equal(f.playing, false);
        assert.equal(row.result.status, 'UNKNOWN', 'the original experiment records the cursor assumption error');
        assert.equal(row.result.failures.length, 0); assert.equal(row.result.unknown.length, 1);
        assert.ok(current.checks.every(c => c.visible === 25 && c.pass));
        assert.equal(evaluateSmokeSemanticCalibration({ ...f, step: 0 }).status, 'UNKNOWN', 'an unobserved cursor is not silently accepted');
      } else {
        assert.equal(current.status, row.result.status, 'no other semantic verdict changes');
        assert.deepEqual(current.failures, row.result.failures);
      }
      if (kind === 'negative' && row.mutation === 'core-hidden-with-auxiliary-frame')
        assert.ok(current.legacy.ink >= 200, 'ample auxiliary ink cannot substitute for the original figure');
      records.push({ phase, kind, unit: row.unit, id: row.id, run: row.run, mutation: row.mutation || null,
        source: binding.source, reportSha256: binding.report, canvasSha256: capture.sha256,
        originalSemanticStatus: row.result.status, status: current.status, failures: current.failures,
        legacy: current.legacy, existingContractFromImmutableBrowserObservation: !!row.result.existingInitialContract?.applicable });
    }
  }
  assert.equal(records.length, 740);
  assert.equal(records.filter(r => r.kind === 'negative' && r.status === 'FAIL').length, 540);
  assert.equal(records.filter(r => r.kind !== 'negative' && r.status === 'PASS').length, 200);
  assert.equal(records.filter(r => r.originalSemanticStatus !== r.status).length, 20, 'only py1-rot primary/replay in two phases changes UNKNOWN to PASS');
  if (process.env.APMATH_SMOKE_EXPERIMENT_REEVALUATION_OUT) fs.writeFileSync(process.env.APMATH_SMOKE_EXPERIMENT_REEVALUATION_OUT,
    JSON.stringify({ purpose: 'OFFLINE_REEVALUATION_OF_IMMUTABLE_ACTUAL_FRAMES_NOT_A_NEW_BROWSER_RUN',
      sourceRunId: 42646572588, qualityVerdict: 'NOT_ASSERTED', records,
      limitation: 'Source-bound actual PNG and full observation replay; existing critical contract results were recorded in Chromium. The corrected cursor still requires a fresh live collector run.' }, null, 2) + '\n');
  t.diagnostic('740 SHA-bound actual frames: 200 positive/replay/critical PASS, 540 destructive FAIL, original baseline 9 and candidate 15 primary legacy failures unchanged. This is an offline reevaluation, not a new browser run or student-quality verdict.');
});
