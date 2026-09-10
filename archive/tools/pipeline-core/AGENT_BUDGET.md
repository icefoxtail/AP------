# Agent / Token Budget Architecture (current pipeline-core v2)

This is an implementation contract, not a validation or quality PASS report.
The user-requested JOB is the budget denominator, independent of exam count.
One job may contain many run manifests, selected question/asset targets, or an
entire unit. Each run's `questions` defines its UID targets. `workBatchId` is
bound in `runInputSha`; a run cannot acquire a second budget by changing batch ID.

## Operating sequence

1. The main worker initializes the job with its complete `runIds` and builder
   identity. No independent production agent exists. Token values are telemetry,
   never execution authority.
2. Produce all targets; preserve existing accepted evidence. Perform machine
   checks locally. STATIC and METADATA use typed MACHINE_CURRENT records;
   browser capture uses MACHINE_COLLECTOR, never an auditor identity.
3. Freeze immutable run references for ALL runIds together. Inputs, loaded JS
   banks, axis projections, machine evidence and current render witnesses are
   checked locally. The freeze binds targets, semantic inputs and dependencies.
4. First run `provider-preflight` through a configured provider runtime. It is a
   zero-model-invocation control-plane call that must return a hash-bound
   provider-issued external ID and three distinct session/context identities.
   Reserve only with its generated request; arbitrary caller UUIDs are not a
   provider capability proof.
5. Reserve FINAL_AUDIT once with that plan-bound request. The reservation consumes
   the one final-audit allowance and a repository-wide expensive slot; it does
   not reserve, cap, or authorize tokens. Then use `provider-dispatch` to record
   that same provider externalId as DISPATCHED. The provider processes the
   complete scope sequentially in sealed U1/U2/U3 stateless input contexts and
   returns evidence refs plus one consolidated defect list.
6. Reconcile a hash-bound terminal provider receipt. Quality defects mean a
   COMPLETED audit, not a new launch. Provider failure means HOLD. Unknown or
   timed-out provider state keeps RESERVED/DISPATCHED and occupies the slot.
7. Repair all defects locally. Freeze once more and reserve TARGETED_RECHECK at
   most once. Scope is defect UIDs plus computed semantic/dependency/render
   impact. Accepted unaffected axes require direct-root validated reuse.
8. Aggregate whole-job coverage and cost with work-batch-audit. A failed first
   audit can supply a bound partial predecessor; only independently revalidated
   PASS axes survive. No PASS-until-retry loop exists.

A conflict/high-risk SECOND_AUDIT is optional, never automatic. It needs an
explicit authorization identity and reason, consumes one bounded allowance,
and shares the same expensive slot. Ordinary repairs use TARGETED_RECHECK.

For GOLD/pilot/benchmark/holdout jobs, the start gate freezes the required
`START_SHA`, calibration, and rule identity before the first freeze. A later
live `origin/main` advance is `POST_START_MAIN_ADVANCE` and is not a reason to
interrupt that job. `START_TIME_STALE` applies only when the baseline was
already stale at start; frozen bytes, hashes, and job evidence still have to
match the frozen authority.

## CLI contracts

All commands are on `archive/tools/pipeline-core/cli.mjs`. Paths in bound refs
are repository-relative and carry `{path, bytes, sha256}`. Keep revision inputs,
pre-review snapshots and returned evidence immutable; write a new manifest
snapshot when adding evidence rather than overwriting a frozen ref.

- `work-batch-init --spec spec.json`: spec contains `workBatchId`, `runIds`,
  `builderId`, and `builderSessionId`. A legacy `tokenBudget` field is ignored.
- `prepare-v2 ... --work-batch-id JOB`: associates existing v2 preparation with
  the job. Preparation is not freeze and grants no independent launch.
- `work-batch-freeze --work-batch-id JOB --run-refs refs.json`: refs is the full
  run-reference array. Run STATIC/METADATA and render collection before freeze.
- `work-batch-reserve --work-batch-id JOB --request request.json`: request has
  `purpose`, `callerRole: MAIN_WORKER`, `auditorId`, `auditorSessionId`,
  `parentLaunchId: null`, `recursiveSubagentLaunchCount: 0`,
  `contextIsolation: STATELESS_INPUTS`, `subagentToolsEnabled: false`, and
  `contexts: {U1: {sessionId, contextId}, U2: {...}, U3: {...}}`. A bridge
  route additionally carries the hash-bound `providerAttestationPlanRef`
  returned by `provider-preflight`; `provider-dispatch` refuses a reservation
  without that exact ref.
  SECOND_AUDIT additionally requires
  `authorization: {explicit: true, authorizedBy, reason: CONFLICT|HIGH_RISK}`.
- `work-batch-reconcile --work-batch-id JOB --request request.json`: first bind
  `{launchId, externalId, status: DISPATCHED}`. Terminal requests add
  `providerReceiptRef` and status COMPLETED or FAILED.
