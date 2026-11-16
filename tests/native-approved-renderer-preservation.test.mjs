import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {nativeReviewReceipt,activeBindingContext} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {APPROVED_RENDERER_PRESERVATION,loadApprovedRendererPreservation,planApprovedRendererRecord,
  buildApprovedRendererBinding,verifyApprovedRendererReceipt,hasApprovedRendererPreservationClaim}
  from '../archive/tools/meta-foundation/native-approved-renderer-preservation.mjs';

const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)
  ?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v),sha=x=>crypto.createHash('sha256').update(x).digest('hex'),
  blob=x=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(x)}\0`).update(x).digest('hex'),clone=structuredClone;
const sf=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const cf=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
const fields=['id','number','questionType','content','question','choices','answer','solution','image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
const payload=q=>sha(stable(Object.fromEntries(fields.map(k=>[k,q[k]??null]))));
const source='original/middle/m1/2mid/fixture.js',priorPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/prior-full.json';

function fixture(t,opt={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'approved-renderer-contract-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const write=(p,x)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x,null,2)+'\n');};
  const git=(...a)=>execFileSync('git',a,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-q');git('config','user.name','Contract fixture');git('config','user.email','fixture@example.invalid');
  const commit=()=>{git('add','.');git('commit','-qm','fixture');return git('rev-parse','HEAD');};
  const oldBank=[1,2,3].map(id=>({id,content:'unchanged prompt '+id,answer:'A',solution:'unchanged explanation',image:'assets/fixture/old'+id+'.svg',imageSize:100,
    solutionImage:'assets/fixture/companion.svg'}));
  if(opt.noImageUnchanged){delete oldBank[1].image;delete oldBank[1].imageSize;delete oldBank[1].solutionImage;}
  for(let i=1;i<=3;i++)write('archive/assets/fixture/old'+i+'.svg','<svg xmlns="http://www.w3.org/2000/svg"><text>old '+i+'</text></svg>');
  write('archive/assets/fixture/companion.svg','<svg xmlns="http://www.w3.org/2000/svg"><text>companion</text></svg>');
  const sourceBytes=bank=>Buffer.from('window.questionBank = '+JSON.stringify(bank)+';\n');
  const oldBytes=sourceBytes(oldBank);write('archive/exams/'+source,oldBytes);
  const originalEvidence={path:'.archive-meta-register/evidence/original.json',sha256:sha('{}\n')};write(originalEvidence.path,'{}\n');
  const meta=oldBank.map((q,i)=>({questionUid:'qid-'+(i+1),sourceOrdinal:i+1,sourceArchiveFile:source,
    sourceQuestionNo:String(i+1),sourceFingerprint:sf(q),contentFingerprint:cf(q),metadataApprovalType:'FINAL_QA',
    metadataStatus:'approved_full',reviewStatus:'reviewed_pass',tagStatus:'reviewed_pass',tagConfidence:'approved_final_qa',
    metadataRevision:'old-full',approvalEvidence:[priorPath],fieldStatus:{condition:'EVIDENCE_DEBT'},conditionKeys:null,
    difficultyBucket:2,metaFoundationPackId:'MIDDLE_GEOMETRY',metaFoundationPackVersion:'1.0.0',problemTypeKey:'PT_FIXED',templateKey:'TM_FIXED',
    ...(opt.operationalNative?{metaFoundationStatus:'ACTIVE',L1:'Parent',L2:'Unit',L3:'Fixed type',L4:'Fixed template',
      curriculum:'2015',curriculumKey:'2015',courseKey:'M1-2',standardCourse:'중1 수학',standardUnitKey:'M1-TEST',subUnitKey:null,
      metadataRevision:'meta-foundation:MIDDLE_GEOMETRY@1.0.0:exam-final_qa-v2:prior-full'}:{})}));
  const ids=meta.map(r=>({questionUid:r.questionUid,sourceArchiveFile:source,sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:r.sourceQuestionNo,sourceFingerprint:r.sourceFingerprint,status:'VERIFIED'}));
  const runtime=meta.map(r=>({...r,approvedSourceFingerprint:r.sourceFingerprint,sourceIdentity:source+'#'+r.sourceOrdinal,defaultSelectable:true}));
  const prior={schemaVersion:'archive-reviewed-exam-meta-registration-v2',metadataRegistrationStatus:'REGISTERED',requestId:'prior-full',
    requestSha256:'a'.repeat(64),sourceArchiveFile:source,examUid:'fixture',sourceBlobSha1:blob(oldBytes),sourceRawSha256:sha(oldBytes),
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'original reviewer',evidenceRefs:[originalEvidence]},
    totalQuestions:3,appliedRecords:meta,appliedIdentityRecords:ids,runtimeRecords:runtime};
  if(opt.partialPrior)prior.scope='PARTIAL_UIDS';
  write(priorPath,prior);const priorSha=sha(fs.readFileSync(path.join(root,priorPath))),priorCommit=commit();
  const bank=clone(oldBank);bank[0].imageSize=180;
  if(!opt.sizeOnly){bank[0].image='assets/fixture/current.svg';write('archive/assets/fixture/current.svg','<svg xmlns="http://www.w3.org/2000/svg"><text>reviewed image</text></svg>');}
  if(opt.nonRenderer)bank[0][opt.nonRenderer]='not authorized';
  if(opt.companionChanged)write('archive/assets/fixture/companion.svg','<svg>unreviewed companion change</svg>');
  if(opt.unchangedQuestionDrift)bank[1].content='unreviewed text';
  if(opt.unchangedAssetDrift)write('archive/assets/fixture/old2.svg','<svg>unreviewed unchanged-item image</svg>');
  const bytes=sourceBytes(bank);write('archive/exams/'+source,bytes);const currentCommit=commit();
  const asset=p=>{const b=fs.readFileSync(path.join(root,p));return{path:p,gitBlob:blob(b),rawSha256:sha(b)};};
  const beforeAsset=asset('archive/'+oldBank[0].image),previousProductionAsset=asset('archive/'+bank[0].image);
  if(opt.repaired)write('archive/'+bank[0].image,'<svg xmlns="http://www.w3.org/2000/svg"><text>independently accepted repair</text></svg>');
  const currentAsset=asset('archive/'+bank[0].image);
  const row={questionUid:'qid-1',sourceArchiveFile:source,sourceOrdinal:1,decision:opt.hold?'HOLD_MINIMUM_RENDERER_REPAIR_REQUIRED':opt.sizeOnly?'ACCEPT_SIZE_EFFECT_ONLY':'ACCEPT_NARROW_CURRENT_RENDERER',
    scope:'CURRENT_FIGURE_CONTINUITY_ONLY_NO_NEW_MATH_OR_SEMANTIC_QA',bothImagesActuallyViewed:true,existingSemanticHoldPreserved:true,
    newFullSemanticApproval:false,registrationApplied:false,pairRenderSha256:'b'.repeat(64),sourceRefs:{beforeBlob:blob(oldBytes),beforeRawSha256:sha(oldBytes),currentBlob:blob(bytes),currentRawSha256:sha(bytes),currentCommit},
    beforeStudentPayloadSha256:payload(oldBank[0]),currentStudentPayloadSha256:payload(bank[0]),beforeAsset,currentAsset};
  const review={schemaVersion:'archive-m1-independent-narrow-renderer-review-v1',reviewer:'independent reviewer',rendererAuthor:'different author',fullSourceMathReviewRepeated:false,currentSourceCommit:currentCommit,rows:[row]};
  if(opt.repaired) {
    Object.assign(review,{schemaVersion:'m1-current-renderer-repair-independent-review-v1',status:'ACCEPT_THREE_EXACT_REPAIRED_ASSETS_ONLY',
      newMathReview:opt.fabricatedMath?1:0,newNativeApproval:0,sourceChanges:0,answerSolutionChanges:0,slotVectorChanges:0,accepted:1});
    Object.assign(row,{decision:'ACCEPT_REPAIRED_CURRENT_RENDERER_CONTINUITY',originalCurrentAndRepairActuallyViewed:true,
      currentAssetState:'ROOT_ACCEPTED_UNPUBLISHED_CANDIDATE',candidateRenderSha256:'c'.repeat(64),reviewSheetSha256:'d'.repeat(64),previousProductionAsset});
    if(opt.wrongProductionAsset)row.previousProductionAsset.rawSha256='0'.repeat(64);
  }
  const reviewPath='.archive-meta-register/evidence/independent-renderer.json';write(reviewPath,review);const reviewSha=sha(fs.readFileSync(path.join(root,reviewPath))),reviewCommit=commit();
  const reviewRef={commit:reviewCommit,path:reviewPath,sha256:reviewSha},refs=[{path:priorPath,sha256:priorSha},{path:reviewPath,sha256:reviewSha}];
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'preserve-current',examUid:'fixture',sourceArchiveFile:source,scope:'PARTIAL_UIDS',expectedSourceBlobSha1:blob(bytes),expectedQuestionCount:3,
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'transport only',evidenceRefs:refs,rendererPreservation:{schemaVersion:APPROVED_RENDERER_PRESERVATION,priorCommit,currentCommit:reviewCommit,priorReceiptRef:refs[0],reviewRefs:[reviewRef],outsideRequest:[2,3].map(i=>({questionUid:'qid-'+i,sourceOrdinal:i,reason:'OUTSIDE_REQUEST_PRESERVE_LIVE_STATE'}))}},
    registryChanges:[],items:[{questionUid:'qid-1',sourceOrdinal:1,preservationMode:'INDEPENDENTLY_REVIEWED_IMAGE_CONTINUITY',before:{},after:{},reason:'Preserve exact original approval under current independent renderer evidence.',evidenceRefs:refs,rendererReviewRef:reviewRef}]};
  if(opt.full){request.approval.rendererPreservation.outsideRequest=[];request.items.push(...[2,3].map(i=>({questionUid:'qid-'+i,sourceOrdinal:i,preservationMode:'UNCHANGED_WHOLE_QUESTION_AND_ASSETS',before:{},after:{},reason:'Preserve exact existing whole question and every original asset.',evidenceRefs:[refs[0]]})));}
  const identityMap={records:clone(ids)};if(!opt.full)identityMap.records[1].laterOutsideProvenance='actual later preservation';
  const calls=[];const revalidateLeaf=a=>{
    calls.push(a.current.questionUid);const i=a.ordinal-1;
    assert.deepEqual(a.current,meta[i]);assert.deepEqual(a.identity,ids[i]);assert.deepEqual(a.nativeSource.runtimeRecord,runtime[i]);
    assert.deepEqual(a.question,oldBank[i]);assert.deepEqual(a.previous,oldBank[i]);
    assert.deepEqual(a.nativeSource.identityMap.records.filter(r=>r.sourceArchiveFile===source),ids);
    return priorPath;
  };
  const args={root,request,bytes,bank,identityMap,registry:{status:'ACTIVE'},revalidateLeaf};
  return {root,request,bytes,bank,identityMap,args,calls,prior,meta,ids,runtime,oldBank,oldBytes,write,git,reviewPath,reviewRef};
}

test('original complete history replays; selected binding changes no approval; later outside identity remains untouched',t=>{
  const f=fixture(t),before=clone(f.identityMap),ctx=loadApprovedRendererPreservation(f.args);
  assert.deepEqual(f.calls,['qid-1','qid-2','qid-3']);assert.deepEqual(f.identityMap,before);
  const kept=planApprovedRendererRecord(ctx,{current:f.meta[0],identity:f.ids[0],runtime:f.runtime[0],ordinal:1,receiptPath:'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserve-current.json'});
  for(const k of ['metadataApprovalType','fieldStatus','conditionKeys','difficultyBucket','problemTypeKey','templateKey','tagStatus','tagConfidence'])assert.deepEqual(kept.final[k],f.meta[0][k]);
  assert.notEqual(kept.final.sourceFingerprint,f.meta[0].sourceFingerprint);
  assert.deepEqual({...kept.identityAfter,sourceFingerprint:f.ids[0].sourceFingerprint},f.ids[0]);
  assert.equal(buildApprovedRendererBinding(ctx).newMetadataApprovals,0);
});
test('explicit size-only review preserves identical asset and fingerprints',t=>{
  const f=fixture(t,{sizeOnly:true}),ctx=loadApprovedRendererPreservation(f.args);
  const kept=planApprovedRendererRecord(ctx,{current:f.meta[0],identity:f.ids[0],runtime:f.runtime[0],ordinal:1,receiptPath:'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserve-current.json'});
  assert.equal(kept.final.sourceFingerprint,f.meta[0].sourceFingerprint);assert.deepEqual(kept.identityAfter,f.ids[0]);
});
test('root repaired renderer proof binds original, previous production and exact repaired asset bytes',t=>{
  const f=fixture(t,{repaired:true}),ctx=loadApprovedRendererPreservation(f.args);
  assert.equal(ctx.proofs.get('qid-1').decision,'ACCEPT_REPAIRED_CURRENT_RENDERER_CONTINUITY');
  assert.equal(ctx.proofs.get('qid-1').candidateRenderSha256,'c'.repeat(64));
});
test('repaired proof cannot claim new mathematical authority or falsify the previous production asset',t=>{
  const a=fixture(t,{repaired:true,fabricatedMath:true});assert.throws(()=>loadApprovedRendererPreservation(a.args),/independent narrow renderer review/);
  const b=fixture(t,{repaired:true,wrongProductionAsset:true});assert.throws(()=>loadApprovedRendererPreservation(b.args),/image digest/);
});
for(const field of ['content','answer','solution','choices','difficultyBucket','reviewStatus','courseKey'])test('rejects non-renderer question delta '+field,t=>{
  const f=fixture(t,{nonRenderer:field});assert.throws(()=>loadApprovedRendererPreservation(f.args),/only image\/imageSize/);
});
test('rejects unreviewed companion asset byte change even when the main image is exactly reviewed',t=>{
  const f=fixture(t,{companionChanged:true});assert.throws(()=>loadApprovedRendererPreservation(f.args),/companion asset/);
});
test('an explicit independent renderer HOLD cannot be selected',t=>{
  const f=fixture(t,{hold:true});assert.throws(()=>loadApprovedRendererPreservation(f.args),/not independently accepted/);
});
test('legacy partial metadata cannot be disguised as the original terminal FULL receipt',t=>{
  const f=fixture(t,{partialPrior:true});assert.throws(()=>loadApprovedRendererPreservation(f.args),/terminal FULL/);
});
for(const mutation of ['missing','duplicate','overlap','falseHold'])test('rejects invalid selected/outside partition '+mutation,t=>{
  const f=fixture(t),rows=f.request.approval.rendererPreservation.outsideRequest;
  if(mutation==='missing')rows.pop();if(mutation==='duplicate')rows[1]=clone(rows[0]);
  if(mutation==='overlap')rows[0]={questionUid:'qid-1',sourceOrdinal:1,reason:'OUTSIDE_REQUEST_PRESERVE_LIVE_STATE'};
  if(mutation==='falseHold')rows[0].reason='CURRENT_SOURCE_REVIEW_REQUIRED';
  assert.throws(()=>loadApprovedRendererPreservation(f.args),/partition|inventory|outside rows/);
});
test('rejects inactive canonical authority and any failed original historical leaf',t=>{
  const f=fixture(t);assert.throws(()=>loadApprovedRendererPreservation({...f.args,registry:{status:'DRAFT'}}),/ACTIVE/);
  assert.throws(()=>loadApprovedRendererPreservation({...f.args,revalidateLeaf:()=>null}),/cannot replay/);
});
test('selected semantic approval or identity drift is never overwritten',t=>{
  const f=fixture(t),ctx=loadApprovedRendererPreservation(f.args),args={current:f.meta[0],identity:f.ids[0],runtime:f.runtime[0],ordinal:1,receiptPath:'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserve-current.json'};
  for(const changed of [{current:{...f.meta[0],difficultyBucket:4}},{identity:{...f.ids[0],status:'REPLACED'}},{runtime:{...f.runtime[0],conditionKeys:[]}}])
    assert.throws(()=>planApprovedRendererRecord(ctx,{...args,...changed}),/live approval\/identity\/runtime/);
});
test('issued receipt replays exact proof and fails if its binding is missing, marker stripped, or cursor unproven',t=>{
  const f=fixture(t),ctx=loadApprovedRendererPreservation(f.args),receiptPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserve-current.json',
    kept=planApprovedRendererRecord(ctx,{current:f.meta[0],identity:f.ids[0],runtime:f.runtime[0],ordinal:1,receiptPath}),binding=buildApprovedRendererBinding(ctx);
  f.write(ctx.bindingPath,binding);const bindingSha=sha(fs.readFileSync(path.join(f.root,ctx.bindingPath)));
  const receipt={schemaVersion:'archive-reviewed-exam-meta-registration-v2',metadataRegistrationStatus:'REGISTERED',requestId:f.request.requestId,
    requestSha256:ctx.requestSha256,approval:f.request.approval,scope:'PARTIAL_UIDS',partialUidCount:1,totalQuestions:1,expectedQuestionCount:3,
    newMetadataApprovals:0,preservedMetadataApprovals:1,approvedRendererPreservation:binding,
    appliedRecords:[kept.final],appliedIdentityRecords:[kept.identityAfter],runtimeRecords:[kept.runtimeAfter],fingerprintRepairs:[kept.fingerprintRepair],outputDigests:[{path:ctx.bindingPath,sha256:bindingSha}]};
  f.write(receiptPath,receipt);const liveIds=clone(f.identityMap);liveIds.records[0]=kept.identityAfter;
  const args={receipt,nativeSource:{root:f.root,bytes:f.bytes,bank:f.bank,identityMap:liveIds,runtimeRecord:kept.runtimeAfter},
    current:kept.final,identity:kept.identityAfter,ordinal:1,previous:f.oldBank[0],registry:{status:'ACTIVE'},revalidateLeaf:f.args.revalidateLeaf};
  assert.equal(verifyApprovedRendererReceipt(args),true);
  assert.throws(()=>verifyApprovedRendererReceipt({...args,previous:{...f.oldBank[0],answer:'unproven cursor'}}),/outside proven old\/current/);
  const stripped=clone(receipt);delete stripped.approval.rendererPreservation;delete stripped.approvedRendererPreservation;f.write(receiptPath,stripped);
  assert.equal(hasApprovedRendererPreservationClaim({root:f.root,current:kept.final,runtimeRecord:kept.runtimeAfter}),true);
  assert.equal(verifyApprovedRendererReceipt({...args,receipt:stripped}),null);
  fs.rmSync(path.join(f.root,ctx.bindingPath));assert.throws(()=>verifyApprovedRendererReceipt(args),/ENOENT/);
});
test('issued revision retains its typed verification obligation after row evidence markers are removed',t=>{
  const f=fixture(t),ctx=loadApprovedRendererPreservation(f.args),receiptPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserve-current.json',
    kept=planApprovedRendererRecord(ctx,{current:f.meta[0],identity:f.ids[0],runtime:f.runtime[0],ordinal:1,receiptPath}),
    withoutEvidence={current:{...kept.final,approvalEvidence:[]},runtimeRecord:{...kept.runtimeAfter,approvalEvidence:[]}};
  assert.equal(hasApprovedRendererPreservationClaim({root:f.root,current:f.meta[0],runtimeRecord:f.runtime[0]}),false);
  f.write(ctx.bindingPath,buildApprovedRendererBinding(ctx));
  assert.equal(hasApprovedRendererPreservationClaim({root:f.root,...withoutEvidence}),true);
  fs.rmSync(path.join(f.root,ctx.bindingPath));
  f.write(receiptPath,{approval:{rendererPreservation:ctx.request.approval.rendererPreservation}});
  assert.equal(hasApprovedRendererPreservationClaim({root:f.root,...withoutEvidence}),true);
  f.write(receiptPath,{outputDigests:[{path:ctx.bindingPath,sha256:'f'.repeat(64)}]});
  assert.equal(hasApprovedRendererPreservationClaim({root:f.root,...withoutEvidence}),true);
});
test('whole original selection preserves unchanged rows and reviewed images with zero new approvals',t=>{
  const f=fixture(t,{full:true,noImageUnchanged:true}),ctx=loadApprovedRendererPreservation(f.args),before=clone(f.identityMap);
  assert.deepEqual(f.calls,['qid-1','qid-2','qid-3']);assert.deepEqual(ctx.proofs.get('qid-2').assetInventory,[]);
  for(let i=0;i<3;i++){
    const kept=planApprovedRendererRecord(ctx,{current:f.meta[i],identity:f.ids[i],runtime:f.runtime[i],ordinal:i+1,
      receiptPath:'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserve-current.json'});
    assert.deepEqual(kept.final.fieldStatus,f.meta[i].fieldStatus);assert.equal(kept.final.difficultyBucket,f.meta[i].difficultyBucket);
    if(i)assert.equal(kept.final.sourceFingerprint,f.meta[i].sourceFingerprint);
  }
  const proof=buildApprovedRendererBinding(ctx);assert.equal(proof.newMetadataApprovals,0);assert.equal(proof.preservedMetadataApprovals,3);
  assert.equal(proof.unchangedWholeQuestionCount,2);assert.equal(proof.independentlyReviewedRendererCount,1);assert.equal(proof.selectedCount,3);
  assert.deepEqual(f.identityMap,before);
});
test('an unchanged mode cannot authorize any whole question or asset change',t=>{
  const text=fixture(t,{full:true,unchangedQuestionDrift:true});assert.throws(()=>loadApprovedRendererPreservation(text.args),/unchanged item whole question differs/);
  const image=fixture(t,{full:true,unchangedAssetDrift:true});assert.throws(()=>loadApprovedRendererPreservation(image.args),/unchanged item referenced asset differs/);
});
test('explicit mode and a genuine reviewed renderer member are mandatory',t=>{
  const missing=fixture(t);delete missing.request.items[0].preservationMode;assert.throws(()=>loadApprovedRendererPreservation(missing.args),/mode explicit/);
  const disguised=fixture(t);disguised.request.items[0].preservationMode='UNCHANGED_WHOLE_QUESTION_AND_ASSETS';delete disguised.request.items[0].rendererReviewRef;
  assert.throws(()=>loadApprovedRendererPreservation(disguised.args),/unchanged item whole question differs/);
  const only=fixture(t,{full:true});only.request.items=only.request.items.slice(1);only.request.approval.rendererPreservation.outsideRequest=[{questionUid:'qid-1',sourceOrdinal:1,reason:'OUTSIDE_REQUEST_PRESERVE_LIVE_STATE'}];
  assert.throws(()=>loadApprovedRendererPreservation(only.args),/at least one independently reviewed renderer/);
});

function issuedFullFixture(t,opt={}) {
  const f=fixture(t,{full:true,noImageUnchanged:true,...opt}),ctx=loadApprovedRendererPreservation(f.args);
  const receiptPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserve-current.json';
  const kept=f.meta.map((current,i)=>planApprovedRendererRecord(ctx,{current,identity:f.ids[i],runtime:f.runtime[i],ordinal:i+1,receiptPath}));
  const binding=buildApprovedRendererBinding(ctx);f.write(ctx.bindingPath,binding);
  const receipt={schemaVersion:'archive-reviewed-exam-meta-registration-v2',metadataRegistrationStatus:'REGISTERED',requestId:f.request.requestId,
    requestSha256:ctx.requestSha256,sourceArchiveFile:source,examUid:'fixture',sourceRawSha256:sha(f.bytes),sourceBlobSha1:blob(f.bytes),
    approval:f.request.approval,scope:'PARTIAL_UIDS',partialUidCount:3,totalQuestions:3,expectedQuestionCount:3,
    newMetadataApprovals:0,preservedMetadataApprovals:3,approvedRendererPreservation:binding,
    appliedRecords:kept.map(x=>x.final),appliedIdentityRecords:kept.map(x=>x.identityAfter),runtimeRecords:kept.map(x=>x.runtimeAfter),
    fingerprintRepairs:kept.map(x=>x.fingerprintRepair),outputDigests:[{path:ctx.bindingPath,sha256:sha(fs.readFileSync(path.join(f.root,ctx.bindingPath)))}]};
  f.write(receiptPath,receipt);const ids={...clone(f.identityMap),records:kept.map(x=>x.identityAfter)};
  const args=i=>({receipt,nativeSource:{root:f.root,bytes:f.bytes,bank:f.bank,identityMap:ids,runtimeRecord:kept[i].runtimeAfter},
    current:kept[i].final,identity:kept[i].identityAfter,ordinal:i+1,previous:f.oldBank[i],registry:{status:'ACTIVE'},revalidateLeaf:f.args.revalidateLeaf});
  return {f,ctx,kept,args};
}
test('unchanged rows accept only finite producer metadata cursor differences after complete authority replay',t=>{
  const {f,args,kept}=issuedFullFixture(t),before=clone(kept);
  for(const key of ['legacyLevelCompatibility','subUnitKey','subUnit','rpmPrimaryRecordId','problemTypeKey','templateKey',
    'crossConceptKeys','integrationPattern','tagConfidence','tagStatus','primaryMethod','decisiveStep','rpmCrosswalkStatus',
    'canonicalBindingStatus','runtimeMaterializationStatus','rpmSemanticStatus','metaNullReason','rpmPrimaryPath'])
    assert.equal(verifyApprovedRendererReceipt({...args(1),previous:{...f.oldBank[1],[key]:'older-producer-value'}}),true,key);
  assert.deepEqual(kept,before);
});
test('unchanged cursor rejects student, asset and unknown key contamination including undefined properties',t=>{
  const {f,args}=issuedFullFixture(t);
  for(const key of ['content','answer','solution','choices','image','imageSize','images','solutionImage','unknownProducerExtension','difficultyBucket','reviewStatus'])
    assert.throws(()=>verifyApprovedRendererReceipt({...args(1),previous:{...f.oldBank[1],[key]:'unapproved'}}),/unapproved student, asset or unknown field/,key);
  assert.throws(()=>verifyApprovedRendererReceipt({...args(1),previous:{...f.oldBank[1],unknownProducerExtension:undefined}}),/unapproved student, asset or unknown field/);
});
test('reviewed renderer rows retain their strict old/current whole cursor rule',t=>{
  const {f,args}=issuedFullFixture(t);
  assert.throws(()=>verifyApprovedRendererReceipt({...args(0),previous:{...f.oldBank[0],tagStatus:'old-producer-value'}}),/outside proven old\/current renderer scope/);
});


function operationalNativeFixture(t) {
  const issued=issuedFullFixture(t,{operationalNative:true}),{f,args,kept}=issued;
  const registry={status:'ACTIVE',problemTypes:new Map([['PT_FIXED',{ownerPack:'MIDDLE_GEOMETRY',status:'ACTIVE',canonicalLabelKo:'Fixed type'}]]),
    templates:new Map([['TM_FIXED',{ownerPack:'MIDDLE_GEOMETRY',status:'ACTIVE',parentProblemTypeKey:'PT_FIXED',canonicalLabelKo:'Fixed template'}]]),
    bindingRows:[{status:'ACTIVE',curriculum:'2015',standardCourse:'중1 수학',standardUnitKey:'M1-TEST',subUnitKey:null,problemTypeKey:'PT_FIXED',ownerPack:'MIDDLE_GEOMETRY'}],
    activePacks:new Map([['MIDDLE_GEOMETRY',{packId:'MIDDLE_GEOMETRY',version:'1.0.0',status:'ACTIVE',curricula:['2015'],standardCourses:['중1 수학','M1-2']}]])};
  const invoke=i=>{
    const a=args(i),context=activeBindingContext({candidate:a.current,check:{curriculum:'2015'},registry,runtimeOwner:'MIDDLE_GEOMETRY'});
    assert(!context.reason);
    return nativeReviewReceipt({...a,nativeSource:{...a.nativeSource,blobSha1:blob(f.bytes),runtimeStatus:'ACTIVE',
      identityByJoin:new Map(a.nativeSource.identityMap.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r]))},
      question:f.bank[i],previous:f.bank[i],source,registry,...context});
  };
  return {...issued,invoke};
}
test('AutoMeta native entry dispatches typed preservation before generic source-only preservation',t=>{
  const {invoke}=operationalNativeFixture(t);
  for(let i=0;i<3;i++)assert.equal(invoke(i),'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserve-current.json');
});
test('AutoMeta typed entry never falls back when an issued marker or independent proof is removed',t=>{
  const {f,args,invoke}=operationalNativeFixture(t),receipt=clone(args(0).receipt),receiptPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserve-current.json';
  delete receipt.approval.rendererPreservation;delete receipt.approvedRendererPreservation;f.write(receiptPath,receipt);
  assert.equal(invoke(0),null);
  f.write(receiptPath,args(0).receipt);f.write(f.reviewPath,'{}\n');
  assert.equal(invoke(0),null);
});
