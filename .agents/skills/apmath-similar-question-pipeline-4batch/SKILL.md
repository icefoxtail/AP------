---
name: apmath-similar-question-pipeline-4batch
description: Deprecated compatibility alias for the unified APMath ALIVE four-batch Luna xhigh pipeline; use apmath-similar-question-pipeline for new runs.
---

# Compatibility alias

This skill is retained only so an old explicit invocation does not select a
different workflow. For every new whole-exam request, use
`$apmath-similar-question-pipeline`.

The canonical skill already includes the former four-batch lane as its default:
`FOUR_BALANCED`, at most four concurrent `gpt-5.6-luna` `xhigh` tasks, complete
student-solution and visual gates, independent review 1, bounded revision,
independent review 2, mother final review, actual production-engine browser
render of exam/solution/answer, resume safety, and local packaging.

Do not create a separate comparison Run or lower any quality gate merely because
this compatibility name was used. Follow the canonical instructions in
`../apmath-similar-question-pipeline/SKILL.md` and its referenced documents.
