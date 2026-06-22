const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const scheduleSource = fs.readFileSync(path.join(root, 'apmath/js/schedule.js'), 'utf8');

function loadScheduleContext(overrides = {}) {
  const context = {
    console,
    Date,
    Map,
    Math,
    state: {
      db: {
        exam_schedules: [],
        academy_schedules: []
      },
      ui: {}
    },
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => []
    },
    toast: () => {},
    apEscapeHtml: value => String(value ?? ''),
    showModal: () => {},
    api: {},
    loadData: async () => {},
    confirm: () => true,
    ...overrides
  };
  vm.createContext(context);
  vm.runInContext(`${scheduleSource}
    globalThis.__schedule = {
      getOccurrenceDateList,
      groupAcademyScheduleRows,
      getUnifiedSchedules,
      getWeekDates,
      openExamScheduleModal
    };`, context);
  return context;
}

test('weekly recurrence keeps only the starting weekday through the end date', () => {
  const context = loadScheduleContext();
  const dates = context.__schedule.getOccurrenceDateList('2026-07-01', '2026-07-31', 'weekly');
  assert.deepEqual(Array.from(dates), [
    '2026-07-01',
    '2026-07-08',
    '2026-07-15',
    '2026-07-22',
    '2026-07-29'
  ]);
});

test('range recurrence includes both start and end dates', () => {
  const context = loadScheduleContext();
  const dates = context.__schedule.getOccurrenceDateList('2026-07-28', '2026-08-03', 'range');
  assert.equal(dates.length, 7);
  assert.equal(dates[0], '2026-07-28');
  assert.equal(dates.at(-1), '2026-08-03');
});

test('academy occurrences aggregate into one visible series row', () => {
  const context = loadScheduleContext();
  context.state.db.academy_schedules = [
    {
      id: 'a1',
      series_id: 's1',
      series_kind: 'range',
      series_until: '2026-07-03',
      schedule_type: 'closed',
      title: '학원방학',
      schedule_date: '2026-07-01',
      target_scope: 'global',
      is_deleted: 0
    },
    {
      id: 'a2',
      series_id: 's1',
      series_kind: 'range',
      series_until: '2026-07-03',
      schedule_type: 'closed',
      title: '학원방학',
      schedule_date: '2026-07-02',
      target_scope: 'global',
      is_deleted: 0
    },
    {
      id: 'a3',
      series_id: 's1',
      series_kind: 'range',
      series_until: '2026-07-03',
      schedule_type: 'closed',
      title: '학원방학',
      schedule_date: '2026-07-03',
      target_scope: 'global',
      is_deleted: 0
    }
  ];

  const rows = context.__schedule.getUnifiedSchedules(new Date('2026-06-30T00:00:00'));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].series_id, 's1');
  assert.equal(rows[0].date, '2026-07-01');
  assert.equal(rows[0].end_date, '2026-07-03');
  assert.deepEqual(Array.from(rows[0].occurrence_dates), ['2026-07-01', '2026-07-02', '2026-07-03']);
});

test('legacy rows without series columns remain standalone schedules', () => {
  const context = loadScheduleContext();
  const grouped = context.__schedule.groupAcademyScheduleRows([
    { id: 'legacy-1', schedule_date: '2026-07-01', schedule_type: 'etc', title: '회의' },
    { id: 'legacy-2', schedule_date: '2026-07-02', schedule_type: 'etc', title: '설명회' }
  ]);
  assert.equal(grouped.length, 2);
  assert.deepEqual(Array.from(grouped, row => row.series_id), ['legacy-1', 'legacy-2']);
});

test('moving to another month clears a stale selected-date filter', () => {
  const context = loadScheduleContext();
  context.state.ui.examCalendarView = 'month';
  context.state.ui.examCalendarMonth = '2026-07-01';
  context.state.ui.examCalendarSelectedDate = '2026-07-15';
  context.__schedule.openExamScheduleModal('2026-08-01');
  assert.equal(context.state.ui.examCalendarSelectedDate, '');
});

test('backend and migration expose the series endpoints and columns', () => {
  const operations = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/operations.js'), 'utf8');
  const migration = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/migrations/20260622_academy_schedules_series.sql'), 'utf8');

  assert.match(operations, /method === 'POST' && id === 'batch'/);
  assert.match(operations, /method === 'PATCH' && id === 'series' && path\[3\]/);
  assert.match(operations, /method === 'DELETE' && id === 'series' && path\[3\]/);
  assert.match(migration, /ADD COLUMN series_id TEXT/);
  assert.match(migration, /idx_academy_schedules_series/);
});

test('date-structure replacement creates the new series before deleting the old one', () => {
  const createIndex = scheduleSource.indexOf("const created = payload.dates.length > 1");
  const deleteIndex = scheduleSource.indexOf("const removed = await api.delete('academy-schedules/series'", createIndex);
  assert.ok(createIndex >= 0);
  assert.ok(deleteIndex > createIndex);
});
