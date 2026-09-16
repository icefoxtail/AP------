import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import core from '../archive/archive2-core.js';
import source from '../archive/archive2-source.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const worker = path.join(root, 'apmath/worker-backup/worker');
const requireWorker = createRequire(path.join(worker, 'package.json'));
const { Miniflare } = requireWorker('miniflare');
const { build } = requireWorker('esbuild');
const catalogText = fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'), 'utf8');
const catalog = core.decodeCatalog(JSON.parse(catalogText));
const bundle = await build({ stdin: { contents: `import { handleExams } from './routes/exams.js';
export default {fetch(request, env) {
const role=request.headers.get('X-Fixture-Role');
const teacher=role ? {id:role==='admin'?'admin':'teacher-a',role} : null;
const url=new URL(request.url);return handleExams(request,env,teacher,url.pathname.split('/').filter(Boolean),url);
}}`, resolveDir: worker }, bundle: true, write: false, format: 'esm', platform: 'browser', external: ['cloudflare:*', 'node:*'] });
const mf = new Miniflare({ modules: true, script: bundle.outputFiles[0].text, compatibilityDate: '2026-07-11', compatibilityFlags: ['nodejs_compat'],
  d1Databases: ['DB'], r2Buckets: ['EXAM_PDF_BUCKET'], bindings: { ARCHIVE2_ENABLED: 'true' },
  serviceBindings: { ARCHIVE2_ASSETS: () => new Response(catalogText, { headers: { 'Content-Type': 'application/json' } }) }, port: process.argv.includes('--serve') ? 8789 : 0 });
