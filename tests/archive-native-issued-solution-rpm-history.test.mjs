import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  ISSUED_SOLUTION_RPM_HISTORY_SCHEMA, hasIssuedSolutionRpmHistory, loadIssuedSolutionRpmHistory,
  assertIssuedSolutionRpmHistoricalLeaf, readIssuedSolutionRpmHistoricalEvidence,
  readIssuedSolutionRpmCurrentState, replayIssuedSolutionRpmHistoricalLeaf
} from '../archive/tools/meta-foundation/native-issued-solution-rpm-history.mjs';

const CROSS = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const TAXONOMY = 'archive/data/meta-foundation/canonical/packs/synthetic/taxonomy.json';
const RECEIPTS = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const SOURCE = 'original/middle/m2/1final/solution-history-unit.js';
const META = 'archive/data/question_metadata.json', IDS = 'archive/data/question_identity_map.json';
const RUNTIME = 'archive/data/meta-foundation/runtime/middle2-v1.json';
const UID = 'qid_v1_issued_solution_history_test_one';
const IMAGE = 'archive/assets/images/synthetic-solution-history/q1.png';
const stable = x => JSON.stringify(x, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const json = x => Buffer.from(JSON.stringify(x, null, 2) + '\n');
const source = rows => Buffer.from(`window.questionBank = ${JSON.stringify(rows)};\n`);
const sf = q => sha(JSON.stringify({ content:q.content ?? null, choices:Array.isArray(q.choices) ? q.choices : null,
  answer:q.answer ?? null, solution:q.solution ?? null, image:q.image ?? null }));
const cf = q => sha(JSON.stringify({ content:q.content ?? null, choices:Array.isArray(q.choices) ? q.choices : null, image:q.image ?? null }));
const git = (root, ...args) => execFileSync('git', args, { cwd:root, encoding:'utf8', stdio:['ignore','pipe','pipe'] }).trim();

function fixture(t, options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'issued-solution-history-test-'));
  t.after(() => fs.rmSync(root, { recursive:true, force:true }));
  const write = (rel,value) => {
    const full = path.join(root,rel); fs.mkdirSync(path.dirname(full),{recursive:true});
    fs.writeFileSync(full,Buffer.isBuffer(value) ? value : json(value));
  };
  const read = rel => JSON.parse(fs.readFileSync(path.join(root,rel)));
  const rpmPath = { majorUnit:'unit', midUnit:'subunit', l3:'concept', l4:'method' };
  const question = { id:1, content:'synthetic question', choices:['a','b'], answer:'a', solution:'synthetic issued solution',
    courseKey:'M2-1', curriculum:'2022', rpmPrimaryId:'M2-RPM-SELECTED', rpmPrimaryPath:rpmPath,
    rpmL1:'unit', rpmL2:'subunit', rpmL3:'concept', rpmL4:'method',
    ...(options.withImage ? {image:IMAGE.slice('archive/'.length)} : {}), ...options.questionFields };
  const oldBank = [question,{id:2,content:'unselected synthetic neighbour',producer:'issued'}];
  const beforeBank = structuredClone(oldBank);
  beforeBank[0] = {...beforeBank[0],solution:'synthetic original solution',...options.originalFields};
  const beforeBytes = source(beforeBank), oldBytes = source(oldBank);
  git(root,'init','--quiet'); git(root,'config','user.name','Unit Fixture'); git(root,'config','user.email','unit@example.invalid');
  const imageBytes=Buffer.from('synthetic immutable approved PNG input');
  if(options.withImage)write(IMAGE,imageBytes);
  write('archive/exams/'+SOURCE,beforeBytes); git(root,'add','.'); git(root,'commit','--quiet','-m','synthetic original source');
  let assetProofSourceCommit, proofSourceBytes;
  if(options.withImage){
    const proofBank=structuredClone(oldBank);Object.assign(proofBank[0],options.proofSourceFields||{});proofSourceBytes=source(proofBank);
    write('archive/exams/'+SOURCE,proofSourceBytes);git(root,'add','.');git(root,'commit','--quiet','-m','synthetic published image proof source');
    assetProofSourceCommit=git(root,'rev-parse','HEAD');
  }
  const cross = { schemaVersion:'rpm-primary-active-crosswalk-v1',status:'ACTIVE_REFERENCE',rpmAuthority:{source:MASTER},
    records:[{id:'M2-RPM-SELECTED',curriculum:'2022',scope:'M2-1',rpmPath},
      {id:'M2-RPM-UNRELATED',curriculum:'2022',scope:'M2-1',rpmPath}],summary:{count:2} };
  const master = {schemaVersion:'js-archive-taxonomy-rpm-primary-v1.0',authorityStatus:'LOCKED',records:[
    {curriculum:'2022',scope:'M2-1',majorUnit:'unit',midUnit:'subunit',concepts:[
      {concept:'concept',problemTypes:[{problemType:'method'}]}]}]};
  const taxonomy = {schemaVersion:'synthetic-taxonomy',problemTypes:[{problemTypeKey:'PT_SYNTHETIC',status:'ACTIVE',ownerPack:'SYNTHETIC'}],
    templates:[{templateKey:'TPL_SYNTHETIC',parentProblemTypeKey:'PT_SYNTHETIC',status:'ACTIVE',ownerPack:'SYNTHETIC'}]};
  const priorId = 'issued-solution-original', priorPath = RECEIPTS+priorId+'.json';
  const labelPath = RECEIPTS+'issued-solution.parent-labels.json';
  const label = {schemaVersion:'archive-meta-pipeline-parent-label-evidence-v1',sourcePath:SOURCE,sourceSha256:sha(oldBytes),records:[]};
  const proofPath = '.archive-meta-register/evidence/solution-history/authority.json';
  const evidence = [[CROSS,cross],[MASTER,master],[TAXONOMY,taxonomy],[labelPath,label],
    [proofPath,{role:'synthetic original immutable input'}],
    ...[1,2,3].map(i=>[`.archive-meta-register/evidence/solution-history/input-${i}.json`,{role:'synthetic original input',index:i}])];
  if(options.withImage)evidence[4][1]={schemaVersion:'archive-narrow-metadata-independent-crosscheck-v1',questionUid:UID,sourceOrdinal:1,
    source:{path:'archive/exams/'+SOURCE,gitBlobSha1:blob(proofSourceBytes),sha256:sha(proofSourceBytes),head:'unverified-declared-head-is-not-authority'},
    image:{path:IMAGE,sha256:sha(imageBytes),visuallyInspected:true}};
  options.evidenceChange?.(evidence);
  const refs = evidence.map(([p,v])=>({path:p,sha256:sha(json(v))}));
  const crosswalkRef = refs.find(r=>r.path===CROSS), masterRef = refs.find(r=>r.path===MASTER);
  const approval = {type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-original-reviewer',evidenceRefs:refs};
  const current = {questionUid:UID,sourceArchiveFile:SOURCE,sourceOrdinal:1,sourceQuestionNo:'1',metadataApprovalType:'FINAL_QA',
    metaFoundationPackId:'MIDDLE2',metaFoundationPackVersion:'1.0.7',courseKey:'M2-1',curriculum:'2022',curriculumKey:'2022',
    problemTypeKey:'PT_SYNTHETIC',templateKey:'TPL_SYNTHETIC',rpmPrimaryId:question.rpmPrimaryId,rpmPrimaryPath:rpmPath,
    rpmL1:'unit',rpmL2:'subunit',rpmL3:'concept',rpmL4:'method',sourceFingerprint:sf(question),contentFingerprint:cf(question),
    metadataRevision:`meta-foundation:MIDDLE2@1.0.7:exam-final_qa-v2:${priorId}`,approvalEvidence:[priorPath]};
  const identity = {questionUid:UID,sourceArchiveFile:SOURCE,sourceOrdinal:1,sourceQuestionNo:'1',sourceFingerprint:sf(question)};
  const runtimeRecord = {...current,sourceIdentity:SOURCE+'#1'};
  const prior = {schemaVersion:'archive-reviewed-exam-meta-registration-v2',metadataRegistrationStatus:'REGISTERED',requestId:priorId,
    requestSha256:'a'.repeat(64),examUid:'exam-synthetic-solution',sourceArchiveFile:SOURCE,sourceBlobSha1:blob(oldBytes),sourceRawSha256:sha(oldBytes),
    scope:'PARTIAL_UIDS',partialUidCount:1,totalQuestions:1,expectedQuestionCount:2,approval,registryChanges:[],
    fingerprintRepairs:[{questionUid:UID,sourceOrdinal:1,metadataBefore:{sourceFingerprint:sf(beforeBank[0]),contentFingerprint:cf(beforeBank[0])},
      identityBefore:{sourceFingerprint:sf(beforeBank[0])},after:{sourceFingerprint:sf(question),contentFingerprint:cf(question)},
      rebind:{priorSourceBlobSha1:blob(beforeBytes),priorContentFingerprint:cf(beforeBank[0])}}],
    appliedRecords:[current],appliedIdentityRecords:[identity],runtimeRecords:[runtimeRecord],
    rpmPrimaryBindings:[{questionUid:UID,sourceOrdinal:1,recordId:question.rpmPrimaryId,crosswalkRef,masterRef,
      curriculum:'2022',scope:'M2-1',rpmPath,authorityUse:'RPM_PATH_PROVENANCE_ONLY',selectsPtTpl:false}]};
  options.priorChange?.(prior);
  for (const [p,v] of evidence) write(p,v);
  write('archive/exams/'+SOURCE,oldBytes); write(priorPath,prior);
  write(META,{records:[current]});write(IDS,{records:[identity]});write(RUNTIME,{packId:'MIDDLE2',status:'ACTIVE',records:[runtimeRecord]});
  git(root,'add','.');git(root,'commit','--quiet','-m','synthetic actual issued solution-only predecessor');
  const priorCommit = git(root,'rev-parse','HEAD');
  const bank = structuredClone(oldBank); bank[1].producer = 'current'; const bytes = source(bank);
  write('archive/exams/'+SOURCE,bytes);
  const currentCross = structuredClone(cross); currentCross.records[1].scope = 'M2-2';
  currentCross.records.push({id:'M2-RPM-ADDED',curriculum:'2022',scope:'M2-1',rpmPath});currentCross.summary.count=3;write(CROSS,currentCross);
  const priorRef = {path:priorPath,sha256:sha(json(prior))};
  const request = {schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'issued-solution-preserve',
    examUid:prior.examUid,sourceArchiveFile:SOURCE,expectedSourceBlobSha1:blob(bytes),expectedQuestionCount:2,scope:'PARTIAL_UIDS',registryChanges:[],
    approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:approval.approvedBy,evidenceRefs:[priorRef],sourceRebind:{priorReceiptRef:priorRef,
      historicalSolutionRpmEvidence:{schemaVersion:ISSUED_SOLUTION_RPM_HISTORY_SCHEMA,priorReceiptCommit:priorCommit,
        ...(options.withImage?{assetProofSourceCommit}:{})}}},
    items:[{questionUid:UID,sourceOrdinal:1,before:{},after:{},reason:'synthetic source-only preservation',evidenceRefs:[priorRef]}]};
  if(options.withImage){const ref={path:IMAGE,sha256:sha(imageBytes)};request.approval.evidenceRefs.push(ref);request.items[0].evidenceRefs.push(ref);}
  write('.archive-meta-register/inbox/'+request.requestId+'.json',request);git(root,'add','.');git(root,'commit','--quiet','-m','synthetic unrelated current changes');
  const input = () => ({root,envelope:request,bytes,bank,...readIssuedSolutionRpmCurrentState(root,request)});
  const nativeSource = () => ({root,bytes:oldBytes,blobSha1:prior.sourceBlobSha1,bank:oldBank,runtimeRecord});
  return {root,write,read,request,prior,priorPath,priorRef,priorCommit,oldBytes,oldBank,beforeBytes,beforeBank,bytes,bank,current,identity,
    runtimeRecord,input,nativeSource,proofPath,labelPath,taxonomy,imageBytes,assetProofSourceCommit};
}

