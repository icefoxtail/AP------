# M2 finalized curriculum transport v1

The optional `sourceReview.proposalFinalization.curriculumTransport` carries one
already reviewed curriculum value into an ordinary partial FINAL_QA registration.
It is available only inside `archive-native-proposal-finalization-v3`:

```json
{
  "curriculumTransport": {
    "schemaVersion": "archive-native-m2-finalized-curriculum-v1"
  }
}
```

The existing v3 native item, selected proposal, independent original witness,
Git source snapshots, renderer inventory, exact ACTIVE primary context, and
add-only definition guards all execute first. The witness must bind the exact
immutable native RPM row with curriculum `2015` and scope `M2-2`. This transport
does not infer a curriculum from grade, year, labels, or the request flag.

The request must explicitly carry `before.curriculum: null` and
`after.curriculum: "2015"`. Native `after`, both immutable native sources, the
independent source snapshot, the current source, and the original metadata row
must lack both curriculum properties (`curriculum` and `curriculumKey`). An
own-property with null, an existing matching value, or a conflicting value is
rejected. The source must belong to the M2 second-semester original-exam paths.
Only add-only v3 finalizations qualify; reuse-only dispositions and other
source-review adapters cannot opt in.

The same narrow route also requires the original native/source/metadata course
and semester aliases to be absent (`courseKey`, `courseSemester`, `semester`,
`grade`, `gradeKey`). It cannot replace an existing declaration, including an own-null or a
matching value. The request cannot add those aliases. Issued replay may retain
only the registrar-derived `courseKey: "중2 수학"`; a conflicting grade or semester
remains a refusal even when the curriculum properties were originally absent.
This course-alias restriction was added before this named opt-in was published
or issued on public main. The actual125 validation independently records the
original absence for all five affected rows; its private issued proof shape is
unchanged, and those receipts must replay under the final stricter guard.

The ordinary v3 source-field equality loop is unchanged. The additional
curriculum is recorded separately as a metadata-only transport proof, including
the original absence, immutable native item and RPM hashes, and the exact year
and scope. The existing typed source-review sidecar seals the full request and
proof. On replay, the already authenticated issued proof is required to restore
the original absent metadata context from the registrar's null-valued before
merge. Changed or omitted issued proofs are refused. The original native review
and source bytes remain unchanged; this creates no new mathematical, difficulty,
classification, or REVIEW2 judgment.

Current candidate input profiles remain closed. A candidate produced with the
original immutable request may receive an explicit child commit containing the
completed registration request and this option. The original candidate input,
materialization receipt, source hashes, and generated source bytes remain
unchanged. The child request gets its own hash and is independently checked by
the ordinary registrar, replay, and Consumer gates.
