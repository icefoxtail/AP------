import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {preflightHandoff,prepareStudentPacket,discloseAfterFreeze,buildAffectedScopePlan,acceptHandoffFile,runCanonicalValidatorCapture,validateEvidenceCoverage} from './archive-codex-handoff.mjs';
import {gitBlobSha} from './archive-stage-validator-compat-v1.mjs';
import {physical,artifactSnapshot,writeFresh} from './archive-codex-artifact-io.mjs';
import {sealCompletion} from './archive-codex-stage-kit.mjs';
import {createDispatcher,claimSlot} from './archive-codex-dispatcher.mjs';
import {QUALITY_CONTRACT_V2} from './archive-stage-validator-artifact-v2.mjs';
import {validateR3Evidence} from './archive-stage-validator-r3-v2.mjs';
import {readExam} from './archive-codex-artifact-io.mjs';
import {buildSourceReferenceAssignmentMetadata} from './archive-source-reference-policy.mjs';

const sha=b=>createHash('sha256').update(b).digest('hex');
function fixture(){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'codex-handoff-'));
  const archive=path.join(root,'archive'),assets=path.join(archive,'assets'),images=path.join(assets,'images');
  fs.mkdirSync(images,{recursive:true});
  const assetPath=path.join(images,'sample.svg'),assetBytes=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="1"/></svg>');fs.writeFileSync(assetPath,assetBytes);
  const js=path.join(root,'exam.js');
  const source=`window.examTitle="Fixture";window.questionBank=[{id:1,content:"Q1",image:"assets/images/sample.svg",answer:"①",solution:"work1"},{id:2,content:"Q2",answer:"②",solution:"work2"}];`;
  fs.writeFileSync(js,source);
  execFileSync('git',['init','-q'],{cwd:root});execFileSync('git',['config','user.email','test@example.invalid'],{cwd:root});execFileSync('git',['config','user.name','Test'],{cwd:root});execFileSync('git',['add','.'],{cwd:root});execFileSync('git',['commit','-qm','fixture'],{cwd:root});
  const head=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),sourceBytes=fs.readFileSync(js),sourceSha=sha(sourceBytes),blob=gitBlobSha(sourceBytes);
  const bundlePath=path.join(root,'student-bundle.json'),bundle={schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:sourceSha,questionCount:2,qids:[1,2],rows:[
    {qid:1,student:{id:1,content:'Q1',image:'assets/images/sample.svg'},assets:[{ref:'assets/images/sample.svg',path:assetPath,sha256:sha(assetBytes)}]},
    {qid:2,student:{id:2,content:'Q2'},assets:[]}
  ]};fs.writeFileSync(bundlePath,JSON.stringify(bundle));
  const evidencePath=path.join(root,'evidence.json'),reportPath=path.join(root,'raw-report.json');
  const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX',examUid:'exam-fixture',stage:'R1',artifactSha:blob,rows:[{qid:1},{qid:2}],technicalHashes:{rawSha256:sourceSha,validatorRawBufferBlobSha1:blob,gitCleanFilterBlobSha1:null}};
  fs.writeFileSync(evidencePath,JSON.stringify(evidence));
  const snap=artifactSnapshot({sourceFile:js,evidenceFile:evidencePath,assetRoot:archive});
  const report={ok:true,disposition:'PASS',stage:'R1',examUid:'exam-fixture',executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,validatorMode:'R1_V2',artifactSha:blob,evidenceRef:evidencePath,issues:[],common:{commonValid:true},artifactContract:{active:true,disposition:'PASS',issues:[],questionCount:2},technicalBinding:snap};
  fs.writeFileSync(reportPath,JSON.stringify(report));
  const assignmentPath=path.join(root,'assignment.json'),assignment={schemaVersion:'JS_ARCHIVE_CODEX_HANDOFF_ASSIGNMENT_V1',worktreeRootAbsolute:root,workingJsAbsolute:js,assetRootAbsolute:archive,evidenceRootAbsolute:root,evidenceAbsolute:evidencePath,rawReportAbsolute:reportPath,studentBundleAbsolute:bundlePath,expectedHead:head,expectedSourceRawSha256:sourceSha,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX',stage:'R1',examUid:'exam-fixture',questionCount:2,qids:[1,2],sourceReferencePolicyMetadata:buildSourceReferenceAssignmentMetadata({stage:'R1'}),reviewerIdentity:{role:'archive_r1',reviewerId:'codex-r1-actor-8971',displayPrefix:'R1'},};fs.writeFileSync(assignmentPath,JSON.stringify(assignment));
  const receiptPath=path.join(root,'receipt.json');fs.writeFileSync(receiptPath,JSON.stringify({schemaVersion:'JS_ARCHIVE_CODEX_HANDOFF_ASSIGNMENT_RECEIPT_V1',assignmentSha256:physical(assignmentPath).sha256,worktreeRootAbsolute:root,expectedHead:head,actualHead:head,sourceRawSha256:sourceSha,sourceRawBufferBlobSha1:blob,reviewerCanonicalId:'codex-r1-actor-8971'}));
  return {root,archive,assets,assetPath,js,sourceSha,blob,bundlePath,bundle,assignmentPath,assignment,receiptPath,evidencePath,reportPath};
}
function pre(f,extra={}){return preflightHandoff({assignmentFile:f.assignmentPath,receiptFile:f.receiptPath,reviewerCanonicalId:'codex-r1-actor-8971',...extra});}
function replaceJson(file,value){fs.writeFileSync(file,JSON.stringify(value));}
function makeFreeze(f,stage='R1'){
  const freezePath=path.join(f.root,'freeze.json');
  fs.writeFileSync(freezePath,JSON.stringify({schemaVersion:'JS_ARCHIVE_IMMUTABLE_BLIND_FREEZE_V1',stage,sourceRawSha256:f.sourceSha,reviewerIdentity:{role:'archive_'+stage.toLowerCase(),reviewerId:'codex-'+stage.toLowerCase()+'-actor'},studentBundle:physical(f.bundlePath),studentQidOrder:[1,2],rows:[{qid:1,independentAnswer:'①'},{qid:2,independentAnswer:'②'}]}));
  return {freezePath,freezeSha:physical(freezePath).sha256};
}

