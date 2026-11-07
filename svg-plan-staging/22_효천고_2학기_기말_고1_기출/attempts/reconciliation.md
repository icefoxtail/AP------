# Prior-state and ownership reconciliation

- Worktree: `/workspace/AP------`; branch `codex/svg-22-hyocheon-h1-final`, created from local `work` branch at `d9bed1fbae`; worktree was clean before this task.
- Target source JS blob matches ROOT's `456629f82051d55a62481a70a913c0836c62ebac`; SHA-256 `fee0fb0a1cc076c8feb33a9ae845a147731d20021e029ad76ed77da89c80fca7`.
- Ownership retained: Claude Q1/Q2/Q11/Q19; Q2 EXEMPT. No candidate inputs for these four questions.
- Existing tracked solution assets were found for Q4/Q5/Q10/Q15/Q16/Q17/Q18/Q22. Q4, Q5, Q15, Q16, Q18, Q22 are legacy SVGs; Q10 and Q17 are original problem/solution PNG files. Q17 solution is an official engine SVG committed 2026-10-31 and is retained. Visual inspection confirmed it illustrates an up/up/down/down A-to-B route, but that route does not traverse CD as requested by the ROOT draft. Q17 is now included in the candidate render batch; the historical asset remains untouched. No exam-ledger row was present.
- Legacy image content audit found answer leakage in Q4 (`a+b=−10`), Q5 (`a=22`), Q15 (`0≤k<2/3`), Q16 (`k=31`), and Q18 (`x≤3, y≥−1`). Q22 did not show `f(5)=3` but lacked fixed-point overlays. These are candidate replacement targets only; no replacements have been rendered.
- Candidate adjustments: mapping text that violates engine limits was normalized for Q3/Q10/Q12/Q14/Q20/Q21; Q5 viewport tightened to keep the relevant point/curve relation legible; Q16 uses non-answer example k=30; Q22 includes exact fixed points. Full ROOT plans remain unchanged under `root-inputs/`.
- No other worker's files were modified. No main merge, PR, publication, CI bypass, push, or external action occurred.
