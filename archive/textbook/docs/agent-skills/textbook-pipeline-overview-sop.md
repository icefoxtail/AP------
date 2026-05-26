# Textbook Pipeline Overview SOP

## Purpose

Orient a worker before touching `archive/textbook` pipeline artifacts.

## Files To Read First

- `.agent/BOOT.md`
- `.agent/PIPELINE_STATE.md`
- `CODEX_RESULT.md`
- `tools/textbook-pipeline/README.md`
- relevant reports under `reports/`

## Allowed Work

- Read source PDFs, configs, operating reports, and existing output summaries.
- Create report-only summaries when the task allows.

## Forbidden Work

- Do not run stages, OCR, crop, PDF render, or API calls unless the task explicitly allows it.
- Do not edit generated JS or pipeline code from an orientation task.

## Evidence Standard

Do not trust a summary alone. Confirm current files and reports directly.

## Report Standard

Report exact files read, current scope, and protected paths.

## Verification

Run path-level git checks for forbidden areas before final response.

## Stop Conditions

Stop if required draft/source files are missing and the task says to report missing inputs only.

