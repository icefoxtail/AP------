import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {e035Fixture,stable} from './helpers/m2-e035-renderer-fixture.mjs';
import {registerReviewedExamV2} from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {nativeReviewReceipt,planQuestion} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {validateNativeReviewedSourceReuse,hasNativeReviewedSourceClaim} from '../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs';

function cold(f,c,previous){
  const input={question:c.question,previous,current:c.current,identity:c.identity,ordinal:c.ordinal,source:c.source,runtimeOwner:c.runtimeOwner,
    runtimeRecord:c.nativeSource.runtimeRecord,runtimeStatus:c.nativeSource.runtimeStatus};
  const inputPath=path.join(f.root,'synthetic-cold-context.json');fs.writeFileSync(inputPath,JSON.stringify(input));
  const auto=new URL('../archive/tools/meta-foundation/auto-register-merged-source.mjs',import.meta.url).href;
  const registry=new URL('../archive/tools/meta-foundation/active-registry.mjs',import.meta.url).href;
  const code=`import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import crypto from 'node:crypto';
    import {planQuestion} from ${JSON.stringify(auto)};import {loadActiveMetaRegistry,validateActiveMetaFields} from ${JSON.stringify(registry)};
    const root=process.cwd(),x=JSON.parse(fs.readFileSync('synthetic-cold-context.json')),bytes=fs.readFileSync(path.join(root,'archive/exams',x.source));
    const v={window:{}};vm.runInNewContext(bytes.toString(),v);const bank=JSON.parse(JSON.stringify(v.window.questionBank));
    const identityMap=JSON.parse(fs.readFileSync(path.join(root,'archive/data/question_identity_map.json')));
    const blobSha1=crypto.createHash('sha1').update('blob '+bytes.length+'\\0').update(bytes).digest('hex');
    const nativeSource={root,bytes,blobSha1,bank,runtimeRecord:x.runtimeRecord,runtimeStatus:x.runtimeStatus,identityMap,
      identityByJoin:new Map(identityMap.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r]))};
    const r=planQuestion({...x,nativeSource,registry:loadActiveMetaRegistry(root),validate:validateActiveMetaFields});
    process.stdout.write(JSON.stringify({status:r.status,nativeReviewReceipt:r.nativeReviewReceipt??null,hasFinal:r.final!==undefined}));`;
  return JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',code],{cwd:f.root,env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0'},maxBuffer:1024*1024}));
}
function pending(f,c,{alsoCold=false}={}){
  for(const previous of [c.previous,structuredClone(c.question)]){
    assert.equal(nativeReviewReceipt({...c,previous}),null);
    const result=planQuestion({...c,previous});assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,undefined);assert.equal(result.final,undefined);
    if(alsoCold)assert.deepEqual(cold(f,c,previous),{status:'SUPPLEMENT_PENDING',nativeReviewReceipt:null,hasFinal:false});
  }
}
function strip(f,c){
  const sidecar=c.receipt.outputDigests.find(r=>r.path.endsWith('.source-review-binding.json')).path;
  delete c.receipt.fingerprintRepairs;c.receipt.outputDigests=c.receipt.outputDigests.filter(r=>r.path!==sidecar);
  c.receipt.approval.evidenceRefs=[];
  for(const row of [c.current,c.nativeSource.runtimeRecord,...c.receipt.appliedRecords,...c.receipt.runtimeRecords]){
    row.approvalEvidence=[];delete row.metadataRevision;
  }
  fs.unlinkSync(path.join(f.root,sidecar));
  for(const relative of [f.transportPath,f.negativePath,f.positivePath,f.technicalPath,f.visualPath,f.repairPath])fs.unlinkSync(path.join(f.root,relative));
  f.put(c.receiptPath,c.receipt);
}

test('v3 official dry write replay native and AutoMeta keep the complete original approval',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'}),source=f.raw(f.sourcePath),request=stable(f.request);
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).status,'PASS');
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).status,'PASS');
  const replay=registerReviewedExamV2({root:f.root,request:f.request});assert.equal(replay.replay,true);assert.deepEqual(replay.plannedPaths,[]);
  const c=f.runtimeContext();assert.equal(validateNativeReviewedSourceReuse(c.receipt,c.nativeSource,c.question,c.identity,c.ordinal,c.current,c.registry),true);
  for(const previous of [c.previous,f.prefigure,structuredClone(c.question)]){
    assert.equal(nativeReviewReceipt({...c,previous}),c.receiptPath);
    const result=planQuestion({...c,previous});assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,c.receiptPath);assert.equal(result.final,undefined);
  }
  assert.deepEqual(cold(f,c,c.previous),{status:'ALREADY_REGISTERED',nativeReviewReceipt:c.receiptPath,hasFinal:false});
  assert.equal(stable(f.request),request);assert.deepEqual(f.raw(f.sourcePath),source);
});

test('v3 issued visual deletion is refused warm and cold and exact bytes restore the original route',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();
  assert.equal(nativeReviewReceipt(c),c.receiptPath);const raw=f.raw(f.visualPath);fs.unlinkSync(path.join(f.root,f.visualPath));
  pending(f,c,{alsoCold:true});f.put(f.visualPath,raw);
  assert.equal(nativeReviewReceipt(c),c.receiptPath);
  assert.deepEqual(cold(f,c,c.previous),{status:'ALREADY_REGISTERED',nativeReviewReceipt:c.receiptPath,hasFinal:false});
});

