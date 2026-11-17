'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {verifyUi}=require('../tools/4slot/existing-registered-vector-ui.cjs');
const svg7=require('../tools/4slot/existing-registered-vector-svg7-ui.cjs');
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-svg7-existing-vector-ui.json')));
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
function setup(){
  const technical=JSON.parse(fixture.technicalRawUtf8),visual=JSON.parse(fixture.visualRawUtf8),known=new Set(),reads=[],live=[];
  const refKeys=['commit','path','gitBlobSha1','sha256','bytes'];
  function visit(x){if(Array.isArray(x))x.forEach(visit);else if(x&&typeof x==='object'){
    if(refKeys.every(k=>Object.hasOwn(x,k)))known.add(stable(Object.fromEntries(refKeys.map(k=>[k,x[k]]))));
    Object.values(x).forEach(visit);
  }}
  visit(technical);[svg7.TECHNICAL_REF,svg7.VISUAL_REF,svg7.MANIFEST_REF].forEach(visit);
  // This is the immutable-reader boundary. Its production caller separately
  // verifies commit:path, raw digest, size, live bytes, and the prior authority.
  const readRef=ref=>{
    assert(known.has(stable(ref)),'unrecognized immutable reference');reads.push(ref);
    if(stable(ref)===stable(svg7.TECHNICAL_REF))return Buffer.from(fixture.technicalRawUtf8);
    if(stable(ref)===stable(svg7.VISUAL_REF))return Buffer.from(fixture.visualRawUtf8);
    if(stable(ref)===stable(svg7.MANIFEST_REF))return Buffer.from(fixture.manifestRawUtf8);
    return Buffer.from('verified by the existing immutable reader');
  };
  const readLiveRef=ref=>{live.push(ref);return readRef(ref);};
  const input=item=>({technical,visual,technicalRef:{...svg7.TECHNICAL_REF},readRef,readLiveRef,
    questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,surface:'PROBLEM',sourceRef:item.sourceRef,assetRefs:[item.assetRef]});
  return {technical,visual,known,reads,live,input};
}
for(const key of ['E037-Q3','E037-Q15','E045-Q15','E045-Q24','E048-Q11','E048-Q13','E048-Q24']){
  test('actual sealed original SVG7 evidence accepts only the selected '+key,()=>{
    const f=setup(),item=f.technical.items.find(x=>x.key===key),out=verifyUi(f.input(item));
    const rows=f.technical.results.filter(x=>x.questionUid===item.questionUid);
    assert.deepEqual(out,{logicalCases:2,originalTiles:rows.reduce((n,x)=>n+x.screenshots.length,0)});
    assert(f.live.some(x=>x.path==='archive/engine.html'));
    assert(f.live.some(x=>x.path.endsWith('.woff2')));
    assert(!f.live.some(x=>x.path.startsWith('archive/exams/')));
    assert(!f.live.some(x=>x.path==='archive/data/question_metadata.json'));
  });
}
test('a source outside the exact seven and a different ordinal both fail closed',()=>{
  const f=setup(),x=f.input(f.technical.items[0]);
  assert.throws(()=>verifyUi({...x,questionUid:'qid_v1_'+'0'.repeat(64)}),/EXACT_SEVEN_PROBLEMS/);
  assert.throws(()=>verifyUi({...x,sourceOrdinal:x.sourceOrdinal+1}),/EXACT_SEVEN_PROBLEMS/);
});
test('solution capture cannot enter the public problem profile',()=>{
  const f=setup();assert.throws(()=>verifyUi({...f.input(f.technical.items[0]),surface:'SOLUTION'}),/EXACT_SEVEN_PROBLEMS/);
});
test('historical publication commit cannot be rebound even with the same digest',()=>{
  const f=setup(),x=f.input(f.technical.items[0]);x.technicalRef.commit='0'.repeat(40);
  assert.throws(()=>verifyUi(x),/PUBLIC_TECHNICAL_REF/);
});
test('a newly resealed or modified technical argument is not the observed immutable document',()=>{
  const f=setup();f.technical.results[0].capture.coverage.complete=false;
  assert.throws(()=>verifyUi(f.input(f.technical.items[0])),/PINNED_DOCUMENT_ARGUMENT/);
});
test('a modified root visual verdict is rejected before any approval effect',()=>{
  const f=setup();f.visual.observations[0].verdict='ACCEPT';
  assert.throws(()=>verifyUi(f.input(f.technical.items[0])),/PINNED_DOCUMENT_ARGUMENT/);
});
test('incorrect exact raw capsule bytes are rejected',()=>{
  const f=setup(),x=f.input(f.technical.items[0]);x.readRef=()=>Buffer.from('{}');
  assert.throws(()=>verifyUi(x),/PINNED_DOCUMENT_BYTES/);
});
test('current selected source commit and bytes remain exact',()=>{
  const f=setup(),x=f.input(f.technical.items[0]);
  assert.throws(()=>verifyUi({...x,sourceRef:{...x.sourceRef,commit:'0'.repeat(40)}}),/CURRENT_SELECTED_BINDING/);
  assert.throws(()=>verifyUi({...x,sourceRef:{...x.sourceRef,sha256:'0'.repeat(64)}}),/CURRENT_SELECTED_BINDING/);
});
test('Q24 previous SVG version or an additional asset is rejected',()=>{
  const f=setup(),x=f.input(f.technical.items.find(x=>x.key==='E045-Q24'));
  assert.throws(()=>verifyUi({...x,assetRefs:[{...x.assetRefs[0],path:x.assetRefs[0].path.replace('-r2.svg','-r1.svg')}]}),/CURRENT_SELECTED_BINDING/);
  assert.throws(()=>verifyUi({...x,assetRefs:[...x.assetRefs,x.assetRefs[0]]}),/CURRENT_SELECTED_BINDING/);
});
test('a missing live verifier is not an implicit historical-source exception',()=>{
  const f=setup(),x=f.input(f.technical.items[0]);delete x.readLiveRef;
  assert.throws(()=>verifyUi(x),/READERS_REQUIRED/);
});
test('live engine and font drift propagate from the unchanged current-file reader',()=>{
  for(const target of ['archive/engine.html','.woff2']){
    const f=setup(),x=f.input(f.technical.items[0]);x.readLiveRef=ref=>{
      if(ref.path===target||ref.path.endsWith(target))throw Error('LIVE_BYTES_CHANGED');
      return f.input(f.technical.items[0]).readLiveRef(ref);
    };
    assert.throws(()=>verifyUi(x),/LIVE_BYTES_CHANGED/);
  }
});
test('unknown technical schema retains the ordinary closed-schema rejection',()=>{
  const f=setup();f.technical.schemaVersion='archive-m2s1-svg7-problem-ui-preview-v2';
  assert.throws(()=>verifyUi(f.input(f.technical.items[0])),/EXISTING_VECTOR_UI_TECHNICAL/);
});
