## CURRENT OVERRIDE — NORMAL-FIRST / DEFERRED R3 REENTRY (2026-10-01)

정상 1차 흐름을 R3 실패 재작업보다 우선한다.

- 아직 initial R3 판정을 받지 않은 정상 latest-R2 시험지가 있으면 그 시험지를 먼저 검수한다.
- R3 PASS는 `R3_PASS / READY_FOR_CODEX_PUBLISH`로 닫고, R3 자체는 MAIN merge를 하지 않는다.
- R3 FAIL은 기존 `failureClass` A/B/C와 `requiredRoute`를 packet에 그대로 보존하되 current 실행 상태를 `R3_FAIL_DEFERRED / DEFERRED_REENTRY_QUEUE`로 둔다.
- FAIL 직후 R1/R2 재작업을 정상 first-pass 큐보다 우선시키지 않는다. 정상 큐가 비었거나 사용자가 특정 시험지 재작업을 직접 지시한 경우에만 deferred route를 소비한다.
- initial R3 disposition은 `R3_PASS` 또는 `R3_FAIL_DEFERRED` 둘 중 하나다. FAIL은 release 실패이므로 publish 금지지만, 다른 시험지의 first-pass 진행을 막지 않는다.
- M3 initial R3 소유권은 lane-local TEMP R3-1/2/3에 있다. dedicated R3는 M3 initial R3를 중복 소비하지 않는다.
- M3 CREATE lane은 자기 mod-3 partition의 current-generation CREATE가 physical-evidence-valid DONE* 100%가 되는 즉시 다른 CREATE lane이나 M3 REVIEW2 69/69을 기다리지 않고 TEMP R3로 전환할 수 있다.
- 해당 partition의 모든 시험지가 initial R3 disposition을 가지면 그 lane은 M1 CREATE를 재개할 수 있다. deferred 실패는 별도 재작업 큐에 남고 CREATE 재개를 막지 않는다.

아래의 즉시 R1/R2 reentry 표현은 **재작업 범위(route)**를 설명하는 것으로만 읽는다. queue priority/즉시 실행 권한을 뜻하지 않는다. 이 섹션과 충돌하면 본 CURRENT OVERRIDE가 우선한다.

## CURRENT HARD RULE — POST-R3 BASELINE LOCK / TARGETED RETRY (2026-10-01)

- initial R3가 시험지 전체를 보는 마지막 전수 release audit다.
- initial R3 종료 artifact와 linked assets를 `R3_BASELINE`으로 동결한다.
- FAIL packet은 `openQids[] / openFiles[] / openFields[] / openAxes[] / directDependencies[]`를 고정한다. 그 밖은 `R3_LOCKED`다.
- legacy `FULL_REENTRY` failureClass도 whole-exam reopen 권한이 아니다. 범위를 한정할 수 없으면 `SCOPE_EXPANSION_REQUIRED`로 필요한 dependency locus만 추가한다.
- post-R3 경로는 `R3_FAIL_DEFERRED → Codex R3 Repair → Codex Independent Review → READY_FOR_R3_RETRY → GPT TARGETED R3_RETRY`다. 정상 R1/R2로 되돌리지 않는다.
- targeted R3_RETRY는 open/changed locus + direct dependency + lock 보존만 확인한다. initial R3 전수감사를 반복하지 않는다.

[JS아카이브 3차 검수 프로토콜 — MAIN 직전 Release Gate v2.0]

## CURRENT HARD RULE — PHYSICAL EVIDENCE BEFORE PASS / R3 FRESH-BYTES ONLY (2026-10-01)

R3는 `JS아카이브_PHYSICAL_EVIDENCE_BEFORE_PASS_v1.md`를 MAIN 직전 최종 release gate로 적용한다.

- **initial R3**에서는 R1/R2의 `N/N`, PASS receipt, ledger 요약을 release evidence로 사용하지 않고 latest artifact bytes에서 source/runtime/small-board/SVG actual geometry/Meta null-resolvable을 전수 fresh audit한다.
- **R3_RETRY**에서는 `R3_BASELINE`의 LOCKED PASS를 다시 감사하지 않는다. open/changed locus + direct dependency만 fresh audit하고 나머지는 hash/diff lock을 확인한다.
- `freshFromArtifactBytes=true` + `priorStageCountsUsedAsEvidence=false`가 evidence에 없으면 R3_PASS 금지.
- linked SVG는 라벨 문구가 아니라 actual primitive 좌표/위상으로 solution fact를 재계산한다.
- Meta는 null field까지 전수 resolver/canonical lookup evidence를 남긴다.
- initial R3 완료 전 `review-evidence-gate.mjs --stage R3`의 `ok=true`가 필수다. targeted R3_RETRY는 full-row validator로 전수감사를 반복하지 않고 `openScope + changedScope + lockedScopeMutationCount=0` retry evidence를 남긴다.
- 예약 시간이 부족하면 R3_PASS를 추정하지 않고 checkpoint만 남긴다.

