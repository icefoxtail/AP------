# M2 current renderer refresh v1

This opt-in transports already reviewed M2 second-semester metadata across a narrowly evidenced presentation change. It creates no mathematical, difficulty, primary, curriculum, CC or Condition approval. Source and asset files are inputs, not outputs.

The existing `archive-reviewed-m2-current-renderer-continuity-v1` contract remains unchanged: a native PNG with absent `imageSize` may become a scalar SVG with `imageSize: "full"`, with its original independent witness and frozen metadata request. M3 contracts are unchanged.

## Entry and modes

The new request entry is `sourceReview.m2RendererProof` with exactly `schemaVersion`, `reviewCommit` and `reviewRef`. Its schema is `archive-reviewed-m2-current-renderer-refresh-v1`; its SHA-bound immutable evidence lives at `.archive-meta-register/evidence/m2-current-renderer-refresh-<name>/transport.json`.

The evidence schema is `archive-m2-current-renderer-refresh-v1`, scope `M2_EXISTING_METADATA_WITH_CURRENT_RENDERER_REFRESH`. The transport author is recorded separately from the actual observer. Its selected UID set has one to three unique rows. Both the request approval and every selected item must bind the relevant raw evidence and complete asset inventory.

| Mode | Permitted change | Observation authority |
| --- | --- | --- |
| `DIRECT_NATIVE_TO_TALL` | Native PNG to SVG; absent `imageSize` to `tall`; absent `imageAlt` to plain text; `grid` or `subjective-2up` to `fullwidth`. All four fields must change, all other fields must remain equal. | An exact row from an immutable `root-targeted-m2-renderer-direct-observations-v1` document. The raw reviewer and time, source refs, two actually viewed primary asset refs, preserved conditions and unchanged stem/choices are checked directly. Answer/solution comparison remains explicitly byte-only. |
| `REUSE_EXACT_V1_OBSERVATION` | The source file may have a new blob, but the selected **whole question object** and every referenced asset must equal the original v1 observation. | A single original v1 leaf is fully replayed on every invocation. Its raw reviewer, observation time and row SHA are preserved. Both wrapper and row require `newObservation: false`. Refresh-to-refresh parents and recursive chains are rejected. |

Neither mode accepts registry changes, source-only preservation mixed into the same item, M3 renderer proofs, or M2 provider renderer proofs. Existing partial `FINAL_QA`, native schema, KEEP/CORRECT disposition and exact finalization-v3 XOR retained-fields-v1 authority remain mandatory. Native authority holds and all ordinary canonical, parent, scope, retained-primary and proposal checks run unchanged.

## Frozen metadata and current source

The direct mode reuses the original private v1 verification core with a fixed `tall` transition. The two independent axes remain necessary:

1. Production before → production current and frozen candidate → current candidate have exactly the same four presentation changes.
2. Production before → frozen candidate and production current → current candidate contain exactly the same approved metadata additions. Student payload is equal on both metadata axes; every added value must be explicit in the immutable frozen request's `after`.

The frozen candidate is the exact immutable native student payload. Returning that object as the semantic verification view does not approve its metadata. The original native/proposal/retained validators still validate all requested values. Source fingerprints describe the actual current payload.

The reuse mode first checks the immutable source ref and expected blob of the sealed request, selected whole-object equality, complete asset equality and all live asset bytes. The registrar and native ancestry verifier authenticate the actual source bytes. A later source-only descendant may have a newer whole-file blob, but its formal ancestry replay must retain the selected whole object and the original sealed request. The helper then replays the original v1 validator with the original source-file blob as a historical binding only. No semantic field or question object is substituted. The returned durable proof records both the freshly bound source and the original fully replayed leaf.

## Raw observation and renderer checks

Direct tall observations must be present as raw immutable Git bytes and as SHA-bound live dependencies. The selected raw row hash, source UID/ordinal, original/current Git refs, original/current primary asset refs, actually-viewed flags and honest observation scope are required. Neither a transport author nor the native reviewer may impersonate the independent current observer.

Every referenced renderer asset, including unchanged solutions, is checked in the native/frozen, current immutable and live states. External or nested renderer dependencies, SVG script/foreignObject/image, SMIL animation, CSS animation/keyframes, stylesheet imports and encoded dependency/style forms are rejected for the new refresh contract. Changing an observed asset requires a new actual observation; rehashing a wrapper cannot establish continuity.

The original v1 witness's shape and acceptance conditions are not broadened by this additional contract.

## Durable replay and removal resistance

The ordinary writer-generated `.source-review-binding.json` seals the exact source-review request and its `m2RendererContinuity` result. Normal runtime reuse replays that request and all native/renderer authorities. There is no success-result cache.

The HEAD-ancestor claim inventory includes refresh transport documents as well as original v1 witnesses. This index establishes only a proof obligation, never approval. It is read from all actual HEAD ancestors, including merge parents, and is cached only by immutable HEAD. A committed deletion, empty replacement, missing sidecar or coordinated marker/evidence stripping must not permit ordinary native fallback. Git failures fail closed. Unmerged branches cannot create an obligation.

## Verification boundary

Targeted tests cover direct raw evidence, source/metadata axes, the exact tall type, retained authority replay, dynamic assets, original v1 whole-object reuse, one-leaf restrictions and official writer dry/write/replay. Warm and fresh-process runtime probes must reject combined committed proof/marker deletion on old and caught-up source cursors. Existing v1 tests remain mandatory regression coverage. Real production packets still require current source bindings, exact dependencies and official registrar/Consumer verification; synthetic test success is not production registration.
