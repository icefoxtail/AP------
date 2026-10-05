# Geometry publication profile — branch qualification

Scope: SYSTEM_VISUAL / opt-in candidate generation and independent observation.
The default `geometry-visual-v1` engine, function-graph route and existing
production exam/SVG files are not migrated. No main merge or ten-exam publication
is authorized by this change.

## Assessment of the existing engine

Preserve: finite numeric geometry, semantic relation checks, equal-unit viewport,
AST math serialization, separated composer/layout, candidate-only output guard,
frozen-fact adapter, actual-browser and actual-Archive harnesses.

The missing part was an owner-bound publication composition layer: point name
identity, angle wedge/radius hierarchy, length dimensions, polygon-area labels,
and an independent observer of the resulting primitives. The old greedy layout
had no knowledge of those owners. Its label deduplication also conflated equal
numeric values on distinct length owners. Existing render replay did not force
the SVG to the actual Archive image dimensions or enforce the 11 CSS-pixel floor.

## Boundary and independence

`source + verified solution -> separately frozen expected review facts`

`visualSpec -> existing numeric/semantic engine -> publication.py -> composer`

`final SVG bytes + review + exact source/solution bytes -> audit_publication.py`

`same final SVG -> actual Chromium -> actual Archive mode=sol 390x844`

The auditor imports only the Python standard library, not the builder, composer,
layout, serializer or build witness. It independently parses actual XML coordinates,
uses winding-number region checks and accumulated arc rotations, checks complete
primitive/label coverage and rejects unsupported rendering effects. Owner metadata
is compared to observed primitives; it is not accepted as evidence of their shape.

This is algorithmic separation, NOT independent human review. It does not solve
source problems, prove review facts are mathematically correct, or guarantee that
all useful source facts were included. Freeze the review before construction;
never manufacture it from a generated SVG or builder witness. A static PASS is
never publication permission (`publicationAuthorized=false`).

## Opt-in input

Add `publication` to a standard `visualSpec`, or to the existing
`past-exam-expected-facts-v1` bundle. Existing entrypoints/output guards are reused.

```json
{
  "profile": "geometry-publication-v1",
  "fontSize": 16,
  "sourcePointLabels": {"A": "A", "B": "B", "C": "C"},
  "segmentPointRefs": {"AB": ["A", "B"], "BC": ["B", "C"], "CA": ["C", "A"]},
  "annotations": [
    {"id":"a90","kind":"ANGLE","refs":["B","A","C"],"value":90,"factRole":"GIVEN"},
    {"id":"lenAB","kind":"LENGTH","owner":"AB","value":3,"mode":"DIMENSION"},
    {"id":"area","kind":"REGION","refs":["A","B","C"],"value":4.5,"text":"9/2"}
  ]
}
```

Complete runnable specs and independently frozen review contracts are in
`tests/publication-fixtures/`. These are synthetic cases inspired by the pilot
failure classes, NOT source reconstructions or PASS verdicts for its exam qids.

- Maps must cover every POINT and SEGMENT. Source names and endpoint coordinates
  must agree; two names for coincident points are deliberately unsupported.
- ANGLE uses `[first ray point, vertex, second ray point]`; AUTO prefers a square
  for 90 degrees. Minor/reflex sweeps are distinguished; 180 degrees requires
  explicit `CW`/`CCW` in SVG screen coordinates. Same-vertex radii are separated.
- LENGTH supports ADJACENT and DIMENSION, with `side: 1|-1`. Ambiguous adjacent
  placement is rejected rather than silently attaching a value to another edge.
  Choose DIMENSION explicitly when the source is crowded.
- REGION supports a simple polygon, an interior value or explicit external
  `labelAt` with a short leader. Curved/holed regions are not covered.
- `text` is an exact numeric expression in the existing AST format; approximate
  decimals are not substituted for exact fractions/radicals. Units for lengths
  are a separate optional field. `factRole` is GIVEN, DERIVED_INTERMEDIATE or
  CONCLUSION (default DERIVED_INTERMEDIATE; authors should set it deliberately).
- Points, angles, lengths and short geometry math labels share one base size.
  Defaults are 16 SVG units on a 390x360 canvas with no side panel. Explicit
  viewport choices remain subject to the existing critical-geometry framing.
- The layout searches bounded owner-valid positions, including the inside of an
  offset dimension when the outside runs off-canvas. No font reduction, required
  label suppression, or detached panel fallback is used to force a PASS.
- New and legacy annotation objects cannot be mixed in this profile. Coordinate
  axes/function graphs stay on the existing v1 route, not the publication overlay.
- SVG is the qualified publication backend. The inherited TikZ output remains a
  legacy draft; it is explicitly marked NOT publication parity in the witness.

## Independent review input

