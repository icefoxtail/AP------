import fs from 'node:fs';
import crypto from 'node:crypto';
import { readExam } from '../../../../tools/archive-codex-artifact-io.mjs';
const file='archive/exams/original/high/h2/1mid/18_효천고_1학기_중간_고2_확률과통계.js';
const bytes=fs.readFileSync(file), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const before=readExam(file);
if(sha(bytes)!=='299439016ed81ec7481317913f70261d8909df3250abee61f70c375322512b8d') throw Error('UNEXPECTED_PRE_REPAIR_SOURCE_SHA');
let count=0; const changedLines=[];
const fixed=bytes.toString('utf8').split(/(?<=\n)/).map((line,index)=>{
  if(!/^\s*"solution"\s*:/.test(line)) return line;
  let updated=line,n=0;
  for(const [pattern,replacement] of [
    [/(?<!\\)cdot/g,'\\\\cdot'],
    [/(?<!\\)div/g,'\\\\div'],
    [/(?<!\\)\^circ/g,'^\\\\circ'],
    [/(?<!\\)ige/g,'i\\\\ge'],
  ]) updated=updated.replace(pattern,()=>{n++;return replacement;});
  if(n){count+=n;changedLines.push(index+1);}
  return updated;
}).join('');
if(count!==26) throw Error('REPAIR_TOKEN_COUNT_MISMATCH:'+count);
const afterBytes=Buffer.from(fixed);
fs.writeFileSync(file,afterBytes);
const after=readExam(file),strip=q=>Object.fromEntries(Object.entries(q).filter(([k])=>k!=='solution'));
if(JSON.stringify(before.questions.map(strip))!==JSON.stringify(after.questions.map(strip)))throw Error('NON_SOLUTION_FIELD_CHANGED');
const changedQids=after.questions.filter((q,i)=>q.solution!==before.questions[i].solution).map(q=>q.id);
const remaining=after.questions.filter(q=>/(?<!\\)(?:cdot|div|\^circ|ige)/.test(String(q.solution||''))).map(q=>q.id);
if(remaining.length)throw Error('BARE_TEX_REMAINS:'+remaining.join(','));
const solutionHashDeltas=after.questions.map((q,i)=>({qid:q.id,before:before.questions[i].solution,after:q.solution})).filter(x=>x.before!==x.after).map(x=>({qid:x.qid,beforeSolutionSha256:sha(Buffer.from(x.before)),afterSolutionSha256:sha(Buffer.from(x.after))}));
const record={schemaVersion:'JS_ARCHIVE_R1_TARGETED_SOLUTION_REPAIR_V1',stage:'R1',examUid:'18_효천고_1학기_중간_고2_확률과통계',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',repairType:'SOLUTION_TEX_COMMAND_ENCODING',preRepairRawSha256:sha(bytes),postRepairRawSha256:sha(afterBytes),changedQids,changedPhysicalLines:changedLines,changedTeXTokenCount:count,changedSolutionCount:solutionHashDeltas.length,nonSolutionFieldsChanged:false,bareAffectedCommandScan:{patterns:['cdot','div','^circ','ige'],remainingQids:remaining},calibrationEvidencePath:'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.calibration-preflight.json',failureHistoryPaths:['archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.failed-solution-order-attempt.json','archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.solution-repair.rev1.failure.json','archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.solution-repair.rev1-count-failure.json','archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.solution-repair.rev2-count-failure.json'],solutionHashDeltas};
const out='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.solution-repair.rev4.record.json';
fs.writeFileSync(out,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({recordPath:out,preRepairRawSha256:record.preRepairRawSha256,postRepairRawSha256:record.postRepairRawSha256,changedQids,changedTeXTokenCount:count,nonSolutionFieldsChanged:false,bareTokenQids:remaining},null,2));

