# Current M2-S2 source continuity for an existing full four-slot vector

This opt-in transports a previously accepted full M2-S2 compact to an exactly
observed current source. It does not author slot values, decide mathematical
correctness, modify source or assets, approve metadata, or release a held UID.
The ordinary importer, M3 current-negative v1/v2, and private partial intake
keep their separate contracts.

## Authority and complete source partition

The carrier schema is **m2-s2-current-four-slot-continuity-v1**, with scope
**KEEP_EXACT_EXISTING_M2S2_FOUR_SLOT_VECTOR**. Its immutable repository path
ends in m2-current-four-slot-transport.json. Sources and compacts are restricted
to original/middle/m2/2mid/ and 2final/.

Every input is read from raw Git bytes using full commit IDs, safe repository
paths, SHA-256, and Git blob IDs for source, compact, dictionary and assets.
Live current source, dictionary, assets and typed proof files must match those
immutable bytes. This happens before any runtime cache reuse.

The original authority is an actual archive-meta-4slot-v0 file under
archive/data/meta-review/m2-s2-20261114/exams/E***/four-slot.json and its matching
immutable review.json, root-acceptance.json and independent-sample.json.
The existing compact's top native, ROOT and independent references must identify
those same files. ROOT must have accepted the exact source and all three hashes
with PRO_REVIEW_COMPLETE and sourceUnchanged=true. This preserves the actual old
review scope; it does not assert a fresh full mathematical recheck.

The native source snapshot is at the native review commit. Its entire student
payload and every referenced asset remain exact in the prior compact's source
snapshot, as declared by that compact's existing UNCHANGED_STUDENT_PAYLOAD
source-reuse chain. The official dictionary importer projects every original
native row again. All four slots, format and candidates equal the prior compact,
joined by actual canonical UID, source ordinal and displayed number. No UID is
minted or reassigned.

Each full source is partitioned exactly once into:

- retainedOrdinals: actual current renderer observations, including explicitly
  independently confirmed removal of derived annotations.
- bodyTranscriptionOrdinals: the separately described proof-text transport.
- heldOrdinals: actual independent current renderer discrepancies.
- unchangedOrdinals: whole question object, student payload, asset paths and
  raw asset bytes are unchanged across prior Git, current Git and live files.

The current and prior source counts, prior/current compact counts, all original
native rows and this partition have the same denominator. An omitted row,
overlap, partial schema or unknown field fails closed. The compact may change
only its source binding, the explicit evidence.currentM2Continuity group and
the declared holds. Existing vectors and reviewedBy remain exact as parsed
values.

## Typed observations retain their actual original evidence

The observation schema is
**archive-m2s2-current-four-slot-continuity-review-v1**. It binds the immutable
original m2s2-current-four-slot-actual-observation-v1 report. Every selected row
retains that report's actual observer, UID, source ordinal, whole-question and
student hashes, compact vector and hash, changed-field set, source snapshots,
capture SHA and actual-reading assertions. The original raw card's complete
prior/current asset references and whole-question hashes must equal the typed
row; a new asset at an unchanged path cannot inherit the old observation. The ordinary renderer route also
requires the original RETAIN_EXISTING_VECTOR decision. A typed wrapper cannot
turn an unobserved or pending row into that decision.

The actual root closure is separately typed as
**archive-m2s2-current-four-slot-root-closure-v1**, with scope
**EXISTING_VECTOR_CURRENT_SOURCE_CONTINUITY_ONLY**. Its path ends in
m2-current-four-slot-root-closure.json; its reviewer differs from the transport
author. It binds and replays the actual
m2s2-wave131-root-independent-observation-v1 report. The complete row set,
decisions, hashes, capture references, source/asset snapshots, reading
assertions and proof-transcription fields match that original. No row from the
original closure can be silently omitted.

These records describe actual reading of the current stem, choices, existing
answer and solution, native vector and prior/current renderers. They do not
claim a browser session when the actual observer used another renderer.
Every approval and mutation counter in the typed contract is zero.

## Three distinct changed-source kinds

### Renderer presentation

RENDERER_PRESENTATION_CONTINUITY permits only named image, image-alt,
image-size, layout and solution-image presentation fields. An image reference
remains a local scalar asset path. Source prose, choices, answer, written
solution and metadata values remain exact.

