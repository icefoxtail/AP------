# External original-vs-similar review package

Use this package when an external reviewer must compare a generated exam with
the exact original source. It is a delivery package, not a production Archive
registration and not a replacement for the internal Run evidence.

## Layout

Keep two independent roots so each lane's JS-relative asset paths remain valid:

```text
original/archive/exams/original/<grade>/<source>.js
original/archive/assets/images/<original-id>/<source-assets>
similar/archive/exams/similar/<grade>/<identity>.js
similar/archive/assets/images/<identity>/<generated-assets>
```

Include only the two JS files and the assets referenced by their questionBank
or solution fields. Preserve the original file format: original PNG is not
silently converted to SVG. Generated SVG remains SVG; a referenced PNG remains
an explicit PNG exception.

The package is intentionally not directly merged into the repository root:
the `original/` and `similar/` prefixes prevent asset and JS collisions. An
external reviewer opens one lane at a time with the production engine or uses
the project review harness. After approval, use the similar-only install
package for project placement.

## Storage and session handoff

The Run workdir is internal evidence storage. Do not hand an external reviewer
a path under `alive/runtime/*-runs/<run-id>/`; a session file index may not
mount that deep workdir even when the ZIP is valid. Set the command's
`--output` directly to `alive/runtime/results/<stable-name>.zip` and link only
that result-root file. Keep the internal Run ZIP and this compact external ZIP
as separate artifacts.

The normal ZIP codec is `ZIP_DEFLATED`. A missing session file is not a reason
to switch codecs: first verify that the result-root file exists, that
`ZipFile.testzip()` passes, and that its members are limited to `.js`, `.svg`,
and `.png`.

For the user-facing link, emit the normalized absolute result-root path with
forward slashes on Windows (`C:/.../alive/runtime/results/...zip`). Avoid
backslash paths and `file://` URIs because they are not reliable inputs to the
session file indexer.

The result root is still disposable runtime storage. It is Git-ignored and
must not be treated as a second Archive. Never unzip the package below the
repository (including `alive/runtime/results/<package-name>/`) for inspection;
use a temporary directory outside the repository and remove it after the
check. The package itself may remain in the ignored result root only for the
current session handoff or manual review.

## Deterministic gate

Before delivery, verify that:

1. both JS files parse and preserve their question counts;
2. every local asset reference has exactly one packaged file in the same lane;
3. original asset bytes match the source Archive;
4. generated asset bytes match the canonical package;
5. the ZIP contains only `.js`, `.svg`, and `.png` files; and
6. the original Run/evidence package remains separate and unchanged.

The deterministic command is:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py similar-package-external-review --input <canonical-zip> --output <external-review-zip> --source-file <original-js> --json
```

For the adaptive whole-exam route, this command is a required S09 substep,
not an optional follow-up. The package operation must record the external ZIP's
result-root path, SHA-256, member count, and `roundTrip: PASS`; if any of those
checks fail, S09 remains failed and no final delivery status may be reported.
