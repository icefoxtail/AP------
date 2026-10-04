# ALIVE QUALITY PROOF LOOP ENGINE 세부 구현 계획서 v0.11
## Contract Freeze Candidate — Final Dependency & Scope Closure Edition

> **설계 상태 정정(2026-08-28):** 이 문서는 세부 계약 설계 원본이며 현재 운영 정본이나 구현 완료 명세가 아니다.
> 아래 표의 `ACTIVE`는 구현 목표 상태를 뜻했으나 실제 `alive/engine/` 계약 artifact가 아직 없으므로 현재 활성 계약으로 해석하지 않는다.
> Codex 하위 에이전트 기반 구현 순서와 MVP 범위는 같은 디렉터리의
> `ALIVE_CODEX_MULTI_AGENT_PIPELINE_IMPLEMENTATION_PLAN_v0.12.md`를 우선한다.
> v0.11은 상세 계약 후보와 회귀 누락 방지용 설계 원본으로 보존한다.

> 상태: **Contract Freeze 후보**
>
> 목적: ALIVE를 Codex가 구현 가능한 **fail-closed / evidence-driven / sequential Quality Proof Engine**으로 고정한다.
>
> 핵심 정의:
>
> **1 Question = 1 Complete Proof Transaction**  
> **24 Questions = 24 LOCALLY_FROZEN Transactions + 1 Exam Integration Transaction**  
> **SEALED = 콘텐츠 불변**  
> **PUBLISHED = 프로덕션 반영 완료**  
> **Evidence 없는 PASS는 존재하지 않는다.**  
> **이전 버전의 승인 계약을 새 버전에서 누락하는 것을 금지한다.**

---

# 1. v0.11의 최우선 목표

v0.11은 v0.10의 구조를 유지하면서 **Stage dependency·code별 Retry escalation·WorkflowAction 실행 의미·Candidate Gate instance·Approval reducer·Exam canonical transaction·Plan pool·Publish rollback ownership에서 남은 semantic/execution 해석 여지를 핀포인트로 제거하는 Freeze-readiness 수정본**이다.

이번 버전의 P0 closure:

1. Contract Markdown이 아니라 `*.contract.json`을 semantic 정본으로 고정하고 bootstrap baseline을 추가한다.
2. Deterministic Seed 파생 계약을 복원하고 retry/reopen generation까지 seed에 포함한다.
3. Content Retry Level 1/2/3의 횟수 상한과 총량 상한을 다시 고정한다.
4. `questionType`을 canonical enum으로 통일하고 한국어 명칭은 serializer/UI label로만 사용한다.
5. `SolverRoutingRegistry`가 claim의 EXACT/HYBRID/I3 경로를 결정하며 Agent가 임의 downgrade하지 못하게 한다.
6. `CapabilityManifest`와 `CandidateRuntime` schema를 추가하여 I3 predicate의 모든 입력을 정본화한다.
7. Source Blinding을 실제 업무 입력과 일치시켜 Builder는 full canonical Source ProblemIR, Judge는 final student payload를 보게 한다.
8. 콘텐츠 상태와 배포 상태를 분리하여 SEALED 콘텐츠 PASS가 publish 장애로 오염되지 않게 한다.
9. G09의 interpretation dependency와 representation level을 canonical graph/enum으로 기계 산출한다.
10. Shortcut 탐색은 학생 Curriculum Contract 안에서만 난도 판정에 사용한다.
11. Human Review Queue / append-only Audit Log / 문항별 Review Report 계약을 복원한다.
12. 기존 ACTIVE Contract의 최초 baseline을 v0.2~v0.6 근거로 bootstrap하고 이후 semantic 변경은 무승인 자동 통과를 금지한다.
13. FailurePolicy에 `failureScope`/`candidateDisposition`을 추가하여 Candidate 실패와 Question/Run/Release 실패를 분리한다.
14. Content Retry escalation은 원인 code를 보존한 채 `effectiveRetryLevel/effectiveWorkflowAction`만 승격하며 retry 좌표를 Plan/Candidate/Realizer/Reopen 단위로 분리한다.
15. Checkpoint/Resume payload를 canonical schema로 복원하고 Human Review resume가 동일 checkpoint 정본을 사용하게 한다.
16. Stage applicability를 문자열 expression이 아닌 canonical Predicate DSL/AST로 고정한다.
17. Solver `solverTarget`과 I3 `verificationProfile`을 분리하고 `REJECT_ALL` routing을 FailurePolicy에 연결한다.
18. Audit hash chain 검증을 SEALED Hard Gate로 승격하고 Human intervention manifest hash를 Freeze Provenance에 포함한다.
19. Hash field order semantics의 선택지를 제거하고 field별 단일 canonical semantics를 고정한다.
20. Publish CAS를 이름이 아니라 atomic conditional primitive 또는 exclusive publish lock으로 정의하여 TOCTOU를 차단한다.
21. Judge 진입 전 mode별 `minSurvivingCandidatesForJudge`를 강제하고 후보 pool 부족을 FailurePolicy로 라우팅한다.
22. DifficultyVector의 모든 기계 축을 `DifficultyAxisDerivationRegistry`에서 결정론적으로 산출하고 version/hash를 환경에 잠근다.
23. immutable bootstrap 66과 이후 승인 migration을 분리하여 `bootstrapActiveCount/currentActiveCount` 의미를 단일화한다.
24. Candidate-stage unresolved는 Candidate를 제외하고, Exam/Package 단계 failure는 Run scope로 재매핑한다.
25. Source Parser/일반 Agent 재호출을 위한 generic `stageAttempt[stageId]` retry coordinate를 추가한다.
26. Run Environment Lock과 Freeze Provenance가 참조하는 canonical spec hash 목록을 동일 source에서 생성하여 병렬 목록 누락을 금지한다.
27. SEALED 정본 Gate와 최종 완료조건 요약의 parity를 자동 검사한다.
28. Final Difficulty/G09가 참조하는 curriculum-valid minimum solution evidence를 먼저 생성하도록 Shortcut/Min-Solution Stage를 선행시킨다.
29. Content Retry의 공통 L1→L2→L3 승격을 폐기하고 Failure code별 `escalationProfileId` graph를 정본화한다.
30. 모든 `workflowAction`을 `WorkflowActionRegistry`에서 retry-coordinate mutation + restart stage와 1:1 연결한다.
31. RequiredGateManifest를 Gate Template로 고정하고 Candidate/Question별 `GateInstanceResult`를 별도 canonical instance로 기록한다.
32. Qn-38과 Exam Final Approval을 deterministic reducer로 정의하여 Human/Judge의 암묵 승인 의미를 제거한다.
33. Exam Integration의 EX canonical stage order, Exam failure code, deterministic ReopenTargetPolicy를 복원한다.
34. Plan Critic 이후 mode별 최소 승인 Plan 수를 강제하고 `PLAN_POOL_INSUFFICIENT`를 FailurePolicy로 라우팅한다.
35. Publish commit 이후 rollback은 transaction ownership을 증명하는 owned rollback CAS 또는 smoke 종료까지 유지되는 exclusive lock만 허용한다.
36. 첫 문항 Within-Exam Novelty, V0.1 capability profile, pre-run validation code mapping을 canonical policy로 고정한다.
37. Source Difficulty baseline을 Candidate와 동일한 deterministic evidence chain으로 선행 생성한다.
38. `CurriculumContract`를 Plan 이전에 canonical schema/hash로 lock하여 Plan Critic·Shortcut·Curriculum Gate가 동일 계약을 읽게 한다.
39. Candidate에 `sourcePlanId/planGeneration/planProvenanceHash`를 강제하고 Judge survivor가 최소 서로 다른 2개 Plan에서 오도록 한다.
40. `RESELECT_PLAN_BRANCH` 같은 비정본 action alias를 제거하고 모든 recovery를 WorkflowActionRegistry의 canonical action으로만 라우팅한다.
41. `RootCauseResolverRegistry`를 추가하여 `ROOT_CAUSE_ESCALATE`가 deterministic evidence predicate로 정확히 1개의 registered action으로 해소되게 한다.
42. `choiceShuffleAttempt`와 shuffle permutation history를 RetryCoordinates/Seed/DAG에 추가하여 같은 reopen generation에서 동일 shuffle 반복을 방지한다.
43. `ReopenImpactMetric`을 canonical lexicographic tuple로 정의하여 blueprint/difficulty/answer-distribution reopen 대상 선택을 완전히 결정론화한다.
44. policy/self-integrity failure는 Candidate scope로 내려갈 수 없도록 `POLICY_CONTEXT` scope resolver를 추가하고 Question/Exam Approval reducer failure code를 분리한다.
45. EX-04 transform concentration 35% 초과의 routing을 자동 reopen failure로 단일화하여 HUMAN_REVIEW/auto-reopen 이중 의미를 제거한다.


**목표:** v0.7에서 도입한 No-Regression 체계를 v0.11에서도 유지하며, 계약의 존재뿐 아니라 **계약 자체의 canonical payload, provenance, baseline/migration, diff 결과**까지 기계 검증되어야 하며, Phase 0 artifact만으로 재현 가능한 Contract Freeze 판단이 가능해야 한다.

---

# 2. No-Regression Contract Lock

v0.7부터 **Contract Coverage Matrix는 canonical contract들의 정본 index artifact**이며, 각 계약의 semantic 정본은 개별 `*.contract.json`이다.

`alive/engine/contracts/contract-coverage.json`

각 계약은 stable ID, sectionKey, 최초 도입 버전, status를 가진다. 문서의 숫자 절 번호는 개정 시 바뀔 수 있으므로 정본 참조에는 사용하지 않는다.

| Contract ID | Contract | sectionKey | Introduced | Status |
|---|---|---|---:|---|
| `C-CONTRACT-001` | No-Regression Contract Lock | `NO_REGRESSION` | 0.5 | ACTIVE |
| `C-CONTRACT-002` | Canonical Contract Artifact + Bootstrap Baseline | `CONTRACT_BOOTSTRAP` | 0.7 | ACTIVE |
| `C-POLICY-001` | Policy Bundle + Run Environment Lock | `POLICY_BUNDLE` | 0.5 | ACTIVE |
| `C-SEQ-001` | Strict Sequential Question Transaction | `STAGE_ORDER` | 0.2 | ACTIVE |
| `C-RUNTIME-001` | Runtime State / Production Isolation | `RUNTIME_ISOLATION` | 0.2 | ACTIVE |
| `C-MODE-001` | EXAM_FOLLOWUP / STRICT_VARIANT Semantics | `MODE_CONTRACT` | 0.4 | ACTIVE |
| `C-SCHEMA-001` | Core Schema Set | `CORE_SCHEMAS` | 0.3 | ACTIVE |
| `C-IR-001` | Canonical ProblemIR | `PROBLEM_IR` | 0.3 | ACTIVE |
| `C-IR-002` | Canonical SolutionIR | `SOLUTION_IR` | 0.4 | ACTIVE |
| `C-IR-003` | SolutionGraph + DifficultyVector | `SOLUTION_GRAPH_DIFFICULTY` | 0.2 | ACTIVE |
| `C-TYPE-001` | Canonical QuestionType Enum | `QUESTION_TYPE_ENUM` | 0.7 | ACTIVE |
| `C-G09-002` | InterpretationDependencyGraph + RepresentationLevel | `G09_CANONICAL_AXES` | 0.7 | ACTIVE |
| `C-SOURCE-001` | Independent Source Ingestion Proof | `SOURCE_INGESTION` | 0.4 | ACTIVE |
| `C-SOURCE-002` | Source Admissibility Hard Gate | `SOURCE_ADMISSIBILITY` | 0.3 | ACTIVE |
| `C-BLIND-001` | Source Blinding Access Matrix | `SOURCE_BLINDING` | 0.2 | ACTIVE |
| `C-GATE-001` | RequiredGateManifest Auto Generation | `REQUIRED_GATE_MANIFEST` | 0.5 | ACTIVE |
| `C-GATE-002` | Stage Applicability Predicate DSL | `STAGE_APPLICABILITY_DSL` | 0.8 | ACTIVE |
| `C-GATE-003` | Candidate/Question Gate Instance Results | `GATE_INSTANCE_RESULTS` | 0.10 | ACTIVE |
| `C-SOLVER-001` | Claim-Level Exact Coverage | `CLAIM_SOLVER_COVERAGE` | 0.5 | ACTIVE |
| `C-SOLVER-002` | I2 Stateless / I3 Mandatory Independence | `SOLVER_INDEPENDENCE` | 0.3 | ACTIVE |
| `C-ROUTE-001` | Deterministic SolverRoutingRegistry | `SOLVER_ROUTING` | 0.7 | ACTIVE |
| `C-SOLVER-003` | SolverTarget / VerificationProfile Separation | `SOLVER_VERIFICATION_PROFILE` | 0.8 | ACTIVE |
| `C-CAP-001` | CapabilityManifest + CandidateRuntime | `CAPABILITY_RUNTIME` | 0.7 | ACTIVE |
| `C-CAP-002` | Milestone Capability Profile | `MILESTONE_CAPABILITY_PROFILE` | 0.10 | ACTIVE |
| `C-TRANSFORM-001` | TransformOp Registry | `TRANSFORM_REGISTRY` | 0.2 | ACTIVE |
| `C-TRANSFORM-002` | Formal Contract Predicate DSL | `TRANSFORM_CONTRACT` | 0.3 | ACTIVE |
| `C-TRANSFORM-003` | Compatibility Matrix + Promotion | `TRANSFORM_COMPATIBILITY` | 0.3 | ACTIVE |
| `C-PLAN-001` | Plan Diversity | `PLAN_DIVERSITY` | 0.3 | ACTIVE |
| `C-PLAN-002` | Plan Critic Executable Contract | `PLAN_CRITIC` | 0.2 | ACTIVE |
| `C-PLAN-003` | Plan Pool Sufficiency after Critic | `PLAN_POOL_SUFFICIENCY` | 0.10 | ACTIVE |
| `C-BUILDER-001` | Constructive Builder | `CONSTRUCTIVE_BUILDER` | 0.2 | ACTIVE |
| `C-PARAM-001` | Parameter Robustness | `PARAMETER_ROBUSTNESS` | 0.3 | ACTIVE |
| `C-DIST-001` | Executable Distractor Builder | `DISTRACTOR_CONTRACT` | 0.2 | ACTIVE |
| `C-LANG-001` | Constrained Problem/Solution Realizer | `REALIZER_CONTRACT` | 0.2 | ACTIVE |
| `C-LANG-002` | Language Integrity Hard Gate | `LANGUAGE_INTEGRITY` | 0.3 | ACTIVE |
| `C-SEM-001` | Semantic Parser + Round-Trip | `SEMANTIC_ROUNDTRIP` | 0.3 | ACTIVE |
| `C-CLONE-001` | Anti-Clone Metrics + Hard Rules | `ANTI_CLONE` | 0.2 | ACTIVE |
| `C-ARCHIVE-001` | Archive Duplicate Fine Gate | `ARCHIVE_DUPLICATE` | 0.3 | ACTIVE |
| `C-ARCHIVE-002` | Archive Retrieval Recall/Freshness | `ARCHIVE_RECALL` | 0.4 | ACTIVE |
| `C-DIFF-001` | CONFIRMATION Difficulty Invariant | `CONFIRMATION_DIFFICULTY` | 0.2 | ACTIVE |
| `C-DIFF-002` | Difficulty Axis Derivation Registry | `DIFFICULTY_AXIS_DERIVATION` | 0.9 | ACTIVE |
| `C-G09-001` | ADVANCED G09 Realized Gain | `ADVANCED_G09` | 0.2 | ACTIVE |
| `C-SHORTCUT-001` | Shortcut/Degeneracy Adversary | `SHORTCUT_ADVERSARY` | 0.3 | ACTIVE |
| `C-SHORTCUT-002` | Curriculum-Constrained Shortcut Search | `SHORTCUT_CURRICULUM` | 0.7 | ACTIVE |
| `C-PROOF-001` | Proof Obligation PO01~PO16 | `PROOF_OBLIGATION` | 0.3 | ACTIVE |
| `C-CURR-001` | Problem Curriculum Gate | `CURRICULUM_PROBLEM` | 0.2 | ACTIVE |
| `C-CURR-002` | Solution Curriculum Gate | `CURRICULUM_SOLUTION` | 0.3 | ACTIVE |
| `C-FID-001` | Fidelity Formal Contract | `FIDELITY_CONTRACT` | 0.2 | ACTIVE |
| `C-EVID-001` | Validator Evidence Conditional Schema | `VALIDATOR_EVIDENCE` | 0.3 | ACTIVE |
| `C-FAIL-001` | FailurePolicyRegistry Single Source | `FAILURE_POLICY` | 0.3 | ACTIVE |
| `C-FAIL-002` | Failure Scope + Candidate Disposition | `FAILURE_SCOPE` | 0.8 | ACTIVE |
| `C-STATE-001` | Workflow/FinalStatus/JudgeAction + HOLD | `STATE_MODEL` | 0.3 | ACTIVE |
| `C-RETRY-001` | Infra/Content Retry + Idempotency | `RETRY_IDEMPOTENCY` | 0.3 | ACTIVE |
| `C-RETRY-002` | Content Retry Level Limits | `CONTENT_RETRY_LIMITS` | 0.2 | ACTIVE |
| `C-RETRY-003` | Scoped Retry Coordinates + Escalation Semantics | `RETRY_SCOPE_ESCALATION` | 0.8 | ACTIVE |
| `C-RETRY-004` | Generic Stage Attempt Coordinate | `GENERIC_STAGE_ATTEMPT` | 0.9 | ACTIVE |
| `C-RETRY-005` | Failure-specific Escalation Profiles | `RETRY_ESCALATION_PROFILES` | 0.10 | ACTIVE |
| `C-ACTION-001` | WorkflowAction Registry | `WORKFLOW_ACTION_REGISTRY` | 0.10 | ACTIVE |
| `C-SEED-001` | Deterministic Seed Derivation | `SEED_DERIVATION` | 0.3 | ACTIVE |
| `C-DAG-001` | Stage Dependency DAG + Convergence | `STAGE_DAG` | 0.4 | ACTIVE |
| `C-REPRO-001` | LIVE/SNAPSHOT/REPLAY | `REPRODUCIBILITY` | 0.4 | ACTIVE |
| `C-HASH-001` | Canonical Hash Field Semantics | `HASH_CANONICALIZATION` | 0.4 | ACTIVE |
| `C-BUDGET-001` | Question/Prompt/Context Budgets | `BUDGET_CONTRACT` | 0.3 | ACTIVE |
| `C-ATOMIC-001` | Crash-safe Atomic Checkpoint Write | `ATOMIC_CHECKPOINT` | 0.2 | ACTIVE |
| `C-CHECKPOINT-001` | Checkpoint / Resume Canonical Contract | `CHECKPOINT_RESUME` | 0.8 | ACTIVE |
| `C-IPC-001` | Node↔Python IPC + Worker Guard | `PYTHON_IPC` | 0.2 | ACTIVE |
| `C-JUDGE-001` | 100-point Judge Profiles + Anchors | `JUDGE_RUBRIC` | 0.3 | ACTIVE |
| `C-JUDGE-002` | Judge REJECT_ALL Routing | `JUDGE_REJECT_ALL` | 0.8 | ACTIVE |
| `C-JUDGE-003` | Judge Candidate Pool Sufficiency | `JUDGE_POOL_SUFFICIENCY` | 0.9 | ACTIVE |
| `C-JUDGE-004` | Empty-History Novelty Baseline | `NOVELTY_BASELINE` | 0.10 | ACTIVE |
| `C-APPROVAL-001` | Deterministic Question/Exam Approval Reducers | `APPROVAL_REDUCERS` | 0.10 | ACTIVE |
| `C-EXAM-001` | Exam Integration Executable Predicates | `EXAM_GATES` | 0.2 | ACTIVE |
| `C-EXAM-002` | Exam Reopen Budget | `EXAM_REOPEN_BUDGET` | 0.3 | ACTIVE |
| `C-EXAM-003` | Canonical Exam Stage Order + ReopenTargetPolicy | `EXAM_TRANSACTION` | 0.10 | ACTIVE |
| `C-SERIAL-001` | Archive Serializer/Parser Round-Trip | `ARCHIVE_SERIALIZATION` | 0.5 | ACTIVE |
| `C-FREEZE-001` | Freeze Provenance Hash Chain | `FREEZE_PROVENANCE` | 0.3 | ACTIVE |
| `C-PROV-002` | Human Intervention Provenance | `HUMAN_INTERVENTION_PROVENANCE` | 0.8 | ACTIVE |
| `C-SEAL-001` | SEALED Hard Gates | `SEALED_GATES` | 0.2 | ACTIVE |
| `C-PUBSTATE-001` | Content Status / PublicationStatus Separation | `PUBLICATION_STATE` | 0.7 | ACTIVE |
| `C-PUBLISH-001` | CAS + Atomic Content/Index Publish | `ATOMIC_PUBLISH` | 0.4 | ACTIVE |
| `C-PUBLISH-002` | Atomic CAS Primitive / Publish Lock | `ATOMIC_CAS_PRIMITIVE` | 0.8 | ACTIVE |
| `C-PUBLISH-003` | Publish Rollback Ownership / Repair | `PUBLISH_ROLLBACK_OWNERSHIP` | 0.10 | ACTIVE |
| `C-HUMAN-001` | Human Review Queue + Resume Contract | `HUMAN_REVIEW_QUEUE` | 0.3 | ACTIVE |
| `C-AUDIT-001` | Append-only Event-Sourced Audit Log | `AUDIT_EVENT_LOG` | 0.3 | ACTIVE |
| `C-AUDIT-002` | Audit Hash Chain Integrity Gate | `AUDIT_CHAIN_INTEGRITY` | 0.8 | ACTIVE |
| `C-REPORT-001` | Question Review Report Contract | `QUESTION_REVIEW_REPORT` | 0.2 | ACTIVE |
| `C-SOURCE-003` | Source Solver / Min-Solution / Difficulty Baseline | `SOURCE_DIFFICULTY_BASELINE` | 0.11 | ACTIVE |
| `C-CURR-003` | Early Curriculum Contract Lock | `CURRICULUM_CONTRACT_LOCK` | 0.11 | ACTIVE |
| `C-PLAN-004` | Candidate Plan Provenance + Distinct-Plan Survivor | `CANDIDATE_PLAN_PROVENANCE` | 0.11 | ACTIVE |
| `C-ROOT-001` | Deterministic RootCauseResolver Registry | `ROOT_CAUSE_RESOLVER` | 0.11 | ACTIVE |
| `C-SHUFFLE-001` | Choice Shuffle Attempt + Permutation History | `CHOICE_SHUFFLE_ATTEMPT` | 0.11 | ACTIVE |
| `C-EXAM-004` | Deterministic Reopen Impact Metric | `REOPEN_IMPACT_METRIC` | 0.11 | ACTIVE |
| `C-SCOPE-001` | Policy Context Scope Resolver + Approval Scope Split | `POLICY_SCOPE_RESOLUTION` | 0.11 | ACTIVE |
| `C-VISUAL-001` | Visual Production Contract | `VISUAL_PRODUCTION` | 0.2 | PLANNED_V0.2 |
| `C-PRERUN-001` | Pre-run Validation Code Mapping | `PRE_RUN_VALIDATION` | 0.10 | ACTIVE |
| `C-REG-001` | Golden/Holdout/Adversarial/Mutation/Drift | `REGRESSION_RELEASE` | 0.3 | ACTIVE |

v0.11 contract parity 기준:

```text
bootstrapActiveCount = 66
approvedAdditionsV0_8 = 9
approvedAdditionsV0_9 = 3
approvedAdditionsV0_10 = 10
approvedAdditionsV0_11 = 7
approvedAdditionsSinceBootstrap = 29
approvedRemovalsSinceBootstrap = 0
currentActiveCount = 95
plannedContractCount = 1
```

`baseline-bootstrap.json`은 **v0.7 최초 bootstrap 66개 ACTIVE의 immutable 정본**이며 v0.8/v0.9/v0.10/v0.11에서 다시 생성하거나 95개로 덮어쓰지 않는다.

현재 registry는 반드시 다음 식으로 계산한다.

```text
current ACTIVE registry
=
immutable bootstrap ACTIVE
+ approved ADD migrations
- approved DEPRECATE/REMOVE migrations

currentActiveCount
=
bootstrapActiveCount
+ approvedAdditionsSinceBootstrap
- approvedRemovalsSinceBootstrap
```

v0.8 신규 ACTIVE 9개, v0.9 신규 ACTIVE 3개, v0.10 신규 ACTIVE 10개, v0.11 신규 ACTIVE 7개는 각각 `contract-migration.json`에 `changeType=ADD`, `humanApproved=true`, canonical semanticHash를 기록한다. 기존 ACTIVE Contract의 canonical payload가 바뀐 경우에는 같은 ID를 조용히 덮어쓰지 않고 `contractVersion` bump + `changeType=MODIFY` + before/after semanticHash + machine diff + regression PASS + `humanApproved=true`를 필수로 남긴다.

강제 parity:

```text
actual bootstrap entries == bootstrapActiveCount
actual approved ADD migrations == approvedAdditionsSinceBootstrap
actual current ACTIVE entries == currentActiveCount
currentActiveCount == bootstrapActiveCount + approved ADD - approved REMOVE
```

수기 숫자만으로 PASS하지 않는다.

## Canonical Contract Artifact — semantic 정본

Markdown 문단은 설명서일 뿐 Contract semantic 정본이 아니다. ACTIVE Contract 하나마다 반드시 다음 파일을 가진다.

