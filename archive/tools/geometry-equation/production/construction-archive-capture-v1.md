# Construction archive capture v1

`construction-archive-capture-v1.mjs` closes two gaps between the L1 candidate SVG (`construction-candidate-svg-v1`)
and the real Archive, with no provider and no change to any shared tool:

1. `measureArchiveTypographyPolicy` measures the real `archive/engine.html` `mode=sol` display size of one question's
   solution image and turns it into the `REQUESTED_PROFILE_TYPOGRAPHY_v1` policy L1 takes. L1 otherwise treats that policy as
   `CALLER_SUPPLIED_UNVERIFIED`; here its provenance is `ARCHIVE_MEASURED` and bound to raw files.
2. `captureArchiveCandidate` puts an L1 `COMPOSED` SVG into the same Archive (LOCAL_ONLY, real Chrome) and binds, from the raw
   row, that the bytes the Archive received are the L1 bytes, at the requested size class and at the scale the policy assumed.

It reuses `measureArchiveDisplayEnvelope`, `recordArchiveEvidence`, `requestedProfileTypographyPolicy`, `assetIdentity`,
`loadBank`, `parseQuestionUidV2` and the Archive row's own layout replay. It adds no solver, no SVG post-processing, no edit
of an exam JS or of `archive/assets`.

```js
import {measureArchiveTypographyPolicy, captureArchiveCandidate} from './construction-archive-capture-v1.mjs';

const common = {identity /* assetIdentity(`${examUid}|${ordinal}`, 'SOLUTION_VISUAL', role) */,
  sourcePath /* archive/exams/**.js; the file basename is the examUid */, ordinal, requestedSizeClass /* small|medium|large|full */};
const measured = await measureArchiveTypographyPolicy({...common, intrinsicSvg: {width: 384, height: 320}, runId: 'run-a'});
const composed = await composeConstructionCandidate({plan, model, identity, typographyPolicy: measured.policy});   // L1
const bound = await captureArchiveCandidate({...common, composed, measuredPolicy: measured, alt, runId: 'run-b',
  fixtureClassification /* optional, echoed */, signal /* optional */, onProgress /* optional, a test injection point: see below */});
```

Both calls return a plain object; domain outcomes are statuses, a caller abort rejects with `code: 'ARCHIVE_CAPTURE_CANCELLED'`,
and any other exception is a defect. Every result carries `uidAuthority: 'STRUCTURAL_ONLY'`, `independentInverseObservation`,
`qualification`, `publication`: `'NOT_RUN'` and `productionAuthorized: false`.

Every result also carries `evidenceIntegrity`: `'NO_CALLER_HOOK'` when `onProgress` was not given and `'CALLER_HOOK_PRESENT'` when it was.
`onProgress` is a test injection point (the tests use it to swap bytes during a capture): it runs caller code inside the capture, so a result
with a hook is NOT operating evidence. The flag does not make the evidence tamper-proof either: a caller in the same process can write the
files, the raw row and the returned object whatever this module checks. The defence against that is the independent inverse observation
(R1-b), which is NOT_RUN here.

## Inputs checked first (nothing is created on a refusal)

- `identity` is recomputed with `assetIdentity` and must equal the object field by field: `ARCHIVE_IDENTITY_INVALID`.
- `requestedSizeClass`, `ordinal`, `runId` (`[A-Za-z0-9_-]{1,80}`), `sourcePath` (a real file `archive/exams/**.js`; the measure call also needs
  `archive/exams/original/`, a restriction of `measureArchiveDisplayEnvelope`), the ordinal being in the exam bank, `identity.surface`
  being `SOLUTION_VISUAL`, `alt` being non-empty, `onProgress` being a function, `intrinsicSvg` being positive integers: `ARCHIVE_INPUT_INVALID`
  (`detail.reason`: `SIZE_CLASS`, `ORDINAL`, `RUN_ID`, `SOURCE_SCOPE` for a path that is not a `.js` under `archive/exams/`, `SOURCE_NOT_A_FILE`,
  `ORDINAL_NOT_IN_BANK`, `SURFACE_NOT_SOLUTION_VISUAL`, `ALT`, `ON_PROGRESS`, `INTRINSIC_SVG`).
- `identity.questionUid` must be `<basename of sourcePath>|<ordinal>`: `IDENTITY_SOURCE_MISMATCH`. This is a structural binding;
  the source-exam registry is not consulted.
