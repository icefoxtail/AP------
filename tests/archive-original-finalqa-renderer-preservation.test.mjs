import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { originalRendererFixture } from './helpers/original-finalqa-renderer-fixture.mjs';
import { registerReviewedExamV2 } from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import { loadActiveMetaRegistry,validateActiveMetaFields } from '../archive/tools/meta-foundation/active-registry.mjs';
import { nativeReviewReceipt,loadBank,planQuestion } from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import { loadOriginalFinalQaRendererPreservation,isExplicitOriginalRendererRequest } from '../archive/tools/meta-foundation/original-finalqa-renderer-preservation.mjs';
import { selectNativeRequests,selectPendingNativeRequests,rederiveNativePlans,nativeOutputManifest } from '../tools/ci/archive-pr-native-preview.mjs';
import { FULL_SOURCE_SUBSET_SCHEMA,FULL_SOURCE_SUBSET_EVIDENCE_SCHEMA,fullSourceSubsetEvidencePath } from '../archive/tools/meta-foundation/source-subset-preservation.mjs';

const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const without=(value,fields)=>Object.fromEntries(Object.entries(value).filter(([key])=>!fields.includes(key)));

function nativeArgs(f,{previous='current'}={}) {
  const meta=f.read(f.META),identityMap=f.read(f.identityPath),runtime=f.read(f.runtimePath),bytes=fs.readFileSync(path.join(f.root,f.sourcePath)),bank=loadBank(bytes.toString());
  const current=meta.records.find(r=>r.questionUid==='uid1'),identity=identityMap.records.find(r=>r.questionUid==='uid1'),registry=loadActiveMetaRegistry(f.root);
  return {nativeSource:{root:f.root,bytes,blobSha1:blob(bytes),bank,identityMap,
      identityByJoin:new Map(identityMap.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r])),runtimeRecord:runtime.records.find(r=>r.questionUid==='uid1'),runtimeStatus:runtime.status},
    question:bank[0],previous:previous==='original'?f.priorBank[0]:bank[0],current,identity,source:f.request.sourceArchiveFile,ordinal:1,
    pt:registry.problemTypes.get(current.problemTypeKey),tpl:registry.templates.get(current.templateKey),ownerPack:current.metaFoundationPackId,registry};
}
function autoPlan(f,options={}) {
  const args=nativeArgs(f,options);
  return planQuestion({...args,validate:validateActiveMetaFields,runtimeOwner:args.current.metaFoundationPackId,priorReceipt:null});
}

