import fs from 'node:fs';
import vm from 'node:vm';
import { gitBlobSha } from '../../../../../archive/tools/archive-stage-validator.mjs';
import { solutionSha256 } from '../../../../../archive/tools/archive-stage-validator-artifact-v2.mjs';
const w='.tmp/archive/archive2-m2-codex-20261006-03/20_금당중_2학기_기말_중2_기출';
const f=w+'/20_금당중_2학기_기말_중2_기출.js';
const ep=w+'/evidence/CREATE.evidence.json';
const box={window:{}};vm.createContext(box);vm.runInContext(fs.readFileSync(f,'utf8'),box,{timeout:5000});
for(const q of box.window.questionBank){q.solution=q.solution.replaceAll('\\timesimes','\\times').replaceAll('\\binominom','\\binom');}
fs.writeFileSync(f,'window.examTitle = '+JSON.stringify(box.window.examTitle)+';\n\nwindow.questionBank = '+JSON.stringify(box.window.questionBank,null,2)+';\n','utf8');
const final=fs.readFileSync(f),ev=JSON.parse(fs.readFileSync(ep,'utf8'));ev.artifactSha=gitBlobSha(final);
for(const row of ev.rows){const q=box.window.questionBank.find(x=>x.id===row.qid);row.solutionSha256=solutionSha256(q.solution);}
if(!ev.failedAttempts.some(x=>x.path===w+'/evidence/CREATE.solution-serialization.attempt1.json'))ev.failedAttempts.push({path:w+'/evidence/CREATE.solution-serialization.attempt1.json',disposition:'FAILED_ATTEMPT',reason:'Initial JavaScript template-string serialization dropped TeX backslashes in some commands and introduced tab/backspace controls. Targeted token repair restored final runtime TeX before validator and rebound solution and artifact SHAs.'});
fs.writeFileSync(ep,JSON.stringify(ev,null,2)+'\n','utf8');
console.log(JSON.stringify({artifactSha:ev.artifactSha},null,2));
