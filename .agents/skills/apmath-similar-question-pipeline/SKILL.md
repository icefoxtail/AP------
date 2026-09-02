---
name: apmath-similar-question-pipeline
description: Generate, resume, independently review, render, fail-closed-audit, and locally package APMath archive-based similar Korean math questions or whole exams through the unified four-batch Luna xhigh ALIVE workflow.
---

# APMath ALIVE unified similar-question pipeline

For the bounded universal A/B/C extension, use
`references/universal-runtime-workflow.md`. It defines the Universal IR,
family×transform preflight, mixed-exam planner, and local Run lifecycle. The
universal lane shares the fixed Luna xhigh route and final closure rules but
does not register production Archive output.

Use this skill for ALIVE similar-question production in this repository. This
is the canonical integrated skill. It combines the former staged pipeline and
four-batch comparison lane; do not choose a separate speed lane for ordinary
whole-exam requests.

## Default whole-exam route

For a request such as "2025 Geumdang High School Grade 10 semester exam similar questions",
run the unified staged route from source lock through local packaging. Do not
stop after generation, assembly, or `READY_FOR_MANUAL_REVIEW` when the browser
surface is available. Stop only when the Run reaches a terminal result, an
external blocker is recorded, or the user explicitly asks to pause.

The fixed stage order is:

```text
S00_SOURCE_LOCK
  -> S01_PREFLIGHT
  -> S01A_VISUAL_RECON
  -> S02_ROUND1_GENERATION
  -> S03_REVIEW1
  -> S04_REVISION
  -> S05_REVIEW2
  -> S06_MOTHER_SEMANTIC_FINAL
  -> S07_ASSEMBLY
  -> S08_RENDER_REVIEW
  -> S09_PACKAGE
```

Never interleave generation and review by question. A stage advances only when
all of its current batches are `ACCEPTED` or `SKIPPED`.

## Speed profile without quality reduction