```text
alive/engine/contracts/contracts/{contractId}.contract.json
```

최소 구조:

```json
{
  "contractId": "C-G09-001",
  "contractVersion": "1.0",
  "status": "ACTIVE",
  "applicability": {},
  "requiredPredicates": [],
  "thresholds": [],
  "requiredEvidence": [],
  "failureCodes": [],
  "accessPolicy": null,
  "artifactRefs": [],
  "changePolicy": "NO_SILENT_CHANGE",
  "canonicalContractPayload": {},
  "semanticHash": ""
}
```

`semanticHash`는 § Hash Canonicalization 규칙으로 `canonicalContractPayload`만 hash한다. Markdown heading/문장/절 번호는 hash 대상이 아니다.

ACTIVE Contract의 `semanticHash`가 바뀌면 엔진은 의미 약화 여부를 자연어로 추론하여 자동 승인하지 않는다. 다음 중 하나만 허용한다.

```text
semanticHash unchanged
OR
version bump + machine diff + migration record + regression PASS + humanApproved=true
```

즉 **해시 변화 자체를 승인 필요 사건으로 처리**하여 “약화인지 아닌지”를 LLM 판단에 맡기지 않는다.

## Bootstrap Baseline

v0.2~v0.6에는 완전한 machine contract artifact가 없었으므로 v0.7 최초 한 번만 bootstrap baseline을 만든다.

정본:

```text
alive/engine/contracts/baseline-bootstrap.json
```

각 entry:

```json
{
  "contractId": "C-SEED-001",
  "sourceVersion": "0.3",
  "sourceEvidenceRefs": [],
  "artifactRefs": [],
  "canonicalContractPayload": {},
  "semanticHash": "",
  "humanApproved": true
}
```

강제:

```text
bootstrap entry 없는 과거 ACTIVE Contract → CONTRACT_BASELINE_INCOMPLETE
humanApproved != true → baseline 채택 금지
bootstrap 완료 후 baseline-bootstrap.json은 immutable
이후 변경은 normal contract version/migration 절차만 사용
```

합성 hash:

```text
contractBaselineHash
contractRegistryHash
contractCoverageHash
```

세 hash 모두 Phase 0 Release evidence와 Run Environment Lock에 포함한다.

`PLANNED_V0.2`는 ACTIVE baseline count에는 포함하지 않지만 삭제 시 명시적 migration/deprecation 기록을 요구한다.

## Cross-Version Contract Diff Gate

새 계획서/Schema/Registry를 Release 후보로 올리기 전에:

```text
previous ACTIVE `*.contract.json` IDs + canonical semantic hashes
vs
new ACTIVE `*.contract.json` IDs + canonical semantic hashes
```

를 비교한다.

다음은 `CONTRACT_REGRESSION_DETECTED` / Release Block이다.

```text
필수 Contract ID 누락
ACTIVE → 암묵적 삭제
승인 없는 ACTIVE semanticHash 변경
Contract semantics 약화
threshold 삭제 또는 완화
required gate → optional 변경
FAIL/HOLD predicate 삭제
Evidence requirement 완화
source blinding 범위 확대
I3 mandatory → I2 downgrade
SEALED/PUBLISHED precondition 완화
```

의도된 폐기/대체만 다음을 모두 만족할 때 허용한다.

```text
status = DEPRECATED
replacementContractId = <ACTIVE contract>
humanApproved = true
migrationNote 존재
regression suite PASS
```

## Self-Application Rule

v0.11은 v0.7의 immutable 66 ACTIVE bootstrap을 보존하고, v0.8의 9개 + v0.9의 3개 + v0.10의 10개 + v0.11의 7개 ACTIVE 추가분은 승인된 migration/addition record와 함께 machine diff되어야 한다. `contract-coverage.json`, `baseline-bootstrap.json`, 개별 `*.contract.json`, semantic hash, diff result 중 하나라도 없으면 Phase 0은 `CONTRACT_FREEZE_FAIL`이다.

v0.11에서 기존 ACTIVE 의미가 수정되는 Contract(`C-SEQ-001`, `C-SOURCE-001`, `C-DIFF-002`, `C-IR-001`, `C-GATE-003`, `C-PLAN-003`, `C-JUDGE-003`, `C-ACTION-001`, `C-RETRY-001`, `C-RETRY-003`, `C-RETRY-004`, `C-FAIL-001`, `C-FAIL-002`, `C-EVID-001`, `C-APPROVAL-001`, `C-EXAM-001`, `C-EXAM-002`, `C-EXAM-003`, `C-SERIAL-001`, `C-PUBSTATE-001`, `C-PUBLISH-001`, `C-PUBLISH-003`, `C-HUMAN-001`)는 각각 `changeType=MODIFY`, contractVersion bump, before/after semanticHash, machine diff, regression PASS, `humanApproved=true` migration record가 없으면 v0.11 registry에 채택하지 않는다.


---

# 3. 상위 정본과 Policy Bundle

우선순위:

```text
사용자 현재 지시
> ALIVE_MASTER_RULEBOOK_v9.1_STABLE
> ALIVE_SIMILAR_ADVANCED_VISUAL_REGEN_SPEC_v1.0
> ALIVE_STRUCTURED_QUESTION_SCHEMA
> ALIVE_VALIDATION_SIDECAR_SCHEMA
> ALIVE_PIPELINE_RUNTIME_SPEC
> ALIVE_PROMPT_COMPILER_SPEC
> ALIVE_VISUAL_SPEC
> 본 v0.11 실행 계약
```

RUN INIT 시 상위 정책 전체를 Bundle로 lock한다.

```json
{
  "policyBundleManifest": [
    {"path": "...MASTER...", "hash": "..."},
    {"path": "...SIMILAR_ADVANCED...", "hash": "..."},
    {"path": "...SCHEMA...", "hash": "..."},
    {"path": "...RUNTIME...", "hash": "..."},
    {"path": "...COMPILER...", "hash": "..."},
    {"path": "...VISUAL...", "hash": "..."}
  ],
  "policyBundleHash": "..."
}
```

Policy file 하나라도 중간 변경:

```text
RUN_ENVIRONMENT_DRIFT
→ BLOCKED
```

---

# 4. 전체 실행 모델

```text
RUN INIT + ENVIRONMENT LOCK
↓
Q01 PROOF TRANSACTION
↓
Q01 LOCALLY_FROZEN
↓
Q02
↓
...
↓
Q24 LOCALLY_FROZEN
↓
EXAM INTEGRATION
↓
필요 문항 REOPENED
↓
Stage DAG 기반 재검
↓
LOCALLY_FROZEN count == expectedQuestionCount
↓
PACKAGE BUILD
↓
PACKAGE ROUND-TRIP
↓
SEALED
↓
PUBLISH PRECONDITION CAS
↓
LATEST ARCHIVE DUPLICATE RECHECK
↓
ATOMIC PUBLISH
↓
POST-PUBLISH SMOKE
↓
PUBLISHED
```

문항 간 병렬 처리 금지.

Candidate A/B/C만 문항 내부 병렬 허용.

`expectedQuestionCount`는 ExamRun config의 canonical 필드이며 production 기본값은 `24`다. 본 문서의 “24문항” 표기는 기본 profile을 뜻한다. 다른 시험 형식은 explicit blueprint가 `expectedQuestionCount`를 지정하며 completeness/seal gate는 항상 이 값을 사용한다.

---

# 5. Runtime State / Cleanup / Production Isolation

Runtime state 정본 경로:

```text
../AI_CENTER/ROUNDS/alive/{runId}/
```

권장 구조:

```text
manifest.json
run-events.ndjson
snapshots/
q01/ ... qNN/
exam/
package-staging/
publish-staging/
```

강제:

```text
LOCALLY_FROZEN 이전 production archive write 금지
SEALED 이전 production publish 금지
failed/rejected candidate는 production 경로에 절대 쓰지 않음
incomplete asset/python artifact는 cleanup
complete validation evidence와 audit event는 보존
```

Worker/process crash 시 마지막 완전 checkpoint로 복귀하고 미완성 stage artifact는 폐기한다.

---

# 6. Canonical Stage Order

```text
Qn-00 ENVIRONMENT ASSERT
Qn-01 SOURCE LOCK
Qn-02 SOURCE PARSE A
Qn-03 SOURCE INDEPENDENT INGESTION B
Qn-04 SOURCE SEMANTIC INGESTION FIDELITY
Qn-04A CURRICULUM CONTRACT BUILD + LOCK
Qn-04B SOURCE BASELINE CAPABILITY PREFLIGHT
Qn-05A SOURCE INDEPENDENT SOLVER / EXACT BASELINE
Qn-05B SOURCE MIN-SOLUTION BASELINE
Qn-05C SOURCE DIFFICULTY BASELINE
Qn-05D SOURCE ADMISSIBILITY
Qn-06 SOURCE FINGERPRINT
Qn-07 REQUIRED GATE MANIFEST

Qn-08 TRANSFORMATION PLAN x3
Qn-09 PLAN STATIC CONTRACT
Qn-10 PLAN DIVERSITY
Qn-11 PLAN CRITIC

Qn-12 CONSTRUCTIVE BUILD A/B/C
Qn-13 BUILDER LOCAL EXACT
Qn-14 PARAMETER ROBUSTNESS

Qn-15 DISTRACTOR BUILD               [MCQ]
Qn-16 VISUAL BUILD                   [visual]

Qn-17 PROBLEM REALIZER
Qn-18 PROBLEM SEMANTIC ROUND-TRIP
Qn-19 SOLUTION REALIZER
Qn-20 SOLUTION SEMANTIC ROUND-TRIP
Qn-21 SOLUTION ↔ ANSWER PARITY
Qn-22 LANGUAGE INTEGRITY
Qn-23 FINAL STUDENT PAYLOAD SNAPSHOT

Qn-24 ANTI-CLONE IR
Qn-25 ANTI-CLONE FINAL TEXT
Qn-26 SHORTCUT / MIN-SOLUTION DISCOVERY
Qn-27 FINAL DIFFICULTY / G09

Qn-28 INDEPENDENT SOLVER
Qn-29 FINAL EXACT CLAIM COVERAGE
Qn-30 PROOF OBLIGATION

Qn-31 CURRICULUM PROBLEM
Qn-32 CURRICULUM SOLUTION
Qn-33 FIDELITY
Qn-34 DISTRACTOR FINAL               [MCQ]
Qn-35 VISUAL FINAL                   [visual]
Qn-36 ARCHIVE/BATCH DUPLICATE

Qn-37 FINAL JUDGE
Qn-38 QUESTION FINALSTATUS REDUCER
Qn-39 FREEZE PROVENANCE
Qn-40 LOCALLY_FROZEN
```

Early source-stage hard failures:

```text
Qn-04A Curriculum Contract build/lock failure → CURRICULUM_CONTRACT_UNVERIFIED
Qn-04B required source capability missing       → CAPABILITY_PRECHECK_FAIL
Qn-05A/B/C Source baseline incomplete           → SOURCE_BASELINE_UNVERIFIED
Qn-05D Source admissibility failure              → SOURCE_INVALID / source-specific code
```

Candidate Plan provenance is created atomically with Qn-12 Candidate build and validated before Qn-13.


---

# 7. MODE / Independence Contract

## Canonical mode field

`mode.schema.json`의 `mode` enum만 사용한다.

```text
EXAM_FOLLOWUP
STRICT_VARIANT
```

조건부 schema:

```text
mode = EXAM_FOLLOWUP
→ followupKind REQUIRED: CONFIRMATION | ADVANCED

mode = STRICT_VARIANT
→ followupKind MUST be absent/null
```

자연어 이름이나 임의 문자열을 `mode`로 사용하지 않는다. `allowedModes`, Stage applicability, Plan Critic, RequiredGateManifest는 모두 이 canonical enum을 참조한다.

## EXAM_FOLLOWUP

```text
followupKind = CONFIRMATION | ADVANCED
```

CONFIRMATION은 핵심 인지축을 보존하고, ADVANCED는 실제 cognitive gain이 증명되어야 한다.

## STRICT_VARIANT

별도 semantics를 가진다.

### LOCK

```text
questionType
conceptKeys
problemTypeKey
sourceObjective.targetType
solutionEntry
solutionGraph core
decisionCount
branchingLoad
difficultyRole
curriculum generation
visual topology role
```

### CHANGE 허용

```text
numeric parameters
constants
symbol names
derived choice values
derived answer
numeric/label-dependent visual parameters
```

### STRICT_VARIANT Hard Rules

```text
structural TransformOp 금지
Advanced Cognitive Op 금지
objective role 변경 금지
new condition 추가 금지
decisionCount delta != 0 금지
branchingLoad delta != 0 금지
locked core 변경 금지
visual topology role 변경 금지
```

`NUMERIC_CLONE`은 approved STRICT_VARIANT에는 적용하지 않는다. 대신:

```text
STRICT_LOCK_VIOLATION
STRICT_DIFFICULTY_DRIFT
STRICT_VISUAL_TOPOLOGY_DRIFT
```

를 Hard Gate로 검사한다.

## Independent Solver I2 — Stateless Isolation

I2는 단순 새 호출이 아니다.

```text
new stateless request
conversation history = []
builder response = excluded
mutation plan = excluded
intended answer = excluded
intended SolutionIR = excluded
solutionGraph = excluded
validator history = excluded
```

Solver allowlist:

```text
final problem text
final choices
required final asset
question type
answer form only if format interpretation에 필요
```

allowlist 밖 field가 있으면 `SOLVER_ISOLATION_BREACH`이며 호출 자체를 차단한다.

## I3 Mandatory Routing

Canonical predicate:

```text
followupKind == ADVANCED
OR branchCount >= 2
OR abstractionLoad >= 2
OR visualRiskClass in [HIGH, CRITICAL]
OR symbolicFallbackUsed == true
OR contentRetryCount >= 2
OR previousSolverExactConflict == true
```

I3는 설계/Builder와 다른 model family 또는 독립 deterministic/hybrid validator service를 사용한다.

I3 capability가 없으면:

```text
I3_CAPABILITY_UNAVAILABLE
→ BLOCKED
```

조용한 I2 downgrade는 금지한다.

## CandidateRuntime canonical fields

I3 predicate가 읽는 runtime 값은 임의 context 변수가 아니라 `candidate-runtime.schema.json` 정본 필드다.

```json
{
  "visualRiskClass": "NONE",
  "symbolicFallbackUsed": false,
  "contentRetryCount": 0,
  "previousSolverExactConflict": false,
  "reopenGeneration": 0
}
```

`contentRetryCount`는 **현재 Question Transaction 전체의 누적 Content Retry 횟수(L1+L2+L3)** 이다. Candidate별/Level별 개별 카운트가 아니며 Infra Retry, DAG 단순 재실행, Exam Reopen은 포함하지 않는다. I3 predicate의 `contentRetryCount >= 2`는 이 question-scoped total만 읽는다. Level별/branch별 시도 횟수는 §47의 `RetryCoordinates`에서 별도로 관리한다.

`visualRiskClass` enum:

```text
NONE | LOW | MEDIUM | HIGH | CRITICAL
```

`branchCount`는 SolutionGraph, `abstractionLoad`는 DifficultyVector에서 직접 읽으며 CandidateRuntime에 중복 저장하지 않는다.

## CapabilityManifest — Run preflight

RUN INIT에서 capability를 lock한다.

```json
{
  "supportedFamilies": [],
  "supportsVisual": false,
  "supportsI3": true,
  "availableExactOps": [],
  "availableModels": [],
  "supportsSemanticParserB": true,
  "supportsSourceIngestionB": true,
  "supportsAtomicHeadCAS": true,
  "supportsExclusivePublishLock": false
}
```

Production publish capability는 `supportsAtomicHeadCAS == true` 또는 `supportsExclusivePublishLock == true` 중 최소 하나를 요구한다. 단순 head read + 일반 write만 가능한 환경은 publish capability 미충족이다.

`capabilityManifestHash`를 Run Environment에 포함한다. capability preflight는 두 번의 deterministic projection으로 나눈다.

```text
Qn-04B Source Baseline Preflight
→ Source ProblemIR/family + CurriculumContract가 요구하는 source solver/exact/hybrid capability 검사

Qn-07 Post-Fingerprint Preflight
→ RequiredGateManifest/visual/I3/candidate production capability 검사
```

두 preflight 모두 Build 전에 완료되어야 한다.

```text
required capability ⊄ CapabilityManifest
→ CAPABILITY_PRECHECK_FAIL
→ BLOCKED
```

지원 불가를 Builder/Validator 중간에서 뒤늦게 발견해 silent fallback 하는 것을 금지한다.

---

# 8. Core Schema Set

```text
problem-ir.schema.json
solution-ir.schema.json
solution-graph.schema.json
difficulty-vector.schema.json
difficulty-axis-derivation.schema.json
algebra-operation-cost-registry.schema.json
answer-complexity-cost-registry.schema.json
interpretation-dependency-graph.schema.json
representation-level-registry.schema.json
difficulty-role-derivation.schema.json
judge-pool-policy.schema.json
run-environment-spec.schema.json
source-fingerprint.schema.json
source-baseline-evidence.schema.json
curriculum-contract.schema.json
candidate-plan-provenance.schema.json
root-cause-resolver.schema.json
choice-shuffle-policy.schema.json
reopen-impact-metric.schema.json
policy-context-scope.schema.json
fidelity-contract.schema.json
required-gate-manifest.schema.json
mutation-plan.schema.json
transform-contract.schema.json
contract-predicate.schema.json
candidate.schema.json
candidate-runtime.schema.json
capability-manifest.schema.json
mode.schema.json
solver-routing-registry.schema.json
solver-verification-profile.schema.json
stage-applicability-predicate.schema.json
retry-coordinate.schema.json
checkpoint.schema.json
human-intervention-manifest.schema.json
audit-chain-validation.schema.json
publish-cas.schema.json
seed-policy.schema.json
content-retry-policy.schema.json
retry-escalation-profile.schema.json
workflow-action-registry.schema.json
gate-instance-result.schema.json
approval-reducer.schema.json
exam-stage-registry.schema.json
reopen-target-policy.schema.json
plan-pool-policy.schema.json
publish-rollback.schema.json
novelty-baseline-policy.schema.json
milestone-capability-profile.schema.json
pre-run-validation.schema.json
proof-obligation.schema.json
validation-result.schema.json
judge-result.schema.json
workflow-state.schema.json
publication-status.schema.json
publication-policy.schema.json
failure-policy.schema.json
advisory-code.schema.json
stage-registry.schema.json
stage-dependency.schema.json
replay-snapshot.schema.json
contract.schema.json
contract-migration.schema.json
contract-baseline-bootstrap.schema.json
human-review-queue.schema.json
question-review-report.schema.json
archive-serialization.schema.json
archive-serialization-sidecar.schema.json
exam-run.schema.json
exam-final.schema.json
event.schema.json
```

모든 payload:

```text
schemaVersion
engineVersion
```

필수.

---

# 9. Canonical ProblemIR

```json
{
  "schemaVersion": "1.0",
  "problemUid": "",
  "questionType": "MCQ",
  "symbols": [],
  "givens": [],
  "constraints": [],
  "objective": {},
  "choices": [],
  "answerType": "",
  "units": [],
  "visualRefs": [],
  "curriculumClaims": [],
  "choiceOrderMutable": false,
  "solverClaims": [],
  "semanticHash": ""
}
```


## choiceOrderMutable canonical predicate

기본값은 `false`다. 아래를 **모두** 증명한 경우에만 `true`다.

```text
보기 순서 자체가 수학적 의미를 가지지 않음
problem text가 ①/②/첫째/둘째/앞/뒤 등 선택지 위치를 직접 참조하지 않음
SolutionIR/final solution이 선택지 위치를 논리 조건으로 사용하지 않음
asset이 선택지 위치와 의미적으로 결합되지 않음
choice semantic ID가 순서와 독립적으로 보존 가능
```

하나라도 불명확하면 `false`. 이 predicate evidence는 ProblemIR에 연결하고 Choice Shuffle 전에 다시 확인한다.

## QuestionType canonical enum

ProblemIR의 `questionType`은 다음 enum만 허용한다.

```text
MCQ
SHORT_ANSWER
CONSTRUCTED_RESPONSE
```

표시용 한국어는 serializer/UI label에서만 사용한다.

```text
MCQ                  → 객관식
SHORT_ANSWER         → 단답형
CONSTRUCTED_RESPONSE → 서술형
```

`"객관식"`, `"서술형"` 같은 자연어 문자열을 Gate predicate, StageRegistry, rubric routing, schema branching에 직접 사용하지 않는다. 모든 applicability는 canonical enum을 비교한다.

---

# 10. Canonical SolutionIR

```json
{
  "schemaVersion": "1.0",
  "solutionUid": "",
  "problemUid": "",
  "steps": [],
  "finalAnswerAst": {},
  "answerType": "",
  "solutionGraphHash": ""
}
```

학생용 solution은:

```text
SolutionIR
→ Solution Realizer
→ final solution text
→ Independent Solution Parser
→ canonicalized reconstructed SolutionIR
→ semantic equality
```

를 통과해야 한다.

---

# 11. SolutionGraph 정본

Node:

```json
{
  "id": "n1",
  "type": "DECISION",
  "op": "SELECT_CASE",
  "conceptKey": "",
  "inputs": [],
  "outputs": []
}
```

Node.type:

```text
READ
NORMALIZE
DERIVE
DECISION
BRANCH
COMPUTE
TRANSFORM
VERIFY
ANSWER
```

Edge:

```json
{
  "from": "n1",
  "to": "n2",
  "label": ""
}
```

기계 파생:

```text
decisionCount
branchCount
maxBranchFactor
graphDepth
operationCount
solutionGraphSignature
```

---

# 12. DifficultyVector 정본

```json
{
  "conceptDepth": 1,
  "interpretationLoad": 1,
  "decisionCount": 2,
  "branchingLoad": 0,
  "algebraLoad": 1,
  "abstractionLoad": 1,
  "visualReasoningLoad": 0,
  "answerComplexity": 1,
  "difficultyRole": "REFERENCE",
  "interpretationDependencyGraphHash": "",
  "representationProfileHash": ""
}
```

산출 source를 evidence에 남긴다.

`difficultyRole`은 Agent가 작성하지 않고 MODE + source/candidate DifficultyVector + G09 결과에서 결정론적으로 파생한다.

```text
REFERENCE                    [source only]
STRICT_VARIANT_EQUIVALENT
CONFIRMATION_EQUIVALENT
ADVANCED_PLUS_1
ADVANCED_PLUS_2_PLUS
```

role derivation version은 `difficultyRoleDerivationVersion` config로 고정하고 Run Environment에 hash한다.

## DifficultyAxisDerivation Registry — 기계 산출 정본

DifficultyVector의 값은 Agent rubric 자유평가로 만들지 않는다. `difficulty-axis-derivation.json`이 유일한 정본이며 모든 축의 산출 source와 중간 score를 evidence로 남긴다.

공통 범위:

```text
conceptDepth        = integer 0..3
interpretationLoad  = integer 0..3
decisionCount       = integer >= 0        [raw count]
branchingLoad       = integer 0..3
algebraLoad         = integer 0..3
abstractionLoad     = integer 0..3
visualReasoningLoad = integer 0..3
answerComplexity    = integer 0..3
```

기계 산출:

```text
decisionCount
= count(solutionGraph.nodes where type == DECISION)

branchCount
= count(solutionGraph.nodes where type == BRANCH)
```

`conceptDepth`:

```text
minimum curriculum-valid solution path의 conceptKey sequence에서
연속 동일 conceptKey를 collapse
→ curriculum prerequisite DAG와 대조한 conceptTransitionDepth 계산

conceptTransitionDepth == 0 → 0
conceptTransitionDepth == 1 → 1
conceptTransitionDepth == 2 → 2
conceptTransitionDepth >= 3 → 3
```

미등록 `conceptKey` 또는 prerequisite relation 미해결은 축 값을 추정하지 않고 `DIFFICULTY_AXIS_UNVERIFIED`.

`interpretationLoad`는 `InterpretationDependencyGraph`에서 직접 파생한다.

```text
interpretationScore =
dependencyCount + max(0, dependencyDepth - 1)

score == 0 → 0
1 <= score <= 2 → 1
3 <= score <= 4 → 2
score >= 5 → 3
```

`branchingLoad`:

```text
branchCount == 0
→ 0

branchCount == 1 AND maxBranchFactor <= 2
→ 1

branchCount <= 2 AND maxBranchFactor <= 3
→ 2

otherwise
→ 3
```

`algebraLoad`:

```text
algebraOperationCost =
sum(algebra-operation-cost-registry[canonical SolutionIR op])
over curriculum-constrained minimum valid solution path

cost <= 2   → 0
3..6        → 1
7..12       → 2
>= 13       → 3
```

미등록 canonical op는 임의 weight를 주지 않고 `DIFFICULTY_AXIS_UNVERIFIED`.

`abstractionLoad`:

```text
abstractionLoad
=
curriculum-constrained minimum valid solution path의
maxRepresentationLevel

L0 → 0
L1 → 1
L2 → 2
L3 → 3
```

`visualReasoningLoad`:

```text
visualDependency == NONE → 0
```

Visual Production Contract가 ACTIVE인 family에서는 `visual-reasoning-load-registry.json`의 deterministic predicate로만 1..3을 산출한다. 해당 registry 지원이 없는 visual family는 숫자를 추정하지 않고 Capability Block한다.

`answerComplexity`:

```text
answerAstCost =
answer-complexity-cost-registry를 적용한 canonical answer AST cost

cost <= 1 → 0
2..4      → 1
5..8      → 2
>= 9      → 3
```

