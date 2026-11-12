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
- Body captions and the lower explanatory copy are omitted. The shapes remain
  directly tappable, with named transparent targets for keyboard access.
- All six circle relationships and both dual pairs animate from the opening
  universe, throughout their galleries and in close observation. Circle
  parameters repeat smoothly on an eight-second cycle with the complete
  relationship visible; dual pairs move together and alternate the two
  face/vertex correspondences. Selecting changes the view, not playback.
- Global pause freezes automatic celestial and concept motion. Detail pause,
  replay and scrubbing remain available; an explicit detail replay may run while
  the universe is paused, and a subsequent global pause stops it again.
  Reduced-motion users start at a completed static relationship. Explicit replay
  or global play opts into the corresponding motion, while changing the system
  preference back to normal restores automatic playback unless explicitly paused.
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
| `exploration.js` | Route, camera ownership/following, companion clocks, picking and projected accessible targets |
| `../index.html`, `universe.css` | Accessible controls, URL/history and laboratory navigation |

The eight concept objects are created once and retained across navigation. Only
visible geometry is updated, using existing buffers; hidden companions retain
their clock phase. All resources are disposed when the universe is destroyed.
Translation anchors preserve orbital motion without passing the host's
self-rotation to the satellites. The existing central sector also reuses a
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
