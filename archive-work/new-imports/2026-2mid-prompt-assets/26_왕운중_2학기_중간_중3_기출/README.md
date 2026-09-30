# 26 왕운중 중3 2학기 중간 — source extraction handoff

- Branch: `codex/archive-2026-2mid-prompt-assets`
- NEW_IMPORT_V3 baseline main: `a452eb986f6ebb5ac63c87056aba7bd200915131`
- Target: 순천왕운중학교, 2026학년도 2학기 1차 시험, 중3 수학
- Original input folder: `C:\Users\USER\Downloads\2학기중간\왕운중3`
- Source pages: 5 JPGs, `_0007.jpg` through `_0011.jpg`, in printed footer order 5-1 through 5-5
- Source inventory: 23 questions (20 multiple-choice + 3 written-response)
- Candidate: `run-v15/candidate/26_왕운중_2학기_중간_중3_기출.candidate.js`
- Pipeline status: `NEEDS_WORK` / `EXTRACTED`; 23 questions, 0 schema errors, 2 manual-review items
- Source text/choice evidence: 23/23 prompts and 23/23 choice arrays checked against full-page scans
- Layout: KEEP 14 / POLISH 2 / REFORMAT 7; all `layoutTag` values remain `grid`
- Problem image assets: 19 crops from source bboxes; pipeline image gate `ok`
- Asset warning: q13's printed sheep illustration has heavy halftone/scan texture. Its two 3 m labels, 51° angles, height `h`, and 0.5 m clearance remain legible; the exact source crop is retained.
- Source-review hold: q23 says to use a table, but no printed table is visible on the supplied page. The nearby handwritten 60° mark was excluded as student work. The prompt is transcribed as printed; the source-table question remains for review.
- SVG fallback: none. The mathematical diagrams and their labels remain readable from the source scans, so no reconstruction was used.
- Answers and solutions: blank with `external_agent_required` on all 23 questions. No solving, Meta classification, DB/index change, external answer/solution handoff, or production promotion was performed.
- Browser render: `NOT_RUN_CODEX_HANDOFF`; this is an extraction-stage candidate.
- Calibration: current lock is target-bound to main SHA above and uses unchanged same-grade/course/semester 2mid samples `25_왕운중` and `25_연향중`.
- Layout guidance: latest Notion QUESTION MICRO_LAYOUT reference used as PILOT/HISTORY guidance; the active Git canonical `docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md` remains the exact source-text and choices gate.

## Review files

- `manifest.json` — target, archive path, and V3 configuration
- `source/source_manifest.json` and `source/page_p001.jpg`…`page_p005.jpg` — original page bundle and SHA-256 values
- `calibration/reference-sample-lock-v3-a452.json` — current M3/common-math 2mid calibration lock
- `run-v15/pages/` — normalized full-page source images
- `run-v15/reports/source_inventory.json` and `source_identity_map.json` — frozen source question identities
- `run-v15/reports/source_fidelity_evidence.json` and `source_text_freeze.json` — prompt and choice parity record
- `run-v15/reports/question_layout_report.json` — layout-only formatting and parity record
- `run-v15/reports/source_problem_asset_review.json` and `asset_provenance_evidence.json` — all 19 source visual crops and review notes
- `run-v15/reports/answer_solution_required.csv` — pending downstream fields; no handoff was sent
