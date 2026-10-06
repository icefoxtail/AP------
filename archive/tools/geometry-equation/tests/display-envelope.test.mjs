import test from 'node:test';
import assert from 'node:assert/strict';
import {compareActualDisplayEnvelope,planDisplayEnvelope,qualifyDisplayEnvelope} from '../production/display-envelope.mjs';

const intrinsic={width:384,height:320};
const rect=(width,height)=>({x:20,y:30,width,height});
const profile=(sizeClass,width,height,maxWidth,maxHeight)=>({
  status:'PASS',sizeClass,imageRect:rect(width,height),naturalWidth:intrinsic.width,naturalHeight:intrinsic.height,
  computedStyle:{maxWidth,maxHeight,objectFit:'contain',transform:'none'},transformChain:['none','none','none']
});
const observation=(patch={})=>({
  status:'PASS',synthetic:false,runtime:'playwright-chromium',browserVersion:'Chromium test fixture',
  questionUid:'fixture-exam|1',questionId:1,sourceRef:{path:'archive/exams/test-fixtures/fixture.js',sha256:'sha256:'+'a'.repeat(64)},
  qBoxRect:rect(820,460),solutionMetaRect:rect(790,370),
  profiles:[profile('small',126,105,'48%','105px'),profile('medium',174,145,'72%','145px'),profile('large',216,180,'92%','180px'),profile('full',384,320,'100%','none')],
  ...patch
});
const labelInventory=[{id:'A-name',fontPx:20},{id:'axis-x',fontPx:20}];
const audits=(minimumByClass,patches={})=>['small','medium','large','full'].map(sizeClass=>({
  sizeClass,layoutStatus:'PASS',graphRequired:false,topologyRequired:false,strokeStatus:'PASS',strokeMeasurements:[{id:'axis-x',strokeWidthCssPx:1}],
  labelMeasurements:labelInventory.map(label=>({id:label.id,finalViewportCssFontPx:minimumByClass[sizeClass]})),
  ...(patches[sizeClass]||{})
}));
const planned=()=>planDisplayEnvelope({questionUid:'fixture-exam|1',requestedSizeClass:'medium',intrinsicSvg:intrinsic,candidateLabelInventory:labelInventory,observation:observation(),archiveEngineSha256:'a'.repeat(64)});

test('preflight is provisional; final per-label browser metrics qualify each profile independently',()=>{
  const plan=planned();
  assert.equal(plan.status,'PLANNED');
  assert.equal(plan.plannedSizeClass,'large');
  assert.equal(plan.profiles.find(v=>v.sizeClass==='medium').supportStatus,'NOT_AUDITED');
  const envelope=qualifyDisplayEnvelope(plan,audits({small:6.56,medium:9.06,large:11.25,full:20}));
  assert.equal(envelope.status,'PASS');
  assert.equal(envelope.sizeClass,'large');
  assert.equal(envelope.policyChange.from,'medium');
  assert.equal(envelope.policyChange.to,'large');
  assert.equal(envelope.expectedMinimumCssFontPx,11.25);
  assert.equal(envelope.profiles.find(v=>v.sizeClass==='medium').supportStatus,'FAIL');
  assert.ok(envelope.profiles.find(v=>v.sizeClass==='medium').finalAudit.errors.includes('FONT_FLOOR_FAIL'));
  assert.equal(envelope.selectedProfile.computedStyle.maxHeight,'180px');
});

test('an adequate requested full profile is preserved and does not qualify medium',()=>{
  const plan=planDisplayEnvelope({questionUid:'fixture-exam|1',requestedSizeClass:'full',intrinsicSvg:intrinsic,candidateLabelInventory:labelInventory,observation:observation(),archiveEngineSha256:'b'.repeat(64)});
  const envelope=qualifyDisplayEnvelope(plan,audits({small:6.56,medium:9.06,large:11.25,full:20}));
  assert.equal(envelope.sizeClass,'full');
  assert.equal(envelope.policyChange,null);
  assert.equal(envelope.selectedProfile.computedStyle.maxHeight,'none');
  assert.equal(envelope.profiles.find(v=>v.sizeClass==='medium').supportStatus,'FAIL');
});

