# R2 Archive Image Retention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move archive exam images toward Cloudflare R2 without risking R2 deletion when GitHub image files are later removed to reduce repository weight.

**Architecture:** GitHub remains the short-term source for development and review, while R2 becomes the long-term asset store. Automation uploads with append-only `rclone copy`; it never runs `rclone sync` and never deletes R2 objects. Application data stores stable asset keys, and the runtime builds final image URLs from `ASSET_BASE_URL`.

**Tech Stack:** GitHub Actions, rclone, Cloudflare R2 S3-compatible credentials, static asset base URL or Worker/R2 binding, existing `archive/assets/images` and `archive/exams` content.

---

## Operating Policy

- GitHub can temporarily contain `archive/assets/images/**` so image work remains easy during review.
- R2 is the durable image source. Once an image has been uploaded to R2, removing it from GitHub must not remove it from R2.
- CI must use `rclone copy`, not `rclone sync`.
- R2 deletion is a separate manual operation with an explicit review step.
- Exam JS/JSON should avoid hard-coding GitHub raw URLs. Store relative asset keys such as `25_금당고_2학기_중간_고2_확률과통계/q17.png`.
- Runtime URL construction should be centralized as `${ASSET_BASE_URL}/exams/images/${assetKey}`.

## File Structure

- Create: `.github/workflows/r2-archive-assets-copy.yml`
  - Runs on pushes that touch archive image files or manual dispatch.
  - Installs rclone.
  - Configures an R2 remote from GitHub Secrets.
  - Runs `rclone copy archive/assets/images r2-ap-assets:${R2_BUCKET}/exams/images`.
  - Performs a small post-copy listing check.

- Create: `tools/r2/README.md`
  - Documents the retention policy, required GitHub Secrets, setup commands, and recovery rules.
  - Makes the `sync` ban visible to future maintainers.

- Create: `tools/r2/audit-archive-assets.ps1`
  - Counts local archive images.
  - Lists the biggest files.
  - Emits a machine-readable manifest at `_tmp/r2-archive-assets-manifest.json`.
  - Lets the team estimate GitHub weight before removing local image files.

- Modify: `.gitignore`
  - During transition, keep `archive/assets/images/**` trackable.
  - After R2 upload is verified, change the policy so new local image files can still be generated but are not accidentally committed unless intentionally forced.

- Modify later: image URL resolver in the frontend or Worker route that renders archive exam images.
  - The exact file should be selected after searching for current image URL construction in `archive/exams`, `apmath`, and `workers`.

---

### Task 1: Add Local Asset Audit Script

**Files:**
- Create: `tools/r2/audit-archive-assets.ps1`
- Output: `_tmp/r2-archive-assets-manifest.json`

- [ ] **Step 1: Create the script**

Create `tools/r2/audit-archive-assets.ps1`:

```powershell
param(
  [string]$Root = "archive/assets/images",
  [string]$ManifestPath = "_tmp/r2-archive-assets-manifest.json"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Root)) {
  throw "Asset root not found: $Root"
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $ManifestPath) | Out-Null

$files = Get-ChildItem -LiteralPath $Root -Recurse -File |
  Where-Object { $_.Extension -match '^\.(png|jpg|jpeg|webp|gif|svg)$' } |
  Sort-Object FullName

$items = foreach ($file in $files) {
  $relative = $file.FullName.Substring((Resolve-Path $Root).Path.Length).TrimStart('\', '/')
  [pscustomobject]@{
    key = ($relative -replace '\\', '/')
    bytes = $file.Length
    sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $file.FullName).Hash.ToLowerInvariant()
  }
}

$summary = [pscustomobject]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  root = $Root
  count = $items.Count
  totalBytes = ($items | Measure-Object -Property bytes -Sum).Sum
  totalMB = [math]::Round((($items | Measure-Object -Property bytes -Sum).Sum / 1MB), 2)
  largest = $items | Sort-Object bytes -Descending | Select-Object -First 20
  items = $items
}

$summary | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 -Path $ManifestPath

Write-Host "Asset count: $($summary.count)"
Write-Host "Total MB: $($summary.totalMB)"
Write-Host "Manifest: $ManifestPath"
Write-Host "Largest files:"
$summary.largest | Format-Table key, bytes -AutoSize
```

- [ ] **Step 2: Run the script**

Run:

```powershell
powershell -ExecutionPolicy Bypass -File tools/r2/audit-archive-assets.ps1
```

Expected:

```txt
Asset count: <number greater than 1000>
Total MB: <current total size>
Manifest: _tmp/r2-archive-assets-manifest.json
Largest files:
```

