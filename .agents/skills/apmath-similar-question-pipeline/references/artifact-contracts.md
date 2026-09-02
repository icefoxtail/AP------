# Run artifact contracts

## Runtime root

```text
alive/runtime/runs/{runId}/
```

Each Run owns its directory. The CLI writes `manifest.json` atomically. Agents write only their assigned files through `submit`; accepted artifacts are immutable.

## Required Run layout

```text
manifest.json
source/
plans/
candidates/
evidence/
render/
final/
```

## State meanings

- `BLOCKED`: required input is missing or source resolution is ambiguous.
- `READY_FOR_ORCHESTRATION`: source is locked and Agent stages may start.
- `ACTIVE`: at least one implemented orchestration stage is running.
- `PHASE2_COMPLETE`: `R03`–`R12` passed and one candidate was selected; serialization/render are still pending.
- `LOCALLY_FROZEN`: all required generation, proof, serialization, and real-render Gates passed.
- `FAILED`: a confirmed terminal error exhausted its retry policy.

`READY_FOR_ORCHESTRATION` is not content PASS.

## Source lock

A valid source lock contains repository-relative path, SHA-256, byte size, optional question ordinal/qKey, and resolution evidence. Agents must read the locked path and verify its current hash before using it.

## Write ownership

- Source analysts: `source/analysis-*.json`
- Plan designers and critic: `plans/`
- Candidate builders: `candidates/{candidateId}/draft/`
- Validators: `candidates/{candidateId}/evidence/`
- Render reviewer: `render/`
- Main orchestrator only: `final/` and terminal manifest state

Production `archive/exams/similar/`, indexes, or assets are outside the Run and require explicit publication authorization.

## Phase 2 common envelope

Every submitted artifact has `schemaVersion: "0.2.0"`, its canonical uppercase `artifactType`, a unique `artifactId`, the packet's exact `producerId`, and the locked `sourceLockSha256`. Source/plan lanes must match the packet slot. The task packet is the authority for allowed input references, forbidden inputs, output path, and producer identity.

Agent task lifecycle is durable: `PENDING -> DISPATCHED -> SUBMITTED`. `DISPATCHED` records the external agent id, route, start time, and attempt before another spawn is requested. A failed dispatch records its code and attempt history before returning to the bounded `PENDING` retry queue. Only `PENDING` may appear as new agent work; `DISPATCHED` is wait/poll work and `SUBMITTED` is never dispatched again. External capacity errors do not change a Run to `BLOCKED` or `FAILED`.

R03 task packets also own a canonical `sourceQuestionId`. Both independent source-analysis artifacts must copy that exact packet field. The submit boundary rejects missing or altered packet-owned identifiers before schema validation and before reducer execution.

Validated Phase 2 types are `SOURCE_ANALYSIS`, `CURRICULUM_FINGERPRINT`, `TRANSFORMATION_PLAN`, `PLAN_CRITIC`, `CANDIDATE_DRAFT`, `LOCAL_CHECK`, `MATH_EVIDENCE`, `FIDELITY_EVIDENCE`, `VISUAL_EVIDENCE`, and `CANDIDATE_JUDGE_INPUT`. The executable single source of truth for required fields is `alive/engine/phase2_artifacts.py`; this reference describes ownership and state semantics and must not duplicate that validator field-by-field.

Math evidence must be blinded and disclose only student-facing fields. Each candidate needs two distinct verifier producers, matching independently derived answers, and agreement with the candidate Answer Contract. An MCQ cannot pass `R11` without a PASS distractor dimension. The final reducer requires at least two distinct candidates from at least two distinct plans to survive all Gates.

## Phase 3 artifacts

`R13` writes canonical adapter context, structured question, adapter report, and validation sidecar under `final/`. The adapter rejects noncanonical unit/subunit tuples, labeled MCQ choices, non-1-based choice answers, and duplicated `객관식` tags.

`R14` writes `final/staging/generated-question.js`, a serializer report, and a review-only shadow at `archive/_generated/alive-runs/{runId}/candidate.js`. Serializer PASS requires a semantic parser round-trip and excludes internal validation fields from the Archive payload.

`R15` accepts evidence only when an actual browser used the production Archive engine and `exam`, `solution`, and `answer` each report render-ready, no render error, zero unrendered math, zero checked overflow, full last-question coverage, and no broken images. Accepted evidence is copied to `render/render-evidence.json`.

`R16` creates `final/alive-evidence-pack.zip` and verifies its exact member list and CRC round-trip. `R17` may set `LOCALLY_FROZEN` only after every stage through R16 passed. Publication remains a separate, user-authorized operation.

The R13 adapter supports `MCQ -> 객관식`, `SHORT_ANSWER -> 주관식`, and `CONSTRUCTED_RESPONSE -> 서술형`. Non-MCQ output must have empty choices, a supported `answerType`, a nonempty canonical answer, an explicit equivalence policy, and no MCQ distractor validator. A source question-type lock in adapter context prevents silently converting a constructed response to MCQ.

The Phase 4B deterministic SVG renderer consumes Visual Spec v0.1 and supports coordinate planes, simple function graphs, segment geometry, polygons, circles, and tables. Its report proves deterministic byte reproduction and asset/spec hashes. R10 independently verifies mathematics, topology, semantic ownership, crop, labels, answer leakage, and determinism. R13 copies the hash-locked asset, R14 assigns a review-only Archive path, and R16 packages it. Visual PASS still requires R15 actual-browser image decoding.

## Phase 4A whole-exam parent

An Exam Batch Run has `artifactType: ALIVE_EXAM_BATCH_RUN` and owns `source/source-exam.json`, `source/preflight-report.json`, a child-Run map, `final/structured-exam.json`, `final/staging/generated-exam.js`, `final/assembly-report.json`, whole-exam render evidence, and `final/alive-whole-exam-pack.zip`.

`E01` PASS requires a nonempty exam, contiguous source IDs, a complete-or-absent score contract, and every question to fit the active MCQ/short-answer/constructed-response adapter. ESSENTIAL source visuals lock the child to ESSENTIAL visual production; solution-only visuals are OPTIONAL. Common-material ambiguity, labeled choices, unsupported question types, and partial score metadata remain fail-closed. A failed preflight creates zero children.

`E02` accepts a child only when its source path/hash/ordinal and generation profile match the parent, its source-question hash matches preflight, its validation sidecar is PASS, its evidence ZIP hash and CRC verify, and its publication status is `NOT_PUBLISHED`. `E03` requires all expected ordinals, rewrites child-local ID 1 to the exam ordinal, restores each source score annotation, copies and rehashes visual assets, checks the total score, rejects duplicate generated questions, and performs a strict JS semantic round-trip. `E04` requires actual production-engine browser PASS for exam, solution, and answer, exact last-question coverage, explicit last-page checks, and no broken images. `E06 LOCALLY_FROZEN` still does not authorize Archive publication.

E02 retryable child failure recovery is immutable and bounded to one fresh Run. The parent keeps the failed attempt in `attempts`, updates the active child pointer to `-recovery-01`, and records `rootRunId`, `predecessorRunId`, `recoveryAttempt`, and `recoveryReasonCode`. A second failure closes the parent with `CHILD_RECOVERY_EXHAUSTED`; source-lock, source-question-hash, profile, lineage, and package integrity failures close it without retry. `exam-status` is a read-only reconstruction of the next action queue and must never redispatch a `SUBMITTED` packet.
