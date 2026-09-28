import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileRef, objectSha } from '../../../../../../../archive/tools/pipeline-core/canonical.mjs';
import { runInputSha } from '../../../../../../../archive/tools/pipeline-core/closure.mjs';
import { materializeAuthorityBinding, authorityBindingReady } from '../../../../../../../archive/tools/pipeline-core/authority-repair.mjs';
import { computeV2AxisInputShas } from '../../../../../../../archive/tools/pipeline-core/v2-audit.mjs';

const root=process.cwd();
const base='archive-work/textbooks/visang-common2/workbook/geometry';
const setKey='비상_공통수학2_도형의방정식_익힘책_고1';
const evidence=base+'/evidence/'+setKey;
const core=evidence+'/pipeline-core';
const runPath=core+'/run-q01repair/run.json';
const run=JSON.parse(fs.readFileSync(path.join(root,runPath),'utf8'));
const sourcePath=core+'/inputs/source_snapshot.js';
const candidatePath=core+'/inputs/review_candidate_adapter.js';
const refs={
  sourceInventory:evidence+'/source_inventory.json',
  answerCrosswalk:evidence+'/answer_solution_crosswalk.json',
  solutionLedger:evidence+'/solution_identity_and_quality_ledger.json',
  visualLedger:evidence+'/visual_benefit_ledger.json',
  assets:base+'/assets/images/'+setKey+'/ASSET_MANIFEST.json',
  v2Report:core+'/v2_exact_geometry_parity_report.json',
  identityResolver:core+'/inputs/identity_resolver.json',
  q01SourceVisualExpectation:core+'/q01_source_visual_expectation_repair.json',
  q01CoordinateRepairEvidence:core+'/q01_coordinate_context_repair.json',
  q01PriorU2Response:core+'/provider-review-main/prior-partial/u2-response.json',
  q01PriorCoreArtifact:base+'/assets/images/'+setKey+'/q01_geometry_core_final.svg',
  finalJs:base+'/js/비상_공통수학2_도형의방정식_익힘책_고1.js'
};
const ref=relative=>fileRef(root,relative);
const addInput=(relative,role='dependency')=>{
  const value=ref(relative);
  const old=run.inputs.find(item=>item.path===value.path);
  if(old){
    if(old.sha256!==value.sha256||old.bytes!==value.bytes)throw new Error('BOUND_INPUT_CHANGED:'+relative);
    return old;
  }
  const bound={...value,role};
  run.inputs.push(bound);
  return bound;
};
for(const relative of Object.values(refs))addInput(relative,relative===refs.finalJs?'dependency':'dependency');
const calibrationRelative=evidence+'/golden_sample_calibration_refs.json';
const calibration=JSON.parse(fs.readFileSync(path.join(root,calibrationRelative),'utf8'));
addInput(calibrationRelative,'dependency');
for(const sample of calibration.goldenSampleRefs||[]){
  addInput(sample.sourceRef.path,'dependency');
  for(const sampleImage of sample.solutionImageRefs||[])addInput(sampleImage.path,'dependency');
}
for(const sample of calibration.negativeSampleRefs||[])addInput(sample.sourceRef.path,'dependency');
addInput(calibration.negativeRegistryRef.path,'dependency');
const sourceInventory=JSON.parse(fs.readFileSync(path.join(root,refs.sourceInventory),'utf8'));
const solutionRows=JSON.parse(fs.readFileSync(path.join(root,refs.solutionLedger),'utf8')).items;
const visualItems=JSON.parse(fs.readFileSync(path.join(root,refs.visualLedger),'utf8')).items;
const v2=JSON.parse(fs.readFileSync(path.join(root,refs.v2Report),'utf8'));
const v2ByUid=new Map(v2.rows.map(row=>[row.id,row]));
const identity=JSON.parse(fs.readFileSync(path.join(root,refs.identityResolver),'utf8'));
const resolverByPipelineUid=new Map(identity.items.map(row=>[row.pipelineQuestionUidV2,row]));
const sourceRowByNo=new Map(sourceInventory.rows.map(row=>[Number(row.displayNo),row]));
const solutionRowById=new Map(solutionRows.map(row=>[row.questionUid,row]));
const visualById=new Map(visualItems.map(row=>[row.id,row]));

