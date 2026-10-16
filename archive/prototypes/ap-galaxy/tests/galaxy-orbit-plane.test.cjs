const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/orbital-world.js'), 'utf8');
const built = fs.readFileSync(path.join(root, 'assets/orbital-world.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'orbit-app.js'), 'utf8');

test('the drawn orbit and moving galaxy share the same 3D coordinate function', () => {
  assert.match(source, /function groupCoordinates\(angle, radius, inclination = 0, azimuth = 0\)/);
  assert.match(source, /function makeGroupOrbitPath\(inclination, azimuth, material, segments = 128\)/);
  assert.match(source, /makeGroupOrbitPath\(inclination, orbitAzimuth/);
  assert.match(source, /groupCoordinates\(group\.angle, group\.orbitRadius, group\.inclination, group\.orbitAzimuth\)/);
  assert.match(source, /group\.root\.position\.set\(coordinates\.x, group\.elevation \+ coordinates\.y, coordinates\.z \+ group\.depthOffset\)/);
  assert.match(source, /group\.orbitPath\.position\.y = group\.elevation/);
  assert.match(source, /group\.orbitPath\.scale\.setScalar\(group\.orbitRadius\)/);
});

test('orbit geometry follows the same coordinate transform on desktop and mobile', () => {
  const start = source.indexOf('  function groupCoordinates(');
  const end = source.indexOf('  function galaxyProfile(', start);
  assert.ok(start >= 0 && end > start, 'shared orbit helpers must exist before galaxyProfile');
  const helpers = source.slice(start, end);

  class Euler {
    constructor(x, y, z, order) { Object.assign(this, { x, y, z, order }); }
  }
  class Vector3 {
    constructor(x = 0, y = 0, z = 0) { Object.assign(this, { x, y, z }); }
    applyEuler(euler) {
      assert.equal(euler.order, 'XYZ');
      // Three.js Euler XYZ: R = Rx * Ry * Rz, so Rz is applied first.
      // With y-angle=0, rotate about Z, then about X.
      const cx = Math.cos(euler.x), sx = Math.sin(euler.x);
      const cz = Math.cos(euler.z), sz = Math.sin(euler.z);
      const xAfterZ = this.x * cz - this.y * sz;
      const yAfterZ = this.x * sz + this.y * cz;
      const z = this.z;
      this.x = xAfterZ;
      this.y = yAfterZ * cx - z * sx;
      this.z = yAfterZ * sx + z * cx;
      return this;
    }
  }
  class BufferGeometry {
    setFromPoints(points) { this.points = points; return this; }
  }
  class Line {
    constructor(geometry, material) { this.geometry = geometry; this.material = material; }
  }

  for (const mobile of [false, true]) {
    const context = { THREE: { Euler, Vector3, BufferGeometry, Line }, mobile };
    vm.runInNewContext(`${helpers}\nglobalThis.__coords = groupCoordinates;\nglobalThis.__path = makeGroupOrbitPath;`, context);
    const inclination = .41;
    const azimuth = -.084;
    const segments = 64;
    const path = context.__path(inclination, azimuth, {}, segments);
    // Independent known-vector checks; do not merely compare a helper to itself.
    const axisX = context.__coords(0, 1, inclination, azimuth);
    const axisZ = context.__coords(Math.PI / 2, 1, inclination, azimuth);
    const xFactor = mobile ? .52 : 1;
    const zFactor = mobile ? 1 : .9;
    assert.ok(Math.abs(axisX.x - xFactor * Math.cos(azimuth)) < 1e-12);
    assert.ok(Math.abs(axisX.y - xFactor * Math.sin(azimuth) * Math.cos(inclination)) < 1e-12);
    assert.ok(Math.abs(axisX.z - xFactor * Math.sin(azimuth) * Math.sin(inclination)) < 1e-12);
    assert.ok(Math.abs(axisZ.x) < 1e-12);
    assert.ok(Math.abs(axisZ.y + zFactor * Math.sin(inclination)) < 1e-12);
    assert.ok(Math.abs(axisZ.z - zFactor * Math.cos(inclination)) < 1e-12);
    assert.equal(path.name, 'group-orbit-plane');
    assert.equal(path.geometry.points.length, segments + 1);

    for (let i = 0; i <= segments; i += 1) {
      const angle = i / segments * Math.PI * 2;
      const unit = context.__coords(angle, 1, inclination, azimuth);
      const actual = path.geometry.points[i];
      assert.ok(Math.abs(actual.x - unit.x) < 1e-10, `x mismatch at point ${i}`);
      assert.ok(Math.abs(actual.y - unit.y) < 1e-10, `y mismatch at point ${i}`);
      assert.ok(Math.abs(actual.z - unit.z) < 1e-10, `z mismatch at point ${i}`);

      const radius = 37;
      const moving = context.__coords(angle, radius, inclination, azimuth);
      assert.ok(Math.abs(moving.x - actual.x * radius) < 1e-9, `scaled x mismatch at point ${i}`);
      assert.ok(Math.abs(moving.y - actual.y * radius) < 1e-9, `scaled y mismatch at point ${i}`);
      assert.ok(Math.abs(moving.z - actual.z * radius) < 1e-9, `scaled z mismatch at point ${i}`);
    }
  }
});

test('galaxy disc shares the orbit plane, while spin preserves its normal', () => {
  assert.match(source, /hub\.rotation\.set\(inclination, 0, orbitAzimuth\)/);
  assert.match(source, /const hubBaseQuaternion = hub\.quaternion\.clone\(\)/);
  assert.match(source, /cloud\.rotation\.x = 0;/);
  assert.match(source, /galaxy\.rotation\.x = 0;\s*galaxy\.rotation\.y = profile\.turn;/);
  assert.match(source, /group\.hub\.quaternion\.copy\(group\.hubBaseQuaternion\);\s*group\.hub\.rotateY\(simTime \* GALAXY_HUB_SPIN_RATE\)/);
});

test('initial placement, animation, and orbit line use the same plane parameters', () => {
  assert.match(source, /groupCoordinates\(next\.angle, next\.orbitRadius, next\.inclination, next\.orbitAzimuth\)/);
  assert.match(source, /next\.root\.position\.set\(coordinates\.x, next\.elevation \+ coordinates\.y, coordinates\.z \+ next\.depthOffset\)/);
  assert.match(source, /orbitPath\.position\.y = layout\.elevation/);
  assert.match(source, /orbitPath\.scale\.setScalar\(orbitRadius\)/);
  assert.match(source, /orbitPath\.name = 'group-orbit-plane'/);
});


test('raycaster uses the live Three.js pick meshes, not a stale flat navigation model', () => {
  assert.match(source, /globe\.userData\.kind = 'group'/);
  assert.match(source, /hub\.add\(globe\)/);
  assert.match(source, /groupRoot\.add\(next\.root\)/);
  assert.match(source, /for \(const group of groups\.values\(\)\) planetPicks\.push\(group\.globe\)/);
  const raycast = source.slice(source.indexOf('  function raycastAt(event)'), source.indexOf('  function pointerDown(event)'));
  assert.match(raycast, /raycaster\.setFromCamera\(pointer, camera\)/);
  assert.match(raycast, /raycaster\.intersectObjects\(\[\.\.\.planetPicks, \.\.\.examPicks/);
  assert.match(raycast, /, false\)/);
  assert.doesNotMatch(raycast, /coreSurface|coreVolume|galaxy-navigation-model/);
});

test('current camera constraints keep the near plane far inside the nearest focus distance', () => {
  assert.match(source, /new THREE\.PerspectiveCamera\(mobile \? 68 : 60, 1, \.1, 480\)/);
  assert.match(source, /controls\.minDistance = 9/);
  assert.match(source, /travelTo\(group\.globe\.getWorldPosition\(new THREE\.Vector3\(\)\), 17, 2\.6\)/);
  assert.match(source, /travelTo\(target, 8\.2, 1\.25\)/);
});

test('official bundle and cache revisions reflect Stage 2 after build', () => {
  assert.match(built, /group-orbit-plane/);
  assert.match(html, /20261016-all-galaxy-visuals-5a/);
  assert.match(app, /20261016-all-galaxy-visuals-5a/);
});
