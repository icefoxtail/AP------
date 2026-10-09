import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
const root = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------`;
const candidate = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\candidate\26_제일고_2학기_중간_고2_미적분I.js`;
const assetRoot = path.dirname(candidate);
const assignment = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\assignment.R1.q5-render-correction.json`;
const oldBundleFile = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\handoff\R3.current-final-student-only-bundle.json`;
const outputFile = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\handoff\R3.current-final-student-only-bundle.q5-corrected.json`;
const patchManifestFile = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-q5-correction-patch-manifest.json`;
const rosterFile = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\codex-20261007-2sem-mid-import\source-roster.json`;
const expectedRaw = '970eedff8a9a306bfdf108cb38920b677d20dbd89246945110254e2ba4a1aa2f';
const expectedOldBundleSha = '2f6aba4a2c02a36adc906a3ca3ee7f2196760301126cb6703786e2f29992f92d';
const expectedAssignmentSha = '6d16dda017fb2a12acba350f31f7cea7f6a3e7bd2bd36e1a130f55b407f74170';
const expectedRosterSha = '20cd9e34f408c4840946d34be1f0fca7d9914bc06da21ab004aba008fecc07c6';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const artifactBytes = fs.readFileSync(candidate);
if (sha(artifactBytes) !== expectedRaw) throw new Error('CORRECTED_ARTIFACT_RAW_SHA_MISMATCH');
const assignmentSha = sha(fs.readFileSync(assignment));
if (assignmentSha !== expectedAssignmentSha) throw new Error('ASSIGNMENT_SHA_MISMATCH');
if (sha(fs.readFileSync(rosterFile)) !== expectedRosterSha) throw new Error('SOURCE_ROSTER_SHA_MISMATCH');
const oldBundleBytes = fs.readFileSync(oldBundleFile);
if (sha(oldBundleBytes) !== expectedOldBundleSha) throw new Error('OLD_BUNDLE_SHA_MISMATCH');
const oldBundle = JSON.parse(oldBundleBytes.toString('utf8'));
const patchManifest = JSON.parse(fs.readFileSync(patchManifestFile,'utf8'));
const box = { window: {} };
vm.createContext(box);
vm.runInContext(artifactBytes.toString('utf8'), box, { filename: candidate, timeout: 5000 });
const questions = box.window.questionBank || box.window.questions;
if (!Array.isArray(questions) || questions.length !== 22) throw new Error('QUESTION_BANK_DENOMINATOR_INVALID');
const sourceByQid = new Map(questions.map(q => [Number(q.id), q]));
const oldByQid = new Map(oldBundle.items.map(q => [Number(q.id), q]));
const qids = Array.from({length:22},(_,i)=>i+1);
if (qids.some(qid=>!sourceByQid.has(qid)) || oldBundle.items.length !== 22 || qids.some(qid=>!oldByQid.has(qid))) throw new Error('QID_COVERAGE_INVALID');
const expectedQ5Choices = ['$-\\dfrac{5}{2}$','$-\\dfrac{5}{3}$','$4$','$\\dfrac{7}{3}$','$6$'];
const items = qids.map(qid => {
  const q=sourceByQid.get(qid);
  const item={id:qid,content:q.content,choices:q.choices,image:q.image??null};
  if (Object.prototype.hasOwnProperty.call(q,'imageAlt')) item.imageAlt=q.imageAlt;
  const imageRef=q.image??null;
  if (imageRef) {
    const manifest=(oldBundle.assetManifest||[]).find(a=>Number(a.qid)===qid && a.path===imageRef);
    if(!manifest) throw new Error(`ASSET_MANIFEST_MISSING:q${qid}`);
    item.assetSha=manifest.sha256;
  } else item.assetSha=null;
  const oldItem=oldByQid.get(qid);
  for(const key of ['content','image','imageAlt']) if(JSON.stringify(item[key]??null)!==JSON.stringify(oldItem[key]??null)) throw new Error(`Q${qid}_NONCHOICE_STUDENT_FIELD_CHANGED:${key}`);
  if(qid===5){
    if(JSON.stringify(item.choices)!==JSON.stringify(expectedQ5Choices)) throw new Error('Q5_CORRECTED_CHOICES_INVALID');
    if(JSON.stringify(item.choices.map((v,i)=>i===0?'$-dfrac52$':i===1?'$-dfrac53$':i===3?'$dfrac73$':v))!==JSON.stringify(oldItem.choices)) throw new Error('Q5_SEMANTIC_CHOICE_PARITY_FAILED');
  } else if(JSON.stringify(item.choices)!==JSON.stringify(oldItem.choices)) throw new Error(`Q${qid}_CHOICES_CHANGED`);
  const payload={...item};
  item.payloadSha=sha(Buffer.from(JSON.stringify(payload),'utf8'));
  const forbidden=Object.keys(item).filter(k=>/^(answer|solution|solutionImage|decisiveStep|Meta|difficulty|upstreamVerdict)$/i.test(k));
  if(forbidden.length) throw new Error(`ANSWER_BEARING_FIELDS_PRESENT:q${qid}`);
  return item;
});
const priorAssets=oldBundle.assetManifest||[];
if(priorAssets.length!==3) throw new Error(`ASSET_COUNT_NOT_THREE:${priorAssets.length}`);
const assetManifest=priorAssets.map(asset=>{
  const abs=path.resolve(assetRoot,asset.path);
  const bytes=fs.readFileSync(abs);
  const digest=sha(bytes);
  if(digest!==asset.sha256||bytes.length!==asset.bytes) throw new Error(`ASSET_BYTE_PARITY_FAILED:${asset.path}`);
  const q=sourceByQid.get(Number(asset.qid));
  if((q.image??null)!==asset.path) throw new Error(`ASSET_REFERENCE_PARITY_FAILED:q${asset.qid}`);
  return {qid:Number(asset.qid),path:asset.path,sha256:digest,bytes:bytes.length};
});
const assetQids=items.filter(x=>x.image).map(x=>x.id).sort((a,b)=>a-b);
if(JSON.stringify(assetQids)!==JSON.stringify(assetManifest.map(x=>x.qid).sort((a,b)=>a-b))) throw new Error('ASSET_REFERENCE_COVERAGE_MISMATCH');
const studentPayloadSha256=sha(Buffer.from(JSON.stringify({items,assetManifest,artifactRawSha256:expectedRaw}),'utf8'));
const bundle={
 schemaVersion:'JS_ARCHIVE_CODEX_STUDENT_ONLY_BUNDLE_V1',runId:oldBundle.runId,examUid:oldBundle.examUid,stage:'R2_R3_POSTFREEZE_Q5_CORRECTION',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
 assignmentSha256:assignmentSha,sourceRosterSha256:expectedRosterSha,sourceBundleSha256:oldBundle.sourceBundleSha256,
 sourceBundleLineage:[...(oldBundle.sourceBundleLineage||[]),{qidScope:'1-22 pre-q5 correction current-final candidate',path:oldBundleFile,sha256:expectedOldBundleSha}],
 artifactSha:patchManifest.newArtifactBlobSha1,artifactRawSha256:expectedRaw,denominator:22,qids,items,assetManifest,
 postfreezeCorrection:{qid:5,issueCode:'Q5_CHOICE_TEX_BACKSLASH_MISSING',patchManifestPath:patchManifestFile,patchManifestSha256:sha(fs.readFileSync(patchManifestFile)),priorR1AnswerFreezeSha256:'e64c120c617680ed1b81be95fb54bb8fd99c6aaa0ca9c1f6c030b4a19d7c8ec2',priorR2AggregateFreezeSha256:'b6e687990a6cddf1161cff2c53776d6974e9ae289c116c519b10d006560eb70b'},
 studentPayloadSha256,
 verification:{qidOrder:'PASS',studentFieldCoverage:'22/22',assetReferenceCoverage:'3/3',assetShaParity:'PASS',assetByteParity:'PASS',payloadShaParity:'PASS',answerOrSolutionFieldsIncluded:false,sourceRosterBound:true,exactCurrentArtifactBound:true,sourceStudentPayloadParity:'PASS',q5SemanticChoiceValuesUnchanged:true,nonQ5StudentFieldsUnchanged:true}
};
fs.writeFileSync(outputFile,`${JSON.stringify(bundle,null,2)}\n`,'utf8');
const outputSha=sha(fs.readFileSync(outputFile));
console.log(JSON.stringify({outputFile,outputSha256:outputSha,studentPayloadSha256,artifactRawSha256:expectedRaw,artifactSha:bundle.artifactSha,denominator:items.length,assetCount:assetManifest.length,assetShaParity:'PASS',answerOrSolutionFieldsIncluded:false,q5Choices:items.find(i=>i.id===5).choices},null,2));

