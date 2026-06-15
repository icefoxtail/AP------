const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const clinicPrint = fs.readFileSync(path.join(root, 'apmath', 'js', 'clinic-print.js'), 'utf8');
const core = fs.readFileSync(path.join(root, 'apmath', 'js', 'core.js'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'index.js'), 'utf8');

assert(
  clinicPrint.includes('function clinicPrintGetClassExamAssignments') &&
    clinicPrint.includes('state.db.class_exam_assignments || state.db.exam_assignments'),
  'clinic print should read class exam assignment rows'
);

assert(
  clinicPrint.includes("const AP_CLINIC_PRINT_ASSIGNMENT_FROM_DATE = '2026-06-01'") &&
    clinicPrint.includes('function clinicPrintIsOnOrAfterFromDate'),
  'clinic print should use June 1, 2026 as the assignment visibility baseline'
);

assert(
  clinicPrint.includes('async function clinicPrintRefreshClassAssignments') &&
    clinicPrint.includes('class-exam-assignments?class=') &&
    clinicPrint.includes('clinicPrintMergeClassAssignments'),
  'clinic print should refresh class assignment rows when the modal opens'
);

assert(
  clinicPrint.includes('async function openClinicPrintCenter') &&
    !clinicPrint.includes('출제 기록을 불러오는 중입니다'),
  'clinic print should refresh assignments without showing an internal loading message'
);

assert(
  clinicPrint.includes('function openClinicClassPicker') &&
    clinicPrint.includes('clinicPrintGetActiveClasses') &&
    clinicPrint.includes("onclick=\"openClinicCenter('${safeClassId}')\"") &&
    clinicPrint.includes("onclick=\"clinicPrintOpenSimilarMenu('${safeClassIdForJs}')\""),
  'sidebar clinic entry should let users pick a class and then choose wrong-print or similar-question mode'
);

assert(
  clinicPrint.includes("typeof openClinicSimilarForClass === 'function'") &&
    core.includes('async function openClinicSimilarForClass') &&
    core.includes('computeClassWeakUnits(classId)') &&
    core.includes('renderWeakUnitSummary(weakUnits'),
  'clinic similar-question entry should build class weak-unit recommendations before opening the basket'
);

assert(
  clinicPrint.includes('clinicPrintGetClassExamAssignments(classId).forEach') &&
    clinicPrint.includes('.filter(group => group.printable || group.sessions.length > 0)'),
  'clinic print should show printable assigned exams even before any student session exists'
);

assert(
  clinicPrint.includes('countsCompatible') &&
    clinicPrint.includes('!group.questionCount || !sessionQuestionCount || sessionQuestionCount === group.questionCount'),
  'clinic print should match assignment-created groups with later submitted sessions even when assignment question_count was missing'
);

assert(
  core.includes('class_exam_assignments: Array.isArray(data.class_exam_assignments) ? data.class_exam_assignments') &&
    worker.includes('class_exam_assignments: cea.results') &&
    worker.includes('SELECT * FROM class_exam_assignments'),
  'initial-data should include class_exam_assignments for the AP Math frontend'
);

console.log('apmath clinic print assignment visibility guard passed');
