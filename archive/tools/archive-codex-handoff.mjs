import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync, spawnSync} from 'node:child_process';
import {QUALITY_CONTRACT_V2} from './archive-stage-validator-artifact-v2.mjs';
import {gitBlobSha} from './archive-stage-validator-compat-v1.mjs';
import {disclosePostfreeze, normalizeStudentBundle, studentAssetRefs, STUDENT_FIELDS} from './archive-student-bundle.mjs';
import {acceptStage, transitionFile} from './archive-codex-dispatcher.mjs';
import {inside, physical, readExam, sha256, writeFresh} from './archive-codex-artifact-io.mjs';

const stages = new Set(['CREATE','R1','R2','R3']);
const absolute = (p, label) => { if(typeof p!=='string'||!path.isAbsolute(p)) throw Error(`${label}_ABSOLUTE_PATH_REQUIRED`); return path.resolve(p); };
const json = p => JSON.parse(fs.readFileSync(p,'utf8'));
const same = (a,b) => JSON.stringify(a)===JSON.stringify(b);
const within = (root,p) => {const rel=path.relative(root,p);return rel!== '..'&&!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel);};
function currentHead(root){return execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();}
function canonicalAssetRoot(jsFile, assetRoot){
  const ar=fs.realpathSync(absolute(assetRoot,'ASSET_ROOT'));
  if(!fs.statSync(ar).isDirectory()||path.basename(ar).toLowerCase()==='assets') throw Error('ASSET_ROOT_MUST_BE_ASSETS_PARENT_DIRECTORY');
  const js=fs.realpathSync(absolute(jsFile,'WORKING_JS'));
  if(ar===js||path.relative(ar,js)==='' ) throw Error('ASSET_ROOT_CANNOT_BE_JS_FILE');
  const assetsDir=path.join(ar,'assets');
  if(!fs.existsSync(assetsDir)||!fs.statSync(assetsDir).isDirectory()) throw Error('ASSET_ROOT_ASSETS_CHILD_REQUIRED');
  return ar;
}
function checkedAssetParent(assetRoot){
  const ar=fs.realpathSync(absolute(assetRoot,'ASSET_ROOT'));
  if(!fs.statSync(ar).isDirectory()||path.basename(ar).toLowerCase()==='assets'||!fs.existsSync(path.join(ar,'assets'))||!fs.statSync(path.join(ar,'assets')).isDirectory()) throw Error('ASSET_ROOT_MUST_BE_ASSETS_PARENT_DIRECTORY');
  return ar;
}
function assertDeclaredAssetPaths(input,assetRoot){
  const rows=input?.rows||input?.questions;
  if(!Array.isArray(rows))throw Error('STUDENT_ROWS_REQUIRED');
  for(const row of rows){
    const assets=row.assets||row.requiredAssets||[];
    for(const a of assets){
      const ref=String(a.ref||'').replaceAll('\\','/');
      if(!ref.startsWith('assets/')||ref.split('/').some(p=>!p||p==='.'||p==='..'||p.includes(':')))throw Error(`ASSET_REF_INVALID:${ref}`);
      const expected=inside(assetRoot,ref);
      if(typeof a.path!=='string'||!path.isAbsolute(a.path))throw Error(`ASSET_ABSOLUTE_PATH_REQUIRED:${ref}`);
      const declared=fs.realpathSync(a.path),actual=fs.realpathSync(expected);
      if(declared!==actual)throw Error(`ASSET_DECLARED_PATH_MISMATCH:${ref}`);
    }
  }
}
function normalizeSafeBundle(input,{inputFile,expectedSourceRawSha256,assetRoot}){
  assertDeclaredAssetPaths(input,assetRoot);
  const bundle=normalizeStudentBundle(input,{inputFile,expectedSourceRawSha256});
  checkBoundAssets(bundle,assetRoot);
  return bundle;
}
function extractCurrentStudentBundle(sourceFile,assetRoot,exam=readExam(sourceFile)){
  const choiceFields=new Set(['text','content','value','answer']),rows=[];
  const refs=new Set();
  for(const q of exam.questions){
    const qid=Number(q.id??q.qid);if(!Number.isInteger(qid)||qid<1)throw Error('CURRENT_SOURCE_QID_INVALID');
    const student=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));
    if(student.id===undefined)student.id=qid;
    if(Array.isArray(student.choices))student.choices=student.choices.map(choice=>choice&&typeof choice==='object'&&!Array.isArray(choice)?Object.fromEntries(Object.entries(choice).filter(([k])=>choiceFields.has(k))):choice);
    for(const ref of studentAssetRefs(student))refs.add(ref);
    rows.push({qid,student,assets:[]});
  }
  const queue=[...refs],assetsByRef=new Map();
  for(let i=0;i<queue.length;i++){
    const ref=String(queue[i]).replaceAll('\\','/');
    if(!ref.startsWith('assets/')||ref.split('/').some(p=>!p||p==='.'||p==='..'||p.includes(':')))throw Error(`CURRENT_SOURCE_ASSET_REF_INVALID:${ref}`);
    if(assetsByRef.has(ref))continue;
    const file=inside(assetRoot,ref),bytes=fs.readFileSync(file),asset={ref,path:file,sha256:sha256(bytes)};
    assetsByRef.set(ref,asset);
    if(ref.toLowerCase().endsWith('.svg'))for(const m of bytes.toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)/gi)){
      const target=m[1];if(/^(?:data:|#)/.test(target))continue;
      const dep=path.posix.normalize(path.posix.join(path.posix.dirname(ref),target));if(!refs.has(dep)){refs.add(dep);queue.push(dep);}
    }
  }
  // Attach transitive dependencies to every question whose student fields reference their parent SVG.
  for(const row of rows){
    const direct=new Set(studentAssetRefs(row.student)),needed=new Set(direct),pending=[...direct];
    for(let i=0;i<pending.length;i++){
      const ref=pending[i],asset=assetsByRef.get(ref);if(!asset||!ref.toLowerCase().endsWith('.svg'))continue;
      const bytes=fs.readFileSync(asset.path);
      for(const m of bytes.toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)/gi)){const target=m[1];if(/^(?:data:|#)/.test(target))continue;const dep=path.posix.normalize(path.posix.join(path.posix.dirname(ref),target));if(!needed.has(dep)){needed.add(dep);pending.push(dep);}}
    }
    row.assets=[...needed].map(ref=>{const asset=assetsByRef.get(ref);if(!asset)throw Error(`CURRENT_SOURCE_ASSET_MISSING:${ref}`);return asset;});
  }
  const raw={schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:rows.length,qids:rows.map(r=>r.qid),rows};
  return {exam,bundle:normalizeSafeBundle(raw,{expectedSourceRawSha256:exam.rawSha256,assetRoot})};
}
function checkBoundAssets(bundle, assetRoot){
  const issues=[];
  for(const row of bundle.rows) for(const asset of row.assets){
    const ref=String(asset.ref).replaceAll('\\','/');
    if(!ref.startsWith('assets/')||ref.split('/').some(p=>!p||p==='.'||p==='..'||p.includes(':'))) { issues.push(`ASSET_REF_INVALID:${ref}`); continue; }
    let file;try{file=inside(assetRoot,ref);}catch(e){issues.push(`ASSET_PATH_ESCAPE:${ref}:${e.message}`);continue;}
    const rel=path.relative(assetRoot,file);
    if(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel)){issues.push(`ASSET_PATH_ESCAPE:${ref}`);continue;}
    try {if(physical(file).sha256!==asset.sha256) issues.push(`ASSET_SHA_CHANGED:${ref}`);} catch {issues.push(`ASSET_MISSING:${ref}`);}
  }
  if(issues.length) throw Error(issues.join('|'));
}
export function validateEvidenceCoverage({stage,evidence,qids}){
  const all=[...qids].map(Number),valid=new Set(all);
  if(new Set(all).size!==all.length||all.some(q=>!Number.isInteger(q)))throw Error('CURRENT_BUNDLE_QID_SET_INVALID');
  const rows=evidence?.rows;
  if(!Array.isArray(rows))throw Error('EVIDENCE_ROWS_REQUIRED');
  const observed=rows.map(r=>Number(r?.qid));
  if(observed.some(q=>!Number.isInteger(q))||new Set(observed).size!==observed.length||observed.some(q=>!valid.has(q)))throw Error('EVIDENCE_QID_SCOPE_INVALID');
  if(stage==='R3'){
    const scope=evidence.targetedScope||{},array=v=>Array.isArray(v)?v:[],targeted=[...new Set([...array(scope.openFindingQids),...array(scope.changedQids),...array(scope.directDependencyQids)].map(Number).filter(Number.isInteger))].sort((a,b)=>a-b);
    if(targeted.some(q=>!valid.has(q))||!same([...observed].sort((a,b)=>a-b),targeted))throw Error('R3_TARGETED_QID_COVERAGE_MISMATCH');
    const dispositions=evidence.artifactDispositions;
    if(!dispositions||dispositions.artifactSha!==evidence.artifactSha||!Array.isArray(dispositions.rows))throw Error('R3_FULL_ARTIFACT_DISPOSITIONS_REQUIRED');
    const dispositionQids=dispositions.rows.map(r=>Number(r?.qid));
    if(dispositionQids.some(q=>!Number.isInteger(q))||new Set(dispositionQids).size!==dispositionQids.length||!same(dispositionQids.slice().sort((a,b)=>a-b),all.slice().sort((a,b)=>a-b)))throw Error('R3_FULL_ARTIFACT_DISPOSITION_DENOMINATOR_REQUIRED');
    return {targetedQids:[...observed].sort((a,b)=>a-b),fullQids:all.length};
  }
  if(!same(observed.slice().sort((a,b)=>a-b),all.slice().sort((a,b)=>a-b)))throw Error('EVIDENCE_FULL_QID_DENOMINATOR_REQUIRED');
  return {targetedQids:all,fullQids:all.length};
}

