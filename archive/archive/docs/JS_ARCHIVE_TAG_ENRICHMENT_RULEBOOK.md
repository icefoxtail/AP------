# JS Archive Tag Enrichment Rulebook

## 1. Purpose

This rulebook governs enrichment of existing `archive/exams/**/*.js` question metadata so the archive can support:

- similar-question search;
- balanced assessment generation;
- weak-unit and weak-type recommendations;
- safer future past-exam PDF conversion.

This is a metadata policy. It does not authorize changing question text, choices, answers, solutions, IDs, order, or rendering behavior.

## 2. Scope

Applies to existing and future JS archive question objects in:

- `archive/exams/**/*.js`
- generated JS candidates before they are promoted into `archive/exams`
- tag/audit reports generated from those JS files

Does not apply to UI copy, engine rendering functions, APMS screens, or teacher/admin dashboard wording.

## 3. Protected fields

Tag enrichment must not modify these fields unless a separate task explicitly authorizes that exact field:

- `window.examTitle`
- question order
- `id`
- `n`
- `displayNo`
- `setKey`
- `sourceQuestionNo`
- `content`
- `choices`
- `answer`
- `solution`
- `image`
- existing `sourceFile` / source identity fields

Allowed by default for this policy:

- add missing metadata fields;
- add `tags` entries;
- add confidence/status fields;
- add links to master-table keys;
- generate reports and patch candidates.

## 4. Why existing unit tags are not enough

Current archive data often uses broad unit tags:

- middle school: usually large-unit level;
- high school: often middle-unit level.

That is enough for unit filtering, but not enough for similar-question retrieval.

Similar-question matching needs a deeper hierarchy:

1. `standardUnitKey` — current archive unit key, kept for compatibility.
2. `subUnitKey` — smaller learning unit.
3. `conceptClusterKey` — concept group.
4. `problemTypeKey` — problem type.
5. `templateKey` — actual solution-pattern key.

## 5. Required tag hierarchy

Every enriched question should try to carry the following hierarchy:

```js
{
  standardUnitKey: "M2-01",
  standardUnit: "유리수와 순환소수",
  subUnitKey: "M2-01-RATIONAL_DECIMAL",
  subUnit: "유리수와 소수 표현",
  conceptClusterKey: "FINITE_REPEATING_DECIMAL",
  problemTypeKey: "FINITE_DECIMAL_DENOMINATOR_FACTOR",
  templateKey: "FINITE_DECIMAL_AFTER_REDUCTION",
  difficultyBucket: "standard",
  tagConfidence: "high",
  tagStatus: "auto_high"
}
```

The existing `standardUnitKey` remains the outer compatibility layer. New keys refine it; they do not replace it.

## 6. Field definitions

### `standardUnitKey`
Existing archive-level unit key. Keep current values unless a separate mapping/audit task explicitly authorizes correction.

Examples:

- `M2-01`
- `H15-SA-02`
- `H22-C-COUNTING`

### `subUnitKey`
Smaller learning unit within the archive unit. It should come from the master table, not one-off wording inside a JS file.

### `conceptClusterKey`
Concept group used for weak-point aggregation and broad similar-question discovery.

### `problemTypeKey`
Problem type. This is the minimum useful key for similar-question search.

### `templateKey`
Solution-pattern key. This is the strongest key for true similar questions.

### `difficultyBucket`
Normalized difficulty bucket. Do not replace original `level` unless separately authorized.

Recommended values:

- `basic`
- `standard`
- `advanced`
- `challenge`
- `unknown`

### `tagConfidence`
Confidence of the generated enrichment.

Allowed values:

- `high`
- `medium`
- `low`

### `tagStatus`
Workflow status.

Allowed values:

- `existing`
- `auto_high`
- `auto_medium`
- `auto_low`
- `manual_review`
- `reviewed_pass`
- `reviewed_fail`

## 7. Similar-question matching policy

