import {M2_P21_CURRENT_EIGHT_SCHEMA,M2_P21_CURRENT_EIGHT_BINDING_REF,M2_P21_CURRENT_EIGHT_ITEMS} from '../../archive/tools/meta-foundation/m2-problem21-current-ui-continuity.mjs';
import {nativeReviewedM2Problem21Rebind} from '../../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs';
import {M2_PROBLEM21_DERIVED_SVG8_ITEMS,M2_PROBLEM21_CONTINUITY_SCHEMA} from '../../archive/tools/meta-foundation/reviewed-m2-problem21-continuity.mjs';
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

// This separate source-review lane carries only the existing vectors for the
// eight already issued, independently accepted M2 problem-image repairs.
// It neither manufactures semantic approval nor broadens the renderer lane.
const M2_SOURCE_REVIEW_SCHEMA = 'archive-four-slot-registered-m2-problem21-continuity-v1';
const M2_SOURCE_REVIEW_PROFILES = Object.freeze([
  {
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "compactRef": {
      "path": "archive/data/item-4slot/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.4slot.json",
      "sha256": "404a4ba2483b81e5c10954915ac144d2fd09e37838a854b00ac13e5c9f7a9758"
    },
    "historicalSourceBlob": "41e074035e7ab7558bc1ae89820a2a60ebe3c806",
    "receiptRef": {
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.json",
      "sha256": "a2a9804f48bd3d9befc9ad54f34edbf0cc11fb23fa4c4949b34b7ab732a28a6d"
    },
    "sourceReviewBindingRef": {
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.source-review-binding.json",
      "sha256": "1d48370a6339bfcb4086640c04216a6260fe45c91f1d4411c6881cf1affa0eb0"
    },
    "dictionaryVersion": "term-dict-v1.5-2026-11-04"
  },
  {
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "compactRef": {
      "path": "archive/data/item-4slot/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.4slot.json",
      "sha256": "bbfe5bc5344c691067eb609b5c860ba3990a73e77efda094004a8c87553c4502"
    },
    "historicalSourceBlob": "f0cd94780d1f2c277bad52142cfa20cb932e0e96",
    "receiptRef": {
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e023-public-private6-20261116.json",
      "sha256": "3c34d1cd787b689103701d6ed7d8ff66eab11cbdd1d4b86de05152d92d9f12f4"
    },
    "sourceReviewBindingRef": {
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e023-public-private6-20261116.source-review-binding.json",
      "sha256": "4003bdf807260f13666029f6fc3f7fb8f4f63ef87ec935c424f95f929483edad"
    },
    "dictionaryVersion": "term-dict-v1.5-2026-11-04"
  }
].map(row=>Object.freeze(row)));
const M2_COMPACT_ITEM_SHA256 = Object.freeze({
  "qid_v1_aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b": "a53ddb07d855018f2b61bbd23a06bbaa94b77e6d101c1265e2ebc3d1a71d38f4",
  "qid_v1_ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490": "a0d74d9efb8e237d6fa13a538eb388037c5a39ae5121ed806c70d70e7e612cf7",
  "qid_v1_7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad": "534245e7faa114329ded310dbd3fd92994529014f06fd10a75081722fefcea20",
  "qid_v1_e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67": "774d72fea6c5ae85e4f147834312b8c37600a525e67512713ef89e4c099b2b27",
  "qid_v1_ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7": "95aa6002b8e8c5b46c47b3b1d9c39baeca3de6ebd83d5a19a6ea6bc1f79bdaef",
  "qid_v1_59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472": "0cbeeb8b79d4ecc39fd20e26c78d8ea63b4089c45d996a0fcadc661d8b43cd6a",
  "qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758": "8dfc41538a239e0fba6ca4d2fd1b70412cd65968dbf0a314d94ea10d309f7063",
  "qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9": "5cde0e20e48a2a9fbe9318acea1f850cbb7f3b904895b0c9ca7ad72a60e71d56"
});
const M2_DICTIONARY_REF = Object.freeze({"path":"docs/architecture/4slot/term-dictionary-v1.5.json","sha256":"c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be"});
const M2_INDEPENDENT_REVIEW_REF = Object.freeze({"path":"docs/operations/m2-problem-image8-repair-20261116/independent-static-v2.json","sha256":"3dd0395907a7e047382619832af91e898ca740c7ed712764762ee8099eec7d89"});