test('preflight binds assignment, exact actor, full qids, real assets and actual raw report without parsing JS',()=>{
  const f=fixture();
  // Invalid JavaScript remains acceptable here: this gate hashes source bytes only.
  fs.writeFileSync(f.js,'this is deliberately not executable JS');
  const source=fs.readFileSync(f.js),actualSha=sha(source),actualBlob=gitBlobSha(source);
  f.assignment.expectedSourceRawSha256=actualSha;replaceJson(f.assignmentPath,f.assignment);
  const packet=JSON.parse(fs.readFileSync(f.bundlePath));packet.sourceRawSha256=actualSha;replaceJson(f.bundlePath,packet);
  f.receiptPath&&replaceJson(f.receiptPath,{...JSON.parse(fs.readFileSync(f.receiptPath)),assignmentSha256:physical(f.assignmentPath).sha256,sourceRawSha256:actualSha,sourceRawBufferBlobSha1:actualBlob});
  const ev=JSON.parse(fs.readFileSync(f.evidencePath));ev.artifactSha=actualBlob;ev.technicalHashes={rawSha256:actualSha,validatorRawBufferBlobSha1:actualBlob,gitCleanFilterBlobSha1:null};replaceJson(f.evidencePath,ev);
  const report=JSON.parse(fs.readFileSync(f.reportPath));report.artifactSha=actualBlob;report.technicalBinding.source.sha256=actualSha;report.technicalBinding.source.rawBufferGitBlobSha1=actualBlob;report.technicalBinding.evidence.sha256=physical(f.evidencePath).sha256;replaceJson(f.reportPath,report);
  const out=pre(f);assert.equal(out.answerBearingSourceParsed,false);assert.deepEqual(out.qids,[1,2]);assert.equal(out.rawReportDisposition,'PASS');assert.equal(out.executionProvenance,'UNPROVEN');assert.equal(out.disposition,'STRUCTURE_BOUND');
});

test('handoff preflight requires SHA-bound source policy metadata and rejects silent parity claims',()=>{
  const f=fixture();delete f.assignment.sourceReferencePolicyMetadata;replaceJson(f.assignmentPath,f.assignment);
  replaceJson(f.receiptPath,{...JSON.parse(fs.readFileSync(f.receiptPath)),assignmentSha256:physical(f.assignmentPath).sha256});
  assert.throws(()=>pre(f),/SOURCE_REFERENCE_ASSIGNMENT_METADATA_REQUIRED/);
  const g=fixture();g.assignment.sourceReferencePolicyMetadata.sourceReferencePolicy.sourceParityBasis='SOURCE_TEXT_EXACT_PARITY';replaceJson(g.assignmentPath,g.assignment);
  replaceJson(g.receiptPath,{...JSON.parse(fs.readFileSync(g.receiptPath)),assignmentSha256:physical(g.assignmentPath).sha256});
  assert.throws(()=>pre(g),/SOURCE_REFERENCE_POLICY_DEFAULT_OR_HONESTY_MISMATCH|SOURCE_REFERENCE_POLICY_CONTENT_MISMATCH/);
  const h=fixture();h.assignment.sourceReferencePolicyMetadata=buildSourceReferenceAssignmentMetadata({stage:'R1',sourceDefect:{category:'MISSING_ASSET',qids:[1],scope:'QID_ONLY',reason:'The extracted problem references an unavailable figure.',findings:[{qid:1,detail:'The declared assets/images/sample.svg file is missing.'}]}});replaceJson(h.assignmentPath,h.assignment);
  replaceJson(h.receiptPath,{...JSON.parse(fs.readFileSync(h.receiptPath)),assignmentSha256:physical(h.assignmentPath).sha256});
  assert.throws(()=>pre(h),/SCOPED_ORIGINAL_REFERENCE_REVIEW_REQUIRED/);
});

