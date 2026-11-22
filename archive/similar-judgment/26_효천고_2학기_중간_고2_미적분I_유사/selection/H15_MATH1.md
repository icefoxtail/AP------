# 선택표 · 수학I (H15_MATH1) · 고2 · 2015 개정

등록부에서 만든 문서다. 손으로 고치지 않는다 (`build-selection-tables.mjs --write`).
판정은 이 표의 키만 쓴다. 개념 단어(한글 이름)로 Ctrl+F 로 먼저 찾고, 없을 때만 NONE + 새 키 제안을 쓴다.
단원 키는 단원 제목의 키, 소단원·RPM 행은 그 단원 안에서 고른다. 유형(PT)과 템플릿(TPL)은 그 단원 것이 먼저이고, 맨 끝 "아래 학년 유형" 의 키도 쓸 수 있다.

## 단원 목차

- `H15-M1-01` 지수의 뜻과 성질 (소단원 2 · RPM 6 · 유형 4)
- `H15-M1-02` 로그의 뜻과 성질 (소단원 2 · RPM 6 · 유형 6)
- `H15-M1-03` 지수함수 (소단원 2 · RPM 8 · 유형 9)
- `H15-M1-04` 로그함수 (소단원 2 · RPM 8 · 유형 8)
- `H15-M1-05` 삼각함수의 뜻과 값 (소단원 2 · RPM 6 · 유형 9)
- `H15-M1-06` 삼각함수의 그래프 (소단원 1 · RPM 6 · 유형 5)
- `H15-M1-07` 삼각방정식과 삼각부등식 (소단원 2 · RPM 2 · 유형 2)
- `H15-M1-08` 등차수열 (소단원 2 · RPM 5 · 유형 2)
- `H15-M1-09` 등비수열 (소단원 2 · RPM 3 · 유형 1)
- `H15-M1-10` 수열의 합 (소단원 1 · RPM 6 · 유형 2)
- `H15-M1-11` 수학적 귀납법 (소단원 1 · RPM 4 · 유형 1)

## H15-M1-01 지수의 뜻과 성질

### 소단원

- `H15-M1-01-EXPONENT` 지수의 뜻과 성질
- `H15-M1-01-LOGARITHM` 로그의 뜻과 성질

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-001` 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근 · `H15-M1-01-EXPONENT`
- `H2-M1-RPM-002` 지수함수와 로그함수 > 지수 > 거듭제곱근 > 실수 조건 · `H15-M1-01-EXPONENT`
- `H2-M1-RPM-003` 지수함수와 로그함수 > 지수 > 지수의 확장 > 유리수 지수 · `H15-M1-01-EXPONENT`
- `H2-M1-RPM-004` 지수함수와 로그함수 > 지수 > 지수의 확장 > 실수 지수 · `H15-M1-01-EXPONENT`
- `H2-M1-RPM-005` 지수함수와 로그함수 > 지수 > 지수법칙 > 지수식 계산 · `H15-M1-01-EXPONENT`
- `H2-M1-RPM-006` 지수함수와 로그함수 > 지수 > 지수법칙 > 조건식 · `H15-M1-01-EXPONENT`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_EXPONENT_CALCULATION` **지수 계산** — 유리수 지수와 지수법칙을 이용하여 거듭제곱식의 값을 계산하는 문제 유형.
  - `TPL_EXPONENT_RATIONAL_POWER_OPERATION` 유리수 지수 변환 계산
  - `TPL_QUADRATIC_ROOTS_EXPONENT_EVALUATION` 이차방정식 근의 합·곱과 지수 계산
- `PT_EXPONENT_LAW_APPLICATION` **지수법칙 적용** — 수학Ⅰ 문항에서 '지수법칙 적용'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 지수식·로그식의 결합 계산; 지수 통일을 통한 삼각함수 비 계산; 거듭제곱근과 로그 성질 진술 검증; 서로 역수인 거듭제곱 치환과 값 결정.
  - `TPL_EXPONENT_LAW_EVALUATION` 지수식·로그식의 결합 계산
  - `TPL_EXPONENT_LAW_RECIPROCAL_POWER` 서로 역수인 거듭제곱 치환과 값 결정
  - `TPL_EXPONENT_LAW_STATEMENT_AUDIT` 거듭제곱근과 로그 성질 진술 검증
  - `TPL_EXPONENT_LAW_TRIG_EXPONENT_COMPARE` 지수 통일을 통한 삼각함수 비 계산
- `PT_EXPONENTIAL_EQUATION` **지수방정식** — 치환이나 밑의 정리를 이용하여 지수방정식의 해를 구하는 문제 유형.
  - `TPL_EXPONENTIAL_EQUATION_QUADRATIC_FORM_ROOTS` 지수 치환 후 이차방정식의 근 판정
  - `TPL_EXPONENTIAL_SUBSTITUTION_EVALUATION` 지수식 치환 대입 계산
- `PT_ROOT_INTEGER_FEASIBILITY` **거듭제곱근의 정수 조건** — 수학Ⅰ 문항에서 '거듭제곱근의 정수 조건'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 거듭제곱근의 정수해 경우의 수.
  - `TPL_ROOT_INTEGER_EXPONENT_CASE_COUNT` 거듭제곱근의 정수해 경우의 수
  - `TPL_ROOT_INTEGER_FEASIBILITY_EXPONENT` 지수 배수 조건

## H15-M1-02 로그의 뜻과 성질

### 소단원

- `H15-M1-02-EXPONENT_LOG_APPLICATION` 지수와 로그의 활용
- `H15-M1-02-LOGARITHM` 로그의 뜻과 성질

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-007` 지수함수와 로그함수 > 로그 > 로그의 뜻 > 로그와 지수 관계 · `H15-M1-02-LOGARITHM`
- `H2-M1-RPM-008` 지수함수와 로그함수 > 로그 > 로그의 뜻 > 밑과 진수 조건 · `H15-M1-02-LOGARITHM`
- `H2-M1-RPM-009` 지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱 · `H15-M1-02-LOGARITHM`
- `H2-M1-RPM-010` 지수함수와 로그함수 > 로그 > 로그의 성질 > 밑의 변환 · `H15-M1-02-LOGARITHM`
- `H2-M1-RPM-011` 지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수 · `H15-M1-02-LOGARITHM`
- `H2-M1-RPM-012` 지수함수와 로그함수 > 로그 > 상용로그 > 소수점 위치 · `H15-M1-02-LOGARITHM`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_LOG_APPLICATION` **로그의 활용** — 로그 성질을 이용해 지수 모델의 기간이나 로그·지수 관계식의 미지수를 구하는 문제 유형.
  - `TPL_LOG_APPLICATION_GROWTH` 증가와 감쇠
  - `TPL_LOG_APPLICATION_LOG_MODEL` 로그 모형 비교
  - `TPL_LOG_APPLICATION_SCALE` 로그 척도
  - `TPL_LOG_EXPONENTIAL_EQUATION_SYSTEM_SOLVE` 로그·지수 관계 연립식 정리
  - `TPL_LOG_EXPONENTIAL_GROWTH_MODEL` 지수성장 배수·기간 모델
  - `TPL_LOG_PH_CONCENTRATION_RATIO_SHIFT` 농도 변화에 따른 pH 차이 계산
