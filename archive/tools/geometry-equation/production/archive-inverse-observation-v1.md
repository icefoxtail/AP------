# Archive inverse observation v1

`archive-inverse-observation-v1.mjs` gives the R1-a capture (`construction-archive-capture-v1`) the independent second look its `independentInverseObservation: 'NOT_RUN'`
flag leaves open (v1.4 design V4, section 12.4.4, the reverse direction): somebody who has **not seen the plan, the spec or any expected value** reads the captured
screenshot and writes down what is visible; only afterwards is that record compared with what the spec displays.

The observer is a **role defined by files**, not a function of any product. A Codex, Claude Code or Antigravity worker (or anyone else) gets the same packet directory
and writes the same JSON record. Nothing here calls a provider or assumes one.

```js
import {prepareInverseObservationPacket, freezeInverseObservation, bindInverseObservation} from './archive-inverse-observation-v1.mjs';

// capture: the result of captureArchiveCandidate() with status 'ARCHIVE_BOUND' and evidenceIntegrity 'NO_CALLER_HOOK'
const packet = await prepareInverseObservationPacket({capture, packetDir /* a new directory */});   // {status:'PACKET_READY', packetDir, packetSha256, manifest}
// ... the observer is handed packet.packetDir and nothing else, and writes <packetDir>/observation.json ...
const frozen = await freezeInverseObservation({packetDir, observationPath});                         // {status:'FROZEN', freezeRef:{path,bytes,sha256}, observationSha256}
const receipt = await bindInverseObservation({capture, composed, plan, model, identity, packetDir, observationPath});
// receipt.status: 'OBSERVED_CONSISTENT' | 'OBSERVED_DISCREPANCY' (or a refusal status, see below)
```

All three are `async` and return a plain object. Domain outcomes are statuses; any other exception is a defect and propagates. Every result carries
`numericAccuracy: 'OUT_OF_SCOPE_PRIMITIVE_OBSERVER'`, `qualification: 'NOT_RUN'`, `publication: 'NOT_RUN'`, `productionAuthorized: false`.

## What this is not

Numeric accuracy (coordinates, lengths, angles) belongs to the primitive observer; the observer here is told **not** to estimate numbers and the comparison never does.
This is not qualification, not publication, not a four-profile audit and not a statement that the figure is mathematically right. `OBSERVED_CONSISTENT` means only:
a reader who was given the screenshot and the neutral instructions reported exactly the labels, segments, lines, circles and right-angle marks the spec displays.

## Packet (`prepareInverseObservationPacket`)

Needs `capture.status === 'ARCHIVE_BOUND'` and `capture.evidenceIntegrity === 'NO_CALLER_HOOK'` (a hook capture is not operating evidence), all `capture.checks` `PASS`,
`lineage.assetResponseSha256 === lineage.l1SvgSha256`, and the files the capture names read back: `paths.screenshots.image`, `.context` (PNG, hash = `lineage.screenshotSha256s`)
and `paths.archiveRow` (hash = `lineage.archiveRowSha256`), all under `.tmp/archive/`. Otherwise `CAPTURE_INPUT_INVALID` with `detail.reason`, and nothing is created.
`packetDir` is created new (parents too); an existing path of any kind is `PACKET_DIR_EXISTS` and is left untouched.

The directory holds exactly:

| file | content |
| --- | --- |
| `image.png`, `context.png` | the two captured screenshots, byte for byte (hash re-read after the copy) |
| `instructions.md` | the neutral instruction text, the module constant `INSTRUCTIONS` |
| `observation.schema.json` | the record schema, the module constant `OBSERVATION_SCHEMA` |
| `packet.json` | `{packetSha256, manifest}` |

`manifest = {schemaVersion:'archive-inverse-observation-packet-v1', files:[{name,bytes,sha256}] (the four files above, by name), captureBinding:{l1SvgSha256, assetResponseSha256, archiveRowSha256, screenshotSha256s}, instructionsSha256, schemaSha256}`
and `packetSha256 = objectSha(manifest)`. `captureBinding` holds hashes only. No plan, label list, spec, SVG source or verdict is in any packet file, and the packet is a function of the
capture alone: preparing twice from one capture gives byte-identical files.

The observer writes `observation.json` into the packet directory (allowed) and, later, ROOT's freeze writes `observation.freeze.json` there. Any other file makes the packet `PACKET_TAMPERED`.

## Observation record (`archive-inverse-observation-record-v1`)