test('canonical validator capture preserves exact stdout/stderr/exit and never converts its result to PASS',()=>{
  const f=fixture(),capturePath=path.join(f.root,'validator-capture.json'),{freezePath,freezeSha}=makeFreeze(f);
  const prefreezeOutput=path.join(f.root,'prefreeze-capture.json');assert.throws(()=>runCanonicalValidatorCapture({root:f.root,workingJsFile:f.js,evidenceFile:f.evidencePath,bundleFile:f.bundlePath,assetRoot:f.archive,stage:'R1',expectedSourceRawSha256:f.sourceSha,output:prefreezeOutput}),/PREFREEZE_VALIDATOR_RUN_FORBIDDEN/);assert.equal(fs.existsSync(prefreezeOutput),false);
  const result=runCanonicalValidatorCapture({root:f.root,workingJsFile:f.js,evidenceFile:f.evidencePath,bundleFile:f.bundlePath,assetRoot:f.archive,stage:'R1',expectedSourceRawSha256:f.sourceSha,freezeFile:freezePath,freezeSha256:freezeSha,output:capturePath});
  const captured=JSON.parse(fs.readFileSync(capturePath));assert.equal(result.executionProvenance,'PROCESS_CAPTURED');assert.equal(result.passAsserted,false);assert.notEqual(captured.exitCode,0);assert.ok(Buffer.from(captured.stdoutBase64,'base64').length>0);assert.equal(captured.actualValidatorInvocation,true);
  assert.throws(()=>runCanonicalValidatorCapture({root:f.root,workingJsFile:f.js,evidenceFile:f.evidencePath,bundleFile:f.bundlePath,assetRoot:f.archive,stage:'R1',expectedSourceRawSha256:f.sourceSha,freezeFile:freezePath,freezeSha256:freezeSha,output:capturePath}),/CAPTURE_OUTPUT_ALREADY_EXISTS/);
});

test('R3 coverage accepts targeted reviewer rows plus full artifact dispositions',()=>{
  const f=fixture(),evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R3',examUid:'exam-fixture',artifactSha:f.blob,targetedScope:{openFindingQids:[],changedQids:[1],directDependencyQids:[]},lockedScopeIntegrity:true,releaseIntegrity:true,rows:[{qid:1,verdict:'PASS'}],artifactDispositions:{artifactSha:f.blob,rows:[{qid:1,metaDisposition:'CURRENT_FIELDS_RETAINED'},{qid:2,metaDisposition:'CURRENT_FIELDS_RETAINED'}]}};
  const coverage=validateEvidenceCoverage({stage:'R3',evidence,qids:[1,2]});assert.deepEqual(coverage.targetedQids,[1]);assert.equal(coverage.fullQids,2);
  const report=validateR3Evidence({examUid:'exam-fixture',artifactSha:f.blob,actualArtifactSha:f.blob,evidenceRef:f.evidencePath,evidence});assert.equal(report.disposition,'PASS');
  assert.throws(()=>validateEvidenceCoverage({stage:'R3',evidence:{...evidence,rows:[{qid:2,verdict:'PASS'}]},qids:[1,2]}),/R3_TARGETED_QID_COVERAGE_MISMATCH/);
  assert.throws(()=>validateEvidenceCoverage({stage:'R3',evidence:{...evidence,artifactDispositions:{artifactSha:f.blob,rows:[{qid:1}]}},qids:[1,2]}),/R3_FULL_ARTIFACT_DISPOSITION_DENOMINATOR_REQUIRED/);
  assert.throws(()=>validateEvidenceCoverage({stage:'R3',evidence:{...evidence,rows:[{qid:9,verdict:'PASS'}]},qids:[1,2]}),/EVIDENCE_QID_SCOPE_INVALID/);
});

