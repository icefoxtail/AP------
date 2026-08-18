const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath/worker-backup/worker');
const routeSource = fs.readFileSync(path.join(workerDir, 'routes/students.js'), 'utf8');
const editSource = fs.readFileSync(path.join(root, 'apmath/js/student-edit.js'), 'utf8');
const adminSource = fs.readFileSync(path.join(root, 'apmath/js/dashboard-admin.js'), 'utf8');

function toFileUrl(filePath) {
  return String(new URL(`file:///${filePath.replace(/\\/g, '/')}`));
}

function createMockD1(db) {
  return {
    prepare(sql) {
      return {
        sql,
        bindings: [],
        bind(...values) {
          this.bindings = values.map(value => value === undefined ? null : value);
          return this;
        },
        async first() {
          const row = db.prepare(this.sql).get(...this.bindings);
          return row ? { ...row } : null;
        },
        async all() {
          return { results: db.prepare(this.sql).all(...this.bindings).map(row => ({ ...row })) };
        },
        async run() {
          db.prepare(this.sql).run(...this.bindings);
          return { success: true };
        }
      };
    },
    async batch(statements) {
      db.exec('BEGIN');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        db.exec('COMMIT');
        return results;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    }
  };
}

async function callStudents(module, env, method, pathParts, body = {}) {
  const request = { method };
  const response = await module.handleStudents(
    request,
    env,
    { id: 'admin-1', login_id: 'owner', role: 'admin' },
    pathParts,
    new URL(`https://worker.local/${pathParts.join('/')}`),
    body
  );
  return { status: response.status, body: await response.json() };
}