```
{schemaVersion, packetSha256 /* copied from packet.json */,
 observer:{agentKind:'codex'|'claude-code'|'antigravity'|'other', model, sessionRef, isolation:'INSTRUCTED_NOT_ENFORCED'|'ENFORCED', inputsRead:[packet file names]},
 observedAt /* ISO 8601 */,
 labels:[{text}], segments:[{between:[labelText,labelText]}], lines:[{through:[labelText,...]}],
 circles:[{center:labelText|null, through:[labelText,...]}], rightAngles:[{at:labelText}],
 otherMarks:[{description}], readability:[{issue, target:labelText|null}], unobservable:[{description}]}
```

There is no status, verdict or pass field, and no field outside the schema is accepted. Limits (`OBSERVATION_LIMITS`, in the schema file too): file 262144 bytes; label text 120 characters;
descriptions and issues 500; `model` 100; `sessionRef` 200; `inputsRead` 1..20 distinct names; `through` 50; labels 200, segments 200, lines 100, circles 50, rightAngles 50, otherMarks 100,
readability 100, unobservable 100. Strings are counted in UTF-16 units; label-like strings may not contain control characters or be empty after normalization.
`agentKind` is recorded and compared with nothing: no code path depends on it (a test scans the source for that).

`isolation` is what the observer says. The module does not verify it: `INSTRUCTED_NOT_ENFORCED` is the honest value for an agent that was only told not to look elsewhere, and the receipt says
`isolationEnforcementVerified: false` whatever was written.

## Freeze (`freezeInverseObservation`)

Checks the packet's integrity like bind does (everything except its binding to a capture, which freeze, taking no capture, cannot see; bind checks that), then writes `observation.freeze.json` with the SHA-256 and size of the observation file's raw bytes, the time and `packetSha256`, using an exclusive create.
It does not judge the record. A second freeze, of the same or a changed record, is `FREEZE_EXISTS` and leaves the file alone. A missing or oversized observation file is `OBSERVATION_INVALID`
(`FILE_UNREADABLE`, `TOO_LARGE`).

The freeze is a tripwire against changes inside the flow (an observer editing its record after being shown a result, a record swapped between freeze and bind), not against someone with write
access to the packet directory, who could also rewrite the freeze file. So: freeze **immediately** after the observer says it is done, and keep the returned `freezeRef` outside the packet directory;
`receipt.freezeSha256` must equal it. A freeze that already exists when you try to freeze (`FREEZE_EXISTS`) was not made by you: do not trust it.

## Bind (`bindInverseObservation`) and its statuses

In this order; the first failure is returned as `{status, detail}` and nothing is compared:

| status | `detail.reason` (the exact axis) |
| --- | --- |
| `CAPTURE_INPUT_INVALID` | the capture is not an `ARCHIVE_BOUND`, hook-free R1-a result (`NOT_AN_OBJECT`, `SCHEMA_VERSION`, `STATUS_NOT_ARCHIVE_BOUND`, `EVIDENCE_NOT_NO_CALLER_HOOK`, `CHECKS_NOT_PASS`, `LINEAGE_MISSING`, `LINEAGE_HASH_INVALID`, `ASSET_RESPONSE_NOT_L1_BYTES`; in prepare also `SCREENSHOT_*`, `ARCHIVE_ROW_*`: `_PATH_INVALID`, `_PATH_SCOPE`, `_UNREADABLE`, `_SHA_MISMATCH`, `SCREENSHOT_NOT_PNG`) |
| `PACKET_TAMPERED` | `PACKET_DIR_MISSING`, `NOT_A_REGULAR_FILE`, `EXTRA_FILE`, `PACKET_JSON_MISSING`, `PACKET_JSON_INVALID`, `PACKET_SHA_MISMATCH`, `FILE_MISSING`, `FILE_SHA_MISMATCH` (name), `IMAGE_NOT_CAPTURE`, `CAPTURE_BINDING_MISMATCH` |
| `OBSERVATION_NOT_FROZEN` | `NO_FREEZE_FILE`, `FREEZE_UNREADABLE`, `FREEZE_FOR_OTHER_PACKET` |
| `OBSERVATION_CHANGED_AFTER_FREEZE` | `OBSERVATION_BYTES_CHANGED` (frozen and current hashes), `OBSERVATION_FILE_MISSING`/`_TOO_LARGE`/`_UNREADABLE` |
| `OBSERVATION_INVALID` | `NOT_JSON`, `NOT_AN_OBJECT`, `UNKNOWN_FIELD`, `MISSING_FIELD`, `SCHEMA_VERSION`, `TYPE`, `ENUM`, `FORMAT`, `EMPTY`, `EMPTY_AFTER_NORMALIZATION`, `TOO_LONG`, `TOO_MANY`, `TOO_FEW`, `LENGTH`, `DUPLICATE`, `CONTROL_CHAR`, with `detail.path` like `$.labels[0].text` |
| `OBSERVATION_PACKET_MISMATCH` | the record's `packetSha256` is another packet's |
| `OBSERVER_INPUT_OUT_OF_PACKET` | `inputsRead` names something that is not one of the five packet files (`detail.names`) |
| `EXPECTATION_LINEAGE_MISMATCH` | `COMPOSED_INPUT_INVALID`, `COMPOSED_SVG_SHA`, `PLAN_NOT_CANONICAL`/`PLAN_SHA`, `MODEL_NOT_CANONICAL`/`MODEL_SHA`, `IDENTITY_INVALID`, `SPEC_NOT_DERIVABLE`, `SPEC_SHA`, `SVG_NOT_CAPTURED` |
| `EXPECTATION_UNAVAILABLE` | the engine's `prepare` of the spec failed, or the spec has an object kind this module does not map (`UNSUPPORTED_SPEC_OBJECT`) |

