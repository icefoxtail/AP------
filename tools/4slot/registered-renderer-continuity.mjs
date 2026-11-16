import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {nativeReviewedRendererRebind} from '../../archive/tools/meta-foundation/native-reviewed-renderer-reuse.mjs';
import {loadActiveMetaRegistry,validateActiveMetaFields} from '../../archive/tools/meta-foundation/active-registry.mjs';
import {sourceNumber,sourceIdentityNumber} from './exam-items.cjs';
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
const equal=(a,b)=>stable(a)===stable(b),fail=message=>{throw Error(message);};
const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&equal(Object.keys(o).sort(),[...keys].sort());
function safe(root,p){
  if(typeof p!=='string'||!p||path.isAbsolute(p)||/[\\\x00-\x1f]/.test(p)||p.split('/').some(k=>!k||k==='.'||k==='..'))fail('UNSAFE_PATH');
  const f=path.join(root,p);
  if(!(fs.realpathSync(f)+path.sep).startsWith(fs.realpathSync(root)+path.sep))fail('SYMLINK_OUTSIDE_ROOT');
  return f;
}
function bank(bytes){const c={window:{},console:{log(){},warn(){},error(){}}};c.globalThis=c;vm.createContext(c,{codeGeneration:{strings:false,wasm:false}});vm.runInContext(bytes.toString(),c,{timeout:1500});const b=c.window.questionBank||c.window.questions||c.questionBank||c.questions||c.window.examData?.questions;if(!Array.isArray(b))fail('SOURCE_SCHEMA');return JSON.parse(JSON.stringify(b));}
export function verifyRegisteredRendererContinuity(root,relative){
  const doc=JSON.parse(fs.readFileSync(safe(root,relative)));
  if(!exact(doc,['schemaVersion','scope','sourceArchiveFile','questionUid','sourceOrdinal','sourceQuestionNo','sourceDisplayNumber','compactRef','compactItemSha256','dictionaryRef','currentSourceRef','receiptRef','rendererBindingRef','independentReviewRef','newFourSlotApprovals','newMathematicalQa'])||
    doc.schemaVersion!=='archive-four-slot-registered-renderer-continuity-v1'||doc.scope!=='EXISTING_VECTOR_ONLY'||doc.newFourSlotApprovals!==0||doc.newMathematicalQa!==false)fail('CLOSED_CONTINUITY_SCOPE');
  const read=ref=>{if(!exact(ref,['path','sha256'])||!/^[a-f0-9]{64}$/.test(ref.sha256))fail('EXACT_FILE_REF_REQUIRED');const b=fs.readFileSync(safe(root,ref.path));if(sha(b)!==ref.sha256)fail('BOUND_FILE_CHANGED:'+ref.path);return b;};
  const compact=JSON.parse(read(doc.compactRef));
  if(doc.compactRef.path!=='archive/data/item-4slot/'+doc.sourceArchiveFile.replace(/\.js$/,'.4slot.json')||compact.sourceArchiveFile!==doc.sourceArchiveFile)fail('COMPACT_SOURCE_MISMATCH');
  const items=compact.items?.filter(it=>it.ordinal===doc.sourceDisplayNumber);
  if(items?.length!==1||sha(stable(items[0]))!==doc.compactItemSha256||Object.hasOwn(items[0],'registrationHold'))fail('EXACT_UNHELD_VECTOR_REQUIRED');
  const dict=JSON.parse(read(doc.dictionaryRef));
  if(!/^docs\/architecture\/4slot\/term-dictionary-v[0-9.]+\.json$/.test(doc.dictionaryRef.path)||dict.dictionaryVersion!==compact.dictionaryVersion)fail('DICTIONARY_MISMATCH');
  if(!exact(doc.currentSourceRef,['path','sha256','gitBlobSha1'])||doc.currentSourceRef.path!=='archive/exams/'+doc.sourceArchiveFile)fail('SOURCE_REF_MISMATCH');
  const bytes=fs.readFileSync(safe(root,doc.currentSourceRef.path));
  if(sha(bytes)!==doc.currentSourceRef.sha256||blob(bytes)!==doc.currentSourceRef.gitBlobSha1)fail('CURRENT_SOURCE_CHANGED');
  const currentBank=bank(bytes),q=currentBank[doc.sourceOrdinal-1];
  if(!q||sourceNumber(q)!==doc.sourceDisplayNumber||sourceIdentityNumber(q)!==doc.sourceQuestionNo)fail('SOURCE_NUMBER_MISMATCH');
  if(!/^[a-f0-9]{40}$/.test(compact.sourceGitBlobSha))fail('HISTORICAL_COMPACT_BLOB_REQUIRED');
  const oldBytes=execFileSync('git',['-C',root,'cat-file','blob',compact.sourceGitBlobSha],{maxBuffer:32*1024*1024,timeout:15000,stdio:['ignore','pipe','pipe']});
  if(blob(oldBytes)!==compact.sourceGitBlobSha)fail('HISTORICAL_BLOB_MISMATCH');
  const oldBank=bank(oldBytes),old=oldBank[doc.sourceOrdinal-1];
  if(oldBank.length!==currentBank.length||!old||sourceNumber(old)!==doc.sourceDisplayNumber||sourceIdentityNumber(old)!==doc.sourceQuestionNo)fail('HISTORICAL_SOURCE_IDENTITY_MISMATCH');
  const receipt=JSON.parse(read(doc.receiptRef));
  if(doc.receiptRef.path!==`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${receipt.requestId}.json`||receipt.sourceArchiveFile!==doc.sourceArchiveFile||receipt.sourceBlobSha1!==doc.currentSourceRef.gitBlobSha1||receipt.sourceRawSha256!==doc.currentSourceRef.sha256)fail('OFFICIAL_RECEIPT_SOURCE_MISMATCH');
  if(doc.rendererBindingRef.path!==doc.receiptRef.path.replace(/\.json$/,'.renderer-binding.json'))fail('RENDERER_BINDING_PATH_MISMATCH');
  read(doc.rendererBindingRef);read(doc.independentReviewRef);
  const repairs=receipt.fingerprintRepairs?.filter(r=>r.questionUid===doc.questionUid&&r.sourceOrdinal===doc.sourceOrdinal);
  if(repairs?.length!==1||!equal(repairs[0].sourceReview?.rendererContinuity?.independentReviewRef,doc.independentReviewRef))fail('SELECTED_RENDERER_PROOF_REQUIRED');
  const select=(rows,name)=>{const found=rows?.filter(r=>r.questionUid===doc.questionUid);if(found?.length!==1||found[0].sourceOrdinal!==doc.sourceOrdinal||found[0].sourceArchiveFile!==doc.sourceArchiveFile)fail(name+'_UID_MISMATCH');return found[0];};
  const identity=select(JSON.parse(fs.readFileSync(safe(root,'archive/data/question_identity_map.json'))).records,'IDENTITY');
  const metadata=select(JSON.parse(fs.readFileSync(safe(root,'archive/data/question_metadata.json'))).records,'METADATA');
  const applied=select(receipt.appliedRecords,'RECEIPT'),issuedRuntime=select(receipt.runtimeRecords,'RUNTIME');
  if(metadata.metadataApprovalType!=='FINAL_QA'||!String(metadata.metadataStatus||'').startsWith('approved_')||metadata.metaFoundationStatus!=='ACTIVE')fail('CURRENT_SEMANTIC_APPROVAL_REQUIRED');
  for(const [key,value]of Object.entries(applied))if(!equal(metadata[key],value))fail('REGISTERED_METADATA_DRIFT:'+key);
  const registry=loadActiveMetaRegistry(root);
  const validation=validateActiveMetaFields(metadata,registry,{requireFields:true});
  if(registry.status!=='ACTIVE'||validation.status!=='VALIDATED')fail('CURRENT_ACTIVE_BINDING_REQUIRED:'+JSON.stringify({registryErrors:registry.errors,fieldErrors:validation.errors}));
  const runtimeMatches=[];
  const runtimeDir=safe(root,'archive/data/meta-foundation/runtime');
  for(const name of fs.readdirSync(runtimeDir).filter(n=>n.endsWith('.json'))){
    const container=JSON.parse(fs.readFileSync(safe(root,'archive/data/meta-foundation/runtime/'+name)));
    for(const row of container.records||[])if(row.questionUid===doc.questionUid)runtimeMatches.push({container,row});
  }
  if(runtimeMatches.length!==1||runtimeMatches[0].container.status!=='ACTIVE'||runtimeMatches[0].container.packId!==metadata.metaFoundationPackId)fail('CURRENT_RUNTIME_OWNER_REQUIRED');
  const runtime=select([runtimeMatches[0].row],'CURRENT_RUNTIME');
  for(const [key,value]of Object.entries(issuedRuntime))if(!equal(runtime[key],value))fail('CURRENT_RUNTIME_DRIFT:'+key);
  if(!nativeReviewedRendererRebind(receipt,{root,bytes,blobSha1:blob(bytes),bank:currentBank,runtimeRecord:runtime},old,q,identity,doc.sourceOrdinal,metadata,registry))fail('NATIVE_RENDERER_REUSE_NOT_ESTABLISHED');
  return {status:'PASS',questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,sourceBinding:'REGISTERED_RENDERER_CONTINUITY',independentReviewClaim:false,newFourSlotApprovals:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{console.log(JSON.stringify(verifyRegisteredRendererContinuity(path.resolve(process.argv[2]),process.argv[3])));}catch(e){console.error(e.message);process.exitCode=1;}
}