test('original renderer preservation replays every original full approval and changes only selected fingerprints/provenance',t=>{
  const f=originalRendererFixture(t),metaBefore=f.read(f.META),identityBefore=f.read(f.identityPath),runtimeBefore=f.read(f.runtimePath);
  const sourceBefore=fs.readFileSync(path.join(f.root,f.sourcePath)),registryBefore=fs.readFileSync(path.join(f.root,'archive/data/meta-foundation/canonical/registry_index.json'));
  const args=nativeArgs(f),calls=[];
  loadOriginalFinalQaRendererPreservation({root:f.root,request:f.request,bytes:args.nativeSource.bytes,bank:args.nativeSource.bank,nativeSource:args.nativeSource,registry:args.registry,
    revalidateLeaf:ctx=>{calls.push(ctx.ordinal);return nativeReviewReceipt({source:f.request.sourceArchiveFile,registry:args.registry,...ctx});}});
  assert.deepEqual(calls,[1,2],'the original full approval must be replayed; a selected-row flag is insufficient');
  const dry=registerReviewedExamV2({root:f.root,request:f.request});
  assert.deepEqual([dry.newMetadataApprovals,dry.preservedMetadataApprovals,dry.expectedQuestionCount,dry.totalQuestions],[0,1,2,1]);
  assert.deepEqual(f.read(f.META),metaBefore);assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
  const written=registerReviewedExamV2({root:f.root,request:f.request,write:true});
  assert.equal(written.registryChangeCount,0);assert.equal(written.fingerprintRepairCount,1);
  const receipt=f.read(f.receiptPath),after=f.read(f.META),identityAfter=f.read(f.identityPath),runtimeAfter=f.read(f.runtimePath);
  assert.equal(receipt.approval.type,'FINAL_QA');assert.equal(receipt.preservedMetadataApprovals,1);assert.equal(receipt.newMetadataApprovals,0);
  assert.equal(receipt.totalQuestions,1);assert.equal(receipt.expectedQuestionCount,2);assert.equal(receipt.fingerprintRepairs[0].sourceReview,undefined);
  assert.deepEqual(without(after.records[0],['sourceFingerprint','contentFingerprint','metadataRevision','approvalEvidence']),without(metaBefore.records[0],['sourceFingerprint','contentFingerprint','metadataRevision','approvalEvidence']));
  assert.equal(after.records[0].difficultyBucket,4,'the earlier reviewed difficulty stays unchanged');
  assert.deepEqual(after.records[1],metaBefore.records[1]);assert.deepEqual(identityAfter.records[1],identityBefore.records[1]);
  assert.deepEqual(without(identityAfter.records[0],['sourceFingerprint']),without(identityBefore.records[0],['sourceFingerprint']));
  assert.deepEqual(runtimeAfter.records.find(r=>r.questionUid==='uid2'),runtimeBefore.records.find(r=>r.questionUid==='uid2'));
  assert.deepEqual(without(runtimeAfter.records.find(r=>r.questionUid==='uid1'),['sourceFingerprint','contentFingerprint','approvedSourceFingerprint','metadataRevision','approvalEvidence']),
    without(runtimeBefore.records.find(r=>r.questionUid==='uid1'),['sourceFingerprint','contentFingerprint','approvedSourceFingerprint','metadataRevision','approvalEvidence']));
  assert.deepEqual(fs.readFileSync(path.join(f.root,f.sourcePath)),sourceBefore);
  assert.deepEqual(fs.readFileSync(path.join(f.root,f.priorPath)),f.priorRaw);
  assert.deepEqual(fs.readFileSync(path.join(f.root,'archive/data/meta-foundation/canonical/registry_index.json')),registryBefore);
  assert.equal(f.prior.scope,undefined);assert.equal(f.prior.approval.reuse.mode,'EXACT_PRIOR_FINAL_QA_PLUS_REVIEWED_DIFFICULTY');
  assert(receipt.appliedRecords[0].approvalEvidence.includes(f.bindingPath));assert(receipt.runtimeRecords[0].approvalEvidence.includes(f.bindingPath));
  const frozen=new Map(written.plannedPaths.map(p=>[p,sha(fs.readFileSync(path.join(f.root,p)))]));
  const replay=registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(replay.replay,true);assert.deepEqual(replay.plannedPaths,[]);
  for(const[p,digest]of frozen)assert.equal(sha(fs.readFileSync(path.join(f.root,p))),digest);
  for(const previous of ['original','current']){
    assert.equal(nativeReviewReceipt(nativeArgs(f,{previous})),f.receiptPath);
    const planned=autoPlan(f,{previous});assert.equal(planned.status,'ALREADY_REGISTERED',JSON.stringify(planned));assert.equal(planned.nativeReviewReceipt,f.receiptPath);
  }
});

test('original renderer preservation supports inspected display-size-only changes without replacing identity fingerprints',t=>{
  const f=originalRendererFixture(t,{sizeOnly:true}),identityBefore=f.read(f.identityPath),metaBefore=f.read(f.META);
  assert.deepEqual(f.review.rows[0].changedFields,['imageSize']);
  assert.deepEqual(f.review.rows[0].priorAssets,f.review.rows[0].currentAssets);
  const dry=registerReviewedExamV2({root:f.root,request:f.request});
  assert.deepEqual([dry.newMetadataApprovals,dry.preservedMetadataApprovals],[0,1]);
  registerReviewedExamV2({root:f.root,request:f.request,write:true});
  assert.deepEqual(f.read(f.identityPath),identityBefore);
  assert.deepEqual(without(f.read(f.META).records[0],['metadataRevision','approvalEvidence']),without(metaBefore.records[0],['metadataRevision','approvalEvidence']));
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).replay,true);
  assert.equal(nativeReviewReceipt(nativeArgs(f)),f.receiptPath);
  assert.equal(autoPlan(f).status,'ALREADY_REGISTERED');
});

