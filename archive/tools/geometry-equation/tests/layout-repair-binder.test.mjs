import test from 'node:test';
import assert from 'node:assert/strict';
import {bytesSha,objectSha} from '../../pipeline-core/canonical.mjs';
import {RepairBudget} from '../production/repair-budget.mjs';
import {bindMeasuredOwnerSafeLabelRepair,MEASURED_OWNER_REPAIR_GAPS,OWNER_POINT_DISTANCE_TOLERANCE_PX2} from '../production/layout-repair.mjs';
import {auditMeasuredOwnerSafeLabelRepair} from '../production/layout-repair-audit.mjs';
import {dependency} from '../production/dependencies.mjs';

function fixture(){
  const labelId='A-coordinate',ownerId='A',width=30,height=10,sourceAt=[120,50],selected={direction:'W',gap:64,box:{x:26,y:45,width,height}};
  const pointMarkers=[{id:'B',geometry:[190,50,2]},{id:'A',geometry:[120,50,2]}];
  const fragmentSvg='<svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 30 10" id="fragment-A-coordinate" data-owner="A" data-fact-role="GIVEN"><path d="M0 0L2 2"/></svg>';
  const fragment={labelId,owner:ownerId,factRole:'GIVEN',svg:fragmentSvg,fragmentSha256:bytesSha(Buffer.from(fragmentSvg)),intrinsic:{width,height,baseline:8}};
  const repair={schemaVersion:'MEASURED_OWNER_SAFE_LABEL_RELOCATION_v1',failureClass:'OWNER_LABEL_NO_DEFAULT_CANDIDATE',labelId,labelKind:'COORDINATE_LABEL',ownerId,factRole:'GIVEN',sourceAt,ownerPoint:[120,50,2],competingPoints:[{id:'B',geometry:[190,50,2]}],measuredFragmentSha256:fragment.fragmentSha256,measuredBox:{width,height},defaultSearch:{directions:['N','NE','E','SE','S','SW','W','NW'],gaps:[12,8,20,32,48]},supportedExtendedGaps:[...MEASURED_OWNER_REPAIR_GAPS],selected,ownerPolicy:'EXACT_POINT_VORONOI_BOX_CORNERS',tolerancePxSquared:OWNER_POINT_DISTANCE_TOLERANCE_PX2};
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100"><g id="A-coordinate" data-label-kind="COORDINATE_LABEL" data-priority="1" data-font-px="12" data-owner="A" data-fragment-sha="${fragment.fragmentSha256}" transform="translate(26 45)">${fragmentSvg}</g></svg>`;
  const bytes=Buffer.from(svg),sourceRef={path:'source.js',bytes:10,sha256:'sha256:'+'1'.repeat(64)},solutionRef={path:'solution.txt',bytes:8,sha256:'sha256:'+'2'.repeat(64)};
  const input={identity:{questionUid:'qid_v2_fixture',visualAssetKey:'asset-fixture'},sourceRef,solutionRef,planSha256:objectSha('plan'),sourceConditionsSha256:objectSha([]),sourceFactsSha256:objectSha({facts:1}),labelInventorySha256:objectSha({labels:[labelId]}),baseMathSvgSha256:objectSha('base-svg'),measurementRef:{path:'measure.json',bytes:9,sha256:objectSha('measurement')},policyRefsSha256:objectSha({archive:'engine-ref'}),profilePolicySha256:objectSha({sizeClass:'medium'}),requestedSizeClass:'medium',repair,expectedLabel:{id:labelId,kind:'COORDINATE_LABEL',target:ownerId,at:sourceAt},pointMarkers,measurement:[width,height],fragment,candidateSvgBytes:bytes};
  return{input,bytes,pointMarkers};
}
const bind=f=>bindMeasuredOwnerSafeLabelRepair(f.input);
function bindCandidateBytes(binding,bytes){
  const result={...binding,candidateSvgSha256:bytesSha(bytes),repairOutput:{...binding.repairOutput,candidateSvgSha256:bytesSha(bytes)}};
  result.repairOutputSha256=objectSha(result.repairOutput);return result;
}

test('measured owner-safe relocation binder closes its placement and source witnesses',()=>{
  const f=fixture(),binding=bind(f);
  assert.equal(binding.repairInput.selected.box.width,f.input.repair.measuredBox.width);
  assert.equal(binding.repairInput.selected.box.height,f.input.repair.measuredBox.height);
  assert.equal(binding.repairOutput.candidateSvgSha256,bytesSha(f.bytes));
  const budget=new RepairBudget(),first=budget.record('LAYOUT',binding.repairInputSha256,'MEASURED_OWNER_SAFE_LABEL_RELOCATION',binding.repairOutputSha256);
  const replay=budget.record('LAYOUT',binding.repairInputSha256,'MEASURED_OWNER_SAFE_LABEL_RELOCATION',binding.repairOutputSha256);
  assert.equal(first.replayed,false);assert.equal(replay.replayed,true);assert.equal(budget.ledger.length,1);
});

