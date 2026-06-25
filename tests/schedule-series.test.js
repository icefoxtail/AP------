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
      buildUnifiedExamScheduleGroups,
      getUnifiedScheduleDisplayDateText,
      isUnifiedScheduleInDate,
      isUnifiedScheduleOverlappingRange,
      getUnifiedSchedules,
      getWeekDates,
      openExamScheduleModal,
      openGroupedExamScheduleActionModal,
      addUnifiedSchedule,
      handleEditGroupedExamSchedule,
      deleteGroupedExamSchedule
    };`, context);
  return context;
}

function scheduleFormDocument(values) {
  return {
    getElementById(id) {
      if (!(id in values)) return null;
      return { value: values[id], style: {}, disabled: false, required: false };
    },
    querySelector: () => null,
    querySelectorAll: () => []
  };
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

test('consecutive exam rows aggregate into one date-range item', () => {
  const context = loadScheduleContext();
  context.state.db.exam_schedules = [
    { id: 'e1', exam_date: '2026-06-30', school_name: 'Deoma', grade: '', exam_name: 'Final', memo: '7/1 math' },
    { id: 'e2', exam_date: '2026-07-01', school_name: 'Deoma', grade: '', exam_name: 'Final', memo: '7/1 math' },
    { id: 'e3', exam_date: '2026-07-02', school_name: 'Deoma', grade: '', exam_name: 'Final', memo: '7/1 math' }
  ];

  const rows = context.__schedule.getUnifiedSchedules(new Date('2026-06-30T00:00:00'));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].date, '2026-06-30');
  assert.equal(rows[0].end_date, '2026-07-02');
  assert.equal(rows[0].memo, '7/1 math');
  assert.deepEqual(Array.from(rows[0].occurrence_ids), ['e1', 'e2', 'e3']);
  assert.equal(context.__schedule.isUnifiedScheduleInDate(rows[0], '2026-07-01'), true);
  assert.equal(context.__schedule.isUnifiedScheduleOverlappingRange(rows[0], '2026-07-01', '2026-07-07'), true);
});

test('non-consecutive exam rows split into separate date-range items', () => {
  const context = loadScheduleContext();
  context.state.db.exam_schedules = [
    { id: 'e1', exam_date: '2026-06-30', school_name: 'Maesan', grade: 'G1', exam_name: 'Final', memo: '' },
    { id: 'e2', exam_date: '2026-07-01', school_name: 'Maesan', grade: 'G1', exam_name: 'Final', memo: '' },
    { id: 'e3', exam_date: '2026-07-04', school_name: 'Maesan', grade: 'G1', exam_name: 'Final', memo: '' }
  ];

  const rows = context.__schedule.getUnifiedSchedules(new Date('2026-06-30T00:00:00'));
  assert.equal(rows.length, 2);
  assert.deepEqual(Array.from(rows, row => [row.date, row.end_date]), [
    ['2026-06-30', '2026-07-01'],
    ['2026-07-04', '2026-07-04']
  ]);
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

test('moving to another month selects the first day instead of showing every schedule', () => {
  const context = loadScheduleContext();
  context.state.ui.examCalendarView = 'month';
  context.state.ui.examCalendarMonth = '2026-07-01';
  context.state.ui.examCalendarSelectedDate = '2026-07-15';
  context.__schedule.openExamScheduleModal('2026-08-01');
  assert.equal(context.state.ui.examCalendarSelectedDate, '2026-08-01');
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

test('grouped exam row opens an action choice before single-occurrence editing', () => {
  assert.match(scheduleSource, /openGroupedExamScheduleActionModal/);
  assert.match(scheduleSource, /openEditUnifiedScheduleModal\('exam', '\$\{apEscapeHtml\(selectedId\)\}'\)/);
  assert.match(scheduleSource, /openEditGroupedExamScheduleModal/);
  assert.match(scheduleSource, /deleteGroupedExamSchedule/);
});

test('grouped exam edit and delete use one server group API call', () => {
  assert.doesNotMatch(scheduleSource, /parseUnifiedScheduleIdList/);
  assert.doesNotMatch(scheduleSource, /for \(const occurrenceId of occurrenceIds\)/);
  assert.match(scheduleSource, /if \(payload\.kind === 'exam'\) \{\s*r = await api\.patch\('exam-schedules\/' \+ id, body\);/);
  assert.match(scheduleSource, /api\.patch\('exam-schedules\/group'/);
  assert.match(scheduleSource, /api\.post\('exam-schedules\/group-delete'/);
});

test('new date-range exam uses one group create API call', async () => {
  const calls = [];
  const context = loadScheduleContext({
    document: scheduleFormDocument({
      'new-sch-kind': 'exam',
      'new-sch-title': 'Final',
      'new-sch-date': '2026-06-30',
      'new-sch-end-date': '2026-07-02',
      'new-sch-repeat': 'single',
      'new-sch-start-time': '',
      'new-sch-end-time': '',
      'new-sch-memo': 'math',
      'new-sch-school': 'Deoma',
      'new-sch-grade': 'G1'
    }),
    api: {
      post: async (resource, body) => {
        calls.push({ resource, body });
        return { success: true };
      }
    }
  });

  await context.__schedule.addUnifiedSchedule();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].resource, 'exam-schedules/group');
  assert.equal(calls[0].body.startDate, '2026-06-30');
  assert.equal(calls[0].body.endDate, '2026-07-02');
});

test('new single-day exam keeps the existing single create API call', async () => {
  const calls = [];
  const context = loadScheduleContext({
    document: scheduleFormDocument({
      'new-sch-kind': 'exam',
      'new-sch-title': 'Final',
      'new-sch-date': '2026-06-30',
      'new-sch-end-date': '',
      'new-sch-repeat': 'single',
      'new-sch-start-time': '',
      'new-sch-end-time': '',
      'new-sch-memo': 'math',
      'new-sch-school': 'Deoma',
      'new-sch-grade': 'G1'
    }),
    api: {
      post: async (resource, body) => {
        calls.push({ resource, body });
        return { success: true };
      }
    }
  });

  await context.__schedule.addUnifiedSchedule();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].resource, 'exam-schedules');
  assert.equal(calls[0].body.examDate, '2026-06-30');
});

test('grouped exam action wording uses actionDate for label and appends date text', () => {
  assert.match(scheduleSource, /const singleEditLabel = actionDate \? '.*' : '.*'/);
  assert.match(scheduleSource, /actionDateText \? `: \$\{apEscapeHtml\(actionDateText\)\}` : ''/);
  assert.match(scheduleSource, /openGroupedExamScheduleActionModal\('[^`]+selectedDate/);
});

test('schedule source has no encoding-corrupted markup', () => {
  // Guards against the UTF-8 round-trip corruption that turned Korean/symbols
  // inside template literals into stray "?" runs (e.g. `>??/button>`), which
  // node --check cannot catch but breaks the rendered month/week navigation.
  assert.ok(!scheduleSource.includes('??/button'), 'found corrupted "??/button" markup');
  assert.ok(!scheduleSource.includes('??/div'), 'found corrupted "??/div" markup');
  assert.ok(!scheduleSource.includes('??/span'), 'found corrupted "??/span" markup');
  // month/week navigation buttons must use safe ASCII entities, not lost glyphs
  assert.match(scheduleSource, /aria-label="이전 달">&lt;<\/button>/);
  assert.match(scheduleSource, /aria-label="다음 달">&gt;<\/button>/);
  assert.match(scheduleSource, /\$\{targetYear\}년 \$\{targetMonth \+ 1\}월<\/div>/);
});
