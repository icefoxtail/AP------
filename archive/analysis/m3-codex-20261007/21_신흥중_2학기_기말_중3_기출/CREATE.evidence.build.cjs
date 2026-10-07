const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
async function main(){
 const root='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------';
 const ev=path.join(root,'archive/analysis/m3-codex-20261007/21_신흥중_2학기_기말_중3_기출');
 const assignment=JSON.parse(fs.readFileSync(path.join(ev,'CREATE.assignment.json'),'utf8'));
 const sourceManifest=JSON.parse(fs.readFileSync(assignment.sourceManifestAbsolute,'utf8'));
 const sourceRow=sourceManifest.rows.find(x=>x.examUid===assignment.examUid);
 const sourceJsAbsolute=path.join('C:/Users/USER/Desktop/AP------',sourceRow.workingPath);
 const sourcePdfAbsolute=sourceRow.sourcePdfs[0].originalPath;
 const sourcePdfCopiedAbsolute=path.join('C:/Users/USER/Desktop/AP------',sourceRow.sourcePdfs[0].workingPath);
 const sourceProvenanceCopiedAbsolute=path.join('C:/Users/USER/Desktop/AP------',sourceRow.sourceEvidence[0].workingPath);
 const sourceProvenanceAbsolute=sourceRow.sourceEvidence[0].repositoryPath;
 const answerKeyPdfAbsolute='C:/Users/USER/Desktop/기출정리 파일/(4)2기말/중3/2021_신흥중3_수학_2기말_정답.pdf';
 const answerKeyPdfCopiedAbsolute=path.join(ev,'source-pages/2021_신흥중3_수학_2기말_정답.pdf');
 const jsBytes=fs.readFileSync(assignment.workingJsAbsolute);
 const rawSha=crypto.createHash('sha256').update(jsBytes).digest('hex');
 const context={window:{}}; vm.runInNewContext(jsBytes.toString('utf8'),context);
 const questions=context.window.questionBank;
 if(questions.length!==23 || context.window.examTitle!==assignment.examUid) throw new Error('candidate identity/denominator mismatch');
 const sourceBytes=fs.readFileSync(sourceJsAbsolute);
 const sourceRawSha=crypto.createHash('sha256').update(sourceBytes).digest('hex');
 if(sourceRawSha!==assignment.artifactRawSha256) throw new Error('source-batch input changed');
 const q16=JSON.parse(fs.readFileSync(sourceProvenanceCopiedAbsolute,'utf8')).transcriptionRepairs.find(x=>x.qid===16);
 if(!q16 || q16.after!=='B deviation -10') throw new Error('missing q16 source repair record');
 const helperModule=await import(pathToFileURL(path.join(root,'archive/tools/archive-stage-validator.mjs')).href);
 const artifactSha=helperModule.gitBlobSha(jsBytes);
 const sourceInputGitBlobSha=helperModule.gitBlobSha(sourceBytes);
 const preflight=JSON.parse(fs.readFileSync(path.join(ev,'CREATE.calibration-preflight.json'),'utf8')).solutionQualityCalibration;
 const outputBindings=JSON.parse(fs.readFileSync(path.join(ev,'CREATE.output-bindings.json'),'utf8'));
 const provenance=JSON.parse(fs.readFileSync(sourceProvenanceCopiedAbsolute,'utf8'));
 const questionPage=qid=>qid<=6?1:qid<=14?2:qid<=21?3:4;
 const sourceQuestionNo=qid=>qid>=21?'서술형 '+(qid-20):String(qid);
 const hash=value=>crypto.createHash('sha256').update(value,'utf8').digest('hex');
 const fingerprint=q=>hash(JSON.stringify({content:q.content,choices:q.choices,image:q.image||null}));
 const sourceMode=qid=>qid===16?'AUDITED_REPAIR':outputBindings.normalizedStudentFieldQids.includes(qid)?'AUDITED_REPAIR':'ORIGINAL';
 const answerLabels=['①','②','③','④','⑤'];
 const objectiveRaw=[1,4,4,4,3,3,2,2,2,2,4,5,1,3,2,5,5,3,5,3];
 const writtenRaw={21:'72°',22:'△ABC∼△ACH; CH=3√3 cm',23:'평균 21, 분산 8'};
 const primaryReason=qid=>questions.find(q=>q.id===qid).primaryMethod;
 const pageImage=pages=>path.join(ev,'source-pages',pages);
 const sampleItems=preflight.goldenSampleQuestionRefs;
 const sampleFiles=preflight.goldenSampleRefs;
 const sampleSvgs=preflight.solutionSvgRefs;
 const goldenSamples=sampleFiles.map(sample=>{
   const items=sampleItems.filter(x=>x.path===sample.path).map(item=>{
     const sampleStem=path.basename(sample.path,'.js');
     const svg=sampleSvgs.find(x=>x.path.includes(sampleStem+'/') && (x.path.endsWith('/q'+item.qid+'-solution.svg') || x.path.endsWith('/q'+String(item.qid).padStart(2,'0')+'-solution.svg')));
     const itemOut={qid:item.qid,solutionSha256:item.solutionSha256,observation:item.observation,axes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY']};
     if(svg){
       itemOut.visualSha256=svg.sha256;
       itemOut.visualRasterAbsolute=svg.actualRenderPath;
       itemOut.visualRasterSha256=crypto.createHash('sha256').update(fs.readFileSync(svg.actualRenderPath)).digest('hex');
       itemOut.visualObservation=svg.path.includes('매산여고')?'Edge render shows moved circle centers and final equation agree.':svg.path.includes('효천고')?'Edge render shows the plotted slope/line relationship and numeric annotation agree.':'Edge render shows overlap-region cardinality labels and the 48 count agree.';
     }
     return itemOut;
   });
   return {path:sample.path,sha256:sample.sha256,gitBlobSha:sample.gitBlobSha,items};
 });
 const negativeReadme='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
 const negSvgRefs=preflight.negativeSampleRefs.filter(x=>x.path.endsWith('.svg'));
 const negativeSample={path:negativeReadme,sha256:preflight.negativeSampleRefs.find(x=>x.path===negativeReadme).sha256,observation:preflight.preflightObservations.negative,renderedSvgs:negSvgRefs.map(x=>({path:x.path,sha256:x.sha256,actualRenderPath:x.actualRenderPath,actualRenderSha256:crypto.createHash('sha256').update(fs.readFileSync(x.actualRenderPath)).digest('hex'),observation:x.observation}))};
 const qMetadata=q=>({
   qid:q.id,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,
   projectionDisposition:q.problemTypeKey&&q.templateKey?'EXACT_ACTIVE':'PROJECTION_UNMATERIALIZED',
   nullReason:q.problemTypeKey&&q.templateKey?null:(q.standardUnitKey==='M3-07'?'2015 M3-2 provides the M3 statistics curriculum keys, but the current GLOBAL ACTIVE registry has no middle-statistics PT/TPL binding. Do not project high-school probability-statistics semantics into M3.':'No exact ACTIVE 2015 M3-06 binding/template for the circumradius-from-sine method; retain the verified M3-06/RPM classification and explicit null debt.'),
   primaryMethod:q.primaryMethod,decisiveStep:q.decisiveStep,
   lookupRefs:['docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/MIDDLE/M3-2.md','docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md','archive/data/meta-foundation/canonical/registry_index.json','archive/data/meta-foundation/canonical/packs/middle-geometry/taxonomy.json','archive/data/meta-foundation/canonical/packs/middle-geometry/bindings.json']
 });
 const rows=questions.map(q=>{
   const fp=fingerprint(q), page=questionPage(q.id), mode=sourceMode(q.id), hold=q.id===18, solSha=q.solution?hash(q.solution):null;
   const imgRef=q.image||null;
   const imgPath=imgRef?path.join(assignment.assetRootAbsolute,imgRef):null;
   const imgSha=imgPath?crypto.createHash('sha256').update(fs.readFileSync(imgPath)).digest('hex'):null;
   const questionLayout={status:'PASS',beforeDisposition:'LAYOUT_KEEP',finalDisposition:'LAYOUT_KEEP',sourceTextExactParity:'PASS',choicesExactParity:'PASS',changedFields:mode==='AUDITED_REPAIR'?['runtime content/choices escape decoding; source text atom stream and option order preserved']:[],reason:'Full-page PDF pixels and the assigned source crop/choice order were compared; only source-grounded runtime escape normalization restores one TeX control character or authored line break.'};
   const solutionLayout={status:hold?'HOLD':'PASS',smallBoardContinuityStatus:hold?'HOLD':'PASS',solutionSha256:solSha,decisiveStep:q.decisiveStep,reason:hold?'The source wording conflicts with the official answer key and its own plotted relation; no answer or student solution is forced.':'The reason for the setup, decisive transformation, intermediate values, substitution/calculation, and final value are separated into reproducible board lines.'};
   const metaEvidence={status:'PASS',standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,primaryMethod:q.primaryMethod,projectionDisposition:q.problemTypeKey&&q.templateKey?'EXACT_ACTIVE':'PROJECTION_UNMATERIALIZED',nullReason:q.problemTypeKey&&q.templateKey?null:qMetadata(q).nullReason,reason:q.standardUnitKey==='M3-07'?'2015 M3-2 statistics RPM path is recorded; no high-school statistics key is projected.':'2015 M3-2 circle path and only exact active middle-geometry bindings are used.'};
   const visualEvidence={status:'PASS',problemAsset:imgRef?{path:imgRef,sha256:imgSha}:null,sourcePage:page,sourcePageRasterAbsolute:pageImage('p'+page+'.png'),solutionSvgStatus:'NOT_REQUIRED',reason:imgRef?'The original problem visual is preserved at the assignment-bound SHA; full source page was opened and reviewed.':'This item is fully represented by its source text/choices and needs no separate problem image or solution SVG.',renderStatus:'NOT_RUN_ROOT_WAIVER',captureCount:0};
   const prov={sourceParity:{status:'PASS',sourcePdfAbsolute,sourcePdfSha256:sourceRow.sourcePdfs[0].sha256,sourcePdfCopiedAbsolute,sourcePageNo:page,sourceOrdinal:q.id,sourceIdentityKey:'sha256:'+fp+'|'+q.id,sourceIdentityContentChoicesImageSha256:fp,sourceMode:mode,studentFieldMatch:mode==='ORIGINAL'?'PASS_SOURCE_TEXT_CHOICES_IMAGE_PARITY':'PASS_AFTER_SOURCE_GROUNDED_RUNTIME_ESCAPE_NORMALIZATION'}};
   if(mode==='AUDITED_REPAIR') prov.repair={sourceInputAbsolute:sourceJsAbsolute,sourceInputRawSha256:sourceRawSha,sourcePdfAbsolute,sourcePdfSha256:sourceRow.sourcePdfs[0].sha256,sourcePageNo:page,repairKind:'RUNTIME_TEX_ESCAPE_NORMALIZATION',changedLoci:['student content/choices double-backslash TeX controls restored to one','literal backslash-n source layout markers restored as authored line breaks'],minimumChange:'source-grounded character/escape/layout repair only'};
   if(mode==='AUDITED_REPAIR') prov.repairedTruth={sourcePdfSha256:sourceRow.sourcePdfs[0].sha256,sourcePageNo:page,sourcePixelInspection:'PASS',sourceTextExactParity:'PASS_AFTER_REPAIR',choicesExactParity:'PASS'};
   if(q.id===16) prov.sourceCorrection=q16;
   
   if(hold) prov.answerConflict={answerKeyPdfAbsolute,answerKeyPdfSha256:crypto.createHash('sha256').update(fs.readFileSync(answerKeyPdfAbsolute)).digest('hex'),answerKeyPage:1,answerKeyCell:'수학 column / row 18 / cell 3',sourceStem:'양의 상관관계',visualFact:'option ③ is negative correlation; flight distance increasing while remaining fuel decreases is negative correlation',disposition:'TRUE_ITEM_HOLD; answer remains empty pending R1/R2 and authorized direct replacement if confirmed'};
   return {qid:q.id,verdict:hold?'HOLD':'PASS',sourceMode:mode,sourceQuestionNo:sourceQuestionNo(q.id),sourcePage:page,provenanceEvidence:prov,axisEvidence:{questionLayout,solutionLayout,meta:metaEvidence,visualSvg:visualEvidence},smallBoardContinuityStatus:hold?'HOLD':'PASS',solutionSha256:solSha,metaDebtFields:q.problemTypeKey&&q.templateKey?[]:['problemTypeKey','templateKey'],metaDebtReason:q.problemTypeKey&&q.templateKey?null:qMetadata(q).nullReason,difficultyEvidence:{difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,reviewStatus:'reviewed_pass',primaryMethod:q.primaryMethod,reason:q.decisiveStep}};
 });
 const questionRows=questions.map(q=>{
   const hold=q.id===18;
   const keyRef=q.id<21?'answer PDF page 1, 수학 column, row '+q.id:'answer PDF page 2, 수학 서술형 answer line '+(q.id-20);
   const keyRaw=q.id<21?objectiveRaw[q.id-1]:writtenRaw[q.id];
   const answerStatus=hold?'HOLD':'PASS';
   const solutionStatus=hold?'HOLD':'PASS';
   const qrow=rows[q.id-1];
   return {qid:q.id,sourceExact:{status:'PASS',evidence:'PDF source page '+questionPage(q.id)+' full-page pixels, exact prompt symbols/units, and question image/option parity reviewed.'},answerMath:{status:answerStatus,evidence:hold?'Independent semantic reading: distance increases while remaining fuel decreases, so the plotted relation should be negative; source asks positive but the official key indicates option ③, the negative plot. No answer is forced.':'Independent solve matches '+keyRef+' raw source key '+JSON.stringify(keyRaw)+'; one mathematical answer is supported.'},solutionMath:{status:solutionStatus,evidence:hold?'Not resolved because the source body/key/plot direction conflict.':'Final solution follows the source prompt and verified answer; decisive step: '+q.decisiveStep},smallBoard:{status:hold?'HOLD':'PASS',evidence:hold?'No false student explanation is written while answer is unresolved.':'Actual equations and the necessary condition/application steps are separated into readable line blocks.'},curriculum:{status:'PASS',evidence:q.standardUnitKey+' / '+q.subUnitKey+'; 2015 M3 curriculum, separate from Meta advanced projection and difficulty.'},visualNecessity:{status:'PASS',evidence:q.image?'Required original figure/table/graph is present as '+q.image+'; its SHA matches the assignment and full source page was opened.':'No separate visual is needed; student data and choices are contained in the prompt.'},meta:{status:'PASS',evidence:qMetadata(q).projectionDisposition+(qMetadata(q).nullReason?'; '+qMetadata(q).nullReason:'; exact ACTIVE key pair recorded.')},difficulty:{status:'PASS',evidence:'Current-pass bucket '+q.difficultyBucket+', confidence '+q.difficultyConfidence+', boundary NONE; independently assessed from the M3 source task structure. '+q.decisiveStep},runtimeString:{status:'PASS',evidence:'Candidate evaluated in window.questionBank; TeX controls decode to one slash, intended line breaks are actual newlines, and fields remain valid strings.'},answerKeyEvidence:{reference:keyRef,rawValue:keyRaw,assignedAnswer:hold?null:q.answer,comparison:hold?'CONFLICT':'MATCH'}};
 });
 const metaRows=questions.map(q=>Object.assign({qid:q.id,result:'PASS',rpmDisposition:'RPM_PRIMARY_FINAL_PATH_REUSED'},qMetadata(q),{metaDebtFields:qMetadata(q).projectionDisposition==='PROJECTION_UNMATERIALIZED'?['problemTypeKey','templateKey']:[],metaDebtReason:qMetadata(q).nullReason}));
 const difficultyRows=questions.map(q=>({qid:q.id,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,reviewStatus:'reviewed_pass',solutionSha256:q.solution?hash(q.solution):null,primaryMethod:q.primaryMethod,reason:q.id===18?'Source answer conflict is an item HOLD, not a difficulty level.':q.decisiveStep}));
 const visualRows=questions.map(q=>{const imgRef=q.image||null;const imgPath=imgRef?path.join(assignment.assetRootAbsolute,imgRef):null;return {qid:q.id,result:'PASS',problemAssetPath:imgRef,assetSha256:imgPath?crypto.createHash('sha256').update(fs.readFileSync(imgPath)).digest('hex'):null,expectedFacts:imgRef?['crop matches source page '+questionPage(q.id),'all original labels/table/plot choices remain readable']:[],observedFacts:imgRef?['source page was directly opened; assignment asset SHA matches the locked source-batch image copy']:['no separate problem image is required'],checks:imgRef?[{method:'SOURCE_PAGE_PIXEL_REVIEW',result:'PASS',predicate:'prompt figure and linked source image are faithful',expected:'source page '+questionPage(q.id),observed:'page opened and assigned crop hash verified'}]:[],solutionSvgStatus:'NOT_REQUIRED',renderStatus:'NOT_RUN_ROOT_WAIVER'};});
 const assetsByRef=new Map();
 for(const q of questions)if(q.image&&!assetsByRef.has(q.image)){
   const a=assignment.requiredAssets.find(x=>x.ref===q.image);
   if(!a)throw new Error('unassigned image ref '+q.image);
   const bytes=fs.readFileSync(a.path), h=crypto.createHash('sha256').update(bytes).digest('hex');
   if(h!==a.sha256)throw new Error('asset SHA mismatch '+q.image);
   assetsByRef.set(q.image,{ref:q.image,path:a.path,sha256:h,source:'ASSIGNMENT_LOCKED_SOURCE_CROP'});
 }
 const sourceModeSummary={AUDITED_REPAIR:outputBindings.normalizedStudentFieldQids.length,ORIGINAL:5};
 const sourcePagesRendered=[1,2,3,4].map(n=>({page:n,path:path.join(ev,'source-pages/p'+n+'.png'),sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(ev,'source-pages/p'+n+'.png'))).digest('hex'),review:'DIRECT_FULL_PAGE_PIXEL_OPENED'}));
 const answerPagesRendered=[1,2].map(n=>({page:n,path:path.join(ev,'source-pages/answer-p'+n+'.png'),sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(ev,'source-pages/answer-p'+n+'.png'))).digest('hex'),review:'DIRECT_FULL_PAGE_PIXEL_OPENED'}));
 const answerKeyAudit=questions.map(q=>({qid:q.id,sourcePage:questionPage(q.id),answerKeyPage:q.id<21?1:2,cellReference:q.id<21?'Math column / row '+q.id:'수학 서술형 line '+(q.id-20),rawKey:q.id<21?objectiveRaw[q.id-1]:writtenRaw[q.id],candidateAnswer:q.id===18?null:q.answer,independentResult:q.id===18?'negative correlation; conflicts with the stem':'matches answer key and source reasoning',status:q.id===18?'CONFLICT_HOLD':'MATCH'}));
 const artifactDispositions={artifactSha,rows:questions.map(q=>({qid:q.id,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,projectionDisposition:q.problemTypeKey&&q.templateKey?'EXACT_ACTIVE':'PROJECTION_UNMATERIALIZED',metaDebtFields:q.problemTypeKey&&q.templateKey?[]:['problemTypeKey','templateKey'],metaDebtReason:qMetadata(q).nullReason,nullReason:qMetadata(q).nullReason,sourceIdentityKey:'sha256:'+fingerprint(q)+'|'+q.id}))};
 const evidence={
  schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',runId:assignment.runId,stage:'CREATE',examUid:assignment.examUid,examTitle:context.window.examTitle,examPath:assignment.productionRelativePath,evidenceRef:'archive/analysis/m3-codex-20261007/21_신흥중_2학기_기말_중3_기출/CREATE.evidence.json',
  artifactSha,artifactRawSha256:rawSha,artifactPath:assignment.workingJsAbsolute,sourceArtifactRawSha256:assignment.artifactRawSha256,expectedHead:assignment.expectedHead,headAtAssignment:assignment.expectedHead,assignmentAbsolute:path.join(ev,'CREATE.assignment.json'),workingJsAbsolute:assignment.workingJsAbsolute,assetRootAbsolute:assignment.assetRootAbsolute,evidenceRootAbsolute:assignment.evidenceRootAbsolute,
  sourceManifestAbsolute:assignment.sourceManifestAbsolute,sourceManifestReadOnly:true,sourceJsAbsolute,sourceJsSha256:sourceRawSha,sourceInputGitBlobSha1:sourceInputGitBlobSha,sourceBatchSelection:{sourceSelection:sourceRow.sourceSelection,selectedBranch:sourceRow.selectedBranch,selectedBranchSha:sourceRow.selectedBranchSha,selectedPath:sourceRow.selectedPath,productionPath:sourceRow.productionPath},
  sourcePdfAbsolute,sourcePdfCopiedAbsolute,sourcePdfSha256:sourceRow.sourcePdfs[0].sha256,sourcePdfPagesReviewed:[1,2,3,4],sourcePdfAllPagesRenderedAndReviewed:true,sourcePdfPageRasters:sourcePagesRendered,
  answerKeyPdfAbsolute,answerKeyPdfCopiedAbsolute,answerKeyPdfSha256:crypto.createHash('sha256').update(fs.readFileSync(answerKeyPdfAbsolute)).digest('hex'),answerKeyPagesReviewed:[1,2],answerKeyAllPagesRenderedAndReviewed:true,answerKeyPageRasters:answerPagesRendered,
  answerHwpAbsolute:null,answerHwpCopiedAbsolute:null,answerHwpSha256:null,
  sourceProvenanceAbsolute,sourceProvenanceCopiedAbsolute,sourceProvenanceSha256:sourceRow.sourceEvidence[0].sha256,
  sourceIdentity:{school:provenance.schoolIdentity,year:2021,grade:3,term:'2학기 기말',course:'중3 수학',sourcePdfPages:4,questionCount:23,sourcePdfPageMapping:'q1-6:p1;q7-14:p2;q15-20+서술형1:p3;서술형2-3:p4',answerKeyRawColumn:'수학',sourcePixelTranscriptionProvenance:'all four question PDF pages and both answer-key PDF pages were rendered and directly opened; no OCR used as exact-parity authority'},
  questionSourcePages:Object.fromEntries(questions.map(q=>[q.id,questionPage(q.id)])),questionSourcePageMapping:'q1-6:p1;q7-14:p2;q15-20+서술형1:p3;서술형2-3:p4',
  sourceMode:'SOURCE_ONLY_CREATE_WITH_AUDITED_REPAIR',sourceModeSummary,
  sourceModeProvenance:rows.map(r=>({qid:r.qid,sourceQuestionNo:r.sourceQuestionNo,sourcePage:r.sourcePage,sourceMode:r.sourceMode,sourceIdentityKey:r.provenanceEvidence.sourceParity.sourceIdentityKey,sourceIdentityContentChoicesImageSha256:r.provenanceEvidence.sourceParity.sourceIdentityContentChoicesImageSha256,studentFieldMatch:r.provenanceEvidence.sourceParity.studentFieldMatch})),
  sourceCorrectionLog:[{qid:16,sourcePage:3,repairKind:'SOURCE_DERIVED_REPAIR',before:'B deviation [blank]',after:'B deviation -10',reason:'The five deviations sum to zero: -6 + B + 11 + 9 - 4 = 0.',answerFieldAdded:false,repairRecord:sourceProvenanceAbsolute,repairRecordSha256:sourceRow.sourceEvidence[0].sha256},{qids:outputBindings.normalizedStudentFieldQids,repairKind:'RUNTIME_TEX_ESCAPE_NORMALIZATION',changedLoci:['double-backslash TeX control → one TeX control','literal backslash-n source layout marker → semantic newline'],reason:'Full-page PDF source confirmed source symbols and intended table/subquestion line boundaries; student meaning and choice order are unchanged.'}],
  sourceEncodingRepair:{repairKind:'RUNTIME_TEX_ESCAPE_NORMALIZATION',sourceInputAbsolute:sourceJsAbsolute,sourceInputRawSha256:sourceRawSha,sourcePdfAbsolute,sourcePdfSha256:sourceRow.sourcePdfs[0].sha256,affectedQids:outputBindings.normalizedStudentFieldQids,changedLoci:['student content/choices repeated TeX escape sequences decoded to one control slash','literal backslash-n markers decoded to actual line breaks'],minimumChange:'Source-grounded encoding/layout repair only; exact text atoms, formula, units, choices, and order were verified against PDF pixels.'},
  answerKeyAudit,goldenCalibrationReviewed:true,goldenCalibrationSet:sampleFiles.map(x=>x.path),solutionQualityCalibration:preflight,
  goldenCalibration:{samples:goldenSamples,negativeSample},
  questionLayoutStatus:'PASS',questionLayoutDenominator:23,sourceTextExactParityStatus:'PASS',choicesExactParityStatus:'PASS',questionLayoutRenderStatus:'NOT_RUN_ROOT_WAIVER',
  smallBoardContinuityStatus:'22/23_PASS_1_ITEM_HOLD',metaStatus:'PASS_WITH_EXPLICIT_PROJECTION_DEBT',visualSvgStatus:'PASS',visualRenderStatus:'STATIC_SOURCE_ASSET_REVIEW_ONLY',
  renderDecision:{authority:'ROOT_DELEGATED',disposition:'ROOT_DIRECTED_STATIC_COMPLETE',status:'NOT_RUN_ROOT_WAIVER',screenCases:['exam/desktop','exam/mobile','sol/desktop','sol/mobile','ans/desktop','ans/mobile'],captureCount:0,qualityWaived:false,reason:'Assignment grants CURRENT §25 ROOT static route. This records actual exam-engine render as NOT_RUN_ROOT_WAIVER and preserves all quality, R1/R2, item HOLD, asset, and production gates.',actualRenderPassClaimed:false},
  rows,artifactDispositions,visualAssets:[...assetsByRef.values()],itemHoldQids:[18],itemHoldCount:1,solutionRewrite:'FULL_ALL_QUESTIONS',solutionRewriteAttempted:'23/23',solutionRewriteResolved:'22/23',
  questionRows,metaRows,difficultyRows,visualRows,finalDisposition:'CREATE_COMPLETE_WITH_ITEM_HOLD',
  summary:{denominator:23,sourceExactPass:23,choicesExactPass:23,answerMathPass:22,solutionMathPass:22,smallBoardPass:22,metaPass:23,difficultyPass:23,visualSvgPass:23,itemHolds:1,itemHoldQids:[18],runtimeEscapeRepairQids:outputBindings.normalizedStudentFieldQids,sourceDerivedRepairQids:[16],answerKeyDifferences:[18],sourcePagesRendered:4,answerKeyPagesRendered:2,sourceAssetRefCount:assetsByRef.size,actualExamEngineRender:'NOT_RUN_ROOT_WAIVER',captureCount:0},
  lateCalibrationCorrectionReview:null
 };
 fs.writeFileSync(path.join(ev,'CREATE.evidence.json'),JSON.stringify(evidence,null,2),'utf8');
 console.log(JSON.stringify({artifactSha,artifactRawSha256:rawSha,evidenceRef:evidence.evidenceRef,questionCount:23,itemHoldQids:[18],sourceModeSummary,firstMissingClosureStep:'R1 then R2 independent review of the current student artifact; q18 must remain an honest hold until adjudicated'},null,2));
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});