For a normal 22-question whole exam, create four deterministic weighted
batches and dispatch at most four Luna tasks concurrently:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-start --query "<exam> whole similar" --variation-mode QUICK --batch-strategy FOUR_BALANCED --batch-count 4 --json
```

`FOUR_BALANCED` routes visual/solution-diagram, constructed-response, wide,
long, and high-workload questions toward the lightest batch. The planner and
partitions are frozen in the manifest; a resumed Run must reuse that
`batchPlan`. For smaller exams, use the same strategy and omit an explicit
count when four batches would be excessive.

The model route is fixed:

| Work | Route |
| --- | --- |
| First-draft batch generation | `gpt-5.6-luna`, `xhigh` |
| Flagged-batch revision | `gpt-5.6-luna`, `xhigh` |
| Independent review 1 | `gpt-5.6-luna`, `xhigh` |
| Independent review 2 | `gpt-5.6-luna`, `xhigh` |
| State, math gates, assembly, render evidence validation, hashing, packaging | deterministic local CLI/browser checks |

Do not lower Luna below `xhigh`, split into per-question model calls, or switch
to Terra/Sol automatically. Terra/Sol are separate manual-audit choices only
when the user explicitly requests them after the automatic Run.

### Deterministic context cache

Repeated Runs for the same source use the local staged-context cache at
`alive/runtime/context-cache/staged/`. It reuses only an exact hash-bound
combination of source JS, active rule-pack snapshot, reviewed-similar
catalogue, reference-pack policy, and engine versions. On a valid hit it
avoids reparsing the source, rebuilding the full reviewed-example pack, and
re-running source visual reconnaissance. Source bytes, rule hashes, reviewed
catalogue bytes, and every source-visual asset hash are still checked before a
hit is accepted; a mismatch is a cache miss and is rebuilt.

The cache never bypasses source-visual browser inspection, model generation,
independent review, mother final, production-engine render, or final closure.
The full `source/reference-pack.json` remains in the Run for audit, while each
builder receives only its batch-local
`source/reference-pack/bNN.json` to reduce irrelevant input and token use.
Cache files are disposable local runtime data and are not production Archive
content.

## Source and rule contract

Before dispatching any builder:

1. Lock one canonical Archive exam or qKey, source SHA-256, question order,
   score annotations, total score, and common-material relationships.
2. Read the current `docs/rules` canonical master and pipeline/review rules.
   The Run must contain a valid `source/rule-snapshot.json`; it is a routing
   fingerprint, not a substitute for reading the documents listed in its
   `readOrder`.
3. When the request targets H22-C/H22-C2 high-1 production, read
   `alive/05_DESIGN/ALIVE_HIGH1_OFFICIAL_PROMOTION_MATRIX_v0.1.md` and the
   canonical master. Enforce the Run's
   `QUESTION_METHOD_PROFILE_HARD_LOCK` and leave unsupported fixture kinds on
   `HOLD` rather than inventing a method.
4. Use `source/reference-pack.json` only as optional reviewed style/variation
   context. It contains no authoritative answer or solution. Recompute every
   answer independently.

Read these references when operating the indicated route:

- [staged-exam-workflow.md](references/staged-exam-workflow.md): commands,
  reducer order, resume, and batch contracts.
- [model-routing.md](references/model-routing.md): model and blindness rules.
- [docs-rule-mapped-engine-blueprint.md](references/docs-rule-mapped-engine-blueprint.md):
  rule snapshot, variation contract, solution lane, and render closure.
- [student-solution-quality.md](references/student-solution-quality.md):
  student-facing solutionDetail and solution-visual contract.
- [visual-quality-floor.md](references/visual-quality-floor.md): SVG/graph
  `AUTO_PASS`, `MANUAL_REVIEW`, and `NO_DIAGRAM` boundaries.
- [artifact-contracts.md](references/artifact-contracts.md): accepted artifact,
  hash, assembly, and package envelopes.
- [title-and-asset-identity.md](references/title-and-asset-identity.md):
  canonical similar-exam titles, collision suffixes, install-ready asset
  paths, and the identity gate.
- [external-review-package.md](references/external-review-package.md):
  compact original-vs-similar delivery ZIP for external comparison.
- [final-closure-gate.md](references/final-closure-gate.md):
  fail-closed per-question final QA ledger and final ZIP audit.

## Universal variant engine contract and lifecycle tools

The universal A/B/C implementation is introduced behind the existing B route.
The Universal lane remains fail-closed and does not publish anything to the
Archive. `universal-high1-prepare` is the historical fixture-replay lifecycle
bridge; the bounded exact A/B/C adapter is exposed separately and must not be
described as an arbitrary Korean-prose solver.

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-ir-validate --input <universal-question-ir.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py variant-proof-validate --input <variant-proof.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py variant-proof-reduce --input <variant-proof.json> --evidence-ref <evidence-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py family-capability --family <family-id> --transform <transform> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-high1-prepare --run-id <id> --title "<display title>" --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-high1-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B|C --fixture-scope all_structured --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-high1-capability --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-capability --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-geometry-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-geometry-capability --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-quadrilateral-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-quadrilateral-capability --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-probability-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B|C --family-id PROBABILITY_BASIC|PROBABILITY_COUNTING --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-probability-capability --family-id PROBABILITY_BASIC|PROBABILITY_COUNTING --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-prime-factorization-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B|C --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-prime-factorization-capability --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-rational-arithmetic-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B|C --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-rational-arithmetic-capability --json
```

`variant-proof-reduce` is fail-closed: omitting the evidence catalog or
passing an unresolved reference returns `HOLD`, never `VERIFIED_A/B/C`.
`MIXED` is classification-only and remains `UNSUPPORTED/HOLD` until a
dedicated adapter and fixture set are registered.

