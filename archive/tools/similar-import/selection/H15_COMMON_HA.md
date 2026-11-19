# 선택표 · 수학(하) (H15_COMMON_HA) · 고1 · 2015 개정

등록부에서 만든 문서다. 손으로 고치지 않는다 (`build-selection-tables.mjs --write`).
판정은 이 표의 키만 쓴다. 개념 단어(한글 이름)로 Ctrl+F 로 먼저 찾고, 없을 때만 NONE + 새 키 제안을 쓴다.
단원 키는 단원 제목의 키, 소단원·RPM 행은 그 단원 안에서 고른다. 유형(PT)과 템플릿(TPL)은 그 단원 것이 먼저이고, 맨 끝 "아래 학년 유형" 의 키도 쓸 수 있다.

## 단원 목차

- `H15-SB-01` 집합 (소단원 3 · RPM 12 · 유형 14)
- `H15-SB-02` 명제 (소단원 3 · RPM 8 · 유형 11)
- `H15-SB-03` 함수 (소단원 3 · RPM 12 · 유형 25)
- `H15-SB-04` 유리함수 (소단원 3 · RPM 8 · 유형 20)
- `H15-SB-05` 무리함수 (소단원 3 · RPM 11 · 유형 15)
- `H15-SB-06` 경우의 수 (소단원 2 · RPM 3 · 유형 8)
- `H15-SB-07` 순열 (소단원 3 · RPM 5 · 유형 6)
- `H15-SB-08` 조합 (소단원 3 · RPM 7 · 유형 4)

## H15-SB-01 집합

### 소단원

- `H15-SB-01-SET_BASIC` 집합의 뜻과 표현
- `H15-SB-01-SET_COUNT` 집합의 원소의 개수
- `H15-SB-01-SET_OPERATION` 집합의 연산

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H1-RPM-080` 집합과 명제 > 집합의 뜻과 포함 관계 > 집합과 원소 > 원소나열법·조건제시법 · `H15-SB-01-SET_BASIC`
- `H1-RPM-081` 집합과 명제 > 집합의 뜻과 포함 관계 > 집합과 원소 > 유한집합 원소 개수 · `H15-SB-01-SET_COUNT`
- `H1-RPM-082` 집합과 명제 > 집합의 뜻과 포함 관계 > 부분집합 > 부분집합 판정 · `H15-SB-01-SET_BASIC`
- `H1-RPM-083` 집합과 명제 > 집합의 뜻과 포함 관계 > 부분집합 > 부분집합의 개수 · `H15-SB-01-SET_BASIC`
- `H1-RPM-084` 집합과 명제 > 집합의 뜻과 포함 관계 > 집합의 포함 관계 > 두 집합의 포함 · `H15-SB-01-SET_BASIC`
- `H1-RPM-085` 집합과 명제 > 집합의 뜻과 포함 관계 > 집합의 포함 관계 > 매개변수 조건 · `H15-SB-01-SET_BASIC`
- `H1-RPM-086` 집합과 명제 > 집합의 연산 > 교집합과 합집합 > 집합 연산 · `H15-SB-01-SET_OPERATION`
- `H1-RPM-087` 집합과 명제 > 집합의 연산 > 교집합과 합집합 > 원소 개수 · `H15-SB-01-SET_COUNT`
- `H1-RPM-088` 집합과 명제 > 집합의 연산 > 여집합과 차집합 > 여집합 · `H15-SB-01-SET_OPERATION`
- `H1-RPM-089` 집합과 명제 > 집합의 연산 > 여집합과 차집합 > 차집합 · `H15-SB-01-SET_OPERATION`
- `H1-RPM-090` 집합과 명제 > 집합의 연산 > 집합의 연산법칙 > 드모르간 법칙 · `H15-SB-01-SET_OPERATION`
- `H1-RPM-091` 집합과 명제 > 집합의 연산 > 집합의 연산법칙 > 복합 연산 · `H15-SB-01-SET_OPERATION`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H1_SUBSET_SELECTION_COUNTING` **두 부분집합의 경우의 수** — 집합의 부분집합 두 개를 택할 때 크기와 교집합 조건을 만족하는 경우의 수를 구하는 유형.
  - `TPL_H1_SUBSET_PAIR_INTERSECTION_COMPLEMENT` 전체 쌍에서 서로소인 쌍을 빼기
- `PT_SET_AGGREGATE` **집합의 원소의 합** — 집합 또는 조건을 만족하는 부분집합들의 원소의 합을 구하는 문제 유형.
  - `TPL_SET_ELEMENT_SUM` 집합의 모든 원소의 합
  - `TPL_SUBSET_AGGREGATE_BY_ROLE_FREQUENCY` 각 원소가 포함되는 횟수를 이용한 합
  - `TPL_SUBSET_SUM_AGGREGATE` 조건을 만족하는 부분집합들의 원소의 합
  - `TPL_WEIGHTED_SET_SUM_CONDITION` 집합의 원소의 합 조건으로 집합 구하기
- `PT_SET_CARDINALITY` **집합의 원소의 개수** — 집합의 원소의 개수와 포함배제 관계를 이용하여 개수를 구하는 문제 유형.
  - `TPL_COMPLEMENT_CARDINALITY` 여집합의 원소의 개수
  - `TPL_DIFFERENCE_CARDINALITY_DIRECT` 차집합의 원소의 개수
  - `TPL_EXACTLY_K_SETS` 정확히 두 집합 등에 속하는 원소의 개수
  - `TPL_INTERSECTION_CARDINALITY_DIRECT` 교집합의 원소의 개수
  - `TPL_OPERATION_CARDINALITY_COMPOSITE` 여러 집합의 연산으로 얻은 집합의 원소의 개수
  - `TPL_SET_CARDINALITY_DIRECT` 집합의 원소의 개수 구하기
  - `TPL_SYMMETRIC_DIFFERENCE_CARDINALITY` 한쪽 집합에만 속하는 원소의 개수
  - `TPL_THREE_SET_INCLUSION_EXCLUSION` 세 집합의 원소의 개수
  - `TPL_TWO_SET_INCLUSION_EXCLUSION` 두 집합의 원소의 개수
- `PT_SET_CONSTRUCTION` **조건을 만족하는 집합** — 주어진 집합 조건이나 연산 조건을 만족하는 집합을 구성하거나 결정하는 문제 유형.
  - `TPL_CONSTRUCTION_CLOSURE_CONDITION` 주어진 연산 조건을 만족하는 집합 구하기
  - `TPL_RECONSTRUCT_FROM_REGIONS` 교집합·차집합·여집합 조건으로 집합 구하기
  - `TPL_SET_CONSTRUCTION_ENUMERATE` 집합 원소 나열
  - `TPL_SET_EQUATION_SOLUTION` 집합의 조건을 만족하는 집합 구하기
- `PT_SET_DEFINITION` **집합의 뜻** — 집합의 뜻과 집합이 되는 조건을 판정하는 문제 유형.
  - `TPL_SET_IDENTIFY` 집합인지 판정하기
- `PT_SET_ELEMENT_RELATION` **집합의 원소와 부분집합** — 원소 관계와 부분집합 관계를 구별하고 판정하는 문제 유형.
  - `TPL_ELEMENT_MEMBERSHIP_BASIC` 원소 관계 판정하기
  - `TPL_NESTED_SET_RELATION` 원소와 부분집합 관계 판정하기
- `PT_SET_EQUALITY` **서로 같은 집합** — 두 집합이 서로 같다는 조건을 이용하여 원소나 미지수를 결정하는 문제 유형.
  - `TPL_EQUAL_SET_PARAMETER` 서로 같은 집합에서 미지수 구하기
- `PT_SET_EXTREMUM` **집합의 원소의 개수와 합의 최대·최소** — 집합의 원소의 개수 또는 원소의 합이 가질 수 있는 최대·최소를 구하는 문제 유형.
  - `TPL_DIFFERENCE_RANGE` 한쪽 집합에만 속하는 원소의 개수의 최대·최소
  - `TPL_INTERSECTION_RANGE` 교집합의 원소의 개수의 최대·최소
  - `TPL_SET_SUM_EXTREMUM` 집합의 원소의 합의 최대·최소
  - `TPL_UNION_RANGE` 합집합의 원소의 개수의 최대·최소
- `PT_SET_INCLUSION` **집합의 포함 관계** — 집합 사이의 포함 관계를 해석하거나 포함 조건으로 미지수를 결정하는 문제 유형.
  - `TPL_INCLUSION_DIRECT` 집합의 포함 관계 판정하기
  - `TPL_INCLUSION_DIVISOR_MULTIPLE` 약수·배수의 집합 사이의 포함 관계
  - `TPL_INCLUSION_FROM_UNION_INTERSECTION` 집합의 연산에서 포함 관계 찾기
  - `TPL_INCLUSION_PARAMETER` 포함 관계를 이용하여 미지수 구하기
- `PT_SET_OPERATION` **집합의 연산** — 합집합, 교집합, 차집합, 여집합 등 집합의 연산 결과를 구하거나 연산 조건을 해석하는 문제 유형.
  - `TPL_DIRECT_MIXED_OPERATION` 여러 집합의 연산 결과 구하기
  - `TPL_OPERATION_DISJOINT_DEFINITION` 서로소인 두 집합의 뜻
  - `TPL_OPERATION_DISJOINT_JUDGMENT` 서로소인 두 집합의 성질
  - `TPL_OPERATION_NUMBER_SET` 수의 성질로 정의된 집합의 연산
  - `TPL_OPERATION_WITH_PARAMETER` 집합의 연산 조건을 이용하여 미지수 구하기
- `PT_SET_OPERATION_LAW` **집합의 연산법칙** — 집합의 연산법칙을 이용하여 집합식을 정리하거나 성질의 참·거짓을 판정하는 문제 유형.
  - `TPL_ABSORPTION` 흡수법칙
  - `TPL_OPERATION_LAW_COMPOSITE` 여러 집합의 연산법칙을 이용한 식의 정리
  - `TPL_OPERATION_LAW_JUDGMENT` 집합의 연산법칙의 참·거짓 판정
- `PT_SET_REGION_EXPRESSION` **벤다이어그램과 집합의 연산** — 벤다이어그램의 영역과 집합식을 서로 대응시키는 문제 유형.
  - `TPL_EXPRESSION_TO_VENN` 집합을 벤다이어그램의 영역으로 나타내기
  - `TPL_REGION_EQUIVALENCE` 같은 영역을 나타내는 집합 찾기
  - `TPL_VENN_TO_EXPRESSION` 벤다이어그램의 영역을 집합으로 나타내기
- `PT_SUBSET_COUNT` **부분집합의 개수** — 주어진 조건을 만족하는 부분집합의 개수를 구하는 문제 유형.
  - `TPL_PROPER_OR_NONEMPTY_SUBSET_COUNT` 진부분집합 또는 공집합을 제외한 부분집합의 개수
  - `TPL_RELATED_SUBSET_PAIR_COUNT` 포함·서로소 조건이 있는 두 부분집합의 개수
  - `TPL_SUBSET_COUNT_AT_LEAST_ONE` 적어도 하나를 포함하는 부분집합의 개수
  - `TPL_SUBSET_COUNT_PAIR_CLOSED` 짝 대응 닫힘 부분집합
  - `TPL_SUBSET_COUNT_POWERSET_BASIC` 부분집합의 개수 구하기
  - `TPL_SUBSET_COUNT_REQUIRED_FORBIDDEN` 특정 원소의 포함·제외 조건이 있는 부분집합의 개수
  - `TPL_SUBSET_COUNT_SET_CONDITION` 집합의 조건을 만족하는 부분집합의 개수
  - `TPL_SUBSET_COUNT_SUM_PARITY` 원소의 합이 홀수 또는 짝수인 부분집합의 개수
  - `TPL_SUBSET_COUNT_SUM_SUBSET` 원소 합 조건 부분집합
- `PT_SUBSET_JUDGMENT` **부분집합의 판정** — 한 집합이 다른 집합의 부분집합인지 직접 판정하는 문제 유형.
  - `TPL_SUBSET_DIRECT` 부분집합인지 판정하기

## H15-SB-02 명제

### 소단원

- `H15-SB-02-NECESSARY_SUFFICIENT` 필요조건과 충분조건
- `H15-SB-02-PROOF` 증명과 절대부등식
- `H15-SB-02-PROPOSITION_BASIC` 명제와 진리집합

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H1-RPM-092` 집합과 명제 > 명제 > 명제와 조건 > 진리집합 · `H15-SB-02-PROPOSITION_BASIC`
- `H1-RPM-093` 집합과 명제 > 명제 > 명제와 조건 > 명제의 참·거짓 · `H15-SB-02-PROPOSITION_BASIC`
- `H1-RPM-094` 집합과 명제 > 명제 > 역·이·대우 > 대우를 이용한 증명 · `H15-SB-02-PROPOSITION_BASIC`
- `H1-RPM-095` 집합과 명제 > 명제 > 역·이·대우 > 명제 변환 · `H15-SB-02-PROPOSITION_BASIC`
- `H1-RPM-096` 집합과 명제 > 명제 > 필요조건·충분조건 > 조건 관계 · `H15-SB-02-NECESSARY_SUFFICIENT`
- `H1-RPM-097` 집합과 명제 > 명제 > 필요조건·충분조건 > 매개변수 · `H15-SB-02-NECESSARY_SUFFICIENT`
- `H1-RPM-098` 집합과 명제 > 명제 > 증명 > 귀류법 · `H15-SB-02-PROOF`
- `H1-RPM-099` 집합과 명제 > 명제 > 증명 > 절대부등식 증명 · `H15-SB-02-PROOF`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_ABSOLUTE_INEQUALITY_EXTREMUM` **절대부등식의 활용과 최댓값·최솟값** — 산술평균·기하평균의 관계, 코시·슈바르츠 부등식 등을 이용해 식의 최댓값·최솟값을 구한다.
  - `TPL_ABSOLUTE_INEQUALITY_EXTREMUM_SQUARE_BOUND` 제곱합 비음수 극값
  - `TPL_AMGM_MINIMUM` 산술평균과 기하평균을 이용한 최솟값
  - `TPL_AMGM_PRODUCT_EXTREMUM` 곱의 최댓값
  - `TPL_AMGM_RECIPROCAL_MINIMUM` 역수식의 최솟값
  - `TPL_CAUCHY_EXTREMUM` 코시·슈바르츠 부등식을 이용한 최댓값·최솟값
  - `TPL_CAUCHY_MINIMUM` 코시·슈바르츠 부등식을 이용한 최솟값
  - `TPL_MIXED_INEQUALITY_EXTREMUM` 여러 부등식을 이용한 최댓값·최솟값
  - `TPL_PARAMETER_BOUND_EXTREMUM` 매개변수 조건이 있는 최댓값·최솟값
- `PT_ABSOLUTE_INEQUALITY_PROOF` **절대부등식의 증명** — 항상 성립하는 부등식을 대수적 변형, 제곱 비교, 대표 부등식을 이용해 증명한다.
  - `TPL_ABSOLUTE_INEQUALITY_TRUTH_PROOF` 절대부등식의 참·거짓과 증명
  - `TPL_ABSOLUTE_VALUE_CASE_PROOF` 절댓값의 경우분류를 이용한 증명
  - `TPL_AMGM_PROOF` 산술평균과 기하평균의 관계를 이용한 증명
  - `TPL_CAUCHY_PROOF` 코시·슈바르츠 부등식을 이용한 증명
  - `TPL_FUNCTIONAL_INEQUALITY_PROOF` 함수 관계를 이용한 부등식 증명
  - `TPL_SQUARE_COMPARISON_PROOF` 제곱 비교를 이용한 부등식 증명
- `PT_CONTRADICTION_PROOF` **귀류법** — 결론의 부정을 가정하여 모순을 이끌어 원래 명제를 증명한다.
  - `TPL_DIVISIBILITY_PARITY_CONTRADICTION` 홀짝·배수 성질의 귀류법 증명
  - `TPL_INEQUALITY_CONTRADICTION` 부등식의 귀류법 증명
  - `TPL_IRRATIONALITY_DIVISIBILITY_CONTRADICTION` 무리수의 배수성 귀류법 증명
  - `TPL_IRRATIONALITY_INTEGER_GAP_CONTRADICTION` 정수의 제곱 사이를 이용한 무리수 증명
- `PT_CONTRAPOSITIVE_PROOF` **대우를 이용한 증명** — 주어진 명제의 대우를 세워 원래 명제를 증명한다.
  - `TPL_CONTRAPOSITIVE_DIVISIBILITY_PROOF` 대우를 이용한 배수·나눗셈성 증명
  - `TPL_CONTRAPOSITIVE_SIGN_PROOF` 대우를 이용한 부호·인수 증명
