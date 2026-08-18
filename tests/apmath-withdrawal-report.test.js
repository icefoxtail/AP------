const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const admin = fs.readFileSync(path.join(root, 'apmath/js/dashboard-admin.js'), 'utf8');
const teacher = fs.readFileSync(path.join(root, 'apmath/js/dashboard-teacher.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'apmath/css/dashboard-foundation.css'), 'utf8');
const studentsRoute = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/students.js'), 'utf8');
const logsRoute = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/foundation-logs.js'), 'utf8');

assert(admin.includes('function openWithdrawalReport()'), 'shared withdrawal report entry should exist');
assert(admin.includes("{ year: currentYear, semester: '', month: '', grade: '' }"), 'withdrawal report should default to current year and expose semester, month, and grade filters');
assert(admin.includes("apSetWithdrawalReportFilter('year'"), 'withdrawal report should render a year filter');
assert(admin.includes("apSetWithdrawalReportFilter('semester'"), 'withdrawal report should render a semester filter');
assert(admin.includes("apSetWithdrawalReportFilter('month'"), 'withdrawal report should render a month filter');
assert(admin.includes("apSetWithdrawalReportFilter('grade'"), 'withdrawal report should render a grade filter');
assert(admin.includes("adminGetStatusChangeDate(student.id, '퇴원')"), 'withdrawal date should come from status history');
assert(admin.includes('adminGetStudentClassMap(student.id)') && admin.includes('cls?.teacher_name'), 'report should infer the teacher from the retained class assignment');
assert(admin.includes("const isAdmin = apAdminDashboardRole() === 'admin'"), 'admin actions should be role gated');
assert.strictEqual((studentsRoute.match(/if \(!isAdminUser\(teacher\)\) return jsonResponse\(\{ error: 'Forbidden' \}, 403\);/g) || []).length >= 2, true, 'restore and hide mutations should both enforce admin authorization on the server');
assert(!teacher.includes('openWithdrawalReport()') && !teacher.includes('>퇴원생</span>'), 'teacher quick actions should keep the original three-card set');
assert(ui.includes("drawerItem('students', '학생관리'") && ui.includes("drawerItem('discharged', '퇴원생', \"closeAppDrawer(); if(typeof openWithdrawalReport==='function') openWithdrawalReport()"), 'teacher sidebar should place the withdrawal report directly after student management');
assert(css.includes('.ap-withdrawal-filters') && css.includes('@media (max-width:700px)'), 'withdrawal report should have scoped responsive styles');
assert(css.includes('body.ap-teacher-dashboard-mode .ap-dash-redesign .ap-dash-quick-grid') && css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'), 'teacher quick actions should retain the original three-column grid');
assert(admin.includes('function apAnnounceWithdrawalReportResults(count)') && admin.includes('data-withdrawal-filter') && admin.includes('data-withdrawal-reset'), 'filter updates should announce results and restore keyboard focus');

const deleteBlock = studentsRoute.match(/if \(method === 'DELETE' && id\) \{([\s\S]*?)\n  \}/);
assert(deleteBlock, 'student withdrawal route should exist');
assert(deleteBlock[1].includes("UPDATE students SET status = '퇴원'"), 'student delete should mark the student withdrawn');
assert(!deleteBlock[1].includes('DELETE FROM class_students'), 'withdrawal should retain the class assignment used to infer the responsible teacher');
assert(logsRoute.includes('getAllowedClassIds(env, teacher)') && logsRoute.includes('student_id IN (SELECT student_id FROM class_students'), 'teacher status history should stay limited to assigned classes');

const context = {
  console,
  window: {},
  state: {
    auth: { role: 'teacher' },
    ui: {},
    db: {
      students: [
        { id: 's1', name: '김퇴원', school_name: '한빛중', grade: '중2', status: '퇴원' },
        { id: 's2', name: '박재원', grade: '중3', status: '재원' },
        { id: 's3', name: '이퇴원', grade: '고1', status: '퇴원' },
        { id: 's4', name: '최과거', grade: '중1', status: '퇴원', updated_at: '2024-08-11 09:00:00' }
      ],
      classes: [
        { id: 'c1', name: '중2 월수반', grade: '중2', teacher_name: '최선생' },
        { id: 'c2', name: '고1 화목반', grade: '고1', teacher_name: '정선생' },
        { id: 'c3', name: '중1 금요반', grade: '중1', teacher_name: '한선생' }
      ],
      class_students: [
        { class_id: 'c1', student_id: 's1' },
        { class_id: 'c1', student_id: 's2' },
        { class_id: 'c2', student_id: 's3' },
        { class_id: 'c3', student_id: 's4' }
      ],
      student_status_history: [
        { student_id: 's1', new_status: '퇴원', changed_at: '2026-05-14 18:30:00' },
        { student_id: 's3', new_status: '퇴원', changed_at: '2025-10-02 12:00:00' }
      ]
    }
  },
  normalizeStudentStatus(value) {
    const raw = String(value || '').trim();
    return ['퇴원', '제적', 'withdrawn', 'withdraw'].includes(raw) ? '퇴원' : raw;
  },
  isWithdrawnStudentStatus(value) {
    return context.normalizeStudentStatus(value) === '퇴원';
  },
  apEscapeHtml(value) { return String(value == null ? '' : value); },
  showModal(title, body) { context.modal = { title, body }; }
};
vm.createContext(context);
vm.runInContext(admin, context);

const rows = context.apBuildWithdrawalReportRows();
assert.strictEqual(rows.length, 3, 'report rows should include current and legacy withdrawn students');
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(rows.map(row => [row.student.id, row.year, row.month, row.semester, row.grade, row.className, row.teacherName]))),
  [
    ['s1', '2026', '5', '1학기', '중2', '중2 월수반', '최선생'],
    ['s3', '2025', '10', '2학기', '고1', '고1 화목반', '정선생'],
    ['s4', '2024', '8', '2학기', '중1', '중1 금요반', '한선생']
  ],
  'report should derive year, semester, month, grade, class, and teacher from existing data'
);

context.state.ui.withdrawalReportFilters = { year: '2026', semester: '1학기', month: '5', grade: '중2' };
context.renderWithdrawalReportModal();
assert(context.modal.title.includes('1명') && context.modal.body.includes('김퇴원'), 'combined year, semester, month, and grade filters should select the matching student');
assert(!context.modal.body.includes('이퇴원') && !context.modal.body.includes('최과거'), 'combined filters should exclude non-matching years and grades');
assert(!context.modal.body.includes('>복구</button>'), 'teacher report should stay read-only');

context.state.auth.role = 'admin';
context.renderWithdrawalReportModal();
assert(context.modal.body.includes('>재등원</button>') && context.modal.body.includes('>숨김</button>'), 'admin report should expose management actions');

console.log('apmath withdrawal report test passed');
