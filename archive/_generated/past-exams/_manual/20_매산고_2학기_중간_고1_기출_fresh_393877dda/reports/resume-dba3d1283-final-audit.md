# FINAL_AUDIT / FINAL_CLOSURE — 2020 매산고 고1 2학기 중간

## Fresh candidate

- Candidate: candidate/20_매산고_2학기_중간_고1_기출.candidate.js
- Candidate SHA-256: sha256:ed86303ef9a4f33432afc4528cad079ac4661050841874802a928a866a95afe2
- Fresh run start SHA: dba3d1283e54a8ea1bfef8ce126e0769ebdfa030
- Run/work-batch: past20-maesan-resume-dba3d1283
- Freeze SHA: sha256:8f2e05fde61dc240d2d469fab4008589136d8f1602b9a7a05e84aaedbc67d791
- Static extraction: EXTRACTION_VALIDATED; 20/20 questions; issue, missing answer, missing solution, missing subunit, and missing image counts are all zero.
- Source evidence binding is PASS. Source-fidelity, math-review, and asset-provenance are still pending the independent semantic audit; extraction validation is not a production PASS.

## Provider FINAL_AUDIT

The new provider launch was preflighted as stateless U1/U2/U3 with CodexAppServer gpt-5.6-luna/xhigh, reserved once, dispatched once, and then failed at U1 with the actual HOLD:PROVIDER_TRANSPORT_UNAVAILABLE result. No U2/U3 response or semantic evidence was returned. The launch was reconciled as terminal FAILED; the work-batch is HOLD.

- Failure evidence: alive/runtime/provider-bridge/past20-maesan-resume-dba3d1283/provider-transport-failure.json
- Failure receipt: alive/runtime/provider-bridge/past20-maesan-resume-dba3d1283/provider-transport-failure-receipt.json
- Failure receipt SHA-256: sha256:a4e6094ee50f527f5be064145e30a522600f6c7b8258f7a255c10ad031a2439d
- Same-launch retry: not performed.
- The earlier adapter defect involving a missing collaborationMode.settings.model was already repaired in the prior pipeline repair history; current adapter bytes include that binding. This repeat failure occurred after the U1 request and is recorded as provider transport unavailability, not converted into a fabricated pipeline PASS.

## Audit and closure

- audit-v2: BLOCKED; report resume-dba3d1283-audit-v2.json.
- Whole-job audit: BLOCKED; final semantic coverage 0; report resume-dba3d1283-work-batch-audit.json.
- Browser render: NOT_TESTED because Playwright is unavailable and the previous CUA fallback was interrupted. No render PASS is claimed.
- TARGETED_RECHECK: not authorized; the first FINAL_AUDIT did not complete, so there is no evidence-bound semantic defect scope.
- Production JS, database, and question-index promotion: not authorized and not executed.
- FINAL_CLOSURE: BLOCKED. No synthetic PASS, gate relaxation, or data mutation was used.

The completed candidate and all preserved failure evidence remain available for a future fresh provider run after the external transport condition changes. The failed work-batches are not reused.
