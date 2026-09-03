# H1 First-Semester Approved Placeholder Repair Evidence

## Authorization

The user explicitly authorized arbitrary repair of the two previously held source-dependent placeholders using the archive correction protocol and the similar-question student-facing quality rules.

## 24 한영고 1학기 중간 q11

- Production file: `archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js`
- Original placeholder: `[그래프필요]`
- Approved repair: remove the internal marker and attach `assets/images/24_한영고_1학기_중간_고1_기출/q11.svg`.
- Reconstruction basis: the existing independent solution explicitly fixes `f(x)=(x+1)(x-2)=x²-x-2` and `g(x)=-(x+4)(x-2)=-x²-2x+8`, including both x-intercepts and the opening direction.
- The SVG retains `data-visual-provenance="reconstructed_from_solution_facts"` and the two equations as non-rendered data attributes.
- The student-visible SVG contains only the axes, required intercept labels, curve labels `y=f(x)` and `y=g(x)`, and the graph itself. It does not display either completed function equation, reconstruction notes, exam identifiers, or provenance text.
- Visual content gate: `VISUAL_ANSWER_LEAK=PASS`, `STUDENT_VISIBLE_PROVENANCE_TEXT=PASS`, `VISUAL_LABEL_SEMANTIC_REVIEW=PASS`.
- Independent check: `f(x)=2g(x)` gives `(x+3)(x-2)=0`, so `α=2`, `β=-3`, `α-β=5`, answer ①.

## 25 효천고 1학기 중간 q12

- Production file: `archive/exams/original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js`
- Original placeholder: choice ① `[판독불가]`
- Approved repair: choice ① → `$0$`; choices ②–⑤ and answer ② remain unchanged.
- Independent check: with `z=(1+i)/√2`, `z²=i`, hence the existing solution obtains the value `-√2`, which remains choice ②.
- This is an explicitly user-authorized reconstruction, not a claim that `$0$` was recovered from an original scan.

## Render evidence

- q11 exam mode: q11 SVG decoded with positive natural width; 21/21 q-boxes; no broken image, overflow, placeholder, or load-error text.
- q11 solution mode: 21 numbered questions rendered; MathJax present; no broken image, overflow, placeholder, or literal LaTeX text.
- q12 exam mode: 23/23 q-boxes; choice ① displays `0` and choice ② displays `−√2`; no broken image, overflow, placeholder, or load-error text.
- q12 solution mode: 23 numbered questions rendered after dynamic completion; MathJax present; no broken image, overflow, placeholder, or literal LaTeX text.
- q11 and q12 answer mode: 21 and 23 answer nodes respectively; no broken image or overflow.
- H1 first-semester production placeholder scan: 0 remaining `[그래프필요]` or `[판독불가]` markers.
- Official archive audit for both touched exams: PASS; JS question counts, DB counts, question-index counts, and q11 image existence agree.
- Browser QA note: the Chrome CUA session emitted a repeated extension listener-channel message; it was not a page-originated archive-engine error. No archive load-error text, render exception, broken image, or overflow was observed.
