import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// 학생 자습 기록(student_self_study_sets): 학생 저장·읽기, 교사 읽기(by-class, detail-data),
// 테이블이 아직 없을 때 FEATURE_UNAVAILABLE, 그리고 원 시험 기록은 건드리지 않는다는 것을 실제 Worker 코드로 본다.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workerDir = path.join(root, 'apmath', 'worker-backup', 'worker');
const requireWorker = createRequire(path.join(workerDir, 'package.json'));
const { Miniflare } = requireWorker('miniflare');
const { build } = requireWorker('esbuild');

const schema = fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8');
const migration = fs.readFileSync(path.join(workerDir, 'migrations', '20261123_student_self_study_sets.sql'), 'utf8');
const token = (id, pin) => crypto.createHash('sha256').update(`${id}:${pin}:student-portal:v1`).digest('hex');
const T1 = '2026-11-23T10:00:00.000Z';
const T2 = '2026-11-23T11:00:00.000Z';
const T3 = '2026-11-23T12:00:00.000Z';

function schemaTable(name) {
  const match = schema.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${name} \\([\\s\\S]*?\\n\\);`));
  assert.ok(match, `schema.sql must define ${name}`);
  return match[0];
}
// D1 exec는 줄마다 한 문장이라, 주석을 빼고 ; 로 나눠 한 문장씩 준비한다.
function statements(sql) {
  return sql.split('\n').filter(line => !line.trim().startsWith('--')).join('\n')
    .split(';').map(part => part.replace(/\s+/g, ' ').trim()).filter(Boolean);
}
const normalizedTable = sql => statements(sql).find(s => /^CREATE TABLE/i.test(s)).replace(/\s*([(),])\s*/g, '$1');

async function startWorker() {
  const bundle = await build({
    stdin: {
      resolveDir: workerDir,
      contents: `
        import { handleStudentPortal } from './routes/student-portal.js';
        import { handleExams } from './routes/exams.js';
        import { handleStudents } from './routes/students.js';
        export default { async fetch(request, env) {
          const url = new URL(request.url);
          const role = request.headers.get('X-Test-Role');
          const teacher = role ? { id: request.headers.get('X-Test-Teacher') || 't1', role, name: '선생님' } : null;
          const parts = url.pathname.split('/').filter(Boolean);
          try {
            let response = null;
            if (parts[1] === 'student-portal') response = await handleStudentPortal(request, env, teacher, parts, url);
            else if (parts[1] === 'exam-sessions') response = await handleExams(request, env, teacher, parts, url);
            else if (parts[1] === 'students') response = await handleStudents(request, env, teacher, parts, url, {});
            return response || new Response('Not found', { status: 404 });
          } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
        } };`
    },
    bundle: true, write: false, format: 'esm', platform: 'browser',
    nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(path.delimiter) : [],
    external: ['cloudflare:*', 'node:*']
  });
  const mf = new Miniflare({
    modules: true, script: bundle.outputFiles[0].text,
    compatibilityDate: '2026-07-11', compatibilityFlags: ['nodejs_compat'], d1Databases: ['DB']
  });
  const db = await mf.getD1Database('DB');
  for (const table of ['class_exam_assignments', 'exam_sessions', 'wrong_answers'])
    await db.prepare(schemaTable(table)).run();
  await db.exec(`
    CREATE TABLE classes (id TEXT PRIMARY KEY, name TEXT, grade TEXT, teacher_name TEXT, is_active INTEGER);
    CREATE TABLE students (id TEXT PRIMARY KEY, name TEXT, school_name TEXT, grade TEXT, student_pin TEXT, status TEXT);
    CREATE TABLE class_students (class_id TEXT, student_id TEXT);
    CREATE TABLE teacher_classes (teacher_id TEXT, class_id TEXT);
    CREATE TABLE class_exam_assignment_recipients (assignment_id TEXT, student_id TEXT);
    CREATE TABLE class_exam_assignment_exclusions (assignment_id TEXT, student_id TEXT, reason TEXT);
    CREATE TABLE parent_contacts (id TEXT, student_id TEXT, is_primary INTEGER, created_at TEXT);
    CREATE TABLE student_status_history (id TEXT, student_id TEXT, changed_at TEXT);
    CREATE TABLE class_transfer_history (id TEXT, student_id TEXT, changed_at TEXT, from_class_id TEXT, to_class_id TEXT);
    ALTER TABLE class_exam_assignments ADD COLUMN pack_id TEXT;
    ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT;
  `);
  await db.batch([
    db.prepare("INSERT INTO classes VALUES ('class-a','A반','고1','t',1),('class-b','B반','고1','t',1)"),
    db.prepare("INSERT INTO students VALUES ('s-a','학생 A','중','고1','1111','재원'),('s-b','학생 B','중','고1','2222','재원'),('s-c','학생 C','중','고1','3333','재원')"),
    db.prepare("INSERT INTO class_students VALUES ('class-a','s-a'),('class-a','s-b'),('class-b','s-c')"),
    db.prepare("INSERT INTO teacher_classes VALUES ('t1','class-a'),('t2','class-b')"),
    db.prepare(`INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,archive_file,source_type)
      VALUES ('as-1','class-a','시험 1','2026-11-20',10,'exams/original/x/one.js','original'),
             ('as-2','class-a','시험 2','2026-11-21',10,'exams/original/x/two.js','original'),
             ('as-x','class-b','다른 반 시험','2026-11-21',10,'exams/original/x/three.js','original')`),
    // s-c는 as-1의 수신자가 아니다. s-b는 as-2에서 제외된 학생이다.
    db.prepare("INSERT INTO class_exam_assignment_recipients VALUES ('as-1','s-a'),('as-1','s-b'),('as-2','s-a'),('as-2','s-b'),('as-x','s-c')"),
    db.prepare("INSERT INTO class_exam_assignment_exclusions VALUES ('as-2','s-b','teacher')")
  ]);
  return { mf, db };
}

async function createSelfStudyTable(db) {
  for (const sql of statements(migration)) await db.prepare(sql).run();
}

async function call(mf, method, url, { headers = {}, body, raw } = {}) {
  const init = { method, headers: { ...headers } };
  if (body !== undefined || raw !== undefined) {
    init.body = raw !== undefined ? raw : JSON.stringify(body);
    init.headers['Content-Type'] = 'application/json';
  }
  const response = await mf.dispatchFetch(`http://local/api/${url}`, init);
  const text = await response.text();
  try { return { status: response.status, body: JSON.parse(text) }; } catch { assert.fail(`HTTP ${response.status}: ${text}`); }
}