- `PT_LOGIC_CHAIN` **논리 관계와 추론** — 여러 명제·조건 사이의 연쇄 관계 또는 논리 제약을 종합하여 결론을 도출한다.
  - `TPL_IMPLICATION_CHAIN` 조건명제의 연쇄 추론
  - `TPL_LOGIC_CONSTRAINT_PUZZLE` 논리 조건을 이용한 추론
- `PT_NEC_SUFF_RELATION` **필요조건·충분조건** — 두 조건의 함의·포함관계를 이용하여 필요조건·충분조건·필요충분조건을 판정한다.
  - `TPL_NEC_SUFF_CHAIN` 조건 관계의 연쇄
  - `TPL_NEC_SUFF_DIRECT_JUDGMENT` 필요조건·충분조건의 판정
  - `TPL_NEC_SUFF_INTERVAL_PARAMETER` 구간과 필요조건·충분조건
  - `TPL_NEC_SUFF_POLYNOMIAL_PARAMETER` 방정식의 해와 필요조건·충분조건
  - `TPL_NEC_SUFF_RELATION_FUNCTION` 필요조건·충분조건 관계의 함수화
  - `TPL_NEC_SUFF_SET_RELATION` 집합과 필요조건·충분조건
- `PT_PROPOSITION_JUDGMENT` **명제와 조건의 판정** — 문장·조건·조건명제의 진릿값을 판정하고 참인 명제 또는 반례를 구분한다.
  - `TPL_EXISTENCE_PROPOSITION_APPLICATION` 존재 명제의 활용
  - `TPL_IMPLICATION_FALSIFICATION` 조건명제의 반례 판정
  - `TPL_IMPLICATION_TRUTH_VALUE` 조건명제의 참·거짓
  - `TPL_PROPOSITION_CONDITION_IDENTIFICATION` 명제와 조건의 구별
  - `TPL_PROPOSITION_TRUTH_JUDGMENT` 명제의 참·거짓
- `PT_PROPOSITION_PARAMETER_CONDITION` **명제가 참이 되기 위한 조건** — 매개변수·구간·근의 조건을 조절하여 주어진 명제가 참 또는 거짓이 되게 하는 값을 결정한다.
  - `TPL_CONVERSE_CONTRAPOSITIVE_BOUND_PARAMETER` 역·대우의 경계조건과 매개변수
  - `TPL_CONVERSE_CONTRAPOSITIVE_COMPOSITE_PARAMETER` 역·대우 조건을 함께 이용한 매개변수
  - `TPL_CONVERSE_CONTRAPOSITIVE_ROOT_PARAMETER` 역·대우와 방정식의 근 조건
  - `TPL_CONVERSE_FALSE_PARAMETER_COUNT` 역이 거짓이 되는 매개변수의 개수
  - `TPL_IMPLICATION_INTERVAL_PARAMETER` 함의와 구간 조건의 매개변수
  - `TPL_PROPOSITION_COUNTEREXAMPLE_COUNT_PARAMETER` 반례가 되는 정수의 개수와 매개변수
  - `TPL_PROPOSITION_DIRECT_SUBSTITUTION_PARAMETER` 직접 대입으로 명제의 매개변수 구하기
  - `TPL_PROPOSITION_PARAMETER_CONDITION_OVERLAP` 진리집합 겹침 조건
  - `TPL_PROPOSITION_PARAMETER_CONDITION_UNIVERSAL` 반직선 전칭 부등식
  - `TPL_PROPOSITION_UNIVERSAL_QUADRATIC_PARAMETER` 모든 실수에서 성립하는 이차식 조건
- `PT_PROPOSITION_TRANSFORM` **역·이·대우와 명제 변환** — 조건명제의 역·이·대우를 구성하거나 서로의 참·거짓 관계를 판정한다.
  - `TPL_CONVERSE_CONTRAPOSITIVE_CONSTRUCTION` 역과 대우 구하기
  - `TPL_CONVERSE_CONTRAPOSITIVE_TRUTH_JUDGMENT` 역·대우의 참·거짓
- `PT_QUANTIFIER_NEGATION` **모든·어떤 명제와 부정** — 모든·어떤이 포함된 명제를 부정하고 그 진릿값 또는 매개변수 조건을 판정한다.
  - `TPL_EXISTENTIAL_NEGATION_BASIC` 존재명제의 부정
  - `TPL_EXISTENTIAL_NEGATION_PARAMETER` 존재명제의 부정과 매개변수
  - `TPL_QUANTIFIER_NEGATION_INTERVAL` 양화명제의 부정과 구간
  - `TPL_QUANTIFIER_NEGATION_NEGATE` 양화명제 부정
  - `TPL_QUANTIFIER_TRUTH_JUDGMENT` 양화명제의 참·거짓
- `PT_TRUTH_SET_RELATION` **진리집합과 명제의 관계** — 조건의 진리집합과 포함·교집합·여집합 관계를 명제의 참·거짓과 연결한다.
  - `TPL_FINITE_TRUTHSET_ENUMERATION` 유한 진리집합의 판정
  - `TPL_IMPLICATION_TRUTHSET_RELATION` 명제와 진리집합의 포함관계
  - `TPL_QUANTIFIED_SET_RELATION` 양화명제와 집합관계
  - `TPL_TRUTH_SET_RELATION_INTERSECTION` 진리집합 교집합 정수
  - `TPL_TRUTHSET_CHAINED_INCLUSION` 진리집합의 연쇄 포함
  - `TPL_TRUTHSET_SET_OPERATION` 집합 연산과 명제

## H15-SB-03 함수

### 소단원

- `H15-SB-03-COMPOSITE_FUNCTION` 합성함수
- `H15-SB-03-FUNCTION_RELATION` 함수의 뜻과 대응
- `H15-SB-03-INVERSE_FUNCTION` 역함수

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H1-RPM-100` 함수 > 함수 > 함수의 뜻 > 대응과 함수 · `H15-SB-03-FUNCTION_RELATION`
- `H1-RPM-101` 함수 > 함수 > 함수의 뜻 > 정의역·공역·치역 · `H15-SB-03-FUNCTION_RELATION`
- `H1-RPM-102` 함수 > 함수 > 합성함수 > 합성함수 계산 · `H15-SB-03-COMPOSITE_FUNCTION`
- `H1-RPM-103` 함수 > 함수 > 합성함수 > 정의역 조건 · `H15-SB-03-COMPOSITE_FUNCTION`
- `H1-RPM-104` 함수 > 함수 > 역함수 > 역함수 구하기 · `H15-SB-03-INVERSE_FUNCTION`
- `H1-RPM-105` 함수 > 함수 > 역함수 > 그래프 대칭 · `H15-SB-03-INVERSE_FUNCTION`
- `H1-RPM-106` 함수 > 함수 > 함수의 성질 > 일대일함수 · `H15-SB-03-FUNCTION_RELATION`
- `H1-RPM-107` 함수 > 함수 > 함수의 성질 > 항등함수·상수함수 · `H15-SB-03-FUNCTION_RELATION`
- `H1-RPM-273` 함수 > 함수 > 합성함수 > 합성함수 계산 · `H15-SB-03-COMPOSITE_FUNCTION`
- `H1-RPM-274` 함수 > 함수 > 합성함수 > 합성함수 계산 · `H15-SB-03-COMPOSITE_FUNCTION`
- `H1-RPM-282` 함수 > 함수 > 역함수 > 그래프 대칭 · `H15-SB-03-INVERSE_FUNCTION`
- `H1-RPM-284` 함수 > 함수 > 함수의 성질 > 일대일함수 · `H15-SB-03-FUNCTION_RELATION`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_COMPOSITE_FUNCTION_ANALYSIS` **합성함수의 그래프와 치역** — 합성함수의 그래프·치역·교점·넓이·최댓값과 최솟값을 분석하는 문제 유형.
  - `TPL_COMPOSITE_EXTREMUM` 합성함수의 최댓값·최솟값
  - `TPL_COMPOSITE_PIECEWISE_GRAPH_ANALYSIS` 합성함수의 구간별 그래프 분석
  - `TPL_COMPOSITE_RANGE` 합성함수의 치역
- `PT_COMPOSITION_EQUATION` **합성함수 방정식과 부등식** — 합성함수가 포함된 방정식·부등식·실근 개수 조건을 해결하는 문제 유형.
  - `TPL_COMPOSITION_EQUATION_SOLVE` 합성함수 방정식 풀기
  - `TPL_COMPOSITION_INEQUALITY` 합성함수 부등식 풀기
  - `TPL_COMPOSITION_ROOT_COUNT_PARAMETER` 합성함수 방정식의 실근 개수와 매개변수
- `PT_COMPOSITION_EVALUATION` **합성함수의 계산** — 합성 순서를 따라 합성함수의 값 또는 역함수가 포함된 합성값을 계산하는 문제 유형.
  - `TPL_COMPOSITION_GRAPH_TRACE_VALUE` 그래프에서 합성함숫값 역추적
  - `TPL_COMPOSITION_VALUE_DIRECT` 합성함숫값 직접 계산
  - `TPL_COMPOSITION_VALUE_MAPPING` 대응도에서 합성함숫값 계산
  - `TPL_COMPOSITION_WITH_INVERSE_VALUE` 역함수가 포함된 합성함숫값 계산
- `PT_COMPOSITION_PROPERTIES` **합성함수의 성질** — 합성함수의 교환성·닫힘 등 합성 자체의 대수적 성질을 분석하는 문제 유형.
  - `TPL_COMPOSITION_RELATION_CONDITION` 합성함수의 관계 조건
- `PT_DOMAIN_RANGE_SURJECTIVITY` **정의역·공역·치역** — 정의역·공역·치역을 판정하거나, 치역이 공역 전체와 일치하기 위한 조건을 다루는 문제 유형.
  - `TPL_DOMAIN_CODOMAIN_RANGE_CONDITION` 정의역·공역·치역의 판정과 조건
  - `TPL_FUNCTION_DOMAIN_RANGE_DIRECT` 정의역·치역 직접 구하기
  - `TPL_FUNCTION_DOMAIN_RANGE_EXTREMUM` 정의역·치역에서 최댓값·최솟값 구하기
  - `TPL_FUNCTION_DOMAIN_RANGE_PARAMETER` 정의역·치역의 매개변수 조건
  - `TPL_RANGE_ENUMERATION` 치역 구하기
  - `TPL_SURJECTIVITY_CONDITION` 공역과 치역이 일치하는 조건
- `PT_FINITE_BIJECTION` **유한집합의 일대일대응** — 유한집합에서 하나 이상의 일대일대응을 조건에 따라 완성하고 함수값을 추론하는 문제 유형.
  - `TPL_FINITE_BIJECTION_COMPOSITION_DEDUCTION` 합성함수 조건으로 일대일대응 결정
  - `TPL_FINITE_BIJECTION_DIRECT_DEDUCTION` 주어진 함수값으로 일대일대응 결정
  - `TPL_FINITE_BIJECTION_INVERSE_DEDUCTION` 역함수 조건으로 일대일대응 결정
  - `TPL_MULTIPLE_BIJECTIONS_DEDUCTION` 여러 일대일대응의 관계로 함수값 결정
- `PT_FUNCTION_COUNTING` **함수의 개수** — 주어진 조건을 만족하는 함수 또는 특정 종류의 함수 개수를 세는 문제 유형.
  - `TPL_BASIC_FUNCTION_TYPE_COUNT` 함수·일대일대응·상수함수 등의 개수
  - `TPL_CONSTRAINED_FUNCTION_COUNT` 조건을 만족하는 함수의 개수
  - `TPL_FUNCTION_COUNT_VALUE_RESTRICTION_AND_ORDER` 함수값 제한과 순서 조건을 결합한 함수 개수
  - `TPL_IDENTITY_DOMAIN_COUNT` 항등함수가 되는 정의역의 개수
  - `TPL_INJECTIVE_BIJECTION_COUNT` 일대일함수·일대일대응의 개수
  - `TPL_MONOTONE_FUNCTION_COUNT` 증가·감소 조건이 있는 함수의 개수
  - `TPL_SURJECTION_COUNT` 치역과 공역이 같은 함수의 개수
- `PT_FUNCTION_DEFINITION_JUDGMENT` **함수의 뜻과 판정** — 함수의 정의에 따라 대응 또는 그래프가 함수인지 판정하는 문제 유형.
  - `TPL_FUNCTION_JUDGMENT_GRAPH` 함수의 그래프 판정
  - `TPL_FUNCTION_JUDGMENT_MAPPING` 대응이 함수인지 판정
- `PT_FUNCTION_EQUALITY` **서로 같은 함수** — 같은 정의역에서 두 함수가 서로 같기 위한 조건이나 가능한 정의역을 구하는 문제 유형.
  - `TPL_EQUAL_FUNCTION_DOMAIN_SELECTION` 두 함수가 같아지는 정의역 구하기
  - `TPL_EQUAL_FUNCTION_FINITE_DOMAIN` 유한 정의역에서 두 함수가 같은 조건
- `PT_FUNCTION_GRAPH_GEOMETRY` **함수 그래프와 도형** — 함수 그래프와 점·선·거리·넓이·격자점 등 도형적 관계를 함께 분석하는 문제 유형.
  - `TPL_FUNCTION_GRAPH_GEOMETRY_DERIVATION` 그래프의 도형 관계에서 식 유도하기
  - `TPL_FUNCTION_GRAPH_GEOMETRY_DISTANCE_LENGTH` 그래프 위 점의 거리·길이 구하기
  - `TPL_FUNCTION_GRAPH_GEOMETRY_LATTICE` 그래프와 격자점 관계
  - `TPL_FUNCTION_GRAPH_GEOMETRY_PARALLELOGRAM` 함수 그래프 평행사변형
  - `TPL_FUNCTION_GRAPH_GEOMETRY_STRIP` 함수 간격 일정 넓이
  - `TPL_FUNCTION_GRAPH_GEOMETRY_TRACE` 그래프 좌표 추적
  - `TPL_FUNCTION_GRAPH_GEOMETRY_TRIANGLE_AREA` 교점 삼각형 넓이
  - `TPL_GRAPH_AREA_BY_SYMMETRY` 그래프와 직선으로 둘러싸인 넓이
  - `TPL_SINE_INSCRIBED_RECTANGLE_AREA` 사인함수의 대칭성과 내접 직사각형 면적
- `PT_FUNCTION_GRAPH_INTERSECTION` **함수 그래프의 교점** — 두 함수 또는 함수와 직선·절댓값 그래프의 교점 개수·위치·접함 조건을 구하는 문제 유형.
  - `TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE` 절댓값·조각함수 그래프의 교점
  - `TPL_FUNCTION_INTERSECTION_DISTANCE_RATIO` 교점의 거리·비 조건
  - `TPL_FUNCTION_INTERSECTION_TANGENCY_SINGLE` 접함 조건으로 교점 하나 만들기
  - `TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS` 두 함수 그래프의 교점
  - `TPL_GRAPH_INTERSECTION_COUNT` 그래프의 교점 개수
  - `TPL_PERIODIC_SYMMETRY_INTERSECTION` 대칭·주기 그래프의 교점 개수
  - `TPL_SINE_HORIZONTAL_PHASE_INTERSECTION` 사인곡선 수평 교점의 위상 합 제약
- `PT_FUNCTION_GRAPH_PROPERTIES` **함수 그래프의 성질** — 대칭성·위치관계·그래프의 형태 등 함수 그래프의 성질을 판정하는 문제 유형.
  - `TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT` 함수 그래프의 성질 판정
  - `TPL_FUNCTION_GRAPH_SYMMETRY` 함수 그래프의 대칭성
  - `TPL_GRAPH_ORDER_INTERVAL` 그래프의 대소 관계
  - `TPL_TRIG_ABSOLUTE_PERIOD_COMBINATION` 절댓값 및 합성 삼각함수의 최소주기 합
- `PT_FUNCTION_RECOVERY` **함수식 구하기** — 합성관계나 입력 치환 등으로 미지 함수의 식 또는 필요한 함수값을 복원하는 문제 유형.
  - `TPL_FUNCTION_FORM_FROM_ASYMPTOTE_POINT` 점근선과 한 점으로 함수식 구하기
  - `TPL_FUNCTION_FORM_FROM_GRAPH` 그래프의 특징으로 함수식 구하기
  - `TPL_FUNCTION_FORM_FROM_POINT_VALUE` 점·함숫값 조건으로 함수식 구하기
  - `TPL_FUNCTION_FORM_FROM_RELATION_SYMMETRY` 함수 관계·대칭 조건으로 함수식 구하기
  - `TPL_RECOVER_FUNCTION_BY_INPUT_CHANGE` 입력 치환으로 함수식 구하기
  - `TPL_RECOVER_FUNCTION_FROM_COMPOSITION` 합성관계에서 함수식 구하기
