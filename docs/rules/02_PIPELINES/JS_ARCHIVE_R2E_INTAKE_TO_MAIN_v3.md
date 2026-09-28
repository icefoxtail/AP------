# JS Archive R2E Intake → Main 운영계약 v3 — Repair & Release

status: ACTIVE
effective: 2026-09-28
scope: 중2·중3 Git intake의 R1 HOLD 집계, 기존 Meta 매핑, 대상 문항 수리, 시험지별 release
supersedes: JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1.md and the interim contract-version v2 for new R2E runs

---

## 0. Upstream CREATE/R1 boundary

This contract supersedes the prior R2E release gate while retaining current CREATE/R1 and visual requirements for newly produced inputs.

### New CREATE/R1 inputs

- CREATE는 모든 source question을 읽고 student solution/visual을 작성하며, source+verified solution에서 **RPM Primary exact L3/L4 semantic path를 확정**한다.
- RPM L3/L4가 deterministic하면 semantic Meta는 FINAL이다. crosswalk/PT/TPL/binding은 이후 compatibility projection이며 부재·stale·binding gap이 semantic FINAL을 무효화하지 않는다.
- CREATE self-check와 R1 independent review는 RPM semantic judgement를 독립 검증한다. `DIRECT_BINDING_GAP/FAMILY_BINDING_GAP/RPM_ONLY`는 projection 상태로만 기록한다.
- READY_FOR_R2E의 zero-resolvable gate는 **RPM semantic unresolved=0**을 뜻한다. PT/TPL projection/binding 미완료는 `resolvablePending`, `ADVANCED_META_HOLD`, `R2_ADJUDICATION_REQUIRED`로 세지 않는다.
- 실제 source/math/RPM semantic ambiguity만 itemized semantic HOLD로 남긴다.
- visual/self-check/source/blob/denominator evidence 요구는 기존 current contract를 유지한다.
- legacy `RPM_PRIMARY_MIGRATION_GAP` enum이 필요한 receipt는 `META_ONLY` compatibility finding으로 해석한다.

The R1 receipt should keep semantic and projection summaries separate whenever the schema permits, e.g. `rpmSemanticStatus` and `projectionStatus`. Older schemas may retain legacy fields, but projection gaps must not be interpreted as semantic HOLD.

### Frozen legacy READY_FOR_R2E cohort### Frozen legacy READY_FOR_R2E cohort

The existing READY_FOR_R2E cohort present when this contract is adopted is processed from its frozen R1 authority. Its receipts, exam JS and sidecars are read-only whether Meta evidence is absent, old or current. R2E does not backfill or regenerate those sidecars, and does not reclassify normal R1 PASS rows. This compatibility path exists to aggregate and classify the legacy HOLD backlog, including existing RPM-to-L3/L4 mappings.

### Visual route

Every new or changed SVG/geometry/solutionImage uses the current visual router, including EXPECTED FACT freeze, deterministic repair/build, geometry/parity review and required independent closure for that changed visual. R2E opens only the affected question and direct dependencies; an unchanged exam does not trigger whole-exam rendering. A proven SVG defect enters SVG_REPAIR_REQUIRED and routes through the existing repair/generation lane before targeted render.

## 0. 목적

R2E의 목적은 R1 결과를 다시 전수 판정하는 것이 아니라, **동결된 시험지 cohort의 R1 HOLD를 모아 같은 원인끼리 묶고, 기존 기준으로 해결할 것은 묶음 처리하며, 남은 개별 HOLD만 상위 모델 검토로 넘기는 것**이다. 실제 학생에게 전달되는 오류는 부수적으로 발견해 영향 문항만 수리한다.

중등 L1/RPM에 연결된 기존 목록은 R2E의 매핑 authority다. 구형과 신형 R1 Meta sidecar는 동일하게 읽는다. sidecar 형식의 차이·누락은 시험지 JS release를 막지 않는다.

정상 흐름:

CREATE → READY_FOR_REVIEW → R1 → READY_FOR_R2E → R2E_IN_PROGRESS → R2E_FINAL → production commit → R2E_MAIN_FINAL

R2E_IN_PROGRESS 내부 stage:

FAST_INTEGRITY → HOLD_INVENTORY → HOLD_GROUPING → BATCH_ADJUDICATION → TARGETED_REPAIR → RELEASE_GATE

R1 결과와 시험지 원본은 authority로 보존한다. R2E는 intake branch를 수정하지 않는다. 작업 상태 authority는 remote Git commit과 machine-readable ledger/receipt다.

## 1. 세 가지 HARD RULE

### 1.1 RELEASE_BLOCKING과 META_ONLY를 분리한다

