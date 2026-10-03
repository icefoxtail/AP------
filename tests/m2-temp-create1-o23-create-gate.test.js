const { spawnSync } = require('child_process');
const exam="archive/exams/original/middle/m2/1final/25_연향중_1학기_기말_중2_기출.js";
const ev="archive/data/r2e-intake/m2/25_연향중_1학기_기말_중2_기출.create.physical-evidence.json";
for (const args of [
  ['archive/tools/solution-calibration-gate.mjs','--exam',exam,'--evidence',ev,'--stage','CREATE','--preflight'],
  ['archive/tools/review-evidence-gate.mjs','--exam',exam,'--evidence',ev,'--stage','CREATE']
]) {
  const r=spawnSync(process.execPath,args,{stdio:'inherit'});
  if(r.status!==0) process.exit(r.status||1);
}
console.log('M2 o23 CREATE canonical gates PASS');
