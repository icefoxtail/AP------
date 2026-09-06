const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../archive/layout-authority.js');
const ref = n => ({ sourceArchiveFile: 'exams/a.js', sourceQuestionUid: 'uid-' + n, sourceQuestionOrdinal: n, sourceQuestionNo: n });

test('Layout core keeps source data out while producing qpp, two-column, layoutTag, continuation, and overflow evidence', () => {
  const layout = L.paginateRenderableBlocks({ pageGeometry: { usableHeight: 100, columns: 2, qpp: 2 }, blocks: [
    { blockId: 'a', questionKey: 'q1', measuredHeight: 40, layoutTag: 'subjective-2up' },
    { blockId: 'b', questionKey: 'q2', measuredHeight: 40 },
    { blockId: 'b-cont', questionKey: 'q2', measuredHeight: 20, continuationOf: 'b' },
    { blockId: 'wide', questionKey: 'q3', measuredHeight: 50, layoutTag: 'fullwidth' },
    { blockId: 'oversize', questionKey: 'q4', measuredHeight: 120 }
  ] });
  assert.equal(layout.qpp, 2);
  assert.equal(layout.columns, 2);
  assert.deepEqual(layout.pages[0].columns.map(column => column.items.map(item => item.blockId)), [['a'], ['b', 'b-cont']]);
  assert.equal(layout.columnMap.find(item => item.blockId === 'wide').columnSpan, 2);
  assert.deepEqual(layout.continuationMap.map(item => item.continuationBlockId), ['b-cont']);
  assert.deepEqual(layout.overflowEvidence.map(item => item.blockId), ['oversize']);
  assert.doesNotMatch(JSON.stringify(layout), /sourceArchiveFile|recipientId|packetKey|studentId/);
});

test('Adapter materialization restores PageMap and separates continuation from primary question accounting', () => {
  const layout = L.paginateRenderableBlocks({ pageGeometry: { usableHeight: 100, columns: 2, qpp: 4 }, blocks: [
    { blockId: 'a', questionKey: 'q1', measuredHeight: 40 }, { blockId: 'a-cont', questionKey: 'q1', measuredHeight: 20, continuationOf: 'a' },
    { blockId: 'blank-trigger', questionKey: 'q2', measuredHeight: 20, blankPageAfter: true }
  ] });
  const maps = L.materializeLayoutMaps(layout, {
    a: { sectionId: 's', sourceRef: ref(1), displayNo: 1 },
    'a-cont': { sectionId: 's', sourceRef: ref(1), displayNo: 1 },
    'blank-trigger': { sectionId: 's', sourceRef: ref(2), displayNo: 2 }
  });
  assert.deepEqual(maps.pageMap.pages[0].displayNos, [1, 2]);
  assert.deepEqual(maps.pageMap.pages[0].continuations, ['a']);
  assert.equal(maps.pageMap.pages[1].hasBlankPage, true);
  assert.equal(maps.columnMap.length, 3);
});

test('Layout respects selected raw/tight measurements, block gap, and explicit slot occupancy before qpp page breaks', () => {
  const layout = L.paginateRenderableBlocks({ pageGeometry: { usableHeight: 100, columns: 1, qpp: 3, blockGap: 5, measurementMode: 'tight' }, blocks: [
    { blockId: 'a', questionKey: 'q1', measurements: { raw: 60, tight: 45 }, slotOccupancy: 2 },
    { blockId: 'b', questionKey: 'q2', measurements: { raw: 50, tight: 45 }, slotOccupancy: 1 },
    { blockId: 'c', questionKey: 'q3', measurements: { raw: 10, tight: 10 }, slotOccupancy: 1 }
  ] });
  assert.equal(layout.measurementMode, 'tight');
  assert.equal(layout.blockGap, 5);
  assert.equal(layout.pages[0].columns[0].usedHeight, 95);
  assert.equal(layout.pages[0].slotOccupancy, 3);
  assert.deepEqual(layout.pages.map(page => page.blockIds), [['a', 'b'], ['c']]);
  assert.equal(layout.columnMap.find(item => item.blockId === 'b').gapBefore, 5);
  assert.equal(layout.columnMap.find(item => item.blockId === 'a').measurementMode, 'tight');
});
