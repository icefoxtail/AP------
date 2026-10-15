import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workerDir = path.join(root, 'apmath', 'worker-backup', 'worker');
const requireWorker = createRequire(path.join(workerDir, 'package.json'));
const { Miniflare } = requireWorker('miniflare');
const { build } = requireWorker('esbuild');

function schemaTable(schema, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = schema.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${escaped} \\([\\s\\S]*?\\n\\);`));
  assert.ok(match, `schema.sql must define ${name}`);
  return match[0];
}

async function applySqlFile(db, file, triggerAware = false) {
  const sql = fs.readFileSync(path.join(workerDir, file), 'utf8');
  if (triggerAware) {
    const triggerIndex = sql.indexOf('CREATE TRIGGER');
    const plain = (triggerIndex < 0 ? sql : sql.slice(0, triggerIndex)).replace(/--[^\n]*/g, '');
    for (const statement of plain.split(';').map(value => value.trim()).filter(Boolean))
      await db.prepare(statement).run();
    if (triggerIndex >= 0) await db.prepare(sql.slice(triggerIndex)).run();
    return;
  }
  const plain = sql.replace(/--[^\n]*/g, '');
  for (const statement of plain.split(';').map(value => value.trim()).filter(Boolean))
    await db.prepare(statement).run();
}

function studentToken(studentId, pin) {
  return crypto.createHash('sha256').update(`${studentId}:${pin}:student-portal:v1`).digest('hex');
}

async function readResponse(response) {
  const text = await response.text();
  try {
    return { status: response.status, body: JSON.parse(text) };
  } catch {
    assert.fail(`expected JSON response, got HTTP ${response.status}: ${text}`);
  }
}

async function requestJson(mf, url, method, body, teacherId = '') {
  return readResponse(await mf.dispatchFetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(teacherId ? { 'X-Fixture-Role': teacherId } : {})
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  }));
}

function resultIdentityRows(rows) {
  return rows.map(row => ({
    order_no: Number(row.order_no),
    assignment_id: row.assignment_id,
    source_archive_file: row.source_archive_file,
    source_question_no: row.source_question_no,
    source_question_ordinal: row.source_question_ordinal,
    source_question_uid: row.source_question_uid,
    source_fingerprint: row.source_fingerprint,
    source_identity_status: row.source_identity_status,
    metadata_revision: row.metadata_revision,
    metadata_hash: row.metadata_hash,
    metadata_json: row.metadata_json,
    metadata_snapshot_status: row.metadata_snapshot_status
  }));
}

async function wrongIds(db, sessionId) {
  const rows = await db.prepare(`
    SELECT question_id FROM wrong_answers
    WHERE session_id = ? ORDER BY CAST(question_id AS INTEGER)
  `).bind(sessionId).all();
  return (rows.results || []).map(row => Number(row.question_id));
}

async function sessionIdentityState(db, sessionId) {
  const session = await db.prepare(`
    SELECT id,student_id,class_id,assignment_id,exam_title,exam_date,question_count,archive_file,score
    FROM exam_sessions WHERE id=?
  `).bind(sessionId).first();
  const rows = (await db.prepare('SELECT * FROM assessment_result_items WHERE session_id=? ORDER BY order_no')
    .bind(sessionId).all()).results;
  return {
    session,
    wrong_ids: await wrongIds(db, sessionId),
    result_identity: resultIdentityRows(rows)
  };
}

test('student, teacher individual, and teacher bulk OMR keep one assignment session and frozen UID/Meta rows', async t => {
  const bundle = await build({
    stdin: {
      resolveDir: workerDir,
      contents: `
        import { handleExams } from './routes/exams.js';
        import { handleStudentPortal } from './routes/student-portal.js';
        export default { async fetch(request, env) {
          const url = new URL(request.url);
          const role = request.headers.get('X-Fixture-Role');
          const teacher = role ? { id: role, role: 'teacher', name: role } : null;
          const route = url.pathname.startsWith('/api/student-portal/') ? handleStudentPortal : handleExams;
          try {
            return await route(request, env, teacher, url.pathname.split('/').filter(Boolean), url)
              || new Response('Not found', { status: 404 });
          } catch (error) {
            return Response.json({ error: error.message }, { status: 500 });
          }
        } };`
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(path.delimiter) : [],
    external: ['cloudflare:*', 'node:*']
  });
  const mf = new Miniflare({
    modules: true,
    script: bundle.outputFiles[0].text,
    compatibilityDate: '2026-07-11',
    compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB']
  });

  try {
    const db = await mf.getD1Database('DB');
    const schema = fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8');
    for (const table of ['class_exam_assignments', 'exam_sessions', 'wrong_answers', 'assessment_result_items'])
      await db.prepare(schemaTable(schema, table)).run();
    const resultItemUniqueIndex = schema.match(/CREATE UNIQUE INDEX IF NOT EXISTS idx_assessment_result_items_session_order_unique\s+ON assessment_result_items\(session_id, order_no\);/);
    assert.ok(resultItemUniqueIndex, 'schema.sql must uniquely key result rows by session and order');
    await db.prepare(resultItemUniqueIndex[0]).run();
    await db.exec(`
      CREATE TABLE classes (id TEXT PRIMARY KEY, name TEXT, grade TEXT, teacher_name TEXT, is_active INTEGER);
      CREATE TABLE students (id TEXT PRIMARY KEY, name TEXT, school_name TEXT, grade TEXT, student_pin TEXT, status TEXT);
      CREATE TABLE class_students (class_id TEXT, student_id TEXT);
      CREATE TABLE teacher_classes (teacher_id TEXT, class_id TEXT);
      CREATE TABLE class_exam_assignment_recipients (assignment_id TEXT, student_id TEXT);
      CREATE TABLE class_exam_assignment_exclusions (assignment_id TEXT, student_id TEXT);
      ALTER TABLE class_exam_assignments ADD COLUMN pack_id TEXT;
      ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT;
      ALTER TABLE exam_sessions ADD COLUMN pack_id TEXT;
      ALTER TABLE exam_sessions ADD COLUMN result_hash TEXT;
      ALTER TABLE exam_sessions ADD COLUMN analysis_status TEXT;
    `);
    await applySqlFile(db, 'migrations/20260916_archive2_question_bridge.sql', true);
    await applySqlFile(db, 'migrations/20261015_assessment_result_uid_meta_snapshot.sql');

    const archiveFile = 'exams/original/high/h2/1final/uid-three-way-fixture.js';
    const examTitle = '합성 3-way 결과 연결 시험';
    const examDate = '2026-10-16';
    await db.batch([
      db.prepare("INSERT INTO classes VALUES ('class-a','합성 A반','고2','teacher-a',1),('class-b','합성 B반','고2','teacher-b',1)"),
      db.prepare("INSERT INTO teacher_classes VALUES ('teacher-a','class-a'),('teacher-b','class-b')"),
      db.prepare("INSERT INTO students VALUES ('student-a','합성 학생 A','테스트중','고2','1234','재원'),('student-b','합성 학생 B','테스트중','고2','5678','재원'),('student-c','합성 학생 C','테스트중','고2','9012','재원')"),
      db.prepare("INSERT INTO class_students VALUES ('class-a','student-a'),('class-a','student-c'),('class-b','student-b')"),
      db.prepare(`INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,archive_file,source_type,pack_id)
        VALUES ('assignment-a','class-a',?,?,23,?,'original','pack-a'),
               ('assignment-other','class-a','다른 배정',?,23,'exams/original/high/h2/1final/other.js','original','pack-other'),
               ('assignment-legacy-match','class-a','legacy 제목',?,2,'','original','pack-legacy'),
               ('assignment-new','class-a','새 교사 배정',?,2,'exams/original/high/h2/1final/new.js','original','pack-new'),
               ('assignment-excluded','class-a','Excluded inferred',?,2,'exams/original/high/h2/1final/excluded.js','original','pack-excluded'),
               ('assignment-bound-legacy','class-a','Bound legacy',?,2,'exams/original/high/h2/1final/bound-legacy.js','original','pack-bound-legacy'),
               ('assignment-bound-excluded','class-a','Bound excluded',?,2,'exams/original/high/h2/1final/bound-excluded.js','original','pack-bound-excluded')`)
        .bind(examTitle, examDate, archiveFile, examDate, examDate, examDate, examDate, examDate, examDate),
      db.prepare(`INSERT INTO class_exam_assignment_recipients (assignment_id,student_id)
        VALUES ('assignment-a','student-a'),('assignment-other','student-a'),
               ('assignment-legacy-match','student-a'),('assignment-new','student-a'),
               ('assignment-excluded','student-a')`),
      db.prepare(`INSERT INTO class_exam_assignment_exclusions (assignment_id,student_id)
        VALUES ('assignment-excluded','student-a'),('assignment-bound-excluded','student-a')`)
    ]);

    const frozenStatements = [];
    const frozenIdentity = [];
    for (let orderNo = 1; orderNo <= 23; orderNo++) {
      const sourceOrdinal = 24 - orderNo;
      const sourceFile = archiveFile;
      const normalizedSource = sourceFile.replace(/^exams\//, '');
      const uid = `qid_v1_${crypto.createHash('sha256').update(`${normalizedSource}#${sourceOrdinal}`).digest('hex')}`;
      const metadataRevision = `frozen-meta-r${orderNo}`;
      const metadataHash = crypto.createHash('sha256').update(`frozen-meta-${orderNo}`).digest('hex');
      const metadataJson = JSON.stringify({
        standardUnitKey: `unit-${orderNo}`,
        typeKey: 'multiple-choice',
        provenance: { assignment: 'assignment-a', orderNo, sourceOrdinal }
      });
      frozenIdentity.push({
        order_no: orderNo,
        assignment_id: 'assignment-a',
        source_archive_file: sourceFile,
        source_question_no: 100 + sourceOrdinal,
        source_question_ordinal: sourceOrdinal,
        source_question_uid: uid,
        source_fingerprint: `frozen-fingerprint-${orderNo}`,
        source_identity_status: 'VERIFIED',
        metadata_revision: metadataRevision,
        metadata_hash: metadataHash,
        metadata_json: metadataJson,
        metadata_snapshot_status: 'CAPTURED'
      });
      frozenStatements.push(db.prepare(`
        INSERT INTO class_exam_assignment_questions (
          assignment_id,order_no,question_uid,source_archive_file,source_question_no,source_question_ordinal,
          source_fingerprint,standard_unit_key,difficulty_at_assignment,metadata_revision,metadata_hash,metadata_json,resolution_status
        ) VALUES ('assignment-a',?,?,?,?,?,?,'unit-${orderNo}','2',?,?,?,'VERIFIED')
      `).bind(
        orderNo, uid, sourceFile, 100 + sourceOrdinal, sourceOrdinal,
        `frozen-fingerprint-${orderNo}`, metadataRevision, metadataHash, metadataJson
      ));
    }
    await db.batch(frozenStatements);
    await db.batch([
      db.prepare(`INSERT INTO exam_sessions (
        id,student_id,exam_title,score,exam_date,question_count,class_id,archive_file,assignment_id,pack_id,updated_at
      ) VALUES ('legacy-bound-session','student-a','Bound legacy',50,?,2,'class-a','exams/original/high/h2/1final/bound-legacy.js','assignment-bound-legacy','pack-bound-legacy',DATETIME('now'))`)
        .bind(examDate),
      db.prepare(`INSERT INTO exam_sessions (
        id,student_id,exam_title,score,exam_date,question_count,class_id,archive_file,assignment_id,pack_id,updated_at
      ) VALUES ('excluded-bound-session','student-a','Bound excluded',50,?,2,'class-a','exams/original/high/h2/1final/bound-excluded.js','assignment-bound-excluded','pack-bound-excluded',DATETIME('now'))`)
        .bind(examDate),
      db.prepare(`INSERT INTO exam_sessions (
        id,student_id,exam_title,score,exam_date,question_count,class_id,archive_file,assignment_id,pack_id,updated_at
      ) VALUES ('recipient-missing-session','student-c','다른 배정',50,?,23,'class-a','exams/original/high/h2/1final/other.js','assignment-other','pack-other',DATETIME('now'))`)
        .bind(examDate),
      db.prepare(`INSERT INTO wrong_answers (session_id,question_id,student_id)
        VALUES ('legacy-bound-session','1','student-a'),('excluded-bound-session','1','student-a'),('recipient-missing-session','1','student-c')`)
    ]);

    const studentToken = studentTokenForFixture();
    function studentTokenForFixture() {
      return studentTokenHash('student-a', '1234');
    }
    function studentTokenHash(studentId, pin) {
      return studentTokenFn(studentId, pin);
    }
    function studentTokenFn(studentId, pin) {
      return crypto.createHash('sha256').update(`${studentId}:${pin}:student-portal:v1`).digest('hex');
    }

    const initialSubmit = await requestJson(mf, 'http://local/api/student-portal/omr-submit', 'POST', {
      student_id: 'student-a',
      student_token: studentToken,
      assignment_id: 'assignment-a',
      wrong_ids: [2, 3]
    });
    assert.equal(initialSubmit.status, 200, JSON.stringify(initialSubmit.body));
    assert.equal(initialSubmit.body.success, true);
    const sessionId = initialSubmit.body.session.id;
    assert.equal(initialSubmit.body.session.assignment_id, 'assignment-a');
    assert.deepEqual(initialSubmit.body.session.wrong_ids, [2, 3]);

    const initialSessionCount = await db.prepare(`
      SELECT COUNT(*) AS count FROM exam_sessions
      WHERE assignment_id='assignment-a' AND student_id='student-a'
    `).first();
    assert.equal(initialSessionCount.count, 1);
    const initialRows = (await db.prepare(`SELECT * FROM assessment_result_items WHERE session_id=? ORDER BY order_no`)
      .bind(sessionId).all()).results;
    assert.equal(initialRows.length, 23);
    assert.deepEqual(resultIdentityRows(initialRows), frozenIdentity);
    assert.deepEqual(await wrongIds(db, sessionId), [2, 3]);

    await db.prepare("UPDATE class_exam_assignments SET question_count=0 WHERE id='assignment-a'").run();

    const teacherPatch = await requestJson(mf, 'http://local/api/exam-sessions/new', 'PATCH', {
      session_id: sessionId,
      student_id: 'student-a', class_id: 'class-a', assignment_id: 'assignment-a', pack_id: 'pack-a',
      exam_title: examTitle, exam_date: examDate, archive_file: archiveFile,
      question_count: 23, score: 91, wrong_ids: [3, 4]
    }, 'teacher-a');
    assert.equal(teacherPatch.status, 200, JSON.stringify(teacherPatch.body));
    assert.equal(teacherPatch.body.id, sessionId);
    assert.deepEqual(await wrongIds(db, sessionId), [3, 4]);
    const afterIndividual = (await db.prepare(`SELECT * FROM assessment_result_items WHERE session_id=? ORDER BY order_no`)
      .bind(sessionId).all()).results;
    assert.equal(afterIndividual.length, 23);
    assert.deepEqual(resultIdentityRows(afterIndividual), frozenIdentity);
    assert.deepEqual(afterIndividual.filter(row => Number(row.is_correct) === 0).map(row => Number(row.order_no)), [3, 4]);

    const wrongStudentBefore = await sessionIdentityState(db, sessionId);
    const wrongStudentPatch = await requestJson(mf, `http://local/api/exam-sessions/${encodeURIComponent(sessionId)}`, 'PATCH', {
      student_id: 'student-b', class_id: 'class-b', assignment_id: 'assignment-a',
      exam_title: examTitle, exam_date: examDate, archive_file: archiveFile,
      question_count: 23, score: 0, wrong_ids: [1]
    }, 'teacher-a');
    assert.equal(wrongStudentPatch.status, 403);
    assert.deepEqual(await sessionIdentityState(db, sessionId), wrongStudentBefore,
      'unauthorized student context must not mutate the known session');

    const wrongAssignmentBefore = await sessionIdentityState(db, sessionId);
    const wrongAssignmentPatch = await requestJson(mf, `http://local/api/exam-sessions/${encodeURIComponent(sessionId)}`, 'PATCH', {
      student_id: 'student-a', class_id: 'class-a', assignment_id: 'assignment-other',
      exam_title: examTitle, exam_date: examDate, archive_file: archiveFile,
      question_count: 23, score: 0, wrong_ids: [1]
    }, 'teacher-a');
    assert.ok([400, 403, 409].includes(wrongAssignmentPatch.status), JSON.stringify(wrongAssignmentPatch.body));
    assert.deepEqual(await sessionIdentityState(db, sessionId), wrongAssignmentBefore,
      'a different assignment ID must not mutate a known session');

    const missingSessionPatch = await requestJson(mf, 'http://local/api/exam-sessions/session-does-not-exist', 'PATCH', {
      student_id: 'student-a', class_id: 'class-a', assignment_id: 'assignment-a',
      exam_title: examTitle, exam_date: examDate, archive_file: archiveFile,
      question_count: 23, score: 0, wrong_ids: [1]
    }, 'teacher-a');
    assert.notEqual(missingSessionPatch.status, 200, 'an explicit unknown session ID must not create a session');
    const missingSessionCount = await db.prepare("SELECT COUNT(*) AS count FROM exam_sessions WHERE id='session-does-not-exist'").first();
    assert.equal(missingSessionCount.count, 0);

    const bulkContextBefore = await sessionIdentityState(db, sessionId);
    const bulkWrongContext = await requestJson(mf, 'http://local/api/exam-sessions/bulk-omr', 'POST', {
      exam_title: examTitle, exam_date: examDate, archive_file: archiveFile, question_count: 23,
      rows: [{ student_id: 'student-a', class_id: 'class-a', session_id: sessionId, assignment_id: 'assignment-other', wrong_ids: [1, 2] }]
    }, 'teacher-a');
    assert.ok([400, 403, 409].includes(bulkWrongContext.status), JSON.stringify(bulkWrongContext.body));
    assert.deepEqual(await sessionIdentityState(db, sessionId), bulkContextBefore,
      'bulk assignment mismatch must not mutate a known session');

    const inferredExcludedSave = await requestJson(mf, 'http://local/api/exam-sessions/bulk-omr', 'POST', {
      exam_title: 'Excluded inferred', exam_date: examDate,
      archive_file: 'exams/original/high/h2/1final/excluded.js', question_count: 2,
      rows: [{ student_id: 'student-a', class_id: 'class-a', wrong_ids: [1] }]
    }, 'teacher-a');
    assert.equal(inferredExcludedSave.status, 403, JSON.stringify(inferredExcludedSave.body));
    const inferredExcludedCount = await db.prepare(`
      SELECT COUNT(*) AS count FROM exam_sessions
      WHERE student_id='student-a' AND exam_title='Excluded inferred' AND exam_date=?
    `).bind(examDate).first();
    assert.equal(inferredExcludedCount.count, 0, 'bulk identity inference must honor the assignment exclusion');

    const bulkSave = await requestJson(mf, 'http://local/api/exam-sessions/bulk-omr', 'POST', {
      exam_title: examTitle, exam_date: examDate, archive_file: archiveFile, question_count: 23,
      rows: [{ student_id: 'student-a', class_id: 'class-a', session_id: sessionId, assignment_id: 'assignment-a', wrong_ids: [1, 4] }]
    }, 'teacher-a');
    assert.equal(bulkSave.status, 200, JSON.stringify(bulkSave.body));
    assert.equal(bulkSave.body.saved, 1);
    assert.deepEqual(await wrongIds(db, sessionId), [1, 4]);
    const afterBulk = (await db.prepare(`SELECT * FROM assessment_result_items WHERE session_id=? ORDER BY order_no`)
      .bind(sessionId).all()).results;
    assert.equal(afterBulk.length, 23);
    assert.deepEqual(resultIdentityRows(afterBulk), frozenIdentity);
    assert.deepEqual(afterBulk.filter(row => Number(row.is_correct) === 0).map(row => Number(row.order_no)), [1, 4]);
    const finalSessionCount = await db.prepare(`
      SELECT COUNT(*) AS count FROM exam_sessions
      WHERE assignment_id='assignment-a' AND student_id='student-a'
    `).first();
    assert.equal(finalSessionCount.count, 1, 'all three input paths must resolve to the same assignment/session');

    const newAssignmentSave = await requestJson(mf, 'http://local/api/exam-sessions/new', 'PATCH', {
      student_id: 'student-a', class_id: 'class-a', assignment_id: 'assignment-new', pack_id: 'pack-new',
      exam_title: '새 교사 배정', exam_date: examDate,
      archive_file: 'exams/original/high/h2/1final/new.js', question_count: 2, score: 50, wrong_ids: [2]
    }, 'teacher-a');
    assert.equal(newAssignmentSave.status, 200, JSON.stringify(newAssignmentSave.body));
    const newAssignmentSession = await db.prepare('SELECT student_id,class_id,assignment_id,pack_id FROM exam_sessions WHERE id=?')
      .bind(newAssignmentSave.body.id).first();
    assert.deepEqual(newAssignmentSession, {
      student_id: 'student-a', class_id: 'class-a', assignment_id: 'assignment-new', pack_id: 'pack-new'
    });

    const nonRecipientSave = await requestJson(mf, 'http://local/api/exam-sessions/new', 'PATCH', {
      student_id: 'student-c', class_id: 'class-a', assignment_id: 'assignment-new', pack_id: 'pack-new',
      exam_title: '새 교사 배정', exam_date: examDate,
      archive_file: 'exams/original/high/h2/1final/new.js', question_count: 2, score: 0, wrong_ids: [1, 2]
    }, 'teacher-a');
    assert.equal(nonRecipientSave.status, 409, JSON.stringify(nonRecipientSave.body));
    const nonRecipientCount = await db.prepare("SELECT COUNT(*) AS count FROM exam_sessions WHERE student_id='student-c' AND assignment_id='assignment-new'").first();
    assert.equal(nonRecipientCount.count, 0, 'an explicit new assignment cannot be written for a same-class nonrecipient');

    const boundLegacyEdit = await requestJson(mf, 'http://local/api/exam-sessions/new', 'PATCH', {
      session_id: 'legacy-bound-session', student_id: 'student-a', class_id: 'class-a',
      assignment_id: 'assignment-bound-legacy', exam_title: 'Bound legacy', exam_date: examDate,
      archive_file: 'exams/original/high/h2/1final/bound-legacy.js', question_count: 2, score: 50, wrong_ids: [2]
    }, 'teacher-a');
    assert.equal(boundLegacyEdit.status, 200, JSON.stringify(boundLegacyEdit.body));
    assert.equal(boundLegacyEdit.body.id, 'legacy-bound-session');
    assert.deepEqual(await wrongIds(db, 'legacy-bound-session'), [2],
      'a bound legacy assignment with no recipient snapshot rows remains editable for its enrolled student');

    const boundExcludedBefore = await sessionIdentityState(db, 'excluded-bound-session');
    const boundExcludedEdit = await requestJson(mf, 'http://local/api/exam-sessions/new', 'PATCH', {
      session_id: 'excluded-bound-session', student_id: 'student-a', class_id: 'class-a',
      assignment_id: 'assignment-bound-excluded', exam_title: 'Bound excluded', exam_date: examDate,
      archive_file: 'exams/original/high/h2/1final/bound-excluded.js', question_count: 2, score: 0, wrong_ids: [1, 2]
    }, 'teacher-a');
    assert.equal(boundExcludedEdit.status, 403);
    assert.deepEqual(await sessionIdentityState(db, 'excluded-bound-session'), boundExcludedBefore,
      'an explicit exclusion still blocks a bound legacy session when its recipient snapshot is empty');

    const recipientMissingBefore = await sessionIdentityState(db, 'recipient-missing-session');
    const recipientMissingEdit = await requestJson(mf, 'http://local/api/exam-sessions/new', 'PATCH', {
      session_id: 'recipient-missing-session', student_id: 'student-c', class_id: 'class-a',
      assignment_id: 'assignment-other', exam_title: '다른 배정', exam_date: examDate,
      archive_file: 'exams/original/high/h2/1final/other.js', question_count: 23, score: 0, wrong_ids: [1]
    }, 'teacher-a');
    assert.equal(recipientMissingEdit.status, 409,
      'once an assignment has recipient snapshot rows, an absent student cannot be added by regrading');
    assert.deepEqual(await sessionIdentityState(db, 'recipient-missing-session'), recipientMissingBefore);

    const legacyInsert = await db.prepare(`
      INSERT INTO exam_sessions (id,student_id,exam_title,score,exam_date,question_count,class_id,archive_file,updated_at)
      VALUES ('legacy-session','student-a','legacy 제목',50,?,2,'class-a','',DATETIME('now'))
    `).bind(examDate).run();
    assert.equal(legacyInsert.success, true);
    await db.prepare("INSERT INTO wrong_answers (session_id,question_id,student_id) VALUES ('legacy-session','1','student-a')").run();
    const legacyEdit = await requestJson(mf, 'http://local/api/exam-sessions/new', 'PATCH', {
      student_id: 'student-a', class_id: 'class-a', exam_title: 'legacy 제목', exam_date: examDate,
      archive_file: '', question_count: 3, score: 33, wrong_ids: [2, 3]
    }, 'teacher-a');
    assert.equal(legacyEdit.status, 200, JSON.stringify(legacyEdit.body));
    assert.equal(legacyEdit.body.id, 'legacy-session', 'legacy title/date/archive identity fallback stays editable without an explicit session ID');
    const legacySession = await db.prepare("SELECT assignment_id,exam_title,exam_date,question_count FROM exam_sessions WHERE id='legacy-session'").first();
    assert.equal(legacySession.assignment_id, null, 'legacy null assignment identity must not be inferred from a matching current assignment');
    assert.equal(legacySession.exam_title, 'legacy 제목');
    assert.equal(Number(legacySession.question_count), 3, 'unique legacy identity may correct its recorded question count');
    assert.deepEqual(await wrongIds(db, 'legacy-session'), [2, 3]);
    const legacyResult = (await db.prepare('SELECT assignment_id,source_question_uid,source_identity_status FROM assessment_result_items WHERE session_id=? ORDER BY order_no')
      .bind('legacy-session').all()).results;
    assert.equal(legacyResult.length, 3);
    assert.deepEqual(legacyResult.map(row => [row.assignment_id, row.source_question_uid, row.source_identity_status]), [
      [null, null, 'UNRESOLVED'], [null, null, 'UNRESOLVED'], [null, null, 'UNRESOLVED']
    ]);
  } finally {
    await mf.dispose();
  }
});

