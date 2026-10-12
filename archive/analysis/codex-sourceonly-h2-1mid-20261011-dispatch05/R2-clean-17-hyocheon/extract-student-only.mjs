import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256,writeFresh} from '../../../tools/archive-codex-artifact-io.mjs';
import {STUDENT_FIELDS,studentAssetRefs,normalizeStudentBundle} from '../../../tools/archive-student-bundle.mjs';
const root=path.resolve('.'), source=path.resolve('archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js');
const exam=readExam(source);
const rows=exam.questions.map(q=>{
 const qid=Number(q.id??q.qid);
 const student=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));
 const assets=[];
 for(const ref of new Set(studentAssetRefs(student))){
  if(typeof ref!=='string'||!ref.startsWith('assets/images/')) throw Error(`INVALID_STUDENT_ASSET_REF:${qid}:${ref}`);
  const file=path.resolve('archive',...ref.split('/'));
  const bytes=fs.readFileSync(file); assets.push({ref,path:file,sha256:sha256(bytes)});
 }
 return {qid,student,assets};
});
const bundle=normalizeStudentBundle({schemaVersion:'R2_FRESH_STUDENT_ONLY_BUNDLE_V1',sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:rows.length,qids:rows.map(r=>r.qid),rows},{expectedSourceRawSha256:exam.rawSha256});
const out=path.resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R2-clean-17-hyocheon/current-student-bundle.json');
writeFresh(out,bundle);
console.log(JSON.stringify({sourceRawSha256:exam.rawSha256,sourceBlob:exam.rawBufferGitBlobSha1,qids:bundle.qids,questionCount:bundle.questionCount,studentOnly:true,assets:bundle.rows.flatMap(r=>r.assets).map(a=>({qid:r.qid,ref:a.ref,sha256:a.sha256}))},null,2));
