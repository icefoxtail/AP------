const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const { select } = require('../visual-profile.js');
const source = fs.readFileSync(path.join(root, 'src/orbital-world.js'), 'utf8');
const built = fs.readFileSync(path.join(root, 'assets/orbital-world.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'orbit.css'), 'utf8');

test('visual profile caps mobile and low-memory/low-core desktops', () => {
  const mobile = select(390, 8, 16);
  assert.equal(mobile.tier, 'mobile');
  assert.deepEqual([mobile.nebulaWidth, mobile.nebulaHeight], [256, 160]);
  assert.deepEqual([mobile.backgroundStars, mobile.galaxyParticles], [420, 560]);
  const lowCoreDesktop = select(1366, 4, 16);
  const lowMemoryDesktop = select(1366, 16, 4);
  for (const budget of [lowCoreDesktop, lowMemoryDesktop]) {
    assert.equal(budget.tier, 'balanced');
    assert.deepEqual([budget.nebulaWidth, budget.nebulaHeight], [384, 240]);
    assert.deepEqual([budget.backgroundFarStars, budget.backgroundStars, budget.galaxyParticles], [4500, 720, 720]);
  }
  const cinematic = select(1366, 8, 8);
  assert.equal(cinematic.tier, 'cinematic');
  assert.deepEqual([cinematic.nebulaWidth, cinematic.nebulaHeight], [512, 320]);
  assert.deepEqual([cinematic.backgroundStars, cinematic.galaxyParticles], [960, 1080]);
  assert.deepEqual([cinematic.nebulaSkyOpacity, cinematic.dataStarOpacity, cinematic.galaxyPointSize], [.32, .71, .35]);
  assert.equal(select(760, undefined, undefined).tier, 'cinematic');
  assert.equal(select(759, undefined, undefined).tier, 'mobile');
  assert.equal(Object.isFrozen(cinematic), true);
});

test('authored module and shipped bundle use the same stable visual profile fields', () => {
  // Deliberately independent of esbuild's generated *local* symbol names.
  const stableFields = [
    'backgroundFarStars', 'backgroundNearStars', 'backgroundStars',
    'galaxyParticles', 'nebulaWidth', 'nebulaHeight',
    'nebulaSkyOpacity', 'dataStarOpacity', 'galaxyPointSize',
  ];
  for (const file of [source, built]) {
    assert.match(file, /APGalaxyVisualProfile\.select\(/);
    for (const field of stableFields) {
      assert.ok(file.includes('visualProfile.' + field), 'runtime missing ' + field);
    }
    assert.match(file, /\.background\s*=\s*null/);
  }
  assert.ok(html.indexOf('visual-profile.js?') < html.indexOf('orbit-app.js?'));
  assert.equal([...html.matchAll(/20261016-universe-cinema-2/g)].length, 5);
  assert.match(css, /assets\/universe-deepfield\.webp/);
  assert.ok(fs.statSync(path.join(root, 'assets/universe-deepfield.webp')).size > 4_096);
});
