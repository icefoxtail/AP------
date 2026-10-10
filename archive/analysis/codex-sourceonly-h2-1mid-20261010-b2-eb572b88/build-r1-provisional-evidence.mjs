import fs from "node:fs";
import crypto from "node:crypto";
import {readExam} from "../../tools/archive-codex-artifact-io.mjs";
const root="C:/Users/USER/Desktop/AP------", ev=root+"/archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88", uid="24_순천고_1학기_중간_고2_확률과통계";
const examPath=root+"/archive/exams/original/high/h2/1mid/24_순천고_1학기_중간_고2_확률과통계.js", assetRoot=root+"/archive";
const sha=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const th=x=>crypto.createHash("sha256").update(String(x??""),"utf8").digest("hex");
const exam=readExam(examPath), bundle=JSON.parse(fs.readFileSync(ev+"/r1-student-bundle.json"));
const freeze=JSON.parse(fs.readFileSync(ev+"/r1-original-freeze.json")), freezePath=ev+"/r1-original-freeze.json";
const answers=JSON.parse(fs.readFileSync(ev+"/r1-independent-answers.json")), adjudication=JSON.parse(fs.readFileSync(ev+"/r1-adjudication-record.json"));
const createPath=root+"/archive/analysis/source-only-h2-1mid-20261010-b2/CREATE.codex-sourceonly-h2-1mid-20261010-b2-eb572b88.correction1.bound.evidence.json";
const create=JSON.parse(fs.readFileSync(createPath)), uidList=create.sourceIdentity.questionUids, baseRows=new Map(create.rows.map(r=>[r.qid,r]));
const crosswalkPath=root+"/archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-probability-statistics.json";
const crosswalk=JSON.parse(fs.readFileSync(crosswalkPath));
const registryPath=root+"/archive/data/meta-foundation/compiled/taxonomy_registry.json";
const conditionPath=root+"/archive/data/meta-foundation/canonical/condition_registry.json";
const qCorr=new Map(adjudication.corrections.map(r=>[r.qid,r])), fRows=new Map(freeze.rows.map(r=>[r.qid,r])), aRows=new Map(answers.map(r=>[r.qid,r]));
const rpm={2:"H2-PS-RPM-002",3:"H2-PS-RPM-006",4:"H2-PS-RPM-005",5:"H2-PS-RPM-001",6:"H2-PS-RPM-001",7:"H2-PS-RPM-006",8:"H2-PS-RPM-002",9:"H2-PS-RPM-002",10:"H2-PS-RPM-008",11:"H2-PS-RPM-008",13:"H2-PS-RPM-006",14:"H2-PS-RPM-012",15:"H2-PS-RPM-012",16:"H2-PS-RPM-012",17:"H2-PS-RPM-002",18:"H2-PS-RPM-006",19:"H2-PS-RPM-001",20:"H2-PS-RPM-012",22:"H2-PS-RPM-009"};
const l3l4={1:["L3","L4"],12:["L3","L4"],21:["L3","L4"],23:["L3","L4"]};
const rpmText={1:"No single locked H2 RPM route covers a sum of repeated-permutation and repeated-combination values.",12:"No locked H2 RPM record exists for H15-PS-02-BINOMIAL_APPLICATION power-remainder calculation.",21:"No locked H2 RPM record exists for H15-PS-01-COUNTING_APPLICATION constrained-function counting.",23:"No locked H2 RPM record exists for H15-PS-01-COUNTING_APPLICATION constrained-function counting."};
const debts={1:{f:["problemTypeKey","templateKey"],r:"A sum of repeated-permutation and repeated-combination values has no single ACTIVE PT/TPL mapping."},12:{f:["templateKey"],r:"No exact ACTIVE TPL binding exists for H15-PS-02-BINOMIAL_APPLICATION power-remainder calculation."},22:{f:["templateKey"],r:"TPL_BINOMIAL_COEFFICIENT_IDENTITY has DIRECT_BINDING_GAP with bindingStatus=MISSING."}};
const pNeed={5:"REQUIRED",6:"REQUIRED",8:"BENEFICIAL",9:"BENEFICIAL",19:"BENEFICIAL"};
const sNeed={5:"BENEFICIAL",6:"BENEFICIAL",8:"BENEFICIAL",9:"BENEFICIAL",14:"BENEFICIAL",17:"BENEFICIAL",19:"BENEFICIAL",20:"BENEFICIAL",23:"BENEFICIAL"};
const pWhy=[
"Numeric evaluation only.", "Fix endpoints and count identical-object arrangements.", "Stars-and-bars formula fully expresses the integer-solution count.",
"Nonincreasing values are counted as a multiset.", "Road map and X/Y checkpoints define required path constraints.",
"Road map and C junction define required path constraints.", "Lower-bound shift is algebraic.",
"Circle/table view helps show a block arrangement; current asset omits one source seat.",
"Circular table clarifies adjacency.", "Binomial term selection is algebraic.", "Coefficient contributions are algebraic.",
"Remainder arithmetic is scalar.", "Residual distribution is algebraic.", "Dice outcomes are scalar.",
"Same-color pairs are scalar.", "Block subtraction is algebraic.", "Case table is included in solution SVG.",
"Stars-and-bars complement is algebraic.", "Card omission branches are visible in solution SVG.",
"Valid ordered pairs are visible in solution SVG.", "Finite value domains are fully stated in text.",
"Coefficient comparison is algebraic.", "Middle-value split and gap distribution are visible in solution SVG."
];
const sWhy=[
"No new visual relation.", "No additional visual relation.", "A representative stars-and-bars placement would not add a decisive fact.",
"Formula fully conveys multiset count.", "SVG shows ordered path-stage counts.", "SVG shows DP table, C routes, and subtraction.",
"Shifted integer-solution count is algebraic.", "SVG separates circular block and internal order.",
"SVG separates selection and AB block.", "Term selection is algebraic.", "Aligned coefficient contributions are sufficient.",
"Remainder computation is algebraic.", "Residual distribution is algebraic.", "No visual topology.",
"Pair counts are algebraic.", "Block-and-complement counts are algebraic.", "SVG separates three multiplicity cases.",
"Complement distribution is algebraic.", "SVG splits omitted odd/even cases.", "SVG lists four ordered pairs.",
"Independent finite choices are textual.", "Coefficient comparison is algebraic.", "SVG separates front values and gaps."
];
const imageSet=new Set([5,6,8,9,19]), svgSet=new Set([5,6,8,9,14,17,19,20,23]);
const marker={"①":0,"②":1,"③":2,"④":3,"⑤":4};
const norm=x=>{let s=String(x??"").replaceAll("$","").replaceAll("\\,","").trim();const m=s.match(/\\frac\{(-?\d+)\}\{(\d+)\}/);return m?m[1]+"/"+m[2]:s;};
const assets=[], rows=exam.questions.map((q,i)=>{
 const id=Number(q.id), par=baseRows.get(id).provenanceEvidence.sourceParity, correction=qCorr.get(id), frozen=fRows.get(id);
 const finalAnswer=String(correction?.correctedAnswer??aRows.get(id).independentAnswer), original=String(frozen.independentAnswer), stored=String(q.answer??"");
 const ix=marker[stored], storedValue=ix===undefined?stored:(q.choices?.[ix]??null), after=norm(finalAnswer)===norm(storedValue), before=norm(String(correction?.originalAnswer??original))===norm(storedValue);
 const img=q.image||null, svg=q.solutionImage||null, imgSha=img?sha(assetRoot+"/"+img):null, svgSha=svg?sha(assetRoot+"/"+svg):null;
 for(const [ref,hash] of [[img,imgSha],[svg,svgSha]])if(ref&&!assets.some(x=>x.ref===ref))assets.push({kind:"CURRENT_ASSET",ref,sha256:hash});
 const d=debts[id]||{f:[],r:""}, rdebt=l3l4[id]||[], rrecord=rpm[id]||null;
 const meta={status:(d.f.length||rdebt.length)?"EVIDENCE_DEBT":"PASS",currentFields:{standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,level:q.level,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility},rpmEvidence:rrecord?{status:"MAPPED",recordId:rrecord}: {status:"EVIDENCE_DEBT",debtFields:rdebt,reason:rpmText[id]},physicalNullDebt:d.f.length?d:null,identity:{questionUid:uidList[i],sourceArchiveFile:create.sourceIdentity.sourceArchiveFile,sourceQuestionNo:String(id),sourceOrdinal:id},projectionStatus:[18,19].includes(id)?"ROOT_UPDATE_REQUIRED_AFTER_META_CORRECTION":"CURRENT_UID_PRESENT"};
 const parity={sourceTextExactParity:par.sourceTextExactParity===true,choicesExact:par.choicesExact===true,contentHashCurrentMatchesBaseline:th(q.content??q.question??"")===par.baselineQuestionSha256,choicesHashCurrentMatchesBaseline:th(JSON.stringify(q.choices??[]))===par.baselineChoicesSha256};
 const pAsset=img?{kind:"PROBLEM_IMAGE",ref:img,sha256:imgSha,opened:true,sourceFidelity:id===8?"SOURCE_MISMATCH_MISSING_TOP_CENTER_SEAT":"EXACT_EXTRACTED_IMAGE"}:null;
 const sAsset=svg?{kind:"SOLUTION_SVG",ref:svg,sha256:svgSha,opened:true,semanticParity:"PASS_STATIC_MATH_AND_TOPOLOGY",staticPreviewTool:"ImageMagick-derived PNG; not Archive renderer",actualStudentRenderStatus:"NOT_RUN_R3"}:null;
 const card=q.choices?.length?{type:"SINGLE_SELECTED_OPTION",optionCount:q.choices.length,selectedMarker:stored,selectedMarkerCount:1,selectedIndex:ix,storedValue}:{type:"SINGLE_NUMERIC_RESPONSE",optionCount:0,answerCount:1};
 const axes={
  QUESTION_LAYOUT:{status:"PASS",disposition:"KEEP_SOURCE_TEXT_AND_CHOICES",sourceTextExactParity:parity.sourceTextExactParity,choicesExact:parity.choicesExact,layoutTag:q.layoutTag,wide:q.wide,autoFirstDisposition:"KEEP",sourceParity:parity,actualEngineRenderStatus:"NOT_RUN_R3"},
  SOLUTION_LAYOUT:{status:"PASS",disposition:"KEEP",reviewSummary:sWhy[i],solutionSha256:th(q.solution),smallBoardContinuityStatus:"PASS",studentReproducible:"PASS_STATIC_REVIEW",actualStudentRenderStatus:"NOT_RUN_R3"},
  META:meta,
  VISUAL_SVG:{status:id===8?"HOLD":"PASS",problemVisual:{need:pNeed[id]||"EXEMPT",disposition:id===8?"SOURCE_ASSET_REPAIR_REQUIRED":img?"KEEP_EXISTING_REVIEWED_RASTER":"EXEMPT",reason:pWhy[i],assets:pAsset?[{...pAsset,sourceReviewPath:id===8?ev+"/r1-q08-asset-source-finding.json":undefined}]:[]},solutionVisual:{need:sNeed[id]||"EXEMPT",disposition:sAsset?"KEEP_EXISTING_STATIC_REVIEWED_SVG":"EXEMPT",reason:sWhy[i],asset:sAsset,studentRenderStatus:sAsset?"NOT_RUN_R3":"NOT_REQUIRED"}}
 };
 return {qid:id,questionUid:uidList[i],sourceMode:"EXTRACTED_JS_ASSETS",independentAnswer:finalAnswer,independentAnswerFrozenBeforeStoredAnswer:true,preDisclosureFrozenAnswer:original,storedAnswer:stored,storedAnswerValue:storedValue,compareResult:before?"MATCH":"MISMATCH",compareResultAfterAdjudication:after?"MATCH":"MISMATCH",answerCardinality:card,answerReasoning:correction?.reason??aRows.get(id).reasoning,answerCardinalityStatus:after?"PASS":"FAIL",answerFreezeRef:{path:freezePath,sha256:sha(freezePath)},adjudicationRef:correction?{path:ev+"/r1-adjudication-record.json",sha256:sha(ev+"/r1-adjudication-record.json"),qid:id}:null,verdict:id===8?"HOLD":correction?"PASS_AFTER_ADJUDICATION":"PASS",disposition:id===8?"OPEN_Q08_SOURCE_ASSET_REPAIR":correction?"POSTFREEZE_MINIMUM_ADJUDICATION":"KEEP",solutionSha256:th(q.solution),smallBoardContinuityStatus:"PASS",axisEvidence:axes};
});
const dispositionRows=exam.questions.map(q=>{const d=debts[q.id]||{f:[],r:""};return{qid:Number(q.id),metaDebtFields:d.f,metaDebtReason:d.r};});
const input=root+"/archive/analysis/source-only-h2-1mid-20261010-b2/24_순천고_1학기_중간_고2_확률과통계.evidence.json";
const x={
 schemaVersion:"JS_ARCHIVE_STAGE_EVIDENCE_v2",qualityContractVersion:"JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",executionLine:"CODEX",stage:"R1",
 examUid:uid,artifactSha:exam.rawBufferGitBlobSha1,artifactRawSha256:exam.rawSha256,workingJsAbsolute:examPath,assetRootAbsolute:assetRoot,
 sourceInputMode:"EXTRACTED_JS_ASSETS",pdfReviewMode:"DEFECT_ONLY",
 sourceIdentity:{sourceArchiveFile:create.sourceIdentity.sourceArchiveFile,sourceQuestionCount:23,sourceBaselineRawSha256:create.sourceIdentity.baselineSourceRawSha256,sourceRawSha256:exam.rawSha256,sourceQuestionUids:uidList,questionOrdinalsConsecutive:true},
 provenance:{intakeEvidence:{path:input,sha256:sha(input)},createEvidence:{path:createPath,sha256:sha(createPath)},createCompletionEvent:{path:root+"/archive/analysis/source-only-h2-1mid-20261010-b2/CREATE.codex-sourceonly-h2-1mid-20261010-b2-eb572b88.correction1.complete.event.json",sha256:sha(root+"/archive/analysis/source-only-h2-1mid-20261010-b2/CREATE.codex-sourceonly-h2-1mid-20261010-b2-eb572b88.correction1.complete.event.json")},createGenericReport:{path:root+"/archive/analysis/source-only-h2-1mid-20261010-b2/CREATE.codex-sourceonly-h2-1mid-20261010-b2-eb572b88.correction1.generic.report.json",sha256:sha(root+"/archive/analysis/source-only-h2-1mid-20261010-b2/CREATE.codex-sourceonly-h2-1mid-20261010-b2-eb572b88.correction1.generic.report.json")},studentBundle:{path:ev+"/r1-student-bundle.json",sha256:sha(ev+"/r1-student-bundle.json"),count:23},originalFreeze:{path:freezePath,sha256:sha(freezePath),sourceRawSha256:freeze.sourceRawSha256,qidCount:23},postfreezeDisclosure:{path:ev+"/r1-postfreeze-disclosure-after-q18-meta.json",sha256:sha(ev+"/r1-postfreeze-disclosure-after-q18-meta.json"),studentParity:"EXACT",qidCount:23},adjudication:{path:ev+"/r1-adjudication-record.json",sha256:sha(ev+"/r1-adjudication-record.json"),qids:[6,21]},scopedSourceReview:{path:ev+"/r1-source-scope-evidence.json",sha256:sha(ev+"/r1-source-scope-evidence.json"),qids:[3,9]},q08AssetFinding:{path:ev+"/r1-q08-asset-source-finding.json",sha256:sha(ev+"/r1-q08-asset-source-finding.json"),qid:8},q08Proposal:{path:ev+"/r1-q08-source-asset-proposal.json",sha256:sha(ev+"/r1-q08-source-asset-proposal.json"),qid:8,linkedToProduction:false}},
 goldenCalibrationReviewed:true,goldenCalibrationSet:["archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js","archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js"],
 goldenCalibration:{samples:[{path:"archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js",sha256:sha("archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js"),items:[{qid:1,solutionSha256:th(readExam("archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js").questions[0].solution),observation:"Checked internal division, midpoint, and distance as a reproducible chain."},{qid:2,solutionSha256:th(readExam("archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js").questions[1].solution),observation:"Checked parallel slope and point substitution."},{qid:7,solutionSha256:th(readExam("archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js").questions[6].solution),visualSha256:sha("archive/assets/images/25_매산여고_2학기_중간_고1_기출/q7-solution.svg"),observation:"Checked circle center/radius and translated/reflected centers against the SVG."}]},{path:"archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js",sha256:sha("archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js"),items:[{qid:2,solutionSha256:th(readExam("archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js").questions[1].solution),visualSha256:sha("archive/assets/images/25_효천고_2학기_중간_고1_기출/q02-solution.svg"),observation:"Checked line primitive equations against slopes -1/3 and 3."},{qid:3,solutionSha256:th(readExam("archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js").questions[2].solution),visualSha256:sha("archive/assets/images/25_효천고_2학기_중간_고1_기출/q03-solution.svg"),observation:"Checked SVG circle center (-1,3) and radius 2."}]}],negativeSample:{path:"archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md",sha256:sha("archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md"),observation:"Read regression examples for SVG-coordinate mismatch, omitted small-board case block, exact active Meta keys, and runtime TeX escapes."},calibrationScope:"R1 independent review calibration; no target solution authoring or solution edits."},
 rows,artifactDispositions:{artifactSha:exam.rawBufferGitBlobSha1,rows:dispositionRows},currentAssetBindings:assets,
 sourceParity:{baselineSourceRawSha256:create.sourceIdentity.baselineSourceRawSha256,sourceRawSha256:exam.rawSha256,questionCount:23,exactContentChoiceParityQids:exam.questions.map(q=>Number(q.id)),exactContentChoiceParityCount:23,studentQidOrder:bundle.qids,studentQuestionCount:bundle.questionCount,sourceReferencePolicy:{mode:"EXTRACTED_JS_ASSETS",pdfReviewMode:"DEFECT_ONLY",actualPdfQidsReviewed:[3,8,9],wholeExamPdfReview:"NOT_RUN"}},
 metaAudit:{fullQidScope:exam.questions.map(q=>Number(q.id)),lockedRpmCrosswalk:{path:crosswalkPath,sha256:sha(crosswalkPath),status:crosswalk.status,authorityStatus:crosswalk.rpmAuthority.status,recordCount:crosswalk.summary.recordCount},activeRegistryHashes:{probabilityTaxonomy:sha("archive/data/meta-foundation/canonical/packs/probability-statistics/taxonomy.json"),probabilityBindings:sha("archive/data/meta-foundation/canonical/packs/probability-statistics/bindings.json"),compiledRegistry:sha(registryPath),conditionRegistry:sha(conditionPath)},rpmEvidenceDebtQids:[1,12,21,23],physicalNullDebtQids:[1,12,22],sourceCorrections:[{qid:18,field:"templateKey",before:"TPL_COMBINATION_SELECTION",after:"TPL_REPEATED_COMBINATION_DISTRIBUTION",reason:"Exact ACTIVE template for identical-object distribution to four recipients.",studentFieldsChanged:false},{qid:19,field:"crossConceptKeys",before:["CC_COMBINATORICS_COUNTING"],after:[],reason:"The concept repeats the primary counting/permutation pathway; excluded under Foundation §§5.2–5.3.",studentFieldsChanged:false}],searchProjectionUpdateRequired:[18,19]},
 identityProjection:{questionIdentityMapMatches:23,questionMetadataMatches:23,archive2CatalogMatches:23,generatedLiteConsumerMatches:0,generatedLiteConsumer:"NOT_APPLICABLE_TO_ORIGINAL_ARCHIVE_1_SOURCE",projectionStatus:"ROOT_UPDATE_REQUIRED_FOR_Q18_Q19",questionUidsUnchanged:true},
 technicalHashes:{rawSha256:exam.rawSha256,rawBufferGitBlobSha1:exam.rawBufferGitBlobSha1,gitCleanFilterBlobSha1:exam.rawBufferGitBlobSha1},
 completionState:"PROVISIONAL_Q08_VISUAL_HOLD_NO_GENERIC_VALIDATOR_OR_SEAL"
};
const out=ev+"/r1-review-evidence.provisional.json";
if(fs.existsSync(out))throw new Error("OUTPUT_EXISTS");
fs.writeFileSync(out,JSON.stringify(x,null,2)+"\n");
console.log(JSON.stringify({path:out,sha256:sha(out),artifactSha:x.artifactSha,artifactRawSha256:x.artifactRawSha256,rowCount:rows.length,openRows:rows.filter(r=>r.verdict==="HOLD").map(r=>r.qid),adjudicatedQids:rows.filter(r=>r.adjudicationRef).map(r=>r.qid)}));