- `PT_FUNCTION_VALUE` **함숫값 계산** — 주어진 함수식·대응·조각조건에서 특정 입력의 함숫값을 구하는 문제 유형.
  - `TPL_FUNCTION_VALUE_DIRECT` 함숫값 직접 계산
- `PT_FUNCTIONAL_EQUATION` **함수방정식** — 모든 입력에 대해 성립하는 함수 관계식에 값을 대입·치환하여 새로운 관계나 함수값을 구하는 문제 유형.
  - `TPL_FUNCTIONAL_EQUATION_ADDITIVE` 가법형 함수방정식
  - `TPL_FUNCTIONAL_EQUATION_DIFFERENTIAL_INVARIANT` 함수방정식 미분으로 불변식 구성
  - `TPL_FUNCTIONAL_EQUATION_MULTIPLICATIVE` 곱셈형 함수방정식
  - `TPL_FUNCTIONAL_EQUATION_SYMMETRY` 대입으로 대칭·배수 관계 구하기
- `PT_H1_COMPOSITE_INVERSE_FUNCTION` **합성함수와 역함수의 값 계산** — 합성함수와 역함수의 정의를 이용하여 방정식을 만족하는 값을 순차적으로 구하는 유형.
  - `TPL_H1_PIECEWISE_ITERATED_INVERSE_EVALUATION` 역함수 합성값의 순차 대입
- `PT_H1_FUNCTION_COUNTING_CONDITIONS` **조건을 만족하는 함수의 개수** — 정의역과 공역의 제한 및 대소 조건을 만족하는 함수의 개수를 조합으로 세는 유형.
  - `TPL_H1_RESTRICTED_CODOMAIN_ORDER_FUNCTION_COUNT` 치역 후보 축소 후 대소 선택
- `PT_INVERSE_COMPOSITION` **역함수와 합성함수** — 합성함수의 역함수 공식과 항등관계를 이용해 합성식을 정리하거나 값을 구하는 문제 유형.
  - `TPL_INVERSE_COMPOSITION_FORMULA` 합성함수의 역함수 공식
  - `TPL_INVERSE_COMPOSITION_VALUE` 역함수와 합성함수의 값 계산
  - `TPL_INVERSE_CONJUGATION` f⁻¹∘g∘f 형태의 합성
  - `TPL_INVERSE_IDENTITY_RELATION` f∘f⁻¹과 항등함수 관계
- `PT_INVERSE_GRAPH` **역함수의 그래프** — y=x 대칭을 이용해 함수와 역함수 그래프의 교점·접점·거리·넓이를 다루는 문제 유형.
  - `TPL_INVERSE_GRAPH_GEOMETRY` 역함수 그래프의 대칭을 이용한 거리·넓이
  - `TPL_INVERSE_GRAPH_INTERSECTION` 함수와 역함수의 교점·접점
- `PT_INVERSE_PROPERTIES` **역함수의 성질** — 자기역함수 등 역함수의 성질을 판정하거나 함수와 역함수가 함께 들어간 방정식을 해결하는 문제 유형.
  - `TPL_FUNCTION_INVERSE_EQUATION` 함수와 역함수가 포함된 방정식
  - `TPL_INVERSE_PROPERTY_JUDGMENT` 역함수의 성질 판정
- `PT_INVERSE_VALUE` **역함수 구하기와 함수값** — 역함수의 식을 구하거나 역함숫값을 계산하는 문제 유형.
  - `TPL_INVERSE_AFFINE_INPUT` f(ax+b)의 역함수
  - `TPL_INVERSE_FUNCTION_FORM` 역함수 식 구하기
  - `TPL_INVERSE_VALUE_DIRECT` 역함숫값 직접 구하기
  - `TPL_INVERSE_VALUE_GRAPH_MAPPING` 그래프·대응도에서 역함숫값 읽기
- `PT_ITERATED_COMPOSITION` **반복합성** — f^n과 같은 반복합성의 규칙·주기·고정점·원상 구조를 이용하는 문제 유형.
  - `TPL_ITERATION_EQUATION_GRAPH` 여러 번 합성한 함수의 방정식·그래프
  - `TPL_ITERATION_FIXED_POINT_PREIMAGE` f∘f=f의 고정점과 원상
  - `TPL_ITERATION_IDENTITY_ORDER` fⁿ=I인 반복합성
  - `TPL_ITERATION_PERIOD` 반복합성의 주기
  - `TPL_ITERATION_RULE` 반복합성의 규칙
- `PT_ONE_TO_ONE_BIJECTION` **일대일함수와 일대일대응** — 일대일함수·일대일대응 여부 또는 이를 만족시키는 정의역·치역·매개변수 조건을 구하는 문제 유형.
  - `TPL_ABSOLUTE_VALUE_INJECTIVITY` 절댓값 함수의 일대일 조건
  - `TPL_AFFINE_INTERVAL_BIJECTION` 일차함수의 구간 일대일대응
  - `TPL_BIJECTION_JUDGMENT_CONDITION` 일대일함수·일대일대응의 판정과 조건
  - `TPL_PIECEWISE_RANGE_STITCH_BIJECTION` 조각함수의 일대일대응 조건
  - `TPL_QUADRATIC_DOMAIN_BIJECTION` 이차함수의 정의역 제한과 일대일대응
- `PT_RECURSIVE_FUNCTION` **재귀적으로 정의된 함수** — 다른 함수값을 다시 입력으로 사용하는 재귀적 정의를 반복 적용하여 함수값의 패턴을 찾는 문제 유형.
  - `TPL_RECURSIVE_FUNCTION_VALUES` 재귀식으로 함수값 반복 계산
- `PT_SPECIAL_FUNCTION_PROPERTIES` **여러 가지 함수의 성질** — 항등함수·상수함수 등 여러 가지 함수의 성질을 이용해 함수값이나 조건을 결정하는 문제 유형.
  - `TPL_CONSTANT_FUNCTION_PREIMAGE` 상수함수가 되기 위한 같은 함수값의 개수
  - `TPL_SPECIAL_FUNCTION_DIRECT` 항등함수·상수함수 직접 적용
  - `TPL_SPECIAL_FUNCTION_RELATION` 여러 가지 함수의 성질로 함수값 결정

## H15-SB-04 유리함수

### 소단원

- `H15-SB-04-RATIONAL_APPLICATION` 유리함수의 활용
- `H15-SB-04-RATIONAL_BASIC` 유리함수의 뜻과 계산
- `H15-SB-04-RATIONAL_GRAPH` 유리함수의 그래프

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H1-RPM-108` 함수 > 유리함수 > 유리함수의 그래프 > 기본 그래프 · `H15-SB-04-RATIONAL_GRAPH`
- `H1-RPM-109` 함수 > 유리함수 > 유리함수의 그래프 > 평행이동 · `H15-SB-04-RATIONAL_GRAPH`
- `H1-RPM-110` 함수 > 유리함수 > 점근선과 위치 > 점근선 · `H15-SB-04-RATIONAL_GRAPH`
- `H1-RPM-111` 함수 > 유리함수 > 점근선과 위치 > 그래프의 사분면 · `H15-SB-04-RATIONAL_GRAPH`
- `H1-RPM-112` 함수 > 유리함수 > 유리함수의 활용 > 식 결정 · `H15-SB-04-RATIONAL_APPLICATION`
- `H1-RPM-113` 함수 > 유리함수 > 유리함수의 활용 > 유리함수의 최대·최소 · `H15-SB-04-RATIONAL_APPLICATION`
- `H1-RPM-114` 함수 > 유리함수 > 유리함수의 활용 > 유리함수와 그래프의 교점 · `H15-SB-04-RATIONAL_APPLICATION`
- `H1-RPM-279` 함수 > 유리함수 > 점근선과 위치 > 그래프의 사분면 · `H15-SB-04-RATIONAL_GRAPH`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_FUNCTION_EXTREMUM` **함수의 최댓값·최솟값** — 함수의 값, 거리·넓이·둘레 또는 매개변수 조건에서 최댓값·최솟값을 구하는 문제 유형.
  - `TPL_FUNCTION_EXTREMUM_BOUND_COEFFICIENT` 범위 조건으로 계수의 최댓값·최솟값 구하기
  - `TPL_FUNCTION_EXTREMUM_DISTANCE_AREA_PERIMETER` 거리·넓이·둘레의 최댓값·최솟값
  - `TPL_FUNCTION_EXTREMUM_INEQUALITY` 부등식 경계
  - `TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT` 구간 끝점과 함수의 최댓값·최솟값
  - `TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL` 매개변수 함수의 최댓값·최솟값
  - `TPL_FUNCTION_EXTREMUM_QUADRATIC` 이차식 환원
  - `TPL_FUNCTION_EXTREMUM_SUB_QUADRATIC` 치환범위 이차식 극값
- `PT_FUNCTION_GRAPH_GEOMETRY` **함수 그래프와 도형** — 함수 그래프와 점·선·거리·넓이·격자점 등 도형적 관계를 함께 분석하는 문제 유형.
  - `TPL_FUNCTION_GRAPH_GEOMETRY_DERIVATION` 그래프의 도형 관계에서 식 유도하기
  - `TPL_FUNCTION_GRAPH_GEOMETRY_DISTANCE_LENGTH` 그래프 위 점의 거리·길이 구하기
  - `TPL_FUNCTION_GRAPH_GEOMETRY_LATTICE` 그래프와 격자점 관계
  - `TPL_FUNCTION_GRAPH_GEOMETRY_PARALLELOGRAM` 함수 그래프 평행사변형
  - `TPL_FUNCTION_GRAPH_GEOMETRY_STRIP` 함수 간격 일정 넓이
  - `TPL_FUNCTION_GRAPH_GEOMETRY_TRACE` 그래프 좌표 추적
  - `TPL_FUNCTION_GRAPH_GEOMETRY_TRIANGLE_AREA` 교점 삼각형 넓이
  - `TPL_GRAPH_AREA_BY_SYMMETRY` 그래프와 직선으로 둘러싸인 넓이
  - `TPL_SINE_INSCRIBED_RECTANGLE_AREA` 사인함수의 대칭성과 내접 직사각형 면적
- `PT_FUNCTION_GRAPH_INTERSECTION` **함수 그래프의 교점** — 두 함수 또는 함수와 직선·절댓값 그래프의 교점 개수·위치·접함 조건을 구하는 문제 유형.
  - `TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE` 절댓값·조각함수 그래프의 교점
  - `TPL_FUNCTION_INTERSECTION_DISTANCE_RATIO` 교점의 거리·비 조건
  - `TPL_FUNCTION_INTERSECTION_TANGENCY_SINGLE` 접함 조건으로 교점 하나 만들기
  - `TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS` 두 함수 그래프의 교점
  - `TPL_GRAPH_INTERSECTION_COUNT` 그래프의 교점 개수
  - `TPL_PERIODIC_SYMMETRY_INTERSECTION` 대칭·주기 그래프의 교점 개수
  - `TPL_SINE_HORIZONTAL_PHASE_INTERSECTION` 사인곡선 수평 교점의 위상 합 제약
- `PT_FUNCTION_GRAPH_PROPERTIES` **함수 그래프의 성질** — 대칭성·위치관계·그래프의 형태 등 함수 그래프의 성질을 판정하는 문제 유형.
  - `TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT` 함수 그래프의 성질 판정
  - `TPL_FUNCTION_GRAPH_SYMMETRY` 함수 그래프의 대칭성
  - `TPL_GRAPH_ORDER_INTERVAL` 그래프의 대소 관계
  - `TPL_TRIG_ABSOLUTE_PERIOD_COMBINATION` 절댓값 및 합성 삼각함수의 최소주기 합
- `PT_FUNCTION_GRAPH_QUADRANT` **함수 그래프와 사분면** — 함수 그래프가 지나는 사분면 또는 다른 함수와의 사분면 관계를 판정하는 문제 유형.
  - `TPL_FUNCTION_QUADRANT_DIRECT` 함수 그래프가 지나는 사분면
  - `TPL_FUNCTION_QUADRANT_FROM_OTHER_FUNCTION` 다른 함수와 비교한 사분면 관계
  - `TPL_FUNCTION_QUADRANT_PARAMETER` 매개변수에 따른 사분면 조건
- `PT_FUNCTION_GRAPH_TRANSFORM` **함수 그래프의 변환** — 평행이동·대칭이동으로 함수 그래프 사이의 관계를 해석하는 문제 유형.
  - `TPL_FUNCTION_GRAPH_TRANSFORM_ASYMPTOTE_POINT` 이동 그래프 계수 복원
  - `TPL_FUNCTION_GRAPH_TRANSLATION` 함수 그래프의 평행이동
  - `TPL_FUNCTION_GRAPH_TRANSLATION_REFLECTION` 함수 그래프의 평행이동과 대칭이동
- `PT_FUNCTION_RECOVERY` **함수식 구하기** — 합성관계나 입력 치환 등으로 미지 함수의 식 또는 필요한 함수값을 복원하는 문제 유형.
  - `TPL_FUNCTION_FORM_FROM_ASYMPTOTE_POINT` 점근선과 한 점으로 함수식 구하기
  - `TPL_FUNCTION_FORM_FROM_GRAPH` 그래프의 특징으로 함수식 구하기
  - `TPL_FUNCTION_FORM_FROM_POINT_VALUE` 점·함숫값 조건으로 함수식 구하기
  - `TPL_FUNCTION_FORM_FROM_RELATION_SYMMETRY` 함수 관계·대칭 조건으로 함수식 구하기
  - `TPL_RECOVER_FUNCTION_BY_INPUT_CHANGE` 입력 치환으로 함수식 구하기
  - `TPL_RECOVER_FUNCTION_FROM_COMPOSITION` 합성관계에서 함수식 구하기
- `PT_H1_FUNCTION_COEFFICIENT_SIGNS` **그래프에서 함수의 계수 부호 판정** — 무리함수 그래프의 시작점과 방향에서 계수의 부호를 정하고, 유리함수 그래프의 점근선과 절편으로 지나는 사분면을 판정하는 유형.
  - `TPL_H1_IRRATIONAL_TO_RATIONAL_GRAPH_QUADRANTS` 무리함수 계수 부호로 유리함수 사분면 판정
- `PT_H1_ITERATED_COMPOSITE_FUNCTION` **반복 합성함수의 값** — 함수를 여러 번 합성한 f^n의 주기성이나 규칙을 이용하여 함숫값을 구하는 유형.
  - `TPL_H1_RATIONAL_FUNCTION_PERIODIC_ITERATION` f²=x 주기 확인 후 지수 축소
- `PT_H1_RATIONAL_EXPRESSION_IDENTITY` **유리식 항등식의 미정계수 결정** — 분모가 0이 아닌 모든 x에서 성립하는 유리식 항등식의 분자 계수를 비교하여 미지의 상수를 구하는 유형.
  - `TPL_H1_PARTIAL_FRACTION_UNDETERMINED_COEFFICIENTS` 부분분수 통분 후 계수 비교
- `PT_H1_RATIONAL_FUNCTION_SYMMETRY` **유리함수의 대칭 중심과 미지수 결정** — 유리함수 그래프의 대칭 중심과 함숫값 조건을 이용하여 계수를 구하는 유형.
  - `TPL_H1_RATIONAL_SYMMETRY_CENTER_POINT_PARAMETER` 대칭 중심과 함숫값으로 계수 결정
- `PT_H1_RATIONAL_FUNCTION_TRANSLATION` **유리함수 그래프의 평행이동 판별** — 여러 유리함수의 식을 표준형으로 변형하여 주어진 그래프와 평행이동 관계에 있는 것을 판별하는 유형.
  - `TPL_H1_RATIONAL_FUNCTION_SUPERIMPOSITION_K_MATCH` 표준형 계수 비교로 평행이동 판별
- `PT_H1_RATIONAL_LINE_INTERSECTION_DISTANCE` **유리함수와 직선의 교점 거리 최솟값** — 유리함수 그래프와 직선의 두 교점 사이 거리의 최솟값을 근과 계수의 관계로 구하는 유형.
  - `TPL_H1_HYPERBOLA_CHORD_MINIMUM_DISTANCE` 교점 거리 제곱의 최솟값
- `PT_INVERSE_GRAPH` **역함수의 그래프** — y=x 대칭을 이용해 함수와 역함수 그래프의 교점·접점·거리·넓이를 다루는 문제 유형.
  - `TPL_INVERSE_GRAPH_GEOMETRY` 역함수 그래프의 대칭을 이용한 거리·넓이
  - `TPL_INVERSE_GRAPH_INTERSECTION` 함수와 역함수의 교점·접점
