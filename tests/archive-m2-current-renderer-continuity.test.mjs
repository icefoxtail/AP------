import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {m2RendererFixture,sha,stable} from './helpers/m2-current-renderer-fixture.mjs';
import {validateM2CurrentRendererContinuity} from '../archive/tools/meta-foundation/reviewed-m2-current-renderer-continuity.mjs';
import {validateReviewedSourceReassessment} from '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';
import {buildReviewedSourceBinding,reviewedSourceBindingItems} from '../archive/tools/meta-foundation/reviewed-source-binding.mjs';

for(const layout of ['grid','subjective-2up'])test(`M2 ${layout} presentation uses the exact frozen candidate and still replays retained authority`,t=>{
  const f=m2RendererFixture(t,{layout}),before=stable(f.current),out=validateM2CurrentRendererContinuity(f.args);
  assert.deepEqual(out.semanticQuestion,f.prefigure);assert.equal(stable(f.current),before);
  assert.equal(out.proof.suppliesMetadataValues,false);assert.equal(out.proof.newMetadataApprovals,0);
  const proof=validateReviewedSourceReassessment(f.args);
  assert.deepEqual(proof.m2RendererContinuity,out.proof);assert.equal(proof.retainedNativeFields.inferredValues,false);
  assert.equal(proof.rendererContinuity,undefined);assert.equal(proof.studentPayloadSha256,out.proof.currentStudentPayloadSha256);
  assert.equal(reviewedSourceBindingItems(f.request).length,1);
});

const mutations=[
 ['M3 renderer opt-in mixed in',f=>{f.patch.sourceReview.rendererProof={};}],
 ['source-only preservation mixed in',f=>{f.request.approval.sourceRebind={};}],
 ['new registry definition',f=>{f.request.registryChanges.push({});}],
 ['no original semantic authority',f=>{delete f.patch.sourceReview.retainedFields;}],
 ['both original semantic authorities',f=>{f.patch.sourceReview.proposalFinalization={schemaVersion:'archive-native-proposal-finalization-v3'};}],
 ['changed approved PT after',f=>{f.patch.after.problemTypeKey='PT_CHANGED';f.args.final.problemTypeKey='PT_CHANGED';}],
 ['changed retention field selection',f=>{f.patch.sourceReview.retainedFields.fields.pop();}],
 ['live answer mutation',f=>{f.current.answer='b';}],
 ['live source namespace mutation',f=>{f.current.courseKey='M3-2';}],
 ['live image array',f=>{f.current.image=[f.current.image];}],
 ['live image size object',f=>{f.current.imageSize={width:600};}],
 ['live metadata insertion',f=>{f.current.qaStatus='PASS';}],
 ['wrong source blob',f=>{f.request.expectedSourceBlobSha1='a'.repeat(40);}],
 ['missing item witness dependency',f=>{f.patch.evidenceRefs=f.patch.evidenceRefs.filter(x=>x.path!==f.witnessPath);}],
 ['missing approval old-image dependency',f=>{f.request.approval.evidenceRefs=f.request.approval.evidenceRefs.filter(x=>x.path!==f.oldAsset);}],
 ['missing frozen request bytes',f=>{fs.unlinkSync(path.join(f.root,f.frozenCopy));}],
 ['changed live current SVG bytes',f=>{fs.appendFileSync(path.join(f.root,f.newAsset),' ');}],
 ['changed live solution SVG bytes',f=>{fs.appendFileSync(path.join(f.root,f.solutionAsset),' ');}],
 ['changed live witness bytes',f=>{fs.appendFileSync(path.join(f.root,f.witnessPath),' ');}],
];
for(const [label,mutate]of mutations)test('M2 renderer rejects '+label,t=>{const f=m2RendererFixture(t);mutate(f);assert.throws(()=>validateReviewedSourceReassessment(f.args));});
for(const [label,mutate]of [
 ['native M3 schema',f=>{f.args.native.review.schemaVersion='m3-s2-complete-semantic-review-v1';}],
 ['native unresolved decision',f=>{f.args.row.rpmDecision='HOLD';}],
])test('M2 renderer direct boundary rejects '+label,t=>{const f=m2RendererFixture(t);mutate(f);assert.throws(()=>validateM2CurrentRendererContinuity(f.args),/settled M2/);});