- `PT_LOG_DEFINITION_CONDITION` **로그의 정의와 조건** — 로그의 밑·진수 조건 및 로그 정의의 성립 조건을 확인하여 값이나 존재 여부를 판정하는 문제 유형.
  - `TPL_LOG_BASE_ANTILOG_EXISTENCE_CONDITION` 로그 밑·진수 존재 조건
  - `TPL_LOG_PROPERTY_JUDGMENT` 로그 성질과 정의역 조건 판정
- `PT_LOG_DOMAIN_ELIGIBILITY` **로그의 정의 조건 판정** — 수학Ⅰ 문항에서 '로그의 정의 조건 판정'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 로그 밑·진수 조건의 정수해.
  - `TPL_LOG_BASE_ARGUMENT_INTEGER_DOMAIN` 로그 밑·진수 조건의 정수해
  - `TPL_LOG_REAL_DOMAIN_SPLIT` 로그 밑·진수의 실수 열린구간 분리
- `PT_LOG_FLOOR_INTERVAL_ENUMERATION` **로그 바닥함수 구간별 자연수 계수** — 수학I에서 로그 바닥함수 구간별 자연수 계수. 핵심 수학적 목표를 로그 바닥함수의 정수구간을 분할하여 자연수 개수 집계으로 해결한다.
  - `TPL_LOG_FLOOR_INTEGER_INTERVAL_COUNT` 로그 바닥함수 구간별 자연수 계수
- `PT_LOG_IDENTITY_OPERATIONS` **로그 성질과 밑변환의 활용** — 수학Ⅰ 문항에서 '로그 성질과 밑변환의 활용'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 로그차 정수 조건으로 값의 곱 결정; 주어진 로그값으로 복합 로그 표현; 연속 로그 곱의 망원식 간소화.
  - `TPL_LOG_BASE_CHANGE_PARAMETER` 주어진 로그값으로 복합 로그 표현
  - `TPL_LOG_CHANGE_BASE_TELESCOPING` 연속 로그 곱의 망원식 간소화
  - `TPL_LOG_DECAY_EXPONENT_SOLVE` 감쇠 지수모형의 상용로그 역산
  - `TPL_LOG_DOUBLE_QUADRATIC_ROOT` 중근으로 같은 로그값을 얻어 밑 교환
  - `TPL_LOG_EXPONENT_RECIPROCAL_CANCEL` 두 지수방정식의 로그 역수 소거
  - `TPL_LOG_IDENTITY_OPERATIONS_INTEGER_DIFF` 로그차 정수
  - `TPL_LOG_IDENTITY_OPERATIONS_INTEGER_POWER` 로그 정수쌍
  - `TPL_LOG_IDENTITY_OPERATIONS_SYMMETRIC` 로그 대칭식
  - `TPL_LOG_IDENTITY_OPERATIONS_TELESCOPING` 로그합 소거
  - `TPL_LOG_INTEGER_DIFFERENCE_PRODUCT` 로그차 정수 조건으로 값의 곱 결정
  - `TPL_LOG_PRODUCT_GRAPH_ABSCISSA` 로그곱 변환과 그래프 좌표 판독
  - `TPL_LOG_SOUND_DISTANCE_DECIBEL` 거리비 음압의 상용로그 계산
- `PT_MATH1_SYSTEM_INEQUALITY` **연립부등식** — 각 부등식의 정의역과 단조성을 반영하여 해구간을 구한 뒤 공통해를 교집합으로 결정한다.

## H15-M1-03 지수함수

### 소단원

- `H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION` 지수함수의 활용
- `H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH` 지수함수의 그래프

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-013` 지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 증가·감소
- `H2-M1-RPM-014` 지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 평행이동
- `H2-M1-RPM-015` 지수함수와 로그함수 > 지수함수 > 지수방정식 > 밑 통일
- `H2-M1-RPM-016` 지수함수와 로그함수 > 지수함수 > 지수방정식 > 치환 · `H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION`
- `H2-M1-RPM-017` 지수함수와 로그함수 > 지수함수 > 지수부등식 > 밑의 범위에 따른 부등호 · `H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION`
- `H2-M1-RPM-018` 지수함수와 로그함수 > 지수함수 > 지수부등식 > 치환
- `H2-M1-RPM-019` 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 최대·최소
- `H2-M1-RPM-020` 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_EXPONENTIAL_DECAY` **지수적 감소** — 반감기 등 일정 비율로 감소하는 양을 지수모형으로 나타내어 특정 시점의 양이나 기간을 구하는 문제 유형.
  - `TPL_EXPONENTIAL_DECAY_HALF_LIFE` 반감기 지수감소 모델
  - `TPL_EXPONENTIAL_DECAY_RATE` 잔존율
  - `TPL_EXPONENTIAL_DECAY_SCALE` 반복 축소비 복원
- `PT_EXPONENTIAL_EQUATION` **지수방정식** — 치환이나 밑의 정리를 이용하여 지수방정식의 해를 구하는 문제 유형.
  - `TPL_EXPONENTIAL_EQUATION_QUADRATIC_FORM_ROOTS` 지수 치환 후 이차방정식의 근 판정
  - `TPL_EXPONENTIAL_SUBSTITUTION_EVALUATION` 지수식 치환 대입 계산
- `PT_EXPONENTIAL_EQUATION_SUBSTITUTION` **지수방정식의 치환과 근의 개수** — 수학Ⅰ 문항에서 '지수방정식의 치환과 근의 개수'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 합성지수의 이차식 치환과 절댓값 근의 개수.
  - `TPL_EXPONENTIAL_EQUATION_SUBSTITUTION_ABS_ROOTCOUNT` 지수 절댓값 근 개수
  - `TPL_NESTED_EXPONENTIAL_ROOT_COUNT` 합성지수의 이차식 치환과 절댓값 근의 개수
