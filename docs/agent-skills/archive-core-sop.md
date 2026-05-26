# Archive Core SOP

Use for archive UI, engines, mixer, mixed output, QR print, and wrong-print work.

## Protected Areas

- `archive/index.html`
- `archive/mixer.html`
- `archive/mixed_engine.html`
- `archive/wrong_print_engine.html`
- `archive/db.js`
- archive QR/OMR submit output behavior

## Procedure

1. Identify whether the task touches archive UI, engine output, or data.
2. Preserve QR/OMR submission policy.
3. Keep engine variants separate and document which one changed.
4. Avoid broad data rewrites in `archive/exams`.
5. Verify generated output paths and image references when applicable.
