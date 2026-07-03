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

console.log('report parent safe comment test passed');