One static local image may be appended to content after a byte-exact copy of
the existing content. The suffix is exactly one br and one img; only unique
src, alt and static style attributes are accepted. This does not permit text
replacement, additional prose, duplicate source attributes or remote style
dependencies.

ANNOTATION_ONLY_REMOVAL_CONTINUITY has the same field restrictions and also
requires the actual independent root closure. It is not a general permission
to remove a given condition.

All current SVGs are static and self-contained. Scripts, event handlers,
foreign objects, SMIL (including prefixed tags), CSS animation/transitions,
stylesheet imports and unbound remote/nested references
are refused. Embedded base64 image data is bound by the enclosing raw SVG;
embedded SVGs are checked recursively, including uppercase SVG extensions.
Escaped CSS or entities inside CSS are outside this static-only contract.
Actual recorded observation remains
mandatory; static parsing is not a visual approval.

### Proof body transcription

BODY_TRANSCRIPTION_CONTINUITY is a separate kind. Its exact changed-field set
is content, image, layoutTag. Every other question field, including choices,
answer, written solution and metadata, remains exact. An explicit empty image
string is accepted only in this body branch when the prior source has a real
figure and the current proof HTML still references a local, raw-bound inspected
figure. This requires an actual img token with a quoted local src; a path in
prose, an HTML comment, another attribute or a raw-text element is insufficient.
The token reader keeps quoted attribute boundaries and rejects unsupported
image attributes and nonlocal styles. Both inline-image routes also reject
CSS escapes and HTML entities in style values, preserving the same closed
renderer dependency boundary as the static SVG inputs. The ordinary renderer route still rejects
an empty image.
It is not an exception
for arbitrary body edits or previously approved metadata appends. HTML or
Markdown table transcription is outside this version.

The root closure must have actually compared the old scanned proof and ordered
blanks with the current HTML proof. It records:

- Exact raw UTF-8 hashes of prior and current content strings.
- PROOF_TEXT_WITH_ORDERED_BLANKS.
- Preserved literal statements, given conditions and blank order, with no added
  hint or inference.
- The same prior/current blank-label order and explicit current blankSpans.
  Offsets are JavaScript UTF-16 code units; each nonoverlapping span literally
  contains the declared label, in the declared order.

The typed fields match the root's immutable original observation. The code does
not manufacture an OCR comparison or infer a new mathematical approval.
A general HTML/image-stripping normalization cannot establish this authority.

### Independent negative observation

WITHHOLD_CURRENT_RENDERER requires the exact original root observation and its
reason. A truthful priorProblemAsset=false is accepted only for a negative
row whose actual prior source has exactly zero referenced assets; all raw and
typed prior asset sets must also be empty. It cannot release the UID or excuse
an unviewed existing asset. The original slot row stays intact with an additional
**4slot-m2s2-current-renderer-hold-v1** marker. It emits
EXPLICIT_REVIEW_HOLD:SOURCE_RENDERER_CORRECTION_PENDING, remains absent from
the active Consumer index, and does not block otherwise valid peers once the
complete full-file proof validates.

## Obligations, cache and later runs

A pass-local inventory reads actual immutable HEAD ancestry with
git log --full-history, including evidence removed by a later merge.
Historical carrier records require typed transport to remain present;
historical negative rows require every held UID to remain explicitly held.
This inventory records obligations only and cannot approve values or cache
successful validation.

Removing current markers, deleting sidecars, committing their deletion, or
choosing a merge result that omits an issued witness does not release a held
UID or make a body transcription ordinary. Missing Git/history fails closed.
Later correction or release needs its own explicit approved contract.

All proof digests and the obligation inventory enter the builder fingerprint.
The helper enters BUILDER_SHA. Mutable current source, proof and asset bytes
are rechecked before cache reuse. No approval-result cache or stale-payload
bypass is introduced.

## Verification

tests/item-4slot-m2s2-current-continuity.test.cjs uses isolated synthetic Git
repositories, distinct original/current snapshots and original/typed proof
commits. It checks mixed full-file registration, Consumer exclusion,
write/check replay, exact original vectors and source preservation; then
mutates authority, partition, body fields, blank order, raw observation,
renderer dependencies, UID, live input and committed proof ancestry.

The ordinary runtime and M3 v1/v2 suites remain required regressions. An actual
production packet additionally requires immutable publication of its actual
raw observations and typed proofs, exact final-head validation by the official
builder/Consumer/replay, and normal PR/main gates. Synthetic fixtures and static
code reading are not production registration evidence.
