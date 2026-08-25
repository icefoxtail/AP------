import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const classificationPath = path.join(archiveDir, '_generated/intelligence/phase3/fallback-safety-audit/archive-hierarchical-classification-with-fallback-overlay-v1.json');
const coverageDir = path.join(archiveDir, '_generated/intelligence/phase3/coverage-queue');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const sequentialCuePath = path.join(archiveDir, 'data/master_tables/sequential_first_batch_candidate_cues_v1.json');
const highCuePath = path.join(archiveDir, 'data/master_tables/high_first_wave_candidate_cues_v1.json');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification');
const outputPath = path.join(outputDir, 'archive-complete-subunit-classification-v1.json');
const taxonomyPath = path.join(outputDir, 'archive-complete-subunit-taxonomy-v1.json');
const summaryPath = path.join(outputDir, 'archive-complete-subunit-classification-v1.summary.md');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const normalize = value => String(value ?? '').toLowerCase().replace(/\s+/g, '').replace(/[·ㆍ,，.。:：()（）[\]{}<>「」『』]/g, '');
const safeKey = value => String(value || 'UNMAPPED').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').toUpperCase() || 'UNMAPPED';

const MIDDLE_DEFINITIONS = {
  'M1-01': [
    ['M1-01-GCD_LCM', '최대공약수와 최소공배수', ['최대공약수', '최소공배수', '약수', '배수', '공약수', '공배수']],
    ['M1-01-PRIME_FACTORIZATION', '소인수분해', ['소인수분해', '소수', '소인수', '거듭제곱']]
  ],
  'M1-02': [
    ['M1-02-INTEGER_RATIONAL_NUMBER', '정수와 유리수의 뜻', ['수직선', '대소관계', '절댓값', '양수', '음수', '정수의 뜻']],
    ['M1-02-RATIONAL_NUMBER_OPERATIONS', '정수와 유리수의 계산', ['계산', '덧셈', '뺄셈', '곱셈', '나눗셈', '혼합계산', '유리수']]
  ],
  'M1-03': [
    ['M1-03-ALGEBRAIC_EXPRESSION', '문자의 사용과 식의 값', ['문자의 사용', '식의 값', '문자식', '대입', '식의 계산']],
    ['M1-03-LINEAR_EQUATION', '일차방정식', ['일차방정식', '방정식의 풀이', '등식의 성질', '해']],
    ['M1-03-LINEAR_EQUATION_WORD', '일차방정식의 활용', ['일차방정식의 활용', '속력', '거리', '농도', '나이', '일의 양', '개수', '활용']]
  ],
  'M1-04': [
    ['M1-04-COORDINATE_PLANE', '좌표평면', ['좌표평면', '점의 좌표', '사분면', '축 위의 점']],
    ['M1-04-GRAPH_RELATION', '그래프와 관계', ['그래프', '정비례', '반비례', '관계', '변화']]
  ],
  'M1-05': [
    ['M1-05-BASIC_FIGURE', '점·선·면과 각', ['점', '선분', '직선', '각', '작도', '맞꼭지각', '교각']],
    ['M1-05-POSITION_RELATION', '위치 관계', ['위치관계', '평행', '수직', '교점', '평행선', '동위각', '엇각']]
  ],
  'M1-06': [
    ['M1-06-PLANE_FIGURE_MEASURE', '평면도형의 측정', ['넓이', '둘레', '부채꼴', '호의 길이', '원주율']],
    ['M1-06-POLYGON_CIRCLE', '다각형과 원', ['다각형', '정다각형', '내각', '외각', '대각선', '원']]
  ],
  'M1-07': [
    ['M1-07-SOLID_FIGURE', '입체도형', ['다면체', '정다면체', '회전체', '전개도', '위치관계', '교선']],
    ['M1-07-SOLID_FIGURE_MEASURE', '입체도형의 측정', ['부피', '겉넓이', '원기둥', '원뿔', '구', '높이']]
  ],
  'M1-08': [
    ['M1-08-DATA_INTERPRETATION', '자료의 해석', ['평균', '중앙값', '최빈값', '상대도수', '그래프 해석', '자료의 해석']],
    ['M1-08-DATA_ORGANIZATION', '자료의 정리', ['도수분포표', '줄기와 잎', '히스토그램', '도수분포다각형', '도수', '자료의 정리']]
  ],
  'M2-01': [
    ['M2-01-REPEATING_DECIMAL', '유리수와 순환소수', ['순환소수', '유한소수', '유리수와 소수']],
    ['M2-01-EXPONENT_LAW', '지수법칙', ['지수법칙', '거듭제곱', '지수의 뜻']],
    ['M2-01-POLYNOMIAL_OPERATIONS', '다항식의 계산', ['다항식', '동류항', '식의 계산', '전개']]
  ],
  'M2-02': [
    ['M2-02-LINEAR_INEQUALITY', '일차부등식', ['일차부등식', '부등식의 성질', '수직선', '해']],
    ['M2-02-LINEAR_INEQUALITY_WORD', '일차부등식의 활용', ['일차부등식의 활용', '자연수 조건', '개수세기', '범위', '활용']]
  ],
  'M2-03': [
    ['M2-03-SIMULTANEOUS_LINEAR_EQUATION', '연립일차방정식', ['연립일차방정식', '연립방정식', '해의 쌍', '미지수']],
    ['M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD', '연립일차방정식의 활용', ['연립방정식의 활용', '거리', '속력', '농도', '개수', '활용']]
  ],
  'M2-04': [
    ['M2-04-LINEAR_FUNCTION_BASIC', '일차함수의 뜻과 그래프', ['일차함수', '기울기', '절편', '그래프 위의 점', '두 점을 지나는 직선']],
    ['M2-04-LINEAR_FUNCTION_EQUATION', '일차함수와 일차방정식의 관계', ['두 직선의 교점', '해의 개수', '일치', '평행', '연립방정식']]
  ],
  'M2-05': [
    ['M2-05-TRIANGLE_PROPERTIES', '삼각형의 성질', ['이등변', '직각삼각형', '합동', '내심', '외심', '무게중심', '삼각형의 내각']],
    ['M2-05-QUADRILATERAL_PROPERTIES', '사각형의 성질', ['평행사변형', '사다리꼴', '직사각형', '마름모', '정사각형', '사각형의 대각선']]
  ],
  'M2-06': [
    ['M2-06-SIMILAR_FIGURE', '도형의 닮음', ['닮음', '닮음비', '삼각형의 닮음', '닮음의 성질']],
    ['M2-06-PARALLEL_LENGTH_RATIO', '평행선 사이의 선분의 길이의 비', ['평행선', '선분의 길이의 비', '비례', '중점연결정리']]
  ],
  'M2-07': [
    ['M2-07-PYTHAGOREAN_THEOREM', '피타고라스 정리', ['피타고라스 정리', '직각삼각형', '빗변', '제곱']],
    ['M2-07-PYTHAGOREAN_APPLICATION', '피타고라스 정리의 활용', ['피타고라스 정리의 활용', '넓이', '거리', '높이', '최단거리', '활용']]
  ],
  'M2-08': [
    ['M2-08-PROBABILITY_BASIC', '확률의 뜻과 성질', ['표본공간', '사건', '확률의 뜻', '여사건', '확률의 기본 성질']],
    ['M2-08-PROBABILITY_COUNTING', '경우의 수와 확률', ['경우의 수', '나열', '선택', '분류', '경우의 수 계산', '순열', '조합']]
  ],
  'M3-01': [
    ['M3-01-SQUARE_ROOT_REAL_NUMBER', '제곱근과 실수', ['제곱근', '무리수', '실수', '정수 부분', '소수 부분']],
    ['M3-01-REAL_NUMBER_OPERATIONS', '근호를 포함한 식의 계산', ['근호', '분모의 유리화', '근호의 계산', '계산']]
  ],
  'M3-02': [['M3-02-POLYNOMIAL_MULTIPLICATION', '다항식의 곱셈', ['다항식의 곱셈', '곱셈공식', '전개', '인수분해']]],
  'M3-03': [
    ['M3-03-QUADRATIC_EQUATION', '이차방정식', ['이차방정식', '인수분해', '완전제곱', '근의 공식', '판별식', '근과 계수']],
    ['M3-03-QUADRATIC_EQUATION_WORD', '이차방정식의 활용', ['이차방정식의 활용', '넓이', '수량', '연속 정수', '속력', '변수 설정', '식 수립']]
  ],
  'M3-04': [
    ['M3-04-QUADRATIC_FUNCTION_GRAPH', '이차함수의 그래프', ['이차함수', '꼭짓점', '축', '절편', '개형', '평행이동', '계수와 그래프']],
    ['M3-04-QUADRATIC_FUNCTION_APPLICATION', '이차함수의 활용', ['이차함수의 활용', '넓이', '울타리', '수익', '높이', '실생활', '최댓값', '최솟값']]
  ],
  'M3-05': [
    ['M3-05-TRIG_RATIO', '삼각비', ['삼각비', 'sin', 'cos', 'tan', '특수각', '삼각비 표', '직각삼각형에서 비']],
    ['M3-05-TRIG_RATIO_APPLICATION', '삼각비의 활용', ['삼각비의 활용', '그림자', '높이', '거리', '경사', '앙각', '부각', '측량']]
  ],
  'M3-06': [
    ['M3-06-CIRCLE_ANGLE', '원과 각', ['원주각', '중심각', '현', '접선', '각']],
    ['M3-06-CIRCLE_PROPERTIES', '원의 성질', ['원의 성질', '접선', '접점', '현의 수직이등분선', '원주']]
  ],
  'M3-07': [
    ['M3-07-STATISTICS_REPRESENTATIVE', '대푯값과 산포도', ['평균', '중앙값', '최빈값', '분산', '표준편차', '대푯값', '산포도']],
    ['M3-07-STATISTICS_DATA_INTERPRETATION', '통계 자료 해석', ['도수분포표', '히스토그램', '상대도수', '자료 해석', '그래프', '통계 자료']]
  ]
};

