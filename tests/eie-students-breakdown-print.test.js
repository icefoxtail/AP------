const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const students = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'eie/css/eie-timetable-board-fixes.css'), 'utf8');

assert(
  !students.includes('function renderGradeCards') &&
    !students.includes('function renderTeacherCards') &&
    !students.includes('renderGradeCards()') &&
    !students.includes('renderTeacherCards()'),
  'EIE students main screen should not render grade or teacher breakdown cards'
);

assert(
  students.includes("var STUDENT_GRADE_OPTIONS = ['초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3']") &&
    students.includes('<label class="eie-apms-soft-select"><span>학년</span><select onchange="EieStudentsView.setGradeFilter(this.value)">') &&
    students.includes('STUDENT_GRADE_OPTIONS.map(function (grade)'),
  'EIE grade filtering should use a fixed 초1 through 고3 dropdown'
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
    !students.includes("onclick=\"EieStudentsView.togglePrintPanel()\""),
  'print controls should not be exposed in the main student-management toolbar'
);

assert(
    students.includes('function renderStatusFilters') &&
    students.includes("['active', '재원', 'active']") &&
    students.includes("['new', '신입', 'new']") &&
    students.includes("['paused', '휴원', 'paused']") &&
    students.includes("['inactive', '퇴원', 'inactive']") &&
    students.includes("['all', '전체', 'all']") &&
    !students.includes("['archived', '보관'") &&
    !students.includes('>보관</option>') &&
    !students.includes('보관 처리'),
  'main status filters and user-facing form controls should show only 재원, 신입, 휴원, 퇴원, 전체 without 보관 copy'
);

assert(
  students.includes('function renderFilterControls') &&
    students.includes('class="eie-apms-soft-select"') &&
    students.includes('이름, 학교, 연락처, 수업으로 검색'),
  'student-management filters should use soft dropdown controls and CRM-style search copy'
);

assert(
  !students.includes('eie-back-button') &&
    !students.includes('EIE 홈으로 이동') &&
    !students.includes('← EIE'),
  'student-management main screen should not render the EIE back button above the title'
);

assert(
  students.includes('function teacherFilterRoster') &&
    students.includes("'원장님', '프랩', 'PREP', '외국인', 'Foreigner'") &&
    students.includes('var roster = teacherFilterRoster()'),
  'teacher dropdown should exclude owner/prep/foreigner names without affecting form teacher roster'
);

assert(
  students.includes("if (status === 'archived') return false") &&
    students.includes("if (_statusFilter === 'new') return isNewStudent(student)") &&
    students.includes('function isNewStudent(student)') &&
    students.includes('today.getMonth() - 2') &&
    students.includes("if (_statusFilter === 'inactive') return status === 'inactive' || status === 'withdrawn'"),
  'main status filtering should exclude archived students, show new students by 2-month enroll date, and group inactive/withdrawn together'
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
  css.includes('.eie-student-print-table') &&
    css.includes('.eie-student-print-summary-line') &&
    css.includes('.eie-student-print-memo') &&
    css.includes('.eie-apms-student-row:hover') &&
    css.includes('--eie-primary: #0f766e') &&
    css.includes('.eie-apms-filter-chip.is-new.is-active') &&
    css.includes('.eie-apms-filter-bar') &&
    css.includes('.eie-apms-soft-select') &&
    css.includes('min-height: 44px') &&
    css.includes('height: 44px') &&
    css.includes('-webkit-line-clamp: 2') &&
    css.includes('body.eie-printing-students') &&
    css.includes('size: A4 landscape'),
  'EIE students CSS should style breakdown cards and compact A4 landscape worksheet printing'
);

console.log('EIE students breakdown and print contract test passed');
