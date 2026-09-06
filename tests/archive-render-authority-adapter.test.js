const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');

test('Archive adapter records opt-in canonical dual-run evidence while retaining legacy render paths', () => {
  assert.match(engine, /src="print-contract\.js\?v=20260906\.2"/);
  assert.match(engine, /src="render-authority\.js\?v=20260906\.3"/);
  assert.match(engine, /canonicalData: \[\]/);
  assert.match(engine, /AppState\.canonicalData = buildArchiveCanonicalData\(sourceArchiveFile\)/);
  assert.match(engine, /renderAuthorityDualRun/);
  assert.match(engine, /prepareArchiveCanonicalContent/);
  assert.match(engine, /prepareArchiveCanonicalSolution/);
  assert.match(engine, /compareAnswerSemantics/);
  assert.match(engine, /data-semantic-content="1"/);
  assert.match(engine, /box\.dataset\.sourceRef = getArchiveQuestionSourceRef/);
  assert.match(engine, /recordArchiveDualRun\(area\)/);
  assert.match(engine, /async function renderExam\(area, data\)/);
  assert.match(engine, /async function renderSol\(area, data\)/);
  assert.match(engine, /injectQrToLastExamPage\(area\);[\s\S]{0,80}injectSubmitQrToLastExamPage\(area\);/);
});

test('Archive golden browser fixture records semantic parity across all three output modes', () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-3-archive-browser-fixture.json'), 'utf8'));
  assert.equal(evidence.kind, 'actual-browser-dual-run');
  assert.equal(evidence.legacyRendererRetained, true);
  assert.deepEqual(evidence.results.map(result => result.mode), ['exam', 'solution', 'answer']);
  assert.ok(evidence.results.every(result => result.dualRunEqual === true && result.renderError === ''));
  assert.deepEqual(evidence.results.map(result => result.pages), [20, 15, 2]);
});
