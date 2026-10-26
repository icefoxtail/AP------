# Read-only survey: which solution figures the AP Math SVG engine still cannot draw

You do NOT edit the repository, commit or run renders. Read-only repo: `D:/AI_WORKSPACES/APMS/svg-x4` is not yours (another worker edits it) — read files under `D:/AI_WORKSPACES/APMS/svg-survey-ro` instead (a clean checkout of origin/main created for surveys; never modify it). Use small python scripts (`python -X utf8 -I script.py`, scripts saved in your output folder) to scan exam JS; do not paste whole exam files into your context.

## Inputs
- Exams: `archive/exams/original/**.js` (ORIGINAL past exams). Each file defines question objects with stem/content, choices, answer, solution, optional `image` (problem figure under `archive/assets/images/...`) and optional `solutionImage*` fields.
- Engine capabilities: read `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md` fully once. Current capabilities: coordinate construction ops (points/lines/circles, division points, centroid, reflections, perpendiculars, translations), plane figures without axes with angle/segment/arc marks (3-8), region fill (being added), polynomial/quadratic graphs incl. piecewise, slanted/reference lines, two quadratic curves, irrational coefficients, application axes for word problems, function families (rational, sqrt, abs, exp/log base e, trig one period or π-intervals with lines), number lines (sets, intersections, parameters, integer points), statistics charts (histogram, frequency polygon, relative frequency, stem-and-leaf, box plot, scatter, 6x6 dice table, tree diagram), solid figures (prisms/pyramids/frustums, cylinder/cone/sphere, nets, axial sections), point display names (T₁, A′). In progress elsewhere: exp/log integer & radical bases, cubic repeated roots, two piecewise functions, filled-sector angle marks.
- Already surveyed (do not repeat): middle 2nd-semester survey `D:/AI_WORKSPACES/APMS/middle-survey/middle-figure-gap-survey.md`; high exams listed in `archive/tools/geometry-equation/production/exam-figure-ledger.json`.

## Method
1. From your assigned folders, list exams with question counts and how many already have `solutionImage`. Pick the number of exams your brief says, spread over years/schools/folders, preferring exams with many figure-dependent questions and few existing solution images. Skip exams already in the ledger.
2. For every question of the chosen exams: does a SOLUTION figure truly help a student? REQUIRED / BENEFICIAL / NOT_NEEDED; if needed, the figure type and whether it is drawable now (name the capability) or missing (name the missing capability precisely). Be honest and specific; do not count a figure as drawable if one essential element (e.g. a curve, a mark, a second function) is missing.
3. Note questions whose stem says "그림" but have no `image` (missing problem figure — not an engine gap).
4. Rank missing capabilities by question count; for the top 5 give a short design: plan shape sketch, what an independent observer must verify on the final SVG, error cases, which questions it unblocks.

## Output
`D:/AI_WORKSPACES/APMS/surveys/<your survey name>/survey.md` (Korean) + `survey.json` (machine-readable: exams, per-question verdicts, ranked gaps). Final answer (short, Korean): chosen exams, counts (questions, needing figures, drawable now, missing), ranked missing capabilities with counts, missing problem images, file paths.