test('solution history authenticates exact issued repair while allowing unrelated RPM row changes', t => {
  const f=fixture(t), live=fs.readFileSync(path.join(f.root,CROSS)), context=loadIssuedSolutionRpmHistory(f.input());
  assert.deepEqual(context.descriptor.unrelatedChangedRecordIds,['M2-RPM-UNRELATED']);
  assert.equal(context.descriptor.oldRowCount,2);assert.equal(context.descriptor.currentRowCount,3);
  assert.equal(context.descriptor.newMetadataApprovals,0);assert.deepEqual(context.descriptor.requiredNativeCursors,['ISSUED','ORIGINAL_SOLUTION']);
  assert.equal(context.descriptor.originalSolutionSourceBlobSha1,blob(f.beforeBytes));
  assert.equal(sha(readIssuedSolutionRpmHistoricalEvidence(context,f.prior,f.prior.rpmPrimaryBindings[0].crosswalkRef)),f.prior.rpmPrimaryBindings[0].crosswalkRef.sha256);
  assert.deepEqual(fs.readFileSync(path.join(f.root,CROSS)),live);
  for(const previous of [f.oldBank[0],f.beforeBank[0]]) assertIssuedSolutionRpmHistoricalLeaf({context,receipt:f.prior,current:f.current,
    identity:f.identity,ordinal:1,previous,nativeSource:f.nativeSource()});
});

