import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {SEMANTIC_RUN_SCOPE_DIR,SEMANTIC_RUN_SCOPE_SCHEMA,M3S1_SOURCE_PREFIXES,resolveSemanticRunScope,
  semanticRunScopeProof,captureExcludedSemanticRows,assertExcludedSemanticRowsUnchanged} from '../archive/tools/meta-foundation/semantic-run-scope.mjs';

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
