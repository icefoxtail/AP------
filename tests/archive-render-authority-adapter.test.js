const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const engine = fs.readFileSync(path.join(__dirname, '..', 'archive', 'engine.html'), 'utf8');

test('Archive adapter records opt-in canonical dual-run evidence while retaining legacy render paths', () => {
  assert.match(engine, /src="print-contract\.js\?v=20260906\.2"/);
  assert.match(engine, /src="render-authority\.js\?v=20260906\.1"/);
  assert.match(engine, /canonicalData: \[\]/);
  assert.match(engine, /AppState\.canonicalData = buildArchiveCanonicalData\(sourceArchiveFile\)/);
  assert.match(engine, /renderAuthorityDualRun/);
  assert.match(engine, /recordArchiveDualRun\(area\)/);
  assert.match(engine, /async function renderExam\(area, data\)/);
  assert.match(engine, /async function renderSol\(area, data\)/);
  assert.match(engine, /injectQrToLastExamPage\(area\);[\s\S]{0,80}injectSubmitQrToLastExamPage\(area\);/);
});
