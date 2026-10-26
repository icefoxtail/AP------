// AP Math Playground Universe - 3D Scene Controller (v1.0)
// Orchestrates Three.js cosmos, lighting, celestial nodes, Raycaster, and cinematic camera flight.

import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { getVisualProfile } from './visual-profile.js';
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
} from './math-objects.js';
import { MathGalaxyMotionEngine } from './math-motion.js';

export function createMathUniverse({
  canvas,
  onSelectNode,
  onHoverNode,
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
  scene.background = new THREE.Color(MATH_COLORS.obsidian);
  scene.fog = new THREE.FogExp2(MATH_COLORS.obsidian, 0.0032);

  // 3. Camera Setup
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 600);
  const initialCamPos = new THREE.Vector3(0, 10, isMobile ? 58 : 46);
  const initialCamTarget = new THREE.Vector3(0, 0, 0);
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

  // 5. Lighting: Multi-point Jewel Studio Lighting
  const ambientLight = new THREE.AmbientLight(MATH_COLORS.deepPlum, 1.6);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(MATH_COLORS.warmIvory, 1.8);
  keyLight.position.set(30, 45, 35);
  scene.add(keyLight);

  const emeraldRimLight = new THREE.DirectionalLight(MATH_COLORS.emerald, 1.5);
  emeraldRimLight.position.set(-35, -20, -25);
  scene.add(emeraldRimLight);

  const amethystFillLight = new THREE.PointLight(MATH_COLORS.softAmethyst, 1.2, 100);
  amethystFillLight.position.set(0, -30, 25);
  scene.add(amethystFillLight);

  // 6. Deep Space Background: Far & Near Starfields
  function createStarfield(count, radiusMin, radiusMax, size, opacity) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const starPalette = [
      new THREE.Color(MATH_COLORS.warmIvory),
      new THREE.Color(MATH_COLORS.champagneGold),
      new THREE.Color(MATH_COLORS.emerald),
      new THREE.Color(MATH_COLORS.softAmethyst),
      new THREE.Color(MATH_COLORS.mutedSilver),
    ];

    for (let i = 0; i < count; i++) {
      const r = radiusMin + Math.random() * (radiusMax - radiusMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = starPalette[Math.floor(Math.random() * starPalette.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geo, mat);
  }

  const farStars = createStarfield(profile.backgroundFarStars, 80, 220, isMobile ? 0.45 : 0.65, 0.45);
  scene.add(farStars);

  const nearStars = createStarfield(profile.backgroundNearStars, 25, 75, isMobile ? 0.7 : 0.9, 0.7);
  scene.add(nearStars);

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

  // Hero 1: Polyhedra Dual Crystal (정다면체)
  addCelestial({
    builder: createPolyhedronObject,
    options: { radius: isMobile ? 3.2 : 3.8 },
    basePos: new THREE.Vector3(-14, 3, -6),
    orbitRadius: 2.2,
    orbitSpeed: 0.12,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.04, 0.08, 0.02),
  });

  // Hero 2: Ellipse & Dual Foci (타원과 두 초점)
  addCelestial({
    builder: createEllipseObject,
    options: { a: isMobile ? 6.2 : 7.6, b: isMobile ? 3.8 : 4.6 },
    basePos: new THREE.Vector3(15, -2, -8),
    orbitRadius: 2.5,
    orbitSpeed: -0.09,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.02, 0.05, 0.01),
  });

  // Hero 3: Parabola, Focus & Directrix (포물선과 준선)
  addCelestial({
    builder: createParabolaObject,
    options: { p: 2.0, yRange: isMobile ? 5.2 : 6.2 },
    basePos: new THREE.Vector3(0, 11, -16),
    orbitRadius: 1.8,
    orbitSpeed: 0.14,
    orbitPlane: 'xy',
    selfRot: new THREE.Vector3(0.03, 0.02, 0.06),
  });

  // Secondary 4: Hyperbola (쌍곡선)
  addCelestial({
    builder: createHyperbolaObject,
    options: { a: 2.8, b: 2.1 },
    basePos: new THREE.Vector3(-26, -11, -26),
    orbitRadius: 3.2,
    orbitSpeed: -0.08,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.02, 0.04, 0.02),
  });

  // Secondary 5: Circle & Sector (원과 부채꼴)
  addCelestial({
    builder: createCircleSectorObject,
    options: { radius: 3.8 },
    basePos: new THREE.Vector3(26, 12, -28),
    orbitRadius: 2.8,
    orbitSpeed: 0.11,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.01, 0.05, 0.03),
  });

  // Secondary 6: Solid Geometry (공간도형)
  addCelestial({
    builder: createSolidGeometryObject,
    options: { radius: 2.8 },
    basePos: new THREE.Vector3(-20, 16, -34),
    orbitRadius: 2.4,
    orbitSpeed: -0.1,
    orbitPlane: 'xy',
    selfRot: new THREE.Vector3(0.05, 0.06, 0.02),
  });

  // Secondary 7: Vector Space (공간벡터)
  addCelestial({
    builder: createVectorObject,
    options: { length: 4.2 },
    basePos: new THREE.Vector3(19, -15, -24),
    orbitRadius: 2.6,
    orbitSpeed: 0.13,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.02, 0.08, 0.01),
  });

  // Secondary 8: Cubic Calculus (삼차함수와 접선)
  addCelestial({
    builder: createCalculusObject,
    options: { xRange: 3.6 },
    basePos: new THREE.Vector3(0, -13, -18),
    orbitRadius: 2.0,
    orbitSpeed: -0.12,
    orbitPlane: 'xz',
    selfRot: new THREE.Vector3(0.02, 0.03, 0.04),
  });

  // 9. Raycasting & User Interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  let pointerDownPos = { x: 0, y: 0, time: 0 };
  let hoveredNode = null;
  let selectedNode = null;

  // Camera flight interpolation state
  let flightState = null;

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    motionEngine.setPointer(mouse.x, mouse.y);

    if (flightState) return;

    raycaster.setFromCamera(mouse, camera);
    const meshes = [];
    celestialRegistry.forEach((c) => {
      c.group.traverse((ch) => {
        if (ch.isMesh) meshes.push(ch);
      });
    });

    const intersects = raycaster.intersectObjects(meshes, false);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const id = hitMesh.userData.celestialId;
      const meta = hitMesh.userData.celestialMeta;
      if (hoveredNode !== id) {
        hoveredNode = id;
        canvas.style.cursor = 'pointer';
        if (typeof onHoverNode === 'function') onHoverNode(meta, e.clientX, e.clientY);
      }
    } else {
      if (hoveredNode !== null) {
        hoveredNode = null;
        canvas.style.cursor = 'default';
        if (typeof onHoverNode === 'function') onHoverNode(null);
      }
    }
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
    farStars.rotation.y = time * 0.005;
    nearStars.rotation.y = time * 0.009;
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
      renderer.dispose();
      celestialRegistry.forEach((c) => c.dispose());
      motionEngine.dispose();
    },
  };
}
