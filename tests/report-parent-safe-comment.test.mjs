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
  state: { db: {} },
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const comment = context.reportCenterBuildParentSafeQuestionComment({
  questionNo: 5,
  unit: '이차방정식',
  correctRate: 12,
  reviewText: JSON.stringify({
    concept: '두 근의 합과 곱',
    tag: '계산·검산',
    trap: '전체 정답률 5%라는 표현과 함정, blueprint를 그대로 쓰면 안 됩니다'
  })
});
assert.match(comment, /계산|검산|마무리/);
assert.match(comment, /두 근의 합과 곱/);
assert.doesNotMatch(comment, /코호트|함정|blueprint|review_text|전체 정답률\s*5%|데이터 없음|확인 불가/);

const other = context.reportCenterBuildParentSafeQuestionComment({
  questionNo: 6,
  unit: '이차방정식',
  correctRate: 12,
  reviewText: JSON.stringify({ concept: '판별식 조건', trap: '조건을 식으로 옮기는 단계가 중요합니다' })
});
assert.notEqual(comment, other);

// F4: 수식/코드 축약 함정은 학부모 문장에 얹지 않는다(부자연 방지). 은행 문장만으로 자연스럽게.
const shorthand = context.reportCenterBuildParentSafeQuestionComment({
  questionNo: 7,
  unit: '이차방정식',
  correctRate: 12,
  reviewText: JSON.stringify({ concept: '근의 공식', tag: '개념 재정리', trap: 'BC=x+b/2 세팅' })
});
assert.doesNotMatch(shorthand, /BC|세팅/, '수식 축약 함정은 학부모 문장에 얹히면 안 됨');
assert.equal(context.reportCenterTrapReadsNatural('BC=x+b/2 세팅'), false);
assert.equal(context.reportCenterTrapReadsNatural('복잡한 조건을 식으로 옮기는 첫 단계에서 방향을 잡기 어렵습니다'), true);

console.log('report parent safe comment test passed');
