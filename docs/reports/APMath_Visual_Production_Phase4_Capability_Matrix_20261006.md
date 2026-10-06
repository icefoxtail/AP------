# APMath Visual Engine Capability Matrix — 2026-10-06

This matrix is a bounded Phase 4 scope and evidence report for the current continuation branch. `SUPPORTED` is reserved for a complete input grammar, producer, independent audit, educational framing, and real-size Archive publication path. Parser acceptance or an experimental locator run alone does not grant that status.

## Construction

| Operation / scope | Input grammar and production execution | Independent reconstruction | Degeneracy / topology audit | Actual-size publication | Evidence and status |
|---|---|---|---|---|---|
| Source coordinate geometry | Typed integer/rational/expression source points; origin/axis normalization; midpoint; line through points; perpendicular foot; circle center/radius; point-set intersections; oriented `SELECT_POINT`; segment length; scalar square | Cindy rebuilds from frozen source primitives; it does not consume producer output coordinates | Supported worker domain is bounded; ambiguous/near-degenerate/unsupported Cindy numeric cases stay unsupported | Four-profile measurement and label audit; q1 locator selected large after medium failed | Geometry q1 profile slice is `EXPERIMENTAL_LOCATOR_COMPLETE`; not a canonical UID count |
| Coordinate-free right-triangle realization | Bounded `SSS_POSITIVE_SIDE_v1` realization uses source lengths/right-angle relation and a deterministic normalized frame; no source coordinates are invented | Independent Cindy reconstruction checks the frozen construction; scalar output is compared separately | Branch selection is explicit; general realization solving and ambiguous intersections remain unsupported | Four-profile SVG audit and final Archive load; large selected at 11.25 CSS px | Coordinate-free Geometry q1 with source image included in review; locator-only, excluded from qualification |
| Other construction operations | `PARALLEL`, angle bisector, arbitrary constraint solving, general tangent/three-point-circle workflows, and unrestricted descendant branches are not in the Phase 2 provider grammar | Not independently closed by the current engine | No general degeneracy matrix | No publication claim | `UNSUPPORTED` or `NOT_IMPLEMENTED`; no fallback coordinates |

Known numeric peer limit: Cindy is a bounded numeric cross-check, not an exact proof or general CAS. Values outside its recorded tolerance/magnitude/cancellation envelope remain unsupported even when SymPy can produce an exact expression. See [Phase 0–2 report](APMath_Visual_Production_Phase3-5_20261006.md).

## Function graph

