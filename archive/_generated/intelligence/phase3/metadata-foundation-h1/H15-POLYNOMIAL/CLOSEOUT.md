# L1 Closeout — 2015 고1 다항식

상태: **PASS / CLOSED**  
Queue: `H15-POLYNOMIAL`  
curriculum/course: `2015 / 수학(상)`  
canonical L1: `다항식`  
source standard keys: `H15-SA-01`, `H15-SA-02`, `H15-SA-03`  
source files: **14**

이번 작업은 다음 미완료 L1 하나를 선택해 전체 절차를 수행한 결과다.
초기 outlier 2건은 도형/입체 표현을 primary 근거로 잘못 사용한 false
positive였으며, 해설의 결정적 풀이 전략을 다시 대조해 canonical path를
수정하고 HOLD를 해제했다.

## Denominator

- denominator: **105 questions**
- accepted for metadata apply: **105**
- explicit HOLD: **0**
- source join: PASS for 105/105
- UID cardinality: PASS
- solution presence: **105/105**
- visual/embedded-visual dependency candidates: **3/105**; source visual evidence checked
- shared-material candidates: **0/105**
- source JS SHA mutation: **0**
- source/content fingerprint mutation: **0**

## Taxonomy result — accepted 105

blind first-pass → first-pass freeze → legacy compare → outlier/boundary
recheck → adjudication 순서로 진행했다. 승인된 105건의 primary path는
RPM Primary Taxonomy v1.0에 존재한다.

| L2 | L3 수 | L4 수 | 승인 문항 수 |
|---|---:|---:|---:|
| 다항식의 연산 | 3 | 5 | 45 |
| 항등식과 나머지정리 | 3 | 5 | 45 |
| 인수분해 | 2 | 3 | 15 |

세부 L4 결과는 `metadata_candidate.json`과 `L1_PREAPPLY_SUMMARY.json`에
기록했다. 표현 형식은 `secondaryConceptKeys`나 별도 primary로 승격하지
않고, 결정적 교육과정 개념·풀이 전략만 primary path로 사용했다.

## Difficulty result — accepted 105

| Bucket | 문항 수 |
|---:|---:|
| 1 | 18 |
| 2 | 3 |
| 3 | 36 |
| 4 | 47 |
| 5 | 1 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 47 |
| medium | 58 |
| low | 0 |

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 53 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 44 |
| STRONG_CONFLICT | 8 |

기존 `level`은 자동 수정하지 않았다. BORDERLINE_ACCEPTABLE과 STRONG_CONFLICT는 independent recheck/adjudication evidence를 남겼다.

## Review / adjudication

- first-pass freeze: PASS, 105/105
- legacy compare: 105/105, freeze 이후 수행
- source/solution recheck: 105/105
- accepted adjudication: 105
- explicit HOLD: 0
- review status: `reviewed_pass` 105 / `HOLD` 0
- representation/context adjudication correction: 2
- outlier defect candidates: 0 open / 2 resolved

## Validation

- denominator before == after: PASS (105)
- UID cardinality: PASS
- canonical path valid: PASS for 105 accepted records
- invalid accepted path: 0
- difficulty 4-field enum: PASS for 105 accepted records
- explicit HOLD schema: 0 records
- target-local builder parity: PASS
- runtime sidecar parity: PASS for 105 applied records
- source JS SHA mutation: 0
- content/choices/answer/solution/image mutation: 0
- assets/SVG mutation: 0
- global builder rebuild: NOT RUN — identity reconciliation gate remains open

## Apply

- global sidecar updated: **105 records**
- global sidecar record count: 11,038
- added records: 0
- runtime loader v2 field list: PASS
- outlier 2건: resolved and applied

Receipts:

- `blind_first_pass.json`
- `first_pass_freeze.json`
- `legacy_compare.json`
- `independent_recheck.json`
- `metadata_candidate.json`
- `apply_receipt.json`
- `FOUNDATION_DEFECT_CANDIDATE.md`

## Decision

현재 L1은 **PASS / CLOSED**로 closeout한다. 두 문항은 도형/입체라는
표현 형식이 아니라 다항식의 덧셈·뺄셈 및 인수분해 공식이라는 결정적
풀이 전략으로 귀속했다. 다음 L1로 이동할 수 있다.
