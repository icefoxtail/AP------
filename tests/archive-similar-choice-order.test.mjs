// 유사문항 보기 순서·정답 번호 분포 점검 단위 테스트 (규칙 정본: docs/agents/similar-choices.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseChoiceValue, analyzeChoiceOrder, leakWarnings, evaluateAnswerTokens, answerDistribution,
  chooseTargetAnswers, drawTargetAnswers, findPeriodicPattern, findCyclicRun,
} from '../archive/tools/similar-import/choice-order-lib.mjs';

const mc = (choices, answer) => ({ questionType: '객관식', choices, answer });

test('보기 값 환산: 정수·분수·근호·π·단위·접두 기호', () => {
  assert.equal(parseChoiceValue('① $-3$').value, -3);
  assert.equal(parseChoiceValue('$\\dfrac{3}{4}$').value, 0.75);
  assert.equal(parseChoiceValue('$\\dfrac9{22}$').value, 9 / 22);
  assert.ok(Math.abs(parseChoiceValue('$3\\sqrt{2}$').value - 4.2426) < 1e-3);
  assert.equal(parseChoiceValue('$12\\,\\mathrm{cm}^2$').unit, 'cm^2');
  assert.equal(parseChoiceValue('$2\\pi$').pi, true);
  assert.equal(parseChoiceValue('5개').unit, '개');
  // 식·소인수분해·변수가 든 보기는 수가 아니다
  assert.equal(parseChoiceValue('$2^2\\times3$'), null);
  assert.equal(parseChoiceValue('$x+1$'), null);
  assert.equal(parseChoiceValue('$(-3)+5$'), null);
});

test('결함 A: 하나만 어긋나고 그것이 정답', () => {
  const a = analyzeChoiceOrder(mc(['2', '3', '5', '6', '4'], '⑤'));
  assert.equal(a.status, 'A');
  assert.equal(analyzeChoiceOrder(mc(['2', '3', '4', '5', '6'], '③')).status, 'OK');
  assert.equal(analyzeChoiceOrder(mc(['6', '5', '4', '3', '2'], '③')).status, 'OK');
});

test('결함 B: 정답이 아닌 보기가 어긋나거나 둘 이상 어긋남', () => {
  assert.equal(analyzeChoiceOrder(mc(['2', '4', '3', '5', '6'], '①')).status, 'B');
  assert.equal(analyzeChoiceOrder(mc(['5', '2', '4', '1', '3'], '③')).status, 'B');
});

test('수가 아닌 보기·단위가 다른 보기·그림 보기는 점검 대상이 아니다', () => {
  assert.equal(analyzeChoiceOrder(mc(['ㄱ', 'ㄴ', 'ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'], '③')).status, 'NOT_NUMERIC');
  assert.equal(analyzeChoiceOrder(mc(['3cm', '4 cm²', '5', '6', '7'], '①')).status, 'NOT_NUMERIC');
  assert.equal(analyzeChoiceOrder(mc([], '③')).status, 'NOT_NUMERIC');
  assert.equal(analyzeChoiceOrder({ questionType: '서답형', choices: [], answer: '3' }).status, 'NOT_OBJECTIVE');
});

test('같은 값 보기는 중복으로 알린다', () => {
  assert.equal(analyzeChoiceOrder(mc(['1', '2', '2', '3', '4'], '②')).dup, true);
});

test('생김새 누설 경고: 정답만 꼴이 다른 수 보기', () => {
  assert.ok(leakWarnings(mc(['2', '4', '6', '8', '9'], '⑤')).includes('ANSWER_ONLY_GAP'));
  assert.ok(leakWarnings(mc(['$2$', '$3$', '$\\sqrt{2}$', '$4$', '$5$'], '③')).includes('ANSWER_ONLY_SQRT'));
  assert.deepEqual(leakWarnings(mc(['2', '4', '6', '8', '10'], '③')), []);
});

test('정답 번호 분포 결함 기준', () => {
  const ev = s => evaluateAnswerTokens(s.split(' '));
  assert.equal(ev('3 1 5 2 4 1 3 5 4 2 1 5 1 2 3 2 3 4 4 5').skewed, false);
  assert.match(ev('3 4 1 2 5 3 4 1 2 5').reasons.join(), /되풀이/);
  assert.match(ev('1 2 3 4 5 1 3 2 5 4').reasons.join(), /늘어나는/);
  assert.match(ev('5 4 3 2 1 3 1 4 2 5').reasons.join(), /줄어드는/);
  assert.match(ev('1 1 1 3 2 4 5 2 3 4').reasons.join(), /3연속/);
  assert.match(ev('1 2 1 3 1 4 5 2 3 1').reasons.join(), /%/);
  assert.match(ev('1 2 3 1 3 4 1 2 4 3').reasons.join(), /안 나온 번호/);
  assert.equal(ev('1 1 1 1 1 1 1 1').skewed, false, '10문항 미만 시험지는 분포를 보지 않는다');
  assert.ok(findPeriodicPattern('3 4 1 2 5 3 4 1 2 5'.split(' ')));
  assert.ok(findCyclicRun('4 5 1 2 3'.split(' ')));
  assert.equal(findCyclicRun('1 2 3 4 1'.split(' ')), null);
});

test('시험지 분포: 객관식만 센다', () => {
  const bank = [mc(['1', '2'], '①'), { questionType: '서답형', answer: '3' }, mc(['1', '2'], '②')];
  assert.equal(answerDistribution(bank).objective, 2);
});

test('목표 정답 번호 배열 뽑기: 결정적이고 기준을 통과하며 고정 자리를 지킨다', () => {
  const tokens = '3 4 1 2 5 3 4 1 2 5 3 4 1 2 5 3 4 1 2 5'.split(' ');
  tokens[2] = '2+4';
  const allowed = tokens.map((t, i) => (i === 5 ? [t] : ['1', '2', '3', '4', '5']));
  const a = chooseTargetAnswers({ tokens, allowed, seed: 'seed-A' });
  const b = chooseTargetAnswers({ tokens, allowed, seed: 'seed-A' });
  assert.ok(a.ok);
  assert.deepEqual(a.target, b.target);
  assert.equal(evaluateAnswerTokens(a.target).skewed, false);
  assert.equal(a.target[2], '2+4');
  assert.equal(a.target[5], tokens[5]);
  assert.ok(a.changed.length > 0 && a.changed.length < tokens.length);
  const ok = chooseTargetAnswers({ tokens: '3 1 5 2 4 1 3 5 4 2 1 5 1 2 3 2 3 4 4 5'.split(' '), seed: 'x' });
  assert.equal(ok.unchanged, true);
  const fresh = drawTargetAnswers({ count: 18, seed: 'fresh', fixed: { 0: '4' } });
  assert.ok(fresh.ok);
  assert.equal(fresh.target[0], '4');
  assert.equal(evaluateAnswerTokens(fresh.target).skewed, false);
});
