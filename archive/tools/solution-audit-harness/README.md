# Gemini Drive-only Solution Audit Harness — P0 (shadow / opt-in)

**Scope:** Read-only input extraction and fail-closed *structural* checking for `archive/exams/original/**/_기출.js`. Gemini cannot read Git or Notion. Run commands **only from an external Git-capable worker**. The harness does not modify exam JS, Gemini schedules/prompts, existing reports, or approvals, and it cannot publish `READY_FOR_REPAIR` in P0.

This is a small adapter and does not replace `docs/rules/01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md`'s SOURCE ↔ SOLUTION IDENTITY ALIGNMENT nor `archive/tools/solution-calibration-gate.mjs` and `archive/tools/review-evidence-gate.mjs`. Existing calibration/semantic review are required independently. The `STRUCTURE_VALIDATED_ONLY` status is **not** mathematical or production approval.

## Steps (external worker → Drive → Gemini → external worker)

1. **External worker** reads current Notion routing, Git main and the authoritative identity registry. From a clean current Git clone it runs:

   ```sh
   node archive/tools/solution-audit-harness/harness-cli.mjs extract \
     --repo "$PWD" \
     --exam 'archive/exams/original/high/h1/1final/26_효천고_1학기_기말_고1_기출.js' \
     --batch '20261102_P0_SHADOW' \
     --expected-head "$(git rev-parse HEAD)" \
     --out '/tmp/p0-source-packet-immutable.json'
   ```

   Optional `--identity-map /path/to/canonical-resolver-export.json` contains **verified** `items[]` with `{sourceArchiveFile,sourceOrdinal,qid,questionUid,contentHash,choicesHash,imageRefHash,authorityRef}` and an `authorityId`. This map must come from the authoritative project resolver; do **not** create UID rows from filename+QID, fixture data, or model output. Without real mapping, item `identityStatus=IDENTITY_HOLD` and it cannot pass validation.

   Extractor uses the existing canonical JSON hashing functions and a restricted `vm` loader, checks Git Blob SHA on the actual input bytes, and stores `source_packet` as a *new* file (`wx`). A clean checkout must be confirmed by the external worker, since Git HEAD alone does not prove source is committed. All rows are from actual JS runtime values, including source fields, choices, answer, solution and image references.

2. External worker uploads the frozen packet and relevant actual image assets to Drive using authenticated Drive tools. It checks uploaded raw SHA/readback and creates a `packet_manifest` recording `batchId`, packet SHA, Drive file IDs and the exam Git head/blob. **No Drive uploader or watcher is installed by P0.** Gemini receives **exact assigned Drive IDs**, not a Git URL. No packet ⇒ `SOURCE_PACKET_MISSING`, not synthetic source.

3. Gemini produces a `DRAFT_UNVALIDATED` JSON decision row for **every** packet item (same `sourcePacketItemKey`, `qid`, `sourceOrdinal`, `questionUid`, `contentHash`, `beforeSolutionHash`), plus `sourceAnchors`, `reason`, `decision=KEEP|UPGRADE_NEEDED|HOLD`, optional `editKind` and `afterProposal`.

   - `KEEP` with any authoring boilerplate is rejected.
   - `LABEL_ONLY`: Gemini does *not* freely rewrite text. The external helper's `stripAuthoringLabels(before)` output must match exactly, preserving all remaining math/words. Unknown scaffolding such as `(확인:` fails closed.
   - `FORMAT_ONLY`: no non-whitespace change allowed.
   - Calculation/condition/curriculum changes always require external **independent mathematical review**; P0 refuses to approve them. Even a matching answer is insufficient.

4. External worker fetches current Git source and checks for drift, then validates the Gemini draft:

   ```sh
   node archive/tools/solution-audit-harness/harness-cli.mjs validate \
     --packet /tmp/p0-source-packet-immutable.json \
     --draft /tmp/gemini-decisions.json \
     --current-source archive/exams/original/high/h1/1final/26_효천고_1학기_기말_고1_기출.js \
     --expected-blob '<confirmed-git-blob-sha>' \
     --out /tmp/p0-validation-receipt-immutable.json
   ```

   Invalid draft exits nonzero and writes its failure receipt. Valid *structure* exits zero, but still reports `STRUCTURE_VALIDATED_ONLY` and `readyForRepair:false`. No changes to existing Gemini Drive reports/automation/repair queue are made by this P0.

## Regression tests

```sh
node --test archive/tools/solution-audit-harness/tests/harness.test.mjs
```

The Q01 and Q09 tests use an explicitly marked **two-question test subset** containing the source fields from the actual `26_효천고_1학기_기말_고1_기출.js` at Git head `c44db713...` (original full JS blob `f398e610...`). The subset is **not** presented as the full authoritative exam, and its test UID proof is synthetic and restricted to the test process. In particular:

- Q01: 3×2 matrix with answer ④, not 2×3 and ②.
- Q09: `1500` divisors divisible by `5` ⇒ `18` (⑤), not all divisors `24` (③).

Both false After drafts are rejected. A normal deterministic label removal is accepted at *structural-only* level. P0 also checks missing UID, missing decision rows, tampered snapshot, post-extraction source drift, authoring boilerplate, and made-up browser PASS.

## Limits / not done

- No live Git/Notion access for Gemini and no Gemini-side Node/Git execution.
- No automatic Drive packet upload or report relay; **manual handoff required** until a separately approved runner is implemented.
- No authoritative UID resolver import implementation or source registry attestation; provide a verified canonical export or item remains `IDENTITY_HOLD`.
- No semantic proof engine: semantic After is `AFTER_MATH_UNVERIFIED`; no `READY_FOR_REPAIR` can be emitted here.
- No production browser/Pages/CI pass, no automation changes.
- Security: the `vm` sandbox has a timeout and only a `window` object, but is **not** a strong isolation boundary for arbitrary malicious JavaScript. Input must be trusted checked-in JS from Git, never untrusted uploaded code.