const HIGH_MANUAL = {
  'H15-SA-01': [['POLYNOMIAL_BASIC', '다항식의 기본 연산', ['다항식', '항', '계수', '차수', '계산']], ['POLYNOMIAL_DIVISION', '다항식의 나눗셈', ['나눗셈', '몫', '나머지']]],
  'H15-SA-02': [['IDENTITY', '항등식과 계수비교', ['항등식', '계수비교', '미정계수']], ['REMAINDER_FACTOR', '나머지정리와 인수정리', ['나머지정리', '인수정리', '나머지']]],
  'H15-SA-13': [['QUADRATIC_GRAPH', '이차함수의 그래프', ['이차함수', '그래프', '꼭짓점', '축', '절편']], ['QUADRATIC_APPLICATION', '이차함수의 활용', ['최댓값', '최솟값', '넓이', '실생활', '범위']]],
  'H15-SB-01': [['SET_BASIC', '집합의 뜻과 표현', ['집합', '원소', '부분집합']], ['SET_OPERATION', '집합의 연산', ['교집합', '합집합', '차집합', '여집합']], ['SET_COUNT', '집합의 원소의 개수', ['원소의 개수', '포함배제', '개수']]],
  'H15-SB-02': [['PROPOSITION_BASIC', '명제와 진리집합', ['명제', '진리집합', '참', '거짓']], ['NECESSARY_SUFFICIENT', '필요조건과 충분조건', ['필요조건', '충분조건', '필요충분']], ['PROOF', '증명과 절대부등식', ['대우', '귀류법', '증명', '산술기하평균', '절대부등식']]],
  'H15-SB-03': [['FUNCTION_RELATION', '함수의 뜻과 대응', ['함수', '정의역', '치역', '대응', '일대일']], ['COMPOSITE_FUNCTION', '합성함수', ['합성함수', 'f(g(x))', '합성']], ['INVERSE_FUNCTION', '역함수', ['역함수', 'f^{-1}', '대칭']]],
  'H15-SB-04': [['RATIONAL_BASIC', '유리함수의 뜻과 계산', ['유리함수', '유리식', '부분분수']], ['RATIONAL_GRAPH', '유리함수의 그래프', ['그래프', '점근선', '대칭']], ['RATIONAL_APPLICATION', '유리함수의 활용', ['최댓값', '최솟값', '교점']]],
  'H15-SB-05': [['IRRATIONAL_BASIC', '무리함수의 뜻과 계산', ['무리함수', '무리식', '정의역']], ['IRRATIONAL_GRAPH', '무리함수의 그래프', ['그래프', '치역', '점근선']], ['IRRATIONAL_INVERSE', '무리함수와 역함수', ['역함수', '교점', '직선']]],
  'H15-SB-06': [['COUNTING_PRINCIPLE', '경우의 수의 기본 원리', ['경우의 수', '합의 법칙', '곱의 법칙', '개수']], ['COUNTING_APPLICATION', '경우의 수의 활용', ['색칠', '경로', '배열', '활용']]],
  'H15-SB-07': [['PERMUTATION_BASIC', '순열', ['순열', '배열', '나열', '팩토리얼']], ['PERMUTATION_RESTRICTED', '조건이 있는 순열', ['조건부 배열', '이웃', '양끝', '제한']], ['CIRCULAR_PERMUTATION', '원순열', ['원순열', '원형', '원탁']]],
  'H15-SB-08': [['COMBINATION_BASIC', '조합', ['조합', '선택', '고르기']], ['COMBINATION_REPETITION', '중복조합', ['중복조합', '중복']], ['COMBINATION_APPLICATION', '조합의 활용', ['조합의 활용', '파스칼', '격자점']]],
  'H15-PS-01': [['PERMUTATION', '순열', ['순열', '배열', '나열']], ['COMBINATION', '조합', ['조합', '선택', '뽑']], ['COUNTING_APPLICATION', '경우의 수의 활용', ['경우의 수', '원순열', '중복', '포함배제']]],
  'H15-PS-02': [['BINOMIAL_BASIC', '이항정리', ['이항정리', '전개식', '이항계수']], ['BINOMIAL_COEFFICIENT', '이항계수와 계수비교', ['계수비교', '파스칼', '하키스틱']], ['BINOMIAL_APPLICATION', '이항정리의 활용', ['활용', '조합', '확률']]],
  'H15-PS-03': [['PROBABILITY_BASIC', '확률의 뜻과 활용', ['확률', '표본공간', '사건', '여사건']], ['PROBABILITY_ADDITION', '확률의 덧셈정리', ['덧셈정리', '합사건', '교사건']], ['PROBABILITY_APPLICATION', '확률의 활용', ['독립시행', '주사위', '응용']]],
  'H15-PS-04': [['CONDITIONAL_BASIC', '조건부확률', ['조건부확률', 'P(A|B)', '분할표']], ['INDEPENDENCE', '독립사건과 곱셈정리', ['독립', '곱셈정리']], ['TOTAL_BAYES', '전확률과 베이즈', ['전확률', '베이즈']]],
  'H15-PS-05': [['RANDOM_VARIABLE', '확률변수와 기댓값', ['확률변수', '기댓값', '이산']], ['PROBABILITY_DISTRIBUTION', '확률분포', ['확률분포', '확률질량', '분포']], ['BINOMIAL_NORMAL', '이항분포와 정규분포', ['이항분포', '정규분포', '표준화', '분산']]],
  'H15-PS-06': [['ESTIMATION_BASIC', '통계적 추정', ['통계적 추정', '표본', '모평균', '모비율']], ['CONFIDENCE_INTERVAL', '신뢰구간', ['신뢰구간', '신뢰도', '추정']], ['ESTIMATION_APPLICATION', '추정의 활용', ['표본평균', '표본오차', '확률']]],
  'H15-M1-01': [['EXPONENT', '지수의 뜻과 성질', ['지수', '거듭제곱근', '지수법칙']], ['LOGARITHM', '로그의 뜻과 성질', ['로그', '밑', '진수', '상용로그']]],
  'H15-M1-02': [['LOGARITHM', '로그의 뜻과 성질', ['로그', '상용로그', '로그의 성질']], ['EXPONENT_LOG_APPLICATION', '지수와 로그의 활용', ['지수함수', '로그함수', '실생활']]],
  'H15-M1-03': [['EXPONENTIAL_FUNCTION', '지수함수', ['지수함수', 'y=a^x', '증가', '감소']], ['EXPONENTIAL_GRAPH', '지수함수의 그래프', ['그래프', '점근선', '평행이동']]],
  'H15-M1-04': [['LOGARITHMIC_FUNCTION', '로그함수', ['로그함수', 'y=log', '정의역', '치역']], ['LOGARITHMIC_GRAPH', '로그함수의 그래프', ['그래프', '점근선', '역함수']]],
  'H15-M1-05': [['TRIGONOMETRIC_DEFINITION', '삼각함수의 뜻과 값', ['삼각함수', 'sin', 'cos', 'tan', '라디안']], ['TRIGONOMETRIC_RELATION', '삼각함수의 관계', ['삼각함수 사이의 관계', '각변환', '사분면']]],
  'H15-M1-06': [['TRIGONOMETRIC_GRAPH', '삼각함수의 그래프', ['그래프', '주기', '최댓값', '최솟값', '대칭성']]],
  'H15-M1-07': [['TRIGONOMETRIC_EQUATION', '삼각방정식', ['삼각방정식', '실근', '일반각']], ['TRIGONOMETRIC_INEQUALITY', '삼각부등식', ['삼각부등식', '부등식', '범위']]],
  'H15-M1-08': [['ARITHMETIC_SEQUENCE', '등차수열', ['등차수열', '공차']], ['SEQUENCE_TERM', '수열의 일반항', ['일반항', '수열']]],
  'H15-M1-09': [['GEOMETRIC_SEQUENCE', '등비수열', ['등비수열', '공비']], ['SEQUENCE_TERM', '수열의 일반항', ['일반항', '수열']]],
  'H15-M1-10': [['SEQUENCE_SUM', '수열의 합', ['수열의 합', '시그마', 'Σ']]],
  'H15-M1-11': [['MATHEMATICAL_INDUCTION', '수학적 귀납법', ['수학적 귀납법', '귀납법', '자연수']]],
  'H15-M2-01': [['LIMIT', '함수의 극한', ['함수의 극한', '극한', '좌극한', '우극한']]],
  'H15-M2-02': [['CONTINUITY', '함수의 연속', ['연속', '불연속', '중간값 정리']]],
  'H15-M2-03': [['DERIVATIVE_DEFINITION', '미분계수', ['미분계수', '평균변화율', '미분가능']]],
  'H15-M2-04': [['DERIVATIVE', '도함수', ['도함수', '미분', '곱의 미분', '함수와 도함수']]],
  'H15-M2-05': [['TANGENT', '접선의 방정식', ['접선', '접점', '접선의 기울기']]],
  'H15-M2-06': [['DERIVATIVE_APPLICATION', '도함수의 활용', ['극대', '극소', '최댓값', '최솟값', '평균값 정리', '증가', '감소']]],
  'H15-M2-07': [['INDEFINITE_INTEGRAL', '부정적분', ['부정적분', '원시함수', '적분']]],
  'H15-M2-08': [['DEFINITE_INTEGRAL', '정적분', ['정적분', '적분방정식', '정적분과 극한']]],
  'H15-M2-09': [['INTEGRAL_APPLICATION', '적분의 활용', ['넓이', '속도', '거리', '두 곡선 사이']]],
  'H15-CALC-01': [['SEQUENCE_LIMIT', '수열의 극한', ['수열의 극한', '극한', '수렴']]],
  'H15-CALC-02': [['SERIES', '급수', ['급수', '등비급수', '수렴']]],
  'H15-CALC-03': [['EXP_LOG_DERIVATIVE', '지수함수와 로그함수의 미분', ['지수함수', '로그함수', '미분']]],
  'H15-CALC-04': [['TRIG_DERIVATIVE', '삼각함수의 미분', ['삼각함수', '미분', '덧셈정리']]],
  'H15-CALC-05': [['OTHER_DIFFERENTIATION', '여러 가지 미분법', ['미분법', '곱의 미분', '합성함수']]],
  'H15-CALC-06': [['DERIVATIVE_APPLICATION', '도함수의 활용', ['도함수', '최댓값', '최솟값', '증가', '감소']]],
  'H15-CALC-07': [['INTEGRATION_METHOD', '여러 가지 적분법', ['적분법', '치환적분', '부분적분']]],
  'H15-CALC-08': [['INTEGRAL_APPLICATION', '정적분의 활용', ['정적분', '넓이', '속도', '거리']]],
  'H15-GV-01': [['PARABOLA', '포물선', ['포물선', '초점', '준선']]],
  'H15-GV-02': [['ELLIPSE', '타원', ['타원', '초점', '장축', '단축']]],
  'H15-GV-03': [['HYPERBOLA', '쌍곡선', ['쌍곡선', '초점', '점근선']]],
  'H15-GV-04': [['CONIC_LINE_RELATION', '이차곡선과 직선', ['이차곡선', '직선', '교점', '접선']]],
  'H15-GV-05': [['VECTOR_OPERATION', '벡터의 연산', ['벡터', '벡터의 연산', '합', '차']]],
  'H15-GV-06': [['VECTOR_COMPONENT', '평면벡터의 성분과 내적', ['성분', '좌표', '내적']]],
  'H15-GV-07': [['LINE_CIRCLE_EQUATION', '직선과 원의 방정식', ['직선', '원의 방정식', '거리', '접선']]],
  'H15-GV-08': [['SOLID_GEOMETRY', '공간도형', ['공간도형', '다면체', '위치']]],
  'H15-GV-09': [['SPACE_COORDINATE', '공간좌표', ['공간좌표', '좌표', '거리']]],
};

