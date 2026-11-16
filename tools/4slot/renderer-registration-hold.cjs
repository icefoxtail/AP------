// A negative registration decision for one current M3-S2 solution renderer.
// This contract never approves a row, waives ordinary slots, or repairs a source.
'use strict';
const fs = require('node:fs');
const metadataHold = require('./metadata-registration-hold.cjs');
const REASON = 'SOURCE_RENDERER_CORRECTION_PENDING';
const SCHEMA = 'm3-s2-renderer-correction-registration-hold-v1';
const REF = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const SHA = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;
const CONTINUITY_SCHEMA = 'm3-s2-renderer-correction-registration-hold-continuity-v1';
const CORRECTION_REF = /^\.archive-meta-register\/evidence\/[A-Za-z0-9_가-힣./-]+\.json$/;
const own = (o,k) => Object.prototype.hasOwnProperty.call(o||{},k);

function validateLegacy(root,d,it,id,cur,hp,readCurrent=rel=>fs.readFileSync(hp.safe(root,rel))) {
  const {safe,sha,blob,stable,payloadHash,identityHash,git,assetRefs} = hp;
  const h=it.registrationHold, errors=[];
  if(!/^original\/middle\/m3\/2(?:mid|final)\//.test(d.sourceArchiveFile))return ['UNSUPPORTED_HOLD_SCOPE'];
  if(d.items.filter(x=>x.registrationHold?.reason===REASON).length!==1)return ['HOLD_ONE_UID_SCOPE_REQUIRED'];
  function readProof(field,key) {
    const ref=h[field], expected=d.evidence?.nativeHoldReview?.[key];
    if(!ref||!REF.test(ref.path||'')||!COMMIT.test(ref.commit||'')||!SHA.test(ref.sha256||'')||stable(ref)!==stable(expected)) {
      errors.push('HOLD_EVIDENCE_REFERENCE_INVALID:'+key);return null;
    }
    try {
      const raw=fs.readFileSync(safe(root,ref.path));
      if(sha(raw)!==ref.sha256){errors.push('HOLD_EVIDENCE_SHA_MISMATCH:'+key);return null;}
      const immutable=git(root,['show',ref.commit+':'+ref.path]);
      if(immutable===null||sha(immutable)!==ref.sha256){errors.push('HOLD_IMMUTABLE_EVIDENCE_MISMATCH:'+key);return null;}
      return JSON.parse(raw);
    } catch { errors.push('HOLD_EVIDENCE_UNAVAILABLE:'+key);return null; }
  }
  const p=readProof('evidence','rendererCorrection'),sup=readProof('supersessionEvidence','supersession');
  if(!p||!sup)return errors;
  if(p.schemaVersion!==SCHEMA||p.reason!==REASON||p.decision!=='WITHHOLD_REGISTRATION'||p.heldUidCount!==1||
     p.replacesInterimMissingRow!==true||p.newSemanticApprovals!==0||p.newDifficultyApprovals!==0||p.sourceWrites!==0||
     p.reviewer!==d.reviewedBy.agent||p.nextAction!==h.nextAction)errors.push('HOLD_REVIEW_DECISION_MISMATCH');
  if(p.questionUid!==id.questionUid||p.sourceOrdinal!==cur.ordinal||p.sourceQuestionNo!==h.sourceQuestionNo||
     p.ordinal!==it.ordinal||p.sourceArchiveFile!==d.sourceArchiveFile)errors.push('HOLD_PROOF_IDENTITY_MISMATCH');
  if(p.fingerprintContract!=='4slot-student-payload-v1'||!SHA.test(p.studentPayloadSha256||'')||
     p.studentPayloadSha256!==h.studentPayloadSha256||p.studentPayloadSha256!==payloadHash(cur.q)||
     !SHA.test(p.sourceFingerprint||'')||p.sourceFingerprint!==h.sourceFingerprint||p.sourceFingerprint!==identityHash(cur.q))
    errors.push('HOLD_CURRENT_STUDENT_FINGERPRINT_MISMATCH');
  const slotRow={...it};delete slotRow.registrationHold;
  if(!SHA.test(p.originalCompactRowSha256||'')||p.originalCompactRowSha256!==sha(stable(slotRow)))errors.push('HOLD_ORIGINAL_SLOT_ROW_MISMATCH');
  const sr=p.sourceRef;
  if(!sr||sr.path!=='archive/exams/'+d.sourceArchiveFile||!COMMIT.test(sr.commit||'')||!COMMIT.test(sr.gitBlobSha1||'')||
     !SHA.test(sr.sha256||'')||sr.gitBlobSha1!==d.sourceGitBlobSha||sr.gitBlobSha1!==h.sourceGitBlobSha)
    errors.push('HOLD_SOURCE_REFERENCE_MISMATCH');
  else try {
    const current=readCurrent(sr.path),immutable=git(root,['show',sr.commit+':'+sr.path]);
    if(blob(current)!==sr.gitBlobSha1||sha(current)!==sr.sha256||immutable===null||blob(immutable)!==sr.gitBlobSha1||sha(immutable)!==sr.sha256)
      errors.push('HOLD_SOURCE_BYTES_MISMATCH');
  } catch {errors.push('HOLD_SOURCE_UNAVAILABLE');}
  if(stable(p.supersessionEvidence)!==stable(h.supersessionEvidence)||
     sup.schemaVersion!=='archive-m3s2-four-slot-renderer-supersession-v1'||sup.status!=='ONE_UID_WITHHELD_PENDING_EXACT_SOURCE_CORRECTION'||
     sup.questionUid!==id.questionUid||sup.sourceOrdinal!==cur.ordinal||sup.sourceArchiveFile!==d.sourceArchiveFile||
     sup.operationalHold?.heldUidCount!==1||stable(sup.operationalHold?.omittedOrdinals)!==stable([it.ordinal])||
     stable(p.revokedEvidence)!==stable(sup.revokedEvidence)||sup.revokedEvidence?.reviewStatus!=='PASS_SCOPED_RENDERER_CONTINUITY')
    errors.push('HOLD_SUPERSESSION_MISMATCH');
  const asset=p.incorrectRenderer;
  if(!asset||asset.role!=='solutionImage'||!/^archive\/assets\/images\/.+\.svg$/.test(asset.path||'')||
     !SHA.test(asset.sha256||'')||!assetRefs(cur.q).includes(asset.path)||
     ('archive/'+String(cur.q.solutionImage||'').replace(/^archive\//,''))!==asset.path)
    errors.push('HOLD_RENDERER_REFERENCE_MISMATCH');
  else try {
    const current=readCurrent(asset.path),immutable=git(root,['show',sr.commit+':'+asset.path]);
    if(sha(current)!==asset.sha256||immutable===null||sha(immutable)!==asset.sha256)errors.push('HOLD_RENDERER_BYTES_MISMATCH');
  }catch {errors.push('HOLD_RENDERER_UNAVAILABLE');}
  return errors;
}

// This is a continuation of an immutable negative decision, not a new review.
// The old hold and incorrect renderer stay historical; only the exact published
// correction can supply the current source/renderer tuple. There is no general
// source-change fallback and no route from this contract to a registered row.
function validatePublishedCorrection(root,d,it,id,cur,hp,readCurrent=rel=>fs.readFileSync(hp.safe(root,rel))) {
  const {safe,sha,blob,stable,payloadHash,identityHash,git,assetRefs,loadBank}=hp;
  const h=it.registrationHold, refs=d.evidence?.nativeHoldReview;
  const fail=message=>{throw Error('HOLD_CORRECTION_'+message);};
  const same=(a,b)=>stable(a)===stable(b);
  const keys=(o,allowed)=>o&&typeof o==='object'&&!Array.isArray(o)&&same(Object.keys(o).sort(),[...allowed].sort());
  function immutable(ref,pattern,local=false) {
    if(!ref||!pattern.test(ref.path||'')||!COMMIT.test(ref.commit||'')||!SHA.test(ref.sha256||''))fail('REFERENCE_INVALID');
    const raw=git(root,['show',ref.commit+':'+ref.path]);
    if(raw===null||sha(raw)!==ref.sha256||(own(ref,'gitBlobSha1')&&(!COMMIT.test(ref.gitBlobSha1)||blob(raw)!==ref.gitBlobSha1)))fail('IMMUTABLE_BYTES_MISMATCH');
    if(local&&sha(readCurrent(ref.path))!==ref.sha256)fail('LOCAL_BYTES_MISMATCH');
    return raw;
  }
  const tuple=ref=>({path:ref?.path,gitBlobSha1:ref?.gitBlobSha1,sha256:ref?.sha256});
  const plainRef=ref=>keys(ref,['commit','path','sha256']);
  try {
    if(!/^original\/middle\/m3\/2(?:mid|final)\//.test(d.sourceArchiveFile)||d.items.filter(x=>x.registrationHold?.reason===REASON).length!==1)fail('ONE_M3_UID_REQUIRED');
    if(!plainRef(h.reviewEvidence)||!plainRef(h.independentEvidence)||!same(h.reviewEvidence,refs?.rendererContinuity)||!same(h.independentEvidence,refs?.correctiveReview))fail('CARRIER_REFERENCE_REQUIRED');
    const p=JSON.parse(immutable(h.reviewEvidence,REF,true));
    const fields=['schemaVersion','scope','reason','decision','questionUid','sourceOrdinal','sourceQuestionNo','ordinal','sourceArchiveFile','fingerprintContract','studentPayloadSha256','sourceFingerprint','priorCompactRef','correctiveReviewRef','sourceRef','correctedRenderer','sourceQuestionCount','unselectedQuestionsUnchanged','changedSourceFields','newSemanticApprovals','newDifficultyApprovals','newReviewPassCount','sourceWrites','slotChanges','registryWrites'];
    if(!keys(p,fields)||p.schemaVersion!==CONTINUITY_SCHEMA||p.scope!=='EXACT_PUBLISHED_RENDERER_CORRECTION_PRESERVE_HOLD'||p.reason!==REASON||p.decision!=='WITHHOLD_REGISTRATION'||
       ['newSemanticApprovals','newDifficultyApprovals','newReviewPassCount','sourceWrites','slotChanges','registryWrites'].some(k=>p[k]!==0))fail('NEGATIVE_DECISION_REQUIRED');
    if(p.questionUid!==id.questionUid||p.sourceOrdinal!==cur.ordinal||p.sourceQuestionNo!==h.sourceQuestionNo||p.ordinal!==it.ordinal||p.sourceArchiveFile!==d.sourceArchiveFile)fail('IDENTITY_MISMATCH');
    if(p.fingerprintContract!=='4slot-student-payload-v1'||p.studentPayloadSha256!==payloadHash(cur.q)||p.studentPayloadSha256!==h.studentPayloadSha256||p.sourceFingerprint!==identityHash(cur.q)||p.sourceFingerprint!==h.sourceFingerprint)fail('CURRENT_FINGERPRINT_MISMATCH');
    const compactPath='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json');
    if(!keys(p.priorCompactRef,['commit','path','gitBlobSha1','sha256'])||p.priorCompactRef.path!==compactPath)fail('PRIOR_COMPACT_REFERENCE_INVALID');
    const prior=JSON.parse(immutable(p.priorCompactRef,/^archive\/data\/item-4slot\/.+\.4slot\.json$/));
    const matches=prior.items?.filter(x=>x.ordinal===it.ordinal)||[], old=matches[0], oldHold=old?.registrationHold;
    if(matches.length!==1||oldHold?.schemaVersion!=='4slot-native-review-hold-v1'||oldHold.reason!==REASON||own(oldHold,'reviewEvidence')||own(oldHold,'independentEvidence')||!same(h.evidence,oldHold.evidence)||!same(h.supersessionEvidence,oldHold.supersessionEvidence))fail('ORIGINAL_HOLD_REQUIRED');
    const oldProof=JSON.parse(immutable(oldHold.evidence,REF,true)),sup=JSON.parse(immutable(oldHold.supersessionEvidence,REF,true));
    if(!same(p.correctiveReviewRef,h.independentEvidence)||!same(h.evidence,prior.evidence?.nativeHoldReview?.rendererCorrection))fail('INDEPENDENT_REFERENCE_MISMATCH');
    const review=JSON.parse(immutable(p.correctiveReviewRef,CORRECTION_REF,true));
    if(p.correctiveReviewRef.sha256!==oldProof.correctionOwnerEvidence?.sha256||p.correctiveReviewRef.sha256!==sup.independentCorrectionReview?.sha256||
       review.schemaVersion!=='archive-narrow-solution-renderer-correction-independent-review-v1'||review.decision!=='APPROVE_EXACT_RENDERER_CORRECTION_AND_ALT_ONLY'||
       review.questionUid!==id.questionUid||review.sourceOrdinal!==cur.ordinal||review.metadataApprovalsAdded!==0||review.difficultyJudgmentsAdded!==0||review.fullMathematicalQa!==false||review.newReviewPassCount!==0||review.sourceWrites!==0||review.requestWrites!==0)fail('ORIGINAL_INDEPENDENT_AUTHORITY_MISMATCH');
    const allowed=['solutionImage','solutionImageAlt'];
    if(!same(p.changedSourceFields,allowed)||!same(review.changedSourceFields,allowed)||!same(sup.proposedCorrection?.changedSourceFields,allowed))fail('EXACT_TWO_FIELDS_REQUIRED');
    const sourcePath='archive/exams/'+d.sourceArchiveFile;
    if(!keys(p.sourceRef,['commit','path','gitBlobSha1','sha256'])||p.sourceRef.path!==sourcePath||!same(tuple(p.sourceRef),tuple(review.proposedSourceRef))||p.sourceRef.gitBlobSha1!==d.sourceGitBlobSha||p.sourceRef.gitBlobSha1!==h.sourceGitBlobSha||
       sup.proposedCorrection?.sourcePath!==sourcePath||sup.proposedCorrection?.sourceBlobSha1!==p.sourceRef.gitBlobSha1||sup.proposedCorrection?.sourceSha256!==p.sourceRef.sha256)fail('CURRENT_SOURCE_REFERENCE_MISMATCH');
    const currentRaw=immutable(p.sourceRef,/^archive\/exams\/original\/middle\/m3\/2(?:mid|final)\/.+\.js$/,true);
    if(!same(tuple(review.beforeSourceRef),tuple(oldProof.sourceRef)))fail('ORIGINAL_SOURCE_REFERENCE_MISMATCH');
    const oldRaw=immutable(oldProof.sourceRef,/^archive\/exams\/original\/middle\/m3\/2(?:mid|final)\/.+\.js$/);
    immutable(review.beforeSourceRef,/^archive\/exams\/original\/middle\/m3\/2(?:mid|final)\/.+\.js$/);
    const before=loadBank(oldRaw),after=loadBank(currentRaw),n=cur.ordinal-1;
    if(!Number.isSafeInteger(p.sourceQuestionCount)||p.sourceQuestionCount<1||before.length!==p.sourceQuestionCount||after.length!==before.length||prior.items.length!==d.items.length||p.unselectedQuestionsUnchanged!==before.length-1||review.sourceQuestionCount!==before.length||review.unselectedQuestionsUnchanged!==before.length-1||n<0||n>=before.length||!same(after[n],cur.q))fail('WHOLE_SOURCE_DENOMINATOR_MISMATCH');
    if(sha(stable(before[n]))!==review.beforeQuestionStableSha256||sha(stable(after[n]))!==review.afterQuestionStableSha256)fail('REVIEWED_WHOLE_QUESTION_MISMATCH');
    for(let i=0;i<before.length;i++) {
      if(i!==n) {if(!same(before[i],after[i]))fail('UNSELECTED_QUESTION_CHANGED');continue;}
      const changed=[...new Set([...Object.keys(before[i]),...Object.keys(after[i])])].filter(k=>own(before[i],k)!==own(after[i],k)||!same(before[i][k],after[i][k])).sort();
      if(!same(changed,allowed))fail('PROTECTED_QUESTION_FIELD_CHANGED');
    }
    const asset=p.correctedRenderer;
    if(!keys(asset,['role','commit','path','gitBlobSha1','sha256'])||asset.role!=='solutionImage'||asset.commit!==p.sourceRef.commit||!same(tuple(asset),tuple(review.assetAfter))||
       oldProof.correctionOwnerEvidence?.correctedAssetSha256!==asset.sha256||sup.proposedCorrection?.assetPath!==asset.path||sup.proposedCorrection?.assetBlobSha1!==asset.gitBlobSha1||sup.proposedCorrection?.assetSha256!==asset.sha256||
       !assetRefs(cur.q).includes(asset.path)||'archive/'+String(cur.q.solutionImage||'').replace(/^archive\//,'')!==asset.path)fail('CORRECTED_RENDERER_REFERENCE_MISMATCH');
    immutable(asset,/^archive\/assets\/images\/.+\.svg$/,true);
    if(review.assetBefore?.path!==oldProof.incorrectRenderer?.path||review.assetBefore?.sha256!==oldProof.incorrectRenderer?.sha256)fail('HISTORICAL_RENDERER_MISMATCH');
    const oldAsset=immutable(review.assetBefore,/^archive\/assets\/images\/.+\.svg$/);
    const legacyErrors=validateLegacy(root,prior,old,id,{q:before[n],ordinal:cur.ordinal},hp,rel=>{
      if(rel===sourcePath)return oldRaw;
      if(rel===oldProof.incorrectRenderer.path)return oldAsset;
      fail('UNEXPECTED_HISTORICAL_READ');
    });
    if(legacyErrors.length)fail('ORIGINAL_HOLD_INVALID:'+legacyErrors.join('|'));
    const expected=JSON.parse(JSON.stringify(prior)),eh=expected.items.find(x=>x.ordinal===it.ordinal).registrationHold;
    expected.sourceGitBlobSha=p.sourceRef.gitBlobSha1;
    expected.evidence.nativeHoldReview.rendererContinuity=h.reviewEvidence;
    expected.evidence.nativeHoldReview.correctiveReview=h.independentEvidence;
    Object.assign(eh,{sourceGitBlobSha:p.sourceRef.gitBlobSha1,studentPayloadSha256:p.studentPayloadSha256,sourceFingerprint:p.sourceFingerprint,reviewEvidence:h.reviewEvidence,independentEvidence:h.independentEvidence});
    if(!same(expected,d))fail('COMPACT_OR_HOLD_VALUE_CHANGED');
    return [];
  } catch(error) { return [error.message?.startsWith('HOLD_CORRECTION_')?error.message:'HOLD_CORRECTION_EVIDENCE_UNAVAILABLE']; }
}

function validate(root,d,it,id,cur,hp) {
  const h=it.registrationHold,refs=d.evidence?.nativeHoldReview;
  if(metadataHold.hasClaim(d,it))return metadataHold.validate(root,d,it,id,cur,hp,validatePublishedCorrection);
  if(own(h,'reviewEvidence')||own(h,'independentEvidence')||own(refs,'rendererContinuity')||own(refs,'correctiveReview'))return validatePublishedCorrection(root,d,it,id,cur,hp);
  return validateLegacy(root,d,it,id,cur,hp);
}
module.exports={validate,REASON,SCHEMA,CONTINUITY_SCHEMA,hasMetadataClaim:metadataHold.hasClaim};
