# 수학II 원본 metadata 전수조사 보고서

- 조사일: 2026-09-07
- 조사 기준: `origin/main`
- 조사 기준 HEAD SHA: `dadd5945c3bea2b9b1751f8521be4c4feae5c55e`
- 대상: `archive/exams/original/**`
- 제외: `archive/exams/similar/**`
- 조사 목적: production 원본 수학II 문항의 metadata 구조·의미·question-index parity 조사 및 수정 후보 고정
- 작업 성격: evidence/report commit only

## 1. 조사 경계와 보호 상태

`origin/main`을 fetch한 뒤 `HEAD`와 `origin/main`이 동일한지 확인했다.
원본 시험지 파일명이나 디렉터리명으로 분모를 추정하지 않고, `archive/exams/original/**`의 실제 production JS를 로드하여 각 문항의 `standardCourse === "수학II"`를 기준으로 inventory를 확정했다.

이번 evidence commit에는 이 보고서만 포함한다. 조사 중 발견된 production metadata는 수정하지 않았다.

조사 과정에서 기존 변경으로 취급하여 보존한 경로:

- `archive/tools/pipeline-core/render.mjs`
- `archive/exams/original/high/h2/2mid/24_조대부고_2학기_중간_고2_수학II.js`

위 경로들은 이 report commit에 stage하지 않는다. `git add .`, `git add -A`, stash, reset, clean, restore를 사용하지 않는다.

## 2. INVENTORY

- 수학II 원본 시험지: **21개**
- 전체 문항: **475문항**
- 원본 JS 전체 로드 대상: **350개**
- 원본 JS parse/load 오류: **0건**
- 유사문제 분모 포함: **아니오**

| 연도 | 시험 | 학교 | production 파일 | 문항 |
|---:|---|---|---|---:|
| 2025 | 2학기 기말 | 강남여고 | `25_강남여고_2학기_기말_고2_수학II.js` | 25 |
| 2025 | 2학기 기말 | 매산고 | `25_매산고_2학기_기말_고2_수학II.js` | 22 |
| 2025 | 2학기 기말 | 매산여고 | `25_매산여고_2학기_기말_고2_수학II.js` | 23 |
| 2025 | 2학기 기말 | 순천고 | `25_순천고_2학기_기말_고2_수학II.js` | 24 |
| 2025 | 2학기 기말 | 제일고 | `25_제일고_2학기_기말_고2_수학II.js` | 23 |
| 2022 | 2학기 중간 | 순천고 | `22_순천고_2학기_중간_고2_수학II.js` | 22 |
| 2022 | 2학기 중간 | 팔마고 | `22_팔마고_2학기_중간_고2_수학II.js` | 22 |
| 2022 | 2학기 중간 | 효천고 | `22_효천고_2학기_중간_고2_수학II.js` | 25 |
| 2023 | 2학기 중간 | 매산고 | `23_매산고_2학기_중간_고2_수학II.js` | 20 |
| 2023 | 2학기 중간 | 매산여고 | `23_매산여고_2학기_중간_고2_수학II.js` | 23 |
| 2023 | 2학기 중간 | 복성고 | `23_복성고_2학기_중간_고2_수학II.js` | 22 |
| 2023 | 2학기 중간 | 순천고 | `23_순천고_2학기_중간_고2_수학II.js` | 22 |
| 2023 | 2학기 중간 | 순천여고 | `23_순천여고_2학기_중간_고2_수학II.js` | 23 |
| 2023 | 2학기 중간 | 제일고 | `23_제일고_2학기_중간_고2_수학II.js` | 23 |
| 2023 | 2학기 중간 | 조대부고 | `23_조대부고_2학기_중간_고2_수학II.js` | 23 |
| 2023 | 2학기 중간 | 팔마고 | `23_팔마고_2학기_중간_고2_수학II.js` | 22 |
| 2024 | 2학기 중간 | 매산여고 | `24_매산여고_2학기_중간_고2_수학II.js` | 23 |
| 2024 | 2학기 중간 | 조대부고 | `24_조대부고_2학기_중간_고2_수학II.js` | 23 |
| 2025 | 2학기 중간 | 매산고 | `25_매산고_2학기_중간_고2_수학II.js` | 20 |
| 2025 | 2학기 중간 | 매산여고 | `25_매산여고_2학기_중간_고2_수학II.js` | 23 |
| 2025 | 2학기 중간 | 제일고 | `25_제일고_2학기_중간_고2_수학II.js` | 22 |
| **합계** |  |  | **21개** | **475** |

