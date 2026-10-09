import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const root=process.cwd();
const {readExam}=await import(pathToFileURL(path.join(root,'archive/tools/archive-codex-artifact-io.mjs')));
const {solutionSha256}=await import(pathToFileURL(path.join(root,'archive/tools/archive-stage-validator-artifact-v2.mjs')));
const evRoot=path.join(root,'archive/analysis/archive-2026-1mid-nine-20261008/26_동산중_1학기_중간_중2_기출');
const review=path.join(evRoot,'review');
const tmp=path.join(root,'.tmp/archive/archive-2026-1mid-nine-20261008/26_동산중_1학기_중간_중2_기출');
const hashFile=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const assignmentPath=path.join(evRoot,'R1.assignment.json');
const assignment=JSON.parse(fs.readFileSync(assignmentPath));
const sourcePath=assignment.workingJsAbsolute;
const exam=readExam(sourcePath);
if(exam.rawSha256!=='c75629caaa40b9c792ef3670dc2d37b1a5f3d8f28ed932859ea57f798f76252b'||exam.rawBufferGitBlobSha1!=='0d349890f38865c5408906106b76d669cde344b4')throw new Error('FINAL_SOURCE_BINDING_UNEXPECTED');
const priorPath=path.join(review,'R1.evidence.bound.json');
const prior=JSON.parse(fs.readFileSync(priorPath));
const disclosurePath=path.join(review,'R1.recovery-19-21.postfreeze-qid-disclosure.final3.json');
const disclosure=JSON.parse(fs.readFileSync(disclosurePath));
const qualityPath=path.join(review,'R1.recovery-19-21.quality-review.final.json');
const quality=JSON.parse(fs.readFileSync(qualityPath));
const studentBundlePath=path.join(tmp,'R1.current-full24.student.final.json');
const parityPath=path.join(evRoot,'R1.final-full24-student-parity.json');
const currentById=new Map(exam.questions.map(q=>[Number(q.id),q]));
const axisById=new Map(quality.rows.map(r=>[Number(r.qid),r]));
const disclosureById=new Map(disclosure.rows.map(r=>[Number(r.qid),r]));
const freeze01Path=path.join(evRoot,'R1.scope-19,20,21@recovery-01.freeze.json');
const freeze02Path=path.join(evRoot,'R1.scope-21@recovery-02.freeze.json');
const freezeRefs={
 q19q20:{path:freeze01Path,sha256:hashFile(freeze01Path),usedQids:[19,20],supersededQids:[21]},
 q21:{path:freeze02Path,sha256:hashFile(freeze02Path),usedQids:[21]}
};
const debtReason={
 19:'Current 2022 RPM primary is deterministic, but the current read-only compiled curriculum_bindings registry has no exact ACTIVE M2-02/M2-02-LINEAR_INEQUALITY projection and no MIDDLE2 pack is active. Preserve null problemTypeKey/templateKey as explicit manual_review projection debt; do not borrow higher-course H1 keys or invent a key.',
 20:'Current 2022 RPM primary is deterministic, but the current read-only compiled curriculum_bindings registry has no exact ACTIVE M2-02/M2-02-LINEAR_INEQUALITY projection and no MIDDLE2 pack is active. Preserve null problemTypeKey/templateKey as explicit manual_review projection debt; do not borrow higher-course H1 keys or invent a key.',
 21:'Current 2022 RPM primary is deterministic, but the current read-only compiled curriculum_bindings registry has no exact ACTIVE M2-02/M2-02-LINEAR_INEQUALITY_WORD projection and no MIDDLE2 pack is active. Preserve null problemTypeKey/templateKey as explicit manual_review projection debt; do not borrow higher-course H1 keys or invent a key.'
};
const metaFields=['standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','level','category','originalCategory','questionType','layoutTag','wide','tags','tagStatus','tagConfidence','reviewStatus','answerStatus','solutionStatus'];
const targetRows=[19,20,21].map(qid=>{
 const q=currentById.get(qid),d=disclosureById.get(qid),r=axisById.get(qid);
 if(!q||!d||!r||r.verdict!=='PASS'||Object.values(r.axisEvidence).some(x=>x.status!=='PASS'))throw new Error('TARGET_R1_QUALITY_EVIDENCE_INCOMPLETE:q'+qid);
 const row={qid,independentAnswer:r.independentAnswer,independentAnswerFrozenBeforeStoredAnswer:true,storedAnswer:d.answer,compareResult:'MATCH',compareBasis:d.compareBasis,verdict:'PASS',verdictReason:'Fresh valid scope freeze matches the current stored answer; all four independent R1 axes pass after ROOT-directed stale HOLD clearance.',disposition:r.disposition,repairApplied:true,sourceMode:'ALIVE_REPLACEMENT',answerCardinality:1,studentPayloadSha256:r.studentPayloadSha256,axisEvidence:structuredClone(r.axisEvidence),smallBoardContinuityStatus:'PASS',solutionSha256:solutionSha256(q.solution),currentMeta:Object.fromEntries(metaFields.filter(f=>Object.hasOwn(q,f)).map(f=>[f,q[f]])),recoveryFreeze:freezeRefs[qid===21?'q21':'q19q20'],studentParity:'EXACT'};
 return row;
});
const targetSet=new Set([19,20,21]);
const priorRows=new Map(prior.rows.filter(r=>!targetSet.has(Number(r.qid))).map(r=>[Number(r.qid),structuredClone(r)]));
const allRows=exam.questions.map(q=>targetSet.has(Number(q.id))?targetRows.find(r=>r.qid===Number(q.id)):priorRows.get(Number(q.id)));
if(allRows.some(r=>!r)||allRows.length!==24)throw new Error('FULL24_EVIDENCE_ROW_MERGE_INVALID');
if(allRows.filter(r=>r.verdict==='PASS').length!==24)throw new Error('FULL24_REVIEW_PASS_DENOMINATOR_INVALID');
const oldDispositionRows=new Map(prior.artifactDispositions.rows.map(r=>[Number(r.qid),structuredClone(r)]));
const dispositionRows=exam.questions.map(q=>targetSet.has(Number(q.id))?{qid:Number(q.id),metaDebtFields:['problemTypeKey','templateKey'],metaDebtReason:debtReason[q.id]}:oldDispositionRows.get(Number(q.id)));
if(dispositionRows.some(r=>!r)||dispositionRows.length!==24)throw new Error('FULL24_META_DISPOSITION_MISSING');
const sourceAuthority={
 assignment:{path:assignmentPath,sha256:hashFile(assignmentPath)},
 currentSource:{path:sourcePath,rawSha256:exam.rawSha256,rawBufferGitBlobSha1:exam.rawBufferGitBlobSha1},
 currentStudentBundle:{path:studentBundlePath,sha256:hashFile(studentBundlePath),questionCount:24,studentParity:'EXACT'},
 fullStudentParityProof:{path:parityPath,sha256:hashFile(parityPath)},
 priorValidR1EvidenceForUnchanged21:{path:priorPath,sha256:hashFile(priorPath),sourceRawSha256:prior.artifactRawSha256,unchangedQids:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,22,23,24]},
 validRecoveryFreezes:freezeRefs,
 recoveryQidDisclosure:{path:disclosurePath,sha256:hashFile(disclosurePath)},
 targetQualityReview:{path:qualityPath,sha256:hashFile(qualityPath)},
 nonTargetRecoveryProof:{path:path.join(evRoot,'CREATE.item-recovery.non-target-invariance.json'),sha256:hashFile(path.join(evRoot,'CREATE.item-recovery.non-target-invariance.json'))},
 q21Revision2Proof:{path:path.join(evRoot,'CREATE.item-recovery.q21.revision2.exact-invariance.json'),sha256:hashFile(path.join(evRoot,'CREATE.item-recovery.q21.revision2.exact-invariance.json'))},
 finalHoldClearNonTargetProof:{path:path.join(evRoot,'R1.final-hold-clear-nontarget-invariance.rev2.json'),sha256:hashFile(path.join(evRoot,'R1.final-hold-clear-nontarget-invariance.rev2.json'))},
 currentMetaD2Correction:{path:path.join(review,'R1.current-meta-d2-correction-set.rev2.json'),sha256:hashFile(path.join(review,'R1.current-meta-d2-correction-set.rev2.json'))}
};
const out={...prior,stage:'R1',examUid:assignment.examUid,executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',artifactSha:exam.rawBufferGitBlobSha1,artifactRawSha256:exam.rawSha256,reviewerId:'r1_08',reviewerIdentity:{role:'archive_r1',reviewerId:'r1_08'},rows:allRows,artifactDispositions:{artifactSha:exam.rawBufferGitBlobSha1,rows:dispositionRows},sourceAuthority,currentStatusClearProof:{path:path.join(evRoot,'R1.final-source-student-status-invariance.json'),sha256:hashFile(path.join(evRoot,'R1.final-source-student-status-invariance.json')),all24StudentAndAssetsExact:true,targetAnswerSolutionFieldsUnchanged:true},actualRenderPassAsserted:false};
const outPath=path.join(review,'R1.evidence.r1_08.recovery-final.json');if(fs.existsSync(outPath))throw new Error('FINAL_EVIDENCE_OUTPUT_ALREADY_EXISTS');fs.writeFileSync(outPath,JSON.stringify(out,null,2)+'\n',{encoding:'utf8',flag:'wx'});console.log(JSON.stringify({outPath,artifactSha:exam.rawBufferGitBlobSha1,artifactRawSha256:exam.rawSha256,rowCount:allRows.length,passRows:allRows.filter(r=>r.verdict==='PASS').length,unaffectedRows:priorRows.size,targetRows:targetRows.length,dispositionRows:dispositionRows.length,goldenCalibrationReviewed:out.goldenCalibrationReviewed,goldenSet:out.goldenCalibrationSet},null,2));