const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const dashboardSource = fs.readFileSync(path.join(root, 'apmath', 'js', 'dashboard.js'), 'utf8');
const adminSource = fs.readFileSync(path.join(root, 'apmath', 'js', 'dashboard-admin.js'), 'utf8');

const today = new Date().toLocaleDateString('sv-SE');
const context = {
  console,
  Date,
  window: {},
  setTimeout() {},
  requestAnimationFrame(callback) { callback(); },
  navigator: {},
  // core.js globals dashboard-admin.js relies on at runtime (core.js loads first in index.html).
  normalizeStudentStatus(value) {
    const raw = String(value || '').trim();
    if (!raw) return '재원';
    if (raw === '제적' || raw === '퇴원' || raw === 'withdrawn' || raw === 'withdraw') return '퇴원';
    if (raw === '숨김' || raw === 'hidden') return '숨김';
    if (raw === '휴원' || raw === 'paused') return '휴원';
    if (raw === '재원' || raw === 'active') return '재원';
    return raw;
  },
  isActiveStudentStatus(value) {
    return context.normalizeStudentStatus(value) === '재원';
  },
  document: {
    body: { classList: { add() {}, remove() {} } },
    head: { appendChild() {} },
    createElement() { return { style: {}, setAttribute() {}, appendChild() {} }; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById() { return null; }
  },
  state: {
    auth: { role: 'admin' },
    db: {
      students: [{ id: 's-test', name: 'Test Student', status: 'active', created_at: `${today} 09:00:00` }],
      classes: [{ id: 'class-a', name: 'Class A', teacher_name: 'Teacher A', is_active: 1 }],
      class_students: [{ student_id: 's-test', class_id: 'class-a' }],
      consultations: [{
        id: 'c-test',
        student_id: 's-test',
        date: today,
        type: 'grade',
        content: 'Needs algebra follow-up before finals.',
        next_action: 'Call parent this week.',
        created_at: `${today} 09:00:00`
      }],
      journals: []
    },
    ui: {}
  },
  toast() {},
  showModal() {}
};

vm.createContext(context);
context.window = context;
vm.runInContext(dashboardSource, context, { filename: 'dashboard.js' });
vm.runInContext(adminSource, context, { filename: 'dashboard-admin.js' });

const fixedTodayTime = context.apParseLocalDateTime('2026-05-27');
assert.strictEqual(
  context.adminIsRecentStudent({ created_at: '2026-03-29' }, fixedTodayTime, 60),
  true,
  '60-day recent student window should include the boundary date'
);
assert.strictEqual(
  context.adminIsRecentStudent({ created_at: '2026-03-28' }, fixedTodayTime, 60),
  false,
  '60-day recent student window should exclude older students'
);

const html = context.renderAdminRecentConsultationPanel();
assert.match(html, /Test Student/);
assert.match(html, /Class A/);
assert.match(html, /grade/);
assert.match(html, /Needs algebra follow-up before finals\./);
assert.match(html, /Call parent this week\./);
assert.match(html, /openAdminStudentConsultationHistory/);

const recentStudents = Array.from({ length: 12 }, (_, index) => ({
  id: `recent-${index}`,
  name: `Recent ${index}`,
  status: 'active',
  created_at: `${today} 09:${String(index).padStart(2, '0')}:00`
}));
context.state.db.students = recentStudents;
context.state.db.class_students = recentStudents.map(s => ({ student_id: s.id, class_id: 'class-a' }));
context.state.db.attendance = [];
context.state.db.homework = [];
context.state.db.exam_sessions = [];

const recentPanelHtml = context.renderAdminNewStudentPanel({
  recentStudents,
  todayTime: Date.now()
});
assert.match(recentPanelHtml, /ap-admin-recent-student-row/);
assert.strictEqual((recentPanelHtml.match(/ap-admin-recent-student-row/g) || []).length, 12, 'recent students panel should keep all rows in the visible and hidden sections');
assert.match(recentPanelHtml, /adminOpenDashboardStudentDetail/, 'recent student rows should open details with dashboard return context');
assert.match(recentPanelHtml, /ap-new-student-more-btn/, 'recent students panel should expose a more button when hidden rows exist');

context.injectDashboardOpsStyles = function injectDashboardOpsStyles() {};
const teacherCardsHtml = context.renderAdminTeacherCards('2026-05-27');
assert.match(teacherCardsHtml, /openAdminRecentTeacherJournals\('Teacher A'\)/, 'recent journal button should open teacher-scoped journal list');

let lastModal = null;
context.showModal = function showModal(title, body) {
  lastModal = { title, body };
};
context.state.db.journals = [
  { id: 'j-new', date: '2026-05-21', teacher_name: 'Teacher A', status: 'submitted', content: 'recent submitted content' },
  { id: 'j-done', date: '2026-05-20', teacher_name: 'Teacher A', status: 'approved', content: 'approved content' },
  { id: 'j-draft', date: '2026-05-15', teacher_name: 'Teacher A', status: 'draft', content: 'draft content' },
  { id: 'j-old', date: '2026-04-27', teacher_name: 'Teacher A', status: 'submitted', content: 'old content' },
  { id: 'j-other', date: '2026-05-22', teacher_name: 'Other', status: 'submitted', content: 'other content' }
];
context.openAdminRecentTeacherJournals('Teacher A', '2026-05-27');
assert(lastModal, 'recent journal modal should open');
assert.match(lastModal.body, /5\/21/);
assert.match(lastModal.body, /5\/20/);
assert.match(lastModal.body, /openAdminJournalFeedback\('j-new', 'Teacher A'\)/);
assert.doesNotMatch(lastModal.body, /draft content|old content|other content|recent submitted content/, 'recent journal modal should list dates only within teacher-scoped 30 days');

console.log('admin recent consultation panel checks passed');
