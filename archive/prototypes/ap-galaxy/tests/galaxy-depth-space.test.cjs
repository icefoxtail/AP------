'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const src = fs.readFileSync(path.resolve(__dirname, '../src/orbital-world.js'), 'utf8');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const app = fs.readFileSync(path.resolve(__dirname, '../orbit-app.js'), 'utf8');
function helpers(mobile) {
  const hashStart = src.indexOf('function hashText(value) {');
  const hashEnd = src.indexOf('function randomFrom(seed) {', hashStart);
  const start = src.indexOf('function hashUnit(text) {');
  const end = src.indexOf('  // One coordinate transform drives both', start);
  assert.ok(hashStart >= 0 && hashEnd > hashStart && start > hashEnd && end > start);
  const context = {Math, mobile, GOLDEN_ANGLE: Math.PI * (3 - Math.sqrt(5))};
  vm.runInNewContext(src.slice(hashStart, hashEnd) + '\n' + src.slice(start, end)
    + '\nglobalThis.helpers = { galaxyDepthOffset, galaxyDepthCue, groupOrbitLayout };', context);
  return context.helpers;
}

test('five real 3D depth bands remain stable per galaxy id regardless of list ordering', () => {
  const m = helpers(false);
  for (let i = 0; i < 100; i++) {
    const id = `curriculum:middle:fixture-${i}`;
    const a = m.groupOrbitLayout({id}, i, 100);
    const b = m.groupOrbitLayout({id}, 99 - i, 100);
    assert.equal(a.depthOffset, b.depthOffset);
    assert.equal(a.depthOffset, m.galaxyDepthOffset(id, false));
    assert.ok(a.depthOffset >= -15.11 && a.depthOffset <= 15.11);
    assert.ok(Number.isFinite(a.radius) && Number.isFinite(a.elevation));
  }
});

test('mobile depth displacement is constrained and non-zero for multiple ids', () => {
  const m=helpers(true); const offsets=[];
  for (let i=0;i<80;i++) {
    const offset=m.galaxyDepthOffset(`id:${i}`, true);
    assert.ok(offset >= -9.71 && offset <= 9.71);
    offsets.push(offset);
  }
  assert.ok(Math.min(...offsets) < -5 && Math.max(...offsets) > 5);
});

test('depth-aware appearance smooths over distance, without enlarging galaxies', () => {
  for (const mobile of [false,true]) {
    const {galaxyDepthCue} = helpers(mobile);
    const near=galaxyDepthCue(0,mobile,false);
    const far=galaxyDepthCue(999,mobile,false);
    assert.equal(near.disc,1);
    assert.equal(near.haze,0);
    assert.ok(far.disc>=.7 && far.disc<near.disc);
    assert.ok(far.gas>=.65 && far.gas<near.gas);
    assert.ok(far.glow>=.7 && far.glow<near.glow);
    assert.ok(far.haze>.1);
    for (const d of [5,25,60,100,160,200]) {
      const p=galaxyDepthCue(d,mobile,false);
      assert.ok(Object.values(p).every(Number.isFinite));
    }
  }
});

test('focus and selected exam bypass distant dimming', () => {
  for (const mobile of [false,true]) {
    const {galaxyDepthCue} = helpers(mobile);
    const p=galaxyDepthCue(350,mobile,true);
    assert.equal(p.disc,1);
    assert.equal(p.gas,1);
    assert.equal(p.glow,1);
    assert.equal(p.haze,0);
  }
  assert.match(src,/const suppressDepthCue = !!focusedGroupId \|\| !!selectedExamFile \|\| scaleMode !== 'macro'/);
});

test('view-relative depth changes with camera direction rather than world Z alone', () => {
  const {galaxyDepthCue}=helpers(false);
  const camera={x:0,y:40,z:94};
  const galaxy={x:0,y:0,z:0};
  const dot=(forward) => (galaxy.x-camera.x)*forward.x+(galaxy.y-camera.y)*forward.y+(galaxy.z-camera.z)*forward.z;
  const front=galaxyDepthCue(dot({x:0,y:0,z:-1}),false,false);
  const behind=galaxyDepthCue(dot({x:0,y:0,z:1}),false,false);
  assert.ok(front.disc < behind.disc);
  assert.match(src,/camera\.getWorldDirection\(viewForward\)/);
  assert.match(src,/tempA\.copy\(group\.root\.position\)\.sub\(camera\.position\)\.dot\(viewForward\)/);
});

test('orbit line and moving visual/pick root share identical depth shift', () => {
  assert.match(src,/orbitPath\.position\.z = layout\.depthOffset/);
  assert.match(src,/next\.root\.position\.set\(coordinates\.x, next\.elevation \+ coordinates\.y, coordinates\.z \+ next\.depthOffset\)/);
  assert.match(src,/group\.root\.position\.set\(coordinates\.x, group\.elevation \+ coordinates\.y, coordinates\.z \+ group\.depthOffset\)/);
  assert.match(src,/group\.orbitPath\.position\.z = group\.depthOffset/);
  assert.match(src,/orbitPath, palette, color, index, elevation: layout\.elevation, depthOffset: layout\.depthOffset/);
  assert.match(src,/const group = groups\.get\(id\);[\s\S]*?travelTo\(group\.globe\.getWorldPosition/);
});

test('depth cue is not compounded and does not add geometry or matrices per frame', () => {
  const pass=src.slice(src.indexOf('    camera.getWorldDirection(viewForward);'),src.indexOf('    if (questionOrbit) {',src.indexOf('    camera.getWorldDirection(viewForward);')));
  assert.match(pass,/group\.galaxy\.material\.opacity = \(emphasized \? \.92 : quietSchoolMode \? \.54 : \.8\) \* cue\.disc/);
  assert.match(pass,/group\.nebulaBillboard\.material\.color\.copy\(group\.depthBillboardTint\)\.lerp\(depthHazeTint, cue\.haze\)/);
  assert.match(pass,/group\.nucleusGlow\.material\.color\.copy\(group\.depthCoreTint\)\.lerp\(depthNeutralTint, cue\.haze\)/);
  assert.doesNotMatch(pass,/new THREE\.|new Float32Array|\.scale\.set/);
  assert.ok(src.indexOf('    controls.update();\n    // Apply atmospheric perspective')>=0);
});

test('raycast and routing use closest actual Three.js world-space pick hit', () => {
  const section=src.slice(src.indexOf('  function raycastAt(event) {'),src.indexOf('  function pointerDown(event) {'));
  assert.match(section,/raycaster\.setFromCamera\(pointer, camera\)/);
  assert.match(section,/raycaster\.intersectObjects\(\[\.\.\.planetPicks, \.\.\.examPicks,/);
  assert.match(section,/const \{ object: hit, index \} = hits\[0\]/);
  assert.match(section,/onGroup\?\.\(hit\.userData\.groupId\)/);
  assert.match(section,/onExam\?\.\(hit\.userData\.file\)/);
  assert.doesNotMatch(section,/galaxyDepthOffset|collision|project\(/);
});

test('official HTML + dynamic import share Stage 4 cache id', () => {
  const rev='20261016-all-galaxy-visuals-5a';
  assert.equal(html.split(rev).length-1,5);
  assert.equal(app.split(rev).length-1,1);
});
