import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
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

async function readJson(response, label) {
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    assert.fail(`${label}: expected JSON, got HTTP ${response.status}: ${text}`);
  }
  assert.equal(response.status, 200, `${label}: ${JSON.stringify(body)}`);
  return body;
}

async function requestJson(mf, url, body, headers = {}) {
  return readJson(await mf.dispatchFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body)
  }), url);
}

test('student OMR resolves frozen assignment UID/Meta through clinic persistence and retake review', async t => {
  const bundle = await build({
    stdin: {
      resolveDir: workerDir,
      contents: `
        import { handleExams } from './routes/exams.js';
        import { handleStudentPortal } from './routes/student-portal.js';
        import { handleWrongClinics } from './routes/wrong-clinics.js';
        export default { async fetch(request, env) {
          const url = new URL(request.url);
          const role = request.headers.get('X-Fixture-Role');
          const teacher = role ? { id: role, role: role.startsWith('teacher-') ? 'teacher' : role, name: role } : null;
          const route = url.pathname.startsWith('/api/student-portal/')
            ? handleStudentPortal
            : url.pathname.startsWith('/api/wrong-clinics')
              ? handleWrongClinics
              : handleExams;
          try {
            return await route(request, env, teacher, url.pathname.split('/').filter(Boolean), url)
              || new Response('Not found', { status: 404 });
          } catch (error) {
            return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
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
    for (const table of [
      'class_exam_assignments', 'exam_sessions', 'wrong_answers',
      'assessment_result_items', 'exam_blueprints'
    ]) await db.prepare(schemaTable(schema, table)).run();
    const resultItemUniqueIndex = schema.match(/CREATE UNIQUE INDEX IF NOT EXISTS idx_assessment_result_items_session_order_unique\s+ON assessment_result_items\(session_id, order_no\);/);
    assert.ok(resultItemUniqueIndex, 'schema.sql must uniquely key result rows by session and order');
    await db.prepare(resultItemUniqueIndex[0]).run();
    await db.exec(`
      CREATE TABLE classes (id TEXT PRIMARY KEY, name TEXT, grade TEXT, teacher_name TEXT, is_active INTEGER);
      CREATE TABLE students (id TEXT PRIMARY KEY, name TEXT, school_name TEXT, grade TEXT, student_pin TEXT, status TEXT);
      CREATE TABLE class_students (class_id TEXT, student_id TEXT);
      CREATE TABLE teacher_classes (teacher_id TEXT, class_id TEXT);
      ALTER TABLE class_exam_assignments ADD COLUMN pack_id TEXT;
      ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT;
      ALTER TABLE exam_sessions ADD COLUMN pack_id TEXT;
      ALTER TABLE exam_sessions ADD COLUMN result_hash TEXT;
      ALTER TABLE exam_sessions ADD COLUMN analysis_status TEXT;
    `);
    await applySqlFile(db, 'migrations/20260916_archive2_question_bridge.sql', true);
    await applySqlFile(db, 'migrations/20261015_assessment_result_uid_meta_snapshot.sql');

    const sourceArchiveFile = 'source/mixed-origin.js';
    const sourceArchiveRef = 'exams/source/mixed-origin.js';
    const sourceUidOne = `qid_v1_${crypto.createHash('sha256').update(`${sourceArchiveFile}#2`).digest('hex')}`;
    const sourceUidTwo = `qid_v1_${crypto.createHash('sha256').update(`${sourceArchiveFile}#1`).digest('hex')}`;
    const metaOne = JSON.stringify({
      standardUnitKey: 'algebraic_expression', typeKey: 'multi-step',
      provenance: { source: 'frozen-assignment', questionUid: sourceUidOne }
    });
    const metaTwo = JSON.stringify({
      standardUnitKey: 'equation', typeKey: 'reasoning',
      provenance: { source: 'frozen-assignment', questionUid: sourceUidTwo }
    });
    await db.batch([
      db.prepare("INSERT INTO classes VALUES ('class-a','고1 A반','고1','teacher-a',1),('class-b','고1 B반','고1','teacher-b',1)"),
      db.prepare("INSERT INTO teacher_classes VALUES ('teacher-a','class-a'),('teacher-b','class-b')"),
      db.prepare("INSERT INTO students VALUES ('student-a','합성 학생 A','테스트중','고1','1234','재원'),('student-b','합성 학생 B','테스트중','고1','5678','재원')"),
      db.prepare("INSERT INTO class_students VALUES ('class-a','student-a'),('class-b','student-b')"),
      db.prepare(`INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,archive_file,source_type,pack_id)
        VALUES ('assignment-mixed','class-a','혼합 시험','2026-10-15',2,'MIXED:uid-bridge-paper','mixed','assessment-pack-mixed'),
               ('assignment-legacy','class-a','legacy 시험','2026-10-15',2,'MIXED:legacy-paper','mixed',NULL)`),
      db.prepare(`INSERT INTO class_exam_assignment_questions (
          assignment_id,order_no,question_uid,source_archive_file,source_question_no,source_question_ordinal,
          source_fingerprint,standard_unit_key,difficulty_at_assignment,metadata_revision,metadata_hash,metadata_json,resolution_status
        ) VALUES
          ('assignment-mixed',1,?,?,'17',2,'fp-order-one','algebraic_expression','2','meta-r7','${'a'.repeat(64)}',?,'VERIFIED'),
          ('assignment-mixed',2,?,?,'4',1,'fp-order-two','equation','3','meta-r8','${'b'.repeat(64)}',?,'VERIFIED')`)
        .bind(sourceUidOne, sourceArchiveRef, metaOne, sourceUidTwo, sourceArchiveRef, metaTwo),
      db.prepare(`INSERT INTO exam_blueprints (
          archive_file,question_no,source_archive_file,source_question_no,source_question_uid,source_question_ordinal,
          standard_unit_key,standard_unit,concept_cluster_key,sub_unit_key,type_key,template_key,difficulty,metadata_revision,metadata_hash
        ) VALUES ('MIXED:uid-bridge-paper',1,'exams/live/current.js','90','uid-live-before',1,'changed_unit','변경 단원','changed_cluster','changed_sub','changed_type','changed_template','5','live-r1','${'c'.repeat(64)}'),
                 ('MIXED:uid-bridge-paper',2,'exams/live/current.js','91','uid-live-before-two',2,'changed_unit','변경 단원','changed_cluster','changed_sub','changed_type','changed_template','5','live-r1','${'d'.repeat(64)}'),
                 ('MIXED:legacy-paper',1,'exams/live/legacy.js','2','uid-live-only',2,'live_unit','현재 단원','live_cluster','live_sub','live_type','live_template','4','live-r1','${'e'.repeat(64)}')`)
    ]);

    const tokenA = studentToken('student-a', '1234');
    const tokenB = studentToken('student-b', '5678');
    const omrUrl = 'http://local/api/student-portal/omr-submit';
    const frozenRows = (await db.prepare(`SELECT order_no,question_uid,source_question_ordinal FROM class_exam_assignment_questions WHERE assignment_id=? ORDER BY order_no`)
      .bind('assignment-mixed').all()).results;
    assert.deepEqual(frozenRows.map(row => [row.order_no, row.question_uid, row.source_question_ordinal]), [
      [1, sourceUidOne, 2], [2, sourceUidTwo, 1]
    ]);
    const firstSubmit = await requestJson(mf, omrUrl, {
      student_id: 'student-a', student_token: tokenA, assignment_id: 'assignment-mixed',
      wrong_ids: [1], source_question_uid: 'uid-spoof', metadata_revision: 'spoof-revision',
      metadata_hash: 'f'.repeat(64), metadata_json: { source: 'student-spoof' },
      result_items: [{ order_no: 1, source_question_uid: 'uid-spoof', metadata_revision: 'spoof-revision' }]
    });
    assert.equal(firstSubmit.success, true);
    assert.deepEqual(firstSubmit.session.wrong_ids, [1]);

    const initialRows = (await db.prepare(`SELECT * FROM assessment_result_items WHERE session_id=? ORDER BY order_no`)
      .bind(firstSubmit.session.id).all()).results;
    assert.equal(initialRows.length, 2);
    assert.deepEqual(initialRows.map(row => [row.order_no, row.is_correct, row.source_question_uid, row.source_question_ordinal]), [
      [1, 0, sourceUidOne, 2],
      [2, 1, sourceUidTwo, 1]
    ]);
    assert.equal(initialRows[0].source_archive_file, sourceArchiveRef);
    assert.equal(initialRows[0].source_question_no, 17);
    assert.equal(initialRows[0].metadata_revision, 'meta-r7');
    assert.equal(initialRows[0].metadata_hash, 'a'.repeat(64));
    assert.equal(initialRows[0].metadata_json, metaOne);
    assert.equal(initialRows[0].metadata_snapshot_status, 'CAPTURED');
    assert.equal(initialRows[0].source_identity_status, 'VERIFIED');
    assert.notEqual(initialRows[0].source_question_uid, 'uid-spoof');
    assert.deepEqual(initialRows.map(row => row.pack_id), ['assessment-pack-mixed', 'assessment-pack-mixed'],
      'student OMR result rows retain the assignment pack_id');

    const byClassResponse = await mf.dispatchFetch('http://local/api/exam-sessions/by-class?class=class-a', {
      headers: { 'X-Fixture-Role': 'teacher-a' }
    });
    const byClass = await readJson(byClassResponse, 'teacher reads class OMR results');
    const resultForOrderOne = byClass.result_items.find(row => row.session_id === firstSubmit.session.id && row.order_no === 1);
    assert.ok(resultForOrderOne, 'class route must expose persisted result snapshots for clinic identity');
    assert.equal(resultForOrderOne.source_question_uid, sourceUidOne);
    assert.equal(resultForOrderOne.source_question_ordinal, 2, 'fixed assignment order and source ordinal remain distinct');
    assert.equal(resultForOrderOne.metadata_json, metaOne);
    assert.equal('student_answer' in resultForOrderOne, false);
    assert.equal('correct_answer' in resultForOrderOne, false);

    const clinicItem = {
      archiveFile: 'MIXED:uid-bridge-paper',
      questionNo: 1,
      sourceArchiveFile: resultForOrderOne.source_archive_file,
      sourceQuestionNo: Number(resultForOrderOne.source_question_no),
      sourceQuestionOrdinal: resultForOrderOne.source_question_ordinal,
      sourceQuestionUid: resultForOrderOne.source_question_uid,
      sourceFingerprint: resultForOrderOne.source_fingerprint,
      sourceIdentityStatus: resultForOrderOne.source_identity_status,
      metadataRevision: resultForOrderOne.metadata_revision,
      metadataHash: resultForOrderOne.metadata_hash,
      metadataJson: resultForOrderOne.metadata_json,
      metadataSnapshotStatus: resultForOrderOne.metadata_snapshot_status
    };
    const clinic = await requestJson(mf, 'http://local/api/wrong-clinics', {
      title: '합성 UID 브리지 오답 클리닉',
      source: { class_id: 'class-a', class_name: '고1 A반', scope_type: 'class' },
      targets: [{ type: 'student', student_id: 'student-a', class_id: 'class-a' }],
      payload: {
        mode: 'student', classId: 'class-a', className: '고1 A반',
        students: [{ studentId: 'student-a', studentName: '합성 학생 A', classId: 'class-a', wrongItems: [clinicItem] }]
      }
    }, { 'X-Fixture-Role': 'teacher-a' });
    assert.equal(clinic.packet_count, 1);
    const storedItem = await db.prepare('SELECT * FROM wrong_clinic_packet_items WHERE packet_id=? ORDER BY order_no')
      .bind(clinic.packets[0].packet_id).first();
    const storedItemJson = JSON.parse(storedItem.item_json);
    assert.equal(storedItem.order_no, 1);
    assert.equal(storedItem.archive_file, sourceArchiveRef);
    assert.equal(storedItem.question_no, 17);
    assert.equal(storedItemJson.displayArchiveFile, 'MIXED:uid-bridge-paper');
    assert.equal(storedItemJson.displayQuestionNo, 1);
    assert.equal(storedItemJson.sourceArchiveFile, sourceArchiveRef);
    assert.equal(storedItemJson.sourceQuestionNo, 17);
    assert.equal(storedItemJson.sourceQuestionOrdinal, 2);
    assert.equal(storedItemJson.sourceQuestionUid, sourceUidOne);
    assert.equal(storedItemJson.metadataRevision, 'meta-r7');
    assert.equal(storedItemJson.metadataHash, 'a'.repeat(64));
    assert.equal(storedItemJson.metadataJson, metaOne);
    assert.equal(storedItemJson.metadataSnapshotStatus, 'CAPTURED');

    const setResponse = await mf.dispatchFetch(`http://local/api/wrong-clinics/set/${clinic.public_set_key}`, {
      headers: { 'X-Fixture-Role': 'teacher-a' }
    });
    const setPayload = (await readJson(setResponse, 'clinic set readback')).payload;
    const roundTrippedClinicItem = setPayload.students[0].wrongItems[0];
    assert.equal(roundTrippedClinicItem.sourceQuestionUid, sourceUidOne);
    assert.equal(roundTrippedClinicItem.metadataRevision, 'meta-r7');
    assert.equal(roundTrippedClinicItem.metadataJson, metaOne);
    assert.equal(roundTrippedClinicItem.displayQuestionNo, 1);

    await requestJson(mf, `http://local/api/student-portal/wrong-clinics/${clinic.packets[0].packet_key}/submit`, {
      student_id: 'student-a', student_token: tokenA
    });
    const reviewSave = await requestJson(mf, `http://local/api/student-portal/wrong-clinics/${clinic.packets[0].packet_key}/review-wrongs`, {
      student_id: 'student-a', student_token: tokenA, wrong_ids: [1]
    });
    assert.deepEqual(reviewSave.packet.review_wrong_ids, [1]);
    const reviewResponse = await mf.dispatchFetch(`http://local/api/wrong-clinics/review-wrongs?student_id=student-a&packet_key=${clinic.packets[0].packet_key}`, {
      headers: { 'X-Fixture-Role': 'teacher-a' }
    });
    const review = await readJson(reviewResponse, 'teacher reads clinic retake wrong candidates');
    assert.equal(review.items.length, 1);
    assert.equal(review.items[0].order_no, 1, 'review_wrong_ids indexes the packet row, not source ordinal');
    assert.equal(review.items[0].item.sourceQuestionUid, sourceUidOne);
    assert.equal(review.items[0].item.sourceQuestionNo, 17);
    assert.equal(review.items[0].item.sourceQuestionOrdinal, 2);
    assert.equal(review.items[0].item.metadataHash, 'a'.repeat(64));
    assert.equal(review.items[0].item.reviewSourceOrderNo, 1);

    await db.prepare('UPDATE wrong_clinic_packet_items SET item_json=? WHERE id=?')
      .bind(JSON.stringify({ sourceQuestionUid: sourceUidOne, displayArchiveFile: 'MIXED:uid-bridge-paper', displayQuestionNo: 1 }), storedItem.id).run();
    const legacyClinicRead = await mf.dispatchFetch(`http://local/api/wrong-clinics/set/${clinic.public_set_key}`, {
      headers: { 'X-Fixture-Role': 'teacher-a' }
    });
    const legacyClinicItem = (await readJson(legacyClinicRead, 'legacy UID-only clinic item readback')).payload.students[0].wrongItems[0];
    assert.equal(legacyClinicItem.sourceQuestionUid, null, 'a legacy item UID without provenance status is not promoted');
    assert.equal(legacyClinicItem.legacySourceQuestionUid, sourceUidOne);
    assert.equal(legacyClinicItem.sourceIdentityStatus, 'UNRESOLVED');

    const currentSessionId = firstSubmit.session.id;
    await db.prepare(`UPDATE exam_blueprints SET source_archive_file='exams/live/changed.js', source_question_no='999',
      source_question_uid='uid-live-after', source_question_ordinal=1, metadata_revision='live-r2', metadata_hash=?
      WHERE archive_file='MIXED:uid-bridge-paper' AND question_no=1`).bind('9'.repeat(64)).run();
    const repeatedSubmission = await requestJson(mf, omrUrl, {
      student_id: 'student-a', student_token: tokenA, assignment_id: 'assignment-mixed',
      wrong_ids: [1], source_question_uid: 'uid-second-spoof'
    });
    assert.equal(repeatedSubmission.already_submitted, true);
    assert.equal(repeatedSubmission.session.id, currentSessionId, 'same-assignment retry returns the original session');
    assert.deepEqual(repeatedSubmission.session.wrong_ids, [1]);
    const afterDuplicate = (await db.prepare(`SELECT * FROM assessment_result_items WHERE session_id=? ORDER BY order_no`)
      .bind(currentSessionId).all()).results;
    assert.deepEqual(afterDuplicate.map(row => [row.order_no, row.is_correct]), [[1, 0], [2, 1]]);
    assert.deepEqual(afterDuplicate.map(row => [row.source_question_uid, row.source_question_ordinal, row.metadata_revision, row.metadata_hash, row.metadata_json]), [
      [sourceUidOne, 2, 'meta-r7', 'a'.repeat(64), metaOne],
      [sourceUidTwo, 1, 'meta-r8', 'b'.repeat(64), metaTwo]
    ]);
    assert.deepEqual(afterDuplicate.map(row => row.pack_id), ['assessment-pack-mixed', 'assessment-pack-mixed']);

    const changedSubmissionResponse = await mf.dispatchFetch(omrUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: 'student-a', student_token: tokenA, assignment_id: 'assignment-mixed', wrong_ids: [2] })
    });
    assert.equal(changedSubmissionResponse.status, 409);
    const changedSubmission = await changedSubmissionResponse.json();
    assert.equal(changedSubmission.code, 'OMR_ALREADY_SUBMITTED');
    assert.deepEqual((await db.prepare('SELECT question_id FROM wrong_answers WHERE session_id=? ORDER BY question_id')
      .bind(currentSessionId).all()).results.map(row => Number(row.question_id)), [1]);

    const teacherRegrade = await mf.dispatchFetch('http://local/api/exam-sessions/new', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Fixture-Role': 'teacher-a' },
      body: JSON.stringify({
        student_id: 'student-a', class_id: 'class-a', assignment_id: 'assignment-mixed',
        exam_title: '혼합 시험', exam_date: '2026-10-15', archive_file: 'MIXED:uid-bridge-paper',
        question_count: 2, score: 50, wrong_ids: [2]
      })
    });
    const regrade = await readJson(teacherRegrade, 'teacher regrades the existing result');
    assert.equal(regrade.id, currentSessionId);
    const afterRegrade = (await db.prepare(`SELECT * FROM assessment_result_items WHERE session_id=? ORDER BY order_no`)
      .bind(currentSessionId).all()).results;
    assert.deepEqual(afterRegrade.map(row => [row.order_no, row.is_correct]), [[1, 1], [2, 0]]);
    assert.deepEqual(afterRegrade.map(row => [row.source_question_uid, row.source_question_ordinal, row.metadata_revision, row.metadata_hash, row.metadata_json]), [
      [sourceUidOne, 2, 'meta-r7', 'a'.repeat(64), metaOne],
      [sourceUidTwo, 1, 'meta-r8', 'b'.repeat(64), metaTwo]
    ]);
    assert.deepEqual(afterRegrade.map(row => row.pack_id), ['assessment-pack-mixed', 'assessment-pack-mixed'],
      'teacher regrade with omitted pack_id input preserves the existing pack association');

    const retakeAssignment = {
      id: 'assignment-retake', class_id: 'class-a', exam_title: '혼합 시험 재응시', exam_date: '2026-10-16',
      question_count: 2, archive_file: 'MIXED:uid-bridge-paper', source_type: 'mixed', pack_id: 'assessment-pack-retake'
    };
    await db.prepare(`INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,archive_file,source_type,pack_id)
      VALUES (?,?,?,?,?,?,?,?)`).bind(...Object.values(retakeAssignment)).run();
    const retakeBridge = (orderNo, uid, sourceNo, ordinal, fingerprint, unit, difficulty, revision, hash, json) =>
      db.prepare(`INSERT INTO class_exam_assignment_questions (
        assignment_id,order_no,question_uid,source_archive_file,source_question_no,source_question_ordinal,
        source_fingerprint,standard_unit_key,difficulty_at_assignment,metadata_revision,metadata_hash,metadata_json,resolution_status
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
        'assignment-retake', orderNo, uid, sourceArchiveRef, sourceNo, ordinal,
        fingerprint, unit, difficulty, revision, hash, json, 'VERIFIED'
      );
    await db.batch([
      retakeBridge(1, sourceUidOne, '17', 2, 'fp-order-one', 'algebraic_expression', '2', 'meta-r7', 'a'.repeat(64), metaOne),
      retakeBridge(2, sourceUidTwo, '4', 1, 'fp-order-two', 'equation', '3', 'meta-r8', 'b'.repeat(64), metaTwo)
    ]);
    const priorResultBeforeRetake = (await db.prepare(`SELECT order_no,is_correct,source_question_uid,metadata_revision,metadata_hash,metadata_json
      FROM assessment_result_items WHERE session_id=? ORDER BY order_no`).bind(currentSessionId).all()).results;
    const newAssignmentRetake = await requestJson(mf, omrUrl, {
      student_id: 'student-a', student_token: tokenA, assignment_id: 'assignment-retake', wrong_ids: [2]
    });
    assert.notEqual(newAssignmentRetake.session.id, currentSessionId, 'a new assignment gets a separate retake session');
    assert.equal(newAssignmentRetake.session.assignment_id, 'assignment-retake');
    const actualRetakeRows = (await db.prepare('SELECT * FROM assessment_result_items WHERE session_id=? ORDER BY order_no')
      .bind(newAssignmentRetake.session.id).all()).results;
    assert.deepEqual(actualRetakeRows.map(row => [row.order_no, row.is_correct]), [[1, 1], [2, 0]]);
    assert.deepEqual(actualRetakeRows.map(row => [row.source_question_uid, row.source_question_ordinal, row.metadata_revision, row.metadata_hash, row.metadata_json]), [
      [sourceUidOne, 2, 'meta-r7', 'a'.repeat(64), metaOne],
      [sourceUidTwo, 1, 'meta-r8', 'b'.repeat(64), metaTwo]
    ]);
    assert.deepEqual(actualRetakeRows.map(row => row.pack_id), ['assessment-pack-retake', 'assessment-pack-retake']);
    assert.deepEqual((await db.prepare(`SELECT order_no,is_correct,source_question_uid,metadata_revision,metadata_hash,metadata_json
      FROM assessment_result_items WHERE session_id=? ORDER BY order_no`).bind(currentSessionId).all()).results, priorResultBeforeRetake,
    'a distinct assignment retake cannot overwrite the prior session result or its snapshot');

    const legacySubmit = await requestJson(mf, omrUrl, {
      student_id: 'student-a', student_token: tokenA, assignment_id: 'assignment-legacy', wrong_ids: [2]
    });
    assert.equal(legacySubmit.success, true, 'a missing frozen bridge does not block OMR submission');
    const legacyRows = (await db.prepare(`SELECT * FROM assessment_result_items WHERE session_id=? ORDER BY order_no`)
      .bind(legacySubmit.session.id).all()).results;
    assert.equal(legacyRows.length, 2);
    for (const row of legacyRows) {
      assert.equal(row.source_question_uid, null, 'a current blueprint UID is not backfilled into a legacy assignment');
      assert.equal(row.source_identity_status, 'UNRESOLVED');
      assert.equal(row.metadata_revision, null);
      assert.equal(row.metadata_hash, null);
      assert.equal(row.metadata_json, null);
      assert.equal(row.metadata_snapshot_status, 'UNRESOLVED');
    }

    await t.test('class, student and clinic access boundaries remain enforced', async () => {
      const foreignClass = await mf.dispatchFetch('http://local/api/exam-sessions/by-class?class=class-b', {
        headers: { 'X-Fixture-Role': 'teacher-a' }
      });
      assert.equal(foreignClass.status, 403);
      const foreignOmr = await mf.dispatchFetch(omrUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: 'student-b', student_token: tokenB, assignment_id: 'assignment-mixed', wrong_ids: [1] })
      });
      assert.equal(foreignOmr.status, 404, 'another student cannot submit a class-a assignment');
      const foreignClinic = await mf.dispatchFetch('http://local/api/wrong-clinics', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Fixture-Role': 'teacher-a' },
        body: JSON.stringify({
          source: { class_id: 'class-a', scope_type: 'class' },
          targets: [{ type: 'student', student_id: 'student-b', class_id: 'class-b' }],
          payload: { mode: 'student', students: [{ studentId: 'student-b', wrongItems: [clinicItem] }] }
        })
      });
      assert.equal(foreignClinic.status, 403, 'a teacher cannot distribute clinic packets to an inaccessible student');
      const foreignReview = await mf.dispatchFetch(`http://local/api/student-portal/wrong-clinics/${clinic.packets[0].packet_key}/review-wrongs`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: 'student-b', student_token: tokenB, wrong_ids: [1] })
      });
      assert.equal(foreignReview.status, 404, 'a different student cannot update another student packet review');
    });
  } finally {
    await mf.dispose();
  }
});
