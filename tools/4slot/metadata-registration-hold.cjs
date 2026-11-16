// Preserve the existing negative renderer decision through one explicit,
// independently registered source metadata candidate. This module approves no slots.
'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const SCHEMA='m3-s2-renderer-hold-metadata-continuity-v1';
const SCOPE='EXACT_M3_SCOPE_METADATA_TRANSPORT_PRESERVE_RENDERER_HOLD';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
const SHA=/^[a-f0-9]{64}$/,GIT=/^[a-f0-9]{40}$/;
const FIELDS=['courseKey','curriculumKey'];
function hasClaim(d,it) {
  return own(it?.registrationHold,'metadataTransportEvidence')||own(d.evidence?.nativeHoldReview,'metadataContinuity');
}
function validate(root,d,it,id,cur,hp,validateCorrected) {
  const {safe,sha,blob,stable,payloadHash,identityHash,git,loadBank}=hp;
  const same=(a,b)=>stable(a)===stable(b);
  const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&same(Object.keys(o).sort(),[...keys].sort());
  const fail=m=>{throw Error('HOLD_METADATA_'+m);};
  const plainRef=r=>exact(r,['commit','path','sha256'])&&GIT.test(r.commit)&&SHA.test(r.sha256);
  function immutable(r,pattern,local=false) {
    if(!r||!GIT.test(r.commit||'')||!SHA.test(r.sha256||'')||!pattern.test(r.path||''))fail('IMMUTABLE_REFERENCE_INVALID');
    safe(root,r.path);
    const raw=git(root,['show',r.commit+':'+r.path]);
    if(raw===null||sha(raw)!==r.sha256||own(r,'gitBlobSha1')&&blob(raw)!==r.gitBlobSha1)fail('IMMUTABLE_BYTES_MISMATCH');
    if(local&&sha(fs.readFileSync(safe(root,r.path)))!==r.sha256)fail('LOCAL_EVIDENCE_CHANGED');
    return raw;
  }
  try {
    const h=it.registrationHold,ref=h.metadataTransportEvidence;
    if(!plainRef(ref)||!same(ref,d.evidence?.nativeHoldReview?.metadataContinuity))fail('CARRIER_REFERENCE_REQUIRED');
    const carrier=JSON.parse(immutable(ref,/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/,true));
    const keys=['schemaVersion','scope','decision','questionUid','sourceOrdinal','sourceArchiveFile','sourceQuestionCount',
      'priorCompactRef','correctedHoldRef','candidate','materializedSource','selected','changedMetadataFields',
      'newSemanticApprovals','newDifficultyApprovals','newFourSlotApprovals','newReviewPassCount','sourceWrites','slotChanges','registryWrites'];
    if(!exact(carrier,keys)||carrier.schemaVersion!==SCHEMA||carrier.scope!==SCOPE||carrier.decision!=='WITHHOLD_REGISTRATION'||
      ['newSemanticApprovals','newDifficultyApprovals','newFourSlotApprovals','newReviewPassCount','sourceWrites','slotChanges','registryWrites'].some(k=>carrier[k]!==0))fail('NEGATIVE_DECISION_REQUIRED');
    if(!/^original\/middle\/m3\/2(?:mid|final)\/[^/]+\.js$/.test(d.sourceArchiveFile)||carrier.sourceArchiveFile!==d.sourceArchiveFile||
      carrier.questionUid!==id.questionUid||carrier.sourceOrdinal!==cur.ordinal||h.reason!=='SOURCE_RENDERER_CORRECTION_PENDING')fail('IDENTITY_MISMATCH');
    const sourcePath='archive/exams/'+d.sourceArchiveFile,compactPath='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json');
    const candidate=carrier.candidate,source=carrier.materializedSource,priorRef=carrier.priorCompactRef;
    if(!exact(candidate,['baseCommit','inputCommit','manifestRef','requestRef'])||!GIT.test(candidate.baseCommit)||!GIT.test(candidate.inputCommit)||
      !exact(priorRef,['commit','path','gitBlobSha1','sha256'])||priorRef.commit!==candidate.baseCommit||priorRef.path!==compactPath||!GIT.test(priorRef.gitBlobSha1)||
      !exact(source,['path','gitBlobSha1','sha256'])||source.path!==sourcePath||!GIT.test(source.gitBlobSha1)||!SHA.test(source.sha256))fail('CANDIDATE_BINDING_INVALID');
    const prior=JSON.parse(immutable(priorRef,/^archive\/data\/item-4slot\/.+\.4slot\.json$/));
    const oldItems=prior.items?.filter(x=>x.ordinal===it.ordinal)||[],old=oldItems[0],oldHold=old?.registrationHold;
    if(oldItems.length!==1||hasClaim(prior,old)||!plainRef(carrier.correctedHoldRef)||!same(carrier.correctedHoldRef,oldHold?.reviewEvidence)||
      !same(oldHold?.reviewEvidence,h.reviewEvidence)||!same(oldHold?.independentEvidence,h.independentEvidence))fail('ORIGINAL_CORRECTED_HOLD_REQUIRED');
    const corrected=JSON.parse(immutable(carrier.correctedHoldRef,/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/,true));
    const beforeRaw=git(root,['show',candidate.baseCommit+':'+sourcePath]),currentRaw=fs.readFileSync(safe(root,sourcePath));
    if(beforeRaw===null||blob(beforeRaw)!==corrected.sourceRef?.gitBlobSha1||sha(beforeRaw)!==corrected.sourceRef?.sha256||
      blob(beforeRaw)!==prior.sourceGitBlobSha||blob(currentRaw)!==source.gitBlobSha1||sha(currentRaw)!==source.sha256||
      source.gitBlobSha1!==d.sourceGitBlobSha||source.gitBlobSha1!==h.sourceGitBlobSha||source.gitBlobSha1===prior.sourceGitBlobSha)fail('SOURCE_BYTES_MISMATCH');
    const before=loadBank(beforeRaw),after=loadBank(currentRaw),n=cur.ordinal-1;
    if(!Number.isSafeInteger(carrier.sourceQuestionCount)||carrier.sourceQuestionCount<1||before.length!==carrier.sourceQuestionCount||after.length!==before.length||
      n<0||n>=before.length||!same(after[n],cur.q)||!same(carrier.changedMetadataFields,FIELDS)||!Array.isArray(carrier.selected)||!carrier.selected.length)fail('SOURCE_SCOPE_MISMATCH');
    const selected=new Map(),uids=new Set();
    for(const row of carrier.selected) {
      if(!exact(row,['questionUid','sourceOrdinal'])||!/^qid_v1_[a-f0-9]{64}$/.test(row.questionUid||'')||uids.has(row.questionUid)||
        !Number.isSafeInteger(row.sourceOrdinal)||row.sourceOrdinal<1||row.sourceOrdinal>after.length||selected.has(row.sourceOrdinal))fail('SELECTED_INVENTORY_INVALID');
      selected.set(row.sourceOrdinal,row.questionUid);uids.add(row.questionUid);
    }
    if(selected.get(cur.ordinal)!==id.questionUid)fail('HELD_UID_NOT_SELECTED');
    for(let i=0;i<before.length;i++) {
      const changed=[...new Set([...Object.keys(before[i]),...Object.keys(after[i])])].filter(k=>own(before[i],k)!==own(after[i],k)||!same(before[i][k],after[i][k])).sort();
      if(!selected.has(i+1)) {if(changed.length)fail('UNSELECTED_QUESTION_CHANGED');}
      else if(!same(changed,FIELDS)||FIELDS.some(k=>own(before[i],k)||!own(after[i],k))||after[i].curriculumKey!=='2015'||after[i].courseKey!=='M3-2')fail('EXACT_SCOPE_FIELDS_REQUIRED');
      if(payloadHash(before[i])!==payloadHash(after[i])||identityHash(before[i])!==identityHash(after[i]))fail('STUDENT_PAYLOAD_CHANGED');
    }
    const priorErrors=validateCorrected(root,prior,old,id,{q:before[n],ordinal:cur.ordinal},hp,rel=>rel===sourcePath?beforeRaw:fs.readFileSync(safe(root,rel)));
    if(priorErrors.length)fail('CORRECTED_HOLD_INVALID:'+priorErrors.join('|'));
    const expected=JSON.parse(JSON.stringify(prior)),eh=expected.items.find(x=>x.ordinal===it.ordinal).registrationHold;
    expected.sourceGitBlobSha=source.gitBlobSha1;eh.sourceGitBlobSha=source.gitBlobSha1;
    eh.metadataTransportEvidence=ref;expected.evidence.nativeHoldReview.metadataContinuity=ref;
    if(!same(expected,d))fail('COMPACT_OR_HOLD_CHANGED');
    const raw=execFileSync(process.execPath,[path.join(__dirname,'verify-hold-metadata-replay.mjs'),'--root',path.resolve(root),
      '--carrier-path',ref.path,'--carrier-commit',ref.commit,'--carrier-sha256',ref.sha256],
      {encoding:'utf8',timeout:60000,maxBuffer:2*1024*1024,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},stdio:['ignore','pipe','pipe']});
    const checked=JSON.parse(raw);
    if(checked.schemaVersion!=='archive-renderer-hold-metadata-replay-v1'||checked.status!=='PASS'||checked.officialReplay!==true||checked.nativeScopeVerified!==true||checked.scopeAliasesVerified!==true||
      checked.requestSelectedCount!==selected.size||checked.nativeProofReproducedCount!==selected.size||checked.sourceBlobSha1!==source.gitBlobSha1||checked.sourceSha256!==source.sha256||
      checked.carrierSha256!==ref.sha256||checked.sourceWrites!==0||checked.metadataWrites!==0||checked.newFourSlotApprovals!==0)fail('OFFICIAL_REPLAY_REQUIRED');
    return [];
  }catch(error){return [error.message?.startsWith('HOLD_METADATA_')?error.message:'HOLD_METADATA_OFFICIAL_REPLAY_OR_EVIDENCE_FAILED'];}
}
module.exports={SCHEMA,SCOPE,FIELDS,hasClaim,validate};