/** Hash-only source binding: deliberately never parses answer-bearing JS. */
export function preflightHandoff({assignmentFile, receiptFile, root:rootArg, workingJsFile, assetRoot:assetRootArg, bundleFile, evidenceFile, rawReportFile, reviewerCanonicalId, expectedQids}){
  const assignmentPath=absolute(assignmentFile,'ASSIGNMENT'), receiptPath=absolute(receiptFile,'RECEIPT');
  const assignment=json(assignmentPath), receipt=json(receiptPath);
  const root=fs.realpathSync(absolute(rootArg||assignment.worktreeRootAbsolute,'WORKTREE_ROOT'));
  const source=fs.realpathSync(absolute(workingJsFile||assignment.workingJsAbsolute,'WORKING_JS'));
  const assets=canonicalAssetRoot(source,assetRootArg||assignment.assetRootAbsolute);
  if(!within(root,source)||!within(root,assets)||!within(root,fs.realpathSync(assignmentPath))||!within(root,fs.realpathSync(receiptPath))) throw Error('ASSIGNMENT_INPUT_OUTSIDE_WORKTREE');
  const evidence=fs.realpathSync(absolute(evidenceFile||assignment.evidenceAbsolute,'EVIDENCE'));
  const reportPath=rawReportFile||assignment.rawReportAbsolute?fs.realpathSync(absolute(rawReportFile||assignment.rawReportAbsolute,'RAW_REPORT')):null;
  const capturePath=assignment.validatorCaptureAbsolute?fs.realpathSync(absolute(assignment.validatorCaptureAbsolute,'VALIDATOR_CAPTURE')):null;
  const bundlePath=fs.realpathSync(absolute(bundleFile||assignment.studentBundleAbsolute,'STUDENT_BUNDLE'));
  const originalFreezePath=assignment.originalFreezeAbsolute?fs.realpathSync(absolute(assignment.originalFreezeAbsolute,'ORIGINAL_FREEZE')):null;
  const evidenceRoot=fs.realpathSync(absolute(assignment.evidenceRootAbsolute,'EVIDENCE_ROOT'));
  if(![evidenceRoot,evidence,bundlePath,...[reportPath,capturePath,originalFreezePath].filter(Boolean)].every(p=>within(root,p)))throw Error('ASSIGNED_INPUT_OUTSIDE_WORKTREE');
  const evidenceRel=path.relative(evidenceRoot,evidence),reportRel=reportPath?path.relative(evidenceRoot,reportPath):null,captureRel=capturePath?path.relative(evidenceRoot,capturePath):null;
  const outOfRoot=rel=>rel&&(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel));
  if(outOfRoot(evidenceRel)||outOfRoot(reportRel)||outOfRoot(captureRel)) throw Error('EVIDENCE_OUTSIDE_ASSIGNED_ROOT');
  const assignedPaths={worktreeRootAbsolute:root,workingJsAbsolute:source,assetRootAbsolute:assets,evidenceRootAbsolute:evidenceRoot,evidenceAbsolute:evidence,studentBundleAbsolute:bundlePath};
  if(reportPath)assignedPaths.rawReportAbsolute=reportPath;
  if(capturePath)assignedPaths.validatorCaptureAbsolute=capturePath;
  if(originalFreezePath)assignedPaths.originalFreezeAbsolute=originalFreezePath;
  for(const [k,v] of Object.entries(assignedPaths)){
    if(assignment[k]!==v) throw Error(`ASSIGNMENT_PATH_MISMATCH:${k}`);
  }
  if(!reportPath&&!capturePath)throw Error('RAW_REPORT_OR_VALIDATOR_CAPTURE_REQUIRED');
  if(receipt.schemaVersion!=='JS_ARCHIVE_CODEX_HANDOFF_ASSIGNMENT_RECEIPT_V1'||receipt.assignmentSha256!==physical(assignmentPath).sha256) throw Error('ASSIGNMENT_RECEIPT_BINDING_INVALID');
  if(receipt.worktreeRootAbsolute!==root||receipt.expectedHead!==assignment.expectedHead||receipt.sourceRawSha256!==assignment.expectedSourceRawSha256) throw Error('ASSIGNMENT_RECEIPT_IDENTITY_MISMATCH');
  const head=currentHead(root); if(head!==assignment.expectedHead||receipt.actualHead!==head) throw Error('ASSIGNED_HEAD_MISMATCH');
  if(!stages.has(assignment.stage)||!assignment.examUid||assignment.qualityContractVersion!==QUALITY_CONTRACT_V2||assignment.executionLine!=='CODEX') throw Error('CURRENT_CODEX_ASSIGNMENT_REQUIRED');
  const role='archive_'+assignment.stage.toLowerCase();
  if(assignment.reviewerIdentity?.role!==role||!assignment.reviewerIdentity?.reviewerId||assignment.reviewerIdentity.reviewerId!==reviewerCanonicalId||receipt.reviewerCanonicalId!==reviewerCanonicalId) throw Error('CANONICAL_REVIEWER_ID_MISMATCH');
  if(assignment.reviewerIdentity.displayPrefix&&assignment.reviewerIdentity.displayPrefix===reviewerCanonicalId) throw Error('DISPLAY_PREFIX_CANNOT_AUTHORIZE_REVIEWER');
  const src=physical(source),bytes=fs.readFileSync(source),blob=gitBlobSha(bytes);
  if(src.sha256!==assignment.expectedSourceRawSha256||receipt.sourceRawSha256!==src.sha256||receipt.sourceRawBufferBlobSha1!==blob) throw Error('ASSIGNED_SOURCE_HASH_MISMATCH');
  const bundle=normalizeSafeBundle(json(bundlePath),{inputFile:bundlePath,expectedSourceRawSha256:src.sha256,assetRoot:assets});
  const qids=expectedQids||assignment.qids;
  if(!Array.isArray(qids)||!same(bundle.qids,qids)||bundle.questionCount!==assignment.questionCount||bundle.qids.length!==assignment.questionCount) throw Error('FULL_STUDENT_BUNDLE_QID_DENOMINATOR_REQUIRED');
  const ev=json(evidence);
  let capture=null,capturedStdout=null,reportBytes;
  if(capturePath){capture=json(capturePath);capturedStdout=Buffer.from(capture.stdoutBase64||'','base64');if(capture.schemaVersion!=='JS_ARCHIVE_CODEX_VALIDATOR_PROCESS_CAPTURE_V1')throw Error('CANONICAL_VALIDATOR_PROCESS_CAPTURE_INVALID');reportBytes=capturedStdout;}
  if(reportPath){const raw=fs.readFileSync(reportPath);if(capturedStdout&&!capturedStdout.equals(raw))throw Error('CAPTURED_RAW_REPORT_BYTES_MISMATCH');reportBytes=raw;}
  let report;try{report=JSON.parse(reportBytes.toString('utf8'));}catch{throw Error('RAW_GENERIC_REPORT_JSON_REQUIRED');}
  if(ev.schemaVersion!=='JS_ARCHIVE_STAGE_EVIDENCE_v2'||ev.qualityContractVersion!==QUALITY_CONTRACT_V2||ev.executionLine!=='CODEX'||ev.examUid!==assignment.examUid||ev.stage!==assignment.stage||ev.artifactSha!==blob) throw Error('CURRENT_EVIDENCE_BINDING_REQUIRED');
  validateEvidenceCoverage({stage:assignment.stage,evidence:ev,qids});
  if(report.ok!==true||report.disposition!=='PASS'||report.stage!==assignment.stage||report.examUid!==assignment.examUid||report.executionLine!=='CODEX'||report.qualityContractVersion!==QUALITY_CONTRACT_V2||report.validatorMode!==assignment.stage+'_V2'||!Array.isArray(report.issues)||report.issues.length||report.artifactSha!==blob||report.artifactContract?.active!==true||report.artifactContract?.disposition!=='PASS'||!Array.isArray(report.artifactContract.issues)||report.artifactContract.issues.length||report.artifactContract.questionCount!==qids.length||!report.common||report.common.commonValid!==true) throw Error('ACTUAL_RAW_GENERIC_REPORT_PASS_REQUIRED');
  if(!report.technicalBinding||report.technicalBinding.source?.sha256!==src.sha256||report.technicalBinding.source?.rawBufferGitBlobSha1!==blob||report.technicalBinding.evidence?.sha256!==physical(evidence).sha256) throw Error('RAW_REPORT_PHYSICAL_BINDING_STALE');
  let executionProvenance='UNPROVEN';
  if(capture){
    const arg=(name)=>{const i=capture.argv?.indexOf(name);return i>=0?capture.argv[i+1]:null;};
    const validCommand=Array.isArray(capture.argv)&&path.resolve(capture.argv[0])===path.resolve(path.dirname(fileURLToPath(import.meta.url)),'archive-stage-validator.mjs')&&arg('--exam')===source&&arg('--evidence')===evidence&&arg('--stage')===assignment.stage&&arg('--asset-root')===assets&&capture.argv.includes('--quality-contract')&&arg('--quality-contract')===QUALITY_CONTRACT_V2&&capture.argv.includes('--execution-line')&&arg('--execution-line')==='CODEX'&&capture.argv.includes('--json');
    if(capture.exitCode!==0||!validCommand||capture.actualValidatorInvocation!==true||capture.cwd!==root||capture.sourceRawSha256!==src.sha256||capture.sourceRawBufferBlobSha1!==blob||capture.evidence?.sha256!==physical(evidence).sha256||capture.bundle?.sha256!==physical(bundlePath).sha256||capture.assetRoot!==assets) throw Error('CANONICAL_VALIDATOR_PROCESS_CAPTURE_INVALID');
    if(['R1','R2'].includes(assignment.stage)){
      if(!originalFreezePath||!assignment.originalFreezeSha256||!capture.originalFreeze||capture.originalFreeze.path!==originalFreezePath||capture.originalFreeze.sha256!==assignment.originalFreezeSha256||physical(originalFreezePath).sha256!==assignment.originalFreezeSha256)throw Error('ORIGINAL_FREEZE_PROCESS_BINDING_REQUIRED');
      const freeze=json(originalFreezePath);
      if(freeze.studentBundle?.path!==capture.originalStudentBundle?.path||freeze.studentBundle?.sha256!==capture.originalStudentBundle?.sha256)throw Error('ORIGINAL_STUDENT_BUNDLE_PROCESS_BINDING_REQUIRED');
      const oldPath=fs.realpathSync(absolute(freeze.studentBundle.path,'ORIGINAL_STUDENT_BUNDLE'));
      if(oldPath!==capture.originalStudentBundle.path||physical(oldPath).sha256!==freeze.studentBundle.sha256)throw Error('ORIGINAL_STUDENT_BUNDLE_BINDING_INVALID');
      const old=normalizeSafeBundle(json(oldPath),{inputFile:oldPath,expectedSourceRawSha256:freeze.sourceRawSha256,assetRoot:assets});
      if(!same(old.qids,bundle.qids)||!same(old.rows.map(r=>r.studentPayloadSha256),bundle.rows.map(r=>r.studentPayloadSha256))||!same(old.rows.map(r=>r.assets.map(a=>[a.ref,a.sha256]).sort()),bundle.rows.map(r=>r.assets.map(a=>[a.ref,a.sha256]).sort())))throw Error('CURRENT_STUDENT_INPUT_CHANGED_SINCE_FREEZE');
    }
    const parsed=JSON.parse(capturedStdout.toString('utf8'));
    if(!same(parsed,report)) throw Error('CAPTURED_RAW_REPORT_BYTES_MISMATCH');
    executionProvenance='PROCESS_CAPTURED';
  }
  return {ok:true,disposition:'STRUCTURE_BOUND',stage:assignment.stage,examUid:assignment.examUid,head,sourceRawSha256:src.sha256,sourceRawBufferBlobSha1:blob,cleanFilterBlobSha1:ev.technicalHashes?.gitCleanFilterBlobSha1??null,qids:bundle.qids,questionCount:bundle.questionCount,requiredAssets:[...new Set(bundle.rows.flatMap(r=>r.assets.map(a=>a.ref)))],reviewerCanonicalId,rawReport:reportPath?physical(reportPath):{path:capturePath,sha256:sha256(reportBytes),capturedStdout:true},rawReportDisposition:report.disposition,executionProvenance,semanticVerdictCreated:false,answerBearingSourceParsed:false};
}

