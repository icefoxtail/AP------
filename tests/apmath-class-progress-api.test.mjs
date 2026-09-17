import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { CLASS_PROGRESS_TAXONOMY } from '../apmath/worker-backup/worker/helpers/class-progress-taxonomy.js';
import {
  getClassProgressInitialData,
  handleClassDaily
} from '../apmath/worker-backup/worker/routes/class-daily.js';

function createMockD1(db) {
  return {
    prepare(sql) {
      let params = [];
      const prepared = {
        bind(...nextParams) {
          params = nextParams;
          return prepared;
        },
        async all() {
          return { results: db.prepare(sql).all(...params) };
        },
        async first() {
          return db.prepare(sql).get(...params) || null;
        },
        async run() {
          return { success: true, meta: db.prepare(sql).run(...params) };
        }
      };
      return prepared;
    },
    async batch(statements) {
      db.exec('BEGIN');
      try {
        for (const statement of statements) await statement.run();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      return [];
    }
  };
}

function makeRequest(method, body = null) {
  return new Request('https://worker.test/api/class-progress', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === null ? undefined : JSON.stringify(body)
  });
}

async function call(env, teacher, method, query = '', body = null) {
  const request = makeRequest(method, body);
  const url = new URL(`https://worker.test/api/class-progress${query}`);
  return handleClassDaily(request, env, teacher, ['api', 'class-progress'], url);
}

async function json(response) {
  return response.json();
}

const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE classes (id TEXT PRIMARY KEY, is_active INTEGER DEFAULT 1);
  CREATE TABLE teacher_classes (teacher_id TEXT NOT NULL, class_id TEXT NOT NULL);
  CREATE TABLE class_progress_snapshots (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    effective_date TEXT NOT NULL,
    updated_by_teacher_id TEXT,
    updated_by_teacher_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, effective_date)
  );
  CREATE TABLE class_progress_items (
    id TEXT PRIMARY KEY,
    snapshot_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    curriculum_key TEXT NOT NULL,
    level_key TEXT NOT NULL,
    course_key TEXT NOT NULL,
    canonical_path_key TEXT NOT NULL,
    l1_snapshot TEXT NOT NULL,
    l2_snapshot TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(snapshot_id, canonical_path_key)
  );
  CREATE TABLE class_daily_records (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    date TEXT NOT NULL,
    teacher_name TEXT,
    special_note TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  INSERT INTO classes (id, is_active) VALUES ('c1', 1), ('c2', 1);
  INSERT INTO teacher_classes (teacher_id, class_id) VALUES ('t1', 'c1');
  INSERT INTO class_daily_records (id, class_id, date, special_note)
    VALUES ('legacy-1', 'c1', '2026-08-01', '[단원선택] legacy unit');
`);

const env = { DB: createMockD1(db) };
const teacher = { id: 't1', name: '교사', role: 'teacher' };
const forbiddenTeacher = { id: 't2', name: '다른 교사', role: 'teacher' };
const middlePaths = CLASS_PROGRESS_TAXONOMY.filter(row => row.curriculumKey === '2022' && row.courseKey === 'M3-1');
const highPath = CLASS_PROGRESS_TAXONOMY.find(row => row.curriculumKey === '2022' && row.courseKey === '공통수학1');
assert.ok(middlePaths.length >= 2);
assert.ok(highPath);

function item(row, sortOrder) {
  return {
    curriculum_key: row.curriculumKey,
    level_key: row.level,
    course_key: row.courseKey,
    canonical_path_key: row.canonicalPathKey,
    sort_order: sortOrder
  };
}

let response = await call(env, teacher, 'POST', '', {
  class_id: 'c1',
  effective_date: '2026-09-01',
  items: [item(middlePaths[0], 0), item(highPath, 1)]
});
let payload = await json(response);
assert.equal(response.status, 200);
assert.equal(payload.items.length, 2);

response = await call(env, teacher, 'POST', '', {
  class_id: 'c1',
  effective_date: '2026-09-05',
  items: [item(middlePaths[1], 0), item(highPath, 1)]
});
payload = await json(response);
assert.equal(payload.items.length, 2);

response = await call(env, teacher, 'GET', '?class_id=c1&date=2026-09-03');
payload = await json(response);
assert.equal(payload.snapshot.effective_date, '2026-09-01');
assert.deepEqual(payload.items.map(row => row.canonical_path_key), [middlePaths[0].canonicalPathKey, highPath.canonicalPathKey]);

response = await call(env, teacher, 'GET', '?class_id=c1&date=2026-09-06');
payload = await json(response);
assert.equal(payload.snapshot.effective_date, '2026-09-05');
assert.deepEqual(payload.items.map(row => row.canonical_path_key), [middlePaths[1].canonicalPathKey, highPath.canonicalPathKey]);

// Same class/date is a full snapshot replacement, not a delta append.
response = await call(env, teacher, 'PUT', '', {
  class_id: 'c1',
  effective_date: '2026-09-05',
  items: [item(middlePaths[0], 0)]
});
payload = await json(response);
assert.equal(payload.items.length, 1);
assert.equal(db.prepare('SELECT COUNT(*) AS count FROM class_progress_snapshots WHERE class_id = ? AND effective_date = ?').get('c1', '2026-09-05').count, 1);

response = await call(env, teacher, 'GET', '?class_id=c1&date=2026-09-06');
payload = await json(response);
assert.equal(payload.items.length, 1);
assert.equal(payload.items[0].canonical_path_key, middlePaths[0].canonicalPathKey);

response = await call(env, teacher, 'POST', '', {
  class_id: 'c1',
  effective_date: '2026-09-07',
  items: [{ canonical_path_key: 'not-a-canonical-path' }]
});
payload = await json(response);
assert.equal(response.status, 422);
assert.equal(payload.success, false);

response = await call(env, forbiddenTeacher, 'GET', '?class_id=c1&date=2026-09-06');
assert.equal(response.status, 403);
response = await call(env, forbiddenTeacher, 'POST', '', { class_id: 'c1', effective_date: '2026-09-07', items: [] });
assert.equal(response.status, 403);

response = await call(env, teacher, 'GET', '?class_id=c1&date=2026-08-02');
payload = await json(response);
assert.equal(payload.snapshot, null);
assert.equal(payload.legacy_record.id, 'legacy-1');

const initial = await getClassProgressInitialData(env, teacher, '2026-09-06');
assert.equal(initial.class_progress_snapshots.length, 1);
assert.equal(initial.class_progress_snapshots[0].effective_date, '2026-09-05');
assert.equal(initial.class_progress_items.length, 1);
assert.equal(initial.class_progress_taxonomy.length, CLASS_PROGRESS_TAXONOMY.length);

db.close();
console.log('AP Math persistent class progress API tests passed');
