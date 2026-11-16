// Reuse an already issued native approval across one independently reviewed figure
// replacement. This adapter never registers metadata or approves arbitrary content.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { REASSESSED_STUDENT_FIELDS, validateReviewedSourceReassessment } from './reviewed-source-reassessment.mjs';

const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const fail = message => { throw Error(`native reviewed figure reuse: ${message}`); };
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => stable(a ?? null) === stable(b ?? null);
const text = v => typeof v === 'string' && v.trim();
const payload = q => Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k => [k, q[k] ?? null]));
const fullFp = q => sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const bodyFp = q => sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
const FIGURE_FIELDS = new Set(['content', 'image', 'solutionImage', 'solutionImageSize', 'solutionImageAlt', 'solutionImageCaption', 'layoutTag']);
const caches = new Map();

function safePath(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes('\\') || /[\x00-\x1f]/.test(relative) ||
      relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe evidence or asset path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink evidence or asset path');
  return full;
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { fail('invalid JSON evidence'); } }
function git(ctx, ...args) {
  try { return execFileSync('git', args, {cwd:ctx.root, maxBuffer:32*1024*1024, stdio:['ignore','pipe','pipe']}); }
  catch { fail('immutable Git evidence unavailable'); }
}
function gitFile(ctx, commit, relative) {
  safePath(ctx.root, relative);
  if (!SHA1.test(commit || '')) fail('exact evidence commit required');
  const key = `figure-git:${commit}:${relative}`;
  if (!ctx.cache.has(key)) {
    if (git(ctx,'rev-parse','--verify',`${commit}^{commit}`).toString().trim() !== commit) fail('exact evidence commit required');
    const blob = git(ctx,'rev-parse',`${commit}:${relative}`).toString().trim();
    const bytes = git(ctx,'cat-file','blob',blob);
    ctx.cache.set(key, {blob, bytes, sha256:sha(bytes)});
  }
  return ctx.cache.get(key);
}
function bankFromFile(ctx, file) {
  const key = `figure-bank:${file.blob}`;
  if (!ctx.cache.has(key)) {
    const context = {window:{}};
    vm.runInNewContext(file.bytes.toString('utf8'),context,{timeout:5000});
    const rows=context.window.questionBank||context.window.questions||context.questionBank||context.questions||context.window.examData?.questions;
    if (!Array.isArray(rows)) fail('invalid Git source bank');
    ctx.cache.set(key,JSON.parse(JSON.stringify(rows)));
  }
  return ctx.cache.get(key);
}
function boundDocument(ctx, ref, commit=ctx.proof.reviewCommit, gitPath=ref?.path) {
  if (!ref || !SHA256.test(ref.sha256 || '') ||
      !ctx.receipt.approval.evidenceRefs.some(r=>r.path===ref.path&&r.sha256===ref.sha256)) fail('evidence is not bound to native approval');
  const bytes=fs.readFileSync(safePath(ctx.root,ref.path));
  if (sha(bytes)!==ref.sha256) fail('current evidence bytes changed');
  const file=gitFile(ctx,commit,gitPath);
  if(file.sha256!==ref.sha256) fail('evidence differs from immutable review commit');
  return parse(file.bytes);
}
function uniqueRow(rows, uid, ordinal, key='ordinal') {
  if(!Array.isArray(rows))fail('missing exact row inventory');
  const selected=rows.filter(r=>r.questionUid===uid);
  if(selected.length!==1||selected[0][key]!==ordinal)fail('UID/ordinal evidence is missing or ambiguous');
  return selected[0];
}
function sourceRef(ref, snapshot, commit, sourcePath) {
  if(!ref||ref.commit!==commit||ref.path!==sourcePath||ref.gitBlobSha!==snapshot.blob||ref.rawSha256!==snapshot.sha256)
    fail('independent source snapshot mismatch');
}
function assetRows(rows) {
  if(!Array.isArray(rows)||new Set(rows.map(r=>r.path)).size!==rows.length)fail('duplicate or missing asset inventory');
  return rows.map(r=>({path:r.path,gitBlobSha:r.gitBlobSha,rawSha256:r.rawSha256})).sort((a,b)=>a.path.localeCompare(b.path));
}
function independentProof(ctx, ref, review, row, beforeFile, currentFile, before, question) {
  const doc=boundDocument(ctx,ref), r=uniqueRow(doc.rows,row.questionUid,row.ordinal), sourcePath=`archive/exams/${review.sourceArchiveFile}`;
  const previousJson=sha(JSON.stringify(before)),currentJson=sha(JSON.stringify(question));
  let previousAssets,currentAssets,reviewer=typeof doc.reviewer==='string'?doc.reviewer:doc.reviewer?.owner;
  if(!text(reviewer)||reviewer===review.author||!equal(row.independentReviewer,doc.reviewer)||
    r.examId!==undefined&&r.examId!==review.examId)fail('independent reviewer/exam mismatch');
  if(doc.schemaVersion==='archive-narrow-current-renderer-independent-review-v1') {
    if(doc.status!=='PASS_NARROW_FIGURE_CONTINUITY'||r.status!=='PASS_NARROW_FIGURE_CONTINUITY'||
      doc.sourceCommit!==review.currentSourceCommit||doc.priorSourceCommit!==review.previousSourceCommit||doc.sourcePath!==sourcePath||
      doc.sourceBeforeGitBlobSha!==beforeFile.blob||doc.sourceCurrentGitBlobSha!==currentFile.blob||
      doc.sourceBeforeSha256!==beforeFile.sha256||doc.sourceCurrentSha256!==currentFile.sha256||
      r.beforeQuestionSha256!==previousJson||r.currentQuestionSha256!==currentJson||
      r.stemChoicesAnswerSolutionUnchanged!==true||r.acceptedMethodAndDifficultyUnchanged!==true||r.newAnswerLeak!==false||
      doc.fullMathematicalQa!==false||doc.newReviewPassCount!==0||doc.newDifficultyJudgments!==0||doc.newMetadataApprovals!==0)
      fail('independent renderer review is not an exact narrow PASS');
    previousAssets=r.beforeAssets;currentAssets=r.currentAssets;
  } else if(doc.schemaVersion==='archive-independent-current-figure-continuity-v1') {
    if(doc.beforeCommit!==review.previousSourceCommit||doc.currentCommit!==review.currentSourceCommit||
      doc.source?.path!==sourcePath||doc.source.beforeBlobSha1!==beforeFile.blob||doc.source.currentBlobSha1!==currentFile.blob||
      doc.source.beforeRawSha256!==beforeFile.sha256||doc.source.currentRawSha256!==currentFile.sha256||
      r.verdict!=='NARROW_DIAGRAM_CONTINUITY_PASS'||r.beforeQuestionSha256!==previousJson||r.currentQuestionSha256!==currentJson||
      r.wholeQuestionMatchedExactGitSource!==true||r.fullMathQaAdded!==false||r.review2Added!==false||
      r.newDifficultyJudgment!==false||r.newMetadataApproval!==false)fail('independent diagram continuity review is not an exact narrow PASS');
    previousAssets=r.beforeAssets;currentAssets=r.currentAssets;
  } else if(doc.schemaVersion==='archive-independent-current-figure-review-v1') {
    sourceRef(doc.sources?.before,beforeFile,review.previousSourceCommit,sourcePath);
    sourceRef(doc.sources?.current,currentFile,review.currentSourceCommit,sourcePath);
    if(doc.decision!=='PASS_NARROW_FIGURE_SEMANTIC_CONTINUITY'||r.decision!=='SEMANTICS_PRESERVED_NARROW_FIGURE_REVIEW'||
      r.beforeQuestionCanonicalSha256!==sha(stable(before))||r.currentQuestionCanonicalSha256!==sha(stable(question))||
      r.unchangedNonFigureFields!==true||r.unchangedStemAfterRemovingOnlyImageTags!==true||r.choicesAnswerSolutionAndDifficultyUnchanged!==true||
      doc.newMetadataApprovals!==0||doc.newDifficultyApprovals!==0||doc.fullQaClaimed!==false)
      fail('independent semantic figure review is not an exact narrow PASS');
    previousAssets=r.assets?.before;currentAssets=r.assets?.current;
  } else if(doc.schemaVersion==='archive-narrow-figure-change-independent-review-v1') {
    sourceRef(r.sources?.before,beforeFile,review.previousSourceCommit,sourcePath);
    sourceRef(r.sources?.current,currentFile,review.currentSourceCommit,sourcePath);
    if(doc.beforeCommit!==review.previousSourceCommit||doc.currentCommit!==review.currentSourceCommit||
      r.sources.before.questionJsonSha256!==previousJson||r.sources.current.questionJsonSha256!==currentJson||
      r.sourceAuditQuestionJsonHashesVerified!==true||r.result!=='NARROW_FIGURE_CHANGE_PASS'||
      doc.counts?.newMetadataApprovals!==0||doc.counts?.newReview2Approvals!==0||doc.counts?.newDifficultyApprovals!==0||
      doc.assertions?.studentTextChoicesAnswerSolutionUnchanged!==true||doc.assertions?.notAFullExamR1R2OrReview2Approval!==true)
      fail('independent figure change review is not an exact narrow PASS');
    previousAssets=r.assets?.before;currentAssets=r.assets?.current;
  } else fail('unsupported independent figure review schema');
  return {before:assetRows(previousAssets),current:assetRows(currentAssets)};
}
function references(root, question) {
  const refs=new Set();
  const add=value=>{
    if(typeof value!=='string'||!/^(?:archive\/)?assets\//.test(value)||/[?#]/.test(value))fail('unsupported renderer asset reference');
    const rel=value.startsWith('archive/')?value:`archive/${value}`;safePath(root,rel);refs.add(rel);
  };
  const walk=value=>{if(value===undefined||value===null||value==='')return;
    if(Array.isArray(value)){value.forEach(walk);return;}if(typeof value==='string'){add(value);return;}
    fail('unsupported renderer asset shape');};
  for(const key of ['image','images','solutionImage','solutionImages'])walk(question[key]);
  if(question.figureSvg||question.solutionFigureSvg)fail('inline SVG is outside this narrow reuse adapter');
  const html=value=>{if(typeof value==='string'){
    for(const m of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)){if(!m[1].startsWith('#'))add(m[1]);}
    if(/url\s*\(/i.test(value))fail('unsupported inline renderer URL');
  }else if(Array.isArray(value))value.forEach(html);else if(value&&typeof value==='object')Object.values(value).forEach(html);};
  html(payload(question));return [...refs].sort();
}
function verifyAssets(ctx, assets, question, commit, live=false) {
  if(!equal(assets.map(a=>a.path).sort(),references(ctx.root,question)))fail('renderer asset inventory is incomplete or excessive');
  for(const a of assets){
    const file=gitFile(ctx,commit,a.path);
    if(!SHA1.test(a.gitBlobSha||'')||!SHA256.test(a.rawSha256||'')||file.blob!==a.gitBlobSha||file.sha256!==a.rawSha256)
      fail('renderer Git/blob/SHA mismatch');
    if(live&&(sha(fs.readFileSync(safePath(ctx.root,a.path)))!==a.rawSha256||
        gitFile(ctx,ctx.proof.reviewCommit,a.path).sha256!==a.rawSha256))fail('current renderer bytes changed after review');
    if(/\.svg$/i.test(a.path)){
      const svg=file.bytes.toString('utf8'),deps=[...[...svg.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]),
        ...[...svg.matchAll(/url\s*\(\s*["']?([^\s)"']+)["']?\s*\)/gi)].map(m=>m[1])];
      if(deps.some(p=>!p.startsWith('#')&&!/^data:image\/[a-z0-9.+-]+;base64,/i.test(p)))fail('unsupported nested SVG renderer dependency');
    }
  }
}