test('R1 freeze rebind accepts only unchanged student fields and required asset hashes after source-byte edits',()=>{
  const f=fixture(),{freezePath,freezeSha}=makeFreeze(f),capturePath=path.join(f.root,'rebound-capture.json');
  fs.writeFileSync(f.js,fs.readFileSync(f.js,'utf8').replace('answer:"①",solution:"work1"','answer:"③",solution:"corrected work1"'));
  const currentBytes=fs.readFileSync(f.js),currentSha=sha(currentBytes),currentBlob=gitBlobSha(currentBytes),currentBundlePath=path.join(f.root,'current-bundle.json'),currentBundle=structuredClone(f.bundle);currentBundle.sourceRawSha256=currentSha;replaceJson(currentBundlePath,currentBundle);
  const evidence=JSON.parse(fs.readFileSync(f.evidencePath));evidence.artifactSha=currentBlob;replaceJson(f.evidencePath,evidence);
  const result=runCanonicalValidatorCapture({root:f.root,workingJsFile:f.js,evidenceFile:f.evidencePath,bundleFile:currentBundlePath,assetRoot:f.archive,stage:'R1',expectedSourceRawSha256:currentSha,freezeFile:freezePath,freezeSha256:freezeSha,output:capturePath});
  const capture=JSON.parse(fs.readFileSync(capturePath));assert.equal(capture.originalFreeze.sha256,freezeSha);assert.equal(capture.sourceRawSha256,currentSha);assert.equal(result.executionProvenance,'PROCESS_CAPTURED');
  const g=fixture(),badFreeze=makeFreeze(g),badSource=fs.readFileSync(g.js,'utf8').replace('content:"Q1"','content:"Changed Q1"');fs.writeFileSync(g.js,badSource);const badBytes=fs.readFileSync(g.js),badSha=sha(badBytes),badBundle=structuredClone(g.bundle);badBundle.sourceRawSha256=badSha;badBundle.rows[0].student.content='Changed Q1';const badBundlePath=path.join(g.root,'current.json');replaceJson(badBundlePath,badBundle);
  assert.throws(()=>runCanonicalValidatorCapture({root:g.root,workingJsFile:g.js,evidenceFile:g.evidencePath,bundleFile:badBundlePath,assetRoot:g.archive,stage:'R1',expectedSourceRawSha256:badSha,freezeFile:badFreeze.freezePath,freezeSha256:badFreeze.freezeSha,output:path.join(g.root,'bad-capture.json')}),/CURRENT_STUDENT_INPUT_CHANGED_SINCE_FREEZE/);
  const h=fixture(),assetFreeze=makeFreeze(h);fs.writeFileSync(h.assetPath,'<svg/>');const changedAsset=fs.readFileSync(h.assetPath),assetBundle=structuredClone(h.bundle);assetBundle.rows[0].assets[0].sha256=sha(changedAsset);const changedBundlePath=path.join(h.root,'current.json');replaceJson(changedBundlePath,assetBundle);
  assert.throws(()=>runCanonicalValidatorCapture({root:h.root,workingJsFile:h.js,evidenceFile:h.evidencePath,bundleFile:changedBundlePath,assetRoot:h.archive,stage:'R1',expectedSourceRawSha256:h.sourceSha,freezeFile:assetFreeze.freezePath,freezeSha256:assetFreeze.freezeSha,output:path.join(h.root,'asset-change-capture.json')}),/STUDENT_ASSET_SHA_CHANGED|ASSET_DECLARED_PATH_MISMATCH/);
});

