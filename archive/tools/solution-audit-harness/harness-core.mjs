/** Gemini Drive-only solution audit P0: source provenance + deterministic edits + fail-closed validation.
 * No Git/Notion/Drive access is exercised by Gemini. No source JS writes occur.
 * Reuses archive/tools/pipeline-core/canonical.mjs hash serialization.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { canonicalJson, objectSha } from '../pipeline-core/canonical.mjs';

export const SCHEMA = 'JS_SOLUTION_AUDIT_P0_v1';
export function gitBlobFromSource(source) {
  const bytes=Buffer.from(source,'utf8');
  return crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
}
export const AUTHORING_LABELS = ['[키포인트]', '조건 정리:', '풀이 방향:', '정석 풀이:', '(확인:', '[오답 및 경계 점검]'];
const assetKeys = ['image','visualAsset','solutionImage','fullPageImagePath','fullPageImageRelPath','sourceEvidencePath','sourcePageEvidencePaths'];
const shaPattern = /^[0-9a-f]{40}$/;
const approvals = new Set(['KEEP', 'UPGRADE_NEEDED', 'HOLD']);
const kinds = new Set(['LABEL_ONLY','FORMAT_ONLY','CALCULATION_OMISSION','CASE_SPLIT_OR_CONDITION_OMISSION','CURRICULUM_MISMATCH']);

function fail(code) { throw new Error(code); }
function hasOwn(o,k) { return Object.prototype.hasOwnProperty.call(o,k); }
export function enforceOriginalPath(p) {
  if(typeof p!=='string' || !/^archive\/exams\/original\/[\w\p{L}\p{N}/._-]+_기출\.js$/u.test(p) || p.split('/').includes('..') || /교과서|유사|백발백중|변형/.test(p)) fail('NON_ORIGINAL_EXAM_PATH');
  return p;
}
export function safeRepoFile(repo, relative) {
  enforceOriginalPath(relative);
  const root=fs.realpathSync(repo), candidate=fs.realpathSync(path.resolve(root,relative));
  if(!candidate.startsWith(root+path.sep)) fail('PATH_ESCAPE');
  return candidate;
}
export function loadExamJs(source) {
  const sandbox={window:{}};
  vm.runInNewContext(source,sandbox,{timeout:1500,filename:'source-exam.js'});
  const questions=sandbox.window.questionBank;
  if(!Array.isArray(questions)||!questions.length) fail('QUESTION_BANK_MISSING');
  const mapped=JSON.parse(JSON.stringify(questions));
  if(mapped.some(q=>!Number.isInteger(q.id)||q.id<1||typeof q.content!=='string'||typeof q.solution!=='string'||typeof q.answer!=='string'||!Array.isArray(q.choices)))fail('INVALID_ITEM_FORMAT');
  if(new Set(mapped.map(q=>q.id)).size!==mapped.length)fail('DUPLICATE_QID');
  return mapped;
}
function extractAssets(q){return Object.fromEntries(assetKeys.map(k=>[k,q[k]??(k==='sourcePageEvidencePaths'?[]:'')]));}
function absoluteHashFields(q,pathName,ordinal) {
  const assets=extractAssets(q),contentHash=objectSha(q.content),choicesHash=objectSha(q.choices),imageRefHash=objectSha(assets);
  return { contentHash, choicesHash, answerHash:objectSha(q.answer), imageRefHash, beforeSolutionHash:objectSha(q.solution),
    sourceIdentityFingerprint:objectSha({sourceArchiveFile:pathName,sourceOrdinal:ordinal,contentHash,choicesHash,imageRefHash})};
}
function resolvedUid(q,ordinal,sourcePath,hashes,identityMap) {
  const candidates=identityMap?.items?.filter(i=>i.sourceArchiveFile===sourcePath&&i.sourceOrdinal===ordinal&&i.qid===q.id)??[];
  if(candidates.length>1)fail('DUPLICATE_IDENTITY_MAP');
  const row=candidates[0];
  if(!row) return {identityStatus:'IDENTITY_HOLD',questionUid:null};
  if(!row.questionUid || !row.authorityRef || row.contentHash!==hashes.contentHash || row.choicesHash!==hashes.choicesHash || row.imageRefHash!==hashes.imageRefHash) return {identityStatus:'IDENTITY_HOLD',questionUid:null};
  if(q.questionUid&&q.questionUid!==row.questionUid)return {identityStatus:'IDENTITY_HOLD',questionUid:null};
  return {identityStatus:'RESOLVED_VERIFIED',questionUid:row.questionUid,authorityRef:row.authorityRef};
}
export function freezePacket({source,sourceArchiveFile,gitBlobSha,gitHeadSha,identityMap=null,batchId,createdAt='1970-01-01T00:00:00.000Z'}) {
  enforceOriginalPath(sourceArchiveFile);
  if(!shaPattern.test(gitBlobSha)||!shaPattern.test(gitHeadSha)||!batchId)fail('SOURCE_ATTESTATION_MISSING');
  if(gitBlobFromSource(source)!==gitBlobSha)fail('SOURCE_BLOB_MISMATCH');
  const q=loadExamJs(source),items=q.map((v,i)=>{
    const ordinal=i+1, hashes=absoluteHashFields(v,sourceArchiveFile,ordinal),id=resolvedUid(v,ordinal,sourceArchiveFile,hashes,identityMap);
    return {sourceOrdinal:ordinal,qid:v.id,sourcePacketItemKey:objectSha({sourceArchiveFile,ordinal,qid:v.id,contentHash:hashes.contentHash}),...id,
      content:v.content,choices:v.choices,answer:v.answer,solution:v.solution,imageRefs:extractAssets(v),...hashes};
  });
  const basis={schemaVersion:SCHEMA,batchId,createdAt,sourceArchiveFile,gitHeadSha,gitBlobSha,examCount:q.length,
    identityAuthority:identityMap?.authorityId??null,items};
  return {...basis,packetSha256:objectSha(basis),packetStatus:'FROZEN'};
}
export function extractFromRepository({repo,relative,headSha,identityMap,batchId}) {
  const file=safeRepoFile(repo,relative),source=fs.readFileSync(file,'utf8');
  const gitBlobSha=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
  const actualHead=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
  if(headSha&&actualHead!==headSha)fail('SOURCE_HEAD_MISMATCH');
  const packet=freezePacket({source,sourceArchiveFile:relative,gitBlobSha,gitHeadSha:actualHead,identityMap,batchId,createdAt:new Date().toISOString()});
  return packet;
}
export function verifyPacketHash(packet){
  const {packetSha256,packetStatus,...basis}=packet;
  return packetStatus==='FROZEN' && objectSha(basis)===packetSha256;
}
export function containsBoilerplate(s){return AUTHORING_LABELS.some(k=>s.includes(k));}
/** Deterministic LABEL_ONLY editing: no mathematical token may change. */
export function stripAuthoringLabels(before){
  if(typeof before!=='string')fail('SOLUTION_REQUIRED');
  let out=before.replace(/^\[키포인트\]\s*/u,'').replace(/^(?:조건 정리:|풀이 방향:|정석 풀이:)\s*/gmu,'').replace(/^\[오답 및 경계 점검\]\s*/gmu,'');
  // In-line authoring labels are not safely recognized as removable without an exact span.
  return out;
}
export function formatSkeleton(text) {return text.replace(/\s+/gu,'');}
function captureIssue(issues,code){if(!issues.includes(code))issues.push(code);}
export function validateDraft({packet,draft,currentSource,expectedGitBlobSha}) {
  const errors=[],items=[];
  if(!packet||!verifyPacketHash(packet))captureIssue(errors,'SNAPSHOT_HASH_MISMATCH');
  if(!draft||draft.schemaVersion!==SCHEMA||draft.packetSha256!==packet?.packetSha256)captureIssue(errors,'SNAPSHOT_BINDING_MISMATCH');
  if(expectedGitBlobSha&&packet?.gitBlobSha!==expectedGitBlobSha)captureIssue(errors,'SOURCE_BLOB_MISMATCH');
  if(currentSource){
    if(gitBlobFromSource(currentSource)!==packet.gitBlobSha)captureIssue(errors,'SOURCE_BLOB_MISMATCH');
    try {const live=loadExamJs(currentSource);if(packet.items.length!==live.length)captureIssue(errors,'SOURCE_COUNT_CHANGED');else live.forEach((q,i)=>{
      const item=packet.items[i],h=absoluteHashFields(q,packet.sourceArchiveFile,i+1);
      if(q.id!==item.qid||h.contentHash!==item.contentHash||h.beforeSolutionHash!==item.beforeSolutionHash||h.choicesHash!==item.choicesHash||h.imageRefHash!==item.imageRefHash||h.answerHash!==item.answerHash)captureIssue(errors,'SOURCE_PARITY_CHANGED');
    });}catch{captureIssue(errors,'SOURCE_READ_FAILED');}
  }
  if(!Array.isArray(packet?.items)||!Array.isArray(draft?.items)){captureIssue(errors,'INVALID_ITEMS');return {schemaVersion:SCHEMA,status:'HOLD_AUDIT_REWORK',errors,items};}
  if(draft.items.length!==packet.examCount||packet.items.length!==packet.examCount)captureIssue(errors,'COUNT_PARITY_FAIL');
  if(new Set(draft.items.map(r=>r.sourcePacketItemKey)).size!==draft.items.length)captureIssue(errors,'DUPLICATE_DECISION_ROW');
  const byKey=new Map(draft.items.map(x=>[x.sourcePacketItemKey,x]));
  for(const item of packet.items){
    const row=byKey.get(item.sourcePacketItemKey),faults=[];
    if(!row){faults.push('QUESTION_NOT_READ');items.push({qid:item.qid,status:'HOLD',errors:faults});continue;}
    if(row.qid!==item.qid||row.sourceOrdinal!==item.sourceOrdinal||row.contentHash!==item.contentHash||row.beforeSolutionHash!==item.beforeSolutionHash){faults.push('QUESTION_BINDING_MISMATCH');}
    if(!approvals.has(row.decision))faults.push('INVALID_DECISION');
    if(item.identityStatus!=='RESOLVED_VERIFIED'||row.questionUid!==item.questionUid)faults.push('UID_UNRESOLVED');
    if(!Array.isArray(row.sourceAnchors)||!row.sourceAnchors.length||row.sourceAnchors.some(a=>!item.content.includes(a)&&!item.solution.includes(a)))faults.push('SOURCE_ANCHORS_MISSING');
    if(row.decision==='KEEP'){
      if(containsBoilerplate(item.solution))faults.push('KEEP_HAS_AUTHORING_LABEL');
      if(typeof row.reason!=='string'||row.reason.trim().length<12)faults.push('KEEP_REASON_MISSING');
      if(row.editKind||row.afterProposal)faults.push('KEEP_HAS_REPAIR');
    }else if(row.decision==='UPGRADE_NEEDED'){
      if(!kinds.has(row.editKind))faults.push('INVALID_EDIT_KIND');
      if(row.editKind==='LABEL_ONLY'){
        if(!containsBoilerplate(item.solution))faults.push('LABEL_NOT_PRESENT');
        const exact=stripAuthoringLabels(item.solution);
        if(exact===item.solution||containsBoilerplate(exact))faults.push('LABEL_STRIP_UNSAFE');
        if(row.afterProposal!==exact)faults.push('LABEL_ONLY_MATH_CHANGED');
      }else if(row.editKind==='FORMAT_ONLY'){
        if(formatSkeleton(item.solution)!==formatSkeleton(row.afterProposal||''))faults.push('FORMATTING_ONLY_MATH_CHANGED');
      }else if(kinds.has(row.editKind)){
        if(typeof row.afterProposal!=='string'||!row.afterProposal.trim())faults.push('AFTER_MISSING');
        if(row.afterProposal&&item.answer&&!row.afterProposal.includes(item.answer))faults.push('ANSWER_MISMATCH');
        // A general proof checker does not exist in P0. Do not auto-approve semantic rewrites.
        faults.push('AFTER_MATH_UNVERIFIED');
      }
    }else if(row.decision==='HOLD' && row.afterProposal)faults.push('HOLD_HAS_AFTER');
    if(row.validation?.nodeCheckPostRepair==='PASS'||row.validation?.browserSolPostRepair==='PASS')faults.push('TOOL_NOT_RUN_BUT_MARKED_PASS');
    if(faults.length) faults.forEach(f=>captureIssue(errors,f));
    items.push({qid:item.qid,status:faults.length?'HOLD':row.decision,errors:faults});
  }
  if(draft.items.some(d=>!packet.items.some(i=>i.sourcePacketItemKey===d.sourcePacketItemKey)))captureIssue(errors,'UNKNOWN_DECISION_ROW');
  // P0 is validation-only. No human independent math approval is represented here.
  const status=errors.length?'HOLD_AUDIT_REWORK':'STRUCTURE_VALIDATED_ONLY';
  return {schemaVersion:SCHEMA,sourcePacketSha256:packet.packetSha256,status,errors,items,
    checks:{sourceSnapshot:errors.includes('SNAPSHOT_HASH_MISMATCH')?'FAIL':'PASS',semanticMath:'NOT_RUN (INDEPENDENT_REVIEW_REQUIRED)',nodeCheckPostRepair:'NOT_RUN (REPAIR_WORKER_HANDOFF)',browserSolPostRepair:'NOT_RUN (REPAIR_WORKER_HANDOFF)'},
    readyForRepair:false};
}
export function writeNewJson(outPath,value){fs.mkdirSync(path.dirname(outPath),{recursive:true});fs.writeFileSync(outPath,canonicalJson(value)+'\n',{flag:'wx'});}
