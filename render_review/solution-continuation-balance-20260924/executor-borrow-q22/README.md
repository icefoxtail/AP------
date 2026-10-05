# Executor continuation borrow check — Geumdang q22

## Scope

This is a q22-only visual and placement comparison after code commit `fe5c654e4b5117150c0104aa564ac3b19fe1a35a` on branch `gpt/archive-solution-continuation-balance-20260924`. The input is the frozen Geumdang reflow artifact already preserved at `../inputs/25_금당고_2학기_중간_고1_기출.js` (SHA-256 `4423E6CA38BB27E6415269A00DD90A9CBEEF7E02767667D0ACF8F49FF8243CC5`).

The renderer loaded the complete 22-question exam so q22 kept its production position. The comparison below only evaluates q22.

## Actual render conditions

- Current production `archive/engine.html`, with `solution-render-executor.js?v=20260924.2`
- `mode=sol`, shared solution authority, authority layout planner, batch renderer
- Chrome/Blink, viewport 1440 × 1100, device scale factor 1, zoom 100%
- Fresh browser context, cache disabled, service worker bypassed
- Waited for `renderReady`, MathJax, `document.fonts.ready`, image decode, and animation-frame settling
- No CSS injection or DOM changes were used to affect layout

## Authority plan and observed q22 DOM

Authority and actual DOM placements match by fragment block ID, page, and column:

| Fragment | Authority placement | Actual DOM placement | Visible lines | Height |
|---|---|---|---:|---:|
| 1 | page 17, column 1 | page 17, column 1 | 49 | 941.36 px |
| 2 | page 17, column 2 | page 17, column 2 | 74 | 914.72 px |
| 3 | page 18, column 1 | page 18, column 1 | 7 | 147.92 px |

The authority source has 139 q22 chunks; the three actual DOM fragments contain 139 chunk elements total. The three fragment IDs are unique and in source order. The final conclusion remains together on page 18: “따라서 구하는 값은 `k = -1, 3, 7`, `a = 4`, `b = 6`이다.”

q22 stayed at 11.3333 px. Auto-compression, q22 horizontal overflow, clipping, and unrendered MathJax are all zero. The q22 SVG decoded at 940 px natural width. Input parity across the actual 22-question render is 22/22 for id, content, choices, answer, and solution; mismatches are zero.

## Whole-exam diagnostic note

The optional `renderAuthorityDualRun=1` diagnostic invokes a whole-exam block comparison. It reported `UNKNOWN_BLOCK:solution-block:18:primary:continuation:2`, which is outside q22. The q22 verdict here comes from the direct q22 authority ledger ↔ actual DOM comparison above; this unrelated diagnostic did not change the rendered layout. No code outside the requested executor borrow locations and executor cache version was changed to address it.

## Verdict

**q22 PASS.** Authority and observed placements agree; the conclusion block and existing visual improvement remain intact; no q22 omission, duplicate placement, overflow, or clipping was observed.

## Captures and data

- [Page 17 PNG](after/pages/page-17.png)
- [Page 18 PNG](after/pages/page-18.png)
- [Machine-readable q22 comparison](q22-comparison.json)
