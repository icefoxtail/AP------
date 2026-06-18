# wangji-eie-os minimal EIE Worker

This Worker is intentionally EIE-only. It does not import APMS routes.

## Basic Info

| Item | Value |
|---|---|
| Worker name | wangji-eie-os |
| Domain | https://wangji-eie-os.js-pdf.workers.dev |
| D1 DB | wangji-eie-os |
| D1 DB ID | 2066e8ce-a02e-4f35-9c2d-d60891afff63 |
| Routes | /api/auth/login, /api/auth/logout, /api/eie, /api/eie/* |

## Worker Structure

```text
index.js            EIE-only fetch handler, auth session issue/revoke
routes/eie.js       EIE timetable/student API
helpers/response.js jsonResponse, errorResponse helpers
wrangler.jsonc      EIE deployment config
```

## Handled Paths

- `POST /api/auth/login`: issues an EIE session token for active `admin`, `owner`, or `teacher`
- `POST /api/auth/logout`: revokes the bearer session token when present
- `GET/POST/PATCH/DELETE /api/eie/*`: EIE APIs with route-level permissions
- `POST /api/eie/teachers/seed-defaults`: admin-only seed for Carmen, IVY, Lily, Stacy, Zoe, Laura with initial password `eie1234`
- `GET /` or `GET /health`: health response
- All other paths return 404 JSON

## Deploy

Run only after user approval.

```powershell
cd C:\Users\USER\Desktop\AP------\workers\wangji-eie-worker
node --check .\index.js
node --check .\routes\eie.js
node --check .\helpers\response.js
npx wrangler deploy --config .\wrangler.jsonc
```

### D1 migrations (important)

This Worker's `wrangler.jsonc` has **no `migrations_dir`**, and several EIE migrations
live in the **repo-root** `migrations/` folder (e.g.
`migrations/20260615_eie_students_withdrawn_at.sql`), not in this folder's `migrations/`.
`wrangler deploy` never applies these — they must be run against the live D1 by hand:

```powershell
cd C:\Users\USER\Desktop\AP------
npx wrangler d1 execute wangji-eie-os --remote --file=.\migrations\20260615_eie_students_withdrawn_at.sql
```

Verify the column exists:

```powershell
npx wrangler d1 execute wangji-eie-os --remote --command="PRAGMA table_info(eie_students);"
```

As a safety net, the Worker also self-heals `eie_students.withdrawn_at` at runtime
(`ensureWithdrawnAtColumn` in `routes/eie.js`), so the withdrawal flow works even if this
migration was missed — but applying the migration is still the canonical fix.

## APMS Separation

| | EIE Worker | APMS Worker |
|---|---|---|
| Worker name | wangji-eie-os | ap-math-os-v2612 |
| Deploy root | AP------\workers\wangji-eie-worker | AP------\apmath\worker-backup\worker |
| D1 | wangji-eie-os | ap-math-os |