### standardUnit 분포

| standardUnitKey | standardUnit | 문항 |
|---|---|---:|
| `H15-M2-01` | 함수의 극한 | 103 |
| `H15-M2-02` | 함수의 연속 | 79 |
| `H15-M2-03` | 미분계수 | 67 |
| `H15-M2-04` | 도함수 | 36 |
| `H15-M2-05` | 접선의 방정식 | 31 |
| `H15-M2-06` | 도함수의 활용 | 107 |
| `H15-M2-07` | 부정적분 | 6 |
| `H15-M2-08` | 정적분 | 23 |
| `H15-M2-09` | 적분의 활용 | 23 |
| **합계** |  | **475** |

### subUnit 분포

| subUnitKey | subUnit | 문항 |
|---|---|---:|
| `H15-M2-01-LIMIT` | 함수의 극한 | 103 |
| `H15-M2-02-CONTINUITY` | 함수의 연속 | 77 |
| `H15-M2-02-DERIVATIVE` | derivative | 1 |
| `H15-M2-03-DERIVATIVE` | 미분 | 8 |
| `H15-M2-03-DERIVATIVE` | derivative | 32 |
| `H15-M2-03-DERIVATIVE_DEFINITION` | 미분계수 | 27 |
| `H15-M2-03-CONTINUITY` | continuity | 1 |
| `H15-M2-04-DERIVATIVE` | 도함수 | 35 |
| `H15-M2-04-CONTINUITY` | continuity | 1 |
| `H15-M2-05-TANGENT` | 접선의 방정식 | 22 |
| `H15-M2-05-DERIVATIVE` | derivative | 9 |
| `H15-M2-06-DERIVATIVE_APPLICATION` | 도함수의 활용 | 82 |
| `H15-M2-06-DERIVATIVE` | derivative | 18 |
| `H15-M2-07-INDEFINITE_INTEGRAL` | 부정적분 | 6 |
| `H15-M2-08-DEFINITE_INTEGRAL` | 정적분 | 23 |
| `H15-M2-09-INTEGRAL_APPLICATION` | 적분의 활용 | 23 |

`H15-M2-06-APPLICATION_OF_CALCULUS`의 source target 사용 수는 0이며, compiled master에 해당 key가 있다는 사실과 구분한다.

## 3. COVERAGE

- metadata 구조검사: **475/475**
- content 기반 의미검사: **475/475**
- ambiguous solution 확인: **37/37**
- question identity index join: **475/475**
- question-index exact metadata parity: **475/475 문항 행**
- question-index field mismatch: **0개 field cell / 0문항**
- browser render: **NOT_TESTED** (이번 단계는 조사·evidence 고정이며 production 수정·렌더 gate 실행 범위가 아님)

### 구조검사

475문항 모두 다음 필드를 가지고 있었다.

```text
standardCourse
standardUnitKey
standardUnit
standardUnitOrder
subUnitKey
subUnit
subUnitConfidence
subUnitClassificationDepth
category
originalCategory
tags
```

통과한 기계검사:

- `standardCourse` 누락 또는 `수학II` 이외 값: 0
- canonical master에 없는 `standardUnitKey`: 0
- `standardUnitKey ↔ standardUnit` 불일치: 0
- `standardUnitKey ↔ standardUnitOrder` 불일치: 0
- canonical master에 없는 `subUnitKey`: 0
- 구조적 `subUnitKey.parentKey ↔ standardUnitKey` 불일치: 0
- confidence 허용값 위반: 0
- classification depth 허용값 위반: 0
- `category` 누락: 0
- `originalCategory` 누락: 0
- `tags` 배열 형식 위반: 0

관찰된 raw label mismatch는 62문항이다. 이 62건은 의미상 P1 30건과 source label-only P2 32건으로 분리했다.

### confidence/depth 분포

