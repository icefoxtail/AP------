import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {readExam,sha256,writeFresh} from '../../../../tools/archive-codex-artifact-io.mjs';
import {STUDENT_FIELDS,studentAssetRefs,normalizeStudentBundle} from '../../../../tools/archive-student-bundle.mjs';
const root=process.cwd();
const sourceRel='.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/item-recovery-v2/23_금당고_1학기_중간_고2_수학I.js';
const assetRoot=path.resolve(root,'.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/item-recovery-v2');
const oldBundlePath=path.resolve(root,'.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/item-recovery-v2/ITEM_RECOVERY.student-only.json');
const outRel='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/ITEM_RECOVERY.v1/ITEM_RECOVERY.current-student-only.json';
const expected='37570857b17955263b350ba071d45023b329e24836263558d8f428b7c087291c';
const exam=readExam(path.resolve(root,sourceRel));
if(exam.rawSha256!==expected)throw Error('EXPECTED_CURRENT_RAW_SHA_MISMATCH');
const old=JSON.parse(fs.readFileSync(oldBundlePath,'utf8'));
const oldRows=new Map(old.rows.map(r=>[Number(r.qid),r]));
const rows=exam.questions.map(q=>{
  const student=Object.fromEntries(Object.entries(q).filter(([k])=>STUDENT_FIELDS.has(k)));
  if(Array.isArray(student.choices))student.choices=student.choices.map(c=>c&&typeof c==='object'&&!Array.isArray(c)?Object.fromEntries(Object.entries(c).filter(([k])=>['text','content','value','answer'].includes(k))):c);
  const assets=studentAssetRefs(student).map(ref=>{const file=path.resolve(assetRoot,ref);const bytes=fs.readFileSync(file);return{ref,path:file,sha256:sha256(bytes)};});
  return {qid:Number(q.id),student,assets,originalStudentPayloadSha256:oldRows.get(Number(q.id))?.studentPayloadSha256??null};
});
const native={schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:exam.questions.length,qids:exam.questions.map(q=>Number(q.id)),rows};
const value=normalizeStudentBundle(native,{expectedSourceRawSha256:expected});
if(value.questionCount!==20||value.qids.join(',')!=='1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20')throw Error('CURRENT_BUNDLE_DENOMINATOR_OR_ORDER_FAIL');
const nonTarget=value.rows.filter(r=>![9,10,18,19].includes(r.qid));
for(const row of nonTarget){const oldRow=oldRows.get(row.qid);if(!oldRow||row.studentPayloadSha256!==oldRow.studentPayloadSha256||JSON.stringify(row.student)!==JSON.stringify(oldRow.student))throw Error('NON_TARGET_STUDENT_PARITY_FAIL:'+row.qid);}
const out=path.resolve(root,outRel);const ref=writeFresh(out,value);
console.log(JSON.stringify({ref,sourceRawSha256:value.sourceRawSha256,questionCount:value.questionCount,targetRows:value.rows.filter(r=>[9,10,18,19].includes(r.qid)).map(r=>({qid:r.qid,studentPayloadSha256:r.studentPayloadSha256,assets:r.assets})),nonTargetStudentParity:'16/16',assetCount:value.rows.reduce((n,r)=>n+r.assets.length,0),adapterProvenance:value.adapterProvenance},null,2));