The canonical curriculum catalog is independently inspectable:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py curriculum-catalog-report --json
```

The catalog covers every unit in the canonical master but does not grant
generation capability. A unit without a registered curriculum adapter,
solver, fixture corpus, review evidence, and render closure remains `HOLD`.
When the planner receives a catalog-only unit, it preserves an explicit
analyzed family if one exists; otherwise it uses `MIXED` and blocks dispatch.

`universal-high1-variant-prepare` runs the real bounded High-1 structured
fixture adapter. Its default `all_structured` scope covers all 57 registered
general/boundary/composite fixtures across the 18 H22-C/H22-C2 units; the
compatibility scope `ordinary_per_unit` keeps one ordinary fixture per unit.
It performs exact recomputation, independent review, A/B/C proof reduction,
solution and SVG assembly, then stops at `S08_BROWSER_RENDER` for actual
browser evidence. Use `A` for numeric mutation, `B` for representation change,
and `C` for the bounded single preprocess/condition-card path.
`universal-high1-capability` records positive and negative evidence per
`family x transform` across the registered fixture scope; its
`ACTIVE_BOUNDED` result is not permission to publish and does not cover
arbitrary prose.

`universal-middle-school-variant-prepare` is the first Phase-5 vertical slice.
It currently covers only the registered M1-03 문자와 식 and M2-03 연립일차방정식
structured fixture corpus. A numeric and B representation variant are
supported; C parameter recovery, arbitrary Korean prose, and all other
canonical units remain `HOLD`. The M2-04 일차함수와 그래프 adapter is exposed
by `universal-middle-school-function-variant-prepare` and
`universal-middle-school-function-capability`; it has six exact fixtures,
mandatory problem/solution `simple_function_graph` SVGs, and the same A/B-only
promotion boundary. After preparation, use the generic
`universal-bounded-finalize` command below to connect actual browser evidence,
package, final closure, and local sealing.
The latest bounded checkpoint is `20260901-middle-equations-a03` / `b03`.
The adapter includes a tested `b=0,d=0` system-equation boundary path and the
student-facing solution remains elimination/substitution only; do not expose
determinant formulas in this lane. The checkpoint review is stored in
`alive/05_DESIGN/ALIVE_UNIVERSAL_VARIANT_ENGINE_FINAL_REVIEW_20260901.md` and
the machine-readable checkpoint in
`alive/05_DESIGN/ALIVE_UNIVERSAL_VARIANT_ENGINE_CHECKPOINT_20260901.json`.

The subsequent M2-04 checkpoint is `20260901-middle-function-a02` /
`20260901-middle-function-b02`; it includes exact value/two-point recovery,
mandatory solution graphs, and a browser-tested guard against implementation
helper text such as `_fmt(...)` leaking into student-facing explanations.

The M2-05 triangle-properties bounded adapter is exposed by
`universal-middle-school-geometry-variant-prepare` and
`universal-middle-school-geometry-capability`. It currently covers six exact
triangle fixtures (angle sum, exterior angle, and isosceles base angles), A/B
only, with mandatory `segment_geometry` problem/solution SVGs. SVG angle labels
must use Unicode `°`; TeX `^\\circ` is reserved for MathJax text and must not
leak into SVG annotations. The authoritative checkpoint is
`20260901-middle-triangle-a03` / `20260901-middle-triangle-b03`.

The M2-05 quadrilateral-properties bounded adapter is exposed by
`universal-middle-school-quadrilateral-variant-prepare` and
`universal-middle-school-quadrilateral-capability`. It currently covers six
parallelogram opposite/adjacent-angle fixtures, A/B only, with mandatory
`segment_geometry` problem/solution SVGs. Rectangle/rhombus extensions and C
parameter recovery remain `HOLD`; the authoritative checkpoint is
`20260901-middle-quadrilateral-a01` / `20260901-middle-quadrilateral-b01`.

The M2-06 similar-figures bounded adapter is exposed by
`universal-middle-school-similarity-variant-prepare` and
`universal-middle-school-similarity-capability`. It currently covers six
exact corresponding-side proportion fixtures, including general, boundary,
composite, and reverse-order inputs. A numeric and B representation variants
are `ACTIVE_BOUNDED`; C parameter recovery and arbitrary similar-figure prose
remain `HOLD`. Problem and solution `segment_geometry` SVGs are mandatory and
must show the correspondence labels and current lengths. The authoritative
checkpoint is `20260901-middle-similarity-a01` /
`20260901-middle-similarity-b01`.

The remaining M2-06 parallel-segment-ratio bounded adapter is exposed by
`universal-middle-school-parallel-ratio-variant-prepare` and
`universal-middle-school-parallel-ratio-capability`. It covers six exact
`DE∥BC` triangle-division fixtures, including general, boundary, composite,
and reverse-order cases. A numeric and B representation variants are
`ACTIVE_BOUNDED`; C parameter recovery and arbitrary parallel-line prose
remain `HOLD`. Problem and solution `segment_geometry` SVGs are mandatory.
The authoritative checkpoint is `20260901-middle-parallel-ratio-a01` /
`20260901-middle-parallel-ratio-b01`.

The M2-07 Pythagorean-theorem bounded adapter is exposed by
`universal-middle-school-pythagorean-variant-prepare` and
`universal-middle-school-pythagorean-capability`. It covers six exact
integer Pythagorean-triple fixtures for finding the hypotenuse from the two
legs, including general, boundary, composite, and reverse-order cases. A
numeric and B representation variants are `ACTIVE_BOUNDED`; C parameter
recovery and Pythagorean application word problems remain `HOLD`. Problem
and solution `segment_geometry` SVGs are mandatory and must show the right
angle marker and current AB/AC/BC labels. The authoritative checkpoint is
`20260901-middle-pythagorean-a01` / `20260901-middle-pythagorean-b01`.

The M2-07 Pythagorean-application bounded adapter is exposed by
`universal-middle-school-pythagorean-application-variant-prepare` and
`universal-middle-school-pythagorean-application-capability`. It covers six
structured ladder-context fixtures where wall height and ground distance form
the two legs and ladder length is the hypotenuse. A numeric and B context
representation variants are `ACTIVE_BOUNDED`; C parameter recovery and
arbitrary real-world word problems remain `HOLD`. Problem and solution
`segment_geometry` SVGs are mandatory and must show the wall, ground,
ladder, and right-angle relation. The authoritative checkpoint is
`20260901-middle-pythagorean-application-a01` /
`20260901-middle-pythagorean-application-b01`.

The M2-08 probability bounded adapters are exposed by
`universal-middle-school-probability-variant-prepare` and
`universal-middle-school-probability-capability`. `PROBABILITY_BASIC` covers
six exact total-outcome/favourable-outcome fixtures and
`PROBABILITY_COUNTING` covers six restricted sample-space counting fixtures;
both include general, boundary, and composite cases. A numeric and B
representation are `ACTIVE_BOUNDED`; C parameter recovery and arbitrary
Korean-prose probability interpretation remain `HOLD`. Both families use
exact `Fraction` recomputation and have no visual dependency, so SVG is
explicitly `NOT_REQUIRED` for this bounded slice. The authoritative
checkpoints are `20260901-middle-probability-basic-a01` /
`20260901-middle-probability-basic-b01` and
`20260901-middle-probability-counting-a01` /
`20260901-middle-probability-counting-b01`.

The M1-01 prime-factorization bounded adapter is exposed by
`universal-middle-school-prime-factorization-variant-prepare` and
`universal-middle-school-prime-factorization-capability`. It covers six exact
natural-number factorization fixtures, including prime-boundary, repeated
factor, composite, and mixed-composite cases. A numeric and B representation
are `ACTIVE_BOUNDED`; C parameter recovery, unregistered application forms,
and arbitrary Korean-prose interpretation remain `HOLD`. The family has no
visual dependency, so SVG is explicitly `NOT_REQUIRED` for this bounded
slice. The authoritative checkpoint is
`20260901-middle-prime-factorization-a01` /
`20260901-middle-prime-factorization-b01`.

The M1-02 rational-arithmetic bounded adapter is exposed by
`universal-middle-school-rational-arithmetic-variant-prepare` and
`universal-middle-school-rational-arithmetic-capability`. It covers six exact
signed-rational addition/subtraction fixtures, including different
denominators, zero results, negative subtraction, and mixed signs. A numeric
and B representation are `ACTIVE_BOUNDED`; C parameter recovery and
unregistered multiplication/division/absolute-value/number-line forms remain
`HOLD`. The family has no visual dependency, so SVG is explicitly
`NOT_REQUIRED` for this bounded slice. The authoritative checkpoint is
`20260901-middle-rational-arithmetic-a01` /
`20260901-middle-rational-arithmetic-b01`.

For `FAST_EXAM`, `STRICT_AUDIT`, `REVIEW_ONLY`, or experimental visual work,
use the corresponding existing reference instead of weakening this default
route.

## Generation and visual lane

Before model generation, run the browser/preview smoke readiness check and
`S01A_VISUAL_RECON`. A source visual must be local, decodable, hash-bound, and
copied under `source/visual/`; remote, embedded, malformed, or unsupported
visuals are fail-closed.

Record readiness before the first model dispatch:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-render-readiness --run <run-id> --file <browser-smoke-evidence.json> --json
```

