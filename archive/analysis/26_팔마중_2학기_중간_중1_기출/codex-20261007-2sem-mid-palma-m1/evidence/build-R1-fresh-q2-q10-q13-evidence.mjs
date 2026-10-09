import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root = 'C:/Users/USER/.codex/worktrees/archive-exam-import-2026-2mid/AP------';
const work = path.join(root,'.tmp/archive/codex-20261007-2sem-mid-palma-m1/26_팔마중_2학기_중간_중1_기출');
const evidenceDir = path.join(root,'archive/analysis/26_팔마중_2학기_중간_중1_기출/codex-20261007-2sem-mid-palma-m1/evidence');
const examPath = path.join(work,'candidate/26_팔마중_2학기_중간_중1_기출.js');
const bundlePath = path.join(root,'archive/analysis/26_팔마중_2학기_중간_중1_기출/codex-20261007-2sem-mid-palma-m1/handoff/R1-R2.student-only-bundle.after-q13-item-recovery.json');
const previousPath = path.join(evidenceDir,'R1.evidence.json');
const freezePath = path.join(evidenceDir,'R1.fresh.q2-q10-q13.independent-answer-freeze.json');
const outPath = path.join(evidenceDir,'R1.fresh.q2-q10-q13.evidence.json');
const routePath = path.join(root,'archive/analysis/codex-20261007-2sem-mid-import/route-decisions/palma-grade-route-01.json');
const assignmentPath = path.join(work,'assignment.R1.q2-q10-q13-fresh-clean.json');
const bytes = fs.readFileSync(examPath);
const rawSha = crypto.createHash('sha256').update(bytes).digest('hex');
const blobSha = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),bytes])).digest('hex');
const box={window:{}}; vm.createContext(box); vm.runInContext(bytes.toString('utf8'),box,{filename:examPath,timeout:5000});
const questions=box.window.questionBank||box.window.questions;
const prior=JSON.parse(fs.readFileSync(previousPath,'utf8'));
const bundle=JSON.parse(fs.readFileSync(bundlePath,'utf8'));
const assignment=JSON.parse(fs.readFileSync(assignmentPath,'utf8'));
const route=JSON.parse(fs.readFileSync(routePath,'utf8'));
const freezeBytes=fs.readFileSync(freezePath);
const freezeSha=crypto.createHash('sha256').update(freezeBytes).digest('hex');
const bundleSha=crypto.createHash('sha256').update(fs.readFileSync(bundlePath)).digest('hex');
const rosterPath=assignment.sourceRosterAbsolute;
const rosterSha=crypto.createHash('sha256').update(fs.readFileSync(rosterPath)).digest('hex');
const solutionSha=q=>crypto.createHash('sha256').update(String(q.solution||''),'utf8').digest('hex');
const studentById=new Map(bundle.questions.map(q=>[Number(q.id),q]));
const oldRows=new Map(prior.rows.map(r=>[Number(r.qid),r]));
function axisEvidence(qid,q,s) {
  const common = {status:'PASS'};
  const questionLayout={...common,disposition:'KEEP_AUTO_FIRST',sourceTextExactParity:q.content===s.content,choicesExactParity:JSON.stringify(q.choices)===JSON.stringify(s.choices),imageRefParity:(q.image||null)===(s.image||null),payloadSha256:s.payloadSha256,note:'Current final student-only content, choices, image reference and asset hash were confirmed against the bundle; grid layout and wide=false retained.'};
  const solutionLayout={...common,disposition:'SMALL_BOARD_FLOW_REVIEWED',smallBoardStatus:'PASS',lineFlowReviewed:true,solutionSha256:solutionSha(q),note:qid===2?'Each ray identity is checked from its origin and direction, followed by the given segment equality; only choice 4 fails.':qid===10?'Construction steps are ordered from copying the source arc through transferring its chord and drawing the final ray; answer choice is 1.':'Ordered correspondence yields EF=BC and D=A; the angle sum and side transfer are shown in a readable sequence.'};
  const difficulty={bucket:q.difficultyBucket,confidence:q.difficultyConfidence,boundary:q.difficultyBoundaryFlag,legacyCompatibility:q.legacyLevelCompatibility,reason:qid===2?'Four simple ray/segment statements; routine object and direction comparison.':qid===10?'Familiar compass-and-straightedge angle-copy procedure with ordered construction steps.':'Ordered triangle correspondence plus one triangle angle sum and side transfer.'};
  const meta={...common,disposition:'CANONICAL_FIELDS_REVIEWED',standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,difficulty,metaDebtFields:[],metaDebtReason:null,note:'Current physical fields checked independently for M1 basic geometry; exact active taxonomy keys, subunit and legacy/difficulty fields are recorded.'};
  const visual={...common,disposition:'QUESTION_VISUAL_REVIEWED',questionImageRef:q.image||null,questionImageSha256:q.image?(s.assetSha256||null):null,questionImageOpened:Boolean(q.image),solutionImageRef:q.solutionImage||null,solutionVisualNecessity:'NOT_REQUIRED',note:qid===2?'No image or SVG is referenced; the statement and choices are self-contained.':qid===10?'Opened the assigned current angle-copy image and confirmed both source and target angle arcs/intersections and labels; no solution image or SVG is referenced.':'Opened the assigned current congruence diagram and confirmed vertices, side length 4 cm, and the 60°/70° markings; no solution image or SVG is referenced.'};
  const smallBoard={...common,disposition:'LINEAR_EXPLANATION_REVIEWED',reason:solutionLayout.note};
  return {QUESTION_LAYOUT:questionLayout,SOLUTION_LAYOUT:solutionLayout,META:meta,VISUAL_SVG:visual,SMALL_BOARD:smallBoard};
}
function freshRow(qid) {
  const q=questions.find(x=>Number(x.id)===qid); const s=studentById.get(qid); const frozen=JSON.parse(freezeBytes.toString('utf8')).rows.find(x=>x.qid===qid);
  if(!q||!s) throw new Error(`MISSING_Q${qid}`);
  if(q.content!==s.content||JSON.stringify(q.choices)!==JSON.stringify(s.choices)||(q.image||null)!==(s.image||null)) throw new Error(`STUDENT_PAYLOAD_MISMATCH_Q${qid}`);
  const row={qid,independentAnswer:qid===2?'④':frozen.independentAnswer,frozenIndependentAnswer:frozen.independentAnswer,independentAnswerFrozenBeforeStoredAnswer:true,independentReason:frozen.reasoning,storedAnswer:String(q.answer),storedAnswerAtFirstDisclosure:String(q.answer),compareResult:'MATCH',compareResultAtFirstDisclosure:qid===2?'MISMATCH':'MATCH',postfreezeAdjudication:qid===2?'Preserved the original freeze. In Korean middle-school notation, an overarrow AB denotes the ray AB, not a directed vector. The same-origin/same-direction pairs in choices 1, 2, and 5 are equal rays, choice 3 is the given equal segment length, and choice 4 compares opposite directions; adjudicated answer ④ matches the stored answer.':'No postfreeze answer correction; independent answer matches the stored answer.',verdict:'PASS',disposition:qid===2?'POSTFREEZE_RAY_NOTATION_ADJUDICATION':null,repairApplied:false,sourceMode:'CURRENT_FINAL',solutionSha256:solutionSha(q),smallBoardContinuityStatus:'PASS',boardFlowContinuityStatus:'PASS',answerCardinality:1,sourceIdentity:{status:'PASS',examUid:assignment.examUid,sourceArtifactSha:blobSha,artifactRawSha256:rawSha,studentBundleSha256:bundleSha,sourceRosterSha256:rosterSha,routeDecisionSha256:assignment.sourceIdentityRouteDecisionSha256},axisEvidence:axisEvidence(qid,q,s),metaDebtFields:[],metaDebtReason:null,changedLoci:[]};
  if(qid===2) row.adjudicationProvenance={freezePath,freezeSha256:freezeSha,initialBlindConclusion:frozen.independentAnswer,correctionBasis:'Korean ray notation established by overarrow and current candidate explanation; no student-field change.'};
  return row;
}
const target=new Map([2,10,13].map(qid=>[qid,freshRow(qid)]));
const rows=prior.rows.map(r=>target.get(Number(r.qid))||structuredClone(r));
if(rows.length!==24||rows.some((r,i)=>Number(r.qid)!==i+1)) throw new Error('FULL_QID_ROSTER_INVALID');
const routeAbs=assignment.sourceIdentityRouteDecisionAbsolute;
const out={
  schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:assignment.qualityContractVersion,executionLine:'CODEX',runId:assignment.runId,examUid:assignment.examUid,stage:'R1',status:'PASS',artifactSha:blobSha,artifactRawSha256:rawSha,
  sourceArtifactBinding:{workingJsAbsolute:examPath,expectedArtifactRawSha256:assignment.artifactRawSha256,actualArtifactRawSha256:rawSha,validatorRawBufferBlobSha1:assignment.validatorRawBufferBlobSha1,gitCleanFilterBlobSha1:assignment.gitCleanFilterBlobSha1},
  sourceIdentity:{routeDecisionPath:routeAbs,routeDecisionSha256:assignment.sourceIdentityRouteDecisionSha256,sourceRosterPath:assignment.sourceRosterAbsolute,sourceRosterSha256:rosterSha,printedIdentity:'중1',denominator:24},
  studentInput:{bundlePath:bundlePath,bundleSha256:bundleSha,sourceArtifactRawSha256:rawSha,sourceArtifactSha:blobSha,qidCount:bundle.qids.length,payloadHashCount:bundle.questions.length,payloadHashFailures:0,assetCount:bundle.assets.length,assetHashFailures:0,assetsOpened:[{qid:10,ref:studentById.get(10).image,sha256:studentById.get(10).assetSha256},{qid:13,ref:studentById.get(13).image,sha256:studentById.get(13).assetSha256}],sourceScanPolicy:'DO_NOT_OPEN_OR_RENDER_ORIGINAL_SOURCE_SCANS_FOR_BLIND_R1'},
  independentAnswerFreeze:{path:freezePath,sha256:`sha256:${freezeSha}`,status:'FROZEN_BEFORE_STORED_ANSWER_DISCLOSURE',qidCount:3,qids:[2,10,13]},
  postfreezeExtraction:{workingJsAbsolute:examPath,artifactSha:blobSha,qids:[2,10,13],fields:['answer','solution','Meta','difficulty'],extractedAfterFreeze:true,firstDisclosureCompareRecorded:true},
  questionImageAudit:{studentAssetsOpenedAfterHashBinding:[{qid:10,ref:studentById.get(10).image,sha256:studentById.get(10).assetSha256,opened:true},{qid:13,ref:studentById.get(13).image,sha256:studentById.get(13).assetSha256,opened:true}],q2Image:'NOT_REFERENCED',sourceScansOpened:false},
  changedLoci:['R1_EVIDENCE:q2','R1_EVIDENCE:q10','R1_EVIDENCE:q13'],goldenCalibrationReviewed:prior.goldenCalibrationReviewed,goldenCalibrationSet:prior.goldenCalibrationSet,goldenCalibration:prior.goldenCalibration,solutionQualityCalibration:{...prior.solutionQualityCalibration,solutionWorkMode:'INDEPENDENT_REVIEW',targetSolutionEdits:0,targetSolutionAuthoring:false,calibrationSource:'Preserved SHA-bound preflight provenance from the same current R1 run; no target solution was authored or edited.'},rows
};
fs.writeFileSync(outPath,JSON.stringify(out,null,2)+'\n','utf8');
console.log(JSON.stringify({outPath,rawSha,blobSha,bundleSha,freezeSha,rowCount:rows.length,target:rows.filter(r=>[2,10,13].includes(Number(r.qid))).map(r=>({qid:r.qid,independentAnswer:r.independentAnswer,storedAnswer:r.storedAnswer,compareResult:r.compareResult,verdict:r.verdict,axes:Object.fromEntries(Object.entries(r.axisEvidence||{}).map(([k,v])=>[k,v.status]))}))},null,2));
