const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const worker = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
const students = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');
const timetable = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');

assert(students.includes('function isOwnerSession()'), 'student management should identify owner sessions');
assert(students.includes('function canHardDeleteStudent(student)'), 'student management should limit hard delete to withdrawn students');
assert(students.includes('>완전 삭제</button>'), 'owner edit form should expose the permanent delete button');
assert(students.includes('EieStudentsView.hardDeleteStudent'), 'permanent delete button should call the hard-delete action');
assert(students.includes('복구할 수 없습니다'), 'hard delete should require an irreversible-action confirmation');

assert(
  /method === 'DELETE' && path\[2\] === 'students'[\s\S]*?requireEieOwner\(teacher\)/.test(worker),
  'student DELETE route should enforce owner permission'
);
for (const table of [
  'eie_grade_reports',
  'consultations',
  'eie_school_grade_records',
  'eie_exam_records',
  'eie_attendance_records',
  'eie_student_teachers',
  'eie_student_contacts',
  'eie_student_schedule_assignments',
  'eie_students'
]) {
  assert(worker.includes(`DELETE FROM ${table}`), `hard delete should clear ${table}`);
}
assert(worker.includes('hard_deleted: true'), 'student DELETE response should identify permanent deletion');
assert(!/async function handleDeleteStudent[\s\S]*?UPDATE eie_students SET status = 'archived'/.test(worker), 'student DELETE should no longer soft-delete');

assert(worker.includes('assigned_students_resolved: true'), 'timetable API should mark current assignment resolution');
assert(
  timetable.includes("if (assigned.length || row?.assigned_students_resolved === true)"),
  'an empty resolved assignment list should not fall back to stale imported candidates'
);
assert(index.includes('eie-timetable.js?v=20260622') && index.includes('eie-students.js?v=20260622'), 'changed EIE scripts should be cache-busted');

console.log('EIE owner hard-delete student test passed');
