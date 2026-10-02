# JS Archive Automation Stable Operating Contract v1

- 상태: **ACTIVE — M3 MIGRATION / CREATE OFF (69/69 DONE)**
- 동결일: 2026-10-02
- 최상위 authority: 형님의 현재 명시 지시
- 적용 시점: **2026-10-02 20:27 KST — 사용자 명시 승인으로 M3 migration 활성화**
- 기존 legacy GPT 예약: **OFF 유지**
- 현재 M3 backlog migration: **ACTIVE — Notion migration ledger 최신 CURRENT RECALC 사용**

## ACTIVE CUTOVER — 2026-10-02 20:27 KST — M3 MIGRATION

- 사용자 명시 승인으로 M3 backlog를 stable topology에 이관한다.
- CREATE=69/69 DONE, CREATE queue=0 → CREATE-1/2 OFF.
- ACTIVE: R1×2 / R2×2 / R3×2 / PUBLISH×1 / MASTER×3 = 10 slots.
- 일정: :00 MASTER-A / :10 R1-1 / :15 R2-1 / :20 MASTER-B / :25 R3-1 / :30 PUBLISH / :40 MASTER-C / :45 R1-2 / :50 R2-2 / :55 R3-2.
- 모든 slot은 Asia/Seoul RRULE recurring-capable schedule.
- MASTER는 §3.5 MASTER_LEASE v2 single-writer를 강제한다.
- Codex post-R3 repair/independent review sidecar는 별도 유지한다.
- latest queue는 Notion M3 migration ledger의 CURRENT RECALC를 매 run 재조회한다.

## 0. 목적

JS Archive 자동화를 다음 고정 흐름으로 단순화한다.

```text
CREATE → R1 → R2 → R3 → RELEASE QUEUE → PUBLISH → MAIN_DONE
```

R3 FAIL 이후의 repair/recovery/independent recheck는 현재 운영대로 Codex가 담당한다.

이 문서가 활성화되면 automation role/schedule/blind/recovery/publish의 단일 실행 authority가 된다.
과거 3-lane, Surge, Phase A/B, existing-slot-only, persistent-thread contamination, dormant clean-slot, 감시자/조율자 계약은 HISTORY다.

## 1. GPT 고정 12-slot topology

| Role | Count | Responsibility |
|---|---:|---|
| CREATE | 2 | 시험지 제작, solution, solution visual, Meta, physical evidence, CREATE closure |
| R1 | 2 | FULL independent review + allowed deterministic repair |
| R2 | 2 | FULL independent recheck + compare/regression closure |
| R3 | 2 | final full release audit; direct repair forbidden |
| PUBLISH | 1 | release queue/branch의 clean backlog 전체 batch main 반영 |
| MASTER EXECUTOR | 3 | 20분 간격으로 전체 pipeline 실제 복구·재배정·쓰기·배포 |

### 1.1 5-minute fixed schedule design

```text
:00 MASTER-A
:05 CREATE-1
:10 R1-1
:15 R2-1
:20 MASTER-B
:25 R3-1
:30 PUBLISH
:35 CREATE-2
:40 MASTER-C
:45 R1-2
:50 R2-2
:55 R3-2
```

이 시간표는 ACTIVE 운영 정본이다. M3 CREATE는 69/69이므로 CREATE-1/2만 OFF 유지하고 R1/R2/R3/PUBLISH/MASTER 10슬롯을 활성화한다.

### 1.2 ROLE-PURE HARD RULE

- CREATE/R1/R2/R3/PUBLISH slot은 역할을 바꾸지 않는다.
- CREATE slot을 R3로, R3 slot을 R1로 재활용하지 않는다.
- 역할 변경이 필요하면 해당 role의 새 task/slot을 만든다.
- 과거 대화 context가 다른 blind stage로 승계되지 않게 한다.

### 1.3 AUTOMATION DISPATCH CONTRACT — recurring-capable HARD

과거 예약 운영에서 확인된 dispatch 함정을 CURRENT로 승격한다. **critical Archive slot과 rescue/test slot은 single-DTSTART one-shot을 기본값으로 사용하지 않는다.**

