import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {auditedCcAppendFixture,materializeAuditConsumerInputs} from './helpers/audited-cc-append-fixture.mjs';
import {registerReviewedExamV2} from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {nativeReviewReceipt,planQuestion} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {auditCcBindingPath,isExplicitAuditCcAppendRequest,hasAuditCcAppendClaim,nativeAuditCcAppend} from '../archive/tools/meta-foundation/audited-cross-concept-append.mjs';
import {selectNativeRequests,selectPendingNativeRequests,rederiveNativePlans,nativeOutputManifest} from '../tools/ci/archive-pr-native-preview.mjs';
import {verifyChangedUidConsumerApproval} from '../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs';
import {loadVerifiedHistoricalAuditSnapshot} from '../archive/tools/meta-foundation/native-audit-preservation.mjs';
const META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json',RUNTIME='archive/data/meta-foundation/runtime/new-course-v1.json';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest('hex');
const omit=(row,fields)=>Object.fromEntries(Object.entries(row).filter(([k])=>!fields.includes(k)));
function native(f,n=2,{caughtUp=false}={}){const a=f.nativeArgs(n);a.nativeSource.blobSha1=blob(a.nativeSource.bytes);a.pt=a.registry.problemTypes.get(a.current.problemTypeKey);a.tpl=a.registry.templates.get(a.current.templateKey);if(caughtUp)a.previous=structuredClone(a.question);return a;}
function transportSource(f){f.request.expectedSourceBlobSha1=blob(f.writeBank());f.save();}
function snapshot(f){return [META,IDENTITY,RUNTIME,f.sourcePath,f.priorPath].filter(p=>fs.existsSync(path.join(f.root,p))).map(p=>[p,hash(fs.readFileSync(path.join(f.root,p)))]);}

test('audited CC append preserves the actual full audit and adds exactly one independently finalized component',t=>{
 const f=auditedCcAppendFixture(t,{questionCount:24}),before=f.read(META),ids=fs.readFileSync(path.join(f.root,IDENTITY)),original=fs.readFileSync(path.join(f.root,f.priorPath)),source=fs.readFileSync(path.join(f.root,f.sourcePath));
 const dry=registerReviewedExamV2({root:f.root,request:f.request});assert.equal(dry.status,'PASS');assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);assert.deepEqual(f.read(META),before);
 const written=registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(written.newMetadataApprovals,0);assert.equal(written.preservedMetadataApprovals,24);assert.equal(written.registryChangeCount,1);assert.equal(written.fingerprintRepairCount,0);
 const after=f.read(META),receipt=f.read(f.registeredPath),binding=f.read(auditCcBindingPath(f.request.requestId));
 assert.deepEqual(fs.readFileSync(path.join(f.root,IDENTITY)),ids);assert.deepEqual(fs.readFileSync(path.join(f.root,f.priorPath)),original);assert.deepEqual(fs.readFileSync(path.join(f.root,f.sourcePath)),source);
 for(let i=0;i<24;i++){
  const changed=['metadataRevision','approvalEvidence',...(i===f.ordinal-1?['crossConceptKeys','crossConceptApprovalComponents']:[])];
  assert.deepEqual(omit(after.records[i],changed),omit(before.records[i],changed));
  assert.equal(after.records[i].metadataApprovalType,'META_PIPELINE_AUDIT');assert.equal(after.records[i].integrationPattern,'NONE','different native integration is not an authority for this operation');
 }
 assert.deepEqual(after.records[f.ordinal-1].crossConceptKeys,['CC_NEW','CC_APPEND']);assert.equal(after.records[f.ordinal-1].crossConceptApprovalComponents.appended.key,'CC_APPEND');
 assert.deepEqual(after.records[f.ordinal-1].fieldStatus,before.records[f.ordinal-1].fieldStatus);assert.equal(receipt.auditCrossConceptAppend.finalizedCrossConceptApplications,1);
 assert.equal(binding.records.length,24);assert.equal(binding.records.filter(r=>r.appendedCrossConceptKeys.length).length,1);
 const replay=registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(replay.replay,true);assert.deepEqual(replay.plannedPaths,[]);
 for(let n=1;n<=24;n++){const a=native(f,n);assert.equal(nativeReviewReceipt(a),f.registeredPath);assert.equal(planQuestion(a).status,'ALREADY_REGISTERED');}
});

