# Content From Full Page Crop SOP

## Purpose

Enter or review `content` and `choices` only when source image evidence is clear.

## Files To Read First

- Operating JS file for the target `book/jsFile`.
- Full page crop.
- Question crop, only as zoom/reference.
- Mapping reports linking `setKey`, `displayNo`, `sourceQuestionNo`, page, and crop.

## Allowed Work

- Enter visible question text.
- Enter choices only when they are visible and structurally clear.

## Forbidden Work

- Do not invent question text.
- Do not use question crop alone when full page context is required.
- Do not put image paths or `<img>` tags in `content`.
- Do not pass broken OCR as complete content.

## Evidence Standard

The full page must support page flow, printed problem number, and shared conditions.

## Report Standard

Record `book`, `jsFile`, `id`, `displayNo`, `setKey`, source page/crop path, and manual review reason for skipped items.

## Verification

Run `node --check`, questionBank parse, content image-path scan, broken OCR scan, and protected-field diff scan when edits are allowed.

## Stop Conditions

Stop or classify when page/display number does not match, visual assets are missing, OCR is unreadable, or the item appears stale/extra.

