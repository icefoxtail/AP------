const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

function loadFrontendHarness() {
  const rootEl = { innerHTML: '' };
  const context = {
    console,
    setTimeout,
    window: {
      addEventListener() {},
      print() {}
    },
    document: {
      body: { classList: { add() {}, remove() {} } },
      getElementById(id) {
        return id === 'app-root' ? rootEl : null;
      },
      querySelector(selector) {
        if (selector === '[data-ap-month-input]') return { value: '2026-06' };
        return null;
      },
      querySelectorAll() {
        return [];
      }
    },
    state: { auth: { role: 'admin' } },
    api: {},
    appHistoryRecordView() {}
  };
  context.window.document = context.document;
  context.window.state = context.state;
  vm.createContext(context);
  vm.runInContext(read('apmath/js/timetable-months.js'), context);
  return context;
}

(async () => {
  const workerIndex = read('apmath/worker-backup/worker/index.js');
  const route = read('apmath/worker-backup/worker/routes/timetable-months.js');
  const core = read('apmath/js/core.js');
  const view = read('apmath/js/timetable-months.js');
  const css = read('apmath/css/timetable-months.css');
  const html = read('apmath/index.html');

  assert(workerIndex.includes('handleTimetableMonths'), 'AP worker must import/use monthly timetable route');
  assert(workerIndex.includes("'timetable-months'"), 'AP worker must route timetable-months');
  assert(route.includes('GET') && route.includes('POST'), 'AP monthly route must support GET/POST');
  assert(route.includes('mode !==') && route.includes('409'), 'AP monthly route must reject duplicate insert');
  assert(route.includes('buildSnapshotChangeSet'), 'AP monthly route must expose grouped compare logic');
  assert(route.includes('return `id:${sourceId}`'), 'AP compare must prefer source_student_id before fallback identity');

  [
    'getTimetableMonths',
    'getTimetableMonth',
    'saveTimetableMonthSnapshot',
    'getTimetableMonthChanges'
  ].forEach(name => assert(core.includes(name), `AP core api missing ${name}`));

  assert(view.includes('window.print'), 'AP monthly view must expose print');
  assert(view.includes('data-ap-month-compare'), 'AP monthly view must expose compare button');
  assert(view.includes('ap-month-printing'), 'AP print scope must require monthly print body class');
  assert(css.includes('body.ap-month-printing *'), 'AP print CSS must be scoped behind body class');
  assert(!css.includes('@media print {\n    body *'), 'AP print CSS must not globally hide all print content');
  assert(html.includes('timetable-months.css'), 'AP index must include monthly timetable css');
  assert(html.includes('timetable-months.js'), 'AP index must include monthly timetable js');

  const frontend = loadFrontendHarness();
  const monthEnd = frontend.window.__apTimetableMonthsTest.monthEnd;
  assert.strictEqual(monthEnd('2026-06'), '2026-06-30');
  assert.strictEqual(monthEnd('2026-02'), '2026-02-28');
  assert.strictEqual(monthEnd('2028-02'), '2028-02-29');

  let loadMonthsCalled = false;
  frontend.api.saveTimetableMonthSnapshot = async () => ({ success: false, error: 'snapshot already exists' });
  frontend.api.getTimetableMonths = async () => {
    loadMonthsCalled = true;
    return { success: true, months: [] };
  };
  await frontend.window.__apTimetableMonthsTest.saveSnapshot('insert');
  assert.strictEqual(loadMonthsCalled, false, 'AP saveSnapshot must not reload months on success:false');
  assert.match(frontend.window.__apTimetableMonthsTest.view.error, /already exists|overwrite/i);

  const mod = await import(pathToFileURL(path.join(root, 'apmath/worker-backup/worker/routes/timetable-months.js')).href);
  const previous = {
    timetable_cells: [
      { id: 'cA', source_class_id: 'classA', day_label: 'Mon', period_label: '1', class_name: 'A', teacher_name: 'T' },
      { id: 'cB', source_class_id: 'classB', day_label: 'Tue', period_label: '2', class_name: 'B', teacher_name: 'T' }
    ],
    students: [
      { id: 's1a', snapshot_cell_id: 'cA', source_student_id: 'stu1', display_name: 'Kim' },
      { id: 's1b', snapshot_cell_id: 'cB', source_student_id: 'stu1', display_name: 'Kim' },
      { id: 'sLeft', snapshot_cell_id: 'cA', source_student_id: 'left1', display_name: 'Left' }
    ]
  };
  const current = {
    timetable_cells: [
      { id: 'cA', source_class_id: 'classA', day_label: 'Mon', period_label: '1', class_name: 'A', teacher_name: 'T' },
      { id: 'cC', source_class_id: 'classC', day_label: 'Wed', period_label: '3', class_name: 'C', teacher_name: 'T' }
    ],
    students: [
      { id: 's1a2', snapshot_cell_id: 'cA', source_student_id: 'stu1', display_name: 'Kim' },
      { id: 'sJoin', snapshot_cell_id: 'cC', source_student_id: 'join1', display_name: 'Join' }
    ]
  };
  const changes = mod.buildSnapshotChangeSet(previous, current);
  assert.strictEqual(changes.joined.length, 1, 'new student should be joined');
  assert.strictEqual(changes.left.length, 1, 'fully removed student should be left');
  assert.strictEqual(changes.moved.length, 1, 'partial position removal should be moved, not left');
  assert.strictEqual(changes.moved[0].removed_positions.length, 1);
  assert.strictEqual(changes.moved[0].added_positions.length, 0);

  const movedOnly = mod.buildSnapshotChangeSet(
    {
      timetable_cells: [
        { id: 'oldA', source_class_id: 'classA', day_label: 'Mon', period_label: '1', class_name: 'A', teacher_name: 'T' }
      ],
      students: [
        { id: 'sameOld', snapshot_cell_id: 'oldA', source_student_id: 'same1', display_name: 'Same' }
      ]
    },
    {
      timetable_cells: [
        { id: 'newB', source_class_id: 'classB', day_label: 'Tue', period_label: '2', class_name: 'B', teacher_name: 'T' }
      ],
      students: [
        { id: 'sameNew', snapshot_cell_id: 'newB', source_student_id: 'same1', display_name: 'Same' }
      ]
    }
  );
  assert.strictEqual(movedOnly.joined.length, 0, 'A to B move must not be joined');
  assert.strictEqual(movedOnly.left.length, 0, 'A to B move must not be left');
  assert.strictEqual(movedOnly.moved.length, 1, 'A to B move should be moved');
  assert.strictEqual(movedOnly.moved[0].removed_positions.length, 1);
  assert.strictEqual(movedOnly.moved[0].added_positions.length, 1);

  console.log('AP monthly timetable snapshot contract ok');
})();
