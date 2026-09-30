# 26 왕운중 중2 2학기 중간 — source extraction handoff

- Branch: codex/archive-2026-2mid-prompt-assets
- NEW_IMPORT_V3 calibration baseline: a452eb986f6ebb5ac63c87056aba7bd200915131
- Target: 순천왕운중학교, 2026학년도 2학기 1차 시험, 중2 수학
- Original input folder: C:\Users\USER\Downloads\2학기중간\왕운중2
- Source pages: 6 JPGs, _0001.jpg through _0006.jpg; printed footer order 6-1 through 6-6 matches the file order
- Source inventory: 24 questions (20 multiple-choice + 4 written-response)
- Candidate: run-v13/candidate/26_왕운중_2학기_중간_중2_기출.candidate.js
- Pipeline status: EXTRACTION_VALIDATED; 24 questions, 0 manual-review items, 0 schema errors
- Source text and choice evidence: all 24 prompts and choice arrays checked against the original full-page scans
- Layout: KEEP 21 / POLISH 1 / REFORMAT 2 / HOLD 0; all layoutTag values remain grid
- Problem image assets: 21 source crops; image gate ok; crop boundaries reviewed against their full-page source pages
- SVG fallback: none. Every printed diagram remains legible in its source scan; q9's printed halftone fill and labels are preserved.
- Answers and solutions: blank with external_agent_required on all 24 questions. No solving, Meta classification, DB/index change, external answer/solution handoff, or production promotion was performed.
- Browser render: NOT_RUN_CODEX_HANDOFF; this is an extraction-stage candidate.
- Calibration: current M2 lock uses the unchanged same-grade/course/semester 2mid samples 25_왕운중 and 25_연향중 and is bound to the main SHA above.
- Layout guidance: the current Notion QUESTION MICRO_LAYOUT reference was applied as PILOT/HISTORY guidance; exact source text and choices are governed by the active Git canonical docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md.

## Review and handoff files

- manifest.json — source target, archive path, and V3 configuration
- source/source_manifest.json and source/page_p001.jpg … page_p006.jpg — original full-page evidence and SHA-256 values
- calibration/reference-sample-lock-v3.json — target-bound M2 2mid calibration lock
- run-v13/pages/ — normalized full-page source images
- run-v13/reports/source_inventory.json and source_identity_map.json — frozen 24-question identity set
- run-v13/reports/source_fidelity_evidence.json and source_text_freeze.json — prompt and choice parity record
- run-v13/reports/question_layout_report.json — layout-only formatting and exact-parity record
- run-v13/reports/source_problem_asset_review.json and asset_provenance_evidence.json — crop review, provenance, and required visual checks
- run-v13/reports/answer_solution_required.csv — pending downstream fields; no external handoff was sent
