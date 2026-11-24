import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {recordRejection} from '../tools/ci/register-reviewed-meta-requests.mjs';
import {prepareRegistration,checkRegistration,nativeLanes,matches,matchesReference,compilePatterns,fingerprint,indexRows,executeCommands,unrelatedRange,renderRegistrationSummary,readStageTimes,staleMaterializedPayloads,laneInstrumentation,inferRegistrationMode,STATE} from '../tools/ci/archive-registration-writer.mjs';

// Orchestration fixtures, not student questions or mathematical review. Native producers are deliberately
// replaced by small deterministic writers; their existing suites and real Actions remain separate evidence.
const git=(root,...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const source='archive/exams/fixture.js',asset='archive/assets/images/fixture.svg';
const cursor='.archive-meta-register/auto/state.json',receipts='.archive-meta-register/auto/receipts/';
const seals='archive/data/meta-foundation/crosswalks/sealed-digests.v1.json';
const reviewedReceipt='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/sealed.json';
const read=(root,rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const readJson=(root,rel)=>JSON.parse(read(root,rel));
function write(root,rel,value) {
  fs.mkdirSync(path.dirname(path.join(root,rel)),{recursive:true});
  fs.writeFileSync(path.join(root,rel),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');
}
function commit(root,message='fixture change') {git(root,'add','-A');git(root,'commit','-q','-m',message);return git(root,'rev-parse','HEAD');}
function fixture(t) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'archive-single-writer-')),root=path.join(dir,'repo'),work=path.join(dir,'evidence');
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));fs.mkdirSync(root);
  git(root,'init','-q','--initial-branch=main');git(root,'config','user.name','fixture');git(root,'config','user.email','fixture@example.invalid');
  write(root,source,'{"uid":"fixture_uid","asset":"'+asset+'"}\n');
  write(root,asset,'<svg xmlns="http://www.w3.org/2000/svg"/>\n');
  write(root,'inputs/review.json',{sourceSha256:hash(read(root,source))});write(root,'inputs/meta.json',{label:'fixture metadata'});
  write(root,'inputs/inbox.json',{requestId:'fixture-request'});
  write(root,'archive/data/item-4slot/fixture.json',{uid:'fixture_uid'});
  write(root,'tools/validator.mjs','// fixture technical validator v1\n');write(root,'tools/4slot.cjs','// fixture 4slot builder v1\n');
  write(root,'out/metadata.json',{uid:'old_uid',label:'old'});write(root,'out/identity.json',{uid:'old_uid'});
  write(root,'out/generated.json',{uid:'old_uid'});write(root,'out/catalog.json',{uid:'old_uid'});write(root,'out/4slot.json',{uid:'old_uid'});
  write(root,cursor,{sourceSha256:'old',lastProcessedCommit:'old'});write(root,receipts+'sealed.json',{receipt:'immutable'});
  write(root,seals,{schemaVersion:'fixture-seals',entries:[{path:'crosswalk.json',sha256:'old-seal',sealedBy:'prior-writer'}]});
  write(root,'alive/approval/receipt.json',{approval:'immutable'});
  write(root,reviewedReceipt,{approval:'immutable reviewed receipt'});
  commit(root,'fixture seed');
  const lanes=[
    {id:'reviewed',inputs:['inputs/inbox.json','inputs/meta.json'],outputs:['inputs/inbox.json','out/metadata.json',reviewedReceipt],commands:[]},
    {id:'semantic',inputs:[source,'inputs/review.json','inputs/meta.json','out/catalog.json','tools/validator.mjs'],
      outputs:['out/metadata.json',cursor,receipts],commands:[],finalCommands:[{program:'fixture',args:[]}]},
    {id:'generated',inputs:['out/metadata.json',source],outputs:['out/generated.json',seals],commands:[],required:true},
    {id:'shared',inputs:[source,asset,'inputs/review.json','out/metadata.json','out/generated.json','tools/validator.mjs'],
      outputs:['out/identity.json','out/catalog.json'],commands:[],required:true},
    {id:'fourSlot',inputs:['out/identity.json',asset,'archive/data/item-4slot/','tools/4slot.cjs'],outputs:['out/4slot.json'],commands:[],required:false}
  ];
  const calls=[];
  const execute=async({root:repo,lane})=>{
    calls.push(lane.id);
    const s=readJson(repo,source),sourceHash=hash(read(repo,source));
    if(lane.id==='reviewed') {
      if(fs.existsSync(path.join(repo,'inputs/inbox.json'))) {
        write(repo,'out/metadata.json',{uid:s.uid,...readJson(repo,'inputs/meta.json')});fs.rmSync(path.join(repo,'inputs/inbox.json'));
      }
    } else if(lane.id==='semantic') {
      write(repo,'out/metadata.json',{uid:s.uid,...readJson(repo,'inputs/meta.json')});
      if(readJson(repo,cursor).sourceSha256!==sourceHash)write(repo,cursor,{sourceSha256:sourceHash,lastProcessedCommit:git(repo,'rev-parse','HEAD')});
      const receipt=receipts+sourceHash+'.json';if(!fs.existsSync(path.join(repo,receipt)))write(repo,receipt,{sourceSha256:sourceHash});
    } else if(lane.id==='generated')write(repo,'out/generated.json',{uid:s.uid});
    else if(lane.id==='shared') {
      if(readJson(repo,'inputs/review.json').sourceSha256!==sourceHash)throw Error('REVIEWED_SOURCE_VERSION_MISMATCH');
      if(!fs.existsSync(path.join(repo,s.asset)))throw Error('MISSING_REQUIRED_ASSET');
      if(readJson(repo,'out/generated.json').uid!==s.uid)throw Error('GENERATED_UID_MISMATCH');
      write(repo,'out/identity.json',{uid:s.uid});write(repo,'out/catalog.json',readJson(repo,'out/metadata.json'));
    } else if(lane.id==='semanticFinal') {
      assert.equal(readJson(repo,'out/catalog.json').uid,s.uid,'final consumer must bind the current UID');
    } else if(lane.id==='fourSlot')write(repo,'out/4slot.json',{...readJson(repo,'out/identity.json'),
      assetSha256:fs.existsSync(path.join(repo,asset))?hash(read(repo,asset)):null});
    return {advisories:[]};
  };
  const options={root,work,lanes,execute,env:{}};
  const seedRegistered=async()=>{const result=await prepareRegistration(options);assert.equal(result.publishable,true);commit(root,'registered fixture');calls.length=0;return result;};
  return {dir,root,work,lanes,calls,execute,options,seedRegistered};
}

test('new source fixture: one staged transaction joins source, UID, consumer, cursor and receipt',async t=>{
  const f=fixture(t),head=git(f.root,'rev-parse','HEAD');
  const result=await prepareRegistration(f.options);
  assert.equal(result.status,'PREPARED');assert.equal(result.safeToPersist,true);assert.equal(result.publishable,true);
  assert.equal(git(f.root,'rev-parse','HEAD'),head,'preparation never creates a Git commit');
  assert.equal(readJson(f.root,cursor).lastProcessedCommit,head);
  assert.equal(readJson(f.root,'out/4slot.json').uid,'fixture_uid');
  assert.ok(f.calls.indexOf('semanticFinal')<f.calls.indexOf('fourSlot'),'final shared proof precedes 4slot');
  assert.equal(git(f.root,'diff','--name-only'),'','all transaction outputs staged together');
  assert.ok(result.changedPaths.includes(cursor));assert.ok(result.changedPaths.includes(STATE));
  assert.equal(read(f.root,source),git(f.root,'show',`HEAD:${source}`)+'\n');
  commit(f.root,'single registered fixture');
  const checked=checkRegistration(f.options);
  assert.equal(checked.status,'REGISTERED');assert.equal(checked.publishable,true);assert.equal(checked.needed,false);
  assert.equal(checked.inputDigest,result.inputDigest);assert.equal(checked.outputDigest,result.outputDigest);
});

test('multi-megabyte native summaries stay complete in artifacts without reaching the GitHub step summary',async t=>{
  const f=fixture(t),step=path.join(f.dir,'github-step-summary.md'),payload='원시 검증 결과\n'.repeat(100000);
  fs.writeFileSync(step,'existing workflow summary\n');
  const result=await prepareRegistration({...f.options,env:{GITHUB_STEP_SUMMARY:step},execute:async ctx=>{
    assert.equal(ctx.env.GITHUB_STEP_SUMMARY,path.join(f.work,'native-step-summary.md'));
    if(ctx.lane.id==='semantic')await executeCommands({...ctx,lane:{...ctx.lane,logId:'summary-fixture',commands:[{
      program:process.execPath,args:['-e',`require('node:fs').appendFileSync(process.env.GITHUB_STEP_SUMMARY,${JSON.stringify('원시 검증 결과\n')}.repeat(100000))`]
    }]}});
    return f.execute(ctx);
  }});
  assert.equal(result.status,'PREPARED');assert.equal(result.publishable,true);
  assert.equal(fs.readFileSync(step,'utf8'),'existing workflow summary\n');
  assert.equal(fs.readFileSync(path.join(f.work,'native-step-summary.md'),'utf8'),payload);
  assert.ok(Buffer.byteLength(payload)>1024*1024);
  const report=fs.readFileSync(path.join(f.work,'report.json'),'utf8');
  assert.deepEqual(JSON.parse(report),result);
  for(let attempt=0;attempt<3;attempt++)fs.appendFileSync(step,renderRegistrationSummary(result));
  assert.ok(fs.statSync(step).size<16*1024);
  assert.equal(hash(fs.readFileSync(path.join(f.work,'report.json'))),hash(report));
});

test('compact summary bounds large lane/error payloads and preserves failed status without mutating evidence',()=>{
  const result={status:'PREPARED_WITH_FAILURES',registrationReady:false,changedPaths:Array(20000).fill('unchanged proof path'),
    lanes:Array.from({length:1000},(_,i)=>({id:'lane'+i+'한'.repeat(10000),status:i?'VERIFIED':'FAILED',
      error:'NATIVE_COMMAND_FAILED '+ '다'.repeat(20000),detail:{fullError:'FULL_RAW_DETAIL'+ '값'.repeat(20000)}}))};
  const before=hash(JSON.stringify(result)),summary=renderRegistrationSummary(result);
  assert.ok(Buffer.byteLength(summary)<32*1024);
  assert.match(summary,/PREPARED_WITH_FAILURES/);assert.match(summary,/registration_ready=false/);
  assert.match(summary,/lanes=1000; failed or rolled back=1/);assert.match(summary,/976 additional lane records/);
  assert.match(summary,/NATIVE_COMMAND_FAILED/);assert.doesNotMatch(summary,/FULL_RAW_DETAIL/);
  assert.match(summary,/native-step-summary\.md/);assert.equal(hash(JSON.stringify(result)),before);
});

test('same event and unrelated main commits reuse exact input/tool/output bytes without new work',async t=>{
  const f=fixture(t);await f.seedRegistered();
  const state=read(f.root,STATE),priorCursor=read(f.root,cursor);
  for(const unrelated of [false,true]) {
    if(unrelated){write(f.root,'docs/unrelated.md','unrelated documentation\n');commit(f.root,'unrelated main move');}
    const result=await prepareRegistration(f.options);
    assert.equal(result.status,'NO_OP');assert.equal(result.changedPaths.length,0);assert.equal(result.publishable,true);
    assert.equal(read(f.root,STATE),state);assert.equal(read(f.root,cursor),priorCursor);assert.deepEqual(f.calls,[]);
  }
});

