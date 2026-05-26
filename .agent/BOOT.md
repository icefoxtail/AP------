# AP Root BOOT

This root operating layer coordinates AP------ work. It is a document/SOP layer only. It does not install, run, vendor, or wrap Hermes Agent runtime.

## Priority

1. User's current task
2. `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
3. `docs/00_READ_ME_FIRST.md`
4. `docs/03_DOMAIN_INDEX.md`
5. This root `.agent` layer
6. Domain SOPs in `docs/agent-skills/`

For `archive/textbook` work, read the upper AP rulebook first, then follow `archive/textbook/.agent/BOOT.md` and its skill index. The root layer routes textbook work; it does not replace the textbook subordinate layer.

## Start Procedure

1. Confirm current path is `C:\Users\USER\Desktop\AP------`.
2. Run `git status --short --untracked-files=all`.
3. Record dirty/untracked files before work.
4. Read `CODEX_TASK.md`.
5. Read task-relevant reports under `reports/`.
6. Read `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`.
7. Read `docs/00_READ_ME_FIRST.md` and `docs/03_DOMAIN_INDEX.md` when domain ownership matters.
8. Read `.agent/SKILLS_INDEX.md`.
9. Select only SOPs directly relevant to the task.
10. Declare allowed files and forbidden files before editing.

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
5. State explicitly which prohibited actions were not performed.