Each builder returns the student question plus `solutionDetail` and, when
needed, a top-level `visualSpec` or `solutionVisualSpec`. New `choices` contain
content only; the Archive renderer owns `1-5` numbering. Never copy the source
image or source solution image into the generated student payload.

The visual path is:

```text
mathematical data/checks -> Visual Spec -> deterministic SVG -> production browser
```

Require mathematical correctness, semantic completeness, readable labels/no
clipping, deterministic asset/spec/report hashes, and browser rendering. Circle,
line, tangent, contact point, chord, perpendicular, center, radius, or related
area questions require a separate solution-role diagram with only the relations
used in the solution. Do not add decorative or answer-revealing geometry.
Functions, inequalities, conics, and calculus diagrams are production-active
only when their capability report, deterministic checks, fixtures, and browser
evidence satisfy `visual-quality-floor.md`; otherwise use `MANUAL_REVIEW` or
`NO_DIAGRAM` and hold any essential visual.

## Review and correction loop

### Round 1

Dispatch one independent reviewer per completed batch. The reviewer receives
the student payload for an independent answer calculation and a separate
solution view for the student walkthrough. Do not expose the builder's private
plan, intended answer, sibling output, or previous reviewer reasoning.

The review must check:

- independent answer and distractor correctness;
- canonical curriculum/subunit and allowed method;
- anti-clone variation and source fidelity;
- `solutionDetail` readability, step reasons, theorem justification,
  verification, common mistakes, and student reproducibility;
