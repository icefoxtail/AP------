# JS Archive Automation Stable Operating Contract v1

- 상태: **ACTIVE — M2-1 THANOS MASTER ×5 / CURRENT**
- 동결일: 2026-10-03
- 최상위 authority: 형님의 현재 명시 지시
- 적용 시점: **2026-10-03 — MASTER-A/B/C + INFINITY-1/2 → THANOS-MASTER-1~5 통합**
- current scope: **M2 1학기 34 current generation**
- M3 / M1 / M2 2학기 / 고등 legacy 예약: **OFF 유지**

## PROMPT CANONICAL SOURCE — CURRENT

- 신규 학년·학기·시험지 묶음의 예약 worker 생성, cohort 전환, 공통 prompt 결함 수정 시 반드시 `docs/rules/02_PIPELINES/JS_Archive_Scheduled_Worker_Prompt_Canonical_Template_v1.md`을 COPY SOURCE로 사용한다.
- 기존 active automation prompt는 runtime instance이지 template authority가 아니다.
- 일반화 가능한 incident는 **canonical prompt template 수정 → version bump → Notion ACTIVE/CURRENT 동기화 → 필요한 active role prompt 일괄 migration → readback** 순서로 닫는다.
- current template version: **PROMPT_TEMPLATE_V1.1.0**.
- template의 NEVER DELETE 철학: EXAM-LEVEL CONVEYOR, dedicated worker=throughput owner, THANOS=rescue/closure owner, first-refusal, one-exam max, single-writer, physical PASS authority, handoff+lease relinquish, handed-off target 자동 재점유 금지, recurring worker self-disable 금지.


## GPT VISUAL PRODUCTION CONTRACT — CURRENT

- CREATE/R1/R2/R3/THANOS에서 problem image/SVG/graph/geometry/solutionImage를 생성·수정·필요성 판정·검수할 때는 최신 main의 `.codex/skills/apmath-visual-upgrade/SKILL.md`와 `docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md`를 함께 읽는다.
- `SKILL.md`는 upstream 설계 철학이며 GPT가 Codex skill을 실제 invoke했다고 주장하는 근거가 아니다. GPT 실행 규칙은 GPT Visual Contract가 번역한다.
- local Node/Python/browser command를 실행하지 못한 경우 실행했다고 보고하지 않는다. 가능한 static/math/coordinate/owner/style audit는 계속 수행하고, 실제 render가 필요한데 실행 불가하면 정확한 NOT_RUN/NOT_VERIFIED visual debt를 남긴다.
- visual defect 하나로 whole-exam HOLD/self-disable 금지. source truth 자체가 불확정한 경우만 기존 bounded SOURCE_REPAIR_REQUIRED 경로를 사용한다.
- 전수 visual sweep에서는 qid denominator와 KEEP/POLISH/REBUILD/ADD/REMOVE/EXEMPT item ledger를 남긴다.
- MAIN/WATCHDOG는 신규 visual verdict를 만들지 않는다.

## CURRENT CUTOVER — 2026-10-03 — THANOS MASTER ×5

- 기존 `MASTER-A/B/C`와 `INFINITY-1/2`의 역할 구분은 폐기한다. 다섯 예약은 `M2-1 THANOS-MASTER-1/2/3/4/5`로 통합한다.
- THANOS-MASTER 5개는 모두 같은 **universal executor**다. 감시·관망·구조복구 전용 역할은 없다.
- CURRENT CREATE phase에서는 THANOS-MASTER 5개와 TEMP-CREATE-1/2가 모두 새 eligible CREATE target을 직접 claim할 수 있다. TEMP-CREATE가 유일 production owner라는 과거 제한은 무효다.
- CREATE 권한에는 source/content/choices/answer exact, 전 문항 fresh solution, curriculum, tags/Meta/RPM/PT·TPL/CrossConcept/Condition/IntegrationPattern/difficulty, image/SVG/solutionImage, source pixel 확인과 필요한 재크롭, deterministic repair, Golden/Negative calibration, physical evidence, actual validator/receipt, commit/push와 remote readback이 모두 포함된다.
- stage를 닫으면 보고에서 멈추지 않고 반드시 다음 durable state까지 이동한다: `CREATE_DONE→READY_FOR_REVIEW1`, `REVIEW1_DONE→READY_FOR_REVIEW2`, `REVIEW2_DONE→READY_FOR_R3`, `R3_PASS→RELEASE_QUEUE`, publish 후 `MAIN_DONE`.
- **EXAM-LEVEL CONVEYOR BELT HARD:** 전역 cohort/phase barrier는 없다. `CREATE 34/34`, `R1 34/34`, `R2 34/34`, `R3 34/34`는 다음 stage 시작 조건이 아니다. 시험지 1건이 `CREATE_DONE→READY_FOR_REVIEW1`이 되면 즉시 R1, `REVIEW1_DONE→READY_FOR_REVIEW2`면 즉시 R2, `REVIEW2_DONE→READY_FOR_R3`면 즉시 R3, `R3_PASS→RELEASE_QUEUE`면 즉시 publish/main eligible이다. 서로 다른 시험지는 동시에 서로 다른 stage에 존재하는 것이 정상이다.
- R1/R2/R3에서도 수학·정답·solution·Meta·SVG·asset·조판을 직접 수정할 수 있다. 원본 PDF/page 확인, 재추출·재크롭도 현재 실행환경에서 가능하면 직접 수행한다. 다른 executor는 capability fallback일 뿐 정책상 필수 owner가 아니다.
- PUBLISH/main도 global PUBLISH_LEASE를 획득하면 THANOS-MASTER가 직접 수행할 수 있다.
- `MASTER_LEASE v2` 명칭은 schema compatibility 때문에 유지하지만 owner 값은 `THANOS-MASTER-1~5`를 사용한다. same-target valid writer/lease 중복은 계속 금지한다.
- eligible backlog가 있는데 `WAIT`, `CREATE_PHASE_WAIT`, 관망, 문서 보고만 하고 run을 끝내지 않는다. 한 target이 막히면 exact continuation을 남기고 다음 eligible을 찾는다.
- 아래의 generic `MASTER` recovery/lease 문구는 current M2-1에서 THANOS-MASTER를 뜻한다. M3-era MASTER×3/INFINITY 제한은 HISTORY다.

