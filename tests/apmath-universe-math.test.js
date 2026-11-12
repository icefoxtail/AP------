// Mathematical and resource-lifecycle checks; no claim about WebGL visual quality.
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const base = pathToFileURL(path.join(__dirname, '../apmath/playground/universe/')).href;
const near = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`);
const distance = (a, b) => Math.hypot(...a.map((value, i) => value - b[i]));
const minus = (a, b) => a.map((value, i) => value - b[i]);
const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const norm = a => Math.hypot(...a);
const centroid = vertices => vertices.reduce((sum, vertex) => sum.map((value, i) => value + vertex[i] / vertices.length), [0, 0, 0]);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const angleAt = (p, a, b) => {
  const first = minus(a, p), second = minus(b, p);
  return Math.acos(Math.max(-1, Math.min(1, dot(first, second) / (norm(first) * norm(second)))));
};

(async () => {
  const math = await import(`${base}concept-math.js`);
  const THREE = await import(`${base}vendor/three.module.js`);
  const { createConceptObject } = await import(`${base}concept-objects.js`);
  const circleIds = Object.keys(math.CONCEPT_DEFINITIONS).filter(id => math.CONCEPT_DEFINITIONS[id].family === 'circle');
  const dualIds = Object.keys(math.CONCEPT_DEFINITIONS).filter(id => math.CONCEPT_DEFINITIONS[id].family === 'dual');
  let circleStates = 0;
  function checkCircle(state) {
    const p = state.points;
    for (const point of Object.values(p)) {
      assert.ok(point.every(Number.isFinite)); near(point[2], 0);
    }
    if (state.id === 'two-tangents') {
      assert.ok(norm(p.P) > 1);
      near(norm(p.A), 1); near(norm(p.B), 1);
      near(dot(p.A, minus(p.P, p.A)), 0); near(dot(p.B, minus(p.P, p.B)), 0);
      near(distance(p.P, p.A), distance(p.P, p.B));
      near(distance(p.P, p.A) ** 2, norm(p.P) ** 2 - 1);
    } else if (state.id === 'chord-bisector') {
      near(norm(p.A), 1); near(norm(p.B), 1);
      near(distance(p.A, p.M), distance(p.M, p.B));
      near(dot(minus(p.O, p.M), minus(p.B, p.A)), 0);
      near(distance(p.M, centroid([p.A, p.B])), 0);
      assert.ok(distance(p.O, p.M) > 0.05);
    } else if (state.id === 'radius-tangent') {
      near(norm(p.T), 1);
      near(dot(p.T, minus(p.R, p.L)), 0);
      near(distance(centroid([p.L, p.R]), p.T), 0);
      near(angleAt(p.T, p.O, p.R), Math.PI / 2);
    } else if (state.id === 'same-arc' || state.id === 'central-inscribed') {
      const minor = state.arcs.AB.end - state.arcs.AB.start;
      assert.ok(minor > 0 && minor < Math.PI);
      near(angleAt(p.O, p.A, p.B), minor);
      for (const key of ['P', 'Q'].filter(key => p[key])) {
        near(norm(p[key]), 1);
        assert.ok(p[key][0] < 0, 'Angle vertex must remain on the complementary major arc');
        near(angleAt(p[key], p.A, p.B), minor / 2);
        near(Math.abs(state.arcs[key].end - state.arcs[key].start), minor / 2);
      }
      if (p.Q) near(angleAt(p.P, p.A, p.B), angleAt(p.Q, p.A, p.B));
      else near(state.arcs.O.end - state.arcs.O.start, 2 * angleAt(p.P, p.A, p.B));
    } else if (state.id === 'chord-arc') {
      near(distance(p.A, p.B), distance(p.C, p.D));
      for (const [key, first, second] of [['AB', p.A, p.B], ['CD', p.C, p.D]]) {
        const arc = state.arcs[key];
        assert.ok(arc.end - arc.start > 0 && arc.end - arc.start < Math.PI);
        near(distance(first, [Math.cos(arc.start), Math.sin(arc.start), 0]), 0);
        near(distance(second, [Math.cos(arc.end), Math.sin(arc.end), 0]), 0);
      }
      near(state.arcs.AB.end - state.arcs.AB.start, state.arcs.CD.end - state.arcs.CD.start);
    }
    circleStates++;
  }

  for (const id of circleIds) {
    const state = math.createCircleState(id), pointsIdentity = state.points, arcIdentity = state.arcs;
    for (let step = 0; step <= 80; step++) checkCircle(math.updateCircleState(state, step / 10, { detail: true }));
    const held = JSON.stringify(state);
    math.updateCircleState(state, 1000, { detail: true }); assert.equal(JSON.stringify(state), held, 'Completed detail must hold');
    for (let step = 0; step <= 24; step++) checkCircle(math.updateCircleState(state, step * 7, { detail: false }));
    math.updateCircleState(state, 0, { loop: true });
    const loopStart = JSON.parse(JSON.stringify(state));
    for (let step = 0; step <= 80; step++) checkCircle(math.updateCircleState(state, step / 10, { loop: true }));
    for (const [key, point] of Object.entries(state.points)) point.forEach((value, axis) => near(value, loopStart.points[key][axis], 1e-10));
    math.updateCircleState(state, 2, { loop: true });
    assert.notDeepEqual(state.points, loopStart.points, `Autoplay ${id} must change its actual mathematical parameters`);
    checkCircle(math.updateCircleState(state, 0, { detail: true, reducedMotion: true }));
    const reduced = JSON.stringify(state);
    checkCircle(math.updateCircleState(state, 1000, { detail: true, reducedMotion: true }));
    assert.equal(JSON.stringify(state), reduced, 'Reduced motion must be static');
    assert.equal(state.points, pointsIdentity); assert.equal(state.arcs, arcIdentity);
  }
  const endpoints = [[0.5, -Math.sqrt(3) / 2, 0], [0.5, Math.sqrt(3) / 2, 0]];
  near(angleAt([-1, 0, 0], ...endpoints), Math.PI / 3);
  near(angleAt([1, 0, 0], ...endpoints), 2 * Math.PI / 3); // Opposite-arc counterexample.

  for (const [id, counts, shrink] of [
    ['cube-octahedron', [8, 12, 6], 1 / 3],
    ['dodecahedron-icosahedron', [20, 30, 12], (5 + 2 * Math.sqrt(5)) / 15],
  ]) {
    const { primal, dual } = math.createDualPair(id);
    assert.deepEqual([primal.vertices.length, primal.edges.length, primal.faces.length], counts);
    assert.deepEqual([dual.vertices.length, dual.edges.length, dual.faces.length], [...counts].reverse());
    for (const poly of [primal, dual]) {
      assert.equal(poly.vertices.length - poly.edges.length + poly.faces.length, 2);
      poly.edgeFaces.forEach(faces => assert.equal(faces.length, 2));
      const lengths = poly.edges.map(([a, b]) => distance(poly.vertices[a], poly.vertices[b]));
      near(Math.max(...lengths), Math.min(...lengths));
      for (const face of poly.faces) {
        const first = poly.vertices[face[0]], normal = cross(minus(poly.vertices[face[1]], first), minus(poly.vertices[face[2]], first));
        assert.ok(dot(normal, first) > 0, 'Polygon winding must face outwards');
        face.forEach(index => near(dot(normal, minus(poly.vertices[index], first)), 0));
      }
    }
    primal.faces.forEach((face, index) => near(distance(centroid(face.map(vertex => primal.vertices[vertex])), dual.vertices[index]), 0));
    const dualEdges = new Set(dual.edges.map(edge => edge.join(',')));
    primal.edgeFaces.forEach(incident => assert.ok(dualEdges.has([...incident].sort((a, b) => a - b).join(','))));
    primal.vertices.forEach((vertex, index) => {
      const incident = primal.faces.flatMap((face, faceIndex) => face.includes(index) ? [faceIndex] : []);
      assert.deepEqual([...dual.faces[index]].sort((a, b) => a - b), incident);
    });
    const second = math.faceCentroidDual(dual);
    second.vertices.forEach((vertex, index) => near(distance(vertex, primal.vertices[index].map(value => value * shrink)), 0));
    if (id === 'dodecahedron-icosahedron') near(norm(dual.vertices[0]), Math.sqrt((5 + 2 * Math.sqrt(5)) / 15));
  }

  function resourcesOf(group) {
    const geometries = new Set(), materials = new Set(), instances = new Set();
    group.traverse(node => {
      if (node.geometry) geometries.add(node.geometry);
      if (node.material) (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => materials.add(material));
      if (node.isInstancedMesh) instances.add(node);
    });
    return { geometries, materials, instances };
  }
  function findSegment(group, id) {
    let result;
    group.traverse(node => {
      const index = node.userData.segmentIds?.indexOf(id);
      if (index !== undefined && index >= 0) result = { mesh: node, index };
    });
    assert.ok(result, `Missing actual segment ${id}`);
    const matrix = new THREE.Matrix4(); result.mesh.getMatrixAt(result.index, matrix);
    matrix.premultiply(result.mesh.matrixWorld);
    return [new THREE.Vector3(0, -0.5, 0).applyMatrix4(matrix).toArray(), new THREE.Vector3(0, 0.5, 0).applyMatrix4(matrix).toArray()];
  }
  function maxRenderedRadius(group) {
    group.updateMatrixWorld(true);
    const vector = new THREE.Vector3(), matrix = new THREE.Matrix4(); let max = 0;
    group.traverse(node => {
      if (!node.visible || !node.geometry?.attributes.position) return;
      const positions = node.geometry.attributes.position, count = node.isInstancedMesh ? node.count : 1;
      for (let instance = 0; instance < count; instance++) {
        if (node.isInstancedMesh) { node.getMatrixAt(instance, matrix); matrix.premultiply(node.matrixWorld); }
        else matrix.copy(node.matrixWorld);
        for (let i = 0; i < positions.count; i++) max = Math.max(max, vector.fromBufferAttribute(positions, i).applyMatrix4(matrix).length());
      }
    });
    return max;
  }
  function snapshotGeometry(group) {
    const state = [];
    group.traverse(node => {
      if (node.geometry?.attributes.position) state.push([...node.geometry.attributes.position.array]);
      if (node.instanceMatrix) state.push([...node.instanceMatrix.array]);
      if (node.isMesh) state.push(node.visible, node.position.toArray(), node.scale.toArray(), node.material.opacity);
      state.push(node.quaternion.toArray());
    });
    return JSON.stringify(state);
  }

  let factories = 0, maxGlyphRadius = 0;
  for (const isMobile of [false, true]) for (const id of [...circleIds, ...dualIds]) {
    const object = createConceptObject({ id, isMobile }); factories++;
    assert.equal(object.radius, 1); assert.equal(object.metadata.id, id);
    assert.ok(object.metadata.label && object.metadata.summary);
    const initialResources = resourcesOf(object.group);
    assert.ok([...initialResources.materials].some(material => material.isMeshPhysicalMaterial));
    if (isMobile) initialResources.materials.forEach(material => assert.ok(!material.transmission));
    for (const time of [0, 0.9, 1.8, 3.1, 4.2, 6, 8]) {
      object.update(time, { detail: true }); object.group.updateMatrixWorld(true);
      maxGlyphRadius = Math.max(maxGlyphRadius, maxRenderedRadius(object.group));
      const current = resourcesOf(object.group);
      for (const key of ['geometries', 'materials', 'instances']) assert.deepEqual(current[key], initialResources[key], 'Updates must reuse owned resources');
      if (id === 'two-tangents') {
        const first = findSegment(object.group, 'PA-context'), second = findSegment(object.group, 'PB-context');
        near(distance(...first), distance(...second), 1e-6);
        near(distance(first[0], second[0]), 0, 1e-6);
        const radius = findSegment(object.group, 'OA-context');
        near(dot(minus(first[0], first[1]), minus(radius[1], radius[0])), 0, 1e-6);
      }
      if (id === 'chord-bisector') {
        const chord = findSegment(object.group, 'AB'), perpendicular = findSegment(object.group, 'OM-context');
        near(distance(centroid(chord), perpendicular[1]), 0, 1e-6);
      }
      if (id === 'radius-tangent') {
        const radius = findSegment(object.group, 'OT'), tangent = findSegment(object.group, 'LR-context');
        near(distance(radius[1], centroid(tangent)), 0, 1e-6);
        near(dot(minus(radius[1], radius[0]), minus(tangent[1], tangent[0])), 0, 1e-6);
      }
      if (id === 'same-arc' || id === 'central-inscribed') {
        const first = findSegment(object.group, 'PA'), second = findSegment(object.group, 'PB');
        near(distance(first[0], second[0]), 0, 1e-6);
        near(angleAt(first[0], first[1], second[1]), Math.PI / 3, 1e-6);
        const otherFirst = findSegment(object.group, id === 'same-arc' ? 'QA' : 'OA');
        const otherSecond = findSegment(object.group, id === 'same-arc' ? 'QB' : 'OB');
        near(distance(first[1], otherFirst[1]), 0, 1e-6);
        near(distance(second[1], otherSecond[1]), 0, 1e-6);
        near(angleAt(otherFirst[0], otherFirst[1], otherSecond[1]), id === 'same-arc' ? Math.PI / 3 : 2 * Math.PI / 3, 1e-6);
      }
      if (id === 'chord-arc') {
        const first = findSegment(object.group, 'AB'), second = findSegment(object.group, 'CD');
        near(distance(...first), distance(...second), 1e-6);
        // Average a tube end cross-section, excluding its duplicate closing vertex.
        for (const [arcId, endpoints] of [['AB', first], ['CD', second]]) {
          const mesh = object.group.getObjectByName(`arc-${arcId}`), positions = mesh.geometry.attributes.position;
          const around = isMobile ? 5 : 6, along = isMobile ? 28 : 48;
          for (const end of [0, 1]) {
            const vertices = [];
            for (let j = 0; j < around; j++) vertices.push(new THREE.Vector3().fromBufferAttribute(positions, end * along * (around + 1) + j).applyMatrix4(mesh.matrixWorld).toArray());
            near(distance(centroid(vertices), endpoints[end]), 0, 1e-6);
          }
        }
      }
      if (dualIds.includes(id) && time > 0.8 && time < 3.2) {
        const highlight = object.group.getObjectByName('corresponding-face'), point = object.group.getObjectByName('corresponding-point');
        assert.ok(highlight.visible && point.visible);
        const pair = math.createDualPair(id), face = pair.primal.faces[point.userData.primalFaceIndex];
        near(distance(centroid(face.map(index => pair.primal.vertices[index])), point.position.toArray()), 0);
      }
      if (dualIds.includes(id) && time === 8) {
        const pair = math.createDualPair(id), extent = math.CONCEPT_DEFINITIONS[id].extent;
        for (const [name, poly] of [['primal', pair.primal], ['dual', pair.dual]]) poly.edges.forEach(([a, b], index) => {
          const actual = findSegment(object.group, `${name}-${index}`);
          near(distance(actual[0], poly.vertices[a].map(value => value / extent)), 0, 1e-6);
          near(distance(actual[1], poly.vertices[b].map(value => value / extent)), 0, 1e-6);
        });
      }
    }
    const held = snapshotGeometry(object.group); object.update(1000, { detail: true });
    assert.equal(snapshotGeometry(object.group), held, 'Completed physical glyph must hold');
    object.update(0.35, { loop: true });
    const moving = snapshotGeometry(object.group);
    object.update(1.35, { loop: true });
    assert.notEqual(snapshotGeometry(object.group), moving, `Looping physical glyph ${id} must visibly change without detail selection`);
    maxGlyphRadius = Math.max(maxGlyphRadius, maxRenderedRadius(object.group));
    for (const key of ['geometries', 'materials', 'instances']) assert.deepEqual(resourcesOf(object.group)[key], initialResources[key], 'Autoplay also reuses all owned resources');
    if (dualIds.includes(id)) {
      for (const [time, reverse] of [[1.35, false], [5.35, true]]) {
        object.update(time, { loop: true });
        const pair = math.createDualPair(id), point = object.group.getObjectByName('corresponding-point');
        const index = point.userData[reverse ? 'primalVertexIndex' : 'primalFaceIndex'];
        assert.ok(Number.isInteger(index));
        near(distance(point.position.toArray(), (reverse ? pair.primal : pair.dual).vertices[index]), 0);
        const face = (reverse ? pair.dual : pair.primal).faces[index];
        if (!reverse) near(distance(centroid(face.map(vertex => pair.primal.vertices[vertex])), point.position.toArray()), 0);
        else assert.deepEqual([...face].sort((a, b) => a - b), pair.primal.faces.flatMap((f, i) => f.includes(index) ? [i] : []));
      }
    }
    object.group.position.set(2, 3, 4); object.group.rotation.set(0.3, -0.6, 0.2);
    const parentPosition = object.group.position.toArray(), parentRotation = object.group.quaternion.toArray();
    object.update(1, { detail: false });
    assert.deepEqual(object.group.position.toArray(), parentPosition); assert.deepEqual(object.group.quaternion.toArray(), parentRotation);
    const disposed = new Map();
    for (const key of ['geometries', 'materials', 'instances']) initialResources[key].forEach(resource => {
      disposed.set(resource, 0); resource.addEventListener('dispose', () => disposed.set(resource, disposed.get(resource) + 1));
    });
    object.dispose(); object.dispose(); object.update(2, { detail: true });
    assert.equal(object.group.children.length, 0);
    disposed.forEach(count => assert.equal(count, 1, 'Owned resource must be disposed exactly once'));
  }
  assert.ok(maxGlyphRadius <= 1 + 1e-6, `Actual tube/point geometry escaped radius=1: ${maxGlyphRadius}`);
  assert.throws(() => createConceptObject({ id: 'missing-concept' }), RangeError);
  console.log(`AP Math Universe: ${circleStates} circle states, 2 dual topologies, ${factories} physical factories and disposal verified; maximum glyph radius ${maxGlyphRadius.toFixed(6)}. WebGL visual QA is separate.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
