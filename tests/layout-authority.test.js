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
  assert.deepEqual({ columnNo: subj2.columnNo, rowStart: subj2.slotRowStart, rows: subj2.slotSpanRows, kind: subj2.placementKind }, { columnNo: 2, rowStart: 0, rows: 2, kind: 'subjective-2up' });
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
  const expectedBase = L.buildExpectedLayoutMaps({ pageGeometry: { usableHeight: 100, columns: 2, qpp: 4 }, blocks: [
    { blockId: 'a', questionKey: 'q1', measuredHeight: 20 },
    { blockId: 'b', questionKey: 'q2', measuredHeight: 20 },
    { blockId: 'b-cont', questionKey: 'q2', measuredHeight: 10, continuationOf: 'b' },
    { blockId: 'wide', questionKey: 'q3', measuredHeight: 30, layoutTag: 'fullwidth' }
  ] }, records, { sectionId: 'exam' });
  const geometryEvidence = { pages: expectedBase.layout.pages.map((page, index) => ({
    pageNo: index + 1,
    isBlank: page.isBlank,
    hasExamFrame: true,
    hasHeader: index === 0,
    bodyClientHeight: 900,
    columns: page.columns.map(column => ({ columnNo: column.columnNo, childFlexSignature: [] }))
  })) };
  const expected = { ...expectedBase, renderedGeometry: geometryEvidence };
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
  const observed = { ...L.materializeLegacyLayoutMaps(observedInput, records, { sectionId: 'exam' }), renderedGeometry: structuredClone(geometryEvidence) };
  assert.equal(L.comparePromotionLayouts(observed, expected).equal, true);

  const geometryMutation = { ...observed, renderedGeometry: structuredClone(geometryEvidence) };
  geometryMutation.renderedGeometry.pages[0].hasHeader = false;
  const geometryResult = L.comparePromotionLayouts(geometryMutation, expected);
  assert.equal(geometryResult.equal, false);
  assert.equal(geometryResult.parity.renderGeometry, false);
  assert.equal(geometryResult.parity.overflow, true);

  const columnMutation = structuredClone(observedInput);
  columnMutation.pages[0].columns[0].items[0].columnNo = 2;
  assert.equal(L.comparePromotionLayouts({ ...L.materializeLegacyLayoutMaps(columnMutation, records, { sectionId: 'exam' }), renderedGeometry: structuredClone(geometryEvidence) }, expected).equal, false);

  const continuationMutation = structuredClone(observedInput);
  const continuation = continuationMutation.pages.flatMap(page => page.columns.flatMap(column => column.items)).find(item => item.blockId === 'b-cont');
  continuation.continuationOf = '';
  const continuationResult = L.comparePromotionLayouts({ ...L.materializeLegacyLayoutMaps(continuationMutation, records, { sectionId: 'exam' }), renderedGeometry: structuredClone(geometryEvidence) }, expected);
  assert.equal(continuationResult.equal, false);
  assert.ok(continuationResult.differences.some(item => item.field === 'continuation' || item.field === 'duplication'));

  const orderMutation = structuredClone(observedInput);
  const orderedColumn = orderMutation.pages.flatMap(page => page.columns).find(column => column.items.length >= 2);
  const firstOrder = orderedColumn.items[0].columnOrder;
  orderedColumn.items[0].columnOrder = orderedColumn.items[1].columnOrder;
  orderedColumn.items[1].columnOrder = firstOrder;
  const orderResult = L.comparePromotionLayouts({ ...L.materializeLegacyLayoutMaps(orderMutation, records, { sectionId: 'exam' }), renderedGeometry: structuredClone(geometryEvidence) }, expected);
  assert.equal(orderResult.equal, false);
  assert.ok(orderResult.differences.some(item => item.field === 'column'));

  const sameColumnSwap = structuredClone(observedInput);
  const swappableColumn = sameColumnSwap.pages.flatMap(page => page.columns).find(column => column.items.length >= 2);
  [swappableColumn.items[0], swappableColumn.items[1]] = [swappableColumn.items[1], swappableColumn.items[0]];
  const swapResult = L.comparePromotionLayouts({ ...L.materializeLegacyLayoutMaps(sameColumnSwap, records, { sectionId: 'exam' }), renderedGeometry: structuredClone(geometryEvidence) }, expected);
  assert.equal(swapResult.equal, false);
  assert.ok(swapResult.differences.some(item => item.field === 'column'));
});

