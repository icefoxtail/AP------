# L1 Closeout — 2015 고1 직선의 방정식

상태: **PASS / CLOSED**  
Queue: `H15-SA-10`  
curriculum/course: `2015 / 수학(상)`  
canonical L1: `도형의 방정식`  
current standard key: `H15-SA-10`  
source files: **19**

## Denominator

- denominator: **63 questions**
- solution presence: **63/63**
- visual dependency candidates: **6**
- shared-material candidates: **4**
- source join: PASS
- UID cardinality: PASS
- source JS SHA mutation: **0**
- source/content fingerprint mutation: **0**

## Taxonomy result

blind first-pass → freeze → legacy compare → boundary/conflict recheck →
adjudication 순서로 처리했다. 도형·그래프는 표현/맥락으로만 취급하고,
직선·거리·교점·평행·수직이라는 결정적 개념과 풀이 전략으로 primary
path를 결정했다.

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 직선의 방정식 > 점과 직선 사이의 거리 > 거리 공식 | 11 |
| 직선의 방정식 > 점과 직선 사이의 거리 > 도형의 넓이·최소거리 | 4 |
| 직선의 방정식 > 두 직선의 위치 관계 > 교점 | 6 |
| 직선의 방정식 > 두 직선의 위치 관계 > 수직 | 13 |
| 직선의 방정식 > 두 직선의 위치 관계 > 평행 | 15 |
| 직선의 방정식 > 직선의 방정식 > 한 점과 기울기 | 9 |
| 직선의 방정식 > 직선의 방정식 > 두 점을 지나는 직선 | 5 |

총계:

- L2: 1
- L3: 3
- L4: 7
- duplicate primary: 0
- unapproved new node: 0

## Difficulty result

| Bucket | 문항 수 |
|---:|---:|
| 1 | 12 |
| 2 | 3 |
| 3 | 16 |
| 4 | 31 |
| 5 | 1 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 36 |
| medium | 27 |
| low | 0 |

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 26 |
| BORDERLINE_REVIEW | 24 |
| BORDERLINE_ACCEPTABLE | 0 |
| STRONG_CONFLICT | 13 |

기존 `level=하|중|상`은 수정하지 않았다. BORDERLINE_REVIEW와
STRONG_CONFLICT는 freeze 이후 independent recheck/adjudication evidence를
남겼다.

## Review / adjudication

- first-pass freeze: PASS, 63/63
- legacy compare: 63/63 after freeze
- source/solution recheck: 63/63
- accepted adjudication: 63
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

- global sidecar updated: **63 records**
- global metadata record count: 11,038
- `reviewed_pass`: 63
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

