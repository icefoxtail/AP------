import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256,writeFresh} from '../../../tools/archive-codex-artifact-io.mjs';

const source='archive/exams/original/high/h2/1mid/18_금당고_1학기_중간_고2_확률과통계.js';
const assetRoot='archive';
const output='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R2-18-geumdang-clean2/R2.student-only.bundle.asset-rebind.rev3.json';
const expected='808d84815eae068a30a2e8a8efa2209adb8dccd8abc4d779b2828b21c3c84301';
const fields=['id','sourceQuestionNo','displayNo','content','question','choices','image','imageSize','choiceColumns','layoutTag','wide','preserveChoicePrefixes','__apExamSubjectiveSpacing','sharedContext','sharedMaterial','commonData','commonPassage','passage','table'];
const {questions,rawSha256,rawBufferGitBlobSha1}=readExam(source);
if(rawSha256!==expected) throw Error('CURRENT_SOURCE_SHA_MISMATCH');
const rows=questions.map(q=>{
  const student=Object.fromEntries(fields.filter(k=>Object.hasOwn(q,k)).map(k=>[k,structuredClone(q[k])]));
  const refs=new Set();
  for(const value of Object.values(student)) if(typeof value==='string') for(const m of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi)) if(!/^(?:data:|#)/.test(m[1])) refs.add(m[1]);
  if(student.image) refs.add(student.image);
  const assets=[...refs].map(ref=>{
    if(!ref.startsWith('assets/images/')) throw Error('NON_PRODUCTION_ASSET_REF');
    const file=path.resolve(assetRoot,ref),bytes=fs.readFileSync(file);
    return {ref,path:file,sha256:sha256(bytes)};
  });
  return {qid:Number(q.id??q.qid),student,studentPayloadSha256:sha256(Buffer.from(JSON.stringify(student))),assets,originalStudentPayloadSha256:null};
});
const qids=rows.map(r=>r.qid);
if(rows.length!==22||qids.some((q,i)=>q!==i+1)) throw Error('QID_DENOMINATOR_OR_ORDER_MISMATCH');
const value={schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:rawSha256,sourceRawBlobSha1:rawBufferGitBlobSha1,questionCount:rows.length,qids,whitelist:fields,rows,adapterProvenance:{input:path.resolve(source),inputSchemaVersion:null,legacyConverted:false,studentFieldsDropped:[],answersRead:false,originalBundleMutated:false}};
const ref=writeFresh(output,value);
console.log(JSON.stringify({output:ref.path,sha256:ref.sha256,sourceRawSha256:rawSha256,sourceRawBlobSha1:rawBufferGitBlobSha1,questionCount:rows.length,qids,assetRefs:[...new Set(rows.flatMap(r=>r.assets.map(a=>a.ref)))]}));
