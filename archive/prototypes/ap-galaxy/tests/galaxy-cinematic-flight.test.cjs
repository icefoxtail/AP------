'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const source = fs.readFileSync(path.resolve(__dirname, '../src/orbital-world.js'), 'utf8');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const app = fs.readFileSync(path.resolve(__dirname, '../orbit-app.js'), 'utf8');
function helpers() {
  const start = source.indexOf('function smoothStep(start, end, value) {');
  const end = source.indexOf('function makeOrbit(radius, aspect, material', start);
  assert.ok(start >= 0 && end > start);
  const scope = {Math, THREE: {MathUtils: {clamp: (x, low, high) => Math.min(high, Math.max(low, x))}}};
  vm.runInNewContext(source.slice(start, end) + '\nglobalThis.result = { smoothStep, coreProximityFade, cinematicTravelSway };', scope);
  return scope.result;
}
test('core near-fade is monotonic, finite and removes the clipping rim on very close approach', () => {
  const {coreProximityFade} = helpers();
  assert.equal(coreProximityFade(-2), 0);
  assert.equal(coreProximityFade(0), 0);
  assert.equal(coreProximityFade(2), 0);
  assert.equal(coreProximityFade(10.5), 1);
  assert.equal(coreProximityFade(40), 1);
  let previous = 0;
  for (let d = 0; d <= 30; d += .2) {
    const value = coreProximityFade(d);
    assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
    assert.ok(value >= previous - 1e-10);
    previous = value;
  }
});
test('camera lateral path starts and ends exactly at target with zero endpoint speed', () => {
  const {cinematicTravelSway} = helpers();
  assert.equal(cinematicTravelSway(0, 90), 0);
  assert.equal(cinematicTravelSway(1, 90), 0);
  assert.equal(cinematicTravelSway(-1, 90), 0);
  assert.equal(cinematicTravelSway(2, 90), 0);
  assert.equal(cinematicTravelSway(.5, 15), 0);
  assert.ok(cinematicTravelSway(.5, 95) > 0);
  assert.ok(cinematicTravelSway(.5, 300) <= 1.65);
  assert.ok(cinematicTravelSway(.001, 100) < 0.00003);
  assert.ok(cinematicTravelSway(.999, 100) < 0.00003);
  for (let i = 0; i <= 100; i++) {
    assert.ok(cinematicTravelSway(i / 100, 90) >= 0);
  }
});
test('camera transition respects instant and reduced-motion routes, with no permanent position offset', () => {
  const travel = source.slice(source.indexOf('  function travelTo(target,'), source.indexOf('  function focusGroup(id)'));
  assert.ok(travel.indexOf("matchMedia('(prefers-reduced-motion: reduce)').matches") < travel.indexOf('side: new THREE.Vector3()'));
  assert.match(travel, /side: new THREE\.Vector3\(\)\.crossVectors\(camera\.up, direction\)\.normalize\(\)/);
  assert.match(travel, /travelDistance,/);
  const tween = source.slice(source.indexOf('    if (cameraTransition) {'), source.indexOf('    if (!cameraTransition && focusedGroupId'));
  assert.match(tween, /camera\.position\.lerpVectors\(cameraTransition\.fromPosition, cameraTransition\.toPosition, eased\)/);
  assert.match(tween, /camera\.position\.addScaledVector\(cameraTransition\.side, cinematicTravelSway\(t, cameraTransition\.travelDistance\)\)/);
  assert.match(tween, /controls\.target\.lerpVectors\(cameraTransition\.fromTarget, cameraTransition\.toTarget, eased\)/);
});
test('every core fades using shader alpha while click meshes keep their positions', () => {
  assert.match(source, /uVisibility: \{ value: 1 \}/);
  assert.match(source, /\.replace\('gl_FragColor=vec4\(c,1\.\);', 'gl_FragColor=vec4\(c,uVisibility\);'\)/);
  assert.match(source, /group\.coreSurface\.material\.uniforms\.uVisibility\.value = proximity \* group\.coreOpacity/);
  assert.match(source, /group\.coreVolume\.material\.opacity \*= proximity/);
  assert.match(source, /const proximity = coreProximityFade\(camera\.position\.distanceTo\(group\.root\.position\)\)/);
  assert.match(source, /galaxy-core-surface/);
});
test('galaxy glow hover and focus are bounded without cumulative scale multiplication', () => {
  assert.match(source, /nucleusGlowBaseScale: nucleusGlow\.scale\.clone\(\)/);
  assert.match(source, /group\.nucleusGlow\.scale\.copy\(group\.nucleusGlowBaseScale\)\.multiplyScalar\(/);
  assert.match(source, /emphasized \? 1\.13 : hoverEmphasis \? 1\.08 : 1/);
  assert.match(source, /group\.nucleusGlow\.material\.opacity = \(emphasized \? \.58 : hovered \? \.47 : \.35\) \* cue\.glow/);
  assert.match(source, /group\.depthBillboardTint/);
});
test('hover only uses actual 3D group hit meshes, throttled on desktop; click routing remains unchanged', () => {
  const hover = source.slice(source.indexOf('  function pointerMove(event) {'), source.indexOf('  function pointerDown(event)'));
  assert.match(hover, /mobile \|\| pointerStart \|\| selectedExamFile/);
  assert.match(hover, /scaleMode !== 'macro'/);
  assert.match(hover, /event\.pointerType === 'touch'/);
  assert.match(hover, /now - lastHoverPick < hoverPickInterval/);
  assert.match(hover, /raycaster\.setFromCamera\(pointer, camera\)/);
  assert.match(hover, /raycaster\.intersectObjects\(planetPicks, false\)/);
  assert.match(hover, /hits\[0\]\.object\.userData\.groupId/);
  assert.doesNotMatch(hover, /onExam\?\.|onGroup\?\./);
  const click = source.slice(source.indexOf('  function raycastAt(event) {'), source.indexOf('  function pointerMove(event) {'));
  assert.match(click, /const \{ object: hit, index \} = hits\[0\]/);
  assert.match(click, /onGroup\?\.\(hit\.userData\.groupId\)/);
  assert.match(click, /onExam\?\.\(hit\.userData\.file\)/);
});
test('hover listeners are added for desktop only and disposed with the renderer', () => {
  const setup = source.slice(source.indexOf("  canvas.addEventListener('pointerdown'"), source.indexOf('  return {\n    setData,'));
  const dispose = source.slice(source.indexOf('    dispose() {'));
  assert.match(setup, /if \(!mobile\) \{\s*canvas\.addEventListener\('pointermove', pointerMove, \{ passive: true \}\);\s*canvas\.addEventListener\('pointerleave', pointerLeave\);/);
  assert.match(dispose, /if \(!mobile\) \{\s*canvas\.removeEventListener\('pointermove', pointerMove\);\s*canvas\.removeEventListener\('pointerleave', pointerLeave\);/);
  assert.match(source, /if \(hoveredGroupId && !groups\.has\(hoveredGroupId\)\) hoveredGroupId = ''/);
});
test('all document and dynamic imports use Stage 5 revision', () => {
  const rev = '20261016-all-galaxy-visuals-5a';
  assert.equal(html.split(rev).length - 1, 5);
  assert.equal(app.split(rev).length - 1, 1);
  assert.ok(!html.includes('20261016-galaxy-depth-space-4'));
});
