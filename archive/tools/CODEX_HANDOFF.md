# Codex handoff helper

`archive-codex-handoff.mjs` composes the current Codex stage validator, stage kit, student bundle adapter, and dispatcher. It adds bounded assignment/receipt checks and immutable process evidence. It does not make mathematical, Meta, visual, source, or presentation judgments; it does not publish or alter exam/runtime code.

## Assignment inputs

The assignment JSON is an immutable packet with absolute paths. R1/R2 runs that bind a post-freeze validator capture also include `originalFreezeAbsolute` and `originalFreezeSha256`; those identify the existing frozen record and are never rewritten.

```json
{
  "schemaVersion": "JS_ARCHIVE_CODEX_HANDOFF_ASSIGNMENT_V1",
  "worktreeRootAbsolute": "C:/work/exam",
  "workingJsAbsolute": "C:/work/exam/archive/exams/current.js",
  "assetRootAbsolute": "C:/work/exam/archive",
  "evidenceRootAbsolute": "C:/work/exam/.tmp/run/evidence",
  "evidenceAbsolute": "C:/work/exam/.tmp/run/evidence/R1.json",
  "studentBundleAbsolute": "C:/work/exam/.tmp/run/student-bundle.json",
  "validatorCaptureAbsolute": "C:/work/exam/.tmp/run/evidence/R1-validator-capture.json",
  "expectedHead": "<full commit SHA>",
  "expectedSourceRawSha256": "<64 lowercase hex>",
  "qualityContractVersion": "JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",
  "executionLine": "CODEX",
  "stage": "R1",
  "examUid": "<locked exam uid>",
  "questionCount": 2,
  "qids": [1, 2],
  "reviewerIdentity": {
    "role": "archive_r1",
    "reviewerId": "<exact canonical reviewer id>",
    "displayPrefix": "R1"
  }
}
```

`validatorCaptureAbsolute` is the preferred raw-report location. The validator's exact stdout is retained there as base64 together with stderr, exit code, argv, and input bindings. For previously captured output, `rawReportAbsolute` may point at a byte-for-byte report file; unless it is paired with a valid process capture, execution provenance remains `UNPROVEN`. `assetRootAbsolute` must be the directory containing `assets/`, never the `assets/` directory or a JS file. The sibling receipt must use schema `JS_ARCHIVE_CODEX_HANDOFF_ASSIGNMENT_RECEIPT_V1` and bind `assignmentSha256`, `worktreeRootAbsolute`, `expectedHead`, `actualHead`, `sourceRawSha256`, `sourceRawBufferBlobSha1`, and the exact `reviewerCanonicalId`.

## Normal validator and handoff order

First produce the complete current evidence and current student-only bundle from the assigned source. For R1/R2, do not run a command that reads answer-bearing source before the independent freeze. The capture command below requires the full bundle/evidence qid denominator, checks the source SHA and referenced assets, and requires the original full-qid freeze bound to that bundle before it invokes the canonical generic validator exactly once. It saves process output to a fresh file even when the validator fails; it never retries and never converts the result to PASS.

```powershell
node archive/tools/archive-codex-handoff.mjs validate-capture `
  --root <absolute-worktree> --js <absolute-current-js> `
  --evidence <absolute-evidence> --bundle <absolute-student-bundle> `
  --asset-root <absolute-assets-parent> --stage R1 `
  --source-sha <current-raw-sha256> --freeze <immutable-freeze.json> `
  --freeze-sha <freeze-file-sha256> --output <fresh-capture-json>
```

For CREATE/R3, `--freeze` and `--freeze-sha` are not required. R1/R2 capture refuses to parse the current JS unless a complete matching freeze already exists.

Then run `preflight` against the assignment, receipt, actual student bundle, and raw validator report or process capture. This is a physical/schema preflight, not a new quality verdict. Its result uses `disposition: STRUCTURE_BOUND`; `executionProvenance` is `PROCESS_CAPTURED` only when the saved bytes match an exit-0 invocation of `archive-stage-validator.mjs` with the current quality contract and CODEX line. CREATE/R1/R2 evidence rows must cover every current qid. R3 review rows must match only its `targetedScope`; the separately SHA-bound `artifactDispositions.rows` must still cover every current qid. The artifact report's question count remains the full exam denominator. A report assembled from summary fields does not qualify as captured execution.

For R1/R2 source bytes that changed after the freeze, the helper reads the bundle snapshot at the original freeze's recorded path and verifies its recorded raw SHA. It permits the current source only when current and frozen student payloads, qid order, asset refs, and asset SHAs match exactly. The freeze keeps its original source SHA and bundle identity. Student or required-asset changes fail and require the normal qualified worker route.

After successful preflight, use the existing `archive-codex-stage-kit.mjs seal` path once to make the stable completion event. Then accept it through the helper, which delegates to the existing dispatcher lock, state SHA check, sealed-event validation, and atomic transition:

```powershell
node archive/tools/archive-codex-handoff.mjs accept `
  --root <absolute-worktree> --state <dispatcher-state.json> `
  --state-sha <current-state-sha256> --event <sealed-event.json> `
  --event-sha <sealed-event-sha256>
```

