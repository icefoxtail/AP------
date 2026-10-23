# Deep Meta Pipeline — CURRENT entrypoint (2026-10-23)

> Scope: Gemini READ/CLASSIFY/AUDIT and GPT Courier for PT/TPL/CrossConcept metadata. **Not** CREATE/R1/R2/R3/FINAL QA.

## Single authoritative SOP (Google Drive)
- [심화 메타 예약라인 SOP v1.0](https://docs.google.com/document/d/1W0q7QSFWJF_mpPx3QNLacEsclQE_ZBYFpSRRVc9_hBI/edit)
- [AP------ / META_PIPELINE folder](https://drive.google.com/drive/folders/1-gC4c2iQzNVhMUzSkS5WXr7Au6p5swZq) — ID `1-gC4c2iQzNVhMUzSkS5WXr7Au6p5swZq`

## Direct folder routing (list actual children; no filename-search-only routing)
| Stage | Drive folder | ID |
|---|---|---|
| READ/CLASSIFY | [01_READ_CLASSIFY](https://drive.google.com/drive/folders/1NJmoSA7deu7qj4T5rtPCwJYfLIoFLWVR) | `1NJmoSA7deu7qj4T5rtPCwJYfLIoFLWVR` |
| AUDIT | [02_AUDIT](https://drive.google.com/drive/folders/1f3ku6bJ5FVz3STuMajQvNfeTqFd8WOZJ) | `1f3ku6bJ5FVz3STuMajQvNfeTqFd8WOZJ` |
| Courier intake | [03_REGISTER](https://drive.google.com/drive/folders/1uvkM7vRX08jkfv3zNy2ptIRW24CX856Y) | `1uvkM7vRX08jkfv3zNy2ptIRW24CX856Y` |
| Unresolved | [04_HOLD](https://drive.google.com/drive/folders/1QOwpsE3fz5Q-QSYmLa7GTY6rLjX_I4-s) | `1QOwpsE3fz5Q-QSYmLa7GTY6rLjX_I4-s` |

## Role boundaries
1. Gemini reads every statement, choice, solution and relevant visual; classifies PT/TPL and atomic multi-tag CC, producing per-question reading evidence. Preserve students' statements, answers, explanations and visuals.
2. AUDIT checks independent classification and evidence. Distinct legitimate CC keys may be created and linked now; broad concept consolidation happens later. Similar PT/TPL labels alone are not a reason to block or rewrite individual exams.
3. Gemini ends at `READY_FOR_COURIER_REGISTRATION`, never fabricates commits or remote readback.
4. Courier checks source/UID/count and actual canonical references. An AUDIT-approved PT/TPL/CC key missing from Git ACTIVE canonical is an additive canonical-promotion input, not a registration blocker: add its evidence-backed definition to the proper grade/course pack (PT/TPL) or atomic concept shard (CC), then bind the item UIDs through the official registration contract. An active pack's `ownedStandardUnitDomains` is expanded add-only when a new active binding adds a unit key. Existing definitions are immutable and must never be semantically merged or rewritten. For an already-existing CC whose audit label or definition uses different wording, preserve the exact canonical entry and require an explicit `REUSE_CANONICAL` rationale showing why the audited usage is the same concept; wording review is not permission to edit or consolidate the canonical. Git registration of a Gemini-approved TPL key does not change Gemini's `newTemplatesCreated` count; track canonical promotion separately. If the audit SHA differs from the current Drive file SHA, record both; continue only when every UID's student-visible fields match the production source and the audited excerpts match. Never substitute one SHA for another. Remote Git readback is mandatory before `REGISTERED`.
5. Verified blockers remain explicit; do not claim 0-HOLD if unresolved defects remain. Do not silently relabel Gemini AUDIT as FINAL_QA or REVIEW2.

For the v2 registration request, Gemini `ALIVE_META_AUDIT_ATOMIC_v3` handoffs use the distinct `approval.type: "META_PIPELINE_AUDIT"`. Preserve the exact audit package and Courier manifest JSON as SHA-bound repository evidence. Bind the current production source SHA/blob to an exact per-qid student-payload parity report. When audit and current Drive hashes differ, keep the audit SHA, actual Drive SHA, and production SHA as separate values; require all student fields and audited excerpts to match for every UID. The registrar checks source identity, zero hold/template inflation, full N-question denominators, manifest/audit/request binding parity, reading evidence, student-field parity, and add-only canonical promotion support for PT/TPL/CC definitions. This approval type records metadata registration only; it does not set exam Final QA to PASS.

This card is a **link/router**, not a duplicate source of truth. For full schemas, execution details and instructions, read the Drive SOP. If an older registrar check rejects an AUDIT-approved key solely because the Git canonical entry is absent, extend the official registration contract to support the audited add-only promotion; do not bypass source, UID, evidence, pack-scope, or remote-readback checks.
