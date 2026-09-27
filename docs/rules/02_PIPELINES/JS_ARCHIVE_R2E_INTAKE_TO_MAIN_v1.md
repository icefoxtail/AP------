# JS Archive R2E Intake → Main 운영계약 v2

> **QUESTION MICRO_LAYOUT / SOURCE_TEXT_EXACT_PARITY HARD RULE — ACTIVE 2026-09-28**
> CREATE/R1/R2E가 학생 노출 `content/choices/problem image/layout`을 다루면 `docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`를 적용한다. 발문 축약·요약·의역 금지. CREATE/R1은 전 문항 exact parity를 닫고 R2E는 evidence/drift/render를 final integrity로 확인한다.


status: ACTIVE
effective: 2026-09-28
scope: 중등 JS Archive CREATE/R1 intake 및 Codex R2E 최종 폐쇄
supersedes-for-new-intake: REVIEW2 → Library REVIEW_DONE/APPLY_PACKET → E/Apply Bridge 기본 흐름

contract-version: v2
compatibility-path: 이 파일명은 기존 호출부 호환을 위해 v1 경로를 유지하지만 내용 authority는 v2다.

> **CREATE/R1 ZERO-RESOLVABLE HARD RULE — 2026-09-28**
>
> - CREATE는 Meta 후보만 남기는 단계가 아니다. 현재 RPM/ACTIVE authority로 결정 가능한 L3/L4/CrossConcept/difficulty와 exact materialization/repair patch를 적극 반영한다.
> - R1은 CREATE 결과를 독립 재판정하고 틀린 Meta를 직접 수정한다.
> - READY_FOR_R2E 전에 `resolvablePending = 0`, deterministic binding/materialization gap = 0, 안전한 existing-reuse 가능 RPM_ONLY = 0이어야 한다.
> - 해결 방법이 이미 확정된 `RPM_PRIMARY_MIGRATION_GAP`을 R2E로 넘기는 것은 R1 종료 계약 위반이다.
> - R2E는 신규 taxonomy 필요성, 비결정적 semantic conflict, source hard hold, multi-exam semantic cluster처럼 CREATE/R1에서 실제로 닫을 수 없는 adjudication만 deep review한다.
> - **R2E HOLD-SAFE + CURRENT VISUAL ROUTE HARD RULE:** full evidence·허용 repair를 소진해도 안전한 판단이 불가능하면 `R2E_HOLD`로 보존한다. HOLD 0을 만들기 위한 추측 FINAL을 금지한다. R1/R2E의 SVG 생성·재생성·수학적 수정은 `.codex/skills/apmath-visual-upgrade/SKILL.md`가 라우팅하는 current ruleset과 pipeline-core closure를 실제로 적용한다.
> - **CREATE VISUAL FIRST-BUILD HARD RULE:** CREATE도 동일한 current visual router/ruleset을 **처음 제작부터** 적용한다. visual 필요 문항을 나중 R1/R2E 보완 대상으로 의도적으로 미루지 않는다.

---

## 0. 목적과 최상위 계약

현재 중등 JS Archive의 표준 생산·최종폐쇄 흐름을 다음으로 고정한다.

```text
CREATE
→ READY_FOR_REVIEW
→ R1
→ READY_FOR_R2E
→ Codex R2E
→ R2E_FINAL
→ production integration
→ R2E_MAIN_FINAL
```

새 중2·중3 생산은 Library ZIP을 stage handoff authority로 사용하지 않는다.
**remote Git commit + machine-readable receipt/ledger**가 작업 상태 authority다.

과거 `READY_FOR_REVIEW2 → REVIEW2/CLOSED_FOR_APPLY → Library REVIEW_DONE/APPLY_PACKET → E`
흐름은 삭제하지 않고 **LEGACY ONLY**로 보존한다.
이미 봉인된 legacy artifact 복구 또는 사용자가 특정 legacy packet 처리를 명시한 경우에만 사용한다.

사용자 최신 명시 지시가 본 문서보다 우선한다.

---

## 1. 학년별 intake authority

### 중2

- branch: `work/intake/m2`
- producer: 예약 레인 A/B/C/D
- CREATE와 R1 결과를 시험지별 독립 commit으로 누적한다.

### 중3

- branch: `work/intake/m3`
- producer: 중3 2학기 F/G/H/I + 중3 1학기 J/K/L/M
- CREATE와 R1 결과를 시험지별 독립 commit으로 누적한다.

### 중1

중1 B01~B31 통합 폐쇄는 현재 일회성 별도 프로젝트다.

- input authority: `work/m1-b01-b31-r2e`
- 중1은 중2·중3 자동 intake에 섞지 않는다.

### 비정본 branch

초기 실험용 `work/intake/m2-a`, `m2-b`, `m2-c`, `m2-d`,
`work/intake/m3-2-*`, `work/intake/m3-1-*`는 R2E input authority가 아니다.

---

## 2. 상태기계

정상 상태:

```text
CREATE
READY_FOR_REVIEW
R1
READY_FOR_R2E
R2E_IN_PROGRESS
R2E_FINAL
INTEGRATION_PENDING
R2E_MAIN_FINAL
```

운영·보류 상태:

```text
WAIT_RESOURCE
RETRY_PENDING
INTEGRATION_CONFLICT
R2E_HOLD
HUMAN_REQUIRED
```

