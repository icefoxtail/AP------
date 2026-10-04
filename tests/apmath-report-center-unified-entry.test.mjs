import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportSource = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');
const uiSource = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const studentSource = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');

const storage = new Map([['apmath.reportCenter.advanced', 'true']]);
const modalCalls = [];
const context = {
  state: {
    db: {
      students: [{ id: 's1', name: '민준' }, { id: 's2', name: '서연' }],
      classes: [{ id: 'c1', name: '중2A', grade: '중2' }],
      class_students: [{ class_id: 'c1', student_id: 's1' }, { class_id: 'c1', student_id: 's2' }],
      exam_sessions: [
        { id: 'e1', student_id: 's1', class_id: 'c1', archive_file: 'exam-a.js', exam_title: '1학기 기말', exam_date: '2026-06-20', score: 80, question_count: 3 },
        { id: 'e2', student_id: 's2', class_id: 'c1', archive_file: 'exam-a.js', exam_title: '1학기 기말', exam_date: '2026-06-20', score: 100, question_count: 3 },
        { id: 'e3', student_id: 's1', class_id: 'c1', archive_file: '', exam_title: '단원평가', exam_date: '2026-06-21', score: 90, question_count: 10 }
      ],
      wrong_answers: [{ session_id: 'e1', student_id: 's1', question_id: 2 }],
      exam_blueprints: [
        { archive_file: 'exam-a.js', question_no: 1 },
        { archive_file: 'exam-a.js', question_no: 2 },
        { archive_file: 'exam-a.js', question_no: 3 }
      ],
      exam_question_reviews: [{ archive_file: 'exams/exam-a.js', question_no: 2, review_text: '2번 분석' }],
      exam_analysis_meta: []
    }
  },
  window: {},
  document: { getElementById: () => null },
  localStorage: {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key)
  },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
context.reportCenterShowWideModal = (title, html) => modalCalls.push({ title, html });
vm.createContext(context);
vm.runInContext(reportSource, context, { filename: 'apmath/js/report.js' });
context.reportCenterShowWideModal = (title, html) => modalCalls.push({ title, html });

assert.equal(context.reportCenterAdvancedMode(), true, 'test starts with advanced preference on');
context.openReportCenterHome();
const home = modalCalls.at(-1);
assert.ok(home, 'home entry should open a modal');
assert.match(home.html, /data-report-center-mode="drilldown"/, 'home entry should force school exam drilldown even when advanced is on');
assert.match(home.html, /리포트 센터/);
assert.match(home.html, /학교시험 분석, 학생 리포트, 상담\/발송 문구를 한 곳에서 관리합니다\./);
assert.match(home.html, /학교시험 분석/);
assert.match(home.html, /오늘 리포트/);
assert.match(home.html, /평가 리포트/);
assert.match(home.html, /상담 리포트/);

const groups = context.reportCenterGetSchoolExamGroups();
assert.equal(groups.length, 1, 'archive-backed exams should be grouped for school exam analysis');
assert.equal(groups[0].takerCount, 2);
assert.equal(groups[0].classIds.length, 1);

const legacy = context.reportCenterGetLegacyExamReportSessions('s1');
assert.equal(legacy.length, 1, 'archive-less academy evaluations should remain in legacy evaluation reports');
assert.equal(legacy[0].id, 'e3');

const dashboard = context.reportCenterBuildExamDashboard('', groups[0].key);
assert.match(dashboard, /중2A/);
assert.match(dashboard, /학생 리포트/);
assert.match(dashboard, /반 선택/);
assert.match(dashboard, /학생 선택/);
assert.match(dashboard, /시험 대시보드 보기/);
// 반/학생 선택 카드는 클리닉 디자인 언어(aprc-pick-*) 클래스로 렌더된다.
assert.match(dashboard, /class="aprc-pick-grid"/);
assert.match(dashboard, /class="aprc-pick-card"/);
assert.match(dashboard, /aprc-pick-card__name/);

const picker = context.reportCenterBuildStudentPickerView(groups[0].key, 'c1');
assert.match(picker, /선택 2명 \/ 응시 2명/);
assert.match(picker, /민준/);
assert.match(picker, /서연/);
assert.doesNotMatch(picker, /출력 불가/);
assert.doesNotMatch(picker, /1학기 기말 · 오답/);
assert.match(picker, /class="aprc-pick-grid aprc-pick-grid--tight"/);
assert.match(picker, /class="aprc-pick-label"/);

const batchDoc = context.reportCenterBuildBatchPrintDocument([
  { studentId: 's1', sessionId: 'e1' },
  { studentId: 's2', sessionId: 'e2' }
]);
assert.match(batchDoc, /report-center-batch-page/);
assert.match(batchDoc, /AP MATH REPORT/);
assert.match(batchDoc, /1학기 기말 분석 리포트/);
assert.match(batchDoc, /학생\/시험 정보/);
assert.match(batchDoc, /점수 요약/);
assert.match(batchDoc, /정답률/);
assert.doesNotMatch(batchDoc, /학교시험 상세 리포트|상세 학부모 리포트|먼저 볼 문항|우선 확인 문항|실제 문항|Misplaced &/);
assert.doesNotMatch(batchDoc, /평가 분석 리포트/);

assert.match(reportSource, /function reportCenterOpenBatchPrintView/);
assert.match(reportSource, /report-center-batch-page/);
assert.match(reportSource, /reportKind: 'schoolExamDetail'/);
assert.match(uiSource, /리포트 센터/);
assert.match(uiSource, /openReportCenterHome/);
assert.match(studentSource, /reportCenterOpenStudentDrilldown/);

console.log('apmath report center unified entry test passed');
