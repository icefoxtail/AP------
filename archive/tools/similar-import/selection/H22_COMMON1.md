# 선택표 · 공통수학1 (H22_COMMON1) · 고1 · 2022 개정

등록부에서 만든 문서다. 손으로 고치지 않는다 (`build-selection-tables.mjs --write`).
판정은 이 표의 키만 쓴다. 개념 단어(한글 이름)로 Ctrl+F 로 먼저 찾고, 없을 때만 NONE + 새 키 제안을 쓴다.
단원 키는 단원 제목의 키, 소단원·RPM 행은 그 단원 안에서 고른다. 유형(PT)과 템플릿(TPL)은 그 단원 것이 먼저이고, 맨 끝 "아래 학년 유형" 의 키도 쓸 수 있다.

## 단원 목차

- `H22-C-01` 다항식의 연산 (소단원 4 · RPM 6 · 유형 7)
- `H22-C-02` 항등식과 나머지 정리 (소단원 2 · RPM 6 · 유형 6)
- `H22-C-03` 인수분해 (소단원 7 · RPM 8 · 유형 4)
- `H22-C-04` 복소수와 이차방정식 (소단원 4 · RPM 7 · 유형 5)
- `H22-C-05` 이차방정식과 이차함수 (소단원 11 · RPM 12 · 유형 10)
- `H22-C-06` 여러 가지 방정식과 부등식 (소단원 12 · RPM 20 · 유형 13)
- `H22-C-07` 합의 법칙과 곱의 법칙 (소단원 4 · RPM 2 · 유형 4)
- `H22-C-08` 순열과 조합 (소단원 7 · RPM 11 · 유형 4)
- `H22-C-09` 행렬과 그 연산 (소단원 7 · RPM 15 · 유형 4)

## H22-C-01 다항식의 연산

### 소단원

- `H22-C-01-CORE` 지수의 뜻과 성질 핵심 개념
- `H22-C-01-FACTORIZATION` 인수분해
- `H22-C-01-IDENTITY_REMAINDER` 항등식과 나머지정리
- `H22-C-01-POLYNOMIAL_BASIC` 다항식의 연산

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2022 개정**

- `H1-RPM-134` 다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리 · `H22-C-01-POLYNOMIAL_BASIC`
- `H1-RPM-135` 다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 다항식의 덧셈·뺄셈 · `H22-C-01-POLYNOMIAL_BASIC`
- `H1-RPM-136` 다항식 > 다항식의 연산 > 다항식의 곱셈 > 곱셈공식 · `H22-C-01-POLYNOMIAL_BASIC`
- `H1-RPM-137` 다항식 > 다항식의 연산 > 다항식의 곱셈 > 고차식 전개 · `H22-C-01-POLYNOMIAL_BASIC`
- `H1-RPM-138` 다항식 > 다항식의 연산 > 다항식의 나눗셈 > 다항식을 일차식으로 나누기 · `H22-C-01-POLYNOMIAL_BASIC`
- `H1-RPM-139` 다항식 > 다항식의 연산 > 다항식의 나눗셈 > 몫과 나머지 · `H22-C-01-POLYNOMIAL_BASIC`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H1_DIVISOR` **약수** — 소인수 지수의 선택 범위를 이용하여 약수의 개수와 합을 구하거나 그 조건을 만족하는 수를 정한다.
- `PT_H1_POLY_DIVISION` **다항식의 나눗셈** — 다항식 나눗셈의 몫·나머지 항등식, 차수 제한 또는 실제 나눗셈 절차가 풀이의 결정 단계인 유형.
  - `TPL_H1_POLY_DIVISION_EXECUTION` 다항식 나눗셈 직접 실행
  - `TPL_H1_POLY_DIVISION_IDENTITY` 나눗셈 항등식
  - `TPL_H1_POLY_DIVISION_REDUCTION` 차수 낮추기
  - `TPL_H1_POLY_DIVISION_SCALE` 제수 배율
- `PT_H1_POLY_FACTORIZATION` **다항식의 인수분해** — 인수분해 구조를 찾아 식을 분해하거나 인수 조건을 이용하는 유형.
  - `TPL_H1_FACTORIZATION_APPLICATION` 인수분해 구조의 활용
  - `TPL_H1_FACTORIZATION_STANDARD` 표준 인수분해
  - `TPL_H1_POLY_FACTORIZATION_COEFFICIENT` 인수와 계수 비교
- `PT_H1_POLY_FORMULA_SYMMETRIC` **곱셈공식과 대칭식** — 곱셈공식의 변형, 대칭식, 역수형 거듭제곱 관계를 이용하는 유형.
  - `TPL_H1_FORMULA_SYMMETRIC` 곱셈공식·대칭식 변형
- `PT_H1_POLY_IDENTITY_COEFFICIENT` **항등식과 미정계수** — 항등식의 특수값 대입 또는 계수비교로 미정계수를 정하는 유형.
  - `TPL_H1_IDENTITY_COEFFICIENT_COMPARE` 항등식의 계수비교
  - `TPL_H1_IDENTITY_SPECIAL_VALUE` 항등식의 특수값 대입
- `PT_H1_POLY_OPERATION_EXPANSION` **다항식의 연산과 전개** — 다항식의 덧셈·뺄셈·곱셈·전개와 특정 계수 추출을 핵심으로 하는 유형.
  - `TPL_H1_POLY_COEFFICIENT_EXTRACTION` 전개식의 특정 계수
  - `TPL_H1_POLY_OPERATION_DIRECT` 다항식의 직접 연산
- `PT_H1_REMAINDER_THEOREM` **나머지정리** — 일차식 나눗셈의 나머지를 함수값으로 바꾸거나 그 관계를 확장해 값·계수·나머지를 결정하는 유형.
  - `TPL_H1_REMAINDER_COMPOSITE_DIVISOR` 합성 제수 나머지 조건 결합
  - `TPL_H1_REMAINDER_DIRECT_SUBSTITUTION` 나머지정리의 직접 대입
  - `TPL_H1_REMAINDER_NESTED_DIVISION` 중첩 나눗셈 몫·나머지 관계
  - `TPL_H1_REMAINDER_THEOREM_REDUCE` 나머지 환원

## H22-C-02 항등식과 나머지 정리

### 소단원

- `H22-C-02-CORE` 항등식과 나머지 정리 핵심 개념
- `H22-C-02-REMAINDER` 나머지정리와 인수정리

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2022 개정**

- `H1-RPM-140` 다항식 > 항등식과 나머지정리 > 항등식 > 미정계수법 · `H22-C-02-CORE`
- `H1-RPM-141` 다항식 > 항등식과 나머지정리 > 항등식 > 수치대입법 · `H22-C-02-CORE`
- `H1-RPM-142` 다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지 · `H22-C-02-CORE`
- `H1-RPM-143` 다항식 > 항등식과 나머지정리 > 나머지정리 > 고차식 조건 · `H22-C-02-CORE`
- `H1-RPM-144` 다항식 > 항등식과 나머지정리 > 인수정리 > 인수 판정 · `H22-C-02-CORE`
- `H1-RPM-145` 다항식 > 항등식과 나머지정리 > 인수정리 > 미정계수 결정 · `H22-C-02-CORE`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H1_FACTOR_THEOREM` **인수정리** — 다항식의 영점과 일차인수의 동치를 중심으로 인수 여부·중복인수·미정계수 또는 공통인수를 결정하는 유형.
  - `TPL_H1_FACTOR_THEOREM_FACTOR` 인수분해
  - `TPL_H1_FACTOR_THEOREM_QUOTIENT_VALUE` 인수 조건과 몫의 값
  - `TPL_H1_FACTOR_THEOREM_REPEATED` 중복인수
  - `TPL_H1_FACTOR_THEOREM_RESTORE` 다항식 복원
  - `TPL_H1_FACTOR_THEOREM_ROOT` 인수 조건
  - `TPL_H1_FACTOR_THEOREM_ROOT_RECONSTRUCT` 영점으로 다항식 복원