## 0. 목적

JS Archive 자동화를 다음 고정 흐름으로 단순화한다.

```text
CREATE → R1 → R2 → R3 → RELEASE QUEUE → PUBLISH → MAIN_DONE
```

R3는 최종 전수검수와 함께 일반 결함의 핀포인트 수리·수정범위 재확인까지 같은 stage에서 닫는다. 현재 artifact만으로 source truth를 확정할 수 없는 경우에만 Codex Source Repair 예외 경로를 사용한다.

이 문서가 활성화되면 automation role/schedule/recheck/recovery/publish의 단일 실행 authority가 된다.
과거 3-lane, Surge, Phase A/B, existing-slot-only, persistent-thread contamination, dormant clean-slot, 감시자/조율자 계약은 HISTORY다.

## 0.1 CREATE FULL TAG/META MATERIALIZATION — HARD (2026-10-03)

형님의 2026-10-03 명시 지시: **CREATE 단계에서 모든 문항의 태그와 Meta를 전부 채운다.** R1/R2/R3는 CREATE에서 비워 둔 태그·Meta를 처음 만드는 catch-up 단계가 아니라, 이미 완성된 CREATE metadata를 source/current authority에서 다시 검증하고 필요한 오류만 교정하는 재검 단계다.

CREATE_DONE 전 각 qid는 현재 schema와 canonical authority에서 적용 가능한 metadata를 production JS 또는 해당 stage의 canonical Meta payload에 모두 물리화한다.

- 기본 분류/태그: `category`, `originalCategory`, 비어 있지 않은 `tags[]`, `level`, `difficultyBucket`
- 교육과정/L1/L2: curriculum/course, `standardCourse`, `standardUnitKey`, `standardUnit`, `standardUnitOrder`, `subUnitKey`, `subUnit`
- RPM semantic: `rpmSemanticStatus`, `rpmPrimaryPath`, `rpmL3`, `rpmL4`, `primaryMethod`, `decisiveStep`, 필요한 `semanticSourceScope / semanticScopeRelation`
- projection: `projectionStatus`와 가능한 `problemTypeKey / templateKey`; projection field가 null이면 current canonical이 허용하는 `nullReason / projectionReason`을 evidence에 명시
- 관계 Meta: `crossConceptKeys[]`, `conditionKeys[]`, `integrationPattern`
- current schema가 요구하는 confidence/boundary/evidence/provenance 필드

**결정 가능한 값을 빈칸/null/미판정으로 남기고 CREATE_DONE을 선언하는 것은 FAIL**이다. 기존 ACTIVE PT/TPL projection이 없다는 이유로 semantic Meta까지 비워 두지 않는다. RPM semantic이 결정되면 semantic은 FINAL로 채우고 projection만 `BINDING_PENDING / UNMATERIALIZED` 등 current canonical 상태로 명시한다. TRUE semantic unresolved가 남는 경우에도 암묵적 공란으로 두지 말고 현행 Meta canonical의 명시적 unresolved/hold evidence를 남긴다.

CREATE receipt/evidence는 최소 `tagMetaAuditCount=N/N`과 qid별 required-field completeness를 결속해야 한다. **R1 진입 전 CREATE tag/meta denominator는 전 문항 100%**여야 한다.

