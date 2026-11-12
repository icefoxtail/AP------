import * as THREE from './vendor/three.module.js';
import { createConceptObject } from './concept-objects.js';
import { CONCEPT_GALAXIES, getConcept, galaxyLayout, galaxyBounds, resolveCelestialId } from './concept-registry.js';

const DURATION = 8;
const clamp = THREE.MathUtils.clamp;
const smooth = x => x * x * (3 - 2 * x);
const vec = a => new THREE.Vector3(...a);

/** Camera/state/picking have one owner. Factories own only their local geometry. */
export function createExploration({ scene, camera, controls, canvas, celestialRegistry, motionEngine, onStateChange, onFrame }) {
  const families = new Map();
  const raycaster = new THREE.Raycaster();
  raycaster.params.Line.threshold = 0.12;
  const pointers = new Map();
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = media.matches;
  let route = { mode: 'universe', celestialId: null, conceptId: null };
  let flight = null, warpCallback = null, transitionToken = 0;
  let universePose = snapshot(), galaxyPose = null;
  let mathTime = 0, mathPlaying = false, explicitMathMotion = false;
  let explicitAmbientMotion = false;
  let ambientTime = 0;
  let portrait = window.innerWidth < 768, uiVisible = true, disposed = false;
  let projected = [], lastAnchor = null;
  let pauseBeforePreference = false;
  let mathPlayingBeforePreference = false;
  const delta = new THREE.Vector3(), zero = new THREE.Vector3();
  const pointerNdc = new THREE.Vector2();
  const forward = new THREE.Vector3(0, 0, 1);
  const pickMeshes = [];
  for (const c of celestialRegistry) c.group.traverse(o => {
    if (o.isMesh || o.isLine) { o.userData.celestialId = c.metadata.id; pickMeshes.push(o); }
  });

  // The same real mathematical objects remain visible from the opening universe
  // through close observation. Selecting changes their scale/camera, not whether
  // the relationship exists or starts moving.
  for (const [id, definition] of Object.entries(CONCEPT_GALAXIES)) {
    const host = celestialRegistry.find(c => c.metadata.id === id);
    const root = new THREE.Group(); root.name = `concept-galaxy-${id}`;
    scene.add(root);
    const nodes = definition.concepts.map((def, i) => {
      const slot = new THREE.Group(); slot.name = def.id;
      root.add(slot); slot.position.fromArray(def.compact);
      return { def, slot, object: null, time: i * 0.73, orientation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.16 * Math.sin(i + 1), 0.25 * Math.cos(i), 0.08 * (i - 2))), detailOrientation: new THREE.Quaternion().setFromEuler(new THREE.Euler(...(definition.detailRotation || [0, 0, 0]))), world: new THREE.Vector3() };
    });
    const family = { id, definition, host, root, nodes, open: 0, basis: new THREE.Quaternion() };
    families.set(id, family); loadFamily(family);
  }

  function snapshot(anchor = null) {
    const origin = anchor || new THREE.Vector3();
    return { position: camera.position.clone().sub(origin), target: controls.target.clone().sub(origin), relative: !!anchor };
  }
  function activeFamily() { return families.get(route.celestialId); }
  function hostOf(id) { return celestialRegistry.find(c => c.metadata.id === id); }
  function anchorOf(id) { return hostOf(id)?.anchor.position || zero; }
  function localToWorld(local, family) { return vec(local).applyQuaternion(family.basis).add(family.host.anchor.position); }
  function isMathPlaying() { return mathPlaying && ((!motionEngine.paused && (!reducedMotion || explicitAmbientMotion)) || explicitMathMotion); }
  function state() {
    const family = activeFamily(), concept = getConcept(route.celestialId, route.conceptId);
    const host = hostOf(route.celestialId);
    return {
      ...route,
      route: { kind: route.mode, galaxyId: route.celestialId, conceptId: route.conceptId },
      transitioning: !!flight,
      title: concept?.label || family?.definition.title || host?.metadata.title || '수학의 우주',
      subtitle: concept ? (family.nodes.find(n => n.def.id === concept.id)?.object?.metadata.summary || '') : (family?.definition.subtitle || host?.metadata.subtitle || '작은 천체들이 품은 수학의 관계를 발견해 보세요.'),
      concepts: family ? family.definition.concepts.map(c => ({ id: c.id, label: c.label })) : [],
      motionPlaying: !motionEngine.paused, reducedMotion,
      mathPlaying: isMathPlaying(), mathTime, mathDuration: DURATION,
    };
  }
  function emit(history = 'none') { onStateChange?.(state(), { history }); }

  function loadFamily(family) {
    for (const node of family.nodes) if (!node.object) {
      node.object = createConceptObject({ id: node.def.id, isMobile: portrait });
      node.object.group.name = `math-concept-${node.def.id}`;
      node.object.group.traverse(o => { o.userData.conceptId = node.def.id; o.userData.celestialId = family.id; });
      node.object.group.scale.setScalar(0.55 * node.def.radius / node.object.radius);
      node.slot.add(node.object.group);
      node.object.update(node.time, { detail: false, loop: true, reducedMotion });
    }
  }
  function unloadFamily(family) {
    for (const node of family.nodes) if (node.object) {
      node.slot.remove(node.object.group); node.object.dispose(); node.object = null;
    }
  }
  function insets() {
    const top = document.querySelector('.top-nav')?.getBoundingClientRect();
    const bottom = document.querySelector('.bottom-bar')?.getBoundingClientRect();
    return {
      left: portrait ? 18 : 40, right: portrait ? 18 : 40,
      top: Math.max(portrait ? 100 : 90, (top?.bottom || 0) + 14),
      bottom: Math.max(portrait ? 150 : 125, bottom && bottom.height ? window.innerHeight - bottom.top + 12 : 0),
    };
  }
  // Uses the same perspective camera model as rendering, including available
  // HUD space and complete mathematical glyphs. All offsets use the galaxy basis.
  function fitPose(bounds, family, withLabels = true) {
    const w = window.innerWidth, h = window.innerHeight, pad = insets();
    const usableW = Math.max(140, w - pad.left - pad.right);
    const usableH = Math.max(160, h - pad.top - pad.bottom - (withLabels ? 36 : 16));
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const sizeX = bounds.max[0] - bounds.min[0], sizeY = bounds.max[1] - bounds.min[1];
    let d = Math.max(sizeY / (2 * tan) * h / usableH, sizeX / (2 * tan * camera.aspect) * w / usableW) * 1.06 + Math.max(0, bounds.max[2]);
    d = Math.max(d, route.mode === 'concept' ? 6 : 20);
    const target = [(bounds.min[0] + bounds.max[0]) / 2, (bounds.min[1] + bounds.max[1]) / 2, 0];
    const cssScale = h / (2 * d * tan);
    target[0] -= ((pad.left + w - pad.right) / 2 - w / 2) / cssScale;
    target[1] += ((pad.top + h - pad.bottom - (withLabels ? 36 : 0)) / 2 - h / 2) / cssScale;
    return { position: localToWorld([target[0], target[1] + 0.5, d], family), target: localToWorld(target, family) };
  }
  function destination() {
    const family = activeFamily();
    if (family && route.mode === 'galaxy') return fitPose(galaxyBounds(family.id, portrait), family);
    if (family && route.mode === 'concept') {
      const node = family.nodes.find(n => n.def.id === route.conceptId);
      const p = (portrait ? node.def.portrait : node.def.wide);
      const r = node.def.radius;
      const bounds = { min: p.map(x => x - r), max: p.map(x => x + r) };
      const pose = fitPose(bounds, family, false);
      // Focus distance is measured relative to this object, including its depth.
      pose.position.addScaledVector(forward.clone().applyQuaternion(family.basis), p[2]);
      pose.target.addScaledVector(forward.clone().applyQuaternion(family.basis), p[2]);
      return pose;
    }
    if (route.mode === 'focus') {
      const host = hostOf(route.celestialId), center = host.anchor.position.clone();
      const r = Math.min(host.focusRadius || 6, 16), pad = insets();
      const v = Math.min(THREE.MathUtils.degToRad(camera.fov / 2), Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect));
      const d = Math.min(180, Math.max(16, r / Math.sin(v) * 1.15));
      center.y += ((pad.top - pad.bottom) / window.innerHeight) * r;
      return { position: center.clone().add(new THREE.Vector3(0, 1, d)), target: center };
    }
    return { position: universePose.position.clone(), target: universePose.target.clone() };
  }
  function beginFlight(to = null, animate = true, complete = null) {
    const token = ++transitionToken;
    controls.enabled = false;
    // Consume old damping before capturing a flight. Camera and target are then
    // written exclusively by this controller until user interaction cancels it.
    const damping = controls.enableDamping; controls.enableDamping = false; controls.update(); controls.enableDamping = damping;
    flight = { token, from: snapshot(), to, elapsed: 0, duration: animate && !reducedMotion ? 1.05 : 0, complete };
  }
  function cancelFlight() {
    if (!flight || warpCallback) return;
    flight = null; transitionToken++; controls.enabled = true;
  }
  function setLimits() {
    controls.minDistance = route.mode === 'concept' ? 3.8 : route.mode === 'universe' ? 14 : 9;
    controls.maxDistance = route.mode === 'universe' ? 130 : 220;
  }
  function focusOnCelestial(rawId, { history = 'push', conceptId = null, animate = true } = {}) {
    const id = resolveCelestialId(rawId), host = hostOf(id);
    if (!host || disposed || warpCallback) return false;
    if (route.mode === 'universe') universePose = snapshot();
    const oldId = route.celestialId, family = families.get(id);
    if (family && oldId !== id) {
      family.basis.copy(camera.quaternion); family.root.quaternion.copy(family.basis);
      galaxyPose = null;
    }
    route = { mode: family ? 'galaxy' : 'focus', celestialId: id, conceptId: null };
    mathPlaying = false; mathTime = 0; lastAnchor = host.anchor.position.clone();
    motionEngine.setPointer(0, 0);
    if (family) loadFamily(family);
    setLimits(); emit(history); beginFlight(null, animate);
    if (conceptId && getConcept(id, conceptId)) selectConcept(conceptId, { history: history === 'none' ? 'none' : 'replace', animate });
    return true;
  }
  function selectConcept(id, { history = 'push', animate = true } = {}) {
    const family = activeFamily(), node = family?.nodes.find(n => n.def.id === id);
    if (!node || disposed || warpCallback) return false;
    if (route.mode === 'galaxy' && !flight) galaxyPose = snapshot(family.host.anchor.position);
    route = { mode: 'concept', celestialId: family.id, conceptId: id };
    explicitMathMotion = false;
    const holdForPreference = reducedMotion && !explicitAmbientMotion;
    mathTime = holdForPreference ? DURATION : node.time; mathPlaying = !holdForPreference;
    mathPlayingBeforePreference = true;
    loadFamily(family); setLimits();
    node.object.update(mathTime, { detail: true, loop: true, reducedMotion: holdForPreference });
    emit(history); beginFlight(null, animate);
    return true;
  }
  function back() {
    if (route.mode === 'concept') {
      const family = activeFamily();
      route = { mode: 'galaxy', celestialId: family.id, conceptId: null };
      mathPlaying = false; setLimits();
      emit('replace');
      const pose = galaxyPose ? { position: galaxyPose.position.clone().add(family.host.anchor.position), target: galaxyPose.target.clone().add(family.host.anchor.position) } : null;
      beginFlight(pose);
    } else resetFocus({ history: 'replace' });
  }
  function resetFocus({ history = 'push', animate = true } = {}) {
    if (warpCallback || disposed) return;
    route = { mode: 'universe', celestialId: null, conceptId: null };
    mathPlaying = false; lastAnchor = null; galaxyPose = null;
    setLimits(); emit(history); beginFlight(null, animate);
  }
  function replayConcept() { if (route.mode !== 'concept') return; explicitMathMotion = true; mathTime = 0; mathPlaying = true; mathPlayingBeforePreference = true; emit(); }
  function toggleConceptPlayback() {
    if (route.mode !== 'concept') return false;
    if (mathTime >= DURATION) mathTime = 0;
    const playing = isMathPlaying();
    explicitMathMotion = true;
    mathPlaying = !playing; mathPlayingBeforePreference = mathPlaying; emit(); return mathPlaying;
  }
  function seekConcept(seconds) { if (route.mode !== 'concept') return; explicitMathMotion = true; mathTime = clamp(Number(seconds) || 0, 0, DURATION); mathPlaying = false; mathPlayingBeforePreference = false; emit(); }

  function visibleBody(id) {
    if (!id || route.mode === 'universe') return true;
    // Close observation isolates the relationship. Nearby large bodies would
    // otherwise expand across the viewport edges and the navigation controls.
    if (route.mode === 'concept') return false;
    // Keep the sky; unrelated mathematics must not sit between camera and the
    // selected relationship. Original visibility is restored on return.
    return id === route.celestialId;
  }
  function update(dt, time) {
    if (disposed) return;
    const holdForPreference = reducedMotion && !explicitAmbientMotion;
    const autoMotion = !motionEngine.paused && !holdForPreference;
    if (autoMotion) ambientTime += dt;
    // A camera transition must never be the start button for a mathematical
    // figure. The selected loop continues through flights and past its endpoint.
    if (route.mode === 'concept' && isMathPlaying()) mathTime = (mathTime + dt) % DURATION;
    if (route.celestialId) {
      const anchor = anchorOf(route.celestialId);
      if (lastAnchor) {
        delta.copy(anchor).sub(lastAnchor); camera.position.add(delta); controls.target.add(delta);
        if (flight) { flight.from.position.add(delta); flight.from.target.add(delta); if (flight.to) { flight.to.position.add(delta); flight.to.target.add(delta); } }
      }
      if (!lastAnchor) lastAnchor = anchor.clone(); else lastAnchor.copy(anchor);
    }
    for (const c of celestialRegistry) c.anchor.visible = visibleBody(c.metadata.id);
    const selectedFamily = activeFamily();
    for (const family of families.values()) {
      const active = family === selectedFamily && route.mode !== 'universe';
      // Reduced motion has no hidden opening/closing animation.
      family.open = reducedMotion ? (active ? 1 : 0) : clamp(family.open + (active ? dt / 0.95 : -dt / 0.7), 0, 1);
      const opening = smooth(family.open);
      family.root.position.copy(family.host.anchor.position);
      family.root.quaternion.copy(family.basis);
      family.root.visible = route.mode === 'universe' || active;
      const layout = galaxyLayout(family.id, portrait);
      const hostOffset = vec(layout.host).multiplyScalar(opening).applyQuaternion(family.basis);
      family.host.group.position.copy(hostOffset);
      if (active) family.host.group.quaternion.slerp(family.basis, reducedMotion ? 1 : 1 - Math.exp(-dt * 4));
      for (let i = 0; i < family.nodes.length; i++) {
        const node = family.nodes[i], selected = active && route.conceptId === node.def.id;
        node.slot.visible = !active || route.mode !== 'concept' || selected;
        node.slot.position.fromArray(node.def.compact).lerp(vec(layout.bodies[i].position), opening);
        if (!active && !holdForPreference) {
          // Derive even paused poses from the frozen clock, rather than settling
          // to a different quaternion after the pause button was pressed.
          node.slot.position.z += Math.sin(ambientTime * 0.16 + i * 1.7) * 0.45;
          node.slot.rotation.set(0.18 * Math.sin(ambientTime * 0.1 + i), 0.25 * Math.cos(ambientTime * 0.08 + i), ambientTime * 0.025 + i * 0.2);
        } else if (autoMotion || holdForPreference || flight || (family.open > 0 && family.open < 1)) {
          node.slot.quaternion.slerp(selected ? node.detailOrientation : node.orientation, holdForPreference ? 1 : 1 - Math.exp(-dt * 5));
        }
        if (node.object) {
          node.object.group.visible = node.slot.visible;
          const scale = node.def.radius / node.object.radius * (0.55 + opening * 0.45);
          node.object.group.scale.setScalar(scale);
          if (selected) node.time = mathTime;
          else if (autoMotion) node.time = (node.time + dt) % DURATION;
          if (family.root.visible && node.slot.visible) node.object.update(node.time, { detail: selected, loop: true, reducedMotion: holdForPreference && !(selected && explicitMathMotion) });
        }
      }
    }
    if (flight) {
      const current = flight, to = current.to || destination();
      current.elapsed += dt;
      const t = current.duration ? clamp(current.elapsed / current.duration, 0, 1) : 1;
      const easing = smooth(t);
      camera.position.lerpVectors(current.from.position, to.position, easing);
      controls.target.lerpVectors(current.from.target, to.target, easing);
      camera.lookAt(controls.target);
      if (t === 1 && flight?.token === current.token) {
        flight = null; controls.enabled = !warpCallback; controls.update();
        current.complete?.(); emit();
      }
    } else controls.update();
    scene.updateMatrixWorld(true); camera.updateMatrixWorld(true);
    projected = [];
    if (selectedFamily && route.mode === 'galaxy') {
      const pad = insets(), width = window.innerWidth, height = window.innerHeight;
      for (const node of selectedFamily.nodes) {
        node.slot.getWorldPosition(node.world);
        const p = node.world.clone().project(camera);
        const distance = Math.max(0.1, node.world.distanceTo(camera.position));
        const pixels = node.def.radius * height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance);
        const x = (p.x + 1) * width / 2, y = (1 - p.y) * height / 2;
        projected.push({ id: node.def.id, label: node.def.label, x, y, radiusPx: pixels, depth: p.z, visible: uiVisible && p.z > -1 && p.z < 1 && x > pad.left && x < width - pad.right && y > pad.top && y < height - pad.bottom + 10, isSelected: false });
      }
    }
    onFrame?.({ labels: projected, mathTime, mathPlaying: isMathPlaying(), mathDuration: DURATION });
  }

  function clickAt(e) {
    if (!uiVisible || warpCallback) return;
    const rect = canvas.getBoundingClientRect();
    pointerNdc.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointerNdc, camera);
    const family = activeFamily();
    if (family && (route.mode === 'galaxy' || route.mode === 'concept')) {
      const meshes = [];
      for (const node of family.nodes) if (node.object?.group.visible) node.object.group.traverse(o => { if (o.isMesh && o.visible) meshes.push(o); });
      const hit = raycaster.intersectObjects(meshes, false).find(h => h.object.userData.conceptId);
      if (hit) { selectConcept(hit.object.userData.conceptId); return; }
      // A visible screen-space proxy gives small mobile bodies a usable target.
      if (route.mode === 'galaxy') {
        const choices = family.nodes.map(node => {
          node.slot.getWorldPosition(node.world); const p = node.world.clone().project(camera);
          const x = (p.x + 1) * rect.width / 2 + rect.left, y = (1 - p.y) * rect.height / 2 + rect.top;
          const radius = Math.max(24, node.def.radius * rect.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * node.world.distanceTo(camera.position)));
          return { id: node.def.id, d: Math.hypot(e.clientX - x, e.clientY - y) / radius, depth: p.z };
        }).filter(n => n.d <= 1 && n.depth > -1 && n.depth < 1).sort((a, b) => a.d - b.d || a.depth - b.depth);
        if (choices[0]) { selectConcept(choices[0].id); return; }
      }
    }
    if (route.mode === 'universe') {
      const all = pickMeshes.filter(o => o.visible);
      for (const f of families.values()) for (const n of f.nodes) {
        n.object?.group.traverse(o => { if (o.isMesh && o.visible) all.push(o); });
      }
      const hit = raycaster.intersectObjects(all, false)[0];
      if (hit?.object.userData.celestialId) focusOnCelestial(hit.object.userData.celestialId);
    }
  }
  function pointerDown(e) {
    if (e.button && e.pointerType !== 'touch') return;
    cancelFlight();
    const value = { x: e.clientX, y: e.clientY, max: 0, start: performance.now(), multi: pointers.size > 0 };
    if (pointers.size) pointers.forEach(p => { p.multi = true; });
    pointers.set(e.pointerId, value);
  }
  function pointerMove(e) {
    const p = pointers.get(e.pointerId);
    if (p) p.max = Math.max(p.max, Math.hypot(e.clientX - p.x, e.clientY - p.y));
    if (route.mode === 'universe') {
      const r = canvas.getBoundingClientRect(); motionEngine.setPointer((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height * 2 - 1));
    }
  }
  function pointerUp(e) {
    const p = pointers.get(e.pointerId); pointers.delete(e.pointerId);
    if (p && !p.multi && p.max < 7 && Math.hypot(e.clientX - p.x, e.clientY - p.y) < 7 && performance.now() - p.start < 650) clickAt(e);
  }
  function pointerCancel(e) { pointers.delete(e.pointerId); }
  function preferenceChange(e) {
    reducedMotion = e.matches;
    if (reducedMotion) {
      pauseBeforePreference = motionEngine.paused; mathPlayingBeforePreference = mathPlaying;
      motionEngine.setPaused(true); cancelFlight(); explicitMathMotion = false; explicitAmbientMotion = false; mathTime = DURATION; mathPlaying = false;
    } else {
      motionEngine.setPaused(pauseBeforePreference);
      mathPlaying = route.mode === 'concept' && mathPlayingBeforePreference;
    }
    emit();
  }
  if (reducedMotion) motionEngine.setPaused(true);
  // Cancel a flight before OrbitControls' bubble listener sees this first
  // gesture; otherwise its disabled guard would discard the initial drag.
  canvas.addEventListener('pointerdown', pointerDown, { passive: true, capture: true });
  canvas.addEventListener('pointermove', pointerMove, { passive: true });
  canvas.addEventListener('pointerup', pointerUp, { passive: true });
  canvas.addEventListener('pointercancel', pointerCancel, { passive: true });
  canvas.addEventListener('lostpointercapture', pointerCancel, { passive: true });
  canvas.addEventListener('wheel', cancelFlight, { passive: true, capture: true });
  controls.addEventListener('start', cancelFlight);
  media.addEventListener('change', preferenceChange);

  return {
    focusOnCelestial, selectConcept, back, resetFocus, replayConcept, toggleConceptPlayback, seekConcept,
    getState: state,
    getProjected: () => projected.map(p => ({ ...p })),
    setUiVisible(value) { uiVisible = !!value; },
    toggleMotion() {
      const paused = !motionEngine.paused;
      // A new global pause also overrides a previously explicit replay. Explicit
      // replay can still be requested afterwards while the universe is paused.
      if (paused) explicitMathMotion = false;
      else {
        explicitAmbientMotion = true;
        if (reducedMotion && route.mode === 'concept' && mathPlayingBeforePreference && !explicitMathMotion) mathPlaying = true;
      }
      motionEngine.setPaused(paused); emit(); return !paused;
    },
    update,
    resize() {
      portrait = window.innerWidth < 768;
      if (route.mode !== 'universe') { galaxyPose = null; emit(); beginFlight(null, false); }
    },
    triggerLabEntranceFlight(done) {
      if (warpCallback) return;
      warpCallback = done || (() => {});
      const direction = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(70);
      const to = { position: camera.position.clone().add(direction), target: controls.target.clone().add(direction) };
      beginFlight(to, !reducedMotion, () => { const callback = warpCallback; warpCallback = null; callback?.(); });
    },
    debug() {
      return {
        ...state(), ambientTime, projected: projected.map(p => ({ ...p })),
        camera: { position: camera.position.toArray(), target: controls.target.toArray() },
        families: [...families.values()].map(f => ({
          id: f.id, open: f.open, detailedObjects: f.nodes.filter(n => n.object).length, anchor: f.host.anchor.position.toArray(),
          concepts: f.nodes.map(n => {
            let bufferSignature = 0;
            n.object?.group.traverse(o => {
              if (o.instanceMatrix) o.instanceMatrix.array.forEach((value, index) => { bufferSignature += value * (index + 1); });
            });
            return { id: n.def.id, time: n.time, visible: f.root.visible && n.slot.visible && !!n.object?.group.visible, bufferSignature, localQuaternion: n.object?.group.getObjectByName('concept-local')?.quaternion.toArray() };
          }),
        })),
      };
    },
    dispose() {
      if (disposed) return; disposed = true; flight = null; pointers.clear();
      canvas.removeEventListener('pointerdown', pointerDown, true); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerCancel); canvas.removeEventListener('lostpointercapture', pointerCancel); canvas.removeEventListener('wheel', cancelFlight, true);
      controls.removeEventListener('start', cancelFlight); media.removeEventListener('change', preferenceChange);
      for (const f of families.values()) { unloadFamily(f); scene.remove(f.root); }
      families.clear();
    },
  };
}
