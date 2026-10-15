const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');
const resultItemsHelper = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'helpers', 'assessment-result-items.js'), 'utf8');
const studentPortalRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'student-portal.js'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');

for (const requiredText of [
  'saveAssessmentResultItems',
  'assessment_result_items',
  'source_archive_file',
  'source_question_no',
  'source_question_uid',
  'source_question_ordinal',
  'metadata_revision',
  'metadata_hash',
  'metadata_json',
  'standard_unit_key',
  'concept_cluster_key',
  'type_key',
  'difficulty',
]) {
  assert(
    resultItemsHelper.includes(requiredText),
    `assessment result helper should include result item storage marker: ${requiredText}`
  );
}

assert(
  resultItemsHelper.includes('RESULT_SNAPSHOT_COLUMNS') &&
  resultItemsHelper.includes('!RESULT_SNAPSHOT_COLUMNS.has(column)'),
  'result regrades should leave existing identity and Meta snapshots unchanged'
);

for (const requiredText of [
  "result_status: isWrong ? 'wrong' : 'correct'",
  'is_correct: isWrong ? 0 : 1',
  'for (let orderNo = 1; orderNo <= questionCount; orderNo++)',
  'loadFrozenAssignmentQuestions(env, assignmentId)',
]) {
  assert(
    resultItemsHelper.includes(requiredText),
    `assessment result helper should build frozen rows using ${requiredText}`
  );
}

assert(
  !resultItemsHelper.includes('SELECT * FROM exam_blueprints'),
  'historical result identity must not be inferred from current blueprints'
);

assert(
  examsRoute.includes('normalizeWrongIds('),
  'exam result routes should preserve the existing wrong-id normalization contract'
);

const manualRouteMatch = examsRoute.match(/if\s*\(method === 'PATCH'\)\s*\{([\s\S]*?)return jsonResponse\(\{ success: true, id: sid \}\);/);
assert(manualRouteMatch, 'manual exam session save route should exist');
assert(
  manualRouteMatch[1].includes('saveAssessmentResultItems'),
  'manual exam-sessions/new flow should call saveAssessmentResultItems'
);

const bulkRouteMatch = examsRoute.match(/if\s*\(method === 'POST' && id === 'bulk-omr'\)\s*\{([\s\S]*?)return jsonResponse\(\{ success: true, saved: sessionRows.length \}\);/);
assert(bulkRouteMatch, 'bulk OMR route should exist');
assert(
  bulkRouteMatch[1].includes('saveAssessmentResultItems'),
  'bulk OMR flow should call saveAssessmentResultItems'
);

assert(
  studentPortalRoute.includes('saveAssessmentResultItems(env, {') &&
  studentPortalRoute.includes("code: 'OMR_ALREADY_SUBMITTED'") &&
  studentPortalRoute.includes('WHERE assignment_id = ?'),
  'student OMR should store frozen identity, keep duplicate submissions immutable, and key sessions by assignment id'
);

assert(
  !examsRoute.includes('INSERT INTO assessment_analysis_snapshots') &&
  !examsRoute.includes('INSERT INTO assessment_report_snapshots'),
  'Round 4 should not write analysis/report snapshots'
);

assert(
  !mixedEngine.includes('assessment-analysis.html') &&
  !mixedEngine.includes('분석표'),
  'Round 4 should not add analysis UI to mixed_engine.html'
);

assert(
  !mixedEngine.includes('ASSESSMENT:') && !examsRoute.includes('ASSESSMENT:'),
  'assessment pack id should not be written into archive_file as ASSESSMENT:<packId>'
);

assert(
  !mixedEngine.includes('created_by') && !examsRoute.includes('created_by'),
  'Round 4 should not send or persist created_by'
);

console.log('assessment result items storage checks passed');
