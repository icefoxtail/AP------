const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const teacherDashboard = fs.readFileSync(path.join(root, 'apmath/js/dashboard-teacher.js'), 'utf8');

const renderTeacherMatch = teacherDashboard.match(/function\s+renderTeacherDashboardView\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(renderTeacherMatch, 'renderTeacherDashboardView should exist');

assert(
  /renderAppDrawer\s*\(/.test(renderTeacherMatch[1]),
  'renderTeacherDashboardView should render the app drawer so the desktop sidebar rail exists for teacher accounts'
);

assert(
  !teacherDashboard.includes('Number(c.is_active) !== 0 && isClassScheduledTodayForDashboard(c.id)'),
  'teacher dashboard class management should show all active classes, not only classes scheduled today'
);

console.log('teacher-dashboard-drawer regression test passed');