- `PT_EXPONENTIAL_INEQUALITY` **지수부등식의 로그 환원** — 수학Ⅰ 문항에서 '지수부등식의 로그 환원'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 미지 지수 포함 부등식을 로그 치환해 자연수 개수; 반복 감소 지수모형과 로그를 이용한 최소 비율.
  - `TPL_EXPONENTIAL_DECAY_INVERSE_BOUND` 반복 감소 지수모형과 로그를 이용한 최소 비율
  - `TPL_VARIABLE_EXPONENT_LOG_INEQUALITY` 미지 지수 포함 부등식을 로그 치환해 자연수 개수
- `PT_EXPONENTIAL_MONOTONIC_INEQUALITY` **밑이 1보다 작은 지수함수의 단조성 비교** — 수학I에서 밑이 1보다 작은 지수함수의 단조성 비교. 핵심 수학적 목표를 밑이 0과 1 사이인 지수부등식의 지수 비교으로 해결한다.
  - `TPL_EXP_BASE_BELOW_ONE_COMPARISON` 밑이 1보다 작은 지수함수의 단조성 비교
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

## H15-M1-04 로그함수

### 소단원

- `H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION` 로그함수의 활용
- `H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH` 로그함수의 그래프

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-021` 지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 증가·감소
- `H2-M1-RPM-022` 지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 평행이동
- `H2-M1-RPM-023` 지수함수와 로그함수 > 로그함수 > 로그방정식 > 진수 조건 · `H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION`
- `H2-M1-RPM-024` 지수함수와 로그함수 > 로그함수 > 로그방정식 > 치환
- `H2-M1-RPM-025` 지수함수와 로그함수 > 로그함수 > 로그부등식 > 정의역·밑 조건 · `H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION`
- `H2-M1-RPM-026` 지수함수와 로그함수 > 로그함수 > 로그부등식 > 치환
- `H2-M1-RPM-027` 지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 최대·최소 · `H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION`
- `H2-M1-RPM-028` 지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점 · `H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_FUNCTION_EXTREMUM` **함수의 최댓값·최솟값** — 함수의 값, 거리·넓이·둘레 또는 매개변수 조건에서 최댓값·최솟값을 구하는 문제 유형.
  - `TPL_FUNCTION_EXTREMUM_BOUND_COEFFICIENT` 범위 조건으로 계수의 최댓값·최솟값 구하기
  - `TPL_FUNCTION_EXTREMUM_DISTANCE_AREA_PERIMETER` 거리·넓이·둘레의 최댓값·최솟값
  - `TPL_FUNCTION_EXTREMUM_INEQUALITY` 부등식 경계
  - `TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT` 구간 끝점과 함수의 최댓값·최솟값
  - `TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL` 매개변수 함수의 최댓값·최솟값
  - `TPL_FUNCTION_EXTREMUM_QUADRATIC` 이차식 환원
  - `TPL_FUNCTION_EXTREMUM_SUB_QUADRATIC` 치환범위 이차식 극값
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
- `PT_FUNCTION_GRAPH_TRANSFORM` **함수 그래프의 변환** — 평행이동·대칭이동으로 함수 그래프 사이의 관계를 해석하는 문제 유형.
  - `TPL_FUNCTION_GRAPH_TRANSFORM_ASYMPTOTE_POINT` 이동 그래프 계수 복원
  - `TPL_FUNCTION_GRAPH_TRANSLATION` 함수 그래프의 평행이동
  - `TPL_FUNCTION_GRAPH_TRANSLATION_REFLECTION` 함수 그래프의 평행이동과 대칭이동
- `PT_INVERSE_GRAPH` **역함수의 그래프** — y=x 대칭을 이용해 함수와 역함수 그래프의 교점·접점·거리·넓이를 다루는 문제 유형.
  - `TPL_INVERSE_GRAPH_GEOMETRY` 역함수 그래프의 대칭을 이용한 거리·넓이
  - `TPL_INVERSE_GRAPH_INTERSECTION` 함수와 역함수의 교점·접점
- `PT_LOG_EQUATION_DOMAIN` **로그방정식의 정의역 검토** — 수학Ⅰ 문항에서 '로그방정식의 정의역 검토'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 로그법칙 적용 후 진수조건으로 허근 제거.
  - `TPL_LOG_EQUATION_ARGUMENT_FILTER` 로그법칙 적용 후 진수조건으로 허근 제거
- `PT_LOG_FUNCTION_INEQUALITY` **로그함수 부등식** — 로그함수의 정의역과 단조성을 적용해 로그값의 대소 또는 부등식을 판정하는 문제 유형.
  - `TPL_LOG_FUNCTION_INEQUALITY_RANGE` 로그 치역
  - `TPL_LOG_VALUE_ORDER_COMPARISON` 로그값의 크기 비교
- `PT_LOG_INEQUALITY_DOMAIN` **로그부등식과 구간의 교집합** — 수학Ⅰ 문항에서 '로그부등식과 구간의 교집합'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 로그 치환의 구간과 다항부등식 구간 교집합.
  - `TPL_LOG_QUADRATIC_INTERVAL_INTERSECTION` 로그 치환의 구간과 다항부등식 구간 교집합

## H15-M1-05 삼각함수의 뜻과 값

### 소단원

- `H15-M1-05-TRIGONOMETRIC_DEFINITION` 삼각함수의 뜻과 값
- `H15-M1-05-TRIGONOMETRIC_RELATION` 삼각함수의 관계

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-029` 삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각 · `H15-M1-05-TRIGONOMETRIC_DEFINITION`
- `H2-M1-RPM-030` 삼각함수 > 삼각함수 > 일반각과 호도법 > 호도법 · `H15-M1-05-TRIGONOMETRIC_DEFINITION`
- `H2-M1-RPM-031` 삼각함수 > 삼각함수 > 삼각함수의 뜻 > 단위원 · `H15-M1-05-TRIGONOMETRIC_DEFINITION`
- `H2-M1-RPM-032` 삼각함수 > 삼각함수 > 삼각함수의 뜻 > 삼각함수 값 · `H15-M1-05-TRIGONOMETRIC_DEFINITION`
- `H2-M1-RPM-033` 삼각함수 > 삼각함수 > 삼각함수의 성질 > 주기·대칭 · `H15-M1-05-TRIGONOMETRIC_RELATION`
- `H2-M1-RPM-034` 삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계 · `H15-M1-05-TRIGONOMETRIC_RELATION`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_GENERAL_ANGLE_DIRECTION` **일반각과 동경의 관계** — 수학Ⅰ 문항에서 '일반각과 동경의 관계'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 반대 방향 동경 조건으로 각 결정.
  - `TPL_GENERAL_ANGLE_SAME_QUADRANT` 일반각을 한 회전으로 환원해 같은 사분면 판단
  - `TPL_OPPOSITE_RAYS_GENERAL_ANGLE` 반대 방향 동경 조건으로 각 결정
- `PT_H22A_05_COSINE_LAW` **코사인법칙** — 2022 대수의 삼각함수의 활용에서 코사인법칙을 주요 풀이 구조로 쓰는 유형.
  - `TPL_H22A_05_COSINE_LAW_111` 변·각 계산
  - `TPL_H22A_05_COSINE_LAW_112` 삼각형 판정
- `PT_H22A_05_SINE_LAW` **사인법칙** — 2022 대수의 삼각함수의 활용에서 사인법칙을 주요 풀이 구조로 쓰는 유형.
  - `TPL_H22A_05_SINE_LAW_109` 외접원 반지름
  - `TPL_H22A_05_SINE_LAW_110` 변·각 계산
  - `TPL_H22A_05_SINE_LAW_SHAPE` 삼각형 판별
- `PT_H22A_05_TRIANGLE_AREA` **삼각형의 넓이** — 2022 대수의 삼각함수의 활용에서 삼각형의 넓이을 주요 풀이 구조로 쓰는 유형.
  - `TPL_H22A_05_TRIANGLE_AREA_113` 두 변과 끼인각
  - `TPL_H22A_05_TRIANGLE_AREA_114` 복합도형
  - `TPL_H22A_05_TRIANGLE_AREA_CIRCUMRADIUS` 넓이와 외접원 반지름
  - `TPL_H22A_05_TRIANGLE_AREA_INRADIUS` 내접원 반지름
- `PT_RADIAN_SECTOR_GEOMETRY` **호도법과 부채꼴의 관계** — 수학Ⅰ 문항에서 '호도법과 부채꼴의 관계'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 호 길이와 넓이로 부채꼴 반지름 구하기.
  - `TPL_RADIAN_SECTOR_GEOMETRY_COMPOSITE` 도형 결합
  - `TPL_RADIAN_SECTOR_GEOMETRY_FORMULA` 호와 넓이
  - `TPL_SECTOR_CENTRAL_ANGLE_ARC_RADIUS` 호 길이·반지름에서 호도법 중심각 계산
  - `TPL_SECTOR_FIXED_PERIMETER_MAX_AREA` 둘레 고정 부채꼴 넓이 최댓값
  - `TPL_SECTOR_RADIUS_FROM_AREA_ARC` 호 길이와 넓이로 부채꼴 반지름 구하기
- `PT_TRIG_IDENTITY_RELATIONS` **삼각함수 항등식과 관계식** — 수학Ⅰ 문항에서 '삼각함수 항등식과 관계식'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 삼각함수 분수식 변형과 부호 판정; 삼각함수 관계의 대수적 인수분해와 가능 범위.
  - `TPL_TRIG_IDENTITY_ROOT_FEASIBILITY` 삼각함수 관계의 대수적 인수분해와 가능 범위
  - `TPL_TRIG_RATIONAL_IDENTITY_RECOVERY` 삼각함수 분수식 변형과 부호 판정
- `PT_TRIG_QUADRANT_EVALUATION` **사분면 부호와 삼각함수값** — 수학Ⅰ 문항에서 '사분면 부호와 삼각함수값'을 주요 풀이 구조로 사용하며 다음 유형을 포함한다: 사분면과 제곱합으로 삼각함수 값 구하기.
  - `TPL_TRIG_SIGN_PYTHAGOREAN_RATIO` 사분면과 제곱합으로 삼각함수 값 구하기
- `PT_TRIGONOMETRIC_DEFINITION` **삼각함수의 정의와 성질** — 각의 단위, 사분면, 동경의 주기 관계를 삼각함수 정의에 연결하여 값을 판정하는 문제 유형.
  - `TPL_COTERMINAL_ANGLES_SYMMETRY_SYSTEM` 동경 대칭과 일반각 주기 관계
  - `TPL_RADIAN_DEGREE_QUADRANT_JUDGMENT` 호도법·육십분법 및 사분면 판정
- `PT_TRIGONOMETRIC_RELATION` **삼각함수 관계식** — 동경의 대칭성이나 삼각함수 항등식을 이용해 여러 삼각함수 표현을 정리하고 값을 구하는 문제 유형.
  - `TPL_TRIGONOMETRIC_RELATION_ANGLE_FORMULA` 덧셈과 배각
  - `TPL_TRIGONOMETRIC_SYMMETRIC_EXPRESSION_EVALUATION` 대칭 삼각함수식의 값 계산

## H15-M1-06 삼각함수의 그래프

### 소단원

- `H15-M1-06-TRIGONOMETRIC_GRAPH` 삼각함수의 그래프

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-037` 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > sin·cos · `H15-M1-06-TRIGONOMETRIC_GRAPH`
- `H2-M1-RPM-038` 삼각함수 > 삼각함수의 그래프 > 기본 그래프 > tan · `H15-M1-06-TRIGONOMETRIC_GRAPH`
- `H2-M1-RPM-039` 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭 · `H15-M1-06-TRIGONOMETRIC_GRAPH`
- `H2-M1-RPM-040` 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 평행이동 · `H15-M1-06-TRIGONOMETRIC_GRAPH`
- `H2-M1-RPM-041` 삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 교점 · `H15-M1-06-TRIGONOMETRIC_GRAPH`
- `H2-M1-RPM-042` 삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 최대·최소 · `H15-M1-06-TRIGONOMETRIC_GRAPH`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

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

