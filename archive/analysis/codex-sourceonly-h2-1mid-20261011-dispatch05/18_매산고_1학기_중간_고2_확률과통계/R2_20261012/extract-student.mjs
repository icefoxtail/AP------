import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256} from '../../../../tools/archive-codex-artifact-io.mjs';
const source='archive/exams/original/high/h2/1mid/18_매산고_1학기_중간_고2_확률과통계.js';
const assetRoot='archive';
const out='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_매산고_1학기_중간_고2_확률과통계/R2_20261012/student-only.bundle.json';
const fields=['id','sourceQuestionNo','displayNo','content','question','choices','image','imageSize','choiceColumns','layoutTag','wide','preserveChoicePrefixes','__apExamSubjectiveSpacing','sharedContext','sharedMaterial','commonData','commonPassage','passage','table'];
const choiceFields=new Set(['text','content','value','answer']);
const {questions,rawSha256}=readExam(source);
const rows=questions.map(q=>{
  const student=Object.fromEntries(fields.filter(k=>Object.hasOwn(q,k)).map(k=>[k,structuredClone(q[k])]));
  if(Array.isArray(student.choices)) student.choices=student.choices.map(c=>c&&typeof c==='object'&&!Array.isArray(c)?Object.fromEntries(Object.entries(c).filter(([k])=>choiceFields.has(k))):c);
  const refs=new Set();
  for(const value of Object.values(student)){
    if(typeof value==='string') for(const m of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi)) if(!/^(?:data:|#)/.test(m[1])) refs.add(m[1]);
  }
  if(student.image) refs.add(student.image);
  const assets=[...refs].map(ref=>{if(!ref.startsWith('assets/images/')) throw Error('NON_PRODUCTION_ASSET_REF:'+ref); const p=path.resolve(assetRoot,ref),bytes=fs.readFileSync(p);return {ref,path:p,sha256:sha256(bytes)};});
  return {qid:Number(q.id??q.qid),student,assets,studentPayloadSha256:sha256(Buffer.from(JSON.stringify(student)))};
});
const qids=rows.map(r=>r.qid); if(qids.length!==18||qids.some((q,i)=>q!==i+1)) throw Error('QID_DENOMINATOR_OR_ORDER_MISMATCH:'+qids.join(','));
const value={schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:rawSha256,questionCount:rows.length,qids,rows};
fs.writeFileSync(out,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output:path.resolve(out),sha256:sha256(fs.readFileSync(out)),sourceRawSha256:rawSha256,questionCount:rows.length,qids,assetRefs:[...new Set(rows.flatMap(r=>r.assets.map(a=>a.ref)))]}));