## 0.2 CREATE PRODUCER → THANOS HANDOFF — HARD (2026-10-04)

형님의 2026-10-04 명시 지시: **TEMP-CREATE의 1차 책임은 생산량 확보다. 가능한 경우 자기 run에서 CREATE closure까지 닫지만, target-local capability blocker 때문에 생산 레인 자체를 붙잡거나 끄지 않는다. 마감 debt는 THANOS가 이어받을 수 있다.**

- TEMP-CREATE-1/2/3/4는 source/content/choices/answer, 전 문항 fresh solution, tags/Meta, image/SVG/solutionImage, evidence까지 가능한 범위를 최대한 물리화하고, 실행 가능한 validator/receipt/write/readback 경로가 있으면 그대로 `CREATE_DONE→READY_FOR_REVIEW1`까지 닫는다.
- 그러나 candidate/final artifact/evidence를 만든 뒤 **Git contents/PR/Actions write, validator executor, validator receipt, CREATE receipt, remote readback, provider/tool capability** 중 하나가 current run에서 실제로 막히고 materially different safe path도 실패하면, 같은 target을 반복 점유하지 않는다.
- 이 경우 반드시 durable continuation을 남긴다: `examUid / branch+HEAD / finalArtifactSha / evidence blob / completedStep / firstMissingClosureStep / exact capability+error / required next action`. 그리고 공용 `RESCUE_QUEUE`에 CREATE closure debt로 등록하고 **same-target writer/lease/owner를 relinquish**하여 THANOS가 즉시 claim할 수 있게 한다.
- 이 handoff는 **CREATE_DONE/PASS가 아니다.** actual validator + validator receipt + CREATE receipt + remote readback이 닫힐 때까지 해당 시험지는 R1 eligible이 아니다. 그 closure는 THANOS 또는 현재 capability를 가진 executor가 이어서 수행한다.
- handoff된 target은 TEMP-CREATE가 다음 run에서 자동 재점유하지 않는다. 최신 CURRENT/RESCUE_QUEUE가 명시적으로 CREATE에 재배정하지 않는 한 **다음 scheduled run은 다른 eligible CREATE 생산으로 이동**한다.
- current run에서 해당 시험지에 이미 mutation을 만들었다면 one-exam mutation/closure max/run을 지키고, 다음 eligible의 실제 mutation은 다음 run에 한다. blocker를 mutation 전에 확인했고 현재 run mutation이 0이면 다음 eligible을 같은 run에서 선택할 수 있다.
- **target-local blocker, validator/write/tool 실패, 동일 경로 반복 방지 때문에 TEMP-CREATE 예약을 self-disable하는 것은 금지한다.** disable은 형님의 명시 지시 또는 CURRENT topology가 해당 role 종료를 선언한 경우만 허용한다.
- 따라서 역할 분담은 `TEMP-CREATE = 생산 우선 + 가능한 closure`, `THANOS = handed-off CREATE closure debt 포함 universal rescue/마감`이다.

## 0.3 R1/R2/R3 WORKER → THANOS HANDOFF — HARD (2026-10-04)

형님의 2026-10-04 명시 지시: **R1/R2/R3 전용 worker도 자기 stage의 처리량을 계속 확보해야 한다. 가능한 경우 자기 run에서 stage closure까지 닫되, target-local capability blocker 때문에 같은 시험지를 반복 점유하거나 lane을 끄지 않는다. 마감 debt는 THANOS가 이어받는다.**

