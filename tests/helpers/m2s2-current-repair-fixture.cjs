'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const mod=require('../../tools/4slot/build-4slot-runtime.cjs');
const old=require('../../tools/4slot/m2s2-current-continuity.cjs');
const repair=require('../../tools/4slot/m2s2-current-repair-closure.cjs');
const consumer=require('../../archive/item-4slot.js');
const {fixture,uid,stable,source,sp,cp}=require('./m2s2-current-continuity-fixture.cjs');
const plain=r=>({commit:r.commit,path:r.path,sha256:r.sha256});
const stripped=x=>{const a=structuredClone(x);delete a.registrationHold;return a;};
const refs=q=>[...new Set([...JSON.stringify(q).matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi)].map(m=>m[0].startsWith('archive/')?m[0]:'archive/'+m[0]))].sort();
const zeros=()=>Object.fromEntries(repair.ZERO.map(k=>[k,0]));

// All text, approvals and images below belong to this synthetic repository.
// It reuses the unchanged v1 fixture authority, then issues a separate repair.
function repaired(t,options={}){
  const f=fixture(t,{repairReady:true,nativeAfterByOrdinal:options.nativeAfterByOrdinal});
  const initial=mod.build(f.root).index;
  assert.equal(initial.counts.registered,4);assert.equal(initial.pending.length,1);
  const historical=structuredClone(f.data),before=structuredClone(f.bank);
  const historicalCommit=f.commit('literal issued v1 compact remains historical');
  const selected={questionUid:uid(3),sourceOrdinal:3,sourceQuestionNo:'3',ordinal:3};
  const q=f.bank[2],first='Old fixture first line.',next='Existing synthetic method gives this repaired first line.';
  q.image=f.before[2].image;q.layoutTag=f.before[2].layoutTag;q.solution=next+q.solution.slice(first.length);
  delete q.imageAlt;delete q.imageSize;
  f.save(sp,f.js(f.bank));let sourceCommit=f.commit('synthetic exact native problem and first-line correction');
  const dir='docs/operations/m2-exact-repair-fixture/';
  const proposalPath=dir+'owner-proposal.json',ownerPath=dir+'owner-review.json',rootPath=dir+'root-observation.json',mechanicalPath=dir+'mechanical-read.json',carrierPath=dir+'m2-current-four-slot-repair-closure.json';
  const nativeReview=JSON.parse(f.bytes(f.reviewPath)),nativeItem=nativeReview.items[2];
  const nativeRef=f.ref(f.nativeCommit,f.nativePath,true),nativeReviewRef=f.ref(f.nativeCommit,f.reviewPath,true);
  const sourceRef=()=>f.ref(sourceCommit,sp,true);
  const clarification={decision:'APPROVE_SCOPED_EXISTING_NATIVE_METHOD_TRANSPORT_TO_FIRST_SOLUTION_LINE',changedLines:1,originalFirstLine:first,replacementFirstLine:next,following24DegreeCalculationAndAnswerByteIdentical:true,actualReviewedProblemImageViewedAgain:true,actualExistingSolutionSvgMarkupRead:true,existingNativeItemRef:{...nativeReviewRef,questionUid:uid(3),sourceOrdinal:3,itemStableSha256:mod.sha(stable(nativeItem))},acceptedNativePrimaryMethod:nativeItem.primaryMethod,acceptedNativeDecisiveStep:nativeItem.decisiveStep,originalHistoricalSourceNotePreserved:true,currentFirstLineMismatchResolved:true,allOtherNativeDebtsRemain:true,newSourceConditionInvented:false,newFullMathQa:false,newMetadataOrResolverApproval:false};
  const proposal={schemaVersion:repair.PROPOSAL_SCHEMA,decision:'PROPOSE_EXACT_REVIEWED_RHS_FIRST_LINE_CLARIFICATION_AND_RENDERER_RESTORATION',questionUid:uid(3),sourceOrdinal:3,sourceArchiveFile:source,sourceDelta:{set:{image:q.image,layoutTag:q.layoutTag,solution:{before:before[2].solution,after:q.solution}},remove:{imageAlt:before[2].imageAlt,imageSize:before[2].imageSize}},solutionClarification:structuredClone(clarification)};
  const owner={schemaVersion:repair.OWNER_SCHEMA,scope:'Q3_REVIEWED_PROBLEM_RESTORATION_AND_ACCEPTED_NATIVE_RHS_FIRST_LINE_CLARIFICATION_WITH_EXISTING_4_UID_BINDING',decision:'ACCEPT_SCOPED_NATIVE_RHS_CLARIFICATION_RESTORATION_AND_UNCHANGED_VECTOR_BINDING',reviewer:'owner-repair-reviewer',examId:'E999',sourceArchiveFile:source,remoteBeforeSourceRef:f.proof.sourceRef,candidateSourceRef:sourceRef(),nativeSourceRef:{commit:f.proof.nativeSourceRef.commit,path:sp,gitBlobSha1:f.proof.nativeSourceRef.gitBlobSha1,rawSha256:f.proof.nativeSourceRef.sha256},nativeRefs:{'four-slot.json':nativeRef,'review.json':nativeReviewRef,'root-acceptance.json':f.ref(f.nativeCommit,f.acceptPath,true),'independent-sample.json':f.ref(f.nativeCommit,f.samplePath,true)},originalCompactRef:{path:cp,rawSha256:f.proof.priorCompactRef.sha256,gitBlobSha1:f.proof.priorCompactRef.gitBlobSha1},sourceAndApprovalProtection:{originalCompactItemsAndReviewedByPreserved:true,originalHistoricalSourceReuseReferencePreserved:true,normalBlanksAndCandidateTermsPreserved:true,originalSourceMetadataAndFlagsPreserved:true,registryWrites:0,metadataWrites:0,identityMapWrites:0,holdsReleased:0,preservationReceiptInvented:false},counts:{examDenominator:5,existingApprovedVectorsReused:5,exactNativeProblemRestoration:1,solutionFirstLineClarifications:1,vectorChanges:0,methodChanges:0,newTermIds:0,newMetadataApprovals:0,newFullMathematicalQa:0},restoration:{exactOnlyQ2FourRendererFieldsAndFirstSolutionLine:true,other22QuestionsUnchanged:true,originalSolutionSuffixAndSolutionImageRetained:true,identityMapNotModified:true,proposalRef:null,restoredAsset:f.ref(f.nativeCommit,f.oldAssets[2],true)},solutionClarification:clarification,rows:[]};
  const nativeAsset=f.bytes(f.oldAssets[2]);
  const observation={schemaVersion:repair.OBSERVATION_SCHEMA,reviewer:'root-repair-observer',observedAtUtc:'2026-11-16T00:02:00Z',scope:'EXACT_E999_Q3_CURRENT_PROBLEM_RESTORATION_AND_FIRST_SOLUTION_LINE_ONLY',sourceArchiveFile:source,questionUid:uid(3),sourceOrdinal:3,expectedQuestionCount:5,currentSource:{commit:sourceCommit,blobSha1:sourceRef().gitBlobSha1,rawSha256:sourceRef().sha256},nativeAuthorityCommit:f.nativeCommit,actualViewedProblemAsset:{path:f.oldAssets[2],rawSha256:mod.sha(nativeAsset),gitBlobSha1:mod.blob(nativeAsset),bytes:nativeAsset.length,method:'ACTUAL_TOOL_IMAGE_VIEW_OF_EXACT_CURRENT_NATIVE_PNG',nativeAndCurrentRawExact:true},visiblePremises:{rightAngleC:true,rightAngleE:true,equalLengthMarksOnBEAndBC:true,commonSegmentBD:true,angleDBC24Degrees:true,angleAtAUnknown:true,givenAngleBisectorClaimed:false},sourceBoundary:{contentUnchanged:true,outsideQ2WholeQuestionsUnchanged:4,changedFields:['image','imageAlt','imageSize','layoutTag','solution'],nativeImageReferenceRestored:true,previousUnsupportedImageAltRemoved:true,solutionPrefixBeforeSha256:mod.sha(first),solutionPrefixAfterSha256:mod.sha(next),solutionSuffixUnchanged:true,firstLineExactlyMatchesOwnerReviewedReplacement:true},review:{nativePngActuallyViewed:true,currentFirstSolutionLineActuallyRead:true,rhsPremiseAndInferenceCheckedAgainstImage:true,derivedEqualAnglesAreNotTreatedAsGivenMarks:true,solutionSvgMarkupRead:true,solutionSvgImageViewed:false,browserRenderingRun:false,newNativeMetadataApproval:false,newSlotVectorApproval:false,newDifficultyApproval:false},ownerRepairProof:null,independentMechanicalRead:null,decision:'ACCEPT_EXACT_CURRENT_NATIVE_PROBLEM_RESTORATION_AND_REVIEWED_RHS_FIRST_LINE_BOUNDARY',priorNegativeEvidenceRemainsHistorical:true,registrationHoldReleased:false,registrationResult:'NOT_RUN',requiredNext:'Synthetic exact successor validation; no real-world approval claim.'};
  const carrier={schemaVersion:repair.SCHEMA,scope:repair.SCOPE,transportAuthor:'successor-transport-author',examId:'E999',sourceArchiveFile:source,expectedQuestionCount:5,historicalCompactRef:f.ref(historicalCommit,cp,true),currentOwnerCompactRef:null,sourceRef:sourceRef(),ownerReviewRef:null,rootObservationRef:null,selected,historicalNegativeRefs:[historical.evidence[old.GROUP].rootClosure],nativeProblemAssetRef:f.ref(f.nativeCommit,f.oldAssets[2],true),currentAssetRefs:refs(q).map(p=>f.ref(sourceCommit,p,true)),...zeros()};
  const mechanical={syntheticFixture:true,newApprovals:0,sourceOrdinal:3};
  function sign(){
    f.save(proposalPath,proposal);
    owner.restoration.proposalRef={path:proposalPath,sha256:mod.sha(f.bytes(proposalPath))};
    f.save(ownerPath,owner);const ownerCommit=f.commit('synthetic immutable owner exact correction proof');
    const ownerRef=f.ref(ownerCommit,ownerPath);
    const currentOwner=structuredClone(historical);delete currentOwner.evidence[old.GROUP];
    currentOwner.sourceGitBlobSha=carrier.sourceRef.gitBlobSha1;currentOwner.items=currentOwner.items.map(stripped);
    currentOwner.evidence.currentRendererContinuity={schemaVersion:'m2-existing-four-slot-current-renderer-reference-v1',ref:{path:ownerPath,sha256:ownerRef.sha256},nativeFourSlotRef:{...nativeRef,sourceGitBlobSha:f.proof.nativeSourceRef.gitBlobSha1},nativeRootAcceptanceRef:owner.nativeRefs['root-acceptance.json'],unchangedVectorCount:5,rendererReviewedOrdinals:[1,2,5],exactRestoredProblemOrdinal:3,acceptedNativeSolutionClarificationOrdinal:3,newMathematicalQa:0,newMetadataApproval:0};
    f.save(cp,currentOwner);const ownerCompactCommit=f.commit('synthetic owner compact retains every vector');
    observation.ownerRepairProof={path:ownerPath,rawSha256:ownerRef.sha256};
    f.save(mechanicalPath,mechanical);observation.independentMechanicalRead={path:mechanicalPath,rawSha256:mod.sha(f.bytes(mechanicalPath))};
    f.save(rootPath,observation);const rootCommit=f.commit('synthetic independent exact observation');
    carrier.currentOwnerCompactRef=f.ref(ownerCompactCommit,cp,true);carrier.ownerReviewRef=ownerRef;carrier.rootObservationRef=f.ref(rootCommit,rootPath);
    f.save(carrierPath,carrier);const c=f.commit('synthetic explicit repair successor carrier');
    const data=structuredClone(currentOwner);data.evidence[old.GROUP]=historical.evidence[old.GROUP];
    data.evidence[repair.GROUP]={carrier:f.ref(c,carrierPath),ownerReview:ownerRef,rootObservation:carrier.rootObservationRef};
    f.data=data;f.save(cp,data);return data;
  }
  function updateRows(){owner.rows=f.bank.map((x,i)=>({questionUid:uid(i+1),sourceOrdinal:i+1,sourceQuestionNo:String(i+1),candidateStudentPayloadSha256:mod.payloadHash(x),originalCompactItemSha256:mod.sha(stable(stripped(historical.items[i]))),existingValidTermIdVectorsExact:true,formatUnchanged:true,methodUnchanged:true,originalCandidateTerms:historical.items[i].candidates}));}
  function rebindSource(){
    f.save(sp,f.js(f.bank));sourceCommit=f.commit('truthfully rebound synthetic source counterexample');
    carrier.sourceRef=sourceRef();carrier.currentAssetRefs=refs(f.bank[2]).map(p=>f.ref(sourceCommit,p,true));
    owner.candidateSourceRef=sourceRef();observation.currentSource={commit:sourceCommit,blobSha1:sourceRef().gitBlobSha1,rawSha256:sourceRef().sha256};
    updateRows();sign();
  }
  updateRows();sign();
  return Object.assign(f,{historical,historicalCommit,beforeRepair:before,proposal,owner,repairObservation:observation,repairCarrier:carrier,repairCarrierPath:carrierPath,repairOwnerPath:ownerPath,repairRootPath:rootPath,repairProposalPath:proposalPath,mechanicalPath,signRepair:sign,rebindRepairSource:rebindSource,write:()=>f.save(cp,f.data)});
}
module.exports={repaired,uid,stable,source,sp,cp,mod,old,repair,refs};
