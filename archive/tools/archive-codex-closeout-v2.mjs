import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { gitBlobReader } from './archive-codex-artifact-io.mjs';
import { QUALITY_CONTRACT_V2 } from './archive-stage-validator-artifact-v2.mjs';
import { gitBlobSha } from './archive-stage-validator-compat-v1.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const CASES = ['exam/desktop','exam/mobile','sol/desktop','sol/mobile','ans/desktop','ans/mobile'];
export const CODEX_USER_RENDER_WAIVER_DIRECTIVE = '캡처없이 js 에셋 svg 코드 완성으로 완료해. 사용자 지시사항으로';
const CODEX_USER_RENDER_WAIVER_RUN_ID = 'archive2-m2-codex-20261006-03';
const CODEX_USER_RENDER_WAIVER_SCOPE = 'actualRenderCaptureOnly';
const CODEX_USER_RENDER_WAIVER_ROSTER_PATH = 'archive/analysis/archive2-m2-codex-20261006-03/roster.json';
const CODEX_USER_RENDER_WAIVER_ROSTER_ORIGINAL_PATH = '.tmp/archive/archive2-m2-codex-20261006-03/roster.json';
const CODEX_USER_RENDER_WAIVER_ROSTER_SHA256 = 'db2bd6150afe93c350b9a7f15e7f360b526f9c9d8403b06660343033679f4674';
function referencedImages(value) {
  const refs=new Set();
  if(typeof value==='string')for(const m of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(m[1]))refs.add(m[1]);
  return refs;
}
function choiceHtml(choice) {
  if(choice===null || choice===undefined)return '';
  if(typeof choice==='object')choice=choice.text || choice.content || choice.value || choice.answer || Object.values(choice)[0] || '';
  return String(choice);
}
function modeAssetRefs(bank, mode) {
  const refs=new Set();
  const add=(value)=>{for(const ref of referencedImages(value))refs.add(ref);};
  for(const q of bank){
    const content=typeof q.content==='string'&&q.content ? q.content : (typeof q.question==='string' ? q.question : '');
    if(mode==='exam'){
      if(q.image)refs.add(q.image);else add(content);
      if(Array.isArray(q.choices))for(const choice of q.choices)add(choiceHtml(choice));
    }else if(mode==='sol'){
      const stripReminder=!!q.image || q.solutionReminderImagePolicy==='STRIP_INLINE';
      if(!stripReminder)add(content);
      if(q.solutionImage)refs.add(q.solutionImage);
      add(q.solution || q.explanation || q.sol || '');
    }else if(mode==='ans') add(q.answer ?? '');
  }
  return refs;
}
function expandSvgDependencies(refs,bank,cases,assets,root) {
  const expanded=new Set(refs);
  const requiredByMode=new Map(['exam','sol','ans'].map(mode=>[mode,modeAssetRefs(bank,mode)]));
  for(const ref of expanded){
    if(!ref.toLowerCase().endsWith('.svg'))continue;
    const source=assets.find(asset=>asset.ref===ref);
    const eligibleModes=[...requiredByMode].filter(([,required])=>required.has(ref)).map(([mode])=>mode);
    const eligibleCases=cases.filter(c=>eligibleModes.includes(c.id.split('/')[0]));
    const witness=eligibleCases.flatMap(c=>c.loadedAssets||[]).find(asset=>asset.ref===ref);
    if(!source || !witness || witness.sha256!==source.sha256)throw new Error('RENDER_SVG_LOADED_FILE_REQUIRED:'+ref);
    const svgBytes=readBound(root,witness.file);
    if(hash(svgBytes)!==source.sha256)throw new Error('RENDER_LOADED_ASSET_MISMATCH:'+ref);
    for(const match of svgBytes.toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(match[1])){
      const dependency=path.posix.normalize(path.posix.join(path.posix.dirname(ref),match[1]));
      expanded.add(dependency);
      for(const mode of eligibleModes)requiredByMode.get(mode).add(dependency);
    }
  }
  return expanded;
}
function readBound(root, ref) {
  if (!ref || typeof ref.path !== 'string' || path.isAbsolute(ref.path)) throw new Error('PHYSICAL_REF_REQUIRED');
  const file=path.resolve(root,ref.path),rel=path.relative(path.resolve(root),file);
  if(rel.startsWith('..') || path.isAbsolute(rel))throw new Error('REF_PATH_ESCAPE');
  const real=fs.realpathSync(file),rr=path.relative(fs.realpathSync(root),real);
  if(rr.startsWith('..') || path.isAbsolute(rr))throw new Error('REF_SYMLINK_ESCAPE');
  const bytes=fs.readFileSync(file);if(hash(bytes)!==ref.sha256)throw new Error('PHYSICAL_REF_SHA_MISMATCH');return bytes;
}
function sourceAssetRefs(bank) {
  const refs=new Set();
  for(const q of bank){
    for(const field of ['image','solutionImage','visualAsset'])if(typeof q[field]==='string' && q[field] && !/^(?:data:|blob:|#)/i.test(q[field]))refs.add(q[field]);
    for(const field of ['content','question','solution','explanation','sol','answer'])for(const ref of referencedImages(q[field]))refs.add(ref);
    if(Array.isArray(q.choices))for(const choice of q.choices)for(const ref of referencedImages(choiceHtml(choice)))refs.add(ref);
  }
  return refs;
}
function sameOrderedValues(actual,expected){return Array.isArray(actual)&&actual.length===expected.length&&actual.every((value,index)=>Number(value)===Number(expected[index]));}
function validateStageReport(report,{stage,examUid,artifactSha,qids}){
  return report?.ok===true && report.stage===stage && report.validatorMode===`${stage}_V2` && report.examUid===examUid && report.artifactSha===artifactSha && report.qualityContractVersion===QUALITY_CONTRACT_V2 && report.executionLine==='CODEX' && report.disposition==='PASS' && Array.isArray(report.issues) && report.issues.length===0 && report.common?.commonValid===true && report.common?.stage===stage && report.common?.examUid===examUid && report.common?.artifactSha===artifactSha && sameOrderedValues(report.common?.observedQids,qids) && sameOrderedValues(report.common?.expectedQids,qids) && report.common?.issues?.length===0 && report.artifactContract?.active===true && report.artifactContract?.qualityContractVersion===QUALITY_CONTRACT_V2 && report.artifactContract?.stage===stage && report.artifactContract?.disposition==='PASS' && report.artifactContract?.questionCount===qids.length && report.artifactContract?.issues?.length===0;
}
function deriveStaticAssets({bank,assets,root}){
  if(!Array.isArray(assets) || new Set(assets.map(asset=>asset.ref)).size!==assets.length)throw new Error('USER_WAIVER_ASSET_SET_REQUIRED');
  const byRef=new Map(assets.map(asset=>[asset.ref,asset]));
  const refs=sourceAssetRefs(bank);
  for(const ref of refs){
    if(!ref.startsWith('assets/images/') || ref.includes('..'))throw new Error('USER_WAIVER_ASSET_PATH_INVALID:'+ref);
    if(ref.toLowerCase().endsWith('.svg')){
      const asset=byRef.get(ref);
      if(!asset || !asset.file || asset.sha256!==asset.file.sha256)throw new Error('USER_WAIVER_SVG_PHYSICAL_REF_REQUIRED:'+ref);
      const bytes=readBound(root,asset.file);
      if(hash(bytes)!==asset.sha256)throw new Error('USER_WAIVER_ASSET_SHA_MISMATCH:'+ref);
      for(const match of bytes.toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(match[1]))refs.add(path.posix.normalize(path.posix.join(path.posix.dirname(ref),match[1])));
    }
  }
  if(refs.size!==assets.length || assets.some(asset=>!refs.has(asset.ref)))throw new Error('USER_WAIVER_ASSET_CLOSURE_MISMATCH');
  for(const asset of assets){
    if(!asset.ref.startsWith('assets/images/') || asset.ref.includes('..') || !asset.file || asset.file.sha256!==asset.sha256)throw new Error('USER_WAIVER_ASSET_PHYSICAL_BINDING_REQUIRED:'+asset.ref);
    if(hash(readBound(root,asset.file))!==asset.sha256)throw new Error('USER_WAIVER_ASSET_SHA_MISMATCH:'+asset.ref);
  }
  return [...assets].map(({ref,sha256})=>({ref,sha256})).sort((a,b)=>a.ref.localeCompare(b.ref));
}
export function validateCodexUserWaivedStaticReceipt({receipt,root}) {
  const issues=[];
  try{
    const expectedSchema=receipt?.status==='MAIN_DONE'?'JS_ARCHIVE_CODEX_USER_WAIVED_MAIN_DONE_RECEIPT_V1':'JS_ARCHIVE_CODEX_USER_WAIVED_STATIC_RECEIPT_V1';
    if(receipt?.schemaVersion!==expectedSchema || receipt?.executionLine!=='CODEX' || receipt?.qualityContractVersion!==QUALITY_CONTRACT_V2 || !['STATIC_CODE_COMPLETE','MAIN_DONE'].includes(receipt?.status) || receipt?.completionBasis!=='USER_DIRECTED_STATIC_COMPLETE' || receipt?.renderStatus!=='NOT_RUN_USER_WAIVER')throw new Error('USER_WAIVER_STATIC_CONTRACT_REQUIRED');
    if(receipt.renderReceipt!==undefined || receipt.cases!==undefined)throw new Error('USER_WAIVER_RENDER_CLAIM_FORBIDDEN');
    if(receipt.waiverScope?.runId!==CODEX_USER_RENDER_WAIVER_RUN_ID || receipt.waiverScope?.course!=='m2' || receipt.waiverScope?.rosterLocked!==true || receipt.waiverScope?.scope!==CODEX_USER_RENDER_WAIVER_SCOPE)throw new Error('USER_WAIVER_SCOPE_REQUIRED');
    const directiveReceipt=JSON.parse(readBound(root,receipt.userDirectiveReceipt).toString('utf8'));
    if(directiveReceipt?.schemaVersion!=='JS_ARCHIVE_CODEX_USER_RENDER_WAIVER_DIRECTIVE_RECEIPT_V1' || directiveReceipt?.executionLine!=='CODEX' || directiveReceipt?.qualityContractVersion!==QUALITY_CONTRACT_V2 || directiveReceipt?.status!=='USER_DIRECTED_WAIVER_RECORDED' || directiveReceipt?.directiveText!==CODEX_USER_RENDER_WAIVER_DIRECTIVE || directiveReceipt?.runId!==CODEX_USER_RENDER_WAIVER_RUN_ID || directiveReceipt?.course!=='m2' || directiveReceipt?.rosterLocked!==true || directiveReceipt?.scope!==CODEX_USER_RENDER_WAIVER_SCOPE)throw new Error('USER_WAIVER_DIRECTIVE_RECEIPT_REQUIRED');
    if(readBound(root,directiveReceipt.directiveFile).toString('utf8')!==CODEX_USER_RENDER_WAIVER_DIRECTIVE)throw new Error('USER_WAIVER_VERBATIM_DIRECTIVE_MISMATCH');
    const roster=JSON.parse(readBound(root,receipt.lockedRoster).toString('utf8'));
    if(receipt.lockedRoster?.path!==CODEX_USER_RENDER_WAIVER_ROSTER_PATH || receipt.lockedRoster?.originalPath!==CODEX_USER_RENDER_WAIVER_ROSTER_ORIGINAL_PATH || receipt.lockedRoster?.sha256!==CODEX_USER_RENDER_WAIVER_ROSTER_SHA256 || directiveReceipt.lockedRoster?.path!==receipt.lockedRoster.path || directiveReceipt.lockedRoster?.sha256!==receipt.lockedRoster.sha256 || directiveReceipt.lockedRoster?.originalPath!==receipt.lockedRoster.originalPath)throw new Error('USER_WAIVER_FIXED_ROSTER_BINDING_REQUIRED');
    if(!roster?.lockedAt || roster?.runId!==CODEX_USER_RENDER_WAIVER_RUN_ID || roster?.course!=='m2' || roster?.qualityContractVersion!==QUALITY_CONTRACT_V2 || roster?.executionLine!=='CODEX' || roster.rows?.length!==15 || roster.rows.some(row=>row.course!=='m2') || new Set(roster.rows.map(row=>row.examUid)).size!==roster.rows.length)throw new Error('USER_WAIVER_LOCKED_ROSTER_REQUIRED');
    const rosterRow=roster.rows?.find(row=>row.examUid===receipt.examUid);
    if(!rosterRow || rosterRow.course!=='m2' || rosterRow.productionPath!==receipt.productionPath)throw new Error('USER_WAIVER_EXAM_OUTSIDE_LOCKED_M2_ROSTER');
    if(!/^archive\/exams\/(original|similar|types)\//.test(receipt.productionPath||'') || /generated/i.test(receipt.productionPath))throw new Error('PRODUCTION_PATH_REQUIRED');
    const loaded=readBound(root,receipt.loadedJs);
    if(hash(loaded)!==receipt.artifactRawSha256 || gitBlobSha(loaded)!==receipt.artifactSha)throw new Error('USER_WAIVER_ARTIFACT_BINDING_REQUIRED');
    const box={window:{}};vm.runInNewContext(loaded.toString('utf8'),box,{timeout:1000});
    const bank=box.window.questionBank||box.window.questions;
    if(!Array.isArray(bank) || !bank.length)throw new Error('USER_WAIVER_QUESTION_BANK_REQUIRED');
    const actualQids=bank.map(q=>Number(q.id));
    if(new Set(actualQids).size!==actualQids.length || actualQids.length!==rosterRow.questionCount || !sameOrderedValues(receipt.qids,actualQids))throw new Error('USER_WAIVER_QID_COVERAGE_REQUIRED');
    const assets=deriveStaticAssets({bank,assets:receipt.assets,root});
    const staticClosure=JSON.parse(readBound(root,receipt.r3StaticClosure).toString('utf8'));
    if(staticClosure?.executionLine!=='CODEX' || staticClosure?.qualityContractVersion!==QUALITY_CONTRACT_V2 || staticClosure.examUid!==receipt.examUid || staticClosure.artifactSha!==receipt.artifactSha || staticClosure.artifactRawSha256!==receipt.artifactRawSha256 || staticClosure.status!=='STATIC_CODE_COMPLETE' || staticClosure.completionBasis!=='USER_DIRECTED_STATIC_COMPLETE' || staticClosure.renderStatus!=='NOT_RUN_USER_WAIVER' || staticClosure.reviewerIdentity?.role!=='archive_r3' || !(staticClosure.reviewerIdentity?.reviewerId||staticClosure.reviewerIdentity?.session) || staticClosure.structureIntegrityStatus!=='PASS' || staticClosure.jsIntegrityStatus!=='PASS' || staticClosure.assetIntegrityStatus!=='PASS' || staticClosure.changedOpenDependencyReviewStatus!=='PASS' || staticClosure.itemHoldCount!==0 || !Array.isArray(staticClosure.itemHoldQids) || staticClosure.itemHoldQids.length!==0 || !sameOrderedValues(staticClosure.qids,actualQids))throw new Error('USER_WAIVER_R3_STATIC_CLOSURE_REQUIRED');
    const staticAssets=[...(staticClosure.assets||[])].map(({ref,sha256})=>({ref,sha256})).sort((a,b)=>a.ref.localeCompare(b.ref));
    if(JSON.stringify(staticAssets)!==JSON.stringify(assets))throw new Error('USER_WAIVER_R3_ASSET_CLOSURE_MISMATCH');
    for(const stage of ['R1','R2']){
      const reportRef=receipt[`${stage.toLowerCase()}Validation`];
      const report=JSON.parse(readBound(root,reportRef).toString('utf8'));
      if(!validateStageReport(report,{stage,examUid:receipt.examUid,artifactSha:receipt.artifactSha,qids:actualQids}))throw new Error(`USER_WAIVER_${stage}_FULL_PASS_REQUIRED`);
      const closureBinding=staticClosure.upstreamBindings?.[stage]?.validatorReport;
      if(closureBinding?.path!==reportRef.path || closureBinding?.sha256!==reportRef.sha256)throw new Error(`USER_WAIVER_R3_${stage}_REPORT_BINDING_REQUIRED`);
    }
  }catch(error){issues.push(error.message);}
  return {ok:!issues.length,disposition:issues.length?'FAIL':'PASS',completionBasis:issues.length?undefined:'USER_DIRECTED_STATIC_COMPLETE',renderStatus:issues.length?undefined:'NOT_RUN_USER_WAIVER',issues};
}
export function validateCodexUserWaivedMainDoneReceipt({receipt,root}) {
  if(receipt?.schemaVersion!=='JS_ARCHIVE_CODEX_USER_WAIVED_MAIN_DONE_RECEIPT_V1' || receipt?.status!=='MAIN_DONE')return {ok:false,disposition:'FAIL',issues:['USER_WAIVER_MAIN_DONE_STATUS_REQUIRED']};
  const staticResult=validateCodexUserWaivedStaticReceipt({receipt,root});
  if(!staticResult.ok)return staticResult;
  const issues=[];
  try{
    const main=execFileSync('git',['-C',root,'rev-parse','origin/main'],{encoding:'utf8'}).trim();
    if(execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim()!==main)throw new Error('WORKING_HEAD_MAIN_PARITY_REQUIRED');
    if(main!==receipt.remoteMainSha)throw new Error('REMOTE_MAIN_SHA_MISMATCH');
    const readBlob=gitBlobReader(root,main);
    const production=readBlob(receipt.productionPath);
    if(gitBlobSha(production)!==receipt.artifactSha || hash(production)!==receipt.artifactRawSha256)throw new Error('REMOTE_PRODUCTION_ARTIFACT_MISMATCH');
    for(const asset of receipt.assets){
      if(hash(readBlob('archive/'+asset.ref))!==asset.sha256)throw new Error('REMOTE_ASSET_SHA_MISMATCH:'+asset.ref);
    }
  }catch(error){issues.push(error.message);}
  return {ok:!issues.length,disposition:issues.length?'FAIL':'PASS',completionBasis:issues.length?undefined:'USER_DIRECTED_STATIC_COMPLETE',renderStatus:issues.length?undefined:'NOT_RUN_USER_WAIVER',issues};
}
const ROOT_WAIVER_CASE_IDS=['exam/desktop','exam/mobile','sol/desktop','sol/mobile','ans/desktop','ans/mobile'];
const ROOT_WAIVER_AUTHORITY_PATH='docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Execution_v1.md';
function safeArchiveProductionPath(value){
  return typeof value==='string'&&/^archive\/exams\/(original|similar|types)\/[A-Za-z0-9가-힣_./-]+\.js$/.test(value)&&!value.includes('\\')&&!value.includes('..')&&!path.posix.isAbsolute(value)&&path.posix.normalize(value)===value&&!value.split('/').some(segment=>!segment||segment==='.'||segment==='..')&&!/generated/i.test(value);
}
function validateRootStandingAuthority({root,reference}){
  if(reference?.sourcePath!==ROOT_WAIVER_AUTHORITY_PATH||![25,'25','§25'].includes(reference.section)||!(/^[a-f0-9]{40}$/i).test(reference.sourceGitCommit||'')||!(/^[a-f0-9]{40}$/i).test(reference.sourceGitBlobSha1||'')||!(/^[a-f0-9]{64}$/i).test(reference.sourceRawSha256||''))throw new Error('ROOT_WAIVER_AUTHORITY_REVISION_BINDING_REQUIRED');
  if(reference.path!==ROOT_WAIVER_AUTHORITY_PATH&&!/^archive\/analysis\//.test(reference.path||''))throw new Error('ROOT_WAIVER_AUTHORITY_SNAPSHOT_PATH_REQUIRED');
  const physical=durableBound(root,reference,'standing §25 authority'),main=execFileSync('git',['-C',root,'rev-parse','origin/main'],{encoding:'utf8'}).trim();
  execFileSync('git',['-C',root,'merge-base','--is-ancestor',reference.sourceGitCommit,main],{stdio:'pipe'});
  const source=execFileSync('git',['-C',root,'cat-file','blob',`${reference.sourceGitCommit}:${ROOT_WAIVER_AUTHORITY_PATH}`]);
  if(hash(source)!==reference.sourceRawSha256||gitBlobSha(source)!==reference.sourceGitBlobSha1||!source.equals(physical))throw new Error('ROOT_WAIVER_AUTHORITY_GIT_BLOB_MISMATCH');
  const text=source.toString('utf8');
  if(!text.includes('## 25. PRODUCTION 완성 우선 — ROOT 예외·HOLD 해제 권한')||!text.includes('ROOT에 캡처 조건 면제와 예외·HOLD 복구·해제의 최종 운영 권한')||!text.includes('completionBasis:ROOT_DIRECTED_STATIC_COMPLETE')||!text.includes('NOT_RUN_ROOT_WAIVER'))throw new Error('ROOT_WAIVER_STANDING_POLICY_BINDING_REQUIRED');
  return {main,sourceSha256:hash(source),sourceGitBlobSha1:gitBlobSha(source)};
}
function durableBound(root,ref,label){
  if(typeof ref?.path!=='string'||/(?:^|[\\/])\.tmp(?:[\\/]|$)/i.test(ref.path))throw new Error('ROOT_WAIVER_DURABLE_REF_REQUIRED:'+label);
  return readBound(root,ref);
}
function hasText(value){return typeof value==='string'&&value.trim().length>0;}
function r3Identity(value){return value?.reviewerId||value?.session||value?.reviewer||value?.identity||null;}
function sameRef(a,b){return a?.path===b?.path&&a?.sha256===b?.sha256;}
function sameAssetBindings(actual,expected){
  const a=[...(actual||[])].map(x=>({ref:x.ref,sha256:x.sha256})).sort((x,y)=>x.ref.localeCompare(y.ref));
  return JSON.stringify(a)===JSON.stringify(expected);
}
function rootDecisionCaseSet(decision){
  if(!['NOT_RUN_ROOT_WAIVER','PARTIAL_RENDER_ROOT_WAIVER'].includes(decision?.renderStatus))throw new Error('ROOT_WAIVER_RENDER_STATUS_REQUIRED');
  const cases=decision.caseDispositions;
  if(!Array.isArray(cases)||cases.length!==ROOT_WAIVER_CASE_IDS.length||new Set(cases.map(c=>c.id)).size!==cases.length||ROOT_WAIVER_CASE_IDS.some(id=>!cases.some(c=>c.id===id)))throw new Error('ROOT_WAIVER_CASE_SCOPE_REQUIRED');
  for(const item of cases){
    if(item.status==='NOT_RUN'){
      if(item.captureCount!==0||!hasText(item.reason))throw new Error('ROOT_WAIVER_NOT_RUN_FACTS_REQUIRED:'+item.id);
    }else if(item.status==='PASS'){
      if(decision.renderStatus!=='PARTIAL_RENDER_ROOT_WAIVER'||!Number.isInteger(item.captureCount)||item.captureCount<=0)throw new Error('ROOT_WAIVER_ACTUAL_CASE_FACTS_REQUIRED:'+item.id);
    }else throw new Error('ROOT_WAIVER_CASE_STATUS_INVALID:'+item.id);
  }
  const notRun=cases.filter(item=>item.status==='NOT_RUN').map(item=>item.id);
  const waived=[...(decision.waivedCaseIds||[])];
  if(new Set(waived).size!==waived.length||waived.length!==notRun.length||waived.some(id=>!notRun.includes(id)))throw new Error('ROOT_WAIVER_WAIVED_CASE_COMPLEMENT_REQUIRED');
  if(decision.renderStatus==='NOT_RUN_ROOT_WAIVER'){
    if(cases.some(item=>item.status!=='NOT_RUN')||notRun.length!==ROOT_WAIVER_CASE_IDS.length||decision.actualRenderReceipt!==undefined)throw new Error('ROOT_WAIVER_ALL_CASES_NOT_RUN_REQUIRED');
  }else if(cases.every(item=>item.status==='NOT_RUN')||cases.every(item=>item.status==='PASS')||!decision.actualRenderReceipt){
    throw new Error('ROOT_WAIVER_PARTIAL_CASE_BALANCE_REQUIRED');
  }
  return cases;
}
function sameCaseDisposition(actual,expected){
  if(!Array.isArray(actual)||actual.length!==expected.length||new Set(actual.map(item=>item.id)).size!==actual.length||ROOT_WAIVER_CASE_IDS.some(id=>!actual.some(item=>item.id===id)))return false;
  return ROOT_WAIVER_CASE_IDS.every(id=>{const a=actual.find(item=>item.id===id),e=expected.find(item=>item.id===id);return !!a&&!!e&&a.status===e.status&&a.captureCount===e.captureCount&&(a.status!=='NOT_RUN'||a.reason===e.reason);});
}
function validateRootPartialActualReceipt({actualRef,root,receipt,decision,decisionCases,bank,qids,assets,staticClosure}){
  if(!sameRef(actualRef,decision.actualRenderReceipt))throw new Error('ROOT_PARTIAL_ACTUAL_RENDER_REF_BINDING_REQUIRED');
  const actual=JSON.parse(durableBound(root,actualRef,'partial actual render receipt').toString('utf8'));
  if(actual?.schemaVersion!=='JS_ARCHIVE_CODEX_PARTIAL_RENDER_WITNESS_V1'||actual.status!=='PARTIAL_RENDER_WITNESS'||actual.renderStatus!=='PARTIAL_RENDER_ROOT_WAIVER'||actual.executionLine!=='CODEX'||actual.qualityContractVersion!==QUALITY_CONTRACT_V2||actual.examUid!==receipt.examUid||actual.artifactSha!==receipt.artifactSha||actual.artifactRawSha256!==receipt.artifactRawSha256||actual.loadedJs?.sha256!==receipt.loadedJs.sha256)throw new Error('ROOT_PARTIAL_ACTUAL_RENDER_BINDING_REQUIRED');
  const actualLoaded=durableBound(root,actual.loadedJs,'partial loaded JS');
  if(hash(actualLoaded)!==receipt.artifactRawSha256||gitBlobSha(actualLoaded)!==receipt.artifactSha)throw new Error('ROOT_PARTIAL_LOADED_JS_SHA_MISMATCH');
  const actualReviewer=actual.r3ReviewerIdentity||actual.reviewerIdentity,closureReviewer=staticClosure.reviewerIdentity;
  if(actualReviewer?.role!=='archive_r3'||r3Identity(actualReviewer)!==r3Identity(closureReviewer))throw new Error('ROOT_PARTIAL_R3_REVIEWER_REQUIRED');
  if(!sameOrderedValues(actual.qids,qids)||!sameAssetBindings(actual.assets,assets))throw new Error('ROOT_PARTIAL_QID_ASSET_BINDING_REQUIRED');
  const r3=JSON.parse(durableBound(root,actual.r3Validation,'partial R3 validation').toString('utf8'));
  if(r3.ok!==true||r3.validatorMode!=='R3_V2'||r3.stage!=='R3'||r3.examUid!==receipt.examUid||r3.artifactSha!==receipt.artifactSha||r3.qualityContractVersion!==QUALITY_CONTRACT_V2||r3.executionLine!=='CODEX'||r3.artifactContract?.active!==true)throw new Error('ROOT_PARTIAL_R3_RELEASE_READY_REQUIRED');
  const expectedIds=decisionCases.filter(item=>item.status==='PASS').map(item=>item.id),actualCases=actual.cases;
  if(!Array.isArray(actualCases)||actualCases.length!==expectedIds.length||new Set(actualCases.map(c=>c.id)).size!==actualCases.length||expectedIds.some(id=>!actualCases.some(c=>c.id===id)))throw new Error('ROOT_PARTIAL_ACTUAL_CASE_SET_REQUIRED');
  for(const c of actualCases){
    const d=decisionCases.find(item=>item.id===c.id),mode=c.id.split('/')[0];
    if(c.status!=='PASS'||!Number.isInteger(c.viewport?.width)||c.viewport.width<=0||!Number.isInteger(c.viewport?.height)||c.viewport.height<=0||(c.id.endsWith('/mobile')&&c.viewport.width>600)||!Array.isArray(c.captures)||c.captures.length!==d.captureCount)throw new Error('ROOT_PARTIAL_ACTUAL_CASE_INCOMPLETE:'+c.id);
    const covered=new Set();
    for(const capture of c.captures){const png=durableBound(root,capture.image,'partial capture');if(!png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('ROOT_PARTIAL_PNG_CAPTURE_REQUIRED:'+c.id);if(!Array.isArray(capture.qids))throw new Error('ROOT_PARTIAL_CAPTURE_QIDS_REQUIRED:'+c.id);capture.qids.forEach(q=>covered.add(Number(q)));}
    if(qids.some(q=>!covered.has(Number(q))))throw new Error('ROOT_PARTIAL_QID_CAPTURE_COVERAGE_REQUIRED:'+c.id);
    const required=expandSvgDependencies(modeAssetRefs(bank,mode),bank,actualCases,assets,root),expectedAssets=assets.filter(asset=>required.has(asset.ref));
    if(required.size!==expectedAssets.length||!Array.isArray(c.loadedAssets)||c.loadedAssets.length!==expectedAssets.length)throw new Error('ROOT_PARTIAL_MODE_ASSET_SET_REQUIRED:'+c.id);
    for(const asset of expectedAssets){const found=c.loadedAssets.filter(item=>item.ref===asset.ref);if(found.length!==1||found[0].sha256!==asset.sha256||hash(durableBound(root,found[0].file,'partial decoded asset'))!==asset.sha256)throw new Error('ROOT_PARTIAL_ASSET_DECODE_BINDING_REQUIRED:'+c.id+':'+asset.ref);}
    if(c.mathJaxStatus!=='PASS'||c.layoutReviewStatus!=='PASS'||c.assetDecodeStatus!=='PASS')throw new Error('ROOT_PARTIAL_CASE_REVIEW_REQUIRED:'+c.id);
  }
  return actual;
}
export function validateCodexRootWaivedStaticReceipt({receipt,root}){
  const issues=[];
  try{
    if(receipt?.schemaVersion!=='JS_ARCHIVE_CODEX_ROOT_WAIVED_STATIC_RECEIPT_V1'||receipt?.status!=='STATIC_CODE_COMPLETE'||receipt?.executionLine!=='CODEX'||receipt?.qualityContractVersion!==QUALITY_CONTRACT_V2||receipt?.completionBasis!=='ROOT_DIRECTED_STATIC_COMPLETE'||!['NOT_RUN_ROOT_WAIVER','PARTIAL_RENDER_ROOT_WAIVER'].includes(receipt?.renderStatus))throw new Error('ROOT_WAIVER_STATIC_CONTRACT_REQUIRED');
    if(receipt.renderReceipt!==undefined)throw new Error('ROOT_WAIVER_RENDER_CLAIM_FORBIDDEN');
    const decision=JSON.parse(durableBound(root,receipt.rootDecision,'decision').toString('utf8'));
    if(decision?.schemaVersion!=='JS_ARCHIVE_CODEX_ROOT_WAIVER_DECISION_V1'||decision?.decisionAuthority!=='ROOT_DELEGATED'||decision?.executionLine!=='CODEX'||decision?.qualityContractVersion!==QUALITY_CONTRACT_V2||decision?.completionBasis!=='ROOT_DIRECTED_STATIC_COMPLETE'||!['NOT_RUN_ROOT_WAIVER','PARTIAL_RENDER_ROOT_WAIVER'].includes(decision?.renderStatus))throw new Error('ROOT_WAIVER_DECISION_REQUIRED');
    if(decision.rootIdentity?.role!=='ROOT'||!hasText(decision.rootIdentity?.identity||decision.rootIdentity?.rootId))throw new Error('ROOT_WAIVER_ROOT_IDENTITY_REQUIRED');
    if(!hasText(decision.reason)||decision.alternativeReview?.status!=='PASS'||!hasText(decision.alternativeReview?.description)||!Array.isArray(decision.publicationConditions)||!decision.publicationConditions.length||decision.publicationConditions.some(x=>!hasText(x)))throw new Error('ROOT_WAIVER_REASON_ALTERNATIVE_REVIEW_REQUIRED');
    validateRootStandingAuthority({root,reference:decision.authorityReference});
    if(!hasText(decision.runId)||decision.runId!==receipt.runId||decision.examUid!==receipt.examUid||decision.scope?.examUid!==receipt.examUid||decision.scope?.runId!==receipt.runId)throw new Error('ROOT_WAIVER_RUN_EXAM_SCOPE_REQUIRED');
    if(receipt.rootDecision.runId!==undefined&&receipt.rootDecision.runId!==decision.runId)throw new Error('ROOT_WAIVER_DECISION_RUN_MISMATCH');
    const lockedRoster=JSON.parse(durableBound(root,receipt.lockedRoster,'locked roster').toString('utf8'));
    if(!sameRef(decision.lockedRoster,receipt.lockedRoster)||lockedRoster.runId!==decision.runId||lockedRoster.executionLine!=='CODEX'||lockedRoster.qualityContractVersion!==QUALITY_CONTRACT_V2||!(lockedRoster.locked===true||hasText(lockedRoster.lockedAt))||!Array.isArray(lockedRoster.rows)||!lockedRoster.rows.length||new Set(lockedRoster.rows.map(row=>row.examUid)).size!==lockedRoster.rows.length)throw new Error('ROOT_WAIVER_FIXED_LOCKED_ROSTER_REQUIRED');
    const rosterRows=lockedRoster.rows.filter(row=>row.examUid===receipt.examUid);
    if(rosterRows.length!==1)throw new Error('ROOT_WAIVER_EXAM_ROSTER_MEMBERSHIP_REQUIRED');
    const rosterRow=rosterRows[0];
    if(!Number.isInteger(rosterRow.questionCount)||rosterRow.questionCount<=0||rosterRow.productionPath!==receipt.productionPath)throw new Error('ROOT_WAIVER_ROSTER_DENOMINATOR_OR_PRODUCTION_REQUIRED');
    if(!safeArchiveProductionPath(receipt.productionPath))throw new Error('ROOT_WAIVER_PRODUCTION_PATH_INVALID');
    if(!sameOrderedValues(decision.scope.qids,receipt.qids)||!Array.isArray(decision.scope.caseIds)||ROOT_WAIVER_CASE_IDS.some(id=>!decision.scope.caseIds.includes(id))||new Set(decision.scope.caseIds).size!==ROOT_WAIVER_CASE_IDS.length)throw new Error('ROOT_WAIVER_EXACT_QID_CASE_SCOPE_REQUIRED');
    const decisionCases=rootDecisionCaseSet(decision);
    if(decision.renderStatus!==receipt.renderStatus||!sameCaseDisposition(receipt.caseDisposition,decisionCases))throw new Error('ROOT_WAIVER_RECEIPT_CASE_DISPOSITION_MISMATCH');
    if(receipt.artifactSha!==decision.artifact?.artifactSha||receipt.artifactRawSha256!==decision.artifact?.artifactRawSha256||receipt.loadedJs?.sha256!==receipt.artifactRawSha256||decision.evidence?.loadedJs?.path!==receipt.loadedJs.path||decision.evidence?.loadedJs?.sha256!==receipt.loadedJs.sha256)throw new Error('ROOT_WAIVER_ARTIFACT_EVIDENCE_BINDING_REQUIRED');
    const loaded=durableBound(root,receipt.loadedJs,'loaded JS');
    if(hash(loaded)!==receipt.artifactRawSha256||gitBlobSha(loaded)!==receipt.artifactSha)throw new Error('ROOT_WAIVER_ARTIFACT_SHA_MISMATCH');
    const box={window:{}};vm.runInNewContext(loaded.toString('utf8'),box,{timeout:1000});
    const bank=box.window.questionBank||box.window.questions;
    if(!Array.isArray(bank)||!bank.length)throw new Error('ROOT_WAIVER_QUESTION_BANK_REQUIRED');
    const actualQids=bank.map(q=>Number(q.id));
    if(new Set(actualQids).size!==actualQids.length||actualQids.length!==rosterRow.questionCount||!sameOrderedValues(receipt.qids,actualQids)||!sameOrderedValues(decision.scope.qids,actualQids))throw new Error('ROOT_WAIVER_FULL_LOCKED_QID_DENOMINATOR_REQUIRED');
    if(!Array.isArray(receipt.assets)||receipt.assets.some(asset=>/(?:^|[\\/])\.tmp(?:[\\/]|$)/i.test(asset.file?.path||'')))throw new Error('ROOT_WAIVER_DURABLE_ASSET_SET_REQUIRED');
    const assets=deriveStaticAssets({bank,assets:receipt.assets,root});
    if(!sameAssetBindings(decision.assets,assets))throw new Error('ROOT_WAIVER_DECISION_ASSET_BINDING_REQUIRED');
    const staticClosure=JSON.parse(durableBound(root,receipt.r3StaticClosure,'R3 static closure').toString('utf8'));
    if(staticClosure?.executionLine!=='CODEX'||staticClosure?.qualityContractVersion!==QUALITY_CONTRACT_V2||staticClosure.examUid!==receipt.examUid||staticClosure.artifactSha!==receipt.artifactSha||staticClosure.artifactRawSha256!==receipt.artifactRawSha256||staticClosure.status!=='STATIC_CODE_COMPLETE'||!['ROOT_DIRECTED_STATIC_COMPLETE','USER_DIRECTED_STATIC_COMPLETE'].includes(staticClosure.completionBasis)||!['NOT_RUN_ROOT_WAIVER','NOT_RUN_USER_WAIVER','PARTIAL_RENDER_ROOT_WAIVER'].includes(staticClosure.renderStatus)||staticClosure.reviewerIdentity?.role!=='archive_r3'||!hasText(r3Identity(staticClosure.reviewerIdentity))||staticClosure.structureIntegrityStatus!=='PASS'||staticClosure.jsIntegrityStatus!=='PASS'||staticClosure.assetIntegrityStatus!=='PASS'||staticClosure.changedOpenDependencyReviewStatus!=='PASS'||staticClosure.itemHoldCount!==0||!Array.isArray(staticClosure.itemHoldQids)||staticClosure.itemHoldQids.length!==0||!sameOrderedValues(staticClosure.qids,actualQids))throw new Error('ROOT_WAIVER_R3_STATIC_CLOSURE_REQUIRED');
    if(!sameAssetBindings(staticClosure.assets,assets))throw new Error('ROOT_WAIVER_R3_ASSET_CLOSURE_MISMATCH');
    const decisionReviewer=decision.r3ReviewerIdentity;
    if(decisionReviewer?.role!==staticClosure.reviewerIdentity.role||r3Identity(decisionReviewer)!==r3Identity(staticClosure.reviewerIdentity))throw new Error('ROOT_WAIVER_R3_REVIEWER_BINDING_REQUIRED');
    for(const stage of ['R1','R2']){
      const reportRef=receipt[`${stage.toLowerCase()}Validation`];
      if(!sameRef(decision.evidence?.[`${stage.toLowerCase()}Validation`],reportRef)||!sameRef(staticClosure.upstreamBindings?.[stage]?.validatorReport,reportRef))throw new Error(`ROOT_WAIVER_${stage}_REPORT_REF_BINDING_REQUIRED`);
      const report=JSON.parse(durableBound(root,reportRef,`${stage} validation`).toString('utf8'));
      if(!validateStageReport(report,{stage,examUid:receipt.examUid,artifactSha:receipt.artifactSha,qids:actualQids}))throw new Error(`ROOT_WAIVER_${stage}_FULL_PASS_REQUIRED`);
    }
    if(!sameRef(decision.evidence?.r3StaticClosure,receipt.r3StaticClosure))throw new Error('ROOT_WAIVER_R3_STATIC_REF_BINDING_REQUIRED');
    if(!Array.isArray(decision.alternativeReview.evidenceRefs)||!decision.alternativeReview.evidenceRefs.some(ref=>sameRef(ref,receipt.r3StaticClosure)))throw new Error('ROOT_WAIVER_ALTERNATIVE_REVIEW_EVIDENCE_REQUIRED');
    for(const ref of decision.alternativeReview.evidenceRefs)durableBound(root,ref,'alternative review evidence');
    if(decision.renderStatus==='NOT_RUN_ROOT_WAIVER'){
      if(receipt.actualRenderReceipt!==undefined)throw new Error('ROOT_WAIVER_UNEXPECTED_ACTUAL_RENDER_RECEIPT');
    }else validateRootPartialActualReceipt({actualRef:receipt.actualRenderReceipt,root,receipt,decision,decisionCases,bank,qids:actualQids,assets:receipt.assets,staticClosure});
  }catch(error){issues.push(error.message);}
  return {ok:!issues.length,disposition:issues.length?'FAIL':'PASS',completionBasis:issues.length?undefined:'ROOT_DIRECTED_STATIC_COMPLETE',renderStatus:issues.length?undefined:receipt.renderStatus,issues};
}
function collectRootWaiverPhysicalRefs({receipt,root}){
  const decision=JSON.parse(durableBound(root,receipt.rootDecision,'decision').toString('utf8'));
  const refs=[['rootDecision',receipt.rootDecision],['lockedRoster',receipt.lockedRoster],['loadedJs',receipt.loadedJs],['r1Validation',receipt.r1Validation],['r2Validation',receipt.r2Validation],['r3StaticClosure',receipt.r3StaticClosure],['authorityReference',decision.authorityReference]];
  for(const asset of receipt.assets||[])refs.push([`asset:${asset.ref}`,asset.file]);
  for(const key of ['loadedJs','r1Validation','r2Validation','r3StaticClosure'])if(decision.evidence?.[key])refs.push([`decisionEvidence:${key}`,decision.evidence[key]]);
  for(const ref of decision.alternativeReview?.evidenceRefs||[])refs.push(['alternativeReviewEvidence',ref]);
  if(receipt.actualRenderReceipt){
    refs.push(['actualRenderReceipt',receipt.actualRenderReceipt]);
    const actual=JSON.parse(durableBound(root,receipt.actualRenderReceipt,'partial actual render receipt').toString('utf8'));
    refs.push(['actualLoadedJs',actual.loadedJs],['actualR3Validation',actual.r3Validation]);
    for(const c of actual.cases||[]){for(const capture of c.captures||[])refs.push([`actualCapture:${c.id}`,capture.image]);for(const asset of c.loadedAssets||[])refs.push([`actualDecodedAsset:${c.id}:${asset.ref}`,asset.file]);}
  }
  const seen=new Map();
  for(const [label,ref] of refs){
    durableBound(root,ref,label);
    const prior=seen.get(ref.path);if(prior&&prior!==ref.sha256)throw new Error('ROOT_WAIVER_PHYSICAL_REF_SHA_CONFLICT:'+ref.path);seen.set(ref.path,ref.sha256);
  }
  return [...seen].map(([path,sha256])=>({path,sha256}));
}
export function validateCodexRootWaivedMainDoneReceipt({receipt,root}){
  if(receipt?.schemaVersion!=='JS_ARCHIVE_CODEX_ROOT_WAIVED_MAIN_DONE_RECEIPT_V1'||receipt?.status!=='MAIN_DONE')return {ok:false,disposition:'FAIL',issues:['ROOT_WAIVER_MAIN_DONE_STATUS_REQUIRED']};
  const staticReceipt={...receipt,schemaVersion:'JS_ARCHIVE_CODEX_ROOT_WAIVED_STATIC_RECEIPT_V1',status:'STATIC_CODE_COMPLETE'};
  const staticResult=validateCodexRootWaivedStaticReceipt({receipt:staticReceipt,root});
  if(!staticResult.ok)return staticResult;
  const issues=[];
  try{
    const main=execFileSync('git',['-C',root,'rev-parse','origin/main'],{encoding:'utf8'}).trim();
    if(execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim()!==main)throw new Error('WORKING_HEAD_MAIN_PARITY_REQUIRED');
    if(main!==receipt.remoteMainSha)throw new Error('REMOTE_MAIN_SHA_MISMATCH');
    const readBlob=gitBlobReader(root,main);
    const production=readBlob(receipt.productionPath);
    if(gitBlobSha(production)!==receipt.artifactSha||hash(production)!==receipt.artifactRawSha256)throw new Error('REMOTE_PRODUCTION_ARTIFACT_MISMATCH');
    for(const asset of receipt.assets)if(hash(readBlob('archive/'+asset.ref))!==asset.sha256)throw new Error('REMOTE_ASSET_SHA_MISMATCH:'+asset.ref);
    for(const ref of collectRootWaiverPhysicalRefs({receipt,root}))if(hash(readBlob(ref.path))!==ref.sha256)throw new Error('REMOTE_WAIVER_EVIDENCE_SHA_MISMATCH:'+ref.path);
  }catch(error){issues.push(error.message);}
  return {ok:!issues.length,disposition:issues.length?'FAIL':'PASS',completionBasis:issues.length?undefined:'ROOT_DIRECTED_STATIC_COMPLETE',renderStatus:issues.length?undefined:receipt.renderStatus,issues};
}
export function validateCodexRenderReceipt({receipt,root,artifactSha,assets=[],qids=[]}) {
  const issues=[];
  try {
    if(receipt?.executionLine!=='CODEX' || receipt?.qualityContractVersion!==QUALITY_CONTRACT_V2 || receipt.status!=='RENDER_PASS' || receipt.artifactSha!==artifactSha)throw new Error('RENDER_ARTIFACT_BINDING_REQUIRED');
    const loaded=readBound(root,receipt.loadedJs);
    if(gitBlobSha(loaded)!==artifactSha)throw new Error('RENDER_LOADED_JS_MISMATCH');
    const r3=JSON.parse(readBound(root,receipt.r3Validation));
    if(r3.ok!==true || r3.validatorMode!=='R3_V2' || r3.artifactSha!==artifactSha || r3.qualityContractVersion!==QUALITY_CONTRACT_V2 || r3.executionLine!=='CODEX' || r3.artifactContract?.active!==true)throw new Error('R3_RELEASE_READY_REQUIRED');
    const box={window:{}};vm.runInNewContext(loaded.toString('utf8'),box,{timeout:1000});
    const bank=box.window.questionBank||box.window.questions;
    if(!Array.isArray(bank) || !bank.length)throw new Error('RENDER_QUESTION_BANK_REQUIRED');
    const actualQids=bank.map(q=>Number(q.id));
    if(new Set(actualQids).size!==actualQids.length || actualQids.some(q=>!qids.includes(q)) || qids.some(q=>!actualQids.includes(q)))throw new Error('RENDER_EXPECTED_QIDS_MISMATCH');
    const cases=receipt.cases;
    if(!Array.isArray(cases) || cases.length!==CASES.length || new Set(cases.map(c=>c.id)).size!==CASES.length || CASES.some(id=>!cases.some(c=>c.id===id)))throw new Error('RENDER_SIX_CASES_REQUIRED');
    const refs=new Set();
    for(const q of bank){
      for(const field of ['image','solutionImage','visualAsset'])if(q[field])refs.add(q[field]);
      for(const field of ['content','question','solution','explanation','sol','answer'])if(typeof q[field]==='string')for(const ref of referencedImages(q[field]))refs.add(ref);
      if(Array.isArray(q.choices))for(const choice of q.choices)for(const ref of referencedImages(choiceHtml(choice)))refs.add(ref);
    }
    // Expand only actual mode-rendered SVGs, using a SHA-bound witness from a case that requires that SVG.
    for(const mode of ['exam','sol','ans'])for(const ref of expandSvgDependencies(modeAssetRefs(bank,mode),bank,cases,assets,root))refs.add(ref);
    if(new Set(assets.map(a=>a.ref)).size!==assets.length || refs.size!==assets.length || assets.some(a=>!refs.has(a.ref)))throw new Error('RENDER_EXPECTED_ASSET_SET_MISMATCH');
    for(const c of cases){
      const mode=c.id.split('/')[0];
      const caseRefs=expandSvgDependencies(modeAssetRefs(bank,mode),bank,cases,assets,root);
      const caseAssets=assets.filter(asset=>caseRefs.has(asset.ref));
      if(caseRefs.size!==caseAssets.length)throw new Error('RENDER_EXPECTED_MODE_ASSET_SET_MISMATCH:'+mode);
      if(c.status!=='PASS' || !Number.isInteger(c.viewport?.width) || c.viewport.width<=0 || !Number.isInteger(c.viewport?.height) || c.viewport.height<=0 || !Array.isArray(c.captures) || !c.captures.length)throw new Error('RENDER_CASE_INCOMPLETE:'+c.id);
      if(c.id.endsWith('/mobile') && c.viewport.width>600)throw new Error('RENDER_MOBILE_VIEWPORT_REQUIRED');
      const covered=new Set();
      for(const capture of c.captures){
        const bytes=readBound(root,capture.image);
        if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('RENDER_PNG_CAPTURE_REQUIRED');
        if(!Array.isArray(capture.qids))throw new Error('RENDER_CAPTURE_QIDS_REQUIRED');
        capture.qids.forEach(q=>covered.add(Number(q)));
      }
      if(!qids.length || qids.some(q=>!covered.has(Number(q))))throw new Error('RENDER_QID_COVERAGE_REQUIRED:'+c.id);
      if(!Array.isArray(c.loadedAssets) || c.loadedAssets.length!==caseAssets.length)throw new Error('RENDER_ASSET_SET_REQUIRED:'+c.id);
      for(const asset of caseAssets){
        const matches=c.loadedAssets.filter(a=>a.ref===asset.ref);
        if(matches.length!==1 || matches[0].sha256!==asset.sha256 || hash(readBound(root,matches[0].file))!==asset.sha256)throw new Error('RENDER_LOADED_ASSET_MISMATCH:'+c.id+':'+asset.ref);
      }
      if(c.mathJaxStatus!=='PASS' || c.layoutReviewStatus!=='PASS' || c.assetDecodeStatus!=='PASS')throw new Error('RENDER_REVIEW_REQUIRED:'+c.id);
    }
  }catch(error){issues.push(error.message);}
  return {ok:!issues.length,disposition:issues.length?'FAIL':'PASS',issues};
}
export function validateCodexMainDoneReceipt({receipt,root,renderReceipt,assets=[],qids=[]}) {
  const issues=[];
  try {
    if(receipt?.executionLine!=='CODEX' || receipt?.status!=='MAIN_DONE' || receipt.qualityContractVersion!==QUALITY_CONTRACT_V2)throw new Error('MAIN_DONE_CONTRACT_REQUIRED');
    if(!/^archive\/exams\/(original|similar|types)\//.test(receipt.productionPath||'') || /generated/i.test(receipt.productionPath))throw new Error('PRODUCTION_PATH_REQUIRED');
    const read=JSON.parse(readBound(root,receipt.renderReceipt));
    if(JSON.stringify(read)!==JSON.stringify(renderReceipt))throw new Error('RENDER_RECEIPT_PARITY_REQUIRED');
    const rendered=validateCodexRenderReceipt({receipt:read,root,artifactSha:receipt.artifactSha,assets,qids});
    if(!rendered.ok)throw new Error(rendered.issues.join(','));
    const main=execFileSync('git',['-C',root,'rev-parse','origin/main'],{encoding:'utf8'}).trim();
    if(execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim()!==main)throw new Error('WORKING_HEAD_MAIN_PARITY_REQUIRED');
    if(main!==receipt.remoteMainSha)throw new Error('REMOTE_MAIN_SHA_MISMATCH');
    const readBlob=gitBlobReader(root,main);
    if(gitBlobSha(readBlob(receipt.productionPath))!==receipt.artifactSha)throw new Error('REMOTE_PRODUCTION_BLOB_MISMATCH');
    for(const asset of assets){if(!asset.ref.startsWith('assets/images/') || asset.ref.includes('..'))throw new Error('REMOTE_ASSET_PATH_INVALID');if(hash(readBlob('archive/'+asset.ref))!==asset.sha256)throw new Error('REMOTE_ASSET_SHA_MISMATCH:'+asset.ref);}
  }catch(error){issues.push(error.message);}
  return {ok:!issues.length,disposition:issues.length?'FAIL':'PASS',issues};
}
