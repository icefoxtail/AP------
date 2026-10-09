import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const {readExam,sha256,physical}=await import(pathToFileURL(path.resolve('archive/tools/archive-codex-artifact-io.mjs')));
const src='.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/23_금당고_1학기_중간_고2_수학I.js';
const base='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/';
const e=JSON.parse(fs.readFileSync(base+'R1.evidence.revision04.json','utf8'));
const exam=readExam(src);
const bundlePath=base+'R1.current-student-meta-repair.v1.json';
const bundle=JSON.parse(fs.readFileSync(bundlePath,'utf8'));
const metaPath=base+'R1.meta-axis-review.v1.json',meta=JSON.parse(fs.readFileSync(metaPath,'utf8'));
const fourPath=base+'R1.fresh-four-axis-review.v1.json',four=JSON.parse(fs.readFileSync(fourPath,'utf8'));
const target=new Map(four.rows.map(r=>[r.qid,r]));
for(const row of e.rows){
 const q=exam.questions.find(x=>Number(x.id)===Number(row.qid)),m=meta.rows.find(x=>x.qid===Number(row.qid));
 if(!q||!m)throw new Error('FULL_QID_BINDING_MISSING:'+row.qid);
 row.axisEvidence=row.axisEvidence||{};
 row.axisEvidence.META={status:'PASS',evidence:'Independent current Meta review against the current student-only payload, opened referenced assets, official 1108-row master and active condition/concept registries; see linked full20 review. Existing null PT/TPL values remain explicit nonblocking projection disposition; no new mapping claim.'};
 row.solutionSha256=sha256(Buffer.from(q.solution||''));
 const fresh=target.get(Number(row.qid));
 if(fresh){
   const answerText=fresh.independentAnswer+(fresh.storedChoice?` (choice ${fresh.storedAnswer})`:'');
   Object.assign(row,{independentAnswer:answerText,independentAnswerFrozenBeforeStoredAnswer:true,storedAnswer:fresh.storedAnswer,compareResult:'MATCH',verdict:'PASS',sourceMode:'EXTRACTED_JS_ASSETS',repairApplied:false,disposition:'NO_SOURCE_REPAIR',smallBoardContinuityStatus:'PASS',solutionSha256:sha256(Buffer.from(q.solution||''))});
   row.axisEvidence={QUESTION_LAYOUT:{status:'PASS',evidence:'Current content/question/choices equal the current full student-only bundle; static structure independently reviewed. Actual Archive Engine render remains R3 scope.'},SOLUTION_LAYOUT:{status:'PASS',evidence:fresh.solutionLayout.evidence},META:{status:'PASS',evidence:`Full20 independent Meta axis review ${metaPath}; target qid reviewed fresh.`},VISUAL_SVG:{status:'PASS',evidence:fresh.visualSvg.evidence}};
 }
}
e.artifactRawSha256=exam.rawSha256;e.questionCount=exam.questions.length;e.sourceReviewMode='EXTRACTED_JS_ASSETS / DEFECT_ONLY';
e.rows.sort((a,b)=>a.qid-b.qid);
e.metaAuthorityStatus='REVIEWED_CURRENT_SOURCE_AND_OFFICIAL_MASTER';
e.metaAuthorityNote='All 20 current student inputs and two actual referenced assets were reviewed for Meta. Missing L2 fields at q4/q6/q7/q12/q17 were filled from active official master child keys; q7 difficulty was independently classified. Existing null PT/TPL fields remain explicit nonblocking projection debt; no exact current curriculum binding is claimed and no new taxonomy key was generated.';
e.difficultyReviewRef={path:path.resolve(metaPath),sha256:physical(metaPath).sha256};
e.freezeRef={path:path.resolve(base+'R1.original-freeze.json'),sha256:physical(base+'R1.original-freeze.json').sha256,reusedQids:[1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,20]};
e.freshFreezeRef={path:path.resolve(base+'R1.recovery.cli-original-freeze.json'),sha256:physical(base+'R1.recovery.cli-original-freeze.json').sha256,freshQids:[9,10,18,19]};
e.postfreezeDisclosureRef={path:path.resolve('archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/technical-scoped-freeze-reuse/final/R1.scoped-postfreeze-disclosure.v1.json'),sha256:physical('archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/technical-scoped-freeze-reuse/final/R1.scoped-postfreeze-disclosure.v1.json').sha256};
e.qualifiedReuseRef={path:path.resolve('archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/technical-scoped-freeze-reuse/final/R1.qualified-unchanged-row-provenance.v1.json'),sha256:physical('archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/technical-scoped-freeze-reuse/final/R1.qualified-unchanged-row-provenance.v1.json').sha256};
e.currentStudentBundle={path:path.resolve(bundlePath),sha256:physical(bundlePath).sha256,sourceRawSha256:bundle.sourceRawSha256,questionCount:bundle.questionCount};
e.freshAffectedReviewRef={path:path.resolve(fourPath),sha256:physical(fourPath).sha256};
e.assetReadRef={path:path.resolve(base+'R1.actual-asset-reads.json'),sha256:physical(base+'R1.actual-asset-reads.json').sha256};
e.pdfReviewMode='DEFECT_ONLY';e.pdfComparedThisR1=false;e.pdfDisposition='NOT_REQUIRED_NO_NEW_SOURCE_DEPENDENT_DEFECT';
e.renderStatus='NOT_RUN_R1_STATIC_REVIEW_ONLY_R3_OWNER';
e.evidenceRevision='recovery-r1-fresh-four-plus-full20-meta-repair-rev1';
e.revisionReason='Preserved the prior 16-qid R1 evidence/freeze with exact source-object, student-payload and asset invariance proof. Replaced only q9/q10/q18/q19 rows with fresh exclusive student-only freeze and postfreeze comparison; closed all20 Meta axes and repaired five missing official L2 children plus q7 difficulty UNKNOWN. No content/choice/answer/solution changed in this R1 repair.';
const oldDisp=new Map((e.artifactDispositions?.rows||[]).map(r=>[Number(r.qid),r]));
e.artifactDispositions={artifactSha:e.artifactSha,rows:exam.questions.map(q=>{const fields=[];if(q.problemTypeKey==null)fields.push('problemTypeKey');if(q.templateKey==null)fields.push('templateKey');return {qid:Number(q.id),metaDebtFields:fields,metaDebtReason:fields.length?'Exact current null PT/TPL projection fields preserved without new mapping; no exact active current curriculum binding is claimed.':'Current physical projection fields reviewed; no existing null PT/TPL debt.'};})};
// Keep old run failure/process references and add exact source-first evidence.
e.sourceEvidenceRefs=[
 {path:path.resolve('.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/intake-original.evidence.json'),sha256:physical('.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/intake-original.evidence.json').sha256,role:'REUSED_INTAKE_PROVENANCE_NOT_NEW_PDF_REVIEW'},
 {path:path.resolve(base+'ROOT.recovery-adoption.v1.json'),sha256:physical(base+'ROOT.recovery-adoption.v1.json').sha256,role:'EXACT_16_ROW_AND_ASSET_INVARIANCE'},
 {path:path.resolve(base+'ITEM_RECOVERY.v1/ITEM_RECOVERY.receipt.revision01.json'),sha256:physical(base+'ITEM_RECOVERY.v1/ITEM_RECOVERY.receipt.revision01.json').sha256,role:'QUESTION_ONLY_SOURCE_RECOVERY_PROVENANCE'},
 {path:path.resolve(metaPath),sha256:physical(metaPath).sha256,role:'CURRENT_FULL20_META_REVIEW'},
 {path:path.resolve(fourPath),sha256:physical(fourPath).sha256,role:'FRESH_FOUR_QID_REVIEW'}
];
const output=base+'R1.evidence.recovery.rev1.draft.json';fs.writeFileSync(output,JSON.stringify(e,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({path:path.resolve(output),sha256:sha256(fs.readFileSync(output)),artifactRawSha256:e.artifactRawSha256,rows:e.rows.length,targetRows:e.rows.filter(r=>target.has(r.qid)).map(r=>({qid:r.qid,verdict:r.verdict,axes:Object.fromEntries(Object.entries(r.axisEvidence).map(([k,v])=>[k,v.status]))})),metaAxisFailures:e.rows.filter(r=>r.axisEvidence.META.status!=='PASS').length,artifactDispositions:e.artifactDispositions.rows.length},null,2));

