# Student Parent Planner SOP

Use for student portal, parent foundation, planner, PIN login, and public/semi-public entry points.

## Protected Areas

- `apmath/student`
- `apmath/planner`
- `planner`
- `apmath/worker-backup/worker/routes/student-portal.js`
- `apmath/worker-backup/worker/routes/parent-foundation.js`
- `apmath/worker-backup/worker/routes/planner.js`

## Procedure

1. Preserve PIN and access boundaries.
2. Do not add direct exam archive access for students.
3. Do not add completed OMR edit/re-submit flows.
4. Treat guardian contact, consent, and message logs as privacy-sensitive.
5. Preserve planner SSO/localStorage behavior unless explicitly changed.
