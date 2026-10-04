const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const dashboardSource = fs.readFileSync(path.join(root, 'apmath', 'js', 'dashboard.js'), 'utf8');
const adminSource = fs.readFileSync(path.join(root, 'apmath', 'js', 'dashboard-admin.js'), 'utf8');

let modalHtml = '';
let statusHistoryFetchCount = 0;

const statusHistoryRows = [
  // s-old withdrew first but was edited recently (updated_at is newer) — must sort below s-new.
  { id: 'ssh-1', student_id: 's-old', old_status: '재원', new_status: '퇴원', changed_at: '2026-03-02 10:00:00' },
  { id: 'ssh-2', student_id: 's-new', old_status: '재원', new_status: '퇴원', changed_at: '2026-07-01 10:00:00' },
  { id: 'ssh-3', student_id: 's-mid', old_status: '재원', new_status: '휴원', changed_at: '2026-04-01 10:00:00' },
  { id: 'ssh-4', student_id: 's-mid', old_status: '휴원', new_status: '퇴원', changed_at: '2026-05-10 10:00:00' },
  { id: 'ssh-5', student_id: 's-leave', old_status: '재원', new_status: '휴원', changed_at: '2026-06-15 10:00:00' },
  { id: 'ssh-6', student_id: 's-leave2', old_status: '재원', new_status: '휴원', changed_at: '2026-02-20 10:00:00' }
];

const context = {
  console,
  Date,
  window: {},
  setTimeout() {},
  requestAnimationFrame(callback) { callback(); },
  navigator: {},
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
  isWithdrawnStudentStatus(value) {
    return context.normalizeStudentStatus(value) === '퇴원';
  },
  api: {
    async get(pathname) {
      if (String(pathname).startsWith('foundation-logs/status-history')) {
        statusHistoryFetchCount += 1;
        return { success: true, data: statusHistoryRows };
      }
      return { success: true, data: [] };
    }
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
      students: [
        { id: 's-old', name: 'Old Withdrawn', status: '퇴원', created_at: '2025-01-05 09:00:00', updated_at: '2026-07-10 09:00:00' },
        { id: 's-new', name: 'New Withdrawn', status: '퇴원', created_at: '2024-03-01 09:00:00', updated_at: '2026-07-01 09:00:00' },
        { id: 's-mid', name: 'Mid Withdrawn', status: '퇴원', created_at: '2026-06-30 09:00:00', updated_at: '2026-05-10 09:00:00' },
        { id: 's-none', name: 'No History Withdrawn', status: '퇴원', created_at: '2023-02-01 09:00:00', updated_at: '2026-07-12 09:00:00' },
        { id: 's-leave', name: 'Leave Recent', status: '휴원', created_at: '2022-01-01 09:00:00' },
        { id: 's-leave2', name: 'Leave Older', status: '휴원', created_at: '2026-07-01 09:00:00' },
        { id: 's-active', name: 'Active Student', status: '재원', created_at: '2026-07-01 09:00:00' }
      ],
      classes: [],
      class_students: [],
      consultations: [],
      journals: []
    },
    ui: {}
  },
  toast() {},
  showModal(title, html) { modalHtml = html; }
};

vm.createContext(context);
context.window = context;
vm.runInContext(dashboardSource, context, { filename: 'dashboard.js' });
vm.runInContext(adminSource, context, { filename: 'dashboard-admin.js' });

(async () => {
  // 퇴원생 목록: 실제 퇴원일(상태 변경 이력) 내림차순 정렬
  await context.openAdminStudentList('discharged');

  const order = ['New Withdrawn', 'Mid Withdrawn', 'Old Withdrawn', 'No History Withdrawn'].map(name => modalHtml.indexOf(name));
  assert(order.every(idx => idx >= 0), 'all withdrawn students should render');
  for (let i = 1; i < order.length; i += 1) {
    assert(order[i] > order[i - 1], `discharged list should be sorted by actual withdrawal date desc (position ${i})`);
  }
  assert.doesNotMatch(modalHtml, /Active Student|Leave Recent/, 'discharged list should only contain withdrawn students');
  assert.match(modalHtml, /퇴원: 2026-07-01/, 'row should show the actual withdrawal date');
  assert.match(modalHtml, /퇴원: 2026-05-10/, 'mid student should use the 퇴원 transition, not the earlier 휴원 one');
  assert.match(modalHtml, /등록: 2023-02-01/, 'students without history rows should fall back to the created date');

  // 휴원생 목록: 실제 휴원일 내림차순 정렬
  modalHtml = '';
  await context.openAdminLeaveStudentList();
  const leaveRecentIdx = modalHtml.indexOf('Leave Recent');
  const leaveOlderIdx = modalHtml.indexOf('Leave Older');
  assert(leaveRecentIdx >= 0 && leaveOlderIdx >= 0, 'leave students should render');
  assert(leaveRecentIdx < leaveOlderIdx, 'leave list should be sorted by actual leave date desc');
  assert.match(modalHtml, /휴원: 2026-06-15/, 'leave row should show the actual leave date');

  assert.strictEqual(statusHistoryFetchCount, 1, 'status history should be fetched once and cached');

  console.log('admin-discharged-sort.test.js passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
