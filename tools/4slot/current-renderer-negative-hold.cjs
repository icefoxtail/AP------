'use strict';
// Exact negative intake for an existing full M3-S2 vector. This does not approve
// the held item, create slots, repair a renderer, or replace private partial intake.
const fs=require('node:fs'),{execFileSync}=require('node:child_process');
const {compactItem}=require('./import-4slot.cjs');
const {buildLookup}=require('./validate-4slot.cjs');
const {sourceNumber,sourceIdentityNumber}=require('./exam-items.cjs');
const v2=require('./current-renderer-negative-hold-v2.cjs');
const HOLD_SCHEMA='4slot-current-renderer-negative-hold-v1';
const PROOF_SCHEMA='m3-s2-current-renderer-negative-hold-v1';
const REVIEW_SCHEMA='archive-m3s2-current-four-slot-renderer-negative-review-v1';
const CONTINUITY_SCHEMA='archive-m3s2-current-four-slot-vector-continuity-v1';
const HOLD_SCHEMAS=Object.freeze([HOLD_SCHEMA,v2.HOLD_SCHEMA]);
const REASON='SOURCE_RENDERER_CORRECTION_PENDING';
const REF=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const NEGATIVE_PATH=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/negative-independent-review\.json$/;
const SOURCE=/^archive\/exams\/original\/middle\/m3\/2(?:mid|final)\/.+\.js$/;
const COMPACT=/^archive\/data\/item-4slot\/original\/middle\/m3\/2(?:mid|final)\/.+\.4slot\.json$/;
const ASSET=/^archive\/assets\/.+\.(?:svg|png|jpe?g|gif|webp)$/i;
const SHA=/^[a-f0-9]{64}$/,GIT=/^[a-f0-9]{40}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const own=(o,k)=>Object.hasOwn(o||{},k);
const directFields=['currentRendererNegativeEvidence','vectorContinuityEvidence','independentNegativeEvidence'];
function has(d){return (d.items||[]).some(i=>HOLD_SCHEMAS.includes(i.registrationHold?.schemaVersion)||directFields.some(k=>own(i.registrationHold,k)))||['currentRendererNegative','vectorContinuity','independentNegative'].some(k=>own(d.evidence?.nativeHoldReview,k));}

