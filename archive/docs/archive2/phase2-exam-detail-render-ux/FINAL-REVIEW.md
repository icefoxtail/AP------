# Final convergence review

- Notion plan: `Archive 2.0 2단계 — 시험지 상세·렌더 UX / LaTeX·도형·A4 출력 Codex 실행계획`.
- Base: `origin/main` at `06c8d9f4271799446af70794f9cdf462cec5df20`.
- Task branch: `codex/archive2-exam-render-ux-20260923`.
- Review mode: primary Codex only, as requested; no subagents.
- The task branch was created at 16:49 KST from the then-current `origin/main`. Main later advanced at 19:26 and 19:31 KST to `0d30376ed46d6637854bea325df043097ea999b3` through `b2eff23eb` and `0d30376ed`. Those post-creation commits are not included; main was not merged or pushed.

## Contract and render review

- Existing Korean labels, mode names, active state, question selection, part split, and qpp values `4 / 6 / 8` remain unchanged.
- Pin, replace, and undo restored the original question UID and pinned state in the actual Compose flow.
- Mobile display changes are screen-only and begin after `RENDER_READY`; A4 print markup, page dimensions, pagination, and print CSS remain the renderer authority.
- PC 1440px and mobile 390px Chrome captures show readable exam, solution, answer, original detail, and Compose preview states. No horizontal overflow or mobile-tab interception was observed.
- Final A4 verification covers original text/math/geometry outputs at qpp 4/6/8, the original geometry solution and answer, and mixed/Compose qpp 4/6/8. Four contact sheets and representative full-size pages were visually reviewed.

## Severity closure

- HIGH: 1 found / 1 fixed — mobile A4 preview reflow.
- MEDIUM: 4 found / 4 fixed — mobile engine tabs, Compose desktop mode buttons, Compose mobile actions, and desktop page-count controls.
- LOW: no remaining findings.

## Verification and remaining HOLD

- Focused patch regressions: 107 passed, 0 failed.
- Broader targeted regressions: 108 passed, 2 failed in navigation test mocks that also failed in the frozen baseline.
- Full tests-directory run: 580 passed, 250 failed; full repository auto-discovery: 930 passed, 258 failed. Full logs and the specific unchanged-source / missing-fixture failures are recorded in `evidence/final-tests-directory-root.log` and `evidence/final-full-regression.log`.
- No failure was reported by the new responsive or touch-target tests. No UX or A4 HOLD remains; the repository-wide baseline and fixture test failures remain HOLDs outside the edited surface.
- Integration HOLD: `origin/main` advanced by two commits after this task branch was created. Review and integrate those later main commits separately if this branch is to be rebased or merged.
- Requested model routing to GPT-6 Luna Max is not exposed by this session's task controls, so the selected model and effort could not be verified.