function strictM2Path(root,relative){
  const full=safe(root,relative),base=fs.realpathSync(root);
  for(let cursor=full;cursor!==base;cursor=path.dirname(cursor)){
    if(cursor===path.dirname(cursor))fail('M2_PATH_OUTSIDE_ROOT');
    if(fs.lstatSync(cursor).isSymbolicLink())fail('M2_SYMLINK_PATH');
  }
  if(!fs.lstatSync(full).isFile())fail('M2_REGULAR_FILE_REQUIRED');
  return full;
}
function verifyM2Problem21Continuity(root,doc){
  root=fs.realpathSync(root);
  const currentUi=doc.schemaVersion===M2_P21_CURRENT_EIGHT_SCHEMA;
  if(!exact(doc,['schemaVersion','scope','sourceArchiveFile','questionUid','sourceOrdinal','sourceQuestionNo','sourceDisplayNumber',
      'compactRef','compactItemSha256','dictionaryRef','currentSourceRef','receiptRef','sourceReviewBindingRef','independentReviewRef',
      'newFourSlotApprovals','newMathematicalQa',...(currentUi?['currentUiBindingRef']:[])])||
      ![M2_SOURCE_REVIEW_SCHEMA,M2_P21_CURRENT_EIGHT_SCHEMA].includes(doc.schemaVersion)||
      doc.scope!=='EXISTING_VECTOR_ONLY'||doc.newFourSlotApprovals!==0||doc.newMathematicalQa!==false)fail('M2_CLOSED_CONTINUITY_SCOPE');
  const item=M2_PROBLEM21_DERIVED_SVG8_ITEMS.find(row=>row.questionUid===doc.questionUid);
  const profile=M2_SOURCE_REVIEW_PROFILES.find(row=>row.sourceArchiveFile===doc.sourceArchiveFile);
  const currentItem=currentUi?M2_P21_CURRENT_EIGHT_ITEMS.find(row=>row.questionUid===doc.questionUid):null;
  if(currentUi&&(!currentItem||currentItem.sourceArchiveFile!==doc.sourceArchiveFile||currentItem.sourceOrdinal!==doc.sourceOrdinal||
      !equal(doc.currentUiBindingRef,M2_P21_CURRENT_EIGHT_BINDING_REF)))fail('M2_EXACT_CURRENT_UI_BINDING_REQUIRED');
  if(!item||!profile||item.sourceArchiveFile!==doc.sourceArchiveFile||item.sourceOrdinal!==doc.sourceOrdinal||
      doc.sourceDisplayNumber!==item.sourceOrdinal||doc.sourceQuestionNo!==String(item.sourceOrdinal))fail('M2_EXACT_EIGHT_IDENTITY_REQUIRED');
  if(!equal(doc.compactRef,profile.compactRef)||!equal(doc.receiptRef,profile.receiptRef)||
      !equal(doc.sourceReviewBindingRef,profile.sourceReviewBindingRef)||!equal(doc.dictionaryRef,M2_DICTIONARY_REF)||
      !equal(doc.independentReviewRef,M2_INDEPENDENT_REVIEW_REF)||doc.compactItemSha256!==M2_COMPACT_ITEM_SHA256[item.questionUid])
    fail('M2_FROZEN_VECTOR_AND_ISSUED_REFS_REQUIRED');
  const read=ref=>{
    if(!exact(ref,['path','sha256'])||!/^[a-f0-9]{64}$/.test(ref.sha256))fail('M2_EXACT_FILE_REF_REQUIRED');
    const raw=fs.readFileSync(strictM2Path(root,ref.path));if(sha(raw)!==ref.sha256)fail('M2_BOUND_FILE_CHANGED:'+ref.path);return raw;
  };
  const compact=JSON.parse(read(doc.compactRef));
  if(doc.compactRef.path!=='archive/data/item-4slot/'+doc.sourceArchiveFile.replace(/\.js$/,'.4slot.json')||
      compact.sourceArchiveFile!==doc.sourceArchiveFile||compact.sourceGitBlobSha!==profile.historicalSourceBlob||
      compact.dictionaryVersion!==profile.dictionaryVersion)fail('M2_COMPACT_SOURCE_MISMATCH');
  const items=compact.items?.filter(row=>row.ordinal===doc.sourceDisplayNumber);
  if(items?.length!==1||Object.hasOwn(items[0],'registrationHold')||sha(stable(items[0]))!==doc.compactItemSha256)
    fail('M2_EXACT_UNHELD_VECTOR_REQUIRED');
  const dictionary=JSON.parse(read(doc.dictionaryRef));
  if(dictionary.dictionaryVersion!==compact.dictionaryVersion)fail('M2_DICTIONARY_MISMATCH');
  const sourcePin=currentUi?currentItem.currentSourceRef:{path:'archive/exams/'+item.sourceArchiveFile,
    gitBlobSha1:item.sourceGitBlobSha1,sha256:item.sourceSha256};
  if(!exact(doc.currentSourceRef,['path','sha256','gitBlobSha1'])||
      doc.currentSourceRef.path!==sourcePin.path||doc.currentSourceRef.gitBlobSha1!==sourcePin.gitBlobSha1||
      doc.currentSourceRef.sha256!==sourcePin.sha256)fail('M2_CURRENT_SOURCE_REF_REQUIRED');
  const bytes=fs.readFileSync(strictM2Path(root,doc.currentSourceRef.path));
  if(sha(bytes)!==sourcePin.sha256||blob(bytes)!==sourcePin.gitBlobSha1)fail('M2_CURRENT_SOURCE_CHANGED');
  const currentBank=bank(bytes),question=currentBank[doc.sourceOrdinal-1];
  if(currentBank.length!==(item.key.startsWith('E017-')?23:24)||!question||
      sourceNumber(question)!==doc.sourceDisplayNumber||sourceIdentityNumber(question)!==doc.sourceQuestionNo)
    fail('M2_SOURCE_NUMBER_MISMATCH');
  const oldBytes=execFileSync('git',['-C',root,'cat-file','blob',profile.historicalSourceBlob],{
    maxBuffer:32*1024*1024,timeout:15000,stdio:['ignore','pipe','pipe'],
    env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0'}});
  if(blob(oldBytes)!==profile.historicalSourceBlob)fail('M2_HISTORICAL_BLOB_MISMATCH');
  const oldBank=bank(oldBytes),previous=oldBank[doc.sourceOrdinal-1];
  if(oldBank.length!==currentBank.length||!previous||sourceNumber(previous)!==doc.sourceDisplayNumber||
      sourceIdentityNumber(previous)!==doc.sourceQuestionNo)fail('M2_HISTORICAL_SOURCE_IDENTITY_MISMATCH');
  const receipt=JSON.parse(read(doc.receiptRef));
  if(doc.receiptRef.path!=='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+receipt.requestId+'.json'||
      receipt.sourceArchiveFile!==item.sourceArchiveFile||receipt.sourceBlobSha1!==item.sourceGitBlobSha1||
      receipt.sourceRawSha256!==item.sourceSha256)fail('M2_OFFICIAL_RECEIPT_SOURCE_MISMATCH');
  if(doc.sourceReviewBindingRef.path!==doc.receiptRef.path.replace(/\.json$/,'.source-review-binding.json'))
    fail('M2_SOURCE_REVIEW_BINDING_PATH_MISMATCH');
  read(doc.sourceReviewBindingRef);read(doc.independentReviewRef);
  const repairs=receipt.fingerprintRepairs?.filter(row=>row.questionUid===item.questionUid&&row.sourceOrdinal===item.sourceOrdinal);
  const proof=repairs?.[0]?.sourceReview?.m2ProblemRenderer21Continuity;
  if(repairs?.length!==1||proof?.schemaVersion!==M2_PROBLEM21_CONTINUITY_SCHEMA||proof.questionUid!==item.questionUid||
      proof.sourceArchiveFile!==item.sourceArchiveFile||proof.sourceOrdinal!==item.sourceOrdinal||
      proof.requiresOrdinaryNativeValidation!==true||proof.memoryOnlyNormalization!==true||
      proof.newMathematicalQa!==false||proof.newMetadataApprovals!==0||proof.newDifficultyJudgments!==0||
      proof.newReview2Claims!==0||proof.sourceWrites!==0||proof.rendererWrites!==0)
    fail('M2_SELECTED_ISSUED_PROOF_REQUIRED');
  const select=(rows,name)=>{
    const found=rows?.filter(row=>row.questionUid===item.questionUid);
    if(found?.length!==1||found[0].sourceArchiveFile!==item.sourceArchiveFile||found[0].sourceOrdinal!==item.sourceOrdinal)
      fail('M2_'+name+'_UID_MISMATCH');
    return found[0];
  };
  const identityRows=JSON.parse(fs.readFileSync(strictM2Path(root,'archive/data/question_identity_map.json'))).records;
  const identityMap=new Map(),identityByJoin=new Map();
  for(const row of identityRows||[]){
    const join=stable([row.sourceArchiveFile,row.sourceOrdinal]);
    if(!row.questionUid||identityMap.has(row.questionUid)||identityByJoin.has(join))fail('M2_IDENTITY_NOT_UNIQUE');
    identityMap.set(row.questionUid,row);identityByJoin.set(join,row);
  }
  const identity=select(identityRows,'IDENTITY');
  const metadata=select(JSON.parse(fs.readFileSync(strictM2Path(root,'archive/data/question_metadata.json'))).records,'METADATA');
  const issued=select(receipt.appliedRecords,'RECEIPT'),issuedIdentity=select(receipt.appliedIdentityRecords,'ISSUED_IDENTITY');
  const issuedRuntime=select(receipt.runtimeRecords,'ISSUED_RUNTIME');
  if(metadata.metadataApprovalType!=='FINAL_QA'||!String(metadata.metadataStatus||'').startsWith('approved_')||
      metadata.metaFoundationStatus!=='ACTIVE')fail('M2_CURRENT_SEMANTIC_APPROVAL_REQUIRED');
  if(!equal(metadata,issued)||!equal(identity,issuedIdentity))fail('M2_REGISTERED_METADATA_OR_IDENTITY_DRIFT');
  const registry=loadActiveMetaRegistry(root);
  const validation=validateActiveMetaFields(metadata,registry,{requireFields:true});
  if(registry.status!=='ACTIVE'||validation.status!=='VALIDATED')fail('M2_CURRENT_ACTIVE_BINDING_REQUIRED');
  const matches=[],runtimeDir=safe(root,'archive/data/meta-foundation/runtime');
  for(const name of fs.readdirSync(runtimeDir).filter(name=>name.endsWith('.json'))){
    const container=JSON.parse(fs.readFileSync(strictM2Path(root,'archive/data/meta-foundation/runtime/'+name)));
    for(const row of container.records||[])if(row.questionUid===item.questionUid)matches.push({container,row});
  }
  if(matches.length!==1||matches[0].container.status!=='ACTIVE'||matches[0].container.packId!==metadata.metaFoundationPackId)
    fail('M2_CURRENT_RUNTIME_OWNER_REQUIRED');
  const runtime=select([matches[0].row],'CURRENT_RUNTIME');
  if(!equal(runtime,issuedRuntime))fail('M2_CURRENT_RUNTIME_DRIFT');
  const nativeSource={root,bytes,blobSha1:blob(bytes),bank:currentBank,runtimeRecord:runtime,
    runtimeStatus:matches[0].container.status,identityMap,identityByJoin};
  if(nativeReviewedM2Problem21Rebind(receipt,nativeSource,previous,question,identity,item.sourceOrdinal,metadata,registry)!==true)
    fail('M2_NATIVE_SOURCE_REUSE_NOT_ESTABLISHED');
  return {status:'PASS',questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,
    sourceBinding:'REGISTERED_M2_PROBLEM21_SOURCE_REVIEW_CONTINUITY',independentReviewClaim:false,newFourSlotApprovals:0};
}

export function verifyRegisteredRendererContinuity(root,relative){
  const doc=JSON.parse(fs.readFileSync(safe(root,relative)));
  if([M2_SOURCE_REVIEW_SCHEMA,M2_P21_CURRENT_EIGHT_SCHEMA].includes(doc.schemaVersion)){strictM2Path(root,relative);return verifyM2Problem21Continuity(root,doc);}
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