| subUnitConfidence | 문항 |
|---|---:|
| `category_or_cue_inferred` | 418 |
| `rule_inferred` | 34 |
| `candidate_evidence` | 23 |
| **합계** | **475** |

| subUnitClassificationDepth | 문항 |
|---|---:|
| `complete_category` | 418 |
| `complete_rule` | 34 |
| `complete_candidate` | 23 |
| **합계** | **475** |

`category !== originalCategory`는 240문항에서 관찰되었으나 그 자체로 오류로 세지 않았다. 예를 들어 `미분 → 미분계수`, `함수의 연속 → 중간값 정리`, `정적분 → 적분방정식`, `도함수의 활용 → 평균값 정리`처럼 원래 coarse category와 현재 fine category가 다른 정상적인 운영 구조가 포함되어 있기 때문이다.

## 4. TOTAL FINDINGS

- P0: **0건**
- P1: **30건**
- P2: **32건**
  - source metadata label-only: 32건
  - question-index stale: 0문항, 0 field cell

## 5. 문항별 수정 후보 — P1

아래는 content·category·originalCategory·tags·solution을 우선순위로 대조하여, 학생이 단원별로 검색할 때 다른 개념 단원으로 노출되는 것으로 판단한 수정 후보이다. 모든 후보는 key와 label을 함께 기록한다.

### P1-A. 도함수의 활용 parent의 generic derivative 오분류 — 18문항

현재:

```text
standardUnitKey = H15-M2-06
standardUnit = 도함수의 활용
subUnitKey = H15-M2-06-DERIVATIVE
subUnit = derivative
```

권장:

```text
standardUnitKey = H15-M2-06
standardUnit = 도함수의 활용
standardUnitOrder = 6
subUnitKey = H15-M2-06-DERIVATIVE_APPLICATION
subUnit = 도함수의 활용
```

| 시험지 | qID |
|---|---|
| `22_효천고_2학기_중간_고2_수학II.js` | 16, 17, 20, 25 |
| `23_매산고_2학기_중간_고2_수학II.js` | 14, 20 |
| `23_매산여고_2학기_중간_고2_수학II.js` | 20 |
| `23_순천고_2학기_중간_고2_수학II.js` | 22 |
| `23_순천여고_2학기_중간_고2_수학II.js` | 8, 10, 15, 19 |
| `23_제일고_2학기_중간_고2_수학II.js` | 18 |
| `23_팔마고_2학기_중간_고2_수학II.js` | 3, 13, 15 |
| `24_매산여고_2학기_중간_고2_수학II.js` | 16 |
| `25_매산고_2학기_중간_고2_수학II.js` | 8 |

근거 유형은 증가·감소, 극대·극소, 최댓값·최솟값, 평균값 정리·롤의 정리, 도함수 그래프, 방정식·부등식에의 활용, 속도·거리·도형 최적화 등이다. 동일 category가 다른 시험지에서는 이미 `H15-M2-06-DERIVATIVE_APPLICATION / 도함수의 활용`으로 저장되어 있어 cross-exam consistency도 뒷받침한다.

### P1-B. 접선 parent의 generic derivative 오분류 — 9문항

현재:

```text
standardUnitKey = H15-M2-05
standardUnit = 접선의 방정식
subUnitKey = H15-M2-05-DERIVATIVE
subUnit = derivative
```

권장:

```text
standardUnitKey = H15-M2-05
standardUnit = 접선의 방정식
standardUnitOrder = 5
subUnitKey = H15-M2-05-TANGENT
subUnit = 접선의 방정식
```

| 시험지 | qID |
|---|---|
| `22_효천고_2학기_중간_고2_수학II.js` | 8 |
| `23_매산여고_2학기_중간_고2_수학II.js` | 5, 17 |
| `23_복성고_2학기_중간_고2_수학II.js` | 12 |
| `23_순천고_2학기_중간_고2_수학II.js` | 13 |
| `23_순천여고_2학기_중간_고2_수학II.js` | 21 |
| `23_제일고_2학기_중간_고2_수학II.js` | 4, 16 |
| `23_팔마고_2학기_중간_고2_수학II.js` | 17 |

본문 category가 접선의 방정식·접선의 기울기·접선의 개수이고, 실제 해결 개념도 접선이므로 `H15-M2-05-TANGENT / 접선의 방정식`이 권장값이다.

