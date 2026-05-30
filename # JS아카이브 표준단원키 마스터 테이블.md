# JS아카이브 표준단원키 마스터 테이블

> 기준: 중학교 2022 개정 / 고등학교 2015·2022 개정 교육과정  
> 용도: JS 파일 내 `standardCourse`, `standardUnitKey`, `standardUnit`, `standardUnitOrder` 및 유사문제용 확장 태그(`subUnitKey`, `conceptClusterKey`, `problemTypeKey`, `templateKey`) 작성 기준  
> 관리: 새 단원 추가 시 이 파일에 먼저 등록 후 사용  
> 세부 단원은 `subUnitKey`로 확장 관리하고, 미편입 항목만 RAW- 또는 PROPOSED-로 임시 분리

---

## 최상위 원칙

- 이 문서는 JS아카이브의 `standardCourse`, `standardUnitKey`, `standardUnit`, `standardUnitOrder` 작성 기준 원본이며, 유사문제용 확장 태그의 최상위 기준 원본이다.
- 새 문항 생성, 기존 문항 수정, db 생성, mixer 필터 기준은 이 문서를 우선한다.
- 대응 단원이 명확하면 RAW 사용을 금지한다.
- 매핑이 불가능한 경우에만 `RAW-단원명`, `standardUnitOrder: 999`를 사용한다.
- 중학교는 2022 개정 기준을 사용한다.
- 고등학교는 2022 개정 + 2015 개정 호환 체계를 함께 보관한다.
- 운영상 신규 표준화는 2022 개정 기준을 우선하되, 기존 2015 개정 자료 호환을 위해 2015 개정 키도 유지한다.

---


## 유사문제용 확장 태그 마스터 운영 원칙

기존 `standardUnitKey`는 단원 필터와 교육과정 매핑의 기준으로 유지한다.  
유사문제 추천과 자동 시험지 구성에는 아래 확장 태그를 함께 사용한다.

| 필드 | 역할 | 사용 기준 |
|------|------|----------|
| `subUnitKey` | 대단원/중단원 내부 세부 단원 | 중등 대단원 세분화, 고등 중단원 내부 보조 분류 |
| `subUnit` | 세부 단원명 | 사용자·검수자 확인용 한글명 |
| `conceptClusterKey` | 핵심 개념 묶음 | 같은 개념군 후보 탐색 |
| `problemTypeKey` | 문제 유형 | 유사문제 최소 판정 기준 |
| `templateKey` | 풀이 패턴/출제 템플릿 | 거의 같은 풀이 구조 판정 기준 |
| `difficultyBucket` | 보조 난이도 구간 | 자동 시험지 구성·유사문제 난이도 조절 |
| `tagConfidence` | 자동 태깅 신뢰도 | high / medium / low |
| `tagStatus` | 태그 검수 상태 | existing / auto_high / auto_medium / auto_low / manual_review / reviewed_pass / reviewed_fail |

### 유사문제 판정 원칙

- `standardUnitKey`만 같은 문항은 유사문제가 아니라 같은 단원 문항이다.
- 유사문제는 최소 `problemTypeKey`가 같아야 한다.
- 거의 같은 풀이 구조는 `templateKey`가 같아야 한다.
- 자동 유사문제 추천에는 `reviewed_pass` 또는 신뢰도 높은 `auto_high`만 사용한다.
- `auto_low`, `manual_review`, `reviewed_fail`은 자동 추천·자동 시험지 구성에 사용하지 않는다.

### 키 생성 규칙

`subUnitKey`는 기존 `standardUnitKey` 뒤에 영문 슬러그를 붙인다.

```text
{standardUnitKey}-{SLUG}
```

예:

```text
M2-04-LINEAR_FUNCTION_GRAPH
H22-C-08-COMBINATION
```

`conceptClusterKey`, `problemTypeKey`, `templateKey`는 영어 대문자와 언더스코어를 사용한다.

```text
conceptClusterKey: LINEAR_FUNCTION_GRAPH
problemTypeKey: LINEAR_FUNCTION_FIND_EQUATION
templateKey: LINEAR_FUNCTION_TWO_POINTS
```

### 신규 키 추가 원칙

