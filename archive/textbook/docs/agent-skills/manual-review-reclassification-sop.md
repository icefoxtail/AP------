# Manual Review Reclassification SOP

## Purpose

Turn broad manual review pools into actionable categories without guessing.

## Files To Read First

- Latest manual review reports.
- Operating JS for affected items.
- Matching content, answer, mapping, validation, and stale/exclude reports.

## Allowed Work

- Create queue/report outputs.
- Fill allowed fields only if the task explicitly permits that kind of edit.

## Forbidden Work

- Do not solve uncertain items by force.
- Do not delete or exclude normal questions silently.

## Evidence Standard

Every item must receive one controlled reason.

## Report Standard

Use categories: `content_input_required`, `answer_source_required`, `source_image_required`, `page_mapping_mismatch`, `stale_or_extra_js_question`, `formula_review_required`, `final_hold`.

## Verification

Check JSON parse and confirm forbidden paths did not change.

## Stop Conditions

Stop if the report cannot identify `book`, `jsFile`, `id`, and reason.