- R1/R2/R3 전용 worker는 자기 stage의 full recheck, deterministic repair, evidence/validator/receipt를 가능한 범위까지 수행하고 실행 가능한 경로가 있으면 각각 `REVIEW1_DONE→READY_FOR_REVIEW2`, `REVIEW2_DONE→READY_FOR_R3`, `R3_PASS→RELEASE_QUEUE`까지 닫는다.
- 그러나 유효한 review artifact/evidence/repair 결과가 물리화된 뒤 **Git contents/PR/Actions write, validator executor, validator receipt, stage receipt, remote readback, provider/tool capability** 중 하나가 current run에서 실제로 막히고 state recheck + safe retry + materially different safe path도 실패하면 같은 target을 반복 점유하지 않는다.
- 이 경우 `stage / examUid / inputArtifactSha / branch+HEAD / finalArtifactSha / evidence/decision snapshot / completedStep / firstMissingClosureStep / exact capability+error / required next action`을 durable continuation으로 남기고 공용 `RESCUE_QUEUE`에 `R1_CLOSURE_DEBT | R2_CLOSURE_DEBT | R3_CLOSURE_DEBT`로 등록한 뒤 **same-target writer/lease/owner를 relinquish**한다.
- THANOS는 해당 handoff를 exact `firstMissingClosureStep`부터 이어받아 그 stage의 durable next state까지 닫는다. handoff 자체는 stage PASS가 아니며, 실제 validator/receipt/readback 전에는 다음 stage eligible이 아니다.
- handoff된 target은 최신 CURRENT/RESCUE_QUEUE가 `REASSIGN_TO_R1 | REASSIGN_TO_R2 | REASSIGN_TO_R3`를 명시하지 않는 한 동일 전용 worker가 다음 run에서 자동 재점유하지 않는다. **다음 scheduled run은 같은 stage의 다른 eligible 시험지**를 선택한다.
- current run에서 이미 1시험지 mutation/closure를 만들었으면 one-exam max를 지키고 다음 시험지 실제 mutation은 다음 run에 한다. blocker를 mutation 전에 확인했고 current run mutation=0이면 같은 run에서 다른 eligible을 선택할 수 있다.
- **target-local blocker, validator/write/tool/provider 실패, 동일 경로 반복 방지 때문에 R1/R2/R3 예약을 self-disable하는 것은 금지한다.** disable은 형님의 명시 지시 또는 CURRENT topology의 role 종료만 허용한다.
- R3의 source truth 자체가 current artifact로 확정 불가능한 경우는 기존 `SOURCE_REPAIR_REQUIRED` 예외를 유지한다. 이 continuation도 전용 R3 worker가 current run에서 닫지 못하면 THANOS rescue가 인수할 수 있다.
- 역할 분담은 `R1/R2/R3 worker = stage 처리량 우선 + 가능한 closure`, `THANOS = handed-off stage closure debt 포함 universal rescue/마감`이다.

## 1. CURRENT M2-1 topology — 15 lanes / THANOS MASTER ×5

| Role | Count | Responsibility |
|---|---:|---|
| THANOS MASTER | 5 | 시험지별 eligible target을 직접 claim해 생산·전수 재검·수리·validator/receipt·stage transition·publish/main까지 수행 |
| TEMP-CREATE | 2 | CREATE 전용 생산 보강. THANOS와 동급으로 새 CREATE target claim 가능 |
| R1 | 2 | R1 전용 full recheck + repair |
| R2 | 2 | R2 전용 full recheck + regression closure |
| R3 | 2 | 최종 full audit + same-stage pinpoint repair + release seal |
| MAIN-MERGE | 1 | clean release backlog publish/main |
| WATCHDOG | 1 | 15개 roster liveness/dispatch/conveyor-contract 복구 + 매시간 CURRENT 전광판 갱신 |

### 1.1 ACTIVE hourly schedule

```text
:00 THANOS-MASTER-1
:04 R1-1
:08 R2-1
:12 R3-1
:16 THANOS-MASTER-2
:20 TEMP-CREATE-1
:24 THANOS-MASTER-3
:28 MAIN-MERGE
:32 THANOS-MASTER-4
:36 R1-2
:40 R2-2
:44 R3-2
:48 TEMP-CREATE-2
:52 THANOS-MASTER-5
:56 WATCHDOG
```

모든 slot은 Asia/Seoul hourly RRULE recurring-capable schedule을 유지한다.

### 1.2 ROLE-PURE + THANOS UNIVERSAL HARD RULE

- R1/R2/R3/MAIN/TEMP-CREATE slot은 자신의 고정 역할을 유지한다.
- **THANOS-MASTER-1~5는 role-pure 제한의 예외인 universal executor**다. 별도 task 생성이나 역할 전환 없이 시험지별 current stage의 CREATE/R1/R2/R3/PUBLISH/MAIN 작업을 수행한다.
- 전역 phase-open 조건은 없다. THANOS는 **각 시험지의 직전 durable state만** 확인한다. 다른 시험지의 미완료·분모 진행률 때문에 이미 eligible인 시험지를 기다리게 해서는 안 된다.
- target 하나의 failure, stale ref, validator 실행경로 실패, claim conflict 때문에 self-disable하지 않는다. exact continuation을 남긴 뒤 다음 eligible을 찾는다.
- selector 전체에 실제 eligible target이 없을 때만 scoped `NO_WORK`를 기록할 수 있다. **eligible이 있는데 WAIT/관망 금지**다.
- same exam/stage/inputArtifactSha는 single-writer lease 1개만 허용한다. active valid owner가 있으면 그 target을 건너뛰고 다음 eligible을 찾는다.

### 1.3 THANOS peer-liveness

- canonical protected roster는 `M2-1 THANOS-MASTER-1` ~ `M2-1 THANOS-MASTER-5`다.
- 사용자 명시 중지/M2-1 종료가 아닌데 peer가 disabled이거나 recurring schedule이 drift하면 peer 또는 WATCHDOG가 복구하고 readback한다.
- 기존 `MASTER-A/B/C`, `INFINITY-1/2` 이름은 scheduler history이며 current protected roster가 아니다.

