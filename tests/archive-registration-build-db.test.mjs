import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {runBuildDb,VALIDATION_COMMANDS} from '../tools/ci/archive-registration-build-db.mjs';

const sourceRoot=path.resolve(import.meta.dirname,'..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function fixture(t) {
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'registration-build-test-'));
  t.after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
  const root=path.join(tmp,'repo'),cache=path.join(tmp,'cache');fs.mkdirSync(root);
  const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']}).toString().trim();
  git('init','-q');git('config','user.name','Build fixture');git('config','user.email','build@example.invalid');
  const put=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,v);};
  for(const [p,v] of Object.entries({
    'archive/build_db.py':'# synthetic producer\n','archive/exams/synthetic.js':'globalThis.example = 1;\n',
    'archive/assets/example.svg':'<svg/>\n','archive/data/question_metadata.json':'{"records":[]}\n',
    'archive/data/question_identity_map.json':'{"records":[]}\n','archive/data/canonical/rows.json':'[]\n',
    'archive/data/runtime/rows.json':'[]\n','archive/data/parent.json':'{}\n','archive/data/catalog.json':'{"old":true}\n',
    'archive/tools/example.mjs':'export const n = 1;\n','tools/ci/archive-registration-writer.mjs':'// synthetic policy\n',
    'docs/operations/immutable-review.json':'{"hash":"synthetic"}\n',
    '.archive-meta-register/auto/state.json':'{}\n','.archive-meta-register/auto/last-verification.json':'{}\n'
  }))put(p,v);
  git('add','-A');git('commit','-qm','synthetic baseline');
  const sharedInputs=['archive/exams/','archive/assets/','archive/build_db.py','archive/tools/',
    'archive/data/question_metadata.json','archive/data/question_identity_map.json','archive/data/canonical/',
    'archive/data/runtime/','archive/data/parent.json','tools/ci/'];
  const lanes=[
    {id:'semantic',inputs:[...sharedInputs,'.archive-meta-register/auto/state.json'],outputs:['archive/data/',
      '.archive-meta-register/auto/state.json','.archive-meta-register/auto/last-verification.json'],required:false},
    {id:'shared',inputs:sharedInputs,outputs:['archive/data/'],required:true}
  ];
  const env={...process.env,ARCHIVE_REGISTRATION_BUILD_CACHE_DIR:cache,
    ARCHIVE_REGISTRATION_BUILD_PREPARE_ID:'11111111-2222-4333-8444-555555555555'};
  let builds=0;const validations=[];
  const produce=()=>{builds++;put('archive/data/catalog.json','{"generated":true}\n');return {status:0,signal:null};};
  const run=(options={})=>runBuildDb({root,env,policyProvider:()=>lanes,executeBuild:produce,
    executeValidation:command=>{validations.push(command);return {status:0,signal:null};},log:()=>{},...options});
  return {tmp,root,cache,git,put,lanes,env,run,produce,validations,get builds(){return builds;}};
}

test('same prepare, HEAD, complete inputs and outputs reuse only generation; original index and source are unchanged',async t=>{
  const f=fixture(t),index=fs.readFileSync(path.join(f.root,'.git/index')),source=fs.readFileSync(path.join(f.root,'archive/exams/synthetic.js'));
  const a=await f.run(),b=await f.run();
  assert.equal(a.status,'GENERATED');assert.equal(a.checkpointSaved,true);
  assert.equal(b.status,'GENERATION_REUSED');assert.equal(f.builds,1);
  assert.equal(b.validationSkipped,false);assert.equal(b.registrationApprovalClaim,false);
  assert.deepEqual(f.validations,VALIDATION_COMMANDS);assert.equal(b.freshValidationCommands.length,4);
  assert.equal(sha(fs.readFileSync(path.join(f.root,'.git/index'))),sha(index));
  assert.equal(sha(fs.readFileSync(path.join(f.root,'archive/exams/synthetic.js'))),sha(source));
  assert.equal(f.git('log','--oneline').split('\n').length,1);
});

