# Curriculum Tag Master Table Rulebook

## 1. Purpose

This document defines how AP Math JS Archive should maintain curriculum, sub-unit, concept, problem-type, and template keys for assessment generation and similar-question search.

The master table prevents ad hoc tag naming and prevents future rulebook conflicts.

## 2. Core principle

Do not hard-code curriculum/type labels directly into random JS files.

All reusable keys should be defined in a master table first, then linked from questions.

Question JS files may reference keys, but they are not the source of truth for the key system.

## 3. Separation of responsibilities

### JS question file
Stores actual question data and references to keys.

Examples:

- `standardUnitKey`
- `subUnitKey`
- `conceptClusterKey`
- `problemTypeKey`
- `templateKey`
- `tagConfidence`
- `tagStatus`

### Master table
Defines key meaning, hierarchy, aliases, allowed usage, and evidence requirements.

### Rulebook
Defines what is allowed, what is forbidden, and when review is required.

## 4. Required hierarchy

```text
course
→ grade
→ semester
→ standardUnitKey
→ subUnitKey
→ conceptClusterKey
→ problemTypeKey
→ templateKey
```

This hierarchy supports both:

- broad unit filtering;
- precise similar-question matching.

## 5. Master table record shape

A production master table record should follow this shape:

```json
{
  "key": "FINITE_DECIMAL_AFTER_REDUCTION",
  "keyType": "templateKey",
  "labelKo": "기약분수 변환 후 유한소수 판정",
  "parentKey": "FINITE_DECIMAL_DENOMINATOR_FACTOR",
  "course": "중2 수학",
  "grade": "중2",
  "semester": "1학기",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-FINITE_DECIMAL",
  "conceptClusterKey": "FINITE_REPEATING_DECIMAL",
  "problemTypeKey": "FINITE_DECIMAL_DENOMINATOR_FACTOR",
  "aliasesKo": ["유한소수 판정", "분모 소인수 판정"],
  "description": "분수를 기약분수로 고친 뒤 분모의 소인수가 2와 5뿐인지 확인하는 유형",
  "evidencePolicy": "content_or_solution_required",
  "autoApplyAllowed": true,
  "reviewRequiredWhen": ["multiple_units_possible", "image_only", "missing_content"],
  "status": "draft"
}
```

## 6. Key type definitions

Allowed `keyType` values:

- `standardUnitKey`
- `subUnitKey`
- `conceptClusterKey`
- `problemTypeKey`
- `templateKey`

## 7. Source-backed curriculum entries

When the table is expanded with curriculum-level entries, the source must be recorded.

Recommended fields:

- `sourceKind`
- `sourceTitle`
- `sourceUrlOrPath`
- `sourcePage`
- `sourceNote`
- `verifiedAt`
- `verifiedBy`

If a source cannot be confirmed, keep the record as `draft` and do not allow `autoApplyAllowed: true`.

## 8. Status values

Allowed `status` values:

- `draft`
- `reviewed`
- `active`
- `deprecated`

Policy:

- `draft`: can appear in reports but should not auto-apply.
- `reviewed`: usable for manual tagging.
- `active`: usable for auto-high tagging.
- `deprecated`: must not be newly assigned.

## 9. Auto-apply policy

A master-table key may be used for automatic tagging only when:

- `status` is `active`;
- `autoApplyAllowed` is true;
- the parent chain exists;
- the key does not conflict with the existing `standardUnitKey`;
- the question has enough source evidence.

## 10. Middle school policy

Middle-school archive units may currently be broad. The master table should gradually split them into sub-units and types.

Do not replace existing broad `standardUnitKey` values. Add finer keys alongside them.

Example:

```text
M2-01 유리수와 순환소수
→ M2-01-FINITE_DECIMAL 유한소수 판정
→ FINITE_REPEATING_DECIMAL
→ FINITE_DECIMAL_DENOMINATOR_FACTOR
→ FINITE_DECIMAL_AFTER_REDUCTION
```

## 11. High school policy

High-school archive units may already be middle-unit level. Still, similar-question search requires type/template keys.

Example:

```text
H15-SA-02 항등식과 나머지정리
→ H15-SA-02-REMAINDER_THEOREM 나머지정리
→ REMAINDER_FACTOR_THEOREM
→ REMAINDER_THEOREM_DIRECT_SUBSTITUTION
→ REMAINDER_THEOREM_LINEAR_DIVISOR
```

## 12. Similar-question key requirement

For true similar-question search, the system should prefer:

- same `templateKey`;
- same `problemTypeKey`;
- same `conceptClusterKey`;
- different source exam/file when possible.

`standardUnitKey` alone is not enough.

## 13. Production table location

Recommended production path:

```text
archive/data/master_tables/js_archive_tag_master.json
```

Schema path:

```text
archive/data/master_tables/js_archive_tag_master.schema.json
```

Sample path:

```text
archive/data/master_tables/js_archive_tag_master.sample.json
```

## 14. Review reports

Any script that proposes new master keys must emit:

- `new_master_key_candidates.json`
- `master_key_conflict_report.json`
- `deprecated_key_usage_report.json`
- `unknown_parent_key_report.json`
