# Fresh 고1 미완료 L1 Queue

- status: **STOPPED_AT_USER_REQUEST**
- source files: **113**
- source questions: **2498**
- load errors: **0**
- completed work units: **35**
- completed source-reviewed UID count: **2464**
- identity-backed applied UID count: **2444**
- identity reconciliation HOLD UID count: **20**
- remaining canonical candidate rows: **33**
- unmapped/HOLD rows: **1**

## User-requested stop point

현재까지 처리된 마지막 work unit은 **H22-C2-07**이며, 이후 단원은 진행하지 않았다. 아래 3개는 candidate/freeze/recheck까지만 준비되어 있고 sidecar apply 전이다.

| 순서 | Queue | Curriculum | Course | Canonical L1 | 문항 수 | Source files | 상태 |
|---:|---|---|---|---|---:|---:|---|
| 1 | H22-C2-08 | 2022 | 공통수학2 | 함수 | 17 | 5 | CANDIDATE_READY |
| 2 | H22-C2-09 | 2022 | 공통수학2 | 함수 | 15 | 5 | CANDIDATE_READY |
| 3 | H22-M3-04 | 2022 | 공통수학1 | 방정식과 부등식 | 1 | 1 | CANDIDATE_READY |

## Unmapped/HOLD

| Queue | Curriculum | Course | Current key | 문항 수 | 상태 | 사유 |
|---|---|---|---|---:|---|---|
| H15-M3-01-HOLD | 2015 | 수학(상) | M3-01 | 1 | HOLD | source row is middle-school curriculum content (제곱근과 실수) and has no locked high1 canonical path; no invented taxonomy path applied |

완료된 candidate/receipt/closeout은 재작업하지 않고, identity reconciliation HOLD 20건은 identity 등록 후 별도 apply gate를 통과시킨다. 다음 재개 시 위 pending queue부터 이어갈 수 있다.
