#!/usr/bin/env node
// Closed, disposable-checkout verification. It never commits, pushes, authors
// exam sources, or substitutes an orchestration result for an official guard.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync, execFileSync} from 'node:child_process';
import {pathToFileURL, fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

export const HEAD = '27f87bb0dc438f1bd3624fd5ba3f6c1771b8293c';
export const TREE = '6a0f590e19e63a52fbb61b3593f762eee5ab4d8a';
export const SCOPE_SHA = 'c8ef4719ceda2a0fb16aa74a3f1368e5f78670b6c218353cc343cb579ff9060f';
const BRANCH = 'refs/heads/review-reference/m3-final547-official-gates-20261116';
const SCOPE_PATH = 'docs/operations/m3-final547-official-gates-20261116/input-manifest.json';
const RUNNER_PATH = 'tools/ci/verify-m3-final547-official-gates.mjs';
const WORKFLOW_PATH = '.github/workflows/m3-final547-official-gates.yml';
const SELF = fileURLToPath(import.meta.url);
const META = 'archive/data/question_metadata.json';
const ID = 'archive/data/question_identity_map.json';
const STATE = '.archive-meta-register/auto/state.json';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => crypto.createHash('sha1').update(`blob ${value.length}\0`).update(value).digest('hex');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const objectHash = value => sha(stable(value));
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); };
const fail = code => { throw new Error(code); };
const exact = (actual, expected, code) => { if (stable(actual) !== stable(expected)) fail(code); };
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], {env:{...process.env,GIT_NO_LAZY_FETCH:'1'}, maxBuffer:128*1024*1024, timeout:120000, stdio:['ignore','pipe','pipe']});
const gitText = (root, ...args) => git(root, ...args).toString().trim();
const nullList = bytes => bytes.toString().split('\0').filter(Boolean);