const studentA = { student_id: 's-a', student_token: token('s-a', '1111') };
const item = (k, extra = {}) => ({ k, u: null, src: 1, r: null, why: null, n: 0, t: T1, ...extra });
const post = (mf, body, extra = {}) => call(mf, 'POST', 'student-portal/self-study', { body: { ...studentA, assignment_id: 'as-1', kind: 'wrong', ...body, ...extra } });
const teacherHeaders = (id = 't1', role = 'teacher') => ({ 'X-Test-Role': role, 'X-Test-Teacher': id });

test('migration and schema.sql define the same table, with the contract columns and indexes', () => {
  assert.equal(normalizedTable(migration), normalizedTable(schemaTable('student_self_study_sets')));
  const table = normalizedTable(migration);
  for (const column of ['student_id TEXT NOT NULL', 'assignment_id TEXT NOT NULL', "kind TEXT NOT NULL CHECK(kind IN('wrong','similar'))",
    'class_id TEXT', 'items_json TEXT NOT NULL DEFAULT \'[]\'', 'started_at TEXT', 'updated_at TEXT', 'completed_at TEXT',
    'PRIMARY KEY(student_id,assignment_id,kind)']) assert.ok(table.includes(column), column);
  assert.match(migration, /idx_student_self_study_sets_assignment\s+ON student_self_study_sets \(assignment_id, kind\)/);
  assert.match(migration, /idx_student_self_study_sets_class_updated\s+ON student_self_study_sets \(class_id, updated_at\)/);
});

