const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const archiveFile = 'original/high/h2/2mid/25_제일고_2학기_중간_고2_수학II.js';
const examPath = path.join(root, 'archive', 'exams', archiveFile);
const assetDir = path.join(root, 'archive', 'assets', 'images', '25_제일고_2학기_중간_고2_수학II');

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

  const q16 = questions.find(question => question.id === 16);
  const q17 = questions.find(question => question.id === 17);
  const q20 = questions.find(question => question.id === 20);
  assert.equal(q16.solutionImage, 'assets/images/25_제일고_2학기_중간_고2_수학II/q16-solution.svg');
  assert.equal(q17.solutionImage, 'assets/images/25_제일고_2학기_중간_고2_수학II/q17-solution.svg');
  assert.equal(q20.solutionImage, 'assets/images/25_제일고_2학기_중간_고2_수학II/q20-solution.svg');
  assert.ok([q16, q17, q20].every(question => question.solutionImageStatus === 'asset_verified'));
  assert.ok([16, 17, 20].every(id => fs.existsSync(path.join(assetDir, `q${id}-solution.svg`))));
  assert.equal(questions.find(question => question.id === 12).subUnit, '미분');
  assert.equal(questions.find(question => question.id === 13).subUnit, '미분');
  assert.equal(q17.subUnit, '미분·적분의 활용');
  const q22 = questions.find(question => question.id === 22);
  assert.equal(q22.subUnitKey, 'H15-M2-06-DERIVATIVE_APPLICATION');
  assert.equal(q22.subUnit, '도함수의 활용');

  const indexContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'archive', 'question-index.js'), 'utf8'), indexContext, { timeout: 3000 });
  const indexed = indexContext.window.questionIndex.filter(question => question.sourceFile === archiveFile);
  assert.equal(indexed.length, 22);
  assert.equal(indexed.find(question => question.id === 1).contentText.includes('2x^2+3x+1'), true);
  assert.equal(indexed.find(question => question.id === 20).hasSolutionImage, true);
});

test('visual semantic mutation is rejected by the common comparator', async () => {
  const { compareVisualFacts } = await import('../archive/tools/pipeline-core/visual.mjs');
  const reportDir = path.join(root, 'reports', 'solution-review-v2.2', '25_제일고_2학기_중간_고2_수학II');
  for (const qid of [16, 17, 20]) {
    const expected = JSON.parse(fs.readFileSync(path.join(reportDir, `pipeline-v1-q${qid}-fact.json`), 'utf8'));
    const observed = structuredClone(expected);
    if (qid === 16) observed.semantic.keyPoints[0].y = 0;
    if (qid === 17) observed.semantic.keyPoints[0].x = 2;
    if (qid === 20) observed.semantic.circles[0].radius += 0.1;
    assert.equal(compareVisualFacts(expected, observed).status, 'FAIL', `q${qid} mutation must fail`);
  }
});
