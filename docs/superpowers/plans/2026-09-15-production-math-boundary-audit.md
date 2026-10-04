# Production Math Boundary Audit and Pinpoint Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit every question registered by the current archive production registry for visually ambiguous boundaries between distinct math segments, verify the high-risk set in the real Archive renderer, and make minimum source-formatting fixes whenever the current student-facing render can cause an avoidable misread.

**Architecture:** Treat `archive/db.js` as the production denominator and load each registered JS under `archive/exams/` to validate registry/file/question-count parity. Extract broad candidate evidence from the question `content`, classify it by current student-facing readability and actual renderer geometry, and keep any correction limited to a separator at the exact production JS boundary; original PDF evidence is useful but is not a prerequisite for a readability-only separator fix.

**Tech Stack:** Node.js `vm`/filesystem inspection, repository JavaScript archive, Archive `engine.html`, local HTTP server, real browser inspection, existing Node regression-test conventions, Git with explicit path staging.

**Spec:** User-provided request in `C:/Users/USER/.codex/attachments/0ac7e010-1345-4600-807a-c67c021c5164/pasted-text.txt`.

## Global Constraints

- Latest `origin/main` is fetched first and `BASE HEAD` is fixed before the audit.
- Existing unrelated dirty/staged/untracked changes are preserved and never touched.
- Do not modify the completed ㄱ/ㄴ/ㄷ normalizer, (가)/(나) condition normalizer, subjective heading spacing, inline question image, image readiness, Fast Runtime, pagination/layout policy, or choice layout work.
- Canonical production scope is derived from the live registry (`archive/db.js` and matching index/engine paths), not from a folder-wide assumption.
- Every registered production question is inspected; candidate extraction is broad and candidate classification is narrow.
- No global math-spacing rule is allowed: no unconditional trailing spaces, MathJax-node margins, `<br>`, or automatic splitting of adjacent math segments.
- Only confirmed `READABILITY_FIX` items may modify production JS, and each modification must preserve every mathematical token while adding the minimum visible separator needed for the current student-facing render.
- Do not rewrite problem text, choices, answer, or solution content except for the exact source separator proven necessary by the request.
- After any source correction, re-check exam, solution, and answer rendering and the required regression axes; MathJax errors must remain zero.
- If a production change is required, stage only the directly changed production JS and the directly related regression test/script, create one independent commit, and push the requested branch target without staging unrelated files.

---

### Task 1: Freeze the production denominator and baseline

**Files:**
- Read: `archive/db.js`
- Read: `archive/question-index.js`
- Read: `archive/engine.html`
- Read: `archive/mixed_engine.html`
- Read: `archive/exams/**/*.js` only through the registry file list
- Do not modify production files in this task.

**Interfaces:**
- Consumes: `window.mainDB.exams` registry entries with `file` and `qCount`.
- Produces: fixed `BASE HEAD`, registry exam/question denominator, prefix/content-type breakdown, and parity evidence for later tasks.

- [ ] **Step 1: Record the fetched base and clean-boundary status.**

  Run:

  ```powershell
  git fetch origin main
  git rev-parse origin/main
  git status --short --branch
  git diff --name-only HEAD..origin/main
  ```

  Preserve the already observed user-owned SVG modification and untracked test; do not use `stash`, `reset`, `clean`, `git add .`, or `git add -A`.

- [ ] **Step 2: Validate the registry and all registered production JS files.**

  Execute a Node `vm` inspection that loads `archive/db.js`, resolves every `archive/exams/<file>`, loads each question bank, and asserts: no duplicate registry file, no missing file, no JS load error, and `qCount === questionBank.length`. Sum the registry counts to produce `PRODUCTION_EXAM_COUNT` and `PRODUCTION_QUESTION_COUNT`.

- [ ] **Step 3: Freeze the renderer behavior under investigation.**

  Read the current `wrapLatex`, question-content formatting, MathJax typesetting, and CSS rules in `archive/engine.html`, `archive/exam-render-executor.js`, `archive/mathjax_render_loop.js`, and the shared runtime. Confirm that no proposed fix is inferred from a stale pre-main renderer.

### Task 2: Extract broad mechanical candidates without changing behavior

**Files:**
- Read: registry-listed production JS files
- Read: `archive/engine.html` and `archive/mixed_engine.html`
- Optional local-only evidence: a command output or disposable audit result outside the production tree; do not add a temporary production report.

**Interfaces:**
- Consumes: frozen registry rows and each question's `content` string.
- Produces: a candidate ledger containing exam file, question id, source ordinal, exact content, match type, surrounding characters, math segment count, and machine reason.

- [ ] **Step 1: Scan every registered question content for the requested candidate classes.**

  Detect, without auto-editing, at least: adjacent dollar segments with no prose/punctuation, adjacent segments separated only by whitespace, a math segment ending immediately before `\\lim`, `\\sum`, `\\prod`, `\\int`, `\\frac`, `\\sqrt`, or `\\begin{cases|aligned|...}`, duplicated delimiters such as `$$`, and condition-like formula transitions without a marker. Include HTML-aware context so `<br>`, table blocks, images, and condition markers are visible in the ledger.

- [ ] **Step 2: Include false-positive context in each ledger row.**

  Record the previous segment's last token, next segment's first token, separator bytes, sentence punctuation, explicit condition marker, line-break token, and whether both segments are part of one continuous algebraic expression. Do not classify from the regex result alone.

- [ ] **Step 3: Cross-check candidate coverage against the denominator.**

  Confirm every one of the 11,226 registered question contents was visited and report the mechanical candidate total separately from the question denominator.

### Task 3: Determine root cause and perform real renderer review

