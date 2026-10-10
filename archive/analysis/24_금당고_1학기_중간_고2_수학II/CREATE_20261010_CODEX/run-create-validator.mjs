import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=process.argv.at(-1),folder=path.join(root,'archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX');
const args=[path.join(root,'archive/tools/archive-stage-validator.mjs'),'--exam','archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js','--evidence','archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX/CREATE.evidence.json','--stage','CREATE','--quality-contract','JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006','--execution-line','CODEX','--asset-root','archive','--json'];
const run=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',windowsHide:true});
const report=path.join(folder,'CREATE.generic.report.raw.json');fs.writeFileSync(report,run.stdout||'','utf8');fs.writeFileSync(path.join(folder,'CREATE.generic.stderr.raw.txt'),run.stderr||'','utf8');fs.writeFileSync(path.join(folder,'CREATE.generic.exit.json'),JSON.stringify({command:[process.execPath,...args],exitCode:run.status,signal:run.signal||null,spawnError:run.error?String(run.error):null,reportPath:report,reportBytes:(run.stdout||'').length},null,2)+'\n','utf8');
console.log(JSON.stringify({exitCode:run.status,signal:run.signal||null,error:run.error?String(run.error):null,reportPath:report,stdout:(run.stdout||'').slice(0,2000),stderr:(run.stderr||'').slice(0,1000)},null,2));
if(run.status!==0)process.exit(run.status||1);