test('before the migration is applied every entry point says FEATURE_UNAVAILABLE and nothing is created', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  const saved = await post(mf, { items: [item('w:1', { r: 'c' })] });
  assert.equal(saved.status, 200);
  assert.equal(saved.body.ok, false);
  assert.equal(saved.body.code, 'FEATURE_UNAVAILABLE');
  const read = await call(mf, 'GET', 'student-portal/self-study?student_id=s-a', { headers: { 'X-Student-Token': studentA.student_token } });
  assert.equal(read.status, 200);
  assert.equal(read.body.code, 'FEATURE_UNAVAILABLE');
  const byClass = await call(mf, 'GET', 'exam-sessions/by-class?class=class-a&assignment=as-1', { headers: teacherHeaders() });
  assert.equal(byClass.status, 200);
  assert.deepEqual(byClass.body.self_study, []);
  assert.equal(byClass.body.self_study_available, false);
  const detail = await call(mf, 'GET', 'students/s-a/detail-data', { headers: teacherHeaders() });
  assert.equal(detail.status, 200);
  assert.deepEqual(detail.body.self_study, []);
  assert.equal(detail.body.self_study_available, false);
  const created = await db.prepare("SELECT name FROM sqlite_master WHERE name = 'student_self_study_sets'").first();
  assert.equal(created, null, 'the Worker must never CREATE the table itself');
});

test('saving needs the student\'s own login and an assignment that is theirs', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  await createSelfStudyTable(db);
  const body = { items: [item('w:1')] };
  assert.equal((await post(mf, body, { student_token: '' })).status, 401);
  assert.equal((await post(mf, body, { student_token: token('s-a', 'wrong-pin') })).status, 401);
  assert.equal((await post(mf, body, { student_id: 's-b' })).status, 401, 'another student\'s id with A\'s token');
  assert.equal((await call(mf, 'POST', 'student-portal/self-study', { raw: 'not json' })).status, 400);
  assert.equal((await post(mf, body, { student_id: 's-c', student_token: token('s-c', '3333') })).status, 404, 's-c is not a recipient of as-1');
  assert.equal((await post(mf, body, { assignment_id: 'as-x' })).status, 404, 'a paper of another class');
  assert.equal((await post(mf, body, { assignment_id: 'nope' })).status, 404);
  const excluded = await post(mf, body, { student_id: 's-b', student_token: token('s-b', '2222'), assignment_id: 'as-2' });
  assert.equal(excluded.status, 404, 'excluded students cannot save for that paper');
  assert.equal((await post(mf, body, { assignment_id: '' })).status, 400);
  const rows = await db.prepare('SELECT COUNT(*) AS n FROM student_self_study_sets').first();
  assert.equal(rows.n, 0, 'nothing was written by the rejected requests');
});