- problem/solution visual semantic consistency and required SVG evidence.

### Revision and round 2

Revise only batches with findings. Batches without findings pass through as
`SKIPPED`. A contract-only failure uses the bounded recovery command and keeps
the original failed evidence. Then run a second independent review over the
complete revised set, not only the changed questions.

The final solution contract requires, for every question, `given`, `goal`,
`keyIdea`, `conceptNote`, two or more meaningful steps (three or more when a
solution diagram is mandatory), `check`, `commonMistakes`, and correct
`solutionQuality` evidence. A single missing or contradictory student
walkthrough keeps the whole Run out of final PASS.

Before assembly, the deterministic postprocessor runs three additional gates:

- `exact_verifier`: applies only to recognized arithmetic-safe families and
  blocks an exact conflict; unsupported families remain dependent on the
  independent reviewer and are recorded as `NOT_APPLICABLE`.
- `metadata_finalizer`: removes stale original-exam provenance tags from
  similar output and reports a semantic mismatch between the generated stem
  and `questionType` as a hold condition.
- `serialization_lint`: safely normalizes raw `<`/`>` inside existing math
  delimiters. It never guesses missing delimiters or rewrites an ambiguous
  mathematical expression; those cases fail closed.
- `methodPolicy`: applies the canonical unit's curriculum-method contract;
  for example, an answer that explicitly uses a binomial-to-normal
  approximation must show the continuity correction. Unsupported method
  families are not silently accepted as verified.

### Mother final

The mother gate aggregates all 22 question results and must see:

- 22/22 solutionDetail and student-walkthrough passes;
- method-lock and curriculum checks;
- required solution visual existence, role separation, hashes, topology,
  labels, and determinism;
- no unresolved review findings.

The mother does not edit accepted artifacts. If it fails, repair only the
bounded affected batch and repeat the permitted review path. For a held Run,
an explicit user request to continue permits exactly one
`adaptive-staged-correction-start` pass; unresolved findings after that remain
held.
Do not create an unbounded regeneration loop.

## Dispatch, resume, and interruption safety

For every task, record the external id and Luna route before launch:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-dispatch-start --run <run-id> --task <task-id> --external-id <external-agent-id> --route gpt-5.6-luna/xhigh --json
```

The agent must write an attempt-bound
heartbeat at start, after loading rules/visual context, after each assigned
question, and immediately before the inbox artifact. Accept a task only after
its completion marker and `adaptive-staged-mark-complete`; then call reconcile.

On interruption:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-status --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-resume --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-reconcile --run <run-id> --json
```