test('teacher OMR history keeps custom titles and selects the exact matching session for bulk edits', async () => {
  const qrOmrPath = path.join(root, 'apmath', 'js', 'qr-omr.js');
  const qrOmrSource = fs.readFileSync(qrOmrPath, 'utf8');
  const archiveFile = 'exams/original/high/h2/1final/shared-source.js';
  const date = '2026-10-16';
  const sessions = [
    { id: 'session-a-23', student_id: 'student-a', class_id: 'class-a', assignment_id: 'assignment-a-23', exam_title: 'CUSTOM TEST A', exam_date: date, question_count: 23, archive_file: archiveFile, updated_at: '2026-10-16T10:00:00Z' },
    { id: 'session-b-23', student_id: 'student-a', class_id: 'class-a', assignment_id: 'assignment-b-23', exam_title: 'CUSTOM TEST B', exam_date: date, question_count: 23, archive_file: archiveFile, updated_at: '2026-10-16T10:01:00Z' },
    { id: 'session-a-7', student_id: 'student-a', class_id: 'class-a', assignment_id: 'assignment-a-7', exam_title: 'CUSTOM TEST A', exam_date: date, question_count: 7, archive_file: archiveFile, updated_at: '2026-10-16T10:02:00Z' }
  ];
  const selectedHistory = { value: '' };
  let modalHtml = '';
  const elements = {
    'omr-exam-title': { value: 'CUSTOM TEST B' },
    'omr-exam-date': { value: date },
    'omr-question-count': { value: '23' },
    'omr-grade': { value: '고2' },
    'omr-class': { value: 'class-a' },
    'omr-archive-file': { value: archiveFile },
    'omr-history': selectedHistory
  };
  let bulkPayload = null;
  const context = {
    console,
    Date,
    Set,
    Map,
    String,
    Number,
    Math,
    encodeURIComponent,
    state: {
      db: {
        classes: [{ id: 'class-a', name: '고2 A반', grade: '고2', is_active: 1 }],
        class_students: [
          { class_id: 'class-a', student_id: 'student-a' },
          { class_id: 'class-a', student_id: 'student-other' }
        ],
        students: [
          { id: 'student-a', name: '홍가온', grade: '고2', status: '재원' },
          { id: 'student-other', name: '합성 학생 B', grade: '고2', status: '재원' }
        ],
        exam_sessions: sessions,
        wrong_answers: [
          { session_id: 'session-a-23', question_id: '1' },
          { session_id: 'session-b-23', question_id: '2' },
          { session_id: 'session-b-23', question_id: '5' }
        ]
      },
      ui: {
        omrInput: {
          examTitle: 'CUSTOM TEST A', examDate: date, questionCount: 23,
          grade: '고2', classId: 'class-a', archiveFile,
          selectedHistoryQuestionCount: 23, answers: { 'student-a': { '1': true, '4': true } }, examSelected: true
        },
        omrArchiveQuestionCountCache: { [archiveFile]: null }
      }
    },
    document: {
      getElementById: id => elements[id] || null,
      querySelectorAll: () => [],
      querySelector: () => null,
      head: { appendChild() {} },
      createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} })
    },
    localStorage: { setItem() {} },
    getTodayExamConfig: () => null,
    showModal: (_title, html) => { modalHtml = html; },
    api: {
      post: async (path, payload) => {
        bulkPayload = { path, payload: JSON.parse(JSON.stringify(payload)) };
        return { success: true, saved: 1 };
      }
    },
    toast() {},
    refreshDataOnly: async () => {}
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(qrOmrSource, context, { filename: qrOmrPath });
  vm.runInContext('renderOmrInput = () => {}', context);

  assert.equal(vm.runInContext('getOmrSelectedStudents().length', context), 2,
    'an unset per-student filter preserves the existing select-all behavior');
  const defaultRosterHtml = vm.runInContext('renderOmrInputTable(getOmrVisibleStudents(), 23)', context);
  assert.equal((defaultRosterHtml.match(/class="omr-student-recipient"[^>]*checked/g) || []).length, 2,
    'all visible roster checkboxes are selected by default');

  const historyRows = JSON.parse(JSON.stringify(vm.runInContext('getOmrHistoricalExamList()', context)));
  const historyA = historyRows.find(item => item.originalExamTitle === 'CUSTOM TEST A' && item.questionCount === 23);
  const historyB = historyRows.find(item => item.originalExamTitle === 'CUSTOM TEST B' && item.questionCount === 23);
  assert.ok(historyA && historyB, 'history retains both custom exam titles for the same source/date/count');
  const keyA = vm.runInContext('makeOmrHistoryKey', context)(historyA);
  const keyB = vm.runInContext('makeOmrHistoryKey', context)(historyB);
  assert.notEqual(keyA, keyB, 'custom exam title contributes to the history option key');
  assert.equal(vm.runInContext('getOmrSelectedHistoryKey()', context), keyA);
  const historyOptions = vm.runInContext('buildOmrHistoryOptions()', context);
  assert.ok(historyOptions.includes('CUSTOM TEST A') && historyOptions.includes('CUSTOM TEST B'),
    'history labels distinguish custom exam titles even when source display titles match');

  selectedHistory.value = keyB;
  await vm.runInContext('handleOmrHistoryChange()', context);
  assert.equal(context.state.ui.omrInput.examTitle, 'CUSTOM TEST B', 'selecting history keeps the saved custom title, not the source display title');
  assert.equal(vm.runInContext("getOmrExistingSession('student-a')?.id", context), 'session-b-23', 'selected title resolves to its own session ID');

  await vm.runInContext("openOMR('student-a', '', null, '', 'session-b-23')", context);
  assert.match(modalHtml, /id="omr-session-id-hidden"[^>]*value="session-b-23"/);
  assert.match(modalHtml, /id="omr-assignment-id-hidden"[^>]*value="assignment-b-23"/);
  assert.match(modalHtml, /class="omr-q hidden" value="2" checked/);
  assert.match(modalHtml, /class="omr-q hidden" value="5" checked/);
  assert.doesNotMatch(modalHtml, /class="omr-q hidden" value="1" checked/,
    'individual edit pre-fills wrong answers for the selected session only');

  context.state.ui.omrInput.examTitle = 'CUSTOM TEST A';
  context.state.ui.omrInput.questionCount = 7;
  context.state.ui.omrInput.selectedHistoryQuestionCount = 0;
  assert.equal(vm.runInContext("getOmrExistingSession('student-a')?.id", context), 'session-a-7', 'when no history count is selected, current UI count scopes session lookup');
  context.state.ui.omrInput.questionCount = 8;
  assert.equal(vm.runInContext("getOmrExistingSession('student-a')", context), null, 'a different question count must not select a same-source history session');

  context.state.ui.omrInput.examTitle = 'CUSTOM TEST B';
  context.state.ui.omrInput.questionCount = 23;
  context.state.ui.omrInput.selectedHistoryQuestionCount = 23;
  vm.runInContext("toggleOmrStudentRecipient('student-other', false)", context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.state.ui.omrInput.selectedStudentIds)), ['student-a']);
  await vm.runInContext('saveOmrInputBulk(null)', context);
  assert.equal(bulkPayload.path, 'exam-sessions/bulk-omr');
  assert.equal(bulkPayload.payload.exam_title, 'CUSTOM TEST B');
  assert.equal(bulkPayload.payload.rows.length, 1);
  assert.equal(bulkPayload.payload.rows[0].session_id, 'session-b-23');
  assert.equal(bulkPayload.payload.rows[0].assignment_id, 'assignment-b-23');
});
