const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-teacher.js'), 'utf8');
const timetableSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const cssSource = (function(){ const idx = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8'); const list = (idx.match(/href="\.\/css\/(eie[\w-]*\.css)"/g) || []).map(function(m){ return m.replace(/^.*\/css\//, '').replace(/".*$/, ''); }); return list.map(function(f){ return fs.readFileSync(path.join(root, 'eie/css', f), 'utf8'); }).join('\n'); })();

const openClassroomMatch = source.match(/openClassroom:\s*function\s*\([^)]*\)\s*\{([\s\S]*?)openClassroomList:/);
assert(openClassroomMatch, 'EieTeacherView.openClassroom should exist');

assert(
  openClassroomMatch[1].includes('EieClassroomView.openCell(cellId)'),
  'teacher class row click should open the class inside classroom'
);

assert(
  !openClassroomMatch[1].includes('openDetailOnly'),
  'teacher class row click should not use the classroom-only detail wrapper'
);

assert(
  source.includes('onclick="EieTeacherView.openClassroomList()"') &&
    /openClassroomList:\s*function\s*\(\s*\)\s*\{[\s\S]*EieClassroomView\.openTeacher\(_teacherName\)/.test(source),
  'teacher classroom shortcut should open the teacher-scoped classroom list'
);

assert(
  timetableSource.includes('eie-classroom-borrowed-panel eie-v2-screen'),
  'borrowed timetable panel should keep the timetable v2 style scope'
);

assert(
  timetableSource.includes("viewState.panelMountRoute === 'classroom'") &&
    timetableSource.includes('viewState.classAttendanceSessionId = selectedSession.session_id'),
  'classroom-mounted timetable panel should open class attendance by default'
);

assert(
  timetableSource.includes('eie-p-attendance-chip') &&
    timetableSource.includes('is-present') &&
    timetableSource.includes('is-absent') &&
    timetableSource.includes("return '출석';"),
  'class attendance chips should expose status classes'
);

assert(
  cssSource.includes('.eie-v2-screen .eie-p-attendance-chip.is-present') &&
    cssSource.includes('.eie-v2-screen .eie-p-attendance-chip.is-absent') &&
    !cssSource.includes('.eie-v2-screen .eie-p-attendance-chip.is-empty'),
  'class attendance status colors should be scoped to the timetable v2 panel'
);

console.log('EIE teacher classroom panel route regression test passed');
