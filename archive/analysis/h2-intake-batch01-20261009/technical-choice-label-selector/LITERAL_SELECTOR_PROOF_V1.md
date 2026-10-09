# Literal selector proof usage and portability

The validator accepts literal selector choices only through this proof object on the matching qid row in the full-qid `artifactDispositions.rows` array. This location keeps the proof available to CREATE/R1/R2 and R3 while allowing R3 `rows` to remain limited to its targeted review scope. The container `artifactDispositions.artifactSha`, proof `artifactSha`, and current evidence `artifactSha` must all be identical.

```json
{
  "qid": 4,
  "literalChoiceSelectorProof": {
    "schemaVersion": "JS_ARCHIVE_LITERAL_SELECTOR_PROOF_V1",
    "qid": 4,
    "artifactSha": "<current evidence artifactSha>",
    "studentPayloadSha256": "<SHA-256 of normalized current student payload JSON>",
    "choicesSha256": "<objectSha of the current exact choices array>",
    "markers": ["①", "②", "③", "④", "⑤"],
    "sourceParity": {
      "sourceArchiveFile": "archive/exams/original/high/h2/1mid/<examUid>.js",
      "sourceOrdinal": 4,
      "baselineSourceRawSha256": "<64 lowercase hex chars>",
      "choicesExact": true
    },
    "sourceReference": {
      "kind": "PROBLEM_ASSET",
      "ref": "assets/images/<exam>/q04.png",
      "assetSha256": "<SHA-256 of current bytes under assigned assetRoot>",
      "opened": true,
      "sourceFidelity": "EXACT_EXTRACTED_IMAGE",
      "markersObserved": ["①", "②", "③", "④", "⑤"],
      "observation": "The opened source image shows the five ordered selector glyphs."
    }
  }
}
```

For `QUESTION_CONTENT`, use `sourceReference: {kind:"QUESTION_CONTENT", field:"content", contentSha256:<objectSha of current question.content>, markersObserved:[...], reviewed:true, observation:<source-grounded observation>}`. The validator checks the current content hash and that all five glyphs occur in order in that content.

For `PROBLEM_ASSET`, the ref must match the current question's `image` or `visualAsset`; the validator reads bytes from the assigned actual asset root and checks `assetSha256`. `opened` must be true, source fidelity exact, and the proof must include a nonempty observation plus the exact ordered markers seen in the pixels. The observation records the human pixel check; the validator confirms its current source reference and bytes.

`studentPayloadSha256` must match `normalizeStudentBundle` exactly: project the current question with its existing object-entry order through the `STUDENT_FIELDS` whitelist, serialize that ordered object as JSON, then SHA-256 hash it. Do not rebuild the object in whitelist order or strip fields from choice objects before hashing. It includes the current choices, content, image refs, and display controls; only the exact string marker list can qualify for this proof. `sourceParity.sourceOrdinal` must equal the qid. The normalized `sourceArchiveFile` must be an original high-school exam under `archive/exams/original/high/h1|h2|h3/`, and its basename must equal the current evidence `examUid`. When a stage row includes current source parity, the proof path, ordinal, immutable baseline source SHA, and exact-choice disposition must agree with it. The proof also must agree with `sourceIdentity.productionRelativePath` or `sourceIdentity.sourceArchiveFile`, and with explicit baseline fields such as `sourceIdentity.extractedBaselineSha256` when present. Current-source fields such as `expectedSourceRawSha256` and `sourceInputArtifactSha256` are separate bindings and must not replace the immutable baseline SHA.

The only accepted choices are five exact strings in the order `①` through `⑤`. `preserveChoicePrefixes` must be exactly false or omitted; true and other truthy/nonboolean values retain source glyph text and duplicate engine-owned labels. Appended text, reordering, repeats, partial/extra/unknown/empty lists, missing references, stale artifact/payload/choice/content/asset hashes, and failed source parity keep the existing errors or fail the proof. A present but invalid proof reports `ARTIFACT_CHOICE_LITERAL_SELECTOR_PROOF_INVALID:q<qid>`; unsupported lists made entirely of circled glyphs also report `ARTIFACT_CHOICE_LITERAL_SELECTOR_UNSUPPORTED:q<qid>`. A normal subjective empty `choices` array with no selector proof remains valid.

This proof only classifies how a source literal selector list is rendered. It does not establish answer correctness or replace independent CREATE/R1/R2 review or R3 rendering.
