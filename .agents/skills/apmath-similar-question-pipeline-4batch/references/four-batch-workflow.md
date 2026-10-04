# Four-batch compatibility notes

## Why this lane exists

The former adaptive route targeted at most four questions per batch. The
canonical integrated skill now uses four deterministic weighted batches for a
normal 22-question exam, allowing the first-generation stage to fit one
four-agent dispatch window while preserving the same review and render gates.

This changes orchestration granularity only. It does not change the model,
variation contract, source rules, answer contract, solutionDetail contract,
visual policy, or publication boundary.

## Runtime commands

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-status --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-render-readiness --run <run-id> --file <browser-smoke-evidence.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-resume --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-reconcile --run <run-id> --json
```

Continue with the canonical integrated dispatch, completion, review, assembly,
render, and package commands. Dispatch no more than four tasks concurrently.
On interruption, reload the manifest and use its frozen `batchPlan`; never
recreate partitions from the question count.

## Latency expectations

Four batches remove the usual second first-generation dispatch wave. They do
not make the model calls themselves four times faster, and browser solution
rendering is a separate local cost. Measure end-to-end time rather than
assuming a proportional token reduction: each batch has more context and may
produce a larger artifact.

## Failure handling

- Deterministic pre-review gates run before reviewer capacity is spent.
- A failed review routes only the affected batch to revision.
- A contract-only failure uses the bounded recovery path and preserves the
  original failed evidence.
- A correction cycle records affected ordinals and batches; it never resets the
  whole Run.
- A held or failed Run is closed and compared before a new Run starts.

The lane is successful only when exam, solution, answer, required solution
visual coverage, and package round-trip all pass. The result remains local and
is not registered in the production Archive.