### 1.4 OPERATIONAL STATE STORAGE + REPRESENTATIVE REPORTING HARD

#### 1.4.1 Production lane state storage — Space first / no per-run Notion

- 정상 production lane인 `M2-1 THANOS-MASTER-1~5`, `TEMP-CREATE-1/2`, `R1-1/2`, `R2-1/2`, `R3-1/2`, `MAIN-MERGE`는 **매 run Notion을 직접 갱신하지 않는다.**
- primary operational display/store는 기존 ChatGPT Work/Space Page `https://chatgpt.com/space/page_d53a4d15a5508191a90730bb848a3dfb`다. 각 lane은 이 페이지의 자기 고정 섹션 `LANE CURRENT — <task title>`만 갱신하며 다른 lane 섹션이나 상단 WATCHDOG dashboard를 덮어쓰지 않는다.
- lane CURRENT는 장문 로그가 아니라 아래 7필드만 유지한다: `RESULT / TARGET / TRANSITION / PHYSICAL / DEBT / NEXT / UPDATED_KST`. 정상 예시는 `R1_DONE · o22 · READY_R1→READY_R2 · validator+receipt+remote readback PASS · debt 없음 · R2 즉시 소비 가능`처럼 한눈에 읽히게 쓴다.
- lane CURRENT는 **latest state만** 유지한다. 과거 실행 상세 history는 Git commit/blob/validator receipt/stage receipt가 authority이며 Space 페이지를 작업 로그 저장소로 비대하게 만들지 않는다.
- Space write는 production closure/readback **이후**의 운영 표시 단계다. Space write 실패는 stage verdict를 무효화하지 않으며 `SPACE_STATE_SYNC_DEBT`로만 기록한다. 다음 run/WATCHDOG가 Git physical state에서 재구성한다.
- production lane은 정상 run마다 형님에게 시간당 장문 보고를 보내지 않는다. **정상 run은 lane CURRENT 저장으로 종료**하고, 사용자 판단이 필요한 `USER_DECISION_DEBT` 또는 공장 전체 진행을 실제로 막는 복구 불능 상태일 때만 즉시 예외 보고한다.
- Notion write 실패를 production blocker로 확대하지 않는다. production lane prompt에서 per-run Notion write 의무와 “Notion last” 완료조건을 제거한다.

#### 1.4.2 WATCHDOG = sole hourly reporter + sole Notion mirror writer

- `M2-1 WATCHDOG + 전광판`은 매시 :56에 15개 ACTIVE roster의 enable, hourly RRULE, last_run freshness, conveyor prompt contract를 확인한다.
- 사용자 명시 중지나 M2-1 종료가 아닌데 OFF면 즉시 re-enable한다. enabled+정상 RRULE인데 expected occurrence를 놓쳐 last_run이 60분을 넘기고 실제 in-flight/recent durable progress가 없으면 `DISPATCH_STALL` 후보로 보고 canonical hourly RRULE을 같은 고정 분에 재결속한 뒤 readback한다.
- phase-wide `34/34` barrier, 정상 상태의 `CREATE_PHASE_WAIT`, old MASTER/INFINITY topology가 active prompt에 재유입되면 conveyor-contract drift로 보고 최신 EXAM-LEVEL CONVEYOR 계약으로 복구한다.
- WATCHDOG은 **각 lane CURRENT + 실제 Automations readback + Git physical receipt/finalArtifactSha/remote main**을 함께 읽어 한 시간 스냅샷을 만든다. lane self-report만으로 queue/stage 완료를 확정하지 않는다.
- primary direct display는 위 Work/Space Page의 **상단 WATCHDOG CURRENT dashboard**다. WATCHDOG은 상단 dashboard만 갱신하고 lane별 CURRENT 섹션은 worker-owned로 보존한다.
- durable mirror는 기존 Notion `JS Archive 예약 레인 상시 상태판 — CURRENT` `https://app.notion.com/p/3ee0e68bd69f81bdb3a9c6d81c773b7b?pvs=204` 한 페이지다. **Notion에는 WATCHDOG만 시간당 1회 동일 snapshot을 미러링한다.** 새 상태판 페이지를 만들지 않는다.
- Notion mirror 실패는 `NOTION_MIRROR_DEBT`이며 **production 영향 없음**이다. Work/Space write가 성공했다면 그 성공을 보존하고 다음 WATCHDOG에서 Notion만 재동기화한다. 반대로 어느 한 destination이라도 실패하면 dual-write 성공이라고 보고하지 않는다.
- WATCHDOG 전광판 최소 항목: 기준 KST/latest remote main, 15개 ON/OFF·schedule·last_run·raw stale/confirmed stall, current-generation CREATE/READY_R1/READY_R2/READY_R3/RELEASE/MAIN queue, 최근 1시간 실제 closure/NO_WORK/실패, active/debt target+owner, 복구 조치, 다음 1시간 우선 target.
- 확인 불가 값은 추정하지 않고 `확인 필요`로 표시한다. 오래된 snapshot/history는 historical로 명시해 아래에 둘 수 있으나 top CURRENT와 섞지 않는다.
- **형님에게 보내는 정기 시간당 공장 보고는 WATCHDOG 1개만 담당한다.** production lane의 개별 hourly narrative report는 폐기한다.
- WATCHDOG은 production exam/artifact/stage verdict를 수정하지 않는다. automation enable/schedule/prompt-contract 복구, Work/Space dashboard 갱신, Notion hourly mirror가 정상 권한이다.
- 매 run 마지막에 Work/Space Page와 Notion mirror를 각각 readback한다.