- `PT_H1_POLY_DIVISION` **다항식의 나눗셈** — 다항식 나눗셈의 몫·나머지 항등식, 차수 제한 또는 실제 나눗셈 절차가 풀이의 결정 단계인 유형.
  - `TPL_H1_POLY_DIVISION_EXECUTION` 다항식 나눗셈 직접 실행
  - `TPL_H1_POLY_DIVISION_IDENTITY` 나눗셈 항등식
  - `TPL_H1_POLY_DIVISION_REDUCTION` 차수 낮추기
  - `TPL_H1_POLY_DIVISION_SCALE` 제수 배율
- `PT_H1_POLY_FORMULA_SYMMETRIC` **곱셈공식과 대칭식** — 곱셈공식의 변형, 대칭식, 역수형 거듭제곱 관계를 이용하는 유형.
  - `TPL_H1_FORMULA_SYMMETRIC` 곱셈공식·대칭식 변형
- `PT_H1_POLY_IDENTITY_COEFFICIENT` **항등식과 미정계수** — 항등식의 특수값 대입 또는 계수비교로 미정계수를 정하는 유형.
  - `TPL_H1_IDENTITY_COEFFICIENT_COMPARE` 항등식의 계수비교
  - `TPL_H1_IDENTITY_SPECIAL_VALUE` 항등식의 특수값 대입
- `PT_H1_POLY_OPERATION_EXPANSION` **다항식의 연산과 전개** — 다항식의 덧셈·뺄셈·곱셈·전개와 특정 계수 추출을 핵심으로 하는 유형.
  - `TPL_H1_POLY_COEFFICIENT_EXTRACTION` 전개식의 특정 계수
  - `TPL_H1_POLY_OPERATION_DIRECT` 다항식의 직접 연산
- `PT_H1_REMAINDER_THEOREM` **나머지정리** — 일차식 나눗셈의 나머지를 함수값으로 바꾸거나 그 관계를 확장해 값·계수·나머지를 결정하는 유형.
  - `TPL_H1_REMAINDER_COMPOSITE_DIVISOR` 합성 제수 나머지 조건 결합
  - `TPL_H1_REMAINDER_DIRECT_SUBSTITUTION` 나머지정리의 직접 대입
  - `TPL_H1_REMAINDER_NESTED_DIVISION` 중첩 나눗셈 몫·나머지 관계
  - `TPL_H1_REMAINDER_THEOREM_REDUCE` 나머지 환원

## H22-C-03 인수분해

### 소단원

- `H22-C-03-FACTORIZATION` 인수분해
- `H22-C-03-FUNCTION_BASIC` 함수의 뜻과 그래프
- `H22-C-03-FUNCTION_COMPOSITION` 합성함수
- `H22-C-03-FUNCTION_INVERSE` 역함수
- `H22-C-03-IDENTITY_REMAINDER` 항등식과 나머지정리
- `H22-C-03-POLYNOMIAL_BASIC` 다항식의 연산
- `H22-C-03-FACTORIZATION_APPLICATION` 인수분해의 활용

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2022 개정**

- `H1-RPM-146` 다항식 > 인수분해 > 공통인수 > 공통인수 묶기 · `H22-C-03-FACTORIZATION`
- `H1-RPM-147` 다항식 > 인수분해 > 공통인수 > 단계적 인수분해 · `H22-C-03-FACTORIZATION`
- `H1-RPM-148` 다항식 > 인수분해 > 인수분해 공식 > 제곱식 · `H22-C-03-FACTORIZATION`
- `H1-RPM-149` 다항식 > 인수분해 > 인수분해 공식 > 합과 차 · `H22-C-03-FACTORIZATION`
- `H1-RPM-150` 다항식 > 인수분해 > 인수분해 공식 > 이차식 · `H22-C-03-FACTORIZATION`
- `H1-RPM-151` 다항식 > 인수분해 > 인수분해의 활용 > 수의 계산 · `H22-C-03-FACTORIZATION`
- `H1-RPM-152` 다항식 > 인수분해 > 인수분해의 활용 > 식의 값 · `H22-C-03-FACTORIZATION`
- `H1-RPM-153` 다항식 > 인수분해 > 인수분해의 활용 > 조건식 · `H22-C-03-FACTORIZATION`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H1_FACTOR_THEOREM` **인수정리** — 다항식의 영점과 일차인수의 동치를 중심으로 인수 여부·중복인수·미정계수 또는 공통인수를 결정하는 유형.
  - `TPL_H1_FACTOR_THEOREM_FACTOR` 인수분해
  - `TPL_H1_FACTOR_THEOREM_QUOTIENT_VALUE` 인수 조건과 몫의 값
  - `TPL_H1_FACTOR_THEOREM_REPEATED` 중복인수
  - `TPL_H1_FACTOR_THEOREM_RESTORE` 다항식 복원
  - `TPL_H1_FACTOR_THEOREM_ROOT` 인수 조건
  - `TPL_H1_FACTOR_THEOREM_ROOT_RECONSTRUCT` 영점으로 다항식 복원
- `PT_H1_POLY_FACTORIZATION` **다항식의 인수분해** — 인수분해 구조를 찾아 식을 분해하거나 인수 조건을 이용하는 유형.
  - `TPL_H1_FACTORIZATION_APPLICATION` 인수분해 구조의 활용
  - `TPL_H1_FACTORIZATION_STANDARD` 표준 인수분해
  - `TPL_H1_POLY_FACTORIZATION_COEFFICIENT` 인수와 계수 비교
- `PT_H1_POLY_IDENTITY_COEFFICIENT` **항등식과 미정계수** — 항등식의 특수값 대입 또는 계수비교로 미정계수를 정하는 유형.
  - `TPL_H1_IDENTITY_COEFFICIENT_COMPARE` 항등식의 계수비교
  - `TPL_H1_IDENTITY_SPECIAL_VALUE` 항등식의 특수값 대입
- `PT_H1_POLY_OPERATION_EXPANSION` **다항식의 연산과 전개** — 다항식의 덧셈·뺄셈·곱셈·전개와 특정 계수 추출을 핵심으로 하는 유형.
  - `TPL_H1_POLY_COEFFICIENT_EXTRACTION` 전개식의 특정 계수
  - `TPL_H1_POLY_OPERATION_DIRECT` 다항식의 직접 연산

## H22-C-04 복소수와 이차방정식

### 소단원

- `H22-C-04-COMPLEX_BASIC` 복소수의 뜻과 표현
- `H22-C-04-COMPLEX_OPERATION` 복소수의 계산
- `H22-C-04-COMPLEX_ROOT` 복소수와 이차방정식
- `H22-C-04-CORE` 로그의 뜻 핵심 개념

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2022 개정**

- `H1-RPM-154` 방정식과 부등식 > 복소수 > 복소수의 뜻 > 실수부·허수부 · `H22-C-04-COMPLEX_BASIC`
- `H1-RPM-155` 방정식과 부등식 > 복소수 > 복소수의 뜻 > 서로 같은 복소수 · `H22-C-04-COMPLEX_BASIC`
- `H1-RPM-156` 방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산 · `H22-C-04-COMPLEX_OPERATION`
- `H1-RPM-157` 방정식과 부등식 > 복소수 > 복소수의 연산 > 켤레복소수 · `H22-C-04-COMPLEX_OPERATION`
- `H1-RPM-158` 방정식과 부등식 > 복소수 > i의 거듭제곱 > 주기성 · `H22-C-04-COMPLEX_OPERATION`
- `H1-RPM-159` 방정식과 부등식 > 복소수 > i의 거듭제곱 > 복소수 조건 · `H22-C-04-COMPLEX_OPERATION`
- `H1-RPM-301` 방정식과 부등식 > 복소수 > i의 거듭제곱 > 주기성 · `H22-C-04-COMPLEX_ROOT`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H1_COMPLEX_CONDITION_EQUATION` **복소수 조건과 방정식** — 실수·순허수·켤레근·복소 제곱근 조건을 방정식의 근 구조와 결합하는 유형.
  - `TPL_H1_COMPLEX_CONDITION_EQUATION_SIGN` 음수 근호 조건
  - `TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION` 켤레근과 방정식의 근
  - `TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT` 실수·순허수 조건
