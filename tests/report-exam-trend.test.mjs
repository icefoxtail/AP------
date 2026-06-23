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
      { id: 's2', name: '비교 학생', grade: '중2' }
    ],
    exam_sessions: [
      { id: 'e1', student_id: 's1', exam_date: '2026-04-01', exam_title: '1회', archive_file: 'exam-1.js', score: 70, question_count: 10 },
      { id: 'e2', student_id: 's1', exam_date: '2026-05-01', exam_title: '2회', archive_file: 'exam-2.js', score: 80, question_count: 10 },
      { id: 'e3', student_id: 's1', exam_date: '2026-06-01', exam_title: '3회', archive_file: 'exam-3.js', score: 90, question_count: 10 },
      { id: 'c1', student_id: 's2', exam_date: '2026-04-01', exam_title: '1회', archive_file: 'exam-1.js', score: 60, question_count: 10 },
      { id: 'c2', student_id: 's2', exam_date: '2026-05-01', exam_title: '2회', archive_file: 'exam-2.js', score: 70, question_count: 10 },
      { id: 'c3', student_id: 's2', exam_date: '2026-06-01', exam_title: '3회', archive_file: 'exam-3.js', score: 80, question_count: 10 }
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
      { student_id: 's2', class_id: 'class-1' }
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
assert.match(context.reportCenterBuildTrendSummaryText(firstRecord), /첫 평가 기록/);

const recentAverage = context.getRecentAverage('s1', 3);
assert.equal(recentAverage, 80, 'getRecentAverage must preserve its numeric return contract');

const pdfHtml = context.reportCenterBuildCleanPdfDocument('s1', 'e3', { teacherMemo: '' });
assert.match(pdfHtml, /지금 어디쯤 있나요/);
assert.match(pdfHtml, /aprc-trend-svg/);
assert.match(pdfHtml, /aprc-weakness-table/);
assert.match(pdfHtml, /상승/);
const summarySection = pdfHtml.match(/aprc-pdf-parent-summary[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
const weaknessSection = pdfHtml.match(/다음에 꼭 짚어볼 부분[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
assert.doesNotMatch(summarySection, /90점|정답률\s*90%/, 'score facts should remain in cards');
assert.equal(context.reportCenterIsDuplicateText(summarySection, weaknessSection), false);

console.log('report exam trend tests passed');
