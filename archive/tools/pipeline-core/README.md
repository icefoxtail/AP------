# APMath common pipeline core

One fail-closed quality contract for archive pipelines. This is a verifier and
bounded generator library, not a general theorem prover or publication tool.
Every PASS declares its scope; `productionAuthorized` remains false.

## Routes and integration

| Pipeline | Connected boundary | Scope |
|---|---|---|
| logic-visual | typed parity, adaptive manifest, native final report | Question quality |
| geometry-equation | S15 compatibility finalizer | Question quality |
| function-family | candidate-only numeric generation, local report/common audit | Question quality |
| high1-svg | line finalizer/common audit for other unit manifests | Question quality |
| set-visual-pilot | candidate-only generator and JS attachment | Question quality |
| past-exam | reviewed promotion binds actual JS/all copied assets | Question quality |
| textbook | extraction execution separate from final quality closure | Question quality |
| alive | Python final closure invokes this same Node verifier | Question quality |
| tag-enrichment | strict identity and quality command | Metadata only |
| js-bank-cleanup | canonical master routing, strict identity/quality command | Metadata only |
| intelligence | cross-unit/manual-label promotion validates reviewed bytes | Metadata only |

Historical per-question repair scripts and reports remain diagnostics, not new
quality authority. Other unit runs use the generic CLI instead of another
hard-coded batch finalizer. Old PASS records are not converted into fresh reviews.

## Commands from the repository root

```powershell
node archive/tools/pipeline-core/cli.mjs rules
node archive/tools/pipeline-core/cli.mjs inventory
node archive/tools/pipeline-core/cli.mjs template --pipeline logic-visual --out <NEW-template.json>
node archive/tools/pipeline-core/cli.mjs prepare --pipeline logic-visual --run-id <new-id> --source <source.js> --candidate <candidate.js> --workdir archive/_generated/pipeline-runs/<new-id>
node archive/tools/pipeline-core/cli.mjs fact --file <typed-fact.json>
node archive/tools/pipeline-core/cli.mjs parity --expected <expected.json> --observed <observed.json>
python -X utf8 archive/tools/pipeline-core/generator.py --fact <typed-fact.json> --out <NEW-candidate.svg> --evidence <NEW-generator-witness.json>
node archive/tools/pipeline-core/cli.mjs render --manifest <run.json> --workdir archive/_generated/pipeline-renders/<new-attempt>
node archive/tools/pipeline-core/cli.mjs audit --pipeline logic-visual --manifest <run.json> --out <NEW-closure.json>
npm --prefix archive/tools/pipeline-core test
```

`prepare` writes blind bundle drafts and a non-executable run draft. It never
invents reviewers, final necessity or PASS. Source/candidate must be separate
JS files with explicit matching ids. Inline visuals and nontrivial id remapping
require an explicit route adapter; the generic preparer does not guess them.

The render collector uses Playwright and a locally installed Chrome channel.
Use the environment's Playwright or set `APMATH_NODE_MODULES` to its configured
Node node_modules directory. No browser is installed automatically. It serves
the unchanged production engine with bound candidate JS/assets. Captures return
`CAPTURED_REVIEW_REQUIRED`: a separate reviewer must inspect all saved screens
and close clipping/overflow/readability in a new frozen evidence record.
Solution-mode captures must never be fed to artifact-only V2.

## File identity and schemas

All input/evidence/witness references use actual raw bytes:

```json
{"path":"repo/relative/file.json","bytes":123,"sha256":"sha256:<64 lowercase hex>"}
```

Use `fileRef`, `readBoundFile` and `objectSha` from `canonical.mjs`. Raw hashes
preserve CRLF/LF. Canonical objects use NFC, sorted object keys, safe finite
numbers and ordered arrays. Only typed SET collections are sorted. Traversal
and symlink escapes are rejected. Reports and first-pass files are append-only.

- Run: `APMATH_PIPELINE_RUN_v1`
- Review: `APMATH_PIPELINE_EVIDENCE_v1`
- Visual: `APMATH_VISUAL_FACT_v2`
- Generator: `APMATH_GENERATOR_WITNESS_v1`
- Result: `APMATH_PIPELINE_CLOSURE_v1`

Run requires pipeline/runId/revision, builderSessionId, canonicalRecordId,
inputs, questions, evidence, registry, inputSha and denominator. Each input has
a role from `profiles.json`. Source/candidate/rule/spec/verifier are mandatory;
rendering also requires the real engine input. Optional `assetRoot` maps JS asset
references into a staged archive tree; every actual file still has a raw hash.

Each question contains questionUid (`sourcePath|actual source examTitle|qid`),
examId/qid/sourcePath/candidatePath/sourceStatus, visual requirement/action,
independent adjudication id/status, attached/problem/shared dependency booleans,
an exemptReason when applicable, solutionAssetPaths/problemAssetPaths, and an
axis→evidenceId map. ADD/REBUILD also require generationEvidence. Metadata-only
routes cannot change content/choices/answer/solution/assets/layoutTag/wide.