- `R2E_HOLD`: CREATE/R1의 resolvable item은 모두 닫힌 상태에서 R2E가 full evidence와 허용 repair/recovery를 소진했지만 안전한 최종 판단을 만들 수 없는 item-level terminal hold. 억지 FINAL 대신 사용한다.

정의:

- `READY_FOR_REVIEW`: CREATE 결과가 intake branch에 commit/push 완료.
- `READY_FOR_R2E`: R1 독립검수 결과가 intake branch에 commit/push 완료.
- `R2E_FINAL`: 최종 adjudication·repair·validation 완료, main 반영 전.
- `R2E_MAIN_FINAL`: 원격 main ancestry와 production parity까지 확인 완료.
- `HUMAN_REQUIRED`: 현재 operative source/recovery authority를 모두 소진해도 source truth를 결정할 수 없는 경우만 허용.

Notion/채팅에 상태만 있고 remote commit/receipt가 없으면 READY로 인정하지 않는다.

---

## 3. CREATE 계약 — ACTIVE META BUILD

CREATE는 전체 denominator를 source-first로 읽고 **현재 authority로 결정 가능한 Meta를 실제 intake 결과에 적극 반영**한다.

물리화 대상:

- source identity
- content / choices / answer
- 기존 solution / 필요한 image
- 학생용 작은칠판 final solution
- 필요한 solution SVG
- visualRequirement / visualAction / applicable visual rule refs
- EXPECTED FACT / builder witness / V2-V3 parity evidence 또는 명시적 visual exemption evidence
- L1/L2 baseline과 명백한 conflict
- `primaryMethod`
- `decisiveStep`
- RPM Primary path
- 학년별 RPM→ACTIVE crosswalk
- GLOBAL ACTIVE canonical owner
- exact curriculum binding
- 최종 L3/L4/CrossConcept/difficulty projection
- exact materialization/repair patch
- 정말 남는 unresolved reason

Meta 강제 조회 순서:

```text
source + final solution
→ primaryMethod
→ decisiveStep
→ RPM Primary
→ 학년/과목 crosswalk
→ GLOBAL ACTIVE canonical owner
→ exact curriculum binding
→ existing reuse / rebind / materialization
→ 실제로 결정 불가할 때만 adjudication candidate
```

공용 resolver/validator는 `docs/rules/01_CANONICAL/JS아카이브_Meta_RPM_ACTIVE_공용Resolver_계약_v1.md`와
`archive/tools/meta-foundation/rpm-active-resolver.mjs`를 사용한다.

### CREATE VISUAL FIRST-BUILD HARD RULE

CREATE는 visual을 "일단 대충 만들고 R1에서 고치는 단계"로 취급하지 않는다. **처음 제작에서 current visual ruleset을 그대로 적용해 가능한 범위의 visual quality를 완결**한다.

적용 대상:
- 신규 SVG / graph / geometry / `solutionImage`
- 기존 visual 재사용 여부 판단
- 기존 visual이 틀리거나 부족한 경우의 REBUILD
- source에는 그림이 없어도 solution 이해를 위해 필요한 해설 visual

CREATE visual 시작 경로는 R1/R2E와 동일하다.

```text
.codex/skills/apmath-visual-upgrade/SKILL.md
→ node tools/skills/verify-skills.mjs
→ 00_RULES_INDEX + MANIFEST
→ COMMON_PROTOCOL
→ 공통파이프라인 실행계약
→ 적응형배치루프
→ pipeline-core README + AGENT_BUDGET
→ applicable VISUAL / geometry domain / unit rules
```

문항별로 먼저 V1 student-understanding benefit / `visualRequirement`를 판단한다.
- `VISUAL_REQUIRED` → CREATE에서 visual을 반드시 제작 또는 정상 existing visual을 검증해 KEEP한다.
- 학생 이해 benefit이 분명한 `VISUAL_OPTIONAL` → CREATE에서 적극 `ADD` 또는 `REBUILD`한다.
- `VISUAL_EXEMPT` → 적극적 면제 근거가 있어야 하며, source 그림 없음·기존 SVG 없음·쉬운 문항은 면제 근거가 아니다.
- 기하 문항은 current geometry domain policy의 **`GEOMETRY_SOLUTION_VISUAL_DEFAULT = CREATE_UNLESS_JUSTIFIED_EXEMPT`**를 적용한다.

신규/수정 visual의 CREATE lineage:
```text
V1 benefit / requirement triage
→ EXPECTED FACT freeze
→ deterministic artifact build
→ V2 artifact-only OBSERVED FACT / geometry extraction
→ V3 expected ↔ observed parity
→ static/style/publication checks
→ render가 현재 실행 범위면 render-capture + independent render-review
→ render가 예약 GPT 정책상 제외면 NOT_RUN_CODEX_HANDOFF
```

지원되는 visual에서는 `archive/tools/past-exam-pipeline/build-visual-candidate.mjs` + `archive/tools/geometry-equation/visual_engine/`을 candidate 생성에 적극 활용한다. 다만 이 엔진은 현재 candidate-only이며 production write/promotion authority가 아니다. candidate 결과는 current visual/pipeline closure를 통과한 뒤에만 final asset으로 채택한다.

CREATE에서 이미 확인 가능한 visual defect를 "R1에서 고칠 예정"으로 남기지 않는다. **known visual repair pending = 0**이 원칙이다. R1은 CREATE 결과를 독립검수하다 새로 발견한 defect만 repair한다.

### CREATE_SELF_CHECK — 제작자 1차 자가검수 HARD GATE

