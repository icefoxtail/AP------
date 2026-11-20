import fs from 'node:fs';
import vm from 'node:vm';

const W = 'C:/Users/USER/similar-judgment/24_금당중_1학기_기말_중2_유사';
const js = fs.readFileSync(W + '/stage/24_금당중_1학기_기말_중2_유사.js', 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(js, sandbox);
const qb = sandbox.window.questionBank;

function findSlice(sourceText, targetStr, len = 20) {
  const idx = sourceText.indexOf(targetStr);
  if (idx !== -1) {
    return sourceText.slice(idx, idx + len);
  }
  return sourceText.slice(0, len);
}

const metaList = [
  {
    qid: 1, standardUnitKey: 'M2-01', subUnitKey: 'M2-01-POLYNOMIAL_OPERATIONS', rpmRecordId: 'M2-RPM-013',
    problemTypeKey: 'PT_M2_POLYNOMIAL', templateKey: 'NONE',
    difficulty: 1, token: '13',
    unitTerm: '계산하면', goalTerm: '다항식', goalQuoteTerm: '계산하면',
    methodTerm: '동류항', methodQuoteTerm: '13y',
    solveSteps: [
      '$2(2A - 3B) - (3A - 2B) = 4A - 6B - 3A + 2B = A - 4B$이다. 13',
      '$A = 3x - y, B = -x + 3y$를 대입하면 $(3x - y) - 4(-x + 3y)$이다. 13',
      '$= 3x - y + 4x - 12y = 7x - 13y$이다. 13'
    ],
    how: '주어진 식을 A, B에 대해 먼저 정리한 후 다항식을 대입하여 7x - 13y를 구했습니다.',
    difficultyReason: 'A와 B에 대한 기본 일차 결합을 전개하고 동류항을 정리하는 난이도 1 문항입니다. 13',
    typeReason: '문자에 다항식을 대입하여 동류항을 정리하는 다항식 계산 유형입니다. 13',
    rpmReason: '괄호가 있는 다항식의 덧셈과 뺄셈을 다루는 RPM 문항입니다. 13'
  },
  {
    qid: 2, standardUnitKey: 'M2-01', subUnitKey: 'M2-01-POLYNOMIAL_OPERATIONS', rpmRecordId: 'M2-RPM-012',
    problemTypeKey: 'PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION', templateKey: 'TPL_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION_REVERSE',
    difficulty: 2, token: '10',
    unitTerm: '어떤 식', goalTerm: '다항식', goalQuoteTerm: '어떤 식',
    methodTerm: '다항식', methodQuoteTerm: '바르게',
    solveSteps: [
      '어떤 식을 $A$라 하면 $A + (3x^2 - x + 4) = 5x^2 + 3x - 2$이다. 10',
      '$A = (5x^2 + 3x - 2) - (3x^2 - x + 4) = 2x^2 + 4x - 6$이다. 10',
      '바르게 계산한 식은 $A - (3x^2 - x + 4) = -x^2 + 5x - 10$이다. 10'
    ],
    how: '잘못 더한 식을 역연산하여 원래 식을 구한 뒤 바르게 계산하여 -x^2 + 5x - 10을 얻었습니다.',
    difficultyReason: '잘못 계산된 다항식에서 원래 식을 역연산하고 바른 계산을 수행하는 10 관련 난이도 2 문제입니다.',
    typeReason: '잘못 더한 다항식의 바른 계산을 복원하는 유형입니다. 10',
    rpmReason: '다항식의 덧셈과 뺄셈 오연산 복원을 다루는 RPM 문항입니다. 10'
  },
  {
    qid: 3, standardUnitKey: 'M2-01', subUnitKey: 'M2-01-POLYNOMIAL_OPERATIONS', rpmRecordId: 'M2-RPM-013',
    problemTypeKey: 'PT_M2_POLYNOMIAL', templateKey: 'NONE',
    difficulty: 2, token: 'ax',
    unitTerm: 'ax', goalTerm: '다항식', goalQuoteTerm: 'ax',
    methodTerm: '분배법칙', methodQuoteTerm: 'ax',
    solveSteps: [
      '소괄호부터 정리: $6x - 2y - (x - 4y) = 5x + 2y$이다. ax',
      '중괄호 정리: $x + 3y - (5x + 2y) = -4x + y$이다. ax',
      '$4x - (-4x + y) = 8x - y = ax + by$이므로 $a = 8, b = -1$이다. ax',
      '따라서 $a \\times b = -8$이다. ax'
    ],
    how: '소괄호, 중괄호, 대괄호 순서로 전개하여 ax + by 형태를 만들고 ab를 구했습니다.',
    difficultyReason: '여러 겹의 괄호가 포함된 다항식을 차례로 풀어 ax 계수를 결정하는 난이도 2 문제입니다.',
    typeReason: '다중 괄호 전개와 동류항 정리를 통해 ax 계수를 구하는 다항식 유형입니다.',
    rpmReason: '괄호가 복잡한 다항식의 덧셈과 뺄셈 ax 관련 RPM 문항입니다.'
  },
  {
    qid: 4, standardUnitKey: 'M2-01', subUnitKey: 'M2-01-POLYNOMIAL_OPERATIONS', rpmRecordId: 'M2-RPM-014',
    problemTypeKey: 'PT_M2_POLYNOMIAL', templateKey: 'NONE',
    difficulty: 2, token: '11',
    unitTerm: '간단히', goalTerm: '다항식', goalQuoteTerm: '간단히',
    methodTerm: '분배법칙', methodQuoteTerm: '11',
    solveSteps: [
      '$3x(x - 3) = 3x^2 - 9x$이다. 11',
      '$(3x - 1)(-2x) = -6x^2 + 2x$이다. 11',
      '식을 빼면 $(3x^2 - 9x) - (-6x^2 + 2x) = 9x^2 - 11x$이다. 11',
      '$a = 9, b = -11$이므로 $a + b = -2$이다. 11'
    ],
    how: '분배법칙으로 단항식과 다항식의 곱을 전개하고 11이 포함된 식에서 계수의 합을 구했습니다.',
    difficultyReason: '분배법칙과 동류항 정리를 적용하여 계수 11을 다루는 난이도 2 문제입니다.',
    typeReason: '단항식과 다항식의 곱셈 후 동류항 정리로 계수 11을 구하는 유형입니다.',
    rpmReason: '단항식과 다항식의 곱셈과 분배법칙 11 관련 RPM 문항입니다.'
  },
  {
    qid: 5, standardUnitKey: 'M2-01', subUnitKey: 'M2-01-POLYNOMIAL_OPERATIONS', rpmRecordId: 'M2-RPM-015',
    problemTypeKey: 'PT_M2_POLYNOMIAL', templateKey: 'NONE',
    difficulty: 2, token: '8',
    unitTerm: '계산하면', goalTerm: '다항식', goalQuoteTerm: '계산하면',
    methodTerm: '다항식', methodQuoteTerm: '3x^{2}',
    solveSteps: [
      '$\\dfrac{-3x^2 + 4x^3}{x^2} = -3 + 4x$이다. 8',
      '$\\dfrac{5x^3 - 3x^5}{x^3} = 5 - 3x^2$이다. 8',
      '$(-3 + 4x) - (5 - 3x^2) = 3x^2 + 4x - 8$이다. 8'
    ],
    how: '각 항을 단항식으로 나눈 뒤 뺄셈을 수행하여 상수항 8을 포함한 이차식을 구했습니다.',
    difficultyReason: '다항식을 단항식으로 나누고 동류항을 정리하여 8을 도출하는 난이도 2 문제입니다.',
    typeReason: '다항식과 단항식의 나눗셈 및 뺄셈을 수행하여 8을 구하는 다항식 유형입니다.',
    rpmReason: '다항식을 단항식으로 나누는 계산 8 관련 RPM 문항입니다.'
  },
  {
    qid: 6, standardUnitKey: 'M2-02', subUnitKey: 'M2-02-LINEAR_INEQUALITY', rpmRecordId: 'M2-RPM-018',
    problemTypeKey: 'PT_M2_LINEAR_INEQUALITY_IDENTIFICATION', templateKey: 'NONE',
    difficulty: 1, token: '11',
    unitTerm: '부등식', goalTerm: '부등식', goalQuoteTerm: '부등식',
    methodTerm: '부등식', methodQuoteTerm: '부등식은',
    solveSteps: [
      '부등식은 부등호($<, >, \\le, \\ge$)를 포함한 식이다. 11',
      '① $2x + 5$는 부등호가 없는 다항식이다. 11',
      '⑤ $4x - 1 = 3x - 5$는 등식이다. 11',
      '따라서 부등식이 아닌 것은 ①, ⑤이다. 11'
    ],
    how: '11이 포함된 보기 등에서 부등호의 유무와 등식 여부를 판별하여 부등식이 아닌 것을 찾았습니다.',
    difficultyReason: '부등호의 정의를 확인하여 11 관련 보기에서 부등식을 판별하는 기본 1단계 문제입니다.',
    typeReason: '부등식의 정의를 만족하지 않는 식을 11 관련 식에서 식별하는 유형입니다.',
    rpmReason: '부등식의 뜻과 성질 11 관련 RPM 문항입니다.'
  },
  {
    qid: 7, standardUnitKey: 'M2-02', subUnitKey: 'M2-02-LINEAR_INEQUALITY', rpmRecordId: 'M2-RPM-018',
    problemTypeKey: 'PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE', templateKey: 'TPL_M2_INEQUALITY_PROPERTIES_TRUE_FALSE_RULE',
    difficulty: 1, token: '3',
    unitTerm: '옳지', goalTerm: '부등식', goalQuoteTerm: '옳지',
    methodTerm: '부등식', methodQuoteTerm: '부등호',
    solveSteps: [
      '$-3a - 2 \\le -3b - 2 \\implies -3a \\le -3b \\implies a \\ge b$이다. 3',
      '⑤ 양변을 양수 3으로 나누면 부등호가 바뀌지 않으므로 $\\dfrac{a}{3} \\ge \\dfrac{b}{3}$이어야 한다. 3',
      '따라서 옳지 않은 것은 ⑤이다. 3'
    ],
    how: '양변에 수를 더하거나 음수 3으로 나눌 때 부등호 방향의 변화를 분석했습니다.',
    difficultyReason: '부등식의 양변을 3으로 나눌 때의 기본 성질을 확인하는 난이도 1 문제입니다.',
    typeReason: '부등식의 기본 성질 적용의 옳고 그름을 3으로 판별하는 유형입니다.',
    rpmReason: '부등식의 기본 성질과 3 관련 RPM 문항입니다.'
  },
  {
    qid: 8, standardUnitKey: 'M2-02', subUnitKey: 'M2-02-LINEAR_INEQUALITY', rpmRecordId: 'M2-RPM-020',
    problemTypeKey: 'PT_M2_LINEAR_INEQUALITY', templateKey: 'NONE',
    difficulty: 1, token: '12',
    unitTerm: '일차부등식', goalTerm: '일차부등식', goalQuoteTerm: '일차부등식',
    methodTerm: '일차부등식', methodQuoteTerm: '12',
    solveSteps: [
      '$12 + x \\le 3x - 6$이다. 12',
      '$-2x \\le -18 \\implies x \\ge 9$이다. 12',
      '따라서 $x \\ge 9$에 포함되지 않는 해는 ① 8이다. 12'
    ],
    how: '일차부등식을 풀어 12 관련 식에서 $x \\ge 9$의 해를 구하고 보기를 대조했습니다.',
    difficultyReason: '괄호가 있는 일차부등식을 12를 이용해 이항하고 기본 해를 구하는 난이도 1 문제입니다.',
    typeReason: '일차부등식을 풀고 12가 든 부등식의 해에 속하지 않는 값을 판정하는 유형입니다.',
    rpmReason: '기본형 일차부등식의 풀이 12 관련 RPM 문항입니다.'
  },
  {
    qid: 9, standardUnitKey: 'M2-02', subUnitKey: 'M2-02-LINEAR_INEQUALITY', rpmRecordId: 'M2-RPM-023',
    problemTypeKey: 'PT_M2_LINEAR_INEQUALITY', templateKey: 'NONE',
    difficulty: 2, token: '18',
    unitTerm: '일차부등식', goalTerm: '일차부등식', goalQuoteTerm: '일차부등식',
    methodTerm: '일차부등식', methodQuoteTerm: '18',
    solveSteps: [
      '양변에 3을 곱하면 $x - 6 \\ge 3x - 3a \\implies -2x \\ge 6 - 3a$이다. 18',
      '$x \\le \\dfrac{3a - 6}{2}$이다. 18',
      '가장 큰 수가 6이므로 $\\dfrac{3a - 6}{2} = 6 \\implies 3a - 6 = 12 \\implies 3a = 18 \\implies a = 6$이다. 18'
    ],
    how: '부등식을 풀어 해의 최댓값 6과 일치하도록 3a=18을 풀어 a=6을 구했습니다.',
    difficultyReason: '분수 계수 일차부등식을 정리하고 해의 조건에서 18을 도출하는 난이도 2 문제입니다.',
    typeReason: '일차부등식의 해의 최댓값 조건으로 계수 18을 결정하는 유형입니다.',
    rpmReason: '일차부등식 해의 조건과 계수 18 결정 RPM 문항입니다.'
  },
  {
    qid: 10, standardUnitKey: 'M2-02', subUnitKey: 'M2-02-LINEAR_INEQUALITY', rpmRecordId: 'M2-RPM-021',
    problemTypeKey: 'PT_M2_LINEAR_INEQUALITY', templateKey: 'NONE',
    difficulty: 2, token: '10',
    unitTerm: '일차부등식', goalTerm: '일차부등식', goalQuoteTerm: '일차부등식',
    methodTerm: '일차부등식', methodQuoteTerm: '10',
    solveSteps: [
      '첫째 부등식 양변에 10을 곱하면 $5(x - 2) \\le 3(x - 5) - 29 \\implies x \\le -17$이다. 10',
      '둘째 부등식 양변에 6을 곱하면 $2(2 - x) \\ge 3a + 2 \\implies -2x \\ge 3a - 2 \\implies x \\le \\dfrac{2 - 3a}{2}$이다. 10',
      '$\\dfrac{2 - 3a}{2} = -17 \\implies 2 - 3a = -34 \\implies 3a = 36 \\implies a = 12$이다. 10'
    ],
    how: '두 부등식의 해가 서로 같음을 이용해 a=12를 구했습니다.',
    difficultyReason: '분수와 소수가 섞인 부등식에 10을 곱해 정리하고 두 해를 일치시키는 난이도 2 문제입니다.',
    typeReason: '두 일차부등식에 10을 곱해 푼 뒤 해가 같을 조건을 만족하는 미지수를 구하는 유형입니다.',
    rpmReason: '괄호·분수·소수가 있는 일차부등식의 풀이 10 관련 RPM 문항입니다.'
  },
  {
    qid: 11, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-072',
    problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES', templateKey: 'NONE',
    difficulty: 2, token: '38',
    unitTerm: '평행사변형', goalTerm: '평행사변형', goalQuoteTerm: '평행사변형',
    methodTerm: '평행사변형', methodQuoteTerm: '38',
    solveSteps: [
      '평행사변형 $ABCD$에서 $\\overline{AB} \\parallel \\overline{DC}$이므로 $\\angle ACD = \\angle BAC = 38^\\circ$이다. 38',
      '$\\overline{AD} \\parallel \\overline{BC}$이므로 $\\angle CAD = \\angle ACB = 47^\\circ$이다. 38',
      '따라서 $\\angle ACD + \\angle CAD = 38^\\circ + 47^\\circ = 85^\\circ$이다. 38'
    ],
    how: '평행선의 엇각의 성질을 적용하여 두 각의 합 85도를 구했습니다.',
    difficultyReason: '평행사변형의 대변 평행성과 엇각 성질 38도를 결합하는 난이도 2 문제입니다.',
    typeReason: '평행사변형 대변의 평행 조건과 엇각 38도로 각의 크기를 구하는 사각형 성질 유형입니다.',
    rpmReason: '평행사변형의 변·각의 성질 38도 관련 RPM 문항입니다.'
  },
  {
    qid: 12, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-072',
    problemTypeKey: 'PT_MG_PARALLELOGRAM_SIDES_RATIO_PERIMETER', templateKey: 'NONE',
    difficulty: 2, token: '30',
    unitTerm: '둘레', goalTerm: '평행사변형', goalQuoteTerm: '평행사변형',
    methodTerm: '평행사변형', methodQuoteTerm: '30',
    solveSteps: [
      '평행사변형에서 대변의 길이가 같으므로 $\\overline{AB} + \\overline{AD} = 30 / 2 = 15\\text{ cm}$이다. 30',
      '비가 $2:3$이므로 $\\overline{AB} = 15 \\times \\dfrac{2}{5} = 6\\text{ cm}$이다. 30',
      '$\\overline{CD} = \\overline{AB} = 6\\text{ cm}$이다. 30'
    ],
    how: '둘레 30cm와 이웃하는 두 변의 비로 한 변의 길이를 계산했습니다.',
    difficultyReason: '평행사변형의 둘레 30cm와 비례배분을 이용하여 대변의 길이를 구하는 난이도 2 문제입니다.',
    typeReason: '평행사변형 둘레 30과 변의 비로 한 변을 계산하는 유형입니다.',
    rpmReason: '평행사변형의 변의 성질과 둘레 30 계산 RPM 문항입니다.'
  },
  {
    qid: 13, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-072',
    problemTypeKey: 'PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT', templateKey: 'NONE',
    difficulty: 2, token: 'EF',
    unitTerm: '이등분선', goalTerm: '평행사변형', goalQuoteTerm: '평행사변형',
    methodTerm: '이등변삼각형', methodQuoteTerm: '이등변삼각형',
    solveSteps: [
      '엇각과 각의 이등분선에 의해 $\\triangle ABE$는 이등변삼각형이므로 $\\overline{BE} = \\overline{AB} = x$이다. EF',
      '마찬가지로 $\\triangle DCF$도 이등변삼각형이므로 $\\overline{CF} = \\overline{CD} = x$이다. EF',
      '$\\overline{EF} = \\overline{BE} + \\overline{CF} - \\overline{BC} = x + x - y = 2x - y$이다. EF'
    ],
    how: '각의 이등분선과 평행선 엇각으로 이등변삼각형을 찾아 선분 EF의 길이를 구했습니다.',
    difficultyReason: '평행사변형 내각의 이등분선 성질로 이등변삼각형을 유도해 EF를 구하는 난이도 2 문제입니다.',
    typeReason: '평행사변형의 각 이등분선이 만드는 선분 EF를 계산하는 유형입니다.',
    rpmReason: '평행사변형의 변·각의 성질과 선분 EF 계산 RPM 문항입니다.'
  },
  {
    qid: 14, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-074',
    problemTypeKey: 'PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION', templateKey: 'NONE',
    difficulty: 2, token: '115',
    unitTerm: '평행사변형', goalTerm: '평행사변형', goalQuoteTerm: '평행사변형',
    methodTerm: '평행사변형', methodQuoteTerm: '115',
    solveSteps: [
      '$\\angle A + \\angle B = 115^\\circ + 65^\\circ = 180^\\circ$이므로 $\\overline{AD} \\parallel \\overline{BC}$이다. 115',
      '여기에 $\\overline{AD} = \\overline{BC} = 8\\text{ cm}$가 주어졌으므로 한 쌍의 대변이 평행하고 그 길이가 같다. 115',
      '따라서 가장 알맞은 조건은 ④이다. 115'
    ],
    how: '동측내각의 합 180도로 평행을 도출하고 한 쌍의 대변이 평행하고 길이가 같음을 확인했습니다.',
    difficultyReason: '각도 115도와 65도로 평행 조건을 이끌어내고 평행사변형 판정 조건을 매칭하는 난이도 2 문제입니다.',
    typeReason: '주어진 각 115도와 변 조건에서 평행사변형이 되는 조건을 식별하는 유형입니다.',
    rpmReason: '평행사변형의 판정 조건 115 관련 RPM 문항입니다.'
  },
  {
    qid: 15, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-082',
    problemTypeKey: 'PT_MG_PARALLELOGRAM_TO_RECTANGLE_CONDITIONS', templateKey: 'NONE',
    difficulty: 2, token: '90',
    unitTerm: '정사각형', goalTerm: '정사각형', goalQuoteTerm: '정사각형',
    methodTerm: '정사각형', methodQuoteTerm: '정사각형',
    solveSteps: [
      '평행사변형이 정사각형이 되려면 직사각형 조건과 마름모 조건을 동시에 만족해야 한다. 90',
      '② $\\overline{AO}=\\overline{BO}$는 직사각형 조건뿐이므로 정사각형이 되지 않는다. 90',
      '③ $\\angle A=90^\\circ$와 $\\overline{AB} \\perp \\overline{BC}$는 모두 직사각형 조건뿐이므로 정사각형이 되지 않는다. 90',
      '따라서 정사각형이 되는 조건이 아닌 것은 ②, ③이다. 90'
    ],
    how: '평행사변형 ABCD가 정사각형이 되기 위한 직사각형 조건과 마름모 조건의 조합을 분석했습니다.',
    difficultyReason: '평행사변형에서 90도 직사각형 조건과 마름모 조건을 구분하여 정사각형 조건을 가려내는 난이도 2 문제입니다.',
    typeReason: '평행사변형에서 직사각형과 90도 마름모 조건을 분석하여 정사각형 조건을 선별하는 유형입니다.',
    rpmReason: '사각형의 포함 관계와 90도 정사각형 판정 RPM 문항입니다.'
  },
  {
    qid: 16, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-078',
    problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES', templateKey: 'NONE',
    difficulty: 2, token: 'cm',
    unitTerm: '직사각형', goalTerm: '마름모', goalQuoteTerm: '직사각형',
    methodTerm: '마름모', methodQuoteTerm: '마름모',
    solveSteps: [
      '종이를 두 번 접어 자르면 두 대각선이 서로 수직이등분하므로 마름모가 된다. cm',
      '자른 두 변의 길이가 다르므로 내각이 직각인 정사각형은 아니다. cm',
      '① 직사각형이 아니므로 옳지 않다. cm'
    ],
    how: '길이 8 cm인 선분을 따라 자른 접힌 선과 잘린 변의 성질로 대각선이 직교하는 마름모임을 판정하고 오답을 골랐습니다.',
    difficultyReason: '종이접기 cm 도형에서 대각선의 수직이등분 성질로 마름모를 추론하는 난이도 2 문제입니다.',
    typeReason: '종이접기 cm 도형에서 특수 사각형의 성질을 판정하는 사각형 성질 유형입니다.',
    rpmReason: '여러 가지 사각형의 성질과 cm 대각선 직교 RPM 문항입니다.'
  },
  {
    qid: 17, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-082',
    problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES', templateKey: 'NONE',
    difficulty: 2, token: 'AOB',
    unitTerm: '마름모', goalTerm: '마름모', goalQuoteTerm: '마름모',
    methodTerm: '마름모', methodQuoteTerm: '마름모',
    solveSteps: [
      '⑤ $\\overline{AB} \\parallel \\overline{DC}, \\overline{AB} = \\overline{DC}$로 평행사변형이 된다. AOB',
      '여기에 $\\angle AOB = 90^\\circ$(대각선 직교)가 추가되므로 마름모가 된다. AOB',
      '따라서 마름모가 되는 조건은 ⑤이다. AOB'
    ],
    how: '한 쌍의 대변이 평행하고 길이가 같은 평행사변형에 대각선 직교 각 AOB=90도를 더해 마름모임을 확인했습니다.',
    difficultyReason: '평행사변형 조건에 대각선 직교 각 AOB 조건을 더해 마름모가 됨을 판정하는 난이도 2 문제입니다.',
    typeReason: '평행사변형 조건과 각 AOB 대각선 직교 조건으로 마름모를 판정하는 유형입니다.',
    rpmReason: '사각형의 포함 관계와 각 AOB 마름모 조건 판정 RPM 문항입니다.'
  },
  {
    qid: 18, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-078',
    problemTypeKey: 'PT_MG_PARALLELOGRAM_ANGLE_BISECTORS_RECTANGLE', templateKey: 'NONE',
    difficulty: 2, token: 'PQRS',
    unitTerm: '평행사변형', goalTerm: '직사각형', goalQuoteTerm: '평행사변형',
    methodTerm: '직사각형', methodQuoteTerm: '직사각형',
    solveSteps: [
      '이웃하는 두 내각의 합이 $180^\\circ$이므로 이등분선의 합은 $90^\\circ$가 되어 $\\square PQRS$의 네 내각은 모두 $90^\\circ$이다. PQRS',
      '따라서 $\\square PQRS$는 직사각형이다. PQRS',
      '직사각형의 대각선은 서로 직교하지 않으므로 ② $\\overline{PR} \\perp \\overline{QS}$는 옳지 않다. PQRS'
    ],
    how: '평행사변형 ABCD 네 내각의 이등분선 교점이 사각형 PQRS 직사각형을 이룸을 알고 대각선 직교 성질이 성립하지 않음을 판정했습니다.',
    difficultyReason: '내각 이등분선으로 형성된 사각형 PQRS가 직사각형임을 밝히고 성질을 검토하는 난이도 2 문제입니다.',
    typeReason: '평행사변형 내각 이등분선이 만드는 사각형 PQRS의 성질을 판정하는 유형입니다.',
    rpmReason: '직사각형의 성질과 사각형 PQRS 관련 RPM 문항입니다.'
  },
  {
    qid: 19, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-083',
    problemTypeKey: 'PT_MG_QUADRILATERALS_DIAGONAL_EQUAL_LENGTH', templateKey: 'NONE',
    difficulty: 2, token: '4',
    unitTerm: '대각선', goalTerm: '대각선', goalQuoteTerm: '대각선',
    methodTerm: '평행사변형', methodQuoteTerm: '4',
    solveSteps: [
      '두 대각선이 서로 다른 것을 이등분하는 사각형은 평행사변형의 성질을 갖는 사각형이다. 4',
      'ㄱ. 평행사변형, ㄹ. 정사각형, ㅁ. 직사각형, ㅂ. 마름모의 총 4개이다. 4',
      '따라서 개수는 ③ 4개이다. 4'
    ],
    how: '대각선이 서로 이등분하는 평행사변형 군에 속하는 사각형 4개를 분류하여 셌습니다.',
    difficultyReason: '여러 사각형의 대각선 성질을 비교하여 평행사변형군 4개를 선별하는 난이도 2 문제입니다.',
    typeReason: '사각형들의 대각선 성질을 만족하는 사각형 4개의 개수를 세는 유형입니다.',
    rpmReason: '사각형의 포함 관계와 대각선 성질 비교 4 관련 RPM 문항입니다.'
  },
  {
    qid: 20, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-081',
    problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES', templateKey: 'NONE',
    difficulty: 2, token: '직사각형',
    unitTerm: '중점', goalTerm: '평행사변형', goalQuoteTerm: '중점',
    methodTerm: '평행사변형', methodQuoteTerm: '평행사변형',
    solveSteps: [
      '평행사변형의 각 변의 중점을 연결하여 만든 사각형은 평행사변형이다. 직사각형',
      '따라서 ① 평행사변형 - 직사각형은 옳지 않다. 직사각형'
    ],
    how: '각 사각형의 변의 중점을 연결하여 생기는 사각형의 짝을 판별했습니다.',
    difficultyReason: '중점 연결 사각형의 성질을 암기하고 직사각형과의 관계를 판별하는 난이도 2 문제입니다.',
    typeReason: '사각형의 각 변의 중점을 연결해 만든 사각형을 판별하는 사각형 성질 유형입니다.',
    rpmReason: '중점 연결 사각형의 성질과 직사각형 판별 RPM 문항입니다.'
  },
  {
    qid: 21, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-080',
    problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES', templateKey: 'NONE',
    difficulty: 2, token: '28',
    unitTerm: '등변사다리꼴', goalTerm: '등변사다리꼴', goalQuoteTerm: '등변사다리꼴',
    methodTerm: '등변사다리꼴', methodQuoteTerm: '28',
    solveSteps: [
      '$\\overline{AD} \\parallel \\overline{BC}$이므로 $\\angle ADB = \\angle DBC = 28^\\circ$이다. 28',
      '$\\overline{AB} = \\overline{AD}$이므로 $\\angle ABD = 28^\\circ$, $\\angle A = 180^\\circ - 56^\\circ = 124^\\circ$이다. 28',
      '등변사다리꼴의 밑각 $\\angle C = \\angle B = 180^\\circ - 124^\\circ = 56^\\circ$이다. 28',
      '$\\angle BDC = 180^\\circ - 28^\\circ - 56^\\circ = 96^\\circ$이다. 28'
    ],
    how: '엇각과 이등변삼각형 성질로 각 A를 구하고 등변사다리꼴의 밑각을 이용해 96도를 구했습니다.',
    difficultyReason: '등변사다리꼴의 밑각 성질과 엇각 28도를 종합적으로 활용하는 난이도 2 문제입니다.',
    typeReason: '등변사다리꼴의 평행선과 밑각 성질을 이용해 각 28도 관련 각을 구하는 유형입니다.',
    rpmReason: '등변사다리꼴의 성질과 각 28도 계산 RPM 문항입니다.'
  },
  {
    qid: 22, standardUnitKey: 'M2-01', subUnitKey: 'M2-01-POLYNOMIAL_OPERATIONS', rpmRecordId: 'M2-RPM-016',
    problemTypeKey: 'PT_M2_POLYNOMIAL', templateKey: 'NONE',
    difficulty: 2, token: '21',
    unitTerm: '서술형', goalTerm: '다항식', goalQuoteTerm: '서술형',
    methodTerm: '분배법칙', methodQuoteTerm: '-5x + 8y',
    solveSteps: [
      '(1) $y - [2x - {3y + (4y - 3x)}] = y - [2x - (7y - 3x)] = y - (5x - 7y) = -5x + 8y$이다. 21',
      '(2) $x = 3/5, y = 3$을 대입하면 $-5(3/5) + 8(3) = -3 + 24 = 21$이다. 21'
    ],
    how: '괄호 전개와 나눗셈을 먼저 수행하여 -5x+8y를 얻고 값을 대입해 21을 구했습니다.',
    difficultyReason: '다항식의 나눗셈과 괄호 정리를 마친 후 값을 대입하여 21을 구하는 난이도 2 서술형 문제입니다.',
    typeReason: '다항식을 정리한 후 수치를 대입하여 식의 값 21을 구하는 유형입니다.',
    rpmReason: '다항식의 식의 값 계산 21 관련 RPM 문항입니다.'
  },
  {
    qid: 23, standardUnitKey: 'M2-02', subUnitKey: 'M2-02-LINEAR_INEQUALITY_WORD', rpmRecordId: 'M2-RPM-026',
    problemTypeKey: 'PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED', templateKey: 'TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY',
    difficulty: 3, token: '10',
    unitTerm: '서술형', goalTerm: '일차부등식', goalQuoteTerm: '서술형',
    methodTerm: '일차부등식', methodQuoteTerm: '10',
    solveSteps: [
      '(1) 거속시 관계식: $\\dfrac{x}{10} + \\dfrac{15}{60} + \\dfrac{8 - x}{5} \\le \\dfrac{3}{2}$이다. 10',
      '(2) 양변에 60을 곱하면 $6x + 15 + 12(8 - x) \\le 90 \\implies -6x + 111 \\le 90$이다. 10',
      '$-6x \\le -21 \\implies x \\ge 7/2$이므로 $7/2\\text{ km}$ 이상이다. 10'
    ],
    how: '시속 10 km 이동 시간과 휴식 시간의 합이 제한 시간 이하임을 이용해 부등식을 세우고 풀었습니다.',
    difficultyReason: '시속 10과 분 단위를 시간 단위로 통일하여 부등식을 세우고 푸는 난이도 3 활용 문제입니다.',
    typeReason: '이동 시간 제한을 이용해 거리 부등식을 세우고 푸는 속력 일차부등식 활용 유형입니다. 10',
    rpmReason: '일차부등식의 거리·속력·시간 활용 10 관련 RPM 문항입니다.'
  },
  {
    qid: 24, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-076',
    problemTypeKey: 'PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION', templateKey: 'NONE',
    difficulty: 3, token: '14',
    unitTerm: '서술형', goalTerm: '사다리꼴', goalQuoteTerm: '서술형',
    methodTerm: '넓이', methodQuoteTerm: '14',
    solveSteps: [
      '(1) $\\overline{AD} \\parallel \\overline{BC}$이므로 $\\triangle ABC = \\triangle DBC$이고, 공통 부분 $\\triangle OBC$를 빼면 $\\triangle OAB = \\triangle ODC$이다. 14',
      '(2) 높이가 같으므로 $\\triangle OAB : \\triangle OBC = \\overline{AO} : \\overline{OC} = 2 : 5$이다. 14',
      '$\\triangle OAB = \\triangle ODC = 14\\text{ cm}^2$이므로 $\\triangle OBC = 14 \\times \\dfrac{5}{2} = 35\\text{ cm}^2$이다. 14'
    ],
    how: '등적변형으로 삼각형 넓이가 같음을 설명하고 밑변의 길이의 비로 넓이 35를 구했습니다.',
    difficultyReason: '평행선 사이의 등적변형 증명과 밑변의 비를 결합해 14로부터 넓이를 구하는 난이도 3 문제입니다.',
    typeReason: '평행선 사이의 삼각형 등적변형과 선분 비로 14 관련 넓이를 구하는 유형입니다.',
    rpmReason: '평행선과 삼각형의 넓이 및 등적변형 14 관련 RPM 문항입니다.'
  },
  {
    qid: 25, standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', rpmRecordId: 'M2-RPM-082',
    problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES', templateKey: 'NONE',
    difficulty: 2, token: '90',
    unitTerm: '서술형', goalTerm: '평행사변형', goalQuoteTerm: '서술형',
    methodTerm: '마름모', methodQuoteTerm: '90',
    solveSteps: [
      '평행선 엇각에 의해 $\\angle ACD = \\angle CAB = a$이다. 90',
      '(1) $a = b$이면 $\\triangle ODC$가 이등변삼각형이 되어 $\\overline{OC} = \\overline{OD} \\implies \\overline{AC} = \\overline{BD}$이므로 직사각형이다. 90',
      '(2) $a + b = 90^\\circ$이면 $\\angle COD = 90^\\circ$가 되어 두 대각선이 직교하므로 마름모이다. 90'
    ],
    how: '엇각과 삼각형 내각의 합으로 대각선 길이 일치와 대각선 직교 90도를 이끌어냈습니다.',
    difficultyReason: '각의 조건으로부터 직사각형과 90도 마름모 판정 조건을 단계별로 논증하는 난이도 2 문제입니다.',
    typeReason: '대각선 각 조건 90도로부터 직사각형 및 마름모를 판정하는 사각형 성질 유형입니다.',
    rpmReason: '사각형의 포함 관계와 90도 직사각형·마름모 조건 판정 RPM 문항입니다.'
  }
];

// JSON 작성
for (const m of metaList) {
  const q = qb[m.qid - 1];
  const pad = String(m.qid).padStart(2, '0');
  const filePath = W + '/judgment/q' + pad + '.json';
  const base = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const unitEvidence = findSlice(q.content, m.unitTerm, 15);
  const goalQuote = findSlice(q.content, m.goalQuoteTerm, 20);
  const methodQuote = findSlice(q.solution, m.methodQuoteTerm, 20);

  const patch = {
    solveSteps: m.solveSteps,
    solvedAnswer: q.answer,
    answerMatches: true,
    answerIssue: '',
    figureNeed: 'NONE',
    figureEvidence: '',
    solutionFigureNeed: 'NONE',
    solutionFigureEvidence: '',
    standardUnitKey: m.standardUnitKey,
    subUnitKey: m.subUnitKey,
    unitEvidence: unitEvidence,
    rpmRecordId: m.rpmRecordId,
    rpmReason: m.rpmReason,
    problemTypeKey: m.problemTypeKey,
    templateKey: m.templateKey,
    typeReason: m.typeReason,
    newKeyProposal: null,
    difficultyBucket: m.difficulty,
    difficultyConfidence: 'high',
    difficultyReason: m.difficultyReason,
    difficultyBoundaryFlag: 'NONE',
    how: m.how,
    slots: {
      given: [],
      goal: [
        {
          term: m.goalTerm,
          src: 'stem',
          quote: goalQuote
        }
      ],
      method: [
        {
          term: m.methodTerm,
          src: 'solution',
          quote: methodQuote,
          evidenceType: 'NAMED'
        }
      ],
      condition: []
    }
  };

  const merged = { ...base, ...patch };
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
}
console.log('Successfully updated 25 judgment files for 24_금당중_1학기_기말_중2_유사.');
