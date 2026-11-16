import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {SEMANTIC_RUN_SCOPE_DIR,SEMANTIC_RUN_SCOPE_SCHEMA,M3S1_SOURCE_PREFIXES,resolveSemanticRunScope,
  semanticRunScopeProof,captureExcludedSemanticRows,assertExcludedSemanticRowsUnchanged,
  captureExcludedSemanticRowsAtHead,beginSemanticRunScopeGuard,finishSemanticRunScopeGuard,verifySemanticRunScopeGuardProof,
  executeFourSlotScopeCheck,recordFourSlotScopeCheck} from '../archive/tools/meta-foundation/semantic-run-scope.mjs';

const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const descriptor=SEMANTIC_RUN_SCOPE_DIR+'fixture-phase1.json';
const inbox=['.archive-meta-register/inbox/one.json','.archive-meta-register/inbox/two.json'];
const source='original/middle/m3/1mid/excluded.js',uid='excluded_uid';
const meta='archive/data/question_metadata.json',identity='archive/data/question_identity_map.json';
const runtime='archive/data/meta-foundation/runtime/middle3-v1.json',four='archive/data/item-4slot-index.json';
function fixture(t,{bind=true}={}){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'semantic-run-scope-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const put=(relative,value)=>{fs.mkdirSync(path.dirname(path.join(root,relative)),{recursive:true});fs.writeFileSync(path.join(root,relative),Buffer.isBuffer(value)||typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');};
  const read=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
  const commit=()=>{git('add','-A');git('commit','-qm','fixture');return git('rev-parse','HEAD');};
  git('init','-q');git('config','user.name','fixture');git('config','user.email','fixture@example.invalid');
  put('seed.txt','seed\n');inbox.forEach((p,i)=>put(p,{requestId:'request-'+i}));
  const manifest={schemaVersion:SEMANTIC_RUN_SCOPE_SCHEMA,scopeId:'fixture-semantic-scope',phase:'phase1',
    excludedSourcePrefixes:[...M3S1_SOURCE_PREFIXES],inboxBindings:inbox.map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(root,p)))}))};
  if(bind)put(descriptor,manifest);
  const row={questionUid:uid,sourceArchiveFile:source,sourceOrdinal:1,value:'preserved'};
  put(meta,{records:[row],counts:{records:1}});put(identity,{records:[row],digest:'old'});
  put(runtime,{packVersion:'1',status:'ACTIVE',records:[row]});
  put('.archive-meta-register/auto/state.json',{pending:{[source+'#1']:{sourceArchiveFile:source,sourceOrdinal:1,lastReasons:['keep this debt'],attemptSignature:'original'}}});
  put(four,{records:[row],files:[{sourceArchiveFile:source,status:'REGISTERED'}],
    pending:[{path:'archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json'),ordinal:2,reason:'held'}],counts:{registered:1}});
  commit();return {root,git,put,read,commit,manifest};
}

