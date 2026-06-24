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

function createGroupExamDb(rows = []) {
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
          return rows[0] || null;
        },
        async run() {
          return { success: true, meta: { changes: this.values.length || 1 } };
        },
        async all() {
          return { results: rows };
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

test('group exam create inserts date-range rows in one batch', async () => {
  const env = createGroupExamDb();
  const request = jsonRequest('POST', 'https://example.test/api/exam-schedules/group', {
    schoolName: 'Deoma',
    grade: 'G1',
    examName: 'Final',
    startDate: '2026-06-30',
    endDate: '2026-07-02',
    memo: 'math'
  });

  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'exam-schedules', 'group'], new URL(request.url));
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.count, 3);
  assert.equal(env.batched.length, 3);
  assert.deepEqual(env.batched.map(statement => statement.values[4]), ['2026-06-30', '2026-07-01', '2026-07-02']);
});

test('group exam create rejects invalid date range and missing title', async () => {
  const invalidRangeEnv = createGroupExamDb();
  const invalidRangeRequest = jsonRequest('POST', 'https://example.test/api/exam-schedules/group', {
    schoolName: 'Deoma',
    grade: 'G1',
    examName: 'Final',
    startDate: '2026-07-02',
    endDate: '2026-06-30',
    memo: ''
  });
  const invalidRangeResponse = await handleOperations(invalidRangeRequest, { DB: invalidRangeEnv.DB }, admin, ['api', 'exam-schedules', 'group'], new URL(invalidRangeRequest.url));
  assert.equal(invalidRangeResponse.status, 400);
  assert.equal(invalidRangeEnv.batched.length, 0);

  const missingTitleEnv = createGroupExamDb();
  const missingTitleRequest = jsonRequest('POST', 'https://example.test/api/exam-schedules/group', {
    schoolName: 'Deoma',
    grade: 'G1',
    examName: '',
    startDate: '2026-06-30',
    endDate: '2026-07-02',
    memo: ''
  });
  const missingTitleResponse = await handleOperations(missingTitleRequest, { DB: missingTitleEnv.DB }, admin, ['api', 'exam-schedules', 'group'], new URL(missingTitleRequest.url));
  assert.equal(missingTitleResponse.status, 400);
  assert.equal(missingTitleEnv.batched.length, 0);
});

test('group exam patch replaces old occurrences with the new date range in one batch', async () => {
  const env = createGroupExamDb([
    { id: 'e1', exam_date: '2026-06-30', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' },
    { id: 'e2', exam_date: '2026-07-01', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' },
    { id: 'e3', exam_date: '2026-07-02', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' }
  ]);
  const request = jsonRequest('PATCH', 'https://example.test/api/exam-schedules/group', {
    occurrenceIds: ['e1', 'e2', 'e3'],
    schoolName: 'Deoma',
    grade: 'G1',
    examName: 'Final',
    startDate: '2026-07-03',
    endDate: '2026-07-04',
    memo: 'math'
  });

  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'exam-schedules', 'group'], new URL(request.url));
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.count, 2);
  assert.equal(env.batched.length, 3);
  assert.ok(env.batched[0].sql.includes('DELETE FROM exam_schedules'));
  assert.equal(env.batched.filter(statement => statement.sql.includes('INSERT INTO exam_schedules')).length, 2);
});

test('group exam delete rejects missing occurrence ids before deleting', async () => {
  const env = createGroupExamDb([
    { id: 'e1', exam_date: '2026-06-30', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' }
  ]);
  const request = jsonRequest('POST', 'https://example.test/api/exam-schedules/group-delete', {
    occurrenceIds: ['e1', 'e2']
  });

  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'exam-schedules', 'group-delete'], new URL(request.url));
  assert.equal(response.status, 404);
  const deletion = env.prepared.find(statement => statement.sql.includes('DELETE FROM exam_schedules'));
  assert.equal(deletion, undefined);
});