test('invalid kind, result, reason, sizes and shapes are 400', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  await createSelfStudyTable(db);
  const bad = async (body, extra) => assert.equal((await post(mf, body, extra)).status, 400, JSON.stringify(body).slice(0, 120));
  await bad({ items: [item('w:1')] }, { kind: 'other' });
  await bad({ items: [item('w:1')] }, { kind: undefined });
  await bad({ items: 'x' });
  await bad({ items: [null] });
  await bad({ items: [item('w:1', { r: 'x' })] });
  await bad({ items: [item('w:1', { why: 'lazy' })] });
  await bad({ items: [item('')] });
  await bad({ items: [item('k'.repeat(201))] });
  await bad({ items: [{ ...item('w:1'), k: 5 }] });
  await bad({ items: [item('w:1', { src: 1.5 })] });
  await bad({ items: [item('w:1', { n: -1 })] });
  await bad({ items: [item('w:1', { t: 'yesterday' })] });
  await bad({ items: Array.from({ length: 201 }, (_, i) => item(`w:${i}`)) });
  await bad({ items: [item('w:1', { u: 'x'.repeat(70 * 1024) })] });
  assert.equal((await post(mf, { items: Array.from({ length: 200 }, (_, i) => item(`w:${i}`)) })).status, 200, '200 items is allowed');
  assert.equal((await post(mf, { items: [item('k'.repeat(200))] })).status, 200, '200-character key is allowed');
  assert.equal((await post(mf, { items: [item('s:1:file.js:q1', { u: 'uid-1', r: 'u', why: 'guess', src: 1 })] }, { kind: 'similar' })).status, 200);
  const big = JSON.stringify({ ...studentA, assignment_id: 'as-1', kind: 'wrong', items: [], pad: 'x'.repeat(65 * 1024) });
  assert.equal((await call(mf, 'POST', 'student-portal/self-study', { raw: big })).status, 400, 'body over 64KB');
});

test('upsert merges per key by the later t, keeps server-only keys, and counts correct/wrong/unsolved', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  await createSelfStudyTable(db);
  const first = await post(mf, { items: [
    item('w:1', { src: 1, r: 'c', n: 1, t: T2 }),
    item('w:2', { src: 2, r: 'w', why: 'calc', n: 1, t: T2 }),
    item('w:3', { src: 3, t: T1 })
  ] });
  assert.equal(first.status, 200, JSON.stringify(first.body));
  assert.equal(first.body.ok, true);
  assert.deepEqual([first.body.set.total, first.body.set.correct, first.body.set.wrong], [3, 1, 1]);
  assert.equal(first.body.set.completed_at, null, 'w:3 is not solved yet');
  assert.ok(first.body.set.started_at && first.body.set.updated_at);
  assert.equal(first.body.set.class_id, 'class-a');

  const second = await post(mf, { items: [
    item('w:1', { r: 'w', why: 'concept', n: 5, t: T1 }),                       // older than the stored one: loses
    item('w:3', { src: 3, r: 'u', why: 'guess', n: 1, t: T3 }),                 // newer: wins; 모르겠어요 counts as wrong
    item('w:4', { src: 4, u: 'uid-4', t: T3 })                                  // new key
  ] });
  assert.equal(second.status, 200);
  const byKey = Object.fromEntries(second.body.set.items.map(entry => [entry.k, entry]));
  assert.equal(byKey['w:1'].r, 'c');
  assert.equal(byKey['w:1'].n, 1, 'the older client value did not overwrite the newer stored one');
  assert.equal(byKey['w:2'].r, 'w', 'a key the request left out is kept');
  assert.equal(byKey['w:3'].r, 'u');
  assert.equal(byKey['w:4'].u, 'uid-4');
  assert.deepEqual([second.body.set.total, second.body.set.correct, second.body.set.wrong], [4, 1, 2]);
  assert.equal(second.body.set.completed_at, null, 'w:4 is still unsolved');

  const third = await post(mf, { items: [item('w:4', { src: 4, u: 'uid-4', r: 'c', n: 1, t: T3 })] });
  assert.deepEqual([third.body.set.total, third.body.set.correct, third.body.set.wrong], [4, 2, 2]);
  assert.ok(third.body.set.completed_at, 'completed_at is filled once nothing is left unsolved');
  const completedAt = third.body.set.completed_at;
  const again = await post(mf, { items: [item('w:5', { src: 5 })] });
  assert.equal(again.body.set.completed_at, completedAt, 'completed_at is set the first time only');
  assert.equal(again.body.set.total, 5);

  const similar = await post(mf, { items: [item('s:1:f.js:q1', { r: 'c' })] }, { kind: 'similar' });
  assert.equal(similar.body.set.total, 1, 'wrong and similar are separate sets');
  assert.equal(similar.body.set.completed_at !== null, true);
  const count = await db.prepare('SELECT COUNT(*) AS n FROM student_self_study_sets').first();
  assert.equal(count.n, 2);
});