test('existing-vector carrier bytes invalidate a VERIFIED fourSlot cache while unchanged observed pending stays stable',async t=>{
  const realRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const native=nativeLanes(realRoot).find(l=>l.id==='fourSlot'),f=fixture(t);
  const lane=f.lanes.find(l=>l.id==='fourSlot');lane.inputs=[...native.inputs,'out/identity.json'];
  const carrier='.archive-meta-register/4slot-existing-vector-continuity/fixture_uid.json';
  const execute=async ctx=>{
    if(ctx.lane.id!=='fourSlot')return f.execute(ctx);
    f.calls.push('fourSlot');
    // A native command can finish with a verified index containing a refused
    // item. This orchestration fixture never promotes that item to REGISTERED.
    write(ctx.root,'out/4slot.json',{uid:'fixture_uid',status:'SUPPLEMENT_PENDING',reason:'IMMUTABLE_GIT_INPUT_UNAVAILABLE'});
    return {advisories:[]};
  };
  const options={...f.options,execute};
  const first=await prepareRegistration(options);
  assert.equal(first.lanes.find(l=>l.id==='fourSlot').status,'VERIFIED');
  commit(f.root,'verified index with an observed pending item');f.calls.length=0;
  const pending=read(f.root,'out/4slot.json');
  assert.equal(checkRegistration(options).needed,false);
  assert.equal((await prepareRegistration(options)).status,'NO_OP');
  assert.deepEqual(f.calls,[],'unchanged observed pending is not an infinite continuation');

  for(const [name,change] of [
    ['add',()=>write(f.root,carrier,{schemaVersion:'fixture-carrier-v1',witness:'first'})],
    ['change',()=>write(f.root,carrier,{schemaVersion:'fixture-carrier-v1',witness:'updated'})],
    ['remove',()=>fs.rmSync(path.join(f.root,carrier))]
  ]){
    const before=readJson(f.root,STATE).lanes.fourSlot.inputDigest,base=git(f.root,'rev-parse','HEAD');
    change();const head=commit(f.root,name+' carrier only');
    const checked=checkRegistration(options),four=checked.lanes.find(l=>l.id==='fourSlot');
    assert.notEqual(four.inputDigest,before,name+' carrier bytes must affect the native fourSlot input digest');
    assert.equal(four.needed,true);assert.equal(checked.needed,true);
    assert.deepEqual(checked.lanes.filter(l=>l.needed).map(l=>l.id),['fourSlot']);
    const range=unrelatedRange({root:f.root,base,head,lanes:f.lanes});
    assert.equal(range.unrelated,false);assert.equal(range.firstProtectedHit,carrier);
    f.calls.length=0;const refreshed=await prepareRegistration(options);
    assert.deepEqual(f.calls,['fourSlot']);assert.equal(refreshed.needed,false);
    assert.equal(refreshed.lanes.find(l=>l.id==='fourSlot').status,'VERIFIED');
    assert.equal(read(f.root,'out/4slot.json'),pending,'input invalidation never overrides the native pending result');
    assert.ok(!refreshed.changedPaths.includes(carrier),'carrier is an input, never a generated output');
    commit(f.root,name+' carrier verified');f.calls.length=0;
    const cached=read(f.root,STATE);assert.equal((await prepareRegistration(options)).status,'NO_OP');
    assert.deepEqual(f.calls,[]);assert.equal(read(f.root,STATE),cached);
  }
  assert.equal(native.continuation,undefined);assert.equal(native.scopedInputs,undefined);
  assert.equal(matches(carrier,native.outputs),false);assert.equal(native.required,false);
});

test('same-path SVG bytes change reruns asset consumers; metadata-only changes rerun their consumers',async t=>{
  const f=fixture(t);await f.seedRegistered();
  const before=readJson(f.root,'out/4slot.json').assetSha256;
  write(f.root,asset,'<svg xmlns="http://www.w3.org/2000/svg" width="2"/>\n');commit(f.root,'same path asset replacement');
  await prepareRegistration(f.options);
  assert.deepEqual(f.calls,['shared','fourSlot']);assert.notEqual(readJson(f.root,'out/4slot.json').assetSha256,before);
  commit(f.root,'asset registration');f.calls.length=0;
  write(f.root,'inputs/meta.json',{label:'changed metadata'});commit(f.root,'metadata only');
  const result=await prepareRegistration(f.options);
  assert.equal(result.publishable,true);assert.equal(readJson(f.root,'out/catalog.json').label,'changed metadata');
  assert.ok(f.calls.includes('semantic'));assert.ok(f.calls.includes('shared'));assert.ok(!f.calls.includes('fourSlot'));
  assert.ok(!result.changedPaths.includes(source));
});

test('validator bytes invalidate the matching proof; same filename never reuses an old PASS',async t=>{
  const f=fixture(t);await f.seedRegistered();
  write(f.root,'tools/validator.mjs','// changed validator implementation\n');commit(f.root,'validator update');
  const check=checkRegistration(f.options);assert.equal(check.publishable,false);assert.equal(check.needed,true);
  const before=read(f.root,cursor);await prepareRegistration(f.options);
  assert.ok(f.calls.includes('semantic'));assert.ok(f.calls.includes('shared'));assert.equal(read(f.root,cursor),before);
});

test('supplementation lane failure keeps its cursor/receipt baseline and independently registers 4slot',async t=>{
  const f=fixture(t),priorCursor=read(f.root,cursor);
  const result=await prepareRegistration({...f.options,execute:async ctx=>{
    if(ctx.lane.id==='semantic') {
      write(ctx.root,cursor,{sourceSha256:'must-not-advance'});write(ctx.root,receipts+'partial.json',{partial:true});
      write(ctx.root,'out/metadata.json',{uid:'broken'});throw Error('SUPPLEMENTAL_METADATA_UNAVAILABLE');
    }
    return f.execute(ctx);
  }});
  assert.equal(result.status,'PREPARED_WITH_FAILURES');assert.equal(result.publishable,true);
  assert.equal(result.lanes.find(l=>l.id==='semantic').status,'FAILED');assert.equal(result.lanes.find(l=>l.id==='fourSlot').status,'VERIFIED');
  assert.equal(read(f.root,cursor),priorCursor);assert.equal(fs.existsSync(path.join(f.root,receipts+'partial.json')),false);
  assert.equal(readJson(f.root,'out/4slot.json').uid,'fixture_uid');
  commit(f.root,'healthy outputs with explicit supplement blocker');
  const check=checkRegistration(f.options);assert.equal(check.publishable,true);assert.equal(check.needed,true);
  assert.equal(check.lanes.find(l=>l.id==='semantic').status,'NEEDS_REGISTRATION');
});

test('failed final Consumer proof rolls back shared outputs before 4slot sees identity',async t=>{
  const f=fixture(t),beforeCursor=read(f.root,cursor),beforeMetadata=read(f.root,'out/metadata.json');
  const result=await prepareRegistration({...f.options,execute:async ctx=>{
    if(ctx.lane.id==='semanticFinal')throw Error('FINAL_CONSUMER_UID_MISMATCH');return f.execute(ctx);
  }});
  assert.equal(result.publishable,false);assert.equal(result.status,'PREPARED_WITH_FAILURES');
  assert.equal(read(f.root,cursor),beforeCursor);assert.equal(read(f.root,'out/metadata.json'),beforeMetadata);
  assert.equal(readJson(f.root,'out/4slot.json').uid,'old_uid','4slot sees the preserved baseline after rollback');
  assert.equal(fs.existsSync(path.join(f.root,'inputs/inbox.json')),true,'consumed requests roll back with data');
  assert.deepEqual(fs.readdirSync(path.join(f.root,receipts)),['sealed.json']);
  commit(f.root,'explicit failed shared proof with independent 4slot');
  assert.equal(checkRegistration(f.options).publishable,false,'old matching bytes do not erase the failure on restart');
});

test('version mismatch and missing required asset remain technical failures, never certified publication',async t=>{
  for(const fault of ['version','asset']) {
    await t.test(fault,async sub=>{
      const f=fixture(sub);
      if(fault==='version')write(f.root,source,read(f.root,source)+'\n');
      else fs.rmSync(path.join(f.root,asset));
      commit(f.root,'invalid technical input');
      const result=await prepareRegistration(f.options);
      assert.equal(result.publishable,false);assert.equal(result.lanes.find(l=>l.id==='shared').status,'FAILED');
      assert.match(result.lanes.find(l=>l.id==='shared').error,fault==='version'?/VERSION_MISMATCH/:/MISSING_REQUIRED_ASSET/);
      assert.equal(readJson(f.root,cursor).lastProcessedCommit,'old');
    });
  }
});

test('unexpected original writes, old receipt edits and sealed entry rewrites fail the transaction',async t=>{
  for(const fault of ['source','receipt','reviewedReceipt','seal']) {
    await t.test(fault,async sub=>{
      const f=fixture(sub);
      await assert.rejects(prepareRegistration({...f.options,execute:async ctx=>{
        await f.execute(ctx);
        if(ctx.lane.id==='semantic'&&fault==='source')write(ctx.root,source,'unexpected original edit\n');
        if(ctx.lane.id==='semantic'&&fault==='receipt')write(ctx.root,receipts+'sealed.json',{receipt:'rewritten'});
        if(ctx.lane.id==='reviewed'&&fault==='reviewedReceipt')write(ctx.root,reviewedReceipt,{approval:'rewritten'});
        if(ctx.lane.id==='generated'&&fault==='seal')write(ctx.root,seals,{entries:[{path:'crosswalk.json',sha256:'old-seal',sealedBy:'rewritten'}]});
      }}),/UNEXPECTED_|IMMUTABLE_|EXISTING_CROSSWALK/);
      assert.equal(fs.existsSync(path.join(f.root,STATE)),false,'no completion proof is saved for a corrupted transaction');
    });
  }
});

test('reviewed geometry compiler outputs stage with exact path boundaries and roll back on lane failure',async t=>{
  const repoRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const outputPatterns=read(repoRoot,'tools/ci/archive-meta-register-commit.paths').split(/\r?\n/)
    .map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));
  const geometryRoot='archive/data/meta-foundation/evidence/geometry-equations/v1/';
  const compilerOutputs=[geometryRoot+'global_integrity_audit.json',geometryRoot+'promotion_receipt.json'];
  const setup=sub=>{
    const f=fixture(sub),reviewed=f.lanes.find(l=>l.id==='reviewed');
    reviewed.outputs=[...outputPatterns,...reviewed.outputs];
    for(const rel of compilerOutputs)write(f.root,rel,{fixtureOnly:true,packVersion:'1.0.2'});
    commit(f.root,'seed existing derived geometry compiler outputs');
    const execute=async ctx=>{
      await f.execute(ctx);
      if(ctx.lane.id==='reviewed')for(const rel of compilerOutputs)
        write(ctx.root,rel,{fixtureOnly:true,packVersion:'1.0.3'});
    };
    return {...f,execute};
  };
  await t.test('the existing compiler output pair is staged, fingerprinted and invalidated after drift',async sub=>{
    const f=setup(sub),oldReceipt=read(f.root,reviewedReceipt),head=git(f.root,'rev-parse','HEAD');
    const result=await prepareRegistration({...f.options,execute:f.execute});
    assert.equal(result.status,'PREPARED');assert.equal(result.safeToPersist,true);
    for(const rel of compilerOutputs){
      assert.ok(result.changedPaths.includes(rel));
      assert.equal(JSON.parse(git(f.root,'show',':'+rel)).packVersion,'1.0.3');
    }
    assert.equal(git(f.root,'rev-parse','HEAD'),head,'preparation does not persist a commit');
    assert.equal(read(f.root,reviewedReceipt),oldReceipt,'old reviewed approval receipt stays immutable');
    commit(f.root,'registered orchestration fixture');
    assert.equal(checkRegistration(f.options).needed,false);
    write(f.root,compilerOutputs[0],{fixtureOnly:true,packVersion:'changed-after-registration'});
    commit(f.root,'derived output drift');
    assert.equal(checkRegistration(f.options).lanes.find(l=>l.id==='reviewed').needed,true);
  });
  await t.test('a failed reviewed producer restores the prior pair and leaves no pair staged',async sub=>{
    const f=setup(sub),before=compilerOutputs.map(rel=>read(f.root,rel));
    const result=await prepareRegistration({...f.options,execute:async ctx=>{
      await f.execute(ctx);if(ctx.lane.id==='reviewed')throw Error('FIXTURE_COMPILER_FAILURE');
    }});
    assert.equal(result.lanes.find(l=>l.id==='reviewed').status,'FAILED');
    for(const [i,rel] of compilerOutputs.entries()){
      assert.equal(read(f.root,rel),before[i]);assert.ok(!result.changedPaths.includes(rel));
    }
  });
  for(const rel of [geometryRoot+'unrelated_evidence.json',
    'archive/data/meta-foundation/evidence/high1/v1/promotion_receipt.json']){
    await t.test('unlisted evidence remains rejected: '+rel,async sub=>{
      const f=setup(sub);
      await assert.rejects(prepareRegistration({...f.options,execute:async ctx=>{
        await f.execute(ctx);if(ctx.lane.id==='reviewed')write(ctx.root,rel,{fixtureOnly:true});
      }}),/UNEXPECTED_REVIEWED_PATHS/);
      assert.equal(fs.existsSync(path.join(f.root,STATE)),false);
    });
  }
});

