const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

test('layout promotion browser harness reuses real Archive/Mixer fixtures and reports gate evidence without changing render output', () => {
  const harness = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'layout-promotion-harness.html'), 'utf8');
  assert.match(harness, /render-authority-golden\.js/);
  assert.match(harness, /mixer-render-authority-storage-launcher\.html/);
  assert.match(harness, /apLayoutAuthorityDualRun/);
  assert.match(harness, /result\.equal && mutationFailures\.length === 0 \? 'PASS' : 'HOLD'/);
  assert.match(harness, /omissionCount/);
  assert.match(harness, /duplicationCount/);
  assert.match(harness, /\['4', '6', '8'\]/);
  assert.match(harness, /page2-header-injection/);
  assert.match(harness, /page1-header-removal/);
  assert.match(harness, /empty-spacer-removal/);
  assert.match(harness, /slot-flex-span-mutation/);
  assert.match(harness, /body-height-boundary/);
  assert.match(harness, /mutationParity/);
  assert.match(harness, /differenceFields: result\.differences/);
  assert.match(harness, /parity: result\.parity/);
  assert.match(harness, /recordArchiveLayoutPromotionGate/);
  assert.match(harness, /recordMixedLayoutPromotionGate/);
});
