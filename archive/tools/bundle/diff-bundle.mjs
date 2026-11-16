#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classify, fingerprints } from '../meta-foundation/source-delta.mjs';
import { loadBank } from '../meta-foundation/source-delta-report.mjs';
import { ROOT,SCHEMA,sourceIdentityNumber,git,blobHash,sha256,args,writeOutput,outputFile } from './build-bundle.mjs';
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function validate(m) {
  if(m.schemaVersion!==SCHEMA||!Array.isArray(m.questions)||m.questionCount!==m.questions.length||typeof m.sourceArchiveFile!=='string') throw Error('INVALID_MANIFEST');
  const seen=new Set();
  m.questions.forEach((q,i)=>{if(q.sourceOrdinal!==i+1||q.questionUid&&seen.has(q.questionUid)) throw Error('MANIFEST_IDENTITY_CONFLICT'); if(q.questionUid)seen.add(q.questionUid);});
}
function snapshot(root,m) {
  if(!/^[a-f0-9]{40}$/.test(m.sourceGitBlobSha||'')||!/^[a-f0-9]{64}$/.test(m.sourceSha256||'')) return {bank:null,status:'NO_SOURCE_HASH'};
  if(!/^[a-f0-9]{40}$/.test(m.sourceCommit||'')) return {bank:null,status:'SOURCE_COMMIT_UNAVAILABLE'};
  try { if(git(root,['rev-parse',`${m.sourceCommit}:archive/exams/${m.sourceArchiveFile}`]).toString().trim()!==m.sourceGitBlobSha) throw Error('SOURCE_PATH_BLOB_MISMATCH'); } catch { throw Error('SOURCE_PATH_BLOB_MISMATCH'); }
  let bytes; try { bytes=git(root,['cat-file','blob',m.sourceGitBlobSha]); } catch {return {bank:null,status:'GIT_OBJECT_UNAVAILABLE'};}
  if(blobHash(bytes)!==m.sourceGitBlobSha||sha256(bytes)!==m.sourceSha256) throw Error('SOURCE_HASH_MISMATCH');
  const bank=loadBank(bytes.toString()); if(bank.length!==m.questionCount) throw Error('SOURCE_COUNT_MISMATCH');
  for(let i=0;i<bank.length;i++) { const q=m.questions[i],fp=fingerprints(bank[i]);
    if(q.sourceFingerprint!==fp.sourceFingerprint||q.contentFingerprint!==fp.contentFingerprint) throw Error('QUESTION_FINGERPRINT_MISMATCH');
    const no=sourceIdentityNumber(bank[i]);
    if(!same(no,q.sourceQuestionNo)) throw Error('NUMBER_MISMATCH');
  }
  return {bank,status:'AVAILABLE'};
}
export function diffBundles(before,after,{root=ROOT}={}) {
  validate(before);validate(after); if(before.sourceArchiveFile!==after.sourceArchiveFile) throw Error('DIFFERENT_EXAM');
  const a=snapshot(root,before),b=snapshot(root,after);
  const questions=[];
  for(let i=0;i<Math.max(before.questionCount,after.questionCount);i++) {
    const x=before.questions[i],y=after.questions[i];
    const identityMismatch=!!(x&&y&&(x.questionUid!==y.questionUid||String(x.sourceQuestionNo)!==String(y.sourceQuestionNo)));
    questions.push({sourceOrdinal:i+1,questionUid:y?.questionUid??x?.questionUid??null,
      presence:!x?'ADDED':!y?'REMOVED':'BOTH',identityMismatch,
      bodyFingerprintChanged:!same(x?.sourceFingerprint,y?.sourceFingerprint),
      assetsChanged:!same(x?.assets,y?.assets),metadataChanged:!same(x?.metadata,y?.metadata),registrationChanged:!same(x?.registration,y?.registration),
      sourceDelta:x&&y&&!identityMismatch&&a.bank&&b.bank?classify(a.bank[i],b.bank[i]):null,
      classificationStatus:identityMismatch?'SOURCE_UID_CONFLICT':!x||!y?'ORDINAL_MISMATCH':a.status!=='AVAILABLE'?a.status:b.status});
  }
  return {schemaVersion:'archive-exam-bundle-diff-v0',sourceArchiveFile:after.sourceArchiveFile,questions};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {const o=args(process.argv.slice(2),['--before','--after','--out']);outputFile(ROOT,o.out);writeOutput(ROOT,o.out,diffBundles(JSON.parse(fs.readFileSync(o.before)),JSON.parse(fs.readFileSync(o.after))));} catch(e) {console.error(e.message);process.exitCode=1;}
}
