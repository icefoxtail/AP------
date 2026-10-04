import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function functionBlock(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} block missing`);
  const nextFunction = source.indexOf('\nfunction ', start + 1);
  const nextAsyncFunction = source.indexOf('\nasync function ', start + 1);
  const nextCandidates = [nextFunction, nextAsyncFunction].filter(idx => idx >= 0);
  const next = nextCandidates.length ? Math.min(...nextCandidates) : -1;
  return source.slice(start, next >= 0 ? next : undefined);
}

const student = read('apmath/js/student.js');
const studentEdit = read('apmath/js/student-edit.js');
const studentMutationSource = `${student}\n${studentEdit}`;
const route = read('apmath/worker-backup/worker/routes/students.js');
const timetable = read('apmath/js/timetable.js');
const classroom = read('apmath/js/classroom.js');
const cumulative = read('apmath/js/cumulative.js');
const dashboard = read('apmath/js/dashboard.js');
const dashboardAdmin = read('apmath/js/dashboard-admin.js');

for (const helper of [
  'mergeStudentIntoState',
  'mergeClassStudentIntoState',
  'mergeStudentCreateResponseIntoState',
  'refreshCurrentStudentListViewAfterMutation'
]) {
  assert(student.includes(`function ${helper}(`), `${helper} helper should exist`);
}

for (const name of ['handleAddStudent', 'handleEditStudent', 'handleDelete', 'handleRestore']) {
  const block = functionBlock(studentMutationSource, name);
  assert(!block.includes('await loadData()'), `${name} should not perform a full initial-data reload`);
}

const addBlock = functionBlock(studentMutationSource, 'handleAddStudent');
assert(!addBlock.includes('await bootstrapOnboardingTasks'), 'handleAddStudent should not await onboarding bootstrap');
assert(addBlock.includes('!r?.duplicate_ignored'), 'handleAddStudent should skip onboarding bootstrap for duplicate_ignored responses');
assert(addBlock.includes('.catch') || addBlock.includes('console.warn'), 'handleAddStudent should fire-and-forget onboarding failures without failing student creation');

const mergeStudentBlock = functionBlock(studentMutationSource, 'mergeStudentIntoState');
assert(mergeStudentBlock.includes('timetable_students'), 'student merge should keep timetable student cache in sync');
assert(mergeStudentBlock.includes("['db', 'allDb']"), 'student merge should update main and allDb timetable caches');

const mergeClassStudentBlock = functionBlock(studentMutationSource, 'mergeClassStudentIntoState');
assert(mergeClassStudentBlock.includes('timetable_class_students'), 'class student merge should keep timetable class cache in sync');
assert(mergeClassStudentBlock.includes("['db', 'allDb']"), 'class student merge should update main and allDb timetable caches');

const openStudentDetailBlock = functionBlock(studentMutationSource, 'openStudentDetail');
assert(openStudentDetailBlock.includes('state?.db?.students'), 'openStudentDetail should check main students');
assert(openStudentDetailBlock.includes('state?.allDb?.students'), 'openStudentDetail should check allDb students');
assert(openStudentDetailBlock.includes('state?.db?.timetable_students'), 'openStudentDetail should check timetable students');
assert(openStudentDetailBlock.includes('state?.allDb?.timetable_students'), 'openStudentDetail should check allDb timetable students');
assert(openStudentDetailBlock.includes('mergeStudentIntoState'), 'openStudentDetail should merge fallback rows into state before rendering');

assert(timetable.includes('openStudentDetailFromTimetable'), 'timetable should expose student detail click handler');
assert(timetable.includes("returnTo: { type: 'timetable' }"), 'timetable student detail should return to timetable');
assert(classroom.includes("openStudentDetail('${s.id}'"), 'classroom student rows should open student detail');
assert(classroom.includes('renderClassroomMonthlyStatusCategory'), 'classroom monthly status board should render student rows');
assert(classroom.includes("openStudentDetail('${apEscapeHtml(String(row.sid || ''))}'"), 'classroom monthly status board student names should open student detail');
assert(cumulative.includes('openStudentDetailFromAttendance'), 'attendance ledger should expose student detail click helper');
assert(cumulative.includes("returnTo: { type: 'attendance' }"), 'attendance detail should return to attendance ledger');
assert(dashboard.includes("openStudentDetail('${s.id}'"), 'main dashboard student cards should open student detail');
assert(dashboardAdmin.includes('adminOpenDashboardStudentDetail'), 'admin dashboard should expose student detail click helper');
assert(dashboardAdmin.includes('openStudentDetail(studentId'), 'admin dashboard detail helper should call openStudentDetail');

assert(route.includes('student:'), 'student mutation responses should include the full student row');
assert(route.includes('class_student:'), 'student mutation responses should include class_student row or null');
assert(route.includes('duplicate_ignored'), 'student create response should preserve duplicate_ignored');
assert(route.includes('INSERT INTO student_enrollments'), 'student create with class should create an AP Math enrollment row');
assert(!route.includes('return jsonResponse({ success: true });\n    } catch'), 'student mutation branches should not retain unreachable legacy success-only responses');

console.log('Student mutation lightweight contract passed');
