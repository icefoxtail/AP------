const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const archiveIndex = fs.readFileSync(path.join(root, 'archive', 'index.html'), 'utf8');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');

const boardRouteStart = examsRoute.indexOf("method === 'GET' && id === 'board'");
const boardRouteEnd = examsRoute.indexOf("if (method === 'POST')", boardRouteStart);
const boardRoute = examsRoute.slice(boardRouteStart, boardRouteEnd);

assert(
  boardRouteStart !== -1 &&
    boardRoute.includes('JOIN classes c ON c.id = a.class_id') &&
    boardRoute.includes("REPLACE(COALESCE(c.grade, ''), ' ', '') = ?") &&
    !boardRoute.includes('canAccessClass('),
  'assignment board API should read grade-wide teacher assignments without class ownership filtering'
);

assert(
  archiveIndex.includes('/class-exam-assignments/board?grade=') &&
    !archiveIndex.includes('/class-exam-assignments?class=${encodeURIComponent(classId)}'),
  'archive assignment board should use the grade-wide board API instead of per-class assignment calls'
);

const rowOrder = archiveIndex.indexOf('assignment-board-teacher') <
  archiveIndex.indexOf('assignment-board-paper') &&
  archiveIndex.indexOf('assignment-board-paper') <
  archiveIndex.indexOf('assignment-board-classes');
assert(rowOrder, 'assignment board rows should render teacher, paper, classes in that order');

assert(
  !archiveIndex.includes('assignment-board-badge') &&
    !archiveIndex.includes('\uB0B4 \uCD9C\uC81C</span>') &&
    !archiveIndex.includes('\uACF5\uC720</span>'),
  'assignment board rows should not render mine/shared badges'
);

console.log('archive assignment board shared teachers checks passed');
