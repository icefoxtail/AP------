## CURRENT — 시험지 임시 경로 2026-10-06

신규 시험지 중간물은 `.tmp/archive/`만 사용한다. 경로와 승격 정본: [Archive_Exam_Temporary_Workspace_v1](02_PIPELINES/Archive_Exam_Temporary_Workspace_v1.md). 기존 generated 정책은 `90_ARCHIVE/generated-workspace/`의 역사 자료이며 신규 출력에 적용하지 않는다.

## CURRENT — 2026-10-03 — M2-1 THANOS MASTER ×5

- automation 실행 authority: `02_PIPELINES/JS_Archive_Automation_Stable_Operating_Contract_v1.md` 최신 main.
- current scope는 **M2 1학기 34 current generation**이며 기존 MASTER-A/B/C + INFINITY-1/2는 `THANOS-MASTER-1~5`로 통합됐다.
- 5개 THANOS는 동일 권한의 universal executor다. 시험지별 eligible target claim부터 full production/recheck/repair, validator/receipt, stage transition, release/publish/main까지 수행할 수 있다.
- CREATE가 필요한 시험지는 THANOS×5와 TEMP-CREATE×2가 새 CREATE target을 잡을 수 있다. 동시에 R1/R2/R3 worker는 자기 stage eligible 시험지가 1건이라도 생기면 즉시 가져간다.
- **전역 cohort/phase barrier는 폐기한다. EXAM-LEVEL CONVEYOR BELT가 HARD다.** `CREATE_DONE→READY_FOR_REVIEW1` 즉시 R1, `REVIEW1_DONE→READY_FOR_REVIEW2` 즉시 R2, `REVIEW2_DONE→READY_FOR_R3` 즉시 R3, `R3_PASS→RELEASE_QUEUE` 즉시 publish/main으로 이어진다. 다른 시험지의 N/N 진행률은 이 흐름을 막지 않는다.
- stage closure는 다음 durable state까지 이동해야 한다. **eligible 시험지가 있는데 `CREATE_PHASE_WAIT`/phase-wide WAIT/관망/문서 보고만으로 종료하는 것을 금지한다.** 자기 stage eligible이 0일 때만 scoped `NO_WORK`를 기록하고 slot은 계속 ACTIVE로 둔다.
- single-writer `MASTER_LEASE v2`, PUBLISH_LEASE, source-truth/validator gate는 유지한다. generic MASTER 문구는 current M2-1에서 THANOS-MASTER를 뜻한다.
- M3/M1/M2 2학기/고등 legacy 예약은 OFF 유지한다.
- R1/R2/R3의 운영 개념은 **재검**이다. prior solution/verdict/repair/checkpoint가 보여도 source/current authority에서 required scope를 다시 계산·판정한다.
- R3는 최종 full audit + same-stage pinpoint repair owner다. source/image 재확인·재크롭도 THANOS가 실행환경에서 가능하면 직접 수행한다.
- **운영 상태 저장은 Space-first다.** production 14레인은 기존 Work/Space Page의 자기 `LANE CURRENT` 섹션만 갱신하고 per-run Notion write와 개별 hourly 장문 사용자 보고를 하지 않는다. Git physical receipt/validator/remote readback이 stage authority다.
- **WATCHDOG만 시간당 대표 보고 + Notion mirror를 담당한다.** 매시 :56에 15개 roster의 liveness/dispatch/conveyor-contract를 복구하고 Work/Space 상단 CURRENT를 갱신한 뒤 기존 `JS Archive 예약 레인 상시 상태판 — CURRENT`에 동일 snapshot을 1회 미러링한다. Notion mirror 실패는 production blocker가 아니다.

# JS아카이브 규칙 통합 인덱스

# JS아카이브 규칙 통합 인덱스

이 문서는 `docs/rules/`의 단일 진입점이다. 규칙 원문을 무리하게 한 파일에 복사하지 않고, 기준 원본·작업 프로토콜·검수 프로토콜·특수 규정·역사 문서를 역할별로 분리한다.

## 0. GPT 저장소 작업 선행 규칙

GPT가 이 저장소에서 분석·생성·수정·전수검수·Meta Foundation·runtime 연결 작업을 수행할 때는
**다른 작업 규칙을 읽기 전에**
`02_PIPELINES/GPT_격리작업공간_실행규칙_v1.md`를 먼저 적용한다.

기본 실행 방식은 `최신 main 고정 → repo 밖 격리 작업공간에서 완결 → 최신 main 재확인 → 최종본만 1회 Git 반영`이다.
GPT는 별도 지시 없이 작업 브랜치를 먼저 만들거나, 중간 candidate를 main/GitHub production 파일에 누적 반영하면 안 된다.
branch/PR은 사용자의 명시 지시 또는 해당 규칙의 예외 조건이 있을 때만 사용한다.

**WORKTREE / TEMP BRANCH CLEANUP HARD:** branch/worktree 예외를 사용한 경우 `remote exact 보존 → local worktree cleanup`까지 stage 종료 lifecycle에 포함한다. local HEAD와 remote HEAD가 exact하고 ACTIVE/dirty/unique-local-artifact가 없으면 main 미병합이어도 local checkout을 제거할 수 있다. 최종 `MAIN_DONE / DO_NOT_REQUEUE` owner는 stale PR과 temporary branch를 안전조건 확인 후 sweep한다. 상세 기준은 위 선행 규칙 §4.1을 따른다.

## CURRENT HARD RULE — PHYSICAL EVIDENCE BEFORE PASS (2026-10-01)

CREATE / REVIEW1 / REVIEW2 / R3의 PASS/DONE은 `03_REVIEW/JS아카이브_PHYSICAL_EVIDENCE_BEFORE_PASS_v1.md`를 통과해야 한다.

- `N/N` 숫자를 worker가 직접 적은 것만으로 검수 완료로 인정하지 않는다.
- 전 문항 qid별 physical evidence row, linked solutionImage별 visual evidence row, 전 문항 Meta evidence row가 있어야 한다.
- SVG PASS는 라벨 텍스트가 아니라 actual SVG 좌표/위상에서 expected fact를 계산한 evidence가 필요하다. `TEXT_LABEL_ONLY`는 PASS 근거가 아니다.
- source exact는 가능하면 runtime 문자열 기준으로 확인하며 doubled TeX escape를 별도 차단한다.
- ㄱ/ㄴ/ㄷ, 소문항, 경우분리 작은칠판 구조를 실제 solution block으로 확인한다.
- Meta null에는 lookup evidence + null reason이 필요하다. unique EXACT_ACTIVE mapping이 있는데 null이면 `META_NULL_BUT_RESOLVABLE` FAIL이다.
- R2는 R1 ledger가 보여도 current artifact/source authority에서 **2차 재검 evidence snapshot을 새로 만들고**, R3는 과거 stage N/N을 증거로 복사하지 않고 latest artifact bytes에서 **최종 재검 evidence를 새로 만든다**.
- 예약 run이 시간 안에 evidence를 완결하지 못하면 checkpoint만 남기고 DONE receipt를 만들지 않는다. 예약작업에 완화 규칙은 없다.
- 공용 기계 gate: `node archive/tools/review-evidence-gate.mjs --exam <js> --evidence <json> --stage CREATE|R1|R2|R3`.
- 2026-10-01 복성고1 false-PASS는 `archive/fixtures/review-negative-regressions/2026-10-01-bokseong/`의 mandatory regression fixture다.

## CURRENT HARD RULE — HOLD ADMISSION GATE / REPAIRABLE ≠ HOLD (2026-10-01)

`ITEM_HOLD` / `META_CANONICAL_HOLD`는 결함을 발견했을 때의 기본 상태가 아니라 **결정론적 수리와 정본 조회를 실제로 끝까지 수행한 뒤에도 닫을 수 없을 때만 허용되는 최후 상태**다. 작업자가 번거롭거나 현재 방법이 바로 떠오르지 않는다는 이유로 HOLD를 만들지 않는다.