const witnessMutations=[
 ['same native reviewer',f=>{f.witness.reviewer='native-author';}],
 ['same transport author',f=>{f.witness.reviewer='transport-author';}],
 ['new math approval claim',f=>{f.witness.newMathematicalQa=true;}],
 ['new metadata approval claim',f=>{f.witness.newMetadataApprovals=1;}],
 ['unknown QA property',f=>{f.witness.qaPassed=true;}],
 ['missing direct observation',f=>{f.witnessRow.visualChecks.noNewInferenceOrAnswerHint=false;}],
 ['literal all-markings identity assertion',f=>{delete f.witnessRow.visualChecks.givenGeometryRelationsPreserved;f.witnessRow.visualChecks.geometryAndMarkingsUnchanged=true;}],
 ['missing presentation change observation',f=>{delete f.witnessRow.observed.presentationChanges;}],
 ['wrong UID',f=>{f.witnessRow.questionUid='other';}],
 ['wrong ordinal',f=>{f.witnessRow.sourceOrdinal=2;}],
 ['wrong denominator',f=>{f.witnessRow.expectedQuestionCount=2;}],
 ['wrong native item hash',f=>{f.witnessRow.nativeItemSha256='a'.repeat(64);}],
 ['missing frozen metadata patch hash',f=>{f.witnessRow.metadataPatchSha256='a'.repeat(64);}],
 ['frozen request selected at another commit',f=>{f.witnessRow.frozenRequestRef.commit=f.witnessRow.currentSourceRef.commit;}],
 ['current snapshot selected as prefigure',f=>{f.witnessRow.prefigureSourceRef=f.witnessRow.currentSourceRef;}],
 ['incomplete old asset inventory',f=>{f.witnessRow.beforeAssets.pop();}],
 ['incomplete current asset inventory',f=>{f.witnessRow.currentAssets.pop();}],
 ['duplicated current asset inventory',f=>{f.witnessRow.currentAssets.push(f.witnessRow.currentAssets[0]);}],
 ['false field delta hash',f=>{f.witnessRow.fieldDeltaHashes.image.after='a'.repeat(64);}],
];
for(const[label,mutate]of witnessMutations)test('immutable reauthored witness still rejects '+label,t=>{const f=m2RendererFixture(t);mutate(f);f.reseal();assert.throws(()=>validateReviewedSourceReassessment(f.args));});

for(const extraDelta of [{answer:'b'},{content:'different stem'},{solution:'different reasoning'},{problemTypeKey:'PT_CHANGED'},
 {imageSize:'tall'},{imageAlt:{value:'untyped'}},{layoutTag:'arbitrary'}])test('truthful current snapshots cannot expand the four-field transition '+Object.keys(extraDelta)[0],t=>{
  const f=m2RendererFixture(t,{extraDelta});assert.throws(()=>validateReviewedSourceReassessment(f.args));
});
for(const value of ['<svg><script>1</script></svg>','<svg><foreignObject>nested</foreignObject></svg>',
 '<svg><image href="data:image/png;base64,AA=="/></svg>','<svg><use href="https://example.invalid/x"/></svg>',
 '<svg><path style="fill:url(other.svg#x)"/></svg>'])test('truthful current SVG witness rejects nested or external dependencies '+value.slice(0,24),t=>{
  const f=m2RendererFixture(t,{currentSvg:value});assert.throws(()=>validateReviewedSourceReassessment(f.args));
});

test('removing only the opt-in restores the original strict student-payload rejection',t=>{
  const f=m2RendererFixture(t);delete f.patch.sourceReview.m2RendererProof;
  assert.throws(()=>validateReviewedSourceReassessment(f.args),/current student payload differs/);
});
test('the renderer witness does not replace the existing retained ACTIVE authority validator',t=>{
  const f=m2RendererFixture(t);f.tables.tpl.get('TPL_EXISTING').parentProblemTypeKey='OTHER';
  assert.throws(()=>validateReviewedSourceReassessment(f.args),/retained|ACTIVE/);
});
test('durable source binding seals the original request and requires the M2 proof in its repair',t=>{
  const f=m2RendererFixture(t),proof=validateReviewedSourceReassessment(f.args),input={request:f.request,requestId:f.request.requestId,
    requestSha256:sha(stable(f.request)),sourceArchiveFile:f.request.sourceArchiveFile,sourceBlobSha1:f.request.expectedSourceBlobSha1,
    sourceRawSha256:sha(fs.readFileSync(path.join(f.root,f.sourcePath))),scope:'PARTIAL_UIDS',expectedQuestionCount:1,partialUidCount:1,
    fingerprintRepairs:[{questionUid:'uid1',sourceOrdinal:1,sourceReview:proof}]};
  const result=buildReviewedSourceBinding(input);assert.equal(result.records.length,1);
  assert.deepEqual(result.requestSnapshot.items[0].sourceReview.m2RendererProof,f.patch.sourceReview.m2RendererProof);
  delete input.fingerprintRepairs[0].sourceReview.m2RendererContinuity;
  assert.throws(()=>buildReviewedSourceBinding(input),/exact selected fingerprint repair/);
});

for(const field of ['content','answer','solution'])test('metadata axis cannot restore a different production student '+field,t=>{
  const f=m2RendererFixture(t,{productionStudentDelta:{[field]:'different production '+field}});
  assert.throws(()=>validateM2CurrentRendererContinuity(f.args),/metadata axis/);
});
test('metadata axis cannot append a field absent from the frozen approved after',t=>{
  const f=m2RendererFixture(t,{unapprovedMetadataAppend:{newQaClaim:'unapproved'}});
  assert.throws(()=>validateM2CurrentRendererContinuity(f.args),/metadata axis/);
});
