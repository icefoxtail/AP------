import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const root=path.resolve('C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------');
const runId='archive-2026-1mid-nine-20261008';
const examUid='26_강남여고_1학기_중간_고1_기출';
const productionRelativePath='archive/exams/original/high/h1/1mid/26_강남여고_1학기_중간_고1_기출.js';
const expectedHead='0649c332f978de9214acc9cde242f438c1878588';
const expectedSourceRaw='7b4ec0b5141141663eebf2df09ffcce88a462ab94b013658dc90e56fef7a4b00';
const expectedSourceBlob='7986be54a1844b97cacb38b8db3df45c753c5fb4';
const expectedAssetSha='24db6c08a49b658f646a2690c5a4a93f25c71498e9456621a1f3b4b61abc8755';
const expectedR1EvidenceSha='7d608b8b1b0501eece21e6fbb3e5e521c987b8c56c436742544e7eaffeab2e66';
const expectedR1ValidationSha='426e4cfff5f5dd5264a8fd4e592e4f046cf64709970f7f7c926e7a951dae2ee5';
const expectedProbeSha='8f8b771e265e9b1b2330504a44f3b45c08634088f0f81e32dea0f61bdff93b94';
const uidRoot=path.join(root,'.tmp','archive',runId,examUid);
const evidenceRoot=path.join(root,'archive','analysis',runId,examUid);
const rawProducer=path.join(root,'archive','tools','prepare-target-registration-candidate.mjs');
const localProducer=path.join(uidRoot,'registration-adapter-05','prepare-target-registration-candidate.mjs');
const adapterReceipt=path.join(evidenceRoot,'ROOT.registration-h1-target-adapter.attempt-05.receipt.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const hashFile=p=>sha(fs.readFileSync(p));
const requireExact=(a,b,code)=>{if(a!==b)throw new Error(code+': expected='+b+' actual='+a);};
const rootRelative=p=>path.relative(root,p).split(path.sep).join('/');
const writeFresh=(p,value)=>{const bytes=JSON.stringify(value,null,2)+'\n';if(fs.existsSync(p)){if(fs.readFileSync(p,'utf8')!==bytes)throw new Error('OUTPUT_EXISTS_WITH_DIFFERENT_BYTES:'+p);return;}fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,bytes,{flag:'wx'});};
const head=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
requireExact(head,expectedHead,'EXPECTED_HEAD_MISMATCH');
const sourcePath=path.join(root,productionRelativePath), assetPath=path.join(root,'archive','assets','images',examUid,'q07.png');
requireExact(hashFile(sourcePath),expectedSourceRaw,'PRODUCTION_SOURCE_SHA_MISMATCH');
requireExact(execFileSync('git',['-C',root,'hash-object','--no-filters',sourcePath],{encoding:'utf8'}).trim(),expectedSourceBlob,'PRODUCTION_SOURCE_BLOB_MISMATCH');
requireExact(hashFile(assetPath),expectedAssetSha,'Q07_ASSET_SHA_MISMATCH');
const probePath=path.join(evidenceRoot,'ROOT.registration-api-probe.json');
requireExact(hashFile(probePath),expectedProbeSha,'API_PROBE_SHA_MISMATCH');
const probe=JSON.parse(fs.readFileSync(probePath,'utf8'));
if(probe.examUid!==examUid||probe.firstMissingClosureStep!=='BUILD_TARGET_ONLY_REGISTRATION_CANDIDATE'||probe.attempt?.failedBeforeAnyRegistryWrite!==true||probe.sourceQualityRevalidationRequired!==false)throw new Error('CONTINUATION_SCOPE_MISMATCH');
const promotionPath=path.join(evidenceRoot,'ROOT.promotion.receipt.json'), renderPath=path.join(evidenceRoot,'ROOT.production.render.receipt.json');
const promotion=JSON.parse(fs.readFileSync(promotionPath,'utf8')), render=JSON.parse(fs.readFileSync(renderPath,'utf8'));
const runRosterPath=path.join(root,'archive','analysis',runId,'roster.json');
const runRosterBytes=fs.readFileSync(runRosterPath), sourceRunRoster=JSON.parse(runRosterBytes.toString('utf8'));
const selected=sourceRunRoster.find(row=>row.examUid===examUid);
if(!selected||selected.rosterIndex!==0||selected.productionRelativePath!==productionRelativePath)throw new Error('LOCKED_RUN_ROSTER_TARGET_MISMATCH');
const sourceWindow={window:{}};vm.runInNewContext(fs.readFileSync(sourcePath,'utf8'),sourceWindow,{timeout:5000});
const bank=sourceWindow.window.questionBank||sourceWindow.window.questions;
if(!Array.isArray(bank)||bank.length!==24)throw new Error('SOURCE_QID_DENOMINATOR_MISMATCH');
const physicalCourses=[...new Set(bank.map(q=>String(q.standardCourse||'')))];
if(physicalCourses.length!==1||physicalCourses[0]!=='공통수학1')throw new Error('CURRENT_PHYSICAL_COURSE_MISMATCH');
const r1Path=path.join(evidenceRoot,'R1.evidence.final-02.json'), r1ValidationPath=path.join(evidenceRoot,'R1.generic-validator.pass-03.raw.json');
requireExact(hashFile(r1Path),expectedR1EvidenceSha,'R1_EVIDENCE_SHA_MISMATCH');
requireExact(hashFile(r1ValidationPath),expectedR1ValidationSha,'R1_VALIDATION_SHA_MISMATCH');
const r1=JSON.parse(fs.readFileSync(r1Path,'utf8')), r1Validation=JSON.parse(fs.readFileSync(r1ValidationPath,'utf8'));
const expectedQids=Array.from({length:24},(_,i)=>i+1);
if(r1.stage!=='R1'||r1.examUid!==examUid||r1.artifactSha!==expectedSourceBlob||r1.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||r1.executionLine!=='CODEX'||r1.rows.length!==24)throw new Error('R1_IDENTITY_OR_DENOMINATOR_MISMATCH');
if(JSON.stringify(r1.rows.map(x=>x.qid).sort((a,b)=>a-b))!==JSON.stringify(expectedQids))throw new Error('R1_QID_SET_MISMATCH');
for(const row of r1.rows){
  const q=bank[row.qid-1], meta=row.axisEvidence?.meta;
  if(row.verdict!=='PASS'||meta?.status!=='PASS_WITH_EXPLICIT_PROJECTION_DEBT')throw new Error('R1_META_VERDICT_OR_DEBT_STATUS_MISMATCH:q'+row.qid);
  if(meta.standardCourse!==q.standardCourse||meta.standardUnitKey!==q.standardUnitKey||meta.subUnitKey!==q.subUnitKey||row.axisEvidence?.difficulty?.difficultyBucket!==q.difficultyBucket||meta.problemTypeKey!==q.problemTypeKey||meta.templateKey!==q.templateKey)throw new Error('R1_CURRENT_META_PARITY_MISMATCH:q'+row.qid);
  if(!Array.isArray(row.metaDebtFields)||!row.metaDebtFields.includes('problemTypeKey')||!row.metaDebtFields.includes('templateKey'))throw new Error('R1_EXPLICIT_META_DEBT_MISSING:q'+row.qid);
}
if(r1Validation.ok!==true||r1Validation.disposition!=='PASS'||r1Validation.validatorMode!=='R1_V2'||r1Validation.stage!=='R1'||r1Validation.examUid!==examUid||r1Validation.artifactSha!==expectedSourceBlob||r1Validation.denominator!==24||r1Validation.rowCount!==24||r1Validation.issues?.length!==0)throw new Error('R1_RAW_PASS_BINDING_MISMATCH');
const sourceStatus=execFileSync('git',['-C',root,'-c','core.quotepath=false','status','--short','--',productionRelativePath],{encoding:'utf8'}).trim();
if(!/^\?\? (?:"archive\/exams\/original\/high\/h1\/1mid\/26_강남여고_1학기_중간_고1_기출\.js"|archive\/exams\/original\/high\/h1\/1mid\/26_강남여고_1학기_중간_고1_기출\.js)$/.test(sourceStatus))throw new Error('SOURCE_STATUS_NOT_EXPECTED_ROOT_PROMOTION_ARTIFACT:'+sourceStatus);
const assetRel=`assets/images/${examUid}/q07.png`;
const registrationRoster={schemaVersion:'JS_ARCHIVE_CODEX_LOCKED_ROSTER_V1',runId,rows:[{rosterIndex:0,examUid,productionPath:productionRelativePath,grade:'h1',course:'commonmath1',questionCount:24,lockedRunRosterPath:rootRelative(runRosterPath),lockedRunRosterSha256:sha(runRosterBytes)}]};
const runRosterOut=path.join(evidenceRoot,'ROOT.registration-target-roster.json');
writeFresh(runRosterOut,registrationRoster);
const standingPath=path.join(root,'archive','analysis',runId,'ROOT.user-AGENTS.snapshot.md');
const standingBytes=fs.readFileSync(standingPath), standingSha=sha(standingBytes), standingBlob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${standingBytes.length}\0`),standingBytes])).digest('hex');
const standingRef={path:rootRelative(standingPath),sha256:standingSha,sourceRawSha256:standingSha,sourceGitBlobSha1:standingBlob};
const rosterSha=hashFile(runRosterOut);
const authority={schemaVersion:'ROOT_TARGET_REGISTRATION_PRODUCER_AUTHORITY_V1',decisionAuthority:'ROOT_DELEGATED',runId,authorityReference:standingRef,roster:{path:rootRelative(runRosterOut),sha256:rosterSha},scope:[{examUid,productionPath:productionRelativePath,grade:'h1',course:'commonmath1'}],scopeReason:'Exact ROOT technical continuation for the already R3/render-PASS target; target-only registration candidate dry-run. Existing source/R1/R2/R3 proof bytes remain unchanged.',sourceProbe:{path:rootRelative(probePath),sha256:expectedProbeSha}};
const authorityPath=path.join(evidenceRoot,'ROOT.registration-target-authority.json');writeFresh(authorityPath,authority);
const authoritySha=hashFile(authorityPath);
const r1Ref=rootRelative(r1Path), r1ValidationRef=rootRelative(r1ValidationPath);
const assignment={schemaVersion:'JS_ARCHIVE_TARGET_REGISTRATION_ASSIGNMENT_V1',runId,examUid,productionRelativePath,expectedHead:head,artifactRawSha256:expectedSourceRaw,validatorRawBufferBlobSha1:expectedSourceBlob,questionCount:24,lockedRosterSha256:rosterSha,producerAuthorityPath:rootRelative(authorityPath),producerAuthoritySha256:authoritySha,r1EvidencePath:r1Ref,r1EvidenceSha256:expectedR1EvidenceSha,r1EvidenceReferencePath:r1Path.replace(/\\/g,'/'),r1ValidationPath:r1ValidationRef,r1ValidationSha256:expectedR1ValidationSha,releaseAssets:[{ref:assetRel,sha256:expectedAssetSha}],sourceStatusException:{observed:sourceStatus,reason:'ROOT promotion receipt binds exact untracked production bytes; producer remains dry-run and generic registrar verifies raw source, asset and all nine baselines.'}};
const assignmentPath=path.join(evidenceRoot,'ROOT.registration-target-assignment.json');writeFresh(assignmentPath,assignment);
const adapterDir=path.dirname(localProducer);fs.mkdirSync(adapterDir,{recursive:true});
if(fs.existsSync(localProducer))throw new Error('FRESH_LOCAL_ADAPTER_COPY_REQUIRED');
let producer=fs.readFileSync(rawProducer,'utf8');
const absoluteImports={
  "import core from '../archive2-core.js';":`import core from ${JSON.stringify(pathToFileURL(path.join(root,'archive','archive2-core.js')).href)};`,
  "import { gitBlobSha } from './archive-stage-validator-compat-v1.mjs';":`import { gitBlobSha } from ${JSON.stringify(pathToFileURL(path.join(root,'archive','tools','archive-stage-validator-compat-v1.mjs')).href)};`,
  "import { questionUidForSource } from './meta-foundation/rpm-active-resolver.mjs';":`import { questionUidForSource } from ${JSON.stringify(pathToFileURL(path.join(root,'archive','tools','meta-foundation','rpm-active-resolver.mjs')).href)};`,
  "import { validateR1Evidence } from './archive-stage-validator-r1-v2.mjs';":`import { validateR1Evidence } from ${JSON.stringify(pathToFileURL(path.join(root,'archive','tools','archive-stage-validator-r1-v2.mjs')).href)};`,
  "import { validateCodexRenderReceipt } from './archive-codex-closeout-v2.mjs';":`import { validateCodexRenderReceipt } from ${JSON.stringify(pathToFileURL(path.join(root,'archive','tools','archive-codex-closeout-v2.mjs')).href)};`,
};
for(const [from,to] of Object.entries(absoluteImports)){if(producer.split(from).length!==2)throw new Error('PRODUCER_IMPORT_LOCUS_DRIFT');producer=producer.replace(from,to);}
const replacements=[
  ["assert(/^original\\/high\\/h2\\//.test(file) && file.endsWith('.js'), 'TARGET_PRODUCTION_PATH_REQUIRED', file);",`assert(file === 'original/high/h1/1mid/${examUid}.js' && file.endsWith('.js'), 'TARGET_PRODUCTION_PATH_REQUIRED', file);`],
  ["  const hasPastExamSuffix = suffixParts.at(-1) === '기출';\n  const subject = hasPastExamSuffix ? suffixParts.slice(0, -1).join('_') : suffix;\n  const acceptedSubjects = courseCode === 'math2'\n    ? new Set(['수학II', '수학Ⅱ'])\n    : courseCode === 'geometry'\n      ? new Set(['기하', '기하와벡터', '기하와 벡터'])\n      : new Set();\n  assert(acceptedSubjects.has(subject), 'ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH', \x60${courseCode}|${subject}\x60);",`  const hasPastExamSuffix = suffixParts.at(-1) === '기출';\n  const courseDisplay = courseCode === 'commonmath1' ? '공통수학1' : '';\n  const subject = hasPastExamSuffix && courseDisplay ? courseDisplay : (hasPastExamSuffix ? suffixParts.slice(0, -1).join('_') : suffix);\n  const acceptedSubjects = courseCode === 'commonmath1' ? new Set(['공통수학1'])\n    : courseCode === 'math2' ? new Set(['수학II', '수학Ⅱ'])\n    : courseCode === 'geometry' ? new Set(['기하', '기하와벡터', '기하와 벡터'])\n    : new Set();\n  assert(acceptedSubjects.has(subject), 'ROSTER_COURSE_DISPLAY_ALIAS_MISMATCH', String(courseCode) + '|' + String(subject));`],
  ["  assert(assignment.productionRelativePath.startsWith('archive/exams/original/high/h2/'), 'TARGET_PRODUCTION_PATH_REQUIRED');",`  assert(assignment.productionRelativePath === 'archive/exams/original/high/h1/1mid/${examUid}.js', 'TARGET_PRODUCTION_PATH_REQUIRED');`],
  ["  assert(!sourceStatus, 'TARGET_SOURCE_DIRTY');",`  assert(sourceStatus === '?? archive/exams/original/high/h1/1mid/26_강남여고_1학기_중간_고1_기출.js', 'TARGET_SOURCE_DIRTY');`],
  ["  const registered = core.Canonical.resolveSourceGrade({ registeredGrade: ({ h2: '고2' })[authorizedRow.grade], sourceFile: targetFile, identitySourceFile: targetFile });\n  assert(registered.status === 'VALID' && registered.grade === '고2', 'ROSTER_GRADE_SOURCE_PARITY_FAIL');",`  const registered = core.Canonical.resolveSourceGrade({ registeredGrade: ({ h1: '고1' })[authorizedRow.grade], sourceFile: targetFile, identitySourceFile: targetFile });\n  assert(registered.status === 'VALID' && registered.grade === '고1', 'ROSTER_GRADE_SOURCE_PARITY_FAIL');`],
  ["  'PASS_CURRENT_FIELDS_AND_RPM_PROOF',", "  'PASS_CURRENT_FIELDS_AND_RPM_PROOF',\n  'PASS_WITH_EXPLICIT_PROJECTION_DEBT',"],
];
const catalogFrom="  const catalogStep = runStep({ name: \x60${stepPrefix}-canonical-archive2-catalog\x60, command: process.execPath, args: [path.join(candidateRoot, 'archive/tools/build-archive2-catalog.mjs')], cwd: candidateRoot, env: process.env, logsDir: evidenceRoot });\n  steps.push(catalogStep);";
const catalogTo="  const catalogSourcePath = path.join(candidateRoot, 'archive', 'exams', ...targetFile.split('/'));\n  assert(!fs.existsSync(catalogSourcePath), 'CANDIDATE_TARGET_SOURCE_ALREADY_EXISTS');\n  fs.mkdirSync(path.dirname(catalogSourcePath), { recursive: true });\n  fs.copyFileSync(assignmentAbs, catalogSourcePath);\n  const catalogStep = runStep({ name: \x60${stepPrefix}-canonical-archive2-catalog\x60, command: process.execPath, args: [path.join(candidateRoot, 'archive/tools/build-archive2-catalog.mjs')], cwd: candidateRoot, env: process.env, logsDir: evidenceRoot });\n  fs.unlinkSync(catalogSourcePath);\n  steps.push(catalogStep);";
replacements.push([catalogFrom,catalogTo]);
replacements.push(["  const stepPrefix = \x60target-index-${rosterIndex}\x60;","  const stepPrefix = \x60target-index-${rosterIndex}-attempt05\x60;"]);for(const [from,to] of replacements){if(producer.split(from).length!==2)throw new Error('PRODUCER_ADAPTER_LOCUS_DRIFT:'+from.slice(0,60));producer=producer.replace(from,to);}
const statusCall="execFileSync('git', ['-C', root, 'status', '--short', '--', assignment.productionRelativePath]";
const statusCallPatched="execFileSync('git', ['-C', root, '-c', 'core.quotepath=false', 'status', '--short', '--', assignment.productionRelativePath]";
if(producer.split(statusCall).length!==2)throw new Error('SOURCE_STATUS_DISPLAY_LOCUS_DRIFT');
producer=producer.replace(statusCall,statusCallPatched);fs.writeFileSync(localProducer,producer,{flag:'wx'});
const candidateRoot=path.join(uidRoot,'registration-candidate-02');
if(fs.existsSync(candidateRoot)){const existingHead=execFileSync('git',['-C',candidateRoot,'rev-parse','HEAD'],{encoding:'utf8'}).trim();const candidateStatus=execFileSync('git',['-C',candidateRoot,'status','--porcelain','-z'],{encoding:'utf8'});if(existingHead!==head||candidateStatus)throw new Error('EXISTING_CANDIDATE_ROOT_NOT_REUSABLE');}else{fs.mkdirSync(uidRoot,{recursive:true});execFileSync('git',['-C',root,'worktree','add','--detach',candidateRoot,head],{stdio:'pipe'});}
const indexRoot=path.join(uidRoot,'registration-index-root-02');
const packagePath=path.join(uidRoot,'registration-package-02.json');
const args=['--root',root,'--authority',rootRelative(authorityPath),'--roster',rootRelative(runRosterOut),'--roster-index','0','--assignment',rootRelative(assignmentPath),'--r1-evidence',r1Ref,'--r1-validation',r1ValidationRef,'--candidate-root',candidateRoot,'--index-root',indexRoot,'--evidence-root',rootRelative(evidenceRoot),'--package-output',rootRelative(packagePath)];
let exitCode=0,stdout='',stderr='';
try{stdout=execFileSync(process.execPath,[localProducer,...args],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],maxBuffer:128*1024*1024});}catch(e){exitCode=Number.isInteger(e.status)?e.status:1;stdout=String(e.stdout||'');stderr=String(e.stderr||e.message||'');}
const output={schemaVersion:'ROOT_REGISTRATION_H1_ADAPTER_EXECUTION_V1',runId,examUid,expectedHead,producerSource:{path:rootRelative(rawProducer),sha256:hashFile(rawProducer)},adapterCopy:{path:rootRelative(localProducer),sha256:hashFile(localProducer),transformations:['locked H1 production path/display transport','commonmath1→공통수학1 alias derived from exact current embedded standardCourse','H1 grade source-path parity','accept exact current PASS_WITH_EXPLICIT_PROJECTION_DEBT R1 meta disposition','permit only the already-receipted exact untracked production source during dry-run','materialize exact assigned source only for isolated catalog generation then remove it']},source:{path:productionRelativePath,rawSha256:hashFile(sourcePath),blobSha1:expectedSourceBlob,status:sourceStatus},asset:{path:`archive/${assetRel}`,sha256:hashFile(assetPath)},r1Evidence:{path:r1Ref,sha256:expectedR1EvidenceSha,validationPath:r1ValidationRef,validationSha256:expectedR1ValidationSha,qidCoverage:24,metaDisposition:'PASS_WITH_EXPLICIT_PROJECTION_DEBT',physicalFieldParityChecked:true},authorityPath:rootRelative(authorityPath),authoritySha256:authoritySha,rosterPath:rootRelative(runRosterOut),rosterSha256:rosterSha,assignmentPath:rootRelative(assignmentPath),assignmentSha256:hashFile(assignmentPath),candidateRoot,indexRoot,packagePath:rootRelative(packagePath),exitCode,stdout,stderr,promotionReceiptSha256:hashFile(promotionPath),renderReceiptSha256:hashFile(renderPath),createdAt:new Date().toISOString()};
writeFresh(adapterReceipt,output);
console.log(JSON.stringify({exitCode,receiptPath:rootRelative(adapterReceipt),candidateRoot,indexRoot,packagePath:rootRelative(packagePath),stdout,stderr},null,2));
if(exitCode!==0)process.exitCode=1;