`prepare` can also return `PACKET_DIR_INVALID` (not a non-empty string) and `PACKET_WRITE_MISMATCH`.

The lineage check: `objectSha(plan)`, `objectSha(model)` and `objectSha(specFor(plan, model, identity.assetId))` equal `composed.lineage.planSha256/modelSha256/specSha256`; the identity is exactly what
`assetIdentity` derives from itself (the L1 rule); `composed.svg` hashes to `composed.lineage.svgSha256`, which equals `capture.lineage.l1SvgSha256`.

Then the comparison. Every expected item is `matched` or `missing`, every observed item `matched` or `unexpected`, **by occurrence**: the same item twice on one side needs it twice on the other.
`OBSERVED_CONSISTENT` if nothing is missing or unexpected, else `OBSERVED_DISCREPANCY`. `readability`, `unobservable` and `otherMarks` are copied into the receipt and never change the status.

Receipt: `{schemaVersion:'archive-inverse-observation-binding-v1', status, detail:null, packetSha256, observationSha256 /* raw bytes */, freezeSha256 /* raw freeze file bytes */, observer /* as written */,
captureBinding, expectationSha256, matched, missing, unexpected /* each {labels,segments,lines,circles,rightAngles} */, readabilityIssues, unobservable, otherMarks, isolationEnforcementVerified:false,
numericAccuracy, qualification, publication, productionAuthorized}`. `expectationSha256` is `objectSha` of the normalized, sorted expectation `{labels:[text], segments:[[a,b]], lines:[{through:[...]}], circles:[{center,through}], rightAngles:[{at}]}`
(labels sorted as strings; the others by the canonical JSON of each item; set members sorted and unique; segment ends sorted).

## What the spec displays, in the observer's categories

The expectation comes only from the spec that `specFor(plan, model, identity.assetId)` builds (which L1 turned into the SVG) and from the engine's own `prepare` of it; never from the screenshot.

