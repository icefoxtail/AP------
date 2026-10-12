import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256,physical,writeFresh} from '../../../../../tools/archive-codex-artifact-io.mjs';
import {STUDENT_FIELDS,studentAssetRefs,normalizeStudentBundle} from '../../../../../tools/archive-student-bundle.mjs';
const root=path.resolve('.');
const source=path.resolve('archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js');
const expected='05A65C52125ABB6E2B0EFBD25F76D5A0DEAB8ABD1525DC70BCD425DAF03DF03C'.toLowerCase();
const exam=readExam(source);
if(exam.rawSha256!==expected)throw Error('ASSIGNED_CURRENT_SOURCE_SHA_MISMATCH:'+exam.rawSha256);
const all=exam.questions.filter(q=>Number(q.id??q.qid)===15);
if(all.length!==1)throw Error('Q15_ROW_COUNT_INVALID:'+all.length);
const q=all[0],student=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));
if(Number(student.id)!==15)throw Error('Q15_STUDENT_ID_MISMATCH');
const assets=[];
for(const ref of new Set(studentAssetRefs(student))){
 if(typeof ref!=='string'||!ref.startsWith('assets/images/'))throw Error(`INVALID_STUDENT_ASSET_REF:${ref}`);
 const file=path.resolve('archive',...ref.split('/'));
 const bytes=fs.readFileSync(file);assets.push({ref,path:file,sha256:sha256(bytes)});
}
const bundle=normalizeStudentBundle({schemaVersion:'R2_QID_ONLY_FRESH_STUDENT_BUNDLE_V1',sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:1,qids:[15],rows:[{qid:15,student,assets}]},{expectedSourceRawSha256:expected});
const out=path.resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ITEM_RECOVERY_q15/R2_qid_review_clean/q15-student-bundle.json');
writeFresh(out,bundle);
const evidence={schemaVersion:'R2_Q15_CURRENT_INPUT_BINDING_V1',examUid:'17_효천고_1학기_중간_고2_확률과통계',qid:15,uid:'qid_v1_ff0c963e7ee32656129dde775bc6d6bcae65f149a2c5c05e70b0cf6b0c5bb43b',worktreeRootAbsolute:root,workingJsAbsolute:source,assetRootAbsolute:path.resolve('archive'),evidenceRootAbsolute:path.dirname(out),expectedSourceSha256:expected,actualSourceSha256:exam.rawSha256,sourceBlobSha1:exam.rawBufferGitBlobSha1,studentBundle:physical(out),studentFieldWhitelist:[...STUDENT_FIELDS],assets:bundle.rows[0].assets.map(a=>({ref:a.ref,path:a.path,sha256:a.sha256})),studentOnly:true,answersRead:false,priorR2EvidenceRead:false,priorR1Q15EvidenceRead:false};
writeFresh(path.resolve(path.dirname(out),'q15-input-binding.json'),evidence);
console.log(JSON.stringify({examUid:evidence.examUid,qid:15,uid:evidence.uid,actualSourceSha256:exam.rawSha256,sourceBlobSha1:exam.rawBufferGitBlobSha1,bundle:evidence.studentBundle,assets:evidence.assets,studentOnly:true,answersRead:false},null,2));

