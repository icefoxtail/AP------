// Retain an issued source-only audit subset and apply one independently final CC.
// This is a distinct operation: its source can also contain newer FINAL_QA rows.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {loadVerifiedHistoricalAuditSourceSnapshot,isPreservableAuditRecord} from './native-audit-preservation.mjs';
import {validateReviewedAuditSubsetCrossConceptComponent,REASSESSED_STUDENT_FIELDS} from './reviewed-source-reassessment.mjs';
import {loadActiveMetaRegistry} from './active-registry.mjs';
import {readImmutableGitFiles} from './immutable-git-batch.mjs';

export const AUDIT_SUBSET_CC_SCHEMA='archive-audit-subset-finalized-cc-append-v1';
const BINDING_SCHEMA='archive-audit-subset-finalized-cc-binding-v1';
const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const SUFFIX='.audit-subset-cc-append.json',REVISION=':audit-subset-finalized-cc-append-v1:';
const SHA1=/^[a-f0-9]{40}$/,SHA256=/^[a-f0-9]{64}$/;
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const same=(a,b)=>stable(a)===stable(b),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const text=x=>typeof x==='string'&&x.trim().length>0;
const keys=(x,allowed)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>allowed.includes(k));
const strings=x=>Array.isArray(x)&&x.every(text)&&new Set(x).size===x.length;
const fail=s=>{throw Error('audited subset CC append: '+s);};
const pick=(q,fields)=>Object.fromEntries(fields.filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));
function safe(root,p){
 if(!text(p)||path.isAbsolute(p)||/[\\\x00-\x1f]/u.test(p)||p.split('/').some(s=>!s||s==='.'||s==='..'))fail('unsafe path');
 const full=path.resolve(root,p),base=path.resolve(root);for(let q=full;q!==base;q=path.dirname(q))if(fs.existsSync(q)&&fs.lstatSync(q).isSymbolicLink())fail('symlink input');
 return full;
}
const read=(root,p)=>JSON.parse(fs.readFileSync(safe(root,p)));
function git(root,args){try{return execFileSync('git',args,{cwd:root,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},maxBuffer:128*1024*1024,stdio:['ignore','pipe','pipe']});}catch{fail('immutable Git input unavailable');}}
function immutable(root,commit,p){
 safe(root,p);if(!SHA1.test(commit||'')||git(root,['rev-parse','--verify',commit+'^{commit}']).toString().trim()!==commit)fail('exact immutable commit required');
 const entry=git(root,['ls-tree','-z',commit,'--',p]).toString();
 if(!/^100(?:644|755) blob [a-f0-9]{40}\t[^\0]+\0$/u.test(entry)||entry.slice(entry.indexOf('\t')+1,-1)!==p)fail('immutable regular file required');
 const raw=git(root,['cat-file','blob',entry.slice(0,entry.indexOf('\t')).split(' ')[2]]);
 if(blob(raw)!==entry.slice(0,entry.indexOf('\t')).split(' ')[2])fail('immutable blob bytes mismatch');
 return raw;
}
function bankFrom(raw){const c={window:{},console:{log(){},warn(){},error(){}}};vm.runInNewContext(raw.toString('utf8'),c,{timeout:5000});const b=c.window.questionBank||c.window.questions||c.questions||c.questionBank||c.window.examData?.questions;if(!Array.isArray(b)||!b.length)fail('source bank missing');return JSON.parse(JSON.stringify(b));}
function inventory(rows,label){if(!Array.isArray(rows))fail(label+' missing');const m=new Map();for(const r of rows){if(!text(r?.questionUid)||m.has(r.questionUid))fail(label+' missing/duplicate UID');m.set(r.questionUid,r);}return m;}
function refs(root,list){
 if(!Array.isArray(list)||!list.length)fail('explicit evidence required');const m=new Map();
 for(const r of list){if(!keys(r,['path','sha256'])||!SHA256.test(r.sha256||'')||sha(fs.readFileSync(safe(root,r.path)))!==r.sha256||m.has(r.path)&&m.get(r.path)!==r.sha256)fail('evidence missing, ambiguous or changed');m.set(r.path,r.sha256);}return m;
}
const bound=(m,r)=>r&&m.get(r.path)===r.sha256;
export const auditSubsetCcBindingPath=id=>{if(!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(id||''))fail('invalid request ID');return RECEIPTS+id+SUFFIX;};
export const isAuditSubsetCcAppend=approval=>approval?.type==='META_PIPELINE_AUDIT'&&approval.sourceRebind?.schemaVersion===AUDIT_SUBSET_CC_SCHEMA;
export function isExplicitAuditSubsetCcAppendRequest(r){
 const s=r?.approval?.sourceRebind,c=s?.component;
 return r?.schemaVersion==='archive-reviewed-exam-meta-register-request-v2'&&isAuditSubsetCcAppend(r.approval)&&
  /^audit-subset-cc-[A-Za-z0-9][A-Za-z0-9_-]{0,83}$/.test(r.requestId||'')&&
  keys(r,['schemaVersion','requestId','examUid','sourceArchiveFile','expectedSourceBlobSha1','expectedQuestionCount','scope','approval','registryChanges','items'])&&
  r.scope==='PARTIAL_UIDS'&&r.approval.metadataReviewed===true&&text(r.approval.approvedBy)&&
  keys(r.approval,['type','metadataReviewed','approvedBy','evidenceRefs','sourceRebind','metaPipelineAudit'])&&
  keys(s,['schemaVersion','requestPath','priorCommit','priorReceiptRef','component'])&&
  s.requestPath==='.archive-meta-register/inbox/'+r.requestId+'.json'&&SHA1.test(s.priorCommit||'')&&
  keys(s.priorReceiptRef,['path','sha256'])&&SHA256.test(s.priorReceiptRef?.sha256||'')&&
  keys(c,['questionUid','sourceOrdinal','addCrossConceptKey','sourceReview'])&&text(c.questionUid)&&text(c.addCrossConceptKey)&&
  Number.isSafeInteger(c.sourceOrdinal)&&c.sourceOrdinal>0&&c.sourceOrdinal<=r.expectedQuestionCount&&
  Number.isSafeInteger(r.expectedQuestionCount)&&r.expectedQuestionCount>1&&Array.isArray(r.registryChanges)&&r.registryChanges.length===0&&
  Array.isArray(r.items)&&r.items.length>0&&r.items.length<r.expectedQuestionCount&&r.items.every(i=>
   keys(i,['questionUid','sourceOrdinal','before','after','reason','evidenceRefs'])&&same(i.before,{})&&same(i.after,{})&&text(i.reason));
}
// The preview stages both exact receipt leaves while their consumed historical
// inboxes remain in Git. This returns input anchors, never approval results;
// registration and reuse still replay both complete original authorities.
export function auditSubsetCcHistoricalEvidenceAnchors({root,request}){
 if(!isExplicitAuditSubsetCcAppendRequest(request))return[];
 const spec=request.approval.sourceRebind,ref=spec.priorReceiptRef,raw=immutable(root,spec.priorCommit,ref.path);
 git(root,['merge-base','--is-ancestor',spec.priorCommit,'HEAD']);
 if(sha(raw)!==ref.sha256||!raw.equals(fs.readFileSync(safe(root,ref.path))))fail('historical subset receipt anchor mismatch');
 const prior=JSON.parse(raw),old=prior.auditPreservation?.requestSnapshot,oldSpec=old?.approval?.sourceRebind;
 if(prior.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||prior.metadataRegistrationStatus!=='REGISTERED'||
  prior.scope!=='PARTIAL_UIDS'||prior.approval?.type!=='META_PIPELINE_AUDIT'||oldSpec?.schemaVersion!=='archive-native-audit-source-preservation-v1'||
  old.schemaVersion!=='archive-reviewed-exam-meta-register-request-v2'||old.scope!=='PARTIAL_UIDS'||old.requestId!==prior.requestId||
  ref.path!==RECEIPTS+prior.requestId+'.json'||prior.requestSha256!==sha(stable(old))||!same(prior.approval,old.approval)||
  old.sourceArchiveFile!==request.sourceArchiveFile||old.examUid!==request.examUid||old.expectedQuestionCount!==request.expectedQuestionCount||
  !same(old.items?.map(i=>[i.questionUid,i.sourceOrdinal]),request.items.map(i=>[i.questionUid,i.sourceOrdinal]))||
  !keys(oldSpec.priorReceiptRef,['path','sha256'])||!SHA256.test(oldSpec.priorReceiptRef?.sha256||''))fail('exact issued subset history required');
 const fullRef=oldSpec.priorReceiptRef,fullRaw=immutable(root,oldSpec.priorCommit,fullRef.path),full=JSON.parse(fullRaw);
 git(root,['merge-base','--is-ancestor',oldSpec.priorCommit,spec.priorCommit]);
 if(sha(fullRaw)!==fullRef.sha256||!fullRaw.equals(fs.readFileSync(safe(root,fullRef.path)))||
  full.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||full.metadataRegistrationStatus!=='REGISTERED'||full.scope!==undefined||
  full.approval?.type!=='META_PIPELINE_AUDIT'||full.approval.sourceRebind?.schemaVersion!=='archive-native-audit-preservation-v1'||
  fullRef.path!==RECEIPTS+full.requestId+'.json'||full.sourceArchiveFile!==request.sourceArchiveFile||full.examUid!==request.examUid||
  full.totalQuestions!==request.expectedQuestionCount||full.appliedRecords?.length!==request.expectedQuestionCount)fail('exact original full audit history required');
 return[{...ref,commit:spec.priorCommit},{...fullRef,commit:oldSpec.priorCommit}];
}
function referencedAssets(q){
 const out=new Set(),add=v=>{if(v==null||v==='')return;if(Array.isArray(v)){v.forEach(add);return;}
  if(typeof v!=='string'||!/^(?:archive\/)?assets\//.test(v)||/[?#]/.test(v))fail('unsupported renderer reference');out.add(v.startsWith('archive/')?v:'archive/'+v);};
 for(const k of ['image','images','solutionImage','solutionImages','visualAsset'])add(q[k]);
 if(q.visualSpec?.assetRef!==undefined)add(q.visualSpec.assetRef);
 const inline=v=>{if(typeof v==='string'){for(const m of v.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi))if(!m[1].startsWith('#'))add(m[1]);if(/url\s*\(/i.test(v))fail('unsupported inline renderer URL');}
  else if(Array.isArray(v))v.forEach(inline);else if(v&&typeof v==='object')Object.values(v).forEach(inline);};
 inline(pick(q,REASSESSED_STUDENT_FIELDS));return[...out].sort();
}
function staticSvg(raw){
 const s=raw.toString('utf8'),dependencies=[...[...s.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]),...[...s.matchAll(/url\s*\(\s*["']?([^\s)"']+)["']?\s*\)/gi)].map(m=>m[1])];
 if(/@import\b|@(?:-[a-z]+-)?keyframes\b|\banimation(?:-[a-z]+)?\s*:|<!ENTITY\b|<!DOCTYPE\b|<\?xml-stylesheet\b|<(?:[^\s<>/:]+:)?(?:foreignObject|script|animate\w*|set|discard)\b|\bon\w+\s*=|\bxml:base\s*=/i.test(s)||/\\/.test(s)||dependencies.some(v=>!v.startsWith('#')&&!/^data:image\/(?:png|jpeg|gif|webp);base64,/i.test(v)))fail('unsupported nested or dynamic SVG dependency');
}
function readBoundRequest(root,request){
 const p=request.approval.sourceRebind.requestPath;
 if(fs.existsSync(safe(root,p))){if(!same(read(root,p),request))fail('request differs from explicit input');return;}
 const b=read(root,auditSubsetCcBindingPath(request.requestId));
 if(b.schemaVersion!==BINDING_SCHEMA||!same(b.requestSnapshot,request)||b.requestSha256!==sha(stable(request)))fail('consumed request snapshot missing or changed');
}
export function loadAuditSubsetCcAppend({root,request,bytes,bank,canonicalBefore,canonicalAfter}){
 if(!isExplicitAuditSubsetCcAppendRequest(request))fail('exclusive current-audit-subset CC scope required');
 const spec=request.approval.sourceRebind,priorRef=spec.priorReceiptRef,component=spec.component;
 if(priorRef.path===RECEIPTS+request.requestId+'.json'||!SHA1.test(request.expectedSourceBlobSha1||'')||request.expectedSourceBlobSha1!==blob(bytes)||
  bank.length!==request.expectedQuestionCount||!same(bank,bankFrom(bytes))||!bytes.equals(fs.readFileSync(safe(root,'archive/exams/'+request.sourceArchiveFile))))fail('current source/request binding mismatch');
 git(root,['merge-base','--is-ancestor',spec.priorCommit,'HEAD']);
 readBoundRequest(root,request);const approvalRefs=refs(root,request.approval.evidenceRefs);
 if(!bound(approvalRefs,priorRef)||sha(immutable(root,spec.priorCommit,priorRef.path))!==priorRef.sha256)fail('exact current prior audit evidence required');
 const snapshot=loadVerifiedHistoricalAuditSourceSnapshot({root,priorCommit:spec.priorCommit,priorReceiptRef:priorRef});
 const {prior,bank:oldBank}=snapshot,originalRef=snapshot.request.approval.sourceRebind.priorReceiptRef;
 if(prior.examUid!==request.examUid||prior.sourceArchiveFile!==request.sourceArchiveFile||prior.expectedQuestionCount!==bank.length||
  !same(prior.approval.metaPipelineAudit,request.approval.metaPipelineAudit)||!bound(approvalRefs,snapshot.bindingRef)||!bound(approvalRefs,originalRef))fail('current audit subset/original full audit scope mismatch');
 const records=inventory(prior.appliedRecords,'prior metadata'),identities=inventory(prior.appliedIdentityRecords,'prior identity'),runtimes=inventory(prior.runtimeRecords,'prior runtime'),patches=inventory(request.items,'request');
 if(!same(request.items.map(i=>[i.questionUid,i.sourceOrdinal]),prior.appliedRecords.map(r=>[r.questionUid,r.sourceOrdinal]))||
  [identities,runtimes,patches].some(m=>m.size!==records.size)||records.size>=bank.length)fail('whole current audit subset inventory/order required');
 const selected=records.get(component.questionUid);
 if(!selected||selected.sourceOrdinal!==component.sourceOrdinal||!strings(selected.crossConceptKeys)||!selected.crossConceptKeys.length||
  selected.crossConceptKeys.includes(component.addCrossConceptKey)||selected.crossConceptApprovalComponents!==undefined)fail('one new CC must append to the retained audit array');
 const combined=[...selected.crossConceptKeys,component.addCrossConceptKey];
 for(let i=0;i<bank.length;i++){
  const expected=i+1===component.sourceOrdinal?{...oldBank[i],crossConceptKeys:combined}:oldBank[i];
  if(!same(bank[i],expected))fail('only selected source CC array may change; all outside questions remain exact');
 }
 for(const [uid,r]of records){
  if(!isPreservableAuditRecord(r)||r.crossConceptApprovalComponents!==undefined||runtimes.get(uid)?.crossConceptApprovalComponents!==undefined||
   r.sourceArchiveFile!==request.sourceArchiveFile||!same(r.crossConceptKeys,runtimes.get(uid)?.crossConceptKeys))fail('retained audit metadata/runtime mismatch');
  const itemRefs=refs(root,patches.get(uid).evidenceRefs);
  if(![priorRef,snapshot.bindingRef,originalRef].every(r=>bound(itemRefs,r)))fail('each retained UID must bind both audit authorities and current binding');
 }
 // All renderer bytes remain anchored to the actual original full-audit history,
 // including the newer native rows outside this operation's selected subset.
 const assets=new Map(),histories=[{commit:spec.priorCommit,bank:oldBank,receiptRef:priorRef},...snapshot.full.sourceSnapshots];
 const paths=[...new Set(bank.flatMap(referencedAssets))].sort();
 const rawAssets=readImmutableGitFiles(root,paths.flatMap(p=>histories.map(h=>({commit:h.commit,path:p}))));
 for(let i=0;i<bank.length;i++){
  const required=referencedAssets(bank[i]);
  for(const h of histories)if(h.bank.length!==bank.length||!same(referencedAssets(h.bank[i]),required))fail('original/full/current renderer inventory differs');
  const item=patches.get([...records.values()].find(r=>r.sourceOrdinal===i+1)?.questionUid);
  const itemRefs=item?refs(root,item.evidenceRefs):null;
  for(const p of required){
   if(!assets.has(p)){
    const ix=paths.indexOf(p)*histories.length,raws=rawAssets.slice(ix,ix+histories.length),live=fs.readFileSync(safe(root,p));
    if(raws.some(b=>!b.equals(live)))fail('whole-source asset differs from current/original audit');
    if(/\.svg$/i.test(p))staticSvg(live);
    assets.set(p,{path:p,sha256:sha(live),gitBlobSha1:blob(live),auditHistory:histories.map(h=>({commit:h.commit,receiptRef:h.receiptRef,sha256:sha(live),gitBlobSha1:blob(live)}))});
   }
   if(!bound(approvalRefs,assets.get(p))||itemRefs&&!bound(itemRefs,assets.get(p)))fail('whole-source renderer is not explicit bound evidence');
  }
 }
 if(!canonicalBefore?.cc?.get(component.addCrossConceptKey)||!same(canonicalBefore.cc.get(component.addCrossConceptKey),canonicalAfter?.cc?.get(component.addCrossConceptKey)))fail('already installed exact definition required without registry mutation');
 const proof=validateReviewedAuditSubsetCrossConceptComponent({root,request,component,evidenceRefs:patches.get(component.questionUid).evidenceRefs,
  question:bank[component.sourceOrdinal-1],prior:selected,canonicalBefore,canonicalAfter});
 return{subsetCc:true,root,request,bytes,bank,oldBank,prior,priorRef,records,identities,runtimes,patches,selected,combined,proof,
  originalRef,priorBindingRef:snapshot.bindingRef,assets:[...assets.values()],consumerParents:snapshot.context.consumerParents,bindingPath:auditSubsetCcBindingPath(request.requestId)};
}
function components(c){return{schemaVersion:'archive-audit-cross-concept-components-v1',retained:{approvalType:'META_PIPELINE_AUDIT',receiptRef:c.priorRef,
 originalFullReceiptRef:c.originalRef,keys:c.selected.crossConceptKeys,recordSha256:sha(stable(c.selected))},appended:{key:c.request.approval.sourceRebind.component.addCrossConceptKey,
 nativeReview:c.proof.nativeReview,finalizationRef:c.proof.proposalFinalization.finalizationRef,componentProofSha256:sha(stable(c.proof)),newMathematicalQa:false,newDifficultyJudgments:0}};}
export function planAuditSubsetCcRow(c,{current,identity,runtime,question,ordinal,receiptPath,replay=false}){
 const old=c.records.get(current?.questionUid),id=c.identities.get(current?.questionUid),rt=c.runtimes.get(current?.questionUid);
 if(!old||old.sourceOrdinal!==ordinal||!same(question,c.bank[ordinal-1])||receiptPath!==RECEIPTS+c.request.requestId+'.json')fail('exact retained audit row required');
 const evidence=[...old.approvalEvidence,receiptPath,c.bindingPath];if(new Set(evidence).size!==evidence.length)fail('duplicate/cyclic provenance');
 const delta={metadataRevision:`meta-foundation:${old.metaFoundationPackId}@${old.metaFoundationPackVersion}${REVISION}${c.request.requestId}`,approvalEvidence:evidence,
  ...(old.questionUid===c.selected.questionUid?{crossConceptKeys:c.combined,crossConceptApprovalComponents:components(c)}:{})};
 const final={...structuredClone(old),...structuredClone(delta)},runtimeAfter={...structuredClone(rt),...structuredClone(delta)};
 if(!same(current,replay?final:old)||!same(identity,id)||!same(runtime,replay?runtimeAfter:rt))fail('current selected metadata/identity/runtime differs from issued prior');
 return{final,identityAfter:structuredClone(id),runtimeAfter};
}
export function auditSubsetCcSummary(c){return{schemaVersion:AUDIT_SUBSET_CC_SCHEMA,bindingPath:c.bindingPath,priorReceiptRef:c.priorRef,originalFullReceiptRef:c.originalRef,
 preservedApprovalType:'META_PIPELINE_AUDIT',newMetadataApprovals:0,preservedMetadataApprovals:c.records.size,expectedQuestionCount:c.bank.length,
 finalizedCrossConceptApplications:1,appendedQuestionUid:c.selected.questionUid,appendedCrossConceptKey:c.request.approval.sourceRebind.component.addCrossConceptKey};}
export function buildAuditSubsetCcBinding(c,requestSha256=sha(stable(c.request))){return{schemaVersion:BINDING_SCHEMA,requestId:c.request.requestId,requestSha256,
 requestSnapshot:structuredClone(c.request),priorReceiptRef:c.priorRef,priorBindingRef:c.priorBindingRef,originalFullReceiptRef:c.originalRef,
 sourceArchiveFile:c.request.sourceArchiveFile,expectedQuestionCount:c.bank.length,selectedUidCount:c.records.size,priorSourceBlobSha1:c.prior.sourceBlobSha1,
 sourceBlobSha1:blob(c.bytes),sourceRawSha256:sha(c.bytes),newMetadataApprovals:0,preservedMetadataApprovals:c.records.size,finalizedCrossConceptApplications:1,
 originalApprovalType:'META_PIPELINE_AUDIT',componentProof:c.proof,components:components(c),assets:c.assets,
 wholeSource:c.bank.map((q,i)=>({sourceOrdinal:i+1,priorWholeQuestionSha256:sha(stable(c.oldBank[i])),wholeQuestionSha256:sha(stable(q))})),
 records:[...c.records.values()].map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,priorMetadataSha256:sha(stable(r)),
 priorIdentitySha256:sha(stable(c.identities.get(r.questionUid))),priorRuntimeSha256:sha(stable(c.runtimes.get(r.questionUid))),
 retainedCrossConceptKeys:r.crossConceptKeys,appendedCrossConceptKeys:r.questionUid===c.selected.questionUid?[c.request.approval.sourceRebind.component.addCrossConceptKey]:[]}))};}
