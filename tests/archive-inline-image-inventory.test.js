const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');

test('archive/exams inline image inventory covers every content img and validates production asset paths', async () => {
  const { buildInlineImageInventoryReport } = await import('../archive/tools/build-inline-image-inventory.mjs');
  const generated = buildInlineImageInventoryReport();
  const report = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'reports', 'archive-inline-image-inventory-20260915.json'), 'utf8'));
  const { generatedAt: _reportDate, ...reportData } = report;
  const { generatedAt: _generatedDate, ...generatedData } = generated;

  assert.equal(generated.total, 864);
  assert.equal(generated.productionTotal, 860);
  assert.equal(generated.testFixtureTotal, 4);
  assert.deepEqual(generated.extensionCounts, { '.png': 812, '.svg': 52 });
  assert.equal(generated.qImageAndInlineTotal, 36);
  // examData-only sources must be counted even when questionBank is not aliased.
  assert.equal(generated.records.filter(row => row.file === 'original/middle/m2/1final/21_매산중_1학기_기말_중2_수학.js').length, 5);
  assert.equal(generated.records.filter(row => row.file === 'original/middle/m2/1final/22_매산중_1학기_기말_중2_수학.js').length, 5);
  assert.equal(generated.records.filter(row => row.file === 'original/middle/m3/1final/19_가산중_1학기_기말_중3_수학.js').length, 1);
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

  assert.deepEqual(generated.records.filter(record => record.qImagePresent).map(({ file, questionId }) => [file, questionId]), [
    ['original/high/h2/1final/19_강남여고_1학기_기말_고2_수학I.js', 12],
    ['original/high/h2/1final/19_강남여고_1학기_기말_고2_수학I.js', 12],
    ['original/high/h2/1final/19_강남여고_1학기_기말_고2_수학I.js', 20],
    ['original/high/h2/1final/19_강남여고_1학기_기말_고2_수학I.js', 25],
    ['original/high/h2/1mid/19_순천여고_1학기_중간_고2_수학I.js', 7],
    ['original/high/h2/1mid/19_순천여고_1학기_중간_고2_수학I.js', 12],
    ['original/high/h2/1mid/19_순천여고_1학기_중간_고2_수학I.js', 17],
    ['original/high/h2/1mid/19_순천여고_1학기_중간_고2_수학I.js', 20],
    ['original/high/h2/1mid/20_매산고_1학기_중간_고2_수학I.js', 7],
    ['original/high/h2/1mid/20_매산고_1학기_중간_고2_수학I.js', 11],
    ['original/high/h2/1mid/20_매산고_1학기_중간_고2_수학I.js', 15],
    ['original/high/h2/1mid/20_매산여고_1학기_중간_고2_확률과통계.js', 7],
    ['original/high/h2/1mid/20_매산여고_1학기_중간_고2_확률과통계.js', 9],
    ['original/high/h2/1mid/20_매산여고_1학기_중간_고2_확률과통계.js', 10],
    ['original/high/h2/1mid/21_강남여고_1학기_중간_고2_수학I.js', 23],
    ['original/high/h2/1mid/21_강남여고_1학기_중간_고2_수학I.js', 25],
    ['original/high/h2/1mid/21_강남여고_1학기_중간_고2_수학I.js', 26],
    ['original/high/h2/1mid/21_강남여고_1학기_중간_고2_수학I.js', 29],
    ['original/high/h2/1mid/22_제일고_1학기_중간_고2_확률과통계.js', 8],
    ['original/high/h2/1mid/22_제일고_1학기_중간_고2_확률과통계.js', 16],
    ['original/high/h2/1mid/22_제일고_1학기_중간_고2_확률과통계.js', 21],
    ['original/high/h2/1mid/24_순천고_1학기_중간_고2_확률과통계.js', 5],
    ['original/high/h2/1mid/24_순천고_1학기_중간_고2_확률과통계.js', 6],
    ['original/high/h2/1mid/24_팔마고_1학기_중간_고2_수학I.js', 13],
    ['original/high/h2/1mid/24_팔마고_1학기_중간_고2_수학I.js', 18],
    ['original/high/h2/1mid/24_팔마고_1학기_중간_고2_확률과통계.js', 1],
    ['original/high/h2/1mid/24_팔마고_1학기_중간_고2_확률과통계.js', 10],
    ['original/high/h2/1mid/24_팔마고_1학기_중간_고2_확률과통계.js', 17],
    ['original/middle/m3/1final/21_동산중_1학기_기말_중3_기출c.js', 5],
    ['original/middle/m3/1final/21_동산중_1학기_기말_중3_기출c.js', 25],
    ['original/middle/m3/1mid/24_삼산중_1학기_중간_중3_수학.js', 10],
    ['original/middle/m3/1mid/24_삼산중_1학기_중간_중3_수학.js', 18],
    ['original/middle/m3/1mid/24_삼산중_1학기_중간_중3_수학.js', 19],
    ['original/middle/m3/1mid/24_삼산중_1학기_중간_중3_수학.js', 21],
    ['original/middle/m3/1mid/24_삼산중_1학기_중간_중3_수학.js', 22],
    ['test-fixtures/inline-image-readiness.js', 3],
  ]);

  assert.deepEqual(reportData, generatedData);
  const check = spawnSync(process.execPath, ['archive/tools/build-inline-image-inventory.mjs', '--check'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(check.status, 0, check.stdout || check.stderr);
});
