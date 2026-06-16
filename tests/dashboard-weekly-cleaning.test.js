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
  /broom:/.test(dashboard) &&
    /iconBroom/.test(dashboard) &&
    /class="ap-cleaning-routine"/.test(dashboard) &&
    !/>\s*청소 당번:/.test(dashboard),
  'weekly cleaning row should render as a broom icon and assignee name without a visible text label'
);

assert(
  /regularCount > 0 \|\| onboardingCount > 0 \|\| hasCleaningSchedule/.test(dashboard),
  'onboarding refresh should keep weekly schedule visible when only the cleaning row exists'
);

assert(
  /grid-template-columns:minmax\(150px,2fr\) minmax\(0,8fr\)/.test(dashboard),
  'weekly schedule split should reserve about 20% for fixed routines and 80% for notices'
);

assert(
  /function renderDashboardHoverPreview/.test(dashboard) &&
  /ap-hover-source/.test(dashboard) &&
  /ap-hover-preview/.test(dashboard),
  'weekly/class dashboard rows should share the reusable hover preview component'
);

assert(
  /ap-weekly-notice-cell/.test(dashboard) &&
  /onclick="openExamScheduleModal\(\)"/.test(dashboard),
  'weekly notice cell should open schedule management when clicked'
);

console.log('dashboard weekly cleaning regression test passed');
