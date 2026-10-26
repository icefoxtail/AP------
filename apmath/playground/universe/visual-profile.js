// AP Math Playground Universe - Visual Profile & Hardware Budget Manager
// Adapted from AP Galaxy visual profiling contract with Math Universe tuning.

export function getVisualProfile(width = window.innerWidth, concurrency = navigator.hardwareConcurrency, memory = navigator.deviceMemory) {
  const mobile = Number(width) < 768;
  const tablet = Number(width) >= 768 && Number(width) < 1100;
  const cores = Number(concurrency);
  const memoryGiB = Number(memory);

  const balanced = !mobile && (
    (Number.isFinite(cores) && cores > 0 && cores <= 4) ||
    (Number.isFinite(memoryGiB) && memoryGiB > 0 && memoryGiB <= 4)
  );

  const tier = mobile ? 'mobile' : (tablet || balanced) ? 'balanced' : 'cinematic';

  return Object.freeze({
    tier,
    isMobile: mobile,
    isTablet: tablet,
    maxFps: mobile ? 24 : 30,
    backgroundFarStars: mobile ? 2400 : (tablet ? 4800 : 9200),
    backgroundNearStars: mobile ? 450 : (tablet ? 900 : 1600),
    mathParticles: mobile ? 480 : (tablet ? 960 : 1600),
    nebulaWidth: mobile ? 256 : (tablet ? 384 : 512),
    nebulaHeight: mobile ? 160 : (tablet ? 240 : 320),
    nebulaOpacity: mobile ? 0.22 : 0.32,
    enableShadows: !mobile && tier === 'cinematic',
    enableTransmission: !mobile, // MeshPhysicalMaterial glass/crystal transmission
    bloomIntensity: mobile ? 0.6 : 1.0,
    pointSizeScale: mobile ? 0.8 : 1.0,
    starfieldDepth: 180,
  });
}

if (typeof window !== 'undefined') {
  window.APMathVisualProfile = { getVisualProfile };
}