function definitionsForStandard(standardUnitKey, standardUnit) {
  if (MIDDLE_DEFINITIONS[standardUnitKey]) return MIDDLE_DEFINITIONS[standardUnitKey].map(([key, label, cues]) => ({ key, label, standardUnitKey, cues, origin: 'middle_master_rule' }));
  if (HIGH_MANUAL[standardUnitKey]) return HIGH_MANUAL[standardUnitKey].map(([suffix, label, cues]) => ({ key: `${standardUnitKey}-${suffix}`, label, standardUnitKey, cues, origin: 'curriculum_rule' }));
  if (standardUnitKey === 'UNMAPPED-REAL_NUMBER') return [{ key: 'UNMAPPED-REAL_NUMBER-COMPARISON', label: '실수의 대소 관계', standardUnitKey, cues: ['실수', '대소관계', '근삿값', '제곱근'], origin: 'source_category_rule' }];
  const label = standardUnit || standardUnitKey || '미분류';
  const lower = normalize(label);
  let rows;
  if (lower.includes('행렬')) rows = [['MATRIX_BASIC', '행렬의 뜻과 표현', ['행렬', '행과 열', '성분']], ['MATRIX_OPERATION', '행렬의 연산', ['행렬의 연산', '행렬의 곱셈', '행렬의 덧셈']], ['MATRIX_APPLICATION', '행렬의 활용', ['암호', '경로', '변환']]];
  else if (lower.includes('다항식') || lower.includes('인수분해')) rows = [['POLYNOMIAL_BASIC', '다항식의 연산', ['다항식', '계수', '차수', '계산']], ['IDENTITY_REMAINDER', '항등식과 나머지정리', ['항등식', '나머지정리', '인수정리']], ['FACTORIZATION', '인수분해', ['인수분해', '완전제곱식', '곱셈공식']]];
  else if (lower.includes('복소수')) rows = [['COMPLEX_BASIC', '복소수의 뜻과 표현', ['복소수', '허수단위', '실수부', '허수부']], ['COMPLEX_OPERATION', '복소수의 계산', ['복소수의 연산', '켤레복소수', '계산']], ['COMPLEX_ROOT', '복소수와 이차방정식', ['허근', '이차방정식', '판별식']]];
  else if (lower.includes('통계') || lower.includes('추정')) rows = [['STATISTICS_BASIC', '통계 자료의 정리', ['통계', '표', '그래프']], ['STATISTICS_DISTRIBUTION', '확률분포와 자료 분석', ['분포', '평균', '분산', '표준편차']], ['STATISTICS_ESTIMATION', '통계적 추정', ['추정', '표본', '신뢰구간']]];
  else if (lower.includes('도형의 이동')) rows = [['TRANSFORMATION_TRANSLATION', '평행이동', ['평행이동', 'x축', 'y축']], ['TRANSFORMATION_REFLECTION', '대칭이동', ['대칭이동', '대칭']], ['TRANSFORMATION_COMPOSITE', '합성 변환', ['합성', '회전', '이동']]];
  else if (lower.includes('벡터')) rows = [['VECTOR_BASIC', '벡터의 뜻과 연산', ['벡터', '벡터의 연산']], ['VECTOR_COMPONENT', '벡터의 성분', ['성분', '좌표']], ['VECTOR_DOT', '벡터의 내적', ['내적', '수직']]];
  else if (lower.includes('확률분포') || lower.includes('확률')) rows = [['PROBABILITY_BASIC', '확률의 뜻과 계산', ['확률', '사건', '표본공간']], ['PROBABILITY_DISTRIBUTION', '확률분포', ['확률분포', '분포', '확률변수']], ['PROBABILITY_APPLICATION', '확률의 활용', ['조건부확률', '독립', '응용']]];
  else if (lower.includes('미분') || lower.includes('도함수')) rows = [['DERIVATIVE_BASIC', '미분의 기본', ['미분계수', '도함수', '미분']], ['DERIVATIVE_APPLICATION', '미분의 활용', ['최댓값', '최솟값', '접선', '증가', '감소']]];
  else if (lower.includes('적분')) rows = [['INTEGRAL_BASIC', '적분의 기본', ['적분', '부정적분', '정적분']], ['INTEGRAL_APPLICATION', '적분의 활용', ['넓이', '속도', '거리']]];
  else if (lower.includes('수열') || lower.includes('급수')) rows = [['SEQUENCE_BASIC', '수열의 기본', ['수열', '일반항']], ['SEQUENCE_SUM', '수열의 합', ['수열의 합', '시그마']], ['SEQUENCE_APPLICATION', '수열의 활용', ['수렴', '급수', '응용']]];
  else if (lower.includes('삼각함수')) rows = [['TRIGONOMETRIC_BASIC', '삼각함수의 기본', ['삼각함수', 'sin', 'cos', 'tan']], ['TRIGONOMETRIC_GRAPH', '삼각함수의 그래프', ['그래프', '주기']], ['TRIGONOMETRIC_EQUATION', '삼각방정식과 부등식', ['삼각방정식', '삼각부등식']]];
  else if (lower.includes('함수')) rows = [['FUNCTION_BASIC', '함수의 뜻과 그래프', ['함수', '정의역', '치역', '그래프']], ['FUNCTION_COMPOSITION', '합성함수', ['합성함수', '합성']], ['FUNCTION_INVERSE', '역함수', ['역함수', '대칭']]];
  else if (lower.includes('방정식') || lower.includes('부등식')) rows = [['EQUATION_BASIC', '방정식의 풀이', ['방정식', '근', '해']], ['INEQUALITY_BASIC', '부등식의 풀이', ['부등식', '범위', '해집합']], ['EQUATION_APPLICATION', '방정식과 부등식의 활용', ['활용', '조건', '개수']]];
  else if (lower.includes('좌표') || lower.includes('직선') || lower.includes('원')) rows = [['GEOMETRY_EQUATION', '도형의 방정식', ['좌표', '직선', '원', '방정식']], ['GEOMETRY_RELATION', '도형의 관계', ['거리', '교점', '접선', '평행']], ['GEOMETRY_APPLICATION', '도형의 방정식 활용', ['자취', '넓이', '활용']]];
  else rows = [['CORE', `${label} 핵심 개념`, [label]]];
  return rows.map(([suffix, rowLabel, cues]) => ({ key: `${standardUnitKey || 'UNMAPPED'}-${suffix}`, label: rowLabel, standardUnitKey, cues, origin: 'derived_curriculum_rule' }));
}