Registry records require recordId/batchId/revision/supersedes/isCanonical/
inputSha/questionUids. Exactly one active record may contain a UID. Alias UIDs
cannot double-count the same source/qid. No filename-final or higher-batch winner.

`runInputSha(run)` binds raw inputs, scope/order and the core implementation.
Review decisions are outputs, not inputs to the blind source pass. The final
requirement map is separately bound by `denominatorInput(run)` and V3. Changed
bytes/spec/tool require new input evidence. A decision-only change invalidates
the denominator and V3 without rewriting V1/V2 facts to force agreement.

## Evidence fields and responsibilities

Each review has evidenceId/runId/revision/questionUid/axis, inputSha,
reviewStartInputSha/reviewEndInputSha, reviewerId/reviewSessionId/
reviewerModelOrAgent, priorReviewVisibility, startedAt/frozenAt, status,
validityStatus, findings and payload. New records start NOT_TESTED/DRAFT.
Final records require explicit PASS, VALID/FROZEN and zero unresolved findings.

- Math preserves actual A1 workings and A2 comparison. Payload records
  blindSolveFrozen/allChoicesChecked/answerUnique; booleans are not a substitute
  for the reviewer's calculation evidence.
- V1 uses SOURCE_ONLY, freshBlind=true, inputBundle raw ref, necessity signal,
  specSha and independently derived fact. Every quality target needs V1 triage;
  a genuinely exempt row may have fact=null but is not a visual parity PASS.
- V2 uses ARTIFACT_ONLY, freshBlind=true, inputBundle ref, fact/specSha,
  artifactPath/artifactSha and `structureFingerprint(fact)`. Its bundle excludes
  expected/answer/solution/alt/caption. Intended-meaning accessibility metadata
  is not independent observation.
- V3 uses FROZEN_V1_V2 after both first-pass freezes. It binds v1EvidenceSha,
  v2EvidenceSha, finalVisualRequirement and cDenominatorInputSha. Separate checks:
  necessity, decisiveStep, completeness, mediumFit, solutionParity,
  altCaptionParity, semanticsLocks, staticContract.

Builder/V1/V2/V3 session ids differ. The code validates declared provenance and
immutable inputs; actual isolation from undisclosed file reads remains the
orchestrator's responsibility. No model name itself proves independence.

## Typed visuals and bounded generation

`visual-contract.json` is authoritative for types/values/collection semantics.
Families: set-regions, set-inclusion, set-cardinality, number-line, case-table,
cartesian, geometry, proof-flow and quantifier-negation.

Semantic hashes exclude UID/provenance/pixel coordinates. Narrative wording is
schema-required and reviewed by V3 decisive/completeness gates, not equated with
mathematical identity. Set IDs use a fixed symbolic order with bit masks.
Proof order, interval order and table columns/cells remain meaningful.
`LOGIC_VISUAL_FACT_v1` evidence is historical; no implicit field conversion.

Python computes coordinates, supported circle/segment relations, extrema and
polynomial samples. The polynomial evaluator allows x, numeric constants,
+/−/×, bounded integer powers and division by a constant. Arbitrary rational,
radical or symbolic formulas use the specialist route, not an unsafe fallback.
General geometric claims still require independent verification. Raw-TeX or
overlong labels fail rather than being silently shrunk or published.

Generator witnesses are BUILD_SIDE_ONLY with generator/rule/spec/fact/asset SHA
and numeric primitives. They never supply independent or render PASS. Legacy
function/set generators now default to candidate trees under
`archive/_generated/visual-candidates/<pipeline>/archive/`; changed candidates
need a new output directory. The existing production assets are not regenerated.

## Final closure

C required = REQUIRED OR actual attached OR problem/shared math dependency.
OPTIONAL does not remove an attached visual. EXEMPT requires no dependencies.
Final map adjudication is bound to V3, or exempt V1 when no visual is used.
Frozen denominator input/UID set/SHA must match the current recomputation.

Render cases cover candidate file × required mode × desktop/mobile. Each case
binds selected UIDs, full candidate count/last id, actual asset associations and
per-item viewport PNGs. Dimensions, CRCs and decompression are checked. Valid PNG
bytes do not prove readability; a separate reviewer must inspect the screen.

Exact/structural duplicates trigger adjudication bound to the pair, current bytes
and semantic hashes. Exact shared reuse additionally requires the same meaning
and explicit provenance. Fingerprints find structural families; they do not
prove all possible graph isomorphisms. Relabeling invalidates pair approval.

Any applicable FAIL/BLOCKED/WARN/NOT_TESTED/missing/stale evidence blocks PASS.
Extraction completion and local build checks never substitute for quality closure.

## Native migration and tests

Guarded finalizers/promotions take `--closure-manifest <run.json>` and optional
`--out <NEW.json>`. They compare the actual caller scope/output with the reviewed
scope. A small unrelated passing run cannot authorize a larger native batch.
ALIVE reads `<input>.closure.json` or explicit `--closure-manifest` on its
final-closure-audit command. Closed runs are not rewritten; use a new/derived run.

Tests use synthetic review fixtures in OS temporary directories, never real
review/holdout certification. Run software regressions, then representative real
calibration and an unseen holdout before increasing the production batch size.