- 마스터 테이블에 없는 키를 최종 JS에 바로 넣지 않는다.
- 자동 태깅 중 새 키가 필요하면 `PROPOSED-` 접두 또는 `manual_review` 상태로 분리한다.
- 신규 키는 먼저 이 마스터 테이블에 추가한 뒤 사용한다.
- 문제 원문을 읽고 유형을 판단할 수 있더라도, 신뢰도가 낮으면 확정하지 않는다.
- 하나의 문항이 여러 유형에 걸치면 대표 `problemTypeKey` 하나와 보조 `tags`를 병행하되, 자동 추천에는 대표 키만 사용한다.

---

## 중학교 수학 확장 subUnitKey 초기 마스터

중학교는 기존 `standardUnitKey`가 대단원에 가까우므로, 유사문제 추천에는 `subUnitKey` 보강이 필수다.

### 중1 확장 subUnitKey

| standardUnitKey | subUnitKey | subUnit | conceptClusterKey |
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
| M1-06 | M1-06-POLYGON_CIRCLE | 다각형과 원 | POLYGON_CIRCLE |
| M1-06 | M1-06-PLANE_FIGURE_MEASURE | 평면도형의 측정 | PLANE_FIGURE_MEASURE |
| M1-07 | M1-07-SOLID_FIGURE | 입체도형 | SOLID_FIGURE |
| M1-07 | M1-07-SOLID_FIGURE_MEASURE | 입체도형의 측정 | SOLID_FIGURE_MEASURE |
| M1-08 | M1-08-DATA_ORGANIZATION | 자료의 정리 | DATA_ORGANIZATION |
| M1-08 | M1-08-DATA_INTERPRETATION | 자료의 해석 | DATA_INTERPRETATION |

### 중2 확장 subUnitKey

| standardUnitKey | subUnitKey | subUnit | conceptClusterKey |
|---|---|---|---|
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

### 중3 확장 subUnitKey

| standardUnitKey | subUnitKey | subUnit | conceptClusterKey |
|---|---|---|---|
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

---

## 유사문제용 problemTypeKey / templateKey 초기 예시

이 표는 자동 태깅과 검수 기준을 통일하기 위한 초기 예시다. 실제 키는 누적 데이터 검수 후 확장한다.

| conceptClusterKey | problemTypeKey | templateKey | 설명 |
|---|---|---|---|
| LINEAR_EQUATION | LINEAR_EQUATION_SOLVE | LINEAR_EQUATION_BASIC_TRANSFORM | 일차방정식 기본 풀이 |
| LINEAR_EQUATION_WORD_PROBLEM | LINEAR_EQUATION_WORD_PROBLEM | LINEAR_EQUATION_AGE | 나이 문제 |
| LINEAR_EQUATION_WORD_PROBLEM | LINEAR_EQUATION_WORD_PROBLEM | LINEAR_EQUATION_DISTANCE_SPEED_TIME | 거리·속력·시간 문제 |
| LINEAR_INEQUALITY | LINEAR_INEQUALITY_SOLVE | LINEAR_INEQUALITY_BASIC_TRANSFORM | 일차부등식 기본 풀이 |
| SIMULTANEOUS_LINEAR_EQUATION | SIMULTANEOUS_LINEAR_EQUATION_SOLVE | SIMULTANEOUS_LINEAR_EQUATION_ELIMINATION | 연립방정식 가감법/대입법 |
| LINEAR_FUNCTION_GRAPH | LINEAR_FUNCTION_FIND_EQUATION | LINEAR_FUNCTION_TWO_POINTS | 두 점으로 일차함수 식 구하기 |
| LINEAR_FUNCTION_GRAPH | LINEAR_FUNCTION_FIND_EQUATION | LINEAR_FUNCTION_SLOPE_POINT | 기울기와 한 점으로 식 구하기 |
| QUADRATIC_EQUATION | QUADRATIC_EQUATION_SOLVE | QUADRATIC_EQUATION_FACTORING | 인수분해로 이차방정식 풀기 |
| QUADRATIC_EQUATION | QUADRATIC_EQUATION_SOLVE | QUADRATIC_FORMULA | 근의 공식 사용 |
| QUADRATIC_FUNCTION_GRAPH | QUADRATIC_FUNCTION_GRAPH_ANALYSIS | QUADRATIC_FUNCTION_VERTEX_AXIS | 꼭짓점·축·그래프 해석 |
| PERMUTATION | PERMUTATION_ARRANGEMENT_CONDITION | PERMUTATION_ADJACENT_CONDITION | 이웃 조건 순열 |
| PERMUTATION | PERMUTATION_ARRANGEMENT_CONDITION | PERMUTATION_NON_ADJACENT | 이웃하지 않는 조건 순열 |
| COMBINATION | COMBINATION_SELECTION_CONDITION | COMBINATION_AT_LEAST_ONE | 적어도 하나 포함 조합 |
| COMBINATION | COMBINATION_SELECTION_CONDITION | COMBINATION_COMPLEMENT_COUNT | 여사건/보완 계산 조합 |
| PROBABILITY_BASIC | PROBABILITY_BASIC_COUNT | PROBABILITY_COMPLEMENT | 여사건 확률 |
| PYTHAGOREAN_THEOREM | PYTHAGOREAN_LENGTH_FIND | PYTHAGOREAN_RIGHT_TRIANGLE_LENGTH | 직각삼각형 길이 구하기 |
| CIRCLE_PROPERTIES | CIRCLE_ANGLE_FIND | CIRCLE_INSCRIBED_ANGLE | 원주각 활용 |
| TRIG_RATIO | TRIG_RATIO_LENGTH_FIND | TRIG_RATIO_RIGHT_TRIANGLE | 직각삼각형 삼각비 |

