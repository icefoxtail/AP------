const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const workerSource = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
const css = [
  fs.readFileSync(path.join(root, 'eie/css/eie-v2-week-card.css'), 'utf8'),
  fs.readFileSync(path.join(root, 'eie/css/eie-timetable-board.css'), 'utf8'),
  fs.readFileSync(path.join(root, 'eie/css/eie-timetable.css'), 'utf8')
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
    { student_id: 's_recent', name: '박최근', status: 'inactive', student_status: 'inactive', withdrawn_at: '2026-05-02T08:00:00+09:00', match_status: 'confirmed' },
    { student_id: 's_boundary', name: '오경계', status: 'archived', student_status: 'archived', withdrawn_at: '2026-04-14', match_status: 'confirmed' },
    { student_id: 's_old', name: '이오래', status: 'withdrawn', student_status: 'withdrawn', withdrawn_at: '2026-04-13', match_status: 'confirmed' },
    { student_id: 's_missing', name: '최미상', status: 'inactive', student_status: 'inactive', match_status: 'confirmed' },
    { student_id: 's_bug', name: '버그재현', withdrawn_at: '2026-05-03T08:00:00+09:00', match_status: 'confirmed' }
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

  assert(html.includes('강재원'), 'active student should remain visible');
  assert(html.includes('김휴원'), 'paused student should remain visible');
  assert(html.includes('박최근'), 'recent withdrawn student should be visible');
  assert(html.includes('오경계'), 'withdrawal boundary date should be included');
  assert(!html.includes('이오래'), 'withdrawn student older than two months should be hidden');
  assert(!html.includes('최미상'), 'withdrawn student without a withdrawal date should be hidden');
  assert(html.includes('버그재현'), 'confirmed-only legacy payload should remain visible as a non-withdrawn student');
  assert(!html.includes('퇴원 / 2026-05-03'), 'confirmed-only legacy payload should not be treated as withdrawn');
  assert(html.includes('is-withdrawn'), 'recent withdrawn EIE chip should include withdrawn class');
  assert(html.includes('퇴원 / 2026-05-02'), 'recent withdrawn EIE chip should include withdrawal tooltip');
  assert(html.includes('is-paused'), 'paused EIE chip should keep paused class');

  assert(css.includes('.eie-v2-student-chip.is-withdrawn'), 'EIE CSS should define student chip withdrawn style');
  assert(css.includes('.eie-v2-card-student.is-withdrawn'), 'EIE CSS should define card student withdrawn style');
  assert(css.includes('background: #FFF1F4'), 'EIE withdrawn chip should use pale pink background');
  assert(css.includes('color: #BE123C'), 'EIE withdrawn chip should use soft rose text');
  assert(css.includes('border: 1px dashed #FDA4AF'), 'EIE withdrawn chip should use pale pink dashed border');
  assert(css.includes('text-decoration-color: rgba(190, 18, 60, 0.35)'), 'EIE withdrawn chip should use soft rose strike color');

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