## H15-M1-07 삼각방정식과 삼각부등식

### 소단원

- `H15-M1-07-TRIGONOMETRIC_EQUATION` 삼각방정식
- `H15-M1-07-TRIGONOMETRIC_INEQUALITY` 삼각부등식

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-035` 삼각함수 > 삼각함수 > 삼각방정식·부등식 > 그래프를 이용한 해 · `H15-M1-07-TRIGONOMETRIC_EQUATION`
- `H2-M1-RPM-036` 삼각함수 > 삼각함수 > 삼각방정식·부등식 > 주기 구간의 해 · `H15-M1-07-TRIGONOMETRIC_EQUATION`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_TRIGONOMETRIC_EQUATION` **삼각방정식** — 삼각함수 방정식의 주기·대칭 또는 치환을 이용하여 주어진 구간에서 해를 구하는 문제 유형.
  - `TPL_TRIGONOMETRIC_EQUATION_BASIC_ROOTS` 기본 삼각방정식의 구간 내 해
  - `TPL_TRIGONOMETRIC_EQUATION_COUNT` 삼각식 근 개수
  - `TPL_TRIGONOMETRIC_EQUATION_SUBSTITUTION_ROOTS` 삼각함수 치환 방정식의 해
- `PT_TRIGONOMETRIC_INEQUALITY` **삼각부등식** — 삼각함수의 치역과 단조성을 이용하여 부등식의 해가 되는 각의 구간을 구하는 문제 유형.
  - `TPL_TRIGONOMETRIC_INEQUALITY_INTERVAL_SOLVE` 삼각부등식 해의 구간 결정

