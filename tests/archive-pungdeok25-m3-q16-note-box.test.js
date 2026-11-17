const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const sourcePath = path.join(
  __dirname,
  '..',
  'archive/exams/original/middle/m3/2final/25_풍덕중_2학기_기말_중3_기출.js'
);

test('2025 풍덕중 중3 2학기 기말 Q16 keeps every statement in one flat note box', () => {
  const source = fs.readFileSync(sourcePath, 'utf8');
  const script = new vm.Script(source, { filename: sourcePath });
  const context = { window: {} };
  script.runInNewContext(context);

  const q16 = context.window.questionBank.find(question => question.id === 16);
  assert.ok(q16, 'Q16 exists');
  assert.equal(q16.answer, '③');
  assert.match(q16.solution, /따라서 옳은 것은 ㄱ, ㄴ, ㅁ의 \$3\$개이므로 정답은 ③이다\./);
  assert.match(q16.content, /<div class='note-box'>/);
  assert.equal((q16.content.match(/<div\b/gi) || []).length, 1);
  assert.equal((q16.content.match(/<br>/g) || []).length, 5);
  for (const statement of [
    'ㄱ. 편차의 합은 항상 $0$이다.',
    'ㄴ. 최빈값은 자료에 따라 여러 개일 수 있다.',
    'ㄷ. 변량의 개수가 짝수개이면 중앙값은 $2$개다.',
    'ㄹ. 각 자료들의 값이 모두 증가하면 표준편차도 증가한다.',
    'ㅁ. 분산이 클수록 각 자료의 값이 평균을 중심으로 좌우로 넓게 흩어져 있다.'
  ]) {
    assert.ok(q16.content.includes(statement), `Q16 content includes ${statement}`);
  }
});
