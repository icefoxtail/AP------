import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {auditedCcAppendFixture} from './helpers/audited-cc-append-fixture.mjs';
import {registerReviewedExamV2} from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {loadActiveMetaRegistry} from '../archive/tools/meta-foundation/active-registry.mjs';
import {auditCcBindingPath,verifiedAuditCcSourcePrecedence,auditCcSourceFieldIsVerified} from '../archive/tools/meta-foundation/audited-cross-concept-append.mjs';
const META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json',RUNTIME='archive/data/meta-foundation/runtime/new-course-v1.json';
function fixture(t){
  const f=auditedCcAppendFixture(t);
  registerReviewedExamV2({root:f.root,request:f.request,write:true});return f;
}
function precedence(f){return verifiedAuditCcSourcePrecedence({root:f.root,source:f.request.sourceArchiveFile,
  bytes:fs.readFileSync(path.join(f.root,f.sourcePath)),bank:structuredClone(f.bank),metadataRows:f.read(META).records,identityRows:f.read(IDENTITY).records});}

test('catalog precedence revalidates the full two-authority cohort and leaves aligned source values unchanged',t=>{
  const f=fixture(t),source=fs.readFileSync(path.join(f.root,f.sourcePath)),before=f.read(META),p=precedence(f);
  assert.equal(p.size,3);
  for(const row of before.records){
    const q=f.bank[row.sourceOrdinal-1];
    assert.equal(p.has(row.questionUid),true);
    assert.equal(auditCcSourceFieldIsVerified(p,row.questionUid,'templateKey','OTHER_SOURCE',row.templateKey),false);
    assert.equal(auditCcSourceFieldIsVerified(p,row.questionUid,'templateKey',q.templateKey,'UNAPPROVED'),false);
    assert.equal(auditCcSourceFieldIsVerified(p,row.questionUid,'templateKey','TPL_UNAPPROVED',row.templateKey),false);
    if(row.sourceOrdinal===f.ordinal)assert.equal(p.get(row.questionUid).has('crossConceptKeys'),false,'the selected CC already agrees with source; no override is needed');
  }
  assert.deepEqual(f.read(META),before);assert.deepEqual(fs.readFileSync(path.join(f.root,f.sourcePath)),source);
});

const invalid=[
  ['missing durable sidecar',f=>fs.unlinkSync(path.join(f.root,auditCcBindingPath(f.request.requestId)))],
  ['forged durable sidecar',f=>{const p=auditCcBindingPath(f.request.requestId),d=f.read(p);d.requestSnapshot.expectedQuestionCount=1;f.put(p,d);}],
  ['missing original audit',f=>fs.unlinkSync(path.join(f.root,f.priorPath))],
  ['forged original audit TPL',f=>{const d=f.read(f.priorPath);d.appliedRecords[2].templateKey='TPL_SOURCE_LEGACY';f.put(f.priorPath,d);}],
  ['changed non-selected metadata TPL',f=>{const d=f.read(META);d.records[2].templateKey='TPL_UNAPPROVED';f.put(META,d);}],
  ['changed non-selected runtime CC',f=>{const d=f.read(RUNTIME);d.records[2].crossConceptKeys=['CC_UNAPPROVED'];f.put(RUNTIME,d);}],
  ['changed non-selected identity',f=>{const d=f.read(IDENTITY);d.records[2].sourceFingerprint='f'.repeat(64);f.put(IDENTITY,d);}],
  ['changed non-selected source metadata',f=>{f.bank[2].tagStatus='UNREVIEWED';f.writeBank();}],
  ['changed non-selected renderer',f=>f.put('archive/assets/audit-cc-other.svg','<svg xmlns="http://www.w3.org/2000/svg"><text>changed</text></svg>')],
  ['extra current source UID',f=>{const d=f.read(META);d.records.push({...d.records[2],questionUid:'outside',sourceOrdinal:4});f.put(META,d);}],
  ['missing current source UID',f=>{const d=f.read(META);d.records.pop();f.put(META,d);}],
  ['inactive runtime pack',f=>{const d=f.read(RUNTIME);d.status='HOLD';f.put(RUNTIME,d);}],
  ['runtime container version mismatch',f=>{const d=f.read(RUNTIME);d.packVersion='999.0.0';f.put(RUNTIME,d);}],
  ['ordinary revision claim without component proof',f=>{fs.unlinkSync(path.join(f.root,auditCcBindingPath(f.request.requestId)));const d=f.read(META);for(const row of d.records){delete row.crossConceptApprovalComponents;row.approvalEvidence=[];row.metadataRevision='meta-foundation:NEW_COURSE@1.0.0:exam-meta_pipeline_audit-v2:unverified';}f.put(META,d);}],
];
for(const[name,mutate]of invalid)test('catalog retains conflicts after '+name+', including after an earlier valid verification',t=>{
  const f=fixture(t);assert.equal(precedence(f).size,3);mutate(f);assert.equal(precedence(f).size,0);
});

test('a mismatched source or caller row cannot borrow a different full audit projection',t=>{
  const f=fixture(t),args={root:f.root,source:f.request.sourceArchiveFile,bytes:fs.readFileSync(path.join(f.root,f.sourcePath)),bank:structuredClone(f.bank),metadataRows:f.read(META).records,identityRows:f.read(IDENTITY).records};
  assert.equal(verifiedAuditCcSourcePrecedence({...args,source:'original/middle/m2/2mid/other.js'}).size,0);
  args.metadataRows[2].templateKey='TPL_UNAPPROVED';assert.equal(verifiedAuditCcSourcePrecedence(args).size,0);
});

test('missing ACTIVE pack and container version cannot compare equal as absent values',t=>{
  const f=fixture(t);assert.equal(precedence(f).size,3);
  const indexPath='archive/data/meta-foundation/canonical/registry_index.json',index=f.read(indexPath);
  index.activePacks=index.activePacks.filter(p=>p.id!=='NEW_COURSE');f.put(indexPath,index);
  const runtime=f.read(RUNTIME);delete runtime.packVersion;f.put(RUNTIME,runtime);
  const registry=loadActiveMetaRegistry(f.root);
  assert.equal(registry.status,'ACTIVE','the missing-owner boundary is distinct from file/hash validation');
  assert.equal(registry.activePacks.has('NEW_COURSE'),false);
  assert.equal(precedence(f).size,0);
});
