const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const targetPath = path.resolve(
  __dirname,
  '../archive/exams/original/middle/m2/2mid/25_왕운중_2학기_중간_중2_수학.js'
);

function loadQuestionBank() {
  const window = {};
  vm.runInNewContext(fs.readFileSync(targetPath, 'utf8'), { window });
  return window.questionBank;
}

test('2025 왕운중 중2 2학기 중간 16번은 half 도형 크기를 사용한다', () => {
  const question = loadQuestionBank()[15];

  assert.equal(question.id, 16);
  assert.equal(question.imageSize, 'half');
  assert.equal(question.choices.length, 5);
});