Only when the status is `MANUAL_REVIEW_REQUIRED` at a supported correction
stage and the user explicitly asks to continue, run one bounded correction
cycle:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-correction-start --run <run-id> --json
```

Use the manifest's current queue and frozen `batchPlan`; never reconstruct
batches from question count. `agent thread limit reached` is backpressure:
close completed tasks, reconcile, and continue the same stage. The watchdog
may return only stale dispatched tasks with no valid artifact/heartbeat to
`PENDING`, recording `AGENT_STALE_TIMEOUT`. Dispatch retries and artifact
retries have separate bounded budgets. Do not accept a pre-dispatch inbox file
or abandon a Run merely because a dispatch call returned a capacity error.

## Render and local package closure

Before assembly for a similar-exam output, apply the title and asset identity
reference. Legacy/untyped output uses the source basename plus `_유사`; an
occupied legacy identity receives the lowest unused `_유사2`, `_유사3`, ...
suffix. New universal output must include its explicit class:
`_유사A`, `_유사B`, or `_유사C`. A repeated output in the same class receives
the lowest unused class-local suffix, such as `_유사A2`; do not create
`_유사1` or `_유사A1`. A/B/C numbering is independent. Existing untyped and
legacy names are preserved and never silently reclassified. Do not overwrite
an existing packaged identity or leave the human display title as the
machine/path identity. Every final
`image`, `visualAsset`, and `solutionImage` reference must resolve to the same
identity directory and exact packaged asset hash. A post-run canonicalization
must create a separate derived package and preserve the original closed Run.

When canonicalizing a class-aware result, pass
`similar-package-canonicalize --variant-class A|B|C`; the resulting class token
must also appear in `window.examTitle`, the JS basename, asset directory, and
`final/identity-manifest.json`.

After mother final and assembly, Codex must open the actual production
`archive/engine.html` through the preview server in a real browser when the
browser surface is available. Record evidence for all three modes:

- `exam`: top/middle/bottom coverage and last question;
- `solution`: all required solution SVGs, MathJax, labels, clipping, overflow,
  and last question;
- `answer`: one-page order and last answer.

Final render PASS requires `actualBrowser=true`, `productionEngine=true`, no
render error, zero unrendered math, zero checked overflow, no broken images,
last-question coverage, and `solutionVisualCoverage.missingOrdinals=[]`. If
browser evidence cannot be produced, report `BLOCKED` or the appropriate held
state; do not call the Run production PASS.

Render completion must be detected by polling for the expected last question
and last page in each mode, not by assuming that a fixed sleep rendered the
whole document. A screenshot of only the first few questions is incomplete
evidence. If the render gate reveals a formatting defect such as an exact
fraction, coordinate sign, or missing math delimiter, fix the generator or
normalizer and rerun the affected Run through render and closure; never patch
only the screenshot or final HTML.

Package locally only:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-assemble --run <run-id> --title "Generated exam" --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-record-render --run <run-id> --file <render-evidence.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adaptive-staged-exam-package --run <run-id> --json
```

`adaptive-staged-exam-package` is not complete unless it also creates and
records a PASS compact external-review package. The package operation must
fail closed when the external-review ZIP is missing, cannot be opened, has no
`original/` or `similar/` lane, contains anything other than `.js`, `.svg`, or
`.png`, or is not written under `alive/runtime/results/`. Do not report S09
PASS from an internal evidence ZIP alone.

### Delivery path and session handoff

The Run directory is an internal workdir, not a user-facing upload location.
Never link or hand off a ZIP directly from
`alive/runtime/{runs,staged-runs,adaptive-staged-runs,fast-runs}/<run-id>/`.
That deep path may not be mounted into the session file index even when the
ZIP itself is valid.

For a deliverable package, omit `--keep-workdir` so the package command
finalizes the Run, verifies the ZIP, copies the compact result to
`alive/runtime/results/`, writes the result summary, and moves the verbose
workdir to quarantine. Use `--keep-workdir` only for active debugging; after
debugging, run `runtime-finalize` before giving the user a file link.

The external-review ZIP has a separate handoff rule: write its `--output`
directly under `alive/runtime/results/`, not under the Run's `final/` folder.
Link only that result-root file. Keep the internal Run ZIP, canonicalized
similar package, and external-review ZIP as separate files. The ZIP codec is
not the session handoff mechanism; `ZIP_DEFLATED` with CRC round-trip PASS is
the normal format, and a visibility failure should be diagnosed as a result
path/indexing failure before changing compression.

When emitting a local Markdown file link, use the normalized absolute path with
forward slashes (`C:/.../alive/runtime/results/...zip` on Windows). Do not
expose a backslash path, a `file://` URI, or a deep Run path to the session
indexer.

### Git boundary and retention

`alive/runtime/` is a disposable execution boundary, not a production Archive
boundary. It contains Run workdirs, evidence, render caches, manifests,
summaries, internal ZIPs, and compact external-review ZIPs. Keep that entire
tree out of Git; a result-root ZIP is retained only long enough for session
handoff or manual external review. Do not re-include `alive/runtime/results/`
in `.gitignore`.

Never extract a result ZIP into the repository or into
`alive/runtime/results/<name>/`. Inspect it in a temporary directory outside
the repository, then remove or quarantine the extracted copy. The only files
eligible for production promotion are the approved final question `.js` and
the referenced final visual assets (`.svg`, `.png`, or `.jpg`) under the
canonical `archive/` locations. JSON, Markdown, logs, reports, manifests,
source scans, ZIPs, and extracted evidence remain runtime/temporary artifacts.

Before reporting completion, check `git status --short --untracked-files=all`
and confirm no runtime or temporary inspection path is visible. A clean Git
boundary does not replace the external-review requirement: the compact
external-review ZIP must still be created and handed off from the ignored
result root.

