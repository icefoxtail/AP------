import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {registerMergedSource,verifyMergedSource,sourceFingerprint,contentFingerprint} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {resolveSemanticRunScope} from '../archive/tools/meta-foundation/semantic-run-scope.mjs';

const source='original/middle/m3/1mid/batch-fixture.js';
const metaPath='archive/data/question_metadata.json',identityPath='archive/data/question_identity_map.json';
const statePath='.archive-meta-register/auto/state.json',configPath='.archive-meta-register/auto/config.json';
const canon='archive/data/meta-foundation/canonical',compiled='archive/data/meta-foundation/compiled';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function withGitHubEnvironment(values, action) {
  const previous=Object.fromEntries(Object.keys(values).map(key=>[key,process.env[key]]));
  Object.assign(process.env,values);
  try { return await action(); }
  finally {
    for(const [key,value]of Object.entries(previous)) {
      if(value===undefined)delete process.env[key];else process.env[key]=value;
    }
  }
}
function fixture(t,{count=3,max=1,pending=ordinal=>ordinal===1}={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'auto-meta-batch-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const read=rel=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));
  const put=(rel,value)=>{fs.mkdirSync(path.dirname(path.join(root,rel)),{recursive:true});fs.writeFileSync(path.join(root,rel),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');};
  const bytes=rel=>fs.readFileSync(path.join(root,rel));
  const uid=i=>'qid_v1_'+i.toString(16).padStart(64,'0');
  const bank=Array.from({length:count},(_,n)=>({id:n+1,content:'Fixture '+(n+1),choices:['1','2'],answer:'1',solution:'Definition.',
    curriculum:'2015',standardCourse:'중3 수학',standardUnitKey:'M3-01',subUnitKey:'M3-01-ROOT',
    problemTypeKey:pending(n+1)?null:'PT_ROOT',templateKey:pending(n+1)?null:'TPL_ROOT',
    crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',difficultyBucket:2,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',level:'중',primaryMethod:'Definition',decisiveStep:'Positive root'}));
  put('archive/exams/'+source,'window.questionBank='+JSON.stringify(bank)+';\n');
  put(metaPath,{records:bank.map((q,i)=>({...q,questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:i+1,
    problemTypeKey:'',templateKey:'',sourceFingerprint:sourceFingerprint(q),contentFingerprint:contentFingerprint(q),metadataStatus:'registration_pending_semantic_review',reviewStatus:'review_required',fieldStatus:{problemType:'manual_review_pending'}}))});
  put(identityPath,{records:bank.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:i+1,status:'VERIFIED',sourceFingerprint:sourceFingerprint(q)}))});
  put(canon+'/metadata_rules.json',{status:'ACTIVE',integrationPatterns:['NONE']});
  put(canon+'/condition_registry.json',{status:'ACTIVE',conditions:[]});
  put(canon+'/packs/middle3/pack.json',{packId:'MIDDLE3',packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2015'],standardCourses:['중3 수학']});
  put(compiled+'/taxonomy_registry.json',{status:'DERIVED_READ_ONLY',problemTypes:[{problemTypeKey:'PT_ROOT',status:'ACTIVE',ownerPack:'MIDDLE3',canonicalLabelKo:'Roots'}],templates:[{templateKey:'TPL_ROOT',parentProblemTypeKey:'PT_ROOT',status:'ACTIVE',ownerPack:'MIDDLE3',canonicalLabelKo:'Definition'}]});
  put(compiled+'/concept_registry.json',{status:'DERIVED_READ_ONLY',concepts:[]});
  put(compiled+'/condition_registry.json',{status:'DERIVED_READ_ONLY',conditions:[]});
  put(compiled+'/curriculum_bindings.json',{status:'DERIVED_READ_ONLY',bindings:[{status:'ACTIVE',curriculum:'2015',standardCourse:'중3 수학',standardUnitKey:'M3-01',subUnitKey:'M3-01-ROOT',problemTypeKey:'PT_ROOT',ownerPack:'MIDDLE3',L1:'Numbers',L2:'Roots'}]});
  const refreshRegistry=()=>put(canon+'/registry_index.json',{status:'ACTIVE',activePacks:[{id:'MIDDLE3',version:'1.0.0',status:'ACTIVE'}],
    canonicalSources:['metadata_rules','condition_registry'].map(n=>({path:canon+'/'+n+'.json',sha256:sha(bytes(canon+'/'+n+'.json'))})),
    compiledArtifacts:['taxonomy_registry','concept_registry','condition_registry','curriculum_bindings'].map(n=>({path:compiled+'/'+n+'.json',sha256:sha(bytes(compiled+'/'+n+'.json'))}))});
  refreshRegistry();
  put('archive/data/meta-foundation/runtime/middle3-v1.json',{packId:'MIDDLE3',packVersion:'1.0.0',status:'ACTIVE',records:[]});
  git('init','-q');git('config','user.name','fixture');git('config','user.email','fixture@example.invalid');git('add','.');git('commit','-qm','immutable source');
  const head=git('rev-parse','HEAD');
  put(configPath,{enabled:true,bootstrapBase:head,maxQuestionsPerRun:max,pilotTargets:[]});
  put(statePath,{schemaVersion:'archive-main-merge-meta-v1',lastProcessedCommit:head,completedPilots:[],latestReceipts:{},pending:Object.fromEntries(bank.map((_,i)=>[source+'#'+(i+1),{sourceArchiveFile:source,sourceOrdinal:i+1,baseCommit:head}]))});
  const reportPath=path.join(root,'first-report.json');
  // This isolated temporary repository exercises the main writer. Never inherit
  // the enclosing PR runner's ref, and restore it after each fixture operation.
  const first=()=>withGitHubEnvironment({GITHUB_ACTIONS:'true',GITHUB_REF:'refs/heads/main'},
    ()=>registerMergedSource({root,write:true,reportPath}));
  const replay=options=>registerMergedSource({root,replayReportPath:reportPath,...options});
  return {root,git,read,put,bytes,uid,bank,head,reportPath,first,replay,refreshRegistry};
}

test('the production writer rejects an explicit PR ref before changing any fixture data',async t=>{
  const f=fixture(t,{count:1,pending:()=>false});
  const guarded=[metaPath,identityPath,statePath,'archive/exams/'+source,
    'archive/data/meta-foundation/runtime/middle3-v1.json'];
  const before=guarded.map(file=>[file,f.bytes(file)]);
  const environment={GITHUB_ACTIONS:process.env.GITHUB_ACTIONS,GITHUB_REF:process.env.GITHUB_REF};
  await withGitHubEnvironment({GITHUB_ACTIONS:'true',GITHUB_REF:'refs/pull/2112/merge'},async()=>{
    await assert.rejects(registerMergedSource({root:f.root,write:true,reportPath:f.reportPath}),/MAIN_ONLY_WRITER/);
  });
  assert.deepEqual({GITHUB_ACTIONS:process.env.GITHUB_ACTIONS,GITHUB_REF:process.env.GITHUB_REF},environment);
  for(const [file,bytes]of before)assert.deepEqual(f.bytes(file),bytes,file);
  assert.equal(fs.existsSync(f.reportPath),false);
  assert.equal((await f.first()).applied,1,'the same isolated fixture runs under explicit main authority');
  assert.deepEqual({GITHUB_ACTIONS:process.env.GITHUB_ACTIONS,GITHUB_REF:process.env.GITHUB_REF},environment);
});

test('a pending bounded batch replays itself while the next ready batch stays queued',async t=>{
  const f=fixture(t),first=await f.first();
  assert.equal(first.applied,0);assert.equal(first.replayBatch.targets.length,1);assert.equal(first.pending,3);
  const state=f.bytes(statePath),metadata=f.bytes(metaPath);
  const next=await registerMergedSource({root:f.root});
  assert.equal(next.applied,1,'the old unscoped replay would report a false failure for a NEW ready UID');
  assert.equal(next.results.find(r=>r.status==='APPLY').sourceOrdinal,2);
  const replay=await f.replay();
  assert.equal(replay.replayVerified,true);assert.equal(replay.replayed,1);assert.equal(replay.applied,0);
  assert.deepEqual(replay.plannedPaths,[]);assert.equal(replay.results[0].sourceOrdinal,1);
  assert.deepEqual(f.bytes(statePath),state);assert.deepEqual(f.bytes(metaPath),metadata);
  const written=await f.first();assert.equal(written.applied,1);assert.equal(written.pending,2);
  const appliedReplay=await f.replay();assert.equal(appliedReplay.results[0].status,'ALREADY_REGISTERED');
  assert.equal(appliedReplay.results[0].sourceOrdinal,2);assert.deepEqual(appliedReplay.plannedPaths,[]);
  const last=await f.first();assert.equal(last.applied,1);assert.equal(last.pending,1);
  assert.equal((await f.replay()).replayVerified,true);
});

test('the production 100-question cap is preserved without mistaking item 101 for a replay',async t=>{
  const f=fixture(t,{count:101,max:100,pending:ordinal=>ordinal!==99}),first=await f.first();
  assert.equal(first.replayBatch.targets.length,100);assert.equal(first.applied,0);assert.equal(first.pending,101);
  const next=await registerMergedSource({root:f.root});assert.equal(next.applied,1);
  assert.equal(next.results.find(r=>r.status==='APPLY').sourceOrdinal,99);
  const before=f.bytes(statePath),replay=await f.replay();
  assert.equal(replay.replayed,100);assert.equal(replay.applied,0);assert.equal(replay.pending,101);
  assert.deepEqual(replay.plannedPaths,[]);assert.deepEqual(f.bytes(statePath),before);
});

test('same-batch replay rejects changed bindings and cannot write',async t=>{
  const cases=[
    ['write mode',async f=>{}, {write:true},/REPLAY_READ_ONLY/],
    ['source bytes',async f=>f.put('archive/exams/'+source,f.bytes('archive/exams/'+source).toString()+'\n'),{},/REPLAY_SOURCE_DRIFT/],
    ['queued target',async f=>{const state=f.read(statePath);delete state.pending[source+'#3'];f.put(statePath,state);},{},/REPLAY_BINDING_DRIFT/],
    ['selected metadata',async f=>{const m=f.read(metaPath);m.records[0].reviewStatus='reviewed_pass';f.put(metaPath,m);},{},/REPLAY_UID_STATE_DRIFT/],
    ['selected identity',async f=>{const m=f.read(identityPath);m.records[0].status='INVALID';f.put(identityPath,m);},{},/REPLAY_UID_STATE_DRIFT/],
    ['batch limit',async f=>{const c=f.read(configPath);c.maxQuestionsPerRun=2;f.put(configPath,c);},{},/REPLAY_BINDING_DRIFT/],
    ['ACTIVE registry bytes',async f=>{const c=f.read(canon+'/metadata_rules.json');c.integrationPatterns.push('SEQUENTIAL');f.put(canon+'/metadata_rules.json',c);f.refreshRegistry();},{},/REPLAY_REGISTRY_DRIFT/],
    ['selected scope',async f=>{const r=f.read('first-report.json');r.replayBatch.targets[0][1].sourceOrdinal=3;f.put('first-report.json',r);},{},/REPLAY_BINDING_DRIFT/],
    ['head',async f=>{f.put('unrelated.txt','later');f.git('add','unrelated.txt');f.git('commit','-qm','later');},{},/REPLAY_INPUT_INVALID/],
  ];
  for(const [name,mutate,options,error]of cases)await t.test(name,async sub=>{
    const f=fixture(sub);await f.first();await mutate(f);await assert.rejects(f.replay(options),error);
  });
});

test('an applied receipt is immutable and a dry-run report cannot certify a replay',async t=>{
  const f=fixture(t,{count:1,pending:()=>false}),first=await f.first();
  assert.equal(first.applied,1);
  const receipt=first.results[0].receiptPath,prior=f.bytes(receipt);
  f.put(receipt,prior.toString()+'\n');await assert.rejects(f.replay(),/REPLAY_RECEIPT_DRIFT/);f.put(receipt,prior.toString());
  assert.equal((await f.replay()).replayed,1);
  await registerMergedSource({root:f.root,reportPath:f.reportPath});await assert.rejects(f.replay(),/REPLAY_INPUT_INVALID/);
});

test('an all-cached pending pass keeps an empty exact batch but still binds registry and source',async t=>{
  const f=fixture(t,{count:1}),first=await f.first();assert.equal(first.applied,0);
  const cached=await f.first();assert.equal(cached.results[0].status,'SUPPLEMENT_PENDING_UNCHANGED');assert.deepEqual(cached.replayBatch.targets,[]);
  assert.equal((await f.replay()).replayVerified,true);
  const c=f.read(canon+'/metadata_rules.json');c.integrationPatterns.push('SEQUENTIAL');f.put(canon+'/metadata_rules.json',c);f.refreshRegistry();
  await assert.rejects(f.replay(),/REPLAY_REGISTRY_DRIFT/);
});

test('an empty queue replays as no work with no state mutation',async t=>{
  const f=fixture(t,{count:1,pending:()=>false});await f.first();
  const empty=await f.first(),before=f.bytes(statePath);assert.deepEqual(empty.results,[]);
  const replay=await f.replay();assert.equal(replay.replayed,0);assert.equal(replay.replayVerified,true);
  assert.deepEqual(replay.plannedPaths,[]);assert.deepEqual(f.bytes(statePath),before);
});

test('a new registry binding retries pending source without replacing a partial basic approval or clearing its holds',async t=>{
  const f=fixture(t,{count:2,max:2,pending:()=>false});
  const metadata=f.read(metaPath),held=metadata.records[0];
  Object.assign(held,{metadataStatus:'approved_partial_with_explicit_holds',
    tagStatus:'approved_subunit_concept_partial',metadataRevision:'original-basic-review',
    approvalEvidence:['review/original-basic-classification.json'],
    fieldStatus:{standardUnit:'approved_source',subUnit:'approved_source',concept:'approved_classification',
      difficulty:'approved_source',problemType:'manual_review_pending',template:'manual_review_pending'}});
  f.put(metaPath,metadata);
  const heldBefore=structuredClone(held),sourceBefore=f.bytes('archive/exams/'+source),identityBefore=f.bytes(identityPath);
  const bindings=f.read(compiled+'/curriculum_bindings.json');
  f.put(compiled+'/curriculum_bindings.json',{...bindings,bindings:[]});f.refreshRegistry();
  const beforeBinding=await f.first();assert.equal(beforeBinding.applied,0);assert.equal(beforeBinding.pending,2);
  const signatureBefore=f.read(statePath).pending[source+'#1'].attemptSignature;
  f.put(compiled+'/curriculum_bindings.json',bindings);f.refreshRegistry();
  const registered=await f.first();
  assert.equal(registered.applied,1,'the ordinary unreviewed second UID still uses the existing producer');
  const kept=registered.results.find(r=>r.questionUid===f.uid(1));
  assert.equal(kept.status,'SUPPLEMENT_PENDING');assert.deepEqual(kept.reasons,['EXPLICIT_PARTIAL_REVIEW_HOLD']);
  assert.equal(kept.requestId,undefined);assert.equal(kept.receiptPath,undefined);
  assert.notEqual(f.read(statePath).pending[source+'#1'].attemptSignature,signatureBefore);
  assert.deepEqual(f.read(metaPath).records[0],heldBefore);
  assert.deepEqual(f.bytes('archive/exams/'+source),sourceBefore);assert.deepEqual(f.bytes(identityPath),identityBefore);
  const runtime=f.read('archive/data/meta-foundation/runtime/middle3-v1.json');
  assert.deepEqual(runtime.records.map(r=>r.questionUid),[f.uid(2)]);
  const replay=await f.replay();assert.equal(replay.replayVerified,true);assert.equal(replay.replayed,2);
  assert.equal(replay.results.find(r=>r.questionUid===f.uid(1)).status,'SUPPLEMENT_PENDING');
  assert.deepEqual(replay.plannedPaths,[]);assert.deepEqual(f.read(metaPath).records[0],heldBefore);
});

const scopeDescriptor='.archive-meta-register/auto/run-scopes/bounded-fixture-phase1.json';
const scopeInboxes=['.archive-meta-register/inbox/scope-one.json','.archive-meta-register/inbox/scope-two.json'];
const allowedSource='original/middle/m3/2mid/allowed-fixture.js';
const stable=value=>JSON.stringify(value,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
function scopeFixture(t,{allowed=true,max=1}={}){
  const f=fixture(t,{count:1,max,pending:()=>false});
  if(allowed){
    f.put('archive/exams/'+allowedSource,'window.questionBank='+JSON.stringify(f.bank)+';\n');
    for(const file of [metaPath,identityPath]){const d=f.read(file);d.records.push({...d.records[0],questionUid:f.uid(100),sourceArchiveFile:allowedSource});f.put(file,d);}
  }
  f.git('add','-A');f.git('commit','-qm','complete fixture sources');const base=f.git('rev-parse','HEAD');
  const s=f.read(statePath);s.lastProcessedCommit=base;s.pending[source+'#1']={...s.pending[source+'#1'],lastReasons:['retained historical refusal'],attemptSignature:'original-attempt-signature',extraBoundary:'keep-exact'};
  if(allowed)s.pending[allowedSource+'#1']={sourceArchiveFile:allowedSource,sourceOrdinal:1,baseCommit:base};f.put(statePath,s);
  for(const p of scopeInboxes)f.put(p,{requestId:path.basename(p,'.json')});
  f.put(scopeDescriptor,{schemaVersion:'archive-semantic-run-scope-v1',scopeId:'bounded-semantic-fixture',phase:'phase1',
    excludedSourcePrefixes:['original/middle/m3/1final/','original/middle/m3/1mid/'],
    inboxBindings:scopeInboxes.map(p=>({path:p,sha256:sha(f.bytes(p))}))});
  f.git('add','-A');f.git('commit','-qm','bound phase1');
  return f;
}
function resealTamperedReplay(f){
  const report=f.read('first-report.json'),{sha256:ignored,stateAfterSha256:ignoredState,...sealed}=report.replayBatch;
  report.replayBatch.sha256=sha(stable(sealed));const s=f.read(statePath);
  if(report.replayBatch.targets.length)s.lastBatchSha256=report.replayBatch.sha256;
  f.put(statePath,s);report.replayBatch.stateAfterSha256=sha(stable(s));f.put('first-report.json',report);
}

test('active run scope defers an otherwise applicable M3S1 target, preserves its debt and spends the cap on allowed work',async t=>{
  const f=scopeFixture(t),beforePending=structuredClone(f.read(statePath).pending[source+'#1']);
  const beforeMeta=structuredClone(f.read(metaPath).records[0]),beforeIdentity=f.bytes(identityPath),beforeSource=f.bytes('archive/exams/'+source);
  const result=await f.first();assert.equal(result.runScope.active,true);assert.equal(result.applied,1);
  assert.equal(result.results.length,1);assert.equal(result.results[0].sourceArchiveFile,allowedSource);
  assert.equal(result.deferredPending,1);assert.equal(result.pending,1);assert.equal(result.allowedPending,0);
  assert.deepEqual(f.read(statePath).pending[source+'#1'],beforePending);
  assert.deepEqual(f.read(metaPath).records[0],beforeMeta);assert.deepEqual(f.bytes(identityPath),beforeIdentity);assert.deepEqual(f.bytes('archive/exams/'+source),beforeSource);
  assert.deepEqual(f.read('archive/data/meta-foundation/runtime/middle3-v1.json').records.map(r=>r.questionUid),[f.uid(100)]);
  assert.equal(f.read(statePath).latestReceipts[f.uid(1)],undefined);
  const replay=await f.replay();assert.equal(replay.replayVerified,true);assert.equal(replay.replayed,1);assert.equal(replay.deferredPending,1);assert.deepEqual(replay.plannedPaths,[]);
  for(const p of scopeInboxes)fs.rmSync(path.join(f.root,p));f.git('add','-A');f.git('commit','-qm','phase1 consumed');
  assert.equal(resolveSemanticRunScope(f.root).active,false);
  const later=await f.first();assert.equal(later.applied,1);assert.equal(later.results[0].sourceArchiveFile,source,'a later unscoped job resumes normal automation');
});

test('new excluded source changes are queued before cursor advance while pre-existing excluded pending remains exact',async t=>{
  for(const existing of [false,true])await t.test(existing?'existing debt':'new debt',async sub=>{
    const f=scopeFixture(sub,{allowed:false}),s=f.read(statePath),old=structuredClone(s.pending[source+'#1']);
    if(!existing){delete s.pending[source+'#1'];f.put(statePath,s);}
    const bank=structuredClone(f.bank);bank[0].primaryMethod='Declared fixture update';f.put('archive/exams/'+source,'window.questionBank='+JSON.stringify(bank)+';\n');
    f.git('add','-A');f.git('commit','-qm','excluded source delta');const head=f.git('rev-parse','HEAD'),metadata=f.bytes(metaPath),runtime=f.bytes('archive/data/meta-foundation/runtime/middle3-v1.json');
    const result=await f.first();assert.equal(result.applied,0);assert.deepEqual(result.results,[]);assert.equal(result.deferredPending,1);
    const after=f.read(statePath);assert.equal(after.lastProcessedCommit,head);assert(after.pending[source+'#1']);
    if(existing)assert.deepEqual(after.pending[source+'#1'],old);else assert.equal(after.pending[source+'#1'].baseCommit,s.lastProcessedCommit);
    assert.deepEqual(f.bytes(metaPath),metadata);assert.deepEqual(f.bytes('archive/data/meta-foundation/runtime/middle3-v1.json'),runtime);
    assert.equal((await f.replay()).replayVerified,true);
  });
});

for(const [name,mutate,error]of [
  ['missing top scope',r=>{delete r.runScope;},/REPORT_BINDING_DRIFT/],
  ['changed top scope',r=>{r.runScope.scopeDigest='0'.repeat(64);},/REPORT_BINDING_DRIFT/],
  ['missing batch scope',r=>{delete r.replayBatch.runScope;},/REPORT_BINDING_DRIFT/],
  ['missing both scopes',r=>{delete r.runScope;delete r.replayBatch.runScope;},/REPORT_BINDING_DRIFT/],
  ['omitted deferred debt',r=>{r.deferredTargets=[];r.replayBatch.deferredTargets=[];},/DEFERRED_BINDING_DRIFT/],
  ['excluded attempted result',r=>{r.results[0].sourceArchiveFile=source;},/SCOPE_EXCLUDED_ATTEMPT/],
])test('scoped replay fails closed after self-consistent report tampering: '+name,async t=>{
  const f=scopeFixture(t);await f.first();const r=f.read('first-report.json');mutate(r);f.put('first-report.json',r);resealTamperedReplay(f);
  await assert.rejects(f.replay(),error);
});
test('scoped final verify checks exact policy, head and deferred set before consumer loading',async t=>{
  for(const [name,mutate,error]of [
    ['missing scope',f=>{const r=f.read('first-report.json');delete r.runScope;f.put('first-report.json',r);},/REPORT_BINDING_DRIFT/],
    ['missing deferred set',f=>{const r=f.read('first-report.json');r.deferredTargets=[];f.put('first-report.json',r);},/DEFERRED_BINDING_DRIFT/],
    ['excluded result',f=>{const r=f.read('first-report.json');r.results[0].sourceArchiveFile=source;f.put('first-report.json',r);},/SCOPE_EXCLUDED_ATTEMPT/],
    ['later unconsumed HEAD',f=>{f.put('unrelated.txt','later');f.git('add','unrelated.txt');f.git('commit','-qm','later');},/REPORT_HEAD_DRIFT/],
  ])await t.test(name,async sub=>{const f=scopeFixture(sub);await f.first();mutate(f);await assert.rejects(verifyMergedSource({root:f.root,reportPath:f.reportPath}),error);});
});