test('rejects display prefix instead of canonical reviewer id',()=>{const f=fixture();assert.throws(()=>pre(f,{reviewerCanonicalId:'R1'}),/CANONICAL_REVIEWER_ID_MISMATCH/);});
test('rejects asset directory in place of its parent',()=>{const f=fixture();assert.throws(()=>pre(f,{assetRoot:path.join(f.archive,'assets')}),/ASSET_ROOT_MUST_BE_ASSETS_PARENT_DIRECTORY/);});
test('rejects source tampering and stale evidence/report binding',()=>{const f=fixture();fs.appendFileSync(f.js,'// changed');assert.throws(()=>pre(f),/ASSIGNED_SOURCE_HASH_MISMATCH/);});
test('rejects tampered evidence and student bundle qid omissions',()=>{
  const f=fixture();fs.appendFileSync(f.evidencePath,' ');assert.throws(()=>pre(f),/RAW_REPORT_PHYSICAL_BINDING_STALE/);
  const g=fixture();const b=JSON.parse(fs.readFileSync(g.bundlePath));b.rows.pop();b.qids=[1];b.questionCount=1;replaceJson(g.bundlePath,b);assert.throws(()=>pre(g),/FULL_STUDENT_BUNDLE_QID_DENOMINATOR_REQUIRED/);
});
test('rejects raw report schema/PASS synthesis and missing qid denominator',()=>{
  const f=fixture(),report=JSON.parse(fs.readFileSync(f.reportPath));report.artifactContract.questionCount=1;replaceJson(f.reportPath,report);assert.throws(()=>pre(f),/ACTUAL_RAW_GENERIC_REPORT_PASS_REQUIRED/);
  const g=fixture(),ev=JSON.parse(fs.readFileSync(g.evidencePath));ev.rows.pop();replaceJson(g.evidencePath,ev);assert.throws(()=>pre(g),/EVIDENCE_FULL_QID_DENOMINATOR_REQUIRED/);
});
test('student packet rejects answer leak and missing/tampered required asset',()=>{
  const f=fixture(),leak=structuredClone(f.bundle);leak.rows[0].student.answer='①';replaceJson(f.bundlePath,leak);assert.throws(()=>prepareStudentPacket({sourceFile:f.js,sourceRawSha256:f.sourceSha,bundleFile:f.bundlePath,assetRoot:f.archive,output:path.join(f.root,'packet.json')}),/STUDENT_BUNDLE_FORBIDDEN_FIELD:answer/);
  const g=fixture();fs.unlinkSync(g.assetPath);assert.throws(()=>prepareStudentPacket({sourceFile:g.js,sourceRawSha256:g.sourceSha,bundleFile:g.bundlePath,assetRoot:g.archive,output:path.join(g.root,'packet.json')}),/ENOENT|ASSET_MISSING|PATH_ANCESTOR_REQUIRED/);
});
test('rejects declared asset paths whose symlink target escapes the assigned assets root',()=>{
  const f=fixture(),outside=path.join(f.root,'outside-assets');fs.mkdirSync(outside);fs.writeFileSync(path.join(outside,'sample.svg'),'<svg/>');
  const images=path.dirname(f.assetPath);fs.rmSync(images,{recursive:true});
  try{fs.symlinkSync(outside,images,'junction');}catch{
    fs.mkdirSync(images,{recursive:true});fs.writeFileSync(f.assetPath,'<svg/>');
    const bundle=structuredClone(f.bundle);bundle.rows[0].assets[0].path=path.join(outside,'sample.svg');replaceJson(f.bundlePath,bundle);
    assert.throws(()=>prepareStudentPacket({sourceFile:f.js,sourceRawSha256:f.sourceSha,bundleFile:f.bundlePath,assetRoot:f.archive,output:path.join(f.root,'packet.json')}),/ASSET_DECLARED_PATH_MISMATCH/);return;
  }
  assert.throws(()=>prepareStudentPacket({sourceFile:f.js,sourceRawSha256:f.sourceSha,bundleFile:f.bundlePath,assetRoot:f.archive,output:path.join(f.root,'packet.json')}),/SYMLINK_ESCAPE|ASSET_DECLARED_PATH_MISMATCH/);
});
test('ROOT packet extraction keeps rich student fields and transitive assets, rejecting relabeled stale content',()=>{
  const f=fixture();fs.writeFileSync(f.assetPath,'<svg xmlns="http://www.w3.org/2000/svg"><image href="dep.svg"/></svg>');const dep=path.join(path.dirname(f.assetPath),'dep.svg');fs.writeFileSync(dep,'<svg xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="1"/></svg>');
  const richSource=`window.examTitle="Rich";window.questionBank=[{id:1,content:"Current condition",image:"assets/images/sample.svg",choices:[{text:"A",label:"A",privateNote:"drop"},{text:"B"}],sharedMaterial:"shared context",table:[{x:1}],choiceColumns:2,layoutTag:"wide",answer:"①",solution:"secret",meta:{x:1}},{id:2,content:"Second",commonData:"common body",answer:"②",solution:"secret2"}];`;
  fs.writeFileSync(f.js,richSource);const sourceSha=sha(fs.readFileSync(f.js)),out=path.join(f.root,'root-packet.json'),prepared=prepareStudentPacket({sourceFile:f.js,sourceRawSha256:sourceSha,assetRoot:f.archive,output:out});
  assert.equal(prepared.extractedFromCurrentSource,true);const packet=JSON.parse(fs.readFileSync(out)),q1=packet.rows[0];assert.equal(q1.student.content,'Current condition');assert.equal(q1.student.sharedMaterial,'shared context');assert.deepEqual(q1.student.table,[{x:1}]);assert.equal(q1.student.choiceColumns,2);assert.deepEqual(q1.student.choices,[{text:'A'},{text:'B'}]);assert.deepEqual(q1.assets.map(a=>a.ref).sort(),['assets/images/dep.svg','assets/images/sample.svg']);assert.equal(Object.hasOwn(q1.student,'answer'),false);assert.equal(Object.hasOwn(q1.student,'solution'),false);assert.equal(Object.hasOwn(q1.student,'meta'),false);
  const stale=structuredClone(packet);stale.sourceRawSha256=sourceSha;stale.rows[0].student.content='Old condition';const stalePath=path.join(f.root,'relabeled-old-bundle.json');replaceJson(stalePath,stale);
  assert.throws(()=>prepareStudentPacket({sourceFile:f.js,sourceRawSha256:sourceSha,bundleFile:stalePath,assetRoot:f.archive,output:path.join(f.root,'stale-out.json')}),/STUDENT_BUNDLE_NOT_EXACT_CURRENT_SOURCE_PROJECTION/);
});
test('postfreeze disclosure requires exact freeze SHA/parity and preserves the original freeze',()=>{
  const f=fixture(),freezePath=path.join(f.root,'freeze.json'),freeze={schemaVersion:'JS_ARCHIVE_IMMUTABLE_BLIND_FREEZE_V1',stage:'R1',sourceRawSha256:f.sourceSha,reviewerIdentity:{role:'archive_r1',reviewerId:'codex-r1-actor-8971'},studentBundle:physical(f.bundlePath),studentQidOrder:[1,2],rows:[{qid:1,independentAnswer:'①'},{qid:2,independentAnswer:'②'}]};fs.writeFileSync(freezePath,JSON.stringify(freeze));const original=fs.readFileSync(freezePath),freezeSha=sha(original);
  assert.throws(()=>discloseAfterFreeze({sourceFile:f.js,studentBundleFile:f.bundlePath,freezeFile:freezePath,freezeSha256:'0'.repeat(64),assetRoot:f.archive,output:path.join(f.root,'bad-disclosure.json')}),/ORIGINAL_FREEZE_SHA_REQUIRED/);
  const result=discloseAfterFreeze({sourceFile:f.js,studentBundleFile:f.bundlePath,freezeFile:freezePath,freezeSha256:freezeSha,qids:[1],assetRoot:f.archive,output:path.join(f.root,'disclosure.json')});assert.equal(result.disclosure.studentParity,'EXACT');assert.deepEqual(Array.from(result.disclosure.rows,r=>r.qid),[1]);assert.deepEqual(fs.readFileSync(freezePath),original);
});
test('scope plan preserves freeze identity and rejects outside-scope changes',()=>{
  const f=fixture(),old=path.join(f.root,'old.json'),current=path.join(f.root,'current.json'),freeze=path.join(f.root,'freeze.json'),out=path.join(f.root,'plan.json');
  fs.copyFileSync(f.bundlePath,old);const changed=structuredClone(f.bundle);changed.rows[0].student.content='Q1 changed in scope';replaceJson(current,changed);
  fs.writeFileSync(freeze,JSON.stringify({stage:'R1',sourceRawSha256:f.sourceSha,reviewerIdentity:{role:'archive_r1',reviewerId:'frozen-id'}}));
  const result=buildAffectedScopePlan({oldBundleFile:old,currentBundleFile:current,scopeQids:[1],freezeFile:freeze,assetRoot:f.archive,output:out});assert.equal(result.plan.semanticVerdictCreated,false);assert.equal(result.plan.originalFreezeIdentity.reviewerIdentity.reviewerId,'frozen-id');
  changed.rows[1].student.content='outside changed';replaceJson(current,changed);assert.throws(()=>buildAffectedScopePlan({oldBundleFile:old,currentBundleFile:current,scopeQids:[1],freezeFile:freeze,assetRoot:f.archive,output:path.join(f.root,'bad-plan.json')}),/OUTSIDE_SCOPE_CHANGED:2/);
});
test('accept is atomic through dispatcher and stale repeat cannot double-accept',()=>{
  const f=fixture(),eventPath=path.join(f.root,'event.json'),event={schemaVersion:'JS_ARCHIVE_CODEX_STABLE_STAGE_COMPLETE_V1',status:'STAGE_COMPLETE',executionLine:'CODEX',qualityContractVersion:QUALITY_CONTRACT_V2,examUid:'exam-fixture',stage:'R1',reviewerIdentity:{role:'archive_r1',reviewerId:'actor'},sealedAt:new Date().toISOString(),artifactSha:f.blob,physicalSnapshot:JSON.parse(fs.readFileSync(f.reportPath)).technicalBinding,rawReport:physical(f.reportPath),extraProofs:[],nextStage:'R2',freedSlot:'R1',nextRosterTarget:'next-r1',completionBasis:'GENERIC_STAGE_PASS_ONLY',actualRenderPassAsserted:false};
  // Create a completion event through the canonical sealer to exercise the actual intake path.
  const evidence=JSON.parse(fs.readFileSync(f.evidencePath));evidence.stage='R1';evidence.examUid='exam-fixture';replaceJson(f.evidencePath,evidence);
  const report=JSON.parse(fs.readFileSync(f.reportPath));report.technicalBinding=artifactSnapshot({sourceFile:f.js,evidenceFile:f.evidencePath,assetRoot:f.archive});replaceJson(f.reportPath,report);
  const sealed=sealCompletion({root:f.root,sourceFile:f.js,evidenceFile:f.evidencePath,reportFile:f.reportPath,assetRoot:f.archive,reviewerIdentity:{role:'archive_r1',reviewerId:'actor'},nextRosterTarget:'next-r1',output:eventPath});
  const stateFile=path.join(f.root,'state.json');let state=createDispatcher({runId:'run',roster:[{examUid:'exam-fixture'}]});state=claimSlot(state,{stage:'CREATE',examUid:'exam-fixture',sessionId:'create'});state.jobs['exam-fixture'].nextStage='R1';state=claimSlot(state,{stage:'R1',examUid:'exam-fixture',sessionId:'actor'});fs.writeFileSync(stateFile,JSON.stringify(state));
  const before=physical(stateFile).sha256,res=acceptHandoffFile({root:f.root,stateFile,expectedStateSha256:before,eventFile:eventPath,eventSha256:sealed.ref.sha256});const accepted=JSON.parse(fs.readFileSync(stateFile));assert.equal(accepted.slots.R1,null);assert.equal(accepted.jobs['exam-fixture'].nextStage,'R2');assert.deepEqual(res.nextRoster,res.nextDispatch);
  const after=physical(stateFile).sha256;assert.notEqual(before,after);assert.throws(()=>acceptHandoffFile({root:f.root,stateFile,expectedStateSha256:before,eventFile:eventPath,eventSha256:sealed.ref.sha256}),/DISPATCHER_STATE_CHANGED/);
  assert.throws(()=>acceptHandoffFile({root:f.root,stateFile,expectedStateSha256:after,eventFile:eventPath,eventSha256:sealed.ref.sha256}),/COMPLETION_SLOT_OWNER_MISMATCH|EVENT_ALREADY_ACCEPTED/);assert.equal(physical(stateFile).sha256,after);
  fs.appendFileSync(eventPath,' ');const current=physical(stateFile).sha256;assert.throws(()=>acceptHandoffFile({root:f.root,stateFile,expectedStateSha256:current,eventFile:eventPath,eventSha256:sealed.ref.sha256}),/SEALED_EVENT_SHA_REQUIRED/);assert.equal(physical(stateFile).sha256,current);
});