for(const rendererFirst of [false,true])test('original renderer and unchanged full-source subset coexist in either order: rendererFirst='+rendererFirst,t=>{
  const f=originalRendererFixture(t),requestId='preserve-original-unchanged',proofPath=fullSourceSubsetEvidencePath(requestId);
  const proof={schemaVersion:FULL_SOURCE_SUBSET_EVIDENCE_SCHEMA,scope:'STRICT_SUBSET_OF_PRIOR_FULL_FINAL_QA',requestId,examUid:f.prior.examUid,
    sourceArchiveFile:f.prior.sourceArchiveFile,expectedQuestionCount:2,priorReceiptRef:f.priorRef,priorFullQuestionCount:2,priorReuseProofRef:f.reuseRef,
    selectedUidCount:1,selected:[{questionUid:'uid2',sourceOrdinal:2}],excluded:[{questionUid:'uid1',sourceOrdinal:1}],
    priorSourceBlobSha1:f.prior.sourceBlobSha1,priorSourceRawSha256:f.prior.sourceRawSha256,
    currentSourceBlobSha1:blob(Buffer.from(f.currentBytes)),currentSourceRawSha256:sha(f.currentBytes),
    newMetadataApprovals:0,newMathematicalQa:false,newReviewPassCount:0};
  f.put(proofPath,proof);const proofRef={path:proofPath,sha256:sha(fs.readFileSync(path.join(f.root,proofPath)))};
  const subset={schemaVersion:f.request.schemaVersion,requestId,examUid:f.prior.examUid,scope:'PARTIAL_UIDS',sourceArchiveFile:f.prior.sourceArchiveFile,
    expectedQuestionCount:2,expectedSourceBlobSha1:f.request.expectedSourceBlobSha1,registryChanges:[],
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic unchanged-subset transport',evidenceRefs:[f.priorRef,f.reuseRef,proofRef],
      sourceRebind:{schemaVersion:FULL_SOURCE_SUBSET_SCHEMA,priorReceiptRef:f.priorRef,subsetEvidenceRef:proofRef}},
    items:[{questionUid:'uid2',sourceOrdinal:2,before:{},after:{},reason:'Unchanged original full-approval row only',evidenceRefs:[proofRef]}]};
  const requests=rendererFirst?[f.request,subset]:[subset,f.request];
  for(const request of requests) {
    assert.equal(registerReviewedExamV2({root:f.root,request}).newMetadataApprovals,0);
    assert.equal(registerReviewedExamV2({root:f.root,request,write:true}).preservedMetadataApprovals,1);
  }
  for(const request of requests)assert.equal(registerReviewedExamV2({root:f.root,request,write:true}).replay,true);
  assert.deepEqual(fs.readFileSync(path.join(f.root,f.priorPath)),f.priorRaw);
  assert.equal(nativeReviewReceipt(nativeArgs(f)),f.receiptPath);
  assert.equal(autoPlan(f).status,'ALREADY_REGISTERED');
  assert.equal(f.read(f.META).records[1].metadataRevision.endsWith(':'+subset.requestId),true);
});

