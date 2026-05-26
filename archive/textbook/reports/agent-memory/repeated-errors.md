# Repeated Errors

- Reading only `CODEX_RESULT.md` and not checking the actual files/reports.
- Treating `bboxSlotNo` as `displayNo` or a printed problem number.
- Creating content when the full page does not show the matching printed number.
- Guessing an answer without answer source evidence or a permitted direct solve path.
- Overwriting `generated/reports` when a task only asks for a draft or audit.
- Letting `.codex_tmp`, `.codex_deps`, or `.codex_work` noise hide real working tree changes.
- Allowing multiple Codex windows to edit the same JS file.
- Treating formula scanner false positives as confirmed formula errors.
- Passing mojibake, broken OCR, image-only text, or image paths as valid content.

