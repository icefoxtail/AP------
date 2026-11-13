# Problem figure production path

## Bounded source edge strokes for a problem prism

An uncut, standalone `PRISM` may opt into `problemSourceEdgeStyles: {scope:"PROBLEM_ONLY", sourceImageRef:{path,bytes,sha256}, edges:[{solid:"s1",from:"B",to:"E",stroke:"DASHED"},{solid:"s1",from:"D",to:"F",stroke:"SOLID"}]}`. This preserves a source illustration whose printed stroke convention differs from the fixed orthographic depth test. It does not assert that a source dash was computed as geometric hiding.

The caller must supply a recomputable actual `PROBLEM_VISUAL` identity to `solveSolidFigure`, `solidFigureSpec` and `expandSolidFigure` through their optional `{identity}` argument. Default/solution calls reject this field; the composer checks the same identity before typesetting. Production accepts it only from a standalone solid author plan, not a general composite. The sole internal one-panel solid expansion retains that restriction.

The preserved source must be the exact repository PNG `archive/assets/images/<sourceExamId>/q<ordinal>.png` for that identity. Its path, byte count, SHA and PNG signature are verified in both producer and Python observer. The PNG remains the authority after the student's JS `image` reference is changed to the newly rendered SVG; no dependency on the new SVG path replaces this original byte binding.

At most two existing edges may specify `SOLID` or `DASHED`. Unknown vertices, non-edges, duplicate unordered pairs, mixed visibility runs, overlays (`segments`), helper points, cuts, nets, round solids, multi-solid/grid/space plans, and custom stroke width/colour/dash fields are refused. Original vertices/faces/edges/coordinates and automatically computed depth runs remain unchanged. The original edge primitive is reused at the ordinary engine width. Only opted-in edges carry `data-source-stroke` and `data-computed-vis`; `data-vis` still describes the actual displayed dash.

Python independently re-derives the prism and automatic hiding, checks `data-computed-vis` against that geometry, and separately checks the source declaration and displayed stroke. Edge endpoints, complete coverage, edge inventory, normal width/colour, labels and final rendered layout retain their checks. Default plans preserve their previous model/spec fingerprints and SVG serialization. Real rendering and source-only independent visual review remain required; model/spec tests are not publication evidence. Never copy student's handwritten overdraw weight as a source stroke.

This opt-in path replaces an existing problem `image` using the existing exact geometry engine, typesetter, primitive observers and rendered-layout checks. It does not publish an exam or grant a visual quality verdict. The original PNG, source JS and every solution asset remain unchanged during rendering.

Use the normal author plan from `AUTHOR_GUIDE.md`. In the item, add `surface: "PROBLEM_VISUAL"`:

```json
{"sourcePath":"archive/exams/original/middle/m1/2mid/24_향림중_2학기_중간_중1_기출.js","ordinal":6,"dir":"figure","surface":"PROBLEM_VISUAL"}
```

Run `production/render-plan.mjs --item item.json --plan plan.json --out <new-out-directory>` as before. The final file is `figure-problem.svg`, with the normal state/result JSON. Omitted surface retains the existing solution identity, slot, capture checks and `figure-solution.svg` output. Invalid surfaces are refused. Problem mode refuses `--packet-dir`, which belongs to the solution inverse-observation protocol.

The caption and optional accessibilityDescription describe only information already shown in the source problem. Do not append an answer, derived length, solution aid or conclusion. An author and an independent reviewer must compare the actual source PNG, question and final SVG/PNG. Machine geometry and typography checks do not establish that a figure contains only the givens. The solution author's convention of ending a caption with the answer does not apply here.

The problem APIs in `construction-archive-capture-v1.mjs` are `measureProblemTypographyPolicy` and `captureProblemCandidate`. The existing solution APIs continue rejecting problem identities. The problem APIs require a problem identity and an existing source `image`; they reject solution identities. Only `image`, `imageSize` and `imageAlt` may differ in the temporary candidate bank. Canonical comparison protects every other target field and every field of every other question, including answers, solutions and solution image metadata.

Problem measurements use actual `.q-image-wrap` slots in the official Archive2 output reader. The local-only capture first requests the exact candidate source script, calls `Archive2Output.publishOutputEnvelope`, and navigates to `outputEnvelopeUrl` with its contract version, request ID and owner ID. The strict reader consumes the stored, hash-bound envelope normally. Bare `archive2Context=archive2` on a direct source URL is invalid and is never used as a CSS switch. The raw envelope, candidate source response SHA, exact questions, reader URL and readiness payload hash are bound and re-read. Missing request IDs and another owner remain rejected. No DOM context or reader state is forged. Measurements do not apply solution SVG sizing helpers or solution container geometry. The renderer requests `full` by default; the capture APIs accept the existing four common profiles. Problem-only `half`/`tall` profiles are outside this contract.

Before composition, real browser probes measure desktop 1440×1000, phone 390×844 and tablet 768×1024. The actual raw observation with the smallest scale for the requested profile supplies the typography policy. All three raw rows and matrices are retained, and policy validation re-reads them. The final capture renders all three viewports, checks the actual image/JS response SHA, source parity, problem slot, absent solution DOM, natural size, profile, expected display scale and layout, and requires every measured label to be at least 11 CSS px. Each viewport has image/context/page PNG references. No synthetic observation or caller hook is operating evidence.

