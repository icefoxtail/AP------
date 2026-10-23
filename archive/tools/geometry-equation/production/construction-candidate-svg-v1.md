# Construction candidate SVG v1

`construction-candidate-svg-v1.mjs` is one opt-in path from a `construction-spike-v1` plan and its SymPy
snapshot to a candidate SVG, with the existing static primitive audit and a rendered layout audit run on the
same SVG bytes. It reuses `specFor`, `displayGeometryInventory`, `assetIdentity`, the `typesetter`, the SymPy
`pythonWorker` (`prepare`/`build`), the Cindy `reconstruct`/`compareReconstruction` peer,
`primitive-observer-worker.py`, `launchBrowser`, and `captureAtDisplaySize`/`analyzeRenderedLayout`. It adds no
solver, canonicalizer, or SVG/font/viewBox post-processing. It does not call a provider.

```js
import {composeConstructionCandidate} from './construction-candidate-svg-v1.mjs';

// model: the worker's `construction` result for plan.mathPlan (e.g. the derived snapshot of an M1 recompute)
// identity: the whole object returned by contracts.mjs assetIdentity(questionUid, surface, visualRole)
// typographyPolicy: a REQUESTED_PROFILE_TYPOGRAPHY_v1 object from requestedProfileTypographyPolicy(...)
const result = await composeConstructionCandidate({plan, model, identity, typographyPolicy,
  worker /* default pythonWorker; carries prepare and build only */,
  browser /* optional Chrome to reuse; never closed by the module */});
```

The result is always a plain object (`schemaVersion: 'construction-candidate-svg-v1'`). Domain outcomes are
statuses; the call rejects on a defect (a missing font, Chrome that cannot launch, a `TypeError` from a
malformed `model` or plan). It launches Chrome only when it reaches fragment measurement and closes only a
browser it launched itself.

- `identity` is recomputed with `assetIdentity(identity.questionUid, identity.surface, identity.visualRole)` before any worker call and must equal the given object field by field, with no extra field; otherwise `FRAGMENT_IDENTITY_INVALID` (`detail.reason` `MISSING`, `NOT_RECOMPUTABLE` or `FIELD_MISMATCH`). The spec id is `identity.assetId` and the verified object is passed to the typesetter unchanged (runPhase2 423 and 627), so the question, surface and role are part of every fragment namespace and fragment hash. A caller that passes the same identity runPhase2 would use gets the same fragment bytes.
- `status`: `COMPOSED` or one of
  - input: `UNSUPPORTED_CAPABILITY` (not `construction-spike-v1` with a `construction-spike-v1` `mathPlan`, or a `graphPlan` present), `TYPOGRAPHY_POLICY_INVALID` (wrong schema, non-finite, `baseFontPx` or `fontFloorCssPx` below 11, non-positive scale, or `baseFontPx x displayScale < fontFloorCssPx`; `detail.reason`), `FRAGMENT_IDENTITY_INVALID`, `INPUT_NOT_CANONICAL`
  - binding: `MODEL_PLAN_MISMATCH` (`compareReconstruction` not PASS, or the peer threw an error whose message starts with `CINDY_`; `detail.failedIds`/`errors`/`code`), `UNSUPPORTED_NUMERIC_SCOPE` (message starts with `UNSUPPORTED_CINDY_`). Any other exception from the peer propagates.
  - spec/fragments: `SPEC_ERROR` (`specFor` threw a plain `Error` whose message is an UPPER_SNAKE code; any other exception propagates), `WORKER_ERROR` (`detail.stage` in `prepare`/`build`/`staticAudit`, original `code`, `workerStatus` when the worker answered), `UNSUPPORTED_MULTILINE_LABEL` (`CONDITION_BOX`), `FRAGMENT_TYPESET_ERROR` (same plain-code rule), `FRAGMENT_BROWSER_MEASUREMENT_MISSING`
  - layout: `LAYOUT_INVENTORY_INCOMPLETE` (`witness.layout.unresolved`/`suppressed` not empty), `LAYOUT_REPAIR_NOT_BOUND` (`repairs` not empty: a repair needs Archive profile/policy refs, so it is refused, never accepted)
  - audits: `STATIC_PRIMITIVE_AUDIT_FAIL` (`staticAudit.errors`), `RENDERED_LAYOUT_FAIL` (`renderedLayout.errors`), `OUTPUT_NOT_CANONICAL`
