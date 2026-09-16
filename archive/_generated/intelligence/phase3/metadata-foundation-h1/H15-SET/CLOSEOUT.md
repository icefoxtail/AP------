# L1 Closeout — 2015 고1 집합

상태: **PASS / CLOSED**  
Queue: `H15-SET`  
curriculum/course: `2015 / 수학(하)`  
legacy key: `H15-SB-01`  
작업 단위: L1 1개

## Denominator

- fresh source denominator: **156 questions**
- source join: PASS
- UID cardinality: PASS
- source fingerprint mutation: **0**
- solution presence at inventory: **156/156**
- fresh-only source records applied: **4**

## Taxonomy result

blind first-pass → freeze → legacy compare → source/solution independent recheck
순서로 처리했다. 모든 primary path가 RPM Primary Taxonomy v1.0에 존재한다.

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 집합의 뜻과 포함 관계 > 집합과 원소 > 원소나열법·조건제시법 | 13 |
| 집합의 뜻과 포함 관계 > 집합과 원소 > 유한집합 원소 개수 | 8 |
| 집합의 뜻과 포함 관계 > 부분집합 > 부분집합 판정 | 20 |
| 집합의 뜻과 포함 관계 > 부분집합 > 부분집합의 개수 | 25 |
| 집합의 뜻과 포함 관계 > 집합의 포함 관계 > 두 집합의 포함 | 5 |
| 집합의 뜻과 포함 관계 > 집합의 포함 관계 > 매개변수 조건 | 3 |
| 집합의 연산 > 교집합과 합집합 > 원소 개수 | 32 |
| 집합의 연산 > 여집합과 차집합 > 여집합 | 17 |
| 집합의 연산 > 여집합과 차집합 > 차집합 | 22 |
| 집합의 연산 > 집합의 연산법칙 > 드모르간 법칙 | 4 |
| 집합의 연산 > 집합의 연산법칙 > 복합 연산 | 3 |
| 명제 > 역·이·대우 > 대우를 이용한 증명 | 3 |
| 명제 > 역·이·대우 > 명제 변환 | 1 |

## Difficulty result

| Bucket | 문항 수 |
|---:|---:|
| 1 | 0 |
| 2 | 1 |
| 3 | 75 |
| 4 | 68 |
| 5 | 12 |

legacy compatibility 현황은 NORMAL 54, BORDERLINE_REVIEW 42,
STRONG_CONFLICT 60이다. 기존 `level`은 자동 수정하지 않았다.

## Validation

- denominator before == after: PASS
- UID cardinality / source join: PASS
- canonical path / invalid path: PASS / 0
- difficulty 4-field enum: PASS
- blind ledger + freeze: PASS
- legacy compare after freeze: PASS
- DEFAULT_SCOPE / `defaultSelectable=true`: PASS
- generated metadata sidecar parity: PASS
- runtime field-list parity: PASS
- JS syntax / JSON parse: PASS
- content/choices/answer/solution/image/assets: unchanged

Machine receipts:

- `blind_first_pass.json`
- `first_pass_freeze.json`
- `legacy_compare.json`
- `independent_recheck.json`
- `metadata_candidate.json`
- `apply_receipt.json`

이 L1의 metadata는 `archive/data/question_metadata.json`에 sidecar로
적용했다. fresh inventory에서 새로 확인된 4문항은 qid_v1 source tuple로
등록했으며, source exam JS는 수정하지 않았다.
