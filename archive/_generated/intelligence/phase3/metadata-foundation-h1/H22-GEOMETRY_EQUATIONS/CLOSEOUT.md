# L1 Closeout — 2022 고1 도형의 방정식

상태: **PASS / CLOSED**  
Queue: `H22-GEOMETRY_EQUATIONS`  
curriculum/course: `2022 / 공통수학2`  
legacy key: `H22-C2-01`  
작업 단위: L1 1개

## Denominator

- fresh source denominator: **27 questions**
- source join: PASS
- UID cardinality: PASS
- source fingerprint mutation: **0**
- solution presence at inventory: **27/27**

## Taxonomy result

blind first-pass → freeze → legacy compare → source/solution independent recheck
순서로 처리했다. 모든 primary path가 RPM Primary Taxonomy v1.0에 존재한다.

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 평면좌표 > 두 점 사이의 거리 > 거리 공식 | 7 |
| 평면좌표 > 두 점 사이의 거리 > 도형의 변 길이 | 2 |
| 평면좌표 > 선분의 내분·외분 > 내분점 | 9 |
| 평면좌표 > 선분의 내분·외분 > 외분점 | 2 |
| 평면좌표 > 삼각형의 무게중심 > 좌표 도형 활용 | 1 |
| 직선의 방정식 > 두 직선의 위치 관계 > 평행 | 1 |
| 직선의 방정식 > 두 직선의 위치 관계 > 수직 | 4 |
| 원의 방정식 > 원의 방정식 > 중심과 반지름 | 1 |

## Difficulty result

| Bucket | 문항 수 |
|---:|---:|
| 1 | 1 |
| 2 | 0 |
| 3 | 22 |
| 4 | 4 |
| 5 | 0 |

legacy compatibility 현황은 NORMAL 12, BORDERLINE_REVIEW 7,
STRONG_CONFLICT 8이다. 기존 `level`은 자동 수정하지 않았다.

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
적용했다. source exam JS는 수정하지 않았다.
