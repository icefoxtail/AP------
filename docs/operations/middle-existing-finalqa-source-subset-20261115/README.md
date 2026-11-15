# Preserve 35 unchanged approvals from mixed source cohorts

Three explicitly typed source-subset requests preserve 35 existing FINAL_QA approvals. They exclude the changed renderer rows E048 Q10, E053 Q19 and E064 Q14. No metadata, mathematical or difficulty approval is added, and no source, asset, original review/receipt, identity or canonical definition is modified.

| Original cohort | Prior approval count | Preserved unchanged UIDs | Excluded renderer UIDs | Full source count |
|---|---:|---:|---:|---:|
| E048 | 14 | 13 | 1 | 21 |
| E053 | 16 | 15 | 1 | 24 |
| E064 | 8 | 7 | 1 | 22 |

Every selected whole question, all protected student fields and all 66 referenced asset entries match the actual first registered source at 5f8f509108cfc4bfac3ce47813839aaa3c558274. Current source/asset bytes match main 3656527970d596d88ea984733058f0ba5bcccfef and core830. The code validation uses local d58674e63930e82c5c65be5bd0ddc1b94428b3ca (aa13 strict subset plus official preview/Consumer dispatch). That local code commit is not used as immutable approval authority.

Each approval explicitly binds the original receipt SHA, deterministic subset evidence and transport witness. Its before/after values are empty, registry changes are empty, and selected/excluded UID inventories form the exact original cohort. Original native and figure evidence belongs to the predecessor receipt; the identical files are listed as item dependencies for official shadow copying. They are not misrepresented as new direct figure reviews in the transport approval. The original receipt's own approval/evidence is unchanged and actually replayed.

## Local verification

Official dry-run, write and cumulative replay passed for all three requests, preserving 35 approvals with zero new approvals. Replay emitted no paths and changed no output bytes. Selected metadata/runtime changes are limited to metadataRevision and approvalEvidence. Source/renderer bytes, complete identity bytes, original evidence/receipts and all outside-target metadata/runtime are unchanged. The actual AutoMeta native verifier returned each new preserved receipt for all 35 selected UIDs; outside-target APPLY was zero across all 67 source rows.

E064 initially exposed two missing sparse assets and then an incorrectly repeated predecessor figure claim in the child approval. Both were corrected in inputs only: exact assets are restored and declared, and predecessor evidence remains SHA-bound on item dependencies. No validator was weakened.

## Release boundary

Full Consumer, the complete inherited immutable shadow, exact-head CI, actual main writer receipts and Pages remain separate required integration gates. Generated local metadata/runtime/registration receipts are excluded from this commit. The separate full51 packet and other renderer repairs remain separate inputs; this packet makes no current approval claim for its three excluded rows or for M3 semester 1.