function loadSourceQuestions(records) {
  const banks = new Map();
  const questions = new Map();
  for (const record of records) {
    if (!banks.has(record.sourceArchiveFile)) {
      const sourcePath = path.join(archiveDir, 'exams', record.sourceArchiveFile);
      const context = { window: {}, console };
      vm.runInNewContext(fs.readFileSync(sourcePath, 'utf8'), context, { timeout: 2000 });
      banks.set(record.sourceArchiveFile, context.window.questionBank || []);
    }
    const question = banks.get(record.sourceArchiveFile)[record.sourceOrdinal - 1];
    if (!question) throw new Error(`source question missing: ${record.sourceArchiveFile}#${record.sourceOrdinal}`);
    questions.set(record.questionUid, question);
  }
  return questions;
}

function loadCoverageCandidates() {
  const candidates = new Map();
  const files = fs.readdirSync(coverageDir).filter(file => /^archive-subunit-coverage-batch-\d{3}-adjudication-v1\.json$/.test(file));
  for (const file of files) {
    const report = readJson(path.join(coverageDir, file));
    for (const record of report.records) candidates.set(record.questionUid, record);
  }
  return candidates;
}

function loadExternalDefinitions() {
  const definitions = [];
  const sequential = readJson(sequentialCuePath).domains || {};
  for (const [standardUnitKey, domain] of Object.entries(sequential)) {
    for (const [key, value] of Object.entries(domain)) definitions.push({ key, label: value.label || key, standardUnitKey, cues: value.cues || [], origin: 'candidate_cue_master' });
  }
  const high = readJson(highCuePath).domains || [];
  const compositeParents = {
    'H22-A-01~04': ['H22-A-01', 'H22-A-02', 'H22-A-03', 'H22-A-04'],
    'H15-PS-03~06': ['H15-PS-03', 'H15-PS-04', 'H15-PS-05', 'H15-PS-06'],
    'H15-M2-01~09': ['H15-M2-01', 'H15-M2-02', 'H15-M2-03', 'H15-M2-04', 'H15-M2-05', 'H15-M2-06', 'H15-M2-07', 'H15-M2-08', 'H15-M2-09']
  };
  for (const entry of high) {
    const parents = compositeParents[entry.standardUnitKey] || [entry.standardUnitKey];
    for (const parent of parents) {
      for (const [suffix, cues] of Object.entries(entry.candidates || {})) {
        const key = `${parent}-${suffix}`;
        definitions.push({ key, label: suffix.replaceAll('_', ' ').toLowerCase(), standardUnitKey: parent, cues, origin: 'high_candidate_cue_master' });
      }
    }
  }
  return definitions;
}

