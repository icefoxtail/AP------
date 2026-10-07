# Construction & Visual Production — Phase 0–2

This is an experimental local engine. No ACTIVE, Seal, full qualification,
PUBLICATION_READY, production asset write, or main merge is granted.

## Run

Use the existing Node/Python/Chrome and authenticated Codex AppServer runtime.
Install the pinned spike dependencies only under generated output. Supply the
actual parent/current SOURCE_EXAM_ID_REGISTRY_v1; the engine does not mint it:

```powershell
node archive/tools/geometry-equation/production/setup-spikes.mjs
node archive/tools/geometry-equation/production/run.mjs --question-uid '<canonical UID>' --source-registry '<current parent registry path>'
```

The UID entry goes through `resolveQuestion()` and the bound current registry.
Missing authority yields INPUT_REQUIRED, even if filename search finds the bank.
Retired/stale mappings fail; an old engine-generated scoped registry cannot be
used as canonical authority. Explicit `--experimental-locator` permits the
physical experiment, but only EXPERIMENTAL_LOCATOR_COMPLETE, never
PHASE2_SLICE_COMPLETE or ACTIVE authority. The old three real-UID results were
locator experiments, not canonical UID closure.

Solution and condition review now use SOURCE_ONLY → committed BLIND_FREEZE →
COMPARE_ONLY contexts. Stored answer/solution and proposed plan are disclosed
only after the immutable decision is read back. Missing images, failed blind
decisions or non-durable freeze prevent comparison. Compare cannot rewrite the
frozen answer/inventory. Planner and final visual review have separate contexts.
The continuation extends the existing AppServer adapter;
it creates no AI service, credential provisioner or separate final-audit job.
The provider's configured/default model and actual context/turn identity are
recorded. Failed/unsupported provider calls and schema/math/render failures
remain UNRESOLVED. Failed artifacts and reviewer defects are preserved.

A frozen result can be replayed without re-planning or editing facts:

```powershell
node archive/tools/geometry-equation/production/run.mjs --question-uid '<same canonical UID>' --source-registry '<current parent registry path>' --resume '.tmp/archive/<run-id>/<examUid>/visual-engine/production/stages/RESULT/<key>/result.json'
```

Replay checks current UID authority, raw source/image refs, Node plan hash and
both verification lineages. Source/answer/solution/policy/provider closure changes
invalidate solution verification and require fresh blind/compare. Legacy unblinded
receipts cannot qualify. Calculation bytes may be cached; reconstruction, captures and
final review are fresh. The `--request` entry is a bounded synthetic
VISUAL_SPIKE_PLAN_v1 math-contract runner, not the full real-UID workflow.

## Execution and evidence

- Node pipeline-core canonical is the only new object-hash authority. Python
  binds the UTF-8 canonical blob bytes, not a parallel canonicalizer. Wire keys
  must already be NFC; values are normalized by the existing Node authority.
- Exact integer/rational/expression inputs are typed strings/trees, never
  executable SymPy/CindyScript strings. Numeric bounds/depth/output/timeout
  failures do not become PASS.
- Legacy GE object hashes and collector bare raw-file hashes retain their own
  semantics. New `{path,bytes,sha256}` refs are separate.
- Asset identity is stable UID + surface + semantic visual role. Revisions use
  independent plan hashes. Math keys exclude label/display and observer changes.
- Committed outputs are generated-only, locked, hash-checked and exposed by a
  same-volume staging-directory rename after the immutable manifest is written.
  Partial staging and a leftover crash lock are not cache/ready authority. A
  hard-crash lock needs verified owner/process reconciliation, not age deletion.
- Provider traces and the existing collector's intermediate files live in a
  request journal. Only committed stage manifests enter result closure.
- The one controller allows at most three schema/source-plan/layout repairs and
  detects identical input/action/output cycles. Frozen replay reloads its existing
  repair ledger and refuses to reset a missing ledger. One measured-fragment
  relocation action is supported for owner-bound point-name/coordinate labels when
  their default search has no candidate; the action binds label policy, exact point
  markers, measured box, owner-safe corners, and the final SVG. This path is proven
  on a controlled fixture only. Other late layout/render defect classes remain
  explicit; a general per-candidate repair controller is not implemented.

The fragment profile uses measured MathJax paths and pinned Noto Sans KR
outlines. Its 12-unit outer label margin is distinct from the legacy 32-unit plot
margin; legacy publication bytes/profile remain unchanged. Required axis ticks
keep their coordinate alignment and are placed before auxiliary equation labels.
Source metric labels use the existing LENGTH_LABEL path with typed unit suffixes.
The actual CSS font floor is 11px. Phase 3 resolves the current Archive `.sol-meta`
content box and small/medium/large/full image policy before layout. It captures the
same candidate SVG at every measured image size, binds each label/font/stroke and
topology record to the SVG SHA and browser screenshot, and selects the smallest
profile at or above the requested class that passes. A selected size change is
recorded in the temporary bank overlay. The final Archive check binds the loaded
asset path/SHA, size class, image rectangle and `.sol-meta` content width. Real
source profile slices are locator-only until the canonical v2 UID authority exists.

The unchanged Archive `mode=sol` renders a source text reminder, answer, solution
image and solution; choices/problem images belong to exam mode. Candidate bank
parity checks protect original content/choices/answer/solution/image fields.
Review receives source pixels plus final image and native solution-block captures.

