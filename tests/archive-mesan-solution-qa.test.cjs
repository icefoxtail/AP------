const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const examRoot = path.resolve(__dirname, '../archive');
const examFile = 'exams/original/middle/m3/2final/21_매산중_2학기_기말_중3_기출.js';
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(examRoot, examFile), 'utf8'), { window });
const question = id => window.questionBank.find(q => q.id === id);

test('2021 매산중 10번 해설은 한글 캡션을 제공한다', () => {
  const q = question(10);
  assert.match(q.solutionImageCaption, /3t\+u=360°/);
  assert.match(q.solutionImageCaption, /2x=45°/);
  assert.doesNotMatch(q.solutionImageAlt, /\?{2}/);
  assert.ok(fs.existsSync(path.join(examRoot, q.solutionImage)));
});

test('2021 매산중 21번은 40도 조건과 50도 정답이 일치하는 해설 그림을 사용한다', () => {
  const q = question(21);
  assert.match(q.imageAlt, /40도/);
  assert.match(q.answer, /50/);
  assert.match(q.solutionImageCaption, /40°=50°/);
  assert.doesNotMatch(q.solutionImageAlt + q.solutionImageCaption, /45°/);
  assert.ok(fs.existsSync(path.join(examRoot, q.solutionImage)));
  assert.notEqual(q.solutionImage, 'assets/images/21_매산중_2학기_기말_중3_기출/q21-solution-v2.svg');
});