### 1.5 dispatch / capability

- critical slot은 one-shot이 아니라 RRULE recurring schedule을 사용한다.
- local 경로 하나가 실패해도 전체 capability 부재로 일반화하지 않는다. local/GitHub/Actions/Notion capability를 분리해 확인하고 materially different safe path를 시도한다.
- validator/receipt/remote readback 전에는 stage DONE을 선언하지 않는다.
- one exam mutation/closure max/run 원칙은 유지하지만, 그 한 시험지의 current stage를 닫기 위해 필요한 모든 field/asset/evidence 수정은 THANOS 권한 범위다.

## 2. Review Attempt v2 — CONTEXT-TOLERANT RECHECK

형님의 2026-10-03 명시 지시: **기존 solution·이전 verdict·checkpoint·repair detail을 이미 봤어도 검수는 유효하다.** 노출을 이유로 fresh reviewer를 새로 만들거나 attempt를 폐기하지 않는다.

재검의 신뢰성은 **정보 비노출**이 아니라 **source/current authority에서 다시 계산·판정하고 기존 verdict를 정답처럼 복사하지 않는 것**으로 정의한다.

reviewAttemptId는 최소 다음을 결속한다.

```text
stage
examUid
inputArtifactSha
attemptNo
```

정상 순서:

```text
selector
→ Golden/Negative calibration
→ target + 필요 시 prior solution/verdict/checkpoint/repair를 읽을 수 있음
→ source/current authority에서 전 문항 또는 required scope 재계산·재판정
→ decision snapshot 고정
→ prior 결과와 regression compare
→ repair/recheck/validator/receipt closure
```

- 기존 schema/validator 호환을 위해 `blindDecisionSha`, `blindFreezeSha256`, `blindDecisionFrozenBeforeR1Compare` 같은 필드명은 유지할 수 있다. **이 필드들은 이제 prior detail 비노출을 증명하지 않으며, formal compare/receipt 전에 재검 decision snapshot이 고정됐음을 뜻한다.**
- prior detail을 먼저 봤다는 이유만으로 `INVALID`, `CONTEXT_CONTAMINATED`, `FRESH_REVIEWER_REQUIRED`를 만들지 않는다.
- same worker/thread가 그대로 R1/R2/R3 또는 post-repair recheck를 끝까지 닫을 수 있다.
- 다른 reviewer/Codex를 쓰는 것은 품질상 유용할 때 선택할 수 있지만 **stage closure의 필수조건이 아니다.**
- 동일 reviewAttemptId의 continuation은 언제든 이어서 닫는다. prior compare detail을 이미 봤다는 이유로 폐기하지 않는다.

### 2.1 재검 최소 원칙

prior verdict를 본 상태에서도 최소한 다음을 자기 판단으로 다시 만든다.

- 수학/정답/solution의 핵심 계산·논리
- curriculum method
- small-board/보기·소문항 구조
- linked visual의 actual semantic parity
- Meta/RPM/CrossConcept의 required lookup
- 해당 stage가 요구하는 difficulty/runtime/layout 축

evidence의 근거는 prior PASS/FAIL 문구가 아니라 **source/current artifact/정본 lookup과 실제 재계산 결과**여야 한다.

## 3. THANOS MASTER EXECUTOR ×5

THANOS-MASTER는 형님의 운영 authority를 위임받은 universal executor다. **관찰만 하지 않고 current phase의 정상 production target과 recovery debt를 모두 직접 소비한다.**

### 3.0 selector / delivery

매 run은 latest Notion CURRENT + latest origin/main + physical receipt/branch/lease를 다시 읽고, 다음 우선순위에서 실제 mutation target 최대 1시험지를 고른다.

```text
1. 이미 next-stage eligible인 시험지의 downstream closure (R3 → R2 → R1 우선)
2. candidate / validator / receipt closure stall
3. stale SHA / ref / claim / lineage conflict
4. live stage write / validator failure
5. 새 CREATE eligible production
6. release materialization / remote parity / main debt
```