---

## 중학교 수학 (2022 개정)

### M1 (중1)

| Key   | 단원명 | Order |
|-------|--------|------:|
| M1-01 | 소인수분해 | 1 |
| M1-02 | 정수와 유리수 | 2 |
| M1-03 | 문자와 식 | 3 |
| M1-04 | 좌표평면과 그래프 | 4 |
| M1-05 | 기본도형 | 5 |
| M1-06 | 평면도형의 성질 | 6 |
| M1-07 | 입체도형의 성질 | 7 |
| M1-08 | 자료의 정리와 해석 | 8 |

### M2 (중2)

| Key   | 단원명 | Order |
|-------|--------|------:|
| M2-01 | 수와 식 | 1 |
| M2-02 | 일차부등식 | 2 |
| M2-03 | 연립일차방정식 | 3 |
| M2-04 | 일차함수와 그래프 | 4 |
| M2-05 | 도형의 성질 | 5 |
| M2-06 | 도형의 닮음 | 6 |
| M2-07 | 피타고라스 정리 | 7 |
| M2-08 | 확률 | 8 |

### M3 (중3)

| Key   | 단원명 | Order |
|-------|--------|------:|
| M3-01 | 실수와 그 계산 | 1 |
| M3-02 | 다항식의 곱셈과 인수분해 | 2 |
| M3-03 | 이차방정식 | 3 |
| M3-04 | 이차함수와 그래프 | 4 |
| M3-05 | 삼각비 | 5 |
| M3-06 | 원의 성질 | 6 |
| M3-07 | 통계 | 7 |

---


## 고등학교 확장 태그 운영 원칙

고등학교는 기존 `standardUnitKey`가 이미 소단원에 가까우므로, 많은 경우 `subUnitKey`는 `standardUnitKey` 내부 보조 분류로만 사용한다.  
고등 유사문제 추천의 핵심은 `problemTypeKey`와 `templateKey`다.

예:

```text
standardUnitKey: H22-C-08
standardUnit: 순열과 조합
subUnitKey: H22-C-08-COMBINATION
conceptClusterKey: COMBINATION
problemTypeKey: COMBINATION_SELECTION_CONDITION
templateKey: COMBINATION_AT_LEAST_ONE
```

고등 문항 태그 고도화 원칙:

- 기존 `standardUnitKey`를 임의로 바꾸지 않는다.
- 2015/2022 개정 체계를 섞지 않는다.
- 같은 중단원이라도 순열/조합, 함수/유리함수/무리함수, 지수/로그/지수함수/로그함수처럼 유형 차이가 큰 경우 `conceptClusterKey`를 반드시 나눈다.
- 유사문제 추천은 `standardUnitKey`보다 `problemTypeKey`와 `templateKey`를 우선한다.
- 확실하지 않은 고등 심화 유형은 `tag_low_confidence` 또는 `manual_review`로 분리한다.

---

## 고등학교 수학 (2022 개정, 소단원 기준)

### 공통수학1 (H22-C)

#### 1. 다항식
- 다항식의 연산
- 항등식과 나머지 정리
- 인수분해

#### 2. 방정식과 부등식
- 복소수와 이차방정식
- 이차방정식과 이차함수
- 여러 가지 방정식과 부등식

#### 3. 경우의 수
- 합의 법칙과 곱의 법칙
- 순열과 조합

#### 4. 행렬
- 행렬과 그 연산

