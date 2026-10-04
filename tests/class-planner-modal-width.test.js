const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const classroomSource = [
  'apmath/js/classroom.js',
  'apmath/js/classroom-planner.js'
].map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');

assert(
  classroomSource.includes('width: min(1080px, calc(100vw - 32px)) !important;'),
  'class planner modal CSS should match the classroom screen width'
);

assert(
  classroomSource.includes("content.style.width = 'min(1080px, calc(100vw - 32px))';"),
  'class planner modal JS sizing should match the classroom screen width'
);

assert(
  !classroomSource.includes('min(1560px, 98vw)'),
  'class planner modal should not use the oversized wide-screen modal width'
);

console.log('class planner modal width regression test passed');
