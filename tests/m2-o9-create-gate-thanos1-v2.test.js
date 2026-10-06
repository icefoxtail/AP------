const { spawnSync } = require('child_process');
const exam="archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js";
const ev="archive/data/r2e-intake/m2/21_팔마중_1학기_중간_중2_기출.create.physical-evidence.v2.json";
for (const args of [
  ['archive/tools/solution-calibration-gate.mjs','--exam',exam,'--evidence',ev,'--stage','CREATE','--preflight'],
  ['archive/tools/review-evidence-gate.mjs','--exam',exam,'--evidence',ev,'--stage','CREATE']
]) {
  const x=spawnSync(process.execPath,args,{stdio:'inherit'});
  if(x.status!==0) process.exit(x.status||1);
}
console.log('M2 o9 CREATE canonical gates PASS v2');