- `PT_INVERSE_PROPERTIES` **역함수의 성질** — 자기역함수 등 역함수의 성질을 판정하거나 함수와 역함수가 함께 들어간 방정식을 해결하는 문제 유형.
  - `TPL_FUNCTION_INVERSE_EQUATION` 함수와 역함수가 포함된 방정식
  - `TPL_INVERSE_PROPERTY_JUDGMENT` 역함수의 성질 판정
- `PT_INVERSE_VALUE` **역함수 구하기와 함수값** — 역함수의 식을 구하거나 역함숫값을 계산하는 문제 유형.
  - `TPL_INVERSE_AFFINE_INPUT` f(ax+b)의 역함수
  - `TPL_INVERSE_FUNCTION_FORM` 역함수 식 구하기
  - `TPL_INVERSE_VALUE_DIRECT` 역함숫값 직접 구하기
  - `TPL_INVERSE_VALUE_GRAPH_MAPPING` 그래프·대응도에서 역함숫값 읽기
- `PT_ITERATED_COMPOSITION` **반복합성** — f^n과 같은 반복합성의 규칙·주기·고정점·원상 구조를 이용하는 문제 유형.
  - `TPL_ITERATION_EQUATION_GRAPH` 여러 번 합성한 함수의 방정식·그래프
  - `TPL_ITERATION_FIXED_POINT_PREIMAGE` f∘f=f의 고정점과 원상
  - `TPL_ITERATION_IDENTITY_ORDER` fⁿ=I인 반복합성
  - `TPL_ITERATION_PERIOD` 반복합성의 주기
  - `TPL_ITERATION_RULE` 반복합성의 규칙
- `PT_ONE_TO_ONE_BIJECTION` **일대일함수와 일대일대응** — 일대일함수·일대일대응 여부 또는 이를 만족시키는 정의역·치역·매개변수 조건을 구하는 문제 유형.
  - `TPL_ABSOLUTE_VALUE_INJECTIVITY` 절댓값 함수의 일대일 조건
  - `TPL_AFFINE_INTERVAL_BIJECTION` 일차함수의 구간 일대일대응
  - `TPL_BIJECTION_JUDGMENT_CONDITION` 일대일함수·일대일대응의 판정과 조건
  - `TPL_PIECEWISE_RANGE_STITCH_BIJECTION` 조각함수의 일대일대응 조건
  - `TPL_QUADRATIC_DOMAIN_BIJECTION` 이차함수의 정의역 제한과 일대일대응
- `PT_RATIONAL_ASYMPTOTE` **유리함수의 점근선** — 유리함수의 수직·수평 점근선을 구하거나 점근선과 관련된 매개변수·도형 관계를 이용하는 문제 유형.
  - `TPL_RATIONAL_ASYMPTOTE_DIRECT` 유리함수의 점근선 직접 구하기
  - `TPL_RATIONAL_ASYMPTOTE_GEOMETRY` 점근선과 도형 관계
  - `TPL_RATIONAL_ASYMPTOTE_MODEL` 모델 관계에서 점근선 조건 이용하기
- `PT_RATIONAL_EXPRESSION` **유리식의 계산** — 유리식을 통분·약분·부분분수·망원합 등으로 정리하고 값을 구하는 문제 유형.
  - `TPL_RATIONAL_EXPRESSION_IDENTIFICATION` 유리식 판정
  - `TPL_RATIONAL_EXPRESSION_SIMPLIFY` 유리식 간단히 하기
  - `TPL_RATIONAL_NESTED_FRACTION` 복분수형 유리식 정리
  - `TPL_RATIONAL_PARTIAL_FRACTION` 부분분수로 유리식 정리
  - `TPL_RATIONAL_TELESCOPING_SUM` 유리식의 망원합

## H15-SB-05 무리함수

### 소단원

- `H15-SB-05-IRRATIONAL_BASIC` 무리함수의 뜻과 계산
- `H15-SB-05-IRRATIONAL_GRAPH` 무리함수의 그래프
- `H15-SB-05-IRRATIONAL_INVERSE` 무리함수와 역함수

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H1-RPM-115` 함수 > 무리함수 > 무리함수의 그래프 > 기본 그래프 · `H15-SB-05-IRRATIONAL_GRAPH`
- `H1-RPM-116` 함수 > 무리함수 > 무리함수의 그래프 > 평행이동 · `H15-SB-05-IRRATIONAL_GRAPH`
- `H1-RPM-117` 함수 > 무리함수 > 정의역과 치역 > 정의역 조건 · `H15-SB-05-IRRATIONAL_GRAPH`
- `H1-RPM-118` 함수 > 무리함수 > 정의역과 치역 > 그래프 위치 · `H15-SB-05-IRRATIONAL_GRAPH`
- `H1-RPM-119` 함수 > 무리함수 > 무리함수의 활용 > 식 결정 · `H15-SB-05-IRRATIONAL_BASIC`
- `H1-RPM-120` 함수 > 무리함수 > 무리함수의 활용 > 무리함수의 역함수 · `H15-SB-05-IRRATIONAL_INVERSE`
- `H1-RPM-121` 함수 > 무리함수 > 무리함수의 활용 > 무리함수의 교점 · `H15-SB-05-IRRATIONAL_BASIC`
- `H1-RPM-275` 함수 > 무리함수 > 정의역과 치역 > 그래프 위치 · `H15-SB-05-IRRATIONAL_GRAPH`
- `H1-RPM-276` 함수 > 무리함수 > 무리함수의 그래프 > 평행이동 · `H15-SB-05-IRRATIONAL_GRAPH`
- `H1-RPM-280` 함수 > 무리함수 > 무리함수의 활용 > 식 결정 · `H15-SB-05-IRRATIONAL_GRAPH`
- `H1-RPM-281` 함수 > 무리함수 > 무리함수의 활용 > 무리함수의 교점 · `H15-SB-05-IRRATIONAL_BASIC`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_DOMAIN_RANGE_SURJECTIVITY` **정의역·공역·치역** — 정의역·공역·치역을 판정하거나, 치역이 공역 전체와 일치하기 위한 조건을 다루는 문제 유형.
  - `TPL_DOMAIN_CODOMAIN_RANGE_CONDITION` 정의역·공역·치역의 판정과 조건
  - `TPL_FUNCTION_DOMAIN_RANGE_DIRECT` 정의역·치역 직접 구하기
  - `TPL_FUNCTION_DOMAIN_RANGE_EXTREMUM` 정의역·치역에서 최댓값·최솟값 구하기
  - `TPL_FUNCTION_DOMAIN_RANGE_PARAMETER` 정의역·치역의 매개변수 조건
  - `TPL_RANGE_ENUMERATION` 치역 구하기
  - `TPL_SURJECTIVITY_CONDITION` 공역과 치역이 일치하는 조건
- `PT_FUNCTION_EXTREMUM` **함수의 최댓값·최솟값** — 함수의 값, 거리·넓이·둘레 또는 매개변수 조건에서 최댓값·최솟값을 구하는 문제 유형.
  - `TPL_FUNCTION_EXTREMUM_BOUND_COEFFICIENT` 범위 조건으로 계수의 최댓값·최솟값 구하기
  - `TPL_FUNCTION_EXTREMUM_DISTANCE_AREA_PERIMETER` 거리·넓이·둘레의 최댓값·최솟값
  - `TPL_FUNCTION_EXTREMUM_INEQUALITY` 부등식 경계
  - `TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT` 구간 끝점과 함수의 최댓값·최솟값
  - `TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL` 매개변수 함수의 최댓값·최솟값
  - `TPL_FUNCTION_EXTREMUM_QUADRATIC` 이차식 환원
  - `TPL_FUNCTION_EXTREMUM_SUB_QUADRATIC` 치환범위 이차식 극값
- `PT_FUNCTION_GRAPH_GEOMETRY` **함수 그래프와 도형** — 함수 그래프와 점·선·거리·넓이·격자점 등 도형적 관계를 함께 분석하는 문제 유형.
  - `TPL_FUNCTION_GRAPH_GEOMETRY_DERIVATION` 그래프의 도형 관계에서 식 유도하기
  - `TPL_FUNCTION_GRAPH_GEOMETRY_DISTANCE_LENGTH` 그래프 위 점의 거리·길이 구하기
  - `TPL_FUNCTION_GRAPH_GEOMETRY_LATTICE` 그래프와 격자점 관계
  - `TPL_FUNCTION_GRAPH_GEOMETRY_PARALLELOGRAM` 함수 그래프 평행사변형
  - `TPL_FUNCTION_GRAPH_GEOMETRY_STRIP` 함수 간격 일정 넓이
  - `TPL_FUNCTION_GRAPH_GEOMETRY_TRACE` 그래프 좌표 추적
  - `TPL_FUNCTION_GRAPH_GEOMETRY_TRIANGLE_AREA` 교점 삼각형 넓이
  - `TPL_GRAPH_AREA_BY_SYMMETRY` 그래프와 직선으로 둘러싸인 넓이
  - `TPL_SINE_INSCRIBED_RECTANGLE_AREA` 사인함수의 대칭성과 내접 직사각형 면적
- `PT_FUNCTION_GRAPH_INTERSECTION` **함수 그래프의 교점** — 두 함수 또는 함수와 직선·절댓값 그래프의 교점 개수·위치·접함 조건을 구하는 문제 유형.
  - `TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE` 절댓값·조각함수 그래프의 교점
  - `TPL_FUNCTION_INTERSECTION_DISTANCE_RATIO` 교점의 거리·비 조건
  - `TPL_FUNCTION_INTERSECTION_TANGENCY_SINGLE` 접함 조건으로 교점 하나 만들기
  - `TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS` 두 함수 그래프의 교점
  - `TPL_GRAPH_INTERSECTION_COUNT` 그래프의 교점 개수
  - `TPL_PERIODIC_SYMMETRY_INTERSECTION` 대칭·주기 그래프의 교점 개수
  - `TPL_SINE_HORIZONTAL_PHASE_INTERSECTION` 사인곡선 수평 교점의 위상 합 제약
- `PT_FUNCTION_GRAPH_PROPERTIES` **함수 그래프의 성질** — 대칭성·위치관계·그래프의 형태 등 함수 그래프의 성질을 판정하는 문제 유형.
  - `TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT` 함수 그래프의 성질 판정
  - `TPL_FUNCTION_GRAPH_SYMMETRY` 함수 그래프의 대칭성
  - `TPL_GRAPH_ORDER_INTERVAL` 그래프의 대소 관계
  - `TPL_TRIG_ABSOLUTE_PERIOD_COMBINATION` 절댓값 및 합성 삼각함수의 최소주기 합
- `PT_FUNCTION_GRAPH_QUADRANT` **함수 그래프와 사분면** — 함수 그래프가 지나는 사분면 또는 다른 함수와의 사분면 관계를 판정하는 문제 유형.
  - `TPL_FUNCTION_QUADRANT_DIRECT` 함수 그래프가 지나는 사분면
  - `TPL_FUNCTION_QUADRANT_FROM_OTHER_FUNCTION` 다른 함수와 비교한 사분면 관계
  - `TPL_FUNCTION_QUADRANT_PARAMETER` 매개변수에 따른 사분면 조건
- `PT_FUNCTION_GRAPH_TRANSFORM` **함수 그래프의 변환** — 평행이동·대칭이동으로 함수 그래프 사이의 관계를 해석하는 문제 유형.
  - `TPL_FUNCTION_GRAPH_TRANSFORM_ASYMPTOTE_POINT` 이동 그래프 계수 복원
  - `TPL_FUNCTION_GRAPH_TRANSLATION` 함수 그래프의 평행이동
  - `TPL_FUNCTION_GRAPH_TRANSLATION_REFLECTION` 함수 그래프의 평행이동과 대칭이동
- `PT_FUNCTION_RECOVERY` **함수식 구하기** — 합성관계나 입력 치환 등으로 미지 함수의 식 또는 필요한 함수값을 복원하는 문제 유형.
  - `TPL_FUNCTION_FORM_FROM_ASYMPTOTE_POINT` 점근선과 한 점으로 함수식 구하기
  - `TPL_FUNCTION_FORM_FROM_GRAPH` 그래프의 특징으로 함수식 구하기
  - `TPL_FUNCTION_FORM_FROM_POINT_VALUE` 점·함숫값 조건으로 함수식 구하기
  - `TPL_FUNCTION_FORM_FROM_RELATION_SYMMETRY` 함수 관계·대칭 조건으로 함수식 구하기
  - `TPL_RECOVER_FUNCTION_BY_INPUT_CHANGE` 입력 치환으로 함수식 구하기
  - `TPL_RECOVER_FUNCTION_FROM_COMPOSITION` 합성관계에서 함수식 구하기
- `PT_H1_IRRATIONAL_EXPRESSION_REAL_CONDITION` **무리식이 실수가 되는 조건** — 근호 안이 0 이상이고 분모가 0이 아니라는 조건을 연립하여 x의 값의 범위를 구하는 유형.
  - `TPL_H1_RADICAL_QUOTIENT_REAL_DOMAIN` 근호 분수식의 정의역 연립
- `PT_H1_IRRATIONAL_EXPRESSION_SIMPLIFICATION` **무리식의 통분과 유리화** — 근호를 포함한 분수식을 통분하고 유리화하여 a+b√m 꼴로 정리하는 유형.
  - `TPL_H1_CONJUGATE_DENOMINATOR_RATIONALIZATION` 켤레를 이용한 통분과 유리화
- `PT_H1_IRRATIONAL_GRAPH_AREA_SYMMETRY` **무리함수 그래프로 둘러싸인 넓이** — 두 무리함수 그래프의 대칭과 합동성을 이용하여 둘러싸인 도형의 넓이를 구하는 유형.
  - `TPL_H1_CUT_AND_PASTE_CONGRUENT_CURVE_AREA` 합동 조각 이동으로 직사각형 등적변형
- `PT_H1_IRRATIONAL_LINE_INTERSECTION` **무리함수와 직선의 접선 조건** — 무리함수와 직선이 한 점에서 만나는 조건에서 판별식 또는 최솟값을 이용하여 매개변수를 구하는 유형.
  - `TPL_H1_IRRATIONAL_CURVE_LINE_TANGENCY_PARAMETER` 제곱 후 판별식 0으로 접선 매개변수
- `PT_INVERSE_GRAPH` **역함수의 그래프** — y=x 대칭을 이용해 함수와 역함수 그래프의 교점·접점·거리·넓이를 다루는 문제 유형.
  - `TPL_INVERSE_GRAPH_GEOMETRY` 역함수 그래프의 대칭을 이용한 거리·넓이
  - `TPL_INVERSE_GRAPH_INTERSECTION` 함수와 역함수의 교점·접점
- `PT_INVERSE_VALUE` **역함수 구하기와 함수값** — 역함수의 식을 구하거나 역함숫값을 계산하는 문제 유형.
  - `TPL_INVERSE_AFFINE_INPUT` f(ax+b)의 역함수
  - `TPL_INVERSE_FUNCTION_FORM` 역함수 식 구하기
  - `TPL_INVERSE_VALUE_DIRECT` 역함숫값 직접 구하기
  - `TPL_INVERSE_VALUE_GRAPH_MAPPING` 그래프·대응도에서 역함숫값 읽기
- `PT_RADICAL_EXPRESSION` **무리식의 계산** — 근호가 포함된 식을 정리하거나 실수 조건과 가능한 값의 범위를 구하는 문제 유형.
  - `TPL_RADICAL_EXPRESSION_APPLICATION` 무리식의 활용
  - `TPL_RADICAL_EXPRESSION_SIMPLIFY` 무리식 간단히 하기
  - `TPL_RADICAL_REAL_VALUE_RANGE` 무리식이 실수가 되는 범위

## H15-SB-06 경우의 수

### 소단원

- `H15-SB-06-COUNTING_APPLICATION` 경우의 수의 활용
- `H15-SB-06-COUNTING_PRINCIPLE` 경우의 수의 기본 원리

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H1-RPM-122` 경우의 수 > 경우의 수와 순열 > 합·곱의 법칙 > 경우를 나누어 세기 · `H15-SB-06-COUNTING_PRINCIPLE`
- `H1-RPM-123` 경우의 수 > 경우의 수와 순열 > 합·곱의 법칙 > 단계별 선택 · `H15-SB-06-COUNTING_PRINCIPLE`
- `H1-RPM-278` 경우의 수 > 경우의 수와 순열 > 합·곱의 법칙 > 단계별 선택 · `H15-SB-06-COUNTING_APPLICATION`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_COUNTING_ARRANGEMENT` **순열** — 서로 다른 대상의 배열, 원순열, 같은 것이 있는 순열 등 순열 구조를 이용해 경우의 수를 구하는 문제유형.
  - `TPL_CIRCULAR_PERMUTATION` 원순열
  - `TPL_COUNTING_ARRANGEMENT_PATH` 격자 경로
  - `TPL_COUNTING_ARRANGEMENT_ROTATION` 회전 중복
  - `TPL_H1_ARRANGEMENT_LEXICOGRAPHIC_RANK` 사전식 순열 순위·역순위
  - `TPL_IDENTICAL_OBJECT_PERMUTATION` 같은 것이 있는 순열
  - `TPL_PERMUTATION_STANDARD_CONSTRAINT` 일반 순열·조건 배열