/** One shot only. Captured process output is one immutable file; this does not retry or bless a failed report. */
export function runCanonicalValidatorCapture({root,workingJsFile,evidenceFile,bundleFile,assetRoot,stage,expectedSourceRawSha256,freezeFile,freezeSha256,output}){
  const repo=fs.realpathSync(absolute(root,'WORKTREE_ROOT')),source=fs.realpathSync(absolute(workingJsFile,'WORKING_JS')),evidencePath=fs.realpathSync(absolute(evidenceFile,'EVIDENCE')),bundlePath=fs.realpathSync(absolute(bundleFile,'STUDENT_BUNDLE')),assets=checkedAssetParent(assetRoot),dest=absolute(output,'CAPTURE_OUTPUT');
  if(!stages.has(stage)) throw Error('STAGE_REQUIRED');
  if(![source,evidencePath,bundlePath,assets,dest].every(p=>within(repo,p))) throw Error('VALIDATOR_INPUT_OR_OUTPUT_OUTSIDE_WORKTREE');
  if(fs.existsSync(dest)) throw Error('CAPTURE_OUTPUT_ALREADY_EXISTS');
  const bytes=fs.readFileSync(source),sourceSha=physical(source).sha256;
  if(sourceSha!==expectedSourceRawSha256) throw Error('ASSIGNED_SOURCE_HASH_MISMATCH');
  const ev=json(evidencePath),bundle=normalizeSafeBundle(json(bundlePath),{inputFile:bundlePath,expectedSourceRawSha256:sourceSha,assetRoot:assets});
  if(ev.qualityContractVersion!==QUALITY_CONTRACT_V2||ev.executionLine!=='CODEX'||ev.stage!==stage) throw Error('COMPLETE_CURRENT_STAGE_EVIDENCE_REQUIRED');
  validateEvidenceCoverage({stage,evidence:ev,qids:bundle.qids});
  let originalFreeze=null,originalBundle=null;
  if(stage==='R1'||stage==='R2'){
    if(!freezeFile||!freezeSha256)throw Error('PREFREEZE_VALIDATOR_RUN_FORBIDDEN');
    const freezePath=fs.realpathSync(absolute(freezeFile,'ORIGINAL_FREEZE'));
    if(!within(repo,freezePath))throw Error('ORIGINAL_FREEZE_OUTSIDE_WORKTREE');
    if(physical(freezePath).sha256!==freezeSha256) throw Error('PREFREEZE_VALIDATOR_RUN_FORBIDDEN');
    originalFreeze=json(freezePath);const frozenRows=originalFreeze.rows||originalFreeze.answers;
    if(originalFreeze.stage!==stage||!originalFreeze.sourceRawSha256||!originalFreeze.studentBundle?.path||!originalFreeze.studentBundle?.sha256||!same(originalFreeze.studentQidOrder?.map(Number),bundle.qids)||!Array.isArray(frozenRows)||frozenRows.length!==bundle.questionCount||new Set(frozenRows.map(r=>Number(r.qid))).size!==bundle.questionCount||bundle.qids.some(q=>!frozenRows.some(r=>Number(r.qid)===q))) throw Error('CURRENT_FULL_IMMUTABLE_FREEZE_REQUIRED');
    const originalBundlePath=fs.realpathSync(absolute(originalFreeze.studentBundle.path,'ORIGINAL_STUDENT_BUNDLE'));
    if(!within(repo,originalBundlePath)||physical(originalBundlePath).sha256!==originalFreeze.studentBundle.sha256)throw Error('ORIGINAL_STUDENT_BUNDLE_BINDING_INVALID');
    originalBundle=normalizeSafeBundle(json(originalBundlePath),{inputFile:originalBundlePath,expectedSourceRawSha256:originalFreeze.sourceRawSha256,assetRoot:assets});
    if(!same(originalBundle.qids,bundle.qids)||!same(originalBundle.rows.map(r=>r.studentPayloadSha256),bundle.rows.map(r=>r.studentPayloadSha256))||!same(originalBundle.rows.map(r=>r.assets.map(a=>[a.ref,a.sha256]).sort()),bundle.rows.map(r=>r.assets.map(a=>[a.ref,a.sha256]).sort())))throw Error('CURRENT_STUDENT_INPUT_CHANGED_SINCE_FREEZE');
    const currentSource=readExam(source),currentProjection=extractCurrentStudentBundle(source,assets,currentSource).bundle;
    if(currentSource.rawSha256!==sourceSha||!same(currentProjection.qids,bundle.qids)||!same(currentProjection.rows.map(r=>r.studentPayloadSha256),bundle.rows.map(r=>r.studentPayloadSha256))||!same(currentProjection.rows.map(r=>r.assets.map(a=>[a.ref,a.sha256]).sort()),bundle.rows.map(r=>r.assets.map(a=>[a.ref,a.sha256]).sort())))throw Error('CURRENT_BUNDLE_NOT_EXACT_SOURCE_PROJECTION');
  }
  const validator=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'archive-stage-validator.mjs');
  const argv=[validator,'--exam',source,'--evidence',evidencePath,'--stage',stage,'--quality-contract',QUALITY_CONTRACT_V2,'--execution-line','CODEX','--asset-root',assets,'--json'];
  const child=spawnSync(process.execPath,argv,{cwd:repo,encoding:null,maxBuffer:32*1024*1024});
  if(child.error) throw child.error;
  const capture={schemaVersion:'JS_ARCHIVE_CODEX_VALIDATOR_PROCESS_CAPTURE_V1',capturedAt:new Date().toISOString(),cwd:repo,executable:process.execPath,argv,exitCode:child.status??(child.signal?-1:1),signal:child.signal||null,stdoutBase64:Buffer.from(child.stdout||[]).toString('base64'),stderrBase64:Buffer.from(child.stderr||[]).toString('base64'),sourceRawSha256:sourceSha,sourceRawBufferBlobSha1:gitBlobSha(bytes),evidence:physical(evidencePath),bundle:physical(bundlePath),originalFreeze:originalFreeze?physical(freezeFile):null,originalStudentBundle:originalBundle?physical(originalFreeze.studentBundle.path):null,assetRoot:assets,actualValidatorInvocation:true};
  const ref=writeFresh(dest,capture);
  let parsed=null;try{parsed=JSON.parse(Buffer.from(capture.stdoutBase64,'base64').toString('utf8'));}catch{}
  return {captureRef:ref,exitCode:capture.exitCode,report:parsed,reportDisposition:parsed?.disposition||null,executionProvenance:'PROCESS_CAPTURED',passAsserted:false};
}