test('a generation that changes its own read set cannot skip the next fixed-point generation',async t=>{
  const f=fixture(t);let calls=0;
  const produce=()=>{
    calls++;
    if(calls===1)f.put('archive/data/question_identity_map.json','{"records":[{"synthetic":"new"}]}\n');
    f.put('archive/data/catalog.json',calls===1?'{"phase":"first"}\n':'{"phase":"fixed"}\n');
    return {status:0,signal:null};
  };
  const first=await f.run({executeBuild:produce});
  assert.equal(first.status,'GENERATED');assert.equal(first.checkpointSaved,false);
  assert.equal(first.cacheUnavailableCode,'CACHE_GENERATION_INPUT_CHANGED');
  const second=await f.run({executeBuild:produce});
  assert.equal(second.status,'GENERATED');assert.equal(second.checkpointSaved,true);
  assert.equal(calls,2);assert.equal(fs.readFileSync(path.join(f.root,'archive/data/catalog.json'),'utf8'),'{"phase":"fixed"}\n');
  assert.equal((await f.run({executeBuild:produce})).status,'GENERATION_REUSED');
  assert.equal(calls,2);assert.equal(f.validations.length,4);
});

test('a producer whose input keeps changing never issues a reusable fixed-point checkpoint',async t=>{
  const f=fixture(t);let calls=0;
  const produce=()=>{
    calls++;f.put('archive/data/parent.json',JSON.stringify({syntheticPass:calls})+'\n');
    return {status:0,signal:null};
  };
  for(let i=0;i<3;i++){
    const r=await f.run({executeBuild:produce});
    assert.equal(r.status,'GENERATED');assert.equal(r.checkpointSaved,false);
    assert.equal(r.cacheUnavailableCode,'CACHE_GENERATION_INPUT_CHANGED');
  }
  assert.equal(calls,3);assert.equal(f.validations.length,0);
});

for(const [label,relative] of [
  ['source','archive/exams/synthetic.js'],['asset','archive/assets/example.svg'],
  ['metadata','archive/data/question_metadata.json'],['identity','archive/data/question_identity_map.json'],
  ['canonical','archive/data/canonical/rows.json'],['runtime','archive/data/runtime/rows.json'],
  ['parent evidence','archive/data/parent.json'],['generated output','archive/data/catalog.json'],
  ['production code','archive/tools/example.mjs'],['producer code','archive/build_db.py'],
  ['immutable review outside shared inputs','docs/operations/immutable-review.json'],
  ['new untracked source','archive/exams/new.js'],['new untracked evidence','docs/operations/new-proof.json']
]) test(`${label} drift requires the real producer`,async t=>{
  const f=fixture(t);await f.run();f.put(relative,'{"syntheticChanged":true}\n');
  const r=await f.run();assert.equal(r.status,'GENERATED');assert.equal(f.builds,2);
});

test('same bytes on a different HEAD are not reused',async t=>{
  const f=fixture(t);await f.run();f.git('commit','--allow-empty','-qm','new current snapshot');
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
});
test('reference movement invalidates otherwise identical working files',async t=>{
  const f=fixture(t);await f.run();f.git('tag','new-immutable-reference');
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
});
test('Git configuration and execution environment changes invalidate generation reuse',async t=>{
  const f=fixture(t);await f.run();f.git('config','core.filemode','false');
  assert.equal((await f.run()).status,'GENERATED');
  assert.equal((await f.run({env:{...f.env,TZ:'UTC-distinct-fixture'}})).status,'GENERATED');assert.equal(f.builds,3);
});
test('a fresh preparation cannot inherit the prior preparation checkpoint',async t=>{
  const f=fixture(t);await f.run();
  assert.equal((await f.run({env:{...f.env,ARCHIVE_REGISTRATION_BUILD_PREPARE_ID:'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'}})).status,'GENERATED');
  assert.equal(f.builds,2);
});
test('changed lane policy is a real-generation cache miss',async t=>{
  const f=fixture(t);await f.run();f.lanes[1].parameters={exactNewParameter:true};
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
});
test('a state-only control output outside the established shared read set does not replace any validation',async t=>{
  const f=fixture(t);await f.run();f.put('.archive-meta-register/auto/last-verification.json','{"changedControlRecord":true}\n');
  const r=await f.run();assert.equal(r.status,'GENERATION_REUSED');assert.equal(r.validationSkipped,false);assert.equal(f.builds,1);
});

