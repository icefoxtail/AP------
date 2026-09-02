---
name: apmath-similar-question-pipeline-adaptive
description: Run an isolated experimental A/B variant of the APMath whole-exam similar-question pipeline with Luna xhigh fixed throughout, including curriculum-method locking and bounded correction loops; use only when an explicit adaptive comparison is requested.
---

# APMath ALIVE Adaptive Comparison (V2)

This is a canary variant of [the baseline skill](../apmath-similar-question-pipeline/SKILL.md).
Use it only for an explicit comparison run. The baseline skill, its files, and
its runtime are the control group and must not be changed.

Before operating, read the baseline skill and its staged-exam references. Then
read [adaptive-workflow.md](references/adaptive-workflow.md),
[method-lock-and-correction-loop.md](references/method-lock-and-correction-loop.md),
and, when two Runs are available,
[comparison-protocol.md](references/comparison-protocol.md).

## Fixed constraints

- Every model call—generation, review, revision, and re-review—uses
  `gpt-5.6-luna` with `xhigh` reasoning. Do not downgrade simple questions.
- Use the isolated runtime root `alive/runtime/adaptive-staged-runs/` unless
  the user explicitly supplies another isolated directory.
- Do not write to the production Archive. Do not overwrite a baseline Run,
  baseline evidence, or the baseline skill.
- Preserve the same rule snapshot, source lock, visual reconnaissance,
  student solution contract, SVG lane, mother gate, and browser render gate as
  the baseline.
- When a source question has a diagram, graph, table, image, or SVG dependency,
  generation is blocked until the parent records actual semantic and browser
  inspection evidence for every affected ordinal. A local asset decode is not
  a substitute for this gate.
- Compile a per-ordinal canonical `Method Profile` into
  `source/method-profiles.json`. A missing profile, an unambiguous forbidden
  core method, or a missing route explanation rejects the candidate before it
  can be accepted.
- A `REVISE`/`FAIL` review result is never approval. Use the correction loop
  for unresolved ordinals and repeat fresh review until all review2 items,
  the mother gate, render gate, and package gate pass.
- This experimental result is not a production or High-1 promotion result.

## Experiment-only operational safeguards

- The adaptive controller permits up to four audited dispatch attempts per
  task. This is an isolated recovery budget for invalid/unchanged artifacts;
  the baseline production controller remains unchanged at its existing retry
  limit, and the extra attempts never bypass parent validation.
- Reconciliation applies a process-local boundary-aware correction for the
  Korean syllable `현`, so a word such as `실현` is not mistaken for a chord.
  Explicit preflight chord hints still win. This compatibility correction is
  recorded in the adaptive controller and is not installed in the baseline.
- If review 2 leaves any non-PASS ordinal, leave the Run at
  `MANUAL_REVIEW_REQUIRED` until `correction-start` is called. The correction
  loop only reworks affected batches, preserves original evidence, and never
  estimates speed from a partial Run or forces assembly/render/package to
  manufacture a comparison. After three correction cycles, remain held for
  manual direction rather than auto-approving.
- A structured browser render failure is durable evidence, not a terminal
  stop. It is written under `render/render-failure-NN.json`, moves the Run to
  `MANUAL_REVIEW_REQUIRED` at `S08_RENDER_REVIEW`, and exposes the affected
  ordinals to the same bounded correction loop. After repair and fresh review,
  the parent must assemble and render all three views again.

## Entry point

Use the bundled `scripts/adaptive_alive.py` wrapper. It exposes the same
state, dispatch, completion-marker, reconcile, assembly, render-record, and
package operations as the staged controller, but reconciles through the
adaptive reducer and writes only to the adaptive runtime root.

Start an experiment with `start --source-file` or `start --query`. Dispatch at
most four current batch tasks concurrently, always record the dispatch receipt
before waiting, write the result to its unique inbox, mark completion, and run
`reconcile`. Never dispatch a later stage while the current stage has pending
or dispatched work. The adaptive status reducer enforces this with a bounded
dispatch window: it exposes only the available slots (maximum four) and keeps
the remaining current-stage tasks durable but hidden until a slot opens.

The parent agent owns continuation. After every reducer call, read `status` and
continue the current queue until the Run is terminal. A `BLOCKED` status with
`RECORD_SOURCE_VISUAL_INSPECTION`, and a `MANUAL_REVIEW_REQUIRED` status with
`CORRECTION_START`, are actionable queue states—not completion. Do not return a
partial-result message merely because one wave finished or a child dispatch
failed; recover the task, close/wait the child, and reconcile again. Stop only
when the user pauses, an external service remains genuinely unavailable after
the allowed recovery path, or the Run reaches its final package/hold state.

Use this parent loop:

```text
status → perform only the listed current-stage action(s)
       → wait for child completion markers
       → reconcile
       → repeat status
```

If the first queue item is `RECORD_SOURCE_VISUAL_INSPECTION`, create an evidence
JSON after opening the source in the actual browser and record it with:

```text
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py record-visual-inspection --run <run-id> --file <evidence.json> --json
```

The route remains whole-exam batched. Do not substitute the legacy per-question
`FAST_EXAM` route.

When a Run is held after review2, start the next affected-batch correction
cycle with:

```text
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py correction-start --run <run-id> --json
```

Then dispatch the generated `repair-XX` builder tasks and their
`repair-review-XX` reviewer tasks in the same Luna xhigh route. Do not call
`assemble` while the correction loop is pending or held.

When `record-render` routes a failure to correction, use the same
`correction-start` command; do not treat the initial render failure as final.
After the repair review passes, rerun `assemble`, inspect exam/solution/answer
in the real browser, and call `record-render` with evidence for all three
views. Only then call `package`.

## Comparison boundary

Adaptive V2 changes the second-review policy and adds the method/correction
controls: a batch that passed review 1 and required no revision carries
forward its accepted review evidence with an explicit `I1_CARRIED_FORWARD`
marker; a revised batch still receives a fresh independent Luna xhigh review.
The question-level method profile is enforced on every newly accepted
candidate, and unresolved findings are routed through affected-batch repair
cycles. The mother semantic final gate and actual exam/solution/answer browser
review remain required.

`package` also includes the adaptive method snapshot and, when applicable, the
source visual-inspection evidence in the ZIP. The package command performs a
ZIP round-trip check before returning.

Do not add context-capsule changes, automatic model routing, or another speed
proposal to this V2 experiment. Those remain separate variables and require a
new approved variant. The correction loop is a quality-control closure path,
not a model-routing optimization.