test('audited CC native receipt row mismatch rejects before component loading while valid reuse still loads authority',t=>{
 const f=auditedCcAppendFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 const a=native(f),args={...a,ownerPack:a.pt.ownerPack},target=path.join(f.root,auditCcBindingPath(f.request.requestId));
 const read=fs.readFileSync;let componentReads=0;
 fs.readFileSync=function(file,...rest){if(String(file)===target)componentReads++;return read.call(this,file,...rest);};
 try {
  assert.equal(nativeAuditCcAppend({...args,current:{...args.current,metadataRevision:args.current.metadataRevision+':changed'}}),null);
  assert.equal(componentReads,0);
  assert.equal(nativeAuditCcAppend(args),f.registeredPath);
  assert(componentReads>0,'valid reuse must still load and authenticate the complete component');
 } finally {fs.readFileSync=read;}
});

test('audited CC source and issued identity/runtime negatives reject before component loading',t=>{
 const f=auditedCcAppendFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 const a=native(f),args={...a,ownerPack:a.pt.ownerPack},before=snapshot(f),
  receiptFile=path.join(f.root,f.registeredPath),issuedRaw=fs.readFileSync(receiptFile),
  target=path.join(f.root,auditCcBindingPath(f.request.requestId));
 const cases=[
  ['changed source bytes',(value,receipt)=>{value.nativeSource={...value.nativeSource,bytes:Buffer.concat([value.nativeSource.bytes,Buffer.from('\n')])};}],
  ['wrong issued source SHA',(value,receipt)=>{receipt.sourceRawSha256='0'.repeat(64);}],
  ['wrong issued source blob',(value,receipt)=>{receipt.sourceBlobSha1='0'.repeat(40);}],
  ['changed identity',(value,receipt)=>{value.identity={...value.identity,sourceFingerprint:'0'.repeat(64)};}],
  ['changed runtime',(value,receipt)=>{value.nativeSource={...value.nativeSource,runtimeRecord:{...value.nativeSource.runtimeRecord,metaFoundationPackVersion:'999.0.0'}};}],
  ['duplicate issued identity',(value,receipt)=>{receipt.appliedIdentityRecords.push(structuredClone(receipt.appliedIdentityRecords.find(r=>r.questionUid===value.current.questionUid)));}],
  ['duplicate issued runtime',(value,receipt)=>{receipt.runtimeRecords.push(structuredClone(receipt.runtimeRecords.find(r=>r.questionUid===value.current.questionUid)));}]
 ];
 const read=fs.readFileSync;let componentReads=0;
 fs.readFileSync=function(file,...rest){if(String(file)===target)componentReads++;return read.call(this,file,...rest);};
 try {
  for(const [label,change]of cases){
   const value={...args},receipt=JSON.parse(issuedRaw);change(value,receipt);f.put(f.registeredPath,receipt);componentReads=0;
   assert.equal(nativeAuditCcAppend(value),null,label);assert.equal(componentReads,0,label);
   assert.equal(nativeReviewReceipt(value),null,label+' must not reuse an older approval');
   fs.writeFileSync(receiptFile,issuedRaw);
  }
  componentReads=0;
  assert.equal(nativeAuditCcAppend(args),f.registeredPath);
  assert(componentReads>0,'normal reuse still verifies the full component authority');
 } finally {fs.readFileSync=read;fs.writeFileSync(receiptFile,issuedRaw);}
 assert.deepEqual(snapshot(f),before);assert.deepEqual(fs.readFileSync(receiptFile),issuedRaw);
});

