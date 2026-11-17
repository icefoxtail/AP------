'use strict';
// A named negative authority. This module never supplies a slot, metadata value,
// fingerprint repair, positive receipt, or a replacement for contradictory print.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {compactItem}=require('./import-4slot.cjs');
const {buildLookup}=require('./validate-4slot.cjs');
const {sourceNumber,sourceIdentityNumber}=require('./exam-items.cjs');
const UID='qid_v1_19094807547ac6f15acca37931be797fce40c7b0e4344e1c5a6e2223ca2bbc54';
const SOURCE='original/middle/m2/1final/22_매산중_1학기_기말_중2_수학.js';
const ORDINAL=18,COUNT=24;
const LEDGER='archive/data/meta-foundation/m2s1-e034-original-source-hold-v1.json';
const MODULE='tools/4slot/original-source-error-hold.cjs';
const MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const INDEX='archive/data/item-4slot-index.json';
const COMPACT='archive/data/item-4slot/'+SOURCE.replace(/\.js$/,'.4slot.json');
const SCHEMA='archive-original-registered-vector-source-hold-v1';
const SCOPE='EXACT_M2S1_E034_Q18_ORIGINAL_CONTRADICTION_REJECT_PRIOR_VECTOR_REUSE';
const REASON='ORIGINAL_SOURCE_CONTRADICTION_UNRESOLVED';
const DECISION='WITHHOLD_SOURCE_CONDITION_AND_SUSPEND_EXISTING_VECTOR_REUSE';
const REVIEW_SCHEMA='archive-independent-original-source-negative-review-v1';
const GIVEN_SCHEMA='archive-independent-original-given-observation-v1';
const RELEASE='EXPLICIT_VERIFIED_SOURCE_CORRECTION_REQUIRED';
const VECTOR=['format','given','goal','method','condition','candidates'];
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const eq=(a,b)=>stable(a)===stable(b),object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const fail=code=>{throw Error('ORIGINAL_SOURCE_ERROR_HOLD:'+code);};
const need=(v,code)=>{if(!v)fail(code);};
function exact(v,keys,code){need(object(v)&&eq(Object.keys(v).sort(),keys.slice().sort()),code+'_KEYS');}
function safe(p){need(typeof p==='string'&&p===p.normalize('NFC')&&!/[\\\x00-\x1f\x7f]/.test(p)&&!p.startsWith('/')&&!p.split('/').some(v=>!v||v==='.'||v==='..'||v==='.git'),'PATH');return p;}
function git(root,args){try{return execFileSync('git',['-C',root,...args],{env:{...process.env,GIT_NO_LAZY_FETCH:'1'},maxBuffer:160*1024*1024,timeout:30000,stdio:['ignore','pipe','pipe']});}catch{fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE');}}
function local(root,p){const base=fs.realpathSync(root),full=path.resolve(base,safe(p));need(fs.existsSync(full)&&fs.realpathSync(full)===full&&fs.statSync(full).isFile()&&full.startsWith(base+path.sep),'LIVE_FILE');return fs.readFileSync(full);}
function makeReader(root){const observed=new Map(),cache=new Map();return {observed,
  local(p){const b=local(root,p);observed.set(p,sha(b));return b;},
  read(r,live=false){exact(r,['commit','path','gitBlobSha1','sha256','bytes'],'REF');safe(r.path);
    need(/^[a-f0-9]{40}$/.test(r.commit)&&/^[a-f0-9]{40}$/.test(r.gitBlobSha1)&&/^[a-f0-9]{64}$/.test(r.sha256)&&Number.isSafeInteger(r.bytes)&&r.bytes>0,'REF');
    const key=stable(r);let b=cache.get(key);if(!b){need(git(root,['rev-parse',r.commit+':'+r.path]).toString().trim()===r.gitBlobSha1,'GIT_REF');b=git(root,['cat-file','blob',r.gitBlobSha1]);need(b.length===r.bytes&&sha(b)===r.sha256&&blob(b)===r.gitBlobSha1,'REF_BYTES');cache.set(key,b);}
    if(live)need(this.local(r.path).equals(b),'LIVE_BYTES_CHANGED');return b;},
  json(r,live=false){try{return JSON.parse(this.read(r,live));}catch(e){if(e.message.startsWith('ORIGINAL_SOURCE_ERROR_HOLD:'))throw e;fail('JSON');}}
};}
function loadBank(bytes){const c={window:{},console:{log(){},warn(){},error(){}}};vm.createContext(c,{codeGeneration:{strings:false,wasm:false}});vm.runInContext(bytes.toString(),c,{timeout:2000});const b=c.window.questionBank||c.window.questions||c.questionBank||c.questions||c.window.examData?.questions;need(Array.isArray(b)&&b.length===COUNT,'BANK_DENOMINATOR');return JSON.parse(JSON.stringify(b));}
const vector=q=>Object.fromEntries(VECTOR.map(k=>[k,q[k]]));
function one(rows,predicate,code){const found=(rows||[]).filter(predicate);need(found.length===1,code);return found[0];}
const identityHash=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const tuple=r=>[r.questionUid,r.sourceOrdinal,String(r.sourceQuestionNo),own(r,'status')?{present:true,value:r.status}:{present:false}];
function assetPaths(value){const text=(typeof value==='string'?value:JSON.stringify(value)).replaceAll('\\/','/');return [...new Set([...text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi)].map(m=>m[0].startsWith('archive/')?m[0]:'archive/'+m[0]))].sort();}
function nestedAssets(bytes,p){const s=bytes.toString();need(!/<script\b|@import\b|\bon[a-z]+\s*=/i.test(s),'SVG_ACTIVE_DEPENDENCY');const values=[...s.matchAll(/(?:xlink:)?href\s*=\s*['"]([^'"]+)['"]|url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/gi)].map(m=>m[1]||m[2]);return values.filter(v=>!v.startsWith('#')).map(v=>{need(!/^[a-z][a-z0-9+.-]*:|[?#\\]/i.test(v),'SVG_EXTERNAL_DEPENDENCY');const rel=v.startsWith('archive/assets/')?v:v.startsWith('assets/')?'archive/'+v:path.posix.normalize(path.posix.join(path.posix.dirname(p),v));safe(rel);need(rel.startsWith('archive/assets/')&&/\.(?:png|jpe?g|gif|webp|svg)$/i.test(rel),'SVG_DEPENDENCY_PATH');return rel;});}
function inventory(reader,refs,q,commit,live){need(Array.isArray(refs)&&refs.length>0,'ASSET_INVENTORY');const pending=assetPaths(q),seen=new Set(),map=new Map(refs.map(r=>[r.path,r]));need(map.size===refs.length,'ASSET_DUPLICATE');while(pending.length){const p=pending.shift();if(seen.has(p))continue;seen.add(p);const r=map.get(p);need(r&&r.commit===commit,'ASSET_MISSING_OR_COMMIT');const b=reader.read(r,live);if(p.endsWith('.svg'))pending.push(...nestedAssets(b,p));}need(eq([...seen].sort(),refs.map(r=>r.path).sort()),'ASSET_EXACT_INVENTORY');}
function isSubject({questionUid,source,sourceArchiveFile,ordinal,sourceOrdinal}={}){return questionUid===UID||(source??sourceArchiveFile)===SOURCE&&Number(ordinal??sourceOrdinal)===ORDINAL;}
function assertNotSubject(context){if(isSubject(context))fail('EXPLICIT_SOURCE_RESOLUTION_REQUIRED');}
function relevant(root,identity){return fs.existsSync(path.join(root,'archive/exams/'+SOURCE))||fs.existsSync(path.join(root,LEDGER))||(identity?.records||[]).some(r=>isSubject(r));}
function proofBinding(doc){const {reviewRef,...binding}=doc;return sha(stable(binding));}

function verify(root,{identity,metadata}={}){
  const reader=makeReader(root),raw=reader.local(LEDGER);let d;try{d=JSON.parse(raw);}catch{fail('LEDGER_JSON');}
  exact(d,['schemaVersion','scope','status','questionUid','sourceArchiveFile','sourceOrdinal','sourceQuestionNo','expectedQuestionCount',
    'currentSourceRef','priorSourceRef','nativeSourceRef','currentCompactRef','priorCompactRef','priorIndexRef','nativeRef','dictionaryRef',
    'metadataRef','identityRef','currentQuestionSha256','priorQuestionSha256','nativeQuestionSha256','priorIndexRowSha256',
    'vectorSha256','metadataRowSha256','identityRowSha256','identityInventorySha256','currentAssets','priorAssets','reviewRef',
    'releasePolicy','newMathQa','newSemanticApproval','newFourSlotVector'],'LEDGER');
  need(d.schemaVersion===SCHEMA&&d.scope===SCOPE&&d.status==='HOLD'&&d.questionUid===UID&&d.sourceArchiveFile===SOURCE&&d.sourceOrdinal===ORDINAL&&d.expectedQuestionCount===COUNT&&d.sourceQuestionNo==='18'&&d.releasePolicy===RELEASE&&d.newMathQa===0&&d.newSemanticApproval===0&&d.newFourSlotVector===0,'EXACT_NAMED_SCOPE');
  for(const k of ['currentQuestionSha256','priorQuestionSha256','nativeQuestionSha256','priorIndexRowSha256','vectorSha256','metadataRowSha256','identityRowSha256','identityInventorySha256'])need(/^[a-f0-9]{64}$/.test(d[k]),'BOUND_HASH');
  for(const r of [d.currentSourceRef,d.priorSourceRef,d.nativeSourceRef])need(r?.path==='archive/exams/'+SOURCE,'SOURCE_PATH');
  need(d.priorIndexRef?.path===INDEX&&d.currentCompactRef?.path===COMPACT&&d.priorCompactRef?.path===COMPACT&&d.metadataRef?.path===MD&&d.identityRef?.path===ID&&/^docs\/architecture\/4slot\/term-dictionary-v[0-9.]+\.json$/.test(d.dictionaryRef?.path||''),'AUTHORITY_PATH');
  need([d.priorSourceRef,d.priorCompactRef].every(r=>r.commit===d.priorIndexRef.commit),'PRIOR_SNAPSHOT');
  const current=loadBank(reader.read(d.currentSourceRef,true)),prior=loadBank(reader.read(d.priorSourceRef)),nativeBank=loadBank(reader.read(d.nativeSourceRef));
  for(const bank of [current,prior,nativeBank])need(new Set(bank.map(sourceNumber)).size===COUNT&&bank.every((q,i)=>sourceNumber(q)===i+1),'BANK_NUMBER_INVENTORY');
  const q=current[ORDINAL-1],p=prior[ORDINAL-1],n=nativeBank[ORDINAL-1];
  need(sourceIdentityNumber(q)===d.sourceQuestionNo&&sha(stable(q))===d.currentQuestionSha256&&sha(stable(p))===d.priorQuestionSha256&&sha(stable(n))===d.nativeQuestionSha256&&eq(n,p),'QUESTION_BINDING');
  const compact=reader.json(d.currentCompactRef,true),priorCompact=reader.json(d.priorCompactRef),index=reader.json(d.priorIndexRef),native=reader.json(d.nativeRef),dict=reader.json(d.dictionaryRef,true);
  need(eq(compact,priorCompact)&&compact.schemaVersion==='archive-meta-4slot-compact-v1'&&compact.sourceArchiveFile===SOURCE&&compact.items?.length===COUNT&&!own(compact,'scope')&&!compact.items.some(it=>own(it,'registrationHold')),'COMPACT_UNCHANGED');
  need(index.schemaVersion==='archive-item-4slot-runtime-v1'&&index.authority==='MAIN_MERGED_REVIEWED_COMPACT'&&index.sourceMutation===0&&index.semanticApprovalMutation===0,'PRIOR_INDEX');
  const old=one(index.records,r=>r.questionUid===UID,'PRIOR_REGISTERED_ROW'),file=one(index.files,f=>f.path===COMPACT,'PRIOR_REGISTERED_FILE'),it=one(compact.items,it=>it.ordinal===ORDINAL,'COMPACT_ITEM');
  need(old.registrationStatus==='REGISTERED'&&old.independentReviewClaim===false&&old.sourceArchiveFile===SOURCE&&old.sourceOrdinal===ORDINAL&&old.sourceQuestionNo==='18'&&old.sourceDisplayNumber===ORDINAL&&old.compactPath===COMPACT&&eq(vector(old),vector(it))&&sha(stable(old))===d.priorIndexRowSha256&&sha(stable(vector(it)))===d.vectorSha256,'PRIOR_VECTOR');
  need(file.currentSourceBlobSha===d.priorSourceRef.gitBlobSha1&&file.compactSha256===d.priorCompactRef.sha256&&file.itemCount===COUNT&&file.dictionarySha256===d.dictionaryRef.sha256&&!(index.pending||[]).some(r=>r.path===COMPACT&&(r.ordinal==null||r.ordinal===ORDINAL)),'PRIOR_FILE');
  need(native.schemaVersion==='archive-meta-4slot-v0'&&native.sourceArchiveFile===SOURCE&&native.sourceGitBlobSha===d.nativeSourceRef.gitBlobSha1&&native.sourceGitBlobSha===compact.sourceGitBlobSha&&native.dictionaryVersion===compact.dictionaryVersion&&dict.dictionaryVersion===compact.dictionaryVersion&&old.dictionaryVersion===compact.dictionaryVersion&&native.items?.length===COUNT&&compact.evidence?.commit===d.nativeRef.commit&&compact.evidence?.path===d.nativeRef.path&&eq(compact.evidence,file.evidence)&&eq(compact.reviewedBy,file.reviewedBy),'NATIVE_BINDING');
  const lut=buildLookup(dict);for(const term of dict.terms)lut.set('#'+term.id,term);const lookup=new Map(nativeBank.map(q=>[String(sourceNumber(q)),{ordinal:sourceNumber(q)}]));const seen=new Set();
  for(const item of native.items){const ordinal=Number(item.sourceOrdinal);need(!seen.has(ordinal),'NATIVE_DUPLICATE');seen.add(ordinal);const ci=one(compact.items,x=>x.ordinal===ordinal,'NATIVE_COMPLETE_VECTOR');need(eq(vector(compactItem(item,lut,lookup)),vector(ci)),'NATIVE_DICTIONARY_VECTOR');}
  const issuedMd=reader.json(d.metadataRef),issuedId=reader.json(d.identityRef);const liveMd=JSON.parse(reader.local(MD)),liveId=JSON.parse(reader.local(ID));
  if(metadata)need(eq(metadata,liveMd),'PASSED_METADATA_CHANGED');if(identity)need(eq(identity,liveId),'PASSED_IDENTITY_CHANGED');
  const md=one(liveMd.records,r=>r.questionUid===UID||r.sourceArchiveFile===SOURCE&&r.sourceOrdinal===ORDINAL,'CURRENT_METADATA_ROW'),id=one(liveId.records,r=>r.questionUid===UID||r.sourceArchiveFile===SOURCE&&r.sourceOrdinal===ORDINAL,'CURRENT_IDENTITY_ROW');
  need(md.questionUid===UID&&id.questionUid===UID&&md.sourceArchiveFile===SOURCE&&id.sourceArchiveFile===SOURCE&&md.sourceOrdinal===ORDINAL&&id.sourceOrdinal===ORDINAL&&eq(md,one(issuedMd.records,r=>r.questionUid===UID,'ISSUED_METADATA_ROW'))&&eq(id,one(issuedId.records,r=>r.questionUid===UID,'ISSUED_IDENTITY_ROW'))&&sha(stable(md))===d.metadataRowSha256&&sha(stable(id))===d.identityRowSha256,'WHOLE_METADATA_IDENTITY');
  need(!own(md,'metadataApprovalType')&&md.metadataStatus==='registration_pending_semantic_review'&&md.reviewStatus==='review_required'&&md.problemTypeKey===''&&md.templateKey==='','PENDING_AUTHORITY_REQUIRED');
  const ids=liveId.records.filter(r=>r.sourceArchiveFile===SOURCE).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal),oldIds=issuedId.records.filter(r=>r.sourceArchiveFile===SOURCE).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
  need(ids.length===COUNT&&eq(ids.map(tuple),oldIds.map(tuple))&&sha(stable(ids.map(tuple)))===d.identityInventorySha256&&ids.every((r,i)=>r.sourceOrdinal===i+1&&(!own(r,'status')||r.status==='VERIFIED')&&String(r.sourceQuestionNo)===sourceIdentityNumber(current[i])&&liveId.records.filter(x=>x.questionUid===r.questionUid).length===1),'FULL_UID_INVENTORY');
  need(one(native.items,r=>Number(r.sourceOrdinal)===ORDINAL,'NATIVE_TARGET').questionUid===UID,'NATIVE_UID');
  inventory(reader,d.currentAssets,q,d.currentSourceRef.commit,true);inventory(reader,d.priorAssets,p,d.priorSourceRef.commit,false);
  const review=reader.json(d.reviewRef,true);exact(review,['schemaVersion','decisionId','reviewer','decision','scope','bindingSha256','independentGiven','originalGivenCrop','observedAtUtc','observedOriginalContradiction','thirdChoiceObservable','noInferredReconstruction','newMathQa','newSemanticApproval','newFourSlotVector'],'ROOT_REVIEW');
  need(review.schemaVersion===REVIEW_SCHEMA&&review.decisionId==='m2s1-e034-q18-original-contradiction-root-20261116'&&review.reviewer==='GPT_ROOT_C8F1B0BFB4FA'&&review.decision===DECISION&&review.scope===SCOPE&&review.bindingSha256===proofBinding(d)&&review.observedOriginalContradiction===true&&review.thirdChoiceObservable===false&&review.noInferredReconstruction===true&&review.newMathQa===0&&review.newSemanticApproval===0&&review.newFourSlotVector===0&&typeof review.observedAtUtc==='string'&&Number.isFinite(Date.parse(review.observedAtUtc)),'ROOT_DECISION');
  for(const r of [review.independentGiven,review.originalGivenCrop])exact(r,['path','gitBlobSha1','sha256','bytes'],'REVIEW_LOCAL_REF');
  const given=reader.json({commit:d.reviewRef.commit,...review.independentGiven},true);exact(given,['schemaVersion','reviewer','questionUid','sourceArchiveFile','sourceOrdinal','expectedQuestionCount','sourcePdfSha256','givenCropSha256','originalContradiction','thirdChoiceObservable','observationSha256','newMathQa','newSemanticApproval'],'INDEPENDENT_GIVEN');
  need(given.schemaVersion===GIVEN_SCHEMA&&given.reviewer==='GPT_CHILD_M2S1_GIVEN3_20261116'&&given.questionUid===UID&&given.sourceArchiveFile===SOURCE&&given.sourceOrdinal===ORDINAL&&given.expectedQuestionCount===COUNT&&given.originalContradiction===true&&given.thirdChoiceObservable===false&&given.newMathQa===0&&given.newSemanticApproval===0&&/^[a-f0-9]{64}$/.test(given.sourcePdfSha256)&&/^[a-f0-9]{64}$/.test(given.observationSha256)&&given.givenCropSha256===review.originalGivenCrop.sha256,'INDEPENDENT_DECISION');
  need(/^docs\/operations\/[^\s]+\/[^\s]+\.json$/.test(d.reviewRef.path)&&review.independentGiven.path.startsWith(path.posix.dirname(d.reviewRef.path)+'/')&&review.originalGivenCrop.path.startsWith(path.posix.dirname(d.reviewRef.path)+'/')&&/\.png$/.test(review.originalGivenCrop.path),'EVIDENCE_SCOPE');
  reader.read({commit:d.reviewRef.commit,...review.originalGivenCrop},true);
  return {questionUid:UID,sourceArchiveFile:SOURCE,sourceOrdinal:ORDINAL,sourceFingerprint:identityHash(q),reason:REASON,
    negativeOnly:true,metadataRowSha256:d.metadataRowSha256,identityRowSha256:d.identityRowSha256,observed:[...reader.observed],
    projection:{schemaVersion:SCHEMA,scope:SCOPE,status:'HOLD',reasonCode:REASON,ledgerPath:LEDGER,ledgerSha256:sha(raw),reviewRef:d.reviewRef,sourceBlobSha1:d.currentSourceRef.gitBlobSha1,releasePolicy:RELEASE,newMathQa:0,newSemanticApproval:0,newFourSlotVector:0}};
}
function dependencyPaths(root){if(!relevant(root))return [MODULE];const d=JSON.parse(local(root,LEDGER));const refs=[d.currentSourceRef,d.currentCompactRef,d.dictionaryRef,d.reviewRef,...(d.currentAssets||[])];const review=JSON.parse(local(root,d.reviewRef.path));return [...new Set([MODULE,LEDGER,MD,ID,...refs.map(r=>safe(r.path)),safe(review.independentGiven.path),safe(review.originalGivenCrop.path)])].sort();}
module.exports={UID,SOURCE,ORDINAL,COUNT,LEDGER,MODULE,MD,ID,INDEX,COMPACT,SCHEMA,SCOPE,REASON,DECISION,REVIEW_SCHEMA,GIVEN_SCHEMA,RELEASE,
  isSubject,assertNotSubject,relevant,verify,dependencyPaths,proofBinding,stable,sha,blob,vector,tuple,assetPaths};