QuestionType별 허용 Answer AST node/type은 schema로 제한하며 미등록 node cost는 `DIFFICULTY_AXIS_UNVERIFIED`.

정본 bundle:

```text
difficultyAxisDerivationVersion
difficultyAxisDerivationHash
algebraOperationCostRegistryHash
answerComplexityCostRegistryHash
visualReasoningLoadRegistryHash [visual capability에서만]
```

`difficultyAxisDerivationHash`는 위 registry들의 canonical hash를 합성한 hash다. 이 hash는 Run Environment Lock + Freeze Provenance에 반드시 포함한다. CONFIRMATION/G09/Judge는 저장된 숫자를 신뢰하지 않고 해당 hash/version으로 재계산 가능한 evidence가 있을 때만 DifficultyVector를 사용한다.

---

# 13. SourceFingerprint 정본

```json
{
  "sourceUid": "",
  "sourceHash": "",
  "problemIrHash": "",
  "curriculumContractHash": "",
  "sourceBaselineEvidenceHash": "",
  "sourceDifficultyBaselineHash": "",
  "standardCourse": "",
  "standardUnitKey": "",
  "conceptKeys": [],
  "problemTypeKey": "",
  "templateKey": "",
  "sourceObjective": {},
  "solutionEntry": {},
  "solutionGraph": {},
  "difficultyVector": {},
  "visualDependency": "NONE",
  "answerForm": "",
  "fidelityContract": {},
  "mutableSurface": [],
  "forbiddenTransforms": [],
  "conditionSignature": [],
  "trapTags": []
}
```

---

# 14. Source Ingestion Independence

Parser A와 Ingestion Verifier B는 production에서 최소 I3 equivalent를 요구한다.

```text
Parser A model family != Verifier B model family
OR
Parser A = LLM, Verifier B = deterministic/hybrid parser
```

같은 conversation/context 사용 금지.

동일 model family를 반드시 써야 하는 환경:

```text
SOURCE_INGESTION_INDEPENDENCE_UNAVAILABLE
→ BLOCKED
```

---

# 15. Source Ingestion Proof / Admissibility / Applicability

Source Parser A 하나만 믿지 않는다.

```text
SOURCE TEXT
→ Parser A → Source ProblemIR

SOURCE TEXT
→ Independent Ingestion B → SemanticClaimSet

Source ProblemIR
↔ canonicalized SemanticClaimSet-B
↔ original source semantic spans
```

## Ingestion Fidelity Hard Diff

다음 semantic claim은 양쪽에서 독립 추출 후 canonical compare한다.

```text
symbols + domains + quantifiers
givens / constraints
objective / target role
answer type / units
choice semantics
visual-text dependency claims
curriculum claims needed to interpret the question
```

claim 누락/추가/변경 또는 original source span과의 근거 연결이 불완전하면:

```text
SOURCE_INGESTION_UNVERIFIED
→ BLOCKED
```

원문 자체 오류와 IR capability gap을 분리한다.

```text
SOURCE_INVALID
IR_EXPRESSIVENESS_INSUFFICIENT
SOURCE_INGESTION_UNVERIFIED
```

## Source Admissibility Hard Predicates

```text
SOURCE_TEXT_COMPLETE
SOURCE_PARSE_COMPLETE
SOURCE_MATH_VALID
SOURCE_UNIQUE_ANSWER
SOURCE_CHOICE_MAPPING_VALID
SOURCE_SOLUTION_CONSISTENT          [source solution 존재 시]
SOURCE_DOMAIN_COMPLETE
SOURCE_VISUAL_TEXT_CONSISTENT       [visual source]
SOURCE_CURRICULUM_VALID
```

원문 자체 오류:

```text
SOURCE_INVALID
→ BLOCKED
```

IR이 원문 의미를 표현할 수 없음:

```text
IR_EXPRESSIVENESS_INSUFFICIENT
→ BLOCKED / CAPABILITY_GAP
```

## Source solution 없음

```text
SOURCE_SOLUTION_CONSISTENT = NOT_APPLICABLE
reasonCode = SOURCE_SOLUTION_ABSENT
```

단, source question validity / unique answer / choice mapping / domain / curriculum은 계속 REQUIRED다.

---


# 15A. Early Curriculum Contract Lock

`curriculum-contract.schema.json`은 Qn-04A에서 생성·고정되는 Question-scoped canonical 계약이다.

```json
{
  "courseVersion": "",
  "unitKey": "",
  "subUnitKey": "",
  "allowedConceptKeys": [],
  "allowedOperations": [],
  "allowedTheorems": [],
  "forbiddenConceptKeys": [],
  "forbiddenTerminology": [],
  "curriculumMasterHash": "",
  "curriculumContractHash": ""
}
```

생성 규칙:

```text
Source ProblemIR
+ canonical course/unit metadata
+ locked curriculum master
→ CurriculumContract
→ schema validate
→ canonical hash
→ Qn-04A LOCK
```

강제:

```text
Plan Critic
Transform Contract curriculum predicate
Builder solver routing
Shortcut/Min-Solution search
V2-P Problem Curriculum
V2-S Solution Curriculum
```

는 모두 **동일 `curriculumContractHash`** 를 입력으로 사용한다. Candidate별로 curriculum 범위를 임의 확대/축소하거나 Gate마다 새 계약을 재생성하지 않는다.

`curriculumContractHash`가 Qn-04A 이후 바뀌면 Qn-08 이후 모든 evidence를 DAG로 INVALIDATED하고 Question Transaction을 새 generation으로 재시작한다.

Schema/master lookup/contract canonicalization이 완전하지 않으면:

```text
CURRICULUM_CONTRACT_UNVERIFIED
→ QUESTION BLOCKED
```

Plan을 시작하지 않는다.

---

# 15B. Source Solver / Min-Solution / Difficulty Baseline

Candidate Difficulty를 Source와 비교하고 Source Admissibility의 `SOURCE_MATH_VALID / SOURCE_UNIQUE_ANSWER / SOURCE_CHOICE_MAPPING_VALID`를 증명하려면 Source Difficulty baseline이 먼저 완전해야 한다. Source solution 원문 존재 여부와 무관하게 아래 analytical evidence chain을 생성한 뒤 Qn-05D Source Admissibility가 그 evidence를 소비한다.

```text
Qn-04B SOURCE BASELINE CAPABILITY PREFLIGHT
→ Source ProblemIR/family + CurriculumContract로 required exact/hybrid/source-solver capability 계산
→ CapabilityManifest와 비교
→ PASS 후에만 Qn-05A 진입

Qn-05A SOURCE INDEPENDENT SOLVER / EXACT BASELINE
→ sourceBaselineSolutionIR
→ exact/hybrid claim coverage
→ sourceAnswerParity

Qn-05B SOURCE MIN-SOLUTION BASELINE
→ CurriculumContract 범위 안에서 FIND_MIN_SOLUTION/FUZZ
→ sourceMinSolutionGraph
→ sourceMinimumCurriculumValidPath
→ sourceShortcutEvidenceHash

Qn-05C SOURCE DIFFICULTY BASELINE
→ DifficultyAxisDerivationRegistry
→ Source DifficultyVector
→ sourceDifficultyBaselineHash
```

`sourceBaselineSolutionIR`은 **원문 출판 해설을 복원했다고 주장하는 데이터가 아니라 엔진의 독립 분석 artifact**다. 원문 solution이 존재하면 정합 비교 evidence로 사용하되 그대로 신뢰하지 않는다.

Source baseline Hard Rules:

```text
source answer unique
source independent solver ↔ exact/hybrid answer parity
minimumCurriculumValidPath 존재
DifficultyAxis 전 required axis 산출 가능
difficultyAxisDerivationHash 일치
CurriculumContractHash 일치
```

Qn-05D Source Admissibility는 위 PASS evidence를 required input으로 사용한다. 특히 `SOURCE_MATH_VALID`, `SOURCE_UNIQUE_ANSWER`, `SOURCE_CHOICE_MAPPING_VALID`를 Parser의 추정값만으로 PASS시키지 않는다.

하나라도 미완료:

```text
SOURCE_BASELINE_UNVERIFIED
→ QUESTION BLOCKED / HUMAN_REVIEW
```

Source 단계에서는 Candidate-scoped `DIFFICULTY_AXIS_UNVERIFIED`를 재사용하지 않는다.

`SourceFingerprint.difficultyVector`는 Qn-05C PASS artifact만 참조한다. Agent가 Qn-06에서 임의 DifficultyVector를 새로 작성하는 것을 금지한다.

Freeze Provenance에는 최소:

```text
curriculumContractHash
sourceBaselineEvidenceHash
sourceShortcutEvidenceHash
sourceDifficultyBaselineHash
```

를 포함한다.

---

# 16. Source Blinding Access Matrix

Source Blinding의 목적은 **원문 문장 복사 방지**이지 canonical 수학 IR을 숨기는 것이 아니다. 코드 Transform handler는 Source ProblemIR의 정확한 AST를 읽을 수 있어야 하며, Judge는 최종 학생 노출 문장을 실제로 평가할 수 있어야 한다.

| Role | Source text | Source ProblemIR | Fingerprint | Plan | CandidateIR | Final student payload | Intended answer | Intended SolutionIR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Source Parser A | O | 생성 | X | X | X | X | source only | source only |
| Ingestion Verifier B | O | X | X | X | X | X | X | X |
| Analyst | O | O | 생성 | X | X | X | source only | source only |
| Source Baseline Solver | O(student-visible source payload only) | O | X | X | X | X | X | X |
| Architect | X | X | O | 생성 | X | X | X | X |
| Plan Critic | X | X | O | O | X | X | X | X |
| Builder / Transform Handler | X | **O(full canonical IR)** | O | O | 생성 | X | 내부 계산 | 생성 |
| Problem Realizer | X | X | 제한 payload | O(summary) | O(problem only) | 생성(problem text) | X | X |
| Solution Realizer | X | X | 제한 payload | X | O(summary) | 생성(solution text) | O | O |
| Independent Solver | X | X | X | X | X | **O(final problem/choices/asset)** | X | X |
| Final Judge | X | O(summary) | O | O(summary) | O(summary) | **O(final problem/choices/asset/solution text)** | 검증결과만 | 검증결과만 |
| Duplicate Gate | O | O(signature) | O | X | O(signature) | O(final problem/choices/asset) | X | X |

Judge allowlist는 최소 다음을 명시한다.

```text
finalProblemText
finalChoices
finalAssetRefs
finalSolutionText
candidateIrSummary
validationSummary
previousFrozenNoveltySummary
cloneMetricSummary
difficultySummary
```

Builder는 Source text를 받지 않으며 full canonical Source ProblemIR만 받는다.

`Source Baseline Solver`의 `Source text`는 raw JS/PDF metadata 전체가 아니라 **학생에게 실제 노출되는 source problem text + choices + required asset만** 뜻한다. source answer field, source-authored solution, answer key metadata는 allowlist에서 금지한다.


모든 역할별 `*-input.schema.json`은 allowlist 방식이다. undeclared field는:

```text
ACCESS_POLICY_BREACH
```

이며 호출 전에 차단한다. Access matrix 변경은 `C-BLIND-001` semantic hash 변경으로 기록하며, 범위 확대는 Regression Gate 승인 없이는 불가하다.

---

# 17. RequiredGateManifest 자동 생성

사람이 두 군데에서 목록을 수기 관리하지 않는다.

`StageRegistry`에서 자동 생성한다.

Stage 정의:

```json
{
  "stageId": "Qn-34",
  "name": "DISTRACTOR_FINAL",
  "ownerScope": "CANDIDATE",
  "ownerCandidateDisposition": "RETRY",
  "hardGate": true,
  "applicability": {
    "predicate": "QUESTION_TYPE_EQ",
    "value": "MCQ"
  },
  "requiredStatus": ["PASS"],
  "naAllowed": true
}
```

## Stage Applicability Predicate DSL

`applicability`는 문자열 expression/eval을 금지하고 `stage-applicability-predicate.schema.json`의 AST만 허용한다. 초기 predicate enum:

```text
ALWAYS
QUESTION_TYPE_EQ
MODE_EQ
FOLLOWUP_KIND_EQ
VISUAL_DEPENDENCY_EQ
VISUAL_DEPENDENCY_NE
CLAIM_TARGET_EXISTS
AND
OR
NOT
```

모든 leaf 값은 canonical enum/schema 값만 사용한다. 알 수 없는 predicate, 문자열 JS expression, runtime `eval`은 `STAGE_APPLICABILITY_SCHEMA_FAIL → BLOCKED`다. `ownerScope`는 Stage failure의 기본 소유 범위이며 `CANDIDATE | QUESTION | RUN | RELEASE` 중 하나다. `ownerScope=CANDIDATE`인 Stage는 `ownerCandidateDisposition=KEEP|RETRY|REJECT`를 반드시 선언하며 `scopeMode=STAGE_OWNER` Failure가 발생하면 이 값을 사용한다.

Qn-07에서 StageRegistry + verified Source ProblemIR + MODE로:

```text
requiredGateManifest
```

를 자동 생성 후 hash freeze한다.

Manifest는 Qn-02~Qn-05D처럼 **이미 실행된 early source gate도 포함**하며, 기존 terminal GateInstanceResult를 template에 결합하여 completeness를 재확인한다.

```text
early required gate template 존재
AND terminal evidence instance 없음
→ VALIDATOR_INCOMPLETE
→ RUN BLOCK
```

따라서 Manifest가 늦게 생성된다는 이유로 early hard gate가 manifest 밖으로 빠지는 것을 금지한다.

누락된 Hard Gate는 구조적으로 불가능해야 한다.

## Gate Template vs Gate Instance Result

`RequiredGateManifest`는 **무엇을 검사해야 하는지**를 정의하는 Question-level Gate Template이다. 실제 실행 결과는 `gate-instance-result.schema.json`의 instance로만 기록한다.

```json
{
  "gateInstanceId": "q01-B-Qn-29",
  "gateTemplateId": "Qn-29",
  "ownerScope": "CANDIDATE",
  "questionUid": "q01",
  "candidateId": "B",
  "validatorStatus": "PASS",
  "gateStatus": "PASS",
  "reasonCodes": [],
  "failureCodes": [],
  "candidateDisposition": "KEEP",
  "evidenceHash": "...",
  "inputHashes": ["..."]
}
```

Canonical enum:

```text
validatorStatus = PASS | N_A | FAIL | UNVERIFIED
gateStatus      = PASS | N_A | FAIL | HOLD | BLOCKED | UNVERIFIED
```

```text
ownerScope = CANDIDATE | QUESTION | RUN
```


`validatorStatus`는 validator 자체 결과이고 `gateStatus`는 FailurePolicy/Scope reducer까지 적용된 terminal Gate outcome이다.

```text
validator PASS
→ gateStatus PASS

validator N_A + applicability proof
→ gateStatus N_A

validator FAIL/UNVERIFIED + canonical failure code
→ FailurePolicy resolve
→ scoped finalStatus/disposition을 gateStatus에 반영

failure routing 자체 미완료
→ gateStatus UNVERIFIED
→ Freeze 금지
```

강제:

```text
ownerScope=CANDIDATE
→ questionUid + candidateId REQUIRED
→ candidateDisposition REQUIRED

ownerScope=QUESTION
→ questionUid REQUIRED
→ candidateId MUST be null/absent
→ candidateDisposition = N_A

ownerScope=RUN
→ questionUid/candidateId MUST be null/absent
→ candidateDisposition = N_A

각 applicable required Gate Template마다 owner별 정확히 1개의 terminal GateInstanceResult 필요
중복 gateInstanceId / 누락 instance / owner identity mismatch → VALIDATOR_INCOMPLETE
selected/survivor GateInstanceResult는 gateStatus가 PASS 또는 justified N_A만 허용
```

Candidate A/B/C의 PASS/FAIL/HOLD/BLOCKED/UNVERIFIED/N_A는 서로 다른 GateInstanceResult로 보존한다. Judge survivor 계산, Qn-38 FinalStatus Reducer, Proof/Evidence completeness는 **manifest 자체가 아니라 terminal GateInstanceResult 집합**을 읽는다.

---

# 18. Claim-Level Solver Coverage

`exactMath = REQUIRED`라는 거친 표현을 쓰지 않는다.

ProblemIR의 각 claim:

```json
{
  "claimId": "c1",
  "solverTarget": "EXACT",
  "verificationMode": "SYMBOLIC_EQUIVALENCE",
  "required": true
}
```

enum:

```text
EXACT
LLM
HYBRID
NOT_MECHANIZABLE
```

Final Exact Gate PASS:

```text
모든 EXACT claim deterministic PASS
AND 모든 HYBRID claim deterministic component PASS
AND 모든 required claim total coverage = complete
```

`NOT_MECHANIZABLE` required claim은 아래 Deterministic Router 규칙을 따른다.

## SolverRoutingRegistry — 결정권한

`solverTarget`은 Builder/Agent가 작성하거나 downgrade할 수 없다. `SolverRoutingRegistry`가 canonical AST, family, claim type을 읽어 deterministic하게 결정하고 claim에 freeze한다.

초기 mandatory profile은 `solverTarget`과 `verificationProfile`을 분리한다.

```text
POLYNOMIAL_IDENTITY        → solverTarget=EXACT
EQUATION_SOLVING           → solverTarget=EXACT
INEQUALITY_SOLVING         → solverTarget=EXACT
FINITE_ENUMERATION         → solverTarget=EXACT
EXACT_SUBSTITUTION         → solverTarget=EXACT
SYMBOLIC_EQUIVALENCE       → solverTarget=EXACT
LANGUAGE_INTERPRETATION    → solverTarget=HYBRID
MIXED_SEMANTIC_ALGEBRA     → solverTarget=HYBRID
NON_MECHANIZABLE_PROOF     → solverTarget=NOT_MECHANIZABLE, verificationProfile=I3_DUAL_INDEPENDENT
```

`solverTarget` enum과 `verificationProfile` enum은 서로 다른 schema field다. `I3_DUAL_INDEPENDENT` 같은 proof profile 값을 `solverTarget`에 넣는 것은 schema fail이다. 초기 verificationProfile enum:

```text
DETERMINISTIC_ONLY
HYBRID_SEMANTIC_DETERMINISTIC
I3_DUAL_INDEPENDENT
```

강제:

```text
EXACT-capable registry rule → LLM/NOT_MECHANIZABLE downgrade 금지
Agent-provided solverTarget → 무시 + SOLVER_ROUTING_POLICY_BREACH
route 없는 required claim → REQUIRED_CLAIM_UNVERIFIED
```

## NOT_MECHANIZABLE required claim proof profile (`verificationProfile=I3_DUAL_INDEPENDENT`)

Human Review는 Hard Gate를 대신 PASS할 수 없다. required claim이 deterministic하게 검증 불가능하면:

```text
I3_A independent proof
AND I3_B independent proof (A와 다른 model/service family)
AND canonical claim conclusion agreement
AND semantic evidence complete
AND all mechanizable subclaims deterministic PASS
→ claim coverage PASS
```

하나라도 불일치/미완료:

```text
REQUIRED_CLAIM_UNVERIFIED
→ Candidate-scoped BLOCKED + EXCLUDE
```

다른 survivor가 Judge Pool minimum을 만족하면 Question은 계속 진행한다. pool minimum 미달 시 `JUDGE_POOL_INSUFFICIENT`가 Question-scope recovery를 담당한다. Human Review는 source/route/capability를 수정하고 재실행을 승인할 수만 있다.

---

# 19. Transform Predicate DSL

자유 텍스트 조건 금지.

대표 predicate:

```text
CONCEPT_SET_EQUAL
PROBLEM_TYPE_EQUAL
OBJECTIVE_TARGET_TYPE_EQ
ANSWER_TYPE_EQUAL
SOLUTION_ENTRY_EQ
GRAPH_DECISION_DELTA_EQ
GRAPH_BRANCH_DELTA_EQ
CONDITION_SEMANTIC_EQ
DOMAIN_EQ
QUANTIFIER_EQ
VISUAL_TOPOLOGY_EQ
DIFFICULTY_AXIS_DELTA_IN_RANGE
```

---

# 20. TransformOp Registry / Formal Contract / Compatibility Matrix

MutationPlan은 자유 텍스트 코드 명령을 금지하고 Registry enum만 사용한다.

## Structural Ops

```text
DIRECT_GIVEN_TO_DERIVED_GIVEN
COMBINE_EQUIVALENT_CONDITIONS
SPLIT_COMPOSITE_CONDITION
REORDER_INFERENCE_DEPENDENCY_SAFE
CHANGE_GIVEN_REPRESENTATION
CHANGE_TARGET_EQUIVALENT_FORM
SWAP_PARAMETER_ROLE_EQUIVALENT
```

## Surface Ops

```text
REORDER_GIVEN_CLAUSES
RENAME_SYMBOLS
REPHRASE_FIXED_SEMANTICS
SHUFFLE_CHOICE_ORDER
RESEED_NUMERIC_PARAMETERS
REBUILD_DISTRACTOR_TRAPS
```

## Advanced Cognitive Ops

```text
ADD_INTERMEDIATE_DECISION
ADD_CASE_BRANCH
INVERT_CONDITION_DIRECTION
CHANGE_OBJECTIVE_WITH_CORE_JUDGMENT_LOCK
CHANGE_SOLUTION_ENTRY_WITH_CORE_LOCK
ADD_COUNTEREXAMPLE_CHECK
```

Registry 밖 op 문자열은 `AGENT_OUTPUT_SCHEMA_FAIL` 또는 `TRANSFORM_CONTRACT_FAIL`이다.

모든 op는 다음을 가진다.

```text
op + version
handler
allowedModes[]
allowedFamilies[]
forbiddenFamilies[]
preconditions[]
postconditions[]
preservedInvariants[]
expectedSignatureDelta[]
expectedDifficultyDelta
conflictsWith[]
commutesWith[]
maxApplications
proofObligations[]
```

Formal Contract의 predicate 배열은 Contract Predicate DSL만 사용한다.

Plan approval:

```text
handler exists
AND contract exists
AND handler unit/adversarial tests PASS
AND preconditions PASS
AND mode/family permission PASS
AND op composition compatible
```

Compatibility state:

```text
ALLOWED
ORDER_SENSITIVE
FORBIDDEN
UNVERIFIED
```

`A+B`, `A→B`, `B→A`를 구분한다. Production에서 `UNVERIFIED` 사용 금지.

신규 조합 promotion은 현재 문서의 property-based / calibration / adversarial / HUMAN_APPROVAL pipeline을 따른다.

---

# 21. Transform Compatibility Promotion

```text
UNVERIFIED
→ property-based test
→ calibration/adversarial test
→ PROMOTION_CANDIDATE
→ HUMAN_APPROVAL
→ ALLOWED
```

승격 후보 초기 조건:

```text
testedCases >= 50
hardFailures == 0
semanticDrift == 0
mathEscape == 0
```

---

# 22. Plan Diversity

metric:

```text
primaryOpSignature
targetDeltaSignature
conditionDeltaSignature
conditionDeltaSimilarity = Jaccard(canonical transform effects)
```

Hard rule:

```text
same primaryOp
AND same targetDelta
AND conditionDeltaSimilarity >= 0.90
→ duplicate plan reject
```

최소 2개 실질 Plan 생존.

---

# 23. Plan Critic Executable Contract

각 Plan은 최소 다음을 기계/Agent 결합 방식으로 판정한다.

```text
hasExecutableOp
transformContractValid
compositionCompatible
numericOnlyPolicyValid
curriculumSafe
fidelitySafe
expectedCognitiveDeltaValid
modeCompatible
familyCompatible
```

`EXAM_FOLLOWUP/CONFIRMATION`에서 `RESEED_NUMERIC_PARAMETERS` 단독 Plan은 금지한다. approved `STRICT_VARIANT`에서는 단독 numeric reseed가 허용될 수 있다.

Critic action:

```text
APPROVE
REJECT
```

승인 Plan은 rank evidence를 남기되 Critic이 TransformOp를 새로 만들어서는 안 된다.

`plan-pool-policy.json`:

```json
{
  "EXAM_FOLLOWUP": {"minApprovedPlansForBuild": 2},
  "STRICT_VARIANT": {"minApprovedPlansForBuild": 1}
}
```

Critic 종료 후:

```text
approvedPlanCount >= mode.requiredMinimum
→ Qn-12 Builder 진입 가능

approvedPlanCount < mode.requiredMinimum
→ 직접 Qn-08 재호출 금지
→ PLAN_POOL_INSUFFICIENT
→ FailurePolicy / WorkflowActionRegistry를 통해 REGENERATE_PLANS
```

즉 `모든 Plan REJECT`와 `1개만 APPROVE된 EXAM_FOLLOWUP`을 동일한 Plan Pool 부족으로 처리하며 모든 재실행은 FailurePolicy 단일 routing 정본을 통과한다. `planPoolPolicyHash`는 Run Environment + Freeze Provenance에 포함한다.

---


# 23A. Candidate Plan Provenance + Distinct-Plan Survivor

모든 Candidate는 생성 근거 Plan을 canonical하게 소유한다. `candidate-plan-provenance.schema.json`:

```json
{
  "candidateId": "A",
  "sourcePlanId": "P1",
  "planGeneration": 0,
  "planSemanticHash": "",
  "transformOpsHash": "",
  "planContractHash": "",
  "candidatePlanProvenanceHash": ""
}
```

강제:

```text
Candidate.sourcePlanId REQUIRED
sourcePlanId는 현재 planGeneration의 APPROVED Plan만 참조
Plan RESELECT 시 기존 candidate provenance 재사용 금지
Candidate seed는 해당 sourcePlanId의 planSeed에서만 파생
```