- `PT_COUNTING_SELECTION_DISTRIBUTION` **조합·중복조합** — 조합·중복조합을 이용하여 대상을 선택하거나 동일한 대상을 분배하는 경우의 수를 구하는 문제유형.
  - `TPL_COMBINATION_SELECTION` 조합과 선택
  - `TPL_H1_BINOMIAL_IDENTITY_CHECK` 조합 항등식 증명·판정
  - `TPL_H1_BINOMIAL_PARAMETER_RELATION` 순열·조합 관계로 매개변수 결정
  - `TPL_H1_SELECTION_BOX_IDENTITY` 상자 배정에서 동일·서로 다른 대상 구분
  - `TPL_H1_SELECTION_CAPACITY_DISTRIBUTION` 수용량 제약이 있는 대상 분배
  - `TPL_H1_SELECTION_GEOMETRIC_DEGENERACY` 기하 점 선택 후 퇴화 경우 제외
  - `TPL_REPEATED_COMBINATION_DISTRIBUTION` 중복조합·정수해·동일물 분배
- `PT_FUNCTION_COUNTING` **함수의 개수** — 주어진 조건을 만족하는 함수 또는 특정 종류의 함수 개수를 세는 문제 유형.
  - `TPL_BASIC_FUNCTION_TYPE_COUNT` 함수·일대일대응·상수함수 등의 개수
  - `TPL_CONSTRAINED_FUNCTION_COUNT` 조건을 만족하는 함수의 개수
  - `TPL_FUNCTION_COUNT_VALUE_RESTRICTION_AND_ORDER` 함수값 제한과 순서 조건을 결합한 함수 개수
  - `TPL_IDENTITY_DOMAIN_COUNT` 항등함수가 되는 정의역의 개수
  - `TPL_INJECTIVE_BIJECTION_COUNT` 일대일함수·일대일대응의 개수
  - `TPL_MONOTONE_FUNCTION_COUNT` 증가·감소 조건이 있는 함수의 개수
  - `TPL_SURJECTION_COUNT` 치역과 공역이 같은 함수의 개수
- `PT_H1_COMBINATORIAL_GEOMETRY_CIRCLE` **원 위 점으로 만드는 도형의 개수** — 원 위에 같은 간격으로 놓인 점들로 직각삼각형과 직사각형의 개수를 세는 조합 기하 유형.
  - `TPL_H1_REGULAR_POLYGON_RIGHT_TRIANGLE_RECTANGLE` 지름을 이용한 직각삼각형·직사각형 계수
- `PT_H1_COUNTING_PRINCIPLE_GENERAL` **경우의 수의 합·곱 법칙** — 합의 법칙·곱의 법칙, 경우 분해, 경로·색칠·격자 등 일반적인 경우의 수를 세는 유형.
  - `TPL_H1_COUNT_TOURNAMENT_BRACKET` 부전승·대진표 자리 배치
  - `TPL_H1_COUNTING_DIRECT_CASE` 합·곱의 법칙과 경우 분해
  - `TPL_H1_COUNTING_GRAPH_PATH_COLOR` 경로·그래프·색칠 경우의 수
  - `TPL_H1_COUNTING_PRINCIPLE_GENERAL_COMPLEMENT` 여사건 경우의 수
- `PT_H1_DERANGEMENT_COUNTING` **교란순열을 이용한 경우의 수** — 일부만 원래 자리를 지키는 조건에서 고정점을 선택하고 나머지의 완전순열 수를 곱하여 경우의 수를 구하는 유형.
  - `TPL_H1_PARTIAL_FIXED_POINT_DERANGEMENT` 고정점 선택 후 완전순열
- `PT_H1_NUMBER_THEORETIC_COUNTING` **공약수 조건의 경우의 수** — 연속된 자연수 카드에서 두 수가 1 이외의 공약수를 갖는 쌍을 포함배제로 세는 유형.
  - `TPL_H1_NON_COPRIME_PAIR_INCLUSION_EXCLUSION` 소인수별 배수 쌍 포함배제
- `PT_H1_ORDER_CONSTRAINED_TUPLE_COUNTING` **대소 조건이 있는 순서쌍의 개수** — 변수들이 정해진 범위에 있고 대소 관계를 만족하는 순서쌍의 개수를 경우를 나누어 구하는 유형.
  - `TPL_H1_WEAK_INEQUALITY_COMBINATION_WITH_REPETITION` 기준 변수 값별 분기 후 합산

## H15-SB-07 순열

### 소단원

- `H15-SB-07-CIRCULAR_PERMUTATION` 원순열
- `H15-SB-07-PERMUTATION_BASIC` 순열
- `H15-SB-07-PERMUTATION_RESTRICTED` 조건이 있는 순열

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H1-RPM-124` 경우의 수 > 경우의 수와 순열 > 순열 > 일렬 배열 · `H15-SB-07-PERMUTATION_BASIC`
- `H1-RPM-125` 경우의 수 > 경우의 수와 순열 > 순열 > 특정 조건 배열 · `H15-SB-07-PERMUTATION_RESTRICTED`
- `H1-RPM-126` 경우의 수 > 경우의 수와 순열 > 중복·원순열 기초 > 같은 것이 있는 배열 · `H15-SB-07-PERMUTATION_BASIC`
- `H1-RPM-127` 경우의 수 > 경우의 수와 순열 > 중복·원순열 기초 > 원형 배열 · `H15-SB-07-CIRCULAR_PERMUTATION`
- `H1-RPM-283` 경우의 수 > 경우의 수와 순열 > 순열 > 일렬 배열 · `H15-SB-07-PERMUTATION_BASIC`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_COUNTING_ARRANGEMENT` **순열** — 서로 다른 대상의 배열, 원순열, 같은 것이 있는 순열 등 순열 구조를 이용해 경우의 수를 구하는 문제유형.
  - `TPL_CIRCULAR_PERMUTATION` 원순열
  - `TPL_COUNTING_ARRANGEMENT_PATH` 격자 경로
  - `TPL_COUNTING_ARRANGEMENT_ROTATION` 회전 중복
  - `TPL_H1_ARRANGEMENT_LEXICOGRAPHIC_RANK` 사전식 순열 순위·역순위
  - `TPL_IDENTICAL_OBJECT_PERMUTATION` 같은 것이 있는 순열
  - `TPL_PERMUTATION_STANDARD_CONSTRAINT` 일반 순열·조건 배열
- `PT_COUNTING_SELECTION_DISTRIBUTION` **조합·중복조합** — 조합·중복조합을 이용하여 대상을 선택하거나 동일한 대상을 분배하는 경우의 수를 구하는 문제유형.
  - `TPL_COMBINATION_SELECTION` 조합과 선택
  - `TPL_H1_BINOMIAL_IDENTITY_CHECK` 조합 항등식 증명·판정
  - `TPL_H1_BINOMIAL_PARAMETER_RELATION` 순열·조합 관계로 매개변수 결정
  - `TPL_H1_SELECTION_BOX_IDENTITY` 상자 배정에서 동일·서로 다른 대상 구분
  - `TPL_H1_SELECTION_CAPACITY_DISTRIBUTION` 수용량 제약이 있는 대상 분배
  - `TPL_H1_SELECTION_GEOMETRIC_DEGENERACY` 기하 점 선택 후 퇴화 경우 제외
  - `TPL_REPEATED_COMBINATION_DISTRIBUTION` 중복조합·정수해·동일물 분배
- `PT_H1_ADJACENT_GROUP_PERMUTATION` **이웃 조건이 있는 선택과 배열** — 일부를 선택한 뒤 특정 원소들이 모두 이웃하도록 배열하는 경우의 수를 경우별로 구하는 유형.
  - `TPL_H1_SELECTION_AND_ADJACENT_ARRANGEMENT_CASES` 선택 인원에 따른 경우 분할 후 합산
- `PT_H1_CONSTRAINED_PERMUTATION` **사이 간격이 정해진 순열** — 두 문자의 사이에 정해진 수의 문자가 들어가도록 배열하는 방법의 수를 구하는 유형.
  - `TPL_H1_FIXED_SPACING_BLOCK_PERMUTATION` 사이 문자 선택 후 양 끝 교환
- `PT_H1_COUNTING_PRINCIPLE_GENERAL` **경우의 수의 합·곱 법칙** — 합의 법칙·곱의 법칙, 경우 분해, 경로·색칠·격자 등 일반적인 경우의 수를 세는 유형.
  - `TPL_H1_COUNT_TOURNAMENT_BRACKET` 부전승·대진표 자리 배치
  - `TPL_H1_COUNTING_DIRECT_CASE` 합·곱의 법칙과 경우 분해
  - `TPL_H1_COUNTING_GRAPH_PATH_COLOR` 경로·그래프·색칠 경우의 수
  - `TPL_H1_COUNTING_PRINCIPLE_GENERAL_COMPLEMENT` 여사건 경우의 수
- `PT_H1_DICTIONARY_ORDER_PERMUTATION` **사전식 배열의 순위** — 주어진 문자열이 사전식으로 몇 번째에 오는지 앞서는 배열의 수를 세어 구하는 유형.
  - `TPL_H1_LEXICOGRAPHIC_RANK_EVALUATION` 앞서는 접두사별 배열 수 누적

## H15-SB-08 조합

### 소단원

- `H15-SB-08-COMBINATION_APPLICATION` 조합의 활용
- `H15-SB-08-COMBINATION_BASIC` 조합
- `H15-SB-08-COMBINATION_REPETITION` 중복조합

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H1-RPM-128` 경우의 수 > 조합 > 조합의 뜻과 계산 > 조합 계산 · `H15-SB-08-COMBINATION_BASIC`
- `H1-RPM-129` 경우의 수 > 조합 > 조합의 뜻과 계산 > 순열과 조합 구별 · `H15-SB-08-COMBINATION_BASIC`
- `H1-RPM-130` 경우의 수 > 조합 > 조합의 활용 > 선택 조건 · `H15-SB-08-COMBINATION_APPLICATION`
- `H1-RPM-131` 경우의 수 > 조합 > 조합의 활용 > 도형에서의 선택 · `H15-SB-08-COMBINATION_APPLICATION`
- `H1-RPM-132` 경우의 수 > 조합 > 분할·분배 > 선택 후 배치 · `H15-SB-08-COMBINATION_APPLICATION`
- `H1-RPM-133` 경우의 수 > 조합 > 분할·분배 > 조합을 이용한 경우의 수 · `H15-SB-08-COMBINATION_APPLICATION`
- `H1-RPM-277` 경우의 수 > 조합 > 조합의 뜻과 계산 > 조합 계산 · `H15-SB-08-COMBINATION_BASIC`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_COUNTING_SELECTION_DISTRIBUTION` **조합·중복조합** — 조합·중복조합을 이용하여 대상을 선택하거나 동일한 대상을 분배하는 경우의 수를 구하는 문제유형.
  - `TPL_COMBINATION_SELECTION` 조합과 선택
  - `TPL_H1_BINOMIAL_IDENTITY_CHECK` 조합 항등식 증명·판정
  - `TPL_H1_BINOMIAL_PARAMETER_RELATION` 순열·조합 관계로 매개변수 결정
  - `TPL_H1_SELECTION_BOX_IDENTITY` 상자 배정에서 동일·서로 다른 대상 구분
  - `TPL_H1_SELECTION_CAPACITY_DISTRIBUTION` 수용량 제약이 있는 대상 분배
  - `TPL_H1_SELECTION_GEOMETRIC_DEGENERACY` 기하 점 선택 후 퇴화 경우 제외
  - `TPL_REPEATED_COMBINATION_DISTRIBUTION` 중복조합·정수해·동일물 분배
- `PT_H1_CONSECUTIVE_COMBINATION_RATIO` **연속 조합의 비율로 미지수 결정** — 연속한 조합의 비가 주어질 때 조합의 성질로 연립하여 n과 r을 구하는 유형.
  - `TPL_H1_COMBINATION_PROPORTION_SYSTEM_SOLVE` 연속 조합 비의 연립
- `PT_H1_COUNTING_PRINCIPLE_GENERAL` **경우의 수의 합·곱 법칙** — 합의 법칙·곱의 법칙, 경우 분해, 경로·색칠·격자 등 일반적인 경우의 수를 세는 유형.
  - `TPL_H1_COUNT_TOURNAMENT_BRACKET` 부전승·대진표 자리 배치
  - `TPL_H1_COUNTING_DIRECT_CASE` 합·곱의 법칙과 경우 분해
  - `TPL_H1_COUNTING_GRAPH_PATH_COLOR` 경로·그래프·색칠 경우의 수
  - `TPL_H1_COUNTING_PRINCIPLE_GENERAL_COMPLEMENT` 여사건 경우의 수
- `PT_H1_PERMUTATION_COMBINATION_CALCULATION` **순열·조합 공식 계산** — nPr과 nCr의 정의를 이용해 각 값을 계산하고 그 차나 합을 구하는 유형.
  - `TPL_H1_DIRECT_COMBINATION_PERMUTATION_DIFFERENCE` nPr·nCr 직접 계산 후 차
  - `TPL_H1_PERMUTATION_COMBINATION_CALCULATION_CALCULATE` 공식 계산
  - `TPL_H1_PERMUTATION_COMBINATION_CALCULATION_FACTORIAL` 팩토리얼 변형
  - `TPL_H1_PERMUTATION_COMBINATION_CALCULATION_IDENTITY` 성질 판별

## 아래 학년 유형

학년이 같거나 낮은 다른 과목의 유형도 쓸 수 있다 (키의 학년이 시험지 학년 이하이면 받는다). 키 순서이고, 정의·TPL 은 그 과목의 선택표 파일에 있다.

### 중1 수학 (MIDDLE1) · 중1 — 파일 `MIDDLE1.md`

