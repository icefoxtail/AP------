# Task: bring your branch up to date with origin/main and resolve conflicts (no new features)

Your worktree's branch already has an open PR. origin/main has since received other engine features in the same files (region fill #826, solids #823, stat charts #819, two piecewise functions #830, …). Make the branch mergeable again without losing anything from either side.

1. `git status` must be clean (commit or stash nothing new — if there are uncommitted changes, report them and stop).
2. `git fetch origin && git merge origin/main` (merge, never rebase).
3. Resolve every conflict keeping BOTH sides' additions: `production/phase2.mjs` (contract text and spec code — keep all capabilities), `production/graph_*.py` / `visual_engine/*.py` (keep both code paths; read surrounding code to merge correctly), `production/render-plan.mjs` (keep every dispatch branch), `production/author-guide-body.md` (keep all sections, renumber only if needed), `production/AUTHOR_GUIDE.md` (take either side, then regenerate with `node archive/tools/geometry-equation/production/build-author-guide.mjs`), `production/exam-figure-ledger.json` (keep both sides' item updates; valid JSON), `REGRESS` files are outside git.
4. Verify: `node --test archive/tools/geometry-equation/tests/author-guide.test.mjs archive/tools/geometry-equation/tests/render-plan.test.mjs`; your own feature test file(s) (Chrome → `--test-concurrency=1`); python `python -m unittest tests.test_engine tests.test_label_layout tests.test_graph_overview` from `archive/tools/geometry-equation` plus your feature's python test; golden regression via render-plan `--manifest` (items whose capability is not on main or your branch yet may fail — list them; every other item must be ARCHIVE_BOUND).
5. Commit the merge (`Merge origin/main into <branch>` + Co-Authored-By line), push. Never merge the PR.

Final answer (short, Korean): conflicted files and how resolved, test results, golden result, pushed commit SHA.
