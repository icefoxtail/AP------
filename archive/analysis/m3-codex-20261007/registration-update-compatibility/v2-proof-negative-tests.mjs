import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {spawnSync,execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const root=fs.realpathSync(execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim());
const evidenceRoot=path.join(root,'archive/analysis/m3-codex-20261007/registration-update-compatibility');
const testRoot=path.join(evidenceRoot,'v2-negative-fixtures');
const sourceRel='archive/exams/original/middle/m3/2mid/25_왕운중_2학기_중간_중3_수학.js';
const examUid='25_왕운중_2학기_중간_중3_수학',qCount=24;
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const sha1=bytes=>crypto.createHash('sha1').update(bytes).digest('hex');
const blobSha1=bytes=>sha1(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),bytes]));
const readJson=rel=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8').replace(/^\uFEFF/,''));
const writeJson=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');};
const hashAt=rel=>sha(fs.readFileSync(path.join(root,rel)));
const registryPaths=['archive/db.js','archive/data/question_identity_map.json','archive/data/question_metadata.json','archive/question-identity.js','archive/question-index.js','archive/question-index-report.md','archive/question-index-audit.md','archive/data/archive2-catalog.json','archive/data/archive2-canonical-input-manifest.json'];
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const sourceBytes=fs.readFileSync(path.join(root,sourceRel)),sourceRawSha256=sha(sourceBytes),sourceBlobSha1=blobSha1(sourceBytes);
const baselineRegistryBindings=registryPaths.map(relativePath=>({relativePath,sha256:hashAt(relativePath)}));
const before={head,sourceRawSha256,sourceBlobSha1,registry:baselineRegistryBindings};
const currentIndexBytes=fs.readFileSync(path.join(root,'archive/question-index.js'));
new vm.Script(currentIndexBytes.toString('utf8'),{filename:'archive/question-index.js'});
const currentIndexWindow={window:{}};vm.runInNewContext(currentIndexBytes.toString('utf8'),currentIndexWindow,{timeout:3000});
const indexMarker='window.questionIndex=',indexText=currentIndexBytes.toString('utf8'),indexMarkerStart=indexText.indexOf(indexMarker),indexValueStart=indexMarkerStart+indexMarker.length,indexArrayEnd=findJsonContainerEnd(indexText,indexValueStart),firstSemicolonOffset=indexText.indexOf(';',indexValueStart);
const semicolonRows=currentIndexWindow.window.questionIndex.filter(row=>['contentText','choicesText'].some(key=>typeof row[key]==='string'&&row[key].includes(';')));
assert(indexMarkerStart>=0&&firstSemicolonOffset>=0&&firstSemicolonOffset<indexArrayEnd&&semicolonRows.length>0,'current index does not retain the semicolon-in-string regression case');
const syntheticQuestion=[{contentText:'$x; says "quoted"'}],syntheticScript=indexMarker+JSON.stringify(syntheticQuestion)+';';
const syntheticValueStart=indexMarker.length,syntheticArrayEnd=findJsonContainerEnd(syntheticScript,syntheticValueStart);
assert(syntheticScript.indexOf(';',syntheticValueStart)<syntheticArrayEnd&&JSON.parse(syntheticScript.slice(syntheticValueStart,syntheticArrayEnd))[0].contentText==='$x; says "quoted"','balanced scanner mishandles semicolon plus escaped quotes in JSON string');
const r1Path='archive/analysis/m3-codex-20261007/25_왕운중_2학기_중간_중3_수학/R1.review.json';
const r1ReportPath='archive/analysis/m3-codex-20261007/25_왕운중_2학기_중간_중3_수학/R1.validator-report.json';
const r2Path='archive/analysis/m3-codex-20261007/25_왕운중_2학기_중간_중3_수학/R2-clean-attempt2.evidence.json';
const r2ReportPath='archive/analysis/m3-codex-20261007/25_왕운중_2학기_중간_중3_수학/R2-clean-attempt2.validator-raw.json';
const r1=readJson(r1Path),r1Report=readJson(r1ReportPath),r2=readJson(r2Path),r2Report=readJson(r2ReportPath);
assert(hashAt(r1Path)==='31aaabe20497e8ca6192501527a9d2e8a209f9f841d99e4e8d1a4dfbd6ac9786','active R1 evidence digest differs from assigned current report');
assert(hashAt(r1ReportPath)==='9083506c0d83a3bc7bd59bc8c3c3df7a7f107d5114b164a1b4b4d2f2055f992d','active R1 validator report digest differs from assigned current report');
assert(hashAt(r2Path)==='30a6e55aa373ca86ab7d380611b011a3d66f555f146b7d5d2f63fd76da9815ef','active R2 evidence digest differs from assigned current report');
assert(hashAt(r2ReportPath)==='57421c77c4b25176d05fa4846c837f1a57ccea7a5b6c78f24ed54f1b37fd9cfc','active R2 validator report digest differs from assigned current report');
assert(r1.status==='R1_QUALITY_SEALED'&&r1.executionLine==='CODEX'&&r1.qualityContractVersion==='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006','active R1 source contract mismatch');
assert(r2.status==='R2_VERIFIED'&&r2.executionLine==='CODEX'&&r2.qualityContractVersion==='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006','active R2 source contract mismatch');

