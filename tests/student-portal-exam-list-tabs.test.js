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

const today = new Date(2026, 7, 13);
const grouped = context.groupStudentPortalExams([
  { assignment_id: 'recent', exam_date: '2026-08-11', is_submitted: 0 },
  { assignment_id: 'boundary', exam_date: '2026-07-14', is_submitted: 0 },
  { assignment_id: 'previous', exam_date: '2026-07-13', is_submitted: 0 },
  { assignment_id: 'created-fallback', exam_date: '', created_at: '2026-07-01T09:00:00Z', is_submitted: 0 },
  { assignment_id: 'invalid-fallback', exam_date: '2026-02-31', created_at: '2026-08-01T09:00:00Z', is_submitted: 0 },
  { assignment_id: 'missing-date', exam_date: '', is_submitted: 0 },
  { assignment_id: 'complete', exam_date: '2026-06-04', is_submitted: 1 }
], today);

assert.deepStrictEqual(Array.from(grouped.recent, row => row.assignment_id), ['recent', 'boundary', 'invalid-fallback', 'missing-date']);
assert.deepStrictEqual(Array.from(grouped.previous, row => row.assignment_id), ['previous', 'created-fallback']);
assert.deepStrictEqual(Array.from(grouped.complete, row => row.assignment_id), ['complete']);
assert(source.includes("{ key: 'recent', label: '최근' }"), 'recent tab label should stay concise');
assert(source.includes("{ key: 'previous', label: '이전' }"), 'previous tab label should stay concise');
assert(source.includes("{ key: 'complete', label: '완료' }"), 'complete tab label should stay concise');
assert(source.includes('role="tablist"') && source.includes('aria-selected='), 'tabs should expose accessible state');
assert(source.includes("active === tab.key ? `aria-controls=\"omr-panel-${tab.key}\"` : ''"), 'only the active tab should reference the rendered panel');
assert(source.includes('function handleOmrListTabKey') && source.includes("event.key === 'ArrowRight'"), 'tabs should support arrow-key navigation');

console.log('student portal exam list tabs test passed');
