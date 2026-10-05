const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const schema = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/schema.sql'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/migrations/20260819_class_exam_assignment_recipients.sql'), 'utf8');
const examsRoute = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/exams.js'), 'utf8');
const studentRoute = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/student-portal.js'), 'utf8');
const studentPortal = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');

assert(
  schema.includes('CREATE TABLE IF NOT EXISTS class_exam_assignment_recipients') &&
    migration.includes('INSERT OR IGNORE INTO class_exam_assignment_recipients') &&
    migration.includes('JOIN class_students cs ON cs.class_id = cea.class_id'),
  'recipient snapshot schema and one-time legacy backfill must exist'
);

assert(
  examsRoute.includes('async function snapshotClassExamAssignmentRecipients') &&
    examsRoute.includes('INSERT OR IGNORE INTO class_exam_assignment_recipients') &&
    examsRoute.includes('await snapshotClassExamAssignmentRecipients(env, assignment)') &&
    examsRoute.includes("throw new Error('class exam assignment recipients table is unavailable')") &&
    !examsRoute.includes("console.warn('[assignment-recipients] snapshot failed:'" ) &&
    examsRoute.includes("archive_file.startsWith('MIXED:') && (!hasMixedPayloadColumn || !mixedPayload)"),
  'new assignments must freeze recipients or fail visibly, and reject MIXED papers without a question snapshot'
);

assert(
  studentRoute.includes('async function hasClassExamAssignmentRecipients') &&
    studentRoute.includes('JOIN class_exam_assignment_recipients ar ON ar.assignment_id = cea.id') &&
    studentRoute.includes('ar.student_id = ?') &&
    studentRoute.includes('JOIN class_exam_assignment_recipients ar ON ar.assignment_id = cea.id AND ar.student_id = ?'),
  'list and OMR submission authorization must both use the frozen recipient snapshot'
);

assert(
  studentPortal.includes("let omrListFilter = 'all';") &&
    studentPortal.includes("{ key: 'all', label: '전체' }") &&
    studentPortal.includes('출제된 시험지는 날짜와 제출 여부와 관계없이 모두 표시됩니다.') &&
    !studentPortal.includes('자료를 눌러도 시험지는 바로 열리지 않습니다.'),
  'student UI must default to a directly accessible all-assignment view'
);

console.log('student portal assignment recipient contract passed');
