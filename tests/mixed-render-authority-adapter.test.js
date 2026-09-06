const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');

test('Mixer adapter dual-runs canonical normalization without changing storage, pack, QPP, or legacy renderer behavior', () => {
  assert.match(html, /src="print-contract\.js\?v=20260906\.2"/);
  assert.match(html, /src="render-authority\.js\?v=20260906\.3"/);
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