- `provider-preflight --work-batch-id JOB --purpose FINAL_AUDIT|TARGETED_RECHECK --provider-command COMMAND [--provider-args args.json] --plan-out alive/runtime/provider-bridge/.../plan.json`: invokes the configured provider control plane over canonical JSON stdin. It must attest `modelInvocationCount: 0`, stateless U1/U2/U3 identities, builder separation, and tools disabled, then returns the exact reservation request.
- `provider-dispatch --work-batch-id JOB --launch-id JOB:N --plan alive/runtime/provider-bridge/.../plan.json --packet-refs packets.json --provider-command COMMAND [--provider-args args.json] --receipt-out alive/runtime/provider-bridge/.../receipt.json`: binds the reserved launch to that plan, sends only sealed phase packets sequentially, validates returned input/session/context/visibility attestations, and reconciles one receipt. Transport failure or an invalid response remains DISPATCHED/HOLD; it never retries.
- Terminal provider receipt: matching `launchId`, `externalId`, `status`,
  optional `usedTokens`, `independentAgentLaunchCount: 1`, `expensiveAgentLaunchCount: 1`,
  `concurrentExpensiveAgentPeak: 1`, `recursiveSubagentLaunchCount: 0`,
  `evidenceRefs`, and `defects: [{runId, questionUid, ...}]` (possibly empty).
  A numeric usage value is retained exactly; missing, `null`, or `NOT_AVAILABLE`
  usage is normalized to null telemetry and never creates a HOLD.
- `work-batch-status --work-batch-id JOB`: compact state; no full input dump.
- `work-batch-audit --work-batch-id JOB --run-refs final-refs.json`: whole-job
  final evidence snapshots, cost metrics, required-axis coverage and errors.

The runtime stores `alive/runtime/work-batches/JOB/state.json` under an exclusive
repository mutation lock, with fsync and atomic replacement. A crashed lock or
pending write requires the explicit lock recovery procedure below; age never
authorizes recovery. Do not
reset/delete state to regain budget. Existing legacy DISPATCHED manifests also
block new reservations until their provider state has been reconciled.

## Evidence and execution are separate

SOURCE/MATH_A1/V1 bind U1 SOURCE_ONLY/NONE. V2 binds U2 ARTIFACT_ONLY/NONE.
MATH_A2/SOLUTION/V3 bind U3 FROZEN_V1_V2/FROZEN_U1_U2. RENDER_REVIEW binds U3
ACTUAL_RENDER/CAPTURE_ONLY. U3 may consume frozen results. These are sealed input
contexts within one execution, not separate execution agents. Fresh evidence
binds a completed launch, provider output ref, phase session, packet context,
UID scope, freeze and timestamps. A provider incapable of stateless input
isolation with subagent tools disabled must HOLD; a stateful chat that has seen
answers cannot become blind by changing a label.

STATIC/METADATA/RENDER_CAPTURE use MACHINE_CURRENT and MACHINE_COLLECTOR with
hash-bound local collection provenance. They never use reuse receipts or LLM
launches. The semantic kernel still enforces mathematical/visual/render closure.
Typed payloads and exact source/input/axis bindings supplement that kernel.

When a candidate, asset, solutionImage, or metadata input mutates, the prior
machine record is stale/invalidated and the collector must create a new current
record. Current evidence binds both the current candidate/artifact SHA and its
axis input SHA; old `status: PASS` records are not current by label alone.
V1 `ADD` is closed only by generated artifact, candidate attachment, V2
artifact-only review, V3 expected/observed fact parity, and render review (or
explicit defect/HOLD/reclassification evidence). Diagnostic continuation may
observe downstream failures but never changes canonical PASS or promotion.

Upstream phase projections bind semantic inputs so that freezing A1/V1/V2
outputs does not invalidate the job's pre-review input hashes. Exact frozen
output hashes remain mandatory in A2/V3 semantic checks.

Render capture remains current across every required case. A composite current
render review can contain fresh affected item reviews and hash/axis/witness-bound
reused items. Unchanged per-UID quality axes still point to their accepted root
and current reuse receipt. Fresh LLM scope is independently checked against the
reserved target set; composite coverage is not permission to rereview the job.

Reuse eligibility binds current run/revision, root evidence, source authority,
and lifecycle snapshot. To avoid a self-referential hash, the lifecycle snapshot's
`eligibility` body excludes only `lifecycleSnapshotSha`; the external eligibility
record carries that snapshot ref's SHA. Revoked/withdrawn/superseded roots fail.

SOURCE registry identity-to-ID and ID-to-identity mappings are both unique.
EXAM_RELEASE NOT_APPLICABLE is a mandatory canonical closure, not an absent gate.
Native VISUAL_OPTIONAL has `origin: NATIVE`; only
`origin: LEGACY_VISUAL_RECOMMENDED` requires an approved from/to migration record.

## Cost and context discipline

Reports expose workBatchId, targetCount/totalTargetCount, totalAffectedCount,
independentAgentLaunchCount, expensiveAgentLaunchCount, concurrentExpensiveAgentPeak,
freshLlmUidCount, reusedUidCount, machineCheckedUidCount, retryLaunchCount,
secondAuditorLaunchCount, recursiveSubagentLaunchCount, agentBudgetStatus, and
usedTokens (null when unavailable). Use whole-job
work-batch-audit for cross-run UID numerators; per-run audits contain local rows.

