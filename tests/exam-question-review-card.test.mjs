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

const baseReview = {
  questionNo: 7,
  unit: '함수',
  correctRate: 62.4,
  classCorrectRate: 58.2,
  contentText: '다음 식을 계산하세요. $x^2+1$',
  choices: ['1', '2', '<script>alert(1)</script>'],
  answer: '2',
  solutionText: '양변을 정리합니다.',
  reviewText: '저장된 문항 분석 문장입니다.'
};

const hiddenAnswerHtml = context.reportCenterBuildQuestionReviewCard(baseReview);
assert.match(hiddenAnswerHtml, /저장된 문항 분석 문장입니다\./);
assert.match(hiddenAnswerHtml, /7번 · 함수/);
assert.match(hiddenAnswerHtml, /전체 정답률[\s\S]*62%/);
assert.match(hiddenAnswerHtml, /반 정답률[\s\S]*58%/);
assert.match(hiddenAnswerHtml, /\$x\^2\+1\$/);
assert.doesNotMatch(hiddenAnswerHtml, />정답</);
assert.doesNotMatch(hiddenAnswerHtml, />2<\/p>/);
assert.doesNotMatch(hiddenAnswerHtml, /<script/i);
assert.equal(context.reportCenterLooksLikeCodeText(hiddenAnswerHtml), false);

const shownAnswerHtml = context.reportCenterBuildQuestionReviewCard(baseReview, { showAnswer: true });
assert.match(shownAnswerHtml, />정답</);
assert.match(shownAnswerHtml, />2<\/p>/);

const fallbackHtml = context.reportCenterBuildQuestionReviewCard({
  ...baseReview,
  reviewText: '',
  correctRate: 42
});
assert.doesNotMatch(fallbackHtml, /저장된 문항 분석 문장입니다\./);
assert.match(fallbackHtml, /함수/);
assert.match(fallbackHtml, /7/);

const noRateHtml = context.reportCenterBuildQuestionReviewCard({
  questionNo: 9,
  unit: '도형',
  contentText: '삼각형의 넓이를 구하세요.',
  reviewText: '도형 조건을 차분히 확인합니다.'
});
assert.doesNotMatch(noRateHtml, /NaN%/);
assert.doesNotMatch(noRateHtml, /전체 정답률|반 정답률/);
assert.match(noRateHtml, /자료 부족/);

const noContentHtml = context.reportCenterBuildQuestionReviewCard(baseReview, {
  showContent: false,
  showSolution: false,
  badge: false
});
assert.doesNotMatch(noContentHtml, /다음 식을 계산하세요/);
assert.doesNotMatch(noContentHtml, /양변을 정리합니다/);
assert.doesNotMatch(noContentHtml, /aprc-qreview-badge/);

console.log('exam question review card tests passed');
