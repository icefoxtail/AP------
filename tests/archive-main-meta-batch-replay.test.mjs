import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {registerMergedSource,summarizeBacklog,safeInstrumentation,topCounts,sourceFingerprint,contentFingerprint} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';

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

// ---- run instrumentation (PR-1): report-only numbers, conservation checks instead of fixed production counts ----
const accounted=i=>i.run.attempted+i.run.unchangedSkipped+i.run.notReachedBudget;
test('the run report accounts for every target and splits this merge from the queued backlog',async t=>{
  const f=fixture(t),first=await f.first(),i=first.instrumentation;
  assert.equal(i.schemaVersion,'archive-main-merge-meta-instrumentation-v1');
  assert.equal(i.run.targets,accounted(i),'targets = attempted + skipped unchanged + not reached');
  assert.equal(i.run.applied+i.run.alreadyRegistered+i.run.refused,i.run.attempted);
  assert.equal(i.run.attempted,first.replayBatch.targets.length);assert.equal(i.run.registeredUids,first.applied);
  assert.equal(i.run.requestFiles,first.plannedPaths.filter(p=>p.includes('/requests/')).length);
  assert.equal(i.attemptedByFile.top.reduce((n,r)=>n+r.total,0)+i.attemptedByFile.otherCount,i.run.attempted);
  for(const r of i.attemptedByFile.top)assert.equal(r.total,r.registered+r.alreadyRegistered+r.refused);
  assert.equal(i.origin.available,true);
  const o=i.origin;
  assert.equal(o.thisMergeDiff.questions+o.queuedBacklog.questions+o.pilot.questions,i.run.targets);
  assert.equal(o.thisMergeDiff.questions,0,'no exam bytes changed since the cursor');assert.equal(o.thisMergeQuestionsNotReachedBecauseOfBudget,0);
  const b=i.backlogAfterRun;
  assert.equal(b.pendingTotal,first.pending);assert.equal(i.pendingBeforeRun,3);
  assert.ok(b.neverTried<=b.withoutAttemptSignature);assert.ok(b.attemptedRefused<=b.pendingTotal);assert.ok(b.withoutAttemptSignature<=b.pendingTotal);
  assert.ok(b.reasonAtomTotal>=b.attemptedRefused,'an entry can carry several reasons, never fewer than one');
  assert.equal(b.reasons.top.reduce((n,r)=>n+r.count,0)+b.reasons.otherCount,b.reasonAtomTotal);
  assert.equal(b.oldestBaseCommit.commit,f.head);assert.equal(b.oldestBaseCommit.count,b.pendingTotal);
});

test('a changed exam question that the batch limit leaves behind is counted as this-merge work not reached',async t=>{
  const f=fixture(t);
  const bank=JSON.parse(f.bytes('archive/exams/'+source).toString().replace(/^window\.questionBank=/,'').replace(/;\s*$/,''));
  bank[2].content='Fixture 3 revised';
  f.put('archive/exams/'+source,'window.questionBank='+JSON.stringify(bank)+';\n');f.git('add','-A');f.git('commit','-qm','revise question 3');
  const first=await f.first(),i=first.instrumentation,o=i.origin;
  assert.equal(o.thisMergeDiff.questions,1);assert.equal(o.thisMergeDiff.changedExamFiles,1);assert.equal(o.thisMergeDiff.alsoQueuedBefore,1);
  assert.equal(o.queuedBacklog.questions,2);
  assert.equal(o.thisMergeQuestionsNotReachedBecauseOfBudget,1,'limit 1 reaches ordinal 1 only; ordinal 3 waits in the queue');
  assert.equal(o.thisMergeDiff.attempted+o.thisMergeDiff.unchangedSkipped+o.thisMergeDiff.notReachedBudget,o.thisMergeDiff.questions);
  assert.equal(i.run.targets,accounted(i));
  assert.ok(f.read(statePath).pending[source+'#3'],'the unreached question is still queued, not lost');
});

