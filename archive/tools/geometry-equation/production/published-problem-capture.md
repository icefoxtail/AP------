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


## Published transfer provenance v2

`capturePublishedProblemManifest` now requires the actual PR merge snapshot (`GITHUB_BASE_REF=main`, exact first parent CI base). The source/companion/19 SVG inputs and all existing viewport, reader, font, glyph, geometry and protection checks remain unchanged. The author renderer and solution/default capture do not opt in to this transport observer.

Only this published capture calls `recordArchiveEvidence` with `publishedResponseEvidence:true`. Its local HTTP server observes the exact Buffer passed to `res.end`, stores one content-addressed `.bin` body per SHA-256 under the published run, and records the actual finish/close/abort outcome. A random response ID is sent in `x-geometry-published-response-id` and independently read by the browser response listener. Every browser/server response must correlate one-to-one by ID, URL and status, and every transfer must be complete. Browser body hashes, when available, must exactly match server bytes. The existing CDP error is retained verbatim; only the observed `question_metadata.json` inspector-cache eviction is typed as a separate header-correlated completed server-send observation. No browser SHA/byte field is filled in. Unknown errors, missing IDs, incomplete/aborted transfers, mismatches and unmatched inventory fail closed.

A finished server body must bind to the captured tree's exact Git blob ID (including the Git blob length header), byte length and SHA-256. This permits exact actual artifact bytes to populate only a new isolated object store when a local Git blob is absent; it never substitutes a stale working-tree file. The generated accessibility index is distinct: its actual server Buffer must equal two executions of the original captured Git generator in a new isolated Git repository with the original CI base/scope. No explicit `--base` mode or edited payload is accepted. The complete source JS roster, all generator-read SVG/code/manifest inputs, and changed-source baseline bytes are captured with their exact tree blob IDs. Unselected tracked files stay explicit skip-worktree entries in that isolated index; the original full captured tree/index and all read inputs retain exact identities. Shared refs, source working files and source object storage are not written. The isolated `.git` is removed after proof, leaving byte-bound input snapshots and the reproduction proof in the private artifact.

The maintained verifier rereads complete transfer evidence and verifies the stored reproduction output and every input snapshot against the captured tree. Final v2 readback independently reruns the original generator again from those exact artifact inputs in another isolated Git repository. A stored `EXACT_REPRODUCTION` string alone is insufficient. `READ_ONLY_PUBLISHED_CAPTURE_v2` records the new reproduction ref; pre-v2 captures without the new actual transport/projection evidence are rejected, including the original Run 15. Run 15's missing values are not repaired or converted to PASS.

These are private technical provenance artifacts. Original source banks, metadata and other banks' accessibility descriptions must not be added to the blind source/SVG/captures review index. Actual display/source/UI quality remains a separate review, and no new actual Chrome result is implied by unit tests.

Published captures prepare their actual DOM/CSS font-observer session on the new `about:blank` page before either producer or reader navigation, and reuse that same session for the unchanged platform-font reads. The raw row and font observation retain the identical session ID, completed DOM/CSS enable order, pre-navigation URL, completed probe/UI font-read status and actual detach outcome. A wrong, late, reused, missing or incomplete session fails. Author/solution/default font observation keeps its existing lifecycle and output shape. This instrumentation change addresses the observed Run16 trailing duplicate CSS requests as a hypothesis; only a fresh official capture can establish its effect. Every server send still requires its actual correlated browser observation, including any extra CSS sends; no resource is dropped or treated as a fabricated request-client observation. Run16 remains failed.
