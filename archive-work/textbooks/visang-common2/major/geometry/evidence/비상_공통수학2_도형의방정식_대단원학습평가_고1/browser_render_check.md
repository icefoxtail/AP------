# Current browser render observations — Geometry major assessment

Target: `archive-work/textbooks/visang-common2/major/geometry/js/비상_공통수학2_도형의방정식_대단원학습평가_고1.js`

| Mode | Direct browser observation | Current pipeline-core capture |
|---|---|---|
| `exam` | 17 source-backed question blocks on 5 pages. Both canonical source crops (q05, q15) decoded; no browser request or page errors. | Desktop and mobile captures each observed 17/17 questions; runtime, MathJax, fonts, image decode, asset association, clipping, and overflow checks PASS. |
| `solution` | 17 solution blocks and all 15 referenced SVGs decoded across 8 pages; no browser request or page errors. | Desktop and mobile captures each observed 17/17 questions; the same mechanical checks PASS. |
| `answer` | 17 numbered answer entries on 1 page. The browser display uses two-column order; all numbers 1–17 are present. | Desktop and mobile captures each observed 17/17 answers; the same mechanical checks PASS. |

Pipeline-captured case records and page screenshots are stored under `pipeline-run/render-capture/`; `render-capture-binding.json` binds all six cases to run `visang-geometry-major-sol-review3-20260929`, revision 2, input SHA `sha256:079e29d0448269ead3f38a0202d03b5c8a7c5e7fc6129f4eb46b536c3048fe40`.

`readability` remains `NOT_TESTED` in the machine capture. An independent reviewer must inspect the captured exam, solution, and answer screens before render readability can pass. The direct browser observations under `browser-exam-render/`, `browser-sol-render/`, and `browser-ans-render/` are supplementary evidence and do not replace that review.
