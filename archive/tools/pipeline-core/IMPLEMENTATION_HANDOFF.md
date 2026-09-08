# Implementation-only handoff

START_BRANCH_SHA: `4b38e060f275a3cca446fedbabb339c7ea913013`

Branch: `work/independent-task`. This change is one fix-forward commit; the
containing commit supplies FINAL_BRANCH_SHA. No merge to main was performed.

TESTS = NOT PERFORMED. No regression tests, syntax/runtime test execution,
calibration, holdout or E2E was run. Stale test migration is deferred to the
independent Luna xhigh testing/budget audit stage. `git diff --check` was used
only for patch whitespace. This document does not declare implementation PASS.

Independent agents created during implementation: 0.

## Architecture

The existing semantic kernel, axis projections, impact calculation, reuse,
question/edit/release closures and renderer remain in use. The work-batch module
adds a persisted job-wide reservation/dispatch ledger, token telemetry,
exclusive expensive slot, whole-job freeze, one final audit and one optional
change-scoped recheck. Explicit conflict/high-risk second review is bounded.
Reservation/receipt/history/schema/evidence mismatches fail closed. Ambiguous
provider state is reconciled rather than timed out and redispatched.

Legacy ALIVE task, FAST, staged and adaptive external launch entry points are
read/reconcile-only. Their fail/retry paths no longer requeue external work.
The adaptive wave dispatch window is zero. Canonical skill, compatibility aliases,
reference entry points and legacy Codex roles now point to the work-batch route.

Typed machine evidence, typed semantic payloads, phase/visibility/session binding,
nested blind packet filtering, lifecycle eligibility binding, bidirectional source
identity uniqueness, canonical release N/A, and native-vs-migrated optional visuals
are integrated into v2 validation. Current render captures are machine work;
per-item semantic render reuse closes unaffected coverage. Rule/history retrieval
instructions now request compact phase inputs and result references.

See [AGENT_BUDGET.md](AGENT_BUDGET.md) for CLI and provider receipt contracts.
The provider adapter must actually supply stateless contexts and disable subagent
tools; inability to prove those capabilities is HOLD, not permission to spawn
one agent per evidence axis. Operational acceptance remains pending independent
runtime testing, including negative and crash/resume cases.

## Main observation

MAIN = UNCHANGED_BY_THIS_TASK (no main writes, commits, reset, or merge).
The shared repository's main reference changed externally during this work:
`4ea119a8e583056eb0944fd9f6d18e1a0e7eb72b` to
`aa9b082e6ff607c249196045a8d0b0e2096a8c18`.
Its reflog describes `fix(archive): reconcile metadata sidecar`.
This commit contains none of that separate main work or its initial dirty files.

## Changed files

- `.agents/skills/apmath-similar-question-pipeline-4batch/SKILL.md`
- `.agents/skills/apmath-similar-question-pipeline-adaptive/SKILL.md`
- `.agents/skills/apmath-similar-question-pipeline/SKILL.md`
- `.agents/skills/apmath-similar-question-pipeline/references/fast-exam-workflow.md`
- `.agents/skills/apmath-similar-question-pipeline/references/universal-runtime-workflow.md`
- `.agents/skills/apmath-similar-question-pipeline/references/workflow.md`
- `.codex/agents/alive-candidate-builder.toml`
- `.codex/agents/alive-fast-blinded-verifier.toml`
- `.codex/agents/alive-fast-question-builder.toml`
- `.codex/agents/alive-fidelity-reviewer.toml`
- `.codex/agents/alive-math-verifier.toml`
- `.codex/agents/alive-plan-designer.toml`
- `.codex/agents/alive-serializer-render-reviewer.toml`
- `.codex/agents/alive-source-analyst.toml`
- `.codex/agents/alive-staged-batch-builder.toml`
- `.codex/agents/alive-staged-batch-reviewer.toml`
- `.codex/agents/alive-visual-reviewer.toml`
- `alive/engine/adaptive_quality_runtime.py`
- `alive/engine/adaptive_staged_exam.py`
- `alive/engine/agent_budget.py`
- `alive/engine/fast_exam.py`
- `alive/engine/staged_exam.py`
- `alive/engine/task_runtime.py`
- `archive/tools/pipeline-core/AGENT_BUDGET.md`
- `archive/tools/pipeline-core/IMPLEMENTATION_HANDOFF.md`
- `archive/tools/pipeline-core/README.md`
- `archive/tools/pipeline-core/build-work-ledger.mjs`
- `archive/tools/pipeline-core/cli.mjs`
- `archive/tools/pipeline-core/closure.mjs`
- `archive/tools/pipeline-core/contracts/edit-closure-v1.schema.json`
- `archive/tools/pipeline-core/contracts/evidence-v2.schema.json`
- `archive/tools/pipeline-core/contracts/question-quality-closure-v2.schema.json`
- `archive/tools/pipeline-core/contracts/review-batch-v2.schema.json`
- `archive/tools/pipeline-core/contracts/run-v2.schema.json`
- `archive/tools/pipeline-core/contracts/work-batch-v1.schema.json`
- `archive/tools/pipeline-core/exam-release.mjs`
- `archive/tools/pipeline-core/prepare.mjs`
- `archive/tools/pipeline-core/question-quality-set.mjs`
- `archive/tools/pipeline-core/question-uid.mjs`
- `archive/tools/pipeline-core/render-impact.mjs`
- `archive/tools/pipeline-core/render.mjs`
- `archive/tools/pipeline-core/review-evidence-v2.mjs`
- `archive/tools/pipeline-core/review-isolation-runner.mjs`
- `archive/tools/pipeline-core/v2-audit.mjs`
- `archive/tools/pipeline-core/work-batch.mjs`

IMPLEMENTATION_ONLY_COMPLETE — READY_FOR_INDEPENDENT_TEST_AND_BUDGET_AUDIT
