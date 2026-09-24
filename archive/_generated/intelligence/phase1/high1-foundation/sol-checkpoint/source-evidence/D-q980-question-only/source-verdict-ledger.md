# D question-only source repair ledger — q980

- Date: 2026-09-24 (Asia/Seoul)
- Scope: only original question pages and JS q11 `content`, `choices`, and inline diagram. No answer/solution source or JS answer/solution field was opened or used; no A/B/C verdict was viewed.
- UID: `qid_v1_cf1e63ca575e2bb4d842eec930da8acd7ed853d664aedf1afef68f3b612f500a`
- Source identity: `original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js#11`
- Disposition: `QUESTION_FIELD_RESTORATION` (exact printed score omitted in JS `content`; restored below). The printed stem, choices, labels, road topology, and dashed-road meaning match.

## Original question-page evidence

The original four-page scan set is `D:\2025년\1학기기말_2025\고1\강남여고1\S28BW-825071617250_0009.jpg` through `_0012.jpg`. Page 1 identifies 2025 grade 1, first-semester final, Common Math 1, at 순천강남여자고등학교; date printed 2025-07-02, third period; 24 questions total (20 selected-response and 4 written-response). q11 is on page 2.

The four evidence copies are byte-identical to the corresponding D: originals:

| Page | Evidence copy | SHA-256 |
|---|---|---|
| 1/4 identity | `2025_gangnamgirls-final-page-1.jpg` | `5de7ea6e0ea1ba00ebd2edd75dda45dff57145cd37181f2c292efd664c6ba6ec` |
| 2/4 q11 | `2025_gangnamgirls-final-page-2.jpg` | `a2cc9731f870d31b0ddf3783245bb6e96007e4290ae9f3a87cc07da2abc0e9b6` |
| 3/4 | `2025_gangnamgirls-final-page-3.jpg` | `6ffcdd29e9727e60910a5efd1d1440fdb8268714fe0fa8c49cde37ab9b6e01a6` |
| 4/4 | `2025_gangnamgirls-final-page-4.jpg` | `fa034bcfab4609fd1e3edaa1794562e1f3aa3f57e0fb699aacb90695a528f8fe` |

Focused evidence: `q980-exam-header-crop.png` (SHA-256 `16407083244ad78d78e8eb5603bf5a036b4ecfe3f6f00db2f7e9e150cf15247a`), `q980-question-crop.png` (SHA-256 `22805a741b68547e42b589e1c0c3c719d30eb9cd53495c4936856bd0dac0cf6b`), and enlarged printed road diagram `q980-original-figure-crop-3x.png` (SHA-256 `b40078c55d4693def4e39b79663ea2af1b1df114c25455c50441793c99feed2a`).

## q11 comparison and repair

- Printed stem matches the existing JS: four points A, B, C, D are connected by roads; the stem says an additional road between B and C was added, gives 128 routes from A to D, and asks how many roads were added between B and C, under the no-repeated-point/no-intersecting-roads condition.
- The printed score at the end of q11 is `(4점)`. That exact score token was missing from the JS question `content`; no other question-field text was changed.
- Choices match: `4`, `6`, `8`, `10`, `12`.
- The JS has no separate `image` field; the diagram is inline SVG in `content`. Existing diagram and original page match: two A–B paths, three A–C paths, two B–D paths, four C–D paths; dashed B–C segment; four nodes and labels A/B/C/D. The stem explicitly identifies B–C as the added road, matching the dashed symbol. No extra/missing route line or label was observed.
- Exact content delta: before `...도로끼리는 서로 만나지 않는다.)\n<svg...`; after `...도로끼리는 서로 만나지 않는다.) (4점)\n<svg...`.
- Before JS file SHA-256: `3a1abd85088cd54cf18b997681b6b14ba91893104d1f127d0e44a60490074365`
- After JS file SHA-256: `5835d8a191bc4d885824d72d79403798c927040e3e71bccdfe5ae765eeb7775f`
- Before question fields SHA-256 (`content`, `choices`, `image|null`): `0b2a68bbad38f65e8ff615972e39482d538bbb364fbc15b273a37223f94a5795`
- After question fields SHA-256: `2cdd010bc97442a81561abba2e43be5eeffc609c4ff88431ebf704addbcaea47`. Removing only the inserted `(4점)` restores the prior question-fields hash.
- Extracted inline SVG evidence `q980-js-inline.svg` SHA-256: `295bcfe97b1487d0cd24b88ea3b1980a61ec5033cba9fe9911d2d1b2285bf838` (unchanged diagram).

## Gates

- `node --check` on the modified exam JS: PASS.
- Scoped q11 field/schema check: PASS. `content` is a string, `choices` an array, no separate `image` field; SVG has 11 solid road paths, 1 dashed line, 4 circles, labels A–D. Removing only the score insertion reproduces the pre-edit question-field hash.
- Exam-mode browser render, desktop: q11’s `(4점)`, labels, inline diagram, and all five choices visibly load. At viewport 1920×855, document width is 1905 px (no horizontal overflow); SVG renders at 260×160.
- Exam-mode browser render, mobile: at viewport 390×844, q11 text, diagram, and all five choices visibly load. q11 box is 148.9 px wide and its SVG scales to 122.5×75.4 px; document width is 375 px (no horizontal overflow). Temporary viewport override was reset after capture.
- Aggregate engine `PRINT_READY` remains blocked by `EQUAL_SLOT_AUDIT_FAILED` from `SVG_VIEWBOX_CLIP` findings in two other exam slots (page 4); q11 itself had no such finding. Those questions are outside this bounded source repair and were not inspected or changed. The q11 desktop/mobile visual render checks pass.
- Answer and solution modes were not opened.
