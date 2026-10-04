# 21 팔마중 1학기 중간 중3 — visual repair render check

- Target: `archive/exams/original/middle/m3/1mid/21_팔마중_1학기_중간_중3_기출.js`
- Source: `D:\기출\(1)1중간\(1)1중간\중3\2021_팔마중3_수학_1중간.pdf` (5 scanned pages; q5 on page 1, q13 on page 2, q25 on page 5)
- Calibration: M3 peer exam files were checked for the existing `assets/images/<exam>/qNN.png` convention. Related visual negatives reviewed: `archive/fixtures/visual-negative-regressions/2026-09-29/README.md` (owner binding, label collision, missing ray, coordinate parity).
- Effective rule set: `JS아카이브룰북_v2.6`, `COMMON_PROTOCOL_v1.2.10`, `공통파이프라인_실행계약_v1`, `작업방식_적응형배치루프_v1`, `도형추출.md v3.0`. Manifest-listed hashes matched the source-pack values at inspection.

## Source crops

All PNGs are crops from the scanned source page, not redrawn diagrams. Each was decoded with Pillow and visually inspected after cropping.

| Question | Source page | Crop | Dimensions | SHA-256 |
|---|---:|---|---:|---|
| 5 | 1 | `archive/assets/images/21_팔마중_1학기_중간_중3_기출/q05.png` | 890×410 | `b24dcbcd87c211858c42cc3daa5f1fefec2d35ccdcfebc848ef370e8c08407f8` |
| 13 | 2 | `archive/assets/images/21_팔마중_1학기_중간_중3_기출/q13.png` | 1110×440 | `31002a483c925f349437d8cd9ce811601254b77c17d5e98f035fab41e6262573` |
| 25 | 5 | `archive/assets/images/21_팔마중_1학기_중간_중3_기출/q25.png` | 1160×400 | `ca99d75fde85a6f62d2bc0aeeb48e965d481e5a02b97d622ecde27e5815d1bc9` |

Question 25's image confirms the 1 m vertical path crossing the 2 m horizontal path, with a 1×2 overlap. The source wording `다음 그림과 같이` was restored to its content because it was absent from the JS.

## Browser modes (`engine.html`, qpp=4)

| Mode | Result | Evidence |
|---|---|---|
| `exam` | PASS | Accessibility tree contains all 25 questions and final q25; q5, q13, and q25 each expose an image. Browser screenshots visually confirmed q5, q13, and q25 in context. All three image requests returned 200/304; no missing asset response. |
| `sol` | PASS | All 25 questions expose non-empty solutions; q25 solution is present on the final solution page. |
| `ans` | PASS | Answer mode contains all 25 answers, including the three-part q25 answer. |

At the browser's narrow 450 px viewport, the printed 2-column sheet is scaled down; `imageSize: "full"` uses the full available question-column width. Math expressions remained rendered and no horizontal page scrollbar or broken image was visible in the inspected screens.

## Index parity

- Production exam contains 25 questions.
- Index records for q5, q13, and q25 report `hasImage: true`.
- `archive/tools/build-question-index.mjs` generated 11,443 records from 477 production exam files; duplicate qKey count: 0.
