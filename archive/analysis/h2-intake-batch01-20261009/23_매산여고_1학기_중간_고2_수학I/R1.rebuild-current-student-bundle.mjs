import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256,writeFresh} from '../../../../archive/tools/archive-codex-artifact-io.mjs';
import {normalizeStudentBundle,STUDENT_FIELDS,studentAssetRefs} from '../../../../archive/tools/archive-student-bundle.mjs';
const root=path.resolve('.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I');
const exam=readExam(path.join(root,'23_매산여고_1학기_중간_고2_수학I.js'));
const old=JSON.parse(fs.readFileSync(path.join(root,'R1.student-only.json'),'utf8'));
const rows=exam.questions.map(q=>{const student=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));const assets=studentAssetRefs(student).map(ref=>{const file=path.resolve(root,ref);return {ref,path:file,sha256:sha256(fs.readFileSync(file))};});return {qid:Number(q.id),student,assets};});
const value=normalizeStudentBundle({schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:rows.length,qids:rows.map(r=>r.qid),rows},{expectedSourceRawSha256:exam.rawSha256});
const result=writeFresh(path.resolve('archive/analysis/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I/R1.student-only-current-final.v1.json'),value);
const bodyChanges=[];for(const row of value.rows){const prior=old.rows.find(r=>r.qid===row.qid);if(JSON.stringify(prior?.student)!==JSON.stringify(row.student))bodyChanges.push(row.qid);}
const assets=value.rows.flatMap(r=>r.assets.map(a=>({qid:r.qid,ref:a.ref,sha256:a.sha256})));
console.log(JSON.stringify({result,sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:value.questionCount,bodyChanges,assets,adapterProvenance:value.adapterProvenance},null,2));

