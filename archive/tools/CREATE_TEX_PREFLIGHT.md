# CREATE TeX preflight

`archive-create-preflight.mjs` is a read-only candidate scanner. It marks uncertain student-facing math notation `REVIEW_REQUIRED`; it does not repair source, decide mathematical correctness, approve answers, or change existing HOLD, unit-order, and final-value checks.

It inspects `content`, `solution`, string choices, and the supported textual choice-object fields `text`, `content`, `value`, and `answer`. Choice objects and their labels/options remain untouched. Findings identify the qid, field, exact source offsets, token, and reason for each new TeX issue.

Stable TeX finding codes:

- `TEX_MATH_DELIMITER_UNPAIRED`: an unescaped `$`/`$$` or one of `\(`/`\)`, `\[`/`\]` lacks its matching delimiter.
- `TEX_COMMAND_OUTSIDE_MATH`: a backslashed `\frac`, `\dfrac`, `\tfrac`, or `\sqrt` command appears outside a recognized math wrapper.
- `TEX_COMMAND_BACKSLASH_SUSPECT`: an unbackslashed form of those commands appears inside paired math.
- `TEX_ENVIRONMENT_OUTSIDE_MATH`: a supported math environment appears outside a recognized math wrapper.

Escaped dollar signs are ignored as delimiters. HTML tags are excluded from offsets while their visible text is scanned; HTML `code`/`pre` and Markdown inline/fenced code samples are excluded from math checks. Review findings are candidates for the CREATE worker to adjudicate. The scanner does not rewrite, normalize, or remove any source content.
