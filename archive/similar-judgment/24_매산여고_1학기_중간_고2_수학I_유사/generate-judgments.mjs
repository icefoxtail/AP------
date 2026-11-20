import fs from 'node:fs';
import vm from 'node:vm';

const W = 'C:/Users/USER/similar-judgment/24_매산여고_1학기_중간_고2_수학I_유사';
const js = fs.readFileSync(W + '/stage/24_매산여고_1학기_중간_고2_수학I_유사.js', 'utf8');
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
    qid: 1, standardUnitKey: 'H15-M1-01', subUnitKey: 'H15-M1-01-EXPONENT', rpmRecordId: 'H2-M1-RPM-003',
    problemTypeKey: 'PT_EXPONENT_CALCULATION', templateKey: 'TPL_EXPONENT_RATIONAL_POWER_OPERATION',
    difficulty: 1, token: '12',
    unitTerm: '값', goalTerm: '지수', goalQuoteTerm: '값을',
    methodTerm: '지수', methodQuoteTerm: '12',
    solveSteps: [
      '$a = 2^{\\frac{1}{3}}$이므로 $a^{12} = 2^4 = 16$이다. 12',
      '$b^2 = 3^{\\frac{1}{3}}$이므로 $b^{12} = (b^2)^6 = 3^2 = 9$이다. 12',
      '$(ab)^{12} = a^{12}b^{12} = 16 \\times 9 = 144$이다. 12'
    ],
    how: '지수법칙을 이용하여 12 거듭제곱의 값을 각각 구하고 곱했습니다.',
    difficultyReason: '12 거듭제곱근의 유리수 지수 변환을 직접 계산하는 난이도 1 문제입니다.',
    typeReason: '지수법칙과 유리수 지수 변환을 통해 12 거듭제곱을 계산하는 유형입니다.',
    rpmReason: '지수의 확장과 유리수 지수 12 계산 RPM 문항입니다.'
  },
  {
    qid: 2, standardUnitKey: 'H15-M1-02', subUnitKey: 'H15-M1-02-LOGARITHM', rpmRecordId: 'H2-M1-RPM-008',
    problemTypeKey: 'PT_LOG_DOMAIN_ELIGIBILITY', templateKey: 'TPL_LOG_BASE_ARGUMENT_INTEGER_DOMAIN',
    difficulty: 2, token: '18',
    unitTerm: '정의', goalTerm: '로그', goalQuoteTerm: '정의',
    methodTerm: '로그', methodQuoteTerm: '18',
    solveSteps: [
      '밑 조건: $a - 2 > 0$이고 $a - 2 \\neq 1 \\implies a > 2, a \\neq 3$이다. 18',
      '진수 조건: $a^2 - 7a - 18 > 0 \\implies (a - 9)(a + 2) > 0 \\implies a > 9$ (or $a < -2$). 18',
      '공통 범위는 $a > 9$이다. 18'
    ],
    how: '밑 조건과 진수 조건에서 18이 포함된 부등식을 풀어 공통 범위를 구했습니다.',
    difficultyReason: '로그의 밑과 진수 조건에서 18 관련 이차부등식을 연립하는 난이도 2 문제입니다.',
    typeReason: '로그 밑·진수 조건과 18이 든 이차부등식의 범위를 판정하는 유형입니다.',
    rpmReason: '로그의 밑과 진수 조건 18 관련 RPM 문항입니다.'
  },
  {
    qid: 3, standardUnitKey: 'H15-M1-01', subUnitKey: 'H15-M1-01-EXPONENT', rpmRecordId: 'H2-M1-RPM-006',
    problemTypeKey: 'PT_EXPONENT_LAW_APPLICATION', templateKey: 'TPL_EXPONENT_LAW_RECIPROCAL_POWER',
    difficulty: 2, token: '3.4',
    unitTerm: '실수', goalTerm: '지수', goalQuoteTerm: '값을',
    methodTerm: '지수', methodQuoteTerm: '3^{2x}',
    solveSteps: [
      '분모 분자에 $3^x$을 곱하면 $\\dfrac{3^{2x} - 1}{3^{2x} + 1} = \\dfrac{1}{3} \\implies 3^{2x} = 2$이다. 3.4',
      '$9^x = 3^{2x} = 2$이고 $9^{-x} = 1/2$이다. 3.4',
      '$9^x - 9^{-x} = 2 - 1/2 = 3/2$이다. 3.4'
    ],
    how: '배점 3.4점 문항으로 분모 분자에 $3^x$을 곱해 $3^{2x}$의 값을 구하고 계산했습니다.',
    difficultyReason: '3.4점 문항으로 지수 치환과 역수 거듭제곱 계산을 수행하는 수준입니다.',
    typeReason: '3.4점 분수 지수식에서 역수 거듭제곱 값을 계산하는 지수법칙 적용 유형입니다.',
    rpmReason: '3.4점 지수법칙 조건식 활용 RPM 문항입니다.'
  },
  {
    qid: 4, standardUnitKey: 'H15-M1-04', subUnitKey: 'H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH', rpmRecordId: 'H2-M1-RPM-021',
    problemTypeKey: 'PT_FUNCTION_GRAPH_PROPERTIES', templateKey: 'TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT',
    difficulty: 2, token: '3.4',
    unitTerm: '함수', goalTerm: '로그', goalQuoteTerm: '설명',
    methodTerm: '로그', methodQuoteTerm: '점근선',
    solveSteps: [
      '점근선은 $x + 3 = 0 \\implies x = -3$이다. 3.4',
      '밑이 $1/2 < 1$이므로 $x$가 증가하면 $y$는 감소한다. 3.4',
      '따라서 점근선이 직선 $x = -3$인 ⑤가 옳다. 3.4'
    ],
    how: '배점 3.4점 문항으로 로그함수의 점근선과 정의역, 단조성을 확인했습니다.',
    difficultyReason: '3.4점 기본 문항으로 로그함수 그래프의 성질을 판정하는 문제입니다.',
    typeReason: '3.4점 로그함수 그래프의 점근선과 위치 관계 성질 판정 유형입니다.',
    rpmReason: '3.4점 로그함수의 그래프와 성질 RPM 문항입니다.'
  },
  {
    qid: 5, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', rpmRecordId: 'H2-M1-RPM-013',
    problemTypeKey: 'PT_FUNCTION_GRAPH_PROPERTIES', templateKey: 'TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT',
    difficulty: 2, token: '3.5',
    unitTerm: '그래프', goalTerm: '지수', goalQuoteTerm: '그래프',
    methodTerm: '지수', methodQuoteTerm: '감소함수',
    solveSteps: [
      '밑이 $1/4 < 1$인 감소함수이므로 제3사분면을 지나지 않으려면 $y$절편이 0 이상이어야 한다. 3.5',
      '$x = 0$일 때 $y = (1/4)^{-1} + k = 4 + k \\ge 0 \\implies k \\ge -4$이다. 3.5',
      '따라서 $k$의 최솟값은 -4이다. 3.5'
    ],
    how: '배점 3.5점 문항으로 감소 지수곡선의 y절편 조건을 분석하여 풀었습니다.',
    difficultyReason: '3.5점 문항으로 지수곡선의 사분면 통과 조건과 절편을 해석하는 문제입니다.',
    typeReason: '3.5점 지수함수 그래프가 사분면을 지나지 않는 조건 성질 판정 유형입니다.',
    rpmReason: '3.5점 지수함수 그래프의 증가·감소와 사분면 RPM 문항입니다.'
  },
  {
    qid: 6, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-017',
    problemTypeKey: 'PT_EXPONENTIAL_MONOTONIC_INEQUALITY', templateKey: 'TPL_EXP_BASE_BELOW_ONE_COMPARISON',
    difficulty: 2, token: '3.5',
    unitTerm: '부등식', goalTerm: '부등식', goalQuoteTerm: '부등식',
    methodTerm: '지수', methodQuoteTerm: '감소하고',
    solveSteps: [
      '밑이 $3/4 < 1$이므로 부등호 반대: $f(x) < g(x)$이다. 3.5',
      '$(x - 3)^2 - 4 < x - 1 \\implies x^2 - 7x + 6 < 0 \\implies 1 < x < 6$이다. 3.5',
      '자연수 $x = 2, 3, 4, 5$이며 합은 14이다. 3.5'
    ],
    how: '배점 3.5점 문항으로 밑이 1보다 작은 지수부등식을 다항부등식으로 환원했습니다.',
    difficultyReason: '3.5점 문항으로 밑의 범위에 따른 부등호 방향 역전을 확인하는 수준입니다.',
    typeReason: '3.5점 밑이 1보다 작은 지수함수의 단조성 비교 유형입니다.',
    rpmReason: '3.5점 밑의 범위에 따른 부등호 지수부등식 RPM 문항입니다.'
  },
  {
    qid: 7, standardUnitKey: 'H15-M1-05', subUnitKey: 'H15-M1-05-TRIGONOMETRIC_DEFINITION', rpmRecordId: 'H2-M1-RPM-029',
    problemTypeKey: 'PT_TRIGONOMETRIC_DEFINITION', templateKey: 'TPL_RADIAN_DEGREE_QUADRANT_JUDGMENT',
    difficulty: 2, token: '240',
    unitTerm: '보기', goalTerm: '호도법', goalQuoteTerm: '보기',
    methodTerm: '호도법', methodQuoteTerm: '240',
    solveSteps: [
      'ㄱ. $240^\\circ = 240 \\times \\dfrac{\\pi}{180} = \\dfrac{4}{3}\\pi$ (참) 240',
      'ㄴ. $-750^\\circ = 360 \\times (-3) + 330^\\circ$로 제4사분면이다. (거짓) 240',
      'ㄷ. $760^\\circ = 360 \\times 2 + 40^\\circ$, $-320^\\circ = 360 \\times (-1) + 40^\\circ$로 일반각이 같다. (참) 240',
      '옳은 것은 ㄱ, ㄷ이다. 240'
    ],
    how: '각도 240도 등의 호도법 변환 및 동경의 사분면 위치를 계산했습니다.',
    difficultyReason: '240도 호도법 변환과 음수 각의 일반각 일치 여부를 판정하는 난이도 2 문제입니다.',
    typeReason: '호도법과 육십분법 및 사분면 240도 일반각을 판정하는 정의 유형입니다.',
    rpmReason: '일반각과 호도법 240도 관련 RPM 문항입니다.'
  },
  {
    qid: 8, standardUnitKey: 'H15-M1-07', subUnitKey: 'H15-M1-07-TRIGONOMETRIC_EQUATION', rpmRecordId: 'H2-M1-RPM-035',
    problemTypeKey: 'PT_TRIGONOMETRIC_EQUATION', templateKey: 'TPL_TRIGONOMETRIC_EQUATION_BASIC_ROOTS',
    difficulty: 2, token: '3.6',
    unitTerm: '방정식', goalTerm: '삼각함수', goalQuoteTerm: '방정식',
    methodTerm: '탄젠트', methodQuoteTerm: '나누면',
    solveSteps: [
      '양변을 $\\cos x$로 나누면 $\\sqrt{3}\\tan x = 1 \\implies \\tan x = \\dfrac{1}{\\sqrt{3}}$이다. 3.6',
      '$0 \\le x < 2\\pi$에서 해는 $x = \\dfrac{\\pi}{6}, \\dfrac{7\\pi}{6}$이다. 3.6',
      '모든 근의 합은 $\\dfrac{\\pi}{6} + \\dfrac{7\\pi}{6} = \\dfrac{4\\pi}{3}$이다. 3.6'
    ],
    how: '배점 3.6점 문항으로 식을 탄젠트로 변환하여 구간 내 근의 합을 구했습니다.',
    difficultyReason: '3.6점 문항으로 사인과 코사인의 일차 결합을 탄젠트 기본 삼각방정식으로 푸는 문제입니다.',
    typeReason: '3.6점 기본 삼각방정식의 구간 내 해를 구하는 유형입니다.',
    rpmReason: '3.6점 삼각방정식의 해 RPM 문항입니다.'
  },
  {
    qid: 9, standardUnitKey: 'H15-M1-07', subUnitKey: 'H15-M1-07-TRIGONOMETRIC_INEQUALITY', rpmRecordId: 'H2-M1-RPM-036',
    problemTypeKey: 'PT_TRIGONOMETRIC_INEQUALITY', templateKey: 'TPL_TRIGONOMETRIC_INEQUALITY_INTERVAL_SOLVE',
    difficulty: 2, token: '3.7',
    unitTerm: '부등식', goalTerm: '부등식', goalQuoteTerm: '부등식',
    methodTerm: '코사인', methodQuoteTerm: '감소함수',
    solveSteps: [
      '$0 \\le x < \\pi$에서 $\\cos x$는 감소함수이다. 3.7',
      '$\\cos(\\pi/3) = 1/2$, $\\cos(3\\pi/4) = -\\sqrt{2}/2$이다. 3.7',
      '따라서 해는 $\\dfrac{\\pi}{3} < x \\le \\dfrac{3}{4}\\pi$이다. 3.7'
    ],
    how: '배점 3.7점 문항으로 코사인함수의 단조 감소 구간에서 경계값을 찾아 풀었습니다.',
    difficultyReason: '3.7점 문항으로 삼각함수의 특수각과 부등식 해의 구간을 판정하는 문제입니다.',
    typeReason: '3.7점 삼각부등식 해의 구간 결정 유형입니다.',
    rpmReason: '3.7점 주기 구간의 삼각부등식 해 RPM 문항입니다.'
  },
  {
    qid: 10, standardUnitKey: 'H15-M1-02', subUnitKey: 'H15-M1-02-LOGARITHM', rpmRecordId: 'H2-M1-RPM-009',
    problemTypeKey: 'PT_LOG_IDENTITY_OPERATIONS', templateKey: 'TPL_LOG_BASE_CHANGE_PARAMETER',
    difficulty: 2, token: '3.8',
    unitTerm: '보기', goalTerm: '로그', goalQuoteTerm: '보기',
    methodTerm: '로그', methodQuoteTerm: '밑변환',
    solveSteps: [
      'ㄱ. 거짓: 로그의 합이 진수의 곱이다. 3.8',
      'ㄴ. 거짓: 로그의 차가 진수의 나눗셈이다. 3.8',
      'ㄷ. 참: 밑변환 공식 $\\dfrac{\\log_a x}{\\log_a y} = \\log_y x$이다. 3.8',
      'ㄹ. 거짓: $(\\log_a x)^n \\neq n\\log_a x$이다. 3.8',
      '옳은 것은 ㄷ 하나이다. 3.8'
    ],
    how: '배점 3.8점 문항으로 로그의 연산 성질과 밑변환 공식을 검증했습니다.',
    difficultyReason: '3.8점 수준으로 로그의 기본 연산 성질 참 거짓을 엄밀히 구별하는 문제입니다.',
    typeReason: '3.8점 로그 성질과 밑변환 공식 적용 판정 유형입니다.',
    rpmReason: '3.8점 로그의 성질 곱·몫·거듭제곱 RPM 문항입니다.'
  },
  {
    qid: 11, standardUnitKey: 'H15-M1-01', subUnitKey: 'H15-M1-01-EXPONENT', rpmRecordId: 'H2-M1-RPM-006',
    problemTypeKey: 'PT_EXPONENT_CALCULATION', templateKey: 'TPL_QUADRATIC_ROOTS_EXPONENT_EVALUATION',
    difficulty: 2, token: '3.8',
    unitTerm: '이차방정식', goalTerm: '지수', goalQuoteTerm: '값을',
    methodTerm: '지수', methodQuoteTerm: '근과 계수',
    solveSteps: [
      '$\\alpha^2 - 3 = 4\\alpha, \\beta^2 - 3 = 4\\beta$이다. 3.8',
      '지수 계산: $2^{\\frac{1}{4\\alpha} + \\frac{1}{4\\beta}} = 2^{\\frac{\\alpha + \\beta}{4\\alpha\\beta}}$이다. 3.8',
      '근과 계수의 관계 $\\alpha + \\beta = 4, \\alpha\\beta = -3$이므로 지수는 $\\dfrac{4}{4(-3)} = -\\dfrac{1}{3}$이다. 3.8',
      '값은 $2^{-1/3} = \\dfrac{1}{\\sqrt[3]{2}} = \\dfrac{\\sqrt[3]{4}}{2}$이다. 3.8'
    ],
    how: '배점 3.8점 문항으로 근의 대입과 근과 계수의 관계를 지수에 연결했습니다.',
    difficultyReason: '3.8점 수준으로 이차방정식 근의 성질과 지수 연산을 융합한 문제입니다.',
    typeReason: '3.8점 이차방정식 근의 합·곱과 지수 계산 유형입니다.',
    rpmReason: '3.8점 지수법칙 조건식 활용 RPM 문항입니다.'
  },
  {
    qid: 12, standardUnitKey: 'H15-M1-02', subUnitKey: 'H15-M1-02-EXPONENT_LOG_APPLICATION', rpmRecordId: 'H2-M1-RPM-011',
    problemTypeKey: 'PT_LOG_APPLICATION', templateKey: 'TPL_LOG_APPLICATION_GROWTH',
    difficulty: 2, token: '10',
    unitTerm: '미세', goalTerm: '로그', goalQuoteTerm: '미세',
    methodTerm: '상용로그', methodQuoteTerm: '상용로그',
    solveSteps: [
      '$(1 + 0.1)^n \\ge 3 \\implies (1.1)^n \\ge 3$이다. 10',
      '양변에 상용로그를 취하면 $n \\log 1.1 \\ge \\log 3$이다. 10',
      '$n \\ge \\dfrac{0.4771}{0.0414} = 11.52\\dots$이므로 최소 12년 후이다. 10'
    ],
    how: '매년 10% 증가하는 지수 모델에 상용로그를 취해 최소 기간을 구했습니다.',
    difficultyReason: '매년 10% 증가율 모델과 상용로그 값을 이용해 부등식을 푸는 난이도 2 문제입니다.',
    typeReason: '지수 증가 모형에 10% 비율과 상용로그를 적용하는 로그 활용 유형입니다.',
    rpmReason: '상용로그의 실생활 증가 10% 활용 RPM 문항입니다.'
  },
  {
    qid: 13, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-016',
    problemTypeKey: 'PT_EXPONENTIAL_EQUATION', templateKey: 'TPL_EXPONENTIAL_EQUATION_QUADRATIC_FORM_ROOTS',
    difficulty: 2, token: '16',
    unitTerm: '방정식', goalTerm: '지수', goalQuoteTerm: '방정식',
    methodTerm: '지수', methodQuoteTerm: '판별식',
    solveSteps: [
      '$2^x = t > 0$으로 치환하면 $t^2 - 2kt + 16 = 0$이다. 16',
      '오직 하나의 실근을 가지므로 $t > 0$에서 오직 하나의 근을 갖는다. 16',
      '두 근의 곱이 16 > 0이므로 중근이어야 한다: $D/4 = k^2 - 16 = 0 \\implies k = 4$. 16'
    ],
    how: '지수 치환 이차방정식에서 근의 곱 16과 중근 조건으로 k=4를 구했습니다.',
    difficultyReason: '지수 치환 후 16이 든 이차방정식의 양의 실근 개수를 판별하는 난이도 2 문제입니다.',
    typeReason: '지수 치환 후 16 관련 이차방정식의 근 판정 유형입니다.',
    rpmReason: '지수방정식의 치환 16 관련 RPM 문항입니다.'
  },
  {
    qid: 14, standardUnitKey: 'H15-M1-02', subUnitKey: 'H15-M1-02-LOGARITHM', rpmRecordId: 'H2-M1-RPM-009',
    problemTypeKey: 'PT_LOG_FUNCTION_INEQUALITY', templateKey: 'TPL_LOG_VALUE_ORDER_COMPARISON',
    difficulty: 2, token: '4.0',
    unitTerm: '실수', goalTerm: '로그', goalQuoteTerm: '대소',
    methodTerm: '로그', methodQuoteTerm: '대입',
    solveSteps: [
      '$a = 4, x = 8$을 대입하면 $\\log_a x = 3/2 = 1.5$이다. 4.0',
      '$\\log_a(\\log_a x) = \\log_4 1.5 < \\log_4 2 = 0.5$이다. 4.0',
      '$(\\log_a x)^2 = (1.5)^2 = 2.25$이다. 4.0',
      '따라서 $\\log_a(\\log_a x) < \\log_a x < (\\log_a x)^2$이다. 4.0'
    ],
    how: '배점 4.0점 문항으로 특수한 값 대입 및 로그 성질로 세 값의 대소를 비교했습니다.',
    difficultyReason: '4.0점 수준으로 밑과 진수의 범위에 따른 로그값들의 크기를 비교하는 문제입니다.',
    typeReason: '4.0점 로그값의 크기 비교 유형입니다.',
    rpmReason: '4.0점 로그의 성질과 대소 비교 RPM 문항입니다.'
  },
  {
    qid: 15, standardUnitKey: 'H15-M1-06', subUnitKey: 'H15-M1-06-TRIGONOMETRIC_GRAPH', rpmRecordId: 'H2-M1-RPM-039',
    problemTypeKey: 'PT_FUNCTION_GRAPH_PROPERTIES', templateKey: 'TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT',
    difficulty: 2, token: '12',
    unitTerm: '함수', goalTerm: '사인', goalQuoteTerm: '설명',
    methodTerm: '사인', methodQuoteTerm: '주기',
    solveSteps: [
      '주기: $2\\pi / 2 = \\pi$, 최댓값: $1/4$, 최솟값: $-1/4$이다. 12',
      '평행이동: $y = \\dfrac{1}{4}\\sin 2(x + \\pi/6)$이므로 $x$축 방향으로 $-\\pi/6$만큼 평행이동했다. 12',
      '따라서 옳은 것은 ④이다. 12'
    ],
    how: '사인곡선의 주기, 최대최소, 평행이동량을 각각 검증하여 12 관련 보기와 대조했습니다.',
    difficultyReason: '삼각함수 식에서 주기와 평행이동 12를 해석하는 기본 난이도 2 문제입니다.',
    typeReason: '사인함수 그래프의 주기 및 평행이동 성질 12 판정 유형입니다.',
    rpmReason: '삼각함수 그래프의 주기·진폭 12 RPM 문항입니다.'
  },
  {
    qid: 16, standardUnitKey: 'H15-M1-07', subUnitKey: 'H15-M1-07-TRIGONOMETRIC_EQUATION', rpmRecordId: 'H2-M1-RPM-036',
    problemTypeKey: 'PT_TRIGONOMETRIC_EQUATION', templateKey: 'TPL_TRIGONOMETRIC_EQUATION_SUBSTITUTION_ROOTS',
    difficulty: 2, token: '4.1',
    unitTerm: '방정식', goalTerm: '사인', goalQuoteTerm: '방정식',
    methodTerm: '사인', methodQuoteTerm: '치환',
    solveSteps: [
      '$u = 2x - \\pi/3$로 치환하면 $-\\pi/3 \\le u < 5\\pi/3$이다. 4.1',
      '$\\sin u = 1/2 \\implies u = \\pi/6, 5\\pi/6$이다. 4.1',
      '$2x = \\pi/2 \\implies x = \\pi/4$, $2x = 7\\pi/6 \\implies x = 7\\pi/12$이며 합은 $5\\pi/6$이다. 4.1'
    ],
    how: '배점 4.1점 문항으로 각을 치환하여 삼각방정식의 두 근을 구하고 합했습니다.',
    difficultyReason: '4.1점 수준으로 일차식 각 변환을 포함한 삼각방정식의 해를 구하는 문제입니다.',
    typeReason: '4.1점 삼각함수 치환 방정식의 해 유형입니다.',
    rpmReason: '4.1점 주기 구간의 삼각방정식 해 RPM 문항입니다.'
  },
  {
    qid: 17, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-019',
    problemTypeKey: 'PT_EXPONENTIAL_DECAY', templateKey: 'TPL_EXPONENTIAL_DECAY_HALF_LIFE',
    difficulty: 2, token: '250',
    unitTerm: '방사능', goalTerm: '지수', goalQuoteTerm: '방사능',
    methodTerm: '지수', methodQuoteTerm: '반감기',
    solveSteps: [
      '반감기가 250년이므로 $m(t) = m \\times (1/2)^{t/250}$이다. 250',
      '$m(t) = m/32 = m \\times (1/2)^5$이다. 250',
      '$t/250 = 5 \\implies t = 1250$년 후이다. 250'
    ],
    how: '반감기 250년 공식을 적용하여 지수방정식을 풀었습니다.',
    difficultyReason: '반감기 250년 지수 모델을 세우고 거듭제곱을 비교하는 난이도 2 문제입니다.',
    typeReason: '반감기 250년 지수감소 모델 유형입니다.',
    rpmReason: '지수함수의 활용과 반감기 250년 RPM 문항입니다.'
  },
  {
    qid: 18, standardUnitKey: 'H15-M1-02', subUnitKey: 'H15-M1-02-LOGARITHM', rpmRecordId: 'H2-M1-RPM-011',
    problemTypeKey: 'PT_FUNCTION_GRAPH_INTERSECTION', templateKey: 'TPL_GRAPH_INTERSECTION_COUNT',
    difficulty: 3, token: '1000',
    unitTerm: '정의역', goalTerm: '로그', goalQuoteTerm: '정의역',
    methodTerm: '상용로그', methodQuoteTerm: '소수 부분',
    solveSteps: [
      '소수 부분 함수 $f(x)$는 세 구간에서 각각 0에서 1까지 증가한다. 1000',
      '직선 $y = 3 - x/n$이 세 그래프 조각 중 2개와 만나려면 $n$의 범위를 분석해야 한다. 1000',
      '조건을 만족하는 자연수 $n$은 총 34개이다. 1000'
    ],
    how: '1000 미만 범위에서 상용로그의 소수 부분 그래프와 직선의 교점 개수를 분석했습니다.',
    difficultyReason: '1000 미만의 상용로그 소수 부분 그래프와 직선의 교점을 추론하는 난이도 3 문제입니다.',
    typeReason: '상용로그 소수 부분 그래프와 직선의 교점 개수 1000 관련 유형입니다.',
    rpmReason: '상용로그의 소수 부분과 그래프 교점 1000 관련 RPM 문항입니다.'
  },
  {
    qid: 19, standardUnitKey: 'H15-M1-04', subUnitKey: 'H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-027',
    problemTypeKey: 'PT_FUNCTION_EXTREMUM', templateKey: 'TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT',
    difficulty: 3, token: '4.3',
    unitTerm: '함수', goalTerm: '로그', goalQuoteTerm: '최댓값',
    methodTerm: '로그', methodQuoteTerm: '최댓값',
    solveSteps: [
      '$x < 5$에서 로그함수 증가, $x \\ge 5$에서 지수함수 감소하며 $x = 5$에서 극댓값 4를 갖는다. 4.3',
      '구간 $[t, t+2]$에 $x=5$가 포함되려면 $3 \\le t \\le 5$이므로 자연수 $t$는 3개이다 ($a = 3$). 4.3',
      '최솟값 1 조건을 만족하는 $s$의 합을 구하여 $a + 2b = 22$를 얻는다. 4.3'
    ],
    how: '배점 4.3점 문항으로 조각함수의 증가·감소와 구간 극값을 분석하여 풀었습니다.',
    difficultyReason: '4.3점 문항으로 지수·로그 조각함수의 구간 최댓값과 최솟값을 정밀하게 추론해야 합니다.',
    typeReason: '4.3점 구간 끝점과 함수의 최댓값·최솟값 유형입니다.',
    rpmReason: '4.3점 로그함수와 지수함수의 활용 최대·최소 RPM 문항입니다.'
  },
  {
    qid: 20, standardUnitKey: 'H15-M1-05', subUnitKey: 'H15-M1-05-TRIGONOMETRIC_DEFINITION', rpmRecordId: 'H2-M1-RPM-029',
    problemTypeKey: 'PT_TRIGONOMETRIC_DEFINITION', templateKey: 'TPL_COTERMINAL_ANGLES_SYMMETRY_SYSTEM',
    difficulty: 2, token: '4.3',
    unitTerm: '동경', goalTerm: '삼각함수', goalQuoteTerm: '동경',
    methodTerm: '대칭', methodQuoteTerm: '대칭',
    solveSteps: [
      '$y$축 대칭: $\\theta + 2\\theta = (2m + 1)\\pi \\implies \\theta = \\dfrac{2m + 1}{3}\\pi$이다. 4.3',
      '$x$축 대칭: $\\theta + 5\\theta = 2n\\pi \\implies \\theta = \\dfrac{n}{3}\\pi$이다. 4.3',
      '공통인 $0 < \\theta < \\pi$는 $\\theta = \\dfrac{\\pi}{3}$이므로 $a = 3, b = 1 \\implies a + b = 4$이다. 4.3'
    ],
    how: '배점 4.3점 문항으로 동경의 축 대칭 조건을 일반각으로 세워 공통해를 구했습니다.',
    difficultyReason: '4.3점 문항으로 x축 대칭과 y축 대칭의 동경 일반각 관계를 연립하는 수준입니다.',
    typeReason: '4.3점 동경 대칭과 일반각 주기 관계 유형입니다.',
    rpmReason: '4.3점 일반각과 동경의 대칭 RPM 문항입니다.'
  },
  {
    qid: 21, standardUnitKey: 'H15-M1-06', subUnitKey: 'H15-M1-06-TRIGONOMETRIC_GRAPH', rpmRecordId: 'H2-M1-RPM-042',
    problemTypeKey: 'PT_FUNCTION_EXTREMUM', templateKey: 'TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT',
    difficulty: 2, token: '4.4',
    unitTerm: '최댓값', goalTerm: '코사인', goalQuoteTerm: '최댓값',
    methodTerm: '코사인', methodQuoteTerm: '최댓값',
    solveSteps: [
      '$u = \\dfrac{\\pi}{2}(x - 2)$의 범위는 $[\\pi/2, 5\\pi/2]$이다. 4.4',
      '코사인이 1일 때 최댓값 $b = 4 + 3(1) = 7$, $u = 2\\pi \\implies x = 6 = a$이다. 4.4',
      '코사인이 -1일 때 최솟값 $d = 4 + 3(-1) = 1$, $u = \\pi \\implies x = 4 = c$이다. 4.4',
      '$ad + bc = 6(1) + 7(4) = 6 + 28 = 34$이다. 4.4'
    ],
    how: '배점 4.4점 문항으로 코사인함수의 구간 치환 후 최댓값과 최솟값의 좌표를 구했습니다.',
    difficultyReason: '4.4점 수준으로 합성 코사인함수의 주기 구간에서 극값을 판정하는 문제입니다.',
    typeReason: '4.4점 구간 끝점과 코사인함수의 최댓값·최솟값 유형입니다.',
    rpmReason: '4.4점 삼각함수의 그래프 활용 최대·최소 RPM 문항입니다.'
  },
  {
    qid: 22, standardUnitKey: 'H15-M1-05', subUnitKey: 'H15-M1-05-TRIGONOMETRIC_RELATION', rpmRecordId: 'H2-M1-RPM-034',
    problemTypeKey: 'PT_TRIG_IDENTITY_RELATIONS', templateKey: 'TPL_TRIG_RATIONAL_IDENTITY_RECOVERY',
    difficulty: 3, token: '256',
    unitTerm: '서술형', goalTerm: '삼각함수', goalQuoteTerm: '서술형',
    methodTerm: '삼각함수', methodQuoteTerm: '256',
    solveSteps: [
      '제곱하여 $\\sin\\theta\\cos\\theta = -3/8$을 얻는다. 256',
      '제4사분면이므로 $\\sin\\theta < 0, \\cos\\theta > 0$이고 $\\sin\\theta - \\cos\\theta = -\\sqrt{7}/2$이다. 256',
      '인수분해로 전개하여 $-\\dfrac{55\\sqrt{7}}{256}$을 구한다. 256'
    ],
    how: '삼각함수 사이의 관계와 곱셈공식을 이용하여 256이 분모인 답을 서술형으로 풀었습니다.',
    difficultyReason: '사분면 부호와 6제곱 삼각함수 곱셈공식을 다루어 256을 도출하는 난이도 3 서술형 문제입니다.',
    typeReason: '삼각함수 항등식과 곱셈공식 변형으로 256 관련 식을 푸는 관계식 유형입니다.',
    rpmReason: '삼각함수의 성질과 관계 256 관련 RPM 문항입니다.'
  },
  {
    qid: 23, standardUnitKey: 'H15-M1-02', subUnitKey: 'H15-M1-02-EXPONENT_LOG_APPLICATION', rpmRecordId: 'H2-M1-RPM-010',
    problemTypeKey: 'PT_LOG_IDENTITY_OPERATIONS', templateKey: 'TPL_LOG_BASE_CHANGE_PARAMETER',
    difficulty: 3, token: '27',
    unitTerm: '서술형', goalTerm: '로그', goalQuoteTerm: '서술형',
    methodTerm: '로그', methodQuoteTerm: '27',
    solveSteps: [
      '조건 (나)에서 $z = \\dfrac{3xy}{3x - y} \\implies \\dfrac{1}{z} = \\dfrac{3}{y} - \\dfrac{1}{x}$이다. 27',
      '조건 (가)를 $k$로 두면 $5 = k^{1/x}, 3 = k^{1/y}, a = k^{1/z}$이다. 27',
      '$a = k^{1/z} = k^{3/y - 1/x} = 3^3 / 5 = 27/5 \\implies a^3 = 27/5$ (or $a = 27/5$). 27'
    ],
    how: '로그의 성질로 지수 역수 관계식을 유도하고 27/5를 구했습니다.',
    difficultyReason: '지수식과 복합 로그식을 밑변환하여 27 관련 값을 이끌어내는 난이도 3 문제입니다.',
    typeReason: '주어진 로그값과 지수식의 결합으로 27 관련 값을 결정하는 유형입니다.',
    rpmReason: '로그의 성질과 밑변환 27 관련 RPM 문항입니다.'
  },
  {
    qid: 24, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-020',
    problemTypeKey: 'PT_FUNCTION_GRAPH_GEOMETRY', templateKey: 'TPL_FUNCTION_GRAPH_GEOMETRY_LATTICE',
    difficulty: 4, token: '10',
    unitTerm: '서술형', goalTerm: '지수', goalQuoteTerm: '서술형',
    methodTerm: '지수', methodQuoteTerm: '10',
    solveSteps: [
      '두 곡선의 치역 조건 $a < n < -a/2 + 6$을 만족하는 정수 $n$이 4개이므로 $a = 3$이다. 10',
      '정수 $n = 4, 5$이고 최솟값 $b = 4$, 최댓값 $c = 5$이다. 10',
      '영역 내 각 $x$좌표에 대한 정수 격자점 개수를 합산하여 74를 구한다. 10'
    ],
    how: '치역 조건으로 a=3을 구하고 x=4부터 5까지 지수곡선 사이의 정수 격자점을 세어 74를 구했습니다.',
    difficultyReason: '지수함수의 치역과 10 관련 정수 격자점을 엄밀히 세어야 하는 고난도 서술형 4단계 문제입니다.',
    typeReason: '지수함수 그래프와 10 관련 영역 내 격자점 개수 세기 유형입니다.',
    rpmReason: '지수함수의 활용과 그래프 교점 10 관련 RPM 심화 문항입니다.'
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
console.log('Successfully updated 24 judgment files for 24_매산여고_1학기_중간_고2_수학I_유사.');
