# D question-only visual provenance and repair ledger — q980 q18/q20

- Date: 2026-09-24 (Asia/Seoul)
- Scope: exam-mode diagnostics plus original question scans and JS `content`/inline SVG/choices. No answer or solution field/source, and no A/B/C verdict, was opened, read, or used.
- Original JS: `archive/exams/original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js`
- Source document set: D: `D:\2025년\1학기기말_2025\고1\강남여고1\`; original question page 3/4 is `S28BW-825071617250_0011.jpg`.
- Exam identity: page 1 identifies 2025 grade 1, first-semester final, Common Math 1, dated 2025-07-02, 순천강남여자고등학교.

## Affected ordinals from exam-mode diagnostics

The reproduced pre-repair exam-mode audit identified exactly:

| Source ordinal | UID | Render pageIndex | slot | Pre-repair SVG diagnostic |
|---|---|---:|---:|---|
| 18 | `qid_v1_efc80499656d5a5698b9a88f7e41990da425e0371f03e1d993524d5a73621bb5` | 4 | 1 | `SVG_VIEWBOX_CLIP`, drawable bottom 193, viewBox `0 0 280 180` |
| 20 | `qid_v1_a9087c1259ff45d4ecd9ece722de1c10461f0b51463ca2822e014edc5bf46ed1` | 4 | 3 | `SVG_VIEWBOX_CLIP`, drawable bottom 196.2, viewBox `0 0 240 180` |

Together these caused `EQUAL_SLOT_AUDIT_FAILED` and blocked `PRINT_READY` before correction. Current issue slots map to source ordinals 18 and 20 through the exam render's `sourceRef`.

## Original page evidence and comparison

Evidence copies are byte-identical to their D: originals:

- Page 1 identity: `2025_gangnamgirls-page-1.jpg`, SHA-256 `5de7ea6e0ea1ba00ebd2edd75dda45dff57145cd37181f2c292efd664c6ba6ec`.
- Page 3 questions: `2025_gangnamgirls-page-3.jpg`, SHA-256 `6ffcdd29e9727e60910a5efd1d1440fdb8268714fe0fa8c49cde37ab9b6e01a6`.
- q18 focused printed question and graph: `q18-original-source-crop.png`, SHA-256 `945022d5aec9933d3f0af8615a466e1bf2c18131a635b4851af76f26ddfdc459`.
- q20 focused printed question and graph: `q20-original-source-crop.png`, SHA-256 `d1a3df260464cbcb320423408716e751baa365f04f75c35bff83325a0b64bfe3`.
- Exam identity crop: `q980-exam-header-crop.png`, SHA-256 `16407083244ad78d78e8eb5603bf5a036b4ecfe3f6f00db2f7e9e150cf15247a`.

The printed q18 figure includes its lower diagonal line and `y=-2x+3` label below the plotted region. The original q20 figure includes the lower-left tail of the parabola below the 180-unit SVG frame. Both printed diagrams show the same graph elements and labels as their JS inline SVGs. This is a JS question-asset viewport mismatch, not a source/renderer-only discrepancy: the existing coordinate data already drew source-visible parts outside the declared SVG viewBox.

The printed q18 choices 2/4/6/8/10 and q20 choices 12/14/16/18/21 also match their JS choices.

## Exact question-field changes

The JS inline SVGs are embedded in q18/q20 `content`; each has no separate `image` field.

- q18: changed only the SVG root from `width=280 height=180 viewBox="0 0 280 180"` to `width=280 height=200 viewBox="0 0 280 200"`. The visible lower label/line fit in the original source frame. Also restored the printed `[4.5점]` token that was absent from q18 `content`.
  - Existing graph primitives retained: 2 paths, 5 lines; labels A/B/C/D/O/x/y/y=f(x)/y=-2x+3.
  - Inline SVG before SHA-256 `970bf4d73f6e75974b8907eaeaee0a45f9d866a28c5fa4b4d9f1a3a6275941cf`; after SHA-256 `c90f1b2c723c746291507e132a926d71015e30b7910e7271a19b7601fee7f3fa`.
- q20: changed only the SVG root from `width=240 height=180 viewBox="0 0 240 180"` to `width=240 height=200 viewBox="0 0 240 200"`. The source-visible lower parabola tail now lies inside the frame. Also restored the printed `[4.8점]` token that was absent from q20 `content`.
  - Existing graph primitives retained: 4 paths, 2 lines; labels O/A/P/Q/x/y/y=x/y=f(x)/x=t.
  - Inline SVG before SHA-256 `8e7d27a65ac4fd6d8f582b90840158235d4f3372dd40275bdd3f0b61bac267cf`; after SHA-256 `cb5f22f9c5f895cea024b2e8e51cc49d5d0d06f25eb5ca0cd07e6bceb3b25fce`.
- Before JS file SHA-256 (after the prior q11-only correction): `5835d8a191bc4d885824d72d79403798c927040e3e71bccdfe5ae765eeb7775f`.
- After JS file SHA-256: `31643c8d7f808778d196dcc5dee08417cc2521552db010466c91cdc51241c11d`.
- q18 fields (`content`,`choices`,`image|null`) before/after SHA-256: `bad6121b9776d3f547754ab07977252509ecd423be0aa7d47cdce32590fd48cc` → `76cab7e47e7c1d9a3c3c19794165cc0e6086cae3fdc5ef4f15a3d4e29fb02eeb`.
- q20 fields (`content`,`choices`,`image|null`) before/after SHA-256: `c2fb20bca349b60f5fd7d654c04e83e775649a8587700a1f36c417e467d667a6` → `b43c56e3bcf3e5100bf81ee0b9d54f8393b7ffd41c52de934d6eca7737668362`.
- Restoring only the two point tokens and each SVG root to height/viewBox height 180 reproduces the corresponding before question-field hash. Choices and all SVG paths/lines/labels were otherwise unchanged.

Pre-repair SVG exhibits are `q18-inline-before.svg` and `q20-inline-before.svg`; post-repair exhibits are `q18-inline-after.svg` and `q20-inline-after.svg`.

## Validation and exam-mode render

- `node --check` on the modified JS: PASS.
- Scoped question-field validation: PASS for both ordinals; inline SVGs parse and retain the expected geometry and labels; before-field hashes are recovered by removing only the documented score/root changes.
- Reproduced exam-mode equal-slot audit after repair: PASS, `auditOk:true`, 6 pages, zero issues; q18/q20 viewBoxes are `0 0 280 200` and `0 0 240 200`.
- Desktop exam render: q18 line label and q20 parabola tail visibly render with `[4.5점]`/`[4.8점]`; viewport 1920×911, document width 1905, no horizontal overflow.
- Mobile exam render: q18/q20 full figures and labels render at 390×844; document width 375, no horizontal overflow. Temporary viewport override was reset.
- Only exam mode was used; answer and solution modes remain uninspected.
