import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { CLASS_PROGRESS_TAXONOMY } from '../apmath/worker-backup/worker/helpers/class-progress-taxonomy.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonicalPath = path.join(
  repoRoot,
  'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json'
);
const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
const route = fs.readFileSync(path.join(repoRoot, 'apmath/worker-backup/worker/routes/class-daily.js'), 'utf8');
const classroom = fs.readFileSync(path.join(repoRoot, 'apmath/js/classroom.js'), 'utf8');
const core = fs.readFileSync(path.join(repoRoot, 'apmath/js/core.js'), 'utf8');
const timetable = fs.readFileSync(path.join(repoRoot, 'apmath/js/timetable.js'), 'utf8');
const migration = fs.readFileSync(path.join(repoRoot, 'apmath/worker-backup/worker/migrations/20260917_class_persistent_progress.sql'), 'utf8');

const projectionCheck = spawnSync(
  process.execPath,
  ['apmath/worker-backup/worker/scripts/build-class-progress-taxonomy.mjs', '--check'],
  { cwd: repoRoot, encoding: 'utf8' }
);
assert.equal(projectionCheck.status, 0, projectionCheck.stderr || projectionCheck.stdout);

function canonicalPathKey(record) {
  return [record.curriculum, record.level, record.scope, record.majorUnit, record.midUnit]
    .map(value => encodeURIComponent(String(value || '').trim()))
    .join('/');
}

const canonicalPaths = canonical.records
  .filter(record => record && record.defaultSelectable !== false)
  .map(canonicalPathKey)
  .sort();
const projectedPaths = CLASS_PROGRESS_TAXONOMY.map(item => item.canonicalPathKey).sort();
assert.deepEqual(projectedPaths, canonicalPaths, 'projection must cover the canonical L1/L2 paths exactly');
assert.equal(new Set(projectedPaths).size, projectedPaths.length, 'projection paths must be unique');

assert.match(route, /class_progress_snapshots/);
assert.match(route, /class_progress_items/);
assert.match(route, /effective_date <= \?/);
assert.match(route, /ORDER BY s\.effective_date DESC/);
assert.match(route, /findCanonicalProgressItem/);
assert.match(route, /ON CONFLICT\(class_id, effective_date\)/);
assert.match(route, /canAccessClass\(currentTeacher, classId, env\)/);
assert.match(route, /getClassProgressInitialData/);

assert.match(migration, /UNIQUE\(class_id, effective_date\)/);
assert.match(migration, /class_progress_snapshots\(class_id, effective_date DESC\)/);
assert.match(migration, /UNIQUE\(snapshot_id, canonical_path_key\)/);

assert.doesNotMatch(classroom, /var MATH_CURRICULUM_UNITS\s*=/);
assert.match(classroom, /class_progress_taxonomy/);
assert.match(classroom, /api\.get\(`class-progress\?/);
assert.match(classroom, /api\.post\('class-progress'/);
assert.match(classroom, /specialNote = \[preservedLegacyLine, noteText\]/);
assert.match(core, /class_progress_snapshots/);
assert.match(core, /class_progress_taxonomy/);

assert.match(timetable, /if \(isTimetableMonthArchiveMode\(\)\) return null;/);
assert.match(timetable, /class_progress_snapshots/);
assert.match(timetable, /class_progress_items/);
assert.match(timetable, /function getTimetableLegacyDailyProgress/);
assert.match(timetable, /legacy: true/);

// Execute the timetable resolver in a browser-like VM to verify the two key temporal contracts:
// latest-as-of-date persistent state and no current-state leakage into historical archives.
const vmContext = {
  console,
  state: {
    db: {
      class_progress_snapshots: [
        { id: 's1', class_id: 'c1', effective_date: '2026-09-01', updated_at: '2026-09-01T01:00:00Z' },
        { id: 's2', class_id: 'c1', effective_date: '2026-09-05', updated_at: '2026-09-05T01:00:00Z' }
      ],
      class_progress_items: [
        { id: 'i1', snapshot_id: 's1', class_id: 'c1', curriculum_key: '2022', level_key: 'middle', course_key: 'M3-1', canonical_path_key: 'p1', l1_snapshot: '이차방정식', l2_snapshot: '이차방정식의 풀이', sort_order: 0 },
        { id: 'i2', snapshot_id: 's2', class_id: 'c1', curriculum_key: '2022', level_key: 'middle', course_key: 'M3-1', canonical_path_key: 'p2', l1_snapshot: '이차함수', l2_snapshot: '이차함수의 그래프', sort_order: 0 },
        { id: 'i3', snapshot_id: 's2', class_id: 'c1', curriculum_key: '2022', level_key: 'high', course_key: '공통수학1', canonical_path_key: 'p3', l1_snapshot: '다항식', l2_snapshot: '다항식의 연산', sort_order: 1 }
      ],
      class_progress_taxonomy: [
        { canonicalPathKey: 'p1', curriculumKey: '2022', level: 'middle', courseKey: 'M3-1', courseLabel: '중3 과정 · 1학기', l1: '이차방정식', l2: '이차방정식의 풀이' },
        { canonicalPathKey: 'p2', curriculumKey: '2022', level: 'middle', courseKey: 'M3-1', courseLabel: '중3 과정 · 1학기', l1: '이차함수', l2: '이차함수의 그래프' },
        { canonicalPathKey: 'p3', curriculumKey: '2022', level: 'high', courseKey: '공통수학1', courseLabel: '공통수학1', l1: '다항식', l2: '다항식의 연산' }
      ],
      class_daily_records: [{ class_id: 'c1', date: '2026-09-20', special_note: '미래 일지' }]
    },
    ui: { timetableMonthArchive: { active: false, virtualDb: null } }
  },
  window: {},
  document: {},
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
vm.runInNewContext(timetable, vmContext, { filename: 'apmath/js/timetable.js' });
const resolved = vmContext.getTimetableRecentProgress('c1');
assert.ok(resolved);
assert.match(resolved.text, /이차함수/);
assert.match(resolved.text, /공통수학1/);
assert.doesNotMatch(resolved.text, /이차방정식의 풀이/);

vmContext.state.ui.timetableMonthArchive = { active: true, virtualDb: {} };
assert.equal(vmContext.getTimetableRecentProgress('c1'), null, 'archive mode must not borrow active persistent progress');

vmContext.state.ui.timetableMonthArchive = { active: false, virtualDb: null };
vmContext.state.db.class_progress_snapshots = [];
vmContext.state.db.class_progress_items = [];
vmContext.state.db.class_daily_records = [{ id: 'legacy-record', class_id: 'c1', date: '2026-09-06' }];
vmContext.state.db.class_daily_progress = [{ id: 'legacy-progress', record_id: 'legacy-record', class_id: 'c1', textbook_title_snapshot: '개념서', progress_text: 'p.10~25' }];
const legacyResolved = vmContext.getTimetableRecentProgress('c1');
assert.equal(legacyResolved.legacy, true);
assert.equal(legacyResolved.text, '개념서 p.10~25');

console.log('AP Math persistent class progress contract tests passed');