- THANOS는 새 CREATE target을 직접 claim할 수 있지만, **이미 R1/R2/R3 eligible인 시험지가 있으면 전량 CREATE 완료를 기다리지 않고 즉시 downstream을 소비**한다. stage 전용 R1/R2/R3 worker도 같은 원칙으로 자기 stage eligible 1건이 생기는 즉시 가져간다.
- stage delivery는 반드시 durable next state까지다.
  - CREATE → `CREATE_DONE / READY_FOR_REVIEW1`
  - R1 → `REVIEW1_DONE / READY_FOR_REVIEW2`
  - R2 → `REVIEW2_DONE / READY_FOR_R3`
  - R3 → 필요한 직접 수리·재확인 → `R3_PASS / RELEASE_QUEUE`
  - PUBLISH → remote main exact → `MAIN_DONE / DO_NOT_REQUEUE`
- `HANDOFF_READY`, checkpoint, 문서 기록만으로 완료를 선언하지 않는다.
- 다른 valid writer가 same target에서 실제 진행 중이면 중복 수정하지 않고 다음 eligible을 고른다.

### 3.1 full authority

THANOS-MASTER는 각 시험지의 current stage에서 필요하면 다음을 직접 수행한다.

- 새 target claim과 branch/continuation 선택
- full CREATE production: source/content/choices/answer exact, fresh solution, curriculum, tags/Meta/RPM/PT·TPL/CrossConcept/Condition/IntegrationPattern/difficulty
- image/SVG/solutionImage 제작·교정, source pixel 확인, 원본 lookup과 필요한 재크롭
- R1/R2/R3 full recheck 및 deterministic repair
- evidence/receipt materialization
- validator local/Actions execution과 safe fallback
- stale owner/claim/lease/ref/lineage 복구
- stage/owner/queue transition
- commit/push/merge, release queue 정리
- PUBLISH_LEASE 획득 후 publish/main 반영
- stage 완료 뒤 remote readback과 terminal cleanup

다른 executor/Codex는 capability상 필요한 경우 선택하는 fallback이다. **정책상 Codex만 수정 가능한 정상 결함 범위를 두지 않는다.**

### 3.2 facts / quality gates

THANOS도 다음을 위조할 수 없다.

- source truth와 실제 answer/math truth
- 실제 validator FAIL
- unresolved release debt
- unrelated production mutation
- active single-writer owner의 작업

### 3.3 MASTER_LEASE v2 schema compatibility

lease 명칭은 기존 validator/schema 호환 때문에 `MASTER_LEASE v2`를 유지한다.

```text
leaseKey = sha256(examUid + stage + inputArtifactSha)
owner = THANOS-MASTER-1 | ... | THANOS-MASTER-5 | compatible stage worker
```

- atomic claim → readback → HEAD/input SHA 재확인 → mutation 직전 CAS를 강제한다.
- ACTIVE same-key lease가 있으면 다른 THANOS는 mutation 0 후 다음 eligible을 찾는다.
- lease TTL/takeover는 기존 90분 + no-progress/no-inflight 조건을 유지한다.
- 자기 write로 HEAD가 이동하면 lease expected head를 갱신하고 계속한다.
- PUBLISH/main mutation은 전역 `PUBLISH_LEASE` singleton을 사용한다.

### 3.4 phase transition

THANOS는 stage를 닫은 후 next durable state를 기록한다. **그 순간 해당 시험지는 다음 stage에 즉시 eligible**해진다. 전체 cohort의 N/N 완료를 기다리는 phase-open 이벤트는 없다. 다음 예약자/THANOS는 직전 stage receipt + artifact SHA를 확인하고 즉시 이어받는다. 자기 stage eligible이 0일 때만 scoped `NO_WORK`가 가능하며, `CREATE_PHASE_WAIT` 같은 전역 대기 상태는 사용하지 않는다.

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

### 4.2 prior-context exposure

- prior solution/verdict/checkpoint/repair detail 노출은 **정상 review input으로 허용**하며 attempt invalidation 사유가 아니다.
- 같은 worker가 source/current authority에서 재계산·재판정한 recheck snapshot을 만든 뒤 formal compare/validator/receipt까지 계속 닫는다.
- fresh reviewer actual-start를 기다리는 상태를 만들지 않는다.
- MASTER도 “이미 봤다”를 이유로 review/repair/write/routing/publish를 거부할 수 없다.

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
- validation/recheck가 필요하면 **현재 worker가 먼저 required independent recalculation을 수행하고**, canonical validator를 실제 실행한다. remote validator가 필요할 때만 `기존 PR 검색 → 없으면 validation PR 생성 → Actions run/job → canonical validator output readback`을 사용한다.
- **Codex review actual start는 stage closure 필수조건이 아니다.** `@codex review`는 선택적 추가 검수 수단이며, 시작되지 않아도 current worker의 재계산 + canonical validator + receipt가 유효하면 stage를 닫는다.
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

