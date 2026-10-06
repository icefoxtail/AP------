import fs from 'node:fs';
import vm from 'node:vm';
import { gitBlobSha } from '../../../../../archive/tools/archive-stage-validator.mjs';
import { solutionSha256 } from '../../../../../archive/tools/archive-stage-validator-artifact-v2.mjs';
const w='.tmp/archive/archive2-m2-codex-20261006-03/20_금당중_2학기_기말_중2_기출';
const f=`${w}/20_금당중_2학기_기말_중2_기출.js`;
const ep=`${w}/evidence/CREATE.evidence.json`;
const box={window:{}};vm.createContext(box);vm.runInContext(fs.readFileSync(f,'utf8'),box,{timeout:5000});
const commands=['dfrac','frac','triangle','angle','text','times','cdot','sqrt','parallel','sim','ne','leftrightarrow','perp','binom','circ','ge','le','left','right'];
for(const q of box.window.questionBank){
 let s=q.solution;
 s=s.replace(/\t(?=imes)/g,'\\times').replace(/\x08(?=inom)/g,'\\binom').replace(/\f(?=rac)/g,'\\frac');
 for(const c of commands){const re=new RegExp(`(?<!\\\\)\\b${c}\\b`,'g');s=s.replace(re,`\\\\${c}`);}
 s=s.replace(/\$([^$]*)\$/g,(_,m)=>`$${m.replace(/(?<!\\)dfrac/g,'\\dfrac').replace(/(?<!\\)cdot/g,'\\cdot').replace(/(?<!\\)ge(?=\s|[0-9])/g,'\\ge')}$`);
 q.solution=s;
}
fs.writeFileSync(f,`window.examTitle = ${JSON.stringify(box.window.examTitle)};\n\nwindow.questionBank = ${JSON.stringify(box.window.questionBank,null,2)};\n`,'utf8');
const final=fs.readFileSync(f), ev=JSON.parse(fs.readFileSync(ep,'utf8'));
ev.artifactSha=gitBlobSha(final);
for(const row of ev.rows){const q=box.window.questionBank.find(q=>q.id===row.qid);row.solutionSha256=solutionSha256(q.solution);}
if(!ev.failedAttempts.some(x=>x.path===${w}/evidence/CREATE.solution-serialization.attempt1.json))ev.failedAttempts.push({path:`${w}/evidence/CREATE.solution-serialization.attempt1.json`,disposition:'FAILED_ATTEMPT',reason:'Initial JavaScript template-string serialization dropped TeX backslashes in some commands and introduced tab/backspace controls. Restored only affected TeX command tokens in the final runtime solution values, then rebound every solution SHA and artifact blob SHA through validator helpers.'});
fs.writeFileSync(ep,JSON.stringify(ev,null,2)+'\n','utf8');
console.log(JSON.stringify({artifactSha:ev.artifactSha,questionCount:box.window.questionBank.length,solutionHashes:ev.rows.length},null,2));