const badInputs=[
 ['new QA claim',f=>{f.request.approval.newMathematicalQa=true;f.save();}],
 ['new review pass claim',f=>{f.request.approval.reviewPassCount=2;f.save();}],
 ['top-level difficulty judgment claim',f=>{f.request.newDifficultyJudgments=1;f.save();}],
 ['delete retained CC',f=>{f.bank[1].crossConceptKeys=['CC_APPEND'];transportSource(f);}],
 ['reorder retained and appended CC',f=>{f.bank[1].crossConceptKeys=['CC_APPEND','CC_NEW'];transportSource(f);}],
 ['add a third key',f=>{f.bank[1].crossConceptKeys.push('CC_EXTRA');transportSource(f);}],
 ['alter another source object',f=>{f.bank[0].tagStatus='reviewed_pass';transportSource(f);}],
 ['apply native integration to audited value',f=>{f.bank[1].integrationPattern='SEQUENTIAL';transportSource(f);}],
 ['alter selected student text',f=>{f.bank[1].content+=' changed';transportSource(f);}],
 ['change difficulty',f=>{const d=f.read(META);d.records[1].difficultyBucket=5;f.put(META,d);}],
 ['change curriculum',f=>{const d=f.read(META);d.records[1].curriculumKey='2022';f.put(META,d);}],
 ['replace original audit status',f=>{const d=f.read(META);d.records[1].metadataStatus='approved_final_qa';f.put(META,d);}],
 ['replace original kind',f=>{f.request.approval.type='FINAL_QA';f.save();}],
 ['wrong selected UID',f=>{f.request.approval.sourceRebind.component.questionUid=f.prior.appliedRecords[0].questionUid;f.save();}],
 ['wrong selected ordinal',f=>{f.request.approval.sourceRebind.component.sourceOrdinal=1;f.save();}],
 ['partial source scope',f=>{f.request.scope='PARTIAL_UIDS';f.save();}],
 ['omit retained source UID',f=>{f.request.items.pop();f.save();}],
 ['duplicate retained source UID',f=>{f.request.items[2]=structuredClone(f.request.items[0]);f.save();}],
 ['cycle to own receipt',f=>{f.request.approval.sourceRebind.priorReceiptRef.path=f.registeredPath;f.save();}],
 ['missing original audit proof',f=>fs.unlinkSync(path.join(f.root,f.priorPath))],
 ['changed original audit proof',f=>{const d=f.read(f.priorPath);d.appliedRecords[1].crossConceptKeys=[];f.put(f.priorPath,d);}],
 ['missing native component proof',f=>fs.unlinkSync(path.join(f.root,f.nativePath))],
 ['changed immutable native proof',f=>{const d=f.read(f.nativePath);d.items[1].after.crossConceptKeys=['CC_FAKE'];f.put(f.nativePath,d);}],
 ['missing independent finalization',f=>fs.unlinkSync(path.join(f.root,f.finalPath))],
 ['stale renderer',f=>f.put('archive/assets/audit-cc-test.svg','<svg xmlns="http://www.w3.org/2000/svg"/>')],
 ['unapproved definition text',f=>{f.request.registryChanges[0].after.definition='unreviewed';f.save();}],
 ['another registry operation',f=>{f.request.registryChanges.push(structuredClone(f.request.registryChanges[0]));f.save();}],
 ['ordinary sourceReview bypass',f=>{f.request.items[1].sourceReview={schemaVersion:'claim-only'};f.save();}],
 ['remove typed contract',f=>{delete f.request.approval.sourceRebind;f.save();}],
];
for(const[name,mutate]of badInputs)test('audited CC append rejects '+name+' before writes',t=>{
 const f=auditedCcAppendFixture(t);mutate(f);const before=snapshot(f).filter(([p])=>fs.existsSync(path.join(f.root,p)));
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}));
 for(const[p,h]of before)assert.equal(hash(fs.readFileSync(path.join(f.root,p))),h);
 assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
});

