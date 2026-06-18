const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const workerSource = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
const miniClassroomCss = fs.readFileSync(path.join(root, 'eie/css/eie-v2-mini-classroom.css'), 'utf8');
const css = [
  fs.readFileSync(path.join(root, 'eie/css/eie-v2-week-card.css'), 'utf8'),
  fs.readFileSync(path.join(root, 'eie/css/eie-timetable-board.css'), 'utf8'),
  fs.readFileSync(path.join(root, 'eie/css/eie-timetable.css'), 'utf8'),
  miniClassroomCss
].join('\n');

const rows = [{
  id: 'cell_1',
  day_label: '월',
  period_label: '1교시',
  period_order: 1,
  start_time: '15:00',
  end_time: '15:40',
  class_name_raw: '중1A',
  teacher_name_raw: 'Carmen',
  status: 'active',
  assigned_students: [
    { student_id: 's_active', name: '강재원', status: 'active' },
    { student_id: 's_paused', name: '김휴원', status: 'paused' },
    { student_id: 's_recent', name: '박최근', status: 'inactive', student_status: 'inactive', withdrawn_at: '2026-06-02T08:00:00+09:00', match_status: 'confirmed' },
    { student_id: 's_boundary', name: '오경계', status: 'archived', student_status: 'archived', withdrawn_at: '2026-06-01', match_status: 'confirmed' },
    { student_id: 's_old', name: '이오래', status: 'withdrawn', student_status: 'withdrawn', withdrawn_at: '2026-05-31', match_status: 'confirmed' },
    { student_id: 's_missing', name: '최미상', status: 'inactive', student_status: 'inactive', match_status: 'confirmed' },
    { student_id: 's_bug', name: '버그재현', withdrawn_at: '2026-05-03T08:00:00+09:00', match_status: 'confirmed' },
    { student_id: 's_new', name: '신규', status: 'active', enrollment_date: '2026-06-12', match_status: 'confirmed' }
  ]
}];

function functionBody(name) {
  const pattern = new RegExp(`async function ${name}\\s*\\([^)]*\\)\\s*{`);
  const match = source.match(pattern);
  assert(match, `${name} should exist`);
  let index = match.index + match[0].length;
  let depth = 1;
  while (index < source.length && depth > 0) {
    const ch = source[index];
    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;
    index += 1;
  }
  assert.strictEqual(depth, 0, `${name} body should parse`);
  return source.slice(match.index + match[0].length, index - 1);
}

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

function findChip(chips, text) {
  return chips.find(chip => chip.text.includes(text));
}

function assertLateStatusCss(status, label) {
  const reset = '.eie-v2-week-card .eie-v2-card-students > .eie-v2-student-name-chip';
  const selector = `.eie-v2-week-card .eie-v2-card-students > .eie-v2-status-student-chip.${status}`;
  assert(miniClassroomCss.includes(selector), `late-loaded mini classroom CSS should preserve ${label} chips`);
  assert(
    miniClassroomCss.indexOf(reset) < miniClassroomCss.indexOf(selector),
    `${label} color override should come after the generic student chip reset`
  );
}

const state = { timetableCells: [], db: { timetable_cells: [], students: [] } };
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
  Promise,
  localStorage: { getItem() { return ''; } },
  document: {
    addEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; }
  },
  EieApp: {
    escapeHtml(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch]));
    }
  },
  EieState: {
    get() { return state; },
    setTimetableCells(nextRows) {
      state.timetableCells = nextRows;
      state.db.timetable_cells = nextRows;
    }
  },
  EieApi: {
    async getTimetable() {
      return { timetable_cells: rows };
    }
  },
  EieRouter: { open() {} }
};
context.window = context;
context.window.innerWidth = 1280;
context.window.TIMETABLE_WITHDRAWN_TODAY = '2026-06-14';
context.window.addEventListener = function () {};

vm.createContext(context);
vm.runInContext(source, context, { filename: 'eie/js/views/eie-timetable.js' });

