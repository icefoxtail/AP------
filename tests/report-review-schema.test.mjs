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

assert.deepEqual(Array.from(context.reportCenterErrorTags()), ['계산·검산', '풀이 순서', '조건 해석', '개념 재정리']);
assert.equal(context.reportCenterResolveErrorTag({ tag: '계산·검산' }, 30), '계산·검산');
assert.equal(context.reportCenterResolveErrorTag({}, 88), '계산·검산');
assert.equal(context.reportCenterResolveErrorTag({}, 70), '풀이 순서');
assert.equal(context.reportCenterResolveErrorTag({}, 50), '조건 해석');
assert.equal(context.reportCenterResolveErrorTag({}, 20), '개념 재정리');
assert.equal(context.reportCenterResolveErrorTag({}, null), null);
assert.deepEqual(context.reportCenterParseReviewJson(JSON.stringify({ concept: '두 근의 합' })).concept, '두 근의 합');

const html = context.reportCenterBuildQuestionReviewCard({
  questionNo: 3,
  correctRate: 20,
  reviewText: JSON.stringify({ concept: '해의 범위 조건', tag: '계산·검산', asks: '범위를 확인합니다.' })
});
assert.match(html, /해의 범위 조건/);
assert.match(html, /계산·검산/);
assert.match(html, /묻는 것/);

console.log('report review schema test passed');
