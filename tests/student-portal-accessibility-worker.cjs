'use strict';

// Test-only, isolated D1. No credentials, records or writes from production.
// The complete current Worker (including its authentication middleware) runs
// unchanged; only its transport is redirected by the browser harness.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');

async function createLocalStudentWorker(root) {
  const worker = path.join(root, 'apmath/worker-backup/worker');
  const requireWorker = createRequire(path.join(worker, 'package.json'));
  const { build } = requireWorker('esbuild');
  const { Miniflare } = requireWorker('miniflare');
  const bundle = await build({
    entryPoints: [path.join(worker, 'index.js')], bundle: true, write: false,
    format: 'esm', platform: 'browser', external: ['cloudflare:*', 'node:*'],
    nodePaths: (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean)
  });
  const mf = new Miniflare({
    modules: true, script: bundle.outputFiles[0].text,
    compatibilityDate: '2026-07-11', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB'],
    r2Buckets: ['EXAM_PDF_BUCKET', 'HOMEWORK_PHOTO_BUCKET', 'D1_BACKUP_BUCKET'],
    bindings: { ARCHIVE2_ENABLED: 'true' }
  });
  const db = await mf.getD1Database('DB');
  for (const filename of ['schema.sql', 'schema_planner.sql']) {
    const sql = fs.readFileSync(path.join(worker, filename), 'utf8').replace(/--[^\n]*/g, '').replace(/\n/g, ' ');
    await db.exec(sql);
  }
  // This current runtime field is added by the deployed migration history.
  await db.prepare('ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT').run();
  const identity = {
    id: 'qa-navigation-student', name: '접근성 검수 학생', pin: '642810',
    teacherLogin: 'qa-navigation-teacher', teacherPassword: 'local-only-accessibility-password',
    outsiderId: 'qa-navigation-other-student'
  };
  const today = new Date().toISOString().slice(0, 10);
  const passwordHash = crypto.createHash('sha256').update(identity.teacherPassword).digest('hex');
  await db.batch([
    db.prepare('INSERT INTO teachers (id,name,login_id,password_hash,role) VALUES (?,?,?,?,?)').bind('qa-navigation-teacher', '접근성 검수 선생님', identity.teacherLogin, passwordHash, 'teacher'),
    db.prepare('INSERT INTO students (id,name,grade,school_name,student_pin,status) VALUES (?,?,?,?,?,?)').bind(identity.id, identity.name, '중2', '합성 검수 학교', identity.pin, '재원'),
    db.prepare('INSERT INTO students (id,name,grade,school_name,student_pin,status) VALUES (?,?,?,?,?,?)').bind(identity.outsiderId, '권한 밖 합성 학생', '중2', '합성 검수 학교', '642811', '재원'),
    db.prepare('INSERT INTO classes (id,name,grade,teacher_name,is_active) VALUES (?,?,?,?,?)').bind('qa-navigation-class', '합성 중2반', '중2', '접근성 검수 선생님', 1),
    db.prepare('INSERT INTO classes (id,name,grade,is_active) VALUES (?,?,?,?)').bind('qa-navigation-other-class', '권한 밖 합성 반', '중2', 1),
    db.prepare('INSERT INTO teacher_classes (teacher_id,class_id) VALUES (?,?)').bind('qa-navigation-teacher', 'qa-navigation-class'),
    db.prepare('INSERT INTO class_students (class_id,student_id) VALUES (?,?)').bind('qa-navigation-class', identity.id),
    db.prepare('INSERT INTO class_students (class_id,student_id) VALUES (?,?)').bind('qa-navigation-other-class', identity.outsiderId),
    db.prepare('INSERT INTO homework_photo_assignments (id,class_id,teacher_id,title,description,due_date) VALUES (?,?,?,?,?,?)').bind('qa-navigation-homework', 'qa-navigation-class', 'qa-navigation-teacher', '합성 과제 사진 제출', '풀이를 확인할 수 있도록 사진을 올려 주세요.', today),
    db.prepare('INSERT INTO homework_photo_submissions (id,assignment_id,student_id) VALUES (?,?,?)').bind('qa-navigation-homework-submission', 'qa-navigation-homework', identity.id),
    db.prepare('INSERT INTO student_plans (id,student_id,plan_date,title,subject) VALUES (?,?,?,?,?)').bind('qa-navigation-plan', identity.id, today, '오늘의 합성 복습 계획', '수학')
  ]);
  for (const [id, title, date] of [
    ['qa-navigation-pending', '삼각형의 성질 · 합성 검수 시험', today],
    ['qa-navigation-second', '확률 · 합성 검수 시험', '2026-01-02'],
    ['qa-navigation-complete', '완료한 합성 검수 시험', '2026-01-01']
  ]) {
    await db.prepare('INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,archive_file) VALUES (?,?,?,?,?,?)')
      .bind(id, 'qa-navigation-class', title, date, 20, 'qa-navigation-synthetic.js').run();
    await db.prepare('INSERT INTO class_exam_assignment_recipients (assignment_id,student_id) VALUES (?,?)').bind(id, identity.id).run();
  }
  await db.prepare('INSERT INTO exam_sessions (id,student_id,exam_title,score,exam_date,question_count,class_id,archive_file,assignment_id) VALUES (?,?,?,?,?,?,?,?,?)')
    .bind('qa-navigation-session', identity.id, '완료한 합성 검수 시험', 85, '2026-01-01', 20, 'qa-navigation-class', 'qa-navigation-synthetic.js', 'qa-navigation-complete').run();
  // Small, explicitly synthetic issued snapshots exercise the real original
  // and mixed readers. No production questions, answers or metadata are used.
  const questions = [1, 2].map(id => ({
    id, questionUid: 'qa-navigation-question-' + id,
    type: 'subjective', content: '합성 검수 문제 ' + id + ': ' + id + ' + 1의 값을 구하세요.',
    answer: String(id + 1), solution: '합성 검수 해설 ' + id + ': ' + id + '에 1을 더하면 ' + (id + 1) + '입니다.'
  }));
  for (const [id, archiveFile] of [
    ['qa-navigation-second', 'MIXED:qa-navigation-snapshot'],
    ['qa-navigation-complete', 'original/qa-navigation-snapshot.js']
  ]) {
    const snapshot = {
      questions,
      meta: { sourceKind: 'archive2-original', title: '합성 학생포털 이동 검수', sourceArchiveFile: archiveFile,
        qpp: 2, includeQr: false, questionUids: questions.map(question => question.questionUid),
        printHeaderOptions: { title: '합성 학생포털 이동 검수', showNameLine: false, showScoreLine: false } }
    };
    await db.prepare('UPDATE class_exam_assignments SET question_count=?,archive_file=?,mixed_payload_json=? WHERE id=?')
      .bind(questions.length, archiveFile, JSON.stringify(snapshot), id).run();
  }
  await db.prepare('UPDATE exam_sessions SET exam_date=?,question_count=?,archive_file=?,score=? WHERE id=?')
    .bind(today, questions.length, 'original/qa-navigation-snapshot.js', 50, 'qa-navigation-session').run();
  const request = (endpoint, options) => mf.dispatchFetch('http://local-worker.test/api/' + endpoint, options);
  const teacherResponse = await request('auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login_id: identity.teacherLogin, password: identity.teacherPassword }) });
  const teacherSession = await teacherResponse.json();
  if (!teacherResponse.ok || !teacherSession.session_token) { await mf.dispose(); throw new Error('Local teacher login failed'); }
  return { mf, db, identity, teacherSession, request, dispose: () => mf.dispose() };
}

module.exports = { createLocalStudentWorker };
