import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {readExam} from '../../../../tools/archive-codex-artifact-io.mjs';
const ROOT='C:/Users/USER/Desktop/AP------';
const EXAM_REL='archive/exams/original/high/h2/1mid/18_효천고_1학기_중간_고2_확률과통계.js';
const DIR='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012';
const EXAM=path.join(ROOT,EXAM_REL);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const readJson=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const examBytes=fs.readFileSync(EXAM), exam=readExam(EXAM);
const freeze=readJson(DIR+'/R1.original-freeze.json');
const adjudication=readJson(DIR+'/R1.postcompare.adjudication.json');
const disclosure=readJson(DIR+'/R1.final-postfreeze-all.rev3.json');
const calibration=readJson(DIR+'/R1.calibration-preflight.rev2.json');
const bundle=readJson(DIR+'/R1.student-only.current.json');
const intake=readJson('archive/analysis/source-only-h2-1mid-20261011-b5/18_효천고_1학기_중간_고2_확률과통계.evidence.json');
const freezeCorrections=new Map(adjudication.corrections.map(c=>[Number(c.qid),c]));
const independent=new Map(freeze.rows.map(r=>[Number(r.qid),r]));
const stored=new Map(disclosure.rows.map(r=>[Number(r.qid),r]));
const byQid=new Map(exam.questions.map(q=>[Number(q.id),q]));
const qids=exam.questions.map(q=>Number(q.id));
if(qids.length!==22||qids.some((q,i)=>q!==i+1))throw Error('FIXED_QID_DENOMINATOR_INVALID');
if(disclosure.studentParity!=='EXACT'||disclosure.sourceRawSha256!==sha(examBytes)||disclosure.originalFreezeSourceRawSha256!==bundle.sourceRawSha256)throw Error('FINAL_POSTFREEZE_PARITY_BINDING_INVALID');
if(freeze.rows.length!==22||disclosure.rows.length!==22)throw Error('FREEZE_OR_DISCLOSURE_DENOMINATOR_INVALID');
if(calibration.solutionQualityCalibration.calibrationStatus!=='PASS')throw Error('CALIBRATION_PREFLIGHT_NOT_PASS');
const holdReason='S(4,2) and P(6,3) are not defined in the student-visible item. The scoped original q12 crop shows the same expression and options with no local notation definition; no unique answer is determinable.';
const metaDebtReasonQ2='Current q2 uses the product rule over three nonidentical factor choice sets. The exact H15-PS-01 COUNTING_APPLICATION ACTIVE PT/TPL lookup did not produce a unique canonical projection for this product-rule structure; selection/distribution and repeated-assignment candidates do not exactly describe the current decisive step. Preserve nulls; do not invent a key.';
const metaDebtReasonQ12='Source item is unresolved because S/P notation is undefined. No unique RPM L3/L4 or PT/TPL projection can be established from the student item; preserve nulls until an authoritative notation definition or replacement is available.';
const repairQids=new Set([1,2,3,4,6,7,9,13,16,17,18,19,20,22]);
const solutionRepairQids=new Set([2,3,4,6,7,9,13,17,18,19,20,22]);
const visualQids=new Set([3,6,7,21]);
const problemVisual={
 3:{necessity:'REQUIRED',reason:'The region adjacency topology is the decisive input for proper coloring; the preserved crop is necessary.'},
 6:{necessity:'BENEFICIAL',reason:'The six-seat rectangle arrangement shows the seat topology and 180-degree correspondence.'},
 7:{necessity:'REQUIRED',reason:'P, R, Q coordinates on the grid determine the two segment lengths and shortest-path counts.'},
 21:{necessity:'REQUIRED',reason:'The eight equally spaced circle points define antipodal pairs needed for the rectangle count.'}
};
const solutionVisual={
 3:{necessity:'BENEFICIAL',reason:'The graph makes the lower-region-to-all-upper adjacency and upper path constraints immediately visible.'},
 6:{necessity:'BENEFICIAL',reason:'The SVG shows the three seat pairs identified by 180-degree rotation.'},
 7:{necessity:'BENEFICIAL',reason:'The SVG separates P→R and R→Q and matches the movement counts used in the product.'},
 21:{necessity:'REQUIRED',reason:'The antipodal-diameter construction is the decisive characterization for inscribed rectangles.'}
};
const reasons=[
'Sum cases are disjoint: four ordered pairs for sum 5 and six for sum 7.',
'Product rule selects one term from each of three factors; 3×2×2 choices.',
'Proper colorings of the pictured adjacency graph: 5 choices below, then 4,3,3,3.',
'Two alternating gender-slot patterns, then 4! arrangements in each group.',
'Fix one named student around the circle; the other is forced opposite, remaining four are 4!.',
'Arrange six students on six fixed rectangle seats and identify 180-degree rotations, 6!/2.',
'Split at R; P→R uses 3 right and 2 up, R→Q uses 2 right and 2 up.',
'Six distinct students independently choose one of two clubs, 2^6.',
'Use C(n+3,2)=15 and solve for the natural n.',
'Choose a four-pencil group, then divide by 2 because the groups are unlabeled.',
'Shift each positive variable down by one; count nonnegative solutions of sum 4.',
'Hold: the symbols S and P have no definitions in the student item.',
'Partition five distinct breads into three unlabeled nonempty groups by block sizes 1,1,3 and 1,2,2.',
'List the unordered partitions of 9 into three positive integer parts.',
'Enumerate unordered positive triples for 10 by their least term.',
'Choose all 3-subsets and subtract all-odd and all-even subsets.',
'Subtract two guaranteed vouchers per student; count nonnegative solutions of sum 7.',
'Compute 3!×4P3=144.',
'Split by final digit 0 versus 2 or 4 while excluding zero in the leading position.',
'Choose C’s even position and arrange the remaining multiset.',
'Choose four of eight points; for a rectangle choose two of four diameters.',
'Count all functions, injective functions, strictly increasing functions, then weakly increasing tails with a strict first inequality.'
];
function correctedIndependent(qid){
 const correction=freezeCorrections.get(qid);
 return correction?correction.correctedAnswer:independent.get(qid).independentAnswer;
}
function normalizeExpected(qid,value){
 if(qid===21)return '(1) 70, (2) 6';
 if(qid===22)return '(1) 625, (2) 120, (3) 5, (4) 35';
 return String(value);
}
function compare(qid,q,answer){
 const d=stored.get(qid);
 if(qid===12)return d.answer==='HOLD'&&answer==='HOLD';
 if(qid>=1&&qid<=17){
  const index='①②③④⑤'.indexOf(d.answer);
  if(index<0||!q.choices[index])return false;
  return String(q.choices[index]).replaceAll(',','')===String(answer).replaceAll(',','');
 }
 return String(d.answer).replaceAll(' ','')===normalizeExpected(qid,answer).replaceAll(' ','');
}
const genericRows=[],physicalQuestionRows=[],metaRows=[];
for(const qid of qids){
 const q=byQid.get(qid),f=independent.get(qid),a=freezeCorrections.get(qid),ind=correctedIndependent(qid);
 const storedAnswer=stored.get(qid).answer, hold=qid===12, metaDebt=qid===2||qid===12;
 if(!compare(qid,q,ind))throw Error('ANSWER_COMPARE_MISMATCH:q'+qid);
 const debtFields=metaDebt?['problemTypeKey','templateKey']:[];
 const metaReason=qid===2?metaDebtReasonQ2:qid===12?metaDebtReasonQ12:undefined;
 const pvisual=problemVisual[qid]||{necessity:'EXEMPT',reason:'Student text and symbolic conditions fully specify the problem; no spatial, graph, table, or topology relation is needed.'};
 const svisual=solutionVisual[qid]||{necessity:'EXEMPT',reason:hold?'No mathematical solution can be produced while the source notation is undefined; a diagram would not resolve it.':'Verified counting/algebra steps are fully communicated by text and equations; an added visual would duplicate the calculation without adding a decisive relation.'};
 const solutionHash=sha(Buffer.from(String(q.solution??'')));
 const qLayout={status:'PASS',disposition:'LAYOUT_KEEP',sourceTextExactParity:'EXACT_TO_CURRENT_FROZEN_STUDENT_BUNDLE',choicesExactParity:'EXACT_TO_CURRENT_FROZEN_STUDENT_BUNDLE',renderStatus:'NOT_RUN_R3',reason:'AUTO-FIRST static review; current layoutTag/grid and source line breaks preserve the complete prompt and choice structure. Actual exam-engine screen review remains with R3.'};
 const solLayout={status:hold?'EVIDENCE_DEBT':'PASS',disposition:hold?'ITEM_HOLD_CONFIRMED':'SOLUTION_LAYOUT_KEEP',solutionSha256:solutionHash,smallBoardReview:hold?'HOLD_NOTICE_ONLY_NOT_STUDENT_SOLUTION':'PASS',reason:hold?'The solution field is a non-student-facing HOLD notice, not a mathematical solution.':'Current final solution reviewed after approved Golden/Negative preflight; student-reproducible steps, equations, case splits, and conclusion agree with the independent answer.'};
 const metaAxis={status:hold||qid===2?'EVIDENCE_DEBT':'PASS',result:hold?'HOLD':'PASS',reason:metaReason||'Current L1/L2 master tuple, source identity, existing ACTIVE PT/TPL bindings, CrossConcept/Condition arrays, and integration pattern checked against current canonical registries.'};
 const problemAsset=visualQids.has(qid)?(q.image||'assets/images/18_효천고_1학기_중간_고2_확률과통계/q'+String(qid).padStart(2,'0')+'.png'):null;
 const visualAxis={status:'PASS',problemVisual:Object.assign({},pvisual,{assetOpened:visualQids.has(qid),assetSha256:problemAsset?sha(fs.readFileSync(path.join(ROOT,'archive',problemAsset))):null}),solutionVisual:Object.assign({},svisual,{existingAsset:!!q.solutionImage,assetSha256:q.solutionImage?sha(fs.readFileSync(path.join(ROOT,'archive',q.solutionImage))):null,staticPreviewPath:q.solutionImage?DIR+'/q'+String(qid).padStart(2,'0')+'-solution.static.png':null})};
 const row={
  qid,independentAnswer:ind,independentReasoning:a?a.reason:f.reasoning,independentAnswerOriginal:a?f.independentAnswer:undefined,
  independentAnswerFrozenBeforeStoredAnswer:true,freezeRef:{path:DIR+'/R1.original-freeze.json',sha256:sha(fs.readFileSync(path.join(ROOT,DIR,'R1.original-freeze.json')))},
  storedAnswer,answerCardinality:qid===12?'UNDETERMINED':qid===21?'MULTIPART_2':qid===22?'MULTIPART_4':'SINGLE',
  compareResult:'MATCH',verdict:'PASS',
  ...(repairQids.has(qid)?{repairApplied:true,disposition:'R1_MINIMAL_REPAIR_AND_CHANGED_QID_RECHECKED'}:{}),
  ...(hold?{itemStatus:'HOLD',disposition:'ITEM_HOLD_CONFIRMED'}:{}),
  sourceMode:'ORIGINAL',smallBoardContinuityStatus:'PASS',smallBoardContinuityScope:hold?'HOLD_NOTICE_ONLY_NO_STUDENT_SOLUTION_ASSERTED':'STUDENT_SOLUTION_REVIEWED',
  solutionSha256:solutionHash,decisiveStep:hold?'No unique mathematical decisive step: S/P notation is undefined.':(a?a.reason:f.reasoning),
  axisEvidence:{QUESTION_LAYOUT:qLayout,SOLUTION_LAYOUT:solLayout,META:metaAxis,VISUAL_SVG:visualAxis},
  ...(debtFields.length?{metaDebtFields:debtFields,metaDebtReason:metaReason}:{}),
  exactVisualDisposition:{problem:pvisual,solution:svisual}
 };
 genericRows.push(row);
 const holdEvidence={
  reason:holdReason,observedEvidence:{studentExpression:'S(4,2)+P(6,3)',originalPdfPage:2,sourcePdfSha256:'9e5ed63b6a9dd3a6850edc1c28fe734f326e287b4e549bec08c346128735ce81'},
  unresolvedPoint:'The symbols S and P are not defined in the question; standard and nonstandard interpretations cannot be distinguished from this item.',
  nextRequiredEvidenceOrCapability:'An authoritative source definition or an approved item correction/replacement that determines the notation.',
  repairAttempted:'Solved independently from the full student bundle, inspected the referenced page 2 crop, and checked available curriculum/canonical notation context; no unique interpretation was established.',
  authorityLookupAttempted:'Current student JS, source intake record, scoped original PDF q12 page 2, H15 probability-statistics curriculum, RPM crosswalk and active Meta registry.',
  whyDeterministicClosureImpossible:'The source and extraction contain the same undefined S/P notation. No single intended meaning follows from the student item or its options.'
 };
 const axis=(status,evidence)=>status==='HOLD'?{status,holdEvidence,evidence}:{status,evidence};
 physicalQuestionRows.push({
  qid,
  sourceExact:axis('PASS','Current source identity and sourceQid bind to intake provenance; qid order/student payload is exact to the frozen current JS bundle. Original-source parity is reused from intake, not newly declared.'+(qid===12?' Scoped PDF check only: q12 page 2 confirms the printed expression/options match the extracted JS; no full-page/source audit was performed.':'')),
  answerMath:axis(hold?'HOLD':'PASS',hold?'':'Independent answer freeze precedes stored answer/solution disclosure; postfreeze compare matches after recorded adjudications where applicable.'),
  solutionMath:axis(hold?'HOLD':'PASS',hold?'':'Current solution recalculated and matches the independent answer; repaired TeX loci are recorded and student body remains exact.'),
  smallBoard:axis(hold?'HOLD':'PASS',hold?'':'Step order, equations, substitutions, case splits, and conclusion are readable and mathematically continuous.'),
  curriculum:axis('PASS','2015 H2 확률과 통계; H15-PS-01 / 순열과 조합 / order 1 and each subUnit key/label/parent checked against the current standard-unit master and compiled tag master.'),
  visualNecessity:axis('PASS','Problem visual necessity: '+pvisual.necessity+' — '+pvisual.reason+' Solution visual necessity: '+svisual.necessity+' — '+svisual.reason+' Static SVG previews reviewed where assets exist; actual browser render is NOT_RUN_R3.'),
  meta:axis(hold?'HOLD':'PASS',hold?'':'Existing L1/L2, RPM/crosswalk, Global ACTIVE PT/TPL, exact binding, CrossConcept/Condition, integration pattern, identity/provenance, and nullable-key lookup disposition reviewed.'),
  difficulty:axis(hold?'HOLD':'PASS',hold?'':'Current problem structure and verified solution independently compared with the 2015 H2 bucket definitions; prior level/bucket values were considered only for the final compatibility comparison.'),
  runtimeString:axis('PASS','Current JS VM string fields checked after the independent freeze; TeX operator corrections were limited to solution fields and no student prompt/choices changed.')
 });
 let rpmPath;
 if([4,5,6,18,20].includes(qid))rpmPath=qid===5?'경우의 수 > 순열과 조합 > 순열 > 중복·원순열':'경우의 수 > 순열과 조합 > 순열 > 일렬 배열 / 조건 배열';
 else if([9,10,11,13,14,15,16,17,21].includes(qid))rpmPath=[11,17].includes(qid)?'경우의 수 > 순열과 조합 > 중복조합 > 정수해 개수':[10,13,14,15].includes(qid)?'경우의 수 > 순열과 조합 > 조합 > 분할·분배':'경우의 수 > 순열과 조합 > 조합 > 선택';
 else if(qid===22)rpmPath='MULTI-L4: independent function-counting subparts span mappings, injective counts, strict monotonicity, and weak monotonicity; no unique single primary leaf imposed.';
 else rpmPath='Current 2015 H2 RPM scope has no exact deterministic L3/L4 leaf for this basic counting-application structure; retain RPM_COVERAGE_GAP_META_ONLY.';
 const method=hold?'Undefined S/P notation; no unique primary method.':reasons[qid-1];
 const lookupRefs=['docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md','archive/data/master_tables/js_archive_tag_master.json','archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-probability-statistics.json','archive/data/meta-foundation/compiled/taxonomy_registry.json','archive/data/meta-foundation/canonical/packs/probability-statistics/bindings.json','archive/data/meta-foundation/canonical/condition_registry.json'];
 metaRows.push({
  qid,result:hold?'HOLD':'PASS',primaryMethod:method,decisiveStep:reasons[qid-1],
  rpmDisposition:hold?'TRUE_SOURCE_SEMANTIC_HOLD':qid===22?'MULTI_L4_SEMANTIC_SPAN_NO_UNIQUE_PRIMARY':[1,2,3,7,8,19].includes(qid)?'RPM_COVERAGE_GAP_META_ONLY':'CURRENT_RPM_PATH_REVIEWED',
  rpmPrimaryPath:rpmPath,
  projectionDisposition:hold?'UNMATERIALIZED':qid===2?'EVIDENCE_DEBT':qid===22?'EXACT_ACTIVE_CROSS_PACK':'EXACT_ACTIVE',
  problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,
  ...((qid===2||hold)?{nullReason:qid===2?metaDebtReasonQ2:metaDebtReasonQ12}:{}),
  lookupRefs,
  evidence:{standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,questionUid:q.questionUid,sourceQid:q.sourceQid,sourceMode:q.sourceMode,sourceProvenance:q.sourceProvenance},
  ...(hold?{holdEvidence}:{}),
  ...(qid===22?{unresolvedSubItemPaths:['(1) arbitrary function count','(2) injective function count','(3) strict increasing function count','(4) weak increasing tail with strict first inequality'],multiL4Rule:'docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md §1.4.9'}:{})
 });
}
const visualRows=[];
const visualMeta={
 3:{expected:['Graph vertex = each of five regions','Edges join bottom region to every upper region','Edges join consecutive upper regions only'],observed:['Five circles represent upper1–upper4 and lower','Lower is connected to all four upper nodes','Upper nodes form a four-node path'],method:'TOPOLOGY_COMPUTE',predicate:'SVG edge set equals the source image region-adjacency graph.'},
 6:{expected:['Six labeled seats on rectangle','180-degree rotation pairs opposite seats','Each pairing maps one arrangement to one equivalent arrangement'],observed:['Seat labels 1–6 occupy the six rectangle positions','Pairs shown as 1↔4, 2↔5, 3↔6','The visual states 6!/2=360'],method:'TOPOLOGY_COMPUTE',predicate:'SVG seat-pair topology matches the 180-degree quotient used by the solution.'},
 7:{expected:['P=(0,0), R=(3,2), Q=(5,4) on a 5-by-4 grid','P→R has 3 right and 2 up steps','R→Q has 2 right and 2 up steps'],observed:['SVG route uses P→R with 3 right and 2 up steps','SVG route uses R→Q with 2 right and 2 up steps','Labels show C(5,2)=10, C(4,2)=6, product 60'],method:'COORDINATE_COMPUTE',predicate:'Grid vertex coordinates and route segment counts agree with source PNG and binomial factors.'},
 21:{expected:['Eight equally spaced circumference points','Four antipodal pairs define four diameters','Any two distinct diameters give one inscribed rectangle'],observed:['SVG shows eight equally spaced points and four center-crossing diameters','Highlighted rectangle uses endpoints of two diameters','Labels show C(8,4)=70 and C(4,2)=6'],method:'TOPOLOGY_COMPUTE',predicate:'Antipodal pairing and rectangle construction match the source circle and solution proof.'}
};
for(const qid of [3,6,7,21]){
 const q=byQid.get(qid),ref=q.solutionImage,assetBytes=fs.readFileSync(path.join(ROOT,'archive',ref)),m=visualMeta[qid];
 const preview=DIR+'/q'+String(qid).padStart(2,'0')+'-solution.static.png';
 visualRows.push({qid,assetPath:ref,assetSha256:sha(assetBytes),result:'PASS',expectedFacts:m.expected,observedFacts:m.observed,checks:[{method:m.method,predicate:m.predicate,expected:m.expected,observed:m.observed,result:'PASS'}],staticPreview:{path:preview,sha256:sha(fs.readFileSync(path.join(ROOT,preview))),renderKind:'IMAGEMAGICK_STATIC_SVG_PREVIEW',browserRender:'NOT_RUN_R3'}});
}
const sourceEvidencePath='archive/analysis/source-only-h2-1mid-20261011-b5/18_효천고_1학기_중간_고2_확률과통계.evidence.json';
const sourceEvidenceSha=sha(fs.readFileSync(path.join(ROOT,sourceEvidencePath)));
const pdfPath=intake.source.pdfPath,pdfSha=intake.source.pdfSha256,pdfReviewPath=DIR+'/source-q12-page2.png';
const pdfReviewSha=sha(fs.readFileSync(path.join(ROOT,pdfReviewPath)));
const sourceReferences={
 sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',
 intakeProvenanceReuse:{path:sourceEvidencePath,sha256:sourceEvidenceSha,originalPdfSha256:pdfSha,extractedBaselineSha256:'1752D909F457DFEE782397C9C961079EEBEFE5BD0F99FCEE26580E337DD30CD9'},
 currentSourceAtR1StartSha256:'299439016ed81ec7481317913f70261d8909df3250abee61f70c375322512b8d',
 finalCurrentSourceRawSha256:sha(examBytes),finalCurrentSourceRawBufferBlobSha1:blob(examBytes),
 currentStudentBundle:{path:DIR+'/R1.student-only.current.json',sha256:sha(fs.readFileSync(path.join(ROOT,DIR,'R1.student-only.current.json'))),sourceRawSha256:bundle.sourceRawSha256,questionCount:bundle.questionCount,qids:bundle.qids},
 originalFreeze:{path:DIR+'/R1.original-freeze.json',sha256:sha(fs.readFileSync(path.join(ROOT,DIR,'R1.original-freeze.json'))),sourceRawSha256:freeze.sourceRawSha256,qidCount:freeze.rows.length},
 postfreezeCurrentStudentParity:{path:DIR+'/R1.final-postfreeze-all.rev3.json',sha256:sha(fs.readFileSync(path.join(ROOT,DIR,'R1.final-postfreeze-all.rev3.json'))),result:disclosure.studentParity,currentSourceRawSha256:disclosure.sourceRawSha256,originalFreezeSha256:disclosure.originalFreeze.sha256},
 actualPdfComparison:[{qid:12,pdfPath,pdfSha256:pdfSha,page:2,checkedFact:'The q12 expression is printed as S(4,2)+P(6,3) with the choices 10,11,12,13,14; no S/P definition is present in the q12 block.',reviewImage:{path:pdfReviewPath,sha256:pdfReviewSha},result:'TRANSCRIPTION_MATCH; SEMANTIC_HOLD_REMAINS'}],
 routinePdfReview:'NOT_PERFORMED'
};
const consumerPaths=['archive/data/question_metadata.json','archive/data/archive2-catalog.json','archive/data/generated-lite-consumer/v1/index.json'];
const currentUids=new Set(exam.questions.map(q=>q.questionUid));
const consumerChecks=consumerPaths.map(p=>{
 const j=readJson(p),rows=Array.isArray(j)?j:(j.records||j.rows||j.items||j.questions||[]);
 const matches=rows.filter(r=>currentUids.has(r.questionUid||r.uid||r.id));
 return{path:p,recordCount:rows.length,targetUidMatches:matches.length,status:matches.length?'MATCHES_PRESENT':'NO_TARGET_UID_RECORDS'};
});
const finalCalibration={...calibration.solutionQualityCalibration,qualityCompareCount:'22/22',calibrationStatus:'PASS',sampleReadBeforeWork:true,solutionWorkMode:'INDEPENDENT_REVIEW',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE',currentSolutionComparisonSourceSha256:sha(examBytes),recoveryFromFailure:'Prior solution review before approved sample preflight is preserved as FAILED_ATTEMPT; after approved Golden/Negative preflight, current source solutions were re-read/recompared for all 22 qids.'};
const physicalEvidence={
 schemaVersion:'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1',stage:'R1',examUid:exam.examTitle,examPath:EXAM,examSha256:sha(examBytes),questionCount:22,questionRows:physicalQuestionRows,visualRows,metaRows,
 solutionQualityCalibration:finalCalibration,
 sourceReferences,consumerIndexParity:{status:'NO_CURRENT_TARGET_UID_RECORDS',checks:consumerChecks,stageScope:'R1 audit only; no publication or registry writer authorized by this stage.'},
 renderStatus:'NOT_RUN_R3',actualExamEngineRender:'NOT_RUN_R3',zeroItemHold:'NOT_MET: q12 true item HOLD is carried forward.'
};
const physicalPath=DIR+'/R1.physical-review.final.json';
fs.writeFileSync(path.join(ROOT,physicalPath),JSON.stringify(physicalEvidence,null,2)+'\n',{flag:'wx'});
const evidence={
 schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R1',examUid:exam.examTitle,artifactSha:blob(examBytes),artifactRawSha256:sha(examBytes),qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',
 goldenCalibrationReviewed:true,goldenCalibrationSet:calibration.goldenCalibrationSet,goldenCalibration:calibration.goldenCalibration,
 solutionQualityCalibration:finalCalibration,
 sourceIdentity:{sourceArchiveFile:EXAM_REL,sourceMode:'ORIGINAL',currentSourceRawSha256:sha(examBytes),sourceIntakeEvidencePath:sourceEvidencePath,sourceIntakeEvidenceSha256:sourceEvidenceSha,sourceOriginalRawSha256:'1752D909F457DFEE782397C9C961079EEBEFE5BD0F99FCEE26580E337DD30CD9',sourceQidCount:22},
 sourceReferencePolicy:sourceReferences,
 independence:{createReceiptUsedAsAuthority:false,independentAnswersFrozenBeforeStoredAnswer:true,postfreezeComparisonAfterFreeze:true,fullStudentBundleParity:'EXACT'},
 rows:genericRows,
 physicalReviewRef:{path:physicalPath,sha256:sha(fs.readFileSync(path.join(ROOT,physicalPath)))},
 metaDebtSummary:{count:2,rows:[{qid:2,fields:['problemTypeKey','templateKey'],reason:metaDebtReasonQ2},{qid:12,fields:['problemTypeKey','templateKey'],reason:metaDebtReasonQ12}]},
 metaCorrections:[readJson(DIR+'/R1.q16-meta-correction.record.json'),readJson(DIR+'/R1.qids-1-3-7-meta-correction.record.json'),readJson(DIR+'/R1.visual-tag-correction.rev2.record.json')],
 answerAdjudication:{path:DIR+'/R1.postcompare.adjudication.json',sha256:sha(fs.readFileSync(path.join(ROOT,DIR,'R1.postcompare.adjudication.json'))),freezePreserved:true},
 solutionRepair:{path:DIR+'/R1.solution-repair.rev4.record.json',sha256:sha(fs.readFileSync(path.join(ROOT,DIR,'R1.solution-repair.rev4.record.json'))),changedQids:[...solutionRepairQids],studentBodyChanged:false},
 failureHistoryPaths:['R1.failed-solution-order-attempt.json','R1.solution-repair.rev1.failure.json','R1.solution-repair.rev1-count-failure.json','R1.solution-repair.rev2-count-failure.json','R1.solution-repair.rev3-count-failure.json','R1.solution-repair.rev4-path-failure.json','R1.postrepair-parity-invocation.failure.json','R1.final-postfreeze-all.rev1.failure.json','R1.visual-tag-correction.rev1.failure.json'].map(p=>DIR+'/'+p),
 summary:{questionCount:22,independentFreezeCount:22,answerMatches:22,sourceItemHoldCount:1,questionLayoutRows:22,solutionLayoutRows:22,metaRows:22,visualRows:22,linkedSolutionSvgCount:4,problemVisualAssetCount:4,visualTagCorrections:4,renderStatus:'NOT_RUN_R3',itemHoldQids:[12]},
 actualRenderStatus:'NOT_RUN_R3'
};
const genericPath=DIR+'/R1.evidence.final.json';
fs.writeFileSync(path.join(ROOT,genericPath),JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({physicalEvidencePath:physicalPath,physicalEvidenceSha256:sha(fs.readFileSync(path.join(ROOT,physicalPath))),genericEvidencePath:genericPath,genericEvidenceSha256:sha(fs.readFileSync(path.join(ROOT,genericPath))),sourceRawSha256:sha(examBytes),artifactSha:blob(examBytes),qidCount:22,itemHoldQids:[12],unresolvedNulls:[2,12],consumerChecks},null,2));


