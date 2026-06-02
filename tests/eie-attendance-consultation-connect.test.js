const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const worker = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'eie/js/eie-api.js'), 'utf8');
const state = fs.readFileSync(path.join(root, 'eie/js/eie-state.js'), 'utf8');
const students = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');
const teacher = fs.readFileSync(path.join(root, 'eie/js/views/eie-teacher.js'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'migrations/20260602_eie_attendance_records.sql'), 'utf8');

for (const token of [
  'CREATE TABLE IF NOT EXISTS eie_attendance_records',
  'UNIQUE(student_id, date)',
  'idx_eie_attendance_student'
]) {
  assert(migration.includes(token), `attendance migration should include ${token}`);
}

for (const token of [
  'async function handleGetAttendanceRecords',
  'async function handlePostAttendanceRecord',
  "path[2] === 'attendance-records'",
  'eie_attendance_records'
]) {
  assert(worker.includes(token), `EIE worker should include ${token}`);
}

for (const method of [
  'getAttendanceRecords(filters)',
  'saveAttendanceRecord(payload)'
]) {
  assert(api.includes(method), `EieApi should expose ${method}`);
}

assert(state.includes('mergeStudentAttendance'), 'EieState should merge student attendance records');

for (const token of [
  'loadStudentAttendance',
  'renderAttendancePanel',
  'saveAttendance',
  "EieApi.saveAttendanceRecord",
  "if (_selectedId && _tab === 'attendance') await loadStudentAttendance(_selectedId)"
]) {
  assert(students.includes(token), `student view should include ${token}`);
}

assert(teacher.includes('openAttendanceLedger'), 'teacher dashboard should connect the attendance button');
assert(teacher.includes('openConsultations'), 'teacher dashboard should connect the student consultation button');
assert(students.includes('createConsultation') && students.includes('EieApi.createConsultation'), 'consultation creation should remain connected');
assert(students.includes('editConsultation') && students.includes('EieApi.updateConsultation'), 'consultation editing should remain connected');

console.log('EIE attendance and consultation connection test passed');
