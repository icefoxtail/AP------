import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ORBIT_COLORS = [0x77a5df, 0xb197dc, 0x66c2bb, 0xd39a86, 0x82a0d2, 0x7fc3ad, 0xd3aa70, 0x7da2ce, 0xc28da8, 0x72b9b7, 0x9f91d2, 0x7ea9c2];
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const JUPITER_EXAM_FILE = 'original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js';

// Keep the Archive's cosmic web renderer focused on galaxies and records.
const SUN_VERTEX = `varying vec3 vWorld; varying vec3 vNormal; void main(){vNormal=normalize(normalMatrix*normal);vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const SUN_FRAGMENT = `precision highp float; uniform float uTime; varying vec3 vWorld; varying vec3 vNormal;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);} float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
void main(){vec3 p=normalize(vWorld)*3.4;float n=noise(p+vec3(uTime*.025,-uTime*.012,uTime*.018));n=n*.52+noise(p*3.4+uTime*.04)*.3+noise(p*11.-uTime*.08)*.18;float fil=pow(max(noise(p*18.+vec3(uTime*.2)),.01),5.);float gran=smoothstep(.3,.78,n);float spot=smoothstep(.18,.035,length(p.xy-vec2(.42,-.22)))*.34;float limb=pow(max(dot(vNormal,normalize(cameraPosition-vWorld)),0.),.32);vec3 c=mix(vec3(.58,.08,.012),vec3(1.,.33,.025),gran);c=mix(c,vec3(1.,.9,.42),fil*.72+smoothstep(.64,.95,n)*.35);c*=.72+.32*limb;c*=1.-spot;gl_FragColor=vec4(c,1.);}`;

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
  canvas.width = 256;
  canvas.height = 160;
  const context = canvas.getContext('2d');
  const image = context.createImageData(canvas.width, canvas.height);
  const lattice = (x, y, seed) => {
    let value = Math.imul(x + seed, 374761393) + Math.imul(y - seed, 668265263);
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
  };
  const noise = (x, y, seed) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = x - x0;
    const ty = y - y0;
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const top = THREE.MathUtils.lerp(lattice(x0, y0, seed), lattice(x0 + 1, y0, seed), sx);
    const bottom = THREE.MathUtils.lerp(lattice(x0, y0 + 1, seed), lattice(x0 + 1, y0 + 1, seed), sx);
    return THREE.MathUtils.lerp(top, bottom, sy);
  };
  for (let y = 0; y < canvas.height; y += 1) {
    const py = ((y + .5) / canvas.height - .5) * 2;
    for (let x = 0; x < canvas.width; x += 1) {
      const px = ((x + .5) / canvas.width - .5) * 2;
      const broad = noise(px * 2.8 + 17.4, py * 2.8 - 3.9, 0x12);
      const medium = noise(px * 6.5, py * 6.5, 0x2b);
      const fine = noise(px * 14, py * 14, 0x51);
      const turbulence = broad * .5 + medium * .34 + fine * .16;
      const radius = Math.sqrt(px * px + py * py * 1.45);
      const warpedRadius = Math.max(0, radius + (turbulence - .5) * .32);
      const envelope = Math.exp(-warpedRadius * warpedRadius * 2.15);
      const angle = Math.atan2(py, px);
      const arm = .74 + .26 * (.5 + .5 * Math.sin(angle * 2 - radius * 6.4 + (broad - .5) * 2.4));
      const alpha = Math.min(.46, envelope * (.28 + turbulence * 1.15) * arm * .58);
      const edge = THREE.MathUtils.clamp(radius * .72, 0, 1);
      const offset = (y * canvas.width + x) * 4;
      image.data[offset] = Math.round(255 - edge * 89);
      image.data[offset + 1] = Math.round(242 - edge * 51);
      image.data[offset + 2] = Math.round(226 + edge * 29);
      image.data[offset + 3] = Math.round(alpha * 255);
    }
  }
  context.putImageData(image, 0, 0);
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
function makeDepthField(count, minRadius, radiusSpan, seed, verticalScale) {
  const random = randomFrom(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const tints = [0x93b9f0, 0x8f8bd5, 0x9ad8d0, 0xc8a3a0, 0xd3c28e].map((color) => new THREE.Color(color));
  for (let i = 0; i < count; i += 1) {
    const arm = i % 5;
    const radius = minRadius + Math.pow(random(), .62) * radiusSpan;
    const angle = arm * Math.PI * 2 / 5 + radius * .075 + (random() - .5) * .34;
    const plume = (random() - .5) * (1.8 + radius * .1);
    positions[i * 3] = Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * plume;
    positions[i * 3 + 1] = (random() - .5) * Math.max(1.2, radius * verticalScale);
    positions[i * 3 + 2] = Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * plume;
    const color = tints[Math.floor(random() * tints.length)].clone();
    color.lerp(new THREE.Color(0xe6f1ff), random() * .32);
    color.toArray(colors, i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
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
export function createOrbitWorld({ canvas, onGroup, onExam, onBlackhole, onFrame, onTravel, onScale, onFacet }) {
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
  scene.background = new THREE.Color(0x030313);
  scene.fog = new THREE.FogExp2(0x08071a, .0000012);
  const nebulaTexture = new THREE.TextureLoader().load(new URL('../assets/galaxy-atmosphere.png', import.meta.url).href);
  nebulaTexture.colorSpace = THREE.SRGBColorSpace;
  const similarityHoleTexture = new THREE.TextureLoader().load(new URL('../assets/similarity-blackhole.png', import.meta.url).href);
  similarityHoleTexture.colorSpace = THREE.SRGBColorSpace;
  const nebulaSky = new THREE.Mesh(new THREE.SphereGeometry(340, 64, 40), new THREE.MeshBasicMaterial({
    map: nebulaTexture, color: 0x9da7be, side: THREE.BackSide, transparent: true, opacity: .48, depthWrite: false,
  }));
  scene.add(nebulaSky);
  const depthFar = new THREE.Points(makeDepthField(mobile ? 2200 : 9000, 0, 68, 0x5eed2026, .035), new THREE.PointsMaterial({
    map: starSpriteTexture, size: mobile ? .28 : .38, sizeAttenuation: true, vertexColors: true,
    transparent: true, opacity: .17, depthWrite: false, alphaTest: .012, blending: THREE.AdditiveBlending, toneMapped: false,
  }));
  depthFar.renderOrder = -6;
  depthFar.rotation.set(.22, -.35, .08);
  const depthNear = new THREE.Points(makeDepthField(mobile ? 420 : 1500, 8, 64, 0x1a5eed, .055), new THREE.PointsMaterial({
    map: starSpriteTexture, size: mobile ? .34 : .52, sizeAttenuation: true, vertexColors: true,
    transparent: true, opacity: .2, depthWrite: false, alphaTest: .012, blending: THREE.AdditiveBlending, toneMapped: false,
  }));
  depthNear.renderOrder = -5;
  depthNear.rotation.set(-.16, .54, -.11);
  const orbitalFrame = new THREE.Group();
  const frameMaterials = [];
  const frameRadii = mobile ? [31, 57] : [28, 52, 78];
  frameRadii.forEach((radius, index) => {
    const material = new THREE.LineDashedMaterial({
      color: index === frameRadii.length - 1 ? 0x89a3d0 : 0x6d8abb,
      transparent: true, opacity: mobile ? .01 : .012, depthWrite: false,
      dashSize: index === frameRadii.length - 1 ? .72 : .52, gapSize: index === frameRadii.length - 1 ? 1.15 : .88,
    });
    const orbit = makeOrbit(radius, .7 + index * .08, material, 192);
    orbit.computeLineDistances();
    orbit.rotation.x = .2 + index * .13;
    orbit.rotation.z = index % 2 ? -.14 : .1;
    orbit.position.y = (index - 1) * .42;
    orbitalFrame.add(orbit);
    frameMaterials.push(material);
  });
  orbitalFrame.renderOrder = -4;
  scene.add(depthFar, depthNear, orbitalFrame);
  const camera = new THREE.PerspectiveCamera(mobile ? 68 : 60, 1, .1, 480);
  camera.position.set(0, mobile ? 30 : 40, mobile ? 66 : 94);
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
  const sunLight = new THREE.PointLight(0x9fb5ee, 18, 112, 1.55);
  scene.add(sunLight);
  const violetFill = new THREE.PointLight(0x9380e4, 9, 100, 2);
  violetFill.position.set(-40, 28, 34);
  scene.add(violetFill);

  const starCount = mobile ? 320 : 720;
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
    vertexColors: true, transparent: true, opacity: .62, depthWrite: false, alphaTest: .012,
  })));

  const sunRoot = new THREE.Group();
  scene.add(sunRoot);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.5, 40, 28), new THREE.MeshStandardMaterial({
    color: 0xbacbff, emissive: 0x7187df, emissiveIntensity: .8, roughness: .7,
  }));
  sunRoot.add(sun);
  const sunCorona = new THREE.Mesh(new THREE.SphereGeometry(1.86, 36, 24), new THREE.MeshBasicMaterial({
    color: 0x94aaff, transparent: true, opacity: .07, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sunRoot.add(sunCorona);
  const sunHalo = new THREE.Mesh(new THREE.TorusGeometry(2.2, .035, 8, 112), new THREE.MeshBasicMaterial({
    color: 0xb7caff, transparent: true, opacity: .2, blending: THREE.AdditiveBlending,
  }));
  sunHalo.rotation.x = Math.PI / 2.7;
  sunRoot.add(sunHalo);
  sunRoot.scale.setScalar(.62);

  const blackholeRoot = new THREE.Group();
  blackholeRoot.position.set(mobile ? 9 : 42, mobile ? -15 : -8, mobile ? 30 : 8);
  blackholeRoot.scale.setScalar(.72);
  scene.add(blackholeRoot);
  const blackhole = new THREE.Mesh(new THREE.SphereGeometry(1.42, 36, 28), new THREE.MeshBasicMaterial({ color: 0x02030a }));
  blackhole.userData.kind = 'blackhole';
  blackholeRoot.add(blackhole);
  const blackholeIllustration = new THREE.Sprite(new THREE.SpriteMaterial({
    map: similarityHoleTexture, color: 0xffffff, transparent: true, opacity: .88,
    alphaTest: .012, depthWrite: false, depthTest: false, toneMapped: false,
  }));
  blackholeIllustration.scale.set(8.6, 8.6, 1);
  blackholeIllustration.renderOrder = 4;
  blackholeRoot.add(blackholeIllustration);
  const disk = new THREE.Mesh(new THREE.RingGeometry(1.65, 3.45, 96), new THREE.MeshBasicMaterial({
    color: 0x8f75d4, side: THREE.DoubleSide, transparent: true, opacity: .22, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  disk.rotation.x = Math.PI / 2.25;
  disk.scale.set(1.28, .48, 1);
  blackholeRoot.add(disk);
  const lensA = new THREE.Mesh(new THREE.TorusGeometry(2.27, .13, 12, 96), new THREE.MeshBasicMaterial({
    color: 0xe2a8ed, transparent: true, opacity: .68, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  lensA.rotation.set(.72, .12, -.35);
  blackholeRoot.add(lensA);
  const lensB = new THREE.Mesh(new THREE.TorusGeometry(2.94, .055, 8, 110), new THREE.MeshBasicMaterial({
    color: 0xe9c18b, transparent: true, opacity: .58, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  lensB.rotation.set(.91, -.2, .4);
  blackholeRoot.add(lensB);

  const groupRoot = new THREE.Group();
  const dataRoot = new THREE.Group();
  const constellationRoot = new THREE.Group();
  const facetRoot = new THREE.Group();
  facetRoot.name = 'parallel-facet-galaxies';
  scene.add(groupRoot, dataRoot, constellationRoot, facetRoot);
  const sharedGroupPickGeometry = new THREE.SphereGeometry(1.55, 16, 12);
  const sharedGroupPickMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, colorWrite: false, depthWrite: false });
  const sharedDataStarGeometry = new THREE.SphereGeometry(.2, 24, 18);
  const sharedFacetPickGeometry = new THREE.SphereGeometry(.9, 16, 10);
  const sharedFacetPickMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, colorWrite: false, depthWrite: false });
  const galaxyNebulaTexture = makeGalaxyNebulaTexture();
  const sharedCoreGlowTexture = coreGlowTexture;
  const sharedStarSpriteTexture = starSpriteTexture;
  const dataStarMaterials = new Map();
  const dataGlowMaterials = new Map();
  const groups = new Map();
  const entities = new Map();
  let jupiterMaterial = null;
  let jupiterTexture = null;
  let jupiterTextureState = 'idle';
  let worldDisposed = false;
  function loadJupiterTexture() {
    if (jupiterTextureState !== 'idle') return;
    jupiterTextureState = 'loading';
    new THREE.TextureLoader().load(new URL('../assets/jupiter-2k.jpg', import.meta.url).href, (texture) => {
      if (worldDisposed) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      jupiterTexture = texture;
      jupiterMaterial = new THREE.MeshStandardMaterial({
        map: jupiterTexture, color: 0xffffff, roughness: .86, metalness: 0,
      });
      jupiterTextureState = 'loaded';
      for (const entity of entities.values()) {
        if (!entity.isJupiter) continue;
        entity.star.material = jupiterMaterial;
        entity.glow.visible = false;
      }
    }, undefined, () => {
      jupiterTextureState = 'failed';
      // Keep the original colored star and glow if the local texture is unavailable.
    });
  }
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
  let scaleMode = 'macro';
  let scaleMix = 0;
  let microAnchor = new THREE.Vector3();
  const constellations = [];
  let pendingLines = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const planetPicks = [];
  const examPicks = [];
  const facetPicks = [];
  const facetNodes = new Map();
  const facetCategories = new Map();
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
  let travelGuide = null;
  let instantTravel = false;
  let rafId = 0;
  let pointerStart = null;
  const frameInterval = mobile ? 1000 / 24 : 1000 / 30;

  // The micro view is an educational concept scene. It deliberately uses a
  // compact, readable atom-like arrangement rather than claiming physical
  // scale or orbital accuracy.
  const microRoot = new THREE.Group();
  microRoot.name = 'educational-micro-concept';
  microRoot.visible = false;
  microRoot.renderOrder = 18;
  const microMaterials = [];
  const microOrbitMaterials = [];
  const microNucleus = new THREE.Mesh(new THREE.SphereGeometry(.48, 48, 36), new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
    vertexShader: SUN_VERTEX,
    fragmentShader: SUN_FRAGMENT.replace('gl_FragColor=vec4(c,1.);', 'gl_FragColor=vec4(c,uOpacity);'),
    transparent: true, depthWrite: false, toneMapped: false,
  }));
  const microNucleusGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreGlowTexture, color: 0xffbd78, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  microNucleusGlow.scale.setScalar(2.25);
  microRoot.add(microNucleusGlow, microNucleus);
  microMaterials.push(microNucleus.material, microNucleusGlow.material);
  for (let shell = 0; shell < 3; shell += 1) {
    const orbitMaterial = new THREE.LineBasicMaterial({ color: shell === 1 ? 0x9de8ff : 0x87a8ff, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
    const orbit = makeOrbit(1.25 + shell * .78, .72 + shell * .12, orbitMaterial, 96);
    orbit.rotation.x = .18 + shell * .35;
    orbit.rotation.z = shell % 2 ? -.22 : .12;
    microRoot.add(orbit);
    microOrbitMaterials.push(orbitMaterial);
    const electronCount = shell + 2;
    for (let electronIndex = 0; electronIndex < electronCount; electronIndex += 1) {
      const electronMaterial = new THREE.MeshBasicMaterial({ color: shell === 2 ? 0xb9ffea : 0x9fd9ff, transparent: true, opacity: 0, toneMapped: false });
      const electron = new THREE.Mesh(new THREE.SphereGeometry(.105, 10, 8), electronMaterial);
      electron.userData.microShell = shell;
      electron.userData.microPhase = electronIndex / electronCount * Math.PI * 2 + shell * .44;
      electron.userData.microRadius = 1.25 + shell * .78;
      electron.userData.microTilt = .18 + shell * .35;
      microRoot.add(electron);
      microMaterials.push(electronMaterial);
    }
  }
  scene.add(microRoot);

  function clearTravelGuide() {
    if (!travelGuide) return;
    scene.remove(travelGuide.line, travelGuide.beacon, travelGuide.ring);
    travelGuide.line.geometry.dispose();
    travelGuide.line.material.dispose();
    travelGuide.beacon.geometry.dispose();
    travelGuide.beacon.material.dispose();
    travelGuide.ring.geometry.dispose();
    travelGuide.ring.material.dispose();
    travelGuide = null;
  }
  function createTravelGuide(from, target) {
    clearTravelGuide();
    const midpoint = from.clone().lerp(target, .5);
    midpoint.y += Math.max(3, from.distanceTo(target) * .09);
    const geometry = new THREE.BufferGeometry().setFromPoints([from, midpoint, target]);
    const material = new THREE.LineDashedMaterial({
      color: 0x9bd4ff, transparent: true, opacity: .48, depthWrite: false,
      dashSize: .5, gapSize: .7, toneMapped: false,
    });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    line.renderOrder = 9;
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(.14, 10, 8), new THREE.MeshBasicMaterial({
      color: 0xe4f6ff, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    beacon.position.copy(target);
    beacon.renderOrder = 10;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.45, .025, 6, 40), new THREE.MeshBasicMaterial({
      color: 0x98d2ff, transparent: true, opacity: .62, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    ring.position.copy(target);
    ring.rotation.x = Math.PI / 2;
    ring.renderOrder = 10;
    scene.add(line, beacon, ring);
    travelGuide = { line, beacon, ring };
  }

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
function hashUnit(text) {
  return hashText(text) / 4294967295;
}
  function groupOrbitLayout(data, index, groupCount) {
  const progress = (index + .5) / Math.max(1, groupCount);
  const minRadius = mobile ? 15 : 22;
  const maxRadius = mobile ? 36 : 70;
  const radius = Math.sqrt(minRadius * minRadius + progress * (maxRadius * maxRadius - minRadius * minRadius));
  const angleJitter = (hashUnit(data.id + ':orbit') - .5) * .32;
  const elevation = (hashUnit(data.id + ':depth') - .5) * (mobile ? 18 : 34);
  return { radius, angle: index * GOLDEN_ANGLE + angleJitter, elevation };
  }
  function groupCoordinates(angle, radius) {
    return {
      x: Math.cos(angle) * radius * (mobile ? .52 : 1),
      z: Math.sin(angle) * radius * (mobile ? 1 : .9),
    };
  }
  function galaxyProfile(data) {
    const canonicalProfiles = {
      'curriculum:middle:중1': 5,
      'curriculum:middle:중2': 1,
      'curriculum:middle:중3': 3,
      'curriculum:high:공통수학1': 0,
      'curriculum:high:기하': 2,
    };
    const variant = canonicalProfiles[data.id] ?? hashText(data.id) % 6;
    const profiles = [
      { kind: 'spiral', arms: 2, pitch: 1.04, flattening: .62, bar: .72, cloud: 1.06 },
      { kind: 'spiral', arms: 3, pitch: 1.56, flattening: .78, bar: .18, cloud: 1.18 },
      { kind: 'barred', arms: 4, pitch: .76, flattening: .48, bar: 1.08, cloud: .88 },
      { kind: 'elliptical', arms: 0, pitch: .38, flattening: .56, bar: .08, cloud: .92 },
      { kind: 'edge-on', arms: 0, pitch: .38, flattening: .14, bar: .04, cloud: .84 },
      { kind: 'irregular', arms: 0, pitch: .38, flattening: .92, bar: .02, cloud: 1.42 },
    ];
    return { ...profiles[variant], variant, turn: (hashText(data.id + ':tilt') % 1000) / 1000 * Math.PI };
  }
  function makeGalaxyDisc(data, palette, profileOrStarCount = 216, legacyStarCount = 216) {
    const legacyCount = typeof profileOrStarCount === 'number';
    const profile = legacyCount ? galaxyProfile(data) : (profileOrStarCount || galaxyProfile(data));
    const starCount = legacyCount ? profileOrStarCount : legacyStarCount;
    const random = randomFrom(hashText(data.id) ^ 0x61c88647);
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const baseColor = new THREE.Color(ORBIT_COLORS[palette]);
    const white = new THREE.Color(0xd4e8ff);
    const warm = new THREE.Color(0xffd2a1);
    for (let i = 0; i < starCount; i += 1) {
      const arm = profile.arms ? i % profile.arms : 0;
      const spread = Math.sqrt(random());
      const core = i % 5 === 0;
      const radius = core ? Math.sqrt(random()) * (.55 + profile.bar * .18) : .18 + spread * 1.82;
      const angle = profile.arms
        ? arm * Math.PI * 2 / profile.arms + radius * profile.pitch + (random() - .5) * (.12 + radius * .06)
        : random() * Math.PI * 2;
      const barOffset = profile.bar * Math.sin(angle * 2) * Math.exp(-radius * 1.35);
      const irregularity = profile.kind === 'irregular'
        ? 1 + .24 * Math.sin(angle * 5 + radius * 2.4) + .12 * Math.cos(angle * 3 - radius * 4.2)
        : 1;
      const ellipticalRadius = radius * (.68 + spread * .32) * irregularity;
      positions[i * 3] = Math.cos(angle) * ellipticalRadius + barOffset;
      positions[i * 3 + 1] = (random() - .5) * (.07 + radius * (1 - profile.flattening) * .14);
      positions[i * 3 + 2] = Math.sin(angle) * ellipticalRadius * profile.flattening;
      const color = baseColor.clone().lerp(white, Math.max(.12, (1 - spread) * .38 + random() * .12));
      if (radius < .85 && random() > .3) color.lerp(warm, .28);
      color.toArray(colors, i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }
  function makeNebulaCloud(data, palette, profile) {
    const random = randomFrom(hashText(data.id) ^ 0x9e3779b9);
    const count = 54;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColor = new THREE.Color(ORBIT_COLORS[palette]);
    for (let i = 0; i < count; i += 1) {
      const radius = Math.sqrt(random()) * 1.95 * profile.cloud;
      const arm = profile.arms ? Math.floor(random() * profile.arms) * Math.PI * 2 / profile.arms : random() * Math.PI * 2;
      const angle = profile.arms ? arm + radius * profile.pitch + (random() - .5) * .85 : random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (random() - .5) * (.18 + (1 - profile.flattening) * .4);
      positions[i * 3 + 2] = Math.sin(angle) * radius * profile.flattening;
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
    const profile = galaxyProfile(data);
    const root = reusing || new THREE.Group();
    if (reusing) {
      root.clear();
    }
    root.name = data.id;
    const layout = groupOrbitLayout(data, index, groupCount);
    const orbitRadius = layout.radius;
    const examCountFraction = Math.min(1, Math.max(1, Number(data.count) || 1) / 120);
    const majorGalaxyScale = .92 + Math.pow(examCountFraction, .58) * 1.85;
    const hubScale = .76 + Math.pow(examCountFraction, .62) * .38;
    const inclination = .12 + hashUnit(data.id + ':inclination') * .44;
    const hub = new THREE.Group();
    root.add(hub);
    hub.scale.setScalar(hubScale);
    const cloud = new THREE.Points(makeNebulaCloud(data, palette, profile), new THREE.PointsMaterial({
      map: galaxyNebulaTexture, vertexColors: true, size: 1.9 + profile.cloud * .2, sizeAttenuation: true,
      transparent: true, opacity: .19 + profile.cloud * .045, blending: THREE.AdditiveBlending, depthWrite: false, alphaTest: .01,
    }));
    cloud.scale.setScalar(majorGalaxyScale);
    cloud.rotation.x = -.18;
    hub.add(cloud);
    const nebulaBillboard = new THREE.Sprite(new THREE.SpriteMaterial({
      map: galaxyNebulaTexture, color: new THREE.Color(color).lerp(new THREE.Color(0x9fb8ff), .38),
      transparent: true, opacity: .4, blending: THREE.NormalBlending,
      depthWrite: false, depthTest: true,
    }));
    nebulaBillboard.scale.set((13 + profile.cloud * 3.1) * majorGalaxyScale, (8.6 + profile.cloud * 1.8) * majorGalaxyScale, 1);
    nebulaBillboard.position.y = -.08;
    hub.add(nebulaBillboard);
    const galaxy = new THREE.Points(makeGalaxyDisc(data, palette, profile, 520), new THREE.PointsMaterial({
      map: sharedStarSpriteTexture, vertexColors: true, size: .46 + profile.cloud * .07, sizeAttenuation: true,
      transparent: true, opacity: .82, alphaTest: .018,
      blending: THREE.NormalBlending, depthWrite: false, toneMapped: false,
    }));
    galaxy.rotation.x = -.18;
    galaxy.rotation.y = profile.turn;
    galaxy.scale.set((5.15 + profile.bar * .34) * majorGalaxyScale, 1.28 * majorGalaxyScale, (profile.kind === 'edge-on' ? .72 : 3.72 + profile.flattening * .78) * majorGalaxyScale);
    hub.add(galaxy);
    const nucleusGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: sharedCoreGlowTexture, color: 0xffe2b7, transparent: true, opacity: .42,
      blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, toneMapped: false,
    }));
    nucleusGlow.scale.set(2.1 + profile.bar * .44, 1.7 + profile.bar * .28, 1);
    hub.add(nucleusGlow);
    const nucleus = new THREE.Mesh(sharedDataStarGeometry, new THREE.MeshBasicMaterial({ color: 0xfff4dc, toneMapped: false }));
    nucleus.scale.setScalar(1.12);
    hub.add(nucleus);
    const globe = new THREE.Mesh(sharedGroupPickGeometry, sharedGroupPickMaterial);
    globe.userData.kind = 'group';
    globe.userData.groupId = data.id;
    hub.add(globe);
    const shellMaterials = [];
    for (let shell = 0; shell < 1; shell += 1) {
      const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: .015, depthWrite: false });
      shellMaterials.push(material);
      const orbit = makeOrbit(2.8 + shell * 1.72, .8 + shell * .035, material, 80);
      orbit.rotation.x = .18 + shell * .21 + index * .035;
      orbit.rotation.z = (shell % 2 ? -1 : 1) * (.12 + index * .018);
      root.add(orbit);
    }
    const orbitPath = makeOrbit(orbitRadius, .9 + index % 4 * .035, new THREE.LineBasicMaterial({
      color, transparent: true, opacity: .075, depthWrite: false,
    }), 128);
    orbitPath.rotation.x = inclination;
    orbitPath.rotation.z = (index % 2 ? -.1 : .07) + (index % 3) * .022;
    orbitPath.position.y = (index % 3 - 1) * .22;
    scene.add(orbitPath);
    const animateLayout = running && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetAngle = layout.angle;
    const initialAngle = animateLayout ? hashAngle(data.id) : targetAngle;
    const transitionStart = performance.now();
    return {
      id: data.id, name: data.name, mode: data.mode, count: data.count, root, hub, hubBaseScale: hubScale, globe, galaxy, cloud, nebulaBillboard, nucleusGlow, profile,
      orbitPath, palette, color, index, elevation: layout.elevation, orbitRadius, targetRadius: orbitRadius,
      angle: initialAngle, layoutAngle: initialAngle, layoutFromAngle: initialAngle,
      targetAngle, layoutTransitionStart: transitionStart, layoutTransitionDuration: animateLayout ? 900 : 0, orbitPhase: 0, inclination,
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
  const FACET_KINDS = ['grade', 'subject', 'term', 'year', 'school'];
  const FACET_CATEGORY_COLORS = [0x9bc7ff, 0xc6a5ff, 0x9ce8d0, 0xffd08f, 0xf3b4d6];
  function facetCategoryPosition(index) {
    const positions = {
      grade: [-10, 2, 8],
      subject: [12, 2, 8],
      term: mobile ? [-12, -9, -18] : [-34, -9, -18],
      year: mobile ? [0, -14, -27] : [0, -14, -27],
      school: mobile ? [12, -9, -18] : [34, -9, -18],
    };
    const [x, y, z] = positions[FACET_KINDS[index]] || [0, 0, 0];
    return new THREE.Vector3(x, y, z);
  }
  function clearFacetNodes() {
    for (const category of facetCategories.values()) {
      facetRoot.remove(category.root);
      category.root.traverse((object) => {
        if (object.geometry && object.geometry !== sharedFacetPickGeometry && object.geometry !== sharedDataStarGeometry) object.geometry.dispose();
        if (object.material && object.material !== sharedFacetPickMaterial) object.material.dispose();
      });
    }
    facetCategories.clear();
    facetNodes.clear();
    facetPicks.length = 0;
  }
  function createFacetCategory(kind, index) {
    const color = FACET_CATEGORY_COLORS[index % FACET_CATEGORY_COLORS.length];
    const root = new THREE.Group();
    root.name = 'facet-category:' + kind;
    root.position.copy(facetCategoryPosition(index));
    const hub = new THREE.Group();
    root.add(hub);
    const galaxy = new THREE.Points(makeGalaxyDisc({ id: 'facet-category:' + kind }, index, 160), new THREE.PointsMaterial({
      map: sharedStarSpriteTexture, vertexColors: true, size: .18, sizeAttenuation: true,
      transparent: true, opacity: .8, alphaTest: .018, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    galaxy.scale.setScalar(1.35);
    hub.add(galaxy);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: sharedCoreGlowTexture, color, transparent: true, opacity: .38,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    glow.scale.setScalar(1.7);
    hub.add(glow);
    const nucleus = new THREE.Mesh(sharedDataStarGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
    nucleus.scale.setScalar(1.2);
    hub.add(nucleus);
    const ringMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: .26, depthWrite: false });
    const ring = makeOrbit(3.7, .74, ringMaterial, 80);
    ring.rotation.x = .24 + index * .11;
    ring.rotation.z = index % 2 ? -.18 : .12;
    root.add(ring);
    const pick = new THREE.Mesh(sharedFacetPickGeometry, sharedFacetPickMaterial);
    pick.userData.kind = 'facet-category';
    pick.userData.facetKind = kind;
    root.add(pick);
    facetRoot.add(root);
    const category = { kind, root, hub, galaxy, glow, nucleus, ring, pick, color };
    facetCategories.set(kind, category);
    return category;
  }
  function createFacetNode(data, index) {
    const category = facetCategories.get(data.kind);
    if (!category) return null;
    const palette = index % FACET_CATEGORY_COLORS.length;
    const root = new THREE.Group();
    root.name = data.id;
    const color = FACET_CATEGORY_COLORS[palette];
    const galaxy = new THREE.Points(makeGalaxyDisc({ id: data.id }, palette, 52), new THREE.PointsMaterial({
      map: sharedStarSpriteTexture, vertexColors: true, size: .12, sizeAttenuation: true,
      transparent: true, opacity: data.disabled ? .16 : data.selected ? .92 : .56,
      alphaTest: .018, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    galaxy.scale.setScalar(data.selected ? 1.18 : .88);
    root.add(galaxy);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: sharedCoreGlowTexture, color, transparent: true,
      opacity: data.disabled ? .06 : data.selected ? .32 : .16,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    glow.scale.setScalar(data.selected ? .72 : .5);
    root.add(glow);
    const star = new THREE.Mesh(sharedDataStarGeometry, new THREE.MeshBasicMaterial({ color: data.disabled ? 0x5a6d8b : color, toneMapped: false }));
    star.scale.setScalar(data.selected ? .65 : .42);
    root.add(star);
    const ringMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: data.disabled ? .04 : .11, depthWrite: false });
    const ring = makeOrbit(1.15 + (index % 3) * .23, .7, ringMaterial, 48);
    ring.rotation.x = .18 + (index % 4) * .17;
    root.add(ring);
    const pick = new THREE.Mesh(sharedFacetPickGeometry, sharedFacetPickMaterial);
    pick.userData.kind = 'facet';
    pick.userData.facetKind = data.kind;
    pick.userData.facetValue = data.value;
    pick.userData.facetId = data.id;
    pick.userData.disabled = Boolean(data.disabled);
    root.add(pick);
    category.root.add(root);
    const kindIndex = [...facetNodes.values()].filter((existing) => existing.kind === data.kind).length;
    const radius = mobile
      ? (data.kind === 'grade' ? 7.4 + kindIndex * 1.7 : data.kind === 'term' ? 7.2 + kindIndex * 1.35 : data.kind === 'year' ? 8.2 + (kindIndex % 8) * 1.1 : data.kind === 'school' ? 9.2 + (kindIndex % 9) * .92 : 5.2 + (index % 6) * 1.2)
      : 5.2 + (index % 6) * 1.2;
    const node = {
      ...data, root, galaxy, glow, star, ring, pick, category,
      phase: hashAngle(data.id), radius,
      speed: .012 + (hashText(data.id) % 5) * .003,
    };
    facetNodes.set(data.id, node);
    facetPicks.push(pick);
    return node;
  }
  function setFacetData(nextFacets = []) {
    clearFacetNodes();
    FACET_KINDS.forEach((kind, index) => createFacetCategory(kind, index));
    nextFacets.filter((data) => data.worldVisible !== false).forEach((data, index) => createFacetNode(data, index));
  }
  function createDataNode(exam, groupId, slot) {
    const token = new THREE.Group();
    const signature = hashText(exam.file);
    const palette = signature % ORBIT_COLORS.length;
    const bright = (signature >>> 11) & 1;
    const isJupiter = exam.file === JUPITER_EXAM_FILE;
    if (isJupiter) loadJupiterTexture();
    const size = .92 + ((signature >>> 17) % 7) * .03;
    const glow = new THREE.Sprite(getDataGlowMaterial(palette, bright));
    glow.scale.setScalar(.76 * size);
    if (isJupiter && jupiterMaterial) glow.visible = false;
    const star = new THREE.Mesh(sharedDataStarGeometry, isJupiter && jupiterMaterial ? jupiterMaterial : getDataStarMaterial(palette, bright));
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
      file: exam.file, exam, groupId, slot, token, glow, star, pickMesh: star, size, selectedMix: 0, isJupiter,
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
        const layout = groupOrbitLayout(data, index, nextGroups.length);
        next.targetRadius = layout.radius;
        const targetAngle = layout.angle;
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
      const coordinates = groupCoordinates(next.angle, next.orbitRadius);
      const elevation = next.elevation - coordinates.z * Math.sin(next.inclination) * .28;
      next.root.position.set(coordinates.x, elevation, coordinates.z);
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
    if (animate) {
      depthFar.rotation.y += elapsed * .0022;
      depthNear.rotation.y -= elapsed * .0048;
      orbitalFrame.rotation.y = simTime * .0028;
      orbitalFrame.rotation.z = Math.sin(simTime * .08) * .012;
    }
    const frameOpacity = focusedGroupId ? .014 : .002;
    for (const material of frameMaterials) material.opacity = frameOpacity;
    sunRoot.visible = scaleMode === 'micro';
    const desiredScaleMix = scaleMode === 'micro' ? 1 : 0;
    scaleMix += (desiredScaleMix - scaleMix) * Math.min(1, dt * 4.8);
    microRoot.visible = scaleMix > .002;
    if (microRoot.visible) {
      const anchorEntity = selectedExamFile ? entities.get(selectedExamFile) : null;
      const anchorGroup = focusedGroupId ? groups.get(focusedGroupId) : null;
      if (anchorEntity) microAnchor.copy(anchorEntity.position);
      else if (anchorGroup) anchorGroup.globe.getWorldPosition(microAnchor);
      microRoot.position.copy(microAnchor);
      microRoot.scale.setScalar(.72 + scaleMix * .28);
      microNucleus.material.uniforms.uOpacity.value = .88 * scaleMix;
      if (animate) microNucleus.material.uniforms.uTime.value += elapsed;
      microNucleusGlow.material.opacity = .42 * scaleMix;
      for (const material of microOrbitMaterials) material.opacity = .36 * scaleMix;
      for (const material of microMaterials) {
        if (material !== microNucleus.material && material !== microNucleusGlow.material) material.opacity = .92 * scaleMix;
      }
      microRoot.rotation.y = simTime * .1;
      for (const child of microRoot.children) {
        if (!child.userData?.microRadius) continue;
        const phase = child.userData.microPhase + simTime * (.16 + child.userData.microShell * .045);
        child.position.set(Math.cos(phase) * child.userData.microRadius, 0, Math.sin(phase) * child.userData.microRadius);
        child.position.applyAxisAngle(orbitAxis, child.userData.microTilt);
      }
    }

    for (const group of groups.values()) {
      group.orbitRadius += (group.targetRadius - group.orbitRadius) * Math.min(1, dt * 1.4);
      const layoutProgress = group.layoutTransitionDuration === 0 ? 1 : Math.min(1, (now - group.layoutTransitionStart) / group.layoutTransitionDuration);
      const layoutEase = layoutProgress * layoutProgress * (3 - 2 * layoutProgress);
      group.layoutAngle = smoothAngle(group.layoutFromAngle, group.targetAngle, layoutEase);
      if (animate) group.orbitPhase += group.speed * elapsed;
      group.angle = group.layoutAngle + group.orbitPhase;
      const emphasized = group.id === focusedGroupId;
      group.hub.scale.setScalar(group.hubBaseScale * (emphasized ? 1.08 : 1));
      // Keep the overview's shared orbital frame legible at a glance. The
      // focused route still wins by a wide margin, while the quiet paths give
      // the wide shot a stable sense of scale and depth.
      group.orbitPath.material.opacity = emphasized ? .46 : focusedGroupId ? .014 : .075;
      for (let i = 0; i < group.shellMaterials.length; i += 1) {
        group.shellMaterials[i].opacity = emphasized ? .36 - i * .035 : focusedGroupId ? .012 : .032;
      }
      const quietSchoolMode = group.mode === 'school';
      group.galaxy.material.opacity = emphasized ? .92 : quietSchoolMode ? .54 : .8;
      group.cloud.material.opacity = emphasized ? .2 : quietSchoolMode ? .035 : .16;
      group.nebulaBillboard.material.opacity = emphasized ? .24 : quietSchoolMode ? .045 : .2;
      group.nucleusGlow.material.opacity = emphasized ? .58 : .35;
      const coordinates = groupCoordinates(group.angle, group.orbitRadius);
      const x = coordinates.x;
      const z = coordinates.z;
      const y = group.elevation - z * Math.sin(group.inclination) * .28;
      group.root.position.set(x, y, z);
      group.hub.rotation.y = simTime * .14;
      group.orbitPath.scale.setScalar(group.orbitRadius / Math.max(group.targetRadius, 1));
    }

    for (const category of facetCategories.values()) {
      category.hub.rotation.y = simTime * .06;
      category.ring.rotation.y = simTime * .035;
      const categoryOpacity = selectedExamFile ? .12 : focusedGroupId ? .42 : 1;
      category.galaxy.material.opacity = .8 * categoryOpacity;
      category.glow.material.opacity = .38 * categoryOpacity;
      category.nucleus.material.opacity = categoryOpacity;
      category.ring.material.opacity = .26 * categoryOpacity;
    }
    for (const node of facetNodes.values()) {
      const angle = node.phase + simTime * node.speed;
      node.root.position.set(Math.cos(angle) * node.radius, Math.sin(angle * 1.31) * .72, Math.sin(angle) * node.radius * .72);
      node.root.rotation.y = simTime * .08 + node.phase;
      const categoryOpacity = selectedExamFile ? .12 : focusedGroupId ? .42 : 1;
      node.galaxy.material.opacity = (node.disabled ? .16 : node.selected ? .92 : .56) * categoryOpacity;
      node.glow.material.opacity = (node.disabled ? .06 : node.selected ? .32 : .16) * categoryOpacity;
      node.ring.material.opacity = (node.disabled ? .04 : .11) * categoryOpacity;
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
      if (entity.isJupiter) entity.star.rotation.y = simTime * .12;
      const distance = camera.position.distanceTo(entity.position);
      const selected = entity.file === selectedExamFile ? 1 : 0;
      entity.selectedMix += (selected - entity.selectedMix) * Math.min(1, dt * 10);
      const nearGlow = 1 - smoothStep(26, 52, distance);
      const globeScale = entity.isJupiter
        ? .96 * (1 + 1.0 * Math.max(nearGlow, entity.selectedMix))
        : .96 * (1 + entity.selectedMix * .045);
      entity.star.scale.setScalar(globeScale * entity.size);
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
      if (travelGuide) {
        const pulse = .4 + Math.sin(simTime * 1.8) * .12;
        travelGuide.line.material.opacity = pulse;
        travelGuide.beacon.scale.setScalar(1 + Math.sin(simTime * 2.6) * .22);
        travelGuide.ring.scale.setScalar(1 + Math.sin(simTime * 1.9) * .18);
        travelGuide.ring.rotation.z = simTime * .7;
      }
      if (t >= 1) { cameraTransition = null; clearTravelGuide(); onTravel?.(''); }
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
    const facetCategoryPositions = new Map();
    for (const [kind, category] of facetCategories) facetCategoryPositions.set(kind, projectPoint(category.pick));
    const facetPositions = new Map();
    for (const [id, node] of facetNodes) facetPositions.set(id, projectPoint(node.pick));
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
    onFrame?.({ groups: groupPositions, exams: examPositions, facets: facetPositions, facetCategories: facetCategoryPositions, questions: questionProjections, examFiles: catalogPointFiles, groupAngles, cameraPosition: camera.position.toArray() });
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
      clearTravelGuide();
      camera.position.copy(position);
      controls.target.copy(target);
      controls.update();
      onTravel?.('');
      return;
    }
    createTravelGuide(controls.target.clone(), target.clone());
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
    scaleMode = 'planet';
    onScale?.(scaleMode);
    travelTo(group.globe.getWorldPosition(new THREE.Vector3()), 17, 2.6);
  }
  function focusExam(file) {
    const entity = entities.get(file);
    if (!entity) return false;
    focusedGroupId = entity.groupId;
    scaleMode = 'planet';
    onScale?.(scaleMode);
    travelTo(entity.position.clone(), 15, 1.8);
    return true;
  }
  function resetCamera() {
    focusedGroupId = '';
    scaleMode = 'macro';
    onScale?.(scaleMode);
    travelTo(new THREE.Vector3(), mobile ? 66 : 90, 0);
  }
  function setScale(mode) {
    const next = ['macro', 'planet', 'micro'].includes(mode) ? mode : 'macro';
    if (next === 'micro' && !focusedGroupId && !selectedExamFile) return false;
    if (next === 'planet' && !focusedGroupId && !selectedExamFile) return false;
    if (next === 'macro' && selectedExamFile) return false;
    const entity = selectedExamFile ? entities.get(selectedExamFile) : null;
    const group = focusedGroupId ? groups.get(focusedGroupId) : null;
    const target = new THREE.Vector3();
    if (entity) target.copy(entity.position);
    else if (group) group.globe.getWorldPosition(target);
    scaleMode = next;
    onScale?.(scaleMode);
    if (next === 'macro') {
      focusedGroupId = '';
      travelTo(new THREE.Vector3(), mobile ? 78 : 104, 0);
    } else if (next === 'micro') {
      microAnchor.copy(target);
      travelTo(target, 8.2, 1.25);
    } else {
      travelTo(target, 17, 2.6);
    }
    return true;
  }
  function finishTravel() {
    if (!cameraTransition) return;
    camera.position.copy(cameraTransition.toPosition);
    controls.target.copy(cameraTransition.toTarget);
    cameraTransition = null;
    clearTravelGuide();
    controls.update();
    onTravel?.('');
  }
  function snapshotNavigation() {
    return { position: camera.position.toArray(), target: controls.target.toArray(), focusedGroupId, scaleMode };
  }
  function restoreNavigation(snapshot) {
    const valid = snapshot && [snapshot.position, snapshot.target].every((arr) =>
      Array.isArray(arr) && arr.length === 3 && arr.every(Number.isFinite));
    if (!valid) return false;
    cameraTransition = null;
    clearTravelGuide();
    onTravel?.('');
    focusedGroupId = groups.has(snapshot.focusedGroupId) ? snapshot.focusedGroupId : '';
    scaleMode = ['macro', 'planet', 'micro'].includes(snapshot.scaleMode) ? snapshot.scaleMode : (focusedGroupId ? 'planet' : 'macro');
    onScale?.(scaleMode);
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
    const hits = raycaster.intersectObjects([...planetPicks, ...examPicks, ...facetPicks, ...(catalogPoints ? [catalogPoints] : []), ...blackholePicks], false);
    if (!hits.length) return;
    const { object: hit, index } = hits[0];
    if (hit.userData.kind === 'group') onGroup?.(hit.userData.groupId);
    else if (hit.userData.kind === 'facet' && !hit.userData.disabled) onFacet?.(hit.userData.facetKind, hit.userData.facetValue);
    else if (hit.userData.kind === 'facet-category') onFacet?.(hit.userData.facetKind, '');
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
    setFacetData,
    setSelectedExam(file) {
      selectedExamFile = typeof file === 'string' ? file : '';
      controls.enabled = !selectedExamFile;
      if (!selectedExamFile) clearQuestionOrbit();
    },
    setQuestionOrbit,
    clearQuestionOrbit,
    focusExam,
    setScale,
    snapshotNavigation,
    restoreNavigation,
    cancelTravel() { cameraTransition = null; clearTravelGuide(); onTravel?.(''); },
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
      worldDisposed = true;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('resize', setSize);
      controls.dispose();
      clearQuestionOrbit();
      clearTravelGuide();
      microRoot.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
      sharedQuestionGeometry.dispose();
      sharedQuestionMaterial.dispose();
      sharedQuestionLineMaterial.dispose();
      for (const group of groups.values()) clearGroupNode(group);
      for (const entity of entities.values()) removeDataNode(entity);
      disposeConstellations();
      starGeometry.dispose();
      sharedGroupPickGeometry.dispose();
      sharedGroupPickMaterial.dispose();
      sharedFacetPickGeometry.dispose();
      sharedFacetPickMaterial.dispose();
      galaxyNebulaTexture.dispose();
      sharedCoreGlowTexture.dispose();
      sharedStarSpriteTexture.dispose();
      sharedDataStarGeometry.dispose();
      nebulaTexture.dispose();
      nebulaSky.geometry.dispose();
      nebulaSky.material.dispose();
      for (const material of dataStarMaterials.values()) material.dispose();
      for (const material of dataGlowMaterials.values()) material.dispose();
      jupiterMaterial?.dispose();
      jupiterTexture?.dispose();
      depthFar.geometry.dispose();
      depthFar.material.dispose();
      depthNear.geometry.dispose();
      depthNear.material.dispose();
      for (const material of frameMaterials) material.dispose();
      if (catalogPoints) {
        dataRoot.remove(catalogPoints);
        catalogPoints.geometry.dispose();
        catalogPoints.material.dispose();
      }
      renderer.dispose();
    },
  };
}