**RPM semantic FINAL과 legacy projection completeness를 분리한다.** RPM L3/L4가 FINAL인 문항의 다음 상태는 HOLD가 아니라 META_ONLY compatibility finding이다.

- `RPM_PRIMARY_MIGRATION_GAP` legacy compatibility enum
- `DIRECT_BINDING_GAP/FAMILY_BINDING_GAP`
- `RPM_ONLY`
- 기존 PT/TPL key 또는 curriculum binding의 미연결
- resolver/difficulty sidecar의 구형·누락·stale
- metadata projection/runtime/catalog의 누락 또는 stale

이들은 단독으로 R2E_FINAL/R2E_MAIN_FINAL을 차단하지 않으며 **HOLD inventory가 아니라 META_ONLY inventory**에 기록한다. projection materialization을 하지 않았다는 이유로 upper-model semantic adjudication을 열지 않는다.

RELEASE_BLOCKING은 학생에게 잘못된 JS 결과를 제공하거나 시험지 구조를 신뢰할 수 없게 만드는 finding이다. R1/RPM 계약의 BASIC_HARD_HOLD와 같은 release effect로 기록하며, 다음은 영향이 닫히기 전 시험지 release를 막는다.

- JS parse/runtime 실패, 분모·문항 순서·UID/source identity 불일치
- 필수 image/SVG 참조 누락 또는 hash/보호 필드 불일치
- source/answer/solution의 실질적인 충돌이나 수학 오류
- 학생에게 노출되는 SVG/해설의 확인된 수학적 defect
- validator가 재현한 실제 student-facing defect

모든 finding은 RELEASE_BLOCKING 또는 META_ONLY 중 하나로 분류한다. 모호한 실제 오류는 임의로 META_ONLY에 넣지 않고 item-level review로 올린다.

### 1.2 R1은 read-only authority다

Legacy R1 adapter는 시험지, receipt, .evidence.json, .meta.json을 frozen commit에서 읽기만 한다.

- R1 source JS, receipt, sidecar를 수정·재생성·정규화하지 않는다.
- 구형 receipt를 최신 sidecar schema로 backfill하지 않는다.
- 정상 R1 PASS의 풀이·difficulty·Meta를 다시 판단하거나 reproject하지 않는다.
- R1 PASS 문항의 보호 필드는 그대로 둔다.
- R1 receipt/evidence의 hash와 경로는 R2E read-only ledger에 기록한다.

R1 source identity, 시험지 경로, 분모 또는 해당 input commit을 확정할 수 없는 경우만 R1 input recovery로 분리한다. Meta sidecar/version만 빠진 것은 input recovery blocker가 아니다.

### 1.3 Batch 판정과 UID 적용 기록을 함께 보존한다

동일 원인 HOLD는 group decision 한 번으로 처리할 수 있다. 각 적용 문항은 questionUid, ordinal, groupDecisionId, 선택한 existing key 또는 repair disposition, 근거·검증 결과를 기록한다. 문항별 독립 deep review를 무조건 반복하지 않는다.

Batch에 들어가지 않는 개별 HOLD는 그 문항만 upperModelReview case로 만든다. GROUPED, REPAIRED, UPPER_MODEL_REVIEW, TRUE_HOLD 중 하나도 배정되지 않은 HOLD는 0건이어야 한다.

## 2. 권위와 입력

정본 입력 branch:

- 중2: work/intake/m2
- 중3: work/intake/m3

대상은 frozen R1 READY_FOR_R2E receipt 및 resume 가능한 work/r2e-state checkpoint다. 중1과 비정본 branch는 제외한다.

시험지 release를 위한 최소 R1 authority는 examUid, examFile, grade, totalQuestions, inputCommit 또는 검증 가능한 receipt commit lineage, sourceBlobSha, nextState다. question identity는 frozen JS의 ordinal 및 current main identity map을 통해 UID에 결속한다.

metaResolutionEvidenceRef, metaResolverContractVersion, resolver/evidence version은 선택적 Meta evidence다. 있으면 hash와 path를 기록하지만 sidecar 전체를 다시 검수하지 않는다. 없거나 검증이 실패해도 Meta-only 상태로 기록하고 R1 HOLD collection 및 JS integrity를 계속한다.

run 시작 시 work/intake/m2, work/intake/m3, work/r2e-state의 remote head를 동결한다. 완료 receipt가 있는 exam은 건너뛴다. resume checkpoint가 신규 intake보다 우선한다. 시작 뒤 도착한 R1 commit은 다음 run으로 넘긴다.

## 3. 빠른 시험지 integrity scan

모든 대상 시험지에서 다음을 빠르게 확인한다.

- JS syntax와 VM/runtime load
- questionBank 분모, ordinal, 중복 ID
- examUid, source file, questionUid 매핑
- answer/solution 존재 및 serialization 안전성
- 문제 image와 solutionImage 경로, 존재 여부, frozen hash
- protected-field parity 및 source JS와 R1 input의 drift

