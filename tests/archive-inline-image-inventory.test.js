const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');

test('archive/exams questionBank inline image inventory validates production image references', async () => {
  // Original exams use the student-facing assets/images contract. Textbook
  // source folders keep qNN image files beside their source JS.
  const { buildInlineImageInventoryReport } = await import('../archive/tools/build-inline-image-inventory.mjs');
  const generated = buildInlineImageInventoryReport();
  const report = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'reports', 'archive-inline-image-inventory-20260915.json'), 'utf8'));
  const { generatedAt: _reportDate, ...reportData } = report;
  const { generatedAt: _generatedDate, ...generatedData } = generated;

  assert.equal(generated.total, 1603);
  assert.equal(generated.productionTotal, 1599);
  assert.equal(generated.testFixtureTotal, 4);
  assert.deepEqual(generated.extensionCounts, { '.png': 1533, '.svg': 70 });
  assert.equal(generated.qImageAndInlineTotal, 258);
  assert.deepEqual(generated.validation, {
    relativePathInvalidCount: 0,
    missingProductionAssetCount: 238,
    errorCount: 0
  });
  assert.ok(generated.records.every(row => row.relativePathValid));
  const textbookRows = generated.records.filter(row => row.file.startsWith('textbooks/'));
  assert.ok(textbookRows.length > 0);
  assert.ok(textbookRows.every(row => /^q\d+\.(?:png|jpe?g|webp|svg)$/i.test(row.src) && row.assetExists));
  const knownMissing = JSON.parse(fs.readFileSync(path.join(root, 'archive', 'data', 'inline-image-known-missing-v1.json'), 'utf8'));
  assert.equal(knownMissing.baselineMainSha, '96b40a5039d2457885b35f53e0482f334d110033');
  assert.deepEqual(generated.records.filter(row => !row.testFixture && !row.assetExists)
    .map(({ file, questionId, src }) => ({ file, questionId, src })), knownMissing.missing);
  assert.ok(generated.records.filter(row => !row.testFixture && row.assetExists).every(row => row.relativePathValid));
  assert.equal(generated.records.filter(row => row.testFixture && !row.assetExists).length, 1,
    'the single missing image remains isolated to the intentional readiness test fixture');

  const q9 = generated.records.find(row => row.file === 'original/high/h2/2mid/25_제일고_2학기_중간_고2_수학II.js' && row.questionId === 9);
  assert.deepEqual(q9, { file: 'original/high/h2/2mid/25_제일고_2학기_중간_고2_수학II.js', questionId: 9, sourceOrdinal: 9,
    src: 'assets/images/25_제일고_2학기_중간_고2_수학II/q9.png', extension: '.png', qImagePresent: false,
    contentInlineImage: true, testFixture: false, relativePathValid: true, assetExists: true });

  const correctedExamPath = 'original/high/h2/1mid/24_순천여고_1학기_중간_고2_확률과통계.js';
  const correctedWindow = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'archive', 'exams', correctedExamPath), 'utf8'),
    { window: correctedWindow }, { filename: correctedExamPath, timeout: 5000 });
  for (const questionId of [12, 16, 20, 23]) {
    const question = correctedWindow.questionBank.find(row => row.id === questionId);
    const expectedImage = `assets/images/24_순천여고_1학기_중간_고2_확률과통계/q${questionId}_source-correction.png`;
    assert.equal(question?.image, expectedImage, `q${questionId} keeps its source-corrected question image`);
    assert.equal(/<img\b/i.test(question?.content || ''), false,
      `q${questionId} uses the image field instead of duplicating it in inline content`);
    assert.equal(fs.existsSync(path.join(root, 'archive', expectedImage)), true,
      `q${questionId} source-corrected image exists`);
  }

  const q8 = generated.records.find(record => record.file === 'original/high/h2/1mid/24_순천고_1학기_중간_고2_확률과통계.js'
    && record.questionId === 8);
  assert.equal(q8?.src, 'assets/images/24_순천고_1학기_중간_고2_확률과통계/q08-source-correction.png');
  assert.equal(q8?.assetExists, true);

  const qImageRecords = generated.records.filter(record => record.qImagePresent);
  assert.equal(qImageRecords.length, 258);
  assert.ok(qImageRecords.every(record => record.relativePathValid));

  assert.deepEqual(reportData, generatedData);
  const check = spawnSync(process.execPath, ['archive/tools/build-inline-image-inventory.mjs', '--check'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(check.status, 0, check.stdout || check.stderr);
});