CREATE는 작은칠판 해설·visual·Meta 제작을 끝낸 뒤 곧바로 `READY_FOR_REVIEW`를 선언하지 않는다. **같은 제작자가 최종 저장본을 다시 읽는 1회 제작자 SELF-CHECK를 수행하고, 발견한 결함을 CREATE 안에서 직접 고친 뒤 재확인**한다.

이 자가검수는 R1 독립검수를 대체하지 않는다. 역할은 다음처럼 분리한다.

```text
CREATE_SELF_CHECK = 제작자가 자기 final artifact의 known defect를 제거하는 QC
R1                = CREATE evidence를 믿지 않고 별도 판단으로 독립 재검증
```

#### A. 작은칠판 solution SELF-CHECK

전 문항 final solution을 실제로 다시 읽고 다음을 판정한다.

- SOURCE ↔ SOLUTION identity alignment
- answer / final solution 수학 정합
- REPRODUCIBILITY: 학생이 그대로 따라 풀 수 있는지
- MICRO_LAYOUT: 설명→식→연속계산→조건 적용→경우 분리→결론의 세로 판서 흐름
- 결정적 중간 계산·등식·조건·경우 누락 0
- 교육과정 밖 용어/방법 0
- 학생용 언어 / 불필요한 개발자·검수 표현 0
- ㄱ·ㄴ·ㄷ, (1)(2)(3), 경우 1/2 등 구조 분리
- 최종 결론 분리
- MathJax block 안 가짜 줄바꿈, 과다 빈 줄, 긴 식/목록 가독성 defect 0
- solution에 검산/운영 메모/작업 흔적 0
- solution ↔ visual 결정 단계 정합

FAIL을 발견하면 해당 문항을 즉시 수정하고 final bytes에서 다시 확인한다.

#### B. SVG_RULE_COMPLIANCE_PASS — 결과보다 먼저 생성 규칙 준수 검증

SVG/graph/geometry/`solutionImage`가 있는 문항은 **그림이 맞아 보이는지 보기 전에, 생성 규칙을 실제로 지켰는지**부터 확인한다. 다음 evidence가 모두 일치해야 `SVG_RULE_COMPLIANCE_PASS`다.

1. visual 작업 전에 `.codex/skills/apmath-visual-upgrade/SKILL.md` router를 사용했음
2. `node tools/skills/verify-skills.mjs` PASS
3. 작업에 적용한 RULES_INDEX / MANIFEST rule path·declared version·bytes·SHA 기록 존재
4. applicable VISUAL / geometry domain / UNIT_OVERLAY 라우팅 누락 0
5. **V1 visualRequirement / student-understanding benefit가 artifact 생성 전에 동결됨**
6. **EXPECTED FACT가 SVG/기존 builder metadata를 보기 전에 source + verified final solution + 독립 수학검산으로 동결됨**
7. deterministic builder / Python / numeric model 등 applicable build contract의 실제 실행 evidence 존재
8. 신형 geometry visual engine 사용 시 candidate-only / production READ_ONLY / publication unauthorized 경계를 지켰음
9. 생성 이후 임의 눈대중 좌표 수정, evidence 밖 수동 geometry 변경 0
10. **V2 OBSERVED FACT를 최종 actual SVG geometry에서 artifact-only로 추출함**
11. **V3 EXPECTED ↔ OBSERVED parity PASS**
12. solution ↔ visual decisive-step / displayed fact parity PASS
13. 해당 style/static/publication/XML/reference gate PASS 또는 명시적 NOT_TESTED/HANDOFF
14. 검증 evidence의 `svgSha256`가 **실제 최종 저장 SVG bytes SHA와 동일**
15. render 미실행 시 `NOT_RUN_CODEX_HANDOFF`; 미실행인데 render PASS 선언 0

아래 중 하나라도 성립하면 SVG가 화면상 그럴듯하거나 수학적으로 우연히 맞더라도 `SVG_RULE_COMPLIANCE_PASS`를 주지 않는다.

- rule preflight evidence 없음
- V1/EXPECTED FACT를 artifact 생성 뒤에 역작성
- builder self-check만 있고 V2 artifact-only evidence 없음
- V3 parity 없음
- 검증 뒤 SVG를 다시 수정했지만 새 SHA/evidence를 만들지 않음
- candidate-only engine 결과를 독립 closure 없이 production final로 취급
- 실제 render를 안 했는데 render PASS 기록

규칙 위반이 복구 가능하면 CREATE가 current visual route로 **REBUILD/REPAIR → 새 evidence → 새 final SHA → compliance 재검사**한다. 정확하게 복구할 수 없으면 억지 PASS하지 않고 visual HOLD/UNSUPPORTED evidence를 남긴다.

#### C. Meta SELF-CHECK

- RPM Primary → exact grade/subject crosswalk → GLOBAL ACTIVE owner → exact binding 재확인
- safe existing reuse를 migration gap으로 남긴 항목 0
- deterministic materialization 미처리 0
- 결정 가능한 CrossConcept/difficulty/parent mismatch 0
- `resolvablePending = 0`

#### D. CREATE_SELF_CHECK 종료 조건

```text
CREATE_SELF_CHECK_PASS = true
solutionSelfCheckStatus = PASS
svgRuleComplianceStatus = PASS | NOT_APPLICABLE
knownSolutionRepairPending = 0
knownVisualRepairPending = 0
requiredVisualMissingCount = 0
knownMetaRepairPending = 0
resolvablePending = 0
```