test('historical solution authority is opt-in and opaque', t => {
  const f=fixture(t), request=structuredClone(f.request);delete request.approval.sourceRebind.historicalSolutionRpmEvidence;
  assert.equal(hasIssuedSolutionRpmHistory(request),false);assert.equal(loadIssuedSolutionRpmHistory({...f.input(),envelope:request}),null);
  assert.throws(()=>readIssuedSolutionRpmHistoricalEvidence({descriptor:{}},f.prior,f.priorRef),/authenticated original/);
  const c=loadIssuedSolutionRpmHistory(f.input());assert(Object.isFrozen(c));assert(Object.isFrozen(c.descriptor.priorReceiptRef));
  assert.throws(()=>{c.descriptor.newMetadataApprovals=1;},TypeError);
  assert.throws(()=>readIssuedSolutionRpmHistoricalEvidence(c,f.prior,f.priorRef),/authenticated original/);
});

test('dual native replay requires exact issued and original solution cursors', async t => {
  const f=fixture(t), context=loadIssuedSolutionRpmHistory(f.input()), seen=[];
  assert.equal(replayIssuedSolutionRpmHistoricalLeaf({context,nativeSource:f.nativeSource(),revalidateLeaf:leaf=>{
    assert.equal(leaf.nativeSource.issuedSolutionRpmHistoryContext,context);
    assertIssuedSolutionRpmHistoricalLeaf({context,receipt:f.prior,...leaf});seen.push(sf(leaf.previous));return f.priorPath;
  }}),true);
  assert.deepEqual(seen,[sf(f.oldBank[0]),sf(f.beforeBank[0])]);
  for(const failAt of [0,1]) await t.test('cursor '+failAt+' cannot be skipped',st=>{
    const x=fixture(st), c=loadIssuedSolutionRpmHistory(x.input());let n=0;
    assert.throws(()=>replayIssuedSolutionRpmHistoricalLeaf({context:c,nativeSource:x.nativeSource(),
      revalidateLeaf:()=>n++===failAt?null:x.priorPath}),/native cursor did not replay/);
  });
  assert.throws(()=>assertIssuedSolutionRpmHistoricalLeaf({context,receipt:f.prior,current:f.current,identity:f.identity,ordinal:1,
    previous:{...f.oldBank[0],answer:'b'},nativeSource:f.nativeSource()}),/original cursor/);
});

