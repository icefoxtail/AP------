const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/classroom.js'), 'utf8');
const helpers = source.match(
  /function getClassroomStatusArchiveDisplayTitle[\s\S]*?\r?\n}\r?\n\r?\nfunction getClassroomStatusExamDisplayTitle[\s\S]*?\r?\n}/
);

assert(helpers, 'classroom status exam-title helpers should exist');

const context = { String };
vm.createContext(context);
vm.runInContext(helpers[0], context, { filename: 'classroom-status-title-helpers.js' });

assert.strictEqual(
  context.getClassroomStatusExamDisplayTitle({
    exam_title: '평면좌표 · 문제지 1',
    archive_file: 'unitpast_h1-through-2final-v1_H22-C2-01_567d1aab.js'
  }),
  '평면좌표 · 문제지 1',
  'the teacher-facing title should win over the internal archive key'
);

assert.strictEqual(
  context.getClassroomStatusExamDisplayTitle({
    archive_file: 'unitpast_h1-through-2final-v1_H22-C2-01_567d1aab.js'
  }),
  'unitpast_h1-through-2final-v1_H22-C2-01_567d1aab',
  'the archive name should remain a fallback when no exam title exists'
);

console.log('classroom status exam title test passed');