const sourceRef=run.inputs.find(input=>input.path===sourcePath&&input.role==='source');
const inventoryRef=ref(refs.sourceInventory);
run.sourceAuthority.sourceTruthRefs=[sourceRef,inventoryRef];
run.sourceAuthority.sourceTruthBundleSha=objectSha(run.sourceAuthority.sourceTruthRefs);
run.sourceAuthority.activeBaselineRef=sourceRef;
run.sourceAuthority.activeBaselineSha=sourceRef.sha256;
run.sourceAuthority.applicability={};
const applicabilitySpecs=[
  ['baselineDiscoveryEvidenceRef','NEW_BOOK_SECTION_INVENTORY_FROZEN'],
  ['approvedSourceRepairLedgerRef','NO_SOURCE_REPAIRS_REQUIRED'],
  ['approvedSourceExceptionLedgerRef','NO_SOURCE_EXCEPTIONS_OR_MANUAL_REVIEW']
];
for(const [key,reason] of applicabilitySpecs){
  const filePath=core+'/source-applicability/'+key+'.json';
  const proof={status:'PASS',applicability:'NOT_APPLICABLE',reason,sourceTruthBundleSha:run.sourceAuthority.sourceTruthBundleSha};
  const abs=path.join(root,filePath);
  fs.mkdirSync(path.dirname(abs),{recursive:true});
  fs.writeFileSync(abs,JSON.stringify(proof,null,2),'utf8');
  const evidenceRef=addInput(filePath,'dependency');
  run.sourceAuthority.applicability[key]={status:'NOT_APPLICABLE',reason,evidenceRef};
  run.sourceAuthority[key]=null;
}

for(const question of run.questions){
  const ordinal=question.sourceQuestionOrdinal;
  const sourceRow=sourceRowByNo.get(ordinal);
  const resolver=resolverByPipelineUid.get(question.questionUid);
  const solution=solutionRowById.get(resolver?.finalQuestionUid);
  const visual=visualById.get(resolver?.finalQuestionUid);
  if(!sourceRow||!resolver||!solution||!visual)throw new Error('ITEM_CROSSWALK_INCOMPLETE:'+question.questionUid);
  const candidate=JSON.parse(fs.readFileSync(path.join(root,candidatePath),'utf8').replace(/^window\.examTitle[\s\S]*?window\.questionBank\s*=\s*/,'').replace(/;\s*$/,''));
  const q=candidate.find(item=>item.id===question.qid);
  if(!q||q.sourceQid!==resolver.finalQuestionUid)throw new Error('REVIEW_ADAPTER_QID_MISMATCH:'+question.questionUid);
  question.sourceStatus='RESOLVED';
  question.evidence={
    finalArchiveQid:resolver.finalQuestionUid,
    sourceIdentityFingerprint:sourceRow.sourceIdentityFingerprint,
    sourceContentHash:sourceRow.contentHash,
    sourceChoicesHash:sourceRow.choicesHash,
    sourceImageRefHash:sourceRow.imageRefHash,
    solutionHash:solution.solutionHash,
    officialAnswerHash:solution.answerHash,
    sourceInventoryPath:refs.sourceInventory,
    answerCrosswalkPath:refs.answerCrosswalk,
    sourcePrintedPage:String(sourceRow.printedPage),
    sourcePhysicalPage:String(sourceRow.sourcePdfPage)
  };
  const visualRef=addInput(refs.visualLedger,'dependency');
  const expectedFactRelative=core+'/expected-facts/q'+String(ordinal).padStart(2,'0')+'_expected.json';
  const active=Boolean(q.solutionImage);
  const requirement=active?'VISUAL_REQUIRED':'VISUAL_EXEMPT';
  const action=active?'ADD':'NONE';
  const expectedFactRef=active?addInput(expectedFactRelative,'dependency'):null;
  const visualFact=active?JSON.parse(fs.readFileSync(path.join(root,expectedFactRelative),'utf8')):null;
  const v2Row=v2ByUid.get(resolver.finalQuestionUid);
  const finalWitnessRelative=core+'/final-witnesses/q'+String(ordinal).padStart(2,'0')+'_final_build_witness.json';
  const witnessRef=active?addInput(finalWitnessRelative,'dependency'):null;
  if(active&&(!v2Row||v2Row.geometryVerification!=='PASS'||v2Row.finalArtifactSha!==hashFile(path.join(root,base,q.solutionImage))||visualFact.questionUid!==resolver.finalQuestionUid))throw new Error('V2_ARTIFACT_CROSSWALK_FAIL:'+question.questionUid);
  question.visual={
    ...question.visual,
    origin:'NATIVE',
    requirement,
    action,
    actualSolutionVisualAttached:active,
    problemVisualMathDependency:Boolean(q.image),
    sharedVisualMathDependency:false,
    adjudicationId:question.questionUid+':visang-geometry-triage-v1',
    adjudicationStatus:'PENDING',
    exemptReason:active?null:visual.reason,
    authorityEvidenceRef:visualRef,
    expectedFactRef,
    expectedFactSha:active?expectedFactRef.sha256:null,
    finalArtifactSha:active?v2Row.finalArtifactSha:null
  };
  if(active){
    question.generationEvidence=witnessRef;
    question.solutionAssetPaths=[v2Row.finalArtifactPath];
    question.visual.expectedFactQuestionUid=visualFact.questionUid;
  }else{
    question.generationEvidence=null;
    question.solutionAssetPaths=[];
  }
  const sourceAssets=sourceRow.imageRefHash!=='sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  question.problemAssetPaths=q.image?[base+'/'+q.image.replace(/^archive\//,'')]:[];
  if(Boolean(sourceAssets)!==Boolean(q.image))throw new Error('PROBLEM_ASSET_SOURCE_PARITY:'+question.questionUid);
}

