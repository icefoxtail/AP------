import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {fixture,CROSS,MASTER,TAXONOMY,META,IDS,RUNTIME,IMAGE,sha,blob,git} from './fixtures/native-issued-child-continuity-fixture.mjs';
import {loadIssuedChildContinuity,readIssuedChildContinuity} from '../archive/tools/meta-foundation/native-issued-child-continuity.mjs';
import {loadIssuedRpmHistory,loadIssuedRpmChildContinuity,readIssuedRpmHistoricalEvidence,replayIssuedRpmHistoricalLeaf} from '../archive/tools/meta-foundation/native-issued-rpm-history.mjs';
import {loadIssuedSolutionRpmHistory,loadIssuedSolutionRpmChildContinuity,readIssuedSolutionRpmHistoricalEvidence,replayIssuedSolutionRpmHistoricalLeaf} from '../archive/tools/meta-foundation/native-issued-solution-rpm-history.mjs';

function history(f,token=loadIssuedChildContinuity(f.input())) {
 const input=f.input(),args={childContext:token,root:f.root,envelope:f.child,bytes:f.bytes,bank:f.bank,
  current:input.current,identity:input.identity,runtimeRecord:input.nativeSource.runtimeRecord};
 return f.kind==='SOLUTION_REBIND_FP1'?loadIssuedSolutionRpmChildContinuity(args):loadIssuedRpmChildContinuity(args);
}
for(const kind of ['RPM_UNCHANGED_FP0','SOLUTION_REBIND_FP1']) {
 test(`${kind}: actual child is authenticated without mutating receipt or introducing a request`,t=>{
  const f=fixture(t,{kind}),before=f.raw(f.childPath),token=loadIssuedChildContinuity(f.input());
  assert.equal(token.descriptor.kind,kind);assert.equal(token.descriptor.childPublishedCommit,f.childCommit);
  assert.notEqual(f.child.approval.approvedBy,f.prior.approval.approvedBy);
  assert.equal(f.child.appliedRecords[0].metadataApprovedBy,f.prior.appliedRecords[0].metadataApprovedBy);
  assert.equal(Object.hasOwn(f.child.approval.sourceRebind,'historicalRpmEvidence'),false);
  assert.equal(Object.hasOwn(f.child.approval.sourceRebind,'historicalSolutionRpmEvidence'),false);
  const oldLoader=kind==='SOLUTION_REBIND_FP1'?loadIssuedSolutionRpmHistory:loadIssuedRpmHistory;
  assert.equal(oldLoader({root:f.root,envelope:f.child}),null);
  const h=history(f,token),reader=kind==='SOLUTION_REBIND_FP1'?readIssuedSolutionRpmHistoricalEvidence:readIssuedRpmHistoricalEvidence;
  const ref=f.prior.rpmPrimaryBindings[0].crosswalkRef;
  assert.equal(sha(reader(h,f.prior,ref)),ref.sha256);assert.notEqual(sha(f.raw(CROSS)),ref.sha256);
  const replay=kind==='SOLUTION_REBIND_FP1'?replayIssuedSolutionRpmHistoricalLeaf:replayIssuedRpmHistoricalLeaf,calls=[];
  assert.equal(replay({context:h,nativeSource:f.input().nativeSource,revalidateLeaf:leaf=>{calls.push(leaf);return f.priorPath;}}),true);
  assert.equal(calls.length,2);assert.equal(calls[0].nativeSource.blobSha1,blob(f.oldBytes));
  assert.deepEqual(calls[0].previous,f.oldBank[0]);
  assert.deepEqual(calls[1].previous,kind==='SOLUTION_REBIND_FP1'?f.beforeBank[0]:f.bank[0]);
  assert.deepEqual(f.raw(f.childPath),before);assert(!fs.existsSync(path.join(f.root,'.archive-meta-register/inbox')));
 });
 test(`${kind}: original native replay must accept both required cursors`,t=>{
  const f=fixture(t,{kind}),h=history(f),replay=kind==='SOLUTION_REBIND_FP1'?replayIssuedSolutionRpmHistoricalLeaf:replayIssuedRpmHistoricalLeaf;
  let calls=0;assert.throws(()=>replay({context:h,nativeSource:f.input().nativeSource,revalidateLeaf:()=>++calls===1?f.priorPath:null}),/cursor did not replay/);
  assert.equal(calls,2);
 });
}