- `last_run_time=null`은 “아직 정상 대기 중”의 충분조건이 아니다. single-DTSTART/one-shot task는 실행 이력이 없어도 내부 terminal/expired 상태가 되어 예정시각을 지나도 dispatch되지 않을 수 있다.
- 정상 CREATE/R1/R2/R3/PUBLISH/MASTER slot은 **RRULE 기반 recurring-capable schedule**로 생성한다.
- production slot은 고정 분(:00/:05/.../:55)에 맞는 RRULE을 사용하고, enable/disable은 role 운영 상태로 제어한다.
- one-off rescue/test도 dispatch 검증이 목적이면 single DTSTART 대신 **temporary recurring-capable schedule**을 사용한다. 권장 fail-safe는 `RRULE:FREQ=HOURLY;COUNT=2`처럼 두 번 이하 기회를 주고, 첫 실제 run이 확인되면 즉시 disable한다.
- 테스트 task는 전체 activation과 구분한다. prompt 첫머리에 `USER_APPROVED_ONE_SHOT_TEST / GLOBAL_TOPOLOGY_NOT_ACTIVATED`를 명시하여 `STABLE DESIGN / NOT ACTIVE`가 해당 테스트 1건의 실행 금지로 오해되지 않게 한다.
- 예정시각이 지났는데 `last_run_time=null`이고 target의 Git/Notion physical progress도 0이면 **WORK_FAIL이 아니라 DISPATCH_STALL**이다. 동일 expired one-shot의 DTSTART만 다시 쓰지 말고 recurring-capable task로 재생성/교체한다.
- schedule에는 사용자 운영 timezone을 명시적으로 고정하는 것을 권장한다. 현재 Archive 기본은 `Asia/Seoul`이다.

예시 — hourly role slot:

```text
BEGIN:VEVENT
DTSTART;TZID=Asia/Seoul:20261002T182000
RRULE:FREQ=HOURLY;BYMINUTE=20;BYSECOND=0
END:VEVENT
```

예시 — temporary dispatch test:

```text
BEGIN:VEVENT
DTSTART;TZID=Asia/Seoul:20261002T182000
RRULE:FREQ=HOURLY;COUNT=2;BYMINUTE=20;BYSECOND=0
END:VEVENT
```

temporary test의 첫 실제 run 판정은 `last_run_time`만 보지 않고 **target physical mutation/receipt/readback**까지 같이 확인한다. 첫 run이 성공하면 두 번째 occurrence 전에 disable한다.
### 1.4 NON-STOP ROLE-PURE WORKER — NEVER SELF-DISABLE HARD

형님의 2026-10-02 최신 지시: **"내가 못하면 다음 거 하러 간다. 정지는 절대 하지 않는다."**

이 규칙은 ACTIVE CREATE/R1/R2/R3/PUBLISH/MASTER 전체에 적용한다.

- **worker self-disable 금지.** target 하나의 contamination, validator 실행 불가, write/tool failure, stale ref, claim conflict, source/capability debt, scoped HARD gate 때문에 recurring role slot 자체를 끄지 않는다.
- disable은 **사용자 명시 지시** 또는 **현재 topology authority가 role queue 종료를 명시한 경우**에만 한다. 현재 M3에서는 CREATE=69/69이므로 CREATE만 OFF이고 R1×2/R2×2/R3×2/PUBLISH×1/MASTER×3은 backlog가 있는 동안 계속 ACTIVE다.
- 한 target을 현재 worker가 안전하게 완료할 수 없으면 그 target에 대해 exact durable handoff를 만든다:
  - `reviewAttemptId` 또는 invalid-attempt identity
  - `inputArtifactSha`
  - current branch/HEAD
  - `validationExecutor`
  - `firstMissingClosureStep`
  - exact blocker/debt
  - `nextOwner=MASTER` 또는 해당 recovery owner
