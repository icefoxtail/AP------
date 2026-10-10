import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256,inside} from '../../../../tools/archive-codex-artifact-io.mjs';
const root=process.cwd(),examRel='archive/exams/original/high/h2/1mid/24_순천고_1학기_중간_고2_수학I.js',examFile=path.join(root,examRel),assetRoot=path.join(root,'archive'),expected='8c403b10678e331f5c613f093e14aa6d42b95cccd9a1a160751f828453ce3933';
const {questions,rawSha256,rawBufferGitBlobSha1}=readExam(examFile);if(rawSha256!==expected)throw Error('EXPECTED_SOURCE_SHA_MISMATCH');
const fields=['id','sourceQuestionNo','displayNo','content','question','choices','image','imageSize','choiceColumns','layoutTag','wide','preserveChoicePrefixes','__apExamSubjectiveSpacing','sharedContext','sharedMaterial','commonData','commonPassage','passage','table'];
function refs(v,out=new Set()){if(typeof v==='string'){for(const m of v.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi))if(!/^(?:data:|#)/.test(m[1]))out.add(m[1]);}else if(Array.isArray(v))for(const x of v)refs(x,out);else if(v&&typeof v==='object')for(const x of Object.values(v))refs(x,out);return out;}
const rows=questions.map((q,i)=>{const id=Number(q.id??i+1),student=Object.fromEntries(fields.filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));const assetRefs=refs(student);if(student.image)assetRefs.add(student.image);const assets=[...assetRefs].map(ref=>{const file=inside(assetRoot,ref),bytes=fs.readFileSync(file);return {ref,path:file,sha256:sha256(bytes)};});return {qid:id,student,assets};});
const out={schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:rawSha256,sourceRawBlobSha1:rawBufferGitBlobSha1,questionCount:rows.length,qids:rows.map(r=>r.qid),rows};
const outfile=path.join(root,'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/R1_20261011_CODEX/current-student-only.bundle.json');fs.writeFileSync(outfile,JSON.stringify(out,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({out:outfile,sha256:sha256(fs.readFileSync(outfile)),sourceRawSha256:rawSha256,rawBufferGitBlobSha1,questionCount:rows.length,assetRefs:rows.flatMap(r=>r.assets.map(a=>({qid:r.qid,ref:a.ref,sha256:a.sha256})))},null,2));


