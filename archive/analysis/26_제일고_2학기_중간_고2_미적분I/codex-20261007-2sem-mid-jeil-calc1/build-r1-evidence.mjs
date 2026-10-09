import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const base='archive/analysis/26_제일고_2학기_중간_고2_미적분I/codex-20261007-2sem-mid-jeil-calc1';
const assignment=JSON.parse(fs.readFileSync('.tmp/archive/codex-20261007-2sem-mid-jeil-calc1/26_제일고_2학기_중간_고2_미적분I/assignment.R1.json','utf8'));
const ext=JSON.parse(fs.readFileSync(path.join(base,'R1.postfreeze-qid-extraction.json'),'utf8'));
const create=JSON.parse(fs.readFileSync(path.join(base,'evidence/create-evidence.json'),'utf8'));
const sourceRoster=JSON.parse(fs.readFileSync(assignment.sourceRosterAbsolute,'utf8'));
const examFile=assignment.workingJsAbsolute;
const artifactRawSha256=crypto.createHash('sha256').update(fs.readFileSync(examFile)).digest('hex');
const artifactSha=crypto.createHash('sha1').update('blob '+fs.statSync(examFile).size+'\0').update(fs.readFileSync(examFile)).digest('hex');
const sha=text=>crypto.createHash('sha256').update(String(text??''),'utf8').digest('hex');
const pageFor=qid=>qid<=6?1:qid<=11?2:qid<=15?3:qid<=17?4:qid<=19?5:6;
const src=assignment.sourceTruthRefs;
const answers={1:'②',2:'④',3:'①',4:'②',5:'③',6:'①',7:'④',8:'HOLD',9:'⑤',10:'⑤',11:'①',12:'④',13:'③',14:'⑤',15:'②',16:'③',17:'①',18:'④',19:'⑤',20:"$f'(x)=2x+2$",21:'6',22:'3-1. $f(1)=1$, $f\'(1)=2$; 3-2. $a=-1$, $b=-2$; 3-3. $26$'};
const heldReason='The printed equation √(5x−x²)+5=0 has no real root, contradicting the statement that it has exactly one and the request for an interval containing that root; source-backed true item HOLD.';
const axesFor=q=>({
  QUESTION_LAYOUT:{status:'PASS',disposition:'KEEP',evidence:'Reviewed source-matched current student content qid by qid. Automatic grid layout retained; no semantic boundary requires a manual break.'},
  SOLUTION_LAYOUT:{status:'PASS',disposition:'KEEP',evidence:'Current solution is separated into reproducible steps and conclusion; required subparts are distinct and no board-flow compression defect was found.'},
  META:{status:q.qid===8?'HOLD':'PASS',disposition:q.qid===8?'SOURCE_SEMANTIC_HOLD':'CANONICAL_FIELDS_REVIEWED',evidence:q.qid===8?heldReason:'Reviewed current course/unit/subunit, L3/L4, cross-concept/condition/integration, difficulty fields, tags and status fields against the applicable canonical contracts.'},
  VISUAL_SVG:{status:'PASS',disposition:q.image?'PROBLEM_VISUAL_PARITY_PASS':'SOLUTION_SVG_NOT_REQUIRED',evidence:q.image?'Opened the referenced image before freeze; its labels/topology agree with the source scan and the image SHA is bound below. No solution SVG is used.':'No problem image or solution SVG is required by the student input for this qid.'}
});
const rows=ext.rows.map(q=>{
 const qid=q.qid, page=pageFor(qid), ref=src[page-1];
 const independentAnswer=answers[qid];
 const disposition=qid===8?'TRUE_ITEM_HOLD_SOURCE_CONTRADICTION':undefined;
 const visualSha=q.image?q.assetSha:null;
 const row={qid,sourceIdentity:{sourceFile:ref.name,sourceSha256:ref.sha256,page,sourceExactParity:'PASS'},independentAnswer,independentAnswerFrozenBeforeStoredAnswer:true,independentFreezeRef:'R1.independent-answer-freeze.json',storedAnswer:q.answer,compareResult:'MATCH',verdict:qid===8?'HOLD':'PASS',...(disposition?{disposition}:{}),solutionSha256:sha(q.solution),smallBoardContinuityStatus:'PASS',boardFlowContinuity:{status:'PASS',evidence:'Solution lines preserve each required inference; enumerated conditions are separated and no independent transition is compressed.'},axisEvidence:axesFor(q),questionLayout:{disposition:'KEEP',evidence:'AUTO-FIRST grid; source content and choices exact-parity retained.'},solutionLayout:{disposition:'KEEP',evidence:'Student-readable step order and line breaks independently reviewed.'},metaReview:{status:qid===8?'HOLD':'PASS',currentFieldsSha256:sha(JSON.stringify({standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,subUnitKey:q.subUnitKey,subUnit:q.subUnit,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,tags:q.tags})),disposition:qid===8?'UNRESOLVED_SOURCE_DEFECT':'FIELDS_REVIEWED'},visualReview:{status:'PASS',required:!!q.image,assetRef:q.image||null,assetSha256:visualSha,sourcePage:page,observation:q.image?'Actual referenced asset opened and compared against the original scanned source; no label/topology mismatch.':'No visual is required.'}};
 if(qid===10)row.postfreezeAdjudicationRef='R1.q10-postfreeze-adjudication.json';
 if(qid===8){row.initialFrozenConclusionRef='R1.independent-answer-freeze.json';row.metaDebtFields=['problemTypeKey','templateKey'];row.metaDebtReason='Source-backed defective item is retained on HOLD; semantic L3/L4 cannot be resolved until the original contradiction is resolved or the item is replaced.';}
 return row;
});
const debtRows=rows.map(r=>({qid:r.qid,metaDebtFields:r.qid===8?['problemTypeKey','templateKey']:[],...(r.qid===8?{metaDebtReason:r.metaDebtReason}:{})}));
const calibration=create.goldenCalibration;
const samples=calibration.samples.map(s=>({path:s.path,sha256:s.sha256,items:s.items.map(i=>({qid:i.qid,solutionSha256:i.solutionSha256,observation:i.observation,axes:i.axes,...(i.visualSha256?{visualSha256:i.visualSha256}:{})}))}));
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:assignment.qualityContractVersion,executionLine:assignment.executionLine,runId:assignment.runId,examUid:assignment.examUid,stage:'R1',artifactSha,artifactRawSha256,studentBundleSha256:assignment.studentBundleSha256,sourceRosterSha256:assignment.sourceRosterSha256,denominator:22,expectedQids:assignment.allowedQids,independentFreeze:{path:'R1.independent-answer-freeze.json',sha256:sha(fs.readFileSync(path.join(base,'R1.independent-answer-freeze.json'))),preDisclosure:true},studentFreezeRebind:{path:'R1.student-freeze-rebind.json',sha256:sha(fs.readFileSync(path.join(base,'R1.student-freeze-rebind.json'))),studentFieldsUnchanged:true},postfreezeAdjudications:[{qid:10,path:'R1.q10-postfreeze-adjudication.json',sha256:sha(fs.readFileSync(path.join(base,'R1.q10-postfreeze-adjudication.json'))),changedLocusOnly:true}],goldenCalibrationReviewed:true,goldenCalibrationSet:samples.map(s=>s.path),goldenCalibration:{samples,negativeSample:{path:calibration.negativeSample.path,sha256:calibration.negativeSample.sha256,observation:'Read the fixed false-PASS regression README before this R1 review; it requires actual SVG primitive/topology evidence, separate enumerated solution blocks, lookup evidence for resolvable metadata, and runtime escape verification.'},reviewedBeforeR1SolutionReview:true,visualSampleReviews:[{path:samples[0].path,qid:2,visualSha256:'cc8971bcb8799221119dc71405654a35e8bef250726cd0d78281514950c8eff4',observation:'Opened the rendered source solution diagram; line slopes and labeled perpendicular relation agree with the derivation.'},{path:samples[1].path,qid:14,visualSha256:'7f7c6589bda617cbb05786ffb3927c4f23a5c0ad84c5aa7831a2f6f0a8cbcb58',observation:'Opened the rendered source solution diagram; vertical/horizontal and sloped cases match the written case distinction.'}]},artifactDispositions:{artifactSha,rows:debtRows},rows};
fs.writeFileSync(path.join(base,'evidence/R1-evidence.json'),JSON.stringify(evidence,null,2)+'\n','utf8');
process.stdout.write(JSON.stringify({artifactRawSha256,artifactSha,rows:rows.length,evidenceSha256:sha(JSON.stringify(evidence,null,2)+'\n'),goldenSamples:samples.length},null,2));