const invalidRequests=[
  ['unknown preservation schema',f=>{f.request.approval.sourceRebind.schemaVersion='unknown';}],
  ['untyped ordinary request',f=>{delete f.request.approval.sourceRebind;}],
  ['full output scope',f=>{delete f.request.scope;}],
  ['wrong approval type',f=>{f.request.approval.type='REVIEW2';f.request.approval.reviewPassCount=2;}],
  ['new metadata value',f=>{f.request.items[0].after.templateKey='TPL_UNREVIEWED';}],
  ['new difficulty judgment',f=>{f.request.items[0].after.difficultyBucket=5;}],
  ['new registry change',f=>{f.request.registryChanges=[{path:'unapproved.json',before:null,after:{},evidenceRefs:[f.reviewRef]}];}],
  ['item source review',f=>{f.request.items[0].sourceReview={};}],
  ['wrong UID',f=>{f.request.items[0].questionUid='uid2';}],
  ['wrong ordinal',f=>{f.request.items[0].sourceOrdinal=2;}],
  ['wrong denominator',f=>{f.request.expectedQuestionCount=3;}],
  ['missing selected review reference',f=>{f.request.items[0].evidenceRefs=f.request.items[0].evidenceRefs.filter(r=>r.path!==f.reviewPath);}],
  ['missing original receipt',f=>{fs.unlinkSync(path.join(f.root,f.priorPath));}],
  ['changed original authority',f=>{f.put('docs/approval.json',{unreviewed:true});}],
  ['changed original reuse proof',f=>{f.reuseProof.rows[0].sameSemanticValues=false;f.put(f.reusePath,f.reuseProof);}],
  ['cyclic prior receipt',f=>{f.request.approval.sourceRebind.priorReceiptRef={path:f.receiptPath,sha256:'a'.repeat(64)};}],
  ['same-author visual witness',f=>{f.review.reviewer=f.request.approval.approvedBy;f.publishReview();}],
  ['uninspected renderer',f=>{f.review.rows[0].visualInspectionPerformed=false;f.publishReview();}],
  ['uninspected asset',f=>{f.review.rows[0].currentAssets[0].visuallyInspected=false;f.publishReview();}],
  ['missing complete asset inventory',f=>{f.review.rows[0].currentAssets=[];f.publishReview();}],
  ['forged original asset digest',f=>{f.review.rows[0].priorAssets[0].sha256='b'.repeat(64);f.publishReview();}],
  ['new mathematical QA claim',f=>{f.review.newMathematicalQa=true;f.publishReview();}],
  ['new difficulty witness claim',f=>{f.review.newDifficultyJudgments=1;f.publishReview();}],
  ['new metadata witness claim',f=>{f.review.newMetadataApprovals=1;f.publishReview();}],
  ['wrong independent UID',f=>{f.review.rows[0].questionUid='uid2';f.publishReview();}],
  ['changed current renderer bytes',f=>{f.put(f.assetRef.path,'<svg xmlns="http://www.w3.org/2000/svg"><text>changed</text></svg>');}],
  ['source byte drift',f=>{f.bank[0].imageSize='tall';f.put(f.sourcePath,'window.questions='+JSON.stringify(f.bank)+';\n');}],
  ['nonrenderer field change in exact new Git snapshot',f=>{
    f.bank[0].solution='unreviewed synthetic solution';const bytes='window.questions='+JSON.stringify(f.bank)+';\n';f.put(f.sourcePath,bytes);
    const commit=f.commit('synthetic nonrenderer drift');f.review.currentSourceRef={commit,path:f.sourcePath,gitBlobSha1:blob(Buffer.from(bytes)),sha256:sha(bytes)};
    f.request.expectedSourceBlobSha1=blob(Buffer.from(bytes));f.review.rows[0].currentQuestionSha256=sha(stable(f.bank[0]));f.review.rows[0].changedFields.push('solution');f.publishReview();
  }],
];
for(const[name,mutate]of invalidRequests)test('original renderer writer refuses '+name+' without partial writes',t=>{
  const f=originalRendererFixture(t),before=new Map([f.META,f.identityPath,f.runtimePath].map(p=>[p,fs.readFileSync(path.join(f.root,p))]));
  mutate(f);assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}));
  for(const[p,bytes]of before)assert.deepEqual(fs.readFileSync(path.join(f.root,p)),bytes);
  assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);assert.equal(fs.existsSync(path.join(f.root,f.bindingPath)),false);
});

for(const hint of [42,{width:200},'arbitrary-renderer-hint',null])test('original renderer refuses unsupported immutable imageSize hint: '+JSON.stringify(hint),t=>{
  const f=originalRendererFixture(t);f.bank[0].imageSize=hint;
  const bytes='window.questions='+JSON.stringify(f.bank)+';\n';f.put(f.sourcePath,bytes);
  const commit=f.commit('synthetic unsupported immutable imageSize hint');
  f.review.currentSourceRef={commit,path:f.sourcePath,gitBlobSha1:blob(Buffer.from(bytes)),sha256:sha(bytes)};
  f.request.expectedSourceBlobSha1=blob(Buffer.from(bytes));f.review.rows[0].currentQuestionSha256=sha(stable(f.bank[0]));f.publishReview();
  const before=fs.readFileSync(path.join(f.root,f.META));
  assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/selected renderer/);
  assert.deepEqual(fs.readFileSync(path.join(f.root,f.META)),before);assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
});