- handoff 이후 **그 target 때문에 run/slot을 멈추지 않고 selector를 계속하여 다음 eligible target을 찾는다.**
- 한 run의 mutation/closure는 최대 1시험지로 유지한다. 따라서 여러 부적격 target은 read-only로 skip/handoff할 수 있지만 실제 mutation을 시작한 target은 1개만 닫는다.
- `EXECUTOR_CAPABILITY_PREFLIGHT=UNAVAILABLE`이면 target detail/blind 작업에 들어가기 전에 handoff 후 다음 eligible로 순환한다. 이미 blind freeze 전에 prior detail이 노출됐다면 그 attempt만 `INVALID`로 닫고 다음 eligible로 순환한다.
- valid `blindDecisionSha` 이후 write/validator 실패는 same-attempt continuation debt로 넘기되, 현재 run에서 continuation executor가 없으면 handoff 후 다음 eligible을 찾는다.
- selector 전체에 실제 eligible이 0이거나 모든 eligible이 active lease/claim으로 점유된 경우에만 scoped `NO_EXECUTABLE_TARGET`/`NO_WORK`를 기록할 수 있다. **그래도 recurring slot은 enabled 상태를 유지한다.**
- MASTER는 매 run ACTIVE topology를 확인한다. **사용자 명시 중지가 아닌데 R1/R2/R3/PUBLISH/MASTER role-pure slot이 disabled이고 해당 role backlog가 남아 있으면 즉시 re-enable**한다.
- target-local debt는 MASTER/recovery sidecar가 처리한다. role worker는 다음 시험지를 계속 소비한다.

## 2. Review Attempt v2 — blind의 단위

Blind 독립성 단위는 **automation/thread 전체가 아니라 reviewAttemptId**다.

reviewAttemptId는 최소 다음을 결속한다.

```text
stage
examUid
inputArtifactSha
attemptNo
```

정상 순서:

```text
selector-safe metadata
→ Golden/Negative calibration
→ source/required authority 기반 independent judgment
→ blindDecisionSha freeze
→ prior solution/verdict/checkpoint/repair/diff compare
→ repair/recheck/validator/receipt closure
```

### 2.1 continuation

유효한 blindDecisionSha가 이미 동결된 뒤 write/validator/Git/Notion 실패가 발생했다면 오염이 아니다.
동일 reviewAttemptId로 다음 run에서 이어서 닫는다.
compare detail을 이미 봤다는 이유로 continuation을 폐기하지 않는다.

### 2.2 invalid blind attempt

blindDecisionSha 동결 전에 target prior verdict/repair answer/checkpoint detail이 선노출되어 독립성이 실제로 깨진 경우 **그 attempt만 INVALID**다.

- worker/thread 전체를 영구 오염시키지 않는다.
- MASTER가 invalid attempt를 닫는다.
- fresh one-shot reviewer/task를 새로 생성해 재배정한다.
- 새 task 생성 금지, dormant clean-slot 재고, persistent-thread permanent contamination 규칙은 폐기한다.

## 3. MASTER EXECUTOR ×3

MASTER는 감시자/보고자가 아니라 **비블라인드 총괄 실행자**다.
형님의 운영 authority를 위임받아 pipeline을 실제로 움직인다.

### 3.0 AUTONOMOUS ESCALATION CONSUMER / DELIVERY TARGET HARD

MASTER는 하위 worker가 남긴 상태를 단순 관찰하지 않고 **escalation queue를 능동 소비**한다.

매 run read-only 전체 pipeline scan 후 실제 mutation target은 최대 1시험지다. selector 우선순위는 다음으로 고정한다.

```text
1. release-materialization debt / remote parity recovery
2. candidate / validator / receipt closure stall
3. stale SHA / ref / claim / lineage conflict
4. live R1 / R2 / R3 write·validator failure
```

다음 상태는 MASTER가 사용자 추가 지시를 기다리지 않고 소비한다.

- `HANDOFF_READY` / `nextOwner=MASTER`
- validator/write/receipt debt
- stale lease/claim
- release-materialization debt
- lineage conflict
- eligible backlog가 존재하는 false `NO_WORK`
- stalled Codex repair / independent-review recovery

단, Codex 또는 다른 executor가 해당 target에서 **실제 queued/in_progress run, active review, fresh commit/receipt**를 만들고 있으면 중복수리하지 않는다. 같은 target의 active work를 확인하면 mutation 0으로 건너뛰고 다음 eligible을 찾는다.

stage delivery의 최소 종착점은 다음과 같다.

```text
R1 병목
→ REVIEW1_DONE / READY_FOR_REVIEW2
   또는 fresh R2 reviewer actual claim/run

R2 병목
→ REVIEW2_DONE / READY_FOR_R3
   또는 fresh R3 reviewer actual claim/run

R3 병목
→ R3_PASS / RELEASE_QUEUE
   또는 R3_FAIL_DEFERRED → CODEX_R3_REPAIR / CODEX_INDEPENDENT_REVIEW actual execution
```

