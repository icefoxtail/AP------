const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const students = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'eie/css/eie-grade-report-print.css'), 'utf8');

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
    !students.includes('<pre id="eie-grade-report-send-text"'),
  'parent send text should be an editable textarea instead of a static pre'
);

assert(
  students.includes('currentGradeReportMessage(student, series)') &&
    students.includes('var content = currentGradeReportMessage(student, series)'),
  'copy and consultation save should use the teacher-edited final send message'
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