test('absent deterministic sidecar leaves ordinary strict native behavior unchanged',t=>{
 const f=fixture(t);fs.unlinkSync(path.join(f.root,f.sidecarPath));assert.equal(loadIssuedChildContinuity(f.input()),null);
});
test('caller-created and cross-kind contexts cannot grant historical options',t=>{
 const f=fixture(t),token=loadIssuedChildContinuity(f.input());
 assert.throws(()=>readIssuedChildContinuity({descriptor:token.descriptor}),/authenticated child context required/);
 assert.throws(()=>readIssuedChildContinuity(token,{kind:'SOLUTION_REBIND_FP1'}),/child context mismatch/);
 assert.throws(()=>history(f,{descriptor:token.descriptor}),/authenticated child context required/);
 const details=readIssuedChildContinuity(token);details.sidecar.sourceOrdinal=9;
 assert.equal(readIssuedChildContinuity(token).sidecar.sourceOrdinal,1);
});
for(const key of ['issuedRpmHistoryContext','issuedSolutionRpmHistoryContext','issuedChildContinuityContext'])
 test(`mixed input ${key} is rejected`,t=>{const f=fixture(t),input=f.input();input.nativeSource[key]={};assert.throws(()=>loadIssuedChildContinuity(input),/mixed historical contexts/);});

const sidecarCases=[
 ['unknown field',s=>{s.allowOldEvidence=true;}],
 ['wrong schema',s=>{s.schemaVersion='unknown';}],
 ['wrong kind',s=>{s.kind='ALLOW_ANY_HISTORY';}],
 ['wrong UID',s=>{s.questionUid='other';}],
 ['wrong ordinal',s=>{s.sourceOrdinal=2;}],
 ['wrong denominator',s=>{s.expectedQuestionCount=3;}],
 ['wrong source',s=>{s.sourceArchiveFile='original/middle/m2/1final/other.js';}],
 ['wrong child digest',s=>{s.childReceiptRef.sha256='0'.repeat(64);}],
 ['wrong prior digest',s=>{s.priorReceiptRef.sha256='0'.repeat(64);}],
 ['wrong child path',s=>{s.childReceiptRef.path=s.priorReceiptRef.path;}],
 ['path escape',s=>{s.priorReceiptRef.path='../outside.json';}],
 ['wrong published commit',s=>{s.childPublishedCommit='1'.repeat(40);}],
 ['unknown nested ref field',s=>{s.childReceiptRef.skip=true;}],
 ['unexpected FP0 image proof',s=>{s.imageProof={sourceCommit:'1'.repeat(40),assetRef:{path:IMAGE,sha256:'0'.repeat(64)}};}]
];
for(const[name,change]of sidecarCases)test(`sidecar rejects ${name}`,t=>{const f=fixture(t),s=structuredClone(f.sidecar);change(s);f.write(f.sidecarPath,s);assert.throws(()=>loadIssuedChildContinuity(f.input()),/issued child continuity:/);});

