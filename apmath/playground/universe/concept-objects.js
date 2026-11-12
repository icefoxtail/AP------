// Physical mathematical satellites. All resources belong to the returned object.
// Parent transforms/camera orientation belong to the universe controller.
import * as THREE from './vendor/three.module.js';
import { MATH_COLORS as COLORS } from './math-objects.js';
import { CONCEPT_DEFINITIONS, createCircleState, updateCircleState, createDualPair, clamp, smoothstep } from './concept-math.js';

function createResources() {
  const geometries = new Set(), materials = new Set(), instances = new Set();
  let disposed = false;
  return {
    geometry(value) { geometries.add(value); return value; },
    material(value) { materials.add(value); return value; },
    instance(value) { instances.add(value); return value; },
    dispose() {
      if (disposed) return;
      disposed = true;
      instances.forEach(value => value.dispose());
      geometries.forEach(value => value.dispose());
      materials.forEach(value => value.dispose());
      instances.clear(); geometries.clear(); materials.clear();
    },
  };
}

function luminousMaterial(resources, color, opacity = 0.95) {
  return resources.material(new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 0.44,
    metalness: 0.35, roughness: 0.25,
    transparent: true, opacity, depthWrite: false,
  }));
}

function glassMaterial(resources, color, isMobile, opacity) {
  return resources.material(new THREE.MeshPhysicalMaterial({
    color, emissive: color, emissiveIntensity: 0.045,
    metalness: 0.08, roughness: 0.2, clearcoat: 0.7,
    transmission: isMobile ? 0 : 0.12, thickness: 0.08, ior: 1.35,
    transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide,
  }));
}

function segmentBatch(parent, resources, geometry, material, ids) {
  const mesh = resources.instance(new THREE.InstancedMesh(geometry, material, ids.length));
  mesh.name = `segments-${ids.join('-')}`;
  mesh.userData.segmentIds = [...ids];
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2.2);
  parent.add(mesh);
  const middle = new THREE.Vector3(), direction = new THREE.Vector3(), size = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0), rotation = new THREE.Quaternion(), matrix = new THREE.Matrix4();
  return {
    mesh,
    set(index, start, end, radius = 0.011, fraction = 1) {
      const dx = (end[0] - start[0]) * fraction, dy = (end[1] - start[1]) * fraction, dz = (end[2] - start[2]) * fraction;
      const distance = Math.hypot(dx, dy, dz);
      middle.set(start[0] + dx / 2, start[1] + dy / 2, start[2] + dz / 2);
      if (distance > 1e-10) rotation.setFromUnitVectors(up, direction.set(dx / distance, dy / distance, dz / distance));
      else rotation.identity();
      size.set(radius, distance, radius);
      mesh.setMatrixAt(index, matrix.compose(middle, rotation, size));
    },
    finish() { mesh.instanceMatrix.needsUpdate = true; },
  };
}

function pointBatch(parent, resources, geometry, ids, colors) {
  const material = luminousMaterial(resources, 0xffffff);
  material.emissive.setHex(COLORS.warmIvory);
  material.emissiveIntensity = 0.25;
  const mesh = resources.instance(new THREE.InstancedMesh(geometry, material, ids.length));
  mesh.name = `points-${ids.join('-')}`;
  mesh.userData.pointIds = [...ids];
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2.2);
  ids.forEach((id, index) => mesh.setColorAt(index, new THREE.Color(colors[index] || COLORS.warmIvory)));
  parent.add(mesh);
  const position = new THREE.Vector3(), size = new THREE.Vector3(), rotation = new THREE.Quaternion(), matrix = new THREE.Matrix4();
  return {
    mesh,
    set(index, point, radius = 0.035) {
      position.fromArray(point); size.setScalar(radius);
      mesh.setMatrixAt(index, matrix.compose(position, rotation, size));
    },
    finish() { mesh.instanceMatrix.needsUpdate = true; },
  };
}