test('no active descriptor has stable default parameters across unrelated HEAD changes',t=>{
  const f=fixture(t,{bind:false}),before=semanticRunScopeProof(resolveSemanticRunScope(f.root));
  f.put('unrelated.txt','next');f.commit();assert.deepEqual(semanticRunScopeProof(resolveSemanticRunScope(f.root)),before);
  assert.equal(before.active,false);
});
test('HEAD bindings survive working and staged consumption, then become inactive after the consumed commit',t=>{
  const f=fixture(t),first=resolveSemanticRunScope(f.root);assert.equal(first.active,true);
  for(const p of inbox)fs.rmSync(path.join(f.root,p));f.git('add','-u');
  assert.deepEqual(resolveSemanticRunScope(f.root),first);
  f.commit();const after=resolveSemanticRunScope(f.root);assert.equal(after.active,false);assert.equal(after.scopeDigest,null);
  f.put('.archive-meta-register/inbox/a-later-owner.json',{requestId:'later'});f.commit();
  assert.equal(resolveSemanticRunScope(f.root).active,false,'exhausted descriptors do not freeze later owners');
});
for(const [name,mutate,error]of [
  ['partial consumption',f=>fs.rmSync(path.join(f.root,inbox[0])),/PARTIAL_INBOX/],
  ['new concurrent inbox',f=>f.put('.archive-meta-register/inbox/other.json',{requestId:'other'}),/EXTRA_INBOX/],
  ['raw inbox drift',f=>fs.appendFileSync(path.join(f.root,inbox[0]),' '),/INBOX_DRIFT/],
  ['empty bindings',f=>{f.manifest.inboxBindings=[];f.put(descriptor,f.manifest);},/DESCRIPTOR_INVALID/],
  ['duplicate binding',f=>{f.manifest.inboxBindings.push(f.manifest.inboxBindings[0]);f.put(descriptor,f.manifest);},/BINDING_INVALID/],
  ['outside prefix',f=>{f.manifest.excludedSourcePrefixes=['original/middle/m3/'];f.put(descriptor,f.manifest);},/DESCRIPTOR_INVALID/],
  ['duplicate prefix',f=>{f.manifest.excludedSourcePrefixes.push(M3S1_SOURCE_PREFIXES[0]);f.put(descriptor,f.manifest);},/DESCRIPTOR_INVALID/],
  ['unknown descriptor field',f=>{f.manifest.bypassValidation=true;f.put(descriptor,f.manifest);},/DESCRIPTOR_INVALID/],
  ['multiple active descriptors',f=>f.put(SEMANTIC_RUN_SCOPE_DIR+'second-phase1.json',{...f.manifest,scopeId:'second-scope'}),/MULTIPLE_ACTIVE/],
  ['malformed descriptor',f=>f.put(descriptor,'{'),/DESCRIPTOR_JSON_INVALID/],
])test('scope fails closed before planning: '+name,t=>{
  const f=fixture(t);mutate(f);f.commit();assert.throws(()=>resolveSemanticRunScope(f.root),error);
});
test('inbox bindings hash exact bytes, including bytes that are not UTF-8 text',t=>{
  const f=fixture(t),raw=Buffer.concat([Buffer.from('{"raw":"'),Buffer.from([255]),Buffer.from('"}\n')]);
  f.put(inbox[0],raw);f.manifest.inboxBindings[0].sha256=sha(raw);f.put(descriptor,f.manifest);f.commit();
  assert.equal(resolveSemanticRunScope(f.root).active,true);
  f.manifest.inboxBindings[0].sha256=sha(raw.toString('utf8'));f.put(descriptor,f.manifest);f.commit();
  assert.throws(()=>resolveSemanticRunScope(f.root),/INBOX_DRIFT/);
});
test('descriptor symlinks are not immutable scope documents',t=>{
  const f=fixture(t);fs.rmSync(path.join(f.root,descriptor));fs.symlinkSync('../../inbox/one.json',path.join(f.root,descriptor));f.commit();
  assert.throws(()=>resolveSemanticRunScope(f.root),/DESCRIPTOR_PATH_INVALID/);
});
test('excluded guard allows global envelopes and unrelated rows while preserving all excluded rowsets',t=>{
  const f=fixture(t),scope=resolveSemanticRunScope(f.root),before=captureExcludedSemanticRows(f.root,scope);
  for(const file of [meta,identity,runtime,four]){const d=f.read(file);d.generatedAt='later';d.packVersion='next';d.counts={changed:true};
    d.records.push({questionUid:'allowed',sourceArchiveFile:'original/middle/m3/2mid/allowed.js',sourceOrdinal:1});f.put(file,d);}
  const result=assertExcludedSemanticRowsUnchanged(f.root,scope,before);assert.equal(result.unchanged,true);assert.equal(result.beforeDigest,result.afterDigest);
});
test('excluded guard keeps old debt exact while allowing newly discovered excluded pending',t=>{
  const f=fixture(t),scope=resolveSemanticRunScope(f.root),before=captureExcludedSemanticRows(f.root,scope),p='.archive-meta-register/auto/state.json';
  const state=f.read(p);state.pending[source+'#2']={sourceArchiveFile:source,sourceOrdinal:2};state.lastProcessedCommit='new cursor';f.put(p,state);
  const result=assertExcludedSemanticRowsUnchanged(f.root,scope,before);assert.equal(result.previousPendingPreserved,1);assert.equal(result.deferredPendingAfter,2);
  delete state.pending[source+'#1'];f.put(p,state);assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,scope,before),/EXCLUDED_PENDING_MUTATION/);
});
for(const [name,mutate]of [
  ['metadata value',f=>{const d=f.read(meta);d.records[0].value='changed';f.put(meta,d);}],
  ['metadata source moved out of scope',f=>{const d=f.read(meta);d.records[0].sourceArchiveFile='original/middle/m3/2mid/moved.js';f.put(meta,d);}],
  ['identity removed',f=>{const d=f.read(identity);d.records=[];f.put(identity,d);}],
  ['new excluded UID',f=>{const d=f.read(meta);d.records.push({...d.records[0],questionUid:'new_excluded'});f.put(meta,d);}],
  ['runtime row removed',f=>{const d=f.read(runtime);d.records=[];f.put(runtime,d);}],
  ['runtime row moved between packs',f=>{const d=f.read(runtime);f.put('archive/data/meta-foundation/runtime/other.json',d);d.records=[];f.put(runtime,d);}],
  ['four-slot classification',f=>{const d=f.read(four);d.records[0].method='changed';f.put(four,d);}],
  ['four-slot pending reason',f=>{const d=f.read(four);d.pending[0].reason='changed';f.put(four,d);}],
  ['four-slot source row',f=>{const d=f.read(four);d.files[0].status='PENDING';f.put(four,d);}],
])test('excluded guard rejects '+name,t=>{
  const f=fixture(t),scope=resolveSemanticRunScope(f.root),before=captureExcludedSemanticRows(f.root,scope);
  mutate(f);assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,scope,before),/EXCLUDED_ROW_MUTATION/);
});