- `PT_H1_COMPLEX_OPERATION` **복소수의 연산과 상등** — 복소수의 사칙연산, 실수부·허수부 비교, 켤레복소수의 기본 연산을 다루는 유형.
  - `TPL_H1_COMPLEX_COMPONENT_OPERATION` 복소수의 성분별 연산
  - `TPL_H1_COMPLEX_CONJUGATE_NORM` 켤레복소수·노름의 활용
  - `TPL_H1_COMPLEX_OPERATION_AUDIT` 복소 연산 판별
  - `TPL_H1_COMPLEX_OPERATION_NEGATIVE_ROOT` 음수 제곱근
- `PT_H1_COMPLEX_POWER_ROOT` **복소수의 거듭제곱과 단위근** — i 및 복소수 거듭제곱의 주기, 단위근·세제곱근 구조를 이용하는 유형.
  - `TPL_H1_COMPLEX_I_PERIOD` 허수단위 i의 거듭제곱 주기
  - `TPL_H1_COMPLEX_ROOT_OF_UNITY_PERIOD` 단위근·복소근의 주기
- `PT_H1_QUADRATIC_DISCRIMINANT` **이차방정식의 근과 판별식** — 실근·중근·허근의 존재와 근의 위치를 판별식 또는 부호 조건으로 판정하는 유형.
  - `TPL_H1_DISCRIMINANT_PARAMETER_IDENTITY` 매개변수와 무관한 판별식 조건
  - `TPL_H1_DISCRIMINANT_ROOT_EXISTENCE` 판별식으로 근의 존재·중복 판정
  - `TPL_H1_QUADRATIC_DISCRIMINANT_INTERVAL_ROOT` 구간근 조건
- `PT_H1_ROOT_COEFFICIENT_RELATION` **근과 계수의 관계** — 이차방정식 및 관련 방정식의 근의 합·곱과 대칭식을 활용하는 유형.
  - `TPL_H1_ROOT_COEFFICIENT_RELATION_EQUATION` 근에서 방정식
  - `TPL_H1_VIETA_SYMMETRIC_VALUE` 근의 합·곱으로 대칭식 계산
  - `TPL_H1_VIETA_TRANSFORMED_ROOT` 변환된 근과 매개변수

## H22-C-05 이차방정식과 이차함수

### 소단원

- `H22-C-05-CORE` 로그의 성질 핵심 개념
- `H22-C-05-EQUATION_APPLICATION` 방정식과 부등식의 활용
- `H22-C-05-EQUATION_BASIC` 방정식의 풀이
- `H22-C-05-FUNCTION_BASIC` 함수의 뜻과 그래프
- `H22-C-05-FUNCTION_COMPOSITION` 합성함수
- `H22-C-05-FUNCTION_INVERSE` 역함수
- `H22-C-05-INEQUALITY_BASIC` 부등식의 풀이
- `H22-C-05-QUADRATIC_EQUATION` 이차방정식
- `H22-C-05-QUADRATIC_FUNCTION_APPLICATION` 이차함수의 활용
- `H22-C-05-QUADRATIC_FUNCTION_GRAPH` 이차함수의 그래프
- `H22-C-05-QUADRATIC_FUNCTION_MAXMIN` 이차함수의 최대·최소

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2022 개정**

- `H1-RPM-160` 방정식과 부등식 > 이차방정식 > 이차방정식의 근 > 인수분해·근의 공식 · `H22-C-05-QUADRATIC_EQUATION`
- `H1-RPM-161` 방정식과 부등식 > 이차방정식 > 이차방정식의 근 > 판별식 · `H22-C-05-QUADRATIC_EQUATION`
- `H1-RPM-162` 방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱 · `H22-C-05-QUADRATIC_EQUATION`
- `H1-RPM-163` 방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근으로 방정식 구성 · `H22-C-05-QUADRATIC_EQUATION`
- `H1-RPM-164` 방정식과 부등식 > 이차방정식 > 복소수 근 > 허근 · `H22-C-05-QUADRATIC_EQUATION`
- `H1-RPM-165` 방정식과 부등식 > 이차방정식 > 복소수 근 > 계수 조건 · `H22-C-05-QUADRATIC_EQUATION`
- `H1-RPM-166` 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점 · `H22-C-05-QUADRATIC_FUNCTION_GRAPH`
- `H1-RPM-167` 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > 판별식과 위치 · `H22-C-05-QUADRATIC_FUNCTION_GRAPH`
- `H1-RPM-168` 방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 교점 개수 · `H22-C-05-QUADRATIC_FUNCTION_GRAPH`
- `H1-RPM-169` 방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 접선 조건 · `H22-C-05-QUADRATIC_FUNCTION_GRAPH`
- `H1-RPM-170` 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소 · `H22-C-05-QUADRATIC_FUNCTION_APPLICATION`
- `H1-RPM-171` 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 조건식 활용 · `H22-C-05-QUADRATIC_FUNCTION_APPLICATION`

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
- `PT_H1_ABSOLUTE_VALUE_EQUATION_INEQUALITY` **절댓값 방정식과 부등식** — 절댓값을 구간별로 풀거나 거리 해석을 이용해 해집합을 구하는 유형.
  - `TPL_H1_ABSOLUTE_DIRECT_INTERVAL` 절댓값의 직접 구간 변환
  - `TPL_H1_ABSOLUTE_PIECEWISE_CASE` 절댓값의 구간별 분기
