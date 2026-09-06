# Logic Visual Qualification Phase 1

This directory implements the qualification-only infrastructure required by the
집합·명제 Semantic Overlay v1.4. It does not rewrite or mass-edit production
집합/명제 questions.

## Execution order

```text
node verify-rule-preflight.mjs
node build-target-inventory.mjs
node emit-v1-source-only-bundles.mjs
node emit-v2-artifact-only-bundles.mjs
node freeze-v1-evidence.mjs
node freeze-v2-evidence.mjs
node extract-v2-observed-facts.mjs
node compute-c-denominator.mjs
node freeze-c-denominator.mjs
node invalidate-c-denominator.mjs
node test-logic-visual-audit.mjs
node run-mutation-qualification.mjs
node audit-visual-structure-duplicates.mjs
node verify-item-semantic-parity.mjs <expected.jsonl> <observed.jsonl>
node build-qualification-report.mjs
```

The first phase deliberately leaves the C denominator `UNFROZEN` until an
independent V1 visual triage adjudicates every target. The current report is
therefore an infrastructure-readiness report, not a production release or
Common Core C PASS.

The V1 bundle excludes answer, solution, solutionImage, builder facts, and
previous verdicts. The V2 bundle contains only artifact identity and bytes/hash
metadata. Semantic parity is calculated through the typed schema and the fixed
projection specification in `specs/`.

## Current Phase 2 operating contract

The reusable implementation is now [`../pipeline-core/README.md`](../pipeline-core/README.md).
New typed parity uses `APMATH_VISUAL_FACT_v2`; v1 reports are preserved rather
than guessed into a migration. The adaptive validator requires manifest,
inventory and registry files, and an optional new `--out` report. The native
final command requires `--closure-manifest`; it no longer chooses filenames
containing final or infers semantic PASS from render UID coverage.

Use `docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md` as the current batch
authority. The legacy five-question document is a compatibility reference only.
New batches require a canonical manifest, UID/revision lineage, separate V1/V2
blind bundles, typed fact evidence, dependency-closure C denominator, desktop and
mobile render evidence, and the fail-closed final gate. A report or UID existing
alone is never sufficient for PASS.

Useful hardening checks:

```text
node validate-phase2-adaptive-batch-manifest.mjs <manifest> <inventory>
node validate-phase2-canonical-registry.mjs
node validate-phase2-evidence-contract.mjs
node validate-phase2-fail-closed-gate.mjs
node validate-phase2-blind-calibration-bundles.mjs
```

If fresh blind provenance, mobile render evidence, or independent math evidence
is missing, the next-batch gate remains BLOCKED. Do not promote legacy evidence
to fresh-blind PASS by copying expected facts into observed facts.
