# GPT Book 5-Lane Library Handoff Harness v1

This is a non-blocking sidecar validator, not a quality reviewer, stage mover, Git publisher or scheduler. The task's Library router section 6 remains the operating policy owner.

COURIER / MATH_META / VISUAL return LOCAL_EVIDENCE_PASS only when the materialized raw source, stage output bytes, declared SHA-256 and Library file-ID lineage match. The result is LOCAL evidence parity, not independent remote attestation or mathematical approval.

Exit codes: LOCAL_EVIDENCE_PASS = 0; FAIL = 1; UNKNOWN = 2. In particular UNKNOWN does not silently exit 0.

Retrieve the exact source and receipt file IDs using the connected Library provider directly. Download complete raw bytes; do not use text previews or global filename search. Create a private JSON file with source IDs keyed original, assignment, math, mathReceipt, visual, visualReceipt, as returned by the provider. A user-supplied ID map can only be cross-checked for consistency; it is not proof of an independent remote lookup.

Example:

    node tools/harness/gpt-book-handoff.mjs --dir /private/raw-folder --stage VISUAL --ids /private/retrieved-ids.json --json
    node --test tools/harness/gpt-book-handoff.test.mjs

COURIER: 00_ASSIGNMENT.json + original source filename declared in it. MATH_META adds 10_MATH_META_REVIEWED.json and 11_MATH_META_RECEIPT.json. VISUAL adds 20_VISUAL_REVIEWED.json and 21_VISUAL_RECEIPT.json. ALL_MASTER checks available lineage, reporting firstMissingStep. RELEASE requires separate real GitHub merged=true plus main blob readback and 30_RELEASE_RECEIPT.json; this CLI intentionally returns UNKNOWN without external proof.

Observed remoteReadbackSha256 fields in receipts are claims to compare with actual materialized bytes, not proof that the CLI contacted the remote service. Quality review and previous stage freeze remain subject to original rules. Do not commit source/answers, private ID lists, evidence originals, or output raw packets into Git. The tool does not change reservation ON/OFF, Gemini's stages, or releases.
