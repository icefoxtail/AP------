import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {e035Fixture,stable,sha} from './helpers/m2-e035-renderer-fixture.mjs';
import {validateM2E035RendererContinuity,hasImmutableM2E035RendererClaim} from '../archive/tools/meta-foundation/reviewed-m2-e035-renderer-continuity.mjs';
import {validateReviewedSourceReassessment} from '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';

test('synthetic E035 exact source transport replays original v3 consumer and retained primary',t=>{
  const f=e035Fixture(t),before=stable({question:f.current,request:f.request,native:f.args.native}),view=validateM2E035RendererContinuity(f.args);
  assert.deepEqual(view.normalizedQuestion,f.prefigure);
  assert.deepEqual(Object.keys(view.normalizedPatch.sourceReview).sort(),['proposalFinalization','reviewCommit','reviewPath','reviewRef','schemaVersion']);
  assert.equal(view.proof.suppliesMetadataValues,false);
  const proof=validateReviewedSourceReassessment(f.args);
  assert.equal(proof.proposalFinalization.schemaVersion,'archive-native-proposal-finalization-v3');
  assert.deepEqual(proof.proposalFinalization.finalizedFields.crossConceptKeys,['CC_FINAL']);
  assert.equal(proof.m2E035RendererContinuity.currentStudentPayloadSha256,sha(stable(f.args.studentPayload(f.current))));
  assert.equal(proof.m2ProblemRendererContinuity,undefined);
  assert.equal(proof.m2ProviderRendererContinuity,undefined);
  assert.equal(stable({question:f.current,request:f.request,native:f.args.native}),before);
  view.normalizedQuestion.choices.push('Synthetic caller mutation');
  view.normalizedPatch.sourceReview.proposalFinalization.proposalSelections[0].questionUid='changed';
  const again=validateReviewedSourceReassessment(f.args);
  assert.deepEqual(again,proof);
  assert.deepEqual(fs.readFileSync(path.join(f.root,f.sourcePath)),Buffer.concat([f.productionBytes,f.suffix]));
});

test('synthetic native embedded SVG panels and exact mirrored UI transport are retained',t=>{
  const nested='<svg xmlns="http://www.w3.org/2000/svg"><text x="1" y="2" style="font-size:12px">Synthetic</text></svg>';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:image/svg+xml;base64,'+Buffer.from(nested).toString('base64')+'"/></svg>';
  const f=e035Fixture(t,{oldSolutionSvg:svg});
  f.reseal('technical',v=>{
    v.executionOwner='GITHUB_ACTIONS_SUPPORTED_CHROME';
    v.servedFiles=[v.rendererRef];v.mirroredAssets=Object.values(v.currentAssets);
  });
  const proof=validateReviewedSourceReassessment(f.args);
  assert.equal(proof.m2E035RendererContinuity.studentUi.caseCount,4);
  assert.equal(proof.m2E035RendererContinuity.studentUi.originalTileCount,4);
});

test('deleting the E035 opt-in never turns changed presentation into an ordinary native approval',t=>{
  const f=e035Fixture(t);
  delete f.patch.sourceReview.m2E035RendererContinuity;
  assert.equal(validateM2E035RendererContinuity(f.args),null);
  assert.throws(()=>validateReviewedSourceReassessment(f.args),/source reassessment:/);
  assert.equal(hasImmutableM2E035RendererClaim({root:f.root,current:{questionUid:f.patch.questionUid,sourceArchiveFile:f.request.sourceArchiveFile}}),true);
});

for(const [name,mutate] of [
  ['different UID',f=>{f.patch.questionUid='qid_v1_'+'0'.repeat(64);}],
  ['different ordinal',f=>{f.patch.sourceOrdinal=11;}],
  ['different source',f=>{f.request.sourceArchiveFile='original/middle/m2/2final/other.js';}],
  ['different full denominator',f=>{f.request.expectedQuestionCount=20;}],
  ['definition ADD consumer confusion',f=>{f.request.registryChanges=[{path:'synthetic',after:{}}];}],
  ['older finalization schema',f=>{f.patch.sourceReview.proposalFinalization.schemaVersion='archive-native-proposal-finalization-v1';}],
  ['mixed provider opt-in',f=>{f.patch.sourceReview.m2ProviderCurrentRendererContinuity={schemaVersion:'synthetic'};}],
])test('E035 rejects '+name+' before issuing a renderer comparison view',t=>{
  const f=e035Fixture(t);mutate(f);
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/exclusive one-UID E035 v3 consumer scope required/);
});