정상 R1 PASS의 수학·풀이·Meta 재검수는 하지 않는다. R1 PASS의 문제를 변경하지 않는다. integrity scan은 Meta completeness audit나 full render가 아니다.

## 4. HOLD inventory와 유형 분류

한 run의 frozen cohort에서 R1 HOLD/REPAIR, CREATE↔R1 conflict, flagged SVG, 실제 validator defect를 모두 수집한다. 근거를 찾을 수 없는 Meta-only 상태는 exam-level metadata note로 남기며, 임의로 문항 HOLD를 만들지 않는다.

각 item은 최소 다음 정보를 가진다.

- examUid, inputBranch, inputCommit, examFile
- questionUid, ordinal
- R1 disposition 및 원문 reason
- category, rootCauseCode, releaseEffect
- R1 receipt/evidence/visual source evidence refs와 SHA
- groupId 또는 upperModelCaseId
- batch/individual decision, UID별 적용 결과와 targeted validation

R2E_HOLD_INVENTORY_v2는 시험지 authority, item-level holds, groups, upperModelCases를 담는다. Group decision은 groupId, rootCauseCode, action, selectedExistingKeys, common rationale/evidenceRefs를 갖는다. uidApplications는 findingId, questionUid, ordinal, decisionId, appliedExistingKeys, per-UID outcome/reason/evidenceRefs를 1:1로 보관한다. 분류 요약만 있고 원문 UID·문항 연결이 없는 record는 완료로 보지 않는다.

같은 유형은 시험지 경계를 넘어 묶는다. RPM mapping의 기본 grouping dimension은 curriculum/scope, L1/L2, RPM Primary path, resolver reason, 기존 PT/TPL 후보다. SVG·JS/solution 오류는 defect field와 source fact를 기준으로 묶는다. 비슷한 문장이나 status string만 같다는 이유로 억지로 같은 group을 만들지 않는다.

## 5. 기존 L3/L4/RPM 묶음 매핑

RPM gap은 release blocker가 아니라 먼저 기존 목록을 조회할 Meta-only HOLD 유형이다.

- source + verified final solution에서 primaryMethod와 decisiveStep을 확인한다.
- 기존 중등 RPM/L3/L4 목록과 current ACTIVE PT/TPL 및 적용 가능한 binding을 조회한다.
- 기존 key가 맞으면 group decision으로 선택하고 group 내 각 UID에 동일한 decision ID와 적용 근거를 기록한다.
- 직접 binding이 다르거나 L2가 충돌하면 해당 group의 affected UID만 맞는 기존 경로로 REBIND한다.
- R2E는 신규 L3/L4를 만들지 않는다. 기존 taxonomy로 설명할 수 없는 실제 예외는 individual upperModelReview case로 보낸다.
- R1 PASS이고 매핑 defect가 없는 문항은 전혀 재분류하지 않는다.
- 개별 예외가 남아도 JS release는 META_ONLY 규칙을 적용한다.

Batch decision과 UID application은 분리된 기록이다. Batch는 유형·선택 key·공통 근거를 한 번 기록하고, UID application은 어떤 문항에 어떤 기존 key를 적용했는지 개별 추적할 수 있게 한다.

## 6. 수리 라우팅

### JS, answer, solution

수학 문항오류 검증 프로토콜과 수정프로토콜을 적용한다. source + verified solution과 충돌하는 필드만 최소 수정한다. 수정한 UID와 직접 영향 범위만 targeted validation한다.

### SVG

확인된 SVG defect는 VISUAL_HOLD에 바로 종결하지 않고 SVG_REPAIR_REQUIRED로 보낸다. Repair는 .codex/skills/apmath-visual-upgrade/SKILL.md가 라우팅하는 현재 SVG 수정·생성 경로에서 수행한다.

수정 visual의 current closure는 V1 benefit triage → source/solution EXPECTED FACT freeze → deterministic artifact repair/build → V2 artifact-only OBSERVED FACT → V3 expected/observed parity → current render-capture → independent render-review → affected UID TARGETED_RECHECK다. .codex/skills/apmath-visual-upgrade/SKILL.md, current visual rules, pipeline-core README와 AGENT_BUDGET를 따른다. R2E는 이 closure를 변경한 SVG/문항에만 적용하고, 무변경 시험지의 전체 render matrix를 다시 실행하지 않는다.

source와 해설에서 EXPECTED FACT를 동결 → 기존 SVG 수정 또는 재생성 경로 호출 → geometry/topology/label parity 검증 → 수정 문항 targeted render → JS asset 연결 및 hash 확인 순으로 처리한다. PASS면 repaired asset과 R2E receipt에 반영한다.