test('self-study never reads or writes the original exam records', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  await createSelfStudyTable(db);
  await db.batch([
    db.prepare(`INSERT INTO exam_sessions (id,student_id,exam_title,score,exam_date,question_count,class_id,archive_file,assignment_id)
      VALUES ('ses-1','s-a','시험 1',80,'2026-11-20',10,'class-a','exams/original/x/one.js','as-1')`),
    db.prepare("INSERT INTO wrong_answers (session_id,question_id,student_id) VALUES ('ses-1','2','s-a')")
  ]);
  await post(mf, { items: [item('w:2', { src: 2, r: 'c', t: T2 })] });
  const session = await db.prepare("SELECT score, updated_at FROM exam_sessions WHERE id = 'ses-1'").first();
  assert.equal(session.score, 80);
  const wrongs = await db.prepare("SELECT question_id FROM wrong_answers WHERE session_id = 'ses-1'").all();
  assert.deepEqual(wrongs.results.map(row => String(row.question_id)), ['2']);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM exam_sessions').first()).n, 1);
});

test('student read: own sets only, aggregate list without items, items for one assignment', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  await createSelfStudyTable(db);
  await post(mf, { items: [item('w:1', { r: 'c' }), item('w:2', { r: 'w', why: 'calc' })] });
  await post(mf, { items: [item('s:1:f.js:q1', { r: 'c' })] }, { kind: 'similar' });
  await post(mf, { items: [item('w:1')] }, { assignment_id: 'as-2' });
  await post(mf, { items: [item('w:9', { r: 'w' })] }, { student_id: 's-b', student_token: token('s-b', '2222') });

  const headers = { 'X-Student-Token': studentA.student_token };
  const list = await call(mf, 'GET', 'student-portal/self-study?student_id=s-a', { headers });
  assert.equal(list.status, 200);
  assert.equal(list.body.ok, true);
  assert.equal(list.body.sets.length, 3);
  assert.ok(list.body.sets.every(set => set.student_id === 's-a' && !('items' in set)), 'aggregates only, no items, no other student');
  const one = await call(mf, 'GET', 'student-portal/self-study?student_id=s-a&assignment_id=as-1', { headers });
  assert.equal(one.body.sets.length, 2);
  assert.deepEqual(one.body.sets.map(set => set.kind).sort(), ['similar', 'wrong']);
  assert.ok(one.body.sets.every(set => Array.isArray(set.items) && set.items.length > 0));
  assert.equal(one.body.sets.find(set => set.kind === 'wrong').items.find(entry => entry.k === 'w:2').why, 'calc');

  assert.equal((await call(mf, 'GET', 'student-portal/self-study?student_id=s-a', { headers: { 'X-Student-Token': token('s-b', '2222') } })).status, 401);
  assert.equal((await call(mf, 'GET', 'student-portal/self-study?student_id=s-a')).status, 401);
});

test('teacher preview can read a student\'s sets only within classes they can access', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  await createSelfStudyTable(db);
  await post(mf, { items: [item('w:1', { r: 'c' })] });
  const own = await call(mf, 'GET', 'student-portal/self-study?student_id=s-a&assignment_id=as-1', { headers: teacherHeaders('t1') });
  assert.equal(own.status, 200);
  assert.equal(own.body.read_only, true);
  assert.equal(own.body.sets[0].items.length, 1);
  assert.equal((await call(mf, 'GET', 'student-portal/self-study?student_id=s-a&assignment_id=as-1', { headers: teacherHeaders('t2') })).status, 403);
  assert.equal((await call(mf, 'GET', 'student-portal/self-study?student_id=s-a', { headers: teacherHeaders('t2') })).status, 403);
  const admin = await call(mf, 'GET', 'student-portal/self-study?student_id=s-a', { headers: teacherHeaders('boss', 'admin') });
  assert.equal(admin.body.sets.length, 1);
});

