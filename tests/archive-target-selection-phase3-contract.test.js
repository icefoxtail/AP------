const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const archiveIndex = fs.readFileSync(path.join(root, 'archive', 'index.html'), 'utf8');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');
const studentPortalRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'student-portal.js'), 'utf8');
const studentPortalUi = fs.readFileSync(path.join(root, 'apmath', 'student', 'index.html'), 'utf8');

// Phase 3 static contract: the unified panel must register class assignments
// first, then process exclusions only for a partial student selection.
assert(archiveIndex.includes('assignTargetProcessOneClass'), 'unified panel should process each selected class');
assert(archiveIndex.includes("target_scope: options.target_scope || 'class'"), 'class/grade scope must reach the assignment payload');
assert(archiveIndex.includes("/class-exam-assignments/exclude-students"), 'partial selections must call the bulk exclusion endpoint');
assert(archiveIndex.includes('실패한 반만 재시도'), 'partial failures must expose a class-level retry action');

// Server contract: roster and bulk exclusion are authenticated, class-scoped,
// bounded, and sequential. The existing single-student path remains present.
assert(examsRoute.includes("method === 'GET' && id === 'roster'"), 'roster endpoint should exist');
assert(examsRoute.includes("method === 'POST' && id === 'exclude-students'"), 'bulk exclusion endpoint should exist');
assert(examsRoute.includes("method === 'POST' && id === 'exclude-student'"), 'single exclusion endpoint must remain');
assert(examsRoute.includes("s.status = '재원'"), 'roster must exclude non-enrolled students');
assert(examsRoute.includes('recently_absent'), 'roster must expose attendance preset state');
assert(examsRoute.includes('already_submitted'), 'roster must expose prior-submission preset state');
assert(examsRoute.includes('studentIds.length > 200'), 'bulk exclusion must enforce its batch bound');
assert(examsRoute.includes('for (const studentId of studentIds)'), 'bulk exclusion must process sequentially');
assert(examsRoute.includes('results: results.map'), 'bulk exclusion must return per-student outcomes');

// Student visibility contract: the existing portal query remains the source of
// truth and excludes rows recorded by the partial-selection API. The student UI
// consumes that filtered endpoint rather than reconstructing assignment rules.
assert(studentPortalRoute.includes('class_exam_assignment_exclusions'), 'student portal must retain exclusion-table filtering');
assert(studentPortalRoute.includes('AND NOT EXISTS'), 'excluded students must be filtered from portal assignments');
assert(studentPortalUi.includes("student-portal/exams?student_id="), 'student UI must consume the filtered exams endpoint');
assert(studentPortalUi.includes('single source of truth'), 'student UI must document filtered endpoint ownership');

console.log('archive target selection phase3 static contract checks passed');
