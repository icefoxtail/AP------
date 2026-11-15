# Current-run M3S1 exclusion — read-only preflight

Inspected exact union `bd552528a910cf7f01413a1e66103ee890399715`, compared with actual registered main `aa3789e87da68ccd649d950946e8b06aca5d9754`. No pipeline, config, state, source, registration request or generated output was modified.

## Finding

There is no supported per-run source/UID exclusion option in the current production path. The current input packet itself excludes M3S1, but this does not constrain the optional semantic writer.

The actual carried AutoMeta state has 680 M3S1 pending targets across 97 source files. Only 132 have a stored attempt signature; the rest are still pending without one. The M3S1 pilot is already completed. Semantic is enabled and its writer-state continuation is true. This is existing state, not a newly created cohort.

`selectTargets()` starts with all pending targets, then adds changed source objects since the cursor and incomplete pilots. It does not take the reviewed inbox's source set. The attempt signature includes global registry SHA, so this packet's legitimate registry changes may also cause previously stable refusals to be reconsidered. The maximum 100 acted targets limits a single run; it does not exclude a semester and is not a permission boundary.

## Existing entrypoints and their limits

| Entrypoint | Existing options/behavior | Why it does not solve the exclusion |
|---|---|---|
| `archive/tools/meta-foundation/auto-register-merged-source.mjs` CLI and `registerMergedSource()` | root, report, write, verify, replay report | No target/source/exclusion option. Replay is explicitly read-only and cannot be used as a fabricated write batch. Unknown source flags are not a supported contract. |
| `tools/ci/archive-main-auto-meta-pass.sh` | Calls unscoped `--write`, full builds, verify and exact replay | No per-run source policy input. |
| `tools/ci/archive-registration-writer.mjs` CLI | root, work-dir, check; separate unrelated-range check | No per-run semantic scope input. |
| `prepareRegistration({lanes})` / `nativeLanes()` | Internal API accepts lane descriptors and hashes their parameters | Setting the semantic lane disabled records disabled state and resets its continuation; it is not a source-only one-shot operation. |
| `ARCHIVE_META_SCOPED` | Reviewed lane consumer validation selection | It does not reach the semantic target selector. |
| `.github/workflows/archive-main-auto-meta.yml` | Main pushes, hourly schedule and dispatch call the same writer; persistence retries regenerate it | No dispatch scope input. Adding an unused CLI option alone would leave automatic main-push runs unscoped. |

Changing tracked `config.enabled`, filtering the stored pending map, marking the pilot completed again, adjusting the batch size/order, or manufacturing a prior replay report would not be an appropriate implementation.

## Narrow proposed extension — not implemented

Add an explicit, validated **current-run scope** passed from the production writer to its semantic lane. For this batch its only exclusions are the exact source-directory prefixes `original/middle/m3/1mid/` and `original/middle/m3/1final/`. Scope selection is an execution boundary; it supplies no metadata or mathematical approval.

1. Keep `selectTargets()`'s complete candidate collection. Before loading/planning/writing a target in the execution loop, classify excluded targets as deferred for this run. Do not call `planQuestion()` for them. Existing excluded pending records, including their base commits, reasons and signatures, must remain equal. Newly discovered excluded targets must be retained in pending before advancing the cursor, so an excluded source change cannot disappear.
2. Preserve all current registrar rules and every full repository validation. The reviewed, shared, generated, index and four-slot validation commands remain intact. Do not make validation success conditional on the exclusion.
3. Seal the run policy/digest into the semantic batch/replay proof and the writer lane's existing `parameters` input fingerprint. Pass the same policy through normal prepare, race-safe regeneration, final verify and persisted-snapshot check. A later unscoped invocation must get a different parameter fingerprint and reconsider the preserved pending targets normally.
4. Report deferred targets separately from `APPLY`, approval and attempted-batch rows. They do not consume the acted limit, acquire a new signature, lose pending status, or become completed pilots. Continuation must distinguish allowed unfinished targets from the current policy's deferred set without erasing the latter.
5. Bind a one-shot policy to this batch's exact immutable reviewed input manifest, or supply an equivalent explicit current-run argument to **every actual invocation**. Automatic push execution needs the same activation path; a manual-dispatch-only flag is insufficient. The policy must not become a global permanent M3S1 setting. If a batch-scoped descriptor is used, capture/validate it before the reviewed lane consumes inbox files and define completion/retry behavior explicitly.
6. Add a pre-persist excluded-UID boundary check for metadata, identity and runtime rows. This is a guard against an unintended shared-generator side effect, not a replacement for full validation. Shared pack envelopes/digests can be rebuilt while excluded semantic rows must remain exact. Any excluded-row mutation must fail before remote persistence.

Minimum connection points are the AutoMeta module, semantic pass script, writer scope/parameters forwarding, and actual workflow invocation. A narrowly factored scope parser may be preferable to duplicating parsing between them. No production implementation is present in this proposal.

## Necessary focused regressions

- A pending M3S1 row that would otherwise apply is never planned or written under the scoped run; an allowed row still applies and all existing full validation runs.
- Both existing pending and newly discovered excluded source deltas remain durable without changing old pending records or consuming a pilot.
- Current-run replay and race regeneration use the same policy; a missing, altered or broadened policy fails the binding.
- A subsequent unscoped run can process the preserved M3S1 pending rows; no permanent freeze or false no-op cache is introduced.
- Metadata/runtime mutation of an excluded UID by any lane fails before persistence. A required validation failure still blocks publication.
- The automatic main-push entrypoint, not only a synthetic API call or manual dispatch, passes the scope.

The prepared native union can continue through its immutable shadow independently. The production all-lane writer requires an explicit scope solution before this user-excluded semester can be guaranteed untouched.
