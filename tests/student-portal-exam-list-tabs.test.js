const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');
const helpers = source.match(
  /const STUDENT_PORTAL_RECENT_EXAM_DAYS = 30;[\s\S]*?function groupStudentPortalExams\(exams, today = new Date\(\)\) \{[\s\S]*?\n    \}/
);

assert(helpers, 'student exam grouping helpers should exist');

const context = { Date, Number, String, Array, Math };
vm.createContext(context);
vm.runInContext(helpers[0], context, { filename: 'student-portal-exam-groups.js' });

const grouped = context.groupStudentPortalExams([
  { assignment_id: 'recent', exam_date: '2026-08-11', is_submitted: 0 },
  { assignment_id: 'boundary', exam_date: '2026-07-14', is_submitted: 0 },
  { assignment_id: 'previous', exam_date: '2026-07-13', is_submitted: 0 },
  { assignment_id: 'created-fallback', exam_date: '', created_at: '2026-07-01T09:00:00Z', is_submitted: 0 },
  { assignment_id: 'invalid-fallback', exam_date: '2026-02-31', created_at: '2026-08-01T09:00:00Z', is_submitted: 0 },
  { assignment_id: 'missing-date', exam_date: '', is_submitted: 0 },
  { assignment_id: 'complete', exam_date: '2026-06-04', is_submitted: 1 }
]);

assert.deepStrictEqual(Array.from(grouped.all, row => row.assignment_id), ['recent', 'boundary', 'previous', 'created-fallback', 'invalid-fallback', 'missing-date', 'complete']);
assert.deepStrictEqual(Array.from(grouped.pending, row => row.assignment_id), ['recent', 'boundary', 'previous', 'created-fallback', 'invalid-fallback', 'missing-date']);
assert.deepStrictEqual(Array.from(grouped.complete, row => row.assignment_id), ['complete']);
assert(source.includes("{ key: 'all', label: '전체' }"), 'all tab should be the default discoverable view');
assert(source.includes("{ key: 'pending', label: '진행 중' }"), 'pending tab should collect all unsubmitted exams regardless of age');
assert(source.includes("{ key: 'complete', label: '제출 완료' }"), 'completed tab should stay available');
assert(source.includes("let omrListFilter = 'all';"), 'the full assignment list should be selected by default');
assert(source.includes('role="tablist"') && source.includes('aria-selected='), 'tabs should expose accessible state');
assert(source.includes("active === tab.key ? `aria-controls=\"omr-panel-${tab.key}\"` : ''"), 'only the active tab should reference the rendered panel');
assert(source.includes('function handleOmrListTabKey') && source.includes("event.key === 'ArrowRight'"), 'tabs should support arrow-key navigation');

console.log('student portal exam list tabs test passed');
