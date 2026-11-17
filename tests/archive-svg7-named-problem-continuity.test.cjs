'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../tools/4slot/existing-registered-vector-continuity.cjs');
const P=require('../tools/4slot/existing-registered-vector-svg7-ui.cjs').embeddedChoiceContinuity;
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-svg7-named-problem-continuity.json')));
const ui=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-svg7-existing-vector-ui.json')));
const stable=C.stable;
function setup(subject=fixture.case){
  const x=structuredClone(subject),known=new Set(),reads=[],live=[];
  const docs=new Map([[stable(x.claim.technicalRef),ui.technicalRawUtf8],[stable(x.claim.visualRef),ui.visualRawUtf8],
    [stable(x.claim.staticRef),fixture.staticRawUtf8],[stable(x.claim.originalObservationRef),fixture.originalRawUtf8]]);
  const visit=v=>{if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object'){
    if(['commit','path','gitBlobSha1','sha256','bytes'].every(k=>Object.hasOwn(v,k)))known.add(stable(v));
    Object.values(v).forEach(visit);
  }};
  visit(x);for(const raw of docs.values())visit(JSON.parse(raw));
  // Source and asset verification remains the original immutable Git reader's
  // responsibility. These opaque boundary results never stand in for a source.
  x.readRef=ref=>{assert(known.has(stable(ref)),'unexpected immutable reference');reads.push(ref);
    return Buffer.from(docs.get(stable(ref))||'already verified opaque Git input');};
  x.readLiveRef=ref=>{live.push(ref);return x.readRef(ref);};
  return {x,reads,live,docs};
}
test('the exact observed E045 Q15 absent-to-true flag is a separate closed claim',()=>{
  const f=setup(),out=P.verify(f.x);
  assert.equal(out.questionUid,P.UID);assert.equal(out.field,'choicesEmbeddedInImage');
  assert.equal(out.newFourSlotVectors,0);assert.equal(out.newNativeApprovals,0);
  assert(f.reads.some(r=>stable(r)===stable(f.x.claim.originalObservationRef)));
  assert(f.live.some(r=>stable(r)===stable(f.x.currentSourceRef)));
});
for(const value of [undefined,null])test('own '+String(value)+' cannot enable the opt-in',()=>{
  const f=setup();f.x.claim=value;assert.throws(()=>P.verify(f.x),/CLAIM_KEYS/);
});
test('an unknown claim key is not ignored',()=>{
  const f=setup();f.x.claim.unrecognized=true;assert.throws(()=>P.verify(f.x),/CLAIM_KEYS/);
});
test('another UID and another ordinal are rejected',()=>{
  for(const change of [{questionUid:'qid_v1_'+'0'.repeat(64)},{sourceOrdinal:24}]){
    const f=setup();Object.assign(f.x,change);assert.throws(()=>P.verify(f.x),/EXACT_SCOPE_AND_PINS/);
  }
});
for(const role of ['native','prior','current'])test('a resealed '+role+' whole question does not inherit the observed claim',()=>{
  const f=setup();f.x.boundState[role].wholeQuestionSha256='0'.repeat(64);
  assert.throws(()=>P.verify(f.x),/WHOLE_QUESTION_OR_CHOICES/);
});
for(const role of ['native','prior','current'])test('the exact '+role+' source authority is required',()=>{
  const f=setup();f.x[role+'SourceRef'].commit='0'.repeat(40);
  assert.throws(()=>P.verify(f.x),/SOURCE_BINDING/);
});
test('caller resealing both the claim and source does not change pinned authority',()=>{
  const f=setup();f.x.claim.currentSourceRef.sha256='0'.repeat(64);f.x.currentSourceRef.sha256='0'.repeat(64);
  assert.throws(()=>P.verify(f.x),/EXACT_SCOPE_AND_PINS/);
});
for(const role of ['native','prior'])test(role+' own false is not the original absent flag',()=>{
  const f=setup();Object.assign(f.x.boundState[role],{flagOwn:true,flagValue:false});
  assert.throws(()=>P.verify(f.x),/ABSENT_TO_TRUE_ONLY/);
});
test('current absent, false, or a truthy string cannot replace own true',()=>{
  for(const [flagOwn,flagValue] of [[false,null],[true,false],[true,'true']]){
    const f=setup();Object.assign(f.x.boundState.current,{flagOwn,flagValue});
    assert.throws(()=>P.verify(f.x),/ABSENT_TO_TRUE_ONLY/);
  }
});
test('changed choice count, contents, order, or emptiness is rejected',()=>{
  for(const patch of [{choicesCount:4},{choicesSha256:'0'.repeat(64)},{choicesNonempty:false}]){
    const f=setup();Object.assign(f.x.boundState.current,patch);
    assert.throws(()=>P.verify(f.x),/WHOLE_QUESTION_OR_CHOICES/);
  }
  const a=P.state({choices:['a','b']},{choices:['a','b']},{choices:['b','a']});
  assert.notEqual(a.prior.choicesSha256,a.current.choicesSha256);
});
test('changed original PNG and changed current SVG fail their distinct bindings',()=>{
  for(const key of ['priorProblemAssets','currentProblemAssets']){
    const f=setup();f.x[key][0].sha256='0'.repeat(64);
    assert.throws(()=>P.verify(f.x),/PRIOR_PROBLEM_ASSET|STATIC_NEW_ASSET/);
  }
});
test('asset omission or an additional problem asset cannot inherit the claim',()=>{
  for(const key of ['priorProblemAssets','currentProblemAssets'])for(const count of [0,2]){
    const f=setup();f.x[key]=count?Array(count).fill(f.x[key][0]):[];
    assert.throws(()=>P.verify(f.x),/PROBLEM_ASSET_INVENTORY/);
  }
});
test('all immutable original/static/actual observations remain byte-pinned',()=>{
  for(const key of ['technicalRef','visualRef','staticRef','originalObservationRef']){
    const f=setup();f.docs.set(stable(f.x.claim[key]),'{}');
    assert.throws(()=>P.verify(f.x),/IMMUTABLE_BYTES/);
  }
});
test('current source read failure propagates without a historical fallback',()=>{
  const f=setup();f.x.readLiveRef=()=>{throw Error('CURRENT_SOURCE_BYTES_CHANGED');};
  assert.throws(()=>P.verify(f.x),/CURRENT_SOURCE_BYTES_CHANGED/);
});
test('missing source reader or live reader fails closed',()=>{
  for(const key of ['readRef','readLiveRef']){const f=setup();delete f.x[key];assert.throws(()=>P.verify(f.x),/IMMUTABLE_READERS/);}
});
test('the changed flag stays in the witnessed binding with the complete named claim',()=>{
  const claim=P.claim(),doc={questionUid:P.UID,sourceOrdinal:15,sourceQuestionNo:'15',sourceQuestionCount:24,
    priorSourceRef:claim.priorSourceRef,currentSourceRef:claim.currentSourceRef,inlineEdits:[],
    vectorSha256:'1'.repeat(64),priorMetadataSha256:'2'.repeat(64),priorIdentitySha256:'3'.repeat(64),
    [P.OPTION]:claim};
  const prior={content:'synthetic'},current={content:'synthetic',choicesEmbeddedInImage:true};
  const changes=C.ownChanges(prior,current),binding=C.displayBinding(doc,prior,current,changes,'PROBLEM',[],[]);
  assert.deepEqual(binding.changedFields.map(r=>r.field),[P.FIELD]);assert.deepEqual(binding[P.OPTION],claim);
  delete doc[P.OPTION];const ordinary=C.displayBinding(doc,prior,current,changes,'PROBLEM',[],[]);
  assert.deepEqual(ordinary.changedFields,[]);assert(!Object.hasOwn(ordinary,P.OPTION));
  assert.notEqual(C.sha(stable(binding)),C.sha(stable(ordinary)));
});

