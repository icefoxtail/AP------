const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/student-portal.js'), 'utf8');
const studentPortal = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');

assert(
  source.includes('async function loadStudentClassExamAssignments') &&
    source.includes('FROM class_exam_assignments cea') &&
    source.includes('JOIN class_exam_assignment_recipients ar ON ar.assignment_id = cea.id') &&
    source.includes('ORDER BY cea.exam_date DESC'),
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
    source.includes('loadStudentClassExamAssignments(env, verified.student.id, 150)'),
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
  studentPortal.includes('student-portal/exams?student_id=') &&
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
    studentPortal.includes('출제된 모든 시험지의 문제·정답·해설을 확인할 수 있습니다.') &&
    studentPortal.includes("${isOmrReviewAvailable(row) ? renderOmrReviewActions(row) : '<button type=\"button\" class=\"btn\" disabled>시험지 파일 없음</button>'}") &&
    studentPortal.includes("|| getStudentPortalAssignments().find(exam => String(exam.assignment_id) === key)"),
  'home should render every canonical assignment with direct review actions'
);

console.log('student portal OMR history route checks passed');
