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
import { MathGalaxyMotionEngine } from './math-motion.js';

export function createMathUniverse({
  canvas,
  onSelectNode,
  onTravelComplete,
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

  // 8. Construct & Place the 8 Celestial Objects
  const celestialRegistry = [];

  function addCelestial({ builder, options, basePos, orbitRadius, orbitSpeed, orbitPlane, selfRot }) {
    const obj = builder({ ...options, isMobile });
    scene.add(obj.group);

    const motionNode = motionEngine.registerCelestialNode({
      id: obj.metadata.id,
      group: obj.group,
      updater: obj.update.bind(obj),
      basePosition: basePos,
      orbitRadius,
      orbitSpeed,
      orbitPlane,
      selfRotationSpeed: selfRot,
    });

    // Tag for Raycasting
    obj.group.traverse((child) => {
      if (child.isMesh) {
        child.userData.celestialId = obj.metadata.id;
        child.userData.celestialMeta = obj.metadata;
      }
    });

    celestialRegistry.push({
      ...obj,
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

  // 9. Raycasting & User Interaction
  const raycaster = new THREE.Raycaster();
  let pointerDownPos = { x: 0, y: 0, time: 0 };
  let selectedNode = null;

  // Camera flight interpolation state
  let flightState = null;

  function onPointerMove(e) {
    // The universe is a visual showcase: update parallax only.
    // Do not raycast or render hover labels over mathematical objects.
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    motionEngine.setPointer(x, y);
  }

  function onPointerDown(e) {
    pointerDownPos = { x: e.clientX, y: e.clientY, time: performance.now() };
  }

  function onPointerUp(e) {
    const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
    const duration = performance.now() - pointerDownPos.time;
    // Differentiate drag vs genuine click
    if (dist < 6 && duration < 500) {
      if (flightState) return;

      const rect = canvas.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(clickMouse, camera);

      const meshes = [];
      celestialRegistry.forEach((c) => {
        c.group.traverse((ch) => {
          if (ch.isMesh) meshes.push(ch);
        });
      });

      const intersects = raycaster.intersectObjects(meshes, false);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const id = hit.userData.celestialId;
        const meta = hit.userData.celestialMeta;
        focusOnCelestial(id);
        if (typeof onSelectNode === 'function') onSelectNode(meta);
      } else {
        resetFocus();
        if (typeof onSelectNode === 'function') onSelectNode(null);
      }
    }
  }

  function focusOnCelestial(id) {
    const found = celestialRegistry.find((c) => c.metadata.id === id);
    if (!found) return;
    selectedNode = found;

    const targetPos = new THREE.Vector3();
    found.group.getWorldPosition(targetPos);

    // Position camera slightly offset in front of the celestial object
    const offset = new THREE.Vector3(0, 1.2, 12);
    const destination = targetPos.clone().add(offset);

    flightState = {
      fromPos: camera.position.clone(),
      toPos: destination,
      fromTarget: controls.target.clone(),
      toTarget: targetPos.clone(),
      startTime: performance.now(),
      duration: 1200,
      onComplete: () => {
        // The detail-card reset button is gone: keep orbit interaction usable.
        controls.enabled = true;
      },
    };
    controls.enabled = false;
  }

  function resetFocus() {
    selectedNode = null;
    flightState = {
      fromPos: camera.position.clone(),
      toPos: initialCamPos.clone(),
      fromTarget: controls.target.clone(),
      toTarget: initialCamTarget.clone(),
      startTime: performance.now(),
      duration: 1000,
      onComplete: () => {
        controls.enabled = true;
      },
    };
  }

  // Cinematic Entrance: Camera warps straight forward into deep space
  function triggerLabEntranceFlight(onFinished) {
    const forwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    const warpDestination = camera.position.clone().add(forwardDirection.multiplyScalar(70));

    flightState = {
      fromPos: camera.position.clone(),
      toPos: warpDestination,
      fromTarget: controls.target.clone(),
      toTarget: controls.target.clone().add(forwardDirection.multiplyScalar(70)),
      startTime: performance.now(),
      duration: 1100,
      easePower: 2.6,
      onComplete: () => {
        if (typeof onFinished === 'function') onFinished();
        if (typeof onTravelComplete === 'function') onTravelComplete();
      },
    };
    controls.enabled = false;
  }

  // Attach event listeners
  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
  canvas.addEventListener('pointerup', onPointerUp, { passive: true });

  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // 10. Animation Loop & Framerate Cap
  let running = true;
  let lastFrameTime = performance.now();
  const minFrameInterval = 1000 / profile.maxFps;
  let animId = null;

  function animate(now) {
    if (!running) return;
    animId = requestAnimationFrame(animate);

    const deltaMs = now - lastFrameTime;
    if (deltaMs < minFrameInterval) return;
    lastFrameTime = now - (deltaMs % minFrameInterval);

    const time = now * 0.001;
    const delta = Math.min(deltaMs * 0.001, 0.1);

    // Camera flight interpolation
    if (flightState) {
      const elapsed = now - flightState.startTime;
      const progress = THREE.MathUtils.clamp(elapsed / flightState.duration, 0, 1);
      const ease = flightState.easePower
        ? Math.pow(progress, flightState.easePower)
        : (progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2);

      camera.position.lerpVectors(flightState.fromPos, flightState.toPos, ease);
      controls.target.lerpVectors(flightState.fromTarget, flightState.toTarget, ease);

      if (progress >= 1) {
        const doneCb = flightState.onComplete;
        flightState = null;
        if (doneCb) doneCb();
      }
    } else {
      controls.update();
    }

    // Motion engine updates (celestial orbits + internal formulas)
    motionEngine.update(time, delta);

    // Subtle starfield counter-drift
    backdrop.update(time);
    nebulaSky.rotation.y = time * 0.002;

    renderer.render(scene, camera);
  }

  animId = requestAnimationFrame(animate);

  // Tab visibility pause
  function onVisibilityChange() {
    if (document.hidden) {
      running = false;
      if (animId) cancelAnimationFrame(animId);
    } else {
      if (!running) {
        running = true;
        lastFrameTime = performance.now();
        animId = requestAnimationFrame(animate);
      }
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Reduced motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    motionEngine.setPaused(true);
  }
  mediaQuery.addEventListener('change', (e) => {
    motionEngine.setPaused(e.matches);
  });

  return {
    scene,
    camera,
    controls,
    renderer,
    celestialRegistry,
    motionEngine,
    focusOnCelestial,
    resetFocus,
    triggerLabEntranceFlight,
    toggleMotion() {
      const next = !motionEngine.paused;
      motionEngine.setPaused(next);
      return !next;
    },
    resize: onResize,
    dispose() {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      backdrop.dispose();
      renderer.dispose();
      celestialRegistry.forEach((c) => c.dispose());
      motionEngine.dispose();
    },
  };
}