Judge pool은 survivor 수뿐 아니라 서로 다른 설계 경로도 요구한다.

`judge-pool-policy.json`:

```json
{
  "EXAM_FOLLOWUP": {
    "minSurvivingCandidatesForJudge": 2,
    "minDistinctSourcePlanIdsForJudge": 2
  },
  "STRICT_VARIANT": {
    "minSurvivingCandidatesForJudge": 1,
    "minDistinctSourcePlanIdsForJudge": 1
  }
}
```

따라서 EXAM_FOLLOWUP에서 A/B 두 Candidate가 모두 P1에서 나온 경우 `survivorCount=2`라도 Judge 진입 금지다.

```text
survivorCount 미달
OR distinct surviving sourcePlanIds 미달
→ JUDGE_POOL_INSUFFICIENT
```

`candidatePlanProvenanceHash`는 Candidate Gate evidence, Judge Input Pack, Freeze Provenance에 포함한다.

현재 approved Plan set에 없는 `sourcePlanId`, planGeneration/hash mismatch, 같은 candidateId의 provenance 교체는:

```text
CANDIDATE_PLAN_PROVENANCE_FAIL
→ RUN BLOCKED
```

이며 content retry로 덮지 않는다.

---

# 24. Constructive Builder / Parameter Robustness / Constrained Realizer

## Constructive Builder

```text
Approved TransformOps
→ target ProblemIR
→ target SolutionIR
→ parameter constraints
→ parameter search
→ exact local proof
→ answer construction
→ condition construction
→ candidate math snapshot
```

AI가 완성 문제를 자유 생성하는 경로는 금지한다.

## Parameter Robustness Hard Predicates

첫 성립 parameter를 바로 사용하지 않는다.

```text
zero denominator
accidental repeated root
accidental cancellation
unexpected symmetry
huge intermediate values
awkward fraction explosion
numerical instability
degenerate special case
difficulty collapse
choice collision
visual infeasibility [visual]
```

각 parameter set은 family별 threshold config로 Hard predicate를 통과한 후 quality score로 ranking한다.

초기 ranking 축:

```text
mathematical stability
difficulty role fit
answer cleanliness
distractor separability
visual feasibility [applicable]
```

Hard predicate 실패 parameter는 scoring 대상이 아니다. 모든 parameter가 탈락하면 `PARAMETER_ROBUSTNESS_FAIL` 또는 `PARAMETER_SEARCH_EXHAUSTED`.

## Constrained Problem Realizer

허용:

```text
조사/어순 자연화
중복 표현 제거
고정 의미 문장 변형
```

금지:

```text
조건 추가/삭제
숫자 변경
수식 변경
domain 변경
quantifier 변경
objective 변경
answer form 변경
symbol ownership 변경
```

## Constrained Solution Realizer

SolutionIR step의 의미·순서·수학식을 보존한다. 새 풀이법, 교육과정 밖 정리, 생략된 필수 추론을 임의 추가하지 않는다.

Problem/Solution Realizer의 출력은 각각 독립 parser round-trip을 통과하기 전 final payload가 아니다.

---

# 25. Distractor Executable Contract

LLM이 임의 보기 숫자를 만들지 않는다.

```text
trapTag
→ wrongPathOp
→ wrongIntermediateState
→ exact wrong answer
→ choice candidate
```

trapTag 예:

```text
SIGN_ERROR
INVERSE_RATIO
MISSING_ABSOLUTE
WRONG_CASE_SELECTION
COMPLEMENT_CONFUSION
ROOT_SUM_PRODUCT_SWAP
DOMAIN_OMISSION
```

Final Distractor Gate:

```text
exactly one correct
all distractors != correct
all distractors pairwise distinct
each distractor has trap provenance
no distractor violates problem domain in a trivial/obvious way unless intended
```

---

# 26. Language Integrity Hard Predicates

Hard Fail:

```text
undefined symbol
ambiguous referent
quantifier ambiguity
scope ambiguity
domain term drift
missing unit
unit contradiction
malformed equation
broken LaTeX
answer-form mismatch
condition-object mismatch
grammatical math ambiguity
choice-reference inconsistency
```

자연스러움 점수와 분리한다.

---

# 27. Semantic AST Canonicalization

Round-Trip raw AST diff 금지.

Canonicalization:

```text
commutative sorting
associative flattening
constant folding
canonical symbol ids
set predicate normalization
equation side normalization
inequality orientation normalization
logic normalization
unit normalization
Unicode NFC
LaTeX semantic normalization
```

---

# 28. Semantic Parser 자체 검증

별도 Semantic Pair Set:

```text
equivalent paraphrase → PASS
domain change → FAIL
quantifier change → FAIL
condition missing → FAIL
objective change → FAIL
inequality drift → FAIL
unit drift → FAIL
```

Production release:

```text
known false accept = 0
```

Realizer↔Parser semantic drift가 동일 semantic input에서 반복되어도 Round-Trip Gate를 우회하지 않는다. configurable `maxSemanticRerealizeAttempts` 소진 시 deterministic canonical template serializer로 fallback할 수 있으나, fallback 결과도 동일 Independent Semantic Parser + Round-Trip + Language Integrity Hard Gate를 다시 통과해야 한다.

기본 독립성:

```text
Realizer family A
Semantic Parser family B
```

---

# 29. Problem / Solution Semantic Round-Trip Hard Rules

## Problem

```text
Candidate ProblemIR
→ Problem Realizer
→ final problem text
→ Independent Semantic Parser
→ reconstructed ProblemIR
→ canonical semantic diff
```

Hard Fail:

```text
domain change
quantifier change
inequality/relation change
condition missing
condition added
objective change
unit change
symbol ownership change
answer-type change
choice semantic change
```

→ `SEMANTIC_SERIALIZATION_DRIFT`.

## Solution

```text
Candidate SolutionIR
→ Solution Realizer
→ final solution text
→ Independent Solution Parser
→ reconstructed SolutionIR
→ canonical semantic diff
```

Hard Fail:

```text
required step missing
new unsupported step added
operation/theorem semantic change
condition/domain assumption drift
step dependency/order semantic drift
final answer drift
curriculum claim drift
```

→ `SOLUTION_SEMANTIC_DRIFT`.

Raw string/tree equality가 아니라 canonical AST/IR equality를 사용한다.

---

# 30. Anti-Clone Algorithms

Normalization:

```text
Unicode NFC
LaTeX spacing normalize
number → N
variable → canonical V1/V2
choice label 제거
punctuation normalize
Korean whitespace normalize
```

Metrics:

```text
normalizedTextSimilarity = token 3-gram Sørensen-Dice
conditionStructureSimilarity = canonical condition multiset Jaccard
questionTargetSimilarity = targetType/role exact 0|1
solutionGraphSimilarity = canonical graph signature similarity
mathSkeletonHash = canonical algebra/logic skeleton hash
```

algorithm/version은 Run Environment에 포함.

---

# 31. Anti-Clone Hard Rules

## EXAM_FOLLOWUP CONFIRMATION — Numeric Clone

```text
structuralOpCount == 0
AND mathSkeletonHash(source) == mathSkeletonHash(candidate)
AND normalizedTextSimilarity >= 0.85
→ NUMERIC_CLONE
```

## Surface Clone

```text
structuralOpCount == 0
AND conditionStructureSimilarity >= 0.95
AND questionTargetSimilarity == 1
→ SURFACE_CLONE
```

## Final Text Clone — Source vs Candidate

```text
normalizedTextSimilarity >= 0.92
AND conditionStructureSimilarity >= 0.90
→ FINAL_TEXT_CLONE
```

단, approved STRICT_VARIANT에는 별도 LOCK policy 적용.

---

# 32. Archive Near-Duplicate Hard Rule

Retrieval 이후 Fine Compare는 **미리 고정된 profile**을 사용한다. N/A dimension을 런타임에서 임의 0/1 처리하거나 즉석 re-normalization하지 않는다.

## Profile selection

```text
MCQ_VISUAL
MCQ_NONVISUAL
NONMCQ_VISUAL
NONMCQ_NONVISUAL
```

초기 calibration weight(합계 1.00):

| Profile | text | condition | graph | objective | trap | visual |
|---|---:|---:|---:|---:|---:|---:|
| MCQ_VISUAL | 0.30 | 0.25 | 0.25 | 0.10 | 0.05 | 0.05 |
| MCQ_NONVISUAL | 0.32 | 0.27 | 0.27 | 0.09 | 0.05 | 0.00 |
| NONMCQ_VISUAL | 0.32 | 0.28 | 0.28 | 0.07 | 0.00 | 0.05 |
| NONMCQ_NONVISUAL | 0.34 | 0.30 | 0.30 | 0.06 | 0.00 | 0.00 |

이 weight는 calibration 후 config version으로 freeze하며 production run 중 변경 금지.

Hard Rule:

```text
nearDuplicateScore >= 0.90
→ ARCHIVE_NEAR_DUPLICATE

0.85 <= nearDuplicateScore < 0.90
→ ARCHIVE_DUPLICATE_UNVERIFIED / HOLD
```

가중합과 별도로 다음 composite hard-override를 적용한다. 단일 graph 일치만으로 HOLD하지 않는다.

```text
solutionGraphSimilarity == 1.0
AND questionTargetSimilarity == 1
AND conditionStructureSimilarity >= 0.95
→ ARCHIVE_DUPLICATE_UNVERIFIED / HOLD
```

선택/봉인되는 Candidate에는 HOLD가 존재할 수 없다. Candidate-scoped `HOLD + EXCLUDE`는 survivor pool에서 제거되며, 다른 survivor가 Judge Pool minimum을 만족하면 Question Transaction 자체의 Freeze를 막지 않는다.

---

# 33. Archive Recall Contract

## Exact buckets — exhaustive

```text
mathSkeletonHash
solutionGraphSignature
conditionSignature
```

Exact bucket match는 Top-K 근사 retrieval에 의존하지 않고 항상 전수 비교한다.

## Approx retrieval

MinHash/LSH recall benchmark:

```text
minimumRecallAtK = 0.995
topK = 40
```

Recall < 0.995:

```text
ARCHIVE_INDEX_RECALL_BELOW_THRESHOLD
→ BLOCKED
```

Recall Benchmark Set + Adversarial Duplicate Set을 release regression에 포함한다. index snapshot/version/config/coverage metadata는 Run Environment와 evidence에 남긴다.

---

# 34. Archive Index Update Timing

Atomic Publish 이전에:

```text
latest archive head recheck
```

Publish 성공과 동시에:

```text
new questions signature index
exact buckets
MinHash/LSH entries
archiveSnapshotHash
```

를 transaction 내 반영한다.

Index update 실패:
Publish rollback.

Index eventual delay를 허용하지 않는다.

---

# 35. CONFIRMATION Difficulty Invariant

## Final Difficulty Evidence Dependency

Qn-26은 `curriculum-constrained minimum valid solution path`와 shortcut evidence를 먼저 생성한다.

```text
Qn-26 SHORTCUT / MIN-SOLUTION DISCOVERY
→ minSolutionGraph
→ minimumCurriculumValidPath
→ shortcutEvidenceHash

Qn-27 FINAL DIFFICULTY / G09
→ 위 evidence를 REQUIRED input으로 사용
```

Qn-14 Parameter Robustness의 `difficulty role fit`은 **provisional score**일 뿐 Hard PASS가 아니며 Qn-27 결과를 대체할 수 없다. Qn-27이 Qn-26 evidence 없이 실행되면 `DIFFICULTY_AXIS_UNVERIFIED`로 Candidate를 제외한다.

반드시 양방향 불변.

```text
ΔdecisionCount = 0
ΔbranchingLoad = 0
ΔinterpretationLoad = 0
ΔabstractionLoad = 0
```

허용:

```text
|ΔalgebraLoad| <= 1
|ΔanswerComplexity| <= 1
```

인지축 증가:
`CONFIRMATION_ROLE_DRIFT`

인지축 감소:
`DIFFICULTY_ROLE_FAIL`

---

# 36. ADVANCED G09 — Realized Gain Contract

## InterpretationDependencyGraph 정본

`interpretation-dependency-graph.schema.json`으로 source/candidate의 해석 의존 구조를 표현한다.

```json
{
  "nodes": [
    {"id": "i1", "claimId": "c1", "kind": "READ_RELATION"},
    {"id": "i2", "claimId": "c2", "kind": "DERIVE_RELATION"}
  ],
  "edges": [{"from": "i1", "to": "i2"}],
  "dependencyCount": 1,
  "dependencyDepth": 1
}
```

`dependencyCount`, `dependencyDepth`는 graph에서 기계 계산하며 Agent가 숫자를 직접 제출하지 않는다.

## RepresentationLevel 정본

각 objective/semantic claim에는 다음 enum 중 하나를 canonical assign한다.

```text
L0_DIRECT_VALUE        = 0
L1_EXPLICIT_RELATION   = 1
L2_DERIVED_RELATION    = 2
L3_ABSTRACT_PROPERTY   = 3
```

assignment rule은 family별 `representation-level-registry.json`에서 결정하며 Agent 자유평가를 금지한다.

## realizedInterpretationGain

V0.x에서는 다음 식으로만 `0|1`을 계산한다.

```text
interpretationDependencyDelta =
max(
 candidate.dependencyCount - source.dependencyCount,
 candidate.dependencyDepth - source.dependencyDepth
)

realizedInterpretationGain = 1 iff
  interpretationDependencyDelta >= 1
  AND Advanced Cognitive Op realized
  AND Contract DSL expected/realized delta PASS
  AND final round-trip graph hash가 candidate graph hash와 동일
  AND curriculum-constrained minimum solution path에 추가 dependency가 존재
else 0
```

단순 문장 길이 증가, 조건 순서 변경, 계산량 증가는 gain이 아니다.

## realizedAbstractionGain

minimum valid solution path가 실제 요구하는 최대 RepresentationLevel을 비교한다.

```text
representationDelta =
 candidate.minPathMaxRepresentationLevel
 - source.minPathMaxRepresentationLevel

realizedAbstractionGain = 1 iff
  representationDelta >= 1
  AND Advanced Cognitive Op realized
  AND Contract DSL realized delta PASS
  AND final ProblemIR/SolutionIR round-trip 후 level 유지
  AND curriculum-constrained minimum solution path에서도 level 증가 유지
else 0
```

Agent가 `representation level`을 자연어 rubric으로 임의 지정하지 않는다.

## realizedCognitiveGain

```text
realizedCognitiveGain =
max(
 ΔdecisionCount,
 ΔbranchingLoad,
 realizedInterpretationGain,
 realizedAbstractionGain
)
```

ADVANCED인데:

```text
realizedCognitiveGain <= 0
→ FAKE_ADVANCEMENT_G09
```

계산량/식 복잡도만 증가한 경우 gain으로 인정하지 않는다. 자동 ADVANCED/CONFIRMATION 재분류는 금지하고 새 Plan부터 다시 시작한다.

---

# 37. Shortcut Adversary — 전 지원 문항 기본

지원 가능한 Family에서는:

```text
shortcutAdversary = REQUIRED
```

ADVANCED는 더 강한 budget.

기본:

```text
FIND_MIN_SOLUTION
FUZZ_BOUNDARY_VALUES
ENUMERATE_SPECIAL_CASES
SEARCH_SYMMETRY_SHORTCUT
SEARCH_SUBSTITUTION_SHORTCUT
```

CONFIRMATION에서도 accidental trivialization 검사.

## Curriculum-constrained shortcut search

난도 판정에 사용하는 shortcut은 반드시 Candidate Curriculum Contract 범위 안에서만 탐색한다.

```text
allowedConceptKeys
allowedOperations
allowedTheorems
forbiddenConceptKeys
forbiddenTerminology/technique
```

을 Shortcut Adversary input constraint로 전달한다.

교육과정 밖 풀이가 더 짧게 발견된 경우:

```text
diagnosticOnly = true
difficultyCollapse = false
unintendedShortcut = false
```

로 기록한다. 예를 들어 고1 문제를 미분으로 한 줄에 푸는 경로는 학생 난도 붕괴 근거로 사용하지 않는다.

Curriculum Contract 안에서 발견된 shortcut만 `UNINTENDED_SHORTCUT / DIFFICULTY_COLLAPSE / ACCIDENTAL_TRIVIALIZATION`을 발생시킬 수 있다.

---

# 38. Shortcut Resource Guard

```text
CONFIRMATION:
  maxShortcutAgentCalls = 1
  timeout = 8s
  maxAdversarialCases = 1000

ADVANCED:
  maxShortcutAgentCalls = 2
  timeout = 12s
  maxAdversarialCases = 2000
```

Unresolved:
- ADVANCED → BLOCKED
- CONFIRMATION → required manifest policy에 따라 BLOCKED/HUMAN REVIEW

---

# 39. SymPy Complexity Pre-check / Proof Obligation Set

## SymPy Complexity Pre-check

실제 symbolic solve 전 family별로 다음을 계산한다.

```text
AST node count
polynomial degree
symbol count
Abs nesting depth
Piecewise branch count
radical nesting depth
transcendental nesting depth
constraint count
```

family limit 초과:

```text
SYMBOLIC_COMPLEXITY_UNSAFE
→ fallback routing 검토
→ required claim 미해결 시 SYMBOLIC_EVALUATION_UNRESOLVED
```

무리한 solve는 실행하지 않는다.

## Proof Obligations

기본 canonical set:

```text
PO01 all symbols defined
PO02 domain non-empty
PO03 givens jointly satisfiable
PO04 solution exists
PO05 answer unique
PO06 answer type valid
PO07 exactly one correct choice                    [MCQ]
PO08 all distractors distinct from correct         [MCQ]
PO09 domain hazards absent
PO10 no hidden extra assumption
PO11 intended SolutionIR valid
PO12 independent solution valid
PO13 canonical answers equivalent
PO14 Transform invariants preserved
PO15 final ProblemIR == round-trip ProblemIR
PO16 final SolutionIR == round-trip SolutionIR
```

각 PO의 applicability는 StageRegistry/ProblemIR에서 결정하고 manifest에 freeze한다.

필요 PO가 하나라도 `PASS`가 아니거나 evidence coverage가 incomplete면:

```text
PROOF_OBLIGATION_INCOMPLETE
```

이며 Judge로 진행할 수 없다.

---

# 40. Fidelity Contract — 완전 판정식

```text
coreInvariants[]
surfaceInvariants[]
requiredPreservation[]
allowedDelta[]
forbiddenDelta[]
```

PASS iff:

```text
all coreInvariants PASS
AND all applicable surfaceInvariants PASS
AND all requiredPreservation PASS
AND realizedDelta ⊆ (allowedDelta ∪ requiredTransformDelta)
AND realizedDelta ∩ forbiddenDelta = ∅
AND solutionGraph core preserved
AND objective fidelity PASS
AND concept fidelity PASS
```

---

# 41. Problem/Solution Curriculum + Validator Evidence Contract

## V2-P Problem Curriculum

최종 ProblemIR + 학생용 발문을 검사한다.

## V2-S Solution Curriculum

SolutionIR + 최종 학생용 solution을 검사한다.

Curriculum Contract 정본:

```text
courseVersion
unitKey
subUnitKey
allowedConceptKeys[]
allowedOperations[]
allowedTheorems[]
forbiddenConceptKeys[]
forbiddenTerminology[]
curriculumMasterHash
```

교육과정 밖 개념/연산/정리/용어 사용은 각각 `CURRICULUM_PROBLEM_FAIL` 또는 `CURRICULUM_SOLUTION_FAIL`. 경계 자체를 기계적으로 해결할 수 없으면 `CURRICULUM_BOUNDARY_UNRESOLVED`.

## Validator Evidence Schema

모든 validator 결과의 canonical fields:

```text
validatorId
validatorVersion
inputHashes[]
status
reasonCodes[]
evidence[]
coverage
engineVersion
executedAt [audit-only]
```

`status` enum:

```text
PASS | N_A | FAIL | UNVERIFIED
```


Schema if/then Hard Rules:

```text
status = PASS
→ evidence.minItems >= 1
→ coverage = complete

status = N_A
→ reasonCodes.minItems >= 1
→ applicability proof 존재

status = FAIL
→ reasonCodes.minItems >= 1
→ evidence.minItems >= 1

status = UNVERIFIED
→ reasonCodes.minItems >= 1
→ PASS/Freeze 불가
```

`executedAt` 등 audit metadata는 evidenceContentHash에서 제외한다.

**Evidence 없는 PASS는 schema 수준에서 생성 불가능해야 한다.**

---

# 42. FailurePolicyRegistry — Complete Canonical Mapping

Runtime의 retry/status/action은 **이 Registry 하나만** 참조한다. 별도 수기 Retry Matrix, 코드별 임의 분기 금지.

Canonical fields:

```text
code
severity
finalStatus
rootCauseClass
retryable
retryLevel
sameInputRetryAllowed
humanReview
workflowAction
scopeMode
failureScope
candidateDisposition
escalationProfileId
```

`failureScope` enum:

```text
CANDIDATE
QUESTION
RUN
RELEASE
```

v0.x에서 `RUN`은 **현재 Exam Run 전체(Exam Integration/Package 포함)** 를 뜻한다. 별도 EXAM scope를 두지 않으며 Exam/Package 단계 failure를 `QUESTION`으로 매핑하지 않는다.

`scopeMode` enum:

```text
FIXED
STAGE_OWNER
POLICY_CONTEXT
```

`POLICY_CONTEXT`는 self-integrity/policy graph 오류 전용이다.

```text
policyExecutionContext = PHASE0_RELEASE → failureScope=RELEASE
policyExecutionContext = RUNTIME       → failureScope=RUN
```

Candidate/Question Stage 내부에서 발견되어도 `CANDIDATE`로 내려가지 않는다. policy context 자체의 정본은 process entrypoint가 제공한다. 이 값이 invalid/missing이면 resolver를 재귀 호출하지 않고 entrypoint plane에 따라 `POLICY_SCOPE_RESOLUTION_FAIL_RUNTIME` 또는 `POLICY_SCOPE_RESOLUTION_FAIL_RELEASE`로 fail closed한다.

`scopeMode=STAGE_OWNER`이면 StageRegistry의 `ownerScope`를 읽어 최종 `failureScope`를 결정한다. `scopeMode=POLICY_CONTEXT`이면 §44A의 `policyExecutionContext`만 읽어 `PHASE0_RELEASE→RELEASE`, `RUNTIME→RUN`으로 해소하며 Stage owner를 절대 참조하지 않는다. `candidateDisposition` enum은 `KEEP | RETRY | REJECT | EXCLUDE | N_A`다. `EXCLUDE`는 오류가 확정된 REJECT와 달리 **검증 미완료/불확정이라 Judge survivor pool에서 제외**한다는 뜻이다. Registry의 `finalStatus`는 **resolved failureScope에 적용되는 scoped status**이며 Candidate-scoped `FAIL`을 Question.finalStatus로 직접 복사하지 않는다. Candidate disposition을 적용한 뒤 생존 후보/Retry 정책으로 Question workflow를 계속한다. `scopeMode=STAGE_OWNER`가 CANDIDATE로 resolve되면 StageRegistry의 `ownerCandidateDisposition`이 registry의 `N_A`를 대체한다.

`retryLevel`: `0=non-content/infra-special`, `1=local rebuild`, `2=plan reselect`, `3=regenerate plans`, `4=human/capability block`.

`escalationProfileId`는 각 code의 exhaustion graph를 지정하며 표와 실제 `failure-policy.json` 모두 필수다. 빈/default profile 금지.

rootCauseClass enum:

```text
SOURCE PLAN TRANSFORM_HANDLER PARAMETER LANGUAGE VALIDATOR INFRA ENGINE_BUG
ARCHIVE POLICY CAPABILITY SERIALIZER BUDGET UNKNOWN
```