| Key | 단원명 | Order |
|-----|--------|------:|
| H22-C-01 | 다항식의 연산 | 1 |
| H22-C-02 | 항등식과 나머지 정리 | 2 |
| H22-C-03 | 인수분해 | 3 |
| H22-C-04 | 복소수와 이차방정식 | 4 |
| H22-C-05 | 이차방정식과 이차함수 | 5 |
| H22-C-06 | 여러 가지 방정식과 부등식 | 6 |
| H22-C-07 | 합의 법칙과 곱의 법칙 | 7 |
| H22-C-08 | 순열과 조합 | 8 |
| H22-C-09 | 행렬과 그 연산 | 9 |

### 공통수학2 (H22-C2)

#### 1. 도형의 방정식
- 평면좌표
- 직선의 방정식
- 원의 방정식
- 도형의 이동

#### 2. 집합과 명제
- 집합
- 명제

#### 3. 함수와 그래프
- 함수
- 유리함수와 무리함수

| Key | 단원명 | Order |
|-----|--------|------:|
| H22-C2-01 | 평면좌표 | 1 |
| H22-C2-02 | 직선의 방정식 | 2 |
| H22-C2-03 | 원의 방정식 | 3 |
| H22-C2-04 | 도형의 이동 | 4 |
| H22-C2-05 | 집합 | 5 |
| H22-C2-06 | 명제 | 6 |
| H22-C2-07 | 함수 | 7 |
| H22-C2-08 | 유리함수 | 8 |
| H22-C2-09 | 무리함수 | 9 |

### 대수 (H22-A)

#### 1. 지수함수와 로그함수
- 지수와 로그
- 지수함수
- 로그함수

#### 2. 삼각함수
- 삼각함수
- 사인법칙과 코사인법칙

#### 3. 수열
- 등차수열과 등비수열
- 수열의 합
- 수학적 귀납법

| Key | 단원명 | Order |
|-----|--------|------:|
| H22-A-01 | 지수와 로그 | 1 |
| H22-A-02 | 지수함수 | 2 |
| H22-A-03 | 로그함수 | 3 |
| H22-A-04 | 삼각함수 | 4 |
| H22-A-05 | 사인법칙과 코사인법칙 | 5 |
| H22-A-06 | 등차수열과 등비수열 | 6 |
| H22-A-07 | 수열의 합 | 7 |
| H22-A-08 | 수학적 귀납법 | 8 |

### 미적분I (H22-M1)

#### 1. 함수의 극한과 연속
- 함수의 극한
- 함수의 연속

#### 2. 미분
- 미분계수
- 도함수
- 도함수의 활용

#### 3. 적분
- 부정적분
- 정적분
- 정적분의 활용

| Key | 단원명 | Order |
|-----|--------|------:|
| H22-M1-01 | 함수의 극한 | 1 |
| H22-M1-02 | 함수의 연속 | 2 |
| H22-M1-03 | 미분계수 | 3 |
| H22-M1-04 | 도함수 | 4 |
| H22-M1-05 | 도함수의 활용 | 5 |
| H22-M1-06 | 부정적분 | 6 |
| H22-M1-07 | 정적분 | 7 |
| H22-M1-08 | 정적분의 활용 | 8 |

### 미적분II (H22-M2)

#### 1. 수열의 극한
- 수열의 수렴, 발산
- 극한에 대한 성질
- 급수
- 급수의 수렴과 발산
- 등비급수

#### 2. 미분법
- 지수함수와 로그함수의 미분
- 삼각함수의 미분
- 여러 가지 미분법
- 도함수의 활용

#### 3. 적분법
- 여러 가지 적분법
- 정적분의 활용

| Key | 단원명 | Order |
|-----|--------|------:|
| H22-M2-01 | 수열의 극한 | 1 |
| H22-M2-02 | 급수 | 2 |
| H22-M2-03 | 지수함수와 로그함수의 미분 | 3 |
| H22-M2-04 | 삼각함수의 미분 | 4 |
| H22-M2-05 | 여러 가지 미분법 | 5 |
| H22-M2-06 | 도함수의 활용 | 6 |
| H22-M2-07 | 여러 가지 적분법 | 7 |
| H22-M2-08 | 정적분의 활용 | 8 |

### 확률과 통계 (H22-PS)

#### 1. 경우의 수
- 순열과 조합
- 이항정리

#### 2. 확률
- 확률의 뜻과 활용
- 조건부확률

#### 3. 통계
- 확률분포
- 통계적 추정

