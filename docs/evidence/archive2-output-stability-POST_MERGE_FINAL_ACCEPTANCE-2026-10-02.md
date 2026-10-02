# POST_MERGE_FINAL_ACCEPTANCE — Archive 2.0 Output Stability

Status: **PENDING**. This record is separate from the code/regression merge gate.

Feature branch: `codex/archive2-output-stability`  
Latest main integrated into feature: `8a280e8e4fd08be66708514cc5693e85c02ef57b`

## Completed before merge

- Existing Output Stability regression suite: 77 passed, 0 failed.
- Pinpoint regression suite: 18 passed, 0 failed.
- Worker/D1 runtime and validation: 23 passed, 0 failed, 1 skipped because the current registered catalog has no BOM-prefixed source.
- Wrangler deploy dry-run: passed. No deployment was performed.

## Acceptance evidence still required after merge

### 1. Cloudflare Browser Binding PDF

Status: **PENDING — not exercised against the deployed Cloudflare `BROWSER` binding.**

Capture one controlled assignment's ID, selected QPP, PDF-ready status, exact page count and byte size, plus verified envelope identity and the R2 object result. Keep student identifiers out of the evidence.

### 2. Real browser direct-action clicks

Status: **PENDING — local browser navigation was blocked by the computer-use browser policy.**

In an authorized browser environment, click Archive 2 Finder exam/solution/answer actions and verify each opens the current-source Output Envelope in the existing engine without the assignment modal. Verify board rows expose direct actions only when server `can_read_snapshot` is true, and that an unauthorized read remains denied without a visible button.

## Closure

Update this record with the environment, UTC/local timestamp, anonymized assignment and envelope identifiers, exact PDF result, browser mode/request IDs, and attached browser evidence. Mark **PASS** only after both acceptance items above have been observed.