for(const relative of [refs.sourceInventory,refs.answerCrosswalk,refs.solutionLedger,refs.visualLedger,refs.assets,refs.v2Report,refs.identityResolver])addInput(relative,'dependency');
run.sourceAuthority.sourceTruthRefs=[sourceRef,inventoryRef];
run.sourceAuthority.sourceTruthBundleSha=objectSha(run.sourceAuthority.sourceTruthRefs);
const visualLedgerRef=run.inputs.find(input=>input.path===refs.visualLedger);
const authority=materializeAuthorityBinding(run,{authorityEvidenceRef:visualLedgerRef});
if(!['REPAIRED','NO_CHANGE'].includes(authority.status))throw new Error('AUTHORITY_BINDING_FAILED:'+authority.status);
const next=authority.run;
const ready=authorityBindingReady(next);
if(ready.status!=='PASS')throw new Error('AUTHORITY_BINDING_NOT_READY:'+JSON.stringify(ready.errors));
const axisShas=computeV2AxisInputShas(root,next);
for(const q of next.questions)q.axisInputShas=axisShas[q.questionUid];
next.inputSha=runInputSha(next);
if(next.registry?.length){
  const canonical=next.registry.find(row=>row.recordId===next.canonicalRecordId);
  if(canonical)canonical.inputSha=next.inputSha;
}
fs.writeFileSync(path.join(root,runPath),JSON.stringify(next,null,2),'utf8');
const report={status:'READY_FOR_LOCAL_MACHINE_AND_RENDER_CAPTURE',runPath,runId:next.runId,workBatchId:next.workBatchId,questionCount:next.questions.length,visualAuthority:ready.status,unresolvedAuthorityCount:ready.errors.length,inputSha:next.inputSha,changedQuestionUids:authority.changedQuestionUids,visualDispositionCounts:{REQUIRED:next.questions.filter(q=>q.visual.requirement==='VISUAL_REQUIRED').length,EXEMPT:next.questions.filter(q=>q.visual.requirement==='VISUAL_EXEMPT').length}};
fs.writeFileSync(path.join(root,core,'authority_binding_report_q01repair.json'),JSON.stringify(report,null,2),'utf8');
console.log(JSON.stringify(report,null,2));

function hashFile(file){return 'sha256:'+crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}