- `runId` must not exist under `.tmp/archive/`: `ARCHIVE_RUN_EXISTS`. The run directory is created once (`mkdir`, files with `wx`) and never reused.

## measureArchiveTypographyPolicy

`MEASURED` with `policy`, `policySha256`, `provenance: 'ARCHIVE_MEASURED'` and `evidence`: `observationSha256` (the observation the policy was
computed from), `matrixSha256`, `archiveRow` and `screenshot` (`{path, bytes, sha256}` of the raw files), `engineSha256`.
Otherwise `ARCHIVE_PREFLIGHT_FAIL` (the existing preflight refused or failed; `detail.message`) or `ARCHIVE_POLICY_UNSUPPORTED` (measured, but
the policy cannot be built, for example the small class needs a base font above 32 px for a 384x320 SVG). On the second, `evidence` is kept.

## captureArchiveCandidate

Checks before anything is written: `COMPOSED_INPUT_INVALID` (not `construction-candidate-svg-v1`, not `COMPOSED`, no SVG, no lineage, SVG bytes
that do not hash to `lineage.svgSha256`, or no integer root `width`/`height`), `SVG_EXTERNAL_REFERENCE` and `POLICY_PROVENANCE_MISMATCH`.

`SVG_EXTERNAL_REFERENCE` (after `COMPOSED_INPUT_INVALID`, before the policy check): the SVG has a `<script` element, or an `href`/`xlink:href` whose value
(after character references and whitespace/control characters are removed) is neither a `#fragment` nor a `data:` URL, so it could load something.
`detail.found` lists the offenders. Reason: the existing capture replays the SVG for its layout analysis in a page that does not block requests, so
`LOCAL_ONLY`, which covers the Archive page, does not cover what the SVG itself loads; that tool is protected and is not changed. This is a static
filter, not a sandbox: `url(...)` and `@import` in styles, `<foreignObject>`, `on*` attributes and SMIL animation (for example `<set attributeName="href" to="...">`
or `<animate>` changing an `href`) are not checked. The L1 output has none of these.

The measured policy is accepted only if all of the following hold (`detail.reason`):
it is `ARCHIVE_MEASURED`; `objectSha(policy) === policySha256`; the composed result was built with that policy
(`COMPOSED_POLICY_SHA_DIFFERS`); the evidence row still matches its ref (`EVIDENCE_REF_STALE`), the engine (`EVIDENCE_ENGINE_CHANGED`) and the source
(`EVIDENCE_SOURCE_CHANGED`) of now, and is for this `identity.assetId` and LOCAL_ONLY; the observation hash is that of the row
(`OBSERVATION_SHA_DIFFERS`); the policy is exactly what `requestedProfileTypographyPolicy` derives from the row
(`POLICY_NOT_DERIVED_FROM_EVIDENCE`); and the SVG intrinsic size is the measured one (`INTRINSIC_SVG_DIFFERS_FROM_MEASURED`).
The row holds all four size classes, so a real policy of another class is derivable from the same row and is accepted; a hand-edited one is not.

Then, under `.tmp/archive/<runId>/<examUid>/`:

- `assets/images/<examUid>/q<NN>-solution.svg`: the L1 bytes, read back (`ARCHIVE_ASSET_WRITE_MISMATCH`).
- `candidates/<examUid>.js`: the exam text plus one `Object.assign` of `solutionImage`, `solutionImageSize` (= `requestedSizeClass`) and
  `solutionImageAlt` on the target question. Every other question and every other field of the target must be canonically equal
  (`ARCHIVE_PROTECTED_FIELD_MUTATION`). `protectedParity` records the fields, the original question hash and the question count. It is a statement
  about the bank this module wrote; the `bankResponse` check below makes it true of the bank the Archive received. A `solutionImage*` field
  that the original target question already has is left out of the comparison (as in `runPhase2`).
- `visual-engine/production/archive-capture/`: the matrix (`synthetic:false`, `requireLocalResources`, `requireQrRenderer`; the asset carries no
  `sizeClass`, so the row reports the class of the rendered wrapper instead of echoing the request) and `archive-render/attempt-01/`, the raw row and
  three screenshots. `onProgress` receives the existing capture events and one more, `ARCHIVE_CANDIDATE_READY`, just before the capture.

The capture runs once. An exception becomes `ARCHIVE_CAPTURE_ERROR` (original message in `detail.message`, for example `STALE_ASSET_MATRIX`),
a non-PASS summary becomes `ARCHIVE_CAPTURE_FAIL` (`detail.rows`, `detail.errors`). On a PASS the raw row is read again and `checks` is computed
(all of it, then the first failure in this order is the status):