// Immutable ancestry identifies a withholding obligation only. It never grants
// a slot or a positive review. Discover once per builder pass, including evidence
// removed by a later commit, so deleting all working-tree markers cannot release it.
function createObligationReader(root,{safe,sha,blob,stable}){
 let loaded=false,entries=[],failure=null;
 const git=args=>execFileSync('git',['-C',root,'-c','core.quotepath=false',...args],{timeout:30000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
 function load(){
  if(loaded)return;loaded=true;
  try{
   const head=git(['rev-parse','--verify','HEAD']).toString().trim();if(!GIT.test(head))throw Error('HEAD');
   const history=git(['log','--full-history','--format=%H',head,'--',':(glob)docs/operations/**/negative-independent-review.json']).toString().trim().split(/\s+/).filter(Boolean);
   const seen=new Set();
   for(const commit of new Set([head,...history])){
    if(!GIT.test(commit))throw Error('HISTORY');
    const paths=git(['ls-tree','-r','-z','--name-only',commit,'--','docs/operations']).toString().split('\0').filter(p=>NEGATIVE_PATH.test(p));
    for(const p of paths){safe(root,p);const raw=git(['show',commit+':'+p]),hash=sha(raw),key=p+'#'+hash;if(seen.has(key))continue;seen.add(key);
     const review=JSON.parse(raw);if(![REVIEW_SCHEMA,v2.REVIEW_SCHEMA].includes(review.schemaVersion))continue;
     if(review.scope!=='EXISTING_FOUR_SLOT_VECTOR_CURRENT_RENDERER_NEGATIVE_ONLY'||review.decision!=='WITHHOLD_CURRENT_RENDERER'||!review.reviewer||!review.transportAuthor||review.reviewer===review.transportAuthor||!Array.isArray(review.rows)||review.rows.length!==review.heldUidCount||['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites'].some(k=>review[k]!==0))throw Error('NEGATIVE_INVENTORY');
     for(const row of review.rows){
      if(!UID.test(row.questionUid||'')||!/^original\/middle\/m3\/2(?:mid|final)\/.+\.js$/.test(row.sourceArchiveFile||'')||row.sourceRef?.path!=='archive/exams/'+row.sourceArchiveFile||!GIT.test(row.sourceRef?.commit||'')||!GIT.test(row.sourceRef?.gitBlobSha1||'')||!SHA.test(row.sourceRef?.sha256||'')||row.decision!=='WITHHOLD_CURRENT_RENDERER')throw Error('NEGATIVE_INVENTORY_ROW');
      // Ref existence and source hashes are authority for this obligation's exact
      // scope, not an assertion that the question or its renderer is correct.
      const source=git(['show',row.sourceRef.commit+':'+row.sourceRef.path]);
      if(sha(source)!==row.sourceRef.sha256||blob(source)!==row.sourceRef.gitBlobSha1)throw Error('NEGATIVE_INVENTORY_SOURCE');
      entries.push({questionUid:row.questionUid,sourceArchiveFile:row.sourceArchiveFile,sourceOrdinal:row.sourceOrdinal,sourceQuestionNo:row.sourceQuestionNo,ordinal:row.ordinal,sourceBlob:row.sourceRef.gitBlobSha1,evidencePath:p,evidenceSha256:hash});
     }
    }
   }
  }catch{failure='CURRENT_RENDERER_HOLD_NEGATIVE_HISTORY_UNAVAILABLE';}
 }
 return (d,currentSourceBlob)=>{
  if(!/^original\/middle\/m3\/2(?:mid|final)\//.test(d.sourceArchiveFile||''))return {required:false,errors:[],digest:null};
  load();if(failure)return {required:true,errors:[failure],digest:null};
  const found=entries.filter(r=>r.sourceArchiveFile===d.sourceArchiveFile);if(!found.length)return {required:false,errors:[],digest:null};
  const ids=[...new Set(found.map(r=>r.questionUid))],holds=(d.items||[]).filter(i=>HOLD_SCHEMAS.includes(i.registrationHold?.schemaVersion)).map(i=>i.registrationHold);
  // Every recorded UID remains withheld, including witnesses deleted from a
  // later tree. A newer negative witness may rebind that same obligation but
  // cannot remove another held UID from the complete file.
  const covered=ids.every(uid=>holds.some(h=>h.questionUid===uid&&found.some(r=>r.sourceBlob===currentSourceBlob&&r.questionUid===h.questionUid&&r.sourceOrdinal===h.sourceOrdinal&&r.sourceQuestionNo===h.sourceQuestionNo&&r.ordinal===h.ordinal&&r.evidencePath===h.independentNegativeEvidence?.path&&r.evidenceSha256===h.independentNegativeEvidence?.sha256)));
  return {required:true,errors:!has(d)||!covered?['CURRENT_RENDERER_HOLD_NEGATIVE_OBLIGATION_REQUIRED']:[],digest:sha(stable(found))};
 };
}

function validateFile(root,d,hp){
 if(v2.has(d))return v2.validateFile(root,d,hp);
 if(!has(d))return [];
 const {safe,sha,blob,stable,payloadHash,identityHash,assetRefs,loadBank,dictionary,identity,studentFields}=hp;
 const fail=s=>{throw Error('CURRENT_RENDERER_HOLD_'+s);},same=(a,b)=>stable(a)===stable(b);
 const keys=(o,k)=>{if(!o||typeof o!=='object'||Array.isArray(o)||!same(Object.keys(o).sort(),[...k].sort()))fail('FIELDS');};
 const zero=(o,ks)=>{if(ks.some(k=>o[k]!==0))fail('NEGATIVE_ONLY');};
 function immutable(ref,pattern,{local=false,fields=['commit','path','sha256']}={}){
  keys(ref,fields);if(!GIT.test(ref.commit||'')||!SHA.test(ref.sha256||'')||!pattern.test(ref.path||''))fail('REFERENCE');
  safe(root,ref.path);
  // Binary assets must never pass through the older UTF-8 Git helper.
  let b;try{b=execFileSync('git',['-C',root,'show',ref.commit+':'+ref.path],{timeout:15000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});}catch{fail('IMMUTABLE_UNAVAILABLE');}
  if(sha(b)!==ref.sha256||own(ref,'gitBlobSha1')&&(!GIT.test(ref.gitBlobSha1||'')||blob(b)!==ref.gitBlobSha1))fail('IMMUTABLE_BYTES');
  if(local){let live;try{live=fs.readFileSync(safe(root,ref.path));}catch{fail('LOCAL_UNAVAILABLE');}if(sha(live)!==ref.sha256)fail('LOCAL_BYTES');}
  return b;
 }
 const ref4=['commit','path','gitBlobSha1','sha256'];
 const plain=r=>({commit:r?.commit,path:r?.path,sha256:r?.sha256});
 function assets(rows,q,commit,local,visual){
  if(!Array.isArray(rows)||!same(rows.map(r=>r.path).sort(),assetRefs(q)))fail('ASSET_COVERAGE');
  const seen=new Set();for(const r of rows){if(seen.has(r.path)||r.commit!==commit||visual&&r.visuallyInspected!==true)fail('ASSET_SCOPE');seen.add(r.path);immutable(r,ASSET,{local,fields:[...ref4,'visuallyInspected']});}
 }
 try{
  if(!/^original\/middle\/m3\/2(?:mid|final)\//.test(d.sourceArchiveFile)||['scope','expectedQuestionCount','selected','unsubmitted'].some(k=>own(d,k)))fail('FULL_M3_SCOPE');
  const held=(d.items||[]).filter(i=>own(i,'registrationHold'));if(held.length!==1||held[0].registrationHold.schemaVersion!==HOLD_SCHEMA)fail('ONE_HELD_UID');
  const it=held[0],h=it.registrationHold,refs=d.evidence?.nativeHoldReview;
  keys(h,['schemaVersion','reason','questionUid','sourceOrdinal','sourceQuestionNo','ordinal','sourceGitBlobSha','studentPayloadSha256','sourceFingerprint','wholeQuestionSha256',...directFields,'nextAction']);
  if(h.reason!==REASON||!UID.test(h.questionUid||'')||!same(h.currentRendererNegativeEvidence,refs?.currentRendererNegative)||!same(h.vectorContinuityEvidence,refs?.vectorContinuity)||!same(h.independentNegativeEvidence,refs?.independentNegative))fail('OPT_IN_BINDING');
  const p=JSON.parse(immutable(h.currentRendererNegativeEvidence,REF,{local:true}));
  keys(p,['schemaVersion','scope','reason','decision','author','sourceArchiveFile','expectedQuestionCount','heldUidCount','questionUid','sourceOrdinal','sourceQuestionNo','ordinal','priorCompactRef','priorSourceRef','sourceRef','nativeFourSlotRef','vectorContinuityRef','independentNegativeReviewRef','retainedOrdinals','unchangedOrdinals','newSemanticApprovals','newDifficultyApprovals','newMathQa','slotChanges','sourceWrites','assetWrites','nextAction']);
  if(p.schemaVersion!==PROOF_SCHEMA||p.scope!=='CURRENT_FULL_COMPACT_ONE_RENDERER_HOLD'||p.reason!==REASON||p.decision!=='WITHHOLD_REGISTRATION'||p.heldUidCount!==1||!p.author||typeof p.nextAction!=='string'||!p.nextAction.trim()||h.nextAction!==p.nextAction)fail('CARRIER_DECISION');
  zero(p,['newSemanticApprovals','newDifficultyApprovals','newMathQa','slotChanges','sourceWrites','assetWrites']);
  for(const k of ['questionUid','sourceOrdinal','sourceQuestionNo','ordinal'])if(p[k]!==h[k])fail('HELD_IDENTITY');
  if(p.sourceArchiveFile!==d.sourceArchiveFile||p.ordinal!==it.ordinal||!same(p.vectorContinuityRef,h.vectorContinuityEvidence)||!same(p.independentNegativeReviewRef,h.independentNegativeEvidence))fail('CARRIER_SCOPE');
  const cp='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json'),sp='archive/exams/'+d.sourceArchiveFile;
  if(p.priorCompactRef?.path!==cp||p.priorSourceRef?.path!==sp||p.sourceRef?.path!==sp)fail('PATH_BINDING');
  const prior=JSON.parse(immutable(p.priorCompactRef,COMPACT,{fields:ref4}));
  const before=loadBank(immutable(p.priorSourceRef,SOURCE,{fields:ref4})),currentRaw=immutable(p.sourceRef,SOURCE,{local:true,fields:ref4}),bank=loadBank(currentRaw);
  if(prior.schemaVersion!=='archive-meta-4slot-compact-v1'||prior.sourceArchiveFile!==d.sourceArchiveFile||['scope','expectedQuestionCount','selected','unsubmitted'].some(k=>own(prior,k))||prior.items?.some(i=>own(i,'registrationHold'))||own(prior.evidence,'nativeHoldReview'))fail('PRIOR_FULL_COMPACT');
  if(prior.sourceGitBlobSha!==p.priorSourceRef.gitBlobSha1||d.sourceGitBlobSha!==p.sourceRef.gitBlobSha1||h.sourceGitBlobSha!==d.sourceGitBlobSha||!Number.isSafeInteger(p.expectedQuestionCount)||p.expectedQuestionCount<2||bank.length!==p.expectedQuestionCount||before.length!==bank.length||prior.items?.length!==bank.length||d.items.length!==bank.length)fail('WHOLE_DENOMINATOR');
  const nativeRef=plain(prior.evidence?.originalReview||prior.evidence);
  if(!same(p.nativeFourSlotRef,nativeRef))fail('ORIGINAL_AUTHORITY_REFERENCE');
  const native=JSON.parse(immutable(nativeRef,REF));
  if(native.schemaVersion!=='archive-meta-4slot-v0'||native.sourceArchiveFile!==d.sourceArchiveFile||native.items?.length!==bank.length)fail('ORIGINAL_FULL_AUTHORITY');
  if(prior.evidence?.sourceContinuity)immutable(plain(prior.evidence.sourceContinuity),/^archive-work\/[A-Za-z0-9_가-힣./-]+\.json$/);
  const review=JSON.parse(immutable(p.vectorContinuityRef,REF,{local:true}));
  keys(review,['schemaVersion','scope','reviewer','reviewedAtUtc','newFourSlotValues','newSemanticApprovals','newDifficultyApprovals','newMathQa','sourceWrites','assetWrites','actualBrowser','dictionaryRef','exams']);
  if(review.schemaVersion!==CONTINUITY_SCHEMA||review.scope!=='KEEP_EXACT_EXISTING_FOUR_SLOT_VECTOR_ON_CURRENT_SOURCE'||review.reviewer!==p.author||review.reviewer===prior.reviewedBy?.agent||!Number.isFinite(Date.parse(review.reviewedAtUtc))||review.actualBrowser!=='NOT_RUN')fail('CONTINUITY_AUTHORITY');
  zero(review,['newFourSlotValues','newSemanticApprovals','newDifficultyApprovals','newMathQa','sourceWrites','assetWrites']);
  const dr=review.dictionaryRef;immutable(dr,/^docs\/architecture\/4slot\/term-dictionary-v[0-9]+(?:\.[0-9]+)*\.json$/,{local:true,fields:[...ref4,'version']});
  if(dr.version!==prior.dictionaryVersion||dr.version!==d.dictionaryVersion||dr.path!==dictionary?.path||dr.sha256!==dictionary?.sha256)fail('DICTIONARY');
  const exams=(review.exams||[]).filter(e=>e.priorCompactRef?.path===cp);if(exams.length!==1)fail('CONTINUITY_EXAM');const e=exams[0];
  keys(e,['examId','priorCompactRef','priorSourceRef','sourceRef','sourceQuestionCount','originalFourSlotRef','sourceContinuityRef','rows','withheldOrdinals']);
  if(!same(e.priorCompactRef,p.priorCompactRef)||!same(e.priorSourceRef,p.priorSourceRef)||!same(e.sourceRef,p.sourceRef)||e.sourceQuestionCount!==bank.length||!same(e.originalFourSlotRef,nativeRef)||!same(e.sourceContinuityRef,prior.evidence.sourceContinuity)||!same(e.withheldOrdinals,[h.ordinal]))fail('CONTINUITY_BINDING');
  if(!Array.isArray(e.rows)||!Array.isArray(p.retainedOrdinals)||!Array.isArray(p.unchangedOrdinals)||!same(p.retainedOrdinals,[...e.rows.map(r=>r.ordinal)].sort((a,b)=>a-b)))fail('RETAINED_SCOPE');
  const negative=JSON.parse(immutable(p.independentNegativeReviewRef,NEGATIVE_PATH,{local:true}));
  keys(negative,['schemaVersion','scope','decision','reviewer','transportAuthor','reviewedAtUtc','heldUidCount','newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites','rows']);
  if(negative.schemaVersion!==REVIEW_SCHEMA||negative.scope!=='EXISTING_FOUR_SLOT_VECTOR_CURRENT_RENDERER_NEGATIVE_ONLY'||negative.decision!=='WITHHOLD_CURRENT_RENDERER'||!negative.reviewer||negative.reviewer===p.author||negative.transportAuthor!==p.author||!Number.isFinite(Date.parse(negative.reviewedAtUtc))||!Array.isArray(negative.rows)||negative.heldUidCount!==negative.rows.length||new Set(negative.rows.map(r=>r.questionUid)).size!==negative.rows.length)fail('NEGATIVE_AUTHORITY');
  zero(negative,['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites']);
  const nr=negative.rows.filter(r=>r.questionUid===h.questionUid&&r.sourceArchiveFile===d.sourceArchiveFile);if(nr.length!==1)fail('NEGATIVE_UID');const n=nr[0];
  keys(n,['questionUid','sourceArchiveFile','sourceOrdinal','sourceQuestionNo','ordinal','sourceRef','priorCompactRef','compactItemSha256','studentPayloadSha256','sourceFingerprint','wholeQuestionSha256','incorrectRenderer','currentAssets','inspection','classification','decision','observed']);
  if(n.decision!=='WITHHOLD_CURRENT_RENDERER'||!['CURRENT_RENDERER_AMBIGUITY','CURRENT_RENDERER_TEXT_MISMATCH'].includes(n.classification)||typeof n.observed!=='string'||!n.observed.trim()||!same(n.sourceRef,p.sourceRef)||!same(n.priorCompactRef,p.priorCompactRef)||['questionUid','sourceOrdinal','sourceQuestionNo','ordinal'].some(k=>n[k]!==h[k]))fail('NEGATIVE_SCOPE');
  keys(n.inspection,['stemRead','solutionRead','existingFourSlotsRead','actualRendererRead','browser']);
  if(['stemRead','solutionRead','existingFourSlotsRead','actualRendererRead'].some(k=>n.inspection[k]!==true)||n.inspection.browser!=='NOT_RUN')fail('ACTUAL_OBSERVATION');
  const heldQ=bank[h.sourceOrdinal-1],heldPrior=prior.items.find(i=>i.ordinal===h.ordinal);
  if(!heldQ||sourceNumber(heldQ)!==h.ordinal||sourceIdentityNumber(heldQ)!==h.sourceQuestionNo||!heldPrior||n.compactItemSha256!==sha(stable(heldPrior))||n.studentPayloadSha256!==payloadHash(heldQ)||n.sourceFingerprint!==identityHash(heldQ)||n.wholeQuestionSha256!==sha(stable(heldQ))||['studentPayloadSha256','sourceFingerprint','wholeQuestionSha256'].some(k=>h[k]!==n[k]))fail('HELD_CURRENT_VALUES');
  const wrong=n.incorrectRenderer;keys(wrong,['role',...ref4,'visuallyInspected']);
  if(wrong.role!=='solutionImage'||wrong.visuallyInspected!==true||wrong.commit!==p.sourceRef.commit||wrong.path!=='archive/'+String(heldQ.solutionImage||'').replace(/^archive\//,'')||!wrong.path.endsWith('.svg'))fail('INCORRECT_RENDERER');
  immutable(wrong,ASSET,{local:true,fields:['role',...ref4,'visuallyInspected']});assets(n.currentAssets,heldQ,p.sourceRef.commit,true,true);
  const lut=buildLookup({terms:[...dictionary.terms.values()]});for(const t of dictionary.terms.values())lut.set('#'+t.id,t);
  const seen=new Set(),unchanged=[];
  for(let i=0;i<bank.length;i++){
   const q=bank[i],old=before[i],ordinal=sourceNumber(q),item=prior.items.find(x=>x.ordinal===ordinal),ids=(identity?.records||[]).filter(x=>x.sourceArchiveFile===d.sourceArchiveFile&&x.sourceOrdinal===i+1),id=ids[0];
   if(!item||sourceNumber(old)!==ordinal||seen.has(ordinal)||ids.length!==1||!UID.test(id?.questionUid||'')||id.status!=null&&id.status!=='VERIFIED'||(identity.records||[]).filter(x=>x.questionUid===id.questionUid).length!==1||id.sourceQuestionNo!=null&&String(id.sourceQuestionNo)!==sourceIdentityNumber(q))fail('FULL_IDENTITY');seen.add(ordinal);
   const natives=native.items.filter(x=>Number(x.sourceOrdinal)===i+1&&x.questionUid===id.questionUid);if(natives.length!==1||!same(compactItem(natives[0],lut,new Map([[String(i+1),{ordinal}]])),item))fail('ORIGINAL_VECTOR_CHANGED');
   if(ordinal===h.ordinal){if(id.questionUid!==h.questionUid)fail('HELD_IDENTITY');continue;}
   const rr=e.rows.filter(r=>r.ordinal===ordinal);
   if(rr.length){if(rr.length!==1)fail('RETAINED_DUPLICATE');const r=rr[0];
    keys(r,['questionUid','sourceOrdinal','sourceQuestionNo','ordinal','decision','compactItemSha256','priorWholeQuestionSha256','currentWholeQuestionSha256','changedFields','changedStudentFields','stemRead','solutionRead','allFourSlotsRead','actualVisualInspection','priorAssets','currentAssets','captureSha256','renderers','observed']);
    if(r.questionUid!==id.questionUid||r.sourceOrdinal!==i+1||r.sourceQuestionNo!==sourceIdentityNumber(q)||r.decision!=='RETAIN_EXISTING_FOUR_SLOTS'||r.compactItemSha256!==sha(stable(item))||r.priorWholeQuestionSha256!==sha(stable(old))||r.currentWholeQuestionSha256!==sha(stable(q))||['stemRead','solutionRead','allFourSlotsRead','actualVisualInspection'].some(k=>r[k]!==true)||!SHA.test(r.captureSha256||'')||typeof r.observed!=='string'||!r.observed.trim())fail('RETAINED_CURRENT_REVIEW');
    const changed=[...new Set([...Object.keys(old),...Object.keys(q)])].filter(k=>own(old,k)!==own(q,k)||!same(old[k],q[k])).sort();
    if(!same([...r.changedFields].sort(),changed)||!same([...r.changedStudentFields].sort(),changed.filter(k=>studentFields.includes(k))))fail('RETAINED_FIELD_COVERAGE');
    assets(r.priorAssets,old,p.priorSourceRef.commit,false,true);assets(r.currentAssets,q,p.sourceRef.commit,true,true);
   }else{
    unchanged.push(ordinal);if(!same(old,q)||payloadHash(old)!==payloadHash(q)||!same(assetRefs(old),assetRefs(q)))fail('UNREVIEWED_QUESTION_CHANGE');
    for(const ap of assetRefs(q)){let a,b;try{a=execFileSync('git',['-C',root,'show',p.priorSourceRef.commit+':'+ap],{timeout:15000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});b=fs.readFileSync(safe(root,ap));}catch{fail('UNCHANGED_ASSET_UNAVAILABLE');}if(sha(a)!==sha(b))fail('UNREVIEWED_ASSET_CHANGE');}
   }
  }
  if(!same(unchanged.sort((a,b)=>a-b),p.unchangedOrdinals)||e.rows.length+p.unchangedOrdinals.length+1!==bank.length)fail('PARTITION');
  const expected=JSON.parse(JSON.stringify(prior));expected.sourceGitBlobSha=p.sourceRef.gitBlobSha1;
  expected.evidence.nativeHoldReview={currentRendererNegative:h.currentRendererNegativeEvidence,vectorContinuity:h.vectorContinuityEvidence,independentNegative:h.independentNegativeEvidence};
  expected.items.find(i=>i.ordinal===h.ordinal).registrationHold=h;
  if(!same(expected,d))fail('ORIGINAL_COMPACT_CHANGED');
  return [];
 }catch(error){return [error.message?.startsWith('CURRENT_RENDERER_HOLD_')?error.message:'CURRENT_RENDERER_HOLD_EVIDENCE_UNAVAILABLE'];}
}
module.exports={HOLD_SCHEMA,HOLD_SCHEMAS,PROOF_SCHEMA,REVIEW_SCHEMA,CONTINUITY_SCHEMA,REASON,has,validateFile,directFields,createObligationReader};
