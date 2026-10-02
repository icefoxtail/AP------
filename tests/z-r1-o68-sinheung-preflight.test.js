global.window = {};
require('../archive/exams/original/middle/m3/2final/22_신흥중_2학기_기말_중3_기출.js');
const evidence = require('../archive/data/r2e-intake/m3/22_신흥중_2학기_기말_중3_기출.review1.active-v2.calibration.json');
(async () => {
  const mod = await import('../archive/tools/solution-calibration-gate.mjs');
  const issues = mod.validateSolutionCalibrationPreflight({
    examFile: require('path').resolve('archive/exams/original/middle/m3/2final/22_신흥중_2학기_기말_중3_기출.js'),
    questions: global.window.questionBank,
    evidence,
    stage: 'R1'
  });
  console.log(JSON.stringify({ ok: issues.length === 0, issues }));
  if (issues.length) throw new Error('calibration');
})();