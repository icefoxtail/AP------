# Archive No-Stop Pipeline / Final Debt v1

- 상태: **ACTIVE / CURRENT**
- 적용 시작: **2026-10-02**
- 적용 대상: JS Archive / Archive 2.0의 CREATE, REVIEW1, REVIEW2, R3, BATCH, FINAL, ITEM_RECOVERY, post-R3 repair, Authority Write Recovery, FLEX/감시/조율 worker
- 목적: **품질 FAIL/HOLD/debt는 숨기지 않되, 어떤 개별 실패도 작업 라인·lane·cohort 전체를 정지시키지 않는다. 품질 gate는 final release에서만 강제한다.**

---

## 1. 최상위 불변식 — EXECUTION CONTINUES, RELEASE WAITS

작업 진행 가능 여부와 학생 노출 release 가능 여부를 분리한다.

- **운영 selector를 멈추는 `BLOCK` / `BLOCKED` 상태를 신규 생성하지 않는다.**
- 시험지 단위 `EXAM_HOLD`, `*_PENDING`, quarantine을 신규 생성하지 않는다.
- 기존 `BLOCKED` / `PENDING` / global blocker 기록은 HISTORY 또는 debt provenance로만 읽는다.
- 문항·시험지에 미해결 결함이 있어도 가능한 CREATE → REVIEW1 → REVIEW2 → R3 및 다음 eligible target 처리는 계속한다.
- 단, 미해결 결함을 PASS로 바꾸거나 evidence를 꾸며서 stage/release를 통과시키지 않는다.
- **최종 MAIN/PUBLISH/FINAL SEAL만 unresolved release debt가 0일 때 허용한다.**

즉:

```text
FAIL/HOLD/WRITE ERROR/TOOL ERROR
!= LINE STOP
!= COHORT STOP
!= NEXT TARGET STOP

UNRESOLVED RELEASE DEBT
= FINAL MAIN/PUBLISH NOT AUTHORIZED
```

---

## 2. 모든 실패의 의무 복구 루프

도구/API/Git/Notion/provider/write/claim/stale ref/검수 실패를 처음 만났다고 종료하지 않는다.
모든 worker는 아래 순서를 **한 run 안에서 가능한 범위까지 반드시 수행**한다.

1. **상태 재확인**
   - latest Git main/ref
   - target exact artifact/blob/SHA
   - latest Notion CURRENT/ledger
   - 실제 mutation 발생 여부
2. **동일 경로 안전 재시도**
   - 이미 성공했는지 먼저 재조회한 뒤 중복 mutation을 피한다.
3. **stale/moving-target 복구**
   - stale ref, stale SHA, stale page anchor, stale claim이면 최신 상태를 다시 읽고 새 expected state로 재시도한다.
4. **안전한 대체 경로 전환**
   - primary ref → recovery ref/commit/blob
   - 신규 Notion 원장 생성 → 기존 CURRENT targeted update
   - unavailable executor → 동일 계약을 지킬 수 있는 recovery/FLEX owner
5. **결과 재조회**
   - write/commit/page/state가 실제 저장됐는지 다시 읽는다.
6. **결과 닫기**
   - 해결되면 정상 DONE/PASS lineage를 기록한다.
   - 해결되지 않으면 아래 debt로 정확한 scope/evidence/next action을 남긴다.
7. **claim/owner 정리 후 다음 eligible 작업으로 진행**
   - 같은 target의 무한 재시도 금지.
   - 현재 target 때문에 lane 전체를 점유하지 않는다.

요약:

```text
실패
→ 상태확인
→ 재시도
→ 최신 상태로 복구
→ 대체경로
→ 실제 저장 재확인
→ DONE 또는 DEBT로 닫기
→ 다음 eligible
```

---

## 3. Non-blocking Debt Registry

미해결은 다음 debt 중 하나로 남긴다. **어느 debt도 scheduler/lane/cohort selector의 stop 조건이 아니다.**

