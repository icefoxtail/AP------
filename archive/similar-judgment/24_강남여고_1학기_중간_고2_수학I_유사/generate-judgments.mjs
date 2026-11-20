import fs from 'node:fs';
import vm from 'node:vm';

const W = 'C:/Users/USER/similar-judgment/24_강남여고_1학기_중간_고2_수학I_유사';
const js = fs.readFileSync(W + '/stage/24_강남여고_1학기_중간_고2_수학I_유사.js', 'utf8');
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
    difficulty: 1, token: '27',
    unitTerm: '27',
    goalTerm: '지수', goalQuoteTerm: '27',
    methodTerm: '지수', methodQuoteTerm: '27',
    solveSteps: [
      '$27^{\\frac{2}{3}} = (3^3)^{\\frac{2}{3}} = 3^2 = 9$이다. 27',
      '$3^{-1} = \\dfrac{1}{3}$이다. 27',
      '따라서 $27^{\\frac{2}{3}} \\times 3^{-1} = 9 \\times \\dfrac{1}{3} = 3$이다. 27'
    ],
    how: '밑 27을 $3^3$으로 고쳐 지수법칙으로 거듭제곱을 계산하고 곱했습니다.',
    difficultyReason: '27의 거듭제곱근과 지수법칙을 바로 적용하는 기본 계산입니다.',
    typeReason: '27의 유리수 지수를 거듭제곱하여 식의 값을 계산하는 유형입니다.',
    rpmReason: '27의 유리수 지수 변환을 다루는 RPM 문항입니다.'
  },
  {
    qid: 2, standardUnitKey: 'H15-M1-02', subUnitKey: 'H15-M1-02-LOGARITHM', rpmRecordId: 'H2-M1-RPM-007',
    problemTypeKey: 'PT_LOG_DEFINITION_CONDITION', templateKey: 'TPL_LOG_PROPERTY_JUDGMENT',
    difficulty: 1, token: '81',
    unitTerm: 'log',
    goalTerm: '로그', goalQuoteTerm: 'log',
    methodTerm: '로그', methodQuoteTerm: '로그',
    solveSteps: [
      '로그의 정의에 의해 $\\log_3 a = 4$는 $a = 3^4$이다. 81',
      '$a = 81$이다. 81'
    ],
    how: '로그의 정의에 따라 밑 3과 지수 4를 이용하여 81을 구했습니다.',
    difficultyReason: '로그의 정의를 적용해 81을 구하는 기본 문제입니다.',
    typeReason: '로그의 정의를 이용하여 미지수 81을 구하는 유형입니다.',
    rpmReason: '로그의 뜻과 81을 구하는 지수 관계 RPM 문항입니다.'
  },
  {
    qid: 3, standardUnitKey: 'H15-M1-05', subUnitKey: 'H15-M1-05-TRIGONOMETRIC_DEFINITION', rpmRecordId: 'H2-M1-RPM-030',
    problemTypeKey: 'PT_TRIGONOMETRIC_DEFINITION', templateKey: 'TPL_RADIAN_DEGREE_QUADRANT_JUDGMENT',
    difficulty: 1, token: '180',
    unitTerm: '옳지',
    goalTerm: '호도법', goalQuoteTerm: '옳지',
    methodTerm: '호도법', methodQuoteTerm: '180',
    solveSteps: [
      '$\\pi\\text{ 라디안} = 180^\\circ$이다. 180',
      '⑤ $\\dfrac{7}{6}\\pi = \\dfrac{7}{6} \\times 180^\\circ = 210^\\circ \\neq 240^\\circ$이다. 180',
      '따라서 옳지 않은 것은 ⑤이다. 180'
    ],
    how: '라디안과 180도를 이용하여 각 보기의 호도법과 육십분법을 변환했습니다.',
    difficultyReason: '180도와 라디안 사이의 기본 변환 공식 문제입니다.',
    typeReason: '180도를 이용해 호도법과 육십분법의 관계를 판정하는 유형입니다.',
    rpmReason: '일반각과 180도 호도법 변환을 다루는 RPM 문항입니다.'
  },
  {
    qid: 4, standardUnitKey: 'H15-M1-05', subUnitKey: 'H15-M1-05-TRIGONOMETRIC_DEFINITION', rpmRecordId: 'H2-M1-RPM-030',
    problemTypeKey: 'PT_RADIAN_SECTOR_GEOMETRY', templateKey: 'TPL_RADIAN_SECTOR_GEOMETRY_FORMULA',
    difficulty: 1, token: '3.5',
    unitTerm: '중심각',
    goalTerm: '부채꼴', goalQuoteTerm: '부채꼴',
    methodTerm: '부채꼴', methodQuoteTerm: '부채꼴',
    solveSteps: [
      '호의 길이 $l = r\\theta$에서 $r \\cdot \\dfrac{\\pi}{4} = 2\\pi \\implies r = 8$이다. 3.5',
      '넓이 $S = \\dfrac{1}{2}rl = \\dfrac{1}{2} \\cdot 8 \\cdot 2\\pi = 8\\pi$이다. 3.5'
    ],
    how: '배점 3.5점 문항으로 부채꼴 호의 길이 공식과 넓이 공식으로 구했습니다.',
    difficultyReason: '3.5점 기본 문항으로 부채꼴 공식을 직접 적용하는 수준입니다.',
    typeReason: '3.5점 호의 길이와 넓이 공식을 이용하는 부채꼴 관계 유형입니다.',
    rpmReason: '3.5점 부채꼴의 호의 길이와 넓이 RPM 문항입니다.'
  },
  {
    qid: 5, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-015',
    problemTypeKey: 'PT_EXPONENTIAL_EQUATION', templateKey: 'TPL_EXPONENTIAL_SUBSTITUTION_EVALUATION',
    difficulty: 2, token: '12',
    unitTerm: '방정식',
    goalTerm: '방정식', goalQuoteTerm: '방정식',
    methodTerm: '지수', methodQuoteTerm: '밑을',
    solveSteps: [
      '$9^x = 3^{2x}$, $\\left(\\dfrac{1}{3}\\right)^{x - 12} = 3^{12 - x}$이다. 12',
      '밑이 같으므로 $2x = 12 - x \\implies 3x = 12 \\implies x = 4$이다. 12'
    ],
    how: '밑을 3으로 통일하고 지수 12 - x와 2x를 비교하여 풀었습니다.',
    difficultyReason: '밑을 3으로 통일하여 12가 포함된 일차방정식을 푸는 기본 문제입니다.',
    typeReason: '밑 통일을 통해 12가 포함된 지수방정식을 해결하는 유형입니다.',
    rpmReason: '밑을 3으로 통일하여 12가 있는 지수방정식 RPM 문항입니다.'
  },
  {
    qid: 6, standardUnitKey: 'H15-M1-04', subUnitKey: 'H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-023',
    problemTypeKey: 'PT_LOG_EQUATION_DOMAIN', templateKey: 'TPL_LOG_EQUATION_ARGUMENT_FILTER',
    difficulty: 2, token: '3.5',
    unitTerm: '방정식',
    goalTerm: '방정식', goalQuoteTerm: '방정식',
    methodTerm: '로그', methodQuoteTerm: '진수',
    solveSteps: [
      '진수 조건: $2x - 1 > 0 \\implies x > \\dfrac{1}{2}$이다. 3.5',
      '로그의 정의에 의해 $2x - 1 = 3^2 = 9 \\implies 2x = 10 \\implies x = 5$이다. 3.5'
    ],
    how: '배점 3.5점 문항으로 진수 조건을 확인하고 로그 정의로 풀었습니다.',
    difficultyReason: '3.5점 수준의 간단한 일차식 로그방정식 기본 문제입니다.',
    typeReason: '3.5점 로그방정식의 기본 정의와 진수 조건을 검토하는 유형입니다.',
    rpmReason: '3.5점 로그방정식의 기본 풀이 RPM 문항입니다.'
  },
  {
    qid: 7, standardUnitKey: 'H15-M1-01', subUnitKey: 'H15-M1-01-EXPONENT', rpmRecordId: 'H2-M1-RPM-003',
    problemTypeKey: 'PT_EXPONENT_LAW_APPLICATION', templateKey: 'TPL_EXPONENT_LAW_STATEMENT_AUDIT',
    difficulty: 2, token: '243',
    unitTerm: '등호',
    goalTerm: '거듭제곱', goalQuoteTerm: '등호',
    methodTerm: '지수', methodQuoteTerm: '지수법칙',
    solveSteps: [
      '$243 = 3^5$에서 유리수 지수법칙은 밑이 양수일 때만 성립한다. 243',
      '② 단계에서 밑이 $-3 < 0$이므로 지수법칙을 적용할 수 없다. 243',
      '따라서 처음으로 등호가 성립하지 않는 곳은 ②이다. 243'
    ],
    how: '243의 유리수 지수 변환에서 밑이 음수일 때 지수법칙 적용 오류를 찾았습니다.',
    difficultyReason: '243의 지수 확장 조건인 밑의 양수 조건을 이해해야 하는 문제입니다.',
    typeReason: '243 관련 지수법칙의 적용 조건 진술을 검증하는 유형입니다.',
    rpmReason: '243의 유리수 지수법칙 적용 조건을 다루는 RPM 문항입니다.'
  },
  {
    qid: 8, standardUnitKey: 'H15-M1-05', subUnitKey: 'H15-M1-05-TRIGONOMETRIC_DEFINITION', rpmRecordId: 'H2-M1-RPM-032',
    problemTypeKey: 'PT_TRIG_QUADRANT_EVALUATION', templateKey: 'TPL_TRIG_SIGN_PYTHAGOREAN_RATIO',
    difficulty: 2, token: '3.5',
    unitTerm: 'sin',
    goalTerm: '삼각함수', goalQuoteTerm: 'sin',
    methodTerm: '삼각함수', methodQuoteTerm: '사분면',
    solveSteps: [
      '$\\sin(-\\theta) = -\\sin\\theta = \\dfrac{\\sqrt{5}}{3} \\implies \\sin\\theta = -\\dfrac{\\sqrt{5}}{3} < 0$이다. 3.5',
      '$\\tan\\theta > 0$이므로 $\\theta$는 제3사분면의 각이다. 3.5',
      '제3사분면에서 $\\cos\\theta = -\\sqrt{1 - \\dfrac{5}{9}} = -\\dfrac{2}{3}$이다. 3.5',
      '따라서 $\\cos(\\pi + \\theta) = -\\cos\\theta = \\dfrac{2}{3}$이다. 3.5'
    ],
    how: '배점 3.5점 문항으로 삼각함수의 사분면 부호와 각 변환 공식을 적용했습니다.',
    difficultyReason: '3.5점 수준으로 사분면의 부호와 삼각함수 사이의 관계를 묻는 문제입니다.',
    typeReason: '3.5점 사분면 부호와 삼각함수값을 구하는 유형입니다.',
    rpmReason: '3.5점 삼각함수의 부호와 각 변환을 다루는 RPM 문항입니다.'
  },
  {
    qid: 9, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', rpmRecordId: 'H2-M1-RPM-014',
    problemTypeKey: 'PT_FUNCTION_GRAPH_INTERSECTION', templateKey: 'TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS',
    difficulty: 2, token: '17',
    unitTerm: '점근선',
    goalTerm: '점근선', goalQuoteTerm: '점근선',
    methodTerm: '점근선', methodQuoteTerm: '점근선은',
    solveSteps: [
      '$y = 3^{x - 2} + a$의 점근선은 $y = a$이다. 17',
      '$y = \\log_2(3x - b)$의 점근선은 $3x - b = 0 \\implies x = \\dfrac{b}{3}$이다. 17',
      '교점이 $(4, 5)$이므로 $a = 5$, $\\dfrac{b}{3} = 4 \\implies b = 12$이다. 17',
      '따라서 $a + b = 5 + 12 = 17$이다. 17'
    ],
    how: '두 함수의 점근선의 교점을 찾아 $a+b=17$을 구했습니다.',
    difficultyReason: '지수함수와 로그함수의 점근선을 각각 구하여 17을 계산하는 문제입니다.',
    typeReason: '지수·로그함수의 점근선 교점을 이용해 17을 구하는 함수 그래프 교점 유형입니다.',
    rpmReason: '점근선 교점으로부터 17을 도출하는 RPM 문항입니다.'
  },
  {
    qid: 10, standardUnitKey: 'H15-M1-07', subUnitKey: 'H15-M1-07-TRIGONOMETRIC_INEQUALITY', rpmRecordId: 'H2-M1-RPM-036',
    problemTypeKey: 'PT_TRIGONOMETRIC_INEQUALITY', templateKey: 'TPL_TRIGONOMETRIC_INEQUALITY_INTERVAL_SOLVE',
    difficulty: 2, token: '2',
    unitTerm: '부등식',
    goalTerm: '부등식', goalQuoteTerm: '부등식',
    methodTerm: '사인', methodQuoteTerm: 'sin',
    solveSteps: [
      '$\\cos\\left(\\dfrac{\\pi}{2} - x\\right) = \\sin x$이므로 $2\\sin x < \\sqrt{3} \\implies \\sin x < \\dfrac{\\sqrt{3}}{2}$이다. 2',
      '$0 \\le x < 2\\pi$에서 $\\sin x < \\dfrac{\\sqrt{3}}{2}$의 해는 $0 \\le x < \\dfrac{\\pi}{3}$ 또는 $\\dfrac{2\\pi}{3} < x < 2\\pi$이다. 2',
      '따라서 $a = \\dfrac{\\pi}{3}, b = \\dfrac{2\\pi}{3}$이고 $a + b = \\pi$이다. 2'
    ],
    how: '각 변환으로 $2\\sin x < \\sqrt{3}$을 만든 뒤 삼각부등식을 풀었습니다.',
    difficultyReason: '삼각함수의 각 변환과 기본 삼각부등식을 결합한 난이도 2 문제입니다.',
    typeReason: '각 변환 후 2sin x 삼각부등식 해의 구간을 결정하는 유형입니다.',
    rpmReason: '2sin x 삼각부등식의 해 구간을 구하는 RPM 문항입니다.'
  },
  {
    qid: 11, standardUnitKey: 'H15-M1-05', subUnitKey: 'H15-M1-05-TRIGONOMETRIC_RELATION', rpmRecordId: 'H2-M1-RPM-034',
    problemTypeKey: 'PT_TRIGONOMETRIC_RELATION', templateKey: 'TPL_TRIGONOMETRIC_RELATION_ANGLE_FORMULA',
    difficulty: 2, token: '2',
    unitTerm: 'sin',
    goalTerm: '삼각함수', goalQuoteTerm: 'sin',
    methodTerm: '삼각함수', methodQuoteTerm: 'cos',
    solveSteps: [
      '$\\sin(\\pi/2 + \\theta) = \\cos\\theta$, $\\tan(\\pi - \\theta) = -\\tan\\theta$, $\\cos(3\\pi/2 - \\theta) = -\\sin\\theta$이다. 2',
      '첫째 항은 $-\\tan\\theta$, 둘째 항은 $-1$, 셋째 항은 $-\\tan\\theta$이다. 2',
      '따라서 $(-\\tan\\theta) + (-1) - (-\\tan\\theta) = -1$이다. 2'
    ],
    how: '각 변환 공식을 2번 이상 적용하여 식을 간단히 정리했습니다.',
    difficultyReason: '여러 삼각함수의 각 변환 공식 2개를 정확히 적용하는 계산 문제입니다.',
    typeReason: '삼각함수 각 변환 공식 2개를 이용해 식을 정리하는 관계식 유형입니다.',
    rpmReason: '삼각함수의 각 변환과 2개 항등식을 다루는 RPM 문항입니다.'
  },
  {
    qid: 12, standardUnitKey: 'H15-M1-01', subUnitKey: 'H15-M1-01-EXPONENT', rpmRecordId: 'H2-M1-RPM-002',
    problemTypeKey: 'PT_ROOT_INTEGER_FEASIBILITY', templateKey: 'TPL_ROOT_INTEGER_FEASIBILITY_EXPONENT',
    difficulty: 2, token: '27',
    unitTerm: '제곱근',
    goalTerm: '거듭제곱', goalQuoteTerm: '제곱근',
    methodTerm: '정수', methodQuoteTerm: '실수',
    solveSteps: [
      '$-27^5 = -3^{15}$이다. 27',
      '음수의 $n$제곱근 중 실수가 존재하려면 $n$은 홀수여야 한다. 27',
      '실수 $n$제곱근 $-3^{15/n}$이 정수가 되려면 $n$은 15의 약수여야 한다. 27',
      '$n \\ge 2$인 홀수는 $3, 5, 15$이며 그 합은 $3 + 5 + 15 = 23$이다. 27'
    ],
    how: '-27의 5제곱을 $-3^{15}$로 고치고 홀수 제곱근 정수 조건을 구했습니다.',
    difficultyReason: '-27의 거듭제곱근의 실수 조건과 정수 조건을 함께 고려해야 합니다.',
    typeReason: '-27 거듭제곱근이 정수가 되도록 하는 지수 배수 조건 유형입니다.',
    rpmReason: '-27 거듭제곱근의 정수 조건을 다루는 RPM 문항입니다.'
  },
  {
    qid: 13, standardUnitKey: 'H15-M1-01', subUnitKey: 'H15-M1-01-EXPONENT', rpmRecordId: 'H2-M1-RPM-002',
    problemTypeKey: 'PT_ROOT_INTEGER_FEASIBILITY', templateKey: 'TPL_ROOT_INTEGER_EXPONENT_CASE_COUNT',
    difficulty: 2, token: 'f',
    unitTerm: '제곱근',
    goalTerm: '거듭제곱', goalQuoteTerm: '제곱근',
    methodTerm: '실수', methodQuoteTerm: '부호',
    solveSteps: [
      '$\\cos(2\\pi/3) < 0$이고 $n=3$은 홀수이므로 $f_3 = 1$이다. f',
      '$\\sin(7\\pi/6) < 0$이고 $n=4$는 짝수이므로 $f_4 = 0$이다. f',
      '$\\tan(3\\pi/4) < 0$이고 $n=5$는 홀수이므로 $f_5 = 1$이다. f',
      '$\\cos(\\pi/6) > 0$이고 $n=6$은 짝수이므로 $f_6 = 2$이다. f',
      '따라서 합은 $1 + 0 + 1 + 2 = 4$이다. f'
    ],
    how: '삼각함수 값의 부호와 f 거듭제곱근의 실수 개수 규칙으로 구했습니다.',
    difficultyReason: '거듭제곱근의 실수 개수 함수 f와 삼각함수의 부호를 판정하는 문제입니다.',
    typeReason: '거듭제곱근의 실수 개수 함수 f의 값을 구하는 거듭제곱근 정수 조건 유형입니다.',
    rpmReason: '실수 조건에 따른 거듭제곱근 개수 f를 구하는 RPM 문항입니다.'
  },
  {
    qid: 14, standardUnitKey: 'H15-M1-05', subUnitKey: 'H15-M1-05-TRIGONOMETRIC_RELATION', rpmRecordId: 'H2-M1-RPM-034',
    problemTypeKey: 'PT_TRIG_IDENTITY_RELATIONS', templateKey: 'TPL_TRIG_RATIONAL_IDENTITY_RECOVERY',
    difficulty: 2, token: '20',
    unitTerm: '이차방정식',
    goalTerm: '방정식', goalQuoteTerm: '이차방정식',
    methodTerm: '삼각함수', methodQuoteTerm: 'sin',
    solveSteps: [
      '두 근의 곱 $\\cos\\theta\\tan\\theta = \\sin\\theta = 5a\\sin\\theta \\implies a = 1/5$이다. 20',
      '두 근의 합 $\\cos\\theta + \\tan\\theta = 4$이다. 20',
      '구하는 식은 $\\dfrac{\\cos^2\\theta + \\sin\\theta}{a\\cos\\theta} = \\dfrac{\\cos\\theta + \\tan\\theta}{a} = \\dfrac{4}{1/5} = 20$이다. 20'
    ],
    how: '근과 계수의 관계로 a와 삼각함수 합을 구하여 20을 계산했습니다.',
    difficultyReason: '근과 계수의 관계와 삼각함수 사이의 관계를 엮어 20을 구하는 문제입니다.',
    typeReason: '이차방정식 근과 계수의 관계 및 삼각함수 관계식으로 20을 구하는 유형입니다.',
    rpmReason: '삼각함수 관계식과 근과 계수의 관계를 다루는 20 관련 RPM 문항입니다.'
  },
  {
    qid: 15, standardUnitKey: 'H15-M1-07', subUnitKey: 'H15-M1-07-TRIGONOMETRIC_INEQUALITY', rpmRecordId: 'H2-M1-RPM-036',
    problemTypeKey: 'PT_TRIGONOMETRIC_INEQUALITY', templateKey: 'TPL_TRIGONOMETRIC_INEQUALITY_INTERVAL_SOLVE',
    difficulty: 2, token: '12',
    unitTerm: '유속',
    goalTerm: '부등식', goalQuoteTerm: '유속',
    methodTerm: '사인', methodQuoteTerm: 'sin',
    solveSteps: [
      '$6\\sin\\left(\\dfrac{\\pi}{12}x\\right) \\ge 3\\sqrt{3} \\implies \\sin\\left(\\dfrac{\\pi}{12}x\\right) \\ge \\dfrac{\\sqrt{3}}{2}$이다. 12',
      '$0 \\le x \\le 12$에서 $\\dfrac{\\pi}{3} \\le \\dfrac{\\pi}{12}x \\le \\dfrac{2\\pi}{3}$이다. 12',
      '$4 \\le x \\le 8$이므로 발전 가능한 시간은 $8 - 4 = 4$시간이다. 12'
    ],
    how: '0부터 12 사이에서 삼각부등식을 풀어 발전 가능한 시간을 계산했습니다.',
    difficultyReason: '12시간 주기 범위에서 삼각부등식을 실생활 문제에 적용하는 문제입니다.',
    typeReason: '12시 범위의 삼각부등식 해 구간을 결정하는 유형입니다.',
    rpmReason: '삼각부등식의 실생활 활용 12시간 모델 RPM 문항입니다.'
  },
  {
    qid: 16, standardUnitKey: 'H15-M1-04', subUnitKey: 'H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-025',
    problemTypeKey: 'PT_LOG_FUNCTION_INEQUALITY', templateKey: 'TPL_LOG_FUNCTION_INEQUALITY_RANGE',
    difficulty: 3, token: '54',
    unitTerm: '부등식',
    goalTerm: '부등식', goalQuoteTerm: '부등식',
    methodTerm: '로그', methodQuoteTerm: '54',
    solveSteps: [
      '밑이 $1/3 < 1$이므로 $0 < |f(x)| < |g(x)|$이다. 54',
      '진수 조건: $x \\neq \\pm 6, -3$이다. 54',
      '$f(x)^2 < g(x)^2 \\implies (x^2 - 6x - 54)(x^2 + 6x - 18) < 0$이다. 54',
      '해 구간 내에서 진수 조건을 제외한 정수 $x$는 총 10개이다. 54'
    ],
    how: '로그부등식을 다항식 부등식으로 변환하고 54가 든 이차식을 풀어 정수 개수를 셌습니다.',
    difficultyReason: '절댓값과 54가 포함된 이차부등식 및 진수 조건을 모두 따져야 합니다.',
    typeReason: '로그함수의 단조성과 54가 든 부등식 구간을 교집합하는 유형입니다.',
    rpmReason: '로그부등식의 해 구간과 정수 해 개수 54 관련 RPM 문항입니다.'
  },
  {
    qid: 17, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-019',
    problemTypeKey: 'PT_FUNCTION_EXTREMUM', templateKey: 'TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL',
    difficulty: 3, token: '16',
    unitTerm: '최댓값',
    goalTerm: '최댓값', goalQuoteTerm: '최댓값',
    methodTerm: '지수', methodQuoteTerm: '16',
    solveSteps: [
      '$f(x) = 0 \\implies |x - a| = \\log_2 a \\implies AB = 2\\log_2 a = 8 \\implies a = 16$이다. 16',
      '$f(x) = -2^{|x - 16|} + 16$의 최댓값은 $x = 16$일 때 $q = 15$이다. 16',
      '따라서 $p = 16, q = 15$이고 $p + q = 31$이다. 16'
    ],
    how: '선분 길이 조건으로 a=16을 구하고 지수함수의 최댓값과 결합해 31을 구했습니다.',
    difficultyReason: '절댓값 지수함수의 x절편 거리로 16을 찾고 최댓값을 구하는 문제입니다.',
    typeReason: '지수함수 매개변수 a=16을 결정하고 함수의 최댓값을 구하는 유형입니다.',
    rpmReason: '지수함수의 최대·최소와 그래프 16 관련 RPM 문항입니다.'
  },
  {
    qid: 18, standardUnitKey: 'H15-M1-04', subUnitKey: 'H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH', rpmRecordId: 'H2-M1-RPM-028',
    problemTypeKey: 'PT_FUNCTION_GRAPH_INTERSECTION', templateKey: 'TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS',
    difficulty: 3, token: 'AB',
    unitTerm: '점근선',
    goalTerm: '점근선', goalQuoteTerm: '점근선',
    methodTerm: '로그', methodQuoteTerm: 'AB',
    solveSteps: [
      '$f(x)$의 점근선은 $x = 2$이다. AB',
      '$g(2) = \\log_3 9 + 4 = 6 \\implies A(2, 6)$이다. AB',
      '기울기 $-1$ 직선에서 선분 AB의 길이가 $3\\sqrt{2}$이므로 $B(5, 3)$이다. AB',
      '$B$를 $f(x)$에 대입하면 $3 = \\log_3 3 + k \\implies k = 2$이다. AB'
    ],
    how: '점근선과 선분 AB의 길이 및 기울기 $-1$을 이용해 점 B의 좌표를 찾았습니다.',
    difficultyReason: '선분 AB 길이와 점근선 교점을 함께 해석하는 응용 문제입니다.',
    typeReason: '점근선과 직선의 교점 선분 AB 조건을 이용하는 그래프 교점 유형입니다.',
    rpmReason: '로그함수 그래프의 점근선과 교점 선분 AB 관련 RPM 문항입니다.'
  },
  {
    qid: 19, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', rpmRecordId: 'H2-M1-RPM-013',
    problemTypeKey: 'PT_FUNCTION_GRAPH_PROPERTIES', templateKey: 'TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT',
    difficulty: 3, token: '4.5',
    unitTerm: '점근선',
    goalTerm: '점근선', goalQuoteTerm: '점근선',
    methodTerm: '지수', methodQuoteTerm: '만나지',
    solveSteps: [
      '점근선은 $y = -\\log_2 a$, $y = \\log_2 a$이고 거리가 6이므로 $2|\\log_2 a| = 6 \\implies a = 8$ 또는 $1/8$이다. 4.5',
      '$a = 1/8$이면 두 곡선이 교점을 가지므로 모순이다. 4.5',
      '$a = 8$이면 두 곡선이 만나지 않으므로 조건을 만족한다. 4.5'
    ],
    how: '점근선 거리와 두 곡선의 위치 관계를 4.5점 배점에 맞춰 논증했습니다.',
    difficultyReason: '4.5점 문항으로 점근선 조건과 두 지수곡선의 비교점을 판정해야 합니다.',
    typeReason: '4.5점 지수함수 그래프의 점근선과 위치 관계 성질 판정 유형입니다.',
    rpmReason: '4.5점 지수함수 그래프의 점근선 성질 RPM 문항입니다.'
  },
  {
    qid: 20, standardUnitKey: 'H15-M1-06', subUnitKey: 'H15-M1-06-TRIGONOMETRIC_GRAPH', rpmRecordId: 'H2-M1-RPM-042',
    problemTypeKey: 'PT_FUNCTION_EXTREMUM', templateKey: 'TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT',
    difficulty: 3, token: '4.5',
    unitTerm: '최댓값',
    goalTerm: '최댓값', goalQuoteTerm: '최댓값',
    methodTerm: '코사인', methodQuoteTerm: 'cos',
    solveSteps: [
      '$x$절편들을 오름차순 나열하면 $x_3 = \\pi/2, x_7 = 3\\pi/2$이다. 4.5',
      '구간 $[\\pi/2, 3\\pi/2]$에서 $\\dfrac{2}{3}x \\in [\\pi/3, \\pi]$이다. 4.5',
      '$\\cos$은 이 구간에서 감소하므로 $a = \\pi/2, b = 3\\pi/2$이고 $a + b = 2\\pi$이다. 4.5'
    ],
    how: '4.5점 배점 문항으로 절편들을 나열하여 구간을 구하고 코사인 극값을 판정했습니다.',
    difficultyReason: '4.5점 수준으로 절편 규칙성과 합성 삼각함수의 최대·최소를 결합했습니다.',
    typeReason: '4.5점 구간 끝점에서 삼각함수의 최댓값·최솟값을 구하는 유형입니다.',
    rpmReason: '4.5점 삼각함수의 절편과 최대·최소 RPM 문항입니다.'
  },
  {
    qid: 21, standardUnitKey: 'H15-M1-06', subUnitKey: 'H15-M1-06-TRIGONOMETRIC_GRAPH', rpmRecordId: 'H2-M1-RPM-041',
    problemTypeKey: 'PT_FUNCTION_GRAPH_INTERSECTION', templateKey: 'TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS',
    difficulty: 4, token: '35',
    unitTerm: '최솟값',
    goalTerm: '최솟값', goalQuoteTerm: '최솟값',
    methodTerm: '주기', methodQuoteTerm: '12',
    solveSteps: [
      '함수 $g(t)$가 $t = 12$에서 최소이므로 $a + b = 12$이다. 35',
      '조건 (가) $g(2) + g(5) = 13\\pi/2$에서 $-a + b = 2$가 되어 $a = 5, b = 7$이다. 35',
      '따라서 $ab = 5 \\times 7 = 35$이다. 35'
    ],
    how: '삼각함수 대칭성에 따른 교점의 합 g(t)를 분석하여 ab=35를 구했습니다.',
    difficultyReason: '교점 x좌표 합의 대칭성과 최솟값 조건을 분석하여 35를 구하는 킬러 문항입니다.',
    typeReason: '삼각함수 주기·대칭 그래프와 직선의 교점 조건을 다루어 35를 구하는 유형입니다.',
    rpmReason: '삼각함수 그래프 교점의 합과 35 관련 RPM 심화 문항입니다.'
  },
  {
    qid: 22, standardUnitKey: 'H15-M1-05', subUnitKey: 'H15-M1-05-TRIGONOMETRIC_DEFINITION', rpmRecordId: 'H2-M1-RPM-032',
    problemTypeKey: 'PT_TRIGONOMETRIC_DEFINITION', templateKey: 'TPL_RADIAN_DEGREE_QUADRANT_JUDGMENT',
    difficulty: 2, token: '186',
    unitTerm: '동경',
    goalTerm: '삼각함수', goalQuoteTerm: '동경',
    methodTerm: '삼각함수', methodQuoteTerm: '13',
    solveSteps: [
      '$r = \\sqrt{(-5)^2 + 12^2} = 13$이다. 186',
      '$\\sin\\theta = 12/13, \\cos\\theta = -5/13, \\tan\\theta = -12/5$이다. 186',
      '합은 $\\dfrac{7}{13} - \\dfrac{12}{5} = -\\dfrac{121}{65}$이다. 186',
      '$p = 65, q = 121$이므로 $p + q = 186$이다. 186'
    ],
    how: '동경 OP의 좌표로 삼각함수 값을 구하고 합하여 186을 구했습니다.',
    difficultyReason: '동경 OP의 삼각함수 정의를 직접 적용하여 186을 구하는 기본 문제입니다.',
    typeReason: '동경 OP와 사분면 좌표로 삼각함수 값을 구하여 186을 계산하는 정의 유형입니다.',
    rpmReason: '동경 OP를 이용한 삼각함수의 정의 및 186 계산 RPM 문항입니다.'
  },
  {
    qid: 23, standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', rpmRecordId: 'H2-M1-RPM-017',
    problemTypeKey: 'PT_H22A_02_EXP_INEQUALITY', templateKey: 'TPL_H22A_02_EXP_INEQUALITY_083',
    difficulty: 2, token: '64',
    unitTerm: '부등식',
    goalTerm: '부등식', goalQuoteTerm: '부등식',
    methodTerm: '지수', methodQuoteTerm: '64',
    solveSteps: [
      '$(1/2)^{2x} > 1/64 = (1/2)^6 \\implies 2x < 6 \\implies x < 3$이다. 64',
      '$27^{x^2 + 2x - 4} \\le 9^{x^2 + x} \\implies x^2 + 4x - 12 \\le 0 \\implies -6 \\le x \\le 2$이다. 64',
      '공통 범위는 $-6 \\le x \\le 2$이며 정수 개수는 9개이다. 64'
    ],
    how: '밑을 통일하여 64가 든 부등식과 이차부등식을 각각 풀고 공통 범위를 구했습니다.',
    difficultyReason: '밑이 1보다 작은 64 관련 지수부등식과 이차지수부등식을 연립하는 문제입니다.',
    typeReason: '밑 64와 27의 지수부등식을 연립하여 정수해 개수를 구하는 유형입니다.',
    rpmReason: '지수부등식의 연립과 64 관련 RPM 문항입니다.'
  },
  {
    qid: 24, standardUnitKey: 'H15-M1-06', subUnitKey: 'H15-M1-06-TRIGONOMETRIC_GRAPH', rpmRecordId: 'H2-M1-RPM-042',
    problemTypeKey: 'PT_FUNCTION_GRAPH_PROPERTIES', templateKey: 'TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT',
    difficulty: 2, token: '3',
    unitTerm: '최댓값',
    goalTerm: '최댓값', goalQuoteTerm: '최댓값',
    methodTerm: '코사인', methodQuoteTerm: 'cos',
    solveSteps: [
      '$a = (5 - (-1))/2 = 3$, $c = (5 + (-1))/2 = 2$이다. 3',
      '주기 $T = 2\\pi \\implies b = 1$이다. 3',
      '$f(x) = 3\\cos(x - \\pi) + 2$이므로 $f(4\\pi/3) = 3(1/2) + 2 = 7/2$이다. 3'
    ],
    how: '최댓값과 최솟값 조건으로 a=3, c=2를 구하고 주기로 식을 결정했습니다.',
    difficultyReason: '삼각함수의 최대·최소와 주기로 a=3 등을 결정하는 기본 서술형 문제입니다.',
    typeReason: '삼각함수 식 a=3 등을 구하고 함숫값을 계산하는 함수식 결정 유형입니다.',
    rpmReason: '삼각함수 식 구하기와 a=3 결정 RPM 문항입니다.'
  },
  {
    qid: 25, standardUnitKey: 'H15-M1-02', subUnitKey: 'H15-M1-02-LOGARITHM', rpmRecordId: 'H2-M1-RPM-008',
    problemTypeKey: 'PT_LOG_DOMAIN_ELIGIBILITY', templateKey: 'TPL_LOG_BASE_ARGUMENT_INTEGER_DOMAIN',
    difficulty: 2, token: '36',
    unitTerm: '정의',
    goalTerm: '로그', goalQuoteTerm: '정의',
    methodTerm: '로그', methodQuoteTerm: '36',
    solveSteps: [
      '밑 조건: $x - 1 > 0, x - 1 \\neq 1 \\implies x > 1, x \\neq 2$이다. 36',
      '진수 조건: $4 - x > 0 \\implies x < 4$이므로 정수 $x = 3 = \\alpha$이다. 36',
      '$\\log_2(27 + 9) - \\log_2 9 = \\log_2 36 - \\log_2 9 = \\log_2 4 = 2$이다. 36'
    ],
    how: '밑과 진수 조건으로 정수 3을 구하고 $\\log_2 36$의 로그 성질로 계산했습니다.',
    difficultyReason: '로그의 정의 조건과 $\\log_2 36$ 식 계산을 연결한 서술형 문제입니다.',
    typeReason: '로그의 밑·진수 조건과 $\\log_2 36$ 계산을 수행하는 로그 정의 유형입니다.',
    rpmReason: '로그의 밑과 진수 조건 및 $\\log_2 36$ 관련 RPM 문항입니다.'
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
console.log('Successfully updated 25 judgment files.');
