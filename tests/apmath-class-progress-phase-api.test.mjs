import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test, { after } from 'node:test';
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

function makePhaseRequest(method, body = null) {
  return new Request('https://worker.test/api/class-progress-phase', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === null ? undefined : JSON.stringify(body)
  });
}

async function callPhase(env, teacher, method, query = '', body = null) {
  const request = makePhaseRequest(method, body);
  const url = new URL(`https://worker.test/api/class-progress-phase${query}`);
  return handleClassDaily(request, env, teacher, ['api', 'class-progress-phase'], url);
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
  CREATE TABLE class_progress_phases (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    effective_date TEXT NOT NULL,
    phase TEXT NOT NULL CHECK (phase IN ('regular', 'semester1_midterm', 'semester1_final', 'semester2_midterm', 'semester2_final')),
    updated_by_teacher_id TEXT,
    updated_by_teacher_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, effective_date)
  );
  CREATE INDEX idx_class_progress_phases_class_effective
    ON class_progress_phases(class_id, effective_date DESC);
  INSERT INTO classes (id, is_active) VALUES ('c1', 1), ('c2', 1);
  INSERT INTO teacher_classes (teacher_id, class_id) VALUES ('t1', 'c1');
`);

const env = { DB: createMockD1(db) };
const teacher = { id: 't1', name: '교사', role: 'teacher' };
const forbiddenTeacher = { id: 't2', name: '다른 교사', role: 'teacher' };

test('phase GET returns regular when no effective row exists and enforces class access', async () => {
  const response = await callPhase(env, teacher, 'GET', '?class_id=c1&date=2026-08-31');
  assert.ok(response, 'class-progress-phase GET route is registered');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    success: true,
    class_id: 'c1',
    date: '2026-08-31',
    phase: 'regular',
    effective_date: null,
    updated_by_teacher_id: null,
    updated_by_teacher_name: null
  });

  const forbidden = await callPhase(env, forbiddenTeacher, 'GET', '?class_id=c1&date=2026-08-31');
  assert.equal(forbidden.status, 403);
  const unauthorized = await callPhase(env, null, 'GET', '?class_id=c1&date=2026-08-31');
  assert.equal(unauthorized.status, 401);
});

test('phase POST is effective by date and same-date writes upsert in place', async () => {
  let response = await callPhase(env, teacher, 'POST', '', {
    class_id: 'c1', effective_date: '2026-09-01', phase: 'semester2_midterm'
  });
  assert.ok(response, 'class-progress-phase POST route is registered');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).phase, 'semester2_midterm');

  response = await callPhase(env, teacher, 'PUT', '', {
    class_id: 'c1', effective_date: '2026-09-28', phase: 'regular'
  });
  assert.equal(response.status, 200);

  const expectedByDate = [
    ['2026-08-31', 'regular', null],
    ['2026-09-10', 'semester2_midterm', '2026-09-01'],
    ['2026-09-27', 'semester2_midterm', '2026-09-01'],
    ['2026-09-28', 'regular', '2026-09-28'],
    ['2026-10-01', 'regular', '2026-09-28']
  ];
  for (const [date, phase, effectiveDate] of expectedByDate) {
    const getResponse = await callPhase(env, teacher, 'GET', `?class_id=c1&date=${date}`);
    const payload = await getResponse.json();
    assert.equal(payload.phase, phase, `phase at ${date}`);
    assert.equal(payload.effective_date, effectiveDate, `effective date at ${date}`);
  }

  response = await callPhase(env, teacher, 'POST', '', {
    class_id: 'c1', effective_date: '2026-09-01', phase: 'semester1_final'
  });
  assert.equal(response.status, 200);
  const sameDateCount = db.prepare(
    'SELECT COUNT(*) AS count FROM class_progress_phases WHERE class_id = ? AND effective_date = ?'
  ).get('c1', '2026-09-01').count;
  assert.equal(sameDateCount, 1);

  const updatedResponse = await callPhase(env, teacher, 'GET', '?class_id=c1&date=2026-09-10');
  assert.equal((await updatedResponse.json()).phase, 'semester1_final');
  const resumedRegular = await callPhase(env, teacher, 'GET', '?class_id=c1&date=2026-09-28');
  assert.equal((await resumedRegular.json()).phase, 'regular');
});

test('phase writes validate dates and whitelist, and store teacher attribution', async () => {
  let response = await callPhase(env, teacher, 'POST', '', {
    class_id: 'c1', effective_date: '2026-02-30', phase: 'regular'
  });
  assert.ok(response, 'phase validation route is registered');
  assert.equal(response.status, 400);

  response = await callPhase(env, teacher, 'POST', '', {
    class_id: 'c1', effective_date: '2026-09-18', phase: 'exam'
  });
  assert.equal(response.status, 422);

  response = await callPhase(env, forbiddenTeacher, 'POST', '', {
    class_id: 'c1', effective_date: '2026-09-18', phase: 'regular'
  });
  assert.equal(response.status, 403);

  response = await callPhase(env, teacher, 'POST', '', {
    class_id: 'c1', effective_date: '2026-09-18', phase: 'semester2_final'
  });
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.updated_by_teacher_id, 't1');
  assert.equal(payload.updated_by_teacher_name, '교사');
});

test('all five supported phase keys are accepted by the write API', async () => {
  const cases = [
    ['2026-10-01', 'regular'],
    ['2026-10-02', 'semester1_midterm'],
    ['2026-10-03', 'semester1_final'],
    ['2026-10-04', 'semester2_midterm'],
    ['2026-10-05', 'semester2_final']
  ];
  for (const [effectiveDate, phase] of cases) {
    const response = await callPhase(env, teacher, 'POST', '', {
      class_id: 'c1', effective_date: effectiveDate, phase
    });
    assert.equal(response.status, 200, phase);
    assert.equal((await response.json()).phase, phase);
  }
});

test('initial data includes each accessible class with its current phase as of the requested date', async () => {
  const response = await callPhase(env, teacher, 'POST', '', {
    class_id: 'c1', effective_date: '2026-09-01', phase: 'semester2_midterm'
  });
  assert.ok(response, 'class-progress-phase POST route is registered');
  const initial = await getClassProgressInitialData(env, teacher, '2026-09-10');
  assert.ok(Array.isArray(initial.class_progress_phases), 'initial data includes class phases');
  assert.deepEqual(initial.class_progress_phases.map(row => ({
    class_id: row.class_id,
    effective_date: row.effective_date,
    phase: row.phase
  })), [{ class_id: 'c1', effective_date: '2026-09-01', phase: 'semester2_midterm' }]);
});

after(() => db.close());