test('all failing final profile audits return unsupported without forcing full',()=>{
  const envelope=qualifyDisplayEnvelope(planned(),audits({small:8,medium:8.5,large:9,full:10}));
  assert.equal(envelope.status,'UNSUPPORTED_DISPLAY_ENVELOPE');
  assert.equal(envelope.sizeClass,null);
  assert.ok(envelope.errors.includes('NO_PROFILE_PASSED_FINAL_CANDIDATE_AUDITS'));
});

test('profile support requires the exact final candidate label inventory and topology/stroke gates',()=>{
  const plan=planned();
  const profileAudits=audits({small:6.56,medium:9.06,large:11.25,full:20},{large:{labelMeasurements:[{id:'A-name',finalViewportCssFontPx:11.25}],graphRequired:true,graphStatus:'FAIL',topologyRequired:true,topologyStatus:'FAIL'}});
  const envelope=qualifyDisplayEnvelope(plan,profileAudits);
  assert.notEqual(envelope.sizeClass,'large');
  assert.equal(envelope.profiles.find(v=>v.sizeClass==='large').supportStatus,'FAIL');
  assert.ok(envelope.profiles.find(v=>v.sizeClass==='large').finalAudit.errors.includes('FINAL_LABEL_INVENTORY_MISMATCH'));
  assert.ok(envelope.profiles.find(v=>v.sizeClass==='large').finalAudit.errors.includes('GRAPH_PROFILE_AUDIT_FAIL'));
  assert.ok(envelope.profiles.find(v=>v.sizeClass==='large').finalAudit.errors.includes('TOPOLOGY_PROFILE_AUDIT_FAIL'));
});

test('non-Archive or synthetic measurements cannot authorize a display envelope',()=>{
  assert.throws(()=>planDisplayEnvelope({questionUid:'fixture-exam|1',intrinsicSvg:intrinsic,candidateLabelInventory:labelInventory,observation:observation({synthetic:true})}),/ACTUAL_ARCHIVE_ENVELOPE_OBSERVATION_REQUIRED/);
  assert.throws(()=>planDisplayEnvelope({questionUid:'fixture-exam|1',intrinsicSvg:intrinsic,candidateLabelInventory:labelInventory,observation:observation({runtime:'fixture'})}),/ACTUAL_ARCHIVE_ENVELOPE_OBSERVATION_REQUIRED/);
});

test('final loaded image rect, container width, size class and computed policy must match preflight',()=>{
  const envelope=qualifyDisplayEnvelope(planned(),audits({small:6.56,medium:9.06,large:11.25,full:20}));
  const actual={status:'PASS',questionUid:'fixture-exam|1',sizeClass:'large',qBoxRect:rect(820,470),solutionMetaRect:rect(790,430),imageRect:rect(216,180),computedStyle:{maxWidth:'92%',maxHeight:'180px',objectFit:'contain',transform:'none'},minimumCssFontPx:11.25};
  assert.equal(compareActualDisplayEnvelope(envelope,actual).status,'PASS');
  const mutated={...actual,sizeClass:'full',imageRect:rect(384,320),computedStyle:{...actual.computedStyle,maxHeight:'none'}};
  const rejected=compareActualDisplayEnvelope(envelope,mutated);
  assert.equal(rejected.status,'FAIL');
  assert.ok(rejected.errors.includes('ACTUAL_DISPLAY_SIZE_CLASS_MISMATCH'));
  assert.ok(rejected.errors.includes('ACTUAL_DISPLAY_WIDTH_DIFFERS_FROM_PREFLIGHT'));
  assert.ok(rejected.errors.includes('ACTUAL_DISPLAY_POLICY_DIFFERS_FROM_PREFLIGHT:maxHeight'));
});
