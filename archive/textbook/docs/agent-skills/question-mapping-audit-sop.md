# Question Mapping Audit SOP

## Purpose

Audit whether JS items, question crops, full page crops, and source problem numbers point to the same problem.

## Files To Read First

- Operating JS.
- `question_crop_map` or equivalent mapping report.
- Full page crop and section/page map.
- Prior reset/exclude/manual review reports.

## Allowed Work

- Produce report-only audit decisions unless the task explicitly allows data changes.

## Forbidden Work

- Do not promote `bboxSlotNo`, OCR slot ids, or legacy `jsIdCandidate` to printed problem identity.
- Do not reset, delete, or exclude items unless the task explicitly permits it.

## Evidence Standard

Use `setKey + sourceDisplayNo` and full page printed number evidence. Workbook numbering may restart.

## Report Standard

Include `book`, `jsFile`, `setKey`, sampled ids/displayNos, JS snippet, question crop path, full page crop path, observed printed number, and classification.

## Verification

For report-only audits, verify JSON/Markdown creation and no operating JS diff.

## Stop Conditions

Classify as manual check if full page evidence is unavailable or crop boundaries are merged.