export function prepareStudentPacket({sourceFile,sourceRawSha256,bundleFile,assetRoot,output}){
  const source=fs.realpathSync(absolute(sourceFile,'WORKING_JS')),dest=absolute(output,'PACKET_OUTPUT'),assets=checkedAssetParent(assetRoot),sourceBinding=readExam(source);
  if(sourceBinding.rawSha256!==sourceRawSha256)throw Error('CURRENT_SOURCE_RAW_SHA_MISMATCH');
  const {bundle}=extractCurrentStudentBundle(source,assets,sourceBinding);
  if(bundleFile){
    const candidatePath=fs.realpathSync(absolute(bundleFile,'STUDENT_BUNDLE'));
    const candidate=normalizeSafeBundle(json(candidatePath),{inputFile:candidatePath,expectedSourceRawSha256:sourceBinding.rawSha256,assetRoot:assets});
    if(!same(candidate.qids,bundle.qids)||!same(candidate.rows.map(r=>r.studentPayloadSha256),bundle.rows.map(r=>r.studentPayloadSha256))||!same(candidate.rows.map(r=>r.assets.map(a=>[a.ref,a.sha256]).sort()),bundle.rows.map(r=>r.assets.map(a=>[a.ref,a.sha256]).sort())))throw Error('STUDENT_BUNDLE_NOT_EXACT_CURRENT_SOURCE_PROJECTION');
  }
  return {packet:bundle,ref:writeFresh(dest,bundle),qids:bundle.qids,questionCount:bundle.questionCount,sourceRawSha256:sourceBinding.rawSha256,sourceRawBufferBlobSha1:sourceBinding.rawBufferGitBlobSha1,extractedFromCurrentSource:true,answersIncluded:false};
}