## CURRENT HARD RULE — HOLD ADMISSION GATE / REPAIRABLE ≠ HOLD (2026-10-01)

`ITEM_HOLD` / `META_CANONICAL_HOLD`는 결함을 발견했을 때의 기본 상태가 아니라 **결정론적 수리와 정본 조회를 실제로 끝까지 수행한 뒤에도 닫을 수 없을 때만 허용되는 최후 상태**다. 작업자가 번거롭거나 현재 방법이 바로 떠오르지 않는다는 이유로 HOLD를 만들지 않는다.

### A. problem image / asset / 출판품질
- crop 경계 잘림, 학생 필기 혼입, 주변 문항 침범, 라벨 clipping, 불필요한 여백, 파일참조 오류, 단순 가독성 결함은 기본적으로 `ASSET_REPAIR_REQUIRED`이며 `ITEM_HOLD`가 아니다.
- 수리 우선순위는 **원본 픽셀 재크롭·정리 → 결정론적 code-first 재구성 → HOLD**다.
- 원본이 좌표그래프·기하 스케치처럼 구조적 시각자료이고, source에서 라벨·좌표·선·곡선·관계가 유일하게 동결되어 있으며 pixel-critical 인쇄 기호를 잃지 않는 경우에는 원본 사실만으로 deterministic SVG/graph reconstruction을 허용한다. 생성형 이미지로 원문을 추정·재창작하지 않는다.
- HOLD는 원본 자체가 없거나 판독 불능이고, 가능한 복원이 여러 개라 하나를 고르면 추측이 되는 경우처럼 **source truth가 실제로 비결정적일 때만** 허용한다.
- 특정 worker/runtime에서 binary crop 편집이 불편하다는 사실만으로 콘텐츠 HOLD를 만들지 않는다. 허용된 deterministic fallback으로 닫을 수 있으면 같은 stage에서 수리한다.

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

## SUPERSEDED / HISTORY — R3 FAILURE CLASS ROUTING (2026-10-01)

R3 FAIL 회귀 범위는 검수자 재량이 아니라 `failureClass`와 `failureCodes[]`로 결정한다. 이 규칙은 기존의 일률적인 FULL R1→FULL R2→R3 해석보다 우선한다.

### CLASS A — FULL_REENTRY
다음은 `FULL R1 → FULL R2 → R3_RETRY`다.
- source/content/choices/answer 자체 오류 또는 원본 판독 오류
- 수학적 성립성·정답 유일성·핵심 논리 오류
- protected field / UID / source identity 불일치
- multi-locus reauthoring
- defect family 영향범위를 안전하게 한정할 수 없음
- `SYSTEMIC_SCOPE_UNCERTAIN`

### CLASS B — TARGETED_R1_R2
qid와 defect family가 특정되는 curriculum/solution/visual/Meta/layout/student-language 결함은 시험지 전체 FULL 재실행을 금지한다.
`R3_FAIL → R1_TARGETED_REPAIR → R2_TARGETED_INDEPENDENT_RECHECK → R3_RETRY`
- R1은 failed qids만 수리한다.
- false PASS family는 시험지 전체 N/N scan으로 다시 연다.
- `CURRICULUM_FAIL` → 해당 qid solution 수리 + `curriculumMethodAuditCount=N/N`.
- `SOLUTION_VISUAL_MISSING`/visual necessity false PASS → 해당 qid visual 수리 + `visualNecessityAuditCount=N/N`.
- unrelated source/answer/math 전 문항 재풀이 금지.
- R2는 수리 qid를 기존 해설을 보지 않고 curriculum-constrained blind solve한 뒤 decision freeze 후 packet/repair와 비교한다.

### CLASS C — ASSET_ONLY
수학 의미·정답·solution 의미를 바꾸지 않는 순수 출판 asset 결함은 FULL R1/R2 회귀 금지.
`R3_FAIL → ASSET_OWNER_REPAIR → INDEPENDENT_ASSET_RECHECK → R3_RETRY`
예: crop 경계, clipping, 손글씨/인접 오염, label 가독성, source-neutral image polish, 파일 참조.
asset 수정이 수학 조건·label owner·좌표 의미·solution 의미를 건드리면 CLASS B 또는 A로 승격한다.

`R3_FAIL_PACKET` 필수: `failureClass`, `failedQids[]`, `failureCodes[]`, `affectedAxes[]`, `requiredRoute`, `systemicScope`, `r3InputArtifactSha`, observed/authority evidence.
`failureClass`가 없거나 안전하게 결정할 수 없으면 CLASS A.