- `PT_H1_COMPLEX_CONDITION_EQUATION` **복소수 조건과 방정식** — 실수·순허수·켤레근·복소 제곱근 조건을 방정식의 근 구조와 결합하는 유형.
  - `TPL_H1_COMPLEX_CONDITION_EQUATION_SIGN` 음수 근호 조건
  - `TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION` 켤레근과 방정식의 근
  - `TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT` 실수·순허수 조건
- `PT_H1_HIGHER_DEGREE_EQUATION` **고차방정식의 풀이** — 삼차·사차 이상의 방정식을 인수분해·치환·근 구조로 해결하는 유형.
  - `TPL_H1_HIGHER_DEGREE_EQUATION_ROOT` 근 조건
  - `TPL_H1_HIGHER_DEGREE_EQUATION_TRANSFORM` 근 변환
  - `TPL_H1_HIGHER_FACTOR_ROOT` 고차방정식의 인수분해
  - `TPL_H1_HIGHER_SUBSTITUTION_REDUCTION` 치환을 이용한 차수 축소
- `PT_H1_QUADRATIC_DISCRIMINANT` **이차방정식의 근과 판별식** — 실근·중근·허근의 존재와 근의 위치를 판별식 또는 부호 조건으로 판정하는 유형.
  - `TPL_H1_DISCRIMINANT_PARAMETER_IDENTITY` 매개변수와 무관한 판별식 조건
  - `TPL_H1_DISCRIMINANT_ROOT_EXISTENCE` 판별식으로 근의 존재·중복 판정
  - `TPL_H1_QUADRATIC_DISCRIMINANT_INTERVAL_ROOT` 구간근 조건
- `PT_H1_QUADRATIC_EXTREMA` **이차함수의 최대·최소** — 이차함수의 꼭짓점·제한구간·모델링을 이용해 최댓값·최솟값을 구하는 유형.
  - `TPL_H1_QUADRATIC_EXTREMA_MODEL` 조건·도형을 이차함수로 모델링
  - `TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL` 꼭짓점·제한구간의 최대·최소
- `PT_H1_QUADRATIC_GRAPH_INTERSECTION` **이차함수의 그래프와 교점** — 이차함수와 직선·축·다른 그래프의 교점, 접점, 근 위치를 판정하는 유형.
  - `TPL_H1_QUADRATIC_GRAPH_INTERSECTION_ROOT_LOCATION` 교점의 구간 위치
  - `TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY` 교점 좌표와 그래프·도형 관계
  - `TPL_H1_QUADRATIC_INTERSECTION_TANGENCY` 이차함수와 직선의 교점·접점
- `PT_H1_QUADRATIC_RECONSTRUCTION` **조건을 이용한 이차함수 결정** — 교점·축·꼭짓점·함숫값 등의 조건으로 이차함수 식이나 계수를 복원하는 유형.
  - `TPL_H1_QUADRATIC_RECONSTRUCT_MULTI_CONDITION` 복합 조건으로 이차함수 결정
  - `TPL_H1_QUADRATIC_RECONSTRUCT_ROOT_VERTEX` 근·축·꼭짓점으로 이차함수 결정
- `PT_H1_ROOT_COEFFICIENT_RELATION` **근과 계수의 관계** — 이차방정식 및 관련 방정식의 근의 합·곱과 대칭식을 활용하는 유형.
  - `TPL_H1_ROOT_COEFFICIENT_RELATION_EQUATION` 근에서 방정식
  - `TPL_H1_VIETA_SYMMETRIC_VALUE` 근의 합·곱으로 대칭식 계산
  - `TPL_H1_VIETA_TRANSFORMED_ROOT` 변환된 근과 매개변수
- `PT_H1_SYSTEM_EQUATION` **연립방정식과 공통근** — 둘 이상의 방정식, 공통근, 대칭 관계를 연립하여 미지수나 매개변수를 정하는 유형.
  - `TPL_H1_SYSTEM_BRANCH_COMMON_ROOT` 인수 분기·공통근 연립
  - `TPL_H1_SYSTEM_DIRECT` 연립방정식의 직접 해결

## H22-C-06 여러 가지 방정식과 부등식

### 소단원

- `H22-C-06-EQUATION` 여러 가지 방정식
- `H22-C-06-EQUATION_APPLICATION` 방정식과 부등식의 활용
- `H22-C-06-EQUATION_BASIC` 방정식의 풀이
- `H22-C-06-FUNCTION_BASIC` 함수의 뜻과 그래프
- `H22-C-06-FUNCTION_COMPOSITION` 합성함수
- `H22-C-06-FUNCTION_INVERSE` 역함수
- `H22-C-06-HIGHER_EQUATION` 여러 가지 방정식
- `H22-C-06-HIGHER_INEQUALITY` 여러 가지 부등식
- `H22-C-06-INEQUALITY` 여러 가지 부등식
- `H22-C-06-INEQUALITY_BASIC` 부등식의 풀이
- `H22-C-06-SYSTEM` 연립방정식과 연립부등식
- `H22-C-06-SYSTEM_OF_EQUATIONS` 연립방정식

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2022 개정**

