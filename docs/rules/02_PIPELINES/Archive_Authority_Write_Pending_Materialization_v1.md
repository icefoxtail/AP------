# Archive Stage Authority Continuity v2

- 호환 경로: `docs/rules/02_PIPELINES/Archive_Authority_Write_Pending_Materialization_v1.md`
- 상태: **ACTIVE / CURRENT**
- 적용 시작: **2026-10-01**
- 적용 대상: JS Archive current-generation CREATE / REVIEW1 / REVIEW2 / BATCH의 stage finalization
- current middle generation: `MIDDLE_RECERT_2026-09-30_META_V2`

---

## CURRENT OVERRIDE — 2026-10-02 — NO-STOP / FINAL-DEBT MODEL

최상위 실행 규칙은 `Archive_No_Stop_Pipeline_Final_Debt_v1.md`다.

- 운영 `BLOCK/BLOCKED/PENDING`은 신규 생성하지 않는다.
- write 실패는 반드시 **상태 재확인 → 안전 재시도 → stale/moving-target 갱신 → recovery ref/commit/blob 등 대체 경로 → 저장 재조회 → DONE 또는 debt close**까지 수행한다.
- 끝내 durable artifact를 못 만들면 `STAGE_ATTEMPT_CLOSED_WITH_DEBT` + `WRITE_RECOVERY_DEBT/INFRA_RETRY_DEBT`로 닫고 claim을 해제한 뒤 다음 eligible target으로 진행한다.
- legacy `GLOBAL_WRITE_CAPABILITY_BLOCKER`는 `WRITE_RECOVERY_DEBT`로 해석하며 lane/cohort를 멈추지 않는다.
- debt가 남은 시험지는 final MAIN/PUBLISH만 보류한다. 다른 stage/시험지/lane/cohort 진행은 계속한다.

## 1. 최상위 원칙 — NO EXAM PENDING

시험지 전체를 멈추는 운영 상태를 만들지 않는다.

CURRENT에서 다음 상태는 **신규 생성 금지**이며 과거 기록에서만 HISTORY로 읽는다.

- `AUTHORITY_WRITE_PENDING`
- `CANDIDATE_MATERIALIZATION_PENDING`
- `STAGE_REEXECUTION_REQUIRED`
- 그 밖의 시험지 단위 `*_PENDING` / `*_BLOCKED` / quarantine

미해결은 `ITEM_HOLD` 또는 `FINAL_REVIEW_DEBT / WRITE_RECOVERY_DEBT / INFRA_RETRY_DEBT / USER_DECISION_DEBT`로 기록한다. 이 debt들은 selector stop 조건이 아니다.

Git/connector write 실패는 시험지 상태가 아니라 **artifact 저장 위치 선택/복구 문제**다.

---

## 2. Stage authority는 branch 이름이 아니라 exact artifact다

CREATE / REVIEW1 / REVIEW2에서 candidate가 완성되면 그 run 안에서 exact final bytes를 물리 보존한다.

우선순위:

1. 기존 authority branch에 exact final artifact 결속
2. authority branch write가 막히면 recovery ref/commit/blob에 exact final artifact 보존
3. exact recovery artifact가 보존되면 **그 artifact 자체를 stage authority로 인정**

primary authority branch에 못 들어갔다는 이유만으로 시험지를 멈추지 않는다.

receipt 최소 필드:

```text
examFile
stage
certificationGeneration
inputArtifactSha
finalArtifactSha
authorityLocation = PRIMARY_BRANCH | RECOVERY_REF | RECOVERY_COMMIT | RECOVERY_BLOB
stageArtifactRef
changedFiles
itemHoldCount
itemHoldQuestionIds[]
```

downstream REVIEW는 고정 branch 이름을 가정하지 않고 receipt의 `stageArtifactRef` / `finalArtifactSha`를 읽는다.

---

## 3. Stage close

exact final artifact가 Git에 물리 보존되면 아래처럼 정상 stage를 닫는다.

- CREATE: `CREATE_DONE` 또는 `CREATE_DONE_WITH_ITEM_HOLDS`
- REVIEW1: `REVIEW1_DONE` 또는 `REVIEW1_DONE_WITH_ITEM_HOLDS`
- REVIEW2: `REVIEW2_DONE` 또는 `REVIEW2_DONE_WITH_ITEM_HOLDS`
- Meta-only track: 대응 `META_*_DONE`

recovery ref/commit/blob 사용은 DONE을 낮은 등급으로 만들지 않는다.

나중에 primary authority branch와 alias/parity를 맞추는 일은 maintenance이며 다음 stage 진입을 막지 않는다.

---

## 4. Candidate materialization

final JS/blob이 아직 없지만 deterministic parts + exact input/source SHA + complete item-hold/layout/asset ledger가 있으면 **같은 run에서 materialize하고 바로 stage close**한다.