test('Clinic composition planner rejects recipient/source/duplex boundary mutations without collapsing review sections', () => {
  const plan = L.planClinicComposition({
    review: true,
    duplex: true,
    recipients: [
      { recipientId: 'student:0:A', sourceRefs: ['a#1', 'a#2'] },
      { recipientId: 'student:1:B', sourceRefs: ['b#1'] }
    ]
  });
  const observed = { pages: [
    { recipientId: 'student:0:A', sectionId: 'student:0:A:answer', sourceRefs: ['a#1', 'a#2'], hasQr: false },
    { recipientId: 'student:0:A', sectionId: 'student:0:A:solution', sourceRefs: [], hasQr: false },
    { recipientId: 'student:0:A', sectionId: 'student:0:A:solution', sourceRefs: ['a#1', 'a#2'], hasQr: false },
    { recipientId: 'student:0:A', sectionId: '__blank__', sourceRefs: [], hasQr: false, isBlank: true },
    { recipientId: 'student:1:B', sectionId: 'student:1:B:answer', sourceRefs: ['b#1'], hasQr: false },
    { recipientId: 'student:1:B', sectionId: 'student:1:B:solution', sourceRefs: ['b#1'], hasQr: false }
  ] };
  assert.equal(L.compareClinicComposition(observed, plan).equal, true);

  const recipientMutation = structuredClone(observed);
  recipientMutation.pages[4].recipientId = 'student:0:A';
  assert.equal(L.compareClinicComposition(recipientMutation, plan).equal, false);

  const sequenceMutation = structuredClone(observed);
  [sequenceMutation.pages[0], sequenceMutation.pages[1]] = [sequenceMutation.pages[1], sequenceMutation.pages[0]];
  const sequenceResult = L.compareClinicComposition(sequenceMutation, plan);
  assert.equal(sequenceResult.equal, false);
  assert.ok(sequenceResult.differences.some(item => item.field === 'sectionSequence'));

  const sourceMutation = structuredClone(observed);
  sourceMutation.pages[5].sourceRefs = ['a#1'];
  const sourceResult = L.compareClinicComposition(sourceMutation, plan);
  assert.equal(sourceResult.equal, false);
  assert.ok(sourceResult.differences.some(item => item.field === 'sourceIdentity' || item.field === 'omission'));

  const duplexMutation = structuredClone(observed);
  duplexMutation.pages.splice(3, 1);
  assert.equal(L.compareClinicComposition(duplexMutation, plan).equal, false);

  const duplicateMutation = structuredClone(observed);
  duplicateMutation.pages[0].sourceRefs.push('a#1');
  const duplicateResult = L.compareClinicComposition(duplicateMutation, plan);
  assert.equal(duplicateResult.equal, false);
  assert.equal(duplicateResult.duplicationCount, 1);

  const qrPlan = L.planClinicComposition({ review: false, duplex: false, recipients: [{
    recipientId: 'class-recipient:0:A', sourceRefs: ['q#1'], requireQr: true, qrTargetKey: 'packet:packet-a', renderMode: 'exam'
  }] });
  const qrObserved = { pages: [{ recipientId: 'class-recipient:0:A', sectionId: 'class-recipient:0:A:exam', sourceRefs: ['q#1'], hasQr: true, qrTargetKey: 'packet:packet-a' }] };
  assert.equal(L.compareClinicComposition(qrObserved, qrPlan).equal, true);
  const qrTargetMutation = structuredClone(qrObserved);
  qrTargetMutation.pages[0].qrTargetKey = 'packet:packet-b';
  assert.equal(L.compareClinicComposition(qrTargetMutation, qrPlan).equal, false);
  const qrPlacementMutation = structuredClone(qrObserved);
  qrPlacementMutation.pages.unshift({ recipientId: 'class-recipient:0:A', sectionId: 'class-recipient:0:A:exam', sourceRefs: [], hasQr: true, qrTargetKey: 'packet:packet-a' });
  qrPlacementMutation.pages[1].hasQr = false;
  assert.equal(L.compareClinicComposition(qrPlacementMutation, qrPlan).equal, false);
});