export function acceptHandoffFile({root,stateFile,expectedStateSha256,eventFile,eventSha256}){
  const repo=fs.realpathSync(absolute(root,'WORKTREE_ROOT')),state=fs.realpathSync(absolute(stateFile,'DISPATCHER_STATE')),event=fs.realpathSync(absolute(eventFile,'SEALED_EVENT'));
  if(!within(repo,state)||!within(repo,event))throw Error('HANDOFF_STATE_OR_EVENT_OUTSIDE_WORKTREE');
  const result=transitionFile({stateFile:state,expectedStateSha256,mutate:s=>acceptStage(s,{root:repo,eventFile:event,eventSha256})});
  return {...result,acceptedEventSha256:eventSha256,nextRoster:result.nextDispatch};
}

export function discloseAfterFreeze({sourceFile,studentBundleFile,freezeFile,freezeSha256,qids,assetRoot,output}){
  const source=absolute(sourceFile,'WORKING_JS'),bundle=absolute(studentBundleFile,'STUDENT_BUNDLE'),freeze=absolute(freezeFile,'ORIGINAL_FREEZE'),dest=absolute(output,'DISCLOSURE_OUTPUT');
  if(physical(freeze).sha256!==freezeSha256) throw Error('ORIGINAL_FREEZE_SHA_REQUIRED');
  const assets=checkedAssetParent(assetRoot),original=json(freeze), student=normalizeSafeBundle(json(bundle),{inputFile:bundle,assetRoot:assets});
  if(original.stage!=='R1'&&original.stage!=='R2') throw Error('R1_R2_FREEZE_REQUIRED');
  if(original.studentBundle?.sha256!==physical(bundle).sha256) throw Error('FROZEN_STUDENT_BUNDLE_CHANGED');
  const result=disclosePostfreeze({sourceFile:source,studentBundleFile:bundle,freezeFile:freeze,freezeSha256,qids,output:dest});
  return result;
}

