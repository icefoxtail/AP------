const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/student-portal.js'), 'utf8');
const studentPortal = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');

assert(
  source.includes('async function loadStudentClassExamAssignments') &&
    source.includes('FROM class_exam_assignments cea') &&
    source.includes('JOIN class_exam_assignment_recipients ar ON ar.assignment_id = cea.id') &&
    source.includes('ORDER BY exam_date DESC'),
  'student portal should load every issued assignment from the frozen recipient roster'
);

assert(
    source.includes('function buildAssignmentDedupeKey') &&
    source.includes('function dedupeClassExamAssignments') &&
    source.includes('return `ASSIGNMENT|${assignmentId}`') &&
    source.includes('dedupeClassExamAssignments(assignments.results || [], sessionByAssignment).map'),
  'student portal should preserve each issued assignment by assignment_id without collapsing same-day reissues'
);

assert(
  source.includes("method === 'GET' && id === 'exams'") &&
    /loadStudentClassExamAssignments\(\s*env,\s*verified\.student\.id,\s*150,/.test(source),
  'student portal should expose a student-token protected historical OMR exam list'
);

assert(
  source.includes("method === 'POST' && id === 'omr-submit'") &&
    source.includes('INSERT INTO exam_sessions') &&
    source.includes('DELETE FROM wrong_answers WHERE session_id = ?') &&
    source.includes('INSERT INTO wrong_answers'),
  'student portal should allow student-token OMR submission into exam_sessions and wrong_answers'
);

assert(
  source.includes('class_exam_assignments: classExamAssignments') &&
    source.includes("status: 'ready'"),
  'student portal home should include historical exam assignments and mark OMR ready'
);

assert(
  /student-portal\/exams\?\$\{params\.toString\(\)\}/.test(studentPortal) &&
    studentPortal.includes('student-portal/omr-submit'),
  'student portal frontend should call the historical OMR list and submit endpoints'
);

assert(
  studentPortal.includes('if (Array.isArray(omrData?.exams)) return omrData.exams.slice();') &&
    studentPortal.includes('await loadOmrExams(true);') &&
    !studentPortal.includes(".filter(row => String(row?.class_id || '') === String(classId))"),
  'student home should use the same server-filtered exam list as the full OMR page'
);

assert(
  studentPortal.includes('async function refreshStudentHomeAssignments()') &&
    studentPortal.includes("document.getElementById('student-portal-omr-home-section')") &&
    studentPortal.includes('}, 30 * 1000);'),
  'student home should refresh newly issued exams while the portal stays open'
);

assert(
  studentPortal.includes('const visible = getStudentPortalAssignments();') &&
    studentPortal.includes('class="portal-recent-item"') &&
    studentPortal.includes('onclick="renderOmrExams()"') &&
    studentPortal.includes('function openRecentLearning(assignmentId)') &&
    studentPortal.includes("|| getStudentPortalAssignments().find(exam => String(exam.assignment_id) === key)"),
  'home should show one recent canonical exam and an operable route to the full historical list'
);

function helper(name) {
  const match = studentPortal.match(new RegExp(`function ${name}\\([^\\n]*\\) \\{[\\s\\S]*?\\n    \\}`));
  assert(match, `${name} should exist`);
  return match[0];
}
const allExams = Array.from({ length: 7 }, (_, index) => ({ assignment_id: `issued-${index + 1}` }));
const homeContext = {
  omrData: { exams: allExams },
  exactOmrAssignmentId: '',
  isTeacherPreview: false,
  getStudentPortalHomeIndex: () => { throw new Error('canonical server list must take precedence over home fallback'); },
  escapeHtml: value => String(value ?? '')
};
vm.createContext(homeContext);
vm.runInContext(['getStudentPortalRecordedSubmission', 'getStudentPortalAssignments', 'getOmrExams', 'getVisibleOmrExams', 'findOmrExam', 'renderOmrHomeSection'].map(helper).join('\n'), homeContext);
const homeMarkup = homeContext.renderOmrHomeSection();
assert.strictEqual((homeMarkup.match(/class="portal-recent-item"/g) || []).length, 1, 'home should keep one compact recent item');
assert(homeMarkup.includes("openRecentLearning('issued-1')"), 'the recent item resolves the first canonical assignment for tied dates');
assert.match(homeMarkup, /<button[^>]+onclick="renderOmrExams\(\)"[^>]*>전체 보기/, 'the full-list route must be an operable navigation control');
assert.strictEqual(homeContext.getVisibleOmrExams().length, 7, 'the full exam page must retain every server-filtered canonical exam');
assert.strictEqual(homeContext.findOmrExam('issued-7').assignment_id, 'issued-7', 'an assignment outside the home preview must remain resolvable for review/input');
assert.strictEqual(allExams.length, 7, 'rendering a compact preview must not truncate the cached canonical list');
homeContext.omrData.exams = [];
assert(homeContext.renderOmrHomeSection().includes('시험지를 배정하면'), 'an empty canonical list should show an honest empty state');

console.log('student portal OMR history route checks passed');
