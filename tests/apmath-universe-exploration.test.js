// Camera/state/clock regressions with real Three.js geometry. Actual WebGL and
// DOM/touch journeys are verified separately by check-universe-browser.mjs.
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const base = pathToFileURL(path.join(__dirname, '../apmath/playground/universe/')).href;

(async () => {
  const THREE = await import(`${base}vendor/three.module.js`);
  const { createExploration } = await import(`${base}exploration.js`);
  const { createFrameClock, MathGalaxyMotionEngine } = await import(`${base}math-motion.js`);
  const { createCircleSectorObject } = await import(`${base}math-objects.js`);
  const near = (a, b, tolerance = 1e-7) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`);
  const vectorNear = (a, b) => a.forEach((v, i) => near(v, b[i]));

  for (const fps of [24, 30]) {
    const clock = createFrameClock(fps, 0);
    let frames = 0, elapsed = 0;
    for (let i = 1; i <= 600; i++) {
      const dt = clock.sample(i * 1000 / 60);
      if (dt !== null) { frames++; elapsed += dt; }
    }
    assert.equal(frames, fps * 10, 'Floating point throttle boundaries must not add frames');
    near(elapsed, 10);
    clock.reset(60000);
    assert.equal(clock.sample(60001), null);
    near(clock.sample(60000 + 1000 / fps), 1 / fps);
  }

  function harness(width, height, reduced = false) {
    let now = 0;
    const media = new THREE.EventDispatcher(); media.matches = reduced;
    global.window = { innerWidth: width, innerHeight: height, matchMedia: () => media };
    global.document = { querySelector: selector => ({ getBoundingClientRect: () => selector === '.top-nav'
      ? { bottom: width < 768 ? 104 : 76, height: 64 }
      : { top: window.innerHeight - (width < 768 ? 198 : 120), height: width < 768 ? 132 : 100 } }) };
    const canvas = new THREE.EventDispatcher();
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: window.innerWidth, height: window.innerHeight });
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.set(-6, 11, 46);
    const controls = new THREE.EventDispatcher();
    controls.target = new THREE.Vector3(0.8, -0.4, 0); controls.enableDamping = true; controls.enabled = true;
    controls.update = () => { camera.lookAt(controls.target); camera.updateMatrixWorld(true); };
    controls.update();
    const registry = ['circle-sector', 'polyhedra', 'ellipse'].map((id, index) => {
      const anchor = new THREE.Group(), group = new THREE.Group();
      anchor.position.set(...[[28, 15, -46], [-15, 3.2, -7], [16, -2.8, -9]][index]);
      group.add(new THREE.Mesh(new THREE.SphereGeometry(3, 8, 6), new THREE.MeshBasicMaterial()));
      anchor.add(group); scene.add(anchor);
      return { anchor, group, focusRadius: 4, metadata: { id, title: id, subtitle: 'fixture' } };
    });
    const motionEngine = { paused: false, setPaused(value) { this.paused = value; }, setPointer() {} };
    const changes = [];
    const explorer = createExploration({ scene, camera, controls, canvas, celestialRegistry: registry, motionEngine,
      onStateChange: (state, change) => changes.push({ state, change }) });
    const tick = (seconds = 1.5) => { for (let i = 0; i < Math.ceil(seconds * 60); i++) { now += 1 / 60; explorer.update(1 / 60, now); } };
    function dispose() {
      explorer.dispose(); explorer.dispose();
      for (const { group } of registry) group.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
    }
    return { scene, camera, controls, registry, explorer, motionEngine, media, canvas, changes, tick, dispose };
  }

  function geometryState(group) {
    const value = [];
    group.traverse(object => {
      if (object.isInstancedMesh) value.push(...object.instanceMatrix.array);
      if (object.geometry?.attributes.position) value.push(...object.geometry.attributes.position.array);
      if (object.material && !Array.isArray(object.material)) value.push(object.material.opacity);
    });
    return JSON.stringify(value);
  }

  for (const [width, height] of [[1440, 900], [390, 844], [390, 667]]) {
    const h = harness(width, height), e = h.explorer;
    const original = { position: h.camera.position.toArray(), target: h.controls.target.toArray() };
    h.tick(0.1);
    assert.equal(e.getState().mode, 'universe');
    assert.ok(e.debug().families.every(f => f.detailedObjects === 0));
    assert.equal(h.scene.getObjectByName('concept-galaxy-circle-sector').children.length, 6);
    assert.equal(h.scene.getObjectByName('concept-galaxy-polyhedra').children.length, 2);
    assert.equal(e.focusOnCelestial('unknown'), false);
    assert.equal(e.focusOnCelestial('circle'), true, 'Legacy circle URL remains supported');
    h.tick();
    assert.equal(e.getState().mode, 'galaxy');
    assert.equal(e.getState().transitioning, false);
    const labels = e.getProjected();
    assert.equal(labels.length, 6);
    assert.ok(labels.every(label => label.visible && Number.isFinite(label.x) && Number.isFinite(label.y)), `Six circle labels must fit ${width}x${height}: ${JSON.stringify(labels)}`);
    assert.equal(h.registry[2].anchor.visible, false, 'Unrelated bodies do not obstruct exploration');
    const galaxyPose = { position: h.camera.position.toArray(), target: h.controls.target.toArray() };

    // Blank short tap preserves the selected family; a drag must not select.
    for (const [id, move] of [[1, 0], [2, 100]]) {
      h.canvas.dispatchEvent({ type: 'pointerdown', pointerId: id, pointerType: 'mouse', button: 0, clientX: 1, clientY: 1 });
      if (move) h.canvas.dispatchEvent({ type: 'pointermove', pointerId: id, clientX: 1 + move, clientY: 1 });
      h.canvas.dispatchEvent({ type: 'pointerup', pointerId: id, clientX: 1 + move, clientY: 1 });
      assert.equal(e.getState().mode, 'galaxy');
    }
    e.selectConcept('two-tangents'); h.tick(2);
    assert.equal(e.getState().conceptId, 'two-tangents');
    assert.ok(h.registry.every(c => !c.anchor.visible), 'Large hosts do not intrude into close observation');
    assert.equal(h.scene.getObjectByName('two-tangents').visible, true);
    assert.equal(h.scene.getObjectByName('chord-bisector').visible, false);
    assert.ok(e.getState().mathTime > 0 && e.getState().mathTime < 2);
    e.toggleConceptPlayback(); const paused = e.getState().mathTime; h.tick(0.2); near(e.getState().mathTime, paused);
    e.seekConcept(7); h.tick(0.05); near(e.getState().mathTime, 7);
    const completedSibling = geometryState(h.scene.getObjectByName('math-concept-two-tangents'));
    e.selectConcept('chord-bisector'); h.tick(1.5);
    assert.equal(e.getState().conceptId, 'chord-bisector');
    assert.notEqual(geometryState(h.scene.getObjectByName('math-concept-two-tangents')), completedSibling, 'Previous detail returns to completed preview');
    e.replayConcept(); h.tick(0.25); assert.ok(e.getState().mathPlaying && e.getState().mathTime < 0.3);
    e.back(); h.tick();
    assert.equal(h.registry[0].anchor.visible, true);
    assert.equal(h.scene.getObjectByName('chord-bisector').visible, true, 'Family companions return at their existing positions');
    vectorNear(h.camera.position.toArray(), galaxyPose.position);
    vectorNear(h.controls.target.toArray(), galaxyPose.target);

    // A moving host translates camera and target together, without changing
    // the relative viewing pose or passing the host's self-rotation to satellites.
    const before = h.camera.position.clone(), beforeTarget = h.controls.target.clone();
    const translation = new THREE.Vector3(1.25, -0.4, 0.8);
    h.registry[0].anchor.position.add(translation); h.tick(0.05);
    vectorNear(h.camera.position.clone().sub(before).toArray(), translation.toArray());
    vectorNear(h.controls.target.clone().sub(beforeTarget).toArray(), translation.toArray());
    e.focusOnCelestial('polyhedra'); e.selectConcept('cube-octahedron'); h.tick();
    assert.ok(h.scene.getObjectByName('cube-octahedron').quaternion.angleTo(new THREE.Quaternion()) > 0.4, 'Duals start at an oblique common orientation, separating front and back vertices');
    e.selectConcept('dodecahedron-icosahedron'); e.focusOnCelestial('circle-sector'); h.tick();
    assert.equal(e.getState().mode, 'galaxy'); assert.equal(e.getState().celestialId, 'circle-sector');
    assert.equal(e.getState().transitioning, false, 'Old flight completion cannot restore an obsolete route');
    e.resetFocus(); h.tick();
    vectorNear(h.camera.position.toArray(), original.position);
    vectorNear(h.controls.target.toArray(), original.target);
    assert.ok(h.registry.every(c => c.anchor.visible));
    assert.ok(e.debug().families.every(f => f.detailedObjects === 0));
    h.dispose();
    assert.equal(h.scene.getObjectByName('concept-galaxy-circle-sector'), undefined);
  }

  const reduced = harness(390, 844, true), e = reduced.explorer;
  assert.equal(reduced.motionEngine.paused, true);
  e.focusOnCelestial('circle-sector'); reduced.tick(0.05);
  const slot = reduced.scene.getObjectByName('two-tangents'), orientation = slot.quaternion.toArray();
  reduced.tick(0.3); vectorNear(slot.quaternion.toArray(), orientation);
  e.selectConcept('two-tangents'); reduced.tick(0.05);
  assert.equal(e.getState().mathTime, 8); assert.equal(e.getState().mathPlaying, false);
  const object = reduced.scene.getObjectByName('math-concept-two-tangents'), held = geometryState(object);
  reduced.tick(0.25); assert.equal(geometryState(object), held);
  e.replayConcept(); reduced.tick(0.5);
  assert.ok(e.getState().mathPlaying); assert.notEqual(geometryState(object), held, 'Explicit reduced-motion replay changes actual geometry');
  e.seekConcept(8); reduced.tick(0.05); assert.equal(geometryState(object), held);
  e.resetFocus(); reduced.tick(1 / 60);
  assert.ok(e.debug().families.every(f => f.open === 0 && f.detailedObjects === 0), 'Reduced-motion return releases detailed resources on its first frame');
  reduced.dispose();

  const core = createCircleSectorObject({ radius: 3.8 });
  core.update(0);
  const lines = core.group.children.find(object => object.isLineSegments);
  const geometry = lines.geometry;
  for (const time of [0, Math.PI / 1.6, Math.PI / 0.8, 100]) {
    core.update(time); assert.equal(lines.geometry, geometry);
    const values = geometry.attributes.position.array;
    for (let i = 0; i < values.length; i += 3) assert.ok(geometry.boundingSphere.containsPoint(new THREE.Vector3(values[i], values[i + 1], values[i + 2])), 'Moving radius endpoint remains raycastable');
  }
  core.dispose();

  const engine = new MathGalaxyMotionEngine({ scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera() });
  const anchor = new THREE.Group(), visual = new THREE.Group(); anchor.add(visual);
  engine.registerCelestialNode({ id: 'fixture', group: anchor, rotationGroup: visual, basePosition: new THREE.Vector3(3, 4, 5), selfRotationSpeed: new THREE.Vector3(0.1, 0.2, 0.3), updater() {} });
  engine.update(1, 0.1);
  vectorNear(anchor.rotation.toArray().slice(0, 3), [0, 0, 0]);
  assert.ok(visual.rotation.y > 0);
  engine.dispose();
  console.log('AP Math Universe: clock caps, 3 viewport camera/route flows, anchor tracking, reduced-motion replay and core picking bounds verified. WebGL/DOM QA is separate.');
})().catch(error => { console.error(error); process.exitCode = 1; });
