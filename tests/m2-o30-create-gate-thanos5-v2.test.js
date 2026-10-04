const { spawnSync } = require('child_process');
const exam="archive/exams/original/middle/m2/1final/23_향림중_1학기_기말_중2_기출.js";
const ev="archive/data/r2e-intake/m2/23_향림중_1학기_기말_중2_기출.create.physical-evidence.json";
for (const args of [
  ['archive/tools/solution-calibration-gate.mjs','--exam',exam,'--evidence',ev,'--stage','CREATE','--preflight'],
  ['archive/tools/review-evidence-gate.mjs','--exam',exam,'--evidence',ev,'--stage','CREATE']
]) {
  const x=spawnSync(process.execPath,args,{stdio:'inherit'});
  if(x.status!==0) process.exit(x.status||1);
}
console.log('M2 o30 CREATE canonical gates PASS v2');