async function run() {
  assert(editSource.includes('id="restore-class"') && editSource.includes('id="restore-date"'), '재등원 UI에 반과 날짜 선택이 있어야 함');
  assert(editSource.includes('class_id: classId') && editSource.includes('reenrollment_date: reenrollmentDate'), '재등원 UI가 반과 날짜를 API로 전송해야 함');
  assert(editSource.includes('restoreStudentSubmitting') && editSource.includes('handleRestore.isReenrollmentModalOpen'), '재등원 중복 제출과 모달 이동 경합을 막아야 함');
  assert(adminSource.includes('return handleRestore(sid)'), '퇴원생 보고서 복구 버튼이 재등원 입력 화면으로 연결되어야 함');
  assert(!routeSource.includes('DELETE FROM attendance') && !routeSource.includes('DELETE FROM homework'), '퇴원·재등원이 학습 기록을 삭제하면 안 됨');

  const db = new DatabaseSync(':memory:');
  db.exec(fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8'));
  db.prepare("INSERT INTO students (id, name, school_name, grade, status, student_pin) VALUES ('s1', '조예령', '한빛중', '중2', '재원', '2468')").run();
  db.prepare("INSERT INTO classes (id, name, grade, is_active) VALUES ('c1', '중2 A반', '중2', 1), ('c2', '중2 B반', '중2', 1)").run();
  db.prepare("INSERT INTO class_students (class_id, student_id) VALUES ('c1', 's1')").run();
  db.prepare("INSERT INTO student_enrollments (id, student_id, branch, class_id, status, start_date, tuition_amount) VALUES ('en-old', 's1', 'apmath', 'c1', 'active', '2026-03-01', 350000)").run();
  db.prepare("INSERT INTO attendance (id, student_id, status, date) VALUES ('att1', 's1', '출석', '2026-07-01')").run();
  db.prepare("INSERT INTO homework (id, student_id, status, date) VALUES ('hw1', 's1', '완료', '2026-07-01')").run();

  const module = await import(toFileUrl(path.join(workerDir, 'routes/students.js')));
  const env = { DB: createMockD1(db) };
  const withdrawn = await callStudents(module, env, 'DELETE', ['api', 'students', 's1']);
  assert.strictEqual(withdrawn.status, 200);
  assert.strictEqual(db.prepare("SELECT status FROM students WHERE id = 's1'").get().status, '퇴원');
  const ended = db.prepare("SELECT * FROM student_enrollments WHERE id = 'en-old'").get();
  assert.strictEqual(ended.status, 'ended');
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(ended.end_date));
  const duplicateWithdrawal = await callStudents(module, env, 'DELETE', ['api', 'students', 's1']);
  assert.strictEqual(duplicateWithdrawal.status, 409);

  const future = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
  const rejected = await callStudents(module, env, 'PATCH', ['api', 'students', 's1', 'restore'], { class_id: 'c2', reenrollment_date: future });
  assert.strictEqual(rejected.status, 400);
  assert.strictEqual(db.prepare("SELECT status FROM students WHERE id = 's1'").get().status, '퇴원', '잘못된 재등원 요청은 상태를 바꾸면 안 됨');

  const todayKst = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const restored = await callStudents(module, env, 'PATCH', ['api', 'students', 's1', 'restore'], { class_id: 'c2', reenrollment_date: todayKst });
  assert.strictEqual(restored.status, 200);
  assert.strictEqual(restored.body.student.status, '재원');
  assert.strictEqual(restored.body.student.student_pin, '2468');
  assert.strictEqual(db.prepare("SELECT class_id FROM class_students WHERE student_id = 's1'").get().class_id, 'c2');
  const active = db.prepare("SELECT * FROM student_enrollments WHERE student_id = 's1' AND status = 'active'").all();
  assert.strictEqual(active.length, 1);
  assert.strictEqual(active[0].class_id, 'c2');
  assert.strictEqual(active[0].start_date, todayKst);
  assert.strictEqual(active[0].tuition_amount, 350000, '기존 수강료를 새 수강 기간에 이어받아야 함');
  assert.strictEqual(db.prepare("SELECT COUNT(*) AS count FROM student_status_history WHERE student_id = 's1'").get().count, 2);
  assert.strictEqual(db.prepare("SELECT COUNT(*) AS count FROM class_transfer_history WHERE student_id = 's1' AND from_class_id = 'c1' AND to_class_id = 'c2'").get().count, 1);
  assert.strictEqual(db.prepare("SELECT COUNT(*) AS count FROM attendance WHERE student_id = 's1'").get().count, 1);
  assert.strictEqual(db.prepare("SELECT COUNT(*) AS count FROM homework WHERE student_id = 's1'").get().count, 1);

  const duplicate = await callStudents(module, env, 'PATCH', ['api', 'students', 's1', 'restore'], { class_id: 'c2', reenrollment_date: todayKst });
  assert.strictEqual(duplicate.status, 409);
  assert.strictEqual(db.prepare("SELECT COUNT(*) AS count FROM student_enrollments WHERE student_id = 's1' AND status = 'active'").get().count, 1);

  const missingStudent = await callStudents(module, env, 'PATCH', ['api', 'students', 'missing', 'restore'], { class_id: 'c2', reenrollment_date: todayKst });
  assert.strictEqual(missingStudent.status, 404);
  const missingWithdrawal = await callStudents(module, env, 'DELETE', ['api', 'students', 'missing']);
  assert.strictEqual(missingWithdrawal.status, 404);

  await callStudents(module, env, 'DELETE', ['api', 'students', 's1']);
  const missingClass = await callStudents(module, env, 'PATCH', ['api', 'students', 's1', 'restore'], { class_id: 'missing', reenrollment_date: todayKst });
  assert.strictEqual(missingClass.status, 404);
  db.prepare("INSERT INTO classes (id, name, grade, is_active) VALUES ('c3', '중2 폐강반', '중2', 0)").run();
  const inactiveClass = await callStudents(module, env, 'PATCH', ['api', 'students', 's1', 'restore'], { class_id: 'c3', reenrollment_date: todayKst });
  assert.strictEqual(inactiveClass.status, 409);
  const sameClass = await callStudents(module, env, 'PATCH', ['api', 'students', 's1', 'restore'], { class_id: 'c2', reenrollment_date: todayKst });
  assert.strictEqual(sameClass.status, 200);
  assert.strictEqual(db.prepare("SELECT COUNT(*) AS count FROM class_transfer_history WHERE student_id = 's1'").get().count, 1, '같은 반 재등원은 반 이동 이력을 추가하면 안 됨');
  assert.strictEqual(db.prepare("SELECT COUNT(*) AS count FROM student_enrollments WHERE student_id = 's1' AND status = 'active'").get().count, 1);

  db.close();
  console.log('AP Math student reenrollment integration test passed');
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