test('v3 committed removal of all provenance cannot erase the original immutable HOLD obligation',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();
  assert.equal(nativeReviewReceipt(c),c.receiptPath);strip(f,c);f.commit();
  assert.equal(hasNativeReviewedSourceClaim({root:f.root,current:c.current,runtimeRecord:c.nativeSource.runtimeRecord}),true);
  pending(f,c,{alsoCold:true});
});

test('synthetic official E035 dry write replay native and AutoMeta preserve one v3 consumer',t=>{
  const f=e035Fixture(t),source=f.raw(f.sourcePath),request=stable(f.request);
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).status,'PASS');
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).status,'PASS');
  const replay=registerReviewedExamV2({root:f.root,request:f.request});assert.equal(replay.replay,true);assert.deepEqual(replay.plannedPaths,[]);
  const c=f.runtimeContext();assert.equal(validateNativeReviewedSourceReuse(c.receipt,c.nativeSource,c.question,c.identity,c.ordinal,c.current,c.registry),true);
  for(const previous of [c.previous,f.prefigure,structuredClone(c.question)]){
    assert.equal(nativeReviewReceipt({...c,previous}),c.receiptPath);
    const result=planQuestion({...c,previous});assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt,c.receiptPath);assert.equal(result.final,undefined);
  }
  assert.deepEqual(cold(f,c,c.previous),{status:'ALREADY_REGISTERED',nativeReviewReceipt:c.receiptPath,hasFinal:false});
  assert.equal(stable(f.request),request);assert.deepEqual(f.raw(f.sourcePath),source);
});

test('old-cursor fingerprint agreement does not excuse a changed whole original question',t=>{
  const f=e035Fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();
  const previous={...c.previous,unapprovedMetadata:'extra'};
  assert.equal(nativeReviewReceipt({...c,previous}),null);
  assert.equal(planQuestion({...c,previous}).status,'SUPPLEMENT_PENDING');
});

for(const [name,mutate] of [
  ['live repaired asset drift',f=>{fs.appendFileSync(path.join(f.root,f.newSolution),' ');}],
  ['missing original v3 authority',f=>{fs.unlinkSync(path.join(f.root,f.finalizationRef.path));}],
  ['missing current UI observation',f=>{fs.unlinkSync(path.join(f.root,f.visualPath));}],
  ['sidecar deletion',(f,c)=>{fs.unlinkSync(path.join(f.root,c.receipt.outputDigests.find(r=>r.path.endsWith('.source-review-binding.json')).path));}],
  ['receipt renderer proof deletion',(f,c)=>{delete c.receipt.fingerprintRepairs[0].sourceReview.m2E035RendererContinuity;f.put(c.receiptPath,c.receipt);}],
])test('issued E035 refuses '+name+' on both old and current cursors',t=>{
  const f=e035Fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();
  assert.equal(nativeReviewReceipt(c),c.receiptPath);mutate(f,c);pending(f,c);
});

test('all live provenance removal fails warm and cold even when every marker is stripped',t=>{
  const f=e035Fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();
  assert.equal(nativeReviewReceipt(c),c.receiptPath);strip(f,c);
  assert.equal(hasNativeReviewedSourceClaim({root:f.root,current:c.current,runtimeRecord:c.nativeSource.runtimeRecord}),true);
  pending(f,c,{alsoCold:true});
});

test('committed deletion of all E035 evidence preserves the immutable obligation',t=>{
  const f=e035Fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();strip(f,c);f.commit();
  pending(f,c,{alsoCold:true});
});

test('merge-parent HOLD history cannot be erased by a merged tree without live witnesses',t=>{
  const f=e035Fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();
  const witnessed=f.git('rev-parse','HEAD'),tree=f.git('rev-parse',f.nativeCommit+'^{tree}');
  const sibling=f.git('commit-tree',tree,'-p',f.nativeCommit,'-m','Synthetic branch before E035 observation');
  strip(f,c);f.git('add','-A');
  const merged=f.git('commit-tree',f.git('write-tree'),'-p',sibling,'-p',witnessed,'-m','Synthetic merge must retain original obligation');f.git('update-ref','HEAD',merged);
  pending(f,c,{alsoCold:true});
});

test('unrelated branch evidence does not create an obligation outside actual HEAD ancestry',t=>{
  const f=e035Fixture(t);f.git('branch','synthetic-unmerged-witness');f.git('reset','--hard',f.nativeCommit);
  assert.equal(hasNativeReviewedSourceClaim({root:f.root,current:{questionUid:f.patch.questionUid,sourceArchiveFile:f.request.sourceArchiveFile}}),false);
});

test('current canonical definition changes are not cached as a successful E035 reuse',t=>{
  const f=e035Fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();
  assert.equal(nativeReviewReceipt(c),c.receiptPath);
  const document=f.read(f.definitionPath);document.concepts[0].definition='Changed current definition without approval.';f.put(f.definitionPath,document);
  pending(f,c);
});

test('committed empty replacement cannot erase a removed E035 negative and carrier',t=>{
  const f=e035Fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();strip(f,c);
  f.put(f.transportPath,{});f.put(f.negativePath,{});f.commit();pending(f,c,{alsoCold:true});
});

test('unavailable HEAD remains an E035 obligation and refuses native reuse',t=>{
  const f=e035Fixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const c=f.runtimeContext();
  assert.equal(nativeReviewReceipt(c),c.receiptPath);
  fs.renameSync(path.join(f.root,'.git'),path.join(f.root,'synthetic-inaccessible-git'));
  assert.equal(hasNativeReviewedSourceClaim({root:f.root,current:c.current,runtimeRecord:c.nativeSource.runtimeRecord}),true);
  pending(f,c,{alsoCold:true});
});