- `H1-RPM-172` 방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형 · `H22-C-06-HIGHER_EQUATION`
- `H1-RPM-173` 방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 치환형 · `H22-C-06-HIGHER_EQUATION`
- `H1-RPM-174` 방정식과 부등식 > 여러 가지 방정식 > 연립방정식 > 이차식이 포함된 연립방정식 · `H22-C-06-SYSTEM_OF_EQUATIONS`
- `H1-RPM-175` 방정식과 부등식 > 여러 가지 방정식 > 연립방정식 > 대칭식 활용 · `H22-C-06-SYSTEM_OF_EQUATIONS`
- `H1-RPM-176` 방정식과 부등식 > 여러 가지 방정식 > 방정식의 활용 > 근의 조건 · `H22-C-06-EQUATION_APPLICATION`
- `H1-RPM-177` 방정식과 부등식 > 여러 가지 방정식 > 방정식의 활용 > 도형·함수 결합 · `H22-C-06-EQUATION_APPLICATION`
- `H1-RPM-178` 방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 해의 범위 · `H22-C-06-SYSTEM`
- `H1-RPM-179` 방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 정수해 · `H22-C-06-SYSTEM`
- `H1-RPM-180` 방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 그래프를 이용한 해 · `H22-C-06-HIGHER_INEQUALITY`
- `H1-RPM-181` 방정식과 부등식 > 여러 가지 부등식 > 이차부등식 > 근의 위치와 해 · `H22-C-06-HIGHER_INEQUALITY`
- `H1-RPM-182` 방정식과 부등식 > 여러 가지 부등식 > 절대부등식 > 산술·기하평균 · `H22-C-06-HIGHER_INEQUALITY`
- `H1-RPM-183` 방정식과 부등식 > 여러 가지 부등식 > 절대부등식 > 코시형 기본 · `H22-C-06-HIGHER_INEQUALITY`
- `H1-RPM-184` 방정식과 부등식 > 여러 가지 부등식 > 부등식의 활용 > 최대·최소 · `H22-C-06-EQUATION_APPLICATION`
- `H1-RPM-185` 방정식과 부등식 > 여러 가지 부등식 > 부등식의 활용 > 계수 조건 · `H22-C-06-EQUATION_APPLICATION`
- `H1-RPM-285` 방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 정수해 · `H22-C-06-HIGHER_INEQUALITY`
- `H1-RPM-286` 방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 해의 범위 · `H22-C-06-HIGHER_INEQUALITY`
- `H1-RPM-290` 방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 해의 범위 · `H22-C-06-INEQUALITY`
- `H1-RPM-291` 방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근으로 방정식 구성 · `H22-C-06-EQUATION`
- `H1-RPM-292` 방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 해의 범위 · `H22-C-06-INEQUALITY`
- `H1-RPM-300` 방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱 · `H22-C-06-EQUATION`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H1_ABSOLUTE_VALUE_EQUATION_INEQUALITY` **절댓값 방정식과 부등식** — 절댓값을 구간별로 풀거나 거리 해석을 이용해 해집합을 구하는 유형.
  - `TPL_H1_ABSOLUTE_DIRECT_INTERVAL` 절댓값의 직접 구간 변환
  - `TPL_H1_ABSOLUTE_PIECEWISE_CASE` 절댓값의 구간별 분기
- `PT_H1_COMPLEX_CONDITION_EQUATION` **복소수 조건과 방정식** — 실수·순허수·켤레근·복소 제곱근 조건을 방정식의 근 구조와 결합하는 유형.
  - `TPL_H1_COMPLEX_CONDITION_EQUATION_SIGN` 음수 근호 조건
  - `TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION` 켤레근과 방정식의 근
  - `TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT` 실수·순허수 조건
- `PT_H1_COMPLEX_POWER_ROOT` **복소수의 거듭제곱과 단위근** — i 및 복소수 거듭제곱의 주기, 단위근·세제곱근 구조를 이용하는 유형.
  - `TPL_H1_COMPLEX_I_PERIOD` 허수단위 i의 거듭제곱 주기
  - `TPL_H1_COMPLEX_ROOT_OF_UNITY_PERIOD` 단위근·복소근의 주기
- `PT_H1_EQUATION_APPLICATION` **방정식의 활용** — 기하·수량 관계를 방정식으로 모델링해 미지수와 목표량을 결정하는 유형.
  - `TPL_H1_EQUATION_APPLICATION_SUM_SQUARE` 도형 연립방정식
  - `TPL_H1_EQUATION_KNOWN_WEIGHTS_SWAPPED_QUANTITIES` 알려진 단위량과 수량 교환 차이의 연립식
- `PT_H1_HIGHER_DEGREE_EQUATION` **고차방정식의 풀이** — 삼차·사차 이상의 방정식을 인수분해·치환·근 구조로 해결하는 유형.
  - `TPL_H1_HIGHER_DEGREE_EQUATION_ROOT` 근 조건
  - `TPL_H1_HIGHER_DEGREE_EQUATION_TRANSFORM` 근 변환
  - `TPL_H1_HIGHER_FACTOR_ROOT` 고차방정식의 인수분해
  - `TPL_H1_HIGHER_SUBSTITUTION_REDUCTION` 치환을 이용한 차수 축소
- `PT_H1_INEQUALITY_APPLICATION` **부등식의 활용** — 크기·범위·정수성·존재 조건을 부등식으로 모델링해 가능한 값이나 범위를 결정하는 유형.
  - `TPL_H1_INEQUALITY_APPLICATION_GEOMETRY` 도형 부등식
  - `TPL_H1_INEQUALITY_APPLICATION_MODEL_BOUND` 수량 제한 이차부등식
  - `TPL_H1_INEQUALITY_APPLICATION_QUANTITY` 수량 부등식
- `PT_H1_LINEAR_SYSTEM_INEQUALITY` **일차·연립부등식** — 일차부등식 또는 연립부등식의 공통 해구간과 정수·매개변수 조건을 다루는 유형.
  - `TPL_H1_INDEPENDENT_INEQUALITIES_LEAST_INTEGER_SUM` 독립된 부등식의 최소 정수해 합
  - `TPL_H1_LINEAR_INEQUALITY_ALL_SOLUTIONS_SIGN` 일차부등식의 전체 해 부호 조건
  - `TPL_H1_LINEAR_INEQUALITY_INTERVAL` 연립부등식의 공통 구간
  - `TPL_H1_LINEAR_INEQUALITY_LEAST_INTEGER_SOLUTION` 일차부등식의 가장 작은 정수해
  - `TPL_H1_LINEAR_INEQUALITY_PARAMETER_INTEGER` 정수 개수·매개변수 조건
- `PT_H1_QUADRATIC_DISCRIMINANT` **이차방정식의 근과 판별식** — 실근·중근·허근의 존재와 근의 위치를 판별식 또는 부호 조건으로 판정하는 유형.
  - `TPL_H1_DISCRIMINANT_PARAMETER_IDENTITY` 매개변수와 무관한 판별식 조건
  - `TPL_H1_DISCRIMINANT_ROOT_EXISTENCE` 판별식으로 근의 존재·중복 판정
  - `TPL_H1_QUADRATIC_DISCRIMINANT_INTERVAL_ROOT` 구간근 조건
- `PT_H1_QUADRATIC_EXTREMA` **이차함수의 최대·최소** — 이차함수의 꼭짓점·제한구간·모델링을 이용해 최댓값·최솟값을 구하는 유형.
  - `TPL_H1_QUADRATIC_EXTREMA_MODEL` 조건·도형을 이차함수로 모델링
  - `TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL` 꼭짓점·제한구간의 최대·최소
- `PT_H1_QUADRATIC_GRAPH_INTERSECTION` **이차함수의 그래프와 교점** — 이차함수와 직선·축·다른 그래프의 교점, 접점, 근 위치를 판정하는 유형.
  - `TPL_H1_QUADRATIC_GRAPH_INTERSECTION_ROOT_LOCATION` 교점의 구간 위치
  - `TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY` 교점 좌표와 그래프·도형 관계
  - `TPL_H1_QUADRATIC_INTERSECTION_TANGENCY` 이차함수와 직선의 교점·접점
- `PT_H1_QUADRATIC_INEQUALITY` **이차부등식과 부호 조건** — 이차식의 부호, 해구간, 전역 성립, 매개변수 범위를 다루는 유형.
  - `TPL_H1_QUADRATIC_INEQUALITY_GLOBAL_PARAMETER` 항상 성립·해 없음의 매개변수
  - `TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL` 이차식의 근과 부호 구간
- `PT_H1_ROOT_COEFFICIENT_RELATION` **근과 계수의 관계** — 이차방정식 및 관련 방정식의 근의 합·곱과 대칭식을 활용하는 유형.
  - `TPL_H1_ROOT_COEFFICIENT_RELATION_EQUATION` 근에서 방정식
  - `TPL_H1_VIETA_SYMMETRIC_VALUE` 근의 합·곱으로 대칭식 계산
  - `TPL_H1_VIETA_TRANSFORMED_ROOT` 변환된 근과 매개변수
- `PT_H1_SYSTEM_EQUATION` **연립방정식과 공통근** — 둘 이상의 방정식, 공통근, 대칭 관계를 연립하여 미지수나 매개변수를 정하는 유형.
  - `TPL_H1_SYSTEM_BRANCH_COMMON_ROOT` 인수 분기·공통근 연립
  - `TPL_H1_SYSTEM_DIRECT` 연립방정식의 직접 해결

## H22-C-07 합의 법칙과 곱의 법칙

### 소단원

- `H22-C-07-CORE` 합의 법칙과 곱의 법칙 핵심 개념
- `H22-C-07-EQUATION_APPLICATION` 방정식과 부등식의 활용
- `H22-C-07-EQUATION_BASIC` 방정식의 풀이
- `H22-C-07-INEQUALITY_BASIC` 부등식의 풀이

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2022 개정**

- `H1-RPM-186` 경우의 수 > 경우의 수와 순열 > 합·곱의 법칙 > 경우를 나누어 세기 · `H22-C-07-CORE`
- `H1-RPM-187` 경우의 수 > 경우의 수와 순열 > 합·곱의 법칙 > 단계별 선택 · `H22-C-07-CORE`

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
- `PT_H1_COUNTING_PRINCIPLE_GENERAL` **경우의 수의 합·곱 법칙** — 합의 법칙·곱의 법칙, 경우 분해, 경로·색칠·격자 등 일반적인 경우의 수를 세는 유형.
  - `TPL_H1_COUNT_TOURNAMENT_BRACKET` 부전승·대진표 자리 배치
  - `TPL_H1_COUNTING_DIRECT_CASE` 합·곱의 법칙과 경우 분해
  - `TPL_H1_COUNTING_GRAPH_PATH_COLOR` 경로·그래프·색칠 경우의 수
  - `TPL_H1_COUNTING_PRINCIPLE_GENERAL_COMPLEMENT` 여사건 경우의 수
- `PT_H1_DIVISOR` **약수** — 소인수 지수의 선택 범위를 이용하여 약수의 개수와 합을 구하거나 그 조건을 만족하는 수를 정한다.

## H22-C-08 순열과 조합

### 소단원

- `H22-C-08-COMBINATION` 조합
- `H22-C-08-CORE` 순열과 조합 핵심 개념
- `H22-C-08-COUNTING_PRINCIPLE` 경우의 수
- `H22-C-08-EQUATION_APPLICATION` 방정식과 부등식의 활용
- `H22-C-08-EQUATION_BASIC` 방정식의 풀이
- `H22-C-08-INEQUALITY_BASIC` 부등식의 풀이
- `H22-C-08-PERMUTATION` 순열

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2022 개정**

- `H1-RPM-188` 경우의 수 > 경우의 수와 순열 > 순열 > 일렬 배열 · `H22-C-08-PERMUTATION`
- `H1-RPM-189` 경우의 수 > 경우의 수와 순열 > 순열 > 특정 조건 배열 · `H22-C-08-PERMUTATION`
- `H1-RPM-190` 경우의 수 > 경우의 수와 순열 > 중복·원순열 기초 > 같은 것이 있는 배열 · `H22-C-08-PERMUTATION`
- `H1-RPM-191` 경우의 수 > 경우의 수와 순열 > 중복·원순열 기초 > 원형 배열 · `H22-C-08-PERMUTATION`
- `H1-RPM-192` 경우의 수 > 조합 > 조합의 뜻과 계산 > 조합 계산 · `H22-C-08-COMBINATION`
- `H1-RPM-193` 경우의 수 > 조합 > 조합의 뜻과 계산 > 순열과 조합 구별 · `H22-C-08-COMBINATION`
- `H1-RPM-194` 경우의 수 > 조합 > 조합의 활용 > 선택 조건 · `H22-C-08-COUNTING_PRINCIPLE`
- `H1-RPM-195` 경우의 수 > 조합 > 조합의 활용 > 도형에서의 선택 · `H22-C-08-COUNTING_PRINCIPLE`
- `H1-RPM-196` 경우의 수 > 조합 > 분할·분배 > 선택 후 배치 · `H22-C-08-COUNTING_PRINCIPLE`
- `H1-RPM-197` 경우의 수 > 조합 > 분할·분배 > 조합을 이용한 경우의 수 · `H22-C-08-COUNTING_PRINCIPLE`
- `H1-RPM-296` 경우의 수 > 경우의 수와 순열 > 합·곱의 법칙 > 단계별 선택 · `H22-C-08-COUNTING_PRINCIPLE`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_COUNTING_ARRANGEMENT` **순열** — 서로 다른 대상의 배열, 원순열, 같은 것이 있는 순열 등 순열 구조를 이용해 경우의 수를 구하는 문제유형.
  - `TPL_CIRCULAR_PERMUTATION` 원순열
  - `TPL_COUNTING_ARRANGEMENT_PATH` 격자 경로
  - `TPL_COUNTING_ARRANGEMENT_ROTATION` 회전 중복
  - `TPL_H1_ARRANGEMENT_LEXICOGRAPHIC_RANK` 사전식 순열 순위·역순위
  - `TPL_IDENTICAL_OBJECT_PERMUTATION` 같은 것이 있는 순열
  - `TPL_PERMUTATION_STANDARD_CONSTRAINT` 일반 순열·조건 배열
