# archive/textbook BOOT

## 1. Upper Rules

- Read `C:\Users\USER\Desktop\AP------\docs\PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md` first when project-wide structure or ownership is relevant.
- This `.agent` directory is a helper operating layer for `archive/textbook`; it does not replace the upper project rulebook.
- Treat `generated/js`, `generated/reports`, `generated/assets`, and `generated/review_pack` as protected by default.

## 2. Start Procedure

1. Confirm current path.
2. Run `git status --short --untracked-files=all`.
3. Record dirty state before work.
4. Read `CODEX_TASK.md`.
5. Read `CODEX_RESULT.md`.
6. Read `.agent/PIPELINE_STATE.md`.
7. Read `.agent/SKILLS_INDEX.md`.
8. Pick only the `docs/agent-skills` SOPs relevant to the current task.
9. Read `plans/BOOK_STATUS_BOARD.md`.
10. Read `reports/agent-memory/repeated-errors.md`.
11. Declare allowed files and forbidden files before editing.

## 3. Always Forbidden Unless Explicitly Reauthorized

- Blind edits to `generated/js`.
- Guessing answers.
- Inventing question text.
- Creating `solution` text.
- Running crop, OCR, or PDF render without explicit task permission.
- Overwriting reports casually.
- Editing the same JS file from multiple Codex windows.
- `git add`, `git commit`, or `git push`.

## 4. Finish Procedure

- Run the verification commands required by the task.
- Record skipped verification and reasons.
- Update `CODEX_RESULT.md`.
- Report whether `plans/BOOK_STATUS_BOARD.md` or `reports/agent-memory` queues need a later refresh.
- Record final git status.

