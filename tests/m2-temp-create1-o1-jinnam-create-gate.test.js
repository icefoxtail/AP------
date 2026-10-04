const { spawnSync } = require('child_process');
const exam="archive/exams/original/middle/m2/1mid/25_진남중_1학기_중간_중2_기출.js";
const ev="archive/data/r2e-intake/m2/25_진남중_1학기_중간_중2_기출.review1.physical-evidence.json";
for (const args of [
  ['archive/tools/solution-calibration-gate.mjs','--exam',exam,'--evidence',ev,'--stage','R1','--preflight'],
  ['archive/tools/review-evidence-gate.mjs','--exam',exam,'--evidence',ev,'--stage','R1']
]) {
  const r=spawnSync(process.execPath,args,{stdio:'inherit'});
  if(r.status!==0) process.exit(r.status||1);
}
console.log('M2 o1 R1 canonical gates PASS');