function buildTaxonomy(classificationRecords, coverageRecords, externalDefinitions, sourceQuestions = new Map()) {
  const definitions = new Map();
  const add = definition => {
    if (!definition?.key) return;
    if (!definitions.has(definition.key)) definitions.set(definition.key, { ...definition, cues: [...new Set(definition.cues || [])] });
  };
  for (const record of classificationRecords) {
    const standardUnitKey = record.standardUnitKey || '';
    for (const definition of definitionsForStandard(standardUnitKey, record.standardUnit)) add(definition);
  }
  for (const record of classificationRecords.filter(record => record.classification?.subUnitKey)) {
    const key = record.classification.subUnitKey;
    if (!definitions.has(key)) add({ key, label: record.classification.subUnit, standardUnitKey: record.standardUnitKey || '', cues: [record.classification.subUnit], origin: 'existing_classification' });
  }
  for (const record of coverageRecords) {
    if (!record.proposedSubUnitKey) continue;
    add({ key: record.proposedSubUnitKey, label: record.proposedSubUnit || record.proposedSubUnitKey, standardUnitKey: record.standardUnitKey || '', cues: [record.proposedSubUnit || record.proposedSubUnitKey], origin: 'coverage_candidate' });
  }
  // The operating JS is the current baseline. Preserve any existing
  // production key in the taxonomy so RAW/legacy values remain explicit
  // exceptions rather than being silently replaced by a fresh heuristic.
  for (const question of sourceQuestions.values()) {
    if (!question?.subUnitKey) continue;
    add({
      key: question.subUnitKey,
      label: question.subUnit || question.subUnitKey,
      standardUnitKey: question.standardUnitKey || '',
      cues: [question.subUnit || question.subUnitKey],
      origin: 'production_existing'
    });
  }
  for (const definition of externalDefinitions) add(definition);
  // This source-category taxonomy is used when the archive record has no
  // inherited standardUnitKey but the question itself identifies real-number
  // comparison. Keep it explicit rather than falling back to calculus cues.
  for (const definition of definitionsForStandard('UNMAPPED-REAL_NUMBER', '실수의 대소 관계')) add(definition);
  return [...definitions.values()].sort((a, b) => a.key.localeCompare(b.key, 'en'));
}

function textFor(question) {
  return normalize([question.category, question.originalCategory, ...(question.tags || []), question.content, question.solution].filter(Boolean).join(' '));
}

function effectiveStandardUnitKey(record, question) {
  const category = normalize(`${question.category || ''} ${question.originalCategory || ''}`);
  const sourceKey = question?.standardUnitKey || record.standardUnitKey || '';
  const middleSource = /(?:^|\/)middle\//.test(record.sourceArchiveFile || '');
  if (!middleSource) {
    if (category.includes('실수의대소관계')) return 'UNMAPPED-REAL_NUMBER';
    return sourceKey;
  }
  // Prefer the explicit curriculum/category label when the inherited source
  // standardUnitKey is stale or points to a neighboring middle-school unit.
  // The source archive contains a small number of these cross-unit imports.
  if (category.includes('최대공약수') || category.includes('최소공배수') || category.includes('소인수분해')) return 'M1-01';
  if (category.includes('정수와유리수') || category.includes('기약분수') || category.includes('부등호의사용') || category.includes('수의대소') || category.includes('역수')) return 'M1-02';
  if (category.includes('문자와식') || category.includes('문자를사용한식') || category.includes('일차식') || category.includes('동류항') || category === '다항식') return 'M1-03';
  if (category.includes('기본도형')) return 'M1-05';
  if (category.includes('좌표평면') || category.includes('정비례') || category.includes('반비례')) return 'M1-04';
  if (category.includes('평면도형')) return 'M1-06';
  // M3-07 is a canonical middle-school statistics unit. Do not let the
  // broad "통계" cue remap it to the M1-08 data unit.
  if (category.includes('통계') || category.includes('자료의정리') || category.includes('줄기와잎') || category.includes('도수분포')) {
    if (sourceKey === 'M3-07' || sourceKey === 'M1-08') return sourceKey;
    return 'M1-08';
  }
  if (category.includes('입체도형')) return 'M1-07';
  if (category.includes('좌표평면과그래프')) return 'M1-04';
  if (category.includes('유리수와순환소수')) return 'M2-01';
  if (category.includes('식의계산') && /^M2-0[12]$/.test(sourceKey)) return 'M2-01';
  if (category.includes('일차방정식의그래프') || category.includes('함수의뜻') || category.includes('함수의값')) return 'M2-04';
  if (category.includes('일차방정식의자연수해') || category.includes('일차방정식') || category.includes('연립일차방정식')) return 'M2-03';
  if (category.includes('일차부등식')) return 'M2-02';
  if (category.includes('부등식') || category.includes('해의조건')) return 'M2-02';
  if (category.includes('일차함수')) return 'M2-04';
  if (category.includes('이등변삼각형') || category.includes('삼각형의성질') || category.includes('도형의성질')) return 'M2-05';
  if (category.includes('닮음')) return 'M2-06';
  if (category.includes('피타고라스')) return 'M2-07';
  if (category.includes('확률') || category.includes('경우의수')) return 'M2-08';
  if (category.includes('제곱근과실수') || category.includes('근호')) return 'M3-01';
  if (category.includes('다항식의곱셈') || category.includes('인수분해') || category.includes('곱셈공식')) return 'M3-02';
  if (category.includes('이차방정식')) return 'M3-03';
  if (category.includes('이차함수')) return 'M3-04';
  if (category.includes('삼각비')) return 'M3-05';
  if (category.includes('원의성질') || category.includes('원주각') || category.includes('중심각')) return 'M3-06';
  if (category.includes('다항식의곱셈') && /^M3-0[12]$/.test(sourceKey)) return 'M3-02';
  if (category.includes('이차방정식') && /^M3-0[1-4]$/.test(sourceKey)) return 'M3-03';
  if (category.includes('이차함수') && /^M3-0[1-4]$/.test(sourceKey)) return 'M3-04';
  return sourceKey;
}

