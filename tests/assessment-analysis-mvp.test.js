const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const analysisPath = path.join(root, 'archive', 'assessment', 'assessment-analysis.html');
const mvpPath = path.join(root, 'archive', 'assessment', 'assessment-mvp.html');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(fs.existsSync(analysisPath), 'assessment-analysis.html file should exist');

const analysisHtml = fs.readFileSync(analysisPath, 'utf8');
const mvpHtml = fs.readFileSync(mvpPath, 'utf8');

[
  '시험지 분석표',
  '학생명',
  '반명',
  '평가일',
  '메모',
  'O',
  'X',
  '△',
  '문항별 분석표',
  '단원별 집계',
  '유형별 집계',
  '난이도별 집계',
  '보완 필요 목록',
  '임시저장',
  '불러오기',
  '초기화',
  '분석표 출력',
  'apms.assessment.analysis.',
  'assessment-packs-1sem.generated.js',
  'assessment-question-index-1sem.generated.js',
  'APMATH_ASSESSMENT_PACKS_1SEM',
  'APMATH_ASSESSMENT_QUESTION_INDEX_1SEM',
  '평가팩을 선택해 주세요.',
  '평가팩을 찾을 수 없습니다.',
  '문항 수 확인 필요',
  'hasUsableQuestions(pack)',
  'Array.isArray(pack?.questions) && pack.questions.length > 0',
].forEach((requiredText) => {
  assert(analysisHtml.includes(requiredText), `assessment-analysis.html should include ${requiredText}`);
});

assert(
  analysisHtml.includes('const canRenderQuestions = hasUsableQuestions(pack)'),
  'assessment-analysis.html should render input/analysis only from a non-empty pack.questions array'
);

assert(
  analysisHtml.includes('canRenderQuestions && shouldShowDiagnosticInput() ? renderInputSection()') &&
  analysisHtml.includes('canRenderQuestions && shouldShowDiagnosticInput() ? \'<div id="questionInputMount"></div>\'') &&
  analysisHtml.includes('canRenderQuestions && !isDiagnosticReportMode() ? \'<div id="analysisSections"></div>\'') &&
  analysisHtml.includes('!canRenderQuestions ? \'<div class="empty-state">문항 수 확인 필요</div>\''),
  'assessment-analysis.html should not create input tables from questionCount-only metadata'
);

assert(
  analysisHtml.includes('if (!state.rows.length) return null;') &&
  analysisHtml.includes('if (!draft) return;'),
  'assessment-analysis.html should avoid saving empty analysis drafts when questions are unavailable'
);

[
  'sourceFile',
  'sourceQuestionNo',
  '_sourceFile',
  '_sourceQuestionNo',
  'sourceRef',
  'questionNo',
  'id',
].forEach((matchingMarker) => {
  assert(analysisHtml.includes(matchingMarker), `assessment-analysis.html should include question index matching marker ${matchingMarker}`);
});

[
  'result_status',
  'student_answer',
  'correct',
  'wrong',
  'partial',
  'unchecked',
  'window.print()',
  '@media print',
].forEach((stateMarker) => {
  assert(analysisHtml.includes(stateMarker), `assessment-analysis.html should include result/storage marker ${stateMarker}`);
});

assert(mvpHtml.includes('분석표'), 'assessment-mvp.html should include analysis action text');
assert(
  mvpHtml.includes("'./assessment-' + 'analysis.html?packId='"),
  'assessment-mvp.html should link analysis page with packId'
);
assert(mvpHtml.includes('data-action="analysis"'), 'assessment-mvp.html should add an analysis action button');

[
  'assessment_analysis_snapshots',
  'assessment_report_snapshots',
  'premium',
  'report snapshot',
  '학부모 발송',
  '/api/',
  'fetch(',
].forEach((forbiddenText) => {
  assert(!analysisHtml.includes(forbiddenText), `assessment-analysis.html should not implement backend/premium/report behavior: ${forbiddenText}`);
});

console.log('assessment analysis MVP checks passed');
