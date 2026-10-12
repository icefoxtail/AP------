import fs from 'node:fs';
import crypto from 'node:crypto';
import { readExam } from '../../../../tools/archive-codex-artifact-io.mjs';
const file='archive/exams/original/high/h2/1mid/18_효천고_1학기_중간_고2_확률과통계.js';
const bytes=fs.readFileSync(file);
const rawSha=b=>crypto.createHash('sha256').update(b).digest('hex');
const before=readExam(file);
if(rawSha(bytes)!=='299439016ed81ec7481317913f70261d8909df3250abee61f70c375322512b8d') throw Error('UNEXPECTED_PRE_REPAIR_SOURCE_SHA');
let replacements=0;
const edits=[];
const updated=bytes.toString('utf8').replace(/("solution"\s*:\s*")((?:\\.|[^"\\])*)(")/g,(whole,prefix,encoded,suffix)=>{
  const original=JSON.parse('"'+encoded+'"');
  let fixed=original
    .replace(/(?<!\\)cdot\b/g,'\\cdot')
    .replace(/(?<!\\)div\b/g,'\\div')
    .replace(/(?<!\\)\^circ\b/g,'^\\circ')
    .replace(/(?<!\\)ige\b/g,'i\\ge');
  if(fixed===original)return whole;
  const changed=[...original.matchAll(/(?<!\\)(?:cdot|div|\^circ|ige)\b/g)].length;
  replacements+=changed;
  edits.push({beforeSolutionSha256:rawSha(Buffer.from(original)),afterSolutionSha256:rawSha(Buffer.from(fixed)),repairCount:changed});
  return prefix+JSON.stringify(fixed).slice(1,-1)+suffix;
});
if(!edits.length||replacements!==23) throw Error('REPAIR_LOCUS_COUNT_MISMATCH:'+replacements+':'+edits.length);
fs.writeFileSync(file,updated);
const after=readExam(file);
const strip=q=>Object.fromEntries(Object.entries(q).filter(([k])=>k!=='solution'));
if(JSON.stringify(before.questions.map(strip))!==JSON.stringify(after.questions.map(strip)))throw Error('NON_SOLUTION_FIELD_CHANGED');
const changedQids=after.questions.filter((q,i)=>q.solution!==before.questions[i].solution).map(q=>q.id);
const bad=after.questions.filter(q=>/(?<!\\)(?:cdot|div|\^circ|ige)\b/.test(String(q.solution||''))).map(q=>q.id);
if(bad.length)throw Error('BARE_TEX_REMAINS:'+bad.join(','));
const record={schemaVersion:'JS_ARCHIVE_R1_TARGETED_SOLUTION_REPAIR_V1',stage:'R1',examUid:'18_효천고_1학기_중간_고2_확률과통계',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',repairType:'SOLUTION_TEX_COMMAND_ENCODING',preRepairRawSha256:rawSha(bytes),postRepairRawSha256:rawSha(Buffer.from(updated)),changedQids,changedTeXTokenCount:replacements,changedSolutionCount:edits.length,nonSolutionFieldsChanged:false,bareAffectedCommandScan:{patterns:['cdot','div','^circ','ige'],remainingQids:bad},calibrationEvidencePath:'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.calibration-preflight.json',failureHistoryPath:'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.failed-solution-order-attempt.json',solutionHashDeltas:edits};
const out='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.solution-repair.rev1.record.json';
fs.writeFileSync(out,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({recordPath:out,preRepairRawSha256:record.preRepairRawSha256,postRepairRawSha256:record.postRepairRawSha256,changedQids,changedTeXTokenCount:replacements,nonSolutionFieldsChanged:false,bareTokenQids:bad},null,2));

