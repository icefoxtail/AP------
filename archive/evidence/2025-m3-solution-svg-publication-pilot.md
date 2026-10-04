# 2025 중3 solution SVG publication style pilot — repair evidence

- Pilot branch: `codex/2025-m3-visual-publication-style-pilot`
- Final base after rebase: `origin/main` at `0e62cc3d6baadd039c502d4822a6a2ac8fcaada3`
- Pilot began from `origin/main` at `7bd379911a81e5f25ecbbaffaa1c077e1ce3b788`; main advanced while the visual work was in progress.
- Review references: B `78145f563ee577c34af48477143abc1270f916e1`; Batch2 `e260e058a68f149caf911ad53a9e41e6f1c0b33a`
- Verification date: 2026-10-05
- Archive verification: actual Archive Engine, `mode=sol`, `qpp=4`, 390×844 viewport. The 10 SVGs were opened through their exam solution pages; this report records the loaded `<img>` width and intrinsic SVG width, not a source-only font guess.
- Responsive check: at 320×844, q21’s rendered label size fell from 12.00 px at 390 wide to 9.76 px; its SVG user-space font stayed proportional to the resized image.
- Text sizing: every label in each SVG uses one SVG user-space font size. Therefore point names, angle values, and lengths scale together with the image. Measured final range at the required 390 viewport: 11.96–12.02 CSS px (minimum is above the 11 px hard floor).
- Occupancy column: approximate primary geometry bounding box as a percentage of the SVG viewBox width × height, excluding text. For q20, q3, and q10 the owner dimensions/labels extend beyond the main geometry box and are described in the decision column.

| SVG | Prior B issue / reference pattern | Applied final owner layout | 390 viewport font | Primary geometry bbox | Final render verdict |
|---|---|---|---:|---:|---|
| `25_왕운중_2학기_기말_중3_기출/q20-solution.svg` | Geometry and owner dimensions were the Batch2 strength reference. | Kept the larger circle/chord construction and dimension-line ownership; harmonized all label sizes to the proportional SVG scale. | 11.99 px | 70% × 62% | PASS — Archive solution render visually checked. |
| `25_금당중_2학기_중간_중3_수학/q3-solution.svg` | Labels needed a consistent size and clear ownership around the 3–4–5 triangle. | Kept the triangle geometry; used offset dimension lines with end caps and the angle arc as the owner cue. | 12.01 px | 45% × 64% | PASS — dimensions and point names stay clear in the two-column mobile page. |
| `25_금당중_2학기_중간_중3_수학/q10-solution.svg` | Region value and angle needed to read from the diagram without sentence labels. | Kept `x` in its vertex wedge and `6` inside its triangle region; used one shared proportional text scale. | 12.01 px | 52% × 66% | PASS — Archive solution render visually checked. |
| `25_신흥중_2학기_중간_중3_수학/q11-solution.svg` | The two-panel diagram had repeated arcs, crowded 75° labels, and a long value too close to its side. | Removed duplicate arcs and redundant equal-angle numerals; kept one 75° label with the matching isosceles arc, and put `5+5√3` on its offset dimension line. | 12.00 px | 80% × 49% | PASS — both diagrams and owners visually checked. |
| `25_연향중_2학기_중간_중3_수학/q12-solution.svg` | Nested 120°/60° labels and the area conclusion lacked clean ownership; old arcs and an off-canvas answer box duplicated/clipped marks. | Kept one arc per angle, placed each value in its wedge, shaded △AOB lightly, and connected `16√3` to the region. Removed the clipped answer box. | 12.02 px | 71% × 81% | PASS — angles, radius, chord, and area region visually checked. |
| `25_신흥중_2학기_중간_중3_수학/q18-solution.svg` | `AD=10` / `AB=8` read like prose; `40/3` crossed the △DEC boundary; an answer panel extended off-canvas. | Kept dimension-line owners for 10 and 8; moved `40/3` inside the shaded triangle and removed the clipped panel. | 12.02 px | 70% × 65% | PASS — all lengths and the region value visually checked. |
| `25_금당중_2학기_기말_중3_기출/q9-solution.svg` | Two central angle values competed for the same small space. | Moved 60° and 35° farther apart while keeping both within their corresponding owner wedges; retained one semantic arc per angle. | 12.02 px | 76% × 87% | PASS — all five angle values visually checked. |
| `25_연향중_2학기_기말_중3_기출/q21-solution.svg` | Length values crowded the chord/radius geometry and did not sit consistently on their owners. | Set 8 on the AM offset dimension and aligned 4√5 with the CA dimension; retained short leaders for x and x+4. | 12.00 px | 57% × 77% | PASS — 390 and 320 responsive renders visually checked. |
| `25_풍덕중_2학기_중간_중3_수학/q16-solution.svg` | The circle was small in its canvas and point B was clipped below the viewBox. | Cropped the viewBox to the actual circle/labels, enlarged the diagram composition, moved B into the canvas, and separated D/C from adjacent values. | 11.96 px | 81% × 91% | PASS — clipping is closed; all points and measures are visible. |
| `25_연향중_2학기_기말_중3_기출/q22-solution.svg` | Angle and arc-span labels needed consistent owner cues without duplicate decorative arcs. | Kept the 30°/120°/60° values in their angle arcs and retained short leaders for the x/y arc spans. | 12.01 px | 84% × 70% | PASS — Archive solution render visually checked. |

## Publication rules supported by the 10 renders

1. Keep labels in SVG user coordinates and tune against a real Archive viewport. This makes text shrink with the diagram as the window narrows; fixed viewport CSS text sizes do not.
2. Keep point names, angle values, and lengths at one consistent size within an SVG. Show ownership through an angle arc, dimension line with end ticks, or short leader.
3. Put text where it belongs: angle values inside their wedge, segment values on or beside their owner dimension, and area conclusions inside or directly connected to their region.
4. Use one restrained semantic accent for derived values or conclusions; keep primary geometry dark and readable without color.

## Patterns to leave out of B

- Blind half-size label changes that leave required viewport text below the readability floor.
- Free-floating angle or length text that makes students infer its owner.
- Point labels placed against a segment, endpoint, or canvas edge.

## Patterns to leave out of Batch2

- Duplicate generic arcs on top of an already owned angle arc.
- Long condition prose inside the diagram when a short value plus geometry can show the same relation.
- Area boxes or labels outside the active viewBox, and angle values distant from their wedge.

## Final outcome

All 10 selected pilot SVGs pass the actual Archive `mode=sol` render review at 390×844. No math geometry was redesigned; edits changed annotation placement, owner marks, proportional font sizing, viewBox framing, and one light region fill. The other 48 SVGs were outside this pilot and were not changed.