test('group exam delete removes all requested occurrences with one statement', async () => {
  const env = createGroupExamDb([
    { id: 'e1', exam_date: '2026-06-30', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' },
    { id: 'e2', exam_date: '2026-07-01', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' }
  ]);
  const request = jsonRequest('POST', 'https://example.test/api/exam-schedules/group-delete', {
    occurrenceIds: ['e1', 'e2']
  });

  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'exam-schedules', 'group-delete'], new URL(request.url));
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  const deletion = env.prepared.find(statement => statement.sql.includes('DELETE FROM exam_schedules'));
  assert.ok(deletion);
  assert.deepEqual(deletion.values, ['e1', 'e2']);
});

test('group exam patch rejects mixed group rows', async () => {
  const env = createGroupExamDb([
    { id: 'e1', exam_date: '2026-06-30', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' },
    { id: 'e2', exam_date: '2026-07-01', school_name: 'Other', grade: 'G1', exam_name: 'Final', memo: 'math' }
  ]);
  const request = jsonRequest('PATCH', 'https://example.test/api/exam-schedules/group', {
    occurrenceIds: ['e1', 'e2'],
    schoolName: 'Deoma',
    grade: 'G1',
    examName: 'Final',
    startDate: '2026-07-03',
    endDate: '2026-07-04',
    memo: 'math'
  });

  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'exam-schedules', 'group'], new URL(request.url));
  assert.equal(response.status, 400);
  assert.equal(env.batched.length, 0);
});

test('group exam patch rejects non-consecutive occurrence rows', async () => {
  const env = createGroupExamDb([
    { id: 'e1', exam_date: '2026-06-30', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' },
    { id: 'e2', exam_date: '2026-07-01', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' },
    { id: 'e3', exam_date: '2026-07-04', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' }
  ]);
  const request = jsonRequest('PATCH', 'https://example.test/api/exam-schedules/group', {
    occurrenceIds: ['e1', 'e2', 'e3'],
    schoolName: 'Deoma',
    grade: 'G1',
    examName: 'Final',
    startDate: '2026-07-03',
    endDate: '2026-07-05',
    memo: 'math'
  });

  const response = await handleOperations(request, { DB: env.DB }, admin, ['api', 'exam-schedules', 'group'], new URL(request.url));
  assert.equal(response.status, 400);
  assert.equal(env.batched.length, 0);
});

test('group exam delete rejects mixed and non-consecutive rows', async () => {
  const mixedEnv = createGroupExamDb([
    { id: 'e1', exam_date: '2026-06-30', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' },
    { id: 'e2', exam_date: '2026-07-01', school_name: 'Other', grade: 'G1', exam_name: 'Final', memo: 'math' }
  ]);
  const mixedRequest = jsonRequest('POST', 'https://example.test/api/exam-schedules/group-delete', { occurrenceIds: ['e1', 'e2'] });
  const mixedResponse = await handleOperations(mixedRequest, { DB: mixedEnv.DB }, admin, ['api', 'exam-schedules', 'group-delete'], new URL(mixedRequest.url));
  assert.equal(mixedResponse.status, 400);
  assert.equal(mixedEnv.prepared.some(statement => statement.sql.includes('DELETE FROM exam_schedules')), false);

  const gapEnv = createGroupExamDb([
    { id: 'e1', exam_date: '2026-06-30', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' },
    { id: 'e2', exam_date: '2026-07-02', school_name: 'Deoma', grade: 'G1', exam_name: 'Final', memo: 'math' }
  ]);
  const gapRequest = jsonRequest('POST', 'https://example.test/api/exam-schedules/group-delete', { occurrenceIds: ['e1', 'e2'] });
  const gapResponse = await handleOperations(gapRequest, { DB: gapEnv.DB }, admin, ['api', 'exam-schedules', 'group-delete'], new URL(gapRequest.url));
  assert.equal(gapResponse.status, 400);
  assert.equal(gapEnv.prepared.some(statement => statement.sql.includes('DELETE FROM exam_schedules')), false);
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