- `PT_COUNTING_REPEATED_ASSIGNMENT` **중복순열** — 중복순열 또는 반복 선택·배정 구조로 경우의 수를 구하는 문제유형.
  - `TPL_REPEATED_PERMUTATION_ASSIGNMENT` 중복순열·반복 배정
- `PT_COUNTING_SELECTION_DISTRIBUTION` **조합·중복조합** — 조합·중복조합을 이용하여 대상을 선택하거나 동일한 대상을 분배하는 경우의 수를 구하는 문제유형.
  - `TPL_COMBINATION_SELECTION` 조합과 선택
  - `TPL_H1_BINOMIAL_IDENTITY_CHECK` 조합 항등식 증명·판정
  - `TPL_H1_BINOMIAL_PARAMETER_RELATION` 순열·조합 관계로 매개변수 결정
  - `TPL_H1_SELECTION_BOX_IDENTITY` 상자 배정에서 동일·서로 다른 대상 구분
  - `TPL_H1_SELECTION_CAPACITY_DISTRIBUTION` 수용량 제약이 있는 대상 분배
  - `TPL_H1_SELECTION_GEOMETRIC_DEGENERACY` 기하 점 선택 후 퇴화 경우 제외
  - `TPL_REPEATED_COMBINATION_DISTRIBUTION` 중복조합·정수해·동일물 분배
