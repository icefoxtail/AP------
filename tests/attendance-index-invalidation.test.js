const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const classroomSource = fs.readFileSync(path.join(root, 'apmath', 'js', 'classroom.js'), 'utf8');
const cumulativeSource = fs.readFileSync(path.join(root, 'apmath', 'js', 'cumulative.js'), 'utf8');

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `${name} should exist`);
  const nextFunction = source.indexOf('\nfunction ', start + 1);
  return source.slice(start, nextFunction === -1 ? source.length : nextFunction);
}

const classroomMerge = extractFunction(classroomSource, 'mergeClassroomDateRecords');
assert.match(
  classroomMerge,
  /apmsInvalidateDataIndexes\(\)/,
  'classroom date attendance merges must invalidate indexed attendance lookups'
);

const ledgerMerge = extractFunction(cumulativeSource, 'mergeAttendanceLedgerDateRecords');
assert.match(
  ledgerMerge,
  /apmsInvalidateDataIndexes\(\)/,
  'monthly ledger date merges must invalidate indexed attendance lookups'
);

const monthlySync = extractFunction(cumulativeSource, 'syncMonthlyAttendanceMetaToState');
assert.match(
  monthlySync,
  /apmsInvalidateDataIndexes\(\)/,
  'monthly ledger cell edits must invalidate indexed attendance lookups'
);

console.log('Attendance index invalidation contract passed');