const childCases=[
 ['new approval',c=>{c.newMetadataApprovals=1;}],
 ['wrong preservation count',c=>{c.preservedMetadataApprovals=2;}],
 ['registry change',c=>{c.registryChanges=[{op:'ADD'}];}],
 ['fingerprint repair',c=>{c.fingerprintRepairs=[{sourceOrdinal:1}];}],
 ['native parent change',c=>{c.nativeParentBindings=[{}];}],
 ['registration mode',c=>{c.registrationMode='CUSTOM';}],
 ['whole-exam scope',c=>{c.scope='WHOLE_EXAM';}],
 ['authority field change',c=>{c.appliedRecords[0].metadataApprovedBy='different-reviewer';}],
 ['semantic value change',c=>{c.appliedRecords[0].templateKey='TPL_OTHER';}],
 ['runtime value change',c=>{c.runtimeRecords[0].rpmPrimaryId='M2-RPM-OTHER';}],
 ['identity change',c=>{c.appliedIdentityRecords[0].sourceFingerprint='0'.repeat(64);}],
 ['additional selected UID',c=>{c.appliedRecords.push({...c.appliedRecords[0],questionUid:'other'});}],
 ['arbitrary approval evidence append',c=>{c.appliedRecords[0].approvalEvidence.push('another-authority');}],
 ['wrong revision',c=>{c.appliedRecords[0].metadataRevision='arbitrary';}],
 ['wrapper renderer authority',c=>{c.approval.rendererPreservation={};}]
];
for(const[name,change]of childCases)test(`published child rejects ${name}`,t=>{const f=fixture(t,{childChange:change});assert.throws(()=>loadIssuedChildContinuity(f.input()),/issued child continuity:/);});

test('known but unrelated Git commit cannot authenticate a published prior',t=>{
 const f=fixture(t);const orphan=git(f.root,'commit-tree','HEAD^{tree}','-m','synthetic unrelated history');
 f.write(f.sidecarPath,{...f.sidecar,priorPublishedCommit:orphan});assert.throws(()=>loadIssuedChildContinuity(f.input()),/immutable Git input unavailable/);
});
test('unpublished child cannot be treated as an issued Git receipt',t=>{
 const f=fixture(t);f.write(f.sidecarPath,{...f.sidecar,childPublishedCommit:f.priorCommit});assert.throws(()=>loadIssuedChildContinuity(f.input()),/published regular file required/);
});
test('a sidecar symlink is rejected',t=>{
 const f=fixture(t),p=path.join(f.root,f.sidecarPath);fs.renameSync(p,p+'.data');fs.symlinkSync(p+'.data',p);
 assert.throws(()=>loadIssuedChildContinuity(f.input()),/symlink input/);
});
test('the actual child receipt cannot be replaced by a symlink',t=>{
 const f=fixture(t),p=path.join(f.root,f.childPath);fs.renameSync(p,p+'.data');fs.symlinkSync(p+'.data',p);
 assert.throws(()=>loadIssuedChildContinuity(f.input()),/symlink input/);
});
test('supplied native source state cannot differ from the actual source',t=>{
 const f=fixture(t),input=f.input();input.nativeSource.bank=structuredClone(f.bank);input.nativeSource.bank[0].content+='changed';
 assert.throws(()=>loadIssuedChildContinuity(input),/supplied current source changed/);
});
test('current HEAD override cannot replace the observed checkout',t=>{
 const f=fixture(t);assert.throws(()=>loadIssuedChildContinuity({...f.input(),headSha:f.priorCommit}),/current HEAD mismatch/);
});
for(const[p,field]of [[META,'metadataApprovedBy'],[IDS,'sourceFingerprint'],[RUNTIME,'metadataRevision']])
 test(`a retained token rejects changed live ${p}`,t=>{
  const f=fixture(t),token=loadIssuedChildContinuity(f.input()),doc=f.read(p);doc.records[0][field]='changed';f.write(p,doc);
  assert.throws(()=>readIssuedChildContinuity(token),/live selected tables changed/);
 });
