// AP Math Playground Universe - Galaxy Motion & Drift Engine (v1.0)
// Implements 3 spatial layers (Deep / Constellation / Hero) with independent non-uniform orbits,
// subtle multi-axis rotations, and camera parallax.

import * as THREE from './vendor/three.module.js';

// Throttling and elapsed simulation time must have separate timestamps. Using
// the throttle remainder twice makes an eight-second explanation run too fast.
export function createFrameClock(maxFps, now = 0) {
  const interval = 1000 / maxFps;
  let throttleTime = now, simulationTime = now;
  return {
    sample(timestamp) {
      const elapsed = timestamp - throttleTime;
      if (elapsed + 1e-7 < interval) return null;
      throttleTime += Math.floor((elapsed + 1e-7) / interval) * interval;
      const delta = Math.min(Math.max(0, timestamp - simulationTime) / 1000, 0.1);
      simulationTime = timestamp;
      return delta;
    },
    reset(timestamp) { throttleTime = timestamp; simulationTime = timestamp; },
  };
}

export class MathGalaxyMotionEngine {
  constructor({ scene, camera, isMobile = false } = {}) {
    this.scene = scene;
    this.camera = camera;
    this.isMobile = isMobile;
    this.nodes = [];
    this.paused = false;
    this.speedMultiplier = 1.0;

    // Pointer parallax target
    this.pointerNormalized = { x: 0, y: 0 };
    this.parallaxOffset = new THREE.Vector3();
  }

  registerCelestialNode({ id, group, rotationGroup = group, updater, basePosition, orbitRadius = 0, orbitSpeed = 0, orbitPlane = 'xz', selfRotationSpeed }) {
    const bPos = (basePosition && typeof basePosition.clone === 'function')
      ? basePosition.clone()
      : new THREE.Vector3(basePosition?.x || 0, basePosition?.y || 0, basePosition?.z || 0);
    const rotSpeed = (selfRotationSpeed && typeof selfRotationSpeed.clone === 'function')
      ? selfRotationSpeed.clone()
      : new THREE.Vector3(selfRotationSpeed?.x || 0, selfRotationSpeed?.y || 0, selfRotationSpeed?.z || 0);

    const node = {
      id,
      group,
      rotationGroup,
      updater,
      basePosition: bPos,
      currentPosition: bPos.clone(),
      orbitRadius,
      orbitSpeed,
      orbitPlane,
      orbitPhase: Math.random() * Math.PI * 2,
      selfRotationSpeed: rotSpeed,
      hoverIntensity: 0,
    };
    node.group.position.copy(bPos);
    this.nodes.push(node);
    return node;
  }

  setPointer(nx, ny) {
    this.pointerNormalized.x = nx;
    this.pointerNormalized.y = ny;
  }

  setPaused(paused) {
    this.paused = !!paused;
  }

  update(time, delta) {
    if (this.paused) return;
    const effectiveDelta = delta * this.speedMultiplier;

    // Smooth camera-pointer parallax
    const targetParallaxX = this.pointerNormalized.x * (this.isMobile ? 1.2 : 2.8);
    const targetParallaxY = -this.pointerNormalized.y * (this.isMobile ? 0.8 : 1.8);
    this.parallaxOffset.x += (targetParallaxX - this.parallaxOffset.x) * 0.05;
    this.parallaxOffset.y += (targetParallaxY - this.parallaxOffset.y) * 0.05;

    for (const node of this.nodes) {
      // 1. Orbital revolution (gentle 3D drifting)
      if (node.orbitRadius > 0 && node.orbitSpeed !== 0) {
        const angle = node.orbitPhase + time * node.orbitSpeed;
        if (node.orbitPlane === 'xz') {
          node.currentPosition.x = node.basePosition.x + Math.cos(angle) * node.orbitRadius;
          node.currentPosition.z = node.basePosition.z + Math.sin(angle) * node.orbitRadius;
          node.currentPosition.y = node.basePosition.y + Math.sin(angle * 2.0) * (node.orbitRadius * 0.22);
        } else if (node.orbitPlane === 'xy') {
          node.currentPosition.x = node.basePosition.x + Math.cos(angle) * node.orbitRadius;
          node.currentPosition.y = node.basePosition.y + Math.sin(angle) * node.orbitRadius;
          node.currentPosition.z = node.basePosition.z + Math.cos(angle * 1.5) * (node.orbitRadius * 0.2);
        }
      }

      // 2. Parallax influence (depth-dependent)
      const depthFactor = THREE.MathUtils.clamp((node.currentPosition.z + 80) / 120, 0.3, 1.4);
      node.group.position.x = node.currentPosition.x + this.parallaxOffset.x * depthFactor;
      node.group.position.y = node.currentPosition.y + this.parallaxOffset.y * depthFactor;
      node.group.position.z = node.currentPosition.z;

      // 3. Self-rotation on distinct axes
      node.rotationGroup.rotation.x += node.selfRotationSpeed.x * effectiveDelta;
      node.rotationGroup.rotation.y += node.selfRotationSpeed.y * effectiveDelta;
      node.rotationGroup.rotation.z += node.selfRotationSpeed.z * effectiveDelta;

      // 4. Internal mathematical geometry/tracer updates
      if (typeof node.updater === 'function') {
        node.updater(time, effectiveDelta);
      }
    }
  }

  dispose() {
    this.nodes = [];
  }
}