test('teacher reads: by-class (that assignment only, with items) and detail-data (aggregates only)', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  await createSelfStudyTable(db);
  await post(mf, { items: [item('w:1', { r: 'c' }), item('w:2', { r: 'w', why: 'misread' })] });
  await post(mf, { items: [item('s:1:f.js:q1', { r: 'u' })] }, { kind: 'similar' });
  await post(mf, { items: [item('w:1', { r: 'c' })] }, { assignment_id: 'as-2' });
  await post(mf, { items: [item('w:3', { r: 'w' })] }, { student_id: 's-b', student_token: token('s-b', '2222') });
  await post(mf, { items: [item('w:1', { r: 'c' })] }, { student_id: 's-c', student_token: token('s-c', '3333'), assignment_id: 'as-x' });

  const byClass = await call(mf, 'GET', 'exam-sessions/by-class?class=class-a&assignment=as-1', { headers: teacherHeaders('t1') });
  assert.equal(byClass.status, 200, JSON.stringify(byClass.body));
  assert.equal(byClass.body.success, true);
  assert.equal(byClass.body.self_study_available, true);
  assert.deepEqual(byClass.body.self_study.map(row => `${row.student_id}:${row.kind}`).sort(), ['s-a:similar', 's-a:wrong', 's-b:wrong']);
  const aWrong = byClass.body.self_study.find(row => row.student_id === 's-a' && row.kind === 'wrong');
  assert.deepEqual([aWrong.total, aWrong.correct, aWrong.wrong], [2, 1, 1]);
  assert.ok(aWrong.updated_at);
  assert.equal(aWrong.items.find(entry => entry.k === 'w:2').why, 'misread');
  assert.ok(Array.isArray(byClass.body.sessions) && Array.isArray(byClass.body.students), 'existing fields are still there');
  assert.equal((await call(mf, 'GET', 'exam-sessions/by-class?class=class-a&assignment=as-1', { headers: teacherHeaders('t2') })).status, 403, 'class permission unchanged');

  const detail = await call(mf, 'GET', 'students/s-a/detail-data', { headers: teacherHeaders('t1') });
  assert.equal(detail.status, 200, JSON.stringify(detail.body));
  assert.equal(detail.body.self_study_available, true);
  assert.equal(detail.body.self_study.length, 3);
  assert.ok(detail.body.self_study.every(row => row.student_id === 's-a' && row.assignment_id && !('items' in row)));
  assert.ok(Array.isArray(detail.body.parent_contacts), 'existing fields are still there');
  assert.equal((await call(mf, 'GET', 'students/s-a/detail-data', { headers: teacherHeaders('t2') })).status, 403, 'student permission unchanged');
});

test('omr-submit behaves as before after the lookup was shared', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  const submit = (extra = {}) => call(mf, 'POST', 'student-portal/omr-submit', { body: { ...studentA, assignment_id: 'as-1', wrong_ids: [2, 5], ...extra } });
  const ok = await submit();
  assert.equal(ok.status, 200, JSON.stringify(ok.body));
  assert.equal(ok.body.session.score, 80);
  assert.deepEqual(ok.body.session.wrong_ids, [2, 5]);
  const wrongs = await db.prepare('SELECT question_id FROM wrong_answers WHERE student_id = ? ORDER BY question_id').bind('s-a').all();
  assert.deepEqual(wrongs.results.map(row => String(row.question_id)), ['2', '5']);
  const again = await submit();
  assert.equal(again.body.already_submitted, true);
  assert.equal((await submit({ wrong_ids: [1] })).status, 409);
  assert.equal((await submit({ student_id: 's-c', student_token: token('s-c', '3333') })).status, 404, 'a student outside the recipients');
  assert.equal((await submit({ assignment_id: 'as-2', student_id: 's-b', student_token: token('s-b', '2222') })).status, 404, 'an excluded student');
  assert.equal((await submit({ student_token: 'bad' })).status, 401);
});
