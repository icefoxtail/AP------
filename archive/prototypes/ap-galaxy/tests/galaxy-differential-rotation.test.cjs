'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const source = fs.readFileSync(path.resolve(__dirname, '../src/orbital-world.js'), 'utf8');

function getModel() {
  const start = source.indexOf('  const GALAXY_HUB_SPIN_RATE = .14;');
  const end = source.indexOf('  // Deterministic 3D particle volume', start);
  assert.ok(start >= 0 && end > start, 'stage 3 motion helpers found');
  class Vector3 { constructor(x, y, z) { Object.assign(this, { x, y, z }); } }
  class Sphere { constructor(center, radius) { Object.assign(this, { center, radius }); } }
  const context = { THREE: { Vector3, Sphere, DynamicDrawUsage: 35048 }, Float32Array, Math };
  vm.runInNewContext(source.slice(start, end) + '\n' +
    'globalThis.motion = { galaxyAngularSpeed, makeDifferentialMotion, updateDifferentialMotion, GALAXY_HUB_SPIN_RATE };', context);
  return context.motion;
}

function makePoints(radiusAngles, flattening = .62) {
  const values = Float32Array.from(radiusAngles.flatMap(({ radius, angle, y = 0 }) => [
    Math.cos(angle) * radius, y, Math.sin(angle) * radius * flattening,
  ]));
  const original = values.slice();
  const attribute = {
    array: values, count: radiusAngles.length, usage: null, version: 0,
    setUsage(value) { this.usage = value; },
    set needsUpdate(on) { if (on) this.version += 1; },
  };
  const geometry = { getAttribute(name) { assert.equal(name, 'position'); return attribute; }, boundingSphere: null };
  return { geometry, attribute, original };
}

test('inner disk rotates faster than outer disk, with finite positive rates', () => {
  const { galaxyAngularSpeed } = getModel();
  const radii = [0, .1, .5, 1, 2, 4];
  const rates = radii.map(galaxyAngularSpeed);
  assert.ok(rates.every(rate => Number.isFinite(rate) && rate > 0));
  assert.ok(rates.every((rate, i) => i === 0 || rate < rates[i - 1]));
  assert.ok(rates[0] > .20 && rates.at(-1) < .10);
});

test('buffer mutation keeps height, color, geometry, and typed array identities', () => {
  const { makeDifferentialMotion, updateDifferentialMotion } = getModel();
  const points = makePoints([{ radius: .4, angle: .25, y: .1 }, { radius: 1.7, angle: 1.5, y: -.12 }]);
  const { geometry, attribute, original } = points;
  const motion = makeDifferentialMotion(points, .62);
  const beforeArray = attribute.array;
  const beforeSphere = geometry.boundingSphere;
  assert.equal(attribute.usage, 35048);
  updateDifferentialMotion(motion, 4.1);
  assert.strictEqual(attribute.array, beforeArray);
  assert.strictEqual(points.geometry, geometry);
  assert.strictEqual(geometry.boundingSphere, beforeSphere);
  assert.equal(attribute.version, 1);
  assert.equal(attribute.array[1], original[1]);
  assert.equal(attribute.array[4], original[4]);
  assert.notEqual(attribute.array[0], original[0]);
  assert.notEqual(attribute.array[3], original[3]);
});

test('star radii remain constant in deprojected galactic plane for all times', () => {
  const { makeDifferentialMotion, updateDifferentialMotion } = getModel();
  const samples = Array.from({ length: 560 }, (_, i) => ({
    radius: .12 + i / 560 * 1.95, angle: i * 2.399963, y: Math.sin(i * 2.31) * .09,
  }));
  const points = makePoints(samples);
  const motion = makeDifferentialMotion(points, .62);
  for (const seconds of [0, 1, 10, 50, 180, 500]) {
    updateDifferentialMotion(motion, seconds);
    for (let i = 0; i < samples.length; i++) {
      const off = 3 * i;
      assert.ok(Math.abs(Math.hypot(points.attribute.array[off], points.attribute.array[off + 2] / .62) - samples[i].radius) < 1e-5,
        `radial drift for star ${i} at t=${seconds}`);
    }
  }
});