### P1-C. 함수의 연속 parent 아래 미분가능성 문항 — 1문항

대상:

```text
23_매산고_2학기_중간_고2_수학II.js#19
```

현재:

```text
standardUnitKey = H15-M2-02
standardUnit = 함수의 연속
standardUnitOrder = 2
subUnitKey = H15-M2-02-DERIVATIVE
subUnit = derivative
```

권장:

```text
standardUnitKey = H15-M2-03
standardUnit = 미분계수
standardUnitOrder = 3
subUnitKey = H15-M2-03-DERIVATIVE
subUnit = 미분
```

본문은 `f(x)=|x(x-2)|(x-t)`에서 미분 불가능한 점 개수를 다루고, solution도 절댓값의 꺾임과 미분가능성 조건을 핵심으로 사용한다. 따라서 함수의 연속 parent보다 미분계수·미분가능성 계열이 학생 학습 검색에 맞는다.

### P1-D. 도함수 parent 아래 continuity key 잔존 — 1문항

대상:

```text
23_순천여고_2학기_중간_고2_수학II.js#18
```

현재:

```text
standardUnitKey = H15-M2-04
standardUnit = 도함수
standardUnitOrder = 4
subUnitKey = H15-M2-04-CONTINUITY
subUnit = continuity
```

권장:

```text
standardUnitKey = H15-M2-04
standardUnit = 도함수
standardUnitOrder = 4
subUnitKey = H15-M2-04-DERIVATIVE
subUnit = 도함수
```

solution은 함수방정식을 미분하여 `f'(x)`를 구한 뒤 분수형 함수의 연속 조건을 적용한다. 대표 학습 개념은 도함수·미분이다.

### P1-E. 미분계수 parent 아래 continuity key 잔존 — 1문항

대상:

```text
23_제일고_2학기_중간_고2_수학II.js#19
```

현재:

```text
standardUnitKey = H15-M2-03
standardUnit = 미분계수
standardUnitOrder = 3
subUnitKey = H15-M2-03-CONTINUITY
subUnit = continuity
```

권장:

```text
standardUnitKey = H15-M2-03
standardUnit = 미분계수
standardUnitOrder = 3
subUnitKey = H15-M2-03-DERIVATIVE
subUnit = 미분
```

category가 `미분가능성`이고 본문은 절댓값 함수의 미분가능하지 않은 점 개수를 묻는다. 동일 개념 문항군과의 parity상 `H15-M2-03-DERIVATIVE / 미분`이 권장값이다.

## 6. 문항별 수정 후보 — P2 source label-only

다음 32문항은 key는 이미 `H15-M2-03-DERIVATIVE`로 정합하지만 source JS의 `subUnit` label이 영어로 남아 있다. key를 바꾸지 않고 label만 다음처럼 backfill한다.

현재:

```text
subUnitKey = H15-M2-03-DERIVATIVE
subUnit = derivative
```

권장:

```text
subUnitKey = H15-M2-03-DERIVATIVE
subUnit = 미분
```

| 시험지 | qID |
|---|---|
| `22_효천고_2학기_중간_고2_수학II.js` | 13, 14 |
| `23_매산고_2학기_중간_고2_수학II.js` | 6, 12 |
| `23_매산여고_2학기_중간_고2_수학II.js` | 8, 10 |
| `23_복성고_2학기_중간_고2_수학II.js` | 10, 11, 22 |
| `23_순천고_2학기_중간_고2_수학II.js` | 19 |
| `23_순천여고_2학기_중간_고2_수학II.js` | 2, 6, 11, 14, 17, 22 |
| `23_제일고_2학기_중간_고2_수학II.js` | 5, 6, 8, 13, 22 |
| `23_팔마고_2학기_중간_고2_수학II.js` | 1, 4, 22 |
| `24_매산여고_2학기_중간_고2_수학II.js` | 3, 14, 18, 22 |
| `25_매산고_2학기_중간_고2_수학II.js` | 3, 5, 16, 19 |
| **합계** | **32** |

## 7. question-index parity

source JS를 source of truth로 두고 `archive/question-index.js`의 `course`를 source의 `standardCourse` 대응 필드로 비교했다.