for(const label of ['missing','invalid JSON','forged exit','extra field','writable checkpoint'])test(`${label} checkpoint falls back to actual generation`,async t=>{
  const f=fixture(t);await f.run();const file=path.join(f.cache,'build-db-checkpoint.json');
  if(label==='missing')fs.unlinkSync(file);
  else if(label==='invalid JSON')fs.writeFileSync(file,'{');
  else if(label==='writable checkpoint')fs.chmodSync(file,0o666);
  else {const doc=JSON.parse(fs.readFileSync(file));if(label==='forged exit')doc.exitCode=1;else doc.claim='PASS';fs.writeFileSync(file,JSON.stringify(doc));}
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
});
test('a symlink checkpoint is never followed as reusable authority',async t=>{
  const f=fixture(t);await f.run();const file=path.join(f.cache,'build-db-checkpoint.json'),other=path.join(f.tmp,'other.json');
  fs.copyFileSync(file,other);fs.unlinkSync(file);fs.symlinkSync(other,file);
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
});
test('a symlink event target is neither written nor accepted to authorize reuse',async t=>{
  const f=fixture(t);await f.run();const file=path.join(f.cache,'build-db-events.jsonl'),target=path.join(f.tmp,'protected.txt');
  fs.writeFileSync(target,'immutable fixture\n');fs.unlinkSync(file);fs.symlinkSync(target,file);
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
  assert.equal(fs.readFileSync(target,'utf8'),'immutable fixture\n');
});
test('failed generation deletes the previous checkpoint and cannot certify a later attempt',async t=>{
  const f=fixture(t);await f.run();f.put('archive/data/parent.json','{"new":1}\n');
  const fail=await f.run({executeBuild:()=>({status:7,signal:null})});
  assert.equal(fail.status,'GENERATION_FAILED');assert.equal(fail.exitCode,7);assert.equal(fail.checkpointSaved,false);
  assert.equal(fs.existsSync(path.join(f.cache,'build-db-checkpoint.json')),false);
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
});
test('a signalled producer and process error never create a success checkpoint',async t=>{
  const f=fixture(t);
  for(const result of [{status:null,signal:'SIGKILL'},{status:null,signal:null,error:{code:'ENOENT'}}]) {
    const r=await f.run({executeBuild:()=>result});assert.equal(r.status,'GENERATION_FAILED');assert.equal(r.checkpointSaved,false);
  }
  assert.equal(fs.existsSync(path.join(f.cache,'build-db-checkpoint.json')),false);
});
test('a thrown producer error leaves no reusable checkpoint',async t=>{
  const f=fixture(t);await f.run();f.put('archive/data/parent.json','{"mustRegenerate":true}\n');
  await assert.rejects(f.run({executeBuild:()=>{throw Error('synthetic producer exception');}}),/synthetic producer exception/);
  assert.equal(fs.existsSync(path.join(f.cache,'build-db-checkpoint.json')),false);
});
for(const index of [0,1,2,3])test(`fresh validation ${index+1} failure requires original generation and preserves the refusal`,async t=>{
  const f=fixture(t);await f.run();let n=0;
  const r=await f.run({executeValidation:()=>({status:n++===index?9:0,signal:null})});
  assert.equal(r.status,'GENERATED');assert.equal(f.builds,2);assert.equal(r.cacheUnavailableCode,'CACHE_FRESH_VALIDATION_FAILED');
  const events=fs.readFileSync(path.join(f.cache,'build-db-events.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
  assert(events.some(e=>e.status==='REUSE_REFUSED_REGENERATING'&&e.freshValidationCommands.at(-1).status===9));
});
test('a signalled fresh validator is not a reusable approval',async t=>{
  const f=fixture(t);await f.run();const r=await f.run({executeValidation:()=>({status:null,signal:'SIGKILL'})});
  assert.equal(r.status,'GENERATED');assert.equal(f.builds,2);assert.equal(r.cacheUnavailableCode,'CACHE_FRESH_VALIDATION_FAILED');
});
test('fresh check mutation is detected before any reuse is claimed',async t=>{
  const f=fixture(t);await f.run();const r=await f.run({executeValidation:()=>{f.put('archive/data/parent.json','{"unexpectedCheckWrite":true}');return {status:0,signal:null};}});
  assert.equal(r.status,'GENERATED');assert.equal(f.builds,2);assert.equal(r.cacheUnavailableCode,'CACHE_FRESH_VALIDATION_MUTATED_INPUT');
  assert.equal(r.checkpointSaved,false);
  assert.equal(fs.existsSync(path.join(f.cache,'build-db-checkpoint.json')),false);
});
test('an ignored dependency prevents reuse until it is removed',async t=>{
  const f=fixture(t);f.put('.gitignore','archive/data/ignored.json\n');f.git('add','-A');f.git('commit','-qm','ignore fixture');
  f.put('archive/data/ignored.json','{}\n');
  for(let i=0;i<2;i++){const r=await f.run();assert.equal(r.status,'GENERATED');assert.equal(r.checkpointSaved,false);assert.equal(r.cacheUnavailableCode,'CACHE_IGNORED_DEPENDENCY');}
  assert.equal(f.builds,2);
});
// The CI step "Assemble question metadata" rebuilds archive/data/question_metadata.json from tracked shards and git ignores it. Before this
// it counted as an unbound ignored dependency, so no build was ever reused in CI (every build event said CACHE_IGNORED_DEPENDENCY).
function ignoreAssembledMetadata(f) {
  f.put('.gitignore','archive/data/question_metadata.json\n');f.git('rm','--cached','-q','archive/data/question_metadata.json');
  f.git('add','-A');f.git('commit','-qm','assembled metadata is ignored');
  assert.equal(f.git('check-ignore','archive/data/question_metadata.json'),'archive/data/question_metadata.json');
}
test('the assembled, git-ignored question metadata is bound by its raw bytes: unchanged bytes reuse generation, changed bytes do not',async t=>{
  const f=fixture(t);ignoreAssembledMetadata(f);
  const a=await f.run();assert.equal(a.status,'GENERATED');assert.equal(a.checkpointSaved,true);assert.equal(a.cacheUnavailableCode,null);
  const b=await f.run();assert.equal(b.status,'GENERATION_REUSED');assert.equal(f.builds,1);
  assert.equal(b.freshValidationCommands.length,4,'validation commands still run on every reuse');
  f.put('archive/data/question_metadata.json','{"records":[{"edited":true}]}\n');
  const c=await f.run();assert.equal(c.status,'GENERATED');assert.equal(f.builds,2,'an edit to the ignored input is a cache miss');
});
test('every other ignored dependency still refuses reuse even when the assembled metadata is ignored too',async t=>{
  const f=fixture(t);ignoreAssembledMetadata(f);
  f.put('.gitignore','archive/data/question_metadata.json\narchive/data/ignored.json\n');f.git('add','-A');f.git('commit','-qm','ignore two');
  f.put('archive/data/ignored.json','{}\n');
  const r=await f.run();assert.equal(r.checkpointSaved,false);assert.equal(r.cacheUnavailableCode,'CACHE_IGNORED_DEPENDENCY');
});
test('variables a shell sets by itself do not defeat reuse between different calling scripts, any other variable still does',async t=>{
  const f=fixture(t);
  await f.run({env:{...f.env,_:'/usr/bin/node',SHLVL:'2',OLDPWD:'/a'}});
  const same=await f.run({env:{...f.env,_:'/usr/bin/bash',SHLVL:'3',OLDPWD:'/b'}});
  assert.equal(same.status,'GENERATION_REUSED');assert.equal(f.builds,1);
  const other=await f.run({env:{...f.env,SYNTHETIC_BUILD_SWITCH:'1'}});
  assert.equal(other.status,'GENERATED');assert.equal(f.builds,2);
});
test('symlink inputs are uncertain and force actual generation',async t=>{
  const f=fixture(t);fs.symlinkSync('synthetic.js',path.join(f.root,'archive/exams/alias.js'));
  const r=await f.run();assert.equal(r.status,'GENERATED');assert.equal(r.checkpointSaved,false);assert.equal(r.cacheUnavailableCode,'CACHE_UNSUPPORTED_FILE_MODE');
});
test('cache directory inside the checkout is rejected without suppressing the ordinary producer',async t=>{
  const f=fixture(t);const cache=path.join(f.root,'unsafe-cache');
  const r=await f.run({env:{...f.env,ARCHIVE_REGISTRATION_BUILD_CACHE_DIR:cache}});
  assert.equal(r.status,'GENERATED');assert.equal(r.checkpointSaved,false);assert.equal(r.cacheUnavailableCode,'CACHE_INSIDE_CHECKOUT');assert(!fs.existsSync(cache));
});
test('legacy calls without writer preparation variables always execute the original producer',async t=>{
  const f=fixture(t),env={...f.env};delete env.ARCHIVE_REGISTRATION_BUILD_CACHE_DIR;delete env.ARCHIVE_REGISTRATION_BUILD_PREPARE_ID;
  for(let i=0;i<2;i++)assert.equal((await f.run({env,policyProvider:()=>{throw Error('must not read policy');}})).status,'GENERATED');
  assert.equal(f.builds,2);assert(!fs.existsSync(f.cache));
});
test('a producer changing immutable files cannot seal a reusable checkpoint',async t=>{
  const f=fixture(t);const r=await f.run({executeBuild:()=>{f.put('docs/operations/immutable-review.json','{"unexpected":true}');return {status:0,signal:null};}});
  assert.equal(r.status,'GENERATED');assert.equal(r.checkpointSaved,false);assert.equal(r.cacheUnavailableCode,'CACHE_IMMUTABLE_CONTEXT_CHANGED');
});
test('changed execution mode is detected by current worktree hashing',async t=>{
  const f=fixture(t);await f.run();fs.chmodSync(path.join(f.root,'archive/tools/example.mjs'),0o755);
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
});
test('Git CRLF normalization cannot conceal changed raw source bytes',async t=>{
  const f=fixture(t);f.put('.gitattributes','*.js text eol=lf\n');f.git('add','-A');f.git('commit','-qm','raw fingerprint contract');
  await f.run();const relative='archive/exams/synthetic.js';const normalized=f.git('hash-object','--path='+relative,relative);
  f.put(relative,fs.readFileSync(path.join(f.root,relative),'utf8').replace(/\n/g,'\r\n'));
  assert.equal(f.git('hash-object','--path='+relative,relative),normalized);
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
});
test('newly tracked dependency paths invalidate an unchanged raw working tree',async t=>{
  const f=fixture(t);f.put('archive/data/new-output.json','{}\n');await f.run();
  f.git('add','archive/data/new-output.json');
  assert.equal((await f.run()).status,'GENERATED');assert.equal(f.builds,2);
});
test('alternate Git-index environment disables reuse',async t=>{
  const f=fixture(t);await f.run();
  const r=await f.run({env:{...f.env,GIT_INDEX_FILE:path.join(f.root,'.git/index')}});
  assert.equal(r.status,'GENERATED');assert.equal(r.checkpointSaved,false);assert.equal(r.cacheUnavailableCode,'CACHE_ALTERNATE_GIT_CONTEXT');
});
test('existing official validators and bounded fixed-point branches remain in their callers',()=>{
  const read=p=>fs.readFileSync(path.join(sourceRoot,p),'utf8');
  const reviewed=read('tools/ci/reviewed-meta-register-pass.sh'),semantic=read('tools/ci/archive-main-auto-meta-pass.sh'),shared=read('tools/ci/archive-pages-registration-derive.sh');
  for(const expected of ['verify-reviewed-projection-requests.mjs','collect-reviewed-consumer-refusals.mjs','verify-archive-registration.mjs','build-archive2-catalog.mjs --check','--canonical-only-check'])assert(reviewed.includes(expected));
  assert(read('tools/ci/verify-reviewed-projection-requests.mjs').includes('--verify-projection'));
  for(const expected of ['--verify --report','--replay-report','AUTO_META_REPLAY_NOT_IDEMPOTENT','verify-archive-registration.mjs','archive-question-identity-runtime.test.mjs'])assert(semantic.includes(expected));
  assert.equal((reviewed.match(/node tools\/ci\/archive-registration-build-db\.mjs/g)||[]).length,2);
  assert.equal((semantic.match(/node tools\/ci\/archive-registration-build-db\.mjs/g)||[]).length,3);
  assert.equal((shared.match(/node tools\/ci\/archive-registration-build-db\.mjs/g)||[]).length,1);
  for(const expected of ['refresh_meta_foundation_compiled','materialize-meta-v2-payloads.mjs --write','materialize-meta-v2-payloads.mjs --check','verify-archive-registration.mjs'])assert(shared.includes(expected));
});
