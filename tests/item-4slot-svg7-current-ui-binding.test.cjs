'use strict';
// Closed current-capture evidence tests. Read authenticated repository objects;
// never evaluate question banks, write sources or issue registration authority.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..');
const ui=require('../tools/4slot/existing-registered-vector-ui.cjs');
const svg7=require('../tools/4slot/existing-registered-vector-svg7-ui.cjs');
const {projectTableRows}=require('../tools/4slot/existing-registered-vector-svg7-derived-continuity.cjs');
const {parseIndex,selectEntries}=require('../tools/4slot/existing-vector-svg-index-continuity.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const CAPTURE='a57c51f633c937da15d1fac766631b413e02bd55';
const MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json',SVG='archive/data/svg-accessibility-index.js';
const immutable=new Map(),current=new Map();
function git(args){
  const env={...process.env};delete env.GIT_NO_LAZY_FETCH;
  return execFileSync('git',['-C',ROOT,...args],{env,maxBuffer:128*1024*1024,timeout:120000,stdio:['ignore','pipe','pipe']});
}
function safeFile(rel){
  assert.equal(typeof rel,'string');assert.ok(!rel.startsWith('/')&&!rel.includes('\\')&&!rel.split('/').some(p=>!p||p==='.'||p==='..'));
  let p=ROOT;
  for(const part of rel.split('/')){p=path.join(p,part);assert.equal(fs.lstatSync(p).isSymbolicLink(),false);}
  assert.equal(fs.statSync(p).isFile(),true);return p;
}
function readRef(ref){
  assert.match(ref.commit,/^[a-f0-9]{40}$/);assert.match(ref.gitBlobSha1,/^[a-f0-9]{40}$/);
  const key=ref.commit+':'+ref.path;
  if(!immutable.has(key))immutable.set(key,git(['show',key]));
  const b=immutable.get(key);assert.equal(b.length,ref.bytes);assert.equal(hash(b),ref.sha256);assert.equal(blob(b),ref.gitBlobSha1);
  return b;
}
// 현재 파일이 캡처 당시 바이트와 같으면 그대로 쓴다. 시험지·그림·글꼴이 그 뒤 정상 수정되어 달라졌으면 실패시키지 않고
// 캡처 당시 바이트를 검증기에 넘겨 검증 논리만 계속 시험한다(2026-11-18 사용자 결정: 계속 바뀌는 원본의 현재 값을 과거 기록과
// 비교해 실패시키지 않는다). 검증기 자신의 현재 바이트 대조(CURRENT_REF_BYTES)는 운영 도구 코드라 이 테스트에서 건드리지 않는다.
function liveRef(ref){
  const b=fs.readFileSync(safeFile(ref.path));
  if(b.length===ref.bytes&&hash(b)===ref.sha256&&blob(b)===ref.gitBlobSha1)return b;
  return readRef(ref);
}
// 생성 자료(메타·신원표)의 선택 은행 75행이 캡처 뒤 정상 수정(유형 판정 등록 등)으로 바뀌었으면 실패시키지 않고 캡처 당시
// 파일을 현재 파일로 넘겨 검증 논리만 시험한다(2026-11-18 사용자 결정: 계속 바뀌는 자료의 현재 값을 과거 기록과 비교해 실패시키지 않는다).
// 변조 음성 사례는 이 값을 바탕으로 행을 바꾸므로 그대로 fail closed 한다. 검증기 자신의 대조(CURRENT_WHOLE_75_TABLE_ROWS_CHANGED)는 운영 도구 코드라 건드리지 않았다.
const TABLE_SCHEMA={[MD]:'archive-question-metadata-v1',[ID]:'question-identity-map-v1'};
function currentFile(p){
  assert.ok([MD,ID,SVG].includes(p),'only exact generated data paths');
  if(!current.has(p)){
    let b=fs.readFileSync(safeFile(p));
    if(TABLE_SCHEMA[p]){
      const ref=p===ID?original.identityRef:original.servedFiles.find(r=>r.path===p);
      const old=readRef(ref);
      if(stable(projectTableRows(b,TABLE_SCHEMA[p]).rows)!==stable(projectTableRows(old,TABLE_SCHEMA[p]).rows))b=old;
    }
    current.set(p,b);
  }
  return current.get(p);
}
const technical=JSON.parse(readRef(svg7.CURRENT_TECHNICAL_REF)),visual=JSON.parse(readRef(svg7.CURRENT_VISUAL_REF));
const original=JSON.parse(readRef(technical.rawTechnicalRef));
const first=technical.results[0];
function invoke(options={}){
  const row=options.row||first;
  return ui.verifyUi({technical,visual,technicalRef:svg7.CURRENT_TECHNICAL_REF,readRef,readLiveRef:liveRef,readCurrentFile:currentFile,
    questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,surface:row.surface,sourceRef:row.sourceRef,assetRefs:row.assetRefs,...options});
}
const badBytes=b=>Buffer.concat([b,Buffer.from('\n')]);
const tables=new Map();
function rowsFor(p){
  if(!tables.has(p))tables.set(p,projectTableRows(currentFile(p),p===MD?'archive-question-metadata-v1':'question-identity-map-v1').rows);
  return structuredClone(tables.get(p));
}
function tableBuffer(p,rows){return Buffer.from(JSON.stringify({schemaVersion:p===MD?'archive-question-metadata-v1':'question-identity-map-v1',records:rows}));}
function withTable(p,mutate){
  const rows=rowsFor(p);mutate(rows);
  const bytes=tableBuffer(p,rows);
  return {readCurrentFile:rel=>rel===p?bytes:currentFile(rel)};
}
const SVG_PREFIX="(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze(";
const SVG_SUFFIX=");\n}(typeof window !== 'undefined' ? window : globalThis));\n";
function withSvg(mutate){
  const doc=JSON.parse(JSON.stringify(parseIndex(currentFile(SVG))));mutate(doc);
  const bytes=Buffer.from(SVG_PREFIX+JSON.stringify(doc)+SVG_SUFFIX);
  return {readCurrentFile:p=>p===SVG?bytes:currentFile(p)};
}

test('sealed current technical dispatch verifies seven retained display bindings and all sixteen original tiles',()=>{
  const subjects=new Map(technical.results.map(row=>[row.questionUid,row]));assert.equal(subjects.size,7);
  let cases=0,tiles=0;
  for(const row of subjects.values()){
    const result=invoke({row});cases+=result.logicalCases;tiles+=result.originalTiles;
    assert.equal(result.currentCaptureBinding.newSemanticApproval,0);assert.equal(result.currentCaptureBinding.newFourSlotVector,0);
    assert.equal(result.currentCaptureBinding.wholeMetadataRows,75);assert.equal(result.currentCaptureBinding.wholeIdentityRows,75);
    assert.equal(result.currentCaptureBinding.selectedIdentityRows,7);
  }
  assert.equal(cases,14);assert.equal(tiles,16);
});
test('per-case font inventories retain their actual resource sets, including the thirty-resource mobile case',()=>{
  const fonts=new Map(original.studentFontResources.map(row=>[row.resourceId,row]));
  assert.equal(fonts.size,37);const counts=new Set();
  for(const row of technical.results){
    const raw=original.results.find(r=>r.questionUid===row.questionUid&&r.viewport.name===row.viewport.name);
    const selected=raw.technical.fontResourceIds.map(id=>{assert.ok(fonts.has(id));return fonts.get(id);}).sort((a,b)=>a.resourceId.localeCompare(b.resourceId));
    counts.add(selected.length);assert.equal(row.fonts.responseInventorySha256,hash(stable(selected)));
  }
  assert.deepEqual([...counts].sort((a,b)=>a-b),[30,31,33,35]);
});
test('a forged technical publication commit is rejected',()=>{
  assert.throws(()=>invoke({technicalRef:{...svg7.CURRENT_TECHNICAL_REF,commit:'0'.repeat(40)}}),/CURRENT_PUBLIC_TECHNICAL_REF/);
});
test('old typed generic evidence cannot be substituted for the current closed schema',()=>{
  const old=JSON.parse(readRef(visual.priorTypedTechnicalRef));
  assert.throws(()=>invoke({technical:old}),/TECHNICAL|RESULT|CASE|VISUAL/);
});
test('unknown schema fails closed instead of reaching the legacy or current SVG7 path',()=>{
  assert.throws(()=>invoke({technical:{...technical,schemaVersion:'unknown-current-ui'}}),/TECHNICAL/);
});
test('the historical SVG7 schema continues to enforce its historical sealed ref',()=>{
  assert.throws(()=>invoke({technical:{...technical,schemaVersion:svg7.SCHEMA}}),/PUBLIC_TECHNICAL_REF/);
});
test('current source-only continuity cannot select a different UID or surface',()=>{
  assert.throws(()=>invoke({questionUid:'qid_v1_'+'0'.repeat(64)}),/CURRENT_EXACT_SEVEN_PROBLEMS/);
  assert.throws(()=>invoke({surface:'SOLUTION'}),/CURRENT_EXACT_SEVEN_PROBLEMS/);
});
test('generated current data reader is mandatory',()=>{
  assert.throws(()=>invoke({readCurrentFile:undefined}),/CURRENT_READERS_REQUIRED/);
});
test('raw capture immutable bytes cannot be modified',()=>{
  assert.throws(()=>invoke({readRef:ref=>ref.path===technical.rawTechnicalRef.path?badBytes(readRef(ref)):readRef(ref)}),/PINNED_DOCUMENT_BYTES/);
});
test('a changed original capture object is rejected before acceptance',()=>{
  const changed=structuredClone(technical);changed.results[0].capture.foreignContentHits=1;
  assert.throws(()=>invoke({technical:changed}),/PINNED_DOCUMENT_ARGUMENT/);
});
test('a changed per-case font digest cannot reuse the sealed typed evidence',()=>{
  const changed=structuredClone(technical);changed.results[0].fonts.responseInventorySha256='0'.repeat(64);
  assert.throws(()=>invoke({technical:changed}),/PINNED_DOCUMENT_ARGUMENT/);
});
test('the old visual itself cannot replace the new current decision binding',()=>{
  assert.throws(()=>invoke({visual:JSON.parse(readRef(visual.priorVisualRef))}),/PINNED_DOCUMENT_ARGUMENT/);
});
test('visual reuse does not grant a new semantic approval or remove a legacy debt',()=>{
  const approved=structuredClone(visual);approved.newSemanticApproval=1;
  assert.throws(()=>invoke({visual:approved}),/PINNED_DOCUMENT_ARGUMENT/);
  const removed=structuredClone(visual);removed.reuseScope.additionalLegacyAuthorityHoldsPreserved=[];
  assert.throws(()=>invoke({visual:removed}),/PINNED_DOCUMENT_ARGUMENT/);
});
test('a forged independent equivalence document is rejected',()=>{
  assert.throws(()=>invoke({readRef:ref=>ref.path===visual.independentEquivalenceRef.path?badBytes(readRef(ref)):readRef(ref)}),/PINNED_DOCUMENT_BYTES/);
});
// Render engine files may change after the capture, so their current bytes are not compared (user decision 2026-11-18).
test('changed live renderer engine bytes are not compared with the captured bytes',()=>{
  const ref=original.servedFiles.find(r=>r.path==='archive/engine.html');assert.ok(ref);
  invoke({readLiveRef:r=>r.path===ref.path?badBytes(readRef(r)):liveRef(r)});
});
for(const [name,ref] of [
  ['font resource',original.studentFontResources.find(r=>r.kind==='FONT')],
  ['selected source',original.items[0].sourceRef],
  ['selected problem asset',original.items[0].assetRef],
  ['capture implementation',original.captureHelperRef]
])test('changed live '+name+' bytes fail closed',()=>{
  assert.ok(ref);
  assert.throws(()=>invoke({readLiveRef:r=>r.path===ref.path?badBytes(readRef(r)):liveRef(r)}),/CURRENT_REF_BYTES/);
});
test('the sixteen actual original PNG files must remain present and byte exact',()=>{
  const last=technical.screenshotFileRefs.at(-1).ref;
  assert.throws(()=>invoke({readRef:ref=>{if(ref.path===last.path)throw Error('ORIGINAL_PNG_UNAVAILABLE');return readRef(ref);}}),/ORIGINAL_PNG_UNAVAILABLE/);
  assert.throws(()=>invoke({readRef:ref=>ref.path===last.path?badBytes(readRef(ref)):readRef(ref)}),/CURRENT_REF_BYTES/);
});
test('current selected metadata drift is rejected',()=>{
  assert.throws(()=>invoke(withTable(MD,rows=>{rows.find(row=>row.questionUid===first.questionUid).__tampered=true;})),/CURRENT_WHOLE_75_TABLE_ROWS_CHANGED/);
});
test('a nonselected item in the same three source banks cannot drift',()=>{
  const selected=new Set(technical.items.map(item=>item.questionUid));
  assert.throws(()=>invoke(withTable(MD,rows=>{rows.find(row=>!selected.has(row.questionUid)).__tampered=true;})),/CURRENT_WHOLE_75_TABLE_ROWS_CHANGED/);
});
test('current selected identity drift is rejected',()=>{
  assert.throws(()=>invoke(withTable(ID,rows=>{rows.find(row=>row.questionUid===first.questionUid).__tampered=true;})),/CURRENT_WHOLE_75_TABLE_ROWS_CHANGED/);
});
test('a selected UID duplicated elsewhere in the global identity table is rejected',()=>{
  assert.throws(()=>invoke(withTable(ID,rows=>{rows.push({...rows.find(row=>row.questionUid===first.questionUid),sourceArchiveFile:'original/middle/m2/1mid/__synthetic_unrelated__.js'});})),/GLOBAL_UID_DUPLICATE/);
});
test('a missing source-bank identity row is rejected',()=>{
  assert.throws(()=>invoke(withTable(ID,rows=>{rows.pop();})),/WHOLE_BANK_DENOMINATOR/);
});
test('unrelated global metadata additions preserve the complete selected bank rows',()=>{
  const result=invoke(withTable(MD,rows=>rows.push({questionUid:'qid_v1_'+'0'.repeat(64),sourceArchiveFile:'original/middle/m2/1mid/__synthetic_unrelated__.js',sourceOrdinal:1})));
  assert.equal(result.logicalCases,2);
});
test('generated files use only their named current-data path while code and assets stay live exact',()=>{
  const visited=new Set();
  const result=invoke({readCurrentFile:p=>{visited.add(p);return currentFile(p);},readLiveRef:ref=>{
    assert.ok(![MD,ID,SVG].includes(ref.path),'generated file must use scoped comparison');return liveRef(ref);
  }});
  assert.equal(result.logicalCases,2);assert.deepEqual([...visited].sort(),[MD,ID,SVG].sort());
});
test('unrelated SVG generator header changes do not replace the selected consumed footprint',()=>{
  const result=invoke(withSvg(doc=>{doc.manifestSha256='sha256:'+'0'.repeat(64);}));
  assert.equal(result.logicalCases,2);
});
test('a newly consumed selected SVG problem record is rejected',()=>{
  assert.throws(()=>invoke(withSvg(doc=>{
    assert.ok(doc.records.length);const added={...doc.records[0],assetRef:technical.items[0].assetRef.path.slice('archive/'.length),visualRole:'problem'};
    doc.records.push(added);
  })),/CONSUMED_SVG_RECORDS_CHANGED|RUNTIME_LOOKUP_REJECTED/);
});
test('a newly consumed selected SVG solution fallback record is rejected',()=>{
  assert.throws(()=>invoke(withSvg(doc=>{
    assert.ok(doc.records.length);const added={...doc.records[0],assetRef:technical.items[0].assetRef.path.slice('archive/'.length),visualRole:'solution'};
    doc.records.push(added);
  })),/CONSUMED_SVG_RECORDS_CHANGED|RUNTIME_LOOKUP_REJECTED/);
});
test('duplicate global SVG lookup keys are rejected even outside the selected seven assets',()=>{
  assert.throws(()=>invoke(withSvg(doc=>{assert.ok(doc.records.length);doc.records.push({...doc.records[0]});})),/RUNTIME_LOOKUP_REJECTED/);
});
test('executing or malformed SVG wrappers are rejected',()=>{
  assert.throws(()=>invoke({readCurrentFile:p=>p===SVG?Buffer.concat([currentFile(p),Buffer.from('globalThis.UNSAFE=true;')]):currentFile(p)}),/WRAPPER/);
});
test('the caller must bind the actual captured selected source and asset refs',()=>{
  assert.throws(()=>invoke({sourceRef:{...first.sourceRef,commit:'0'.repeat(40)}}),/CURRENT_SELECTED_INPUT_BINDING/);
  assert.throws(()=>invoke({assetRefs:[]}),/CURRENT_SELECTED_INPUT_BINDING/);
});
const OLD_SIDECARS=[
  {
    "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6.json",
    "gitBlobSha1": "5f997e86a464ac67216987dc7e56d7d8b7bc572c",
    "bytes": 9482
  },
  {
    "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569.json",
    "gitBlobSha1": "d48c040c8eea1fec49287703a37b5b74a61128d5",
    "bytes": 12609
  },
  {
    "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec.json",
    "gitBlobSha1": "a7069890d93453194b7f172971344c66c02cc027",
    "bytes": 11939
  },
  {
    "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad.json",
    "gitBlobSha1": "77ba241dcc1c1937501e1b234415e7b52e668903",
    "bytes": 11941
  },
  {
    "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637.json",
    "gitBlobSha1": "556908100f09236210831b8d86ce8b2a2faf37c3",
    "bytes": 11938
  },
  {
    "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5.json",
    "gitBlobSha1": "d3cf525329e1c767b867179651187937d56b5186",
    "bytes": 9485
  },
  {
    "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd.json",
    "gitBlobSha1": "cc6274ec9ba5dccb85f115d793aba4547824fb62",
    "bytes": 8874
  }
];
test('all seven sidecars change only technical/visual refs and their exact source-byte checkout bridge',()=>{
  for(const pin of OLD_SIDECARS){
    const oldRaw=git(['show',CAPTURE+':'+pin.path]);assert.equal(oldRaw.length,pin.bytes);assert.equal(blob(oldRaw),pin.gitBlobSha1);
    const before=JSON.parse(oldRaw),after=JSON.parse(fs.readFileSync(safeFile(pin.path)));
    assert.equal(after.newSemanticApproval,0);assert.equal(after.newFourSlotVector,0);
    assert.deepEqual(after.nativeAuthority,before.nativeAuthority);assert.equal(after.vectorSha256,before.vectorSha256);
    assert.deepEqual(after.svg7EmbeddedChoiceContinuity,before.svg7EmbeddedChoiceContinuity);
    assert.deepEqual(after.svg7InlineFigureContinuity,before.svg7InlineFigureContinuity);
    const oldReview=before.displayReviews[0],newReview=after.displayReviews[0];
    assert.deepEqual(newReview.independentRef,oldReview.independentRef);
    assert.deepEqual(newReview.technicalRef,svg7.CURRENT_TECHNICAL_REF);assert.deepEqual(newReview.visualRef,svg7.CURRENT_VISUAL_REF);
    const claim=newReview.uiCheckoutContinuity;
    assert.equal(claim.schemaVersion,'archive-existing-vector-ui-checkout-continuity-v1');
    assert.equal(claim.questionUid,after.questionUid);assert.equal(claim.sourceOrdinal,after.sourceOrdinal);
    assert.equal(claim.surface,'PROBLEM');assert.equal(claim.capturedSourceRef.commit,CAPTURE);
    assert.deepEqual(claim.currentSourceRef,after.currentSourceRef);assert.deepEqual(claim.currentAssetRefs,after.currentAssets);
    const noCommit=ref=>{const {commit,...rest}=ref;return rest;};
    assert.deepEqual(noCommit(claim.capturedSourceRef),noCommit(after.currentSourceRef));
    assert.deepEqual(claim.capturedAssetRefs.map(noCommit),after.currentAssets.map(noCommit));
    delete newReview.technicalRef;delete newReview.visualRef;delete newReview.uiCheckoutContinuity;
    delete oldReview.technicalRef;delete oldReview.visualRef;
    assert.deepEqual(after,before);
  }
});
