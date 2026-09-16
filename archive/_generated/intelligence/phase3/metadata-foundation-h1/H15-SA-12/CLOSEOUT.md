# L1 Closeout — 2015 고1 도형의 이동

상태: **PASS / CLOSED**  
Queue: `H15-SA-12`  
curriculum/course: `2015 / 수학(상)`  
canonical L1: `도형의 방정식`  
current standard key: `H15-SA-12`  
source files: **21**

## Denominator

- denominator: **72 questions**
- solution presence: **72/72**
- visual dependency candidates: **11**
- shared-material candidates: **3**
- source join: PASS
- UID cardinality: PASS
- source JS SHA mutation: **0**
- source/content fingerprint mutation: **0**

## Taxonomy result

blind first-pass → freeze → legacy compare → boundary/conflict recheck →
adjudication 순서로 처리했다. 이동·대칭·원·직선은 표현 형식이 아니라
평행이동, 대칭이동, 이동의 합성이라는 결정적 개념과 풀이 전략으로
primary path를 결정했다.

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 도형의 이동 > 대칭이동 > 직선에 대한 대칭 | 9 |
| 도형의 이동 > 대칭이동 > x축·y축·원점 대칭 | 14 |
| 도형의 이동 > 평행이동 > 원의 이동 | 3 |
| 도형의 이동 > 이동의 합성 > 조건으로 원래 도형 찾기 | 9 |
| 도형의 이동 > 평행이동 > 점·직선의 이동 | 37 |

총계:

- L2: 1
- L3: 3
- L4: 5
- duplicate primary: 0
- unapproved new node: 0

## Difficulty result

| Bucket | 문항 수 |
|---:|---:|
| 1 | 1 |
| 2 | 1 |
| 3 | 18 |
| 4 | 39 |
| 5 | 13 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 30 |
| medium | 42 |
| low | 0 |

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 31 |
| BORDERLINE_REVIEW | 21 |
| BORDERLINE_ACCEPTABLE | 0 |
| STRONG_CONFLICT | 20 |

기존 `level=하|중|상`은 수정하지 않았다. BORDERLINE_REVIEW와
STRONG_CONFLICT는 freeze 이후 recheck/adjudication evidence를 남겼다.

## Review / adjudication

- first-pass freeze: PASS, 72/72
- legacy compare: 72/72 after freeze
- source/solution recheck: 72/72
- accepted adjudication: 72
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

- global sidecar updated: **72 records**
- global metadata record count: 11,038
- `reviewed_pass`: 72
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
