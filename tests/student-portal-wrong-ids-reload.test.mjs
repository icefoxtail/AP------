import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// 학생 포털이 다시 열렸을 때(제출 직후 클라이언트 값이 아니라 서버 응답만 있을 때) 틀린 번호가 돌아오는지 본다.
// exam_sessions에는 wrong_ids 열이 없고 번호는 wrong_answers에 있다. 본인 세션 것만, 읽기 한 번으로.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workerDir = path.join(root, 'apmath', 'worker-backup', 'worker');
const requireWorker = createRequire(path.join(workerDir, 'package.json'));
const { Miniflare } = requireWorker('miniflare');
const { build } = requireWorker('esbuild');

function schemaTable(schema, name) {
  const match = schema.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${name} \\([\\s\\S]*?\\n\\);`));
  assert.ok(match, `schema.sql must define ${name}`);
  return match[0];
}
const token = (id, pin) => crypto.createHash('sha256').update(`${id}:${pin}:student-portal:v1`).digest('hex');

async function getJson(mf, url, headers = {}) {
  const response = await mf.dispatchFetch(url, { headers });
  const text = await response.text();
  try { return { status: response.status, body: JSON.parse(text) }; } catch { assert.fail(`HTTP ${response.status}: ${text}`); }
}

async function startWorker() {
  const bundle = await build({
    stdin: {
      resolveDir: workerDir,
      contents: `
        import { handleStudentPortal } from './routes/student-portal.js';
        export default { async fetch(request, env) {
          const url = new URL(request.url);
          try {
            return await handleStudentPortal(request, env, null, url.pathname.split('/').filter(Boolean), url)
              || new Response('Not found', { status: 404 });
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
  const schema = fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8');
  for (const table of ['class_exam_assignments', 'exam_sessions', 'wrong_answers'])
    await db.prepare(schemaTable(schema, table)).run();
  await db.exec(`
    CREATE TABLE classes (id TEXT PRIMARY KEY, name TEXT, grade TEXT, teacher_name TEXT, is_active INTEGER);
    CREATE TABLE students (id TEXT PRIMARY KEY, name TEXT, school_name TEXT, grade TEXT, student_pin TEXT, status TEXT);
    CREATE TABLE class_students (class_id TEXT, student_id TEXT);
    CREATE TABLE class_exam_assignment_recipients (assignment_id TEXT, student_id TEXT);
    ALTER TABLE class_exam_assignments ADD COLUMN pack_id TEXT;
    ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT;
  `);
  return { mf, db };
}

test('exams response carries the student\'s own wrong numbers after a reload, never another student\'s', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  await db.batch([
    db.prepare("INSERT INTO classes VALUES ('class-a','A반','고1','t',1)"),
    db.prepare("INSERT INTO students VALUES ('s-a','학생 A','중','고1','1111','재원'),('s-b','학생 B','중','고1','2222','재원')"),
    db.prepare("INSERT INTO class_students VALUES ('class-a','s-a'),('class-a','s-b')"),
    db.prepare(`INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,archive_file,source_type)
      VALUES ('as-1','class-a','시험 1','2026-11-20',10,'exams/original/x/one.js','original'),
             ('as-2','class-a','시험 2','2026-11-21',10,'exams/original/x/two.js','original'),
             ('as-3','class-a','시험 3','2026-11-22',10,'exams/original/x/three.js','original')`),
    db.prepare("INSERT INTO class_exam_assignment_recipients VALUES ('as-1','s-a'),('as-2','s-a'),('as-3','s-a'),('as-1','s-b'),('as-2','s-b')"),
    db.prepare(`INSERT INTO exam_sessions (id,student_id,exam_title,score,exam_date,question_count,class_id,archive_file,assignment_id)
      VALUES ('ses-a1','s-a','시험 1',70,'2026-11-20',10,'class-a','exams/original/x/one.js','as-1'),
             ('ses-a2','s-a','시험 2',100,'2026-11-21',10,'class-a','exams/original/x/two.js','as-2'),
             ('ses-b1','s-b','시험 1',90,'2026-11-20',10,'class-a','exams/original/x/one.js','as-1')`),
    db.prepare(`INSERT INTO wrong_answers (session_id,question_id,student_id) VALUES
      ('ses-a1','7','s-a'),('ses-a1','2','s-a'),('ses-a1','5','s-a'),
      ('ses-b1','1','s-b'),('ses-b1','9','s-b')`)
  ]);

  const a = await getJson(mf, `http://local/api/student-portal/exams?student_id=s-a`, { 'X-Student-Token': token('s-a', '1111') });
  assert.equal(a.status, 200, JSON.stringify(a.body));
  const byId = Object.fromEntries(a.body.exams.map(exam => [exam.assignment_id, exam]));
  assert.deepEqual(byId['as-1'].wrong_ids, [2, 5, 7], 'sorted, own session only (student B wrong 1,9 must not appear)');
  assert.deepEqual(byId['as-2'].wrong_ids, [], 'submitted with no wrong rows -> empty array');
  assert.deepEqual(byId['as-3'].wrong_ids, [], 'not submitted -> empty array');
  assert.equal(byId['as-2'].is_submitted, 1);

  const b = await getJson(mf, `http://local/api/student-portal/exams?student_id=s-b`, { 'X-Student-Token': token('s-b', '2222') });
  const bById = Object.fromEntries(b.body.exams.map(exam => [exam.assignment_id, exam]));
  assert.deepEqual(bById['as-1'].wrong_ids, [1, 9]);

  // exact assignment variant (portal deep link) reads the same numbers
  const exact = await getJson(mf, `http://local/api/student-portal/exams?student_id=s-a&assignment_id=as-1`, { 'X-Student-Token': token('s-a', '1111') });
  assert.deepEqual(exact.body.exams[0].wrong_ids, [2, 5, 7]);

  // one read for all exams: wrong numbers beyond the question count and non-numeric rows are dropped, not returned
  await db.prepare("INSERT INTO wrong_answers (session_id,question_id,student_id) VALUES ('ses-a1','99','s-a'),('ses-a1','abc','s-a')").run();
  const again = await getJson(mf, `http://local/api/student-portal/exams?student_id=s-a`, { 'X-Student-Token': token('s-a', '1111') });
  assert.deepEqual(again.body.exams.find(exam => exam.assignment_id === 'as-1').wrong_ids, [2, 5, 7]);

  // a wrong_answers row filed under student A's session id but another student id is not shown to A
  await db.prepare("INSERT INTO wrong_answers (session_id,question_id,student_id) VALUES ('ses-a1','3','s-b')").run();
  const guarded = await getJson(mf, `http://local/api/student-portal/exams?student_id=s-a`, { 'X-Student-Token': token('s-a', '1111') });
  assert.deepEqual(guarded.body.exams.find(exam => exam.assignment_id === 'as-1').wrong_ids, [2, 5, 7]);
});

test('home response carries the same wrong numbers', async t => {
  const { mf, db } = await startWorker();
  t.after(() => mf.dispose());
  await db.exec(`
    CREATE TABLE homework_photo_assignments (id TEXT, title TEXT, description TEXT, class_id TEXT, due_date TEXT, due_time TEXT, status TEXT, created_at TEXT);
    CREATE TABLE homework_photo_submissions (assignment_id TEXT, student_id TEXT, is_submitted INTEGER, submitted_at TEXT);
  `);
  await db.batch([
    db.prepare("INSERT INTO classes VALUES ('class-a','A반','고1','t',1)"),
    db.prepare("INSERT INTO students VALUES ('s-a','학생 A','중','고1','1111','재원')"),
    db.prepare("INSERT INTO class_students VALUES ('class-a','s-a')"),
    db.prepare(`INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,archive_file,source_type)
      VALUES ('as-1','class-a','시험 1','2026-11-20',10,'exams/original/x/one.js','original')`),
    db.prepare("INSERT INTO class_exam_assignment_recipients VALUES ('as-1','s-a')"),
    db.prepare(`INSERT INTO exam_sessions (id,student_id,exam_title,score,exam_date,question_count,class_id,archive_file,assignment_id)
      VALUES ('ses-a1','s-a','시험 1',70,'2026-11-20',10,'class-a','exams/original/x/one.js','as-1')`),
    db.prepare("INSERT INTO wrong_answers (session_id,question_id,student_id) VALUES ('ses-a1','4','s-a'),('ses-a1','1','s-a')")
  ]);
  const home = await getJson(mf, `http://local/api/student-portal/home?student_id=s-a`, { 'X-Student-Token': token('s-a', '1111') });
  assert.equal(home.status, 200, JSON.stringify(home.body));
  assert.deepEqual(home.body.class_exam_assignments.find(exam => exam.assignment_id === 'as-1').wrong_ids, [1, 4]);
});
