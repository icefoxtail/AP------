const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
const studentsView = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');
const timetableView = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'migrations/20260601_eie_student_info_class_teachers.sql'), 'utf8');

assert(
  source.includes('const DIRECT_STUDENT_STATUSES'),
  'current EIE worker should define a direct student status allow-list for student CRUD'
);

assert(
  source.includes("'paused'"),
  'EIE worker should accept paused student status for leave students'
);

assert(
  /async function handlePatchStudent\(request, env, teacher, studentId\)[\s\S]*const existing = await getStudentById\(env, studentId\);[\s\S]*if \(!existing\)/.test(source),
  'PATCH /students/:id should verify the student exists before mutating fields or contacts'
);

assert(
  /const phoneRaw = safeText\(body\.student_phone \|\| body\.phone \|\| body\.phone_raw\);[\s\S]*const normalizedPhone = phoneRaw \? normalizePhone\(phoneRaw\) : '';/.test(source),
  'student PATCH should normalize student phone without overwriting it with parent_phone'
);

assert(
  source.includes("'parent_phone'") && source.includes("'guardian_relation'") && source.includes("'student_address'") && source.includes("'vehicle_info'") && source.includes("'student_pin'") && source.includes("'student_type'"),
  'student CRUD should persist AP-style student info fields in raw_meta_json'
);

for (const column of [
  'school_name',
  'student_phone',
  'parent_phone',
  'guardian_relation',
  'student_address',
  'vehicle_info',
  'student_pin',
  'student_type'
]) {
  assert(
    migration.includes(`ALTER TABLE eie_students ADD COLUMN ${column}`),
    `EIE migration should add eie_students.${column}`
  );
}

assert(
  migration.includes('CREATE TABLE IF NOT EXISTS eie_student_teachers') &&
    migration.includes('CREATE TABLE IF NOT EXISTS eie_timetable_cell_teachers'),
  'EIE migration should create normalized teacher link tables'
);

assert(
  /INSERT OR IGNORE INTO eie_student_teachers[\s\S]*json_each/.test(migration) &&
    /INSERT OR IGNORE INTO eie_timetable_cell_teachers[\s\S]*json_each/.test(migration),
  'EIE migration should backfill teacher links from raw_meta_json.teacher_names'
);

assert(
  source.includes('syncStudentTeachers') &&
    source.includes('syncCellTeachers') &&
    source.includes('attachStudentTeachers') &&
    source.includes('attachCellTeachers'),
  'EIE worker should read/write normalized teacher link tables'
);

assert(
  /const student = await getStudentWithContacts\(env, studentId\);[\s\S]*return jsonResponse\(\{ success: true, student, data: student, contacts: student\?\.contacts \|\| \[\], warnings/.test(source),
  'student PATCH should return the refreshed student row with contacts for frontend state merge'
);

assert(
  /async function handlePatchStudentStatus\(request, env, teacher, studentId\)[\s\S]*const existing = await getStudentById\(env, studentId\);[\s\S]*const student = await getStudentWithContacts\(env, studentId\);[\s\S]*return jsonResponse\(\{ success: true, student, data: student, contacts: student\?\.contacts \|\| \[\], warnings: \[\] \}\);/.test(source),
  'student status PATCH should validate existence and return refreshed student data'
);

assert(
  studentsView.includes('value="paused"') &&
    studentsView.includes('휴원 입력') &&
    studentsView.includes('퇴원 입력') &&
    studentsView.includes('payload.withdrawn_at = todayIso()'),
  'EIE student edit page should expose leave/withdraw buttons and send withdrawn_at for withdrawn students'
);

assert(
  timetableView.includes('value="paused"') &&
    timetableView.includes('휴원 입력') &&
    timetableView.includes('퇴원 입력') &&
    timetableView.includes('payload.withdrawn_at = todayIso()'),
  'EIE timetable student edit panel should expose leave/withdraw buttons and send withdrawn_at for withdrawn students'
);

console.log('EIE student worker CRUD parity test passed');
