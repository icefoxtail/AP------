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
  let portrait = window.innerWidth < 768, uiVisible = true, disposed = false;
  let projected = [], lastAnchor = null;
  let pauseBeforePreference = false;
  const delta = new THREE.Vector3(), zero = new THREE.Vector3();
  const pointerNdc = new THREE.Vector2();
  const forward = new THREE.Vector3(0, 0, 1);
  const pickMeshes = [];
  for (const c of celestialRegistry) c.group.traverse(o => {
    if (o.isMesh || o.isLine) { o.userData.celestialId = c.metadata.id; pickMeshes.push(o); }
  });

  // Tiny physical companions are present in the existing universe. The detailed
  // mathematical objects are created only when their family is explored.
  for (const [id, definition] of Object.entries(CONCEPT_GALAXIES)) {
    const host = celestialRegistry.find(c => c.metadata.id === id);
    const root = new THREE.Group(); root.name = `concept-galaxy-${id}`;
    scene.add(root);
    const ringGeometry = new THREE.TorusGeometry(0.52, 0.055, 6, 32);
    const crystalGeometry = new THREE.IcosahedronGeometry(0.72, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0x55cba3, metalness: 0.38, roughness: 0.24, emissive: 0x153c30, emissiveIntensity: 0.55 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xd8b77e, metalness: 0.45, roughness: 0.24, emissive: 0x352719, emissiveIntensity: 0.4 });
    const nodes = definition.concepts.map((def, i) => {
      const slot = new THREE.Group(); slot.name = def.id;
      const marker = new THREE.Mesh(id === 'polyhedra' ? crystalGeometry : ringGeometry, i % 2 ? gold : material);
      marker.userData.conceptId = def.id; marker.userData.celestialId = id;
      slot.add(marker); root.add(slot); slot.position.fromArray(def.compact);
      return { def, slot, marker, object: null, orientation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.16 * Math.sin(i + 1), 0.25 * Math.cos(i), 0.08 * (i - 2))), world: new THREE.Vector3() };
    });
    families.set(id, { id, definition, host, root, nodes, open: 0, basis: new THREE.Quaternion(), ringGeometry, crystalGeometry, material, gold });
  }

  function snapshot(anchor = null) {
    const origin = anchor || new THREE.Vector3();
    return { position: camera.position.clone().sub(origin), target: controls.target.clone().sub(origin), relative: !!anchor };
  }
  function activeFamily() { return families.get(route.celestialId); }
  function hostOf(id) { return celestialRegistry.find(c => c.metadata.id === id); }
  function anchorOf(id) { return hostOf(id)?.anchor.position || zero; }
  function localToWorld(local, family) { return vec(local).applyQuaternion(family.basis).add(family.host.anchor.position); }
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
      mathPlaying, mathTime, mathDuration: DURATION,
    };
  }
  function emit(history = 'none') { onStateChange?.(state(), { history }); }

  function loadFamily(family) {
    for (const node of family.nodes) if (!node.object) {
      node.object = createConceptObject({ id: node.def.id, isMobile: portrait });
      node.object.group.name = `math-concept-${node.def.id}`;
      node.object.group.traverse(o => { o.userData.conceptId = node.def.id; o.userData.celestialId = family.id; });
      node.object.group.scale.setScalar(node.def.radius / node.object.radius);
      node.slot.add(node.object.group);
      node.object.update(DURATION, { detail: false, reducedMotion });
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
    for (const other of family.nodes) if (other !== node) other.object?.update(DURATION, { detail: false, reducedMotion });
    explicitMathMotion = false;
    mathTime = reducedMotion ? DURATION : 0; mathPlaying = !reducedMotion;
    loadFamily(family); setLimits();
    node.object.update(mathTime, { detail: true, reducedMotion });
    emit(history); beginFlight(null, animate);
    return true;
  }
  function back() {
    if (route.mode === 'concept') {
      const family = activeFamily();
      route = { mode: 'galaxy', celestialId: family.id, conceptId: null };
      mathPlaying = false; setLimits();
      family.nodes.forEach(n => n.object?.update(DURATION, { detail: false, reducedMotion }));
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
  function replayConcept() { if (route.mode !== 'concept') return; explicitMathMotion = true; mathTime = 0; mathPlaying = true; emit(); }
  function toggleConceptPlayback() {
    if (route.mode !== 'concept') return false;
    if (mathTime >= DURATION) mathTime = 0;
    explicitMathMotion = true;
    mathPlaying = !mathPlaying; emit(); return mathPlaying;
  }
  function seekConcept(seconds) { if (route.mode !== 'concept') return; explicitMathMotion = true; mathTime = clamp(Number(seconds) || 0, 0, DURATION); mathPlaying = false; emit(); }

  function visibleBody(id) {
    if (!id || route.mode === 'universe') return true;
    // Keep the sky; unrelated mathematics must not sit between camera and the
    // selected relationship. Original visibility is restored on return.
    return id === route.celestialId;
  }
  function update(dt, time) {
    if (disposed) return;
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
      family.open = clamp(family.open + (active ? dt / 0.95 : -dt / 0.7), 0, 1);
      const opening = reducedMotion ? (active ? 1 : 0) : smooth(family.open);
      family.root.position.copy(family.host.anchor.position);
      family.root.quaternion.copy(family.basis);
      family.root.visible = route.mode === 'universe' || active;
      const layout = galaxyLayout(family.id, portrait);
      const hostOffset = vec(layout.host).multiplyScalar(opening).applyQuaternion(family.basis);
      family.host.group.position.copy(hostOffset);
      if (active) family.host.group.quaternion.slerp(family.basis, reducedMotion ? 1 : 1 - Math.exp(-dt * 4));
      for (let i = 0; i < family.nodes.length; i++) {
        const node = family.nodes[i], selected = active && route.conceptId === node.def.id;
        node.slot.position.fromArray(node.def.compact).lerp(vec(layout.bodies[i].position), opening);
        if (!active && !motionEngine.paused && !reducedMotion) {
          node.slot.position.z += Math.sin(time * 0.16 + i * 1.7) * 0.45;
          node.slot.rotation.set(0.18 * Math.sin(time * 0.1 + i), 0.25 * Math.cos(time * 0.08 + i), time * 0.025 + i * 0.2);
        } else node.slot.quaternion.slerp(selected ? new THREE.Quaternion() : node.orientation, reducedMotion ? 1 : 1 - Math.exp(-dt * 5));
        node.marker.visible = !node.object || opening < 0.12;
        if (node.object) {
          node.object.group.visible = opening >= 0.12;
          const scale = node.def.radius / node.object.radius * (0.32 + opening * 0.68);
          node.object.group.scale.setScalar(scale);
          // Non-selected previews are complete, static, and need no frame updater.
          if (selected) node.object.update(mathTime, { detail: true, reducedMotion: reducedMotion && !explicitMathMotion });
        }
      }
      if (!active && family.open === 0) unloadFamily(family);
    }
    if (mathPlaying && route.mode === 'concept' && !flight) {
      mathTime = Math.min(DURATION, mathTime + dt);
      if (mathTime === DURATION) { mathPlaying = false; emit(); }
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
        const x = (p.x + 1) * width / 2, y = (1 - p.y) * height / 2 + pixels + 22;
        projected.push({ id: node.def.id, label: node.def.label, x, y, depth: p.z, visible: uiVisible && p.z > -1 && p.z < 1 && x > pad.left && x < width - pad.right && y > pad.top && y < height - pad.bottom + 10, isSelected: false });
      }
    }
    onFrame?.({ labels: projected, mathTime, mathPlaying, mathDuration: DURATION });
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
      for (const f of families.values()) for (const n of f.nodes) if (n.marker.visible) all.push(n.marker);
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
    if (reducedMotion) { pauseBeforePreference = motionEngine.paused; motionEngine.setPaused(true); cancelFlight(); explicitMathMotion = false; mathTime = DURATION; mathPlaying = false; }
    else motionEngine.setPaused(pauseBeforePreference);
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
    toggleMotion() { motionEngine.setPaused(!motionEngine.paused); emit(); return !motionEngine.paused; },
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
      return { ...state(), projected: projected.map(p => ({ ...p })), camera: { position: camera.position.toArray(), target: controls.target.toArray() }, families: [...families.values()].map(f => ({ id: f.id, open: f.open, detailedObjects: f.nodes.filter(n => n.object).length, anchor: f.host.anchor.position.toArray() })) };
    },
    dispose() {
      if (disposed) return; disposed = true; flight = null; pointers.clear();
      canvas.removeEventListener('pointerdown', pointerDown, true); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerCancel); canvas.removeEventListener('lostpointercapture', pointerCancel); canvas.removeEventListener('wheel', cancelFlight, true);
      controls.removeEventListener('start', cancelFlight); media.removeEventListener('change', preferenceChange);
      for (const f of families.values()) { unloadFamily(f); f.ringGeometry.dispose(); f.crystalGeometry.dispose(); f.material.dispose(); f.gold.dispose(); scene.remove(f.root); }
      families.clear();
    },
  };
}
