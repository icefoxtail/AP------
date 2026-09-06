const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../archive/layout-authority.js');

const ref = n => ({ sourceArchiveFile: 'exams/a.js', sourceQuestionUid: `uid-${n}`, sourceQuestionOrdinal: n, sourceQuestionNo: n });
test('Layout core paginates source-agnostic measured blocks and reports overflow evidence', () => {
  const layout = L.paginateRenderableBlocks({ pageGeometry: { usableHeight: 100 }, blocks: [
    { blockId: 'a', measuredHeight: 40 }, { blockId: 'b', measuredHeight: 70 }, { blockId: 'c', measuredHeight: 120 }
  ] });
  assert.deepEqual(layout.pages.map(page => page.map(block => block.blockId)), [['a'], ['b'], ['c']]);
  assert.deepEqual(layout.overflowEvidence.map(item => item.blockId), ['c']);
  assert.doesNotMatch(JSON.stringify(layout), /sourceArchiveFile|recipientId|packetKey/);
});

test('Adapter materialization restores canonical PageMap only after source-agnostic pagination', () => {
  const layout = L.paginateRenderableBlocks({ pageGeometry: { usableHeight: 100 }, blocks: [{ blockId: 'a', measuredHeight: 40 }, { blockId: 'b', measuredHeight: 40 }] });
  const pageMap = L.materializePageMap(layout, {
    a: { sectionId: 's', sourceRef: ref(1), displayNo: 1 }, b: { sectionId: 's', sourceRef: ref(2), displayNo: 2 }
  });
  assert.deepEqual(pageMap.pages[0].displayNos, [1, 2]);
  assert.deepEqual(pageMap.pages[0].questionSourceRefs.map(item => item.sourceQuestionUid), ['uid-1', 'uid-2']);
});