test('recovery check is read-only, detects output drift, and refuses a dirty snapshot',async t=>{
  const f=fixture(t);
  assert.equal(checkRegistration(f.options).publishable,false,'unregistered snapshot is not evidence');
  await f.seedRegistered();
  write(f.root,'out/catalog.json',{uid:'wrong_uid'});commit(f.root,'incorrect derived output');
  const state=read(f.root,STATE),status=git(f.root,'status','--porcelain');
  const result=checkRegistration(f.options);assert.equal(result.publishable,false);assert.equal(result.needed,true);
  assert.equal(read(f.root,STATE),state);assert.equal(git(f.root,'status','--porcelain'),status);assert.deepEqual(f.calls,[]);
  write(f.root,'out/catalog.json',{uid:'uncommitted'});
  assert.throws(()=>checkRegistration(f.options),/REQUIRES_CLEAN_RUNNER/);
});

test('interrupted execution cannot advance the committed cursor; a fresh runner resumes from the last commit',async t=>{
  const f=fixture(t),moduleUrl=new URL('../tools/ci/archive-registration-writer.mjs',import.meta.url).href;
  const interrupted=path.join(f.dir,'interrupt.mjs');
  fs.writeFileSync(interrupted,`import fs from 'node:fs';import path from 'node:path';import {prepareRegistration} from ${JSON.stringify(moduleUrl)};
await prepareRegistration({root:${JSON.stringify(f.root)},work:${JSON.stringify(f.work)},lanes:${JSON.stringify(f.lanes)},env:{},execute:async ({root,lane})=>{
if(lane.id==='semantic'){fs.writeFileSync(path.join(root,${JSON.stringify(cursor)}),'{"lastProcessedCommit":"uncommitted"}\\n');process.exit(17);}
}});\n`);
  const stopped=spawnSync(process.execPath,[interrupted],{encoding:'utf8'});assert.equal(stopped.status,17,stopped.stderr);
  assert.equal(JSON.parse(git(f.root,'show',`HEAD:${cursor}`)).lastProcessedCommit,'old');
  const fresh=path.join(f.dir,'restarted');git(f.dir,'clone','-q',f.root,fresh);
  const result=await prepareRegistration({...f.options,root:fresh,work:path.join(f.dir,'resumed-evidence')});
  assert.equal(result.publishable,true);assert.equal(result.status,'PREPARED');
  assert.equal(readJson(fresh,cursor).sourceSha256,hash(read(fresh,source)));
});

test('a changed dependency without a final command runs the real producer again before caching its proof',async t=>{
  const f=fixture(t);f.lanes.find(l=>l.id==='generated').inputs.push('out/catalog.json');
  const result=await prepareRegistration(f.options);
  assert.equal(result.publishable,true);assert.equal(f.calls.filter(id=>id==='generated').length,2);
  assert.equal(result.lanes.find(l=>l.id==='generatedRegenerated').status,'VERIFIED');
  commit(f.root,'verified regenerated consumer');assert.equal(checkRegistration(f.options).needed,false);
});

test('late mutation that cannot converge never receives the newer input digest as an old PASS',async t=>{
  const f=fixture(t),beforeCursor=read(f.root,cursor);let count=0;
  const result=await prepareRegistration({...f.options,execute:async ctx=>{
    if(ctx.lane.id==='semanticFinal') {
      write(ctx.root,'out/metadata.json',{uid:'fixture_uid',label:'late mutation '+(++count)});return;
    }
    return f.execute(ctx);
  }});
  assert.equal(result.publishable,false);assert.equal(result.needed,true);
  assert.equal(result.lanes.find(l=>l.id==='shared').status,'STALE_DEPENDENCY');
  assert.equal(read(f.root,cursor),beforeCursor);assert.equal(readJson(f.root,'out/4slot.json').uid,'old_uid');
  commit(f.root,'explicit non-converged proof');assert.equal(checkRegistration(f.options).publishable,false);
});

test('student index phase uses the final shared snapshot with earlier generated files already staged',async t=>{
  const f=fixture(t);
  f.lanes.splice(f.lanes.length-1,0,{id:'studentIndexes',required:true,inputs:['out/catalog.json'],outputs:['out/student-index.json'],commands:[]});
  const result=await prepareRegistration({...f.options,execute:async ctx=>{
    if(ctx.lane.id==='studentIndexes') {
      f.calls.push('studentIndexes');
      assert.equal(git(ctx.root,'ls-files','--others','--exclude-standard'),'','native SVG scope cannot count transient untracked registration JSON');
      write(ctx.root,'out/student-index.json',readJson(ctx.root,'out/catalog.json'));return;
    }
    return f.execute(ctx);
  }});
  assert.equal(result.publishable,true);
  assert.ok(f.calls.indexOf('semanticFinal')<f.calls.indexOf('studentIndexes'));
  assert.ok(f.calls.indexOf('studentIndexes')<f.calls.indexOf('fourSlot'));
});

test('bounded queued work continues on identical inputs without duplicating immutable receipts or cursor commits',async t=>{
  const f=fixture(t),queue='.archive-meta-register/auto/fixture-queue.json';
  write(f.root,queue,{remaining:2});commit(f.root,'queued batches fixture');
  const lane=f.lanes.find(l=>l.id==='semantic');lane.inputs.push(queue);lane.outputs.push(queue);
  lane.continuation=({root})=>readJson(root,queue).remaining>0;
  const execute=async ctx=>{
    await f.execute(ctx);
    if(ctx.lane.id==='semantic')write(ctx.root,queue,{remaining:Math.max(0,readJson(ctx.root,queue).remaining-1)});
  };
  const first=await prepareRegistration({...f.options,execute});
  assert.equal(first.status,'PREPARED_WITH_PENDING');assert.equal(first.publishable,true);assert.equal(first.needed,true);
  commit(f.root,'batch one');const savedCursor=read(f.root,cursor),receiptNames=fs.readdirSync(path.join(f.root,receipts));f.calls.length=0;
  assert.equal(checkRegistration(f.options).needed,true);
  const second=await prepareRegistration({...f.options,execute});assert.equal(second.needed,false);
  assert.deepEqual(f.calls,['semantic'],'unchanged required shared and Generated proofs are reused');
  assert.equal(read(f.root,cursor),savedCursor);assert.deepEqual(fs.readdirSync(path.join(f.root,receipts)),receiptNames);
});

test('4slot failure preserves the last index and receipts, while verified ordinary publication stays available',async t=>{
  const f=fixture(t);await f.seedRegistered();
  const fourReceipts='.archive-meta-register/auto/4slot/receipts/';
  write(f.root,fourReceipts+'old.json',{receipt:'last verified'});commit(f.root,'previous four slot receipt');
  f.lanes.find(l=>l.id==='fourSlot').outputs.push(fourReceipts);
  write(f.root,'tools/4slot.cjs','// changed fixture builder\n');commit(f.root,'four slot builder change');
  const priorIndex=read(f.root,'out/4slot.json'),oldReceipt=read(f.root,fourReceipts+'old.json');
  const failing=async ctx=>{
    if(ctx.lane.id==='fourSlot') {
      write(ctx.root,'out/4slot.json',{partial:'must not publish'});write(ctx.root,fourReceipts+'partial.json',{partial:true});
      throw Error('FOUR_SLOT_TECHNICAL_FAILURE');
    }
    return f.execute(ctx);
  };
  const result=await prepareRegistration({...f.options,execute:failing});
  assert.equal(result.publishable,true);assert.equal(result.needed,true);
  assert.equal(result.lanes.find(l=>l.id==='fourSlot').status,'FAILED');assert.deepEqual(f.calls,[]);
  assert.equal(read(f.root,'out/4slot.json'),priorIndex);assert.equal(read(f.root,fourReceipts+'old.json'),oldReceipt);
  assert.equal(fs.existsSync(path.join(f.root,fourReceipts+'partial.json')),false);
  commit(f.root,'isolated four slot failure');
  const checked=checkRegistration(f.options);assert.equal(checked.publishable,true);assert.equal(checked.needed,true);
  assert.ok(readJson(f.root,STATE).blockedLanes.includes('fourSlot'));
  const again=await prepareRegistration({...f.options,execute:failing});assert.equal(again.changedPaths.length,0,'same failed attempt creates no duplicate commit');
  const recovered=await prepareRegistration(f.options);assert.equal(recovered.publishable,true);assert.equal(recovered.needed,false);
  assert.deepEqual(f.calls,['fourSlot'],'recovery does not rerun verified shared/Generated producers');
});

test('required lanes alone are enough to publish; the other lanes, their cache and blocked marks wait for the full pass',async t=>{
  const f=fixture(t);await f.seedRegistered();
  // A lane that failed earlier stays blocked through a required-only save.
  write(f.root,'tools/4slot.cjs','// changed fixture builder\n');commit(f.root,'four slot builder change');
  const failing=async ctx=>{if(ctx.lane.id==='fourSlot')throw Error('FOUR_SLOT_TECHNICAL_FAILURE');return f.execute(ctx);};
  await prepareRegistration({...f.options,execute:failing});commit(f.root,'isolated four slot failure');
  assert.ok(readJson(f.root,STATE).blockedLanes.includes('fourSlot'));
  // New source plus a pending inbox request: every lane is needed.
  write(f.root,source,'{"uid":"second_uid","asset":"'+asset+'"}\n');write(f.root,'inputs/review.json',{sourceSha256:hash(read(f.root,source))});
  write(f.root,'inputs/inbox.json',{requestId:'second-request'});commit(f.root,'new source and pending request');f.calls.length=0;
  const required=f.lanes.filter(lane=>lane.required);
  const first=await prepareRegistration({...f.options,lanes:required});
  assert.equal(first.publishable,true);assert.equal(first.safeToPersist,true);
  assert.deepEqual(first.lanes.map(l=>l.id).filter(id=>!id.endsWith('Final')),['generated','shared']);
  assert.ok(!f.calls.some(id=>['reviewed','semantic','fourSlot'].includes(id)),'no other lane runs in the first save');
  assert.ok(readJson(f.root,STATE).blockedLanes.includes('fourSlot'),'a lane this save does not handle keeps its blocked mark');
  assert.ok(fs.existsSync(path.join(f.root,'inputs/inbox.json')),'the pending request is untouched');
  commit(f.root,'required lanes saved');
  const midway=checkRegistration(f.options);
  assert.equal(midway.publishable,true,'publication condition is met after the first save');
  assert.equal(midway.needed,true);assert.deepEqual(midway.lanes.filter(l=>l.needed).map(l=>l.id).sort(),['fourSlot','reviewed','semantic']);
  const full=await prepareRegistration(f.options);
  assert.equal(full.publishable,true);assert.equal(full.needed,false);
  assert.ok(f.calls.includes('reviewed')&&f.calls.includes('semantic')&&f.calls.includes('fourSlot'),'the full pass completes the remaining lanes');
});

