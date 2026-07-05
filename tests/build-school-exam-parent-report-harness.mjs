import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const wrongAnswers = [1, 2, 3, 4, 5, 6].map(question_id => ({
  session_id: 'session-loop-c',
  student_id: 'student-loop-c',
  question_id
}));

const context = {
  state: {
    db: {
      students: [{ id: 'student-loop-c', name: '샘플 학생' }],
      classes: [{ id: 'class-a', name: 'A반' }],
      class_students: [{ class_id: 'class-a', student_id: 'student-loop-c' }],
      exam_sessions: [{
        id: 'session-loop-c',
        student_id: 'student-loop-c',
        archive_file: 'loop-c-school-exam.js',
        exam_title: 'Loop C 학교시험',
        score: 72,
        question_count: 8
      }],
      wrong_answers: wrongAnswers,
      exam_blueprints: [
        { archive_file: 'loop-c-school-exam.js', question_no: 1, standard_unit: '일차방정식', difficulty: '쉬움', points: 3 },
        { archive_file: 'loop-c-school-exam.js', question_no: 2, standard_unit: '함수 활용', difficulty: '보통', points: 4 },
        { archive_file: 'loop-c-school-exam.js', question_no: 3, standard_unit: '조건 해석', difficulty: '어려움', points: 4 },
        { archive_file: 'loop-c-school-exam.js', question_no: 4, standard_unit: '부등식과 범위', difficulty: '어려움', points: 4 },
        { archive_file: 'loop-c-school-exam.js', question_no: 5, standard_unit: '인수분해', difficulty: '보통', points: 3 },
        { archive_file: 'loop-c-school-exam.js', question_no: 6, standard_unit: '도형', difficulty: '매우 어려움', points: 5 }
      ],
      exam_question_reviews: [
        { archive_file: 'loop-c-school-exam.js', question_no: '1', review_text: JSON.stringify({ concept: '일차방정식', tag: '계산·검산' }) },
        { archive_file: 'loop-c-school-exam.js', question_no: '2', review_text: JSON.stringify({ concept: '함수 활용', tag: '풀이 순서' }) },
        { archive_file: 'loop-c-school-exam.js', question_no: '3', review_text: JSON.stringify({ concept: '조건 해석', tag: '조건 해석', trap: '문장 조건을 식으로 옮기는 부분' }) },
        { archive_file: 'loop-c-school-exam.js', question_no: '4', review_text: JSON.stringify({ concept: '부등식과 범위', tag: '조건 해석', trap: '경계값 포함 여부' }) },
        { archive_file: 'loop-c-school-exam.js', question_no: '5', review_text: JSON.stringify({ concept: '인수분해', tag: '계산·검산' }) },
        { archive_file: 'loop-c-school-exam.js', question_no: '6', review_text: JSON.stringify({ concept: '도형', tag: '개념 재정리' }) }
      ],
      exam_analysis_meta: [],
      exam_student_reports: []
    }
  },
  window: {},
  document: {
    querySelectorAll: () => [],
    head: { appendChild: () => {} },
    getElementById: () => null,
    createElement: () => ({ id: '', textContent: '' })
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const archiveDetails = {
  ok: true,
  details: [1, 2, 3, 4, 5, 6].map(questionNo => context.reportCenterNormalizeQuestionDetail(
    {
      content: `${questionNo}번 샘플 문항입니다. 조건을 읽고 알맞은 값을 구하세요.`,
      choices: ['① 첫 번째 선택지', '② 두 번째 선택지', '③ 세 번째 선택지'],
      answer: '②',
      solution: '조건을 식으로 정리한 뒤 검산합니다.'
    },
    questionNo,
    { questionNo, unit: questionNo % 2 ? '함수 활용' : '부등식과 범위', correctRate: questionNo === 1 ? 92 : questionNo === 6 ? 32 : 58 }
  ))
};
context.reportCenterSetCachedArchiveDetails('session-loop-c', archiveDetails);
context.AP_REPORT_AI_ANALYSIS_CACHE = {
  'session-loop-c': {
    source: 'ai',
    summary: 'AI 요약: 조건 해석과 계산 검산을 함께 보완합니다.',
    parentMessage: '학부모 안내: 다음 수업에서 우선 문항을 다시 점검합니다.',
    nextActions: ['조건 정리', '검산 습관 점검']
  }
};

const detailHtml = context.reportCenterBuildStudentView('student-loop-c', 'loop-c-school-exam.js');
const printHtml = context.reportCenterBuildSchoolExamDetailedPrintShell(
  context.reportCenterBuildSchoolExamDetailedPrintDocument('student-loop-c', 'session-loop-c', { archiveDetails })
);

const reportsDir = path.join(root, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(path.join(reportsDir, 'loop-c-school-exam-parent-detail-dump.html'), detailHtml, 'utf8');
fs.writeFileSync(path.join(reportsDir, 'loop-c-school-exam-parent-print-dump.html'), printHtml, 'utf8');

console.log('built reports/loop-c-school-exam-parent-detail-dump.html');
console.log('built reports/loop-c-school-exam-parent-print-dump.html');
