# Print engine v2: fixed four-question exam compositor

## Authorization and scope
The user authorized design, implementation and testing on a separate branch, with a replacement they can try. This branch replaces the exam/qpp=4 compositor for Archive, Mixer and Wrong. Other qpp values, solutions, answers, source selection, recipient grouping and duplex separators retain their current executors. No deployment or main merge is part of this work.

## Architecture
Keep the proven source formatting, MathJax readiness and transactional snapshot runtimes. Add one shared equal-slot compositor. Build question nodes directly into final physical page slots, typeset the batch once, wait for images and fonts, then measure in their actual width. Do not clone or re-typeset questions for placement, do not run per-question animation-frame waits. Retain existing snapshot reuse; do not claim a new per-question persistent cache.

## Invariants
- Four identical slots per exam page; final partial page retains empty slots. Order is column-major: left top, left bottom, right top, right bottom.
- Functional parity and quality superiority are the replacement gates. By default, documents with fullwidth/subjective span hints retain their existing compositor; explicit `equalSlots=1` selects strict four-slot placement even for these hints. Other qpp values retain existing behavior. This is a scoped compositor replacement, not a claim that all modes have been rewritten.
- No content deletion, rasterization of question text, anisotropic scaling, or hidden clipping used as successful fitting.
- Fonts, MathJax, images ready before final measurement. Late QR additions are incorporated before readiness and audited again at print preflight.
- Printed and preview page geometry match in v2; preview scaling does not change physical layout.
- Normal questions remain unmodified. Overflow questions alone consider bounded candidates: normal, compact spacing, choice columns when not explicitly locked, proportional image adjustment, selected combinations. Select using readability and change cost, then uniform scaling if necessary. Record profile, scale, effective font and warning/review status.
- Scale below 0.85 is a warning; below 0.75 requires composition review in diagnostics (provisional thresholds, not hidden font shrinking).
- Audit rendered content in all four directions, internal clipping, page bounds, equal slots and fixed-element overlap. Invalid/missing assets or geometric failures block print rather than silently reporting ready. Account correctly for transform/zoom versus scroll metrics.
- Reserve footer/QR space consistently across the four slots of the page. Never reduce only the QR-adjacent slot.
- Switch `slotEngine=legacy` explicitly restores old exam behavior for comparison. This branch defaults to v2 for compatible qpp=4 documents; `equalSlots=1` opts into strict placement for special documents.

## Public interface
`APEqualSlotEngine.render({area, items, deps})` where items contain canonical `{q, box}`, deps supplies `makePage(area,no)` returning `{page,body}`, `typesetMath(label,nodes)`, `raf()`, optional `applyAutoImageSizeClasses(root)`, `decorateBody(page,last)` and `afterPage(page,last)`.
`APEqualSlotEngine.finalize(area)` handles late fixed decorations and stores serializable evidence on the root/page; must be safe to call again without compounding scale.
`APEqualSlotEngine.audit(area)` returns `{ok,issues,slots,...}` and `assertReady(area)` throws on failures. `enabled(qpp,url)` centralizes selection. The API can be refined if documented consistently in tests.

## Acceptance
Real Chromium tests on all three engine entry points, adversarial shared content (long Korean prompt, long math, image/SVG, table, five choices and mixed blocks), 4/8/9 question ordering and partial slots, QR, Wrong recipients/duplex, mode switching and snapshot reuse, screen/print media. PDF and screenshot outputs are inspected. Compare old/new cold-render wall time and MathJax/layout counters on the same fixture; no machine-independent speed claims. Existing focused runtime/readiness/identity tests continue to pass. Branch includes reproducible commands, evidence and rollback instructions.

## Implementation details verified during integration
- Inner content uses CSS zoom with an explicit pre-zoom width so Chromium paginates the scaled footprint. Paint-only transform scaling moved long choices onto the following PDF page, despite correct print-media DOM rectangles.
- html2canvas 1.x requires a private-clone conversion from zoom to equivalent paint transform; the original snapshot is never changed. Archive/Mixer raster and shared native PCL/GDI capture call this adapter.
- Production entry points defer fit/audit until late QR decorations are complete. Public render finalizes by default. Repeated finalize uses a same-node size/content cache without repeating fitting; audit still runs.
- Legacy/special executors are preserved. Missing required strict-mode modules fail closed; default special-layout documents do not require v2.