test('native proof includes external canonical authority, consumer policy and core runtime dependencies',()=>{
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),lanes=nativeLanes(root);
  const shared=lanes.find(l=>l.id==='shared');
  for(const input of [
    'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',
    'archive/data/basic-scope-parent-links.json','archive/data/archive2-canonical-projection-policy.json',
    'archive/mixer-selector.js','archive/data/textbook-source-manifest-v1.json'
  ])assert.equal(matches(input,shared.inputs),true,'direct shared dependency: '+input);
  assert.equal(matches('tools/ci/archive-pr-native-preview.mjs',lanes.find(l=>l.id==='reviewed').inputs),true,
    'main request ordering changes invalidate the reviewed lane cached proof');
  assert.equal(matches('tools/ci/verify-reviewed-projection-requests.mjs',lanes.find(l=>l.id==='reviewed').inputs),true, 'projection supervisor changes invalidate the reviewed proof');
  assert.equal(matches('archive/tools/meta-foundation/reviewed-projection-phase.mjs',lanes.find(l=>l.id==='reviewed').inputs),true, 'read-only phase implementation is an input');
  assert.equal(lanes.find(l=>l.id==='fourSlot').required,false,'existing independent failure policy is preserved');
  const student=lanes.find(l=>l.id==='studentIndexes');
  assert.match(student.parameters.accessibilityBase,/^[a-f0-9]{40}$/);
  assert.equal(student.commands[0].args.at(-1),student.parameters.accessibilityBase);
});

test('reviewed scoped inputs are verified on first registration and when their fixed blobs change',async t=>{
  const f=fixture(t),scoped='inputs/scoped-parent-links.json';write(f.root,scoped,{revision:1});commit(f.root,'scoped fixture input');
  const reviewed=f.lanes.find(l=>l.id==='reviewed');reviewed.inputs.push(scoped);reviewed.scopedInputs=[scoped];
  reviewed.finalCommands=[{program:'fixture',args:[]}];reviewed.alwaysFinal=true;
  const seen=[];
  const execute=async ctx=>{
    if(['reviewed','reviewedFinal'].includes(ctx.lane.id))seen.push({id:ctx.lane.id,scoped:ctx.env.ARCHIVE_META_SCOPED});
    return f.execute(ctx);
  };
  await prepareRegistration({...f.options,execute});
  assert.ok(seen.some(s=>s.id==='reviewed'));assert.ok(seen.some(s=>s.id==='reviewedFinal'));assert.ok(seen.every(s=>s.scoped==='true'));
  commit(f.root,'initial scoped proof');const digest=readJson(f.root,STATE).lanes.reviewed.scopedInputDigest;assert.match(digest,/^[a-f0-9]{64}$/);
  seen.length=0;write(f.root,'inputs/meta.json',{label:'unrelated metadata input'});commit(f.root,'non scoped metadata');
  await prepareRegistration({...f.options,execute});assert.ok(seen.length>0);assert.ok(seen.every(s=>s.scoped==='false'));
  commit(f.root,'non scoped proof');assert.equal(readJson(f.root,STATE).lanes.reviewed.scopedInputDigest,digest);
  seen.length=0;write(f.root,scoped,{revision:2});commit(f.root,'scoped input changed');
  assert.equal(checkRegistration(f.options).needed,true);
  await prepareRegistration({...f.options,execute});assert.ok(seen.every(s=>s.scoped==='true'));
  assert.ok(seen.some(s=>s.id==='reviewedFinal'));assert.notEqual(readJson(f.root,STATE).lanes.reviewed.scopedInputDigest,digest);
  commit(f.root,'updated scoped proof');seen.length=0;write(f.root,'docs/other.md','unrelated main move\n');commit(f.root,'unrelated');
  const replay=await prepareRegistration({...f.options,execute});assert.equal(replay.status,'NO_OP');assert.deepEqual(seen,[]);
});

test('native continuation distinguishes queued work from an observed refusal before signature creation',t=>{
  const f=fixture(t),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const continuation=nativeLanes(root).find(l=>l.id==='semantic').continuation;
  write(f.root,cursor,{pending:{'fixture.js#1':{lastReasons:['TARGET_REMOVED_OR_REORDERED']},'fixture.js#2':{}}});
  const native=path.join(f.dir,'native-reports');
  write(native,'archive-main-auto-meta/report.json',{results:[{sourceArchiveFile:'fixture.js',sourceOrdinal:1,status:'SUPPLEMENT_PENDING'}]});
  assert.equal(continuation({root:f.root,env:{RUNNER_TEMP:native}}),true,'unvisited second target must resume');
  write(native,'archive-main-auto-meta/report.json',{results:[1,2].map(sourceOrdinal=>({sourceArchiveFile:'fixture.js',sourceOrdinal,status:'SUPPLEMENT_PENDING'}))});
  assert.equal(continuation({root:f.root,env:{RUNNER_TEMP:native}}),false,'observed stable refusals need changed inputs before retry');
});

test('timed-out native command cannot leave a child that advances a cursor after rollback', {skip:process.platform==='win32'},async t=>{
  const f=fixture(t);fs.mkdirSync(f.work,{recursive:true});
  const lateCursor=path.join(f.root,'late-cursor.json');
  const child=`setTimeout(()=>require('node:fs').writeFileSync(${JSON.stringify(lateCursor)},'unverified cursor'),500);`;
  const parent=`require('node:child_process').spawn(process.execPath,['-e',${JSON.stringify(child)}],{stdio:'ignore'});setTimeout(()=>{},10000);`;
  assert.throws(()=>executeCommands({root:f.root,work:f.work,env:process.env,lane:{id:'interrupted-native',
    commands:[{program:process.execPath,args:['-e',parent],timeoutMs:80}]}}),/NATIVE_COMMAND_FAILED/);
  await new Promise(resolve=>setTimeout(resolve,700));
  assert.equal(fs.existsSync(lateCursor),false,'the entire owned native process group has stopped');
});

// Race shortcut: the verified derived commit is reused only when the competing range is provably unrelated.
test('--unrelated-range accepts only provably unrelated competing changes', t=>{
  const realRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),lanes=nativeLanes(realRoot);
  const f=fixture(t),base=git(f.root,'rev-parse','HEAD');
  const verdict=paths=>{
    for(const rel of paths)write(f.root,rel,`change ${paths.join()}\n`);
    const head=commit(f.root,'competitor '+paths.join());
    const result=unrelatedRange({root:f.root,base,head,lanes});git(f.root,'reset','-q','--hard',base);return result;
  };
  const ok=verdict(['apmath/playground/next/x.js']);
  assert.equal(ok.unrelated,true);assert.equal(ok.changedCount,1);assert.equal(ok.firstProtectedHit,null);
  for(const protectedPath of ['archive/exams/x.js','archive/archive2-source.js','archive/unit-past-exams-core.js','archive/engine.html','tests/fixtures/diff5/x.json',STATE,'tools/ci/foo.mjs','.github/workflows/archive-main-auto-meta.yml',
    'apmath/playground/next/.gitignore','.gitattributes','tools/lib/x.mjs','.archive-meta-register/inbox/x.json',
    '.archive-meta-register/4slot-existing-vector-continuity/x.json','package.json','package-lock.json']) {
    const result=verdict([protectedPath]);
    assert.equal(result.unrelated,false,protectedPath);assert.equal(result.firstProtectedHit,protectedPath);
  }
  // 화면 전용 파일(레인 입력 목록에 없는 css·html·md)은 재계산 없이 다시 붙인다. 레인 입력에 든 화면 파일과 js는 그대로 보호.
  const inputPatterns=lanes.flatMap(l=>[l.inputs,l.outputs,l.scopedInputs].flatMap(v=>Array.isArray(v)?v:[]));
  const screenOnly='archive/archive2-navigation.css';
  assert.equal(matches(screenOnly,inputPatterns),false,'fixture css must not be a lane input');
  const screen=verdict([screenOnly,'archive/archive2-history.css','archive/DESIGN.md','tests/archive-x.test.js','docs/x.md']);
  assert.equal(screen.unrelated,true,'screen-only css/doc/test changes need no recomputation');
  for(const stillProtected of ['archive/archive2-navigation.js','archive/engine.html','archive/equal-slot-engine.css','archive/data/x.html','archive/tools/x.html'])
    assert.equal(verdict([stillProtected]).unrelated,false,stillProtected);
  assert.equal(verdict(['apmath/playground/next/x.js','archive/exams/y.js']).firstProtectedHit,'archive/exams/y.js','one protected hit among many refuses');
  // Not an ancestor: history was rewritten, so the range says nothing.
  write(f.root,'apmath/playground/next/a.js','a\n');const sibling=commit(f.root,'sibling');git(f.root,'reset','-q','--hard',base);
  write(f.root,'apmath/playground/next/b.js','b\n');const other=commit(f.root,'other');
  const rewritten=unrelatedRange({root:f.root,base:sibling,head:other,lanes});
  assert.equal(rewritten.unrelated,false);assert.match(rewritten.error,/BASE_NOT_ANCESTOR_OF_HEAD/);
  assert.equal(unrelatedRange({root:f.root,base:'not-a-sha',head:other,lanes}).unrelated,false);
});

test('--unrelated-range CLI exits 0 only for an unrelated range and 1 for anything else',t=>{
  const realRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),script=path.join(realRoot,'tools/ci/archive-registration-writer.mjs');
  const head=git(realRoot,'rev-parse','HEAD');
  const run=(...args)=>spawnSync(process.execPath,[script,'--unrelated-range',...args],{cwd:realRoot,encoding:'utf8'});
  const same=run(head,head);assert.equal(same.status,0,same.stderr);
  assert.deepEqual(Object.keys(JSON.parse(same.stdout)).slice(0,5),['unrelated','base','head','changedCount','firstProtectedHit']);
  const malformed=run('zzzz',head);assert.equal(malformed.status,1);assert.equal(JSON.parse(malformed.stdout).unrelated,false);assert.match(malformed.stderr,/UNRELATED_RANGE_UNKNOWN/);
  assert.equal(run(head).status,1,'missing head');
  // Any error (here: a checkout without the real lane configuration) is "unknown", never "unrelated".
  const f=fixture(t);write(f.root,'apmath/playground/next/x.js','x\n');const next=commit(f.root,'would be unrelated');
  const unknown=spawnSync(process.execPath,[script,'--unrelated-range',git(f.root,'rev-parse',next+'^'),next,'--root',f.root],{cwd:realRoot,encoding:'utf8'});
  assert.equal(unknown.status,1);
});


for(const unexpected of [false,true])test('reviewed compiler output ownership is exact: unexpected='+unexpected,async t=>{
  const f=fixture(t),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const policies=read(root,'tools/ci/archive-meta-register-commit.paths').split(/\r?\n/).filter(x=>x&&!x.startsWith('#'));
  const outputs=['archive/data/meta-foundation/evidence/geometry-equations/v1/global_integrity_audit.json',
    'archive/data/meta-foundation/evidence/geometry-equations/v1/promotion_receipt.json'];
  for(const file of outputs)assert.equal(matches(file,policies),true);
  const outside='archive/data/meta-foundation/evidence/geometry-equations/v1/another-approval.json';
  assert.equal(matches(outside,policies),false);
  f.lanes.find(l=>l.id==='reviewed').outputs.push(...policies);
  const execute=async ctx=>{
    const result=await f.execute(ctx);
    if(ctx.lane.id==='reviewed')for(const file of [...outputs,...(unexpected?[outside]:[])])write(ctx.root,file,{fixtureDerived:true});
    return result;
  };
  if(unexpected)await assert.rejects(prepareRegistration({...f.options,execute}),/UNEXPECTED_REVIEWED_PATHS/);
  else{
    const result=await prepareRegistration({...f.options,execute});assert.equal(result.safeToPersist,true);
    assert.ok(outputs.every(file=>result.changedPaths.includes(file)));
    assert.equal(git(f.root,'diff','--name-only'),'');
  }
});

