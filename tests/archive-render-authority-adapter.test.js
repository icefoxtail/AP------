const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
const layout = fs.readFileSync(path.join(root, 'archive', 'layout-authority.js'), 'utf8');
const solutionExecutor = fs.readFileSync(path.join(root, 'archive', 'solution-render-executor.js'), 'utf8');
const answerExecutor = fs.readFileSync(path.join(root, 'archive', 'answer-render-executor.js'), 'utf8');
const examExecutor = fs.readFileSync(path.join(root, 'archive', 'exam-render-executor.js'), 'utf8');

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
  assert.match(engine, /layout-authority\.js\?v=20260906\.25/);
  assert.match(engine, /solution-render-executor\.js\?v=20260907\.1/);
  assert.match(engine, /answer-render-executor\.js\?v=20260907\.1/);
  assert.match(engine, /exam-render-executor\.js\?v=20260907\.1/);
  assert.match(engine, /function recordArchiveLayoutPromotionGate\(area\)/);
  assert.match(engine, /recordArchiveLayoutPromotionGate\(area\)/);
  assert.match(engine, /function recordArchiveSolutionLayoutPromotionGate\(area\)/);
  assert.match(engine, /recordArchiveSolutionLayoutPromotionGate\(area\)/);
  assert.match(engine, /layoutMeasurementLedger/);
  assert.match(engine, /RENDER_INCOMPLETE/);
  assert.match(engine, /expectedQuestionCount/);
  assert.match(engine, /observedQuestionCount/);
  assert.match(engine, /proxyHeight_raw/);
  assert.match(engine, /proxyHeight_tight/);
  assert.match(engine, /renderSharedLayoutWitness/);
  assert.match(engine, /inspectRenderedOverflow/);
  assert.match(engine, /inspectRenderedLayoutGeometry/);
  assert.match(engine, /renderGeometry: comparison\.parity\.renderGeometry/);
  assert.match(engine, /legacyGeometry: observed\.renderedGeometry/);
  assert.match(layout, /const legacyPages = Array\.from\(area\.querySelectorAll\('\.page'\)\)/);
  assert.match(layout, /legacyPages\[pageLayout\.pageNo - 1\]/);
  assert.match(layout, /pageHasSlotRows/);
  assert.match(layout, /spacer\.dataset\.layoutSpacer/);
  assert.match(engine, /async function renderExam\(area, data\)/);
  assert.match(engine, /async function renderSol\(area, data\)/);
  assert.match(engine, /async function renderSolLegacy\(area, data\)/);
  assert.match(engine, /async function renderExamLegacy\(area, data\)/);
  assert.match(engine, /APExamRenderExecutor\.render\(\{ area, data, deps: archiveExamDeps \}\)/);
  assert.match(engine, /examAuthority/);
  assert.match(engine, /function renderAnsLegacy\(area, data, perPage = 40\)/);
  assert.match(engine, /APAnswerRenderExecutor\.render\(\{ area, data, perPage, deps: archiveAnswerDeps \}\)/);
  assert.match(engine, /const authority = requestedAuthority \|\| 'shared'/);
  assert.match(engine, /APSolutionRenderExecutor\.render\(\{ area, data, deps: archiveSolutionDeps \}\)/);
  assert.match(engine, /const authority = requestedAuthority \|\| 'shared'/);
  assert.match(engine, /solutionAuthority/);
  assert.match(engine, /injectQrToLastExamPage\(area\);[\s\S]{0,80}injectSubmitQrToLastExamPage\(area\);/);
});

test('Archive solution executor is a DOM transaction module with injected engine dependencies', () => {
  assert.match(solutionExecutor, /APSolutionRenderExecutor/);
  assert.match(solutionExecutor, /async function render\(\{ area, data, deps \}\)/);
  assert.match(solutionExecutor, /solution-split-staging/);
  assert.match(solutionExecutor, /solution-split-chunk/);
  assert.match(solutionExecutor, /autoCompress\(box\)/);
  assert.match(solutionExecutor, /makeLongSolutionShell\(sourceBox, qNo, true\)/);
  assert.match(solutionExecutor, /solutionImageHtml/);
  assert.doesNotMatch(solutionExecutor, /planLegacySolutionLayout|buildExpectedLayoutMaps/,
    'shared executor must execute the extracted DOM algorithm, not consume planner output');
  const api = require('../archive/solution-render-executor.js');
  assert.equal(typeof api.render, 'function');
});

test('Phase A report uses legacy/shared executor A/B as the authority gate', () => {
  const report = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-a-solution-layout-bridge.json'), 'utf8'));
  assert.equal(report.status, 'PASS');
  assert.equal(report.implementation, 'archive/solution-render-executor.js');
  assert.equal(report.browserEvidence.kind, 'actual-browser-legacy-vs-shared-executor-ab');
  assert.equal(report.productionAuthority, 'shared Solution Executor by default; legacy renderSolLegacy retained as explicit rollback/debug path');
  assert.equal(report.extraction.numericPlanner, 'diagnostic/historical sidecar only; not an authority or promotion gate');
  assert.deepEqual(report.browserEvidence.differenceFields, []);
});

test('Archive answer executor is a mechanical DOM extraction with explicit legacy rollback', () => {
  assert.match(answerExecutor, /APAnswerRenderExecutor/);
  assert.match(answerExecutor, /function render\(\{ area, data, perPage = 40, deps \}\)/);
  assert.match(answerExecutor, /ans-cell-empty/);
  assert.match(answerExecutor, /splitIndex/);
  assert.match(answerExecutor, /group-end/);
  const api = require('../archive/answer-render-executor.js');
  assert.equal(typeof api.render, 'function');
});

test('Archive exam executor is a mechanical DOM extraction with explicit legacy rollback', () => {
  assert.match(examExecutor, /APExamRenderExecutor/);
  assert.match(examExecutor, /async function render\(\{ area, data, deps \}\)/);
  assert.match(examExecutor, /subjective-2up/);
  assert.match(examExecutor, /subjective-4up/);
  assert.match(examExecutor, /fitQuestionBox/);
  assert.match(examExecutor, /renderQuestionImageHTML/);
  assert.match(examExecutor, /renderChoicesHTML/);
  const api = require('../archive/exam-render-executor.js');
  assert.equal(typeof api.render, 'function');
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