| code | severity | finalStatus | rootCause | retry | L | same input | human | workflowAction | scopeMode | failureScope | disposition | escalationProfileId |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| `SOURCE_INVALID` | ERROR | BLOCKED | SOURCE | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `SOURCE_PARSE_FAIL` | ERROR | FAIL | SOURCE | true | 1 | false | false | `REPARSE_SOURCE` | FIXED | QUESTION | N_A | `SOURCE_REPARSE_BOUNDED` |
| `CURRICULUM_CONTRACT_UNVERIFIED` | ERROR | BLOCKED | POLICY | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `SOURCE_BASELINE_UNVERIFIED` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `SOURCE_INGESTION_UNVERIFIED` | ERROR | BLOCKED | SOURCE | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `SOURCE_INGESTION_INDEPENDENCE_UNAVAILABLE` | CRITICAL | BLOCKED | CAPABILITY | false | 4 | false | true | `ABORT_OR_UPGRADE_CAPABILITY` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `IR_EXPRESSIVENESS_INSUFFICIENT` | ERROR | BLOCKED | CAPABILITY | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `ACCESS_POLICY_BREACH` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `SOLVER_ISOLATION_BREACH` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `AGENT_OUTPUT_SCHEMA_FAIL` | ERROR | FAIL | VALIDATOR | true | 1 | false | false | `RECALL_AGENT` | STAGE_OWNER | (ownerScope) | N_A | `STAGE_AGENT_BOUNDED` |
| `I3_CAPABILITY_UNAVAILABLE` | CRITICAL | BLOCKED | CAPABILITY | false | 4 | false | true | `ABORT_OR_UPGRADE_CAPABILITY` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `CAPABILITY_PRECHECK_FAIL` | CRITICAL | BLOCKED | CAPABILITY | false | 4 | false | true | `ABORT_OR_UPGRADE_CAPABILITY` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `RUN_SEED_INVALID` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `SOLVER_ROUTING_POLICY_BREACH` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `REQUIRED_CLAIM_UNVERIFIED` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | false | `EXCLUDE_CANDIDATE_UNVERIFIED` | FIXED | CANDIDATE | EXCLUDE | `TERMINAL_NONE` |
| `PLAN_DIVERSITY_FAIL` | ERROR | FAIL | PLAN | true | 3 | false | false | `REGENERATE_PLANS` | FIXED | QUESTION | N_A | `PLAN_REGEN_BOUNDED` |
| `PLAN_POOL_INSUFFICIENT` | ERROR | FAIL | PLAN | true | 3 | false | false | `REGENERATE_PLANS` | FIXED | QUESTION | N_A | `PLAN_REGEN_BOUNDED` |
| `TRANSFORM_CONTRACT_FAIL` | ERROR | FAIL | PLAN | true | 3 | false | false | `REGENERATE_PLANS` | FIXED | QUESTION | N_A | `PLAN_REGEN_BOUNDED` |
| `TRANSFORM_COMPOSITION_UNSAFE` | ERROR | FAIL | PLAN | true | 3 | false | false | `REGENERATE_PLANS` | FIXED | QUESTION | N_A | `PLAN_REGEN_BOUNDED` |
| `CANDIDATE_PLAN_PROVENANCE_FAIL` | CRITICAL | BLOCKED | ENGINE_BUG | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `TRANSFORM_NOT_REALIZED` | ERROR | FAIL | TRANSFORM_HANDLER | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `PARAMETER_SEARCH_EXHAUSTED` | ERROR | FAIL | PARAMETER | true | 1 | false | false | `LOCAL_REBUILD` | FIXED | CANDIDATE | RETRY | `CANDIDATE_LOCAL_PLAN_REGEN` |
| `PARAMETER_ROBUSTNESS_FAIL` | ERROR | FAIL | PARAMETER | true | 1 | false | false | `LOCAL_REBUILD` | FIXED | CANDIDATE | RETRY | `CANDIDATE_LOCAL_PLAN_REGEN` |
| `NUMERIC_CLONE` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `SURFACE_CLONE` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `FINAL_TEXT_CLONE` | ERROR | FAIL | LANGUAGE | true | 1 | false | false | `REREALIZE_PROBLEM` | FIXED | CANDIDATE | RETRY | `CANDIDATE_REREALIZE_PLAN_REGEN` |
| `ARCHIVE_NEAR_DUPLICATE` | ERROR | FAIL | ARCHIVE | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `ARCHIVE_DUPLICATE_UNVERIFIED` | WARN | HOLD | ARCHIVE | false | 0 | false | false | `EXCLUDE_CANDIDATE_UNVERIFIED` | FIXED | CANDIDATE | EXCLUDE | `TERMINAL_NONE` |
| `ARCHIVE_INDEX_RECALL_BELOW_THRESHOLD` | CRITICAL | BLOCKED | ARCHIVE | false | 4 | false | true | `REBUILD_INDEX` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `CONFIRMATION_ROLE_DRIFT` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `DIFFICULTY_ROLE_FAIL` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `STRICT_LOCK_VIOLATION` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `STRICT_DIFFICULTY_DRIFT` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `STRICT_VISUAL_TOPOLOGY_DRIFT` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `FAKE_ADVANCEMENT_G09` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `UNINTENDED_SHORTCUT` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `DIFFICULTY_COLLAPSE` | ERROR | FAIL | PARAMETER | true | 1 | false | false | `LOCAL_REBUILD` | FIXED | CANDIDATE | RETRY | `CANDIDATE_LOCAL_PLAN_REGEN` |
| `ACCIDENTAL_TRIVIALIZATION` | ERROR | FAIL | PARAMETER | true | 1 | false | false | `LOCAL_REBUILD` | FIXED | CANDIDATE | RETRY | `CANDIDATE_LOCAL_PLAN_REGEN` |
| `SHORTCUT_VERIFICATION_UNRESOLVED` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | false | `EXCLUDE_CANDIDATE_UNVERIFIED` | FIXED | CANDIDATE | EXCLUDE | `TERMINAL_NONE` |
| `MATH_INTEGRITY_FAIL` | ERROR | FAIL | VALIDATOR | true | 1 | false | false | `ROOT_CAUSE_ESCALATE` | FIXED | CANDIDATE | N_A | `ROOT_CAUSE_DYNAMIC_RECOVERY` |
| `ROOT_CAUSE_UNRESOLVED` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | false | `EXCLUDE_CANDIDATE_UNVERIFIED` | FIXED | CANDIDATE | EXCLUDE | `TERMINAL_NONE` |
| `MULTIPLE_ANSWER` | ERROR | FAIL | PARAMETER | true | 1 | false | false | `LOCAL_REBUILD` | FIXED | CANDIDATE | RETRY | `CANDIDATE_LOCAL_PLAN_REGEN` |
| `NO_VALID_CHOICE` | ERROR | FAIL | PARAMETER | true | 1 | false | false | `LOCAL_REBUILD` | FIXED | CANDIDATE | RETRY | `CANDIDATE_LOCAL_PLAN_REGEN` |
| `SOLUTION_ANSWER_MISMATCH` | ERROR | FAIL | LANGUAGE | true | 1 | false | false | `LOCAL_REBUILD` | FIXED | CANDIDATE | RETRY | `CANDIDATE_LOCAL_PLAN_REGEN` |
| `SYMBOLIC_COMPLEXITY_UNSAFE` | WARN | FAIL | VALIDATOR | true | 1 | false | false | `ROUTE_FALLBACK` | FIXED | CANDIDATE | RETRY | `CANDIDATE_LOCAL_PLAN_REGEN` |
| `SYMBOLIC_EVALUATION_UNRESOLVED` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | false | `EXCLUDE_CANDIDATE_UNVERIFIED` | FIXED | CANDIDATE | EXCLUDE | `TERMINAL_NONE` |
| `PROOF_OBLIGATION_INCOMPLETE` | ERROR | FAIL | VALIDATOR | true | 1 | false | false | `ROOT_CAUSE_ESCALATE` | FIXED | CANDIDATE | N_A | `ROOT_CAUSE_DYNAMIC_RECOVERY` |
| `VALIDATOR_INCOMPLETE` | CRITICAL | BLOCKED | ENGINE_BUG | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `ENGINE_INVARIANT_FAIL` | CRITICAL | BLOCKED | ENGINE_BUG | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `CURRICULUM_PROBLEM_FAIL` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `CURRICULUM_SOLUTION_FAIL` | ERROR | FAIL | UNKNOWN | true | 1 | false | false | `ROOT_CAUSE_ESCALATE` | FIXED | CANDIDATE | N_A | `ROOT_CAUSE_DYNAMIC_RECOVERY` |
| `CURRICULUM_BOUNDARY_UNRESOLVED` | ERROR | BLOCKED | CAPABILITY | false | 4 | false | false | `EXCLUDE_CANDIDATE_UNVERIFIED` | FIXED | CANDIDATE | EXCLUDE | `TERMINAL_NONE` |
| `FIDELITY_DRIFT` | ERROR | FAIL | PLAN | true | 2 | false | false | `RESELECT_PLAN` | FIXED | CANDIDATE | REJECT | `CANDIDATE_PLAN_REGEN` |
| `DISTRACTOR_INVALID` | ERROR | FAIL | PARAMETER | true | 1 | false | false | `REBUILD_DISTRACTOR` | FIXED | CANDIDATE | RETRY | `CANDIDATE_LOCAL_PLAN_REGEN` |
| `SEMANTIC_SERIALIZATION_DRIFT` | ERROR | FAIL | LANGUAGE | true | 1 | false | false | `REREALIZE_PROBLEM` | FIXED | CANDIDATE | RETRY | `CANDIDATE_REREALIZE_PLAN_REGEN` |
| `SOLUTION_SEMANTIC_DRIFT` | ERROR | FAIL | LANGUAGE | true | 1 | false | false | `REREALIZE_SOLUTION` | FIXED | CANDIDATE | RETRY | `CANDIDATE_REREALIZE_PLAN_REGEN` |
| `LANGUAGE_INTEGRITY_FAIL` | ERROR | FAIL | LANGUAGE | true | 1 | false | false | `ROOT_CAUSE_ESCALATE` | FIXED | CANDIDATE | N_A | `ROOT_CAUSE_DYNAMIC_RECOVERY` |
| `PROMPT_BUDGET_EXCEEDED` | ERROR | BLOCKED | BUDGET | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `QUESTION_BUDGET_EXCEEDED` | ERROR | BLOCKED | BUDGET | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `EXAM_COMPLETENESS_FAIL` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `EXAM_SOURCE_MAPPING_FAIL` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `EXAM_BLUEPRINT_FAIL` | ERROR | FAIL | VALIDATOR | true | 0 | false | false | `EXAM_REOPEN_TARGET` | FIXED | RUN | N_A | `EXAM_REOPEN_GRAPH` |
| `EXAM_TRANSFORM_DISTRIBUTION_FAIL` | ERROR | FAIL | VALIDATOR | true | 0 | false | false | `EXAM_REOPEN_TARGET` | FIXED | RUN | N_A | `EXAM_REOPEN_GRAPH` |
| `EXAM_TRANSFORM_CONCENTRATION_EXCESS` | ERROR | FAIL | VALIDATOR | true | 0 | false | false | `EXAM_REOPEN_TARGET` | FIXED | RUN | N_A | `EXAM_REOPEN_GRAPH` |
| `EXAM_WORDING_PATTERN_FAIL` | ERROR | FAIL | VALIDATOR | true | 0 | false | false | `EXAM_REOPEN_TARGET` | FIXED | RUN | N_A | `EXAM_REOPEN_GRAPH` |
| `EXAM_PAIRWISE_CLONE` | ERROR | FAIL | ARCHIVE | true | 0 | false | false | `EXAM_REOPEN_TARGET` | FIXED | RUN | N_A | `EXAM_REOPEN_GRAPH` |
| `EXAM_DIFFICULTY_DISTRIBUTION_FAIL` | ERROR | FAIL | VALIDATOR | true | 0 | false | false | `EXAM_REOPEN_TARGET` | FIXED | RUN | N_A | `EXAM_REOPEN_GRAPH` |
| `EXAM_ANSWER_DISTRIBUTION_FAIL` | ERROR | FAIL | VALIDATOR | true | 0 | false | false | `EXAM_REBALANCE_OR_REOPEN` | FIXED | RUN | N_A | `EXAM_REOPEN_GRAPH` |
| `EXAM_VISUAL_DISTRIBUTION_FAIL` | ERROR | FAIL | VALIDATOR | true | 0 | false | false | `EXAM_REOPEN_TARGET` | FIXED | RUN | N_A | `EXAM_REOPEN_GRAPH` |
| `EXAM_CROSS_DUPLICATE_FAIL` | ERROR | FAIL | ARCHIVE | true | 0 | false | false | `EXAM_REOPEN_TARGET` | FIXED | RUN | N_A | `EXAM_REOPEN_GRAPH` |
| `REOPEN_IMPACT_UNRESOLVED` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `EXAM_REOPEN_BUDGET_EXCEEDED` | ERROR | BLOCKED | BUDGET | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `DAG_CONVERGENCE_EXCEEDED` | ERROR | BLOCKED | BUDGET | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `INFRA_BLOCKED` | CRITICAL | BLOCKED | INFRA | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `RETRY_LIMIT_EXCEEDED` | ERROR | BLOCKED | UNKNOWN | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `RUN_ENVIRONMENT_DRIFT` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `OUTPUT_TRUNCATED` | ERROR | FAIL | VALIDATOR | true | 0 | true | false | `RETRY_AGENT_OUTPUT` | STAGE_OWNER | (ownerScope) | N_A | `STAGE_AGENT_BOUNDED` |
| `JS_SCHEMA_FAIL` | ERROR | FAIL | SERIALIZER | true | 1 | false | false | `REBUILD_SERIALIZATION` | FIXED | RUN | N_A | `RUN_SERIALIZE_PACKAGE_BOUNDED` |
| `ARCHIVE_SERIALIZATION_DRIFT` | ERROR | FAIL | SERIALIZER | true | 1 | false | false | `REBUILD_SERIALIZATION` | FIXED | RUN | N_A | `RUN_SERIALIZE_PACKAGE_BOUNDED` |
| `PACKAGE_ROUNDTRIP_FAIL` | ERROR | FAIL | SERIALIZER | true | 1 | false | false | `REBUILD_PACKAGE` | FIXED | RUN | N_A | `RUN_SERIALIZE_PACKAGE_BOUNDED` |
| `JUDGE_REJECT_ALL` | ERROR | FAIL | PLAN | true | 3 | false | false | `REGENERATE_PLANS` | FIXED | QUESTION | N_A | `JUDGE_POOL_RECOVERY` |
| `JUDGE_POOL_INSUFFICIENT` | ERROR | FAIL | PLAN | true | 2 | false | false | `RECOVER_JUDGE_POOL` | FIXED | QUESTION | N_A | `JUDGE_POOL_RECOVERY` |
| `DIFFICULTY_AXIS_UNVERIFIED` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | false | `EXCLUDE_CANDIDATE_UNVERIFIED` | FIXED | CANDIDATE | EXCLUDE | `TERMINAL_NONE` |
| `STAGE_APPLICABILITY_SCHEMA_FAIL` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `RUN_ENVIRONMENT_SPEC_PARITY_FAIL` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `RELEASE_BLOCK_OR_ABORT_RUN` | POLICY_CONTEXT | (policyContext) | N_A | `TERMINAL_NONE` |
| `IDEMPOTENCY_KEY_COLLISION` | CRITICAL | BLOCKED | ENGINE_BUG | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `CHECKPOINT_INTEGRITY_FAIL` | CRITICAL | BLOCKED | ENGINE_BUG | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `AUDIT_CHAIN_INTEGRITY_FAIL` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `FAILURE_POLICY_GRAPH_INVALID` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `RELEASE_BLOCK_OR_ABORT_RUN` | POLICY_CONTEXT | (policyContext) | N_A | `TERMINAL_NONE` |
| `WORKFLOW_ACTION_UNRESOLVED` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `RELEASE_BLOCK_OR_ABORT_RUN` | POLICY_CONTEXT | (policyContext) | N_A | `TERMINAL_NONE` |
| `QUESTION_APPROVAL_REDUCER_FAIL` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | QUESTION | N_A | `TERMINAL_NONE` |
| `EXAM_APPROVAL_REDUCER_FAIL` | ERROR | BLOCKED | VALIDATOR | false | 4 | false | true | `HUMAN_REVIEW` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `POLICY_SCOPE_RESOLUTION_FAIL_RUNTIME` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `ABORT_RUN` | FIXED | RUN | N_A | `TERMINAL_NONE` |
| `POLICY_SCOPE_RESOLUTION_FAIL_RELEASE` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `RELEASE_BLOCK` | FIXED | RELEASE | N_A | `TERMINAL_NONE` |
| `CONTRACT_REGRESSION_DETECTED` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `RELEASE_BLOCK` | FIXED | RELEASE | N_A | `TERMINAL_NONE` |
| `CONTRACT_BASELINE_INCOMPLETE` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `RELEASE_BLOCK` | FIXED | RELEASE | N_A | `TERMINAL_NONE` |
| `CONTRACT_FREEZE_FAIL` | CRITICAL | BLOCKED | POLICY | false | 4 | false | true | `RELEASE_BLOCK` | FIXED | RELEASE | N_A | `TERMINAL_NONE` |

동일 deterministic `inputHash`에서 같은 content FAIL을 반복하면 같은 입력 재시도를 금지하고 root-cause escalation한다. Infra retry만 `sameInputRetryAllowed=true`가 가능하다.

## Failure Scope Reducer

```text
failureScope=CANDIDATE
→ candidateDisposition 적용
→ `REJECT` 또는 `EXCLUDE` candidate는 Judge survivor pool에서 제거
→ Question은 ACTIVE/VALIDATING 유지 가능
→ survivors/retry policy 평가

failureScope=QUESTION
→ 현재 Question Transaction에 status/action 적용

failureScope=RUN
→ 현재 Exam Run 전체 정지
→ 이미 LOCALLY_FROZEN된 개별 Question artifact의 scoped PASS evidence는 보존
→ Exam Integration/Package failure를 특정 Question FAIL로 오염시키지 않음

failureScope=RELEASE
→ artifact release/Contract Freeze 차단
```

Candidate A가 `NUMERIC_CLONE`으로 REJECT되거나 Candidate-scoped unresolved로 EXCLUDE되어도 B/C가 required survivor minimum을 만족하면 Question 전체 FAIL로 환원하지 않는다.

`candidateDisposition=N_A`이면서 `workflowAction=ROOT_CAUSE_ESCALATE`인 failure는 RootCauseResolver가 `resolvedCandidateDisposition` 또는 `derivedFailureCode`를 반환하기 전 Candidate disposition을 적용하지 않는다.
 Candidate pool이 minimum을 만족하지 못할 때만 `JUDGE_POOL_INSUFFICIENT` reducer가 Question scope retry로 승격한다. 반대로 source/run/release scope 오류는 후보 생존 여부로 무시할 수 없다.

## Judge `REJECT_ALL` Routing

Judge가 Hard Gate 통과 후보를 선택하지 못하거나 모든 survivor가 score threshold 미달이면 `JudgeAction=REJECT_ALL`과 함께 `JUDGE_REJECT_ALL` event를 생성한다.

```text
JUDGE_REJECT_ALL
→ failureScope=QUESTION
→ base retryLevel=3
→ workflowAction=REGENERATE_PLANS
→ L3 budget exhausted 시 RETRY_LIMIT_EXCEEDED
```

Judge action만 기록하고 FailurePolicy routing 없이 멈추는 구현을 금지한다.

## Judge Pool Insufficient Routing

`JUDGE_POOL_INSUFFICIENT`는 Judge의 `REJECT_ALL`과 다르다. 전자는 **Judge 호출 전 survivor 수 부족**, 후자는 충분한 survivor를 Judge가 평가했으나 SELECT하지 못한 경우다.

```text
JUDGE_POOL_INSUFFICIENT
→ base retryLevel=2
→ recoverable approved Plan branch 있음: L2
→ 없음: effectiveRetryLevel=3
→ L3 exhausted: RETRY_LIMIT_EXCEEDED
```

## Failure-specific Escalation Profiles

공통 `L1 exhausted → L2 → L3` 규칙은 폐기한다. `failure-policy.json`의 모든 retryable code는 `escalationProfileId`를 반드시 가진다. `retry-escalation-profile.json`이 유일한 exhaustion graph 정본이다.

```text
SOURCE_REPARSE_BOUNDED
  SOURCE_PARSE_FAIL → REPARSE_SOURCE x level1Max → exhausted: HUMAN_REVIEW / Question BLOCKED

STAGE_AGENT_BOUNDED
  AGENT_OUTPUT_SCHEMA_FAIL / OUTPUT_TRUNCATED
  → failed Stage 재호출
  → exhausted: Candidate owner=EXCLUDE / Question owner=HUMAN_REVIEW / Run owner=ABORT_RUN

CANDIDATE_LOCAL_PLAN_REGEN
  L1 LOCAL_REBUILD → L2 RESELECT_PLAN → L3 REGENERATE_PLANS → RETRY_LIMIT_EXCEEDED

CANDIDATE_REREALIZE_PLAN_REGEN
  local rerealize → L2 RESELECT_PLAN → L3 REGENERATE_PLANS → RETRY_LIMIT_EXCEEDED

CANDIDATE_PLAN_REGEN
  L2 RESELECT_PLAN → L3 REGENERATE_PLANS → RETRY_LIMIT_EXCEEDED

ROOT_CAUSE_DYNAMIC_RECOVERY
  resolver가 L1 [LOCAL_REBUILD|REREALIZE_PROBLEM|REREALIZE_SOLUTION] 반환
  → level1Max 소진 시 L2 RESELECT_PLAN
  → L2 소진 시 L3 REGENERATE_PLANS
  → RETRY_LIMIT_EXCEEDED

  resolver가 처음부터 L2 RESELECT_PLAN 반환
  → L2 budget부터 사용
  → L3 REGENERATE_PLANS
  → RETRY_LIMIT_EXCEEDED

  derivedFailureCode 반환
  → 원 profile 중지
  → derived code의 FailurePolicy를 새로 dispatch

PLAN_REGEN_BOUNDED
  PLAN_DIVERSITY_FAIL / PLAN_POOL_INSUFFICIENT / transform-plan class
  → L3 REGENERATE_PLANS → exhausted: HUMAN_REVIEW

RUN_SERIALIZE_PACKAGE_BOUNDED
  JS_SCHEMA_FAIL / ARCHIVE_SERIALIZATION_DRIFT / PACKAGE_ROUNDTRIP_FAIL
  → 해당 Run-local rebuild만 수행 → exhausted: RUN BLOCKED
  → Plan action으로 승격 금지

JUDGE_POOL_RECOVERY
  JUDGE_REJECT_ALL / JUDGE_POOL_INSUFFICIENT
  → reusable branch면 L2 → 아니면 L3 → exhausted: HUMAN_REVIEW

EXAM_REOPEN_GRAPH
  EXAM_* repairable failure
  → EX-03..EX-10 scan에서는 pendingRepairIntent만 생성, 즉시 mutation 금지
  → EX-11 reducer가 정확히 1개의 intent를 선택한 뒤 WorkflowAction dispatch
  → Content Retry level 미소모
  → ReopenTargetPolicy + Exam Reopen Budget
  → budget exhausted: EXAM_REOPEN_BUDGET_EXCEEDED

TERMINAL_NONE
  retryable=false
```

각 failure code는 정확히 하나의 profile을 참조해야 하며 profile이 failureScope/Stage phase/workflowAction과 호환되지 않으면 `FAILURE_POLICY_GRAPH_INVALID → RELEASE_BLOCK`이다.

Advisory code는 이 Registry에 넣지 않는다.

---


# 42A. RootCauseResolverRegistry

`ROOT_CAUSE_ESCALATE`는 자유 판단 action이 아니다. `root-cause-resolver.schema.json`의 deterministic rule set이 정확히 1개의 registered WorkflowAction으로 해소한다.

입력 fact 예:

```text
parameterCounterexampleFound
parameterDomainFailure
problemIrStructuralMismatch
transformInvariantFailure
solutionIrOnlyMismatch
serializationOnlyMismatch
independentSolverExactConflict
validatorInternalConsistencyFailure
engineInvariantFailure
```

초기 precedence:

```text
engineInvariantFailure
→ derivedFailureCode = ENGINE_INVARIANT_FAIL

validatorInternalConsistencyFailure
→ derivedFailureCode = VALIDATOR_INCOMPLETE

parameterCounterexampleFound OR parameterDomainFailure
→ LOCAL_REBUILD

solutionIrOnlyMismatch
→ REREALIZE_SOLUTION

serializationOnlyMismatch AND failingArtifactType == PROBLEM
→ REREALIZE_PROBLEM

serializationOnlyMismatch AND failingArtifactType == SOLUTION
→ REREALIZE_SOLUTION

finalTextCloneSurfaceOnly == true
→ REREALIZE_PROBLEM

finalTextCloneSurfaceOnly == false
→ RESELECT_PLAN

languageIntegrityProblemOnly == true
→ REREALIZE_PROBLEM

languageIntegritySolutionOnly == true
→ REREALIZE_SOLUTION

solutionTextOnlyCurriculumViolation == true
→ REREALIZE_SOLUTION

solutionIrCurriculumViolation == true
→ RESELECT_PLAN

transformInvariantFailure OR problemIrStructuralMismatch
→ RESELECT_PLAN

independentSolverExactConflict
→ EXCLUDE_CANDIDATE_UNVERIFIED
```

둘 이상의 rule이 동시에 match하면 위 precedence의 가장 앞선 rule 1개만 선택한다. 어떤 rule도 match하지 않으면:

```text
ROOT_CAUSE_UNRESOLVED
→ Candidate EXCLUDE
```

`ROOT_CAUSE_ESCALATE`는 coordinate를 직접 변경하지 않고 resolver가 반환한 **기존 WorkflowActionRegistry action**을 다시 dispatch한다.

Resolver output canonical fields:

```text
derivedFailureCode [nullable]
resolvedWorkflowAction [nullable when derivedFailureCode set]
effectiveRetryLevel [nullable when derivedFailureCode set]
resolvedCandidateDisposition [RETRY|REJECT|EXCLUDE|N_A]
matchedRuleId
rootCauseEvidenceHash
```

`resolvedWorkflowAction`은 WorkflowActionRegistry에 존재해야 하고 `effectiveRetryLevel`은 해당 action/escalation profile과 호환되어야 한다. 예: parameter root cause는 L1, structural Plan root cause는 L2다. 불일치하면 `FAILURE_POLICY_GRAPH_INVALID`.

`derivedFailureCode`가 존재하면 원래 failure event는 audit/root-cause evidence로 보존하되 **routing은 derived code의 FailurePolicy를 새로 dispatch**한다. 원래 Candidate disposition을 먼저 적용하지 않는다. `derivedFailureCode`와 `resolvedWorkflowAction`을 동시에 실행하는 것은 금지한다.



`rootCauseResolverHash`는 Run Environment Lock + Freeze Provenance에 포함한다.

---

# 43. PublicationStatus / PublicationPolicyRegistry

콘텐츠 품질 상태와 배포 상태를 분리한다. SEALED 콘텐츠의 `finalStatus=PASS`는 publish 장애로 바뀌지 않는다.

## PublicationStatus

