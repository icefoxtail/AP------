# AP Root BOOT

This root operating layer coordinates AP------ work. It is a document/SOP layer only. It does not install, run, vendor, or wrap Hermes Agent runtime.

## Priority

1. User's current task
2. `docs/MASTER_RULEBOOK.md`
3. `docs/MASTER_CURRENT_PROGRESS.md`
4. `docs/MASTER_NEXT_WORK.md`
5. `docs/00_READ_ME_FIRST.md`
6. `docs/03_DOMAIN_INDEX.md`
7. This root `.agent` layer
8. Domain SOPs in `docs/agent-skills/`

For `archive/textbook` work, read the upper AP rulebook first, then follow `archive/textbook/.agent/BOOT.md` and its skill index. The root layer routes textbook work; it does not replace the textbook subordinate layer.

## Start Procedure

1. Confirm current path is `C:\Users\USER\Desktop\AP------`.
2. Run `git status --short --untracked-files=all`.
3. Record dirty/untracked files before work.
4. Read `CODEX_TASK.md`.
5. Read `docs/MASTER_RULEBOOK.md`.
6. Read `docs/MASTER_CURRENT_PROGRESS.md`.
7. Read `docs/MASTER_NEXT_WORK.md`.
8. Read task-relevant reports under `reports/`.
9. Read `docs/README.md`.
10. Read `docs/_index/DOCS_STRUCTURE.md` and `docs/_index/ARCHIVE_INDEX.md` when document structure matters.
11. Read `docs/guides/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md` when detailed legacy structure context is needed.
12. Read `docs/00_READ_ME_FIRST.md` and `docs/03_DOMAIN_INDEX.md` when domain ownership matters.
13. Read `.agent/SKILLS_INDEX.md`.
14. Select only SOPs directly relevant to the task.
15. Declare allowed files and forbidden files before editing.

## Default Prohibitions

- No `git add`, `git commit`, or `git push`.
- No deploy or `wrangler deploy`.
- No remote D1 command.
- No production API smoke test.
- No dependency install.
- No package file modification.
- No daemon, cron, MCP server, gateway, or runtime automation creation.
- No broad edits to `apmath/js`.
- No schema or migration change.
- No archive/textbook generated output change.
- No archive/textbook operating-layer overwrite.
- No UI exposure of hidden foundation features without explicit approval.
- No root `CODEX_RESULT.md` overwrite when the task requests a separate report.

## Finish Procedure

1. Run verification commands required by the task.
2. Record skipped verification and reasons.
3. Confirm git status and `git diff --name-only`.
4. Write the result report requested by the task.
5. Decide whether the three master documents need updates: `docs/MASTER_RULEBOOK.md`, `docs/MASTER_CURRENT_PROGRESS.md`, and `docs/MASTER_NEXT_WORK.md`.
6. If code, DB, Worker route, frontend, UI, policy, plan, or document structure changed, update the relevant master document(s).
7. If a master document was not updated, record the reason in `CODEX_RESULT.md`.
8. Confirm the master documents and relevant lower-level docs do not conflict.
9. For code, document, or repository changes, run the review-pack workflow before final unless the user explicitly forbids it.
10. Confirm `C:\Users\USER\Downloads\LATEST_CODEX_REVIEW_PACK.txt` and inspect the zip entries.
11. Confirm required core files are present in the zip; if not, create a corrected review pack or source-only supplemental zip before final.
12. State explicitly which prohibited actions were not performed.

## Result Output Policy

- Write task result reports to root `CODEX_RESULT.md` unless the task specifies another report.
- Create review pack, patch zip, and review pack zip outputs in `C:\Users\USER\Downloads` (`/mnt/c/Users/USER/Downloads`).
- Do not leave zip outputs in project `reports/`.
- Do not reuse a previous review pack path.
- Do not final-report until the newly created review pack path and zip entries have been checked.