test('rendered geometry comparator rejects header, spacer, slot-flex, and body-height mutations', () => {
  const base = {
    pages: [
      { pageNo: 1, isBlank: false, hasExamFrame: true, hasHeader: true, bodyClientHeight: 900, columns: [
        { columnNo: 1, childFlexSignature: ['QUESTION:a#1:flex:1', 'SPACER:1'] },
        { columnNo: 2, childFlexSignature: ['QUESTION:b#1:flex:2'] }
      ] },
      { pageNo: 2, isBlank: false, hasExamFrame: true, hasHeader: false, bodyClientHeight: 936, columns: [
        { columnNo: 1, childFlexSignature: ['QUESTION:c#1:flex:1'] },
        { columnNo: 2, childFlexSignature: [] }
      ] }
    ]
  };
  assert.equal(L.compareRenderedLayoutGeometry(base, structuredClone(base), 1).equal, true);

  const headerMutation = structuredClone(base);
  headerMutation.pages[1].hasHeader = true;
  assert.equal(L.compareRenderedLayoutGeometry(headerMutation, base, 1).equal, false);

  const pageNumberMutation = structuredClone(base);
  pageNumberMutation.pages[1].pageNo = 3;
  assert.equal(L.compareRenderedLayoutGeometry(pageNumberMutation, base, 1).equal, false);

  const columnNumberMutation = structuredClone(base);
  columnNumberMutation.pages[0].columns[1].columnNo = 3;
  assert.equal(L.compareRenderedLayoutGeometry(columnNumberMutation, base, 1).equal, false);

  const firstHeaderMutation = structuredClone(base);
  firstHeaderMutation.pages[0].hasHeader = false;
  assert.equal(L.compareRenderedLayoutGeometry(firstHeaderMutation, base, 1).equal, false);

  const spacerMutation = structuredClone(base);
  spacerMutation.pages[0].columns[0].childFlexSignature.splice(1, 1);
  const spacerResult = L.compareRenderedLayoutGeometry(spacerMutation, base, 1);
  assert.equal(spacerResult.equal, false);
  assert.ok(spacerResult.differences.some(item => item.field === 'renderGeometry.childFlexSignature'));

  const flexMutation = structuredClone(base);
  flexMutation.pages[0].columns[1].childFlexSignature[0] = 'QUESTION:b#1:flex:1';
  assert.equal(L.compareRenderedLayoutGeometry(flexMutation, base, 1).equal, false);

  const heightMutation = structuredClone(base);
  heightMutation.pages[1].bodyClientHeight += 2;
  assert.equal(L.compareRenderedLayoutGeometry(heightMutation, base, 1).equal, false);

  assert.equal(L.compareRenderedLayoutGeometry(undefined, undefined, 1).equal, false);
});