```text
NOT_STARTED
PUBLISHING
PUBLISH_CONFLICT
PUBLISH_FAILED
PUBLISH_REPAIR_REQUIRED
PUBLISHED
```

허용 전이:

```text
NOT_STARTED → PUBLISHING
PUBLISHING → PUBLISHED
PUBLISHING → PUBLISH_CONFLICT
PUBLISHING → PUBLISH_FAILED
PUBLISHING → PUBLISH_REPAIR_REQUIRED
PUBLISH_CONFLICT → PUBLISHING     [latest head recheck 후 새 attempt]
PUBLISH_FAILED → PUBLISHING       [rollback 확인 + retry 승인 후]
```

항상:

```text
WorkflowState = SEALED
content finalStatus = PASS
```

를 유지한 채 PublicationStatus만 변한다.

## PublicationPolicyRegistry

| code | publicationStatus | retryable | humanReview | action |
|---|---|---:|---:|---|
| `PUBLISH_CAS_CONFLICT` | PUBLISH_CONFLICT | true | false | `REFRESH_HEAD_AND_RECHECK` |
| `PUBLISH_ARCHIVE_DUPLICATE_CONFLICT` | PUBLISH_CONFLICT | false | true | `START_SUCCESSOR_RUN` |
| `ATOMIC_PUBLISH_FAIL` | PUBLISH_FAILED | true | true | `ROLLBACK_AND_RETRY` |
| `POST_PUBLISH_SMOKE_FAIL` | PUBLISH_FAILED | true | true | `ROLLBACK_OR_REPAIR_PUBLISH` |
| `PUBLISH_REPAIR_REQUIRED` | PUBLISH_REPAIR_REQUIRED | false | true | `MANUAL_REPAIR_WITHOUT_DESTRUCTIVE_ROLLBACK` |

Publication code는 `FailurePolicyRegistry.finalStatus`를 수정할 수 없다.

`START_SUCCESSOR_RUN`은 현재 SEALED artifact를 변경하지 않는다. 새 `runId`를 생성하고 predecessor sealed artifact hash/source refs를 provenance로 전달한다. successor Run은 Qn-01/정책이 허용한 canonical restart point부터 새 Proof Transaction을 수행하며 새 freeze/seal을 획득해야 한다.


---

# 44. AdvisoryCodeRegistry 분리

Failure와 stale advisory를 섞지 않는다.

예:

```text
RULEBOOK_SUPERSEDED
SCHEMA_SUPERSEDED
MODEL_ROUTE_SUPERSEDED
THRESHOLD_SUPERSEDED
CURRICULUM_MASTER_SUPERSEDED
SEMANTIC_PARSER_SUPERSEDED
EXACT_ENGINE_SUPERSEDED
ARCHIVE_INDEX_SUPERSEDED
POLICY_BUNDLE_SUPERSEDED
```

`STALE_REVALIDATION_REQUIRED`는 advisory result이지 FailurePolicyRegistry code가 아니다.

---


# 44A. Policy Context Scope Resolver

Self-integrity code는 발생한 Stage의 ownerScope를 상속하지 않는다.

`policy-context-scope.schema.json`:

```text
policyExecutionContext:
  PHASE0_RELEASE
  RUNTIME
```

resolver:

```text
PHASE0_RELEASE → failureScope=RELEASE
RUNTIME        → failureScope=RUN
```

적용 code:

```text
RUN_ENVIRONMENT_SPEC_PARITY_FAIL
FAILURE_POLICY_GRAPH_INVALID
WORKFLOW_ACTION_UNRESOLVED
```

위 self-integrity code가 Candidate/Question Stage 안에서 발견되어도 CANDIDATE/QUESTION으로 resolve 금지.

Scope resolver 자체의 context 해석 실패는 재귀적으로 `POLICY_CONTEXT`를 사용하지 않는다. 실행 entrypoint가 이미 알고 있는 plane에 따라:

```text
alive-run runtime          → POLICY_SCOPE_RESOLUTION_FAIL_RUNTIME
contract/release validator → POLICY_SCOPE_RESOLUTION_FAIL_RELEASE
```

의 FIXED code를 emit한다.

Approval reducer failure는 scope가 다르므로 code를 분리한다.

```text
QUESTION_APPROVAL_REDUCER_FAIL → QUESTION
EXAM_APPROVAL_REDUCER_FAIL     → RUN
```

`scopeContextResolverHash`는 Run Environment Lock + Freeze Provenance에 포함한다.

---

# 45. Workflow State Transition Table

## WorkflowState — content transaction only

```text
PENDING
ACTIVE
CANDIDATES_READY
VALIDATING
APPROVED
LOCALLY_FROZEN
REOPENED
SEALED
```

허용:

```text
PENDING → ACTIVE
ACTIVE → CANDIDATES_READY
CANDIDATES_READY → VALIDATING
VALIDATING → APPROVED
APPROVED → LOCALLY_FROZEN
LOCALLY_FROZEN → REOPENED      [Exam Gate only]
REOPENED → ACTIVE
LOCALLY_FROZEN → SEALED        [Exam PASS only]
```

금지:

```text
ACTIVE → SEALED
SEALED → REOPENED
```

## FinalStatus — content quality only

```text
PASS | HOLD | BLOCKED | FAIL
```

## JudgeAction

```text
SELECT | REJECT | REJECT_ALL
```

Cross invariant:

```text
LOCALLY_FROZEN → finalStatus == PASS
SEALED → finalStatus == PASS
publicationStatus != PUBLISHED 이어도 SEALED content PASS는 유지
JudgeAction=SELECT → required Gate PASS/N_A + Evidence complete
```

---

# 46. HOLD / Infra Retry / Content Retry Contract

## HOLD

`HOLD`는 PASS가 아니다. 다만 **scope를 구분한다.**

```text
selected Candidate / Question / Run scope HOLD
→ LOCALLY_FROZEN / SEALED 금지

non-selected Candidate scope HOLD + candidateDisposition=EXCLUDE
→ 해당 Candidate만 survivor pool에서 제거
→ 다른 survivor가 Judge Pool minimum을 만족하면 Question Transaction 진행 가능

publicationStatus=PUBLISHED는 SEALED content precondition을 요구하지만 publication failure는 content Gate status를 변경하지 않는다.
```

`ARCHIVE_DUPLICATE_UNVERIFIED`는 Archive Gate 내부의 허용 retrieval/verification 시도를 모두 소진한 뒤 emit하며, emit된 Candidate는 `HOLD + EXCLUDE`로 Judge pool에서 제거한다. Global index/recall 자체가 불완전하면 별도 RUN-scope `ARCHIVE_INDEX_RECALL_BELOW_THRESHOLD`로 정지한다.

## Infra Retry

대상:

```text
LLM 429/5xx
network timeout
broken pipe
Python worker crash
IPC stall
temporary filesystem error
socket/stream-level response truncation
```

정책:

```text
exponential backoff
maxInfraRetry = 3
Content Retry budget 미소모
```

infra 재실패 → `INFRA_BLOCKED`.

`OUTPUT_TRUNCATED`는 transport/socket failure code가 아니다. **transport가 정상 완료되었지만 structured Agent payload가 completion marker/required field를 끝까지 생성하지 못한 경우**에만 사용하며 `STAGE_AGENT_BOUNDED`를 따른다. socket/stream 자체가 끊긴 경우는 Infra Retry로 처리하고 stageAttempt/content retry를 소비하지 않는다.

동일 `(stageId, op, inputHash, workerVersion)`에서 infra crash/OOM/stall이 3회 연속 발생하면 `sameInputInfraFailureCount=3` circuit breaker를 열고 동일 입력 infra retry를 더 하지 않는다. 입력이 Parameter/Builder 산출물이라 재생성 가능한 경우 FailurePolicy evidence와 함께 해당 content root cause로 escalation하고, source/validator 고정 입력이면 `INFRA_BLOCKED`로 정지한다. 무한 same-input worker restart를 금지한다.

## Content Retry

FailurePolicyRegistry가 유일한 routing 정본이다. Content retry는 해당 `RetryCoordinates`만 증가시키며 무관한 PASS cache를 오염시키지 않는다.

`content-retry-policy.json` 정본:

```json
{
  "level1Max": 3,
  "level2Max": 2,
  "level3Max": 2,
  "totalContentRetriesMax": 7
}
```

강제:

```text
각 retryable Failure code → escalationProfileId REQUIRED
exhaustion transition → 해당 profile graph만 사용
Source/Pre-plan failure를 Plan action으로 승격 금지
Run Serialization/Package failure를 Question Plan action으로 승격 금지
Exam repair는 Content Retry level이 아니라 Exam Reopen Budget 사용
모든 content level 합산이 totalContentRetriesMax 초과 → RETRY_LIMIT_EXCEEDED
L4는 자동 content retry가 아니라 HUMAN/CAPABILITY stop
Infra retry는 위 카운트에 포함하지 않음
```

Failure code를 다른 code로 재분류하지 않는다. 매 retry decision evidence에는 반드시 다음을 기록한다.

```text
originalFailureCode
baseRetryLevel
effectiveRetryLevel
escalationReason
effectiveWorkflowAction
```

`contentRetryCount`는 현재 Question Transaction의 실제 content retry 총량만 세며 `contentRetryPolicyHash`를 Run Environment에 포함한다.

---

# 47. Idempotency ↔ Retry Contract

## RetryCoordinates canonical payload

전역 단일 retry generation으로 모든 Stage를 무효화하지 않는다. `retry-coordinate.schema.json`:

```json
{
  "planGeneration": 0,
  "candidateAttempt": {"A": 0, "B": 0, "C": 0},
  "problemRealizerAttempt": 0,
  "solutionRealizerAttempt": 0,
  "choiceShuffleAttempt": 0,
  "reopenGeneration": 0,
  "stageAttempt": {},
  "contentRetryCount": 0,
  "level1Count": 0,
  "level2Count": 0,
  "level3Count": 0
}
```

증가 규칙:

```text
L1 local candidate rebuild → 해당 candidateAttempt만 +1
Problem rerealize           → problemRealizerAttempt +1
Solution rerealize          → solutionRealizerAttempt +1
L2 plan reselect            → 해당 candidate branch를 폐기하고 새 candidateAttempt/plan selection evidence 생성
L3 regenerate plans         → planGeneration +1, 새 Plan batch 생성
Choice shuffle              → choiceShuffleAttempt +1
Exam reopen                 → reopenGeneration +1 AND choiceShuffleAttempt = 0

REPARSE_SOURCE
RECALL_AGENT
RETRY_AGENT_OUTPUT
또는 다른 same-stage semantic/content 재호출
→ `stageAttempt[stageId] + 1`
```

`stageAttempt`는 sparse map이며 key는 canonical Stage ID다. 존재하지 않는 key는 `0`으로 해석한다. Transport-level Infra Retry처럼 **동일 semantic request를 다시 전송하는 것**은 `stageAttempt`을 증가시키지 않고 infra attempt는 audit metadata에만 기록한다.

StageRegistry는 다음을 선언한다.

```text
retryCoordinateProjection[]
usesStageAttempt: boolean
seedSource:
  QUESTION
  PLAN_BATCH
  PLAN
  CANDIDATE
  PROBLEM_REALIZER
  SOLUTION_REALIZER
  GENERIC_STAGE
  SHUFFLE
```

`seedSource`는 Stage가 사용할 canonical `stageSeed`를 결정한다.

```text
QUESTION          → questionSeed
PLAN_BATCH        → planBatchSeed
PLAN              → planSeed
CANDIDATE         → candidateSeed
PROBLEM_REALIZER  → problemRealizerSeed
SOLUTION_REALIZER → solutionRealizerSeed
GENERIC_STAGE     → genericStageSeed(stageId)
SHUFFLE           → shuffleSeed
```

Source Parser/Ingestion/일반 Agent Stage는 `usesStageAttempt=true`, `seedSource=GENERIC_STAGE`로 두며 자신의 `stageAttempt[stageId]`만 execution key에 포함한다. Candidate L1 retry 때문에 Source Parser가 새 실행으로 간주되는 것을 금지한다.

`stageExecutionKey`:

```text
hash(
 stageId
 + stageVersion
 + inputHash
 + runEnvironmentHash
 + stageSeed
 + relevantRetryCoordinateHash
)
```

각 StageRegistry entry는 `retryCoordinateProjection[]`을 선언한다. 해당 Stage에 영향을 주지 않는 retry 좌표는 execution key에 포함하지 않는다. `usesStageAttempt=true` Stage는 자신의 `stageAttempt[stageId]`만 projection에 포함한다.

동일 Stage를 semantic/content 이유로 실제 재호출했는데 `stageAttempt`을 증가시키지 않아 같은 `stageExecutionKey` 아래 서로 다른 output artifact가 생기는 것을 `IDEMPOTENCY_KEY_COLLISION`으로 금지한다.

### Cache reuse

오직:

```text
status = PASS
AND terminal artifact complete
AND exact same stageExecutionKey
```

만 reuse.

FAIL/REJECT/UNVERIFIED/BLOCKED artifact는 자동 reuse 금지.

Content Retry로 Stage input 또는 해당 `retryCoordinateProjection` 값이 바뀌면 새 key다. 무관한 branch retry 때문에 upstream PASS cache를 전부 폐기하지 않는다.

## WorkflowActionRegistry — Action → Coordinate → Restart 정본

`workflow-action-registry.schema.json`이 모든 `workflowAction`의 실행 의미를 정한다.

| action | coordinate mutation | restart/next |
|---|---|---|
| `REPARSE_SOURCE` | `stageAttempt[Qn-02]+1` | `Qn-02` |
| `RECALL_AGENT` | `stageAttempt[failedStageId]+1` | `failedStageId` |
| `RETRY_AGENT_OUTPUT` | `stageAttempt[failedStageId]+1` | `failedStageId` |
| `LOCAL_REBUILD` | `candidateAttempt[candidateId]+1` | `Qn-12` candidate branch |
| `REBUILD_DISTRACTOR` | `stageAttempt[Qn-15]+1` | `Qn-15` |
| `REREALIZE_PROBLEM` | `problemRealizerAttempt+1` | `Qn-17` |
| `REREALIZE_SOLUTION` | `solutionRealizerAttempt+1` | `Qn-19` |
| `ROUTE_FALLBACK` | `stageAttempt[failedStageId]+1` | deterministic fallback route |
| `RESELECT_PLAN` | `candidateAttempt[candidateId]+1`; selectedPlanId MUST change | `Qn-12` new approved Plan branch |
| `REGENERATE_PLANS` | `planGeneration+1` | `Qn-08` |
| `RECOVER_JUDGE_POOL` | L2이면 `candidateAttempt[target]+1`, L3이면 `planGeneration+1` | `Qn-12` 또는 `Qn-08` |
| `REBUILD_SERIALIZATION` | `stageAttempt[RUN-ARCHIVE-SERIALIZATION]+1` | `RUN-ARCHIVE-SERIALIZATION` |
| `REBUILD_PACKAGE` | `stageAttempt[RUN-PACKAGE-BUILD]+1` | `RUN-PACKAGE-BUILD` |
| `REBUILD_INDEX` | automatic content retry 없음; approved maintenance 시 `stageAttempt[RUN-ARCHIVE-INDEX]+1` | `RUN-ARCHIVE-INDEX` |
| `EXAM_REOPEN_TARGET` | target question `reopenGeneration+1` | target DAG earliest invalidated stage |
| `EXAM_REBALANCE_OR_REOPEN` | shuffle 가능 시 `choiceShuffleAttempt+1`, 아니면 target `reopenGeneration+1` | ReopenTargetPolicy result |
| `EXCLUDE_CANDIDATE_UNVERIFIED` | 없음 | candidate survivor pool 제외 → pool reducer |
| `ROOT_CAUSE_ESCALATE` | 직접 mutation 금지 | root-cause resolver가 다른 registered action 1개로 resolve 후 실행 |
| `HUMAN_REVIEW` | 없음 | Human Review Queue; 승인된 resume action만 후속 mutation |
| `ABORT_OR_UPGRADE_CAPABILITY` | 없음 | terminal RUN stop |
| `ABORT_RUN` | 없음 | terminal RUN stop |
| `RELEASE_BLOCK` | 없음 | terminal RELEASE block |
| `RELEASE_BLOCK_OR_ABORT_RUN` | 없음 | resolved scope에 따라 terminal RELEASE/RUN stop |

Registry에 없는 action은 `WORKFLOW_ACTION_UNRESOLVED → RUN/RELEASE BLOCK`. `workflowActionRegistryHash`는 Run Environment + Freeze Provenance에 포함한다.

`RUN-ARCHIVE-SERIALIZATION`, `RUN-PACKAGE-BUILD`, `RUN-ARCHIVE-INDEX`는 WorkflowActionRegistry가 사용하는 canonical Run-level Stage ID이며 StageRegistry에 실제 entry가 존재해야 한다. 존재하지 않는 restartStage를 참조하면 `WORKFLOW_ACTION_UNRESOLVED`다.

---

## Checkpoint / Resume Canonical Contract

`checkpoint.schema.json`은 Runtime/Human Review가 공통으로 사용하는 유일한 checkpoint 정본이다.

```json
{
  "checkpointId": "",
  "stageId": "",
  "stageExecutionKey": "",
  "inputHash": "",
  "outputHash": "",
  "runEnvironmentHash": "",
  "retryCoordinatesHash": "",
  "resumable": true,
  "resumeFromStageId": "",
  "createdEventSeq": 0
}
```

Resume:

```text
manifest load
→ checkpoint schema/hash verify
→ referenced output artifact hash verify
→ runEnvironmentHash equality verify
→ retryCoordinatesHash restore
→ resumable=true 확인
→ Stage DAG에서 resumeFromStageId 이후만 재실행
```

불완전 checkpoint, eventSeq/hash 불일치, 다른 environment checkpoint 사용은 `CHECKPOINT_INTEGRITY_FAIL`이다. Human Review의 `resumeCheckpointId`는 반드시 이 schema의 실제 checkpoint를 참조해야 한다.

---

# 48. DAG Re-execution Convergence Budget

문항 하나에서 Stage DAG invalidation/re-run이 순환할 수 있으므로 별도 상한.

```json
{
  "maxDagReexecutionPasses": 6,
  "maxStageInvalidations": 40
}
```

초과:

```text
DAG_CONVERGENCE_EXCEEDED
→ BLOCKED / HUMAN_REVIEW
```

Content Retry와 별도로 카운트.

---

# 49. Stage Dependency DAG

모든 Stage:

```text
dependencies[]
inputProjection[]
invalidates[]
```

Upstream hash 변경:
downstream evidence automatic INVALIDATED.

수기 재검 목록을 신뢰하지 않는다.

---

# 50. Crash-safe Atomic Write / Node↔Python IPC / Worker Guard

## Crash-safe Atomic Write

```text
write temp
→ fsync(file)
→ schema validate
→ canonical hash
→ atomic rename
→ fsync(parent directory)
→ checkpoint update
→ fsync(manifest/event log as required)
```

불완전 stage artifact는 checkpoint로 인정하지 않는다.

## Node ↔ Python IPC

V0.x 기본:

```text
Persistent per-run Worker Pool + stdio NDJSON
small control payload only
maxInlineResponseBytes = 65536
requestId correlation required
```

대용량 결과는 `artifactRef + artifactHash`로 전달한다.

Node는 stdout/stderr를 분리 소비하고 max-line guard, stalled-pipe timeout, worker kill/restart를 구현한다.

## Worker Pool

```text
per-run default workers = 2
per-run max workers = 3
globalMaxPythonWorkers = 6
```

한 문항 Candidate A/B/C 내부만 병렬 exact 작업이 가능하고 Qn+1은 Qn LOCALLY_FROZEN 전 시작할 수 없다.

## Resource Guard

초기값:

```text
SOLVE_EXACT              5s
CHECK_EQUIVALENCE        5s
SEARCH_PARAMETERS       12s
ENUMERATE_FINITE        10s
FIND_MIN_SOLUTION       12s
FUZZ_BOUNDARY_VALUES     8s
maxParameterCandidates = 5000
maxSearchIterations     = 20000
maxAdversarialCases     = 2000
workerSoftMemoryMB      = 512
```

Worker infra failure는 Content Retry budget을 소비하지 않는다.

---

# 51. Reproducibility / Deterministic Seed

모드:

```text
LIVE
SNAPSHOT
REPLAY
```

Agent snapshot:

```text
inputHash
promptHash
modelRoute
modelConfigHash
responseHash
rawResponseArtifactHash
```

Seed는 heuristic reproducibility만 담당하며 LLM bit-identical generation을 보장한다고 쓰지 않는다.

## Deterministic Seed Derivation

`H(x) = SHA256(UTF8(canonical tuple x))`로 정의하며 단순 문자열 이어붙이기를 사용하지 않는다.

```text
runSeed       = explicit run config value
questionSeed  = H([runSeed, sourceUid])
planBatchSeed = H([questionSeed, "plan-batch", planGeneration, reopenGeneration])
planSeed      = H([planBatchSeed, planId])
candidateSeed = H([planSeed, candidateId, candidateAttempt[candidateId]])
problemRealizerSeed  = H([candidateSeed, "problem-realizer", problemRealizerAttempt])
solutionRealizerSeed = H([candidateSeed, "solution-realizer", solutionRealizerAttempt])
genericStageSeed(stageId)
              = H([questionSeed, "stage", stageId, stageAttempt[stageId], reopenGenerationIfApplicable])
shuffleSeed   = H([questionSeed, "choice-shuffle", reopenGeneration, choiceShuffleAttempt])
```

사용처:

```text
parameter search ordering
candidate deterministic ordering
choice shuffle
randomized heuristic/fuzz ordering
```

`planGeneration`/`candidateAttempt`/Realizer attempt/해당 `stageAttempt[stageId]`가 증가한 branch 또는 Stage만 파생 seed가 달라진다. Exam reopen 시 `reopenGeneration`을 증가시키며 applicability상 reopen 영향을 받는 Stage의 seed만 새 세대로 이동한다. 무관한 Stage의 seed는 유지한다.

`seedPolicyHash`, `runSeed`, `questionSeed`는 provenance에 저장한다. Plan/Candidate 파생 seed는 해당 stage evidence에 저장한다.

## Choice Shuffle Attempt / Permutation History

`choice-shuffle-policy.json` 초기값:

```json
{
  "maxChoiceShuffleAttemptsPerReopenGeneration": 5,
  "requireDifferentPermutationFromHistory": true
}
```

각 shuffle evidence는:

```text
choiceShuffleAttempt
shuffleSeed
beforeOrderHash
afterOrderHash
permutationHash
permutationHistoryHash
```

를 기록한다.

동일 `reopenGeneration`에서 이미 사용한 `permutationHash`를 다시 생성하면 성공으로 인정하지 않고 다음 `choiceShuffleAttempt`으로 진행한다. 허용 가능한 새 permutation을 bounded attempt 안에 찾지 못하면 shuffle을 포기하고 `EXAM_REOPEN_TARGET`으로 전환한다.


Production `runSeed`는 non-empty 필수다. wall-clock/random implicit seed를 금지한다. 누락/형식 오류:

```text
RUN_SEED_INVALID
→ BLOCKED
```

---

# 52. Hash Canonicalization — Field Semantics

Schema field마다:

```text
orderSemantics:
  ORDERED
  SET
  MULTISET
```

를 명시.

Field Semantics Registry v1은 선택지를 허용하지 않고 필드마다 하나의 의미를 고정한다.

```text
symbols              = SET
givens                = SET
constraints           = SET
objective             = SINGLE
solution.steps        = ORDERED
choices               = ORDERED
conceptKeys           = SET
units                 = SET
visualRefs            = ORDERED
curriculumClaims      = SET
solverClaims          = SET_BY_CLAIM_ID
solutionGraph.nodes   = SET_BY_NODE_ID
solutionGraph.edges   = SET_BY_CANONICAL_EDGE
```

SET 계열은 element canonical semantic hash의 lexicographic ascending 순서로 직렬화한 뒤 hash한다. `SET_BY_*`는 지정 canonical key로 정렬하고 key collision을 schema fail로 처리한다. 배열 순서를 runtime이 임의로 `MULTISET`/dependency order 중 선택하는 것을 금지한다. 이 registry의 버전/hash는 `hashCanonicalizationSpecHash`로 Run Environment에 포함한다.

Number canonicalization:

```text
1, 1.0, 1e0 → canonical integer "1"
-0 → "0"
finite decimal → normalized decimal
rational → reduced "p/q"
irrational exact → canonical symbolic AST
NaN/Infinity → forbidden unless schema explicitly allows
```

Hash self-field, timestamps, audit metadata 제외.

---

# 53. Budget — Fail Closed

Production 기본 config 초기값:

```json
{
  "questionBudget": {
    "maxAgentCalls": 30,
    "maxPythonCalls": 60,
    "maxToolCalls": 100,
    "maxWallClockSec": 600,
    "maxCostUSD": 2.00
  }
}
```

값은 config version으로 관리하며 runEnvironmentHash에 포함한다.

Production에서 `maxCostUSD=null` 금지.

비용 추적 unsupported 환경:

```text
costEnforcement = UNSUPPORTED
```

를 명시하고 Production capability check 승인 없이는 실행하지 않는다.

Budget 초과 시 품질 기준을 낮추지 않고 `QUESTION_BUDGET_EXCEEDED` / `PROMPT_BUDGET_EXCEEDED` 등 해당 FailurePolicy를 따른다.