### A. problem image / asset / 출판품질
- crop 경계 잘림, 학생 필기 혼입, 주변 문항 침범, 라벨 clipping, 불필요한 여백, 파일참조 오류, 단순 가독성 결함은 기본적으로 `ASSET_REPAIR_REQUIRED`이며 `ITEM_HOLD`가 아니다.
- 수리 우선순위는 **원본 픽셀이 존재하면 원본 픽셀 재크롭·정리에서 종결**한다. `결정론적 code-first 재구성`은 full-page/source pixels가 실제로 없거나 recrop까지 해도 사용 불가능한 예외 fallback에서만 허용하며, usable source crop을 대체하는 수단으로 쓰지 않는다. 그 예외 fallback으로도 source truth가 닫히지 않을 때만 HOLD다.
- 원본이 좌표그래프·기하 스케치처럼 구조적 시각자료이고, source에서 라벨·좌표·선·곡선·관계가 유일하게 동결되어 있으며 pixel-critical 인쇄 기호를 잃지 않는 경우에는 원본 사실만으로 deterministic SVG/graph reconstruction을 허용한다. 생성형 이미지로 원문을 추정·재창작하지 않는다.
- HOLD는 원본 자체가 없거나 판독 불능이고, 가능한 복원이 여러 개라 하나를 고르면 추측이 되는 경우처럼 **source truth가 실제로 비결정적일 때만** 허용한다.
- 특정 worker/runtime에서 binary crop 편집이 불편하다는 사실만으로 콘텐츠 HOLD를 만들지 않는다. 허용된 deterministic fallback으로 닫을 수 있으면 같은 stage에서 수리한다.

#### A-1. CROP COMPLETENESS ≠ SOURCE-TRUTH SUFFICIENCY — HARD

문제 이미지가 **완벽하게 넓게 잘렸는지**와 **그 문항의 source truth를 수학적으로 확정할 수 있는지**는 다른 판정이다.

- image 파일이 실제로 존재하고, 현재 crop + 발문 + 보기 + 정답 + 보이는 기하 관계만으로 정답·풀이에 필요한 결정적 사실을 유일하게 확정할 수 있으면 `ITEM_HOLD` 금지다.
- 꼭짓점 문자 하나, 선분 끝 일부, 여백, 장식, 이미 발문에 적힌 수치·관계가 crop 밖으로 조금 잘린 정도는 기본적으로 `ASSET_REPAIR_REQUIRED` 또는 `SOURCE_ASSET_OK_WITH_CROP_DEBT`다. 수학 truth가 막히지 않으면 HOLD가 아니다.
- 반대로 잘린 픽셀 안에 **정답 또는 풀이를 결정하는 유일한 수치·기호·라벨 owner·직각/평행/접선/포함 관계**가 있고, 그 사실을 다른 source 축에서 유일하게 복구할 수 없을 때만 source-visual HOLD 후보가 된다.
- 현재 worker/runtime가 full-page PDF/scan bytes를 열지 못했다는 사실 자체는 HOLD 사유가 아니다. 먼저 current main의 linked asset을 직접 읽고, 발문/보기/answer/visible geometry와 합쳐 source-truth sufficiency를 판정한다.
- `SOURCE_ASSET_MISSING`은 **참조해야 할 asset 파일 자체가 실제로 없을 때만** 쓴다. 파일이 존재하지만 crop이 좁은 경우에는 이 reason code를 쓰지 않는다.
- `SOURCE_ASSET_CROP_INCOMPLETE`는 기본적으로 repair/debt 상태이며 자동 `ITEM_HOLD` 코드가 아니다.

source visual을 HOLD로 입장시키려면 다음 네 항목을 모두 증명해야 한다.

1. `decisiveMissingFacts[]`: crop 밖으로 사라진 **결정적 source fact**가 무엇인지 구체적으로 적는다.
2. `alternateEvidenceChecked[]`: content / choices / answer / 다른 visible geometry / existing source asset에서 그 사실을 유일하게 복구할 수 없는지 확인한다.
3. `fullPageLookupResult`: full-page source를 실제로 찾았는지, 찾았는데도 판독 불능인지, 현재 runtime에서만 접근 실패인지 구분한다.
4. `whyTruthStillNonDeterministic`: repair 또는 deterministic reconstruction 후에도 왜 하나의 truth로 닫히지 않는지 적는다.

위 네 항목 중 하나라도 없으면 source-visual `ITEM_HOLD`는 무효다.

권장 분류:

```text
SOURCE_ASSET_OK
SOURCE_ASSET_OK_WITH_CROP_DEBT
ASSET_REPAIR_REQUIRED
SOURCE_TRUTH_BLOCKED   ← 이것만 ITEM_HOLD 후보
```

#### A-2. ITEM_RECOVERY는 HOLD를 상속하지 않고 다시 판정한다 — HARD

`ITEM_RECOVERY_QUEUE`에 들어왔다는 사실은 **그 HOLD가 옳다는 증거가 아니다.**

recovery worker는 held qid마다 latest main의 실제 bytes와 source/canonical을 다시 확인해 먼저 다음 중 하나로 재분류한다.

- `FALSE_HOLD_NO_REPAIR_NEEDED`: 기존 artifact만으로 truth가 충분함 → content mutation 없이 HOLD만 제거.
- `FALSE_HOLD_ASSET_REPAIR`: truth는 충분하지만 crop/가독성/파일참조 보정이 필요함 → 필요한 asset만 최소수리.
- `TRUE_HOLD_REPAIRABLE`: 실제 결함이 있으나 deterministic repair로 닫힘 → 해당 qid만 수리.
- `TRUE_HOLD_SOURCE_TRUTH_BLOCKED`: 결정적 source fact가 실제로 없고 유일복구 불가 → 그때만 Direct Replacement 후보.

upstream R1/R2의 hold reason을 그대로 실행 지시로 복사해 **모든 held qid를 무조건 수정하거나 대체하지 않는다.**
### CURRENT regression fixture — 24 금당중 중3 2학기 중간 (2026-10-01)

대상: `24_금당중_2학기_중간_중3_수학.js`.

- current main에는 source image가 22/22 실제 존재했고 R1도 `source image direct inspection=22/22`, main blob parity 22/22 exact를 기록했다.
- 그럼에도 q1/q2/q6/q9/q10/q12/q15/q17/q18/q22/q23 총 11건을 `SOURCE_ASSET_CROP_INCOMPLETE`로 HOLD 승격한 것은 **crop completeness와 source-truth sufficiency를 혼동한 과승격 사례**다.
- 예를 들어 q10/q12/q22처럼 일부 라벨·끝부분이 잘려도 발문과 visible geometry만으로 필요한 수학 truth가 이미 결정되는 문항은 HOLD가 아니다.
- 반대로 일부 문항은 실제 recrop/원본 확인이 필요할 수 있다. **정확한 true-HOLD subset은 recovery가 qid별로 다시 판정하며 11건 전체를 true HOLD로 상속하지 않는다.**
- 이 사례 이후 source-asset HOLD는 반드시 `decisiveMissingFacts[]`와 `whyTruthStillNonDeterministic`를 가져야 한다.
### B. Meta / PT·TPL / RPM projection
- `META_CANONICAL_HOLD` 전에 반드시 **source + verified final solution → RPM Primary semantic → 학년·과목 crosswalk → GLOBAL ACTIVE taxonomy/templates → exact curriculum binding/aliases**까지 조회한다.
- `RPM_ONLY`, `*_BINDING_GAP`, exact RPM L4 coverage gap 자체만으로 HOLD를 만들지 않는다.
- RPM semantic coverage가 부족하더라도 source+solution이 하나의 **GLOBAL ACTIVE problemTypeKey/templateKey + exact curriculum binding**에 유일하게 대응하면 PT/TPL은 채우고, RPM 쪽 부족은 `RPM_COVERAGE_GAP_META_ONLY` 같은 비차단 taxonomy debt로 별도 기록한다. **없는 RPM L3/L4를 임의 생성하지는 않는다.**
- TRUE Meta HOLD는 primary semantic 자체가 source/solution으로 결정되지 않거나, exhaustive lookup 뒤에도 exact ACTIVE 후보가 복수로 남거나, deterministic machine projection 자체가 실제로 존재하지 않는 경우에만 허용한다.