try {
  const db = await mf.getD1Database('DB');
  const schema = fs.readFileSync(path.join(worker, 'schema.sql'), 'utf8');
  for (const name of ['class_exam_assignments', 'class_exam_assignment_recipients', 'class_exam_assignment_exclusions', 'exam_blueprints']) {
    const statement = schema.match(new RegExp('CREATE TABLE IF NOT EXISTS ' + name + ' \\([\\s\\S]*?\\n\\);'));
    assert.ok(statement, name); await db.prepare(statement[0]).run();
  }
  await db.exec("CREATE TABLE classes(id TEXT PRIMARY KEY,name TEXT,teacher_name TEXT);CREATE TABLE students(id TEXT PRIMARY KEY,name TEXT);CREATE TABLE class_students(class_id TEXT,student_id TEXT);CREATE TABLE teacher_classes(teacher_id TEXT,class_id TEXT);");
  const migration = fs.readFileSync(path.join(worker, 'migrations/20260916_archive2_question_bridge.sql'), 'utf8');
  // D1 exec is line-oriented; SQLite trigger bodies are issued as one statement.
  const plain = migration.slice(0, migration.indexOf('CREATE TRIGGER')).replace(/--[^\n]*/g, '');
  for (const sql of plain.split(';').map(s => s.trim()).filter(Boolean)) await db.prepare(sql).run();
  await db.prepare(migration.slice(migration.indexOf('CREATE TRIGGER'))).run();
  await db.exec("INSERT INTO classes VALUES ('class-a','Fixture A','Teacher A'),('class-b','Fixture B','Teacher B');INSERT INTO students VALUES ('student-a','Student A'),('student-b','Student B'),('student-c','Student C');INSERT INTO class_students VALUES ('class-a','student-a'),('class-a','student-b'),('class-b','student-c');INSERT INTO teacher_classes VALUES ('teacher-a','class-a');");
  const base = catalog.records.find(r => r.automatic);
  const records = catalog.records.filter(r => r.automatic && r.curriculumKey === base.curriculumKey && r.courseKey === base.courseKey).slice(0, 2);
  const uid = n => records[n - 1].questionUid;
  const questions = records.map(record => {
    const bank = source.evaluate(fs.readFileSync(path.join(root, 'archive/exams', record.sourceFile), 'utf8'), record.sourceFile);
    const q = { ...bank[record.sourceOrdinal - 1], questionUid: record.questionUid, sourceArchiveFile: record.sourceFile, sourceOrdinal: record.sourceOrdinal, sourceFingerprint: record.sourceFingerprint };
    for (const field of core.META_FIELDS) if (record[field] !== undefined) q[field] = record[field];
    return q;
  });
  const payload = { contract_version: 'archive2-v1', class_id: 'class-a', student_ids: ['student-a'], exam_title: 'Runtime', exam_date: '2026-09-16',
    question_count: 2, archive_file: 'MIXED:runtime', history_mode: 'all', index_version: catalog.indexVersion,
    selection_filters: { grade: base.sourceGrade, curriculumKey: base.curriculumKey, courseKey: base.courseKey },
    mixed_payload_json: { questions, meta: { questionUids: questions.map(q => q.questionUid) } } };
  const post = async (action, body, role = 'admin') => {
    const response = await mf.dispatchFetch('http://local/api/class-exam-assignments/' + action, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(role ? { 'X-Fixture-Role': role } : {}) }, body: JSON.stringify(body) });
    return { status: response.status, body: await response.json() };
  };
  assert.equal((await post('question-history', { student_ids: ['student-a'] }, '')).status, 401);
  assert.equal((await post('question-history', { student_ids: ['student-c'] }, 'teacher')).status, 403);
  const created = await post('studio', payload);
  assert.equal(created.body.saved, true, JSON.stringify(created));
  assert.equal(created.status, 502); // local Browser Rendering is deliberately absent; never claim PDF PASS.
  const id = created.body.assignment.id;
  assert.deepEqual(created.body.question_uids, questions.map(q => q.questionUid));
  const repeat = await post('studio', payload); assert.equal(repeat.body.assignment.id, id);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM class_exam_assignment_questions').first()).n, 2);
  const history = await post('question-history', { student_ids: ['student-a', 'student-b'], candidate_question_uids: [uid(1)], unit_keys: ['metadata-changed'] }, 'teacher');
  assert.deepEqual(history.body.students['student-a'].question_uids, [uid(1)]);
  assert.deepEqual(history.body.students['student-b'].question_uids, []);
  assert.equal(history.body.coverage.verified, 2);
  const changed = await post('studio', { ...payload, student_ids: ['student-b'] }); assert.equal(changed.status, 409);
  const duplicate = await post('studio', { ...payload, archive_file: 'MIXED:second' }); assert.equal(duplicate.status, 409);
  const invalid = await post('studio', { ...payload, archive_file: 'MIXED:bad', mixed_payload_json: { questions: [questions[0], questions[0]], meta: { questionUids: [uid(1), uid(1)] } } });
  assert.equal(invalid.status, 400);
  const forged = await post('studio', { ...payload, archive_file: 'MIXED:forged', mixed_payload_json: { ...payload.mixed_payload_json, questions: questions.map(q => ({ ...q, content: 'forged' })) } });
  assert.equal(forged.status, 409);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM class_exam_assignments').first()).n, 1);
  await db.prepare('DELETE FROM class_exam_assignment_exclusions WHERE assignment_id = ?').bind(id).run();
  const included = await post('question-history', { student_ids: ['student-b'] }); assert.deepEqual(included.body.union_question_uids, [uid(1), uid(2)].sort());
  await db.prepare('DELETE FROM class_exam_assignments WHERE id = ?').bind(id).run();
  const deleted = await post('question-history', { student_ids: ['student-a'] }); assert.deepEqual(deleted.body.union_question_uids, []);
  const races = await Promise.all(['race-a','race-b'].map(key => post('studio', { ...payload, archive_file: 'MIXED:' + key })));
  assert.equal(races.filter(r => r.body.saved).length, 1, JSON.stringify(races));
  assert.equal(races.filter(r => r.status === 409).length, 1);
  const raceId = races.find(r => r.body.saved).body.assignment.id;
  await db.prepare('DELETE FROM class_exam_assignments WHERE id = ?').bind(raceId).run();
  await db.prepare("INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,created_at) VALUES ('legacy','class-a','Legacy','2026-07-01',3,'2026-07-01')").run();
  await db.prepare("INSERT INTO class_exam_assignment_recipients (assignment_id,student_id) VALUES ('legacy','student-a')").run();
  await db.prepare("INSERT INTO class_exam_assignment_questions (assignment_id,order_no,question_uid,source_archive_file,source_question_ordinal,resolution_status) VALUES ('legacy',1,?,?,?,'VERIFIED')").bind(uid(1), records[0].sourceFile, records[0].sourceOrdinal).run();
  const coverage = await post('question-history', { student_ids: ['student-a'], candidate_question_uids: [] });
  assert.deepEqual(coverage.body.coverage, { verified: 0, legacy_inferred: 1, unresolved: 2 });
  assert.deepEqual(coverage.body.union_question_uids, []);
  console.log(JSON.stringify({ status: 'PASS', runtime: 'workerd + D1', authorization: 'PASS', persistedOrderedUidParity: 'PASS', retry: 'PASS', effectiveRecipients: 'PASS', metadataIndependentHistory: 'PASS', historyConflict: 'PASS', deletedAssignment: 'PASS', pdf: 'EXPECTED_FAILURE_NO_BROWSER_BINDING' }));
  if (process.argv.includes('--serve')) { console.log('Fixture worker: ' + await mf.ready); await new Promise(() => {}); }
} finally { await mf.dispose(); }