| Key | 단원명 | Order |
|-----|--------|------:|
| H22-PS-01 | 순열과 조합 | 1 |
| H22-PS-02 | 이항정리 | 2 |
| H22-PS-03 | 확률의 뜻과 활용 | 3 |
| H22-PS-04 | 조건부확률 | 4 |
| H22-PS-05 | 확률분포 | 5 |
| H22-PS-06 | 통계적 추정 | 6 |

### 기하 (H22-GE)

#### 1. 이차곡선
- 이차곡선
- 이차곡선의 접선

#### 2. 공간도형과 공간좌표
- 공간도형
- 공간좌표

#### 3. 벡터
- 벡터의 연산
- 벡터의 성분
- 벡터의 내적
- 도형의 방정식

| Key | 단원명 | Order |
|-----|--------|------:|
| H22-GE-01 | 이차곡선 | 1 |
| H22-GE-02 | 이차곡선의 접선 | 2 |
| H22-GE-03 | 공간도형 | 3 |
| H22-GE-04 | 공간좌표 | 4 |
| H22-GE-05 | 벡터의 연산 | 5 |
| H22-GE-06 | 벡터의 성분 | 6 |
| H22-GE-07 | 벡터의 내적 | 7 |
| H22-GE-08 | 도형의 방정식 | 8 |

---

## 고등학교 수학 (2015 개정, 호환/참조용 소단원 기준)

### 수학(상) (H15-SA)

| Key | 단원명 | Order |
|-----|--------|------:|
| H15-SA-01 | 다항식의 연산 | 1 |
| H15-SA-02 | 항등식과 나머지정리 | 2 |
| H15-SA-03 | 인수분해 | 3 |
| H15-SA-04 | 복소수 | 4 |
| H15-SA-05 | 이차방정식 | 5 |
| H15-SA-06 | 이차방정식의 근과 계수 | 6 |
| H15-SA-07 | 여러 가지 방정식 | 7 |
| H15-SA-08 | 여러 가지 부등식 | 8 |
| H15-SA-09 | 평면좌표 | 9 |
| H15-SA-10 | 직선의 방정식 | 10 |
| H15-SA-11 | 원의 방정식 | 11 |
| H15-SA-12 | 도형의 이동 | 12 |

### 수학(하) (H15-SB)

| Key | 단원명 | Order |
|-----|--------|------:|
| H15-SB-01 | 집합 | 1 |
| H15-SB-02 | 명제 | 2 |
| H15-SB-03 | 함수 | 3 |
| H15-SB-04 | 유리함수 | 4 |
| H15-SB-05 | 무리함수 | 5 |
| H15-SB-06 | 경우의 수 | 6 |
| H15-SB-07 | 순열 | 7 |
| H15-SB-08 | 조합 | 8 |

### 수학I (H15-M1)

| Key | 단원명 | Order |
|-----|--------|------:|
| H15-M1-01 | 지수의 뜻과 성질 | 1 |
| H15-M1-02 | 로그의 뜻과 성질 | 2 |
| H15-M1-03 | 지수함수 | 3 |
| H15-M1-04 | 로그함수 | 4 |
| H15-M1-05 | 삼각함수의 뜻과 값 | 5 |
| H15-M1-06 | 삼각함수의 그래프 | 6 |
| H15-M1-07 | 삼각방정식과 삼각부등식 | 7 |
| H15-M1-08 | 등차수열 | 8 |
| H15-M1-09 | 등비수열 | 9 |
| H15-M1-10 | 수열의 합 | 10 |
| H15-M1-11 | 수학적 귀납법 | 11 |

### 수학II (H15-M2)

| Key | 단원명 | Order |
|-----|--------|------:|
| H15-M2-01 | 함수의 극한 | 1 |
| H15-M2-02 | 함수의 연속 | 2 |
| H15-M2-03 | 미분계수 | 3 |
| H15-M2-04 | 도함수 | 4 |
| H15-M2-05 | 접선의 방정식 | 5 |
| H15-M2-06 | 도함수의 활용 | 6 |
| H15-M2-07 | 부정적분 | 7 |
| H15-M2-08 | 정적분 | 8 |
| H15-M2-09 | 적분의 활용 | 9 |

### 미적분 (H15-CALC)

| Key | 단원명 | Order |
|-----|--------|------:|
| H15-CALC-01 | 수열의 극한 | 1 |
| H15-CALC-02 | 급수 | 2 |
| H15-CALC-03 | 지수함수와 로그함수의 미분 | 3 |
| H15-CALC-04 | 삼각함수의 미분 | 4 |
| H15-CALC-05 | 여러 가지 미분법 | 5 |
| H15-CALC-06 | 도함수의 활용 | 6 |
| H15-CALC-07 | 여러 가지 적분법 | 7 |
| H15-CALC-08 | 정적분의 활용 | 8 |

