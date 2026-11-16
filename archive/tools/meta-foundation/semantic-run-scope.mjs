// A one-batch execution boundary, never an approval or a permanent source policy.
// Resolve both the descriptor and its complete inbox from immutable Git HEAD so
// native request consumption in the index/worktree cannot change this run's scope.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

export const SEMANTIC_RUN_SCOPE_DIR='.archive-meta-register/auto/run-scopes/';
export const SEMANTIC_RUN_SCOPE_SCHEMA='archive-semantic-run-scope-v1';
export const SEMANTIC_RUN_SCOPE_BINDING='archive-semantic-run-scope-binding-v1';
export const SEMANTIC_RUN_SCOPE_SCHEMA_V2='archive-semantic-run-scope-v2';
export const SEMANTIC_RUN_SCOPE_BINDING_V2='archive-semantic-run-scope-binding-v2';
export const M3S1_SOURCE_PREFIXES=Object.freeze(['original/middle/m3/1final/','original/middle/m3/1mid/']);
const INBOX='.archive-meta-register/inbox/';
const META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json';
const RUNTIME='archive/data/meta-foundation/runtime',FOUR_SLOT='archive/data/item-4slot-index.json';
const AUTO_STATE='.archive-meta-register/auto/state.json';
const DIGEST=/^[a-f0-9]{64}$/;
const FOUR_SLOT_RUN_NONCE='ARCHIVE_FOUR_SLOT_CHECK_NONCE';
const FOUR_SLOT_CHECK_FILE='scope-check.json';
const FOUR_SLOT_CHECK_SCHEMA='archive-four-slot-fresh-scope-check-v1';
// These capabilities are local to one invocation. JSON inputs and persisted
// reports cannot manufacture either a pre-mutation snapshot or a checked lane.
const scopeGuards=new WeakMap(),checkedFourSlotPasses=new WeakMap();
const stable=value=>JSON.stringify(value,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fail=reason=>{throw Error('SEMANTIC_RUN_SCOPE_'+reason);};
const git=(root,...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']});
const blobBytes=(root,blob)=>execFileSync('git',['cat-file','blob',blob],{cwd:root,maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']});
const exactKeys=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)
  &&stable(Object.keys(value).sort())===stable([...keys].sort());

function validateDescriptor(doc,relative){
  if(!exactKeys(doc,['schemaVersion','scopeId','phase','excludedSourcePrefixes','inboxBindings'])
    ||doc.schemaVersion!==SEMANTIC_RUN_SCOPE_SCHEMA
    ||!/^[a-z0-9][a-z0-9-]{2,100}$/.test(doc.scopeId||'')
    ||!/^phase[1-9][0-9]*$/.test(doc.phase||'')
    ||!Array.isArray(doc.excludedSourcePrefixes)
    ||stable([...doc.excludedSourcePrefixes].sort())!==stable(M3S1_SOURCE_PREFIXES)
    ||!Array.isArray(doc.inboxBindings)||doc.inboxBindings.length<1||doc.inboxBindings.length>500)
    fail('DESCRIPTOR_INVALID:'+relative);
  const seen=new Set();
  for(const row of doc.inboxBindings){
    if(!exactKeys(row,['path','sha256'])
      ||!/^\.archive-meta-register\/inbox\/[A-Za-z0-9][A-Za-z0-9._-]*\.json$/.test(row.path||'')
      ||!/^[a-f0-9]{64}$/.test(row.sha256||'')||seen.has(row.path))fail('BINDING_INVALID:'+relative);
    seen.add(row.path);
  }
}

// V2 separates the exact activating cohort from the complete immutable inbox.
// No additional input is omitted or approved: all its bytes are sealed below,
// and the existing PR/main registration selectors and validators remain intact.
function resolveCohortScope(root,head,entry,raw,descriptor,entries,inbox){
  if(!exactKeys(descriptor,['schemaVersion','scopeId','phase','excludedSourcePrefixes','cohortBindings'])
    ||descriptor.schemaVersion!==SEMANTIC_RUN_SCOPE_SCHEMA_V2
    ||!/^[a-z0-9][a-z0-9-]{2,100}$/.test(descriptor.scopeId||'')
    ||!/^phase[1-9][0-9]*$/.test(descriptor.phase||'')
    ||!Array.isArray(descriptor.excludedSourcePrefixes)
    ||stable([...descriptor.excludedSourcePrefixes].sort())!==stable(M3S1_SOURCE_PREFIXES)
    ||!Array.isArray(descriptor.cohortBindings)||descriptor.cohortBindings.length<1||descriptor.cohortBindings.length>500)
    fail('DESCRIPTOR_INVALID:'+entry.path);
  const seen=new Set(),validPath=p=>/^\.archive-meta-register\/inbox\/[A-Za-z0-9][A-Za-z0-9._-]*\.json$/.test(p||'');
  for(const row of descriptor.cohortBindings){
    if(!exactKeys(row,['path','sha256'])||!validPath(row.path)||!DIGEST.test(row.sha256||'')||seen.has(row.path))
      fail('BINDING_INVALID:'+entry.path);
    seen.add(row.path);
  }
  const present=descriptor.cohortBindings.filter(row=>inbox.has(row.path));
  if(!present.length)return null;
  if(present.length!==descriptor.cohortBindings.length)fail('PARTIAL_INBOX:'+entry.path);
  const complete=entries.filter(row=>row.path.startsWith(INBOX));
  if(complete.length>500)fail('INBOX_INVENTORY_TOO_LARGE:'+entry.path);
  const inboxBindings=complete.map(input=>{
    if(!validPath(input.path)||input.mode!=='100644'||input.type!=='blob')fail('INBOX_ENTRY_INVALID:'+input.path);
    return {path:input.path,sha256:sha(blobBytes(root,input.blob))};
  }).sort((a,b)=>a.path.localeCompare(b.path,'en'));
  const actual=new Map(inboxBindings.map(row=>[row.path,row.sha256]));
  for(const bound of descriptor.cohortBindings)if(actual.get(bound.path)!==bound.sha256)fail('INBOX_DRIFT:'+bound.path);
  const sealed={schemaVersion:SEMANTIC_RUN_SCOPE_BINDING_V2,head,descriptorPath:entry.path,
    descriptorRawSha256:sha(raw),scopeId:descriptor.scopeId,phase:descriptor.phase,
    excludedSourcePrefixes:[...M3S1_SOURCE_PREFIXES],
    cohortBindings:descriptor.cohortBindings.map(row=>({...row})).sort((a,b)=>a.path.localeCompare(b.path,'en')),
    inboxBindings};
  return {...sealed,active:true,scopeDigest:sha(stable(sealed))};
}

export function resolveSemanticRunScope(root){
  const head=git(root,'rev-parse','HEAD').trim();
  const entries=git(root,'ls-tree','-r','-z',head,'--',SEMANTIC_RUN_SCOPE_DIR,INBOX).split('\0').filter(Boolean).map(line=>{
    const match=/^(\d+) (\w+) ([a-f0-9]{40})\t([\s\S]+)$/.exec(line);
    if(!match)fail('TREE_INVALID');
    return {mode:match[1],type:match[2],blob:match[3],path:match[4]};
  });
  const inbox=new Map(entries.filter(row=>row.path.startsWith(INBOX)&&row.path.endsWith('.json')).map(row=>[row.path,row]));
  const descriptors=entries.filter(row=>row.path.startsWith(SEMANTIC_RUN_SCOPE_DIR));
  const active=[];
  for(const entry of descriptors){
    if(entry.mode!=='100644'||entry.type!=='blob'
      ||!/^\.archive-meta-register\/auto\/run-scopes\/[a-z0-9][a-z0-9-]*\.json$/.test(entry.path))fail('DESCRIPTOR_PATH_INVALID');
    const raw=blobBytes(root,entry.blob);
    if(raw.length>1024*1024)fail('DESCRIPTOR_TOO_LARGE');
    let descriptor;try{descriptor=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));}catch{fail('DESCRIPTOR_JSON_INVALID:'+entry.path);}
    if(descriptor?.schemaVersion===SEMANTIC_RUN_SCOPE_SCHEMA_V2){
      const scope=resolveCohortScope(root,head,entry,raw,descriptor,entries,inbox);
      if(scope)active.push(scope);
      continue;
    }
    validateDescriptor(descriptor,entry.path);
    const present=descriptor.inboxBindings.filter(row=>inbox.has(row.path));
    if(present.length===0)continue; // This batch is consumed; future jobs keep their normal policy.
    if(present.length!==descriptor.inboxBindings.length)fail('PARTIAL_INBOX:'+entry.path);
    if(inbox.size!==descriptor.inboxBindings.length)fail('EXTRA_INBOX:'+entry.path);
    for(const bound of descriptor.inboxBindings){
      const input=inbox.get(bound.path);
      if(input.mode!=='100644'||input.type!=='blob'||sha(blobBytes(root,input.blob))!==bound.sha256)
        fail('INBOX_DRIFT:'+bound.path);
    }
    const sealed={schemaVersion:SEMANTIC_RUN_SCOPE_BINDING,descriptorPath:entry.path,
      descriptorRawSha256:sha(raw),scopeId:descriptor.scopeId,phase:descriptor.phase,
      excludedSourcePrefixes:[...M3S1_SOURCE_PREFIXES],
      inboxBindings:[...descriptor.inboxBindings].sort((a,b)=>a.path.localeCompare(b.path,'en'))};
    active.push({...sealed,active:true,scopeDigest:sha(stable(sealed)),head});
  }
  if(active.length>1)fail('MULTIPLE_ACTIVE');
  return active[0]||{active:false,scopeDigest:null,excludedSourcePrefixes:[],head};
}

export function semanticRunScopeProof(scope){
  if(scope?.active===true&&scope.schemaVersion===SEMANTIC_RUN_SCOPE_BINDING_V2)
    return {schemaVersion:SEMANTIC_RUN_SCOPE_BINDING_V2,active:true,head:scope.head,
      scopeDigest:scope.scopeDigest,scopeId:scope.scopeId,phase:scope.phase,
      descriptorPath:scope.descriptorPath,descriptorRawSha256:scope.descriptorRawSha256,
      excludedSourcePrefixes:[...scope.excludedSourcePrefixes],cohortInputCount:scope.cohortBindings.length,
      boundInputCount:scope.inboxBindings.length,cohortBindings:scope.cohortBindings.map(row=>({...row})),
      inboxBindings:scope.inboxBindings.map(row=>({...row}))};
  return scope?.active===true?{schemaVersion:SEMANTIC_RUN_SCOPE_BINDING,active:true,
    scopeDigest:scope.scopeDigest,scopeId:scope.scopeId,phase:scope.phase,
    descriptorPath:scope.descriptorPath,descriptorRawSha256:scope.descriptorRawSha256,
    excludedSourcePrefixes:[...scope.excludedSourcePrefixes],boundInputCount:scope.inboxBindings.length}
    :{schemaVersion:SEMANTIC_RUN_SCOPE_BINDING,active:false,scopeDigest:null,excludedSourcePrefixes:[]};
}

export function assertSemanticRunScopeProof(proof,scope){
  // Historical unscoped reports remain readable only when this HEAD is unscoped.
  if(proof===undefined&&scope?.active!==true)return;
  if(stable(proof)!==stable(semanticRunScopeProof(scope)))fail('REPORT_BINDING_DRIFT');
}

export function excludesSemanticSource(scope,source){
  return scope?.active===true&&typeof source==='string'
    &&scope.excludedSourcePrefixes.some(prefix=>source.normalize('NFC').startsWith(prefix));
}

function sourceOf(row){
  if(typeof row?.sourceArchiveFile==='string')return row.sourceArchiveFile;
  if(typeof row?.sourceFile==='string')return row.sourceFile;
  if(typeof row?.sourceIdentity==='string')return row.sourceIdentity.replace(/#\d+$/,'');
  if(typeof row?.path==='string'&&row.path.startsWith('archive/data/item-4slot/'))
    return row.path.slice('archive/data/item-4slot/'.length).replace(/\.4slot\.json$/,'.js');
  return '';
}
function parseDocument(raw,relative,optional=false){
  if(raw===null){if(optional)return null;fail('SNAPSHOT_INPUT_MISSING:'+relative);}
  try{return JSON.parse(raw.toString('utf8'));}catch{fail('SNAPSHOT_JSON_INVALID:'+relative);}
}
function records(doc,label){if(!Array.isArray(doc?.records))fail('SNAPSHOT_RECORDS_INVALID:'+label);return doc.records;}
const sortedRows=rows=>rows.map(row=>structuredClone(row)).sort((a,b)=>stable(a).localeCompare(stable(b),'en'));

function captureRows(scope,originalUids,readBytes,runtimePaths){
  if(scope?.active!==true)return null;
  const document=(relative,optional=false)=>parseDocument(readBytes(relative),relative,optional);
  const metadata=records(document(META),META),identity=records(document(IDENTITY),IDENTITY);
  const uids=new Set(originalUids);
  for(const row of [...metadata,...identity])if(excludesSemanticSource(scope,sourceOf(row))&&typeof row.questionUid==='string')uids.add(row.questionUid);
  const belongs=row=>uids.has(row?.questionUid)||excludesSemanticSource(scope,sourceOf(row));
  const runtime={};
  for(const relative of runtimePaths){
    const selected=records(document(relative),relative).filter(belongs);
    if(selected.length)runtime[relative]=sortedRows(selected);
  }
  const fourRaw=readBytes(FOUR_SLOT),four=parseDocument(fourRaw,FOUR_SLOT,true),fourSlot={};
  for(const field of ['records','pending','files']){
    if(four&&!Array.isArray(four[field]))fail('SNAPSHOT_4SLOT_INVALID:'+field);
    fourSlot[field]=sortedRows((four?.[field]||[]).filter(belongs));
  }
  const rows={metadata:sortedRows(metadata.filter(belongs)),identity:sortedRows(identity.filter(belongs)),runtime,fourSlot};
  const pending=document(AUTO_STATE,true)?.pending||{};
  if(!pending||typeof pending!=='object'||Array.isArray(pending))fail('SNAPSHOT_PENDING_INVALID');
  const excludedPending=Object.fromEntries(Object.entries(pending)
    .filter(([key,target])=>excludesSemanticSource(scope,key)||excludesSemanticSource(scope,target?.sourceArchiveFile))
    .map(([key,target])=>[key,structuredClone(target)]));
  const counts={metadata:rows.metadata.length,identity:rows.identity.length,runtime:Object.values(runtime).reduce((n,r)=>n+r.length,0),
    fourSlotRecords:fourSlot.records.length,fourSlotPending:fourSlot.pending.length,fourSlotFiles:fourSlot.files.length};
  return {scopeDigest:scope.scopeDigest,protectedUids:[...uids].sort(),rows,counts,digest:sha(stable(rows)),
    fourSlotIndex:fourRaw===null?null:{sha256:sha(fourRaw),builderSha256:four?.builderSha256??null},
    excludedPending,pendingDigest:sha(stable(excludedPending))};
}

export function captureExcludedSemanticRows(root,scope,originalUids=[]){
  if(scope?.active!==true)return null;
  const runtimeDir=path.join(root,RUNTIME);if(!fs.existsSync(runtimeDir))fail('SNAPSHOT_INPUT_MISSING:'+RUNTIME);
  const runtimePaths=fs.readdirSync(runtimeDir).filter(name=>name.endsWith('.json')&&name!=='runtime-bridge-receipt.json')
    .sort().map(name=>RUNTIME+'/'+name);
  return captureRows(scope,originalUids,relative=>{
    const file=path.join(root,relative);return fs.existsSync(file)?fs.readFileSync(file):null;
  },runtimePaths);
}

// verify-local has no trusted in-memory producer context. Rebuild its baseline
// from this exact HEAD, never from the submitted proof or already-derived rows.
export function captureExcludedSemanticRowsAtHead(root,scope){
  if(scope?.active!==true)return null;
  if(!/^[a-f0-9]{40}$/.test(scope.head||''))fail('SNAPSHOT_HEAD_INVALID');
  const entries=new Map();
  for(const line of git(root,'ls-tree','-r','-z',scope.head,'--',META,IDENTITY,RUNTIME,FOUR_SLOT,AUTO_STATE).split('\0').filter(Boolean)){
    const m=/^(\d+) (\w+) ([a-f0-9]{40})\t([\s\S]+)$/.exec(line);
    if(!m||m[1]!=='100644'||m[2]!=='blob')fail('SNAPSHOT_TREE_INVALID');
    entries.set(m[4],m[3]);
  }
  const runtimePaths=[...entries.keys()].filter(file=>file.startsWith(RUNTIME+'/')
    &&!file.slice(RUNTIME.length+1).includes('/')&&file.endsWith('.json')&&!file.endsWith('/runtime-bridge-receipt.json')).sort();
  if(!git(root,'ls-tree','-d',scope.head,'--',RUNTIME).trim())fail('SNAPSHOT_INPUT_MISSING:'+RUNTIME);
  return captureRows(scope,[],relative=>entries.has(relative)
    ?execFileSync('git',['cat-file','blob',entries.get(relative)],{cwd:root,maxBuffer:256*1024*1024,stdio:['ignore','pipe','pipe']}):null,runtimePaths);
}

function checkedRekey(root,scope,before,after,capability){
  const check=checkedFourSlotPasses.get(capability);
  if(!check||check.root!==path.resolve(root)||check.head!==scope.head||check.scopeDigest!==scope.scopeDigest
    ||check.indexSha256!==after.fourSlotIndex?.sha256||check.builderSha256!==after.fourSlotIndex?.builderSha256)
    fail('FOUR_SLOT_FRESH_CHECK_REQUIRED');
  if(!DIGEST.test(before.fourSlotIndex?.builderSha256||'')||!DIGEST.test(after.fourSlotIndex?.builderSha256||'')
    ||before.fourSlotIndex.builderSha256===after.fourSlotIndex.builderSha256)fail('FOUR_SLOT_BUILDER_UNCHANGED');
  const project=files=>{
    const seen=new Set();
    return sortedRows(files.map(file=>{
      if(typeof file.path!=='string'||seen.has(file.path)||!DIGEST.test(file.inputHash||''))fail('FOUR_SLOT_REKEY_FILE_INVALID');
      seen.add(file.path);const {inputHash,...rest}=file;return rest;
    }));
  };
  const oldFiles=before.rows.fourSlot.files,newFiles=after.rows.fourSlot.files;
  const oldRows={...before.rows,fourSlot:{...before.rows.fourSlot,files:project(oldFiles)}};
  const newRows={...after.rows,fourSlot:{...after.rows.fourSlot,files:project(newFiles)}};
  if(stable(oldRows)!==stable(newRows))fail('EXCLUDED_ROW_MUTATION');
  const priorByPath=new Map(oldFiles.map(file=>[file.path,file.inputHash]));
  const paths=newFiles.filter(file=>priorByPath.get(file.path)!==file.inputHash).map(file=>file.path).sort();
  if(!paths.length)fail('FOUR_SLOT_REKEY_EMPTY');
  return {verified:true,field:'fourSlot.files.inputHash',changedFileCount:paths.length,paths,
    beforeBuilderSha256:before.fourSlotIndex.builderSha256,afterBuilderSha256:after.fourSlotIndex.builderSha256,
    checkedIndexSha256:check.indexSha256,checkEvidenceSha256:check.evidenceSha256};
}

export function assertExcludedSemanticRowsUnchanged(root,scope,before,{checkedFourSlotPass}={}){
  if(scope?.active!==true){if(before)fail('GUARD_SCOPE_DRIFT');return {active:false};}
  if(!before||before.scopeDigest!==scope.scopeDigest)fail('GUARD_SCOPE_DRIFT');
  const after=captureExcludedSemanticRows(root,scope,before.protectedUids);
  if(checkedFourSlotPass!==undefined){
    const check=checkedFourSlotPasses.get(checkedFourSlotPass);
    if(!check||check.root!==path.resolve(root)||check.head!==scope.head||check.scopeDigest!==scope.scopeDigest
      ||check.indexSha256!==after.fourSlotIndex?.sha256||check.builderSha256!==after.fourSlotIndex?.builderSha256)
      fail('FOUR_SLOT_CHECK_INDEX_DRIFT');
  }
  const exactRowsUnchanged=stable(before.rows)===stable(after.rows);
  if(!exactRowsUnchanged&&checkedFourSlotPass===undefined)fail('EXCLUDED_ROW_MUTATION');
  const cacheRekey=exactRowsUnchanged?null:checkedRekey(root,scope,before,after,checkedFourSlotPass);
  for(const [key,target]of Object.entries(before.excludedPending))
    if(!Object.hasOwn(after.excludedPending,key)||stable(target)!==stable(after.excludedPending[key]))fail('EXCLUDED_PENDING_MUTATION');
  return {active:true,scopeDigest:scope.scopeDigest,counts:before.counts,beforeDigest:before.digest,afterDigest:after.digest,
    unchanged:exactRowsUnchanged,semanticUnchanged:true,exactRowsUnchanged,cacheRekey,
    previousPendingPreserved:Object.keys(before.excludedPending).length,deferredPendingAfter:Object.keys(after.excludedPending).length};
}

export function beginSemanticRunScopeGuard(root){
  const scope=resolveSemanticRunScope(root),handle=Object.freeze({});
  scopeGuards.set(handle,{root:path.resolve(root),scope,before:captureExcludedSemanticRows(root,scope)});
  return handle;
}

export function finishSemanticRunScopeGuard(root,handle){
  const context=scopeGuards.get(handle);
  if(!context||context.root!==path.resolve(root))fail('PRIVATE_GUARD_REQUIRED');
  const scope=resolveSemanticRunScope(root);
  if((scope.active||context.scope.active)&&scope.head!==context.scope.head)fail('HEAD_DRIFT');
  assertSemanticRunScopeProof(semanticRunScopeProof(context.scope),scope);
  return {binding:semanticRunScopeProof(scope),excludedRows:assertExcludedSemanticRowsUnchanged(root,scope,context.before)};
}

export function verifySemanticRunScopeGuardProof(root,proof){
  const scope=resolveSemanticRunScope(root);
  if(proof===undefined&&!scope.active)return {binding:semanticRunScopeProof(scope),excludedRows:{active:false}};
  const actual={binding:semanticRunScopeProof(scope),
    excludedRows:assertExcludedSemanticRowsUnchanged(root,scope,captureExcludedSemanticRowsAtHead(root,scope))};
  if(stable(proof)!==stable(actual))fail('GUARD_PROOF_DRIFT');
  return actual;
}

function fourSlotPassEvidence(root,work){
  const read=relative=>{
    const file=path.join(work,relative),stat=fs.lstatSync(file);
    if(!stat.isFile()||stat.isSymbolicLink())fail('FOUR_SLOT_CHECK_FILE_INVALID');
    const raw=fs.readFileSync(file);return {value:parseDocument(raw,relative),sha256:sha(raw)};
  };
  const reports=['report.json','verify.json','replay.json'].map(read);
  const raw=fs.readFileSync(path.join(root,FOUR_SLOT)),index=parseDocument(raw,FOUR_SLOT);
  if(index?.schemaVersion!=='archive-item-4slot-runtime-v1'||!DIGEST.test(index.builderSha256||'')
    ||!DIGEST.test(index.inputDigest||'')||!Array.isArray(index.records)||!Array.isArray(index.pending)
    ||index.counts?.registered!==index.records.length||index.counts?.pending!==index.pending.length)
    fail('FOUR_SLOT_CHECK_INDEX_INVALID');
  const indexSha256=sha(raw);
  for(const [i,{value:r}]of reports.entries()){
    if(r.schemaVersion!==index.schemaVersion||!['PASS','PASS_WITH_SUPPLEMENTS'].includes(r.status)
      ||r.status!==(index.pending.length?'PASS_WITH_SUPPLEMENTS':'PASS')||r.indexSha256!==indexSha256
      ||r.inputDigest!==index.inputDigest||stable(r.counts)!==stable(index.counts)
      ||r.verified!==index.records.length||r.pending!==index.pending.length||r.sourceMutation!==0
      ||r.semanticApprovalMutation!==0||r.output!==FOUR_SLOT||r.write!==(i===0)
      ||typeof r.changed!=='boolean'||(i>0&&r.changed!==false))fail('FOUR_SLOT_CHECK_NOT_COMPLETE');
  }
  return {head:git(root,'rev-parse','HEAD').trim(),indexSha256,builderSha256:index.builderSha256,
    inputDigest:index.inputDigest,reports:reports.map((r,i)=>({path:['report.json','verify.json','replay.json'][i],sha256:r.sha256}))};
}

// Called by archive-four-slot-pass.sh only after its full builder --check,
// replay, Consumer and path guards succeeded. This transient challenge never
// enters deterministic last-verification/receipt bytes.
export function recordFourSlotScopeCheck(root,work,nonce){
  if(!DIGEST.test(nonce||''))fail('FOUR_SLOT_CHECK_NONCE_INVALID');
  const witness={schemaVersion:FOUR_SLOT_CHECK_SCHEMA,nonce,...fourSlotPassEvidence(root,work)};
  fs.writeFileSync(path.join(work,FOUR_SLOT_CHECK_FILE),JSON.stringify(witness)+'\n',{flag:'wx',mode:0o600});
}

// The main writer is the only production caller. A plain request/report object
// is never a capability. The callback must finish the fixed official command;
// failed, skipped, stale or differently configured lanes cannot enable rekeying.
export async function executeFourSlotScopeCheck({root,scope,lane,env,execute}){
  if(!scope?.active||lane.id!=='fourSlot'||stable(lane.commands)!==stable([{program:'bash',args:['tools/ci/archive-four-slot-pass.sh']}]))
    return {result:await execute(env),checkedFourSlotPass:undefined};
  const work=path.join(env.RUNNER_TEMP,'archive-four-slot'),nonce=crypto.randomBytes(32).toString('hex');
  fs.mkdirSync(work,{recursive:true});fs.rmSync(path.join(work,FOUR_SLOT_CHECK_FILE),{force:true});
  const result=await execute({...env,[FOUR_SLOT_RUN_NONCE]:nonce});
  const file=path.join(work,FOUR_SLOT_CHECK_FILE),stat=fs.lstatSync(file);
  if(!stat.isFile()||stat.isSymbolicLink())fail('FOUR_SLOT_CHECK_FILE_INVALID');
  const witness=parseDocument(fs.readFileSync(file),FOUR_SLOT_CHECK_FILE),evidence=fourSlotPassEvidence(root,work);
  if(stable(witness)!==stable({schemaVersion:FOUR_SLOT_CHECK_SCHEMA,nonce,...evidence})||evidence.head!==scope.head)
    fail('FOUR_SLOT_CHECK_BINDING_DRIFT');
  const capability=Object.freeze({});
  checkedFourSlotPasses.set(capability,{root:path.resolve(root),scopeDigest:scope.scopeDigest,...evidence,evidenceSha256:sha(stable(evidence))});
  return {result,checkedFourSlotPass:capability};
}