복수 defect class가 한 시험지에 섞이면 **A > B > C** 우선순위로 exam-level `failureClass`를 정한다. `ASSET_ONLY`는 모든 unresolved defect가 C일 때만 사용한다. B+C가 섞이면 exam-level은 B이며 asset defect도 같은 targeted reentry 안에서 asset-only repair/recheck로 닫는다.

CLASS C의 별도 신규 예약은 만들지 않는다. 기존 R1 owner가 `ASSET_OWNER_REPAIR`를 **asset-only mode**로 소비하고 수학 재풀이 없이 repair한 뒤 `INDEPENDENT_ASSET_RECHECK`로 넘긴다. 기존 R2 owner는 asset-only independent recheck만 수행하고 PASS면 `R3_RETRY`로 보낸다. semantic 영향이 발견되면 B/A로 승격한다.
## SUPERSEDED / HISTORY — R3 FAILURE TRIAGE / BOUNDED REENTRY (2026-10-01)

R3는 FAIL을 직접 repair하지 않지만 모든 FAIL을 FULL R1/R2로 되돌리지도 않는다. failure를 기계적으로 분류해 packet에 고정한다.
- `FULL_REENTRY`: source/answer/math/identity/multi-locus/systemic scope 불명 → FULL R1 → FULL R2 → R3_RETRY.
- `TARGETED_R1_R2`: qid와 family가 특정되는 curriculum/solution/visual/Meta/layout/student-language → R1_TARGETED_REPAIR → R2_TARGETED_INDEPENDENT_RECHECK → R3_RETRY.
- `ASSET_ONLY`: 수학 의미를 바꾸지 않는 crop/clipping/오염/가독성/파일참조 → ASSET_OWNER_REPAIR → INDEPENDENT_ASSET_RECHECK → R3_RETRY.

검수자가 속도를 이유로 class를 낮추는 것은 금지. 애매하면 FULL_REENTRY.
매산고 회귀 fixture:
- q15·q21 교육과정 위반 → TARGETED_R1_R2 + 시험지 전체 curriculum N/N rescan.
- q8·q9·q10·q11·q14 visual necessity 누락 → TARGETED_R1_R2 + 시험지 전체 visual necessity N/N rescan.
- q12/q18 crop/오염이 수학 의미를 건드리지 않는 경우 → ASSET_ONLY.
- source symbol/answer/math 자체 오류 → FULL_REENTRY.

R3_RETRY는 어떤 class였든 latest repaired lineage에서 full release gate를 다시 수행한다. bounded되는 것은 upstream R1/R2 재작업 범위다.

## SUPERSEDED / HISTORY — R3 FAIL → R1 → R2 → R3 CLOSED LOOP (2026-10-01)

R3는 MAIN 직전 **release gate**이며 repair stage가 아니다. R3에서 학생 노출·교육과정·visual·출판·Meta·무결성 결함이 하나라도 확인되면 현재 artifact를 R3 PASS로 고쳐 닫지 않는다.

### R3 FAIL 상태
즉시 `R3_FAIL_REENTRY_REQUIRED`로 판정하고 다음 물리 packet을 저장한다.

`R3_FAIL_PACKET` 최소 필드:
- `examId`
- `r3InputArtifactSha`
- `reviewedAt`
- `failedQids[]`
- `failureCodes[]`
- `affectedAxes[]`
- 문항별 `observedEvidence`
- 대조한 curriculum/visual/Meta authority ref
- `suspectedSystemicScope`
- `protectedFieldDiffStatus`
- `requiredRoute = R1_THEN_R2_THEN_R3`

### 되돌림 순서
`R3_FAIL → R1_REOPEN → R2_REOPEN → R3_RETRY`

- **R1_REOPEN:** R3 packet을 수리 입력으로 사용한다. 결함 locus를 수리하고, false PASS가 systemic 축 누락을 뜻하면 해당 축을 시험지 전체 N/N으로 재검한다.
- **R2_REOPEN:** 새 R1 artifact를 대상으로 독립 판정을 먼저 동결한다. R3/R1 상세 내역은 blind freeze 뒤 regression compare에만 사용한다.
- **R3_RETRY:** 반드시 새 R2 artifact SHA를 입력으로 fresh release audit한다. 이전 R3 verdict는 권위가 아니다. 전체 release HARD gate를 다시 닫고, 이전 R3 failure packet의 모든 defect code가 `CLOSED`인지 마지막에 대조한다.

### 금지
- R3에서 직접 solution/SVG/image/Meta를 고쳐 바로 `R3_PASS` 선언
- R3 FAIL 후 R1만 거쳐 R3로 직행
- R3 FAIL 후 R2만 핀포인트 실행하고 R1 생략
- 이전 R3 PASS/FAIL receipt 재사용
- failure packet 없이 말로만 “R1로 되돌림”
- R3 재시도에서 과거 failure qid만 보고 전체 release gate 생략