- `PT_ABSOLUTE_VALUE_SIGN_EXTREMES` 절댓값 조건에서 가능한 극값 (TPL 1)
- `PT_ALGEBRAIC_PRODUCT_TERM_RECOVERY` 곱셈식의 빠진 항 복원 (TPL 1)
- `PT_BOUNDED_PRIME_COUNT` 범위 안의 소수 개수 (TPL 1)
- `PT_CIRCLE_ANGLE_RELATIONS` 원주각·중심각과 원의 각 관계 (TPL 11)
- `PT_CONSTRAINED_FACTOR_PAIR` 조건을 만족하는 인수쌍 (TPL 1)
- `PT_COORDINATE_POINT_READING` 좌표평면의 점·관계 해석 (TPL 3)
- `PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION` 정비례·반비례 관계 판별 (TPL 1)
- `PT_DIVISOR_COUNT` 약수의 개수 조건 (TPL 2)
- `PT_EQUAL_ABSOLUTE_VALUE_DIFFERENCE_RECOVERY` 절댓값이 같은 두 수의 차 (TPL 2)
- `PT_EXTREME_PRODUCT_FROM_SELECTED_RATIONALS` 선택한 유리수 곱의 극값 (TPL 2)
- `PT_FUNCTION_GRAPH_INTERSECTION` 함수 그래프의 교점 (TPL 7)
- `PT_FUNCTION_GRAPH_PROPERTIES` 함수 그래프의 성질 (TPL 4)
- `PT_FUNCTION_GRAPH_QUADRANT` 함수 그래프와 사분면 (TPL 3)
- `PT_GRAPH_TO_CONTAINER_SHAPE_INFERENCE` 수위 그래프와 용기 모양 대응 (TPL 2)
- `PT_INTEGER_MEMBERSHIP_COUNT` 정수에 해당하는 값의 개수 (TPL 2)
- `PT_LCM_APPLICATION` 최소공배수의 상황 적용 (TPL 7)
- `PT_LINE_RELATION` 두 직선의 위치 관계 (TPL 5)
- `PT_M1_ALGEBRAIC_EXPRESSION_EVALUATION` 문자식에 수 대입·계산 (TPL 3)
- `PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION` 문장과 식의 대응·표기 검사 (TPL 8)
- `PT_M1_BASIC_CONSTRUCTION` 기본 작도 도구와 절차 (TPL 3)
- `PT_M1_BASIC_GEOMETRY_JUDGMENT` 기본도형의 용어·관계 진술 판단 (TPL 3)
- `PT_M1_CENTRAL_TENDENCY` 대푯값의 해석과 조건 복원 (TPL 9)
- `PT_M1_CIRCLE_MEASURE` 원과 부채꼴
- `PT_M1_COMMON_DIVISIBILITY_FILTER` 공약수·공배수 조건 검사 (TPL 4)
- `PT_M1_CONGRUENCE_DATA_TRANSFER` 합동인 삼각형의 대응 관계 적용 (TPL 10)
- `PT_M1_CONGRUENCE_INVARIANTS` 합동에서 보존되는 성질 (TPL 1)
- `PT_M1_CONGRUENCE_UNIQUENESS` 삼각형 합동·작도 유일조건 (TPL 2)
- `PT_M1_CONTEXT_GRAPH_INTERPRETATION` 상황을 그래프의 변화로 해석 (TPL 7)
- `PT_M1_COORD_TRIANGLE_AREA` 좌표를 이용한 삼각형의 넓이 (TPL 2)
- `PT_M1_COORDINATE_AXIS_DISTANCE` 좌표와 축까지의 거리 (TPL 1)
- `PT_M1_COORDINATE_COMPOSITE_AREA` 좌표·함수와 도형 넓이 결합 (TPL 3)
- `PT_M1_COORDINATE_POINT_CONSTRAINT` 좌표 성분과 점의 위치조건 (TPL 3)
- `PT_M1_COPRIME_TEST_AND_COUNT` 서로소 판정과 범위 개수 (TPL 2)
- `PT_M1_CROSSING_POLYGON_ANGLE_SUM` 교차 다각형의 각의 합 (TPL 1)
- `PT_M1_CUBE_NET_OPPOSITE_FACE_ASSIGNMENT` 정육면체 전개도의 마주 보는 면 (TPL 2)
- `PT_M1_DATA_CATEGORY_PERCENTAGE` 자료 범주의 상대도수 백분율 (TPL 9)
- `PT_M1_DATA_EXTREME_VALUE_SUM` 자료의 최댓값·최솟값 이용 (TPL 1)
- `PT_M1_DATA_ORDER_AND_VALUE` 자료의 순서 통계량 해석 (TPL 1)
- `PT_M1_DIVISOR` 약수
- `PT_M1_DIVISOR_MULTIPLE_EXPONENT` 소인수 지수로 약수·배수 판별 (TPL 3)
- `PT_M1_EQUAL_SUM` 같은 합
- `PT_M1_EQUATION` 등식과 방정식
- `PT_M1_FACTOR_PAIR` 인수쌍
- `PT_M1_FINITE_LIST_PRIME_COUNT` 유한 목록의 소수 개수 (TPL 1)
- `PT_M1_FREQUENCY` 도수분포
- `PT_M1_FREQUENCY_DISTRIBUTION_READING` 도수분포표·다각형의 누적 해석 (TPL 8)
- `PT_M1_GCD_DIVISOR_APPLICATION` 공약수의 최댓값 적용 (TPL 2)
- `PT_M1_GCD_LCM` 최대공약수와 최소공배수
- `PT_M1_GCD_LCM_EXPONENT_CONSTRAINT` 최대공약수·최소공배수의 소인수 지수 조건 (TPL 6)
- `PT_M1_GENERATED_GEOMETRIC_OBJECT_COUNT` 점에서 결정되는 직선·반직선·선분 개수 (TPL 2)
- `PT_M1_IDENTITY` 항등식
- `PT_M1_INEQUALITY` 부등식
- `PT_M1_INTERSECTING_ANGLE_RELATIONS` 교차선·맞꼭지각의 계산 (TPL 5)
- `PT_M1_INVERSE` 반비례
- `PT_M1_INVERSE_PROPORTION_INTEGER_POINT_ENUMERATION` 반비례 그래프의 정수 좌표 (TPL 1)
- `PT_M1_INVERSE_PROPORTION_REGION_POINT_COUNT` 반비례 그래프 영역의 격자점 개수 (TPL 1)
- `PT_M1_INVERSE_PROPORTION_WORK_APPLICATION` 반비례 관계의 작업량 활용 (TPL 2)
- `PT_M1_LINEAR_EQUATION_MODELING` 상황을 일차방정식으로 나타내기 (TPL 2)
- `PT_M1_LINEAR_EQUATION_SOLVING` 일차방정식의 성질·풀이 (TPL 7)
- `PT_M1_LINEAR_EXPRESSION_STRUCTURE` 일차식의 항·계수와 정리 (TPL 7)
- `PT_M1_LITERAL` 문자식의 표현
- `PT_M1_LITERAL_EXPRESSION_EVALUATION` 문자식에 값 대입·계산 (TPL 5)
- `PT_M1_LITERAL_VALUE` 식의 값
- `PT_M1_MIDPOINT_PROJECTION_TRIANGLE_AREA` 중점의 정사영과 삼각형 넓이 (TPL 1)
- `PT_M1_MULTIPLE` 배수
- `PT_M1_PARALLEL_ANGLE_POSITION` 동위각·엇각의 위치 판정 (TPL 5)
- `PT_M1_PARALLEL_ANGLE_TRANSFER` 평행선 각의 이동·계산 (TPL 8)
- `PT_M1_PARALLELISM_CONVERSE` 각 조건으로 평행 판정 (TPL 1)
- `PT_M1_PATTERN` 규칙성
- `PT_M1_PERP_DISTANCE` 수선과 거리
- `PT_M1_POINT_TO_LINE_PERPENDICULAR_DISTANCE` 점과 직선 사이의 수선 거리 (TPL 2)
- `PT_M1_POLYGON_ANGLE_AND_COUNT` 다각형의 각·대각선과 변 수 관계 (TPL 13)
- `PT_M1_POLYGON_CLASSIFICATION` 다각형의 정의에 따른 분류 (TPL 1)
- `PT_M1_POLYHEDRON_COMPONENT_COUNT` 다면체의 꼭짓점·모서리·면 개수 (TPL 2)
- `PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS` 다면체의 모서리·면 관계 (TPL 10)
- `PT_M1_POLYNOMIAL` 다항식
- `PT_M1_POWER` 거듭제곱
- `PT_M1_POWER_BASE_EXPONENT_EVALUATION` 거듭제곱의 밑·지수·값 (TPL 1)
- `PT_M1_PRIME` 소수
- `PT_M1_PRIME_COMPOSITE_JUDGMENT` 소수와 합성수 판별 (TPL 3)
- `PT_M1_PRIME_FACTOR` 소인수분해
- `PT_M1_PRIME_FACTOR_STRUCTURE` 소인수 구조 판별 (TPL 4)
- `PT_M1_PRIME_FACTORIZATION_JUDGMENT` 거듭제곱과 소인수분해 진술 판단 (TPL 4)
- `PT_M1_PROPORTION` 정비례
- `PT_M1_PROPORTION_PARAMETER_EVALUATION` 정비례·반비례 상수와 값 계산 (TPL 7)
- `PT_M1_PROPORTIONAL_GRAPH_SEGMENT_DIVISION` 정비례 그래프의 좌표와 선분 분할 (TPL 1)
- `PT_M1_QUADRANT_SIGN_DEDUCTION` 좌표 부호와 사분면의 추론 (TPL 4)
- `PT_M1_RATIO` 비례식
- `PT_M1_RATIONAL_ARITHMETIC` 정수와 유리수의 사칙계산 (TPL 10)
- `PT_M1_RATIONAL_CLASS` 정수와 유리수
- `PT_M1_RATIONAL_INTERVAL_INTEGER_COUNT` 유리수 구간의 정수 개수 (TPL 3)
- `PT_M1_RATIONAL_OPERATION_RULE_JUDGMENT` 수의 연산 법칙·변형 검사 (TPL 5)
- `PT_M1_RATIONAL_PROPERTY_JUDGMENT` 정수·유리수와 절댓값의 성질 판단 (TPL 4)
- `PT_M1_RATIONAL_VALUE_COMPARISON` 유리수의 순서와 계산값 비교 (TPL 12)
- `PT_M1_RECOVER_VALUE_BY_INVERSE_OPERATION` 유리수 관계의 역산 (TPL 4)
- `PT_M1_REGULAR_POLYGON_COMPOSITE_ANGLE` 정다각형을 결합한 각 계산 (TPL 4)
- `PT_M1_REGULAR_POLYGON_TESSELLATION` 정다각형의 평면 채우기 (TPL 1)
- `PT_M1_RIGHT_TRAPEZOID_PROPERTY_CHECK` 직각사다리꼴의 성질 판단 (TPL 1)
- `PT_M1_ROTATION_SOLID_GENERATION` 평면도형을 회전시켜 생기는 입체 (TPL 1)
- `PT_M1_ROTATION_SOLID_PROPERTIES` 회전체의 단면 성질 (TPL 5)
- `PT_M1_SEGMENT_LENGTH_RELATIONS` 선분 분할·중점과 길이 계산 (TPL 4)
- `PT_M1_SIGNED_CHANGE_MODEL` 부호 있는 변화량의 해석과 계산 (TPL 5)
- `PT_M1_SOLID_FIGURE_MEASURE` 입체도형의 겉넓이·부피 계산 (TPL 12)
- `PT_M1_SPATIAL_LINE_PLANE_RELATIONS` 공간 직선·평면의 위치관계 (TPL 5)
- `PT_M1_SQUARE_CONFIGURATION_CONGRUENCE_AND_AREA` 정사각형 배치의 합동과 넓이 (TPL 2)
- `PT_M1_SQUARE_COORDINATES_AND_GRAPH_COEFFICIENTS` 정사각형 좌표와 비례 상수 (TPL 1)
- `PT_M1_SQUARE_NUMBER` 제곱수
- `PT_M1_STAR_POLYGON_ANGLE_SUM` 별 모양 도형의 각의 합 (TPL 1)
- `PT_M1_STEM_LEAF` 줄기와 잎
- `PT_M1_STEM_LEAF_PLACEHOLDER_EVALUATION` 줄기·잎 그림의 빠진 값 (TPL 2)
- `PT_M1_STRAIGHT_ANGLE_PARTITION` 평각의 인접각 분할과 비 (TPL 1)
- `PT_M1_TRANSLATION` 문자식의 활용
- `PT_M1_TRAPEZOID_AREA` 사다리꼴의 넓이·높이 계산 (TPL 1)
- `PT_M1_TRIANGLE_ANGLE_CHASE` 삼각형의 내각·외각 연쇄 계산 (TPL 5)
- `PT_M1_TRIANGLE_ANGLE_CONDITION` 삼각형의 각 조건 계산 (TPL 5)
- `PT_M1_TRIANGLE_AREA` 삼각형 넓이
- `PT_M1_TRIANGLE_CONSTRUCTION_ORDER` 삼각형의 작도 순서와 선행조건 (TPL 2)
- `PT_M1_TRIANGLE_SIDE_FEASIBILITY` 삼각형 성립조건과 가능한 변 세기 (TPL 4)
- `PT_MAGIC_SQUARE_ENTRY_RECOVERY` 마방진의 빠진 값 (TPL 1)
- `PT_MINIMUM_COMMON_MULTIPLIER_FOR_RATIONALS` 유리수의 최소 공통 배수 인자 (TPL 1)
- `PT_MINIMUM_FACTOR_TO_PERFECT_SQUARE` 완전제곱수가 되는 최소 인자 (TPL 3)
- `PT_MISSING_VALUES_FROM_EQUAL_SIDE_SUMS` 같은 변의 합에서 빠진 수 (TPL 1)
- `PT_MOVE_FOLDING_REFLECTION` 접기와 대칭이동 (TPL 3)
- `PT_PERPENDICULAR_FOOT_ON_SOLID_EDGE` 입체 모서리의 수선의 발 (TPL 1)
- `PT_PRIME_EXPONENT_IN_CONSECUTIVE_PRODUCT` 연속된 수의 곱에서 소인수 지수 (TPL 1)
- `PT_QUADRILATERAL_PROPERTIES` 사각형의 성질과 판정 (TPL 4)
- `PT_RATIONAL_EXPRESSION_BOUNDED_INTEGER_SUM` 유리수식과 범위 정수의 합 (TPL 1)
- `PT_RIGHT_TRIANGLE_CONGRUENCE` 직각삼각형의 합동 (TPL 3)
- `PT_SIGN_CONSTRAINT_DEDUCTION_FOR_RATIONALS` 유리수 곱·차 조건에서 부호 추론 (TPL 1)
- `PT_TRIANGLE_AREA_FROM_SQUARE_EQUILATERAL_POSITION` 정사각형·정삼각형 배치의 넓이 (TPL 1)

### 중2 수학 (MIDDLE2) · 중2 — 파일 `MIDDLE2.md`

