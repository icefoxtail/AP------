// AP Math Playground Universe - Mathematical Objects Generator (v1.0)
// Implements 8 celestial mathematical families with strict geometric rigor & luxury materials.
// Palette: Obsidian #09090D, Deep Plum #241727, Warm Ivory #F5F0E9,
//          Champagne Gold #D8B77E, Emerald #55CBA3, Soft Amethyst #A78AC8, Muted Silver #BDB8C2.

import * as THREE from './vendor/three.module.js';

export const MATH_COLORS = Object.freeze({
  obsidian: 0x09090D,
  deepPlum: 0x241727,
  warmIvory: 0xF5F0E9,
  champagneGold: 0xD8B77E,
  goldSoft: 0xE8CF9E,
  emerald: 0x55CBA3,
  emeraldBright: 0x76E8BF,
  softAmethyst: 0xA78AC8,
  amethystBright: 0xC5ABDF,
  mutedSilver: 0xBDB8C2,
});

// Helper: Create soft radial glow sprite texture
function createGlowSpriteTexture(baseColorHex, innerAlpha = 1.0, outerAlpha = 0.0) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const c = new THREE.Color(baseColorHex);
  const rgb = `${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}`;

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${rgb}, ${innerAlpha})`);
  grad.addColorStop(0.18, `rgba(${rgb}, ${innerAlpha * 0.85})`);
  grad.addColorStop(0.45, `rgba(${rgb}, ${innerAlpha * 0.35})`);
  grad.addColorStop(1, `rgba(${rgb}, ${outerAlpha})`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// -------------------------------------------------------------
// 1. Dodecahedron & Icosahedron Dual Crystal (정다면체 - Jewel Crystal)
// -------------------------------------------------------------
export function createPolyhedronObject({ radius = 3.8, isMobile = false } = {}) {
  const group = new THREE.Group();
  group.name = 'math-polyhedron';

  // 1. Outer Dodecahedron Geometry
  const dodecaGeo = new THREE.DodecahedronGeometry(radius, 0);

  // 2. Clear Glass Crystal Physical Material (Translucent & Refractive)
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1226, // deep cosmic obsidian plum
    emissive: 0x0c0714,
    roughness: 0.04,
    metalness: 0.12,
    transmission: isMobile ? 0.45 : 0.88,
    thickness: 1.6,
    ior: 1.54,
    reflectivity: 0.88,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    transparent: true,
    opacity: isMobile ? 0.85 : 0.92,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const outerMesh = new THREE.Mesh(dodecaGeo, crystalMat);
  group.add(outerMesh);

  // 3. Crisp Glowing Emerald Facet Seams (Outer Edges)
  const dodecaWireGeo = new THREE.WireframeGeometry(dodecaGeo);
  const edgeMat = new THREE.LineBasicMaterial({
    color: MATH_COLORS.emerald,
    transparent: true,
    opacity: 0.95,
  });
  const outerEdges = new THREE.LineSegments(dodecaWireGeo, edgeMat);
  group.add(outerEdges);

  // 4. Secondary Inner Edge Highlight for Facet Depth
  const innerEdgeGeo = new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(radius * 0.992, 0));
  const innerEdgeMat = new THREE.LineBasicMaterial({
    color: MATH_COLORS.emeraldBright,
    transparent: true,
    opacity: 0.45,
  });
  const innerEdgeGlow = new THREE.LineSegments(innerEdgeGeo, innerEdgeMat);
  group.add(innerEdgeGlow);

  // 5. 20 Dodecahedron Vertices: Octahedral Jewel Nodes with Subtle Sprite Glow
  const posAttr = dodecaGeo.attributes.position;
  const uniqueVerts = [];
  const vMap = new Set();
  for (let i = 0; i < posAttr.count; i++) {
    const key = `${posAttr.getX(i).toFixed(3)},${posAttr.getY(i).toFixed(3)},${posAttr.getZ(i).toFixed(3)}`;
    if (!vMap.has(key)) {
      vMap.add(key);
      uniqueVerts.push(new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
    }
  }

  // Octahedral jewel nodes for vertices
  const vertexJewelGeo = new THREE.OctahedronGeometry(isMobile ? 0.11 : 0.14, 0);
  const vertexJewelMat = new THREE.MeshStandardMaterial({
    color: MATH_COLORS.champagneGold,
    metalness: 0.9,
    roughness: 0.15,
    emissive: MATH_COLORS.emerald,
    emissiveIntensity: 0.35,
  });
  const vertexInstMesh = new THREE.InstancedMesh(vertexJewelGeo, vertexJewelMat, uniqueVerts.length);
  const dummyObj = new THREE.Object3D();
  uniqueVerts.forEach((v, idx) => {
    dummyObj.position.copy(v);
    dummyObj.updateMatrix();
    vertexInstMesh.setMatrixAt(idx, dummyObj.matrix);
  });
  group.add(vertexInstMesh);

  // Vertex subtle corona sprites
  const vertexSpriteTex = createGlowSpriteTexture(MATH_COLORS.champagneGold, 0.7);
  const vertexSpriteMat = new THREE.SpriteMaterial({
    map: vertexSpriteTex,
    color: MATH_COLORS.champagneGold,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  const vertexSprites = [];
  uniqueVerts.forEach((v) => {
    const sp = new THREE.Sprite(vertexSpriteMat);
    sp.position.copy(v);
    sp.scale.set(0.65, 0.65, 0.65);
    group.add(sp);
    vertexSprites.push(sp);
  });

  // 6. Concentric Golden Icosahedron Core (Golden Glass Core)
  const innerRadius = radius * 0.56;
  const icoGeo = new THREE.IcosahedronGeometry(innerRadius, 0);
  
  // Golden translucent crystal facets for inner core
  const icoFacetMat = new THREE.MeshPhysicalMaterial({
    color: 0x2a1c0d,
    emissive: 0x1f1406,
    roughness: 0.16,
    metalness: 0.92,
    clearcoat: 0.85,
    transparent: true,
    opacity: 0.7,
    transmission: 0.25,
    side: THREE.DoubleSide,
  });
  const innerIcoMesh = new THREE.Mesh(icoGeo, icoFacetMat);
  group.add(innerIcoMesh);

  // Golden edge wireframe
  const icoWire = new THREE.WireframeGeometry(icoGeo);
  const icoLineMat = new THREE.LineBasicMaterial({
    color: MATH_COLORS.champagneGold,
    transparent: true,
    opacity: 0.92,
  });
  const innerEdges = new THREE.LineSegments(icoWire, icoLineMat);
  group.add(innerEdges);

  // Core internal light (radiating warm gold & emerald from inside out)
  const coreLight = new THREE.PointLight(MATH_COLORS.champagneGold, 1.4, radius * 4.0);
  group.add(coreLight);

  return {
    group,
    metadata: {
      id: 'polyhedra',
      title: '정십이면체와 정이십면체',
      subtitle: '오일러 다면체 정리 · 쌍대다면체 구조',
      formula: 'V - E + F = 2',
      grade: '중1 · 고등 기하',
      category: '다면체',
      description: '정규 12면체와 내접 쌍대 20면체의 결정 기하학. 투명 크리스털 면과 골든 코어의 3차원 투과 구조를 탐구합니다.',
    },
    update(time) {
      // Outer dodecahedron rotates along cosmic oblique axis
      outerMesh.rotation.x = time * 0.14;
      outerMesh.rotation.y = time * 0.22;
      outerMesh.rotation.z = time * 0.06;
      outerEdges.rotation.copy(outerMesh.rotation);
      innerEdgeGlow.rotation.copy(outerMesh.rotation);
      vertexInstMesh.rotation.copy(outerMesh.rotation);

      // Rotate vertex sprites to match
      const rotEuler = new THREE.Euler(time * 0.14, time * 0.22, time * 0.06);
      uniqueVerts.forEach((v, idx) => {
        vertexSprites[idx].position.copy(v).applyEuler(rotEuler);
      });

      // Inner icosahedron counter-rotates independently
      innerIcoMesh.rotation.x = -time * 0.20;
      innerIcoMesh.rotation.y = time * 0.15;
      innerIcoMesh.rotation.z = -time * 0.26;
      innerEdges.rotation.copy(innerIcoMesh.rotation);

      // Gentle breathing pulse of the golden inner light
      coreLight.intensity = 1.2 + Math.sin(time * 2.5) * 0.35;
    },
    dispose() {
      dodecaGeo.dispose();
      crystalMat.dispose();
      dodecaWireGeo.dispose();
      edgeMat.dispose();
      innerEdgeGeo.dispose();
      innerEdgeMat.dispose();
      vertexJewelGeo.dispose();
      vertexJewelMat.dispose();
      vertexInstMesh.dispose();
      vertexSpriteTex.dispose();
      vertexSpriteMat.dispose();
      icoGeo.dispose();
      icoFacetMat.dispose();
      icoWire.dispose();
      icoLineMat.dispose();
    },
  };
}

// -------------------------------------------------------------
// 2. Ellipse & Dual Foci (타원과 두 초점 - Majestic Orbit)
// -------------------------------------------------------------
export function createEllipseObject({ a = 7.6, b = 4.4, isMobile = false } = {}) {
  const group = new THREE.Group();
  group.name = 'math-ellipse';

  // Strict Mathematical Foci: c = sqrt(a² - b²)
  const c = Math.sqrt(a * a - b * b); // e.g. sqrt(57.76 - 19.36) = sqrt(38.4) ≈ 6.1968

  // 1. Elliptic Smooth 3D Tube Orbit
  const curvePoints = [];
  const segments = 160;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    curvePoints.push(new THREE.Vector3(a * Math.cos(t), 0, b * Math.sin(t)));
  }
  const curvePath = new THREE.CatmullRomCurve3(curvePoints, true);
  const tubeGeo = new THREE.TubeGeometry(curvePath, 160, isMobile ? 0.045 : 0.06, 8, true);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: MATH_COLORS.emerald,
    emissive: 0x123e2e,
    roughness: 0.18,
    metalness: 0.85,
  });
  const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
  group.add(tubeMesh);

  // Razor-sharp bright co-axial core line
  const coreLineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
  const coreLineMat = new THREE.LineBasicMaterial({
    color: MATH_COLORS.emeraldBright,
    transparent: true,
    opacity: 0.85,
  });
  const coreLine = new THREE.LineLoop(coreLineGeo, coreLineMat);
  group.add(coreLine);

  // 2. Axes: Major Axis (2a) & Minor Axis (2b) in Champagne Gold
  const axisMat = new THREE.LineDashedMaterial({
    color: MATH_COLORS.champagneGold,
    dashSize: 0.38,
    gapSize: 0.22,
    opacity: 0.65,
    transparent: true,
  });
  const majorGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-a * 1.15, 0, 0),
    new THREE.Vector3(a * 1.15, 0, 0),
  ]);
  const majorLine = new THREE.Line(majorGeo, axisMat);
  majorLine.computeLineDistances();
  group.add(majorLine);

  const minorGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, -b * 1.2),
    new THREE.Vector3(0, 0, b * 1.2),
  ]);
  const minorLine = new THREE.Line(minorGeo, axisMat);
  minorLine.computeLineDistances();
  group.add(minorLine);

  // 3. Dual Foci (F1, F2) Spheres & Concentric Halos
  const fociGroup = new THREE.Group();
  const focusGeo = new THREE.SphereGeometry(isMobile ? 0.18 : 0.22, 16, 16);
  const focusMat = new THREE.MeshStandardMaterial({
    color: MATH_COLORS.softAmethyst,
    emissive: 0x482968,
    metalness: 0.8,
    roughness: 0.2,
  });

  const f1 = new THREE.Mesh(focusGeo, focusMat);
  f1.position.set(-c, 0, 0);
  fociGroup.add(f1);

  const f2 = new THREE.Mesh(focusGeo, focusMat);
  f2.position.set(c, 0, 0);
  fociGroup.add(f2);

  // Concentric focal locus rings on orbital plane
  const ringGeo = new THREE.RingGeometry(0.35, 0.42, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: MATH_COLORS.softAmethyst,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
  });
  const f1Ring = new THREE.Mesh(ringGeo, ringMat);
  f1Ring.rotation.x = Math.PI / 2;
  f1Ring.position.set(-c, 0, 0);
  fociGroup.add(f1Ring);

  const f2Ring = new THREE.Mesh(ringGeo, ringMat);
  f2Ring.rotation.x = Math.PI / 2;
  f2Ring.position.set(c, 0, 0);
  fociGroup.add(f2Ring);

  // Foci Corona Sprites
  const spriteTex = createGlowSpriteTexture(MATH_COLORS.softAmethyst, 0.9);
  const spriteMat = new THREE.SpriteMaterial({
    map: spriteTex,
    color: MATH_COLORS.softAmethyst,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  const f1Glow = new THREE.Sprite(spriteMat);
  f1Glow.scale.set(1.5, 1.5, 1.5);
  f1.add(f1Glow);

  const f2Glow = new THREE.Sprite(spriteMat);
  f2Glow.scale.set(1.5, 1.5, 1.5);
  f2.add(f2Glow);

  group.add(fociGroup);

  // 4. Moving Point P and Dynamic Focal Strings: |PF₁| + |PF₂| = 2a
  const pMesh = new THREE.Mesh(
    new THREE.SphereGeometry(isMobile ? 0.16 : 0.20, 16, 16),
    new THREE.MeshStandardMaterial({
      color: MATH_COLORS.warmIvory,
      emissive: MATH_COLORS.champagneGold,
      emissiveIntensity: 0.6,
      metalness: 0.85,
      roughness: 0.1,
    })
  );
  const pGlowTex = createGlowSpriteTexture(MATH_COLORS.champagneGold, 0.85);
  const pGlowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: pGlowTex,
    color: MATH_COLORS.champagneGold,
    blending: THREE.AdditiveBlending,
    transparent: true,
  }));
  pGlowSprite.scale.set(1.1, 1.1, 1.1);
  pMesh.add(pGlowSprite);
  group.add(pMesh);

  // Focal connection lines F1-P and F2-P in vibrant Champagne Gold
  const linePGeo = new THREE.BufferGeometry();
  const linePPositions = new Float32Array(6 * 3);
  linePGeo.setAttribute('position', new THREE.BufferAttribute(linePPositions, 3));
  const linePMat = new THREE.LineBasicMaterial({
    color: MATH_COLORS.champagneGold,
    transparent: true,
    opacity: 0.95,
  });
  const focalLines = new THREE.LineSegments(linePGeo, linePMat);
  group.add(focalLines);

  // Traveling pulse markers along F1->P and F2->P (showing string tension!)
  const pulseNode1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshBasicMaterial({ color: MATH_COLORS.warmIvory })
  );
  const pulseNode2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshBasicMaterial({ color: MATH_COLORS.warmIvory })
  );
  group.add(pulseNode1);
  group.add(pulseNode2);

  // 5. Stardust Stream along Ellipse
  const particleCount = isMobile ? 45 : 90;
  const particleGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  const pOffsets = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    pOffsets[i] = (i / particleCount) * Math.PI * 2;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: MATH_COLORS.emeraldBright,
    size: isMobile ? 0.14 : 0.18,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  group.add(particleSystem);

  return {
    group,
    metadata: {
      id: 'ellipse',
      title: '타원과 두 초점',
      subtitle: '이차곡선 · 초점 거리 합 불변성',
      formula: 'x²/a² + y²/b² = 1  (|PF₁| + |PF₂| = 2a)',
      grade: '고등 기하',
      category: '이차곡선',
      description: '두 초점 F₁, F₂로부터의 거리의 합이 일정한 점들의 궤적. 행성 공전 궤도와 원뿔곡선의 대표 천체입니다.',
    },
    update(time) {
      // 1. Move point P along ellipse parameter t
      const t = time * 0.65;
      const px = a * Math.cos(t);
      const pz = b * Math.sin(t);
      pMesh.position.set(px, 0, pz);

      // 2. Update focal segments F1 -> P -> F2
      const pos = linePGeo.attributes.position.array;
      // F1 -> P
      pos[0] = -c; pos[1] = 0; pos[2] = 0;
      pos[3] = px; pos[4] = 0; pos[5] = pz;
      // F2 -> P
      pos[6] = c; pos[7] = 0; pos[8] = 0;
      pos[9] = px; pos[10] = 0; pos[11] = pz;
      linePGeo.attributes.position.needsUpdate = true;

      // Pulse traveling along F1->P and F2->P
      const wave = (time * 1.5) % 1.0;
      pulseNode1.position.set(
        -c + (px - (-c)) * wave,
        0,
        pz * wave
      );
      pulseNode2.position.set(
        c + (px - c) * wave,
        0,
        pz * wave
      );

      // 3. Foci pulsation
      const pulse = 1.3 + Math.sin(time * 3.0) * 0.25;
      f1Glow.scale.set(pulse, pulse, pulse);
      const pulse2 = 1.3 + Math.cos(time * 3.0) * 0.25;
      f2Glow.scale.set(pulse2, pulse2, pulse2);

      // 4. Update Stardust with Keplerian orbital acceleration
      const parPos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const baseT = (pOffsets[i] + time * 0.45) % (Math.PI * 2);
        const pt = baseT + 0.1 * Math.sin(baseT * 2);
        parPos[i * 3] = a * Math.cos(pt);
        parPos[i * 3 + 1] = Math.sin(pt * 3.0 + time) * 0.08;
        parPos[i * 3 + 2] = b * Math.sin(pt);
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Gentle orbital plane wobble
      group.rotation.x = Math.sin(time * 0.14) * 0.08;
      group.rotation.y = time * 0.08;
    },
    dispose() {
      tubeGeo.dispose();
      tubeMat.dispose();
      coreLineGeo.dispose();
      coreLineMat.dispose();
      majorGeo.dispose();
      minorGeo.dispose();
      axisMat.dispose();
      focusGeo.dispose();
      focusMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      spriteTex.dispose();
      spriteMat.dispose();
      linePGeo.dispose();
      linePMat.dispose();
      pGlowTex.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    },
  };
}

// -------------------------------------------------------------
// 3. Parabola, Focus & Directrix (포물선과 초점·준선 - Fading Open Curve)
// -------------------------------------------------------------
export function createParabolaObject({ p = 2.1, yRange = 6.4, isMobile = false } = {}) {
  const group = new THREE.Group();
  group.name = 'math-parabola';

  // Centering offset along X
  const xOffset = -2.6;
  const directrixX = -p + xOffset;
  const focusX = p + xOffset;

  // 1. Parabola Curve with Smooth Tapering & Natural Fade-out
  const steps = 120;
  const curvePoints = [];
  for (let i = 0; i <= steps; i++) {
    const y = -yRange + (i / steps) * (2 * yRange);
    const x = (y * y) / (4 * p) + xOffset;
    curvePoints.push(new THREE.Vector3(x, y, 0));
  }
  const curvePath = new THREE.CatmullRomCurve3(curvePoints);

  // Tapered tube
  const tubeGeo = new THREE.TubeGeometry(curvePath, 120, isMobile ? 0.045 : 0.06, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: MATH_COLORS.emerald,
    emissive: 0x164634,
    roughness: 0.18,
    metalness: 0.85,
  });
  const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
  group.add(tubeMesh);

  // Sharp glowing centerline with alpha fade-out at ends
  const linePos = new Float32Array((steps + 1) * 3);
  const lineColors = new Float32Array((steps + 1) * 3);
  const cEmerald = new THREE.Color(MATH_COLORS.emeraldBright);
  const cPlum = new THREE.Color(MATH_COLORS.deepPlum);

  for (let i = 0; i <= steps; i++) {
    const pt = curvePoints[i];
    linePos[i * 3] = pt.x;
    linePos[i * 3 + 1] = pt.y;
    linePos[i * 3 + 2] = pt.z;

    // Fade to plum/background at extremities
    const normDist = Math.abs(pt.y) / yRange; // 0 at vertex, 1 at ends
    const col = cEmerald.clone().lerp(cPlum, Math.pow(normDist, 1.8));
    lineColors[i * 3] = col.r;
    lineColors[i * 3 + 1] = col.g;
    lineColors[i * 3 + 2] = col.b;
  }
  const coreLineGeo = new THREE.BufferGeometry();
  coreLineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  coreLineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  const coreLineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
  });
  const coreLine = new THREE.Line(coreLineGeo, coreLineMat);
  group.add(coreLine);

  // 2. Directrix Line: x = -p + xOffset in Champagne Gold with End-caps
  const directrixGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(directrixX, -yRange * 1.18, 0),
    new THREE.Vector3(directrixX, yRange * 1.18, 0),
  ]);
  const directrixMat = new THREE.LineBasicMaterial({
    color: MATH_COLORS.champagneGold,
    transparent: true,
    opacity: 0.85,
  });
  const directrixLine = new THREE.Line(directrixGeo, directrixMat);
  group.add(directrixLine);

  // Directrix end caps (geometric boundary markers)
  const capGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(directrixX - 0.25, -yRange * 1.18, 0),
    new THREE.Vector3(directrixX + 0.25, -yRange * 1.18, 0),
    new THREE.Vector3(directrixX - 0.25, yRange * 1.18, 0),
    new THREE.Vector3(directrixX + 0.25, yRange * 1.18, 0),
  ]);
  const capLines = new THREE.LineSegments(capGeo, directrixMat);
  group.add(capLines);

  // 3. Symmetry Axis y = 0
  const axisGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(directrixX - 1.2, 0, 0),
    new THREE.Vector3((yRange * yRange) / (4 * p) + xOffset + 1.2, 0, 0),
  ]);
  const axisMat = new THREE.LineDashedMaterial({
    color: MATH_COLORS.mutedSilver,
    dashSize: 0.35,
    gapSize: 0.2,
    transparent: true,
    opacity: 0.5,
  });
  const axisLine = new THREE.Line(axisGeo, axisMat);
  axisLine.computeLineDistances();
  group.add(axisLine);

  // 4. Focus F(p + xOffset, 0, 0)
  const focusGeo = new THREE.SphereGeometry(isMobile ? 0.18 : 0.22, 16, 16);
  const focusMat = new THREE.MeshStandardMaterial({
    color: MATH_COLORS.emeraldBright,
    emissive: MATH_COLORS.emerald,
    emissiveIntensity: 0.6,
    metalness: 0.8,
    roughness: 0.2,
  });
  const focusMesh = new THREE.Mesh(focusGeo, focusMat);
  focusMesh.position.set(focusX, 0, 0);
  group.add(focusMesh);

  const focusTex = createGlowSpriteTexture(MATH_COLORS.emerald, 0.9);
  const focusSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: focusTex,
    color: MATH_COLORS.emerald,
    blending: THREE.AdditiveBlending,
    transparent: true,
  }));
  focusSprite.scale.set(1.7, 1.7, 1.7);
  focusMesh.add(focusSprite);

  // 5. Dynamic Equal Distance Proof: Tracer P on parabola, Foot H on directrix
  const tracerMesh = new THREE.Mesh(
    new THREE.SphereGeometry(isMobile ? 0.15 : 0.18, 16, 16),
    new THREE.MeshStandardMaterial({
      color: MATH_COLORS.warmIvory,
      emissive: MATH_COLORS.champagneGold,
      emissiveIntensity: 0.5,
    })
  );
  group.add(tracerMesh);

  const footMesh = new THREE.Mesh(
    new THREE.SphereGeometry(isMobile ? 0.12 : 0.15, 16, 16),
    new THREE.MeshStandardMaterial({
      color: MATH_COLORS.champagneGold,
      metalness: 0.8,
      roughness: 0.2,
    })
  );
  group.add(footMesh);

  // Right angle symbol at H on directrix
  const rightAngleGeo = new THREE.BufferGeometry();
  const raPositions = new Float32Array(4 * 3);
  rightAngleGeo.setAttribute('position', new THREE.BufferAttribute(raPositions, 3));
  const rightAngleMat = new THREE.LineBasicMaterial({
    color: MATH_COLORS.champagneGold,
    transparent: true,
    opacity: 0.85,
  });
  const rightAngleLine = new THREE.Line(rightAngleGeo, rightAngleMat);
  group.add(rightAngleLine);

  // Equal distance lines: F -> P and P -> H
  const proofLineGeo = new THREE.BufferGeometry();
  const proofPositions = new Float32Array(6 * 3);
  proofLineGeo.setAttribute('position', new THREE.BufferAttribute(proofPositions, 3));
  const proofLineMat = new THREE.LineBasicMaterial({
    color: MATH_COLORS.champagneGold,
    transparent: true,
    opacity: 0.95,
  });
  const proofLines = new THREE.LineSegments(proofLineGeo, proofLineMat);
  group.add(proofLines);

  // Parabolic stardust stream
  const dustCount = isMobile ? 30 : 60;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  const dustOffsets = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    dustOffsets[i] = (i / dustCount) * (2 * yRange) - yRange;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: MATH_COLORS.emeraldBright,
    size: 0.14,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });
  const dustPoints = new THREE.Points(dustGeo, dustMat);
  group.add(dustPoints);

  return {
    group,
    metadata: {
      id: 'parabola',
      title: '포물선과 준선·초점',
      subtitle: '초점-준선 등거리 정의 · 원뿔곡선',
      formula: 'y² = 4px  (|PF| = |PH|)',
      grade: '고등 기하 · 중3 이차함수',
      category: '이차곡선',
      description: '초점 F와 준선까지의 거리가 항상 같은 점들의 모임. 안테나 반사경과 투사체 운동의 핵심 수학 구조입니다.',
    },
    update(time) {
      // Oscillate y smoothly
      const curY = Math.sin(time * 0.8) * (yRange * 0.78);
      const curX = (curY * curY) / (4 * p) + xOffset;

      tracerMesh.position.set(curX, curY, 0);
      footMesh.position.set(directrixX, curY, 0);

      // Update equal distance proof lines: F -> P, and P -> H
      const pos = proofLineGeo.attributes.position.array;
      // F -> P
      pos[0] = focusX; pos[1] = 0; pos[2] = 0;
      pos[3] = curX; pos[4] = curY; pos[5] = 0;
      // P -> H
      pos[6] = curX; pos[7] = curY; pos[8] = 0;
      pos[9] = directrixX; pos[10] = curY; pos[11] = 0;
      proofLineGeo.attributes.position.needsUpdate = true;

      // Update right angle indicator at H(directrixX, curY, 0)
      const raSize = 0.35;
      const raSign = curY >= 0 ? -1 : 1;
      const ra = rightAngleGeo.attributes.position.array;
      ra[0] = directrixX + raSize; ra[1] = curY; ra[2] = 0;
      ra[3] = directrixX + raSize; ra[4] = curY + raSign * raSize; ra[5] = 0;
      ra[6] = directrixX; ra[7] = curY + raSign * raSize; ra[8] = 0;
      ra[9] = directrixX + raSize; ra[10] = curY + raSign * raSize; ra[11] = 0;
      rightAngleGeo.attributes.position.needsUpdate = true;

      // Pulse focus sprite
      const pulse = 1.35 + Math.sin(time * 3.2) * 0.25;
      focusSprite.scale.set(pulse, pulse, pulse);

      // Update parabolic dust stream
      const dArr = dustGeo.attributes.position.array;
      for (let i = 0; i < dustCount; i++) {
        let dy = dustOffsets[i] + Math.sin(time * 0.6 + i) * 0.4;
        if (dy > yRange) dy -= 2 * yRange;
        if (dy < -yRange) dy += 2 * yRange;
        dArr[i * 3] = (dy * dy) / (4 * p) + xOffset;
        dArr[i * 3 + 1] = dy;
        dArr[i * 3 + 2] = Math.sin(time + dy) * 0.08;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Gentle celestial tilt
      group.rotation.z = Math.sin(time * 0.18) * 0.05;
      group.rotation.x = Math.cos(time * 0.22) * 0.1;
    },
    dispose() {
      tubeGeo.dispose();
      tubeMat.dispose();
      coreLineGeo.dispose();
      coreLineMat.dispose();
      directrixGeo.dispose();
      directrixMat.dispose();
      capGeo.dispose();
      axisGeo.dispose();
      axisMat.dispose();
      focusGeo.dispose();
      focusMat.dispose();
      focusTex.dispose();
      tracerMesh.geometry.dispose();
      footMesh.geometry.dispose();
      rightAngleGeo.dispose();
      rightAngleMat.dispose();
      proofLineGeo.dispose();
      proofLineMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
    },
  };
}

// -------------------------------------------------------------
// 4. Hyperbola & Asymptotes (쌍곡선과 점근선)
// -------------------------------------------------------------
export function createHyperbolaObject({ a = 2.8, b = 2.1, isMobile = false } = {}) {
  const group = new THREE.Group();
  group.name = 'math-hyperbola';
  const c = Math.sqrt(a * a + b * b); // e.g. sqrt(7.84 + 4.41) = 3.5

  // Two Branches: x² / a² - y² / b² = 1 => x = a * cosh(t), y = b * sinh(t)
  const steps = 64;
  const tMax = 1.7;

  function makeBranch(sign = 1) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = -tMax + (i / steps) * (2 * tMax);
      const x = sign * a * Math.cosh(t);
      const y = b * Math.sinh(t);
      pts.push(new THREE.Vector3(x, y, 0));
    }
    const path = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(path, 64, isMobile ? 0.035 : 0.05, 8, false);
    const mat = new THREE.MeshStandardMaterial({
      color: MATH_COLORS.emerald,
      emissive: 0x164635,
      roughness: 0.28,
      metalness: 0.65,
    });
    return new THREE.Mesh(geo, mat);
  }

  const rightBranch = makeBranch(1);
  const leftBranch = makeBranch(-1);
  group.add(rightBranch);
  group.add(leftBranch);

  // Asymptotes: y = ±(b/a)x
  const asymLength = a * Math.cosh(tMax) * 1.1;
  const slope = b / a;
  const asymMat = new THREE.LineDashedMaterial({
    color: MATH_COLORS.champagneGold,
    dashSize: 0.4,
    gapSize: 0.25,
    transparent: true,
    opacity: 0.6,
  });

  const asym1Geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-asymLength, -asymLength * slope, 0),
    new THREE.Vector3(asymLength, asymLength * slope, 0),
  ]);
  const asymLine1 = new THREE.Line(asym1Geo, asymMat);
  asymLine1.computeLineDistances();
  group.add(asymLine1);

  const asym2Geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-asymLength, asymLength * slope, 0),
    new THREE.Vector3(asymLength, -asymLength * slope, 0),
  ]);
  const asymLine2 = new THREE.Line(asym2Geo, asymMat);
  asymLine2.computeLineDistances();
  group.add(asymLine2);

  // Foci at (±c, 0, 0)
  const fociMat = new THREE.MeshBasicMaterial({ color: MATH_COLORS.softAmethyst });
  const f1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), fociMat);
  f1.position.set(-c, 0, 0);
  const f2 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), fociMat);
  f2.position.set(c, 0, 0);
  group.add(f1);
  group.add(f2);

  return {
    group,
    metadata: {
      id: 'hyperbola',
      title: '쌍곡선과 점근선',
      subtitle: '초점 거리 차 불변성 · 극한 점근 거동',
      formula: 'x²/a² - y²/b² = 1  (y = ±b/a x)',
      grade: '고등 기하',
      category: '이차곡선',
      description: '두 초점으로부터의 거리의 차가 일정한 점들의 자취. 무한대에서 점근선에 한없이 다가가는 기하학적 특성을 보여줍니다.',
    },
    update(time) {
      group.rotation.y = Math.sin(time * 0.18) * 0.25;
      group.rotation.z = Math.cos(time * 0.14) * 0.15;
    },
    dispose() {
      asym1Geo.dispose();
      asym2Geo.dispose();
      asymMat.dispose();
      fociMat.dispose();
    },
  };
}

// -------------------------------------------------------------
// 5. Circle & Sector Lab (원과 부채꼴)
// -------------------------------------------------------------
export function createCircleSectorObject({ radius = 3.8 } = {}) {
  const group = new THREE.Group();
  group.name = 'math-circle-sector';

  // Outer Circle Ring
  const ringGeo = new THREE.RingGeometry(radius - 0.04, radius + 0.04, 96);
  const ringMat = new THREE.MeshBasicMaterial({
    color: MATH_COLORS.emerald,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  group.add(ringMesh);

  // Dynamic Sector Shape Mesh
  const sectorMat = new THREE.MeshBasicMaterial({
    color: MATH_COLORS.emerald,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  });
  let sectorMesh = new THREE.Mesh(new THREE.BufferGeometry(), sectorMat);
  group.add(sectorMesh);

  // Radius Lines: center to 0 and center to theta
  const radLineGeo = new THREE.BufferGeometry();
  const radPos = new Float32Array(6 * 3);
  radLineGeo.setAttribute('position', new THREE.BufferAttribute(radPos, 3));
  const radLineMat = new THREE.LineBasicMaterial({ color: MATH_COLORS.champagneGold, linewidth: 2 });
  const radLines = new THREE.LineSegments(radLineGeo, radLineMat);
  group.add(radLines);

  // Center Point
  const centerMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 12),
    new THREE.MeshBasicMaterial({ color: MATH_COLORS.warmIvory })
  );
  group.add(centerMesh);

  return {
    group,
    metadata: {
      id: 'circle-sector',
      title: '원과 부채꼴',
      subtitle: '호의 길이와 넓이의 동적 비례',
      formula: 'l = rθ,  S = ½r²θ = ½rl',
      grade: '중1 · 고등 수1',
      category: '평면기하',
      description: '중심각의 크기에 비례하는 호의 길이와 부채꼴의 넓이. 선(둘레)과 면(넓이)의 기본 원리를 직관적으로 체감합니다.',
    },
    update(time) {
      // Oscillate angle theta from PI/6 to 5*PI/6
      const theta = (Math.PI / 3) + Math.sin(time * 0.8) * (Math.PI / 4);

      // Rebuild sector shape
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.absarc(0, 0, radius, 0, theta, false);
      shape.lineTo(0, 0);

      const oldGeo = sectorMesh.geometry;
      sectorMesh.geometry = new THREE.ShapeGeometry(shape, 48);
      if (oldGeo) oldGeo.dispose();

      // Update radius segment positions
      const p = radLineGeo.attributes.position.array;
      // 0 to (radius, 0)
      p[0] = 0; p[1] = 0; p[2] = 0.01;
      p[3] = radius; p[4] = 0; p[5] = 0.01;
      // 0 to (radius*cos(theta), radius*sin(theta))
      p[6] = 0; p[7] = 0; p[8] = 0.01;
      p[9] = radius * Math.cos(theta);
      p[10] = radius * Math.sin(theta);
      p[11] = 0.01;
      radLineGeo.attributes.position.needsUpdate = true;

      group.rotation.z = time * 0.1;
      group.rotation.x = Math.sin(time * 0.15) * 0.1;
    },
    dispose() {
      ringGeo.dispose();
      ringMat.dispose();
      sectorMat.dispose();
      radLineGeo.dispose();
      radLineMat.dispose();
      centerMesh.geometry.dispose();
    },
  };
}

// -------------------------------------------------------------
// 6. Solid Geometry & Cross Section (공간도형과 단면)
// -------------------------------------------------------------
export function createSolidGeometryObject({ radius = 2.8 } = {}) {
  const group = new THREE.Group();
  group.name = 'math-solid';

  // Translucent Sphere
  const sphereGeo = new THREE.SphereGeometry(radius, 32, 24);
  const sphereMat = new THREE.MeshPhysicalMaterial({
    color: MATH_COLORS.deepPlum,
    roughness: 0.18,
    metalness: 0.2,
    transmission: 0.85,
    opacity: 0.8,
    transparent: true,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(sphere);

  // Slicing Cutting Plane with Gold Ring Edge
  const cutGroup = new THREE.Group();
  const discGeo = new THREE.CircleGeometry(radius * 0.96, 64);
  const discMat = new THREE.MeshBasicMaterial({
    color: MATH_COLORS.emerald,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  cutGroup.add(disc);

  const edgeGeo = new THREE.RingGeometry(radius * 0.95, radius * 0.97, 64);
  const edgeMat = new THREE.MeshBasicMaterial({ color: MATH_COLORS.champagneGold, side: THREE.DoubleSide });
  const cutEdge = new THREE.Mesh(edgeGeo, edgeMat);
  cutGroup.add(cutEdge);

  cutGroup.rotation.x = Math.PI / 3;
  group.add(cutGroup);

  // Normal vector to cutting plane
  const normGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 1.8),
  ]);
  const normMat = new THREE.LineBasicMaterial({ color: MATH_COLORS.warmIvory, linewidth: 2 });
  const normLine = new THREE.Line(normGeo, normMat);
  cutGroup.add(normLine);

  return {
    group,
    metadata: {
      id: 'solid',
      title: '구와 평면의 교선',
      subtitle: '공간도형 · 절단면과 법선 벡터',
      formula: 'x² + y² + z² = r²',
      grade: '고등 기하',
      category: '공간도형',
      description: '3차원 공간 속 구와 평면이 만나 만드는 원형 단면. 공간좌표와 정사영의 아름다움을 시각화합니다.',
    },
    update(time) {
      cutGroup.position.z = Math.sin(time * 0.6) * 1.1;
      group.rotation.y = time * 0.18;
      group.rotation.x = time * 0.12;
    },
    dispose() {
      sphereGeo.dispose();
      sphereMat.dispose();
      discGeo.dispose();
      discMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      normGeo.dispose();
      normMat.dispose();
    },
  };
}

// -------------------------------------------------------------
// 7. Vector Space & Components (벡터와 성분 분해)
// -------------------------------------------------------------
export function createVectorObject({ length = 4.2 } = {}) {
  const group = new THREE.Group();
  group.name = 'math-vector';

  // Origin Axes
  const axisMat = new THREE.LineBasicMaterial({ color: MATH_COLORS.mutedSilver, transparent: true, opacity: 0.35 });
  const axes = new THREE.AxesHelper(length * 0.8);
  group.add(axes);

  // Main 3D Vector Arrow
  const dir = new THREE.Vector3(1, 1.2, 0.8).normalize();
  const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, MATH_COLORS.emerald, 0.7, 0.35);
  group.add(arrow);

  // Orthogonal projection lines onto planes (dotted)
  const projGeo = new THREE.BufferGeometry();
  const projPos = new Float32Array(8 * 3);
  projGeo.setAttribute('position', new THREE.BufferAttribute(projPos, 3));
  const projMat = new THREE.LineDashedMaterial({
    color: MATH_COLORS.champagneGold,
    dashSize: 0.25,
    gapSize: 0.15,
    transparent: true,
    opacity: 0.7,
  });
  const projLines = new THREE.LineSegments(projGeo, projMat);
  group.add(projLines);

  return {
    group,
    metadata: {
      id: 'vector',
      title: '공간벡터와 사영',
      subtitle: '방향과 크기 · 직교 성분 분해',
      formula: 'v = (v₁, v₂, v₃)',
      grade: '고등 기하',
      category: '벡터',
      description: '공간에서 방향과 크기를 갖는 벡터의 직교 기저 성분 분해와 사영 벡터의 동적 관계를 관찰합니다.',
    },
    update(time) {
      const vx = Math.cos(time * 0.7) * (length * 0.65);
      const vy = (Math.sin(time * 0.5) + 1.2) * (length * 0.4);
      const vz = Math.sin(time * 0.7) * (length * 0.65);

      const curDir = new THREE.Vector3(vx, vy, vz);
      const curLen = curDir.length();
      curDir.normalize();

      arrow.setDirection(curDir);
      arrow.setLength(curLen, 0.7, 0.35);

      // Projections: (vx, vy, vz) -> (vx, 0, vz) -> (vx, 0, 0) & (0, 0, vz)
      const p = projGeo.attributes.position.array;
      // Head to floor (vx,vy,vz) -> (vx,0,vz)
      p[0] = vx; p[1] = vy; p[2] = vz;
      p[3] = vx; p[4] = 0; p[5] = vz;
      // Floor to x-axis (vx,0,vz) -> (vx,0,0)
      p[6] = vx; p[7] = 0; p[8] = vz;
      p[9] = vx; p[10] = 0; p[11] = 0;
      // Floor to z-axis (vx,0,vz) -> (0,0,vz)
      p[12] = vx; p[13] = 0; p[14] = vz;
      p[15] = 0; p[16] = 0; p[17] = vz;
      projGeo.attributes.position.needsUpdate = true;
      projLines.computeLineDistances();

      group.rotation.y = time * 0.12;
    },
    dispose() {
      axes.dispose();
      projGeo.dispose();
      projMat.dispose();
    },
  };
}

// -------------------------------------------------------------
// 8. Cubic Function & Tangent Slope (함수와 미적분 접선)
// -------------------------------------------------------------
export function createCalculusObject({ xRange = 3.6 } = {}) {
  const group = new THREE.Group();
  group.name = 'math-calculus';

  // Function: y = 0.28 * (x³ - 3x)
  // Derivative: y' = 0.28 * (3x² - 3) = 0.84 * (x² - 1)
  const f = (x) => 0.26 * (x * x * x - 3.2 * x);
  const df = (x) => 0.26 * (3 * x * x - 3.2);

  const curvePts = [];
  const steps = 96;
  for (let i = 0; i <= steps; i++) {
    const x = -xRange + (i / steps) * (2 * xRange);
    curvePts.push(new THREE.Vector3(x, f(x), 0));
  }
  const curvePath = new THREE.CatmullRomCurve3(curvePts);
  const tubeGeo = new THREE.TubeGeometry(curvePath, 96, 0.05, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: MATH_COLORS.emerald,
    emissive: 0x1A4736,
    roughness: 0.3,
    metalness: 0.6,
  });
  const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
  group.add(tubeMesh);

  // Coordinate Grid Box
  const grid = new THREE.GridHelper(xRange * 2.2, 8, MATH_COLORS.champagneGold, 0x2A2030);
  grid.rotation.x = Math.PI / 2;
  grid.position.z = -0.05;
  group.add(grid);

  // Traveling Tangent Point & Line
  const tracer = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshBasicMaterial({ color: MATH_COLORS.warmIvory })
  );
  group.add(tracer);

  const tangentGeo = new THREE.BufferGeometry();
  const tanPos = new Float32Array(6);
  tangentGeo.setAttribute('position', new THREE.BufferAttribute(tanPos, 3));
  const tangentMat = new THREE.LineBasicMaterial({
    color: MATH_COLORS.champagneGold,
    linewidth: 2,
  });
  const tangentLine = new THREE.Line(tangentGeo, tangentMat);
  group.add(tangentLine);

  return {
    group,
    metadata: {
      id: 'calculus',
      title: '삼차함수와 접선의 기울기',
      subtitle: '미분계수와 순간변화율의 기하학',
      formula: 'f\'(x) = lim_{Δx→0} Δy/Δx',
      grade: '고등 수2 · 미적분',
      category: '함수·미적분',
      description: '삼차함수 곡선 위를 움직이는 접선의 기울기. 극대·극소와 변곡점에서의 미분계수 변화를 직관적으로 체험합니다.',
    },
    update(time) {
      const curX = Math.sin(time * 0.75) * (xRange * 0.85);
      const curY = f(curX);
      const slope = df(curX);

      tracer.position.set(curX, curY, 0.05);

      // Tangent segment: x in [curX - 1.2, curX + 1.2]
      const dx = 1.2;
      const p = tangentGeo.attributes.position.array;
      p[0] = curX - dx;
      p[1] = curY - slope * dx;
      p[2] = 0.06;
      p[3] = curX + dx;
      p[4] = curY + slope * dx;
      p[5] = 0.06;
      tangentGeo.attributes.position.needsUpdate = true;

      group.rotation.y = Math.sin(time * 0.15) * 0.2;
      group.rotation.x = Math.cos(time * 0.12) * 0.1;
    },
    dispose() {
      tubeGeo.dispose();
      tubeMat.dispose();
      grid.dispose();
      tracer.geometry.dispose();
      tangentGeo.dispose();
      tangentMat.dispose();
    },
  };
}

// -------------------------------------------------------------
// Object Factory Registry (8 Families)
// -------------------------------------------------------------
export const MATH_OBJECT_FACTORIES = Object.freeze({
  polyhedra: createPolyhedronObject,
  ellipse: createEllipseObject,
  parabola: createParabolaObject,
  hyperbola: createHyperbolaObject,
  circle: createCircleSectorObject,
  solid: createSolidGeometryObject,
  vector: createVectorObject,
  calculus: createCalculusObject,
});
