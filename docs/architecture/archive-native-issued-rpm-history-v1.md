# Issued RPM history: ordinary FINAL_QA preservation v1

This contract preserves one already issued, text-only M2 first-semester FINAL_QA approval when its original RPM crosswalk remains an exact subset of the live expanded crosswalk. It creates no approval, mathematical verdict, difficulty change, definition, or binding.

## Explicit request

An ordinary PARTIAL_UIDS request selects exactly one UID with empty before/after values and no registry changes. Its original approval fields must match the published predecessor. It uses a sourceRebind object containing only priorReceiptRef and historicalRpmEvidence. The latter contains exactly schemaVersion `archive-native-issued-rpm-history-v1` and priorReceiptCommit, an exact ancestor commit where the original receipt and its selected metadata, identity and runtime were actually published.

The predecessor must be a terminal ordinary one-UID FINAL_QA receipt: no earlier preservation, renderer preservation, fingerprint repair or native parent binding. It must bind one RPM provenance record and the original LOCKED master. This version refuses inline, nested and ordinary renderer references; other reviewed source routes retain their own contracts.

## Required boundaries

- Authenticate the entire original receipt and every original approval reference against immutable Git at the declared issued commit. Require the exact original current receipt bytes too.
- Reconstruct its old source bank and compare the entire selected question with the current source. Preserve the denominator and require the current source byte/blob pin.
- Require the actual selected metadata, identity and runtime to equal the issued predecessor before registration. On reuse, permit only the official evidence append and exact metadata revision produced for this preservation request; values and author provenance remain equal.
- Keep the live crosswalk installed. Every original RPM row, the authority envelope, selected RPM path and LOCKED master must remain exact. New rows may only be additive. Re-run the official current RPM provenance validator.
- Only an unforgeable, module-private validated context may supply the old crosswalk bytes to the original leaf's evidence reader. The old receipt and exact original reference must match. Normal evidence reads keep their live byte checks.
- Re-run the original native approval and current binding checks. The figure and renderer helpers still run their existing claim/repair checks; they receive the same narrowly bound reader only.
- A post-write selector may re-enter through this request's exact issued receipt only after its canonical request digest, complete approval, selected identity, source pin and reconstructed current state match. An arbitrary old/new-state fallback is forbidden.

## Operational replacement

Retire the failed old pending request only while it is still unconsumed and byte-identical. The official rejection utility preserves its complete raw JSON and deterministic rejection record. Atomically replace the inbox entry with the new typed request. Keep the original issued receipt unchanged. If another writer has already issued the old pending request, stop this replacement and prepare against the actual new issued state instead.

## Verification and deployment

Focused negatives cover old/current row and evidence drift, source/state/approval changes, wrong ancestry and marker fields, reconstructed revisions, post-write request identity, nested renderer carriers, forged contexts and unrelated receipts. The actual local proof covers one preserved UID, no new approval, official dry/write, current and original cursor native checks, Consumer, projection replay and selector re-entry.

The local shallow/partial Git clone cannot supply every unrelated packed object required by Git's clone traversal. Its private shadow stops before the validator. Full-fetch PR CI remains a mandatory deployment gate; this local limitation is not a shadow PASS.

## Coexistence with historical staging

The existing historicalRpmEvidence array on preview descriptors is the external staging-only contract. It remains unchanged. The typed ordinary FINAL_QA lane uses a separate issuedRpmHistory descriptor; its request approval marker retains its original name. Passing historical preview staging does not establish native approval reuse. On the current base, the old untyped pending request stages successfully but its original native leaf still returns null without the validated historical context. Its retirement records that current boundary and labels the earlier EVIDENCE_DRIFT as a historical observation only.