export function assertAuditSubsetCcReceipt(c,r){
 const q=c.request,n=c.records.size;
 if(!keys(r,['schemaVersion','requestId','requestSha256','examUid','sourceArchiveFile','sourceBlobSha1','sourceRawSha256','approval','metaPipelineAudit','auditCrossConceptAppend',
  'metadataRegistrationStatus','examFinalQaStatus','consumerSearchStatus','totalQuestions','registryChanges','appliedRecords','appliedIdentityRecords','fingerprintRepairs','runtimeRecords','outputDigests',
  'newMetadataApprovals','preservedMetadataApprovals','scope','partialUidCount','expectedQuestionCount'])||r.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||
  r.requestId!==q.requestId||r.requestSha256!==sha(stable(q))||!same(r.approval,q.approval)||r.scope!=='PARTIAL_UIDS'||r.partialUidCount!==n||r.totalQuestions!==n||
  r.expectedQuestionCount!==c.bank.length||r.sourceArchiveFile!==q.sourceArchiveFile||r.examUid!==q.examUid||r.sourceBlobSha1!==blob(c.bytes)||r.sourceRawSha256!==sha(c.bytes)||
  r.metadataRegistrationStatus!=='REGISTERED'||r.examFinalQaStatus!=='NOT_EVALUATED_BY_REGISTRAR'||r.newMetadataApprovals!==0||r.preservedMetadataApprovals!==n||
  r.fingerprintRepairs?.length!==0||!same(r.registryChanges,[])||!same(r.metaPipelineAudit,c.prior.metaPipelineAudit)||!same(r.auditCrossConceptAppend,auditSubsetCcSummary(c)))fail('issued subset component receipt binding/count/provenance drift');
 const raw=fs.readFileSync(safe(c.root,c.bindingPath)),d=r.outputDigests?.filter(x=>x.path===c.bindingPath);
 if(d?.length!==1||d[0].sha256!==sha(raw)||!same(JSON.parse(raw),buildAuditSubsetCcBinding(c)))fail('durable subset component binding missing or changed');
 const records=inventory(r.appliedRecords,'issued metadata'),ids=inventory(r.appliedIdentityRecords,'issued identity'),runtime=inventory(r.runtimeRecords,'issued runtime');
 if([records,ids,runtime].some(m=>m.size!==n)||!same(r.appliedRecords.map(x=>x.questionUid),q.items.map(x=>x.questionUid)))fail('issued exact subset inventory drift');
 for(const[uid,old]of c.records)planAuditSubsetCcRow(c,{current:records.get(uid),identity:ids.get(uid),runtime:runtime.get(uid),question:c.bank[old.sourceOrdinal-1],ordinal:old.sourceOrdinal,receiptPath:RECEIPTS+q.requestId+'.json',replay:true});
}
function candidates(current,runtime){
 const paths=new Set([current,runtime].flatMap(r=>r?.approvalEvidence||[]));
 for(const r of[current,runtime]){const id=String(r?.metadataRevision||'').split(REVISION)[1];if(id&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(id))paths.add(RECEIPTS+id+'.json');}
 return[...paths].filter(p=>typeof p==='string'&&p.startsWith(RECEIPTS)&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}\.json$/.test(p.slice(RECEIPTS.length)));
}
function liveCohort(c,registry){
 const rows=inventory(read(c.root,'archive/data/question_metadata.json').records,'live metadata'),ids=inventory(read(c.root,'archive/data/question_identity_map.json').records,'live identity'),runtime=new Map();
 for(const file of fs.readdirSync(safe(c.root,'archive/data/meta-foundation/runtime')).filter(p=>p.endsWith('-v1.json'))){
  const pack=read(c.root,'archive/data/meta-foundation/runtime/'+file);
  for(const row of pack.records||[])if(c.records.has(row.questionUid)){
   if(runtime.has(row.questionUid))fail('duplicate current runtime UID');
   const active=registry.activePacks.get(row.metaFoundationPackId);
   if(pack.status!=='ACTIVE'||pack.packId!==row.metaFoundationPackId||active?.status!=='ACTIVE'||!text(active.version)||!text(pack.packVersion)||active.version!==pack.packVersion)fail('current ACTIVE pack/version mismatch');
   runtime.set(row.questionUid,row);
  }
 }
 if(runtime.size!==c.records.size)fail('current audit cohort runtime missing');
 const receiptPath=RECEIPTS+c.request.requestId+'.json';
 for(const[uid,old]of c.records)planAuditSubsetCcRow(c,{current:rows.get(uid),identity:ids.get(uid),runtime:runtime.get(uid),question:c.bank[old.sourceOrdinal-1],ordinal:old.sourceOrdinal,receiptPath,replay:true});
 return{rows,ids,runtime};
}
export function nativeAuditSubsetCcAppend({nativeSource,question,previous,current,identity,ordinal,registry,pt,tpl,ownerPack}){
 const{root,bytes,bank,runtimeRecord}=nativeSource;
 if(!isPreservableAuditRecord(current)||current.metaFoundationPackId!==ownerPack||current.L3!==pt?.canonicalLabelKo||current.L4!==tpl?.canonicalLabelKo)return null;
 for(const p of candidates(current,runtimeRecord))try{
  const receipt=read(root,p);if(!isAuditSubsetCcAppend(receipt.approval))continue;
  const matches=receipt.appliedRecords.filter(r=>r.questionUid===current.questionUid),ids=receipt.appliedIdentityRecords.filter(r=>r.questionUid===current.questionUid),rts=receipt.runtimeRecords.filter(r=>r.questionUid===current.questionUid);
  if(matches.length!==1||!same(matches[0],current)||ids.length!==1||!same(ids[0],identity)||rts.length!==1||!same(rts[0],runtimeRecord)||receipt.sourceRawSha256!==sha(bytes)||receipt.sourceBlobSha1!==blob(bytes))fail('native current issued row/source mismatch');
  const binding=read(root,auditSubsetCcBindingPath(receipt.requestId)),request=binding.requestSnapshot;
  if(p!==RECEIPTS+request?.requestId+'.json'||request.sourceArchiveFile!==current.sourceArchiveFile)fail('native subset request missing');
  const tables={pt:registry.problemTypes,tpl:registry.templates,cc:registry.concepts,cond:registry.conditions};
  const c=loadAuditSubsetCcAppend({root,request,bytes,bank,canonicalBefore:tables,canonicalAfter:tables});assertAuditSubsetCcReceipt(c,receipt);liveCohort(c,registry);
  planAuditSubsetCcRow(c,{current,identity,runtime:runtimeRecord,question,ordinal,receiptPath:p,replay:true});
  if(!same(pick(previous,REASSESSED_STUDENT_FIELDS),pick(question,REASSESSED_STUDENT_FIELDS)))fail('component cannot approve changed student payload');
  return p;
 }catch{/* An unverified subset component grants no fallback approval. */}
 return null;
}
export function verifiedAuditSubsetCcSourcePrecedence({root,source,bytes,bank,metadataRows,identityRows}){
 try{
  if(!bytes.equals(fs.readFileSync(safe(root,'archive/exams/'+source)))||!same(bank,bankFrom(bytes)))return new Map();
  const registry=loadActiveMetaRegistry(root);if(registry.status!=='ACTIVE')return new Map();
  const tables={pt:registry.problemTypes,tpl:registry.templates,cc:registry.concepts,cond:registry.conditions};let accepted=null;
  for(const p of new Set(metadataRows.flatMap(r=>candidates(r,null)))){
   let receipt;try{receipt=read(root,p);}catch{continue;}if(!isAuditSubsetCcAppend(receipt.approval))continue;
   const request=read(root,auditSubsetCcBindingPath(receipt.requestId)).requestSnapshot;
   if(request.sourceArchiveFile!==source||p!==RECEIPTS+request.requestId+'.json')return new Map();
   const c=loadAuditSubsetCcAppend({root,request,bytes,bank,canonicalBefore:tables,canonicalAfter:tables});assertAuditSubsetCcReceipt(c,receipt);
   const live=liveCohort(c,registry),supplied=inventory(metadataRows,'catalog metadata'),ids=inventory(identityRows,'catalog identity'),checked=new Map();
   if(supplied.size!==bank.length||ids.size!==bank.length)return new Map();
   for(const[uid,old]of c.records){
    const row=live.rows.get(uid),q=bank[old.sourceOrdinal-1];if(!same(row,supplied.get(uid))||!same(live.ids.get(uid),ids.get(uid)))return new Map();
    const fields=new Map();for(const[field,value]of Object.entries(row)){const sourceValue=q[field];if(sourceValue!==undefined&&sourceValue!==null&&String(sourceValue).trim()!==''&&!same(sourceValue,value))fields.set(field,{sourceValue:structuredClone(sourceValue),registeredValue:structuredClone(value)});}
    checked.set(uid,fields);
   }
   if(accepted)return new Map();accepted=checked;
  }
  return accepted||new Map();
 }catch{return new Map();}
}
export function hasExplicitAuditSubsetCcClaim({root,current,runtimeRecord}){
 for(const r of[current,runtimeRecord])if(String(r?.metadataRevision||'').includes(REVISION)||r?.approvalEvidence?.some(p=>typeof p==='string'&&p.endsWith(SUFFIX)))return true;
 for(const p of candidates(current,runtimeRecord))try{if(isAuditSubsetCcAppend(read(root,p).approval))return true;}catch{}
 return false;
}
// Only immutable claim inventories are cached. The claim identifies an obligation,
// never approval. HEAD ancestry preserves it after committed marker/file removal.
const claimIndexes=new Map();
export function hasAuditSubsetCcClaim({root,current,runtimeRecord}){
 if(hasExplicitAuditSubsetCcClaim({root,current,runtimeRecord}))return true;
 if(!current?.questionUid||!current.sourceArchiveFile)return false;
 try{
  const head=git(root,['rev-parse','HEAD']).toString().trim(),key=path.resolve(root)+'\0'+head;
  if(!claimIndexes.has(key)){
   const claims=new Map(),history=git(root,['log','--full-history','--format=commit:%H','--name-only','--diff-filter=AM','HEAD','--',RECEIPTS+'*'+SUFFIX,'.archive-meta-register/inbox/audit-subset-cc-*.json']).toString().split('\n');
   let commit=null;
   for(const p of history){
    if(/^commit:[a-f0-9]{40}$/.test(p)){commit=p.slice(7);continue;}
    if(!commit||!(p.endsWith(SUFFIX)||p.startsWith('.archive-meta-register/inbox/audit-subset-cc-')&&p.endsWith('.json')))continue;
    try{const x=JSON.parse(immutable(root,commit,p)),r=x.schemaVersion===BINDING_SCHEMA?x.requestSnapshot:x;
     if(!isExplicitAuditSubsetCcAppendRequest(r))continue;
     for(const i of r.items)claims.set(r.sourceArchiveFile+'#'+i.questionUid,true);
    }catch{/* An invalid record is not an authority or an exemption. */}
   }
   claimIndexes.set(key,claims);if(claimIndexes.size>8)claimIndexes.delete(claimIndexes.keys().next().value);
  }
  return claimIndexes.get(key).has(current.sourceArchiveFile+'#'+current.questionUid);
 }catch{return current.metadataApprovalType==='META_PIPELINE_AUDIT';}
}
