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
const route = read('apmath/worker-backup/worker/routes/students.js');

for (const helper of [
  'mergeStudentIntoState',
  'mergeClassStudentIntoState',
  'mergeStudentCreateResponseIntoState',
  'refreshCurrentStudentListViewAfterMutation'
]) {
  assert(student.includes(`function ${helper}(`), `${helper} helper should exist`);
}

for (const name of ['handleAddStudent', 'handleEditStudent', 'handleDelete', 'handleRestore']) {
  const block = functionBlock(student, name);
  assert(!block.includes('await loadData()'), `${name} should not perform a full initial-data reload`);
}

const addBlock = functionBlock(student, 'handleAddStudent');
assert(!addBlock.includes('await bootstrapOnboardingTasks'), 'handleAddStudent should not await onboarding bootstrap');
assert(addBlock.includes('!r?.duplicate_ignored'), 'handleAddStudent should skip onboarding bootstrap for duplicate_ignored responses');
assert(addBlock.includes('.catch') || addBlock.includes('console.warn'), 'handleAddStudent should fire-and-forget onboarding failures without failing student creation');

assert(route.includes('student:'), 'student mutation responses should include the full student row');
assert(route.includes('class_student:'), 'student mutation responses should include class_student row or null');
assert(route.includes('duplicate_ignored'), 'student create response should preserve duplicate_ignored');
assert(!route.includes('return jsonResponse({ success: true });\n    } catch'), 'student mutation branches should not retain unreachable legacy success-only responses');

console.log('Student mutation lightweight contract passed');