// A true tubular arc with fixed topology. Only existing position/normal arrays change.
function tubeArc(parent, resources, material, isMobile, name, thickness = 0.012) {
  const along = isMobile ? 28 : 48, around = isMobile ? 5 : 6;
  const positions = new Float32Array((along + 1) * (around + 1) * 3);
  const normals = new Float32Array(positions.length), indices = [];
  for (let i = 0; i < along; i++) for (let j = 0; j < around; j++) {
    const a = i * (around + 1) + j, b = a + around + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const geometry = resources.geometry(new THREE.BufferGeometry());
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setIndex(indices);
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2.2);
  const mesh = new THREE.Mesh(geometry, material); mesh.name = name; mesh.frustumCulled = false;
  parent.add(mesh);
  let previousStart = NaN, previousEnd = NaN, previousX = NaN, previousY = NaN;
  return {
    mesh,
    update(arc) {
      const center = arc.center;
      if (previousStart === arc.start && previousEnd === arc.end && previousX === center[0] && previousY === center[1]) return;
      previousStart = arc.start; previousEnd = arc.end; previousX = center[0]; previousY = center[1];
      let offset = 0;
      for (let i = 0; i <= along; i++) {
        const angle = arc.start + (arc.end - arc.start) * i / along, x = Math.cos(angle), y = Math.sin(angle);
        for (let j = 0; j <= around; j++) {
          const side = j * Math.PI * 2 / around, radial = Math.cos(side), depth = Math.sin(side);
          positions[offset] = center[0] + (arc.radius + thickness * radial) * x;
          normals[offset++] = radial * x;
          positions[offset] = center[1] + (arc.radius + thickness * radial) * y;
          normals[offset++] = radial * y;
          positions[offset] = center[2] + thickness * depth;
          normals[offset++] = depth;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.normal.needsUpdate = true;
    },
  };
}

function createMarkers() {
  const a = [0, 0, 0], b = [0, 0, 0], c = [0, 0, 0];
  return {
    rightAngle(batch, index, vertex, first, second, size = 0.115) {
      const ux = first[0] - vertex[0], uy = first[1] - vertex[1], ul = Math.hypot(ux, uy);
      const vx = second[0] - vertex[0], vy = second[1] - vertex[1], vl = Math.hypot(vx, vy);
      a[0] = vertex[0] + size * ux / ul; a[1] = vertex[1] + size * uy / ul;
      c[0] = vertex[0] + size * vx / vl; c[1] = vertex[1] + size * vy / vl;
      b[0] = a[0] + c[0] - vertex[0]; b[1] = a[1] + c[1] - vertex[1];
      batch.set(index, a, b, 0.008); batch.set(index + 1, b, c, 0.008);
    },
    tick(batch, index, first, second, fraction = 0.5, size = 0.045) {
      const dx = second[0] - first[0], dy = second[1] - first[1], distance = Math.hypot(dx, dy);
      const x = first[0] + fraction * dx, y = first[1] + fraction * dy;
      a[0] = x - size * dy / distance; a[1] = y + size * dx / distance;
      b[0] = x + size * dy / distance; b[1] = y - size * dx / distance;
      batch.set(index, a, b, 0.009);
    },
  };
}

function createCircleObject(id, parent, resources, isMobile, segmentGeometry, sphereGeometry) {
  const state = createCircleState(id), p = state.points;
  const ringMaterial = luminousMaterial(resources, COLORS.emerald, 0.9);
  const circle = new THREE.Mesh(resources.geometry(new THREE.TorusGeometry(1, 0.014, isMobile ? 5 : 7, isMobile ? 64 : 96)), ringMaterial);
  circle.name = 'circle-boundary'; parent.add(circle);
  const disk = new THREE.Mesh(resources.geometry(new THREE.CylinderGeometry(0.992, 0.992, 0.014, isMobile ? 40 : 64)), glassMaterial(resources, COLORS.deepPlum, isMobile, 0.12));
  disk.name = 'circle-glass'; disk.rotation.x = Math.PI / 2; parent.add(disk);
  const ids = Object.keys(p).filter(key => key !== 'L' && key !== 'R');
  const dots = pointBatch(parent, resources, sphereGeometry, ids, ids.map(key => key === 'O' ? COLORS.emerald : key === 'P' || key === 'M' ? COLORS.champagneGold : key === 'Q' ? COLORS.softAmethyst : COLORS.warmIvory));
  const batches = [], arcs = [];
  const batch = (names, color, opacity = 0.9) => {
    const result = segmentBatch(parent, resources, segmentGeometry, luminousMaterial(resources, color, opacity), names);
    batches.push(result); return result;
  };
  const arc = (key, color, thickness) => {
    const result = tubeArc(parent, resources, luminousMaterial(resources, color), isMobile, `arc-${key}`, thickness);
    arcs.push({ key, result }); return result;
  };
  const marks = createMarkers();
  let updateSegments;
  if (id === 'two-tangents') {
    const base = batch(['PA-context', 'PB-context'], COLORS.champagneGold, 0.25);
    const tangents = batch(['PA', 'PB'], COLORS.champagneGold);
    const radialBase = batch(['OA-context', 'OB-context'], COLORS.emerald, 0.22);
    const radii = batch(['OA', 'OB'], COLORS.emerald);
    const right = batch(['right-A-1', 'right-A-2', 'right-B-1', 'right-B-2'], COLORS.warmIvory);
    const ticks = batch(['equal-PA', 'equal-PB'], COLORS.warmIvory);
    updateSegments = phase => {
      const reveal = smoothstep(phase / 1.2), radiusReveal = smoothstep((phase - 1.3) / 1.4);
      base.set(0, p.P, p.A); base.set(1, p.P, p.B);
      tangents.set(0, p.P, p.A, 0.013, reveal); tangents.set(1, p.P, p.B, 0.013, reveal);
      radialBase.set(0, p.O, p.A); radialBase.set(1, p.O, p.B);
      radii.set(0, p.O, p.A, 0.009, radiusReveal); radii.set(1, p.O, p.B, 0.009, radiusReveal);
      marks.rightAngle(right, 0, p.A, p.O, p.P); marks.rightAngle(right, 2, p.B, p.O, p.P);
      right.mesh.material.opacity = 0.22 + 0.7 * radiusReveal;
      marks.tick(ticks, 0, p.A, p.P); marks.tick(ticks, 1, p.B, p.P);
      ticks.mesh.material.opacity = 0.2 + 0.75 * smoothstep((phase - 3) / 1.1);
    };
  } else if (id === 'chord-bisector') {
    const chord = batch(['AB'], COLORS.emerald), base = batch(['OM-context'], COLORS.champagneGold, 0.25);
    const perpendicular = batch(['OM'], COLORS.champagneGold), right = batch(['right-M-1', 'right-M-2'], COLORS.warmIvory);
    const ticks = batch(['equal-AM', 'equal-MB'], COLORS.warmIvory);
    updateSegments = phase => {
      chord.set(0, p.A, p.B); base.set(0, p.O, p.M); perpendicular.set(0, p.O, p.M, 0.012, smoothstep(phase / 1.4));
      marks.rightAngle(right, 0, p.M, p.O, p.B);
      right.mesh.material.opacity = 0.25 + 0.65 * smoothstep((phase - 1) / 1.2);
      marks.tick(ticks, 0, p.A, p.M); marks.tick(ticks, 1, p.M, p.B);
      ticks.mesh.material.opacity = 0.25 + 0.7 * smoothstep((phase - 2.5) / 1.2);
    };
  } else if (id === 'radius-tangent') {
    const radius = batch(['OT'], COLORS.emerald), base = batch(['LR-context'], COLORS.champagneGold, 0.25);
    const tangent = batch(['LR'], COLORS.champagneGold), right = batch(['right-T-1', 'right-T-2'], COLORS.warmIvory);
    updateSegments = phase => {
      radius.set(0, p.O, p.T); base.set(0, p.L, p.R); tangent.set(0, p.L, p.R, 0.013, smoothstep(phase / 1.2));
      marks.rightAngle(right, 0, p.T, p.O, p.R);
      right.mesh.material.opacity = 0.25 + 0.7 * smoothstep(phase / 1.5);
    };
  } else if (id === 'same-arc' || id === 'central-inscribed') {
    const first = batch(['PA', 'PB'], COLORS.emerald);
    const second = id === 'same-arc' ? batch(['QA', 'QB'], COLORS.softAmethyst) : batch(['OA', 'OB'], COLORS.champagneGold);
    arc('AB', COLORS.champagneGold, 0.021); arc('P', COLORS.emerald, 0.011);
    if (id === 'same-arc') arc('Q', COLORS.softAmethyst, 0.011);
    else arc('O', COLORS.champagneGold, 0.013);
    updateSegments = phase => {
      first.set(0, p.P, p.A); first.set(1, p.P, p.B);
      second.set(0, p.Q || p.O, p.A); second.set(1, p.Q || p.O, p.B);
      first.mesh.material.opacity = 0.3 + 0.65 * smoothstep(phase / 1.1);
      second.mesh.material.opacity = 0.3 + 0.65 * smoothstep((phase - 1) / 1.3);
    };
  } else {
    const first = batch(['AB'], COLORS.emerald), second = batch(['CD'], COLORS.softAmethyst), ticks = batch(['equal-AB', 'equal-CD'], COLORS.warmIvory);
    arc('AB', COLORS.emerald, 0.021); arc('CD', COLORS.softAmethyst, 0.021);
    updateSegments = phase => {
      first.set(0, p.A, p.B); second.set(0, p.C, p.D);
      marks.tick(ticks, 0, p.A, p.B); marks.tick(ticks, 1, p.C, p.D);
      ticks.mesh.material.opacity = 0.3 + 0.65 * smoothstep((phase - 1.6) / 1.3);
    };
  }
  return (time, options) => {
    updateCircleState(state, time, options);
    updateSegments(state.phase);
    ids.forEach((key, index) => dots.set(index, p[key], key === 'O' ? 0.025 : 0.035));
    dots.finish(); batches.forEach(item => item.finish());
    arcs.forEach(item => item.result.update(state.arcs[item.key]));
  };
}

function polygonGeometry(resources, polyhedron) {
  const positions = [];
  polyhedron.faces.forEach(face => {
    for (let j = 1; j < face.length - 1; j++) positions.push(...polyhedron.vertices[face[0]], ...polyhedron.vertices[face[j]], ...polyhedron.vertices[face[j + 1]]);
  });
  const geometry = resources.geometry(new THREE.BufferGeometry());
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals(); geometry.computeBoundingSphere();
  return geometry;
}

function faceHighlight(parent, resources) {
  const geometry = resources.geometry(new THREE.BufferGeometry());
  const positions = new Float32Array(27), normals = new Float32Array(27);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.05);
  const material = luminousMaterial(resources, COLORS.champagneGold, 0.26); material.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(geometry, material); mesh.name = 'corresponding-face'; mesh.renderOrder = 1; parent.add(mesh);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), normal = new THREE.Vector3();
  let lastPolyhedron = null, lastFace = -1;
  return {
    mesh,
    show(polyhedron, faceIndex) {
      mesh.visible = true;
      if (lastPolyhedron === polyhedron && lastFace === faceIndex) return;
      lastPolyhedron = polyhedron; lastFace = faceIndex;
      const face = polyhedron.faces[faceIndex], first = polyhedron.vertices[face[0]];
      a.fromArray(polyhedron.vertices[face[1]]).sub(b.fromArray(first));
      b.fromArray(polyhedron.vertices[face[2]]).sub(normal.fromArray(first));
      normal.crossVectors(a, b).normalize();
      let offset = 0;
      for (let j = 1; j < face.length - 1; j++) for (const index of [face[0], face[j], face[j + 1]]) {
        const vertex = polyhedron.vertices[index];
        positions[offset] = vertex[0]; normals[offset++] = normal.x;
        positions[offset] = vertex[1]; normals[offset++] = normal.y;
        positions[offset] = vertex[2]; normals[offset++] = normal.z;
      }
      geometry.setDrawRange(0, offset / 3);
      geometry.attributes.position.needsUpdate = true; geometry.attributes.normal.needsUpdate = true;
      mesh.userData.faceIndex = faceIndex;
    },
  };
}