자가검수에서 defect를 찾았다는 사실 자체는 실패가 아니다. **찾고도 안 고친 채 R1으로 넘기는 것이 CREATE 실패**다. 수정 후 영향을 받은 self-check axis를 다시 실행하고 final artifact SHA에 evidence를 재결속한다.

### CREATE RESOLVABLE-FIRST HARD RULE

- existing ACTIVE PT/TPL + exact binding이 있으면 즉시 final Meta projection에 반영한다.
- PT/TPL은 확정되고 exact binding만 없으며 현재 authority로 binding target을 결정할 수 있으면 generic `RPM_PRIMARY_MIGRATION_GAP`으로 넘기지 않는다. **CREATE가 exact materialization patch를 만든다.**
- crosswalk exact row / L2 mismatch가 RPM + ACTIVE authority로 deterministic 복구 가능하면 CREATE에서 patch를 만든다.
- RPM_ONLY라도 GLOBAL ACTIVE에 의미상 안전한 reuse 경로가 확인되면 REBIND/REUSE로 닫는다.
- CrossConcept/difficulty도 source + verified final solution으로 결정 가능하면 CREATE에서 반영한다.
- 신규 L3/L4가 정말 필요하거나 source truth가 불확정할 때만 unresolved로 남긴다.

CREATE 종료 gate:

```text
resolvablePending = 0
deterministicMaterializationPending = 0
safeExistingReusePending = 0
visualRulePreflightStatus = PASS                    # visual-capable item이 있으면
knownVisualRepairPending = 0
requiredVisualMissingCount = 0
visualMathParityPending = 0                         # 지원 가능한 범위
CREATE_SELF_CHECK_PASS = true
solutionSelfCheckStatus = PASS
svgRuleComplianceStatus = PASS | NOT_APPLICABLE
knownSolutionRepairPending = 0
knownMetaRepairPending = 0
renderStatus = PASS | NOT_RUN_CODEX_HANDOFF         # 현재 실행 정책에 따라
```

`NOT_RUN_CODEX_HANDOFF`는 render를 실제로 실행하지 않았다는 뜻일 뿐 visual 제작 미완료를 뜻하지 않는다. CREATE는 render 전 단계의 수학적/semantic/static visual 결함을 모두 닫고 넘겨야 하며, render PASS를 허위 선언하지 않는다.

shared production canonical/binding writer 충돌을 피하기 위해 CREATE가 main shared Meta를 직접 갱신하지 않아도 된다.
대신 **final Meta projection + exact materializationPatch를 intake artifact에 물리화**해야 하며,
단순히 "migration gap"이라는 이름만 남겨 downstream에 판단을 떠넘기는 것은 금지한다.

---

## 4. R1 계약 — ZERO-RESOLVABLE REVIEW

R1은 CREATE와 다른 실행·새 판단으로 전체 문항을 독립 대조한다.
CREATE 결과를 승인하는 단계가 아니라 **잘못 만든 Meta를 실제로 고치고 CREATE가 놓친 deterministic repair를 끝내는 단계**다.

확인:

- source/answer identity
- 수학적 solution correctness
- 학생 재현 가능 작은칠판 구조
- 필요한 SVG parity
- L1/L2 conflict
- L3/L4/CrossConcept/difficulty
- RPM ↔ crosswalk ↔ GLOBAL ACTIVE owner ↔ exact binding
- runtime 문자열·기초 무결성

### R1 RESOLVE-EVERYTHING-POSSIBLE HARD RULE

- CREATE의 Meta를 fresh decision으로 재검증한다.
- CREATE의 `CREATE_SELF_CHECK_PASS`와 `SVG_RULE_COMPLIANCE_PASS`는 제작자 자기보고이므로 R1 authority로 자동 신뢰하지 않는다. evidence path/SHA와 final artifact SHA를 확인하고 독립 판단에서 false PASS가 있으면 CREATE defect로 기록·수정한다.
- exact existing path가 있으면 즉시 REPAIR/REUSE한다.
- PT/TPL이 확정되고 binding만 빠졌으면 exact materialization patch를 확정하고 final projection을 수정한다.
- crosswalk/L2/binding mismatch가 deterministic하게 복구 가능하면 R1에서 복구한다.
- RPM_ONLY라도 GLOBAL ACTIVE로 안전하게 재사용 가능하면 R1에서 REBIND/REUSE한다.
- CrossConcept/difficulty/parent mismatch도 결정 가능하면 직접 수정한다.
- CREATE가 만든 잘못된 materialization patch도 R1에서 교정한다.
- solution·Meta·layout·visual defect를 발견하고 현재 scope에서 수정 가능하면 `수정프로토콜.md`를 적용해 **보고만 하지 않고 직접 최소 수정 → 영향 재검증**한다.
- visual이 누락되었거나 기존 SVG가 수학적으로 틀리고 학생 이해에 benefit이 있으면 **R1에서 ADD/REBUILD를 적극 수행**한다. 단, 위 CURRENT VISUAL ROUTE HARD GATE를 먼저 닫는다.
- 복합성·표현 차이·완전 동일 wording 부재만으로 unresolved 금지.

### R1/R2E CURRENT VISUAL ROUTE HARD GATE

R1 또는 R2E가 SVG·graph·geometry·`solutionImage`를 **생성, 수정, 재생성, 부착, 검수**할 때는 특정 문서 하나만 골라 읽지 않는다. 작업 시작 전 현재 Git bytes 기준으로 다음 router와 ruleset을 실제 적용한다.

