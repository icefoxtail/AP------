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
      classes: [{ id: 'c1', name: 'A반' }],
      class_students: [{ class_id: 'c1', student_id: 's1' }],
      exam_sessions: [{ id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_title: '기말', score: 80, question_count: 4 }],
      wrong_answers: [{ session_id: 'e1', student_id: 's1', question_id: 2 }, { session_id: 'e1', student_id: 's1', question_id: 3 }],
      exam_question_reviews: [
        { archive_file: 'exam-a.js', question_no: '2', review_text: JSON.stringify({ concept: '분배법칙', tag: '계산·검산', trap: '부호를 옮기는 단계' }) },
        { archive_file: 'exam-a.js', question_no: '3', review_text: JSON.stringify({ concept: '일차방정식', tag: '계산·검산', trap: '이항 후 정리' }) }
      ],
      exam_analysis_meta: [],
      exam_blueprints: [
        { archive_file: 'exam-a.js', question_no: 2, standard_unit: '식의 계산', difficulty: '중' },
        { archive_file: 'exam-a.js', question_no: 3, standard_unit: '방정식', difficulty: '중' }
      ]
    }
  },
  window: {},
  document: { querySelectorAll: () => [] },
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

const html = context.reportCenterBuildSchoolExamCounselReport('s1', 'exam-a.js');
assert.match(html, /학생별 상담 리포트 1장/);
assert.match(html, /상단 요약/);
assert.match(html, /이번 시험 총평/);
assert.match(html, /오답 원인 요약/);
assert.match(html, /상담 포인트/);
assert.match(html, /학원 조치/);
assert.match(html, /학부모 안내 문구/);
assert.match(html, /계산·검산 유형이 여러 문항/);

context.reportCenterSetCounselEditMode('s1', 'exam-a.js', true);
const editHtml = context.reportCenterBuildSchoolExamCounselReport('s1', 'exam-a.js');
assert.match(editHtml, /textarea/);
assert.match(editHtml, /저장/);

const parent = context.reportCenterBuildSchoolExamParentReport('s1', 'exam-a.js');
assert.doesNotMatch(parent, /코호트|함정|blueprint|review_text|전체 정답률\s*\d+%/);

console.log('report school exam counsel test passed');
