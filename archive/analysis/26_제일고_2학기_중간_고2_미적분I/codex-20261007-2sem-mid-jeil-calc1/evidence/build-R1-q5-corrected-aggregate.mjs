import fs from 'node:fs';
import crypto from 'node:crypto';
const oldEvidencePath=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-evidence.q8-fresh-aggregate.json`;
const oldBundlePath=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\handoff\R3.current-final-student-only-bundle.q5-corrected.json`;
const patchManifestPath=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-q5-correction-patch-manifest.json`;
const outPath=String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-evidence.q5-corrected-aggregate.json`;
const expectedOldEvidenceSha='e5aa02d4ea300995b1e79b24732527974d7e2bfb2bc057d0e25c0409f2a666a6';
const expectedOldRaw='5024ab6365b997669b47edfa0985900d8adfef50db7523ef9f6924787585198c';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const oldBytes=fs.readFileSync(oldEvidencePath);
if(sha(oldBytes)!==expectedOldEvidenceSha)throw new Error('PRIOR_R1_AGGREGATE_SHA_MISMATCH');
const old=JSON.parse(oldBytes.toString('utf8'));
const bundleBytes=fs.readFileSync(oldBundlePath);const bundle=JSON.parse(bundleBytes.toString('utf8'));
const patchBytes=fs.readFileSync(patchManifestPath);const patch=JSON.parse(patchBytes.toString('utf8'));
if(patch.oldArtifactRawSha256!==expectedOldRaw)throw new Error('PATCH_SOURCE_BINDING_INVALID');
if(old.rows?.length!==22||bundle.items?.length!==22)throw new Error('FULL_DENOMINATOR_REQUIRED');
const row5=old.rows.filter(r=>Number(r.qid)===5);
if(row5.length!==1)throw new Error('PRIOR_Q5_R1_ROW_CARDINALITY');
const priorQ5=row5[0];
if(priorQ5.independentAnswerFrozenBeforeStoredAnswer!==true||!priorQ5.independentFreezeRef||!priorQ5.independentAnswer||!priorQ5.storedAnswer)throw new Error('PRIOR_Q5_FREEZE_BINDING_REQUIRED');
if(String(priorQ5.compareResult).toUpperCase()!=='MATCH')throw new Error('PRIOR_Q5_ANSWER_COMPARE_NOT_MATCH');
const correctedQ5={...priorQ5,
  axisEvidence:{...(priorQ5.axisEvidence||{}),QUESTION_LAYOUT:{status:'PASS',disposition:'MINIMAL_TEX_ENCODING_CORRECTION_STATIC_PASS',evidence:'Bound original R3 captures show q5 choices[0], [1], [3] rendered malformed in exam desktop/mobile. The only source-byte edits add the missing TeX command backslashes and braces, preserving the same values -5/2, -5/3, and 7/3. Current q5 choices extract as $-\\dfrac{5}{2}$, $-\\dfrac{5}{3}$, $4$, $\\dfrac{7}{3}$, $6$. Student content/choices otherwise unchanged. Actual R3 re-render remains pending.'}},
  questionLayout:{disposition:'MINIMAL_TEX_ENCODING_CORRECTION_STATIC_PASS',evidence:'Corrected only q5 choices[0], choices[1], choices[3] TeX encoding after the bound R3 exam desktop/mobile FAIL. Exact semantic values and the other two choices are unchanged; all bytes outside those three q5 choice string literals are unchanged. Static R1 correction passes; actual renderer retest remains R3-owned.'}
};
const unchangedRows=old.rows.filter(r=>Number(r.qid)!==5);
const qids=Array.from({length:22},(_,i)=>i+1);
if(JSON.stringify([...unchangedRows.map(r=>Number(r.qid)),5].sort((a,b)=>a-b))!==JSON.stringify(qids))throw new Error('R1_ROW_DENOMINATOR_INVALID');
const dispositions=old.artifactDispositions;
if(!dispositions||dispositions.rows?.length!==22)throw new Error('FULL_ARTIFACT_DISPOSITIONS_REQUIRED');
const newEvidence={...old,
  artifactSha:patch.newArtifactBlobSha1,
  artifactRawSha256:patch.newArtifactRawSha256,
  studentBundleSha256:sha(bundleBytes),
  currentStudentBundlePath:oldBundlePath,
  currentStudentPayloadSha256:bundle.studentPayloadSha256,
  studentBundleScope:{qidCoverage:'1-22',denominator:22,assetCount:3},
  artifactDispositions:{...dispositions,artifactSha:patch.newArtifactBlobSha1},
  rows:old.rows.map(r=>Number(r.qid)===5?correctedQ5:r)
};
const nonQ5After=newEvidence.rows.filter(r=>Number(r.qid)!==5);
for(const before of unchangedRows){const after=nonQ5After.find(r=>Number(r.qid)===Number(before.qid));if(JSON.stringify(before)!==JSON.stringify(after))throw new Error(`UNRELATED_R1_ROW_CHANGED:q${before.qid}`)}
if(JSON.stringify(old.artifactDispositions.rows)!==JSON.stringify(newEvidence.artifactDispositions.rows))throw new Error('META_DISPOSITIONS_CHANGED');
fs.writeFileSync(outPath,`${JSON.stringify(newEvidence,null,2)}\n`,'utf8');
console.log(JSON.stringify({outPath,outSha256:sha(fs.readFileSync(outPath)),denominator:newEvidence.rows.length,unchangedQidsPreserved:unchangedRows.length,q5FreezePreserved:correctedQ5.independentFreezeRef===priorQ5.independentFreezeRef&&correctedQ5.independentAnswer===priorQ5.independentAnswer&&correctedQ5.storedAnswer===priorQ5.storedAnswer,nonQ5RowsUnchanged:true,artifactDispositionsCount:newEvidence.artifactDispositions.rows.length,newArtifactRawSha256:newEvidence.artifactRawSha256,newArtifactBlobSha1:newEvidence.artifactSha,studentBundleSha256:newEvidence.studentBundleSha256},null,2));
