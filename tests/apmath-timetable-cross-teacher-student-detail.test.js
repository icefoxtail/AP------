const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath/worker-backup/worker');
const routeSource = fs.readFileSync(path.join(workerDir, 'routes/students.js'), 'utf8');
const coreSource = fs.readFileSync(path.join(root, 'apmath/js/core.js'), 'utf8');
const studentSource = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');
const timetableSource = fs.readFileSync(path.join(root, 'apmath/js/timetable.js'), 'utf8');
const uiSource = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const wrongClinicsSource = fs.readFileSync(path.join(workerDir, 'routes/wrong-clinics.js'), 'utf8');

function toFileUrl(filePath) {
  return String(new URL(`file:///${filePath.replace(/\\/g, '/')}`));
}

function createMockD1(db) {
  return {
    prepare(sql) {
      return {
        sql,
        bindings: [],
        bind(...values) { this.bindings = values.map(value => value === undefined ? null : value); return this; },
        async first() { const row = db.prepare(this.sql).get(...this.bindings); return row ? { ...row } : null; },
        async all() { return { results: db.prepare(this.sql).all(...this.bindings).map(row => ({ ...row })) }; },
        async run() { db.prepare(this.sql).run(...this.bindings); return { success: true }; }
      };
    },
    async batch(statements) {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      return results;
    }
  };
}

async function callStudents(module, env, teacher, method, pathParts, body = {}) {
  const response = await module.handleStudents(
    { method }, env, teacher, pathParts,
    new URL(`https://worker.local/${pathParts.join('/')}`), body
  );
  return { status: response.status, body: await response.json() };
}

async function run() {
  assert(coreSource.includes('students: Array.isArray(data.students) ? normalizeStudentRows(data.students)')
    && coreSource.includes('class_students: Array.isArray(data.class_students) ? data.class_students'),
  'lightweight refresh must replace students and class assignments');
  assert(timetableSource.includes('async function openLiveTimetable()')
    && timetableSource.includes("await refreshDataOnly()")
    && timetableSource.includes("return renderTimetable()")
    && timetableSource.includes("live refresh failed"),
  'opening the timetable must refresh live data first and retain cached fallback');
  assert(uiSource.includes("typeof openLiveTimetable==='function'"), 'drawer timetable entry must use live refresh');
  assert(studentSource.includes("/timetable-detail`")
    && studentSource.includes('timetable_can_edit')
    && studentSource.includes('const timetableOnly = detail.can_edit === false')
    && studentSource.includes('mergeStudentIntoState(detail.student, { timetableOnly })')
    && studentSource.includes('state.ui.timetableStudentDetails[studentId] = detail')
    && studentSource.includes("options.mode === 'edit' && s.timetable_can_edit !== false")
    && studentSource.includes('state.db.timetable_class_students')
    && studentSource.includes("학생 전체 정보를 불러오지 못했습니다")
    && studentSource.includes("s.timetable_can_edit !== false ? `<button type=\"button\" class=\"btn ap-student-mini-btn\"")
    && studentSource.includes('if (!options.timetableOnly)'),
  'cross-teacher timetable detail must load the selected student and retain timetable class fallback');
  assert(routeSource.includes("access_type)\n      VALUES (?, ?, ?, 'timetable_student_detail')"), 'cross-teacher detail reads must be privacy-audited');
  assert(wrongClinicsSource.includes("'timetable_student_wrong_clinic'")
    && wrongClinicsSource.includes('SELECT student_id FROM class_students WHERE student_id = ? LIMIT 1'),
  'view-only timetable students must be able to load the wrong-clinic tab with a privacy audit');

  const db = new DatabaseSync(':memory:');
  db.exec(fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8'));
  db.prepare("INSERT INTO students (id, name, school_name, grade, status, student_phone, parent_phone, student_pin) VALUES ('s1', '조예령', '왕운중', '중3', '재원', '010-1111-2222', '010-3333-4444', '2468')").run();
  db.prepare("INSERT INTO classes (id, name, grade, teacher_name, is_active) VALUES ('c-own', '담당반', '중2', '내담임', 1), ('c-other', '중3A', '중3', '다른담임', 1)").run();
  db.prepare("INSERT INTO teacher_classes (teacher_id, class_id) VALUES ('t1', 'c-own')").run();
  db.prepare("INSERT INTO class_students (class_id, student_id) VALUES ('c-other', 's1')").run();
  db.prepare("INSERT INTO exam_sessions (id, student_id, exam_title, score, exam_date) VALUES ('ex1', 's1', '주간평가', 90, '2026-08-17')").run();
  db.prepare("INSERT INTO consultations (id, student_id, date, type, content) VALUES ('cn1', 's1', '2026-08-16', '정기', '상담')").run();

  const module = await import(toFileUrl(path.join(workerDir, 'routes/students.js')));
  const env = { DB: createMockD1(db) };
  const teacher = { id: 't1', role: 'teacher', name: '내담임' };
  const detail = await callStudents(module, env, teacher, 'GET', ['api', 'students', 's1', 'timetable-detail']);
  assert.strictEqual(detail.status, 200);
  assert.strictEqual(detail.body.student.student_pin, '2468');
  assert.strictEqual(detail.body.student.school_name, '왕운중');
  assert.strictEqual(detail.body.class_student.class_id, 'c-other');
  assert.strictEqual(detail.body.can_edit, false, 'other homeroom teacher must receive view-only detail');
  assert.strictEqual(detail.body.exam_sessions.length, 1);
  assert.strictEqual(detail.body.consultations.length, 1);
  assert(Array.isArray(detail.body.attendance));
  assert(Array.isArray(detail.body.homework));
  assert(Array.isArray(detail.body.wrong_answers));
  assert(Array.isArray(detail.body.school_exam_records));
  assert(Array.isArray(detail.body.student_enrollments));
  assert(Array.isArray(detail.body.parent_contacts));
  assert(Array.isArray(detail.body.student_status_history));
  assert(Array.isArray(detail.body.class_transfer_history));
  assert.strictEqual(db.prepare("SELECT COUNT(*) AS count FROM privacy_access_logs WHERE actor_id = 't1' AND student_id = 's1' AND access_type = 'timetable_student_detail'").get().count, 1);

  const history = await callStudents(module, env, teacher, 'GET', ['api', 'students', 's1', 'detail-data']);
  assert.strictEqual(history.status, 403, 'legacy detail endpoint must remain scoped to the homeroom teacher');
  const forbiddenEdit = await callStudents(module, env, teacher, 'PATCH', ['api', 'students', 's1'], { name: '변경시도' });
  assert.strictEqual(forbiddenEdit.status, 403, 'cross-teacher detail access must not grant edit permission');

  db.close();
  console.log('AP Math cross-teacher timetable student detail test passed');
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
