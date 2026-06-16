const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const studentSource = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');
const studentEditSource = fs.readFileSync(path.join(root, 'apmath/js/student-edit.js'), 'utf8');

function functionBlock(source, name, nextName) {
  const start = source.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} should exist`);
  const end = nextName ? source.indexOf(`\nfunction ${nextName}(`, start + 1) : -1;
  return source.slice(start, end >= 0 ? end : undefined);
}

const profileDeck = functionBlock(studentSource, 'renderApmsStudentProfileDeck', 'normalizeStudentDetailTab');
const basicTab = functionBlock(studentSource, 'renderStudentBasicTab', 'renderStudentContactHistoryTab');
const editBody = functionBlock(studentEditSource, 'renderStudentEditBody', 'handleEditStudent');
const editHandler = functionBlock(studentEditSource, 'handleEditStudent', 'openAddStudentModal');

assert(!profileDeck.includes('String(student.memo'), 'profile deck memo slot should not render student.memo');
assert(basicTab.includes("const memo = '';"), 'basic tab memo row should render as blank');
assert(!basicTab.includes('String(s.memo || \'\').replace'), 'basic tab should not derive memo text from students.memo');
assert(editBody.includes("const cleanMemo = '';"), 'edit memo textarea should start blank');
assert(!editBody.includes('String(s.memo || \'\').replace'), 'edit form should not prefill memo textarea from students.memo');
assert(editHandler.includes("const cleanMemo = '';"), 'edit save should not persist freeform memo text into students.memo');
assert(editHandler.includes('if (isNewChecked && !alreadyAttending) memoParts.push'), 'edit save should preserve new-student flag behavior');
assert(editHandler.includes('if (isLeaveChecked) memoParts.push'), 'edit save should preserve leave flag behavior');

console.log('AP Math student detail memo blank contract passed');
