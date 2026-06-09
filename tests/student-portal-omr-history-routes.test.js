const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/student-portal.js'), 'utf8');
const studentPortal = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');

assert(
  source.includes('async function loadStudentClassExamAssignments') &&
    source.includes('FROM class_exam_assignments cea') &&
    source.includes('JOIN class_students cs ON cs.class_id = cea.class_id') &&
    source.includes('ORDER BY cea.exam_date DESC'),
  'student portal should load historical class exam assignments for the logged-in student'
);

assert(
    source.includes('function buildAssignmentDedupeKey') &&
    source.includes('function dedupeClassExamAssignments') &&
    source.includes('return [classId, examDate, archiveFile].join') &&
    source.includes('sessionByAssignment.has') &&
    source.includes('dedupeClassExamAssignments(assignments.results || [], sessionByAssignment).map'),
  'student portal should collapse duplicate class exam assignment rows by class/date/archive file while preserving submitted rows'
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

console.log('student portal OMR history route checks passed');
