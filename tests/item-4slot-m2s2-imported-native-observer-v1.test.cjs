'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {fixture,mod,stable}=require('./helpers/m2s2-imported-native-amendment-fixture.cjs');

// Synthetic v1 documents reproduce the actual role-specific shape only. They
// provide no observation, mathematical judgment, or approval for a real source.
function v1Fixture(t){
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jK1sAAAAASUVORK5CYII=','base64');
  const f=fixture(t,{displayPng:png}),q=f.contact.rows[1];
  const before=f.owner.rows[1].beforeAssets.find(r=>r.path.endsWith('/native-solution.svg'));
  assert(before);
  f.contact.rows.push({...structuredClone(q),role:'solution',beforeAsset:structuredClone(before),contact:{path:'/synthetic/solution-contact.png',sha256:mod.sha('synthetic solution contact')}});
  Object.assign(f.raw,{schemaVersion:'m2-s2-narrow-renderer-observations-v1',taskId:'34c2e1a2-83bf-4be4-9a70-8f5eb30d6d04',reviewedAt:'2026-11-16T03:17:16.754Z',scope:'ACTUAL_BEFORE_CURRENT_RENDERER_AND_UNCHANGED_SOURCE_TEXT_COMPARISON_ONLY',counts:{changedUids:2,contacts:3,addedRendererContacts:0},sourceMutation:0,assetMutation:0,metadataOrRegistryApproval:0,newFullMathematicalQa:0,originalContentHoldsReleased:0,officialRegistration:'NOT_RUN',studentDeployment:'NOT_RUN'});
  f.raw.rows=f.contact.rows.map(r=>({sourceOrdinal:r.sourceOrdinal,questionUid:r.questionUid,role:r.role,beforeAssetSha256:r.beforeAsset.rawSha256,currentAssetSha256:r.currentAsset.rawSha256,contactSha256:r.contact.sha256,actualBeforeAndCurrentImagesViewed:true,currentSourceStemRead:true,actualSvgMarkupAndAccessibilityTextRead:true,...(r.role==='solution'?{currentCaptionAndUnchangedSolutionCompared:true}:{}),decision:'ACCEPT_RENDERER_CONTINUITY_ONLY',observations:'Synthetic role-specific renderer observation for the closed v1 contract.'}));
  f.signOwner();return f;
}
function denied(f,reason=/OWNER_V1_|FIELDS|OWNER_OBSERVATION|OWNER_ACTUAL_READ/){
  const index=mod.build(f.root).index;assert.equal(index.records.length,0,JSON.stringify(index.pending));assert(index.pending.some(r=>reason.test(r.reason)),JSON.stringify(index.pending));
}

test('native amendment accepts exact v1 problem and solution observation roles',t=>{
  const f=v1Fixture(t),index=mod.build(f.root).index;
  assert.equal(index.counts.registered,2,JSON.stringify(index.pending));assert.equal(index.pending.length,1);
  assert.equal(stable(f.data.items[1].registrationHold),stable(f.prior.items[1].registrationHold));
  assert.equal(stable(f.data.items[2]),stable(f.prior.items[2]));
  assert(f.raw.rows.filter(r=>r.role==='problem').every(r=>!Object.hasOwn(r,'currentCaptionAndUnchangedSolutionCompared')));
  assert(f.raw.rows.filter(r=>r.role==='solution').every(r=>r.currentCaptionAndUnchangedSolutionCompared===true));
});
for(const action of ['missing','false'])test('native v1 rejects '+action+' SVG and accessibility reading',t=>{
  const f=v1Fixture(t);if(action==='missing')delete f.raw.rows[0].actualSvgMarkupAndAccessibilityTextRead;else f.raw.rows[0].actualSvgMarkupAndAccessibilityTextRead=false;f.signOwner();denied(f);
});
for(const action of ['missing','false'])test('native v1 rejects '+action+' solution caption and unchanged solution comparison',t=>{
  const f=v1Fixture(t),r=f.raw.rows.find(x=>x.role==='solution');if(action==='missing')delete r.currentCaptionAndUnchangedSolutionCompared;else r.currentCaptionAndUnchangedSolutionCompared=false;f.signOwner();denied(f);
});
test('native v1 cannot replace its actual reading flag with a v2 assertion',t=>{
  const f=v1Fixture(t);delete f.raw.rows[0].actualSvgMarkupAndAccessibilityTextRead;f.raw.rows[0].sourceTextChoicesAnswerSolutionUnchanged=true;f.signOwner();denied(f);
});
for(const field of ['sourceMutation','assetMutation','metadataOrRegistryApproval','newFullMathematicalQa','originalContentHoldsReleased'])test('native v1 rejects nonzero '+field,t=>{
  const f=v1Fixture(t);f.raw[field]=1;f.signOwner();denied(f,/OWNER_V1_SCOPE/);
});
test('native v1 cannot omit its original hold preservation declaration',t=>{
  const f=v1Fixture(t);delete f.raw.originalContentHoldsReleased;f.signOwner();denied(f,/FIELDS/);
});
for(const field of ['changedUids','contacts','addedRendererContacts'])test('native v1 rejects a mismatched '+field+' denominator',t=>{
  const f=v1Fixture(t);f.raw.counts[field]++;f.signOwner();denied(f,/OWNER_V1_SCOPE/);
});
test('native v1 rejects an empty actual observation',t=>{
  const f=v1Fixture(t);f.raw.rows[0].observations=' ';f.signOwner();denied(f,/OWNER_V1_ROW/);
});
test('native v1 rejects a solution comparison flag attached to the wrong role',t=>{
  const f=v1Fixture(t);f.raw.rows[0].currentCaptionAndUnchangedSolutionCompared=true;f.signOwner();denied(f,/FIELDS/);
});
test('native v1 rejects undeclared approval expansion',t=>{
  const f=v1Fixture(t);f.raw.newApproval=true;f.signOwner();denied(f,/FIELDS/);
});