- `svg`: the SVG string only when `COMPOSED`, otherwise `null` (the hash stays in `lineage`).
- `lineage`: `planSha256`, `modelSha256`, `typographyPolicySha256`, `specSha256`, `fragmentSha256s` (label id to fragment hash), `measurementsSha256`, `svgSha256`, `witnessSha256`, `staticAuditSha256`, `renderedLayoutSha256`. Entries not reached are `null`; computed entries survive a later failure. All use `objectSha`/`bytesSha`. `measurementsSha256` covers the `[width,height]` map sent to `build`; the `observedBBox` that runPhase2 also attaches to each fragment is attached here too but is read by neither the engine nor the observer. `renderedLayoutSha256` hashes the render record `{svgSha256, layout}`: the layout analysis together with the hash of the bytes that were rendered.
- `staticAudit:{status,errors}`, `renderedLayout:{status,display:{width,height},errors}` (`NOT_RUN` until executed).
- Constants: `typographyPolicyProvenance: 'CALLER_SUPPLIED_UNVERIFIED'`, `sizeSelection`/`actualArchive`/`independentVisualReview: 'NOT_RUN'`, `productionAuthorized: false`, `qualification: 'NOT_RUN'`.

The static observer always runs on the real `pythonWorker` with `primitive-observer-worker.py`; a caller-supplied
`worker` is never asked to run it, so it cannot answer PASS for the SVG. Its result must report
`finalSvgSha256 === lineage.svgSha256`, so the same bytes that were audited are the bytes rendered and returned.

## Where it re-enacts runPhase2

Row numbers are `phase2.mjs` at base commit `d0bd40de6`; this module does not change them.

- 423 identity (`assetIdentity`), 622-628 fragment typeset (kind/tex/role/owner, `fontPx` from the policy `baseFontPx`, `identity` handed over unchanged), 630-631 Chrome fragment measurement (`getBBox` + `getBoundingClientRect` -> `[viewportWidth, viewportHeight]`, non-positive size refused), 673 `build({spec, measurements, fragments})`, 689 inventory check, 708-713 static audit input (displayed points/lines/circles taken from the Cindy peer, `displaySegments`, `rightAngles`, `witness.coordinateModel`, fragments, `coordinateMode`).
- The rendered layout follows `display-profile-audit.mjs` 12-15: a page the size of the display, `captureAtDisplaySize` with publication viewport 1440x1000, `analyzeRenderedLayout`. The display size is `spec.viewport x policy.displayScale`.

## Not done (NOT_RUN)

Archive display-envelope preflight and the choice of size class; the typography policy itself (the caller's, unverified);
measured owner-safe layout repair binding and its audit (674-688, 693-707; refused instead); the four-profile audit
(`auditCandidateProfiles`); the actual Archive `mode=sol` capture; independent visual review; qualification; any Archive asset or
student JS write. Graph plans (`graphPlan`) are out of scope. `displayScale` has no upper bound in the policy check.

Boundary: a policy whose font product sits exactly on the floor (for example `baseFontPx 20`, `displayScale 0.55`)
passes the policy check but was observed to render just under 11 CSS px in the Chrome used for the tests, and is then
reported as `RENDERED_LAYOUT_FAIL`. That depends on the browser's layout rounding and scale factor and is environment
dependent. `requestedProfileTypographyPolicy` targets the floor plus `comfortCssPx` (default 0.25), so a policy built by it
does not sit exactly on the floor.
A baseline font of 24.9 px (the medium-class fixture) leaves a tick label unresolved in the triangle example and is
reported as `LAYOUT_INVENTORY_INCOMPLETE`.

Tests: `../tests/construction-candidate-svg-v1.test.mjs` (real workers and Chrome, fixture policy, no provider).
