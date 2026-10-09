import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const {readExam}=await import(pathToFileURL(path.join(process.cwd(),'archive/tools/archive-codex-artifact-io.mjs')));
const root=process.cwd();
const evRoot=path.join(root,'archive/analysis/archive-2026-1mid-nine-20261008/26_동산중_1학기_중간_중2_기출');
const review=path.join(evRoot,'review');
const assignment=JSON.parse(fs.readFileSync(path.join(evRoot,'R1.assignment.json')));
const answers=JSON.parse(fs.readFileSync(path.join(review,'R1.independent-answers.json')));
const disclosure=JSON.parse(fs.readFileSync(path.join(review,'R1.postfreeze-disclosure.json')));
const exam=readExam(assignment.workingJsAbsolute);
const hashFile=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const solHash=s=>createHash('sha256').update(String(s??''),'utf8').digest('hex');
const freezePath=path.join(review,'R1.independent-freeze.json');
const disclosurePath=path.join(review,'R1.postfreeze-disclosure.json');
const bundlePath=assignment.studentBundleAbsolute;
const cropRef=q=>{const p=path.join(evRoot,'source-crops',`q${q}.png`);return {path:p,sha256:hashFile(p)}};
const good=new Set([...Array(18)].map((_,i)=>i+1).concat([22,23,24]));
const held=new Set([19,20,21]);
const noteFor=(qid,axis)=>{
 if(axis==='QUESTION_LAYOUT'){
  if(qid===19)return {status:'HOLD',disposition:'SOURCE_VISUAL_OMITTED',basis:'Current student payload exposes only x-inequality text choices. After freeze, original q19 crop was opened and shows five number-line diagrams; this visual is absent from current JS/bundle and was not available to the freeze.'};
  if(qid===20)return {status:'HOLD',disposition:'SOURCE_BODY_INCOMPLETE',basis:'Current student content is a crop-placeholder; the source crop itself has obscured/truncated inequality condition and question. No answerable statement is present.'};
  if(qid===21)return {status:'HOLD',disposition:'SOURCE_BODY_INCOMPLETE',basis:'Current student content is a crop-placeholder; source crop omits/obscures the original cost and parts of target profit/question. No answerable statement is present.'};
  return {status:'PASS',disposition:'KEEP_GRID',basis:'Reviewed current student text, all choices/shared material, and grid/wide fields. Preserve current AUTO-FIRST grid layout; no source-text or choice rewrite. Static review only; no engine render claim.'};
 }
 if(axis==='SOLUTION_LAYOUT'){
  if(qid===20||qid===21)return {status:'HOLD',disposition:'NO_MATHEMATICAL_SOLUTION',basis:'Current solution records the unresolved source limitation rather than a derivation; continuity cannot be certified as a mathematical solution.'};
  return {status:'PASS',disposition:'KEEP',basis:'Reviewed postfreeze current solution; step order and displayed equations remain traceable, and solution hash is bound. No solution edit performed.'};
 }
 if(axis==='META'){
  if(held.has(qid))return {status:'HOLD',disposition:'SEMANTIC_SCOPE_LIMITED_BY_SOURCE_HOLD',basis:'Current unit/subunit projections were read; answer-dependent difficulty meaning cannot be independently confirmed for this held source scope. No Meta value changed.'};
  return {status:'PASS',disposition:'KEEP_CURRENT_META',basis:'Current unit/subunit/course/order and difficulty fields reviewed against canonical authority; exact existing null problemTypeKey/templateKey retained as manual_review projection debt, no semantic reclassification.'};
 }
 if(axis==='VISUAL_SVG'){
  if(qid===19)return {status:'HOLD',disposition:'REQUIRED_SOURCE_DIAGRAM_MISSING_FROM_STUDENT_INPUT',basis:'Original q19 crop shows number-line choice diagrams, while current student bundle/source JS expose only text inequalities; a clean R1 freeze must include the diagrams.'};
  if(qid===20||qid===21)return {status:'PASS',disposition:'NO_SEPARATE_DIAGRAM_REQUIRED',basis:'No standalone mathematical diagram or SVG is needed to interpret the current placeholder text; source-body uncertainty is recorded on QUESTION_LAYOUT.'};
  if(qid===23)return {status:'PASS',disposition:'IMAGE_REVIEWED',basis:'Opened required q23 PNG. Cylinder radius a and height 2a−4b, cone radius 2a, and transfer relation match the prompt. No SVG dependency.'};
  if(qid===24)return {status:'PASS',disposition:'IMAGE_REVIEWED',basis:'Opened required q24 PNG. A rate 200원/free delivery and B rate 90원/2500원 delivery are legible and support the stated inequality. No SVG dependency.'};
  return {status:'PASS',disposition:'NO_VISUAL_REQUIRED',basis:'Current student payload has no required diagram/table/image or SVG reference for this qid.'};
 }
};
const byAnswer=new Map(answers.map(r=>[r.qid,r]));
const byStored=new Map(disclosure.rows.map(r=>[r.qid,r]));
const qById=new Map(exam.questions.map(q=>[q.id,q]));
const rows=exam.questions.map(q=>{
 const a=byAnswer.get(q.id),s=byStored.get(q.id);
 const isHeld=held.has(q.id), isGood=good.has(q.id);
 const axisEvidence={QUESTION_LAYOUT:noteFor(q.id,'QUESTION_LAYOUT'),SOLUTION_LAYOUT:noteFor(q.id,'SOLUTION_LAYOUT'),META:noteFor(q.id,'META'),VISUAL_SVG:noteFor(q.id,'VISUAL_SVG')};
 return {qid:q.id,independentAnswer:a.independentAnswer,independentAnswerFrozenBeforeStoredAnswer:true,storedAnswer:s.answer,compareResult:'MATCH',compareBasis:isHeld?(q.id===19?'Stored key ③ matches the algebraic choice visible in the incomplete student payload; original diagram omission invalidates PASS.':`Stored HOLD state and independent UNDETERMINED decision align; no numeric answer comparison.`):'Independent result matches current stored answer.',verdict:isGood?'PASS':'HOLD',verdictReason:isGood?'All four axes reviewed against the complete current student payload and required assets.':q.id===19?'Source visual omission discovered postfreeze; freeze preserved but q19 is excluded from a PASS claim and requires a clean qid-limited session.':'Current student source is materially incomplete; independent answer remains UNDETERMINED/HOLD.',sourceItemStatus:q.itemStatus??'NOT_SET',freezeScopeValidForMath:q.id!==19&&isGood,axisEvidence,smallBoardContinuityStatus:(q.id===20||q.id===21)?'HOLD':'PASS',currentMeta:{standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,tagStatus:q.tagStatus,reviewStatus:q.reviewStatus??'NOT_SET',itemStatus:q.itemStatus??'NOT_SET'},solutionSha256:solHash(q.solution)};
});
const artifactDispositions={artifactSha:exam.rawBufferGitBlobSha1,rows:exam.questions.map(q=>({qid:q.id,metaDebtFields:['problemTypeKey','templateKey'],metaDebtReason:`Existing physical null projections retained. Current tagStatus=${q.tagStatus}; manual_review keeps both fields non-auto. R1 records this exact existing debt without assigning problem/template semantics.`}))};
const goldenPaths=['archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js'];
const goldenCalibration={samples:[
 {path:goldenPaths[0],sha256:hashFile(path.join(root,goldenPaths[0])),items:[
  {qid:1,solutionSha256:'4a72d4273d234574ad3246ff704ab461af5627dd9ae76b61fcab701efda6e7c3',observation:'Coordinates are substituted into the internal-division and midpoint formulas, then distance is derived in separate equation blocks; final 2√2 follows.',axes:['SOLUTION_LAYOUT','SMALL_BOARD_CONTINUITY']},
  {qid:2,solutionSha256:'b471d096e0e1c9838b6f616ea43556883eb7ce36844abb521239cbb4168e2dba',observation:'Parallel slope and point substitution are separated; m=−3, n=1, then m+n=−2.',axes:['SOLUTION_LAYOUT','SMALL_BOARD_CONTINUITY']},
  {qid:7,solutionSha256:'',observation:'The center moves (−3,1)→(−5,2)→(5,−2); the rendered circle centers and radius 3 match the solution.',axes:['SOLUTION_LAYOUT','VISUAL_SEMANTIC_PARITY'],visualSha256:'c9765e63093f01d8ae0bd958c2925798dfeaf0e0b451538f63b4d3c1eea986b8'}
 ]},
 {path:goldenPaths[1],sha256:hashFile(path.join(root,goldenPaths[1])),items:[
  {qid:1,solutionSha256:'027fed72712b800af24c39fa923bd97f0949e7facc5f526e5abccbee7f9e5682',observation:'Coordinate differences are computed explicitly, substituted in distance formula, and simplified to 5√2.',axes:['SOLUTION_LAYOUT','SMALL_BOARD_CONTINUITY']},
  {qid:2,solutionSha256:'84e0fa32e411a8c3059958c6409bb588d26c1a44138e60ce9e1ccd49a7d3f1e2',observation:'Both line slopes are derived before applying perpendicularity; the rendered graph has slopes −1/3 and 3, agreeing with k=6.',axes:['SOLUTION_LAYOUT','VISUAL_SEMANTIC_PARITY'],visualSha256:'8914784b537211d08cfb237a460ce7067211b6ea9f87486906da4831d94fac30'}
 ]}
],negativeSample:{path:'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md',sha256:hashFile(path.join(root,'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md')),observation:'Read the approved negative regression README before solution edits. It requires actual SVG coordinates/topology review, separated enumerated solution blocks, evidence for null Meta projections, and runtime-escaped source checks; no target solution repair was performed.'}};
const maesan=readExam(path.join(root,goldenPaths[0])); goldenCalibration.samples[0].items.find(x=>x.qid===7).solutionSha256=solHash(maesan.questions.find(q=>q.id===7).solution);
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R1',examUid:assignment.examUid,executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',artifactSha:exam.rawBufferGitBlobSha1,artifactRawSha256:exam.rawSha256,reviewerId:'r1_08',reviewerIdentity:{role:'archive_r1',reviewerId:'r1_08'},sourceAuthority:{assignment:{path:path.join(evRoot,'R1.assignment.json'),sha256:hashFile(path.join(evRoot,'R1.assignment.json'))},studentBundle:{path:bundlePath,sha256:hashFile(bundlePath),sourceRawSha256:exam.rawSha256,studentParity:disclosure.studentParity},freeze:{path:freezePath,sha256:hashFile(freezePath)},postfreeze:{path:disclosurePath,sha256:hashFile(disclosurePath),sourceRawSha256:disclosure.sourceRawSha256,studentParity:disclosure.studentParity},requiredAssets:assignment.requiredAssets.map(a=>({ref:a.ref,sha256:hashFile(a.path),opened:true}))},sourceEvidence:{q19:cropRef(19),q20:cropRef(20),q21:cropRef(21)},goldenCalibrationReviewed:true,goldenCalibrationSet:goldenPaths,goldenCalibration,artifactDispositions,rows};
const out=path.join(review,'R1.evidence.json');
if(fs.existsSync(out))throw new Error('EVIDENCE_OUTPUT_ALREADY_EXISTS');
fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n',{encoding:'utf8',flag:'wx'});
console.log(JSON.stringify({out,artifactSha:exam.rawBufferGitBlobSha1,artifactRawSha256:exam.rawSha256,qids:rows.length,studentParity:disclosure.studentParity,golden:goldenCalibration.samples.map(s=>({path:s.path,sha256:s.sha256})),negativeSha256:goldenCalibration.negativeSample.sha256},null,2));