Use schemaVersion `geometry-publication-review-v1`, `sourceSha256`,
`solutionSha256`, a separately frozen equal-unit coordinate frame
`{originX,originY,sx,sy}`, and explicit `points/segments/circles/lines/angles/lengths/
regions/otherLabels` arrays. See the paired fixture review JSONs for field names.
Source and solution *bytes* are mandatory and must match their hashes. Build
witnesses and generator input are not accepted as review contracts.

Unsupported SVG transforms, clipping, masks, CSS inheritance, scripts, foreign
objects, hidden strokes, opaque cover rectangles, nested SVG viewports and
repositioned numeric tspans fail closed. This is intentionally not a general SVG
parser. Literal display text and declared exponent scopes are compared separately
from numeric geometry. Errors include item IDs; observations and coverage are
recorded even when a later check fails.

## Commands

From the repository root:

```sh
python -m unittest discover -s archive/tools/geometry-equation/tests -p 'test_*.py' -v
node --test archive/tools/geometry-equation/tests/*.test.mjs
python archive/tools/geometry-equation/tests/build_publication_fixtures.py
node archive/tools/geometry-equation/tests/run-publication-browser.mjs
node archive/tools/geometry-equation/tests/run-publication-archive.mjs
```

Browser commands require Playwright/Chromium. Reuse the existing
`GEOMETRY_NODE_MODULES` and `GEOMETRY_BROWSER_CHANNEL` settings, or set
`GEOMETRY_BROWSER_EXECUTABLE` to an installed browser. The scoped GitHub workflow
installs pinned Playwright and executes both standalone and actual Archive checks.
It has read-only repository permissions and never merges or updates main.

For an authored candidate, use the existing adapter/engine build command, then:

```sh
python archive/tools/geometry-equation/audit_publication.py \
  --svg candidate.svg --review frozen-review.json \
  --source source.txt --solution verified-solution.txt \
  --out archive/_generated/geometry-visual-engine/run/audit.json
```

All generated candidates, screenshots and reports stay under ignored
`archive/_generated/geometry-visual-engine/`; they are CI artifacts, not Git input.

## Render evidence and limits

The existing `record-visual-browser-evidence.mjs` remains the real-exam integration
path. It now verifies the actual loaded image response hash and replays the SVG at
its measured Archive display size, eliminating native-width false passes. This
isolated replay is explicitly labeled, not disguised as in-page SVG DOM access.
Actual Archive screenshots and readiness/load state remain separate evidence.

The updated rendered-layout observer closes polygon boundaries, checks loaded
fonts, actual CSS-size floors and consistent base sizes, and allows a region
leader to exit only its own geometrically matching boundary. Unrelated leader
crossings still fail. Static observation must pass on the same asset; metadata
alone cannot authorize that exception.

Local qualification: Python **113 PASS**, Node **44 PASS**, independent static
fixtures **5/5**, pure deterministic fixtures **5/5**, standalone Chromium
**10/10** (five fixtures at display widths 320 and 390), deliberate 240px
small-font case rejected. Existing 13 regression SVGs remain byte-identical to
the source baseline. The six original independent verifiers are not modified.

Actual Archive qualification is a distinct CI step, not implied by these numbers.
This session's local browser blocked loopback navigation with
`ERR_BLOCKED_BY_ADMINISTRATOR`; that is an environment NOT_RUN, not an SVG PASS.
Use the branch workflow's final `archive-summary.json` and final source SHA to
resolve integration status. CI source/artifact snapshots are retained 14 days.

Remaining: ten-exam current-source inventory and fresh facts; curved/holed region
annotation; crowded figure reframing/leader/dimension author decisions; nonstandard
SVG backends; independent visual review of actual student pages. An engine test
PASS never closes those production tasks or automatically sets FINAL SEAL.

## Delivery status — 2026-10-05

The implementation in this package is a LOCAL TESTED CANDIDATE. The remote branch
`codex/geometry-visual-publication-v2-20261005` at
`5a20240fbc612d8e984bd11c78c304582def380f` contains the qualification workflow ONLY,
not these source changes. The GitHub source-upload tool request was blocked while
it could not determine the request security state. No source commit was created.
The green infrastructure run `37251382281` tested the old baseline and skipped the
new publication fixtures: it is NOT qualification of this implementation.

The accompanying patch is against the unchanged geometry baseline at main
`2782155cab4a16a83610cf6786c7ea75a3c743aa`; it does not include workflow changes
(the workflow already exists on the working branch). Check/apply only on the
working branch after checking for overlapping edits. Actual Archive integration
is NOT_RUN locally; the harness error is preserved verbatim, not relabeled PASS.
No ten-exam SVG rebuild, source-source parity approval, production seal or main
merge has been performed.
