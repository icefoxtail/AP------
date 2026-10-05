# P1 runtime and render-lineage closure

- Date: 2026-09-06
- Status: `PASS_SOFTWARE_REGRESSION`
- Scope: minimal hardening of the shared pipeline core; no production question,
  SVG, source scan, or candidate package was modified.

## Closed gaps

### Render runtime dependency binding

Every render-capable run now records a `RENDER_RUNTIME_BUNDLE_v1` before review.
The bundle uses raw bytes for `archive/engine.html`, its local script/style
closure, CSS resources, and the selected local MathJax distribution. The current
bundle contains 33 local files, including `native_print.js`, the theme override,
the MathJax loader and fonts. Runtime URLs fetched by the browser are recorded
with URL, bytes and SHA in each capture.

The local render server only serves paths that are bound in the run input. A
missing local runtime dependency is a request failure, never a fallback read
from the working tree. Changing `native_print.js`, CSS, a MathJax font, or any
bound runtime file changes the bundle/run input and blocks reuse of old capture
or review evidence.

External URLs remain visible in the bundle and their actual response bodies are
recorded by capture. Their availability or content therefore cannot be silently
treated as unchanged.

### Capture-to-review lineage

Browser collection writes immutable `render-capture` evidence with raw screenshot
references and mechanical checks. A final `render` review must reference the
capture file SHA, runtime bundle SHA, response bundle SHA and each screenshot
SHA. The reviewer identity/session must differ from the collector and begin only
after capture freeze. The final reducer reuses runtime/count/asset measurements
from capture; the reviewer supplies only clipping, overflow and readability.

A hand-authored render PASS without a frozen capture, a same-session capture and
review, a reviewer started before freeze, a changed capture, an altered runtime
bundle, or a missing reviewed item all block closure.

### Production authority

Question-quality closure remains distinct from production authority. A production
write caller now requires an explicit authorization object bound to the current
input SHA, runtime bundle SHA and complete frozen render-review evidence list.
`productionAuthorized: false` cannot be ignored by promotion code.

## Regression evidence

[p1-runtime-lineage-tests.json](p1-runtime-lineage-tests.json) records:

- common Node core: 98 tests PASS;
- ALIVE Python: 10 tests PASS;
- existing original-exam/textbook contracts: 25 tests PASS.

The runtime fixture includes an engine, `native_print.js`, CSS and a MathJax font
fixture. Negative tests mutate each dependency after freeze and verify that the
closure becomes `BLOCKED`.

This closes the two P1 implementation gaps. It does not retrospectively certify
existing historical render evidence. Existing closed runs must be re-rendered
under the current runtime bundle before using production authority.