R1/R2/R3 또는 아직 handoff되지 않은 same-role continuation은 새 target을 고르거나 fresh rewrite를 반복하지 않고 **그 exact candidate의 firstMissingClosureStep부터 먼저 재개**한다.

**예외 — TEMP-CREATE producer handoff:** §0.2에 따라 CREATE producer가 capability blocker를 durable continuation + RESCUE_QUEUE로 넘기고 owner/lease를 relinquish한 target은 THANOS closure debt다. 최신 CURRENT가 CREATE에 명시적으로 재배정하지 않는 한 TEMP-CREATE가 다음 run에서 그 target을 다시 집지 않고 다른 eligible CREATE를 생산한다.

one-shot 예약으로 full CREATE를 시험할 때 candidate 생성까지 시간이 오래 걸릴 가능성이 있으면, one-shot 하나에 “무조건 완결”을 가정하지 않는다. recurring production에서는 candidate 이후 closure가 current run capability로 불가능하면 §0.2 handoff를 사용하고, capable rescue owner가 exact firstMissingClosureStep부터 이어받는다.
## 5. R3 FINAL QA + FINAL REPAIR — CURRENT

R3는 별도 post-R3 repair/recheck pipeline을 정상 경로로 만들지 않는다.

```text
READY_FOR_R3
→ R3_ACTIVE
→ final full audit
→ defect 없음: R3_PASS
→ 일반 defect: 같은 R3에서 pinpoint repair
→ changed locus + direct dependency + locked scope 재확인
→ R3_PASS
→ RELEASE_QUEUE
```

- R3는 최종 전수검수자이자 **최종 핀포인트 수리 owner**다. 해설·정답·Meta·태그·SVG·라벨·조판·asset ref 등 current artifact와 current authority만으로 결함과 올바른 수정값을 확정할 수 있으면 R3가 직접 고친다.
- 직접 수리 뒤 시험지 전체 R3를 처음부터 반복하지 않는다. **변경한 qid/file/field + direct dependency + locked scope**만 다시 확인하고 같은 R3 attempt에서 PASS를 닫는다.
- `R3_FAIL_DEFERRED`, `R3_REPAIR`, `POST_REPAIR_RECHECK`, `READY_FOR_R3_RETRY`, `CODEX_INDEPENDENT_REVIEW`를 신규 정상 상태로 만들지 않는다. 기존 durable state/receipt는 legacy 호환 이력으로만 소비한다.
- **Codex Source Repair는 예외 경로**다. 원본 PDF/페이지 재확인, 원본 이미지 재추출·재크롭, 잘린 기호/도형, 누락·손상 source asset처럼 **현재 artifact만으로 source truth를 확정할 수 없는 경우에만** `SOURCE_REPAIR_REQUIRED`로 보낸다.
- Codex Source Repair 완료 뒤 별도 POST_REPAIR_RECHECK stage를 만들지 않는다. **같은 R3 continuation**으로 돌아와 repaired locus + direct dependency만 확인하고 `R3_PASS → RELEASE_QUEUE`로 닫는다.
- Source Repair queue가 상시 backlog를 갖는 것은 정상 운영이 아니다. 대부분의 R3 결함은 R3 내부에서 닫혀야 한다.

MASTER는 Source Repair queue의 stalled owner를 재기동·재배정할 수 있지만 source truth를 추측해 대신 확정하지 않는다.

## 6. R3 PASS → RELEASE QUEUE

R3 PASS는 main merge가 아니다.

R3 PASS 시 final exam/required metadata/assets/evidence/finalArtifactSha와 R3 PASS provenance를 release queue/branch에 적재한다.

R3 직접 수리 또는 Codex Source Repair continuation을 거쳤더라도 최종 `R3_PASS`가 닫히면 동일 release queue/branch로 보낸다. 과거 Codex Independent Review PASS는 legacy 호환 이력으로만 읽는다.

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
- 과거 Codex repair/recheck 결과도 보존한다. 과거 상태는 legacy 호환 이력으로 보존하되 신규 정상 경로로 생성하지 않는다.
- automation topology만 새 구조로 교체한다.
- **기존 누적 시험지/backlog migration은 별도 논의 후 확정한다.**
- activation 전 기존 GPT 예약은 OFF 유지.

## 10. 문서 버전 정책

- 이 문서 이전의 automation topology/Surge/Phase A·B/persistent-thread contamination/clean dormant slot/coordinator-monitor 계약은 HISTORY다.
- 새 worker는 HISTORY를 기본 preload하지 않는다.
- 이 문서에 임시 override를 계속 덧붙이지 않는다.
- 큰 구조 변경 시 새 버전 문서를 만들고 이전 버전 전체를 90_ARCHIVE/HISTORY로 이동한다.
