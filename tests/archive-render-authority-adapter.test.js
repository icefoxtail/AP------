const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');

test('Archive adapter records opt-in canonical dual-run evidence while retaining legacy render paths', () => {
  assert.match(engine, /src="print-contract\.js\?v=20260906\.2"/);
  assert.match(engine, /src="render-authority\.js\?v=20260906\.5"/);
  assert.match(engine, /canonicalData: \[\]/);
  assert.match(engine, /AppState\.canonicalData = buildArchiveCanonicalData\(sourceArchiveFile\)/);
  assert.match(engine, /renderAuthorityDualRun/);
  assert.match(engine, /prepareArchiveCanonicalContent/);
  assert.match(engine, /prepareArchiveCanonicalSolution/);
  assert.match(engine, /compareAnswerSemantics/);
  assert.match(engine, /data-semantic-content="1"/);
  assert.match(engine, /box\.dataset\.sourceRef = getArchiveQuestionSourceRef/);
  assert.match(engine, /recordArchiveDualRun\(area\)/);
  assert.match(engine, /layout-authority\.js\?v=20260906\.3/);
  assert.match(engine, /function recordArchiveLayoutPromotionGate\(area\)/);
  assert.match(engine, /recordArchiveLayoutPromotionGate\(area\)/);
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

test('Archive semantic golden fixture verifies table, image, and view-block subset without claiming the full catalog', () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-3-archive-semantic-browser-fixture.json'), 'utf8'));
  assert.equal(evidence.kind, 'actual-browser-dual-run');
  assert.ok(evidence.results.every(result => result.dualRunEqual === true && result.renderError === ''));
  assert.deepEqual(evidence.renderedFixtureIds, ['question-choice-columns', 'question-fullwidth', 'question-table-math', 'question-problem-png', 'question-solution-svg', 'question-long-solution-continuation', 'question-inline-view-word', 'question-standalone-view-label']);
  assert.equal(evidence.results[0].tableCount, 1);
  assert.equal(evidence.results[0].problemImageCount, 1);
  assert.equal(evidence.results[1].solutionImageCount, 1);
  assert.deepEqual(evidence.longSolutionContinuation.renderedPages, [2, 3]);
  assert.equal(evidence.longSolutionContinuation.continuationTextRange.at(-1), 72);
  assert.match(evidence.longSolutionContinuation.promotionLimit, /not be read as PageMap promotion/);
});