1. `.codex/skills/apmath-visual-upgrade/SKILL.md` — visual task router
2. `node tools/skills/verify-skills.mjs` PASS
3. `docs/rules/00_RULES_INDEX.md` + `docs/rules/MANIFEST.md` — 적용 문서와 byte/hash 고정
4. `docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`
5. `docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md`
6. `docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md`
7. `archive/tools/pipeline-core/README.md` + `archive/tools/pipeline-core/AGENT_BUDGET.md`
8. 적용 가능한 VISUAL/domain/unit 규칙
   - 제작 좌표·Python·style·publication: `docs/rules/04_VISUAL/도형추출.md`
   - 기하 문항의 visual necessity·학생 이해·semantic independent review: `docs/rules/04_VISUAL/기하_시각자료_해설_독립검수_통합운영규정_v1.1_QUALIFICATION_READY.md`
   - 좌표·직선·원·도형의 방정식·관련 geometry explanation: `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`
   - 집합·명제 qualification이면 Logic Visual overlay
   - 대상 단원에 `UNIT_OVERLAY`가 있으면 그 문서까지 적용
9. defect 수정이면 `docs/rules/02_PIPELINES/수정프로토콜.md`

신규 또는 수정 visual의 current semantic lineage는 다음을 닫아야 한다.

```text
V1 student-understanding benefit / visualRequirement triage
→ EXPECTED FACT freeze
→ deterministic artifact build
→ V2 artifact-only OBSERVED FACT / geometry
→ V3 expected ↔ observed parity
→ render-capture
→ independent render-review
→ closure
```

기하 문항은 최신 geometry domain policy의 **`GEOMETRY_SOLUTION_VISUAL_DEFAULT = CREATE_UNLESS_JUSTIFIED_EXEMPT`**와 2026-09-25 solution visual 적극 제작 addendum을 따른다. 기존 SVG가 없거나 source에 그림이 없거나 문항이 쉽다는 이유만으로 `VISUAL_EXEMPT` 처리하지 않는다. 학생 이해에 실질 benefit이 있는 `VISUAL_OPTIONAL`도 적극 `ADD/REBUILD` 대상으로 본다. required visual이 없으면 `SOLUTION_VISUAL_MISSING` repair 대상이다.

수학적 visual build는 Python/독립 수학검산에서 동결한 EXPECTED FACT를 사용하며, 생성 artifact나 builder metadata에서 expected를 역산하지 않는다. 실제 SVG geometry에서 OBSERVED FACT를 독립 추출해 parity를 확인한다.

**신형 geometry visual engine 경계:** `archive/tools/past-exam-pipeline/build-visual-candidate.mjs` + `archive/tools/geometry-equation/visual_engine/`은 frozen EXPECTED FACT를 받는 candidate builder다. 현재 코드가 `productionBaselinePolicy: READ_ONLY`, `allowProductionWrite: false`, witness `publicationAuthorized: false`를 강제한다. 지원되는 visual이면 R1/R2E가 candidate 생성에 적극 활용할 수 있지만, 이 엔진의 candidate 결과만으로 production SVG를 FINAL/promotion하지 않는다. 반드시 위 current pipeline-core parity/render/independent-review closure를 통과한다. 지원하지 않는 visual은 current ruleset 아래의 다른 deterministic builder를 사용하되 동일 closure를 지킨다.

예약 GPT R1 정책상 실제 render가 실행되지 않는 경우에는 `NOT_RUN_CODEX_HANDOFF`를 기록하고 **render PASS를 허위 선언하지 않는다.** current pipeline이 final production closure에서 render를 요구하면 R2E/Codex가 render-capture + independent render-review를 닫아야 한다.

### READY_FOR_R2E ZERO-RESOLVABLE GATE

`READY_FOR_R2E` 선언 전 반드시:

1. `resolvablePending = 0`
2. deterministic binding/materialization gap = 0
3. 현재 RPM/ACTIVE authority로 안전하게 reuse 가능한 RPM_ONLY = 0
4. CREATE↔R1 conflict 중 해결 가능한 항목 = 0
5. 남은 항목마다 `R2_ADJUDICATION_REQUIRED` 사유 + searched evidence 존재

**R1에서 해결 방법이 확정된 항목을 `RPM_PRIMARY_MIGRATION_GAP`으로 R2E에 넘기는 것을 금지한다.**

R1 완료는 위 gate PASS + 시험지 receipt의 `READY_FOR_R2E` + 해당 remote commit 존재가 모두 충족될 때만 인정한다.

---

## 5. intake receipt 계약

권장 경로:

```text
archive/data/r2e-intake/m2/<examUid>.json
archive/data/r2e-intake/m3/<examUid>.json
```

최소 필드:

```text
examUid
examFile
grade
lane
stage
sourceBlobSha
inputCommit
totalQuestions
changedQuestions[]
changedSvgFiles[]
visualDispositionSummary
visualEvidenceRef
visualRenderStatus
createSelfCheckStatus
solutionSelfCheckStatus
svgRuleComplianceStatus
createSelfCheckEvidenceRef
metaDispositionSummary
metaResolutionEvidenceRef: { path, sha256 }
metaResolverContractVersion = JS_ARCHIVE_RPM_ACTIVE_RESOLUTION_v1
unresolvedItems[]
authorityRefs[]
nextState
updatedAt
```

R1 추가 권장:

