import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {registerMergedSource,sourceFingerprint,contentFingerprint,reportSourceRebind,planSourceRebind,verifyMergedSource} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';

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

function change(f,patch) {
  Object.assign(f.bank[0],patch);f.put('archive/exams/'+source,'window.questionBank='+JSON.stringify(f.bank)+';\n');
  f.git('add','archive/exams/'+source);f.git('commit','-qm','source correction');
}
const writeRebind=f=>withGitHubEnvironment({GITHUB_ACTIONS:'false'},()=>registerMergedSource({root:f.root,write:true,rebind:true}));

test('default OFF produces the exact legacy mismatch bytes and mutates no data',async t=>{
  const f=fixture(t,{count:1});change(f,{solution:'Corrected solution.'});
  const before=[metaPath,identityPath,statePath].map(p=>f.bytes(p));
  const a=await registerMergedSource({root:f.root}),b=await registerMergedSource({root:f.root,rebind:false});
  assert.equal(JSON.stringify(a),JSON.stringify(b));
  assert.equal(JSON.stringify(a.results),JSON.stringify([{status:'SUPPLEMENT_PENDING',reasons:['IDENTITY_SOURCE_FINGERPRINT_MISMATCH'],questionUid:f.uid(1),sourceArchiveFile:source,sourceOrdinal:1}]));
  [metaPath,identityPath,statePath].forEach((p,i)=>assert.deepEqual(f.bytes(p),before[i]));
});

test('opt-in rebind keeps approvals/values and writes distinct immutable evidence, rerun has no duplicates',async t=>{
  const f=fixture(t,{count:1}),before=f.read(metaPath).records[0];change(f,{solution:'Corrected solution.'});
  const a=await writeRebind(f);assert.equal(a.results[0].status,'REBIND');
  const after=f.read(metaPath).records[0],receipt=f.read(a.results[0].receiptPath);
  assert.equal(receipt.kind,'SOURCE_REBIND');assert.deepEqual(receipt.before,before);
  for(const [k,v]of Object.entries(before))if(!['sourceFingerprint','contentFingerprint'].includes(k))assert.deepEqual(after[k],v,k);
  assert.deepEqual(after.reviewPending,['method']);assert.equal(after.sourceFingerprint,sourceFingerprint(f.bank[0]));
  assert.equal(f.read(identityPath).records[0].sourceFingerprint,after.sourceFingerprint);
  const saved=f.bytes(a.results[0].receiptPath),second=await writeRebind(f);
  assert.equal(second.applied,0);assert.deepEqual(f.bytes(a.results[0].receiptPath),saved);
  assert.equal(fs.readdirSync(path.join(f.root,'.archive-meta-register/auto/receipts')).length,1);
});

test('BLOCK leaves old fingerprint unbound and repeated runs retain one historical receipt',async t=>{
  const f=fixture(t,{count:1}),before=f.read(metaPath).records[0];change(f,{content:'전혀 다른 삼각형의 합동 조건을 설명하시오.'});
  const a=await writeRebind(f);assert.equal(a.results[0].status,'BLOCK');
  const after=f.read(metaPath).records[0];assert.equal(after.sourceFingerprint,before.sourceFingerprint);
  assert.equal(after.sourceDrift.metadataExcluded,true);assert.deepEqual(after.fieldStatus,before.fieldStatus);
  const second=await writeRebind(f);assert.equal(second.results[0].status,'SUPPLEMENT_PENDING_UNCHANGED');
  assert.equal(fs.readdirSync(path.join(f.root,'.archive-meta-register/auto/receipts')).length,1);
});

