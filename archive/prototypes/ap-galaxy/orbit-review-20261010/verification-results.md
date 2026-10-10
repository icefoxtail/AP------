# AP Archive Orbit prototype verification

Date: 2026-10-10 UTC

- Public catalog: 461 file IDs represented by individually addressable 3D point nodes.
- School grouping: 39 groups; switching school/grade/unit group modes preserves the same source IDs.
- Public L2 record count shown by the catalog: 2,702.
- World regression: filtered subset IDs matched exactly; group orbit advanced ~0.59 radians over 11 seconds after the layout transition settled.
- Pause and `prefers-reduced-motion`: group angle remained unchanged during the measured interval.
- Focus interaction: camera moved toward the selected cluster; one test measured 82.4 world units of camera position change.
- UI regression: group focus and grade filter worked; accessible list selection opened the original preview drawer and synchronized the list toggle state. Reopening the list worked.
- Responsive check: 390 × 844 viewport, document scroll width 390 px; no horizontal overflow.
- Browser console/page errors: none in the final capture run.
- No question generation or student distribution was added. The prototype reads the existing public catalog and preview path.

The browser used software WebGL for visual verification. Capture video is a short recording of the live animated WebGL scene.