test('selected canonical definitions and original authority remain strict', async t => {
  const cases=[
    ['selected RPM changed',f=>{const d=f.read(CROSS);d.records[0].scope='M2-2';f.write(CROSS,d);},/selected RPM row/],
    ['old inventory removed',f=>{const d=f.read(CROSS);d.records.splice(1,1);f.write(CROSS,d);},/inventory removed/],
    ['duplicate RPM ID',f=>{const d=f.read(CROSS);d.records.push(d.records[0]);f.write(CROSS,d);},/duplicate or invalid/],
    ['authority header',f=>{const d=f.read(CROSS);d.status='PENDING';f.write(CROSS,d);},/authority changed/],
    ['LOCKED master',f=>{const d=f.read(MASTER);d.extra='changed';f.write(MASTER,d);},/non-RPM current evidence|master bytes/],
    ['selected taxonomy',f=>{const d=f.read(TAXONOMY);d.templates[0].status='HOLD';f.write(TAXONOMY,d);},/non-RPM current evidence|taxonomy evidence/],
    ['ordinary evidence',f=>f.write(f.proofPath,{role:'changed'}),/non-RPM current evidence/],
    ['parent label evidence',f=>f.write(f.labelPath,{schemaVersion:'changed'}),/non-RPM current evidence/],
    ['receipt raw bytes',f=>{const d=f.read(f.priorPath);d.approval.approvedBy='other';f.write(f.priorPath,d);},/receipt digest/]
  ];
  for(const [name,change,error]of cases)await t.test(name,st=>{const f=fixture(st);change(f);assert.throws(()=>loadIssuedSolutionRpmHistory(f.input()),error);});
});

