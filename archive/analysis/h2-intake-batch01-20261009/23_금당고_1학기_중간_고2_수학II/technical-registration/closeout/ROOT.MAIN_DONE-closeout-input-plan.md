# MathII MAIN_DONE closeout input plan

Status: PREPARED_NOT_EXECUTED. This is a technical input map, not a MAIN_DONE receipt or claim. ROOT owns commit, push, remote readback, and final closeout.

## Snapshot and immutable bindings

- Worktree: `C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------`
- HEAD observed during inspection: `45fc99a20054ea7e923ba571c9de4034e13b46c9`.
- `origin/main` observed during inspection: `f893635f4ac793ebc2c1bcd338c603a89aa67497`; these did not match. Treat both as diagnostic only. Final closeout must run after ROOT publication, when the intended local HEAD equals the just-published origin/main and that exact SHA is placed into `remoteMainSha`.
- Production artifact: `archive/exams/original/high/h2/1mid/23_금당고_1학기_중간_고2_수학II.js`; raw SHA-256 `3b905a30464f7f056c0e67bd4eb0bfc23b856caf90c84847aa4f618313ffaf9a`; Git blob SHA-1 `e4192c46c79a3abdf4ff7e6a729f4cd0a470e31c`.
- Promotion receipt: `archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/ROOT.promotion.actual-v1.json`; SHA-256 `f46340add1f17ec2de2744a92985ab938137a004d31e16ec9b5a0977ebfd6a6a`; its state is `PROMOTED_PUBLICATION_PENDING`, not MAIN_DONE.
- Durable actual render receipt: `archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/ROOT.render-receipt.durable-v1.json`; SHA-256 `bcbb7edc445120e0bc3b4447b6049f5ae06003a9f974dbceef719a06ecc4391a`; status `RENDER_PASS`, six cases, full qid coverage 1–20. Keep this object unchanged and pass it both as `renderReceipt` and by the `receipt.renderReceipt` file binding.

The full render-expected asset set comes from the promotion receipt (six entries, including the two solution SVGs). Carry all six unchanged as `{ref, sha256}` in `receipt.assets` and the validator's `assets` argument. Use qids `[1,...,20]` unchanged in the receipt and validator argument. Do not derive only from PNGs or only from the rendered case's loaded assets.

## Existing consumer and final input shape

The current consumer `archive/tools/archive-codex-closeout-v2.mjs` exports `validateCodexMainDoneReceipt({receipt, root, renderReceipt, assets, qids})`. `archive/tools/archive-stage-runtime-v2.mjs` then exposes `consumeCodexMainDone({state, ...input})`; its state must be `PUBLICATION` with CODEX quality contract V2. There is no normal actual-render MAIN_DONE command-line builder. Existing MAIN_DONE V1 examples supply the receipt schema.

After ROOT has published and read back the commit, create a fresh target receipt with this shape (fill `remoteMainSha` from the actual remote readback; do not estimate it):

```json
{
  "schemaVersion": "JS_ARCHIVE_CODEX_MAIN_DONE_RECEIPT_V1",
  "status": "MAIN_DONE",
  "qualityContractVersion": "JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",
  "executionLine": "CODEX",
  "examUid": "23_금당고_1학기_중간_고2_수학II",
  "productionPath": "archive/exams/original/high/h2/1mid/23_금당고_1학기_중간_고2_수학II.js",
  "artifactSha": "e4192c46c79a3abdf4ff7e6a729f4cd0a470e31c",
  "artifactRawSha256": "3b905a30464f7f056c0e67bd4eb0bfc23b856caf90c84847aa4f618313ffaf9a",
  "remoteMainSha": "<exact published origin/main SHA>",
  "publicationCommit": "<exact publication commit if ROOT records it>",
  "renderReceipt": {
    "path": "archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/ROOT.render-receipt.durable-v1.json",
    "sha256": "bcbb7edc445120e0bc3b4447b6049f5ae06003a9f974dbceef719a06ecc4391a"
  },
  "assets": "<copy the exact six {ref,sha256} rows from ROOT.promotion.actual-v1.json>",
  "qids": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
}
```

Then execute only after ROOT confirms publication/readback and current HEAD/origin parity. From the repository root, load the receipt and durable render JSON, pass the receipt's exact assets and qids, and call the existing consumer:

```js
import fs from 'node:fs';
import { validateCodexMainDoneReceipt } from './archive/tools/archive-codex-closeout-v2.mjs';
import { consumeCodexMainDone } from './archive/tools/archive-stage-runtime-v2.mjs';
const root = process.cwd();
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
const renderReceipt = JSON.parse(fs.readFileSync(renderPath, 'utf8'));
const input = { receipt, root, renderReceipt, assets: receipt.assets, qids: receipt.qids };
const checked = validateCodexMainDoneReceipt(input);
if (!checked.ok) throw new Error(checked.issues.join(','));
const closed = consumeCodexMainDone({ state: { stage: 'PUBLICATION', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX' }, ...input });
```

The validator itself proves `HEAD == origin/main == receipt.remoteMainSha`, the production blob SHA, every current remote asset SHA, render receipt byte/object parity, and all six actual-render cases. Only that live result can close publication; this plan does not pre-claim it.

## Next H2 probability/statistics target route

The current bounded helper `archive/tools/prepare-target-registration-candidate.mjs` explicitly recognizes only `math2`, `geometry`, and H1 `수학(상)` display aliases in `parseAuthorizedDisplayIdentity`. It does not currently admit an H2 Probability/Statistics alias. Do not route a PS target through that producer by relabeling its course/subject or inventing Meta values.

The existing normal path remains `prepare-target-registration.mjs` followed by default dry-run `register-target-exam.mjs`; it requires a candidate root already containing canonical target DB, identity, metadata, question-index, and catalog rows, and binds current HEAD, source/artifact, all nine baselines, and release assets. A normal full canonical generation may be used if it naturally contains the promoted PS source and passes its gates. If it cannot seed that target, ROOT must first issue a target-specific registration assignment/authority grounded in its current R1-approved embedded Meta and confirm the canonical course/display identity route; any needed bounded-helper support for H2 PS is a separately authorized, exact technical scope. Until then the existing bounded math2/geometry producer is ineligible for this target.

## Tool hashes observed

- `archive/tools/archive-codex-closeout-v2.mjs`: `ecd80dd6e5289d0000c57311c6ce46e51e190a8cb2a2919b2c9d70733b4d5246`
- `archive/tools/archive-stage-runtime-v2.mjs`: `b1dd1b9512707b23bdc667cdcb79491354608afcfbfd1cb76342fb1b4f528b06`
- `archive/tools/prepare-target-registration-candidate.mjs`: `0a0c42fe771b935d1372f449fb9a7cb65656382304b5933716547cf78b24e033`
- `archive/tools/prepare-target-registration.mjs`: `2894ce2537db95e92d03901135fe9ccb39d0eddd0214cd6e4afaa0fef43ed411`
- `archive/tools/register-target-exam.mjs`: `4791465d9a8b0d3465c8df5429927f96ef9135de05bb3deef9cb30a234ffe4aa`