test('original before identity approved-after and finalization are immutable independent of new hashes',t=>{
  const f=e035Fixture(t),cases=[
    [()=>{f.patch.before.level='changed';},()=>{f.patch.before.level=f.metadata.level;}],
    [()=>{f.patch.identityBefore.sourceFingerprint='changed';},()=>{f.patch.identityBefore.sourceFingerprint=f.metadata.sourceFingerprint;}],
    [()=>{f.patch.after.courseKey='M2-1';},()=>{f.patch.after.courseKey='M2-2';}],
    [()=>{f.patch.sourceReview.proposalFinalization.proposalSelections[0].proposalId='changed';},()=>{f.patch.sourceReview.proposalFinalization.proposalSelections[0].proposalId='B-E035-CC-CENTROID';}],
  ];
  for(const [mutate,restore] of cases){mutate();assert.throws(()=>validateM2E035RendererContinuity(f.args),/original request, before, identity or approved after changed/);restore();}
  assert.ok(validateM2E035RendererContinuity(f.args));
});

test('removing or duplicating an original approval reference is rejected',t=>{
  const f=e035Fixture(t),prior=structuredClone(f.request.approval.evidenceRefs),native=f.nativeRef;
  f.request.approval.evidenceRefs=prior.filter(r=>r.path!==native.path);
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/original approval reference removed or changed/);
  f.request.approval.evidenceRefs=[...prior,native];
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/unique exact evidence references required/);
});

for(const [name,value] of [['content','Changed synthetic stem.'],['choices',['Changed choice']],['answer','Changed answer'],['solution','Changed written solution.']])
test('truthfully rehashed production '+name+' changes cannot pass the presentation-only lane',t=>{
  const f=e035Fixture(t,{productionDelta:{[name]:value}});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/exact seven-field presentation transition required/);
});

test('an extra approved-source metadata field is not inferred from a re-sealed suffix',t=>{
  const f=e035Fixture(t,{metadataAppend:{level:'상'}});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/exact frozen metadata suffix and both complete student payload axes required/);
});

test('literal suffix may not mutate a peer question even when both source hashes are truthful',t=>{
  const f=e035Fixture(t,{suffixExtraStatement:'Object.assign(window.questionBank[0], { imageAlt: "Unapproved peer mutation" });\n'});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/unselected current or original question changed/);
});

test('a semantically identical reserialized source still fails the exact original suffix contract',t=>{
  const f=e035Fixture(t);
  f.put(f.sourcePath,f.source(f.currentBank));const c=f.commit();
  f.transport.currentSourceRef=f.snapshot(c);f.request.expectedSourceBlobSha1=f.transport.currentSourceRef.gitBlobSha1;f.refresh();
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/exact frozen metadata suffix and both complete student payload axes required/);
});

test('extra presentation key and stale field hashes remain rejected despite current source binding',t=>{
  const f=e035Fixture(t,{productionDelta:{solutionImageSize:'wide'}});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/exact seven-field presentation transition required/);
});

test('frozen request live-copy drift and a source symlink cannot inherit immutable authority',t=>{
  const f=e035Fixture(t),copy=f.raw(f.frozenCopy);f.put(f.frozenCopy,Buffer.concat([copy,Buffer.from(' ')]));
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/bound live evidence or source changed/);
  f.put(f.frozenCopy,copy);
  const sourceFile=path.join(f.root,f.sourcePath),bytes=f.raw(f.sourcePath),target=path.join(f.root,'synthetic-source-target.js');
  fs.writeFileSync(target,bytes);fs.unlinkSync(sourceFile);fs.symlinkSync(target,sourceFile);
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/symlink evidence or source/);
});

test('original native hold and current ACTIVE-definition drift survive renderer normalization',t=>{
  const f=e035Fixture(t);validateReviewedSourceReassessment(f.args);
  const original=f.tables.cc.get('CC_FINAL');f.tables.cc.set('CC_FINAL',{...original,definition:'Different current definition'});
  assert.throws(()=>validateReviewedSourceReassessment(f.args),/native proposal finalization:|source reassessment:/);
  f.tables.cc.set('CC_FINAL',original);
  f.patch.after.problemTypeKey='UNAPPROVED_PRIMARY';
  assert.throws(()=>validateReviewedSourceReassessment(f.args),/original request, before, identity or approved after changed/);
});
