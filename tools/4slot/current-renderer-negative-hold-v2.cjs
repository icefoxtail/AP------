'use strict';
// Opt-in full-compact transport only. Every held UID remains inactive; no slot,
// mathematical approval, renderer correction, or release is created here.
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {compactItem} = require('./import-4slot.cjs');
const {buildLookup} = require('./validate-4slot.cjs');
const {sourceNumber, sourceIdentityNumber} = require('./exam-items.cjs');

const HOLD_SCHEMA = '4slot-current-renderer-negative-hold-v2';
const PROOF_SCHEMA = 'm3-s2-current-renderer-negative-hold-v2';
const REVIEW_SCHEMA = 'archive-m3s2-current-four-slot-renderer-negative-review-v2';
const CONTINUITY_SCHEMA = 'archive-m3s2-current-four-slot-vector-continuity-v1';
const REASON = 'SOURCE_RENDERER_CORRECTION_PENDING';
const REF = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const NEGATIVE_PATH = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/negative-independent-review\.json$/;
const NATIVE = /^(?:docs\/operations|archive-work)\/[A-Za-z0-9_가-힣./-]+\.json$/;
const SOURCE = /^archive\/exams\/original\/middle\/m3\/2(?:mid|final)\/.+\.js$/;
const COMPACT = /^archive\/data\/item-4slot\/original\/middle\/m3\/2(?:mid|final)\/.+\.4slot\.json$/;
const ASSET = /^archive\/assets\/.+\.(?:svg|png|jpe?g|gif|webp)$/i;
const SHA = /^[a-f0-9]{64}$/, GIT = /^[a-f0-9]{40}$/, UID = /^qid_v1_[a-f0-9]{64}$/;
const directFields = ['currentRendererNegativeEvidence', 'vectorContinuityEvidence', 'independentNegativeEvidence'];
const ref4 = ['commit', 'path', 'gitBlobSha1', 'sha256'];
const tuple = ['questionUid', 'sourceOrdinal', 'sourceQuestionNo', 'ordinal'];
const own = (o,k) => Object.hasOwn(o || {},k);
const has = d => (d.items || []).some(i => i.registrationHold?.schemaVersion === HOLD_SCHEMA);

