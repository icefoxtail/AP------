# JS아카이브 세부단원체계 설계 v1 (초안)

상태: `DRAFT`  
운영 반영: `금지`  
목적: 표준단원 아래에 문항 의미를 수용할 세부 단원·개념 계층을 먼저 정의하고, 이후 마스터 테이블과 룰북에 승인 편입한다.

## 1. 설계 원칙

1. 교육과정 단원은 최상위 기준으로 유지한다. 세부 단원은 교육과정의 내용 요소와 학교 문제집의 반복 목차가 교집합을 이루는 범위에서만 만든다.
2. 교육과정 버전은 섞지 않는다. 중학교 2022 개정, 고등학교 2015/2022 개정은 별도 계층으로 보관하고 alias만 연결한다.
3. 세부 단원(`subUnitKey`)과 개념군(`conceptClusterKey`)을 분리한다. 세부 단원은 목차·내용 영역, 개념군은 여러 단원에서 재사용되는 수학 개념이다.
4. 문제 유형과 풀이 템플릿은 세부 단원 승인 이후에만 만든다. 유형을 먼저 만들고 단원을 끼워 맞추지 않는다.
5. 모든 신규 항목은 `DRAFT → PILOT → APPROVED` 단계를 거친다. `DRAFT`와 `PILOT` 키는 운영 JS와 자동 추천에 사용할 수 없다.
6. 문항을 어느 세부 단원에도 안정적으로 넣을 수 없으면 억지로 분류하지 않고 `UNRESOLVED`로 둔다.

## 2. 세부 테이블 필드

| 필드 | 의미 |
|---|---|
| `standardUnitKey` | 기존 교육과정 표준단원 키 |
| `subUnitKey` | `{standardUnitKey}-{SLUG}` 형식의 세부 키 |
| `subUnit` | 사용자에게 표시할 세부 단원명 |
| `conceptClusterKey` | 핵심 개념군 |
| `curriculumVersion` | `middle-2022`, `high-2015`, `high-2022` |
| `sourceBasis` | 교육과정 내용 요소, 교재 목차, 아카이브 문항 근거 |
| `aliases` | 기존 원본의 표기 변형·레거시 키 |
| `status` | `DRAFT`, `PILOT`, `APPROVED`, `DEPRECATED` |
| `evidencePolicy` | 본문·해설·시각자료 중 필요한 근거 |
| `reviewRequiredWhen` | 자동 확정을 금지할 조건 |

## 3. 1차 승인 후보: 중학교 2022 개정

아래 항목은 현재 표준단원과 기존 확장 태그를 정리한 **설계 초안**이다. 아직 운영 마스터에 추가하지 않는다.