`HANDOFF_READY`, `nextOwner`, 문서 기록만으로 MASTER delivery 완료를 선언하지 않는다. 직접 closure가 불가능한 경우에도 **fresh executable owner가 실제 claim/run에 진입한 물리 증거**와 exact input/completion gate가 있어야 완료다.

### 3.1 권한

MASTER는 필요 시 다음을 직접 수행할 수 있다.

- stalled owner/claim/lease 정리
- stale SHA/ref/page/receipt 재조회·교정
- write 재시도 및 safe write path 전환
- deterministic repair
- evidence materialization
- validator 실행/fallback
- commit/push/merge/publish
- stage/owner/queue 재배정
- invalid blind attempt 폐쇄
- fresh one-shot blind reviewer/task 생성
- Codex repair/recheck queue 재기동·재연결
- release queue 정리

### 3.2 금지

MASTER도 다음 사실은 조작할 수 없다.

- source truth
- answer/math truth
- 실제 validator FAIL을 PASS로 위조
- unresolved release debt를 숨기고 publish
- unrelated production payload mutation

운영 절차와 ownership은 강권한으로 바꿀 수 있지만 사실과 품질 gate는 위조할 수 없다.

### 3.3 MASTER 완료 조건

다음은 완료가 아니다.

- 문제 발견
- STALL/DEBT/CONTAMINATED 기록
- generic checkpoint
- 문서 갱신만 수행
- 다음 owner에게 말만 넘김

완료는 다음 둘 중 하나다.

1. durable state가 실제 다음 정상 상태로 이동함.
2. 직접 완료 불가 시 fresh executable owner가 실제 claim/실행에 진입하고 exact input/completion gate가 결속됨.

### 3.4 실행 순서

```text
발견
→ physical state 확인
→ root cause 확정
→ MASTER_LEASE
→ 직접 복구/수정
→ validator
→ commit/push/merge
→ 저장 readback
→ stage 이동
→ 마지막에 Notion
```

문서 갱신은 마지막이다.

#### 3.4.1 CURRENT PHYSICAL OVERRIDES PROMPT-PINNED TARGET

예약 prompt에 특정 exam/branch/HEAD/continuation priority가 적혀 있어도 그것은 **실행 시작 시점의 selector hint**일 뿐 authority가 아니다.

매 run 시작 시 최신 migration ledger CURRENT + latest origin/main + target physical branch/receipt/lease/workflow를 다시 읽고 다음을 적용한다.

- prompt에 고정된 과거 target이 이미 closure되었거나 stage가 이동했으면 재작업하지 않는다.
- prompt의 branch/HEAD/input SHA가 stale이면 최신 physical lineage로 selector를 재계산한다.
- 과거 `CURRENT CONTINUATION PRIORITY` 문구가 최신 migration ledger와 충돌하면 최신 CURRENT/physical이 우선한다.
- stale continuation을 이유로 fresh 정상 backlog를 건너뛰지 않는다.
- 과거 채팅 보고나 예약 prompt의 PASS/FAIL을 physical receipt/readback보다 우선하지 않는다.

### 3.5 MASTER_LEASE v2 — single-writer / no duplicate mutation HARD

MASTER-A/B/C는 병렬 감시자이지만 **동일 artifact의 동시 수정자는 아니다.** 같은 시험지·같은 stage·같은 input artifact에는 항상 MASTER 1개만 mutation authority를 가진다.

#### 3.5.1 lease identity

exclusive lease key는 다음 3개를 결속한다.

```text
leaseKey = sha256(examUid + stage + inputArtifactSha)
```

`repairFingerprint`는 lease를 쪼개는 key가 아니라 **lease 내부의 secondary dedupe identity**다. 같은 artifact에서 defect가 여러 개 보여도 별도 MASTER들이 병렬 수정하지 않는다.

최소 lease record:

- `masterLeaseId`
- `leaseKey`
- `owner = MASTER-A | MASTER-B | MASTER-C`
- `examUid`
- `stage`
- `inputArtifactSha`
- `targetBranch`
- `targetHeadAtClaim`
- `repairFingerprint`
- `failedGate`
- `openQids[] / openFiles[] / openFields[]`
- `firstMissingClosureStep`
- `claimedAt`
- `expiresAt`
- `lastProgressAt`
- `expectedCompletionGate`
- `status = ACTIVE | HANDOFF_READY | CLOSED`

