// AP Math Universe: renderer-independent, normalized mathematical constructions.
// Angles are radians. Circle coordinates lie in XY; polygon faces wind outwards.

export const CONCEPT_DEFINITIONS = Object.freeze({
  'two-tangents': Object.freeze({ label: '두 접선의 길이', summary: '원 밖의 한 점에서 그은 두 접선의 길이는 같습니다.', family: 'circle', extent: 2.02 }),
  'chord-bisector': Object.freeze({ label: '현과 중심의 수선', summary: '중심에서 현에 내린 수선은 현을 이등분합니다.', family: 'circle', extent: 1.05 }),
  'radius-tangent': Object.freeze({ label: '반지름과 접선', summary: '접점에서 반지름과 접선은 직각으로 만납니다.', family: 'circle', extent: 1.35 }),
  'same-arc': Object.freeze({ label: '같은 호의 원주각', summary: '같은 호를 바라보는 같은 쪽 원주의 원주각은 같습니다.', family: 'circle', extent: 1.05 }),
  'central-inscribed': Object.freeze({ label: '중심각과 원주각', summary: '같은 호의 중심각은 원주각의 두 배입니다.', family: 'circle', extent: 1.05 }),
  'chord-arc': Object.freeze({ label: '같은 현과 작은 호', summary: '같은 원에서 길이가 같은 현의 작은 호는 크기가 같습니다.', family: 'circle', extent: 1.05 }),
  'cube-octahedron': Object.freeze({ label: '정육면체와 정팔면체', summary: '6개 면 중심이 6개 꼭짓점으로, 8개 꼭짓점이 8개 면으로 대응합니다.', family: 'dual', extent: 1.05 }),
  'dodecahedron-icosahedron': Object.freeze({ label: '정십이면체와 정이십면체', summary: '12개 면 중심이 12개 꼭짓점으로, 20개 꼭짓점이 20개 면으로 대응합니다.', family: 'dual', extent: 1.05 }),
});

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const smoothstep = value => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t); };
export const add = (a, b) => a.map((value, i) => value + b[i]);
export const subtract = (a, b) => a.map((value, i) => value - b[i]);
export const scale = (a, factor) => a.map(value => value * factor);
export const dot = (a, b) => a.reduce((total, value, i) => total + value * b[i], 0);
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const length = vector => Math.hypot(...vector);
const unit = vector => scale(vector, 1 / length(vector));
const average = vertices => scale(vertices.reduce(add, [0, 0, 0]), 1 / vertices.length);

function setPoint(point, x, y, z = 0) {
  point[0] = x; point[1] = y; point[2] = z;
}

function onCircle(point, angle, radius = 1) {
  setPoint(point, radius * Math.cos(angle), radius * Math.sin(angle));
}

function newArc(center, radius = 1, start = 0, end = Math.PI * 2) {
  return { center, radius, start, end };
}