## H15-M1-08 등차수열

### 소단원

- `H15-M1-08-ARITHMETIC_SEQUENCE` 등차수열
- `H15-M1-08-SEQUENCE_TERM` 수열의 일반항

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-049` 수열 > 등차수열과 등비수열 > 등차수열 > 일반항 · `H15-M1-08-ARITHMETIC_SEQUENCE`
- `H2-M1-RPM-050` 수열 > 등차수열과 등비수열 > 등차수열 > 중항 · `H15-M1-08-ARITHMETIC_SEQUENCE`
- `H2-M1-RPM-051` 수열 > 등차수열과 등비수열 > 등차수열 > 합 · `H15-M1-08-ARITHMETIC_SEQUENCE`
- `H2-M1-RPM-055` 수열 > 등차수열과 등비수열 > 수열의 활용 > 조건으로 수열 결정 · `H15-M1-08-SEQUENCE_TERM`
- `H2-M1-RPM-056` 수열 > 등차수열과 등비수열 > 수열의 활용 > 귀납적 패턴 · `H15-M1-08-SEQUENCE_TERM`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H22A_06_ARITHMETIC_SEQUENCE` **등차수열** — 2022 대수의 등차수열과 등비수열에서 등차수열을 주요 풀이 구조로 쓰는 유형.
  - `TPL_H22A_06_ARITHMETIC_SEQUENCE_115` 일반항
  - `TPL_H22A_06_ARITHMETIC_SEQUENCE_116` 중항
  - `TPL_H22A_06_ARITHMETIC_SEQUENCE_117` 합
- `PT_H22A_06_SEQUENCE_APPLICATION` **수열의 활용** — 2022 대수의 등차수열과 등비수열에서 수열의 활용을 주요 풀이 구조로 쓰는 유형.
  - `TPL_H22A_06_SEQUENCE_APPLICATION_121` 조건으로 수열 결정
  - `TPL_H22A_06_SEQUENCE_APPLICATION_122` 귀납적 패턴

## H15-M1-09 등비수열

### 소단원

- `H15-M1-09-GEOMETRIC_SEQUENCE` 등비수열
- `H15-M1-09-SEQUENCE_TERM` 수열의 일반항

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-052` 수열 > 등차수열과 등비수열 > 등비수열 > 일반항 · `H15-M1-09-GEOMETRIC_SEQUENCE`
- `H2-M1-RPM-053` 수열 > 등차수열과 등비수열 > 등비수열 > 중항 · `H15-M1-09-GEOMETRIC_SEQUENCE`
- `H2-M1-RPM-054` 수열 > 등차수열과 등비수열 > 등비수열 > 합 · `H15-M1-09-GEOMETRIC_SEQUENCE`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H22A_06_GEOMETRIC_SEQUENCE` **등비수열** — 2022 대수의 등차수열과 등비수열에서 등비수열을 주요 풀이 구조로 쓰는 유형.
  - `TPL_H22A_06_GEOMETRIC_SEQUENCE_118` 일반항
  - `TPL_H22A_06_GEOMETRIC_SEQUENCE_119` 중항
  - `TPL_H22A_06_GEOMETRIC_SEQUENCE_120` 합

## H15-M1-10 수열의 합

### 소단원

- `H15-M1-10-SEQUENCE_SUM` 수열의 합

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-057` 수열 > 수열의 합 > 합의 기호 Σ > Σ 계산 · `H15-M1-10-SEQUENCE_SUM`
- `H2-M1-RPM-058` 수열 > 수열의 합 > 합의 기호 Σ > 성질 · `H15-M1-10-SEQUENCE_SUM`
- `H2-M1-RPM-059` 수열 > 수열의 합 > 여러 가지 수열의 합 > 자연수 거듭제곱의 합 · `H15-M1-10-SEQUENCE_SUM`
- `H2-M1-RPM-060` 수열 > 수열의 합 > 여러 가지 수열의 합 > 부분분수·망원급수형 · `H15-M1-10-SEQUENCE_SUM`
- `H2-M1-RPM-061` 수열 > 수열의 합 > 계차수열 > 계차수열 · `H15-M1-10-SEQUENCE_SUM`
- `H2-M1-RPM-062` 수열 > 수열의 합 > 계차수열 > 일반항 구하기 · `H15-M1-10-SEQUENCE_SUM`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H22A_07_SEQUENCE_SUM` **여러 가지 수열의 합** — 2022 대수의 수열의 합에서 여러 가지 수열의 합을 주요 풀이 구조로 쓰는 유형.
  - `TPL_H22A_07_SEQUENCE_SUM_125` 자연수 거듭제곱의 합
  - `TPL_H22A_07_SEQUENCE_SUM_126` 부분분수·망원급수형
- `PT_H22A_07_SIGMA_NOTATION` **합의 기호 Σ** — 2022 대수의 수열의 합에서 합의 기호 Σ을 주요 풀이 구조로 쓰는 유형.
  - `TPL_H22A_07_SIGMA_NOTATION_123` Σ 계산
  - `TPL_H22A_07_SIGMA_NOTATION_124` 성질

## H15-M1-11 수학적 귀납법

### 소단원

- `H15-M1-11-MATHEMATICAL_INDUCTION` 수학적 귀납법

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2015 개정**