### C. HOLD 입장 증거
HOLD를 남기려면 ledger/receipt에 최소 다음이 있어야 한다.
- `repairAttempted`: 어떤 deterministic repair를 실제 시도했는지
- `authorityLookupAttempted`: 어떤 source/canonical/crosswalk/taxonomy/binding을 실제 조회했는지
- `whyDeterministicClosureImpossible`: 왜 현재 evidence로 유일하게 닫을 수 없는지
- `nextRequiredEvidenceOrCapability`: 무엇이 추가되면 풀리는지

이 증거가 없으면 HOLD 판정 자체가 무효이며 repair/lookup을 계속한다.

### CURRENT regression fixture — 26 매산고 고1 2학기 중간
- q12·q15·q18의 crop/필기혼입/라벨잘림을 HOLD로 보낸 것은 false HOLD다. asset repair로 직접 닫아야 한다.
- q1·q21을 ACTIVE canonical lookup을 끝까지 하지 않고 Meta HOLD로 둔 것도 false HOLD다. q1은 `PT_SET_DEFINITION / TPL_SET_IDENTIFY`, q21은 `PT_CIRCLE_EQUATION / TM_CIRCLE_INSCRIBED_ANGLE_CENTER`로 exact ACTIVE mapping이 가능하다.

### ARCHIVE GPT ARTIFACT-FIRST LIGHTWEIGHT — ACTIVE / CURRENT RECERTIFICATION (2026-09-30 META_V2)

중등 정상 시험지 생산은 `02_PIPELINES/Archive_GPT_Artifact_First_Lightweight_v1.md`를 기본 작업 방식으로 적용한다. 현재 재인증 generation은 `MIDDLE_RECERT_2026-09-30_META_V2`다.

- 재인증 scope: **M3 69 → M1 31 → M2 1학기 34 = 134시험지**. M3가 현재 선행 cohort이며 M3 stage gate가 닫히기 전 M1로 전환하지 않는다.
- M3는 **FULL_INTEGRATED_V2**와 **MAIN_PRESENT_META_ONLY** 두 트랙으로 운영한다. 정확한 현재 분모·ordinal·진행 수치는 Notion CURRENT inventory가 authority이며 Git 정본에는 고정 수치를 중복 저장하지 않는다.
- **FULL_INTEGRATED_V2:** CURRENT CREATE에서 source/content/choices/answer exact, 전 문항 fresh 작은칠판 solution, QUESTION MICRO_LAYOUT, image/SVG/solutionImage, Meta semantic, difficulty를 같은 시험지 작업에서 완료한다. REVIEW1/REVIEW2도 문제·해설·SVG·Meta를 각각 FULL 재검한다. prior 결과가 보여도 source/current authority에서 다시 판정하며 prior PASS/FAIL을 evidence로 복사하지 않는다.
- **MAIN_PRESENT_META_ONLY:** V1 REVIEW2를 통과해 main에 이미 publish되었고 current inventory에서 이 track으로 명시된 시험지만 예외다. current main의 exam/solution/SVG/image를 frozen semantic baseline으로 두고 `META_CREATE → META_REVIEW1 → META_REVIEW2 → META_PUBLISH → MAIN_META_V2`만 수행한다. content/solution/SVG는 parity만 확인하며 의미 재검수·재작성하지 않는다. drift가 발견되면 `CONTENT_DRIFT_DISCOVERED`로 FULL_INTEGRATED_V2에 재진입한다.
- FULL_INTEGRATED_V2 CREATE의 일반 문항 solution은 기존 solution 품질과 무관하게 전 문항 새 작성한다. 완료 증거는 `solutionRewrite=FULL_ALL_QUESTIONS` + `solutionRewriteCount=N/N`이며 item hold가 있으면 attempted/resolved와 held qid를 명시한다.
- Meta는 별도 후속 production pass가 아니다. source + independently verified final solution을 기준으로 L1/L2 → RPM Primary exact L3/L4 → 학년/과목 crosswalk → ACTIVE projection → CrossConcept/Condition/IntegrationPattern → difficulty current-pass 재검를 같은 CREATE/REVIEW에서 판정한다.
- CREATE/REVIEW 완료 증거에는 `metadataAudit=FULL_ALL_QUESTIONS`, `metadataAuditCount=N/N`, `difficultyAudit=FULL_ALL_QUESTIONS`, `difficultyAuditCount=N/N`과 qid별 true Meta hold를 남긴다. projection/binding 부재만으로 source/math exam HOLD를 만들지 않는다.
- 과거 CREATE_DONE/R1/R2/R2E/main 이력은 current-generation 면제권이 아니다. 동일 `MIDDLE_RECERT_2026-09-30_META_V2` receipt + final artifact SHA가 있을 때만 stage skip 근거가 된다.
- 현재 진행 중인 M2 2학기 고정 20은 META_V2 reset 대상이 아니며 기존 current REVIEW/PUBLISH tail을 완주한다.
- CREATE/REVIEW는 긴 pipeline ceremony보다 **최종 artifact 품질**에 집중한다. Golden/Negative Sample + target 원본 + 작업에 직접 필요한 정본만 먼저 읽는다.
- Git safety와 source exact, 수학 정확성, 학생용 해설, 이미지/SVG 품질, Meta/difficulty 전수 audit는 경량화 대상이 아니다.
- CURRENT R3는 **MAIN 직전 release gate이자 최종 핀포인트 수리 owner**다. REVIEW2 이후 전수 release audit을 수행하고, current artifact/current authority만으로 확정 가능한 일반 결함은 같은 R3에서 직접 수리·수정범위 재확인까지 닫는다.
- current initial R3는 긴급/고등 release와 lane-local TEMP M3 R3에 적용한다. M3 TEMP R3는 각 CREATE partition이 physical-evidence-valid CREATE 100%가 되는 즉시 독립 전환한다.
- R3에서 source truth를 current artifact만으로 확정할 수 없는 원본 PDF/페이지 재확인·재크롭·손상 source asset 예외만 `SOURCE_REPAIR_REQUIRED`로 Codex Source Repair에 보낸다. 일반 결함은 R3 내부에서 닫는다. legacy `FULL_REENTRY`가 있어도 whole-exam R1/R2 재실행으로 해석하지 않는다.
- R3 직접 수리 또는 Codex Source Repair 복귀 후에는 별도 R3_RETRY stage를 만들지 않고 **같은 R3 continuation**에서 changed/open locus + direct dependency + `R3_LOCKED` hash/diff 보존만 targeted regression 한다.

### NO EXAM PENDING / STAGE AUTHORITY CONTINUITY — CURRENT HARD RULE (2026-10-01)

CREATE / REVIEW1 / REVIEW2 / BATCH의 write recovery는 `02_PIPELINES/Archive_Authority_Write_Pending_Materialization_v1.md`의 **Stage Authority Continuity v2**를 적용한다.

- 시험지 단위 `AUTHORITY_WRITE_PENDING`, `CANDIDATE_MATERIALIZATION_PENDING`, `STAGE_REEXECUTION_REQUIRED`, `BATCH_WRITE_PENDING` 신규 생성 금지.
- candidate가 완성되면 primary authority branch 또는 recovery ref/commit/blob 중 하나에 **exact final artifact를 같은 run에서 물리 보존**한다.
- primary branch write가 막혀도 exact recovery artifact가 있으면 그 artifact 자체를 `stageArtifactRef`로 삼아 정상 `*_DONE` / `*_DONE_WITH_ITEM_HOLDS`로 stage를 닫는다.
- deterministic parts만 있으면 같은 run에서 materialize 후 바로 stage close한다. 별도 materialization pending 상태를 만들지 않는다.
- exact artifact를 만들 수 없으면 전체 pipeline rewind 없이 해당 stage만 fresh 재실행한다. 지속 `STAGE_REEXECUTION_REQUIRED` 상태는 만들지 않는다.
- Git 전체 write capability가 실제로 막힌 경우만 `GLOBAL_WRITE_CAPABILITY_BLOCKER`로 보고하며 시험지별 HOLD/PENDING을 만들지 않는다. 해당 시험지가 run을 독점하지 않으며 다른 eligible 작업은 계속한다.
- 2026-10-01 이전 PENDING 기록은 HISTORY다. exact artifact가 있으면 DONE*으로 정합화, deterministic parts면 materialize→DONE*, 둘 다 아니면 해당 stage만 재실행한다.
- downstream은 고정 branch 이름이 아니라 receipt의 `stageArtifactRef` / `finalArtifactSha`를 authority로 읽는다.