Golden Loop 진입 전 `budget-feasibility-report.json`으로 no-retry baseline, I3 mandatory baseline, 1회 L1 retry baseline의 예상/실측 Agent/Python/tool/wall-clock 호출량을 비교한다. 기본 budget이 정상 경로 자체를 구조적으로 막으면 Contract threshold를 완화하는 것이 아니라 budget config를 재보정하고 regression evidence를 남긴다.

---

# 54. Prompt / Context / Truncation Contract

Agent별 input payload는 JSON allowlist.

Prompt Compiler budget:

```text
maxInputTokens
reservedOutputTokens
```

초과:
`PROMPT_BUDGET_EXCEEDED`

Truncation detection:

```text
JSON parse incomplete
completion marker missing
required field missing
output hash absent
```

→ `OUTPUT_TRUNCATED`

잘린 출력 이어붙이기 금지.

---

# 55. Judge Rubric Profiles — 100점

## Judge Candidate Pool Sufficiency — Hard Precondition

Judge를 호출하기 전에 survivor pool을 기계 계산한다.

`survivor` 정의:

```text
해당 Candidate의 applicable GateInstanceResult 전부 PASS/N_A
AND Candidate-scoped HOLD/BLOCKED/UNVERIFIED 없음
AND candidateDisposition NOT IN [REJECT, EXCLUDE]
AND Proof Obligations complete
AND Validator Evidence complete
```

mode별 정본 `judge-pool-policy.json`:

```json
{
  "EXAM_FOLLOWUP": {
    "minSurvivingCandidatesForJudge": 2,
    "minDistinctSourcePlanIdsForJudge": 2
  },
  "STRICT_VARIANT": {
    "minSurvivingCandidatesForJudge": 1,
    "minDistinctSourcePlanIdsForJudge": 1
  }
}
```

강제:

```text
survivorCount >= requiredMinimum
AND distinctSurvivingSourcePlanIdCount >= requiredDistinctPlanMinimum
→ Judge 실행 가능

survivorCount < requiredMinimum
OR distinctSurvivingSourcePlanIdCount < requiredDistinctPlanMinimum
→ Judge 호출 금지
→ JUDGE_POOL_INSUFFICIENT
```

`JUDGE_POOL_INSUFFICIENT` recovery:

```text
재사용 가능한 approved Plan branch가 존재하고 해당 branch의 L2 budget이 남음
→ originalFailureCode=JUDGE_POOL_INSUFFICIENT
→ effectiveRetryLevel=2
→ effectiveWorkflowAction=RECOVER_JUDGE_POOL

그 외
→ effectiveRetryLevel=3
→ effectiveWorkflowAction=REGENERATE_PLANS

L3 budget exhausted
→ RETRY_LIMIT_EXCEEDED
```

`survivorCount=1`인 EXAM_FOLLOWUP 후보를 score 80 이상이라는 이유만으로 SELECT하는 구현을 금지한다. `judgePoolPolicyHash`는 Run Environment Lock + Freeze Provenance에 포함한다.

Judge는 **모든 Hard Gate를 통과한 survivor 후보만 ranking**한다. Candidate/ProblemIR/SolutionIR를 수정할 권한이 없고 FAIL/HOLD/BLOCKED를 뒤집을 수 없다.

## MCQ_RUBRIC_100

```text
Variation Quality       30
Difficulty Role Fit     20
Educational Value       20
Wording Naturalness     10
Distractor Quality      10
Within-Exam Novelty     10
TOTAL                  100
```

## NON_MCQ_RUBRIC_100

```text
Variation Quality       30
Difficulty Role Fit     20
Educational Value       25
Wording Naturalness     15
Within-Exam Novelty     10
TOTAL                  100
```

No re-normalization on the fly.

Rubric profile은 canonical `questionType`으로 requiredGateManifest freeze 전에 결정한다.

```text
MCQ → MCQ_RUBRIC_100
SHORT_ANSWER → NON_MCQ_RUBRIC_100
CONSTRUCTED_RESPONSE → NON_MCQ_RUBRIC_100
```

SELECT:

```text
all Hard Gates PASS/N_A by manifest
AND HOLD 없음
AND all Proof Obligations complete
AND Validator Evidence complete
AND score >= 80
```

조건 불충족 후보는 ranking 대상이 아니다.

---

# 56. Judge Anchors

각 0~10/0~5 축에:

```text
LOW anchor
MID anchor
HIGH anchor
```

를 calibration examples와 함께 별도 config로 고정.

Tie-break:

```text
score diff >= 1 → higher score
else Variation
else Educational
else Novelty
else lexical(candidateHash)
```

## Within-Exam Novelty Empty-History Convention

`novelty-baseline-policy.json`:

```text
previousFrozenCount == 0
→ Within-Exam Novelty score = 10
```

Q01에서 0점/N/A/즉석 재정규화를 사용하지 않는다.

Within-Exam Novelty 비교집합:

```text
initial sequential build
→ 현재 questionUid를 제외한 이미 LOCALLY_FROZEN된 동일 Exam Run 문항

Exam Reopen 후 재Judge
→ 현재 questionUid의 이전 frozen artifact는 제외
→ 현재 Exam Run의 다른 모든 LOCALLY_FROZEN 문항(앞/뒤 번호 모두 포함)
```

self-history와 비교하여 novelty를 인위적으로 낮추는 것을 금지한다.


## Qn-38 Deterministic Question FinalStatus Reducer

Qn-38은 Agent가 아니라 `approval-reducer.schema.json`의 deterministic reducer다.

```text
JudgeAction == SELECT
AND selectedCandidate exists
AND selectedCandidate applicable GateInstanceResult 전부 PASS/N_A
AND Question-scope applicable GateInstanceResult 전부 PASS/N_A
AND Proof Obligations complete
AND Validator Evidence complete
AND selected Candidate/Question/Run에 unresolved HOLD/BLOCKED/UNVERIFIED 없음
→ question.finalStatus = PASS
→ workflowState = APPROVED
```

미충족 → `QUESTION_APPROVAL_REDUCER_FAIL`, LOCALLY_FROZEN 금지. Human sign-off는 audit metadata일 뿐 reducer를 override하지 못한다.

## Exam Final Approval Reducer

```text
모든 EX required GateInstanceResult PASS
AND locallyFrozenCount == expectedQuestionCount
AND unresolved Exam failure 없음
AND reopen budget 유효
→ examIntegrationStatus = PASS
```

미충족 → `EXAM_APPROVAL_REDUCER_FAIL`, SEALED 금지.

SEALED의 `Exam Final Approval Reducer PASS`는 이 reducer PASS를 뜻한다. `approvalReducerSpecHash`는 환경/Freeze에 포함한다.

---

# 57. Exam Reopen Budget

## Canonical Exam Integration Transaction

`exam-stage-registry.schema.json`의 유일한 순서:

```text
EX-01 COMPLETENESS
EX-02 ONE-TO-ONE SOURCE MAPPING
EX-03 BLUEPRINT COMPLIANCE
EX-04 TRANSFORM DISTRIBUTION
EX-05 WORDING PATTERN DUPLICATION
EX-06 PAIRWISE FINAL-TEXT/STRUCTURE CLONE
EX-07 DIFFICULTY ROLE DISTRIBUTION
EX-08 ANSWER INDEX DISTRIBUTION
EX-09 VISUAL DISTRIBUTION / CONSISTENCY
EX-10 CROSS-QUESTION ARCHIVE/BATCH DUPLICATE
EX-11 REOPEN TARGET REDUCER
EX-12 EXAM FINAL APPROVAL REDUCER
```

Execution semantics:

```text
EX-01 / EX-02
→ structural prerequisite
→ FAIL 시 fail-fast + HUMAN_REVIEW, EX-03 이후 실행 금지

EX-03 .. EX-10
→ mutation 없이 고정 snapshot에 대해 순서대로 검사
→ repairable failure들을 모두 수집
→ 검사 도중 Question reopen/shuffle 금지

EX-11
→ EX-03..EX-10의 `EXAM_REOPEN_GRAPH` FailurePolicy는 scan 중 workflowAction을 즉시 실행하지 않고 `pendingRepairIntent`로 기록
→ 수집된 failure/action 후보를 1개의 deterministic repair decision으로 reduce
→ 선택된 intent 1개만 WorkflowActionRegistry로 dispatch
→ 한 Exam Integration pass당 최대 1개의 Question만 REOPEN

EX-12
→ failure set이 비어 있을 때만 실행 가능
→ PASS 후에만 Exam Integration PASS
```

EX-11이 repair를 실행하면 해당 Question이 다시 LOCALLY_FROZEN된 뒤 Exam Integration을 EX-01부터 새 pass로 시작한다.


각 EX stage는 `ownerScope=RUN`, dependencies/inputProjection/hardGate/evidence를 선언하며 생략/순서 변경 금지.

Failure mapping:

```text
EX-01 → EXAM_COMPLETENESS_FAIL
EX-02 → EXAM_SOURCE_MAPPING_FAIL
EX-03 → EXAM_BLUEPRINT_FAIL
EX-04 consecutive/template-op violation → EXAM_TRANSFORM_DISTRIBUTION_FAIL
EX-04 concentration > 35%             → EXAM_TRANSFORM_CONCENTRATION_EXCESS
EX-05 → EXAM_WORDING_PATTERN_FAIL
EX-06 → EXAM_PAIRWISE_CLONE
EX-07 → EXAM_DIFFICULTY_DISTRIBUTION_FAIL
EX-08 → EXAM_ANSWER_DISTRIBUTION_FAIL
EX-09 → EXAM_VISUAL_DISTRIBUTION_FAIL
EX-10 → EXAM_CROSS_DUPLICATE_FAIL
```

## Deterministic ReopenTargetPolicy

```text
pairwise clone/cross duplicate
→ lower Judge score question
→ tie: later questionNumber
→ tie: lexical(questionUid) descending

transform/wording distribution
→ violation window의 lowest Judge score
→ tie: later questionNumber

difficulty/blueprint
→ repair predicate를 만족하는 eligible question/action을 생성
→ ReopenImpactMetric 최소 tuple 선택

answer distribution
→ overrepresented answerIndex 중 choiceOrderMutable=true deterministic shuffle 우선
→ bounded shuffle 불가 시 ReopenImpactMetric 최소 tuple의 eligible question reopen
```

모든 선택은 `reopenTargetPolicyHash` + evidence를 남긴다.

## ReopenImpactMetric — 결정론적 target ranking

`최소 semantic delta`, `lowest-impact` 같은 자연어 판단을 금지한다. `reopen-impact-metric.schema.json`의 lexicographic tuple만 사용한다.

각 eligible Question/action pair에 대해:

```text
repairClass
  0 = deterministic choice shuffle
  1 = final text/realizer-only rebuild
  2 = local candidate rebuild
  3 = approved Plan reselect
  4 = Plan regenerate

reopenImpactTuple = [
  failurePriority,
  repairClass,
  invalidatedHardGateCount,
  invalidatedStageCount,
  projectedDifficultyRoleDistance,
  projectedTransformDistributionPenalty,
  projectedAnswerDistributionPenalty,
  judgeScore,
  negativeQuestionNumber,
  lexicalQuestionUid
]
```

`failurePriority`는 `exam-stage-registry`의 canonical 값이다.

```text
0 = EX-06 pairwise clone / EX-10 cross duplicate
1 = EX-03 blueprint / EX-07 difficulty
2 = EX-04 transform / EX-05 wording
3 = EX-09 visual
4 = EX-08 answer distribution
```

모든 구성값은 Stage DAG/Exam metrics/기존 frozen evidence와 **등록된 repair action의 deterministic projection function**으로 계산한다. `judgeScore`는 낮을수록 먼저 reopen되며 `negativeQuestionNumber`는 같은 점수에서 뒤 문항을 먼저 선택하기 위한 정본 tie-break다. projection function이 없는 action은 eligible target이 아니며 임의 AI 추정값을 넣지 않는다.

선택:

```text
eligible candidate/action 중 reopenImpactTuple lexicographic ascending 최소.
eligible action 전부에 projection function이 없거나 tuple 계산이 불완전하면 `REOPEN_IMPACT_UNRESOLVED`
```

pairwise clone/cross duplicate의 기존 우선순위가 더 구체적이면 해당 rule을 먼저 적용하고, 동률/blueprint/difficulty/answer-distribution target 선택에서 `ReopenImpactMetric`을 사용한다.

`reopenImpactMetricHash`는 Run Environment + Exam evidence + Freeze Provenance에 포함한다.


문항 내부 DAG convergence와 시험지 전체 reopen은 별도 budget이다.

```text
maxTotalQuestionReopensPerExam = 3
maxExamIntegrationPasses = 4
```

초과:

```text
EXAM_REOPEN_BUDGET_EXCEEDED
→ BLOCKED / HUMAN_REVIEW
```

Exam Gate로 REOPEN한 문항은 Stage DAG가 지정한 earliest invalidated stage부터 재검하고 다시 LOCALLY_FROZEN된 뒤 Exam Integration을 처음부터 실행한다.

---

# 58. Exam Pairwise Clone — 전 문항

모든 final question pair 비교.

같은 family도 포함.

Threshold profile:

```text
same family:
  text >= 0.94 AND condition >= 0.92 → REOPEN

different family:
  text >= 0.92 AND condition >= 0.90 → REOPEN
```

---

# 59. Exam Quantitative Gates

별도 explicit blueprint가 없으면 **source exam의 역할/분포를 기본 blueprint**로 사용한다.

## Transform distribution

```text
same primaryTransform 4 consecutive → FAIL
one primaryTransform > 35% → EXAM_TRANSFORM_CONCENTRATION_EXCESS → deterministic REOPEN
same wording template 3 consecutive → FAIL
```

## Difficulty

CONFIRMATION 시험지는 source difficulty role 1:1.

## Answer Index

MCQ >= 15:

```text
max(count1..5) - min(count1..5) <= 2
```

초과 시 content 재생성 전에 `choiceOrderMutable=true` 문항의 deterministic shuffle을 시도하고 DAG가 downstream evidence를 무효화한다.

## Blueprint tolerance

```text
unit count ±1
problemType count ±1
difficulty role count ±1
questionType exact unless blueprint override
```

subUnit/cognitive operation/solutionEntry/visual distribution도 blueprint report에 기록하며, 세부 tolerance는 blueprint config version으로 고정한다.

---

# 60. Choice Shuffle Contract

`choiceOrderMutable=true`만 가능.

LOCALLY_FROZEN 문항의 choice order 변경도 semantic artifact 변경이므로 **항상 정식 Reopen으로 계산**한다.

```text
EX-08 answer distribution failure
→ ReopenTargetPolicy가 target question 선택
→ LOCALLY_FROZEN → REOPENED
→ reopenGeneration +1
→ choiceShuffleAttempt = 0
→ Qn-R01 CHOICE_SHUFFLE_REPAIR
→ choiceShuffleAttempt +1
→ deterministic shuffle
```

`Qn-R01`은 StageRegistry의 conditional repair Stage이며:

```text
seedSource = SHUFFLE
retryCoordinateProjection = [reopenGeneration, choiceShuffleAttempt]
ownerScope = QUESTION
```

을 가진다.

Shuffle 후 DAG가 downstream evidence를 자동 INVALIDATED한다. 최소 재검:

```text
Problem Semantic Round-Trip
Language Integrity
final student payload
final text clone
independent solver
exact answer mapping
distractor final
judge
freeze provenance
```

실제 invalidation 범위는 수기 목록이 아니라 Stage DAG가 결정한다.

같은 reopen generation에서 새 permutation을 찾지 못하면 bounded `choiceShuffleAttempt` 소진 후 **현재 REOPENED 상태를 유지한 채** ReopenImpactMetric이 non-shuffle repair action을 선택한다. 별도의 두 번째 reopen count를 추가하지 않는다.

---

# 61. Archive Serialization Contract

최종 Archive JS와 frozen IR 사이의 왕복 계약이다. **Package 검증 단계에서 LLM Semantic Parser를 새로 호출하여 IR을 다시 추정하지 않는다.** 최종 문제/해설의 의미 동치는 Qn-18/Qn-20에서 이미 Evidence로 증명되었고, serialization 단계는 그 승인 payload의 byte/structure/hash 보존을 증명한다.

## Serializer

```text
Frozen ProblemIR
→ final content/choices/answer/image

Frozen SolutionIR
→ final solution

metadata
→ Archive schema가 공식 지원하는 field만 final JS에 기록
```

내부 `ProblemIR/SolutionIR/solverClaims`를 최종 `window.questionBank`에 임의 신규 field로 주입하지 않는다.

검증용 staging sidecar:

```text
archive-serialization-sidecar.json
```

에는 다음 hash/ref만 둔다.

```text
questionUid
frozenProblemIrHash
frozenSolutionIrHash
finalProblemTextHash
finalChoicesAnswerHash
finalSolutionTextHash
assetHashes[]
semanticRoundTripEvidenceHash
```

이 sidecar는 production question schema의 일부가 아니며 verification/provenance artifact다.

## Archive Parser / Rehydration

```text
serialized Archive JS
→ deterministic JS parser
→ ParsedArchivePayload(content/choices/answer/image/solution)

ParsedArchivePayload
+ serialization sidecar
+ frozen canonical artifacts
→ deterministic rehydration verifier
```

Hard invariants:

```text
hash(parsed.content/choices/answer/image) == frozen approved payload hashes
hash(parsed.solution) == frozen finalSolutionTextHash
sidecar frozenProblemIrHash == Qn-39 candidateProblemIrHash
sidecar frozenSolutionIrHash == Qn-39 candidateSolutionIrHash
sidecar semanticRoundTripEvidenceHash == frozen validation evidence reference
asset hashes exact match
```

따라서 serialization 중 수학 텍스트가 한 글자라도 바뀌면 payload hash mismatch로 실패한다. 의미 검증을 새 LLM parse 결과의 우연한 동일성에 의존하지 않는다.

개념적 round-trip invariant:

```text
rehydrate(parse(serialize(frozen artifact)), verified sidecar)
== frozen approved artifact
```

실패:
`ARCHIVE_SERIALIZATION_DRIFT`

---

# 62. Freeze Provenance Canonical Payload

Qn-39에서 최소 다음을 canonical semantic payload로 freeze한다.

```text
sourceHash
sourceProblemIrHash
curriculumContractHash
sourceBaselineEvidenceHash
sourceShortcutEvidenceHash
sourceDifficultyBaselineHash
sourceBaselineSpecHash
curriculumContractSpecHash
candidateProblemIrHash
candidateSolutionIrHash
candidatePlanProvenanceHash
finalProblemTextHash
finalSolutionTextHash
answerChoicesHash
assetHashes[]
validationEvidenceHash
requiredGateManifestHash
contractBaselineHash
contractRegistryHash
contractCoverageHash
policyBundleHash
schemaSetHash
transformRegistryHash
compatibilityMatrixHash
failurePolicyHash
rootCauseResolverHash
scopeContextResolverHash
publicationPolicyHash
solverRoutingRegistryHash
capabilityManifestHash
contentRetryPolicyHash
retryEscalationProfileHash
workflowActionRegistryHash
gateInstanceSchemaHash
approvalReducerSpecHash
examStageRegistryHash
reopenTargetPolicyHash
reopenImpactMetricHash
planPoolPolicyHash
candidatePlanProvenanceSpecHash
choiceShufflePolicyHash
publishRollbackSpecHash
noveltyBaselinePolicyHash
milestoneCapabilityProfileHash
preRunValidationSpecHash
retryCoordinateSchemaHash
checkpointSchemaHash
hashCanonicalizationSpecHash
difficultyAxisDerivationHash
judgePoolPolicyHash
solverVerificationProfileHash
stageApplicabilitySpecHash
publishCasSpecHash
auditChainValidationSpecHash
seedPolicyHash
difficultyRoleDerivationHash
representationLevelRegistryHash
thresholdConfigHash
rubricAnchorHash
curriculumMasterHash
promptCompilerHash
archiveSnapshotHash
archiveIndexVersion
archiveIndexConfigHash
stageRegistryHash
stageDagHash
runEnvironmentHash
engineCommit
modelRoutingConfigHash
nodeLockHash
pythonLockHash
runSeed
questionSeed
retryCoordinatesHash
planGeneration
reopenGeneration
humanInterventionCount
humanInterventionManifestHash
auditChainHeadHashAtFreeze
```

`freezeHash`는 canonical semantic payload만 포함하며 timestamp/audit log 위치 등 비결정 metadata는 제외한다.

Freeze 이후 upstream semantic hash 하나라도 바뀌면 기존 evidence는 DAG에 의해 INVALIDATED되므로 동일 freezeHash를 재사용할 수 없다.

## Human Intervention Provenance

`human-intervention-manifest.schema.json`은 Human Review에서 source/input이 변경되거나 retry가 승인된 모든 개입을 canonical 기록한다.

```json
{
  "interventions": [
    {
      "reviewId": "",
      "decision": "APPROVE_RETRY",
      "reasonCodes": [],
      "beforeArtifactHashes": [],
      "afterArtifactHashes": [],
      "resumeCheckpointId": "",
      "humanDecisionEvidenceHash": ""
    }
  ]
}
```

개입이 없으면 canonical empty manifest의 hash를 사용한다. `approvedBy` 같은 개인 식별 metadata와 timestamp는 audit record에는 남기되 semantic freeze hash에서는 제외한다. 사람 개입이 있었다는 사실 자체와 before/after artifact hash는 반드시 `humanInterventionManifestHash`를 통해 freeze provenance에 들어간다.

---

# 63. SEALED Hard Gates

## Audit Chain Integrity Gate

SEALED 직전 `audit-chain-validation.schema.json`으로 `run-events.ndjson`의 pre-seal 구간을 검증한다.

```text
eventSeq 1..N 연속
각 eventContentHash 재계산 일치
각 previousEventHash == 직전 eventContentHash
첫 event previousEventHash == GENESIS
중복/누락/truncation 없음
manifest가 가리키는 auditChainHeadHash == event N hash
```

하나라도 실패하면 `AUDIT_CHAIN_INTEGRITY_FAIL → RUN BLOCKED`이며 SEALED 금지다. `EXAM_SEALED` 이벤트는 이 PASS 후 append되고, Publication 완료 시 publish manifest가 SEALED 이후 publication events 구간의 chain head를 다시 검증/기록한다.

SEALED 전 필수:

```text
LOCALLY_FROZEN count == expectedQuestionCount
Exam Integration PASS
Audit Chain Integrity PASS (pre-seal head)
Archive Serializer Round-Trip PASS
JS schema PASS
node --check PASS
engine load smoke PASS
asset refs PASS
Package Round-Trip PASS
Freeze hash chain PASS
Exam Final Approval Reducer PASS
```

---

# 64. Package Round-Trip Hash Chain

재추출 후:

```text
ProblemIR hash ↔ frozen ProblemIR hash
SolutionIR hash ↔ frozen SolutionIR hash
final problem text hash ↔ frozen text hash
final solution text hash ↔ frozen text hash
answer/choices hash ↔ frozen hash
asset hash ↔ frozen asset hash
```

모두 exact match.

---

# 65. Publish-time CAS + Latest Duplicate Recheck

멀티 Run race 방지.

RUN 시작:

```text
expectedArchiveHeadHash
```

Publish 직전 read-only precheck는 힌트일 뿐 publish 권한을 주지 않는다. 실제 write는 반드시 다음 둘 중 하나로 수행한다.

```text
A. atomic compareAndSwapArchiveHead(expectedHeadHash, newHeadHash, publishTxnId)
또는
B. exclusive publish lock 획득 → head verify → content/index commit → lock release
```

단순 `if currentHead == expectedHead: publish()` 형태의 check-then-write는 TOCTOU race 때문에 금지한다.

현재 head가 예상과 다르면:

```text
latest archive snapshot load
→ final duplicate recheck

PASS
→ 새 expected head/new head transaction 재계산
→ atomic CAS/lock transaction 새 attempt

DUPLICATE FAIL
→ PUBLISH_ARCHIVE_DUPLICATE_CONFLICT
→ publicationStatus = PUBLISH_CONFLICT
→ 현재 SEALED artifact는 내용 불변 유지
→ SEALED → REOPENED 금지
→ 필요하면 sealed artifact/source를 참조하는 successor Run을 새로 시작하여 재생성
```

즉 publish-time 최신 Archive 충돌을 이유로 이미 SEALED된 현재 Run의 Question을 직접 수정하지 않는다.

---

# 66. Atomic Publish Transaction

SEALED 콘텐츠는 그대로 두고 `publicationStatus`만 전이한다.

```text
publicationStatus = PUBLISHING
→ production staging
→ full payload verify
→ latest duplicate recheck
→ archive index delta prepare
→ atomic CAS primitive 또는 exclusive publish lock 획득
→ 동일 transaction boundary에서 content + index commit
→ new archive head commit
→ post-publish smoke
→ publish manifest
→ publicationStatus = PUBLISHED
```

## Publish Rollback Ownership

### Strategy A — Exclusive Lock
```text
lock 획득 → head verify → content/index/head commit → post-smoke → publish manifest → lock release
```
smoke 종료 전 lock release 금지.

### Strategy B — CAS with Owned Rollback

CAS strategy에서는 production content/index를 **기존 경로에 in-place overwrite한 뒤 head를 바꾸는 방식이 금지**된다.

```text
새 content/index를 publishTxnId/newHeadHash 기반 immutable version path에 먼저 기록
→ contentManifestHash/indexDeltaHash 검증
→ archive head pointer만 atomic CAS로 새 immutable version에 전환
```

따라서 head CAS 전 새 payload는 비가시적이고, rollback은 head pointer만 되돌리면 된다. immutable payload garbage cleanup은 별도 maintenance이며 다른 published run을 덮어쓰지 않는다.

