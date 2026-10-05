# Baseline versus adaptive comparison

The comparison is an A/B test, not a claim that a faster artifact is better.
Both Runs must use the same source lock, rule snapshot, reference selection,
variation mode, batch count, and `gpt-5.6-luna/xhigh` route. Store them in
separate runtime roots.

## Required measurements

- wall-clock time from Run creation to package
- model dispatch count, retry count, artifact rejection count, and recovery
  count
- source lock and question count equality
- source visual-inspection completion, affected ordinals, and asset-hash match
- per-question answer-match results
- solution-detail and student-walkthrough coverage
- required solution-visual coverage and asset/hash validity
- mother-final findings
- actual exam, solution, and answer browser render verdicts
- package round-trip verdict
- adaptive-only retry-budget and compatibility-shim usage
- adaptive method-profile status, forbidden-method findings, and correction
  cycle count/status
- render-failure count, repaired ordinals, and whether a fresh post-repair
  three-view browser pass was recorded
- rule-authority hashes bound to the method snapshot

## Acceptance gate

Adaptive V2 is eligible for further consideration only if:

- there are zero critical mathematics, answer, solution, visual, or render
  failures;
- every question still has a passing mother-final record;
- every required solution diagram renders and remains hash-bound;
- package round-trip passes; and
- every accepted candidate has a READY method-profile result, with no
  unresolved correction-loop finding; and
- every source visual dependency has a PASS semantic/browser inspection record
  before generation; and
- elapsed time and retry counts improve materially over the control.

Any quality regression rejects the adaptive variant, regardless of speed. A
prior successful Run can be used as an operational reference, but a fair A/B
comparison should run a fresh control and a fresh adaptive Run close together
because model-service latency and availability vary.

If the adaptive Run ends at `MANUAL_REVIEW_REQUIRED` or another non-terminal
quality hold, record the residual non-PASS ordinals and correction-cycle
history, and do not calculate a speedup from its partial elapsed time. Both
Runs must be terminal before any timing comparison is considered ready.

The deterministic evidence summary can be produced with:

```text
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/compare_runs.py --baseline-root <control-root> --baseline-run <control-run> --adaptive-root <adaptive-root> --adaptive-run <adaptive-run> --output <comparison.json>
```

This report deliberately returns `QUALITY_REVIEW_REQUIRED`; it cannot promote
the adaptive result based on timing or structural evidence alone.
