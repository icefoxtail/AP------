# Adaptive V2 workflow

Adaptive V2 is an isolated quality-control variant. It keeps the baseline
sequence and Luna xhigh route, adds a deterministic curriculum-method lock,
and closes review findings through bounded affected-batch correction cycles.
The baseline sequence, skill, and runtime remain the control group.

## Sequence

1. Lock the same source, rule snapshot, reference pack, and visual
   reconnaissance as the baseline. Inspect source visual assets before
   generation when a question depends on a diagram, graph, table, or SVG.
   Record actual semantic and browser inspection for every affected ordinal;
   local file decoding alone cannot close this gate.
2. Compile `source/method-profiles.json` for every preflight ordinal. A missing
   profile, forbidden core method, or missing required route is a hard hold.
3. Generate all batches in parallel waves of at most four using Luna xhigh.
   The status reducer exposes at most four available dispatch slots; remaining
   tasks stay durable and appear only after a slot opens. The method profile is
   included in every builder packet.
4. Run review 1 for every batch using Luna xhigh. Method lint runs before a
   candidate can be accepted, not only after the review text is written.
5. Revise only batches whose review-1 evidence requires revision. A passing
   batch is copied by the existing deterministic revision-skip logic.
6. For a skipped revision batch, materialize
   `evidence/<batch>/review2-carry-forward.json`. It must contain the accepted
   review-1 items, the exact ordinal set, the source review hash, and
   `independenceLevel: I1_CARRIED_FORWARD`.
7. For a revised batch, dispatch a normal independent review-2 task using
   Luna xhigh. It must not see the builder's hidden answer plan.
8. Run the same whole-exam mother semantic final gate. It must see review
   evidence for every ordinal, including explicit carry-forward records.
9. Assemble locally, inspect actual `archive/engine.html` exam, solution, and
   answer renders, record evidence, and package locally. The package must
   contain the method snapshot, the source visual-inspection artifact when
   required, and pass a ZIP round-trip check.

## Parent continuation loop

The parent agent, not a single child task, owns the Run until it reaches a
terminal state. After every command, read `status` and perform only the action
listed for the current stage:

```text
status → dispatch/wait or record a required gate
       → reconcile
       → status again
```

The parent must continue through all waves and must not report a partial result
because a child dispatch failed once. Use the four-attempt adaptive dispatch
budget, recover or replace the failed task where allowed, wait for its
completion marker, and reconcile. A visual-inspection queue item or a
correction-start queue item is actionable work, not a final answer. Stop only
on user pause, genuine external blocking after recovery, or a terminal package
or manual-hold state.

## Correction loop

If review 2 or the method gate reports a non-PASS ordinal, keep the Run at
`MANUAL_REVIEW_REQUIRED`. `correction-start` creates repair tasks only for
affected batches, preserves the original candidate and review evidence, and
then creates a fresh independent correction review. A passing correction
review does not bypass the mother, render, or package gates. The loop allows
at most three cycles; after that the Run remains held for manual direction.

If the browser evidence itself fails, `record-render` stores the structured
failure under `render/render-failure-NN.json`, identifies affected ordinals,
and returns the Run to `MANUAL_REVIEW_REQUIRED` at `S08_RENDER_REVIEW`. Start a
correction cycle from that state, run fresh review, then assemble and inspect
all three browser views again. A render failure is repaired through the same
loop rather than silently downgraded to a warning.

The adaptive controller has an experiment-only four-attempt dispatch budget
and a boundary-aware visual-term compatibility correction. Both are audited
in the Run and are absent from the baseline controller; neither can bypass a
parent contract rejection or a non-PASS review finding.

## What this does not mean

Carry-forward is not a claim that review 1 is a second independent review. It
is an explicit experimental policy. The report must expose which batches were
re-reviewed and which were carried forward. If the user requests a strict
audit or official promotion, use the baseline full-review route instead.

If review 2 reports any unresolved ordinal, stop at
`MANUAL_REVIEW_REQUIRED` and use the correction loop. A partial elapsed time
is not a speed result, and the adaptive Run must not be assembled or published
to make the comparison look complete.

## Commands

From the repository root:

```text
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py start --query "..." --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py status --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py reconcile --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py record-visual-inspection --run <run-id> --file <evidence.json> --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py correction-start --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py assemble --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py record-render --run <run-id> --file <evidence.json> --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py package --run <run-id> --json
```

The dispatch, recovery, completion-marker, render-record, package, and
parent-resolution subcommands mirror the same wrapper. All commands accept
`--runtime-root` when an explicitly isolated directory is required.
