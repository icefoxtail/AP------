// AP Math Playground Universe - 3D Scene Controller (v1.0)
// Orchestrates Three.js cosmos, lighting, celestial nodes, Raycaster, and cinematic camera flight.

import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { getVisualProfile } from './visual-profile.js';
import { createArchiveBackdrop } from './archive-backdrop.js';
import {
  MATH_COLORS,
  createPolyhedronObject,
  createEllipseObject,
  createParabolaObject,
  createHyperbolaObject,
  createCircleSectorObject,
  createSolidGeometryObject,
  createVectorObject,
  createCalculusObject,
  createMobiusObject,
  createGoldenSpiralObject,
  createHyperboloidObject,
  createTorusVillarceauObject,
} from './math-objects.js';
import { MathGalaxyMotionEngine, createFrameClock } from './math-motion.js';
import { createExploration } from './exploration.js';

export function createMathUniverse({
  canvas,
  onSelectNode,
  onTravelComplete,
  onStateChange,
  onFrame,
} = {}) {
  const profile = getVisualProfile();
  const isMobile = profile.isMobile;

  // 1. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // 2. Scene & Fog (Obsidian Black)
  const scene = new THREE.Scene();
  // Reveal the original Archive deepfield beneath this transparent WebGL canvas.
  scene.background = null;
  scene.fog = new THREE.FogExp2(MATH_COLORS.obsidian, 0.0032);

  // 3. Camera Setup
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 600);
  // Slight oblique opening: add depth/parallax without changing the celestial layout or zoom.
  const initialCamPos = new THREE.Vector3(isMobile ? -7.5 : -6, 11, isMobile ? 58 : 46);
  const initialCamTarget = new THREE.Vector3(0.8, -0.4, 0);
  camera.position.copy(initialCamPos);

  // 4. Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 14;
  controls.maxDistance = 130;
  controls.maxPolarAngle = Math.PI * 0.85;
  controls.minPolarAngle = Math.PI * 0.15;
  controls.target.copy(initialCamTarget);

  // 5. Lighting: Multi-point Jewel Studio Lighting & Cosmic Environment Map
  const ambientLight = new THREE.AmbientLight(MATH_COLORS.deepPlum, 1.5);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(MATH_COLORS.warmIvory, 2.0);
  keyLight.position.set(32, 48, 38);
  scene.add(keyLight);

  const emeraldRimLight = new THREE.DirectionalLight(MATH_COLORS.emerald, 1.6);
  emeraldRimLight.position.set(-35, -20, -25);
  scene.add(emeraldRimLight);

  const crystalBackLight = new THREE.DirectionalLight(MATH_COLORS.champagneGold, 1.5);
  crystalBackLight.position.set(-22, 18, -28);
  scene.add(crystalBackLight);

  const amethystFillLight = new THREE.PointLight(MATH_COLORS.softAmethyst, 1.3, 110);
  amethystFillLight.position.set(0, -32, 28);
  scene.add(amethystFillLight);

  // Cosmic Reflection Environment for Crystal Facets & Metals
  function createCosmicEnvironmentMap() {
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#241433');   // deep plum zenith
    grad.addColorStop(0.35, '#120c1c'); // upper atmosphere
    grad.addColorStop(0.5, '#161022');  // horizon with emerald & gold tint
    grad.addColorStop(0.7, '#0a0812');
    grad.addColorStop(1, '#050408');    // obsidian nadir

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = 'rgba(85, 203, 163, 0.08)';
    ctx.beginPath();
    ctx.ellipse(180, 110, 160, 40, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(216, 183, 126, 0.06)';
    ctx.beginPath();
    ctx.ellipse(360, 140, 180, 50, -Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(envCanvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  scene.environment = createCosmicEnvironmentMap();

  // 6. Distant Archive sky: radial star sprites, faint spiral galaxies and gas.
  // All mathematical celestial objects and their interaction logic remain intact.
  const backdrop = createArchiveBackdrop({ scene, profile, isMobile });

  // Nebula Atmosphere Sphere
  const nebulaTexture = new THREE.TextureLoader().load(new URL('./assets/galaxy-atmosphere.png', import.meta.url).href);
  nebulaTexture.colorSpace = THREE.SRGBColorSpace;
  const nebulaSky = new THREE.Mesh(
    new THREE.SphereGeometry(240, 32, 24),
    new THREE.MeshBasicMaterial({
      map: nebulaTexture,
      color: 0x5a3d60,
      side: THREE.BackSide,
      transparent: true,
      opacity: profile.nebulaOpacity,
      depthWrite: false,
    })
  );
  scene.add(nebulaSky);

  // 7. Motion Engine
  const motionEngine = new MathGalaxyMotionEngine({ scene, camera, isMobile });

  // 8. Construct & Place the 12 Celestial Objects
  const celestialRegistry = [];

  function addCelestial({ builder, options, basePos, orbitRadius, orbitSpeed, orbitPlane, selfRot }) {
    const obj = builder({ ...options, isMobile });
    // The translation anchor follows the original orbit. The visual's rotation
    // and the new satellite layout do not inherit one another's transforms.
    const anchor = new THREE.Group();
    anchor.name = `anchor-${obj.metadata.id}`;
    anchor.add(obj.group);
    scene.add(anchor);

    const motionNode = motionEngine.registerCelestialNode({
      id: obj.metadata.id,
      group: anchor,
      rotationGroup: obj.group,
      updater: obj.update.bind(obj),
      basePosition: basePos,
      orbitRadius,
      orbitSpeed,
      orbitPlane,
      selfRotationSpeed: selfRot,
    });
    obj.update(0, 0); // Reduced-motion and first-frame users see complete figures.

    // Tag for Raycasting
    obj.group.traverse((child) => {
      if (child.isMesh) {
        child.userData.celestialId = obj.metadata.id;
        child.userData.celestialMeta = obj.metadata;
      }
    });

    celestialRegistry.push({
      ...obj,
      anchor,
      motionNode,
    });
  }

  // =========================================================================
  // 3-Tier Galaxy Spatial Staging (Foreground Hero / Midground / Deep Space)
  // 12 Mathematical Celestial Bodies Distributed Across Quadrants & Depth
  // =========================================================================

  // [Tier 1: Foreground Hero - z = -7 ~ -9]
  // Hero 1: Polyhedra Dual Crystal (정다면체 결정) - Left Hero
  addCelestial({
    builder: createPolyhedronObject,
    options: { radius: isMobile ? 3.3 : 3.9 },
    basePos: new THREE.Vector3(-15, 3.2, -7),
    orbitRadius: 2.0,
    orbitSpeed: 0.11,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.04, 0.08, 0.02),
  });

  // Hero 2: Ellipse & Dual Foci (타원과 두 초점) - Right Hero
  addCelestial({
    builder: createEllipseObject,
    options: { a: isMobile ? 6.4 : 7.6, b: isMobile ? 3.8 : 4.4 },
    basePos: new THREE.Vector3(16, -2.8, -9),
    orbitRadius: 2.2,
    orbitSpeed: -0.09,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.02, 0.05, 0.01),
  });

  // [Tier 2: Midground Constellation - z = -19 ~ -28]
  // Celestial 3: Parabola, Focus & Directrix (포물선과 준선) - Midground Top
  addCelestial({
    builder: createParabolaObject,
    options: { p: 2.1, yRange: isMobile ? 5.4 : 6.4 },
    basePos: new THREE.Vector3(0, 11.5, -19),
    orbitRadius: 1.8,
    orbitSpeed: 0.13,
    orbitPlane: 'xy',
    selfRot: new THREE.Vector3(0.03, 0.02, 0.05),
  });

  // Celestial 4: Cubic Calculus (삼차함수와 접선) - Midground Bottom
  addCelestial({
    builder: createCalculusObject,
    options: { xRange: 3.6 },
    basePos: new THREE.Vector3(0, -12.5, -21),
    orbitRadius: 2.0,
    orbitSpeed: -0.11,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.02, 0.03, 0.04),
  });

  // Celestial 5: Möbius Strip (뫼비우스의 띠) - Midground Upper-Left
  addCelestial({
    builder: createMobiusObject,
    options: { radius: isMobile ? 3.0 : 3.6, width: 1.1 },
    basePos: new THREE.Vector3(-22, 12.0, -25),
    orbitRadius: 2.2,
    orbitSpeed: 0.10,
    orbitPlane: 'xy',
    selfRot: new THREE.Vector3(0.02, 0.05, 0.03),
  });

  // Celestial 6: Hyperboloid (일엽쌍곡면 타워) - Midground Upper-Right
  addCelestial({
    builder: createHyperboloidObject,
    options: { a: 1.7, c: 2.6, height: 5.0 },
    basePos: new THREE.Vector3(22, 12.5, -24),
    orbitRadius: 2.1,
    orbitSpeed: -0.10,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.03, 0.04, 0.02),
  });

  // Celestial 7: Vector Space (공간벡터) - Midground Lower-Right
  addCelestial({
    builder: createVectorObject,
    options: { length: 4.2 },
    basePos: new THREE.Vector3(21, -13.5, -25),
    orbitRadius: 2.4,
    orbitSpeed: 0.12,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.02, 0.07, 0.01),
  });

  // Celestial 8: Hyperbola (쌍곡선) - Midground Lower-Left
  addCelestial({
    builder: createHyperbolaObject,
    options: { a: 2.8, b: 2.1 },
    basePos: new THREE.Vector3(-23, -12.0, -27),
    orbitRadius: 2.6,
    orbitSpeed: -0.08,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.02, 0.04, 0.02),
  });

  // [Tier 3: Deep Space Cosmic Layer - z = -38 ~ -52]
  // Celestial 9: Golden Spiral (황금 나선과 피보나치) - Deep Space Lower-Left
  addCelestial({
    builder: createGoldenSpiralObject,
    options: { turns: 3.2 },
    basePos: new THREE.Vector3(-18, -17.0, -38),
    orbitRadius: 2.8,
    orbitSpeed: 0.08,
    orbitPlane: 'xy',
    selfRot: new THREE.Vector3(0.02, 0.03, 0.05),
  });

  // Celestial 10: Torus & Villarceau Circles (원환면과 비야르소 원) - Deep Space Lower-Right
  addCelestial({
    builder: createTorusVillarceauObject,
    options: { R: 3.4, r: 1.3 },
    basePos: new THREE.Vector3(20, -18.0, -40),
    orbitRadius: 3.0,
    orbitSpeed: -0.08,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.03, 0.04, 0.02),
  });

  // Celestial 11: Circle & Sector (원과 부채꼴) - Deep Space Upper-Right
  addCelestial({
    builder: createCircleSectorObject,
    options: { radius: 3.8 },
    basePos: new THREE.Vector3(28, 15.0, -46),
    orbitRadius: 3.2,
    orbitSpeed: 0.09,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.01, 0.04, 0.02),
  });

  // Celestial 12: Solid Geometry (공간도형) - Deep Space Upper-Left
  addCelestial({
    builder: createSolidGeometryObject,
    options: { radius: 2.8 },
    basePos: new THREE.Vector3(-24, 18.0, -50),
    orbitRadius: 2.8,
    orbitSpeed: -0.09,
    orbitPlane: 'xy',
    selfRot: new THREE.Vector3(0.04, 0.05, 0.02),
  });

  // 9. One exploration controller owns route, camera and picking.
  controls.update();
  for (const c of celestialRegistry) {
    c.anchor.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(c.group);
    c.focusRadius = box.getBoundingSphere(new THREE.Sphere()).radius;
  }
  const exploration = createExploration({
    scene, camera, controls, canvas, celestialRegistry, motionEngine,
    onStateChange: (state, change) => {
      onStateChange?.(state, change);
      onSelectNode?.(celestialRegistry.find(c => c.metadata.id === state.celestialId)?.metadata || null);
    },
    onFrame,
  });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    exploration.resize();
  }
  window.addEventListener('resize', onResize, { passive: true });

  // Active clocks stop when the tab is hidden. Pausing ambient motion does not
  // erase an independently selected mathematical relationship.
  let running = !document.hidden, disposed = false;
  let activeTime = 0, animId = null;
  const frameClock = createFrameClock(profile.maxFps, performance.now());
  function animate(now) {
    if (!running || disposed) return;
    animId = requestAnimationFrame(animate);
    const dt = frameClock.sample(now);
    if (dt === null) return;
    if (!motionEngine.paused) activeTime += dt;
    motionEngine.update(activeTime, dt);
    backdrop.update(activeTime);
    nebulaSky.rotation.y = activeTime * 0.002;
    exploration.update(dt, activeTime);
    renderer.render(scene, camera);
  }
  if (running) animId = requestAnimationFrame(animate);
  function onVisibilityChange() {
    if (disposed) return;
    if (document.hidden) {
      running = false;
      if (animId) cancelAnimationFrame(animId);
    } else if (!running) {
      running = true;
      frameClock.reset(performance.now());
      animId = requestAnimationFrame(animate);
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  const api = {
    scene, camera, controls, renderer, celestialRegistry, motionEngine,
    focusOnCelestial: exploration.focusOnCelestial,
    selectConcept: exploration.selectConcept,
    resetFocus: exploration.resetFocus,
    back: exploration.back,
    getState: exploration.getState,
    replayConcept: exploration.replayConcept,
    toggleConceptPlayback: exploration.toggleConceptPlayback,
    seekConcept: exploration.seekConcept,
    setUiVisible: exploration.setUiVisible,
    toggleMotion: exploration.toggleMotion,
    triggerLabEntranceFlight(onFinished) {
      exploration.triggerLabEntranceFlight(() => { onFinished?.(); onTravelComplete?.(); });
    },
    getDebugState() {
      return {
        ...exploration.debug(),
        renderer: { ...renderer.info.render },
        resources: { ...renderer.info.memory, programs: renderer.info.programs?.length || 0 },
        representatives: celestialRegistry.length,
        webglVersion: renderer.capabilities.isWebGL2 ? 2 : 1,
      };
    },
    resize: onResize,
    dispose() {
      if (disposed) return;
      disposed = true; running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      exploration.dispose(); controls.dispose(); backdrop.dispose();
      celestialRegistry.forEach(c => c.dispose());
      motionEngine.dispose();
      scene.environment?.dispose(); nebulaTexture.dispose();
      nebulaSky.geometry.dispose(); nebulaSky.material.dispose();
      renderer.dispose();
    },
  };
  queueMicrotask(() => { if (!disposed) onStateChange?.(api.getState(), { history: 'none' }); });
  return api;
}
