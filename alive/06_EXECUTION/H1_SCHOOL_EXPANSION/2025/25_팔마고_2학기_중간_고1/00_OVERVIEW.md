# 25 팔마고 고1 2학기 중간 — 생성 개요

- Source inventory: 23/23 ordered unique source IDs, 19 multiple-choice and 4 constructed-response; total 100 points.
- Primary L2 groups: 7; adaptive work plan in `01_ADAPTIVE_BATCH_PLAN.json` covers every source qid exactly once.
- Source HOLD before generation: q11 (undeclared `z`) and q16 (printed set braces conflict with source solution). Original source is preserved; these qids produce no candidates unless independently resolved with source evidence.
- q20 contains the original school-name typo “마팔고”; do not copy the typo into generated text.
- Student-facing figures: q9, q10, q15, q17, q19. All five were opened at original resolution during source inventory. Four additional SVGs are solution-only references.
- Output counts are not preset. Only meaningful, curriculum-safe blueprints become candidates.
- Worktree is based on latest fetched `origin/main` commit `330394489f6e90c5c7d5c7ae28623ab52ca824b9`.