test('request, selected state, source and ancestry changes cannot extend the original scope', async t => {
  const cases=[
    ['different author',f=>{f.request.approval.approvedBy='other';},/approval fields/],
    ['new semantic value',f=>{f.request.items[0].after.templateKey='NEW';},/value-free item/],
    ['new registry entry',f=>{f.request.registryChanges.push({path:'new'});},/exclusive M2S1/],
    ['another UID',f=>{f.request.items.push(structuredClone(f.request.items[0]));},/one selected UID/],
    ['unknown marker option',f=>{f.request.approval.sourceRebind.historicalSolutionRpmEvidence.bypass=true;},/explicit historical/],
    ['Q17 marker mixed',f=>{f.request.approval.sourceRebind.historicalRpmEvidence={};},/explicit historical/],
    ['wrong source digest',f=>{f.request.expectedSourceBlobSha1='1'.repeat(40);},/source snapshot/],
    ['metadata',f=>{const d=f.read(META);d.records[0].courseKey='M2-2';f.write(META,d);},/selected current metadata/],
    ['identity',f=>{const d=f.read(IDS);d.records[0].sourceFingerprint='changed';f.write(IDS,d);},/selected current metadata/],
    ['runtime',f=>{const d=f.read(RUNTIME);d.records[0].rpmL4='changed';f.write(RUNTIME,d);},/selected current metadata/]
  ];
  for(const [name,change,error]of cases)await t.test(name,st=>{const f=fixture(st);change(f);assert.throws(()=>loadIssuedSolutionRpmHistory(f.input()),error);});
  await t.test('truthfully hashed selected whole question change',st=>{
    const f=fixture(st), bank=structuredClone(f.bank);bank[0].answer='b';const bytes=source(bank);
    f.write('archive/exams/'+SOURCE,bytes);f.request.expectedSourceBlobSha1=blob(bytes);
    assert.throws(()=>loadIssuedSolutionRpmHistory({...f.input(),bytes,bank}),/selected whole question/);
  });
  await t.test('stale caller rows cannot hide live changes',st=>{
    const f=fixture(st),input=f.input(),d=f.read(META);d.records[0].courseKey='M2-2';f.write(META,d);
    assert.throws(()=>loadIssuedSolutionRpmHistory(input),/live current tables/);
  });
  await t.test('unrelated commit',st=>{
    const f=fixture(st), tree=git(f.root,'rev-parse',f.priorCommit+'^{tree}'), orphan=git(f.root,'commit-tree',tree,'-m','unrelated');
    f.request.approval.sourceRebind.historicalSolutionRpmEvidence.priorReceiptCommit=orphan;
    assert.throws(()=>loadIssuedSolutionRpmHistory(f.input()),/immutable Git input unavailable/);
  });
});

test('original issued repair must be the precise ordinary solution-only fingerprint rebind', async t => {
  const cases=[
    ['FP0 receipt',{priorChange:r=>{r.fingerprintRepairs=[];}},/solution-rebind RPM predecessor/],
    ['sourceReview repair',{priorChange:r=>{r.fingerprintRepairs[0].sourceReview={};}},/solution rebind shape/],
    ['native parent binding',{priorChange:r=>{r.nativeParentBindings=[{}];}},/solution-rebind RPM predecessor/],
    ['registry creation',{priorChange:r=>{r.registryChanges=[{}];}},/solution-rebind RPM predecessor/],
    ['wrong before fingerprint',{priorChange:r=>{r.fingerprintRepairs[0].metadataBefore.sourceFingerprint='0'.repeat(64);}},/fingerprints changed/],
    ['answer changed too',{originalFields:{answer:'b'}},/change only the solution/],
    ['missing solution change',{originalFields:{solution:'synthetic issued solution'}},/change only the solution/],
    ['issued renderer',{questionFields:{image:'https://example.invalid/figure.png'}},/local PNG|text-only/],
    ['original renderer',{originalFields:{image:'https://example.invalid/figure.png'}},/change only the solution|text-only/],
    ['native receipt disguised as label',{evidenceChange:refs=>{refs[3][1].schemaVersion='archive-reviewed-exam-meta-registration-v2';}},/typed parent-label/],
    ['inactive original PT',{evidenceChange:refs=>{refs[2][1].problemTypes[0].status='HOLD';}},/ACTIVE PT\/TPL/],
    ['wrong original template parent',{evidenceChange:refs=>{refs[2][1].templates[0].parentProblemTypeKey='OTHER';}},/ACTIVE PT\/TPL/]
  ];
  for(const [name,options,error]of cases)await t.test(name,st=>{const f=fixture(st,options);assert.throws(()=>loadIssuedSolutionRpmHistory(f.input()),error);});
});