function createDualObject(id, parent, resources, isMobile, segmentGeometry, sphereGeometry) {
  const pair = createDualPair(id), { primal, dual } = pair;
  const outer = new THREE.Mesh(polygonGeometry(resources, primal), glassMaterial(resources, COLORS.deepPlum, isMobile, 0.18));
  outer.name = 'primal-faces'; parent.add(outer);
  const inner = new THREE.Mesh(polygonGeometry(resources, dual), glassMaterial(resources, COLORS.champagneGold, isMobile, 0.1));
  inner.name = 'dual-faces'; parent.add(inner);
  const edges = segmentBatch(parent, resources, segmentGeometry, luminousMaterial(resources, COLORS.emerald), primal.edges.map((_, index) => `primal-${index}`));
  const dualBase = segmentBatch(parent, resources, segmentGeometry, luminousMaterial(resources, COLORS.champagneGold, 0.18), dual.edges.map((_, index) => `dual-context-${index}`));
  const dualEdges = segmentBatch(parent, resources, segmentGeometry, luminousMaterial(resources, COLORS.champagneGold), dual.edges.map((_, index) => `dual-${index}`));
  const outerPoints = pointBatch(parent, resources, sphereGeometry, primal.vertices.map((_, index) => `primal-${index}`), primal.vertices.map(() => COLORS.emerald));
  const centers = pointBatch(parent, resources, sphereGeometry, dual.vertices.map((_, index) => `face-center-${index}`), dual.vertices.map(() => COLORS.champagneGold));
  const highlight = faceHighlight(parent, resources);
  const selectedPoint = new THREE.Mesh(sphereGeometry, luminousMaterial(resources, COLORS.warmIvory));
  selectedPoint.name = 'corresponding-point'; selectedPoint.scale.setScalar(0.048); parent.add(selectedPoint);
  primal.edges.forEach(([a, b], index) => edges.set(index, primal.vertices[a], primal.vertices[b], 0.01)); edges.finish();
  dual.edges.forEach(([a, b], index) => dualBase.set(index, dual.vertices[a], dual.vertices[b], 0.009)); dualBase.finish();
  primal.vertices.forEach((vertex, index) => outerPoints.set(index, vertex, 0.025)); outerPoints.finish();
  return (elapsedSeconds, { detail = false, reducedMotion = false, loop = false } = {}) => {
    const elapsed = Number.isFinite(elapsedSeconds) ? Math.max(0, elapsedSeconds) : 0;
    const cycling = loop && !reducedMotion;
    const cycle = (elapsed % 8) / 8, turn = cycle * Math.PI * 2;
    const phase = reducedMotion || loop || !detail ? 8 : clamp(elapsed, 0, 8);
    // Both solids, their centroid points and their corresponding face share this
    // rigid transform. No independent spin can break the dual construction.
    parent.rotation.set(cycling ? 0.18 * Math.sin(turn) : 0, cycling ? 0.55 * Math.sin(turn) : 0, cycling ? 0.12 * (Math.cos(turn) - 1) : 0);
    const centerReveal = smoothstep((phase - 0.8) / 1.6), progress = smoothstep((phase - 2.8) / 2.3) * dual.edges.length;
    dual.vertices.forEach((vertex, index) => centers.set(index, vertex, 0.019 + 0.016 * centerReveal)); centers.finish();
    dual.edges.forEach(([a, b], index) => dualEdges.set(index, dual.vertices[a], dual.vertices[b], 0.012, clamp(progress - index, 0, 1))); dualEdges.finish();
    edges.mesh.material.opacity = phase > 5.4 && detail ? 0.6 : 0.9;
    inner.material.opacity = 0.04 + 0.07 * smoothstep((phase - 3) / 2.5);
    highlight.mesh.material.opacity = 0.26; selectedPoint.material.opacity = 0.95;
    // Both solids stay in the same parent transform throughout the correspondence.
    if (cycling) {
      const reverse = cycle >= 0.5, source = reverse ? dual : primal;
      const facePosition = (cycle * 2 % 1) * source.faces.length, faceIndex = Math.floor(facePosition);
      highlight.show(source, faceIndex);
      // Fade at each face boundary rather than flashing between unrelated faces.
      highlight.mesh.material.opacity = 0.26 * Math.sin(Math.PI * (facePosition - faceIndex)) ** 2;
      selectedPoint.visible = true; selectedPoint.position.fromArray((reverse ? primal : dual).vertices[faceIndex]);
      selectedPoint.material.opacity = highlight.mesh.material.opacity / 0.26;
      if (reverse) {
        selectedPoint.userData.primalVertexIndex = faceIndex;
        delete selectedPoint.userData.primalFaceIndex;
      } else {
        selectedPoint.userData.primalFaceIndex = faceIndex;
        delete selectedPoint.userData.primalVertexIndex;
      }
    } else if (detail && phase > 0.8 && phase < 3.2) {
      const faceIndex = Math.min(primal.faces.length - 1, Math.floor((phase - 0.8) / 2.4 * primal.faces.length));
      highlight.show(primal, faceIndex);
      selectedPoint.visible = true; selectedPoint.position.fromArray(dual.vertices[faceIndex]);
      selectedPoint.userData.primalFaceIndex = faceIndex;
      delete selectedPoint.userData.primalVertexIndex;
    } else if (detail && phase >= 5.4) {
      highlight.show(dual, 0);
      selectedPoint.visible = true; selectedPoint.position.fromArray(primal.vertices[0]);
      selectedPoint.userData.primalVertexIndex = 0;
      delete selectedPoint.userData.primalFaceIndex;
    } else {
      highlight.mesh.visible = false; selectedPoint.visible = false;
    }
  };
}

