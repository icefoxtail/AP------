const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/timetable.js'), 'utf8');
const studentEditSource = fs.readFileSync(path.join(root, 'apmath/js/student-edit.js'), 'utf8');
const studentRouteSource = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/students.js'), 'utf8');
const apCssFiles = fs.readdirSync(path.join(root, 'apmath/css'))
  .filter(file => file.endsWith('.css'))
  .map(file => ({
    file,
    css: fs.readFileSync(path.join(root, 'apmath/css', file), 'utf8')
  }));

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
  // core.js globals that timetable.js relies on at runtime (core.js loads first in index.html).
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

function decodeHtml(value) {
  return String(value || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function attrsOf(value) {
  const attrs = {};
  String(value || '').replace(/([:\w-]+)="([^"]*)"/g, (_, key, raw) => {
    attrs[key] = decodeHtml(raw);
    return '';
  });
  return attrs;
}

function elementsByClass(html, className) {
  const result = [];
  const pattern = /<(span|button)\b([^>]*)>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = pattern.exec(html))) {
    const attrs = attrsOf(match[2]);
    const classes = String(attrs.class || '').split(/\s+/).filter(Boolean);
    if (!classes.includes(className)) continue;
    result.push({
      tag: match[1],
      attrs,
      classes,
      text: decodeHtml(match[3].replace(/<[^>]+>/g, ''))
    });
  }
  return result;
}

function cssSelectors(css) {
  return String(css || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('{')
    .slice(0, -1)
    .map(part => part.split('}').pop().trim())
    .filter(Boolean);
}

function hasTimetableStudentChipSelector(css) {
  return cssSelectors(css).some(selector =>
    /\.(?:tt-std-name|tt-status-student-chip|tt-new|tt-leave|tt-withdrawn)(?:\b|[.#:[\s>,+~])/u.test(selector)
  );
}
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
const recentChip = elementsByClass(recentHtml, 'tt-status-student-chip')[0];
assert(recentChip, 'AP withdrawn chip should render as a timetable status chip');
assert(recentChip.classes.includes('tt-withdrawn'), 'AP withdrawn status chip should include withdrawn class');
assert(/2026-06-02$/.test(recentChip.attrs.title), 'AP withdrawn status chip title should carry the withdrawal date');
assert(recentHtml.includes('tt-withdrawn'), 'AP withdrawn chip should include withdrawn class');
assert(recentHtml.includes('퇴원 / 2026-06-02'), 'AP withdrawn chip should include withdrawal tooltip');
assert(recentHtml.includes('박최근'), 'AP withdrawn chip should keep the student name visible');

const activeHtml = context.buildTimetableStudentSlot(students.find(student => student.id === 's_active'), 'c1');
const activeChip = elementsByClass(activeHtml, 'tt-status-student-chip')[0];
assert(activeChip, 'active AP student should render as a timetable status chip');
assert(!activeChip.classes.includes('tt-withdrawn'), 'active AP status chip should not receive withdrawn class');
assert(!activeHtml.includes('tt-withdrawn'), 'active student should not receive withdrawn class');

const pausedHtml = context.buildTimetableStudentSlot(paused, 'c1');
const pausedChip = elementsByClass(pausedHtml, 'tt-status-student-chip')[0];
assert(pausedChip, 'paused AP student should render as a timetable status chip');
assert(pausedChip.classes.includes('tt-leave'), 'paused AP status chip should include leave class');
assert(!pausedChip.classes.includes('tt-withdrawn'), 'paused AP status chip should not receive withdrawn class');

const newHtml = context.buildTimetableStudentSlot(students.find(student => student.id === 's_new'), 'c1');
const newChip = elementsByClass(newHtml, 'tt-status-student-chip')[0];
assert(newChip, 'new AP student should render as a timetable status chip');
assert(newChip.classes.includes('tt-new'), 'new AP status chip should include new class');
assert(/\(6\/12\)$/.test(newChip.text), 'new AP status chip text should show enrollment month/day');
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
assert(source.includes('function renderTimetableStudentStatusChip'), 'AP timetable should use a single student status chip renderer');
assert(!source.includes("var cls = 'tt-std-name' +"), 'AP timetable student status classes should not be hand-built in buildTimetableStudentSlot');
assert(sourceCss.includes('.tt-status-student-chip.tt-withdrawn'), 'AP timetable CSS should define common withdrawn status chip style');
assert(sourceCss.includes('.tt-std-name.tt-withdrawn'), 'AP timetable CSS should define withdrawn chip style');
assert(
  sourceCss.indexOf('.tt-std-name {') < sourceCss.indexOf('.tt-status-student-chip.tt-new'),
  'AP timetable status chip overrides should be declared after the base student chip style'
);
assert(
  sourceCss.indexOf('.tt-status-student-chip.tt-new') < sourceCss.indexOf('.tt-status-student-chip.tt-leave') &&
  sourceCss.indexOf('.tt-status-student-chip.tt-leave') < sourceCss.indexOf('.tt-status-student-chip.tt-withdrawn'),
  'AP timetable should keep explicit new/leave/withdrawn status override order'
);
assert(
  apCssFiles.every(item => !hasTimetableStudentChipSelector(item.css)),
  'AP external CSS files should not declare timetable student chip status selectors'
);
assert(sourceCss.includes('color:#F9A8B8'), 'AP withdrawn chip should use very pale pink text');
assert(sourceCss.includes('background:transparent'), 'AP withdrawn chip should not fill the class box');
assert(sourceCss.includes('border:0'), 'AP withdrawn chip should not draw a border');
assert(sourceCss.includes('text-decoration:none'), 'AP withdrawn chip should not strike through the name');

assert(studentEditSource.includes('handleDelete') && studentEditSource.includes('>퇴원 처리</button>'), 'AP student edit should expose a direct withdrawn button');
assert(studentEditSource.includes('id="edit-is-leave"'), 'AP student edit should keep the existing leave input');
assert(studentRouteSource.includes("UPDATE students SET status = '퇴원'"), 'AP student delete route should mark withdrawn instead of removing timetable visibility');
assert(studentRouteSource.includes('INSERT INTO student_status_history'), 'AP withdrawn route should write status history for the two-month timetable window');
assert(!studentRouteSource.includes("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?"), 'AP delete route should not use 제적 for timetable-visible withdrawal');

console.log('apmath timetable withdrawn students test passed');
