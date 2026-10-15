# Archive Analysis Duplicate Catalog Recovery v1

The recovery index at `tools/archive-analysis-recovery-manifest.v1.json` identifies 11 `archive/analysis` catalog paths removed from the current HEAD tree. Each removed path is an exact byte duplicate of a retained path. The index records the full baseline commit, baseline subtree, original path, Git blob SHA-1, raw-byte SHA-256, byte count, retained identical path, and historical receipt paths that cite the removed path.

This change reduces the current HEAD checkout payload by 326,839,777 bytes (311.7 MiB). It does not reduce stored Git history: the baseline commit remains available, and no history rewrite is part of this cleanup. The 25 unique historical proof and receipt files referenced by the removed paths remain unchanged.

Run the verifier from the repository:

```powershell
node tools/archive-analysis-recovery.mjs --check
```

The verifier prefers the retained identical blob in current HEAD, so recovery also works from a shallow clone that lacks the baseline commit. If that retained blob is unavailable, the tool can use the original path from the baseline commit when the commit exists locally. It does not fetch objects. It reads raw Git blob bytes, checks the recorded size and SHA-256, rejects symlinked parent paths, and refuses to overwrite an existing file.

Restore one original path with its exact repository-relative path:

```powershell
node tools/archive-analysis-recovery.mjs --restore archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/registration/post-rpm-debt-fields-canonical-rev1/archive2-catalog.before-canonical.json
```

To restore the full cohort into an existing scratch directory, use the explicit bulk action and replace the destination with a directory that already exists:

```powershell
node tools/archive-analysis-recovery.mjs --restore-all --destination C:\path\to\existing\scratch
```

The restore test writes all 11 paths to a disposable directory and checks each restored file's byte count and SHA-256. It also checks that traversal, a mismatched checksum, a symlinked parent, and overwriting an existing file are rejected.
