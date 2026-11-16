'use strict';
// A separate successor for an exact restored native PNG and an independently
// accepted first-line clarification. It does not widen current-continuity-v1.
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {sourceNumber,sourceIdentityNumber}=require('./exam-items.cjs');
const GROUP='currentM2RepairClosure';
const SCHEMA='m2-s2-exact-native-rhs-repair-closure-v1';
const SCOPE='EXACT_NATIVE_PROBLEM_AND_APPROVED_FIRST_SOLUTION_LINE_REPAIR';
const OWNER_SCHEMA='m2s2-small-exam-four-slot-native-rhs-restoration-continuity-v2';
const OBSERVATION_SCHEMA='m2s2-root-exact-native-rhs-repair-observation-v1';
const PROPOSAL_SCHEMA='m2s2-existing-native-rhs-solution-clarification-and-renderer-restoration-proposal-v2';
const OLD_GROUP='currentM2Continuity';
const HOLD_SCHEMA='4slot-m2s2-current-renderer-hold-v1';
const ZERO=['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites'];
const REF3=['commit','path','sha256'],REF4=['commit','path','gitBlobSha1','sha256'];
const TUPLE=['questionUid','sourceOrdinal','sourceQuestionNo','ordinal'];
const CHANGE=['image','imageAlt','imageSize','layoutTag','solution'];
const SHA=/^[a-f0-9]{64}$/,GIT=/^[a-f0-9]{40}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const DOC=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const CARRIER=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/m2-current-four-slot-repair-closure\.json$/;
const SOURCE=/^archive\/exams\/original\/middle\/m2\/2(?:mid|final)\/.+\.js$/;
const COMPACT=/^archive\/data\/item-4slot\/original\/middle\/m2\/2(?:mid|final)\/.+\.4slot\.json$/;
const NATIVE=/^archive\/data\/meta-review\/m2-s2-20261114\/exams\/E\d{3}\/[a-z-]+\.json$/;
const ASSET=/^archive\/assets\/.+\.(?:svg|png|jpe?g|gif|webp)$/i;
const own=(x,k)=>Object.hasOwn(x||{},k);
const has=d=>own(d.evidence,GROUP);
const git=(root,...args)=>execFileSync('git',['-C',root,'-c','core.quotepath=false',...args],{timeout:30000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
const short=r=>({commit:r?.commit,path:r?.path,sha256:r?.sha256});

// These are live evidence inputs, not an approval cache. The full validator also
// reads every required proof before any builder cache can be used.
function evidenceDigests(root,d,{safe,sha}) {
  if(!has(d))return {};
  const out={},queue=Object.values(d.evidence[GROUP]||{});
  const old=d.evidence?.[OLD_GROUP];queue.push(...Object.values(old||{}));
  const seen=new Set();
  for(let i=0;i<queue.length;i++){
    const r=queue[i];if(!r?.path||seen.has(r.path))continue;seen.add(r.path);
    try{
      const b=fs.readFileSync(safe(root,r.path));out[r.path]=sha(b);
      if(DOC.test(r.path)){
        const p=JSON.parse(b);
        if(p.rawObservationRef)queue.push(p.rawObservationRef);
        if(p.restoration?.proposalRef)queue.push(p.restoration.proposalRef);
        if(p.independentMechanicalRead)queue.push(p.independentMechanicalRead);
      }
    }catch{out[r.path]=null;}
  }
  return out;
}

function validateCore(root,d,hp,replayHistorical,historicalCommit=null,historicalReads=null) {
  const {safe,sha,blob,stable,payloadHash,assetRefs,loadBank,identity}=hp;
  const fail=s=>{throw Error('M2_CURRENT_REPAIR_'+s);};
  const same=(a,b)=>stable(a)===stable(b);
  const keys=(x,ks)=>{if(!x||typeof x!=='object'||Array.isArray(x)||!same(Object.keys(x).sort(),[...ks].sort()))fail('FIELDS');};
  // Historical replay reads the literal prior snapshot. Ordinary validation
  // keeps its exact live source/evidence requirement; no external skip flag.
  const rawLive=p=>{let raw;if(historicalCommit){raw=rawAt(historicalCommit,p);}else{const f=safe(root,p);if(!fs.lstatSync(f).isFile()||fs.lstatSync(f).isSymbolicLink())fail('LIVE_REGULAR_FILE');raw=fs.readFileSync(f);}if(historicalReads&&DOC.test(p))historicalReads.set(p,{commit:historicalCommit,path:p,gitBlobSha1:blob(raw),sha256:sha(raw)});return raw;};
  function rawAt(commit,p){
    if(!GIT.test(commit||''))fail('COMMIT');safe(root,p);
    const entry=git(root,'ls-tree','-z','--full-tree',commit,'--',p).toString();
    const m=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
    if(!m||m[3]!==p)fail('IMMUTABLE_REGULAR_FILE');
    const b=git(root,'show',commit+':'+p);if(blob(b)!==m[2])fail('IMMUTABLE_BLOB');return b;
  }
  function immutable(r,pattern,{full=false,live=false}={}){
    keys(r,full?REF4:REF3);if(!SHA.test(r.sha256||'')||!pattern.test(r.path||''))fail('REFERENCE');
    const b=rawAt(r.commit,r.path);
    if(sha(b)!==r.sha256||full&&(!GIT.test(r.gitBlobSha1||'')||blob(b)!==r.gitBlobSha1))fail('IMMUTABLE_BYTES');
    if(live&&!rawLive(r.path).equals(b))fail('LIVE_BYTES');return b;
  }
  const doc=(r,pattern,options)=>JSON.parse(immutable(r,pattern,options));
  const changed=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>own(a,k)!==own(b,k)||!same(a[k],b[k])).sort();
  const withoutHold=x=>{const y=structuredClone(x);delete y.registrationHold;return y;};
  try{
    const group=d.evidence?.[GROUP];keys(group,['carrier','ownerReview','rootObservation']);
    const p=doc(group.carrier,CARRIER,{live:true});
    keys(p,['schemaVersion','scope','transportAuthor','examId','sourceArchiveFile','expectedQuestionCount','historicalCompactRef','currentOwnerCompactRef','sourceRef','ownerReviewRef','rootObservationRef','selected','historicalNegativeRefs','nativeProblemAssetRef','currentAssetRefs',...ZERO]);
    if(p.schemaVersion!==SCHEMA||p.scope!==SCOPE||!p.transportAuthor||!/^E\d{3}$/.test(p.examId||'')||p.sourceArchiveFile!==d.sourceArchiveFile||!same(p.ownerReviewRef,group.ownerReview)||!same(p.rootObservationRef,group.rootObservation)||ZERO.some(k=>p[k]!==0))fail('SCOPE');
    const s=p.selected;keys(s,TUPLE);
    if(!UID.test(s.questionUid||'')||!Number.isSafeInteger(s.sourceOrdinal)||s.sourceOrdinal<1||!Number.isSafeInteger(s.ordinal)||s.ordinal<1||typeof s.sourceQuestionNo!=='string')fail('SELECTED');
    const replay=replayHistorical(root,p.historicalCompactRef,hp);
    if(replay.errors.length)fail('HISTORICAL_V1:'+replay.errors.join('|'));
    if(historicalReads)for(const r of replay.requiredLiveEvidence||[])historicalReads.set(r.path,r);
    const historical=replay.document,legacyGroup=historical.evidence[OLD_GROUP];
    if(historical.sourceArchiveFile!==d.sourceArchiveFile||!same(d.evidence[OLD_GROUP],legacyGroup))fail('HISTORICAL_GROUP');
    // Original negative witnesses stay live and immutable. Historical source and
    // old renderer bytes are read at the original snapshot, never as current.
    const originalCarrier=doc(legacyGroup.carrier,DOC,{live:true});
    const oldObservation=doc(legacyGroup.observation,DOC,{live:true});
    const oldClosure=doc(legacyGroup.rootClosure,DOC,{live:true});
    immutable(oldObservation.rawObservationRef,DOC,{live:true});
    immutable(oldClosure.rawObservationRef,DOC,{live:true});
    const sp='archive/exams/'+d.sourceArchiveFile,cp='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json');
    if(p.sourceRef.path!==sp||p.historicalCompactRef.path!==cp||p.currentOwnerCompactRef.path!==cp||originalCarrier.examId!==p.examId||!same(originalCarrier.heldOrdinals,[s.ordinal]))fail('EXACT_PRIOR_HOLD_SCOPE');
    const n=p.expectedQuestionCount;
    if(!Number.isSafeInteger(n)||n<2||originalCarrier.expectedQuestionCount!==n)fail('DENOMINATOR');
    const currentRaw=immutable(p.sourceRef,SOURCE,{full:true,live:true});
    const bank=loadBank(currentRaw),before=loadBank(immutable(originalCarrier.sourceRef,SOURCE,{full:true}));
    const nativeRaw=immutable(originalCarrier.nativeSourceRef,SOURCE,{full:true}),nativeBank=loadBank(nativeRaw);
    if(bank.length!==n||before.length!==n||nativeBank.length!==n||historical.items.length!==n||d.items?.length!==n||d.sourceGitBlobSha!==p.sourceRef.gitBlobSha1)fail('WHOLE_SOURCE');
    const held=historical.items.filter(x=>x.registrationHold);
    if(held.length!==1||held[0].registrationHold.schemaVersion!==HOLD_SCHEMA||TUPLE.some(k=>held[0].registrationHold[k]!==s[k]))fail('ORIGINAL_NEGATIVE');
    const obligations=hp.m2ContinuityObligation;
    if(!obligations?.required||obligations.errors.length||!Array.isArray(obligations.entries))fail('HISTORY_REQUIRED');
    const negatives=obligations.entries.filter(x=>x.kind==='NEGATIVE');
    const selectedNegatives=negatives.filter(x=>TUPLE.every(k=>x[k]===s[k]));
    if(selectedNegatives.length!==1||negatives.length!==1||selectedNegatives[0].path!==legacyGroup.rootClosure.path||selectedNegatives[0].sha256!==legacyGroup.rootClosure.sha256||!same(p.historicalNegativeRefs,[legacyGroup.rootClosure]))fail('HISTORY_COVERAGE');
    if(!obligations.entries.some(x=>x.kind==='TRANSPORT'&&x.path===legacyGroup.carrier.path&&x.sha256===legacyGroup.carrier.sha256))fail('HISTORICAL_CARRIER_REQUIRED');

    const owner=doc(group.ownerReview,DOC,{live:true}),observation=doc(group.rootObservation,DOC,{live:true});
    if(owner.schemaVersion!==OWNER_SCHEMA||owner.examId!==p.examId||owner.sourceArchiveFile!==d.sourceArchiveFile||owner.decision!=='ACCEPT_SCOPED_NATIVE_RHS_CLARIFICATION_RESTORATION_AND_UNCHANGED_VECTOR_BINDING'||!owner.reviewer||owner.reviewer===p.transportAuthor)fail('OWNER_SCOPE');
    const observedCount=originalCarrier.retainedOrdinals.length+originalCarrier.bodyTranscriptionOrdinals.length+originalCarrier.heldOrdinals.length;
    if(owner.scope!==`Q${s.ordinal}_REVIEWED_PROBLEM_RESTORATION_AND_ACCEPTED_NATIVE_RHS_FIRST_LINE_CLARIFICATION_WITH_EXISTING_${observedCount}_UID_BINDING`)fail('OWNER_SCOPE');
    if(!same(owner.remoteBeforeSourceRef,originalCarrier.sourceRef)&&!['path','gitBlobSha1','sha256'].every(k=>owner.remoteBeforeSourceRef?.[k]===originalCarrier.sourceRef[k]))fail('OWNER_BEFORE');
    immutable(owner.remoteBeforeSourceRef,SOURCE,{full:true});
    if(owner.candidateSourceRef?.path!==sp||owner.candidateSourceRef.gitBlobSha1!==p.sourceRef.gitBlobSha1||owner.candidateSourceRef.sha256!==p.sourceRef.sha256)fail('OWNER_CURRENT');
    if(owner.nativeSourceRef?.commit!==originalCarrier.nativeSourceRef.commit||owner.nativeSourceRef.path!==sp||owner.nativeSourceRef.gitBlobSha1!==originalCarrier.nativeSourceRef.gitBlobSha1||owner.nativeSourceRef.rawSha256!==originalCarrier.nativeSourceRef.sha256)fail('OWNER_NATIVE_SOURCE');
    for(const [key,oldKey]of [['four-slot.json','nativeFourSlotRef'],['review.json','nativeReviewRef'],['root-acceptance.json','rootAcceptanceRef'],['independent-sample.json','independentSampleRef']]){
      const r=owner.nativeRefs?.[key];if(!same(short(r),originalCarrier[oldKey]))fail('OWNER_NATIVE_AUTHORITY');immutable(r,NATIVE,{full:true});
    }
    if(owner.originalCompactRef?.path!==originalCarrier.priorCompactRef.path||owner.originalCompactRef.rawSha256!==originalCarrier.priorCompactRef.sha256||owner.originalCompactRef.gitBlobSha1!==originalCarrier.priorCompactRef.gitBlobSha1)fail('OWNER_ORIGINAL_VECTOR');
    const protection=owner.sourceAndApprovalProtection;
    if(!protection||['originalCompactItemsAndReviewedByPreserved','originalHistoricalSourceReuseReferencePreserved','normalBlanksAndCandidateTermsPreserved','originalSourceMetadataAndFlagsPreserved'].some(k=>protection[k]!==true)||['registryWrites','metadataWrites','identityMapWrites','holdsReleased'].some(k=>protection[k]!==0)||protection.preservationReceiptInvented!==false)fail('OWNER_APPROVAL_BOUNDARY');
    const counts=owner.counts;
    if(counts?.examDenominator!==n||counts.existingApprovedVectorsReused!==n||counts.exactNativeProblemRestoration!==1||counts.solutionFirstLineClarifications!==1||['vectorChanges','methodChanges','newTermIds','newMetadataApprovals','newFullMathematicalQa'].some(k=>counts[k]!==0))fail('OWNER_DENOMINATOR');
    const restoration=owner.restoration;
    if(!restoration||['exactOnlyQ2FourRendererFieldsAndFirstSolutionLine','other22QuestionsUnchanged','originalSolutionSuffixAndSolutionImageRetained','identityMapNotModified'].some(k=>restoration[k]!==true))fail('OWNER_REPAIR_BOUNDARY');
    keys(restoration.proposalRef,['path','sha256']);
    const proposal=doc({commit:group.ownerReview.commit,...restoration.proposalRef},DOC,{live:true});
    if(proposal.schemaVersion!==PROPOSAL_SCHEMA||proposal.decision!=='PROPOSE_EXACT_REVIEWED_RHS_FIRST_LINE_CLARIFICATION_AND_RENDERER_RESTORATION'||proposal.questionUid!==s.questionUid||proposal.sourceOrdinal!==s.sourceOrdinal||proposal.sourceArchiveFile!==d.sourceArchiveFile||!same(proposal.solutionClarification,owner.solutionClarification))fail('EXACT_OWNER_PROPOSAL');
    const clar=owner.solutionClarification;
    if(clar?.decision!=='APPROVE_SCOPED_EXISTING_NATIVE_METHOD_TRANSPORT_TO_FIRST_SOLUTION_LINE'||clar.changedLines!==1||['following24DegreeCalculationAndAnswerByteIdentical','actualReviewedProblemImageViewedAgain','actualExistingSolutionSvgMarkupRead','originalHistoricalSourceNotePreserved','currentFirstLineMismatchResolved','allOtherNativeDebtsRemain'].some(k=>clar[k]!==true)||['newSourceConditionInvented','newFullMathQa','newMetadataOrResolverApproval'].some(k=>clar[k]!==false))fail('FIRST_LINE_AUTHORITY');
    const reviewed=doc(originalCarrier.nativeReviewRef,NATIVE),nativeItem=reviewed.items.filter(x=>x.questionUid===s.questionUid&&x.sourceOrdinal===s.sourceOrdinal);
    const nr=clar.existingNativeItemRef;
    if(nativeItem.length!==1||!same(short(nr),originalCarrier.nativeReviewRef)||nr.questionUid!==s.questionUid||nr.sourceOrdinal!==s.sourceOrdinal||nr.itemStableSha256!==sha(stable(nativeItem[0]))||clar.acceptedNativePrimaryMethod!==nativeItem[0].primaryMethod||clar.acceptedNativeDecisiveStep!==nativeItem[0].decisiveStep)fail('EXISTING_NATIVE_METHOD');
    immutable(Object.fromEntries(REF4.map(k=>[k,nr[k]])),NATIVE,{full:true});

    keys(observation,['schemaVersion','reviewer','observedAtUtc','scope','sourceArchiveFile','questionUid','sourceOrdinal','expectedQuestionCount','currentSource','nativeAuthorityCommit','actualViewedProblemAsset','visiblePremises','sourceBoundary','review','ownerRepairProof','independentMechanicalRead','decision','priorNegativeEvidenceRemainsHistorical','registrationHoldReleased','registrationResult','requiredNext']);
    if(observation.schemaVersion!==OBSERVATION_SCHEMA||observation.scope!==`EXACT_${p.examId}_Q${s.ordinal}_CURRENT_PROBLEM_RESTORATION_AND_FIRST_SOLUTION_LINE_ONLY`||observation.sourceArchiveFile!==d.sourceArchiveFile||observation.questionUid!==s.questionUid||observation.sourceOrdinal!==s.sourceOrdinal||observation.expectedQuestionCount!==n||!observation.reviewer||[owner.reviewer,p.transportAuthor,originalCarrier.transportAuthor].includes(observation.reviewer)||!Number.isFinite(Date.parse(observation.observedAtUtc)))fail('INDEPENDENT_SCOPE');
    if(!same(observation.currentSource,{commit:p.sourceRef.commit,blobSha1:p.sourceRef.gitBlobSha1,rawSha256:p.sourceRef.sha256})||observation.nativeAuthorityCommit!==originalCarrier.nativeSourceRef.commit||observation.ownerRepairProof?.path!==group.ownerReview.path||observation.ownerRepairProof.rawSha256!==group.ownerReview.sha256)fail('INDEPENDENT_BINDING');
    keys(observation.ownerRepairProof,['path','rawSha256']);keys(observation.independentMechanicalRead,['path','rawSha256']);
    immutable({commit:group.rootObservation.commit,path:observation.independentMechanicalRead.path,sha256:observation.independentMechanicalRead.rawSha256},DOC,{live:true});
    const review=observation.review;
    const readTrue=['nativePngActuallyViewed','currentFirstSolutionLineActuallyRead','rhsPremiseAndInferenceCheckedAgainstImage','derivedEqualAnglesAreNotTreatedAsGivenMarks','solutionSvgMarkupRead'];
    const readFalse=['solutionSvgImageViewed','browserRenderingRun','newNativeMetadataApproval','newSlotVectorApproval','newDifficultyApproval'];
    keys(review,[...readTrue,...readFalse]);
    if(readTrue.some(k=>review[k]!==true)||readFalse.some(k=>review[k]!==false))fail('ACTUAL_OBSERVATION_BOUNDARY');
    const premiseTrue=['rightAngleC','rightAngleE','equalLengthMarksOnBEAndBC','commonSegmentBD','angleDBC24Degrees','angleAtAUnknown'];
    keys(observation.visiblePremises,[...premiseTrue,'givenAngleBisectorClaimed']);
    if(premiseTrue.some(k=>observation.visiblePremises[k]!==true)||observation.visiblePremises.givenAngleBisectorClaimed!==false)fail('OBSERVED_PREMISE_BOUNDARY');
    if(observation.decision!=='ACCEPT_EXACT_CURRENT_NATIVE_PROBLEM_RESTORATION_AND_REVIEWED_RHS_FIRST_LINE_BOUNDARY'||observation.priorNegativeEvidenceRemainsHistorical!==true||observation.registrationHoldReleased!==false||observation.registrationResult!=='NOT_RUN'||typeof observation.requiredNext!=='string'||!observation.requiredNext.trim())fail('OBSERVATION_NOT_REGISTRATION');

    const index=s.sourceOrdinal-1,q=bank[index],old=before[index],native=nativeBank[index];
    if(sourceNumber(q)!==s.ordinal||sourceIdentityNumber(q)!==s.sourceQuestionNo||!same(changed(old,q),[...CHANGE].sort()))fail('EXACT_CHANGED_FIELDS');
    const boundary=observation.sourceBoundary;
    keys(boundary,['contentUnchanged','outsideQ2WholeQuestionsUnchanged','changedFields','nativeImageReferenceRestored','previousUnsupportedImageAltRemoved','solutionPrefixBeforeSha256','solutionPrefixAfterSha256','solutionSuffixUnchanged','firstLineExactlyMatchesOwnerReviewedReplacement']);
    if(boundary.outsideQ2WholeQuestionsUnchanged!==n-1||!same([...boundary.changedFields].sort(),[...CHANGE].sort())||['contentUnchanged','nativeImageReferenceRestored','previousUnsupportedImageAltRemoved','solutionSuffixUnchanged','firstLineExactlyMatchesOwnerReviewedReplacement'].some(k=>boundary[k]!==true))fail('OBSERVED_SOURCE_BOUNDARY');
    const first=clar.originalFirstLine,next=clar.replacementFirstLine;
    if(typeof first!=='string'||!first||typeof next!=='string'||!next||first===next||/[\r\n]/.test(first+next)||typeof old.solution!=='string'||!old.solution.startsWith(first)||sha(first)!==boundary.solutionPrefixBeforeSha256||sha(next)!==boundary.solutionPrefixAfterSha256)fail('SOLUTION_PREFIX');
    const suffix=old.solution.slice(first.length);
    if(!/^(?:\r?\n|\\n)/.test(suffix)||q.solution!==next+suffix||!same(old.content,q.content)||own(q,'imageAlt')||typeof q.image!=='string'||q.image!==native.image)fail('SOLUTION_SUFFIX_OR_NATIVE_IMAGE');
    keys(proposal.sourceDelta,['set','remove']);
    if(!proposal.sourceDelta.set||typeof proposal.sourceDelta.set!=='object'||Array.isArray(proposal.sourceDelta.set)||!proposal.sourceDelta.remove||typeof proposal.sourceDelta.remove!=='object'||Array.isArray(proposal.sourceDelta.remove))fail('PROPOSAL_DELTA');
    const reconstructed=structuredClone(old),deltaKeys=[...Object.keys(proposal.sourceDelta.set),...Object.keys(proposal.sourceDelta.remove)];
    if(new Set(deltaKeys).size!==deltaKeys.length||!same([...deltaKeys].sort(),[...CHANGE].sort()))fail('PROPOSAL_FIELDS');
    for(const [k,value]of Object.entries(proposal.sourceDelta.remove)){if(!own(old,k)||!same(old[k],value))fail('REMOVED_PRIOR_VALUE');delete reconstructed[k];}
    // The immutable r2 proposal carries the complete old/new solution strings
    // in a closed transition object; it is not a source field object to copy.
    const solutionDelta=proposal.sourceDelta.set.solution;keys(solutionDelta,['before','after']);
    if(typeof solutionDelta.before!=='string'||typeof solutionDelta.after!=='string'||solutionDelta.before!==old.solution||solutionDelta.after!==q.solution)fail('PROPOSAL_SOLUTION_TRANSITION');
    Object.assign(reconstructed,{...proposal.sourceDelta.set,solution:solutionDelta.after});
    if(!same(reconstructed,q))fail('EXACT_OWNER_DELTA');
    const nativeAsset=immutable(p.nativeProblemAssetRef,ASSET,{full:true});
    if(p.nativeProblemAssetRef.commit!==originalCarrier.nativeSourceRef.commit||p.nativeProblemAssetRef.path!=='archive/'+native.image.replace(/^archive\//,'')||!/\.png$/i.test(p.nativeProblemAssetRef.path)||!nativeAsset.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))fail('NATIVE_PNG');
    immutable(restoration.restoredAsset,ASSET,{full:true});
    if(!['path','gitBlobSha1','sha256'].every(k=>restoration.restoredAsset[k]===p.nativeProblemAssetRef[k]))fail('OWNER_RESTORED_ASSET');
    const viewed=observation.actualViewedProblemAsset;
    keys(viewed,['path','rawSha256','gitBlobSha1','bytes','method','nativeAndCurrentRawExact']);
    if(viewed.path!==p.nativeProblemAssetRef.path||viewed.rawSha256!==sha(nativeAsset)||viewed.gitBlobSha1!==blob(nativeAsset)||viewed.bytes!==nativeAsset.length||viewed.method!=='ACTUAL_TOOL_IMAGE_VIEW_OF_EXACT_CURRENT_NATIVE_PNG'||viewed.nativeAndCurrentRawExact!==true)fail('ACTUAL_NATIVE_PNG');
    if(!Array.isArray(p.currentAssetRefs)||!same(p.currentAssetRefs.map(r=>r.path).sort(),assetRefs(q)))fail('SELECTED_ASSET_COVERAGE');
    for(const r of p.currentAssetRefs){if(r.commit!==p.sourceRef.commit)fail('ASSET_CURRENT_COMMIT');immutable(r,ASSET,{full:true,live:true});}
    if(!Array.isArray(owner.rows)||owner.rows.length!==n||new Set(owner.rows.map(r=>r.sourceOrdinal)).size!==n)fail('OWNER_FULL_VECTOR_COVERAGE');
    for(let i=0;i<n;i++){
      const current=bank[i],previous=before[i],ordinal=sourceNumber(current),ids=(identity.records||[]).filter(x=>x.sourceArchiveFile===d.sourceArchiveFile&&x.sourceOrdinal===i+1);
      if(ids.length!==1||sourceNumber(previous)!==ordinal)fail('CURRENT_IDENTITY');
      if(i!==index&&!same(current,previous))fail('UNCHANGED_PEER');
      const vector=historical.items.find(x=>x.ordinal===ordinal),row=owner.rows.find(x=>x.sourceOrdinal===i+1);
      if(!vector||!row||row.questionUid!==ids[0].questionUid||String(row.sourceQuestionNo)!==sourceIdentityNumber(current)||row.candidateStudentPayloadSha256!==payloadHash(current)||row.originalCompactItemSha256!==sha(stable(withoutHold(vector)))||['existingValidTermIdVectorsExact','formatUnchanged','methodUnchanged'].some(k=>row[k]!==true)||!same(row.originalCandidateTerms,vector.candidates))fail('OWNER_VECTOR_ROW');
      for(const ap of assetRefs(current)){
        const currentBytes=rawAt(p.sourceRef.commit,ap);
        if(!rawLive(ap).equals(currentBytes))fail('CURRENT_ASSET_BYTES');
        const expected=i===index&&ap===p.nativeProblemAssetRef.path?nativeAsset:rawAt(originalCarrier.sourceRef.commit,ap);
        if(!expected.equals(currentBytes))fail('UNCHANGED_ASSET');
      }
    }
    const currentOwner=doc(p.currentOwnerCompactRef,COMPACT,{full:true});
    const expectedOwner=structuredClone(historical);delete expectedOwner.evidence[OLD_GROUP];
    expectedOwner.sourceGitBlobSha=p.sourceRef.gitBlobSha1;expectedOwner.items=expectedOwner.items.map(withoutHold);
    expectedOwner.evidence.currentRendererContinuity={schemaVersion:'m2-existing-four-slot-current-renderer-reference-v1',ref:{path:group.ownerReview.path,sha256:group.ownerReview.sha256},nativeFourSlotRef:{...owner.nativeRefs['four-slot.json'],sourceGitBlobSha:originalCarrier.nativeSourceRef.gitBlobSha1},nativeRootAcceptanceRef:owner.nativeRefs['root-acceptance.json'],unchangedVectorCount:n,rendererReviewedOrdinals:[...originalCarrier.retainedOrdinals,...originalCarrier.bodyTranscriptionOrdinals].sort((a,b)=>a-b),exactRestoredProblemOrdinal:s.ordinal,acceptedNativeSolutionClarificationOrdinal:s.ordinal,newMathematicalQa:0,newMetadataApproval:0};
    if(!same(expectedOwner,currentOwner))fail('EXACT_OWNER_COMPACT');
    const expected=structuredClone(currentOwner);expected.evidence[OLD_GROUP]=legacyGroup;expected.evidence[GROUP]=group;
    if(!same(expected,d))fail('COMPACT_CHANGED');
    return [];
  }catch(error){return [String(error.message).startsWith('M2_CURRENT_')?error.message:'M2_CURRENT_REPAIR_EVIDENCE_UNAVAILABLE'];}
}

function validateFile(root,d,hp,replayHistorical){return validateCore(root,d,hp,replayHistorical);}
function validateHistoricalFile(root,reference,hp,replayHistorical){
  try{
    const {safe,sha,blob,stable}=hp;
    if(!reference||stable(Object.keys(reference).sort())!==stable([...REF4].sort())||!GIT.test(reference.commit||'')||!SHA.test(reference.sha256||'')||!GIT.test(reference.gitBlobSha1||'')||!COMPACT.test(reference.path||''))throw Error('REFERENCE');
    safe(root,reference.path);
    const entry=git(root,'ls-tree','-z','--full-tree',reference.commit,'--',reference.path).toString();
    const match=/^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
    if(!match||match[2]!==reference.path||match[1]!==reference.gitBlobSha1)throw Error('MODE');
    const raw=git(root,'show',reference.commit+':'+reference.path);
    if(sha(raw)!==reference.sha256||blob(raw)!==reference.gitBlobSha1)throw Error('BYTES');
    const document=JSON.parse(raw);
    if(!has(document)||Object.hasOwn(document.evidence||{},'currentM2RepairMetadataContinuity')||Object.hasOwn(document.evidence||{},'currentM2DisplayRepairClosure'))throw Error('ORIGINAL_REPAIR_REQUIRED');
    const reads=new Map(),errors=validateCore(root,document,hp,replayHistorical,reference.commit,reads);
    return {errors,document,requiredLiveEvidence:[...reads.values()].sort((a,b)=>a.path.localeCompare(b.path,'en'))};
  }catch{return {errors:['M2_CURRENT_REPAIR_HISTORICAL_INPUT_INVALID'],document:null,requiredLiveEvidence:[]};}
}
module.exports={GROUP,SCHEMA,SCOPE,OWNER_SCHEMA,OBSERVATION_SCHEMA,PROPOSAL_SCHEMA,ZERO,has,evidenceDigests,validateFile,validateHistoricalFile};
