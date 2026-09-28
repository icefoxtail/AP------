# Audit execution history and q01 visual repair

## Preserved prior current-main launch

- Batch: `visang-workbook-geometry-20260929-main`
- Freeze: `sha256:9bc5dd3c486887946ef99ebf843df59ce070328456ba20b172ec5e93bc157de7`
- Launch `:1` reached terminal `FAILED` at U3 with `PROVIDER_TRANSPORT_UNAVAILABLE`; U1 and U2 returned, U3 had a completed app-server turn but no phase response was stored.
- U1 returned 14 source/mathematics evidence objects. U2 returned no evidence and one q01 visual blocker. The exact U2 description is preserved in `provider-review-main/prior-partial/u2-response.json`; it states that the required point labels and ratio were visible and there was no apparent clipping. The finding remains intact and was not suppressed.
- The adapter diagnostic trace and original provider receipt are preserved in the same `prior-partial/` directory.

## q01 repair

The q01 figure now shows an equal-unit coordinate plane and labels A(2,−3), P(5,3), and B(7,7), in A-P-B order. It displays AP:PB=3:2. The original A/P/B point and segment primitives are retained and pass the typed expected geometry; the source-only visual expectation and repair witness are in `pipeline-core/q01_source_visual_expectation_repair.json` and `pipeline-core/q01_coordinate_context_repair.json`.

## Fresh batch

- Batch: `visang-workbook-geometry-20260929-q01repair-core4`
- Freeze: `sha256:55f2c2432af9e7d93187e054c66c9784e175937097feb0f62bd3080fedcd39dd`
- Candidate input SHA: `sha256:848718252bca6d6332f78d88c55a64e08ddaa8724634568be1f1d9eff6e407a0`
- 14/14 target questions, 28/28 machine checks PASS, 6 render cases PASS with 84 item witnesses, q01 typed geometry parity PASS, 3 golden exams and 2 frozen negative samples bound.
- `work-batch-next-action` is `FINAL_AUDIT / REVIEW_READY`; no audit has been dispatched on this freeze yet.

Automated render checks do not certify independent readability. The bounded independent FINAL_AUDIT remains outstanding.
