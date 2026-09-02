# FAST_EXAM workflow

## Purpose and budget

`FAST_EXAM` is the default whole-exam production path. It replaces the legacy per-question proof tree with a two-pass question loop while retaining source locking, independent solving, deterministic validation, whole-exam real rendering, and non-publication.

Baseline model work is exactly two calls per source question:

1. `QUESTION_BUILDER`: analyze the source student payload and produce one complete similar question.
2. `BLINDED_VERIFIER`: independently solve and review the generated student-facing question without seeing the builder answer, solution, notes, or prior reviews.

For 22 questions the baseline is 44 calls, not the legacy 462–616-call envelope. Retries and exceptional reviews are bounded and recorded separately.

## Variation profiles

FAST_EXAM keeps two explicit whole-exam profiles. The default is `STRUCTURAL_VARIANT`, which preserves the source response form and intended difficulty band but requires at least one genuine non-numeric change to the condition, target, relation, representation, or case structure. `CONFIRMATION` is an intentionally limited numeric/surface confirmation profile for cases where number reseeding is the requested outcome. It does not relax answer verification or distractor requirements.

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py fast-exam-start --query "25년 매산고 고2 2학기 기말 수학II 전체 유사" --variation-mode STRUCTURAL_VARIANT --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py fast-exam-start --query "25년 매산고 고2 2학기 기말 수학II 수치 확인형" --variation-mode CONFIRMATION --json
```

Every MCQ draft must include `transformationPlan.distractorProvenance`, with one 1-based `choiceIndex`, one `errorFamily`, and a concrete `errorRoute` for each non-key choice. The allowed families are `OMISSION`, `SIGN`, `COEFFICIENT`, `EXPONENT`, `BOUNDARY`, `ORDER_OF_OPERATIONS`, `ALGEBRAIC_MANIPULATION`, `CONDITION_INTERPRETATION`, `SUBSTITUTION`, `ARITHMETIC`, `REPRESENTATION_INTERPRETATION`, and `OTHER`; a question may not reuse a family for two distractors. The route must identify the mistaken operation or interpretation and an intermediate/result, so generic or arbitrary nearby-number routes are rejected. A structural draft must also include `transformationPlan.structuralDelta`; the deterministic inbox validator rejects missing/invalid distractor evidence, missing/non-numeric delta, and a visible number-only clone before blinded review.

## CLI milestone commands

Run from the repository root. A query is accepted only when it resolves to one exam source; ambiguous queries return candidates without creating a Run.

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py fast-exam-start --query "25년 금당고 고1 2학기 중간고사 전체 유사" --variation-mode STRUCTURAL_VARIANT --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py fast-exam-status --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py fast-exam-prepare --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py fast-reconcile --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py fast-exam-assemble --run <run-id> --title "생성 시험지" --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py fast-exam-record-render --run <run-id> --file <render-evidence.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py fast-exam-package --run <run-id> --json
```

`fast-dispatch-start`, `fast-dispatch-fail`, and `fast-submit` are orchestration/agent boundary commands. The checked-in MVP also owns assembly, serializer round-trip, render-evidence acceptance, and local packaging.

## Capability gate

Fast execution is available only when all of these are implemented and reported active by the CLI:

- fast parent manifest and source-exam preflight
- builder and verifier packet schemas
- inbox submission and atomic acceptance
- deterministic answer/review reducer
- bounded regeneration
- whole-exam assembly and serializer round-trip
- exam/solution/answer production-render evidence
- local evidence package and resume tests

The first active capability profile is `NONVISUAL_WHOLE_EXAM`. A source exam with any visual dependency is held at `F01_PREFLIGHT` with `FAST_VISUAL_NOT_SUPPORTED`; it must not consume model calls in the fast lane. If a capability is inactive, return `FAST_ENGINE_NOT_IMPLEMENTED` or the concrete capability failure. Do not fall back to the strict child-Run controller without explicit user approval.

## Parent-only state machine

Do not create a complete `R03`–`R17` child Run for every question.

```text
GENERATING -> REVIEWING -> ASSEMBLING -> RENDERING -> AUTO_READY
      ^             |                         |
      |             +---- FAILED <-------------+
      +------ bounded regeneration
```

Each question advances independently:

```text
PENDING -> GENERATED -> READY
                  |
                  +-> RECHECKING -> READY
                              |
                              +-> REGENERATING -> GENERATED
                                              |
                                              +-> FAILED (one regeneration maximum)
```

Only one automatic regeneration cycle is allowed per question. If the regenerated question still fails, retain all evidence, mark the question and parent `FAILED`, and report the exact Gate. Never loop indefinitely.

## Question builder contract

The builder receives only the locked source student payload, source metadata required for curriculum/response-form fidelity, the requested generation profile, and relevant canonical rules. In one artifact it returns:

- concise source concept/fingerprint analysis
- one transformation plan
- one complete student-facing question
- choices without rendered labels when MCQ
- Answer Contract and canonical answer
- complete solution
- curriculum and difficulty claims
- anti-clone comparison
- deterministic Visual Spec when an essential visual is required

