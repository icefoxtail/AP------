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
assert.match(
  timetable,
  /db\.timetable_class_daily_records[\s\S]*db\.class_daily_records/,
  'timetable should prefer the all-teacher record feed and retain the scoped fallback'
);
assert.match(
  timetable,
  /db\.timetable_class_daily_progress[\s\S]*db\.class_daily_progress/,
  'timetable should prefer the all-teacher progress feed and retain the scoped fallback'
);

const progressFunction = timetable.match(/function getTimetableRecentProgress\(classId\) \{[\s\S]*?\n\}/);
assert.ok(progressFunction, 'getTimetableRecentProgress should remain available');
const context = {
  _getAllDb: () => ({
    class_daily_records: [{ id: 'own-record', class_id: 'own-class', date: '2026-08-10' }],
    class_daily_progress: [{ id: 'own-progress', record_id: 'own-record', class_id: 'own-class', progress_text: '담당 반 진도' }],
    timetable_class_daily_records: [
      { id: 'other-old', class_id: 'other-class', date: '2026-08-09' },
      { id: 'other-latest', class_id: 'other-class', date: '2026-08-11' }
    ],
    timetable_class_daily_progress: [
      { id: 'other-progress-old', record_id: 'other-old', class_id: 'other-class', progress_text: '이전 진도' },
      { id: 'other-progress-latest', record_id: 'other-latest', class_id: 'other-class', textbook_title_snapshot: '수학책', progress_text: '최신 진도' }
    ]
  })
};
vm.runInNewContext(`${progressFunction[0]}; result = getTimetableRecentProgress('other-class');`, context);
assert.equal(context.result.date, '2026-08-11');
assert.equal(context.result.text, '수학책 최신 진도');

const fallbackContext = {
  _getAllDb: () => ({
    class_daily_records: [{ id: 'scoped-record', class_id: 'scoped-class', date: '2026-08-12' }],
    class_daily_progress: [{
      id: 'scoped-progress',
      record_id: 'scoped-record',
      class_id: 'scoped-class',
      textbook_title_snapshot: '담당 교재',
      progress_text: '담당 반 진도'
    }]
  })
};
vm.runInNewContext(`${progressFunction[0]}; result = getTimetableRecentProgress('scoped-class');`, fallbackContext);
assert.equal(fallbackContext.result.date, '2026-08-12');
assert.equal(fallbackContext.result.text, '담당 교재 담당 반 진도');

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
