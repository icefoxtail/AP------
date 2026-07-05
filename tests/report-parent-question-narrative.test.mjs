import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const context = {
  state: { db: { students: [], exam_sessions: [], wrong_answers: [], exam_blueprints: [], exam_question_reviews: [] } },
  window: {},
  document: { querySelectorAll: () => [] },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const easy = context.reportCenterBuildParentQuestionNarrative({
  questionNo: 3,
  correctRate: 91,
  reviewText: JSON.stringify({ concept: '일차방정식', tag: '계산·검산' })
});
assert.match(easy.headline, /전체 정답률 91%로 대부분 맞힌 기본 문항/);
assert.match(easy.meaning, /계산과 마무리 확인/);
assert.match(easy.action, /검산 습관/);
assert.match(easy.action, /식 변형/);

const hard = context.reportCenterBuildParentQuestionNarrative({
  questionNo: 8,
  correctRate: 32,
  reviewText: JSON.stringify({ concept: '부등식과 범위', tag: '조건 해석', trap: '경계값 포함 여부를 놓치기 쉬웠습니다' })
});
assert.match(hard.headline, /전체 정답률 32%/);
assert.match(hard.headline, /최상위 문항/);
assert.match(hard.reason, /경계값 포함 여부/);
assert.match(hard.meaning, /조건을 식으로 옮기고 범위/);
assert.match(hard.action, /최상위 난도 문항 대비/);
assert.match(hard.action, /범위 표시와 경계값/);

const functionCase = context.reportCenterBuildParentQuestionNarrative({
  questionNo: 11,
  correctRate: 58,
  reviewText: JSON.stringify({ concept: '함수 활용', tag: '풀이 순서' })
});
assert.match(functionCase.headline, /쉽지 않았던 적용 문항/);
assert.match(functionCase.meaning, /어느 단계부터 정리/);
assert.match(functionCase.action, /상황 해석, 표 만들기, 식 확인/);

const forbidden = /raw|archive|blueprint|review_text|자료 없음|확인 불가|못함|부족함|위험|왜곡/i;
[easy, hard, functionCase].forEach(result => {
  assert.doesNotMatch(Object.values(result).join(' '), forbidden);
  assert.notEqual(result.headline, result.meaning);
  assert.notEqual(result.meaning, result.action);
});

const cleaned = context.reportCenterAssertParentSafe('오답 단원의 핵심 풀이를 다음 수업에서 다시 풀이하며 확인하고 풀이 시작점을 안정적으로 잡겠습니다.');
assert.doesNotMatch(cleaned, /풀이 시작점|안정적으로 잡겠습니다|오답 단원의 핵심 풀이/);
assert.match(cleaned, /조건과 식을 세우는 순서|틀린 문항의 풀이 과정/);

console.log('report parent question narrative test passed');
