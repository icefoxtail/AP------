# A4 output matrix

The three fixtures are real Archive source files opened through the local Archive 2.0 Finder and read without edits.

| Fixture | Source | Planned baseline qpp | Planned final qpp | Notes |
|---|---|---|---|---|
| Text-centered | 2026 금당고 고1 1학기 기말고사 | 4 / 6 / 8 | 4 / 6 / 8 | Common Math 1; prose and short expressions |
| Math-heavy | 2026 금당고 고2 1학기 기말고사 | 4 / 6 / 8 | 4 / 6 / 8 | Algebra; dense equations and multi-line work |
| Geometry/image-heavy | 2026 매산고 고2 1학기 중간고사 | 4 / 6 / 8 | 4 / 6 / 8 | Geometry; source figures, coordinate graphs, formulas |

Additional final engine outputs:
- Original geometry solution and answer modes at qpp 4.
- Mixed/Compose exam output at qpp 4 / 6 / 8.

## Final rendered result

| Output | qpp 4 | qpp 6 | qpp 8 | Verification |
|---|---:|---:|---:|---|
| Original text-centered exam (20 questions) | 5 pages | 4 pages | 3 pages | A4, title, MathJax and image readiness passed. |
| Original math-heavy exam (21 questions) | 6 pages | 4 pages | 3 pages | A4, title, MathJax and image readiness passed. |
| Original geometry/image-heavy exam (21 questions) | 6 pages | 4 pages | 3 pages | A4, title, MathJax and image readiness passed. |
| Mixed/Compose exam (50 questions in part 1) | 13 pages | 9 pages | 7 pages | Preview page count matched printed page count; A4 and header passed. |
| Original geometry solution | 10 pages at qpp 4 | — | — | A4, MathJax, diagrams and render-error scan passed. |
| Original geometry answer | 1 page at qpp 4 | — | — | A4, answer render and render-error scan passed. |

- Baseline: 9 PDFs; all passed A4 and content checks.
- Final: 14 PDFs; all passed A4 dimensions, expected page count, expected header, and render-error scan.
- Final pages rasterized: 78 PNGs across four contact sheets (text, math, geometry, mixed/Compose). Full-size geometry, math, and mixed/Compose pages were visually checked.
- `evidence/a4/final/pdf-audit.json` contains the file-by-file audit; `evidence/compose-final.json` records the mixed/Compose selection, actual screen preview, and qpp page counts.

Baseline plus final evidence contains 23 PDF files. Page size, page count, header text, render-error text, math/image presence and rasterized appearance were verified.
