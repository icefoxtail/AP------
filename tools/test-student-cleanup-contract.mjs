import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function count(source, pattern) {
  return (source.match(new RegExp(pattern, 'g')) || []).length;
}

const route = read('apmath/worker-backup/worker/routes/students.js');
const student = read('apmath/js/student.js');
const audit = read('tools/audit-student-duplicates.mjs');
const addStart = student.indexOf('async function handleAddStudent()');
const addEnd = student.indexOf('\nfunction openDischargedStudents', addStart);
const addBlock = student.slice(addStart, addEnd >= 0 ? addEnd : undefined);

for (const source of [route, addBlock]) {
  for (const broken of ['筌', '占', '餓', '???']) {
    assert(!source.includes(broken), `broken mojibake marker ${broken} should not remain in student mutation code`);
  }
}

assert.equal(count(route, "method === 'POST' && !id"), 1, 'students route should have one create branch');
assert.equal(count(route, "method === 'DELETE' && id\\) \\{"), 1, 'students route should have one soft delete branch');
assert(route.includes('assignUniqueStudentPin'), 'auto-pin and batch-pins should retry UPDATE unique collisions');
assert(route.includes('skipped'), 'batch-pins should report skipped students when retry budget is exhausted');
assert(audit.includes('backfill_candidates'), 'audit report should list safe backfill candidates');
assert(audit.includes('manual_review_required'), 'audit report should list duplicate/manual-review groups');

console.log('Student cleanup contract passed');
