import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256} from '../../../../tools/archive-codex-artifact-io.mjs';
const sourceFile=process.argv[2], assetRoot=process.argv[3], output=process.argv[4];
const allowed=new Set(['id','sourceQuestionNo','displayNo','content','question','choices','image','imageSize','choiceColumns','layoutTag','wide','preserveChoicePrefixes','__apExamSubjectiveSpacing','sharedContext','sharedMaterial','commonData','commonPassage','passage','table']);
const choiceAllowed=new Set(['text','content','value','answer']);
const exam=readExam(sourceFile);
const rows=exam.questions.map(q=>{
 const student=Object.fromEntries([...allowed].filter(k=>Object.hasOwn(q,k)).map(k=>[k,k==='choices'&&Array.isArray(q[k])?q[k].map(c=>c&&typeof c==='object'&&!Array.isArray(c)?Object.fromEntries(Object.entries(c).filter(([x])=>choiceAllowed.has(x))):c):q[k]]));
 const refs=new Set();
 const scan=v=>{
  if(typeof v==='string'){
   for(const m of v.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi)){
    if(!/^(?:data:|#)/.test(m[1]))refs.add(m[1]);
   }
  }else if(Array.isArray(v))v.forEach(scan);
  else if(v&&typeof v==='object')Object.values(v).forEach(scan);
 };
 scan(student); if(student.image)refs.add(student.image);
 const assets=[...refs].map(ref=>{if(!ref.startsWith('assets/images/'))throw new Error('NON_PRODUCTION_ASSET_REF:'+ref);const p=path.resolve(assetRoot,ref);const b=fs.readFileSync(p);return {ref,path:p,sha256:sha256(b)};});
 return {qid:Number(q.id??q.qid),student,assets};
});
const payload={schemaVersion:'CURRENT_STUDENT_ONLY_EXTRACT_V1',sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:rows.length,qids:rows.map(r=>r.qid),rows};
fs.writeFileSync(output,JSON.stringify(payload,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output,sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:rows.length,qids:payload.qids,assetRefs:rows.flatMap(r=>r.assets.map(a=>({qid:r.qid,ref:a.ref,sha256:a.sha256})))},null,2));