for(const image of [['assets/current-1.svg'],{src:'assets/current-1.svg'},42,null])
test('original renderer refuses a non-scalar immutable image field: '+JSON.stringify(image),t=>{
  const f=originalRendererFixture(t);f.bank[0].image=image;
  const bytes='window.questions='+JSON.stringify(f.bank)+';\n';f.put(f.sourcePath,bytes);
  const commit=f.commit('synthetic unsupported immutable image type');
  f.review.currentSourceRef={commit,path:f.sourcePath,gitBlobSha1:blob(Buffer.from(bytes)),sha256:sha(bytes)};
  f.request.expectedSourceBlobSha1=blob(Buffer.from(bytes));f.review.rows[0].currentQuestionSha256=sha(stable(f.bank[0]));f.publishReview();
  assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/selected renderer/);
  assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
});

const damagedIssued=[
  ['deleted durable sidecar',f=>fs.unlinkSync(path.join(f.root,f.bindingPath))],
  ['edited durable request',f=>{const d=f.read(f.bindingPath);d.request.items[0].after={difficultyBucket:5};f.put(f.bindingPath,d);}],
  ['deleted sidecar output digest',f=>{const d=f.read(f.receiptPath);d.outputDigests=d.outputDigests.filter(r=>r.path!==f.bindingPath);f.put(f.receiptPath,d);}],
  ['stripped preservation schema and counts',f=>{const d=f.read(f.receiptPath);delete d.approval.sourceRebind;delete d.newMetadataApprovals;delete d.preservedMetadataApprovals;f.put(f.receiptPath,d);}],
  ['stripped typed repair',f=>{const d=f.read(f.receiptPath);d.fingerprintRepairs=[];f.put(f.receiptPath,d);}],
  ['missing issued marker',f=>{for(const p of[f.META,f.runtimePath]){const d=f.read(p);d.records.find(r=>r.questionUid==='uid1').approvalEvidence=d.records.find(r=>r.questionUid==='uid1').approvalEvidence.filter(r=>r!==f.bindingPath);f.put(p,d);}}],
  ['missing original approval receipt',f=>fs.unlinkSync(path.join(f.root,f.priorPath))],
  ['tampered original evidence',f=>f.put('docs/approval.json',{unreviewed:true})],
  ['live asset drift after registration',f=>f.put(f.assetRef.path,'<svg xmlns="http://www.w3.org/2000/svg"/>')],
  ['cyclic issued original reference',f=>{const d=f.read(f.receiptPath);d.approval.sourceRebind.priorReceiptRef={path:f.receiptPath,sha256:sha(fs.readFileSync(path.join(f.root,f.receiptPath)))};f.put(f.receiptPath,d);}],
];
for(const[name,mutate]of damagedIssued)test('original renderer ancestry rejects '+name+' and blocks ordinary producer fallback',t=>{
  const f=originalRendererFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});mutate(f);
  assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}));
  assert.equal(nativeReviewReceipt(nativeArgs(f)),null);
  const planned=autoPlan(f);assert.equal(planned.status,'SUPPLEMENT_PENDING');assert.notEqual(planned.status,'APPLY');
  assert(planned.reasons.some(r=>/REVALIDATION_FAILED/.test(r)),JSON.stringify(planned));
});