**Files:**
- Read: candidate production JS files identified by Task 2
- Read: `archive/engine.html`, `archive/mixed_engine.html`, and their shared render executors
- Browser entry: `archive/engine.html?mode=exam|sol|ans&qpp=4&data=` followed by one of the 462 `archive/db.js` `file` values.
- Do not modify engine files unless a narrowly proven `ENGINE_SPACING_SAFE` pattern is separately documented and approved by the evidence gates.

**Interfaces:**
- Consumes: candidate ledger and current renderer implementation.
- Produces: one classification per candidate: `PASS`, `READABILITY_FIX`, or `SEMANTICALLY_AMBIGUOUS`, plus browser observations.

- [ ] **Step 1: Start the repository server and load each candidate through the actual Archive engine.**

  Serve the repository root over localhost, open the registered production path in the real browser, and inspect the question in `exam` mode at the normal archive viewport. For each candidate also check the same question in `sol` and `ans` mode when it is on the relevant path.

- [ ] **Step 2: Record visual evidence for each candidate.**

  Inspect the actual rendered MathJax containers and record the preceding final glyph/number, following first token, measured/visible gap, inline versus display status, punctuation, `<br>`, condition marker, and whether the result reads as one mathematical expression. A string match alone cannot produce `READABILITY_FIX`.

- [ ] **Step 3: Compare working and suspect structures before forming a fix hypothesis.**

  Compare candidates with nearby normal expressions and with long continuous expressions. State a single root-cause hypothesis for any confirmed defect and test it with the smallest source-only reproduction; do not add a renderer-wide spacing rule.

- [ ] **Step 4: Apply the engine-safe gate if and only if evidence supports it.**

  If a renderer rule appears possible, write a separate evidence record with exactly `PATTERN`, `PRODUCTION MATCH COUNT`, `WHY SAFE`, `FALSE POSITIVE CHECK`, and `ENGINE FILES REQUIRED`. Add no engine rule unless the same structure is safe across the complete production match set and cannot split valid continuous expressions.

### Task 4: Original-source adjudication and pinpoint correction

**Files:**
- Read: current production source and actual render for each `READABILITY_FIX` candidate; original exam PDF/page evidence is optional context
- Modify: only the exact registry-listed production JS file(s) whose current render is student-ambiguous
- Test: one focused regression test only if a confirmed fix exists and the repository test conventions can assert the source/render behavior

**Interfaces:**
- Consumes: browser-reviewed candidate rows and current source content.
- Produces: student-readability before/after correction(s), or `SEMANTICALLY_AMBIGUOUS` only when the current source itself cannot establish whether expressions are independent.

- [ ] **Step 1: Resolve current readability intent before editing.**

  For each suspected `READABILITY_FIX`, compare the production string with the actual rendered browser DOM. If independent equations/conditions are visibly concatenated, choose exactly one `<br>` for independent equation blocks or a stable `0.6–0.8em` inline gap for same-line short values. Preserve all math tokens; do not infer or rewrite content.

- [ ] **Step 2: Write a failing regression test before changing production JS.**

  Assert the exact production question source contains the required separator and, when a render-level assertion is practical, assert the candidate's formatted output preserves separate MathJax containers with a non-empty semantic separator. Run the focused test and confirm it fails for the missing source separator rather than due to a test defect.

- [ ] **Step 3: Make the smallest source edit.**

  Change only the exact current-render boundary proven ambiguous. Do not alter answer, choices, solution, metadata, renderer code, or unrelated questions.

- [ ] **Step 4: Run the focused test to green.**

  Re-run the focused regression test and verify that the readability assertion is gone. If it fails, stop and return to root-cause investigation rather than stacking a second fix.

### Task 5: Full regression and final evidence

**Files:**
- Read: all changed production JS and test files
- Read: all registry-listed production JS files for parity checks
- Browser entry: all changed production paths in `exam`, `sol`, and `ans` modes
- Do not create a production report file unless a durable evidence artifact is required by the current repository protocol.

**Interfaces:**
- Consumes: final source tree and candidate classification ledger.
- Produces: final console report with denominator, candidate count, high-risk browser review `134/134`, classifications, fixed items, semantic ambiguities, regression results, changed-file list, and Git state.

- [ ] **Step 1: Re-run registry parity and candidate scan after any source fix.**

  Confirm all 462 registry files still load, all 11,226 questions remain present, every `qCount` remains exact, and the candidate ledger reflects the final source tree.

- [ ] **Step 2: Run the focused regression and relevant existing archive tests.**

  Verify normal adjacent math, long continuous expressions, cases/aligned display math, ㄱ/ㄴ/ㄷ, (가)/(나), subjective spacing, inline images, choices, answer/solution parity, and MathJax error checks. Do not claim a regression axis as PASS without fresh command output.

- [ ] **Step 3: Re-render changed questions in all required modes.**

  Check the actual browser render for the changed question(s), including the last question/page when the changed file requires pagination, and record any `WARN`, `FAIL`, or `NOT_TESTED` state explicitly.

- [ ] **Step 4: Inspect the final diff and stage only authorized paths.**

  Run `git diff --check`, `git diff --stat`, and `git status --short`. Stage only the exact changed production JS path(s) and focused regression test path(s) with explicit `git add -- <path> ...`; leave the pre-existing SVG and untracked test untouched.

- [ ] **Step 5: Commit and push only after fresh verification.**

  Create one commit with the requested message pattern, push the authorized branch target, then verify `git rev-parse HEAD`, `git rev-parse origin/main`, and the final status. If pushing directly to `origin/main` would require a materially different integration action than the current branch permits, stop and report the exact blocker instead of force-pushing or rewriting history.
