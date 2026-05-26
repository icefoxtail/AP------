# Answer From Solution Source SOP

## Purpose

Fill `answer` only when answer source evidence or explicitly allowed direct solving is certain.

## Files To Read First

- Answer PDF, answer table, answer crop, quick answer table report, or answer source map.
- Operating JS content/choices for the target item.
- Existing answer mismatch/manual review reports.

## Allowed Work

- Modify `answer` only when the task explicitly allows answer entry.
- Use direct solving only when the task explicitly permits it and the JS content/choices are sufficient.

## Forbidden Work

- Do not edit `content`, `choices`, `solution`, `id`, `displayNo`, `setKey`, `sourceQuestionNo`, metadata, tags, standardUnit, image, or order.
- Do not map answers by displayNo alone when numbering restarts by unit.
- Do not guess answers from weak OCR.

## Evidence Standard

Match unit/setKey, displayed number, source question number, content keywords, choices, and answer-source range.

## Report Standard

Record source path, source unit, source problem number, source answer, matching basis, and whether direct solve was used.

## Verification

Run `node --check`, questionBank parse, answer risk scan, and protected-field diff scan when edits are allowed.

## Stop Conditions

Classify as manual review for missing source, unreadable source, displayNo mismatch, setKey mismatch, answer mismatch, graph/diagram dependency, or direct solve uncertainty.

