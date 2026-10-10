import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PALETTES = [
  [0x17294a, 0x507fbb, 0x83b986, 0x355c46], [0x302950, 0x7f65b5, 0xd0a66f, 0x745b50],
  [0x133541, 0x4594a2, 0xc0bc86, 0x70845a], [0x38273e, 0xa44e63, 0xdca27b, 0x754c4d],
  [0x1c3540, 0x3e7687, 0xb2b1a0, 0x696f78], [0x2e2b4d, 0x6f6fa9, 0xb7b17d, 0x667653],
  [0x3e2d25, 0xa27753, 0xd4bd8d, 0x8e754b], [0x15354a, 0x426eae, 0x9bc7d0, 0x526b81],
  [0x3c2537, 0x9b4567, 0xd2945a, 0x744752], [0x1b3340, 0x367880, 0x93ba8d, 0x526d4f],
  [0x352c43, 0x7768a2, 0xceb485, 0x72604f], [0x202e4d, 0x557eaa, 0x9db8a5, 0x4d705c],
];
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
function makePlanetTexture(index) {
  const palette = PALETTES[index % PALETTES.length];
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 192;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const image = context.createImageData(canvas.width, canvas.height);
  const rgb = palette.map((hex) => [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]);
  const random = randomFrom(index * 991 + 47);
  const seed = random() * 7;
  for (let y = 0; y < canvas.height; y += 1) {
    const lat = (y / canvas.height - .5) * Math.PI;
    for (let x = 0; x < canvas.width; x += 1) {
      const lon = (x / canvas.width) * Math.PI * 2;
      const waveA = Math.sin(lon * (2.1 + index % 3) + Math.sin(lat * 4.3 + seed) * 1.4);
      const waveB = Math.cos(lon * 3.4 - lat * 5.6 + seed) * .46;
      const waveC = Math.sin(lon * 7.2 + lat * 9.1 + seed * 2.4) * .19;
      const continents = waveA + waveB + waveC;
      const cloud = Math.sin(lon * 11.3 - lat * 3.2 + seed) + Math.cos(lon * 5.8 + lat * 8.2 - seed) * .55;
      const ocean = continents > .66;
      const color = rgb[!ocean && cloud > 1.08 ? 1 : ocean ? 0 : continents > .88 ? 3 : 2];
      const shade = .76 + .24 * (Math.sin(lon * 3.2 + Math.cos(lat * 8 + seed)) * .5 + .5) + (random() - .5) * .07;
      const ptr = (y * canvas.width + x) * 4;
      image.data[ptr] = Math.min(255, color[0] * shade);
      image.data[ptr + 1] = Math.min(255, color[1] * shade);
      image.data[ptr + 2] = Math.min(255, color[2] * shade);
      image.data[ptr + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
function makeOrbit(radius, aspect, material, segments = 112) {
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const angle = i / segments * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius * aspect));
  }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
}
function makeDocumentTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fffdf7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#d5deeb';
  ctx.lineWidth = 2;
  ctx.strokeRect(3, 3, 122, 154);
  ctx.fillStyle = '#344663';
  ctx.fillRect(18, 22, 47, 5);
  ctx.fillStyle = '#a9b8ce';
  ctx.fillRect(18, 38, 90, 2);
  ctx.fillRect(18, 47, 74, 2);
  ctx.fillRect(18, 62, 93, 2);
  ctx.fillRect(18, 72, 82, 2);
  ctx.fillRect(18, 82, 88, 2);
  ctx.fillRect(18, 102, 58, 2);
  ctx.fillRect(18, 112, 88, 2);
  ctx.fillRect(18, 122, 74, 2);
  ctx.strokeStyle = '#b9a0dc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(96, 137, 10, 0, Math.PI * 2);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  return texture;
}

