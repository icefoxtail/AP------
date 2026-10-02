import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { handleClassDaily } from '../apmath/worker-backup/worker/routes/class-daily.js';

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

function makeRequest(method, resource, body = null) {
  return new Request('https://worker.test/api/' + resource, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === null ? undefined : JSON.stringify(body)
  });
}

async function call(env, teacher, method, path, body = null, query = '') {
  const resource = path[0];
  const id = path[1];
  const url = new URL('https://worker.test/api/' + resource + (id ? '/' + id : '') + query);
  return handleClassDaily(makeRequest(method, resource, body), env, teacher, ['api', resource, id].filter(Boolean), url);
}

test('class textbooks persist one canonical progress-course binding per textbook', async () => {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE classes (id TEXT PRIMARY KEY, is_active INTEGER DEFAULT 1);
    CREATE TABLE teacher_classes (teacher_id TEXT NOT NULL, class_id TEXT NOT NULL);
    CREATE TABLE class_textbooks (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      start_date TEXT,
      end_date TEXT,
      sort_order INTEGER DEFAULT 0,
      progress_curriculum_key TEXT,
      progress_level_key TEXT,
      progress_course_key TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    INSERT INTO classes (id, is_active) VALUES ('c1', 1), ('c2', 1);
    INSERT INTO teacher_classes (teacher_id, class_id) VALUES ('t1', 'c1');
  `);

  const env = { DB: createMockD1(db) };
  const teacher = { id: 't1', name: '교사', role: 'teacher' };

  let response = await call(env, teacher, 'POST', ['class-textbooks'], {
    class_id: 'c1',
    title: '개념유형 2-1',
    start_date: '2026-06-23',
    progress_curriculum_key: '2022',
    progress_level_key: 'middle',
    progress_course_key: 'M2-1'
  });
  let payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.item.progress_course_key, 'M2-1');
  const textbookId = payload.item.id;

  response = await call(env, teacher, 'PATCH', ['class-textbooks', textbookId], {
    progress_curriculum_key: '2022',
    progress_level_key: 'middle',
    progress_course_key: 'M1-2'
  });
  payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.item.progress_curriculum_key, '2022');
  assert.equal(payload.item.progress_level_key, 'middle');
  assert.equal(payload.item.progress_course_key, 'M1-2');

  response = await call(env, teacher, 'GET', ['class-textbooks'], null, '?class=c1');
  payload = await response.json();
  assert.equal(payload.items.length, 1);
  assert.equal(payload.items[0].progress_course_key, 'M1-2');

  response = await call(env, teacher, 'PATCH', ['class-textbooks', textbookId], {
    progress_curriculum_key: '2022',
    progress_level_key: '',
    progress_course_key: 'M2-1'
  });
  payload = await response.json();
  assert.equal(response.status, 422);
  assert.match(payload.error, /complete progress course binding required/);

  db.close();
});
