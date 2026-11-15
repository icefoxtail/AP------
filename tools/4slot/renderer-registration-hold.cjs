// A negative registration decision for one current M3-S2 solution renderer.
// This contract never approves a row, waives ordinary slots, or repairs a source.
'use strict';
const fs = require('node:fs');
const REASON = 'SOURCE_RENDERER_CORRECTION_PENDING';
const SCHEMA = 'm3-s2-renderer-correction-registration-hold-v1';
const REF = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const SHA = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;

function validate(root,d,it,id,cur,hp) {
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
    const current=fs.readFileSync(safe(root,sr.path)),immutable=git(root,['show',sr.commit+':'+sr.path]);
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
    const current=fs.readFileSync(safe(root,asset.path)),immutable=git(root,['show',sr.commit+':'+asset.path]);
    if(sha(current)!==asset.sha256||immutable===null||sha(immutable)!==asset.sha256)errors.push('HOLD_RENDERER_BYTES_MISMATCH');
  }catch {errors.push('HOLD_RENDERER_UNAVAILABLE');}
  return errors;
}
module.exports={validate,REASON,SCHEMA};
