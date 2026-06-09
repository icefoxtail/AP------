const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'eie/css/eie.css'), 'utf8');
const teacher = fs.readFileSync(path.join(root, 'eie/js/views/eie-teacher.js'), 'utf8');

function lastCssBlock(selector) {
  const pattern = new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([\\s\\S]*?)\\n\\}', 'g');
  const matches = [...css.matchAll(pattern)];
  return matches.length ? matches[matches.length - 1][1] : '';
}

const quickCardsBlock = lastCssBlock('.eie-teacher-quick-cards');
assert(quickCardsBlock, 'teacher quick cards CSS block should exist');
assert(
  quickCardsBlock.includes('grid-template-columns: repeat(3, minmax(0, 1fr));'),
  'teacher dashboard shortcuts should render as three cards in one row'
);

const quickCardBlock = lastCssBlock('.eie-teacher-quick-card');
assert(quickCardBlock, 'teacher quick card CSS block should exist');
assert(
  css.includes('.eie-teacher-quick-card') && css.includes('font-weight: 500;'),
  'teacher dashboard shortcut text should follow the existing detail panel weight'
);

const headingBlock = lastCssBlock('.eie-teacher-home-copy h2');
assert(headingBlock, 'teacher dashboard heading CSS block should exist');
assert(
  /font-weight:\s*500\s*;/.test(headingBlock),
  'teacher dashboard heading should follow the existing detail panel weight'
);

assert(
  css.includes('var(--eie-p-surface)') &&
    css.includes('var(--eie-p-border)') &&
    css.includes('var(--eie-p-text-sub)'),
  'teacher dashboard styles should reuse EIE detail panel CSS tokens'
);

assert(
  teacher.includes('eie-teacher-dashboard eie-v2-screen') &&
    teacher.includes('data-eie-teacher-key') &&
    teacher.includes('eie-teacher-home-head eie-p-card') &&
    teacher.includes('eie-teacher-day-row eie-p-card') &&
    teacher.includes('eie-teacher-chip eie-p-chip') &&
    teacher.includes('eie-p-btn-save'),
  'teacher dashboard markup should reuse EIE panel/card/chip/button classes'
);

assert(
  css.includes('--eie-active-teacher-rgb') &&
    css.includes('var(--eie-teacher-carmen-rgb)') &&
    css.includes('border-left: 3px solid rgba(var(--eie-active-teacher-rgb)'),
  'teacher dashboard should reuse timetable teacher RGB accents'
);

assert(
  teacher.includes('EieTeacherView.openTimetable()') &&
    teacher.includes('EieTeacherView.openClassroomList()') &&
    teacher.includes('EieTeacherView.openAttendanceLedger()'),
  'teacher dashboard should keep timetable, classroom, and enabled attendance shortcuts'
);

assert(
  teacher.includes("return '등원' + Math.max(0, count - absent);") &&
    !teacher.includes("return '출결 전';"),
  'teacher dashboard attendance chips should default enrolled students to present'
);

console.log('EIE teacher dashboard style regression test passed');
