# OMR QR Clinic Report SOP

Use for OMR, QR, clinic print, wrong answer, report center, and report AI work.

## Protected Areas

- `check`
- `apmath/js/qr-omr.js`
- `apmath/js/clinic-print.js`
- `apmath/js/report.js`
- `apmath/wrong_print_engine.html`
- `report-ai-proxy`
- `apmath/worker-backup/worker/routes/check-omr.js`
- `apmath/worker-backup/worker/routes/reports-ai.js`

## Procedure

1. Confirm whether the task is student-facing, teacher-facing, parent-facing, or backend-only.
2. Preserve completed OMR no-edit/no-resubmit policy.
3. Protect parent-facing wording from internal system language.
4. Do not expose AI proxy secrets or internal prompts.
5. Verify route syntax and UI behavior as required.
