# JS Archive Tag Enrichment

This toolset creates review-only tag enrichment candidates for existing JS archive exam banks.

## Purpose

- Read existing `archive/exams/**/*.js` question banks.
- Analyze existing fields without changing question content, choices, answer, solution, image, `layoutTag`, or `wide`.
- Create candidate enrichment metadata for similar-problem tagging:
  - `subUnitKey`
  - `subUnit`
  - `conceptClusterKey`
  - `problemTypeKey`
  - `templateKey`
  - `difficultyBucket`
  - `tagConfidence`
  - `tagStatus`

## Inputs

- `archive/exams/**/*.js`
- `rules/JS아카이브룰북.txt`
- `rules/# JS아카이브 표준단원키 마스터 테이블.md`

## Outputs

Reports are written under:

```text
archive/_generated/tag-enrichment/reports/
```

The generated reports are candidates only. They are intended for review before any later JS update round.

## Non-Mutation Rule

This pipeline does not edit source exam files. It does not edit:

- `archive/exams/**/*.js`
- `archive/db.js`
- `engine.html`
- `mixed_engine.html`
- `mixer.html`
- rulebook or master-table documents

Even high-confidence candidates are emitted as candidate reports in this round.

## Review Flow

1. Run scan.
2. Build candidate tags.
3. Validate generated candidates.
4. Create a review pack.
5. Review outputs before any future application step.

## Commands

```bash
npm run scan
npm run build
npm run validate
npm run review-pack
npm run run -- --dry-run --limit 20
```

By default, `run` operates as a dry-run report generator and does not mutate source JS files.