test('binder rejects tampered witness fields, box geometry, owner lookup, tolerance and extended-gap policy',()=>{
  const cases=[
    ['extra-proof-field',f=>{f.input.repair.debug=true;},/ACTION_INVALID/],
    ['wrong-selected-box-size',f=>{f.input.repair.selected.box.width=31;},/PLACEMENT_MISMATCH/],
    ['wrong-selected-origin',f=>{f.input.repair.selected.box.x=27;},/PLACEMENT_MISMATCH/],
    ['wrong-direction-gap-pair',f=>{f.input.repair.selected.direction='E';},/PLACEMENT_MISMATCH/],
    ['owner-point-not-exact-lookup',f=>{f.input.repair.ownerPoint=[121,50,2];},/EXACT_OWNER_LOOKUP/],
    ['missing-competitor',f=>{f.input.repair.competingPoints=[];},/COMPETITOR_LOOKUP/],
    ['altered-extended-gap-set',f=>{f.input.repair.supportedExtendedGaps=[64,80,96];},/EXTENDED_GAP_POLICY/],
    ['altered-owner-tolerance',f=>{f.input.repair.tolerancePxSquared=1e-5;},/OWNER_POLICY_INVALID/],
    ['default-search-does-not-match-source-label',f=>{f.input.expectedLabel.gaps=[12,20,32,48];},/DEFAULT_SEARCH_SOURCE_MISMATCH/],
    ['extra-default-search-proof-field',f=>{f.input.repair.defaultSearch.hidden=[1];},/DEFAULT_SEARCH_INVALID/],
    ['measurement-differs-from-box',f=>{f.input.measurement=[30.1,10];},/MEASUREMENT_MISMATCH/],
    ['wrong-fragment-fact-role',f=>{f.input.fragment.factRole='CONCLUSION';},/FRAGMENT_MISMATCH/],
  ];
  for(const [name,mutate,error] of cases){const f=fixture();mutate(f);assert.throws(()=>bind(f),error,name);}
});

test('actual Chromium audit measures final SVG label and fragment bounds against the bound action',async()=>{
  const f=fixture(),binding=bind(f),browser=await dependency('playwright').chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage();
    const audit=await auditMeasuredOwnerSafeLabelRepair({binding,candidateSvgBytes:f.bytes,pointMarkers:f.pointMarkers,page});
    console.log('MEASURED_OWNER_LAYOUT_ACTUAL_CHROMIUM_AUDIT='+JSON.stringify(audit));
    assert.equal(audit.status,'PASS');assert.equal(audit.ownerCornerRelation,'PASS');
    assert.deepEqual(audit.observedFragmentViewportBoundsIntrinsicUnits,binding.repairInput.selected.box);
    const tampered={...binding,repairOutput:{...binding.repairOutput,selected:{...binding.repairOutput.selected,box:{...binding.repairOutput.selected.box,x:27}}}};
    tampered.repairOutputSha256=objectSha(tampered.repairOutput);
    await assert.rejects(()=>auditMeasuredOwnerSafeLabelRepair({binding:tampered,candidateSvgBytes:f.bytes,pointMarkers:f.pointMarkers,page}),/OUTPUT_SCHEMA_INVALID/);
    const alteredPolicy={...binding,repairInput:{...binding.repairInput,labelPolicy:{...binding.repairInput.labelPolicy,gaps:[12,20,32,48]}}};
    alteredPolicy.repairInputSha256=objectSha(alteredPolicy.repairInput);
    alteredPolicy.repairOutput={...alteredPolicy.repairOutput,repairInputSha256:alteredPolicy.repairInputSha256};
    alteredPolicy.repairOutputSha256=objectSha(alteredPolicy.repairOutput);
    await assert.rejects(()=>auditMeasuredOwnerSafeLabelRepair({binding:alteredPolicy,candidateSvgBytes:f.bytes,pointMarkers:f.pointMarkers,page}),/LABEL_POLICY_INVALID/);
    const svgBytes=Buffer.from(f.bytes.toString().replace('translate(26 45)','translate(27 45)'));
    await assert.rejects(()=>auditMeasuredOwnerSafeLabelRepair({binding,candidateSvgBytes:svgBytes,pointMarkers:f.pointMarkers,page}),/CANDIDATE_SHA_MISMATCH/);
    const shiftedSvg=bindCandidateBytes(binding,svgBytes);
    await assert.rejects(()=>auditMeasuredOwnerSafeLabelRepair({binding:shiftedSvg,candidateSvgBytes:svgBytes,pointMarkers:f.pointMarkers,page}),/FINAL_SVG_BOUNDS_MISMATCH/);
    const ownerSvg=Buffer.from(f.bytes.toString().replace('data-owner="A"','data-owner="B"'));
    await assert.rejects(()=>auditMeasuredOwnerSafeLabelRepair({binding:bindCandidateBytes(binding,ownerSvg),candidateSvgBytes:ownerSvg,pointMarkers:f.pointMarkers,page}),/FRAGMENT_OWNER_MISMATCH/);
  }finally{await browser.close();}
});
