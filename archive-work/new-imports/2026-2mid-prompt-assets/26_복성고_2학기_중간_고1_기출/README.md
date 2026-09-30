# 26 복성고 고1 2학기 중간 — source extraction handoff

- Branch: `codex/archive-2026-2mid-prompt-assets`
- Main baseline for NEW_IMPORT_V3: `b2e3aa28b364ddadb97fb0203ef439b51e4662c6`
- Route: `NEW_IMPORT_V3` / Past Exam V3, extraction stage only
- Target: 순천복성고등학교, 2026학년도 2학기 1차 시험, 고1 공통수학2
- Original input folder: `C:\Users\USER\Downloads\2학기중간\복성고1`
- Source pages: 6 JPGs, scanner `_0011.jpg` through `_0016.jpg`; printed footer order 6-1 through 6-6 matches the file order
- Source inventory: 22 questions (19 multiple-choice + 3 written-response)
- Candidate: `run-v5/candidate/26_복성고_2학기_중간_고1_기출.candidate.js`
- Pipeline status: `EXTRACTION_VALIDATED`; question count 22, manual review 0, schema errors 0
- Source text/choice evidence: prompt 22/22 and choices 22/22 checked against their full-page scans
- Layout: KEEP 15 / POLISH 3 / REFORMAT 4; all `layoutTag` values remain `grid`
- Problem image asset: one source crop for q9's line graph; image gate `ok`
- Asset handling: crop uses normalized full-page PNG coordinates `(1200, 225, 1680, 600)`, output 480×375; student pencil notes in blank space outside the printed axes/line/labels were masked. The printed graph, axis labels, origin `O`, and `ax + by + c = 0` label are preserved.
- SVG fallback: none. The printed graph is readable and not severely damaged.
- Answers and solutions: blank with `external_agent_required` on all questions; no solving, Meta classification, DB/index change, or production promotion was performed.
- Browser render: `NOT_RUN_CODEX_HANDOFF`; this branch currently contains extraction-stage artifacts only.
- Calibration: source-specific lock was re-frozen for this target and bound to the same-course/same-grade/same-term 2mid sample observations on the baseline above.
- Layout guidance: latest Notion QUESTION MICRO_LAYOUT reference used as PILOT/HISTORY guidance; hard source-text/choice parity gate is the active Git canonical `docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`.

## Review files

- `manifest.json` — source target and V3 run configuration
- `source/source_manifest.json` and `source/page_p001.jpg`…`page_p006.jpg` — original page bundle and hashes
- `calibration/reference-sample-lock-v3.json` — current high1/common-math 2mid lock
- `run-v5/pages/` — normalized full-page source images
- `run-v5/reports/source_inventory.json` and `source_identity_map.json` — frozen source question identities
- `run-v5/reports/source_fidelity_evidence.json` and `source_text_freeze.json` — page-by-page prompt and choice parity record
- `run-v5/reports/question_layout_report.json` — prompt formatting/parity report
- `run-v5/reports/source_problem_asset_review.json` and `asset_provenance_evidence.json` — q9 graph crop review and provenance
- `run-v5/reports/gpt_gemini_handoff_manifest.json` and `answer_solution_required.csv` — downstream pending-field contract (not sent to an external agent)