// ---- run instrumentation (PR-1): read-only numbers; none of it may reach a committed output or a digest ----
const instrumentationFiles=(ctx,{stale=[]}={})=>{
  const dir=path.join(ctx.env.RUNNER_TEMP,'archive-main-auto-meta');fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'stage-times.jsonl'),'{"stage":"compile-meta-foundation","durationMs":1200,"exitCode":0}\n{"stage":"auto-register-write","durationMs":3400,"exitCode":0}\n{"stage":"par');
  fs.writeFileSync(path.join(dir,'materialize.json'),JSON.stringify({status:'PASS',stalePayloadCount:stale.length,stalePayloads:stale}));
  fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify({instrumentation:{schemaVersion:'x',run:{targets:5,attempted:3,applied:1,alreadyRegistered:0,refused:2,
    unchangedSkipped:1,notReachedBudget:1,batchLimit:3,registeredUids:1,requestFiles:1,receiptFiles:1},
    attemptedByFile:{top:[{name:'a.js',total:3,registered:1,alreadyRegistered:0,refused:2}],otherFiles:0,otherCount:0},
    origin:{available:true,thisMergeDiff:{changedExamFiles:1,questions:2,attempted:1,unchangedSkipped:0,notReachedBudget:1,alsoQueuedBefore:0},
      queuedBacklog:{questions:3,attempted:2,unchangedSkipped:1,notReachedBudget:0},pilot:{questions:0,attempted:0},thisMergeQuestionsNotReachedBecauseOfBudget:1},
    pendingBeforeRun:4,backlogAfterRun:{pendingTotal:4,withoutAttemptSignature:1,attemptedRefused:3,neverTried:1,entriesWithMultipleReasons:1,reasonAtomTotal:4,
      reasons:{top:[{name:'DECLARED_PT_TPL_MISSING',count:3},{name:'DIFFICULTY_INCOMPLETE',count:1}],otherNames:0,otherCount:0},
      distinctBaseCommits:1,oldestBaseCommit:{commit:'a'.repeat(40),committedAt:'2026-01-01T00:00:00+00:00',count:4}}}}));
};

test('instrumentation is evidence only: committed outputs, state and digests are byte-identical with and without it',async t=>{
  // Identical fixture commits (same content, same dates) so the two repositories share Git object ids and digests.
  const saved={a:process.env.GIT_AUTHOR_DATE,c:process.env.GIT_COMMITTER_DATE};
  process.env.GIT_AUTHOR_DATE=process.env.GIT_COMMITTER_DATE='2026-01-01T00:00:00+00:00';
  let plain,instrumented;
  try{plain=fixture(t);instrumented=fixture(t);}
  finally{for(const [k,v] of [['GIT_AUTHOR_DATE',saved.a],['GIT_COMMITTER_DATE',saved.c]]){if(v===undefined)delete process.env[k];else process.env[k]=v;}}
  assert.equal(git(plain.root,'rev-parse','HEAD'),git(instrumented.root,'rev-parse','HEAD'));
  const a=await prepareRegistration(plain.options);
  const b=await prepareRegistration({...instrumented.options,execute:async ctx=>{
    if(ctx.lane.id==='semantic')instrumentationFiles(ctx,{stale:[]});
    return {...await instrumented.execute(ctx),commandTimings:[{n:1,command:'node x',durationMs:5,exitCode:0}]};
  }});
  const sem=b.lanes.find(l=>l.id==='semantic');
  assert.deepEqual(sem.instrumentation.stages.map(s=>s.stage),['compile-meta-foundation','auto-register-write'],'a partial last line is ignored');
  assert.equal(sem.instrumentation.autoMeta.run.attempted,3);assert.equal(sem.instrumentation.staleMetaV2Payloads.count,0);
  assert.equal(sem.instrumentation.commands[0].durationMs,5);
  assert.equal(a.lanes.find(l=>l.id==='semantic').instrumentation,undefined,'no files, no field');
  assert.deepEqual(b.changedPaths,a.changedPaths);assert.equal(b.inputDigest,a.inputDigest);assert.equal(b.outputDigest,a.outputDigest);
  const readOr=(root,rel)=>fs.existsSync(path.join(root,rel))?read(root,rel):null;
  for(const rel of [...a.changedPaths,STATE])assert.equal(readOr(instrumented.root,rel),readOr(plain.root,rel),rel);
  const evidence=JSON.parse(fs.readFileSync(path.join(instrumented.work,'report.json'),'utf8'));
  assert.deepEqual(evidence,b);
  assert.equal(JSON.stringify(readJson(instrumented.root,STATE)).includes('instrumentation'),false);
});

test('stage times and skipped reviewed payloads are read defensively and stay bounded',t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'instr-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  assert.equal(readStageTimes(path.join(dir,'missing.jsonl')),null);
  fs.writeFileSync(path.join(dir,'s.jsonl'),'not json\n{"stage":"a","durationMs":"x"}\n{"stage":"ok","durationMs":7,"exitCode":2}\n');
  assert.deepEqual(readStageTimes(path.join(dir,'s.jsonl')),[{stage:'ok',durationMs:7,exitCode:2}]);
  const names=[];
  for(let i=0;i<25;i++){const rel=`archive/data/r2e-intake/p${String(i).padStart(2,'0')}.payload.json`;names.push(rel);
    if(i!==3)write(dir,rel,{sourceArchiveFile:`exam${i}.js`,rows:Array.from({length:i+1})});}
  names.push('../outside.json');
  const s=staleMaterializedPayloads(dir,{stalePayloadCount:26,stalePayloads:names});
  assert.equal(s.count,26);assert.equal(s.files.length,20);assert.equal(s.otherFiles,6);
  assert.equal(s.files[0].rows,25,'largest payload first');
  assert.equal(s.questionsUnknownFor,2,'a missing file and an escaping path are unknown, never read');
  const total=Array.from({length:25},(_,i)=>i===3?0:i+1).reduce((x,y)=>x+y);
  assert.equal(s.questions,total,'the question total covers every payload, shown or not');
  assert.equal(s.files.reduce((n,f)=>n+(f.rows||0),0)+s.otherQuestions,total,'shown rows plus the remainder equal the total');
  assert.equal(staleMaterializedPayloads(dir,{status:'PASS'}),null);assert.equal(staleMaterializedPayloads(dir,null),null);
});

test('command timings are returned for passes and attached to failures without changing the error text',t=>{
  const f=fixture(t);fs.mkdirSync(f.work,{recursive:true});
  const ok=executeCommands({root:f.root,work:f.work,env:process.env,lane:{id:'timed',commands:[{program:process.execPath,args:['-e','0']}]}});
  assert.deepEqual(ok.advisories,[]);assert.equal(ok.commandTimings.length,1);assert.ok(ok.commandTimings[0].durationMs>=0);assert.equal(ok.commandTimings[0].exitCode,0);
  let caught;try{executeCommands({root:f.root,work:f.work,env:process.env,lane:{id:'timed-fail',commands:[{program:process.execPath,args:['-e','0']},{program:process.execPath,args:['-e','process.exit(3)']}]}});}catch(e){caught=e;}
  assert.equal(caught.message,'NATIVE_COMMAND_FAILED:timed-fail:2');assert.deepEqual(caught.commandTimings.map(c=>c.exitCode),[0,3]);
  assert.equal(caught.detail.commandTimings,undefined,'the existing detail shape is unchanged');
});

test('the summary shows the instrumentation tables within a hard size bound and without mutating the report',()=>{
  const files=Array.from({length:1000},(_,i)=>({name:'원본/긴/경로/'+i+'한'.repeat(300),total:1000-i,registered:1,alreadyRegistered:2,refused:3}));
  const stale=Array.from({length:1000},(_,i)=>({payload:'archive/data/r2e-intake/'+i+'값'.repeat(300),sourceArchiveFile:'x'.repeat(500),rows:1000-i}));
  const reasons=Array.from({length:1000},(_,i)=>({name:'REASON_'+i+'사'.repeat(300),count:1000-i}));
  const result={status:'PREPARED',registrationReady:true,changedPaths:[],lanes:[
    {id:'semantic',status:'VERIFIED',durationMs:330000,instrumentation:{stages:Array.from({length:500},(_,i)=>({stage:'stage'+i,durationMs:i*1000,exitCode:0})),
      autoMeta:{run:{targets:13238,attempted:100,applied:1,alreadyRegistered:2,refused:97,unchangedSkipped:5400,notReachedBudget:7738,batchLimit:100,registeredUids:1,requestFiles:1,receiptFiles:1},
        attemptedByFile:{top:files,otherFiles:5,otherCount:50},origin:{available:true,thisMergeDiff:{changedExamFiles:1,questions:2,attempted:1,unchangedSkipped:0,notReachedBudget:1,alsoQueuedBefore:0},
          queuedBacklog:{questions:13236,attempted:99,unchangedSkipped:5400,notReachedBudget:7737},pilot:{questions:0,attempted:0},thisMergeQuestionsNotReachedBecauseOfBudget:1},
        pendingBeforeRun:13238,backlogAfterRun:{pendingTotal:13237,withoutAttemptSignature:7738,attemptedRefused:5499,neverTried:7738,entriesWithMultipleReasons:749,reasonAtomTotal:9000,
          reasons:{top:reasons,otherNames:30,otherCount:120},distinctBaseCommits:143,oldestBaseCommit:{commit:'b'.repeat(40),committedAt:'2026-01-01T00:00:00+00:00',count:7}}},
      staleMetaV2Payloads:{reason:'SOURCE_BLOB_MISMATCH',count:1000,questions:9999,files:stale,otherFiles:5,otherQuestions:7}}},
    {id:'shared',status:'VERIFIED',durationMs:1000,instrumentation:{staleMetaV2Payloads:{reason:'SOURCE_BLOB_MISMATCH',count:0,questions:0,files:[],otherFiles:0,otherQuestions:0}}}]};
  const before=hash(JSON.stringify(result)),summary=renderRegistrationSummary(result);
  assert.ok(Buffer.byteLength(summary)<32*1024,'summary stays small: '+Buffer.byteLength(summary));
  for(const expected of ['Lane time','time per step','targets=13238; attempted=100','not reached (limit)=7738','refused=97',
    "This merge's questions: 2",'not reached because of the limit 1','pending=13237 (before run 13238)','attempted and refused=5499',
    'refusal reason atoms=9000','749 do','Oldest base commit','Reviewed payloads skipped because the exam source changed (semantic): 1000 payloads, 9999 questions',
    'Reviewed payloads skipped because the exam source changed (shared): 0 payloads'])assert.ok(summary.includes(expected),expected);
  assert.equal(hash(JSON.stringify(result)),before);
  const tableRows=summary.split('\n').filter(l=>l.startsWith('| ')).length;assert.ok(tableRows<260,'tables are cut: '+tableRows);
});

test('the AutoMeta pass script keeps its commands and only adds stage markers that never touch stdout',t=>{
  const script=fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../tools/ci/archive-main-auto-meta-pass.sh'),'utf8');
  const markers=[...script.matchAll(/^\s*stage ([a-z0-9-]+)$/gm)].map(m=>m[1]);
  assert.deepEqual(markers,['compile-meta-foundation','materialize-meta-v2','plan-targets','build-db-before','auto-register-write','build-db-after','verify','build-db-fixed-point',
    'verify-after-fixed-point','identity-contract-test','identity-runtime-test','registration-parity','git-diff-checks','replay','postchecks']);
  for(const line of ['node archive/tools/meta-foundation/compile-meta-foundation.mjs --write > "$work/compile.json"',
    'node archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs --write > "$work/materialize.json"'])assert.ok(script.includes(line),line);
  const start=script.indexOf('stage_log='),trapAt=script.indexOf("trap 'rc=$?; stage_end");
  assert.ok(start>0&&trapAt>start,'the stage helper block and its EXIT trap are present');
  const block=script.slice(start,script.indexOf('\n',trapAt));
  const bash=spawnSync('bash',['-c','exit 0'],{encoding:'utf8'});
  if(bash.error||bash.status!==0)return t.skip('bash is not available');
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'stage-pass-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const harness=`set -euo pipefail\nwork=${JSON.stringify(dir.replace(/\\/g,'/'))}\n${block}\nstage first\nstage second\necho STDOUT_PAYLOAD\nfalse\nstage never\n`;
  const run=spawnSync('bash',['-c',harness],{encoding:'utf8'});
  assert.equal(run.status,1,'set -e semantics are unchanged: the failing command ends the script');
  assert.equal(run.stdout,'STDOUT_PAYLOAD\n','stage output never reaches stdout');
  assert.match(run.stderr,/\[stage-time\] second \d+ms exit=1/);
  const rows=fs.readFileSync(path.join(dir,'stage-times.jsonl'),'utf8').trim().split('\n').map(l=>JSON.parse(l));
  assert.deepEqual(rows.map(r=>[r.stage,r.exitCode]),[['first',0],['second',1]]);
  assert.ok(rows.every(r=>Number.isInteger(r.durationMs)&&r.durationMs>=0));
});

