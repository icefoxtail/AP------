# JS Archive Tag Enrichment

This toolset creates review-only tag enrichment candidates for existing JS archive exam banks.

## Purpose

- Read existing `archive/exams/**/*.js` question banks.
- Analyze existing fields without changing question content, choices, answer, solution, image, `layoutTag`, or `wide`.
- Create read-only inventory and possible L1/L2 subunit hints. These are not canonical decisions.
- Route all L3/L4, CrossConcept, Condition, IntegrationPattern, and difficulty work to the shared RPM→ACTIVE resolver and its independent evidence contract.

## Inputs

- `archive/exams/**/*.js`
- `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md`
- `docs/rules/JS아카이브_세부단원_운영규칙_v1.md`
- `docs/rules/JS아카이브_표준단원키_마스터테이블.md`

## Outputs

Reports are written under:

```text
archive/_generated/tag-enrichment/reports/
```

The generated reports are hint-only. Local seed patterns cannot create authoritative L3/L4 assignments.
This tool emits no advanced Meta keys and never maps legacy `level` to `difficultyBucket`.

## Non-Mutation Rule

This pipeline does not edit source exam files. It does not edit:

- `archive/exams/**/*.js`
- `archive/db.js`
- `engine.html`
- `mixed_engine.html`
- `mixer.html`
- rulebook or master-table documents

Even high-confidence candidates are emitted as candidate reports in this round.

Candidate records must also carry `subUnitConfidence` and `subUnitClassificationDepth`.
Allowed values are fixed by `docs/rules/JS아카이브_세부단원_운영규칙_v1.md`.

## Review Flow

1. Run scan.
2. Build candidate tags.
3. Validate generated candidates.
4. Create a review pack for the inventory and subunit hints.
5. Send advanced Meta decisions to `archive/tools/meta-foundation/rpm-active-resolver.mjs` after the source and verified final solution are fixed.

## Commands

```bash
npm run scan
npm run build
npm run validate
npm run review-pack
npm run run -- --dry-run --limit 20
```

By default, `run` operates as a dry-run report generator and does not mutate source JS files.