- `PT_H1_COUNTING_PRINCIPLE_GENERAL` **경우의 수의 합·곱 법칙** — 합의 법칙·곱의 법칙, 경우 분해, 경로·색칠·격자 등 일반적인 경우의 수를 세는 유형.
  - `TPL_H1_COUNT_TOURNAMENT_BRACKET` 부전승·대진표 자리 배치
  - `TPL_H1_COUNTING_DIRECT_CASE` 합·곱의 법칙과 경우 분해
  - `TPL_H1_COUNTING_GRAPH_PATH_COLOR` 경로·그래프·색칠 경우의 수
  - `TPL_H1_COUNTING_PRINCIPLE_GENERAL_COMPLEMENT` 여사건 경우의 수

## H22-C-09 행렬과 그 연산

### 소단원

- `H22-C-09-CORE` 행렬과 그 연산 핵심 개념
- `H22-C-09-MATRIX_APPLICATION` 행렬의 활용
- `H22-C-09-MATRIX_BASIC` 행렬의 뜻과 표현
- `H22-C-09-MATRIX_OPERATION` 행렬의 연산
- `H22-C-09-TRIGONOMETRIC_BASIC` 삼각함수의 기본
- `H22-C-09-TRIGONOMETRIC_EQUATION` 삼각방정식과 부등식
- `H22-C-09-TRIGONOMETRIC_GRAPH` 삼각함수의 그래프

### RPM 행 (id · 경로 · 소단원) — 시험지 교육과정의 행만 쓴다

**2022 개정**

- `H1-RPM-198` 행렬 > 행렬 > 행렬의 뜻 > 행·열·성분 · `H22-C-09-MATRIX_BASIC`
- `H1-RPM-199` 행렬 > 행렬 > 행렬의 뜻 > 같은 행렬 · `H22-C-09-MATRIX_BASIC`
- `H1-RPM-200` 행렬 > 행렬 > 행렬의 연산 > 덧셈·뺄셈·실수배 · `H22-C-09-MATRIX_OPERATION`
- `H1-RPM-201` 행렬 > 행렬 > 행렬의 연산 > 행렬의 곱셈 · `H22-C-09-MATRIX_OPERATION`
- `H1-RPM-202` 행렬 > 행렬 > 행렬의 성질 > 곱셈의 성질 · `H22-C-09-MATRIX_APPLICATION`
- `H1-RPM-203` 행렬 > 행렬 > 행렬의 성질 > 조건을 만족하는 행렬 · `H22-C-09-MATRIX_APPLICATION`
- `H1-RPM-287` 행렬 > 행렬 > 행렬의 연산 > 덧셈·뺄셈·실수배 · `H22-C-09-CORE`
- `H1-RPM-288` 행렬 > 행렬 > 행렬의 성질 > 곱셈의 성질 · `H22-C-09-CORE`
- `H1-RPM-289` 행렬 > 행렬 > 행렬의 성질 > 조건을 만족하는 행렬 · `H22-C-09-CORE`
- `H1-RPM-293` 행렬 > 행렬 > 행렬의 뜻 > 같은 행렬 · `H22-C-09-CORE`
- `H1-RPM-294` 행렬 > 행렬 > 행렬의 연산 > 행렬의 곱셈 · `H22-C-09-CORE`
- `H1-RPM-295` 행렬 > 행렬 > 행렬의 뜻 > 행·열·성분 · `H22-C-09-CORE`
- `H1-RPM-297` 행렬 > 행렬 > 행렬의 연산 > 행렬의 곱셈 · `H22-C-09-CORE`
- `H1-RPM-298` 행렬 > 행렬 > 행렬의 뜻 > 행·열·성분 · `H22-C-09-CORE`
- `H1-RPM-299` 행렬 > 행렬 > 행렬의 연산 > 행렬의 곱셈 · `H22-C-09-CORE`

### 유형 (PT 키 · 이름 — 정의, 그 아래 TPL)

- `PT_H1_MATRIX_BASIC_OPERATION` **행렬의 기본과 연산** — 행렬의 크기·상등·성분·덧셈·뺄셈·스칼라배를 다루는 유형.
  - `TPL_H1_MATRIX_BASIC_DIRECT` 행렬의 기본 성분 연산
  - `TPL_H1_MATRIX_BASIC_EQUALITY` 행렬의 상등과 성분 비교
  - `TPL_H1_MATRIX_BASIC_OPERATION_REPRESENT` 자료의 행렬 표현
- `PT_H1_MATRIX_EQUATION` **행렬 방정식** — 행렬 상등·방정식·교환 조건으로 미지 행렬이나 성분을 정하는 유형.
  - `TPL_H1_MATRIX_EQUATION_COMMUTE` 행렬 관계와 교환성
  - `TPL_H1_MATRIX_EQUATION_LINEAR` 행렬 방정식과 성분 연립
  - `TPL_H1_MATRIX_EQUATION_STRUCTURAL` 교환·인수·비선형 행렬 조건
- `PT_H1_MATRIX_MULTIPLICATION` **행렬의 곱셈** — 행렬곱·제곱의 성분을 계산하거나 곱의 의미를 활용하는 유형.
  - `TPL_H1_MATRIX_MULTIPLICATION_DIMENSION` 행렬곱 정의 조건
  - `TPL_H1_MATRIX_MULTIPLICATION_LINEARITY` 행렬작용 선형결합
  - `TPL_H1_MATRIX_PRODUCT_DIRECT` 행렬곱·제곱의 직접 계산
  - `TPL_H1_MATRIX_PRODUCT_MODEL` 행렬곱의 자료·관계 해석
