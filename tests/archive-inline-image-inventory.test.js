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
  // 2026-10-30 user decision: this test validates defect invariants only. It
  // no longer pins snapshot totals (production/extension/qImage counts) and no
  // longer requires docs/reports/archive-inline-image-inventory-20260915.json to
  // equal the live inventory; that report stays as a historical snapshot, so an
  // exam publish that adds an inline image does not turn CI red without a defect.
  const generated = buildInlineImageInventoryReport();

  assert.equal(generated.testFixtureTotal, 4);
  assert.equal(generated.validation.relativePathInvalidCount, 0);
  assert.equal(generated.validation.errorCount, 0);
  assert.equal(generated.validation.missingProductionAssetCount,
    generated.records.filter(row => !row.testFixture && !row.assetExists).length);
  assert.ok(generated.records.every(row => row.relativePathValid));
  const textbookRows = generated.records.filter(row => row.file.startsWith('textbooks/'));
  assert.ok(textbookRows.length > 0);
  assert.ok(textbookRows.every(row => /^q\d+\.(?:png|jpe?g|webp|svg)$/i.test(row.src) && row.assetExists));
  const knownMissing = JSON.parse(fs.readFileSync(path.join(root, 'archive', 'data', 'inline-image-known-missing-v1.json'), 'utf8'));
  assert.equal(knownMissing.baselineMainSha, '96b40a5039d2457885b35f53e0482f334d110033');
  // Current missing production assets must be a subset (with multiplicity) of
  // the known list. Known entries that were restored are only warnings.
  const knownCounts = new Map();
  const keyOf = ({ file, questionId, src }) => JSON.stringify([file, String(questionId), src]);
  for (const reference of knownMissing.missing) knownCounts.set(keyOf(reference), (knownCounts.get(keyOf(reference)) || 0) + 1);
  const unlisted = [];
  for (const row of generated.records.filter(row => !row.testFixture && !row.assetExists)) {
    const key = keyOf(row);
    const left = knownCounts.get(key) || 0;
    if (left > 0) knownCounts.set(key, left - 1);
    else unlisted.push({ file: row.file, questionId: row.questionId, src: row.src });
  }
  assert.deepEqual(unlisted, [], 'missing production image assets must be listed in inline-image-known-missing-v1.json');
  if (generated.resolvedKnownMissing.length) {
    console.warn(`WARNING inline-image known-missing entries now resolved (owner may remove): ${JSON.stringify(generated.resolvedKnownMissing)}`);
  }
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

  assert.ok(generated.records.filter(record => record.qImagePresent).every(record => record.relativePathValid));

  const check = spawnSync(process.execPath, ['archive/tools/build-inline-image-inventory.mjs', '--check'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(check.status, 0, check.stdout || check.stderr);
});