`repairFingerprint`는 최소 `failedGate + openQids/openFiles/openFields + firstMissingClosureStep`를 canonical sort/normalize한 값으로 만든다.

#### 3.5.2 atomic claim

MASTER는 defect를 발견했다고 바로 수정하지 않는다.

```text
read-only scan
→ leaseKey/repairFingerprint 계산
→ remote MASTER_LEASE atomic claim
→ claim readback
→ target HEAD/input SHA 재조회
→ 유일 owner 확인 후에만 mutation
```

- lease는 main이 아닌 전용 temporary remote ref/record로 물리화한다.
- 같은 `leaseKey`에 기존 ACTIVE lease가 있으면 새 claim은 실패해야 하며, 실패한 MASTER는 **mutation 0**으로 해당 target을 건너뛰고 다음 eligible을 찾는다.
- claim 성공 직후 반드시 remote lease를 다시 읽어 `masterLeaseId/owner/inputArtifactSha`가 자기 claim과 exact인지 확인한다.
- claim 뒤 target HEAD 또는 inputArtifactSha가 이미 바뀌었으면 lease를 사용하지 않고 최신 상태에서 selector를 다시 시작한다.

#### 3.5.3 pre-mutation CAS recheck

다음 각 경계 직전에 MASTER는 lease와 target을 다시 읽는다.

1. production/candidate file write 직전
2. validator/Actions trigger 직전
3. validator receipt write 직전
4. stage receipt/state transition 직전
5. merge/publish 직전

필수 조건:

```text
currentLease.masterLeaseId == myLeaseId
AND currentLease.owner == me
AND currentTargetHead == expectedTargetHead
AND currentInputArtifactSha == leasedInputArtifactSha
```

하나라도 다르면 stale 판단을 폐기하고 **mutation 0**. 다른 MASTER/worker가 만든 최신 artifact를 덮어쓰거나 같은 repair를 반복하지 않는다.

자기 write로 HEAD가 이동한 경우에는 write 결과 readback 후 lease의 `expectedTargetHead/lastProgressAt`을 새 값으로 갱신한 뒤 다음 mutation으로 진행한다.

#### 3.5.4 duplicate repair suppression

- ACTIVE lease가 있는 target은 다른 MASTER가 read-only 관찰은 할 수 있지만 repair/write/validator/receipt/publish mutation을 하지 않는다.
- 같은 `repairFingerprint`가 이미 newer HEAD/receipt에서 닫혔으면 새 repair를 만들지 않고 stale debt/claim만 정리한다.
- 다른 `repairFingerprint`가 발견돼도 같은 `examUid + stage + inputArtifactSha`라면 현재 lease owner가 한 run에서 함께 판단하거나 durable handoff한다. 별도 MASTER가 같은 artifact를 병렬 수정하지 않는다.
- 유효 lease target 하나 때문에 MASTER run 전체를 종료하지 않는다. skip 후 다음 eligible target을 계속 찾는다.

#### 3.5.5 lease lifetime / takeover

기본 ACTIVE lease TTL은 **90분**이다. 긴 validator/Actions 실행을 고려해 20분 MASTER 간격보다 충분히 길게 둔다.

takeover는 아래를 **모두** 만족할 때만 허용한다.

1. `expiresAt` 경과
2. lease owner의 최신 durable progress가 없음
3. target HEAD/input SHA 재조회 완료
4. 관련 validator/workflow가 queued/in_progress가 아님
5. 기존 owner가 만든 새 commit/receipt/stage transition이 claim 직전 재조회에서도 없음

takeover도 stale lease 정리 후 **새 atomic claim + post-claim readback**을 다시 통과해야 한다. 단순히 “다른 MASTER가 20분 뒤 왔다”는 이유만으로 takeover하지 않는다.

durable progress는 최소 다음 중 하나다.

- target/candidate HEAD 또는 artifact SHA 이동
- validator workflow/run/job 생성 또는 완료
- validator receipt
- stage receipt/state transition
- publish/main merge

#### 3.5.6 release / handoff

