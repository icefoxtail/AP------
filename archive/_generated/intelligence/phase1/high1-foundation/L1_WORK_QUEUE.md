# 고1 Fresh Inventory / L1_WORK_QUEUE

- 상태: **FRESH_SCAN_COMPLETE**
- 범위: `archive/exams/original/high/h1/**/*.js`
- 2015/2022 분리: yes
- source files: **113**
- source questions: **2498**
- load errors: **0**
- target queue: **291**
- UID set SHA: `e8afcf2166ab196fcc1178dd9c9118171f9492df0e182c918d95490459d6367b`

## Fresh denominator

| 구분 | 문항 수 |
|---|---:|
| curriculum 2015 | 1588 |
| curriculum 2022 | 910 |
| course 수학(상) | 651 |
| course 공통수학1 | 639 |
| course 공통수학2 | 271 |
| course 수학(하) | 937 |

## L1 queue

| 순서 | Queue ID | Canonical L1 | Current key | 문항 수 | 상태 |
|---:|---|---|---|---:|---|
| 1 | H15-GEOMETRY_EQUATIONS | 도형의 방정식 | H15-SA-09 | 68 | QUEUED_FOR_BLIND_L1_REVIEW |
| 2 | H22-GEOMETRY_EQUATIONS | 도형의 방정식 | H22-C2-01 | 27 | QUEUED_FOR_BLIND_L1_REVIEW |
| 3 | H15-SET | 집합과 명제 | H15-SB-01 | 156 | QUEUED_FOR_BLIND_L1_REVIEW |
| 4 | H22-SET | 집합과 명제 | H22-C2-05 | 40 | QUEUED_FOR_BLIND_L1_REVIEW |

## Required collected fields

각 row에 curriculum/course/source file/UID/ordinal, 현재 standard/subUnit/concept/problem/template, legacy level/current difficulty field, solution/visual/shared-material candidate, source fingerprint, review status를 수집했다. 시각·shared-material 값은 inventory candidate이며 blind 판정에서 source/solution과 함께 재확정한다.

## Identity reconciliation note

기존 identity map과 비교할 때 실제 source에는 `original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js` 20문항이 추가로 존재한다. 이 20문항은 fresh inventory에서 제외하지 않고 qid_v1 알고리즘으로 queue에 포함했다. 기존 identity/classification map을 자동 수정하지 않았다.
