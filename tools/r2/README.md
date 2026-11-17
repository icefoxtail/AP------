# R2 Archive Image Retention

This directory defines the first R2 archive image retention foundation.

Cloudflare R2 is the long-term storage for archive exam image assets. GitHub remains a temporary working and review store while uploads, URL checks, and later resolver work are verified.

This first pass does not delete image files, stop tracking existing image files, or change app rendering. GitHub image tracking can be removed only after R2 upload verification is complete.

## Required GitHub Secrets

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`

## Object Key Rules

- local: `archive/assets/images/<examFolder>/q17.png`
- R2: `exams/images/<examFolder>/q17.png`
- JS image: `<examFolder>/q17.png`
- final URL: `${R2_PUBLIC_BASE_URL}/exams/images/${assetKey}`

The JS `image` field keeps the relative asset key. A future resolver can prepend the public R2 base path without rewriting every exam file.

## Upload Policy

Uploads must be append-only. Use `rclone copy` only.

Do not use `rclone sync`. Do not use `rclone delete`. Do not use `rclone purge`.

R2 deletion is allowed only after manual review and a separate procedure. That procedure is intentionally not detailed in this first pass.

GitHub image tracking removal is allowed only after:

- the R2 bucket exists,
- all required GitHub Secrets are registered,
- the workflow has been run manually with `workflow_dispatch`,
- representative image URLs have been verified through `R2_PUBLIC_BASE_URL`,
- app image resolution work has been completed and reviewed.

This first pass performs no actual deletion and no tracking removal.

## Audit Manifest

Run the local audit script from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\r2\audit-archive-assets.ps1
```

The script scans `archive/assets/images` for `png`, `jpg`, `jpeg`, `webp`, `gif`, and `svg` files. It writes `_tmp/r2-archive-assets-manifest.json` with each asset key, byte size, SHA-256 hash, and summary data including the 20 largest files.

## Upload policy (2026-11-17)

The `R2 Archive Assets Copy` workflow never compares, lists, or copies the whole image folder (Class A request charges). Every upload is an explicit file list in one of three modes:

- push: only the images changed since the newest successful push or catch_up run (else since this push's `before`). If it cannot tell which images changed, the job fails and uploads nothing.
- manual `mode=catch_up`: the same changed-image list, with a higher limit, for when pushes keep failing; it advances the base.
- manual `mode=folder` + `folder`: the git-tracked images of one exam folder under `archive/assets/images/`. A folder run does not advance the base, so it cannot hide the images of an earlier failed push.
