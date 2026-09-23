# Baseline render findings

## Fixture and owner path
- Actual workspace route: Finder title → original exam detail modal → existing original issue snapshot → archive/engine.html.
- Fixture: 2026 매산고 고2 1학기 중간고사 (기하), 21 questions.
- Question content was read only. The preview used the existing local source and MathJax/image renderers.

## Viewport results
- 1440, 1180, 1024, 961, and 960px: no document-level horizontal overflow; 794px A4 page remained at scale 1.
- 961px retains the 222px PC sidebar. 960px switches to the mobile topbar and five bottom tabs.
- 390px has no document-level horizontal overflow because the whole 794px paper is scaled to 307.88px (scale 0.38791). The first MathJax container measures 8.15px high. This is not readable as a math exam at normal mobile viewing size.
- The 390px screenshot confirms the A4 page is shown as a shrunken miniature. The mobile page must be made readable without changing the printed A4 layout or shrinking the math further.
- With the detail modal open, the Home bottom-tab center hit-tests to the modal. Background navigation is blocked as expected.
- The 21-question fixture rendered six A4 pages at qpp 4. MathJax was rendered; observed original diagram/image assets loaded with non-zero intrinsic widths.

## Confirmed baseline HIGH debt
The mobile preview intentionally enters screen-fit mode in archive/engine.html and scales the complete A4 sheet to fit the 326px iframe width. At 390px viewport, the page is reduced to 38.8% and math glyphs to about 8.15px high. The same whole-page fit rule exists in archive/mixed_engine.html. This makes the on-screen exam and solution content too small to read. It is a screen-only usability defect; the print contract remains A4 and must stay unchanged.

## Baseline feature tests
- Command and full output: evidence/baseline-targeted-tests.log
- 105 tests reported: 103 pass, 2 fail, 0 skipped.
- Both failures reproduce in isolation in evidence/baseline-navigation-only.log:
  1. archive2-navigation.test.cjs calls navigation.markup without defining global location; production currentKey reads location.search.
  2. The VM DOM stub for the ready unit route omits host.querySelector, but the production navigation binder uses querySelector for the mobile tools menu.
- These failures are present on the fetched origin/main baseline. No source patch has been made.

## LOOP 0 checkpoint 2 — actual A4 baseline
- Fixture snapshots use the existing Archive 2.0 originalSnapshot path, including source question bank, canonical qid_v1 identity values, display title, subtitle, and qpp output setting.
- Actual Chromium Page.printToPDF outputs: 9/9 generated for text, math, and geometry/image fixtures at qpp 4/6/8.
- PDF audit: 9/9 A4; title present; no apRenderError text; PDF page counts match rendered page nodes.
- Page count matrix:
  - text fixture, 20 questions: qpp4=5, qpp6=4, qpp8=3 pages.
  - math fixture, 21 questions: qpp4=6, qpp6=4, qpp8=3 pages.
  - geometry fixture, 21 questions: qpp4=6, qpp6=4, qpp8=3 pages.
- Physical PDF outputs: evidence/a4/baseline/
- Rasterized PNGs and contact sheets: evidence/a4/baseline/rendered/
- Browser screenshots: evidence/screens/baseline-workspace-detail-desktop.png and baseline-workspace-detail-mobile.png.
- Visual baseline inspection: all baseline contact sheets show every expected page populated; representative math and geometry pages were inspected at page resolution; figures, answer choices, and equations remain within A4 page margins.
- During the first smoke attempt, Chrome printed before render readiness and emitted a fail-closed QUESTION_IMAGE_READINESS_INCOMPLETE page. The test harness was changed to wait for renderReady, MathJax, and loaded images before Page.printToPDF. The verified nine-file set above is the frozen baseline.

## A4 baseline audit

| qpp | Text PDF pages | Math PDF pages | Geometry/image PDF pages |
|---:|---:|---:|---:|
| 4 | 5 | 6 | 6 |
| 6 | 4 | 4 | 4 |
| 8 | 3 | 3 | 3 |

All nine outputs have 594.96 × 841.92 pt A4 pages on every page. The student-facing display titles and subtitles are present. Image readiness passed with 1 text fixture image, 3 math fixture images, and 7 geometry fixture images. Page rasterization/contact sheets are in evidence/a4/baseline/rendered/.

## Compose baseline contract evidence
- Isolated Compose UI selection: 6 valid high1 scopes, 60 questions, 2 parts (50 + 10), no assignment target selected.
- Exam mode: part 1, 50 questions, 13 pages at qpp4.
- Solution mode: part 1, 50 questions, 22 pages at qpp4.
- Answer mode: part 1, 2 pages at qpp4.
- qpp preview: qpp4=13, qpp6=9, qpp8=7 pages for part 1.
- Part 2: 10 questions, 3 pages at qpp4.
- Fixed a question, replaced it, then undid; original UID and pinned state were restored.
- Mobile sticky actions: 3 actions at 42px each; bar and bottom navigation do not overlap. The action buttons are a MEDIUM target-size debt.
- Full result, screenshots, coordinates, and temporary-profile behavior: evidence/compose-baseline.json and evidence/screens/baseline-compose-*.png.

## Unit Past live navigation checkpoint
- Read-only live flow reached a 48-question ready paper for 고1 / 공통수학2 / 명제 (9 source exams).
- The 4 / 6 / 8 paper-density selector is present and defaults to 4.
- At 1920px and 390px, document horizontal overflow is 0; mobile bottom tabs remain visible and action buttons are 50px.
- The embedded mixed-engine paper still scales to 345px iframe width on mobile, so the HIGH mobile readability finding applies to Unit Past too.
- No student assignment or print action was executed. Full details: evidence/unit-past-route-baseline.json.