(async () => {
  const html = await context.EieTimetableView.render();
  const chips = elementsByClass(html, 'eie-v2-status-student-chip');

  assert(html.includes('강재원'), 'active student should remain visible');
  assert(html.includes('김휴원'), 'paused student should remain visible');
  assert(html.includes('박최근'), 'recent withdrawn student should be visible');
  assert(html.includes('오경계'), 'withdrawal boundary date should be included');
  assert(!html.includes('이오래'), 'withdrawn student older than two months should be hidden');
  assert(!html.includes('최미상'), 'withdrawn student without a withdrawal date should be hidden');
  assert(html.includes('버그재현'), 'confirmed-only legacy payload should remain visible as a non-withdrawn student');
  assert(!html.includes('퇴원 / 2026-05-03'), 'confirmed-only legacy payload should not be treated as withdrawn');
  const withdrawnChip = chips.find(chip => chip.classes.includes('is-withdrawn'));
  assert(withdrawnChip, 'recent withdrawn EIE chip should render as a student status chip');
  assert(/2026-06-02$/.test(withdrawnChip.attrs.title), 'recent withdrawn EIE chip title should carry the withdrawal date');
  assert(html.includes('퇴원 / 2026-06-02'), 'recent withdrawn EIE chip should include withdrawal tooltip');
  const pausedChip = chips.find(chip => chip.classes.includes('is-paused'));
  assert(pausedChip, 'paused EIE chip should render as a student status chip');
  assert(pausedChip.text, 'paused EIE chip should keep text content');
  const newChip = chips.find(chip => chip.classes.includes('is-new'));
  assert(newChip, 'new EIE student should render as a student status chip');
  assert(/\(6\/12\)$/.test(newChip.text), 'new EIE student chip text should show enrollment month/day');
  assert(html.includes('신규(6/12)'), 'new EIE student should show enrollment month/day');
  assert(!html.includes('(신)'), 'new EIE student should not show the old new-student marker');

  assert(source.includes('function renderTimetableStudentStatusChip'), 'EIE timetable should use a single student status chip renderer');
  assert(!source.includes('class="eie-v2-student-name-chip${studentChipStatusClass'), 'student name chip status classes should not be hand-built outside the common renderer');

  assert(css.includes('.eie-v2-student-chip.is-withdrawn'), 'EIE CSS should define student chip withdrawn style');
  assert(css.includes('.eie-v2-card-student.is-withdrawn'), 'EIE CSS should define card student withdrawn style');
  assert(css.includes('.eie-v2-status-student-chip.is-withdrawn'), 'EIE CSS should define common withdrawn status chip style');
  assertLateStatusCss('is-new', 'new-student blue');
  assertLateStatusCss('is-paused', 'paused');
  assertLateStatusCss('is-withdrawn', 'withdrawn');
  assert(css.includes('color: #F9A8B8'), 'EIE withdrawn chip should use very pale pink text');
  assert(css.includes('background: transparent'), 'EIE withdrawn chip should not fill the class box');
  assert(css.includes('border-color: transparent'), 'EIE withdrawn chip should not draw a border');
  assert(css.includes('text-decoration: none'), 'EIE withdrawn chip should not strike through the name');

  const retireBody = functionBody('retireMiniStudent');
  assert(retireBody.includes('window.EieApi.updateStudent'), 'retire flow should update the student status');
  assert(retireBody.includes("status: 'inactive'"), 'retire flow should mark the student inactive');
  assert(retireBody.includes('withdrawn_at'), 'retire flow should send an exact withdrawn_at date');
  assert(!retireBody.includes('batchCellStudentOps'), 'retire flow should not archive/remove timetable assignments');
  assert(!retireBody.includes('removeOps'), 'retire flow should not build remove operations');

  const removeBody = functionBody('removeStudentFromMiniClassroom');
  assert(removeBody.includes('batchCellStudentOps'), 'explicit remove flow should keep assignment removal');
  assert(removeBody.includes('removeOps'), 'explicit remove flow should keep remove operations');

  assert(workerSource.includes('s.status AS student_status'), 'EIE worker SQL should select student status');
  assert(workerSource.includes("status: row.student_status || 'active'"), 'EIE worker payload should expose status from student_status');
  assert(workerSource.includes("student_status: row.student_status || 'active'"), 'EIE worker payload should expose student_status');
  assert(workerSource.includes('s.withdrawn_at'), 'EIE worker should include withdrawn_at in assigned student response');
  assert(workerSource.includes("withdrawn_at = ?"), 'EIE worker should persist explicit withdrawn_at updates');

  console.log('EIE timetable withdrawn students test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
