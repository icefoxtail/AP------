const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');

test('archive/exams inline image inventory covers every content img and validates production asset paths', async () => {
  const { buildInlineImageInventoryReport } = await import('../archive/tools/build-inline-image-inventory.mjs');
  const generated = buildInlineImageInventoryReport();
  const report = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'reports', 'archive-inline-image-inventory-20260915.json'), 'utf8'));
  const { generatedAt: _reportDate, ...reportData } = report;
  const { generatedAt: _generatedDate, ...generatedData } = generated;

  assert.equal(generated.total, 46);
  assert.equal(generated.productionTotal, 42);
  assert.equal(generated.testFixtureTotal, 4);
  assert.deepEqual(generated.extensionCounts, { '.png': 45, '.svg': 1 });
  assert.equal(generated.qImageAndInlineTotal, 1);
  assert.deepEqual(generated.validation, {
    relativePathInvalidCount: 0,
    missingProductionAssetCount: 0,
    errorCount: 0
  });
  assert.ok(generated.records.every(row => row.relativePathValid && row.src.startsWith('assets/images/')));
  assert.ok(generated.records.filter(row => !row.testFixture).every(row => row.assetExists));
  assert.equal(generated.records.filter(row => row.testFixture && !row.assetExists).length, 1,
    'the single missing image remains isolated to the intentional readiness test fixture');

  const q9 = generated.records.find(row => row.file === 'original/high/h2/2mid/25_제일고_2학기_중간_고2_수학II.js' && row.questionId === 9);
  assert.deepEqual(q9, { file: 'original/high/h2/2mid/25_제일고_2학기_중간_고2_수학II.js', questionId: 9, sourceOrdinal: 9,
    src: 'assets/images/25_제일고_2학기_중간_고2_수학II/q9.png', extension: '.png', qImagePresent: false,
    contentInlineImage: true, testFixture: false, relativePathValid: true, assetExists: true });

  for (const questionId of [12, 16, 20, 23]) {
    const row = generated.records.find(record => record.file === 'original/high/h2/1mid/24_순천여고_1학기_중간_고2_확률과통계.js'
      && record.questionId === questionId);
    assert.equal(row?.src, `assets/images/24_순천여고_1학기_중간_고2_확률과통계/q${questionId}.png`);
    assert.equal(row?.assetExists, true);
  }

  assert.deepEqual(reportData, generatedData);
  const check = spawnSync(process.execPath, ['archive/tools/build-inline-image-inventory.mjs', '--check'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(check.status, 0, check.stdout || check.stderr);
});