```text
deepReviewCandidates[]
repairs[]
proposedNewL3[]
proposedNewL4[]
rpmMigrationGaps[]
crossConceptCandidates[]
sourceHardHolds[]
validatorSummary
```

`metaResolutionEvidenceRef`는 `JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v1` 또는
`JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v2` sidecar를 가리킨다. 두 형식 모두 전 UID의 input
bundle, resolver evidence, candidate projection, relational evidence, fresh difficulty blind
evidence, deterministic validator receipt를 포함한다. Intake snapshot은 frozen exam JS와
UID/ordinal/content/choices/image/solution/curriculum identity를 대조한 뒤 공용 resolver로
재검증한다. Receipt는 item-level evidence를 대체하지 않는다.

- **v1 legacy projection contract:** `candidateMeta`는 frozen JS advanced Meta/difficulty
  projection과 exact parity여야 한다. 예전 R1이 이미 해당 projection을 materialize한 경우에
  유지한다.
- **v2 staged-candidate contract:** 사용 대상 JS가 아직 advanced projection을 갖지 않지만 R2E가
  fresh Meta/difficulty adjudication을 해야 하는 legacy recovery에서 사용한다. `sourceMetaProjection`
  과 `sourceMetaProjectionSha`는 frozen JS의 기존 advanced projection을 정확히 기록한다.
  `candidateMeta`는 fresh resolver/difficulty decision의 출력이며 evidence와 exact parity여야
  하지만, intake-stage source JS와 같을 필요는 없다. 이 단계에서는 source hashes, curriculum,
  UID/ordinal parity를 계속 강제한다.
- `R2E_FINAL`은 최종 강화 gate다. v1/v2 어느 intake에서 시작했든 모든 UID의 `candidateMeta`가
  완성 final JS 및 runtime projection과 exact parity여야 하고, Meta HOLD/proposal/migration gap은
  0이어야 한다. v2는 source projection 불일치를 final JS로 통과시키는 예외가 아니다.

---

## 6. intake 동시 writer 규칙

같은 학년의 여러 예약 레인이 하나의 intake branch를 공유한다.

각 실행은:

1. 최신 remote intake HEAD fetch.
2. 그 HEAD에서 자기 시험지 1개만 작업.
3. 대상 시험지 파일 + receipt/evidence만 명시 stage.
4. 시험지별 독립 commit 1개.
5. push 직전 remote HEAD 재확인.
6. remote가 전진했으면 자기 commit만 최신 HEAD 위에 안전하게 재적용.
7. 영향 범위를 재검증한 뒤 push.

금지:

- `git add .`
- `git add -A`
- force push
- 다른 레인의 commit 삭제/덮기
- unrelated 파일 stage
- intake branch 전체 main merge

push 성공한 remote commit SHA가 durable authority다.

---

## 7. R2E run snapshot 계약

Codex R2E는 약 6시간 간격을 기본 운영값으로 한다.
권장 서울 시간은 00:00 / 06:00 / 12:00 / 18:00이다.

각 run 시작:

1. `work/intake/m2`, `work/intake/m3` remote HEAD 조회.
2. `READY_FOR_R2E` receipt inventory 확정.
3. 이미 `R2E_MAIN_FINAL`인 시험지 제외.
4. resume 가능한 checkpoint가 있으면 신규 intake보다 resume 우선.
5. run의 intake HEAD SHA와 각 exam input commit SHA를 freeze.
6. run 시작 뒤 추가된 R1 commit은 현재 batch에 섞지 않고 다음 run으로 넘긴다.

native file-condition trigger에 의존하지 않는다.
예약 실행 시 queue를 읽고 대상이 없으면 `NO_WORK`로 종료한다.

---

## 8. R2E 역할 — Final Adjudication, Repair & Closure

R2E는 세 번째 전체 deep review도 아니고 **CREATE/R1이 할 수 있었던 routine Meta cleanup을 대신하는 단계도 아니다.** 그러나 R2E에서 새로 확인된 실제 defect는 적극적으로 repair한다.

deep review 대상:
- `R2_ADJUDICATION_REQUIRED` true semantic conflict
- 신규 L3/L4 필요성이 R1에서도 닫히지 않은 항목
- CREATE ↔ R1 비결정적 conflict
- source/answer/visual hard HOLD
- 여러 시험지를 함께 봐야 판단 가능한 semantic cluster
- R1 이후 byte drift
- validator가 새로 찾은 actual defect
- R1에서 이미 확정한 shared Meta patch의 production integration

단순 binding 부재, deterministic materialization, existing ACTIVE reuse 가능 항목이 남아 있으면 R1 종료 gate 실패로 되돌린다.

R2E에서 solution·Meta·layout·SVG defect가 실제로 확인되면 `수정프로토콜.md`를 적용해 **보고만 하지 않고 직접 최소 수정 → validator/parity 재실행**한다. 기존 SVG가 틀리거나 풀이 재현성/학생 이해에 필요한 visual이 빠졌으면 CURRENT VISUAL ROUTE HARD GATE 아래에서 적극 `ADD/REBUILD`한다.

full evidence와 허용 repair/recovery를 소진해도 안전하게 결정할 수 없는 항목은 **`R2E_HOLD`**로 종료한다. HOLD 0을 만들기 위해 가장 가까운 PT/TPL·새 L3/L4·visual을 억지 선택하지 않는다.

정상 PASS item은 source/dependency drift 등 invalidation 근거 없이 처음부터 다시 풀지 않는다.

---

## 9. R2E HOLD-safe terminal gate