test('instrumentation is outside the replay binding: no committed byte, digest or replay verdict depends on it',async t=>{
  const f=fixture(t),first=await f.first(),stateBefore=f.bytes(statePath);
  assert.equal(Object.hasOwn(first.replayBatch,'instrumentation'),false);
  const replayed=await f.replay();assert.equal(replayed.replayVerified,true);
  assert.equal(Object.hasOwn(replayed,'instrumentation'),false,'a replay report carries no run numbers');
  const report=f.read('first-report.json');report.instrumentation={at:new Date().toISOString(),random:Math.random(),run:null};f.put('first-report.json',report);
  assert.equal((await f.replay()).replayVerified,true,'timestamps or any other value in the instrumentation cannot break idempotence');
  delete report.instrumentation;f.put('first-report.json',report);assert.equal((await f.replay()).replayVerified,true);
  assert.deepEqual(f.bytes(statePath),stateBefore);
  assert.equal(JSON.stringify(f.read(statePath)).includes('instrumentation'),false);
});

test('an empty queue still reports zero work with the same accounting',async t=>{
  const f=fixture(t,{count:1,pending:()=>false});await f.first();
  const empty=await f.first(),i=empty.instrumentation;
  assert.equal(i.run.targets,0);assert.equal(accounted(i),0);assert.equal(i.backlogAfterRun.pendingTotal,0);assert.equal(i.backlogAfterRun.oldestBaseCommit,null);
});

test('backlog summary counts reasons per atom, flags multi-reason entries and finds the oldest base by commit date',async t=>{
  const f=fixture(t,{count:1,pending:()=>false});
  f.put('later.txt','later');f.git('add','later.txt');f.git('commit','-qm','later');
  const newer=f.git('rev-parse','HEAD'),older=f.head;
  const pending={a:{baseCommit:newer,attemptSignature:'s',lastReasons:['X','Y:1']},b:{baseCommit:older,attemptSignature:'s',lastReasons:['X']},
    c:{baseCommit:older},d:{baseCommit:older,attemptSignature:'s'},e:{baseCommit:'0'.repeat(40)}};
  const s=summarizeBacklog(f.root,pending);
  assert.equal(s.pendingTotal,5);assert.equal(s.withoutAttemptSignature,2);assert.equal(s.attemptedRefused,2);assert.equal(s.neverTried,2);
  assert.equal(s.entriesWithMultipleReasons,1);assert.equal(s.reasonAtomTotal,3);assert.ok(s.reasonAtomTotal>=s.attemptedRefused);
  assert.deepEqual(s.reasons.top,[{name:'X',count:2},{name:'Y:1',count:1}]);
  assert.deepEqual(s.reasonKinds.top,[{name:'X',count:2},{name:'Y',count:1}]);
  assert.equal(s.distinctBaseCommits,3);
  assert.equal(s.oldestBaseCommit,null,'an unresolvable base commit never fails the report');
  delete pending.e;
  assert.equal(summarizeBacklog(f.root,pending).oldestBaseCommit.commit,older);assert.equal(summarizeBacklog(f.root,pending).oldestBaseCommit.count,3);
  const many=new Map(Array.from({length:30},(_,i)=>['n'+String(i).padStart(2,'0'),i+1]));
  const top=topCounts(many);assert.equal(top.top.length,20);assert.equal(top.otherNames,10);
  assert.equal(top.top.reduce((n,r)=>n+r.count,0)+top.otherCount,465);assert.equal(top.top[0].name,'n29');
});

test('a pending entry with unexpected values never stops registration or the other report fields',async t=>{
  const f=fixture(t,{count:2,max:2,pending:()=>false});
  const state=f.read(statePath);
  Object.assign(state.pending[source+'#2'],{lastReasons:'oops',attemptSignature:{}});
  f.put(statePath,state);
  const r=await f.first();
  assert.equal(r.applied,2,'both questions still register');assert.ok(r.instrumentation);
  assert.ok(r.results.every(x=>x.status==='APPLY'));
  const s=summarizeBacklog(f.root,{a:null,b:'x',c:{lastReasons:[null,{}],baseCommit:{}},d:{lastReasons:'oops'}});
  assert.equal(s.pendingTotal,4);assert.equal(s.malformedEntries,2);assert.ok(s.reasonAtomTotal>=2);
  const broken=safeInstrumentation(()=>{throw Error('boom '+'x'.repeat(500));});
  assert.equal(broken.schemaVersion,'archive-main-merge-meta-instrumentation-v1');assert.ok(broken.error.startsWith('boom'));assert.ok(broken.error.length<=160);
  assert.deepEqual(safeInstrumentation(()=>({ok:1})),{ok:1});
});