for(const sizeOnly of [false,true])for(const extra of ['none','missing-child','fake-source-review'])
test('combined renderer authority-marker deletion cannot use ordinary native/producer fallback: '+JSON.stringify({sizeOnly,extra}),t=>{
  const f=originalRendererFixture(t,{sizeOnly});registerReviewedExamV2({root:f.root,request:f.request,write:true});
  const receipt=f.read(f.receiptPath);
  delete receipt.approval.sourceRebind;delete receipt.newMetadataApprovals;delete receipt.preservedMetadataApprovals;
  delete receipt.fingerprintRepairs;receipt.approval.evidenceRefs=f.evidenceRefs;
  receipt.outputDigests=receipt.outputDigests.filter(r=>r.path!==f.bindingPath);
  for(const row of [...receipt.appliedRecords,...receipt.runtimeRecords])row.approvalEvidence=row.approvalEvidence.filter(p=>p!==f.bindingPath);
  if(extra==='fake-source-review')receipt.fingerprintRepairs=[{questionUid:'uid1',sourceOrdinal:1,sourceReview:{schemaVersion:'unverified-source-review-shaped-flag'}}];
  f.put(f.receiptPath,receipt);
  for(const file of [f.META,f.runtimePath]){
    const doc=f.read(file);doc.records.find(r=>r.questionUid==='uid1').approvalEvidence=doc.records.find(r=>r.questionUid==='uid1').approvalEvidence.filter(p=>p!==f.bindingPath);f.put(file,doc);
  }
  fs.unlinkSync(path.join(f.root,f.bindingPath));fs.unlinkSync(path.join(f.root,f.reviewPath));
  if(extra==='missing-child')fs.unlinkSync(path.join(f.root,f.receiptPath));
  for(const previous of ['original','current']){
    assert.equal(nativeReviewReceipt(nativeArgs(f,{previous})),null,'no native reuse from flags or a caught-up cursor');
    const planned=autoPlan(f,{previous});assert.equal(planned.status,'SUPPLEMENT_PENDING');
    assert(planned.reasons.includes('ORIGINAL_FINAL_QA_RENDERER_REVALIDATION_FAILED'),JSON.stringify(planned));
  }
  assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}));
});

test('original renderer preview binds changed, pending and inherited exact requests without creating approval',t=>{
  const f=originalRendererFixture(t),requestPath='.archive-meta-register/inbox/'+f.request.requestId+'.json',baseSha=f.git('rev-parse','HEAD');
  assert.equal(isExplicitOriginalRendererRequest(f.request),true);f.put(requestPath,f.request);const headSha=f.commit('synthetic renderer transport request');
  const selected=selectNativeRequests({root:f.root,baseSha,headSha});
  assert.deepEqual(selected.map(r=>[r.path,r.kind,r.questionCount,r.sourceQuestionCount]),[[requestPath,'native-approval-preservation',1,2]]);
  assert(selected[0].evidence.some(r=>r.path===f.assetRef.path));assert(selected[0].evidence.some(r=>r.path===f.reviewPath));
  assert.deepEqual(selectPendingNativeRequests({root:f.root,headSha}),selected);
  f.put('tools/fixture-later-code.txt','code only');const later=f.commit('synthetic code-only change');
  const inherited=selectNativeRequests({root:f.root,baseSha:headSha,headSha:later});
  assert.equal(inherited.length,1);assert.equal(inherited[0].kind,'native-approval-preservation');
  assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
});

test('original renderer official shadow reconstructs exact outputs using only declared source/evidence/asset inputs',t=>{
  const f=originalRendererFixture(t),requestPath='.archive-meta-register/inbox/'+f.request.requestId+'.json',baseSha=f.git('rev-parse','HEAD');
  f.put(requestPath,f.request);const headSha=f.commit('synthetic renderer request with all immutable dependencies');
  const requests=selectNativeRequests({root:f.root,baseSha,headSha}),calls=[];
  // The callback invokes the actual registrar API in the independently cloned
  // shadow. It replaces only the subprocess boundary, not any validator.
  const run=(_binary,args,shadow)=>{
    const file=args[args.indexOf('--request')+1];
    assert.notEqual(shadow,f.root);assert.equal(args[args.indexOf('--repo-root')+1],shadow);
    const request=JSON.parse(fs.readFileSync(path.join(shadow,file),'utf8'));
    calls.push(args.includes('--write')?'write':'dry');
    return JSON.stringify(registerReviewedExamV2({root:shadow,request,write:args.includes('--write')}));
  };
  const shadow=rederiveNativePlans({root:f.root,requests,run});
  assert.deepEqual(calls,['dry','write']);assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
  const written=registerReviewedExamV2({root:f.root,request:f.request,write:true});
  assert.deepEqual(shadow.plans,[{requestPath,replay:false,plannedPaths:[...written.plannedPaths].sort()}]);
  assert.deepEqual(shadow.outputs,nativeOutputManifest(f.root,shadow.plans));
  assert(shadow.outputs.some(row=>row.path===f.bindingPath));
});