### QUESTION-LEVEL HOLD ONLY / EXAM HOLD FORBIDDEN — CURRENT HARD RULE (2026-09-29)

**CREATE / REVIEW 어느 단계에서도 일부 문항의 불확실성·source 충돌·수학 미확정·engine capability 부족을 이유로 시험지 전체를 HOLD·BLOCK·격리하지 않는다. HOLD의 최소 단위는 항상 `questionUid/qid`다.**

- 금지: `EXAM_HOLD`, `CREATE_BLOCKED`, `REVIEW1_BLOCKED`, `REVIEW2_BLOCKED`, 시험지 전체 `SOURCE_REVIEW`, 문항 결함을 이유로 한 시험지 quarantine.
- 허용: 문항별 `ITEM_HOLD` + 실제 reason code(`SOURCE_HOLD`, `MATH_HOLD`, `ENGINE_CAPABILITY_BLOCK`, `SOURCE_ASSET_MISSING` 등).
- CREATE에서 미해결 문항이 있어도 나머지 문항을 완료하고 `CREATE_DONE_WITH_ITEM_HOLDS → READY_FOR_REVIEW1_WITH_ITEM_HOLDS`로 넘긴다. CREATE 판단은 최종 판정이 아니며 REVIEW1이 held item을 다시 재판정한다.
- REVIEW1에서 남은 문항 HOLD는 `REVIEW1_DONE_WITH_ITEM_HOLDS → READY_FOR_REVIEW2_WITH_ITEM_HOLDS`로 넘기고 REVIEW2가 다시 재판정한다.
- REVIEW2 뒤에도 남으면 `REVIEW2_DONE_WITH_ITEM_HOLDS`로 stage 완료를 기록하고 held UID만 `ITEM_RECOVERY_QUEUE`에 둔다. 시험지 HOLD 상태를 만들지 않는다.
- `ITEM_RECOVERY_QUEUE`의 소비 주체는 **전용 Codex FINAL ITEM RECOVERY worker**다. 정상 REVIEW2 lane은 first-pass R2만 수행한다. Codex recovery는 HOLD 자체를 latest bytes에서 먼저 재판정하고 TRUE HOLD만 최소수리/대체한다. 전부 해결되어 `itemHoldCount=0`이면 current content-bearing flow는 `ITEM_RECOVERY_DONE → READY_FOR_R3`로 승격한다.
- BATCH/FINAL은 `itemHoldCount=0`인 시험지만 publish하고, held item이 남은 시험지는 publish pending으로 건너뛴다. 다른 시험지·lane·cohort 진행은 계속한다.
- authority/connector/Git write 실패는 시험지 상태로 남기지 않는다. exact recovery artifact를 `stageArtifactRef`로 사용해 stage를 정상 완료하고, Git 전체 write capability가 막힌 경우에만 전역 blocker로 보고한다.
- 문항 HOLD에는 최소 `qid/questionUid / reason / observedEvidence / unresolvedPoint / nextRequiredEvidenceOrCapability / createdStage / lastReviewedStage`를 남긴다.
- **단계 진행은 held item의 PASS를 의미하지 않는다. 최종 MAIN publish 전에만 해당 시험지의 `itemHoldCount=0`을 강제한다.**

CURRENT full-solution-rewrite gate도 이 규칙을 따른다. 명시적 item hold가 있으면 해당 문항만 rewrite 미완을 허용하고 `solutionRewriteAttempted=N/N`, `solutionRewriteResolved=(N-H)/N`, `itemHoldQuestionIds=[...]`를 기록한다. 이 명시적 lineage가 있는 시험지는 N/N 완료 marker가 없다는 이유만으로 CREATE 전체를 되감거나 REVIEW 진입을 막지 않는다. REVIEW1/2가 held item을 독립 재시도하여 해결 즉시 HOLD를 제거한다.

### ITEM RECOVERY HOLD REVALIDATION — CURRENT HARD RULE (2026-10-01)

- `ITEM_RECOVERY_QUEUE`는 수정 지시 목록이 아니라 **HOLD 재판정 후보 목록**이다.
- recovery worker는 latest main/current bytes에서 held qid를 먼저 재판정하고, upstream R1/R2 hold reason은 마지막 compare에서만 참고한다.
- `FALSE_HOLD_NO_REPAIR_NEEDED`면 파일 mutation 없이 HOLD만 제거한다.
- `FALSE_HOLD_ASSET_REPAIR`면 수학 truth를 다시 만들지 않고 필요한 asset만 최소수리한다.
- `TRUE_HOLD_SOURCE_TRUTH_BLOCKED`가 독립 확인된 경우에만 Direct Replacement까지 간다.
- full-page source를 현재 runtime이 못 열었다는 사실 자체는 HOLD 사유가 아니다.
- 24 금당중 중3 2학기 중간의 11개 crop HOLD는 mandatory false-HOLD regression 사례다. 11건을 그대로 상속하지 말고 qid별로 source-truth sufficiency를 다시 판정한다.
### FINAL ITEM RECOVERY / DIRECT QUESTION REPLACEMENT — CURRENT HARD RULE (2026-09-30)

REVIEW2와 수정프로토콜 이후에도 남은 held qid의 최종 복구·대체는 `02_PIPELINES/Archive_Final_Item_Direct_Replacement_v1.md`를 적용한다.

- 원본으로 deterministic repair 가능하면 해당 qid만 직접 복구한다.
- 기존 문항을 정상화할 수 없으면 **해당 qid 하나만 Codex가 직접 대체문항으로 작성**한다.
- 이 direct replacement scope에서는 ALIVE generation / pipeline-core / provider work-batch를 열지 않는다.
- 대체문항은 같은 교육과정·핵심 개념·response form·비슷한 난도/풀이 역할을 유지하고, 직접 재풀이 후에만 적용한다.
- 객관식은 보기 5개를 전수 검증하며 **③ default를 금지**한다. 현재 시험지에서 덜 쓰인 정답 위치를 우선하되 보기 자연성을 해치는 억지 배치는 금지한다.
- 숫자형 보기는 같은 표현 체계와 자연스러운 규모를 유지하고 단독 outlier를 만들지 않는다. 오답은 실제 오류 경로에서 만든다.
- 문항 교체 시 해당 qid의 Meta는 새 문제+새 solution 기준으로 fresh 재판정한다.
- non-target qid는 불변이며, current content-bearing flow의 완료 시험지는 `ITEM_RECOVERY_DONE → READY_FOR_R3`까지만 올린다. R3 PASS 전 main publish 금지다.

### ARCHIVE GOLDEN SAMPLE CALIBRATION — 공통 START HARD RULE (2026-09-28)

**Archive 2.0 / JS Archive의 분석·제작·수정·검수·해설·조판·SVG·Meta·난이도 등 품질 작업은 실제 target 작업 전에 `02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md`를 적용한다.**

기본 순서는 `현재 라우터/생명주기 → 기존 inventory 복원 → 최신 main/정본 → Golden Sample calibration → Negative Sample calibration → 실제 작업`이다.