| check | refusal status |
| --- | --- |
| `network`: policy `LOCAL_ONLY`, no external request | `ARCHIVE_NETWORK_NOT_LOCAL` |
| `assetResponse`: exactly one response for the asset path, status 200, its SHA = `lineage.svgSha256` | `ARCHIVE_ASSET_RESPONSE_MISMATCH` |
| `bankResponse`: exactly one response for the exam JS path (`/<sourcePath>`), status 200, its SHA = `lineage.candidateBankSha256` | `ARCHIVE_BANK_RESPONSE_MISMATCH` |
| `naturalSize`: loaded, natural size = SVG intrinsic size | `ARCHIVE_ASSET_RESPONSE_MISMATCH` (`detail.check`) |
| `sizeClass`: class of the rendered wrapper = requested | `ARCHIVE_SIZE_CLASS_MISMATCH` |
| `displayScale`: `min(rect.w/w, rect.h/h)` vs `policy.displayScale`, difference x larger side <= 1 CSS px plus 1e-9 for float noise (exactly 1 px is accepted, more is refused; `displayScaleDifference`) | `ARCHIVE_DISPLAY_SCALE_MISMATCH` |
| `layout`: the Archive row's isolated replay at the real rect (`layout.source` `ARCHIVE_ROW_ISOLATED_REPLAY`), or, if the row has no record of the asset, the same SVG replayed at the rect (`MODULE_REPLAY_AT_ACTUAL_RECT`) | `ARCHIVE_LAYOUT_FAIL` |

With the existing capture as it is, `layout` is a second line of defence: a real layout defect already makes the capture summary FAIL, so the call ends
as `ARCHIVE_CAPTURE_FAIL` with the layout errors kept in `detail.errors`. `ARCHIVE_LAYOUT_FAIL` and the module's own replay are reached only when that does
not happen; the repository test does not reach them. They were confirmed only by the BUILDER's mutation runs on a copy of the module, which are kept
outside the repository (in the R1-a evidence directory). The same holds for `network`, `sizeClass` and `ARCHIVE_ASSET_WRITE_MISMATCH`.

`ARCHIVE_BOUND` is returned only when every check passes. A requested class other than the policy's is not refused up front: it is caught by
`displayScale` because that is what the Archive actually displays. The result keeps whatever was computed, also on a refusal: `lineage`
(`l1SvgSha256`, `policySha256`, `candidateBankSha256`, `assetPath`, `assetResponseSha256`, `archiveRowSha256`, `screenshotSha256s`, `matrixSha256`,
`engineSha256`), `paths`, `sizeClass` (observed), `observedDisplayScale`, `expectedDisplayScale`, `displayScaleDeltaCssPx`, `layout`, `checks`.
On `ARCHIVE_BANK_RESPONSE_MISMATCH`, `detail.responses` holds what the Archive received for the exam JS.

## Not done (NOT_RUN) and limits

Independent inverse observation (R1-b), the four-profile audit and automatic size-class choice, layout repair binding, an SVG whose meaning matches a
real question, qualification, publication, push/main/deploy. `composed` is a plain object the caller hands in: this module can check that it is
self-consistent and built with the measured policy, not that L1 really produced it, nor that it was composed for this `identity` (L1's lineage does
not carry the identity: the caller pairs them). A measured policy is checked against the raw row it points to, which does not authenticate that the row
was made by the Archive; a wrong policy is caught later because the capture shows the real display scale. The policy's size class is not required to
equal the requested class (the display scale decides), and any `fontFloorCssPx` that `requestedProfileTypographyPolicy` derives from the row is accepted. The screenshots are bound to the Archive state of the run, not
to the SVG bytes (two byte-different SVGs that render identically give identical screenshots); the byte binding is the asset response. The
row's isolated layout replay reads the asset file at capture time and labels it with the matrix hash, so a swap during the capture is caught by the
response check, not by the layout record. The medium class (24.9 px base font) cannot lay out every L1 plan: the Bx=4 triangle of the L1 tests is
`LAYOUT_INVENTORY_INCOMPLETE` there, and the tests use the Bx=6 triangle.

Tests: `../tests/construction-archive-capture-v1.test.mjs` (real Chrome and `engine.html`, LOCAL_ONLY, exam 25_효천고_2학기_중간_고1_기출 question 1 with
its original content, an unrelated technical SVG: `CONTROLLED_TECHNICAL_FIXTURE`).
