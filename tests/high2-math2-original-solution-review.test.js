const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const archiveFile = 'original/high/h2/2mid/25_제일고_2학기_중간_고2_수학II.js';
const examPath = path.join(root, 'archive', 'exams', archiveFile);
const svgPath = path.join(root, 'archive', 'assets', 'images', '25_제일고_2학기_중간_고2_수학II', 'q20-solution.svg');

function loadQuestionBank(file) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 3000 });
  return context.window.questionBank;
}

test('25 제일고 수학II 원본은 22개 해설을 닫고 q01 source correction과 q20 solution visual을 등록한다', () => {
  const questions = loadQuestionBank(examPath);
  assert.equal(questions.length, 22);
  assert.deepEqual(Array.from(questions, question => Number(question.id)), Array.from({ length: 22 }, (_, index) => index + 1));
  assert.ok(questions.every(question => String(question.solution || '').trim().length > 0));

  const q1 = questions.find(question => question.id === 1);
  assert.match(q1.content, /2x\^2\+3x\+1/);
  assert.doesNotMatch(q1.content, /2x\^2\+3x\+4/);
  assert.match(q1.solution, /2x\^2\+3x\+1/);
  assert.doesNotMatch(q1.solution, /2x\^2\+3x\+4/);

  const q20 = questions.find(question => question.id === 20);
  assert.equal(q20.solutionImage, 'assets/images/25_제일고_2학기_중간_고2_수학II/q20-solution.svg');
  assert.equal(q20.solutionImageStatus, 'asset_verified');
  assert.equal(fs.existsSync(svgPath), true);

  const indexContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'archive', 'question-index.js'), 'utf8'), indexContext, { timeout: 3000 });
  const indexed = indexContext.window.questionIndex.filter(question => question.sourceFile === archiveFile);
  assert.equal(indexed.length, 22);
  assert.equal(indexed.find(question => question.id === 1).contentText.includes('2x^2+3x+1'), true);
  assert.equal(indexed.find(question => question.id === 20).hasSolutionImage, true);
});
