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

test('subjective layout tags automatically reserve legacy-compatible row spans and qpp slots', () => {
  const layout = L.paginateRenderableBlocks({ pageGeometry: { usableHeight: 200, columns: 2, qpp: 4 }, blocks: [
    { blockId: 'normal-a', questionKey: 'a', measuredHeight: 20 },
    { blockId: 'normal-b', questionKey: 'b', measuredHeight: 20 },
    { blockId: 'subj2', questionKey: 'c', measuredHeight: 20, layoutTag: 'subjective-2up' },
    { blockId: 'subj4', questionKey: 'd', measuredHeight: 20, layoutTag: 'subjective-4up' }
  ] });
  const subj2 = layout.columnMap.find(item => item.blockId === 'subj2');
  const subj4 = layout.columnMap.find(item => item.blockId === 'subj4');
  assert.equal(layout.slotRows, 2);
  assert.deepEqual({ kind: subj2.placementKind, rows: subj2.slotSpanRows, slots: subj2.slotOccupancy }, { kind: 'subjective-2up', rows: 2, slots: 2 });
  assert.deepEqual({ kind: subj4.placementKind, rows: subj4.slotSpanRows, slots: subj4.slotOccupancy }, { kind: 'subjective-4up', rows: 1, slots: 1 });
  assert.deepEqual(layout.pages.map(page => page.blockIds), [['normal-a', 'normal-b', 'subj2'], ['subj4']]);
});

test('pure legacy SLOT_POLICY and CHUNK_POLICY preserve deterministic left/right and 2up repack placement facts', () => {
  const chunk = L.planLegacyProductionLayout({ pageGeometry: { usableHeight: 200, columns: 2, qpp: 4, blockGap: 7 }, blocks: [
    { blockId: 'a', questionKey: 'a', measuredHeight: 20 }, { blockId: 'b', questionKey: 'b', measuredHeight: 20 },
    { blockId: 'c', questionKey: 'c', measuredHeight: 20 }, { blockId: 'd', questionKey: 'd', measuredHeight: 20 }
  ] });
  assert.equal(chunk.planner, 'LEGACY_SLOT_CHUNK_POLICY');
  assert.deepEqual(chunk.pages[0].columns.map(column => column.items.map(item => item.blockId)), [['a', 'b'], ['c', 'd']]);
  assert.deepEqual(chunk.pages[0].columns[0].items.map(item => item.columnOrder), [0, 1]);

  const slot = L.planLegacyProductionLayout({ pageGeometry: { usableHeight: 200, columns: 2, qpp: 4 }, blocks: [
    { blockId: 'normal-a', questionKey: 'a', measuredHeight: 20 },
    { blockId: 'normal-b', questionKey: 'b', measuredHeight: 20 },
    { blockId: 'subj2', questionKey: 'c', measuredHeight: 20, layoutTag: 'subjective-2up' },
    { blockId: 'wide', questionKey: 'd', measuredHeight: 20, layoutTag: 'fullwidth' }
  ] });
  assert.deepEqual(slot.pages[0].columns.map(column => column.items.map(item => item.blockId)), [['normal-a', 'normal-b'], ['subj2']]);
  const subj2 = slot.columnMap.find(item => item.blockId === 'subj2');
  assert.deepEqual({ columnNo: subj2.columnNo, rows: subj2.slotSpanRows, kind: subj2.placementKind }, { columnNo: 2, rows: 2, kind: 'subjective-2up' });
  assert.equal(slot.pages[1].columns[0].items[0].blockId, 'wide');
  assert.equal(slot.pages[1].columns[0].items[0].columnSpan, 2);
});

test('promotion comparator fails closed for a mutated legacy page, column, or continuation fact', () => {
  const records = {
    a: { sectionId: 'exam', sourceRef: ref(1), displayNo: 1 },
    b: { sectionId: 'exam', sourceRef: ref(2), displayNo: 2 },
    'b-cont': { sectionId: 'exam', sourceRef: ref(2), displayNo: 2 },
    wide: { sectionId: 'exam', sourceRef: ref(3), displayNo: 3, layoutTag: 'fullwidth' }
  };
  const expected = L.buildExpectedLayoutMaps({ pageGeometry: { usableHeight: 100, columns: 2, qpp: 4 }, blocks: [
    { blockId: 'a', questionKey: 'q1', measuredHeight: 20 },
    { blockId: 'b', questionKey: 'q2', measuredHeight: 20 },
    { blockId: 'b-cont', questionKey: 'q2', measuredHeight: 10, continuationOf: 'b' },
    { blockId: 'wide', questionKey: 'q3', measuredHeight: 30, layoutTag: 'fullwidth' }
  ] }, records, { sectionId: 'exam' });
  const observedInput = {
    qpp: 4,
    pages: expected.layout.pages.map(page => {
      const seenSharedBlocks = new Set();
      return {
        pageNo: page.pageNo,
        isBlank: page.isBlank,
        columns: page.columns.map(column => ({
          columnNo: column.columnNo,
          items: column.items.filter(item => {
            if (seenSharedBlocks.has(item.blockId)) return false;
            seenSharedBlocks.add(item.blockId);
            return true;
          }).map(item => ({ ...item }))
        }))
      };
    })
  };
  const observed = L.materializeLegacyLayoutMaps(observedInput, records, { sectionId: 'exam' });
  assert.equal(L.comparePromotionLayouts(observed, expected).equal, true);

  const columnMutation = structuredClone(observedInput);
  columnMutation.pages[0].columns[0].items[0].columnNo = 2;
  assert.equal(L.comparePromotionLayouts(L.materializeLegacyLayoutMaps(columnMutation, records, { sectionId: 'exam' }), expected).equal, false);

  const continuationMutation = structuredClone(observedInput);
  const continuation = continuationMutation.pages.flatMap(page => page.columns.flatMap(column => column.items)).find(item => item.blockId === 'b-cont');
  continuation.continuationOf = '';
  const continuationResult = L.comparePromotionLayouts(L.materializeLegacyLayoutMaps(continuationMutation, records, { sectionId: 'exam' }), expected);
  assert.equal(continuationResult.equal, false);
  assert.ok(continuationResult.differences.some(item => item.field === 'continuation' || item.field === 'duplication'));

  const orderMutation = structuredClone(observedInput);
  const orderedColumn = orderMutation.pages.flatMap(page => page.columns).find(column => column.items.length >= 2);
  const firstOrder = orderedColumn.items[0].columnOrder;
  orderedColumn.items[0].columnOrder = orderedColumn.items[1].columnOrder;
  orderedColumn.items[1].columnOrder = firstOrder;
  const orderResult = L.comparePromotionLayouts(L.materializeLegacyLayoutMaps(orderMutation, records, { sectionId: 'exam' }), expected);
  assert.equal(orderResult.equal, false);
  assert.ok(orderResult.differences.some(item => item.field === 'column'));
});