test('TEST-ONLY synthetic current R3 fixture passes the real canonical validator and PROCESS_CAPTURED preflight',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'TEST-ONLY-codex-handoff-r3-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const archive=path.join(root,'archive'),assets=path.join(archive,'assets'),evidenceRoot=path.join(root,'.tmp','TEST-ONLY','evidence');fs.mkdirSync(assets,{recursive:true});fs.mkdirSync(evidenceRoot,{recursive:true});
  const q={id:1,level:'중',category:'대수',originalCategory:'대수',questionType:'객관식',layoutTag:'',wide:false,tags:[],content:'TEST-ONLY 구조 검증용 문항.',choices:['1','2'],answer:'①',solution:'TEST-ONLY synthetic fixture; no mathematical approval.',standardCourse:'수학(상)',standardUnitKey:'UNIT',standardUnit:'방정식',standardUnitOrder:1,subUnitKey:'SUB',subUnit:'일차방정식',subUnitConfidence:'high',subUnitClassificationDepth:'L2',problemTypeKey:'PT',templateKey:'TPL',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',difficultyBucket:2,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL'};
  const sourceFile=path.join(root,'test-only-exam.js');fs.writeFileSync(sourceFile,`window.examTitle="TEST-ONLY SYNTHETIC FIXTURE — NOT PRODUCTION";window.questionBank=${JSON.stringify([q])};`);
  execFileSync('git',['init','-q'],{cwd:root});execFileSync('git',['config','user.email','test@example.invalid'],{cwd:root});execFileSync('git',['config','user.name','TEST-ONLY'],{cwd:root});execFileSync('git',['add','.'],{cwd:root});execFileSync('git',['commit','-qm','TEST-ONLY synthetic fixture'],{cwd:root});
  const exam=readExam(sourceFile),examUid='TEST-ONLY-codex-handoff-r3';
  const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX',stage:'R3',examUid,artifactSha:exam.rawBufferGitBlobSha1,targetedScope:{openFindingQids:[],changedQids:[1],directDependencyQids:[]},lockedScopeIntegrity:true,releaseIntegrity:true,rows:[{qid:1,verdict:'SYNTHETIC_TEST_SENTINEL'}],artifactDispositions:{artifactSha:exam.rawBufferGitBlobSha1,rows:[{qid:1,metaDisposition:'TEST_ONLY_SYNTHETIC_FIELDS_RETAINED'}]}};
  const evidencePath=path.join(evidenceRoot,'R3.json');fs.writeFileSync(evidencePath,JSON.stringify(evidence));
  const bundlePath=path.join(evidenceRoot,'student-only.json'),capturePath=path.join(evidenceRoot,'canonical-validator-capture.json');
  prepareStudentPacket({sourceFile,sourceRawSha256:exam.rawSha256,assetRoot:archive,output:bundlePath});
  const run=runCanonicalValidatorCapture({root,workingJsFile:sourceFile,evidenceFile:evidencePath,bundleFile:bundlePath,assetRoot:archive,stage:'R3',expectedSourceRawSha256:exam.rawSha256,output:capturePath});
  assert.equal(run.exitCode,0,JSON.stringify(run.report));assert.equal(run.passAsserted,false);const capture=JSON.parse(fs.readFileSync(capturePath));
  assert.equal(capture.exitCode,0);const rawStdout=Buffer.from(capture.stdoutBase64,'base64').toString('utf8'),report=JSON.parse(rawStdout);assert.equal(report.disposition,'PASS');assert.equal(report.artifactContract.questionCount,1);assert.deepEqual(report.common.expectedQids,[1]);
  const assignmentPath=path.join(root,'assignment.json'),assignment={schemaVersion:'JS_ARCHIVE_CODEX_HANDOFF_ASSIGNMENT_V1',worktreeRootAbsolute:root,workingJsAbsolute:sourceFile,assetRootAbsolute:archive,evidenceRootAbsolute:evidenceRoot,evidenceAbsolute:evidencePath,studentBundleAbsolute:bundlePath,validatorCaptureAbsolute:capturePath,expectedHead:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),expectedSourceRawSha256:exam.rawSha256,qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX',stage:'R3',examUid,questionCount:1,qids:[1],sourceReferencePolicyMetadata:buildSourceReferenceAssignmentMetadata({stage:'R3'}),reviewerIdentity:{role:'archive_r3',reviewerId:'TEST-ONLY-r3-canonical-id',displayPrefix:'R3'}};fs.writeFileSync(assignmentPath,JSON.stringify(assignment));
  const receiptPath=path.join(root,'receipt.json');fs.writeFileSync(receiptPath,JSON.stringify({schemaVersion:'JS_ARCHIVE_CODEX_HANDOFF_ASSIGNMENT_RECEIPT_V1',assignmentSha256:physical(assignmentPath).sha256,worktreeRootAbsolute:root,expectedHead:assignment.expectedHead,actualHead:assignment.expectedHead,sourceRawSha256:exam.rawSha256,sourceRawBufferBlobSha1:exam.rawBufferGitBlobSha1,reviewerCanonicalId:assignment.reviewerIdentity.reviewerId}));
  const checked=preflightHandoff({assignmentFile:assignmentPath,receiptFile:receiptPath,reviewerCanonicalId:assignment.reviewerIdentity.reviewerId});
  assert.equal(checked.executionProvenance,'PROCESS_CAPTURED');assert.equal(checked.disposition,'STRUCTURE_BOUND');assert.equal(checked.rawReportDisposition,'PASS');assert.deepEqual(checked.qids,[1]);assert.deepEqual(JSON.parse(Buffer.from(capture.stdoutBase64,'base64').toString('utf8')),report);
  assert.equal(report.examUid,examUid);assert.notEqual(evidence.rows[0].verdict,'PASS');assert.match(fs.readFileSync(sourceFile,'utf8'),/TEST-ONLY SYNTHETIC FIXTURE/);
});
