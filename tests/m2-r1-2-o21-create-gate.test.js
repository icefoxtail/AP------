const { spawnSync } = require('child_process');
const exam='archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js';
const ev='archive-work/middle/m2/2026-1sem-recert/26_동산중_1학기_기말_중2_기출/create.physical-evidence.json';
for (const args of [['archive/tools/solution-calibration-gate.mjs','--exam',exam,'--evidence',ev,'--stage','CREATE','--preflight'],['archive/tools/review-evidence-gate.mjs','--exam',exam,'--evidence',ev,'--stage','CREATE']]) {
  const r=spawnSync(process.execPath,args,{stdio:'inherit'});
  if(r.status!==0) process.exit(r.status||1);
}
console.log('M2 o21 CREATE canonical gates PASS');
