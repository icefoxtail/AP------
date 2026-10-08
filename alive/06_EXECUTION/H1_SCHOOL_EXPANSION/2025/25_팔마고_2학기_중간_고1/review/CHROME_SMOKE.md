# Palma 2025 H1 2mid — Chrome student-supply smoke

- Date: 2026-10-09 KST.
- Browser: headed Google Chrome channel via Playwright CLI; local read-only HTTP server at `127.0.0.1:8877` served this worktree.
- Page: `/archive/generated-bank.html`; Consumer index and referenced shard were read from the current worktree bytes.
- Each of the four APPROVED UIDs was searched individually. Each query returned exactly one row; each row opened and selected.
- All four previews contained only the student prompt and choices. No answer or solution appeared.
- Held UID `ALITE-PALMA25-H1-2MID-B07-Q13-BP03` returned zero results.
- Four-item print-media DOM render passed: all selected student questions were present; the page used `@media print` layout and contained no answer or solution. `window.print` was intercepted inside the browser page to avoid opening the native print dialog; native printer UI is not claimed.
- The only Chrome console error was the local server's missing `favicon.ico` (404); no application or Consumer-load errors were observed.

| UID | Search count | Open | Select | Answer/solution absent |
|---|---:|---|---|---|
| `ALITE-PALMA25-H1-2MID-B07-Q01-BP01` | 1 | PASS | PASS | PASS |
| `ALITE-PALMA25-H1-2MID-B07-Q01-BP02` | 1 | PASS | PASS | PASS |
| `ALITE-PALMA25-H1-2MID-B07-Q13-BP01` | 1 | PASS | PASS | PASS |
| `ALITE-PALMA25-H1-2MID-B07-Q13-BP02` | 1 | PASS | PASS | PASS |

Negative lookup: `ALITE-PALMA25-H1-2MID-B07-Q13-BP03` → 0 results.