### 3.1 ITEM_HOLD
문항 truth가 아직 결정되지 않은 경우.

- source/answer/math decisive fact 불확정
- qid/questionUid 단위
- 다음 REVIEW/ITEM_RECOVERY/R3가 fresh 재판정 가능
- 해당 시험지의 후속 검수 자체를 금지하지 않는다

### 3.2 FINAL_REVIEW_DEBT
품질/evidence/review closure가 아직 release 기준을 만족하지 못한 경우.

예:
- curriculum/solution/visual/layout/meta 검수 FAIL
- required evidence stale/missing
- R3 FAIL
- catch-up/recheck 필요

### 3.3 WRITE_RECOVERY_DEBT
정확한 artifact/evidence의 durable write가 아직 끝나지 않은 경우.

예:
- Git write safety failure
- stale expected SHA
- Notion write 실패
- recovery ref materialization 미완료

### 3.4 INFRA_RETRY_DEBT
서비스/도구/provider/권한/실행환경 때문에 해당 축을 현재 run에서 완료하지 못한 경우.

### 3.5 USER_DECISION_DEBT
source 대체, 문항 생성/철회, 범위 확대 등 사용자 결정이 실제로 필요한 경우.

이 경우에도 해당 target의 결정 의존 축만 미해결로 남기고 다른 문항·시험지·lane은 계속한다.

---

## 4. Stage close와 debt의 관계

### 4.1 durable final artifact가 존재하는 경우

stage는 다음 중 하나로 닫을 수 있다.

- `DONE`
- `DONE_WITH_ITEM_HOLDS`
- `DONE_WITH_FINAL_REVIEW_DEBT`
- 필요한 경우 두 debt를 함께 명시

후속 stage는 **latest durable artifact + debt ledger**를 입력으로 사용한다.
후속 reviewer는 upstream debt를 정답으로 복사하지 않고 fresh 재판정한다.

### 4.2 durable final artifact 자체가 없는 경우

허위 `DONE`을 만들지 않는다.

```text
STAGE_ATTEMPT_CLOSED_WITH_DEBT
```

로 시도 결과를 닫고 `WRITE_RECOVERY_DEBT` 또는 `INFRA_RETRY_DEBT`를 남긴다.

- 해당 exam의 다음 stage가 정확한 입력 artifact를 요구하면 그 stage만 skip한다.
- worker/lane은 즉시 다른 eligible target을 처리한다.
- artifact가 복구되면 해당 exam은 마지막 durable 지점에서 재개한다.
- **전체 cohort 전환을 막지 않는다.**

---

## 5. 후속 검수는 debt가 있어도 계속한다

`ITEM_HOLD`, `FINAL_REVIEW_DEBT`가 있다는 이유로 후속 REVIEW/R3를 금지하지 않는다.

후속 stage는:

- 확인 가능한 축을 계속 검수한다.
- 기존 debt를 fresh evidence로 해제할 수 있으면 해제한다.
- 해결하지 못하면 그대로 carry한다.
- 새 debt가 발견되면 추가한다.
- 미해결 축을 PASS로 가장하지 않는다.

따라서 `REVIEW1_CATCHUP_REQUIRED`, `R3_FAIL_DEFERRED` 같은 과거 이름은
**전체 흐름을 되감거나 멈추는 상태가 아니라 scoped repair/debt routing signal**로 해석한다.

---

## 6. Lane / cohort / selector — NO IDLE

- 한 target이 실패해도 그 run에서 복구 루프를 수행한 뒤 **다음 eligible target을 즉시 선택**한다.
- 같은 target이 반복 실패하면 debt timestamp/evidence만 갱신하고 lane을 독점시키지 않는다.
- 현재 cohort에 즉시 실행 가능한 target이 더 없고 debt target만 남아 있으면 **다음 cohort로 전진**한다.
- debt는 별도 recovery/final sweep queue에 계속 남는다.
- legacy `*_PENDING`, `*_BLOCKED`, `GLOBAL_*_BLOCKER`가 하나라도 있다는 이유로 cohort 전환을 막지 않는다.
- active claim/in-flight는 중복 작업 방지용이지 장기 stop authority가 아니다. owner 종료/실패가 확인되면 claim을 정리하고 debt로 전환한다.