test('solution layout bridge preserves continuation identity and rejects solution placement mutations', () => {
  const ref = n => ({ sourceArchiveFile: 'exams/solution.js', sourceQuestionUid: `solution-${n}`, sourceQuestionOrdinal: n, sourceQuestionNo: n });
  const records = {
    s1: { sectionId: 'archive:solution', sourceRef: ref(1), displayNo: 1 },
    s1c: { sectionId: 'archive:solution', sourceRef: ref(1), displayNo: 1 },
    s2: { sectionId: 'archive:solution', sourceRef: ref(2), displayNo: 2 }
  };
  const placements = [
    { blockId: 's1', questionKey: 'q1', pageNo: 1, columnNo: 1, columnOrder: 0, placementOrder: 0, measurements: { raw: 40, tight: 36 }, measuredHeight: 40 },
    { blockId: 's1c', questionKey: 'q1', pageNo: 2, columnNo: 1, columnOrder: 0, placementOrder: 1, continuationOf: 's1', measurements: { raw: 80, tight: 72 }, measuredHeight: 80 },
    { blockId: 's2', questionKey: 'q2', pageNo: 1, columnNo: 2, columnOrder: 0, placementOrder: 2, measurements: { raw: 42, tight: 38 }, measuredHeight: 42 }
  ];
  const expected = L.buildExpectedLayoutMaps({
    planner: 'LEGACY_SOLUTION_LEDGER_POLICY',
    pageGeometry: { usableHeight: 100, columns: 2, planner: 'LEGACY_SOLUTION_LEDGER_POLICY' },
    placements
  }, records, { sectionId: 'archive:solution' });
  assert.deepEqual(expected.layout.pages.map(page => page.pageNo), [1, 2]);
  assert.deepEqual(expected.layout.continuationMap.map(item => [item.continuationBlockId, item.sourceBlockId]), [['s1c', 's1']]);

  const observedInput = {
    qpp: null,
    pages: expected.layout.pages.map(page => ({
      pageNo: page.pageNo,
      isBlank: false,
      columns: page.columns.map(column => ({ columnNo: column.columnNo, items: column.items.map(item => ({ ...item })) }))
    }))
  };
  const geometry = { pages: [1, 2].map(pageNo => ({ pageNo, isBlank: false, hasExamFrame: false, hasHeader: true, hasPageNumber: true, bodyClientHeight: 900, columns: [{ columnNo: 1, childFlexSignature: [] }, { columnNo: 2, childFlexSignature: [] }] })) };
  const observed = { ...L.materializeLegacyLayoutMaps(observedInput, records, { sectionId: 'archive:solution' }), renderedGeometry: structuredClone(geometry) };
  const expectedWithGeometry = { ...expected, renderedGeometry: structuredClone(geometry) };
  assert.equal(L.comparePromotionLayouts(observed, expectedWithGeometry).equal, true);

  const continuationMutation = structuredClone(observedInput);
  continuationMutation.pages[1].columns[0].items[0].continuationOf = '';
  assert.equal(L.comparePromotionLayouts({ ...L.materializeLegacyLayoutMaps(continuationMutation, records, { sectionId: 'archive:solution' }), renderedGeometry: structuredClone(geometry) }, expectedWithGeometry).equal, false);

  const columnMutation = structuredClone(observedInput);
  columnMutation.pages[0].columns[1].items[0].columnNo = 1;
  assert.equal(L.comparePromotionLayouts({ ...L.materializeLegacyLayoutMaps(columnMutation, records, { sectionId: 'archive:solution' }), renderedGeometry: structuredClone(geometry) }, expectedWithGeometry).equal, false);

  const omissionMutation = structuredClone(observedInput);
  omissionMutation.pages[0].columns[0].items = [];
  const omissionResult = L.comparePromotionLayouts({ ...L.materializeLegacyLayoutMaps(omissionMutation, records, { sectionId: 'archive:solution' }), renderedGeometry: structuredClone(geometry) }, expectedWithGeometry);
  assert.equal(omissionResult.equal, false);
  assert.ok(omissionResult.parity.omissionCount > 0);

  const duplicateMutation = structuredClone(observedInput);
  duplicateMutation.pages[0].columns[0].items.push({ ...duplicateMutation.pages[0].columns[0].items[0], blockId: 's1-duplicate', questionKey: 'q1', placementOrder: 99 });
  const duplicateResult = L.comparePromotionLayouts({ ...L.materializeLegacyLayoutMaps(duplicateMutation, { ...records, 's1-duplicate': records.s1 }, { sectionId: 'archive:solution' }), renderedGeometry: structuredClone(geometry) }, expectedWithGeometry);
  assert.equal(duplicateResult.equal, false);

  assert.equal(L.comparePromotionLayouts({ ...observed, renderedGeometry: undefined }, expectedWithGeometry).equal, false);
});
