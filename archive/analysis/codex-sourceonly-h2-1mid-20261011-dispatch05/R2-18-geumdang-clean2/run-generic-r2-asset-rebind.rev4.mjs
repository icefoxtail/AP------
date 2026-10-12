import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {sha256} from '../../../tools/archive-codex-artifact-io.mjs';

const args=[
  'archive/tools/archive-stage-validator.mjs',
  '--exam','archive/exams/original/high/h2/1mid/18_금당고_1학기_중간_고2_확률과통계.js',
  '--evidence','archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R2-18-geumdang-clean2/R2.evidence.asset-rebind.rev4.bound.json',
  '--stage','R2','--quality-contract','JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  '--execution-line','CODEX','--asset-root','archive','--json'
];
const result=spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:32*1024*1024});
const base='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R2-18-geumdang-clean2';
const rawPath=path.join(base,'R2.generic.raw.asset-rebind.rev4.json');
const errPath=path.join(base,'R2.generic.stderr.asset-rebind.rev4.txt');
const processPath=path.join(base,'R2.generic.process.asset-rebind.rev4.json');
fs.writeFileSync(rawPath,result.stdout||'');
fs.writeFileSync(errPath,result.stderr||'');
const report={exitCode:result.status,signal:result.signal,stdoutSha256:sha256(Buffer.from(result.stdout||'')),stderrSha256:sha256(Buffer.from(result.stderr||'')),stdoutPath:path.resolve(rawPath),stderrPath:path.resolve(errPath),argv:args.map((v,i)=>i===0?path.resolve(v):v)};
fs.writeFileSync(processPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,processPath:path.resolve(processPath)}));
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status||1);
