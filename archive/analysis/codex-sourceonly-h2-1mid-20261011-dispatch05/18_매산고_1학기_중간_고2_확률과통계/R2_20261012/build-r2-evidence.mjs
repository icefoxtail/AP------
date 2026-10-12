import fs from 'node:fs'; import path from 'node:path';
import {readExam,sha256,physical,writeFresh} from '../../../../tools/archive-codex-artifact-io.mjs';
const base=path.resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_매산고_1학기_중간_고2_확률과통계/R2_20261012');
const examPath=path.resolve('archive/exams/original/high/h2/1mid/18_매산고_1학기_중간_고2_확률과통계.js');
const bundlePath=path.join(base,'student-only.bundle.json'),freezePath=path.join(base,'blind-freeze.json'),disclosurePath=path.join(base,'stored-disclosure.postrepair.json'),adjPath=path.join(base,'q15-adjudication.json'),r1Path=path.resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_매산고_1학기_중간_고2_확률과통계/R1.evidence.bound.json');
const exam=readExam(examPath),bundle=JSON.parse(fs.readFileSync(bundlePath)),freeze=JSON.parse(fs.readFileSync(freezePath)),disclosure=JSON.parse(fs.readFileSync(disclosurePath)),r1=JSON.parse(fs.readFileSync(r1Path));
if(exam.rawSha256!=='efe160b4cc07b8389279f23ada2d4d8d51af242da295571a56acf81c1a607b86') throw Error('CURRENT_FINAL_SOURCE_SHA_CHANGED');
if(bundle.sourceRawSha256!==freeze.sourceRawSha256||disclosure.studentParity!=='EXACT'||disclosure.originalFreeze.sha256!==physical(freezePath).sha256) throw Error('FREEZE_OR_STUDENT_PARITY_BINDING_FAILED');
if(bundle.rows.length!==18||exam.questions.length!==18||disclosure.rows.length!==18||freeze.rows.length!==18) throw Error('FULL_18_QID_DENOMINATOR_REQUIRED');
const symbol=['①','②','③','④','⑤'],rows=[]; const normalize=s=>String(s).replace(/\\(?:d)?frac\{([^{}]+)\}\{([^{}]+)\}/g,'$1/$2').replaceAll('$','').replaceAll('\\,','').replaceAll(' ','');
for(let i=0;i<18;i++){
 const q=exam.questions[i],f=freeze.rows[i],d=disclosure.rows[i];
 if(Number(q.id)!==i+1||f.qid!==i+1||d.qid!==i+1) throw Error('QID_ORDER_OR_JOIN_MISMATCH:'+i);
 let stored=String(q.answer??'').trim(),matched=false;
 if(i<13){const index=symbol.indexOf(stored);if(index<0)throw Error('OBJECTIVE_ANSWER_SYMBOL_INVALID:'+q.id);const choice=normalize((q.choices||[])[index]??'');matched=choice===normalize(f.independentAnswer);}
 else matched=normalize(stored)===normalize(f.independentAnswer);
 if(!matched) throw Error('BLIND_STORED_ANSWER_MISMATCH:q'+q.id);
 const row={qid:q.id,blindAnswer:String(f.independentAnswer),blindAnswerFrozenBeforeR1AndStoredAnswer:true,compareResult:q.id===15?'SUSPICIOUS':'MATCH',verdict:q.id===15?'PASS_AFTER_MINIMAL_REPAIR':'PASS',comparedStoredAnswer:stored};
 if(q.id===15) row.disposition='Independent and stored answer are 632. Initial disclosed q15 solution ended with 752; the same R2 stage changed only that solution final numeral to 632, preserving the original freeze and recording the correction separately.';
 rows.push(row);
}
if(!Array.isArray(r1.artifactDispositions?.rows)||r1.artifactDispositions.rows.length!==18) throw Error('R1_FULL_ARTIFACT_DISPOSITIONS_REQUIRED');
const blobSha=exam.rawBufferGitBlobSha1;
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'R2',examUid:'18_매산고_1학기_중간_고2_확률과통계',examTitle:'18_매산고_1학기_중간_고2_확률과통계',artifactSha:blobSha,artifactRawSha256:exam.rawSha256,sourceIdentity:{path:examPath,rawSha256:exam.rawSha256,rawBufferBlobSha1:blobSha},denominator:18,expectedQids:Array.from({length:18},(_,i)=>i+1),rows,studentInput:{path:bundlePath,sha256:sha256(fs.readFileSync(bundlePath)),sourceRawSha256:bundle.sourceRawSha256,studentParity:'EXACT',assetCount:0,complete:true},independentFreeze:physical(freezePath),storedDisclosure:physical(disclosurePath),adjudication:physical(path.join(base,'q15-adjudication.json')),artifactDispositions:{artifactSha:blobSha,rows:structuredClone(r1.artifactDispositions.rows)},actualRenderPassAsserted:false,scope:{stage:'R2',examUid:'18_매산고_1학기_중간_고2_확률과통계',qidCount:18,scope:'FULL_ASSIGNED_EXAM_BLIND_ANSWER_SWEEP',studentOnlyFreeze:true,referencedAssetCount:0,sourceMutation:{qid:15,locus:'solution final numeral',beforeRawSha256:'d4b59e341f1ba5e1aa86046a6acc98a3140097c2cdb04a1b3aef280d228b854a',afterRawSha256:exam.rawSha256}}};
const ref=writeFresh(path.join(base,'R2.evidence.json'),evidence); console.log(JSON.stringify({ref,artifactSha:blobSha,rawSha256:exam.rawSha256,qids:rows.map(r=>r.qid),compareCounts:{MATCH:rows.filter(r=>r.compareResult==='MATCH').length,SUSPICIOUS:rows.filter(r=>r.compareResult==='SUSPICIOUS').length}}));