- 정상 closure 후 MASTER는 receipt/readback에 `masterLeaseId`를 남기고 lease를 `CLOSED` 처리한다.
- runtime 종료 등으로 직접 closure가 불가능하지만 exact continuation이 물리화됐으면 `HANDOFF_READY`로 lease를 정리할 수는 있다. **그러나 이것만으로 MASTER stage-delivery 완료를 선언하지 않는다.**
- MASTER 완료 판정에는 fresh executable owner의 실제 claim/run 또는 다음 정상 durable stage가 필요하다.
- HANDOFF_READY 이후 다음 MASTER는 기존 repair를 처음부터 재실행하지 않고 exact continuation에서 새 lease를 획득한다.
- 같은 capability를 가진 owner에게 같은 handoff를 반복해 실패를 재생산하지 않는다.
- 문서만 남기고 ACTIVE lease를 방치하지 않는다.

#### 3.5.7 PUBLISH singleton

PUBLISH/main mutation은 target lease와 별개로 **전역 `PUBLISH_LEASE` 1개**를 사용한다.

- GPT PUBLISH, Codex publisher, MASTER의 emergency publish 모두 같은 singleton lease를 사용한다.
- lease 획득 실패 시 main mutation 0.
- publish 직전 latest main + release backlog + lease owner를 다시 읽고, batch가 이미 소비됐으면 mutation 0.
- stale PUBLISH_LEASE takeover는 일반 MASTER lease보다 느슨하게 처리하지 않는다. 최소 `lease expiry + no durable publish progress + no queued/in_progress publish workflow + latest main/release backlog 재조회 + 직전 owner의 fresh commit/receipt 없음`을 모두 확인한 뒤 새 atomic claim으로만 takeover한다.
- 다른 publisher가 실제 in-flight이면 기다리는 대신 그 target/batch mutation은 0으로 두고 다른 MASTER backlog를 소비한다.

## 4. 실패 처리

### 4.1 write/tool/Git/Notion 실패

```text
FAIL
→ state recheck
→ safe retry
→ stale state refresh
→ alternate safe path
→ readback
→ DONE 또는 scoped debt
→ 다음 eligible
```

첫 실패에서 보고만 하고 종료하지 않는다.

- **동일 실패 경로 반복 금지 — recovery only.** 같은 target에서 state/HEAD/capability 변화가 없는데 동일 action path가 이미 실패했다면 같은 경로를 반복하지 않는다. materially different safe path를 시도하고, 그래도 현재 run에서 닫히지 않으면 exact continuation/handoff를 남긴 뒤 즉시 다음 eligible로 진행한다. **이 규칙은 새 HOLD·gate·대기 상태를 만들지 않는다.**
- **stale lineage는 current physical 기준으로 복구 — recovery only.** stale repair/candidate/branch 때문에 막히면 stage 전체를 처음부터 되감지 않는다. 확인 가능한 최신 main/current valid preimage에 이미 확정된 수정은 보존하고 current OPEN locus만 재적용해 최신 lineage를 재구성한다. exact reconstruction이 당장 불가능하면 scoped handoff 후 다음 eligible로 진행한다. **stale lineage 자체는 라인 중단 사유가 아니다.**

### 4.2 contamination

- blind freeze 이후 노출: 정상 continuation.
- blind freeze 이전 선노출: attempt만 INVALID → MASTER가 fresh one-shot reviewer 생성.
- MASTER는 비블라인드이므로 “나도 봤으니 못 고친다”를 이유로 repair/write/routing/publish를 거부할 수 없다.

### 4.3 NO_WORK

- candidate 하나가 부적격이라고 run을 종료하지 않는다.
- selector 범위 전체를 확인하고 실제 eligible=0일 때만 NO_WORK.
- eligible backlog가 있는데 NO_WORK면 MASTER rescue 대상이다.

## 4.4 Scheduled worker closure — CANDIDATE IS NOT DONE

예약 worker는 candidate/evidence를 만들었다는 이유로 stage를 끝냈다고 간주하지 않는다.

### 4.4.1 EXECUTOR_CAPABILITY_PREFLIGHT — target 작업 전에 실행

CREATE/R1/R2/R3 worker는 긴 target 작업을 시작하기 전에 이번 run에서 실제 validator를 어디서 실행할지 먼저 확정한다.

