# JS Bank Cleanup 0 Inventory

This toolset creates a read-only inventory for the current JS archive bank.

## Purpose

- Inventory `archive/exams/**/*.js`.
- Inventory `archive/db.js`.
- Inventory image assets under `archive/assets/images` and `assets/images` when present.
- Compare DB entries, real JS files, question counts, metadata, schema fields, and image references.
- Produce cleanup candidates for the next correction round without changing source files.

## Inputs

- `archive/exams/**/*.js`
- `archive/db.js`
- `archive/assets/images/**`
- `assets/images/**`
- `rules/JS아카이브룰북.txt`
- `rules/# JS아카이브 표준단원키 마스터 테이블.md`

## Outputs

All generated reports are written to:

```text
archive/_generated/js-bank-cleanup/reports/
```

Main reports:

- `js-bank-inventory.json`
- `js-bank-inventory.summary.md`
- `db-index-inventory.json`
- `db-vs-files-mismatch.json`
- `db-vs-files-mismatch.summary.md`
- `image-asset-inventory.json`
- `missing-image-report.json`
- `orphan-image-report.json`
- `image-tag-warning-report.json`
- `schema-validation.json`
- `schema-validation.summary.md`
- `cleanup-candidates.json`
- `cleanup-candidates.safe-structure-only.json`
- `cleanup-candidates.requires-review.json`
- `cleanup-candidates.summary.md`

## Run

```bash
npm run run -- --dry-run --limit 30
npm run run -- --dry-run --grade 중1 --limit 30
```

`--grade` accepts exact school-year values only: `중1`, `중2`, `중3`, `고1`, `고2`, `고3`.
Partial text such as `중`, `고`, or `중간` is rejected so exam-type words in filenames cannot be mistaken for grade filters.

## Non-Mutation Rule

This cleanup round does not edit:

- `archive/exams/**/*.js`
- `archive/db.js`
- `engine.html`
- `mixed_engine.html`
- `mixer.html`
- rulebook or master-table files
- content, choices, answer, solution, image, `layoutTag`, `wide`, or tags

No review-pack zip is created by this tool.

## How To Read Reports

- Inventory reports describe the current state.
- Mismatch reports identify DB/file inconsistencies.
- Schema validation reports identify missing or invalid current fields.
- Cleanup candidates are proposals only. `autoFixSafe: true` means a future structural correction may be safe after review; it is not applied in this round.
- Anything involving content, choices, answer, solution, image path, `layoutTag`, `wide`, or uncertain standard-unit mapping is marked for master review.
- Limited runs explicitly set `presenceScope: skipped-limited-run` and/or `orphanScope: skipped-filtered-run` where whole-bank checks cannot be interpreted as complete archive status.
