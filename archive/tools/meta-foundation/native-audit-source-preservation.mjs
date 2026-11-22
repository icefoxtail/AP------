// Rebind only still-current members of an already issued FULL audit preservation.
// The original FULL audit and its reviewed difficulty intake are replayed intact.
import fs from 'node:fs';
import { META_FILE, questionMetadataBytesAt } from './question-metadata-format.mjs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

export const AUDIT_SOURCE_PRESERVATION_SCHEMA='archive-native-audit-source-preservation-v1';
export const AUDIT_SOURCE_BINDING_SCHEMA='archive-native-audit-source-binding-v1';
const LEGACY='archive-native-audit-preservation-v1';
// Keep the existing audited-sidecar authority family understood by catalog and
// parent projection; the subtype marker still makes failed reuse fail closed.
const REVISION_MARKER=':exam-meta_pipeline_audit-v2:source-only-v1:';
const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json';
const RUNTIME='archive/data/meta-foundation/runtime';
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const equal=(a,b)=>stable(a)===stable(b),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const fail=s=>{throw Error('audit source preservation: '+s);};
const immutable=new Map();
const historicalContexts=new Map();
function safe(root,rel){
 if(typeof rel!=='string'||!rel||path.isAbsolute(rel)||/[\\\x00-\x1f]/u.test(rel)||rel.split('/').some(p=>!p||p==='.'||p==='..'))fail('unsafe path');
 const full=path.resolve(root,rel),base=path.resolve(root);for(let p=full;p!==base;p=path.dirname(p))if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())fail('symlink input');return full;
}
function git(root,commit,rel){
 safe(root,rel);if(!/^[a-f0-9]{40}$/.test(commit||''))fail('exact public prior commit required');
 const key=path.resolve(root)+':'+commit+':'+rel;
 if(!immutable.has(key)){
  const run=args=>execFileSync('git',args,{cwd:root,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},maxBuffer:192*1024*1024,stdio:['ignore','pipe','pipe']});
  try{if(run(['rev-parse','--verify',commit+'^{commit}']).toString().trim()!==commit)fail('prior commit mismatch');
   const entry=run(['ls-tree','-z',commit,'--',rel]).toString();if(!/^100(?:644|755) blob [a-f0-9]{40}\t[^\0]+\0$/u.test(entry)||entry.slice(entry.indexOf('\t')+1,-1)!==rel)fail('immutable regular file required');
   const bytes=run(['show',commit+':'+rel]);
   if(blob(bytes)!==entry.slice(0,entry.indexOf('\t')).split(' ')[2])fail('immutable Git blob bytes mismatch');
   immutable.set(key,bytes);
  }catch(error){fail('immutable Git input unavailable: '+rel+': '+error.message);}
 }
 return immutable.get(key);
}
function gitJson(root,commit,rel){
 const value=JSON.parse(rel===META_FILE?questionMetadataBytesAt(root,commit).toString('utf8'):git(root,commit,rel));
 // The complete public document is parsed and checked once, but only the
 // immutable selected-row result survives in historicalContexts. Do not retain
 // another whole-bank metadata/identity copy beside the live Consumer catalog.
 immutable.delete(path.resolve(root)+':'+commit+':'+rel);
 return value;
}
function publicRuntimeRows(root,commit,records){
 const packs=new Set([...records.values()].map(r=>r.metaFoundationPackId)),rows=[];
 for(const pack of packs){
  if(!/^[A-Z][A-Z0-9_]*$/u.test(pack||''))fail('invalid prior runtime owner');
  const rel=RUNTIME+'/'+pack.toLowerCase().replaceAll('_','-')+'-v1.json';
  const published=gitJson(root,commit,rel);
  if(published.packId!==pack||published.status!=='ACTIVE'||!Array.isArray(published.records))fail('public runtime pack mismatch');
  rows.push(...published.records);
 }
 return unique(rows,'questionUid','public runtime UID');
}
function originalEvidence(root,commit,receipt,request){
 for(const refs of [request.approval.evidenceRefs,...request.items.map(i=>i.evidenceRefs)]){
  if(!Array.isArray(refs)||!refs.length)fail('original request evidence missing');
  for(const ref of refs){
   if(!ref||!equal(Object.keys(ref).sort(),['path','sha256'])||!/^[a-f0-9]{64}$/.test(ref.sha256||''))fail('original request evidence invalid');
   let bytes;
   try{bytes=git(root,commit,ref.path);}catch(error){
    const sealed=receipt.auditPreservation?.difficultyRequestSnapshot;
    if(!equal(ref,request.approval.sourceRebind?.difficultyRequestRef)||!ref.path.startsWith('.archive-meta-register/inbox/')||sealed?.path!==ref.path||sealed.sha256!==ref.sha256||typeof sealed.rawUtf8!=='string')throw error;
    const entry=execFileSync('git',['ls-tree','-z',commit,'--',ref.path],{cwd:root,env:{...process.env,GIT_NO_LAZY_FETCH:'1'}});
    if(entry.length)throw error; // A present Git input always wins over the sealed consumed copy.
    bytes=Buffer.from(sealed.rawUtf8);
   }
   if(sha(bytes)!==ref.sha256)fail('original request evidence SHA mismatch');
  }
 }
}
function unique(rows,key,label){if(!Array.isArray(rows))fail(label+' missing');const m=new Map();for(const row of rows){if(row?.[key]==null||m.has(row[key]))fail(label+' duplicate/missing');m.set(row[key],row);}return m;}
function bank(bytes){const c={window:{},console:{log(){},warn(){},error(){}}};vm.runInNewContext(bytes.toString(),c,{timeout:5000});const b=c.window.questionBank||c.window.questions||c.questions||c.questionBank||c.window.examData?.questions;if(!Array.isArray(b)||!b.length)fail('source bank missing');return JSON.parse(JSON.stringify(b));}
function refBytes(root,request,ref,historical){
 if(!ref||Object.keys(ref).some(k=>!['path','sha256'].includes(k))||!/^[a-f0-9]{64}$/.test(ref.sha256||'')||!request.approval.evidenceRefs?.some(r=>equal(r,ref)))fail('explicit exact evidence ref required');
 const bytes=historical?git(root,historical.commit,ref.path):fs.readFileSync(safe(root,ref.path));if(sha(bytes)!==ref.sha256)fail('evidence SHA mismatch');return bytes;
}
function assetRefs(question){
 const refs=new Set(),fields=new Set(['image','images','solutionImage','solutionImages','src','href','xlink:href']);
 const add=value=>{
  if(!value||value.startsWith('#')||/^data:image\/(?:png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=\s]+$/u.test(value))return;
  if(/^data:|^[a-z]+:|^\/\/|[?#]/iu.test(value))fail('unsupported renderer dependency');
  let rel=value.replace(/^\.\//,'');if(rel.startsWith('/archive/'))rel=rel.slice(1);else if(rel.startsWith('assets/'))rel='archive/'+rel;
  if(!rel.startsWith('archive/assets/')||rel.split('/').some(p=>!p||p==='.'||p==='..'))fail('unsupported local renderer path');refs.add(rel);
 };
 const visit=(v,key='')=>{
  if(Array.isArray(v)){for(const x of v)visit(x,key);return;}
  if(v&&typeof v==='object'){for(const[k,x]of Object.entries(v))visit(x,k);return;}
  if(typeof v!=='string')return;
  if(fields.has(key)&&!v.includes('<'))add(v);
  if(/<(?:img|image|svg|use)\b/iu.test(v)){
   const quoted=[...v.matchAll(/\b(?:src|(?:xlink:)?href)\s*=\s*(["'])(.*?)\1/giu)];
   if((v.match(/\b(?:src|(?:xlink:)?href)\s*=/giu)||[]).length!==quoted.length)fail('malformed renderer dependency');
   for(const m of quoted)add(m[2]);
  }
  if(/url\s*\(/iu.test(v.replace(/url\(\s*["']?#[A-Za-z0-9_.:-]+["']?\s*\)/giu,'')))fail('external renderer CSS dependency');
 };
 visit(question);return[...refs].sort();
}
function assets(root,commit,question){return assetRefs(question).map(rel=>{
 const previous=git(root,commit,rel),current=fs.readFileSync(safe(root,rel));if(!current.equals(previous))fail('renderer asset bytes changed: '+rel);
 if(rel.endsWith('.svg')){
  const svg=current.toString();if(/<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|\bon\w+\s*=|@import/iu.test(svg))fail('unsupported SVG dependency');
  const attrs=[...svg.matchAll(/\b(?:src|(?:xlink:)?href)\s*=\s*(["'])(.*?)\1/giu)];
  if((svg.match(/\b(?:src|(?:xlink:)?href)\s*=/giu)||[]).length!==attrs.length||attrs.some(m=>!m[2].startsWith('#')&&!/^data:image\/(?:png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=\s]+$/u.test(m[2])))fail('external/malformed SVG dependency');
  if(/url\s*\(/iu.test(svg.replace(/url\(\s*["']?#[A-Za-z0-9_.:-]+["']?\s*\)/giu,'')))fail('external SVG CSS dependency');
 }
 return{path:rel,blobSha1:blob(current),sha256:sha(current)};
});}
export function loadAuditSourcePreservation({root,request,bytes,bank:questions,_historical=null},legacy){
 const spec=request.approval?.sourceRebind,selected=unique(request.items,'questionUid','selected UID');
 if(request.schemaVersion!=='archive-reviewed-exam-meta-register-request-v2'||request.scope!=='PARTIAL_UIDS'||request.registrationMode!==undefined||request.registryChanges?.length||request.approval?.type!=='META_PIPELINE_AUDIT'||request.approval.metadataReviewed!==true||!String(request.approval.approvedBy||'').trim()||spec?.schemaVersion!==AUDIT_SOURCE_PRESERVATION_SCHEMA)fail('explicit partial source-only audit required');
 if(!equal(Object.keys(spec).sort(),['schemaVersion','requestPath','priorCommit','priorReceiptRef'].sort())||!spec.requestPath?.startsWith('.archive-meta-register/inbox/'))fail('source-only options invalid');
 if(request.expectedQuestionCount!==questions.length||!selected.size||selected.size>questions.length||unique(request.items,'sourceOrdinal','selected ordinal').size!==selected.size)fail('selected denominator mismatch');
 if(request.expectedSourceBlobSha1!==blob(bytes)||!equal(bank(bytes),JSON.parse(JSON.stringify(questions))))fail('current source binding mismatch');
 if(!_historical&&!fs.readFileSync(safe(root,'archive/exams/'+request.sourceArchiveFile)).equals(bytes))fail('current source file differs from supplied bytes');
 const currentReceiptPath=RECEIPTS+request.requestId+'.json',bound=_historical?.receipt?.auditPreservation?.requestSnapshot||
  (fs.existsSync(safe(root,spec.requestPath))?JSON.parse(fs.readFileSync(safe(root,spec.requestPath))):JSON.parse(fs.readFileSync(safe(root,currentReceiptPath))).auditPreservation?.requestSnapshot);
 if(!equal(bound,request))fail('request snapshot drift');
 const ref=spec.priorReceiptRef;if(!ref?.path?.startsWith(RECEIPTS)||ref.path.slice(RECEIPTS.length).includes('/')||!ref.path.endsWith('.json'))fail('prior receipt path invalid');
 const raw=refBytes(root,request,ref,_historical);if(!git(root,spec.priorCommit,ref.path).equals(raw))fail('prior receipt is not exact public Git');
 const prior=JSON.parse(raw),priorRequest=prior.auditPreservation?.requestSnapshot;
 if(prior.scope!==undefined||prior.partialUidCount!==undefined||prior.approval?.type!=='META_PIPELINE_AUDIT'||prior.approval?.sourceRebind?.schemaVersion!==LEGACY||prior.sourceArchiveFile!==request.sourceArchiveFile||prior.examUid!==request.examUid||prior.totalQuestions!==questions.length||prior.requestId!==path.basename(ref.path,'.json')||!equal(prior.approval.metaPipelineAudit,request.approval.metaPipelineAudit)||!priorRequest||priorRequest.scope!==undefined)fail('prior FULL audit mismatch');
 const oldBytes=git(root,spec.priorCommit,'archive/exams/'+request.sourceArchiveFile),oldBank=bank(oldBytes);
 if(oldBank.length!==questions.length||blob(oldBytes)!==prior.sourceBlobSha1||sha(oldBytes)!==prior.sourceRawSha256||oldBytes.equals(bytes))fail('prior source binding mismatch or unnecessary rebind');
 legacy.assertReceipt(prior,priorRequest,oldBytes,oldBank.length);
 // Only the exact immutable Git history is cached. Live source, renderer bytes,
 // issued sidecar and each current metadata/identity/runtime row are rechecked.
 const historyKey=path.resolve(root)+':'+spec.priorCommit+':'+ref.path+':'+ref.sha256;
 if(!historicalContexts.has(historyKey)){
  originalEvidence(root,spec.priorCommit,prior,priorRequest);
  const priorContext=legacy.load({root,request:priorRequest,bytes:oldBytes,bank:oldBank,_historical:{commit:spec.priorCommit,receipt:prior,seen:[]}});
  const records=unique(prior.appliedRecords,'questionUid','prior metadata'),ids=unique(prior.appliedIdentityRecords,'questionUid','prior identity'),runtimes=unique(prior.runtimeRecords,'questionUid','prior runtime');
  if(records.size!==questions.length||ids.size!==records.size||runtimes.size!==records.size)fail('prior FULL cardinality mismatch');
  const publicMetadata=unique(gitJson(root,spec.priorCommit,META).records,'questionUid','public metadata'),publicIdentity=unique(gitJson(root,spec.priorCommit,IDENTITY).records,'questionUid','public identity');
  const publicRuntime=publicRuntimeRows(root,spec.priorCommit,records),currentAuthorityUids=[];
  for(const old of records.values()){
   const kept=legacy.plan(priorContext,{current:old,identity:ids.get(old.questionUid),runtime:runtimes.get(old.questionUid),question:oldBank[old.sourceOrdinal-1],ordinal:old.sourceOrdinal,receiptPath:ref.path,replay:true});
   legacy.assertRepair(prior,kept);
   if(equal(old,publicMetadata.get(old.questionUid))&&equal(ids.get(old.questionUid),publicIdentity.get(old.questionUid))&&equal(runtimes.get(old.questionUid),publicRuntime.get(old.questionUid)))currentAuthorityUids.push(old.questionUid);
  }
  historicalContexts.set(historyKey,{records,ids,runtimes,currentAuthorityUids,consumerParents:priorContext.consumerParents});
 }
 const cached=historicalContexts.get(historyKey),copyRows=rows=>new Map([...rows].map(([uid,row])=>[uid,structuredClone(row)]));
 const records=copyRows(cached.records),ids=copyRows(cached.ids),runtimes=copyRows(cached.runtimes);
 const currentAuthorityUids=[...cached.currentAuthorityUids],consumerParents=structuredClone(cached.consumerParents);
 if(selected.size>=records.size)fail('selected proper subset required');
 const renderer=[];
 for(const [uid,item]of selected){const old=records.get(uid),ordinal=item.sourceOrdinal;
  if(!old||!Number.isSafeInteger(ordinal)||ordinal<1||ordinal>questions.length||old.sourceOrdinal!==ordinal||old.sourceArchiveFile!==request.sourceArchiveFile||!equal(item.before,{})||!equal(item.after,{})||Object.keys(item).some(k=>!['questionUid','sourceOrdinal','before','after','reason','evidenceRefs'].includes(k))||!String(item.reason||'').trim()||!item.evidenceRefs?.some(r=>equal(r,ref)))fail('selected subset/value contract mismatch');
  if(!currentAuthorityUids.includes(uid))fail('selected prior audit was superseded in public state');
  if(!equal(oldBank[ordinal-1],JSON.parse(JSON.stringify(questions[ordinal-1]))))fail('selected whole question changed');
  renderer.push({questionUid:uid,sourceOrdinal:ordinal,assets:assets(root,spec.priorCommit,questions[ordinal-1])});
 }
 const context={sourceOnly:true,root,request,bytes,prior,ref,records,identities:ids,runtimes,patches:selected,oldBank,bank:questions,consumerParents,rendererAssets:renderer,currentAuthorityUids:[...currentAuthorityUids].sort()};
 const issued=_historical?.receipt||(fs.existsSync(safe(root,currentReceiptPath))?JSON.parse(fs.readFileSync(safe(root,currentReceiptPath))):null);
 if(issued){
  if(!equal(issued.auditPreservation,auditSourcePreservationSummary(context))||!equal(issued.metaPipelineAudit,prior.metaPipelineAudit))fail('issued source-only provenance drift');
  validateAuditSourceBinding(root,issued,context);
 }
 return context;
}
export function planAuditSourcePreservation(context,{current,identity,runtime,question,ordinal,receiptPath,replay=false}){
 const uid=current.questionUid,old=context.records.get(uid),oldId=context.identities.get(uid),oldRuntime=context.runtimes.get(uid);
 if(!old||!context.patches.has(uid)||ordinal!==old.sourceOrdinal||!equal(question,context.oldBank[ordinal-1]))fail('selected current question/UID mismatch');
 const final={...structuredClone(old),approvalEvidence:[...new Set([...(old.approvalEvidence||[]),receiptPath,auditSourceBindingPath(context.request.requestId)])],metadataRevision:`meta-foundation:${old.metaFoundationPackId}@${old.metaFoundationPackVersion}${REVISION_MARKER}${context.request.requestId}`};
 const runtimeAfter={...structuredClone(oldRuntime),metadataRevision:final.metadataRevision,approvalEvidence:final.approvalEvidence};
 if(!equal(current,replay?final:old)||!equal(identity,oldId)||!equal(runtime,replay?runtimeAfter:oldRuntime))fail('current metadata/identity/runtime differs from issued prior');
 return{final,identityAfter:structuredClone(oldId),runtimeAfter,prior:old,oldId,priorQuestion:context.oldBank[ordinal-1],fingerprintRepair:null};
}
export function auditSourcePreservationSummary(context){return{schemaVersion:AUDIT_SOURCE_PRESERVATION_SCHEMA,preservedApprovalType:'META_PIPELINE_AUDIT',sourceOnly:true,
 requestSnapshot:structuredClone(context.request),priorCommit:context.request.approval.sourceRebind.priorCommit,priorReceiptRef:context.ref,
 priorRequestSha256:context.prior.requestSha256,priorFullCount:context.prior.totalQuestions,publicCurrentAuthorityUids:context.currentAuthorityUids,rendererAssets:context.rendererAssets,
 solutionFingerprintRepairs:0,newMetadataApprovals:0,newDifficultyApprovals:0,preservedMetadataApprovals:context.patches.size};}
export function assertAuditSourcePreservationReceipt(receipt,request,bytes,count){
 const items=unique(request.items,'questionUid','request UID'),n=items.size;
 if(receipt.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||receipt.metadataRegistrationStatus!=='REGISTERED'||receipt.requestId!==request.requestId||receipt.requestSha256!==sha(stable(request))||!equal(receipt.approval,request.approval)||receipt.examUid!==request.examUid||receipt.sourceArchiveFile!==request.sourceArchiveFile||receipt.sourceBlobSha1!==request.expectedSourceBlobSha1||receipt.sourceBlobSha1!==blob(bytes)||receipt.sourceRawSha256!==sha(bytes)||receipt.scope!=='PARTIAL_UIDS'||receipt.partialUidCount!==n||receipt.totalQuestions!==n||receipt.expectedQuestionCount!==count||receipt.registrationMode!==undefined||receipt.registryChanges?.length||receipt.fingerprintRepairs?.length||receipt.newMetadataApprovals!==0||receipt.preservedMetadataApprovals!==n||receipt.examFinalQaStatus!=='NOT_EVALUATED_BY_REGISTRAR')fail('source-only receipt binding/count mismatch');
 for(const list of [receipt.appliedRecords,receipt.appliedIdentityRecords,receipt.runtimeRecords]){
  const rows=unique(list,'questionUid','receipt selected UID');if(rows.size!==n||unique(list,'sourceOrdinal','receipt ordinal').size!==n)fail('receipt selected cardinality');
  for(const [uid,r]of rows)if(!items.has(uid)||r.sourceOrdinal!==items.get(uid).sourceOrdinal||r.sourceArchiveFile!==request.sourceArchiveFile)fail('receipt selected scope');
 }
 if(receipt.appliedRecords.some(r=>r.metadataApprovalType!=='META_PIPELINE_AUDIT')||receipt.runtimeRecords.some(r=>r.metadataApprovalType!=='META_PIPELINE_AUDIT')||receipt.auditPreservation?.schemaVersion!==AUDIT_SOURCE_PRESERVATION_SCHEMA||receipt.auditPreservation.sourceOnly!==true||receipt.auditPreservation.newMetadataApprovals!==0||receipt.auditPreservation.newDifficultyApprovals!==0||receipt.auditPreservation.solutionFingerprintRepairs!==0||receipt.auditPreservation.preservedMetadataApprovals!==n||!equal(receipt.auditPreservation.requestSnapshot,request))fail('receipt preserved audit authority mismatch');
}

export function auditSourceBindingPath(requestId){
 if(!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(requestId||''))fail('binding requestId invalid');
 return RECEIPTS+requestId+'.audit-source-binding.json';
}
export function buildAuditSourceBinding(context){
 const {request,bytes}=context;
 return {schemaVersion:AUDIT_SOURCE_BINDING_SCHEMA,scope:'EXISTING_FULL_AUDIT_UNCHANGED_SUBSET',
  requestId:request.requestId,requestSha256:sha(stable(request)),requestSnapshot:structuredClone(request),
  sourceArchiveFile:request.sourceArchiveFile,sourceBlobSha1:blob(bytes),sourceRawSha256:sha(bytes),
  expectedQuestionCount:request.expectedQuestionCount,selectedUidCount:context.patches.size,
  priorCommit:request.approval.sourceRebind.priorCommit,priorReceiptRef:context.ref,
  records:[...context.patches].map(([uid,item])=>({questionUid:uid,sourceOrdinal:item.sourceOrdinal,
   priorMetadataSha256:sha(stable(context.records.get(uid))),priorIdentitySha256:sha(stable(context.identities.get(uid))),
   priorRuntimeSha256:sha(stable(context.runtimes.get(uid))),wholeQuestionSha256:sha(stable(context.oldBank[item.sourceOrdinal-1])),
   rendererAssets:context.rendererAssets.find(r=>r.questionUid===uid).assets})),
  newMetadataApprovals:0,newDifficultyApprovals:0};
}
function validateAuditSourceBinding(root,receipt,context){
 const relative=auditSourceBindingPath(context.request.requestId),bytes=fs.readFileSync(safe(root,relative));
 const digests=receipt.outputDigests?.filter(r=>r.path===relative);
 if(digests?.length!==1||digests[0].sha256!==sha(bytes)||!equal(JSON.parse(bytes),buildAuditSourceBinding(context)))fail('issued audit source binding mismatch');
 for(const rows of [receipt.appliedRecords,receipt.runtimeRecords])for(const row of rows)
  if(!row.approvalEvidence?.includes(relative)||!row.metadataRevision?.endsWith(REVISION_MARKER+context.request.requestId))fail('audit source binding marker missing');
}

// This only detects a claimed issued contract. It grants no approval. A failed
// typed audit must not fall through to ordinary MAIN_MERGE metadata production.
export function hasAuditSourcePreservationClaim({root,current,runtimeRecord}){
 for(const row of [current,runtimeRecord]){
  if(String(row?.metadataRevision||'').includes(REVISION_MARKER))return true;
  for(const relative of Array.isArray(row?.approvalEvidence)?row.approvalEvidence:[]){
   if(typeof relative!=='string'||!relative.startsWith(RECEIPTS))continue;
   if(relative.endsWith('.audit-source-binding.json'))return true;
   const requestId=relative.slice(RECEIPTS.length).replace(/\.json$/u,'');
   if(!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(requestId)||relative!==RECEIPTS+requestId+'.json')continue;
   try{if(fs.existsSync(safe(root,auditSourceBindingPath(requestId))))return true;}catch{return true;}
   try{const receipt=JSON.parse(fs.readFileSync(safe(root,relative)));
    if(receipt.approval?.sourceRebind?.schemaVersion===AUDIT_SOURCE_PRESERVATION_SCHEMA||receipt.auditPreservation?.schemaVersion===AUDIT_SOURCE_PRESERVATION_SCHEMA)return true;
   }catch{/* A missing plain legacy receipt is not a new typed claim. */}
  }
 }
 return false;
}