- 해설·SVG·조판·학생용 표현 작업은 같은 학년/과목/작업유형의 고품질 실물 2~3개를 먼저 보고 품질 눈높이를 맞춘다.
- 정답·수학·difficulty·RPM/L3/L4/Meta/CrossConcept 같은 독립 의미 판정은 **target current-pass recheck decision snapshot을 만든 뒤** sample과 비교한다. sample의 정답/key/난이도를 target 판정 힌트로 사용하지 않는다.
- Golden Sample은 source/canonical authority가 아니라 quality bar다. 새 결함이 발견되면 즉시 강등할 수 있다.
- 관련 Negative Sample을 함께 보고 이미 확인된 false PASS를 반복하지 않는다.
- 학생 노출 품질과 무관한 순수 Git/manifest/기계적 정리 작업은 `EXAM_SAMPLE_NOT_APPLICABLE`로 기록할 수 있다.

### QUESTION MICRO_LAYOUT / SOURCE_TEXT_EXACT_PARITY 선행 규칙

**모든 학생 노출 JS의 발문·보기·problem asset/layout 생성·수정·검수·승격은 `01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`를 적용한다.** 축약·요약·의역·조사/수치/조건/기호 변경 금지. 신규 추출은 `SOURCE_TEXT_FREEZE → QUESTION_LAYOUT_BUILD → SOURCE_TEXT_EXACT_PARITY → QUESTION_LAYOUT_FREEZE` 순서다. CREATE/REVIEW1/REVIEW2/Past Exam/Codex/예약 작업에서 exact parity 100%와 choices exact equality 100%가 HARD gate다. AUTO가 적정하면 수동 layout override를 추가하지 않는다.

**SUBJECTIVE-2UP OVERESCALATION HARD RULE:** `grid`가 기본이다. `questionType`, `choices: []`, 서술형/단답형 표지, 소문항 존재, 긴 발문, 그림·표 존재만으로 `subjective-2up`을 자동 부여하지 않는다. 다만 **코드/정적 구조상 grid 한 칸에서 발문·이미지·표·소문항이 차지할 공간을 고려했을 때 학생 답안 작성 영역이 명백히 부족하다고 판정되는 경우**에는 실제 렌더 전이라도 `subjective-2up` 승격을 허용한다. actual render evidence 또는 사용자 명시 지시도 유효한 근거다. render 미실행 자체는 승격 금지 사유가 아니며, **정적 공간 부족 근거가 불명확할 때만** grid 유지 + `NOT_RUN_CODEX_HANDOFF`로 넘긴다. evidence 없는 기존 2up은 `SUBJECTIVE_2UP_WITHOUT_EVIDENCE` 재판정 대상이다.


### MIDDLE-SCHOOL PROBABILITY INDEPENDENCE DEFAULT — CURRENT HARD RULE (2026-09-28)

**JS Archive 중학교 확률 문항의 source interpretation에서는 독립을 기본값으로 둔다.** 여러 시행/선택의 종속 관계가 문제 성립에 필요하면 원문이 그 종속 조건·연결 규칙을 별도로 제시하는 것으로 취급한다.

- 원문에 별도 종속 조건·연결 규칙이 없다는 이유만으로 `독립이라는 말이 안 쓰였다`고 조건 부족/HOLD를 만들지 않는다.
- 중학교 확률 문항에서 별도 종속 조건이 없으면 current project convention에 따라 독립 시행/선택으로 해석하고 정상 검산한다.
- 원문이 종속 조건을 명시하면 그 조건을 그대로 적용하며 독립 기본값으로 덮어쓰지 않는다.
- `SOURCE_CONDITION_INDEPENDENCE_UNSTATED`는 중학교 문항에서 **유효한 HOLD 코드로 사용하지 않는다.**
- 실제 HOLD는 원문에 서로 충돌하는 종속 조건이 있거나, 명시된 종속 관계 자체가 불완전해 수학적 결과를 결정할 수 없는 경우처럼 **source truth가 실제로 비결정적일 때만** 허용한다.
- 기존 R1 receipt의 `SOURCE_CONDITION_INDEPENDENCE_UNSTATED`는 false source-HOLD 후보로 targeted refresh하여 제거하고, 수학/해설 전수 재검은 반복하지 않는다.

### RPM PRIMARY SEMANTIC AUTHORITY — CURRENT HARD RULE (2026-09-28)

**RPM Primary의 curriculum/scope L3/L4 semantic path가 JS Archive L3/L4 분류의 최상위 정본이다.** source + independently verified final solution에서 RPM L3/L4가 deterministic하게 확정되면 그 문항의 semantic classification은 FINAL이다.

학년/과목 crosswalk, 기존 `problemTypeKey/templateKey`, ACTIVE Pack taxonomy, curriculum binding은 **RPM semantic을 기존 Meta Foundation/runtime 소비자에 연결하는 compatibility/projection layer**다. 이 projection의 부재·stale·binding gap은 RPM semantic FINAL을 무효화하지 않는다.

- `DIRECT_ACTIVE/FAMILY_ACTIVE`: 기존 PT/TPL projection 재사용.
- `DIRECT_BINDING_GAP/FAMILY_BINDING_GAP`: RPM semantic FINAL + projection binding pending. **Meta HOLD 금지.**
- `RPM_ONLY`: RPM semantic FINAL + legacy PT/TPL projection unmateralized. **Meta HOLD 금지.**
- canonical ownerPack과 curriculum binding ownerPack이 다른 cross-pack reuse는 정상이며 conflict가 아니다.
- legacy enum `RPM_PRIMARY_MIGRATION_GAP`을 유지해야 하는 경로에서는 **META_ONLY compatibility status**로만 기록하고 REVIEW1/REVIEW2 진입·release를 차단하지 않는다.
- TRUE Meta semantic HOLD는 source/solution으로 RPM L3/L4 자체를 결정할 수 없거나, 해당 curriculum의 RPM semantic path가 실제로 없거나 모순되어 deterministic classification이 불가능한 경우에만 허용한다.

**CREATE/R1의 `resolvablePending=0`은 RPM semantic unresolved 기준이다. PT/TPL projection/binding 미완료는 resolvablePending 또는 ADVANCED_META_HOLD로 세지 않는다.**

### LEGACY — JS Archive R2E Repair & Release v3

`02_PIPELINES/JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v3.md`는 **frozen legacy READY_FOR_R2E cohort / 과거 receipt·checkpoint 복구 전용**으로 보존한다. `MIDDLE_RECERT_2026-09-30_META_V2`의 신규 CURRENT 생산 경로에는 적용하지 않는다.

- 현재 기존 시험지 경로: `CREATE → REVIEW1 → REVIEW2 → BATCH/FINAL → MAIN`.
- held qid 복구는 legacy R2E가 아니라 전용 Codex FINAL ITEM RECOVERY worker가 소비한다. 기존 REVIEW2 lane 소비 문구는 superseded다.
- 신규 CREATE/REVIEW의 Meta는 Artifact-First META_V2 통합 계약에서 같은 시험지 작업으로 처리한다.
- legacy R2E 문서의 `READY_FOR_R2E`, cohort HOLD grouping, R2E_FINAL/R2E_MAIN_FINAL은 새 CURRENT stage 이름이나 release authority로 재사용하지 않는다.

### Codex Meta Foundation 작업 선행 규칙### Codex Meta Foundation 작업 선행 규칙

Codex가 Meta Foundation 단원 정리를 수행할 때는 GPT 격리 작업 규칙의 기본 실행형을 그대로 적용하지 않고
`02_PIPELINES/CODEX_Meta_Foundation_단원정리_실행프로토콜_v1.md`를 Codex 실행 정본으로 함께 적용한다.

Codex Meta Foundation 작업은 `최신 main → 전용 branch → GOAL 완주 → checkpoint/evidence 보존 → branch 종료 → GPT 재검 → 사용자 승인 후 main`이 기본 흐름이다.
checkpoint는 사용자 승인 대기 지점이 아니며, 실제 HARD BLOCKER가 아니면 프로토콜의 DONE 조건까지 계속 진행한다.
완료 branch는 main merge 전에 GPT가 전체 diff·ledger/evidence·canonical/compiled/runtime/Archive2 parity를 재검한다.

## 1. 현재 읽기 순서

### 신규 JS 추출·변환