- source Math II rows: **475**
- origin/main index Math II original rows: **475**
- question identity join: **475/475**
- missing index row: **0**
- extra Math II original index row: **0**
- exact parity rows: **475/475**
- stale rows: **0**
- stale field cells: **0**

### INDEX_STALE_ERROR — 0건

현재 `origin/main`의 source JS와 `origin/main:archive/question-index.js`를 question identity로 join한 결과, index만 stale인 항목은 발견되지 않았다. source/index 비교 대상 475문항의 `standardCourse` 대응 필드, `standardUnitKey`, `standardUnit`, `subUnitKey`, `subUnit`, `tags`가 모두 일치한다.

`standardCourse`, `standardUnitKey`, `standardUnit`, `subUnitKey`, `subUnit`, `tags` 및 question identity는 이 475개 원본 row에서 parity가 맞았다. source metadata 오류와 index stale를 한 결함으로 섞지 않는다.

## 8. 시험지별 오류 개수

`P1 semantic`은 30건, `P2 source label`은 32건, `P2 index stale`는 0문항이다.

| 시험지 | P1 semantic | P2 source label | P2 index stale | 합계 |
|---|---:|---:|---:|---:|
| `25_강남여고_2학기_기말_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `25_매산고_2학기_기말_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `25_매산여고_2학기_기말_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `25_순천고_2학기_기말_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `25_제일고_2학기_기말_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `22_순천고_2학기_중간_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `22_팔마고_2학기_중간_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `22_효천고_2학기_중간_고2_수학II.js` | 5 | 2 | 0 | 7 |
| `23_매산고_2학기_중간_고2_수학II.js` | 3 | 2 | 0 | 5 |
| `23_매산여고_2학기_중간_고2_수학II.js` | 3 | 2 | 0 | 5 |
| `23_복성고_2학기_중간_고2_수학II.js` | 1 | 3 | 0 | 4 |
| `23_순천고_2학기_중간_고2_수학II.js` | 2 | 1 | 0 | 3 |
| `23_순천여고_2학기_중간_고2_수학II.js` | 6 | 6 | 0 | 12 |
| `23_제일고_2학기_중간_고2_수학II.js` | 4 | 5 | 0 | 9 |
| `23_조대부고_2학기_중간_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `23_팔마고_2학기_중간_고2_수학II.js` | 4 | 3 | 0 | 7 |
| `24_매산여고_2학기_중간_고2_수학II.js` | 1 | 4 | 0 | 5 |
| `24_조대부고_2학기_중간_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `25_매산고_2학기_중간_고2_수학II.js` | 1 | 4 | 0 | 5 |
| `25_매산여고_2학기_중간_고2_수학II.js` | 0 | 0 | 0 | 0 |
| `25_제일고_2학기_중간_고2_수학II.js` | 0 | 0 | 0 | 0 |
| **합계** | **30** | **32** | **0** | **62** |

## 9. 동일 개념 cross-exam consistency

다음 category들은 동일 category인데 subUnit이 서로 갈라지는 cross-exam 이상치가 있었다.

| standardUnit/category | 관찰된 subUnit 분기 | 판정 |
|---|---|---|
| `H15-M2-02 / 함수의 연속` | `H15-M2-02-CONTINUITY`, `H15-M2-02-DERIVATIVE` | q19는 미분가능성 문항이므로 P1-C로 교정 후보 |
| `H15-M2-03 / 미분가능성` | `DERIVATIVE`, `CONTINUITY`, `DERIVATIVE_DEFINITION` | q19 continuity는 P1-E; 나머지는 category·solution 경계에 따라 유지 |
| `H15-M2-03 / 미분계수` | `DERIVATIVE_DEFINITION`, `DERIVATIVE` | 미분계수 정의형과 broad 미분형을 구분하되 key 재편입은 별도 정책 필요 |
| `H15-M2-05 / 접선의 방정식` | `TANGENT`, `DERIVATIVE` | generic derivative 9건은 P1-B |
| `H15-M2-06 / 도함수의 활용` | `DERIVATIVE_APPLICATION`, `DERIVATIVE` | generic derivative 18건은 P1-A |
| `H15-M2-06 / 평균값 정리` | `DERIVATIVE_APPLICATION`, `DERIVATIVE` | generic derivative가 있는 문항은 P1-A |
| `H15-M2-06 / 롤의 정리` | `DERIVATIVE_APPLICATION`, `DERIVATIVE` | generic derivative가 있는 문항은 P1-A |
| `H15-M2-06 / 도함수의 그래프` | `DERIVATIVE_APPLICATION`, `DERIVATIVE` | generic derivative가 있는 문항은 P1-A |

반대로 `평균변화율`, `미분계수`, `접선`, `넓이`, `속도와 거리` 등 category가 달라도 실제 해결 개념이 standardUnit과 일치하는 경우는 오류로 세지 않았다.

## 10. ROOT CAUSE 후보

### ROOT-1. parent-aware fallback보다 generic suffix가 우선되는 분류 경로

`H15-M2-05-DERIVATIVE`, `H15-M2-06-DERIVATIVE`가 각각 접선과 도함수의 활용 문항에 내려간다. 이미 parent-specific canonical key인 `TANGENT`, `DERIVATIVE_APPLICATION`이 master에 존재하므로, suffix 기반 fallback이 content/category adjudication보다 우선하거나 broad default로 남는 경로가 의심된다.

### ROOT-2. source label을 authoritative로 보존하는 생성 경로

source JS의 `subUnit: "derivative"`가 canonical master label과 달라도 생성물에 그대로 남았다. label resolver가 key exact match의 canonical label을 쓰지 않으면 화면·sidecar·index에 영어가 재전파될 수 있다.

### ROOT-3. generic `APPLICATION_OF_CALCULUS`의 active 상태

compiled master에는 여러 H15-M2 parent 아래 `*-APPLICATION_OF_CALCULUS`가 active로 존재하지만 `autoApplyAllowed: false`다. target source에서는 현재 사용되지 않았으므로 즉시 문항 오류는 아니지만, 자동 분류기가 이 generic key를 다시 만들지 않도록 review-required 차단이 필요하다.

### ROOT-4. index refresh 위험은 현재 미검출

현재 `origin/main`에서는 source JS와 question-index의 475개 수학II 원본 row가 모두 parity를 통과했으므로, 실제 index stale 결함은 보고하지 않는다. 향후 source metadata를 수정하는 production 작업에서는 source JS 변경 후 index rebuild와 동일한 exact parity 검사를 다시 수행해야 한다.

## 11. legacy/deprecated 검색 결과

- unknown `standardUnitKey`: 0
- unknown `subUnitKey`: 0
- `RAW-*`: 0
- `RRAW-*`: 0
- `UNMAPPED-*`: 0
- source `APPLICATION_OF_CALCULUS` label: 0
- source `integral` label: 0
- source label-only `derivative`: 32 (`H15-M2-03-DERIVATIVE`)
- source label-only `continuity`: 2 (두 건 모두 P1 semantic 대상)

`DERIVATIVE` 자체는 compiled master상 active이므로 deprecated로 자동 판정하지 않았다. 다만 parent-specific key가 이미 존재하는 P1 문항에서는 generic fallback 사용을 중단하는 것이 권장된다.

## 12. 최종 판정

수학II 원본 metadata의 **조사와 evidence report 작성은 완료**했다.

현재 production metadata의 판정은 다음과 같다.

- P0: 0
- P1: 30
- P2: 32
- standardUnit key/label/order 기계검사: 475/475 통과
- subUnit key 존재 및 구조적 parent 검사: 475/475 통과
- 필수 metadata field 존재: 475/475
- content 의미검사: 475/475
- ambiguous solution 확인: 37/37
- question identity join: 475/475
- exact source/index metadata parity: 475/475

이번 commit은 **조사 결과를 고정하는 evidence commit**이며 production metadata 수정 커밋이 아니다. P1/P2 후보는 이 보고서에 정확한 key와 label로 기록했지만 아직 source JS, DB, question-index에 반영하지 않았다.

다음 production 수정 단계에서는 P1 semantic 후보를 먼저 adjudicate하고, source JS를 source of truth로 수정한 뒤 question-index를 재생성해야 한다. 그 이후 `standardUnit`, `subUnit`, parent parity, source/index parity를 다시 검사해야 한다.
