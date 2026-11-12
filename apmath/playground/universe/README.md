# Universe concept companions

The original twelve representative bodies, backdrop and lab entrance remain the
entry scene. Small physical companions around `circle-sector` and `polyhedra`
open local concept galleries. Selecting a body explores it; **실험실 입장** remains
the explicit link to the existing laboratory hub.

## Interaction

- Circle: six selectable 3D diagrams for two tangents, a chord bisector, a
  perpendicular radius/tangent, equal inscribed angles, central/inscribed angles,
  and equal chords/arcs.
- Polyhedra: cube/octahedron and dodecahedron/icosahedron, constructed from real
  polygon-face centroids and edge adjacency.
- Drag/orbit and wheel/pinch retain OrbitControls. A short tap selects; a drag,
  multi-pointer gesture or blank tap does not reset the route.
- A concept plays one eight-second mathematical sequence and holds. Replay,
  pause and scrubbing are independent of ambient motion. Reduced-motion users
  start at the completed relationship and can explicitly replay it.
- Close observation shows the selected relationship against the sky; the host
  and other companions return in place when going back to the galaxy. Dual
  polyhedra use one shared oblique orientation so front and back vertices are
  distinct without changing the face/vertex correspondence.
- Parent/back and Universe controls restore viewing poses. Browser history and
  the existing grade hash/student context remain supported. `?celestial=circle`
  is accepted as the old circle identifier.

## Ownership

| Module | Responsibility |
| --- | --- |
| `scene.js` | Existing world, renderer, translation anchors, frame lifecycle |
| `math-motion.js` | Original orbital motion; separate self-rotation group; capped active clock |
| `concept-registry.js` | Stable concept IDs, bounds, compact/wide/portrait positions |
| `concept-math.js` | Exact circle constraints and polygon dual topology |
| `concept-objects.js` | Real Three.js geometry, local mathematical timelines, resource disposal |
| `exploration.js` | Route, camera ownership/following, lazy family objects, picking and projected labels |
| `../index.html`, `universe.css` | Accessible controls, captions, URL/history and laboratory navigation |

Full concept geometry is created only for an explored family and disposed after
it closes (on the first return frame under reduced motion). Preview geometry is complete and static; only the selected concept is
updated each frame. Translation anchors preserve orbital motion without passing
the host's self-rotation to the satellites. The existing central sector reuses a
single dynamic vertex buffer instead of allocating geometry on every frame.

## Verification

From the repository root:

```sh
node tests/apmath-universe-math.test.js
node tests/apmath-universe-exploration.test.js
```

These verify mathematical constraints, rendered geometry structure, resource
ownership, camera/route transitions, motion preferences and the simulation clock.
They do not certify WebGL appearance or real DOM/touch behavior.

The **AP Math Universe exploration** PR workflow runs
`tools/check-universe-browser.mjs` against exact candidate and baseline commits.
Its artifact contains actual PC/mobile Chromium software-WebGL screenshots,
journey results, resource round trips and source hashes. Screenshots require
visual review; software-renderer timing is not a physical-device FPS benchmark.
The diagnostic API exists only when `?universeTest=1` is explicitly supplied.
Screenshots and logs are workflow artifacts, not repository source.

Publishing uses the existing Pages workflow. This feature does not change
Archive data, registration writers, or the deployment release gate.
