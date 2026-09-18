# L1 Closeout — 2015 고1 도형의 방정식

상태: **FOCUSED REVIEW APPLIED / 2 EXPLICIT HOLDS**
Queue: `H15-GEOMETRY_EQUATIONS`  
curriculum/course: `2015 / 수학(상)`  
legacy key: `H15-SA-09`  
작업 단위: L1 1개

## Denominator

- fresh source denominator: **68 questions**
- source join: PASS
- UID cardinality: PASS
- source fingerprint mutation: **0**
- solution presence at inventory: **68/68**

## Taxonomy result

blind first-pass → freeze → legacy compare → source/solution independent recheck
순서로 처리했다. 모든 primary path가 RPM Primary Taxonomy v1.0에 존재한다.

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 평면좌표 > 삼각형의 무게중심 > 좌표로 무게중심 | 5 |
| 평면좌표 > 두 점 사이의 거리 > 거리 공식 | 17 |
| 평면좌표 > 두 점 사이의 거리 > 도형의 변 길이 | 5 |
| 평면좌표 > 선분의 내분·외분 > 내분점 | 7 |
| 평면좌표 > 선분의 내분·외분 > 외분점 | 4 |
| 직선의 방정식 > 직선의 방정식 > 한 점과 기울기 | 3 |
| 직선의 방정식 > 직선의 방정식 > 두 점을 지나는 직선 | 3 |
| 직선의 방정식 > 두 직선의 위치 관계 > 평행 | 4 |
| 직선의 방정식 > 두 직선의 위치 관계 > 수직 | 4 |
| 직선의 방정식 > 점과 직선 사이의 거리 > 거리 공식 | 1 |
| 원의 방정식 > 원의 방정식 > 중심과 반지름 | 7 |
| 원의 방정식 > 원의 방정식 > 일반형에서 원 찾기 | 2 |
| 원의 방정식 > 원의 접선 > 접점이 주어진 접선 | 1 |
| 원의 방정식 > 원의 접선 > 기울기가 주어진 접선 | 1 |
| 도형의 이동 > 대칭이동 > x축·y축·원점 대칭 | 1 |
| 도형의 이동 > 대칭이동 > 직선에 대한 대칭 | 3 |

## Difficulty result

| Bucket | 문항 수 |
|---:|---:|
| 1 | 0 |
| 2 | 0 |
| 3 | 45 |
| 4 | 19 |
| 5 | 4 |

`difficultyConfidence`, `difficultyBoundaryFlag`,
`legacyLevelCompatibility`를 함께 저장했다. legacy compare는 first-pass
freeze 이후에만 수행했으며, compatibility 현황은 NORMAL 33, BORDERLINE_REVIEW 0, BORDERLINE_ACCEPTABLE 21, STRONG_CONFLICT 14이다. 이는 기존 `level`을 자동
수정하지 않는다는 뜻이며, 각 recheck record에 source/solution 근거를 남겼다.

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
적용했고, `archive/question-meta.js` runtime merge field list가 v2 fields를
읽도록 보강했다. source exam JS는 수정하지 않았다.


## Focused plane-coordinate re-review — 2026-09-18

- Source cohort denominator retained: 38 records; UID cardinality unchanged.
- Difficulty bucket changes against main HEAD: 13; first-pass bucket counts: {"1":11,"2":13,"3":11,"4":3,"5":0}.
- Problem images opened and checked: 4/4.
- Foundation defect candidates and explicit HOLDs: 2.
- Source JS and problem/visual payload mutations: 0.
- Targeted validator: PASS with explicit holds; see plane_coordinates_validation.json.
- Scoped first-pass freeze: plane_coordinates_first_pass_freeze.json; legacy comparison was recorded after the freeze.

## Focused plane-coordinate re-review — 2026-09-18

- Source cohort denominator retained: 38 records; UID cardinality unchanged.
- Difficulty bucket changes against main HEAD: 13; first-pass bucket counts: {"1":11,"2":13,"3":11,"4":3,"5":0}.
- Problem images opened and checked: 4/4.
- Foundation defect candidates and explicit HOLDs: 2.
- Source JS and problem/visual payload mutations: 0.
- Targeted validator: PASS with explicit holds; see plane_coordinates_validation.json.
- Scoped first-pass freeze: plane_coordinates_first_pass_freeze.json; legacy comparison was recorded after the freeze.
