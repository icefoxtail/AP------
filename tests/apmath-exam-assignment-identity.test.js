const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const assessment = fs.readFileSync(path.join(root, 'archive', 'assessment', 'assessment-mvp.html'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');
const classroomPlanner = fs.readFileSync(path.join(root, 'apmath', 'js', 'classroom-planner.js'), 'utf8');
const qrOmr = fs.readFileSync(path.join(root, 'apmath', 'js', 'qr-omr.js'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'migrations', '20260616_class_exam_assignment_identity.sql'), 'utf8');

assert(
  assessment.includes("url.searchParams.set('assignmentRegistered', '1')") &&
    assessment.includes('options.assignmentRegistered || options.preRegistered') &&
    assessment.includes('assignmentRegistered: true') &&
    assessment.includes('preRegistered: true'),
  'assessment mixed handoff should mark pre-registered assignments and skip representative re-registration'
);

assert(
  mixedEngine.includes('function isAssignmentPreRegistered') &&
    mixedEngine.includes("params.get('assignmentRegistered') === '1'") &&
    mixedEngine.includes('if (isAssignmentPreRegistered()) return;'),
  'mixed engine should not re-register class_exam_assignments when assessment already registered them'
);

assert(
  examsRoute.includes('function buildAssignmentIdentityKey') &&
    examsRoute.includes('PACK||${packId}||${packHash}') &&
    examsRoute.includes('AND archive_file IN (${markers})') &&
    examsRoute.includes('AND pack_id = ?') &&
    examsRoute.includes("AND TRIM(COALESCE(archive_file, '')) = ''"),
  'class exam assignment route should use archive identity first and pack/manual fallbacks'
);

assert(
  examsRoute.includes('async function findExistingExamSessionByIdentity') &&
    examsRoute.includes('AND exam_date = ?') &&
    examsRoute.includes('AND archive_file IN (${markers})') &&
    examsRoute.includes('const archiveFile = normalizeAssignmentArchiveFile(d.archive_file || \'\');'),
  'OMR session saves should resolve existing sessions by archive-backed identity'
);

assert(
  classroomPlanner.includes('const assignmentById = new Map') &&
    classroomPlanner.includes('const archivedCandidates = candidates.filter') &&
    classroomPlanner.includes('const linkedAssignment = assignmentById.get') &&
    classroomPlanner.includes('assignmentCandidates.filter'),
  'classroom exam grade grouping should prefer assignment/archive identity over title matching'
);

assert(
  qrOmr.includes('const archivedBaseKeys = new Set') &&
    qrOmr.includes('const visibleRows = rows.filter') &&
    qrOmr.includes('normalizeQrArchiveFile(e.archive_file || \'\') === archiveFile'),
  'OMR history should hide archive-less duplicates when an archive-backed row exists'
);

assert(
  migration.includes('uq_class_exam_assignments_archive_identity') &&
    migration.includes('uq_class_exam_assignments_manual_identity') &&
    migration.includes('PARTITION BY class_id, exam_date, archive_file') &&
    migration.includes('PARTITION BY class_id, exam_title, exam_date'),
  'D1 migration should clean existing duplicate assignments and add canonical identity indexes'
);

console.log('apmath exam assignment identity checks passed');