// Producer-orchestration fixtures only. The real full builder/check/replay and
// Consumer remain the fixed shell command's responsibility in integration CI.
function rekeyFixture(t){
  const f=fixture(t),index=f.read(four);
  Object.assign(index,{schemaVersion:'archive-item-4slot-runtime-v1',builderSha256:'a'.repeat(64),inputDigest:'b'.repeat(64),
    counts:{files:1,items:2,registered:1,pending:1}});
  index.files[0].path='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json');index.files[0].inputHash='c'.repeat(64);
  f.put(four,index);f.commit();
  const scope=resolveSemanticRunScope(f.root),before=captureExcludedSemanticRows(f.root,scope);
  const next=structuredClone(index);next.builderSha256='d'.repeat(64);next.inputDigest='e'.repeat(64);next.files[0].inputHash='f'.repeat(64);
  const work=path.join(f.root,'transient','archive-four-slot');
  const reports=()=>{
    const current=f.read(four),digest=sha(fs.readFileSync(path.join(f.root,four)));
    for(const [i,name]of ['report.json','verify.json','replay.json'].entries()){
      f.put(path.relative(f.root,path.join(work,name)),{schemaVersion:current.schemaVersion,status:current.pending.length?'PASS_WITH_SUPPLEMENTS':'PASS',
        verified:current.records.length,pending:current.pending.length,indexSha256:digest,sourceMutation:0,semanticApprovalMutation:0,
        counts:current.counts,inputDigest:current.inputDigest,output:four,write:i===0,changed:i===0});
    }
  };
  const lane={id:'fourSlot',commands:[{program:'bash',args:['tools/ci/archive-four-slot-pass.sh']}]};
  const checked=async({index=next,editReports,execute,customLane}={})=>{
    f.put(four,index);
    return executeFourSlotScopeCheck({root:f.root,scope,lane:customLane||lane,env:{RUNNER_TEMP:path.dirname(work)},execute:async env=>{
      reports();if(editReports)editReports();
      if(execute)return execute(env);
      recordFourSlotScopeCheck(f.root,work,env.ARCHIVE_FOUR_SLOT_CHECK_NONCE);return {fixture:'success'};
    }});
  };
  return {...f,index,next,scope,before,work,reports,lane,checked};
}

test('fresh full-pass capability permits only a changed-builder cache rekey, with exact/semantic results separated',async t=>{
  const f=rekeyFixture(t),pass=await f.checked();
  const result=assertExcludedSemanticRowsUnchanged(f.root,f.scope,f.before,pass);
  assert.equal(result.semanticUnchanged,true);assert.equal(result.exactRowsUnchanged,false);assert.equal(result.unchanged,false);
  assert.equal(result.cacheRekey.changedFileCount,1);assert.deepEqual(result.cacheRekey.paths,[f.index.files[0].path]);
  assert.equal(result.cacheRekey.checkedIndexSha256,sha(fs.readFileSync(path.join(f.root,four))));
  assert.notEqual(result.beforeDigest,result.afterDigest);
});

test('request booleans, serialized capabilities and an absent producer do not authorize rekeying',async t=>{
  const f=rekeyFixture(t);f.put(four,f.next);
  assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,f.scope,f.before),/EXCLUDED_ROW_MUTATION/);
  assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,f.scope,f.before,{checkedFourSlotPass:{verified:true,indexSha256:sha(fs.readFileSync(path.join(f.root,four)))}}),/CHECK_INDEX_DRIFT/);
  const pass=await f.checked();
  assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,f.scope,f.before,JSON.parse(JSON.stringify(pass))),/CHECK_INDEX_DRIFT/);
});