function validateFile(root,d,hp) {
  const {safe,sha,blob,stable,payloadHash,identityHash,assetRefs,loadBank,dictionary,identity,studentFields} = hp;
  const fail = suffix => { throw Error('CURRENT_RENDERER_HOLD_V2_' + suffix); };
  const same = (a,b) => stable(a) === stable(b);
  const keys = (o,ks) => {
    if(!o || typeof o !== 'object' || Array.isArray(o) || !same(Object.keys(o).sort(),[...ks].sort())) fail('FIELDS');
  };
  const zero = (o,ks) => { if(ks.some(k => o[k] !== 0)) fail('NEGATIVE_ONLY'); };
  const plain = r => ({commit:r?.commit,path:r?.path,sha256:r?.sha256});
  const ordinals = a => Array.isArray(a) && a.every(n => Number.isSafeInteger(n) && n > 0) &&
    new Set(a).size === a.length && same(a,[...a].sort((x,y) => x-y));
  function gitBytes(commit,p) {
    try {
      return execFileSync('git',['-C',root,'show',commit+':'+p],
        {timeout:15000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
    } catch { fail('IMMUTABLE_UNAVAILABLE'); }
  }
  function immutable(ref,pattern,{local=false,fields=['commit','path','sha256']}={}) {
    keys(ref,fields);
    if(!GIT.test(ref.commit || '') || !SHA.test(ref.sha256 || '') || !pattern.test(ref.path || '')) fail('REFERENCE');
    safe(root,ref.path);
    const raw=gitBytes(ref.commit,ref.path);
    if(sha(raw)!==ref.sha256 || own(ref,'gitBlobSha1') && (!GIT.test(ref.gitBlobSha1 || '') || blob(raw)!==ref.gitBlobSha1)) fail('IMMUTABLE_BYTES');
    if(local) {
      let live;
      try { live=fs.readFileSync(safe(root,ref.path)); } catch { fail('LOCAL_UNAVAILABLE'); }
      if(sha(live)!==ref.sha256) fail('LOCAL_BYTES');
    }
    return raw;
  }
  function assets(rows,q,commit,local) {
    if(!Array.isArray(rows) || !same(rows.map(r => r.path).sort(),assetRefs(q))) fail('ASSET_COVERAGE');
    const seen=new Set();
    for(const r of rows) {
      if(seen.has(r.path) || r.commit!==commit || r.visuallyInspected!==true) fail('ASSET_SCOPE');
      seen.add(r.path);
      immutable(r,ASSET,{local,fields:[...ref4,'visuallyInspected']});
    }
  }
  function problemImageRefs(q) {
    const found=new Set(assetRefs(Object.fromEntries(['image','images','figureSvg','svg'].map(k => [k,q[k]]))));
    const strings=value => typeof value==='string' ? [value] : Array.isArray(value) ? value.flatMap(strings) :
      value && typeof value==='object' ? Object.values(value).flatMap(strings) : [];
    for(const text of ['content','question','choices'].flatMap(k => strings(q[k]))) {
      // A visible path in prose (or an HTML comment/data-src attribute) is not
      // an image renderer. Use actual img src references on the problem side.
      for(const tag of text.replace(/<!--[\s\S]*?-->/g,'').matchAll(/<img\b([^>]*)>/gi)) {
        const src=/(?:^|\s)src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag[1]);
        if(src) for(const p of assetRefs({image:src[1] ?? src[2] ?? src[3]})) found.add(p);
      }
    }
    return [...found];
  }
  function nativeRows(raw,source,count) {
    const n=JSON.parse(raw);
    if(n.schemaVersion!=='archive-meta-4slot-v0' || n.sourceArchiveFile!==source || !Array.isArray(n.items) || n.items.length!==count) fail('FULL_NATIVE_AUTHORITY');
    return n;
  }
  try {
    if(!/^original\/middle\/m3\/2(?:mid|final)\//.test(d.sourceArchiveFile || '') ||
       ['scope','expectedQuestionCount','selected','unsubmitted'].some(k => own(d,k))) fail('FULL_M3_SCOPE');
    const held=(d.items || []).filter(i => own(i,'registrationHold'));
    if(!held.length || held.some(i => i.registrationHold?.schemaVersion!==HOLD_SCHEMA)) fail('HELD_SCHEMA');
    const refs=d.evidence?.nativeHoldReview, first=held[0].registrationHold;
    keys(refs,['currentRendererNegative','vectorContinuity','independentNegative']);
    for(const it of held) {
      const h=it.registrationHold;
      keys(h,['schemaVersion','reason',...tuple,'sourceGitBlobSha','studentPayloadSha256','sourceFingerprint','wholeQuestionSha256',...directFields,'nextAction']);
      if(h.reason!==REASON || !UID.test(h.questionUid || '') || h.ordinal!==it.ordinal ||
         !same(h.currentRendererNegativeEvidence,refs.currentRendererNegative) ||
         !same(h.vectorContinuityEvidence,refs.vectorContinuity) ||
         !same(h.independentNegativeEvidence,refs.independentNegative)) fail('OPT_IN_BINDING');
    }
    const p=JSON.parse(immutable(first.currentRendererNegativeEvidence,REF,{local:true}));
    keys(p,['schemaVersion','scope','reason','decision','author','sourceArchiveFile','expectedQuestionCount','heldUidCount','heldItems','priorCompactRef','priorSourceRef','sourceRef','nativeFourSlotRef','originalFourSlotRef','methodAmendmentIndependentReviewRef','vectorContinuityRef','independentNegativeReviewRef','retainedOrdinals','unchangedOrdinals','newSemanticApprovals','newDifficultyApprovals','newMathQa','slotChanges','sourceWrites','assetWrites','nextAction']);
    if(p.schemaVersion!==PROOF_SCHEMA || p.scope!=='CURRENT_FULL_COMPACT_RENDERER_HOLDS' || p.reason!==REASON ||
       p.decision!=='WITHHOLD_REGISTRATION' || typeof p.author!=='string' || !p.author.trim() ||
       !Number.isSafeInteger(p.heldUidCount) || p.heldUidCount!==held.length || !Array.isArray(p.heldItems) || p.heldItems.length!==held.length ||
       typeof p.nextAction!=='string' || !p.nextAction.trim() || held.some(i => i.registrationHold.nextAction!==p.nextAction)) fail('CARRIER_DECISION');
    zero(p,['newSemanticApprovals','newDifficultyApprovals','newMathQa','slotChanges','sourceWrites','assetWrites']);
    for(const h of p.heldItems) keys(h,tuple);
    if(!same(p.heldItems,[...held].sort((a,b) => a.registrationHold.sourceOrdinal-b.registrationHold.sourceOrdinal)
       .map(i => Object.fromEntries(tuple.map(k => [k,i.registrationHold[k]])))) ||
       new Set(p.heldItems.map(h => h.questionUid)).size!==held.length ||
       new Set(p.heldItems.map(h => h.sourceOrdinal)).size!==held.length ||
       new Set(p.heldItems.map(h => h.ordinal)).size!==held.length) fail('HELD_IDENTITY');
    if(p.sourceArchiveFile!==d.sourceArchiveFile || !same(p.vectorContinuityRef,refs.vectorContinuity) ||
       !same(p.independentNegativeReviewRef,refs.independentNegative)) fail('CARRIER_SCOPE');
    const cp='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json'), sp='archive/exams/'+d.sourceArchiveFile;
    if(p.priorCompactRef?.path!==cp || p.priorSourceRef?.path!==sp || p.sourceRef?.path!==sp) fail('PATH_BINDING');
    const prior=JSON.parse(immutable(p.priorCompactRef,COMPACT,{fields:ref4}));
    const before=loadBank(immutable(p.priorSourceRef,SOURCE,{fields:ref4}));
    const bank=loadBank(immutable(p.sourceRef,SOURCE,{local:true,fields:ref4}));
    if(prior.schemaVersion!=='archive-meta-4slot-compact-v1' || prior.sourceArchiveFile!==d.sourceArchiveFile ||
       ['scope','expectedQuestionCount','selected','unsubmitted'].some(k => own(prior,k)) ||
       !Array.isArray(prior.items) || prior.items.some(i => own(i,'registrationHold')) || own(prior.evidence,'nativeHoldReview')) fail('PRIOR_FULL_COMPACT');
    if(prior.sourceGitBlobSha!==p.priorSourceRef.gitBlobSha1 || d.sourceGitBlobSha!==p.sourceRef.gitBlobSha1 ||
       held.some(i => i.registrationHold.sourceGitBlobSha!==d.sourceGitBlobSha) ||
       !Number.isSafeInteger(p.expectedQuestionCount) || p.expectedQuestionCount<2 ||
       bank.length!==p.expectedQuestionCount || before.length!==bank.length || prior.items.length!==bank.length || d.items.length!==bank.length) fail('WHOLE_DENOMINATOR');

    // The preserved top authority may already contain independently approved
    // method amendments. Read it and its original review; never revert its rows
    // to an unamended original or treat a source/hash rebind as a new approval.
    const nativeRef=plain(prior.evidence), originalRef=plain(prior.evidence.originalReview || prior.evidence);
    if(!same(p.nativeFourSlotRef,nativeRef) || !same(p.originalFourSlotRef,originalRef)) fail('ORIGINAL_AUTHORITY_REFERENCE');
    const native=nativeRows(immutable(nativeRef,NATIVE),d.sourceArchiveFile,bank.length);
    const original=nativeRows(immutable(originalRef,REF),d.sourceArchiveFile,bank.length);
    const continuity=prior.evidence.sourceContinuity ? JSON.parse(immutable(plain(prior.evidence.sourceContinuity),NATIVE)) : null;
    const amendmentRef=prior.evidence.methodAmendmentIndependentReview;
    let amendment=null;
    if(amendmentRef) {
      if(amendmentRef.scope!=='12_CURRENT_METHOD_MAPPINGS_ONLY' || amendmentRef.decision!=='ACCEPTED_CURRENT_METHOD_ONLY' ||
         !same(p.methodAmendmentIndependentReviewRef,{commit:p.priorCompactRef.commit,path:amendmentRef.path,sha256:amendmentRef.sha256})) fail('METHOD_AUTHORITY_REFERENCE');
      amendment=JSON.parse(immutable(p.methodAmendmentIndependentReviewRef,REF));
      keys(amendment,['schemaVersion','reviewer','sourceCommit','amendmentSha256','scope','reason','rows']);
      if(amendment.schemaVersion!=='independent-scoped-method-review-v1' || typeof amendment.reviewer!=='string' || !amendment.reviewer.trim() ||
         amendment.reviewer===p.author || amendment.reviewer===original.judgedBy?.agent ||
         !GIT.test(amendment.sourceCommit || '') || !SHA.test(amendment.amendmentSha256 || '') ||
         amendment.scope!=='12 changed method mappings only; existing mathematical solution approvals reused; no new full semantic approval' ||
         typeof amendment.reason!=='string' || !amendment.reason.trim() || !Array.isArray(amendment.rows)) fail('METHOD_AUTHORITY');
      // amendmentSha256 is a legacy aggregate identifier whose raw preimage is
      // unavailable. It is NOT used as approval. The exact selected independent
      // rows, old/new terms, immutable source and solution/quote bytes below are.
      for(const r of amendment.rows) {
        keys(r,['key','questionUid','sourcePath','sourceSha256','solutionSha256','terms','exactQuotesVerified','decision']);
        if(!UID.test(r.questionUid || '') || !SOURCE.test(r.sourcePath || '') || !SHA.test(r.sourceSha256 || '') ||
           !SHA.test(r.solutionSha256 || '') || !Array.isArray(r.terms) || !r.terms.length ||
           r.terms.some(t => typeof t!=='string' || !t.trim()) || r.exactQuotesVerified!==true || r.decision!=='ACCEPTED_CURRENT_METHOD_ONLY') fail('METHOD_REVIEW_ROW');
      }
      if(!continuity || continuity.schemaVersion!=='archive-m3s2-4slot-current-source-continuity-v1' ||
         continuity.sourceCommit!==amendment.sourceCommit || continuity.originalReviewCommit!==originalRef.commit ||
         ['sourceMutation','semanticApprovalMutation','difficultyApprovalMutation'].some(k => continuity[k]!==0) ||
         !Array.isArray(continuity.methodAmendments) || continuity.methodAmendmentCount!==continuity.methodAmendments.length) fail('METHOD_CONTINUITY');
      const ces=(continuity.exams || []).filter(e => e.sourceArchiveFile===d.sourceArchiveFile);
      if(ces.length!==1 || ces[0].sourcePath!==sp || ces[0].sourceGitBlobSha!==prior.sourceGitBlobSha || ces[0].itemCount!==bank.length ||
         ces[0].reviewPath!==nativeRef.path || ces[0].reviewSha256!==nativeRef.sha256 ||
         ces[0].nativeReviewPath!==originalRef.path || ces[0].nativeReviewSha256!==originalRef.sha256) fail('METHOD_CONTINUITY_EXAM');
      const reb=native.sourceRebinding;
      if(native.sourceGitBlobSha!==prior.sourceGitBlobSha || native.dictionaryVersion!==prior.dictionaryVersion ||
         reb?.reviewCommit!==originalRef.commit || reb.nativePath!==originalRef.path || reb.nativeSha256!==originalRef.sha256 ||
         reb.sourceCommit!==amendment.sourceCommit || reb.sourceBlobSha1!==prior.sourceGitBlobSha ||
         reb.scope!=='REUSE_COMPLETED_REVIEW_AND_SCOPED_CURRENT_SOURCE_CONTINUITY' || reb.fullExamReReview!==false || reb.semanticApprovalGranted!==false) fail('METHOD_NATIVE_BINDING');
      // This is a fresh immutable read, including the exact Git blob; no receipt
      // or approval result is cached or reconstructed from current payloads.
      immutable({...p.priorSourceRef,commit:amendment.sourceCommit},SOURCE,{fields:ref4});
    } else if(p.methodAmendmentIndependentReviewRef!==null) fail('UNEXPECTED_METHOD_AUTHORITY');

    const review=JSON.parse(immutable(p.vectorContinuityRef,REF,{local:true}));
    keys(review,['schemaVersion','scope','reviewer','reviewedAtUtc','newFourSlotValues','newSemanticApprovals','newDifficultyApprovals','newMathQa','sourceWrites','assetWrites','actualBrowser','dictionaryRef','exams']);
    if(review.schemaVersion!==CONTINUITY_SCHEMA || review.scope!=='KEEP_EXACT_EXISTING_FOUR_SLOT_VECTOR_ON_CURRENT_SOURCE' ||
       review.reviewer!==p.author || review.reviewer===prior.reviewedBy?.agent || !Number.isFinite(Date.parse(review.reviewedAtUtc)) || review.actualBrowser!=='NOT_RUN') fail('CONTINUITY_AUTHORITY');
    zero(review,['newFourSlotValues','newSemanticApprovals','newDifficultyApprovals','newMathQa','sourceWrites','assetWrites']);
    const dr=review.dictionaryRef;
    immutable(dr,/^docs\/architecture\/4slot\/term-dictionary-v[0-9]+(?:\.[0-9]+)*\.json$/,{local:true,fields:[...ref4,'version']});
    if(dr.version!==prior.dictionaryVersion || dr.version!==d.dictionaryVersion || dr.path!==dictionary?.path || dr.sha256!==dictionary?.sha256) fail('DICTIONARY');
    const exams=(review.exams || []).filter(e => e.priorCompactRef?.path===cp);
    if(exams.length!==1) fail('CONTINUITY_EXAM');
    const e=exams[0], heldOrdinals=held.map(i => i.ordinal).sort((a,b) => a-b);
    keys(e,['examId','priorCompactRef','priorSourceRef','sourceRef','sourceQuestionCount','originalFourSlotRef','sourceContinuityRef','rows','withheldOrdinals']);
    if(!same(e.priorCompactRef,p.priorCompactRef) || !same(e.priorSourceRef,p.priorSourceRef) || !same(e.sourceRef,p.sourceRef) ||
       e.sourceQuestionCount!==bank.length || !same(e.originalFourSlotRef,originalRef) || !same(e.sourceContinuityRef,prior.evidence.sourceContinuity) ||
       !same(e.withheldOrdinals,heldOrdinals)) fail('CONTINUITY_BINDING');
    if(!Array.isArray(e.rows) || !ordinals(p.retainedOrdinals) || !ordinals(p.unchangedOrdinals) ||
       !same(p.retainedOrdinals,e.rows.map(r => r.ordinal).sort((a,b) => a-b))) fail('RETAINED_SCOPE');

    const negative=JSON.parse(immutable(p.independentNegativeReviewRef,NEGATIVE_PATH,{local:true}));
    keys(negative,['schemaVersion','scope','decision','reviewer','transportAuthor','reviewedAtUtc','heldUidCount','newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites','rows']);
    if(negative.schemaVersion!==REVIEW_SCHEMA || negative.scope!=='EXISTING_FOUR_SLOT_VECTOR_CURRENT_RENDERER_NEGATIVE_ONLY' ||
       negative.decision!=='WITHHOLD_CURRENT_RENDERER' || typeof negative.reviewer!=='string' || !negative.reviewer.trim() ||
       negative.reviewer===p.author || negative.transportAuthor!==p.author || !Number.isFinite(Date.parse(negative.reviewedAtUtc)) ||
       !Array.isArray(negative.rows) || negative.heldUidCount!==negative.rows.length || new Set(negative.rows.map(r => r.questionUid)).size!==negative.rows.length) fail('NEGATIVE_AUTHORITY');
    zero(negative,['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites']);
    const negatives=negative.rows.filter(r => r.sourceArchiveFile===d.sourceArchiveFile);
    if(negatives.length!==held.length || !same(negatives.map(r => r.questionUid).sort(),held.map(i => i.registrationHold.questionUid).sort())) fail('NEGATIVE_UID_SET');
    for(const it of held) {
      const h=it.registrationHold, n=negatives.find(r => r.questionUid===h.questionUid);
      keys(n,['questionUid','sourceArchiveFile','sourceOrdinal','sourceQuestionNo','ordinal','sourceRef','priorCompactRef','compactItemSha256','studentPayloadSha256','sourceFingerprint','wholeQuestionSha256','incorrectRenderer','currentAssets','inspection','classification','decision','observed']);
      if(n.decision!=='WITHHOLD_CURRENT_RENDERER' || !['CURRENT_RENDERER_AMBIGUITY','CURRENT_RENDERER_TEXT_MISMATCH','CURRENT_RENDERER_RELATION_MISMATCH'].includes(n.classification) ||
         typeof n.observed!=='string' || !n.observed.trim() || !same(n.sourceRef,p.sourceRef) || !same(n.priorCompactRef,p.priorCompactRef) || tuple.some(k => n[k]!==h[k])) fail('NEGATIVE_SCOPE');
      keys(n.inspection,['stemRead','solutionRead','existingFourSlotsRead','actualRendererRead','browser']);
      if(['stemRead','solutionRead','existingFourSlotsRead','actualRendererRead'].some(k => n.inspection[k]!==true) || n.inspection.browser!=='NOT_RUN') fail('ACTUAL_OBSERVATION');
      const q=bank[h.sourceOrdinal-1], item=prior.items.find(i => i.ordinal===h.ordinal);
      if(!q || sourceNumber(q)!==h.ordinal || sourceIdentityNumber(q)!==h.sourceQuestionNo || !item || n.compactItemSha256!==sha(stable(item)) ||
         n.studentPayloadSha256!==payloadHash(q) || n.sourceFingerprint!==identityHash(q) || n.wholeQuestionSha256!==sha(stable(q)) ||
         ['studentPayloadSha256','sourceFingerprint','wholeQuestionSha256'].some(k => h[k]!==n[k])) fail('HELD_CURRENT_VALUES');
      const wrong=n.incorrectRenderer;
      keys(wrong,['role',...ref4,'visuallyInspected']);
      // A questionImage must occur on the problem side. A solution SVG appearing
      // only in solution/answer fields cannot be relabelled as a question image.
      const problemAssets=problemImageRefs(q);
      const roleMatches=wrong.role==='questionImage' ? problemAssets.includes(wrong.path) :
        wrong.role==='solutionImage' && wrong.path==='archive/'+String(q.solutionImage || '').replace(/^archive\//,'');
      if(!roleMatches || wrong.visuallyInspected!==true || wrong.commit!==p.sourceRef.commit || !wrong.path.endsWith('.svg')) fail('INCORRECT_RENDERER');
      immutable(wrong,ASSET,{local:true,fields:['role',...ref4,'visuallyInspected']});
      assets(n.currentAssets,q,p.sourceRef.commit,true);
    }

    const lut=buildLookup({terms:[...dictionary.terms.values()]});
    for(const t of dictionary.terms.values()) lut.set('#'+t.id,t);
    const seen=new Set(), unchanged=[], methodDeltaUids=[];
    for(let i=0;i<bank.length;i++) {
      const q=bank[i], old=before[i], ordinal=sourceNumber(q), item=prior.items.find(x => x.ordinal===ordinal);
      const ids=(identity?.records || []).filter(x => x.sourceArchiveFile===d.sourceArchiveFile && x.sourceOrdinal===i+1), id=ids[0];
      if(!item || sourceNumber(old)!==ordinal || seen.has(ordinal) || ids.length!==1 || !UID.test(id?.questionUid || '') ||
         id.status!=null && id.status!=='VERIFIED' || (identity.records || []).filter(x => x.questionUid===id.questionUid).length!==1 ||
         id.sourceQuestionNo!=null && String(id.sourceQuestionNo)!==sourceIdentityNumber(q) || q.questionUid && q.questionUid!==id.questionUid) fail('FULL_IDENTITY');
      seen.add(ordinal);
      const matches=n => n.items.filter(x => Number(x.sourceOrdinal)===i+1 && x.questionUid===id.questionUid);
      const ns=matches(native), os=matches(original);
      if(ns.length!==1 || os.length!==1) fail('FULL_NATIVE_IDENTITY');
      const projection=n => compactItem(n,lut,new Map([[String(i+1),{ordinal}]]));
      const approved=projection(ns[0]), initial=projection(os[0]);
      if(!same(approved,item)) fail('CURRENT_NATIVE_VECTOR_CHANGED');
      const delta=[...new Set([...Object.keys(initial),...Object.keys(approved)])].filter(k => !same(initial[k],approved[k]));
      const initialTerms=(os[0].slots?.method || []).map(t => t.term), approvedTerms=(ns[0].slots?.method || []).map(t => t.term);
      if(delta.length || !same(initialTerms,approvedTerms)) {
        if(!amendment || delta.some(k => !['method','candidates'].includes(k))) fail('UNAPPROVED_ORIGINAL_VECTOR_CHANGE');
        const ms=amendment.rows.filter(r => r.questionUid===id.questionUid && r.sourcePath===sp);
        const cs=continuity.methodAmendments.filter(r => r.questionUid===id.questionUid && r.sourceOrdinal===i+1 && r.examId===e.examId);
        const m=ms[0], c=cs[0], solution=old.solution;
        if(ms.length!==1 || cs.length!==1 || m.key!==e.examId+'#'+(i+1) || m.sourceSha256!==p.priorSourceRef.sha256 ||
           typeof solution!=='string' || m.solutionSha256!==sha(solution) || c.afterSolutionSha256!==sha(solution) ||
           !same(c.before,initialTerms) || !same(c.after,approvedTerms) || !same(m.terms,approvedTerms)) fail('METHOD_ROW_BINDING');
        // Direct replay of the approved solution evidence, including each exact
        // quote, rather than a new method judgement or an aggregate-hash waiver.
        if((ns[0].slots.method || []).some(t => t.src!=='solution' || typeof t.quote!=='string' || !t.quote.trim() ||
           !solution.includes(t.quote) || !['EXPLICIT','IMPLIED'].includes(t.evidenceType) || typeof t.justification!=='string' || !t.justification.trim())) fail('METHOD_QUOTE_BYTES');
        methodDeltaUids.push(id.questionUid);
      }
      if(heldOrdinals.includes(ordinal)) {
        const h=held.find(x => x.ordinal===ordinal).registrationHold;
        if(h.questionUid!==id.questionUid || h.sourceOrdinal!==i+1) fail('HELD_IDENTITY');
        if(e.rows.some(r => r.ordinal===ordinal)) fail('PARTITION');
        continue;
      }
      const rr=e.rows.filter(r => r.ordinal===ordinal);
      if(rr.length) {
        if(rr.length!==1) fail('RETAINED_DUPLICATE');
        const r=rr[0];
        keys(r,['questionUid','sourceOrdinal','sourceQuestionNo','ordinal','decision','compactItemSha256','priorWholeQuestionSha256','currentWholeQuestionSha256','changedFields','changedStudentFields','stemRead','solutionRead','allFourSlotsRead','actualVisualInspection','priorAssets','currentAssets','captureSha256','renderers','observed']);
        if(r.questionUid!==id.questionUid || r.sourceOrdinal!==i+1 || r.sourceQuestionNo!==sourceIdentityNumber(q) || r.decision!=='RETAIN_EXISTING_FOUR_SLOTS' ||
           r.compactItemSha256!==sha(stable(item)) || r.priorWholeQuestionSha256!==sha(stable(old)) || r.currentWholeQuestionSha256!==sha(stable(q)) ||
           ['stemRead','solutionRead','allFourSlotsRead','actualVisualInspection'].some(k => r[k]!==true) || !SHA.test(r.captureSha256 || '') ||
           !Array.isArray(r.renderers) || !r.renderers.length || r.renderers.some(x => typeof x!=='string' || !x.trim()) ||
           typeof r.observed!=='string' || !r.observed.trim()) fail('RETAINED_CURRENT_REVIEW');
        const changed=[...new Set([...Object.keys(old),...Object.keys(q)])].filter(k => own(old,k)!==own(q,k) || !same(old[k],q[k])).sort();
        if(!Array.isArray(r.changedFields) || !Array.isArray(r.changedStudentFields) ||
           !same([...r.changedFields].sort(),changed) || !same([...r.changedStudentFields].sort(),changed.filter(k => studentFields.includes(k)))) fail('RETAINED_FIELD_COVERAGE');
        assets(r.priorAssets,old,p.priorSourceRef.commit,false);
        assets(r.currentAssets,q,p.sourceRef.commit,true);
      } else {
        unchanged.push(ordinal);
        if(!same(old,q) || payloadHash(old)!==payloadHash(q) || !same(assetRefs(old),assetRefs(q))) fail('UNREVIEWED_QUESTION_CHANGE');
        for(const ap of assetRefs(q)) {
          let live;
          try { live=fs.readFileSync(safe(root,ap)); } catch { fail('UNCHANGED_ASSET_UNAVAILABLE'); }
          if(sha(gitBytes(p.priorSourceRef.commit,ap))!==sha(live)) fail('UNREVIEWED_ASSET_CHANGE');
        }
      }
    }
    if(amendment) {
      const required=amendment.rows.filter(r => r.sourcePath===sp).map(r => r.questionUid).sort();
      const declared=continuity.methodAmendments.filter(r => r.examId===e.examId).map(r => r.questionUid).sort();
      if(!same([...methodDeltaUids].sort(),required) || !same(required,declared)) fail('METHOD_AMENDMENT_COVERAGE');
    }
    if(!same(unchanged.sort((a,b) => a-b),p.unchangedOrdinals) || e.rows.length+p.unchangedOrdinals.length+held.length!==bank.length) fail('PARTITION');
    const expected=JSON.parse(JSON.stringify(prior));
    expected.sourceGitBlobSha=p.sourceRef.gitBlobSha1;
    expected.evidence.nativeHoldReview=refs;
    for(const it of held) expected.items.find(i => i.ordinal===it.ordinal).registrationHold=it.registrationHold;
    if(!same(expected,d)) fail('ORIGINAL_COMPACT_CHANGED');
    return [];
  } catch(error) {
    return [error.message?.startsWith('CURRENT_RENDERER_HOLD_V2_') ? error.message : 'CURRENT_RENDERER_HOLD_V2_EVIDENCE_UNAVAILABLE'];
  }
}

module.exports={HOLD_SCHEMA,PROOF_SCHEMA,REVIEW_SCHEMA,CONTINUITY_SCHEMA,REASON,has,validateFile};
