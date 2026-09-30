# 26 왕운중 중1 2학기 중간 — source extraction handoff

- Branch: codex/archive-2026-2mid-prompt-assets
- NEW_IMPORT_V3 calibration main baseline: bb358e53aa27128200b2bb5165a5b7ddbf0158e2
- Target: 순천왕운중학교, 2026학년도 2학기 1차 시험, 중1 수학
- Original input folder: C:\Users\USER\Downloads\2학기중간\왕운중1
- Source pages: 4 JPGs, _0001.jpg through _0004.jpg; printed footer order 4-1 through 4-4 matches the file order
- Source inventory: 23 questions (20 multiple-choice + 3 written-response)
- Candidate: run-v14/candidate/26_왕운중_2학기_중간_중1_기출.candidate.js
- Pipeline status: NEEDS_WORK / EXTRACTED; 23 questions, 0 schema errors, 4 visual items remain in WARN/manual review
- Source text and choice evidence: all 23 prompts and choice arrays checked against the original full-page scans
- Layout: KEEP 18 / POLISH 1 / REFORMAT 4 / HOLD 0; all layoutTag values remain grid
- Problem image assets: 18 visual crops; q19 and q20 share one smartphone-use table asset through a sharedMaterialUid
- Student work: no handwritten answers or solutions were transcribed. Off-figure calculations near q13 and q19/q20 were masked from the image crops.
- Remaining asset warnings: q6's pencil circle touches the table margin and the printed value 20, q14 has a faint pencil dash in the shaded plot, q17 has student marks around x/y in the data row, and q23 has handwritten 60° notes near B and C. The printed values, graph, ordered data row, and triangle geometry remain readable.
- SVG fallback: none. No printed figure was damaged beyond reliable source reading; q23's printed triangle, point labels, intersections, and BD=CE ticks remain visible, so no reconstruction was used.
- Answers and solutions: blank with external_agent_required on all 23 questions. No solving, Meta classification, DB/index changes, external answer/solution handoff, or production promotion was performed.
- Browser render: NOT_RUN_CODEX_HANDOFF; this is an extraction-stage candidate.
- Calibration: reference-sample-lock-v5.json is bound to main SHA above. It uses 25 왕운중 and 25 팔마중 as same-grade/course/term references; 25 왕운중 중2 is included only to anchor separate solution-visual quality axes because the available M1 2mid samples have no solutionImage examples.
- Rule integrity: the active rules manifest hashes were refreshed for the three rule documents changed on main; calibration preflight passes.
- Layout guidance: the current Notion QUESTION MICRO_LAYOUT reference was applied as PILOT/HISTORY guidance; exact source text and choices are governed by docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md.

## Review and handoff files

- manifest.json — source target, archive path, and V3 configuration
- source/source_manifest.json and source/page_p001.jpg through page_p004.jpg — original full-page evidence and SHA-256 values
- calibration/reference-sample-lock-v5.json — current M1 calibration lock
- run-v14/pages/ — normalized full-page source images
- run-v14/reports/source_inventory.json and source_identity_map.json — frozen 23-question identity set
- run-v14/reports/source_fidelity_evidence.json and source_text_freeze.json — prompt and choice parity record
- run-v14/reports/question_layout_report.json — layout-only formatting and exact-parity record
- run-v14/reports/source_problem_asset_review.json and asset_provenance_evidence.json — crop review, provenance, shared table binding, masks, and remaining warnings
- run-v14/reports/answer_solution_required.csv — pending answer/solution fields; no external handoff was sent
