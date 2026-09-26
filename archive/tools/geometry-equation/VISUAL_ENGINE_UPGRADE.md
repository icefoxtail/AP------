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