R3가 다시 FAIL하면 새 packet을 만들고 같은 루프를 반복한다. **최신 R3 PASS + itemHoldCount=0 + 필수 release evidence**가 없으면 MAIN_READY 금지다.


## CURRENT OVERRIDE — RELEASE R3 HARD GATE (2026-10-01)

REVIEW3가 MAIN 직전 release review로 사용되는 경우, 기존 “분류·메타·난이도” 범위에 더해 **학생용 최종 artifact의 교육과정·시각자료 completeness를 독립 HARD GATE로 먼저 수행**한다. 이 gate는 중등/고등 모두 적용 가능하며, 고등 release에는 필수다.

판정 순서:
`final solution → curriculum method inventory → curriculum PASS/FAIL → visual necessity N/N → 해설/작은칠판/Meta/출판 품질`.

### Curriculum
전 문항 final solution에서 `concepts[] / formulas[] / notations[] / methods[]`를 새로 inventory하고 현재 학년·과목 curriculum authority와 직접 대조한다. `NOT_ALLOWED` 또는 허용 근거가 없는 `UNCERTAIN` 의존성이 하나라도 있으면 `CURRICULUM_FAIL`; 수학 정답이나 해설 가독성 점수로 상쇄하지 않는다.

필수 완료 marker:
- `curriculumMethodAuditCount=N/N`
- `curriculumViolationQids=[]`
- 문항별 `curriculumMethodInventory` + authority evidence

### Visual completeness
기존 visual의 정확성 검사와 별도로 전 문항 `visualNecessityAuditCount=N/N`을 수행한다. 필요한 신규 visual 누락은 `SOLUTION_VISUAL_MISSING`.

공통수학2 도형의 방정식 `H22-C2-01~04`이면 `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`를 직접 적용한다. existing SVG가 0개여도 necessity audit 분모에서 제외하지 않는다.

### Main gate
release-bound R3에서 다음 중 하나라도 성립하면 MAIN_READY 금지:
- `curriculumViolationQids` 비어 있지 않음
- unresolved `SOLUTION_VISUAL_MISSING` 존재
- 해당 시험지 publish를 막는 `itemHoldCount>0`
- 필수 N/N evidence 부재

회귀 fixture: 26 매산고 고1 2학기 중간 q15·q21 curriculum false PASS, q8·q9·q10·q11·q14 visual necessity 누락.


## CURRENT QUESTION LAYOUT HARD RULE — GRID DEFAULT / SUBJECTIVE-2UP EXCEPTION (2026-09-28)

학생 노출 문제 layout은 `01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`의 최신 규칙을 우선한다.

- **기본은 항상 `layoutTag: "grid"`다.**
- `questionType: "서술형" / "단답형" / "서논술형"`, `choices: []`, 서술형/주관식 태그, 배점, 시험지 후반 배치, `구하시오`·`과정을 서술하시오` 문구만으로 `subjective-2up`을 부여하지 않는다.
- `(1)(2)(3)` 같은 소문항 존재, 긴 발문, 그림/표 존재도 **단독 승격 근거가 아니다.**
- `subjective-2up`은 **코드/정적 구조상 grid 한 칸에서 발문·이미지·표·소문항 점유 때문에 답안 작성 공간이 명백히 부족한 STATIC_CAPACITY_EVIDENCE**, actual render evidence, 또는 사용자 명시 지시가 있을 때만 허용한다.
- render 미실행 자체는 승격 금지 사유가 아니다. 정적 공간 부족이 명확하면 2up으로 승격할 수 있다. **근거가 애매할 때만 grid 유지 + `NOT_RUN_CODEX_HANDOFF`**로 넘긴다.
- 기존 `subjective-2up`도 근거를 자동 상속하지 않는다. STATIC_CAPACITY_EVIDENCE / actual render evidence / 명시 지시가 없으면 `SUBJECTIVE_2UP_WITHOUT_EVIDENCE` / `OVERESCALATED_SUBJECTIVE_LAYOUT` 후보로 재판정한다.
- 외부 문항 공간(`grid` / `subjective-2up`)과 내부 소문항 공간 배분은 서로 다른 축이다. 소문항 구조 때문에 외부 layout을 자동 승격하지 않는다.