모든 신규·변환 작업의 독립검수·봉인·실렌더 공통 기준은
`02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`를 함께 적용한다.

여러 실행기의 공통 schema·생성 witness·최종 집계 연결은
`02_PIPELINES/공통파이프라인_실행계약_v1.md`와 `archive/tools/pipeline-core/`를 적용한다.
추출/초안 완료와 실제 문항 품질 PASS는 서로 다른 상태다.

### JS아카이브 공통 권위 구조

JS아카이브 전체 작업 OS의 권위는 다음처럼 분리한다.

- 품질·독립검수·동일 final artifact SHA·실렌더·release/seal은
  `02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`가 정본이다.
- GPT의 기본 작업공간·branch 기본값·최종 Git 적용 방식은
  `02_PIPELINES/GPT_격리작업공간_실행규칙_v1.md`가 공통 실행 정본이다.
- pipeline schema·evidence·closure 연결은
  `02_PIPELINES/공통파이프라인_실행계약_v1.md`와 `archive/tools/pipeline-core/`가 담당한다.
- agent/provider 실행 수·동시성·phase isolation·freeze·launch/recheck·retry/fallback 및
  provider 실행은 [`AGENT_BUDGET.md`](../../archive/tools/pipeline-core/AGENT_BUDGET.md)가
  유일한 실행 정본이다.
- **Meta/L3/L4 semantic 정본은 RPM Primary v1.0이다.** `01_CANONICAL/taxonomy/rpm-primary-v1.0/`의 `README.md → CANONICAL_MASTER.json → 대상 curriculum/scope view`를 source+verified solution과 함께 사용해 RPM L3/L4를 확정한다. RPM path가 deterministic하면 semantic classification은 FINAL이다.
- L1/L2의 표준단원·세부단원 authority는 기존 `표준단원키 마스터`와 `세부단원 운영규칙`이 유지한다.
- 기존 `problemTypeKey/templateKey`, ACTIVE Pack taxonomy, CrossConcept/Condition, curriculum binding은 **RPM semantic의 machine-key/compatibility projection authority**다. projection key가 존재하면 canonical-valid key만 사용하지만, projection 부재가 RPM semantic FINAL을 뒤집지 않는다.
- 강제 조회 순서는 **source+verified solution → RPM Primary L3/L4 semantic FINAL → 학년/과목 crosswalk → 기존 PT/TPL/binding projection 조회**다. crosswalk/ACTIVE는 semantic 재판정기가 아니라 projection lookup이다.
- **RPM→ACTIVE CROSSWALK STATUS:** `DIRECT_ACTIVE/FAMILY_ACTIVE`는 projection reuse, `*_BINDING_GAP`은 projection binding pending, `RPM_ONLY`는 projection unmateralized다. 뒤의 두 상태를 `ADVANCED_META_HOLD`, `R2_ADJUDICATION_REQUIRED`, semantic unresolved로 승격하지 않는다. legacy `RPM_PRIMARY_MIGRATION_GAP` enum이 필요한 경우에도 `META_ONLY` compatibility status로만 사용한다.
- canonical ownerPack과 curriculum binding ownerPack은 다를 수 있다. GLOBAL ACTIVE canonical key가 unique하고 exact curriculum binding이 별도 pack에 있으면 정상 cross-pack reuse다.
- **TRUE semantic gap/HOLD는 RPM L3/L4 자체를 deterministic하게 확정할 수 없는 경우에만 연다.** PT/TPL/binding 부재만으로 신규 taxonomy gap이나 Meta HOLD를 만들지 않는다.
- 모든 ACTIVE Meta 생성·3차검수·repair·REVIEW1/REVIEW2 폐쇄·runtime parity는 `01_CANONICAL/JS아카이브_Meta_RPM_ACTIVE_공용Resolver_계약_v1.md`와 `archive/tools/meta-foundation/rpm-active-resolver.mjs`를 공통 계약/구현으로 사용한다. 파이프라인과 skill은 자체 RPM/ACTIVE 판정 로직을 복제하지 않는다.
- 학생에게 노출되는 `solution`의 내용·표현·계산 전개·줄바꿈·기존 production 업그레이드 판정은
  `01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md`가 정본이다. 하위 해설/수정/review 문서의 과거 예시가 충돌하면 이 정본을 우선한다.
- 학생에게 노출되는 문제 `content/choices/problem image/layout`의 조판·원문 보호 authority는 `01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`다. 의미 동일 비교가 아니라 SOURCE_TEXT_EXACT_PARITY를 요구한다.
- L3/L4/CrossConcept semantic assignment의 FINAL authority는 **decision-isolated input bundle + item-level semantic evidence + deterministic validator**의 결합으로만 생성한다.
- 같은 stage의 기존 candidate/templateKey/CrossConcept suggestion/heuristic hint를 semantic decision 입력으로 사용한 결과는 구조 검사가 PASS여도 semantic authority가 아니다.
- `sourceReadStatus` 같은 모델 자기보고만으로 FINAL을 허용하지 않으며, validator 미구현·미실행 상태에서는 semantic FINAL/PASS/promotion을 금지한다.
- Middle Geometry `96e4605d` / `93bc935f` L4·CrossConcept 산출물은 `SUPERSEDED_INVALID_SEMANTIC_PROVENANCE` negative regression fixture이며 현재 authority로 사용하지 않는다.

이 실행 권위는 신규 기출 JS 추출·변환, 기존 JS 정리·업그레이드, 해설 생성·업그레이드,
visual triage, SVG 생성·검수, 독립검수, 유사문항 작업, 최종 출시·봉인에 공통 적용한다.
유사문항은 별도 manifest와 별도 seal 프로젝트라는 Common Protocol의 경계를 유지한다.
각 작업 문서는 domain-specific 품질 규칙을 계속 담당하지만, 품질 단계나 batch 이름만으로
agent launch를 추가·분할·재시도할 권한을 만들 수 없다.

### CURRENT VISUAL ROUTER — SVG / graph / geometry / solutionImage

**GPT/예약 worker 실행 정본:** `04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md`. GPT는 `.codex/skills/apmath-visual-upgrade/SKILL.md`를 upstream visual philosophy로 함께 읽되 Codex skill을 실제 실행했다고 주장하지 않는다. CREATE/R1/R2/R3/THANOS의 visual 생성·수정·검수는 GPT Contract의 triage/owner/math/style/render-debt 해석을 따른다.


기존 Archive JS가 있는 시험지의 CREATE / REVIEW1 / REVIEW2 / repair 안에서 수행하는 SVG·graph·geometry·`solutionImage` 작업은 `.codex/skills/apmath-visual-upgrade/SKILL.md`의 **`ROUTINE_EXAM_VISUAL`**을 기본 경로로 사용한다. visual 하위작업 때문에 부모 시험지 작업을 Past Exam V3, pipeline-core work batch, provider FINAL_AUDIT, U1/U2/U3, 전역 qualification으로 자동 확대하지 않는다.

ROUTINE_EXAM_VISUAL 최소 기준:
- 부모 `Archive_GPT_Artifact_First_Lightweight_v1.md` + Golden/Negative Sample + source 문제 + independently verified final solution을 먼저 본다.
- 실제 점·선·각·길이·좌표·수직·평행·접선·중점·등거리와 label owner/collision을 확인한다.
- 좌표/수치 기반 SVG는 applicable visual canonical에 따라 계산 근거를 확보하고 실제 geometry와 solution이 일치해야 한다.
- 정적/code inspection만으로 clipping·collision·owner binding·가독성을 확정할 수 없을 때만 해당 asset/question을 **targeted render**한다.
- routine per-exam visual의 목적은 **artifact를 고치는 것**이며, full pipeline-core V1/V2/V3/provider ceremony 부재 자체를 blocker로 만들지 않는다.

**SYSTEM_VISUAL**은 shared generator/validator, 공통 geometry/graph engine, 재사용 가능한 새 visual family, pipeline-core visual contract, repository-wide migration, 명시적 exhaustive qualification처럼 **시스템 자체가 작업 대상일 때만** 사용한다. 이 경우에만 공통파이프라인·적응형배치·AGENT_BUDGET·pipeline-core의 무거운 evidence/independent audit gate를 전면 적용한다.

