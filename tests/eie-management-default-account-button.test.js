const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const management = fs.readFileSync(path.join(root, 'eie/js/views/eie-management.js'), 'utf8');

assert(
  !management.includes('기본 계정 생성'),
  'EIE management screen should not expose the one-time default account creation button'
);

assert(
  !management.includes('seedDefaultTeachers'),
  'EIE management view should not keep the default-account seed handler'
);

assert(
  management.includes('EieManagementView.startCreate()') &&
    management.includes('EieManagementView.refresh()'),
  'EIE management should preserve teacher creation and refresh actions'
);

console.log('EIE management default account button regression test passed');
