'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const UI=require('../tools/4slot/existing-registered-vector-ui.cjs');
const F=require('./fixtures/archive-m2s1-text3-fragment-capture.json');
const root=path.resolve(__dirname,'..');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
// The physical capture is the original Actions observation. This test's
// technical/visual envelopes and reader are synthetic and issue no approval.
function input(change=()=>{}) {
  const row=structuredClone(F.row);row.fonts={ready:true,expectedFamilyLoaded:true,responseInventorySha256:'f'.repeat(64)};
  const technical={schemaVersion:UI.TECHNICAL_SCHEMA,status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',executionOwner:'GITHUB_ACTIONS_SUPPORTED_CHROME',checkoutCommit:F.checkoutCommit,sourceOverlayCount:0,domWrites:0,cssWrites:0,expectedLogicalCases:1,completedLogicalCases:1,screenshotArtifactCount:3,screenshotArtifacts:row.screenshots.map(({tileIndex,...r})=>r),results:[row]};
  change({row,technical});
  const raw=Buffer.from(JSON.stringify(technical));
  const technicalRef={commit:'a'.repeat(40),path:'tests/fixtures/synthetic-fragment-technical.json',gitBlobSha1:crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+raw.length+'\0'),raw])).digest('hex'),sha256:sha(raw),bytes:raw.length};
  const visual={schemaVersion:UI.VISUAL_SCHEMA,reviewer:'SYNTHETIC_CONTRACT_TEST_NOT_APPROVAL',decision:UI.DECISION,technicalRef,newMathQa:0,newSemanticApproval:0,newFourSlotVector:0,records:[{questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,surface:row.surface,viewport:row.viewport,captureSha256:sha(stable(row.capture)),decision:UI.DECISION,screenshots:row.screenshots.map(s=>({...s,decision:UI.DECISION}))}]};
  const seen=[];
  const readRef=ref=>{
    seen.push(ref.path);
    if(ref.path===technicalRef.path)return raw;
    const b=fs.readFileSync(path.join(root,ref.path));
    assert.equal(b.length,ref.bytes,'TEST_IMMUTABLE_BYTES');assert.equal(sha(b),ref.sha256,'TEST_IMMUTABLE_RAW');
    assert.equal(crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex'),ref.gitBlobSha1,'TEST_IMMUTABLE_OID');
    return b;
  };
  return {technical,visual,technicalRef,readRef,questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,surface:row.surface,sourceRef:row.sourceRef,assetRefs:row.assetRefs,seen};
}
function tile(c,i,change){change(c.tiles[i]);let n=0;for(const f of c.fragments)for(const t of f.tiles){if(n++===i)change(t);}}
test('original E051 primary and continuation pass the exact closed consumer',()=>{
  const x=input();assert.deepEqual(UI.verifyUi(x),{logicalCases:1,originalTiles:3});
  for(const p of ['tools/m2s1-text3-solution-fragments.cjs','tests/fixtures/archive-m2s1-text-solution3-ui.json'])assert(x.seen.includes(p));
});
const bad=[
  ['foreign selected UID',({row})=>row.questionUid='qid_v1_'+'9'.repeat(64),/TEXT3_FRAGMENT_SCOPE/],
  ['wrong ordinal',({row})=>row.sourceOrdinal=14,/TEXT3_FRAGMENT_SCOPE/],
  ['problem surface',({row})=>{row.surface='PROBLEM';row.mode='exam';row.viewport={name:'desktop',width:1365,height:1000};},/TEXT3_FRAGMENT_SCOPE/],
  ['helper raw hash is not the reviewed producer',({row})=>row.capture.policy.helperRef.sha256='9'.repeat(64),/TEXT3_FRAGMENT_SCOPE/],
  ['helper OID is not the reviewed producer',({row})=>row.capture.policy.helperRef.gitBlobSha1='9'.repeat(40),/TEXT3_FRAGMENT_SCOPE/],
  ['helper checkout differs',({row})=>row.capture.policy.helperRef.commit='9'.repeat(40),/TEXT3_FRAGMENT_SCOPE/],
  ['manifest checkout differs',({row})=>row.capture.policy.manifestRef.commit='9'.repeat(40),/UI_E051_ONE_CHECKOUT/],
  ['end scroll detached from last tile',({row})=>row.capture.fragments[0].scrollAfter.y++,/TEXT3_FRAGMENT_SCROLL_CHAIN/],
  ['continuation scroll detached from previous shell',({row})=>row.capture.fragments[1].scrollBefore.y++,/TEXT3_FRAGMENT_SCROLL_CHAIN/],
  ['zero operations with a moved viewport',({row})=>tile(row.capture,0,t=>t.scrollOperations=0),/TEXT3_FRAGMENT_SCROLL_CHAIN/],
  ['unknown tile scroll field',({row})=>tile(row.capture,0,t=>t.scroll.extra=true),/SCROLL_KEYS/],
  ['negative tile scroll',({row})=>tile(row.capture,0,t=>{t.scroll.x=-1;t.clip.x++;}),/SCROLL/],
  ['single hit sample',({row})=>tile(row.capture,0,t=>t.hitTestSamples=1),/TEXT3_FRAGMENT_SCROLL_CHAIN/],
  ['subpixel document drift beyond floating addition',({row})=>tile(row.capture,0,t=>t.clip.y+=0.001),/TEXT3_FRAGMENT_DOCUMENT_GEOMETRY/],
  ['subpixel tile height drift',({row})=>tile(row.capture,1,t=>t.clip.height+=0.001),/TEXT3_FRAGMENT_DOCUMENT_GEOMETRY/],
  ['missing continuation',({row})=>row.capture.fragments.pop(),/UI_E051_CAPTURE_SCOPE/],
  ['continuation image contamination',({row})=>row.capture.fragments[1].roles.selectedImage={count:1,visible:1},/UI_E051_REQUIRED_ROLE/],
  ['truncated original chunk total',({row})=>row.capture.expectedChunkCount--,/UI_E051_COMPLETE_CHUNK_COUNT/],
  ['stitched screenshot claim',({row})=>row.capture.compositeImageCreated=true,/UI_E051_CAPTURE_INVARIANTS/],
];
for(const [name,change,error]of bad)test('closed consumer rejects '+name,()=>assert.throws(()=>UI.verifyUi(input(change)),error));
test('immutable reader returning unchecked bytes is rejected',()=>{
  const x=input(),original=x.readRef;x.readRef=ref=>ref.path.endsWith('solution-fragments.cjs')?Buffer.from('unverified'):original(ref);
  assert.throws(()=>UI.verifyUi(x),/TEXT3_FRAGMENT_REF/);
});
test('technical success alone cannot replace independent original tile review',()=>{
  const x=input();x.visual.records[0].screenshots.pop();assert.throws(()=>UI.verifyUi(x),/VISUAL_TILE_INVENTORY/);
});
test('independent review remains bound to the complete unchanged capture',()=>{
  const x=input();x.visual.records[0].captureSha256='9'.repeat(64);assert.throws(()=>UI.verifyUi(x),/VISUAL_CASE_BINDING/);
});