R2E는 최종 판단 단계이지만 **모르는 것을 억지 FINAL시키는 단계가 아니다.**

허용 item-level 최종 disposition:
- `EXISTING_REUSE`
- `REBIND`
- `MATERIALIZED`
- `NEW_L4`
- `NEW_L3`
- `CROSS_CONCEPT`
- `ROUTE_OUT`
- **`R2E_HOLD`**

`R2E_HOLD`는 다음과 같이 evidence를 소진한 뒤에도 안전한 판정이 불가능할 때 사용한다.
- RPM Primary / crosswalk / GLOBAL ACTIVE / exact binding / final solution을 모두 대조했지만 semantic target을 확정할 수 없음
- operative source/answer/solution truth를 확정할 수 없음
- visual defect를 수정프로토콜 + current visual ruleset으로 재작업했지만 수학적 parity를 확정할 수 없음
- 둘 이상의 합리적 판정이 남아 임의 선택하면 의미 왜곡 위험이 있음

금지:
- HOLD 0을 만들기 위한 추측 `NEW_L3/NEW_L4`
- 가장 가까워 보이는 PT/TPL 강제 배정
- visual을 그럴듯하게 만든 뒤 V2/V3/parity 미확정 상태를 PASS 처리
- 근거 부족을 모델 추측으로 메우기

HOLD 영향:
- **`BASIC_HARD_HOLD`**: source/answer/solution/identity 또는 수학적 visual parity처럼 BASIC correctness를 깨는 HOLD. 시험지 production integration을 차단한다.
- **`ADVANCED_META_HOLD`**: L3/L4/CrossConcept 등 advanced capability만 미확정이고 BASIC payload가 정상인 HOLD. item evidence로 보존하며 Inclusive Basic Eligibility 계약이 허용하는 BASIC 사용은 차단하지 않는다.

Exam-level closure:
- BASIC_HARD_HOLD > 0 → exam `R2E_HOLD`, production integration 금지.
- BASIC_HARD_HOLD = 0이고 ADVANCED_META_HOLD만 존재 → BASIC-valid production은 허용 가능하되 advanced capability를 pending/disabled로 명시하고 hold evidence를 보존한다.
- 미분류 unresolved 상태는 금지한다. 모든 item은 resolved disposition 또는 evidence-complete `R2E_HOLD`여야 한다.

---

## 10. 신규 taxonomy 경계

신규 canonical은 RPM과 GLOBAL ACTIVE 모두에서 reuse 경로가 없고 실제 retrieval 가치가 있을 때만 만든다.

신규 L3:
- 중심 요구/primary strategy가 기존 L3에 들어가면 의미가 왜곡됨.
- 독립 retrieval 가치가 있음.
- 여러 evidence UID로 반복 가능성을 확인.

신규 L4:
- 같은 L3 안에서 decisive-step solution skeleton이 반복 가능하게 다름.

CrossConcept:
- primary L1~L4 경로 밖에서 실제 결정적으로 쓰이는 보조개념.
- primary concept를 CrossConcept로 중복 등록 금지.

숫자·학교·표현·그림 모양 차이만으로 새 key를 만들지 않는다.

---

## 11. correctness / source / SVG defect

R2E가 actual defect를 확인하면 보고만 하지 않고 허용 범위의 최소 repair를 수행한다.

대상 예:
- solution 수학 오류
- 교육과정 밖 풀이
- 중간계산 누락
- 작은칠판 구조 결함
- SVG geometry/parity 오류
- source/answer mismatch
- visual hard defect

현재 capability registry가 `DERIVED_SOURCE_RECOVERY = PRODUCER_NOT_IMPLEMENTED`이면 파생문항 자동생성을 구현된 기능처럼 가정하지 않는다.

현재 operative source/correction/recovery 경로로 deterministic 복구 가능하면 처리한다.
모든 operative evidence를 소진해도 source truth 확정이 불가능한 경우만 `HUMAN_REQUIRED`.

Meta gap, validator 미구현, 네트워크/권한 문제를 HUMAN_REQUIRED로 오용하지 않는다.

---

## 12. durable state / resume

R2E 진행상태는 intake를 덮어쓰지 않고 별도 durable state에 저장한다.

권장:

```text
archive/data/r2e/<grade>/
  SCHEMA.json
  runs/<runId>.json
  exams/<examUid>.json
  events/<examUid>.jsonl
  receipts/<examUid>.json
```

시험지 state 최소:

```text
inputBranch
inputCommit
sourceBlobSha
dependencyShas
denominator
integrityScanned
deepReviewItems[]
resolvedItems[]
remainingItems[]
changedFiles[]
validatorStatus
nextAction
checkpointCommit
productionCommit
finalStatus
```

재실행:

1. remote durable ref + ledger 읽기.
2. input/dependency SHA 검증.
3. SHA가 같은 terminal item 재사용.
4. 변경된 item과 영향 closure만 invalidation.
5. `nextAction`부터 이어서 수행.

STATUS 질문이나 채팅 재개 자체는 invalidation 사유가 아니다.
checkpoint 전에 끊긴 마지막 item만 다시 확인할 수 있다.

**NO PHYSICAL CHECKPOINT = NO PROGRESS**.

---

## 13. 중복 실행 방지

R2E processor는 기본 단일 writer다.

이전 run이 active면 다음 예약 run은 lock/lease를 확인하고 동일 queue를 중복 처리하지 않는다.

lock 최소 정보:

```text
runId
owner
host
acquiredAt
heartbeatAt
fencingToken
```