### 확률과 통계 (H15-PS)

| Key | 단원명 | Order |
|-----|--------|------:|
| H15-PS-01 | 순열과 조합 | 1 |
| H15-PS-02 | 이항정리 | 2 |
| H15-PS-03 | 확률의 뜻과 활용 | 3 |
| H15-PS-04 | 조건부확률 | 4 |
| H15-PS-05 | 확률분포 | 5 |
| H15-PS-06 | 통계적 추정 | 6 |

### 기하와 벡터 (H15-GV)

| Key | 단원명 | Order |
|-----|--------|------:|
| H15-GV-01 | 포물선 | 1 |
| H15-GV-02 | 타원 | 2 |
| H15-GV-03 | 쌍곡선 | 3 |
| H15-GV-04 | 이차곡선과 직선 | 4 |
| H15-GV-05 | 벡터의 연산 | 5 |
| H15-GV-06 | 평면벡터의 성분과 내적 | 6 |
| H15-GV-07 | 직선과 원의 방정식 | 7 |
| H15-GV-08 | 공간도형 | 8 |
| H15-GV-09 | 공간좌표 | 9 |

---


## PROPOSED 확장 태그 임시 보류 규칙

마스터 테이블에 아직 없는 `subUnitKey`, `conceptClusterKey`, `problemTypeKey`, `templateKey` 후보는 최종 JS에 확정 반영하지 않는다.

임시 후보 표기:

```text
PROPOSED-{KEY}
```

운영 기준:

- 자동 태깅 결과가 명확하지 않으면 `PROPOSED-`로 두지 말고 `manual_review`로 분리한다.
- 사람이 검수해 반복 사용 가치가 확인된 키만 마스터 테이블에 편입한다.
- 편입 전 키는 유사문제 자동 추천에 사용하지 않는다.
- 편입 후에는 기존 후보 문항을 다시 태깅해 `reviewed_pass`로 전환한다.

---

## RAW (임시 미분류)

> 대단원에 매핑 안 되는 세부 단원은 `RAW-단원명` 형식으로 임시 사용한다.  
> 추후 위 체계로 편입한다.  
> `standardUnitOrder: 999`를 사용한다.

### RAW 사용 규칙
- 대응 표준단원이 명확하면 RAW 사용 금지
- OCR 불안정, 임시 데이터, 아직 마스터 미편입 세부 단원만 RAW 허용
- 최종본 확정 전에는 가능한 한 표준단원으로 환원

---

## standardCourse 표기 기준

### 중학교
| 과정 | standardCourse |
|------|----------------|
| 중1 | 중1 수학 |
| 중2 | 중2 수학 |
| 중3 | 중3 수학 |

### 고등학교 (2022 개정)
| 과정 | standardCourse |
|------|----------------|
| 공통수학1 | 공통수학1 |
| 공통수학2 | 공통수학2 |
| 대수 | 대수 |
| 미적분I | 미적분I |
| 미적분II | 미적분II |
| 확률과 통계 | 확률과 통계 |
| 기하 | 기하 |

### 고등학교 (2015 개정)
| 과정 | standardCourse |
|------|----------------|
| 수학(상) | 수학(상) |
| 수학(하) | 수학(하) |
| 수학I | 수학I |
| 수학II | 수학II |
| 미적분 | 미적분 |
| 확률과 통계 | 확률과 통계 |
| 기하와 벡터 | 기하와 벡터 |

---

## 파일명 컨벤션

```text
기출:     YY_학교명_N학기_중간|기말_학년_과목.js
유형:     단원명_학년_유형.js / 단원명_학년_유형2.js
단원평가: 단원명_학년_단원평가.js
쪽지:     단원명_학년_쪽지.js

---

## v2.4 동기화 메모

- 본 마스터 테이블은 JS아카이브 룰북 v2.4의 유사문제용 확장 태그 정책과 동기화한다.
- `standardUnitKey`는 기존 단원 체계의 기준이고, `subUnitKey/problemTypeKey/templateKey`는 유사문제·자동 시험지 구성용 확장 태그다.
- 기존 JS 문항의 원문, 보기, 정답, 해설은 태그 고도화 작업에서 수정하지 않는다.
