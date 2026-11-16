import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {selectTechnicalCommands} from '../tools/ci/run-scoped-tests.mjs';
import {SEMANTIC_RUN_SCOPE_SCHEMA_V2,SEMANTIC_RUN_SCOPE_BINDING_V2,M3S1_SOURCE_PREFIXES,
  resolveSemanticRunScope,semanticRunScopeProof,assertSemanticRunScopeProof,
  beginSemanticRunScopeGuard,finishSemanticRunScopeGuard,verifySemanticRunScopeGuardProof,
  captureExcludedSemanticRows,assertExcludedSemanticRowsUnchanged} from '../archive/tools/meta-foundation/semantic-run-scope.mjs';

const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const descriptor='.archive-meta-register/auto/run-scopes/cohort-phase1.json';
const cohort=['.archive-meta-register/inbox/own-one.json','.archive-meta-register/inbox/own-two.json'];
const extra='.archive-meta-register/inbox/another-owner.json';
const source='original/middle/m3/1mid/excluded.js',meta='archive/data/question_metadata.json';
const state='.archive-meta-register/auto/state.json',four='archive/data/item-4slot-index.json';
function fixture(t,{v1=false}={}){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'semantic-scope-v2-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const put=(p,value)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),Buffer.isBuffer(value)||typeof value==='string'?value:JSON.stringify(value)+'\n');};
  const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
  const bytes=p=>fs.readFileSync(path.join(root,p));
  const commit=()=>{git('add','-A');git('commit','-qm','exact fixture snapshot');return git('rev-parse','HEAD');};
  git('init','-q','--initial-branch=main');git('config','user.name','scope fixture');git('config','user.email','scope-fixture@example.invalid');git('config','commit.gpgsign','false');
  for(const p of [...cohort,extra])put(p,{requestId:path.basename(p,'.json'),fixture:'not an approval'});
  const bindings=cohort.map(p=>({path:p,sha256:sha(bytes(p))}));
  const doc={schemaVersion:v1?'archive-semantic-run-scope-v1':SEMANTIC_RUN_SCOPE_SCHEMA_V2,scopeId:'cohort-scope-fixture',phase:'phase1',
    excludedSourcePrefixes:[...M3S1_SOURCE_PREFIXES],...(v1?{inboxBindings:bindings}:{cohortBindings:bindings})};
  put(descriptor,doc);
  const row={questionUid:'protected_uid',sourceArchiveFile:source,sourceOrdinal:1,value:'exact'};
  for(const p of [meta,'archive/data/question_identity_map.json','archive/data/meta-foundation/runtime/middle3-v1.json'])put(p,{records:[row]});
  put(four,{records:[row],pending:[],files:[{sourceArchiveFile:source,inputHash:'a'.repeat(64)}]});
  put(state,{pending:{[source+'#1']:{sourceArchiveFile:source,sourceOrdinal:1,reason:'original debt'}}});
  const head=commit();return {root,git,put,read,bytes,commit,head,doc};
}

test('the registration test selector includes the new v2 regression without dropping v1',()=>{
  const names=['tests/archive-semantic-run-scope.test.mjs','tests/archive-semantic-run-scope-v2.test.mjs'];
  const commands=names.map(label=>({label,args:['--test',label]}));
  assert.deepEqual(selectTechnicalCommands({groups:['registration']},commands),commands);
});