`ARCHIVE_BOUND` means those technical capture checks passed. `independentVisualReview`, qualification and publication remain `NOT_RUN`; `productionAuthorized` remains false. A browser failure, missing PNG or stale hash cannot become PASS. Never bypass a local browser permission denial. In an environment without browser execution, prepare inputs and use the approved read-only qualification job on its own GitHub runner.

## Hash-bound manifests and the read-only CI job

The workflow `geometry-publication-tests.yml` adds a PR job while preserving the legacy job on all its original events. The new job validates inputs, runs targeted isolation tests, installs the locked engine runtime, registers the same hash-verified `NotoSansKR.ttf` in the runner's user fontconfig, runs the existing solution capture smoke (`M`, `C1`, `Z`) in actual Chrome, then sequentially calls the same production problem renderer. `setup-problem-browser-font.mjs` verifies installed and fc-match bytes against font SHA `sha256:194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252`, checks Korean glyph coverage, and writes `.tmp/svg-problem/browser-font.json`. Each problem row records actual Chromium CDP platform-font observations for a Korean probe and visible source Korean text, bound to that fontconfig evidence. A local problem run needs the same setup after `setup-spikes.mjs`. No font-size floor is relaxed. The workflow has `contents: read`, does not persist checkout credentials, and never publishes or pushes.

Store a committed manifest below `archive/tools/geometry-equation/ops/problem-figures/<bundle>/manifest.json`. Store its plan files below that manifest's own directory. No absolute paths, traversal, symlinks, external plans, arbitrary commands or unknown fields are allowed. Manifest item names and source targets must be unique. At most 100 items are accepted.

```json
{
  "schemaVersion": "PROBLEM_FIGURE_MANIFEST_v1",
  "items": [{
    "item": {
      "sourcePath": "archive/exams/original/middle/m1/2mid/24_향림중_2학기_중간_중1_기출.js",
      "ordinal": 6,
      "dir": "q6",
      "surface": "PROBLEM_VISUAL"
    },
    "planPath": "q6/plan.json",
    "sourceSha256": "sha256:<64 lowercase hex of source JS bytes>",
    "planSha256": "sha256:<64 lowercase hex of plan file bytes>",
    "sourceImageSha256": "sha256:<64 lowercase hex of original image bytes>"
  }]
}
```

The placeholder hashes above must be replaced with raw byte hashes. Rendering refuses stale source, plan or original image bytes. Only tracked files from the checked-out commit are accepted for execution.

PR execution selects manifest families whose own directory changed in that PR snapshot. It does not automatically re-render unrelated historical manifests after later source metadata changes. Selected manifests are never skipped for a hash mismatch. An engine-only PR reports `NO_CHANGED_PROBLEM_MANIFESTS` and still runs the solution smoke. To rerender a particular old bundle, submit a deliberate manifest revision with current source hashes or use the optional manual `problem_manifest` input for that exact committed path. Manual input cannot choose a command or a URL.

Artifacts `problem-svg-production-<run>-<attempt>` retain `.tmp/svg-problem/` (result/state/SVG, raw input snapshots, commit and manifest/input SHA summaries), `.tmp/archive/` (measurement rows/matrices/screenshots and actual captures), and the committed manifest directory. The runner re-reads evidence hashes and independently checks protected source parity, all three viewport rows and PNGs. CI also checks that `archive/exams` and `archive/assets` have no worktree changes. ROOT performs artifact SHA readback, source/visual review and the separately authorized publication.

Only `captureAtDisplaySize` / `collectRenderedLayout` with the explicit `{surface:'PROBLEM_VISUAL'}` option recursively measures hash-bound composite SVG image panels at the actual Archive display transform. It replays the exact panel bytes in its isolated inspector DOM, checks the native viewport/clip and CTM against the original image, restores the original DOM, and preserves panel-local geometry/bounds checks. Every inner glyph and caption must match the source inventory. Frozen TEXT uses its actual ancestor typeset-font metadata and glyph-path CTM; MathJax uses its font-unit CTM. Raw layout evidence retains those boundaries, panel SHA/matrices and all label rows; the problem readback verifies the complete inventory and font calculations. Default/solution collection, font calculations and analysis output retain the immutable 2180ce31 behavior, with no new inventory gate; composers retain that default. The actual problem Archive target alone opts into the new inspector/readback. No floor, solution API or policy limit changes. Problem author input also requires every displaySegments.refs to contain exactly two endpoints before expansion.

For a source corner-cut cuboid only, `problemSourceEdgeStyles.mode:"RETAINED_CUT_EDGES"` permits at most three `SOLID` display declarations on actual retained edges of one rectangular POLYGON PRISM, one vertex-plane cut, and the resulting 7V/12E/7F model. The original computed visibility remains independently checked. Optional reference points must reconstruct the original removed corner, and any reference segments must be its original incident edges, dashed REF only; arbitrary auxiliary additions are refused. The original PNG path/bytes/SHA remains mandatory. Without this mode the original uncut maximum-two-edge contract is unchanged.

A standalone single solid can opt into `problemCaption:{scope:"PROBLEM_ONLY",visible:false}` in an actual PROBLEM_VISUAL context. The compiler preserves the same exact inner panel and outer title/desc, while omitting the visible caption and its header space. Preflight measures the resulting panel-only natural size; it does not reuse the former caption-bearing policy. Solution/default contexts reject this option; ordinary caption-bearing output is unchanged.
