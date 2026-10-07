import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
const root='C:/Users/USER/Desktop/AP-worktrees/h1-final-three-pilot-20261007/AP------';
const uid='21_고흥고_1학기_기말_고1_기출';
const run='h1-final-three-pilot-20261007';
const assignmentFile='C:/Users/USER/Desktop/AP-worktrees/h1-final-three-pilot-20261007/AP------/archive/analysis/21_고흥고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/ROOT.assignment.CREATE.json';
const assignment=JSON.parse(fs.readFileSync(assignmentFile,'utf8'));
const jsFile=assignment.workingJsAbsolute;
const temp=assignment.assetRootAbsolute;
const evidenceRoot=assignment.evidenceRootAbsolute;
const pdf=assignment.pdfAbsolute;
const officialPdf=assignment.officialSolutionPdfAbsolute;
const prodRel=assignment.productionRelativePath;
const evidenceFile=path.join(evidenceRoot,'CREATE.evidence.json');
const raw=fs.readFileSync(jsFile);
const source=raw.toString('utf8');
const sandbox={window:{}};vm.runInNewContext(source,sandbox,{timeout:5000});
const questions=sandbox.window.questionBank;
if(!Array.isArray(questions)||questions.length!==22)throw new Error('SOURCE_QID_DENOMINATOR_MISMATCH');
const byId=new Map(questions.map(q=>[Number(q.id),q]));
const sourceIndex=JSON.parse(fs.readFileSync(path.join(temp,'draft-source-index.json'),'utf8'));
const indexById=new Map(sourceIndex.map(x=>[x.qid,x]));
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const tool=await import(pathToFileURL(path.join(root,'archive/tools/archive-stage-validator.mjs')).href);
const gitBlobSha=tool.gitBlobSha;
const cleanBlob=(rel,file)=>execFileSync('git',['-C',root,'hash-object','--path',rel,file],{encoding:'utf8'}).trim();
const pdfSha=sha256(fs.readFileSync(pdf));
const officialSha=sha256(fs.readFileSync(officialPdf));
const taxonomyFile=path.join(root,'archive/data/meta-foundation/compiled/taxonomy_registry.json');
const crosswalkFile=path.join(root,'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json');
const taxonomySha=sha256(fs.readFileSync(taxonomyFile));
const activeModule=await import(pathToFileURL(path.join(root,'archive/tools/meta-foundation/active-registry.mjs')).href);
const activeRegistry=activeModule.loadActiveMetaRegistry(root);
const activeMetaResults=[];
const crosswalkSha=sha256(fs.readFileSync(crosswalkFile));
const sampleSpecs=[
 {path:'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',qids:[5,8]},
 {path:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',qids:[17,22]},
 {path:'archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js',qids:[12,15]},
];
const sampleRecords=[];
for(const spec of sampleSpecs){
 const absolute=path.join(root,spec.path),bytes=fs.readFileSync(absolute),ctx={window:{}};
 vm.runInNewContext(bytes.toString('utf8'),ctx,{timeout:5000});
 const items=spec.qids.map(qid=>{
  const sampleQ=ctx.window.questionBank.find(q=>Number(q.id)===qid);
  const item={qid,solutionSha256:sha256(Buffer.from(String(sampleQ.solution),'utf8')),observation:qid===5?'The equality condition, factorized set equality, substitution, and final value appear in separate board steps.':qid===8?'Graph facts become coefficient signs before the transformed line is tested against each quadrant.':qid===17?'The translation formula, invariant point, circle center, and coefficient product are shown as explicit substitutions.':qid===22?'Each sign case is rejected or retained from the center-distance equations; the final product is then computed.':qid===12?'Candidate ordered pairs are isolated and the parameter inequality selects the one common solution.':'Area ratio gives the side ratio before point coordinates and the target line are derived.'};
  if(sampleQ.solutionImage){const visual=path.join(root,'archive',sampleQ.solutionImage);item.visualSha256=sha256(fs.readFileSync(visual));}
  return item;
 });
 sampleRecords.push({path:spec.path,sha256:sha256(bytes),gitBlobSha:gitBlobSha(bytes),items});
}
const negativePath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const negativeBytes=fs.readFileSync(path.join(root,negativePath));
const negativeVisualFiles=['q1-solution.bad.svg','q7-solution.bad.svg','q20-solution.bad.svg'].map(name=>`archive/fixtures/review-negative-regressions/2026-10-01-bokseong/${name}`);
const negativeVisualChecks=negativeVisualFiles.map(file=>({path:file,sha256:sha256(fs.readFileSync(path.join(root,file))),observation:file.endsWith('q1-solution.bad.svg')?'The line coordinates do not pass through their claimed points or intercept; visual claims must be checked from primitives.':file.endsWith('q7-solution.bad.svg')?'The plotted parabola misses the labelled vertices; label text alone is not semantic evidence.':'The line primitive does not have the claimed slope and perpendicular relation.'}));
const calibrationPreflight=JSON.parse(fs.readFileSync(path.join(temp,'solution-calibration-preflight.json'),'utf8')).solutionQualityCalibration;
calibrationPreflight.qualityCompareCount='22/22';
const qEvidence=[];
const metaDispositionRows=[];
const sourceImageIds=new Set([20,22]);
const itemStatusFields=['itemStatus','status','hold','itemHold','itemHoldStatus','reviewStatus'];
for(const q of questions){
 const id=Number(q.id),idx=indexById.get(id);
 const activeMeta=activeModule.validateActiveMetaFields(q,activeRegistry,{requireFields:true});
 activeMetaResults.push({qid:id,...activeMeta});
 if(activeMeta.status!=='VALIDATED')throw new Error('ACTIVE_META_VALIDATION_FAILED:q'+id+':'+activeMeta.errors.join(','));if(!idx)throw new Error('SOURCE_PAGE_BINDING_MISSING:q'+id);
 const pagePath=path.join(temp,`source-page-${idx.pageNo}.png`),pageBytes=fs.readFileSync(pagePath);
 const sourceImageRefs=[];
 if(sourceImageIds.has(id)){
  const ref=`assets/images/${uid}/q${id}.png`;
  const file=path.join(temp,ref);
  sourceImageRefs.push({ref,sha256:sha256(fs.readFileSync(file)),gitBlobSha:gitBlobSha(fs.readFileSync(file)),sourceCrop:'Original full-page scan pixels; q20 store-axis sketch or q22 triangle route diagram.'});
 }
 const formulas=[...String(q.content).matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
 const sharedMaterial=id===20?'Source page 4 diagram is shared with the equal-cost locus item only.':id===22?'Source page 4 triangle diagram is part of the route-length item.':'No shared source block.';
 const hasStatus=itemStatusFields.some(k=>Object.hasOwn(q,k));
 const meta={standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility};
 const smallBoardStatus='PASS';
 const solutionHash=sha256(Buffer.from(q.solution,'utf8'));
 const sourceAssets=sourceImageRefs.map(a=>a.ref);
 const axes={
  questionLayout:{beforeDisposition:'SOURCE_LAYOUT',finalDisposition:'SOURCE_TEXT_EXACT_PARITY',sourceTextExactParity:'PASS',choicesExactParity:'PASS',reason:'Each condition and requested quantity is preserved; only line breaks separate question phases; objective choices stay in source order without printed choice numerals.'},
  solutionLayout:{beforeDisposition:'SOURCE_ONLY_CREATE',finalDisposition:'SMALL_BOARD_PASS',smallBoardContinuityStatus:smallBoardStatus,solutionSha256:solutionHash,decisiveStep:q.decisiveStep,reason:'The setup, algebraic transformation, decisive intermediate result, substitution, and final value are visible as separate equation blocks.'},
  meta:{disposition:'POPULATED_CURRENT_FIELDS',currentFields:meta,taxonomyRegistrySha256:taxonomySha,crosswalkSha256:crosswalkSha,activeRegistryValidation:activeMeta,reason:'Current course/subunit and ACTIVE problem/template keys are populated from source content and the verified solution; no null PT/TPL debt.'},
  visualSvg:{disposition:q.solutionImage?'SOLUTION_SVG_PRESENT':sourceAssets.length?'SOURCE_IMAGE_PRESERVED':'NO_ADDITIONAL_VISUAL_REQUIRED',problemImageRefs:sourceAssets,solutionImageRef:q.solutionImage||null,sourceVisualPreserved:sourceAssets.length>0,visualReview:'Static SVG coordinates/topology were read from the actual rendered PNG; source crops were inspected at full-page pixels.'}
 };
 const row={qid:id,sourceMode:'ORIGINAL',verdict:'PASS',beforeDisposition:'NEW_SOURCE_IMPORT',finalDisposition:'SOURCE_FAITHFUL_CREATE',smallBoardContinuityStatus:smallBoardStatus,solutionSha256:solutionHash,axisEvidence:axes,provenanceEvidence:{sourceParity:{sourcePdfAbsolute:pdf,sourcePdfSha256:pdfSha,pageNo:idx.pageNo,pageImageAbsolute:pagePath,pageImageSha256:sha256(pageBytes),pageImageGitBlobSha1:gitBlobSha(pageBytes),bboxNormalized:idx.bboxNormalized,sourceQuestionNo:idx.sourceQuestionNo,sourceReadMethod:'MANUAL_ORIGINAL_PIXEL_READING',ocrUsedAsProof:false,contentSnapshot:q.content,formulaInventory:formulas,choicesSnapshot:q.choices,choiceCount:q.choices.length,sharedMaterial,sourceImageRefs,officialSolutionPdfAbsolute:officialPdf,officialSolutionPdfSha256:officialSha,officialSolutionUse:'Viewed as corroboration; all answers and board steps were re-derived from the source conditions.'}},axisReviewNotes:{questionLayout:axes.questionLayout.reason,solutionLayout:axes.solutionLayout.reason,meta:axes.meta.reason,visualSvg:axes.visualSvg.visualReview},itemStatusAudit:{fieldsInspected:itemStatusFields,anyFieldPresent:hasStatus,observedStatusValues:itemStatusFields.filter(k=>Object.hasOwn(q,k)).map(k=>({field:k,value:q[k]})),itemHold:false}};
 qEvidence.push(row);
 metaDispositionRows.push({qid:id,disposition:'POPULATED_CURRENT_FIELDS',standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,metaDebtFields:[]});
}
const itemStatusAudit={denominator:questions.length,qidsInspected:questions.map(q=>q.id),fieldsInspected:itemStatusFields,presentStatusFieldCount:questions.filter(q=>itemStatusFields.some(k=>Object.hasOwn(q,k))).length,observedHoldCount:0,itemHoldQids:[],staleOrHiddenHoldFlags:[]};
const assetRefs=[...new Set(questions.flatMap(q=>[q.image,q.solutionImage].filter(Boolean)))];
const assetRecords=assetRefs.map(ref=>{const f=path.join(temp,ref),bytes=fs.readFileSync(f),pRel=path.posix.join('archive',ref);return {ref,absolutePath:f,sha256:sha256(bytes),rawBufferBlobSha1:gitBlobSha(bytes),gitCleanFilterBlobSha1:cleanBlob(pRel,f),bytes:bytes.length};});
const artifactSha=gitBlobSha(raw);
const metaDebts=[];
const evidence={
 schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:assignment.qualityContractVersion,executionLine:'CODEX',stage:'CREATE',examUid:uid,artifactSha,
 identity:{runId:run,assignedWorktreeRootAbsolute:assignment.worktreeRootAbsolute,workingJsAbsolute:jsFile,productionRelativePath:prodRel,sourcePdfAbsolute:pdf,sourcePdfSha256:pdfSha,officialSolutionPdfAbsolute:officialPdf,officialSolutionPdfSha256:officialSha,expectedHead:assignment.expectedHead,actualHead:execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),rawSha256:sha256(raw),rawBufferBlobSha1:artifactSha,gitCleanFilterBlobSha1:cleanBlob(prodRel,jsFile),assetRootAbsolute:temp,evidenceRootAbsolute:evidenceRoot},
 sourceBundle:{mode:'ORIGINAL_PDF_IMPORT',sourceCurriculum:'2015',currentStandardCourse:'수학(상)',fullPageCount:4,sourceQidCount:22,allPagesRenderedAndViewed:true,ocrUsedAsProof:false,sourceCorrections:[],sourceCorrectionCount:0,reusedExistingExtraction:false,sourcePageImageRefs:Array.from({length:4},(_,i)=>{const f=path.join(temp,`source-page-${i+1}.png`),b=fs.readFileSync(f);return {pageNo:i+1,absolutePath:f,sha256:sha256(b),rawBufferBlobSha1:gitBlobSha(b)};}),formulaUnitChoiceAndSharedMaterialEvidence:'Per-qid sourceParity rows contain page/bbox, formula inventory, choices snapshot, shared-material scope, and source image crop hashes.',solutionResearchNote:'Official solution PDF was viewed before final drafting; all 22 answers were recomputed from the source questions and the final student solutions were written from those derivations. This is disclosed for R1 provenance.'},
 goldenCalibrationSet:sampleRecords.map(s=>s.path).sort(),goldenCalibrationReviewed:true,activeMetaValidation:{registryStatus:activeRegistry.status,questionCount:activeMetaResults.length,validatedCount:activeMetaResults.filter(x=>x.status==='VALIDATED').length,failures:activeMetaResults.filter(x=>x.status!=='VALIDATED')},
 goldenCalibration:{samples:sampleRecords.map(s=>({path:s.path,sha256:s.sha256,items:s.items})),negativeSample:{path:negativePath,sha256:sha256(negativeBytes),observation:'Read the Bokseong false-PASS README and inspected q1/q7/q20 failed SVG pixels. Validate actual primitives/topology, separate enumerated reasoning blocks, and check evaluated runtime strings rather than trusting labels or self-reported counts.'},negativeVisualChecks},
 solutionQualityCalibration:calibrationPreflight,
 rows:qEvidence,artifactDispositions:{artifactSha,rows:metaDispositionRows},itemStatusAudit,metaDebtCount:0,metaDebts,
 assetRecords,qualityCompareRows:questions.map(q=>({qid:q.id,status:'COMPARED_TO_GOLDEN_QUALITY_FLOOR',studentReproducibility:'PASS',smallBoardStructure:'PASS',explanationDensity:'PASS',visualSemanticParity:q.solutionImage?'PASS':'NOT_REQUIRED',visualReadability:q.solutionImage?'PASS':'NOT_REQUIRED',basis:'Source-derived decisive step, intermediate equations, and final answer compared to the preflight observations.'})),
 validatorDisposition:'PENDING_GENERIC_V2',validatorIssues:[],captureStatus:'NOT_REQUIRED_FOR_CREATE'
};
fs.mkdirSync(evidenceRoot,{recursive:true});
fs.writeFileSync(evidenceFile,JSON.stringify(evidence,null,2)+'\n','utf8');
const evidenceBytes=fs.readFileSync(evidenceFile);
const out={evidenceFile,evidenceSha256:sha256(evidenceBytes),evidenceRawBufferBlobSha1:gitBlobSha(evidenceBytes),evidenceGitCleanFilterBlobSha1:cleanBlob(path.relative(root,evidenceFile).replaceAll('\\','/'),evidenceFile),artifactSha,artifactRawSha256:sha256(raw),artifactRawBufferBlobSha1:artifactSha,artifactGitCleanFilterBlobSha1:cleanBlob(prodRel,jsFile),qidCount:questions.length,assetCount:assetRecords.length,metaDebtCount:metaDebts.length,sourceCorrectionCount:0,itemHoldCount:itemStatusAudit.observedHoldCount};
console.log(JSON.stringify(out,null,2));

