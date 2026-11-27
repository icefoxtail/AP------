const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const renderText = require('../archive/render-text.js');

const examPath = path.join(
  __dirname,
  '../archive/exams/original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js'
);

test('2025 왕운중 중2 기말 Q10 보기 텍스트가 인쇄용 단일 박스에서 유지된다', () => {
  const context = { window: {} };
  new vm.Script(fs.readFileSync(examPath, 'utf8'), { filename: examPath })
    .runInNewContext(context);
  const q10 = context.window.questionBank.find(question => question.id === 10);
  assert.ok(q10);
  assert.equal(q10.answer, '⑤');

  const html = renderText.normalizeViewBlocks(renderText.wrapLatex(q10.content));
  assert.equal((html.match(/class="question-note-box"/g) || []).length, 1);
  assert.equal((html.match(/<div\b/gi) || []).length, 1);
  assert.doesNotMatch(html, /<p(?:\s|>)/i, 'html2canvas에서 누락되던 블록 문단을 사용하지 않는다');

  for (const text of [
    'ㄱ. <strong>흥민</strong>',
    '<strong>선생님</strong> 그럼 거꾸로 생각해서',
    '세 개의 직선이 <u>&nbsp;&nbsp;A&nbsp;&nbsp;</u>',
    '<strong>선생님</strong> 맞아요.',
    'ㄴ. 위 그림은 가로와 세로의 길이가 각각 15 cm와 12 cm',
    '이때, $\\square ABCD$와 $\\square EFGH$는'
  ]) {
    assert.ok(html.includes(text), '보기 내용 누락: ' + text);
  }
});