> **세부단원 운영 동기화(2026-08-28):** 메타데이터 검수는
> `standardUnitKey → subUnitKey → subUnit`의 parent·라벨 정합과
> `subUnitConfidence`/`subUnitClassificationDepth` 허용값, compiled master 등록 여부를 확인한다.
> 세부단원 판정은 원문·보기·정답·해설·이미지·배치 필드를 변경하지 않는 별도 메타데이터 게이트다.
> 본문에 복사한 간이 단원표·기억·과거 예시는 판정 근거로 사용하지 않고 canonical master를 직접 대조한다.
> **공용 Meta resolver 동기화(2026-09-27):** 최초 semantic 판단은 current source + verified final solution에서 `primaryMethod`/`decisiveStep`을 candidate-blind로 확정한 뒤, RPM Primary → exact grade/subject crosswalk → GLOBAL ACTIVE PT/TPL → exact binding 순으로 `archive/tools/meta-foundation/rpm-active-resolver.mjs`를 사용한다. difficulty는 독립 blind pass다.

## SUPERSEDED / LEGACY V1 ROLE SCOPE — CHECKLIST REFERENCE ONLY (2026-10-01)

아래 v1 본문의 `분류·메타·난이도 전담`, `정오답 검수는 2차` 같은 역할 제한은 **CURRENT가 아니다**. 현재 R3는 상단 CURRENT에 따라 MAIN 직전 Release Gate로서 curriculum/visual/해설/asset/Meta/무결성/출판 품질을 fresh audit하고 failureClass A/B/C를 결정한다. R3는 직접 repair하지 않는다.
아래 Meta/difficulty 체크리스트는 상단 CURRENT와 충돌하지 않는 범위에서만 보조 체크리스트로 사용한다.

너는 JS아카이브 3차 분류·메타·난이도 태그 검수 전담 엔진이다.

이번 단계의 목적은 문항이 최종 JS아카이브 데이터베이스에 들어갈 때
단원 분류, 메타데이터, questionType, tags, level 난이도 태그가 적절한지 확인하는 것이다.

중요:
- 정오답 검수는 2차에서 한다.
- 이번 단계에서는 수학 정답보다 “분류와 태그의 정확성”을 본다.
- level은 기존 값을 신뢰하지 않는다.
- level은 문제를 직접 읽고 다시 판정한다.
- Gemini가 넣은 level을 그대로 복사하지 않는다.
- category/originalCategory도 무조건 믿지 않는다.
- standardUnitKey와 standardUnit이 서로 맞는지 확인한다.

`difficultyBucket` 1~5의 상세 단계 정의·경계·blind 판정·confidence·boundary·legacy compatibility·recheck는 `docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md`를 단일 authority로 따른다. Difficulty blind evidence는 semantic L3/L4 pass와 별도 hash-bound pass이며, 기존 `level`은 bucket 판정에 사용하지 않고 fresh bucket 이후 비교만 허용한다.

==================================================
0. 입력 대상
==================================================

입력은 1차 구조 검수와 2차 수학 검수를 거친 JS아카이브 문항 데이터이다.

단, 앞 단계가 PASS가 아니어도 3차 검수를 진행할 수는 있다.
이 경우 최종 판정은 PASS가 될 수 없다.

==================================================
1. 절대 원칙
==================================================

1. 전 문항을 처음부터 끝까지 확인한다.
2. 기존 level 값을 신뢰하지 않는다.
3. 문제를 직접 읽고 level을 다시 판정한다.
4. standardUnitKey와 standardUnit의 대응을 canonical master에서 직접 확인한다.
5. standardCourse가 학년과 맞는지 확인한다.
6. questionType이 객관식/서술형과 맞는지 확인한다.
7. tags가 필요한 문항에 빠져 있지 않은지 확인한다.
8. 불필요한 tags가 들어가지 않았는지 확인한다.
9. 도형/SVG/PNG/img가 있으면 tags에 “도형” 또는 적절한 시각자료 태그가 있는지 확인한다.
10. 서술형 문항은 tags에 “서술형”이 있는지 확인한다.
11. level은 계산량만 보고 판단하지 않는다.
12. 함정 보기, 조건 해석, 개념 결합 수, 사고 전환 여부를 기준으로 판단한다.
13. 하드코딩된 간이 단원표, 과거 문서의 단원 스냅샷, 기억에 의존한 key 판정을 금지한다.

==================================================
2. standardCourse 검수
==================================================

중학교 과정:
- 중1 수학
- 중2 수학
- 중3 수학

고등학교 과정:
- 공통수학1
- 공통수학2
- 대수
- 미적분I
- 확률과 통계
- 기하
- 수학(상)
- 수학(하)
- 수학I
- 수학II

검수 항목:
- 문항 내용과 standardCourse가 맞는가
- 중3 제곱근 문항이 중2 수학으로 들어가 있지 않은가
- 중2 유리수/부등식 문항이 중3 수학으로 들어가 있지 않은가
- 고등 문항이 중학교 과정으로 들어가 있지 않은가

==================================================
3. standardUnitKey / standardUnit 검수
==================================================

[CANONICAL MASTER DIRECT LOOKUP LOCK]

