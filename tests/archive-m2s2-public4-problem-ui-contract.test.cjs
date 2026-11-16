'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../tools/check-m2s2-public4-problem-browser.cjs');
const H=require('../tools/check-reviewed-problem-renderer-browser.cjs');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,C.MANIFEST_PATH)));
const clone=()=>structuredClone(manifest);
test('exact published profile binds four questions in three complete24 banks and eight views',()=>{
 assert.equal(C.requireSealedManifest(manifest),manifest);assert.equal(manifest.items.length,4);
 assert.equal(new Set(manifest.items.map(r=>r.sourcePath)).size,3);assert(manifest.items.every(r=>r.expectedBankCount===24));
 assert.equal(manifest.expectedCases,8);
});
for(const [name,mutate] of [
 ['wrong case count',m=>m.expectedCases=4],
 ['missing target',m=>m.items.pop()],
 ['duplicate UID',m=>m.items[1].questionUid=m.items[0].questionUid],
 ['foreign ordinal',m=>m.items[0].sourceOrdinal=13],
 ['wrong whole bank count',m=>m.items[0].expectedBankCount=23],
 ['source byte drift',m=>m.sourceBindings[0].sha256='0'.repeat(64)],
 ['different viewport',m=>m.viewports[0].height=900],
 ['draft source',m=>m.bindingState=C.DRAFT]
])test('rejects '+name,()=>{const m=clone();mutate(m);assert.throws(()=>C.requireSealedManifest(m));});
test('expected checkout commit is mandatory and exact',()=>{
 const good='a'.repeat(40),bad='b'.repeat(40);
 assert.throws(()=>C.checkoutEvidence(good,{}));
 assert.throws(()=>C.checkoutEvidence(good,{ARCHIVE_M2S2_PUBLIC4_UI_EXPECTED_SHA:bad}));
 assert.equal(C.checkoutEvidence(good,{ARCHIVE_M2S2_PUBLIC4_UI_EXPECTED_SHA:good}).actualCheckoutCommit,good);
});
for(const item of manifest.items)test(item.key+' exact current source and problem-owned fields',()=>{
 const raw=fs.readFileSync(path.join(root,item.sourcePath)),binding=manifest.sourceBindings.find(r=>r.sourcePath===item.sourcePath);
 assert.equal(H.gitBlob(raw),binding.gitBlobSha1);assert.equal(H.sha256(raw),binding.sha256);assert.equal(raw.length,binding.bytes);
 const bank=C.loadQuestions(raw);assert.equal(bank.length,24);const q=bank[item.sourceOrdinal-1];C.assertBoundQuestion(item,q);
 for(const field of ['content','choices','image','imageAlt','imageSize','layoutTag','choicesEmbeddedInImage']){
  const changed=structuredClone(q);changed[field]=field==='choicesEmbeddedInImage'?true:'CONTRACT_MUTATION';
  assert.throws(()=>C.assertBoundQuestion(item,changed),'changed problem field must not capture: '+field);
 }
 const count=item.expectedChoiceCount,frame={schemaVersion:'archive-public4-direct-problem-role-frame-v1',sourceOrdinal:item.sourceOrdinal,
  directChildRoles:['q-num','q-content','q-image-wrap',count?'choices':'answer-box'],imageCount:1,choiceCount:count,
  visibleRequiredRoles:count?4:3,responseSpace:count?'NOT_APPLICABLE':'EMPTY_ORIGINAL_ANSWER_BOX',domWrites:0,cssWrites:0};
 C.assertLegacyRoleFrame(frame,item);
 for(const change of [{imageCount:2},{choiceCount:count+1},{domWrites:1},{cssWrites:1}])assert.throws(()=>C.assertLegacyRoleFrame({...frame,...change},item));
});
test('actual current preflight retains the full identity census and exact static basis',()=>{
 // This test reader checks bytes only. The browser entrypoint separately uses
 // createGitReader at the immutable workflow checkout and records real refs.
 const reader={read:p=>fs.readFileSync(path.join(root,p)),ref(p,b){b=b||this.read(p);return {commit:'UNIT_TEST_BYTES_ONLY',path:p,gitBlobSha1:H.gitBlob(b),sha256:H.sha256(b),bytes:b.length};}};
 const proof=C.preflight(reader,manifest);assert.equal(proof.items.length,4);assert.equal(proof.originalFirstBasisRefs.length,1);
 const broken={...reader,read(p){if(p===C.IDENTITY_PATH){const doc=JSON.parse(reader.read(p));const r=doc.records.find(x=>x.questionUid===manifest.items[0].questionUid);doc.records.push({...r,sourceArchiveFile:'foreign-public-bank.js'});return Buffer.from(JSON.stringify(doc));}return reader.read(p);}};
 assert.throws(()=>C.preflight(broken,manifest),/UI_PUBLIC4_GLOBAL_UID_UNIQUE/);
});
test('no shorter capture inventory can be labeled complete',()=>{
 assert.throws(()=>C.assertCompletedResults([],{items:[]},manifest,[]),/UI_PUBLIC4_EIGHT_LOGICAL_CASES/);
});
