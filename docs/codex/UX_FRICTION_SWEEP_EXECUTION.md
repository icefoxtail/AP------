# UX Friction Sweep — Execution Record

Base: `origin/main` `42c76d18899a3902f005e8fc6e7d60f5ff6f850f`
Branch: `codex/ux-friction-sweep`
Campaign status: in progress; stage commits stay local until independent UX review.
Mobile reading guardrail: [Notion 9-7](https://app.notion.com/p/3ec0e68bd69f81fcb26cf73a6f2130fc)

## S0 — Execution Baseline

Status: PASS

Changes:

- Guarded Saved Paper blueprint inserts now batch five rows (17 binds each), keeping every D1 statement under 100 binds.
- Unit Past loads `archive2-canonical.js` before `archive2-core.js` and uses the existing Output Envelope producer for embedded preview, standalone exam output, and assignment preview/output.
- Unit Past output metadata carries qpp. Its quick-filter projection maps canonical difficulty buckets 1→하, 2–3→중, 4–5→상 without changing the stored numeric bucket.
- Fifty-one selected questions remain split into 50 + 1 papers.

Verification:

- Worker + D1 runtime: Saved Paper assignment sizes 1/5/6/10/50 all committed and persisted matching question/blueprint counts. Local PDF generation returned the expected 502 because the test runtime has no Cloudflare Browser Rendering binding; assignment persistence passed independently.
- Bind-limit regression: guarded blueprint batches for 1/5/6/10/50 stay at or below 85 parameters.
- Unit Past core, UI, and runtime regressions passed; 51-question split regression passed.
- Playwright local browser flow: canonical catalog loaded, a new 12-question paper generated, the embedded preview rendered three pages, standalone exam opened with an Output Envelope and no `preview=1`, and the mocked assignment UI completed. The same source opened in `exam`, `sol`, and `ans` Envelope modes.
- At 1440×900 and 390×844, the generated Unit Past page had no horizontal overflow; the 390px preview was 360px wide and all three actions remained visible.
- Assignment HTTP calls in browser smoke were intercepted with fixture responses; no production assignment was submitted.

## S1–S6

Not started.

S1/S5 will keep the existing clean reading body, add only the pinned compact mobile controls, preserve the originating source/context on return, keep preview presentation distinct, and compare first-page/readiness timings under matched conditions without inferring a speedup from hidden controls.