function angleArc(arc, vertex, first, second) {
  const start = Math.atan2(first[1] - vertex[1], first[0] - vertex[0]);
  const end = Math.atan2(second[1] - vertex[1], second[0] - vertex[0]);
  const delta = ((end - start + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  arc.start = start;
  arc.end = start + delta;
}

/** Create once, then mutate with updateCircleState: no per-frame geometry or arrays. */
export function createCircleState(id) {
  const definition = CONCEPT_DEFINITIONS[id];
  if (!definition || definition.family !== 'circle') throw new RangeError(`Unknown circle concept: ${id}`);
  const points = { O: [0, 0, 0] };
  const pointIds = {
    'two-tangents': ['A', 'B', 'P'],
    'chord-bisector': ['A', 'B', 'M'],
    'radius-tangent': ['T', 'L', 'R'],
    'same-arc': ['A', 'B', 'P', 'Q'],
    'central-inscribed': ['A', 'B', 'P'],
    'chord-arc': ['A', 'B', 'C', 'D'],
  }[id];
  pointIds.forEach(key => { points[key] = [0, 0, 0]; });
  const arcs = {};
  if (id === 'same-arc' || id === 'central-inscribed') {
    arcs.AB = newArc(points.O, 1, -Math.PI / 3, Math.PI / 3);
    arcs.P = newArc(points.P, 0.17);
    if (id === 'same-arc') arcs.Q = newArc(points.Q, 0.17);
    else arcs.O = newArc(points.O, 0.24, -Math.PI / 3, Math.PI / 3);
  } else if (id === 'chord-arc') {
    arcs.AB = newArc(points.O, 1, -Math.PI / 6, Math.PI / 6);
    arcs.CD = newArc(points.O);
  }
  return updateCircleState({ id, points, arcs, phase: 8 }, 0);
}

export function updateCircleState(state, elapsedSeconds, { detail = false, reducedMotion = false } = {}) {
  const elapsed = Number.isFinite(elapsedSeconds) ? Math.max(0, elapsedSeconds) : 0;
  // Detail settles at six seconds, then holds. Preview drifts within the same valid domain.
  const phase = reducedMotion ? 8 : detail ? Math.min(elapsed, 8) : 8;
  const time = reducedMotion ? 6 : detail ? Math.min(elapsed, 6) : elapsed;
  const detailMotion = detail || reducedMotion;
  const p = state.points;
  state.phase = phase;
  if (state.id === 'two-tangents') {
    const d = 1.8 + (detailMotion ? 0.16 : 0.045) * Math.sin(time * (detailMotion ? 0.4 : 0.2));
    const x = 1 / d, y = Math.sqrt(d * d - 1) / d;
    setPoint(p.P, d, 0); setPoint(p.A, x, y); setPoint(p.B, x, -y);
  } else if (state.id === 'chord-bisector') {
    const d = 0.42, half = Math.sqrt(1 - d * d);
    setPoint(p.A, -half, d); setPoint(p.B, half, d); setPoint(p.M, 0, d);
  } else if (state.id === 'radius-tangent') {
    const angle = Math.PI / 4 + (detailMotion ? 0.12 : 0.035) * Math.sin(time * (detailMotion ? 0.5 : 0.14));
    const x = Math.cos(angle), y = Math.sin(angle);
    setPoint(p.T, x, y);
    setPoint(p.L, x + 0.85 * y, y - 0.85 * x);
    setPoint(p.R, x - 0.85 * y, y + 0.85 * x);
  } else if (state.id === 'same-arc' || state.id === 'central-inscribed') {
    onCircle(p.A, -Math.PI / 3); onCircle(p.B, Math.PI / 3);
    // Both vertices remain on the major arc, away from A/B and the highlighted minor arc.
    onCircle(p.P, Math.PI + (detailMotion ? 0.35 : 0.08) * Math.sin(time * (detailMotion ? 0.65 : 0.16)));
    angleArc(state.arcs.P, p.P, p.A, p.B);
    if (p.Q) { onCircle(p.Q, 4.2); angleArc(state.arcs.Q, p.Q, p.A, p.B); }
  } else if (state.id === 'chord-arc') {
    const rotation = 4 * Math.PI / 3 + (detailMotion ? 0.16 : 0.035) * Math.sin(time * (detailMotion ? 0.65 : 0.16));
    onCircle(p.A, -Math.PI / 6); onCircle(p.B, Math.PI / 6);
    onCircle(p.C, rotation - Math.PI / 6); onCircle(p.D, rotation + Math.PI / 6);
    state.arcs.CD.start = rotation - Math.PI / 6;
    state.arcs.CD.end = rotation + Math.PI / 6;
  }
  return state;
}

function cyclicFace(ids, vertices, normal) {
  const center = average(ids.map(index => vertices[index]));
  const u = unit(subtract(vertices[ids[0]], center)), v = cross(normal, u);
  return ids.map(index => ({ index, angle: Math.atan2(dot(subtract(vertices[index], center), v), dot(subtract(vertices[index], center), u)) }))
    .sort((a, b) => a.angle - b.angle).map(entry => entry.index);
}

function withTopology(vertices, faces) {
  const edgeMap = new Map();
  faces.forEach((face, faceIndex) => face.forEach((a, index) => {
    const b = face[(index + 1) % face.length], edge = [Math.min(a, b), Math.max(a, b)], key = edge.join(',');
    if (!edgeMap.has(key)) edgeMap.set(key, { vertices: edge, faces: [] });
    edgeMap.get(key).faces.push(faceIndex);
  }));
  const incidence = [...edgeMap.values()];
  return { vertices, faces, edges: incidence.map(edge => edge.vertices), edgeFaces: incidence.map(edge => edge.faces) };
}

// Only the tiny regular vertex sets below use this constructor. Coplanar supporting
// triples become ONE polygon face: renderer triangles are never counted as faces.
export function buildPlatonic(kind, radius = 1) {
  if (!(radius > 0 && Number.isFinite(radius))) throw new RangeError('A finite positive radius is required');
  const phi = (1 + Math.sqrt(5)) / 2, inversePhi = 1 / phi;
  const vertices = [];
  if (kind === 'cube' || kind === 'dodecahedron') {
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) vertices.push([x, y, z]);
    if (kind === 'dodecahedron') for (const a of [-1, 1]) for (const b of [-1, 1]) {
      vertices.push([0, a * inversePhi, b * phi], [a * inversePhi, b * phi, 0], [a * phi, 0, b * inversePhi]);
    }
  } else if (kind === 'tetrahedron') vertices.push([1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]);
  else throw new RangeError(`Unsupported regular polyhedron: ${kind}`);
  const normalized = vertices.map(vertex => scale(vertex, radius / length(vertex)));
  const planes = new Map(), epsilon = radius * 1e-9;
  for (let a = 0; a < normalized.length - 2; a++) for (let b = a + 1; b < normalized.length - 1; b++) for (let c = b + 1; c < normalized.length; c++) {
    const candidate = cross(subtract(normalized[b], normalized[a]), subtract(normalized[c], normalized[a]));
    if (length(candidate) < radius * radius * 1e-9) continue;
    let normal = unit(candidate), offset = dot(normal, normalized[a]);
    let signed = normalized.map(vertex => dot(normal, vertex) - offset);
    if (signed.some(value => value > epsilon) && signed.some(value => value < -epsilon)) continue;
    if (offset < 0) { normal = scale(normal, -1); signed = signed.map(value => -value); }
    const ids = signed.map((value, index) => Math.abs(value) < epsilon ? index : -1).filter(index => index >= 0);
    const key = ids.join(',');
    if (!planes.has(key)) planes.set(key, cyclicFace(ids, normalized, normal));
  }
  return withTopology(normalized, [...planes.values()]);
}

/** Exact centroid dual of a regular, origin-centered polygon topology. */
export function faceCentroidDual(primal) {
  const vertices = primal.faces.map(face => average(face.map(index => primal.vertices[index])));
  const faces = primal.vertices.map((vertex, vertexIndex) => {
    const incident = primal.faces.map((face, faceIndex) => face.includes(vertexIndex) ? faceIndex : -1).filter(index => index >= 0);
    return cyclicFace(incident, vertices, unit(vertex));
  });
  return {
    ...withTopology(vertices, faces),
    primalFaceToDualVertex: primal.faces.map((_, index) => index),
    primalVertexToDualFace: primal.vertices.map((_, index) => index),
    primalEdgeToDualEdge: primal.edgeFaces.map(faces => faces.slice().sort((a, b) => a - b)),
  };
}

export function createDualPair(id) {
  const kind = { 'cube-octahedron': 'cube', 'dodecahedron-icosahedron': 'dodecahedron' }[id];
  if (!kind) throw new RangeError(`Unknown dual concept: ${id}`);
  const primal = buildPlatonic(kind);
  return { primal, dual: faceCentroidDual(primal) };
}