for(const[name,body]of [
 ['external SVG href','<image href="https://example.invalid/changed.png"/>'],
 ['nested local SVG href','<use href="other.svg#shape"/>'],
 ['SVG CSS dependency','<style>.a{fill:url(other.svg#paint)}</style>'],
 ['SVG imported style','<style>@import "other.css";</style>'],
 ['SVG escaped CSS dependency','<style>.a{fill:u\\72l(other.svg#paint)}</style>'],
 ['SVG entity declaration','<!ENTITY shape SYSTEM "other.svg">'],
 ['SVG foreign renderer','<foreignObject><img src="data:image/png;base64,AA=="/></foreignObject>'],
])test('audited CC rejects immutable but unbound '+name,t=>{
 const f=auditedCcAppendFixture(t,{assetText:'<svg xmlns="http://www.w3.org/2000/svg">'+body+'</svg>'});
 const before=snapshot(f);assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/unsupported nested SVG dependency/);
 assert.deepEqual(snapshot(f),before);assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
});

test('an already installed exact definition is reused without another registry mutation',t=>{
 const f=auditedCcAppendFixture(t),change=f.request.registryChanges[0],doc=f.read(change.path);
 doc.concepts.push(structuredClone(change.after));f.put(change.path,doc);f.request.registryChanges=[];f.save();
 const result=registerReviewedExamV2({root:f.root,request:f.request,write:true});
 assert.equal(result.registryChangeCount,0);assert.equal(result.newMetadataApprovals,0);
 assert.deepEqual(f.read(META).records[1].crossConceptKeys,['CC_NEW','CC_APPEND']);
 assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).replay,true);
 assert.equal(nativeReviewReceipt(native(f)),f.registeredPath);
});

for(const[name,mutateNative,error]of [
 ['an immutable native source fingerprint disagreement',(doc,ordinal)=>{doc.items[ordinal-1].sourceEvidence={sourceGitBlobSha:doc.sourceGitBlobSha,fingerprints:[]};},/native per-item source fingerprints mismatch/],
 ['an explicit native source hold',(doc,ordinal)=>{doc.items[ordinal-1].contentDebt=['SOURCE_CONTENT_HOLD'];},/source\/content\/difficulty hold/],
 ['a conflicting native primary',(doc,ordinal)=>{doc.items[ordinal-1].after.templateKey='TPL_OTHER';},/primary\/curriculum disagrees/],
])test('audited CC rejects '+name+' despite a self-consistent finalization digest',t=>{
 const f=auditedCcAppendFixture(t,{mutateNative});const before=snapshot(f);
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),error);assert.deepEqual(snapshot(f),before);
});

test('a later commit cannot turn a changed non-selected renderer into original audit authority',t=>{
 const f=auditedCcAppendFixture(t),asset='archive/assets/audit-cc-other.svg';
 f.put(f.sourcePath,'window.questions='+JSON.stringify(f.oldBank)+';\n');
 f.put(asset,'<svg xmlns="http://www.w3.org/2000/svg"><text>unreviewed renderer content</text></svg>');
 const later=f.checkpoint('later asset drift while original audit source and receipt remain unchanged');
 f.request.approval.sourceRebind.priorCommit=later;f.writeBank();
 for(const refs of [f.request.approval.evidenceRefs,...f.request.items.map(r=>r.evidenceRefs)])
  for(const ref of refs)if(ref.path===asset)ref.sha256=f.ref(asset).sha256;
 f.save();const before=snapshot(f);
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/renderer bytes differ from the original audit history/);
 assert.deepEqual(snapshot(f),before);assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
});

