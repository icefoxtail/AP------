import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import ui from '../../../tools/4slot/existing-registered-vector-ui.cjs';

export const M2_E017_RHS_SCHEMA = 'archive-m2-e017-existing-rhs-solution-continuity-v1';
export const M2_E017_RHS_UID = 'qid_v1_3f70e51fcbb651f7504dcf0e38089c9f103e4a361cb99d3b8ec9d3c0e9547bc9';
export const M2_E017_RHS_SOURCE = 'original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js';
const NATIVE_COMMIT = 'c28641f67d91bfb27352b11faaef4552f46c45be';
const NATIVE_PATH = 'archive/data/meta-review/m2-s2-20261114/exams/E017/review.json';
const NATIVE_SHA = 'f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0';
const NATIVE_BLOB = '6a96cbd5c2671c61a63b0e964777ec6d6ac3369d';
const NATIVE_ITEM = '7965970ce20afa01019e35d813be95a040e2008a4dbcc308955a5ca612f82ac3';
const AUTHORITY_COMMIT = 'bb16df02416cc666469eec1b317c681b5b7c0c50';
const AUTHORITY_SOURCE = '41e074035e7ab7558bc1ae89820a2a60ebe3c806';
const PREFIX = 'docs/operations/middle-audit-repair-34c2-m2s2-e017-four-slot/';
const AUTHORITY = Object.freeze([
 ['e017-candidate-literal-validation.r1.json','b50559ce3242158c00f67340a0af4ab4dbcd952e9ec45987a4d95e6b3bccaf48'],
 ['e017-four-slot-native-rhs-continuity-independent.r2.json','7c03bbfe4a14e82db3a0d32a95423b6a9b9156b56e3fe5e3f0d5ed0ab00382c6'],
 ['e017-native-rhs-restored-candidate-runtime.r2.json','82410cd4503179dc96a15f75bdc484f7e4cb814fbd3f121ac23b6b0c3f1b4449'],
 ['e017-q2-native-rhs-clarification-proposal.r2.json','600dd62eed8030275cad2ef084dcbd2aad9ab5e8181c04042bbb8af3c0a11147'],
 ['e017-q2-native-rhs-literal-validation.r2.json','cf666369e8baaa3c3a05773a7b92d708501cc897bcf4cc2cfcd55cc9b50e4d8e'],
 ['e017-q2-root-restoration-review.r2.json','d8bb9b257c68a43a0c6bfb34623b6cdcc8499fe5bee6e4ff05b47611587d6511'],
]);
const TRANSITION = Object.freeze({
 beforeSha256:'6401600c72f168a7a0c2fd737e8473ffa6531e6ea7284c3b61fa04d0c6c1aa26',
 afterSha256:'3aa64c0773f21d03552ff039f01abad9b9e605ac9ca91fa516cf51dab994c1bb',
 firstLineBeforeSha256:'a04617338857b30cdeebe4550856fee3a92983a7778af08d1cad0f5175a35970',
 firstLineAfterSha256:'663bd41c1a79ccb2f334c6769234dbd8ada8caa87d36b81a6fbb1eb85417664a',
 suffixSha256:'d0667c991db72e367b9a7cfee3583beca9a62cb957e8d5c1d590d028d81f60ed'
});
const META = new Set(['curriculum','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern',
 'level','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility',
 'rpmL1','rpmL2','rpmL3','rpmL4','rpmPrimaryPath','primaryMethod','decisiveStep']);
