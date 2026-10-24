# Construction parameter recompute v1

`construction-parameters-v1.mjs` changes declared literal slots of a frozen
`construction-spike-v1` graph and recomputes the mathematics. It reuses the
existing SymPy `pythonWorker`, the Cindy `reconstruct`/`compareReconstruction`
peer, and the engine transcript `dependencies`; it adds no solver, parser, or
canonicalizer.

```js
import {applyConstructionParameters, recomputeConstructionParameters} from './construction-parameters-v1.mjs';

const parameterSpec = {schemaVersion: 'construction-parameter-spec-v1',
  baseGraphSha256: objectSha(baseGraph),
  slots: [{id: 'Px', target: {kind: 'NODE_ARG', nodeId: 'P', path: ['coordinates', 0]},
           domain: {min: int(0), max: int(10)}}]};
const values = {schemaVersion: 'construction-parameter-values-v1',
  parameterSpecSha256: objectSha(parameterSpec), values: {Px: int(6)}};

const applied = applyConstructionParameters({baseGraph, parameterSpec, values}); // sync, throws Error(code)
const result = await recomputeConstructionParameters({baseGraph, parameterSpec, values}); // outcomes are results; rejects only on caller abort or a defect
```

Free targets: `SOURCE_POINT` `["coordinates",0|1]`, `NORMALIZATION_AXIS` `["length"]`,
`CIRCLE_CENTER_RADIUS` `["radius"]` (paths are relative to `node.args`), and
`{kind:'CONDITION_EXPECTED',conditionId}` for `DISTANCE_EQUALS`/`MIDPOINT_RATIO`.
Values are integer/rational typed scalars, one per slot, inside the slot's exact
(BigInt) domain. A value exactly equal to the base literal is `unchangedSlots` and
keeps the base literal; a base literal that is not an integer/rational is
conservatively treated as changed.

`recompute` fully re-runs base and derived. Result `status` is `RECOMPUTED` or one of:

- input, before any engine runs (`lineage`, `impact`, `downstream` are `null`): `STALE_PARAMETER_BASE`, `STALE_PARAMETER_VALUES`, `PARAMETER_TARGET_NOT_FREE`, `PARAMETER_VALUES_INCOMPLETE`, `UNKNOWN_PARAMETER_SLOT`, `PARAMETER_VALUE_KIND_UNSUPPORTED`, `PARAMETER_OUT_OF_RANGE`, a preserved `INVALID_EXACT_SCALAR`, and the shape codes `INVALID_PARAMETER_SPEC`, `INVALID_PARAMETER_VALUES`, `INVALID_PARAMETER_DOMAIN`, `DUPLICATE_PARAMETER_SLOT`, `DUPLICATE_PARAMETER_TARGET`, `INVALID_BASE_GRAPH`
- engine: `BASE_CONSTRUCTION_NOT_OK` (with `engineCode`), `MATH_INVALID` (original `engineCode`, never relabelled), `WORKER_UNSUPPORTED`, `WORKER_ERROR` (transport/timeout/crash; `detail.phase`, `detail.code`)
- peer: `UNSUPPORTED_NUMERIC_SCOPE` (`UNSUPPORTED_CINDY_*`, peer not run), `PEER_MISMATCH` (`peer.status` `FAIL` or `ERROR`)
- invariants: `DEPENDENCY_STRUCTURE_CHANGED`, `UNAFFECTED_NODE_CHANGED:<id>`

`impact` splits nodes into seeds, `affectedChanged`, `affectedSameValue` (recomputed
but identical), and `unaffectedNodeIds` (byte-identical, verified). `downstream` is
`{layout, svg: 'INVALIDATED_NOT_RUN', render, review: 'NOT_RUN'}` when any slot value
changed, else `'NOT_INVALIDATED'`. Every result has `productionAuthorized: false` and
`qualification: 'NOT_RUN'`.

Limits: one capability, full re-execution (no incremental solver); no layout, SVG,
render, qualification, or publication. The numeric peer is bounded by the Cindy
envelope in `cindy-observer.mjs`, which applies to the input literals and to every exact
point coordinate and scalar of the derived snapshot, not only to slot values: integers
within ±1e6, rationals with numerator within ±1e9 and denominator up to 1e9, nonzero
magnitudes within 1e-9 to 1e6, and add/sub results that are not a nonzero cancellation: a
nonzero result whose magnitude is at most 1e-9 times the larger of 1 and the operand
magnitudes is rejected, while an exact zero result is allowed. Outside it the result is
`UNSUPPORTED_NUMERIC_SCOPE` (for example
P.x = 50000 in the V1 fixture, because a derived exact value leaves the envelope), and
values so large that the worker output exceeds the canonical safe-integer range (for
example P.x = 10^20) surface as `WORKER_ERROR`.
A `MIDPOINT` of two coincident points is that point (for example P equal to O in the V1
fixture), so the later degenerate `diameterCircle` is the engine code
`DEGENERATE_CIRCLE_RADIUS`, reported as `MATH_INVALID`.
