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
4. Courier checks source/UID/count and actual canonical references; when new CC are required, register definitions **and** bind their item references through the existing official registration contract. Remote Git readback is mandatory before `REGISTERED`.
5. Verified blockers remain explicit; do not claim 0-HOLD if unresolved defects remain. Do not silently relabel Gemini AUDIT as FINAL_QA or REVIEW2.

This card is a **link/router**, not a duplicate source of truth. For full schemas, execution details and instructions, read the Drive SOP. Preserve existing Git registrar contracts when they differ; escalate a concrete contract discrepancy instead of bypassing validation.
