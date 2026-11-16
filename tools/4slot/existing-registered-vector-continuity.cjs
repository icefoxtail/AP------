'use strict';
// A separate, explicit continuation of an already published REGISTERED vector.
// It does not supply FINAL_QA, ACTIVE, new slots, or an identity-map correction.
const fs = require('node:fs'), path = require('node:path');
const crypto = require('node:crypto'), {execFileSync} = require('node:child_process');
const {compactItem} = require('./import-4slot.cjs');
const {buildLookup} = require('./validate-4slot.cjs');
const {sourceNumber, sourceIdentityNumber} = require('./exam-items.cjs');
const originalSourceError=require('./original-source-error-hold.cjs');
const {verifyUi, DECISION} = require('./existing-registered-vector-ui.cjs');
const {embeddedChoiceContinuity:svg7EmbeddedChoices,inlineFigureContinuity:svg7InlineFigure} = require('./existing-registered-vector-svg7-ui.cjs');
const {verifyOriginalTextSolutionFigure} = require('./existing-original-text-solution3.cjs');
const DIR = '.archive-meta-register/4slot-existing-vector-continuity';
const SCHEMA = 'archive-four-slot-existing-registered-vector-continuity-v1';
const REVIEW_SCHEMA = 'archive-independent-existing-four-slot-display-review-v1';
const SCOPE = 'EXISTING_REGISTERED_VECTOR_ONLY';
const MD = 'archive/data/question_metadata.json', ID = 'archive/data/question_identity_map.json';
const INDEX = 'archive/data/item-4slot-index.json';
const VECTOR = ['format','given','goal','method','condition','candidates'];
const PROBLEM = ['content','image','imageAlt','imageSize','layoutTag'];
const SOLUTION = ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize'];
const PROBLEM_ASSETS = ['content','question','choices','image','images','figureSvg','svg'];
const SOLUTION_ASSETS = ['solution','solutionImage','solutionImages','solutionFigureSvg'];
const STUDENT = ['id','number','questionType',...PROBLEM_ASSETS,'answer',...SOLUTION_ASSETS];
const SHA = /^[a-f0-9]{64}$/, OID = /^[a-f0-9]{40}$/, UID = /^qid_v1_[a-f0-9]{64}$/;
const own = (o,k) => Object.prototype.hasOwnProperty.call(o || {},k);
const stable = v => JSON.stringify(v, (_,x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])) : x);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
const eq = (a,b) => stable(a) === stable(b);
const fields = (q, keys) => Object.fromEntries(keys.map(k=>[k,own(q,k)?{present:true,value:q[k]}:{present:false}]));
const vector = q => Object.fromEntries(VECTOR.map(k=>[k,q[k]]));
const identityHash = q => sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,
  answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