- `PT_H1_MATRIX_POWER_IDENTITY` **행렬의 거듭제곱과 항등관계** — 행렬 거듭제곱의 주기, 다항식 관계, 항등식을 이용하는 유형.
  - `TPL_H1_MATRIX_POWER_IDENTITY_DIAGONAL_POWER` 대각행렬 거듭제곱
  - `TPL_H1_MATRIX_POWER_IDENTITY_POWER_CLAIMS` 행렬 거듭제곱 명제
  - `TPL_H1_MATRIX_POWER_IDENTITY_SHEAR_POWER` 비대각 거듭제곱
  - `TPL_H1_MATRIX_POWER_PERIOD` 행렬 거듭제곱의 주기
  - `TPL_H1_MATRIX_POWER_POLYNOMIAL` 행렬의 다항식 항등관계

## 아래 학년 유형

학년이 같거나 낮은 다른 과목의 유형도 쓸 수 있다 (키의 학년이 시험지 학년 이하이면 받는다). 키 순서이고, 정의·TPL 은 그 과목의 선택표 파일에 있다.

### 중1 수학 (MIDDLE1) · 중1 — 파일 `MIDDLE1.md`

- `PT_ABSOLUTE_VALUE_SIGN_EXTREMES` 절댓값 조건에서 가능한 극값 (TPL 1)
- `PT_ALGEBRAIC_PRODUCT_TERM_RECOVERY` 곱셈식의 빠진 항 복원 (TPL 1)
- `PT_BOUNDED_PRIME_COUNT` 범위 안의 소수 개수 (TPL 1)
- `PT_CIRCLE_ANGLE_RELATIONS` 원주각·중심각과 원의 각 관계 (TPL 11)
- `PT_CONSTRAINED_FACTOR_PAIR` 조건을 만족하는 인수쌍 (TPL 1)
- `PT_COORDINATE_POINT_READING` 좌표평면의 점·관계 해석 (TPL 5)
- `PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION` 정비례·반비례 관계 판별 (TPL 1)
- `PT_DIVISOR_COUNT` 약수의 개수 조건 (TPL 2)
- `PT_EQUAL_ABSOLUTE_VALUE_DIFFERENCE_RECOVERY` 절댓값이 같은 두 수의 차 (TPL 2)
- `PT_EXTREME_PRODUCT_FROM_SELECTED_RATIONALS` 선택한 유리수 곱의 극값 (TPL 2)
- `PT_FUNCTION_GRAPH_INTERSECTION` 함수 그래프의 교점 (TPL 7)
- `PT_FUNCTION_GRAPH_PROPERTIES` 함수 그래프의 성질 (TPL 4)
- `PT_FUNCTION_GRAPH_QUADRANT` 함수 그래프와 사분면 (TPL 3)
- `PT_GRAPH_TO_CONTAINER_SHAPE_INFERENCE` 수위 그래프와 용기 모양 대응 (TPL 2)
- `PT_H1_POLY_IDENTITY_COEFFICIENT` 항등식과 미정계수 (TPL 2)
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
- `PT_M1_EQUATION` 등식과 방정식 (TPL 2)
- `PT_M1_FACTOR_PAIR` 인수쌍
- `PT_M1_FINITE_LIST_PRIME_COUNT` 유한 목록의 소수 개수 (TPL 1)
- `PT_M1_FREQUENCY` 도수분포
- `PT_M1_FREQUENCY_DISTRIBUTION_READING` 도수분포표·다각형의 누적 해석 (TPL 8)
- `PT_M1_GCD_DIVISOR_APPLICATION` 공약수의 최댓값 적용 (TPL 2)
- `PT_M1_GCD_LCM` 최대공약수와 최소공배수
- `PT_M1_GCD_LCM_EXPONENT_CONSTRAINT` 최대공약수·최소공배수의 소인수 지수 조건 (TPL 6)
- `PT_M1_GENERATED_GEOMETRIC_OBJECT_COUNT` 점에서 결정되는 직선·반직선·선분 개수 (TPL 2)
- `PT_M1_IDENTITY` 항등식 (TPL 2)
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
- `PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION` 잘못 더한 다항식의 바른 계산 복원 (TPL 2)
- `PT_MAGIC_SQUARE_ENTRY_RECOVERY` 마방진의 빠진 값 (TPL 1)
- `PT_MINIMUM_COMMON_MULTIPLIER_FOR_RATIONALS` 유리수의 최소 공통 배수 인자 (TPL 1)
- `PT_MINIMUM_FACTOR_TO_PERFECT_SQUARE` 완전제곱수가 되는 최소 인자 (TPL 3)
- `PT_MISSING_VALUES_FROM_EQUAL_SIDE_SUMS` 같은 변의 합에서 빠진 수 (TPL 1)
- `PT_MOVE_FOLDING_REFLECTION` 접기와 대칭이동 (TPL 3)
- `PT_PERPENDICULAR_FOOT_ON_SOLID_EDGE` 입체 모서리의 수선의 발 (TPL 1)
- `PT_PRIME_EXPONENT_IN_CONSECUTIVE_PRODUCT` 연속된 수의 곱에서 소인수 지수 (TPL 1)
- `PT_QUADRILATERAL_PROPERTIES` 사각형의 성질과 판정 (TPL 4)
- `PT_RATIONAL_EXPRESSION` 유리식의 계산 (TPL 5)
- `PT_RATIONAL_EXPRESSION_BOUNDED_INTEGER_SUM` 유리수식과 범위 정수의 합 (TPL 1)
- `PT_RIGHT_TRIANGLE_CONGRUENCE` 직각삼각형의 합동 (TPL 3)
- `PT_SIGN_CONSTRAINT_DEDUCTION_FOR_RATIONALS` 유리수 곱·차 조건에서 부호 추론 (TPL 1)
- `PT_TRIANGLE_AREA_FROM_SQUARE_EQUILATERAL_POSITION` 정사각형·정삼각형 배치의 넓이 (TPL 1)

### 중2 수학 (MIDDLE2) · 중2 — 파일 `MIDDLE2.md`

- `PT_CIRCLE_LINE_RELATION` 원과 직선 (TPL 8)
- `PT_COORD_CENTROID` 삼각형의 무게중심 (TPL 6)
- `PT_COUNTING_ARRANGEMENT` 순열 (TPL 6)
- `PT_COUNTING_SELECTION_DISTRIBUTION` 조합·중복조합 (TPL 7)
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
- `PT_M2_TRIANGLE_PROPERTY_TRUE_FALSE` 삼각형 성질의 참·거짓 판별
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
- `PT_M3_REGULAR_POLYGON` 정다각형
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
- `PT_MOVE_GRAPH_REFLECTION` 그래프의 대칭이동 (TPL 2)
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
- `PT_MOVE_GRAPH_REFLECTION` 그래프의 대칭이동 (TPL 2)
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
