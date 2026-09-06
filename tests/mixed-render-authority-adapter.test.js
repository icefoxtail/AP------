const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');

test('Mixer adapter dual-runs canonical normalization without changing storage, pack, QPP, or legacy renderer behavior', () => {
  assert.match(html, /src="print-contract\.js\?v=20260906\.2"/);
  assert.match(html, /src="render-authority\.js\?v=20260906\.5"/);
  assert.match(html, /function buildMixedCanonicalData\(\)/);
  assert.match(html, /AppState\.canonicalData = buildMixedCanonicalData\(\)/);
  assert.match(html, /async function recordMixedDualRun\(area\)/);
  assert.match(html, /loadAssessmentPackFallback/);
  assert.match(html, /localStorage\.getItem\('mixedQuestions_' \+ AppState\.key\)/);
  assert.match(html, /return \[4, 6, 8\]\.includes\(parsed\) \? parsed : 4;/);
  assert.match(html, /async function renderExam\(area, data\)/);
  assert.match(html, /resolveSourceRef: \(question, index\)/);
  assert.match(html, /getMixedQuestionIdentity\(q\)/);
  assert.match(html, /compareAnswerSemantics/);
  assert.match(html, /layout-authority\.js\?v=20260906\.3/);
  assert.match(html, /function recordMixedLayoutPromotionGate\(area\)/);
  assert.match(html, /recordMixedLayoutPromotionGate\(area\)/);
});

test('Mixer pack-fallback browser fixture records parity across exam, solution, and answer outputs', () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-4-mixer-browser-fixture.json'), 'utf8'));
  assert.equal(evidence.kind, 'actual-browser-dual-run');
  assert.equal(evidence.source.kind, 'MIXED_PACK');
  assert.equal(evidence.source.packId, 'M3_FINAL_UNIT_POLY_10');
  assert.deepEqual(evidence.results.map(result => result.mode), ['exam', 'solution', 'answer']);
  assert.ok(evidence.results.every(result => result.dualRunEqual === true && result.renderError === ''));
  assert.equal(evidence.results[0].qpp, 4);
});

test('Mixer storage fixture preserves same-id/different-source identity and exercises QPP 4/6/8 with source assets', () => {
  const launcher = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'mixer-render-authority-storage-launcher.html'), 'utf8');
  assert.match(launcher, /mixedQuestions_\$\{key\}/);
  assert.match(launcher, /mixedMeta_\$\{key\}/);
  assert.match(launcher, /same-id-source-a/);
  assert.match(launcher, /same-id-source-b/);
  assert.match(launcher, /problem-image-source/);
  assert.match(launcher, /solution-image-source/);
  assert.match(launcher, /\['4', '6', '8'\]/);
  assert.match(launcher, /requestedMode === 'solution' \? 'sol'/);
  assert.match(launcher, /renderAuthorityDualRun=1/);

  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-4-mixer-browser-fixture.json'), 'utf8'));
  const coverage = evidence.storageSourceCoverage;
  assert.equal(coverage.kind, 'actual-browser-render');
  assert.deepEqual(coverage.observedRuns.map(run => [run.mode, run.qpp]), [['exam', 4], ['solution', 6], ['answer', 8]]);
  assert.deepEqual(coverage.observedRuns.map(run => run.questionCount || run.answerEntryCount), [8, 8, 8]);
  assert.deepEqual(coverage.sourceIdentity, [
    'tests/fixtures/mixer-source-a.js#same-id-source-a',
    'tests/fixtures/mixer-source-b.js#same-id-source-b'
  ]);
  assert.match(coverage.dualRunLimit, /cannot read/);
});
