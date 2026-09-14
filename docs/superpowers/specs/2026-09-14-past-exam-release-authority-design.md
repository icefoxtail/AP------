# Past Exam Release Authority and Performance Hardening Design

**Date:** 2026-09-14  
**Repository:** `icefoxtail/AP------`  
**Branch:** `codex/jeilgo25-archive-exam`  
**Start HEAD:** `72adf278dff6790820f34e4c5b2d83ca51b9ad2d`

## Goal

Close the five correctness/security-of-authority defects in the Past Exam
release path first, then reduce avoidable packet, bound-file, evidence, and
production-inventory I/O without weakening any freshness, lineage, or
fail-closed gate.

## Scope and non-goals

The implementation is limited to the Past Exam release, existing-exam
preflight, targeted-review packet, V2 audit projection, and batch inventory
paths named by the request. Existing UI text, exam content, unrelated dirty
changes, and broad pipeline refactors are out of scope. All filesystem
fixtures use temporary roots; repository production exams, assets, DB, and
question-index files are never test mutation targets.

## Architecture

The release path keeps its current public entrypoints but makes canonical
authority an explicit typed binding. `createReviewReady`, its validator, and
the release entrypoint all consume the same authority verification path. That
path reuses persisted work-batch state, the completed FINAL_AUDIT launch,
U1/U2/U3 provider evidence, V2 audit/closure validation, and current bound
bytes. A status string is never sufficient authority.

Promotion, registration, index rebuild, and production smoke remain separate
mutations, but a release transaction journal records their identity, baseline,
before/after SHA, and stage. Recovery resumes only when current bytes still
match the transaction's expected state; a concurrent writer causes HOLD and is
never overwritten by an old snapshot.

Performance changes are execution-local immutable snapshots and indexes. No
global cache is introduced. Each audit or packet-build invocation revalidates
the files at its boundary, shares reads only within that invocation, and
disposes its cache afterward.

## Contract decisions

1. The existing `REVIEW_READY` public schema/version and function names remain
   stable. A required `finalAuditAuthority` envelope is added to the receipt;
   old receipts without it are rejected with an explicit authority error.
2. The authority envelope binds `workBatchId`, work-batch state ref/SHA, run
   ref/SHA, run/revision/input SHA, candidate refs/SHA, asset-set SHA, the
   completed FINAL_AUDIT launch, phase request/response/evidence refs, the
   canonical closure ref/SHA, and a deterministic authority SHA.
3. Final production smoke is collected after promotion, DB registration, and
   index rebuild. The canonical pipeline-core browser collector is reused via
   a production adapter. A CLI-provided pre-read smoke JSON is diagnostic input
   only and cannot become the final smoke authority.
4. Promotion, registration, index, and smoke receipts carry exact normalized
   target identity and previous-receipt identity. A receipt from another
   exam, target, run, revision, candidate, or release transaction is invalid.
5. Course is part of canonical exam identity and is normalized through the
   existing course-token/alias system. Unknown or missing course makes
   existing-exam identity incomplete and therefore HOLD, never NEW or an
   inferred existing match.
6. Targeted packets carry `targetedAxesByQuestionUid`. Provider evidence is
   validated by `(questionUid, axis)` and an unrequested pair is a hard error.
7. Transaction, audit, packet, evidence, and inventory caches are local to one
   operation. Required stale checks at release and audit boundaries remain.

## Failure and recovery model

Before the first production write, the release records target-production,
asset-root, DB, and index baselines and checks them against approval. Each
completed mutation records before/after state. On a later failure:

- matching transaction after-SHA means the stage can be resumed;
- matching baseline-SHA means the stage has not completed;
- any other current SHA is a concurrent or unexplained writer and yields HOLD;
- compare-and-restore is permitted only when the current bytes still equal the
  same transaction's after-SHA;
- only a fully verified smoke result allows `DONE` and
  `productionAuthorized: true`.

## Verification contract

The RED/GREEN sequence is enforced for every new regression. P1 tests run
before any PERF implementation. The P1 gate covers fake FINAL_AUDIT,
stale/fake smoke, cross-target receipt replay, all three injected downstream
failures, subject collision, and legacy receipt rejection. Only after all P1
tests pass do the performance tests cover exact UID-axis targeting, provider
out-of-scope evidence, execution-local I/O deduplication, and one-pass batch
production scan with job-boundary revalidation.

The final verification includes `node --check` for every changed JS/MJS,
past-exam tests, pipeline-core tests, release/preflight/targeted-reuse/V2
audit tests, all new regression tests, staged-diff review, and a non-force push
to `origin/codex/jeilgo25-archive-exam`.