| spec object (`kind`) | observation category | expected item |
| --- | --- | --- |
| text labels: `POINT_NAME`, `COORDINATE_LABEL`, `EQUATION_LABEL`, `LENGTH_LABEL`, and the axis names and tick texts that `spec.axes` makes the engine add | `labels` | the label text (the engine's plain text, normalized), one item per label |
| implicit point name (a `POINT` with no `POINT_NAME` or `COORDINATE_LABEL`) | `labels` | the point id, as the engine's `prepare` labels it |
| `SEGMENT` | `segments` | the two end names, sorted; ends come from `plan.displaySegments[id].refs`, each end's name is its `POINT_NAME` text |
| `LINE`, `AUXILIARY_LINE` (only if the engine draws it, i.e. its id is a prepared primitive) | `lines` | `through` = every labelled `POINT` on the line (`abs(a x + b y + c)` within 1e-9 relative), so a line through two defining points that also passes through a labelled midpoint lists all three |
| `CIRCLE` (only if drawn) | `circles` | `center` = the labelled `POINT` at the circle's centre (else `null`), `through` = every labelled `POINT` on it (distance = radius within 1e-9 relative) |
| `ANGLE_MARK` listed in `displayFacts.squareAngleIds` | `rightAngles` | `at` = the name of the vertex, `refs[1]` |
| `POINT` (the dot) | none | covered by its name label |
| engine axes, unit ticks and tick marks | none (not judged) | the observer is told to describe them in `otherMarks`; their names and numbers are in `labels` |
| anything else (`PERPENDICULAR_MARK`, `FUNCTION_GRAPH`, `CIRCULAR_ARC`, ...) | none | `EXPECTATION_UNAVAILABLE`, never silently skipped |

The label inventory comes from the Python engine's `prepare` (the real `pythonWorker`; there is no injectable worker) because the axis names and tick texts are produced there from `spec.axes` and
the viewport, not listed in `spec.objects`.

## Comparison rules (nothing fuzzy)

- Text normalization (`normalizeObservedText`): Unicode **NFC**, all white space removed, and the look-alikes U+2010, U+2011, U+2212, U+FE63, U+FF0D mapped to ASCII `-`. Nothing else:
  no case folding, no NFKC, no en or em dash, no `O` for `0`, no superscript for digit.
- Sets are exact. A line's `through`, a circle's `through` and a segment's ends compare as sets of normalized names (order is irrelevant; duplicates inside one set are invalid), and **two sets are equal or they are not**:
  an observer that omits an incidental labelled point on a line gets a `missing` plus an `unexpected`, not a subset match. This is deliberate and is the rule the instructions state ("all labelled points").
- Counts are by occurrence (the figure may show `2` on both axes; the observer writes two entries).

## Playing the observer from another tool

The same steps for Codex, Antigravity, Claude Code or a person:

1. You are given **one directory path**, the packet directory, and the sentence "follow instructions.md". Nothing else: not the repository, not the plan, not an earlier receipt, not this file.
2. Read `instructions.md` and `observation.schema.json`, look at `image.png` (the figure) and `context.png` (the figure in its page; only for readability), read `packetSha256` from `packet.json`.
3. Write **one** `observation.json` in that directory, exactly in the schema, with your real `agentKind`, `model`, a `sessionRef` that lets the operator find your session, `isolation: 'INSTRUCTED_NOT_ENFORCED'`
   (unless the operator enforced isolation and told you so), and `inputsRead` = the packet files you actually opened.
4. Do not open anything outside the directory, do not write a verdict or any other field, do not estimate coordinates, lengths or angles, do not "fix" what looks odd, and do not edit the file afterwards.
5. Tell the operator it is done. The operator freezes the file at once.

Operator side: hand over the packet directory only; freeze right away and keep `freezeRef`; bind once. **Record whatever the receipt says**, including `OBSERVED_DISCREPANCY`. Do not ask for another observation until one
matches (that selects the observation instead of reading the figure), do not edit the record, and do not show the observer the expectation, the plan or the previous receipt. If a second observation is wanted for a
real reason (a changed capture), it is a new capture, a new packet and a new observer session, and both receipts are kept.

## Limits and what is NOT_RUN

- Not run here: any real AI observation (the tests use hand-made records only), qualification, publication, push, main, deploy, the four-profile audit, repeated questions.
- `isolation` is a statement, not a control: the module cannot make an agent on the same machine unable to read the repository. The packet keeps expected information out of the files it gives the observer; it cannot stop
  an observer that disobeys the instruction and looks elsewhere (`inputsRead` is that observer's own report).
- `context.png` is the Archive page as the student sees it. In a real exam it carries the question text and the solution text next to the figure; the module does not remove or mask them (the packet is built
  from the capture as it is), and the instructions tell the observer to read the figure's items from `image.png` only. Whether the surrounding text biased an observer cannot be told from the record.
- The freeze is not tamper-proof against a party that can write the packet directory (see above). `observation.json` inside the packet directory is allowed so that an observer who knows only that directory can deliver it.
- What the observer reads is compared as text. A figure is rendered with math typesetting (stacked fractions, radicals, superscripts); the instructions ask for the engine's one-line plain form (`1/2`, `√(3)`, `x^(2)`, `·`; a negative sign may be any of the minus look-alikes), and an observer who writes
  something else (`√3`, `x²`, `x^2`) gets a discrepancy, not a guess. Labels the engine renders differently from its plain text are the first thing to look at in a discrepancy.
- Collinear or concyclic labelled points that the figure merely happens to have are part of the expected `through` sets; features that coincide on screen (a segment lying on an axis) cannot be told apart by looking.
- The comparison covers what the observer is asked for. A stray drawn element can hide in `otherMarks` (passed through, never judged); the receipt carries it so the operator sees it.
- `capture.paths.archiveRow` must be a file under `.tmp/archive/`; the module checks its hash against the lineage but not that it was produced by the Archive.
- The first versions of the checks assume the L1 construction family (`construction-spike-v1`, `line_circle_geometry`): other spec kinds are refused by `EXPECTATION_UNAVAILABLE`.

## Tests

`../tests/archive-inverse-observation-v1.test.mjs` (real SymPy worker, real Chrome, real L1; no provider). Every observation record is a **hand-made fixture**, not an AI observation. Most cases use a hand-built capture
around a real L1 SVG and real Chrome PNGs of its bytes (`fixtureClassification: 'HAND_BUILT_CAPTURE_REAL_PNG'`; the "raw row" is a stand-in file), plan P (right triangle, circumcircle, two lines, right-angle mark) and
plan Q (the L1 base triangle, repeated tick texts); test R runs the real R1-a path (measure, L1, `captureArchiveCandidate`, real `engine.html`) and binds a packet from that capture.