| standardUnitKey | subUnitKey | 세부 단원 | conceptClusterKey |
|---|---|---|---|
| M1-01 | M1-01-PRIME_FACTORIZATION | 소인수분해 | PRIME_FACTORIZATION |
| M1-01 | M1-01-GCD_LCM | 최대공약수와 최소공배수 | GCD_LCM |
| M1-02 | M1-02-INTEGER_RATIONAL_NUMBER | 정수와 유리수의 뜻 | INTEGER_RATIONAL_NUMBER |
| M1-02 | M1-02-RATIONAL_NUMBER_OPERATIONS | 정수와 유리수의 계산 | RATIONAL_NUMBER_OPERATIONS |
| M1-03 | M1-03-ALGEBRAIC_EXPRESSION | 문자의 사용과 식의 값 | ALGEBRAIC_EXPRESSION |
| M1-03 | M1-03-LINEAR_EQUATION | 일차방정식 | LINEAR_EQUATION |
| M1-03 | M1-03-LINEAR_EQUATION_WORD | 일차방정식의 활용 | LINEAR_EQUATION_WORD_PROBLEM |
| M1-04 | M1-04-COORDINATE_PLANE | 좌표평면 | COORDINATE_PLANE |
| M1-04 | M1-04-GRAPH_RELATION | 그래프와 관계 | GRAPH_RELATION |
| M1-05 | M1-05-BASIC_FIGURE | 점·선·면과 각 | BASIC_FIGURE |
| M1-05 | M1-05-POSITION_RELATION | 위치 관계 | POSITION_RELATION |
| M1-06 | M1-06-PLANE_FIGURE_MEASURE | 평면도형의 측정 | PLANE_FIGURE_MEASURE |
| M1-06 | M1-06-POLYGON_CIRCLE | 다각형과 원 | POLYGON_CIRCLE |
| M1-07 | M1-07-SOLID_FIGURE | 입체도형 | SOLID_FIGURE |
| M1-07 | M1-07-SOLID_FIGURE_MEASURE | 입체도형의 측정 | SOLID_FIGURE_MEASURE |
| M1-08 | M1-08-DATA_ORGANIZATION | 자료의 정리 | DATA_ORGANIZATION |
| M1-08 | M1-08-DATA_INTERPRETATION | 자료의 해석 | DATA_INTERPRETATION |
| M2-01 | M2-01-REPEATING_DECIMAL | 유리수와 순환소수 | REPEATING_DECIMAL |
| M2-01 | M2-01-EXPONENT_LAW | 지수법칙 | EXPONENT_LAW |
| M2-01 | M2-01-POLYNOMIAL_OPERATIONS | 다항식의 계산 | POLYNOMIAL_OPERATIONS |
| M2-02 | M2-02-LINEAR_INEQUALITY | 일차부등식 | LINEAR_INEQUALITY |
| M2-02 | M2-02-LINEAR_INEQUALITY_WORD | 일차부등식의 활용 | LINEAR_INEQUALITY_WORD_PROBLEM |
| M2-03 | M2-03-SIMULTANEOUS_LINEAR_EQUATION | 연립일차방정식 | SIMULTANEOUS_LINEAR_EQUATION |
| M2-03 | M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD | 연립일차방정식의 활용 | SIMULTANEOUS_LINEAR_EQUATION_WORD_PROBLEM |
| M2-04 | M2-04-LINEAR_FUNCTION_BASIC | 일차함수의 뜻과 그래프 | LINEAR_FUNCTION_GRAPH |
| M2-04 | M2-04-LINEAR_FUNCTION_EQUATION | 일차함수와 일차방정식의 관계 | LINEAR_FUNCTION_EQUATION_RELATION |
| M2-05 | M2-05-TRIANGLE_PROPERTIES | 삼각형의 성질 | TRIANGLE_PROPERTIES |
| M2-05 | M2-05-QUADRILATERAL_PROPERTIES | 사각형의 성질 | QUADRILATERAL_PROPERTIES |
| M2-06 | M2-06-SIMILAR_FIGURE | 도형의 닮음 | SIMILAR_FIGURE |
| M2-06 | M2-06-PARALLEL_LENGTH_RATIO | 평행선 사이의 선분의 길이의 비 | PARALLEL_LENGTH_RATIO |
| M2-07 | M2-07-PYTHAGOREAN_THEOREM | 피타고라스 정리 | PYTHAGOREAN_THEOREM |
| M2-07 | M2-07-PYTHAGOREAN_APPLICATION | 피타고라스 정리의 활용 | PYTHAGOREAN_APPLICATION |
| M2-08 | M2-08-PROBABILITY_BASIC | 확률의 뜻과 성질 | PROBABILITY_BASIC |
| M2-08 | M2-08-PROBABILITY_COUNTING | 경우의 수와 확률 | PROBABILITY_COUNTING |
| M3-01 | M3-01-SQUARE_ROOT_REAL_NUMBER | 제곱근과 실수 | SQUARE_ROOT_REAL_NUMBER |
| M3-01 | M3-01-REAL_NUMBER_OPERATIONS | 근호를 포함한 식의 계산 | REAL_NUMBER_OPERATIONS |
| M3-02 | M3-02-POLYNOMIAL_MULTIPLICATION | 다항식의 곱셈 | POLYNOMIAL_MULTIPLICATION |
| M3-02 | M3-02-FACTORIZATION | 인수분해 | FACTORIZATION |
| M3-03 | M3-03-QUADRATIC_EQUATION | 이차방정식 | QUADRATIC_EQUATION |
| M3-03 | M3-03-QUADRATIC_EQUATION_WORD | 이차방정식의 활용 | QUADRATIC_EQUATION_WORD_PROBLEM |
| M3-04 | M3-04-QUADRATIC_FUNCTION_GRAPH | 이차함수의 그래프 | QUADRATIC_FUNCTION_GRAPH |
| M3-04 | M3-04-QUADRATIC_FUNCTION_APPLICATION | 이차함수의 활용 | QUADRATIC_FUNCTION_APPLICATION |
| M3-05 | M3-05-TRIG_RATIO | 삼각비 | TRIG_RATIO |
| M3-05 | M3-05-TRIG_RATIO_APPLICATION | 삼각비의 활용 | TRIG_RATIO_APPLICATION |
| M3-06 | M3-06-CIRCLE_PROPERTIES | 원의 성질 | CIRCLE_PROPERTIES |
| M3-06 | M3-06-CIRCLE_ANGLE | 원과 각 | CIRCLE_ANGLE |
| M3-07 | M3-07-STATISTICS_REPRESENTATIVE | 대푯값과 산포도 | STATISTICS_REPRESENTATIVE |
| M3-07 | M3-07-STATISTICS_DATA_INTERPRETATION | 통계 자료 해석 | STATISTICS_DATA_INTERPRETATION |