```text
local Node CLI available?
→ YES: local canonical validator 사용
→ NO: GitHub Actions / temporary validation PR·CI 사용 가능 여부 확인
→ 둘 다 불가: exact continuation checkpoint + scoped INFRA_RETRY_DEBT
```

최소 기록:

- `validationExecutor = LOCAL_NODE | GITHUB_ACTIONS | UNAVAILABLE`
- 사용할 canonical validator path/blob
- branch/write 권한과 Actions 실행 가능 여부

#### 4.4.1A CAPABILITY MATRIX / NO GLOBALIZATION HARD

예약 run은 하나의 실행 경로 실패를 전체 시스템 capability 부재로 일반화하지 않는다. target mutation 전에 현재 run의 capability를 최소 다음 축으로 분리한다.

```text
LOCAL_FS / LOCAL_NODE
GITHUB_READ
GITHUB_CONTENTS_WRITE
GITHUB_PR_WRITE
GITHUB_ACTIONS_READ
GITHUB_ACTIONS_WRITE
NOTION_WRITE
```

- `UNKNOWN`은 `UNAVAILABLE`이 아니다. 실제 관련 action을 호출해 exact error를 받은 capability만 unavailable/blocked로 판정한다.
- local filesystem/write safety 차단은 LOCAL 계열 실패다. 이를 GitHub connector write/PR/Actions 불가로 복사하지 않는다.
- GitHub Contents write 실패는 PR write 실패가 아니며, PR write 실패는 Actions read/write 실패가 아니다. action별로 독립 판정한다.
- GitHub read가 가능하고 target에 remote mutation이 필요하면 해당 target에 필요한 exact connector write action을 실제 시도한다. capability 확인만을 위한 unrelated probe mutation은 만들지 않는다.
- validation/independent review가 필요하면 `기존 PR 검색 → 없으면 draft PR 생성 → PR number/head SHA readback → Actions run/job 또는 Codex review actual start proof readback` 순서를 사용한다.
- `@codex` comment 생성만으로 actual execution을 선언하지 않는다. bot summary/reaction/review state 등 실제 실행 개시 증거를 확인한다.
- PR/Contents/Actions 중 한 경로가 실패하면 exact error를 남기고 같은 run에서 materially different GitHub 경로를 최소 하나 실제 시도한다.
- 모든 관련 GitHub capability가 각자 exact error로 실패한 뒤에만 `CAPABILITY_DEBT`/infra handoff를 허용한다.
- 같은 capability를 가진 owner에게 반복 HANDOFF하여 같은 실패를 재생산하는 것을 금지한다.
- 2026-10-03 o69 복구에서 연결 GitHub의 `create_pull_request`, issue/PR comment, workflow read가 실제 동작했고 PR #141에서 Codex review actual start까지 확인됐다. 따라서 이후 예약 worker는 local safety 차단을 근거로 이 GitHub capability들을 선험적으로 불가 판정하지 않는다.

**무거운 solution/Meta/SVG 작업을 끝낸 뒤에야 validator 실행경로가 없음을 발견하는 순서를 금지한다.**

### 4.4.2 closure tuple HARD

CREATE의 정상 완료는 아래 5개가 모두 물리적으로 존재하고 서로 같은 final artifact에 결속될 때만 인정한다.

1. final exam/artifact blob
2. physical evidence
3. **actual** calibration/`review-evidence-gate --stage CREATE` validator receipt
4. durable CREATE receipt with `CREATE_DONE → READY_FOR_REVIEW1`
5. remote ref/blob readback

candidate commit, evidence-only commit, self-reported `calibrationStatus=PASS`, checkpoint, Notion 기록만으로는 CREATE_DONE이 아니다.
특히 GitHub Actions fallback을 선택한 경우 **workflow run/job가 실제로 존재하지 않으면 validator 미실행**이다.

### 4.4.3 CLOSURE-FIRST BUDGET

candidate + physical evidence가 완성된 순간부터 남은 run 시간은 다음 순서에 우선 배정한다.

```text
actual validator
→ validator receipt
→ stage receipt
→ remote readback
→ Notion/report
```

추가 SVG 개선, 설명 확장, 문서 정리, 보고 작성은 closure 뒤다.

### 4.4.4 runtime/time limit continuation

