import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd();
const folder=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const physical=p=>({path:path.resolve(root,p),sha256:sha(fs.readFileSync(path.join(root,p)))});
const oldPath='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/r1-student-bundle.json';
const newPath='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/r1-student-bundle-current-q08-repair.json';
const freezePath='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/r1-original-freeze.json';
const scopePath='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/r1-q08-current-scope-plan.json';
const createPath='archive/analysis/source-only-h2-1mid-20261010-b2/CREATE.q08-source-asset-repair-20261011.bound.evidence.json';
const evidencePath='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/r1-review-evidence.provisional.json';
const old=read(oldPath),current=read(newPath),freeze=read(freezePath),scope=read(scopePath),create=read(createPath),evidence=read(evidencePath);
const oldRow=old.rows.find(r=>r.qid===8),newRow=current.rows.find(r=>r.qid===8),review=evidence.rows.find(r=>r.qid===8);
const stripImage=s=>String(s).replace(/<div class="diagram-box">.*?<\/div>/s,'').trim();
if(current.questionCount!==23||JSON.stringify(old.qids)!==JSON.stringify(current.qids)||scope.outsideScopeParity!=='EXACT'||JSON.stringify(scope.scopeQids)!=='[8]')throw Error('Q08_CURRENT_SCOPE_INTEGRITY_FAILURE');
if(stripImage(oldRow.student.content)!==stripImage(newRow.student.content)||JSON.stringify(oldRow.student.choices)!==JSON.stringify(newRow.student.choices))throw Error('Q08_VISIBLE_TEXT_OR_CHOICES_CHANGED');
if(current.rows.filter((r,i)=>r.qid!==8&&(r.studentPayloadSha256!==old.rows[i].studentPayloadSha256||JSON.stringify(r.assets.map(a=>[a.ref,a.sha256]).sort())!==JSON.stringify(old.rows[i].assets.map(a=>[a.ref,a.sha256]).sort()))).length)throw Error('OUTSIDE_Q08_PARITY_FAILURE');
const newAsset=newRow.assets.find(a=>a.ref.endsWith('/q08-source-correction.png'));
if(!newAsset||newAsset.sha256!=='685eeb4779a02436ed7240ab525717e5d61f1a65fc946461504b03443a8faed8')throw Error('Q08_CURRENT_ASSET_BINDING_FAILURE');
const createRepair=create.currentVisualRepair;
if(createRepair?.qid!==8||createRepair.newAsset?.sha256!==newAsset.sha256||createRepair.freshR1ReviewRequired?.scopeQids?.join(',')!=='8')throw Error('CREATE_REPAIR_BINDING_FAILURE');
const freezeRow=freeze.rows.find(r=>r.qid===8);
const adjudication={
 schemaVersion:'JS_ARCHIVE_R1_QID_CURRENT_INPUT_ADJUDICATION_V1',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'R1',examUid:'24_순천고_1학기_중간_고2_확률과통계',qid:8,reviewerId:'/root/r1_suncheon_hs_prob',reviewedAt:new Date().toISOString(),
 currentSource:{path:'archive/exams/original/high/h2/1mid/24_순천고_1학기_중간_고2_확률과통계.js',rawSha256:current.sourceRawSha256,rawBufferGitBlobSha1:current.sourceRawBlobSha1},
 originalFreeze:{path:freezePath,sha256:physical(freezePath).sha256,sourceRawSha256:freeze.sourceRawSha256,studentBundle:freeze.studentBundle,answerRow:freezeRow},
 currentStudentBundle:physical(newPath),scopePlan:physical(scopePath),createRepair:{path:createPath,sha256:physical(createPath).sha256,completionEventPath:'archive/analysis/source-only-h2-1mid-20261010-b2/CREATE.q08-source-asset-repair-20261011.complete.event.json',completionEventSha256:'c61ea10a7cb847fb4d7c73732fa25f41e6205db031e7e556002bf1f665bf150a'},
 scope:{qids:[8],outsideScopeParity:'EXACT',oldStudentPayloadSha256:oldRow.studentPayloadSha256,currentStudentPayloadSha256:newRow.studentPayloadSha256,oldImage:oldRow.assets[0],currentImage:newAsset,visibleQuestionTextUnchanged:true,choicesUnchanged:true,answerAndSolutionUnchangedPerCREATERepair:true},
 sourceVisual:{pdfPath:createRepair.pdfPath,pdfSha256:createRepair.pdfSha256,page:createRepair.sourcePage,cropPath:createRepair.sourceCropPath,cropSha256:createRepair.sourceCropSha256,currentAssetOpened:true,topologyObserved:'Seven distinct seat circles around the circular table: one at top center and six around the sides/bottom. This matches the source diagram; the old six-seat production asset omitted the top-center seat.',problemVisualDisposition:'PASS_SOURCE_BOUND_7_SEAT_DIAGRAM'},
 answerFreezeReuse:{decision:'VALID_FOR_ANSWER_ONLY; DOES_NOT_BIND_CURRENT_ASSET',frozenIndependentAnswer:freezeRow.independentAnswer,originalReasoning:freezeRow.reasoning,exactUnchangedText:stripImage(oldRow.student.content),choicesExact:true,answerDeterminedByText:'The wording specifies four distinct A-club students and three distinct B-club students, all seated around a circular table, with all B-club students adjacent; the diagram imposes no additional seating condition. Treat the three B students as one block: (5−1)!×3!=144.',currentAnswerDisposition:'REUSE_ORIGINAL_FROZEN_ANSWER_WITH_SCOPED_CURRENT_INPUT_REVIEW',requiredR2Action:'R2 performs its full blind sweep against the current source bundle and repaired q08 asset.'},
 axisReview:{QUESTION_LAYOUT:{status:'PASS',evidence:'Visible wording and all five choices exactly match the frozen q08 student text after excluding only the image-ref wrapper; no layout repair is needed. Actual engine render remains NOT_RUN_R3.'},SOLUTION_LAYOUT:{status:'PASS',evidence:'No solution/student-board source change; existing reviewed q08 solution SVG remains byte-identical and small-board continuity remains PASS. Actual student render remains NOT_RUN_R3.'},META:{status:'PASS',evidence:'No q08 Meta field changed in the CREATE visual repair; existing q08 primary RPM/PT/TPL/difficulty assessment retained.'},VISUAL_SVG:{status:'PASS',problemVisual:{need:'BENEFICIAL',disposition:'KEEP_SOURCE_BOUND_CORRECTED_ASSET',ref:newAsset.ref,sha256:newAsset.sha256,opened:true,observed:'Seven seats including the omitted top-center seat; matches the bound q08 source crop.'},solutionVisual:review.axisEvidence.VISUAL_SVG.solutionVisual}},
 actualRender:'NOT_RUN_R3; no RENDER_PASS claimed',freezePreserved:true,oldAssetPreserved:true
};
const adjOut='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/r1-q08-current-input-adjudication.json';
fs.writeFileSync(path.join(root,adjOut),JSON.stringify(adjudication,null,2)+'\n',{flag:'wx'});
review.verdict='PASS_AFTER_CURRENT_INPUT_SCOPED_REVIEW';review.disposition='Q08_CURRENT_SOURCE_ASSET_REVIEW_COMPLETE';
review.currentInputAdjudicationRef={path:path.resolve(root,adjOut),sha256:sha(fs.readFileSync(path.join(root,adjOut))),qid:8};
review.freezeReuseDecision=adjudication.answerFreezeReuse;
review.axisEvidence.QUESTION_LAYOUT.sourceParity.contentHashCurrentMatchesBaseline=false;
review.axisEvidence.QUESTION_LAYOUT.sourceParity.choicesHashCurrentMatchesBaseline=true;
review.axisEvidence.QUESTION_LAYOUT.visibleQuestionTextExactParity=true;
review.axisEvidence.VISUAL_SVG.status='PASS';
review.axisEvidence.VISUAL_SVG.problemVisual={need:'BENEFICIAL',disposition:'KEEP_SOURCE_BOUND_CORRECTED_ASSET',reason:'Corrected to the bound original seven-seat diagram; the original production q08.png had omitted the top-center seat.',asset:{kind:'PROBLEM_PNG',ref:newAsset.ref,sha256:newAsset.sha256,opened:true,semanticParity:'PASS_SOURCE_DIAGRAM_TOPOLOGY',sourceCropSha256:createRepair.sourceCropSha256,actualStudentRenderStatus:'NOT_RUN_R3'}};
review.axisEvidence.VISUAL_SVG.solutionVisual.actualStudentRenderStatus='NOT_RUN_R3';
review.axisEvidence.VISUAL_SVG.studentRenderStatus='NOT_RUN_R3';
evidence.artifactSha=current.sourceRawBlobSha1;
evidence.artifactRawSha256=current.sourceRawSha256;
evidence.workingJsAbsolute=path.resolve(root,'archive/exams/original/high/h2/1mid/24_순천고_1학기_중간_고2_확률과통계.js');
evidence.sourceIdentity.currentSourceRawSha256=current.sourceRawSha256;
evidence.sourceParity.sourceRawSha256=current.sourceRawSha256;
evidence.sourceParity.sourceQidOrder=current.qids;
evidence.sourceParity.studentQidOrder=current.qids;
evidence.sourceParity.questionCount=23;
evidence.sourceParity.studentQuestionCount=23;
evidence.sourceParity.exactContentChoiceParityQids=evidence.sourceParity.exactContentChoiceParityQids.filter(q=>q!==8);
evidence.sourceParity.exactContentChoiceParityCount=evidence.sourceParity.exactContentChoiceParityQids.length;
evidence.sourceParity.exactVisibleTextChoiceParityQids=current.qids;
evidence.sourceParity.exactVisibleTextChoiceParityCount=23;
evidence.sourceParity.scopedAssetReferenceChanges=[{qid:8,from:oldRow.assets[0].ref,to:newAsset.ref,fromSha256:oldRow.assets[0].sha256,toSha256:newAsset.sha256,reason:'CREATE accepted exact-source visual correction'}];
evidence.currentAssetBindings.push({kind:'CURRENT_ASSET',ref:newAsset.ref,sha256:newAsset.sha256});
evidence.technicalHashes={rawSha256:current.sourceRawSha256,rawBufferGitBlobSha1:current.sourceRawBlobSha1};
evidence.completionState='R1_EVIDENCE_READY_CURRENT_Q08_INPUT_REVIEWED_PENDING_GENERIC_VALIDATOR';
const out='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/r1-review-evidence.current-q08-repair.prebind.json';
fs.writeFileSync(path.join(root,out),JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({adjudication:physical(adjOut),evidence:physical(out),qidCount:evidence.rows.length,exactVisibleTextChoiceParityCount:evidence.sourceParity.exactVisibleTextChoiceParityCount,exactRawContentChoiceParityCount:evidence.sourceParity.exactContentChoiceParityCount,freezeReuse:adjudication.answerFreezeReuse.decision,q08Status:review.verdict},null,2));
