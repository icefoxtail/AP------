# Read-only capture of exact published problem SVG links (draft)

This path verifies the current static exam JS and the already accepted exact SVG bytes together in the actual Archive reader. It never invokes `renderPlan`, a mathematical solver, a typesetter or a composer, and cannot write operational JS/assets. Its successful result is `READ_ONLY_PUBLISHED_CAPTURE`; `productionAuthorized` remains false, `qualityReview` remains `NOT_RUN`, and preservation of the original asset inventory remains a separate check.

The authored-plan renderer remains unchanged. A companion-free selected manifest reports `PUBLISHED_CAPTURE / NOT_REQUESTED` and the workflow continues to use the existing `runProblemManifest`. An existing but stale or malformed companion is an error; it is never silently ignored in favor of a different path.

## Companion and current manifest

Place `published.json` beside the selected `manifest.json`, within `archive/tools/geometry-equation/ops/problem-figures/<bundle>/`. The companion has exactly these fields:

| Field | Contract |
| --- | --- |
| `schemaVersion` | Exactly `PUBLISHED_PROBLEM_CAPTURE_v1` |
| `manifestRef` | Exact `{path,bytes,sha256}` of the selected current manifest |
| `sourceRef` | Exact `{path,bytes,sha256}` of the single current canonical static exam JS shared by that manifest |
| `items` | Exactly one `{ordinal,svgRef}` per selected manifest item; no extra, missing or duplicate question |
| `items[].svgRef` | Exact `{path,bytes,sha256}` of the accepted SVG now stored at its canonical `archive/assets/images/<exam>/qNN-problem.svg` path |

All schemas are closed, all SHA fields use `sha256:<64 lowercase hex>`, all bytes counts are positive safe integers, and every source/ref path is checked against its required repository scope. External paths, traversal and symlinks (including symlinks inside the repository and dangling companion symlinks) are rejected. There is no shell/command/URL/configuration field.

The current manifest must be updated after canonical linkage: each `sourceSha256` must be the current canonical JS SHA, and each `sourceImageSha256` must be the current linked exact SVG SHA. `loadProblemManifest` validates the plans and every current input first. The companion's `manifestRef` additionally freezes that exact current manifest, preventing an old accepted-SVG list from being silently reused after its plans change.

For every item the current static bank must have precisely the expected `assets/images/<exam>/qNN-problem.svg` image, `imageSize:'full'`, and `imageAlt` equal to the selected maintained plan's `caption` (the same alt contract used by production capture). The companion cannot replace or patch those fields at capture time. The question set must equal the selected manifest; in the Hyangrim publication this means 19 targets in the complete 23-question bank.

The publishing owner creates the companion after storing the reviewed exact SVGs and changing only the authorized canonical JS fields. This helper does not create, update or repair the companion, source or operational SVGs.

## Execution

The fixed entrypoints are:

```sh
node archive/tools/geometry-equation/production/published-problem-capture.mjs --validate archive/tools/geometry-equation/ops/problem-figures/<bundle>/manifest.json
node archive/tools/geometry-equation/production/published-problem-capture.mjs --capture archive/tools/geometry-equation/ops/problem-figures/<bundle>/manifest.json
```

Actual Chromium execution is only for the already approved remote Ubuntu/Chrome qualification environment. Local Chrome remains prohibited in this task. Validation is non-browser. Capture checks that all its inputs are tracked in the checked-out commit. There is no output-directory argument and no caller browser/evidence hook.

The capture writes fresh, immutable snapshots only below `.tmp/archive/<safe-run-id>/<exam>/published-capture/`. It copies the exact current JS, plans/manifest/companion, engine HTML and all 19 current canonical SVGs, without an appended alias or per-question `Object.assign`. Its single source matrix contains all 19 assets in each of these rows:

| Viewport | Actual browser size |
| --- | --- |
| desktop | 1440 × 1000 |
| mobile | 390 × 844 |
| tablet | 768 × 1024 |

The existing `recordArchiveEvidence({blockExternalRequests:true})` performs the real work. Each row uses `mode:'exam'`, the official publish-envelope → request/owner-bound reader, `fit=screen`, local resources and the same hash-verified Korean font. Only the server's canonical asset routes are mapped to the byte-identical temporary snapshots. No student DOM context is forged.

The readback rechecks each of the 57 actual targets: canonical request URL and question source slot, exactly one successful asset response with the exact SHA and byte count, natural dimensions, full size class, wrapper/question containment, exact rendered-container binding, complete source glyph inventory, actual per-label font CTM evidence and 11 CSS px floor, geometry/layout error counts, and the reader/source envelope and Korean font evidence. It also checks the three actual viewport geometries, horizontal overflow, complete question count, all loaded images and absence of solution DOM. Source and asset inputs are hash-checked again after capture.

The result retains raw row/PNG refs, viewport geometry, all target font minima/glyph counts, source/canonical/snapshot refs, matrix/engine/commit binding and the explicit read-only scope. A technical capture success does not replace mathematical/source visual review, accepted-SVG provenance, original PNG/solution-asset preservation checks or permission to publish/merge.

## Proposed workflow change

The accompanying patch preserves `contents:read`, every existing legacy job/step, the original solution M/C1/Z smoke, problem smoke and manifest validation. It adds closed companion validation before browser setup and adds the new non-browser tests. The final bounded step routes a selected family:

- Missing companion: log `NOT_REQUESTED`, then call the unchanged existing `runProblemManifest`.
- Valid companion: call this read-only capture instead of recomposing accepted assets.
- Invalid/stale companion: fail closed.

This routing is necessary because running the old all-item renderer again is a different operation: it measures a new typography policy in the newly linked full-bank layout and may emit different SVG bytes. Identity and label namespaces do not use the current source SHA/run id, but actual scales, 0.1 px policy rounding and layout choices can change after all 19 links are present. The final-link verification therefore captures the accepted exact bytes directly.

The PR must change the companion/current manifest under the selected bundle so that the existing geometry path trigger and bounded PR family selection run. A JS/assets-only PR does not trigger this workflow. The existing artifact upload already includes `.tmp/archive/`, `.tmp/svg-problem/` (including the locked font metadata and raw font), and the maintained problem bundle.

## Draft verification

Unit tests use controlled unit-only JS/SVG data and do not claim real render or quality evidence. They cover 19-item set equality, closed schemas, stale bytes, wrong linked fields, external/traversal/symlink paths, exact snapshots/matrix shapes, altered target response/geometry/font/glyph claims, matrix substitution and prohibited output selectors. The draft is exercised in an isolated copied-source workspace because it has not been installed into maintained code. Actual final-link browser execution remains NOT_RUN until the publication commit is available and this draft is reviewed and adopted.
