# Independent review: Print engine v2

## Scope reviewed

- Specification: `docs/superpowers/specs/2026-09-15-print-engine-v2.md`
- Review package: `.superpowers/sdd/2026-09-15-print-engine-v2/review-package.md`
- Production implementation from `027357a70` through `96bab5e95`, plus the current worktree's outer-finalization/readiness ordering edits in Archive, Mixer, and Wrong Clinic.
- Primary files: `archive/equal-slot-engine.js`, `archive/equal-slot-engine.css`, `archive/exam-render-executor.js`, `archive/engine.html`, `archive/mixed_engine.html`, `apmath/wrong_print_engine.html`, `archive/common-fast-runtime.js`, and `archive/native_print.js`.
- Test and evidence code was reviewed for coverage and for whether it exercises the production entry points. I did not rerun suites already reported by the implementation owner.

## Findings

No unresolved P0, P1, or P2 code defect remains in the reviewed worktree.

### Resolved during review

1. **[P0, resolved] Scaled trailing content could disappear or move to another physical PDF page.**
   - Original cause: `transform: scale(...)` changed paint geometry without changing Chromium's paged-flow fragmentation geometry, so a long question's choices were visible in the DOM/print-media screenshot but absent from its intended PDF page.
   - Resolution: `archive/equal-slot-engine.css` places the content wrapper out of flow inside the fixed slot; `archive/equal-slot-engine.js` uses uniform CSS `zoom` with a fixed pre-zoom content width. PDF tests now extract a per-question end marker from the expected page, checking presence and page ownership rather than only DOM text.
   - Transport parity: `archive/equal-slot-engine.js::rasterizePage` converts zoom to an equivalent transform only in html2canvas's private clone. Archive raster output, Mixer raster output, and the PCL/GDI paths in `archive/native_print.js` use that adapter, leaving the live snapshot unchanged.

2. **[P1, resolved] Archive vector printing did not fail closed for equal-slot or snapshot-preflight failures.**
   - Original cause: `archive/engine.html::safePrint` caught preparation errors but stopped vector printing only for a small image/render error allow-list. `EQUAL_SLOT_AUDIT_FAILED`, snapshot gate failures, and active-binding failures could be logged and followed by `window.print()`.
   - Resolution: Archive now records `archivePreflightComplete` only after render, asset, MathJax, snapshot, equal-slot, and readiness checks complete. Any exception before that point blocks print. Injected preflight-failure tests cover Archive, Mixer, and Wrong Clinic.

3. **[P1, resolved] Explicit strict mode could silently fall back when the new compositor or shared executor was unavailable.**
   - Original cause: optional chaining and legacy entry fallbacks could turn `equalSlots=1` into a different layout.
   - Resolution: all three entry points reject explicit strict qpp=4 rendering with `EQUAL_SLOT_ENGINE_UNAVAILABLE` when the required shared executor/core is absent. `slotEngine=legacy` remains the explicit rollback. Default special-hint documents are evaluated before requiring the new engine and therefore retain their intended legacy executor.

4. **[P1, resolved] MathJax descendant overflow was excluded from the visual footprint.**
   - Original cause: descendants inside `mjx-container` were ignored, allowing transformed or oversized rendered math ink to escape the slot without contributing to `CONTENT_OUTSIDE_SLOT`.
   - Resolution: visual MathJax descendants now contribute to the footprint while assistive MathML and non-paint SVG definitions remain excluded. The added transformed `mjx-math` browser case verifies the all-direction escape path.

5. **[P2, resolved] The initial design refit and audited twice around late QR decoration.**
   - Resolution: the three production integrations pass `deferFinalize: true`; each outer build path adds its late QR/footer material and calls `finalize` once. The public `render` API still finalizes by default for independent callers. Archive records `LAYOUT_READY` after this finalization, so readiness evidence describes the actual late-decorated layout.

## Specification assessment

**Verdict: PASS for the scoped implementation.**

The current code implements the specified replacement boundary:

- Compatible qpp=4 exams default to the shared compositor.
- `slotEngine=legacy` restores the old exam compositor.
- Documents with `wide`, `fullwidth`, `subjective-2up`, or `subjective-4up` hints retain the existing compositor by default.
- `equalSlots=1` forces strict four-slot placement and fails rather than silently changing layout when required v2 modules are unavailable.
- qpp values other than 4, solution mode, answer mode, Wrong review/grouping behavior, recipient separation, and existing source selection stay on their prior executors.
- Each v2 page has four equal physical slots, including empty slots on the last partial page, in column-major order.
- Canonical question nodes are moved directly from staging into final slots. The implementation does one batch MathJax pass, waits for fonts/images, and measures final-width content without clone-and-retypeset placement or per-question frame waits.
- Fit candidates are bounded to spacing, choice columns when unlocked, proportional image changes, combinations, and one uniform scale. The selected profile, scale, effective font, and warning/review status are serialized.
- The audit covers page/slot geometry, four-direction visual bounds, transformed content, internal overflow clipping, fixed-decoration overlap, equal slot sizes, assets, fonts, and MathJax errors. Preflight runs against the active snapshot before printing.
- Late QR/footer space is reserved at the grid level, preserving equal height across all four slots.
- Screen and print use the same physical page geometry; the print-safe zoom solution and raster clone adapter preserve complete question content across browser PDF, raster, PCL, and GDI transports.

The implementation owner's reported evidence includes 56 focused tests on `96bab5e95`, plus completed layout, parity, lifecycle, readiness, missing-asset, guard, executor-availability, PDF marker, raster, and MathJax-overflow coverage. The final performance collection is an acceptance-evidence task rather than an unresolved code finding; its report should compare measured samples on the same fixture and avoid a machine-independent speed claim, as required by the specification.

## Code quality assessment

**Verdict: PASS.**

The compositor has a narrow public API and keeps source formatting, transactional snapshots, and entry-specific page decoration in their existing owners. Selection policy is centralized and mirrors the compatibility contract. Measurements and mutations are batched. Repeated finalization is protected by a content/slot cache and resets each candidate before measurement, so scale does not compound. Audit evidence is serializable and attached to the rendered root. The raster workaround is isolated to an html2canvas clone, which prevents capture-specific changes from invalidating or contaminating a cached live snapshot.

The main residual maintenance risk is the deliberate use of CSS `zoom` for Chromium paged media and html2canvas's clone callback for raster equivalence. That choice is justified by the confirmed fragmentation defect and is covered by transport-specific output tests. Keep the per-page PDF end-marker assertion and the raster visual captures in the permanent regression set; DOM rectangles and print-media screenshots alone did not detect the original loss.

## Release recommendation

**Approve the branch for the requested user trial after the owner records the final same-fixture performance results and final serial browser-suite result in the review package.** These are the remaining evidence/packaging steps, not open implementation defects. No deployment or merge to `main` is included in this recommendation.

## Final acceptance evidence recorded by controller

Final serial suite: 39 functional scenarios plus 6 performance groups passed. Node tests: 56 passed. Quality fixture: all three engines reduced overflowing questions from 1 to 0. Final metrics are recorded in `docs/evidence/print-engine-v2-results-20260915.json`; methods and limits in `docs/evidence/print-engine-v2-20260915.md`. Both requested review evidence conditions are satisfied. No main merge/deployment/device print was performed.