실제 새 원본 시험지를 처음 Archive에 입고하는 **NEW_IMPORT_V3**는 `Past_Exam_V3_COMPLETE.md`의 visual lifecycle을 따른다. ROUTINE_EXAM_VISUAL의 경량 경계가 신규 import의 V3 gate를 약화하지 않는다.



1. `01_CANONICAL/JS아카이브룰북_v2.6.md`

1. `01_CANONICAL/JS아카이브룰북_v2.6.md`
2. `04_VISUAL/도형추출.md` v3.0 (도형·그래프 문항에만 적용)
3. `04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md` (집합·명제 Logic Visual qualification 전용 candidate overlay)
4. `01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
5. `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
6. **`01_CANONICAL/taxonomy/rpm-primary-v1.0/README.md`**
7. **`01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json` + 대상 curriculum/scope view**
8. **`../../archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/`의 정확한 학년/과목 crosswalk JSON**
9. `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
10. `02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md`
11. `02_PIPELINES/문제해설추출.md`
12. 필요 시 `02_PIPELINES/🤖 JS아카이브 발문·보기 추출 프로토콜 v4.md` 또는 `02_PIPELINES/JS_변환_프롬프트.md`
13. `03_REVIEW/JS아카이브_1차검수_프로토콜.md`
14. `03_REVIEW/JS아카이브_2차검수_프로토콜.md`
15. `03_REVIEW/JS아카이브_3차검수_프로토콜.md`

### 기존 JS 해설 업그레이드

기존 production 업그레이드도 `02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`의
독립검수·source conflict·실렌더·봉인 조건을 공통으로 적용한다.

1. `01_CANONICAL/JS아카이브룰북_v2.6.md`
2. `01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md`
3. 해당 단원이 도형·그래프 대상이면 `04_VISUAL/도형추출.md` v3.0
4. 기하 문항이면 `04_VISUAL/기하_시각자료_해설_독립검수_통합운영규정_v1.1_QUALIFICATION_READY.md` (visual necessity·교육용 시각화·독립 semantic review)
5. `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
6. L3/L4/CrossConcept/Condition 메타를 생성·수정·검수하는 작업이면 `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
7. `02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md`
8. `02_PIPELINES/해설프로토콜.md`
9. `02_PIPELINES/JS_문항품질_업그레이드.md`
10. 도형의방정식 대상이면 `04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` (v1.2 최소 SVG 좌표 parity 보강 부록 포함)
11. `03_REVIEW/무결성검수.md`

### 수정·최종 출시

1. `01_CANONICAL/프로젝트_컨텍스트.md`
2. `02_PIPELINES/수정프로토콜.md`
3. `02_PIPELINES/작업방식_적응형배치루프_v1.md` (현재 배치 크기·UID 중복·revision·canonical 판정 기준)
4. `02_PIPELINES/작업방식_5문항배치루프_필수.md` (legacy compatibility reference; 고위험 문항의 3~5문항 축소 루프에만 참조)
5. `03_REVIEW/JS아카이브_PHYSICAL_EVIDENCE_BEFORE_PASS_v1.md` (CREATE/R1/R2/R3 공통 PASS 증거 gate)
6. `03_REVIEW/JS아카이브_1차검수_프로토콜.md`
7. `03_REVIEW/JS아카이브_2차검수_프로토콜.md`
8. `03_REVIEW/JS아카이브_3차검수_프로토콜.md`
9. `03_REVIEW/무결성검수.md`
10. `04_VISUAL/도형추출.md` v3.0 (도형·그래프 제작·수치·style·publication)
11. 기하 문항이면 `04_VISUAL/기하_시각자료_해설_독립검수_통합운영규정_v1.1_QUALIFICATION_READY.md` (visual necessity·pedagogy·semantic independent review)
12. `04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md` (집합·명제 Logic Visual qualification 전용 candidate overlay)
13. `04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` (v1.2 최소 SVG 좌표 parity 보강 부록 포함, 해당 시)

## 2. 디렉터리별 역할

| 디렉터리 | 의미 | 현재 기준 |
|---|---|---|
| `01_CANONICAL/` | 모든 작업이 공유하는 기준 원본 | 운영 기준 |
| `02_PIPELINES/` | 추출·변환·해설·수정 실행 규칙 | 작업 종류별 적용 |
| `03_REVIEW/` | 구조·수학·메타데이터·최종 무결성 검수 | 검수 단계별 적용 |
| `04_VISUAL/` | 표·도형·그래프·SVG 제작과 검수 | 해당 문항에만 적용 |
| `05_DESIGN/` | 향후 엔진·시스템 구현 설계 | 구현 승인 전 참고 |
| `90_ARCHIVE/` | 레거시·DRAFT·대체된 이전 버전 | 현재 기준 아님 |

`02_PIPELINES/코드검사실_…통합운영프로토콜…`은 시험지 작업 전체를 조율하는 상위 운영 기준이다. 개별 추출·해설·수정 문서는 이 통합 기준의 세부 실행 모듈로 본다.

Meta Foundation은 RPM semantic taxonomy reference와 production machine-key canonical data를 분리한다.

- **선조회 semantic taxonomy:** `01_CANONICAL/taxonomy/rpm-primary-v1.0/` — `LOCKED` RPM Primary L1~L4 reference. 신규 L3/L4 또는 HOLD 판정 전에 반드시 해당 curriculum/scope를 먼저 확인한다.
- **RPM 전체 master:** `01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json`
- **RPM→ACTIVE deterministic crosswalk:** `../../archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/` — RPM path 확정 직후 exact 학년/과목 파일을 조회하는 재탐색 방지 reference. production authority 자체는 아니며 current ACTIVE 관련 row/binding으로 targeted validation한다.
- 운영규칙 정본: `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
- 실제 Meta Foundation production machine-key 정본: `../../archive/data/meta-foundation/canonical/`
- RPM path가 있는데 ACTIVE `problemTypeKey/templateKey` 또는 binding이 없는 상태는 **compatibility/projection pending**이다. semantic FINAL을 무효화하거나 Meta HOLD/release blocker로 만들지 않는다. 기존 RPM 의미를 무시하거나 임의 신규 key를 만들지 않는다.
- 대단원별 L3/L4 정본: `../../archive/data/meta-foundation/canonical/packs/`
- 공용 CrossConcept 정본: `../../archive/data/meta-foundation/canonical/concepts/`
- 전역 compiled 결과: `../../archive/data/meta-foundation/compiled/` — 기계 생성 파생본이며 직접 수정 금지
- runtime 통계·usage·audit: `../../archive/data/meta-foundation/runtime/`

Meta Foundation의 `Pack / Shard / Compiled / Ownership` 세부 계약은 Foundation 운영규칙 v1만 authoritative source로 사용한다.

좌표·점·직선·교점 등 수학적 SVG의 제작자는 `04_VISUAL/도형추출.md`의 EXPECTED FACT·좌표 모델
준비를, 독립검수자는 `04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`의 v1.2 최소
coordinate parity 부록을 함께 적용한다. render/asset PASS는 SVG geometry 수학 PASS를 대체하지 않는다.

## 3-1. 실렌더 게이트

최종 PASS·ZIP 봉인은 코드 구조나 엔진 capability 확인만으로 선언하지 않는다. 통합 프로토콜의 `REAL RENDER GATE` 순서에 따라 기준본 잠금 후 `exam / solution / answer`를 실제 브라우저에서 확인하고, 수정 후 최종 ZIP 추출본에서 세 화면을 다시 모두 확인한다.

- 필수 화면 상태: `PASS / WARN / FAIL / NOT_TESTED`
- 최종 PASS 조건: 세 필수 화면 모두 PASS + 후반 문항·마지막 페이지·MathJax·이미지 decode 확인
- `NOT_TESTED`: 1차 구조 단계에서는 기록 가능하지만 최종 PASS·봉인 불가
- `internal-review-live.html`: 사용 가능한 경우 별도 확인, 없으면 `NOT_APPLICABLE` 또는 `NOT_TESTED` 사유 기록
- 실제 증거: `reports/browser_render_check.md` 또는 동등한 캡처·출력물·렌더 로그

