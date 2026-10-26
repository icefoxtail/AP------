# Working in SHORT sessions (mandatory)

This run is ONE step of a larger task (the task brief is attached). Do only the step named in the message, then stop with a short Korean report. A previous run may already have done part of the work in this worktree: start with `git status --short`, `git log --oneline origin/main..HEAD | head`, and a look at the output folder; never redo finished work.

Session hygiene (the session database overflowed before):
- Never open PNG/JPG/SVG files with your file-reading tool (no image reads). Inspect figures only through text: result JSON, `grep` on SVG text, the independent review (`review-figures.mjs`) verdicts.
- Keep command output short: pipe through `tail -20` / `head -40`; never print whole JSON/SVG/log files.
- Read only the parts of source files you need (offset/limit, grep -n).

Steps (the message tells you which one):
- STEP A — implementation + unit tests: finish the code changes the brief asks for; write/complete the tests (JS test file + python tests); run them until they pass. Commit (`feat(svg-engine): ... (진행 중)`). No real-item renders.
- STEP B — real items: write plans for the real items the brief lists, render each with render-plan.mjs to ARCHIVE_BOUND (fix plans or small engine bugs), convert final SVGs to PNG (do not view them), run the independent review (`review-figures.mjs`) and fix until PASS. Commit.
- STEP C — close-out: golden regression (every item whose capability exists on your branch ARCHIVE_BOUND; list the rest as skipped), add the golden item the brief names, author guide section + `build-author-guide.mjs` + author-guide test, `git fetch origin && git merge origin/main` (resolve per common rules) and re-run your tests, push, open the PR. Final Korean report in the brief's format.