Compile the applicable rule extract once per job and retain its source hashes.
Pass only phase-authorized fields and compact refs. Never put intended answers,
expected coordinates/classifications, prior verdicts or hidden rationale into
U1. Do not repeatedly retrieve full rules, JSON, command outputs or agent history.

Legacy ALIVE task/staged/adaptive/FAST launch entry points are reconcile-only.
Their queue/partition metadata is reusable for local production, but it is not
new-launch authorization. The four-batch alias and role templates point here.

## This implementation handoff

No test, calibration, holdout, or E2E execution was performed in this change.
Existing stale tests are intentionally not migrated. Independent testing must
exercise happy paths, fail-closed negatives, crash/resume, state/receipt tampering,
partial predecessor reuse, selective render reuse, provider token reporting and
all retired dispatch routes before operational acceptance.


## Token telemetry and review preparation

Token values never deny a launch, recheck, or terminal receipt. `maxTokens` and
`tokenBudget` are ignored if supplied by legacy callers; new state does not emit
them, and `reservedTokens` is no longer calculated. A provider's non-negative
integer `usedTokens` is preserved as telemetry. Missing, `null`, or
`NOT_AVAILABLE` usage becomes null telemetry without changing job status.
Legacy state files may retain `tokenBudget` or per-launch `maxTokens`; they are
accepted and ignored. Historic token-only HOLD codes, including
`HOLD:TOKEN_BUDGET_EXCEEDED` and `HOLD:PROVIDER_TOKEN_USAGE_INVALID`, are retired
on the next eligible reserve. All non-token HOLD reasons, frozen-input checks,
and agent-count/concurrency/retry/recursion limits remain hard.

U3 packets must carry `currentQuestion` with questionUid, content, choices
(an empty array for a constructed response) and the exact candidateRef, plus
`currentAnswer` and plain-text `currentSolution`. Build these fields with
`loadCandidateReviewContext(root, run)` and `buildU3CandidatePayload(...)`.
The v2 audit compares them against the byte-bound candidate, including the
unchanged choice ordering. U1 bundles use source images; source choices/images
must never be substituted for candidate fields in U3. Bracket-prefixed U3
explanations such as `[키포인트]` are text, not encoded blind JSON.

`prepare-v2` deliberately emits DRAFT_NOT_EXECUTABLE, not final closure evidence.
The main worker must decide sourceAuthority.applicability and bind its authority
evidence before the input freeze, retain build ledger records with genuine build
timestamps, and aggregate questionQualityClosureSetRef from audited results.
Missing closure records must not be replaced with fabricated PASS defaults.
Likewise, reusable root evidence must contain its original lifecycle declarations;
current eligibility needs a separately bound lifecycle snapshot. Missing
declarations in an old root are not permission to rewrite frozen reviewer output.

## Explicit crash-lock recovery

Use `work-batch-lock-status --root ROOT` to inspect the lock's raw-byte
`lockSha` and owner metadata. Then use
`work-batch-lock-recover --root ROOT --expected-lock-sha SHA` with that exact
snapshot hash. If there is no dispatch lock, status returns `ABSENT`; that
explicit sentinel permits cleaning interrupted recovery markers/pending writes.
These commands do not launch, stop, cancel, retry or mark provider tasks complete.

New mutation locks record host, PID, random owner token, acquisition time and
workBatchId. Recovery requires the same local host and positive evidence that
that PID no longer exists/has terminated. A live or reused PID, permission error,
foreign host, empty legacy lock or incomplete metadata remains HOLD. There is
no force/age override and recovery never sends a termination signal.

The Python standard-library helper uses an OS-managed exclusive guard
(`msvcrt.locking` on Windows, `flock` on POSIX). Its permanent guard file is not
itself a stale lock: the OS releases the held lock on process exit. Concurrent
recovery cannot proceed. A recovery marker blocks normal mutators both before
and after their exclusive dispatch-lock acquisition; interrupted markers can
be cleared only while holding the OS guard. A process crashing during recovery
therefore does not require manual marker deletion.

The dead lock and uncommitted `state.json.next`/`state.json.hold` files are moved
into a unique `.recovery-UUID` directory, with a recovery report. They are never
replayed into state. Committed `state.json` files are preserved byte-for-byte,
including RESERVED/DISPATCHED provider IDs and spent/reserved budgets. After
lock recovery, reconcile those same provider tasks through the existing API;
a recovered local mutex is not a free expensive-agent slot.

Recovery requires the configured `APMATH_PYTHON` executable (default `python`).
The helper invokes neither tests nor providers. Failure or unknown process
identity is fail-closed. Tests for this recovery protocol and updated v2
contracts are authored in `tests/work-batch-lock.test.mjs` and `tests/v2.test.mjs`;
they were not executed during this repair.