- `H2-M1-RPM-063` 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 점화식으로 항 구하기 · `H15-M1-11-MATHEMATICAL_INDUCTION`
- `H2-M1-RPM-064` 수열 > 수학적 귀납법 > 수열의 귀납적 정의 > 관계 추론 · `H15-M1-11-MATHEMATICAL_INDUCTION`
- `H2-M1-RPM-065` 수열 > 수학적 귀납법 > 수학적 귀납법 > 등식 증명 · `H15-M1-11-MATHEMATICAL_INDUCTION`
- `H2-M1-RPM-066` 수열 > 수학적 귀납법 > 수학적 귀납법 > 부등식·나눗셈 증명 · `H15-M1-11-MATHEMATICAL_INDUCTION`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H22A_08_MATHEMATICAL_INDUCTION` **수학적 귀납법** — 2022 대수의 수학적 귀납법에서 수학적 귀납법을 주요 풀이 구조로 쓰는 유형.
  - `TPL_H22A_08_MATHEMATICAL_INDUCTION_131` 등식 증명
  - `TPL_H22A_08_MATHEMATICAL_INDUCTION_132` 부등식·나눗셈 증명
  - `TPL_H22A_08_MATHEMATICAL_INDUCTION_REACHABLE` 귀납 전이 도달 지표

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
- `PT_M1_CENTRAL_TENDENCY` 대푯값의 해석과 조건 복원 (TPL 10)
- `PT_M1_CIRCLE_MEASURE` 원과 부채꼴
- `PT_M1_COMMON_DIVISIBILITY_FILTER` 공약수·공배수 조건 검사 (TPL 4)
- `PT_M1_CONGRUENCE_DATA_TRANSFER` 합동인 삼각형의 대응 관계 적용 (TPL 10)
- `PT_M1_CONGRUENCE_INVARIANTS` 합동에서 보존되는 성질 (TPL 1)
- `PT_M1_CONGRUENCE_UNIQUENESS` 삼각형 합동·작도 유일조건 (TPL 2)
- `PT_M1_CONTEXT_GRAPH_INTERPRETATION` 상황을 그래프의 변화로 해석 (TPL 7)
- `PT_M1_COORD_TRIANGLE_AREA` 좌표를 이용한 삼각형의 넓이 (TPL 3)
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
- `PT_LINE_EQUATION` 직선의 방정식 구하기 (TPL 9)
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
- `PT_M2_PYTHAGOREAN_RELATION` 피타고라스 정리·역 및 도형 활용 (TPL 9)
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

### 수학(하) (H15_COMMON_HA) · 고1 — 파일 `H15_COMMON_HA.md`

- `PT_ABSOLUTE_INEQUALITY_EXTREMUM` 절대부등식의 활용과 최댓값·최솟값 (TPL 8)
- `PT_ABSOLUTE_INEQUALITY_PROOF` 절대부등식의 증명 (TPL 6)
- `PT_COMPOSITE_FUNCTION_ANALYSIS` 합성함수의 그래프와 치역 (TPL 3)
- `PT_COMPOSITION_EQUATION` 합성함수 방정식과 부등식 (TPL 3)
- `PT_COMPOSITION_EVALUATION` 합성함수의 계산 (TPL 4)
- `PT_COMPOSITION_PROPERTIES` 합성함수의 성질 (TPL 1)
- `PT_CONTRADICTION_PROOF` 귀류법 (TPL 4)
- `PT_CONTRAPOSITIVE_PROOF` 대우를 이용한 증명 (TPL 2)
- `PT_COUNTING_ARRANGEMENT` 순열 (TPL 6)
- `PT_COUNTING_SELECTION_DISTRIBUTION` 조합·중복조합 (TPL 7)
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
- `PT_FUNCTION_VALUE` 함숫값 계산 (TPL 1)
- `PT_FUNCTIONAL_EQUATION` 함수방정식 (TPL 4)
- `PT_H1_ADJACENT_GROUP_PERMUTATION` 이웃 조건이 있는 선택과 배열 (TPL 1)
- `PT_H1_COMBINATORIAL_GEOMETRY_CIRCLE` 원 위 점으로 만드는 도형의 개수 (TPL 1)
- `PT_H1_COMPOSITE_INVERSE_FUNCTION` 합성함수와 역함수의 값 계산 (TPL 1)
- `PT_H1_CONSECUTIVE_COMBINATION_RATIO` 연속 조합의 비율로 미지수 결정 (TPL 1)
- `PT_H1_CONSTRAINED_PERMUTATION` 사이 간격이 정해진 순열 (TPL 1)
- `PT_H1_COUNTING_PRINCIPLE_GENERAL` 경우의 수의 합·곱 법칙 (TPL 4)
- `PT_H1_DERANGEMENT_COUNTING` 교란순열을 이용한 경우의 수 (TPL 1)
- `PT_H1_DICTIONARY_ORDER_PERMUTATION` 사전식 배열의 순위 (TPL 1)
- `PT_H1_FUNCTION_COEFFICIENT_SIGNS` 그래프에서 함수의 계수 부호 판정 (TPL 1)
- `PT_H1_FUNCTION_COUNTING_CONDITIONS` 조건을 만족하는 함수의 개수 (TPL 1)
- `PT_H1_IRRATIONAL_EXPRESSION_REAL_CONDITION` 무리식이 실수가 되는 조건 (TPL 1)
- `PT_H1_IRRATIONAL_EXPRESSION_SIMPLIFICATION` 무리식의 통분과 유리화 (TPL 1)
- `PT_H1_IRRATIONAL_GRAPH_AREA_SYMMETRY` 무리함수 그래프로 둘러싸인 넓이 (TPL 1)
- `PT_H1_IRRATIONAL_LINE_INTERSECTION` 무리함수와 직선의 접선 조건 (TPL 1)
- `PT_H1_ITERATED_COMPOSITE_FUNCTION` 반복 합성함수의 값 (TPL 1)
- `PT_H1_NUMBER_THEORETIC_COUNTING` 공약수 조건의 경우의 수 (TPL 1)
- `PT_H1_ORDER_CONSTRAINED_TUPLE_COUNTING` 대소 조건이 있는 순서쌍의 개수 (TPL 1)
- `PT_H1_PERMUTATION_COMBINATION_CALCULATION` 순열·조합 공식 계산 (TPL 4)
- `PT_H1_RATIONAL_EXPRESSION_IDENTITY` 유리식 항등식의 미정계수 결정 (TPL 1)
- `PT_H1_RATIONAL_FUNCTION_SYMMETRY` 유리함수의 대칭 중심과 미지수 결정 (TPL 1)
- `PT_H1_RATIONAL_FUNCTION_TRANSLATION` 유리함수 그래프의 평행이동 판별 (TPL 1)
- `PT_H1_RATIONAL_LINE_INTERSECTION_DISTANCE` 유리함수와 직선의 교점 거리 최솟값 (TPL 1)
- `PT_H1_SUBSET_SELECTION_COUNTING` 두 부분집합의 경우의 수 (TPL 1)
- `PT_INVERSE_COMPOSITION` 역함수와 합성함수 (TPL 4)
- `PT_INVERSE_GRAPH` 역함수의 그래프 (TPL 2)
- `PT_INVERSE_PROPERTIES` 역함수의 성질 (TPL 2)
- `PT_INVERSE_VALUE` 역함수 구하기와 함수값 (TPL 4)
- `PT_ITERATED_COMPOSITION` 반복합성 (TPL 5)
- `PT_LOGIC_CHAIN` 논리 관계와 추론 (TPL 2)
- `PT_NEC_SUFF_RELATION` 필요조건·충분조건 (TPL 6)
- `PT_ONE_TO_ONE_BIJECTION` 일대일함수와 일대일대응 (TPL 5)
- `PT_PROPOSITION_JUDGMENT` 명제와 조건의 판정 (TPL 5)
- `PT_PROPOSITION_PARAMETER_CONDITION` 명제가 참이 되기 위한 조건 (TPL 10)
- `PT_PROPOSITION_TRANSFORM` 역·이·대우와 명제 변환 (TPL 2)
- `PT_QUANTIFIER_NEGATION` 모든·어떤 명제와 부정 (TPL 5)
- `PT_RADICAL_EXPRESSION` 무리식의 계산 (TPL 3)
- `PT_RATIONAL_ASYMPTOTE` 유리함수의 점근선 (TPL 3)
- `PT_RATIONAL_EXPRESSION` 유리식의 계산 (TPL 5)
- `PT_RECURSIVE_FUNCTION` 재귀적으로 정의된 함수 (TPL 1)
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
- `PT_TRUTH_SET_RELATION` 진리집합과 명제의 관계 (TPL 6)

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
- `PT_H1_FACTOR_THEOREM` 인수정리 (TPL 6)
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
- `PT_LINE_EQUATION` 직선의 방정식 구하기 (TPL 9)
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
- `PT_H1_FACTOR_THEOREM` 인수정리 (TPL 6)
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
- `PT_LINE_EQUATION` 직선의 방정식 구하기 (TPL 9)
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

### 기하 (GEOMETRY) · 고2 — 파일 `GEOMETRY.md`

- `PT_GEO_CONIC_TANGENT` 이차곡선의 접선 문제 (TPL 6)
- `PT_GEO_ELLIPSE` 타원 문제 (TPL 3)
- `PT_GEO_HYPERBOLA` 쌍곡선 문제 (TPL 6)
- `PT_GEO_PARABOLA` 포물선 문제 (TPL 2)
- `PT_GEO_PLANE_EQUATION` 평면의 방정식
- `PT_GEO_PLANE_VECTOR` 평면벡터 문제 (TPL 8)
- `PT_GEO_SPACE_COORDINATE` 공간좌표
- `PT_GEO_SPACE_FIGURE` 공간도형 문제 (TPL 11)
- `PT_GEO_SPACE_LINE` 공간직선
- `PT_GEO_SPHERE` 구
- `PT_GEO_VECTOR` 벡터

### 수학II (H15_MATH2) · 고2 — 파일 `H15_MATH2.md`

- `PT_AREA_BY_DEFINITE_INTEGRAL` 곡선으로 둘러싸인 도형의 넓이 (TPL 3)
- `PT_CONTINUITY_CONDITION` 함수의 연속 조건 (TPL 7)
- `PT_CONTINUITY_JUDGMENT` 연속과 불연속의 판정 (TPL 5)
- `PT_DEFINITE_INTEGRAL_FUNCTION_RELATION` 정적분과 함수 (TPL 5)
- `PT_DEFINITE_INTEGRAL_OPERATION` 정적분의 계산과 성질 (TPL 4)
- `PT_DERIVATIVE_DEFINITION` 미분계수의 정의와 극한 (TPL 2)
- `PT_DERIVATIVE_EQUATION_INEQUALITY` 방정식·부등식에의 활용 (TPL 2)
- `PT_DERIVATIVE_EXTREMA` 극대·극소 (TPL 2)
- `PT_DERIVATIVE_FUNCTION_DETERMINATION` 도함수 조건을 이용한 함수 결정 (TPL 4)
- `PT_DERIVATIVE_GRAPH_ANALYSIS` 도함수 그래프 해석 (TPL 2)
- `PT_DERIVATIVE_MAX_MIN` 최댓값·최솟값 (TPL 2)
- `PT_DERIVATIVE_MONOTONICITY` 함수의 증가·감소 (TPL 2)
- `PT_DERIVATIVE_MOTION` 속도·가속도와 변화율 (TPL 3)
- `PT_DERIVATIVE_RATE_RELATION` 평균변화율과 미분계수 (TPL 3)
- `PT_DERIVATIVE_RULE_EVALUATION` 도함수 계산 (TPL 1)
- `PT_DIFFERENTIABILITY_CONDITION` 미분가능 조건 (TPL 2)
- `PT_FUNCTION_EXTREMUM` 함수의 최댓값·최솟값 (TPL 7)
- `PT_INDEFINITE_INTEGRAL_FUNCTION_RELATION` 부정적분과 함수 (TPL 2)
- `PT_INTERMEDIATE_VALUE_APPLICATION` 사잇값 정리의 활용 (TPL 2)
- `PT_INVERSE_GRAPH` 역함수의 그래프 (TPL 2)
- `PT_ITERATED_COMPOSITION` 반복합성 (TPL 5)
- `PT_LIMIT_EXISTENCE` 극한의 존재 판정 (TPL 1)
- `PT_LIMIT_PARAMETER_DETERMINATION` 극한 조건으로 함수·계수 결정 (TPL 4)
- `PT_LIMIT_STATEMENT_LOGIC` 함수의 극한에 대한 참·거짓 (TPL 1)
- `PT_LIMIT_VALUE_CALC` 함수의 극한값 계산 (TPL 15)
- `PT_MEAN_VALUE_THEOREM` 평균값 정리와 롤의 정리 (TPL 2)
- `PT_MOTION_BY_INTEGRAL` 속도와 거리 (TPL 2)
- `PT_ONE_TO_ONE_BIJECTION` 일대일함수와 일대일대응 (TPL 5)
- `PT_TANGENT_DERIVATIVE` 접선과 미분 (TPL 2)

### 대수 (H22_ALGEBRA) · 고2 — 파일 `H22_ALGEBRA.md`

- `PT_ALGEBRA_SET` 집합
- `PT_FUNCTION_EXTREMUM` 함수의 최댓값·최솟값 (TPL 7)
- `PT_FUNCTION_GRAPH_INTERSECTION` 함수 그래프의 교점 (TPL 7)
- `PT_FUNCTION_GRAPH_PROPERTIES` 함수 그래프의 성질 (TPL 4)
- `PT_FUNCTION_GRAPH_TRANSFORM` 함수 그래프의 변환 (TPL 3)
- `PT_H1_QUADRATIC_EXTREMA` 이차함수의 최대·최소 (TPL 2)
- `PT_H22A_01_COMMON_LOG` 상용로그 (TPL 3)
- `PT_H22A_01_EXPONENT_EXTENSION` 지수의 확장 (TPL 2)
- `PT_H22A_01_EXPONENT_LAWS` 지수법칙 (TPL 2)
- `PT_H22A_01_LOG_DEFINITION` 로그의 뜻 (TPL 2)
- `PT_H22A_01_LOG_PROPERTIES` 로그의 성질 (TPL 2)
- `PT_H22A_01_ROOT_REAL` 거듭제곱근 (TPL 3)
- `PT_H22A_02_EXP_EQUATION` 지수방정식 (TPL 2)
- `PT_H22A_02_EXP_INEQUALITY` 지수부등식 (TPL 2)
- `PT_H22A_03_LOG_EQUATION` 로그방정식 (TPL 2)
- `PT_H22A_03_LOG_INEQUALITY` 로그부등식 (TPL 2)
- `PT_H22A_04_ANGLE_RADIAN` 일반각과 호도법 (TPL 2)
- `PT_H22A_04_TRIG_DEFINITION` 삼각함수의 뜻 (TPL 2)
- `PT_H22A_04_TRIG_EQUATION` 삼각방정식·부등식 (TPL 3)
- `PT_H22A_04_TRIG_GRAPH_TRANSFORM` 그래프 변환 (TPL 1)
- `PT_H22A_04_TRIG_PROPERTIES` 삼각함수의 성질 (TPL 4)
- `PT_H22A_05_COSINE_LAW` 코사인법칙 (TPL 2)
- `PT_H22A_05_SINE_LAW` 사인법칙 (TPL 3)
- `PT_H22A_05_TRIANGLE_AREA` 삼각형의 넓이 (TPL 4)
- `PT_H22A_06_ARITHMETIC_SEQUENCE` 등차수열 (TPL 3)
- `PT_H22A_06_GEOMETRIC_SEQUENCE` 등비수열 (TPL 3)
- `PT_H22A_06_SEQUENCE_APPLICATION` 수열의 활용 (TPL 2)
- `PT_H22A_07_DIFFERENCE_SEQUENCE` 계차수열 (TPL 3)
- `PT_H22A_07_SEQUENCE_SUM` 여러 가지 수열의 합 (TPL 2)
- `PT_H22A_07_SIGMA_NOTATION` 합의 기호 Σ (TPL 2)
- `PT_H22A_08_MATHEMATICAL_INDUCTION` 수학적 귀납법 (TPL 3)
- `PT_H22A_08_RECURSIVE_SEQUENCE` 수열의 귀납적 정의 (TPL 4)

### 미적분I (H22_CALCULUS1) · 고2 — 파일 `H22_CALCULUS1.md`

- `PT_CONTINUITY_CONDITION` 함수의 연속 조건 (TPL 7)
- `PT_CONTINUITY_JUDGMENT` 연속과 불연속의 판정 (TPL 5)
- `PT_DERIVATIVE_DEFINITION` 미분계수의 정의와 극한 (TPL 2)
- `PT_DERIVATIVE_EXTREMA` 극대·극소 (TPL 2)
- `PT_DERIVATIVE_FUNCTION_DETERMINATION` 도함수 조건을 이용한 함수 결정 (TPL 4)
- `PT_DERIVATIVE_RULE_EVALUATION` 도함수 계산 (TPL 1)
- `PT_DIFFERENTIABILITY_CONDITION` 미분가능 조건 (TPL 2)
- `PT_FUNCTIONAL_EQUATION` 함수방정식 (TPL 4)
- `PT_INTERMEDIATE_VALUE_APPLICATION` 사잇값 정리의 활용 (TPL 2)
- `PT_LIMIT_EXISTENCE` 극한의 존재 판정 (TPL 1)
- `PT_LIMIT_PARAMETER_DETERMINATION` 극한 조건으로 함수·계수 결정 (TPL 4)
- `PT_LIMIT_VALUE_CALC` 함수의 극한값 계산 (TPL 15)
- `PT_TANGENT_DERIVATIVE` 접선과 미분 (TPL 2)

### 확률과 통계 (PROBABILITY_STATISTICS) · 고2 — 파일 `PROBABILITY_STATISTICS.md`

- `PT_BINOMIAL_DISTRIBUTION` 이항분포 (TPL 2)
- `PT_BINOMIAL_THEOREM` 이항정리 (TPL 3)
- `PT_CONDITIONAL_PROBABILITY` 조건부확률 (TPL 2)
- `PT_COUNTING_ARRANGEMENT` 순열 (TPL 6)
- `PT_COUNTING_REPEATED_ASSIGNMENT` 중복순열 (TPL 1)
- `PT_COUNTING_SELECTION_DISTRIBUTION` 조합·중복조합 (TPL 7)
- `PT_EVENT_INDEPENDENCE` 사건의 독립과 종속 (TPL 1)
- `PT_EXPECTATION_VARIANCE` 기댓값과 표준편차 (TPL 2)
- `PT_FUNCTION_COUNTING` 함수의 개수 (TPL 7)
- `PT_NORMAL_DISTRIBUTION` 정규분포 (TPL 3)
- `PT_PROB_COUNTING` 경우의 수
- `PT_PROB_EXPONENT_LAWS` 지수법칙
- `PT_PROB_INTEGER_PARTITION` 정수의 분할
- `PT_PROB_PERMUTATION_COMBINATION` 순열과 조합
- `PT_PROBABILITY_PROPERTIES_APPLICATION` 확률의 기본 성질과 활용 (TPL 3)
- `PT_PROBABILITY_REPEATED_TRIALS` 독립시행의 확률 (TPL 2)
- `PT_RANDOM_VARIABLE_DISTRIBUTION` 확률변수와 확률분포 (TPL 3)
- `PT_SAMPLE_MEAN_DISTRIBUTION` 표본평균과 모평균의 관계 (TPL 1)
- `PT_STATISTICAL_ESTIMATION` 통계적 추정 (TPL 5)
