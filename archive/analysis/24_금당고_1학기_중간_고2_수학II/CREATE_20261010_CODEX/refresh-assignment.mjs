import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {gitBlobSha} from '../../../tools/archive-stage-validator.mjs';
const root=process.argv.at(-1),e=path.join(root,'archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX'),p=path.join(e,'CREATE.assignment.json'),j=JSON.parse(fs.readFileSync(p,'utf8'));
const rel='archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js',bytes=fs.readFileSync(path.join(root,rel)),raw=crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase(),blob=gitBlobSha(bytes);
if(!fs.existsSync(path.join(e,'CREATE.assignment.initial.json')))fs.copyFileSync(p,path.join(e,'CREATE.assignment.initial.json'));
j.finalArtifactRawSha256=raw;j.finalValidatorRawBufferBlobSha1=blob;j.sourceParity.currentFinalRawSha256=raw;j.assignmentUpdatedAt=new Date().toISOString();j.state='FINAL_CANDIDATE_READY';
fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n','utf8');
console.log(JSON.stringify({path:p,sha256:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').toUpperCase(),rawSha256:raw,blobSha1:blob},null,2));
