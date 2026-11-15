import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {registerMergedSource,sourceFingerprint,contentFingerprint} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';

const source='original/middle/m3/1mid/batch-fixture.js';
const metaPath='archive/data/question_metadata.json',identityPath='archive/data/question_identity_map.json';
const statePath='.archive-meta-register/auto/state.json',configPath='.archive-meta-register/auto/config.json';
const canon='archive/data/meta-foundation/canonical',compiled='archive/data/meta-foundation/compiled';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
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
  const first=()=>registerMergedSource({root,write:true,reportPath});
  const replay=options=>registerMergedSource({root,replayReportPath:reportPath,...options});
  return {root,git,read,put,bytes,uid,bank,head,reportPath,first,replay,refreshRegistry};
}

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
