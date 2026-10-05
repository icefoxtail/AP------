# Construction & Visual Production — Phase 0–2

This is an experimental local engine. No ACTIVE, Seal, full qualification,
PUBLICATION_READY, production asset write, or main merge is granted.

## Run

Use the existing Node/Python/Chrome and authenticated Codex AppServer runtime.
Install the pinned spike dependencies only under generated output:

```powershell
node archive/tools/geometry-equation/production/setup-spikes.mjs
node archive/tools/geometry-equation/production/run.mjs --question-uid '25_효천고_2학기_중간_고1_기출|1'
node archive/tools/geometry-equation/production/run.mjs --question-uid '25_연향중_1학기_기말_중3_기출c|10'
node archive/tools/geometry-equation/production/run.mjs --question-uid '25_삼산중_2학기_기말_중2_기출|1'
```

The UID-only entry locates one unambiguous current original bank, freezes a
scoped SOURCE_EXAM_ID_REGISTRY_v1 using pipeline-core UID v2, freshly verifies
the solution through the existing provider, plans, independently checks source
conditions, executes, reconstructs, typesets, measures, lays out, audits and
captures the actual Archive solution column. Registry ACTIVE means the selected
current source mapping, not an ACTIVE engine capability. Promotion/migration of
this scoped mapping into another parent's canonical registry is outside this
experiment. Explicit existing registry/parent-run resolution is available in
`resolve-request.mjs`; it never promotes an unreviewed solution string.

Source review, planner and visual review use separate provider-issued ephemeral
contexts with no tools. The continuation extends the existing AppServer adapter;
it creates no AI service, credential provisioner or separate final-audit job.
The provider's configured/default model and actual context/turn identity are
recorded. Failed/unsupported provider calls and schema/math/render failures
remain UNRESOLVED. Failed artifacts and reviewer defects are preserved.

A frozen result can be replayed without re-planning or editing facts:

```powershell
node archive/tools/geometry-equation/production/run.mjs --question-uid '<same UID>' --resume 'archive/_generated/geometry-visual-engine/production/stages/RESULT/<key>/result.json'
```

Replay checks raw source/solution/image refs, Node plan hash and accepted source
review binding. Calculation bytes may be cached; reconstruction, captures and
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
- One in-request controller allows at most three schema/source-plan repairs and
  detects identical input/action/output cycles. Unsupported late layout/render
  defects remain explicit; Phase 3's general repair controller is not implemented.

The fragment profile uses measured MathJax paths and pinned Noto Sans KR
outlines. Its 12-unit outer label margin is distinct from the legacy 32-unit plot
margin; legacy publication bytes/profile remain unchanged. Required axis ticks
keep their coordinate alignment and are placed before auxiliary equation labels.
Source metric labels use the existing LENGTH_LABEL path with typed unit suffixes.
The actual CSS font floor is still 11px. Full size is an explicit generated-overlay
policy; the pre-typesetting envelope is policy-bound and not claimed as measured.
Actual image dimensions, glyph bounds and font sizes are checked after capture.

The unchanged Archive `mode=sol` renders a source text reminder, answer, solution
image and solution; choices/problem images belong to exam mode. Candidate bank
parity checks protect original content/choices/answer/solution/image fields.
Review receives source pixels plus final image and native solution-block captures.

## Supported spike scope and limits

- Construction: source points, closed SSS normalization, midpoint, line through
  points, perpendicular foot, circle radius, circle/circle and line/circle
  intersections with oriented-side selection, distance and scalar square.
  Cindy rebuilds only from source primitives. Selected-point descendants beyond
  scalar calculations, line/line peer intersections, generic constraints,
  scalar node refs and general realization solving are unsupported.
- Graph verification: bounded rational-coefficient degree ≤4 polynomial;
  rational numerator ≤4/denominator ≤2 on bounded nonsingular segments;
  positive-slope affine sqrt with a boundary secant envelope. Independent root
  isolation/coverage/interior bounds observe final polylines. Subpixel clustered
  root features return UNSUPPORTED, and missing hole markers/pole crossings fail.
  Real UID publication currently dispatches polynomial only. Trig/log/exp/abs/
  piecewise/general compositions and mixed geometry/graph publication are not
  qualified or enabled.
- Typography: the tested inventory includes Korean, fractions, radicals, powers,
  subscripts, prime, pi, degree/unit, entity/product and generated AST precedence.
  General TeX/Korean mixed shaping and a full notation/glyph qualification are
  not claimed.
- Windows/Chrome smoke is verified. Other OS/browser environments and the full
  Geometry ≥6 + Graph ≥4 qualification/Seal are future work.

All physical outputs are under ignored `archive/_generated/geometry-visual-engine`.
Keep them locally for review. A remote code checkout can reproduce them using
the commands above, but the Git branch alone is not the durable evidence archive.
