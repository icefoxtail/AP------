import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ORBIT_COLORS = [0x698cbe, 0x9f8bc6, 0x63a9a6, 0xc49485, 0x8094bf, 0x8bb3a9, 0xbe9e70, 0x819cc0, 0xb887a1, 0x78a7a7, 0x9a8cc1, 0x82a6bd];
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function hashText(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return h >>> 0;
}
function randomFrom(seed) {
  let value = (seed >>> 0) || 1;
  return () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function makeGalaxyNebulaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 1, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,.34)');
  gradient.addColorStop(.2, 'rgba(255,255,255,.23)');
  gradient.addColorStop(.58, 'rgba(255,255,255,.055)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
function makeStarSpriteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(.045, 'rgba(255,252,239,.96)');
  gradient.addColorStop(.14, 'rgba(255,245,226,.72)');
  gradient.addColorStop(.34, 'rgba(213,228,255,.28)');
  gradient.addColorStop(.68, 'rgba(180,202,255,.08)');
  gradient.addColorStop(1, 'rgba(180,202,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
function makeCoreGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,244,1)');
  gradient.addColorStop(.055, 'rgba(255,242,210,.9)');
  gradient.addColorStop(.18, 'rgba(255,202,139,.4)');
  gradient.addColorStop(.4, 'rgba(222,168,255,.12)');
  gradient.addColorStop(1, 'rgba(190,168,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
function smoothStep(start, end, value) {
  const t = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
}
function makeOrbit(radius, aspect, material, segments = 112) {
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const angle = i / segments * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius * aspect));
  }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
}
export function createOrbitWorld({ canvas, onGroup, onExam, onBlackhole, onFrame, onTravel }) {
  const mobile = window.innerWidth < 760;
  const starSpriteTexture = makeStarSpriteTexture();
  const coreGlowTexture = makeCoreGlowTexture();
  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: !mobile, powerPreference: 'high-performance', preserveDrawingBuffer: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101026);
  scene.fog = new THREE.FogExp2(0x101026, .000003);
  const nebulaTexture = new THREE.TextureLoader().load(new URL('../assets/galaxy-atmosphere.png', import.meta.url).href);
  nebulaTexture.colorSpace = THREE.SRGBColorSpace;
  const nebulaSky = new THREE.Mesh(new THREE.SphereGeometry(340, 64, 40), new THREE.MeshBasicMaterial({
    map: nebulaTexture, color: 0xaaa0d6, side: THREE.BackSide, transparent: true, opacity: .78, depthWrite: false,
  }));
  scene.add(nebulaSky);
  const camera = new THREE.PerspectiveCamera(mobile ? 68 : 60, 1, .1, 480);
  camera.position.set(0, 48, 92);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = .07;
  controls.enablePan = true;
  controls.panSpeed = .75;
  controls.rotateSpeed = .52;
  controls.zoomSpeed = .8;
  controls.minDistance = 9;
  controls.maxDistance = 160;
  controls.minPolarAngle = .12;
  controls.maxPolarAngle = Math.PI * .48;

  scene.add(new THREE.HemisphereLight(0xaac2ec, 0x111425, 1.34));
  const sunLight = new THREE.PointLight(0xe8cfac, 92, 190, 1.55);
  scene.add(sunLight);
  const violetFill = new THREE.PointLight(0x9380e4, 17, 125, 2);
  violetFill.position.set(-40, 28, 34);
  scene.add(violetFill);

  const starCount = mobile ? 520 : 1620;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const skyRandom = randomFrom(81802026);
  const starTints = [new THREE.Color(0xb1d5ff), new THREE.Color(0xf2d8b5), new THREE.Color(0xa7a3fa), new THREE.Color(0x9bf0df)];
  for (let i = 0; i < starCount; i += 1) {
    const radius = 150 + skyRandom() * 150;
    const phi = skyRandom() * Math.PI * 2;
    const z = skyRandom() * 2 - 1;
    const scale = Math.sqrt(1 - z * z);
    starPositions[i * 3] = Math.cos(phi) * scale * radius;
    starPositions[i * 3 + 1] = z * radius * .57;
    starPositions[i * 3 + 2] = Math.sin(phi) * scale * radius;
    const tint = starTints[Math.floor(skyRandom() * starTints.length)];
    starColors[i * 3] = tint.r;
    starColors[i * 3 + 1] = tint.g;
    starColors[i * 3 + 2] = tint.b;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({
    map: starSpriteTexture, size: mobile ? .5 : .42, sizeAttenuation: true,
    vertexColors: true, transparent: true, opacity: .88, depthWrite: false, alphaTest: .012,
  })));

  const sunRoot = new THREE.Group();
  scene.add(sunRoot);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.5, 40, 28), new THREE.MeshStandardMaterial({
    color: 0xf0d7af, emissive: 0xe2a86a, emissiveIntensity: 1.55, roughness: .55,
  }));
  sunRoot.add(sun);
  const sunCorona = new THREE.Mesh(new THREE.SphereGeometry(1.86, 36, 24), new THREE.MeshBasicMaterial({
    color: 0xffc982, transparent: true, opacity: .14, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sunRoot.add(sunCorona);
  const sunHalo = new THREE.Mesh(new THREE.TorusGeometry(2.2, .035, 8, 112), new THREE.MeshBasicMaterial({
    color: 0xffd59c, transparent: true, opacity: .44, blending: THREE.AdditiveBlending,
  }));
  sunHalo.rotation.x = Math.PI / 2.7;
  sunRoot.add(sunHalo);

  const blackholeRoot = new THREE.Group();
  blackholeRoot.position.set(mobile ? 5 : 40, mobile ? -8 : -1.2, mobile ? 33 : 28);
  scene.add(blackholeRoot);
  const blackhole = new THREE.Mesh(new THREE.SphereGeometry(1.42, 36, 28), new THREE.MeshBasicMaterial({ color: 0x02030a }));
  blackhole.userData.kind = 'blackhole';
  blackholeRoot.add(blackhole);
  const disk = new THREE.Mesh(new THREE.RingGeometry(1.65, 3.45, 96), new THREE.MeshBasicMaterial({
    color: 0x8f75d4, side: THREE.DoubleSide, transparent: true, opacity: .34, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  disk.rotation.x = Math.PI / 2.25;
  disk.scale.set(1.28, .48, 1);
  blackholeRoot.add(disk);
  const lensA = new THREE.Mesh(new THREE.TorusGeometry(2.27, .13, 12, 96), new THREE.MeshBasicMaterial({
    color: 0xe2a8ed, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  lensA.rotation.set(.72, .12, -.35);
  blackholeRoot.add(lensA);
  const lensB = new THREE.Mesh(new THREE.TorusGeometry(2.94, .055, 8, 110), new THREE.MeshBasicMaterial({
    color: 0xe9c18b, transparent: true, opacity: .75, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  lensB.rotation.set(.91, -.2, .4);
  blackholeRoot.add(lensB);

  const groupRoot = new THREE.Group();
  const dataRoot = new THREE.Group();
  const constellationRoot = new THREE.Group();
  scene.add(groupRoot, dataRoot, constellationRoot);
  const sharedGroupPickGeometry = new THREE.SphereGeometry(1.55, 16, 12);
  const sharedGroupPickMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, colorWrite: false, depthWrite: false });
  const sharedDataStarGeometry = new THREE.SphereGeometry(.2, 24, 18);
  const galaxyNebulaTexture = makeGalaxyNebulaTexture();
  const sharedCoreGlowTexture = coreGlowTexture;
  const sharedStarSpriteTexture = starSpriteTexture;
  const dataStarMaterials = new Map();
  const dataGlowMaterials = new Map();
  const groups = new Map();
  const entities = new Map();
  // A single on-demand orbit; no question mesh is created for unopened exams.
  const sharedQuestionGeometry = new THREE.SphereGeometry(.095, 10, 8);
  const sharedQuestionMaterial = new THREE.MeshBasicMaterial({ color: 0xc5e7ff, toneMapped: false });
  const sharedQuestionLineMaterial = new THREE.LineBasicMaterial({ color: 0x84bde0, transparent: true, opacity: .3, depthWrite: false });
  let questionOrbit = null;
  const questionProjections = new Map();
  let catalogPoints = null;
  let catalogPointFiles = [];
  let visibleCatalogPointNodes = [];
  let visibleCatalogPointFiles = [];
  let catalogPointPositions = null;
  let focusedGroupId = '';
  let selectedExamFile = '';
  const constellations = [];
  let pendingLines = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const planetPicks = [];
  const examPicks = [];
  const blackholePicks = [blackhole];
  const tempA = new THREE.Vector3();
  const tempB = new THREE.Vector3();
  const tempProjected = new THREE.Vector3();
  const orbitAxis = new THREE.Vector3(1, 0, 0);
  let simTime = 0;
  let lastFrame = performance.now();
  let running = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pageVisible = !document.hidden;
  let cameraTransition = null;
  let instantTravel = false;
  let rafId = 0;
  let pointerStart = null;
  const frameInterval = mobile ? 1000 / 24 : 1000 / 30;

  function getDataStarMaterial(index, bright) {
    const key = index * 2 + bright;
    if (!dataStarMaterials.has(key)) {
      const color = new THREE.Color(ORBIT_COLORS[index % ORBIT_COLORS.length]);
      dataStarMaterials.set(key, new THREE.MeshStandardMaterial({
        color: color.clone().lerp(new THREE.Color(0xffffff), .16),
        emissive: color, emissiveIntensity: bright ? .44 : .34,
        roughness: .54, metalness: .02, toneMapped: false,
      }));
    }
    return dataStarMaterials.get(key);
  }
  function getDataGlowMaterial(index, bright) {
    const key = index * 2 + bright;
    if (!dataGlowMaterials.has(key)) dataGlowMaterials.set(key, new THREE.SpriteMaterial({
      map: sharedCoreGlowTexture, color: ORBIT_COLORS[index % ORBIT_COLORS.length],
      transparent: true, opacity: bright ? .34 : .27, alphaTest: .012,
      blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, toneMapped: false,
    }));
    return dataGlowMaterials.get(key);
  }
  function hashAngle(text) {
    return (hashText(text) % 100000) / 100000 * Math.PI * 2;
  }
  function groupOrbitRadius(index, groupCount) {
    return 10 + index * (72 / Math.max(1, groupCount - 1));
  }
  function makeGalaxyDisc(data, palette) {
    const random = randomFrom(hashText(data.id) ^ 0x61c88647);
    const starCount = 216;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const baseColor = new THREE.Color(ORBIT_COLORS[palette]);
    const white = new THREE.Color(0xe5f4ff);
    const warm = new THREE.Color(0xffd2a1);
    for (let i = 0; i < starCount; i += 1) {
      const arm = i % 4;
      const spread = Math.sqrt(random());
      const core = i % 5 === 0;
      const radius = core ? Math.sqrt(random()) * .72 : .22 + spread * 1.78;
      const angle = arm * Math.PI / 2 + radius * 1.62 + (random() - .5) * (.26 + radius * .035);
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (random() - .5) * (.1 + radius * .035);
      positions[i * 3 + 2] = Math.sin(angle) * radius * .7;
      const color = baseColor.clone().lerp(white, Math.max(.24, (1 - spread) * .68 + random() * .18));
      if (radius < .85 && random() > .45) color.lerp(warm, .14);
      color.toArray(colors, i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }
  function makeNebulaCloud(data, palette) {
    const random = randomFrom(hashText(data.id) ^ 0x9e3779b9);
    const count = 54;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColor = new THREE.Color(ORBIT_COLORS[palette]);
    for (let i = 0; i < count; i += 1) {
      const radius = Math.sqrt(random()) * 1.95;
      const angle = random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (random() - .5) * .42;
      positions[i * 3 + 2] = Math.sin(angle) * radius * .72;
      const color = baseColor.clone().lerp(new THREE.Color(0xa9bfff), random() * .42);
      color.toArray(colors, i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }
  function createGroupNode(data, index, reusing, groupCount) {
    const palette = hashText(data.id) % ORBIT_COLORS.length;
    const color = ORBIT_COLORS[palette];
    const root = reusing || new THREE.Group();
    if (reusing) {
      root.clear();
    }
    root.name = data.id;
    const orbitRadius = groupOrbitRadius(index, groupCount);
    const hubScale = data.mode === 'school' ? 1 : data.mode === 'grade' ? .88 : .78;
    const hub = new THREE.Group();
    root.add(hub);
    hub.scale.setScalar(hubScale);
    const cloud = new THREE.Points(makeNebulaCloud(data, palette), new THREE.PointsMaterial({
      map: galaxyNebulaTexture, vertexColors: true, size: 1.72, sizeAttenuation: true,
      transparent: true, opacity: .12, blending: THREE.AdditiveBlending, depthWrite: false, alphaTest: .01,
    }));
    cloud.rotation.x = -.18;
    hub.add(cloud);
    const galaxy = new THREE.Points(makeGalaxyDisc(data, palette), new THREE.PointsMaterial({
      map: sharedStarSpriteTexture, vertexColors: true, size: .22, sizeAttenuation: true,
      transparent: true, opacity: .95, alphaTest: .018,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    galaxy.rotation.x = -.18;
    hub.add(galaxy);
    const nucleusGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: sharedCoreGlowTexture, color: 0xffe2b7, transparent: true, opacity: .42,
      blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, toneMapped: false,
    }));
    nucleusGlow.scale.set(1.82, 1.48, 1);
    hub.add(nucleusGlow);
    const nucleus = new THREE.Mesh(sharedDataStarGeometry, new THREE.MeshBasicMaterial({ color: 0xfff4dc, toneMapped: false }));
    nucleus.scale.setScalar(.82);
    hub.add(nucleus);
    const globe = new THREE.Mesh(sharedGroupPickGeometry, sharedGroupPickMaterial);
    globe.userData.kind = 'group';
    globe.userData.groupId = data.id;
    hub.add(globe);
    const shellMaterials = [];
    for (let shell = 0; shell < 3; shell += 1) {
      const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: .045 - shell * .006, depthWrite: false });
      shellMaterials.push(material);
      const orbit = makeOrbit(2.8 + shell * 1.72, .8 + shell * .035, material, 80);
      orbit.rotation.x = .18 + shell * .21 + index * .035;
      orbit.rotation.z = (shell % 2 ? -1 : 1) * (.12 + index * .018);
      root.add(orbit);
    }
    const orbitPath = makeOrbit(orbitRadius, .9 + index % 4 * .035, new THREE.LineBasicMaterial({
      color, transparent: true, opacity: .075, depthWrite: false,
    }), 128);
    scene.add(orbitPath);
    const animateLayout = running && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetAngle = index * GOLDEN_ANGLE;
    const initialAngle = animateLayout ? hashAngle(data.id) : targetAngle;
    const transitionStart = performance.now();
    return {
      id: data.id, name: data.name, mode: data.mode, count: data.count, root, hub, globe, galaxy, cloud, nucleusGlow,
      orbitPath, palette, color, index, orbitRadius, targetRadius: orbitRadius,
      angle: initialAngle, layoutAngle: initialAngle, layoutFromAngle: initialAngle,
      targetAngle, layoutTransitionStart: transitionStart, layoutTransitionDuration: animateLayout ? 900 : 0, orbitPhase: 0,
      speed: .034 + (hashText(data.id) % 7) * .006,
      shellMaterials, drawnFiles: data.files.slice(),
    };
  }
  function clearGroupNode(group) {
    groupRoot.remove(group.root);
    scene.remove(group.orbitPath);
    group.orbitPath.geometry.dispose();
    group.orbitPath.material.dispose();
    for (const material of group.shellMaterials) material.dispose();
    group.root.traverse((object) => {
      if (object.geometry && object.geometry !== sharedGroupPickGeometry && object.geometry !== sharedDataStarGeometry) object.geometry.dispose();
      if (object.material && object.material !== sharedGroupPickMaterial) object.material.dispose();
    });
  }
  function createDataNode(exam, groupId, slot) {
    const token = new THREE.Group();
    const signature = hashText(exam.file);
    const palette = signature % ORBIT_COLORS.length;
    const bright = (signature >>> 11) & 1;
    const size = .92 + ((signature >>> 17) % 7) * .03;
    const glow = new THREE.Sprite(getDataGlowMaterial(palette, bright));
    glow.scale.setScalar(.76 * size);
    const star = new THREE.Mesh(sharedDataStarGeometry, getDataStarMaterial(palette, bright));
    star.scale.setScalar(.96 * size);
    star.userData.file = exam.file;
    star.userData.exam = exam;
    star.userData.kind = 'exam';
    token.add(glow, star);
    token.userData.file = exam.file;
    token.userData.exam = exam;
    token.userData.kind = 'exam';
    dataRoot.add(token);
    return {
      file: exam.file, exam, groupId, slot, token, glow, star, pickMesh: star, size, selectedMix: 0,
      position: new THREE.Vector3(), phase: hashAngle(exam.file), radius: 2.8 + (slot % 3) * 1.72,
      speed: .22 + (hashText(exam.file) % 13) * .025,
    };
  }
  function removeDataNode(entity) {
    dataRoot.remove(entity.token);
  }
  function smoothAngle(current, target, factor) {
    let delta = (target - current + Math.PI) % (Math.PI * 2);
    if (delta < 0) delta += Math.PI * 2;
    delta -= Math.PI;
    return current + delta * factor;
  }

  function setData({ groups: nextGroups, exams: nextExams, details = nextExams, searching = false }) {
    document.body.classList.toggle('search-active', searching);
    const oldGroups = [...groups.values()];
    const oldGroupsById = new Map(oldGroups.map((group) => [group.id, group]));
    // Reserve every exact-ID match before assigning any fallback roots. A filtered
    // group can occur before its old exact match in the next ordering.
    const exactMatches = new Map();
    for (const data of nextGroups) {
      const exact = oldGroupsById.get(data.id);
      if (exact && !exactMatches.has(data.id)) exactMatches.set(data.id, exact);
    }
    const reservedRoots = new Set([...exactMatches.values()].map((group) => group.root));
    const unused = new Set(oldGroups.filter((group) => !reservedRoots.has(group.root)));
    const newGroupMap = new Map();
    for (let index = 0; index < nextGroups.length; index += 1) {
      const data = nextGroups[index];
      let group = exactMatches.get(data.id);
      let reused = false;
      if (group) {
        exactMatches.delete(data.id);
        reused = true;
      } else if (oldGroups.length) {
        group = [...unused][0];
        if (group) {
          unused.delete(group);
          reused = true;
        }
      }
      if (group) clearGroupNode(group);
      const next = createGroupNode(data, index, reused ? group.root : null, nextGroups.length);
      if (reused) {
        next.angle = group.angle;
        next.layoutAngle = group.layoutAngle;
        next.orbitPhase = group.orbitPhase;
        next.orbitRadius = group.orbitRadius;
        next.targetRadius = groupOrbitRadius(index, nextGroups.length);
        const targetAngle = index * GOLDEN_ANGLE;
        const animateLayout = running && !matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (Math.abs(smoothAngle(group.targetAngle, targetAngle, 1) - group.targetAngle) < .0001) {
          next.layoutFromAngle = group.layoutFromAngle;
          next.layoutTransitionStart = group.layoutTransitionStart;
          next.layoutTransitionDuration = group.layoutTransitionDuration;
        } else if (animateLayout) {
          next.layoutFromAngle = group.layoutAngle;
          next.layoutTransitionStart = performance.now();
          next.layoutTransitionDuration = 900;
        } else {
          next.layoutFromAngle = targetAngle;
          next.layoutAngle = targetAngle;
          next.layoutTransitionStart = performance.now();
          next.layoutTransitionDuration = 0;
        }
        next.targetAngle = targetAngle;
        next.speed = group.speed;
      }
      groupRoot.add(next.root);
      next.root.position.set(Math.cos(next.angle) * next.orbitRadius, Math.sin(next.angle * .72) * 1.25, Math.sin(next.angle) * next.orbitRadius * .9);
      newGroupMap.set(data.id, next);
    }
    for (const group of unused) clearGroupNode(group);
    groups.clear();
    for (const [id, group] of newGroupMap) groups.set(id, group);

    const selectedFiles = new Set(details.map((exam) => exam.file));
    for (const [file, entity] of entities) {
      if (!selectedFiles.has(file)) {
        removeDataNode(entity);
        entities.delete(file);
      }
    }
    const groupByFile = new Map();
    for (const group of nextGroups) for (const file of group.files) groupByFile.set(file, group.id);
    const groupSlots = new Map(nextGroups.map((group) => [group.id, 0]));
    catalogPointFiles = [];
    visibleCatalogPointNodes = [];
    visibleCatalogPointFiles = [];
    const slotByFile = new Map();
    for (const exam of nextExams) {
      const id = groupByFile.get(exam.file);
      if (!id) continue;
      const slot = groupSlots.get(id) || 0;
      groupSlots.set(id, slot + 1);
      slotByFile.set(exam.file, slot);
      const node = {
        file: exam.file, groupId: id, slot, phase: hashAngle(exam.file),
        radius: 2.8 + (slot % 3) * 1.72,
        speed: .22 + (hashText(exam.file) % 13) * .025,
        palette: hashText(exam.file) % ORBIT_COLORS.length,
      };
      catalogPointFiles.push(exam.file);
      if (!selectedFiles.has(exam.file)) {
        visibleCatalogPointNodes.push(node);
        visibleCatalogPointFiles.push(exam.file);
      }
    }
    rebuildCatalogPoints();
    for (const exam of details) {
      const id = groupByFile.get(exam.file);
      if (!id) continue;
      const slot = slotByFile.get(exam.file) || 0;
      const existing = entities.get(exam.file);
      if (existing) {
        existing.exam = exam;
        existing.token.userData.exam = exam;
        existing.pickMesh.userData.exam = exam;
        existing.groupId = id;
        existing.slot = slot;
        existing.radius = 2.8 + (slot % 3) * 1.72;
      } else {
        entities.set(exam.file, createDataNode(exam, id, slot));
      }
    }
    planetPicks.length = 0;
    for (const group of groups.values()) planetPicks.push(group.globe);
    examPicks.length = 0;
    for (const entity of entities.values()) examPicks.push(entity.pickMesh);
    createConstellations();
  }

  function rebuildCatalogPoints() {
    if (catalogPoints) {
      dataRoot.remove(catalogPoints);
      catalogPoints.geometry.dispose();
      catalogPoints.material.dispose();
    }
    const positions = new Float32Array(visibleCatalogPointNodes.length * 3);
    const colors = new Float32Array(visibleCatalogPointNodes.length * 3);
    for (let i = 0; i < visibleCatalogPointNodes.length; i += 1) {
      new THREE.Color(ORBIT_COLORS[visibleCatalogPointNodes[i].palette % ORBIT_COLORS.length]).toArray(colors, i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', positionAttribute);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    catalogPoints = new THREE.Points(geometry, new THREE.PointsMaterial({
      map: sharedStarSpriteTexture, size: mobile ? .34 : .25, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: .94, alphaTest: .012,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    catalogPoints.userData.kind = 'catalog-points';
    catalogPoints.userData.files = visibleCatalogPointFiles;
    catalogPointPositions = positions;
    dataRoot.add(catalogPoints);
  }

  function disposeConstellations() {
    for (const line of constellations) {
      constellationRoot.remove(line.line, line.spark, line.fromDot, line.toDot);
      line.line.geometry.dispose();
      line.line.material.dispose();
      line.spark.geometry.dispose();
      line.spark.material.dispose();
      line.fromDot.geometry.dispose();
      line.fromDot.material.dispose();
      line.toDot.geometry.dispose();
      line.toDot.material.dispose();
    }
    constellations.length = 0;
  }
  function createConstellations() {
    disposeConstellations();
    for (const link of pendingLines) {
      const from = entities.get(link.from);
      const to = entities.get(link.to);
      if (!from || !to) continue;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      const material = new THREE.LineBasicMaterial({ color: link.color || 0xb8a0ff, transparent: true, opacity: .83, blending: THREE.AdditiveBlending, depthWrite: false });
      const line = new THREE.Line(geometry, material);
      line.renderOrder = 8;
      const spark = new THREE.Mesh(new THREE.SphereGeometry(.11, 8, 6), new THREE.MeshBasicMaterial({
        color: 0xf2efff, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const fromDot = new THREE.Mesh(new THREE.SphereGeometry(.13, 8, 6), new THREE.MeshBasicMaterial({
        color: link.color || 0xb8a0ff, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const toDot = fromDot.clone();
      constellationRoot.add(line, spark, fromDot, toDot);
      constellations.push({ from, to, line, spark, fromDot, toDot, phase: constellations.length * .57 });
    }
  }
  function setConstellations(anchorFile, relatedFiles, color) {
    pendingLines = anchorFile ? relatedFiles.map((file) => ({ from: anchorFile, to: file, color })) : [];
    createConstellations();
  }

  function makeBlackholeLabel() {
    const label = document.createElement('button');
    label.className = 'blackhole-hit';
    label.type = 'button';
    label.setAttribute('aria-label', '유사문제 은행 입구 열기');
    label.innerHTML = '<span class="blackhole-symbol" aria-hidden="true">◉</span><span><b>유사문제 은행</b><small>빛 고리 너머로</small></span>';
    document.getElementById('blackholeLabels').append(label);
    label.addEventListener('click', () => onBlackhole?.());
    return label;
  }
  const blackholeLabel = makeBlackholeLabel();

  function setFrame() {
    const now = performance.now();
    if (now - lastFrame < frameInterval) {
      rafId = requestAnimationFrame(setFrame);
      return;
    }
    const elapsed = Math.max(0, (now - lastFrame) / 1000);
    const dt = Math.min(elapsed, .08);
    lastFrame = now;
    if (running && pageVisible && !selectedExamFile) simTime += elapsed;
    const animate = running && pageVisible && !selectedExamFile;

    for (const group of groups.values()) {
      group.orbitRadius += (group.targetRadius - group.orbitRadius) * Math.min(1, dt * 1.4);
      const layoutProgress = group.layoutTransitionDuration === 0 ? 1 : Math.min(1, (now - group.layoutTransitionStart) / group.layoutTransitionDuration);
      const layoutEase = layoutProgress * layoutProgress * (3 - 2 * layoutProgress);
      group.layoutAngle = smoothAngle(group.layoutFromAngle, group.targetAngle, layoutEase);
      if (animate) group.orbitPhase += group.speed * elapsed;
      group.angle = group.layoutAngle + group.orbitPhase;
      const emphasized = group.id === focusedGroupId;
      group.orbitPath.material.opacity = emphasized ? .42 : .004;
      for (let i = 0; i < group.shellMaterials.length; i += 1) group.shellMaterials[i].opacity = emphasized ? .34 - i * .035 : .012 - i * .002;
      group.galaxy.material.opacity = emphasized ? 1 : .92;
      group.cloud.material.opacity = emphasized ? .2 : .13;
      group.nucleusGlow.material.opacity = emphasized ? .52 : .34;
      const x = Math.cos(group.angle) * group.orbitRadius;
      const z = Math.sin(group.angle) * group.orbitRadius * .9;
      const y = Math.sin(group.angle * .72) * 1.25;
      group.root.position.set(x, y, z);
      group.hub.rotation.y = simTime * .14;
      group.orbitPath.scale.setScalar(group.orbitRadius / Math.max(group.targetRadius, 1));
    }

    for (let i = 0; i < visibleCatalogPointNodes.length; i += 1) {
      const node = visibleCatalogPointNodes[i];
      const group = groups.get(node.groupId);
      if (!group) continue;
      const angle = node.phase + simTime * node.speed;
      tempA.set(Math.cos(angle) * node.radius, Math.sin(angle * 1.45) * .65, Math.sin(angle) * node.radius * .82);
      tempA.applyAxisAngle(orbitAxis, .16 + (node.slot % 3) * .22);
      tempA.add(group.root.position);
      catalogPointPositions[i * 3] = tempA.x;
      catalogPointPositions[i * 3 + 1] = tempA.y;
      catalogPointPositions[i * 3 + 2] = tempA.z;
    }
    if (catalogPoints) catalogPoints.geometry.attributes.position.needsUpdate = true;

    for (const entity of entities.values()) {
      const group = groups.get(entity.groupId);
      if (!group) continue;
      const orbitalAngle = entity.phase + simTime * entity.speed;
      tempA.set(Math.cos(orbitalAngle) * entity.radius, Math.sin(orbitalAngle * 1.45) * .65, Math.sin(orbitalAngle) * entity.radius * .82);
      tempA.applyAxisAngle(orbitAxis, .16 + (entity.slot % 3) * .22);
      tempA.add(group.root.position);
      // A detailed star replaces its point LOD, so both representations use the
      // same orbital position with no interpolation lag or duplicate hit target.
      entity.position.copy(tempA);
      entity.token.position.copy(entity.position);
      entity.token.rotation.y = Math.sin(simTime * .6 + entity.phase) * .12;
      entity.token.rotation.z = Math.cos(simTime * .3 + entity.phase) * .045;
      const distance = camera.position.distanceTo(entity.position);
      const selected = entity.file === selectedExamFile ? 1 : 0;
      entity.selectedMix += (selected - entity.selectedMix) * Math.min(1, dt * 10);
      const nearGlow = 1 - smoothStep(26, 52, distance);
      entity.star.scale.setScalar(.96 * entity.size * (1 + entity.selectedMix * .045));
      entity.glow.scale.setScalar((.7 + nearGlow * .16) * entity.size * (1 + entity.selectedMix * .23));
    }

    sun.rotation.y = simTime * .022;
    sunHalo.rotation.y = simTime * .01;
    blackholeRoot.rotation.y = simTime * .035;
    disk.rotation.z = simTime * .075;
    lensA.rotation.y += animate ? elapsed * .008 : 0;
    lensB.rotation.y -= animate ? elapsed * .006 : 0;
    if (cameraTransition) {
      const t = Math.min(1, (now - cameraTransition.start) / cameraTransition.duration);
      // Quintic ease-in/out: real camera travel, restrained acceleration and deceleration.
      const eased = t < .5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
      camera.position.lerpVectors(cameraTransition.fromPosition, cameraTransition.toPosition, eased);
      controls.target.lerpVectors(cameraTransition.fromTarget, cameraTransition.toTarget, eased);
      if (t >= 1) { cameraTransition = null; onTravel?.(''); }
    }
    if (!cameraTransition && focusedGroupId && !selectedExamFile) {
      const focusedGroup = groups.get(focusedGroupId);
      if (focusedGroup) {
        focusedGroup.globe.getWorldPosition(tempB);
        tempB.sub(controls.target);
        camera.position.add(tempB);
        controls.target.add(tempB);
      }
    }
    controls.update();
    if (questionOrbit) {
      const center = entities.get(questionOrbit.file);
      if (center) {
        questionOrbit.root.position.copy(center.position);
        questionOrbit.root.quaternion.copy(camera.quaternion);
        questionOrbit.root.updateMatrixWorld(true);
      }
    }
    for (const relation of constellations) {
      const a = relation.from.position;
      const b = relation.to.position;
      const position = relation.line.geometry.getAttribute('position');
      position.setXYZ(0, a.x, a.y, a.z);
      position.setXYZ(1, b.x, b.y, b.z);
      position.needsUpdate = true;
      relation.line.geometry.computeBoundingSphere();
      relation.fromDot.position.copy(a);
      relation.toDot.position.copy(b);
      const progress = (Math.sin(simTime * .42 + relation.phase) + 1) * .5;
      relation.spark.position.lerpVectors(a, b, progress);
    }

    const width = renderer.domElement.clientWidth || window.innerWidth;
    const height = renderer.domElement.clientHeight || window.innerHeight;
    const projectPoint = (object) => {
      object.getWorldPosition(tempProjected);
      const depth = camera.position.distanceTo(tempProjected);
      tempProjected.project(camera);
      return {
        x: (tempProjected.x * .5 + .5) * width,
        y: (-tempProjected.y * .5 + .5) * height,
        depth,
        visible: tempProjected.z < 1 && tempProjected.z > -1 && Math.abs(tempProjected.x) < 1.16 && Math.abs(tempProjected.y) < 1.16,
      };
    };
    const groupPositions = new Map();
    for (const group of groups.values()) groupPositions.set(group.id, projectPoint(group.globe));
    const examPositions = new Map();
    for (const entity of entities.values()) examPositions.set(entity.file, projectPoint(entity.pickMesh));
    const holePoint = projectPoint(blackhole);
    blackholeLabel.style.display = holePoint.visible ? 'flex' : 'none';
    blackholeLabel.style.left = holePoint.x + 'px';
    blackholeLabel.style.top = (holePoint.y - 24) + 'px';
    if (questionOrbit) {
      for (const marker of questionOrbit.markers) {
        marker.mesh.getWorldPosition(tempProjected);
        const depth = camera.position.distanceTo(tempProjected);
        tempProjected.project(camera);
        const projected = questionProjections.get(marker.key);
        projected.x = (tempProjected.x * .5 + .5) * width;
        projected.y = (-tempProjected.y * .5 + .5) * height;
        projected.visible = tempProjected.z > -1 && tempProjected.z < 1
          && Math.abs(tempProjected.x) < .98 && Math.abs(tempProjected.y) < .98;
        projected.depth = depth;
      }
    }
    const groupAngles = new Map([...groups.values()].map((group) => [group.id, group.angle]));
    onFrame?.({ groups: groupPositions, exams: examPositions, questions: questionProjections, examFiles: catalogPointFiles, groupAngles, cameraPosition: camera.position.toArray() });
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(setFrame);
  }

  function setSize() {
    const width = Math.max(1, canvas.clientWidth || window.innerWidth);
    const height = Math.max(1, canvas.clientHeight || window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 760 ? 1.15 : 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  function travelTo(target, distance, lift = 2) {
    const direction = camera.position.clone().sub(controls.target).normalize();
    const position = target.clone().addScaledVector(direction, distance);
    position.y += lift;
    const far = controls.target.distanceTo(target) > 24;
    if (instantTravel || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cameraTransition = null;
      camera.position.copy(position);
      controls.target.copy(target);
      controls.update();
      onTravel?.('');
      return;
    }
    cameraTransition = {
      fromPosition: camera.position.clone(), fromTarget: controls.target.clone(),
      toPosition: position, toTarget: target,
      start: performance.now(), duration: far ? 1100 : 510,
    };
    onTravel?.(far ? 'warp' : 'flight');
  }
  function focusGroup(id) {
    const group = groups.get(id);
    if (!group) return;
    focusedGroupId = id;
    travelTo(group.globe.getWorldPosition(new THREE.Vector3()), 17, 2.6);
  }
  function focusExam(file) {
    const entity = entities.get(file);
    if (!entity) return false;
    focusedGroupId = entity.groupId;
    travelTo(entity.position.clone(), 15, 1.8);
    return true;
  }
  function resetCamera() {
    focusedGroupId = '';
    travelTo(new THREE.Vector3(), 92, 0);
  }
  function finishTravel() {
    if (!cameraTransition) return;
    camera.position.copy(cameraTransition.toPosition);
    controls.target.copy(cameraTransition.toTarget);
    cameraTransition = null;
    controls.update();
    onTravel?.('');
  }
  function snapshotNavigation() {
    return { position: camera.position.toArray(), target: controls.target.toArray(), focusedGroupId };
  }
  function restoreNavigation(snapshot) {
    const valid = snapshot && [snapshot.position, snapshot.target].every((arr) =>
      Array.isArray(arr) && arr.length === 3 && arr.every(Number.isFinite));
    if (!valid) return false;
    cameraTransition = null;
    onTravel?.('');
    focusedGroupId = groups.has(snapshot.focusedGroupId) ? snapshot.focusedGroupId : '';
    camera.position.fromArray(snapshot.position);
    controls.target.fromArray(snapshot.target);
    controls.update();
    return true;
  }
  function clearQuestionOrbit() {
    if (!questionOrbit) return;
    dataRoot.remove(questionOrbit.root);
    for (const line of questionOrbit.lines) line.geometry.dispose();
    questionOrbit = null;
    questionProjections.clear();
  }
  function setQuestionOrbit(file, rows) {
    clearQuestionOrbit();
    if (!file || !entities.has(file) || !Array.isArray(rows) || !rows.length) return false;
    const root = new THREE.Group();
    const markers = [];
    const lines = [];
    const rings = rows.length > 18 ? 2 : 1;
    const counts = Array.from({ length: rings }, () => 0);
    for (let i = 0; i < rows.length; i += 1) counts[i % rings]++;
    const ordinals = Array.from({ length: rings }, () => 0);
    for (let ring = 0; ring < rings; ring += 1) {
      const radius = ring ? 2.85 : 1.95;
      const points = [];
      for (let step = 0; step <= 96; step += 1) {
        const angle = step * Math.PI * 2 / 96;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * .78, 0));
      }
      const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), sharedQuestionLineMaterial);
      root.add(orbit);
      lines.push(orbit);
    }
    for (let i = 0; i < rows.length; i += 1) {
      const ring = i % rings;
      const ordinal = ordinals[ring]++;
      const angle = ordinal / counts[ring] * Math.PI * 2 - Math.PI / 2;
      const radius = ring ? 2.85 : 1.95;
      const mesh = new THREE.Mesh(sharedQuestionGeometry, sharedQuestionMaterial);
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * .78, 0);
      root.add(mesh);
      const key = String(rows[i].id);
      questionProjections.set(key, { x: 0, y: 0, depth: Infinity, visible: false });
      markers.push({ key, mesh });
    }
    dataRoot.add(root);
    questionOrbit = { file, root, markers, lines };
    return true;
  }
  function settleGroupLayouts() {
    const now = performance.now();
    for (const group of groups.values()) {
      group.layoutAngle = group.targetAngle;
      group.layoutFromAngle = group.targetAngle;
      group.layoutTransitionStart = now;
      group.layoutTransitionDuration = 0;
    }
  }
  function raycastAt(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects([...planetPicks, ...examPicks, ...(catalogPoints ? [catalogPoints] : []), ...blackholePicks], false);
    if (!hits.length) return;
    const { object: hit, index } = hits[0];
    if (hit.userData.kind === 'group') onGroup?.(hit.userData.groupId);
    else if (hit.userData.kind === 'exam') onExam?.(hit.userData.file);
    else if (hit.userData.kind === 'catalog-points') onExam?.(hit.userData.files[index]);
    else if (hit.userData.kind === 'blackhole') onBlackhole?.();
  }
  function pointerDown(event) { pointerStart = { x: event.clientX, y: event.clientY, time: performance.now() }; }
  function pointerUp(event) {
    if (!pointerStart) return;
    const moved = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    const quick = performance.now() - pointerStart.time < 800;
    pointerStart = null;
    if (moved < 5 && quick) raycastAt(event);
  }
  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointerup', pointerUp);
  window.addEventListener('resize', setSize, { passive: true });
  setSize();
  rafId = requestAnimationFrame(setFrame);

  return {
    setData,
    setSelectedExam(file) {
      selectedExamFile = typeof file === 'string' ? file : '';
      controls.enabled = !selectedExamFile;
      if (!selectedExamFile) clearQuestionOrbit();
    },
    setQuestionOrbit,
    clearQuestionOrbit,
    focusExam,
    snapshotNavigation,
    restoreNavigation,
    cancelTravel() { cameraTransition = null; onTravel?.(''); },
    finishTravel,
    setInstantTravel(value) { instantTravel = Boolean(value); if (instantTravel) finishTravel(); },
    setConstellations(anchorFile, relatedFiles, color) {
      pendingLines.length = 0;
      if (anchorFile) for (const file of relatedFiles) pendingLines.push({ from: anchorFile, to: file, color });
      createConstellations();
    },
    focusGroup,
    resetCamera,
    setMotion(value) { running = Boolean(value); if (!running) settleGroupLayouts(); lastFrame = performance.now(); return running; },
    toggleMotion() { running = !running; if (!running) settleGroupLayouts(); lastFrame = performance.now(); return running; },
    setPageVisible(value) { pageVisible = Boolean(value); lastFrame = performance.now(); },
    resize: setSize,
    clearFocus() { resetCamera(); },
    dispose() {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('resize', setSize);
      controls.dispose();
      clearQuestionOrbit();
      sharedQuestionGeometry.dispose();
      sharedQuestionMaterial.dispose();
      sharedQuestionLineMaterial.dispose();
      for (const group of groups.values()) clearGroupNode(group);
      for (const entity of entities.values()) removeDataNode(entity);
      disposeConstellations();
      starGeometry.dispose();
      sharedGroupPickGeometry.dispose();
      sharedGroupPickMaterial.dispose();
      galaxyNebulaTexture.dispose();
      sharedCoreGlowTexture.dispose();
      sharedStarSpriteTexture.dispose();
      sharedDataStarGeometry.dispose();
      nebulaTexture.dispose();
      nebulaSky.geometry.dispose();
      nebulaSky.material.dispose();
      for (const material of dataStarMaterials.values()) material.dispose();
      for (const material of dataGlowMaterials.values()) material.dispose();
      if (catalogPoints) {
        dataRoot.remove(catalogPoints);
        catalogPoints.geometry.dispose();
        catalogPoints.material.dispose();
      }
      renderer.dispose();
    },
  };
}