If a closed local package needs identity normalization, create a derived
install-ready package without rewriting the original Run:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py similar-package-canonicalize --input <old-zip> --output <canonical-zip> --source-file <source-js> --display-title "<human title>" --json
```

For external comparison, create a separate two-lane package containing only
the original JS/assets and similar JS/assets:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py similar-package-external-review --input <canonical-zip> --output <external-review-zip> --source-file <original-js> --json
```

The package has `original/archive/...` and `similar/archive/...` roots, keeps
the original asset format, and is not a production registration.
Write `<external-review-zip>` directly to `alive/runtime/results/` for the
session handoff. Before delivery, verify the result-root file exists, its ZIP
round-trip passes, and every member extension is `.js`, `.svg`, or `.png`.

Before declaring any final PASS, run the final closure audit on the final JS or
ZIP. It requires one independent-review row per question, including separate
`math` and `solutionArithmetic` statuses, plus final exam/solution/answer
browser evidence and resolved external findings:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py final-closure-audit --input <final-zip> --js-path <optional-zip-js-member> --review-ledger <review-ledger.json> --render-evidence <final-render-evidence.json> --external-findings <external-findings.json> --output <final-closure-report.json> --json
```

For a universal A/B/C Run, add `--variant-proof-ledger
<variant-proof-ledger.json>`. When supplied, final closure requires
`variantProofLedgerComplete=PASS` plus one `variant` row per question with
`VERIFIED_A`, `VERIFIED_B`, or `VERIFIED_C`; the legacy/B-only route remains
compatible when this optional ledger is omitted.

For the deterministic High-1 bridge, after the real browser has produced the
three-mode evidence, the remaining package → legacy closure → Universal S09A
→ local seal loop can be executed in one operation:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-high1-finalize --run <run-id> --render-evidence <render-evidence.json> --review-ledger <review-ledger.json> --external-findings <external-findings.json> --json
```

This command retains the legacy `ALIVE_FINAL_CLOSURE_AUDIT` and its hash inside
the Run. A non-PASS legacy gate leaves the Run held and prevents sealing.

For a bounded non-High-1 adapter, the shared finalizer uses the same
fail-closed legacy audit projection and local seal:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-bounded-finalize --run <run-id> --render-evidence <render-evidence.json> --external-findings <external-findings.json> --json
```

The bounded finalizer reads the Universal Review2 evidence, projects it into
the final closure ledger, runs Node/static/exact/package/browser/external/
variant gates, and seals only on complete PASS. It does not publish to the
production Archive.

The command is fail-closed: any missing, `WARN`, `NOT_TESTED`, or `FAIL` cell,
unresolved external finding, missing asset, or unverified browser mode blocks
final PASS. It validates and reports; it does not silently repair a question.

The staged/adaptive package command also runs this closure automatically and
writes `final/final-closure-report.json` plus
`final/final-review-ledger.json`. A package may remain a local draft while
external review or browser evidence is pending, but any internal question,
metadata, serialization, exact-verifier, or asset failure blocks packaging.
Only a closure report with `productionSeal=PASS` is eligible for production
publication, which still requires separate user authorization.

Never register or mutate the production Archive unless the user separately
authorizes publication after reviewing the local package.

## Run quality closure and retention

Every terminal Run is a quality experiment. Before the next Run:

1. Freeze the manifest, evidence, external-agent history, and package.
2. Report correctness, curriculum, solution pedagogy, visual fidelity,
   orchestration, latency, dispatch/token failures, unresolved findings, and
   comparison with the prior Run.
3. Apply bounded engine/skill improvements on a separate change surface;
   never rewrite a closed Run or silently promote a finding to PASS.
4. Run relevant deterministic fixtures and render regressions. Record
   `NO_CHANGE` or `DEFERRED` when appropriate.

Runtime workdirs are disposable. Keep only the compact result ZIP/summary in
`alive/runtime/results` long enough for handoff; do not commit them and do not
leave extracted copies there. Use `--keep-workdir` only for active debugging.
For a deliberately closed failed Run, finalize and inspect cleanup before
applying it:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py runtime-finalize --runtime-kind adaptive --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py runtime-gc --json
```

`runtime-gc` is dry-run by default and must protect active/held Runs.

The M1-05 basic-geometry bounded adapter is exposed by
`universal-middle-school-basic-geometry-variant-prepare` and
`universal-middle-school-basic-geometry-capability`. It covers six exact angle
classification fixtures and six line-pair position-relation fixtures. A
numeric and B representation are `ACTIVE_BOUNDED`; C parameter recovery and
unregistered geometry relations remain `HOLD`. Both families require
`segment_geometry` SVG in problem and solution, including a visible angle or
parallel/perpendicular marker, and must be checked in the actual browser. The
authoritative checkpoint is `20260901-middle-basic-geometry-a03` /
`20260901-middle-basic-geometry-b03`.

