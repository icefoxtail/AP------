# Palma solution SVG technical evidence (2026-10-10)

This package records technical implementation and UI QA for the 10 existing Palma generated-item UIDs. It is not publication authorization. The immutable v8 candidate manifest declares `publicationAuthorized: false` and `renderStatus: NOT_RUN`; root-owned release gates remain separate.

The technical patch uses existing Archive2 output/executor paths. Teacher-only solution preview routes through the standard `sol` envelope with qpp=1/fullwidth; student preview and same-page print remain question-only. qpp=4 retains the existing two-column layout. Valid display-math blocks remain atomic during solution chunking, preserving source TeX and the existing fail-closed typeset readiness check.

Verification: focused regression tests PASS 15/15; `node tools/check-archive2-runtime.cjs` PASS 42/42. Physical post-apply Chrome reports cover all 10 UIDs: qpp=1 teacher solution route, CSS font floor, exact physical SVG response bytes, student no-leak and question-only print. Q19 is output-ready with no MathJax error and its minimum rendered SVG text is 11.338168 CSS px at a 638.296875 CSS px image width. qpp=4 verifies the default two columns and divider.

After Chrome QA, root applied an exact hash-only rebind to the consumer `index.json` and metadata cutover file; their after-SHAs and apply receipt are recorded here. The Archive page `archive/index.html` code SHA remains separately recorded in the technical closeout. This rebind did not alter question/solution body, visual assets, or rendered output. No new Chrome run was required for the metadata-only index/cutover hash change.

`technical-closeout-v8.json` carries the tracked code allowlist and raw test evidence hashes. `strict-preview-runtime.json` records the physical fixture, URL patterns, source/consumer/asset provenance, and the hash-only rebind. `manifest.json` hashes every file in this package except itself.
