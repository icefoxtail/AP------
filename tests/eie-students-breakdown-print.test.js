const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const students = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'eie/css/eie-timetable-board-fixes.css'), 'utf8');

assert(
  students.includes('function renderGradeCards') &&
    students.includes('function renderTeacherCards') &&
    students.includes('studentsForGrade(grade, rows)') &&
    students.includes('studentsForTeacher(name, rows)'),
  'EIE students screen should render real grade and teacher breakdown cards from connected student data'
);

assert(
  students.includes("var STUDENT_GRADE_OPTIONS = ['초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3']") &&
    students.includes('STUDENT_GRADE_OPTIONS.map(function (grade)'),
  'EIE grade cards should include fixed 초1 through 고3 cards'
);

assert(
  students.includes('function renderPrintPanel') &&
    students.includes('function renderPrintSheet') &&
    students.includes('function printGroups') &&
    students.includes('function printColumnConfig') &&
    students.includes('function printColumnCount') &&
    students.includes('EieStudentsView.togglePrintPanel') &&
    students.includes('EieStudentsView.printStudents') &&
    students.includes('EieStudentsView.setPrintOption'),
  'EIE students screen should expose worksheet-style print controls and print flow'
);

assert(
  students.includes('var _printPanelOpen = false') &&
    students.includes("if (!_printPanelOpen) return ''") &&
    students.includes("onclick=\"EieStudentsView.togglePrintPanel()\""),
  'print controls should stay hidden on the main student-management screen until the user clicks the print button'
);

assert(
  students.includes("grade: _printGrouping !== 'grade'") &&
    students.includes("teacher: _printGrouping !== 'teacher'"),
  'print worksheet should omit grade or teacher columns when the section title already supplies that grouping'
);

assert(
  students.includes('<div class="eie-student-print-summary-line">') &&
    students.includes('eie-student-print-memo') &&
    students.includes('printColumnCount(config)'),
  'print worksheet should use a compact summary line, two-line memo cells, and dynamic empty-row colspan'
);

for (const header of ['No', '학생명', '학년', '학교', '상태', '담당 선생님', '수업/반', '요일/교시', '학생 연락처', '학부모 연락처', '등원일', '메모']) {
  assert(students.includes(`<th>${header}</th>`), `print worksheet should define ${header} column`);
}

assert(
  css.includes('.eie-apms-grade-cards') &&
    css.includes('.eie-apms-teacher-cards') &&
    css.includes('.eie-student-print-table') &&
    css.includes('.eie-student-print-summary-line') &&
    css.includes('.eie-student-print-memo') &&
    css.includes('.eie-apms-breakdown-card:hover') &&
    css.includes('.eie-apms-student-row:hover') &&
    css.includes('-webkit-line-clamp: 2') &&
    css.includes('body.eie-printing-students') &&
    css.includes('size: A4 landscape'),
  'EIE students CSS should style breakdown cards and compact A4 landscape worksheet printing'
);

console.log('EIE students breakdown and print contract test passed');