function issued(f) {
  const receiptPath=RECEIPTS+f.request.requestId+'.json',approvalEvidence=[...f.current.approvalEvidence,receiptPath];
  const metadataRevision=`meta-foundation:MIDDLE2@1.0.7:exam-final_qa-v2:${f.request.requestId}`;
  const current={...f.current,approvalEvidence,metadataRevision},runtimeRecord={...f.runtimeRecord,approvalEvidence,metadataRevision};
  const receipt={schemaVersion:'archive-reviewed-exam-meta-registration-v2',requestId:f.request.requestId,requestSha256:sha(stable(f.request)),
    examUid:f.request.examUid,sourceArchiveFile:SOURCE,sourceBlobSha1:blob(f.bytes),sourceRawSha256:sha(f.bytes),approval:structuredClone(f.request.approval),
    metadataRegistrationStatus:'REGISTERED',scope:'PARTIAL_UIDS',partialUidCount:1,totalQuestions:1,expectedQuestionCount:2,registryChanges:[],fingerprintRepairs:[],
    newMetadataApprovals:0,preservedMetadataApprovals:1,appliedRecords:[current],appliedIdentityRecords:[f.identity],runtimeRecords:[runtimeRecord]};
  f.write(receiptPath,receipt);
  return {receipt,receiptPath,input:{root:f.root,envelope:receipt,bytes:f.bytes,bank:f.bank,current,identity:f.identity,runtimeRecord}};
}

test('issued child and post-write selector preserve exact original authority and values', async t => {
  const f=fixture(t),before=loadIssuedSolutionRpmHistory(f.input()).descriptor,a=issued(f);
  assert.deepEqual(loadIssuedSolutionRpmHistory(a.input).descriptor,before);
  f.write(META,{records:[a.input.current]});f.write(RUNTIME,{packId:'MIDDLE2',status:'ACTIVE',records:[a.input.runtimeRecord]});
  assert.deepEqual(loadIssuedSolutionRpmHistory(f.input()).descriptor,before);
  const cases=[
    ['new approval',r=>{r.newMetadataApprovals=1;}],['preservation count',r=>{r.preservedMetadataApprovals=2;}],
    ['semantic value',r=>{r.appliedRecords[0].templateKey='NEW';}],['runtime value',r=>{r.runtimeRecords[0].courseKey='M2-2';}],
    ['identity',r=>{r.appliedIdentityRecords[0].sourceFingerprint='changed';}],['revision',r=>{r.appliedRecords[0].metadataRevision+='-changed';}],
    ['evidence',r=>{r.appliedRecords[0].approvalEvidence.pop();}]
  ];
  for(const [name,change]of cases)await t.test(name,st=>{
    const x=fixture(st),b=issued(x);change(b.receipt);x.write(b.receiptPath,b.receipt);
    assert.throws(()=>loadIssuedSolutionRpmHistory({...b.input,current:b.receipt.appliedRecords[0],identity:b.receipt.appliedIdentityRecords[0],
      runtimeRecord:b.receipt.runtimeRecords[0]}),/original authority or values/);
  });
});

test('validated history cannot survive later selected drift', t => {
  const f=fixture(t),context=loadIssuedSolutionRpmHistory(f.input()),d=f.read(CROSS);d.records[0].scope='M2-2';f.write(CROSS,d);
  assert.throws(()=>readIssuedSolutionRpmHistoricalEvidence(context,f.prior,f.prior.rpmPrimaryBindings[0].crosswalkRef),/selected RPM row/);
  assert.throws(()=>replayIssuedSolutionRpmHistoricalLeaf({context,nativeSource:f.nativeSource(),revalidateLeaf:()=>f.priorPath}),/selected RPM row/);
});