The M1-06 polygon/circle/plane-measure bounded adapter is exposed by
`universal-middle-school-polygon-circle-measure-variant-prepare` and
`universal-middle-school-polygon-circle-measure-capability`. It covers six
polygon interior-sum, six circle area/circumference, and six rectangle
area/perimeter fixtures. A numeric and B representation are
`ACTIVE_BOUNDED`; C parameter recovery and unregistered composite-figure
interpretation remain `HOLD`. All three families require visual evidence:
polygon and rectangle use `segment_geometry`, circle uses proportion-preserving
`circle_geometry`, and solution diagrams must match the exact formula used.
The authoritative checkpoint is `20260901-middle-m1-06-a02` /
`20260901-middle-m1-06-b03`. For solution mode, wait for `renderReady=true` and
the last question instead of relying on a short fixed delay.

The M1-04 coordinate-plane bounded adapter is exposed by
`universal-middle-school-coordinate-plane-variant-prepare` and
`universal-middle-school-coordinate-plane-capability`. It covers six exact
point-location fixtures spanning all four quadrants and the x/y-axis boundary
cases. A numeric and B representation are `ACTIVE_BOUNDED`; C parameter
recovery, line-equation/translation extensions, and arbitrary coordinate-plane
prose remain `HOLD`. Problem and solution `coordinate_plane` SVGs are
mandatory and must be confirmed in the actual browser. The authoritative
checkpoint is `20260901-middle-coordinate-plane-a01` /
`20260901-middle-coordinate-plane-b01`.

The M1-07 solid-figure bounded adapter is exposed by
`universal-middle-school-solid-figure-measure-variant-prepare` and
`universal-middle-school-solid-figure-measure-capability`. It covers six exact
cube-total-edge-length fixtures and six rectangular-prism-volume fixtures. A
numeric and B representation are `ACTIVE_BOUNDED`; C parameter recovery and
unregistered surface-area/solid-figure types remain `HOLD`. Both families
require `segment_geometry` wireframes in problem and solution, with the
dimension labels used by the exact solver. The authoritative checkpoint is
The initial checkpoint `20260901-middle-m1-07-a01` /
`20260901-middle-m1-07-b01` is historical only because its sealed manifest
render SHA did not match the retained evidence file. Do not use those Runs as
current authority. The authoritative replacement is
`20260901-middle-m1-07-a02` / `20260901-middle-m1-07-b02`; it was re-rendered
in the actual browser, visually reviewed, sealed, packaged, and resumed.

The M1-08 data-organization and interpretation bounded adapter is exposed by
`universal-middle-school-data-variant-prepare` and
`universal-middle-school-data-capability`. It covers six exact frequency-total
fixtures and six exact mean fixtures. A numeric and B representation are
`ACTIVE_BOUNDED`; C parameter recovery and unregistered distribution
interpretation remain `HOLD`. Problem and solution `table` visuals are
mandatory and must be checked for readable rows, columns, and result rows in
the actual browser. The authoritative checkpoint is
`20260901-middle-m1-08-a03` / `20260901-middle-m1-08-b02`. The generator must
include source values in the student-facing text and reject duplicate A
mutations before assembly.

For Phase 6 whole-exam planning, use `universal-plan` with an input object
containing `questions`, optional `targetClasses`, `targetClassRanges`,
`plannerPolicy`, and `schoolProfile`. The planner records source difficulty,
structure, question-type, visual, and constructed-response distributions. It
preserves source anchors and never silently substitutes an unsupported class;
range or workload violations remain `HOLD`.

For the Phase 7 final loop, run
`universal-phase7-audit --run <id> --run <id> --json`. It is fail-closed and
checks every lifecycle stage, actual production-browser evidence for exam,
solution, and answer, last-question coverage, variant ledger, package SHA/CRC,
legacy closure, and `NOT_PUBLISHED`. Only `PASS_ACTIVE_BOUNDED` is a local
bounded promotion result; it is not production Archive publication.

The final authoritative Phase 7 audit is
`alive/05_DESIGN/ALIVE_UNIVERSAL_VARIANT_ENGINE_PHASE7_AUDIT_AUTHORITATIVE_20260901.json`.
It covers 35 explicitly selected latest Runs and must report 35/35 PASS. Older
superseded Runs may remain as immutable diagnostics, but they must not be mixed
into the active authority set when an integrity replacement exists.
