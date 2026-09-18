REOPENED — PINPOINT CORRECTION APPLIED / PENDING INDEPENDENT RECHECK

## HISTORICAL 2026-09-16 RESULT

# L1 Closeout — 2015 고1 원의 방정식

상태: **PASS / CLOSED**  
Queue: `H15-SA-11`  
curriculum/course: `2015 / 수학(상)`  
canonical L1: `도형의 방정식`  
current standard key: `H15-SA-11`  
source files: **24**

## Denominator

- denominator: **95 questions**
- solution presence: **95/95**
- visual dependency candidates: **6**
- shared-material candidates: **1**
- source join: PASS
- UID cardinality: PASS
- source JS SHA mutation: **0**
- source/content fingerprint mutation: **0**

## Taxonomy result

blind first-pass → freeze → legacy compare → boundary/conflict recheck →
adjudication 순서로 처리했다. 원·직선·접선·현은 표현 형식이 아니라
원의 방정식/원과 직선/원의 접선/두 원이라는 결정적 개념과 풀이 전략으로
primary path를 결정했다.

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 원의 방정식 > 원의 접선 > 기울기가 주어진 접선 | 24 |
| 원의 방정식 > 원과 직선 > 교점 개수 | 27 |
| 원의 방정식 > 원의 방정식 > 일반형에서 원 찾기 | 3 |
| 원의 방정식 > 원의 방정식 > 중심과 반지름 | 28 |
| 원의 방정식 > 두 원 > 두 원의 위치 관계 | 10 |
| 원의 방정식 > 원의 접선 > 접점이 주어진 접선 | 3 |

총계:

- L2: 1
- L3: 4
- L4: 6
- duplicate primary: 0
- unapproved new node: 0

## Difficulty result

| Bucket | 문항 수 |
|---:|---:|
| 1 | 2 |
| 2 | 0 |
| 3 | 19 |
| 4 | 68 |
| 5 | 6 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 76 |
| medium | 19 |
| low | 0 |

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 49 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 39 |
| STRONG_CONFLICT | 7 |

기존 `level=하|중|상`은 수정하지 않았다. BORDERLINE_ACCEPTABLE과
STRONG_CONFLICT는 freeze 이후 recheck/adjudication evidence를 남겼다.

## Review / adjudication

- first-pass freeze: PASS, 95/95
- legacy compare: 95/95 after freeze
- source/solution recheck: 95/95
- accepted adjudication: 95
- explicit HOLD: 0
- representation/context false-positive HOLD: 0

## Validation

- denominator before == after: PASS
- UID cardinality / source join: PASS
- canonical path valid: PASS
- invalid path: 0
- difficulty 4-field enum: PASS
- blind ledger / freeze: PASS
- legacy compare after freeze: PASS
- conflict/boundary recheck: PASS
- DEFAULT_SCOPE / `defaultSelectable=true`: PASS
- target-local builder parity: PASS
- runtime sidecar parity: PASS
- source JS SHA mutation: 0
- content/choices/answer/solution/image/assets mutation: 0
- global builder rebuild: not run; global identity reconciliation remains separate

## Apply

- global sidecar updated: **95 records**
- global metadata record count: 11,038
- `reviewed_pass`: 95
- `HOLD`: 0
- runtime v2 field list: PASS
- source exam JS modification: 0

Evidence:

- `blind_first_pass.json`
- `first_pass_freeze.json`
- `legacy_compare.json`
- `independent_recheck.json`
- `metadata_candidate.json`
- `L1_PREAPPLY_SUMMARY.json`
- `apply_receipt.json`