## 4. 1차 고등학교 설계 대상

고등학교는 2015·2022 개정의 과목·단원 체계가 다르므로, 먼저 다음 고빈도 영역을 개념군으로 쪼갠다. 고등학교 세부 키는 중학교 키를 재사용하지 않는다.

| 우선순위 | 표준단원군 | 1차 개념군 후보 |
|---:|---|---|
| 1 | H22-C-05 이차방정식과 이차함수 | QUADRATIC_EQUATION, QUADRATIC_FUNCTION_GRAPH, QUADRATIC_FUNCTION_APPLICATION |
| 2 | H22-C-06 여러 가지 방정식과 부등식 | HIGHER_EQUATION, HIGHER_INEQUALITY, SYSTEM_OF_EQUATIONS |
| 3 | H22-C-08 순열과 조합 | PERMUTATION, COMBINATION, COUNTING_PRINCIPLE |
| 4 | H22-C-09 행렬과 그 연산 | MATRIX_BASIC, MATRIX_OPERATION, MATRIX_APPLICATION |
| 5 | H22-A-01~04 지수·로그·삼각함수 | EXPONENT_LOG, EXPONENTIAL_FUNCTION, LOGARITHMIC_FUNCTION, TRIGONOMETRIC_FUNCTION |
| 6 | H15-SB-03 함수 | FUNCTION_RELATION, COMPOSITE_FUNCTION, INVERSE_FUNCTION |
| 7 | H15-PS-03~06 확률·통계 | CONDITIONAL_PROBABILITY, RANDOM_VARIABLE, PROBABILITY_DISTRIBUTION, STATISTICAL_ESTIMATION |
| 8 | H15-M2-01~09 미적분 | LIMIT, CONTINUITY, DERIVATIVE, INTEGRAL, APPLICATION_OF_CALCULUS |

고등학교 후보는 교육과정 문서의 과목·내용 체계를 확인한 뒤 `PILOT`으로만 생성한다. 기존 H15/H22 표준키를 자동으로 통합하지 않는다.

## 5. 승인 절차

1. 교육과정 원문에서 내용 요소를 확인한다.
2. 문제집 목차 2종 이상에서 같은 세부 단원명이 반복되는지 확인한다.
3. 현재 아카이브 문항 50~100개를 샘플링해 세부 단원 경계가 겹치지 않는지 확인한다.
4. 세부 단원별 긍정·부정 예시와 해설 근거를 기록한다.
5. `PILOT` 태그로 300~500문항을 분류하고 Luna 검토를 수행한다.
6. 혼동행렬과 source/solution 불일치율을 확인한 후 `APPROVED`로 승격한다.
7. 승인된 항목만 `JS아카이브_표준단원키_마스터테이블.md`, JSON master, 룰북에 반영한다.

## 6. 현재 결론

이 문서는 새 세부 테이블의 설계 초안이다. 기존 마스터와 룰북은 아직 수정하지 않는다. 다음 작업은 중학교 21개 표준단원에 대해 위 후보를 문항 샘플과 대조해 `PILOT` 상태로 만드는 것이다.

### 현재 상태 정정 (2026-08-22)

위 결론은 설계 당시의 스냅샷이다. 현재는 설계 결과가 승인되어
`docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`, canonical Markdown master,
compiled JSON master와 신규 JS 필드에 반영되었다. 이 문서는 설계 이력을 보존하며
현재 신규 작업의 적용 기준은 운영규칙 부록이다. low-margin·uncertainty·비표준 키는
여전히 review/legacy 예외로 남는다.

## 근거 자료

- 국가교육과정정보센터 2022 개정 교육과정 자료: https://ncic.go.kr/
- 2022 개정 고등학교 교육과정 안내서: https://www.goe.go.kr/resource/old/BBSMSTR_000000030136/BBS_202403140548103972.pdf
- 2022 개정 수학과 교육과정 시안 개발 연구: https://dl.nanet.go.kr/detail/MONO12024000078695
- 내부 표준단원 원본: `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
