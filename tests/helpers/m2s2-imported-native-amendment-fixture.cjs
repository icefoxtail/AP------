'use strict';
// Tiny, synthetic Git histories only. These documents confer no real approval.
const {fixture:priorFixture,stable,uid,source,sp,cp,dp,mod,contract:priorContract}=require('./m2s2-imported-current-fixture.cjs');
const contract=require('../../tools/4slot/m2s2-imported-native-vector-amendment.cjs');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const fs=require('node:fs');
const dir='docs/operations/m2-native-amendment-fixture/';
const np='archive/data/meta-review/m2-s2-20261114/exams/E999/';
const clone=x=>structuredClone(x),hash=x=>mod.sha(stable(x));
const vector=x=>Object.fromEntries(['given','goal','method','condition'].map(k=>[k,x[k]]));
const withoutHold=x=>Object.fromEntries(Object.entries(x).filter(([k])=>k!=='registrationHold'));

function fixture(t,{overlay=true,held=true,displayPng=null}={}) {
  const f=priorFixture(t,{overlay,held,amendmentTerms:true,displayPng}),{save,bytes,git,commit,ref,js}=f;
  const prior=clone(f.data),priorValidatedCommit=commit('literal v1 compact and original HOLD');
  const native=clone(f.native);native.sourceGitBlobSha=mod.blob(js(f.before));
  native.items.forEach((r,i)=>{r.questionUid=uid(i+1);if(i===0)r.slots.method[0].quote=f.before[i].solution;});
  native.items[0].slots.given=[{term:'fixture approved specific given',src:'stem',quote:'Fixture given'}];
  native.items[2].slots.method=[clone(native.items[2].slots.method[1])];
  const review={schemaVersion:'m2-s2-meta-review-v1',examId:'E999',sourceArchiveFile:source,sourceGitBlobSha:native.sourceGitBlobSha,items:native.items.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal}))};
  const independent={schemaVersion:'m2-s2-independent-sample-v1',examId:'E999',sourceGitBlobSha:native.sourceGitBlobSha};
  save(sp,js(f.before));save(np+'four-slot.json',native);save(np+'review.json',review);save(np+'independent-sample.json',independent);
  const accepted={schemaVersion:'m2-s2-root-acceptance-v1',examId:'E999',owner:'synthetic-native-author',reviewer:'ROOT',sampleReviewer:'synthetic-sample-reviewer',semanticReviewStatus:'PRO_REVIEW_COMPLETE',sourceUnchanged:true,sourceGitBlobSha:native.sourceGitBlobSha,sourceSha256:mod.sha(bytes(sp)),fourSlotSha256:mod.sha(bytes(np+'four-slot.json')),reviewSha256:mod.sha(bytes(np+'review.json')),independentSampleSha256:mod.sha(bytes(np+'independent-sample.json'))};
  save(np+'root-acceptance.json',accepted);let nativeCommit=commit('synthetic c286-like accepted full native authority');
  const ownerPath=dir+'current-renderer.json',transportPath=dir+'native-vector-transport.json',rawPath=dir+'raw-observations.json',contactPath=dir+'contact-manifest.json',copyPath=dir+'existing-native-four-slot.json',carrierPath=dir+'m2-imported-native-vector-amendment.json';
  const main=clone(prior);delete main.evidence[priorContract.GROUP];main.items=main.items.map(withoutHold);main.items[0].given=[4];main.sourceGitBlobSha=mod.blob(js(f.observed));
  const nativeRefs=()=>Object.fromEntries(['four-slot.json','review.json','root-acceptance.json','independent-sample.json'].map(file=>[file,ref(nativeCommit,np+file,true)]));
  const shortRef=(c,p)=>{const r=ref(c,p);delete r.commit;return r;};
  const asset=(c,p)=>{const r=ref(c,p,true);r.rawSha256=r.sha256;delete r.sha256;return r;};
  const assets=(c,q)=>[...new Set([...JSON.stringify(q).matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi)].map(m=>m[0].startsWith('archive/')?m[0]:'archive/'+m[0]))].sort().map(p=>asset(c,p));
  save(sp,js(f.observed));const observedCommit=commit('owner observation source without preserved metadata overlay');
  const contact={schemaVersion:'s2-exact-renderer-contact-manifest-v1',examId:'E999',rows:[1,2].map(i=>({examId:'E999',sourceOrdinal:i,questionUid:uid(i),role:'problem',beforeAsset:asset(nativeCommit,f.oldAssets[i-1]),currentAsset:asset(observedCommit,f.newAssets[i-1]),contact:{path:'/synthetic/contact-'+i+'.png',sha256:mod.sha('synthetic contact '+i)}}))};
  const raw={schemaVersion:'m2-s2-narrow-renderer-observations-v2',reviewer:'synthetic-owner-reviewer',examId:'E999',sourceArchiveFile:source,currentSourceGitBlobSha1:main.sourceGitBlobSha,contactManifestSha256:null,rows:contact.rows.map(r=>({sourceOrdinal:r.sourceOrdinal,questionUid:r.questionUid,role:r.role,beforeAssetSha256:r.beforeAsset.rawSha256,currentAssetSha256:r.currentAsset.rawSha256,contactSha256:r.contact.sha256,actualBeforeAndCurrentImagesViewed:true,currentSourceStemRead:true,decision:'ACCEPT_RENDERER_CONTINUITY_ONLY'}))};
  const oldItems=prior.items.map(withoutHold),tuple=i=>({questionUid:uid(i+1),sourceOrdinal:i+1,sourceQuestionNo:String(i+1),ordinal:i+1});
  const fallbacks=[{questionUid:uid(3),sourceOrdinal:3,slot:'method',retainedIds:[3],unapprovedCandidate:'unapproved fixture method',originalAuthorItemSha256:hash(f.native.items[2]),originalAuthorEntry:clone(f.native.items[2].slots.method[0]),nativeSpecificEntry:clone(native.items[2].slots.method[0]),currentLiteralQuoteExact:true,decision:'RETAIN_UNCHANGED_EXISTING_REVIEWED_BROAD_ID_AND_UNAPPROVED_CANDIDATE',candidateApproval:'NOT_GRANTED',ordinarySearchEligibilityChanged:false,newRegistrationHold:false}];
  const sourceRef={path:sp,beforeGitBlobSha1:native.sourceGitBlobSha,beforeRawSha256:mod.sha(js(f.before)),currentGitBlobSha1:main.sourceGitBlobSha,currentRawSha256:mod.sha(js(f.observed))};
  const nativeSourceRef={path:sp,gitBlobSha1:native.sourceGitBlobSha,rawSha256:mod.sha(js(f.before))};
  const owner={schemaVersion:'m2-s2-existing-four-slot-current-renderer-continuity-v1',examId:'E999',sourceArchiveFile:source,reviewer:raw.reviewer,decision:'ACCEPT_CURRENT_RENDERER_AND_EXISTING_NATIVE_FOUR_SLOT_BINDING_ONLY',sourceRef,nativeSourceRef,nativeRefs:nativeRefs(),counts:{examDenominator:3},sets:{nativeVectorCorrectionOrdinals:[1]},repositoryWrites:0,actualObservations:null,contactManifestRef:null,existingNativeVectorTransportRef:null,dictionaryRef:{path:dp,sha256:mod.sha(bytes(dp))},existingFallbacksPreserved:fallbacks,rows:oldItems.map((old,i)=>({questionUid:uid(i+1),sourceOrdinal:i+1,sourceQuestionNo:String(i+1),nativeSourceStudentPayloadSha256:mod.payloadHash(f.before[i]),beforeStudentPayloadSha256:mod.payloadHash(f.before[i]),currentStudentPayloadSha256:mod.payloadHash(f.observed[i]),nativeToPriorCompactStudentExact:true,existingCompactItemSha256:hash(old),existingNativeItemSha256:hash(native.items[i]),candidateCompactItemSha256:hash(main.items[i]),beforeVectors:vector(old),afterVectors:vector(main.items[i]),nativeApprovedVectorCorrectionTransported:i===0,formatUnchanged:true,originalCandidateTerms:old.candidates,beforeAssets:assets(nativeCommit,f.before[i]),currentAssets:assets(observedCommit,f.observed[i])}))};
  const transport={schemaVersion:'m2-s2-existing-approved-native-vector-transport-v1',examId:'E999',reviewer:raw.reviewer,decision:'TRANSPORT_EXACT_EXISTING_ROOT_APPROVED_NATIVE_VALUES_ONLY',sourceRef,nativeSourceRef,nativeRefs:nativeRefs(),counts:{examDenominator:3},sets:{nativeVectorCorrectionOrdinals:[1]},repositoryWrites:0,newSemanticApprovals:0,sourceContentHoldsReleased:0,sourceConditionsAdded:0,existingFallbacksPreserved:clone(fallbacks),rows:[{questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',nativeItemSha256:hash(native.items[0]),beforeCompactItemSha256:hash(oldItems[0]),afterCompactItemSha256:hash(main.items[0]),newSemanticJudgment:false,originalLiteralQuotesAndConditionalJustificationsCopiedExactly:true,changes:[{slot:'given',before:[1],after:[4],nativeEntries:clone(native.items[0].slots.given)}]}]};
  let mainCommit,proofCommit;
  const proof={schemaVersion:contract.SCHEMA,scope:contract.SCOPE,transportAuthor:'synthetic-transport-author',sourceArchiveFile:source,examId:'E999',expectedQuestionCount:3,priorValidatedCompactRef:ref(priorValidatedCommit,cp,true),priorCarrierRef:clone(prior.evidence[priorContract.GROUP].carrier),mainCompactRef:null,mainSourceRef:null,mainCurrentRendererRef:null,mainNativeVectorTransportRef:null,nativeFourSlotRef:ref(nativeCommit,np+'four-slot.json',true),nativeReviewRef:ref(nativeCommit,np+'review.json',true),nativeRootAcceptanceRef:ref(nativeCommit,np+'root-acceptance.json',true),nativeIndependentSampleRef:ref(nativeCommit,np+'independent-sample.json',true),nativeSourceRef:ref(nativeCommit,sp,true),sourceRef:clone(f.proof.sourceRef),dictionaryRef:clone(f.proof.dictionaryRef),nativeFourSlotCopyRef:null,changedRows:[{...tuple(0),slots:['given'],beforeItemSha256:hash(oldItems[0]),afterItemSha256:hash(main.items[0])}],retainedFallbackRows:[{...tuple(2),slot:'method',retainedIds:[3],candidate:'unapproved fixture method',originalItemSha256:hash(f.native.items[2])}],heldRows:held?[tuple(1)]:[],...Object.fromEntries(contract.ZERO.map(k=>[k,0]))};
  const data=clone(prior);delete data.evidence[priorContract.GROUP];data.items=clone(main.items);if(held)data.items[1].registrationHold=clone(prior.items[1].registrationHold);
  function signOwner(){
    save(contactPath,contact);raw.contactManifestSha256=mod.sha(bytes(contactPath));save(rawPath,raw);save(transportPath,transport);
    owner.contactManifestRef={path:contactPath,sha256:mod.sha(bytes(contactPath))};owner.actualObservations={path:rawPath,sha256:mod.sha(bytes(rawPath)),reviewer:raw.reviewer};owner.existingNativeVectorTransportRef={path:transportPath,sha256:mod.sha(bytes(transportPath))};save(ownerPath,owner);
    main.evidence.currentRendererContinuity={schemaVersion:'m2-existing-four-slot-current-renderer-reference-v1',ref:{path:ownerPath,sha256:mod.sha(bytes(ownerPath))},nativeFourSlotRef:proof.nativeFourSlotRef,nativeRootAcceptanceRef:proof.nativeRootAcceptanceRef,existingApprovedNativeVectorTransportRef:owner.existingNativeVectorTransportRef,newMathematicalQa:0,newMetadataApproval:0,sourceContentHoldsReleased:0};
    save(sp,js(f.observed));save(cp,main);mainCommit=commit('synthetic owner main full compact and immutable observations');
    proof.mainCompactRef=ref(mainCommit,cp,true);proof.mainSourceRef=ref(mainCommit,sp,true);proof.mainCurrentRendererRef=ref(mainCommit,ownerPath);proof.mainNativeVectorTransportRef=ref(mainCommit,transportPath);
    save(sp,js(f.bank));signCarrier();
  }
  function signCarrier(){
    save(copyPath,execFileSync('git',['-C',f.root,'show',proof.nativeFourSlotRef.commit+':'+proof.nativeFourSlotRef.path]));
    const copyCommit=commit('durable byte-identical original native copy');proof.nativeFourSlotCopyRef=ref(copyCommit,copyPath);
    save(carrierPath,proof);proofCommit=commit('explicit native amendment carrier');
    data.evidence[contract.GROUP]={carrier:ref(proofCommit,carrierPath),nativeFourSlotCopy:proof.nativeFourSlotCopyRef,currentRenderer:proof.mainCurrentRendererRef,nativeVectorTransport:proof.mainNativeVectorTransportRef};save(cp,data);
  }
  function signNative({updateAcceptance=true}={}){
    save(sp,js(f.before));save(np+'four-slot.json',native);save(np+'review.json',review);save(np+'independent-sample.json',independent);
    if(updateAcceptance)Object.assign(accepted,{fourSlotSha256:mod.sha(bytes(np+'four-slot.json')),reviewSha256:mod.sha(bytes(np+'review.json')),independentSampleSha256:mod.sha(bytes(np+'independent-sample.json'))});
    save(np+'root-acceptance.json',accepted);nativeCommit=commit('truthfully rebound native authority counterexample');
    for(const [key,file]of [['nativeFourSlotRef','four-slot.json'],['nativeReviewRef','review.json'],['nativeRootAcceptanceRef','root-acceptance.json'],['nativeIndependentSampleRef','independent-sample.json']])proof[key]=ref(nativeCommit,np+file,true);
    proof.nativeSourceRef=ref(nativeCommit,sp,true);owner.nativeRefs=nativeRefs();transport.nativeRefs=nativeRefs();
    owner.rows.forEach((r,i)=>{r.existingNativeItemSha256=hash(native.items[i]);});
    transport.rows[0].nativeItemSha256=hash(native.items[0]);transport.rows[0].changes[0].nativeEntries=clone(native.items[0].slots.given);
    owner.existingFallbacksPreserved[0].nativeSpecificEntry=clone(native.items[2].slots.method[0]);transport.existingFallbacksPreserved=clone(owner.existingFallbacksPreserved);
    signOwner();
  }
  signOwner();
  return {...f,data,prior,main,proof,native,review,accepted,independent,owner,transport,contact,raw,copyPath,ownerPath,transportPath,rawPath,contactPath,carrierPath,np,priorValidatedCommit,observedCommit,signOwner,signCarrier,signNative,write:()=>save(cp,data),commitCandidate:()=>commit('commit issued amendment candidate')};
}
module.exports={fixture,stable,uid,source,sp,cp,dp,mod,contract,priorContract,dir,np,hash};
