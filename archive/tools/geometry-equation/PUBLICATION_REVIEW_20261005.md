# Publication engine implementation review — 2026-10-05

## Reviewed and preserved input

- Source commit: `dde530ca1a14c08db41801b3800fbb7873ed7b21`.
- Inventory confirmed: 37 files, 28 added and 9 modified.
- Local preservation ref: `codex/geometry-publication-preserved-dde530ca`.
- Main integrated: `6def8e6632ae70b95e725ff854cf4e92664948ae`.
- Integration commit: `6849b592791187c6c29a388efe8f020ffc658031`.
- Working branch: `codex/geometry-visual-publication-v2-20261005`.
- Main was not updated. Production exams and SVG assets were not changed.

The original delivery paragraph in PUBLICATION_PROFILE.md describes the earlier
uncommitted package. Its implementation is now present in dde530ca1. The named
APMath_geometry_publication_report.md/.patch/.zip are not part of that commit;
this review used the actual committed diff and PUBLICATION_PROFILE.md.

## Structural review

The publication overlay reuses the existing semantic model, numeric geometry,
label layout and composer. The independent auditor imports only Python standard
library modules and reads final XML against separately frozen review/source/
solution inputs. It does not trust a generation witness as review authority.
Source bytes and solution bytes must match their frozen hashes.

Point names and segment endpoints have explicit identity maps. Angles validate
vertex/rays, direction, minor/reflex sweep and radius separation. Lengths are
bound to actual segments with adjacent or dimension placement. Simple polygon
areas have interior placement or region leaders. Duplicate IDs, duplicate
semantic annotations, primitive coverage and pure repeated-build determinism
are checked. This does not independently solve the source problem or prove that
the supplied review covers every relevant source condition.

## Reproduced defects and repairs

1. Windows CRLF checkout altered the frozen source/solution bytes. The Git blobs
   matched the frozen hashes; local CRLF bytes did not. Scoped .gitattributes
   keeps these fixtures LF. Raw-byte hashing was preserved. Test file I/O now
   explicitly uses UTF-8, including degree symbols.
2. Unchanged flattened text with a newly inserted superscript passed the static
   auditor for point, angle, length and area labels. The auditor now checks
   `powerSpans` character ranges independently for all labels. Undeclared
   superscripts fail; explicitly frozen ranges permit intended exponents.
3. The browser collision observer ignored stroke thickness. A 4px line or circle
   could visibly cover text while its centerline missed. It now measures screen
   stroke width and includes the painted extent in collision and clipping checks.
4. Archive evidence lacked per-label final CSS font measurements in its returned
   layout summary. `labelMeasurements` now retains ID, owner, font, real bounds
   and `finalViewportCssFontPx`. All publication text gets the font-floor check;
   equal base-size comparison remains limited to geometry annotations.
5. CI silently skipped publication checks if their implementation was missing.
   Required entrypoints now fail explicitly and publication steps are mandatory.
6. Archive integration previously selected embedded `preview=1`. The default
   qualification now uses the requested direct `mode=sol&qpp=4` route. Its actual
   URL is included in evidence. Both routes were measured during this review.

Negative regression tests were observed failing before the corresponding fixes.
No failure was converted to PASS by weakening the numeric or font threshold.

## Verification after review

| Check | Result |
| --- | --- |
| Python geometry suite | 115 PASS |
| Node geometry suite | 48 PASS |
| New independent static fixtures | 5/5 PASS |
| New deterministic fixture builds | 5/5 PASS |
| Existing v1 fixture bytes vs integrated main | 13/13 identical |
| Standalone Chromium display widths 320 / 390 | 10/10 PASS |
| Deliberately undersized 240px display | Rejected as required |
| Actual Archive mode=sol, 390x844, qpp=4 | 0/5 PASS; 5 font-floor FAIL |

Standalone minimum font sizes were 13.3333 CSS px at a 320px image and 16.25 CSS
px at a 390px image. In actual Archive, all five loaded images measured about
140.441 CSS px wide, with annotation fonts at **5.8515625 CSS px**. This is below
the 11px hard floor. SVG hashes matched loaded response bytes; MathJax, images
and layout loaded, there was no horizontal overflow, and the five failures were
font-floor failures. Individual image screenshots and the page screenshot were
visually inspected. The direct route reproduced the embedded-preview finding.

Browser: Chromium/Chrome 154.0.8037.92. Measurements of SVG text use an explicitly
identified isolated replay at the actual Archive image size, paired with the
actual page response SHA and screenshots; they are not represented as DOM access
inside the Archive img element.

Raw logs, hashes, browser captures, screenshots and baseline parity are under
`archive/_generated/geometry-visual-engine/publication-tests/` and excluded from
Git. The workflow uploads qualification artifacts even when the Archive gate
fails. The historical green run at 5a20240fb is not evidence for these changes.

## FULL REBUILD readiness

The overlay can be used for bounded candidate generation and independent static
review of its supported Euclidean diagrams. It is **not qualified for final
publication of the ten exams**. The direct mobile Archive route scales an A4
two-column sheet down; standalone SVG qualification cannot settle that display
constraint. The next integration decision must provide a readable mobile image
container or composition and then repeat the real Archive gate. Enlarging every
label or lowering the floor would defeat the geometry-first policy.

Still outside coverage: circle arc-span/arc-length owners, curved or holed regions,
automatic dense-figure reframing and dimension choice, arbitrary SVG backends,
and independent source/solution fact collection across the ten actual exams.
The five fixtures are synthetic failure-class examples, not approvals of q9,
q12, q18, q21, q22 or any real exam. Full-denominator visual review and final
asset-bound evidence remain required. Publication authorization remains false.
