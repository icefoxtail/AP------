// Stable concept IDs are independent of the responsive placement of their bodies.
// Coordinates are local to the representative celestial's translation anchor.
export const CONCEPT_GALAXIES = Object.freeze({
  'circle-sector': {
    title: '원의 은하', subtitle: '작은 원을 선택해 숨은 관계를 발견해 보세요.',
    hostRadius: 3.85, hostWide: [0, 0, 0], hostPortrait: [0, 12, 0],
    concepts: [
      { id: 'two-tangents', label: '두 접선의 길이', wide: [-9, 4, 1], portrait: [-6.5, 5.7, 0], compact: [-5.1, 2.7, 1.6], radius: 1.85 },
      { id: 'chord-bisector', label: '현을 이등분하는 수선', wide: [-9, -4, -1], portrait: [6.5, 5.2, -2], compact: [-4.9, -3.5, -1.2], radius: 1.85 },
      { id: 'radius-tangent', label: '반지름과 접선', wide: [-2, -9, 2], portrait: [-6.5, -0.5, 1], compact: [-0.7, -6.1, 1.8], radius: 1.85 },
      { id: 'same-arc', label: '같은 호의 원주각', wide: [7, -6, -2], portrait: [6.5, -1, 0], compact: [4.8, -3.9, -1.8], radius: 1.85 },
      { id: 'central-inscribed', label: '중심각과 원주각', wide: [10, 1, 1], portrait: [-6.5, -7.3, -1], compact: [6.2, 1.1, 1.1], radius: 1.85 },
      { id: 'chord-arc', label: '같은 현, 같은 호', wide: [6, 8, -3], portrait: [6.5, -7.6, 1], compact: [2.7, 5.8, -2], radius: 1.85 },
    ],
  },
  polyhedra: {
    title: '정다면체의 은하', subtitle: '작은 결정을 선택하면 면과 꼭짓점의 관계가 드러납니다.',
    hostRadius: 4.05, hostWide: [0, 0, 0], hostPortrait: [0, 9.5, 0],
    concepts: [
      { id: 'cube-octahedron', label: '정육면체 ↔ 정팔면체', wide: [-9.5, 1, 2.5], portrait: [-3.2, 0, 2], compact: [-5.8, 2.9, 1.8], radius: 3.1 },
      { id: 'dodecahedron-icosahedron', label: '정십이면체 ↔ 정이십면체', wide: [9.5, -1, -2.5], portrait: [3.2, -8.5, -2], compact: [5.7, -2.6, -1.7], radius: 3.1 },
    ],
  },
});

export function resolveCelestialId(id) {
  return id === 'circle' ? 'circle-sector' : id;
}

export function getConcept(galaxyId, conceptId) {
  return CONCEPT_GALAXIES[resolveCelestialId(galaxyId)]?.concepts.find(c => c.id === conceptId) || null;
}

export function galaxyLayout(galaxyId, portrait) {
  const def = CONCEPT_GALAXIES[galaxyId];
  if (!def) return null;
  return {
    host: portrait ? def.hostPortrait : def.hostWide,
    bodies: def.concepts.map(c => ({ ...c, position: portrait ? c.portrait : c.wide })),
  };
}

// Bounds cover the complete glyph (including the external tangent point), not
// just its circle. Label padding is specified in CSS pixels by the camera fit.
export function galaxyBounds(galaxyId, portrait) {
  const def = CONCEPT_GALAXIES[galaxyId], layout = galaxyLayout(galaxyId, portrait);
  const bodies = [{ position: layout.host, radius: def.hostRadius }, ...layout.bodies];
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const body of bodies) for (let axis = 0; axis < 3; axis++) {
    min[axis] = Math.min(min[axis], body.position[axis] - body.radius);
    max[axis] = Math.max(max[axis], body.position[axis] + body.radius);
  }
  return { min, max, bodies };
}
