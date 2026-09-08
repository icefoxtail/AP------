# Pipeline-core v2 execution authority

This reference maps the current common pipeline implementation into the
similar-question skill. It is the execution companion to the quality rules in
COMMON_PROTOCOL and the schema/closure rules in pipeline-core.

## Authority split

- COMMON_PROTOCOL remains authoritative for semantic quality, evidence,
  independent review, release, seal, and the production boundary.
- archive/tools/pipeline-core/AGENT_BUDGET.md is the sole authority for job
  denominator, worker/provider topology, freeze, launch and recheck allowance,
  concurrency, recursion, retry, fallback, and token handling.
- pipeline-core/README.md, CLI source, contracts, and tests define the
  executable schema and evidence bindings.
- The similar-question skill supplies domain routing, student-solution
  quality, visual capability, and package identity policy. It cannot widen the
  execution topology defined by AGENT_BUDGET.

## New-job route

For a new pipeline-core-backed job, use one whole-job work batch. Do not turn
the semantic batch labels or per-question quality axes into separate provider
launches.

1. Verify the current repository-managed skill set from the active worktree.
2. Create the complete source/rule/candidate scope and prepare v2 manifests.
3. Initialize one work batch with every run id and the main-worker identity.
4. Run local STATIC, METADATA, and RENDER_CAPTURE checks before the freeze.
5. Freeze all run references together.
6. Run provider-preflight. It must be a zero-model control-plane check that
   returns the hash-bound provider plan and distinct sealed U1/U2/U3 contexts.
7. Reserve exactly one FINAL_AUDIT with the returned request, then dispatch the
   complete frozen scope through the provider bridge.
8. Reconcile the single terminal receipt. Provider failure, invalid
   attestation, or unknown state remains HOLD/DISPATCHED; it is not an
   invitation to retry automatically.
9. Repair defects locally, create a new immutable freeze, and use at most one
   TARGETED_RECHECK. Its scope is the computed affected UID and axis set.
10. Use direct-root validated reuse receipts for unchanged axes. A composite
    review record does not authorize rereviewing unaffected questions.
11. Run whole-job audit, v2 audit, and the separate release audit. A quality
    PASS never grants production publication authority.

The executable command family is:

~~~powershell
node archive/tools/pipeline-core/cli.mjs work-batch-init --spec spec.json
node archive/tools/pipeline-core/cli.mjs prepare-v2 ... --work-batch-id JOB --source-registry-ref FILE
node archive/tools/pipeline-core/cli.mjs work-batch-freeze --work-batch-id JOB --run-refs refs.json
node archive/tools/pipeline-core/cli.mjs provider-preflight --work-batch-id JOB --purpose FINAL_AUDIT --provider-command COMMAND --plan-out PLAN
node archive/tools/pipeline-core/cli.mjs work-batch-reserve --work-batch-id JOB --request request.json
node archive/tools/pipeline-core/cli.mjs provider-dispatch --work-batch-id JOB --launch-id JOB:N --plan PLAN --packet-refs packets.json --provider-command COMMAND --receipt-out RECEIPT
node archive/tools/pipeline-core/cli.mjs work-batch-reconcile --work-batch-id JOB --request request.json
node archive/tools/pipeline-core/cli.mjs work-batch-status --work-batch-id JOB
node archive/tools/pipeline-core/cli.mjs work-batch-audit --work-batch-id JOB --run-refs final-refs.json
node archive/tools/pipeline-core/cli.mjs audit-v2 --manifest run-v2.json
node archive/tools/pipeline-core/cli.mjs release-audit --manifest run-v2.json
node archive/tools/pipeline-core/cli.mjs work-batch-lock-status --root ROOT
node archive/tools/pipeline-core/cli.mjs work-batch-lock-recover --root ROOT --expected-lock-sha SHA
~~~

For a recheck, provider-preflight and reservation use
TARGETED_RECHECK. Do not invoke a second FINAL_AUDIT automatically. A
SECOND_AUDIT needs explicit authorization and reason for CONFLICT or HIGH_RISK.

## Render and review boundary

STATIC, METADATA, and RENDER_CAPTURE are machine-current evidence collected
with hash-bound local provenance. They are not LLM reviews and do not use
reuse receipts. RENDER_REVIEW is the independent semantic review axis.

Current render capture must cover every required mode and viewport, the last
question, and every continuation block. Each final block needs a frozen review
or a validated reuse receipt. Machine capture cannot masquerade as a fresh
semantic review, and a hand-authored render PASS without capture lineage is
blocked.

## Token and recovery boundary

Token budgets and maxTokens are legacy telemetry fields. Numeric provider usage
may be retained as usedTokens telemetry; missing or unavailable usage does not
create a token HOLD. Agent-count, concurrency, recursion, retry, frozen-input,
attestation, and evidence-binding failures remain hard failures.

Use work-batch-lock-status and work-batch-lock-recover only with the exact
lock snapshot hash and valid same-host dead-owner evidence. Age, force, PID
reuse, or deleting state never authorizes recovery.

## Legacy compatibility

The older adaptive-staged, staged, FAST, and task-dispatch commands remain
available for historical Runs and reconciliation. Their queue and batch
metadata can be read or resumed where the legacy runtime requires it, but they
do not authorize new provider launches under the v2 execution contract.