function focusedSubUnitKey(standardUnitKey, question) {
  const category = normalize(`${question.category || ''} ${question.originalCategory || ''}`);
  const text = textFor(question);
  const has = (...tokens) => tokens.some(token => category.includes(normalize(token)) || text.includes(normalize(token)));
  const pick = suffix => `${standardUnitKey}-${suffix}`;
  if (standardUnitKey === 'M1-01') return has('소인수분해', '소인수') ? pick('PRIME_FACTORIZATION') : pick('GCD_LCM');
  if (standardUnitKey === 'M1-02') return has('계산', '덧셈', '뺄셈', '곱셈', '나눗셈', '혼합계산', '기약분수', '역수') ? pick('RATIONAL_NUMBER_OPERATIONS') : pick('INTEGER_RATIONAL_NUMBER');
  if (standardUnitKey === 'M1-03') {
    if (has('일차방정식의활용', '방정식의세우기', '속력', '거리', '농도', '나이', '일의양')) return pick('LINEAR_EQUATION_WORD');
    if (has('일차방정식', '방정식의풀이', '등식의성질', '방정식의해')) return pick('LINEAR_EQUATION');
    return pick('ALGEBRAIC_EXPRESSION');
  }
  if (standardUnitKey === 'M1-04') return has('좌표평면', '점의좌표', '사분면', '축위의점') ? pick('COORDINATE_PLANE') : pick('GRAPH_RELATION');
  if (standardUnitKey === 'M1-05') return has('평행', '수직', '교점', '동위각', '엇각', '위치관계') ? pick('POSITION_RELATION') : pick('BASIC_FIGURE');
  if (standardUnitKey === 'M1-06') return has('넓이', '둘레', '부채꼴', '호의길이', '원주율') ? pick('PLANE_FIGURE_MEASURE') : pick('POLYGON_CIRCLE');
  if (standardUnitKey === 'M1-07') return has('부피', '겉넓이', '원기둥', '원뿔', '구', '높이', '물의양') ? pick('SOLID_FIGURE_MEASURE') : pick('SOLID_FIGURE');
  if (standardUnitKey === 'M1-08') return has('도수분포', '줄기와잎', '히스토그램', '도수분포다각형', '상대도수', '도수') ? pick('DATA_ORGANIZATION') : pick('DATA_INTERPRETATION');
  if (standardUnitKey === 'M2-01') {
    if (has('순환소수', '유한소수', '유리수와소수')) return pick('REPEATING_DECIMAL');
    if (has('지수법칙', '거듭제곱', '지수의뜻')) return pick('EXPONENT_LAW');
    return pick('POLYNOMIAL_OPERATIONS');
  }
  if (standardUnitKey === 'M2-02') return has('활용', '자연수조건', '개수세기', '범위') ? pick('LINEAR_INEQUALITY_WORD') : pick('LINEAR_INEQUALITY');
  if (standardUnitKey === 'M2-03') return has('활용', '거리', '속력', '농도', '개수') ? pick('SIMULTANEOUS_LINEAR_EQUATION_WORD') : pick('SIMULTANEOUS_LINEAR_EQUATION');
  if (standardUnitKey === 'M2-04') return has('두직선의교점', '해의개수', '일치', '평행', '연립방정식') ? pick('LINEAR_FUNCTION_EQUATION') : pick('LINEAR_FUNCTION_BASIC');
  if (standardUnitKey === 'M2-05') return has('평행사변형', '사다리꼴', '직사각형', '마름모', '정사각형', '사각형') ? pick('QUADRILATERAL_PROPERTIES') : pick('TRIANGLE_PROPERTIES');
  if (standardUnitKey === 'M2-06') return has('평행선', '선분의길이의비', '중점연결정리') ? pick('PARALLEL_LENGTH_RATIO') : pick('SIMILAR_FIGURE');
  if (standardUnitKey === 'M2-07') return has('활용', '넓이', '거리', '높이', '최단거리') ? pick('PYTHAGOREAN_APPLICATION') : pick('PYTHAGOREAN_THEOREM');
  if (standardUnitKey === 'M2-08') return has('경우의수', '순열', '조합', '나열', '선택', '분류') ? pick('PROBABILITY_COUNTING') : pick('PROBABILITY_BASIC');
  if (standardUnitKey === 'M3-01') return has('근호', '분모의유리화', '근호의계산', '계산') ? pick('REAL_NUMBER_OPERATIONS') : pick('SQUARE_ROOT_REAL_NUMBER');
  if (standardUnitKey === 'M3-02') return pick('POLYNOMIAL_MULTIPLICATION');
  if (standardUnitKey === 'M3-03') return has('활용', '넓이', '수량', '연속정수', '속력', '변수설정') ? pick('QUADRATIC_EQUATION_WORD') : pick('QUADRATIC_EQUATION');
  if (standardUnitKey === 'M3-04') return has('활용', '최댓값', '최솟값', '울타리', '수익', '실생활') ? pick('QUADRATIC_FUNCTION_APPLICATION') : pick('QUADRATIC_FUNCTION_GRAPH');
  if (standardUnitKey === 'M3-05') return has('활용', '그림자', '높이', '거리', '경사', '앙각', '부각', '측량') ? pick('TRIG_RATIO_APPLICATION') : pick('TRIG_RATIO');
  if (standardUnitKey === 'M3-06') return has('원주각', '중심각', '현', '각') ? pick('CIRCLE_ANGLE') : pick('CIRCLE_PROPERTIES');
  if (standardUnitKey === 'M3-07') return has('도수분포표', '히스토그램', '상대도수', '자료해석', '그래프') ? pick('STATISTICS_DATA_INTERPRETATION') : pick('STATISTICS_REPRESENTATIVE');
  if (standardUnitKey === 'H15-SA-01') return has('나눗셈', '몫', '나머지') ? pick('POLYNOMIAL_DIVISION') : pick('POLYNOMIAL_BASIC');
  if (standardUnitKey === 'H15-SA-02') return has('나머지정리', '인수정리', '나머지') ? pick('REMAINDER_FACTOR') : pick('IDENTITY');
  if (standardUnitKey === 'H15-SA-13') return has('활용', '최댓값', '최솟값', '넓이', '실생활') ? pick('QUADRATIC_APPLICATION') : pick('QUADRATIC_GRAPH');
  if (standardUnitKey === 'H15-SB-02') {
    if (has('필요조건', '충분조건', '필요충분')) return pick('NECESSARY_SUFFICIENT');
    if (has('증명', '대우', '귀류법', '절대부등식')) return pick('PROOF');
    return pick('PROPOSITION_BASIC');
  }
  if (standardUnitKey === 'H15-SB-03') {
    if (has('합성함수', '합성')) return pick('COMPOSITE_FUNCTION');
    if (has('역함수')) return pick('INVERSE_FUNCTION');
    return pick('FUNCTION_RELATION');
  }
  if (standardUnitKey === 'H15-M1-02') return has('지수함수', '로그함수', '실생활') ? pick('EXPONENT_LOG_APPLICATION') : pick('LOGARITHM');
  if (standardUnitKey === 'H15-M1-05') return has('각변환', '사분면', '삼각함수사이의관계') ? pick('TRIGONOMETRIC_RELATION') : pick('TRIGONOMETRIC_DEFINITION');
  if (standardUnitKey === 'H15-M1-07') return has('삼각부등식', '부등식') ? pick('TRIGONOMETRIC_INEQUALITY') : pick('TRIGONOMETRIC_EQUATION');
  if (standardUnitKey === 'H15-SA-12') return has('대칭이동', '평행이동', '회전', '도형', '이동', 'f(-y', 'f(-') ? pick('COMPOSITE_TRANSFORMATION') : pick('CORE');
  if (standardUnitKey === 'H22-C-01') return has('거듭제곱근', '제곱근', '근호') ? pick('CORE') : '';
  if (standardUnitKey === 'H22-A-01') return has('거듭제곱근', '제곱근', '근호') ? pick('CORE') : '';
  if (standardUnitKey === 'H22-C-07') return has('경우의수', '순열', '조합', '경로', '합의법칙', '곱의법칙') ? pick('CORE') : '';
  if (standardUnitKey === 'H22-C-09') return has('부채꼴', '행렬', '경우의수') ? (has('부채꼴') ? pick('TRIGONOMETRIC_BASIC') : pick('CORE')) : '';
  if (standardUnitKey === 'UNMAPPED-REAL_NUMBER') return pick('COMPARISON');
  if (standardUnitKey === 'UNCLASSIFIED-MIDDLE2') return has('부등식', '해의조건', '범위') ? 'M2-02-LINEAR_INEQUALITY' : '';
  if (standardUnitKey === 'M1-2-GEOM-SOLID-05') return has('부피', '겉넓이', '각기둥') ? pick('CORE') : '';
  return '';
}