const I=require('../tools/4slot/existing-registered-vector-svg7-ui.cjs').inlineFigureContinuity;
for(const subject of fixture.inlineCases)test('the actual '+subject.claim.key+' inline-to-file transition keeps the original own svg',()=>{
  const f=setup(subject),out=I.verify(f.x);
  assert.equal(out.priorRepresentation,'OWN_INLINE_SVG');assert.equal(out.priorFileAssetCount,0);
  assert.equal(out.currentRepresentation,'FILE_IMG_WITH_ORIGINAL_INLINE_SVG_RETAINED');
  assert.equal(out.currentFileAssetCount,1);assert.equal(out.newNativeApprovals,0);
  assert(f.live.some(r=>r.path===f.x.currentSourceRef.path));
  assert(f.live.some(r=>r.path===f.x.currentProblemAssets[0].path));
});
for(const v of [undefined,null])test('inline own '+String(v)+' is rejected',()=>{
  const f=setup(fixture.inlineCases[0]);f.x.claim=v;assert.throws(()=>I.verify(f.x),/CLAIM_KEYS/);
});
test('inline authority cannot be assigned to another subject or a different ordinal',()=>{
  const f=setup(fixture.inlineCases[0]);f.x.questionUid=P.UID;assert.throws(()=>I.verify(f.x),/EXACT_THREE_SUBJECTS/);
  const g=setup(fixture.inlineCases[0]);g.x.sourceOrdinal++;assert.throws(()=>I.verify(g.x),/EXACT_SCOPE_AND_PINS/);
});
test('inline missing-figure state is not relabeled as an existing inline original',()=>{
  for(const role of ['native','prior','current']){
    const f=setup(fixture.inlineCases[0]);f.x.boundState[role].inlineSvgOwn=false;
    assert.throws(()=>I.verify(f.x),/ORIGINAL_INLINE_SVG_RETAINED/);
  }
});
test('inline svg changes, deletion, extra SVG, or text replacement are rejected',()=>{
  for(const patch of [{inlineSvgOwnFieldSha256:'0'.repeat(64)},{inlineSvgUtf8Bytes:0},{inlineSvgElementCount:2},{inlineSvgType:'object'}]){
    const f=setup(fixture.inlineCases[1]);Object.assign(f.x.boundState.current,patch);
    assert.throws(()=>I.verify(f.x),/ORIGINAL_INLINE_SVG_RETAINED/);
  }
});
for(const role of ['native','prior','current'])test('inline '+role+' whole question remains pinned beyond the display fields',()=>{
  const f=setup(fixture.inlineCases[2]);f.x.boundState[role].wholeQuestionSha256='0'.repeat(64);
  assert.throws(()=>I.verify(f.x),/WHOLE_QUESTION/);
});
test('inline source rebind to another commit or resealed claim fails',()=>{
  const f=setup(fixture.inlineCases[0]);f.x.priorSourceRef.commit='0'.repeat(40);assert.throws(()=>I.verify(f.x),/SOURCE_BINDING/);
  const g=setup(fixture.inlineCases[0]);g.x.claim.priorSourceRef.commit='0'.repeat(40);g.x.priorSourceRef.commit='0'.repeat(40);
  assert.throws(()=>I.verify(g.x),/EXACT_SCOPE_AND_PINS/);
});
test('prior asset zero stays zero, current file count stays one, and the current SVG stays exact',()=>{
  for(const mutate of [x=>x.priorProblemAssets.push(x.currentProblemAssets[0]),x=>x.currentProblemAssets.pop(),
    x=>x.currentProblemAssets.push(x.currentProblemAssets[0]),x=>x.currentProblemAssets[0].sha256='0'.repeat(64)]){
    const f=setup(fixture.inlineCases[0]);mutate(f.x);assert.throws(()=>I.verify(f.x),/EXACT_INLINE_TO_FILE_INVENTORY/);
  }
});
test('inline original, static, technical and visual bytes remain immutable',()=>{
  for(const key of ['technicalRef','visualRef','staticRef','originalObservationRef']){
    const f=setup(fixture.inlineCases[0]);f.docs.set(stable(f.x.claim[key]),'{}');assert.throws(()=>I.verify(f.x),/IMMUTABLE_BYTES/);
  }
});
test('inline live source or current SVG failures never fall back to historical bytes',()=>{
  for(const suffix of ['.js','.svg']){
    const f=setup(fixture.inlineCases[0]);f.x.readLiveRef=ref=>{if(ref.path.endsWith(suffix))throw Error('LIVE_DRIFT');return f.x.readRef(ref);};
    assert.throws(()=>I.verify(f.x),/LIVE_DRIFT/);
  }
});
test('inline named proof is preserved in the independent binding without a fictitious prior asset',()=>{
  const f=setup(fixture.inlineCases[0]),doc={questionUid:f.x.questionUid,sourceOrdinal:f.x.sourceOrdinal,sourceQuestionNo:'11',sourceQuestionCount:26,
    priorSourceRef:f.x.priorSourceRef,currentSourceRef:f.x.currentSourceRef,inlineEdits:[],[I.OPTION]:f.x.claim};
  const a={content:'synthetic',svg:'<svg/>'},b={...a,content:'synthetic<div><img src="synthetic.svg"></div>'};
  const binding=C.displayBinding(doc,a,b,C.ownChanges(a,b),'PROBLEM',[],f.x.currentProblemAssets);
  assert.deepEqual(binding.priorAssets,[]);assert.deepEqual(binding[I.OPTION],f.x.claim);
  assert.deepEqual(binding.changedFields.map(r=>r.field),['content']);
});