run이 시간 제한이나 executor 중단으로 candidate 이후 종료될 수 있으면 종료 전에 최소 다음을 durable checkpoint로 남긴다.

- `reviewAttemptId`
- candidate branch/HEAD
- finalArtifactSha
- physicalEvidence blob
- completed step
- **firstMissingClosureStep**
- selected `validationExecutor`

다음 같은-role run은 새 target을 고르거나 fresh rewrite를 반복하지 않고 **그 exact candidate의 firstMissingClosureStep부터 먼저 재개**한다.

one-shot 예약으로 full CREATE를 시험할 때 candidate 생성까지 시간이 오래 걸릴 가능성이 있으면, one-shot 하나에 “무조건 완결”을 가정하지 않는다. **continuation 가능한 recurring slot**을 사용하거나, 첫 run이 candidate에서 끝났다면 즉시 gate/receipt-only continuation run으로 이어야 한다.
## 5. Codex recovery ownership

현재 운영대로 다음은 Codex가 담당한다.

- 하위 실패 recovery
- R3 FAIL repair
- repair 결과 independent recheck

post-R3:

```text
R3_FAIL_DEFERRED
→ CODEX_R3_REPAIR
↔ CODEX_INDEPENDENT_REVIEW
```

Independent Review PASS는 추가 GPT R3 retry 없이 release queue로 보낸다.
FAIL은 updated OPEN locus로 Codex repair에 되돌린다.

MASTER는 Codex queue를 감시하고 stalled owner를 재기동·재배정할 수 있지만 Codex independent PASS를 임의로 대신 선언하지 않는다.

## 6. R3 PASS → RELEASE QUEUE

R3 PASS는 main merge가 아니다.

R3 PASS 시 final exam/required metadata/assets/evidence/finalArtifactSha와 R3 PASS provenance를 release queue/branch에 적재한다.

Codex post-R3 Independent Review PASS도 동일 release queue/branch로 보낸다.

## 7. PUBLISH = clean backlog 전체 batch sweep

PUBLISH는 시험지 1개 consumer가 아니다.

매 run:

1. release queue/branch 전체 재조회
2. clean release-eligible 전체 확정
3. debt/invalid 후보는 queue에 남김
4. clean 최종 산출물 전체를 하나의 publish batch로 반영
5. batch manifest에 exam + finalArtifactSha + release provenance + changed files 기록
6. batch commit/merge/push
7. remote main 및 각 final artifact parity 확인
8. 포함 시험지를 MAIN_DONE

### 7.1 GPT + Codex dual publisher

GPT PUBLISH와 Codex publisher가 동시에 존재할 수 있다.

- 하나의 PUBLISH_LEASE만 사용한다.
- 먼저 lease를 잡은 publisher가 현재 clean backlog 전체를 처리한다.
- 다른 publisher는 재조회 후 이미 소비됐으면 mutation 0.
- 시험지별 독립 commit을 강제하지 않는다.
- publish cycle의 clean release backlog를 batch 단위로 commit한다.

## 8. No-stop invariant

- HARD gate FAIL은 해당 artifact의 PASS/release를 막지만 scheduler 전체를 멈추지 않는다.
- 한 target debt가 다른 exam/lane/cohort를 막지 않는다.
- release debt는 final publish에서만 0을 강제한다.
- MASTER는 병목을 문서화만 하지 않고 실제 closure 또는 executable handoff까지 만든다.

## 9. Activation 전 보존

- current main artifact와 durable CREATE/R1/R2/R3 receipts는 삭제하지 않는다.
- Codex repair/recheck 결과도 보존한다.
- automation topology만 새 구조로 교체한다.
- **기존 누적 시험지/backlog migration은 별도 논의 후 확정한다.**
- activation 전 기존 GPT 예약은 OFF 유지.

## 10. 문서 버전 정책

- 이 문서 이전의 automation topology/Surge/Phase A·B/persistent-thread contamination/clean dormant slot/coordinator-monitor 계약은 HISTORY다.
- 새 worker는 HISTORY를 기본 preload하지 않는다.
- 이 문서에 임시 override를 계속 덧붙이지 않는다.
- 큰 구조 변경 시 새 버전 문서를 만들고 이전 버전 전체를 90_ARCHIVE/HISTORY로 이동한다.