const REF_KEYS = ['commit','path','gitBlobSha1','sha256','bytes'];
const HEX = /^[a-f0-9]{64}$/, OID = /^[a-f0-9]{40}$/;
const stable = v => JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const same = (a,b) => stable(a)===stable(b);
const own = (o,k) => Object.hasOwn(o||{},k);
const prop = (o,k) => own(o,k)?{present:true,value:o[k]}:{present:false};
function fail(code) {throw Error('M2_E017_RHS_CONTINUITY:'+code);}
function exact(o,ks,code) {if(!o||typeof o!=='object'||Array.isArray(o)||!same(Object.keys(o).sort(),ks.slice().sort()))fail(code);}
function safe(root,p) {
 if(typeof p!=='string'||!p||p.includes('\\')||/[\x00-\x1f\x7f]/.test(p)||path.isAbsolute(p)||p.split('/').some(x=>!x||x==='.'||x==='..'))fail('PATH');
 const full=path.resolve(root,p);for(let f=full;f!==path.resolve(root);f=path.dirname(f))if(fs.existsSync(f)&&fs.lstatSync(f).isSymbolicLink())fail('SYMLINK');return full;
}
function reader(root) {
 const git=(...args)=>{try{return execFileSync('git',args,{cwd:root,maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe'],env:{...process.env,GIT_NO_LAZY_FETCH:'1'}});}catch{fail('IMMUTABLE_GIT_REF');}};
 return ref=>{
  exact(ref,REF_KEYS,'REF_KEYS');safe(root,ref.path);
  if(!OID.test(ref.commit)||!OID.test(ref.gitBlobSha1)||!HEX.test(ref.sha256)||!Number.isSafeInteger(ref.bytes)||ref.bytes<1)fail('REF');
  const commit=git('cat-file','commit',ref.commit).toString(),tree=/^tree ([a-f0-9]{40})$/m.exec(commit)?.[1];
  if(!tree)fail('COMMIT');
  if(git('ls-tree','-z',tree,'--',ref.path).toString()!==`100644 blob ${ref.gitBlobSha1}\t${ref.path}\0`)fail('REF_PATH');
  const b=git('cat-file','blob',ref.gitBlobSha1);
  const oid=crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
  if(oid!==ref.gitBlobSha1||b.length!==ref.bytes||sha(b)!==ref.sha256)fail('REF_BYTES');return b;
 };
}

// This pure check grants no authority. The official caller supplies the fixed,
// independently reviewed hashes above only after validating their Git documents.
export function verifyRhsFirstLineTransition(before,after,binding) {
 exact(binding,Object.keys(TRANSITION),'TRANSITION_KEYS');
 if(Object.values(binding).some(v=>!HEX.test(v))||typeof before!=='string'||typeof after!=='string'||
    before.indexOf('\n')<1||after.indexOf('\n')<1)fail('TRANSITION');
 const a=before.indexOf('\n'),b=after.indexOf('\n');
 if(sha(before)!==binding.beforeSha256||sha(after)!==binding.afterSha256||
    sha(before.slice(0,a))!==binding.firstLineBeforeSha256||sha(after.slice(0,b))!==binding.firstLineAfterSha256||
    before.slice(a)!==after.slice(b)||sha(after.slice(b))!==binding.suffixSha256)fail('EXACT_FIRST_LINE_AND_SUFFIX');
 return {...binding};
}

// Only values explicitly accepted by the original native item may accompany a
// later metadata-only source transport. Aliases, identity and provenance cannot.
export function verifyRhsMetadataTransport(reviewed,current,accepted,after) {
 const changed=[...new Set([...Object.keys(reviewed),...Object.keys(current)])].sort().filter(k=>!same(prop(reviewed,k),prop(current,k)));
 for(const k of changed)if(!META.has(k)||!own(current,k)||!own(accepted,k)||accepted[k]==null||
   !own(after,k)||!same(current[k],accepted[k])||!same(after[k],accepted[k]))fail('SOURCE_FIELD_OUTSIDE_NATIVE_TRANSPORT:'+k);
 return changed;
}

export function verifyE017SolutionUi(args) {
 if(args.questionUid!==M2_E017_RHS_UID||args.sourceOrdinal!==2||args.surface!=='SOLUTION'||
    args.technical?.expectedLogicalCases!==1||args.technical?.completedLogicalCases!==1||args.technical?.results?.length!==1||
    args.visual?.records?.length!==1)fail('EXACT_SOLUTION_UI_ONE');
 return ui.verifyUi(args);
}

export function validateM2E017RhsContinuity({root,request,patch,native,row,question,studentPayload,bankFromBytes}) {
 const spec=patch.sourceReview?.e017RhsContinuity;if(spec===undefined)return null;
 exact(spec,['schemaVersion','reviewCommit','reviewRef'],'OPT_IN');
 exact(patch.sourceReview,['schemaVersion','reviewCommit','reviewPath','reviewRef','e017RhsContinuity'],'UNMIXED_SOURCE_REVIEW');
 if(spec.schemaVersion!==M2_E017_RHS_SCHEMA||!OID.test(spec.reviewCommit||'')||request.scope!=='PARTIAL_UIDS'||
    request.approval?.type!=='FINAL_QA'||request.approval.metadataReviewed!==true||request.approval.sourceRebind!==undefined||
    request.registrationMode!==undefined||patch.rebind!==undefined||!Array.isArray(request.registryChanges)||request.registryChanges.length||
    patch.questionUid!==M2_E017_RHS_UID||patch.sourceOrdinal!==2||request.sourceArchiveFile!==M2_E017_RHS_SOURCE||request.expectedQuestionCount!==23)fail('EXCLUSIVE_UID_SCOPE');
 if(native.review.schemaVersion!=='m2-s2-meta-review-v1'||native.spec.reviewCommit!==NATIVE_COMMIT||native.spec.reviewPath!==NATIVE_PATH||
    native.spec.reviewRef.sha256!==NATIVE_SHA||native.sourceBlob!==NATIVE_BLOB||native.committedBlob!==NATIVE_BLOB||sha(stable(row))!==NATIVE_ITEM)fail('ORIGINAL_NATIVE_AUTHORITY');
 const readRef=reader(root);exact(spec.reviewRef,['path','sha256'],'BINDING_REF');
 if(!HEX.test(spec.reviewRef.sha256||'')||![request.approval.evidenceRefs,patch.evidenceRefs].every(rs=>Array.isArray(rs)&&rs.some(r=>same(r,spec.reviewRef))))fail('BINDING_EVIDENCE');
 const full=safe(root,spec.reviewRef.path),local=fs.readFileSync(full);
 if(sha(local)!==spec.reviewRef.sha256)fail('LOCAL_BINDING_BYTES');
 const oid=crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${local.length}\0`),local])).digest('hex');
 readRef({commit:spec.reviewCommit,path:spec.reviewRef.path,gitBlobSha1:oid,sha256:spec.reviewRef.sha256,bytes:local.length});
 const d=JSON.parse(local);
 exact(d,['schemaVersion','scope','questionUid','sourceOrdinal','sourceArchiveFile','expectedQuestionCount','nativeReviewRef','nativeItemSha256',
  'authorityRefs','reviewedCurrentSourceRef','currentSourceRef','currentAssetRefs','solutionAssetRefs','transition',
  'studentUiTechnicalRef','studentUiVisualRef','newMathematicalQa','newMetadataApprovals'],'BINDING_KEYS');
 if(d.schemaVersion!=='archive-m2-e017-existing-rhs-binding-v1'||d.scope!=='EXACT_E017_Q2_EXISTING_RHS_FIRST_LINE_ONLY'||
    d.questionUid!==M2_E017_RHS_UID||d.sourceOrdinal!==2||d.sourceArchiveFile!==M2_E017_RHS_SOURCE||d.expectedQuestionCount!==23||
    d.nativeItemSha256!==NATIVE_ITEM||d.newMathematicalQa!==false||d.newMetadataApprovals!==0||!same(d.transition,TRANSITION))fail('BINDING_SCOPE');
 if(d.nativeReviewRef.commit!==NATIVE_COMMIT||d.nativeReviewRef.path!==NATIVE_PATH||d.nativeReviewRef.sha256!==NATIVE_SHA)fail('NATIVE_REF');readRef(d.nativeReviewRef);
 if(!Array.isArray(d.authorityRefs)||d.authorityRefs.length!==AUTHORITY.length)fail('AUTHORITY_INVENTORY');
 const authorities=d.authorityRefs.map((r,i)=>{
  if(r.commit!==AUTHORITY_COMMIT||r.path!==PREFIX+AUTHORITY[i][0]||r.sha256!==AUTHORITY[i][1])fail('EXACT_PUBLIC_AUTHORITY');return JSON.parse(readRef(r));
 });
 const independent=authorities[1],proposal=authorities[3],rootReview=authorities[5];
 if(independent.solutionClarification.decision!=='APPROVE_SCOPED_EXISTING_NATIVE_METHOD_TRANSPORT_TO_FIRST_SOLUTION_LINE'||
    independent.reviewer===rootReview.reviewer||!rootReview.sourceClarificationIndependentlyRead||
    independent.solutionClarification.existingNativeItemRef.itemStableSha256!==NATIVE_ITEM||
    independent.solutionClarification.acceptedNativePrimaryMethod!==row.primaryMethod||
    independent.solutionClarification.acceptedNativeDecisiveStep!==row.decisiveStep)fail('EXISTING_AUTHORITY_ROLE');
 const sourcePath='archive/exams/'+M2_E017_RHS_SOURCE;
 if(d.reviewedCurrentSourceRef.commit!==AUTHORITY_COMMIT||d.reviewedCurrentSourceRef.path!==sourcePath||
    d.reviewedCurrentSourceRef.gitBlobSha1!==AUTHORITY_SOURCE||d.currentSourceRef.path!==sourcePath)fail('SOURCE_REFS');
 const reviewedBank=bankFromBytes(readRef(d.reviewedCurrentSourceRef)),currentBytes=readRef(d.currentSourceRef),currentBank=bankFromBytes(currentBytes);
 if(reviewedBank.length!==23||currentBank.length!==23||!same(currentBank[1],question)||
    !fs.readFileSync(safe(root,sourcePath)).equals(currentBytes)||request.expectedSourceBlobSha1!==d.currentSourceRef.gitBlobSha1)fail('CURRENT_WHOLE_SOURCE');
 const original=native.reviewedBank[1],committed=native.committedBank[1],reviewed=reviewedBank[1];
 if(!same(original,committed)||!same(studentPayload({...original,solution:reviewed.solution}),studentPayload(reviewed))||
    !same(prop(original,'imageAlt'),prop(reviewed,'imageAlt'))||!same(prop(original,'choicesEmbeddedInImage'),prop(reviewed,'choicesEmbeddedInImage')))fail('OTHER_NATIVE_STUDENT_FIELDS');
 verifyRhsFirstLineTransition(original.solution,question.solution,TRANSITION);
 if(question.solution!==proposal.sourceDelta.set.solution.after||original.solution!==proposal.sourceDelta.set.solution.before)fail('PUBLIC_LITERAL_BINDING');
 const accepted={...row.after,...row.finalDifficulty,primaryMethod:row.primaryMethod,decisiveStep:row.decisiveStep};delete accepted.reason;
 const metadataFields=verifyRhsMetadataTransport(reviewed,question,accepted,patch.after);
 const paths=q=>[...new Set(Object.values(q).filter(v=>typeof v==='string').flatMap(v=>[...v.matchAll(/(?:archive\/)?assets\/images\/[^\s"'<>\\]+\.(?:svg|png|jpe?g|gif|webp)/gi)].map(m=>m[0].startsWith('archive/')?m[0]:'archive/'+m[0])))].sort();
 const allPaths=paths(question),solutionPaths=paths(Object.fromEntries(Object.entries(question).filter(([k])=>/^solution/.test(k))));
 if(!same(allPaths,['archive/'+original.solutionImage,'archive/'+original.image].sort())||
    !same(solutionPaths,['archive/'+original.solutionImage])||!Array.isArray(d.currentAssetRefs)||!Array.isArray(d.solutionAssetRefs)||
    !same(d.currentAssetRefs.map(r=>r.path),allPaths)||!same(d.solutionAssetRefs,d.currentAssetRefs.filter(r=>solutionPaths.includes(r.path))))fail('COMPLETE_ASSET_INVENTORY');
 for(const r of d.currentAssetRefs){
  if(r.commit!==d.currentSourceRef.commit)fail('ASSET_CHECKOUT');const b=readRef(r);
  readRef({...r,commit:NATIVE_COMMIT});if(!fs.readFileSync(safe(root,r.path)).equals(b))fail('CURRENT_ASSET_BYTES');
 }
 const technical=JSON.parse(readRef(d.studentUiTechnicalRef)),visual=JSON.parse(readRef(d.studentUiVisualRef));
 if(visual.reviewer===native.reviewer)fail('INDEPENDENT_UI_REVIEWER');
 const checkedUi=verifyE017SolutionUi({technical,visual,technicalRef:d.studentUiTechnicalRef,readRef,questionUid:M2_E017_RHS_UID,
  sourceOrdinal:2,surface:'SOLUTION',sourceRef:d.currentSourceRef,assetRefs:d.solutionAssetRefs});
 const normalizedQuestion={...question,solution:original.solution},normalizedPatch={...patch,sourceReview:{...patch.sourceReview}};
 delete normalizedPatch.sourceReview.e017RhsContinuity;
 if(!same(studentPayload(normalizedQuestion),studentPayload(original)))fail('RESTORED_NATIVE_STUDENT_PAYLOAD');
 return {normalizedQuestion,normalizedPatch,proof:{schemaVersion:M2_E017_RHS_SCHEMA,questionUid:M2_E017_RHS_UID,sourceOrdinal:2,sourceArchiveFile:M2_E017_RHS_SOURCE,
  reviewCommit:spec.reviewCommit,reviewRef:spec.reviewRef,nativeReviewRef:d.nativeReviewRef,nativeItemSha256:NATIVE_ITEM,authorityRefs:d.authorityRefs,
  nativeReviewedQuestionSha256:sha(stable(original)),nativeCommittedQuestionSha256:sha(stable(committed)),reviewedCurrentQuestionSha256:sha(stable(reviewed)),
  reviewedCurrentSourceRef:d.reviewedCurrentSourceRef,currentSourceRef:d.currentSourceRef,currentAssetRefs:d.currentAssetRefs,solutionAssetRefs:d.solutionAssetRefs,
  transition:TRANSITION,metadataFields,studentUiTechnicalRef:d.studentUiTechnicalRef,studentUiVisualRef:d.studentUiVisualRef,ui:checkedUi,
  memoryOnlyNormalization:true,newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Claims:0,sourceWrites:0,rendererWrites:0}};
}
