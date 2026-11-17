import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import ui from '../../../tools/4slot/existing-registered-vector-ui.cjs';

export const E023_SOLUTION_DISPLAY_SCHEMA = 'archive-m2-e023-solution-display6-continuity-v1';
export const E023_SOLUTION_DISPLAY_BINDING_SCHEMA = 'archive-m2-e023-solution-display6-binding-v1';
export const E023_SOLUTION_DISPLAY_SOURCE = 'original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js';
export const E023_SOLUTION_DISPLAY_FIELDS = Object.freeze(['solutionImage','solutionImageAlt','solutionImageCaption']);
export const E023_SOLUTION_DISPLAY_SCOPE = Object.freeze([
  [4,'qid_v1_848012b5f539fa1f58a6358ff0c5aaea032b0acc9c134b9f91cba0b749a1e303','efe999e3e1377497a5ed98daa1c0f432efea9df8301cec9b33a9971674f39932'],
  [5,'qid_v1_8b5f4eefcea6be04066923235f2898bf46c052a4994adbd1161554f69511b5e4','9093d79fdcc78c108d5d9b56bbaefdacf22accff2028e747a374cc20606bf448'],
  [6,'qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758','db3c4611f9a7a2804e2c63dd6ce90c0273e5351404dd3ed20b787959c657cc50'],
  [8,'qid_v1_ac6ea5f6d4266e383b7db2063dbeb68348852d5420e02746ba76e62781138ede','86dda94f73ee282619b34ab16721c708d10844c7cb900206f35da1117bb818c7'],
  [10,'qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9','59918ae28343619e565faac2198af9114431edef30bf1f415c3b3c4353aab9d9'],
  [19,'qid_v1_3cd4b66acdc9f4b61132f18d6577c7cc9166137ad5135988bb892f15d3b94643','c4823d53747eb05d1c491b113d313a5d09118d8403f25f509c0a9030f4cb869d'],
].map(([sourceOrdinal,questionUid,nativeItemSha256]) => Object.freeze({sourceOrdinal,questionUid,nativeItemSha256})));

