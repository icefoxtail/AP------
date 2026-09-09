# Past Exam V3 GOLD — artifact closure manifest

## Identity

- `START_SHA`: `3d6548596a3b38a7b8493ca8aa2b80ca55f099f7`
- GOLD branch: `codex/past-exam-v3-gold-5sample-20260910`
- Purpose: make the five fresh GOLD runs independently inspectable from a clean checkout of this branch.
- Production mutation: none.
- Pipeline/rule/taxonomy mutation: none.

## Canonical result and local source closure

| GOLD | Canonical frozen result | Local source truth in this branch | Fresh candidate/completed JS |
|---:|---|---|---|
| 1 | `gold-01-19-geumdang/GOLD_RESULT_FROZEN.json` | `gold-01-19-geumdang/source/2019_금당고_2기말.pdf` | `gold-01-19-geumdang/output/candidate/19_금당고_2학기_기말_고1_기출.candidate.js` (extraction skeleton; no completed candidate because Vision blocker) |
| 2 | `gold-02-23-buyeong-v2/reports/GOLD_RESULT_FROZEN.json` | `gold-02-23-buyeong-v2/source/original_exam.pdf`, `source/original_exam.hwp` | Candidate not created; source-only freeze is preserved |
| 3 | `gold-03-20-maesan/child3-final/GOLD_RESULT_FROZEN.json` | `gold-03-20-maesan/source/original_exam.pdf` | `gold-03-20-maesan/staging/final/candidate/20_매산고_2학기_기말_고1_기출.extraction-frozen.js`; `child3-final/candidate/20_매산고_2학기_기말_고1_기출.completed.js` |
| 4 | `gold-04-23-hanyeong/GOLD_RESULT_FROZEN.json` | `gold-04-23-hanyeong/source/original_exam.pdf`, `source/answer_source.hwp` | `gold-04-23-hanyeong/fresh-extraction/candidate/23_한영고_2학기_기말_고1_기출.candidate.js`; `staging/23_한영고_2학기_기말_고1_기출.completed.js` |
| 5 | `gold-05-24-buyeong/fresh-05-corrected/GOLD_RESULT_FROZEN_FINAL.json` | `gold-05-24-buyeong/fresh-05-corrected/source/original_exam.pdf`, `source/original_exam.hwp` | `gold-05-24-buyeong/fresh-05-corrected/extraction/candidate/24_부영여고_2학기_중간_고1_기출.candidate.js` (extraction skeleton; no completed candidate because Vision blocker) |

## Per-run evidence preserved

### GOLD #1

- Full-page source PNGs: `gold-01-19-geumdang/source/pages/` and `output/pages/`
- Fresh extraction/input: `input/`
- Candidate and handoff reports: `output/candidate/`, `output/reports/`
- Calibration/freeze/core evidence: root calibration/freeze JSON files and `core-run-v3/`
- Machine/render evidence: `machine-check-result.json`, `prepare-result*.json`, `render-result-v1.json`, `render-v1/`
- Render screenshots: all diagnostic PNG captures under `render-v1/`

### GOLD #2

- Original PDF/HWP: `source/`
- Full-page renders: `pages/`
- Source inventory and identity map: `reports/source_inventory.json`, `reports/source_identity_map.json`
- Calibration/source-only/freeze result: `manifest.json`, `reports/GOLD_RESULT_FROZEN.json`, `reports/GOLD_RESULT_FROZEN.md`
- Render status evidence: `reports/browser_render_check.md`
- No candidate, answer, solution, visual candidate, machine evidence, or provider receipt was manufactured after the calibration blocker.

### GOLD #3

- Local source and source page renders: `source/`, `pages/`
- Canonical completed candidate and assets: `child3-final/candidate/`, `child3-final/assets/`
- Fresh extraction/final candidate evidence: `staging/final/candidate/`, `staging/final/reports/`
- Source fidelity/math/asset/machine evidence: `child3-final/reports/`, `evidence/`, `staging/evidence/`
- V1 visual triage and expected facts: `VISUAL_TRIAGE_AND_EXPECTED_FACTS.json`, `staging/v1-visual-triage.json`, `staging/expected-facts-freeze.json`
- Calibration/freeze/work-batch evidence: `calibration/`, selected `staging/*.json`, and selected `work-batch/` JSON/MD evidence
- PNG/SVG: `child3-final/assets/` and `browser/`/`render/` diagnostic outputs where present
- Render evidence: `browser_render_check.md`; it remains diagnostic/NOT_TESTED for the full engine closure.

### GOLD #4

- Local original PDF/HWP: `source/`
- Fresh full-page extraction: `fresh-extraction/pages/`, `fresh-extraction/manifest.json`, `fresh-extraction/candidate/`, `fresh-extraction/reports/`
- Fresh completed candidate and completion handoff: `staging/*.js`, `staging/reports/`, `staging/pages/`, `staging/assets/`
- Classification/metadata and source/math/asset evidence: `staging/reports/`, `evidence/`
- V1 visual triage and expected facts: `fresh-extraction/expected-facts-q013.json` and `evidence/q013-svg-coordinate-verification.json`
- Calibration/freeze/work-batch evidence: `calibration/`, `work-batch/`
- PNG/SVG: source visual crops q1/q3/q6/q15 and q13 solution SVG under both fresh/staging asset paths
- Machine/render evidence: `evidence/machine-check-result.json`, `evidence/final_validation_summary.json`, `evidence/browser_render_check.md`; six-case semantic render remains NOT_TESTED.

### GOLD #5

- Original PDF/HWP: `fresh-05-corrected/source/`
- Full-page extraction renders: `fresh-05-corrected/extraction/pages/`
- Fresh extraction candidate and reports: `fresh-05-corrected/extraction/candidate/`, `extraction/reports/`
- Source fidelity, math, asset, machine, and metadata diagnostic reports: `fresh-05-corrected/extraction/reports/`
- Calibration/freeze manifests: `fresh-05-corrected/calibration-decision.json`, `calibration-draft.json`, `manifest-run.json`, `manifest-with-lock.json`, `reference-sample-lock.json`
- Visual/SVG: none reached; the report records this as NOT_REACHED rather than claiming an empty visual pass.
- The initial 23-row `fresh-05/` attempt, parent duplicate result, and all unrelated run duplicates are excluded from the committed closure.

## Path corrections

- Aggregate GOLD #5 canonical reference is `gold-05-24-buyeong/fresh-05-corrected/GOLD_RESULT_FROZEN_FINAL.json`.
- GOLD #4 `evidencePaths.workBatchState` now points to the committed local path `gold-04-23-hanyeong/work-batch/state.json`; the runtime-only path is not required for a clean checkout.
- GOLD #3 and #4 source truth that previously existed only as an external absolute path has a byte-preserving local PDF/HWP copy in the run's `source/` directory. The original source hash remains recorded in the frozen result.

## Deliberately excluded

- `node_modules/`, caches, temporary browser profiles, `__pycache__/`, `*.pyc`, backup files, and temporary logs
- Builder/helper scripts (`*.mjs`, `*.cjs`, `*.py`) that were execution machinery rather than fresh exam artifacts
- Old comparison baseline JS where not required for a fresh artifact inspection
- GOLD #3 versioned duplicate attempts (`run-v4`, `run-v5`, `run-draft-*`, `extraction-v2`, `extraction-v3`, `source-pages-preflight`)
- GOLD #5 initial 23-row run and parent/duplicate non-final result files

Exclusion does not mean the run was erased from the local working directory; it means those files are not part of the reviewable GOLD branch commit. The canonical result, fresh artifact, evidence, and status reports remain available at the paths above.
