import fs from 'node:fs';
const p='archive/analysis/24_매산여고_1학기_중간_고2_수학I/r1-clean-20261011/r1-technical-attempts-v2.json';
const x=JSON.parse(fs.readFileSync(p,'utf8'));
if(!x.attempts.some(a=>a.attempt==='generic-r1-validator-invocation-unknown-output-flag'))x.attempts.push({attempt:'generic-r1-validator-invocation-unknown-output-flag',status:'FAILED_BEFORE_VALIDATION',reason:'First CLI invocation supplied unsupported --output; validator rejected argument before reading evidence or producing a report.',correction:'Use the supported --json mode with shell redirection to preserve the raw JSON report.'});
fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