export function createOrbitWorld({ canvas, onGroup, onExam, onBlackhole, onFrame }) {
  const mobile = window.innerWidth < 760;
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
    size: mobile ? .32 : .22, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: .8, depthWrite: false,
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
  const sharedPlanetGeometry = new THREE.SphereGeometry(1, 36, 24);
  const sharedAtmosphereGeometry = new THREE.SphereGeometry(1, 28, 18);
  const sharedDataStarGeometry = new THREE.SphereGeometry(.2, 14, 10);
  const sharedDataGlowGeometry = new THREE.SphereGeometry(.43, 14, 10);
  const sharedPaperGeometry = new THREE.PlaneGeometry(.68, .84);
  const sharedPaperTexture = makeDocumentTexture();
  const sharedPaperMaterial = new THREE.MeshStandardMaterial({
    map: sharedPaperTexture, color: 0xffffff, roughness: .7, metalness: .01,
    side: THREE.DoubleSide, emissive: 0x201b2d, emissiveIntensity: .13,
  });
  const planetMaterials = new Map();
  const atmosphereMaterials = new Map();
  const dataStarMaterials = new Map();
  const dataGlowMaterials = new Map();
  const groups = new Map();
  const entities = new Map();
  let catalogPoints = null;
  let catalogPointFiles = [];
  let visibleCatalogPointNodes = [];
  let visibleCatalogPointFiles = [];
  let catalogPointPositions = null;
  let focusedGroupId = '';
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
  let rafId = 0;
  let pointerStart = null;
  const frameInterval = mobile ? 1000 / 24 : 1000 / 30;

  function getPlanetMaterial(index) {
    if (!planetMaterials.has(index)) {
      const material = new THREE.MeshStandardMaterial({ map: makePlanetTexture(index), roughness: .82, metalness: .04 });
      planetMaterials.set(index, material);
    }
    return planetMaterials.get(index);
  }
  function getAtmosphereMaterial(index) {
    if (!atmosphereMaterials.has(index)) {
      atmosphereMaterials.set(index, new THREE.MeshBasicMaterial({
        color: ORBIT_COLORS[index % ORBIT_COLORS.length], transparent: true, opacity: .13,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
    }
    return atmosphereMaterials.get(index);
  }
  function getDataStarMaterial(index) {
    if (!dataStarMaterials.has(index)) dataStarMaterials.set(index, new THREE.MeshBasicMaterial({ color: ORBIT_COLORS[index % ORBIT_COLORS.length] }));
    return dataStarMaterials.get(index);
  }
  function getDataGlowMaterial(index) {
    if (!dataGlowMaterials.has(index)) dataGlowMaterials.set(index, new THREE.MeshBasicMaterial({
      color: ORBIT_COLORS[index % ORBIT_COLORS.length], transparent: true, opacity: .22,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    return dataGlowMaterials.get(index);
  }
  function hashAngle(text) {
    return (hashText(text) % 100000) / 100000 * Math.PI * 2;
  }
  function groupOrbitRadius(index, groupCount) {
    return 10 + index * (72 / Math.max(1, groupCount - 1));
  }
  function createGroupNode(data, index, reusing, groupCount) {
    const palette = index % PALETTES.length;
    const color = ORBIT_COLORS[palette];
    const root = reusing || new THREE.Group();
    if (reusing) {
      root.clear();
    }
    root.name = data.id;
    const orbitRadius = groupOrbitRadius(index, groupCount);
    const hubScale = data.mode === 'school' ? 1.08 : data.mode === 'grade' ? .88 : .78;
    const hub = new THREE.Group();
    root.add(hub);
    const globe = new THREE.Mesh(sharedPlanetGeometry, getPlanetMaterial(palette));
    globe.scale.setScalar(hubScale);
    globe.userData.kind = 'group';
    globe.userData.groupId = data.id;
    hub.add(globe);
    const atmosphere = new THREE.Mesh(sharedAtmosphereGeometry, getAtmosphereMaterial(palette));
    atmosphere.scale.setScalar(hubScale * 1.14);
    hub.add(atmosphere);
    const isSelectedDimension = data.mode === 'unit';
    if (isSelectedDimension || data.mode === 'grade' || index % 4 === 1) {
      const lens = new THREE.Mesh(new THREE.TorusGeometry(hubScale * 1.38, .035, 7, 72), new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: .68, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      lens.rotation.x = Math.PI / 2.6 + index * .1;
      hub.add(lens);
    }
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
      id: data.id, name: data.name, mode: data.mode, count: data.count, root, hub, globe,
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
      if (object.geometry && object.geometry !== sharedPlanetGeometry && object.geometry !== sharedAtmosphereGeometry) object.geometry.dispose();
      if (object.material && ![...planetMaterials.values(), ...atmosphereMaterials.values()].includes(object.material)) object.material.dispose();
    });
  }
  function createDataNode(exam, groupId, slot) {
    const token = new THREE.Group();
    const palette = hashText(exam.file) % ORBIT_COLORS.length;
    const glow = new THREE.Mesh(sharedDataGlowGeometry, getDataGlowMaterial(palette));
    const star = new THREE.Mesh(sharedDataStarGeometry, getDataStarMaterial(palette));
    star.userData.file = exam.file;
    star.userData.exam = exam;
    star.userData.kind = 'exam';
    const paper = new THREE.Mesh(sharedPaperGeometry, sharedPaperMaterial);
    paper.scale.setScalar(.82);
    paper.visible = false;
    token.add(glow, star, paper);
    token.userData.file = exam.file;
    token.userData.exam = exam;
    token.userData.kind = 'exam';
    dataRoot.add(token);
    return {
      file: exam.file, exam, groupId, slot, token, star, paper, pickMesh: star,
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
    sharedPaperMaterial.emissiveIntensity = searching ? .58 : .13;
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
      size: mobile ? .2 : .14, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: .92, blending: THREE.AdditiveBlending, depthWrite: false,
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
    if (running && pageVisible) simTime += elapsed;
    const animate = running && pageVisible;

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
      const nearPaper = entity.groupId === focusedGroupId || camera.position.distanceTo(entity.position) < 30;
      entity.paper.visible = nearPaper;
      entity.star.scale.setScalar(nearPaper ? .78 : 1.18);
    }

    sun.rotation.y = simTime * .022;
    sunHalo.rotation.y = simTime * .01;
    blackholeRoot.rotation.y = simTime * .035;
    disk.rotation.z = simTime * .075;
    lensA.rotation.y += animate ? elapsed * .008 : 0;
    lensB.rotation.y -= animate ? elapsed * .006 : 0;
    if (cameraTransition) {
      const t = Math.min(1, (now - cameraTransition.start) / cameraTransition.duration);
      const eased = t * t * (3 - 2 * t);
      camera.position.lerpVectors(cameraTransition.fromPosition, cameraTransition.toPosition, eased);
      controls.target.lerpVectors(cameraTransition.fromTarget, cameraTransition.toTarget, eased);
      if (t >= 1) cameraTransition = null;
    }
    if (!cameraTransition && focusedGroupId) {
      const focusedGroup = groups.get(focusedGroupId);
      if (focusedGroup) {
        focusedGroup.globe.getWorldPosition(tempB);
        tempB.sub(controls.target);
        camera.position.add(tempB);
        controls.target.add(tempB);
      }
    }
    controls.update();
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
    const groupAngles = new Map([...groups.values()].map((group) => [group.id, group.angle]));
    onFrame?.({ groups: groupPositions, exams: examPositions, examFiles: catalogPointFiles, groupAngles, cameraPosition: camera.position.toArray() });
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
  function focusGroup(id) {
    const group = groups.get(id);
    if (!group) return;
    focusedGroupId = id;
    const target = group.globe.getWorldPosition(new THREE.Vector3());
    const fromPosition = camera.position.clone();
    const fromTarget = controls.target.clone();
    const direction = camera.position.clone().sub(controls.target).normalize();
    const toPosition = target.clone().addScaledVector(direction, 17);
    toPosition.y += 2.6;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      camera.position.copy(toPosition);
      controls.target.copy(target);
      cameraTransition = null;
      controls.update();
      return;
    }
    cameraTransition = { fromPosition, fromTarget, toPosition, toTarget: target, start: performance.now(), duration: 900 };
  }
  function resetCamera() {
    const toTarget = new THREE.Vector3(0, 0, 0);
    focusedGroupId = '';
    const toPosition = new THREE.Vector3(0, 48, 92);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      camera.position.copy(toPosition);
      controls.target.copy(toTarget);
      cameraTransition = null;
      controls.update();
      return;
    }
    cameraTransition = {
      fromPosition: camera.position.clone(), fromTarget: controls.target.clone(),
      toPosition, toTarget, start: performance.now(), duration: 980,
    };
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
      for (const group of groups.values()) clearGroupNode(group);
      for (const entity of entities.values()) removeDataNode(entity);
      disposeConstellations();
      starGeometry.dispose();
      sharedPlanetGeometry.dispose();
      sharedAtmosphereGeometry.dispose();
      sharedDataStarGeometry.dispose();
      sharedDataGlowGeometry.dispose();
      sharedPaperGeometry.dispose();
      sharedPaperTexture.dispose();
      sharedPaperMaterial.dispose();
      nebulaTexture.dispose();
      nebulaSky.geometry.dispose();
      nebulaSky.material.dispose();
      for (const material of planetMaterials.values()) {
        material.map?.dispose();
        material.dispose();
      }
      for (const material of atmosphereMaterials.values()) material.dispose();
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
