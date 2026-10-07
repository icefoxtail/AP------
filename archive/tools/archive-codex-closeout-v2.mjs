import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
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
    const readBlob=ref=>execFileSync('git',['-C',root,'show',main+':'+ref]);
    const production=readBlob(receipt.productionPath);
    if(gitBlobSha(production)!==receipt.artifactSha || hash(production)!==receipt.artifactRawSha256)throw new Error('REMOTE_PRODUCTION_ARTIFACT_MISMATCH');
    for(const asset of receipt.assets){
      if(hash(readBlob('archive/'+asset.ref))!==asset.sha256)throw new Error('REMOTE_ASSET_SHA_MISMATCH:'+asset.ref);
    }
  }catch(error){issues.push(error.message);}
  return {ok:!issues.length,disposition:issues.length?'FAIL':'PASS',completionBasis:issues.length?undefined:'USER_DIRECTED_STATIC_COMPLETE',renderStatus:issues.length?undefined:'NOT_RUN_USER_WAIVER',issues};
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
    const readBlob=p=>execFileSync('git',['-C',root,'show',main+':'+p]);
    if(gitBlobSha(readBlob(receipt.productionPath))!==receipt.artifactSha)throw new Error('REMOTE_PRODUCTION_BLOB_MISMATCH');
    for(const asset of assets){if(!asset.ref.startsWith('assets/images/') || asset.ref.includes('..'))throw new Error('REMOTE_ASSET_PATH_INVALID');if(hash(readBlob('archive/'+asset.ref))!==asset.sha256)throw new Error('REMOTE_ASSET_SHA_MISMATCH:'+asset.ref);}
  }catch(error){issues.push(error.message);}
  return {ok:!issues.length,disposition:issues.length?'FAIL':'PASS',issues};
}