```text
rollbackCompareAndSwap(
  expectedHead = thisTxn.newHeadHash,
  restoreHead = thisTxn.oldHeadHash,
  publishTxnId = thisTxn.publishTxnId
)
```

현재 head/ownership이 달라졌으면 파괴적 rollback 금지하고 `publicationStatus=PUBLISH_REPAIR_REQUIRED`.

```text
CAS conflict → PUBLISH_CONFLICT
commit 전 실패 → PUBLISH_FAILED
commit 후 smoke 실패 + owned rollback 성공 → PUBLISH_FAILED
owned rollback 불가 → PUBLISH_REPAIR_REQUIRED
콘텐츠 WorkflowState=SEALED, finalStatus=PASS 유지
```

`publish-cas.schema.json`은 `expectedHeadHash`, `oldHeadHash`, `newHeadHash`, `publishTxnId`, `contentManifestHash`, `indexDeltaHash`를 가진다. `publish-rollback.schema.json`은 ownership proof/current head/rollback result를 기록한다. TOCTOU 없는 atomicity를 증명 못 하면 `CAPABILITY_PRECHECK_FAIL`.

---

# 67. Archive Index Production Freshness

Publish 성공과 index 반영은 같은 transaction boundary.

허용 지연 윈도우:
`0`

새 published question은 다음 run의 duplicate retrieval에서 즉시 검색 가능해야 한다.

---

# 68. Semantic Parser / Source Parser Release Sets

별도 회귀 세트:

```text
SemanticPairSet
SourceIngestionPairSet
```

Known false accept = 0.

Source Parser A와 Verifier B가 같은 error를 동시에 내는 adversarial corpus 포함.

---

# 69. SHORTCUT / Exact Resource Guard

각 op 별 timeout/case cap.

Infrastructure failure는 Content Retry budget 미소모.

ADVANCED shortcut unresolved:
Freeze 금지.

---

# 70. Run Environment Lock

포함:

```text
policyBundleHash
contractBaselineHash
contractRegistryHash
contractCoverageHash
curriculumMasterHash
schemaSetHash
transformRegistryHash
compatibilityMatrixHash
failurePolicyHash
rootCauseResolverHash
scopeContextResolverHash
publicationPolicyHash
advisoryRegistryHash
solverRoutingRegistryHash
capabilityManifestHash
contentRetryPolicyHash
retryEscalationProfileHash
workflowActionRegistryHash
gateInstanceSchemaHash
approvalReducerSpecHash
examStageRegistryHash
reopenTargetPolicyHash
reopenImpactMetricHash
planPoolPolicyHash
candidatePlanProvenanceSpecHash
choiceShufflePolicyHash
sourceBaselineSpecHash
curriculumContractSpecHash
publishRollbackSpecHash
noveltyBaselinePolicyHash
milestoneCapabilityProfileHash
preRunValidationSpecHash
retryCoordinateSchemaHash
checkpointSchemaHash
solverVerificationProfileHash
stageApplicabilitySpecHash
publishCasSpecHash
auditChainValidationSpecHash
hashCanonicalizationSpecHash
seedPolicyHash
difficultyAxisDerivationHash
difficultyRoleDerivationHash
representationLevelRegistryHash
judgePoolPolicyHash
thresholdConfigHash
rubricAnchorHash
stageRegistryHash
stageDagHash
promptCompilerHash
archiveSnapshotHash
archiveIndexVersion
archiveIndexConfigHash
modelRoutingConfigHash
engineCommit
nodeLockHash
pythonLockHash
```

Run Environment hash 목록은 수기 병렬 목록이 아니라 `run-environment-spec.schema.json`의 required field set에서 생성한다. Freeze Provenance가 환경 정본으로 참조하는 spec hash가 Run Environment Lock에서 빠지면:

```text
RUN_ENVIRONMENT_SPEC_PARITY_FAIL
→ RELEASE/RUN BLOCK
```

`hashCanonicalizationSpecHash`, `retryCoordinateSchemaHash`, `checkpointSchemaHash`, `solverVerificationProfileHash`, `stageApplicabilitySpecHash`, `publishCasSpecHash`, `auditChainValidationSpecHash`, `difficultyAxisDerivationHash`, `judgePoolPolicyHash`, `retryEscalationProfileHash`, `workflowActionRegistryHash`, `gateInstanceSchemaHash`, `approvalReducerSpecHash`, `examStageRegistryHash`, `reopenTargetPolicyHash`, `reopenImpactMetricHash`, `planPoolPolicyHash`, `candidatePlanProvenanceSpecHash`, `choiceShufflePolicyHash`, `sourceBaselineSpecHash`, `curriculumContractSpecHash`, `rootCauseResolverHash`, `scopeContextResolverHash`, `publishRollbackSpecHash`, `noveltyBaselinePolicyHash`, `milestoneCapabilityProfileHash`, `preRunValidationSpecHash`는 필수 required field다.

---

# 71. Stale Advisory Enum

```text
RULEBOOK_SUPERSEDED
POLICY_BUNDLE_SUPERSEDED
SCHEMA_SUPERSEDED
MODEL_ROUTE_SUPERSEDED
THRESHOLD_SUPERSEDED
CURRICULUM_MASTER_SUPERSEDED
SEMANTIC_PARSER_SUPERSEDED
EXACT_ENGINE_SUPERSEDED
ARCHIVE_INDEX_SUPERSEDED
TRANSFORM_REGISTRY_SUPERSEDED
FAILURE_POLICY_SUPERSEDED
SOLVER_ROUTING_SUPERSEDED
CAPABILITY_MANIFEST_SUPERSEDED
SEED_POLICY_SUPERSEDED
CONTENT_RETRY_POLICY_SUPERSEDED
PUBLICATION_POLICY_SUPERSEDED
DIFFICULTY_AXIS_DERIVATION_SUPERSEDED
DIFFICULTY_ROLE_DERIVATION_SUPERSEDED
REPRESENTATION_LEVEL_REGISTRY_SUPERSEDED
CONTRACT_REGISTRY_SUPERSEDED
STAGE_APPLICABILITY_SUPERSEDED
CHECKPOINT_SCHEMA_SUPERSEDED
AUDIT_VALIDATION_SUPERSEDED
HASH_CANONICALIZATION_SUPERSEDED
JUDGE_POOL_POLICY_SUPERSEDED
RETRY_ESCALATION_PROFILE_SUPERSEDED
WORKFLOW_ACTION_REGISTRY_SUPERSEDED
GATE_INSTANCE_SCHEMA_SUPERSEDED
APPROVAL_REDUCER_SUPERSEDED
EXAM_STAGE_REGISTRY_SUPERSEDED
REOPEN_TARGET_POLICY_SUPERSEDED
PLAN_POOL_POLICY_SUPERSEDED
PUBLISH_ROLLBACK_POLICY_SUPERSEDED
NOVELTY_BASELINE_POLICY_SUPERSEDED
MILESTONE_CAPABILITY_PROFILE_SUPERSEDED
PRE_RUN_VALIDATION_SUPERSEDED
SOURCE_BASELINE_SPEC_SUPERSEDED
CURRICULUM_CONTRACT_SUPERSEDED
CANDIDATE_PLAN_PROVENANCE_SUPERSEDED
ROOT_CAUSE_RESOLVER_SUPERSEDED
CHOICE_SHUFFLE_POLICY_SUPERSEDED
REOPEN_IMPACT_METRIC_SUPERSEDED
POLICY_SCOPE_RESOLVER_SUPERSEDED
```

Advisory는 sealed artifact의 finalStatus를 바꾸지 않는다.

---

# 72. Human Review Queue / Audit / Question Review Report

## Human 권한

Human may:

```text
repair source
classify root cause
change approved input
approve retry
abort run
```

Human may NOT:

```text
FAIL → PASS override
evidence fabricate
proof obligation bypass
failed candidate seal
```

Resume 후 실패 Gate부터 재실행한다.

## Human Review Queue Contract

`human-review-queue.schema.json`:

```json
{
  "reviewId": "",
  "reviewScope": "QUESTION",
  "runId": "",
  "questionId": "",
  "candidateId": null,
  "reasonCodes": [],
  "requiredAction": "",
  "resumeCheckpointId": null,
  "failedStageId": "",
  "inputHashes": [],
  "beforeArtifactHashes": [],
  "afterArtifactHashes": [],
  "humanInterventionId": null,
  "status": "OPEN",
  "decision": null
}
```

`reviewScope` enum:

```text
CANDIDATE | QUESTION | RUN
```

conditional schema:

```text
CANDIDATE → questionId + candidateId REQUIRED
QUESTION  → questionId REQUIRED, candidateId null
RUN       → questionId/candidateId null
```

Run-level Failure/Human Review를 빈 `questionId=""`에 억지로 넣는 것을 금지한다.

status:

```text
OPEN | RESOLVED | ABORTED
```

decision:

```text
APPROVE_RETRY
REJECT_QUESTION
FIX_SOURCE_AND_RESTART
START_SUCCESSOR_RUN
ABORT_RUN
```

conditional:

```text
APPROVE_RETRY / FIX_SOURCE_AND_RESTART
→ same-run resume인 경우 resumeCheckpointId REQUIRED

START_SUCCESSOR_RUN
→ reviewScope=RUN REQUIRED
→ resumeCheckpointId MUST be null
→ predecessor sealed artifact hash를 successor run provenance에 전달

ABORT_RUN
→ resumeCheckpointId optional/null
```

`APPROVE_RETRY`는 PASS override가 아니라 지정 checkpoint/stage 재실행 승인이다. `START_SUCCESSOR_RUN`도 기존 SEALED artifact의 Hard Gate를 override하지 않는다.

## Event-Sourced Audit Log

각 run은:

```text
../AI_CENTER/ROUNDS/alive/{runId}/run-events.ndjson
```

을 append-only로 기록한다.

필수 event:

```text
RUN_STARTED
ENVIRONMENT_LOCKED
QUESTION_STARTED
STAGE_STARTED
STAGE_PASSED
STAGE_FAILED
INFRA_RETRY
CONTENT_RETRY
HUMAN_REVIEW_OPENED
HUMAN_REVIEW_RESOLVED
CANDIDATE_SELECTED
QUESTION_LOCALLY_FROZEN
QUESTION_REOPENED
QUESTION_SEALED
EXAM_SEALED
PUBLISH_STARTED
PUBLISH_FAILED
EXAM_PUBLISHED
```

각 event는 `eventSeq`, `previousEventHash`, `eventContentHash`를 가져 tamper-evident chain을 만든다. 과거 event 수정/삭제 금지. 이 체인은 §63 `Audit Chain Integrity Gate`에서 SEALED 전에 실제 재계산 검증되며, 단순 사후 참고 로그로만 남겨두지 않는다.

## 문항별 Review Report Contract

`qNN/review.md`에는 최소 다음을 포함한다.

```text
Source UID / source question number
MODE / followupKind
selected TransformOps
attempt/retry/reopen counts
Candidate A/B/C summary
Anti-Clone metrics
DifficultyVector + difficultyRole + G09 delta
Shortcut result
Independent Solver result
Claim-level Exact coverage
Proof Obligation summary
Curriculum Problem/Solution result
Fidelity result
Distractor result
Visual result
Archive/Batch Duplicate result
Final Judge ranking + selected candidate
FinalStatus / WorkflowState / PublicationStatus
blocking/failure/advisory codes
freezeHash / runEnvironmentHash
Human Review references if any
humanInterventionManifestHash
auditChainHeadHashAtFreeze
```

장문 chain-of-thought는 포함하지 않는다.

---

# 73. Regression / Mutation / Drift Release Gate

## Data Set Separation

```text
Calibration Set     = threshold/heuristic 조정용
Holdout Set         = 조정 금지, 독립 회귀평가
Adversarial Set     = 의도적 오류/clone/domain/shortcut/schema/timeout 주입
SemanticPairSet     = semantic parser 의미 동치/비동치
SourceIngestionPairSet = Parser A/B 공통오류 공격
```

## Mutation Testing

예:

```text
unique-answer check disable
< → <= mutation
clone gate disable
semantic diff disable
curriculum gate disable
evidence minItems 제거
required gate optional화
source blinding allowlist 확대
```

Mutation survivor > 0 → Release Block.

## Drift Trigger

다음 중 하나가 바뀌면 전체 release regression을 실행한다.

```text
policy bundle
model route / model config
prompt compiler
schema set
TransformOp / handler / contract
compatibility matrix
threshold config
rubric anchors
exact/fuzz engine
semantic parser / realizer
curriculum master
archive index config
FailurePolicyRegistry
SolverRoutingRegistry / verification profile
RootCauseResolverRegistry
Policy Context Scope Resolver
Candidate Plan Provenance / Judge distinct-plan policy
Choice Shuffle Policy
Reopen Impact Metric
Source Baseline Spec
Curriculum Contract Spec
CapabilityManifest
SeedPolicy
ContentRetryPolicy / RetryCoordinate schema
PublicationPolicy / CAS spec
Contract Registry / Coverage / Bootstrap / Migration
StageRegistry / DAG / Applicability DSL
Checkpoint schema
Audit chain validation spec
DifficultyAxisDerivation / DifficultyRoleDerivation / RepresentationLevelRegistry
Judge pool policy
hash canonicalization
```

## Release Block

```text
known math escape > 0
known semantic false accept > 0
known curriculum escape > 0
known clone escape > 0
known source-ingestion false accept > 0
mutation survivor > 0
required Gate regression > 0
contract regression > 0
archive recall < configured minimum
```

품질 기준을 낮춰 통과시키는 fallback은 금지한다.

---

# 74. Question / Exam / Publish Completion Conditions

## LOCALLY_FROZEN

```text
Source Ingestion PASS
Curriculum Contract LOCK PASS
Source Admissibility PASS
Source Solver/Min-Solution/Difficulty Baseline PASS
ProblemIR/SolutionIR schema valid
Plan Contract PASS
Plan Diversity PASS
Candidate Plan Provenance PASS
Builder Local Exact PASS
Parameter Robustness PASS
Problem Semantic Round-Trip PASS
Solution Semantic Round-Trip PASS
Solution/Answer Parity PASS
Language Integrity PASS
IR Clone PASS
Final Text Clone PASS
Difficulty/G09 PASS
Shortcut PASS by manifest
Independent Solver PASS
Final Claim Coverage complete
Proof Obligations complete
Curriculum Problem PASS
Curriculum Solution PASS
Fidelity PASS
Distractor PASS/N_A by manifest
Visual PASS/N_A by manifest
Archive Duplicate PASS
Judge SELECT
Validator Evidence complete
Freeze Provenance complete
finalStatus = PASS
```

**selected Candidate 또는 Question/Run required scope**에 HOLD/BLOCKED/UNVERIFIED가 하나라도 있으면 LOCALLY_FROZEN 금지. 이미 REJECT/EXCLUDE된 비선택 Candidate의 scoped failure는 survivor evidence로 보존하되 Question finalStatus를 오염시키지 않는다.

## SEALED

```text
expectedQuestionCount 전부 LOCALLY_FROZEN
Exam predicates PASS
Exam Reopen Budget 미초과
Audit Chain Integrity PASS (pre-seal head)
Archive Serializer Round-Trip PASS
JS schema PASS
node --check PASS
engine load smoke PASS
asset refs PASS
Package Round-Trip PASS
Freeze hash chain PASS
Exam Final Approval Reducer PASS
```

## PUBLISHED

```text
WorkflowState = SEALED
AND content finalStatus = PASS
AND latest archive CAS/recheck PASS
AND production staging PASS
AND atomic content/index publish PASS
AND post-publish smoke PASS
AND publish manifest PASS
→ publicationStatus = PUBLISHED
```

Publish 실패/충돌은 `publicationStatus`만 `PUBLISH_FAILED/PUBLISH_CONFLICT`로 바꾸며 SEALED 콘텐츠의 `finalStatus=PASS`를 변경하지 않는다.

---

# 75. Implementation Milestone Scope

문서 버전과 구현 milestone을 구분한다.

## Engine V0.1

지원 family:

```text
POLYNOMIAL_ALGEBRA
EQUATION_INEQUALITY
FUNCTION_ALGEBRA_NONVISUAL
```

조건:

```text
visualDependency = NONE
ProblemIR/SolutionIR parser 지원
family Transform handlers 지원
required EXACT/HYBRID claim coverage 가능
archive serializer round-trip 가능
Archive Duplicate/Recall = FULL_REQUIRED
```

`milestone-capability-profile.json` V0.1:

```text
supportedModes = [EXAM_FOLLOWUP, STRICT_VARIANT]
supportedFollowupKinds.EXAM_FOLLOWUP = [CONFIRMATION]
ADVANCED = UNSUPPORTED
supportsVisual = false
archiveDuplicateMode = FULL_REQUIRED
```

V0.1 ADVANCED 입력은 `CAPABILITY_PRECHECK_FAIL`; 조용한 downgrade 금지.

Golden Loop:

```text
1문항 full transaction PASS
→ Golden 5문항 strict sequential
→ Mini Exam Integration
→ SEALED package smoke
```

Golden 5 PASS 전 24문항 production 확장 금지.

## Engine V0.2+

`C-VISUAL-001`은 Engine V0.2 production 시작 전에 `PLANNED_V0.2 → ACTIVE` 승격되어야 하며 Visual schema/renderer/evidence/validator contract가 없는 상태로 visual production을 시작할 수 없다.


추가 후보:

```text
SEQUENCE
FINITE_COMBINATORICS_PROBABILITY
COORDINATE_GEOMETRY
GEOMETRY/visualSpec
deterministic SVG/PNG
Visual Validator
ADVANCED production
```

새 family는 IR expressiveness, exact/hybrid coverage, Transform handler, adversarial regression이 모두 준비되기 전 requiredGate를 optional로 낮춰 억지 지원하지 않는다.

## Pre-run Validation Code Mapping

`pre-run-validation.schema.json`의 PRE_RUN_ONLY code:

```text
MODE_UNRESOLVED
MODE_CONFLICT
INPUT_REQUIRED
VISUAL_ASSET_REQUIRED
```

이들은 Qn FailurePolicy retry graph로 보내지 않는다. 필요한 입력/capability가 해결되기 전 Run 시작 금지. `preRunValidationSpecHash`를 bootstrap/environment provenance에 포함한다.

---

# 76. Implementation Phase — 최종 의존 순서

## Phase 0 Contract Freeze
- all schemas
- enums
- StageRegistry
- RequiredGate generation
- State Transition
- FailurePolicyRegistry
- Policy Context Scope Resolver
- RootCauseResolverRegistry
- Retry Escalation Profiles
- WorkflowActionRegistry
- Gate Instance Schema
- Approval Reducer
- Exam Stage Registry / ReopenTargetPolicy
- ReopenImpactMetric
- Plan Pool Policy
- Candidate Plan Provenance Policy
- Choice Shuffle Policy
- Publish Rollback Policy
- AdvisoryRegistry
- Contract DSL
- Transform Registry
- Compatibility promotion
- Clone metrics/thresholds
- Difficulty rules
- Hash canonicalization
- DAG
- Budget
- Reproducibility
- Policy Bundle

## Phase A Runtime Core
- manifest
- environment lock
- state
- budget
- seed
- event log
- retry
- idempotency
- checkpoint
- fsync atomic write

## Phase B IR/Canonicalization
- ProblemIR
- SolutionIR
- SolutionGraph
- DifficultyVector
- InterpretationDependencyGraph / RepresentationLevel
- CandidateRuntime
- canonical hash

## Phase C Deterministic Math Kernel
- worker/IPC
- exact
- parameter search
- fuzz/shortcut
- resource guard

## Phase D Source Ingestion
- Parser A
- Verifier B
- ingestion fidelity
- Curriculum Contract build/lock
- admissibility
- Source independent solver/exact baseline
- Source min-solution baseline
- Source difficulty baseline
- fingerprint
- Capability preflight
- gate manifest

## Phase E Transform/Plan
- DSL
- handlers
- contracts
- compatibility
- plan diversity
- critic

## Phase F Builder
- ProblemIR
- SolutionIR
- robustness
- distractor
- visual

## Phase G Serialization
- Problem/Solution Realizer
- Semantic parser
- Round-Trip
- Language Integrity

## Phase H Quality Proof Gates
- clone
- difficulty
- shortcut
- proof
- curriculum
- fidelity
- archive duplicate

## Phase I Independent AI
- SolverRoutingRegistry
- I2/I3 proof profiles
- solver
- judge

## Phase J Freeze
- evidence
- provenance
- locally frozen

## Phase K Exam/Package
- integration
- serializer/parser
- node --check
- engine smoke
- package round-trip
- seal

## Phase L Publish
- PublicationStatus/PublicationPolicy
- CAS
- latest duplicate
- index transaction
- publish smoke

## Phase M Regression/Release
- calibration
- holdout
- adversarial
- mutation
- drift gate

---

# 77. Contract Freeze PASS Checklist

Phase 0을 PASS하려면 문서가 아니라 **실제 정본 artifact가 존재하고 Cross-Version Contract Diff Gate까지 PASS**해야 한다.

필수:

```text
all JSON Schemas
Contract Coverage Matrix + canonical `*.contract.json`
Bootstrap Baseline + baseline diff result
Contract semantic hash/migration records
bootstrap/current ACTIVE/migration count parity PASS
Policy Bundle Manifest
MODE/STRICT_VARIANT Spec
Canonical QuestionType Enum
Source Blinding Access Matrix + role input schemas
Source Baseline Spec + Evidence Schema + Source failure mappings
Curriculum Contract Schema + Early Lock Spec + Curriculum failure mapping
StageRegistry
RequiredGate generator
State Transition table
Cross-Invariant table
PublicationStatus + PublicationPolicyRegistry
FailurePolicyRegistry complete
AdvisoryCodeRegistry complete
SolverRoutingRegistry
CapabilityManifest + CandidateRuntime Schema
Deterministic Seed Policy
Content Retry Level Policy
Generic Stage Attempt / Retry Coordinate Policy
Human Review Queue Contract
Append-only Audit Event Contract
Question Review Report Contract
Transform Registry
Transform Contract DSL
Transform Formal Contracts
Compatibility Matrix
Constructive Builder Spec
Parameter Robustness Spec
Problem/Solution Realizer Spec
Clone Metric Spec
Clone Threshold Config
Archive Duplicate Profiles + Recall Spec
Difficulty/G09 Spec + DifficultyAxisDerivation Registry + InterpretationDependencyGraph + RepresentationLevel Registry
Judge Candidate Pool Policy
Run Environment Spec Hash Coverage/Parity Spec
Shortcut/Complexity Guard Spec + Curriculum-constrained shortcut policy
Proof Obligation Spec
Curriculum Problem/Solution Spec
Fidelity Spec
Distractor Spec
Language Integrity Spec
Validator Evidence Spec
I2/I3 Solver Isolation Spec
Hash Canonicalization Spec
DAG Spec + convergence budget
Budget Config
Prompt/Context/Truncation Spec
IPC/Worker Contract
Replay Contract
Freeze Provenance Schema
Exam Reopen Budget Config
Rubric Profiles + Anchors
Archive Serialization Contract + Serialization Sidecar Schema
SEALED Gate Manifest
Retry Escalation Profile Registry
WorkflowAction Registry
RootCauseResolver Registry
Policy Context Scope Resolver
Gate Instance Result Schema
Approval Reducer Spec
Exam Stage Registry + ReopenTargetPolicy
ReopenImpactMetric
Plan Pool Policy
Candidate Plan Provenance Spec
Choice Shuffle Policy
Publish Rollback Ownership Spec
Novelty Baseline Policy
Milestone Capability Profile
Pre-run Validation Spec
Publish Transaction Contract
Atomic CAS/Publish Lock Contract
Checkpoint / Resume Contract
Stage Applicability Predicate DSL
Failure Scope / Retry Escalation Spec
Audit Chain Validation Spec
Human Intervention Provenance Spec
Regression/Mutation/Drift Release Spec
```

또한:

```text
actual bootstrap entry count == bootstrapActiveCount
currentActiveCount == bootstrapActiveCount + approved ADD migrations - approved REMOVE migrations
actual current ACTIVE entry count == currentActiveCount
missing ACTIVE contract IDs == 0
missing canonical contract artifacts == 0
unapproved semanticHash changes == 0
contractBaselineHash / contractRegistryHash / contractCoverageHash 모두 존재
```

하나라도 아니면:

```text
CONTRACT_FREEZE_FAIL
```

**v0.11 계획서 자체가 완성되어도 위 artifact가 실제 생성·schema validate·cross-diff되기 전에는 구현 Phase A에 들어가지 않는다.**

---

# 78. 최종 정의

> **ALIVE Quality Proof Loop Engine v0.11은 검증된 기출을 Canonical ProblemIR/SolutionIR로 독립 해석하고, Source Blinding·허용 TransformOp·Formal Contract 아래에서만 문항을 조립하며, 최종 학생용 문제·해설을 독립 Parser/Solver·Exact/Fuzz·Proof Obligation·Curriculum/Fidelity/Clone Gate로 다시 공격하고, Evidence·Provenance·Contract Coverage가 모두 완전한 문항만 LOCALLY_FROZEN한 뒤 Exam Integration·Archive Round-Trip·Hash Chain·CAS 기반 Atomic Publish까지 통과한 경우에만 SEALED/PUBLISHED하는 regression-closed fail-closed 생산 시스템이다.**

> **v0.7부터 도입된 원칙에 따라 canonical Contract artifact 또는 이전 승인 ACTIVE Contract의 누락 자체도 Release Block이며, v0.8/v0.9/v0.10/v0.11 신규 Contract도 동일 규칙을 적용한다.**
