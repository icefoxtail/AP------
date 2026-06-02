const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mvpPath = path.join(root, 'archive', 'assessment', 'assessment-mvp.html');
const analysisPath = path.join(root, 'archive', 'assessment', 'assessment-analysis.html');
const omrPath = path.join(root, 'apmath', 'js', 'qr-omr.js');

const mvpHtml = fs.readFileSync(mvpPath, 'utf8');
const analysisHtml = fs.readFileSync(analysisPath, 'utf8');
const omrJs = fs.readFileSync(omrPath, 'utf8');

function includesAll(label, source, markers) {
  for (const marker of markers) {
    assert(source.includes(marker), `${label} should include ${marker}`);
  }
}

includesAll('assessment-mvp.html diagnostic start flow', mvpHtml, [
  'isDiagnosticAssessmentPack(pack)',
  'data-action="diagnostic-start"',
  '진단평가 출제',
  'startDiagnosticAssessment(pack)',
  'createDiagnosticAssessmentDraft(pack)',
  'apms.diagnostic.assessment.result.',
  'apms.diagnostic.assessment.results',
  'apms.diagnostic.assessment.current',
  'status: \'input_pending\'',
  'mode: \'diagnostic\'',
  'source: \'assessment_mvp\'',
  'Array.isArray(pack.questions) && pack.questions.length > 0',
  'questionCount 0 fallback 금지',
  'mode=diagnostic-input',
]);

assert(!mvpHtml.includes('openDiagnosticAssessmentOmr'), 'assessment-mvp.html should not call an OMR wrapper for diagnostic assessment');

assert(
  mvpHtml.includes('pack.category === \'진단평가\'') ||
  mvpHtml.includes('pack.title || \'\').includes(\'진단평가\'') ||
  mvpHtml.includes('pack.id || \'\').startsWith(\'DIAG_\''),
  'assessment-mvp.html should identify diagnostic packs from existing generated pack metadata'
);

includesAll('assessment-analysis.html diagnostic input/report mode', analysisHtml, [
  'const DIAGNOSTIC_RESULT_PREFIX = \'apms.diagnostic.assessment.result.\';',
  'const DIAGNOSTIC_RESULTS_LIST_KEY = \'apms.diagnostic.assessment.results\';',
  'const DIAGNOSTIC_CURRENT_KEY = \'apms.diagnostic.assessment.current\';',
  'getDiagnosticId()',
  'getPageMode()',
  'isDiagnosticMode()',
  'loadDiagnosticPayload()',
  'applyDiagnosticPayloadToRows(payload)',
  'saveDiagnosticResultAndShowReport()',
  'startDiagnosticReportEdit()',
  'shouldShowDiagnosticInput()',
  'renderDiagnosticReportActions()',
  'mode=diagnostic-report',
  'diagnostic-input',
  'diagnostic-report',
  'status: \'completed\'',
  'completedAt',
  'renderDiagnosticModeBanner()',
  'renderDiagnosticParentItemTable()',
  'renderDiagnosticInternalDetails()',
  'renderDiagnosticAnalysisSections()',
  'toggleDiagnosticInternalDetails()',
  'diagnosticInternalOpen: false',
  'diagnostic-parent-result-table',
  'diagnostic-internal-detail',
  'internal-only',
  'print-hidden',
  'AP수학 진단평가',
  '입력 완료',
  '빠른 입력',
  '입력 수정',
  'window.print()',
]);

assert(
  analysisHtml.includes('saveDiagnosticResultAndShowReport()') &&
  !analysisHtml.includes('결과표 보기</button>'),
  'diagnostic flow should complete input and show the report immediately without a required separate result-view button'
);

assert(
  analysisHtml.includes('const completedAt = new Date().toISOString()') &&
    analysisHtml.includes('updatedAt: completedAt') &&
    analysisHtml.includes('completedAt,') &&
    analysisHtml.includes('completedAt: payload.completedAt'),
  'diagnostic completion should save completedAt/updatedAt and keep completedAt in the results list'
);

const updateDiagnosticListFnStart = analysisHtml.indexOf('function updateDiagnosticResultsList(payload)');
const updateDiagnosticListFnBody = updateDiagnosticListFnStart >= 0 ? analysisHtml.slice(updateDiagnosticListFnStart, analysisHtml.indexOf('function saveDiagnosticResultAndShowReport()', updateDiagnosticListFnStart)) : '';
assert(updateDiagnosticListFnBody.includes('filter((item) => item?.diagnosticId !== payload.diagnosticId)'), 'diagnostic results list should upsert without duplicate diagnosticId');
assert(updateDiagnosticListFnBody.includes('list.slice(0, 30)'), 'diagnostic results list should stay capped at 30 items');

assert(!omrJs.includes('openDiagnosticAssessmentOmr'), 'qr-omr.js should not keep the unused diagnostic OMR wrapper');
assert(!omrJs.includes('apms.diagnostic.assessment.result.'), 'qr-omr.js should not own diagnostic assessment localStorage flow');
assert(omrJs.includes('async function openOMR('), 'qr-omr.js should preserve the regular openOMR flow');
assert(omrJs.includes('async function handleOMRSave('), 'qr-omr.js should preserve regular single OMR save');
assert(omrJs.includes('async function saveOmrInputBulk('), 'qr-omr.js should preserve regular bulk OMR save');