for(const [name,mutate,error]of [
  ['same builder inputHash tamper',d=>{d.builderSha256='a'.repeat(64);},/BUILDER_UNCHANGED/],
  ['missing inputHash',d=>{delete d.files[0].inputHash;},/REKEY_FILE_INVALID/],
  ['malformed inputHash',d=>{d.files[0].inputHash='not-a-hash';},/REKEY_FILE_INVALID/],
  ['file status',d=>{d.files[0].status='PENDING';},/EXCLUDED_ROW_MUTATION/],
  ['file new field',d=>{d.files[0].extra=true;},/EXCLUDED_ROW_MUTATION/],
  ['file source binding',d=>{d.files[0].sourceGitBlobSha='1'.repeat(40);},/EXCLUDED_ROW_MUTATION/],
  ['record classification',d=>{d.records[0].method=[999];},/EXCLUDED_ROW_MUTATION/],
  ['pending reason',d=>{d.pending[0].reason='different';},/EXCLUDED_ROW_MUTATION/],
])test('even a fresh checked pass rejects excluded '+name,async t=>{
  const f=rekeyFixture(t);mutate(f.next);const pass=await f.checked();
  assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,f.scope,f.before,pass),error);
});

for(const file of [meta,identity,runtime])test('cache rekey does not excuse another protected table: '+file,async t=>{
  const f=rekeyFixture(t),pass=await f.checked(),d=f.read(file);d.records[0].value='changed';f.put(file,d);
  assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,f.scope,f.before,pass),/EXCLUDED_ROW_MUTATION/);
});

test('the checked index bytes must still be identical at the final persist guard',async t=>{
  const f=rekeyFixture(t),pass=await f.checked();fs.appendFileSync(path.join(f.root,four),' ');
  assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,f.scope,f.before,pass),/CHECK_INDEX_DRIFT/);
});

test('failed, missing, stale and differently configured producer executions mint no capability',async t=>{
  const f=rekeyFixture(t);
  await assert.rejects(f.checked({execute:env=>{recordFourSlotScopeCheck(f.root,f.work,env.ARCHIVE_FOUR_SLOT_CHECK_NONCE);throw Error('lane failed after reports');}}),/lane failed/);
  await assert.rejects(f.checked({execute:()=>({verified:true})}),/ENOENT/);
  await assert.rejects(f.checked({execute:()=>{recordFourSlotScopeCheck(f.root,f.work,'0'.repeat(64));return {};}}),/CHECK_BINDING_DRIFT/);
  await assert.rejects(f.checked({editReports:()=>{const p=path.relative(f.root,path.join(f.work,'verify.json')),d=f.read(p);d.changed=true;f.put(p,d);}}),/CHECK_NOT_COMPLETE/);
  const different=await f.checked({customLane:{id:'fourSlot',commands:[]},execute:()=>({verified:true})});
  assert.equal(different.checkedFourSlotPass,undefined);
  assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,f.scope,f.before,different),/EXCLUDED_ROW_MUTATION/);
});

test('read-only local proof validation re-reads immutable excluded rows and rejects a forged summary',t=>{
  const f=fixture(t),scope=resolveSemanticRunScope(f.root),handle=beginSemanticRunScopeGuard(f.root);
  assert.deepEqual(captureExcludedSemanticRowsAtHead(f.root,scope),captureExcludedSemanticRows(f.root,scope));
  const proof=finishSemanticRunScopeGuard(f.root,handle);
  assert.deepEqual(verifySemanticRunScopeGuardProof(f.root,proof),proof);
  assert.throws(()=>finishSemanticRunScopeGuard(f.root,JSON.parse(JSON.stringify(handle))),/PRIVATE_GUARD_REQUIRED/);
  assert.throws(()=>verifySemanticRunScopeGuardProof(f.root,undefined),/GUARD_PROOF_DRIFT/);
  const d=f.read(meta);d.records[0].value='tampered after proof';f.put(meta,d);
  const forged={binding:semanticRunScopeProof(scope),excludedRows:{active:true,semanticUnchanged:true,exactRowsUnchanged:true}};
  assert.throws(()=>verifySemanticRunScopeGuardProof(f.root,forged),/EXCLUDED_ROW_MUTATION/);
  assert.throws(()=>finishSemanticRunScopeGuard(f.root,handle),/EXCLUDED_ROW_MUTATION/);
});
