const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const dashboard = fs.readFileSync(path.join(root, 'apmath/js/dashboard.js'), 'utf8');

assert(
  /data-has-cleaning-schedule="\$\{hasCleaningSchedule \? '1' : '0'\}"/.test(dashboard),
  'weekly schedule section should mark that the always-on cleaning row is present'
);

assert(
  /regularCount > 0 \|\| onboardingCount > 0 \|\| hasCleaningSchedule/.test(dashboard),
  'onboarding refresh should keep weekly schedule visible when only the cleaning row exists'
);

console.log('dashboard weekly cleaning regression test passed');
