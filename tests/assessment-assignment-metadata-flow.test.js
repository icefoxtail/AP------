const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');

for (const requiredText of [
  'pack_id',
  'pack_hash',
  'assignment_batch_id',
  'target_scope',
  'grade_label',
]) {
  assert(
    examsRoute.includes(requiredText),
    `routes/exams.js should persist assignment metadata field ${requiredText}`
  );
}

for (const requiredText of [
  'assignment_id',
  'result_hash',
  'analysis_status',
  'resolveExamAssignmentMeta',
  'buildResultHash',
]) {
  assert(
    examsRoute.includes(requiredText),
    `routes/exams.js should handle exam session metadata ${requiredText}`
  );
}

for (const requiredText of [
  'assessment_pack_id',
  'type_key',
  'difficulty',
]) {
  assert(
    examsRoute.includes(requiredText) || mixedEngine.includes(requiredText),
    `exam blueprint flow should include ${requiredText}`
  );
}

for (const requiredText of [
  'ASSIGNMENT_META_COLUMNS',
  'EXAM_SESSION_META_COLUMNS',
  'BLUEPRINT_META_COLUMNS',
  'normalizeTargetScope',
  'COALESCE(excluded.${col}, class_exam_assignments.${col})',
]) {
  assert(
    examsRoute.includes(requiredText),
    `routes/exams.js should keep backend assignment metadata support ${requiredText}`
  );
}

assert(
  !mixedEngine.includes('ASSESSMENT:') && !examsRoute.includes('ASSESSMENT:'),
  'assessment pack id should not be written into archive_file as ASSESSMENT:<packId>'
);

assert(
  !mixedEngine.includes('created_by') && !examsRoute.includes('created_by'),
  'Round 3 should not send or persist created_by'
);

console.log('assessment assignment metadata flow checks passed');
