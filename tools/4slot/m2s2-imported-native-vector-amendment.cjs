'use strict';
// A successor to an actually validated imported-current compact. The prior
// document is read literally; it is never reconstructed from the candidate.
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {compactItem} = require('./import-4slot.cjs');
const {buildLookup,validateData} = require('./validate-4slot.cjs');
const {sourceNumber,sourceIdentityNumber} = require('./exam-items.cjs');
const GROUP = 'currentM2ImportedNativeAmendment';
const PRIOR_GROUP = 'currentM2ImportedContinuity';
const SCHEMA = 'm2-s2-imported-native-vector-amendment-v1';
const SCOPE = 'EXACT_EXISTING_APPROVED_NATIVE_VECTOR_TRANSPORT_ONLY';
const PRIOR_SCHEMA = 'm2-s2-imported-current-four-slot-continuity-v1';
const HOLD_SCHEMA = '4slot-m2s2-imported-current-renderer-hold-v1';
const ZERO = ['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites'];
const SOURCE = /^archive\/exams\/original\/middle\/m2\/2final\/[^/]+\.js$/;
const COMPACT = /^archive\/data\/item-4slot\/original\/middle\/m2\/2final\/[^/]+\.4slot\.json$/;
const CARRIER = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/m2-imported-native-vector-amendment\.json$/;
const DOC = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const ASSET = /^archive\/assets\/.+\.(?:svg|png|jpe?g|gif|webp)$/i;
const NATIVE = /^archive\/data\/meta-review\/m2-s2-20261114\/exams\/E\d{3}\/(?:four-slot|review|root-acceptance|independent-sample)\.json$/;
const DICT = /^docs\/architecture\/4slot\/term-dictionary-v[0-9.]+\.json$/;
const REF = ['commit','path','sha256'], FULL = ['commit','path','gitBlobSha1','sha256'];
const SLOTS = ['given','goal','method','condition'];
const TUPLE = ['questionUid','sourceOrdinal','sourceQuestionNo','ordinal'];
const GIT = /^[a-f0-9]{40}$/, SHA = /^[a-f0-9]{64}$/, UID = /^qid_v1_[a-f0-9]{64}$/;
const own = (o,k) => Object.hasOwn(o||{},k);
const has = d => own(d.evidence,GROUP);
const inScope = d => /^original\/middle\/m2\/2final\//.test(d.sourceArchiveFile||'');
const git = (root,args) => execFileSync('git',['-C',root,'-c','core.quotepath=false',...args],{timeout:30000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
const withoutHold = item => Object.fromEntries(Object.entries(item).filter(([k])=>k!=='registrationHold'));
const vector = item => Object.fromEntries(SLOTS.map(k=>[k,item[k]]));

// Pass-local immutable obligation inventory only. No validation verdict or live
// bytes are cached. A later tree cannot turn an issued amendment back into v1.
function createObligationReader(root,{safe,sha,blob,stable}) {
  let loaded=false,failed=false,claims=[];
  function load() {
    if(loaded)return;loaded=true;
    try {
      const head=git(root,['rev-parse','--verify','HEAD']).toString().trim();if(!GIT.test(head))throw Error('HEAD');
      const history=git(root,['log','--full-history','--format=%H',head,'--',':(glob)docs/operations/**/m2-imported-native-vector-amendment.json']).toString().trim().split(/\s+/).filter(Boolean),seen=new Set();
      for(const commit of new Set([head,...history])) {
        const names=git(root,['ls-tree','-r','-z','--name-only',commit,'--','docs/operations']).toString().split('\0').filter(p=>CARRIER.test(p));
        for(const path of names) {
          safe(root,path);const raw=git(root,['show',commit+':'+path]),digest=sha(raw),key=path+'#'+digest;if(seen.has(key))continue;seen.add(key);
          const p=JSON.parse(raw);if(p.schemaVersion!==SCHEMA)continue;
          if(p.scope!==SCOPE||ZERO.some(k=>p[k]!==0)||!SOURCE.test(p.sourceRef?.path||'')||p.sourceRef.path!=='archive/exams/'+p.sourceArchiveFile||!GIT.test(p.sourceRef.commit||'')||!Array.isArray(p.changedRows)||!p.changedRows.length||!Array.isArray(p.heldRows))throw Error('CLAIM');
          const source=git(root,['show',p.sourceRef.commit+':'+p.sourceRef.path]);if(sha(source)!==p.sourceRef.sha256||blob(source)!==p.sourceRef.gitBlobSha1)throw Error('SOURCE');
          for(const row of [...p.changedRows,...p.heldRows])if(!UID.test(row.questionUid||'')||!Number.isSafeInteger(row.sourceOrdinal)||row.sourceOrdinal<1||!Number.isSafeInteger(row.ordinal)||typeof row.sourceQuestionNo!=='string')throw Error('ROW');
          for(const row of p.changedRows)if(!SHA.test(row.afterItemSha256||''))throw Error('VECTOR');
          claims.push({sourceArchiveFile:p.sourceArchiveFile,path,sha256:digest,changedRows:p.changedRows,heldRows:p.heldRows});
        }
      }
    } catch { failed=true; }
  }
  return d => {
    if(!inScope(d))return {errors:[],digest:null};load();
    if(failed)return {errors:['M2_IMPORTED_NATIVE_AMENDMENT_HISTORY_UNAVAILABLE'],digest:null};
    const found=claims.filter(x=>x.sourceArchiveFile===d.sourceArchiveFile);if(!found.length)return {errors:[],digest:null};
    const held=(d.items||[]).map(i=>i.registrationHold).filter(h=>h?.schemaVersion===HOLD_SCHEMA);
    const holds=found.flatMap(x=>x.heldRows).every(r=>held.some(h=>TUPLE.every(k=>h[k]===r[k])));
    const values=found.flatMap(x=>x.changedRows).every(r=>{const rows=(d.items||[]).filter(i=>i.ordinal===r.ordinal);return rows.length===1&&sha(stable(withoutHold(rows[0])))===r.afterItemSha256;});
    const successor=require('./m2s2-exact-display-repair-closure.cjs').hasFor(d,'IMPORTED_NATIVE_AMENDMENT');
    return {required:true,errors:has(d)&&holds&&values||successor&&values?[]:['M2_IMPORTED_NATIVE_AMENDMENT_OBLIGATION_REQUIRED'],digest:sha(stable(found)),...(successor?{entries:found}:{})};
  };
}

function evidenceDigests(root,d,{safe,sha}) {
  const out={};
  for(const r of Object.values(d.evidence?.[GROUP]||{}))if(r?.path){try{out[r.path]=sha(fs.readFileSync(safe(root,r.path)));}catch{out[r.path]=null;}}
  return out;
}

function validateCore(root,d,hp,validatePrior,historicalCommit=null,historicalReads=null) {
  if(!has(d))return [];
  const {safe,sha,blob,stable,payloadHash,assetRefs,loadBank,dictionary,identity}=hp;
  const fail = s => {throw Error('M2_IMPORTED_NATIVE_AMENDMENT_'+s);};
  const same = (a,b) => stable(a)===stable(b);
  const keys = (x,ks) => {if(!x||typeof x!=='object'||Array.isArray(x)||!same(Object.keys(x).sort(),[...ks].sort()))fail('FIELDS');};
  const plain = r => Object.fromEntries(REF.map(k=>[k,r?.[k]]));
  const full = r => Object.fromEntries(FULL.map(k=>[k,r?.[k]]));
  const changes = (a,b) => [...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>own(a,k)!==own(b,k)||!same(a[k],b[k])).sort();
  const localBytes=p=>{safe(root,p);const raw=historicalCommit?git(root,['show',historicalCommit+':'+p]):fs.readFileSync(safe(root,p));if(historicalReads&&DOC.test(p))historicalReads.set(p,{commit:historicalCommit,path:p,gitBlobSha1:blob(raw),sha256:sha(raw)});return raw;};
  function read(r,pattern,{local=false,complete=false,ancestor=false}={}) {
    keys(r,complete?FULL:REF);if(!GIT.test(r.commit||'')||!SHA.test(r.sha256||'')||!pattern.test(r.path||''))fail('REFERENCE');safe(root,r.path);
    if(ancestor){try{git(root,['merge-base','--is-ancestor',r.commit,'HEAD']);}catch{fail('UNMERGED_REFERENCE');}}
    let raw;try{raw=git(root,['show',r.commit+':'+r.path]);}catch{fail('IMMUTABLE_UNAVAILABLE');}
    if(sha(raw)!==r.sha256||complete&&blob(raw)!==r.gitBlobSha1)fail('IMMUTABLE_BYTES');
    if(local){let live;try{live=localBytes(r.path);}catch{fail('LIVE_UNAVAILABLE');}if(!raw.equals(live))fail('LIVE_BYTES');}
    return raw;
  }
  const json = (r,pattern,opt) => JSON.parse(read(r,pattern,opt));
  function ownerRef(r,commit){return {commit,path:r?.path,sha256:r?.sha256};}
  function assetRef(r){return {commit:r?.commit,path:r?.path,gitBlobSha1:r?.gitBlobSha1,sha256:r?.sha256??r?.rawSha256};}
  function assetInventory(rows,q,currentCommit,{local=false}={}) {
    if(!Array.isArray(rows)||!same(rows.map(r=>r.path).sort(),assetRefs(q)))fail('OWNER_ASSET_INVENTORY');
    for(const row of rows){const r=assetRef(row),bytes=read(r,ASSET,{complete:true});const current=git(root,['show',currentCommit+':'+r.path]);if(!bytes.equals(current))fail('OWNER_CURRENT_ASSET');if(local&&!bytes.equals(localBytes(r.path)))fail('OWNER_LIVE_ASSET');}
  }
  try {
    const group=d.evidence[GROUP];keys(group,['carrier','nativeFourSlotCopy','currentRenderer','nativeVectorTransport']);
    const p=json(group.carrier,CARRIER,{local:true,ancestor:true});
    keys(p,['schemaVersion','scope','transportAuthor','sourceArchiveFile','examId','expectedQuestionCount','priorValidatedCompactRef','priorCarrierRef','mainCompactRef','mainSourceRef','mainCurrentRendererRef','mainNativeVectorTransportRef','nativeFourSlotRef','nativeReviewRef','nativeRootAcceptanceRef','nativeIndependentSampleRef','nativeSourceRef','sourceRef','dictionaryRef','nativeFourSlotCopyRef','changedRows','retainedFallbackRows','heldRows',...ZERO]);
    if(p.schemaVersion!==SCHEMA||p.scope!==SCOPE||!p.transportAuthor||p.sourceArchiveFile!==d.sourceArchiveFile||!/^E\d{3}$/.test(p.examId||'')||ZERO.some(k=>p[k]!==0))fail('SCOPE');
    for(const[a,b]of[['nativeFourSlotCopy','nativeFourSlotCopyRef'],['currentRenderer','mainCurrentRendererRef'],['nativeVectorTransport','mainNativeVectorTransportRef']])if(!same(group[a],p[b]))fail('EVIDENCE_LINK');
    const sp='archive/exams/'+d.sourceArchiveFile,cp='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json');
    if([p.priorValidatedCompactRef,p.mainCompactRef].some(r=>r.path!==cp)||[p.nativeSourceRef,p.sourceRef,p.mainSourceRef].some(r=>r.path!==sp))fail('SOURCE_PATH');
    // Like v1's historical reader, the literal prior may be an immutable side
    // reference. Its complete authority is replayed below; the new carrier and
    // main owner compact must still belong to actual HEAD ancestry.
    const prior=json(p.priorValidatedCompactRef,COMPACT,{complete:true});
    if(has(prior)||!prior.evidence?.[PRIOR_GROUP]||prior.sourceArchiveFile!==d.sourceArchiveFile||!same(prior.evidence[PRIOR_GROUP].carrier,p.priorCarrierRef))fail('PRIOR_LITERAL_COMPACT');
    const priorCarrier=json(p.priorCarrierRef,/^docs\/operations\/.+\/m2-imported-four-slot-transport\.json$/,{local:true});
    if(priorCarrier.schemaVersion!==PRIOR_SCHEMA||!same(priorCarrier.sourceRef,p.sourceRef)||!same(priorCarrier.dictionaryRef,p.dictionaryRef)||prior.sourceGitBlobSha!==p.sourceRef.gitBlobSha1)fail('PRIOR_SOURCE_BINDING');
    // The existing validator receives the raw immutable prior document and the
    // real current root. It cannot see a fabricated vector or source snapshot.
    const priorErrors=validatePrior(root,prior,hp,p.priorValidatedCompactRef);if(priorErrors.length)fail('PRIOR_V1:'+priorErrors.join('|'));
    const currentRaw=read(p.sourceRef,SOURCE,{complete:true,local:true}),bank=loadBank(currentRaw);
    const main=json(p.mainCompactRef,COMPACT,{complete:true,ancestor:true});
    if(p.mainSourceRef.commit!==p.mainCompactRef.commit)fail('MAIN_SNAPSHOT');
    const mainRaw=read(p.mainSourceRef,SOURCE,{complete:true,ancestor:true}),mainBank=loadBank(mainRaw);
    const observedBank=loadBank(read(priorCarrier.observedSourceRef,SOURCE,{complete:true}));
    if(!same(mainBank,observedBank))fail('MAIN_OBSERVED_SOURCE');
    const beforeBank=loadBank(read(priorCarrier.priorSourceRef,SOURCE,{complete:true}));
    const dict=json(p.dictionaryRef,DICT,{complete:true,local:true});
    if(p.dictionaryRef.path!==dictionary.path||p.dictionaryRef.sha256!==dictionary.sha256||dict.dictionaryVersion!==d.dictionaryVersion)fail('DICTIONARY');
    const n=bank.length;
    if(!Number.isSafeInteger(p.expectedQuestionCount)||n!==p.expectedQuestionCount||[prior.items,main.items,d.items,mainBank,observedBank,beforeBank].some(x=>!Array.isArray(x)||x.length!==n)||main.items.some(x=>own(x,'registrationHold'))||own(main,'scope')||own(d,'scope'))fail('FULL_DENOMINATOR');
    const mainGroup=main.evidence?.currentRendererContinuity;
    if(!mainGroup||mainGroup.schemaVersion!=='m2-existing-four-slot-current-renderer-reference-v1'||['newMathematicalQa','newMetadataApproval','sourceContentHoldsReleased'].some(k=>mainGroup[k]!==0))fail('MAIN_EVIDENCE');
    for(const[r,k]of[[p.mainCurrentRendererRef,'ref'],[p.mainNativeVectorTransportRef,'existingApprovedNativeVectorTransportRef']])if(r.commit!==p.mainCompactRef.commit||mainGroup[k]?.path!==r.path||mainGroup[k]?.sha256!==r.sha256||own(mainGroup[k],'commit')&&mainGroup[k].commit!==r.commit)fail('MAIN_EVIDENCE');
    const owner=json(p.mainCurrentRendererRef,DOC,{local:true}),transport=json(p.mainNativeVectorTransportRef,DOC,{local:true});
    if(owner.schemaVersion!=='m2-s2-existing-four-slot-current-renderer-continuity-v1'||transport.schemaVersion!=='m2-s2-existing-approved-native-vector-transport-v1'||owner.examId!==p.examId||transport.examId!==p.examId||owner.sourceArchiveFile!==d.sourceArchiveFile||owner.decision!=='ACCEPT_CURRENT_RENDERER_AND_EXISTING_NATIVE_FOUR_SLOT_BINDING_ONLY'||transport.decision!=='TRANSPORT_EXACT_EXISTING_ROOT_APPROVED_NATIVE_VALUES_ONLY'||!owner.reviewer||owner.reviewer===p.transportAuthor||transport.reviewer!==owner.reviewer||owner.repositoryWrites!==0||transport.repositoryWrites!==0||transport.newSemanticApprovals!==0||transport.sourceContentHoldsReleased!==0||transport.sourceConditionsAdded!==0)fail('OWNER_SCOPE');
    for(const doc of [owner,transport])if(doc.counts?.examDenominator!==n||doc.sourceRef?.path!==sp||doc.sourceRef.currentGitBlobSha1!==blob(mainRaw)||doc.sourceRef.currentRawSha256!==sha(mainRaw)||doc.nativeSourceRef?.path!==sp||doc.nativeSourceRef.gitBlobSha1!==p.nativeSourceRef.gitBlobSha1||(doc.nativeSourceRef.rawSha256??doc.nativeSourceRef.sha256)!==p.nativeSourceRef.sha256)fail('OWNER_SOURCE');
    if(owner.existingNativeVectorTransportRef?.path!==p.mainNativeVectorTransportRef.path||owner.existingNativeVectorTransportRef.sha256!==p.mainNativeVectorTransportRef.sha256||owner.dictionaryRef?.path!==dictionary.path||owner.dictionaryRef.sha256!==dictionary.sha256)fail('OWNER_LINK');
    const nativeRefs=[['nativeFourSlotRef','four-slot.json'],['nativeReviewRef','review.json'],['nativeRootAcceptanceRef','root-acceptance.json'],['nativeIndependentSampleRef','independent-sample.json']];
    for(const[k,file]of nativeRefs){if(p[k].path!=='archive/data/meta-review/m2-s2-20261114/exams/'+p.examId+'/'+file||p[k].commit!==p.nativeFourSlotRef.commit||!same(full(owner.nativeRefs?.[file]),p[k])||!same(full(transport.nativeRefs?.[file]),p[k]))fail('NATIVE_REFERENCE');}
    if(p.nativeSourceRef.commit!==p.nativeFourSlotRef.commit||!same(full(mainGroup.nativeFourSlotRef),p.nativeFourSlotRef)||!same(full(mainGroup.nativeRootAcceptanceRef),p.nativeRootAcceptanceRef))fail('NATIVE_MAIN_REFERENCE');
    const nativeRaw=read(p.nativeFourSlotRef,NATIVE,{complete:true}),native=JSON.parse(nativeRaw),copy=read(p.nativeFourSlotCopyRef,DOC,{local:true,ancestor:true});if(!copy.equals(nativeRaw))fail('NATIVE_COPY_BYTES');
    const review=json(p.nativeReviewRef,NATIVE,{complete:true}),accepted=json(p.nativeRootAcceptanceRef,NATIVE,{complete:true}),independent=json(p.nativeIndependentSampleRef,NATIVE,{complete:true}),nativeBank=loadBank(read(p.nativeSourceRef,SOURCE,{complete:true}));
    if(native.schemaVersion!=='archive-meta-4slot-v0'||native.sourceArchiveFile!==d.sourceArchiveFile||native.sourceGitBlobSha!==p.nativeSourceRef.gitBlobSha1||native.dictionaryVersion!==d.dictionaryVersion||native.items?.length!==n||nativeBank.length!==n||review.schemaVersion!=='m2-s2-meta-review-v1'||review.examId!==p.examId||review.sourceArchiveFile!==d.sourceArchiveFile||review.sourceGitBlobSha!==native.sourceGitBlobSha||review.items?.length!==n||independent.examId!==p.examId||independent.sourceGitBlobSha!==native.sourceGitBlobSha)fail('NATIVE_FULL_SCOPE');
    if(accepted.schemaVersion!=='m2-s2-root-acceptance-v1'||accepted.examId!==p.examId||accepted.reviewer!=='ROOT'||!accepted.owner||!accepted.sampleReviewer||accepted.owner===accepted.sampleReviewer||accepted.semanticReviewStatus!=='PRO_REVIEW_COMPLETE'||accepted.sourceUnchanged!==true||accepted.sourceGitBlobSha!==p.nativeSourceRef.gitBlobSha1||accepted.sourceSha256!==p.nativeSourceRef.sha256||accepted.fourSlotSha256!==p.nativeFourSlotRef.sha256||accepted.reviewSha256!==p.nativeReviewRef.sha256||accepted.independentSampleSha256!==p.nativeIndependentSampleRef.sha256)fail('ROOT_NATIVE_ACCEPTANCE');
    const lut=buildLookup(dict);for(const t of dict.terms)lut.set('#'+t.id,t);
    const validation=validateData(native,{root,dict,lut});if(validation.fail.length)fail('NATIVE_CURRENT_VALIDATION');
    const rawObservation=json(ownerRef(owner.actualObservations,p.mainCompactRef.commit),DOC,{local:true});
    const contact=json(ownerRef(owner.contactManifestRef,p.mainCompactRef.commit),DOC,{local:true});
    const ownerV1=rawObservation.schemaVersion==='m2-s2-narrow-renderer-observations-v1';
    if(!ownerV1&&rawObservation.schemaVersion!=='m2-s2-narrow-renderer-observations-v2'||rawObservation.reviewer!==owner.reviewer||rawObservation.examId!==p.examId||rawObservation.sourceArchiveFile!==d.sourceArchiveFile||rawObservation.currentSourceGitBlobSha1!==p.mainSourceRef.gitBlobSha1||rawObservation.contactManifestSha256!==owner.contactManifestRef.sha256||contact.schemaVersion!=='s2-exact-renderer-contact-manifest-v1'||contact.examId!==p.examId||!Array.isArray(rawObservation.rows)||!Array.isArray(contact.rows)||rawObservation.rows.length!==contact.rows.length)fail('OWNER_OBSERVATION');
    const obsKey=r=>[r.sourceOrdinal,r.questionUid,r.role,r.beforeAssetSha256,r.currentAssetSha256,r.contactSha256];
    const contactKey=r=>[r.sourceOrdinal,r.questionUid,r.role,r.beforeAsset?.rawSha256??null,r.currentAsset?.rawSha256,r.contact?.sha256];
    if(!same(rawObservation.rows.map(r=>stable(obsKey(r))).sort(),contact.rows.map(r=>stable(contactKey(r))).sort()))fail('OWNER_CONTACT');
    for(const row of rawObservation.rows)if(row.actualBeforeAndCurrentImagesViewed!==true||row.currentSourceStemRead!==true||own(row,'sourceTextChoicesAnswerSolutionUnchanged')&&row.sourceTextChoicesAnswerSolutionUnchanged!==true||row.decision!=='ACCEPT_RENDERER_CONTINUITY_ONLY')fail('OWNER_ACTUAL_READ');
    if(ownerV1){
      // The immutable v1 observers used separate problem/solution reading flags.
      // Replay that exact declaration; do not invent the absent v2 assertion.
      keys(rawObservation,['schemaVersion','taskId','reviewer','reviewedAt','examId','sourceArchiveFile','currentSourceGitBlobSha1','contactManifestSha256','scope','counts','sourceMutation','assetMutation','metadataOrRegistryApproval','newFullMathematicalQa','originalContentHoldsReleased','officialRegistration','studentDeployment','rows']);
      keys(rawObservation.counts,['changedUids','contacts','addedRendererContacts']);
      if(rawObservation.scope!=='ACTUAL_BEFORE_CURRENT_RENDERER_AND_UNCHANGED_SOURCE_TEXT_COMPARISON_ONLY'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(rawObservation.taskId||'')||typeof rawObservation.reviewedAt!=='string'||!/^\d{4}-\d\d-\d\dT.*(?:Z|\+00:00)$/.test(rawObservation.reviewedAt)||!Number.isFinite(Date.parse(rawObservation.reviewedAt))||['sourceMutation','assetMutation','metadataOrRegistryApproval','newFullMathematicalQa','originalContentHoldsReleased'].some(k=>rawObservation[k]!==0)||rawObservation.officialRegistration!=='NOT_RUN'||rawObservation.studentDeployment!=='NOT_RUN'||rawObservation.counts.contacts!==contact.rows.length||rawObservation.counts.changedUids!==new Set(contact.rows.map(r=>r.questionUid)).size||rawObservation.counts.addedRendererContacts!==0||contact.rows.some(r=>!r.beforeAsset))fail('OWNER_V1_SCOPE');
      for(const row of rawObservation.rows){
        keys(row,['sourceOrdinal','questionUid','role','beforeAssetSha256','currentAssetSha256','contactSha256','actualBeforeAndCurrentImagesViewed','currentSourceStemRead','actualSvgMarkupAndAccessibilityTextRead','decision','observations',...(row.role==='solution'?['currentCaptionAndUnchangedSolutionCompared']:[])]);
        if(!['problem','solution'].includes(row.role)||row.actualSvgMarkupAndAccessibilityTextRead!==true||row.role==='solution'&&row.currentCaptionAndUnchangedSolutionCompared!==true||typeof row.observations!=='string'||!row.observations.trim())fail('OWNER_V1_ROW');
      }
    }
    if(new Set(rawObservation.rows.map(r=>stable([r.sourceOrdinal,r.questionUid,r.role,r.currentAssetSha256]))).size!==rawObservation.rows.length)fail('DUPLICATE_OBSERVATION');
    if(!Array.isArray(owner.rows)||owner.rows.length!==n||!Array.isArray(transport.rows)||!Array.isArray(p.changedRows)||!Array.isArray(p.retainedFallbackRows)||!Array.isArray(p.heldRows))fail('OWNER_DENOMINATOR');
    const originalNative=json(priorCarrier.nativeFourSlotRef,/^archive-work\/4slot-annotate-v1\/out\/.+\.4slot\.json$/);
    const oldItems=prior.items.map(withoutHold),deltas=[],fallbacks=[],heldRows=[],seen=new Set();
    for(let i=0;i<n;i++) {
      const q=bank[i],oq=mainBank[i],nq=nativeBank[i],number=sourceNumber(q),ord=i+1;
      const ids=(identity.records||[]).filter(x=>x.sourceArchiveFile===d.sourceArchiveFile&&x.sourceOrdinal===ord),id=ids[0];
      if(ids.length!==1||!UID.test(id?.questionUid||'')||(identity.records||[]).filter(x=>x.questionUid===id.questionUid).length!==1||sourceNumber(oq)!==number||sourceNumber(nq)!==number||sourceNumber(beforeBank[i])!==number||seen.has(number)||id.sourceQuestionNo!=null&&String(id.sourceQuestionNo)!==sourceIdentityNumber(q))fail('FULL_IDENTITY');seen.add(number);
      const tuple={questionUid:id.questionUid,sourceOrdinal:ord,sourceQuestionNo:sourceIdentityNumber(q),ordinal:number};
      const pick=(rows,pred,reason)=>{const x=rows.filter(pred);if(x.length!==1)fail(reason);return x[0];};
      const old=pick(oldItems,x=>x.ordinal===number,'PRIOR_ITEM'),next=pick(main.items,x=>x.ordinal===number,'MAIN_ITEM'),nr=pick(native.items,x=>x.sourceOrdinal===ord&&x.questionUid===id.questionUid,'NATIVE_ITEM'),mr=pick(review.items,x=>x.sourceOrdinal===ord&&x.questionUid===id.questionUid,'NATIVE_REVIEW_ITEM'),or=pick(owner.rows,x=>x.sourceOrdinal===ord&&x.questionUid===id.questionUid,'OWNER_ITEM');
      const projected=compactItem(nr,lut,new Map([[String(ord),{ordinal:number}]]));
      if(!same({format:old.format,candidates:old.candidates},{format:next.format,candidates:next.candidates})||changes(old,next).some(k=>!SLOTS.includes(k)))fail('NON_VECTOR_CHANGE');
      if(or.sourceQuestionNo!==tuple.sourceQuestionNo||or.nativeSourceStudentPayloadSha256!==payloadHash(nq)||or.beforeStudentPayloadSha256!==payloadHash(beforeBank[i])||or.currentStudentPayloadSha256!==payloadHash(oq)||or.nativeToPriorCompactStudentExact!==true||payloadHash(nq)!==payloadHash(beforeBank[i])||or.existingCompactItemSha256!==sha(stable(old))||or.existingNativeItemSha256!==sha(stable(nr))||or.candidateCompactItemSha256!==sha(stable(next))||!same(or.beforeVectors,vector(old))||!same(or.afterVectors,vector(next))||!same(or.originalCandidateTerms,old.candidates)||or.formatUnchanged!==true)fail('OWNER_ITEM_BINDING');
      assetInventory(or.beforeAssets,nq,p.nativeSourceRef.commit);
      assetInventory(or.currentAssets,oq,p.mainSourceRef.commit,{local:true});
      for(const c of contact.rows.filter(r=>r.sourceOrdinal===ord||r.questionUid===id.questionUid)){
        if(c.sourceOrdinal!==ord||c.questionUid!==id.questionUid||!['problem','solution'].includes(c.role))fail('OWNER_CONTACT_IDENTITY');
        for(const [a,inventory] of [[c.beforeAsset,or.beforeAssets],[c.currentAsset,or.currentAssets]]){
          if(!a||!inventory.some(r=>r.path===a.path&&r.gitBlobSha1===a.gitBlobSha1&&(r.sha256??r.rawSha256)===(a.sha256??a.rawSha256)))fail('OWNER_CONTACT_ASSET');
          read(assetRef(a),ASSET,{complete:true});
        }
      }
      for(const a of or.currentAssets){const ar=assetRef(a),oldAsset=or.beforeAssets.find(b=>b.path===a.path&&(b.sha256??b.rawSha256)===ar.sha256);if(!oldAsset&&!rawObservation.rows.some(r=>r.questionUid===id.questionUid&&r.sourceOrdinal===ord&&r.currentAssetSha256===ar.sha256))fail('OWNER_ASSET_OBSERVATION');}
      if(!same(projected,next)) {
        if(!same(old,next)||changes(projected,next).some(k=>!SLOTS.includes(k)))fail('UNAPPROVED_NATIVE_DIFFERENCE');
        for(const slot of SLOTS.filter(k=>!same(projected[k],next[k]))) {
          const fb=pick(owner.existingFallbacksPreserved||[],x=>x.sourceOrdinal===ord&&x.questionUid===id.questionUid&&x.slot===slot,'FALLBACK');
          const other=pick(transport.existingFallbacksPreserved||[],x=>x.sourceOrdinal===ord&&x.questionUid===id.questionUid&&x.slot===slot,'FALLBACK');
          const author=pick(originalNative.items,x=>Number(x.sourceOrdinal)===ord,'FALLBACK_AUTHOR');
          if(!same(fb,other)||!same(fb.retainedIds,next[slot])||fb.decision!=='RETAIN_UNCHANGED_EXISTING_REVIEWED_BROAD_ID_AND_UNAPPROVED_CANDIDATE'||fb.currentLiteralQuoteExact!==true||fb.nativeSpecificEntry?.term!==fb.unapprovedCandidate||fb.candidateApproval!=='NOT_GRANTED'||fb.ordinarySearchEligibilityChanged!==false||fb.newRegistrationHold!==false||fb.originalAuthorItemSha256!==sha(stable(author))||!(author.slots?.[slot]||[]).some(e=>same(e,fb.originalAuthorEntry))||!(nr.slots?.[slot]||[]).some(e=>same(e,fb.nativeSpecificEntry))||!old.candidates.includes(fb.unapprovedCandidate))fail('FALLBACK_AUTHORITY');
          fallbacks.push({...tuple,slot,retainedIds:next[slot],candidate:fb.unapprovedCandidate,originalItemSha256:sha(stable(author))});
        }
      }
      const slots=SLOTS.filter(k=>!same(old[k],next[k]));
      if(or.nativeApprovedVectorCorrectionTransported!==(slots.length>0))fail('OWNER_DELTA');
      if(slots.length) {
        if(!same(projected,next))fail('CHANGED_NATIVE_VECTOR');
        const tr=pick(transport.rows,x=>x.sourceOrdinal===ord&&x.questionUid===id.questionUid,'TRANSPORT_ITEM');
        if(tr.sourceQuestionNo!==tuple.sourceQuestionNo||tr.nativeItemSha256!==sha(stable(nr))||tr.beforeCompactItemSha256!==sha(stable(old))||tr.afterCompactItemSha256!==sha(stable(next))||tr.newSemanticJudgment!==false||tr.originalLiteralQuotesAndConditionalJustificationsCopiedExactly!==true||!Array.isArray(tr.changes)||!same(tr.changes.map(c=>c.slot).sort(),[...slots].sort()))fail('TRANSPORT_ITEM_BINDING');
        for(const c of tr.changes)if(!same(c.before,old[c.slot])||!same(c.after,next[c.slot])||!same(c.nativeEntries,nr.slots[c.slot]))fail('TRANSPORT_ORIGINAL_ENTRIES');
        deltas.push({...tuple,slots,beforeItemSha256:sha(stable(old)),afterItemSha256:sha(stable(next))});
      }
      const priorItem=prior.items.find(x=>x.ordinal===number);
      if(own(priorItem,'registrationHold')){if(slots.length||priorItem.registrationHold.schemaVersion!==HOLD_SCHEMA)fail('HELD_VECTOR_CHANGED');heldRows.push(tuple);}
    }
    if(contact.rows.some(r=>!Number.isSafeInteger(r.sourceOrdinal)||r.sourceOrdinal<1||r.sourceOrdinal>n))fail('OWNER_CONTACT_IDENTITY');
    if(!deltas.length||!same(deltas,p.changedRows)||!same(fallbacks,p.retainedFallbackRows)||!same(heldRows,p.heldRows)||transport.rows.length!==deltas.length||!same(owner.sets?.nativeVectorCorrectionOrdinals,deltas.map(r=>r.sourceOrdinal))||!same(transport.sets?.nativeVectorCorrectionOrdinals,deltas.map(r=>r.sourceOrdinal)))fail('EXACT_DELTA_PARTITION');
    if(!same(owner.existingFallbacksPreserved||[],transport.existingFallbacksPreserved||[])||(owner.existingFallbacksPreserved||[]).length!==fallbacks.length)fail('FALLBACK_COVERAGE');
    const expectedMain=structuredClone(prior);delete expectedMain.evidence[PRIOR_GROUP];expectedMain.evidence.currentRendererContinuity=mainGroup;expectedMain.sourceGitBlobSha=p.mainSourceRef.gitBlobSha1;expectedMain.items=main.items;
    if(!same(expectedMain,main))fail('MAIN_NON_VECTOR_HEADER');
    const expected=structuredClone(prior);delete expected.evidence[PRIOR_GROUP];expected.evidence[GROUP]=group;expected.items=main.items.map(item=>{const row=structuredClone(item),old=prior.items.find(i=>i.ordinal===item.ordinal);if(own(old,'registrationHold'))row.registrationHold=structuredClone(old.registrationHold);return row;});
    if(!same(expected,d)||d.sourceGitBlobSha!==p.sourceRef.gitBlobSha1)fail('EXACT_SUCCESSOR_COMPACT');
    return [];
  } catch(e) {return [String(e.message).startsWith('M2_IMPORTED_NATIVE_AMENDMENT_')?e.message:'M2_IMPORTED_NATIVE_AMENDMENT_EVIDENCE_UNAVAILABLE'];}
}

function validateFile(root,d,hp,validatePrior){return validateCore(root,d,hp,validatePrior);}
function validateHistoricalFile(root,reference,hp,replayPrior){
  try{
    const {safe,sha,blob,stable}=hp;
    if(!reference||stable(Object.keys(reference).sort())!==stable([...FULL].sort())||!GIT.test(reference.commit||'')||!SHA.test(reference.sha256||'')||!GIT.test(reference.gitBlobSha1||'')||!COMPACT.test(reference.path||''))throw Error('REFERENCE');
    safe(root,reference.path);const raw=git(root,['show',reference.commit+':'+reference.path]);
    if(sha(raw)!==reference.sha256||blob(raw)!==reference.gitBlobSha1)throw Error('BYTES');
    const document=JSON.parse(raw);if(!has(document)||own(document.evidence,'currentM2DisplayRepairClosure'))throw Error('ORIGINAL_AMENDMENT');
    const reads=new Map();
    const prior=(r,d,h,ref)=>{const replay=replayPrior(r,ref,h);for(const v of replay.requiredLiveEvidence||[])reads.set(v.path,v);return replay.errors;};
    const errors=validateCore(root,document,hp,prior,reference.commit,reads);
    return {errors,document,requiredLiveEvidence:[...reads.values()].sort((a,b)=>a.path.localeCompare(b.path,'en'))};
  }catch{return {errors:['M2_IMPORTED_NATIVE_AMENDMENT_HISTORICAL_INPUT_INVALID'],document:null,requiredLiveEvidence:[]};}
}
module.exports={GROUP,PRIOR_GROUP,SCHEMA,SCOPE,CARRIER,ZERO,HOLD_SCHEMA,has,createObligationReader,evidenceDigests,validateFile,validateHistoricalFile};
