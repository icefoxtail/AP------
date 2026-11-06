import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {prepareRegistration,checkRegistration,nativeLanes,matches,executeCommands,STATE} from '../tools/ci/archive-registration-writer.mjs';

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

test('native proof includes external canonical authority, consumer policy and core runtime dependencies',()=>{
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),lanes=nativeLanes(root);
  const shared=lanes.find(l=>l.id==='shared');
  for(const input of [
    'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',
    'archive/data/basic-scope-parent-links.json','archive/data/archive2-canonical-projection-policy.json',
    'archive/mixer-selector.js','archive/data/textbook-source-manifest-v1.json'
  ])assert.equal(matches(input,shared.inputs),true,'direct shared dependency: '+input);
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
