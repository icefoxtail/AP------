const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');
const router = fs.readFileSync(path.join(root, 'eie/js/eie-router.js'), 'utf8');
const dashboard = fs.readFileSync(path.join(root, 'eie/js/views/eie-dashboard.js'), 'utf8');
const timetable = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const editor = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable-editor.js'), 'utf8');
const legacyRoute = 'timetable' + '-v2';

assert(
  /timetable\s*:\s*\(\)\s*=>\s*EieTimetableView\.render\(\)/.test(router),
  'canonical timetable route should render V2'
);

assert(
  router.includes(`key === '${legacyRoute}'`) &&
    new RegExp(`key === '${legacyRoute}'\\)\\s*resolved\\s*=\\s*'timetable'`).test(router),
  'legacy timetable alias route should normalize to canonical timetable'
);

assert(
  /['"]timetable-editor['"]:\s*\(\)\s*=>\s*EieTimetableEditorView\.render\(\)/.test(router),
  'legacy timetable view should be isolated as timetable-editor'
);

assert(
  index.includes('data-eie-route="timetable"'),
  'sidebar timetable entry should use canonical timetable route'
);

assert(
  dashboard.includes('data-eie-route="timetable"') &&
    !dashboard.includes('data-eie-route="timetable' + '-v2"'),
  'dashboard timetable shortcut should use canonical timetable route'
);

assert(
  timetable.includes('data-eie-edit-toggle'),
  'operating timetable should keep the edit entry control'
);

assert(
  editor.includes("open('timetable-editor')") &&
    editor.includes("open('timetable')"),
  'editor should rerender on timetable-editor and return to canonical timetable'
);

assert(
  /async function saveDraft/.test(editor) &&
    editor.includes('EieApi.createTimetableCell') &&
    editor.includes('EieApi.updateTimetableCell') &&
    editor.includes('EieState.setTimetableCells'),
  'editor should persist draft changes through existing timetable APIs and refresh shared state'
);

console.log('EIE timetable dual-mode test passed');
