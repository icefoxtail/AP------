import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const today = new Date().toISOString().slice(0, 10);
const old = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const oldYear = old.slice(0, 4);
const oldMonth = old.slice(5, 7);

const context = {
  state: {
    db: {
      students: [
        { id: 's1', name: '민준', grade: '중1' },
        { id: 's2', name: '서연', grade: '중1' },
        { id: 's3', name: '도윤', grade: '중3' }
      ],
      classes: [],
      class_students: [],
      exam_sessions: [
        { id: 'e1', student_id: 's1', archive_file: 'mid1.js', exam_title: '중1 모의고사', exam_date: today, score: 80, question_count: 20 },
        { id: 'e2', student_id: 's3', archive_file: 'wang.js', exam_title: '왕운중 기말', exam_date: today, score: 70, question_count: 25 },
        { id: 'e3', student_id: 's2', archive_file: 'oldexam.js', exam_title: '지난달 옛시험', exam_date: old, score: 60, question_count: 20 }
      ],
      wrong_answers: [],
      exam_blueprints: [],
      exam_question_reviews: [],
      exam_analysis_meta: [],
      report_exam_cohort_stats: [
        { session_id: 'e1', gradeExamAverage: 75, gradeExamCount: 40, questionStats: [] }
      ]
    }
  },
  window: {},
  document: { getElementById: () => null, querySelectorAll: () => [] },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  openReportCenterModal: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

context.window.AP_REPORT_HUB_SEARCH = { keyword: '', year: '', month: '', grade: '' };

const html = context.reportCenterRenderExamHubList('');

// 학년 순서: 중1 섹션이 중3 섹션보다 먼저.
const i1 = html.indexOf('중1');
const i3 = html.indexOf('중3');
assert.ok(i1 > -1 && i3 > -1 && i1 < i3, '중1 헤더가 중3보다 먼저 나와야 한다');

// 최근 1개월만: 40일 전 시험은 기본 목록에 없고, 이전 안내가 표시된다.
assert.doesNotMatch(html, /지난달 옛시험/, '40일 전 시험지는 기본 목록에서 제외');
assert.match(html, /1개월 이전 시험지 1개는 위 검색으로/, '이전 시험지 개수 안내');
assert.match(html, /최근 1개월/, '최근 1개월 배지');

// 상태 배지 제거: 문항분석/오답입력/반 칩이 카드에 없어야 한다.
assert.doesNotMatch(html, /문항분석/, '문항분석 칩 제거');
assert.doesNotMatch(html, /오답입력/, '오답입력 칩 제거');

// 응시 인원: 코호트가 있는 시험지는 학원 전체(gradeExamCount=40), 없는 시험지는 담당 학생 로컬(1).
assert.match(html, /응시 40/, '코호트 있는 시험지는 학원 전체 응시 수');
assert.match(html, /응시 1/, '코호트 없는 시험지는 로컬 응시 수');

// 학년 필터 칩(전체/중1/중3).
assert.match(html, /전체 2/, '전체 칩(최근 시험지 2개)');

// 검색 모드: 연/월 지정 시 과거 시험지가 연·월 그룹으로 나온다.
context.window.AP_REPORT_HUB_SEARCH = { keyword: '', year: oldYear, month: oldMonth, grade: '' };
const searchHtml = context.reportCenterRenderExamHubList('');
assert.match(searchHtml, /검색 결과 1개/, '검색 결과 개수');
assert.match(searchHtml, /검색 초기화/, '검색 초기화 버튼');
assert.match(searchHtml, /지난달 옛시험/, '검색 시 과거 시험지 노출');
assert.match(searchHtml, new RegExp(`${oldYear}년 ${Number(oldMonth)}월`), '연·월 그룹 헤더');
// 검색 결과는 학년 헤더로 묶지 않는다(오늘 시험 중1/중3은 검색 결과에 없음).
assert.doesNotMatch(searchHtml, /왕운중 기말/, '다른 달 시험은 검색 결과에서 제외');

// P1 회귀: 같은 archive에 옛 exam_date 세션 + 최신 created_at 세션이 섞이면,
// created_at도 기준일로 인정되어야 최근 목록에 포함된다(update 경로에서 created_at 무시 버그 방지).
context.state.db.exam_sessions.push(
  { id: 'e4', student_id: 's1', archive_file: 'multi.js', exam_title: 'created_at 시험', exam_date: old, score: 55, question_count: 10 },
  { id: 'e5', student_id: 's1', archive_file: 'multi.js', exam_title: 'created_at 시험', exam_date: '', created_at: today, score: 65, question_count: 10 }
);
context.window.AP_REPORT_HUB_SEARCH = { keyword: '', year: '', month: '', grade: '' };
const withCreatedAt = context.reportCenterRenderExamHubList('');
assert.match(withCreatedAt, /created_at 시험/, 'exam_date 없이 created_at만 최신인 세션도 최근 목록에 반영');

console.log('report center hub grade grouping test passed');