HOLD는 operative source recovery와 SVG 생성·수정·검증 경로를 모두 적용해도 수학적 truth를 확정할 수 없는 경우에만 허용한다. Math/SVG truth를 해소하지 못한 student-facing defect는 release-blocking 상태로 남긴다.

### Other validator findings

Validator는 실제 재현 가능한 defect와 affected UID를 보고해야 한다. 불분명한 warning, metadata 누락, 전역 catalog rebuild 요구만으로 정상 문항을 다시 열지 않는다.

## 7. Targeted verification

전체 시험지는 section 3의 fast integrity scan으로 확인한다. 다음 검증은 영향 범위에만 추가한다.

- content/answer/solution 수정: 수정 UID의 수학·답·해설 일치
- existing L3/L4 mapping: 선택 key의 ACTIVE 여부, parent/binding, UID 적용 기록
- metadata runtime consumer가 실제 영향받음: 해당 UID metadata/runtime record만 parity 확인
- SVG 변경: 해당 SVG geometry/provenance, solutionImage reference, 해당 문항 render
- 시각 영향이 없는 변경: render gate는 NOT_REQUIRED와 근거를 기록

전체 시험지 6면 render, 전 문항 resolver/difficulty 재실행, 전체 advanced Meta re-projection, 전체 runtime/catalog 재생성은 하지 않는다.

## 8. 상태와 최종 gate

R2E run은 checkpoint resume 및 사용자 보고를 위해 기존 guard/fencing 및 work/r2e-state durable branch를 유지한다.

R2E_FINAL 전 필요한 조건:

- R1 authority는 read-only로 결속됨
- 전체 denominator integrity scan PASS
- 모든 item-level R1 HOLD가 분류되어 group 또는 individual route를 가짐
- 이미 적용한 group decision은 UID별 application 누락/중복 0. 아직 adjudication 전인 META_ONLY는 UID의 group membership과 대기 상태를 보존
- releaseBlocking unresolved item 0
- 실제 수정이 있으면 해당 UID의 targeted validation PASS
- 변경 SVG가 있으면 visual geometry/parity/render PASS
- META_ONLY pending 수는 0일 필요 없음. 유형·UID·다음 처리 경로를 receipt에 기록함

R2E_FINAL은 main 반영 전 receipt다. 시험지별 최종 production commit 후 remote main ancestry와 수정 파일/필요한 UID parity를 확인하면 R2E_MAIN_FINAL로 봉인한다. intake/state branch 전체 merge, git add ., git add -A, force push는 금지한다. R2E state/evidence는 work/r2e-state에 보존하며 시험지 source branch는 수정하지 않는다.

시험지 JS release와 cohort HOLD batch closure는 별도 상태다. META_ONLY pending이 있어도 학생용 JS gate가 PASS면 해당 시험지는 R2E_FINAL/R2E_MAIN_FINAL로 닫을 수 있다. Cohort hold inventory는 모든 item이 batch decision + UID applications 또는 question-scoped upper-model case를 갖췄을 때만 holdBatchStatus=CLASSIFIED다. Upper-model pending은 CLASSIFIED 상태와 함께 남을 수 있으며 결과물은 해당 문항 case 목록이다.

## 9. 상태값

HOLD item:

- GROUP_REVIEW_REQUIRED
- MAPPED_EXISTING
- GROUP_RESOLVED
- REPAIR_REQUIRED
- REPAIRED
- VERIFIED_NO_CHANGE
- UPPER_MODEL_REVIEW
- TRUE_HOLD

releaseEffect:

- RELEASE_BLOCKING
- META_ONLY

exam release states:

- R2E_IN_PROGRESS
- R2E_FINAL
- R2E_HOLD
- INTEGRATION_PENDING
- R2E_MAIN_FINAL
- HUMAN_REQUIRED

META_ONLY pending은 R2E_FINAL/R2E_MAIN_FINAL과 함께 남을 수 있다. TRUE_HOLD/R2E_HOLD는 source truth 또는 student-facing correctness를 확정하지 못한 release blocker로 남는다.

## 10. Reopen과 legacy v1 helper

R2E_MAIN_FINAL reopen 조건은 source change, final artifact drift, 해당 UID를 직접 무효화하는 canonical/rule change, production regression, 또는 사용자 명시 지시다.

JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1.md 및 기존 snapshot.mjs/final-gate.mjs는 이미 생성된 legacy R2E artifact 복구용이다. 신규 R2E run은 본 v3 contract, repair-release-snapshot.mjs, hold-inventory.mjs, repair-release-gate.mjs를 사용한다. v1 resolver sidecar는 read-only로 소비할 수 있지만 신규 run의 gate authority가 아니다.
