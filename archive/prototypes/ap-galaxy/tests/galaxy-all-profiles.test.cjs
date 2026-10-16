'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.resolve(__dirname, '../src/orbital-world.js'), 'utf8');
const GROUP_TYPES = ['spiral', 'barred', 'elliptical', 'edge-on', 'irregular'];
function snippet(start, end) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `missing source range: ${start}`);
  return source.slice(a, b);
}
function mechanics() {
  class Vector3 {
    constructor(x = 0, y = 0, z = 0) { Object.assign(this, {x, y, z}); }
  }
  class Sphere {
    constructor(center, radius) { Object.assign(this, {center, radius}); }
  }
  const scope = { THREE: {Vector3, Sphere, DynamicDrawUsage: 35048}, Float32Array, Math };
  const model = snippet('  const GALAXY_HUB_SPIN_RATE = .14;', '  // Deterministic 3D particle volume');
  const shape = snippet('  function galaxyCoreShape(profile) {', '  function makeGalaxyCoreVolume(');
  vm.runInNewContext(model + '\n' + shape + `
    globalThis.api = { galaxyAngularSpeed, galaxyMotionMode, makeDifferentialMotion,
      updateDifferentialMotion, galaxyCoreShape, galaxyCoreParticleBudget };`, scope);
  return scope.api;
}
function points(radius = .7, ratio = .7) {
  const initial = Float32Array.from([radius, .02, 0, 0, -.05, radius * ratio]);
  const attr = { array: initial, count: 2, updated: 0,
    setUsage(v) {this.usage=v;}, set needsUpdate(_) {this.updated++;} };
  return { geometry: {getAttribute: () => attr, boundingSphere: null}, attr };
}
const angle = (p, i, ratio) => Math.atan2(p.attr.array[i * 3 + 2] / ratio, p.attr.array[i * 3]);

test('all canonical 6 profiles remain and give each type a motion mode', () => {
  const section = snippet('  function galaxyProfile(data) {', '  function makeGalaxyDisc(');
  assert.match(section, /kind: 'spiral', arms: 2/);
  assert.match(section, /kind: 'spiral', arms: 3/);
  assert.match(section, /kind: 'barred'/);
  assert.match(section, /kind: 'elliptical'/);
  assert.match(section, /kind: 'edge-on'/);
  assert.match(section, /kind: 'irregular'/);
  const {galaxyMotionMode} = mechanics();
  assert.deepEqual(GROUP_TYPES.map(kind => galaxyMotionMode({kind})),
    ['differential', 'differential', 'coherent', 'gentle', 'irregular']);
});

