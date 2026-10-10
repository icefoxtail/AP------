# AP Archive · Orbit

This prototype is a real time Three.js scene, not a background image. The star field and orbiting clusters surround one central star. Each visible paper object is one real Archive catalog exam file; the scene keeps that file identifier while the node moves between school, grade, and unit clusters. The same exam is placed once in each view.

The opening view shows up to twelve clusters and up to 96 exam nodes on desktop (54 on a narrow viewport). These are real catalog entries, selected by group size and then spread across the visible groups. The current decoded catalog has 461 exam files and 39 schools. The accessible index can reach all filtered entries. A filter or view change does not edit a source exam.

School view forms one small galaxy per school. Grade view gathers schools into grade clusters. Unit view places each file into one cluster using its alphabetically first published L2 tag; choosing an L2 filter moves all matching files into that tag's cluster without duplicating them. This layout choice is only for grouping and does not claim that the selected tag is the canonical primary unit. Records without a published L2 value appear in a separate group.

Constellation lines connect visible exam nodes only when their files share an actual published L2 value in the public Archive 2 catalog. The current decoded catalog has 2,702 records with non-empty L2 values and zero public L3 values. A shared L2 tag is a catalog association, not a claim that the items were reviewed together or passed review.

Drag to rotate, right drag to pan, and use the mouse wheel or two finger pinch to zoom. Selecting a cluster moves the camera toward it; selecting a paper node opens the existing direct exam preview route. The black hole is a scene object that opens the existing Generated Similar Problem Bank. This prototype does not generate questions, save papers, or assign work to students.

## Preview locally

Serve the repository root, then open the prototype path:

    python3 -m http.server 4173
    http://localhost:4173/archive/prototypes/ap-galaxy/

## Rebuild the local Three.js bundle

Three.js version 0.186.1 and esbuild version 0.28.2 are exact pinned dependencies in this directory. The checked-in assets/orbital-world.js bundle makes the published page self-contained and does not load JavaScript from a CDN.

    npm ci --prefix archive/prototypes/ap-galaxy
    npm run build --prefix archive/prototypes/ap-galaxy

The Three.js license is included in vendor/THREE-LICENSE.txt. Runtime movement starts automatically unless the device requests reduced motion. A visible control pauses and resumes the orbital simulation. Rendering is capped at 30fps on desktop and 24fps on narrow viewports to bound rendering work; these are caps, not measured performance claims. The accessible list view remains available alongside the 3D scene.

Browser review captures for desktop and 390px mobile are in `orbit-review-20261010/`, including a short interaction recording.
