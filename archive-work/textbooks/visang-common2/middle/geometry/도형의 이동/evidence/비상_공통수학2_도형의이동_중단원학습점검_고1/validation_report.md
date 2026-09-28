# Validation report — Visang Common Math II · 도형의 이동 · 중단원 학습 점검

## Inventory and source authority

- Problem PDF: `C:/Users/USER/Downloads/[비상교육]_고등_공통수학2_교과서_중단원&대단원&수학익힘책.pdf` — 46 pages, SHA-256 `c1ba1424c5e28f04c64afa0fdc3f97479bef2b1e6fe422f668e98dac9846305c`.
- Assigned problem pages: physical 11–12, printed 51–52. Display numbers 01–11: page 11 has 01–04; page 12 has 05–11.
- Answer/solution PDF: `C:/Users/USER/Downloads/[비상교육]_공통수학2(김원경)_교과서_정답과_해설.pdf` — 18 pages, SHA-256 `b3b127f9f26e54778717e776898fba1e755744d043e33f62c43e0df1d1ee0db0`.
- Answer crosswalk: physical page 5, printed 146, section title “중단원 51~52쪽”. Physical page 4 / printed 145 was inspected and contains the preceding practice range, so the initial page hint was corrected by direct page and prompt fingerprint checks. All 11 answers were independently solved and agree with the correct official page.

## Completed work

- 11/11 printed questions mapped to sequential JS ids 1–11; source display numbers remain in `source_map.json`.
- Source content and subpart order checked against full rendered source pages: 11/11. No choices are present in the source; `choices: []` for 11/11.
- Official answer and worked solution: 11/11. Student-ready solutions: 11/11, with intermediate calculations, condition handling, and final values matching the answer field.
- Taxonomy: `H22-C2-04` / `도형의 이동` / order 4; `H22-C2-04-CORE` / `도형의 이동 핵심 개념`. Compiled master parent/label check passed. Difficulty `level` remains blank because difficulty review was outside this set assignment and the source does not state a level.
- Visual asset: one pure source crop, Q08 only, at `assets/비상_공통수학2_도형의이동_중단원학습점검_고1/q08.png`. It was cropped from the full-page render of physical p12 at 250 DPI, bbox `[710,1835,1075,2300]`, size 365×465. No geometry or labels were redrawn. The crop was inspected at original resolution. SHA-256 `fe218a19fef45a0d6d0427080d7cb6fd5daf22252176b1b966a29dd1792e40c8`.

## Validation

| Check | Result | Evidence |
|---|---|---|
| Source page and question coverage | PASS 11/11 | `source_map.json`, full-page source PNGs |
| Official answer/solution identity and agreement | PASS 11/11 | `source_map.json`, `independent_math_review.md`; answer physical p5 / printed p146 |
| Source text and choices parity | PASS 11/11; choices exact 11/11 | direct full-page visual comparison and source/question map |
| `node --check` | PASS | command output |
| VM `questionBank` load | PASS, 11 items / ids 1–11 | command output |
| Required JS fields, formula delimiter scan, taxonomy parent/label | PASS 11/11 | command output; master `js_archive_tag_master.json` |
| PNG decode and crop provenance | PASS, 1/1 | command output, `crop_provenance.json` |
| Archive `exam` render | PASS, 11 questions / 3 pages; Q08 image displayed | `browser_render_report.json`, `browser_http_access.log` |
| Archive `sol` render | PASS, 11 non-empty solutions / 4 pages; Q11 final solution displayed | `browser_render_report.json`, `browser_http_access.log` |
| Archive `ans` render | PASS, 11 answers / 1 page; final 9/5 displayed | `browser_render_report.json`, `browser_http_access.log` |
| Console error capture | NOT_CAPTURED | Available browser observation exposed AX state and screenshots, not console logs |

The real `archive/engine.html` was used without changing any production archive file. Its strict JS-path gate accepts only `/archive/exams/*.js`; a temporary localhost server mapped that allowed URL to the dedicated `archive-work` candidate and the standard image URL to its task-local crop. The browser log records successful JS and Q08 image GETs. Temporary server scripts and page renders are outside the deliverable paths and will be removed before commit.

## Exceptions and scope

- Manual review/HOLD: 0. The answer PDF page hint was corrected to the page whose printed section and 01–11 fingerprints match this set; no answer was inferred from the hint.
- Difficulty labels intentionally remain unclassified. No major-unit assessment, workbook, other middle-check set, shared pipeline code, production archive, DB, or index was edited.