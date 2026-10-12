import fs from 'node:fs';import crypto from 'node:crypto';
const d='archive/analysis/24_매산여고_1학기_중간_고2_수학I/r1-clean-20261011/';const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const p=d+'r1-technical-attempts-v2.json',a=JSON.parse(fs.readFileSync(p,'utf8'));for(const x of a.attempts)if(x.attempt==='generic-r1-validator-final')x.reportSha256=sha(d+'r1-stage-validator.raw.v2.json');fs.writeFileSync(p,JSON.stringify(a,null,2)+'\n');
const cpath=d+'r1-nondifficulty-checkpoint.json',c=JSON.parse(fs.readFileSync(cpath,'utf8'));c.validation.technicalAttemptLogSha256=sha(p);fs.writeFileSync(cpath,JSON.stringify(c,null,2)+'\n');
