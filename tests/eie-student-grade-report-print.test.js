const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const students = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'eie/css/eie-grade-report-print.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'eie/js/eie-api.js'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/migrations/20260620_eie_grade_reports.sql'), 'utf8');
const workerSchema = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/schema.sql'), 'utf8');

assert(
  students.includes('renderGradeReportPanel(student)') &&
    students.includes('누적 성적표 인쇄') &&
    students.includes('EieStudentsView.openGradeReportPreview'),
  'student detail grades tab should expose a cumulative grade report print entry'
);

assert(
  students.includes("var _gradeReportIncludes = { vocab: true, grammar: true") &&
    students.includes("categoryCheck('vocab', '단어'") &&
    students.includes("categoryCheck('grammar', '문법'"),
  'grade report should default to vocab and grammar with optional categories hidden behind checks'
);

const panelBody = students.slice(students.indexOf('function renderGradeReportPanel'), students.indexOf('function consultationId'));
assert(
  students.includes('type="month"') &&
    students.includes("setGradeReportRange(\\'start\\'") &&
    students.includes("setGradeReportRange(\\'end\\'") &&
    !panelBody.includes('최근 3개월') &&
    !panelBody.includes('최근 6개월') &&
    !panelBody.includes('최근 12개월'),
  'grade report period controls should use direct start/end month inputs without month-count presets'
);

assert(
  students.includes('buildGradeReportSeries') &&
    students.includes('renderGradeReportChart') &&
    students.includes('월별 평균 흐름') &&
    students.includes('상담란'),
  'grade report should build monthly charts and include a parent consultation note area'
);

assert(
  students.includes('body.classList.add(\'eie-printing-grade-report\')') &&
    css.includes('body.eie-printing-grade-report') &&
    css.includes('.eie-grade-report-sheet'),
  'grade report print should use a dedicated print surface'
);

assert(
  students.includes('<textarea id="eie-grade-report-send-text"') &&
    students.includes('setGradeReportFinalMessage') &&
    students.includes('var _gradeReportFinalDirty = false') &&
    students.includes('수정본 보호 중') &&
    css.includes('.eie-grade-report-send-dirty') &&
    css.includes('body.eie-printing-grade-report .eie-grade-report-send-dirty') &&
    students.includes('regenerateGradeReportMessage') &&
    students.includes('문구 다시 생성') &&
    !students.includes('<pre id="eie-grade-report-send-text"'),
  'parent send text should be editable, dirty-protected, and explicitly regeneratable'
);

assert(
  students.includes('currentGradeReportMessage(student, series)') &&
    students.includes('var content = currentGradeReportMessage(student, series)') &&
    students.includes('_gradeReportFinalDirty = true') &&
    students.includes('if (_gradeReportFinalDirty && !force)') &&
    students.includes('refreshGradeReportGeneratedMessage(student, true)') &&
    students.includes('if (!_gradeReportFinalDirty) _gradeReportFinalMessage = \'\';'),
  'copy/save and auto refresh should preserve the teacher-edited final send message unless explicitly regenerated'
);

assert(
  students.includes("var GRADE_REPORT_CONSULTATION_TYPE = '학부모 상담 리포트'") &&
    students.includes('var _gradeReportsByStudent = {}') &&
    students.includes('gradeReportsOf(student)') &&
    students.includes('저장된 학부모 상담 리포트') &&
    students.includes('loadGradeReport(') &&
    students.includes('불러오기'),
  'grade report panel should list saved report originals and expose a load action'
);

assert(
  students.includes('EieApi.updateGradeReport(_gradeReportLoadedReportId, reportPayload)') &&
    students.includes('EieApi.createGradeReport(reportPayload)') &&
    students.includes('range_start: normalizeMonthInput(_gradeReportRangeStart)') &&
    students.includes('range_end: normalizeMonthInput(_gradeReportRangeEnd)') &&
    students.includes('included_categories: JSON.stringify(Object.assign({}, _gradeReportIncludes))') &&
    students.includes('final_message: content') &&
    students.includes('generated_snapshot: JSON.stringify(buildGradeReportSnapshot(student, series, summary))'),
  'grade report save should create/update a separate report original with range, categories, memo, final message, and snapshot'
);

const loadedReportEditBody = students.slice(students.indexOf('setGradeReportRange: function'), students.indexOf('newGradeReport: async function'));
assert(
  !loadedReportEditBody.includes("_gradeReportLoadedReportId = '';"),
  'editing a loaded report should preserve its report_id so saving updates the original instead of creating a duplicate'
);

const newReportBody = students.slice(students.indexOf('newGradeReport: async function'), students.indexOf('loadGradeReport: async function'));
assert(
  newReportBody.includes("_gradeReportLoadedReportId = '';"),
  'explicit new report creation should clear the loaded report id'
);

assert(
  students.includes('_gradeReportRangeStart = normalizeMonthInput(row.range_start)') &&
    students.includes('_gradeReportRangeEnd = normalizeMonthInput(row.range_end)') &&
    students.includes("_gradeReportFinalMessage = String(row.final_message == null ? '' : row.final_message)") &&
    students.includes('_gradeReportFinalDirty = true') &&
    students.includes('_gradeReportLoadedReportId = id'),
  'loading a saved report should restore saved range and final textarea message for printing'
);

assert(
  students.includes('report_id: _gradeReportLoadedReportId') &&
    worker.includes('report_id') &&
    worker.includes('ensureConsultationReportIdColumn') &&
    worker.includes('ALTER TABLE consultations ADD COLUMN report_id TEXT') &&
    migration.includes('CREATE TABLE IF NOT EXISTS eie_grade_reports') &&
    migration.includes('ALTER TABLE consultations ADD COLUMN report_id TEXT') &&
    workerSchema.includes('CREATE TABLE IF NOT EXISTS eie_grade_reports') &&
    workerSchema.includes('report_id TEXT'),
  'consultation records should link to saved report originals by schema-backed report_id instead of storing the report only in content'
);

assert(
  students.includes('var linkedConsultationId = consultationId(consultationRow)') &&
    students.includes('reportPayload.consultation_id = linkedConsultationId') &&
    students.includes('EieApi.updateGradeReport(_gradeReportLoadedReportId, reportPayload)') &&
    workerSchema.includes('consultation_id TEXT') &&
    migration.includes('consultation_id TEXT'),
  'saved EIE grade reports should be linked back to the created consultation when the consultation id is available'
);

assert(
  api.includes('getGradeReports(studentId)') &&
    api.includes('createGradeReport(payload)') &&
    api.includes('updateGradeReport(id, payload)') &&
    worker.includes("path[2] === 'grade-reports'") &&
    worker.includes('handlePostGradeReport') &&
    worker.includes('handlePatchGradeReport'),
  'EIE API should expose grade report list/create/update endpoints'
);

assert(
  students.includes('[최근 학습 흐름]') &&
    students.includes('[성취 영역]') &&
    students.includes('[보완 영역]') &&
    students.includes('[가정 학습 안내]') &&
    students.includes('[다음 목표]') &&
    students.includes('[상담 코멘트]'),
  'EIE parent report message should use the expanded AP Math-style report structure'
);

assert(
  index.includes('eie-grade-report-print.css'),
  'index should load grade report print styles'
);

const sheetBody = students.slice(students.indexOf('function renderGradeReportSheet'), students.indexOf('function renderGradeReportPanel'));
for (const forbidden of ['payload_json', 'raw_meta_json', 'student_id', 'created_by', 'updated_at']) {
  assert(!sheetBody.includes(forbidden), `printed grade report should not expose internal field ${forbidden}`);
}

console.log('EIE student grade report print test passed');
