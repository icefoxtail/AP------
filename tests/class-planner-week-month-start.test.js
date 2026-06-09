const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const classroomSource = fs.readFileSync(path.join(root, 'apmath/js/classroom.js'), 'utf8');

const loadWeekMatch = classroomSource.match(/async function loadClassPlannerWeek\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(loadWeekMatch, 'loadClassPlannerWeek should exist');

const body = loadWeekMatch[1];
const monthStartIndex = body.indexOf('const safeMonthStart = getClassPlannerMonthStart(weekStart);');
const studentsIndex = body.indexOf('getClassroomMonthlyPlannerStudents(classId, safeMonthStart)');

assert(monthStartIndex >= 0, 'loadClassPlannerWeek should derive safeMonthStart from weekStart');
assert(studentsIndex >= 0, 'loadClassPlannerWeek should pass safeMonthStart to monthly planner students helper');
assert(
  monthStartIndex < studentsIndex,
  'loadClassPlannerWeek should define safeMonthStart before using it'
);

console.log('class planner week month-start regression test passed');
