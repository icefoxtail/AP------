import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const context = {
  state: {
    db: {
      students: [{ id: 's1', name: '민준' }],
      exam_sessions: [
        { id: 'e1', student_id: 's1', archive_file: 'exams/mid-a.js', exam_title: '중간 A', school: '왕지중', grade: '중2', exam_date: '2026-06-01' },
        { id: 'e2', student_id: 's2', archive_file: 'mid-a.js', exam_title: '중간 A', school: '왕지중', grade: '중2', exam_date: '2026-06-02' },
        { id: 'e3', student_id: 's3', archive_file: 'final-b.js', exam_title: '기말 B', school_name: '순천고', grade: '고1', exam_date: '2026-05-20' }
      ],
      wrong_answers: [
        { session_id: 'e1', student_id: 's1', question_id: 3 },
        { session_id: 'e3', student_id: 's3', question_id: 5 }
      ],
      exam_question_reviews: [
        { archive_file: 'mid-a.js', question_no: 1, review_text: '분석' },
        { archive_file: 'exams/mid-a.js', question_no: 2, review_text: '분석' },
        { archive_file: 'no-session.js', question_no: 1, review_text: '제외' }
      ],
      exam_analysis_meta: [],
      exam_blueprints: [
        { archive_file: 'mid-a.js', question_no: 1 },
        { archive_file: 'mid-a.js', question_no: 2 },
        { archive_file: 'mid-a.js', question_no: 3 },
        { archive_file: 'final-b.js', question_no: 1 },
        { archive_file: 'no-session.js', question_no: 1 }
      ]
    }
  },
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const list = context.reportCenterBuildExamHubList();
assert.equal(list.length, 2);

const mid = list.find(row => row.archiveFile === 'exams/mid-a.js');
assert.ok(mid);
assert.equal(mid.title, '중간 A');
assert.equal(mid.school, '왕지중');
assert.equal(mid.grade, '중2');
assert.equal(mid.takers, 2);
assert.equal(mid.wrongEntered, 1);
assert.equal(mid.reviewCount, 2);
assert.equal(mid.blueprintCount, 3);

const final = list.find(row => row.archiveFile === 'exams/final-b.js');
assert.ok(final);
assert.equal(final.takers, 1);
assert.equal(final.wrongEntered, 1);
assert.equal(final.reviewCount, 0);
assert.equal(final.blueprintCount, 1);
assert.equal(list.some(row => row.archiveFile === 'exams/no-session.js'), false);

// Task F(최근 1개월 그룹 + 심플 카드) 기준으로 렌더 계약 갱신.
// 이 테스트의 세션 날짜(2026-05~06)는 항상 30일 밖이므로 기본 화면에는 뜨지 않고
// "1개월 이전 시험지" 아카이브 안내로 빠진다. 최근/검색/코호트 카드 렌더는
// tests/report-center-hub-grade-grouping.test.mjs 가 담당한다.
const html = context.reportCenterBuildDrilldownShell('s1');
assert.match(html, /최근 1개월/);
assert.match(html, /1개월 이전 시험지 2개는 위 검색으로/);
assert.match(html, /최근 1개월 시험지가 없습니다/);
// 상태 배지/구형 카드 클래스는 제거되었다.
assert.doesNotMatch(html, /aprc-exam-card/);
assert.doesNotMatch(html, /문항분석/);
assert.doesNotMatch(html, /오답입력/);

console.log('report center exam hub test passed');
