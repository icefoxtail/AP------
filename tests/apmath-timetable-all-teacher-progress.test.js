const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const worker = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/index.js'), 'utf8');
const core = fs.readFileSync(path.join(root, 'apmath/js/core.js'), 'utf8');
const timetable = fs.readFileSync(path.join(root, 'apmath/js/timetable.js'), 'utf8');
const classroom = fs.readFileSync(path.join(root, 'apmath/js/classroom.js'), 'utf8');

assert.match(
  worker,
  /ROW_NUMBER\(\) OVER \(PARTITION BY class_id ORDER BY date DESC, created_at DESC, id DESC\)/,
  'initial-data should select the latest record independently for every class'
);
assert.match(
  worker,
  /SELECT id, record_id, class_id, textbook_title_snapshot, progress_text[\s\S]*FROM class_daily_progress/,
  'initial-data should load only the progress fields needed by the timetable'
);
assert.doesNotMatch(
  worker,
  /SELECT id, class_id, date FROM class_daily_records ORDER BY date DESC LIMIT 1000/,
  'timetable progress must not use a global record limit that can omit a class'
);
assert.ok(
  (worker.match(/timetable_class_daily_records:/g) || []).length >= 2,
  'normal and no-assigned-class responses should both expose timetable record data'
);
assert.ok(
  (worker.match(/timetable_class_daily_progress:/g) || []).length >= 2,
  'normal and no-assigned-class responses should both expose timetable progress data'
);
const noAssignedStart = worker.indexOf('if (!classIds.length) {');
const assignedClassesStart = worker.indexOf("const cMarkers = classIds.map(() => '?').join(',');", noAssignedStart);
assert.ok(noAssignedStart >= 0 && assignedClassesStart > noAssignedStart, 'no-assigned-class response branch should remain available');
const noAssignedBranch = worker.slice(noAssignedStart, assignedClassesStart);
assert.match(noAssignedBranch, /timetable_class_daily_records:\s*ttAllDailyRecords\.results/);
assert.match(noAssignedBranch, /timetable_class_daily_progress:\s*ttAllDailyProgress\.results/);
assert.match(core, /timetable_class_daily_records: Array\.isArray\(data\.timetable_class_daily_records\)/);
assert.match(core, /timetable_class_daily_progress: Array\.isArray\(data\.timetable_class_daily_progress\)/);
assert.match(timetable, /class_progress_snapshots/);
assert.match(timetable, /class_progress_items/);
assert.match(timetable, /if \(isTimetableMonthArchiveMode\(\)\) return null;/);

const context = {
  state: {
    db: {
      class_daily_records: [{ id: 'future-record', class_id: 'other-class', date: '2099-08-11', special_note: '미래 일지' }],
      class_daily_progress: [{ id: 'old-progress', record_id: 'future-record', class_id: 'other-class', textbook_title_snapshot: '구 교재', progress_text: '구 진도' }],
      class_progress_snapshots: [
        { id: 'other-snapshot-old', class_id: 'other-class', effective_date: '2026-08-09', updated_at: '2026-08-09T01:00:00Z' },
        { id: 'other-snapshot-latest', class_id: 'other-class', effective_date: '2026-08-11', updated_at: '2026-08-11T01:00:00Z' }
      ],
      class_progress_items: [
        { id: 'other-item-old', snapshot_id: 'other-snapshot-old', class_id: 'other-class', curriculum_key: '2022', level_key: 'middle', course_key: 'M3-1', canonical_path_key: 'other-old-path', l1_snapshot: '이차방정식', l2_snapshot: '이차방정식의 풀이', sort_order: 0 },
        { id: 'other-item-latest', snapshot_id: 'other-snapshot-latest', class_id: 'other-class', curriculum_key: '2022', level_key: 'middle', course_key: 'M3-1', canonical_path_key: 'other-latest-path', l1_snapshot: '이차함수', l2_snapshot: '이차함수의 그래프', sort_order: 0 }
      ],
      class_progress_taxonomy: [
        { canonicalPathKey: 'other-old-path', curriculumKey: '2022', level: 'middle', courseKey: 'M3-1', courseLabel: '중3 과정 · 1학기', l1: '이차방정식', l2: '이차방정식의 풀이' },
        { canonicalPathKey: 'other-latest-path', curriculumKey: '2022', level: 'middle', courseKey: 'M3-1', courseLabel: '중3 과정 · 1학기', l1: '이차함수', l2: '이차함수의 그래프' }
      ]
    },
    ui: { timetableMonthArchive: { active: false, virtualDb: null } }
  },
  window: {},
  document: {},
  console,
  Set,
  Map,
  Array,
  Date,
  String,
  Number,
  Object,
  Math,
  JSON
};
vm.runInNewContext(timetable, context);
const resolvedProgress = context.getTimetableRecentProgress('other-class');
assert.equal(resolvedProgress.date, '2026-08-11');
assert.match(resolvedProgress.text, /이차함수/);
assert.doesNotMatch(resolvedProgress.text, /구 진도/);

context.state.ui.timetableMonthArchive = { active: true, virtualDb: {} };
assert.equal(context.getTimetableRecentProgress('other-class'), null, 'historical archive must fail closed without progress snapshots');

context.state.ui.timetableMonthArchive = { active: false, virtualDb: null };
context.state.db.class_progress_snapshots = [];
context.state.db.class_progress_items = [];
context.state.db.class_daily_records = [{ id: 'legacy-record', class_id: 'other-class', date: '2026-08-11' }];
context.state.db.class_daily_progress = [{ id: 'legacy-progress', record_id: 'legacy-record', class_id: 'other-class', textbook_title_snapshot: '수학책', progress_text: 'p.10~25' }];
const legacyProgress = context.getTimetableRecentProgress('other-class');
assert.equal(legacyProgress.legacy, true);
assert.equal(legacyProgress.text, '수학책 p.10~25');

const syncFunction = classroom.match(/function syncClassDailyRecordToState\(classId, dateStr, record, progressRows\) \{[\s\S]*?\n\}/);
assert.ok(syncFunction, 'syncClassDailyRecordToState should remain available');
const syncContext = {
  state: {
    db: {
      class_daily_records: [{ id: 'record-1', class_id: 'class-1', date: '2026-08-11' }],
      class_daily_progress: [{ id: 'stale-scoped', record_id: 'record-1', class_id: 'class-1', progress_text: '이전 진도' }],
      timetable_class_daily_records: [{ id: 'record-1', class_id: 'class-1', date: '2026-08-11' }],
      timetable_class_daily_progress: [{ id: 'stale-timetable', record_id: 'record-1', class_id: 'class-1', progress_text: '이전 진도' }]
    }
  },
  normalizeClassroomDate: value => value,
  apmsInvalidateDataIndexes: () => {}
};
vm.runInNewContext(
  `${syncFunction[0]}; syncClassDailyRecordToState('class-1', '2026-08-11', ` +
  `{ id: 'record-1', class_id: 'class-1', date: '2026-08-11' }, ` +
  `[{ id: 'fresh-progress', record_id: 'record-1', class_id: 'class-1', progress_text: '새 진도' }]);`,
  syncContext
);
assert.deepEqual(
  Array.from(syncContext.state.db.timetable_class_daily_progress, row => row.id),
  ['fresh-progress'],
  'saving progress should replace the timetable cache immediately'
);

console.log('AP Math timetable all-teacher progress test passed');