## 3. 기준 원본

현재 신규 작업의 기준은 다음 canonical 문서와 canonical data의 조합이다.

- `01_CANONICAL/JS아카이브룰북_v2.6.md`
- `01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
- `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
- `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
- `01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md`
- `04_VISUAL/도형추출.md` v3.0 (그래프·도형·hybrid 세부 수치와 출판 gate의 canonical source)
- `archive/data/master_tables/js_archive_tag_master.json`
- `archive/data/meta-foundation/canonical/`의 ACTIVE Pack / Concept Shard / Condition Registry

L1/L2의 실제 key와 parent는 기존 master가 정본이고, L3/L4/CrossConcept/Condition/alias/curriculum binding은 Meta Foundation canonical data가 정본이다.
`archive/data/meta-foundation/compiled/`는 ACTIVE canonical source를 합친 read-only 파생본이므로 사람이 직접 수정하지 않는다.
마스터 테이블과 Meta Foundation data는 데이터 계약이고, 룰북·운영규칙은 그 데이터를 사용하는 정책 계약이므로 하나의 거대 문서로 합치지 않는다.

## 4. 중복 규칙을 읽는 방법

추출, 해설, 품질개선 문서에는 공통적으로 수식·solution·SVG·기존 production 보호 규칙이 나타날 수 있다. 범위·보호 필드와 데이터 계약은 canonical 룰북, 독립 검수·동일 SHA·coverage·release/seal HARD gate는 Common Protocol, pipeline schema·evidence·closure 연결은 `공통파이프라인_실행계약_v1.md`와 pipeline-core, agent/provider 실행 토폴로지는 [`AGENT_BUDGET.md`](../../archive/tools/pipeline-core/AGENT_BUDGET.md)를 기준으로 한다. 작업별 pipeline과 review는 이 권위 관계를 약화할 수 없다. 배치 크기와 revision의 현재 세부 기준은 적응형 배치 문서다. 그래프 style token·sampling·출판 수치와 geometry stroke·indicator·hatching·3D·hybrid 규칙은 `04_VISUAL/도형추출.md` v3.0만 authoritative source로 사용한다.
L3/L4/CrossConcept/Condition/alias/curriculum binding 및 Pack/Shard/Compiled/Ownership 충돌은 `01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`를 우선한다.

### 4-1. 충돌 방지 고정 규칙

- 신규 `choices`에는 ①~⑤ 등 보기 번호를 넣지 않는다. 배열에는 보기 내용만 저장하고 번호 표시는 엔진이 담당한다.
- 3차 메타데이터 검수에서 문서 내부 간이 단원표·기억·과거 예시는 사용하지 않는다. `JS아카이브_표준단원키_마스터테이블.md`와 compiled master를 직접 대조하고, 둘이 불일치하면 `SOURCE_PACK_DRIFT`로 FAIL 처리한다.

## 5. 역사 문서 처리

`90_ARCHIVE/`의 문서는 삭제하지 않고 당시의 설계·판정 근거로 보존한다. 현재 작업의 규칙으로 자동 적용하지 않는다. 특히 `DRAFT`, `LEGACY snapshot`, `v1.0` 문서는 새 작업 기준이 아니다.

- `90_ARCHIVE/JS아카이브_Metadata_Contract_v2_SUPERSEDED_20260919.md`는 2026-09-16 시점의 저장계약 기록이다. 2026-09-19 Meta Foundation v1 채택으로 L3/L4·CrossConcept·Condition·alias·curriculum binding authority가 대체되었으므로 현재 운영 판정에 사용하지 않는다.

## 6. 무결성 관리

`MANIFEST.md`는 이 디렉터리의 현재 운영 문서 목록과 SHA-256을 기록한다. 문서 이동·통합 후에는 누락 파일, 오래된 경로, 해시 불일치를 확인하고 manifest를 다시 생성한다.

## 7. archive 인접 문서의 경계

다음 문서는 규칙팩에 복사하지 않고 구현 코드 옆에 유지한다.

- `../../archive/tools/README.md`: 실제 검사 도구와 실행 명령의 안내
- `../../archive/tools/past-exam-pipeline/README.md`: PDF→candidate 파이프라인 실행 안내
- `../../archive/tools/past-exam-pipeline/docs/PAST_EXAM_PIPELINE_V2_POLICY.md`: 해당 도구의 구현 정책
- `../../archive/tools/js-bank-cleanup/README.md`, `../../archive/tools/tag-enrichment/README.md`: 각 도구의 실행·출력 계약

다음 영역은 현재 규칙으로 승격하지 않는다.

- `../../.tmp/archive/`: 신규 시험지 임시 작업물(로컬 전용); 기존 generated 자료는 역사 조회 전용
- `../../archive/textbook/`: 교재 전용 파이프라인과 결과
- `../../archive/archive/docs/`: historical rulebook·구현계획·이전 설계
- `../../archive/analysis/`: 특정 작업의 분석·계획 메모

## 🚨 CURRENT — SVG SEMANTIC ANCHOR / LABEL-OWNER BINDING HARD RULE (2026-09-28)

SVG/solutionImage의 PASS는 **필요한 숫자·문구가 존재한다는 사실만으로 성립하지 않는다.**
CREATE와 모든 REVIEW 단계는 최종 SVG bytes의 실제 좌표/위상에서 다음 네 축을 독립 확인한다.

- **ANGLE_LABEL_OWNER_BINDING:** 각도 숫자/기호는 해당 꼭짓점과 두 ray가 만드는 의도한 각 영역에 귀속되어야 한다. 값이 맞아도 다른 꼭짓점·다른 각처럼 읽히는 위치면 FAIL.
- **SEGMENT_POINT_LABEL_COLLISION:** 길이·점·각 라벨은 자기 대상에 가장 자연스럽게 결속되고 서로 겹치지 않아야 한다. 점 이름과 길이값, 각도값과 선분/점 이름의 겹침은 FAIL.
- **COORDINATE_SEMANTIC_PARITY:** 외심·내심·무게중심·중점·수직·평행·등거리·합동·닮음 등 SVG가 주장하는 수학적 성질은 실제 SVG 좌표/선분/교점에서도 성립해야 한다. 설명문만 맞고 그림 좌표가 틀리면 FAIL.
- **TARGETED_RENDER_ESCALATION:** XML/좌표만으로 라벨 귀속·겹침·각 영역·clipping·가독성을 확정할 수 없으면 해당 SVG만 targeted render를 실행한다. "CODE-FIRST"는 render를 영구 생략한다는 뜻이 아니다.

시각 PASS 최소식:
`GEOMETRY_FACT_PASS && LABEL_OWNER_BINDING_PASS && LABEL_COLLISION_PASS && COORDINATE_SEMANTIC_PASS`
이며 render escalation 조건이 발생한 경우 targeted render/recheck PASS까지 필요하다.

2026-09-28 negative regression fixtures:
> **Negative Sample authority (2026-09-28 repair closure):** 아래 4건의 실패본은 `archive/fixtures/visual-negative-regressions/2026-09-28/README.md`와 같은 폴더의 frozen SVG를 사용한다. 현재 production `archive/assets/images/...` SVG는 정상 수리본이며 Negative Sample authority로 사용하지 않는다.

`24_신흥중_2학기_중간_중2_수학 q5`(각도값-꼭짓점 귀속),
`25_삼산중_2학기_기말_중2_기출 q12`(점/길이 라벨 겹침),
`25_삼산중_2학기_중간_중2_수학 q13`(D의 각도값 귀속),
`25_삼산중_2학기_중간_중2_수학 q24`(외심/수직이등분선 실제 좌표 불일치).
이 4건과 동형 결함은 향후 생성·검수에서 반드시 FAIL/REPAIR 대상으로 잡아야 한다.