const damaged=[
 ['an extra issued QA claim',f=>{const d=f.read(f.registeredPath);d.newMathematicalQa=true;f.put(f.registeredPath,d);}],
 ['missing durable component',f=>fs.unlinkSync(path.join(f.root,auditCcBindingPath(f.request.requestId)))],
 ['missing receipt component summary',f=>{const d=f.read(f.registeredPath);delete d.auditCrossConceptAppend;f.put(f.registeredPath,d);}],
 ['changed selected component provenance',f=>{const d=f.read(META);d.records[1].crossConceptApprovalComponents.appended.key='CC_NEW';f.put(META,d);}],
 ['changed output digest',f=>{const d=f.read(f.registeredPath);d.outputDigests=d.outputDigests.filter(r=>r.path!==auditCcBindingPath(f.request.requestId));f.put(f.registeredPath,d);}],
 ['mutated native proof after write',f=>f.put(f.nativePath,{schemaVersion:'fake'})],
 ['mutated independent proof after write',f=>f.put(f.finalPath,{schemaVersion:'fake'})],
 ['changed source after write',f=>{f.bank[1].crossConceptKeys=['CC_APPEND'];f.writeBank();}],
 ['extra UID in issued receipt',f=>{const d=f.read(f.registeredPath);d.appliedRecords.push(structuredClone(d.appliedRecords[0]));f.put(f.registeredPath,d);}],
];
for(const[name,mutate]of damaged)test('issued audited CC append rejects '+name+' and refuses producer fallback',t=>{
 const f=auditedCcAppendFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 assert.equal(nativeReviewReceipt(native(f)),f.registeredPath,'warm current JSON and immutable indexes first');mutate(f);
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}));
 const a=native(f);assert.equal(nativeReviewReceipt(a),null);assert.equal(planQuestion(a).status,'SUPPLEMENT_PENDING');
});

test('historical audit UID indexes retain fresh receipt checks and reject a duplicate in a different immutable snapshot',t=>{
 const f=auditedCcAppendFixture(t),priorReceiptRef=f.request.approval.sourceRebind.priorReceiptRef,
  args={root:f.root,priorCommit:f.priorCommit,priorReceiptRef},priorRaw=fs.readFileSync(path.join(f.root,f.priorPath));
 assert.equal(loadVerifiedHistoricalAuditSnapshot(args).prior.requestId,f.prior.requestId);
 f.put(f.priorPath,{...f.read(f.priorPath),extraUnapprovedField:true});
 assert.throws(()=>loadVerifiedHistoricalAuditSnapshot(args),/receipt SHA mismatch/);
 fs.writeFileSync(path.join(f.root,f.priorPath),priorRaw);
 assert.equal(loadVerifiedHistoricalAuditSnapshot(args).prior.requestId,f.prior.requestId);
 f.put(f.sourcePath,'window.questions='+JSON.stringify(f.oldBank)+';\n');
 const metadata=f.read(META);metadata.records.push(structuredClone(metadata.records[0]));f.put(META,metadata);
 const changed=f.checkpoint('Different immutable snapshot with duplicate metadata UID');
 assert.throws(()=>loadVerifiedHistoricalAuditSnapshot({...args,priorCommit:changed}),/historical current metadata missing\/duplicate/);
 assert.equal(loadVerifiedHistoricalAuditSnapshot(args).prior.requestId,f.prior.requestId,'original immutable snapshot remains independently verified');
 assert.deepEqual(fs.readFileSync(path.join(f.root,f.priorPath)),priorRaw);
});