- [ ] **Step 3: Confirm the manifest is not accidentally committed**

Run:

```powershell
git status --short _tmp/r2-archive-assets-manifest.json
```

Expected:

```txt
```

If the manifest appears as untracked, add `_tmp/r2-archive-assets-manifest.json` to `.gitignore`.

- [ ] **Step 4: Commit**

```bash
git add tools/r2/audit-archive-assets.ps1 .gitignore
git commit -m "chore: add archive asset audit script"
```

---

### Task 2: Add R2 Retention Runbook

**Files:**
- Create: `tools/r2/README.md`

- [ ] **Step 1: Create the runbook**

Create `tools/r2/README.md`:

```markdown
# R2 Archive Asset Runbook

## Purpose

Archive exam images are generated locally and may be committed to GitHub during review, but R2 is the long-term storage location.

## Required GitHub Secrets

- `R2_ACCOUNT_ID`: Cloudflare account ID.
- `R2_ACCESS_KEY_ID`: R2 S3 API access key.
- `R2_SECRET_ACCESS_KEY`: R2 S3 API secret key.
- `R2_BUCKET`: target bucket name.
- `R2_PUBLIC_BASE_URL`: public asset base URL, for example `https://assets.example.com`.

## Object Key Rule

Local file:

```txt
archive/assets/images/25_금당고_2학기_중간_고2_확률과통계/q17.png
```

R2 object:

```txt
exams/images/25_금당고_2학기_중간_고2_확률과통계/q17.png
```

Application asset key:

```txt
25_금당고_2학기_중간_고2_확률과통계/q17.png
```

Final URL:

```txt
${R2_PUBLIC_BASE_URL}/exams/images/${assetKey}
```

## Upload Rule

Use `rclone copy`.

```bash
rclone copy archive/assets/images r2-ap-assets:${R2_BUCKET}/exams/images --progress --transfers 16 --checkers 32
```

Do not use `rclone sync` for GitHub-to-R2 automation. `sync` can delete R2 files when GitHub files are removed.

## Deletion Rule

R2 object deletion is manual only. Before deleting objects from R2:

1. Confirm no exam JS/JSON references the object key.
2. Export an R2 listing backup.
3. Delete the exact reviewed object keys.
4. Run a smoke test for affected exams.

## GitHub Cleanup Rule

After R2 upload is verified, GitHub image files may be removed to reduce repository weight. Removing files from GitHub must not trigger R2 deletion.
```

- [ ] **Step 2: Commit**

```bash
git add tools/r2/README.md
git commit -m "docs: document R2 archive asset retention policy"
```

---

### Task 3: Add Append-Only GitHub Actions Upload

**Files:**
- Create: `.github/workflows/r2-archive-assets-copy.yml`

- [ ] **Step 1: Create the workflow**

Create `.github/workflows/r2-archive-assets-copy.yml`:

```yaml
name: Copy archive image assets to R2

on:
  workflow_dispatch:
  push:
    paths:
      - "archive/assets/images/**"
      - ".github/workflows/r2-archive-assets-copy.yml"