Similar-question search must not use only `standardUnitKey`.

Recommended ranking:

1. Strong similar-question candidate:
   - same `templateKey`;
   - same `problemTypeKey`;
   - same `conceptClusterKey`;
   - different `sourceFile` or different source exam where possible;
   - difficulty within nearby bucket.

2. Similar type candidate:
   - same `problemTypeKey`;
   - same `conceptClusterKey`;
   - different source where possible.

3. Related practice candidate:
   - same `conceptClusterKey`;
   - same or adjacent `subUnitKey`.

4. Unit-level supplement only:
   - same `standardUnitKey` but different type/template.

Do not label a question as “유사문제” when only `standardUnitKey` matches.

## 8. Auto-tagging workflow

The safe enrichment flow is:

1. Scan all existing JS files.
2. Parse `window.examTitle` and `window.questionBank`.
3. Read each question’s existing fields.
4. Generate tag candidates from:
   - `content`;
   - `choices`;
   - `answer`;
   - `solution` when available;
   - existing `category` / `originalCategory`;
   - existing `standardUnitKey` / `standardUnit`;
   - source file path and title.
5. Validate candidate keys against the master table.
6. Compare with the existing unit key.
7. Emit patch candidates only.
8. Auto-apply only `tagConfidence: high` if the task explicitly allows auto-apply.
9. Put `medium` and `low` into review reports.

## 9. Auto-apply threshold

Allowed for auto-apply:

- `tagConfidence: high`;
- no conflict with existing `standardUnitKey`;
- keys exist in the master table;
- question has enough text or solution evidence;
- no diagram/table/image-only dependency that affects type judgment.

Must be review-only:

- multiple plausible units;
- missing answer;
- missing or weak content;
- image-heavy problem where text alone does not determine type;
- solution contradicts content or category;
- new key not present in master table;
- middle-school broad unit split is ambiguous;
- high-school cross-unit problem.

## 10. Reports required before changing JS

An enrichment run must produce reports before JS is patched:

- `tag_enrichment_summary.json`
- `tag_patch_candidates.json`
- `tag_auto_high_candidates.json`
- `tag_medium_review.json`
- `tag_low_review.json`
- `tag_conflict_report.json`
- `unknown_master_key_report.json`
- `similarity_key_coverage_report.json`

## 11. Master table dependency

All new unit/type/template keys must be backed by:

- `archive/data/master_tables/js_archive_tag_master.schema.json`
- `archive/data/master_tables/js_archive_tag_master.sample.json`
- the later production master table file when created.

Do not invent one-off keys inside an individual JS file.

## 12. Example: middle school

Existing broad tag:

```js
standardUnitKey: "M2-01",
standardUnit: "유리수와 순환소수"
```

Enriched tags:

```js
subUnitKey: "M2-01-FINITE_DECIMAL",
subUnit: "유한소수 판정",
conceptClusterKey: "FINITE_REPEATING_DECIMAL",
problemTypeKey: "FINITE_DECIMAL_DENOMINATOR_FACTOR",
templateKey: "FINITE_DECIMAL_AFTER_REDUCTION"
```

## 13. Example: high school

Existing unit:

```js
standardUnitKey: "H15-SA-02",
standardUnit: "항등식과 나머지정리"
```

Enriched tags:

```js
subUnitKey: "H15-SA-02-REMAINDER_THEOREM",
subUnit: "나머지정리",
conceptClusterKey: "REMAINDER_FACTOR_THEOREM",
problemTypeKey: "REMAINDER_THEOREM_DIRECT_SUBSTITUTION",
templateKey: "REMAINDER_THEOREM_LINEAR_DIVISOR"
```

## 14. Enforcement

A task that adds or changes similar-question logic must verify:

- it does not rely on `standardUnitKey` alone;
- it ignores `tagStatus: auto_low` and `manual_review` by default;
- it can explain which key level was used for the match;
- it avoids same-source duplication unless explicitly requested.
