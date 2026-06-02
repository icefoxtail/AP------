const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');
const router = fs.readFileSync(path.join(root, 'eie/js/eie-router.js'), 'utf8');
const dashboard = fs.readFileSync(path.join(root, 'eie/js/views/eie-dashboard.js'), 'utf8');
const timetable = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const timetableV2 = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable-v2.js'), 'utf8');

assert(
  /['"]timetable-v2['"]:\s*\(\)\s*=>\s*EieTimetableV2View\.render\(\)/.test(router),
  'canonical timetable-v2 route should render V2'
);

assert(
  /if\s*\(\s*key\s*===\s*['"]timetable['"]\s*\)\s*return\s*['"]timetable-v2['"]/.test(router),
  'timetable route should normalize to canonical timetable-v2'
);

assert(
  /['"]timetable-editor['"]:\s*\(\)\s*=>\s*EieTimetableView\.render\(\)/.test(router),
  'legacy timetable view should be isolated as timetable-editor'
);

assert(
  index.includes('data-eie-route="timetable-v2"'),
  'sidebar timetable entry should use canonical timetable-v2 route'
);

assert(
  dashboard.includes('data-eie-route="timetable-v2"') &&
    !dashboard.includes('data-eie-route="timetable"'),
  'dashboard timetable shortcut should use canonical timetable-v2 route'
);

assert(
  timetableV2.includes('data-eie-route="timetable-editor"'),
  'V2 edit button should open the dedicated editor route'
);

assert(
  timetable.includes("open('timetable-editor')") &&
    timetable.includes("open('timetable-v2')"),
  'editor should rerender on timetable-editor and return to canonical timetable-v2'
);

assert(
  /async function saveDraft/.test(timetable) &&
    timetable.includes('EieApi.createTimetableCell') &&
    timetable.includes('EieApi.updateTimetableCell') &&
    timetable.includes('EieState.setTimetableCells'),
  'editor should persist draft changes through existing timetable APIs and refresh shared state'
);

console.log('EIE timetable dual-mode test passed');