test('one original approved PNG binds the actual proof ancestor, issued main and current bytes', t => {
  const f=fixture(t,{withImage:true}),context=loadIssuedSolutionRpmHistory(f.input()),image=context.descriptor.selectedImageContinuity;
  assert.equal(image.assetProofSourceCommit,f.assetProofSourceCommit);assert.equal(image.proofPublishedCommit,f.priorCommit);
  assert.equal(image.assetRef.path,IMAGE);assert.equal(image.assetRef.sha256,sha(f.imageBytes));
  assert.equal(image.assetGitBlobSha1,blob(f.imageBytes));assert.equal(image.originalSolutionCursorImagePathUnchanged,true);
  const a=issued(f);assert.deepEqual(loadIssuedSolutionRpmHistory(a.input).descriptor.selectedImageContinuity,image);
  const original=fs.readFileSync(path.join(f.root,IMAGE));f.write(IMAGE,Buffer.from('changed PNG'));
  assert.throws(()=>readIssuedSolutionRpmHistoricalEvidence(context,f.prior,f.prior.rpmPrimaryBindings[0].crosswalkRef),/PNG bytes changed/);
  assert.notDeepEqual(fs.readFileSync(path.join(f.root,IMAGE)),original);
});

test('PNG history does not allow changed assets, unbound commits or extra renderer carriers', async t => {
  const cases=[
    ['image proof commit missing',f=>{delete f.request.approval.sourceRebind.historicalSolutionRpmEvidence.assetProofSourceCommit;},/image-proof source commit/],
    ['nonancestor image proof commit',f=>{const tree=git(f.root,'rev-parse',f.assetProofSourceCommit+'^{tree}');
      f.request.approval.sourceRebind.historicalSolutionRpmEvidence.assetProofSourceCommit=git(f.root,'commit-tree',tree,'-m','unrelated');},/immutable Git input unavailable/],
    ['changed current PNG',f=>f.write(IMAGE,Buffer.from('changed PNG')),/PNG bytes changed/],
    ['PNG ref missing at item',f=>{f.request.items[0].evidenceRefs=f.request.items[0].evidenceRefs.filter(r=>r.path!==IMAGE);},/bind request approval and item/],
    ['PNG ref missing at approval',f=>{f.request.approval.evidenceRefs=f.request.approval.evidenceRefs.filter(r=>r.path!==IMAGE);},/bind request approval and item/],
    ['PNG ref wrong hash',f=>{f.request.items[0].evidenceRefs.find(r=>r.path===IMAGE).sha256='0'.repeat(64);},/bind request approval and item/],
    ['asset symlink',f=>{fs.renameSync(path.join(f.root,IMAGE),path.join(f.root,IMAGE+'.original'));fs.symlinkSync(path.join(f.root,IMAGE+'.original'),path.join(f.root,IMAGE));},/symlink evidence input/]
  ];
  for(const[name,change,error]of cases)await t.test(name,st=>{const f=fixture(st,{withImage:true});change(f);assert.throws(()=>loadIssuedSolutionRpmHistory(f.input()),error);});
  for(const[name,options,error]of[
    ['independent source condition changed',{proofSourceFields:{answer:'b'}},/non-solution student fields/],
    ['independent image hash changed',{evidenceChange:refs=>{refs[4][1].image.sha256='0'.repeat(64);}},/PNG bytes changed/],
    ['independent source digest changed',{evidenceChange:refs=>{refs[4][1].source.sha256='0'.repeat(64);}},/independent proof source/],
    ['independent proof wrong UID',{evidenceChange:refs=>{refs[4][1].questionUid='other';}},/one original issued independent PNG/],
    ['extra solution image',{questionFields:{solutionImage:'assets/images/synthetic-solution-history/solution.png'}},/text-only/],
    ['inline figure',{questionFields:{content:'<img src="assets/images/synthetic-solution-history/q1.png">'}},/renderer reference/],
    ['remote image',{questionFields:{image:'https://example.invalid/q1.png'}},/local PNG/]
  ])await t.test(name,st=>{const f=fixture(st,{withImage:true,...options});assert.throws(()=>loadIssuedSolutionRpmHistory(f.input()),error);});
});
