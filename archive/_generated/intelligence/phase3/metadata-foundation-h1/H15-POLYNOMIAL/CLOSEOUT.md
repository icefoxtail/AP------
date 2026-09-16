# L1 Closeout — 2015 고1 다항식

상태: **PARTIAL_PASS_WITH_HOLD — L1 미완료**  
Queue: `H15-POLYNOMIAL`  
curriculum/course: `2015 / 수학(상)`  
canonical L1: `다항식`  
source standard keys: `H15-SA-01`, `H15-SA-02`, `H15-SA-03`  
source files: **14**

이번 작업은 다음 미완료 L1 하나를 선택해 전체 절차를 수행한 결과다.
두 개의 source-unit outlier가 발견되어 해당 문항은 임의 재귀속하지 않고
`FOUNDATION_DEFECT_CANDIDATE`/`HOLD`로 남겼다. 따라서 이 L1은 다음 L1로
넘어갈 수 있는 완전 PASS가 아니다.

## Denominator

- denominator: **105 questions**
- accepted for metadata apply: **103**
- explicit HOLD: **2**
- source join: PASS for 105/105
- UID cardinality: PASS
- solution presence: **105/105**
- visual/embedded-visual dependency candidates: **3/105**; source visual evidence checked
- shared-material candidates: **0/105**
- source JS SHA mutation: **0**
- source/content fingerprint mutation: **0**

## Taxonomy result — accepted 103

blind first-pass → first-pass freeze → legacy compare → outlier/boundary
recheck → adjudication 순서로 진행했다. 승인된 103건의 primary path는
RPM Primary Taxonomy v1.0에 존재한다.

| L2 | L3 수 | L4 수 | 승인 문항 수 |
|---|---:|---:|---:|
| 다항식의 연산 | 3 | 5 | 44 |
| 항등식과 나머지정리 | 3 | 5 | 45 |
| 인수분해 | 2 | 2 | 14 |

세부 L4 결과는 `metadata_candidate.json`과 `L1_PREAPPLY_SUMMARY.json`에
기록했다. HOLD 2건은 `L1/L2/L3/L4=UNKNOWN`, `defaultSelectable=false`,
`reviewStatus=HOLD`로 sidecar에 적용하지 않았다.

## Difficulty result — accepted 103

| Bucket | 문항 수 |
|---:|---:|
| 1 | 18 |
| 2 | 3 |
| 3 | 36 |
| 4 | 45 |
| 5 | 1 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 45 |
| medium | 58 |
| low | 0 |

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 51 |
| BORDERLINE_REVIEW | 44 |
| BORDERLINE_ACCEPTABLE | 0 |
| STRONG_CONFLICT | 8 |

기존 `level`은 자동 수정하지 않았다. BORDERLINE_REVIEW와
STRONG_CONFLICT는 independent recheck evidence를 남겼다.

## Review / adjudication

- first-pass freeze: PASS, 105/105
- legacy compare: 105/105, freeze 이후 수행
- source/solution recheck: 105/105
- accepted adjudication: 103
- explicit HOLD: 2
- review status: `reviewed_pass` 103 / `HOLD` 2
- outlier defect candidates: 2
- next L1 진행: **금지** — outlier HOLD가 닫히지 않음

## Validation

- denominator before == after: PASS (105)
- UID cardinality: PASS
- canonical path valid: PASS for 103 accepted records
- invalid accepted path: 0
- difficulty 4-field enum: PASS for 103 accepted records
- explicit HOLD schema: PASS for 2 records
- target-local builder parity: PASS
- runtime sidecar parity: PASS for 103 applied records
- source JS SHA mutation: 0
- content/choices/answer/solution/image mutation: 0
- assets/SVG mutation: 0
- global builder rebuild: NOT RUN — identity reconciliation gate remains open

## Apply

- global sidecar updated: **103 records**
- global sidecar record count: 11,038
- added records: 0
- runtime loader v2 field list: PASS
- outlier 2건: not applied

Receipts:

- `blind_first_pass.json`
- `first_pass_freeze.json`
- `legacy_compare.json`
- `independent_recheck.json`
- `metadata_candidate.json`
- `apply_receipt.json`
- `FOUNDATION_DEFECT_CANDIDATE.md`

## Decision

현재 L1은 **HOLD 상태로 closeout**한다. source metadata의 잘못된 unit
귀속을 locked taxonomy에 맞춰 임의 수정하지 않는다. 두 outlier의 source
귀속을 별도 확인한 뒤에만 이 L1을 재개하거나 다음 L1로 이동한다.