| Family | Production execution | Independent math / topology audit | Overview and required feature audit | Actual Archive publication | Status |
|---|---|---|---|---|---|
| Quadratic polynomial | `polynomial-spike-v1` runner accepts exact rational coefficient strings and a bounded domain/viewport; sampler and quadratic framing are active | Independent polynomial observer verifies source curve segments, roots/coverage, and the quadratic overview frame | Vertex, opening direction, and both visible arms are checked; full/large/medium profiles are audited separately | Graph q10 locator selected full; large failed each arm at 39.34px versus a 40px minimum; full passed | `EXPERIMENTAL` vertical slice only; qid_v1 locator is not qualification evidence |
| Cubic / quartic polynomial | Existing sampler and worker grammar execute bounded polynomial expressions through degree four. Experimental overview accepts exact rational coefficient strings of degree exactly 3 or 4 only when source domain is explicitly `ALL_REALS`; framing is display-only. Restricted intervals remain unsupported. | Separately launched observer recomputes real roots, derivative roots/extrema or stationary inflections, inflection points, multiplicities, and left/right tail directions from the source polynomial; it checks the final SVG polyline. | Every derived/required feature and both tails must remain visible at the actual profile. Coincident feature roles merge; repeated source roots and features below 1 CSS px separation at the audited profile fail closed or return unsupported. | Controlled synthetic-content fixtures exercise measured Chromium fragments, small/medium/large/full profile audits, selected-profile actual Archive capture, candidate-SHA binding, and local-only resources. Cubic selected large; quartic selected full; both final rows PASS. No canonical source candidate. | `EXPERIMENTAL / CONTROLLED FIXTURE ONLY`; `NOT_PUBLICATION_SUPPORTED`; no qualified UID |
| Rational | Distinct experimental `rational-spike-v1` route accepts exactly two exact rational coefficient strings each (linear numerator and denominator), with explicit `sourceDomain:ALL_REALS` and no extra interval. The sole simple denominator root is retained as a domain exclusion and classified as either a pole or a removable hole. | Independent observer reconstructs pole/hole class and location, numerator zero, horizontal asymptote, branch-side sign, and visible interval coverage from exact coefficients. It checks final SVG branch separation and actual asymptote/hole primitives. | Dashed horizontal asymptote is required; a pole also requires a dashed vertical asymptote and visible branches on both sides. A removable hole requires a white outlined marker with a 4.5 CSS px minimum diameter at the measured profile. Higher-degree, multiple-root, oblique-asymptote, and additionally restricted-domain plans are unsupported. | Controlled synthetic pole fixture selected medium; removable-hole fixture selected large because the marker is below the 4.5 CSS px floor at small/medium. Both selected profiles passed measured Chromium audits and final local Archive capture. No canonical source candidate. | `EXPERIMENTAL / CONTROLLED FIXTURE ONLY`; `NOT_PUBLICATION_SUPPORTED`; no qualified UID |
| Square root | AST sampler detects square-root domain guards; observer supports a positive-slope affine radicand | Independent secant-envelope audit exists for that narrow observer grammar | General radical framing, endpoint presentation, and mixed compositions are not closed | No square-root candidate profile slice | `NOT_PUBLICATION_SUPPORTED`; only the observer’s narrow grammar is available |
| Absolute value | Expression AST evaluates `abs`; sampler can emit samples | No independent corner/branch observer is connected to the real UID runner | Corner location/ownership and tangent discontinuity treatment are absent | No profile evidence | `NOT_PUBLICATION_SUPPORTED` |
| Piecewise | No bounded piecewise-function DSL in the Phase 2 provider grammar | No piecewise endpoint/branch observer | Open/closed endpoint ownership, discontinuities, and interval coverage are absent | No profile evidence | `UNSUPPORTED` |
| Exponential | Expression AST and sampler can evaluate `exp` | No independent exponential interval/error bound is connected | Asymptote, monotonicity, reference point, and educational overview rules are absent | No profile evidence | `NOT_PUBLICATION_SUPPORTED` |
| Logarithmic | Expression AST and sampler support `log` with a bounded domain guard | No independent log-domain / branch / error-bound verifier is connected | Domain boundary and asymptotic behavior are not publication-verified | No profile evidence | `NOT_PUBLICATION_SUPPORTED` |
| Trigonometric | Expression AST supports `sin`, `cos`, and `tan`; sampler signature detects some `tan` branch changes | No independent trig observer or complete pole resolver | Required period/amplitude/phase framing and pole completeness are absent | No profile evidence | `NOT_PUBLICATION_SUPPORTED` |

The relevant implementation split is visible in [function sampler](../../archive/tools/geometry-equation/visual_engine/function_sampling.py), [graph observer](../../archive/tools/geometry-equation/production/graph_observer.py), [graph framer](../../archive/tools/geometry-equation/production/graph_framing.py), and the [Phase 2 runner](../../archive/tools/geometry-equation/production/phase2.mjs). The production runner does not report a family supported merely because the expression parser accepts it.

## Phase 4 cubic/quartic fixture evidence

This fixture slice is **`EXPERIMENTAL / CONTROLLED FIXTURE ONLY`**. It does not
qualify publication or provide a canonical UID result. The candidate bank content
is synthetic, although the collector used actual Chromium, measured the frozen
MathJax fragments before BUILD, loaded the exact final SVG bytes in the local
Archive, blocked external requests, and captured raw screenshots.