const renderAppIndex = analysisHtml.indexOf('function renderApp()');
const renderAppBody = renderAppIndex >= 0 ? analysisHtml.slice(renderAppIndex, analysisHtml.indexOf('renderApp();', renderAppIndex)) : '';
assert(renderAppBody.includes('renderDiagnosticReportActions()'), 'diagnostic report render should include report actions');
assert(renderAppBody.includes("'<div id=\"analysisSections\"></div>'"), 'diagnostic report render should mount analysis sections before optional input');
assert(renderAppBody.includes('shouldShowDiagnosticInput() ? renderInputSection()'), 'diagnostic report input section should be conditional');
assert(renderAppBody.includes('shouldShowDiagnosticInput() ? \'<div id=\"questionInputMount\"></div>\''), 'diagnostic report question input should be conditional');
assert(renderAppBody.includes('isDiagnosticReportMode() ? \'\' : renderInfo(pack, count)'), 'diagnostic report should not render the generic internal analysis pack card by default');

const parentTableFnStart = analysisHtml.indexOf('function renderDiagnosticParentItemTable()');
const parentTableFnBody = parentTableFnStart >= 0 ? analysisHtml.slice(parentTableFnStart, analysisHtml.indexOf('function renderDiagnosticInternalDetails()', parentTableFnStart)) : '';
assert(parentTableFnBody.includes('문항') || parentTableFnBody.includes('臾명빆'), 'diagnostic parent table should include question column');
assert(parentTableFnBody.includes('결과') || parentTableFnBody.includes('寃곌낵'), 'diagnostic parent table should include result column');
assert(parentTableFnBody.includes('단원') || parentTableFnBody.includes('?⑥썝'), 'diagnostic parent table should include unit column');
assert(parentTableFnBody.includes('유형') || parentTableFnBody.includes('?좏삎'), 'diagnostic parent table should include type column');
assert(parentTableFnBody.includes('난이도') || parentTableFnBody.includes('?쒖씠'), 'diagnostic parent table should include difficulty column');
assert(parentTableFnBody.includes('확인 사인') || parentTableFnBody.includes('?뺤씤 ?ъ씤'), 'diagnostic parent table should include check-sign column');
for (const internalMarker of ['sourceFile', 'sourceQuestionNo', 'sourceRef', 'raw note', '내부 메모', '원본 시험지', '원본 문항번호']) {
  assert(!parentTableFnBody.includes(internalMarker), `diagnostic parent table should not expose internal marker: ${internalMarker}`);
}
assert(!parentTableFnBody.includes('getInternalAnalysisNote'), 'diagnostic parent table should not fill the check-sign column with internal notes');

const internalDetailFnStart = analysisHtml.indexOf('function renderDiagnosticInternalDetails()');
const internalDetailFnBody = internalDetailFnStart >= 0 ? analysisHtml.slice(internalDetailFnStart, analysisHtml.indexOf('function renderDiagnosticAnalysisSections()', internalDetailFnStart)) : '';
assert(internalDetailFnBody.includes('sourceFile'), 'diagnostic internal detail should keep sourceFile internally');
assert(internalDetailFnBody.includes('sourceQuestionNo'), 'diagnostic internal detail should keep sourceQuestionNo internally');
assert(internalDetailFnBody.includes('diagnostic-internal-detail'), 'diagnostic internal detail should use separated class');
assert(internalDetailFnBody.includes('internal-only'), 'diagnostic internal detail should be internal-only');
assert(internalDetailFnBody.includes('print-hidden'), 'diagnostic internal detail should be hidden from print');

const reportActionsFnStart = analysisHtml.indexOf('function renderDiagnosticReportActions()');
const reportActionsFnBody = reportActionsFnStart >= 0 ? analysisHtml.slice(reportActionsFnStart, analysisHtml.indexOf('function startDiagnosticReportEdit()', reportActionsFnStart)) : '';
assert(reportActionsFnBody.includes('toggleDiagnosticInternalDetails()'), 'diagnostic report actions should expose internal detail toggle');
assert(reportActionsFnBody.includes('diagnostic-internal-toggle'), 'internal detail button should be visually separated from the main parent result');

const diagnosticSectionsFnStart = analysisHtml.indexOf('function renderDiagnosticAnalysisSections()');
const diagnosticSectionsFnBody = diagnosticSectionsFnStart >= 0 ? analysisHtml.slice(diagnosticSectionsFnStart, analysisHtml.indexOf('function collectDraft()', diagnosticSectionsFnStart)) : '';
assert(
  diagnosticSectionsFnBody.includes('state.diagnosticInternalOpen ? renderDiagnosticInternalDetails() : \'\''),
  'diagnostic internal details should not be rendered while closed'
);
assert(
  !diagnosticSectionsFnBody.includes('renderDiagnosticInternalDetails(),'),
  'diagnostic internal details should not be unconditionally rendered'
);

assert(
  /@media\s+print[\s\S]*\.print-hidden[\s\S]*display:\s*none\s*!important/.test(analysisHtml) &&
  /@media\s+print[\s\S]*\.internal-only[\s\S]*display:\s*none\s*!important/.test(analysisHtml),
  'print CSS should hide diagnostic internal details and screen-only controls'
);

for (const [label, source] of [
  ['assessment-mvp.html', mvpHtml],
  ['assessment-analysis.html', analysisHtml],
  ['qr-omr.js', omrJs],
]) {
  for (const forbidden of [
    'assessment_analysis_snapshots',
    'assessment_report_snapshots',
    'premium AI',
    '프리미엄 AI',
    '학부모 발송',
    'wrangler d1 migrations apply',
    'wrangler deploy',
  ]) {
    assert(!source.includes(forbidden), `${label} should not include forbidden implementation marker: ${forbidden}`);
  }
}

console.log('assessment diagnostic OMR flow checks passed');
