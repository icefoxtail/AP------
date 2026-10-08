import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';const ev=path.join(root,'archive/analysis/archive-2026-1mid-nine-20261008/26_동산중_1학기_중간_중2_기출/registration-root-apply/checks');fs.mkdirSync(ev,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const jobs=[
 {name:'catalog-check-01',command:process.execPath,args:['archive/tools/build-archive2-catalog.mjs','--check']},
 {name:'registration-parity-01',command:process.execPath,args:['archive/tools/verify-archive-registration.mjs']},
 {name:'identity-runtime-tests-01',command:process.execPath,args:['--test','tests/archive-question-identity-runtime.test.mjs','tests/archive-question-identity-contract.test.mjs','tests/archive-question-identity-collision-regression.test.mjs']},
];
const reports=[];for(const job of jobs){const result=spawnSync(job.command,job.args,{cwd:root,encoding:null,maxBuffer:128*1024*1024});if(result.error)throw result.error;const out=result.stdout||Buffer.alloc(0),err=result.stderr||Buffer.alloc(0);const stdoutPath=path.join(ev,job.name+'.stdout.bin'),stderrPath=path.join(ev,job.name+'.stderr.bin');fs.writeFileSync(stdoutPath,out);fs.writeFileSync(stderrPath,err);const report={schemaVersion:'ROOT_REGISTRATION_VALIDATOR_INVOCATION_V1',command:[job.command,...job.args],cwd:root,exitCode:result.status,signal:result.signal,stdoutPath,stdoutSha256:sha(out),stderrPath,stderrSha256:sha(err)};const reportPath=path.join(ev,job.name+'.result.json');fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');reports.push({name:job.name,...report,reportPath,reportSha256:sha(fs.readFileSync(reportPath))});}
console.log(JSON.stringify(reports,null,2));
