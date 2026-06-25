import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/report.js'), 'utf8');

const state = {
  db: {
    students: [
      { id: 's1', name: '테스트 학생', grade: '중2' },
      { id: 's2', name: '비교 학생', grade: '중2' },
      { id: 's3', name: '만점 학생', grade: '중2' }
    ],
    exam_sessions: [
      { id: 'e1', student_id: 's1', exam_date: '2026-04-01', exam_title: '1회', archive_file: 'exam-1.js', score: 70, question_count: 10 },
      { id: 'e2', student_id: 's1', exam_date: '2026-05-01', exam_title: '2회', archive_file: 'exam-2.js', score: 80, question_count: 10 },
      { id: 'e3', student_id: 's1', exam_date: '2026-06-01', exam_title: '3회', archive_file: 'exam-3.js', score: 90, question_count: 10 },
      { id: 'c1', student_id: 's2', exam_date: '2026-04-01', exam_title: '1회', archive_file: 'exam-1.js', score: 60, question_count: 10 },
      { id: 'c2', student_id: 's2', exam_date: '2026-05-01', exam_title: '2회', archive_file: 'exam-2.js', score: 70, question_count: 10 },
      { id: 'c3', student_id: 's2', exam_date: '2026-06-01', exam_title: '3회', archive_file: 'exam-3.js', score: 80, question_count: 10 },
      { id: 'p1', student_id: 's3', exam_date: '2026-06-01', exam_title: '만점회', archive_file: 'exam-perfect.js', score: 100, question_count: 10 }
    ],
    wrong_answers: [
      { session_id: 'e1', question_id: 1 },
      { session_id: 'e2', question_id: 1 },
      { session_id: 'e2', question_id: 2 },
      { session_id: 'e3', question_id: 2 },
      { session_id: 'c1', question_id: 3 },
      { session_id: 'c2', question_id: 3 },
      { session_id: 'c3', question_id: 3 }
    ],
    exam_blueprints: [
      { archive_file: 'exam-1.js', question_no: 1, standard_unit_key: 'unit-a', standard_unit: '정수와 유리수' },
      { archive_file: 'exam-2.js', question_no: 1, standard_unit_key: 'unit-a', standard_unit: '정수와 유리수' },
      { archive_file: 'exam-2.js', question_no: 2, standard_unit_key: 'unit-b', standard_unit: '문자와 식' },
      { archive_file: 'exam-3.js', question_no: 2, standard_unit_key: 'unit-b', standard_unit: '문자와 식' }
    ],
    class_students: [
      { student_id: 's1', class_id: 'class-1' },
      { student_id: 's2', class_id: 'class-1' },
      { student_id: 's3', class_id: 'class-1' }
    ],
    classes: [{ id: 'class-1', name: '테스트반', grade: '중2' }],
    report_exam_cohort_stats: [],
    questions: [],
    consultations: [],
    attendance: [],
    homework: []
  }
};

