# AP Math TeX/TikZ SVG GOLD PILOT

This directory is candidate-only. It does not replace the existing Python SVG
pipeline and does not write to production JS or production asset directories.

`schema/` contains the deliberately small input contract. `generator/` contains
the deterministic Python numeric validator/sampler, the STANDARD build runner,
and the isolated SPECIAL build runner. `samples/` contains nine STANDARD JSON
inputs and one handcrafted SPECIAL TeX input. `outputs/` is generated evidence.
`reports/` contains the inventory, triage, and comparison report.

The build route is:

```text
JSON -> Python validation/sampling -> TikZ/PGFPlots .tex
    -> xelatex -no-pdf -> .xdv -> dvisvgm -> .svg
```

The SPECIAL lane still uses the same XeLaTeX, dvisvgm, browser, and QA steps.
Its hand-authored TeX is kept separate so an unusual diagram cannot enlarge the
STANDARD schema by accident.
