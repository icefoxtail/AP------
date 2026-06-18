const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const student = fs.readFileSync(path.join(root, 'apmath/js/student.js'), 'utf8');
const report = fs.readFileSync(path.join(root, 'apmath/js/report.js'), 'utf8');

assert(
  student.includes('function openStudentReportOutputFromDetail') &&
    student.includes('openReportCenterExam(key, sessionId || sessions[0].id || \'\')'),
  'student grade tab should route report output through the existing report center exam entry point'
);

assert(
  student.includes('function getStudentAcademyExamSessionsForDetail') &&
    student.includes('apmsGetExamSessionsForStudent'),
  'student grade tab should reuse the same academy exam session source as the grade history'
);

assert(
  /<h3>최근 원내평가<\/h3>[\s\S]*?리포트 출력/.test(student),
  'recent academy grade card should expose a compact report output button in the section header'
);

assert(
  /openStudentReportOutputFromDetail\(\$\{apmsStudentJsString\(sid\)\}, \$\{apmsStudentJsString\(e\.id\)\}\)[\s\S]*?>리포트 출력<\/button>/.test(student),
  'each academy grade history row should expose report output for that exam session'
);

assert(
  report.includes('function openReportCenterExam(studentId, selectedSessionId = \'\')') &&
    report.includes('리포트보기/프리미엄분석') &&
    report.includes('reportCenterOpenPrintView'),
  'existing report center should keep the printable exam report flow'
);

console.log('apmath student grade report entry test passed');
