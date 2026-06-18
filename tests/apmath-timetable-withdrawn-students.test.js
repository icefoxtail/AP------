const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/timetable.js'), 'utf8');
const studentEditSource = fs.readFileSync(path.join(root, 'apmath/js/student-edit.js'), 'utf8');
const studentRouteSource = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/students.js'), 'utf8');

const context = {
  console,
  Date,
  JSON,
  String,
  Number,
  Array,
  Object,
  Map,
  Set,
  Math,
  apEscapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  },
  document: {
    getElementById() { return null; },
    addEventListener() {}
  },
  window: {},
  state: {
    db: {
      students: [
        { id: 's_active', name: '강재원', status: '재원' },
        { id: 's_paused', name: '김휴원', status: '휴원' },
        { id: 's_recent', name: '박최근', status: '퇴원' },
        { id: 's_boundary', name: '오경계', status: 'inactive' },
        { id: 's_old', name: '이오래', status: '퇴원' },
        { id: 's_missing', name: '최미상', status: 'withdrawn' },
        { id: 's_jejeok_recent', name: '제적최근', status: '제적', updated_at: '2026-06-02 10:00:00' },
        { id: 's_jejeok_old', name: '제적과거', status: '제적', updated_at: '2026-05-31 10:00:00' },
        { id: 's_new', name: '신규', status: '재원', enrollment_date: '2026-06-12' }
      ],
      class_students: [
        { class_id: 'c1', student_id: 's_active' },
        { class_id: 'c1', student_id: 's_paused' },
        { class_id: 'c1', student_id: 's_recent' },
        { class_id: 'c1', student_id: 's_boundary' },
        { class_id: 'c1', student_id: 's_old' },
        { class_id: 'c1', student_id: 's_missing' },
        { class_id: 'c1', student_id: 's_jejeok_recent' },
        { class_id: 'c1', student_id: 's_jejeok_old' },
        { class_id: 'c1', student_id: 's_new' }
      ],
      student_status_history: [
        { student_id: 's_recent', new_status: '퇴원', changed_at: '2026-06-02T09:00:00+09:00' },
        { student_id: 's_boundary', new_status: 'inactive', changed_at: '2026-06-01' },
        { student_id: 's_old', new_status: '퇴원', changed_at: '2026-05-31' }
      ]
    },
    allDb: {}
  }
};
context.window = context;
context.TIMETABLE_WITHDRAWN_TODAY = '2026-06-14';

vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/timetable.js' });

const students = context.getTimetableClassStudentsWithInfo('c1');
const names = students.map(student => student.name);

assert(names.includes('강재원'), 'active student should remain visible');
assert(names.includes('김휴원'), 'paused student should remain visible');
assert(names.includes('박최근'), 'recent withdrawn student should be visible');
assert(names.includes('오경계'), 'withdrawal boundary date should be included');
assert(names.includes('제적최근'), 'recent Jejeok student should be treated as withdrawn and visible');
assert(!names.includes('이오래'), 'withdrawn student older than two months should be hidden');
assert(!names.includes('최미상'), 'withdrawn student without a withdrawal date should be hidden');
assert(!names.includes('제적과거'), 'Jejeok student before June 1 should stay hidden');

const recent = students.find(student => student.id === 's_recent');
assert.strictEqual(recent.isWithdrawn, true, 'recent withdrawn student should be marked');
assert.strictEqual(recent.withdrawalDate, '2026-06-02', 'recent withdrawn date should come from status history');

const recentJejeok = students.find(student => student.id === 's_jejeok_recent');
assert.strictEqual(recentJejeok.isWithdrawn, true, 'recent Jejeok student should be marked as withdrawn');
assert.strictEqual(recentJejeok.withdrawalDate, '2026-06-02', 'recent Jejeok date should fall back to updated_at');

const paused = students.find(student => student.id === 's_paused');
assert.strictEqual(paused.isLeave, true, 'paused student should keep leave marker');
assert.strictEqual(paused.isWithdrawn, false, 'paused student should not be treated as withdrawn');

const recentHtml = context.buildTimetableStudentSlot(recent, 'c1');
assert(recentHtml.includes('tt-withdrawn'), 'AP withdrawn chip should include withdrawn class');
assert(recentHtml.includes('퇴원 / 2026-06-02'), 'AP withdrawn chip should include withdrawal tooltip');
assert(recentHtml.includes('박최근'), 'AP withdrawn chip should keep the student name visible');

const activeHtml = context.buildTimetableStudentSlot(students.find(student => student.id === 's_active'), 'c1');
assert(!activeHtml.includes('tt-withdrawn'), 'active student should not receive withdrawn class');

const newHtml = context.buildTimetableStudentSlot(students.find(student => student.id === 's_new'), 'c1');
assert(newHtml.includes('tt-new'), 'new AP student should keep new-student color');
assert(newHtml.includes('(6/12)'), 'new AP student should show enrollment month/day');
assert(!newHtml.includes('(신)'), 'new AP student should not show the old new-student marker');

const manyHtml = context.buildTimetableStudentSlots(students.concat([
  { id: 'extra1', name: '추가1' },
  { id: 'extra2', name: '추가2' },
  { id: 'extra3', name: '추가3' }
]), 'c1');
assert(!manyHtml.includes('tt-std-slot-more'), 'AP timetable should not render +N hidden student marker');
assert(manyHtml.includes('추가3'), 'AP timetable should render all visible student names instead of +N marker');

const sourceCss = source;
assert(sourceCss.includes('.tt-std-name.tt-withdrawn'), 'AP timetable CSS should define withdrawn chip style');
assert(sourceCss.includes('color:#F9A8B8'), 'AP withdrawn chip should use very pale pink text');
assert(sourceCss.includes('background:transparent'), 'AP withdrawn chip should not fill the class box');
assert(sourceCss.includes('border:0'), 'AP withdrawn chip should not draw a border');
assert(sourceCss.includes('text-decoration:none'), 'AP withdrawn chip should not strike through the name');

assert(studentEditSource.includes('handleDelete') && studentEditSource.includes('>퇴원</button>'), 'AP student edit should expose a direct withdrawn button');
assert(studentEditSource.includes('id="edit-is-leave"'), 'AP student edit should keep the existing leave input');
assert(studentRouteSource.includes("UPDATE students SET status = '퇴원'"), 'AP student delete route should mark withdrawn instead of removing timetable visibility');
assert(studentRouteSource.includes('INSERT INTO student_status_history'), 'AP withdrawn route should write status history for the two-month timetable window');
assert(!studentRouteSource.includes("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?"), 'AP delete route should not use 제적 for timetable-visible withdrawal');

console.log('apmath timetable withdrawn students test passed');
