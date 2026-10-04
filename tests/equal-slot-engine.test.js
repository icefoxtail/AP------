const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '../archive/equal-slot-engine.js');
const engine = fs.existsSync(file) ? require(file) : {};

test('v2 defaults only to four questions with explicit rollback', () => {
  assert.equal(typeof engine.enabled, 'function');
  assert.equal(engine.enabled(4, 'https://example.test/engine.html'), true);
  assert.equal(engine.enabled('4', '?slotEngine=legacy'), false);
  assert.equal(engine.enabled(6, '?slotEngine=v2'), false);
});

test('compatibility mode preserves special placement while strict equalSlots is explicit', () => {
  const special = [{ layoutTag: 'subjective-2up' }, { wide: true }];
  assert.equal(engine.enabled(4, '?slotEngine=v2', special), false);
  assert.equal(engine.enabled(4, '?equalSlots=1', special), true);
  assert.equal(engine.enabled(4, '?slotEngine=legacy&equalSlots=1', special), false);
});
test('four physical slots retain column-major order and final placeholders', () => {
  assert.equal(typeof engine.plan, 'function');
  const pages = engine.plan(Array.from({ length: 9 }, (_, i) => ({ id: i, wide: true })));
  assert.equal(pages.length, 3);
  assert.deepEqual(pages[0].map(s => [s.row, s.column, s.item.id]), [[0,0,0], [1,0,1], [0,1,2], [1,1,3]]);
  assert.deepEqual(pages[2].map(s => s.item?.id ?? null), [8,null,null,null]);
  assert.deepEqual(engine.plan([]), []);
});
test('readability wins when a bounded spacing candidate avoids substantial scaling', () => {
  assert.equal(typeof engine.selectFit, 'function');
  const result = engine.selectFit([{ profile:'normal', width:300, height:550, cost:0 }, { profile:'compact', width:300, height:395, cost:0.02 }], { width:310, height:400 });
  assert.equal(result.profile, 'compact');
  assert.equal(result.scale, 1);
  assert.equal(result.status, 'normal');
});
test('normal content is unchanged and extreme uniform scales are flagged for review', () => {
  assert.equal(typeof engine.selectFit, 'function');
  assert.equal(engine.selectFit([{ profile:'normal', width:100, height:100, cost:0 }, { profile:'compact', width:90, height:90, cost:0.02 }], { width:300, height:400 }).profile, 'normal');
  const tiny = engine.selectFit([{ profile:'normal', width:300, height:800, cost:0 }], { width:300, height:400 });
  assert.equal(tiny.scale, 0.5);
  assert.equal(tiny.status, 'review');
});
test('invalid slot geometry fails closed instead of accepting a zero scale', () => {
  assert.equal(typeof engine.selectFit, 'function');
  assert.throws(() => engine.selectFit([{width:1,height:1}], {width:0,height:400}), /EQUAL_SLOT_INVALID_GEOMETRY/);
  assert.throws(() => engine.selectFit([{width:NaN,height:1}], {width:300,height:400}), /EQUAL_SLOT_INVALID_GEOMETRY/);
});
test('audit compares physical local rectangles consistently under zoom and transform', () => {
  assert.equal(typeof engine.normalizeRect, 'function');
  const rect = { left:60, top:100, right:210, bottom:300, width:150, height:200 };
  const origin = { left:10, top:20 };
  assert.deepEqual(engine.normalizeRect(rect, origin, 0.5), {left:100,top:160,right:400,bottom:560,width:300,height:400});
});

test('audit source contains explicit empty-slot and SVG viewBox failure codes', () => {
  const source = require('fs').readFileSync(require('path').join(__dirname, '../archive/equal-slot-engine.js'), 'utf8');
  assert.match(source, /MISSING_SLOT_CONTENT/);
  assert.match(source, /EMPTY_SLOT_HAS_CONTENT/);
  assert.match(source, /SVG_VIEWBOX_CLIP/);
});
