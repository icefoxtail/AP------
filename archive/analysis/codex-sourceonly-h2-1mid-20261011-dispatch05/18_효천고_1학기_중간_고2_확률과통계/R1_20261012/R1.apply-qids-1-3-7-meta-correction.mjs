import fs from 'node:fs';
import crypto from 'node:crypto';
import {readExam} from '../../../../tools/archive-codex-artifact-io.mjs';
const file='archive/exams/original/high/h2/1mid/18_효천고_1학기_중간_고2_확률과통계.js';
const beforeBytes=fs.readFileSync(file),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
if(sha(beforeBytes)!=='95f25c5b719d7428a9b12ef6a17cd4b5c5fcc11092a6a8c8cdfbbe2bc2bf41ef')throw Error('META_REPAIR_SOURCE_SHA_MISMATCH');
const before=readExam(file),targets={
 1:{problemTypeKey:'PT_COUNTING_REPEATED_ASSIGNMENT',templateKey:'TPL_REPEATED_PERMUTATION_ASSIGNMENT'},
 3:{problemTypeKey:'PT_COUNTING_REPEATED_ASSIGNMENT',templateKey:'TPL_REPEATED_PERMUTATION_ASSIGNMENT'},
 7:{problemTypeKey:'PT_COUNTING_SELECTION_DISTRIBUTION',templateKey:'TPL_COMBINATION_SELECTION'}
};
let currentId=null;const counts={};
const lines=beforeBytes.toString('utf8').split(/(?<=\n)/).map(line=>{
 const idMatch=/^\s*"id"\s*:\s*(\d+)/.exec(line);if(idMatch)currentId=Number(idMatch[1]);
 const expected=targets[currentId];if(!expected)return line;
 for(const field of ['problemTypeKey','templateKey']){
  if(new RegExp('^\\s*"'+field+'"\\s*:\\s*null').test(line)){counts[currentId]=(counts[currentId]||0)+1;return line.replace(': null',': "'+expected[field]+'"');}
 }
 return line;
}).join('');
for(const q of [1,3,7])if(counts[q]!==2)throw Error('QID_META_FIELD_COUNT_MISMATCH:'+q+':'+counts[q]);
const afterBytes=Buffer.from(lines);fs.writeFileSync(file,afterBytes);
const after=readExam(file);
const studentProjection=exam=>exam.questions.map(q=>({id:q.id,content:q.content,choices:q.choices,answer:q.answer,image:q.image}));
if(JSON.stringify(studentProjection(before))!==JSON.stringify(studentProjection(after)))throw Error('STUDENT_BODY_CHANGED');
const solutionProjection=exam=>exam.questions.map(q=>({id:q.id,solution:q.solution,solutionImage:q.solutionImage}));
if(JSON.stringify(solutionProjection(before))!==JSON.stringify(solutionProjection(after)))throw Error('SOLUTION_FIELD_CHANGED');
const changed=Object.entries(targets).map(([qid,to])=>({qid:Number(qid),before:{problemTypeKey:before.questions.find(q=>q.id===Number(qid)).problemTypeKey,templateKey:before.questions.find(q=>q.id===Number(qid)).templateKey},after:to}));
const record={schemaVersion:'JS_ARCHIVE_R1_TARGETED_META_CORRECTION_V1',stage:'R1',examUid:'18_효천고_1학기_중간_고2_확률과통계',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',changed,lookupRefs:['archive/data/meta-foundation/compiled/taxonomy_registry.json#PROBABILITY_STATISTICS','archive/data/meta-foundation/canonical/packs/probability-statistics/bindings.json','archive/data/meta-foundation/canonical/packs/probability-statistics/taxonomy.json','archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-probability-statistics.json'],rationale:{q1:'Two distinct dice permit repeated face values and the solution enumerates ordered outcome assignments; exact active repeated-assignment PT/TPL is the only matching assignment family.',q3:'Map regions receive colors with repeats allowed only across nonadjacent regions; the solution counts constrained repeated assignments, not a permutation of all-distinct colors.',q7:'The solution chooses positions of up moves in each grid segment using binomial coefficients; the current 2015 H15-PS-01 counting-application binding exposes the active selection PT with combination-selection template.'},rpmL3L4:'For these basic counting applications, the current 2015 H2 RPM Primary file does not provide a deterministic exact L3/L4 leaf for these methods; preserve as RPM_COVERAGE_GAP_META_ONLY, no new RPM key inferred.',studentBodyChanged:false,solutionChanged:false,preRepairRawSha256:sha(beforeBytes),postRepairRawSha256:sha(afterBytes),projectionFollowup:'Source Meta values repaired within R1; downstream Consumer/index projection remains for ROOT/publication to bind to final SHA.'};
const out='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.qids-1-3-7-meta-correction.record.json';fs.writeFileSync(out,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:out,preRepairSha256:record.preRepairRawSha256,postRepairSha256:record.postRepairRawSha256,changedQids:changed.map(x=>x.qid),studentBodyChanged:false,solutionChanged:false},null,2));
