const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const classroomSource = fs.readFileSync(path.join(root, 'apmath/js/classroom.js'), 'utf8');

assert(
  classroomSource.includes('.cls-v4-tools .btn') &&
    classroomSource.includes('width:auto !important;') &&
    classroomSource.includes('flex:0 0 auto !important;'),
  'classroom toolbar buttons should keep content-sized width instead of stretching full-page'
);

assert(
  !classroomSource.includes('style="flex:1; min-height:38px; font-size:12px; font-weight:500; border-radius:12px; background:var(--surface-2); border:none;" onclick="openHomeworkPhotoOverviewModal'),
  'homework list action buttons should not stretch to full width'
);

assert(
  !classroomSource.includes('style="flex:1; min-height:40px; font-size:12px; font-weight:500;'),
  'homework overview action buttons should not use full-width flex actions'
);

console.log('classroom button width guard test passed');