test('a retained token rejects changed sidecar bytes',t=>{
 const f=fixture(t),token=loadIssuedChildContinuity(f.input());f.write(f.sidecarPath,Buffer.concat([f.raw(f.sidecarPath),Buffer.from('\n')]));
 assert.throws(()=>readIssuedChildContinuity(token),/sidecar bytes changed/);
});
test('a retained token rejects changed child receipt bytes',t=>{
 const f=fixture(t),token=loadIssuedChildContinuity(f.input());f.write(f.childPath,Buffer.concat([f.raw(f.childPath),Buffer.from('\n')]));
 assert.throws(()=>readIssuedChildContinuity(token),/receipt bytes changed/);
});
test('a retained token rejects changed source bytes',t=>{
 const f=fixture(t),token=loadIssuedChildContinuity(f.input());f.write('archive/exams/'+f.child.sourceArchiveFile,Buffer.concat([f.bytes,Buffer.from('\n')]));
 assert.throws(()=>readIssuedChildContinuity(token),/live source changed/);
});
test('unrelated current table rows may advance while selected rows remain exact',t=>{
 const f=fixture(t),token=loadIssuedChildContinuity(f.input());
 for(const p of [META,IDS,RUNTIME]){const doc=f.read(p);doc.records.push({questionUid:'unselected',state:'changed'});f.write(p,doc);}
 assert.equal(readIssuedChildContinuity(token).sidecar.questionUid,f.sidecar.questionUid);
});
test('FP0 child entry retains append-only validation for every original RPM row',t=>{
 const f=fixture(t),cross=f.read(CROSS);cross.records[1].scope='M2-2';f.write(CROSS,cross);
 assert.throws(()=>history(f),/old RPM row removed or changed/);
});
test('FP1 child entry permits an unrelated RPM update while selected RPM stays exact',t=>{
 const f=fixture(t,{kind:'SOLUTION_REBIND_FP1'}),cross=f.read(CROSS);cross.records[1].scope='M2-2';f.write(CROSS,cross);
 assert.deepEqual(history(f).descriptor.unrelatedChangedRecordIds,['M2-RPM-UNRELATED']);
});
test('FP1 child entry rejects a changed selected RPM row',t=>{
 const f=fixture(t,{kind:'SOLUTION_REBIND_FP1'}),cross=f.read(CROSS);cross.records[0].scope='M2-2';f.write(CROSS,cross);
 assert.throws(()=>history(f),/selected RPM row changed/);
});
test('the original LOCKED master remains exact in the child route',t=>{
 const f=fixture(t),master=f.read(MASTER);master.authorityStatus='DRAFT';f.write(MASTER,master);
 assert.throws(()=>history(f),/non-RPM current evidence changed|LOCKED master/);
});
test('FP1 child entry rejects changed ACTIVE taxonomy evidence',t=>{
 const f=fixture(t,{kind:'SOLUTION_REBIND_FP1'}),taxonomy=f.read(TAXONOMY);taxonomy.templates[0].status='DRAFT';f.write(TAXONOMY,taxonomy);
 assert.throws(()=>history(f),/non-RPM current evidence changed|taxonomy/);
});
test('FP1 child entry requires the original approved PNG bytes',t=>{
 const f=fixture(t,{kind:'SOLUTION_REBIND_FP1'});f.write(IMAGE,Buffer.from('changed synthetic PNG'));
 assert.throws(()=>history(f),/original approved PNG bytes changed/);
});
test('a retained FP1 historical context rechecks current child state',t=>{
 const f=fixture(t,{kind:'SOLUTION_REBIND_FP1'}),h=history(f),doc=f.read(META);doc.records[0].reviewStatus='review_required';f.write(META,doc);
 assert.throws(()=>readIssuedSolutionRpmHistoricalEvidence(h,f.prior,f.prior.rpmPrimaryBindings[0].crosswalkRef),/live selected tables changed/);
});
test('FP1 sidecar must name the exact published independent PNG proof',t=>{
 const f=fixture(t,{kind:'SOLUTION_REBIND_FP1'}),sidecar=structuredClone(f.sidecar);sidecar.imageProof.assetRef.sha256='0'.repeat(64);f.write(f.sidecarPath,sidecar);
 assert.throws(()=>history(f),/exact original PNG must bind/);
});
