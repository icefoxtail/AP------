const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'archive/index.html'), 'utf8');
const match = source.match(/function getArchiveBoardAssignmentTitle\(row\) \{[\s\S]*?\n\}/);
assert(match, 'archive board title helper should exist');

const context = { formatArchiveDisplayName: value => String(value || '').replace(/^MIXED:/, '').replace(/\.js$/i, '') };
vm.createContext(context);
vm.runInContext(match[0], context);

assert.strictEqual(
  context.getArchiveBoardAssignmentTitle({
    exam_title: '함수 · 문제지 3',
    archive_file: 'MIXED:unitpast_h1-through-2final-v2_H22-C2-01_13074d02'
  }),
  '함수 · 문제지 3',
  'unit-past assignments should display their human exam title before the mixed snapshot key'
);

assert.strictEqual(
  context.getArchiveBoardAssignmentTitle({ archive_file: 'exams/sample_paper.js' }),
  'exams/sample_paper',
  'archive file names should remain the fallback when no human title exists'
);

console.log('archive assignment title display checks passed');
