import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const root=process.cwd();
const {readExam,physical}=await import(pathToFileURL(path.join(root,'archive/tools/archive-codex-artifact-io.mjs')));
const {STUDENT_FIELDS}=await import(pathToFileURL(path.join(root,'archive/tools/archive-student-bundle.mjs')));
const [currentPath,preimagePath,oldBundlePath,currentBundleOut,parityOut]=process.argv.slice(2);
const cur=readExam(currentPath), old=readExam(preimagePath), oldBundle=JSON.parse(fs.readFileSync(oldBundlePath,'utf8'));
const qid=q=>Number(q.id??q.qid);
const student=q=>{const s=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));if(Array.isArray(s.choices))s.choices=s.choices.map(c=>c&&typeof c==='object'&&!Array.isArray(c)?Object.fromEntries(Object.entries(c).filter(([k])=>['text','content','value','answer'].includes(k))):c);return s;};
const stable=x=>JSON.stringify(x);
if(cur.questions.length!==22||old.questions.length!==22||oldBundle.rows.length!==22)throw Error('QID_DENOMINATOR_MISMATCH');
const diffs=[];let otherStudentEqual=true;let nonStudentEqual=true;
for(let i=0;i<22;i++){
  const q0=old.questions[i],q1=cur.questions[i],id=qid(q0),row=oldBundle.rows.find(r=>Number(r.qid)===id);
  if(!row||qid(q1)!==id)throw Error('QID_ORDER_MISMATCH');
  const s0=student(q0),s1=student(q1);
  if(stable(s0)!==stable(row.student))throw Error('PREIMAGE_BUNDLE_STUDENT_MISMATCH:q'+id);
  if(stable(s0)!==stable(s1)){
    const allowed=id===22&&typeof s0.content==='string'&&typeof s1.content==='string'&&s1.content.replace('<br>','')===s0.content&&s1.content.indexOf('<br>')===s1.content.lastIndexOf('<br>');
    if(!allowed)throw Error('UNEXPECTED_STUDENT_DIFF:q'+id);
    diffs.push({qid:id,field:'content',change:'one <br> inserted; removing it exactly restores preimage student text'});
    if(stable({...s1,content:s0.content})!==stable(s0))throw Error('Q22_OTHER_STUDENT_FIELD_CHANGED');
  }
  const q0all=JSON.parse(JSON.stringify(q0)),q1all=JSON.parse(JSON.stringify(q1));
  if(id===22)q1all.content=q1all.content.replace('<br>','');
  if(stable(q0all)!==stable(q1all))nonStudentEqual=false;
  const refs=new Set([...(typeof s1.image==='string'?[s1.image]:[])]);
  for(const value of [s1.content,s1.question,...(Array.isArray(s1.choices)?s1.choices:[])])if(typeof value==='string')for(const m of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(m[1]))refs.add(m[1]);
  const oldRefs=(row.assets||[]).map(a=>a.ref).sort();if(stable([...refs].sort())!==stable(oldRefs))throw Error('ASSET_REF_CHANGED:q'+id);
}
if(diffs.length!==1||diffs[0].qid!==22||!nonStudentEqual)throw Error('DIFF_SCOPE_NOT_EXACT');
const rows=cur.questions.map(q=>{const id=qid(q),s=student(q),oldRow=oldBundle.rows.find(r=>Number(r.qid)===id);for(const a of oldRow.assets||[])if(createHash('sha256').update(fs.readFileSync(a.path)).digest('hex')!==a.sha256)throw Error('ASSET_SHA_CHANGED:'+a.ref);return {qid:id,student:s,studentPayloadSha256:createHash('sha256').update(JSON.stringify(s)).digest('hex'),assets:oldRow.assets};});
const bundle={schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:cur.rawSha256,sourceRawBlobSha1:cur.rawBufferGitBlobSha1,questionCount:rows.length,qids:rows.map(r=>r.qid),rows};
fs.writeFileSync(currentBundleOut,JSON.stringify(bundle,null,2)+'\n',{flag:'wx'});
const parity={schemaVersion:'JS_ARCHIVE_R2_STUDENT_LAYOUT_REBIND_V1',preimage:{path:preimagePath,...physical(preimagePath)},currentSource:{path:currentPath,...physical(currentPath),rawBufferGitBlobSha1:cur.rawBufferGitBlobSha1},originalStudentBundle:{path:oldBundlePath,...physical(oldBundlePath)},currentStudentBundle:{path:currentBundleOut,...physical(currentBundleOut)},qidCount:22,studentDiffs:diffs,allOtherStudentFieldsEqual:true,allQuestionObjectsEqualAfterReversingQ22Break:true,assetsUnchanged:true,freezeMathReuseBasis:'The original immutable R2 freeze and q11 adjudication are referenced separately; current R1 final diff proof certifies that the sole q22 <br> insertion changes layout only.'};
fs.writeFileSync(parityOut,JSON.stringify(parity,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({qidCount:22,studentDiffs:diffs,allOtherStudentFieldsEqual:true,allQuestionObjectsEqualAfterReversingQ22Break:true,assetsUnchanged:true,currentStudentBundle:physical(currentBundleOut),parityEvidence:physical(parityOut)},null,2));