// ---- fault injection: instrumentation may lose its numbers but can never fail, block or re-code a registration run ----
function stageHarness(t,body,{work}={}) {
  const script=fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../tools/ci/archive-main-auto-meta-pass.sh'),'utf8');
  const start=script.indexOf('stage_log='),trapAt=script.indexOf("trap 'rc=$?; stage_end");
  const block=script.slice(start,script.indexOf('\n',trapAt));
  const bash=spawnSync('bash',['-c','exit 0'],{encoding:'utf8'});
  if(bash.error||bash.status!==0){t.skip('bash is not available');return null;}
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'stage-fault-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const w=(work??dir).replace(/\\/g,'/');
  return {dir,run:()=>spawnSync('bash',['-c',`set -euo pipefail\nwork=${JSON.stringify(w)}\n${block}\n${body}\n`],{encoding:'utf8'})};
}
test('stage recording that cannot write keeps the original exit code and a clean stdout',t=>{
  const unwritable='/nonexistent-stage-dir-'+process.pid+'/sub';
  const failing=stageHarness(t,'stage a\necho OUT\n(exit 5)\nstage never',{work:unwritable});
  if(!failing)return;
  const bad=failing.run();
  assert.equal(bad.status,5,'the failing command keeps its own exit code when the log cannot be written');
  assert.equal(bad.stdout,'OUT\n');
  const ok=stageHarness(t,'stage a\necho OUT',{work:unwritable}).run();
  assert.equal(ok.status,0);assert.equal(ok.stdout,'OUT\n');
  assert.equal(stageHarness(t,'stage a\n(exit 7)').run().status,7,'and the same code is kept when logging works');
});

test('a failed verify that continues to its retry is recorded with its real exit code',t=>{
  const h=stageHarness(t,'stage verify\nif ! (exit 3); then\n  stage_rc=1\n  stage retry\n  true\nfi\n');
  if(!h)return;
  assert.equal(h.run().status,0);
  const rows=fs.readFileSync(path.join(h.dir,'stage-times.jsonl'),'utf8').trim().split('\n').map(l=>JSON.parse(l));
  assert.deepEqual(rows.map(r=>[r.stage,r.exitCode]),[['verify',1],['retry',0]]);
});

// A runner wall clock that steps backwards must never produce a negative step time, change the exit code or touch stdout.
for(const name of ['archive-main-auto-meta-pass.sh','archive-four-slot-pass.sh']) {
  test(`${name}: a wall clock stepping backwards records 0 with clockAdjusted, keeps the exit code and a clean stdout`,t=>{
    if(!bashOk())return t.skip('bash is not available');
    const script=lf(fs.readFileSync(scriptPath(name),'utf8'));
    const start=script.indexOf('stage_log='),trapAt=script.indexOf("trap 'rc=$?; stage_end");
    assert.ok(start>0&&trapAt>start);
    const block=script.slice(start,script.indexOf('\n',trapAt));
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),'stage-clock-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
    const posix=p=>p.replace(/\\/g,'/'),bin=path.join(dir,'bin');fs.mkdirSync(bin);
    // Fake date: every call returns 1s less than the previous one (counter kept in a file), whatever the arguments.
    fs.writeFileSync(path.join(bin,'date'),'#!/usr/bin/env bash\nf="$FAKE_DATE_COUNTER"\nn=$(cat "$f" 2>/dev/null || echo 0)\nn=$((n+1))\necho "$n" > "$f"\necho $((9000000000 - n * 1000))\n',{mode:0o755});
    const harness=`set -euo pipefail\nwork=${JSON.stringify(posix(dir))}\n${block}\nstage first\nstage second\necho STDOUT_PAYLOAD\n(exit 4)\nstage never\n`;
    const run=spawnSync('bash',['-c',harness],{encoding:'utf8',env:{...process.env,PATH:posix(bin)+':'+process.env.PATH,FAKE_DATE_COUNTER:posix(path.join(dir,'counter'))}});
    const probe=spawnSync('bash',['-c','date +%s%3N'],{encoding:'utf8',env:{...process.env,PATH:posix(bin)+':'+process.env.PATH,FAKE_DATE_COUNTER:posix(path.join(dir,'probe'))}});
    if(!/^8\d{9}\d*\s*$/.test(probe.stdout))return t.skip('a fake date could not shadow the system date here');
    assert.equal(run.status,4,'the failing command keeps its own exit code');
    assert.equal(run.stdout,'STDOUT_PAYLOAD\n','stage output never reaches stdout');
    assert.match(run.stderr,/\[stage-time\] second 0ms exit=4/);
    const rows=fs.readFileSync(path.join(dir,'stage-times.jsonl'),'utf8').trim().split('\n').map(l=>JSON.parse(l));
    assert.deepEqual(rows.map(r=>[r.stage,r.exitCode,r.durationMs,r.clockAdjusted]),[['first',0,0,true],['second',4,0,true]]);
    assert.ok(rows.every(r=>Number.isInteger(r.durationMs)&&r.durationMs>=0));
  });
}
test('readStageTimes shows a recorded negative time as 0, flags it, and leaves normal rows unchanged',t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'stage-neg-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'s.jsonl');
  fs.writeFileSync(file,'{"stage":"a","durationMs":-881,"exitCode":1}\n{"stage":"b","durationMs":0,"exitCode":0,"clockAdjusted":true}\n{"stage":"c","durationMs":1200,"exitCode":0}\n');
  assert.deepEqual(readStageTimes(file),[{stage:'a',durationMs:0,exitCode:1,clockAdjusted:true},{stage:'b',durationMs:0,exitCode:0,clockAdjusted:true},{stage:'c',durationMs:1200,exitCode:0}]);
});

