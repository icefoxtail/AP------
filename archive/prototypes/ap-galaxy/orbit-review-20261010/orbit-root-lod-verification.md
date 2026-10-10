# AP Archive Orbit root ownership and marker LOD verification

Date: 2026-10-10 UTC

## Browser stress run

Used Chromium with software WebGL against the bundled Three.js world and the decoded public catalog (461 exam files). Switched from the full 39-school layout to the last school in sorted order (`school:충무고`, 1 file), expanded back to all schools, then repeated school → grade → unit regrouping three times.

Across 12 world states:

- Every active group root had a unique object reference and remained attached exactly once.
- No disposed geometry or material remained attached to a live group root.
- Every catalog file was accounted for by exactly one visible LOD: a point node or a detailed star. Duplicate LOD IDs: 0.
- Full catalog: 365 point nodes + 96 detailed stars = 461 markers. Narrowed single-file catalog: 0 point nodes + 1 detailed star = 1 marker.
- Detail-to-point LOD transition position drift: less than 0.000001 world units (Float32 point-buffer precision).
- Browser console/page errors: 0.

## Final UI smoke check

On the production prototype page, changed school/grade/unit modes, applied and cleared a grade filter, and opened the accessible school list. The catalog count changed from 461 to 139 under the selected grade and returned to 461 after clearing. Mode group counts displayed 39 schools, 6 grades, and 43 published L2 clusters. The list exposed 39 schools. At 390 × 844, document width was 390px with no horizontal overflow; no browser console errors occurred.

Captures in this folder show the final desktop galaxy, accessible list, and mobile layout. No operating interface was replaced and nothing was published.
