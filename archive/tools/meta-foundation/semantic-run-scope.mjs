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
export const M3S1_SOURCE_PREFIXES=Object.freeze(['original/middle/m3/1final/','original/middle/m3/1mid/']);
const INBOX='.archive-meta-register/inbox/';
const META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json';
const RUNTIME='archive/data/meta-foundation/runtime',FOUR_SLOT='archive/data/item-4slot-index.json';
const AUTO_STATE='.archive-meta-register/auto/state.json';
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
function document(root,relative,optional=false){
  const file=path.join(root,relative);
  if(!fs.existsSync(file)){if(optional)return null;fail('SNAPSHOT_INPUT_MISSING:'+relative);}
  try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{fail('SNAPSHOT_JSON_INVALID:'+relative);}
}
function records(doc,label){if(!Array.isArray(doc?.records))fail('SNAPSHOT_RECORDS_INVALID:'+label);return doc.records;}
const sortedRows=rows=>rows.map(row=>structuredClone(row)).sort((a,b)=>stable(a).localeCompare(stable(b),'en'));

export function captureExcludedSemanticRows(root,scope,originalUids=[]){
  if(scope?.active!==true)return null;
  const metadata=records(document(root,META),META),identity=records(document(root,IDENTITY),IDENTITY);
  const uids=new Set(originalUids);
  for(const row of [...metadata,...identity])if(excludesSemanticSource(scope,sourceOf(row))&&typeof row.questionUid==='string')uids.add(row.questionUid);
  const belongs=row=>uids.has(row?.questionUid)||excludesSemanticSource(scope,sourceOf(row));
  const runtimeDir=path.join(root,RUNTIME);if(!fs.existsSync(runtimeDir))fail('SNAPSHOT_INPUT_MISSING:'+RUNTIME);
  const runtime={};
  for(const name of fs.readdirSync(runtimeDir).filter(name=>name.endsWith('.json')&&name!=='runtime-bridge-receipt.json').sort()){
    const relative=RUNTIME+'/'+name,selected=records(document(root,relative),relative).filter(belongs);
    if(selected.length)runtime[relative]=sortedRows(selected);
  }
  const four=document(root,FOUR_SLOT,true),fourSlot={};
  for(const field of ['records','pending','files']){
    if(four&&!Array.isArray(four[field]))fail('SNAPSHOT_4SLOT_INVALID:'+field);
    fourSlot[field]=sortedRows((four?.[field]||[]).filter(belongs));
  }
  const rows={metadata:sortedRows(metadata.filter(belongs)),identity:sortedRows(identity.filter(belongs)),runtime,fourSlot};
  const pending=document(root,AUTO_STATE,true)?.pending||{};
  if(!pending||typeof pending!=='object'||Array.isArray(pending))fail('SNAPSHOT_PENDING_INVALID');
  const excludedPending=Object.fromEntries(Object.entries(pending)
    .filter(([key,target])=>excludesSemanticSource(scope,key)||excludesSemanticSource(scope,target?.sourceArchiveFile))
    .map(([key,target])=>[key,structuredClone(target)]));
  const counts={metadata:rows.metadata.length,identity:rows.identity.length,runtime:Object.values(runtime).reduce((n,r)=>n+r.length,0),
    fourSlotRecords:fourSlot.records.length,fourSlotPending:fourSlot.pending.length,fourSlotFiles:fourSlot.files.length};
  return {scopeDigest:scope.scopeDigest,protectedUids:[...uids].sort(),rows,counts,digest:sha(stable(rows)),
    excludedPending,pendingDigest:sha(stable(excludedPending))};
}

export function assertExcludedSemanticRowsUnchanged(root,scope,before){
  if(scope?.active!==true){if(before)fail('GUARD_SCOPE_DRIFT');return {active:false};}
  if(!before||before.scopeDigest!==scope.scopeDigest)fail('GUARD_SCOPE_DRIFT');
  const after=captureExcludedSemanticRows(root,scope,before.protectedUids);
  if(stable(before.rows)!==stable(after.rows))fail('EXCLUDED_ROW_MUTATION');
  for(const [key,target]of Object.entries(before.excludedPending))
    if(!Object.hasOwn(after.excludedPending,key)||stable(target)!==stable(after.excludedPending[key]))fail('EXCLUDED_PENDING_MUTATION');
  return {active:true,scopeDigest:scope.scopeDigest,counts:before.counts,beforeDigest:before.digest,afterDigest:after.digest,unchanged:true,
    previousPendingPreserved:Object.keys(before.excludedPending).length,deferredPendingAfter:Object.keys(after.excludedPending).length};
}