- `PT_CIRCLE_LINE_RELATION` 원과 직선 (TPL 8)
- `PT_COORD_CENTROID` 삼각형의 무게중심 (TPL 6)
- `PT_COUNTING_ARRANGEMENT` 순열 (TPL 6)
- `PT_FUNCTION_GRAPH_GEOMETRY` 함수 그래프와 도형 (TPL 9)
- `PT_FUNCTION_GRAPH_INTERSECTION` 함수 그래프의 교점 (TPL 7)
- `PT_FUNCTION_GRAPH_PROPERTIES` 함수 그래프의 성질 (TPL 4)
- `PT_FUNCTION_GRAPH_QUADRANT` 함수 그래프와 사분면 (TPL 3)
- `PT_FUNCTION_VALUE` 함숫값 계산 (TPL 1)
- `PT_H1_EQUATION_APPLICATION` 방정식의 활용 (TPL 2)
- `PT_H1_LINEAR_SYSTEM_INEQUALITY` 일차·연립부등식 (TPL 5)
- `PT_H1_SYSTEM_EQUATION` 연립방정식과 공통근 (TPL 2)
- `PT_ISOSCELES_TRIANGLE` 이등변삼각형의 성질 (TPL 5)
- `PT_LINE_EQUATION` 직선의 방정식 구하기 (TPL 8)
- `PT_LINE_INTERSECTION_CONDITION` 직선의 교점과 위치 조건 (TPL 6)
- `PT_LINE_RELATION` 두 직선의 위치 관계 (TPL 5)
- `PT_M1_LINEAR_EQUATION_MODELING` 상황을 일차방정식으로 나타내기 (TPL 2)
- `PT_M2_BASIC_COUNTING_CASE_SPLIT` 합의 법칙으로 경우의 수 나누어 세기 (TPL 2)
- `PT_M2_CENTROID` 삼각형의 무게중심
- `PT_M2_COUNTING` 경우의 수
- `PT_M2_EXPONENT_LAWS` 지수법칙
- `PT_M2_FIGURE_AREA` 도형의 넓이
- `PT_M2_FINITE_DECIMAL` 유한소수
- `PT_M2_FUNCTION` 함수
- `PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION` 함수와 일차함수 판별 (TPL 3)
- `PT_M2_FUNCTION_VALUE_PRIME_COUNT` 소수 개수 함숫값 계산 (TPL 1)
- `PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE` 부등식 성질 적용의 옳고 그름 판별 (TPL 2)
- `PT_M2_INVERSE_PROPORTION` 반비례
- `PT_M2_LINEAR_EQUATION` 일차방정식
- `PT_M2_LINEAR_EQUATION_GRAPH` 일차방정식의 그래프
- `PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES` 일차방정식 그래프 설명 판정 (TPL 2)
- `PT_M2_LINEAR_EQUATION_PARALLEL_TO_Y_AXIS` y축에 평행한 직선의 방정식 (TPL 1)
- `PT_M2_LINEAR_EQUATION_POINT_SUBSTITUTION` 그래프 위의 점을 이용한 미지수 결정 (TPL 2)
- `PT_M2_LINEAR_EQUATION_TO_LINEAR_FUNCTION_STANDARD_FORM` 일차방정식의 그래프 찾기 (TPL 2)
- `PT_M2_LINEAR_FUNCTION` 일차함수
- `PT_M2_LINEAR_FUNCTION_CONDITIONS_MATCHING` 기울기·절편 조건에 맞는 일차함수 선택 (TPL 1)
- `PT_M2_LINEAR_FUNCTION_QUADRANT_CONDITION` 제1사분면을 지나지 않을 매개변수 범위 (TPL 3)
- `PT_M2_LINEAR_FUNCTION_SOLID_OF_REVOLUTION` 절편 삼각형을 회전한 원뿔 부피 (TPL 1)
- `PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION` 평행이동한 일차함수 결정 (TPL 4)
- `PT_M2_LINEAR_FUNCTION_WORD_PROBLEM_TEMPERATURE` 고도에 따른 기온 변화 일차함수 (TPL 1)
- `PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA` 두 일차함수와 좌표축이 둘러싼 넓이 (TPL 2)
- `PT_M2_LINEAR_FUNCTIONS_GRAPH_INTERSECTION_APPLICATION` 두 운동 그래프의 교점으로 만나는 시각 (TPL 1)
- `PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION` 평행 조건으로 미지의 좌표 결정 (TPL 2)
- `PT_M2_LINEAR_INEQUALITY` 일차부등식
- `PT_M2_LINEAR_INEQUALITY_IDENTIFICATION` 일차부등식 판별 (TPL 1)
- `PT_M2_LINEAR_INEQUALITY_NATURAL_ROOTS_SUM` 부등식의 자연수 해 합 계산 (TPL 1)
- `PT_M2_LINEAR_INEQUALITY_NO_NATURAL_ROOTS` 자연수 해가 없을 조건의 매개변수 범위 (TPL 1)
- `PT_M2_LINEAR_INEQUALITY_SOLVING` 일차부등식 풀이 결과 검증 (TPL 1)
- `PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED` 왕복 이동 시간 제한 활용 (TPL 1)
- `PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_WATER_TANK` 물탱크 용량 부등식 활용 (TPL 1)
- `PT_M2_LINEAR_SYSTEM` 연립일차방정식
- `PT_M2_LOGICAL_CONSTRAINT` 조건 추론
- `PT_M2_MONOMIAL` 단항식
- `PT_M2_MONOMIAL_MULTIPLICATION_DIVISION` 단항식 곱셈·나눗셈의 옳고 그름 판별 (TPL 2)
- `PT_M2_PARALLELOGRAM_OPPOSITE_SIDES_PROOF` 평행사변형의 대변 성질 증명 (TPL 1)
- `PT_M2_POLYNOMIAL` 다항식
- `PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION` 잘못 더한 다항식의 바른 계산 복원 (TPL 2)
- `PT_M2_POLYNOMIAL_CYLINDER_VOLUME_RATIO` 직사각형 회전체 두 부피의 비 (TPL 1)
- `PT_M2_POLYNOMIAL_DIVISION_GEOMETRIC_AREA` 다항식 넓이에서 삼각형 높이 계산 (TPL 1)
- `PT_M2_POLYNOMIAL_GEOMETRIC_FOLDING_AREA` 접힌 삼각형의 넓이 계산 (TPL 1)
- `PT_M2_PROBABILITY` 확률
- `PT_M2_PYTHAGOREAN_RELATION` 피타고라스 정리·역 및 도형 활용 (TPL 8)
- `PT_M2_RATIO_DISTRIBUTION` 비와 비례배분
- `PT_M2_REPEATING_DECIMAL` 순환소수
- `PT_M2_SYSTEM_INEQUALITY` 연립부등식
- `PT_M2_SYSTEM_OF_EQUATIONS_ADDITION_SUBTRACTION_METHOD` 가감법 소거식 선택 (TPL 1)
- `PT_M2_SYSTEM_OF_EQUATIONS_COEFFICIENT_SWAP` 계수를 바꾼 연립방정식의 해 복원 (TPL 1)
- `PT_M2_SYSTEM_OF_EQUATIONS_COMMON_SOLUTION` 공통해를 이용한 미정계수 결정 (TPL 1)
- `PT_M2_SYSTEM_OF_EQUATIONS_DECIMAL_COEFFICIENTS` 소수 계수 연립방정식 풀이 (TPL 2)
- `PT_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION` 연립방정식의 해와 그래프 교점 (TPL 4)
- `PT_M2_SYSTEM_OF_EQUATIONS_INTERSECTION_QUADRANT` 교점의 사분면 조건으로 매개변수 범위 (TPL 1)
- `PT_M2_SYSTEM_OF_EQUATIONS_NO_SOLUTION` 해가 없을 조건으로 계수 결정 (TPL 1)
- `PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_COST` 물건 수량과 총액으로 단가 결정 (TPL 1)
- `PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_DIGITS` 자릿수 관계로 세 자리 수 복원 (TPL 1)
- `PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_GAME` 가위바위보 계단 문제 (TPL 2)
- `PT_M2_TRIANGLE_ANGLE` 삼각형의 각
- `PT_M2_TRIANGLE_CONGRUENCE` 삼각형의 합동
- `PT_M2_TWO_VARIABLE_LINEAR_EQUATION` 미지수가 두 개인 일차방정식
- `PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION` 평행선 조건으로 넓이가 같은 삼각형 찾기 (TPL 1)
- `PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT` 평행사변형의 각 이등분선이 만드는 선분 계산 (TPL 2)
- `PT_MG_PARALLELOGRAM_ANGLE_BISECTORS_RECTANGLE` 평행사변형 내각 이등분선이 만드는 사각형의 성질 판정 (TPL 1)
- `PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION` 평행사변형이 되지 않는 조건 판별 (TPL 1)
- `PT_MG_PARALLELOGRAM_CONDITIONS_SYMBOLIC` 평행사변형이 되는 다섯 조건의 기호 표현 (TPL 1)
- `PT_MG_PARALLELOGRAM_INTERNAL_POINT_AREA` 평행사변형 내부 점과 반대 삼각형 넓이 (TPL 1)
- `PT_MG_PARALLELOGRAM_SIDES_RATIO_PERIMETER` 평행사변형 둘레와 변의 비로 한 변 계산 (TPL 1)
- `PT_MG_PARALLELOGRAM_TO_RECTANGLE_CONDITIONS` 평행사변형이 직사각형이 되는 조건 선별 (TPL 1)
- `PT_MG_PARALLELOGRAM_TO_SQUARE_CLASSIFICATION` 평행사변형에서 정사각형 판별 (TPL 1)
- `PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS` 사각형 계통도에서 단계별 추가 조건 완성 (TPL 1)
- `PT_MG_QUADRILATERALS_DIAGONAL_EQUAL_LENGTH` 대각선의 길이가 같은 사각형 개수 세기 (TPL 1)
- `PT_MG_RHOMBUS_DIAGONAL_AND_ANGLES` 마름모 대각선과 두 각의 합 계산 (TPL 2)
- `PT_MG_TRAPEZOID_TRIANGLES_AREA_RATIO` 사다리꼴 대각선 비로 삼각형 넓이 계산 (TPL 1)
- `PT_PARALLEL_SEGMENT_RATIO` 평행선과 선분의 길이의 비 (TPL 3)
- `PT_PROBABILITY_PROPERTIES_APPLICATION` 확률의 기본 성질과 활용 (TPL 3)
- `PT_PROBABILITY_REPEATED_TRIALS` 독립시행의 확률 (TPL 2)
- `PT_QUADRILATERAL_PROPERTIES` 사각형의 성질과 판정 (TPL 4)
- `PT_RIGHT_TRIANGLE_CONGRUENCE` 직각삼각형의 합동 (TPL 3)
- `PT_SIMILAR_FIGURES` 닮은 도형 (TPL 4)
- `PT_TRIANGLE_ANGLE_BISECTOR` 삼각형의 각의 이등분선 (TPL 2)
- `PT_TRIANGLE_CENTERS` 삼각형의 외심·내심 (TPL 5)
- `PT_TRIANGLE_SIMILARITY` 삼각형의 닮음 (TPL 2)

### 중3 수학 (MIDDLE3) · 중3 — 파일 `MIDDLE3.md`

- `PT_CIRCLE_ANGLE_RELATIONS` 원주각·중심각과 원의 각 관계 (TPL 11)
- `PT_CIRCLE_LINE_RELATION` 원과 직선 (TPL 8)
- `PT_CIRCLE_TANGENT` 원의 접선 (TPL 16)
- `PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE` 중앙값과 최빈값 결정 (TPL 6)
- `PT_M3_CIRCLE_CHORD` 원의 현
- `PT_M3_CIRCLE_POWER` 원의 방멱
- `PT_M3_CIRCLE_TANGENT` 원의 접선
- `PT_M3_DISPERSION_BAR_GRAPH_COMPARISON` 막대그래프로 산포도 비교 (TPL 1)
- `PT_M3_DISPERSION_DEVIATION_PROPERTIES` 편차의 성질 활용 (TPL 10)
- `PT_M3_DISPERSION_FREQUENCY_TABLE` 도수분포표에서 분산 계산 (TPL 1)
- `PT_M3_FIGURE_AREA` 도형의 넓이
- `PT_M3_INTEGER_POINTS` 격자점
- `PT_M3_IRRATIONAL` 무리수
- `PT_M3_LINEAR_TRANSFORMATION_STATISTICS` 변량의 선형변환과 평균·분산 (TPL 3)
- `PT_M3_PERFECT_POWER` 완전거듭제곱
- `PT_M3_POLY_FACTORIZATION` 다항식의 인수분해와 활용 (TPL 22)
- `PT_M3_POLY_MULTIPLICATION` 다항식의 곱셈과 곱셈공식 (TPL 10)
- `PT_M3_QUADRATIC_EQUATION` 이차방정식
- `PT_M3_QUADRATIC_EQUATION_DISCRIMINANT` 판별식으로 근의 유리수 여부 판정 (TPL 2)
- `PT_M3_QUADRATIC_EQUATION_DOUBLE_ROOT` 중근 조건 판정 (TPL 6)
- `PT_M3_QUADRATIC_EQUATION_HOMOGENEOUS_RATIO` 동차 이차식에서 변수 비 결정 (TPL 1)
- `PT_M3_QUADRATIC_EQUATION_ROOT_COUNT` 서로 다른 실근의 개수 판정 (TPL 3)
- `PT_M3_QUADRATIC_EQUATION_ROOT_IDENTIFICATION` 이차방정식의 해 판별 (TPL 2)
- `PT_M3_QUADRATIC_EQUATION_ROOT_ISOLATION` 근의 분리(두 근 사이 조건) (TPL 1)
- `PT_M3_QUADRATIC_EQUATION_ROOT_SUBSTITUTION` 근의 관계식 대입으로 식의 값 계산 (TPL 2)
- `PT_M3_QUADRATIC_EQUATION_SQUARE_ROOT_METHOD` 제곱근을 이용한 이차방정식 풀이 (TPL 5)
- `PT_M3_QUADRATIC_EQUATION_WORD_PROBLEM` 이차방정식의 실생활 활용 (TPL 5)
- `PT_M3_QUADRATIC_EQUATION_ZERO_PRODUCT` 영인자 성질의 활용 (TPL 5)
- `PT_M3_QUADRATIC_FUNCTION` 이차함수
- `PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY` 증가·감소 구간으로 대칭축 결정 (TPL 1)
- `PT_M3_QUADRATIC_FUNCTION_BASIC_FORM` y=ax^2 꼴 이차함수 식의 결정 (TPL 1)
- `PT_M3_QUADRATIC_FUNCTION_COEFFICIENT_SIGNS` 그래프 개형에서 계수·상수 부호 판정 (TPL 5)
- `PT_M3_QUADRATIC_FUNCTION_COEFFICIENT_SUM` 이차함수의 계수 합 계산 (TPL 1)
- `PT_M3_QUADRATIC_FUNCTION_DEFINITION` 이차함수의 판별 (TPL 3)
- `PT_M3_QUADRATIC_FUNCTION_EXTREMA` 이차함수의 최댓값·최솟값 (TPL 8)
- `PT_M3_QUADRATIC_FUNCTION_GRAPH_GEOMETRY` 포물선과 도형의 융합 (TPL 7)
- `PT_M3_QUADRATIC_FUNCTION_INSCRIBED_RECTANGLE` 포물선에 내접하는 사각형의 최적화 (TPL 1)
- `PT_M3_QUADRATIC_FUNCTION_MONOTONICITY` 이차함수의 증가·감소 구간 (TPL 2)
- `PT_M3_QUADRATIC_FUNCTION_PROPERTIES` 이차함수 그래프의 성질 비교 (TPL 9)
- `PT_M3_QUADRATIC_FUNCTION_QUADRANT_CONDITION` 이차함수 그래프의 사분면 통과 판정 (TPL 5)
- `PT_M3_QUADRATIC_FUNCTION_RANGE` 이차함수의 치역 결정 (TPL 1)
- `PT_M3_QUADRATIC_FUNCTION_THREE_POINTS` 세 점으로 이차함수 식 결정 (TPL 2)
- `PT_M3_QUADRATIC_FUNCTION_TRANSLATION` 이차함수 그래프의 평행이동 (TPL 11)
- `PT_M3_QUADRATIC_FUNCTION_VERTEX_FORM` 꼭짓점·일반형 상호 변환으로 식 결정 (TPL 7)
- `PT_M3_QUADRATIC_FUNCTION_VERTICAL_SEGMENT_MINIMUM` 포물선과 직선 사이 수직 선분의 최솟값 (TPL 1)
- `PT_M3_QUADRATIC_FUNCTION_WORD_PROBLEM` 이차함수의 실생활 활용 (TPL 6)
- `PT_M3_QUADRATIC_FUNCTION_X_INTERCEPTS_DISTANCE` x축 두 교점 사이의 거리 (TPL 1)
- `PT_M3_QUADRATIC_ROOT` 이차방정식의 해
- `PT_M3_RADICAL_CALCULATION` 근호를 포함한 식의 계산 (TPL 10)
- `PT_M3_REAL_NUMBER_CLASSIFICATION` 유리수와 무리수의 판별 (TPL 2)
- `PT_M3_REAL_NUMBER_COMPARISON` 실수의 대소와 범위 판단 (TPL 9)
- `PT_M3_REAL_NUMBER_LINE` 수직선 위 실수의 위치 결정 (TPL 3)
- `PT_M3_REAL_NUMBERS` 실수
- `PT_M3_REPRESENTATIVE` 대푯값
- `PT_M3_ROOT_COEFFICIENT` 근과 계수의 관계
- `PT_M3_ROOT_FORMULA` 근의 공식
- `PT_M3_SCATTER_PLOT_CORRELATION` 산점도와 상관관계 (TPL 2)
- `PT_M3_SQUARE_ROOT_APPLICATION` 제곱근의 기하 활용 (TPL 4)
- `PT_M3_SQUARE_ROOT_PROPERTY` 제곱근의 성질 판별 (TPL 8)
- `PT_M3_SQUARE_ROOT_TABLE` 제곱근표
- `PT_M3_STATISTICS_CONCEPTS_TRUE_FALSE` 편차·분산·표준편차 개념 판정 (TPL 5)
- `PT_M3_STATISTICS_LINE_GRAPH_ANALYSIS` 꺾은선그래프로 대푯값 비교 (TPL 1)
- `PT_M3_VARIANCE` 분산과 표준편차
- `PT_TRIANGLE_ANGLE_BISECTOR` 삼각형의 각의 이등분선 (TPL 2)
- `PT_TRIANGLE_CENTERS` 삼각형의 외심·내심 (TPL 5)
- `PT_TRIANGLE_SIMILARITY` 삼각형의 닮음 (TPL 2)
- `PT_TRIG_RATIO` 삼각비의 값과 관계 (TPL 6)
- `PT_TRIG_RATIO_APPLICATION` 삼각비의 활용 (TPL 3)
- `PT_TWO_CIRCLES` 두 원 (TPL 9)

### 수학(상) (H15_COMMON_SANG) · 고1 — 파일 `H15_COMMON_SANG.md`