function fail(code) { throw Error('EXISTING_REGISTERED_VECTOR_' + code); }
function object(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
function exact(x, keys, code) {
  if (!object(x) || !eq(Object.keys(x).sort(), [...keys].sort())) fail(code + '_KEYS');
}
function unique(rows, match, code) { const r = (rows||[]).filter(match); if (r.length !== 1) fail(code); return r[0]; }
function positive(x) { return Number.isSafeInteger(x) && x > 0; }
function normalizedPath(p) {
  if (typeof p !== 'string' || !p || /[\\\x00-\x1f\x7f]/.test(p) || p.startsWith('/') || p.split('/').some(x=>!x||x==='.'||x==='..')) fail('PATH');
  return p;
}
function git(root, args) {
  try { return execFileSync('git',['-C',root,...args],{env:{...process.env,GIT_NO_LAZY_FETCH:'1'},maxBuffer:128*1024*1024,
    timeout:30000,stdio:['ignore','pipe','pipe']}); }
  catch { fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE'); }
}
function makeReader(root, safe) {
  // One build only. run() re-hashes observed files before publishing its index;
  // a subsequent build constructs a fresh reader and replays every typed claim.
  const rawCache = new Map(), jsonCache = new Map(), localCache = new Map(), observed = new Map();
  let checkedIdentity = null;
  function local(p) { normalizedPath(p); if(!localCache.has(p)){const b=fs.readFileSync(safe(root,p));localCache.set(p,b);observed.set(p,sha(b));}return localCache.get(p); }
  function read(ref, live = false) {
    exact(ref,['commit','path','gitBlobSha1','sha256','bytes'],'REF'); normalizedPath(ref.path);
    if (!OID.test(ref.commit)||!OID.test(ref.gitBlobSha1)||!SHA.test(ref.sha256)||!positive(ref.bytes)) fail('REF');
    const key=stable(ref);
    if (!rawCache.has(key)) {
      const oid=git(root,['rev-parse',`${ref.commit}:${ref.path}`]).toString().trim();
      if (oid !== ref.gitBlobSha1) fail('REF_GIT_BINDING');
      const b=git(root,['cat-file','blob',oid]);
      if (b.length !== ref.bytes || sha(b)!==ref.sha256 || blob(b)!==oid) fail('REF_BYTES');
      rawCache.set(key,b);
    }
    const raw=rawCache.get(key);
    if (live && !local(ref.path).equals(raw)) fail('LIVE_BYTES_CHANGED');
    return raw;
  }
  function json(ref, live=false) { const b=read(ref,live), key=stable(ref); if(!jsonCache.has(key))jsonCache.set(key,JSON.parse(b)); return jsonCache.get(key); }
  function localJson(p) { const b=local(p),key=`local:${p}:${sha(b)}`;if(!jsonCache.has(key))jsonCache.set(key,JSON.parse(b));return jsonCache.get(key); }
  function assertIdentity(identity) { if(checkedIdentity!==identity){if(!eq(localJson(ID),identity))fail('IDENTITY_CHANGED_DURING_BUILD');checkedIdentity=identity;} }
  return {read,json,local,localJson,observed,assertIdentity};
}
function ancestor(root, before, after) {
  if(!OID.test(before)||!OID.test(after))fail('ANCESTOR_REF');
  try { execFileSync('git',['-C',root,'merge-base','--is-ancestor',before,after],{
    env:{...process.env,GIT_NO_LAZY_FETCH:'1'},timeout:30000,stdio:'pipe'}); }
  catch { fail('PRIOR_REGISTRATION_NOT_ANCESTOR'); }
}
function refsIn(x,out=[]) {
  if (Array.isArray(x)) for(const y of x)refsIn(y,out);
  else if(object(x)) {
    if(own(x,'commit')&&own(x,'gitBlobSha1')&&own(x,'path'))out.push(x);
    else for(const y of Object.values(x))refsIn(y,out);
  }
  return out;
}
function collect(root,{safe,walk,sha:hash}) {
  const bySource=new Map(), dir=safe(root,DIR), reader=makeReader(root,safe);
  if(!fs.existsSync(dir))return bySource;
  const currentDigests=[MD,ID].map(p=>{try{return [p,sha(reader.local(p))];}catch{return [p,null];}});
  for(const file of walk(dir)) {
    const relative=path.relative(root,file).split(path.sep).join('/');
    if(!relative.endsWith('.json'))fail('INPUT_FILE_TYPE');
    const raw=fs.readFileSync(file),doc=JSON.parse(raw);
    if(typeof doc.sourceArchiveFile!=='string'||!UID.test(doc.questionUid||'')||!positive(doc.sourceOrdinal))fail('INPUT_IDENTITY');
    if(relative!==`${DIR}/${doc.questionUid}.json`)fail('INPUT_PATH');
    const digests=[[relative,hash(raw)]];
    digests.push(...currentDigests);
    const entry={path:relative,sha256:hash(raw),questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,doc,digests,reader};
    if(!bySource.has(doc.sourceArchiveFile))bySource.set(doc.sourceArchiveFile,[]);
    bySource.get(doc.sourceArchiveFile).push(entry);
  }
  return bySource;
}
function sourceRefs(q, keys) {
  const text=JSON.stringify(fields(q,keys)).replaceAll('\\/','/'), out=new Set();
  for(const m of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))
    out.add(m[0].startsWith('archive/')?m[0]:'archive/'+m[0]);
  if (/(?:https?:)?\/\/[^\s"<>]+\.(?:png|jpe?g|gif|webp|svg)/i.test(text)) fail('REMOTE_ASSET_UNSUPPORTED');
  return [...out].sort();
}
function nestedAssets(b, p) {
  if(!/\.svg$/i.test(p))return [];
  const text=b.toString('utf8'),out=new Set();
  for(const m of text.matchAll(/(?:\b(?:xlink:)?href\s*=\s*["']([^"']+)["']|url\(\s*["']?([^"')\s]+)["']?\s*\))/gi)) {
    const value=m[1]||m[2]; if(value.startsWith('#')||value.startsWith('data:image/'))continue;
    if(/^[a-z]+:|^\/\//i.test(value))fail('REMOTE_NESTED_ASSET');
    const p0=value.split('#')[0].split('?')[0];
    const rel=p0.startsWith('/archive/assets/')?p0.slice(1):p0.startsWith('archive/assets/')?p0:
      p0.startsWith('assets/')?'archive/'+p0:path.posix.normalize(path.posix.join(path.posix.dirname(p),p0));
    if(!rel.startsWith('archive/assets/'))fail('NESTED_ASSET_SCOPE');
    normalizedPath(rel);out.add(rel);
  }
  return [...out];
}
function inventory(reader, refs, question, commit, live=false, keys=[...PROBLEM_ASSETS,...SOLUTION_ASSETS]) {
  if(!Array.isArray(refs))fail('ASSET_INVENTORY');
  const map=new Map();for(const ref of refs){reader.read(ref,live);if(ref.commit!==commit||!ref.path.startsWith('archive/assets/')||map.has(ref.path))fail('ASSET_INVENTORY');map.set(ref.path,ref);}
  const pending=sourceRefs(question,keys), seen=new Set();
  while(pending.length){const p=pending.shift();if(seen.has(p))continue;seen.add(p);const ref=map.get(p);if(!ref)fail('ASSET_INVENTORY_MISSING');pending.push(...nestedAssets(reader.read(ref,live),p));}
  if(!eq([...seen].sort(),[...map.keys()].sort())||!eq(refs.map(r=>r.path),[...map.keys()].sort()))fail('ASSET_INVENTORY_EXTRA_OR_ORDER');
  return refs;
}
function withoutCommit(refs) { return refs.map(({commit,...r})=>r); }
function sourceMap(bank) {
  const seen=new Set();return bank.map((q,i)=>{const n=sourceNumber(q);if(seen.has(n))fail('SOURCE_NUMBER_DUPLICATE');seen.add(n);return {q,sourceOrdinal:i+1,sourceQuestionNo:sourceIdentityNumber(q),displayNumber:n};});
}
function sameRef(a,b) { return eq(a,b); }
function validateNativeAuthority(reader,a,nativeRef,native,item,sourceRef,denominator) {
  exact(a,['kind','originalRootRef','originalIndependentRef','finalAcceptanceRef','semanticRef','originalFourSlotRef','proposalRef'],'NATIVE_AUTHORITY');
  if(!['ROOT_ACCEPTED_NATIVE','UNCHANGED_REBIND_MEMBER'].includes(a.kind))fail('NATIVE_AUTHORITY_KIND');
  const original=reader.json(a.originalRootRef), independent=reader.json(a.originalIndependentRef), final=reader.json(a.finalAcceptanceRef), semantic=reader.json(a.semanticRef);
  if(original.schemaVersion!=='m2-s1-root-acceptance-v1'||original.decision!=='ACCEPT_REVIEW_WITH_NAMED_DEBTS'||
     !/^E\d{3}$/.test(original.examId||'')||!String(original.owner||'').trim()||
     original.independentSha256!==a.originalIndependentRef.sha256||!object(independent)||
     !['m2-s1-independent-sample-v1','m2-s1-independent-review-v1'].includes(independent.schemaVersion)||
     independent.examId!==original.examId||!String(independent.reviewer||'').trim()||independent.reviewer===independent.author||
     (independent.schemaVersion==='m2-s1-independent-sample-v1'&&(independent.independent!==true||independent.reviewer!==original.sampleReviewer))||
     semantic.schemaVersion!=='m2-s1-meta-review-v1'||semantic.examId!==original.examId||semantic.sourceArchiveFile!==native.sourceArchiveFile)
    fail('NATIVE_ROOT_ACCEPTANCE');
  unique(semantic.items,x=>x.questionUid===item.questionUid&&Number(x.sourceOrdinal)===Number(item.sourceOrdinal),'NATIVE_SEMANTIC_IDENTITY');
  if(a.kind==='ROOT_ACCEPTED_NATIVE') {
    if(a.originalFourSlotRef!==null||a.proposalRef!==null)fail('NATIVE_AUTHORITY_MIXED');
    const direct=final.schemaVersion==='m2-s1-root-acceptance-v1'&&sameRef(a.finalAcceptanceRef,a.originalRootRef)&&final.decision==='ACCEPT_REVIEW_WITH_NAMED_DEBTS';
    const scoped=final.schemaVersion==='m2-s1-root-scoped-acceptance-v1'&&
      ['ACCEPT_SCOPED_AMENDMENT_REUSING_PRIOR_ADJUDICATION','ACCEPT_NARROW_EVIDENCE_BOUND_CORRECTION'].includes(final.decision)&&String(final.rootReviewer||'').trim();
    if((!direct&&!scoped)||final.examId!==original.examId||final.finalSourceBlob!==sourceRef.gitBlobSha1||
       (direct?final.finalFourSlotSha256:final.acceptedFourSlotSha256)!==nativeRef.sha256||
       (direct?final.reviewSha256:final.acceptedReviewSha256)!==a.semanticRef.sha256)fail('NATIVE_FINAL_ACCEPTANCE');
  } else {
    const before=reader.json(a.originalFourSlotRef),proposal=reader.json(a.proposalRef);
    if(original.finalFourSlotSha256!==a.originalFourSlotRef.sha256||original.reviewSha256!==a.semanticRef.sha256||
       final.schemaVersion!=='archive-m2s1-scoped-four-slot-rebind-independent-review-v1'||final.status!=='ACCEPTED'||
       final.proposalSha256!==a.proposalRef.sha256||final.newFullMathematicalReview!==false||final.newFullSemanticApproval!==false||
       final.newDifficultyApproval!==false||final.allExactOriginalAndRepairHashesVerified!==true||
       final.allCurrentQuotesAndDictionaryBindingsVerified!==true||final.allCurrentFingerprintBindingsVerified!==true||
       !Array.isArray(before.items)||before.items.length!==denominator||before.sourceArchiveFile!==native.sourceArchiveFile)fail('UNCHANGED_MEMBER_AUTHORITY');
    const row=unique(proposal.files,x=>x.examId===original.examId,'UNCHANGED_MEMBER_FILE');
    if(row.rawPath!==nativeRef.path||row.sha256!==nativeRef.sha256||row.items!==denominator||
       row.sourcePath!=='archive/exams/'+native.sourceArchiveFile||!Array.isArray(row.changedOrdinals)||
       row.changedOrdinals.includes(Number(item.sourceOrdinal)))fail('UNCHANGED_MEMBER_SCOPE');
    const oldItem=unique(before.items,x=>x.questionUid===item.questionUid&&Number(x.sourceOrdinal)===Number(item.sourceOrdinal),'UNCHANGED_MEMBER_ITEM');
    if(!eq(oldItem,item))fail('UNCHANGED_MEMBER_CHANGED');
    for(const ordinal of row.changedOrdinals) {
      const r=unique(final.rows,x=>x.examId===original.examId&&x.sourceOrdinal===ordinal,'UNCHANGED_MEMBER_REVIEW');
      if(r.amendedRawRef?.path!==nativeRef.path||r.amendedRawRef?.sha256!==nativeRef.sha256||
         r.originalNativeRef?.commit!==a.originalFourSlotRef.commit||r.originalNativeRef?.path!==a.originalFourSlotRef.path||
         r.originalNativeRef?.sha256!==a.originalFourSlotRef.sha256)fail('UNCHANGED_MEMBER_REVIEW_BINDING');
    }
    for(const old of before.items)if(!row.changedOrdinals.includes(Number(old.sourceOrdinal))) {
      const next=unique(native.items,x=>Number(x.sourceOrdinal)===Number(old.sourceOrdinal),'UNCHANGED_MEMBER_INVENTORY');
      if(!eq(old,next))fail('UNCHANGED_MEMBER_OTHER_CHANGE');
    }
  }
}
function ownChanges(before,after) {
  return [...new Set([...Object.keys(before),...Object.keys(after)])].sort().filter(k=>!eq(fields(before,[k]),fields(after,[k])))
    .map(field=>({field,beforeOwnSha256:sha(stable(fields(before,[field])[field])),afterOwnSha256:sha(stable(fields(after,[field])[field]))}));
}
function inlineEdits(edits,before,after,kind,priorProblemAssets,reader) {
  if(!Array.isArray(edits))fail('INLINE_EDITS');
  if(before.content===after.content&&own(before,'content')===own(after,'content')) {if(edits.length)fail('UNNEEDED_INLINE_EDITS');return;}
  if(typeof before.content!=='string'||typeof after.content!=='string'||!edits.length||edits.length>8)fail('INLINE_CONTENT');
  const b=Buffer.from(before.content),a=Buffer.from(after.content);let bi=0,ai=0;
  for(const e of edits) {
    exact(e,['kind','beforeInterval','afterInterval','beforeSha256','afterSha256','transcriptionAssetRef'],'INLINE_EDIT');
    if(e.kind!==kind||!['IMAGE_MARKUP_ONLY','ORIGINAL_IMAGE_PROCESS_TRANSCRIPTION'].includes(e.kind)||
       ![e.beforeInterval,e.afterInterval].every(x=>Array.isArray(x)&&x.length===2&&x.every(n=>Number.isSafeInteger(n)&&n>=0)))fail('INLINE_EDIT');
    const [bs,be]=e.beforeInterval,[as,ae]=e.afterInterval;
    if(bs<bi||be<bs||be>b.length||as<ai||ae<as||ae>a.length||!b.subarray(bi,bs).equals(a.subarray(ai,as))||
       sha(b.subarray(bs,be))!==e.beforeSha256||sha(a.subarray(as,ae))!==e.afterSha256)fail('INLINE_EDIT_BINDING');
    if(e.kind==='IMAGE_MARKUP_ONLY') {
      if(e.transcriptionAssetRef!==null)fail('INLINE_KIND_MIXED');
      // Only exact declared edit spans are inspected. No normalized question is
      // passed to an authority checker or used as a replacement source payload.
      // The reviewed E009 wrapper also contains an attribute-free line break.
      const markup=s=>/^(?:\s|<\/?(?:img|div)\b[^<>]*>|<br(?:[ \t\r\n]*\/)?>)*$/iu.test(s);
      if(!markup(b.subarray(bs,be).toString('utf8'))||!markup(a.subarray(as,ae).toString('utf8')))fail('INLINE_NON_IMAGE_MARKUP');
    } else {
      if(!priorProblemAssets.some(r=>sameRef(r,e.transcriptionAssetRef)))fail('TRANSCRIPTION_ORIGINAL_ASSET');
      reader.read(e.transcriptionAssetRef);
    }
    bi=be;ai=ae;
  }
  if(!b.subarray(bi).equals(a.subarray(ai)))fail('INLINE_UNDECLARED_REMAINDER');
}
function displayBinding(doc, prior, current, changes, surface, priorAssets, currentAssets) {
  const embedded=surface==='PROBLEM'&&own(doc,svg7EmbeddedChoices.OPTION);
  const allowed=surface==='PROBLEM'?[...PROBLEM,...(embedded?[svg7EmbeddedChoices.FIELD]:[])]:SOLUTION;
  return {questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,sourceQuestionNo:doc.sourceQuestionNo,
    sourceQuestionCount:doc.sourceQuestionCount,surface,priorSourceRef:doc.priorSourceRef,currentSourceRef:doc.currentSourceRef,
    priorQuestionSha256:sha(stable(prior)),currentQuestionSha256:sha(stable(current)),
    changedFields:changes.filter(r=>allowed.includes(r.field)),priorAssets,currentAssets,
    vectorSha256:doc.vectorSha256,priorMetadataSha256:doc.priorMetadataSha256,priorIdentitySha256:doc.priorIdentitySha256,
    inlineEdits:surface==='PROBLEM'?doc.inlineEdits:[],
    ...(embedded?{[svg7EmbeddedChoices.OPTION]:doc[svg7EmbeddedChoices.OPTION]}:{}),
    ...(surface==='PROBLEM'&&own(doc,svg7InlineFigure.OPTION)?{[svg7InlineFigure.OPTION]:doc[svg7InlineFigure.OPTION]}:{})};
}
function validateReview(reader, ref, binding) {
  const review=reader.json(ref);
  exact(review,['schemaVersion','scope','reviewer','decision','givenRef','originalObservationRef','currentObservationRef','phaseOrder',
    'newMathQa','newSemanticApproval','newFourSlotVector','records'],'DISPLAY_REVIEW');
  if(review.schemaVersion!==REVIEW_SCHEMA||review.scope!==SCOPE||review.decision!==DECISION||typeof review.reviewer!=='string'||
     !review.reviewer.trim()||review.phaseOrder!=='GIVEN_THEN_ORIGINAL_FREEZE_THEN_CURRENT'||review.newMathQa!==0||
     review.newSemanticApproval!==0||review.newFourSlotVector!==0||!Array.isArray(review.records)||!review.records.length)fail('DISPLAY_REVIEW');
  for(const k of ['givenRef','originalObservationRef','currentObservationRef'])reader.read(review[k]);
  if(new Set(['givenRef','originalObservationRef','currentObservationRef'].map(k=>review[k].sha256)).size!==3)fail('DISPLAY_PHASES');
  const seen=new Set();
  for(const r of review.records) {
    exact(r,['questionUid','sourceOrdinal','surface','bindingSha256','decision','contentEditKind'],'DISPLAY_REVIEW_ROW');
    const key=`${r.questionUid}:${r.sourceOrdinal}:${r.surface}`;
    if(!UID.test(r.questionUid)||!positive(r.sourceOrdinal)||!['PROBLEM','SOLUTION'].includes(r.surface)||seen.has(key)||
       r.decision!==DECISION||!SHA.test(r.bindingSha256)||!['NONE','IMAGE_MARKUP_ONLY','ORIGINAL_IMAGE_PROCESS_TRANSCRIPTION'].includes(r.contentEditKind))fail('DISPLAY_REVIEW_ROW');
    seen.add(key);
  }
  const row=unique(review.records,x=>x.questionUid===binding.questionUid&&x.sourceOrdinal===binding.sourceOrdinal&&x.surface===binding.surface,'DISPLAY_REVIEW_SELECTED');
  if(row.bindingSha256!==sha(stable(binding)))fail('DISPLAY_REVIEW_BINDING');
  return row;
}
function verifyUiCheckoutContinuity(reader, claim, {technical,questionUid,sourceOrdinal,surface,sourceRef,assetRefs}) {
  // Separate captures may use different actual checkouts. This named claim
  // joins only identical complete source/asset bytes; the original technical
  // and visual records are passed unchanged to the existing UI verifier.
  exact(claim,['schemaVersion','questionUid','sourceOrdinal','surface','capturedSourceRef','capturedAssetRefs',
    'currentSourceRef','currentAssetRefs'],'UI_CHECKOUT_CONTINUITY');
  if(claim.schemaVersion!=='archive-existing-vector-ui-checkout-continuity-v1'||claim.questionUid!==questionUid||
     claim.sourceOrdinal!==sourceOrdinal||claim.surface!==surface||!['PROBLEM','SOLUTION'].includes(surface)||
     !sameRef(claim.currentSourceRef,sourceRef)||!eq(claim.currentAssetRefs,assetRefs)||
     !object(claim.capturedSourceRef)||claim.capturedSourceRef.commit===sourceRef.commit||
     claim.capturedSourceRef.commit!==technical.checkoutCommit||!Array.isArray(claim.capturedAssetRefs)||
     claim.capturedAssetRefs.length!==assetRefs.length||!Array.isArray(technical.results))fail('UI_CHECKOUT_SCOPE');
  const captured=technical.results.filter(r=>r.questionUid===questionUid&&r.sourceOrdinal===sourceOrdinal&&r.surface===surface);
  if(captured.length!==(surface==='PROBLEM'?2:1)||captured.some(r=>!sameRef(r.sourceRef,claim.capturedSourceRef)||
     !eq(r.assetRefs,claim.capturedAssetRefs)))fail('UI_CHECKOUT_CAPTURE_BINDING');
  const sameBytes=(before,current)=>{
    if(!object(before)||before.commit!==technical.checkoutCommit||before.path!==current.path||
       before.gitBlobSha1!==current.gitBlobSha1||before.sha256!==current.sha256||before.bytes!==current.bytes)fail('UI_CHECKOUT_BYTES');
    const capturedRaw=reader.read(before),currentRaw=reader.read(current,true);
    if(!Buffer.isBuffer(capturedRaw)||!Buffer.isBuffer(currentRaw)||!capturedRaw.equals(currentRaw))fail('UI_CHECKOUT_BYTES');
  };
  sameBytes(claim.capturedSourceRef,sourceRef);
  for(let i=0;i<assetRefs.length;i++)sameBytes(claim.capturedAssetRefs[i],assetRefs[i]);
  return {sourceRef:claim.capturedSourceRef,assetRefs:claim.capturedAssetRefs};
}
function verify(root,entry,{d,it,id,cur,dict,bank,sourceRaw,identity,uidUses,loadBank,safe}) {
  originalSourceError.assertNotSubject({questionUid:id?.questionUid,source:d?.sourceArchiveFile,ordinal:cur?.ordinal});
  const doc=entry.doc,reader=entry.reader;
  exact(doc,['schemaVersion','scope','sourceArchiveFile','questionUid','sourceOrdinal','sourceQuestionNo','sourceQuestionCount',
    'priorRegistrationRef','priorCompactRef','currentCompactRef','dictionaryRef','nativeFourSlotRef','nativeSourceRef','priorSourceRef','currentSourceRef',
    'priorMetadataRef','priorIdentityRef','nativeAuthority','nativeAssets','priorAssets','currentAssets','vectorSha256','nativeItemSha256',
    'priorMetadataSha256','priorIdentitySha256','changedFields','displayReviews','inlineEdits','orphanIdentity',
    'newMathQa','newSemanticApproval','newFourSlotVector',...(own(doc,svg7EmbeddedChoices.OPTION)?[svg7EmbeddedChoices.OPTION]:[]),
    ...(own(doc,svg7InlineFigure.OPTION)?[svg7InlineFigure.OPTION]:[])],'INPUT');
  if(doc.schemaVersion!==SCHEMA||doc.scope!==SCOPE||!/^original\/middle\/m2\/1(?:mid|final)\/[^/]+\.js$/.test(doc.sourceArchiveFile)||
     doc.sourceArchiveFile!==d.sourceArchiveFile||doc.questionUid!==id.questionUid||doc.sourceOrdinal!==cur.ordinal||
     doc.sourceQuestionNo!==sourceIdentityNumber(cur.q)||!positive(doc.sourceQuestionCount)||doc.sourceQuestionCount!==bank.length||
     doc.newMathQa!==0||doc.newSemanticApproval!==0||doc.newFourSlotVector!==0||own(it,'registrationHold')||own(d,'scope'))fail('INPUT_SCOPE');
  if(sha(reader.local(entry.path))!==entry.sha256)fail('INPUT_CHANGED');
  for(const r of refsIn(doc))reader.read(r);
  if(doc.priorRegistrationRef.path!==INDEX||doc.priorMetadataRef.path!==MD||doc.priorIdentityRef.path!==ID||
     [doc.priorCompactRef,doc.priorSourceRef,doc.priorMetadataRef,doc.priorIdentityRef].some(r=>r.commit!==doc.priorRegistrationRef.commit))fail('PRIOR_SNAPSHOT_BINDING');
  ancestor(root,doc.priorRegistrationRef.commit,git(root,['rev-parse','HEAD']).toString().trim());
  ancestor(root,doc.priorRegistrationRef.commit,doc.currentSourceRef.commit);
  const sourcePath='archive/exams/'+d.sourceArchiveFile,compactPath='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json');
  if([doc.nativeSourceRef,doc.priorSourceRef,doc.currentSourceRef].some(r=>r.path!==sourcePath)||
     doc.priorCompactRef.path!==compactPath||doc.currentCompactRef.path!==compactPath||doc.dictionaryRef.path!==dict.path)fail('INPUT_PATH_BINDING');
  const priorIndex=reader.json(doc.priorRegistrationRef),priorCompact=reader.json(doc.priorCompactRef),currentCompact=reader.json(doc.currentCompactRef,true);
  if(priorIndex.schemaVersion!=='archive-item-4slot-runtime-v1'||priorIndex.authority!=='MAIN_MERGED_REVIEWED_COMPACT'||
     priorIndex.sourceMutation!==0||priorIndex.semanticApprovalMutation!==0||!eq(currentCompact,d)||!eq(priorCompact.items,d.items)||
     priorCompact.schemaVersion!=='archive-meta-4slot-compact-v1'||own(priorCompact,'scope'))fail('PRIOR_REGISTERED_INDEX');
  const oldFile=unique(priorIndex.files,f=>f.path===compactPath,'PRIOR_REGISTERED_FILE');
  const oldRow=unique(priorIndex.records,r=>r.questionUid===id.questionUid,'PRIOR_REGISTERED_ROW');
  if(oldRow.registrationStatus!=='REGISTERED'||oldRow.independentReviewClaim!==false||oldRow.sourceArchiveFile!==d.sourceArchiveFile||
     oldRow.sourceOrdinal!==cur.ordinal||oldRow.sourceQuestionNo!==doc.sourceQuestionNo||oldRow.sourceDisplayNumber!==it.ordinal||
     oldRow.compactPath!==compactPath||oldRow.dictionaryVersion!==d.dictionaryVersion||!eq(vector(oldRow),vector(it))||
     oldFile.compactSha256!==doc.priorCompactRef.sha256||oldFile.currentSourceBlobSha!==doc.priorSourceRef.gitBlobSha1||
     oldFile.itemCount!==bank.length||oldFile.dictionarySha256!==doc.dictionaryRef.sha256||
     (priorIndex.pending||[]).some(r=>r.path===compactPath&&(r.ordinal==null||r.ordinal===it.ordinal)))fail('PRIOR_REGISTERED_ROW');
  const normalized=structuredClone(d);
  if(own(normalized,'identityReconciliation'))normalized.identityReconciliation.sourceGitBlobSha=priorCompact.identityReconciliation?.sourceGitBlobSha;
  if(!eq(normalized,priorCompact)||!eq(oldFile.evidence,priorCompact.evidence)||!eq(oldFile.reviewedBy,priorCompact.reviewedBy))fail('COMPACT_CHANGED');
  const dictionary=reader.json(doc.dictionaryRef,true);
  if(doc.dictionaryRef.sha256!==dict.sha256||dictionary.dictionaryVersion!==d.dictionaryVersion||
     oldFile.sourceGitBlobSha!==d.sourceGitBlobSha||!Array.isArray(dictionary.terms))fail('DICTIONARY_BINDING');
  const native=reader.json(doc.nativeFourSlotRef), nativeBank=loadBank(reader.read(doc.nativeSourceRef)),priorBank=loadBank(reader.read(doc.priorSourceRef));
  const currentBank=loadBank(reader.read(doc.currentSourceRef,true));
  if(!reader.read(doc.currentSourceRef).equals(sourceRaw)||!eq(currentBank,bank)||
     nativeBank.length!==bank.length||priorBank.length!==bank.length||!Array.isArray(native.items)||native.items.length!==bank.length||
     native.schemaVersion!=='archive-meta-4slot-v0'||native.sourceArchiveFile!==d.sourceArchiveFile||native.sourceGitBlobSha!==d.sourceGitBlobSha||
     native.sourceGitBlobSha!==doc.nativeSourceRef.gitBlobSha1||native.dictionaryVersion!==d.dictionaryVersion||
     d.evidence.commit!==doc.nativeFourSlotRef.commit||d.evidence.path!==doc.nativeFourSlotRef.path)fail('NATIVE_FULL_DENOMINATOR');
  const nativeMap=sourceMap(nativeBank),priorMap=sourceMap(priorBank),currentMap=sourceMap(bank),n=nativeMap[cur.ordinal-1],p=priorMap[cur.ordinal-1];
  if(!eq(nativeMap.map(x=>[x.sourceOrdinal,x.sourceQuestionNo,x.displayNumber]),currentMap.map(x=>[x.sourceOrdinal,x.sourceQuestionNo,x.displayNumber]))||
     !eq(priorMap.map(x=>[x.sourceOrdinal,x.sourceQuestionNo,x.displayNumber]),currentMap.map(x=>[x.sourceOrdinal,x.sourceQuestionNo,x.displayNumber]))||
     !eq(fields(n.q,STUDENT),fields(p.q,STUDENT)))fail('NATIVE_PRIOR_STUDENT_BINDING');
  const nativeItem=unique(native.items,x=>x.questionUid===id.questionUid&&Number(x.sourceOrdinal)===it.ordinal,'NATIVE_ITEM');
  if(sha(stable(nativeItem))!==doc.nativeItemSha256||sha(stable(vector(it)))!==doc.vectorSha256)fail('VECTOR_HASH');
  const lut=buildLookup(dictionary);for(const term of dictionary.terms)lut.set('#'+term.id,term);
  const lookup=new Map(nativeMap.map(x=>[String(x.displayNumber),{ordinal:x.displayNumber}]));
  const seenNative=new Set();
  for(const row of native.items) {
    if(seenNative.has(String(row.sourceOrdinal)))fail('NATIVE_ITEM_DUPLICATE');seenNative.add(String(row.sourceOrdinal));
    const compact=unique(priorCompact.items,x=>x.ordinal===Number(row.sourceOrdinal),'NATIVE_COMPACT_INVENTORY');
    if(!eq(vector(compactItem(row,lut,lookup)),vector(compact)))fail('NATIVE_DICTIONARY_VECTOR');
  }
  validateNativeAuthority(reader,doc.nativeAuthority,doc.nativeFourSlotRef,native,nativeItem,doc.nativeSourceRef,bank.length);
  const oldMetadata=reader.json(doc.priorMetadataRef),oldIdentity=reader.json(doc.priorIdentityRef),metadata=reader.localJson(MD);
  reader.assertIdentity(identity);
  const md=unique(metadata.records,x=>x.questionUid===id.questionUid,'CURRENT_METADATA_ROW');
  const oldMd=unique(oldMetadata.records,x=>x.questionUid===id.questionUid,'PRIOR_METADATA_ROW');
  const oldId=unique(oldIdentity.records,x=>x.questionUid===id.questionUid,'PRIOR_IDENTITY_ROW');
  if(!eq(oldMd,md)||!eq(oldId,id)||doc.priorMetadataSha256!==sha(stable(oldMd))||doc.priorIdentitySha256!==sha(stable(oldId)))fail('METADATA_IDENTITY_CHANGED');
  const tuple=r=>[r.questionUid,r.sourceOrdinal,String(r.sourceQuestionNo),fields(r,['status']).status];
  const oldTuples=oldIdentity.records.filter(x=>x.sourceArchiveFile===d.sourceArchiveFile).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
  const newTuples=identity.records.filter(x=>x.sourceArchiveFile===d.sourceArchiveFile).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
  if(oldTuples.length!==bank.length||newTuples.length!==bank.length||!eq(oldTuples.map(tuple),newTuples.map(tuple))||
     newTuples.some((x,i)=>x.sourceOrdinal!==i+1||(own(x,'status')&&x.status!=='VERIFIED')||uidUses.get(x.questionUid)!==1||String(x.sourceQuestionNo)!==sourceIdentityNumber(bank[i])))fail('FULL_UID_INVENTORY');
  inventory(reader,doc.nativeAssets,n.q,doc.nativeSourceRef.commit);
  inventory(reader,doc.priorAssets,p.q,doc.priorSourceRef.commit);
  inventory(reader,doc.currentAssets,cur.q,doc.currentSourceRef.commit,true);
  if(!eq(withoutCommit(doc.nativeAssets),withoutCommit(doc.priorAssets)))fail('NATIVE_PRIOR_ASSET_BYTES');
  const embedded=own(doc,svg7EmbeddedChoices.OPTION)?svg7EmbeddedChoices.verify({claim:doc[svg7EmbeddedChoices.OPTION],
    questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,boundState:svg7EmbeddedChoices.state(n.q,p.q,cur.q),
    nativeSourceRef:doc.nativeSourceRef,priorSourceRef:doc.priorSourceRef,currentSourceRef:doc.currentSourceRef,
    priorProblemAssets:doc.priorAssets.filter(r=>sourceRefs(p.q,PROBLEM_ASSETS).includes(r.path)),
    currentProblemAssets:doc.currentAssets.filter(r=>sourceRefs(cur.q,PROBLEM_ASSETS).includes(r.path)),
    readRef:ref=>reader.read(ref),readLiveRef:ref=>reader.read(ref,true)}):null;
  const inlineFigure=own(doc,svg7InlineFigure.OPTION)?svg7InlineFigure.verify({claim:doc[svg7InlineFigure.OPTION],
    questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,boundState:svg7InlineFigure.state(n.q,p.q,cur.q),
    nativeSourceRef:doc.nativeSourceRef,priorSourceRef:doc.priorSourceRef,currentSourceRef:doc.currentSourceRef,
    priorProblemAssets:doc.priorAssets.filter(r=>sourceRefs(p.q,PROBLEM_ASSETS).includes(r.path)),
    currentProblemAssets:doc.currentAssets.filter(r=>sourceRefs(cur.q,PROBLEM_ASSETS).includes(r.path)),
    readRef:ref=>reader.read(ref),readLiveRef:ref=>reader.read(ref,true)}):null;
  const changes=ownChanges(p.q,cur.q);
  if(!changes.length||!eq(changes,doc.changedFields)||changes.some(c=>![...PROBLEM,...SOLUTION].includes(c.field)&&
    !(embedded&&c.field===svg7EmbeddedChoices.FIELD)))fail('UNREVIEWABLE_FIELD_CHANGE');
  if(embedded&&!changes.some(c=>c.field===svg7EmbeddedChoices.FIELD))fail('UNNEEDED_EMBEDDED_CHOICE_CLAIM');
  const surfaces=['PROBLEM','SOLUTION'].filter(s=>changes.some(c=>(s==='PROBLEM'?PROBLEM:SOLUTION).includes(c.field)||
    s==='PROBLEM'&&embedded&&c.field===svg7EmbeddedChoices.FIELD));
  if(!Array.isArray(doc.displayReviews)||!eq(doc.displayReviews.map(r=>r.surface).sort(),surfaces.slice().sort()))fail('DISPLAY_SURFACE_INVENTORY');
  let inlineKind='NONE',uiCases=0,uiTiles=0;
  for(const surface of surfaces) {
    const review=unique(doc.displayReviews,x=>x.surface===surface,'DISPLAY_SURFACE');
    const continuedCheckout=own(review,'uiCheckoutContinuity'),originalTextFigure=own(review,'originalTextSolutionFigure');
    exact(review,['surface','independentRef','technicalRef','visualRef',...(continuedCheckout?['uiCheckoutContinuity']:[]),
      ...(originalTextFigure?['originalTextSolutionFigure']:[])],'DISPLAY_REFS');
    const keys=surface==='PROBLEM'?PROBLEM_ASSETS:SOLUTION_ASSETS;
    const oldPaths=new Set(sourceRefs(p.q,keys)),newPaths=new Set(sourceRefs(cur.q,keys));
    const surfaceRefs=(all,paths)=>{const map=new Map(all.map(r=>[r.path,r])),pending=[...paths],seen=new Set();while(pending.length){const p=pending.shift();if(seen.has(p))continue;seen.add(p);const r=map.get(p);if(!r)fail('SURFACE_ASSET');pending.push(...nestedAssets(reader.read(r),p));}return all.filter(r=>seen.has(r.path));};
    const priorAssets=surfaceRefs(doc.priorAssets,oldPaths),currentAssets=surfaceRefs(doc.currentAssets,newPaths);
    const binding=displayBinding(doc,p.q,cur.q,changes,surface,priorAssets,currentAssets);
    if(originalTextFigure)verifyOriginalTextSolutionFigure({claim:review.originalTextSolutionFigure,binding,
      priorQuestion:p.q,currentQuestion:cur.q,nativeItemSha256:doc.nativeItemSha256});
    else if((!priorAssets.length&&!(inlineFigure&&surface==='PROBLEM'))||!currentAssets.length)fail('DISPLAY_ASSET_REQUIRED');
    const row=validateReview(reader,review.independentRef,binding);
    if(surface==='PROBLEM')inlineKind=row.contentEditKind;
    else if(row.contentEditKind!=='NONE')fail('SOLUTION_CONTENT_EDIT');
    const technical=reader.json(review.technicalRef),visual=reader.json(review.visualRef);
    const currentUi={sourceRef:doc.currentSourceRef,assetRefs:currentAssets};
    const capturedUi=continuedCheckout?verifyUiCheckoutContinuity(reader,review.uiCheckoutContinuity,
      {technical,questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,surface,...currentUi}):currentUi;
    const ui=verifyUi({technical,visual,technicalRef:review.technicalRef,readRef:ref=>reader.read(ref),readLiveRef:ref=>reader.read(ref,true),
      questionUid:doc.questionUid,sourceOrdinal:doc.sourceOrdinal,surface,...capturedUi});
    uiCases+=ui.logicalCases;uiTiles+=ui.originalTiles;
  }
  if(changes.some(c=>c.field==='content')===(inlineKind==='NONE'))fail('CONTENT_REVIEW_KIND');
  const priorProblem=doc.priorAssets.filter(r=>sourceRefs(p.q,PROBLEM_ASSETS).includes(r.path));
  inlineEdits(doc.inlineEdits,p.q,cur.q,inlineKind,priorProblem,reader);
  let orphan=false;
  if(cur.q.questionUid&&cur.q.questionUid!==id.questionUid) {
    const o=doc.orphanIdentity,rec=d.identityReconciliation,oldRec=priorCompact.identityReconciliation;
    exact(o,['schemaVersion','embeddedQuestionUid','questionUid','sourceOrdinal','sourceQuestionNo','historicalFingerprint','currentFingerprint'],'ORPHAN_PROOF');
    const beforeProof=unique(oldRec?.records,x=>x.sourceOrdinal===cur.ordinal,'ORPHAN_PRIOR_PROOF');
    const currentProof=unique(rec?.records,x=>x.sourceOrdinal===cur.ordinal,'ORPHAN_CURRENT_PROOF');
    if(o.schemaVersion!=='archive-existing-registered-orphan-uid-display-continuity-v1'||oldRow.sourceUidBinding!=='VERIFIED_ORPHAN_UID_RECONCILIATION'||
       oldRec.schemaVersion!=='4slot-orphan-uid-reconciliation-v1'||rec.schemaVersion!==oldRec.schemaVersion||oldRec.sourceGitBlobSha!==doc.priorSourceRef.gitBlobSha1||
       rec.sourceGitBlobSha!==doc.currentSourceRef.gitBlobSha1||!eq(beforeProof,currentProof)||
       p.q.questionUid!==cur.q.questionUid||n.q.questionUid!==cur.q.questionUid||uidUses.has(cur.q.questionUid)||
       o.embeddedQuestionUid!==cur.q.questionUid||o.questionUid!==id.questionUid||o.sourceOrdinal!==cur.ordinal||o.sourceQuestionNo!==sourceIdentityNumber(cur.q)||
       beforeProof.embeddedQuestionUid!==o.embeddedQuestionUid||beforeProof.questionUid!==o.questionUid||beforeProof.sourceQuestionNo!==o.sourceQuestionNo||
       o.historicalFingerprint!==identityHash(p.q)||o.historicalFingerprint!==oldId.sourceFingerprint||beforeProof.sourceFingerprint!==o.historicalFingerprint||
       o.currentFingerprint!==identityHash(cur.q))fail('ORPHAN_CONTINUITY');
    orphan=true;
  } else if(doc.orphanIdentity!==null)fail('UNNEEDED_ORPHAN_PROOF');
  return {status:'PASS',questionUid:id.questionUid,sourceOrdinal:cur.ordinal,orphanIdentity:orphan,
    logicalUiCases:uiCases,originalUiTiles:uiTiles,observed:[...reader.observed],
    ref:{path:entry.path,sha256:entry.sha256},approvalEffect:SCOPE,newFourSlotVector:0,newSemanticApproval:0,
    ...(embedded?{svg7EmbeddedChoiceContinuity:embedded}:{}),...(inlineFigure?{svg7InlineFigureContinuity:inlineFigure}:{})};
}
module.exports={DIR,SCHEMA,SCOPE,REVIEW_SCHEMA,collect,verify,verifyUiCheckoutContinuity,displayBinding,ownChanges,fields,vector,stable,sha,identityHash};