const v1=await import(pathToFileURL(path.join(root,'archive/tools/archive-stage-validator-r1-v2.mjs')).href);
const v2=await import(pathToFileURL(path.join(root,'archive/tools/archive-stage-validator-r2-v2.mjs')).href);
const artifact=await import(pathToFileURL(path.join(root,'archive/tools/archive-stage-validator-artifact-v2.mjs')).href);
const r1Candidate=fs.readFileSync(r1.workingJsAbsolute,'utf8'),bankContext={window:{},console:{log(){},warn(){},error(){}}};
vm.runInNewContext(r1Candidate,bankContext,{filename:r1.workingJsAbsolute,timeout:3000});
const bank=bankContext.window.questions||bankContext.window.questionBank,expectedQids=Array.from({length:qCount},(_,i)=>i+1);
assert(Array.isArray(bank)&&bank.length===qCount,'current R1 candidate source bank unavailable');
const r1Fresh=v1.validateR1Evidence({examUid,artifactSha:r1.artifactSha,actualArtifactSha:r1.artifactSha,evidenceRef:path.join(root,r1Path),evidence:r1,expectedQids});
const r2Fresh=v2.validateR2Evidence({examUid,artifactSha:r2.artifactSha,actualArtifactSha:r2.artifactSha,evidenceRef:path.join(root,r2Path),evidence:r2,expectedQids});
const r1Artifact=artifact.validateArtifactContract({stage:'R1',evidence:r1,questions:bank,repoRoot:root});
const r2Artifact=artifact.validateArtifactContract({stage:'R2',evidence:r2,questions:bank,repoRoot:root});
assert(r1Fresh.ok&&r1Fresh.disposition==='PASS'&&r1Artifact.disposition==='PASS','official generic v2 R1 revalidation did not pass');
assert(r2Fresh.ok&&r2Fresh.disposition==='PASS'&&r2Artifact.disposition==='PASS','official generic v2 R2 revalidation did not pass');