for(const restoreSource of [false,true])for(const removeChild of [false,true])test('combined CC marker deletion cannot borrow the old audit: child missing='+removeChild+', source restored='+restoreSource,t=>{
 const f=auditedCcAppendFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 const bindingPath=auditCcBindingPath(f.request.requestId),receipt=f.read(f.registeredPath);
 delete receipt.approval.sourceRebind;delete receipt.auditCrossConceptAppend;delete receipt.newMetadataApprovals;delete receipt.preservedMetadataApprovals;
 receipt.outputDigests=receipt.outputDigests.filter(r=>r.path!==bindingPath);
 for(const records of [receipt.appliedRecords,receipt.runtimeRecords])for(const row of records){const old=f.prior.appliedRecords.find(r=>r.questionUid===row.questionUid);delete row.crossConceptApprovalComponents;row.approvalEvidence=old.approvalEvidence;row.metadataRevision=old.metadataRevision;}
 f.put(f.registeredPath,receipt);
 for(const p of [META,RUNTIME]){const d=f.read(p);for(const row of d.records){const old=f.prior.appliedRecords.find(r=>r.questionUid===row.questionUid);delete row.crossConceptApprovalComponents;row.approvalEvidence=old.approvalEvidence;row.metadataRevision=old.metadataRevision;}f.put(p,d);}
 fs.unlinkSync(path.join(f.root,bindingPath));if(removeChild)fs.unlinkSync(path.join(f.root,f.registeredPath));
 if(restoreSource){f.bank.splice(0,f.bank.length,...structuredClone(f.oldBank));f.writeBank();}
 for(const caughtUp of [false,true])for(const n of restoreSource?[2]:[2,1,3]){const a=native(f,n,{caughtUp});assert.equal(nativeReviewReceipt(a),null);const p=planQuestion(a);assert.equal(p.status,'SUPPLEMENT_PENDING');assert(p.reasons.includes('AUDITED_CC_COMPONENT_REVALIDATION_FAILED'),JSON.stringify(p));}
 if(restoreSource)for(const n of [1,3])assert.equal(nativeReviewReceipt(native(f,n)),f.priorPath,'a fully restored, unchanged old UID retains only its original audit');
});

test('audited CC request survives consumption only with its exact sealed request and both authority components',t=>{
 const f=auditedCcAppendFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});fs.unlinkSync(path.join(f.root,f.requestPath));
 assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).replay,true);assert.equal(nativeReviewReceipt(native(f)),f.registeredPath);
 f.put(f.requestPath,{...f.request,expectedQuestionCount:1});assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request}));assert.equal(nativeReviewReceipt(native(f)),null);
});

test('an unverified ordinary audit revision does not excuse a changed CC from its original authority',t=>{
 const f=auditedCcAppendFixture(t);f.bank.splice(0,f.bank.length,...structuredClone(f.oldBank));f.writeBank();
 const a=native(f);a.current.crossConceptKeys=['CC_NEW','CC_APPEND'];
 a.current.metadataRevision='meta-foundation:NEW_COURSE@1.0.0:exam-meta_pipeline_audit-v2:other-audit';
 a.current.approvalEvidence=[...a.current.approvalEvidence,'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/other-audit.json'];
 a.nativeSource.runtimeRecord.crossConceptKeys=structuredClone(a.current.crossConceptKeys);
 a.nativeSource.runtimeRecord.metadataRevision=a.current.metadataRevision;
 a.nativeSource.runtimeRecord.approvalEvidence=structuredClone(a.current.approvalEvidence);
 assert.equal(hasAuditCcAppendClaim({root:f.root,current:a.current,runtimeRecord:a.nativeSource.runtimeRecord,nativeSource:a.nativeSource}),true);
 assert.equal(nativeReviewReceipt(a),null,'a new revision label is not another approval');
 assert.equal(planQuestion(a).status,'SUPPLEMENT_PENDING');
});