The packet's generation profile is authoritative. In `STRUCTURAL_VARIANT`, the builder must state a non-numeric `structuralDelta`; in both profiles, an MCQ must provide distinct-family, concrete distractor provenance at generation time. If a plausible distractor cannot be tied to a specific error family and result, regenerate the candidate instead of fabricating an explanation after the fact.

The builder produces one candidate, not A/B/C candidates.

For MCQs, the builder must also perform a blinded-viewpoint distractor audit before submission. Each non-key choice should follow one salient, single-step misconception that can be reconstructed from the student-facing stem and choices alone, and its value must be the exact result of that route. Endpoint collapse, post-solution squaring, unexplained scaling, or arbitrary nearby values are not acceptable unless the visible wording makes the mistake identifiable. If a choice cannot be defended in one concise mathematical sentence from the visible payload, redesign the choice set before emitting the artifact.

## Blinded verifier contract

The verifier receives the locked source student payload and generated student-facing payload. It must not receive the builder Answer Contract, answer, solution, analysis, plan, private notes, or earlier verifier output.

It returns an independently derived answer and PASS/FAIL findings for:

- mathematical correctness and uniqueness
- curriculum fit
- source fidelity and intended difficulty band
- anti-clone distance
- ambiguity and response-form correctness
- distractor quality for MCQ
- visual semantics when applicable

The deterministic reducer compares the verifier-derived answer with the hidden builder Answer Contract after submission. A disagreement cannot be waived by the orchestrator.

## Deterministic checks

Use code rather than another model call for schema validity, required fields, source/hash identity, choice-label ownership, duplicate choices, answer index bounds, metadata keys, question numbering, score totals, exact duplicate detection, variation-profile consistency, structural-delta presence, numeric/surface-clone precheck, distractor-provenance coverage, serializer round-trip, asset hashes, package members, and render-evidence completeness.

## Exception lane

Set `manualAuditRecommended=true` for essential visuals, constructed responses, highest-difficulty questions, borderline curriculum claims, or any repaired question. This flag does not block `AUTO_READY` when the ordinary fast Gates pass.

Automatically invoke one additional blinded Luna verifier only for answer disagreement, ambiguity, duplicate/invalid distractors, strong clone suspicion, or visual-semantic disagreement. If that evidence does not resolve the Gate under the deterministic policy, regenerate once; if the next pass fails, stop the Run. Terra and Sol are never automatic recovery routes.

## Durable layout

```text
alive/runtime/fast-runs/{runId}/
  manifest.json
  source/
    source-exam.json
    preflight-report.json
    student/
      q001.json
  questions/
    q001/
      attempt-00/
        student.json
        draft.json
        review.json
        review-recheck.json
        final.json
      attempt-01/
        student.json
        draft.json
        review.json
        final.json
  inbox/
    q001-draft-a00.json
    q001-review-a00.json
  tasks/
    q001-a00-builder.json
    q001-a00-verifier.json
  final/
    structured-exam.json
    staging/
      generated-exam.js
    review-report.json
    assembly-report.json
    package-report.json
    alive-fast-exam-pack.zip
  render/
    render-evidence.json
    render-report.json
```

Agents use `.codex/agents/alive-fast-question-builder.toml` and `.codex/agents/alive-fast-blinded-verifier.toml` and write only to unique `inbox/` paths. The CLI validates an inbox artifact and atomically freezes it into the question directory. An agent never writes directly to an immutable accepted path, and `submit` never requires moving an already accepted artifact out of the way.

## Dispatch and resume

Dispatch at most four tasks concurrently. Persist `PENDING -> DISPATCHED` with the external task id before filling another slot. Only `PENDING` may be newly spawned. `DISPATCHED` is wait/reconcile work; `ACCEPTED` is immutable.

After interruption or a capacity error:

1. Reload the parent manifest and every question state.
2. Check inbox and accepted artifact paths.
3. Accept valid completed artifacts even if the original agent call was lost.
4. Poll known dispatched task ids.
5. A failed primary review schedules one independent `recheck`; a failed recheck schedules at most one new builder attempt.
6. Dispatch only remaining `PENDING` tasks. Accepted artifacts remain immutable and are never regenerated in place.

Do not ask the user to say “continue” while runnable work remains in an authorized whole-exam request.

## Assembly and completion

Assemble only when every question is `READY`. Perform one whole-exam serializer round-trip and one production-engine browser pass covering `exam`, `solution`, and `answer`, including the last question/page, MathJax, overflow, and image decoding. Do not run per-question browser/package stages.

`AUTO_READY` requires the generated JS, structured exam, review report, render evidence, and verified local ZIP. The package also retains per-attempt artifacts and is written below the fast Run. The Archive review shadow is written under `archive/_generated/alive-fast-exam-runs/` but is never registered. `AUTO_READY` never means production Archive publication.

## Strict audit after fast production

An explicit strict audit reads the frozen fast output and targets either selected/high-risk questions or the whole exam as requested. Save audit evidence separately. A defect creates a fresh question revision, reruns its fast blinded verification, then reassembles and rerenders the whole exam. Never mutate accepted evidence in place.
