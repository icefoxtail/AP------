# Solution caption cleanup browser render evidence

Status: PASS

Date: 2026-09-08 (Asia/Seoul)

## Collection identity

- Worktree: `C:\Users\USER\Desktop\AP-------solution-caption-cleanup`
- Rebased implementation commit: `18d09041` (`fix(solution): remove noninstructional solution image captions`)
- Render/evidence worktree before this metadata correction: `61ff64cbe97e1e692eb56d75976bfb8bf312435d`
- Upstream: `origin/main` at `809faf7442bb4366f98728e4dea246f8082f6307`
- Browser: Codex in-app browser, local HTTP server on `127.0.0.1:8765`
- Viewport: `1280×720`, device pixel ratio `1`
- Browser console: no `error` or `warn` entries in any recorded case

The render review was performed after rebasing the solution-caption cleanup
commit onto the current `origin/main=809faf74`. The production archive sample includes
the first question, the last question, a removed generic caption, and retained
mathematical captions.

## MACHINE_CURRENT inventory

Independent archive inventory on the tested worktree:

- Archive JS files: `454`
- Questions: `11,034`
- Questions with `solutionImage`: `760`
- Referenced solution assets missing: `0`
- Solution assets: `737` SVG, `22` PNG, `1` inline data SVG
- `solutionImageCaption` fields: `551` (`548` production, `2` similar, `1` test fixture)
- Empty captions: `0`
- Captions without a solution image: `0`
- JS parse/syntax errors: `0`
- Generic production captions after cleanup: `0`

## RENDER_REVIEW: archive engine

Production data URL:

`archive/engine.html?mode={mode}&qpp=4&data=exams/original/high/h1/1final/22_%EA%B8%88%EB%8B%B9%EA%B3%A0_1%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A01_%EA%B8%B0%EC%B6%9C.js`

### `exam`

- Pages: `6`
- Visible question boxes: `21` (source count `21`)
- First question present: `PASS`
- Last question (`21`) present: `PASS`
- Problem images: `2/2` decoded with positive natural dimensions
- MathJax containers: `316`
- Broken images: `0`
- Horizontal overflow: `0`
- Solution captions in exam mode: `0`
- Console errors/warnings: `0`
- Result: `PASS`

### `sol`

- Pages: `11`
- Solution boxes including continuation blocks: `24`
- First question present: `PASS`
- Last question (`21`) present: `PASS`
- Solution images: `13/13` decoded with positive natural dimensions
- Last question solution image present: `PASS`
- MathJax containers: `667`
- Broken images: `0`
- Page overflow checks: `0`
- Deleted generic-caption question q1 caption: absent (`PASS`)
- Retained mathematical-caption question q4 caption: `O에서 직선까지의 수선 · 거리=3/5` (`PASS`)
- q1 solution DOM order: `[정답] → solutionImage → solution`
- q4 solution DOM order: `[정답] → solutionImage + caption → solution`
- Console errors/warnings: `0`
- Result: `PASS`

### `ans`

- Pages: `1`
- Answer-number cells (`.ans-n`): `21` (source count `21`)
- Answer cells including subjective answers: `24`
- Last answer present: `PASS`
- Solution captions in answer mode: `0`
- Horizontal overflow: `0`
- Console errors/warnings: `0`
- Result: `PASS`

## RENDER_REVIEW: mixer engine fixture

Fixture launcher:

`tests/fixtures/mixer-render-authority-storage-launcher.html?qpp=4&mode={mode}`

- `exam`: `3` pages, `8` visible q-boxes, `2/2` data-SVG images decoded,
  overflow `0`, errors/warnings `0` — `PASS`
- `sol`: `1` page, `8` visible q-boxes, retained caption `원본 해설 이미지`,
  `1/1` data-SVG image decoded, overflow `0`, errors/warnings `0` — `PASS`
- `ans`: `1` page, `8` answer-number cells, overflow `0`, errors/warnings `0`
  — `PASS`

## RENDER_REVIEW: wrong-print engine fixture

Fixture launcher:

`tests/fixtures/wrong-print-layout-launcher.html?mode={mode}&renderAuthorityDualRun=1`

- `exam`: `3` pages, `6` visible q-boxes, overflow `0`, errors/warnings `0`
  — `PASS`
- `sol`: `3` pages, `6` visible q-boxes, overflow `0`, errors/warnings `0`
  — `PASS`
- `ans`: `1` page, `6` answer-number cells, overflow `0`, errors/warnings `0`
  — `PASS`
- The wrong-print fixture uses a text-only source bank, so zero solution images
  in this fixture is expected and is not treated as a missing-asset failure.

## Test evidence

After rebase:

```text
node tools/skills/verify-skills.mjs
Skill verification: PASS
Upstream: origin/main @ 809faf7442bb4366f98728e4dea246f8082f6307 (ahead=2, behind=0)

node tools/run-tests.js
PASS 162 / FAIL 0 / KNOWN-FAIL 0 (total 162)
```

Targeted adapter/regression tests also passed with exit code `0`:

- `tests/archive-solution-image.test.js`
- `tests/archive-render-authority-adapter.test.js`
- `tests/mixed-render-authority-adapter.test.js`
- `tests/apmath-wrong-print-qr-solution-regression.test.js`
- `tests/clinic-render-authority-adapter.test.js`
- `tests/print-readiness-adapter.test.js`

## Review conclusion

All recorded required modes pass on the rebased worktree. No visual, image,
MathJax, overflow, console, or caption-order defect was observed. The evidence
file is committed in the same rebased branch as the cleanup commit.