test('report works with feature OFF and disabled config, refuses internal/symlink destinations, never writes repository',async t=>{
  const f=fixture(t,{count:1});change(f,{solution:'Corrected.'});f.put(configPath,{enabled:false});
  const out=path.join(os.tmpdir(),'rebind-report-'+crypto.randomUUID()+'.json');t.after(()=>fs.rmSync(out,{force:true}));
  const before=f.git('status','--porcelain'),meta=f.bytes(metaPath);
  const report=await registerMergedSource({root:f.root,rebind:false,rebindReportPath:out});
  assert.equal(report.mismatchCount,1);assert.equal(report.results[0].action,'REBIND');assert.equal(report.write,false);
  assert.equal(f.git('status','--porcelain'),before);assert.deepEqual(f.bytes(metaPath),meta);
  await assert.rejects(registerMergedSource({root:f.root,write:true,rebindReportPath:out}),/READ_ONLY/);
  assert.throws(()=>reportSourceRebind({root:f.root,reportPath:path.join(f.root,'forbidden.json')}),/OUTSIDE/);
  const link=out+'-link';fs.symlinkSync(f.root,link);t.after(()=>fs.unlinkSync(link));
  assert.throws(()=>reportSourceRebind({root:f.root,reportPath:path.join(link,'forbidden.json')}),/OUTSIDE/);
});

for(const [name,patch,reason]of [
  ['no old blob',f=>{const m=f.read(metaPath);m.records[0].sourceFingerprint='a'.repeat(64);f.put(metaPath,m);},'NO_PRIOR_BLOB'],
  ['number mismatch',f=>change(f,{id:2}),'NUMBER_MISMATCH'],
  ['count mismatch',f=>{f.bank.push({...f.bank[0],id:2});change(f,{solution:'Updated'});},'QUESTION_COUNT_MISMATCH'],
  ['third identity fingerprint',f=>{const i=f.read(identityPath);i.records[0].sourceFingerprint='b'.repeat(64);f.put(identityPath,i);},'IDENTITY_SOURCE_FINGERPRINT_CONFLICT'],
])test('rebind refuses '+name,async t=>{
  const f=fixture(t,{count:1});change(f,{solution:'Corrected.'});patch(f);
  const before=f.bytes(metaPath),a=await writeRebind(f);
  if(name==='number mismatch')assert.deepEqual(a.results[0].reasons,['SOURCE_ORDINAL_CHANGED']);
  else {assert.equal(a.results[0].rebindPlan.action,'REFUSE');assert.equal(a.results[0].rebindPlan.reason,reason);}
  assert.deepEqual(f.bytes(metaPath),before);
});

 test('a cached BLOCK never starves a later rebind in a bounded queue',async t=>{
  const f=fixture(t,{count:2,max:1});f.bank[1].solution='Corrected second solution';
  change(f,{content:'전혀 다른 삼각형의 합동 조건을 설명하시오.'});
  const a=await writeRebind(f);assert.equal(a.results[0].status,'BLOCK');
  const b=await writeRebind(f);assert.equal(b.results[0].status,'SUPPLEMENT_PENDING_UNCHANGED');
  assert.equal(b.results[1].status,'REBIND');assert.equal(b.results[1].sourceOrdinal,2);
});

test('verification proves core rebind state without claiming consumer verification',async t=>{
  const f=fixture(t,{count:1});change(f,{solution:'Corrected.'});const report=await writeRebind(f);
  f.put('rebind-report.json',report);
  const verified=await verifyMergedSource({root:f.root,reportPath:path.join(f.root,'rebind-report.json')});
  assert.equal(verified.status,'REBIND_CORE_VERIFIED_CONSUMERS_PENDING');assert.equal(verified.consumerVerification,'NOT_RUN');
  assert.equal(verified.rebindVerified.length,1);assert.equal(verified.verifiedCount,0);
  const identity=f.read(identityPath);identity.records[0].sourceFingerprint='a'.repeat(64);f.put(identityPath,identity);
  await assert.rejects(verifyMergedSource({root:f.root,reportPath:path.join(f.root,'rebind-report.json')}),/REBIND_IDENTITY_DRIFT/);
});

test('valueless CLI report flag fails instead of falling through to writing',t=>{
  const f=fixture(t,{count:1});const module=path.resolve('archive/tools/meta-foundation/auto-register-merged-source.mjs');
  assert.throws(()=>execFileSync(process.execPath,[module,'--root',f.root,'--write','--rebind-report'],{stdio:'pipe'}),
    error=>error.stderr.toString().includes('REBIND_REPORT_PATH_REQUIRED'));
});