const strippedVariants=[
 ['issued revision deleted',()=>{}],
 ['revision and all evidence deleted',row=>{delete row.approvalEvidence;}],
 ['typed ancestor ref removed but original audit ref retained',row=>{row.approvalEvidence=row.approvalEvidence.filter(p=>!p.endsWith('/preserve-audit.json'));}],
 ['only a nonexistent ordinary receipt ref retained',row=>{row.approvalEvidence=['archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/unverified-audit.json'];}],
 ['forged ordinary revision',row=>{row.metadataRevision='meta-foundation:NEW_COURSE@1.0.0:exam-meta_pipeline_audit-v2:unverified-audit';}],
 ['forged ordinary revision and receipt ref',row=>{row.metadataRevision='meta-foundation:NEW_COURSE@1.0.0:exam-meta_pipeline_audit-v2:unverified-audit';row.approvalEvidence=['archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/unverified-audit.json'];}],
 ['revision plus audit status drift',row=>{row.metadataStatus='registered_merged_source';}],
 ['revision plus rationale drift',row=>{row.primaryMethod='Unverified additional method';}],
 ['revision plus labels drift',row=>{row.L3='Unverified primary label';}],
 ['revision plus kind/status drift',row=>{row.metadataApprovalType='FINAL_QA';row.metadataStatus='approved_final_qa';row.reviewStatus='reviewed_pass';row.tagStatus='reviewed_pass';}],
 ['prior receipt locally forged',()=>{},(f)=>{const r=f.read(f.priorPath);r.appliedRecords[1].crossConceptKeys=['CC_NEW','CC_APPEND'];f.put(f.priorPath,r);}],
 ['prior receipt locally missing',()=>{},f=>fs.unlinkSync(path.join(f.root,f.priorPath))],
 ['only runtime retains the added CC',()=>{},f=>{const d=f.read(META);d.records[1].crossConceptKeys=['CC_NEW'];f.put(META,d);}],
 ['only metadata retains the added CC',()=>{},f=>{const d=f.read(RUNTIME);d.records[1].crossConceptKeys=['CC_NEW'];f.put(RUNTIME,d);}],
];
for(const[name,mutate,alterEvidence]of strippedVariants)test('original audit authority blocks complete component erasure: '+name,t=>{
 const f=auditedCcAppendFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 for(const p of [META,RUNTIME]){
  const d=f.read(p);for(const row of d.records){const old=(p===META?f.prior.appliedRecords:f.prior.runtimeRecords).find(r=>r.questionUid===row.questionUid);
   delete row.crossConceptApprovalComponents;row.approvalEvidence=structuredClone(old.approvalEvidence);delete row.metadataRevision;mutate(row);
  }f.put(p,d);
 }
 for(const p of [auditCcBindingPath(f.request.requestId),f.registeredPath,f.requestPath])fs.unlinkSync(path.join(f.root,p));
 f.bank.splice(0,f.bank.length,...structuredClone(f.oldBank));f.writeBank();if(alterEvidence)alterEvidence(f);
 for(const caughtUp of [false,true]){
  const a=native(f,2,{caughtUp});assert(a.registry.bindingRows.every(r=>r.L1&&r.L2),'the producer has complete ACTIVE labels; refusal must come from authority');
  assert.equal(nativeReviewReceipt(a),null);const result=planQuestion(a);
  assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));
  assert(result.reasons.includes('AUDITED_CC_COMPONENT_REVALIDATION_FAILED'),JSON.stringify(result));
 }
});

test('restoring the entire actual old audit remains valid native reuse after a removed component operation',t=>{
 const f=auditedCcAppendFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 for(const[p,rows]of [[META,f.prior.appliedRecords],[RUNTIME,f.prior.runtimeRecords]]){const d=f.read(p);d.records=structuredClone(rows);f.put(p,d);}
 for(const p of [auditCcBindingPath(f.request.requestId),f.registeredPath,f.requestPath])fs.unlinkSync(path.join(f.root,p));
 f.bank.splice(0,f.bank.length,...structuredClone(f.oldBank));f.writeBank();
 for(let n=1;n<=3;n++){const a=native(f,n);assert.equal(nativeReviewReceipt(a),f.priorPath);assert.equal(planQuestion(a).status,'ALREADY_REGISTERED');}
});

