const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'archive', 'assessment', 'assessment-mvp.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

[
  '출제하기',
  '정답',
  '해설',
  '시험지 출력 방식 선택',
  '일반 시험지 출력',
  'AP 제출 QR 시험지 출력',
  '시험지 출력 형식',
  '한 페이지에 담을 문항 수를 선택하세요.',
  '출제 학급 선택',
  '학생 오답을 수집할 반을 선택하세요.',
  'openAssessmentPrintModeModal',
  'selectAssessmentPrintMode',
  'confirmAssessmentQpp',
  'openAssessmentClassSelectionModal',
  'confirmAssessmentClassSelection',
  'goAssessmentMixedEngine',
  '../mixed_engine.html',
  'submitQr',
  'className',
  'teacherName',
].forEach((requiredText) => {
  assert(html.includes(requiredText), `assessment-mvp.html should include ${requiredText}`);
});

assert(!html.includes('>출력</button>'), 'assessment action button should not use the old 출력 label');
assert(!html.includes('assessment-analysis.html'), 'analysis screen should not be added');
assert(!html.includes('성분표'), 'analysis button text should not be added');

const generatedFiles = [
  path.join(root, 'archive', 'assessment', 'assessment-packs-1sem.generated.js'),
  path.join(root, 'archive', 'assessment', 'assessment-question-index-1sem.generated.js'),
];
generatedFiles.forEach((file) => {
  assert(fs.existsSync(file), `${path.relative(root, file)} should exist`);
});

console.log('assessment archive print flow checks passed');