export function sanitizedError(error) {
  const message = String(error?.message || error);
  return {name:/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(error?.name || '') ? error.name : 'Error',
    messageSha256:sha(message), messageBytes:Buffer.byteLength(message),
    codes:[...new Set(message.match(/\b[A-Z][A-Z0-9_]{2,100}\b/g) || [])].slice(0,20),
    questionUids:[...new Set(message.match(/\bqid_v1_[a-f0-9]{64}\b/g) || [])].slice(0,20),
    knownReasons:['source Git blob drift','evidence missing/drift','source denominator mismatch','UID denominator mismatch',
      'requestId reused with different content','Consumer metadata mismatch','Consumer metadata conflict','native receipt was not verified']
      .filter(reason=>message.includes(reason)),
    fieldHints:['curriculumKey','courseKey','sourceFingerprint','contentFingerprint','problemTypeKey','templateKey',
      'conditionKeys','crossConceptKeys','standardCourse','standardUnitKey','subUnitKey','primaryMethod','decisiveStep']
      .filter(field=>new RegExp('\\b'+field+'\\b').test(message))};
}
export function validateScope(s) {
  assert.equal(s.schemaVersion, 'archive-m3-final547-official-gates-input-v1');
  assert.equal(s.profile, 'EXACT_PUBLIC_M3_547_67_C0F6_27F87');
  assert.equal(s.publicPrHead, HEAD); assert.equal(s.publicPrTree, TREE);
  exact(s.expected, {requests:67,newRequests:45,preservationRequests:22,selected:547,newSelected:382,
    preservedSelected:165,sourceBanks:45,nativeOldChecks:547,nativeCaughtUpChecks:547,typedConsumerChecked:547,typedConsumerSkipped:0}, 'SCOPE_COUNTS');
  assert.equal(s.requests.length, 67); assert.equal(s.sources.length, 45);
  assert.equal(new Set(s.requests.map(r=>r.path)).size, 67);
  assert.equal(new Set(s.sources.map(r=>r.path)).size, 45);
  const uids = s.requests.flatMap(r=>r.questionUids);
  assert.equal(uids.length, 547); assert.equal(new Set(uids).size, 547);
  for (const row of s.requests) {
    assert(/^\.archive-meta-register\/inbox\/m3s2-e\d{3}-[a-z0-9-]+\.json$/.test(row.path));
    assert(row.path.endsWith('/' + row.requestId + '.json'));
    assert(/^[a-f0-9]{64}$/.test(row.sha256)); assert(/^[a-f0-9]{40}$/.test(row.gitBlobSha1));
    assert.equal(row.selectedCount, row.questionUids.length);
    assert(row.questionUids.every(u=>/^qid_v1_[a-f0-9]{64}$/.test(u)));
    assert(row.sourceArchiveFile.startsWith('original/middle/m3/2'));
    assert(['NEW_FINAL_QA','EXISTING_APPROVAL_PRESERVATION'].includes(row.lane));
  }
  for (const [lane, requests, selected] of [['NEW_FINAL_QA',45,382],['EXISTING_APPROVAL_PRESERVATION',22,165]]) {
    const rows=s.requests.filter(r=>r.lane===lane); assert.equal(rows.length,requests);
    assert.equal(rows.reduce((n,r)=>n+r.selectedCount,0),selected);
  }
  assert.equal(s.canonicalOperations.length, 1);
  assert.equal(s.canonicalOperations[0].match.conditionKey, 'COND_SPECIFIED_APPROXIMATIONS');
  assert.equal(s.canonicalOperations[0].before, null);
  assert.equal(s.originalE052Q5ConflictResolved, false);
  assert.equal(s.newMathematicalQa, false); assert.equal(s.newIndependentApprovalClaims, 0);
  return s;
}
function loadScope(file) {
  const bytes=fs.readFileSync(file); assert.equal(sha(bytes),SCOPE_SHA,'SCOPE_RAW_SHA_MISMATCH');
  return validateScope(JSON.parse(bytes));
}
export function validateRequest(row, bytes) {
  assert.equal(sha(bytes), row.sha256, 'REQUEST_RAW_DRIFT');
  assert.equal(blob(bytes), row.gitBlobSha1, 'REQUEST_GIT_BLOB_DRIFT');
  assert.equal(bytes.length, row.bytes, 'REQUEST_SIZE_DRIFT');
  const request=JSON.parse(bytes);
  assert.equal(request.schemaVersion,'archive-reviewed-exam-meta-register-request-v2');
  assert.equal(request.requestId,row.requestId);
  assert.equal(request.sourceArchiveFile,row.sourceArchiveFile);
  assert.equal(request.expectedSourceBlobSha1,row.expectedSourceBlobSha1);
  assert.equal(request.expectedQuestionCount,row.expectedQuestionCount);
  exact(request.items.map(i=>i.questionUid),row.questionUids,'REQUEST_UID_INVENTORY');
  return request;
}
export function requireConsumer(result) {
  assert.equal(result.status,'PASS','OFFICIAL_TYPED_CONSUMER_FAILED');
  exact(result.counts,{changed:547,checked:547,passed:547,skippedUnchanged:0},'CONSUMER_DENOMINATOR_OR_SKIP');
  assert.equal(result.failures.length,0,'CONSUMER_FAILURES');
}
export function requireNativeCounts(rows, expected) {
  assert.equal(rows.length,expected*2,'NATIVE_DENOMINATOR');
  for(const cursor of ['ACTUAL_OLD','CAUGHT_UP']) {
    const chosen=rows.filter(r=>r.cursor===cursor); assert.equal(chosen.length,expected,'NATIVE_CURSOR_DENOMINATOR');
    assert(chosen.every(r=>r.status==='PASS'),'NATIVE_REFUSAL');
  }
}
export function requirePhaseEvidence(observation, proof, phase, index=null) {
  assert.equal(observation.exitCode,0,'CHILD_NONZERO_EXIT');assert.equal(observation.signal,null,'CHILD_SIGNAL');
  assert.equal(observation.processError,null,'CHILD_PROCESS_ERROR');assert.equal(proof?.status,'PASS','CHILD_PROOF_NOT_PASS');
  assert.equal(proof.inputManifestSha256,SCOPE_SHA,'CHILD_INPUT_BINDING');assert.equal(proof.phase,phase,'CHILD_PHASE');assert.equal(proof.index,index,'CHILD_INDEX');
}
function opts(argv) {
  const out={};
  for(let i=0;i<argv.length;i+=2) {
    const key=argv[i]; assert(['--root','--scope','--output','--private','--phase','--index'].includes(key),'UNKNOWN_ARGUMENT');
    assert(argv[i+1]&&!Object.hasOwn(out,key.slice(2)),'MISSING_OR_DUPLICATE_ARGUMENT'); out[key.slice(2)]=argv[i+1];
  }
  for(const key of ['root','scope','output','private']) {assert(out[key],`MISSING_${key.toUpperCase()}`);out[key]=path.resolve(out[key]);}
  assert(!out.output.startsWith(out.root+path.sep)&&!out.private.startsWith(out.root+path.sep),'OUTPUT_INSIDE_CANDIDATE');
  assert(out.output!==out.private,'PRIVATE_AND_ARTIFACT_MUST_DIFFER');
  if(out.index!==undefined){out.index=Number(out.index);assert(Number.isSafeInteger(out.index)&&out.index>=0&&out.index<67,'REQUEST_INDEX');}
  return out;
}
function ref(root, relative) {
  const b=fs.readFileSync(path.join(root,relative));return {path:relative,gitBlobSha1:blob(b),sha256:sha(b),bytes:b.length};
}
function checkPinnedFile(root, row) {
  const actual=ref(root,row.path);
  for(const key of ['gitBlobSha1','sha256','bytes'])assert.equal(actual[key],row[key],'PINNED_INPUT_DRIFT:'+key);
  assert.equal(gitText(root,'rev-parse',`HEAD:${row.path}`),row.gitBlobSha1,'HEAD_INPUT_OID_DRIFT');
}
function protectedGitChanges(root, consumed=false, scope=null) {
  const changed=[...new Set([...nullList(git(root,'diff','--name-only','-z','HEAD','--')),
    ...nullList(git(root,'ls-files','--others','-z'))])];
  const allowedCanonical=new Set(['archive/data/meta-foundation/canonical/registry_index.json',...(scope?.canonicalOperations.map(r=>r.path)||[])]);
  const forbidden=changed.filter(p=>p.startsWith('archive/exams/')||p.startsWith('archive/assets/')||p.startsWith('tools/')||
    p.startsWith('archive/tools/')||p.startsWith('tests/')||p.startsWith('.github/')||p.startsWith('docs/')||
    p.startsWith('archive/data/item-4slot/')||p===STATE||p==='.archive-meta-register/auto/writer-state.json'||
    (p.startsWith('archive/data/meta-foundation/canonical/')&&!allowedCanonical.has(p)));
  assert.equal(forbidden.length,0,'PROTECTED_SOURCE_CODE_COMPACT_OR_STATE_CHANGED');
  const own=new Set(scope?.requests.map(r=>r.path)||[]);
  for(const p of changed.filter(p=>p.startsWith('.archive-meta-register/inbox/')))assert(consumed&&own.has(p),'FOREIGN_INBOX_CHANGED');
  return changed;
}
function runtimeDocs(root) {
  const names=nullList(git(root,'ls-tree','-r','--name-only','-z',HEAD,'--','archive/data/meta-foundation/runtime/')).filter(p=>p.endsWith('.json'));
  return names.map(p=>({path:p,doc:json(path.join(root,p))}));
}
function activeRuntimeDocs(root) {
  const require=createRequire(import.meta.url);
  const core=require(path.join(root,'archive/archive2-core.js'));
  assert(Array.isArray(core.Canonical.RUNTIME_INPUT_PATHS),'OFFICIAL_ACTIVE_RUNTIME_INVENTORY_MISSING');
  return core.Canonical.RUNTIME_INPUT_PATHS.map(p=>({path:'archive/'+p,doc:json(path.join(root,'archive',p))}));
}
function recordHashes(records,selected) {
  const rows=records.filter(r=>!selected.has(r.questionUid)).map(r=>[r.questionUid,objectHash(r)]).sort((a,b)=>a[0].localeCompare(b[0],'en'));
  assert.equal(new Set(rows.map(r=>r[0])).size,rows.length,'DUPLICATE_NONSELECTED_UID');return rows;
}
function fourSlotScope(index, sources) {
  const paths=new Set([...sources].map(p=>'archive/data/item-4slot/'+p.replace(/\.js$/,'.4slot.json')));
  const rows=index.records.filter(r=>sources.has(r.sourceArchiveFile)).map(r=>{
    const copy={...r};delete copy.sourceBinding;return [r.questionUid,objectHash(copy),r.sourceBinding??null];
  }).sort((a,b)=>a[0].localeCompare(b[0],'en'));
  const pending=index.pending.filter(r=>paths.has(r.path)).map(r=>objectHash(r)).sort();
  return {records:rows,pending};
}
async function baseline(o,s) {
  assert.equal(gitText(o.root,'rev-parse','HEAD'),HEAD,'WRONG_CANDIDATE_HEAD');
  assert.equal(gitText(o.root,'rev-parse','HEAD^{tree}'),TREE,'WRONG_CANDIDATE_TREE');
  assert.equal(gitText(o.root,'status','--porcelain=v1','--untracked-files=all'),'','CANDIDATE_NOT_PRISTINE');
  for(const commit of [s.actualBeforeCommit,s.publicSourceCandidate,s.publicInputCommit])git(o.root,'merge-base','--is-ancestor',commit,HEAD);
  for(const row of [...s.protectedInputs,...s.exactCurrentParentEvidence,...s.sources])checkPinnedFile(o.root,row);
  assert.equal(sha(fs.readFileSync(path.join(o.root,s.canonicalOperations[0].path))),s.canonicalOperations[0].currentWholeFileSha256,'CANONICAL_BEFORE_FILE_DRIFT');
  for(const row of s.requests)validateRequest(row,fs.readFileSync(path.join(o.root,row.path)));
  const selected=new Set(s.requests.flatMap(r=>r.questionUids)),sourceSet=new Set(s.requests.map(r=>r.sourceArchiveFile));
  const md=json(path.join(o.root,META)),identity=json(path.join(o.root,ID));
  const before={metadata:recordHashes(md.records,selected),identity:recordHashes(identity.records,selected),runtimes:[],
    canonicalFiles:nullList(git(o.root,'ls-tree','-r','--name-only','-z',HEAD,'--','archive/data/meta-foundation/canonical/')).filter(p=>p.endsWith('.json')).map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(o.root,p)))})),
    conditionRegistry:json(path.join(o.root,s.canonicalOperations[0].path)),
    fourSlot:fourSlotScope(json(path.join(o.root,'archive/data/item-4slot-index.json')),sourceSet)};
  for(const r of runtimeDocs(o.root))before.runtimes.push({path:r.path,rows:recordHashes(r.doc.records||[],selected)});
  writeJson(path.join(o.private,'baseline.json'),before);
  return {selected:547,requests:67,sourceBanks:45,nonselectedMetadata:before.metadata.length,nonselectedIdentity:before.identity.length,
    nonselectedRuntime:before.runtimes.reduce((n,r)=>n+r.rows.length,0),baselineDigests:{metadata:objectHash(before.metadata),identity:objectHash(before.identity),runtimes:objectHash(before.runtimes)},
    ownFourSlotRegistered:before.fourSlot.records.length,ownFourSlotPending:before.fourSlot.pending.length,pristineWholeCheckout:true};
}
async function registration(o,s,phase) {
  const row=s.requests[o.index],request=validateRequest(row,fs.readFileSync(path.join(o.root,row.path)));
  const {registerReviewedExamV2}=await import(pathToFileURL(path.join(o.root,'archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs')));
  const write=phase==='WRITE',projection=phase==='PROJECTION';
  const result=registerReviewedExamV2({root:o.root,request,write,verifyProjection:projection});
  assert.equal(result.status,'PASS','OFFICIAL_REGISTRAR_REFUSAL');
  assert.equal(result.replay,phase==='REPLAY'||projection,'UNEXPECTED_REPLAY_STATE');
  assert.equal(result.totalQuestions,row.selectedCount,'OFFICIAL_REQUEST_COUNT');
  for(const p of result.plannedPaths||[])assert(p.startsWith('archive/data/')&&!p.split('/').includes('..'),'REGISTRAR_PLANNED_WRITE_SCOPE');
  if(phase==='DRY')assert.equal(gitText(o.root,'status','--porcelain=v1','--untracked-files=all'),'','DRY_CHANGED_CHECKOUT');
  const record={requestId:row.requestId,requestPath:row.path,requestSha256:row.sha256,selected:row.selectedCount,
    replay:result.replay,write,projection,plannedPaths:result.plannedPaths||[],officialResultSha256:objectHash(result)};
  if(phase!=='DRY') {
    const p=RECEIPTS+request.requestId+'.json',receipt=json(path.join(o.root,p));
    assert.equal(receipt.requestSha256,objectHash(request),'ISSUED_REQUEST_BINDING');
    assert.equal(receipt.totalQuestions,row.selectedCount,'ISSUED_DENOMINATOR');
    assert.equal(receipt.sourceBlobSha1,row.expectedSourceBlobSha1,'ISSUED_SOURCE_BINDING');
    record.receipt={...ref(o.root,p),selected:receipt.totalQuestions,appliedRecordsSha256:objectHash(receipt.appliedRecords),
      appliedIdentityRecordsSha256:objectHash(receipt.appliedIdentityRecords),runtimeRecordsSha256:objectHash(receipt.runtimeRecords)};
  }
  protectedGitChanges(o.root,false,s);return record;
}
function runOfficial(o,name,argv,timeout=1200000) {
  const stdout=path.join(o.private,name+'.stdout'),stderr=path.join(o.private,name+'.stderr');
  const out=fs.openSync(stdout,'w'),err=fs.openSync(stderr,'w');let result;
  try{result=spawnSync(argv[0],argv.slice(1),{cwd:o.root,env:{...process.env,NODE_OPTIONS:'--max-old-space-size=4096',GIT_NO_LAZY_FETCH:'1'},
    timeout,stdio:['ignore',out,err],killSignal:'SIGKILL'});}finally{fs.closeSync(out);fs.closeSync(err);}
  const observation={command:argv,exitCode:result.status,signal:result.signal,error:result.error?sanitizedError(result.error):null,
    stdoutSha256:sha(fs.readFileSync(stdout)),stdoutBytes:fs.statSync(stdout).size,
    stderrSha256:sha(fs.readFileSync(stderr)),stderrBytes:fs.statSync(stderr).size};
  writeJson(path.join(o.output,'commands',name+'.json'),observation);
  return observation;
}
async function build(o,s) {
  const commands=[];
  commands.push(runOfficial(o,'compile-write',['node','archive/tools/meta-foundation/compile-meta-foundation.mjs','--write'],600000));
  assert.equal(commands.at(-1).exitCode,0,'COMPILE_FAILED');
  commands.push(runOfficial(o,'build-db-first',['python3','archive/build_db.py'],1200000));
  // Exactly the existing official writer's one generator fixed-point retry.
  if(commands.at(-1).exitCode!==0)commands.push(runOfficial(o,'build-db-fixed-point',['python3','archive/build_db.py'],1200000));
  assert.equal(commands.at(-1).exitCode,0,'OFFICIAL_BUILD_FAILED');
  for(const [name,argv] of [
    ['registration-parity',['node','archive/tools/verify-archive-registration.mjs']],
    ['catalog-check',['node','archive/tools/build-archive2-catalog.mjs','--check']],
    ['canonical-check',['node','archive/tools/meta-foundation/compile-meta-foundation.mjs','--canonical-only-check']]]) {
    const result=runOfficial(o,name,argv,600000);commands.push(result);assert.equal(result.exitCode,0,'OFFICIAL_DERIVED_GATE_FAILED');
  }
  protectedGitChanges(o.root,false,s);
  return {commands:commands.map(r=>({command:r.command,exitCode:r.exitCode,signal:r.signal})),sourceWrites:0,productionCodeWrites:0};
}
async function consumer(o,s,consumed) {
  const {verifyChangedUidConsumerApproval}=await import(pathToFileURL(path.join(o.root,'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs')));
  const requestPaths=s.requests.map(r=>consumed?path.join(o.private,'consumed-requests',path.basename(r.path)):r.path);
  if(consumed)for(const r of s.requests){assert(!fs.existsSync(path.join(o.root,r.path)),'OWN_INBOX_NOT_CONSUMED');validateRequest(r,fs.readFileSync(path.join(o.private,'consumed-requests',path.basename(r.path))));}
  const result=verifyChangedUidConsumerApproval({root:o.root,requestPaths});
  const report={officialStatus:result.status,counts:result.counts,consumed,
    failures:result.failures.map(f=>({uid:/^qid_v1_[a-f0-9]{64}$/.test(f.uid)?f.uid:null,reason:String(f.reason).replace(/[^A-Za-z0-9_]/g,'').slice(0,120),detailSha256:sha(String(f.detail||''))})),
    officialResultSha256:objectHash(result),assignmentPendingCount:result.assignmentPending?.length||0,unobservedFieldRows:result.unobservedFields?.length||0};
  writeJson(path.join(o.output,consumed?'consumed-consumer-observation.json':'consumer-observation.json'),report);
  requireConsumer(result);protectedGitChanges(o.root,consumed,s);return report;
}
async function consume(o,s) {
  fs.mkdirSync(path.join(o.private,'consumed-requests'),{recursive:true});
  for(const row of s.requests){const bytes=fs.readFileSync(path.join(o.root,row.path));validateRequest(row,bytes);const copy=path.join(o.private,'consumed-requests',path.basename(row.path));assert(!fs.existsSync(copy));fs.writeFileSync(copy,bytes,{flag:'wx'});fs.unlinkSync(path.join(o.root,row.path));}
  protectedGitChanges(o.root,true,s);return {consumedRequests:67,selected:547,allOriginalRequestBytesRetainedPrivately:true,otherInboxMutation:0};
}
async function native(o,s) {
  const row=s.requests[o.index],raw=fs.readFileSync(path.join(o.private,'consumed-requests',path.basename(row.path))),request=validateRequest(row,raw);
  const mod=await import(pathToFileURL(path.join(o.root,'archive/tools/meta-foundation/auto-register-merged-source.mjs')));
  const registryMod=await import(pathToFileURL(path.join(o.root,'archive/tools/meta-foundation/active-registry.mjs')));
  const identityMod=await import(pathToFileURL(path.join(o.root,'archive/tools/intelligence/question-identity-contract.mjs')));
  const md=json(path.join(o.root,META)),identityMap=json(path.join(o.root,ID)),state=json(path.join(o.root,STATE));
  const byUid=new Map(md.records.map(r=>[r.questionUid,r])),ids=new Map(identityMap.records.map(r=>[r.questionUid,r]));
  const identityByJoin=new Map(identityMap.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r]));
  const runtimes=activeRuntimeDocs(o.root),registry=registryMod.loadActiveMetaRegistry(o.root);assert.equal(registry.status,'ACTIVE');
  const source=request.sourceArchiveFile,bytes=fs.readFileSync(path.join(o.root,'archive/exams',source)),bank=mod.loadBank(bytes.toString(),source);
  assert.equal(blob(bytes),row.expectedSourceBlobSha1);assert.equal(bank.length,row.expectedQuestionCount);
  const testPath='tests/meta-foundation-middle-geometry-runtime.test.js',testBytes=fs.readFileSync(path.join(o.root,testPath)),text=testBytes.toString();
  const from=text.indexOf('function assertNativeApproval(input, label) {'),to=text.indexOf('\nfunction verifyHistoricalCohorts',from);
  assert(from>=0&&to>from,'EXACT_CI_NATIVE_FUNCTION_MISSING');const functionText=text.slice(from,to).trim();
  const assertNativeApproval=Function('assert','fs','path','sourceFingerprint','isUnambiguousLegacySourceUidAlias','validateActiveMetaFields','activeBindingContext','nativeReviewReceipt','return ('+functionText+');')(
    assert,fs,path,mod.sourceFingerprint,identityMod.isUnambiguousLegacySourceUidAlias,registryMod.validateActiveMetaFields,mod.activeBindingContext,mod.nativeReviewReceipt);
  const previous=new Map(),rows=[];
  for(const item of request.items) {
    const uid=item.questionUid,ordinal=item.sourceOrdinal,current=byUid.get(uid),id=ids.get(uid);
    const owners=runtimes.flatMap(r=>(r.doc.records||[]).filter(x=>x.questionUid===uid).map(record=>({pack:r.doc,record})));
    assert.equal(owners.length,1,'SELECTED_RUNTIME_OWNER_AMBIGUOUS');const {pack,record}=owners[0];assert.equal(pack.status,'ACTIVE');
    const base=state.pending?.[source+'#'+ordinal]?.baseCommit||state.lastProcessedCommit;assert(/^[a-f0-9]{40}$/.test(base),'OLD_CURSOR_MISSING');
    if(!previous.has(base)){const oldBytes=git(o.root,'show',base+':archive/exams/'+source);previous.set(base,{sha256:sha(oldBytes),bank:mod.loadBank(oldBytes.toString(),source)});}
    for(const cursor of ['ACTUAL_OLD','CAUGHT_UP']) {
      const input={question:bank[ordinal-1],previous:(cursor==='CAUGHT_UP'?bank:previous.get(base).bank)[ordinal-1],current,identity:id,registry,source,ordinal,runtimeOwner:pack.packId,
        nativeSource:{root:o.root,bytes,blobSha1:blob(bytes),bank,identityMap,identityByJoin,runtimeRecord:record,runtimeStatus:pack.status}};
      const nativeReceiptPath=assertNativeApproval(input,uid);assert.equal(nativeReceiptPath,RECEIPTS+request.requestId+'.json','NATIVE_ISSUED_RECEIPT_MISMATCH');
      const plan=mod.planQuestion({...input,validate:registryMod.validateActiveMetaFields});
      assert.equal(plan.status,'ALREADY_REGISTERED','NATIVE_PLAN_NOT_ALREADY_REGISTERED');assert.equal(plan.nativeReviewReceipt,nativeReceiptPath,'NATIVE_PLAN_RECEIPT_MISMATCH');
      rows.push({questionUid:uid,sourceOrdinal:ordinal,cursor,status:'PASS',nativeReceiptPath,planStatus:plan.status,
        oldCursorCommit:cursor==='ACTUAL_OLD'?base:null,oldSourceSha256:cursor==='ACTUAL_OLD'?previous.get(base).sha256:sha(bytes)});
    }
  }
  requireNativeCounts(rows,row.selectedCount);protectedGitChanges(o.root,true,s);
  return {requestId:row.requestId,selected:row.selectedCount,checks:rows.length,rows,
    exactCiNativeFunction:{path:testPath,gitBlobSha1:blob(testBytes),sha256:sha(testBytes),functionSha256:sha(functionText)},readOnly:true};
}
async function continuity(o,s) {
  const before=json(path.join(o.private,'baseline.json')),selected=new Set(s.requests.flatMap(r=>r.questionUids));
  const md=json(path.join(o.root,META)),id=json(path.join(o.root,ID));
  exact(recordHashes(md.records,selected),before.metadata,'NONSELECTED_METADATA_DRIFT');
  exact(recordHashes(id.records,selected),before.identity,'NONSELECTED_IDENTITY_DRIFT');
  const now=runtimeDocs(o.root).map(r=>({path:r.path,rows:recordHashes(r.doc.records||[],selected)}));
  exact(now,before.runtimes,'NONSELECTED_RUNTIME_DRIFT');
  const operation=s.canonicalOperations[0],current=json(path.join(o.root,operation.path)),inverse=structuredClone(current);
  const hits=current[operation.collection].filter(r=>Object.entries(operation.match).every(([k,v])=>r[k]===v));
  assert.equal(hits.length,1,'DECLARED_CANONICAL_ROW_COUNT');assert.equal(objectHash(hits[0]),operation.afterSha256,'DECLARED_CANONICAL_ROW_DRIFT');
  inverse[operation.collection]=current[operation.collection].filter(r=>!Object.entries(operation.match).every(([k,v])=>r[k]===v));
  exact(inverse,before.conditionRegistry,'UNDECLARED_CANONICAL_COLLECTION_CHANGE');
  for(const row of before.canonicalFiles)if(row.path!==operation.path&&!row.path.endsWith('/registry_index.json'))assert.equal(sha(fs.readFileSync(path.join(o.root,row.path))),row.sha256,'UNDECLARED_CANONICAL_FILE_CHANGE');
  for(const row of s.sources){const actual=ref(o.root,row.path);assert.equal(actual.gitBlobSha1,row.gitBlobSha1);assert.equal(actual.sha256,row.sha256);}
  protectedGitChanges(o.root,true,s);
  return {nonselectedMetadata:before.metadata.length,nonselectedIdentity:before.identity.length,
    nonselectedRuntime:before.runtimes.reduce((n,r)=>n+r.rows.length,0),wholeNonselectedRowsExact:true,
    sourceBanksByteExact:45,canonicalAddedRows:1,duplicateCanonicalAdds:0,compactWrites:0,sourceWrites:0,productionCodeWrites:0};
}
async function fourSlot(o,s) {
  const commands=[];
  for(const [name,args]of [
    ['four-slot-write',['node','tools/4slot/build-4slot-runtime.cjs','--write']],
    ['four-slot-cold-check',['node','tools/4slot/build-4slot-runtime.cjs','--check']],
    ['four-slot-data-test',['node','tests/item-4slot-data.test.cjs']]]){
    const result=runOfficial(o,name,args,1200000);commands.push(result);assert.equal(result.exitCode,0,'STRICT_FOUR_SLOT_GATE_FAILED');
  }
  const before=json(path.join(o.private,'baseline.json')).fourSlot,index=json(path.join(o.root,'archive/data/item-4slot-index.json'));
  const now=fourSlotScope(index,new Set(s.requests.map(r=>r.sourceArchiveFile)));
  const observation={beforeRegistered:before.records.length,afterRegistered:now.records.length,beforePending:before.pending.length,afterPending:now.pending.length,
    beforeDigest:objectHash(before),afterDigest:objectHash(now),wholeScopeCounts:index.counts,
    indexRef:ref(o.root,'archive/data/item-4slot-index.json'),commands:commands.map(r=>({command:r.command,exitCode:r.exitCode,signal:r.signal}))};
  writeJson(path.join(o.output,'four-slot-observation.json'),observation);
  exact(now.pending,before.pending,'OWN_SOURCE_FOUR_SLOT_HOLD_DRIFT');
  assert.equal(now.records.length,before.records.length,'OWN_SOURCE_FOUR_SLOT_REGISTERED_COUNT_DRIFT');
  let metadataOnlyWholeBlobTransitions=0;
  for(let i=0;i<before.records.length;i++) {
    exact(now.records[i].slice(0,2),before.records[i].slice(0,2),'OWN_SOURCE_FOUR_SLOT_VECTOR_OR_AUTHORITY_DRIFT');
    if(now.records[i][2]!==before.records[i][2]) {
      assert(before.records[i][2]==='EXACT_BLOB'&&now.records[i][2]==='UNCHANGED_STUDENT_PAYLOAD','UNEXPECTED_FOUR_SLOT_SOURCE_BINDING_TRANSITION');
      metadataOnlyWholeBlobTransitions++;
    }
  }
  protectedGitChanges(o.root,true,s);
  return {...observation,own45ExistingVectorsAndPendingExact:true,metadataOnlyWholeBlobTransitions,newSlotApprovalClaims:0};
}
const PHASES=new Set(['BASELINE','DRY','WRITE','REPLAY','BUILD','PROJECTION','CONSUMER','CONSUME','CONSUMED_CONSUMER','NATIVE','CONTINUITY','FOUR_SLOT']);
async function executePhase(o,s) {
  assert(PHASES.has(o.phase),'UNKNOWN_PHASE');
  const indexed=['DRY','WRITE','REPLAY','PROJECTION','NATIVE'].includes(o.phase);assert(indexed===(o.index!==undefined),'PHASE_INDEX_SHAPE');
  if(o.phase==='BASELINE')return baseline(o,s);
  if(['DRY','WRITE','REPLAY','PROJECTION'].includes(o.phase))return registration(o,s,o.phase);
  if(o.phase==='BUILD')return build(o,s);
  if(o.phase==='CONSUMER'||o.phase==='CONSUMED_CONSUMER')return consumer(o,s,o.phase==='CONSUMED_CONSUMER');
  if(o.phase==='CONSUME')return consume(o,s);
  if(o.phase==='NATIVE')return native(o,s);
  if(o.phase==='CONTINUITY')return continuity(o,s);
  if(o.phase==='FOUR_SLOT')return fourSlot(o,s);
}
async function phaseMain(o,s) {
  const label=o.phase.toLowerCase()+(o.index===undefined?'':'-'+String(o.index).padStart(2,'0'));
  const output=path.join(o.output,'phases',label+'.json');assert(!fs.existsSync(output),'PHASE_PROOF_ALREADY_EXISTS');
  const proof={schemaVersion:'archive-m3-final547-official-phase-v1',publicPrHead:HEAD,tree:TREE,inputManifestSha256:SCOPE_SHA,
    phase:o.phase,index:o.index??null,status:'FAIL',startedAt:new Date().toISOString(),remoteWrites:0};
  const start=Date.now();
  try{proof.result=await executePhase(o,s);proof.status='PASS';}catch(error){
    proof.error=sanitizedError(error);
    writeJson(path.join(o.private,label+'.error.json'),{name:String(error?.name),message:String(error?.message),stack:String(error?.stack)});
  }
  proof.elapsedMs=Date.now()-start;proof.resourceUsage=process.resourceUsage();writeJson(output,proof);
  console.log(JSON.stringify({phase:proof.phase,index:proof.index,status:proof.status,elapsedMs:proof.elapsedMs,proofSha256:sha(fs.readFileSync(output))}));
  process.exitCode=proof.status==='PASS'?0:1;
}
function measuredChild(o,phase,index,timeout) {
  const label=phase.toLowerCase()+(index===undefined?'':'-'+String(index).padStart(2,'0'));
  const perf=path.join(o.private,label+'.time'),stdout=path.join(o.private,label+'.stdout'),stderr=path.join(o.private,label+'.stderr');
  const args=['-f','{"maxRssKiB":%M,"elapsedSeconds":%e,"exitStatus":%x}','-o',perf,process.execPath,'--max-old-space-size=4096',SELF,
    '--root',o.root,'--scope',o.scope,'--output',o.output,'--private',o.private,'--phase',phase,...(index===undefined?[]:['--index',String(index)])];
  const out=fs.openSync(stdout,'w'),err=fs.openSync(stderr,'w');let result;
  const started=Date.now();try{result=spawnSync('/usr/bin/time',args,{cwd:o.root,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},timeout,stdio:['ignore',out,err],killSignal:'SIGKILL'});}finally{fs.closeSync(out);fs.closeSync(err);}
  const metrics=fs.existsSync(perf)?fs.readFileSync(perf,'utf8').split('\n').filter(x=>x.startsWith('{')).map(x=>JSON.parse(x)).at(-1):null;
  const file=path.join(o.output,'phases',label+'.json'),phaseProof=fs.existsSync(file)?json(file):null;
  const observation={phase,index:index??null,exitCode:result.status,signal:result.signal,timeoutMs:timeout,elapsedMs:Date.now()-started,
    processError:result.error?sanitizedError(result.error):null,metrics,stdoutSha256:sha(fs.readFileSync(stdout)),stderrSha256:sha(fs.readFileSync(stderr)),
    proof:phaseProof?{path:'phases/'+label+'.json',sha256:sha(fs.readFileSync(file)),bytes:fs.statSync(file).size}:null};
  writeJson(path.join(o.output,'processes',label+'.json'),observation);
  requirePhaseEvidence(observation,phaseProof,phase,index??null);
  return observation;
}
function systemResources() {
  let cgroupMemory=null;
  for(const p of ['/sys/fs/cgroup/memory.max','/sys/fs/cgroup/memory/memory.limit_in_bytes'])if(fs.existsSync(p)){
    const text=fs.readFileSync(p,'utf8').trim();if(/^\d+$/.test(text)){const n=Number(text);if(Number.isSafeInteger(n)&&n>0)cgroupMemory=Math.min(cgroupMemory??Infinity,n);}
  }
  return {totalMemoryBytes:os.totalmem(),freeMemoryBytes:os.freemem(),cgroupMemoryLimitBytes:cgroupMemory,cpuCount:os.cpus().length,nodeVersion:process.version};
}
async function allMain(o,s) {
  assert.equal(process.env.GITHUB_ACTIONS,'true','GITHUB_ACTIONS_ONLY');assert.equal(process.env.GITHUB_REF,BRANCH,'CLOSED_BRANCH_ONLY');
  fs.mkdirSync(o.output,{recursive:true});fs.mkdirSync(o.private,{recursive:true});
  const control=path.resolve(path.dirname(SELF),'../..'),codeHead=gitText(control,'rev-parse','HEAD');
  assert.equal(codeHead,process.env.GITHUB_SHA,'WORKFLOW_CHECKOUT_MISMATCH');
  exact(gitText(control,'show','-s','--format=%P','HEAD').split(' '),[HEAD],'WORKFLOW_PARENT_MISMATCH');
  exact(nullList(git(control,'diff','--name-only','-z',HEAD,'HEAD','--')).sort(),[WORKFLOW_PATH,RUNNER_PATH,SCOPE_PATH].sort(),'CONTROL_CODE_SCOPE');
  const report={schemaVersion:'archive-m3-final547-official-gates-proof-v1',status:'FAIL',workflowCommit:codeHead,publicPrHead:HEAD,publicPrTree:TREE,
    publicSourceCandidate:s.publicSourceCandidate,actualBeforeCommit:s.actualBeforeCommit,inputManifestSha256:SCOPE_SHA,
    runnerSha256:sha(fs.readFileSync(SELF)),workflowSha256:sha(fs.readFileSync(path.join(control,WORKFLOW_PATH))),resources:systemResources(),commands:[],testCheckoutOnly:true,
    mainRegistrationPerformed:false,sourcePayloadUploads:0,artifactContainsStudentPayloadOrWholeMetadataRecords:false,newMathematicalQa:false,
    originalE052Q5ConflictResolved:false,newIndependentApprovalClaims:0,remoteWrites:0};
  const disk=fs.statfsSync(o.root);report.resources.freeDiskBytesBefore=disk.bavail*disk.bsize;
  const save=()=>writeJson(path.join(o.output,'proof.json'),report);save();
  const run=(phase,index,timeout=300000)=>{const observation=measuredChild(o,phase,index,timeout);report.commands.push(observation);save();console.log(JSON.stringify({phase,index:index??null,status:'PASS',elapsedMs:observation.elapsedMs,maxRssKiB:observation.metrics?.maxRssKiB??null}));};
  try {
    const effective=Math.min(report.resources.totalMemoryBytes,report.resources.cgroupMemoryLimitBytes??Infinity);
    assert(effective>=5*1024**3,'RUNNER_MEMORY_BELOW_BOUNDED_CONTRACT');
    run('BASELINE',undefined,300000);
    for(let i=0;i<67;i++)run('DRY',i);
    for(let i=0;i<67;i++)run('WRITE',i);
    for(let i=0;i<67;i++)run('REPLAY',i);
    run('BUILD',undefined,3000000);
    for(let i=0;i<67;i++)run('PROJECTION',i,600000);
    run('CONSUMER',undefined,1200000);run('CONSUME');run('CONSUMED_CONSUMER',undefined,1200000);
    for(let i=0;i<67;i++)run('NATIVE',i,600000);
    run('FOUR_SLOT',undefined,3600000);run('CONTINUITY',undefined,600000);
    report.verified={officialDryRequests:67,officialWriteRequests:67,officialColdReplayRequests:67,projectionRequests:67,
      typedConsumer:547,consumedTypedConsumer:547,skipped:0,nativeOld:547,nativeCaughtUp:547,sourceBanksPreserved:45};
    report.status='PASS';
  } catch(error) {report.error=sanitizedError(error);}
  report.finishedAt=new Date().toISOString();const afterDisk=fs.statfsSync(o.root);report.resources.freeDiskBytesAfter=afterDisk.bavail*afterDisk.bsize;
  save();console.log(JSON.stringify({status:report.status,completedCommands:report.commands.length,proofSha256:sha(fs.readFileSync(path.join(o.output,'proof.json')))}));
  process.exitCode=report.status==='PASS'?0:1;
}
export function selfTest(scope) {
  let passed=0;const ok=fn=>{fn();passed++;},no=fn=>{assert.throws(fn);passed++;};
  ok(()=>validateScope(structuredClone(scope)));
  for(const mutate of [s=>s.publicPrHead='0'.repeat(40),s=>s.requests.pop(),s=>s.sources.pop(),s=>s.requests[1].path=s.requests[0].path,
    s=>s.requests[1].questionUids[0]=s.requests[0].questionUids[0],s=>s.expected.selected=546,s=>s.originalE052Q5ConflictResolved=true,
    s=>s.canonicalOperations[0].match.conditionKey='CC_POLYGON_INTERIOR_ANGLE_SUM'])no(()=>{const s=structuredClone(scope);mutate(s);validateScope(s);});
  const good={status:'PASS',counts:{changed:547,checked:547,passed:547,skippedUnchanged:0},failures:[]};ok(()=>requireConsumer(good));
  for(const mutate of [x=>x.status='FAIL',x=>x.counts.checked=546,x=>x.counts.skippedUnchanged=1,x=>x.failures.push({reason:'FAIL'})])no(()=>{const r=structuredClone(good);mutate(r);requireConsumer(r);});
  const n=[{cursor:'ACTUAL_OLD',status:'PASS'},{cursor:'CAUGHT_UP',status:'PASS'}];ok(()=>requireNativeCounts(n,1));
  no(()=>requireNativeCounts(n.slice(0,1),1));no(()=>requireNativeCounts([n[0],{cursor:'CAUGHT_UP',status:'FAIL'}],1));
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'synthetic',sourceArchiveFile:'original/middle/m3/2mid/synthetic.js',
    expectedSourceBlobSha1:'a'.repeat(40),expectedQuestionCount:1,items:[{questionUid:'qid_v1_'+'b'.repeat(64),after:{courseKey:'M3-2'}}]};
  const bytes=Buffer.from(JSON.stringify(request)),row={requestId:request.requestId,sourceArchiveFile:request.sourceArchiveFile,
    expectedSourceBlobSha1:request.expectedSourceBlobSha1,expectedQuestionCount:1,questionUids:request.items.map(x=>x.questionUid),sha256:sha(bytes),gitBlobSha1:blob(bytes),bytes:bytes.length};
  ok(()=>validateRequest(row,bytes));no(()=>validateRequest(row,Buffer.from(JSON.stringify({...request,expectedQuestionCount:2}))));
  no(()=>validateRequest({...row,questionUids:['qid_v1_'+'c'.repeat(64)]},bytes));no(()=>validateRequest({...row,expectedSourceBlobSha1:'d'.repeat(40)},bytes));
  const observation={exitCode:0,signal:null,processError:null},proof={status:'PASS',phase:'DRY',index:0,inputManifestSha256:SCOPE_SHA};
  ok(()=>requirePhaseEvidence(observation,proof,'DRY',0));
  no(()=>requirePhaseEvidence({...observation,exitCode:1},proof,'DRY',0));no(()=>requirePhaseEvidence({...observation,signal:'SIGKILL'},proof,'DRY',0));
  no(()=>requirePhaseEvidence(observation,null,'DRY',0));no(()=>requirePhaseEvidence(observation,{...proof,status:'FAIL'},'DRY',0));
  no(()=>requirePhaseEvidence(observation,{...proof,inputManifestSha256:'0'.repeat(64)},'DRY',0));no(()=>requirePhaseEvidence(observation,{...proof,index:1},'DRY',0));
  ok(()=>{const e=sanitizedError(new Error('private source and solver text qid_v1_'+'a'.repeat(64)+' SOURCE_DRIFT'));assert(!JSON.stringify(e).includes('private source'));assert.deepEqual(e.codes,['SOURCE_DRIFT']);});
  return {status:'PASS',passed,failed:0,skipped:0,actualOfficialGatesRun:0};
}
async function main() {
  if(process.argv[2]==='--self-test'){assert.equal(process.argv.length,4);console.log(JSON.stringify(selfTest(loadScope(path.resolve(process.argv[3])))));return;}
  const o=opts(process.argv.slice(2)),s=loadScope(o.scope);
  if(o.phase)await phaseMain(o,s);else await allMain(o,s);
}
if(process.argv[1]&&path.resolve(process.argv[1])===SELF)main().catch(error=>{console.error(JSON.stringify({status:'FAIL',error:sanitizedError(error)}));process.exitCode=1;});
