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
  index.includes('eie-grade-report-print.css'),
  'index should load grade report print styles'
);

const sheetBody = students.slice(students.indexOf('function renderGradeReportSheet'), students.indexOf('function renderGradeReportPanel'));
for (const forbidden of ['payload_json', 'raw_meta_json', 'student_id', 'created_by', 'updated_at']) {
  assert(!sheetBody.includes(forbidden), `printed grade report should not expose internal field ${forbidden}`);
}

console.log('EIE student grade report print test passed');
