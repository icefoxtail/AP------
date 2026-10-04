# Validation And Review Pack SOP

Use for verification, review packs, report-only audits, and final result evidence.

## Procedure

1. Identify the command or file check that proves each claim.
2. Run fresh verification before claiming completion.
3. Record PASS/FAIL with command names.
4. Record skipped verification with reasons.
5. Check `git status --short --untracked-files=all`.
6. Check `git diff --name-only`.
7. For code, document, or repository changes, create the review pack before final unless the user explicitly forbids it.
8. Read `C:\Users\USER\Downloads\LATEST_CODEX_REVIEW_PACK.txt`.
9. Inspect the zip entries and confirm required core files are included.
10. Never claim success from assumptions.

## Review Pack Output Location Policy

- Create review pack, patch, and other zip outputs outside the project under `/mnt/c/Users/USER/Downloads`.
- The Windows path is `C:\Users\USER\Downloads`.
- Do not use `reports/patchpacks` for zip outputs.
- `reports/` may keep document-style md/json reports, but zip outputs must not remain there.
- In `CODEX_RESULT.md`, record only the absolute path of any generated zip.
- Do not compress the whole project as a review pack.
- Build review packs from changed or newly added core files only.
- Treat review pack generation as a final gate for code, document, and repository changes unless the user explicitly forbids review packs.
- Do not final-report from tests and `CODEX_RESULT.md` alone; final reporting requires a fresh review pack path and zip-entry confirmation.
- Do not reuse a previous review pack path.
- Exclude vendor and large files, or split them into a separate zip and record the reason in `CODEX_RESULT.md`.
- Keep filename-based secret exclusions such as `.env`, `.pem`, `.key`, and secret/credential-style filenames.
- Exclude text files only for high-confidence secret value patterns such as private-key blocks, real-looking API keys, long bearer values, or quoted secret assignments.
- Do not exclude source files merely because they contain code strings such as `Authorization`, `Bearer`, `token`, `password`, `password_hash`, or `env.OPENAI_API_KEY`; include them and record a manual-review warning instead.
- After creating any review pack, inspect the zip entries and confirm required core files were actually included.
- If a required core file is missing from the zip, completion is invalid until a corrected review pack or source-only supplemental zip is created and reported.
- Completion is not valid if `git status --short --untracked-files=all` shows a review pack zip inside the project.
