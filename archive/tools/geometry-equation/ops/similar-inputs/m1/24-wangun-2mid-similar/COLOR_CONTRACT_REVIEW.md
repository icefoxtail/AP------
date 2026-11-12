# Existing color contract review

Latest main AUTHOR_GUIDE.md blob90f3f4e85bc3cb167886d887f8b9ae98cba71724 §3-9-색: screen first, BLUE/WARM preferred, black labels, same color same relation, marks together. palette.mjs blobf6c5227853c529fb8ac627c180070c9e4b02069b matches local renderer table. Colors on segments cannot combine dashed/arrow/emphasis. EqualLengths color additionally checks real equality.

Q9 solution: BLUE #1f5fa8 BC/BD=6 plus matching ticks; WARM #b85c00 AB=7. Actual SVG colors and unchanged mandatory observers PASS. No problem figure, so no answer hint.

Correction: Q23 ACCENT was already red #c0392b, not uncolored. Q15 histogram remains gray: latest stat-chart-v1.mjs blobe886bbafa992ede54fbdc145242ac670c9a1af43 still defines gray bar/barHi without histogram color input. No unsupported postprocessing. For supported geometry use palette; for histogram retain explicit class labels/highlights until existing supported color contract becomes available. No engine development performed.

visualQA NOT_RUN; actualArchive NOT_RUN.
