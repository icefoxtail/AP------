import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { adjudicateSmokeMeasurement } from './scene-smoke-measurement-gate.mjs';
import { captureSmokeCalibrationFrame, evaluateSmokeSemanticCalibration } from './scene-smoke-semantic-calibration.mjs';

function fixture(render) {
  const W = 120, H = 100, data = new Uint8ClampedArray(W * H * 4).fill(255);
  const c = { globalAlpha: 1, lineWidth: 1, font: '', fillStyle: '#fff', strokeStyle: '#fff',
    measureText: text => ({ width: String(text).length * 10, actualBoundingBoxLeft: String(text).length * 4,
      actualBoundingBoxRight: String(text).length * 4, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 }),
    getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }), getImageData: () => ({ data }),
    fillText() {}, strokeText() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, fillRect() {}, save() {}, restore() {} };
  const canvas = { width: W, height: H, getContext: () => c, getBoundingClientRect: () => ({ left: 0, top: 0, width: W, height: H }) };
  const b = { W, H, ctx: c, canvas, fs: 1, font: 'sans-serif', _ts: () => 1,
    toS: (x, y) => ({ x, y }), _area: () => ({ x: 0, y: 0, w: W, h: H }),
    _fracSplit: str => str.includes('frac') ? [{ n: '18', d: '√3' }] : null,
    _text(x, y, str) {
      if (this._fracSplit(str)) { c.fillText('18', x, y - 9); c.fillText('√3', x, y + 9); c.fillRect(x - 10, y - 2, 20, 1); }
      else c.fillText(str, x, y);
    } };
  const window = { innerWidth: W, innerHeight: H, lab: { id: 'example', tab: 'explore', scene: { id: 'fraction' },
    s: { playing: false, step: 0 }, board: b, render: () => render(b, c) } };
  const originalText = b._text, methods = Object.fromEntries(['fillText', 'strokeText', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'fillRect'].map(k => [k, c[k]]));
  const capture = () => vm.runInNewContext(`(${captureSmokeCalibrationFrame.toString()})()`, { window });
  const restored = () => { assert.equal(b._text, originalText); for (const [k, value] of Object.entries(methods)) assert.equal(c[k], value, k); };
  return { window, capture, restored };
}
const formula = String.raw`\frac{18}{√3}`;
const judge = frame => adjudicateSmokeMeasurement(frame, evaluateSmokeSemanticCalibration(frame));

test('a real emitted fraction corrects its raw TeX box with unchanged 2px tolerance and retained FAIL', () => {
  const f = fixture(b => b._text(100, 40, formula)), frame = f.capture(); f.restored();
  const result = judge(frame);
  assert.equal(result.status, 'PASS', JSON.stringify(result)); assert.equal(result.legacy.status, 'FAIL');
  assert.equal(result.legacy.minimumInk, 200); assert.equal(result.legacy.alphaThreshold, 30);
  assert.equal(result.corrections[0].type, 'ACTUAL_ANNOTATION_BOUNDS');
  assert.equal(result.corrections[0].unchangedToleranceCssPx, 2);
  assert.equal(frame.glyphs.length, 2); assert.equal(frame.fractionBars.length, 1);
});

test('an invisible duplicate cannot borrow glyphs from another identical fraction invocation', () => {
  const f = fixture((b, c) => { b._text(100, 40, formula); c.globalAlpha = 0; b._text(100, 70, formula); c.globalAlpha = 1; });
  const frame = f.capture(); f.restored(); const result = judge(frame);
  assert.equal(frame.rawBoxes.length, 2); assert.equal(frame.annotations.length, 2);
  assert.equal(result.status, 'FAIL'); assert.ok(result.failures.includes('raw-clipped-annotation-unverified:2'));
  assert.equal(result.corrections.length, 1);
});

test('a missing denominator or foreground fraction bar cannot be excused by the other glyphs', () => {
  for (const missing of ['denominator', 'bar']) {
    const frame = fixture(b => b._text(100, 40, formula)).capture();
    if (missing === 'denominator') frame.glyphs.pop(); else frame.fractionBars.length = 0;
    assert.equal(judge(frame).status, 'FAIL', missing);
  }
});

test('actual glyphs and direct Canvas text fail beyond 2px even when raw boxes fit', () => {
  const frame = fixture((b, c) => { b._text(60, 40, 'A'); c.fillText('W', 123, 60); }).capture();
  assert.equal(frame.legacy.clipped.length, 0); assert.equal(frame.glyphs.at(-1).invocationId, null);
  assert.equal(judge(frame).status, 'FAIL');
  const fraction = fixture(b => b._text(100, 40, formula)).capture();
  fraction.fractionBars[0].x1 = 122; assert.equal(judge(fraction).status, 'PASS');
  fraction.fractionBars[0].x1 = 122.01; assert.equal(judge(fraction).status, 'FAIL');
});

test('collector restores every method after a render exception', () => {
  const f = fixture(b => { b._text(100, 40, formula); throw Error('draw failure'); });
  assert.throws(f.capture, /draw failure/); f.restored();
});

test('absent association metadata, duplicate ids and mismatched parents retain the legacy failure', () => {
  for (const change of [
    f => { f.annotationCaptureComplete = false; },
    f => { f.annotations.push({ ...f.annotations[0] }); },
    f => { f.glyphs[0].parentText = 'another label'; },
    f => { f.glyphs[0].invocationId = 90; },
    f => { f.rawBoxes = []; },
    f => { f.annotations[0].completed = false; },
  ]) {
    const frame = fixture(b => b._text(100, 40, formula)).capture(); change(frame);
    assert.equal(judge(frame).status, 'FAIL');
  }
});

test('low ink requires a fully applicable analytic contract; unknown or new scenes still fail', () => {
  const frame = fixture(b => b._text(60, 40, 'A')).capture(); frame.legacy.ink = 190;
  const unknown = evaluateSmokeSemanticCalibration(frame); assert.equal(judge(frame).status, 'FAIL');
  const proven = { ...unknown, status: 'PASS', contract: { applicable: true, key: 'independent-fixture', contours: [{}] }, checks: [{ pass: true }] };
  assert.equal(adjudicateSmokeMeasurement(frame, proven).status, 'PASS');
  for (const patch of [{ status: 'UNKNOWN' }, { status: 'FAIL' }, { checks: [] }, { checks: [{ pass: false }] }, { contract: { applicable: false } }])
    assert.equal(adjudicateSmokeMeasurement(frame, { ...proven, ...patch }).status, 'FAIL');
});

test('missing critical original content fails even with ample unrelated ink', () => {
  const frame = fixture(b => b._text(60, 40, 'A')).capture(); Object.assign(frame, { unit: 'g7-circle-sector', id: 'f1-lens' });
  assert.ok(frame.legacy.ink >= 200);
  const semantic = evaluateSmokeSemanticCalibration(frame, { applicable: true, status: 'FAIL', failures: [{ code: 'missing-leaf' }] });
  assert.equal(adjudicateSmokeMeasurement(frame, semantic).status, 'FAIL');
  assert.equal(adjudicateSmokeMeasurement(frame, { ...semantic, status: 'PASS', existingInitialContract: { status: 'NOT_APPLICABLE' } }).status, 'FAIL');
});
