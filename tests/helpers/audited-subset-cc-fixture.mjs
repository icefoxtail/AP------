import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {auditedCcAppendFixture} from './audited-cc-append-fixture.mjs';
import {registerReviewedExamV2} from '../../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {AUDIT_SUBSET_CC_SCHEMA,auditSubsetCcBindingPath} from '../../archive/tools/meta-foundation/audited-subset-cross-concept-append.mjs';
const META='archive/data/question_metadata.json',RUNTIME='archive/data/meta-foundation/runtime/new-course-v1.json';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest('hex');
const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';

export function auditedSubsetCcFixture(t,{questionCount=4,assetText}={}){
 const f=auditedCcAppendFixture(t,{questionCount,assetText}),fullRequest=structuredClone(f.request),originalFull=f.prior,
  component=structuredClone(fullRequest.approval.sourceRebind.component),definition=fullRequest.registryChanges[0],
  source=f.request.sourceArchiveFile,fullPriorPath=f.priorPath,fullPriorCommit=f.priorCommit;
 fs.unlinkSync(path.join(f.root,f.requestPath));
 f.bank.splice(0,f.bank.length,...structuredClone(f.oldBank));
 const doc=f.read(definition.path);doc.concepts.push(structuredClone(definition.after));f.put(definition.path,doc);
 const nativeOrdinals=Array.from({length:questionCount},(_,i)=>i+1).filter(n=>n%2===1),auditOrdinals=Array.from({length:questionCount},(_,i)=>i+1).filter(n=>n%2===0);
 for(const n of nativeOrdinals){f.bank[n-1].integrationPattern='SEQUENTIAL';f.bank[n-1].crossConceptKeys=[];}
 const raw=f.writeBank(),nativeDoc=f.read(f.nativePath),before=f.read(META);
 const nativeRequestId='current-native-half',nativeRequestPath='.archive-meta-register/inbox/'+nativeRequestId+'.json';
 const sourceReview=structuredClone(component.sourceReview);delete sourceReview.proposalFinalization;
 const nativeEvidence=fullRequest.approval.evidenceRefs.filter(r=>r.path===f.nativePath||r.path.startsWith('archive/assets/'));
 const nativeRequest={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:nativeRequestId,examUid:originalFull.examUid,
  sourceArchiveFile:source,expectedSourceBlobSha1:blob(raw),expectedQuestionCount:questionCount,scope:'PARTIAL_UIDS',
  approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'fixture-original-native-transport',evidenceRefs:nativeEvidence},registryChanges:[],
  items:nativeOrdinals.map(n=>{const old=before.records[n-1],after={...nativeDoc.items[n-1].after,sourceFingerprint:old.sourceFingerprint,contentFingerprint:old.contentFingerprint};return{
   questionUid:old.questionUid,sourceOrdinal:n,before:Object.fromEntries(Object.keys(after).map(k=>[k,old[k]??null])),after,sourceReview,
   reason:'Apply only the synthetic independently reviewed native half.',evidenceRefs:nativeEvidence};})};
 f.put(nativeRequestPath,nativeRequest);registerReviewedExamV2({root:f.root,request:nativeRequest,write:true});
 fs.unlinkSync(path.join(f.root,nativeRequestPath));
 const currentAuditId='current-audit-half',currentAuditPath='.archive-meta-register/inbox/'+currentAuditId+'.json',priorRef=f.ref(fullPriorPath);
 const auditRefs=[priorRef,...fullRequest.approval.evidenceRefs.filter(r=>r.path!==priorRef.path)];
 const currentAuditRequest={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:currentAuditId,examUid:originalFull.examUid,
  sourceArchiveFile:source,expectedSourceBlobSha1:blob(raw),expectedQuestionCount:questionCount,scope:'PARTIAL_UIDS',registryChanges:[],
  approval:{type:'META_PIPELINE_AUDIT',metadataReviewed:true,approvedBy:'fixture-current-audit-transport',metaPipelineAudit:structuredClone(originalFull.approval.metaPipelineAudit),evidenceRefs:auditRefs,
   sourceRebind:{schemaVersion:'archive-native-audit-source-preservation-v1',requestPath:currentAuditPath,priorCommit:fullPriorCommit,priorReceiptRef:priorRef}},
  items:auditOrdinals.map(n=>({questionUid:originalFull.appliedRecords[n-1].questionUid,sourceOrdinal:n,before:{},after:{},reason:'Preserve the exact remaining audited half.',evidenceRefs:auditRefs}))};
 f.put(currentAuditPath,currentAuditRequest);registerReviewedExamV2({root:f.root,request:currentAuditRequest,write:true});
 fs.unlinkSync(path.join(f.root,currentAuditPath));
 const priorPath=RECEIPTS+currentAuditId+'.json',prior=f.read(priorPath),priorBindingPath=RECEIPTS+currentAuditId+'.audit-source-binding.json',currentBank=structuredClone(f.bank);
 const currentCommit=f.checkpoint('actual mixed native and current audit subset snapshot');
 const requestId='audit-subset-cc-one-component',requestPath='.archive-meta-register/inbox/'+requestId+'.json',registeredPath=RECEIPTS+requestId+'.json';
 const allRefs=[f.ref(priorPath),f.ref(priorBindingPath),...fullRequest.approval.evidenceRefs];
 const refs=[...new Map(allRefs.map(r=>[r.path,r])).values()];
 f.bank[f.ordinal-1].crossConceptKeys=[...prior.appliedRecords.find(r=>r.questionUid===f.uid).crossConceptKeys,f.key];
 const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId,examUid:prior.examUid,sourceArchiveFile:source,
  expectedSourceBlobSha1:blob(f.writeBank()),expectedQuestionCount:questionCount,scope:'PARTIAL_UIDS',registryChanges:[],
  approval:{type:'META_PIPELINE_AUDIT',metadataReviewed:true,approvedBy:'fixture-subset-component-transport',metaPipelineAudit:structuredClone(prior.approval.metaPipelineAudit),evidenceRefs:refs,
   sourceRebind:{schemaVersion:AUDIT_SUBSET_CC_SCHEMA,requestPath,priorCommit:currentCommit,priorReceiptRef:f.ref(priorPath),component}},
  items:prior.appliedRecords.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,before:{},after:{},reason:'Retain current audit and append only its independently finalized CC.',evidenceRefs:refs}))};
 const save=()=>f.put(requestPath,request);save();const head=f.checkpoint('explicit subset CC transport request');
 const nativeArgs=n=>{const a=f.nativeArgs(n);a.question=structuredClone(f.bank[n-1]);a.previous=structuredClone(currentBank[n-1]);a.nativeSource.bank=structuredClone(f.bank);
  a.nativeSource.bytes=fs.readFileSync(path.join(f.root,f.sourcePath));a.nativeSource.blobSha1=blob(a.nativeSource.bytes);a.registry.integrationPatterns.add('SEQUENTIAL');
  a.pt=a.registry.problemTypes.get(a.current.problemTypeKey);a.tpl=a.registry.templates.get(a.current.templateKey);return a;};
 const nativeReceiptPath=RECEIPTS+nativeRequestId+'.json',nativeBindingPath=RECEIPTS+nativeRequestId+'.source-review-binding.json';
 const nativePreservationRequest=()=>{
  const previous=f.read(nativeReceiptPath),evidenceRefs=[f.ref(nativeReceiptPath),...previous.approval.evidenceRefs,
   ...(fs.existsSync(path.join(f.root,nativeBindingPath))?[f.ref(nativeBindingPath)]:[])];
  return{schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'preserve-current-native-half-after-cc',examUid:previous.examUid,
   sourceArchiveFile:source,expectedSourceBlobSha1:blob(fs.readFileSync(path.join(f.root,f.sourcePath))),expectedQuestionCount:questionCount,scope:'PARTIAL_UIDS',registryChanges:[],
   approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'fixture-existing-native-source-preservation',evidenceRefs,sourceRebind:{priorReceiptRef:f.ref(nativeReceiptPath)}},
   items:previous.appliedRecords.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,before:{},after:{},reason:'Preserve the actual issued native sibling cohort without new approval.',evidenceRefs}))};
 };
 return{...f,request,requestPath,registeredPath,prior,priorPath,priorBindingPath,priorCommit:currentCommit,currentBank,currentCommit,head,save,nativeArgs,
  fullPriorPath,fullPriorCommit,nativeRequest,currentAuditRequest,nativeOrdinals,auditOrdinals,nativeReceiptPath,nativeBindingPath,nativePreservationRequest,bindingPath:auditSubsetCcBindingPath(requestId),
  currentBefore:f.read(META),currentRuntimeBefore:f.read(RUNTIME),hash:p=>sha(fs.readFileSync(path.join(f.root,p)))};
}
