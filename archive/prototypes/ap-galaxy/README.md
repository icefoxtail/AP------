# AP Archive · Orbit

This prototype is a real time Three.js scene, not a background image. The star field and orbiting clusters surround one central star. Each visible paper object is one real Archive catalog exam file; the scene keeps that file identifier while the node moves between school, grade, and unit clusters. The same exam is placed once in each view.

Every filtered exam file has one individually addressable visual marker in the Three.js scene. Files outside the detail budget use lightweight points; up to 96 desktop files (54 on a narrow viewport) replace their point with a detailed star and nearby paper mesh. The on-screen counter reports the full marker count and detailed-star count. The current decoded catalog has 461 exam files and 39 schools, and the accessible index can reach every filtered entry. A filter or view change does not edit a source exam.

School view forms one small galaxy per school. Grade view gathers schools into grade clusters. Unit view places each file into one cluster using its alphabetically first published L2 tag; choosing an L2 filter moves all matching files into that tag's cluster without duplicating them. This layout choice is only for grouping and does not claim that the selected tag is the canonical primary unit. Records without a published L2 value appear in a separate group. Each file keeps its catalog ID and a hash-derived local orbit phase as views regroup the points.

Constellation lines connect detailed exam nodes only when their files share an actual published L2 value in the public Archive 2 catalog. The current decoded catalog has 2,702 records with non-empty L2 values and zero public L3 values. A shared L2 tag is a catalog association, not a claim that the items were reviewed together or passed review.

Drag to rotate, right drag to pan, and use the mouse wheel or two finger pinch to zoom. Selecting a cluster moves the camera toward it; selecting a paper node opens the existing direct exam preview route. Distant records appear as colored star points, while nearby detailed nodes reveal the paper mesh. Only nearby group labels are shown, and only the selected cluster's orbital line receives strong emphasis. The nebula uses the existing galaxy-atmosphere texture behind the moving 3D scene. The black hole is a scene object that opens the existing Generated Similar Problem Bank. This prototype does not generate questions, save papers, or assign work to students.

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