export function buildAffectedScopePlan({oldBundleFile,currentBundleFile,scopeQids,freezeFile,assetRoot,oldAssetRoot=assetRoot,currentAssetRoot=assetRoot,output}){
  if(!Array.isArray(scopeQids)||!scopeQids.length||new Set(scopeQids).size!==scopeQids.length) throw Error('AFFECTED_QID_SCOPE_REQUIRED');
  const oldPath=absolute(oldBundleFile,'OLD_BUNDLE'),currentPath=absolute(currentBundleFile,'CURRENT_BUNDLE'),freezePath=absolute(freezeFile,'ORIGINAL_FREEZE');
  const oldInput=json(oldPath),currentInput=json(currentPath);
  const oldAssets=checkedAssetParent(oldAssetRoot),currentAssets=checkedAssetParent(currentAssetRoot);
  const old=normalizeSafeBundle(oldInput,{inputFile:oldPath,assetRoot:oldAssets}),current=normalizeSafeBundle(currentInput,{inputFile:currentPath,expectedSourceRawSha256:currentInput.sourceRawSha256,assetRoot:currentAssets});
  if(!same(old.qids,current.qids)) throw Error('OUTSIDE_SCOPE_QID_ORDER_CHANGED');
  const scope=new Set(scopeQids.map(Number));if([...scope].some(q=>!current.qids.includes(q))) throw Error('AFFECTED_QID_NOT_IN_BUNDLE');
  for(const qid of old.qids.filter(q=>!scope.has(q))){
    const a=old.rows.find(r=>r.qid===qid),b=current.rows.find(r=>r.qid===qid);
    if(a.studentPayloadSha256!==b.studentPayloadSha256||!same(a.assets.map(x=>[x.ref,x.sha256]).sort(),b.assets.map(x=>[x.ref,x.sha256]).sort())) throw Error(`OUTSIDE_SCOPE_CHANGED:${qid}`);
  }
  const freezePhysical=physical(freezePath),freeze=json(freezePath);
  if(freeze.sourceRawSha256&&freeze.sourceRawSha256!==old.sourceRawSha256) throw Error('ORIGINAL_FREEZE_SOURCE_IDENTITY_MISMATCH');
  if(freeze.studentBundle?.sha256&&freeze.studentBundle.sha256!==physical(oldPath).sha256) throw Error('ORIGINAL_FREEZE_STUDENT_BUNDLE_IDENTITY_MISMATCH');
  const plan={schemaVersion:'JS_ARCHIVE_AFFECTED_SCOPE_REVIEW_PLAN_V1',originalFreeze:freezePhysical,originalFreezeIdentity:{stage:freeze.stage,reviewerIdentity:freeze.reviewerIdentity||null,sourceRawSha256:freeze.sourceRawSha256||null},oldBundle:physical(oldPath),currentBundle:physical(currentPath),scopeQids:[...scope],outsideScopeParity:'EXACT',rows:[...scope].map(qid=>({qid,oldStudentPayloadSha256:old.rows.find(r=>r.qid===qid).studentPayloadSha256,currentStudentPayloadSha256:current.rows.find(r=>r.qid===qid).studentPayloadSha256,oldAssets:old.rows.find(r=>r.qid===qid).assets.map(a=>({ref:a.ref,sha256:a.sha256})),currentAssets:current.rows.find(r=>r.qid===qid).assets.map(a=>({ref:a.ref,sha256:a.sha256}))})),semanticVerdictCreated:false};
  return {plan,ref:writeFresh(absolute(output,'SCOPE_PLAN_OUTPUT'),plan)};
}

