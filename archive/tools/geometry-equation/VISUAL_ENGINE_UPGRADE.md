# Geometry visual engine code qualification

Authority: explicit task instructions, code upgrade execution plan v1.1,
integration specification v1.0, then existing visual rules.

All work is on `codex/geometry-visual-engine-upgrade`. Production assets and
exam JS are read only. Run artifacts live in
`archive/_generated/geometry-visual-engine/<runId>/`. This is software
qualification, not question publication, a new GOLD pilot, or FULL PILOT.

## Ownership and boundaries

Lead owns design, implementation, static inspection, failure diagnosis,
repairs, phase decisions, and Git. GPT-6 Luna xhigh runs only explicitly
scoped tests and writes test evidence. Existing independent verifiers stay
byte-identical and do not import builder code.

Python computes canonical geometry and validates semantic claims before
materialization. Numeric values do not imply student display strings.
The composer receives prepared primitives and layout results. Math labels
use a parsed expression tree. Browser measurements decide final collision
status; approximate layout alone cannot grant FINAL_VISUAL.

## Phase order

0 baseline; 1 numeric; 2 semantic; 3 expression tree; 4 sampling/viewport;
5 labels; 6 style/composition; 7 optional TikZ; 8 entrypoints; 9 static and
actual SVG; 10 rendered boxes; 11 actual archive; 12 config/determinism;
13 regression; 14 legacy contract; 15 performance and readiness seal.

Each phase requires implementation, Lead static inspection, Luna result,
physical evidence, a separate commit, and immediate branch push. Failure
evidence is retained on retries. Code readiness requires all mandatory
gates with no unresolved P0/P1; publication still needs the existing
question quality pipeline and independent review authority.

## GOLD inheritance

Reuse numeric line relations, semantic verification, source/derived
separation, aspect policies, and deterministic witness concepts. Rewrite
the regex expression serializer and fixed offset label path. Recompute
item-level unresolved totals: r10 aggregate zero conflicts with three
POLISH_REQUIRED review rows and an archive NOT_RUN defect. Historical
render claims are not current qualification evidence.

## Performance and readiness

The final code seal validates actual artifact bytes, current code test hashes,
protected source inventory, unchanged verifier bytes, 13 isolated fixtures,
26 measured bbox captures, A/B rebuilds, and the full archive mode matrix.
Missing measurements, incomplete coverage, stale files, or synthetic browser
evidence block readiness. Pure builds never replace saved candidates.

Run after the native archive matrix and capture are complete (substitute the
run directory, archive attempt, and bbox receipt for the current job):

```text
python archive/tools/geometry-equation/record-visual-code-tests.py --run <run>
python archive/tools/geometry-equation/measure-visual-build-performance.py --run <run>
node archive/tools/geometry-equation/measure-visual-browser-performance.mjs --run <run> --archive-attempt <attempt>
node archive/tools/geometry-equation/seal-visual-engine-code-ready.mjs --run <run> --archive-attempt <attempt> --bbox-receipt <repo-relative-receipt>
```

Browser dependencies and channel are discovered through the browser runtime
and environment configuration. No personal executable paths are embedded.
Performance is measured after correctness, without inventing a latency budget.

The original v22 production verifier runs in a byte-identical shadow. The
Phase0 baseline already has 99 targets against its fixed historical 94 and
eight raw FAIL rows. Code regression uses baseline input/verifier parity and
retains every raw FAIL. The readiness seal records these inherited findings
outside its code qualification scope; they still block those production rows
from FINAL qualification. Their triage belongs to the subsequent inventory
and FULL PILOT. A code-ready fixture remains BUILD_SIDE_ONLY and cannot grant
question publication authority. Optional TikZ conversion remains draft only.