function scoreDefinition(definition, question, text, candidateKey, focusedKey) {
  if (candidateKey && definition.key === candidateKey) return { score: 10000, matched: ['coverage_candidate'] };
  let score = 0;
  const matched = [];
  if (focusedKey && definition.key === focusedKey) { score += 80; matched.push('category_rule'); }
  const category = normalize(`${question.category || ''} ${question.originalCategory || ''}`);
  const tags = (question.tags || []).map(normalize);
  for (const cue of definition.cues || []) {
    const token = normalize(cue);
    if (!token) continue;
    if (tags.includes(token)) { score += Math.max(8, token.length * 2); matched.push(cue); }
    else if (category.includes(token)) { score += Math.max(6, token.length); matched.push(cue); }
    else if (text.includes(token)) { score += Math.max(2, Math.min(12, token.length)); matched.push(cue); }
  }
  return { score, matched: [...new Set(matched)] };
}

function classifyRecord(record, question, definitions, candidate) {
  const existingKey = question?.subUnitKey || '';
  const sourceStandardUnitKey = question?.standardUnitKey || record.standardUnitKey || '';
  const sourceStandardUnit = question?.standardUnit || record.standardUnit || '';
  if (existingKey) {
    const existingDefinition = definitions.find(definition => definition.key === existingKey);
    // The production JS is the source of truth for an already-approved
    // sub-unit label.  A taxonomy definition may carry a newer canonical
    // label for the same key, but rebuilding a read-only classification
    // snapshot must not rewrite the label that the running archive exposes.
    const existingLabel = question.subUnit || existingDefinition?.label || existingKey;
    const confidenceValues = new Set(['existing_preserved', 'candidate_evidence', 'category_or_cue_inferred', 'rule_inferred']);
    const depthValues = new Set(['complete_candidate', 'complete_category', 'complete_documented', 'complete_rule']);
    const existingConfidence = confidenceValues.has(question.subUnitConfidence) ? question.subUnitConfidence : 'existing_preserved';
    const existingDepth = depthValues.has(question.subUnitClassificationDepth) ? question.subUnitClassificationDepth : 'complete_documented';
    return {
      questionUid: record.questionUid,
      sourceArchiveFile: record.sourceArchiveFile,
      sourceOrdinal: record.sourceOrdinal,
      standardUnitKey: sourceStandardUnitKey,
      standardUnit: sourceStandardUnit,
      inferredStandardUnitKey: sourceStandardUnitKey,
      classification: {
        subUnitKey: existingKey,
        subUnit: existingLabel,
        conceptClusterKey: existingKey,
        problemTypeKey: '',
        templateKey: '',
        confidence: existingConfidence,
        classificationDepth: existingDepth,
        uncertainty: false,
        evidence: {
          matchedCues: [],
          score: 0,
          runnerUpSubUnitKey: '',
          runnerUpScore: 0,
          margin: 0,
          sourceDisposition: 'PRODUCTION_EXISTING',
          sourceCandidateSubUnitKey: '',
          rationale: '현재 운영 JS의 승인된 세부단원 값을 기준선으로 보존했다.'
        },
        productionWriteAllowed: false
      }
    };
  }
  const text = textFor(question);
  const candidateKey = candidate?.disposition === 'PILOT_CANDIDATE' ? candidate.proposedSubUnitKey || '' : '';
  const inferredStandardUnitKey = effectiveStandardUnitKey(record, question);
  const candidates = definitions.filter(definition => definition.standardUnitKey === inferredStandardUnitKey);
  // Unscoped definitions are reserved for genuinely unmapped standard units;
  // they must not compete with an otherwise valid unit's own taxonomy.
  const available = candidates.length
    ? candidates
    : (inferredStandardUnitKey ? definitions.filter(definition => definition.standardUnitKey === '') : definitions);
  const focusedKey = focusedSubUnitKey(inferredStandardUnitKey, question);
  const scored = available.map(definition => ({ definition, ...scoreDefinition(definition, question, text, candidateKey, focusedKey) }))
    .sort((a, b) => b.score - a.score || a.definition.key.localeCompare(b.definition.key, 'en'));
  const winner = scored[0];
  const runnerUp = scored[1];
  if (!winner) throw new Error(`no subunit definitions available for ${record.questionUid}`);
  const explicitCandidate = Boolean(candidateKey && winner.definition.key === candidateKey);
  const margin = winner.score - (runnerUp?.score ?? 0);
  let confidence;
  let classificationDepth;
  if (record.classification?.subUnitKey && record.classification.classificationDepth !== 'standard_unit_only' && record.classification.classificationDepth !== 'unmapped_standard_unit') {
    confidence = 'existing_preserved'; classificationDepth = 'complete_documented';
  } else if (explicitCandidate) {
    confidence = 'candidate_evidence'; classificationDepth = 'complete_candidate';
  } else if (available.length === 1) {
    confidence = 'rule_inferred'; classificationDepth = 'complete_rule';
  } else if (winner.score >= 20 && margin >= 4) {
    confidence = 'rule_inferred'; classificationDepth = 'complete_rule';
  } else if (winner.score > 0) {
    confidence = 'category_or_cue_inferred'; classificationDepth = 'complete_category';
  } else {
    confidence = 'standard_unit_default'; classificationDepth = 'complete_default';
  }
  const uncertainty = margin < 4 || confidence === 'standard_unit_default';
  return {
    questionUid: record.questionUid,
    sourceArchiveFile: record.sourceArchiveFile,
    sourceOrdinal: record.sourceOrdinal,
    standardUnitKey: sourceStandardUnitKey,
    standardUnit: sourceStandardUnit,
    inferredStandardUnitKey,
    classification: {
      subUnitKey: winner.definition.key,
      subUnit: winner.definition.label,
      conceptClusterKey: winner.definition.key,
      problemTypeKey: '',
      templateKey: '',
      confidence,
      classificationDepth,
      uncertainty,
      evidence: {
        matchedCues: winner.matched,
        score: winner.score,
        runnerUpSubUnitKey: runnerUp?.definition.key || '',
        runnerUpScore: runnerUp?.score ?? 0,
        margin,
        sourceDisposition: candidate?.disposition || '',
        sourceCandidateSubUnitKey: candidateKey,
        rationale: explicitCandidate
          ? 'coverage 후보와 문항 본문·해설·태그를 결합해 세부단원을 확정했다.'
          : confidence === 'standard_unit_default'
            ? '표준단원 체계의 기본 세부단원을 부여했다. 값은 채웠으며 후속 경계 검토 대상으로 표시했다.'
            : '문항 본문·해설·태그와 표준단원별 세부 체계를 결합해 세부단원을 부여했다.'
      },
      productionWriteAllowed: false
    }
  };
}