| Fixture | Frozen exact function | Derived features and tails | Small | Medium | Large | Full | Selected Archive result |
|---|---|---|---|---|---|---|---|
| Cubic | `y=x³−3x` | Roots `−√3, 0, √3`; extrema at `−1, 1`; `x=0` merges ROOT and INFLECTION; left DOWN, right UP | Fail | Fail | Pass | Pass | large; PASS |
| Quartic | `y=x⁴−x` | Roots `0, 1`; derivative root `∛(1/4)`; both tails UP | Fail | Fail | Fail | Pass | full; PASS |

The Archive image boxes measured small `126×105`, medium `174×145`, large
`216×180`, and full `298.140625×248.453125` CSS px. The minimum rendered label
font was 8.17 px at small, 11.28 px at medium, 14.01 px at large, and 19.33 px at
full. Quartic large fails graph-tail/arm coverage even though its font floor
passes. The independent `y=x³` feature-inventory unit covers merging a
stationary-inflection role; that repeated-root polynomial is not a supported
source fixture.

Positive/negative coverage includes exact feature inventory, tail direction,
role merging, repeated roots, restricted/missing domains, sub-resolution
features, wrong chords, missing features, clipped tails, and a viewport-out-and-
back curve. The Node Phase 2 spec test verifies that every frozen math feature is
sampled and tail metadata is not mistaken for an x-coordinate. Full regressions
after the contract-test update passed Node 132/132 and Python 151/151.

The [tracked fixture ledger](../evidence/apmath-vprod/p4/cubic-quartic-overview-v4/phase4-ledger.json),
[evidence index](../evidence/apmath-vprod/p4/cubic-quartic-overview-v4/evidence-index.json),
and [hash manifest](../evidence/apmath-vprod/p4/cubic-quartic-overview-v4/evidence-manifest.json) preserve the machine inputs and actual captures.

## Phase 4 rational linear-over-linear fixture evidence

This separate `rational-spike-v1` route accepts only exact linear-over-linear
plans on `ALL_REALS` with the denominator's natural zero retained as an excluded
point. Exact cancellation produces one removable hole; otherwise the simple
denominator root is a vertical pole. The independent observer recomputes the
horizontal asymptote and branch directions, verifies that curve segments do not
cross the singularity, and checks the required dashed asymptote and hole
primitives on the final SVG. The hole marker is 4 intrinsic SVG px in radius,
with a 4.5 CSS px minimum diameter at the audited Archive profile; a smaller
profile is `UNSUPPORTED` for that marker.

| Fixture | Exact source function | Derived feature | Small | Medium | Large | Full | Selected Archive result |
|---|---|---|---|---|---|---|---|
| Pole | `y=(x+1)/(x−1)` | Pole `x=1`; horizontal asymptote `y=1`; zero `x=−1`; branches have opposite pole-side directions. | Fail | Pass | Pass | Pass | medium; PASS |
| Removable hole | `y=(x−1)/(x−1)`, `x≠1` | Open hole `(1,1)`; horizontal asymptote `y=1`; the function is not assigned at `x=1`. | Unsupported: hole marker below 4.5 CSS px | Unsupported: hole marker below 4.5 CSS px | Pass | Pass | large; PASS |

Measured Archive image boxes are small `126×105`, medium `174×145`, large
`216×180`, and full `298.140625×248.453125` CSS px. Both final rows blocked
external requests, loaded the exact candidate SVG SHA and local QRious, and
captured the same measured candidate bytes audited at all four profiles. These
are synthetic controlled fixtures only; they do not qualify a real UID.