test('audited CC has exact changed, pending and inherited preview selection and official shadow outputs',t=>{
 const f=auditedCcAppendFixture(t);assert.equal(isExplicitAuditCcAppendRequest(f.request),true);
 const requests=selectNativeRequests({root:f.root,baseSha:f.finalCommit,headSha:f.head});assert.equal(requests.length,1);assert.equal(requests[0].questionCount,3);
 const consumed='.archive-meta-register/inbox/preserved-difficulty.json';
 assert.equal(fs.existsSync(path.join(f.root,consumed)),false);
 assert.equal(requests[0].evidence.some(ref=>ref.path===consumed),false,'a historical replay must not recreate a consumed inbox request');
 assert.deepEqual(selectPendingNativeRequests({root:f.root,headSha:f.head}),requests);
 const calls=[],shadow=rederiveNativePlans({root:f.root,requests,run:(_binary,args,root)=>{assert.notEqual(root,f.root);calls.push(args.includes('--write')?'write':'dry');const request=JSON.parse(fs.readFileSync(path.join(root,args[args.indexOf('--request')+1]),'utf8'));return JSON.stringify(registerReviewedExamV2({root,request,write:args.includes('--write')}));}});
 assert.deepEqual(calls,['dry','write']);const written=registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.deepEqual(shadow.outputs,nativeOutputManifest(f.root,shadow.plans));assert(shadow.outputs.some(r=>r.path===auditCcBindingPath(f.request.requestId)));
 f.put('later-code-only.txt','synthetic code');const later=f.checkpoint('synthetic code-only follow-up');const inherited=selectNativeRequests({root:f.root,baseSha:f.head,headSha:later});assert.equal(inherited.length,1);
 assert.equal(inherited[0].kind,'native-approval-preservation');assert.equal(written.preservedMetadataApprovals,3);
});

test('audited CC preview cannot borrow a prior receipt absent from its exact declared historical commit',t=>{
 const f=auditedCcAppendFixture(t),original=fs.readFileSync(path.join(f.root,f.priorPath));
 fs.unlinkSync(path.join(f.root,f.priorPath));
 const missing=f.checkpoint('synthetic history without the claimed prior receipt');
 fs.writeFileSync(path.join(f.root,f.priorPath),original);f.request.approval.sourceRebind.priorCommit=missing;f.save();
 const head=f.checkpoint('synthetic truthful current bytes with a false historical receipt binding');
 assert.deepEqual(fs.readFileSync(path.join(f.root,f.priorPath)),original);
 assert.throws(()=>selectNativeRequests({root:f.root,baseSha:f.finalCommit,headSha:head}),/HISTORICAL_AUDIT_RECEIPT_NOT_FIXED/);
 assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
});

test('audited CC exact historical receipt does not waive ordinary current approval evidence',t=>{
 const f=auditedCcAppendFixture(t);fs.unlinkSync(path.join(f.root,f.nativePath));
 const head=f.checkpoint('synthetic missing current native approval evidence');
 assert.throws(()=>selectNativeRequests({root:f.root,baseSha:f.finalCommit,headSha:head}),/MISSING_FILE/);
 assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
});

test('audited CC reaches actual canonical and changed-UID Consumers without promoting audit status',t=>{
 const f=auditedCcAppendFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});materializeAuditConsumerInputs(f);
 const projected=registerReviewedExamV2({root:f.root,request:f.request,verifyProjection:true});assert.equal(projected.consumerSearchStatus,'STATIC_VALUES_VERIFIED');
 const result=verifyChangedUidConsumerApproval({root:f.root,requestPaths:[f.requestPath]});assert.equal(result.status,'PASS',JSON.stringify(result.failures));assert.deepEqual(result.counts,{changed:3,checked:3,passed:3,skippedUnchanged:0});
 assert.equal(result.exams[0].approvalType,'META_PIPELINE_AUDIT');assert.equal(result.exams[0].newMetadataApprovals,0);
 const receipt=f.read(f.registeredPath);delete receipt.auditCrossConceptAppend;f.put(f.registeredPath,receipt);materializeAuditConsumerInputs(f);
 const bad=verifyChangedUidConsumerApproval({root:f.root,requestPaths:[f.requestPath]});assert.equal(bad.status,'FAIL');assert.equal(bad.counts.passed,0);
});
