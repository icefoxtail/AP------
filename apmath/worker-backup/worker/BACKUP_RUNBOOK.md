# D1 backup and recovery runbook

The `D1BackupWorkflow` exports the complete `ap-math-os` database every day at
03:00 Asia/Seoul (18:00 UTC) and streams the SQL dump into the private
`apmath-d1-backups` R2 bucket. Each dump has an adjacent JSON manifest containing
the D1 bookmark, scheduled time, object size, and ETag.

## One-time deployment setup

1. Create a Cloudflare API token scoped to this account with D1 read access.
2. Store it as a Worker secret (never commit the value):

   ```powershell
   wrangler secret put D1_BACKUP_API_TOKEN
   ```

3. Install the pinned Wrangler release and deploy from this directory:

   ```powershell
   npm install
   wrangler deploy
   ```

The R2 bucket is private. Do not add a public custom domain or `r2.dev` access.

## Check a backup

```powershell
wrangler workflows instances list ap-math-os-d1-backup
wrangler r2 object get apmath-d1-backups/<object-key> --file backup.sql
```

Confirm that the SQL file is non-empty and contains both schema statements and
inserts. The matching `<object-key>.json` manifest identifies its source bookmark.

## Recovery drill (safe target first)

Never test a restore against production. Create a temporary D1 database, download
the selected SQL object, import it, and validate row counts and representative
student records:

```powershell
wrangler d1 create ap-math-os-restore-test
wrangler d1 execute ap-math-os-restore-test --remote --file backup.sql
wrangler d1 execute ap-math-os-restore-test --remote --command "SELECT name, COUNT(*) AS rows FROM sqlite_schema WHERE type = 'table' GROUP BY name ORDER BY name"
```

Delete the temporary database only after the verification results have been saved.
Production recovery requires an explicit maintenance window and approval because
D1 import/export operations can make the database temporarily unavailable.

## Failure response

Inspect the failed Workflow instance and Worker logs. Common causes are an expired
`D1_BACKUP_API_TOKEN`, missing D1 permission, or R2 quota. Fix the cause and trigger
a replacement instance:

```powershell
wrangler workflows trigger ap-math-os-d1-backup
```