function countBy(records, selector) {
  const counts = {};
  for (const record of records) {
    const value = selector(record) || 'UNSPECIFIED';
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

export function buildCompleteSubunitClassificationV1() {
  const sourceClassification = readJson(classificationPath);
  const coverageRecords = [...loadCoverageCandidates().values()];
  const questions = loadSourceQuestions(sourceClassification.records);
  const definitions = buildTaxonomy(sourceClassification.records, coverageRecords, loadExternalDefinitions(), questions);
  const definitionByKey = new Map(definitions.map(definition => [definition.key, definition]));
  const candidateByUid = loadCoverageCandidates();
  const records = sourceClassification.records.map(record => classifyRecord(record, questions.get(record.questionUid), definitions, candidateByUid.get(record.questionUid)));
  const emptySubUnitKeys = records.filter(record => !record.classification.subUnitKey);
  const unknownKeys = records.filter(record => !definitionByKey.has(record.classification.subUnitKey));
  const uniqueIds = new Set(records.map(record => record.questionUid));
    if (records.length !== sourceClassification.records.length) {
        throw new Error(`classification record count changed during rebuild: source=${sourceClassification.records.length}, output=${records.length}`);
    }
  if (uniqueIds.size !== records.length) throw new Error(`questionUid duplicates: ${records.length - uniqueIds.size}`);
  if (emptySubUnitKeys.length) throw new Error(`empty subUnitKey values: ${emptySubUnitKeys.length}`);
  if (unknownKeys.length) throw new Error(`taxonomy key gaps: ${unknownKeys.length}`);
  const stable = {
    schemaVersion: 'archive-complete-subunit-classification-v1',
    productionWriteAllowed: false,
    sourceWrites: { master: false, originalJs: false, database: false, questionIndex: false, commit: false, push: false },
    sourceClassificationDigest: sourceClassification.digest,
    taxonomyDigest: sha256(JSON.stringify(definitions)),
    totals: {
      records: records.length,
      identityUnique: uniqueIds.size === records.length,
      emptySubUnitKeys: emptySubUnitKeys.length,
      taxonomyKeyGaps: unknownKeys.length,
      classificationDepth: countBy(records, record => record.classification.classificationDepth),
      confidence: countBy(records, record => record.classification.confidence),
      standardUnit: countBy(records, record => record.standardUnitKey),
      subUnit: countBy(records, record => record.classification.subUnitKey)
    },
    gates: {
      allRecordsHaveSubUnitKey: emptySubUnitKeys.length === 0,
      allSubUnitKeysInTaxonomy: unknownKeys.length === 0,
      identityUnique: uniqueIds.size === records.length,
      sourceQuestionJoinComplete: questions.size === records.length,
      productionWrites: false
    },
    taxonomy: definitions,
    records
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

function writeSummary(report) {
  const rows = Object.entries(report.totals.confidence).map(([key, value]) => `| ${key} | ${value} |`).join('\n');
  return [
    '# 전체 세부단원 완성 분류본 v1',
    '',
    `- 전체 문항: ${report.totals.records.toLocaleString('en-US')}건`,
    `- 세부단원 키 공란: ${report.totals.emptySubUnitKeys}건`,
    `- taxonomy 미등록 키: ${report.totals.taxonomyKeyGaps}건`,
    `- 고유 questionUid: ${report.totals.identityUnique ? '통과' : '실패'}`,
    '',
    '| 근거 수준 | 문항 수 |',
    '|---|---:|',
    rows,
    '',
    '모든 문항에 non-empty `subUnitKey`를 부여했다. 이 산출물은 분류 스냅샷이며 production write는 별도 적용 도구로 통제한다. 현재 `standard_unit_default`는 없고, 실제 검토 승격 결과는 exception review/apply 및 operational QA 보고서에 기록한다.',
    '',
    `- digest: \`${report.digest}\``,
    `- productionWriteAllowed: \`${report.productionWriteAllowed}\``
  ].join('\n') + '\n';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildCompleteSubunitClassificationV1();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(taxonomyPath, `${JSON.stringify({ schemaVersion: 'archive-complete-subunit-taxonomy-v1', digest: report.taxonomyDigest, productionWriteAllowed: false, definitions: report.taxonomy }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(summaryPath, writeSummary(report), 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), taxonomy: path.relative(archiveDir, taxonomyPath).replaceAll('\\', '/'), summary: path.relative(archiveDir, summaryPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals, gates: report.gates }, null, 2));
}
