# AP Math Worker Backend SOP

Use for Cloudflare Worker, route, helper, schema, and D1-related work.

## Protected Areas

- `apmath/worker-backup/worker/index.js`
- `apmath/worker-backup/worker/routes`
- `apmath/worker-backup/worker/helpers`
- `apmath/worker-backup/worker/schema.sql`
- `apmath/worker-backup/worker/migrations`
- `apmath/worker-backup/worker/wrangler.jsonc`

## Procedure

1. Confirm backend work is explicitly allowed.
2. Prefer route/helper files over expanding `index.js`.
3. Check academy, branch, student, class, and permission scopes.
4. Avoid schema and migration changes unless explicitly requested.
5. Do not run remote D1 or deploy by default.
6. Run `node --check` on changed route files when applicable.
