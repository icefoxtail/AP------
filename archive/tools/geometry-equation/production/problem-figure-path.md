# Problem figure production path

This opt-in path replaces an existing problem `image` using the existing exact geometry engine, typesetter, primitive observers and rendered-layout checks. It does not publish an exam or grant a visual quality verdict. The original PNG, source JS and every solution asset remain unchanged during rendering.

Use the normal author plan from `AUTHOR_GUIDE.md`. In the item, add `surface: "PROBLEM_VISUAL"`:

```json
{"sourcePath":"archive/exams/original/middle/m1/2mid/24_향림중_2학기_중간_중1_기출.js","ordinal":6,"dir":"figure","surface":"PROBLEM_VISUAL"}
```

Run `production/render-plan.mjs --item item.json --plan plan.json --out <new-out-directory>` as before. The final file is `figure-problem.svg`, with the normal state/result JSON. Omitted surface retains the existing solution identity, slot, capture checks and `figure-solution.svg` output. Invalid surfaces are refused. Problem mode refuses `--packet-dir`, which belongs to the solution inverse-observation protocol.

The caption and optional accessibilityDescription describe only information already shown in the source problem. Do not append an answer, derived length, solution aid or conclusion. An author and an independent reviewer must compare the actual source PNG, question and final SVG/PNG. Machine geometry and typography checks do not establish that a figure contains only the givens. The solution author's convention of ending a caption with the answer does not apply here.

The problem APIs in `construction-archive-capture-v1.mjs` are `measureProblemTypographyPolicy` and `captureProblemCandidate`. The existing solution APIs continue rejecting problem identities. The problem APIs require a problem identity and an existing source `image`; they reject solution identities. Only `image`, `imageSize` and `imageAlt` may differ in the temporary candidate bank. Canonical comparison protects every other target field and every field of every other question, including answers, solutions and solution image metadata.

Problem measurements use actual `.q-image-wrap` slots in `mode=exam&archive2Context=archive2&fit=screen`. They do not apply solution SVG sizing helpers or solution container measurements. The renderer requests `full` by default; the capture APIs accept the existing four common profiles. Problem-only `half`/`tall` profiles are outside this contract.

Before composition, real browser probes measure desktop 1440×1000, phone 390×844 and tablet 768×1024. The actual raw observation with the smallest scale for the requested profile supplies the typography policy. All three raw rows and matrices are retained, and policy validation re-reads them. The final capture renders all three viewports, checks the actual image/JS response SHA, source parity, problem slot, absent solution DOM, natural size, profile, expected display scale and layout, and requires every measured label to be at least 11 CSS px. Each viewport has image/context/page PNG references. No synthetic observation or caller hook is operating evidence.

`ARCHIVE_BOUND` means those technical capture checks passed. `independentVisualReview`, qualification and publication remain `NOT_RUN`; `productionAuthorized` remains false. A browser failure, missing PNG or stale hash cannot become PASS. Never bypass a local browser permission denial. In an environment without browser execution, prepare inputs and use the approved read-only qualification job on its own GitHub runner.

## Hash-bound manifests and the read-only CI job

The workflow `geometry-publication-tests.yml` adds a PR job while preserving the legacy job on all its original events. The new job validates inputs, runs targeted isolation tests, installs the locked engine runtime, runs the existing solution capture smoke (`M`, `C1`, `Z`) in actual Chrome, then sequentially calls the same production problem renderer. It has `contents: read`, does not persist checkout credentials, and never publishes or pushes.

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
