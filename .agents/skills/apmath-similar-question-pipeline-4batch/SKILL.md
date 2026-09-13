---
name: apmath-similar-question-pipeline-4batch
description: Deprecated compatibility alias for the historical APMath ALIVE four-batch pipeline; use apmath-similar-question-pipeline for new runs.
---

# Compatibility alias

This skill is retained only so an old explicit invocation does not select a
different workflow. For every new whole-exam request, use
`$apmath-similar-question-pipeline`.

The canonical skill retains the former FOUR_BALANCED lane only for explicit
legacy planning and reconciliation. New pipeline-core-backed jobs follow the
canonical `apmath-similar-question-pipeline` skill and the current
`AGENT_BUDGET.md` repair/recheck allowance. This alias defines no separate
budget or auditor topology; current jobs use one whole-job work batch,
provider-attested FINAL_AUDIT, current render capture/review, and the separate
release audit. Do not turn the compatibility alias into a per-batch launch
policy.

Do not create a separate comparison Run or lower any quality gate merely because
this compatibility name was used. Follow the canonical instructions in
`../apmath-similar-question-pipeline/SKILL.md` and its referenced documents.