const KEY = 'e023SolutionDisplayContinuity', PUBLIC_KEY = 'm2ProblemRenderer21Continuity';
const BASE_KEYS = ['schemaVersion','reviewCommit','reviewPath','reviewRef'];
const SOURCE_PATH = 'archive/exams/' + E023_SOLUTION_DISPLAY_SOURCE;
const COUNT = 24, SCOPE = 'EXACT_E023_SOLUTION_DISPLAY6_ONLY';
const STATIC_SCHEMA = 'archive-e023-original-first-solution-display6-static-v1';
const STATIC_DECISION = 'ACCEPT_EXISTING_SOLUTION_DISPLAY_CONTINUITY';
const PHASES = Object.freeze({
  nativeDisplayBindingSha256:'935b76167bcd82c2b079002c02d4eaeacf53bc21770bb8523594949dfa27c969',
  expectedFreezeSha256:'94669b65f4e1b63376e2524fc24255ff111e0fecc78a687c6c60d514024e0469',
  observedComparisonSha256:'474adaed537bfa31482790ae12915dcad772d21217467b78f9da2b6e25084129',
});
const NATIVE_REF = Object.freeze({
  commit:'c28641f67d91bfb27352b11faaef4552f46c45be',
  path:'archive/data/meta-review/m2-s2-20261114/exams/E023/review.json',
  gitBlobSha1:'eb54e18c3146e611f20018859e48bdb3e74cf970',
  sha256:'7da03aa90ef0e8e7f363dab0e8dc482291683471a6087cde27c650fa4abc6e07',bytes:118816,
});
const NATIVE_SOURCE_BLOB = '0a6f06b0d702264ca13e27d4280b727199cfaafc';
const NATIVE_SOURCE_SHA = '5e97d4fcea1a919e49a50ae655ee7c288b7a23a1656189a57b8aa1a9543f7e0c';
const NATIVE_BASE = 'ed83f05220b64f75cbbd5de360a68dd6ddaadd22';
// The separately authored public projection binds the original-first review.
// An unsigned preparation file or a self-claimed reviewer is not authority.
const STATIC_REF = Object.freeze({
  commit:'1244785eb4889e9c6a6ebdbca3b57c5e9ef53a67',
  path:'docs/operations/m2-s2-e023-solution-display6-continuity-20261116/independent-static-v1.json',
  gitBlobSha1:'245578b48da7b0cc0a5c3a4e0048e7e2590080a5',
  sha256:'458cbdde5842e97dc8f542fe03d74da36ab4c1bde95d2b1e8e274c7e6a109be7',bytes:17215,
});
const TECHNICAL_REF = Object.freeze({
  commit:'6d011ffd05eb2581c41a4119121cdc0009dcfc99',
  path:'docs/operations/m2-s2-e023-solution-ui-20261116/student-ui-technical-r4.json',
  gitBlobSha1:'b0829009e77805a070e6771939b5efa98ce1cec2',
  sha256:'2059ecf6f667676bbd07a1b04e3928ed219ba578dd3a6c7ceb33bc1d04b408ed',bytes:22874,
});
const VISUAL_REF = Object.freeze({
  commit:'4c7227ba795225da1d389f6852793bbe0f1bf54c',
  path:'docs/operations/m2-s2-e023-solution-ui-20261116/student-ui-independent-r4.json',
  gitBlobSha1:'968135fc29dfa64d3c9b3300c9e8b6eeb0ab599f',
  sha256:'82934951f72d9b35c4ba785c3fd1eda35daddc2cba4e0de6450b2450bea1ba20',bytes:4824,
});
const REF_KEYS = ['commit','path','gitBlobSha1','sha256','bytes'];
const SHA = /^[a-f0-9]{64}$/, OID = /^[a-f0-9]{40}$/;
const stable = value => JSON.stringify(value,(_,v) => v && typeof v==='object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k,v[k]])) : v);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const equal = (a,b) => stable(a)===stable(b);
const own = (o,k) => Object.hasOwn(o || {},k);
const prop = (o,k) => own(o,k) ? {present:true,value:o[k]} : {present:false};
const projection = q => Object.fromEntries(E023_SOLUTION_DISPLAY_FIELDS.map(k => [k,prop(q,k)]));
const fieldHash = (q,k) => own(q,k) ? {present:true,valueSha256:sha(stable(q[k]))} : {present:false};
const blobOid = b => crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex');
function fail(code) { throw Error('E023_SOLUTION_DISPLAY_CONTINUITY:' + code); }
function exact(value,keys,code) {
  if (!value || typeof value!=='object' || Array.isArray(value) || !equal(Object.keys(value).sort(),keys.slice().sort())) fail(code);
}
function safe(root,p) {
  if (typeof p!=='string' || !p || p.includes('\\') || /[\x00-\x1f\x7f]/.test(p) || path.isAbsolute(p) ||
      p.split('/').some(part => !part || part==='.' || part==='..')) fail('UNSAFE_PATH');
  const base=path.resolve(root),full=path.resolve(base,p);
  for (let at=full;at!==base;at=path.dirname(at))
    if (fs.existsSync(at) && fs.lstatSync(at).isSymbolicLink()) fail('SYMLINK');
  return full;
}
function readLive(root,p) {
  try { return fs.readFileSync(safe(root,p)); } catch(error) {
    if (String(error.message).startsWith('E023_SOLUTION_DISPLAY_CONTINUITY:')) throw error;
    fail('LIVE_INPUT_MISSING');
  }
}
function immutableReader(root) {
  // Cache only inside one invocation. Every invocation rechecks its live files.
  const cache=new Map();
  const git=(...args) => {
    try { return execFileSync('git',args,{cwd:root,maxBuffer:16*1024*1024,
      stdio:['ignore','pipe','pipe'],env:{...process.env,GIT_NO_LAZY_FETCH:'1'}}); }
    catch { fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE'); }
  };
  return ref => {
    exact(ref,REF_KEYS,'REF_KEYS'); safe(root,ref.path);
    if (!OID.test(ref.commit) || !OID.test(ref.gitBlobSha1) || !SHA.test(ref.sha256) ||
        !Number.isSafeInteger(ref.bytes) || ref.bytes<1) fail('REF');
    const key=stable(ref);
    if (cache.has(key)) return cache.get(key);
    const commit=git('cat-file','commit',ref.commit).toString('utf8');
    const tree=/^tree ([a-f0-9]{40})$/m.exec(commit)?.[1];
    if (!tree || git('ls-tree','-z',tree,'--',ref.path).toString('utf8')!==`100644 blob ${ref.gitBlobSha1}\t${ref.path}\0`) fail('REF_COMMIT_PATH_MODE');
    const bytes=git('cat-file','blob',ref.gitBlobSha1);
    if (blobOid(bytes)!==ref.gitBlobSha1 || bytes.length!==ref.bytes || sha(bytes)!==ref.sha256) fail('REF_BYTES');
    cache.set(key,bytes); return bytes;
  };
}
function json(bytes) { try { return JSON.parse(bytes); } catch { fail('JSON'); } }
function boundRef(ref) {
  exact(ref,['path','sha256'],'BOUND_REF_KEYS');
  if (!SHA.test(ref.sha256 || '')) fail('BOUND_REF');
}
function optIn(value) {
  exact(value,['schemaVersion','reviewCommit','reviewRef'],'OPT_IN_KEYS');
  if (typeof value.schemaVersion!=='string' || !value.schemaVersion || !OID.test(value.reviewCommit || '')) fail('OPT_IN');
  boundRef(value.reviewRef);
}
function sameBytesRef(a,b) {
  return equal(REF_KEYS.filter(k => k!=='commit').map(k => a?.[k]),REF_KEYS.filter(k => k!=='commit').map(k => b?.[k]));
}
function solutionPaths(question) {
  const strings=[];
  const visit=v => { if (typeof v==='string') strings.push(v);
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v==='object') Object.values(v).forEach(visit); };
  for (const [key,value] of Object.entries(question)) if (/^solution/.test(key)) visit(value);
  return [...new Set(strings.flatMap(s => [...s.matchAll(/(?:archive\/)?assets\/images\/[^\s"'<>\\]+\.(?:svg|png|jpe?g|gif|webp)/gi)]
    .map(m => m[0].startsWith('archive/') ? m[0] : 'archive/'+m[0])))].sort();
}
function exactAssetInventory(question,refs,commit,readRef,root,live) {
  if (!Array.isArray(refs) || refs.length!==1 || !equal(refs.map(r=>r.path),solutionPaths(question)) ||
      refs.some(r=>r.commit!==commit)) fail('COMPLETE_SOLUTION_ASSET_INVENTORY');
  for (const ref of refs) {
    const bytes=readRef(ref);
    if (live && !readLive(root,ref.path).equals(bytes)) fail('LIVE_SOLUTION_ASSET_BYTES');
  }
}

// A pure exact comparison, never an authority. The production entry supplies a
// row from the separately signed, immutable six-item static projection.
export function verifyE023OwnedDisplayTransition({original,prior,reviewed,current,transition}) {
  exact(transition,['beforeDisplaySha256','afterDisplaySha256','fieldTransitions'],'TRANSITION_KEYS');
  if (!SHA.test(transition.beforeDisplaySha256 || '') || !SHA.test(transition.afterDisplaySha256 || '') ||
      !Array.isArray(transition.fieldTransitions) || transition.fieldTransitions.length!==3) fail('TRANSITION');
  for (const [i,key] of E023_SOLUTION_DISPLAY_FIELDS.entries()) {
    const t=transition.fieldTransitions[i]; exact(t,['field','before','after'],'FIELD_TRANSITION_KEYS');
    if (t.field!==key) fail('EXACT_THREE_FIELDS');
    for (const [side,question] of [['before',original],['after',current]]) {
      const value=t[side];
      exact(value,value?.present===true ? ['present','valueSha256'] : ['present'],'OWN_PRESENCE_KEYS');
      if (typeof value.present!=='boolean' ||
          (own(question,key) && (typeof question[key]!=='string' || !question[key].trim())) ||
          !equal(value,fieldHash(question,key))) fail('OWN_PRESENCE_OR_VALUE');
    }
  }
  if (!equal(projection(original),projection(prior)) || !equal(projection(reviewed),projection(current)) ||
      sha(stable(projection(original)))!==transition.beforeDisplaySha256 ||
      sha(stable(projection(current)))!==transition.afterDisplaySha256) fail('EXACT_DISPLAY_TRANSITION');
  // The separate display review cannot replace an explanation or answer. Keep
  // own-property presence exact even where ordinary fingerprint projections use null.
  for (const key of ['answer','solution']) for (const question of [prior,reviewed,current])
    if (!equal(prop(original,key),prop(question,key))) fail('ANSWER_OR_SOLUTION_BODY_CHANGED');
  return {
    beforeDisplaySha256:transition.beforeDisplaySha256,afterDisplaySha256:transition.afterDisplaySha256,
    fieldTransitions:JSON.parse(stable(transition.fieldTransitions)),
  };
}

// The shared verifier retains its existing coverage/font/independent-review
// checks. This wrapper additionally closes the inventory to these six solutions.
export function verifyE023SolutionUi(args) {
  const wanted=E023_SOLUTION_DISPLAY_SCOPE.map(({questionUid,sourceOrdinal})=>({questionUid,sourceOrdinal,surface:'SOLUTION'}));
  const shape=rows=>Array.isArray(rows) ? rows.map(({questionUid,sourceOrdinal,surface})=>({questionUid,sourceOrdinal,surface})) : null;
  if (args.surface!=='SOLUTION' || !E023_SOLUTION_DISPLAY_SCOPE.some(s=>s.questionUid===args.questionUid && s.sourceOrdinal===args.sourceOrdinal) ||
      args.technical?.expectedLogicalCases!==6 || args.technical?.completedLogicalCases!==6 ||
      !equal(shape(args.technical?.results),wanted) || !equal(shape(args.visual?.records),wanted)) fail('EXACT_SOLUTION_UI_SIX');
  return ui.verifyUi(args);
}

export function validateM2E023SolutionDisplayContinuity({root,request,patch,native,row,question,bankFromBytes}) {
  if (!own(patch?.sourceReview,KEY)) return null;
  const spec=patch.sourceReview[KEY]; optIn(spec);
  const withPublic=own(patch.sourceReview,PUBLIC_KEY);
  exact(patch.sourceReview,[...BASE_KEYS,KEY,...(withPublic?[PUBLIC_KEY]:[])],'CLOSED_SOURCE_REVIEW');
  if (withPublic) {
    optIn(patch.sourceReview[PUBLIC_KEY]);
    if (patch.sourceReview[PUBLIC_KEY].schemaVersion!=='archive-reviewed-m2-problem21-continuity-v1') fail('PUBLIC_OPT_IN_SCHEMA');
  }
  const selected=E023_SOLUTION_DISPLAY_SCOPE.find(s=>s.questionUid===patch.questionUid && s.sourceOrdinal===patch.sourceOrdinal);
  if (spec.schemaVersion!==E023_SOLUTION_DISPLAY_SCHEMA || !selected || request.scope!=='PARTIAL_UIDS' ||
      request.approval?.type!=='FINAL_QA' || request.approval.metadataReviewed!==true ||
      own(request.approval,'sourceRebind') || own(request,'registrationMode') || own(patch,'rebind') ||
      !Array.isArray(request.registryChanges) || request.registryChanges.length!==0 ||
      request.sourceArchiveFile!==E023_SOLUTION_DISPLAY_SOURCE || request.expectedQuestionCount!==COUNT) fail('EXCLUSIVE_UID_SCOPE');
  if (patch.sourceReview.schemaVersion!=='archive-reviewed-source-reassessment-v1' ||
      patch.sourceReview.reviewCommit!==NATIVE_REF.commit || patch.sourceReview.reviewPath!==NATIVE_REF.path ||
      patch.sourceReview.reviewRef?.sha256!==NATIVE_REF.sha256 || native?.review?.schemaVersion!=='m2-s2-meta-review-v1' ||
      native.spec?.reviewCommit!==NATIVE_REF.commit || native.spec?.reviewPath!==NATIVE_REF.path ||
      native.spec?.reviewRef?.sha256!==NATIVE_REF.sha256 || native.sourceBlob!==NATIVE_SOURCE_BLOB ||
      native.committedBlob!==NATIVE_SOURCE_BLOB || native.sourceSha256!==NATIVE_SOURCE_SHA ||
      sha(stable(row))!==selected.nativeItemSha256) fail('ORIGINAL_NATIVE_AUTHORITY');
  boundRef(spec.reviewRef);
  if (![request.approval.evidenceRefs,patch.evidenceRefs].every(refs=>Array.isArray(refs) && refs.some(r=>equal(r,spec.reviewRef)))) fail('BINDING_EVIDENCE');
  const readRef=immutableReader(root),local=readLive(root,spec.reviewRef.path);
  if (sha(local)!==spec.reviewRef.sha256) fail('LOCAL_BINDING_BYTES');
  readRef({commit:spec.reviewCommit,path:spec.reviewRef.path,gitBlobSha1:blobOid(local),sha256:spec.reviewRef.sha256,bytes:local.length});
  const d=json(local);
  exact(d,['schemaVersion','scope','sourceArchiveFile','expectedQuestionCount','nativeReviewRef','staticReviewRef',
    'currentSourceRef','rows','studentUiTechnicalRef','studentUiVisualRef','newMathematicalQa','newMetadataApprovals'],'BINDING_KEYS');
  if (d.schemaVersion!==E023_SOLUTION_DISPLAY_BINDING_SCHEMA || d.scope!==SCOPE ||
      d.sourceArchiveFile!==E023_SOLUTION_DISPLAY_SOURCE || d.expectedQuestionCount!==COUNT ||
      d.newMathematicalQa!==false || d.newMetadataApprovals!==0 || !equal(d.nativeReviewRef,NATIVE_REF)) fail('BINDING_SCOPE');
  if (!STATIC_REF || !equal(d.staticReviewRef,STATIC_REF)) fail('EXACT_STATIC_AUTHORITY');
  if (!equal(d.studentUiTechnicalRef,TECHNICAL_REF) || !equal(d.studentUiVisualRef,VISUAL_REF)) fail('EXACT_ACTUAL_UI_AUTHORITY');
  const originalReview=json(readRef(d.nativeReviewRef));
  if (!equal(originalReview,native.review) || !Array.isArray(originalReview.items) || originalReview.items.length!==COUNT ||
      !Array.isArray(d.rows) || d.rows.length!==6) fail('ORIGINAL_NATIVE_CONTEXT');
  const staticReview=json(readRef(d.staticReviewRef));
  exact(staticReview,['schemaVersion','scope','producer','reviewer',...Object.keys(PHASES),'expectedBeforeCurrentInspection',
    'nativeReviewRef','nativeReviewedSourceRef','nativeCommittedSourceRef','priorDisplaySourceRef','reviewedCurrentSourceRef','rows',
    'actualUi','newMathematicalQa','newNativeApprovals','newReview2Claims','newDifficultyJudgments'],'STATIC_KEYS');
  if (staticReview.schemaVersion!==STATIC_SCHEMA || staticReview.scope!==SCOPE ||
      staticReview.producer!=='GPT_REGISTRAR_REPAIR' || staticReview.reviewer!=='GPT_ROOT_C8F1B0BFB4FA' ||
      staticReview.reviewer===native.reviewer || staticReview.expectedBeforeCurrentInspection!==true ||
      staticReview.actualUi!=='REQUIRED_SEPARATE_EVIDENCE' || staticReview.newMathematicalQa!==false ||
      staticReview.newNativeApprovals!==0 || staticReview.newReview2Claims!==0 || staticReview.newDifficultyJudgments!==0 ||
      Object.entries(PHASES).some(([k,v])=>staticReview[k]!==v) || !equal(staticReview.nativeReviewRef,NATIVE_REF) ||
      !Array.isArray(staticReview.rows) || staticReview.rows.length!==6) fail('ORIGINAL_FIRST_STATIC_AUTHORITY');
  const a=staticReview.nativeReviewedSourceRef,b=staticReview.nativeCommittedSourceRef;
  if (a.commit!==NATIVE_BASE || b.commit!==NATIVE_REF.commit || [a,b].some(r=>r.path!==SOURCE_PATH ||
      r.gitBlobSha1!==NATIVE_SOURCE_BLOB || r.sha256!==NATIVE_SOURCE_SHA) ||
      [staticReview.priorDisplaySourceRef,staticReview.reviewedCurrentSourceRef,d.currentSourceRef].some(r=>r.path!==SOURCE_PATH)) fail('SOURCE_AUTHORITY_REFS');
  const originalBank=bankFromBytes(readRef(a)),committedBank=bankFromBytes(readRef(b));
  const priorBank=bankFromBytes(readRef(staticReview.priorDisplaySourceRef));
  const reviewedBank=bankFromBytes(readRef(staticReview.reviewedCurrentSourceRef));
  const currentBytes=readRef(d.currentSourceRef),currentBank=bankFromBytes(currentBytes);
  if ([originalBank,committedBank,priorBank,reviewedBank,currentBank].some(qs=>!Array.isArray(qs)||qs.length!==COUNT) ||
      !equal(native.reviewedBank,originalBank) || !equal(native.committedBank,committedBank) ||
      !equal(currentBank[patch.sourceOrdinal-1],question) || !readLive(root,SOURCE_PATH).equals(currentBytes) ||
      request.expectedSourceBlobSha1!==d.currentSourceRef.gitBlobSha1) fail('CURRENT_WHOLE_SOURCE');
  const technical=json(readRef(d.studentUiTechnicalRef)),visual=json(readRef(d.studentUiVisualRef));
  // The static reviewer and the actual-screen reviewer are separate documented
  // roles. Both are independent of the original native judge and CI producer.
  if (visual.reviewer!=='GPT_REGISTRAR_REPAIR' || visual.reviewer===native.reviewer ||
      visual.reviewer===technical.executionOwner) fail('INDEPENDENT_UI_REVIEWER');
  const transitions=[];
  for (const [i,scope] of E023_SOLUTION_DISPLAY_SCOPE.entries()) {
    const st=staticReview.rows[i],bound=d.rows[i];
    exact(st,['questionUid','sourceOrdinal','nativeItemSha256','beforeDisplaySha256','afterDisplaySha256','fieldTransitions',
      'beforeAssetRefs','currentAssetRefs','decision'],'STATIC_ROW_KEYS');
    exact(bound,['questionUid','sourceOrdinal','solutionAssetRefs'],'BINDING_ROW_KEYS');
    if ([st,bound].some(v=>v.questionUid!==scope.questionUid || v.sourceOrdinal!==scope.sourceOrdinal) ||
        st.nativeItemSha256!==scope.nativeItemSha256 || st.decision!==STATIC_DECISION) fail('EXACT_SIX_UID_INVENTORY');
    const nativeItems=originalReview.items.filter(v=>v.sourceOrdinal===scope.sourceOrdinal && v.questionUid===scope.questionUid);
    if (nativeItems.length!==1 || sha(stable(nativeItems[0]))!==scope.nativeItemSha256) fail('ORIGINAL_NATIVE_ITEM');
    const ix=scope.sourceOrdinal-1,original=originalBank[ix],committed=committedBank[ix],prior=priorBank[ix],reviewed=reviewedBank[ix],current=currentBank[ix];
    if (!equal(original,committed)) fail('ORIGINAL_SNAPSHOTS');
    transitions.push(verifyE023OwnedDisplayTransition({original,prior,reviewed,current,transition:{
      beforeDisplaySha256:st.beforeDisplaySha256,afterDisplaySha256:st.afterDisplaySha256,fieldTransitions:st.fieldTransitions,
    }}));
    exactAssetInventory(original,st.beforeAssetRefs,b.commit,readRef,root,true);
    // Historical images remain at their original bytes. The recursive ordinary
    // Native validator will read these real files, never a substituted image.
    for (const ref of st.beforeAssetRefs) {
      readRef({...ref,commit:staticReview.priorDisplaySourceRef.commit});
      readRef({...ref,commit:d.currentSourceRef.commit});
    }
    exactAssetInventory(reviewed,st.currentAssetRefs,staticReview.reviewedCurrentSourceRef.commit,readRef,root,false);
    exactAssetInventory(current,bound.solutionAssetRefs,d.currentSourceRef.commit,readRef,root,true);
    if (!equal(st.currentAssetRefs.map(r=>REF_KEYS.filter(k=>k!=='commit').map(k=>r[k])),
      bound.solutionAssetRefs.map(r=>REF_KEYS.filter(k=>k!=='commit').map(k=>r[k])))) fail('EXACT_REVIEWED_ASSET_BYTES');
    const cases=technical.results?.filter(r=>r.questionUid===scope.questionUid && r.sourceOrdinal===scope.sourceOrdinal && r.surface==='SOLUTION');
    if (cases?.length!==1 || !sameBytesRef(cases[0].sourceRef,d.currentSourceRef) ||
        !Array.isArray(cases[0].assetRefs) || cases[0].assetRefs.length!==bound.solutionAssetRefs.length ||
        cases[0].assetRefs.some((r,n)=>!sameBytesRef(r,bound.solutionAssetRefs[n]))) fail('ACTUAL_CAPTURE_WHOLE_SOURCE_AND_ASSETS');
  }
  const selectedCase=technical.results.find(r=>r.questionUid===patch.questionUid && r.sourceOrdinal===patch.sourceOrdinal);
  const checkedUi=verifyE023SolutionUi({technical,visual,technicalRef:d.studentUiTechnicalRef,readRef,
    questionUid:patch.questionUid,sourceOrdinal:patch.sourceOrdinal,surface:'SOLUTION',
    sourceRef:selectedCase.sourceRef,assetRefs:selectedCase.assetRefs});
  // Only now create a comparison context. All other fields and the independent
  // public opt-in remain untouched for the caller's ordinary Native equality.
  const original=originalBank[patch.sourceOrdinal-1],normalizedQuestion={...question};
  for (const key of E023_SOLUTION_DISPLAY_FIELDS) {
    if (own(original,key)) normalizedQuestion[key]=original[key]; else delete normalizedQuestion[key];
  }
  const normalizedPatch={...patch,sourceReview:{...patch.sourceReview}};
  delete normalizedPatch.sourceReview[KEY];
  const selectedIndex=E023_SOLUTION_DISPLAY_SCOPE.indexOf(selected);
  return {normalizedQuestion,normalizedPatch,ownedFields:[...E023_SOLUTION_DISPLAY_FIELDS],proof:{
    schemaVersion:E023_SOLUTION_DISPLAY_SCHEMA,scope:SCOPE,questionUid:patch.questionUid,sourceOrdinal:patch.sourceOrdinal,
    sourceArchiveFile:E023_SOLUTION_DISPLAY_SOURCE,reviewCommit:spec.reviewCommit,reviewRef:spec.reviewRef,
    nativeReviewRef:d.nativeReviewRef,nativeItemSha256:selected.nativeItemSha256,
    nativeReviewedQuestionSha256:sha(stable(original)),nativeCommittedQuestionSha256:sha(stable(committedBank[patch.sourceOrdinal-1])),
    staticReviewRef:d.staticReviewRef,phaseHashes:{...PHASES},currentSourceRef:d.currentSourceRef,
    currentQuestionSha256:sha(stable(question)),ownedFields:[...E023_SOLUTION_DISPLAY_FIELDS],transition:transitions[selectedIndex],
    nativeSolutionAssetRefs:staticReview.rows[selectedIndex].beforeAssetRefs,currentSolutionAssetRefs:d.rows[selectedIndex].solutionAssetRefs,
    studentUiTechnicalRef:d.studentUiTechnicalRef,studentUiVisualRef:d.studentUiVisualRef,ui:checkedUi,
    memoryOnlyNormalization:true,newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Claims:0,
    sourceWrites:0,rendererWrites:0,
  }};
}
