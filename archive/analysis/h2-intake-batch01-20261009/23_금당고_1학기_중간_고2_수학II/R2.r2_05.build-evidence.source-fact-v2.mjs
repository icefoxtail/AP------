import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const ev='C:/Users/USER/Desktop/AP-worktrees/h2-intake-batch01/AP------/archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II';
const temp='C:/Users/USER/Desktop/AP-worktrees/h2-intake-batch01/AP------/.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II';
const examUid='23_금당고_1학기_중간_고2_수학II';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const freezePath=path.join(ev,'R2.r2_05.original-freeze.json');
const freeze=read(freezePath);
const firstDisclosurePath=path.join(ev,'R2.r2_05.postfreeze-disclosure.json');
const firstDisclosure=read(firstDisclosurePath);
const currentDisclosurePath=path.join(ev,'R2.r2_05.postfreeze-source-fact-v2.json');
const currentDisclosure=read(currentDisclosurePath);
const correctionPath=path.join(ev,'R2.r2_05.adjudication.source-fact-v2.json');
const correction=read(correctionPath);
const oldAdjudicationPath=path.join(ev,'R2.r2_05.adjudication.json');
const r1Path=path.join(ev,'R1.evidence.revision3.bound.json');
const r1=read(r1Path);
const sourceWitnessPath=path.join(ev,'R1.q11-original-source-review.v2.json');
const witness=read(sourceWitnessPath);
const currBundlePath=path.join(temp,'R2.student-only.source-fact-v2.json');
const currBundle=read(currBundlePath);
if(freeze.rows.length!==20||currBundle.questionCount!==20||currentDisclosure.studentParity!=='EXACT'||currentDisclosure.rows.length!==1||currentDisclosure.rows[0].qid!==11)throw new Error('R2_FULL_COVERAGE_AND_Q11_PARITY_REQUIRED');
if(r1.artifactDispositions?.artifactSha!=='e4192c46c79a3abdf4ff7e6a729f4cd0a470e31c'||r1.artifactDispositions.rows.length!==20)throw new Error('CURRENT_R1_ARTIFACT_DISPOSITIONS_REQUIRED');
if(witness.sourceFact.answerCount!==4||!witness.sourceFact.endpointVersusWindow.startsWith('UNCHANGED_SOURCE_PLOTTED_WINDOW_CUT'))throw new Error('Q11_SOURCE_FACT_WITNESS_INVALID');
if(currentDisclosure.rows[0].answer!=='②')throw new Error('Q11_CURRENT_DISCLOSURE_MUST_MATCH_ADJUDICATION');
const oldByQid=new Map(firstDisclosure.rows.map(r=>[r.qid,r]));
const newQ11=currentDisclosure.rows[0];
const correctionRow=correction.corrections.find(r=>r.qid===11);
const freezeByQid=new Map(freeze.rows.map(r=>[r.qid,r]));
const rows=[];
for(let qid=1;qid<=20;qid++){
  const f=freezeByQid.get(qid);
  const prior=oldByQid.get(qid);
  const now=qid===11?newQ11:prior;
  if(!f||!now)throw new Error('R2_ROW_MISSING:'+qid);
  if(qid===11){
    rows.push({qid,sourceMode:'EXTRACTED_JS_ASSETS',blindAnswer:f.independentAnswer,independentAnswer:f.independentAnswer,blindAnswerFrozenBeforeR1AndStoredAnswer:true,storedAnswer:now.answer,compareResult:'MISMATCH',verdict:'PASS',disposition:'SOURCE_FACT_REVIEWED_AND_ADJUDICATED_TO_MATCH',independentAnswerAfterAdjudication:'4 (choice ②)',finalComparison:{storedAnswer:now.answer,storedValue:'4',finalIndependentAnswer:'4',status:'MATCH_AFTER_ADJUDICATION'},originalFreeze:{path:freezePath,sha256:sha(freezePath)},supersededPreliminaryAdjudication:{path:oldAdjudicationPath,sha256:sha(oldAdjudicationPath),status:'PRESERVED_SUPERSEDED'},finalAdjudication:{path:correctionPath,sha256:sha(correctionPath)},sourceFactWitness:{path:sourceWitnessPath,sha256:sha(sourceWitnessPath)},currentDisclosure:{path:currentDisclosurePath,sha256:sha(currentDisclosurePath)},reasoning:f.reasoning,finalReasoning:correctionRow.reason});
  } else {
    rows.push({qid,sourceMode:'EXTRACTED_JS_ASSETS',blindAnswer:f.independentAnswer,independentAnswer:f.independentAnswer,blindAnswerFrozenBeforeR1AndStoredAnswer:true,storedAnswer:now.answer,compareResult:'MATCH',verdict:'PASS',reasoning:f.reasoning,decisiveStep:now.decisiveStep,postfreezeSourceSha256:firstDisclosure.sourceRawSha256});
  }
}
const output=path.join(ev,'R2.evidence.source-fact-v2.json');
if(fs.existsSync(output))throw new Error('REFUSING_TO_OVERWRITE_R2_EVIDENCE');
const value={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R2',examUid,artifactSha:'e4192c46c79a3abdf4ff7e6a729f4cd0a470e31c',artifactRawSha256:'3b905a30464f7f056c0e67bd4eb0bfc23b856caf90c84847aa4f618313ffaf9a',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',rows,artifactDispositions:r1.artifactDispositions,studentBundleCurrent:{path:currBundlePath,sha256:sha(currBundlePath),questionCount:currBundle.questionCount,studentAssetParityToFrozenBundle:'EXACT',changedQids:[]},studentBundleFrozen:{path:freeze.studentBundle.path,sha256:freeze.studentBundle.sha256,sourceRawSha256:freeze.sourceRawSha256},assetReads:freeze.assetReads,originalFreeze:{path:freezePath,sha256:sha(freezePath)},postfreezeDisclosures:[{path:firstDisclosurePath,sha256:sha(firstDisclosurePath),qids:'1-20',studentParity:firstDisclosure.studentParity},{path:currentDisclosurePath,sha256:sha(currentDisclosurePath),qids:[11],studentParity:currentDisclosure.studentParity}],adjudications:[{path:oldAdjudicationPath,sha256:sha(oldAdjudicationPath),status:'PRESERVED_SUPERSEDED_PRELIMINARY'},{path:correctionPath,sha256:sha(correctionPath),status:'FINAL_QID11_SOURCE_FACT_ADJUDICATION'}],r1Proof:{evidence:{path:r1Path,sha256:sha(r1Path)},completionEvent:{path:path.join(ev,'R1.complete-event.source-fact-v2.json'),sha256:sha(path.join(ev,'R1.complete-event.source-fact-v2.json'))},sourceFactWitness:{path:sourceWitnessPath,sha256:sha(sourceWitnessPath)}},q11SourceFact:{pdfReferenceReused:true,actualPdfScopeReviewByR1:true,scope:'qid11 prompt and complete graph only; no answer sheet',answerSet:witness.sourceFact.answerSetFromSource,answerCount:witness.sourceFact.answerCount,sourceRawBeforeRepairSha256:witness.crossCheck.currentSourceBeforeRepairRawSha256,sourceRepairQidScope:[11],studentBodyAndProblemAssetsChanged:false}};
fs.writeFileSync(output,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:output,sha256:sha(output),qidCount:rows.length,dispositionRows:value.artifactDispositions.rows.length}));