const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');
const studentPortal = fs.readFileSync(path.join(root, 'apmath', 'student', 'index.html'), 'utf8');

for (const [label, source] of [
  ['engine.html', engine],
  ['mixed_engine.html', mixedEngine],
]) {
  assert(
    source.includes("if (!classId)") &&
      source.includes("new URL('../apmath/student/', window.location.href)") &&
      source.includes("url.searchParams.set('omr', '1')") &&
      source.includes("url.searchParams.set('archiveFile'") &&
      source.includes("new URL('../check/', window.location.href)"),
    `${label} should route class-less submit QR codes to the student page while preserving class QR check flow`
  );

  assert(
    source.includes('학생페이지로 이동') && !source.includes('반 정보 없음'),
    `${label} should label class-less submit QR codes as student-page QR codes`
  );
}

assert(
  studentPortal.includes('function shouldOpenOmrFromUrl()') &&
    studentPortal.includes("params.get('omr') === '1'") &&
    studentPortal.includes('await renderOmrExams();'),
  'student portal should open the OMR list automatically for QR links with omr=1'
);

console.log('assessment submit QR student page route checks passed');