export function createConceptObject({ id, isMobile = false } = {}) {
  const definition = CONCEPT_DEFINITIONS[id];
  if (!definition) throw new RangeError(`Unknown universe concept: ${id}`);
  const resources = createResources(), group = new THREE.Group(), local = new THREE.Group();
  group.name = `concept-${id}`; group.userData.conceptId = id;
  local.name = 'concept-local'; local.scale.setScalar(1 / definition.extent); group.add(local);
  const segmentGeometry = resources.geometry(new THREE.CylinderGeometry(1, 1, 1, isMobile ? 6 : 8, 1, false));
  const sphereGeometry = resources.geometry(new THREE.SphereGeometry(1, isMobile ? 8 : 12, isMobile ? 6 : 8));
  const updateObject = definition.family === 'circle'
    ? createCircleObject(id, local, resources, isMobile, segmentGeometry, sphereGeometry)
    : createDualObject(id, local, resources, isMobile, segmentGeometry, sphereGeometry);
  let disposed = false;
  const object = {
    group, radius: 1,
    metadata: { id, label: definition.label, summary: definition.summary },
    update(elapsedSeconds, options = {}) { if (!disposed) updateObject(elapsedSeconds, options); },
    dispose() {
      if (disposed) return;
      disposed = true; group.removeFromParent(); group.clear(); resources.dispose();
    },
  };
  object.update(0, { detail: false, reducedMotion: false });
  return object;
}