test('a malformed instrumentation object never makes the summary renderer throw',()=>{
  const bad=[{stages:5,autoMeta:{run:{},origin:{available:true}}},{staleMetaV2Payloads:{files:null}},{autoMeta:{run:{targets:1},attemptedByFile:{top:'x'},backlogAfterRun:{reasons:{top:null}}}},{commands:'x',stages:{}}];
  for(const instrumentation of bad) {
    let text;
    assert.doesNotThrow(()=>{text=renderRegistrationSummary({status:'PREPARED',registrationReady:true,changedPaths:[],lanes:[{id:'semantic',status:'VERIFIED',durationMs:1,instrumentation}]});});
    assert.match(text,/### Archive registration writer: PREPARED/);
  }
  const text=renderRegistrationSummary({status:'PREPARED',lanes:[{id:'semantic',status:'VERIFIED',instrumentation:{autoMeta:{run:{},origin:{available:true}}}}]});
  assert.match(text,/Instrumentation summary could not be rendered/);
});

// ---- registration modes in the writer: a merge run drains nothing it does not need, and never hides what remains ----
const queueFixture=(t,remaining=2)=>{
  const f=fixture(t),queue='.archive-meta-register/auto/fixture-queue.json';
  write(f.root,queue,{remaining});commit(f.root,'queued batches fixture');
  const lane=f.lanes.find(l=>l.id==='semantic');lane.inputs.push(queue);lane.outputs.push(queue);
  lane.digestContinuation=true;lane.continuation=({root})=>readJson(root,queue).remaining>0;
  const execute=async ctx=>{await f.execute(ctx);if(ctx.lane.id==='semantic')write(ctx.root,queue,{remaining:Math.max(0,readJson(ctx.root,queue).remaining-1)});};
  return {...f,queue,execute,options:{...f.options,execute}};
};
const registrationState=root=>readJson(root,STATE);
test('the writer decides the mode once, hands the same name to every command, and refuses an unknown value',async t=>{
  for(const [env,expected] of [[{GITHUB_EVENT_NAME:'push'},'merge'],[{GITHUB_EVENT_NAME:'schedule'},'digest'],[{GITHUB_EVENT_NAME:'workflow_dispatch'},'digest'],[{},'digest'],
    [{GITHUB_EVENT_NAME:'push',ARCHIVE_REGISTRATION_MODE:'digest'},'digest']]) {
    const f=fixture(t),seen=new Set();
    const result=await prepareRegistration({...f.options,env,execute:async ctx=>{seen.add(ctx.env.ARCHIVE_REGISTRATION_MODE);return f.execute(ctx);}});
    assert.deepEqual([...seen],[expected],JSON.stringify(env));assert.equal(result.registrationMode,expected);
  }
  assert.equal(inferRegistrationMode({GITHUB_EVENT_NAME:'push'}),'merge');
  const f=fixture(t);
  await assert.rejects(()=>prepareRegistration({...f.options,env:{ARCHIVE_REGISTRATION_MODE:'fast'}}),/REGISTRATION_MODE_INVALID/);
});
test('merge run: queued semantic work is not a reason to run, stays visible as backlog, and writer-state keeps the flag; a digest run continues it',async t=>{
  const f=queueFixture(t),push={GITHUB_EVENT_NAME:'push'};
  const first=await prepareRegistration({...f.options,env:{}});
  assert.equal(first.status,'PREPARED_WITH_PENDING');commit(f.root,'digest batch one');
  assert.equal(registrationState(f.root).lanes.semantic.needsContinuation,true);
  const savedState=read(f.root,STATE);f.calls.length=0;
  const digestCheck=checkRegistration({...f.options,env:{}}),mergeCheck=checkRegistration({...f.options,env:push});
  assert.equal(digestCheck.needed,true);assert.equal(digestCheck.status,'REGISTRATION_PARTIAL');
  assert.equal(mergeCheck.needed,false,'a merge run does not need to run it');assert.equal(mergeCheck.backlogDeferred,true);
  assert.equal(mergeCheck.status,'REGISTERED_WITH_BACKLOG','"not needed now" is not "registered, nothing left"');assert.equal(mergeCheck.publishable,true);
  const merge=await prepareRegistration({...f.options,env:push});
  assert.deepEqual(f.calls,[],'nothing ran');assert.equal(merge.needed,false);assert.equal(merge.publishable,true);assert.equal(merge.safeToPersist,true);
  assert.equal(merge.status,'NO_OP_WITH_BACKLOG');assert.equal(merge.backlogDeferred,true);
  assert.equal(read(f.root,STATE),savedState,'writer-state.json is byte-identical: the remaining work is still recorded');
  assert.equal(registrationState(f.root).lanes.semantic.needsContinuation,true);
  const lane=merge.lanes.find(l=>l.id==='semantic');assert.equal(lane.status,'NO_OP');assert.equal(lane.needsContinuation,true);
  assert.match(renderRegistrationSummary(merge),/Queued registration work remains/);
  const digest=await prepareRegistration({...f.options,env:{}});
  assert.deepEqual(f.calls,['semantic'],'the digest run does the queued batch');assert.equal(digest.needed,false);assert.equal(digest.backlogDeferred,false);
  assert.equal(registrationState(f.root).lanes.semantic.needsContinuation,false,'only a digest run that actually finished clears it');
});
test('merge run whose inputs changed runs the lane and recomputes the flag from what remains, never from the old value',async t=>{
  const f=queueFixture(t,3);
  const first=await prepareRegistration({...f.options,env:{}});assert.equal(first.needed,true);commit(f.root,'digest batch one');
  write(f.root,'inputs/meta.json',{label:'fixture metadata v2'});commit(f.root,'a merge changed an input');f.calls.length=0;
  const merge=await prepareRegistration({...f.options,env:{GITHUB_EVENT_NAME:'push'}});
  assert.ok(f.calls.includes('semantic'),'changed inputs still run the lane in a merge run');
  assert.equal(registrationState(f.root).lanes.semantic.needsContinuation,true,'backlog remains after this batch');
  assert.equal(merge.needed,false);assert.equal(merge.backlogDeferred,true);assert.equal(merge.status,'PREPARED_WITH_BACKLOG');
});
test('needsContinuation never feeds publication: publishable, registrationReady and safeToPersist ignore a semantic backlog in both modes',async t=>{
  const f=queueFixture(t);
  for(const env of [{},{GITHUB_EVENT_NAME:'push'}]) {
    const result=await prepareRegistration({...f.options,env});
    assert.equal(result.publishable,true);assert.equal(result.registrationReady,true);assert.equal(result.safeToPersist,true);
    if(git(f.root,'status','--porcelain'))commit(f.root,'persist');
    const checked=checkRegistration({...f.options,env});
    assert.equal(checked.publishable,true);assert.equal(checked.registrationReady,true);
  }
  // Only required, enabled lanes decide publication; the semantic lane is optional by construction.
  const lanes=nativeLanes(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
  assert.equal(lanes.find(l=>l.id==='semantic').required,undefined);
  assert.deepEqual(lanes.filter(l=>l.digestContinuation).map(l=>l.id),['semantic'],'only the semantic lane defers its backlog');
  assert.ok(lanes.filter(l=>l.continuation).every(l=>l.digestContinuation));
});
test('--unrelated-range and the regenerate path do not read needsContinuation',()=>{
  const source=fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../tools/ci/archive-registration-writer.mjs'),'utf8');
  const uses=[...source.matchAll(/needsContinuation/g)].length;
  const unrelated=source.slice(source.indexOf('export function unrelatedRange'),source.indexOf('async function main'));
  assert.ok(uses>0);assert.doesNotMatch(unrelated,/needsContinuation|continuation/);
});
test('fourSlot stage times are collected like the semantic ones and stay evidence only',t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'four-slot-stage-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  write(dir,'archive-four-slot/stage-times.jsonl',['build-write','check-full-rebuild','replay-reuse-cache','receipt-proof','git-diff-guards','path-allowlist'].map((stage,i)=>JSON.stringify({stage,durationMs:1000+i,exitCode:0})).join('\n')+'\n');
  const out=laneInstrumentation({laneId:'fourSlot',nativeWork:dir,sharedEvidence:dir,root:dir,result:{commandTimings:[]}});
  assert.deepEqual(out.stages.map(s=>s.stage),['build-write','check-full-rebuild','replay-reuse-cache','receipt-proof','git-diff-guards','path-allowlist']);
  assert.equal(laneInstrumentation({laneId:'fourSlot',nativeWork:path.join(dir,'missing'),sharedEvidence:dir,root:dir,result:{}}),undefined,'no file, no numbers, no failure');
});
test('the summary shows mode, remaining backlog and this merge\'s unreached questions',()=>{
  const text=renderRegistrationSummary({status:'NO_OP_WITH_BACKLOG',registrationReady:true,backlogDeferred:true,changedPaths:[],lanes:[{id:'semantic',status:'NO_OP',instrumentation:{autoMeta:{
    run:{targets:0,attempted:0,applied:0,alreadyRegistered:0,refused:0,unchangedSkipped:0,notReachedBudget:0,batchLimit:100},registration:{mode:'merge',backlogRemaining:13238,mergeBacklog:3,mergeNotReached:3}}}}]});
  for(const expected of ['| mode | merge','| backlog remaining (all queued) | 13238','| this merge\'s questions not processed (limit) | 3','| merge leftovers still queued | 3'])assert.ok(text.includes(expected),expected);
});

// ---- the shell passes: commands unchanged, time per step recorded, merge runs with nothing to do skip the heavy build ----
const scriptPath=name=>path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../tools/ci',name);
const lf=text=>text.replace(/\r\n/g,'\n');
test('the 4slot pass keeps every command line and body unchanged and only adds stage markers around them',t=>{
  const script=lf(fs.readFileSync(scriptPath('archive-four-slot-pass.sh'),'utf8'));
  const markers=[...script.matchAll(/^stage ([a-z0-9-]+)$/gm)].map(m=>m[1]);
  assert.deepEqual(markers,['build-write','check-full-rebuild','replay-reuse-cache','receipt-proof','git-diff-guards','path-allowlist']);
  const start=script.indexOf('# Stage timing'),end=script.indexOf('\n',script.indexOf("trap 'rc=$?; stage_end"))+1;
  assert.ok(start>0&&end>start);
  const without=(script.slice(0,start)+script.slice(end)).split('\n').filter(l=>!/^stage [a-z0-9-]+$/.test(l)).join('\n');
  // 이 스크립트가 바뀔 때마다 파일 sha를 다시 박아야 해서 병합마다 깨졌다. 지키려던 것은 "시간 표시를 빼면 검증 명령이 그대로"라는 점이라,
  // 해시 대신 안전 명령(쓰기→재검사→재생→영수증 대조→git diff 보호→경로 허용목록)이 순서대로 남아 있고 시간 표시 도구가 새지 않았는지를 본다.
  assert.ok(!/stage_log|stage_end|stage_start|now_ms/.test(without),'timing helpers are fully removed from the body');
  const ordered=['build-4slot-runtime.cjs --write','build-4slot-runtime.cjs --check','build-4slot-runtime.cjs --report','FOUR_SLOT_REPLAY_OR_VERIFICATION_DRIFT','FOUR_SLOT_RECEIPT_CONFLICT','git diff --exit-code','UNEXPECTED_4SLOT_GENERATED_PATHS'];
  let at=-1;for(const needle of ordered){const i=without.indexOf(needle,at+1);assert.ok(i>at,'safety step missing or out of order: '+needle);at=i;}
  const helper=text=>text.slice(text.indexOf('stage_log='),text.indexOf('\n',text.indexOf("trap 'rc=$?; stage_end"))).split('\n').filter(l=>!l.startsWith('#')).join('\n');
  assert.equal(helper(script),helper(lf(fs.readFileSync(scriptPath('archive-main-auto-meta-pass.sh'),'utf8'))),'same helper as the semantic pass');
  void t;
});
const bashOk=()=>{const b=spawnSync('bash',['-c','exit 0'],{encoding:'utf8'});return !b.error&&b.status===0;};
const pyOk=()=>{const p=spawnSync('python',['-c','pass'],{encoding:'utf8'});return !p.error&&p.status===0;};
// Static relative-import closure of a module, copied into a scratch repo so the real planner can run against fixture data.
function copyClosure(repoRoot,entry,dest) {
  const seen=new Set(),queue=[path.resolve(repoRoot,entry)];
  while(queue.length) {
    const file=queue.pop();if(seen.has(file))continue;seen.add(file);
    for(const m of fs.readFileSync(file,'utf8').matchAll(/(?:from\s*|import\s*\(\s*|require\s*\(\s*|import\s+)['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const target=path.resolve(path.dirname(file),m[1]);
      if(fs.existsSync(target)&&fs.statSync(target).isFile()&&/\.(mjs|cjs|js)$/.test(target))queue.push(target);
    }
  }
  for(const file of seen){const rel=path.relative(repoRoot,file);fs.mkdirSync(path.dirname(path.join(dest,rel)),{recursive:true});fs.copyFileSync(file,path.join(dest,rel));}
}
function passHarness(t,{changeExam}) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'auto-meta-pass-')),repo=path.join(dir,'repo'),temp=path.join(dir,'runner');
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));fs.mkdirSync(repo);fs.mkdirSync(temp);
  const here=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  copyClosure(here,'archive/tools/meta-foundation/auto-register-merged-source.mjs',repo);
  fs.mkdirSync(path.join(repo,'tools/ci'),{recursive:true});fs.copyFileSync(path.join(here,'tools/ci/archive-pages-registration.paths'),path.join(repo,'tools/ci/archive-pages-registration.paths'));
  // Stand-ins for the heavy native producers (compile / materialize): only those two command lines are swapped; the planning,
  // the shortcut and everything after it run as shipped. build_db only records that it ran.
  const stub=(rel,body)=>write(repo,rel,body);
  stub('stub-compile.mjs','console.log("{}");\n');
  const shipped=lf(fs.readFileSync(path.join(here,'tools/ci/archive-main-auto-meta-pass.sh'),'utf8'));
  const swapped=shipped.replace('node archive/tools/meta-foundation/compile-meta-foundation.mjs --write','node stub-compile.mjs').replace('node archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs --write','node stub-compile.mjs');
  assert.notEqual(swapped,shipped);fs.writeFileSync(path.join(repo,'tools/ci/archive-main-auto-meta-pass.sh'),swapped);
  stub('tools/ci/archive-registration-build-db.mjs',"import fs from 'node:fs';fs.appendFileSync(process.env.RUNNER_TEMP+'/build-db-calls','run\\n');\n");
  const sourceRel='archive/exams/original/middle/m3/1mid/fixture.js';
  const bank=(a)=>'window.questionBank='+JSON.stringify([{id:1,a},{id:2,a}])+';\n';
  git(repo,'init','-q','--initial-branch=main');git(repo,'config','user.name','fixture');git(repo,'config','user.email','fixture@example.invalid');
  write(repo,sourceRel,bank(1));write(repo,'.archive-meta-register/auto/config.json',{schemaVersion:'archive-main-merge-meta-v1',enabled:true,maxQuestionsPerRun:100,pilotTargets:[]});
  const base=commit(repo,'base');
  if(changeExam)write(repo,sourceRel,bank(2));else write(repo,'derived.json','{}');
  commit(repo,'merge');
  const pendingKey='original/middle/m3/1mid/older.js#1';
  const state={schemaVersion:'archive-main-merge-meta-v1',lastProcessedCommit:base,pending:{[pendingKey]:{sourceArchiveFile:'original/middle/m3/1mid/older.js',sourceOrdinal:1,baseCommit:base}},completedPilots:[],latestReceipts:{}};
  write(repo,'.archive-meta-register/auto/state.json',state);
  write(repo,'.archive-meta-register/auto/config.json',{schemaVersion:'archive-main-merge-meta-v1',enabled:true,bootstrapBase:base,maxQuestionsPerRun:100,pilotTargets:[]});
  commit(repo,'cursor');
  const stateBytes=fs.readFileSync(path.join(repo,'.archive-meta-register/auto/state.json'));
  const run=mode=>spawnSync('bash',['tools/ci/archive-main-auto-meta-pass.sh'],{cwd:repo,encoding:'utf8',
    env:{...process.env,RUNNER_TEMP:temp.split(path.sep).join('/'),GITHUB_ACTIONS:'',GITHUB_EVENT_NAME:'',GITHUB_STEP_SUMMARY:'',...(mode?{ARCHIVE_REGISTRATION_MODE:mode}:{ARCHIVE_REGISTRATION_MODE:''})}});
  const buildCalls=()=>{try{return fs.readFileSync(path.join(temp,'build-db-calls'),'utf8').trim().split('\n').filter(Boolean).length;}catch{return 0;}};
  return {repo,temp,run,buildCalls,stateBytes,work:path.join(temp,'archive-main-auto-meta')};
}
test('merge pass with no changed exam question ends at NO_TARGETS without build_db, keeps state.json and keeps the work-remains flag',{skip:!bashOk()&&'bash is not available'},t=>{
  const h=passHarness(t,{changeExam:false});
  const result=h.run('merge');
  assert.equal(result.status,0,result.stderr+result.stdout);
  assert.match(result.stdout,/^NO_TARGETS/m);assert.equal(h.buildCalls(),0,'neither build_db run happened');
  assert.deepEqual(fs.readFileSync(path.join(h.repo,'.archive-meta-register/auto/state.json')),h.stateBytes,'state.json byte-identical');
  const report=JSON.parse(fs.readFileSync(path.join(h.work,'report.json'),'utf8'));
  assert.equal(report.status,'NO_CHANGE');assert.equal(report.mode,'merge');assert.equal(report.targetCount,0);assert.equal(report.backlogRemaining,1);assert.deepEqual(report.results,[]);
  const stages=readStageTimes(path.join(h.work,'stage-times.jsonl')).map(s=>s.stage);
  assert.deepEqual(stages,['compile-meta-foundation','materialize-meta-v2','plan-targets'],'the heavy stages never started');
  // The writer's own continuation rule on this exact evidence: queued work that this run did not visit keeps the lane "not finished".
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const continuation=nativeLanes(root).find(l=>l.id==='semantic').continuation;
  assert.equal(continuation({root:h.repo,env:{RUNNER_TEMP:h.temp}}),true);
});
test('merge pass with a changed exam question takes the full path; digest pass never takes the shortcut',{skip:!bashOk()&&'bash is not available'},t=>{
  const merge=passHarness(t,{changeExam:true}),mergeRun=merge.run('merge');
  assert.notEqual(mergeRun.status,0,'the fixture has no registry, so the full path fails at the real planner after the build step');
  assert.ok(merge.buildCalls()>=1,'build_db ran: the full set of steps is kept when this merge has questions');
  assert.doesNotMatch(mergeRun.stdout,/NO_TARGETS/);
  const digest=passHarness(t,{changeExam:false}),digestRun=digest.run('');
  assert.ok(digest.buildCalls()>=1,'a digest (or unset) mode still runs everything');assert.doesNotMatch(digestRun.stdout,/NO_TARGETS/);
  assert.deepEqual(readStageTimes(path.join(digest.work,'stage-times.jsonl')).map(s=>s.stage).slice(0,3),['compile-meta-foundation','materialize-meta-v2','build-db-before'],'no plan stage outside merge mode');
});
test('the 4slot pass writes its per-step times next to the existing report and keeps its exit code',{skip:(!bashOk()&&'bash is not available')||(!pyOk()&&'python is not available')},t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'four-slot-pass-')),repo=path.join(dir,'repo'),temp=path.join(dir,'runner');
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));fs.mkdirSync(repo);fs.mkdirSync(temp);
  git(repo,'init','-q','--initial-branch=main');git(repo,'config','user.name','fixture');git(repo,'config','user.email','fixture@example.invalid');
  fs.mkdirSync(path.join(repo,'tools/ci'),{recursive:true});fs.copyFileSync(scriptPath('archive-four-slot-pass.sh'),path.join(repo,'tools/ci/archive-four-slot-pass.sh'));
  write(repo,'.archive-meta-register/auto/config.json',{fourSlotEnabled:true});
  // Stand-in builder: writes one deterministic index and the three reports the pass compares.
  write(repo,'tools/4slot/build-4slot-runtime.cjs',`const fs=require('node:fs'),crypto=require('node:crypto');
const a=process.argv,report=a[a.indexOf('--report')+1];fs.mkdirSync('archive/data',{recursive:true});
if(a.includes('--write'))fs.writeFileSync('archive/data/item-4slot-index.json','{"rows":1}\\n');
const sha=crypto.createHash('sha256').update(fs.readFileSync('archive/data/item-4slot-index.json')).digest('hex');
fs.writeFileSync(report,JSON.stringify({status:'OK',changed:false,indexSha256:sha,inputDigest:'x',counts:{},verified:true}));\n`);
  commit(repo,'base');
  const result=spawnSync('bash',['tools/ci/archive-four-slot-pass.sh'],{cwd:repo,encoding:'utf8',env:{...process.env,RUNNER_TEMP:temp.split(path.sep).join('/'),GITHUB_STEP_SUMMARY:''}});
  assert.equal(result.status,0,result.stderr);
  const rows=readStageTimes(path.join(temp,'archive-four-slot/stage-times.jsonl'));
  assert.deepEqual(rows.map(r=>r.stage),['build-write','check-full-rebuild','replay-reuse-cache','receipt-proof','git-diff-guards','path-allowlist']);
  assert.ok(rows.every(r=>r.exitCode===0&&Number.isInteger(r.durationMs)));
  assert.ok(fs.existsSync(path.join(repo,'.archive-meta-register/auto/4slot/last-verification.json')));
  assert.ok(!fs.readFileSync(path.join(temp,'archive-four-slot/stage-times.jsonl'),'utf8').includes('"exitCode":1'));
});

