import fs from 'node:fs';
import crypto from 'node:crypto';
import {readExam} from '../../../../tools/archive-codex-artifact-io.mjs';
const file='archive/exams/original/high/h2/1mid/18_효천고_1학기_중간_고2_확률과통계.js';
const beforeBytes=fs.readFileSync(file),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
if(sha(beforeBytes)!=='8582ec929237c185b734555b7e514f102612e5652649c88633646e64523ac378')throw Error('META_REPAIR_SOURCE_SHA_MISMATCH');
const before=readExam(file);
let currentId=null,pt=0,tpl=0;
const lines=beforeBytes.toString('utf8').split(/(?<=\n)/).map(line=>{
 const idMatch=/^\s*"id"\s*:\s*(\d+)/.exec(line);
 if(idMatch)currentId=Number(idMatch[1]);
 if(currentId!==16)return line;
 if(/^\s*"problemTypeKey"\s*:\s*null/.test(line)){pt++;return line.replace(': null',': "PT_COUNTING_SELECTION_DISTRIBUTION"');}
 if(/^\s*"templateKey"\s*:\s*null/.test(line)){tpl++;return line.replace(': null',': "TPL_COMBINATION_SELECTION"');}
 return line;
}).join('');
if(pt!==1||tpl!==1)throw Error('EXACT_Q16_FIELDS_NOT_FOUND:'+pt+':'+tpl);
const afterBytes=Buffer.from(lines);
fs.writeFileSync(file,afterBytes);
const after=readExam(file);
const beforeQ=before.questions.find(q=>q.id===16),afterQ=after.questions.find(q=>q.id===16);
if(afterQ.problemTypeKey!=='PT_COUNTING_SELECTION_DISTRIBUTION'||afterQ.templateKey!=='TPL_COMBINATION_SELECTION')throw Error('Q16_META_BINDING_NOT_APPLIED');
const studentProjection=exam=>exam.questions.map(q=>({id:q.id,content:q.content,choices:q.choices,answer:q.answer,image:q.image}));
if(JSON.stringify(studentProjection(before))!==JSON.stringify(studentProjection(after)))throw Error('STUDENT_BODY_CHANGED');
const record={schemaVersion:'JS_ARCHIVE_R1_TARGETED_META_CORRECTION_V1',stage:'R1',examUid:'18_효천고_1학기_중간_고2_확률과통계',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',qid:16,changedFields:['problemTypeKey','templateKey'],before:{problemTypeKey:beforeQ.problemTypeKey,templateKey:beforeQ.templateKey},after:{problemTypeKey:afterQ.problemTypeKey,templateKey:afterQ.templateKey},lookupRefs:['archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-probability-statistics.json#H2-PS-RPM-003','archive/data/meta-foundation/compiled/taxonomy_registry.json#PROBABILITY_STATISTICS'],rationale:'The independently verified decisive solution uses choose-3 selections over the full set and the two homogeneous parity subsets. H15-PS-01-COMBINATION maps to the exact ACTIVE selection PT/TPL and exact binding in H2-PS-RPM-003; no new semantic key was introduced.',studentBodyChanged:false,preRepairRawSha256:sha(beforeBytes),postRepairRawSha256:sha(afterBytes),projectionFollowup:'Current R1 Meta evidence is updated. Consumer/index are not rewritten by this R1-only stage; ROOT/downstream projection publication must consume the corrected source value.'};
const out='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012/R1.q16-meta-correction.record.json';
fs.writeFileSync(out,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:out,preRepairSha256:record.preRepairRawSha256,postRepairSha256:record.postRepairRawSha256,qid:16,changedFields:record.changedFields,studentBodyChanged:false},null,2));