test('all canonical groups create per-star, gas, true core surface and volume (no hero-only gate)', () => {
  const creation = snippet('  function createGroupNode(', '  function clearGroupNode(');
  assert.match(creation, /const motionMode = galaxyMotionMode\(profile\)/);
  assert.match(creation, /const starMotion = makeDifferentialMotion\(galaxy, profile.flattening, motionMode\)/);
  assert.match(creation, /const cloudMotion = makeDifferentialMotion\(cloud, profile.flattening, motionMode\)/);
  assert.match(creation, /const coreSurface = new THREE.Mesh\(/);
  assert.match(creation, /const coreVolume = new THREE.Points\(/);
  assert.doesNotMatch(creation, /if \(isHeroGalaxy\) \{/);
  assert.match(creation, /hub.add\(coreSurface\)/);
  assert.match(creation, /hub.add\(coreVolume\)/);
});

test('ellipticals rotate coherently without radial shear', () => {
  const m = mechanics();
  const p = points(.6, .62);
  const motion = m.makeDifferentialMotion(p, .62, 'coherent');
  m.updateDifferentialMotion(motion, 24);
  const left = angle(p, 0, .62);
  const right = angle(p, 1, .62) - Math.PI / 2;
  const diff = Math.atan2(Math.sin(left-right), Math.cos(left-right));
  assert.ok(Math.abs(diff) < 1e-6, `elliptical sheared by ${diff}`);
});

test('spirals show larger inner angular speed, and edge-on retains gentle radial variation', () => {
  const m=mechanics();
  for (const mode of ['differential','gentle']) {
    const p=points(1, .4); const motion=m.makeDifferentialMotion(p,.4,mode);
    assert.equal(motion.mode,mode);
    assert.ok(motion.localRates.every(Number.isFinite));
  }
  assert.ok(m.galaxyAngularSpeed(.2)>m.galaxyAngularSpeed(2));
});

test('irregular motion is bounded across radii, reversible and has no initial jump', () => {
  const m = mechanics();
  const p = points(1.6, .92);
  p.attr.array[0] = .25;
  p.attr.array[2] = 0;
  const motion = m.makeDifferentialMotion(p, .92, 'irregular');
  const first = p.attr.array.slice();
  m.updateDifferentialMotion(motion, 0);
  for (let i = 0; i < first.length; i++) assert.ok(Math.abs(first[i] - p.attr.array[i]) < 1e-6);
  for (const t of [170, 2400, 10000]) {
    m.updateDifferentialMotion(motion, t);
    assert.ok(Math.abs(p.attr.array[1] - first[1]) < 1e-7);
    assert.ok(Math.abs(p.attr.array[4] - first[4]) < 1e-7);
    assert.ok(Math.abs(Math.hypot(p.attr.array[0], p.attr.array[2] / .92) - .25) < 1e-5);
    assert.ok(Math.abs(Math.hypot(p.attr.array[3], p.attr.array[5] / .92) - 1.6) < 1e-5);
    const innerAngle = angle(p, 0, .92);
    const outerAngle = angle(p, 1, .92) - Math.PI / 2;
    const shear = Math.atan2(Math.sin(innerAngle - outerAngle), Math.cos(innerAngle - outerAngle));
    assert.ok(Math.abs(shear) < .08, `irregular sheared by ${shear} at t=${t}`);
  }
  m.updateDifferentialMotion(motion, 0);
  for (let i = 0; i < first.length; i++) assert.ok(Math.abs(first[i] - p.attr.array[i]) < 1e-6);
});

test('six profiles have distinct finite 3D core shapes, capped mobile budgets', () => {
  const {galaxyCoreShape,galaxyCoreParticleBudget}=mechanics();
  const profiles = GROUP_TYPES.map(kind => ({kind}));
  const shapes=profiles.map(galaxyCoreShape);
  const keys=new Set(shapes.map(s=>[s.x,s.y,s.z].join(',')));
  assert.equal(keys.size,5);
  assert.ok(shapes.every(s=>[s.x,s.y,s.z,s.alpha].every(Number.isFinite)));
  for(const profile of profiles) {
    const mobile = galaxyCoreParticleBudget(profile,true,false);
    const desktop = galaxyCoreParticleBudget(profile,false,false);
    assert.ok(mobile >= 30 && mobile <= 80,`${profile.kind}: mobile ${mobile}`);
    assert.ok(desktop >= 70 && desktop <= 160,`${profile.kind}: desktop ${desktop}`);
    assert.ok(desktop > mobile);
  }
  assert.equal(galaxyCoreParticleBudget({kind:'spiral'},true,true),80);
  assert.equal(galaxyCoreParticleBudget({kind:'spiral'},false,true),200);
});

test('all cores share camera near-fade and view-distance attenuation, no new pick targets', () => {
  const camera = snippet('    // Apply atmospheric perspective in view space', '    if (questionOrbit) {');
  const ray = snippet('  function raycastAt(event) {', '  function pointerMove(event) {');
  assert.match(camera,/group\.coreSurface\.material\.uniforms\.uVisibility\.value = proximity \* group\.coreOpacity/);
  assert.match(camera,/group\.coreVolume\.material\.opacity \*= proximity/);
  assert.match(camera,/cue\.glow \* group\.coreOpacity/);
  assert.match(ray,/raycaster\.intersectObjects\(\[\.\.\.planetPicks,/);
  assert.doesNotMatch(ray,/coreSurface|coreVolume|starMotion|cloudMotion/);
});

test('staggered distant updates but near and focused groups stay continuous', () => {
  const animation = snippet('  let galaxyMotionFrame = 0;', '    for (const category of facetCategories.values()) {');
  assert.match(animation,/const nearEnough = camera\.position\.distanceTo\(group\.root\.position\) < \(mobile \? 32 : 56\)/);
  assert.match(animation,/const stagger = mobile \? 3 : 2/);
  assert.match(animation,/emphasized \|\| nearEnough \|\| \(galaxyMotionFrame \+ group\.index\) % stagger === 0/);
  assert.match(animation,/if \(animate && \(emphasized/);
  assert.match(source,/const animate = running && pageVisible && !selectedExamFile/);
});

test('core shaders use local surface coordinates, align azimuth, and dispose all world resources', () => {
  assert.match(source, /varying vec3 vLocal; void main\(\)\{vLocal=position;vec4 viewPosition=modelViewMatrix\*vec4\(position,1\.\);vViewNormal=normalize\(normalMatrix\*normal\);/);
  assert.match(source, /vec3 p = normalize\(vLocal\);/);
  assert.match(source, /cloud\.rotation\.y = profile\.turn;/);
  assert.match(source, /coreSurface\.rotation\.y = profile\.turn;/);
  assert.match(source, /coreVolume\.rotation\.y = profile\.turn;/);
  assert.match(source, /const coreLocalTurn = group\.profile\.turn \+ \(coreWorldRate - GALAXY_HUB_SPIN_RATE\) \* simTime;/);
  assert.match(source, /if \(simTime > 0\) \{\s*updateDifferentialMotion\(starMotion, simTime\);\s*updateDifferentialMotion\(cloudMotion, simTime\);\s*coreSurface\.material\.uniforms\.uTime\.value = simTime;\s*\}/);
  const cleanup = snippet('  function clearGroupNode(', '  const FACET_KINDS');
  assert.match(cleanup,/group\.root\.traverse\(\(object\) =>/);
  assert.match(cleanup,/object\.geometry\.dispose\(\)/);
  assert.match(cleanup,/object\.material\.dispose\(\)/);
  assert.match(cleanup,/object\.geometry !== sharedGroupPickGeometry/);
  const worldDispose = source.slice(source.indexOf('    dispose() {'));
  assert.match(worldDispose, /clearFacetNodes\(\);/);
  assert.match(worldDispose, /blackholeLabel\.remove\(\);/);
  assert.match(worldDispose, /for \(const root of \[microRoot, sunRoot, blackholeRoot, orbitalFrame\]\)/);
  assert.match(worldDispose, /starMaterial\.dispose\(\);/);
  assert.match(worldDispose, /similarityHoleTexture\.dispose\(\);/);
});