- `PT_ABSOLUTE_INEQUALITY_EXTREMUM` 절대부등식의 활용과 최댓값·최솟값 (TPL 8)
- `PT_AREA_BISECTING_LINE` 넓이를 이등분하는 직선 (TPL 2)
- `PT_CIRCLE_EQUATION` 원의 방정식 (TPL 19)
- `PT_CIRCLE_LINE_RELATION` 원과 직선 (TPL 8)
- `PT_CIRCLE_TANGENT` 원의 접선 (TPL 16)
- `PT_COORD_CENTROID` 삼각형의 무게중심 (TPL 6)
- `PT_COORD_DISTANCE` 두 점 사이의 거리 (TPL 3)
- `PT_COORD_DISTANCE_OPTIMIZATION` 거리의 최댓값과 최솟값 (TPL 8)
- `PT_COORD_EQUIDISTANT` 두 점에서 같은 거리에 있는 점 (TPL 3)
- `PT_COORD_FIGURE_PROPERTIES` 좌표를 이용한 도형의 성질 (TPL 3)
- `PT_COORD_MIDPOINT` 선분의 중점 (TPL 2)
- `PT_COORD_SECTION` 선분의 내분과 외분 (TPL 6)
- `PT_COORD_TRIANGLE_AREA` 좌표를 이용한 삼각형의 넓이 (TPL 3)
- `PT_H1_ABSOLUTE_VALUE_EQUATION_INEQUALITY` 절댓값 방정식과 부등식 (TPL 2)
- `PT_H1_COMPLEX_CONDITION_EQUATION` 복소수 조건과 방정식 (TPL 3)
- `PT_H1_COMPLEX_OPERATION` 복소수의 연산과 상등 (TPL 4)
- `PT_H1_COMPLEX_POWER_ROOT` 복소수의 거듭제곱과 단위근 (TPL 2)
- `PT_H1_EQUATION_APPLICATION` 방정식의 활용 (TPL 2)
- `PT_H1_FACTOR_THEOREM` 인수정리 (TPL 5)
- `PT_H1_HIGHER_DEGREE_EQUATION` 고차방정식의 풀이 (TPL 4)
- `PT_H1_LINEAR_SYSTEM_INEQUALITY` 일차·연립부등식 (TPL 5)
- `PT_H1_POLY_DIVISION` 다항식의 나눗셈 (TPL 4)
- `PT_H1_POLY_FACTORIZATION` 다항식의 인수분해 (TPL 3)
- `PT_H1_POLY_FORMULA_SYMMETRIC` 곱셈공식과 대칭식 (TPL 1)
- `PT_H1_POLY_IDENTITY_COEFFICIENT` 항등식과 미정계수 (TPL 2)
- `PT_H1_POLY_OPERATION_EXPANSION` 다항식의 연산과 전개 (TPL 2)
- `PT_H1_QUADRATIC_DISCRIMINANT` 이차방정식의 근과 판별식 (TPL 3)
- `PT_H1_QUADRATIC_EXTREMA` 이차함수의 최대·최소 (TPL 2)
- `PT_H1_QUADRATIC_GRAPH_INTERSECTION` 이차함수의 그래프와 교점 (TPL 3)
- `PT_H1_QUADRATIC_INEQUALITY` 이차부등식과 부호 조건 (TPL 2)
- `PT_H1_QUADRATIC_RECONSTRUCTION` 조건을 이용한 이차함수 결정 (TPL 2)
- `PT_H1_REMAINDER_THEOREM` 나머지정리 (TPL 4)
- `PT_H1_ROOT_COEFFICIENT_RELATION` 근과 계수의 관계 (TPL 3)
- `PT_H1_SYSTEM_EQUATION` 연립방정식과 공통근 (TPL 2)
- `PT_INTERCEPT_OPTIMIZATION` 절편을 이용한 최댓값·최솟값 (TPL 2)
- `PT_LINE_ANGLE_BISECTOR` 두 직선이 이루는 각의 이등분선 (TPL 2)
- `PT_LINE_DISTANCE_EXTREMUM` 점과 직선 사이의 거리의 최댓값·최솟값 (TPL 2)
- `PT_LINE_EQUATION` 직선의 방정식 구하기 (TPL 8)
- `PT_LINE_FAMILY_COMMON_POINT` 정점을 지나는 직선 (TPL 1)
- `PT_LINE_INTERSECTION_CONDITION` 직선의 교점과 위치 조건 (TPL 6)
- `PT_LINE_RELATION` 두 직선의 위치 관계 (TPL 5)
- `PT_MOVE_CIRCLE_REFLECTION` 원의 대칭이동 (TPL 3)
- `PT_MOVE_CIRCLE_TRANSLATION` 원의 평행이동 (TPL 4)
- `PT_MOVE_COMPOSITE` 여러 번의 도형의 이동 (TPL 6)
- `PT_MOVE_EQUATION_TRANSFORM` 방정식으로 나타낸 도형의 이동 (TPL 3)
- `PT_MOVE_FOLDING_REFLECTION` 접기와 대칭이동 (TPL 3)
- `PT_MOVE_GRAPH_REFLECTION` 그래프의 대칭이동 (TPL 1)
- `PT_MOVE_GRAPH_TRANSLATION` 그래프의 평행이동 (TPL 1)
- `PT_MOVE_LINE_REFLECTION` 직선의 대칭이동 (TPL 1)
- `PT_MOVE_LINE_TRANSLATION` 직선의 평행이동 (TPL 4)
- `PT_MOVE_POINT_REFLECTION` 점의 대칭이동 (TPL 5)
- `PT_MOVE_POINT_TRANSLATION` 점의 평행이동 (TPL 2)
- `PT_MOVE_REFLECTION_AXIS` 대칭축 구하기 (TPL 1)
- `PT_MOVE_REFLECTION_SHORTEST` 대칭이동을 이용한 최단거리 (TPL 3)
- `PT_POINT_LINE_DISTANCE` 점과 직선 사이의 거리 (TPL 5)
- `PT_TRIANGLE_INCENTER_FROM_LINES` 세 직선이 이루는 삼각형의 내심 (TPL 2)
- `PT_TWO_CIRCLES` 두 원 (TPL 9)

### 공통수학1 (H22_COMMON1) · 고1 — 파일 `H22_COMMON1.md`

- `PT_ABSOLUTE_INEQUALITY_EXTREMUM` 절대부등식의 활용과 최댓값·최솟값 (TPL 8)
- `PT_COUNTING_ARRANGEMENT` 순열 (TPL 6)
- `PT_COUNTING_REPEATED_ASSIGNMENT` 중복순열 (TPL 1)
- `PT_COUNTING_SELECTION_DISTRIBUTION` 조합·중복조합 (TPL 7)
- `PT_H1_ABSOLUTE_VALUE_EQUATION_INEQUALITY` 절댓값 방정식과 부등식 (TPL 2)
- `PT_H1_COMPLEX_CONDITION_EQUATION` 복소수 조건과 방정식 (TPL 3)
- `PT_H1_COMPLEX_OPERATION` 복소수의 연산과 상등 (TPL 4)
- `PT_H1_COMPLEX_POWER_ROOT` 복소수의 거듭제곱과 단위근 (TPL 2)
- `PT_H1_COUNTING_PRINCIPLE_GENERAL` 경우의 수의 합·곱 법칙 (TPL 4)
- `PT_H1_DIVISOR` 약수
- `PT_H1_EQUATION_APPLICATION` 방정식의 활용 (TPL 2)
- `PT_H1_FACTOR_THEOREM` 인수정리 (TPL 5)
- `PT_H1_HIGHER_DEGREE_EQUATION` 고차방정식의 풀이 (TPL 4)
- `PT_H1_INEQUALITY_APPLICATION` 부등식의 활용 (TPL 3)
- `PT_H1_LINEAR_SYSTEM_INEQUALITY` 일차·연립부등식 (TPL 5)
- `PT_H1_MATRIX_BASIC_OPERATION` 행렬의 기본과 연산 (TPL 3)
- `PT_H1_MATRIX_EQUATION` 행렬 방정식 (TPL 3)
- `PT_H1_MATRIX_MULTIPLICATION` 행렬의 곱셈 (TPL 4)
- `PT_H1_MATRIX_POWER_IDENTITY` 행렬의 거듭제곱과 항등관계 (TPL 5)
- `PT_H1_POLY_DIVISION` 다항식의 나눗셈 (TPL 4)
- `PT_H1_POLY_FACTORIZATION` 다항식의 인수분해 (TPL 3)
- `PT_H1_POLY_FORMULA_SYMMETRIC` 곱셈공식과 대칭식 (TPL 1)
- `PT_H1_POLY_IDENTITY_COEFFICIENT` 항등식과 미정계수 (TPL 2)
- `PT_H1_POLY_OPERATION_EXPANSION` 다항식의 연산과 전개 (TPL 2)
- `PT_H1_QUADRATIC_DISCRIMINANT` 이차방정식의 근과 판별식 (TPL 3)
- `PT_H1_QUADRATIC_EXTREMA` 이차함수의 최대·최소 (TPL 2)
- `PT_H1_QUADRATIC_GRAPH_INTERSECTION` 이차함수의 그래프와 교점 (TPL 3)
- `PT_H1_QUADRATIC_INEQUALITY` 이차부등식과 부호 조건 (TPL 2)
- `PT_H1_QUADRATIC_RECONSTRUCTION` 조건을 이용한 이차함수 결정 (TPL 2)
- `PT_H1_REMAINDER_THEOREM` 나머지정리 (TPL 4)
- `PT_H1_ROOT_COEFFICIENT_RELATION` 근과 계수의 관계 (TPL 3)
- `PT_H1_SYSTEM_EQUATION` 연립방정식과 공통근 (TPL 2)

### 공통수학2 (H22_COMMON2) · 고1 — 파일 `H22_COMMON2.md`

- `PT_ABSOLUTE_INEQUALITY_EXTREMUM` 절대부등식의 활용과 최댓값·최솟값 (TPL 8)
- `PT_ABSOLUTE_INEQUALITY_PROOF` 절대부등식의 증명 (TPL 6)
- `PT_AREA_BISECTING_LINE` 넓이를 이등분하는 직선 (TPL 2)
- `PT_CIRCLE_EQUATION` 원의 방정식 (TPL 19)
- `PT_CIRCLE_LINE_RELATION` 원과 직선 (TPL 8)
- `PT_CIRCLE_TANGENT` 원의 접선 (TPL 16)
- `PT_COMPOSITE_FUNCTION_ANALYSIS` 합성함수의 그래프와 치역 (TPL 3)
- `PT_COMPOSITION_EQUATION` 합성함수 방정식과 부등식 (TPL 3)
- `PT_COMPOSITION_EVALUATION` 합성함수의 계산 (TPL 4)
- `PT_COMPOSITION_PROPERTIES` 합성함수의 성질 (TPL 1)
- `PT_CONTRADICTION_PROOF` 귀류법 (TPL 4)
- `PT_CONTRAPOSITIVE_PROOF` 대우를 이용한 증명 (TPL 2)
- `PT_COORD_CENTROID` 삼각형의 무게중심 (TPL 6)
- `PT_COORD_DISTANCE` 두 점 사이의 거리 (TPL 3)
- `PT_COORD_EQUIDISTANT` 두 점에서 같은 거리에 있는 점 (TPL 3)
- `PT_COORD_FIGURE_PROPERTIES` 좌표를 이용한 도형의 성질 (TPL 3)
- `PT_COORD_SECTION` 선분의 내분과 외분 (TPL 6)
- `PT_DOMAIN_RANGE_SURJECTIVITY` 정의역·공역·치역 (TPL 6)
- `PT_FINITE_BIJECTION` 유한집합의 일대일대응 (TPL 4)
- `PT_FUNCTION_COUNTING` 함수의 개수 (TPL 7)
- `PT_FUNCTION_DEFINITION_JUDGMENT` 함수의 뜻과 판정 (TPL 2)
- `PT_FUNCTION_EQUALITY` 서로 같은 함수 (TPL 2)
- `PT_FUNCTION_EXTREMUM` 함수의 최댓값·최솟값 (TPL 7)
- `PT_FUNCTION_GRAPH_GEOMETRY` 함수 그래프와 도형 (TPL 9)
- `PT_FUNCTION_GRAPH_INTERSECTION` 함수 그래프의 교점 (TPL 7)
- `PT_FUNCTION_GRAPH_PROPERTIES` 함수 그래프의 성질 (TPL 4)
- `PT_FUNCTION_GRAPH_QUADRANT` 함수 그래프와 사분면 (TPL 3)
- `PT_FUNCTION_GRAPH_TRANSFORM` 함수 그래프의 변환 (TPL 3)
- `PT_FUNCTION_RECOVERY` 함수식 구하기 (TPL 6)
- `PT_FUNCTIONAL_EQUATION` 함수방정식 (TPL 4)
- `PT_H1_FUNCTION_MODEL` 함수의 활용
- `PT_H1_INTEGER_REMAINDER` 정수의 나머지
- `PT_H1_LOCUS` 자취
- `PT_INTERCEPT_OPTIMIZATION` 절편을 이용한 최댓값·최솟값 (TPL 2)
- `PT_INVERSE_COMPOSITION` 역함수와 합성함수 (TPL 4)
- `PT_INVERSE_GRAPH` 역함수의 그래프 (TPL 2)
- `PT_INVERSE_PROPERTIES` 역함수의 성질 (TPL 2)
- `PT_INVERSE_VALUE` 역함수 구하기와 함수값 (TPL 4)
- `PT_ITERATED_COMPOSITION` 반복합성 (TPL 5)
- `PT_LINE_DISTANCE_EXTREMUM` 점과 직선 사이의 거리의 최댓값·최솟값 (TPL 2)
- `PT_LINE_EQUATION` 직선의 방정식 구하기 (TPL 8)
- `PT_LINE_INTERSECTION_CONDITION` 직선의 교점과 위치 조건 (TPL 6)
- `PT_LINE_RELATION` 두 직선의 위치 관계 (TPL 5)
- `PT_LOGIC_CHAIN` 논리 관계와 추론 (TPL 2)
- `PT_MOVE_CIRCLE_REFLECTION` 원의 대칭이동 (TPL 3)
- `PT_MOVE_CIRCLE_TRANSLATION` 원의 평행이동 (TPL 4)
- `PT_MOVE_COMPOSITE` 여러 번의 도형의 이동 (TPL 6)
- `PT_MOVE_EQUATION_TRANSFORM` 방정식으로 나타낸 도형의 이동 (TPL 3)
- `PT_MOVE_FOLDING_REFLECTION` 접기와 대칭이동 (TPL 3)
- `PT_MOVE_GRAPH_TRANSLATION` 그래프의 평행이동 (TPL 1)
- `PT_MOVE_LINE_REFLECTION` 직선의 대칭이동 (TPL 1)
- `PT_MOVE_LINE_TRANSLATION` 직선의 평행이동 (TPL 4)
- `PT_MOVE_POINT_REFLECTION` 점의 대칭이동 (TPL 5)
- `PT_MOVE_POINT_TRANSLATION` 점의 평행이동 (TPL 2)
- `PT_MOVE_REFLECTION_SHORTEST` 대칭이동을 이용한 최단거리 (TPL 3)
- `PT_NEC_SUFF_RELATION` 필요조건·충분조건 (TPL 6)
- `PT_ONE_TO_ONE_BIJECTION` 일대일함수와 일대일대응 (TPL 5)
- `PT_PERPENDICULAR_FOOT_ALTITUDE` 수선의 발과 수심 (TPL 2)
- `PT_POINT_LINE_DISTANCE` 점과 직선 사이의 거리 (TPL 5)
- `PT_PROPOSITION_JUDGMENT` 명제와 조건의 판정 (TPL 5)
- `PT_PROPOSITION_PARAMETER_CONDITION` 명제가 참이 되기 위한 조건 (TPL 10)
- `PT_QUANTIFIER_NEGATION` 모든·어떤 명제와 부정 (TPL 5)
- `PT_RADICAL_EXPRESSION` 무리식의 계산 (TPL 3)
- `PT_RATIONAL_ASYMPTOTE` 유리함수의 점근선 (TPL 3)
- `PT_RATIONAL_EXPRESSION` 유리식의 계산 (TPL 5)
- `PT_SET_AGGREGATE` 집합의 원소의 합 (TPL 4)
- `PT_SET_CARDINALITY` 집합의 원소의 개수 (TPL 9)
- `PT_SET_CONSTRUCTION` 조건을 만족하는 집합 (TPL 4)
- `PT_SET_DEFINITION` 집합의 뜻 (TPL 1)
- `PT_SET_ELEMENT_RELATION` 집합의 원소와 부분집합 (TPL 2)
- `PT_SET_EQUALITY` 서로 같은 집합 (TPL 1)
- `PT_SET_EXTREMUM` 집합의 원소의 개수와 합의 최대·최소 (TPL 4)
- `PT_SET_INCLUSION` 집합의 포함 관계 (TPL 4)
- `PT_SET_OPERATION` 집합의 연산 (TPL 5)
- `PT_SET_OPERATION_LAW` 집합의 연산법칙 (TPL 3)
- `PT_SET_REGION_EXPRESSION` 벤다이어그램과 집합의 연산 (TPL 3)
- `PT_SPECIAL_FUNCTION_PROPERTIES` 여러 가지 함수의 성질 (TPL 3)
- `PT_SUBSET_COUNT` 부분집합의 개수 (TPL 9)
- `PT_SUBSET_JUDGMENT` 부분집합의 판정 (TPL 1)
- `PT_TRIANGLE_INCENTER_FROM_LINES` 세 직선이 이루는 삼각형의 내심 (TPL 2)
- `PT_TRUTH_SET_RELATION` 진리집합과 명제의 관계 (TPL 6)
- `PT_TWO_CIRCLES` 두 원 (TPL 9)
