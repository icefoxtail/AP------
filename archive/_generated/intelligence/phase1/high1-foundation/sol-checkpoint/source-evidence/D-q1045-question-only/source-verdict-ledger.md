# D question-only source repair ledger — q1045

- Date: 2026-09-24 (Asia/Seoul)
- Scope: original question pages and JS q18 `content`, `choices`, and `image` only. No answer key/source, JS answer, or JS solution was opened, read, or used; no A/B/C verdict was viewed.
- UID: `qid_v1_eed945a85d2ea6d3073bb4d4d31a2e5dec6eb26185a551b440e552c7b15f4650`
- Source identity: `original/high/h1/1final/25_팔마고_1학기_기말_고1_기출c.js#18`
- Disposition: `QUESTION_FIELD_RESTORATION` for the omitted printed score. The printed stem, 10-cell topology, and choices match the allowed JS question fields; q18.png is a faithful figure match.

## Original question-page evidence

The clean original four-page question scan set exists at `D:\2025년\1학기기말_2025\고1\팔마고1\S28BW-825071617250_0005.jpg` through `_0008.jpg`. Page 1 identifies the 2025 grade-1 first-semester final in Common Math 1 at 순천팔마고등학교, dated 2025-07-01. Printed q18 is on page 3/4.

Evidence copies (each SHA-256 matches its D: original):

| Page | Evidence copy | SHA-256 |
|---|---|---|
| 1/4 identity | `2025_palma-final-page-1.jpg` | `69afe971e6c6c102a88f126b4fe15e5340a41c3d7eee651fed22a44ff0e7b88c` |
| 2/4 | `2025_palma-final-page-2.jpg` | `d548564c0697e258eab6edbc7f15e505a640938f48faef7da7f426e7d7e66b97` |
| 3/4 q18 | `2025_palma-final-page-3.jpg` | `2a14fbc32449257251226258746605c34748e313d3a719000af8606c1bfda59e` |
| 4/4 | `2025_palma-final-page-4.jpg` | `e9b6d4bc8410ff799729e6117bc93ccb443d8940aa8dfa80e1ac7e7e4b009035` |

Focused exhibits: `q1045-exam-header-crop.png` (SHA-256 `d7a5ae935008d9ea2460f11ca47433c81fcacfc63f706caad0844aeed1d32e6d`) and `q1045-question-crop.png` (SHA-256 `66340ffef8a13b1827fe9300e0f76d91fdc7e79c5ac4827500760a0c70bbee8b`).

## q18 question-field comparison and repair

- Printed stem matches JS: a shape made from 10 unit squares, asking for the count of non-square rectangles formed by the lines.
- Printed choices 20/21/22/23/24 match JS.
- The source page prints `[4.8점]`, which was missing from JS `content`. Restored exactly as ` [4.8점]` at the end of the question text. No other question text, choices, or image field changed.
- Printed figure topology: 5 cells in the bottom row, 3 in the middle row, and 2 in the top row (10 unit squares total). The JS image `assets/images/25_팔마고_1학기_기말_고1_기출/q18.png` shows the same 5+3+2 stair-step outline and internal grid lines; no labels appear in either printed or JS figure. No question-field image mismatch found.
- Existing q18 image dimensions: 257×173; SHA-256 `e53b0a475fe1978d6a74e0f0c4706def02ca4228876a1dce41abb0bc549ae364e`. Evidence copy `q1045-current-js-image-not-original.png` hashes identically.
- Before JS file SHA-256: `388ab5f3fa9588445802e2858e5370458c7616fa78093059e16a2154e17b7fe0`
- After JS file SHA-256: `576ca66c71072c7fee119873d8cdb23167e454160a60539b4acffc72f3f5ffa8`
- Before question-fields SHA-256 (`content`, `choices`, `image`): `71b7aa1b6b12b22ecb7d2c6dd2fdcfe6f2b34553566ca39c7f7bcfff147728de`
- After question-fields SHA-256: `d0f679efb4bd3a23a6d1ad72da318072b44f2b247122bb8d142b0a7d98f61064`. Removing only the inserted score from `content` restores the before hash.

## Scoped validation and exam render

- `node --check` on the modified exam JS: PASS.
- Scoped q18 schema check: PASS (`content` string, `choices` array unchanged, expected q18 `image` path preserved; before question-fields hash restored by removing only the score insertion).
- Desktop exam-mode render: q18 text, restored score, figure, and choices visually load. At viewport 1920×911, document width is 1905 px; q18 box is 316.2 px wide and image is 297.2 px wide; no horizontal overflow.
- Mobile exam-mode render: q18 text, restored score, figure, and choices visibly load. At viewport 390×844, document width is 375 px; q18 box is 148.9 px wide and image scales to 140.0×89.5 px; no horizontal overflow. Temporary viewport override was reset.
- No console errors were returned for the exam-mode render. Answer and solution modes were not opened.

## Out-of-scope representation

A separately flagged 13-cell inline representation was not inspected. D did not access answer/solution content and makes no claim about that representation. It remains for the separate correction-protocol HOLD; the question-page source and q18.png match the printed 10-cell topology.
