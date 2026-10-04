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
assert.doesNotMatch(html, /Call parent this week\.|후속 없음|다음 조치/, 'recent consultation rows should not emphasize follow-up actions');
assert.match(html, /openAdminStudentConsultationHistory/);

function consultationTestDateDaysAgo(days) {
  const value = new Date();
  value.setDate(value.getDate() - days);
  return value.toLocaleDateString('sv-SE');
}

context.state.db.consultations = [
  { id: 'recent-day-14', student_id: 's-test', date: consultationTestDateDaysAgo(14), content: 'day 14' },
  { id: 'recent-day-15', student_id: 's-test', date: consultationTestDateDaysAgo(15), content: 'day 15' }
];
assert.deepStrictEqual(
  Array.from(context.adminGetRecentConsultationRows(14), row => row.id),
  ['recent-day-14'],
  'recent consultation helper should include day 14 and exclude day 15'
);

const consultationCenterRows = Array.from({ length: 55 }, (_, index) => ({
  id: `c-center-${String(index).padStart(2, '0')}`,
  student_id: 's-test',
  date: index === 0 ? today : (index === 54 ? '2019-01-02' : `2026-01-${String((index % 28) + 1).padStart(2, '0')}`),
  type: index % 2 === 0 ? '학습' : '진로',
  content: index === 54 ? 'Very old consultation remains in the full history.' : `Consultation center row ${index}`,
  next_action: index === 0 ? 'FOLLOWUP_ONLY_SECRET' : '',
  created_at: `2026-01-${String((index % 28) + 1).padStart(2, '0')} 09:00:00`
}));
context.state.db.consultations = consultationCenterRows;
context.openAdminConsultationCenter();

assert.strictEqual(
  context.adminConsultationCenterFilteredRows().length,
  55,
  'full consultation center should use the entire loaded consultation history by default'
);
assert(
  context.adminConsultationCenterFilteredRows().some(row => row.content.includes('Very old consultation')),
  'full consultation center should retain consultations older than 14 days'
);

let consultationCenterHtml = context.renderAdminConsultationCenterBody();
assert.strictEqual(
  (consultationCenterHtml.match(/<article class="ap-admin-consultation-center__item/g) || []).length,
  50,
  'consultation center should render the first 50 rows initially'
);
assert.match(consultationCenterHtml, /50건 더 보기/);
assert.match(consultationCenterHtml, /전체 기간/);
assert.match(consultationCenterHtml, /전체 유형/);

context.handleAdminConsultationCenterShowMore();
consultationCenterHtml = context.renderAdminConsultationCenterBody();
assert.strictEqual(
  (consultationCenterHtml.match(/<article class="ap-admin-consultation-center__item/g) || []).length,
  55,
  'show more should make the remaining consultation rows accessible'
);
assert.doesNotMatch(consultationCenterHtml, /50건 더 보기/);

context.state.ui.adminConsultationCenter.keyword = 'FOLLOWUP_ONLY_SECRET';
assert.strictEqual(
  context.adminConsultationCenterFilteredRows().length,
  0,
  'follow-up action should not be part of consultation center search'
);
context.state.ui.adminConsultationCenter.keyword = 'Very old consultation';
assert.strictEqual(context.adminConsultationCenterFilteredRows().length, 1, 'consultation content should remain searchable');
context.state.ui.adminConsultationCenter.keyword = '';
context.state.ui.adminConsultationCenter.type = '진로';
assert.strictEqual(context.adminConsultationCenterFilteredRows().length, 27, 'consultation type filter should narrow the full history');
context.state.ui.adminConsultationCenter.type = 'all';
context.state.ui.adminConsultationCenter.period = '30';
assert.strictEqual(context.adminConsultationCenterFilteredRows().length, 1, 'recent period filter should exclude older consultation rows');
context.state.ui.adminConsultationCenter.period = 'all';

context.state.ui.adminConsultationCenter.expandedId = 'c-center-00';
consultationCenterHtml = context.renderAdminConsultationCenterBody();
assert.match(consultationCenterHtml, /후속 조치/);
assert.match(consultationCenterHtml, /FOLLOWUP_ONLY_SECRET/);
assert.match(consultationCenterHtml, /학생 상세 보기/);
context.state.ui.adminConsultationCenter.expandedId = '';
context.handleAdminConsultationCenterRowClick('c-center-00', 'admin-consultation-center-row-0');
assert.strictEqual(context.state.ui.adminConsultationCenter.expandedId, 'c-center-00', 'row click should expand a consultation');
context.handleAdminConsultationCenterRowClick('c-center-00', 'admin-consultation-center-row-0');
assert.strictEqual(context.state.ui.adminConsultationCenter.expandedId, '', 'clicking an expanded consultation should collapse it');

context.state.db.consultations = [
  { id: 'period-today', student_id: 's-test', date: consultationTestDateDaysAgo(0), type: '학습', content: 'today' },
  { id: 'period-day-30', student_id: 's-test', date: consultationTestDateDaysAgo(30), type: '학습', content: 'day 30' },
  { id: 'period-day-31', student_id: 's-test', date: consultationTestDateDaysAgo(31), type: '학습', content: 'day 31' },
  { id: 'period-future', student_id: 's-test', date: consultationTestDateDaysAgo(-1), type: '학습', content: 'future' },
  { id: 'period-invalid', student_id: 's-test', date: 'not-a-date', type: '학습', content: 'invalid' }
];
context.state.ui.adminConsultationCenter.period = '30';
assert.deepStrictEqual(
  Array.from(context.adminConsultationCenterFilteredRows(), row => row.id).sort(),
  ['period-day-30', 'period-today'],
  '30-day filter should include its boundary and exclude day 31, future, and invalid dates'
);
context.state.ui.adminConsultationCenter.period = 'all';

const consultationCenterCss = fs.readFileSync(path.join(root, 'apmath', 'css', 'dashboard-foundation.css'), 'utf8');
assert.match(consultationCenterCss, /#modal-content:has\(\.ap-admin-consultation-center\)/, 'consultation center should get a scoped wide modal');
assert.match(consultationCenterCss, /#admin-consultation-center-body/, 'consultation center wrapper should inherit the modal body height for internal scrolling');
assert.match(consultationCenterCss, /@media \(max-width: 700px\)/, 'consultation center should define a mobile layout');

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
