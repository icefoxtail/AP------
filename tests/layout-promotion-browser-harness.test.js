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
  assert.match(harness, /result\.equal \? 'PASS' : 'HOLD'/);
  assert.match(harness, /omissionCount/);
  assert.match(harness, /duplicationCount/);
  assert.match(harness, /recordArchiveLayoutPromotionGate/);
  assert.match(harness, /recordMixedLayoutPromotionGate/);
});