The returned `nextDispatch` is the next roster plan. Replaying the same state SHA fails without a write; replaying an already accepted event against the new state fails as duplicate. A changed event fails its sealed SHA check. A failed acceptance leaves dispatcher state untouched.

## Student-only packet, freeze, and affected scope

ROOT prepares a next-stage packet from the actual current JS and assigned asset root. It projects the existing student-field whitelist, keeps supported choices, common materials, tables, and display fields, and closes over referenced SVG dependencies. An optional supplied bundle is only a parity witness; re-labeling an old student body with the current source SHA fails exact projection comparison. Answer/solution/Meta fields are not emitted:

```powershell
node archive/tools/archive-codex-handoff.mjs prepare-student `
  --js <absolute-current-js> --source-sha <current-raw-sha256> `
  --bundle <optional-current-bundle-parity-witness.json> `
  --asset-root <absolute-assets-parent> --output <fresh-student-packet.json>
```

R1/R2 validator capture stays source-blind until the original full-qid freeze is SHA-verified. After that point it reads the original frozen bundle snapshot and current JS projection, preserving the freeze's original source/bundle identity and requiring exact student payload, qid order, and asset-ref/SHA parity. Any changed student field or required asset stops this rebind route.

Use the existing stage-kit `freeze` command for R1/R2 immutable answer freezes. Post-freeze disclosure uses the existing canonical exact student parity path and requires the original freeze's full file SHA:

```powershell
node archive/tools/archive-codex-handoff.mjs disclose `
  --js <absolute-current-js> --bundle <frozen-current-student-bundle.json> `
  --asset-root <absolute-assets-parent> --freeze <original-freeze.json> `
  --freeze-sha <original-freeze-file-sha256> --output <fresh-disclosure.json>
```

An affected-scope plan compares old/current student-only bundles and their asset roots, rejects any outside-scope student or asset delta, and records the original freeze identity and physical SHA. It emits qids for worker review only; it does not decide whether a changed qid passes:

```powershell
node archive/tools/archive-codex-handoff.mjs scope-plan `
  --old <old-student-bundle.json> --current <current-student-bundle.json> `
  --old-asset-root <old-assets-parent> --current-asset-root <current-assets-parent> `
  --freeze <original-freeze.json> --qids 7,12 --output <fresh-review-plan.json>
```

Existing source freezes, failure records, completion events, and reports are never overwritten. Declared asset paths must resolve to the assigned asset-root/ref path; symlink escapes are rejected before the bundle adapter reads them. Missing assignment inputs, hash drift, missing assets, qid gaps, disclosure before a valid freeze, or outside-scope changes fail closed. A mathematical mismatch or open review remains a worker/ROOT decision; this helper cannot turn it into PASS.

## Tests and scope

Run the bounded integration suite with:

```powershell
node --test archive/tools/archive-codex-handoff.test.mjs
```

The tests cover reviewer-prefix rejection, wrong asset parent, source/evidence/report tampering, qid omissions, student answer leakage, missing assets, disclosure before/after freeze binding, outside-scope changes, event mutation, duplicate acceptance, and nonzero validator capture. A separate `TEST-ONLY` synthetic R3 fixture runs the real current generic validator to exit 0, stores its exact stdout/stderr/exit, then verifies `PROCESS_CAPTURED` preflight with targeted review rows and full artifact dispositions; its row verdict is a synthetic sentinel, not a quality approval. No Archive runtime, UI, engine, permissions, storage, publication, or historical artifact is changed or revalidated by this helper.
