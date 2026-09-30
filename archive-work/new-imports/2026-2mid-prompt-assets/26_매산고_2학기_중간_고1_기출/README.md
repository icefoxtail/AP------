# 26 매산고 고1 2학기 중간 — source extraction handoff

- Branch: `codex/archive-2026-2mid-prompt-assets`
- Base main: `b2e3aa28b364ddadb97fb0203ef439b51e4662c6`
- Route: `NEW_IMPORT_V3` / Past Exam V3, extraction stage only
- Target: 순천매산고등학교, 2026학년도 2학기 1차 정기시험, 고1 공통수학2
- Source pages: 6 full-page JPGs, read in printed footer order 1/6 through 6/6
- Scanner ordering correction: printed page 3 is source file `_0004.jpg`; printed page 4 is `_0003.jpg`
- Source question inventory: 21 (객관식 15 + 단답형 3 + 서술형 3)
- Candidate: `run-v6/candidate/26_매산고_2학기_중간_고1_기출.candidate.js`
- Pipeline extraction status: `EXTRACTION_VALIDATED`; manual review 0, schema errors 0
- Source text parity: 21/21; choices exact equality: 21/21
- Layout: KEEP 9, POLISH 10, REFORMAT 2; layoutTag stays `grid`
- Problem assets: 3 crops — q12, q15, q18
- SVG fallback: none; the printed figures are legible enough for source crops. q12 retains a faint student pencil trace at the lower crop edge, recorded as WARN for the next visual review.
- Answers and solutions: blank with `external_agent_required` status on every question; no solving, Meta classification, DB/index change, or production promotion was performed.
- Browser render: `NOT_RUN_CODEX_HANDOFF` because this handoff ends after source extraction/layout.

## Review and handoff files

- `manifest.json` — target and V3 run configuration
- `source/source_manifest.json` and `source/page_p001.jpg` … `page_p006.jpg` — original full-page evidence and SHA-256 values
- `calibration/reference-sample-lock-v3.json` — current main `2mid` calibration lock using 25 제일고 and 25 효천고
- `run-v6/pages/` — normalized full-page PNGs
- `run-v6/reports/source_inventory.json` and `source_identity_map.json` — frozen 21-question identity set
- `run-v6/reports/source_fidelity_evidence.json` — full-page `content` and `choices` check
- `run-v6/reports/source_text_freeze.json` and `question_layout_report.json` — raw transcription freeze and micro-layout parity
- `run-v6/reports/source_problem_asset_review.json` — crop review and q12 note
- `run-v6/reports/gpt_gemini_handoff_manifest.json` and `answer_solution_required.csv` — downstream answer/solution handoff metadata

The Notion QUESTION MICRO_LAYOUT page was used for prompt-flow calibration. Its page identifies itself as PILOT/HISTORY; the hard text and choice parity gate comes from the current Git canonical `JS아카이브_문항조판_운영규칙_v1.md`.