별도 `CANDIDATE_MATERIALIZATION_PENDING` 상태를 만들지 않는다.

deterministic materialization이 불가능하면 해당 stage만 fresh 재실행한다.

- 전체 pipeline rewind 금지
- upstream durable stage 보존
- 재실행 후 exact final artifact를 물리 보존하고 바로 DONE*으로 닫는다
- `STAGE_REEXECUTION_REQUIRED`라는 지속 상태를 만들지 않는다

---

## 5. Write failure 처리

primary branch write 실패 후에도 가능한 Git 경로를 순서대로 시도해 exact artifact를 남긴다.

- existing recovery branch
- new recovery ref
- commit/blob object

exact artifact를 하나라도 durable하게 보존하면 그 artifact로 stage를 닫는다.

Git 전체 write capability가 실제로 막혀 **어떤 exact artifact도 물리 보존할 수 없는 경우에도 BLOCKER를 만들지 않는다.**

반드시:
1. remote/ref/blob 상태를 재확인한다.
2. 동일 안전 write를 bounded retry한다.
3. stale expected SHA/moving target이면 최신 상태로 갱신해 재시도한다.
4. 가능한 recovery ref/commit/blob 대체 경로를 시도한다.
5. 실제 저장 여부를 재조회한다.
6. 그래도 실패하면 `STAGE_ATTEMPT_CLOSED_WITH_DEBT` + `WRITE_RECOVERY_DEBT` 또는 `INFRA_RETRY_DEBT`로 닫는다.
7. claim을 해제하고 가능한 다른 eligible 시험지/다음 cohort를 계속 처리한다.

과거 `GLOBAL_WRITE_CAPABILITY_BLOCKER`는 HISTORY/debt provenance로만 읽는다. Git capability가 복구되면 debt queue에서 해당 stage를 재개한다.

---

## 6. 기존 PENDING 기록 migration

2026-10-01 이전의 `AUTHORITY_WRITE_PENDING` / `CANDIDATE_MATERIALIZATION_PENDING` 기록은 CURRENT 상태가 아니라 HISTORY다.

각 시험지는 다음처럼 재해석한다.

1. exact Git candidate/ref/commit/blob 존재 → 즉시 해당 stage DONE*으로 정합화
2. deterministic parts가 충분함 → 같은 run에서 materialize → DONE*
3. exact artifact도 없고 deterministic materialization도 불가능 → 해당 stage만 fresh 재실행 → DONE*

과거 PENDING ordinal이 뒤 시험지 선택을 막아서는 안 된다.

---

## 7. Question-level HOLD

문항별 불확실성은 기존 계약대로 `ITEM_HOLD`만 사용한다.

- item hold가 있어도 stage는 DONE_WITH_ITEM_HOLDS로 완료
- held qid만 다음 REVIEW 또는 ITEM_RECOVERY_QUEUE에서 다시 판정
- REVIEW2 뒤 item hold가 남으면 publish만 보류
- 다른 시험지/다른 lane 진행은 계속
- MAIN publish 직전에만 `itemHoldCount=0` 및 모든 release debt count=0을 HARD gate로 강제

---

## 8. BATCH / FINAL

BATCH도 시험지 단위 `BATCH_WRITE_PENDING`을 만들지 않는다.

final buffer primary ref write가 막히면 exact production allowlist candidate를 recovery final ref/commit으로 보존하고 그 ref를 `FINAL_READY` authority로 사용한다.

FINAL/MAIN writer는 latest main을 다시 읽고 그 exact production delta만 clean reconstruction한다.

---

## 9. 완료 판정

stage 완료 조건은 branch 이름이 아니라 아래 네 가지다.

1. exact final artifact bytes가 durable하게 존재
2. `finalArtifactSha` exact
3. durable receipt/evidence가 artifact identity를 가리킴
4. remote ref/blob 재조회로 exact 확인

**WRITE FAILURE ≠ EXAM HOLD**

**RECOVERY REF ≠ PENDING**

**EXACT ARTIFACT EXISTS → STAGE DONE***


---

## 10. FINAL DEBT SWEEP

정상 lane/cohort 진행 중 debt를 이유로 정지하지 않는다. 모든 즉시 실행 가능한 작업이 전진한 뒤 FINAL/BATCH tail에서 debt를 별도 전수 회수한다.

- `ITEM_HOLD`
- `FINAL_REVIEW_DEBT`
- `WRITE_RECOVERY_DEBT`
- `INFRA_RETRY_DEBT`
- `USER_DECISION_DEBT`

각 debt는 exact target/SHA/evidence/lastAttempt/nextAction을 가진다. debt가 남은 시험지만 publish에서 제외하고 clean 시험지는 계속 처리한다.
