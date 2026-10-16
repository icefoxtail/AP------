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

test('every group receives its own 3D core, with hero retaining color accent only', () => {
  assert.match(source, /const isHeroGalaxy = data\.id === HERO_GALAXY_ID;/);
  assert.match(source, /const coreSurface = new THREE\.Mesh\(/);
  assert.match(source, /const coreVolume = new THREE\.Points\(/);
  assert.doesNotMatch(source, /if \(isHeroGalaxy\) \{\s*coreSurface =/);
});

test('core uses a 3D shader sphere and a separate 3D point volume', () => {
  assert.match(source, /new THREE\.SphereGeometry\(\.34, isHeroGalaxy \? 32/);
  assert.match(source, /vertexShader: SUN_VERTEX/);
  assert.match(source, /isHeroGalaxy \? heroFragment : GALAXY_CORE_FRAGMENT/);
  assert.match(source, /makeGalaxyCoreVolume\(data, palette, galaxyCoreParticleBudget\(profile, mobile, isHeroGalaxy\), profile\)/);
  assert.match(source, /coreVolume\.scale\.set\(coreShape\.x \* majorGalaxyScale/);
});

test('core volume generator creates bounded, finite, non-planar geometry', () => {
  const start = source.indexOf('  function makeGalaxyCoreVolume(');
  const end = source.indexOf('  function makeNebulaCloud(', start);
  assert.ok(start >= 0 && end > start, 'core volume helper must be present before nebula generator');
  const helper = source.slice(start, end);

  class Color {
    constructor(hex) {
      this.r = ((hex >> 16) & 255) / 255;
      this.g = ((hex >> 8) & 255) / 255;
      this.b = (hex & 255) / 255;
    }
    clone() {
      const copy = new Color(0);
      copy.r = this.r; copy.g = this.g; copy.b = this.b;
      return copy;
    }
    lerp(other, alpha) {
      this.r += (other.r - this.r) * alpha;
      this.g += (other.g - this.g) * alpha;
      this.b += (other.b - this.b) * alpha;
      return this;
    }
    toArray(target, offset = 0) {
      target[offset] = this.r;
      target[offset + 1] = this.g;
      target[offset + 2] = this.b;
      return target;
    }
  }
  class BufferAttribute {
    constructor(array, itemSize) { this.array = array; this.itemSize = itemSize; }
  }
  class BufferGeometry {
    constructor() { this.attributes = {}; }
    setAttribute(name, attribute) { this.attributes[name] = attribute; return this; }
  }
  function randomFrom(seed) {
    let state = (Number(seed) >>> 0) || 1;
    return () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 0x100000000;
    };
  }
  const context = {
    THREE: { Color, BufferAttribute, BufferGeometry },
    ORBIT_COLORS: [0x77a5df],
    randomFrom,
    hashText: () => 731,
    HERO_GALAXY_ID: 'curriculum:high:공통수학1',
  };
  vm.runInNewContext(`${helper}\nglobalThis.__makeGalaxyCoreVolume = makeGalaxyCoreVolume;`, context);
  const geometry = context.__makeGalaxyCoreVolume({ id: 'curriculum:high:공통수학1' }, 0, 180, { kind: 'spiral' });
  const positions = geometry.attributes.position.array;
  const colors = geometry.attributes.color.array;

  assert.equal(positions.length, 180 * 3);
  assert.equal(colors.length, 180 * 3);
  assert.ok(Array.from(positions).every(Number.isFinite));
  assert.ok(Array.from(colors).every(Number.isFinite));

  let hasYDepth = false;
  let hasZDepth = false;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const normalizedRadius = Math.sqrt(x * x + (y / .9) ** 2 + (z / .82) ** 2);
    assert.ok(normalizedRadius <= .520001, `particle ${i / 3} escaped its volume`);
    if (Math.abs(y) > .01) hasYDepth = true;
    if (Math.abs(z) > .01) hasZDepth = true;
  }
  assert.ok(hasYDepth, 'particle distribution must extend above/below the disc plane');
  assert.ok(hasZDepth, 'particle distribution must extend through depth');
});

test('existing cleanup disposes the core once and keeps shared pick geometry', () => {
  const cleanup = source.slice(source.indexOf('  function clearGroupNode('), source.indexOf('  const FACET_KINDS'));
  assert.match(cleanup, /group\.root\.traverse\(\(object\) =>/);
  assert.match(cleanup, /object\.geometry\.dispose\(\)/);
  assert.match(cleanup, /object\.material\.dispose\(\)/);
  assert.match(cleanup, /object\.geometry !== sharedGroupPickGeometry/);
  assert.match(source, /coreSurface\.userData\.visualOnly = true/);
  assert.match(source, /coreVolume\.userData\.visualOnly = true/);
  assert.doesNotMatch(source, /if \(reusing\) \{\s*root\.traverse/);
});

test('shader time follows the existing reduced-motion animation gate', () => {
  assert.match(source, /if \(group\.coreSurface && animate\) group\.coreSurface\.material\.uniforms\.uTime\.value = simTime;/);
  assert.match(source, /group\.coreVolume\.material\.opacity =\s*\(emphasized \? \.82 : quietSchoolMode \? \.18 : \.62\) \* cue\.glow \* group\.coreOpacity;/);
});

test('official bundle and cache revision reflect the source patch after build', () => {
  assert.match(built, /galaxy-core-surface/);
  assert.match(built, /galaxy-core-volume/);
  assert.match(built, /curriculum:high:공통수학1/);
  assert.match(html, /20261016-all-galaxy-visuals-5a/);
  assert.match(app, /20261016-all-galaxy-visuals-5a/);
});