## Supported spike scope and limits

Main polynomial publication now requires a separately audited
`QUADRATIC_OVERVIEW_v1` frame. Vertex must lie inside the frame, and both arms
must span at least max(40 CSS px, 22% of plot width) horizontally and
max(50 CSS px, 45% of plot height) vertically. These are publication readability
policies, not mathematical error tolerances. Source-required points must remain
inside with margin and be observed on the curve. Mathematical chord/coverage
PASS alone cannot close the overview axis.

`graph_framing.py` fits display bounds without changing the function. A reviewed
`sourceDomain:{kind:'ALL_REALS'}` permits a wider drawing interval; an older
frozen interval is never enlarged by inference. Restricted domains require a
separate context representation and remain unsupported here. Local zoom views
cannot stand in for the main overview. The bounded Phase 4 cubic/quartic
experiment frames exact degree-3/4 rational-coefficient polynomials only when
the source domain is explicitly `ALL_REALS`; it preserves the source domain,
freezes roots/critical points/inflections and tail directions, and fails closed
for repeated roots, restricted intervals, or features below measured display
resolution. Its controlled cubic/quartic Archive fixtures select large and full.

The separate `rational-spike-v1` experiment accepts only exact linear-over-linear
coefficient strings with `sourceDomain:{kind:'ALL_REALS'}` and one simple
denominator root. It preserves the natural denominator exclusion, classifies the
root exactly as one pole or one removable hole, and audits the horizontal
asymptote, visible branches, and final SVG cues. A hole uses a white outlined
marker with a 4 intrinsic px radius and a 4.5 CSS px minimum diameter at the
measured Archive profile. The controlled Archive fixtures select medium for the
pole and large for the hole. Both families remain `EXPERIMENTAL / CONTROLLED
FIXTURE ONLY`; neither establishes real-UID publication support or canonical
qualification.

The separate `sqrt-affine-spike-v1` experiment accepts `sqrt(a*x+b)` with exact
rational coefficient strings and `a>0`. Its source domain is either the natural
nonnegative-radicand domain or an explicit finite closed rational interval whose
lower endpoint is at or above the radicand root. The sampler starts exactly at
the natural boundary, or preserves the closed interval numerically without
expansion. A display-only viewport margin may precede a closed endpoint marker;
the curve is never sampled in that margin. The independent observer checks the
exact endpoint inventory, pre-root exclusion, rightward one-sided increase,
full tail, and closed outlined markers. The final visual-engine spec adds a
deterministic near-boundary critical sample so the independent secant bound stays
at 0.35 CSS px. Actual profile checks require a 48 CSS px endpoint-to-tail span
and a 3 CSS px endpoint marker. The controlled `sqrt(2*x-200)` fixture selects
medium; small is unsupported because the marker measures 2.625 CSS px. General
overview rules for absolute-value, piecewise, exponential, logarithmic,
trigonometric, and mixed panels remain incomplete.

- Construction: source points, closed SSS normalization, midpoint, line through
  points, perpendicular foot, circle radius, circle/circle and line/circle
  intersections with oriented-side selection, distance and scalar square.
  Cindy rebuilds only from source primitives. Selected-point descendants beyond
  scalar calculations, line/line peer intersections, generic constraints,
  scalar node refs and general realization solving are unsupported.
  Cindy is a numeric peer, not an exact proof: integer operands outside ±1e6,
  rational operands outside ±1e9/denominator 1e9, magnitudes outside 1e-9..1e6
  (apart from zero), and sensitive cancellation are UNSUPPORTED. Large exact
  wire values remain supported by the wire format, not by Cindy peer validation.
- Graph verification: bounded rational-coefficient degree ≤4 polynomial;
  rational numerator ≤4/denominator ≤2 on bounded nonsingular segments;
  positive-slope affine sqrt with a boundary secant envelope. Independent root
  isolation/coverage/interior bounds observe final polylines. Subpixel clustered
  root features return UNSUPPORTED, and missing hole markers/pole crossings fail.
  Experimental cubic/quartic framing accepts only all-real degree-3/4 polynomial
  source domains. The distinct rational capability accepts only all-real
  linear-over-linear inputs with one simple real denominator root, classified as
  a pole or removable hole; higher degrees, multiple denominator roots,
  oblique asymptotes, and additional source intervals fail closed. Both routes
  are controlled-fixture-only, not publication-qualified. Trig/log/exp/abs/
  piecewise general compositions and mixed geometry/graph publication remain
  unsupported.
- Typography: the tested inventory includes Korean, fractions, radicals, powers,
  subscripts, prime, pi, degree/unit, entity/product and generated AST precedence.
  General TeX/Korean mixed shaping and a full notation/glyph qualification are
  not claimed.
- Windows/Chrome smoke is verified. Other OS/browser environments and the full
  Geometry ≥6 + Graph ≥4 qualification/Seal are future work.

New run outputs, candidate banks, and SVGs are written only below
`.tmp/archive/<run-id>/<examUid>/visual-engine/production/`. A resumed result
reuses its existing temporary workspace; a fresh invocation receives a new run
ID. The pinned runtime dependencies are cached under `.tmp/apmath-visual-engine/`
and are not Archive assets. Historical `archive/_generated` results are
read-only evidence inputs.
Keep them locally for review. A remote code checkout can reproduce them using
the commands above. The Git branch alone is not the durable evidence archive.