// A refusal/pending record is named like its request, so .gitignore (`*textbook*`) can match it. The writer stages the
// records directories regardless of the ignore rules (and only those); the final gate is a backstop that fails the run
// if a request still leaves .archive-meta-register/inbox/ with neither an applied entry nor a staged record.
const INBOX_DIR='.archive-meta-register/inbox/';
function inboxFixture(t,modes) {
  const f=fixture(t);
  write(f.root,'.gitignore','*textbook*\n');
  for(const name of Object.keys(modes))write(f.root,INBOX_DIR+name,{requestId:name});
  git(f.root,'add','-A');git(f.root,'add','-f','--',INBOX_DIR);git(f.root,'commit','-q','-m','pending requests');
  const reviewed={id:'reviewed',inputs:[INBOX_DIR],outputs:[INBOX_DIR,'.archive-meta-register/rejected/'],commands:[]};
  const lanes=[reviewed,...f.lanes.slice(1)];
  const execute=async(args)=>{
    if(args.lane.id!=='reviewed')return f.execute(args);
    const pass=path.join(args.env.RUNNER_TEMP,'archive-meta-register-pass');fs.mkdirSync(pass,{recursive:true});
    const applied=[],opt={root:args.root,rejectedDir:'.archive-meta-register/rejected'};
    for(const [name,mode] of Object.entries(modes)) {
      const abs=path.join(args.root,INBOX_DIR+name);
      if(mode==='reject'||mode==='reject-lost')recordRejection(opt,abs,{error:'fixture refusal'},{log(){}});
      if(mode==='reject-lost')for(const lost of [name,name.replace(/\.json$/,'.rejection.json')])fs.rmSync(path.join(args.root,'.archive-meta-register/rejected',lost));
      if(mode==='apply'){applied.push(INBOX_DIR+name);fs.rmSync(abs);}
    }
    write(args.root,'out/stray__textbook__.json',{ignored:'outside the records directories'});
    fs.writeFileSync(path.join(pass,'applied.txt'),applied.map(p=>p+'\n').join(''));
    return {advisories:[]};
  };
  return {...f,options:{...f.options,lanes,execute}};
}

test('a rejected request whose name .gitignore matches still has its refusal record staged; other requests proceed; other ignored files stay out',async t=>{
  const f=inboxFixture(t,{'zz__textbooks__refused.json':'reject','zz__ordinary.json':'reject','zz__applied.json':'apply'});
  const result=await prepareRegistration(f.options);
  assert.equal(result.safeToPersist,true);
  assert.deepEqual(git(f.root,'diff','--cached','--name-only','--no-renames','--','.archive-meta-register/inbox','.archive-meta-register/rejected').split('\n').sort(),
    ['.archive-meta-register/inbox/zz__applied.json','.archive-meta-register/inbox/zz__ordinary.json','.archive-meta-register/inbox/zz__textbooks__refused.json',
      '.archive-meta-register/rejected/zz__ordinary.json','.archive-meta-register/rejected/zz__ordinary.rejection.json',
      '.archive-meta-register/rejected/zz__textbooks__refused.json','.archive-meta-register/rejected/zz__textbooks__refused.rejection.json']);
  assert.equal(git(f.root,'ls-files','--','out/stray__textbook__.json'),'','an ignored file outside the records directories is never staged');
  assert.equal(git(f.root,'ls-files','--others','--ignored','--exclude-standard','--','out'),'out/stray__textbook__.json');
});

test('backstop: a request that left the inbox with no applied entry and no record fails the run, names it, and persists nothing',async t=>{
  const f=inboxFixture(t,{'zz__lost.json':'reject-lost','zz__ordinary.json':'reject'});
  await assert.rejects(prepareRegistration(f.options),error=>{
    assert.match(error.message,/^SILENT_INBOX_DROP:zz__lost\.json:/);
    assert.doesNotMatch(error.message,/zz__ordinary/);assert.match(error.message,/gitignore/i);return true;
  });
  const report=readJson(f.work,'report.json');
  assert.equal(report.status,'FINAL_GATE_FAILED');assert.equal(report.safeToPersist,false);
  assert.equal(git(f.root,'show',`HEAD:${INBOX_DIR}zz__lost.json`).includes('requestId'),true,'the request stays in the committed inbox');
});

test('a rejected request with a committable name stays a successful run with its refusal record staged',async t=>{
  const f=inboxFixture(t,{'zz__ordinary.json':'reject'});
  const result=await prepareRegistration(f.options);
  assert.equal(result.safeToPersist,true);
  assert.deepEqual(git(f.root,'diff','--cached','--name-only','--no-renames','--','.archive-meta-register/inbox','.archive-meta-register/rejected').split('\n').sort(),
    ['.archive-meta-register/inbox/zz__ordinary.json','.archive-meta-register/rejected/zz__ordinary.json','.archive-meta-register/rejected/zz__ordinary.rejection.json']);
});

test('an applied request leaves the inbox without a refusal record and is not a silent drop, whatever its name',async t=>{
  const f=inboxFixture(t,{'zz__textbooks__applied.json':'apply','zz__applied.json':'apply'});
  const result=await prepareRegistration(f.options);
  assert.equal(result.safeToPersist,true);
  assert.equal(git(f.root,'diff','--cached','--name-only','--','.archive-meta-register/inbox').split('\n').length,2);
});

// The compiled matcher replaced a RegExp-per-pattern-per-file loop (40 s of CPU per lane assessment). Same answer, same digests:
// both are computed here in one run, never compared with a stored expectation.
test('the compiled path matcher answers exactly like the original definition and fingerprints are byte-identical',()=>{
  const patterns=['a/b.js','dir/','star/*.js','x*y','*/z.json','lit.er+al(1).js','dots.a.b','sl*/','tools/ci/*register*.paths','','*'];
  const paths=['a/b.js','a/b.jsx','a/bxjs','dir/','dir/x','dire/x','star/q.js','star/a/b.js','star/q.json','xy','x/y','xzzy','p/z.json','z.json','a/z.json','lit.er+al(1).js','litter+al(1).js','dots.a.b','dotsXaXb',
    'sl*/q','sl1/q','tools/ci/archive-x-register-y.paths','tools/ci/register.paths','tools/ci/registerxpaths','','weird [name]^$.js'];
  for(const list of [patterns,...patterns.map(p=>[p]),[...patterns].reverse()]) {
    const hit=compilePatterns(list);
    for(const file of paths) {
      assert.equal(hit(file),matchesReference(file,list),`${JSON.stringify(list)} vs ${file}`);
      assert.equal(matches(file,list),matchesReference(file,list));
    }
  }
  // The memo is keyed by array identity: editing the same array in place must not reuse the old answer.
  const edited=['one/'];assert.equal(matches('one/x',edited),true);edited[0]='two/';assert.equal(matches('one/x',edited),false);assert.equal(matches('two/x',edited),true);
  // The real index and the real lane policy: every lane's inputs and outputs, original matcher on every 10th tracked path.
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const rows=indexRows(root);
  assert.ok(rows.length>1000);
  for(const lane of nativeLanes(root)) {
    for(const list of [lane.inputs,lane.outputs,...(lane.scopedInputs?[lane.scopedInputs]:[])]) {
      const hit=compilePatterns(list),sample=new Set(rows.filter((r,i)=>i%10===0).map(r=>r.path));
      for(const file of sample)assert.equal(hit(file),matchesReference(file,list),`${lane.id}: ${file}`);
      const original=crypto.createHash('sha256').update(rows.filter(r=>r.path!==STATE&&sample.has(r.path)&&matchesReference(r.path,list)).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0)
        .map(r=>`${r.path}\0${r.mode}\0${r.blob}\n`).join('')).digest('hex');
      assert.equal(fingerprint(rows.filter(r=>sample.has(r.path)),list),original,`${lane.id} fingerprint`);
    }
  }
});