jobs:
  copy-to-r2:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    env:
      R2_ACCOUNT_ID: ${{ secrets.R2_ACCOUNT_ID }}
      R2_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
      R2_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
      R2_BUCKET: ${{ secrets.R2_BUCKET }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Validate secrets
        shell: bash
        run: |
          set -euo pipefail
          test -n "$R2_ACCOUNT_ID"
          test -n "$R2_ACCESS_KEY_ID"
          test -n "$R2_SECRET_ACCESS_KEY"
          test -n "$R2_BUCKET"

      - name: Install rclone
        shell: bash
        run: |
          set -euo pipefail
          curl -fsSL https://rclone.org/install.sh | sudo bash
          rclone version

      - name: Configure R2 remote
        shell: bash
        run: |
          set -euo pipefail
          mkdir -p ~/.config/rclone
          cat > ~/.config/rclone/rclone.conf <<EOF
          [r2-ap-assets]
          type = s3
          provider = Cloudflare
          access_key_id = ${R2_ACCESS_KEY_ID}
          secret_access_key = ${R2_SECRET_ACCESS_KEY}
          endpoint = https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com
          acl = private
          EOF

      - name: Copy archive images to R2 without deleting remote objects
        shell: bash
        run: |
          set -euo pipefail
          if [ ! -d archive/assets/images ]; then
            echo "No archive/assets/images directory found; nothing to copy."
            exit 0
          fi
          rclone copy archive/assets/images "r2-ap-assets:${R2_BUCKET}/exams/images" \
            --transfers 16 \
            --checkers 32 \
            --fast-list \
            --progress

      - name: Verify R2 destination is listable
        shell: bash
        run: |
          set -euo pipefail
          rclone lsf "r2-ap-assets:${R2_BUCKET}/exams/images" --max-depth 1 | head -50
```

- [ ] **Step 2: Run a YAML sanity check locally**

Run:

```powershell
git diff -- .github/workflows/r2-archive-assets-copy.yml
```

Expected:

```txt
The workflow contains rclone copy and does not contain rclone sync.
```

- [ ] **Step 3: Confirm no sync command exists**

Run:

```powershell
Select-String -Path ".github/workflows/r2-archive-assets-copy.yml" -Pattern "rclone sync"
```

Expected:

```txt
```

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/r2-archive-assets-copy.yml
git commit -m "ci: copy archive image assets to R2"
```

---

### Task 4: Configure Cloudflare R2 Access

**Files:**
- Modify through Cloudflare Dashboard and GitHub repository secrets.
- No repository file changes required unless the public URL is stored in app config.

- [ ] **Step 1: Create or choose the R2 bucket**

Use a bucket name such as:

```txt
ap-archive-assets
```

- [ ] **Step 2: Create an R2 S3 API token**

Grant object read/write permissions for the chosen bucket.

- [ ] **Step 3: Add GitHub Secrets**

Add:

```txt
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET
R2_PUBLIC_BASE_URL
```

- [ ] **Step 4: Configure public serving**

For public static assets, attach a custom domain such as:

```txt
https://assets.example.com
```

If assets should be protected, serve them through a Worker route instead:

```txt
/api/assets/exams/images/<assetKey>
```

- [ ] **Step 5: Manually run the workflow**

Run the GitHub Actions workflow with `workflow_dispatch`.

Expected:

```txt
The copy step completes successfully.
The verify step lists one or more R2 prefixes.
```

---

### Task 5: Centralize Image URL Construction

**Files:**
- Search first: `rg "archive/assets/images|assets/images|q[0-9]+\\.png|image:" archive apmath workers`
- Modify the file that currently renders archive exam image URLs.
- Add tests near the selected module if the project already has tests for that area.

- [ ] **Step 1: Find current image references**

Run:

```powershell
rg "archive/assets/images|assets/images|image:" archive apmath workers
```

Expected:

```txt
One or more files show how exam image paths are stored or rendered.
```

- [ ] **Step 2: Add a URL resolver**

Use this function in the selected frontend or Worker module:

```js
const DEFAULT_ARCHIVE_ASSET_BASE_URL = "https://assets.example.com";

function normalizeArchiveAssetKey(value) {
  if (!value) return "";
  return String(value)
    .replace(/^\.?\/*archive\/assets\/images\//, "")
    .replace(/^\.?\/*assets\/images\//, "")
    .replace(/^\/+/, "");
}

function buildArchiveImageUrl(assetKey, baseUrl = DEFAULT_ARCHIVE_ASSET_BASE_URL) {
  const normalizedKey = normalizeArchiveAssetKey(assetKey);
  if (!normalizedKey) return "";
  return `${baseUrl.replace(/\/+$/, "")}/exams/images/${encodeURI(normalizedKey).replace(/%2F/g, "/")}`;
}
```

- [ ] **Step 3: Use the resolver at render points**

Replace direct local-path rendering:

```js
const imageUrl = question.image;
```

with:

```js
const imageUrl = buildArchiveImageUrl(question.image, window.ARCHIVE_ASSET_BASE_URL);
```

- [ ] **Step 4: Verify old and new image values**

Use these examples in a small local check:

```js
console.assert(
  buildArchiveImageUrl("25_금당고_2학기_중간_고2_확률과통계/q17.png", "https://assets.example.com") ===
    "https://assets.example.com/exams/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17.png"
);

console.assert(
  buildArchiveImageUrl("archive/assets/images/demo/q1.png", "https://assets.example.com") ===
    "https://assets.example.com/exams/images/demo/q1.png"
);
```

- [ ] **Step 5: Commit**

```bash
git add <selected-rendering-files> <selected-test-files>
git commit -m "feat: resolve archive images from R2 asset base URL"
```

---

### Task 6: Migrate Existing Images to R2

**Files:**
- Uses existing `archive/assets/images/**`
- Uses `tools/r2/audit-archive-assets.ps1`

- [ ] **Step 1: Audit local images**

Run:

```powershell
powershell -ExecutionPolicy Bypass -File tools/r2/audit-archive-assets.ps1
```

Expected:

```txt
Asset count: <number greater than 1000>
Total MB: <current total size>
```

- [ ] **Step 2: Push the workflow and current image additions**

Run:

```bash
git status --short
git push
```

Expected:

```txt
The remote branch receives the workflow and image files.
```

- [ ] **Step 3: Confirm GitHub Actions copied assets to R2**

Check the workflow log.

Expected:

```txt
rclone copy completes without deleting remote objects.
rclone lsf shows R2 prefixes under exams/images.
```

- [ ] **Step 4: Spot-check public URLs**

Open representative URLs:

```txt
https://assets.example.com/exams/images/25_금당고_2학기_중간_고2_확률과통계/q17.png
```

Expected:

```txt
The image loads from R2/custom domain.
```

---

### Task 7: Reduce GitHub Weight Without Deleting R2 Objects

**Files:**
- Modify: `.gitignore`
- Remove from Git index only after R2 verification: selected `archive/assets/images/**`

- [ ] **Step 1: Confirm R2 upload succeeded**

Run an R2 list command from a machine with rclone configured:

```bash
rclone lsf "r2-ap-assets:${R2_BUCKET}/exams/images" --recursive | head -100
```

Expected:

```txt
R2 returns uploaded image object keys.
```

- [ ] **Step 2: Update `.gitignore` to stop future bulk image commits**

Change the archive image block to this policy:

```gitignore
# Archive image assets are generated locally and retained in R2 after upload.
archive/assets/images/**/*.png
archive/assets/images/**/*.jpg
archive/assets/images/**/*.jpeg
archive/assets/images/**/*.webp
archive/assets/images/**/*.gif
!archive/assets/images/**/.keep
```

- [ ] **Step 3: Keep folder structure if needed**

If a folder must remain visible in Git, add `.keep`:

```powershell
New-Item -ItemType File -Force -Path "archive/assets/images/.keep"
```

- [ ] **Step 4: Remove images from Git tracking only**

Use this only after Task 6 is verified:

```bash
git rm -r --cached archive/assets/images
git add archive/assets/images/.keep .gitignore
git commit -m "chore: stop tracking archived image assets after R2 retention"
```

This command removes files from Git history at the new commit, but it does not delete R2 objects.

- [ ] **Step 5: Confirm the workflow does not delete R2 files**

Run:

```powershell
Select-String -Path ".github/workflows/r2-archive-assets-copy.yml" -Pattern "rclone sync|delete|purge"
```

Expected:

```txt
```

---

### Task 8: Add Manual R2 Deletion Procedure

**Files:**
- Modify: `tools/r2/README.md`

- [ ] **Step 1: Add exact deletion commands to the runbook**

Append:

```markdown
## Manual R2 Deletion Procedure

Create a deletion candidate file:

```txt
_tmp/r2-delete-candidates.txt
```

Each line must be an R2 object key under `exams/images/`, for example:

```txt
exams/images/demo/q1.png
```

Review references before deletion:

```powershell
$candidates = Get-Content _tmp/r2-delete-candidates.txt
foreach ($key in $candidates) {
  $assetKey = $key -replace '^exams/images/', ''
  rg --fixed-strings $assetKey archive apmath workers
}
```

Delete reviewed keys:

```bash
while read key; do
  rclone deletefile "r2-ap-assets:${R2_BUCKET}/${key}"
done < _tmp/r2-delete-candidates.txt
```

Do not run bucket-wide delete commands for archive assets.
```

- [ ] **Step 2: Commit**

```bash
git add tools/r2/README.md
git commit -m "docs: add manual R2 asset deletion procedure"
```

---

## Verification Checklist

- [ ] `rg "rclone sync|purge" .github tools/r2` returns no CI upload command that can delete R2 objects.
- [ ] GitHub Actions uses `rclone copy`.
- [ ] R2 contains objects under `exams/images/`.
- [ ] At least five representative exam images load from the R2 public base URL or Worker route.
- [ ] Removing a file from GitHub does not remove it from R2.
- [ ] Exam rendering works with relative asset keys and does not depend on GitHub raw image URLs.

## Rollback

- Disable `.github/workflows/r2-archive-assets-copy.yml` if upload credentials are wrong.
- Re-enable temporary Git tracking of `archive/assets/images/**` if the app cannot yet serve from R2.
- Keep R2 objects in place during rollback; do not delete remote objects while diagnosing.

## Implementation Order

1. Add audit script.
2. Add runbook.
3. Add append-only GitHub Actions workflow.
4. Configure R2 bucket, custom domain, and GitHub Secrets.
5. Centralize image URL construction.
6. Upload existing images to R2.
7. Stop tracking bulk images in GitHub after R2 verification.
8. Add manual deletion procedure.

