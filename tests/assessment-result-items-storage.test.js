const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');

for (const requiredText of [
  'saveAssessmentResultItems',
  'assessment_result_items',
  'ON CONFLICT(session_id, order_no) DO UPDATE SET',
  'DELETE FROM assessment_result_items WHERE session_id = ? AND order_no > ?',
  "values.split(/[\\s,]+/)",
  'source_archive_file',
  'source_question_no',
  'standard_unit_key',
  'concept_cluster_key',
  'type_key',
  'difficulty',
]) {
  assert(
    examsRoute.includes(requiredText),
    `routes/exams.js should include result item storage marker: ${requiredText}`
  );
}

assert(
  examsRoute.includes("`${col} = excluded.${col}`") &&
  examsRoute.includes('updateColumns'),
  'routes/exams.js should update excluded result item columns dynamically'
);

for (const requiredText of [
  "result_status: wrongSet.has(orderNo) ? 'wrong' : 'correct'",
  'is_correct: wrongSet.has(orderNo) ? 0 : 1',
  'for (let orderNo = 1; orderNo <= questionCount; orderNo++)',
  'SELECT * FROM exam_blueprints WHERE archive_file = ?',
]) {
  assert(
    examsRoute.includes(requiredText),
    `routes/exams.js should build full correct/wrong rows using ${requiredText}`
  );
}

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
