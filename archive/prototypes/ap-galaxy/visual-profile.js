// Shared, unminified visual budget: both the authored Three.js module and its
// prebuilt browser bundle consume this runtime contract rather than diverging constants.
(function attachAPGalaxyVisualProfile(root, factory) {
  const profile = factory();
  if (typeof module === 'object' && module.exports) module.exports = profile;
  if (root) root.APGalaxyVisualProfile = profile;
})(typeof window !== 'undefined' ? window : globalThis, function createVisualProfile() {
  'use strict';

  function select(width, hardwareConcurrency, deviceMemory) {
    const mobile = Number(width) < 760;
    const cores = Number(hardwareConcurrency);
    const memoryGiB = Number(deviceMemory);
    const balanced = !mobile && (
      (Number.isFinite(cores) && cores > 0 && cores <= 4) ||
      (Number.isFinite(memoryGiB) && memoryGiB > 0 && memoryGiB <= 4)
    );
    const tier = mobile ? 'mobile' : balanced ? 'balanced' : 'cinematic';
    return Object.freeze({
      tier,
      backgroundFarStars: mobile ? 2200 : balanced ? 4500 : 9000,
      backgroundNearStars: mobile ? 420 : balanced ? 800 : 1500,
      backgroundStars: mobile ? 420 : balanced ? 720 : 960,
      galaxyParticles: mobile ? 560 : balanced ? 720 : 1080,
      nebulaWidth: mobile ? 256 : balanced ? 384 : 512,
      nebulaHeight: mobile ? 160 : balanced ? 240 : 320,
      nebulaSkyOpacity: 0.32,
      dataStarOpacity: 0.71,
      galaxyPointSize: 0.35,
    });
  }
  return Object.freeze({ select });
});