function parse(argv){const [command,...args]=argv,a={};for(let i=0;i<args.length;i++){const k=args[i];if(!k.startsWith('--'))throw Error('FLAG_REQUIRED:'+k);a[k.slice(2)]=args[++i];}return {command,a};}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{const {command,a}=parse(process.argv.slice(2));let result;
    if(command==='preflight') result=preflightHandoff({assignmentFile:a.assignment,receiptFile:a.receipt,root:a.root,workingJsFile:a.js,assetRoot:a['asset-root'],bundleFile:a.bundle,evidenceFile:a.evidence,rawReportFile:a.report,reviewerCanonicalId:a.reviewer,qids:a.qids?.split(',').map(Number)});
    else if(command==='validate-capture') {result=runCanonicalValidatorCapture({root:a.root,workingJsFile:a.js,evidenceFile:a.evidence,bundleFile:a.bundle,assetRoot:a['asset-root'],stage:a.stage,expectedSourceRawSha256:a['source-sha'],freezeFile:a.freeze,freezeSha256:a['freeze-sha'],output:a.output});if(result.exitCode!==0)process.exitCode=1;}
    else if(command==='prepare-student') result=prepareStudentPacket({sourceFile:a.js,sourceRawSha256:a['source-sha'],bundleFile:a.bundle,assetRoot:a['asset-root'],output:a.output});
    else if(command==='accept') result=acceptHandoffFile({root:a.root,stateFile:a.state,'expectedStateSha256':a['state-sha'],eventFile:a.event,eventSha256:a['event-sha']});
    else if(command==='disclose') result=discloseAfterFreeze({sourceFile:a.js,studentBundleFile:a.bundle,freezeFile:a.freeze,freezeSha256:a['freeze-sha'],qids:a.qids?.split(',').map(Number),assetRoot:a['asset-root'],output:a.output});
    else if(command==='scope-plan') result=buildAffectedScopePlan({oldBundleFile:a.old,currentBundleFile:a.current,scopeQids:a.qids?.split(',').map(Number),freezeFile:a.freeze,assetRoot:a['asset-root'],oldAssetRoot:a['old-asset-root'],currentAssetRoot:a['current-asset-root'],output:a.output});
    else throw Error('COMMAND_REQUIRED:preflight|validate-capture|prepare-student|accept|disclose|scope-plan');
    console.log(JSON.stringify(result,null,2));
  }catch(error){console.error(JSON.stringify({ok:false,error:error.message},null,2));process.exitCode=2;}
}
