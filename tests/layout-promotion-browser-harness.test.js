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
  assert.match(harness, /recordArchiveSolutionLayoutPromotionGate/);
  assert.match(harness, /apSolutionLayoutPromotion/);
  assert.match(harness, /modeParam/);
  assert.match(harness, /mode === 'solution'/);
  assert.match(harness, /solution-image-removal/);
  assert.match(harness, /continuation-solution-image-duplication/);
  assert.match(harness, /recordMixedLayoutPromotionGate/);
});

test('solution executor A/B harness compares clean legacy and shared DOM transactions', () => {
  const harness = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'solution-executor-ab-harness.html'), 'utf8');
  assert.match(harness, /solutionAuthority=\$\{authority\}/);
  assert.match(harness, /render-authority-golden\.js/);
  assert.match(harness, /SOLUTION_EXECUTOR_AB_PASS/);
  assert.match(harness, /bodyClientHeight/);
  assert.match(harness, /sourceRef/);
  assert.match(harness, /solutionImage/);
  assert.match(harness, /q5Parity/);
  assert.match(harness, /q6Parity/);
  assert.match(harness, /omissionCount/);
  assert.match(harness, /duplicationCount/);
  assert.match(harness, /RENDER_READY/);
});
