// Lightweight AP Math cosmic backdrop.
 // Adapted from archive/prototypes/ap-galaxy/src/orbital-world.js:
 // existing star sprites, procedural nebula and spiral galaxy point geometry.
 // This module is VISUAL ONLY: no school/exam routing or raycast targets.
import * as THREE from './vendor/three.module.js';

function randomFrom(seed) {
  let value = (seed >>> 0) || 1;
  return () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function makeGalaxyNebulaTexture(visualProfile) {
  const canvas = document.createElement('canvas');
  canvas.width = visualProfile.nebulaWidth;
  canvas.height = visualProfile.nebulaHeight;
  const context = canvas.getContext('2d');
  const image = context.createImageData(canvas.width, canvas.height);
  const lattice = (x, y, seed) => {
    let value = Math.imul(x + seed, 374761393) + Math.imul(y - seed, 668265263);
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
  };
  const noise = (x, y, seed) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = x - x0;
    const ty = y - y0;
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const top = THREE.MathUtils.lerp(lattice(x0, y0, seed), lattice(x0 + 1, y0, seed), sx);
    const bottom = THREE.MathUtils.lerp(lattice(x0, y0 + 1, seed), lattice(x0 + 1, y0 + 1, seed), sx);
    return THREE.MathUtils.lerp(top, bottom, sy);
  };
  for (let y = 0; y < canvas.height; y += 1) {
    const py = ((y + .5) / canvas.height - .5) * 2;
    for (let x = 0; x < canvas.width; x += 1) {
      const px = ((x + .5) / canvas.width - .5) * 2;
      const broad = noise(px * 2.8 + 17.4, py * 2.8 - 3.9, 0x12);
      const medium = noise(px * 6.5, py * 6.5, 0x2b);
      const fine = noise(px * 14, py * 14, 0x51);
      const turbulence = broad * .5 + medium * .34 + fine * .16;
      const radius = Math.sqrt(px * px + py * py * 1.45);
      const warpedRadius = Math.max(0, radius + (turbulence - .5) * .32);
      const envelope = Math.exp(-warpedRadius * warpedRadius * 2.15);
      const angle = Math.atan2(py, px);
      const arm = .74 + .26 * (.5 + .5 * Math.sin(angle * 2 - radius * 6.4 + (broad - .5) * 2.4));
      const alpha = Math.min(.46, envelope * (.28 + turbulence * 1.15) * arm * .58);
      const edge = THREE.MathUtils.clamp(radius * .72, 0, 1);
      const offset = (y * canvas.width + x) * 4;
      image.data[offset] = Math.round(255 - edge * 89);
      image.data[offset + 1] = Math.round(242 - edge * 51);
      image.data[offset + 2] = Math.round(226 + edge * 29);
      image.data[offset + 3] = Math.round(alpha * 255);
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStarSpriteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(.045, 'rgba(255,252,239,.96)');
  gradient.addColorStop(.14, 'rgba(255,245,226,.72)');
  gradient.addColorStop(.34, 'rgba(213,228,255,.28)');
  gradient.addColorStop(.68, 'rgba(180,202,255,.08)');
  gradient.addColorStop(1, 'rgba(180,202,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createArchiveBackdrop({ scene, profile, isMobile }) {
  const starTexture = makeStarSpriteTexture();
  const nebulaTexture = makeGalaxyNebulaTexture(profile);
  const ownedObjects = [];
  const galaxyGroups = [];
  const palette = [
    new THREE.Color(0xf5f0e9), // ivory
    new THREE.Color(0xd8b77e), // champagne gold
    new THREE.Color(0x55cba3), // emerald
    new THREE.Color(0xa78ac8), // amethyst
    new THREE.Color(0xbdb8c2), // silver
  ];

  // Archive-style depth fields: use soft circular star sprites, never square
  // WebGL point primitives. The distant shells leave the math objects clear.
  function createDepthStars(count, lowRadius, highRadius, size, opacity, seed) {
    const random = randomFrom(seed);
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = lowRadius + (highRadius - lowRadius) * Math.pow(random(), 0.7);
      const theta = random() * Math.PI * 2;
      const z = random() * 2 - 1;
      const horizontal = Math.sqrt(Math.max(0, 1 - z * z));
      positions[i * 3] = Math.cos(theta) * horizontal * radius;
      positions[i * 3 + 1] = z * radius * 0.7;
      positions[i * 3 + 2] = Math.sin(theta) * horizontal * radius;
      const tint = palette[Math.floor(random() * palette.length)];
      tint.toArray(colors, i * 3);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      map: starTexture,
      size, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity, alphaTest: 0.012,
      depthWrite: false, blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    ownedObjects.push(points);
    return points;
  }

  const farStars = createDepthStars(
    profile.backgroundFarStars, 96, 223, isMobile ? 0.52 : 0.70,
    0.46, 0x5eed2026
  );
  const nearStars = createDepthStars(
    profile.backgroundNearStars, 78, 160, isMobile ? 0.62 : 0.84,
    0.56, 0x1a5eed
  );

  // Adapted from Archive's makeGalaxyDisc: a few restrained far-off spiral
  // galaxies and gas clouds, not more clickable objects or new laboratories.
  function addDistantGalaxy(spec, index) {
    const random = randomFrom(spec.seed);
    const count = isMobile ? 250 : profile.tier === 'balanced' ? 400 : 620;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tint = new THREE.Color(spec.tint);
    const ivory = new THREE.Color(0xf5f0e9);
    for (let i = 0; i < count; i++) {
      const arm = i % spec.arms;
      const spread = Math.sqrt(random());
      const core = i % 6 === 0;
      const radius = core ? Math.sqrt(random()) * 0.55 : 0.16 + spread * 1.8;
      const angle = arm * Math.PI * 2 / spec.arms +
        radius * spec.pitch + (random() - 0.5) * (0.16 + radius * 0.12);
      const ellipticRadius = radius * (0.68 + spread * 0.32);
      positions[i * 3] = Math.cos(angle) * ellipticRadius;
      positions[i * 3 + 1] = (random() - 0.5) * (0.08 + radius * 0.12);
      positions[i * 3 + 2] = Math.sin(angle) * ellipticRadius * spec.flattening;
      const colour = tint.clone().lerp(ivory, 0.2 + (1 - spread) * 0.4);
      colour.toArray(colors, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(geo, new THREE.PointsMaterial({
      map: starTexture, size: isMobile ? 0.07 : 0.09,
      sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: 0.80, alphaTest: 0.015,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    // A nebula billboard and luminous nucleus use the Archive's actual gas
    // texture instead of a stack of hard-edged rectangle meshes.
    const haze = new THREE.Sprite(new THREE.SpriteMaterial({
      map: nebulaTexture, color: spec.tint, transparent: true,
      opacity: 0.28, blending: THREE.AdditiveBlending,
      depthWrite: false, toneMapped: false,
    }));
    haze.scale.set(5.6, 3.1, 1);
    const nucleus = new THREE.Sprite(new THREE.SpriteMaterial({
      map: starTexture, color: 0xead8b6, transparent: true,
      opacity: 0.5, blending: THREE.AdditiveBlending,
      depthWrite: false, toneMapped: false,
    }));
    nucleus.scale.set(0.9, 0.9, 1);

    const group = new THREE.Group();
    group.position.set(...spec.position);
    group.rotation.set(spec.tilt, spec.yaw, spec.roll);
    group.scale.setScalar(spec.size);
    group.add(haze, stars, nucleus);
    scene.add(group);
    ownedObjects.push(stars, haze, nucleus);
    galaxyGroups.push({ group, baseRoll: spec.roll, speed: spec.speed });
  }

  const distantGalaxies = [
    { seed: 821, position: [-66, 24, -155], size: 12, arms: 3, pitch: 2.5, flattening: 0.8, tint: 0xa78ac8, tilt: -1.12, yaw: 0.18, roll: -0.16, speed: 0.004 },
    { seed: 412, position: [78, -30, -195], size: 10, arms: 2, pitch: 2.9, flattening: 0.67, tint: 0x55cba3, tilt: -1.24, yaw: -0.30, roll: 0.22, speed: -0.003 },
    { seed: 157, position: [6, 59, -210], size: 8, arms: 4, pitch: 2.3, flattening: 0.9, tint: 0xd8b77e, tilt: -0.90, yaw: 0.11, roll: 0.05, speed: 0.002 },
  ];
  distantGalaxies.slice(0, isMobile ? 2 : 3).forEach(addDistantGalaxy);

  return {
    update(time) {
      farStars.rotation.y = time * 0.005;
      nearStars.rotation.y = time * 0.009;
      galaxyGroups.forEach(({ group, baseRoll, speed }) => {
        group.rotation.z = baseRoll + time * speed;
      });
    },
    dispose() {
      for (const object of ownedObjects) {
        object.parent?.remove(object);
        object.geometry?.dispose();
        object.material?.dispose();
      }
      for (const { group } of galaxyGroups) group.parent?.remove(group);
      starTexture.dispose();
      nebulaTexture.dispose();
    },
  };
}