한 시험지 실패가 독립된 다른 시험지를 막지 않는다.
실제 shared Meta dependency가 있는 cluster만 함께 대기한다.

---

## 14. validation gate

`R2E_FINAL` 전 current artifact SHA 기준으로 최소 확인:

- denominator coverage
- node syntax
- VM/runtime load
- answer/solution consistency
- blank solution 0
- control-char 0
- LaTeX escape regression 0
- protected parity 또는 승인 repair evidence
- SVG XML / reference / geometry / provenance
- L1/L2 parent
- L3/L4 parent
- CrossConcept registry
- duplicate/alias collision
- RPM ↔ crosswalk
- GLOBAL ACTIVE canonical owner
- exact curriculum binding
- compiled/runtime parity
- affected UID metadata
- Archive2 catalog/index/join
- 관련 targeted regression
- 미분류 unresolved 0: 모든 item은 resolved disposition 또는 evidence-complete `R2E_HOLD`
- `R2E_HOLD`의 BASIC_HARD_HOLD / ADVANCED_META_HOLD 영향 분류
- 신규/수정 visual이면 current pipeline-core visual closure 또는 정책상 명시적 handoff 상태

기존 validator가 candidate/HOLD를 허용한다는 이유로 PASS를 선언하지 않는다. 반대로 evidence-complete `R2E_HOLD`를 없애기 위해 추측 FINAL을 만들지도 않는다.

---

## 15. production integration

R2E_FINAL 이후 최신 `origin/main`을 다시 fetch한다.

원칙:

- intake 전체 merge 금지.
- R2E working branch 전체 merge 금지.
- final production 파일만 allowlist 반영.
- 시험지 1개 = final production commit 1개.
- shared canonical/Meta 변경은 별도 shared Meta commit.
- checkpoint / scratch / input ZIP / handoff를 main에 넣지 않는다.
- 관련 drift만 targeted revalidation.
- unrelated main advance 때문에 전체 R2E 재검수 금지.
- force push 금지.

main 반영 후:

- production commit이 remote main ancestry에 존재
- final exam JS/SVG bytes 확인
- canonical/binding/runtime parity
- registration/catalog/index 정상
- unrelated mutation 0

을 확인한 후에만 `R2E_MAIN_FINAL` receipt를 기록한다.

---

## 16. reopen

`R2E_MAIN_FINAL` 시험지는 정상 CREATE/R1/R2E에서 다시 처리하지 않는다.

REOPEN 허용 사유:

1. source 원본 실제 변경
2. committed final artifact byte drift
3. 관련 canonical/rule 변경이 해당 UID를 직접 무효화
4. production regression
5. 사용자 명시 재검수

---

## 17. legacy R2/E/Library 경로의 지위

과거 R2/E/Apply Bridge 규칙은 역사·복구 계약으로 보존한다.

새 intake 기반 중2·중3 생산에는 적용하지 않는다.

legacy 경로를 사용할 수 있는 경우:

- 이미 sealed된 과거 artifact 복구
- 기존 applyId/provenance 확인
- 사용자가 특정 legacy packet 처리를 명시적으로 지시

새 CREATE/R1 결과를 legacy Library R2/E로 보내지 않는다.

---

## 18. 짧은 작업 지시 표준

이 문서가 정본이므로 작업 프롬프트에 세부 규칙을 재복사하지 않는다.

권장:

```text
최신 GPT 작업 전 필독 라우터와
JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1 경로의 **v2 내용 authority**를 읽고 따른다.

대상: <학년/branch/scope>
목표: <CREATE/R1/R2E>
결과: <READY receipt + commit/push 또는 R2E_MAIN_FINAL>
STOP: <해당 단계 완료>
```

세부 안전규칙은 본 문서와 연결된 canonical/review 문서가 담당한다.

---

## QUESTION MICRO_LAYOUT stage binding — HARD GATE

CREATE: source freeze → 전 문항 KEEP/POLISH/REFORMAT/HOLD → known repair 직접 수정 → SOURCE_TEXT_EXACT_PARITY/choices exact 100% → CREATE_SELF_CHECK 재검. READY_FOR_REVIEW 전에 `questionLayoutStatus=PASS`, `sourceTextExactParityStatus=PASS`, `choicesExactParityStatus=PASS`, `knownQuestionLayoutRepairPending=0`, `questionLayoutHoldCount=0`, `questionLayoutEvidenceRef` 필수. render 미실행은 `questionLayoutRenderStatus=NOT_RUN_CODEX_HANDOFF`.

R1: CREATE 자기보고를 신뢰하지 않고 전 문항 fresh QUESTION MICRO_LAYOUT + exact parity 독립감사. 안전한 defect는 최소 수정 후 재검. READY_FOR_R2E 전 question layout/exact/choices PASS, repair pending 0, HOLD 0.

R2E: 정상 R1 PASS item을 이유 없이 재조판하지 않는다. evidence denominator, R1 이후 content/layout drift, exact parity, final exam render split/asset/choice/overcompression을 integrity scan하고 새 defect/drift만 targeted repair한다. source text correction은 SOURCE_FIDELITY repair로 분리한다.

receipt/evidence 최소 필드: `questionLayoutStatus, sourceTextExactParityStatus, choicesExactParityStatus, questionLayoutChangedCount, questionLayoutHoldCount, knownQuestionLayoutRepairPending, questionLayoutEvidenceRef, questionLayoutRenderStatus`.
