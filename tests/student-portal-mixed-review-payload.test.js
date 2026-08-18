const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const studentPortal = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');
const studentRoute = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/student-portal.js'), 'utf8');
const examsRoute = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/exams.js'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive/mixed_engine.html'), 'utf8');

assert(
  examsRoute.includes('normalizeMixedAssignmentPayload') &&
    examsRoute.includes("ASSIGNMENT_MIXED_PAYLOAD_COLUMN = 'mixed_payload_json'") &&
    examsRoute.includes('mixed_payload_json = COALESCE(?, mixed_payload_json)') &&
    examsRoute.includes('mixed_payload_json = COALESCE(excluded.mixed_payload_json, class_exam_assignments.mixed_payload_json)'),
  'assignment route should persist a validated mixed exam snapshot without overwriting an existing one'
);

assert(
  studentRoute.includes('mixed_payload_json: row.mixed_payload_json || \'\'') &&
    mixedEngine.includes('mixed_payload_json: mixedPayload'),
  'student exam API should return the mixed snapshot that the mixer saves with its assignment'
);

assert(
  studentPortal.includes('localStorage.setItem(`mixedQuestions_${key}`, JSON.stringify(payload.questions))') &&
    studentPortal.includes('localStorage.setItem(`mixedMeta_${key}`') &&
    studentPortal.includes("openOmrReview('${escapeHtml(exam.assignment_id)}', 'exam')") &&
    studentPortal.includes("openOmrReview('${escapeHtml(exam.assignment_id)}', 'ans')") &&
    studentPortal.includes("openOmrReview('${escapeHtml(exam.assignment_id)}', 'sol')"),
  'student review actions should restore the saved mixed paper before opening exam, answer, or solution'
);

assert(
  studentPortal.includes('function isLegacyMixedOmrReview') &&
    studentPortal.includes('이전 출제본이라 문제·정답·해설을 제공할 수 없습니다.'),
  'legacy mixed papers without a recoverable snapshot should explain why review actions are unavailable'
);

console.log('student portal mixed review payload checks passed');