// null means an older, unrelated receipt kind and leaves its existing guards intact.
// A claimed narrow figure receipt is mandatory to verify, even if an AutoMeta cursor
// has subsequently caught up; changing an asset at the same path cannot bypass it.
export function nativeReviewedFigureRebind(receipt,nativeSource,previous,question,identity,ordinal,current) {
  const repairs=receipt.fingerprintRepairs?.filter(r=>r.questionUid===identity.questionUid&&r.sourceReview);
  if(!repairs?.length){
    // The approval may still claim an independently reviewed changed row after a
    // malformed receipt loses its repair entry. A caught-up cursor is no waiver.
    for(const ref of receipt.approval.evidenceRefs||[]){
      const bytes=fs.readFileSync(safePath(nativeSource.root,ref.path));
      if(sha(bytes)!==ref.sha256)fail('current evidence bytes changed');
      let doc;try{doc=JSON.parse(bytes);}catch{continue;}
      if(doc.sourceArchiveFile===receipt.sourceArchiveFile&&
        (doc.reviewScope==='NARROW_CURRENT_FIGURE_CONTINUITY_ONLY'||doc.rendererAssetBindingRef&&doc.originalPendingRequest&&doc.independentReviewRefs)&&
        doc.items?.some(r=>r.questionUid===identity.questionUid&&r.ordinal===ordinal&&r.independentReviewRef))
        fail('claimed current figure review is missing its selected repair');
    }
    return null;
  }
  const candidate=repairs[0].sourceReview;
  if(repairs.length!==1)fail('ambiguous selected source review');
  const repair=repairs[0],root=fs.realpathSync(nativeSource.root);
  if(!caches.has(root))caches.set(root,new Map());
  const ctx={root,receipt,proof:candidate,cache:caches.get(root)},proof=candidate;
  // Dispatch from immutable review bytes, never a mutable local scope/schema flag.
  // Ordinary reassessments may store a local copy under a different reviewRef path.
  const review=boundDocument(ctx,proof.reviewRef,proof.reviewCommit,proof.reviewPath);
  if(proof.nativeSchemaVersion!==review.schemaVersion)fail('native review schema differs from immutable evidence');
  if(review.reviewScope!=='NARROW_CURRENT_FIGURE_CONTINUITY_ONLY')return null;
  if(receipt.scope!=='PARTIAL_UIDS'||receipt.approval?.type!=='FINAL_QA')fail('exclusive selected FINAL_QA figure repair required');
  if(repair.rebind!==undefined||proof.schemaVersion!=='archive-reviewed-source-reassessment-v1'||
    proof.reviewPath!==proof.reviewRef.path||proof.questionUid!==identity.questionUid||proof.sourceOrdinal!==ordinal||
    proof.scope!=='METADATA_SOURCE_BINDING_ONLY'||proof.newMathematicalQa!==false||
    review.schemaVersion!=='m3-s2-complete-semantic-review-v1'||review.sourceArchiveFile!==receipt.sourceArchiveFile||
    review.questionCount!==nativeSource.bank.length||review.fullMathematicalQa!==false||review.newReviewPassCount!==0||
    review.newDifficultyJudgments!==0||review.meaningAndDifficultyReusedWithoutChanges!==true)fail('current figure review scope mismatch');
  const sourcePath=`archive/exams/${receipt.sourceArchiveFile}`;
  const beforeFile=gitFile(ctx,review.previousSourceCommit,sourcePath),currentFile=gitFile(ctx,review.currentSourceCommit,sourcePath);
  const beforeBank=bankFromFile(ctx,beforeFile),currentBank=bankFromFile(ctx,currentFile),before=beforeBank[ordinal-1];
  if(beforeBank.length!==nativeSource.bank.length||currentBank.length!==nativeSource.bank.length||
    !equal(currentBank[ordinal-1],question)||!currentFile.bytes.equals(nativeSource.bytes)||currentFile.blob!==nativeSource.blobSha1||
    currentFile.blob!==review.sourceAfterBlob||currentFile.sha256!==review.sourceAfterSha256||
    currentFile.blob!==proof.reviewedSourceBlobSha1||currentFile.sha256!==proof.reviewedSourceSha256||
    currentFile.blob!==proof.reviewCommitSourceBlobSha1||gitFile(ctx,proof.reviewCommit,sourcePath).blob!==currentFile.blob||
    !equal(payload(previous),payload(before))&&!equal(payload(previous),payload(question)))fail('previous/current Git student payload mismatch');
  const changed=[...new Set([...Object.keys(before),...Object.keys(question)])].filter(k=>!equal(before[k],question[k]));
  const imageSrcOnly=s=>typeof s==='string'?s.replace(/(<img\b[^>]*?\bsrc\s*=\s*)(["'])([^"']*)\2/gi,'$1$2FIGURE_PATH$2'):s;
  if(!changed.length||changed.some(k=>!FIGURE_FIELDS.has(k))||!equal(imageSrcOnly(before.content),imageSrcOnly(question.content)))
    fail('non-figure source content or meaning changed');
  const row=uniqueRow(review.items,identity.questionUid,ordinal);
  if(row.currentQuestionSha256!==sha(JSON.stringify(question))||row.previousQuestionSha256!==sha(JSON.stringify(before))||
    !equal([...(row.changedProtectedFields||[])].sort(),changed.filter(k=>REASSESSED_STUDENT_FIELDS.includes(k)).sort())||
    row.fullMathematicalQa!==false||row.newReviewPassCount!==0||row.newDifficultyJudgments!==0||
    row.semanticAfterValuesUnchangedFromPendingRequest!==true||!text(row.independentFinding)||
    !text(typeof row.independentReviewer==='string'?row.independentReviewer:row.independentReviewer?.owner)||
    !review.independentReviewRefs?.some(ref=>equal(ref,row.independentReviewRef))||
    review.selectedUidCount!==review.items.filter(r=>r.independentReviewRef).length)fail('selected current figure row mismatch');
  if(repair.sourceOrdinal!==ordinal||repair.metadataBefore?.sourceFingerprint!==fullFp(before)||
    !Object.hasOwn(repair.metadataBefore,'contentFingerprint')||![null,bodyFp(before)].includes(repair.metadataBefore.contentFingerprint)||
    repair.identityBefore?.sourceFingerprint!==fullFp(before)||repair.after?.sourceFingerprint!==fullFp(question)||
    repair.after?.contentFingerprint!==bodyFp(question))fail('figure fingerprint repair mismatch');
  const pendingRef=review.originalPendingRequest,pendingFile=gitFile(ctx,pendingRef?.commit,pendingRef?.path),pending=parse(pendingFile.bytes);
  if(pendingFile.sha256!==pendingRef.sha256||pendingFile.blob!==pendingRef.gitBlobSha||pending.requestId!==receipt.requestId||
    pending.scope!=='PARTIAL_UIDS'||pending.approval?.type!=='FINAL_QA'||pending.approval.metadataReviewed!==true||
    pending.expectedQuestionCount!==nativeSource.bank.length||pending.sourceArchiveFile!==receipt.sourceArchiveFile||
    pending.expectedSourceBlobSha1!==beforeFile.blob)fail('original pending review request mismatch');
  const original=uniqueRow(pending.items,identity.questionUid,ordinal,'sourceOrdinal'),semantic={...original.after};
  delete semantic.sourceFingerprint;delete semantic.contentFingerprint;
  if(!equal(semantic,row.after))fail('semantic or difficulty values changed from the original pending request');
  const nativeRef=review.originalSemanticReview,nativeFile=gitFile(ctx,nativeRef?.commit,nativeRef?.path),native=parse(nativeFile.bytes);
  if(nativeFile.sha256!==nativeRef.sha256||native.schemaVersion!=='m3-s2-complete-semantic-review-v1'||
    native.sourceArchiveFile!==receipt.sourceArchiveFile||native.questionCount!==nativeSource.bank.length||
    uniqueRow(native.items,identity.questionUid,ordinal).decision!==row.inheritedSemanticDecision)
    fail('original semantic decision binding mismatch');
  const reproduced=validateReviewedSourceReassessment({root,request:{scope:receipt.scope,approval:receipt.approval,
      sourceArchiveFile:receipt.sourceArchiveFile,expectedQuestionCount:receipt.expectedQuestionCount},
    patch:{questionUid:identity.questionUid,sourceOrdinal:ordinal,after:repair.after,
      sourceReview:{schemaVersion:proof.schemaVersion,reviewCommit:proof.reviewCommit,reviewPath:proof.reviewPath,reviewRef:proof.reviewRef},
      evidenceRefs:receipt.approval.evidenceRefs},metadata:{...current,...repair.metadataBefore},question,final:current,cache:ctx.cache});
  if(!equal(reproduced,proof))fail('native current-source reassessment proof differs');
  const independent=independentProof(ctx,row.independentReviewRef,review,row,beforeFile,currentFile,before,question);
  const renderer=boundDocument(ctx,review.rendererAssetBindingRef),assets=uniqueRow(renderer.rows,identity.questionUid,ordinal);
  if(renderer.schemaVersion!=='archive-pending-current-renderer-asset-binding-v1'||renderer.beforeCommit!==review.previousSourceCommit||
    renderer.currentCommit!==review.currentSourceCommit||renderer.otherSelectedAssetChanges!==0||
    assets.sourcePath!==sourcePath||assets.examId!==review.examId||!equal(assetRows(assets.beforeAssets),independent.before)||
    !equal(assetRows(assets.currentAssets),independent.current))fail('independent renderer inventory mismatch');
  verifyAssets(ctx,independent.before,before,review.previousSourceCommit);
  verifyAssets(ctx,independent.current,question,review.currentSourceCommit,true);
  return true;
}