test('v1 still rejects an extra inbox while v2 seals the exact cohort and every HEAD input separately',t=>{
  const legacy=fixture(t,{v1:true});assert.throws(()=>resolveSemanticRunScope(legacy.root),/EXTRA_INBOX/);
  const f=fixture(t),s=resolveSemanticRunScope(f.root),p=semanticRunScopeProof(s);
  assert.equal(s.schemaVersion,SEMANTIC_RUN_SCOPE_BINDING_V2);assert.equal(s.active,true);assert.equal(s.head,f.head);
  assert.equal(p.cohortInputCount,2);assert.equal(p.boundInputCount,3);assert.equal(p.head,f.head);
  assert.deepEqual(p.cohortBindings,[...f.doc.cohortBindings].sort((a,b)=>a.path.localeCompare(b.path,'en')));
  assert.deepEqual(p.inboxBindings.map(r=>r.path),[...cohort,extra].sort());
  for(const r of p.inboxBindings)assert.equal(r.sha256,sha(f.bytes(r.path)));
  p.inboxBindings[0].sha256='0'.repeat(64);assert.notEqual(s.inboxBindings[0].sha256,p.inboxBindings[0].sha256,'proof cannot mutate the resolved private scope');
});
test('working and index edits or consumption cannot rewrite either sealed inventory',t=>{
  const f=fixture(t),before=resolveSemanticRunScope(f.root);
  f.put(extra,'different live bytes');fs.rmSync(path.join(f.root,cohort[0]));f.doc.cohortBindings=[];f.put(descriptor,f.doc);
  f.put('.archive-meta-register/inbox/untracked-owner.json',{notInHead:true});f.git('add','-A');
  assert.deepEqual(resolveSemanticRunScope(f.root),before);
});
test('the complete inventory hashes raw non-UTF8 bytes without granting JSON or approval validity',t=>{
  const f=fixture(t),raw=Buffer.from([0xff,0xfe,0,1]);f.put(extra,raw);f.commit();
  const s=resolveSemanticRunScope(f.root);assert.equal(s.inboxBindings.find(r=>r.path===extra).sha256,sha(raw));
  assert.notEqual(sha(raw),sha(raw.toString('utf8')));
});
test('consuming the whole cohort disables only this batch and leaves another owner pending',t=>{
  const f=fixture(t);for(const p of cohort)fs.rmSync(path.join(f.root,p));f.commit();
  const first=semanticRunScopeProof(resolveSemanticRunScope(f.root));assert.equal(first.active,false);assert(fs.existsSync(path.join(f.root,extra)));
  f.put('unrelated.txt','next HEAD');f.commit();assert.deepEqual(semanticRunScopeProof(resolveSemanticRunScope(f.root)),first);
});
test('a new HEAD input or changed extra raw changes the complete proof and rejects an old replay',t=>{
  const f=fixture(t),first=semanticRunScopeProof(resolveSemanticRunScope(f.root));
  f.put('.archive-meta-register/inbox/new-owner.json',{requestId:'new'});f.commit();const second=resolveSemanticRunScope(f.root);
  assert.equal(second.inboxBindings.length,4);assert.notEqual(second.scopeDigest,first.scopeDigest);
  assert.throws(()=>assertSemanticRunScopeProof(first,second),/REPORT_BINDING_DRIFT/);
  const old=semanticRunScopeProof(second);f.put(extra,{requestId:'updated owner'});f.commit();
  assert.throws(()=>assertSemanticRunScopeProof(old,resolveSemanticRunScope(f.root)),/REPORT_BINDING_DRIFT/);
});
for(const [label,mutate,error]of[
  ['partial cohort',f=>fs.rmSync(path.join(f.root,cohort[0])),/PARTIAL_INBOX/],
  ['cohort raw drift',f=>f.put(cohort[0],'changed'),/INBOX_DRIFT/],
  ['empty cohort',f=>{f.doc.cohortBindings=[];f.put(descriptor,f.doc);},/DESCRIPTOR_INVALID/],
  ['duplicate cohort',f=>{f.doc.cohortBindings.push(f.doc.cohortBindings[0]);f.put(descriptor,f.doc);},/BINDING_INVALID/],
  ['unrecognized descriptor field',f=>{f.doc.allowOtherOwners=true;f.put(descriptor,f.doc);},/DESCRIPTOR_INVALID/],
  ['caller-supplied complete inventory',f=>{f.doc.inboxBindings=f.doc.cohortBindings;f.put(descriptor,f.doc);},/DESCRIPTOR_INVALID/],
  ['unrecognized binding field',f=>{f.doc.cohortBindings[0].skip=true;f.put(descriptor,f.doc);},/BINDING_INVALID/],
  ['broader excluded prefix',f=>{f.doc.excludedSourcePrefixes=['original/middle/m3/'];f.put(descriptor,f.doc);},/DESCRIPTOR_INVALID/],
  ['cohort symlink',f=>{fs.rmSync(path.join(f.root,cohort[0]));fs.symlinkSync('own-two.json',path.join(f.root,cohort[0]));},/INBOX_ENTRY_INVALID/],
  ['extra symlink',f=>{fs.rmSync(path.join(f.root,extra));fs.symlinkSync('own-two.json',path.join(f.root,extra));},/INBOX_ENTRY_INVALID/],
  ['extra executable',f=>{f.git('update-index','--chmod=+x',extra);f.git('config','core.filemode','false');},/INBOX_ENTRY_INVALID/],
  ['nested extra',f=>f.put('.archive-meta-register/inbox/nested/other.json',{}),/INBOX_ENTRY_INVALID/],
  ['non-JSON extra',f=>f.put('.archive-meta-register/inbox/hidden-input.txt','not silently omitted'),/INBOX_ENTRY_INVALID/],
  ['descriptor symlink',f=>{fs.rmSync(path.join(f.root,descriptor));fs.symlinkSync('../../inbox/own-one.json',path.join(f.root,descriptor));},/DESCRIPTOR_PATH_INVALID/],
])test('v2 fails closed for '+label,t=>{const f=fixture(t);mutate(f);f.commit();assert.throws(()=>resolveSemanticRunScope(f.root),error);});
test('active v1 plus active v2 is ambiguous and remains rejected',t=>{
  const f=fixture(t);f.put('.archive-meta-register/auto/run-scopes/legacy-phase1.json',{schemaVersion:'archive-semantic-run-scope-v1',scopeId:'legacy-scope',phase:'phase1',
    excludedSourcePrefixes:[...M3S1_SOURCE_PREFIXES],inboxBindings:[...cohort,extra].map(p=>({path:p,sha256:sha(f.bytes(p))}))});
  f.commit();assert.throws(()=>resolveSemanticRunScope(f.root),/MULTIPLE_ACTIVE/);
});
test('v2 seals at most the explicit bounded complete inventory and never truncates it',t=>{
  const f=fixture(t);for(let i=0;i<498;i++)f.put('.archive-meta-register/inbox/extra-'+i+'.json',{i});f.commit();
  assert.throws(()=>resolveSemanticRunScope(f.root),/INBOX_INVENTORY_TOO_LARGE/);
});
test('the v2 private producer and verify-local bind both inventories and the unchanged excluded snapshot',t=>{
  const f=fixture(t),handle=beginSemanticRunScopeGuard(f.root),proof=finishSemanticRunScopeGuard(f.root,handle);
  assert.equal(proof.binding.boundInputCount,3);assert.equal(proof.binding.cohortInputCount,2);
  assert.deepEqual(verifySemanticRunScopeGuardProof(f.root,proof),proof);
  for(const mutate of[p=>p.binding.inboxBindings.pop(),p=>p.binding.cohortBindings.pop(),p=>{p.binding.head='a'.repeat(40);},p=>{p.binding.schemaVersion='archive-semantic-run-scope-binding-v1';},p=>{p.binding.scopeDigest='a'.repeat(64);},p=>{delete p.binding.inboxBindings;}]){
    const bad=structuredClone(proof);mutate(bad);assert.throws(()=>verifySemanticRunScopeGuardProof(f.root,bad),/GUARD_PROOF_DRIFT/);
  }
});
test('HEAD changes remain fatal even when the new tree has identical request and excluded bytes',t=>{
  const f=fixture(t),handle=beginSemanticRunScopeGuard(f.root),tree=f.git('rev-parse','HEAD^{tree}');
  const next=f.git('commit-tree',tree,'-p',f.head,'-m','identical tree, different HEAD');f.git('update-ref','HEAD',next,f.head);
  assert.throws(()=>finishSemanticRunScopeGuard(f.root,handle),/HEAD_DRIFT/);
});
test('v2 neither relaxes excluded row protection nor accepts a serialized cache-rekey capability',t=>{
  const f=fixture(t),scope=resolveSemanticRunScope(f.root),before=captureExcludedSemanticRows(f.root,scope),d=f.read(four);
  d.files[0].inputHash='b'.repeat(64);f.put(four,d);
  assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,scope,before),/EXCLUDED_ROW_MUTATION/);
  assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,scope,before,{checkedFourSlotPass:{verified:true}}),/CHECK_INDEX_DRIFT/);
});
test('excluded old pending cannot be removed while new excluded debt may be queued',t=>{
  const f=fixture(t),scope=resolveSemanticRunScope(f.root),before=captureExcludedSemanticRows(f.root,scope),s=f.read(state);
  s.pending[source+'#2']={sourceArchiveFile:source,sourceOrdinal:2};f.put(state,s);
  assert.equal(assertExcludedSemanticRowsUnchanged(f.root,scope,before).previousPendingPreserved,1);
  delete s.pending[source+'#1'];f.put(state,s);assert.throws(()=>assertExcludedSemanticRowsUnchanged(f.root,scope,before),/EXCLUDED_PENDING_MUTATION/);
});