const context = {
  state,
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: { clipboard: { writeText: text => { context.__copiedText = text; return Promise.resolve(); } } },
  toast: (message, type) => { context.__toasts.push({ message, type }); },
  __copiedText: '',
  __toasts: [],
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const before = JSON.stringify(state.db.exam_sessions);
const trendData = context.reportCenterGetExamTrendData('s1', { limit: 5 });

assert.deepEqual(
  trendData.selectedSessions.map(row => row.id),
  ['e1', 'e2', 'e3'],
  'selected sessions should be chronological after selecting the latest N'
);
assert.equal(trendData.trend.direction, 'up');
assert.equal(trendData.trend.scoreDelta, 20);
assert.equal(trendData.trend.bestScore, 90);
assert.equal(trendData.trend.worstScore, 70);
assert.equal(trendData.selectedSessions[2].overallAvg, 85);
assert.equal(trendData.selectedSessions[2].classAvg, 85);
assert.equal(JSON.stringify(state.db.exam_sessions), before, 'trend builder must not mutate exam sessions');

const resolvedWeakness = trendData.weaknessTrend.find(row => row.unitKey === 'unit-a');
const activeWeakness = trendData.weaknessTrend.find(row => row.unitKey === 'unit-b');
assert.equal(resolvedWeakness?.appearedInSessions, 2);
assert.equal(resolvedWeakness?.resolved, true);
assert.equal(activeWeakness?.appearedInSessions, 2);
assert.equal(activeWeakness?.resolved, false);

assert.equal(
  context.reportCenterIsDuplicateText('11번 문항의 풀이 흐름을 확인합니다.', '11번 문항 풀이 흐름 확인 합니다!'),
  true,
  'duplicate comparison should ignore spacing, punctuation, and particle differences'
);
assert.equal(
  context.reportCenterPickNonDuplicateText('같은 문장입니다.', '다른 대체 문장입니다.', ['같은 문장 입니다!']),
  '다른 대체 문장입니다.'
);

const svg = context.reportCenterBuildTrendSvg(trendData.trend, trendData.selectedSessions.map((row, index) => ({
  ...row,
  overallAvg: index === 1 ? null : row.overallAvg,
  classAvg: null
})));
assert.match(svg, /<svg/);
assert.match(svg, /stroke="#2563eb"/, 'student score line should always render');
assert.doesNotMatch(svg, /stroke="#f59e0b"/, 'class average line should be omitted when all values are null');

const firstRecord = context.reportCenterGetExamTrendData('s2', { limit: 1 });
assert.equal(firstRecord.trend.direction, 'flat');
assert.equal(firstRecord.trend.hasMultipleSessions, false);
assert.match(context.reportCenterBuildTrendSummaryText(firstRecord), /이번이 첫 시험/);

const recentAverage = context.getRecentAverage('s1', 3);
assert.equal(recentAverage, 80, 'getRecentAverage must preserve its numeric return contract');

const pdfHtml = context.reportCenterBuildCleanPdfDocument('s1', 'e3', { teacherMemo: '' });
assert.match(pdfHtml, /지금 어디쯤 있나요/);
assert.doesNotMatch(pdfHtml, /aprc-trend-svg/, 'default report should not include trend graph until enabled');
assert.doesNotMatch(pdfHtml, /aprc-weakness-table/, 'default report should not include repeated weakness table until enabled');
assert.match(pdfHtml, /상승/);
const summarySection = pdfHtml.match(/aprc-pdf-parent-summary[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
const weaknessSection = pdfHtml.match(/다음에 꼭 짚어볼 부분[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
assert.doesNotMatch(summarySection, /90점|정답률\s*90%/, 'score facts should remain in cards');
assert.equal(context.reportCenterIsDuplicateText(summarySection, weaknessSection), false);

const studioDraft = context.reportCenterBuildReportDraft('s1', 'e3', {
  data: context.reportCenterGetExamReportData('s1', 'e3'),
  trendData,
  aiAnalysis: null,
  autoTexts: {
    summary: '기본 요약',
    trend: '기본 추이',
    weakness: '기본 약점',
    plan: '기본 계획',
    teacherOpinion: '기본 의견',
    parentMessage: '기본 학부모 문구',
    kakaoSummary: '기본 카톡'
  }
});
studioDraft.blocks.summary.userText = '선생님이 고친 요약입니다.';
studioDraft.blocks.summary.isDirty = true;
studioDraft.options.includeTrendGraph = true;
studioDraft.options.includeWeaknessTrend = true;
studioDraft.charts.trendChart.displayData[2].score = 76;
studioDraft.charts.trendChart.displayData[2].label = '표시용 3회';
studioDraft.charts.trendChart.isDirty = true;

const studioHtml = context.reportCenterBuildCleanPdfDocument('s1', 'e3', {
  teacherMemo: '',
  studioState: studioDraft
});
assert.match(studioHtml, /선생님이 고친 요약입니다/);
assert.match(studioHtml, /aprc-trend-svg/);
assert.match(studioHtml, /aprc-weakness-table/);
const studioChartSvg = studioHtml.match(/<svg class="aprc-trend-svg"[\s\S]*?<\/svg>/)?.[0] || '';
assert.match(studioChartSvg, />76</, 'studio chart should use displayData score');
assert.doesNotMatch(studioChartSvg, />90</, 'edited chart display score should not fall back to DB score inside chart label');
assert.match(studioChartSvg, /표시용 3회/, 'studio chart should prefer edited displayData label over source date');
assert.equal(JSON.stringify(state.db.exam_sessions), before, 'studio displayData edits must not mutate exam sessions');

const emptyTextDraft = context.reportCenterBuildReportDraft('s1', 'e3', {
  data: context.reportCenterGetExamReportData('s1', 'e3'),
  trendData,
  aiAnalysis: { summary: 'AI 요약', source: 'ai' },
  autoTexts: {
    summary: '기본 요약',
    trend: '기본 추이',
    weakness: '기본 약점',
    plan: '기본 계획',
    teacherOpinion: '기본 의견',
    parentMessage: '기본 학부모 문구',
    kakaoSummary: '기본 카톡'
  }
});
emptyTextDraft.blocks.summary.userText = '';
emptyTextDraft.blocks.summary.isDirty = true;
const emptyTextHtml = context.reportCenterBuildCleanPdfDocument('s1', 'e3', {
  teacherMemo: '',
  studioState: emptyTextDraft
});
const emptySummarySection = emptyTextHtml.match(/aprc-pdf-parent-summary[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
assert.equal(emptySummarySection, '', 'dirty empty userText must remain empty instead of falling back');
assert.doesNotMatch(emptyTextHtml, /AI 요약|기본 요약/, 'dirty empty userText should not be replaced by AI/basic text');

const downLineSvg = context.reportCenterBuildLineChartSvg({
  enabled: true,
  purpose: 'trend',
  type: 'line',
  displayData: [
    { label: 'A', score: 90, visible: true },
    { label: 'B', score: 80, visible: true },
    { label: 'C', score: 70, visible: true }
  ],
  options: { showStudentScore: true, showClassAverage: false, showTotalAverage: false, showDataLabels: true, yMin: 0, yMax: 100 }
});
assert.match(downLineSvg, /하강/, 'line chart direction should be recalculated from displayData');

const upLineSvg = context.reportCenterBuildLineChartSvg({
  enabled: true,
  purpose: 'trend',
  type: 'line',
  displayData: [
    { label: 'A', score: 70, visible: true },
    { label: 'B', score: 80, visible: true },
    { label: 'C', score: 90, visible: true }
  ],
  options: { showStudentScore: true, showClassAverage: false, showTotalAverage: false, showDataLabels: true, yMin: 0, yMax: 100 }
});
assert.match(upLineSvg, /상승/, 'line chart direction should show rising displayData');

const classOnlyLineSvg = context.reportCenterBuildLineChartSvg({
  enabled: true,
  purpose: 'trend',
  type: 'line',
  displayData: [
    { label: '1회', score: 70, classAvg: 90, overallAvg: 60, visible: true },
    { label: '2회', score: 80, classAvg: 70, overallAvg: 65, visible: true }
  ],
  options: { showStudentScore: false, showClassAverage: true, showTotalAverage: false, showDataLabels: true, yMin: 0, yMax: 100 }
});
assert.match(classOnlyLineSvg, /1회/, 'line chart x-axis labels should remain when student series is hidden');
assert.match(classOnlyLineSvg, /2회/, 'line chart x-axis labels should remain for every visible row');
assert.match(classOnlyLineSvg, /하강/, 'line chart direction should use classAvg when only class average is shown');
assert.doesNotMatch(classOnlyLineSvg, /상승/, 'hidden student score trend should not drive direction');

const overallOnlyLineSvg = context.reportCenterBuildLineChartSvg({
  enabled: true,
  purpose: 'trend',
  type: 'line',
  displayData: [
    { label: '1회', score: 90, classAvg: 85, overallAvg: 60, visible: true },
    { label: '2회', score: 80, classAvg: 75, overallAvg: 70, visible: true }
  ],
  options: { showStudentScore: false, showClassAverage: false, showTotalAverage: true, showDataLabels: true, yMin: 0, yMax: 100 }
});
assert.match(overallOnlyLineSvg, /상승/, 'line chart direction should use overallAvg when only total average is shown');

const classOnlyBarSvg = context.reportCenterBuildBarChartSvg({
  enabled: true,
  purpose: 'trend',
  type: 'bar',
  displayData: [
    { label: '1회', score: 70, classAvg: 65, overallAvg: 60, visible: true },
    { label: '2회', score: 80, classAvg: 75, overallAvg: 70, visible: true }
  ],
  options: { showStudentScore: false, showClassAverage: true, showTotalAverage: false, showDataLabels: true, yMin: 0, yMax: 100 }
});
assert.doesNotMatch(classOnlyBarSvg, /fill="#2563eb"/, 'bar chart should not render student bars when showStudentScore=false');
assert.match(classOnlyBarSvg, /fill="#f59e0b"/, 'bar chart should render selected class average bars');
assert.doesNotMatch(classOnlyBarSvg, />70</, 'student display score should not appear as a bar label when student series is hidden');

const noSeriesBarHtml = context.reportCenterBuildBarChartSvg({
  enabled: true,
  purpose: 'trend',
  type: 'bar',
  displayData: [{ label: '1회', score: 70, classAvg: 65, overallAvg: 60, visible: true }],
  options: { showStudentScore: false, showClassAverage: false, showTotalAverage: false }
});
assert.match(noSeriesBarHtml, /표시할 그래프 항목이 없습니다/, 'bar chart should explain when no series is selected');

const noSeriesLineHtml = context.reportCenterBuildLineChartSvg({
  enabled: true,
  purpose: 'trend',
  type: 'line',
  displayData: [
    { label: 'A', score: 70, classAvg: 65, overallAvg: 60, visible: true },
    { label: 'B', score: 80, classAvg: 75, overallAvg: 70, visible: true }
  ],
  options: { showStudentScore: false, showClassAverage: false, showTotalAverage: false, showDataLabels: true, yMin: 0, yMax: 100 }
});
assert.match(noSeriesLineHtml, /표시할 그래프 항목이 없습니다/, 'line chart should explain when no series is selected');

const histogramWithoutLabels = context.reportCenterBuildHistogramSvg({
  enabled: true,
  purpose: 'distribution',
  type: 'histogram',
  displayData: [
    { label: '학생1', score: 5, visible: true },
    { label: '학생2', score: 6, visible: true },
    { label: '학생3', score: 7, visible: true }
  ],
  options: { binSize: 10, showDataLabels: false, yMin: 0, yMax: 3 }
});
assert.doesNotMatch(histogramWithoutLabels, />3<\/text>/, 'histogram should hide count labels when showDataLabels=false');

const polygonWithLabels = context.reportCenterBuildFrequencyPolygonSvg({
  enabled: true,
  purpose: 'distribution',
  type: 'frequencyPolygon',
  displayData: [
    { label: '학생1', score: 5, visible: true },
    { label: '학생2', score: 6, visible: true }
  ],
  options: { binSize: 10, showDataLabels: true, yMin: 0, yMax: 2 }
});
assert.match(polygonWithLabels, />2<\/text>/, 'frequency polygon should show count labels when showDataLabels=true');

const histogramYMaxTwo = context.reportCenterBuildHistogramSvg({
  enabled: true,
  purpose: 'distribution',
  type: 'histogram',
  displayData: [
    { label: '학생1', score: 5, visible: true },
    { label: '학생2', score: 6, visible: true }
  ],
  options: { binSize: 10, showDataLabels: true, yMin: 0, yMax: 2 }
});
const histogramYMaxFour = context.reportCenterBuildHistogramSvg({
  enabled: true,
  purpose: 'distribution',
  type: 'histogram',
  displayData: [
    { label: '학생1', score: 5, visible: true },
    { label: '학생2', score: 6, visible: true }
  ],
  options: { binSize: 10, showDataLabels: true, yMin: 0, yMax: 4 }
});
assert.match(histogramYMaxTwo, /y="24\.0"/, 'distribution yMax should place max count at chart top');
assert.match(histogramYMaxFour, /y="101\.0"/, 'distribution yMax should change count scale');

const emptyKakaoDraft = context.reportCenterBuildReportDraft('s1', 'e3', {
  data: context.reportCenterGetExamReportData('s1', 'e3'),
  trendData,
  aiAnalysis: { kakaoSummary: 'AI 카톡', source: 'ai' },
  autoTexts: {
    summary: '기본 요약',
    trend: '기본 추이',
    weakness: '기본 약점',
    plan: '기본 계획',
    teacherOpinion: '기본 의견',
    parentMessage: '기본 학부모 문구',
    kakaoSummary: '기본 카톡'
  }
});
emptyKakaoDraft.blocks.kakaoSummary.userText = '';
emptyKakaoDraft.blocks.kakaoSummary.isDirty = true;
context.window.AP_REPORT_STUDIO_STATE = emptyKakaoDraft;
context.__copiedText = '';
context.__toasts = [];
context.reportCenterCopyExamKakaoSummary('s1', 'e3');
assert.equal(context.__copiedText, '', 'dirty empty kakaoSummary should not copy fallback text');
assert.equal(context.__toasts.at(-1)?.message, '복사할 카톡 문구가 없습니다.');

const scoreHumanized = context.reportCenterHumanizeKoreanText('이번 평가는 82점이며, 전체 평균은 71점입니다.', {
  blockKey: 'summary',
  preserveFacts: true
});
assert.match(scoreHumanized, /82/);
assert.match(scoreHumanized, /71/);

const questionNoHumanized = context.reportCenterHumanizeKoreanText('7번, 12번 문항에서 오답이 확인되었습니다.', {
  blockKey: 'weakness',
  preserveFacts: true
});
assert.match(questionNoHumanized, /7번/);
assert.match(questionNoHumanized, /12번/);

const aiPhraseHumanized = context.reportCenterHumanizeKoreanText(
  '결론적으로 이번 평가는 향후 학습 방향 설정에 있어 중요한 시사점을 제공합니다.',
  { blockKey: 'summary', tone: 'calm_parent' }
);
assert.doesNotMatch(aiPhraseHumanized, /결론적으로/);
assert.doesNotMatch(aiPhraseHumanized, /향후/);
assert.doesNotMatch(aiPhraseHumanized, /시사점/);

const dirtyDraft = context.reportCenterBuildReportDraft('s1', 'e3', {
  data: context.reportCenterGetExamReportData('s1', 'e3'),
  trendData,
  aiAnalysis: { summary: 'AI 자동 요약', source: 'ai' },
  autoTexts: { summary: '기본 자동 요약' }
});
dirtyDraft.blocks.summary.userText = '선생님 직접 문구';
dirtyDraft.blocks.summary.isDirty = true;
context.reportCenterMergeAiAnalysisIntoStudioState(dirtyDraft, { summary: '프리미엄 분석 요약' });
assert.equal(context.reportCenterStudioResolveBlockText(dirtyDraft.blocks.summary), '선생님 직접 문구');

dirtyDraft.blocks.summary.userText = '';
dirtyDraft.blocks.summary.isDirty = true;
context.reportCenterMergeAiAnalysisIntoStudioState(dirtyDraft, { summary: '프리미엄 분석 요약' });
assert.equal(context.reportCenterStudioResolveBlockText(dirtyDraft.blocks.summary), '');

const longKakao = context.reportCenterHumanizeKoreanText(
  '결론적으로 이번 평가는 향후 학습 방향 설정에 있어 중요한 시사점을 제공합니다. 또한, 학습 성취도를 다각도로 확인할 수 있었습니다. 따라서, 체계적인 관리가 필요가 있습니다. 나아가, 개선이 기대됩니다. 이에 따라, 다음 수업에서 확인하겠습니다.',
  { blockKey: 'kakaoSummary', tone: 'kakao_short' }
);
const kakaoSentenceCount = (longKakao.match(/[^.!?。！？]+[.!?。！？]?/g) || []).filter(Boolean).length;
assert.ok(kakaoSentenceCount >= 1 && kakaoSentenceCount <= 4, 'kakao_short should keep the copy compact');
assert.doesNotMatch(longKakao, /결론적으로|향후|시사점|또한,|따라서,/);

const naturalText = '이번 평가는 점수 자체보다 오답이 나온 문항의 성격을 함께 보는 것이 중요합니다.';
assert.equal(
  context.reportCenterHumanizeKoreanText(naturalText, { blockKey: 'summary' }),
  '이번 시험은 점수 자체보다 틀린 문제가 나온 문제의 성격을 함께 보는 것이 중요합니다.',
  'humanize should apply final easy-language terminology without changing facts'
);

const easySummaryWrong = context.reportCenterBuildEasySummaryText({
  student: { name: '테스트 학생' },
  session: { score: 82 },
  stats: { classAvg: null }
}, 3, null);
assert.match(easySummaryWrong, /이번 시험은 3문제 틀렸습니다/);
assert.match(easySummaryWrong, /틀린 문제는 다음 시간에 다시 풀어보겠습니다/);
assert.doesNotMatch(easySummaryWrong, /오답|확인되었습니다|유의미|보완/);

const perfectHtml = context.reportCenterBuildCleanPdfDocument('s3', 'p1', { teacherMemo: '' });
assert.match(perfectHtml, /이번 시험은 다 맞았습니다/);
assert.doesNotMatch(perfectHtml, /다음에 꼭 짚어볼 부분/, 'perfect report should hide weakness block');
assert.doesNotMatch(perfectHtml, /반복 오답 단원은 확인되지 않았습니다|다시 볼 부분이 없습니다/);
const perfectParentSection = perfectHtml.match(/aprc-pdf-parent-message[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
assert.match(perfectParentSection, /이번 시험에서 다 맞았습니다/);
assert.doesNotMatch(perfectParentSection, /틀린 문제|오답|약점|보완/);

const wrongPdfForbiddenText = context.reportCenterBuildCleanPdfDocument('s1', 'e3', { teacherMemo: '' });
assert.doesNotMatch(wrongPdfForbiddenText, /유사문항|유사 문제|조건 표시|보완|약점|학습 흐름|시사점/);
assert.match(wrongPdfForbiddenText, /비슷한 문제|틀린 문제/);

assert.equal(context.reportCenterEasyScoreDeltaText(5), '첫 시험보다 5점 올랐습니다.');
assert.equal(context.reportCenterEasyScoreDeltaText(-5), '첫 시험보다 5점 낮아졌습니다.');
assert.equal(context.reportCenterEasyScoreDeltaText(0), '첫 시험과 같은 점수입니다.');

const wrongKakao = context.reportCenterBuildEasyKakaoSummary('s1', 'e3');
assert.match(wrongKakao, /안녕하세요, AP수학입니다/);
assert.match(wrongKakao, /3회/);
assert.match(wrongKakao, /90점/);
assert.match(wrongKakao, /틀린 문제/);
assert.doesNotMatch(wrongKakao, /유사문항|보완|학습 흐름|시사점/);

const perfectKakao = context.reportCenterBuildEasyKakaoSummary('s3', 'p1');
assert.match(perfectKakao, /안녕하세요, AP수학입니다/);
assert.match(perfectKakao, /만점회/);
assert.match(perfectKakao, /100점/);
assert.match(perfectKakao, /다 맞았습니다/);
assert.doesNotMatch(perfectKakao, /유사문항|보완|학습 흐름|시사점|오답/);

console.log('report exam trend tests passed');
