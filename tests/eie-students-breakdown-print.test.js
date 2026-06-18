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
    students.includes('EieStudentsView.printStudents') &&
    students.includes('EieStudentsView.setPrintOption'),
  'EIE students screen should expose worksheet-style print controls and print flow'
);

for (const header of [
  '<th>No</th>',
  '<th>학생명</th>',
  '<th>학년</th>',
  '<th>학교</th>',
  '<th>상태</th>',
  '<th>담당 선생님</th>',
  '<th>수업/반</th>',
  '<th>요일/교시</th>',
  '<th>학생 연락처</th>',
  '<th>학부모 연락처</th>',
  '<th>등원일</th>',
  '<th>메모</th>'
]) {
  assert(students.includes(header), `print worksheet should include ${header}`);
}

assert(
  css.includes('.eie-apms-grade-cards') &&
    css.includes('.eie-apms-teacher-cards') &&
    css.includes('.eie-student-print-table') &&
    css.includes('body.eie-printing-students') &&
    css.includes('size: A4 landscape'),
  'EIE students CSS should style breakdown cards and A4 landscape worksheet printing'
);

console.log('EIE students breakdown and print contract test passed');