판정 기준 원본:
- `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
- `archive/data/master_tables/js_archive_tag_master.json`
- 세부단원 parent·허용값은 `docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`

운영 원칙:
- 중1·중2·중3을 포함한 모든 과정의 단원 key·label·order를 위 원본에서 문항별로 직접 대조한다.
- 이 프로토콜 내부에 단원 간이표를 복사하거나 고정하지 않는다. 간이표는 master 변경 시 즉시 낡아 판정 충돌을 만든다.
- Markdown canonical master와 compiled JSON의 key·label·parent·order가 불일치하면 임의 선택하지 않고 `SOURCE_PACK_DRIFT`로 FAIL 처리한다.
- `standardCourse → standardUnitKey → standardUnit → subUnitKey → subUnit`의 전체 parent chain을 확인한다.

검수 항목:
- standardUnitKey와 standardUnit이 서로 대응하는가
- standardUnitOrder가 canonical master의 순서와 같은가
- subUnitKey가 standardUnitKey의 허용 자식인가
- subUnit 라벨이 canonical master의 라벨과 같은가
- category가 너무 넓거나 틀리게 들어가지 않았는가
- originalCategory가 이상하게 standardUnitKey처럼 들어가지 않았는가

==================================================
3-1. Meta Foundation L3/L4·관계 메타 검수
==================================================

판정 기준 원본:
- `docs/rules/01_CANONICAL/JS아카이브_Meta_RPM_ACTIVE_공용Resolver_계약_v1.md`
- `archive/tools/meta-foundation/rpm-active-resolver.mjs`
- `archive/tools/meta-foundation/validate-rpm-active-receipt.mjs`
- `docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md`
- RPM Primary `README.md` → `00_POLICY/CANONICAL_MASTER.json` → 해당 curriculum/scope view
- 정확한 학년/과목 RPM→ACTIVE crosswalk
- GLOBAL ACTIVE PT/TPL owner, current parent, exact curriculum/L1/L2 binding
- `archive/data/meta-foundation/compiled/`은 runtime/source parity 확인용 read-only 파생본

최초 판단 입력에서 기존 candidate key, CrossConcept/Condition 후보, heuristic/tag-enrichment 후보, 같은 stage 이전 reviewer verdict를 제외한다. 이를 포함한 evidence는 deterministic validator에서 `FORBIDDEN_CANDIDATE_INPUT`/`SEMANTIC_PROVENANCE_LEAKAGE`로 FAIL한다.

Resolver disposition은 `EXISTING_REUSE`, `FAMILY_REUSE`, `RPM_PRIMARY_MIGRATION_GAP`, `TRUE_TAXONOMY_GAP`, `ROUTE_OUT`만 사용한다. RPM path가 있는데 exact binding/PT/TPL이 비어 있거나 stale이면 `RPM_PRIMARY_MIGRATION_GAP`이며, 임의 key 생성이나 true taxonomy gap 처리로 바꾸지 않는다. L3/L4/CrossConcept/Condition/IntegrationPattern/difficulty 수정 후에는 같은 UID의 resolver/difficulty evidence를 다시 만들고 deterministic validator PASS receipt까지 닫는다.

신규 candidate·production 및 Foundation upgrade 완료 문항은 다음을 확인한다.
- `problemTypeKey`가 ACTIVE L3인가
- 현재 curriculum/L2와 `problemTypeKey` 사이 ACTIVE binding이 있는가
- `templateKey`가 ACTIVE이고 parentProblemTypeKey가 현재 L3와 일치하는가
- `crossConceptKeys[]`가 모두 ACTIVE CrossConcept canonical key이며 중복·alias 문자열이 없는가
- `conditionKeys[]`가 모두 ACTIVE Condition canonical key이며 중복·CrossConcept 역할 혼입이 없는가
- `integrationPattern`이 canonical enum인가
- candidate/deprecated/unregistered key가 production field에 들어가지 않았는가
- `difficultyBucket`, `difficultyConfidence`, `difficultyBoundaryFlag`, `legacyLevelCompatibility`이 difficulty v1.3 authority와 일치하는가

다음은 FAIL이다.
- `UNREGISTERED_L3`, `UNREGISTERED_L4`, `UNREGISTERED_CROSS_CONCEPT`, `UNREGISTERED_CONDITION`
- `BROKEN_L2_L3_BINDING`, `BROKEN_L4_PARENT`
- `NONCANONICAL_ALIAS_IN_JS`, `DUPLICATE_RELATIONAL_KEY`, `INVALID_INTEGRATION_PATTERN`
- canonical Pack/Shard와 compiled Foundation의 source parity 불일치
==================================================
4. questionType 검수
==================================================

[객관식]
- choices가 있음
- answer가 ①~⑤ 또는 복수 번호
- 발문이 선택형
- questionType: "객관식"

[서술형]
- choices가 []
- 풀이 과정 요구
- 직접 값을 쓰는 문항
- questionType: "서술형"

[주관식]
- choices가 []
- 단답형
- 풀이 과정 요구가 약함
- questionType: "주관식" 가능

검수 항목:
- 객관식인데 서술형으로 되어 있지 않은가
- 서술형인데 객관식으로 되어 있지 않은가
- choices가 빈 배열인데 객관식으로 되어 있지 않은가
- choices가 있는데 서술형으로 되어 있지 않은가

==================================================
5. tags 검수
==================================================

필수 태그 기준:
- 서술형 문항: tags에 "서술형"
- 도형/SVG/img/그림 문항: tags에 "도형"
- 표/table 문항: tags에 "표"
- 그래프 문항: tags에 "그래프"
- 복수정답 문항: tags에 "복수정답" 권장
- 계산 집중 문항: tags에 "계산" 선택 가능
- 개념 확인 문항: tags에 "개념" 선택 가능

검수 항목:
- 도형 문항인데 "도형" 태그가 없는가
- 서술형인데 "서술형" 태그가 없는가
- 표가 있는데 "표" 태그가 없는가
- 불필요한 태그가 들어가 있지 않은가
- tags가 배열인지 확인한다.

==================================================
6. layoutTag / wide 검수
==================================================

중요:
- layoutTag와 wide는 자동으로 과하게 판단하지 않는다.
- 특별한 지시가 없으면 layoutTag는 "grid"를 기본으로 둔다.
- wide는 특별한 대형 도형/표/그래프가 있을 때만 true를 고려한다.

검수 항목:
- layoutTag가 비어 있지 않은가
- layoutTag가 임의의 이상한 값이 아닌가
- wide가 불필요하게 true가 아닌가
- 큰 SVG/table인데 wide false로 인해 출력 위험이 있지 않은가
- 단, wide 변경은 최종 권장사항으로만 제시한다.

==================================================
7. level 난이도 태그 판정 기준
==================================================

level은 반드시 "하", "중", "상" 중 하나로 판정한다.

[하]
아래 조건에 대부분 해당하면 하로 판정한다.
- 개념 1개 직접 적용
- 계산 1~2단계
- 공식 대입형
- 보기 함정 거의 없음
- 조건 해석이 단순함
- 정답 도출 과정이 직선적임
- 초반 기본 확인 문제 수준

예:
- 단순 제곱근 정의
- 간단한 근호 계산
- 단순 유리화
- 단순 전개
- 단순 인수분해
- 개념 OX 기본형

[중]
아래 조건 중 하나 이상이 뚜렷하면 중으로 판정한다.
- 개념 2개 이상 결합
- 조건 해석 필요
- 보기별 참거짓 판단 필요
- 함정 보기가 있음
- 계산은 짧지만 사고 전환이 필요함
- 완전제곱식 조건 판단
- 정수/자연수 조건이 단순하게 포함
- 도형 길이와 근호 계산 결합
- 식 변형 후 대입
- 공통인수/인수 여부 함정
- 서술형 중간 계산형

예:
- 근호 계산 여러 항 혼합
- 도형에서 길이를 읽고 수직선에 적용
- 완전제곱식이 되도록 상수 찾기
- 인수인지 아닌지 함정 보기 판단
- 두 식을 각각 정리해 합 구하기

[상]
아래 조건 중 하나 이상이 강하면 상으로 판정한다.
- 경우의 수 전수 필요
- 정수 조건/자연수 조건이 핵심
- 범위 조건과 식 변형 결합
- 발상형 인수분해
- 단순 공식 대입으로 바로 안 풀림
- 여러 단계 구조화 필요
- 실수하면 정답 후보가 여러 개로 보임
- 내신 변별용 후반 문항 수준
- 조건을 재구성해야 풀리는 문제

예:
- 인수분해 후 소수 조건 찾기
- 연속수 곱 + 1을 제곱꼴로 변형
- $x^4-y^4$를 구조적으로 변형
- 복잡한 정수쌍 전수
- 범위 안 자연수 개수 세기 고난도

==================================================
8. level 판정 금지 기준
==================================================

- 기존 level을 그대로 복사하지 마라.
- 계산량이 적다는 이유만으로 하로 두지 마라.
- 함정 보기가 있으면 하로 쉽게 두지 마라.
- 조건 해석이 필요하면 최소 중을 고려하라.
- 정수 조건/경우의 수가 있으면 중 또는 상을 고려하라.
- 발상형 변형이 있으면 상을 고려하라.
- 서술형이라고 무조건 중/상으로 올리지 마라.
- 객관식이라고 무조건 하로 내리지 마라.

==================================================
9. 판정 기준
==================================================

[PASS]
- standardCourse 정상
- standardUnitKey/standardUnit 정상
- questionType 정상
- tags 정상
- level 적정
- category/originalCategory 큰 오류 없음

[WARN]
- 분류는 대체로 맞지만 category 정리 권장
- level 조정 권장
- tags 보강 권장
- wide/layoutTag 검토 권장

[FAIL]
- standardCourse 완전 오류
- standardUnitKey와 standardUnit 불일치
- 중3 문항이 중2 단원으로 들어감
- questionType 오류
- level이 명백히 틀림
- 도형/서술형 tags 누락이 심각함
- 메타데이터가 업로드 기준에 맞지 않음

==================================================
10. 출력 형식
==================================================

수정본 JS는 출력하지 않는다.
검수 보고만 출력한다.

[JS아카이브 3차 분류·메타·난이도 태그 검수 보고]

전체 판정: PASS / WARN / FAIL

1. 전체 요약
- 시험지명:
- 전체 문항 수:
- standardCourse 오류 문항:
- standardUnitKey/standardUnit 오류 문항:
- Meta Foundation L3/L4/binding 오류 문항:
- CrossConcept/Condition/IntegrationPattern 오류 문항:
- difficulty 4-field 오류 문항:
- questionType 오류 문항:
- tags 오류 문항:
- level 조정 권장 문항:
- 최종 업로드 가능 여부:

2. 메타데이터 오류 문항
- 번호:
- 현재 값:
- 권장 값:
- 사유:

3. level 태그 및 시각자료 재검 결과

- 번호:
- 현재 level:
- 권장 level:
- 판정: 유지 / 수정 권장
- level 사유:
- 시각자료 여부: 없음 / 표 / 도형 / 그래프 / 이미지 / SVG
- 시각자료 tags: 정상 / 보강 필요 / 해당 없음
- 시각자료 위치: 정상 / 이상 / 해당 없음

4. 문항별 최종 태그 보고

각 문항마다 아래 형식으로 쓴다.

- 번호:
- standardCourse: 정상 / 이상
- standardUnitKey: 정상 / 이상
- standardUnit: 정상 / 이상
- questionType: 정상 / 이상
- tags: 정상 / 이상
- layoutTag/wide: 정상 / 검토 필요
- level: 적정 / 수정 권장
- 최종 판정: PASS / WARN / FAIL

5. 최종 문구

반드시 마지막에 아래 문구를 그대로 적는다.

“3차 분류·메타·난이도 태그 검수 완료, 전 문항 standardUnit/태그/level 재판정 완료”

==================================================
11. 금지
==================================================

- 정오답 검수와 섞지 마라.
- 기존 level을 그대로 복사하지 마라.
- category만 보고 standardUnitKey를 추정하지 마라.
- 문제를 읽지 않고 level을 판정하지 마라.
- 일부 문항만 보고 전체 PASS라고 하지 마라.
- 수정본 JS를 출력하지 마라.

## 2026-09-28 CURRENT HARD GATE — SVG LABEL-OWNER / COORDINATE SEMANTIC REVIEW

REVIEW3에서 SVG/solutionImage를 확인할 때 **"필요한 숫자와 문구가 들어 있다"는 이유만으로 PASS 금지**다.
모든 연결 visual은 `도형추출.md`와 `기하_시각자료_해설_독립검수_통합운영규정_v1.1_QUALIFICATION_READY.md`의 2026-09-28 addendum을 적용한다.

필수 확인:
- 각도 숫자/기호가 정확한 꼭짓점과 두 ray의 의도한 각 영역에 귀속되는가.
- 길이 라벨이 정확한 선분에 결속되고 점/각/다른 길이 라벨과 겹치지 않는가.
- 점 라벨이 해당 vertex/node에 명확히 귀속되는가.
- 외심·내심·무게중심·중점·수직·평행·등거리·합동·닮음 등 설명문이 실제 SVG 좌표/위상에서도 성립하는가.
- XML/좌표만으로 label owner, overlap, wedge membership, clipping을 확정할 수 없으면 해당 SVG targeted render를 실행하는가.

최소 PASS 축:
`GEOMETRY_FACT_PASS / LABEL_OWNER_BINDING_PASS / LABEL_COLLISION_PASS / COORDINATE_SEMANTIC_PASS`.

회귀 기준으로 다음 4건과 동형 결함을 반드시 적발한다:
> **Negative Sample authority (2026-09-28 repair closure):** 아래 4건의 실패본은 `archive/fixtures/visual-negative-regressions/2026-09-28/README.md`와 같은 폴더의 frozen SVG를 사용한다. 현재 production `archive/assets/images/...` SVG는 정상 수리본이며 Negative Sample authority로 사용하지 않는다.

`24 신흥중 중2 중간 q5`, `25 삼산중 중2 기말 q12`, `25 삼산중 중2 중간 q13`, `25 삼산중 중2 중간 q24`.