const reference=(rel)=>({path:rel,sha256:hashAt(rel)});
const staticExample='archive/analysis/m3-codex-20261007/25_왕운중_2학기_중간_중3_수학';
const staticReceiptPath=`${staticExample}/ROOT.static.receipt.json`;
const staticIntakePath=`${staticExample}/ROOT.static.intake.json`;
const staticClosurePath=`${staticExample}/R3.static-closure.json`;
const proofBase={
  schemaVersion:'EXISTING_TARGET_REGISTRATION_FINAL_QUALITY_BINDING_V2',
  examUid,executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  head,baselineRegistryBindings,
  finalSource:{productionRelativePath:sourceRel,artifactRawSha256:sourceRawSha256,artifactSha:sourceBlobSha1},
  evidence:{
    R1:{review:reference(r1Path),validatorReport:reference(r1ReportPath)},
    R2:{stageEvidence:reference(r2Path),validatorReport:reference(r2ReportPath)},
    rootStatic:{receipt:reference(staticReceiptPath),intake:reference(staticIntakePath),r3StaticClosure:reference(staticClosurePath)},
  },
};
const fixturesDir=path.join(testRoot,'fixtures');fs.mkdirSync(fixturesDir,{recursive:true});
const assignmentPath=path.join(testRoot,'test-assignment.json'),prototypePath=path.join(testRoot,'test-prototype.json');
writeJson(assignmentPath,{
  schemaVersion:'EXISTING_TARGET_REGISTRATION_UPDATE_ASSIGNMENT_V1',runId:'m3-codex-20261007',examUid,
  expectedHead:head,productionRelativePath:sourceRel,expectedQuestionCount:qCount,currentAutomaticCount:0,
  provisionalCurrentSource:{rawSha256:sourceRawSha256,rawBlobSha1:sourceBlobSha1},
  requiredFinalSourceBinding:{artifactRawSha256:null,validatorRawBufferBlobSha1:null,gitCleanFilterBlobSha1:null},
  baselineRegistryBindings,assetBaseline:[],targetIdentityBaseline:{runtimeFileIndex:371,records:[],runtimeTuples:[]},
});
writeJson(prototypePath,{status:'PROVISIONAL_CURRENT_SOURCE_PENDING_REVIEW_APPLY_DISABLED',head,examUid,source:{rawSha256:sourceRawSha256,rawBlobSha1:sourceBlobSha1,provisionalNotFinalR3:true},candidateRootAbsolute:path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/v2-negative-fixtures/not-used')});

const cases=[];
const runCase=(name,proof,expectedReason)=>{
  const proofPath=path.join(fixturesDir,`${name}.quality-binding.json`);writeJson(proofPath,proof);
  const outputDir=path.join(root,`.tmp/archive/m3-codex-20261007/registration-update-tools/v2-negative-fixtures/${name}-output`);
  const cmd=[path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/merge-existing-target-registration.mjs'),'--root',root,'--assignment',assignmentPath,'--prototype',prototypePath,'--output-dir',outputDir,'--quality-proof',proofPath,'--apply'];
  const result=spawnSync(process.execPath,cmd,{cwd:root,encoding:'utf8',windowsHide:true});
  const text=(result.stderr||'')+(result.stdout||'');
  fs.writeFileSync(path.join(fixturesDir,`${name}.raw.txt`),text);
  assert(result.status===2,`${name}: expected fail-closed exit 2, got ${result.status}: ${text.slice(0,500)}`);
  assert(text.includes(expectedReason),`${name}: expected ${expectedReason}, got ${text.slice(0,800)}`);
  assert(!fs.existsSync(outputDir),`${name}: blocked gate created candidate output`);
  cases.push({name,status:'PASS_NEGATIVE_GUARD',exitCode:result.status,expectedReason,rawPath:path.join(fixturesDir,`${name}.raw.txt`)});
};

const missingReport=structuredClone(proofBase);missingReport.evidence.R1.validatorReport=null;
runCase('missing-r1-validator-report',missingReport,'V2_EVIDENCE_REFERENCE_REQUIRED:R1.validatorReport');
const missingR2=structuredClone(proofBase);missingR2.evidence.R2.validatorReport=null;
runCase('missing-r2-validator-report',missingR2,'V2_EVIDENCE_REFERENCE_REQUIRED:R2.validatorReport');
const wrongHash=structuredClone(proofBase);wrongHash.evidence.R1.review.sha256='0'.repeat(64);
runCase('wrong-evidence-hash',wrongHash,'V2_EVIDENCE_SHA_MISMATCH');
const inactiveEvidence=structuredClone(r1);inactiveEvidence.executionLine='CANARY';
const inactivePath=path.join(fixturesDir,'r1-inactive-contract.fixture.json');writeJson(inactivePath,inactiveEvidence);
const inactive=structuredClone(proofBase);inactive.evidence.R1.review={path:inactivePath,sha256:sha(fs.readFileSync(inactivePath))};
runCase('inactive-r1-contract',inactive,'V2_R1_ACTIVE_EVIDENCE_CONTRACT_REQUIRED');
const partialEvidence=structuredClone(r1);partialEvidence.coverage.observedQids=partialEvidence.coverage.observedQids.slice(0,-1);
const partialPath=path.join(fixturesDir,'r1-partial-qid.fixture.json');writeJson(partialPath,partialEvidence);
const partial=structuredClone(proofBase);partial.evidence.R1.review={path:partialPath,sha256:sha(fs.readFileSync(partialPath))};
runCase('partial-r1-qid-coverage',partial,'V2_R1_FULL_QID_COVERAGE_REQUIRED');
const heldEvidence=structuredClone(r1);heldEvidence.coverage.itemHoldCount=1;heldEvidence.coverage.itemHoldQids=[24];
const heldPath=path.join(fixturesDir,'r1-hold.fixture.json');writeJson(heldPath,heldEvidence);
const held=structuredClone(proofBase);held.evidence.R1.review={path:heldPath,sha256:sha(fs.readFileSync(heldPath))};
runCase('r1-item-hold',held,'V2_R1_HOLD_OR_NONPASS_ROW');
const heldClosure=readJson(staticClosurePath);heldClosure.itemHoldCount=1;heldClosure.itemHoldQids=[24];
const heldClosurePath=path.join(fixturesDir,'r3-static-hold.fixture.json');writeJson(heldClosurePath,heldClosure);
const closureHold=structuredClone(proofBase);closureHold.evidence.rootStatic.r3StaticClosure={path:heldClosurePath,sha256:sha(fs.readFileSync(heldClosurePath))};
runCase('r3-static-item-hold',closureHold,'V2_R3_STATIC_CLOSURE_HOLD_OR_NONCOMPLETE');
const wrongArtifact=structuredClone(proofBase);wrongArtifact.finalSource.artifactSha='0'.repeat(40);
runCase('wrong-final-artifact-blob',wrongArtifact,'V2_FINAL_SOURCE_RAW_OR_BUFFER_BLOB_SHA_MISMATCH');

const auditPath=path.join(evidenceRoot,'canonical-v2-current-source-audit.json');
const auditRun=spawnSync(process.execPath,[path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/audit-existing-registration.mjs'),root,sourceRel,String(qCount),evidenceRoot],{cwd:root,encoding:'utf8',windowsHide:true});
fs.writeFileSync(path.join(evidenceRoot,'canonical-v2-current-source-audit.raw.txt'),(auditRun.stderr||'')+(auditRun.stdout||''));
assert(auditRun.status===0,'canonical V2 current-source technical audit failed: '+auditRun.stderr);
const audit=readJson(path.relative(root,path.join(evidenceRoot,'registration-update-audit.json')).replace(/\\/g,'/'));
const assignment={schemaVersion:'JS_ARCHIVE_EXISTING_TARGET_REGISTRATION_UPDATE_ASSIGNMENT_V1',status:'ISOLATED_CANONICAL_V2_GATE_TEST',runId:'m3-codex-20261007',examUid,stage:'EXISTING_TARGET_REGISTRATION_UPDATE',expectedHead:head,productionRelativePath:sourceRel,expectedQuestionCount:qCount,targetQids:audit.baselineIdentityRecords.map(r=>r.sourceOrdinal),currentAutomaticCount:audit.registrationParity.targetAutomaticCount,provisionalCurrentSource:{rawSha256:audit.source.rawSha256,rawBlobSha1:audit.source.rawBlobSha1,notFinalR3Binding:false},requiredFinalSourceBinding:{artifactRawSha256:audit.source.rawSha256,validatorRawBufferBlobSha1:null,gitCleanFilterBlobSha1:null},requiredQualityBindings:{R1:{status:'V2_EVIDENCE_BOUND',evidencePath:r1Path},R2:{status:'V2_EVIDENCE_BOUND',evidencePath:r2Path},R3:{status:'ROOT_STATIC_INTAKE_BOUND',evidencePath:staticReceiptPath}},targetIdentityBaseline:{runtimeFileIndex:audit.runtimeFileIndex,uidRuntimeDigest:audit.currentUidRuntimeDigest,records:audit.baselineIdentityRecords,runtimeTuples:audit.baselineRuntimeTuples},assetBaseline:audit.assets,baselineRegistryBindings:registryPaths.map(relativePath=>({relativePath,sha256:audit.sharedRegistrySha256[relativePath]})),paths:{worktreeRootAbsolute:root,registrationUpdateRootAbsolute:evidenceRoot,evidenceRootAbsolute:evidenceRoot,candidateRootAbsolute:path.join(testRoot,'candidate'),applySandboxRootAbsolute:path.join(testRoot,'baseline')}};
const isolatedAssignmentPath=path.join(evidenceRoot,'canonical-v2-isolated-assignment.json');writeJson(isolatedAssignmentPath,assignment);
const finalCandidateRoot=path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/v2-canonical-final-candidate');
const finalPrototypePath=path.join(evidenceRoot,'canonical-v2-current-prototype.json');
const prototypeRun=spawnSync(process.execPath,[path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/prepare-existing-target-update-prototype.mjs'),'--root',root,'--assignment',isolatedAssignmentPath,'--candidate-root',finalCandidateRoot,'--output',finalPrototypePath],{cwd:root,encoding:'utf8',windowsHide:true});
fs.writeFileSync(path.join(evidenceRoot,'canonical-v2-current-prototype.raw.txt'),(prototypeRun.stderr||'')+(prototypeRun.stdout||''));
assert(prototypeRun.status===0,'isolated current-source target prototype failed: '+prototypeRun.stderr);
const finalProof={...structuredClone(proofBase),head,baselineRegistryBindings,finalSource:{productionRelativePath:sourceRel,artifactRawSha256:r1.artifactRawSha256,artifactSha:r1.artifactSha}};
const finalProofPath=path.join(evidenceRoot,'canonical-v2-current-proof-reference-manifest.json');writeJson(finalProofPath,finalProof);
const finalMergeOutput=path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/v2-canonical-final-merge');
const finalMergeRun=spawnSync(process.execPath,[path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/merge-existing-target-registration.mjs'),'--root',root,'--assignment',isolatedAssignmentPath,'--prototype',finalPrototypePath,'--output-dir',finalMergeOutput,'--quality-proof',finalProofPath,'--validate-final-quality'],{cwd:root,encoding:'utf8',windowsHide:true});
fs.writeFileSync(path.join(evidenceRoot,'canonical-v2-full-gate.raw.txt'),(finalMergeRun.stderr||'')+(finalMergeRun.stdout||''));
assert(finalMergeRun.status===0,'canonical V2 proof gate / merge validation failed: '+(finalMergeRun.stderr||finalMergeRun.stdout));
const finalSummary=JSON.parse(finalMergeRun.stdout),mergeReceipt=readJson(path.relative(root,finalSummary.receiptPath).replace(/\\/g,'/'));
assert(finalSummary.status==='FINAL_QUALITY_AND_MERGE_VALIDATED_APPLY_NOT_REQUESTED','canonical V2 validation-only disposition missing');
assert(mergeReceipt.qualityBindings.allowed===true&&mergeReceipt.qualityBindings.canonicalStaticIntakeRevalidated===true,'canonical V2 raw reports + ROOT static intake did not all bind');
assert(mergeReceipt.apply.sharedFilesWritten===false&&mergeReceipt.apply.allowed===false,'validation-only path unexpectedly permitted shared apply');
const preservedMergeReceipt=path.join(evidenceRoot,'canonical-v2-full-merge.receipt.json');fs.copyFileSync(finalSummary.receiptPath,preservedMergeReceipt);
const mergerSourcePath=path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/merge-existing-target-registration.mjs');
const preservedMergerPath=path.join(evidenceRoot,'merge-existing-target-registration.implemented.mjs');fs.copyFileSync(mergerSourcePath,preservedMergerPath);
const preservedMergerSha256=sha(fs.readFileSync(preservedMergerPath)),preservedMergeReceiptSha256=sha(fs.readFileSync(preservedMergeReceipt));
cases.push({name:'canonical-v2-current-r1-r2-r3-root-intake-positive-validation-only',status:'PASS_NO_SHARED_WRITE',sourceRawSha256:sourceRawSha256,sourceBlobSha1:sourceBlobSha1,mergeReceiptPath:finalSummary.receiptPath,mergeReceiptSha256:finalSummary.receiptSha256});

const pungUid='25_풍덕중_2학기_중간_중3_수학',pungSourceRel='archive/exams/original/middle/m3/2mid/25_풍덕중_2학기_중간_중3_수학.js',pungCount=25;
const pungEvidenceRoot=path.join(evidenceRoot,'pung-canonical-v2-no-status-shape');fs.mkdirSync(pungEvidenceRoot,{recursive:true});
const pungRootEvidence='archive/analysis/m3-codex-20261007/25_풍덕중_2학기_중간_중3_수학';
const pungR1Rel=`${pungRootEvidence}/R1.evidence.json`,pungR1ReportRel=`${pungRootEvidence}/R1.validator-v2.raw.json`;
const pungR2Rel=`${pungRootEvidence}/R2.evidence.json`,pungR2ReportRel=`${pungRootEvidence}/R2.generic-validator-report.json`;
const pungReceiptRel=`${pungRootEvidence}/ROOT.static.receipt.json`,pungIntakeRel=`${pungRootEvidence}/ROOT.static.intake.json`,pungClosureRel=`${pungRootEvidence}/R3.static-closure.json`;
const pungR1=readJson(pungR1Rel),pungR2=readJson(pungR2Rel);
assert(pungR1.status===undefined&&pungR2.status===undefined,'Pung canonical optional-status regression fixture changed');
const pungAuditRun=spawnSync(process.execPath,[path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/audit-existing-registration.mjs'),root,pungSourceRel,String(pungCount),pungEvidenceRoot],{cwd:root,encoding:'utf8',windowsHide:true});
fs.writeFileSync(path.join(pungEvidenceRoot,'current-source-audit.raw.txt'),(pungAuditRun.stderr||'')+(pungAuditRun.stdout||''));
assert(pungAuditRun.status===0,'Pung current-source technical audit failed: '+pungAuditRun.stderr);
const pungAudit=JSON.parse(fs.readFileSync(path.join(pungEvidenceRoot,'registration-update-audit.json'),'utf8'));
const pungSourceBytes=fs.readFileSync(path.join(root,pungSourceRel)),pungRawSha256=sha(pungSourceBytes),pungBlobSha1=blobSha1(pungSourceBytes);
const pungBaselineBindings=registryPaths.map(relativePath=>({relativePath,sha256:pungAudit.sharedRegistrySha256[relativePath]}));
const pungAssignment={schemaVersion:'EXISTING_TARGET_REGISTRATION_UPDATE_ASSIGNMENT_V1',status:'ISOLATED_CANONICAL_V2_NO_TOP_STATUS_SHAPE_TEST',runId:'m3-codex-20261007',examUid:pungUid,stage:'EXISTING_TARGET_REGISTRATION_UPDATE',expectedHead:head,productionRelativePath:pungSourceRel,expectedQuestionCount:pungCount,targetQids:pungAudit.baselineIdentityRecords.map(r=>r.sourceOrdinal),currentAutomaticCount:pungAudit.registrationParity.targetAutomaticCount,provisionalCurrentSource:{rawSha256:pungRawSha256,rawBlobSha1:pungBlobSha1,notFinalR3Binding:false},requiredFinalSourceBinding:{artifactRawSha256:pungRawSha256,validatorRawBufferBlobSha1:null,gitCleanFilterBlobSha1:null},requiredQualityBindings:{R1:{status:'V2_EVIDENCE_BOUND',evidencePath:pungR1Rel},R2:{status:'V2_EVIDENCE_BOUND',evidencePath:pungR2Rel},R3:{status:'ROOT_STATIC_INTAKE_BOUND',evidencePath:pungReceiptRel}},targetIdentityBaseline:{runtimeFileIndex:pungAudit.runtimeFileIndex,uidRuntimeDigest:pungAudit.currentUidRuntimeDigest,records:pungAudit.baselineIdentityRecords,runtimeTuples:pungAudit.baselineRuntimeTuples},assetBaseline:pungAudit.assets,baselineRegistryBindings:pungBaselineBindings,paths:{worktreeRootAbsolute:root,registrationUpdateRootAbsolute:pungEvidenceRoot,evidenceRootAbsolute:pungEvidenceRoot,candidateRootAbsolute:path.join(pungEvidenceRoot,'candidate'),applySandboxRootAbsolute:path.join(pungEvidenceRoot,'baseline')}};
const pungAssignmentPath=path.join(pungEvidenceRoot,'isolated-assignment.json');writeJson(pungAssignmentPath,pungAssignment);
const pungCandidateRoot=path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/v2-canonical-pung-final-candidate');
const pungPrototypePath=path.join(pungEvidenceRoot,'current-prototype.json');
const pungPrototypeRun=spawnSync(process.execPath,[path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/prepare-existing-target-update-prototype.mjs'),'--root',root,'--assignment',pungAssignmentPath,'--candidate-root',pungCandidateRoot,'--output',pungPrototypePath],{cwd:root,encoding:'utf8',windowsHide:true});
fs.writeFileSync(path.join(pungEvidenceRoot,'current-prototype.raw.txt'),(pungPrototypeRun.stderr||'')+(pungPrototypeRun.stdout||''));
assert(pungPrototypeRun.status===0,'Pung canonical no-status target prototype failed: '+pungPrototypeRun.stderr);
const pungProof={schemaVersion:'EXISTING_TARGET_REGISTRATION_FINAL_QUALITY_BINDING_V2',examUid:pungUid,executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',head,baselineRegistryBindings:pungBaselineBindings,finalSource:{productionRelativePath:pungSourceRel,artifactRawSha256:pungR1.artifactRawSha256||pungR2.sourceSha256,artifactSha:pungR1.artifactSha},evidence:{R1:{review:reference(pungR1Rel),validatorReport:reference(pungR1ReportRel)},R2:{stageEvidence:reference(pungR2Rel),validatorReport:reference(pungR2ReportRel)},rootStatic:{receipt:reference(pungReceiptRel),intake:reference(pungIntakeRel),r3StaticClosure:reference(pungClosureRel)}}};
const pungProofPath=path.join(pungEvidenceRoot,'final-quality-proof-reference-manifest.json');writeJson(pungProofPath,pungProof);
const pungMergeOutput=path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/v2-canonical-pung-final-merge');
const pungMergeRun=spawnSync(process.execPath,[path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/merge-existing-target-registration.mjs'),'--root',root,'--assignment',pungAssignmentPath,'--prototype',pungPrototypePath,'--output-dir',pungMergeOutput,'--quality-proof',pungProofPath,'--validate-final-quality'],{cwd:root,encoding:'utf8',windowsHide:true});
fs.writeFileSync(path.join(pungEvidenceRoot,'canonical-v2-full-gate.raw.txt'),(pungMergeRun.stderr||'')+(pungMergeRun.stdout||''));
assert(pungMergeRun.status===0,'Pung canonical R1/R2 with no optional status field failed V2 validation-only merge: '+(pungMergeRun.stderr||pungMergeRun.stdout));
const pungMergeSummary=JSON.parse(pungMergeRun.stdout),pungMergeReceipt=JSON.parse(fs.readFileSync(pungMergeSummary.receiptPath,'utf8'));
assert(pungMergeSummary.status==='FINAL_QUALITY_AND_MERGE_VALIDATED_APPLY_NOT_REQUESTED'&&pungMergeReceipt.qualityBindings.allowed===true&&pungMergeReceipt.apply.sharedFilesWritten===false,'Pung no-status canonical proof disposition or no-write guard invalid');
const preservedPungMergeReceipt=path.join(pungEvidenceRoot,'canonical-v2-full-merge.receipt.json');fs.copyFileSync(pungMergeSummary.receiptPath,preservedPungMergeReceipt);
const pungCompatibilityCase={name:'canonical-v2-pung-r1-no-top-status-current-r2-r3-intake-validation-only',status:'PASS_NO_SHARED_WRITE',r1StatusFieldAbsent:true,r2StatusFieldAbsent:true,sourceRawSha256:pungRawSha256,sourceBlobSha1:pungBlobSha1,receiptPath:preservedPungMergeReceipt,receiptSha256:sha(fs.readFileSync(preservedPungMergeReceipt))};
cases.push(pungCompatibilityCase);
const pungFixturesDir=path.join(pungEvidenceRoot,'negative-fixtures');fs.mkdirSync(pungFixturesDir,{recursive:true});
const runPungCase=(name,proof,expectedReason)=>{
  const proofPath=path.join(pungFixturesDir,`${name}.quality-binding.json`);writeJson(proofPath,proof);
  const outputDir=path.join(root,`.tmp/archive/m3-codex-20261007/registration-update-tools/v2-negative-fixtures/pung-${name}-output`);
  const command=[path.join(root,'.tmp/archive/m3-codex-20261007/registration-update-tools/merge-existing-target-registration.mjs'),'--root',root,'--assignment',pungAssignmentPath,'--prototype',pungPrototypePath,'--output-dir',outputDir,'--quality-proof',proofPath,'--apply'];
  const result=spawnSync(process.execPath,command,{cwd:root,encoding:'utf8',windowsHide:true}),raw=(result.stderr||'')+(result.stdout||'');
  fs.writeFileSync(path.join(pungFixturesDir,`${name}.raw.txt`),raw);
  assert(result.status===2,`Pung ${name}: expected fail-closed exit 2, got ${result.status}: ${raw.slice(0,500)}`);
  assert(raw.includes(expectedReason),`Pung ${name}: expected ${expectedReason}, got ${raw.slice(0,800)}`);
  assert(!fs.existsSync(outputDir),`Pung ${name}: blocked proof created output`);
  cases.push({name:`pung-canonical-r1-no-status-${name}`,status:'PASS_NEGATIVE_GUARD',exitCode:result.status,expectedReason});
};
const pungMissingReport=structuredClone(pungProof);pungMissingReport.evidence.R1.validatorReport=null;
runPungCase('missing-r1-validator-report',pungMissingReport,'V2_EVIDENCE_REFERENCE_REQUIRED:R1.validatorReport');
const pungInactive=structuredClone(pungR1);pungInactive.executionLine='CANARY';
const pungInactivePath=path.join(pungFixturesDir,'r1-inactive-contract.fixture.json');writeJson(pungInactivePath,pungInactive);
const pungInactiveProof=structuredClone(pungProof);pungInactiveProof.evidence.R1.review={path:pungInactivePath,sha256:sha(fs.readFileSync(pungInactivePath))};
runPungCase('inactive-r1-contract',pungInactiveProof,'V2_R1_ACTIVE_EVIDENCE_CONTRACT_REQUIRED');
const pungPartial=structuredClone(pungR1);pungPartial.rows=pungPartial.rows.slice(0,-1);
const pungPartialPath=path.join(pungFixturesDir,'r1-partial-qid.fixture.json');writeJson(pungPartialPath,pungPartial);
const pungPartialProof=structuredClone(pungProof);pungPartialProof.evidence.R1.review={path:pungPartialPath,sha256:sha(fs.readFileSync(pungPartialPath))};
runPungCase('partial-r1-qid-coverage',pungPartialProof,'V2_R1_FULL_QID_COVERAGE_REQUIRED');
const pungHold=structuredClone(pungR1);pungHold.itemHoldCount=1;pungHold.itemHoldQids=[25];
const pungHoldPath=path.join(pungFixturesDir,'r1-item-hold.fixture.json');writeJson(pungHoldPath,pungHold);
const pungHoldProof=structuredClone(pungProof);pungHoldProof.evidence.R1.review={path:pungHoldPath,sha256:sha(fs.readFileSync(pungHoldPath))};
runPungCase('r1-item-hold',pungHoldProof,'V2_R1_HOLD_OR_NONPASS_ROW');

const afterHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const afterSourceSha=sha(fs.readFileSync(path.join(root,sourceRel)));
assert(afterHead===head&&afterSourceSha===sourceRawSha256,'negative tests changed HEAD or production source');
for(const binding of baselineRegistryBindings)assert(hashAt(binding.relativePath)===binding.sha256,`negative tests changed shared registry bytes: ${binding.relativePath}`);
const summary={schemaVersion:'EXISTING_TARGET_REGISTRATION_V2_PROOF_COMPATIBILITY_TESTS_V1',status:'PASS',examUid,head,spliceRegression:{firstSemicolonInsideJsonString:true,firstSemicolonOffset:firstSemicolonOffset-indexValueStart,jsonArrayBoundary:indexArrayEnd-indexValueStart,baselineRowsContainingSemicolon:semicolonRows.length,escapedQuoteAndDollarSyntheticCase:'PASS',sample:semicolonRows.slice(0,4).map(row=>({sourceFile:row.sourceFile,sourceOrdinal:row.sourceOrdinal,qKey:row.qKey}))},activeR1:{reviewSha256:hashAt(r1Path),validatorReportSha256:hashAt(r1ReportPath),officialValidator:'PASS',artifactContract:'PASS'},activeR2:{stageEvidenceSha256:hashAt(r2Path),validatorReportSha256:hashAt(r2ReportPath),officialValidator:'PASS',artifactContract:'PASS'},canonicalV2FinalGate:{status:'PASS_NO_SHARED_WRITE',rawReportsRevalidated:true,rootStaticReceiptValidatedByOfficialIntake:true,actualIntakeReportBound:true,mergeReceiptPath:finalSummary.receiptPath,mergeReceiptSha256:finalSummary.receiptSha256,preservedMergeReceiptPath:preservedMergeReceipt,preservedMergeReceiptSha256,preservedMergerPath,preservedMergerSha256},pungCanonicalNoStatusShape:{r1StatusAbsent:true,r2StatusAbsent:true,status:'PASS_NO_SHARED_WRITE',proofPath:pungProofPath,receiptPath:preservedPungMergeReceipt,receiptSha256:pungCompatibilityCase.receiptSha256},negativeCases:cases.filter(c=>c.status==='PASS_NEGATIVE_GUARD'),negativeGuardCount:cases.filter(c=>c.status==='PASS_NEGATIVE_GUARD').length,canonicalV2FinalGateRuns:cases.filter(c=>c.status==='PASS_NO_SHARED_WRITE'),sharedWrite:false,sharedNineBytesUnchanged:true,productionSourceUnchanged:true,finalQualityApplyNotAttempted:true};
writeJson(path.join(evidenceRoot,'v2-proof-negative-tests.summary.json'),summary);
console.log(JSON.stringify({status:summary.status,examUid,head,negativeGuardCount:summary.negativeGuardCount,canonicalFinalGates:summary.canonicalV2FinalGateRuns.length,pungR1WithoutStatus:'PASS',allCasesPassed:true,r1Validator:'PASS',r1ArtifactContract:'PASS',r2Validator:'PASS',r2ArtifactContract:'PASS',sharedWrite:false,summaryPath:path.join(evidenceRoot,'v2-proof-negative-tests.summary.json')},null,2));

function assert(ok,message){if(!ok)throw Error(message);}
function findJsonContainerEnd(source,start){let inString=false,escaped=false,depth=0,started=false;for(let i=start;i<source.length;i++){const ch=source[i];if(inString){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')inString=false;continue;}if(ch==='"'){inString=true;continue;}if(ch==='['||ch==='{'){depth++;started=true;continue;}if(ch===']'||ch==='}'){if(!started||depth<=0)throw Error('JSON_NESTING_INVALID');depth--;if(depth===0)return i+1;}}throw Error('JSON_CONTAINER_END_NOT_FOUND');}
