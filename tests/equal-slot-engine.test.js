const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
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

test('raster clones apply measured fits only to the page being printed', async () => {
  const fitted = { dataset: { equalSlotFit: '{"offsetX":2,"offsetY":4,"scale":0.5}' }, style: {} };
  const staging = { dataset: {}, style: {} };
  const clone = { querySelectorAll: selector => selector.includes('.ap-slot-content') ? [fitted] : [] };
  const document = {
    defaultView: {},
    querySelectorAll: selector => selector.includes('.ap-slot-content') ? [fitted, staging] : []
  };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
    module,
    html2canvas: async (_page, options) => options.onclone(document, clone)
  });
  await module.exports.rasterizePage({ matches: () => true });
  assert.equal(fitted.style.transform, 'translate(1px, 2px) scale(0.5)');
  assert.deepEqual(staging.style, {});
});

test('audit source contains explicit empty-slot and SVG viewBox failure codes', () => {
  const source = require('fs').readFileSync(require('path').join(__dirname, '../archive/equal-slot-engine.js'), 'utf8');
  assert.match(source, /MISSING_SLOT_CONTENT/);
  assert.match(source, /EMPTY_SLOT_HAS_CONTENT/);
  assert.match(source, /SVG_VIEWBOX_CLIP/);
});

// 2026-11-18: 모든 문항을 칸에 먼저 놓고, 들어가지 않는 문항만 한 단 전체(span 2)로 올린다. 글자는 10.8px 밑으로 몰래 줄이지 않는다.
test('a one-column span starts a fresh column and numbers keep reading order', () => {
  const items = Array.from({ length: 7 }, (_, i) => ({ id: i }));
  const span = item => (item.id === 1 || item.id === 4 ? 2 : 1);
  const pages = engine.plan(items, span);
  // 0은 왼쪽 위, 1(한 단 전체)은 한 칸이 있는 단을 건너뛰어 오른쪽 단 전체, 2는 다음 쪽
  assert.deepEqual(pages[0].map(s => [s.item?.id ?? null, s.span, s.covered]), [[0,1,false],[null,1,false],[1,2,false],[null,1,true]]);
  assert.deepEqual(pages[1].map(s => [s.item?.id ?? null, s.span, s.covered]), [[2,1,false],[3,1,false],[4,2,false],[null,1,true]]);
  assert.deepEqual(pages[2].map(s => s.item?.id ?? null), [5,6,null,null]);
  // 읽는 순서: 왼쪽 단 위->아래, 오른쪽 단 위->아래가 번호 오름차순
  const order = pages.flatMap(p => p.filter(s => s.item).map(s => s.item.id));
  assert.deepEqual(order, [0,1,2,3,4,5,6]);
  // 한 단 전체가 연달아 나오면 한 쪽에 두 개가 짝이 된다
  const pair = engine.plan([{ id: 0 }, { id: 1 }, { id: 2 }], () => 2);
  assert.deepEqual(pair.map(p => p.filter(s => s.item).map(s => s.item.id)), [[0,1],[2]]);
  // span을 안 주면 예전과 같다
  assert.deepEqual(engine.plan(items)[0].map(s => s.item.id), [0,1,2,3]);
});

test('text never shrinks below the minimum scale: ineligible candidates are rejected and reported', () => {
  assert.equal(engine.MIN_EFFECTIVE_FONT_PX, 10.8);
  const minScale = 10.8 / 12.67;
  // 정상(scale 0.5)과 그림을 줄인 후보(scale 0.9, 비용 큼): 최소 배율을 지키는 후보가 이긴다
  const rescued = engine.selectFit([{ profile:'normal', width:300, height:800, cost:0 }, { profile:'compact images', width:300, height:430, cost:0.08 }], { width:310, height:400 }, minScale);
  assert.equal(rescued.profile, 'compact images');
  assert.ok(rescued.scale >= minScale);
  assert.ok(!rescued.belowMin);
  // 모두 모자라면 가장 큰 배율을 belowMin으로 돌려준다
  const stuck = engine.selectFit([{ profile:'normal', width:300, height:800, cost:0 }, { profile:'compact', width:300, height:600, cost:0.02 }], { width:310, height:400 }, minScale);
  assert.equal(stuck.belowMin, true);
  assert.equal(stuck.profile, 'compact');
  // 하한을 안 주면 예전 판정 그대로
  assert.equal(engine.selectFit([{ profile:'normal', width:300, height:800, cost:0 }], { width:300, height:400 }).scale, 0.5);
});

test('after the render entry strips layout hints, a paper with a forced span still uses equal slots', () => {
  const forced = [{ layoutTag: 'subjective-2up' }, { layoutTag: '' }];
  assert.equal(engine.enabled(4, '?slotEngine=v2', forced, true), true);
  assert.equal(engine.enabled(4, '?slotEngine=v2', [{ layoutTag: 'subjective-4up' }], true), false);
  assert.equal(engine.enabled(4, '?slotEngine=legacy', forced, true), false);
  assert.equal(engine.enabled(6, '?slotEngine=v2', forced, true), false);
});
