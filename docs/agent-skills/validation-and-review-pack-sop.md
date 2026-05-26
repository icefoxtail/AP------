# Validation And Review Pack SOP

Use for verification, review packs, report-only audits, and final result evidence.

## Procedure

1. Identify the command or file check that proves each claim.
2. Run fresh verification before claiming completion.
3. Record PASS/FAIL with command names.
4. Record skipped verification with reasons.
5. Check `git status --short --untracked-files=all`.
6. Check `git diff --name-only`.
7. Never claim success from assumptions.

## Review Pack Output Location Policy

- Create review pack, patch, and other zip outputs outside the project under `/mnt/c/Users/USER/Downloads`.
- The Windows path is `C:\Users\USER\Downloads`.
- Do not use `reports/patchpacks` for zip outputs.
- `reports/` may keep document-style md/json reports, but zip outputs must not remain there.
- In `CODEX_RESULT.md`, record only the absolute path of any generated zip.
- Do not compress the whole project as a review pack.
- Build review packs from changed or newly added core files only.
- Exclude vendor and large files, or split them into a separate zip and record the reason in `CODEX_RESULT.md`.
- Completion is not valid if `git status --short --untracked-files=all` shows a review pack zip inside the project.
