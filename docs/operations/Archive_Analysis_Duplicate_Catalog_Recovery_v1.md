# Archive Analysis Duplicate Catalog Recovery v1

status: SUPERSEDED / historical 11-path Git-blob recovery plan

This document records the earlier recovery plan for 11 duplicate `archive/analysis` catalog paths. That plan assumed Git could recover the bytes from a retained duplicate or a baseline commit. It is retained as historical context only; it is not the current archive storage or recovery contract.

The current user-directed policy is [Git production scope and Drive evidence retention](Git_Footprint_and_Evidence_Retention_v1.md). The verified cold evidence index and root receipt are `archive/data/archive-analysis-drive-root-receipt.v1.json` plus its Drive-bound full-path sidecar. To materialize a raw object, use `tools/archive-cold-evidence.mjs` with the receipt, downloaded sidecar, local pack directory, and exact original repository path. The resolver verifies the receipt's Drive bindings, pack/member integrity, raw SHA-256, and Git blob SHA-1, then writes into the ignored local cache. The resolver never assigns a review or quality status.

Do not use this legacy 11-path procedure as a substitute for the verified Drive cold-evidence resolver. If the receipt, sidecar, pack, requested row, or expected hashes are missing or fail validation, stop with the proof unavailable and inspect the specific discrepancy. Do not infer recovery success from the former retained-duplicate assumption.