test('parent +Y rotation is compensated, not double-added, in the circular case', () => {
  const { makeDifferentialMotion, updateDifferentialMotion, galaxyAngularSpeed, GALAXY_HUB_SPIN_RATE } = getModel();
  const samples = [0.05, .35, 1.5, 2.1].map(radius => ({ radius, angle: .5 }));
  const points = makePoints(samples, 1);
  const motion = makeDifferentialMotion(points, 1);
  const time = 12.4;
  updateDifferentialMotion(motion, time);
  for (let i = 0; i < samples.length; i++) {
    const off = i * 3;
    const localAngle = Math.atan2(points.attribute.array[off + 2], points.attribute.array[off]);
    // Three.js +Y rotates x/z by minus the Y angle.
    const absoluteAngle = localAngle - GALAXY_HUB_SPIN_RATE * time;
    const expected = samples[i].angle - galaxyAngularSpeed(samples[i].radius) * time;
    assert.ok(Math.abs(Math.atan2(Math.sin(absoluteAngle - expected), Math.cos(absoluteAngle - expected))) < 1e-5);
  }
});

test('the static world-space frustum bound encloses all differential phases', () => {
  const { makeDifferentialMotion, updateDifferentialMotion } = getModel();
  const samples = Array.from({ length: 1080 }, (_, i) => ({
    radius: .1 + i / 1080 * 2.2, angle: i * 2.39996, y: Math.sin(i) * .12,
  }));
  const points = makePoints(samples, .62);
  const motion = makeDifferentialMotion(points, .62);
  const sphere = points.geometry.boundingSphere;
  for (const time of [0, 100, 500, 5000]) {
    updateDifferentialMotion(motion, time);
    for (let i = 0; i < samples.length; i++) {
      const off = i * 3;
      const actualRadius = Math.hypot(...points.attribute.array.slice(off, off + 3));
      assert.ok(actualRadius < sphere.radius, `unbounded point ${i} at t=${time}`);
    }
  }
});

test('all six galaxy profiles create animated star and gas buffers', () => {
  assert.match(source, /const motionMode = galaxyMotionMode\(profile\);/);
  assert.match(source, /const starMotion = makeDifferentialMotion\(galaxy, profile\.flattening, motionMode\);/);
  assert.match(source, /const cloudMotion = makeDifferentialMotion\(cloud, profile\.flattening, motionMode\);/);
  assert.match(source, /updateDifferentialMotion\(group\.starMotion, simTime\);\s*updateDifferentialMotion\(group\.cloudMotion, simTime\);/);
  assert.match(source, /group\.hub\.quaternion\.copy\(group\.hubBaseQuaternion\);\s*group\.hub\.rotateY\(simTime \* GALAXY_HUB_SPIN_RATE\)/);
});

test('group and exam navigation pick meshes stay independent of star buffers', () => {
  assert.match(source, /globe\.userData\.kind = 'group'/);
  assert.match(source, /for \(const group of groups\.values\(\)\) planetPicks\.push\(group\.globe\)/);
  const rayStart = source.indexOf('  function raycastAt(event)');
  const rayEnd = source.indexOf('  function pointerDown(event)', rayStart);
  assert.ok(rayStart > 0 && rayEnd > rayStart);
  const raycast = source.slice(rayStart, rayEnd);
  assert.match(raycast, /raycaster\.setFromCamera\(pointer, camera\)/);
  assert.doesNotMatch(raycast, /starMotion|cloudMotion|coreVolume|makeDifferentialMotion/);
});

test('CPU sample: 560 mobile and 1080 desktop points do not require per-frame allocations', () => {
  const { makeDifferentialMotion, updateDifferentialMotion } = getModel();
  for (const count of [560, 1080]) {
    const samples = Array.from({ length: count }, (_, i) => ({
      radius: .1 + ((i * 127) % count) / count * 1.9, angle: i * 2.39996,
    }));
    const points = makePoints(samples);
    const motion = makeDifferentialMotion(points, .62);
    const array = points.attribute.array;
    const t0 = performance.now();
    for (let i = 0; i < 600; i++) updateDifferentialMotion(motion, i / 30);
    const elapsed = performance.now() - t0;
    assert.strictEqual(array, points.attribute.array);
    assert.equal(points.attribute.version, 600);
    console.log(`  ${count} particles / 600 updates: ${elapsed.toFixed(1)}ms CPU (Node, not browser FPS)`);
  }
});
