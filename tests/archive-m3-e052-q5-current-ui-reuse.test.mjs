import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {currentM3Q5UiRefs,assertM3Q5CurrentUiDocuments} from '../archive/tools/meta-foundation/reviewed-m3-e052-q5-complete-given.mjs';

// Published UI metadata only. --actual-native adds the original, read-only
// Q5 issued-authority resolver; it does not write, register or change a source.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const clone=x=>JSON.parse(JSON.stringify(x));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
const cache=new Map();
function git(args){const env={...process.env};delete env.GIT_NO_LAZY_FETCH;
 return execFileSync('git',['-C',root,...args],{env,maxBuffer:8*1024*1024,timeout:60000,stdio:['ignore','pipe','pipe']});}
function immutable(ref){
 const key=JSON.stringify(ref);if(cache.has(key))return cache.get(key);
 assert.match(ref.commit,/^[a-f0-9]{40}$/);assert.match(ref.gitBlobSha1,/^[a-f0-9]{40}$/);assert.match(ref.sha256,/^[a-f0-9]{64}$/);
 assert.ok(Number.isSafeInteger(ref.bytes)&&ref.bytes>0&&ref.bytes<4*1024*1024);
 assert.ok(typeof ref.path==='string'&&!ref.path.startsWith('/')&&!/[\\\x00-\x1f]/.test(ref.path)&&ref.path.split('/').every(x=>x&&x!=='.'&&x!=='..'));
 const tree=git(['ls-tree','-z',ref.commit,'--',ref.path]).toString();
 assert.equal(tree,'100644 blob '+ref.gitBlobSha1+'\t'+ref.path+'\0');
 const raw=git(['cat-file','blob',ref.gitBlobSha1]);
 assert.equal(raw.length,ref.bytes);assert.equal(sha(raw),ref.sha256);assert.equal(blob(raw),ref.gitBlobSha1);
 cache.set(key,raw);return raw;
}
function fixture(){
 const c=currentM3Q5UiRefs();
 return {prior:JSON.parse(immutable(c.priorTechnicalRef)),visual:JSON.parse(immutable(c.priorVisualRef)),
  technical:JSON.parse(immutable(c.technicalRef)),currentVisual:JSON.parse(immutable(c.visualRef)),
  witness:JSON.parse(immutable(c.witnessRef)),transport:JSON.parse(immutable(c.framesRef).toString().trim().split('\n')[0]).manifest};
}
test('Q5 exact published current display keeps original visual records and explicit provenance delta',()=>{
 const f=fixture();assert.equal(assertM3Q5CurrentUiDocuments(f),true);
 assert.deepEqual(f.currentVisual.records,f.visual.records);
 assert.equal(f.currentVisual.captureProvenanceDelta.entireCaptureEqual,false);
 assert.equal(f.currentVisual.captureProvenanceDelta.measurementAndCoverageFieldsChanged,0);
 assert.equal(f.currentVisual.newNativeApproval,0);
});
test('Q5 exported pin copy cannot change the closed runtime contract',()=>{
 const c=currentM3Q5UiRefs();c.technicalRef.sha256='0'.repeat(64);c.code[5].gitBlobSha1='0'.repeat(40);
 assert.notEqual(currentM3Q5UiRefs().technicalRef.sha256,c.technicalRef.sha256);
 assert.notEqual(currentM3Q5UiRefs().code[5].gitBlobSha1,c.code[5].gitBlobSha1);
 assert.equal(assertM3Q5CurrentUiDocuments(fixture()),true);
});
const negatives=[
 ['another checkout',f=>f.technical.checkoutCommit='0'.repeat(40)],
 ['mismatched event SHA',f=>f.technical.checkout.githubEventCommit='0'.repeat(40)],
 ['PR relabelling',f=>f.transport.execution.eventName='pull_request'],
 ['another branch',f=>f.transport.execution.ref='refs/heads/main'],
 ['another repository',f=>f.transport.execution.repository='fork/AP------'],
 ['another run',f=>f.transport.execution.runId='1'],
 ['another job',f=>f.transport.execution.job='other'],
 ['raw technical transport digest',f=>f.transport.technicalJsonSha256='0'.repeat(64)],
 ['unaccepted witness',f=>f.witness.decision='PENDING'],
 ['witness capture head',f=>f.witness.actualCapture.head='0'.repeat(40)],
 ['witness prior authority',f=>f.witness.priorEvidence.q5.technical.sha256='0'.repeat(64)],
 ['current visual schema',f=>f.currentVisual.schemaVersion='archive-independent-other-v1'],
 ['current visual scope',f=>f.currentVisual.scope='ALL_M3'],
 ['reviewer substitution',f=>f.currentVisual.reviewer='new-reviewer'],
 ['new Native approval',f=>f.currentVisual.newNativeApproval=1],
 ['new semantic approval',f=>f.currentVisual.newSemanticApproval=1],
 ['new four-slot vector',f=>f.currentVisual.newFourSlotVector=1],
 ['current live guard removed',f=>f.currentVisual.currentFullLiveCodeFontAssetGuardsRequired=false],
 ['claimed code equivalence',f=>f.currentVisual.sharedRendererCodeEquivalenceClaimed=true],
 ['prior visual record changed',f=>f.visual.records[0].decision='PENDING'],
 ['PNG declaration changed',f=>f.technical.screenshotArtifacts[0].sha256='0'.repeat(64)],
 ['current selected source changed',f=>f.technical.items[0].sourceRef.sha256='0'.repeat(64)],
 ['current selected asset changed',f=>f.technical.items[0].assetRef.sha256='0'.repeat(64)],
 ['mirrored asset changed',f=>f.technical.mirroredAssets[0].sha256='0'.repeat(64)],
 ['another UID',f=>f.technical.results[0].questionUid='qid_v1_'+'0'.repeat(64)],
 ['another source ordinal',f=>f.technical.results[0].sourceOrdinal=12],
 ['changed viewport',f=>f.technical.results[0].viewport.width++],
 ['changed capture geometry',f=>f.technical.results[0].capture.content.height++],
 ['changed image geometry',f=>f.technical.results[0].geometry.naturalWidth++],
 ['changed capture PNG',f=>f.technical.results[0].screenshots[0].sha256='0'.repeat(64)],
 ['missing provenance reference',f=>f.technical.results[0].capture.equalSlotEvidence.pop()],
 ['foreign provenance commit',f=>f.technical.results[0].capture.equalSlotEvidence[0].commit='0'.repeat(40)],
 ['source evidence bytes changed',f=>f.technical.results[0].capture.equalSlotEvidence[0].sha256='0'.repeat(64)],
 ['producer provenance rollback',f=>f.technical.results[0].capture.equalSlotEvidence[3]=clone(f.prior.results[0].capture.equalSlotEvidence[3])],
 ['missing live font response',f=>f.technical.studentFontResources.pop()],
 ['changed live font bytes',f=>f.technical.studentFontResources[0].sha256='0'.repeat(64)],
 ['new live font alias',f=>f.technical.studentFontResources[1].resourceId='0'.repeat(64)],
 ['unaccounted case font',f=>f.technical.results[0].technical.fontResourceIds.push('0'.repeat(64))],
 ['changed font readiness',f=>f.technical.results[0].technical.fontReadiness.weights[0].loadedFaces++],
 ['capture binding changed',f=>f.currentVisual.captureBindings[0].currentCaptureSha256='0'.repeat(64)],
 ['whole capture falsely called identical',f=>f.currentVisual.captureBindings[0].wholeCaptureExactlyReused=true],
 ['extra provenance drift',f=>f.currentVisual.captureProvenanceDelta.measurementAndCoverageFieldsChanged=1]
];
for(const[name,change]of negatives)test('Q5 current display refuses '+name,()=>{const f=fixture();change(f);assert.throws(()=>assertM3Q5CurrentUiDocuments(f),/M3 Q5 complete given:/);});
if(process.argv.includes('--actual-native'))test('actual Q5 original GIVEN/UI/ancestor and issued vector25 resolver remains mandatory',async()=>{
 const before=git(['status','--porcelain','--untracked-files=all']).toString();
 const {verifyM3Q5ExistingVector}=await import('../tools/4slot/m3-e052-q5-complete-given-continuity.mjs');
 const C=(await import('../tools/4slot/m3-e052-q5-complete-given-continuity.cjs')).default;
 const result=verifyM3Q5ExistingVector(root,C.FILE);
 assert.equal(result.status,'PASS');assert.equal(result.questionUid,C.UID);assert.equal(result.sourceOrdinal,5);
 assert.equal(result.existingVectorCount,25);assert.equal(result.outside24WholeQuestionsUnchanged,true);
 assert.equal(result.newFourSlotApprovals,0);assert.equal(result.newMathematicalQa,false);assert.equal(result.newMetadataApprovals,0);
 const seen=new Set(result.observed.map(r=>r[0]));for(const p of C.CURRENT_UI_PATHS)assert.ok(seen.has(p),'CURRENT_UI_UNOBSERVED:'+p);
 const f=fixture();for(const ref of [...f.technical.servedFiles,...f.technical.mirroredAssets,...f.technical.studentFontResources])assert.ok(seen.has(ref.path),'CURRENT_RENDER_UNOBSERVED:'+ref.path);
 assert.equal(git(['status','--porcelain','--untracked-files=all']).toString(),before,'ACTUAL_RESOLVER_MUST_BE_READ_ONLY');
});
