# Common rules for AP Math SVG engine work (read fully)

## Project facts
- Engine code: `archive/tools/geometry-equation/` (production/*.mjs, *.py; visual_engine/*.py; tests/). Author guide for plan shapes: `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md` (generated from `production/author-guide-body.md` + contract text in `production/phase2.mjs` by `node archive/tools/geometry-equation/production/build-author-guide.mjs`; `tests/author-guide.test.mjs` enforces sync).
- One-command renderer (run from the worktree root): `node archive/tools/geometry-equation/production/render-plan.mjs --item item.json --plan plan.json --out <dir>`; item.json = `{"sourcePath":"archive/exams/original/...js","ordinal":N}`. Result `<name>-result.json` status ARCHIVE_BOUND | EXEMPT | UNSUPPORTED | FAILED (+ stage, detail = engine error code).
- Golden regression: `node archive/tools/geometry-equation/production/render-plan.mjs --manifest D:/AI_WORKSPACES/APMS/svg-engine-line-20261019/.tmp/archive/svg-engine-development-20261015/REGRESS/golden --out <new dir>` → every item must be ARCHIVE_BOUND (read `<out>/run-summary.json`).
- Independent figure review (uses a separate headless reviewer): `node D:/AI_WORKSPACES/APMS/svg-engine-line-20261019/.tmp/archive/svg-engine-development-20261015/AUTO/review-figures.mjs <rows.json> <worktree root> <outDir>`; rows `[{camp,key,src,ord,svg,fam}]` (read the first 30 lines of that script for the exact format). Verdicts PASS/FAIL/UNCERTAIN; every published figure must be PASS.
- PNG from SVG: see `D:/AI_WORKSPACES/APMS/svg-engine-line-20261019/.tmp/archive/svg-engine-development-20261015/AUTO/handoff-data/tool-run-one.sh` (Chrome headless screenshot) or the `png.sh`/`png.mjs` helper already in your output folder.

## Environment
- Shell: Git Bash on Windows. Run from the worktree root. Env for every node/python command: `PYTHONIOENCODING=utf-8`, `PYTHONPATH=<worktree>\.tmp\apmath-visual-engine\dependencies\python`.
- Never write files containing backslashes via bash heredocs/echo (they get eaten): use your file-write tool.
- LF line endings only; after `git add`, `git ls-files --eol <file>` must show `i/lf w/lf`. Python writing text: open with `newline='\n'` or write bytes.
- Chrome renders must run sequentially. Other agents may also use Chrome: if you get ARCHIVE_PREFLIGHT_FAIL or a readiness/timeout error, retry that one render once.

## Engineering rules (hard)
- Every new figure capability has an independent observer that recomputes from the same plan inputs and checks the FINAL SVG. Never trust the engine's own computed numbers in the observer. Never weaken an observer check, tolerance or test to make something pass; never delete tests.
- Unsupported cases are rejected with an explicit error code (no fake support). Add a one-line author hint for new codes in `D:/AI_WORKSPACES/APMS/svg-engine-line-20261019/.tmp/archive/svg-engine-development-20261015/AUTO/hints.mjs` (git-ignored; re-read it right before editing, append only).
- Figure style: textbook look; labels never overlap lines/marks (leader lines when needed); fractions stacked (never slashed); equal x/y scale for graphs (vertical squeeze at most 1/2).
- Do not touch exam JS (`archive/exams/**`), `archive/db.js`, or files outside `archive/tools/geometry-equation/` unless the brief says so.
- Pre-existing failures you must ignore (not yours): GitHub CI aborting on missing `archive/exams/types/middle/m1/*_pro.js`; `tests/construction-candidate-svg-v1.test.mjs` has 14 failures on old main (just don't add new failures).

## Git
- Commit messages: Korean summary line `feat(svg-engine): ...`, blank line, short body, blank line, `Co-Authored-By: DeepSeek V4.1 Flash (opencode) <noreply@opencode.ai>`.
- Push your branch; open ONE PR against main with `gh pr create --base main --head <branch> --title "..." --body-file <file>`; Korean body ending with the line `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. Never merge, never push to main, never force-push, never rebase.
- To bring in main: commit your work first, then `git fetch origin && git merge origin/main`. Conflicts: `AUTHOR_GUIDE.md` → take either side then regenerate with build-author-guide.mjs; `author-guide-body.md`, `phase2.mjs`, `render-plan.mjs` → keep BOTH sides' additions (they add different capabilities).

## Other workers share this machine (hard rule)
- Up to 9 other agents run renders, tests and git in other worktrees at the same time. NEVER kill, stop or signal processes you did not start yourself in this session: no `taskkill /IM`, no `Stop-Process` / `pkill` / `killall` by name or by command-line pattern (e.g. "all render-plan.mjs"). To stop your own long command, run it in the foreground with a timeout (`timeout 1800 <cmd>`) or record its PID when you start it and kill only that PID.
- Never touch other worktrees (`D:/AI_WORKSPACES/APMS/svg-*` other than yours), other output folders, or the shared golden plans except appending your own item.
- Long commands (golden regression, Chrome test files): run once, in the foreground, with `timeout`, piping output to a file in your output folder and printing only `tail -20`.