Positive/negative tests cover pole and hole reconstruction, restricted-domain
and higher-degree rejection, sub-resolution root/pole spacing, missing or moved
asymptotes, missing or unoutlined hole markers, pole-crossing wrong branches,
and clipped branch coverage. Legacy rational expression sampling remains
covered independently by the existing graph-spike and function-sampler suites.
Current full regressions after the contract updates pass Node 136/136 and Python
158/158. The current-fingerprint package combines these rational fixtures with
fresh cubic/quartic fixture replays: [ledger](../evidence/apmath-vprod/p4/rational-linear-over-linear-v1/phase4-ledger.json),
[index](../evidence/apmath-vprod/p4/rational-linear-over-linear-v1/evidence-index.json),
and [manifest](../evidence/apmath-vprod/p4/rational-linear-over-linear-v1/evidence-manifest.json).

## Cross-family publication gates

| Gate | Current evidence | Remaining debt |
|---|---|---|
| DisplayEnvelope | Actual `.sol-meta` content-box width is measured before layout; same candidate bytes are captured at small/medium/large/full; every profile binds source, solution, policy, SVG SHA, screenshot, label fonts, strokes, and topology/graph references | Only three locator-based real-source candidate slices exist; no canonical v2 authority |
| Owner-safe measured layout | Frozen MathJax fragments are measured in Chromium; final per-profile `getBBox`/client bounds feed collision, clipping, and font checks. The bounded Phase 3 owner relocation binds point/coordinate fragments to an exact target and Voronoi owner; the q10 formula panel uses a measured, content-addressed action. | Owner relocation was triggered only by a controlled fixture, not a real candidate. q10 is unresolved at its unchanged 3/3 repair cap. Other label/panel defect classes remain unsupported rather than silently repaired. |
| Resume/cache/atomic stage output | Immutable manifests, temp-workspace isolation, stage locks, competing-writer evidence, provider/observer and review-input invalidation, worker-timeout/cancellation recovery, actual Archive capture cancellation, and provider `turn/interrupt` plus child-close evidence are tested. The local-only Archive page verifies vendored QRious response SHA and local MathJax. | Evidence is bounded to the tested mutation/timeout/cancellation cases; it does not claim a universal cache invalidation or cross-browser qualification. The P3E v11 candidate outcomes are a pre-Phase-4 snapshot, not current after Phase 4 fingerprint changes. |
| Bounded repair | Plan/normalizer/source-review repairs persist a shared three-entry ledger. Measured formula-panel composition and a narrowly typed measured point/coordinate-label relocation are bound to frozen inputs; no direct final SVG patch is used. | q10 remains unresolved at 3/3. The owner relocation has no real-candidate trigger. General repairs for arbitrary labels, typography, graph framing, and unmeasured layout classes remain unsupported and fail closed. |
| Source authority / qualification | Current resolver returns `INPUT_REQUIRED / UID_AUTHORITY_REGISTRY_REQUIRED`; the qid_v1 map cannot be promoted to v2 ACTIVE authority | Canonical real-UID count: Geometry 0/6, Graph 0/4, total 0/10. Experimental locator examples are excluded |

## Negative tests still required for capability expansion

The cubic/quartic and rational controlled slices cover their bounded feature and topology negatives, including pole/hole branches and missing asymptote cues. These synthetic fixtures do not qualify a real Graph UID. Other family-specific cases remain open until their own bounded slices: square-root endpoints; absolute-value corners; piecewise open/closed endpoints; exponential/logarithmic/trigonometric branch and asymptote coverage. Cross-family profile fixtures continue to reject sub-11px labels and mismatched final Archive image/profile bindings, but they do not replace a family-specific actual-source review.

## Qualification disposition

This is a capability inventory, not a qualification claim. The current branch is not `ACTIVE`, has no Seal, and has not been merged to main. The three candidate bundles are reviewable experimental locator runs in `../evidence/apmath-visual-production-phase3-5/experimental-locator-geometry-q01/`, `../evidence/apmath-visual-production-phase3-5/experimental-locator-graph-q10/`, and `../evidence/apmath-visual-production-phase3-5/experimental-locator-coordinate-free-geometry-q1/`.