---

## 7. R3 / repair

- initial R3 FAIL → `FINAL_REVIEW_DEBT` + scoped repair packet.
- R3 worker는 repair를 기다리지 않고 다음 eligible exam으로 진행한다.
- repair worker도 실패 시 복구 루프 후 debt를 닫고 다음 repair target으로 진행한다.
- targeted R3_RETRY도 동일하다.
- R3 PASS를 만들려면 기존 R3 품질 gate를 실제 충족해야 한다. no-stop 규칙은 PASS 기준을 완화하지 않는다.

---

## 8. BATCH / FINAL / MAIN

BATCH/FINAL은 clean exam을 계속 처리한다.

- debt가 남은 시험지는 해당 publish 대상에서 skip
- 다른 clean 시험지는 계속 FINAL_READY / MAIN 반영 가능
- 모든 lane/cohort 순환이 끝난 뒤 **FINAL DEBT SWEEP**을 수행한다
- debt sweep은 ITEM_HOLD / FINAL_REVIEW_DEBT / WRITE_RECOVERY_DEBT / INFRA_RETRY_DEBT / USER_DECISION_DEBT를 oldest-first로 회수한다

최종 학생 노출 MAIN/PUBLISH 조건:

```text
itemHoldCount == 0
finalReviewDebtCount == 0
writeRecoveryDebtCount == 0
infraRetryDebtCount == 0
userDecisionDebtCount == 0
AND 기존 source/math/solution/visual/evidence/render/Git parity release gates PASS
```

사용자가 명시적으로 source withdrawal/scope exclusion을 승인한 경우에만 해당 target을 release denominator에서 정식 제외할 수 있다.

---

## 9. HARD GATE의 새 의미

기존 `HARD GATE`는 **품질 의미를 유지**한다.

다만:

- `HARD GATE FAIL` = 해당 artifact를 PASS/release할 수 없음
- `HARD GATE FAIL` ≠ worker stop
- `HARD GATE FAIL` ≠ lane stop
- `HARD GATE FAIL` ≠ cohort stop
- `HARD GATE FAIL` ≠ 다른 exam stop

즉 hard는 **판정 강도**이지 **scheduler 정지 권한**이 아니다.

---

## 10. Legacy migration

다음 legacy 상태는 새 selector에서 stop 조건으로 사용하지 않는다.

- `AUTHORITY_WRITE_PENDING`
- `CANDIDATE_MATERIALIZATION_PENDING`
- `STAGE_REEXECUTION_REQUIRED`
- `CREATE_BLOCKED`
- `REVIEW1_BLOCKED`
- `REVIEW2_BLOCKED`
- `R3_WRITE_GATE_TRANSIENT`
- `GLOBAL_WRITE_CAPABILITY_BLOCKER`
- `REVIEW1_CATCHUP_REQUIRED`
- 기타 `*_PENDING` / `*_BLOCKED`

fresh 재조회 후 실제 상태에 따라 DONE*, ITEM_HOLD, FINAL_REVIEW_DEBT,
WRITE_RECOVERY_DEBT, INFRA_RETRY_DEBT, USER_DECISION_DEBT 중 하나로 정규화한다.

---

## 11. 한 줄 운영 규칙

> **문제는 기록하고 마지막 release 전에 반드시 해결한다. 하지만 문제 하나 때문에 라인을 세우지 않는다. 실패한 worker는 반드시 “상태확인 → 복구 → 결과 닫기”까지 수행한 뒤 다음 eligible 작업으로 이동한다.**
