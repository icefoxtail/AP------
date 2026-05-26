# Billing Accounting Operations SOP

Use for billing, accounting, cashbook, payments, consultations, operations, and internal memo work.

## Protected Areas

- billing/accounting Worker routes
- `apmath/js/management.js`
- `apmath/js/dashboard.js`
- operations route and consultation data
- payment, transaction, cashbook, and audit history

## Procedure

1. Treat money history as audit-sensitive.
2. Prefer status changes, voiding, cancellation, or inactive flags over physical deletion.
3. Do not expose internal memo or audit data in default UI.
4. Confirm admin/owner permission boundaries.
5. Record any financial integrity risk in the result report.
