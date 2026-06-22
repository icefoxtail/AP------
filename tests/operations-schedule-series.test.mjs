import test from 'node:test';
import assert from 'node:assert/strict';
import { handleOperations } from '../apmath/worker-backup/worker/routes/operations.js';

function createDb(existing = { target_scope: 'global', student_id: null, teacher_name: '원장' }) {
  const prepared = [];
  const batched = [];
  const DB = {
    prepare(sql) {
      const statement = {
        sql,
        values: [],
        bind(...values) {
          this.values = values;
          return this;
        },
        async first() {
          return existing;
        },
        async run() {
          return { success: true };
        },
        async all() {
          return { results: existing ? [existing] : [] };
        }
      };
      prepared.push(statement);
      return statement;
    },
    async batch(statements) {
      batched.push(...statements);
      return statements.map(() => ({ success: true }));
    }
  };
  return { DB, prepared, batched };
}

function jsonRequest(method, url, body) {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

const admin = { id: 't1', name: '원장', role: 'admin' };

test('existing exam schedule create route remains operational', async () => {
  const env = createDb();
  const request = jsonRequest('POST', 'https://example.test/api/exam-schedules', {
    schoolName: '왕지중',
    grade: '중2',
    examName: '기말고사',
    examDate: '2026-07-10',
    memo: ''
  });
  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'exam-schedules'], new URL(request.url));
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  const insert = env.prepared.find(statement => statement.sql.includes('INSERT INTO exam_schedules'));
  assert.ok(insert);
  assert.equal(insert.values.length, 6);
});

test('batch create inserts all occurrences with one series id', async () => {
  const env = createDb();
  const request = jsonRequest('POST', 'https://example.test/api/academy-schedules/batch', {
    seriesId: 'series-1',
    seriesKind: 'weekly',
    seriesUntil: '2026-07-29',
    items: [
      { scheduleType: 'etc', title: '강사 회의', scheduleDate: '2026-07-01', targetScope: 'global', seriesId: 'wrong-1' },
      { scheduleType: 'etc', title: '강사 회의', scheduleDate: '2026-07-08', targetScope: 'global', seriesId: 'wrong-2' }
    ]
  });

  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'academy-schedules', 'batch'], new URL(request.url));
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.seriesId, 'series-1');
  assert.equal(env.batched.length, 2);
  assert.equal(env.batched[0].values[10], 'series-1');
  assert.equal(env.batched[0].values[11], 'weekly');
  assert.equal(env.batched[0].values[12], '2026-07-29');
});

test('batch rejects mixed target scopes inside one series', async () => {
  const env = createDb();
  const request = jsonRequest('POST', 'https://example.test/api/academy-schedules/batch', {
    seriesId: 'series-1',
    seriesKind: 'range',
    seriesUntil: '2026-07-02',
    items: [
      { scheduleType: 'etc', title: '회의', scheduleDate: '2026-07-01', targetScope: 'global' },
      { scheduleType: 'etc', title: '회의', scheduleDate: '2026-07-02', targetScope: 'teacher' }
    ]
  });
  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'academy-schedules', 'batch'], new URL(request.url));
  assert.equal(response.status, 400);
  assert.equal(env.batched.length, 0);
});

test('series patch updates common fields by series id', async () => {
  const env = createDb();
  const request = jsonRequest('PATCH', 'https://example.test/api/academy-schedules/series/series-1', {
    scheduleType: 'closed',
    title: '학원방학',
    startTime: '09:00',
    endTime: '18:00',
    memo: '전체 휴무',
    isClosed: true,
    seriesKind: 'range',
    seriesUntil: '2026-08-03'
  });

  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'academy-schedules', 'series', 'series-1'], new URL(request.url));
  const payload = await response.json();
  assert.equal(payload.success, true);
  const update = env.prepared.find(statement => statement.sql.includes('WHERE series_id=? AND is_deleted=0'));
  assert.ok(update);
  assert.equal(update.values.at(-1), 'series-1');
  assert.equal(update.values.length, 9);
});

test('series delete soft deletes all occurrences', async () => {
  const env = createDb();
  const request = jsonRequest('DELETE', 'https://example.test/api/academy-schedules/series/series-1');
  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'academy-schedules', 'series', 'series-1'], new URL(request.url));
  const payload = await response.json();
  assert.equal(payload.success, true);
  const deletion = env.prepared.find(statement => statement.sql.includes('SET is_deleted = 1') && statement.sql.includes('series_id'));
  assert.ok(deletion);
  assert.deepEqual(deletion.values, ['series-1']);
});

test('single patch checks ownership of the existing row', async () => {
  const env = createDb({ target_scope: 'global', student_id: null, teacher_name: '원장' });
  const request = jsonRequest('PATCH', 'https://example.test/api/academy-schedules/a1', {
    scheduleType: 'etc',
    title: '변경',
    scheduleDate: '2026-07-01',
    targetScope: 'global'
  });
  const response = await handleOperations(
    request,
    { DB: env.DB },
    { id: 'x', name: '보조', role: 'assistant' },
    ['api', 'academy-schedules', 'a1'],
    new URL(request.url)
  );
  assert.equal(response.status, 403);
});
